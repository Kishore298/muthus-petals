import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import "./showproducts.css";
import AdminNavbar from '../AdminNavbar';
import UpdateProductModal from '../updateproducts/Updateproduct';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const Showallproducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [editingProductId, setEditingProductId] = useState(null);
  const [deletingProductId, setDeletingProductId] = useState(null);

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

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async () => {
    if (!deletingProductId) return;
    try {
      const token = localStorage.getItem('tokens');
      await axios.delete(`${BASE_URL}/api/v1/products/delete/${deletingProductId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(products.filter(p => p._id !== deletingProductId));
    } catch (err) {
      console.error("Error deleting product:", err);
    } finally {
      setDeletingProductId(null);
    }
  };

  if (loading) return <div className="sp-state">Loading products…</div>;
  if (error)   return <div className="sp-state">{error}</div>;
  if (products.length === 0) return <div className="sp-state">No products found.</div>;

  return (
    <>
    <AdminNavbar />
    <div className="admin-page">
      <div style={{ maxWidth: '850px', margin: '0 auto', width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' }}>
           <div>
              <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#f1f1f6', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                 🛍️ All Products
              </h1>
              <p style={{ margin: '4px 0 0', color: '#9898b3', fontSize: '14px', fontWeight: 500 }}>{products.length} products in store</p>
           </div>
           <span style={{ fontSize: '13px', color: '#5c5c78', fontWeight: 500 }}>Drag and drop cards to reorder</span>
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
              <button className="sp-btn edit" onClick={() => setEditingProductId(product._id)}>Edit</button>
              <button className="sp-btn del" onClick={() => setDeletingProductId(product._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
      </div>

      {editingProductId && (
        <UpdateProductModal 
          productId={editingProductId} 
          onClose={() => setEditingProductId(null)} 
          onSuccess={fetchProducts} 
        />
      )}

      {deletingProductId && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: '#1a1a24', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '32px', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
            <h3 style={{ color: '#f1f1f6', fontSize: '20px', marginBottom: '16px', marginTop: 0 }}>Delete Product</h3>
            <p style={{ color: '#9898b3', fontSize: '14px', marginBottom: '24px' }}>Are you sure you want to delete this product? This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button onClick={() => setDeletingProductId(null)} style={{ padding: '10px 24px', background: 'rgba(255,255,255,0.05)', color: '#9898b3', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
              <button onClick={handleDelete} style={{ padding: '10px 24px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default Showallproducts;

