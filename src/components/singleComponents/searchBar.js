import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./searchBar.css";

const SearchBar = () => {
  const { query } = useParams();
  const [searchInput, setSearchInput] = useState(query);
  const navigate = useNavigate();
  const handleOnClick = () => {
    if (searchInput) {
      navigate("/searchresults/" + searchInput);
    }
  };

  const handleKeypress = (e) => {
    //it triggers by pressing the enter key
    if (e.keyCode === 13) {
      handleOnClick();
    }
  };

  return (
    <>
      <div className="my-search-bar container justify-content-center">
        <div className="row">
          <div className="col-md-8">
            <div className="search-bar-flex input-group mb-3">
              <input
                type="text"
                name="search-bar"
                className="search-input form-control input-text"
                placeholder="Search movies/genres/directors..."
                aria-label="Recipient's username"
                aria-describedby="basic-addon2"
                value={searchInput}
                onKeyDown={handleKeypress}
                onChange={(e) => {
                  const { value } = e.target;
                  setSearchInput(value);
                }}
              />
              <div className="input-group-append">
                <button
                  className="btn btn-outline-warning btn-lg"
                  type="button"
                  onClick={handleOnClick}
                >
                  <i className="fa fa-search"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchBar;
