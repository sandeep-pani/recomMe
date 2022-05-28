import React, { useEffect, useState, lazy, Suspense } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Card from "../singleComponents/card";
import "./searchResults.css";
import SearchBar from "../singleComponents/searchBar";
// const Card = lazy(() => import("../singleComponents/card"));

const SearchResults = () => {
  const { query } = useParams();
  const [info, setInfo] = useState();
  const [result, setResult] = useState([]);
  useEffect(() => {
    axios
      .get("https://recomme-api.herokuapp.com/getsearchresults/" + query + "/50")
      .then((res) => {
        // console.log(res.data);
        const { message, searchResults } = res.data;
        setInfo(message);
        setResult(searchResults);
      });
  }, [query]);
  // console.log(result[0]);
  return (
    <>
      <SearchBar />
      <div className="ws-page">
        <div className="homepage-heading">{info}</div>
        <div className="results-container">
          <div className="cards">
            {result.map((i) => {
              return (
                //   <Suspense fallback={<div>Loading...</div>} key={i}>
                <Card updateIdRating={() => {}} tmdbId={i} key={i} />
                //    </Suspense>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchResults;
