import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import "./showproducts.css";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const Showallproducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/v1/products`);
        const sorted = res.data.product.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setProducts(sorted);
      } catch (err) {
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const token = localStorage.getItem('tokens');
      await axios.delete(`${BASE_URL}/api/v1/products/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(products.filter(p => p._id !== id));
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  if (loading) return <div className="sp-state">Loading products…</div>;
  if (error)   return <div className="sp-state">{error}</div>;
  if (products.length === 0) return <div className="sp-state">No products found.</div>;

  return (
    <div className="sp-page">
      <div className="sp-header">
        <h1>🛍️ All Products</h1>
        <Link to="/dashbroad" className="sp-back-link">← Dashboard</Link>
      </div>
      <p className="sp-count">{products.length} products in store</p>

      <div className="sp-grid">
        {products.map((product) => (
          <div className="sp-card" key={product._id}>
            <div className="sp-img-wrap" onClick={() => navigate(`/products/${product._id}`)}>
              {product.images && product.images.length > 0 ? (
                <img className="sp-img" src={product.images[0]} alt={product.name} />
              ) : (
                <div className="sp-no-img">🧴</div>
              )}
            </div>
            <div className="sp-info">
              <p className="sp-name">{product.name}</p>
              <div className="sp-meta">
                <span className="sp-price">₹{product.price}</span>
                <span className="sp-stock">Stock: {product.stock}</span>
              </div>
            </div>
            <div className="sp-actions">
              <button className="sp-btn edit" onClick={() => navigate(`/products/update/${product._id}`)}>Edit</button>
              <button className="sp-btn del" onClick={() => handleDelete(product._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Showallproducts;

