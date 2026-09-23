import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Gallery.css";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

/* ── Lightbox ── */
const Lightbox = ({ src, onClose }) => (
  <div className="gl-overlay" onClick={onClose}>
    <div className="gl-lightbox" onClick={(e) => e.stopPropagation()}>
      <button className="gl-close" onClick={onClose} aria-label="Close">&#x2715;</button>
      <img src={src} alt="Gallery full view" className="gl-lb-img" />
    </div>
  </div>
);

/* ── Skeleton card ── */
const SkeletonCard = () => <div className="gallery-item gallery-skeleton" />;

const Gallery = () => {
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const fetchGalleryImages = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/v1/gallery`);
        // response.data is an array of { _id, publicUrl, createdAt }
        // already sorted newest-first by the backend
        setGalleryImages(response.data);
      } catch (err) {
        console.error("Error fetching gallery images:", err);
        setError("Could not load gallery. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryImages();
  }, []);

  return (
    <>
      
      <div className="gallery-container">
        <h1 className="gallery-title">Customer Gallery</h1>
        <h2 className="upload-txt">
          Rock the Look, Snap a Pic!<br />
          Share your style with <strong>@muthupetals</strong> and get featured
        </h2>

        {/* Loading skeletons */}
        {loading && (
          <div className="gallery-grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="gallery-error">
            <span>😔</span>
            <p>{error}</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && galleryImages.length === 0 && (
          <div className="gallery-empty">
            <span>📸</span>
            <p>No photos yet. Be the first to share your look!</p>
          </div>
        )}

                        {/* Image grid */}
        {!loading && !error && galleryImages.length > 0 && (
          <div className="gallery-grid">
            {galleryImages.map((item, index) => {
              if (item.beforeImageUrl && item.afterImageUrl) {
                return (
                  <div className="gallery-comparison-card" key={item._id || index} style={{ gridColumn: 'span 2', display: 'flex', background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
                    <div style={{ flex: 1, position: 'relative' }} onClick={() => setSelected(item.beforeImageUrl)}>
                      <span style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(0,0,0,0.6)', color: '#fff', padding: '4px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600 }}>Before</span>
                      <img src={item.beforeImageUrl} alt="Before" style={{ width: '100%', height: '300px', objectFit: 'cover', cursor: 'pointer' }} />
                    </div>
                    <div style={{ width: '4px', background: '#e2e8f0' }}></div>
                    <div style={{ flex: 1, position: 'relative' }} onClick={() => setSelected(item.afterImageUrl)}>
                      <span style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(46, 204, 113, 0.9)', color: '#fff', padding: '4px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600 }}>After ?</span>
                      <img src={item.afterImageUrl} alt="After" style={{ width: '100%', height: '300px', objectFit: 'cover', cursor: 'pointer' }} />
                    </div>
                  </div>
                );
              }
              // Fallback for legacy static images with publicUrl
              return (
                <div
                  className="gallery-item"
                  key={item._id || index}
                  onClick={() => setSelected(item.publicUrl || item.beforeImageUrl)}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <img
                    src={item.publicUrl || item.beforeImageUrl}
                    alt={`Customer photo ${index + 1}`}
                    className="gallery-image"
                    loading="lazy"
                  />
                  <div className="gallery-overlay">
                    <span className="gallery-zoom-icon">??</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {selected && <Lightbox src={selected} onClose={() => setSelected(null)} />}
    </>
  );
};

export default Gallery;







