

import React, { useRef, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Trendingshirt.css";
import loadingimg from "../../../componets/images/7LXw.gif";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Badge labels cycling through cards
const BADGE_LABELS = ["Coming Soon", "Launching Soon", "Special Duo", "Best Seller"];
const BADGE_CLASSES = ["badge--teal", "badge--dark", "badge--warm", "badge--teal"];

// Render filled / half / empty stars
const StarRating = ({ rating = 4.9, count = 250 }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    const fill = Math.min(1, Math.max(0, rating - (i - 1)));
    if (fill >= 0.75) {
      stars.push(<span key={i} className="ts-star ts-star--full">★</span>);
    } else if (fill >= 0.25) {
      stars.push(<span key={i} className="ts-star ts-star--half">★</span>);
    } else {
      stars.push(<span key={i} className="ts-star ts-star--empty">★</span>);
    }
  }
  return (
    <div className="ts-rating-row">
      <span className="ts-stars">{stars}</span>
      <span className="ts-rating-val">{rating.toFixed(2)}</span>
      {count > 0 && <span className="ts-review-count">| {count.toLocaleString()} reviews</span>}
    </div>
  );
};

const Zcommunity = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const trackRef = useRef(null);
  const navigate = useNavigate();
  const [currentDot, setCurrentDot] = useState(0);

  /* ── Fetch products directly from DB ── */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${BASE_URL}/api/v1/products`);
        const allProducts = res.data.product || [];

        // Filter for soap categories
        const soapProducts = allProducts.filter((item) => {
          if (!item.category) return false;
          const cat = ((item.category || "") + " " + (item.name || "")).toLowerCase();
          return cat.includes("soap") || cat.includes("combo");
        });

        const listToDisplay = soapProducts.length > 0 ? soapProducts : allProducts;

        setProducts(listToDisplay);
      } catch (err) {
        console.error("Error fetching products from DB:", err);
        setError("Unable to load products. Please check connection.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const handleScroll = () => {
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (maxScroll <= 0) return;
      const scrollPercent = el.scrollLeft / maxScroll;
      const totalDots = 3;
      const activeDot = Math.min(
        totalDots - 1,
        Math.round(scrollPercent * (totalDots - 1))
      );
      setCurrentDot(activeDot);
    };

    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, [products]);

  const scroll = (direction) => {
    if (trackRef.current) {
      const scrollAmount = direction === "left" ? -300 : 300;
      trackRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };



  if (loading)
    return (
      <div className="pd-loading" style={{ padding: "40px 0", textAlign: "center" }}>
        <img src={loadingimg} alt="Loading..." className="pd-loading-img" />
        <p className="pd-loading-text">Fetching live products from store…</p>
      </div>
    );

  if (error)
    return (
      <section className="ts-section">
        <div className="ts-loading">
          <p className="ts-loading-text">{error}</p>
        </div>
      </section>
    );

  return (
    <section className="ts-section">
      {/* Header */}
      <div className="ts-header-block">
        <div>
          {/* <p className="ts-mini-title">Upcoming & Featured Products</p> */}

          <h2 className="ts-title">
            Muthu's Petals Soap <em>Collection</em>
          </h2>
        </div>

        <Link className="ts-see-all" to="/products">
          Explore →
        </Link>
      </div>

      {/* Product Slider */}
      <div className="ts-track-wrapper">
        <button className="ts-nav-btn ts-nav-left" onClick={() => scroll("left")}>‹</button>
        <button className="ts-nav-btn ts-nav-right" onClick={() => scroll("right")}>›</button>
        <div className="ts-track" ref={trackRef}>
          {products.map((product, idx) => {
            const badgeLabel = BADGE_LABELS[idx % BADGE_LABELS.length];
            const badgeClass = BADGE_CLASSES[idx % BADGE_CLASSES.length];

            const mrp = Number(product.cutprice) || 0;
            const price = Number(product.price) || 0;
            const discount =
              mrp > price && mrp > 0
                ? Math.round(((mrp - price) / mrp) * 100)
                : 0;

            const seed = product._id?.charCodeAt(product._id.length - 1) ?? 50;
            const rating = 4 + (seed % 10) / 10;
            const reviews = 150 + (seed * 8) % 1000;

            return (
              <div
                className="ts-card"
                key={product._id}
                style={{ "--i": idx, cursor: "pointer" }}
                onClick={() => navigate(`/products/${product._id}`)}
              >
                {/* Image */}
                <div className="ts-img-wrap">
                  <span className={`ts-badge ${badgeClass}`}>
                    {product.category || badgeLabel}
                  </span>

                  {product.images?.length > 0 ? (
                    <img
                      className="ts-img"
                      src={product.images[0]}
                      alt={product.name}
                      loading="lazy"
                    />
                  ) : (
                    <div className="ts-img-placeholder" />
                  )}

                  <div className="ts-overlay">
                    <button
                      className="ts-notify-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/products/${product._id}`);
                      }}
                    >
                      View Details
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="ts-card-body">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                    <p className="ts-name" style={{ margin: 0, flex: 1 }}>{product.name}</p>
                    <div style={{ fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', flexShrink: 0, marginTop: '2px' }}>
                      {(Number(product.stock) > 0 || product.isAvailable === true) ? (
                        <span style={{ color: '#10b981', background: 'rgba(16,185,129,0.1)', padding: '2px 6px', borderRadius: '12px' }}>Available</span>
                      ) : (
                        <span style={{ color: '#ef4444', background: 'rgba(239,68,68,0.1)', padding: '2px 6px', borderRadius: '12px' }}>Out of Stock</span>
                      )}
                    </div>
                  </div>

                  <StarRating rating={rating} count={reviews} />

                  {/* Pricing */}
                  <div className="ts-pricing-row">
                    <span className="ts-mrp-label">MRP:</span>
                    <span className="ts-price-org">₹{price}</span>
                    {mrp > 0 && <span className="ts-price-cut">₹{mrp}</span>}
                    {discount > 0 && (
                      <span className="ts-discount-badge">{discount}% OFF</span>
                    )}
                  </div>

                  {/* <div className="ts-coming-row" style={{ marginTop: "6px" }}>
                    <span className="ts-coming-dot" />
                    <span className="ts-coming-text">
                      Available in Store — Launching Soon
                    </span>
                  </div> */}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="ts-scroll-hint">
        {[0, 1, 2].map((dot) => (
          <div
            key={dot}
            className={`ts-dot ${currentDot === dot ? "active" : ""}`}
          />
        ))}
      </div>
    </section>
  );
};

export default Zcommunity;








