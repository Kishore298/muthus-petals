import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "../cart.css";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const loadScript = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};


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
      const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
      if (!res) {
        toast.error("Razorpay SDK failed to load. Are you online?");
        return;
      }

      // 1. Get Razorpay Key
      const keyData = await axios.get(`${BASE_URL}/api/v1/payment/get-key`);
      const key = keyData.data.key;

      // 2. Create Order in Backend
      const orderDataResponse = await axios.post(`${BASE_URL}/api/v1/payment/create-payment-order`, {
        amount: total,
      });

      if (!orderDataResponse.data.success) {
        toast.error("Failed to create payment order");
        return;
      }

      const { order } = orderDataResponse.data;

      // 3. Initialize Razorpay Checkout
      const options = {
        key: key,
        amount: order.amount,
        currency: order.currency,
        name: "Muthu's Petals",
        description: "Order Payment",
        order_id: order.id,
        handler: async function (response) {
          try {
            // 4. Verify Payment
            const verifyRes = await axios.post(`${BASE_URL}/api/v1/payment/verify-payment`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyRes.data.success) {
              // 5. Place the order
              const finalOrderData = {
                name, address, email, city, country, phone, pin,
                cartData,
                shippingCharge,
                total,
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                paymentStatus: 'paid'
              };
              
              await axios.post(`${BASE_URL}/api/v1/order/new`, finalOrderData);

              /* ── WhatsApp message ── */
              let msg = `*Muthu's Petals — New Order!*\n\n`;
              
              msg += `*Customer Details:*\n`;
              msg += `Name: ${name}\n`;
              msg += `Email: ${email}\n`;
              msg += `Phone: ${phone}\n\n`;
              
              msg += `*Shipping Address:*\n`;
              msg += `${address}, ${city} - ${pin}, ${country}\n`;
              if (shippingDistrict) msg += `District: ${shippingDistrict}\n`;
              msg += `\n*Payment ID:* ${response.razorpay_payment_id}\n\n`;
              
              msg += `*Order Items:*\n`;
              cartData.forEach((item) => {
                msg += `- ${item.name}`;
                if (item.size) msg += ` (${item.size} ml)`;
                if (item.color) msg += ` — ${item.color}`;
                msg += ` x ${item.quantity}`;
                msg += ` = Rs. ${item.price * item.quantity}\n`;
              });

              msg += `\n*Summary:*\n`;
              msg += `Subtotal: Rs. ${subtotal}\n`;
              msg += `Shipping: ${shippingCharge === 0 ? "Free" : shippingCharge !== null ? `Rs. ${shippingCharge}` : "TBD"}\n`;
              msg += `*Total Paid: Rs. ${total}*\n\n`;
              msg += `*Location Map:* https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address + " " + city + " " + pin)}`;

              localStorage.removeItem("cart");
              setCartData([]);
              setName(""); setAddress(""); setEmail("");
              setCity(""); setCountry(""); setPhone(""); setPin("");

              window.location.href = `https://api.whatsapp.com/send?phone=6381181527&text=${encodeURIComponent(msg)}`;
            }
          } catch (err) {
            console.error("Verification error:", err);
            toast.error("Payment verification failed! Please contact support.");
          }
        },
        modal: {
          ondismiss: function () {
            console.log("User closed Razorpay checkout");
            // Optionally, tell the backend that checkout was abandoned:
            // axios.post(`${BASE_URL}/api/v1/payment/abandon`, { order_id: order.id });
            toast.info("Payment cancelled. You can try again when you're ready.");
          }
        },
        prefill: {
          name: name,
          email: email,
          contact: phone,
        },
        theme: {
          color: "#d875db",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Error initializing payment. Please try again.";
      toast.error(msg);
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
              Pay ₹{total} & Place Order
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
