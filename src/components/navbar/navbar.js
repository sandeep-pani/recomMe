// rafce
import React from "react";
import { useNavigate } from "react-router-dom";
import "./navbar.css";
const Navbar = ({ updateUser, isLoggedIn }) => {
  const navigate = useNavigate();
  const name = "";
  return (
    <>
      <div className="my-navbar">
        <div id="gradient-navbar"></div>
        <nav className="navbar navbar-dark navbar-expand-sm">
          <a
            className="navbar-brand"
            onClick={() => {
              navigate("/");
            }}
          >
            <img
              src={require("./logo.jpg")}
              width="30"
              height="30"
              alt="logo"
              className="rounded-circle"
            />{" "}
            <span style={{ color: "red", fontWeight: 800 }}>r</span>ecomMe
          </a>
          {/* <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbar-list-4"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
            >
            <span className="navbar-toggler-icon"></span>
          </button> */}
          <div className="profile-btn" id="navbar-list-4">
            <ul className="navbar-nav">
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  id="navbarDropdownMenuLink"
                  role="button"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <img
                    src={
                      isLoggedIn
                        ? "https://cdn3.iconfinder.com/data/icons/users-yellow/60/50_-Blank_Profile-_user_people_group_team-512.png"
                        : "https://www.peoplefocusconsulting.com/wp-content/uploads/2015/06/blank-profile.jpg"
                    }
                    width="30"
                    height="30"
                    className="rounded-circle"
                  />
                </a>
                <div
                  className="dropdown-menu pull-right"
                  aria-labelledby="navbarDropdownMenuLink"
                >
                  {isLoggedIn && (
                    <div className="dropdown-name">
                      {" "}
                      Hi, {JSON.parse(localStorage.MyUser).name}
                    </div>
                  )}
                  {/* renders dashboard, logout btn if user is logged in else renders login and register */}
                  {isLoggedIn ? (
                    <>
                      <div
                        className="dropdown-item"
                        onClick={() => {
                          navigate("/dashboard");
                        }}
                      >
                        <i className="fa fa-newspaper-o"></i> Dashboard
                      </div>
                      <div
                        className="dropdown-item"
                        onClick={() => {
                          navigate("/wishlist");
                        }}
                      >
                        <i className={"fa fa-heart"}></i> My Wishlist
                      </div>
                      <div
                        className="logout-btn dropdown-item"
                        onClick={() => updateUser({})}
                      >
                        <i className="fa fa-sign-out" aria-hidden="true"></i>{" "}
                        Logout
                      </div>
                    </>
                  ) : (
                    <>
                      <div
                        className="dropdown-item"
                        onClick={() => {
                          navigate("/login");
                        }}
                      >
                        Login
                      </div>
                      <div
                        className="dropdown-item"
                        onClick={() => navigate("/register")}
                      >
                        Register
                      </div>
                    </>
                  )}
                </div>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Navbar;
