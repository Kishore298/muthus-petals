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
          // Only show items with 0 stock that are ALSO not explicitly marked as available
          const outOfStock = res.data.product.filter(p => p.stock <= 0 && !p.isAvailable);
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
        {(!loading && outOfStockProducts.length > 0) ? (
          <div style={{ maxWidth: '1100px', margin: '40px auto 24px', animation: 'fadeIn 0.5s ease-out' }}>
            <div style={{
              background: 'linear-gradient(135deg, #fff5f5 0%, #fff 100%)',
              border: '1px solid #fecaca',
              borderRadius: '16px',
              boxShadow: '0 10px 25px -5px rgba(239, 68, 68, 0.1), 0 8px 10px -6px rgba(239, 68, 68, 0.1)',
              overflow: 'hidden'
            }}>
              <div style={{
                background: 'linear-gradient(90deg, #ef4444 0%, #dc2626 100%)',
                padding: '16px 24px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  padding: '8px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                    <line x1="12" y1="9" x2="12" y2="13"></line>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                  </svg>
                </div>
                <h2 style={{ margin: 0, color: '#fff', fontSize: '18px', fontWeight: 600, letterSpacing: '0.5px' }}>
                  Action Required: Out of Stock
                </h2>
                <span style={{ 
                  marginLeft: 'auto', 
                  background: '#fff', 
                  color: '#dc2626', 
                  padding: '4px 12px', 
                  borderRadius: '20px', 
                  fontSize: '13px', 
                  fontWeight: 700 
                }}>
                  {outOfStockProducts.length} Item{outOfStockProducts.length !== 1 ? 's' : ''}
                </span>
              </div>

              <div style={{ padding: '24px' }}>
                <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
                  {outOfStockProducts.map((product) => (
                    <div key={product._id} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      padding: '16px', 
                      background: '#fff', 
                      border: '1px solid #fecaca', 
                      borderRadius: '12px', 
                      gap: '16px',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                      boxShadow: '0 2px 4px rgba(239, 68, 68, 0.05)',
                      cursor: 'default'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 6px 12px rgba(239, 68, 68, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 4px rgba(239, 68, 68, 0.05)';
                    }}>
                      <div style={{ width: '64px', height: '64px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0, border: '1px solid #f3f4f6' }}>
                        {product.images && product.images.length > 0 ? (
                          <img src={product.images[0]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fafb', color: '#9ca3af', fontSize: '11px', fontWeight: 500 }}>No img</div>
                        )}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ margin: '0 0 6px', fontSize: '15px', fontWeight: 600, color: '#1f2937', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {product.name}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ 
                            display: 'inline-block', 
                            width: '8px', 
                            height: '8px', 
                            borderRadius: '50%', 
                            background: '#ef4444' 
                          }}></span>
                          <p style={{ margin: 0, fontSize: '13px', color: '#ef4444', fontWeight: 500 }}>
                            Stock: {product.stock}
                          </p>
                        </div>
                      </div>
                      <Link to={`/updateproduct/${product._id}`} style={{ 
                        padding: '8px 16px', 
                        background: '#ef4444', 
                        color: '#fff', 
                        textDecoration: 'none', 
                        borderRadius: '8px', 
                        fontSize: '13px', 
                        fontWeight: 600, 
                        flexShrink: 0,
                        transition: 'background 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#dc2626'}
                      onMouseLeave={(e) => e.currentTarget.style.background = '#ef4444'}>
                        Update
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          !loading && (
            <div style={{ maxWidth: '1100px', margin: '40px auto 16px', padding: '20px', background: '#ecfdf5', border: '1px solid #6ee7b7', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ background: '#34d399', padding: '6px', borderRadius: '50%' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <p style={{ color: '#065f46', fontSize: '15px', fontWeight: 500, margin: 0 }}>All products are healthy and in stock!</p>
            </div>
          )
        )}

      </div>
    </>
  );
};

export default Dashbroad;
