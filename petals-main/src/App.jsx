import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./componets/Navbar/Navbar.jsx";
import ScrollToTop from "./componets/ScrollToTop";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/Home";
import Product from "./pages/Product";
import Haircare from "./haircare/Haircare";
import HaircarePremium from "./haircare/HaircarePremium";
import ProductDetail from "../src/componets/ProductSinglepage/ProductDetails.jsx";
import Register from "../src/register/Register.jsx";
import Login from "./Login/Login.jsx";
import Dashbroad from "./Dashbroad/Dashbroad.jsx";
import Createproducts from "./Dashbroad/Createproducts/Createproducts.jsx";
import { Showallproducts } from "./Dashbroad/showproducts/Showallproducts.jsx";
import { Showallorders } from "./Dashbroad/showorders/Showallorders.jsx";
import Updateproducts from "./Dashbroad/updateproducts/Updateproduct.jsx";
import Deletedproducts from "./Dashbroad/deletedproducts/Deletedproducts.jsx";
import Cart from "./cart/Cartpage.jsx";
import Entry from "./pages/Entry.jsx";
import About from "./pages/About.jsx";
import OurStory from "./pages/OurStory.jsx";
import TrendingProducts from "../src/Trending/TrendingProducts.jsx";
import Bodycare from "../src/bodycare/Bodycare.jsx";
import BodycarePremium from "../src/bodycare/BodycarePremium.jsx";
import SkincarePremium from "../src/skincare/SkincarePremium.jsx";
import Wellness from './wellness/Wellness.jsx'
import Skincare from "../src/skincare/Skincare.jsx";

import Contact from "./pages/Contact.jsx";
import OrderPage from "./cart/order/Order.jsx";
import Fragrance from "./fragrance/Fragrance.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import Testamonial from "./pages/Testimonial/Testamonial.jsx";
import Createtestimonial from "./pages/Testimonial/createtestimonial'/Createtestimonial.jsx";
import { Showalltestimonial } from "./pages/Testimonial/createtestimonial'/ShowTestimonial.jsx";
import { Deletedtestimonial } from "./pages/Testimonial/Deletetestimonial.jsx";
import Profile from "./Login/Profile.jsx";
import Gallery from "./pages/gallery/Gallery.jsx";
import Creategallery from './pages/gallery/Creategallery.jsx'
import Sizechart from "./pages/Sizechart.jsx";
import Footer from "./componets/footer/footdetails.jsx";
import Ingredients from "./pages/ingredients/Ingredients.jsx";
import ReviewGallery from "./pages/gallery/reviewgallery.jsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.jsx";
import ShippingPolicy from "./pages/ShippingPolicy.jsx";


const Layout = ({ children }) => {
  const location = useLocation();
  const path = location.pathname.toLowerCase();

  const isHidden = [
    '/dashboard', '/createproduct', '/showallproducts', '/showallorders',
    '/products/update', '/products/delete', '/createtestimonial',
    '/showalltestimonial', '/deletetestimonail', '/creategallery',
    '/login', '/register'
  ].some(p => path.startsWith(p));

  return (
    <>
      {!isHidden && <Navbar />}
      {children}
      {!isHidden && <Footer />}
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <ToastContainer />
      <Layout>
        <Routes>
          {/* <Route path="/" element={<Entry />} /> */}
          <Route path="/about" element={<OurStory />} />
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Product />} />

          <Route path="/haircare" element={<Product defaultCategory="Hair Care" />} />
          <Route path="/haircare-premium" element={<HaircarePremium />} />
          <Route path="/trending-products" element={<TrendingProducts />} />
          <Route path="/wellness" element={<Wellness />} />
          <Route path="/bodycare" element={<Bodycare />} />
          <Route path="/fragrance" element={<Fragrance />} />
          <Route path="/bodycare-premium" element={<BodycarePremium />} />

          <Route path="/skincare-premium" element={<SkincarePremium />} />

          <Route path="/skincare" element={<Product defaultCategory="Skin Care" />} />


          <Route path="/footer" element={<Footer />}></Route>
          <Route path="/contact" element={<Contact />}></Route>
          <Route path="/ordershipping" element={<OrderPage />}></Route>
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/sizeimage" element={<Sizechart />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/shipping" element={<ShippingPolicy />} />


          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />

          <Route path="/dashboard" element={<Dashbroad />} />
          <Route path="/createproduct" element={<Createproducts />} />
          <Route path="/showallproducts" element={<Showallproducts />} />
          <Route path="/showallorders" element={<Showallorders />} />
          <Route path="/products/update/:id" element={<Updateproducts />} />
          <Route path="/products/delete/:id" element={<Deletedproducts />} />
          <Route path="/cart" element={<Cart />} />

          <Route path="/testimonial" element={<Testamonial />} />
          <Route path="/createtestimonial" element={<Createtestimonial />} />
          <Route path="/Showalltestimonial" element={<Showalltestimonial />} />
          <Route path="/deleteTestimonail/:id" element={<Deletedtestimonial />} />

          <Route path="/ingredients" element={<Ingredients />} />


          <Route path="/gallery" element={<Gallery />} />
          <Route path="/galleryreview" element={<ReviewGallery />} />
          <Route path="/creategallery" element={<Creategallery />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;



