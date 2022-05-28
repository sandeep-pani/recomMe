import axios from "axios";
import React, { useEffect, useState, lazy } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import CardRow from "../singleComponents/cardRow";
import SearchBar from "../singleComponents/searchBar";
import UserFact from "../singleComponents/userFact";
import "./dashboard.css";
// const CardRow = lazy(() => import("../singleComponents/cardRow"));

const Dashboard = () => {
  const navigate = useNavigate();
  const [topContentMovies, setTopContentMovies] = useState([]);
  const [topCFMovies, setTopCFMovies] = useState([]);
  const [topGenreMovies, setTopGenreMovies] = useState({});
  const username = JSON.parse(localStorage.MyUser).username;

  const getContentBasedMovies = async () => {
    const no_of_movies = 10;
    axios
      .get(
        "http://127.0.0.1:5000/getcontentbasedmovies/" +
          username +
          "/" +
          no_of_movies
      )
      .then((res) => {
        setTopContentMovies(res.data.predictedMovieIds);
        // console.log(res.data.predictedMovieIds);
      });
  };
  const getCFMovies = async () => {
    const no_of_movies = 10;
    axios
      .get("http://127.0.0.1:5000/getcfmovies/" + username + "/" + no_of_movies)
      .then((res) => {
        setTopCFMovies(res.data.predictedMovieIds);
        // console.log(res.data.predictedMovieIds);
      });
  };

  // function to get random genres and related movies
  const getTopGenreMovies = () => {
    const allGenres = [
      "Action",
      "Adventure",
      "Animation",
      "Comedy",
      "Crime",
      "Documentary",
      "Drama",
      "Family",
      "Fantasy",
      "History",
      "Horror",
      "Music",
      "Mystery",
      "Romance",
      "Science Fiction",
      "Thriller",
      "TV Movie",
      "War",
      "Western",
    ];
    const shuffled = allGenres.sort(() => 0.5 - Math.random());
    const randomGenres = shuffled.slice(0, 4);
    // console.log(randomGenres);
    const no_of_movies = 10;
    const topGenreIdsObj = {};

    for (let i = 0; i < 4; i++) {
      axios
        .get(
          "http://127.0.0.1:5000/getsearchresults/" +
            randomGenres[i] +
            "/" +
            no_of_movies
        )
        .then(async (res) => {
          const genreIds = res.data.searchResults;
          topGenreIdsObj[randomGenres[i]] = genreIds;
        })
        .catch((err) => {
          console.log(err);
        });
    }
    setTopGenreMovies(topGenreIdsObj);
  };

  useEffect(() => {
    if (JSON.parse(localStorage.MyUser).newUser) {
      navigate("/homepage");
    } else {
      getContentBasedMovies();
      getCFMovies();
      getTopGenreMovies();
    }
  }, []);
  // console.log(topGenreMovies);

  return (
    <>
      <SearchBar />
      <div className="dashboard-main-container">
        <div className="card-rows-container">
          <div className="dashboard-heading">
            <h1>Dashboard</h1>
            <div
              className="refresh-recommendation-btn get-started-btn btn btn-primary"
              onClick={() => window.location.reload(false)}
            >
              Refresh Recommendations
            </div>
          </div>

          <h5 className="dashboard-rec-headings">
            *Content Based Recommendations:
          </h5>
          <div className="card-row-bg">
            <CardRow tmdbIds={topContentMovies} />
          </div>
          <h6 className="asterisk-headings">
            **recommendations based solely on the content you liked{" "}
            <i className="fa fa-arrow-up"></i>
          </h6>
          <br />

          <h5 className="dashboard-rec-headings">
            *Collaborative Filtering Recommendations:
          </h5>
          <div className="card-row-bg">
            <CardRow tmdbIds={topCFMovies} />
          </div>
          <h6 className="asterisk-headings">
            **recommendations based on ratings by users similar to you{" "}
            <i className="fa fa-arrow-up"></i>
          </h6>
          <br />
          <div className="dashboard-userfact">
            <UserFact />
          </div>
          {/* mapping all the movies to cardRow */}
          {Object.keys(topGenreMovies).map((key) => {
            return (
              <div key={key}>
                <h5 className="dashboard-rec-headings">Watch {key}</h5>
                <CardRow tmdbIds={topGenreMovies[key]} />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
