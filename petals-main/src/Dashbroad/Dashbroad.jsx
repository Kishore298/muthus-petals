import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./Dashord.css";
import { Link } from 'react-router-dom';
import AdminNavbar from './AdminNavbar';
import { requestForToken, onMessageListener } from '../firebase';
import { toast } from 'react-toastify';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const MENU_ITEMS = [
  {
    icon: '', label: 'Create Product', desc: 'Add new skincare products to the store.', to: '/createproduct', color: 'purple',
  },
  {
    icon: '', label: 'All Products', desc: 'View, edit and delete existing products.', to: '/showallproducts', color: 'blue',
  },
  {
    icon: '', label: 'View Orders', desc: 'Manage customer orders and update status.', to: '/showallorders', color: 'green',
  },
  {
    icon: '', label: 'Testimonials', desc: 'Review and manage customer testimonials.', to: '/Showalltestimonial', color: 'orange',
  },
  {
    icon: '', label: 'Customer Gallery', desc: 'Upload and manage the customer photo gallery.', to: '/creategallery', color: 'pink',
  },
];

const Dashbroad = () => {
  const [outOfStockProducts, setOutOfStockProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/v1/products`);
        if (res.data && res.data.product) {
          const outOfStock = res.data.product.filter(p => p.stock <= 0);
          setOutOfStockProducts(outOfStock);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Firebase Push Notifications Setup
  useEffect(() => {
    const setupNotifications = async () => {
      // TODO: Replace with your actual VAPID key from Firebase Console
      const vapidKey = "BKbTMm8GuLfR8BfkAnw3Ha18UlmH_BmmRFKWCA3bmVd9YkuzdbqEMNJmHvo0dtPxzUouZ4JQ7jWtmPGx98qp9zU";

      const token = await requestForToken(vapidKey);
      if (token) {
        try {
          await axios.post(`${BASE_URL}/api/v1/admin/subscribe-notifications`, { fcmToken: token });
          console.log("Successfully subscribed to admin_orders push notifications!");
        } catch (err) {
          console.error("Failed to subscribe to admin_orders:", err);
        }
      }
    };
    setupNotifications();

    // Listen for foreground messages
    onMessageListener().then((payload) => {
      toast.info(`🔔 ${payload.notification.title}: ${payload.notification.body}`);
    }).catch(err => console.log('failed: ', err));
  }, []);

  return (
    <>
      <AdminNavbar />
      <div className="dash-page">
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', marginBottom: '16px' }}>
          <svg style={{ marginRight: '8px', color: '#5c5c78' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
          <p className="dash-section-title" style={{ margin: 0 }}>Quick Actions</p>
        </div>

        {/* Cards grid */}
        <div className="dash-grid">
          {MENU_ITEMS.map((item) => (
            <div className="dash-card" key={item.to}>

              <div className="dash-card-info">
                <h3>{item.label}</h3>
                <p>{item.desc}</p>
              </div>
              <Link to={item.to} className="dash-card-link">
                Open →
              </Link>
            </div>
          ))}
        </div>

        {/* Out of stock alert section */}
        <div style={{ maxWidth: '1100px', margin: '40px auto 16px', display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
          <svg style={{ marginRight: '8px', color: '#eab308' }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
          <p className="dash-section-title" style={{ margin: 0, color: '#eab308' }}>Out of Stock Alert</p>
        </div>

        <div style={{ maxWidth: '1100px', margin: '0 auto', background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #f1f1f6', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          {loading ? (
            <p style={{ color: '#9ca3af', fontSize: '14px' }}>Checking inventory...</p>
          ) : outOfStockProducts.length === 0 ? (
            <p style={{ color: '#10b981', fontSize: '14px', margin: 0 }}>✅ All products are currently in stock!</p>
          ) : (
            <div style={{ display: 'grid', gap: '12px', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
              {outOfStockProducts.map((product) => (
                <div key={product._id} style={{ display: 'flex', alignItems: 'center', padding: '12px', background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '8px', gap: '12px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '6px', overflow: 'hidden', flexShrink: 0, background: '#fff' }}>
                    {product.images && product.images.length > 0 ? (
                      <img src={product.images[0]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', fontSize: '10px' }}>No img</div>
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: 600, color: '#991b1b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {product.name}
                    </p>
                    <p style={{ margin: 0, fontSize: '12px', color: '#b91c1c' }}>
                      Stock: {product.stock}
                    </p>
                  </div>
                  <Link to={`/updateproduct/${product._id}`} style={{ padding: '6px 12px', background: '#ef4444', color: '#fff', textDecoration: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 500, flexShrink: 0 }}>
                    Update
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </>
  );
};

export default Dashbroad;
