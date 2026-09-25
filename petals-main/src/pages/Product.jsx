import React, { useEffect, useState } from "react";
import axios from "axios";
import "./product.css";
import { useNavigate, useLocation } from "react-router-dom";
import Footer from "../componets/footer/footdetails.jsx";
import InfiniteScroll from "react-infinite-scroll-component";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function GridExample({ defaultCategory = "All" }) {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMore] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

    /* =========================
     GET CATEGORY FROM URL
  ========================= */
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    let categoryFromURL = params.get("category");
    if (categoryFromURL) {
      categoryFromURL = categoryFromURL.toLowerCase();
      if (["shampoo", "hair oil", "haircare", "hair"].some(c => categoryFromURL.includes(c))) {
        setSelectedCategory("Hair Care");
      } else if (["soap", "aloe vera", "charcoal", "manjistha", "kuppaimeni", "facewash", "skincare", "skin"].some(c => categoryFromURL.includes(c))) {
        setSelectedCategory("Skin Care");
      } else if (["body wash", "bodycare", "body"].some(c => categoryFromURL.includes(c))) {
        setSelectedCategory("Body Care");
      } else {
        setSelectedCategory(categoryFromURL);
      }
    } else {
      setSelectedCategory(defaultCategory);
    }
  }, [location.search, defaultCategory]);

  /* FILTER PRODUCTS */
  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(
        products.filter(
          (item) =>
            item.category?.toLowerCase() ===
            selectedCategory.toLowerCase()
        )
      );
    }
  }, [selectedCategory, products]);

  /* =========================
     FETCH PRODUCTS
  ========================= */

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/v1/products`
      );

      const sortedProducts =
        res.data.product;

      setProducts(sortedProducts);
    } catch (err) {
      setError("Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     FILTER PRODUCTS
  ========================= */

  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(
        (item) =>
          item.category?.toLowerCase() ===
          selectedCategory.toLowerCase()
      );

      setFilteredProducts(filtered);
    }
  }, [selectedCategory, products]);

  /* =========================
     CATEGORY LIST
  ========================= */

    const categories = [
    "All",
    "Hair Care",
    "Skin Care",
    "Body Care"
  ];

  if (loading)
    return (
      <p className="loading-text">
        Loading...
      </p>
    );

  if (error)
    return (
      <p className="error-text">{error}</p>
    );

  return (
    <>
      

      <section className="products-page">
        {/* HEADER */}

        <div className="products-header">
          <h1 className="products-title">
            Herbal Collections
          </h1>

          <p className="products-subtitle">
            Explore our premium herbal
            products
          </p>
        </div>

        

        {/* PRODUCTS */}

        <InfiniteScroll
          dataLength={filteredProducts.length}
          next={fetchProducts}
          hasMore={hasMore}
        >
          <div className="products-grid">
            {filteredProducts.map(
              (product, index) => (
                <div
                  className="product-card"
                  key={product._id}
                  style={{
                    "--delay": `${index * 0.05
                      }s`,
                  }}
                >
                  {/* IMAGE */}

                  <div
                    className="product-image-wrapper"
                    onClick={() =>
                      navigate(
                        `/products/${product._id}`
                      )
                    }
                  >
                    <img
                      src={product.images?.[0]}
                      alt={product.name}
                      className="product-image"
                    />
                  </div>

                  {/* CONTENT */}

                  <div className="product-content">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span className="product-category" style={{ marginBottom: 0 }}>
                        {product.category}
                      </span>
                      {(Number(product.stock) > 0 || product.isAvailable === true) ? (
                        <span style={{ color: '#10b981', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', background: 'rgba(16,185,129,0.1)', padding: '2px 8px', borderRadius: '12px' }}>Available</span>
                      ) : (
                        <span style={{ color: '#ef4444', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', background: 'rgba(239,68,68,0.1)', padding: '2px 8px', borderRadius: '12px' }}>Out of Stock</span>
                      )}
                    </div>

                    <h2 className="product-name">
                      {product.name}
                    </h2>
                    <div className="product-price-box">
                      <span className="product-cut-price">₹{product.cutprice}</span>
                      <span className="product-price">₹{product.price}</span>
                      {product.cutprice > product.price && (
                        <span className="product-discount">
                          {Math.round(((product.cutprice - product.price) / product.cutprice) * 100)}% off
                        </span>
                      )}
                    </div>

                    <button
                      className="view-product-btn"
                      onClick={() =>
                        navigate(
                          `/products/${product._id}`
                        )
                      }
                    >
                      View Details
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        </InfiniteScroll>
      </section>
      
    </>
  );
}

export default GridExample;




