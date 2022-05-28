import axios from "axios";
import React, { useState, useEffect } from "react";
import "./homepage.css";
import Card from "../singleComponents/card";
import { useNavigate } from "react-router-dom";
import SearchBar from "../singleComponents/searchBar";

const Homepage = ({ updateUser }) => {
  const navigate = useNavigate();

  const [data, setData] = useState([]); // stores ids of all movies to render
  const [idRating, setIdRating] = useState({}); // json of id: rating pairs
  const [userRatingsLen, setUserRatingsLen] = useState(0);
  // console.log(idRating);
  const getColdStartMovies = () => {
    axios.get("https://recomme-api.herokuapp.com/getcoldstartmovies").then((res) => {
      // console.log(res);
      setData(res.data);
    });
  };

  const getUserRatings = () => {
    axios
      .get(
        "https://recomme-api.herokuapp.com/getuserratings/" +
          JSON.parse(localStorage.MyUser).username
      )
      .then((res) => {
        setUserRatingsLen(Object.keys(res.data.userRatings).length);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const updateIdRating = (tmdbId, rating) => {
    setIdRating({
      ...idRating,
      [tmdbId]: rating,
    });
  };

  const submitColdMoviesHandle = () => {
    axios
      .post(
        "https://recomme-api.herokuapp.com/setuserstatus",
        JSON.parse(localStorage.MyUser)
      )
      .then((res) => {
        delete res.data.user.password;
        localStorage.setItem("MyUser", JSON.stringify(res.data.user));
        navigate("/dashboard");
      })
      .catch((err) => {
        console.log("setuserstatus err:", err);
      });
  };

  useEffect(() => {
    // if user is new, render homepage else navigate to dashboard
    if (JSON.parse(localStorage.MyUser).newUser) {
      getColdStartMovies();
      getUserRatings();
    } else {
      navigate("/dashboard");
    }
  }, []);

  return (
    <>
      <div className="homepage">
        <div className="homepage-heading">
          <SearchBar />
          <br />
          <div>Rate atleast 6 movies to get started:</div>
        </div>

        <div className="cards">
          {data.map((i) => {
            // passing in updateIdRating state as prop to store the {tmdbid: rating} in the state
            return <Card updateIdRating={updateIdRating} tmdbId={i} key={i} />;
          })}
        </div>
      </div>
      <div className="homepage-submit-container">
        {
          // submit button appears when user has rated atleast 6 movies
          Object.keys(idRating).length + userRatingsLen < 6 ? (
            <div className="homepage-submit-btn btn btn-primary" disabled>
              Rated {Object.keys(idRating).length + userRatingsLen}/6 movies.
            </div>
          ) : (
            <div
              className="homepage-submit-btn btn btn-primary"
              onClick={submitColdMoviesHandle}
            >
              Get Started!
            </div>
          )
        }
      </div>
    </>
  );
};

export default Homepage;
