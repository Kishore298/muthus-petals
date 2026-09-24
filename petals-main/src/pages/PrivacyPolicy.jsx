import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div style={{ padding: '100px 24px 60px', minHeight: '100vh', background: '#faeff8', color: '#4a4035', fontFamily: '"DM Sans", sans-serif' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', background: '#fff', padding: '60px', borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)' }}>
        
        <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '42px', color: '#1e1a14', marginBottom: '32px', textAlign: 'center' }}>
          Privacy Policy & Return Policy
        </h1>
        
        <div style={{ fontSize: '16px', lineHeight: '1.8', color: '#4a4035' }}>
          
          <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '28px', color: '#d875db', marginTop: '40px', marginBottom: '16px' }}>
            Privacy Policy
          </h2>
          <p style={{ marginBottom: '16px' }}>
            At Muthu's Petals, we are committed to protecting your privacy and ensuring that your personal information is handled safely and responsibly. This Privacy Policy outlines how we collect, use, and protect your information when you interact with our website and purchase our products.
          </p>
          <p style={{ marginBottom: '16px' }}>
            <strong>1. Information We Collect:</strong> We collect personal information such as your name, email address, shipping address, and payment details when you place an order. We also collect non-personal data like browser type and IP address for analytics purposes.
          </p>
          <p style={{ marginBottom: '16px' }}>
            <strong>2. How We Use Your Information:</strong> Your information is primarily used to process and fulfill your orders, communicate with you regarding your purchases, and provide customer support. With your consent, we may also send you promotional emails about new products or offers.
          </p>
          <p style={{ marginBottom: '16px' }}>
            <strong>3. Data Protection:</strong> We employ strict security measures to protect your personal data from unauthorized access, alteration, or disclosure. Payment information is securely encrypted and processed through trusted third-party payment gateways.
          </p>
          <p style={{ marginBottom: '16px' }}>
            <strong>4. Sharing of Information:</strong> We do not sell or rent your personal information to third parties. We may share necessary details with trusted service providers (such as shipping partners) solely for the purpose of fulfilling your orders.
          </p>

          <hr style={{ border: 'none', borderTop: '1px solid #e1d0e4', margin: '48px 0' }} />

          <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '28px', color: '#d875db', marginTop: '20px', marginBottom: '16px' }}>
            Return & Refund Policy
          </h2>
          <p style={{ marginBottom: '16px' }}>
            We want you to be completely satisfied with your purchase. Due to the nature of our natural cosmetic products, our return policy is designed to ensure hygiene and safety for all our customers.
          </p>
          <p style={{ marginBottom: '16px' }}>
            <strong>1. Eligibility for Returns:</strong> Returns are accepted only if the product received is damaged, defective, or incorrect. If you experience any of these issues, please contact us within 48 hours of delivery with photographic evidence.
          </p>
          <p style={{ marginBottom: '16px' }}>
            <strong>2. Non-Returnable Items:</strong> For hygiene reasons, opened or used skincare, haircare, and cosmetic products cannot be returned or exchanged unless they are defective.
          </p>
          <p style={{ marginBottom: '16px' }}>
            <strong>3. Refund Process:</strong> Once your return is received and inspected, we will notify you of the approval or rejection of your refund. Approved refunds will be processed and credited back to your original method of payment within 5-7 business days.
          </p>
          <p style={{ marginBottom: '16px' }}>
            <strong>4. Cancellations:</strong> Orders can be cancelled within 12 hours of placement, provided they have not yet been dispatched. Once dispatched, the order cannot be cancelled.
          </p>
          
          <div style={{ marginTop: '48px', padding: '24px', background: '#faeff8', borderRadius: '12px', textAlign: 'center' }}>
            <p style={{ margin: 0, fontWeight: '500' }}>
              Have questions? Contact us at <a href="mailto:muthuspetals@gmail.com" style={{ color: '#d875db', textDecoration: 'none' }}>muthuspetals@gmail.com</a>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
