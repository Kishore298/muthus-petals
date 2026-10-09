import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import './showorders.css';
import AdminNavbar from '../AdminNavbar';
import logoImg from '../../componets/images/logo.jpg';

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
  
  // Bulk Print State
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [selectedBulkIds, setSelectedBulkIds] = useState([]);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

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

  const generateBulkA4PDF = async (selectedIds) => {
    const selectedOrders = orders.filter(o => selectedIds.includes(o._id));
    if (selectedOrders.length === 0) {
      toast.error("No orders selected!");
      return;
    }

    const img = new Image();
    img.src = logoImg;
    await new Promise((resolve) => { img.onload = resolve; img.onerror = resolve; });

    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const receiptWidth = 105;
    const receiptHeight = 148.5;
    const margin = 5;

    selectedOrders.forEach((order, i) => {
      if (i > 0 && i % 4 === 0) doc.addPage();

      const quadrantIndex = i % 4;
      const offsetX = (quadrantIndex % 2) * receiptWidth;
      const offsetY = Math.floor(quadrantIndex / 2) * receiptHeight;
      let currentY = offsetY + 8;
      const centerX = offsetX + (receiptWidth / 2);

      // 1. Centered Brand Header
      // Logo (width 12, height 12) centered
      doc.addImage(img, 'JPEG', centerX - 6, currentY, 12, 12);
      currentY += 16;
      
      // Brand Name
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(91, 33, 182); // deep plum/purple
      doc.text("Muthu's Petals", centerX, currentY, { align: "center" });
      
      currentY += 5;
      // Tagline
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text("Premium Organic Care", centerX, currentY, { align: "center" });
      
      currentY += 4;
      // Website
      doc.setFontSize(7);
      doc.setTextColor(120, 120, 120);
      doc.text("www.muthuspetals.com", centerX, currentY, { align: "center" });
      
      currentY += 3.5;
      // Address and Phone
      doc.setFontSize(6.5);
      doc.text("Kolathur, Chennai - 600099 | Ph: +91 6381181527", centerX, currentY, { align: "center" });
      currentY += 8;

      // 2. Receipt Title
      doc.setFontSize(11);
      doc.setTextColor(40, 40, 40);
      doc.setFont("helvetica", "bold");
      doc.text("ORDER RECEIPT", centerX, currentY, { align: "center" });
      
      currentY += 5;
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      
      // Date format: DD/MM/YYYY
      const dateObj = new Date(order.createdAt);
      const formattedDate = `${dateObj.getDate().toString().padStart(2, '0')}/${(dateObj.getMonth() + 1).toString().padStart(2, '0')}/${dateObj.getFullYear()}`;
      
      doc.text(`Date: ${formattedDate}`, centerX, currentY, { align: "center" });
      
      if (order.razorpay_payment_id) {
        currentY += 4;
        doc.text(`Ref: ${order.razorpay_payment_id}`, centerX, currentY, { align: "center" });
      }

      currentY += 5;

      // 3. Customer Shipping Details
      // Light background for Ship To
      const shipToMargin = margin + 2;
      doc.setFillColor(250, 250, 250);
      
      // Calculate address block height
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      const addressString = `${order.address || ''}, ${order.city || ''} - ${order.pin || ''}`;
      const splitAddress = doc.splitTextToSize(addressString, receiptWidth - (shipToMargin * 2) - 4);
      
      // "SHIP TO" (4), Name (4), Phone (4), Address lines (4 * length)
      const shipToHeight = 18 + (splitAddress.length * 4);
      doc.rect(offsetX + margin, currentY, receiptWidth - (margin * 2), shipToHeight, "F");

      let shipY = currentY + 6;
      
      doc.setFontSize(7);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(91, 33, 182); // deep plum/purple
      doc.text("SHIP TO", offsetX + shipToMargin, shipY);
      
      shipY += 5;
      doc.setFontSize(8);
      doc.setTextColor(40, 40, 40);
      doc.text(order.name || 'Unknown', offsetX + shipToMargin, shipY);
      
      shipY += 4;
      doc.setFont("helvetica", "normal");
      doc.text(order.phone || '', offsetX + shipToMargin, shipY);
      
      shipY += 4;
      doc.text(splitAddress, offsetX + shipToMargin, shipY);
      
      currentY += shipToHeight + 6;

      const tableColumn = ["Item", "Qty", "Total"];
      const tableRows = [];
      (order.orderItems || []).forEach(item => {
        tableRows.push([
          item.name || 'Product',
          (item.quantity || 1).toString(),
          `Rs. ${(item.price || 0) * (item.quantity || 1)}`
        ]);
      });

      autoTable(doc, {
        startY: currentY,
        margin: { left: offsetX + margin, right: 210 - (offsetX + receiptWidth) + margin },
        head: [tableColumn],
        body: tableRows,
        theme: 'plain',
        headStyles: { fillColor: [243, 244, 246], textColor: [91, 33, 182], fontStyle: 'bold' },
        styles: { fontSize: 7, cellPadding: 2, overflow: 'linebreak' },
        columnStyles: {
          0: { cellWidth: 55 },
          1: { cellWidth: 15, halign: 'center' },
          2: { cellWidth: 25, halign: 'right' }
        },
        didParseCell: function (data) {
          if (data.section === 'head') {
            if (data.column.index === 1) data.cell.styles.halign = 'center';
            if (data.column.index === 2) data.cell.styles.halign = 'right';
          }
        }
      });

      let finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 4 : currentY + 10;
      
      // 5. Shipping Charges and Grand Total
      doc.setFontSize(8);
      doc.setTextColor(80, 80, 80);
      
      doc.text("Shipping:", offsetX + receiptWidth - 30, finalY);
      doc.text(`Rs. ${order.shippingCharge || 0}`, offsetX + receiptWidth - margin, finalY, { align: "right" });
      
      finalY += 3;
      // Thin divider above grand total
      doc.setDrawColor(220, 220, 220);
      doc.setLineWidth(0.3);
      doc.line(offsetX + receiptWidth - 40, finalY, offsetX + receiptWidth - margin, finalY);
      
      finalY += 5;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(40, 40, 40);
      doc.text("Grand Total:", offsetX + receiptWidth - 35, finalY);
      doc.text(`Rs. ${order.totalprice || 0}`, offsetX + receiptWidth - margin, finalY, { align: "right" });

      // Separator lines
      doc.setDrawColor(200, 200, 200);
      doc.setLineDashPattern([2, 2], 0);
      if (quadrantIndex % 2 === 0) {
        doc.line(105, offsetY, 105, offsetY + receiptHeight);
      }
      if (quadrantIndex < 2) {
        doc.line(offsetX, 148.5, offsetX + receiptWidth, 148.5);
      }
      doc.setLineDashPattern([], 0);
    });

    doc.save(`Bulk_Receipts_A4.pdf`);
    setShowBulkModal(false);
  };

  const generateInvoicePDF = async (order) => {
    // 1. Load the logo image
    const img = new Image();
    img.src = logoImg;
    await new Promise((resolve) => {
      img.onload = resolve;
      img.onerror = resolve;
    });

    // 2. Setup POS thermal receipt dimensions (80mm width)
    // We'll set a long height (e.g., 297mm) to accommodate multiple items,
    // POS printers will just cut when the content finishes.
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [80, 297]
    });
    
    const margin = 5;
    const pageWidth = 80;
    let currentY = 8;

    // Header / Brand
    doc.addImage(img, 'JPEG', margin, currentY, 12, 12);
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(40, 40, 40);
    doc.text("Muthu's Petals", 19, currentY + 4);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text("Premium Organic Care", 19, currentY + 8);
    doc.text("www.muthuspetals.com", 19, currentY + 12);

    currentY += 18;

    // Receipt Title & Meta
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.text("ORDER RECEIPT", pageWidth / 2, currentY, { align: "center" });
    
    currentY += 6;
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, margin, currentY);
    
    if (order.razorpay_payment_id) {
      currentY += 4;
      doc.text(`Ref: ${order.razorpay_payment_id}`, margin, currentY);
    }

    currentY += 4;
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(margin, currentY, pageWidth - margin, currentY);
    
    currentY += 5;

    // Customer Info
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("Ship To:", margin, currentY);
    
    currentY += 4;
    doc.setFont("helvetica", "normal");
    doc.text(order.name || 'Unknown', margin, currentY);
    currentY += 4;
    doc.text(order.phone || '', margin, currentY);
    currentY += 4;
    
    const addressString = `${order.address || ''}, ${order.city || ''} - ${order.pin || ''}`;
    const splitAddress = doc.splitTextToSize(addressString, pageWidth - (margin * 2));
    doc.text(splitAddress, margin, currentY);
    
    currentY += (splitAddress.length * 4) + 2;

    // Items Table (Compact)
    const tableColumn = ["Item", "Qty", "Total"];
    const tableRows = [];

    (order.orderItems || []).forEach(item => {
      const rowData = [
        item.name || 'Product',
        (item.quantity || 1).toString(),
        `Rs ${(item.price || 0) * (item.quantity || 1)}`
      ];
      tableRows.push(rowData);
    });

    autoTable(doc, {
      startY: currentY,
      margin: { left: margin, right: margin },
      head: [tableColumn],
      body: tableRows,
      theme: 'plain', // cleaner for thermal
      headStyles: { fillColor: [240, 240, 240], textColor: 20, fontStyle: 'bold' },
      styles: { fontSize: 8, cellPadding: 1, overflow: 'linebreak' },
      columnStyles: {
        0: { cellWidth: 40 }, // Item
        1: { cellWidth: 10, halign: 'center' }, // Qty
        2: { cellWidth: 20, halign: 'right' } // Total
      }
    });

    // Totals
    const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 4 : currentY + 10;
    
    doc.setFontSize(9);
    doc.setTextColor(60, 60, 60);
    doc.line(margin, finalY, pageWidth - margin, finalY);
    
    doc.text("Shipping:", pageWidth - 30, finalY + 5);
    doc.text(`Rs ${order.shippingCharge || 0}`, pageWidth - margin, finalY + 5, { align: "right" });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text("Total:", pageWidth - 30, finalY + 10);
    doc.text(`Rs ${order.totalprice || 0}`, pageWidth - margin, finalY + 10, { align: "right" });

    // Footer note
    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(100, 100, 100);
    doc.text("Thank you for your purchase!", pageWidth / 2, finalY + 18, { align: "center" });

    doc.save(`Receipt_${order._id}.pdf`);
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
      <div className="so-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>📋 Order Management</h1>
        <button onClick={() => setShowBulkModal(true)} style={{ background: '#d875db', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>Bulk Print A4</button>
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
                <div className="so-section">
                  <h4>Payment Details</h4>
                  <p><strong>Status:</strong> <span style={{ color: order.paymentStatus === 'PAID' ? '#10b981' : order.paymentStatus === 'FAILED' ? '#ef4444' : '#eab308' }}>{order.paymentStatus || 'Pending'}</span></p>
                  {order.razorpay_payment_id && <p><strong>Payment ID:</strong> {order.razorpay_payment_id}</p>}
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
                  <button className="so-btn-primary" onClick={() => generateInvoicePDF(order)} style={{ background: 'transparent', color: '#a78bfa', border: '1px solid #a78bfa', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 600, marginLeft: '8px' }}>
                    PDF Invoice
                  </button>
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
      {showBulkModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, padding: '20px' }} onClick={() => setShowBulkModal(false)}>
          <div style={{ background: '#1a1a24', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', width: '100%', maxWidth: '800px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ color: '#fff', margin: 0, fontSize: '18px' }}>Select Orders for Bulk Print</h2>
              <button onClick={() => setShowBulkModal(false)} style={{ background: 'transparent', border: 'none', color: '#9898b3', fontSize: 24, cursor: 'pointer' }}>×</button>
            </div>
            
            <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
              <div style={{ marginBottom: '16px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                <button onClick={() => setSelectedBulkIds(orders.map(o => o._id))} style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>Select All</button>
                <button onClick={() => setSelectedBulkIds([])} style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>Clear All</button>
                <span style={{ color: '#a78bfa', fontSize: '14px', marginLeft: 'auto' }}>{selectedBulkIds.length} Selected</span>
              </div>
              
              {orders.map(order => (
                <div key={order._id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', marginBottom: '10px', overflow: 'hidden' }}>
                  <div style={{ display: 'flex', alignItems: 'center', padding: '14px 16px', cursor: 'pointer', background: selectedBulkIds.includes(order._id) ? 'rgba(216, 117, 219, 0.1)' : 'transparent' }} onClick={() => setExpandedOrderId(expandedOrderId === order._id ? null : order._id)}>
                    <input 
                      type="checkbox" 
                      style={{ marginRight: '16px', width: '18px', height: '18px', cursor: 'pointer' }}
                      checked={selectedBulkIds.includes(order._id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        if (e.target.checked) setSelectedBulkIds([...selectedBulkIds, order._id]);
                        else setSelectedBulkIds(selectedBulkIds.filter(id => id !== order._id));
                      }}
                    />
                    <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span style={{ color: '#fff', fontWeight: 600, display: 'block' }}>{order.name}</span>
                        <span style={{ color: '#888', fontSize: '12px' }}>{new Date(order.createdAt).toLocaleDateString()} | {order._id.substring(0,8)}...</span>
                      </div>
                      {STATUS_BADGE(order.orderStatus)}
                    </div>
                  </div>
                  
                  {expandedOrderId === order._id && (
                    <div style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.2)', fontSize: '13px', color: '#ccc' }}>
                      <p style={{ margin: '0 0 8px' }}><strong>Address:</strong> {order.address}, {order.city} - {order.pin}</p>
                      <p style={{ margin: '0 0 8px' }}><strong>Phone:</strong> {order.phone}</p>
                      <p style={{ margin: '0' }}><strong>Items:</strong> {order.orderItems?.map(i => `${i.name} (x${i.quantity})`).join(', ')}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div style={{ padding: '20px 24px', borderTop: '1px solid rgba(255,255,255,0.05)', background: '#14141d', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button onClick={() => setShowBulkModal(false)} style={{ padding: '10px 20px', background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
              <button onClick={() => generateBulkA4PDF(selectedBulkIds)} disabled={selectedBulkIds.length === 0} style={{ padding: '10px 20px', background: selectedBulkIds.length > 0 ? '#d875db' : '#555', color: '#fff', border: 'none', borderRadius: '8px', cursor: selectedBulkIds.length > 0 ? 'pointer' : 'not-allowed', fontWeight: 600 }}>Download PDF</button>
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

