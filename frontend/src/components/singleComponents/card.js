import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./card.css";

const handleDragStart = (e) => e.preventDefault();
// 5 star component

const WishListHeart = ({ tmdbId }) => {
  const [wishListStatus, setWishListStatus] = useState(false);
  const username = JSON.parse(localStorage.MyUser).username;
  useEffect(() => {
    axios
      .get(
        "https://recomme-api.herokuapp.com/addorremovefromwishlist/" +
          username +
          "/" +
          tmdbId
      )
      .then((res) => {
        setWishListStatus(res.data.value);
      });
  }, []);

  const wishListClickHandle = () => {
    if (wishListStatus) {
      setWishListStatus(false);
    } else {
      setWishListStatus(true);
    }
    axios
      .post(
        "https://recomme-api.herokuapp.com/addorremovefromwishlist/" +
          username +
          "/" +
          tmdbId
      )
      .then((res) => {
        // console.log(res.data);
      });
  };
  return (
    <>
      <div className="heart-button" onClick={wishListClickHandle}>
        <i className={"fa fa-heart" + (wishListStatus ? "" : "-o")}></i>
      </div>
    </>
  );
};

export const StarRating = ({ updateIdRating, tmdbId }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const username = JSON.parse(localStorage.MyUser).username;
  // function to get rating of the movie
  const getRating = () => {
    axios
      .get(
        "https://recomme-api.herokuapp.com/getmovieratingbyid/" + username + "/" + tmdbId
      )
      .then((res) => {
        const rated = res.data.rating;
        if (rated) {
          setRating(rated);
          // console.log("fetched rating for ", tmdbId, ":", res.data.rating);
        }
      });
  };
  useEffect(() => {
    getRating();
  }, []);

  // update the database with individual movie ratings of the user
  const starOnClickHandle = (index) => {
    axios
      .post("https://recomme-api.herokuapp.com/movieratings/" + username, {
        [tmdbId]: index,
      })
      .then((res) => {
        // console.log(res);
      });
  };

  return (
    <div className="star-rating">
      {[...Array(5)].map((star, index) => {
        index += 1;
        return (
          <button
            key={index}
            className={index <= (hover || rating) ? "on" : "off"}
            onClick={() => {
              setRating(index);
              updateIdRating(tmdbId, index);
              starOnClickHandle(index);
            }}
            onMouseEnter={() => setHover(index)}
            onMouseLeave={() => setHover(rating)}
          >
            <span className="star">&#9733;</span>
          </button>
        );
      })}
    </div>
  );
};

// card component- shows movie poster using tmdb id
const Card = ({ updateIdRating, tmdbId }) => {
  const navigate = useNavigate();
  const [imgPath, setImgPath] = useState();
  const [movieDetails, setMovieDetails] = useState({});
  // getting the image path and storing it in imgPath state
  const getImage = () => {
    axios
      .get(
        "https://api.themoviedb.org/3/movie/" +
          tmdbId +
          "?api_key=e8e22072362bab6dce2d0aa70d020c77&language=en-US"
      )
      .then((res) => {
        const { original_title, vote_average, poster_path } = res.data;
        setImgPath(poster_path);
        setMovieDetails({
          original_title: original_title,
          vote_average: vote_average,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getImage();
  }, []);

  return (
    <>
      <div className="full-card">
        <div
          className="img-container"
          onClick={() => {
            navigate("/movieinfo/" + tmdbId);
          }}
        >
          <img
            id="card-img"
            // className="lazyload"
            src={"https://image.tmdb.org/t/p/w154/" + imgPath}
            alt="poster-image"
            // onDragStart={handleDragStart}
            // role="presentation"
            loading="lazy"
            width="154"
          />
        </div>
        <span className="star-rating-component">
          {/* passing the tmdbid and updateIdRating function which will help us update the state to store tmdbid: rating */}
          <StarRating updateIdRating={updateIdRating} tmdbId={tmdbId} />
        </span>
        <div className="movie-details-container">
          <WishListHeart tmdbId={tmdbId} />
          <div>
            <div className="sub-info-container">
              TMDB <i className="fa fa-star-o"></i>
            </div>
            <div className="vote-average-container">
              {movieDetails.vote_average}
            </div>
          </div>
          <p
            className="card-title"
            onClick={() => {
              navigate("/movieinfo/" + tmdbId);
            }}
          >
            {movieDetails.original_title}
          </p>
        </div>
      </div>
    </>
  );
};

export default Card;
