import React, { useEffect, useState } from "react";
import { auth } from "./firebase";
import { Link } from "react-router-dom";
import './profile.css';
import About from "../pages/About";

const Profile = () => {
  const [userDetails, setUserDetails] = useState(null);

  const fetchUserData = () => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setUserDetails(user);
      } else {
        console.log("User is not logged in");
      }
    });
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const logout = async () => {
    try {
      await auth.signOut();
      window.location.href = "/";
    } catch (error) {
      console.log(error);
    }
  };


  return (
    <>
      
      <div className="zculture-profile-container">
        {userDetails ? (
          <div className="zculture-profile-content">
            <h3 className="zculture-profile-welcome">Welcome to Zculture, {userDetails.displayName}</h3>
            <div className="zculture-profile-details">
              <img className="zculture-profile-image" src={userDetails.photoURL} />
              <p className="zculture-profile-email">Email: {userDetails.email}</p>
              <p className="zculture-profile-name">Name: {userDetails.displayName}</p>
            </div>
            <button className="zculture-profile-logout-button" onClick={logout}>LOG OUT</button>
            <Link className="zculture-shop" to="/">SHOP</Link>
          </div>
        ) : (
          <p className="zculture-profile-loading"></p>
        )}
      </div>
      <About />
    </>

  );
};

export default Profile;
