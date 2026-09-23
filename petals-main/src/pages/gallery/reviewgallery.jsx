import React, { useState } from "react";
import "./ReviewGallery.css";

// ✅ Just images — no names, no reviews
const GALLERY_IMAGES = [
    "https://pub-c6e4172ce9474a22a56915b9449c46af.r2.dev/WhatsApp%20Image%202026-05-09%20at%203.23.04%20PM.jpeg",
    "https://pub-c6e4172ce9474a22a56915b9449c46af.r2.dev/WhatsApp%20Image%202026-05-09%20at%2011.55.03%20PM.jpeg",
    "https://pub-c6e4172ce9474a22a56915b9449c46af.r2.dev/WhatsApp%20Image%202026-05-11%20at%205.36.40%20PM.jpeg",
    "https://pub-c6e4172ce9474a22a56915b9449c46af.r2.dev/nolits.jpeg",
    "https://pub-c6e4172ce9474a22a56915b9449c46af.r2.dev/WhatsApp%20Image%202026-05-11%20at%205.41.11%20PM.jpeg"
];

/* ── Lightbox ── */
const Lightbox = ({ src, onClose }) => {
    return (
        <div className="rg-overlay" onClick={onClose}>
            <div className="rg-lightbox" onClick={(e) => e.stopPropagation()}>
                <button className="rg-close" onClick={onClose} aria-label="Close">&#x2715;</button>
                <img src={src} alt="Customer" className="rg-lb-img" />
            </div>
        </div>
    );
};

/* ── Main Page ── */
const ReviewGallery = () => {
    const [selected, setSelected] = useState(null);

    return (
        <div className="rg-page">
            <div className="rg-header">
                <p className="rg-eyebrow">Real people, real results</p>
                <h1 className="rg-title">Customer Gallery</h1>
                <div className="rg-divider" />
            </div>

            <div className="rg-grid">
                {GALLERY_IMAGES.map((src, i) => (
                    <div
                        key={i}
                        className="rg-card"
                        style={{ animationDelay: `${i * 0.06}s` }}
                        onClick={() => setSelected(src)}
                    >
                        <img src={src} alt={`Customer ${i + 1}`} className="rg-card-img" />
                        <div className="rg-card-overlay" />
                    </div>
                ))}
            </div>

            {selected && <Lightbox src={selected} onClose={() => setSelected(null)} />}
        </div>
    );
};

export default ReviewGallery;