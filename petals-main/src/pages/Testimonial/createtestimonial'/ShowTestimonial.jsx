import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminNavbar from '../../../Dashbroad/AdminNavbar';
import "../../../Dashbroad/showproducts/showproducts.css"; // Reuse the beautiful admin theme

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const Showalltestimonial = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [newName, setNewName] = useState('');
  const [newReview, setNewReview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchTestimonials = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/v1/getTestimonial`);
      setTestimonials(Array.isArray(res.data.testimonial) ? res.data.testimonial : []);
    } catch (err) {
      console.error("Error fetching testimonials:", err);
      setError("Failed to load testimonials.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await axios.delete(`${BASE_URL}/api/v1/deleteTestimonial/${deletingId}`);
      setTestimonials(prev => prev.filter(testimonial => testimonial._id !== deletingId));
      toast.success("Testimonial deleted!");
    } catch (err) {
      console.error("Error deleting testimonial:", err);
      toast.error("Failed to delete testimonial.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleOpenModal = (testimonial = null) => {
    if (testimonial) {
      setEditId(testimonial._id);
      setNewName(testimonial.name);
      setNewReview(testimonial.review);
    } else {
      setEditId(null);
      setNewName('');
      setNewReview('');
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditId(null);
    setNewName('');
    setNewReview('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newName || !newReview) return;
    setIsSubmitting(true);
    try {
      if (editId) {
        await axios.put(`${BASE_URL}/api/v1/updatetestimonial/${editId}`, { name: newName, review: newReview });
      } else {
        await axios.post(`${BASE_URL}/api/v1/createtestimonial`, { name: newName, review: newReview });
      }
      fetchTestimonials(); // Refresh list
      handleCloseModal();
      toast.success(editId ? "Testimonial updated!" : "Testimonial added!");
    } catch (err) {
      console.error("Error saving testimonial:", err);
      toast.error("Failed to save testimonial.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="admin-page"><div className="sp-state">Loading...</div></div>;

  return (
    <>
    <ToastContainer theme="dark" />
    <AdminNavbar />
    <div className="admin-page" style={{ position: 'relative' }}>
      <div style={{ maxWidth: '850px', margin: '0 auto', width: '100%' }}>
      <div className="sp-header">
        <h1 style={{ margin: 0 }}>Customer Testimonials</h1>
        <button className="sp-btn sp-btn-primary" onClick={() => handleOpenModal()}>
          + Add New Testimonial
        </button>
      </div>

      {error ? (
        <div className="sp-state">{error}</div>
      ) : testimonials.length === 0 ? (
        <div className="sp-state">No testimonials available.</div>
      ) : (
        <div className="sp-grid testimonials-grid">
          {testimonials.map((testimonial) => (
            <div className="sp-card" key={testimonial._id} style={{ display: 'flex', flexDirection: 'column' }}>
              <div className="sp-info" style={{ flexGrow: 1 }}>
                <div className="sp-name" style={{ fontSize: '18px', color: '#d875db', marginBottom: '12px' }}>
                  {testimonial.name}
                </div>
                <div style={{ color: '#f1f1f6', fontSize: '14px', lineHeight: '1.6' }}>
                  "{testimonial.review}"
                </div>
              </div>
              <div className="sp-actions" style={{ gridTemplateColumns: '1fr 1fr', marginTop: 'auto' }}>
                <button className="sp-btn edit" onClick={() => handleOpenModal(testimonial)}>Edit</button>
                <button className="sp-btn del" onClick={() => setDeletingId(testimonial._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={handleCloseModal}>
          <div style={{ background: '#1a1a24', borderRadius: '20px', padding: '32px', width: '90%', maxWidth: '500px', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.06)', position: 'relative' }} onClick={(e) => e.stopPropagation()}>
            <button type="button" onClick={handleCloseModal} style={{ position: 'absolute', top: 20, right: 20, background: 'transparent', border: 'none', color: '#9898b3', fontSize: 24, cursor: 'pointer' }}>×</button>
            <h3 style={{ marginBottom: '24px', color: '#f1f1f6', fontSize: '22px', fontFamily: 'Cormorant Garamond, serif', fontWeight: 600 }}>
              {editId ? 'Edit Testimonial' : 'Add New Testimonial'}
            </h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <input 
                type="text" 
                placeholder="Customer Name" 
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                required
                style={{ width: '100%', height: '48px', padding: '0 14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)', background: '#22222e', color: '#f1f1f6', outline: 'none' }}
              />
              <textarea 
                placeholder="Review Text..." 
                value={newReview}
                onChange={(e) => setNewReview(e.target.value)}
                required
                rows="4"
                style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)', background: '#22222e', color: '#f1f1f6', outline: 'none', resize: 'vertical' }}
              />
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button type="button" onClick={handleCloseModal} className="sp-btn" style={{ background: 'rgba(255,255,255,0.1)', color: '#9898b3', padding: '0 24px' }}>Cancel</button>
                <button type="submit" disabled={isSubmitting} className="sp-btn" style={{ background: '#d875db', color: '#fff', padding: '0 24px' }}>
                  {isSubmitting ? 'Saving...' : 'Save Testimonial'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deletingId && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }} onClick={() => setDeletingId(null)}>
          <div style={{ background: '#1a1a24', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '32px', width: '100%', maxWidth: '400px', textAlign: 'center', position: 'relative' }} onClick={(e) => e.stopPropagation()}>
            <button type="button" onClick={() => setDeletingId(null)} style={{ position: 'absolute', top: 16, right: 16, background: 'transparent', border: 'none', color: '#9898b3', fontSize: 24, cursor: 'pointer' }}>×</button>
            <h3 style={{ color: '#f1f1f6', fontSize: '20px', marginBottom: '16px', marginTop: 0 }}>Delete Testimonial</h3>
            <p style={{ color: '#9898b3', fontSize: '14px', marginBottom: '24px' }}>Are you sure you want to delete this testimonial?</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button onClick={() => setDeletingId(null)} style={{ padding: '10px 24px', background: 'rgba(255,255,255,0.05)', color: '#9898b3', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
              <button onClick={handleDelete} style={{ padding: '10px 24px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Delete</button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
    </>
  );
};

export default Showalltestimonial;

