
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


function TrendingProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchProducts = async () => {
      try {

        const res = await axios.get(`${BASE_URL}/api/v1/products?category=Skin Care`);

        const sortedProducts = res.data.product.sort((a, b) => {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          return dateB - dateA;
        });

        setProducts(sortedProducts);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <>
        <img className="loading-image" src={loadingimg} alt="Loading..." />
        <p className="loading">Loading...</p>
      </>


    )
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (products.length === 0) {
    return <p>No products available</p>;
  }

  return (
    <>
      
      <br />
      <h1>BIKE Oversized tees</h1>
      <br />
      <br />
      <div className="containers">
        <div className="grid">
          {products.map((product) => (
            <div className="product-card" key={product._id}>
              {product.images && product.images.length > 0 ? (
                <img
                  className="product-image"
                  onClick={() => navigate(`/products/${product._id}`)}
                  src={product.images[0]}
                  alt={`${product.name} first image`}
                />
              ) : (
                <p>No images available</p>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <p className="product-title" style={{ margin: 0, flex: 1 }}>{product.name}</p>
                <div style={{ fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', flexShrink: 0, marginTop: '2px' }}>
                  {(Number(product.stock) > 0 || product.isAvailable === true) ? (
                    <span style={{ color: '#10b981', background: 'rgba(16,185,129,0.1)', padding: '2px 6px', borderRadius: '12px' }}>Available</span>
                  ) : (
                    <span style={{ color: '#ef4444', background: 'rgba(239,68,68,0.1)', padding: '2px 6px', borderRadius: '12px' }}>Out of Stock</span>
                  )}
                </div>
              </div>
              <p className="title-oversized-cut">Rs:₹{product.cutprice}</p>
              <p className="product-title">From RS: {product.price}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default TrendingProducts;


