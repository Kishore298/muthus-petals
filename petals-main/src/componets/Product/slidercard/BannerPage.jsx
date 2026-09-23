import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Banner.css";
import "./HeroGrid.css";

import bannerback from "../../../assets/bannerback.png"
import bannerback2 from "../../../assets/bannerback2.jpg"
import bannerback3 from "../../../assets/bannerback3.jpg"
import bannerback4 from "../../../assets/bannerback4.jpg"


/* ── swap these imports for your real images ── */
import heroImg from "../../../assets/hero3.jpeg";
import heroImg2 from "../../../assets/hero2.jpeg";
import heroImg3 from "../../../assets/hero4.jpeg";
import heroImg4 from "../../../assets/hero6.jpeg";
import heroImg5 from "../../../assets/hero.jpeg";
import heroImg6 from "../../../assets/hero8.jpeg";
import heroImg7 from "../../../assets/hero5.jpeg";
import heroImg8 from "../../../assets/hero7.jpeg";

import hairImg from "../../../assets/beach-skincare-product-still-life.jpeg";
import skinImg from "../../../assets/soap-product.jpeg";
import bestImg from "../../../assets/bannerback4.jpg";

const images = [
  heroImg, heroImg2, heroImg3, heroImg4,
  heroImg5, heroImg6, heroImg7, heroImg8
];

const TRUST_PILLS = [
  "Toxin Free",
  "Cruelty Free",
  "Paraben & Sulfate Free",
  "Dermatologist Tested",
];

const CATEGORIES = [
  { label: "Hair Care", img: hairImg, href: "/haircare" },
  { label: "Skin Care", img: skinImg, href: "/skincare" },
  { label: "Best Sellers", img: bestImg, href: "/products?sort=bestseller" },
];


export default function Banner() {
  const [slide, setSlide] = useState({
    current: images[0],
    prev: null,
    tick: 0,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setSlide((s) => ({
        current: images[(s.tick + 1) % images.length],
        prev: s.current,
        tick: s.tick + 1,
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="banner-root">

      {/* ═══════════ HERO ═══════════ */}
      <section className="bn-hero">


        {/* decorative blobs */}
        <span className="bn-blob bn-blob--left" aria-hidden="true" />
        <span className="bn-blob bn-blob--right" aria-hidden="true" />

        {/* LEFT */}
        <div className="bn-left">
          <p className="bn-eyebrow">Botanical Care For &amp;  Modern Living🌿</p>

          <h1 className="bn-h1">
            Muthu's Petals.<br />
            <span className="bn-h1-em">Nature's Care for You.</span>
          </h1>

          <p className="bn-sub">
            At Muthus Petals, we believe in simple, honest beauty.
            Experience gentle, toxin-free skincare and haircare crafted
            from nature to nourish your skin, strengthen your hair,
            and bring out your natural glow.
          </p>

          <div className="bn-btns">
            <Link to="/products" className="bn-btn-fill">Shop Now</Link>
            <Link to="/ingredients" className="bn-btn-outline">Know Our Ingredients</Link>
          </div>

          <div className="bn-trust">
            {TRUST_PILLS.map((p) => (
              <span key={p} className="bn-trust-pill">
                <span className="bn-dot" />
                {p}
              </span>
            ))}
          </div>
        </div>

        {/* RIGHT — 3D sliding image grid */}
        <div className="bn-right">
          <span className="petal petal-1" aria-hidden="true">🌸</span>
          <span className="petal petal-2" aria-hidden="true">🌿</span>
          <span className="petal petal-3" aria-hidden="true">🌸</span>
          <span className="petal petal-4" aria-hidden="true">🌿</span>
          <span className="petal petal-5" aria-hidden="true">🌸</span>

          <div className="bn-img-wrap">

            {/* Outgoing image — slides out to the left */}
            {slide.prev && (
              <img
                key={`out-${slide.tick}`}
                src={slide.prev}
                alt=""
                className="slide-img slide-img--out"
              />
            )}

            {/* Incoming image — flies in from the right */}
            <img
              key={`in-${slide.tick}`}
              src={slide.current}
              alt="hero"
              className="slide-img slide-img--in"
            />

          </div>
        </div>
      </section>

      {/* ═══════════ CATEGORY CARDS ═══════════ */}
      <section className="bn-cats">
        {CATEGORIES.map(({ label, img, href }) => (
          <Link key={label} to={href} className="bn-cat-card">
            <div className="bn-cat-img-wrap">
              <img src={img} alt={label} className="bn-cat-img" />
            </div>
            <p className="bn-cat-label">{label}</p>
          </Link>
        ))}
      </section>

    </div>
  );
}
