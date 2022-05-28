import React from "react";
import "./card";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import Card from "./card";
import "./cardRow.css";

import { useRef, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/free-mode";

// import "./styles.css";

// import required modules
import { FreeMode, Pagination, Navigation } from "swiper";

const handleDragStart = (e) => e.preventDefault();

const CardRow = ({ tmdbIds }) => {
  const items = tmdbIds.map((i) => {
    return (
      <SwiperSlide key={i}>
        <Card key={i} tmdbId={i} updateIdRating={() => {}} />
      </SwiperSlide>
    );
  });
  return (
    <>
      <Swiper
        slidesPerView={"auto"}
        pagination={{
          type: "progressbar",
        }}
        spaceBetween={"3%"}
        navigation={true}
        freeMode={true}
        modules={[Pagination, Navigation, FreeMode]}
        className="mySwiper"
      >
        {items}
      </Swiper>
    </>
  );
};

export default CardRow;
