import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./landingPage.css";

const LandingPage = ({ isLoggedIn }) => {
  const navigate = useNavigate();
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/homepage");
    }
  }, [isLoggedIn]);
  return (
    <>
      <div
        className="landing-page-bg"
        style={{ backgroundImage: `url(${require("./poster-bg-edited.png")})` }}
      ></div>
      <div className="landing-page-main">
        <div className="info-graphic">
          <div className="website-info">
            <div className="website-name">
              <span style={{ color: "red", fontWeight: 700 }}>r</span>ecomMe
            </div>
            <div className="website-desc">
              Get personalised movie recommendations.
              <br /> Engine powered by Machine Learning.
            </div>
            <div
              className="get-started-btn btn btn-primary"
              onClick={() => {
                navigate("/login");
              }}
            >
              Get Started
            </div>
            <div className="asterisk-headings">
              built by Sandeep Pani for Microsoft Engage'22
            </div>
          </div>
          <img
            id="landing-poster-img"
            src={require("./poster.png")}
            alt="poster"
          />
        </div>
      </div>
    </>
  );
};

export default LandingPage;
