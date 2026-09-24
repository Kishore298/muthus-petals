import React from 'react';

const ShippingPolicy = () => {
  return (
    <div style={{ padding: '100px 24px 60px', minHeight: '100vh', background: '#faeff8', color: '#4a4035', fontFamily: '"DM Sans", sans-serif' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', background: '#fff', padding: '60px', borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)' }}>
        
        <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '42px', color: '#1e1a14', marginBottom: '32px', textAlign: 'center' }}>
          Shipping Policy
        </h1>
        
        <div style={{ fontSize: '16px', lineHeight: '1.8', color: '#4a4035' }}>
          
          <p style={{ marginBottom: '24px', fontSize: '18px', textAlign: 'center', color: '#7a5a78' }}>
            Thank you for shopping with Muthu's Petals! We take great care in packaging and delivering our natural products directly to your doorstep.
          </p>

          <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '26px', color: '#d875db', marginTop: '40px', marginBottom: '16px' }}>
            Processing Time
          </h2>
          <p style={{ marginBottom: '16px' }}>
            All orders are processed and dispatched within <strong>1 to 3 business days</strong> (excluding weekends and public holidays) after receiving your order confirmation email. You will receive another notification when your order has shipped. 
          </p>
          <p style={{ marginBottom: '16px' }}>
            Please note that during high volume periods or promotional sales, processing times may be slightly extended.
          </p>

          <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '26px', color: '#d875db', marginTop: '40px', marginBottom: '16px' }}>
            Shipping Rates & Estimates
          </h2>
          <p style={{ marginBottom: '16px' }}>
            Shipping charges for your order will be calculated and displayed at checkout. Delivery times vary based on your location within India:
          </p>
          <ul style={{ marginBottom: '16px', paddingLeft: '24px' }}>
            <li style={{ marginBottom: '8px' }}><strong>South India:</strong> Standard Delivery in 2-4 business days.</li>
            <li style={{ marginBottom: '8px' }}><strong>Rest of India:</strong> Standard Delivery in 4-7 business days.</li>
          </ul>

          <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '26px', color: '#d875db', marginTop: '40px', marginBottom: '16px' }}>
            Order Tracking
          </h2>
          <p style={{ marginBottom: '16px' }}>
            When your order has shipped, you will receive an email notification from us which will include a tracking number you can use to check its status. Please allow 24 hours for the tracking information to become available.
          </p>

          <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '26px', color: '#d875db', marginTop: '40px', marginBottom: '16px' }}>
            Damages in Transit
          </h2>
          <p style={{ marginBottom: '16px' }}>
            Muthu's Petals takes utmost care in packaging our products securely. However, if your order arrives damaged in any way, please contact us immediately within 48 hours of delivery at muthuspetals@gmail.com with your order number and a photo of the item's condition. We address these on a case-by-case basis but will try our best to work towards a satisfactory solution.
          </p>
          
          <div style={{ marginTop: '48px', padding: '24px', background: '#faeff8', borderRadius: '12px', textAlign: 'center' }}>
            <p style={{ margin: 0, fontWeight: '500' }}>
              For any shipping related queries, contact us at <a href="mailto:muthuspetals@gmail.com" style={{ color: '#d875db', textDecoration: 'none' }}>muthuspetals@gmail.com</a>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ShippingPolicy;
