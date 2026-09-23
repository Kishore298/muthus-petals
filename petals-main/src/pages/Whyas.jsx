import React, { useEffect, useRef } from "react";
import "./whyas.css";
import img1 from "../componets/images/loyalty.gif";
import img2 from "../componets/images/syringe.gif";
import img3 from "../componets/images/home-care.gif";
import img4 from "../componets/images/natural-product.gif";

const cards = [
  {
    img: img1,
    title: "Satisfied Customers",
    desc: "Proven outcomes across all ages",
    delay: "0s",
  },
  {
    img: img2,
    title: "Gentle on Skin & hair",
    desc: "Hair elegance with 0% side effects",
    delay: "0.15s",
  },
  {
    img: img3,
    title: "Natural Care",
    desc: "Herbal solution for your hair",
    delay: "0.3s",
  },
  {
    img: img4,
    title: "Natural inspired formula",
    desc: "Authentic natural ingredients",
    delay: "0.45s",
  },
];

const Whyas = () => {
  const sectionRef = useRef(null);
  const cardRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    cardRefs.current.forEach((el) => el && observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section className="whyas">
      {/* Decorative blobs */}
      <div className="blob blob--1" aria-hidden="true" />
      <div className="blob blob--2" aria-hidden="true" />

      <div className="whyas__inner">
        {/* Heading */}
        <div className="whyas__heading fade-up" ref={sectionRef}>
          <span className="whyas__badge">Why Choose Us</span>
          <h2 className="whyas__title">
            Where <em>purity</em> meets <em>performance</em>
          </h2>
          <p className="whyas__subtitle">
            Our premium products guarantee radiant locks and the benefits of
            pure, wholesome care — for hair and skin that truly thrive.
          </p>
          <div className="whyas__divider">
            <span /><span /><span />
          </div>
        </div>

        {/* Cards grid */}
        <div className="whyas__grid">
          {cards.map((card, i) => (
            <div
              className="whyas__card fade-up"
              key={i}
              style={{ "--delay": card.delay }}
              ref={(el) => (cardRefs.current[i] = el)}
            >
              <div className="whyas__card-glow" aria-hidden="true" />
              <div className="whyas__icon-wrap">
                <img src={card.img} alt={card.title} className="whyas__icon" />
              </div>
              <h3 className="whyas__card-title">{card.title}</h3>
              <p className="whyas__card-desc">{card.desc}</p>
              <div className="whyas__card-line" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Whyas;