import React, { useState, useEffect } from "react";
import Card from "../singleComponents/card";
import axios from "axios";
// used to get wishlist of user
const WishListPage = () => {
  const username = JSON.parse(localStorage.MyUser).username;
  const [wishListItems, setWishListItems] = useState([]);
  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/addorremovefromwishlist/" + username)
      .then((res) => {
        setWishListItems(res.data.wishlist);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <>
      <div className="ws-page">
        <div className="homepage-heading">
          There are {wishListItems.length} movies in your wishlist.
        </div>
        <div className="results-container">
          <div className="cards">
            {wishListItems.length != 0 &&
              wishListItems.map((i) => {
                return <Card updateIdRating={() => {}} tmdbId={i} key={i} />;
              })}
          </div>
        </div>
      </div>
    </>
  );
};

export default WishListPage;
