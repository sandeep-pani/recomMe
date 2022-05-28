import React, { useEffect, useState, lazy } from "react";
import Homepage from "./components/homepage/homepage";
import Login from "./components/login/login";
import Register from "./components/register/register";
import Navbar from "./components/navbar/navbar";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/dashboard/dashboard";
import SearchResults from "./components/searchResults/searchResults";
import MovieInfo from "./components/movieInfo/movieInfo";
import "swiper/css/bundle";
import LandingPage from "./components/landingPage/landingPage";
import WishListPage from "./components/wishListPage/wishListPage";

const App = () => {
  const [user, setLoginUser] = useState({});
  useEffect(() => {
    setLoginUser(JSON.parse(localStorage.getItem("MyUser")));
  }, []);

  const updateUser = (user) => {
    delete user.password;
    localStorage.setItem("MyUser", JSON.stringify(user));
    setLoginUser(user);
  };
  // returns true if user is loggedIn
  const isLoggedIn = () => {
    return user && user._id ? true : false;
  };

  // returns component if logged in , else redirects to Login:

  const getComponent = (component) => {
    if (isLoggedIn()) {
      return component;
    } else {
      return <Login updateUser={updateUser} />;
    }
  };

  return (
    <>
      <Router>
        <Navbar updateUser={updateUser} isLoggedIn={isLoggedIn()} />
        <Routes>
          <Route path="/" element={<LandingPage isLoggedIn={isLoggedIn()} />} />
          <Route
            path="/homepage"
            element={getComponent(<Homepage updateUser={updateUser} />)}
          />

          <Route path="/dashboard" element={getComponent(<Dashboard />)} />
          <Route
            path="/login"
            element={getComponent(<Homepage updateUser={updateUser} />)}
          />
          <Route
            path="/register"
            element={
              isLoggedIn() ? <Homepage updateUser={updateUser} /> : <Register />
            }
          />
          <Route
            path="/searchresults/:query"
            element={getComponent(<SearchResults />)}
          />
          <Route
            path="/movieInfo/:tmdbId"
            element={getComponent(<MovieInfo />)}
          />
          <Route path="/wishlist" element={getComponent(<WishListPage />)} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
