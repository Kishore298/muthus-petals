import React from "react";
import { Link } from "react-router-dom";
import animiimg from "../../images/5925448.jpg";
import carimg from "../../images/5347353.jpg";
import bikeimg from "../../images/4338682.jpg";
import musixcimg from "../../images/5925448.jpg";
// import sport1 from '../../images/sports.webp'
import "../Corosol.css";

const productsimg = [
  { id: 1, image: animiimg, name: " Hair Growth Oil", link: "/products" },
  // { id: 2, image: sport1, name: "sports collection", link: "/sportoversized" },
  { id: 3, image: carimg, name: "Damage Repair Kit", link: "/products" },
  { id: 4, image: bikeimg, name: "Anti-Hair Fall", link: "/products" },
  { id: 5, image: musixcimg, name: "Onion Shampoo ", link: "/products" },
];

const Trendingshirt = () => {
  return (
    <div>
      <div className="img-mains">
        {productsimg.map((product) => (
          <div className="products" key={product.id}>
            <Link to={product.link} className="product-link">
              {product.image ? (
                <img
                  className="stackimgs"
                  src={product.image}
                  alt={`Image ${product.id}`}
                />
              ) : (
                <p>No image available</p>
              )}
            </Link>
            <p className="cor-name">{product.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Trendingshirt;
