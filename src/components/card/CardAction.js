import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";

import CardActions from "@material-ui/core/CardActions";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";

import BookmarkBorderOutlinedIcon from "@material-ui/icons/BookmarkBorderOutlined";
import FavoriteBorderOutlinedIcon from "@material-ui/icons/FavoriteBorderOutlined";
import ModeCommentOutlinedIcon from "@material-ui/icons/ModeCommentOutlined";
import TelegramIcon from "@material-ui/icons/Telegram";
import FavoriteIcon from "@material-ui/icons/Favorite";

import { likePost, unLikePost } from "../../functions/post";

const useStyles = makeStyles((theme) => ({
  expand: {
    marginLeft: "auto",
    padding: "5px",
  },

  icon: {
    padding: "5px",
    "&:hover": {
      backgroundColor: "transparent",
    },
    "&:disabled": {
      cursor: "pointer",
      pointerEvents: "auto",
    },
  },
}));

function CardAction(props, ref) {
  const classes = useStyles();
  const { post, setPost, auth, handleFocus, setLikeCount } = props;
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const location = useLocation();
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const userIsLiked = post.likes.some((like) => like === auth.user._id);
    if (userIsLiked) setIsLiked(true);
  }, [auth.user._id, post.likes]);

  const handleLike = () => {
    if (loading) return;
    setLoading(true);
    setIsLiked(true);
    setLikeCount((previousCount) => previousCount + 1);

    likePost({ id: auth.user._id }, post._id, auth.token)
      .then((res) => {
        const newData = post._id === res.data._id ? res.data : post;
        setPost(newData);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const handleUnLike = () => {
    if (loading) return;
    setLoading(true);
    setIsLiked(false);
    setLikeCount((previousCount) => previousCount - 1);

    unLikePost({ id: auth.user._id }, post._id, auth.token)
      .then((res) => {
        const newData = post._id === res.data._id ? res.data : post;
        setPost(newData);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const handleCommentAction = () => {
    if (location.pathname === "/") {
      history.push(`/post/${post._id}`);
    } else {
      handleFocus();
    }
  };

  return (
    <>
      <CardActions disableSpacing>
        {isLiked ? (
          <IconButton
            onClick={handleUnLike}
            className={classes.icon}
            aria-label="remove to favorites"
          >
            <FavoriteIcon color="secondary" />
          </IconButton>
        ) : (
          <IconButton
            onClick={handleLike}
            className={classes.icon}
            aria-label="add to favorites"
          >
            <FavoriteBorderOutlinedIcon />
          </IconButton>
        )}

        <IconButton
          onClick={handleCommentAction}
          className={classes.icon}
          aria-label="comment"
        >
          <ModeCommentOutlinedIcon />
        </IconButton>
        <IconButton className={classes.icon} aria-label="share">
          <TelegramIcon />
        </IconButton>
        <IconButton className={classes.expand} aria-label="show more">
          <BookmarkBorderOutlinedIcon />
        </IconButton>
      </CardActions>
    </>
  );
}

export default CardAction;
