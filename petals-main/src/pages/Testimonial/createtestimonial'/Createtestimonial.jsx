import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Createtestimonial = () => {
  const [name, setName] = useState('');
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await axios.post(`${BASE_URL}/api/v1/createtestimonial`, { name, review });
      navigate("/");
    } catch (error) {
      setError('Failed to submit your testimonial. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center login">
      <div>
        <form onSubmit={handleSubmit}>
          <h2 className="grid-title">Share Your Experience</h2>

          {error && <p className="text-danger">{error}</p>}

          <div className="mb-3">
            {/* ✅ Added htmlFor + id for accessibility */}
            <label htmlFor="name">User Name</label>
            <input
              id="name"
              type="text"
              required
              placeholder="Enter name"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="review">Feel free to write your review</label>
            {/* ✅ Changed <input> to <textarea> for multi-line review input */}
            <textarea
              id="review"
              required
              placeholder="Enter review"
              className="form-control"
              rows={4}
              value={review}
              onChange={(e) => setReview(e.target.value)}
            />
          </div>

          {/* ✅ Added type="submit" so the button always triggers form submission */}
          <button type="submit" className="btn btn-success" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Createtestimonial;
