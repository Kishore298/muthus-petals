import React, { useEffect, useRef } from "react";
import './about.css';
import founderimg from '../assets/founder.jpeg';
import Navbar from "../componets/Navbar/Navbar";
import Footer from "../componets/footer/footdetails";
const PILLS = [
  { icon: "", label: "Made With Love & Care" },
  { icon: "", label: "Cruelty Free · Eco Conscious" },
  { icon: "", label: "Paraben & Sulfate Free" },
  { icon: "", label: "Naturally Derived Ingredients" },
];

const About = () => {
  const elementsRef = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("ab--visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    elementsRef.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const ref = (i) => (el) => (elementsRef.current[i] = el);

  return (
    <>


      <section className="ab">

        {/* ── Background botanicals ── */}
        <div className="ab__bg-leaf ab__bg-leaf--tl" aria-hidden="true" />
        <div className="ab__bg-leaf ab__bg-leaf--br" aria-hidden="true" />
        <div className="ab__noise" aria-hidden="true" />

        <div className="ab__inner">

          {/* ════════════ LEFT — Founder Photo ════════════ */}
          <div className="ab__photo-col" ref={ref(0)}>
            <div className="ab__photo-frame">
              {/* Corner accents */}
              <span className="ab__corner ab__corner--tl" aria-hidden="true" />
              <span className="ab__corner ab__corner--tr" aria-hidden="true" />
              <span className="ab__corner ab__corner--bl" aria-hidden="true" />
              <span className="ab__corner ab__corner--br" aria-hidden="true" />

              <img
                src={founderimg}
                alt="Muthu — Founder of Muthus Petals"
                className="ab__founder-img"
              />

              {/* Floating badge */}
              <div className="ab__founder-badge">

                <span className="ab__badge-text">Founder & CEO</span>
                <strong className="ab__badge-name">Muthu Lakshmi S</strong>
              </div>
            </div>

            {/* Decorative petals behind the frame */}
            <span className="ab__petal ab__petal--a" aria-hidden="true">❀</span>
            <span className="ab__petal ab__petal--b" aria-hidden="true">✾</span>
            <span className="ab__petal ab__petal--c" aria-hidden="true">✿</span>
          </div>

          {/* ════════════ RIGHT — Content ════════════ */}
          <div className="ab__content-col">

            <div className="ab__eyebrow fade-up" ref={ref(1)} style={{ "--delay": "0s" }}>
              <span className="ab__eyebrow-line" />
              Our Story
              <span className="ab__eyebrow-line" />
            </div>

            <h1 className="ab__heading fade-up" ref={ref(2)} style={{ "--delay": "0.12s" }}>
              Welcome to<br /><em>Muthus Petals</em>
            </h1>

            <div className="ab__divider fade-up" ref={ref(3)} style={{ "--delay": "0.2s" }}>
              <span />
              <span className="ab__divider-flower">✿</span>
              <span />
            </div>

            <p className="ab__text fade-up" ref={ref(4)} style={{ "--delay": "0.28s" }}>
              Where <strong>nature meets beauty.</strong> Our range of natural shampoo, soap,
              and cosmetic products are crafted with love and care, using only the finest
              ingredients to nourish your skin and hair.
            </p>

            <p className="ab__text fade-up" ref={ref(5)} style={{ "--delay": "0.36s" }}>
              At Muthus Petals, we infuse nature's essence into our cosmetics, crafting
              gentle, effective formulas that bloom with every use. Let the soft touch of
              petals soothe your skin, and the sweet scent of nature uplift your senses.
            </p>

            {/* Pills — rendered once, not twice */}
            <div className="ab__pills fade-up" ref={ref(6)} style={{ "--delay": "0.44s" }}>
              {PILLS.map(({ icon, label }) => (
                <span className="ab__pill" key={label}>
                  <span className="ab__pill-icon">{icon}</span>
                  {label}
                </span>
              ))}
            </div>

          </div>
        </div>
      </section>

    </>
  );
};

export default About;