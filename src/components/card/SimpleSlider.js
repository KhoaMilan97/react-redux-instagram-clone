import React, { useRef, useState, useEffect } from "react";
import Slider from "react-slick";

import CardMedia from "@material-ui/core/CardMedia";
import { makeStyles } from "@material-ui/core/styles";
import { ButtonBase } from "@material-ui/core";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const useStyles = makeStyles((theme) => ({
  media: {
    paddingTop: "56.25%", // 16:9
    minHeight: "600px",
    height: "100%",
    objectFit: "cover",
    "&:focus": {
      border: "none",
      outline: "none",
    },
  },
  mediaRoot: {
    "&:focus": {
      border: "none",
      outline: "none",
    },
  },
  slider: {
    "&:focus": {
      border: "none",
      outline: "none",
    },
  },

  simpleSlide: {
    position: "relative",
    height: "100%",
  },
  arrowPrev: {
    backgroundColor: "#fafafaa6",
    borderRadius: "50%",
    position: "absolute",
    zIndex: 2,
    top: "50%",
    color: "#6f6d6d",
    left: "15px",
    transform: "translateY(-50%)",
  },
  arrowNext: {
    backgroundColor: "#fafafaa6",
    borderRadius: "50%",
    position: "absolute",
    zIndex: 2,
    top: "50%",
    color: "#6f6d6d",
    right: "15px",
    transform: "translateY(-50%)",
  },
}));

function SimpleSlider() {
  const classes = useStyles();
  const [activeSlide, setActiveSlide] = useState(0);
  const [hideLeftArrow, setHideLeftArrow] = useState(true);
  const [hideRightArrow, sethideRightArrow] = useState(false);

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    beforeChange: (current, next) => setActiveSlide(next),
  };

  const customSlider = useRef();

  useEffect(() => {
    if (activeSlide === 0) {
      setHideLeftArrow(true);
    } else {
      setHideLeftArrow(false);
    }
  }, [activeSlide]);

  useEffect(() => {
    if (activeSlide === 2) {
      sethideRightArrow(true);
    } else {
      sethideRightArrow(false);
    }
  }, [activeSlide]);

  const renderArrows = () => {
    return (
      <div className={classes.sliderArrow}>
        <ButtonBase
          style={{ display: hideLeftArrow ? "none" : "inline-flex" }}
          className={classes.arrowPrev}
          onClick={() => customSlider.current.slickPrev()}
        >
          <ChevronLeftIcon />
        </ButtonBase>
        <ButtonBase
          style={{ display: hideRightArrow ? "none" : "inline-flex" }}
          className={classes.arrowNext}
          onClick={() => customSlider.current.slickNext()}
        >
          <ChevronRightIcon />
        </ButtonBase>
      </div>
    );
  };

  return (
    <section className={classes.simpleSlide}>
      {renderArrows()}
      <Slider
        className={classes.slider}
        ref={(slider) => (customSlider.current = slider)}
        {...settings}
      >
        <div className={classes.mediaRoot}>
          <CardMedia
            image="https://res.cloudinary.com/khoa-milan/image/upload/v1613726025/152080731_321119076319698_8940594879176684497_n_pdnspp.jpg"
            title="slide"
            className={classes.media}
          />
        </div>
        <div className={classes.mediaRoot}>
          <CardMedia
            image="https://res.cloudinary.com/khoa-milan/image/upload/v1613726025/caokyduyen_hy4cws.jpg"
            title="slide"
            className={classes.media}
          />
        </div>
        <div className={classes.mediaRoot}>
          <CardMedia
            image="https://res.cloudinary.com/khoa-milan/image/upload/v1613622766/x6dgcmmkgtylcncw3iqa.jpg"
            title="slide"
            className={classes.media}
          />
        </div>
      </Slider>
    </section>
  );
}

export default SimpleSlider;
