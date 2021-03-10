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
    // paddingTop: "56.25%", // 16:9
    paddingTop: "125%",
    width: "100%",
    height: 0,
    backgroundSize: "100% auto",

    "&:focus": {
      border: "none",
      outline: "none",
    },
  },
  mediaRoot: {
    display: "block !important",
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
    "& .slick-dots": {
      bottom: (props) => props.bottom,
    },
    "& .slick-dots li": {
      margin: 0,
      width: "12px",
      height: "12px",
      pointerEvents: "none !important",
    },
    "& .slick-dots li button": {
      cursor: "default !important",
      width: "12px",
      height: "12px",
    },
    "& .slick-dots li button:before": {
      fontSize: 7,
    },
    "& .slick-dots li.slick-active button:before": {
      color: (props) => (props.color ? props.color : "#0095f6"),
    },
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

function SimpleSlider({ images, ...props }) {
  const classes = useStyles(props);
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
    if (activeSlide === images.length - 1) {
      sethideRightArrow(true);
    } else {
      sethideRightArrow(false);
    }
  }, [activeSlide, images.length]);

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
        {images.length > 0 &&
          images.map((image) => (
            <div key={image.public_id} className={classes.mediaRoot}>
              <CardMedia
                image={image.url}
                title="slide"
                className={classes.media}
              />
            </div>
          ))}
      </Slider>
    </section>
  );
}

export default SimpleSlider;
