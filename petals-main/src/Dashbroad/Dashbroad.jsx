import React from 'react';
import "./Dashord.css";
import { Link } from 'react-router-dom';
import AdminNavbar from './AdminNavbar';

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
      </div>
    </>
  );
};

export default Dashbroad;
