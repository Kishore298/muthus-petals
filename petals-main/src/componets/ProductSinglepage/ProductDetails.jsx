import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./productDetails.css";
import loadingimg from "../../componets/images/7LXw.gif";
import { addCartItem } from "../../localStorageHelpers.jsx";
import Bestseller from "../../componets/Product/slidercard/Bestseller.jsx";

import charcoalManjisthaCombo from "../../assets/charcoal-manjistha-combo.png";
import kuppaimeniCharcoalCombo from "../../assets/kuppaimeni-charcoal-combo.png";
import manjisthaKuppaimeniCombo from "../../assets/manjistha-kuppaimeni-combo.png";
import charcoalSoapImg from "../../assets/charcoal-soap.jpg";
import manjisthaSoapImg from "../../assets/manjistha-soap.jpg";
import kuppaimeniSoapImg from "../../assets/kuppaimeni-soap.jpg";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const SHIPPING_RATES = {
  "chennai": 90, "kancheepuram": 90, "chengalpattu": 90, "tiruvallur": 90,
  "karaikudi": 90, "ramnad": 90, "sivagangai": 90, "virudhunagar": 90,
  "vellore": 90, "ranipet": 90, "tirupattur": 90, "tiruvannamalai": 90,
  "villupuram": 90, "kallakurichi": 90, "cuddalore": 90,
  "salem": 90, "namakkal": 90, "dharmapuri": 90, "krishnagiri": 90,
  "coimbatore": 90, "tiruppur": 90, "erode": 90,
  "the nilgiris": 90, "nilgiris": 90, "ooty": 90,
  "tiruchirappalli": 90, "trichy": 90, "karur": 90, "perambalur": 90, "ariyalur": 90,
  "thanjavur": 90, "tiruvarur": 90, "nagapattinam": 90, "mayiladuthurai": 90, "pudukkottai": 90,
  "madurai": 90, "dindigul": 90, "theni": 90, "sivaganga": 90,
  "ramanathapuram": 90, "thoothukudi": 90, "tuticorin": 90,
  "tirunelveli": 90, "tenkasi": 90, "kanyakumari": 90,
  "kochi": 90, "thiruvananthapuram": 90, "kozhikode": 90,
  "bengaluru": 90, "bangalore": 90, "karnataka": 90,
  "andhra": 90, "hyderabad": 100,
  "mumbai": 110, "delhi": 110, "pune": 110, "kolkata": 110,
  "ahmedabad": 110, "jaipur": 110, "lucknow": 110, "bhopal": 110, "nagpur": 110,
};

const ALL_LOCATIONS = Object.keys(SHIPPING_RATES).map(
  (loc) => loc.replace(/\b\w/g, (c) => c.toUpperCase())
);

const getShippingCharge = (district) => {
  if (!district) return null;
  const key = district.trim().toLowerCase();
  return key in SHIPPING_RATES ? SHIPPING_RATES[key] : 120;
};

/* ─────────────────────────────────────────
   SIZE-BASED PRICING
───────────────────────────────────────── */
const SIZE_PRICING = {
  "lice": { "200": { price: 699, cutprice: 1200 }, "500": { price: 1350, cutprice: 1999 } },
  "nit": { "200": { price: 699, cutprice: 999 }, "500": { price: 1350, cutprice: 1999 } },
  "rice water": { "200": { price: 375, cutprice: 700 }, "500": { price: 775, cutprice: 1500 } },
};

const getSizePrice = (productName, size) => {
  if (!productName || !size) return null;
  const name = productName.toLowerCase();
  for (const [key, sizes] of Object.entries(SIZE_PRICING)) {
    if (name.includes(key) && sizes[size]) return sizes[size];
  }
  return null;
};

/* ─────────────────────────────────────────
   ALOE VERA DETECTION
───────────────────────────────────────── */
const isAloeVera = (name = "", category = "") => {
  const haystack = `${name} ${category}`.toLowerCase();
  return (
    haystack.includes("aloe vera gel") ||
    haystack.includes("aloevera gel") ||
    haystack.includes("aloe vera") ||
    haystack.includes("aloevera")
  );
};

/* ─────────────────────────────────────────
   COMPONENT
───────────────────────────────────────── */
const ProductDetail = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const [current, setCurrent] = useState(0);
  const [wishlist, setWishlist] = useState(false);
  const [openAccord, setOpenAccord] = useState(null);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [district, setDistrict] = useState("");
  const [shippingCharge, setShippingCharge] = useState(null);
  const [shippingChecked, setShippingChecked] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIdx, setHighlightedIdx] = useState(-1);
  const suggestRef = useRef(null);

  const navigate = useNavigate();
  const { id } = useParams();

  /* ── fetch product ── */
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await axios.get(`${BASE_URL}/api/v1/products/${id}`);
        const p = data.product;
        setProduct(p);
        setSelectedSize(isAloeVera(p.name, p.category) ? "75" : "200");
      } catch {
        setError("Failed to load product details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  /* ── close suggestions on outside click ── */
  useEffect(() => {
    const handler = (e) => {
      if (suggestRef.current && !suggestRef.current.contains(e.target))
        setShowSuggestions(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ── helpers ── */
  const handleQuantityChange = (change) =>
    setQuantity((prev) => Math.max(prev + change, 1));

  const checkShipping = () => {
    setShippingCharge(getShippingCharge(district));
    setShippingChecked(true);
    setShowSuggestions(false);
  };

  const handleDistrictChange = (e) => {
    const val = e.target.value;
    setDistrict(val);
    setShippingChecked(false);
    setShippingCharge(null);
    setHighlightedIdx(-1);
    if (val.trim().length > 0) {
      const filtered = ALL_LOCATIONS.filter((loc) =>
        loc.toLowerCase().startsWith(val.trim().toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const selectSuggestion = (loc) => {
    setDistrict(loc);
    setSuggestions([]);
    setShowSuggestions(false);
    setHighlightedIdx(-1);
    setShippingCharge(getShippingCharge(loc));
    setShippingChecked(true);
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions) { if (e.key === "Enter") checkShipping(); return; }
    if (e.key === "ArrowDown") { e.preventDefault(); setHighlightedIdx((p) => Math.min(p + 1, suggestions.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setHighlightedIdx((p) => Math.max(p - 1, 0)); }
    else if (e.key === "Enter") { e.preventDefault(); highlightedIdx >= 0 ? selectSuggestion(suggestions[highlightedIdx]) : checkShipping(); }
    else if (e.key === "Escape") { setShowSuggestions(false); }
  };

  /* ── derived flags ── */
  const aloeVera = product ? isAloeVera(product.name, product.category) : false;
  const sizeOptions = aloeVera ? ["75"] : ["200", "500"];
  const sizeUnit = aloeVera ? "g" : "ml";

  /* ── price resolution ── */
  const sizePrice = product ? getSizePrice(product.name, selectedSize) : null;
  const activePrice = sizePrice ? sizePrice.price : product?.price;
  const activeCutprice = sizePrice ? sizePrice.cutprice : product?.cutprice;
  const activeDiscount = activeCutprice && activePrice
    ? Math.round(((activeCutprice - activePrice) / activeCutprice) * 100)
    : null;

  /* ── add to cart ── */
  const handleAddToCart = async () => {
    if (!shippingChecked || shippingCharge === null) {
      toast.warn("Please check delivery charges for your location before adding to cart.", {
        position: "top-right", autoClose: 2500,
      });
      return;
    }
    try {
      const isAvailable = Number(product.stock) > 0 || product.isAvailable === true;
      if (!isAvailable) { toast.error("Product is currently out of stock."); return; }
      
      const updatedStock = Math.max(0, product.stock - quantity);
      addCartItem(
        {
          ...product,
          price: activePrice,
          cutprice: activeCutprice,
          size: selectedSize,
          sizeUnit,
          shippingCharge: shippingCharge ?? 0,
          district,
        },
        quantity
      );
      setProduct((prev) => ({ ...prev, stock: updatedStock }));
      toast.success("Added to cart!", { position: "top-right", autoClose: 1500 });
      navigate("/cart");
    } catch {
      toast.error("Failed to add product to cart. Please try again.");
    }
  };

  /* ── gallery ── */
  const nextSlide = () => { setImgLoaded(false); setCurrent((p) => (p === product.images.length - 1 ? 0 : p + 1)); };
  const prevSlide = () => { setImgLoaded(false); setCurrent((p) => (p === 0 ? product.images.length - 1 : p - 1)); };
  const goToSlide = (i) => { setImgLoaded(false); setCurrent(i); };

  /* ── accordions ── */
  const toggleAccord = (key) => setOpenAccord((prev) => (prev === key ? null : key));
  const accordions = [
    {
      key: "desc", title: "Description",
      content: (
                  <div className="product-description-content">
            {product?.describe ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                {product.describe.split("\n").map((line, i) => {
                  const trimmed = line.trim();
                  if (!trimmed) return null;
                  
                  if (trimmed.toLowerCase().includes("benefits")) {
                    const cleanHeading = trimmed.replace(/^[-=>→⇌✓✔️\s?]+/, '');
                    return (
                      <h4 key={i} style={{ marginTop: '10px', marginBottom: '4px', fontWeight: '700', color: '#1a1a2e', fontSize: '15px', display: 'flex', alignItems: 'center' }}>
                        {cleanHeading}
                        <span style={{ color: '#2ecc71', marginLeft: '6px', fontSize: '18px' }}>{"\u2728"}</span> 
                      </h4>
                    );
                  }
                  
                  const cleanLine = trimmed.replace(/^[-=>→⇌✓✔️*?]+[\s]*/, '');
                  if (!cleanLine) return null;
                  
                  return (
                    <div key={i} style={{ position: 'relative', paddingLeft: '18px', fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.65' }}>
                      <span style={{ position: 'absolute', left: 0, top: '2px', color: 'var(--pri)', fontSize: '11px', fontWeight: 'normal' }}>{"\u2192"}</span>
                      {cleanLine}
                    </div>
                  );
                })}
              </div>
            ) : (
              <ul className="accord-list">
                <li>Premium quality product. Detailed description coming soon.</li>
              </ul>
            )}
          </div>
        ),
    },
    {
      key: "payment", title: "Payment Policy",
      content: (
        <ul className="accord-list">
          <li><strong>Prepaid only – No COD.</strong> Secure online payment options available at checkout.</li>
          <li>Share payment screenshot on WhatsApp to confirm your order.</li>
          <li>Failed transactions refunded within 3–4 business days.</li>
        </ul>
      ),
    },
    {
      key: "shipping", title: "Shipping Info",
      content: (
        <ul className="accord-list">
          <li>Orders processed within 1–3 business days.</li>
          <li>Tracking info sent via SMS / WhatsApp once dispatched.</li>
          <li>Delivery within 3–4 business days via courier partners.</li>
          <li>Customers are responsible for accurate shipping information.</li>
          <li>Shipping costs calculated by destination and package weight.</li>
        </ul>
      ),
    },
    {
      key: "returns", title: "Returns & Refunds",
      content: (
        <ul className="accord-list">
          <li>Returns accepted only for quality or manufacturing defects.</li>
          <li>Notify us within 1 day of receiving your order.</li>
          <li>No returns or refunds for size or preference issues.</li>
        </ul>
      ),
    },
  ];

  /* ── loading / error ── */
  if (loading) return (
    <div className="pd-loading">
      <img src={loadingimg} alt="Loading..." className="pd-loading-img" />
      <p className="pd-loading-text">Loading product...</p>
    </div>
  );
  if (error) return <div className="pd-error">{error}</div>;
  if (!product) return <div className="pd-error">No product details available.</div>;

  /* ── render ── */
  return (
    <>
      
      <div className="pd-page">

        <nav className="pd-breadcrumb">
          <Link to="/">Home</Link>
          <span className="pd-bc-sep">›</span>
          <Link to="/products">Products</Link>
          <span className="pd-bc-sep">›</span>
          <span className="pd-bc-current">{product.name}</span>
        </nav>

        <div className="pd-card">
          <div className="pd-grid">

            {/* ══════════ GALLERY ══════════ */}
            <div className="pd-gallery">
              <button className="pd-nav pd-nav-prev" onClick={prevSlide} aria-label="Previous">&#8249;</button>
              <button className="pd-nav pd-nav-next" onClick={nextSlide} aria-label="Next">&#8250;</button>
              <div className="pd-main-wrap">
                {product.images?.length > 0 ? (
                  <img
                    key={current}
                    className={`pd-main-img ${imgLoaded ? "pd-img-visible" : ""}`}
                    src={product.images[current]}
                    alt={`${product.name} - image ${current + 1}`}
                    onLoad={() => setImgLoaded(true)}
                  />
                ) : (
                  <div className="pd-no-img">No image</div>
                )}
              </div>
              {product.images?.length > 1 && (
                <div className="pd-dots">
                  {product.images.map((_, i) => (
                    <button key={i} className={`pd-dot ${i === current ? "pd-dot-active" : ""}`}
                      onClick={() => goToSlide(i)} aria-label={`Go to image ${i + 1}`} />
                  ))}
                </div>
              )}
              {product.images?.length > 1 && (
                <div className="pd-thumbs">
                  {product.images.map((img, i) => (
                    <img key={i} className={`pd-thumb ${i === current ? "pd-thumb-active" : ""}`}
                      src={img} alt={`Thumbnail ${i + 1}`} onClick={() => goToSlide(i)} />
                  ))}
                </div>
              )}
            </div>

            {/* ══════════ INFO ══════════ */}
            <div className="pd-info">

              {product.category && <span className="pd-category-tag">{product.category}</span>}
              <h1 className="pd-name">{product.name}</h1>

              <div className="pd-price-row">
                <span className="pd-price-now">₹{activePrice}</span>
                {activeCutprice && <span className="pd-price-was">₹{activeCutprice}</span>}
                {activeDiscount && <span className="pd-discount-pill">{activeDiscount}% off</span>}
              </div>

              <div style={{ marginTop: '12px', marginBottom: '8px' }}>
                {(Number(product.stock) > 0 || product.isAvailable === true) ? (
                  <span style={{ color: '#10b981', background: 'rgba(16,185,129,0.1)', padding: '4px 12px', borderRadius: '16px', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase' }}>Available</span>
                ) : (
                  <span style={{ color: '#ef4444', background: 'rgba(239,68,68,0.1)', padding: '4px 12px', borderRadius: '16px', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase' }}>Out of Stock</span>
                )}
              </div>

              {/* ── Prepaid Notice (always visible) ── */}
              <div className="pd-prepaid-block">
                <div className="pd-prepaid-header" style={{ marginBottom: 0 }}>
                  <span>🔒</span>
                  <span>Prepaid Only &nbsp;·&nbsp; No Cash on Delivery (COD)</span>
                </div>
              </div>

              {/* Shipping checker */}
              <div className="pd-ship-checker">
                <p className="pd-section-label">
                  Check delivery charges
                  <span className="pd-ship-required"> (required before adding to cart)</span>
                </p>
                <div className="pd-ship-row" ref={suggestRef} style={{ position: "relative" }}>
                  <input
                    className="pd-ship-input"
                    type="text"
                    placeholder="Enter your city / district"
                    value={district}
                    autoComplete="off"
                    onChange={handleDistrictChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                    aria-label="City or district"
                    aria-autocomplete="list"
                    aria-expanded={showSuggestions}
                  />
                  <button className="pd-ship-btn" onClick={checkShipping}>Check</button>

                  {showSuggestions && (
                    <ul className="pd-suggest-list" role="listbox">
                      {suggestions.slice(0, 7).map((loc, i) => (
                        <li
                          key={loc}
                          className={`pd-suggest-item ${i === highlightedIdx ? "pd-suggest-highlight" : ""}`}
                          role="option"
                          aria-selected={i === highlightedIdx}
                          onMouseDown={() => selectSuggestion(loc)}
                          onMouseEnter={() => setHighlightedIdx(i)}
                        >
                          <span className="pd-suggest-icon">📍</span>{loc}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {shippingChecked && shippingCharge !== null && (
                  <div className={`pd-ship-result ${shippingCharge === 0 ? "pd-ship-free" : "pd-ship-paid"}`}>
                    {shippingCharge === 0
                      ? <><span>🎉</span> Free delivery to <strong>{district}</strong>!</>
                      : <><span>🚚</span> Shipping to <strong>{district}</strong>: <strong>₹{shippingCharge}</strong></>
                    }
                  </div>
                )}
                {shippingChecked && shippingCharge === null && (
                  <p className="pd-ship-unknown">Could not find charges for this location. Contact us on WhatsApp.</p>
                )}
              </div>

              {/* Stock bar */}
              {product.stock <= 20 && (
                <div className="pd-stock-bar">
                  <p className="pd-stock-label">Only {product.stock} units left — selling fast</p>
                  <div className="pd-stock-track">
                    <div className="pd-stock-fill" style={{ width: `${Math.min((product.stock / 20) * 100, 100)}%` }} />
                  </div>
                </div>
              )}

              {/* Size selector */}
              <div className="pd-section">
                <p className="pd-section-label">Select size</p>
                <div className="pd-size-row">
                  {sizeOptions.map((s) => (
                    <button
                      key={s}
                      className={`pd-size-btn ${selectedSize === s ? "pd-size-active" : ""}`}
                      onClick={() => setSelectedSize(s)}
                    >
                      {s} {sizeUnit}
                      {getSizePrice(product.name, s) && (
                        <span className="pd-size-price">₹{getSizePrice(product.name, s).price}</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="pd-section">
                <p className="pd-section-label">Quantity</p>
                <div className="pd-qty-row">
                  <button className="pd-qty-btn" onClick={() => handleQuantityChange(-1)} aria-label="Decrease">−</button>
                  <span className="pd-qty-val">{quantity}</span>
                  <button className="pd-qty-btn" onClick={() => handleQuantityChange(1)} aria-label="Increase">+</button>
                </div>
              </div>

              {/* Total */}
              <div className="pd-total-line">
                <span>Subtotal</span>
                <span className="pd-total-val">
                  ₹{activePrice * quantity}
                  {shippingCharge > 0 && <span className="pd-total-ship"> + ₹{shippingCharge} shipping</span>}
                  {shippingCharge === 0 && <span className="pd-total-free"> + Free shipping</span>}
                </span>
              </div>

              {/* CTA */}
              <div className="pd-cta-row">
                <button
                  className={`pd-btn-cart ${(!shippingChecked || (Number(product.stock) <= 0 && product.isAvailable === false)) ? "pd-btn-cart-disabled" : ""}`}
                  onClick={handleAddToCart}
                  disabled={!shippingChecked || (Number(product.stock) <= 0 && product.isAvailable === false)}
                  title={!shippingChecked ? "Check delivery charges first" : "Add to Cart"}
                >
                  {!shippingChecked ? "🚚 Check delivery first" : ((Number(product.stock) <= 0 && product.isAvailable === false) ? "Out of Stock" : "Add to Cart")}
                </button>
                <button
                  className={`pd-btn-wish ${wishlist ? "pd-wish-active" : ""}`}
                  onClick={() => setWishlist((w) => !w)}
                  aria-label="Toggle wishlist"
                >
                  {wishlist ? "♥" : "♡"}
                </button>
              </div>

              {!shippingChecked && (
                <p className="pd-cart-hint">↑ Enter your city above and check shipping to enable "Add to Cart"</p>
              )}

              {/* Trust badges */}
              <div className="pd-trust-row">
                <div className="pd-trust-item"><span className="pd-trust-icon">⚡</span><span>2–5 day dispatch</span></div>
                <div className="pd-trust-item"><span className="pd-trust-icon">↩</span><span>Easy returns</span></div>
                <div className="pd-trust-item"><span className="pd-trust-icon">🔒</span><span>Secure payment</span></div>
              </div>

              {/* Accordions */}
              <div className="pd-accord">
                {accordions.map(({ key, title, content }) => (
                  <div key={key} className="pd-accord-item">
                    <button className="pd-accord-hdr" onClick={() => toggleAccord(key)} aria-expanded={openAccord === key}>
                      {title}
                      <span className="pd-accord-arrow"
                        style={{ transform: openAccord === key ? "rotate(180deg)" : "rotate(0deg)" }}>▼</span>
                    </button>
                    <div className={`pd-accord-body ${openAccord === key ? "pd-accord-open" : ""}`}>
                      <div className="pd-accord-inner">{content}</div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>
      </div>

      <Bestseller />
    </>
  );
};

export default ProductDetail;



