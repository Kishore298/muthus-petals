import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

/* ── inline styles (dark admin, matches Create Product page) ── */
const S = {
  page: { minHeight: '100vh', background: '#0f0f14', padding: '40px 24px', fontFamily: "'Inter',sans-serif", color: '#f1f1f6' },
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 32 },
  h1: { fontSize: 24, fontWeight: 800, color: '#f1f1f6', margin: 0 },
  backLink: { display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 10, padding: '9px 16px', color: '#9898b3', fontSize: 13, fontWeight: 500, cursor: 'pointer', border: 'none' },
  card: { background: '#1a1a24', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: '36px 32px', maxWidth: 760, margin: '0 auto' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 },
  full: { gridColumn: '1 / -1' },
  field: { display: 'flex', flexDirection: 'column', gap: 8 },
  label: { fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.6px', color: '#9898b3' },
  input: { height: 48, background: '#22222e', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '0 14px', fontSize: 14, color: '#f1f1f6', outline: 'none', width: '100%', fontFamily: 'inherit', transition: 'border-color 0.2s' },
  select: { height: 48, background: '#22222e', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '0 14px', fontSize: 14, color: '#f1f1f6', outline: 'none', width: '100%', fontFamily: 'inherit', appearance: 'none', cursor: 'pointer' },
  fileInput: { background: '#22222e', border: '1.5px dashed rgba(124,58,237,0.35)', borderRadius: 10, padding: '18px 14px', fontSize: 14, color: '#9898b3', cursor: 'pointer', width: '100%' },
  thumbRow: { display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 10 },
  thumb: { width: 72, height: 72, borderRadius: 8, objectFit: 'cover', border: '2px solid rgba(124,58,237,0.35)', position: 'relative' },
  thumbWrap: { position: 'relative', display: 'inline-block' },
  removeBtn: { position: 'absolute', top: -6, right: -6, width: 20, height: 20, borderRadius: '50%', background: '#ef4444', border: '2px solid #0f0f14', color: '#fff', fontSize: 11, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1, zIndex: 2, padding: 0 },
  submitBtn: { height: 50, background: 'linear-gradient(135deg,#7c3aed,#5b21b6)', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700, color: '#fff', cursor: 'pointer', width: '100%', marginTop: 8, letterSpacing: '0.3px', transition: 'all 0.25s' },
};

const Updateproducts = ({ productId, onClose, onSuccess }) => {

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [color, setColor] = useState("black");
  const [cutprice, setCutprice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("Soap");
  const [describe, setDescribe] = useState("");
  const [seller, setSeller] = useState("");
  const [rating, setRating] = useState("");
  const [size, setSize] = useState("100");
  const [newImages, setNewImages] = useState([]);
  const [newPreviews, setNewPreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  // Drag and drop refs for reordering existing images
  const dragItem = React.useRef(null);
  const dragOverItem = React.useRef(null);

  const handleDragStart = (e, index) => {
    dragItem.current = index;
  };

  const handleDragEnter = (e, index) => {
    dragOverItem.current = index;
    const copyImages = [...existingImages];
    const dragContent = copyImages[dragItem.current];
    copyImages.splice(dragItem.current, 1);
    copyImages.splice(dragOverItem.current, 0, dragContent);
    dragItem.current = dragOverItem.current;
    setExistingImages(copyImages);
  };

  const handleDragEnd = () => {
    dragItem.current = null;
    dragOverItem.current = null;
  };

  const removeExistingImage = (idx) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== idx));
  };

  /* Fetch existing product */
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem("tokens");
        const res = await axios.get(`${BASE_URL}/api/v1/products/${productId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const p = res.data.product;
        setName(p.name || "");
        setPrice(p.price || "");
        setColor(p.color || "black");
        setCutprice(p.cutprice || "");
        setStock(p.stock || "");
        setCategory(p.category || "Soap");
        setDescribe(p.describe || "");
        setSeller(p.seller || "");
        setRating(p.rating || "");
        setSize(p.size || "100");
        setExistingImages(p.images || []);
      } catch (err) {
        toast.error("Failed to load product details.");
        console.error("Fetch error:", err);
      } finally {
        setFetchLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImages((prev) => [...prev, ...files]);
    setNewPreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
  };

  const removeNewImage = (idx) => {
    setNewImages((prev) => prev.filter((_, i) => i !== idx));
    setNewPreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("tokens");
    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("color", color);
    formData.append("cutprice", cutprice);
    formData.append("stock", stock);
    formData.append("category", category);
    formData.append("describe", describe);
    formData.append("seller", seller);
    formData.append("rating", rating);
    formData.append("size", size);

    // Send remaining existing images so backend merges them with new uploads
    existingImages.forEach((url) => formData.append("keepImages", url));

    // Only append new files if admin selected any
    newImages.forEach((img) => formData.append("images", img));

    try {
      const res = await axios.put(
        `${BASE_URL}/api/v1/products/update/${productId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.success) {
        toast.success("Product updated successfully!");
        if (onSuccess) onSuccess();
        if (onClose) setTimeout(() => onClose(), 1200);
      } else {
        toast.error("Update failed. Please try again.");
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || "Update failed.";
      toast.error(msg);
      console.error("Update error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
        <p style={{ color: '#9898b3' }}>Loading product…</p>
      </div>
    );
  }

  return (
    <>
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
        
        <div style={{ ...S.card, width: '100%', maxHeight: '90vh', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          <div style={S.header}>
            <h1 style={{ ...S.h1, width: '100%', textAlign: 'center' }}>✏️ Update Product</h1>
            <button type="button" onClick={onClose} style={{ position: 'absolute', top: 20, right: 20, background: 'transparent', border: 'none', color: '#9898b3', fontSize: 24, cursor: 'pointer' }}>×</button>
          </div>

          <form onSubmit={handleSubmit} style={{ flexGrow: 1 }}>
            <div style={S.grid}>

              <div style={{ ...S.field, ...S.full }}>
                <label style={S.label}>Product Name</label>
                <input style={S.input} type="text" required placeholder="Product name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>

              <div style={{ ...S.field, ...S.full }}>
                <label style={S.label}>Description</label>
                <textarea style={{ ...S.input, height: '120px', padding: '12px', resize: 'vertical' }} required placeholder="Product description..." value={describe} onChange={(e) => setDescribe(e.target.value)} />
              </div>

              <div style={S.field}>
                <label style={S.label}>Price (₹)</label>
                <input style={S.input} type="number" required placeholder="299" value={price} onChange={(e) => setPrice(e.target.value)} />
              </div>

              <div style={S.field}>
                <label style={S.label}>Cut Price (₹)</label>
                <input style={S.input} type="number" required placeholder="399" value={cutprice} onChange={(e) => setCutprice(e.target.value)} />
              </div>

              <div style={S.field}>
                <label style={S.label}>Stock</label>
                <input style={S.input} type="number" required placeholder="50" value={stock} onChange={(e) => setStock(e.target.value)} />
              </div>

              <div style={S.field}>
                <label style={S.label}>Rating</label>
                <input style={S.input} type="number" step="0.1" min="0" max="5" placeholder="4.5" value={rating} onChange={(e) => setRating(e.target.value)} />
              </div>

              <div style={S.field}>
                <label style={S.label}>Category</label>
                <select style={S.select} value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="Shampoo">Shampoo</option>
                  <option value="Soap">Soap</option>
                  <option value="Charcoal Soap">Charcoal Soap</option>
                  <option value="Manjistha Soap">Manjistha Soap</option>
                  <option value="Kuppaimeni Soap">Kuppaimeni Soap</option>
                  <option value="Double Soap Combo">Double Soap Combo</option>
                  <option value="Face Serum">Face Serum</option>
                  <option value="Facewash">Facewash</option>
                  <option value="Lipbom">Lipbom</option>
                  <option value="Hair Oil">Hair Oil</option>
                  <option value="Root Revive Hair Oil">Root Revive Hair Oil</option>
                </select>
              </div>

              <div style={S.field}>
                <label style={S.label}>Color</label>
                <select style={S.select} value={color} onChange={(e) => setColor(e.target.value)}>
                  <option value="black">Black</option>
                  <option value="white">White</option>
                  <option value="green">Green</option>
                  <option value="beige">Beige</option>
                </select>
              </div>

              <div style={S.field}>
                <label style={S.label}>Seller</label>
                <input style={S.input} type="text" placeholder="Petals Naturals" value={seller} onChange={(e) => setSeller(e.target.value)} />
              </div>

              <div style={S.field}>
                <label style={S.label}>
                  Size {
                    category === "Hair Oil" || category === "Root Revive Hair Oil" || category === "Shampoo" ? "(ml)" :
                    category === "Face Serum" || category === "Facewash" ? "(mg)" :
                    category.includes("Soap") || category === "Lipbom" ? "(g)" :
                    "(ml / g)"
                  }
                </label>
                <input style={S.input} type="text" placeholder="e.g. 100" value={size} onChange={(e) => setSize(e.target.value)} />
              </div>

              {existingImages.length > 0 && (
                <div style={{ ...S.field, ...S.full }}>
                  <label style={S.label}>Current Images <span style={{ color: '#5c5c78', fontWeight: 400, textTransform: 'none' }}>— drag to reorder, click × to remove</span></label>
                  <div style={S.thumbRow}>
                    {existingImages.map((img, idx) => (
                      <div 
                        key={idx} 
                        style={{ ...S.thumbWrap, cursor: 'grab' }}
                        draggable
                        onDragStart={(e) => handleDragStart(e, idx)}
                        onDragEnter={(e) => handleDragEnter(e, idx)}
                        onDragEnd={handleDragEnd}
                        onDragOver={(e) => e.preventDefault()}
                      >
                        <img src={img} alt={`Current ${idx + 1}`} style={S.thumb} />
                        <button
                          type="button"
                          style={S.removeBtn}
                          onClick={() => removeExistingImage(idx)}
                          title="Remove image"
                        >×</button>
                      </div>
                    ))}
                  </div>
                  {existingImages.length === 0 && (
                    <p style={{ fontSize: 12, color: '#ef4444', marginTop: 6 }}>All images removed. Upload new images below or save to clear.</p>
                  )}
                </div>
              )}

              {/* New image upload */}
              <div style={{ ...S.field, ...S.full }}>
                <label style={S.label}>Replace Images (optional)</label>
                <input type="file" multiple accept="image/*" style={S.fileInput} onChange={handleFileChange} />
                {newPreviews.length > 0 && (
                  <div style={S.thumbRow}>
                    {newPreviews.map((src, i) => (
                      <div key={i} style={S.thumbWrap}>
                        <img src={src} alt={`New ${i + 1}`} style={{ ...S.thumb, border: '2px solid #34d399' }} />
                        <button
                          type="button"
                          style={S.removeBtn}
                          onClick={() => removeNewImage(i)}
                          title="Remove image"
                        >×</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ ...S.field, ...S.full }}>
                <button type="submit" style={S.submitBtn} disabled={loading}>
                  {loading ? "Saving Changes…" : "Save Changes"}
                </button>
              </div>

            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Updateproducts;

