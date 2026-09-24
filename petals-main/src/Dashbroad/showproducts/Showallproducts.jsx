import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import "./showproducts.css";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const Showallproducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // For Drag and Drop
  const dragItem = useRef(null);
  const dragOverItem = useRef(null);

  const handleDragStart = (e, index) => {
    dragItem.current = index;
  };

  const handleDragEnter = (e, index) => {
    dragOverItem.current = index;
    const copyProducts = [...products];
    const dragItemContent = copyProducts[dragItem.current];
    copyProducts.splice(dragItem.current, 1);
    copyProducts.splice(dragOverItem.current, 0, dragItemContent);
    dragItem.current = dragOverItem.current;
    setProducts(copyProducts);
  };

  const handleDragEnd = async () => {
    dragItem.current = null;
    dragOverItem.current = null;
    
    try {
      const token = localStorage.getItem('tokens');
      const orderedIds = products.map(p => p._id);
      await axios.put(`${BASE_URL}/api/v1/products/reorder`, 
        { orderedIds },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Error saving new order:", err);
      alert("Failed to save the new order. Please try again.");
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/v1/products`);
        setProducts(res.data.product);
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
      <div className="sp-controls" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', padding: '0 20px' }}>
        <p className="sp-count" style={{ margin: 0 }}>{products.length} products in store</p>
        <span style={{ fontSize: '14px', color: '#666' }}>Drag and drop cards to reorder</span>
      </div>

      <div className="sp-grid">
        {products.map((product, index) => (
          <div 
            className="sp-card" 
            key={product._id}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragEnter={(e) => handleDragEnter(e, index)}
            onDragEnd={handleDragEnd}
            onDragOver={(e) => e.preventDefault()}
            style={{ cursor: 'grab' }}
          >
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

