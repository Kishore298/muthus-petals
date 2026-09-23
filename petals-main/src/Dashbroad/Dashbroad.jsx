import React from 'react';
import "./Dashord.css";
import { Link } from 'react-router-dom';

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
    <div className="dash-page">
      {/* Top bar */}
      <div className="dash-topbar">
        <div className="dash-logo">
          <div className="dash-logo-icon"></div>
          <div>
            <h1>Petals Admin</h1>
            <span>Store Management Dashboard</span>
          </div>
        </div>
        <Link to="/" className="dash-home-link">
          ← Back to Store
        </Link>
      </div>

      <p className="dash-section-title">Quick Actions</p>

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
  );
};

export default Dashbroad;
