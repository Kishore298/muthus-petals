import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminNavbar from "../../Dashbroad/AdminNavbar";
import "../../Dashbroad/showproducts/showproducts.css"; // Reuse the beautiful admin theme

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Creategallery = () => {
  const [beforeFile, setBeforeFile] = useState(null);
  const [afterFile, setAfterFile] = useState(null);
  const [beforePreview, setBeforePreview] = useState(null);
  const [afterPreview, setAfterPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [galleryImages, setGalleryImages] = useState([]);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const fetchGallery = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/v1/gallery`);
      setGalleryImages(res.data || []);
    } catch (err) {
      console.error("Error fetching gallery:", err);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleBeforeChange = (e) => {
    const selectedFile = e.target.files[0];
    setBeforeFile(selectedFile);
    if (selectedFile) setBeforePreview(URL.createObjectURL(selectedFile));
    else setBeforePreview(null);
  };

  const handleAfterChange = (e) => {
    const selectedFile = e.target.files[0];
    setAfterFile(selectedFile);
    if (selectedFile) setAfterPreview(URL.createObjectURL(selectedFile));
    else setAfterPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!beforeFile || !afterFile) {
      toast.error("Please select both Before and After image files.");
      return;
    }

    setLoading(true);
    const token = localStorage.getItem("tokens");
    const formData = new FormData();
    formData.append("beforeImage", beforeFile);
    formData.append("afterImage", afterFile);

    try {
      const res = await axios.post(`${BASE_URL}/api/v1/gallery/upload-comparison`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data) {
        toast.success("Comparison successfully added to Customer Gallery!");
        handleCloseModal();
        fetchGallery(); // Refresh the list
      }
    } catch (err) {
      console.error("Upload error:", err);
      toast.error(err.response?.data?.error || "Failed to upload image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await axios.delete(`${BASE_URL}/api/v1/gallery/${deletingId}`);
      setGalleryImages(prev => prev.filter(img => img._id !== deletingId));
      toast.success("Deleted successfully!");
    } catch (err) {
      console.error("Error deleting gallery item:", err);
      toast.error("Failed to delete gallery item. Endpoint might not be implemented.");
    } finally {
      setDeletingId(null);
    }
  }

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setBeforeFile(null);
    setAfterFile(null);
    setBeforePreview(null);
    setAfterPreview(null);
  };

  return (
    <>
    <ToastContainer theme="dark" />
    <AdminNavbar />
    <div className="admin-page" style={{ position: 'relative' }}>
      <div style={{ maxWidth: '850px', margin: '0 auto', width: '100%' }}>
      <div className="sp-header" style={{ flexWrap: 'nowrap', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0 }}>Customer Gallery</h1>
        <button className="sp-btn" style={{ background: '#d875db', color: '#fff', padding: '0 16px', width: 'fit-content', flexShrink: 0, height: '32px', fontSize: '12px', whiteSpace: 'nowrap' }} onClick={handleOpenModal}>
          + Add New Gallery Image
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: '#1a1a24', borderRadius: '20px', padding: '32px', width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <h3 style={{ marginBottom: '24px', color: '#f1f1f6', fontSize: '22px', fontFamily: 'Cormorant Garamond, serif', fontWeight: 600 }}>
              Upload Before & After
            </h3>
            
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', marginBottom: '24px' }}>
                <div style={{ flex: '1', minWidth: '250px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#9898b3', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Before Photo</label>
                  <input type="file" accept="image/*" required onChange={handleBeforeChange} style={{ width: '100%', padding: '12px', background: '#22222e', color: '#9898b3', border: '1px dashed rgba(216, 117, 219, 0.4)', borderRadius: '10px', cursor: 'pointer' }} />
                  {beforePreview && <img src={beforePreview} alt="Before preview" style={{ width: '100%', height: '200px', marginTop: '16px', borderRadius: '12px', objectFit: 'cover' }} />}
                </div>
                
                <div style={{ flex: '1', minWidth: '250px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#9898b3', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>After Photo</label>
                  <input type="file" accept="image/*" required onChange={handleAfterChange} style={{ width: '100%', padding: '12px', background: '#22222e', color: '#9898b3', border: '1px dashed rgba(216, 117, 219, 0.4)', borderRadius: '10px', cursor: 'pointer' }} />
                  {afterPreview && <img src={afterPreview} alt="After preview" style={{ width: '100%', height: '200px', marginTop: '16px', borderRadius: '12px', objectFit: 'cover' }} />}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={handleCloseModal} className="sp-btn" style={{ background: 'rgba(255,255,255,0.1)', color: '#9898b3', padding: '0 24px' }}>Cancel</button>
                <button type="submit" disabled={loading} className="sp-btn" style={{ background: '#d875db', color: '#fff', padding: '0 24px' }}>
                  {loading ? "Uploading..." : "Upload Comparison"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {galleryImages.length === 0 ? (
        <div className="sp-state">No gallery images uploaded yet.</div>
      ) : (
        <div className="sp-grid gallery-grid">
          {galleryImages.map((img) => (
            <div className="sp-card" key={img._id} style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', height: '200px' }}>
                <div style={{ flex: 1, borderRight: '1px solid rgba(255,255,255,0.06)' }}>
                  <img src={img.beforeImageUrl} alt="Before" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <img src={img.afterImageUrl} alt="After" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              </div>
              <div className="sp-actions" style={{ gridTemplateColumns: '1fr', marginTop: '16px' }}>
                <button className="sp-btn del" onClick={() => setDeletingId(img._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {deletingId && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: '#1a1a24', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '32px', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
            <h3 style={{ color: '#f1f1f6', fontSize: '20px', marginBottom: '16px', marginTop: 0 }}>Delete Gallery Image</h3>
            <p style={{ color: '#9898b3', fontSize: '14px', marginBottom: '24px' }}>Are you sure you want to delete this image?</p>
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

export default Creategallery;
