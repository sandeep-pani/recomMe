import axios from "axios";
import React, { useEffect, useState } from "react";
import "./userFact.css";
const UserFact = () => {
  const username = JSON.parse(localStorage.MyUser).username;
  const [fact, setFact] = useState("");
  const [imgPath, setImgPath] = useState("");
  // gets the img path relavant to userFact
  const getImgFromId = (id) => {
    axios
      .get(
        "https://api.themoviedb.org/3/movie/" +
          id +
          "?api_key=e8e22072362bab6dce2d0aa70d020c77&language=en-US"
      )
      .then((res) => {
        const path = res.data.backdrop_path;
        setImgPath("https://image.tmdb.org/t/p/w780/" + path);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getId = (fact_res) => {
    axios
      .get("https://recomme-api.herokuapp.com/getsearchresults/" + fact_res + "/1")
      .then((res) => {
        const search = res.data.searchResults;
        getImgFromId(search[0]);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getFact = () => {
    axios
      .get("https://recomme-api.herokuapp.com/getuserfact/" + username)
      .then((res) => {
        const fact_res = res.data.value;
        if (fact_res) {
          setFact(fact_res);
          getId(fact_res);
        } else {
          setFact(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getFact();

    // console.log("from useEffect fact:", fact_res);
  }, []);
  return (
    <>
      <div className="fact-bg" style={{ backgroundImage: `url(${imgPath})` }}>
        <div className="fact-container">
          <div className="fact-heading">fact about you</div>
          <br />
          <div className="fact-details-container">
            {fact ? (
              <>
                <div>
                  You seem to like movies associated with '{fact}' !<br />
                </div>
                <div className="stats-fact asterisk-headings">
                  *statistical fact collected from your ratings
                </div>
              </>
            ) : (
              <>
                <div>
                  <i className="fa fa-lock" aria-hidden="true"></i> Rate more
                  movies to unlock this feature!
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserFact;
