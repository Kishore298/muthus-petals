import React, { useState, useEffect } from "react";
import "./Testimonial.css";
import { Link } from "react-router-dom";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Fallback avatar using the user's initials
const InitialsAvatar = ({ name }) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  return (
    <div className="profile-pic initials-avatar" aria-label={name}>
      {initials}
    </div>
  );
};

const TestimonialCard = ({ testimonial }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="card">

      {/* ✅ Image/Avatar sits above the card, outside the content block */}
      <div className="profile-pic-wrap">
        {testimonial.image && !imgError ? (
          <img
            className="profile-pic"
            src={testimonial.image}
            alt={`${testimonial.name}'s review`}
            onError={() => setImgError(true)}
          />
        ) : (
          <InitialsAvatar name={testimonial.name} />
        )}
      </div>

      {/* Review content below */}
      <div className="card-content">
        <h4 className="cust-name">{testimonial.name}</h4>
        <p className="cust-profession">Customer from Muthu's petals..</p>
        <p className="cust-profession-review">{testimonial.review}</p>
      </div>

    </div>
  );
};
const Testamonial = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imgError, setImgError] = useState(false);

  // ✅ Fetch real testimonials from the backend
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/api/v1/gettestimonial`);
        // Sort newest first
        const sorted = (data.testimonial || []).sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setTestimonials(sorted);
      } catch (err) {
        console.error(err);
        setError("Failed to load testimonials. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  const nextTestimonial = () => {
    setImgError(false);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setImgError(false);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // ✅ Auto-slide effect for mobile
  useEffect(() => {
    if (testimonials.length === 0) return;
    
    // Create an interval to slide every 4 seconds
    const interval = setInterval(() => {
      nextTestimonial();
    }, 4000);

    // Clear interval on unmount or when dependencies change
    return () => clearInterval(interval);
  }, [testimonials.length]);

  // ✅ Loading state
  if (loading) {
    return (
      <div className="testimonial-container">
        <div className="testimonial-header-wrap">
          <h3 className="headerstitle">TESTIMONIALS</h3>
          <h1 className="headers">What our <em>customers</em> say..</h1>
        </div>
        <p style={{ textAlign: "center" }}>Loading testimonials...</p>
      </div>
    );
  }

  // ✅ Error state
  if (error) {
    return (
      <div className="testimonial-container">
        <div className="testimonial-header-wrap">
          <h3 className="headerstitle">TESTIMONIALS</h3>
        </div>
        <p style={{ textAlign: "center", color: "red" }}>{error}</p>
      </div>
    );
  }

  // ✅ Empty state
  if (testimonials.length === 0) {
    return (
      <div className="testimonial-container">
        <div className="testimonial-header-wrap">
          <h3 className="headerstitle">TESTIMONIALS</h3>
        </div>
        <p style={{ textAlign: "center" }}>No reviews yet. Be the first to share!</p>
        <div className="write-review-wrap">
          <Link to="/createtestimonial" className="createreview">Write Review</Link>
        </div>
      </div>
    );
  }

  const current = testimonials[currentIndex];

  return (
    <div className="testimonial-container">
      <div className="testimonial-header-wrap">
        <h3 className="headerstitle">TESTIMONIALS</h3>
        <h1 className="headers">What our <em>customers</em> say..</h1>
      </div>

      {/* DESKTOP — all cards in a 2x2 grid */}
      <div className="desktop-grid" id="testanimimation">
        {testimonials.map((t) => (
          <TestimonialCard key={t._id} testimonial={t} />
        ))}
      </div>

      {/* MOBILE — single card slider */}
      <div className="mobile-slider">
        <TestimonialCard key={current._id} testimonial={current} />

        <div className="navigation">
          <button onClick={prevTestimonial} className="nav-button" aria-label="Previous">
            &#10094;
          </button>
          <span className="slide-counter">
            {currentIndex + 1} / {testimonials.length}
          </span>
          <button onClick={nextTestimonial} className="nav-button" aria-label="Next">
            &#10095;
          </button>
        </div>
      </div>

      {/* ✅ Write Review button restored */}
      <div className="write-review-wrap">
        <Link to="/createtestimonial" className="createreview">
          Write Review
        </Link>
      </div>
    </div>
  );
};

export default Testamonial;
