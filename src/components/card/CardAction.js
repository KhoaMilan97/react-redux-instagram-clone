import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import CardActions from "@material-ui/core/CardActions";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";

import BookmarkBorderOutlinedIcon from "@material-ui/icons/BookmarkBorderOutlined";
import FavoriteBorderOutlinedIcon from "@material-ui/icons/FavoriteBorderOutlined";
import ModeCommentOutlinedIcon from "@material-ui/icons/ModeCommentOutlined";
import TelegramIcon from "@material-ui/icons/Telegram";
import FavoriteIcon from "@material-ui/icons/Favorite";
import BookmarkIcon from "@material-ui/icons/Bookmark";

import { savedPost, unsavedPost } from "../../functions/user";
import { actionTypes } from "../../redux/actions/actionType";
import {
  likePostAction,
  UnLikePostAction,
} from "../../redux/actions/postAction";
import ShareModal from "../modal/ShareModal";
import { BASE_URL } from "../../utils/config";

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
  const { post, auth, handleFocus } = props;
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const location = useLocation();
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isShare, setIsShare] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const dispatch = useDispatch();
  const socket = useSelector((state) => state.socket);

  useEffect(() => {
    if (post.likes.find((like) => like._id === auth.user._id)) setIsLiked(true);
  }, [auth.user._id, post.likes]);

  useEffect(() => {
    const isPostSaved = auth.user.saved.some((id) => id === post._id);
    setIsSaved(isPostSaved);
  }, [auth.user.saved, post._id]);

  const handleLike = async () => {
    if (loading) return;
    setLoading(true);
    setIsLiked(true);
    await dispatch(likePostAction(post, auth, socket));
    setLoading(false);
  };

  const handleUnLike = async () => {
    if (loading) return;
    setLoading(true);
    setIsLiked(false);
    await dispatch(UnLikePostAction(post, auth, socket));
    setLoading(false);
  };

  const handleSaved = () => {
    if (saveLoading) return;
    setIsSaved(true);
    setSaveLoading(true);
    savedPost(post._id, auth.user._id, auth.token)
      .then((res) => {
        if (res.data) {
          dispatch({
            type: actionTypes.GET_USER,
            payload: res.data,
          });
          setSaveLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setSaveLoading(false);
      });
  };

  const handleUnSaved = () => {
    if (saveLoading) return;
    setIsSaved(false);
    setSaveLoading(true);
    unsavedPost(post._id, auth.user._id, auth.token)
      .then((res) => {
        if (res.data) {
          dispatch({
            type: actionTypes.GET_USER,
            payload: res.data,
          });
          setSaveLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setSaveLoading(false);
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
          <Tooltip title="Un Like" arrow>
            <IconButton
              onClick={handleUnLike}
              className={classes.icon}
              aria-label="remove to favorites"
            >
              <FavoriteIcon color="secondary" />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Like" arrow>
            <IconButton
              onClick={handleLike}
              className={classes.icon}
              aria-label="add to favorites"
            >
              <FavoriteBorderOutlinedIcon />
            </IconButton>
          </Tooltip>
        )}

        <Tooltip title="Comment" arrow>
          <IconButton
            onClick={handleCommentAction}
            className={classes.icon}
            aria-label="comment"
          >
            <ModeCommentOutlinedIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Share" arrow>
          <IconButton
            onClick={() => setIsShare(true)}
            className={classes.icon}
            aria-label="share"
          >
            <TelegramIcon />
          </IconButton>
        </Tooltip>
        {isSaved ? (
          <Tooltip title="Un Saved" arrow>
            <IconButton
              onClick={handleUnSaved}
              className={classes.expand}
              aria-label="show more"
            >
              <BookmarkIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Saved" arrow>
            <IconButton
              onClick={handleSaved}
              className={classes.expand}
              aria-label="show more"
            >
              <BookmarkBorderOutlinedIcon />
            </IconButton>
          </Tooltip>
        )}
      </CardActions>
      <ShareModal
        open={isShare}
        setOpen={setIsShare}
        url={`${BASE_URL}/post/${post._id}`}
        // url="https://www.instagram.com/"
      />
    </>
  );
}

export default CardAction;
