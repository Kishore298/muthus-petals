

import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Trendingshirt.css";
import loadingimg from "../../../componets/images/7LXw.gif";


const BASE_URL = import.meta.env.VITE_API_BASE_URL;




// Badge labels cycling through cards
const BADGE_LABELS = ["Best Seller", "Best Seller", "Trending", "Selling Fast"];
const BADGE_CLASSES = ["badge--dark", "badge--dark", "badge--teal", "badge--warm"];

// Render filled / half / empty stars
const StarRating = ({ rating = 4.5, count = 0 }) => {
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




const Bestseller = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const trackRef = useRef(null);
  const [currentDot, setCurrentDot] = useState(0);


  useEffect(() => {
    const el = trackRef.current;

    if (!el) return;

    const handleScroll = () => {
      const maxScroll =
        el.scrollWidth - el.clientWidth;

      const scrollPercent =
        el.scrollLeft / maxScroll;

      const totalDots = 3;

      const activeDot = Math.min(
        totalDots - 1,
        Math.round(scrollPercent * (totalDots - 1))
      );

      setCurrentDot(activeDot);
    };

    el.addEventListener("scroll", handleScroll);

    return () => {
      el.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scroll = (direction) => {
    if (trackRef.current) {
      const scrollAmount = direction === "left" ? -300 : 300;
      trackRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };



  /* ── Fetch products ── */
  useEffect(() => {
    const fetchProducts = async () => {
      try {


        const res = await axios.get(`${BASE_URL}/api/v1/products`);
        const first15 = (res.data.product || []).slice(0, 15);
        setProducts(first15);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Unable to load products. Please check your connection.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);


  console.log(products)

  if (loading) return (
    <div className="pd-loading">
      <img src={loadingimg} alt="Loading..." className="pd-loading-img" />
      <p className="pd-loading-text">Curating collection…</p>
    </div>
  );



  if (error) return (
    <div className="ts-section">
      <div className="ts-loading">
        <p className="ts-loading-text">{error}</p>
      </div>
    </div>
  );

  return (
    <section className="ts-section">

      {/* ── Header ── */}
      <div className="ts-header-block">
        <div>

          <h2 className="ts-title">
            Best <em>Arrival</em> <em>Collection</em>
          </h2>
        </div>
        <Link className="ts-see-all" to="/products">View all →</Link>
      </div>

      {/* ── Scrollable track ── */}
      <div className="ts-track-wrapper">
        <button className="ts-nav-btn ts-nav-left" onClick={() => scroll("left")}>‹</button>
        <button className="ts-nav-btn ts-nav-right" onClick={() => scroll("right")}>›</button>
        <div className="ts-track" ref={trackRef}>
          {products.map((product, idx) => {
            const badgeLabel = BADGE_LABELS[idx % BADGE_LABELS.length];
            const badgeClass = BADGE_CLASSES[idx % BADGE_CLASSES.length];

            // Derive a fake-but-consistent discount % from cutprice / price
            const mrp = Number(product.cutprice) || 0;
            const price = Number(product.price) || 0;
            const discount = mrp > price && mrp > 0
              ? Math.round(((mrp - price) / mrp) * 100)
              : 0;

            // Fake rating seeded from product id (consistent per product)
            const seed = product._id?.charCodeAt(product._id.length - 1) ?? 50;
            const rating = 4 + (seed % 10) / 10;   // 4.0 – 4.9
            const reviews = 200 + (seed * 7) % 1400;

            return (
              <div
                className="ts-card"
                key={product._id}
                style={{ "--i": idx }}
                onClick={() => navigate(`/products/${product._id}`)}
              >
                {/* Image */}
                <div className="ts-img-wrap">
                  <span className={`ts-badge ${badgeClass}`}>{badgeLabel}</span>
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
                </div>

                {/* Body */}
                <div className="ts-card-body">
                  <p className="ts-name">{product.name}</p>

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


                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Scroll hint dots ── */}
      <div className="ts-scroll-hint">
        {[0, 1, 2].map((dot) => (
          <div
            key={dot}
            className={`ts-dot ${currentDot === dot ? "active" : ""
              }`}
          />
        ))}
      </div>

    </section>
  );
};

export default Bestseller;


