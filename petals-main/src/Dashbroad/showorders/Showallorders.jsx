import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './showorders.css';
import AdminNavbar from '../AdminNavbar';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const STATUS_BADGE = (s = 'Processing') => {
  const cls = s.toLowerCase().includes('deliver') ? 'delivered'
    : s.toLowerCase() === 'shipped' ? 'shipped' : 'processing';
  return <span className={`so-badge ${cls}`}>{s}</span>;
};

export const Showallorders = () => {
  const [orders, setOrders] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  
  // Modal state
  const [deletingId, setDeletingId] = useState(null);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('tokens');
      const res = await axios.get(`${BASE_URL}/api/v1/admin/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data && res.data.success) {
        const sorted = res.data.order.sort(
          (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        );
        setOrders(sorted);
        setTotalRevenue(res.data.totalamount || 0);
      } else {
        setError("Failed to load orders.");
      }
    } catch (err) {
      setError("Failed to load orders. Make sure you are logged in as admin.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('tokens');
      const res = await axios.put(`${BASE_URL}/api/v1/admin/order/${id}`,
        { orderStatus: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data && res.data.success) {
        setOrders(orders.map(o => o._id === id ? { ...o, orderStatus: newStatus } : o));
        toast.success("Order status updated!");
      } else {
        toast.error("Failed to update order status.");
      }
    } catch (err) {
      console.error("Error updating status:", err);
      toast.error("Failed to update order status.");
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      const token = localStorage.getItem('tokens');
      const res = await axios.delete(`${BASE_URL}/api/v1/admin/order/${deletingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data && res.data.success) {
        setOrders(orders.filter(o => o._id !== deletingId));
        toast.success("Order deleted successfully!");
      }
    } catch (err) {
      console.error("Error deleting order:", err);
      toast.error("Failed to delete order.");
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = orders.filter(order => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      (order.name && order.name.toLowerCase().includes(q)) ||
      (order.email && order.email.toLowerCase().includes(q)) ||
      (order.phone && order.phone.toLowerCase().includes(q)) ||
      (order._id && order._id.toLowerCase().includes(q));
    const matchStatus = statusFilter === "All" || order.orderStatus === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalOrders     = orders.length;
  const processingCount = orders.filter(o => o.orderStatus === 'Processing').length;
  const shippedCount    = orders.filter(o => o.orderStatus === 'Shipped').length;
  const deliveredCount  = orders.filter(o => ['delivered','Delivered'].includes(o.orderStatus)).length;

  if (loading) return <div className="so-state">Loading orders…</div>;
  if (error)   return (
    <>
    <AdminNavbar />
    <div className="so-page">
      <div className="so-header">
        <h1>📋 Orders</h1>
      </div>
      <div className="so-state">{error}</div>
    </div>
    </>
  );

  return (
    <>
    <ToastContainer theme="dark" />
    <AdminNavbar />
    <div className="so-page">
      <div style={{ maxWidth: '850px', margin: '0 auto', width: '100%' }}>
      <div className="so-header">
        <h1>📋 Order Management</h1>
      </div>

      {/* Stats */}
      <div className="so-stats">
        <div className="so-stat">
          <p className="so-stat-label">Total Revenue</p>
          <p className="so-stat-value purple">₹{totalRevenue.toLocaleString('en-IN')}</p>
        </div>
        <div className="so-stat">
          <p className="so-stat-label">Total Orders</p>
          <p className="so-stat-value">{totalOrders}</p>
        </div>
        <div className="so-stat">
          <p className="so-stat-label">Processing</p>
          <p className="so-stat-value orange">{processingCount}</p>
        </div>
        <div className="so-stat">
          <p className="so-stat-label">Shipped</p>
          <p className="so-stat-value blue">{shippedCount}</p>
        </div>
        <div className="so-stat">
          <p className="so-stat-label">Delivered</p>
          <p className="so-stat-value green">{deliveredCount}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="so-filters">
        <input
          type="text"
          className="so-search"
          placeholder="Search by ID, name, email or phone…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {["All","Processing","Shipped","Delivered"].map(s => (
          <button
            key={s}
            className={`so-filter-btn ${statusFilter === s ? 'active' : ''}`}
            onClick={() => setStatusFilter(s)}
          >{s}</button>
        ))}
      </div>

      {/* Orders */}
      {filtered.length === 0 ? (
        <div className="so-empty">No orders match the current filter.</div>
      ) : (
        <div className="so-list">
          {filtered.map((order) => (
            <div className="so-card" key={order._id}>
              {/* Head */}
              <div className="so-card-head">
                <div>
                  <p className="so-order-date">
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' })
                      : 'Date N/A'}
                  </p>
                </div>
                {STATUS_BADGE(order.orderStatus)}
              </div>

              {/* Body grid */}
              <div className="so-card-body">
                <div className="so-section">
                  <h4>Customer</h4>
                  <p><strong>Name:</strong> {order.name}</p>
                  <p><strong>Email:</strong> {order.email}</p>
                  <p><strong>Phone:</strong> {order.phone}</p>
                </div>
                <div className="so-section">
                  <h4>Shipping Address</h4>
                  <p>{order.address}</p>
                  <p>{order.city} – {order.pin}</p>
                  <p>{order.country}</p>
                </div>
              </div>

              {/* Items table */}
              <div className="so-items-wrap">
                <h4>Order Items</h4>
                {order.orderItems && order.orderItems.length > 0 ? (
                  <table className="so-table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Attributes</th>
                        <th>Qty</th>
                        <th>Price</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.orderItems.map((item, idx) => (
                        <tr key={item._id || idx}>
                          <td>{item.name}</td>
                          <td>
                            {item.size  && <span className="so-attr">{item.size} ml</span>}
                            {item.color && <span className="so-attr">{item.color}</span>}
                          </td>
                          <td>{item.quantity}</td>
                          <td>₹{item.price}</td>
                          <td>₹{item.price * item.quantity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p style={{ color: '#5c5c78', paddingBottom: '14px', fontSize: '13px' }}>No items recorded.</p>
                )}
              </div>

              {/* Footer */}
              <div className="so-card-foot">
                <div className="so-totals">
                  <span className="so-shipping">Shipping: ₹{order.shippingCharge || 0}</span>
                  <span className="so-total-price">Total: ₹{order.totalprice || 0}</span>
                </div>
                <div className="so-actions">
                  <span className="so-status-label">Status:</span>
                  <select
                    className="so-status-select"
                    value={order.orderStatus || 'Processing'}
                    onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                  >
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                  <button className="so-del-btn" onClick={() => setDeletingId(order._id)}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {deletingId && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }} onClick={() => setDeletingId(null)}>
          <div style={{ background: '#1a1a24', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '32px', width: '100%', maxWidth: '400px', textAlign: 'center', position: 'relative' }} onClick={(e) => e.stopPropagation()}>
            <button type="button" onClick={() => setDeletingId(null)} style={{ position: 'absolute', top: 16, right: 16, background: 'transparent', border: 'none', color: '#9898b3', fontSize: 24, cursor: 'pointer' }}>×</button>
            <h3 style={{ color: '#f1f1f6', fontSize: '20px', marginBottom: '16px', marginTop: 0 }}>Delete Order</h3>
            <p style={{ color: '#9898b3', fontSize: '14px', marginBottom: '24px' }}>Are you sure you want to delete this order? This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button onClick={() => setDeletingId(null)} style={{ padding: '10px 24px', background: 'rgba(255,255,255,0.05)', color: '#9898b3', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
              <button onClick={handleDelete} style={{ padding: '10px 24px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Delete</button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
    </>
  );
};

export default Showallorders;

