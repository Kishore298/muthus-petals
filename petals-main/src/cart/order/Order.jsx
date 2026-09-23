import React, { useState, useEffect } from "react";
import axios from "axios";
import "../cart.css";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ShippingPage = () => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) {
      try { setCartData(JSON.parse(stored)); }
      catch (e) { console.error(e); }
    }
  }, []);

  /* ── shipping charge: highest among all items ── */
  const shippingCharge = cartData.reduce((max, item) => {
    const c = item.shippingCharge ?? null;
    if (c === null) return max;
    return max === null ? c : Math.max(max, c);
  }, null);

  const shippingDistrict = cartData.find(i => i.district)?.district || "";

  const subtotal = cartData.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const total = subtotal + (shippingCharge ?? 0);

  const shippingLabel =
    shippingCharge === null ? "Calculated at checkout" :
      shippingCharge === 0 ? "Free" :
        `₹${shippingCharge}`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const orderData = {
        name, address, email, city, country, phone, pin,
        cartData,
        shippingCharge,
        total,
      };
      await axios.post(`${BASE_URL}/api/v1/order/new`, orderData);

      /* ── WhatsApp message ── */
      let msg = `Hello! Muthu's Petals — new order 🛍\n\n`;
      msg += `👤 Name    : ${name}\n`;
      msg += `📧 Email   : ${email}\n`;
      msg += `📞 Phone   : ${phone}\n`;
      msg += `📍 Address : ${address}, ${city} - ${pin}, ${country}\n`;
      if (shippingDistrict) msg += `🗺 District : ${shippingDistrict}\n`;
      msg += `\n🛒 Items:\n`;

      cartData.forEach((item) => {
        msg += `\n• ${item.name}`;
        if (item.size) msg += ` (${item.size} ml)`;
        if (item.color) msg += ` — ${item.color}`;
        msg += ` × ${item.quantity}`;
        msg += ` = ₹${item.price * item.quantity}`;
      });

      msg += `\n\n💰 Subtotal : ₹${subtotal}`;
      msg += `\n🚚 Shipping : ${shippingCharge === 0 ? "Free" : shippingCharge !== null ? `₹${shippingCharge}` : "TBD"}`;
      msg += `\n✅ Total    : ₹${total}`;
      msg += `\n\n📌 Map: https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address + " " + city + " " + pin)}`;

      localStorage.removeItem("cart");
      setCartData([]);
      setName(""); setAddress(""); setEmail("");
      setCity(""); setCountry(""); setPhone(""); setPin("");

      window.location.href = `https://api.whatsapp.com/send?phone=6381181527&text=${encodeURIComponent(msg)}`;
    } catch (err) {
      console.error(err);
      alert("Error placing order. Please try again.");
    }
  };

  return (
    <div className="sp-page">
      <div className="sp-wrap">
        <span className="sp-badge">🛍 Checkout</span>
        <h1 className="sp-title">Shipping details</h1>
        <p className="sp-sub">Almost there — just fill in where to send your order</p>

        <div className="sp-steps">
          <div className="sp-step done">
            <div className="sp-step-num">✓</div><span>Cart</span>
          </div>
          <div className="sp-line done" />
          <div className="sp-step active">
            <div className="sp-step-num">2</div><span>Shipping</span>
          </div>
          <div className="sp-line" />
          <div className="sp-step idle">
            <div className="sp-step-num">3</div><span>Confirm</span>
          </div>
        </div>

        <div className="sp-body">

          {/* ══════════ FORM ══════════ */}
          <form className="sp-form-card" onSubmit={handleSubmit}>
            <p className="sp-section-label">Personal info</p>
            <div className="sp-grid">
              <div className="sp-field">
                <label>Full name</label>
                <input className="sp-input" placeholder="e.g. Priya Sharma"
                  value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="sp-field">
                <label>Phone</label>
                <input className="sp-input" placeholder="+91 98765 43210" type="tel"
                  value={phone} onChange={(e) => setPhone(e.target.value)} required />
              </div>
              <div className="sp-field sp-full">
                <label>Email address</label>
                <input className="sp-input" type="email" placeholder="you@example.com"
                  value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
            </div>

            <div className="sp-divider" />
            <p className="sp-section-label">Delivery address</p>
            <div className="sp-grid">
              <div className="sp-field sp-full">
                <label>Street address</label>
                <input className="sp-input" placeholder="Door no., street, area"
                  value={address} onChange={(e) => setAddress(e.target.value)} required />
              </div>
              <div className="sp-field">
                <label>City / District</label>
                <input className="sp-input" placeholder="Chennai"
                  value={city} onChange={(e) => setCity(e.target.value)} required />
              </div>
              <div className="sp-field">
                <label>PIN code</label>
                <input className="sp-input" placeholder="600 001"
                  value={pin} onChange={(e) => setPin(e.target.value)} required />
              </div>
              <div className="sp-field">
                <label>Country</label>
                <input className="sp-input" placeholder="India"
                  value={country} onChange={(e) => setCountry(e.target.value)} required />
              </div>
            </div>

            {/* Shipping charge notice on form */}
            {shippingCharge !== null && (
              <div className={`sp-ship-notice ${shippingCharge === 0 ? "sp-ship-notice-free" : "sp-ship-notice-paid"}`}>
                {shippingCharge === 0
                  ? <>🎉 Free delivery to <strong>{shippingDistrict}</strong>!</>
                  : <>🚚 Delivery to <strong>{shippingDistrict}</strong> — shipping charge: <strong>₹{shippingCharge}</strong></>
                }
              </div>
            )}

            <button className="sp-btn" type="submit">
              Place order via WhatsApp
            </button>
          </form>

          {/* ══════════ SUMMARY ══════════ */}
          <aside className="sp-summary">
            <div className="sp-summary-title">
              Order summary
              <span onClick={() => window.history.back()}>Edit cart</span>
            </div>

            {cartData.length === 0 ? (
              <p style={{ fontSize: 13, color: "#9ca3af" }}>Your cart is empty.</p>
            ) : (
              cartData.map((item, i) => (
                <div className="sp-product" key={i}>
                  <div className="sp-product-img">
                    {item.images?.[0]
                      ? <img src={item.images[0]} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 10 }} />
                      : <span>🌸</span>
                    }
                  </div>
                  <div className="sp-product-info">
                    <p><strong>{item.name}</strong></p>
                    <p>
                      Qty: {item.quantity}
                      {item.size ? ` · ${item.size} ml` : ""}
                      {item.color ? ` · ${item.color}` : ""}
                    </p>
                    {item.district && (
                      <p style={{ fontSize: 11, color: "#6b7280" }}>
                        📍 {item.district}
                      </p>
                    )}
                  </div>
                  <div className="sp-product-price">₹{item.price * item.quantity}</div>
                </div>
              ))
            )}

            <div className="sp-divider" />

            <div className="sp-row">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>

            <div className="sp-row">
              <span>
                Shipping
                {shippingDistrict && (
                  <span style={{ fontSize: 11, color: "#9ca3af", marginLeft: 4 }}>
                    · {shippingDistrict}
                  </span>
                )}
              </span>
              <span className={shippingCharge === 0 ? "sp-free" : "sp-ship-cost"}>
                {shippingLabel}
              </span>
            </div>

            {shippingCharge === null && (
              <p className="sp-ship-note">
                Shipping will be confirmed after order placement.
              </p>
            )}

            <div className="sp-row total">
              <span>Total</span>
              <span>
                ₹{total}
                {shippingCharge === null && (
                  <span style={{ fontSize: 11, fontWeight: 400, color: "#9ca3af" }}> + shipping</span>
                )}
              </span>
            </div>

            <div className="sp-secure">🔒 Secure checkout via WhatsApp</div>
          </aside>

        </div>
      </div>
    </div>
  );
};

export default ShippingPage;
