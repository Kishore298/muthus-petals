import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./cart.css";
import Navbar from "../../src/componets/Navbar/Navbar";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) {
      try { setCart(JSON.parse(stored)); }
      catch (e) { console.error(e); }
    }
  }, []);

  const save = (updated) => {
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const changeQty = (index, delta) => {
    const updated = cart.map((item, i) =>
      i !== index ? item : { ...item, quantity: Math.max(1, item.quantity + delta) }
    );
    save(updated);
  };

  const remove = (index) => save(cart.filter((_, i) => i !== index));

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const shippingCharge = cart.reduce((max, i) => {
    const charge = i.shippingCharge ?? null;
    if (charge === null) return max;
    return max === null ? charge : Math.max(max, charge);
  }, null);

  const shippingDisplay =
    shippingCharge === null ? "Calculated at checkout"
    : shippingCharge === 0 ? "Free"
    : `₹${shippingCharge}`;

  const total    = subtotal + (shippingCharge ?? 0);
  const district = cart.find((i) => i.district)?.district || "";

  /* ── Helper: format size label using stored sizeUnit ── */
  const formatSize = (item) => {
    if (!item.size) return null;
    // sizeUnit is stored on the item ("g" or "ml")
    // fall back to "ml" for older cart items that don't have sizeUnit
    const unit = item.sizeUnit ?? "ml";
    return `${item.size} ${unit}`;
  };

  return (
    <>
      <div className="ct-page">
        <div className="ct-wrap">
          <span className="ct-badge">🛒 Your cart</span>
          <h1 className="ct-title">Shopping cart</h1>
          <p className="ct-sub">Review your items before checkout</p>

          {cart.length === 0 ? (
            <div className="ct-empty">
              <p>Your cart is empty — add some products!</p>
              <button onClick={() => navigate("/products")}>Browse products</button>
            </div>
          ) : (
            <div className="ct-body">

              {/* Items */}
              <div className="ct-items">
                {cart.map((item, i) => (
                  <div className="ct-card" key={i}>
                    {item.images?.[0]
                      ? <img className="ct-img" src={item.images[0]} alt={item.name} />
                      : <div className="ct-img">🌸</div>
                    }
                    <div className="ct-info">
                      <p className="ct-name">{item.name}</p>
                      <div className="ct-meta">
                        {/* ── size label: "75 g" for aloe vera, "200 ml" / "500 ml" for others ── */}
                        {formatSize(item) && <span>{formatSize(item)}</span>}
                        {item.category  && <span>{item.category}</span>}
                        {item.district  && (
                          <span className="ct-meta-ship">
                            🚚 {item.district} —{" "}
                            {item.shippingCharge === 0
                              ? "Free delivery"
                              : item.shippingCharge
                              ? `₹${item.shippingCharge} shipping`
                              : "Shipping TBD"}
                          </span>
                        )}
                      </div>
                      <p className="ct-price">₹{item.price}</p>
                      <div className="ct-qty-row">
                        <button className="ct-qty-btn" onClick={() => changeQty(i, -1)}>−</button>
                        <span className="ct-qty-val">{item.quantity}</span>
                        <button className="ct-qty-btn" onClick={() => changeQty(i, +1)}>+</button>
                        <span className="ct-qty-total">Total: ₹{item.price * item.quantity}</span>
                      </div>
                    </div>
                    <button className="ct-remove" onClick={() => remove(i)} aria-label="Remove">✕</button>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="ct-side">
                <div className="ct-summary">
                  <p className="ct-summary-title">Order summary</p>

                  <div className="ct-sum-row">
                    <span>Subtotal ({cart.length} item{cart.length > 1 ? "s" : ""})</span>
                    <span>₹{subtotal}</span>
                  </div>

                  <div className="ct-sum-row">
                    <span>
                      Shipping
                      {district && <span className="ct-ship-district"> · {district}</span>}
                    </span>
                    <span className={shippingCharge === 0 ? "ct-free" : "ct-ship-cost"}>
                      {shippingDisplay}
                    </span>
                  </div>

                  {shippingCharge === null && (
                    <p className="ct-ship-note">
                      Add your district on the product page to see delivery charges.
                    </p>
                  )}

                  <div className="ct-sum-row total">
                    <span>Total</span>
                    <span>
                      ₹{shippingCharge !== null ? total : subtotal}
                      {shippingCharge === null && (
                        <span className="ct-ship-plus"> + shipping</span>
                      )}
                    </span>
                  </div>

                  <button className="ct-checkout-btn" onClick={() => navigate("/ordershipping")}>
                    Proceed to checkout →
                  </button>
                  <button className="ct-continue" onClick={() => navigate("/products")}>
                    ← Continue shopping
                  </button>
                  <p className="ct-secure">🔒 Secure checkout</p>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Cart;