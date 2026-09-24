import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./toastify.css";
import AdminNavbar from "../AdminNavbar";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Createproducts = () => {
  const [name, setProductname] = useState("");
  const [price, setPrice] = useState("");
  const [color, setcolor] = useState("");
  const [cutprice, setcutprice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [describe, setDescription] = useState("");
  const [seller, setSeller] = useState("");
  const [rating, setRating] = useState("");
  const [size, setSize] = useState("100");
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
    setPreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
  };

  const removeImage = (idx) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
    setPreviews((prev) => prev.filter((_, i) => i !== idx));
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
    images.forEach((image) => formData.append("images", image));

    try {
      const result = await axios.post(`${BASE_URL}/api/v1/products/new`, formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });
      if (result) {
        toast.success("Product created successfully!");
        navigate("/showallproducts");
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to create product.";
      toast.error(msg);
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AdminNavbar />
      <ToastContainer theme="dark" />
      <div className="cp-page">
        <div className="cp-header">
          <h1> Create Product</h1>
        </div>

        <div className="cp-form-card">
          <form onSubmit={handleSubmit}>
            <div className="cp-form-grid">

              <div className="cp-form-field full">
                <label>Product Name</label>
                <input type="text" required placeholder="e.g. Kuppaimeni Herbal Soap" className="cp-input" value={name} onChange={(e) => setProductname(e.target.value)} />
              </div>

              <div className="cp-form-field full">
                <label>Description</label>
                <textarea required placeholder="Product description..." className="cp-input" style={{ height: '120px', padding: '12px', resize: 'vertical' }} value={describe} onChange={(e) => setDescription(e.target.value)} />
              </div>

              <div className="cp-form-field">
                <label>Price (₹)</label>
                <input type="number" required placeholder="299" className="cp-input" value={price} onChange={(e) => setPrice(e.target.value)} />
              </div>

              <div className="cp-form-field">
                <label>Cut Price (₹)</label>
                <input type="number" required placeholder="399" className="cp-input" value={cutprice} onChange={(e) => setcutprice(e.target.value)} />
              </div>

              <div className="cp-form-field">
                <label>Stock</label>
                <input type="number" required placeholder="50" className="cp-input" value={stock} onChange={(e) => setStock(e.target.value)} />
              </div>

              <div className="cp-form-field">
                <label>Rating</label>
                <input type="number" required placeholder="4.5" step="0.1" min="0" max="5" className="cp-input" value={rating} onChange={(e) => setRating(e.target.value)} />
              </div>

              <div className="cp-form-field">
                <label>Category</label>
                <select className="cp-select" required value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="">Select category</option>
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

              <div className="cp-form-field">
                <label>Color</label>
                <select className="cp-select" required value={color} onChange={(e) => setcolor(e.target.value)}>
                  <option value="">Select color</option>
                  <option value="black">Black</option>
                  <option value="white">White</option>
                  <option value="green">Green</option>
                  <option value="beige">Beige</option>
                </select>
              </div>

              <div className="cp-form-field">
                <label>Seller</label>
                <input type="text" required placeholder="Petals Naturals" className="cp-input" value={seller} onChange={(e) => setSeller(e.target.value)} />
              </div>

              <div className="cp-form-field">
                <label>
                  Size {
                    category === "Hair Oil" || category === "Root Revive Hair Oil" || category === "Shampoo" ? "(ml)" :
                    category === "Face Serum" || category === "Facewash" ? "(mg)" :
                    category.includes("Soap") || category === "Lipbom" ? "(g)" :
                    "(ml / g)"
                  }
                </label>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g. 100" 
                  className="cp-input" 
                  value={size} 
                  onChange={(e) => setSize(e.target.value)} 
                />
              </div>

              <div className="cp-form-field full">
                <label>Product Images</label>
                <input type="file" required={images.length === 0} multiple accept="image/*" className="cp-file-input" onChange={handleFileChange} />
                {previews.length > 0 && (
                  <div className="cp-preview-row">
                    {previews.map((src, i) => (
                      <div key={i} style={{ position: 'relative', display: 'inline-block' }}>
                        <img src={src} className="cp-preview-thumb" alt={`Preview ${i + 1}`} style={{ display: 'block' }} />
                        <button
                          type="button"
                          onClick={() => removeImage(i)}
                          title="Remove image"
                          style={{
                            position: 'absolute',
                            top: -6,
                            right: -6,
                            width: 20,
                            height: 20,
                            borderRadius: '50%',
                            background: '#ef4444',
                            border: '2px solid #1a1a24',
                            color: '#fff',
                            fontSize: 11,
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            lineHeight: 1,
                            padding: 0,
                            zIndex: 2,
                          }}
                        >×</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="cp-form-field full">
                <button type="submit" className="cp-submit-btn" disabled={loading}>
                  {loading ? "Uploading & Creating..." : "Create Product"}
                </button>
              </div>

            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Createproducts;

