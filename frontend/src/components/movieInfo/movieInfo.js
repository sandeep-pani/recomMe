import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./movieInfo.css";
import { StarRating } from "../singleComponents/card";
import CardRow from "../singleComponents/cardRow";

const MovieInfo = () => {
  const navigate = useNavigate();
  const { tmdbId } = useParams();
  const [similarMovies, setSimilarMovies] = useState([]);
  const [fullMovieInfo, setFullMovieInfo] = useState({
    original_title: "",
    overview: "",
    poster_path: "",
    backdrop_path: "",
    genres: [],
    vote_average: 0,
  });
  const getSimilarMovies = async () => {
    const no_of_movies = 10;
    axios
      .post(
        "https://recomme-api.herokuapp.com/getcontentbasedmovies/" +
          tmdbId +
          "/" +
          no_of_movies
      )
      .then((res) => {
        setSimilarMovies(res.data.predictedMovieIds);
        // console.log(res.data.predictedMovieIds);
      });
  };

  const getMovieInfo = () => {
    axios
      .get(
        "https://api.themoviedb.org/3/movie/" +
          tmdbId +
          "?api_key=e8e22072362bab6dce2d0aa70d020c77&language=en-US"
      )
      .then((res) => {
        const {
          original_title,
          overview,
          poster_path,
          backdrop_path,
          genres,
          vote_average,
        } = res.data;
        // appending genres into genres arr
        const genresArr = [];
        for (var i = 0; i < genres.length; i++) {
          genresArr.push(genres[i].name);
        }
        setFullMovieInfo({
          //   ...fullMovieInfo,
          original_title: original_title,
          overview: overview,
          poster_path: "https://image.tmdb.org/t/p/w154/" + poster_path,
          backdrop_path: "https://image.tmdb.org/t/p/w780/" + backdrop_path,
          genres: genresArr,
          vote_average: vote_average,
        });
      });
  };

  useEffect(() => {
    getMovieInfo();
    getSimilarMovies();
    // console.log("full movie info:", fullMovieInfo);
  }, [tmdbId]);
  return (
    <>
      <div
        className="bg"
        style={{ backgroundImage: `url(${fullMovieInfo.backdrop_path})` }}
      ></div>
      <div className="main-container">
        <div className="middle-container">
          <div className="close-btn">
            <h2
              className="close-btn-h"
              onClick={() => {
                navigate(-1);
              }}
            >
              <i className="fa fa-times-thin fa-2x" aria-hidden="true"></i>
            </h2>
          </div>
          <div className="info-container">
            <div className="movie-info-title">
              {fullMovieInfo.original_title}
            </div>
            <div className="movie-info-sub-info-container">
              <i className="fa fa-star-o"></i> Vote Average :{" "}
              {fullMovieInfo.vote_average}, Genres:{" "}
              {fullMovieInfo.genres.join(" | ")} <br />
              <br />
            </div>
            <div className="storyline">{fullMovieInfo.overview}</div>
          </div>
          <div className="image-star-container">
            <img id="poster-img" src={fullMovieInfo.poster_path} alt="" />
            <div className="starRating">
              <StarRating updateIdRating={() => {}} tmdbId={tmdbId} />
            </div>
          </div>
          <div className="similar-movies-container">
            <div className="dashboard-rec-headings">Similar Movies:</div>
            <div className="similar-movies-card-row">
              <CardRow tmdbIds={similarMovies} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MovieInfo;
