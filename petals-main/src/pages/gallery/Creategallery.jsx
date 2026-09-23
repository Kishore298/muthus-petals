import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "./Gallery.css"; 

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Creategallery = () => {
  const [beforeFile, setBeforeFile] = useState(null);
  const [afterFile, setAfterFile] = useState(null);
  const [beforePreview, setBeforePreview] = useState(null);
  const [afterPreview, setAfterPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
        navigate("/gallery");
      }
    } catch (err) {
      console.error("Upload error:", err);
      toast.error(err.response?.data?.error || "Failed to upload image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      
      <div className="gallery-container">
        <div style={{ maxWidth: '600px', margin: '40px auto', padding: '24px', background: '#fff', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <Link to="/dashbroad" className="btn btn-outline-secondary btn-sm mb-3">
             Back to Dashboard
          </Link>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 800, marginBottom: '20px', color: '#1a1a2e' }}>Add to Customer Gallery</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="row mb-4">
              <div className="col-md-6">
                <label className="form-label" style={{ fontWeight: 600, color: '#4a5568' }}>Before Photo</label>
                <input type="file" accept="image/*" required className="form-control" onChange={handleBeforeChange} />
                {beforePreview && <img src={beforePreview} alt="Before preview" style={{ maxWidth: '100%', maxHeight: '150px', marginTop: '10px', borderRadius: '8px', objectFit: 'contain' }} />}
              </div>
              <div className="col-md-6">
                <label className="form-label" style={{ fontWeight: 600, color: '#4a5568' }}>After Photo</label>
                <input type="file" accept="image/*" required className="form-control" onChange={handleAfterChange} />
                {afterPreview && <img src={afterPreview} alt="After preview" style={{ maxWidth: '100%', maxHeight: '150px', marginTop: '10px', borderRadius: '8px', objectFit: 'contain' }} />}
              </div>
            </div>

            <button type="submit" className="btn btn-success w-100" disabled={loading} style={{ padding: '12px', fontSize: '1rem', fontWeight: 600, borderRadius: '8px', transition: 'all 0.2s' }}>
              {loading ? "Uploading to Cloudflare R2..." : "Upload Comparison"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Creategallery;
