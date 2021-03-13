import React, { useState } from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import FavoriteIcon from "@material-ui/icons/Favorite";
import { makeStyles } from "@material-ui/core/styles";

import { likeComment, unLikeComment } from "../../functions/comment";

const useStyles = makeStyles((theme) => ({
  reply: {
    fontSize: "14px",
    textTransform: "capitalize",
    "&:hover": {
      backgroundColor: "transparent",
    },
  },
}));

function CommentPostList({ comment, handleFocus, setReplyCmnt }) {
  const [commentPost, setCommentPost] = useState(comment);
  const [loading, setLoading] = useState(false);
  const classes = useStyles();
  const { user, token } = useSelector((state) => state.auth);

  const isLiked = commentPost.likes.some((like) => like === user._id);

  const handleLikeComment = () => {
    setLoading(true);
    likeComment(commentPost._id, { id: user._id }, token)
      .then((res) => {
        setCommentPost(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const handleUnLikeComment = () => {
    setLoading(true);
    unLikeComment(commentPost._id, { id: user._id }, token)
      .then((res) => {
        setCommentPost(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  //  username_comment: "",
  //  user_rep_id: "",
  //  content: "",
  //  comment_id: "",

  const handleReply = () => {
    handleFocus();
    setReplyCmnt({
      username_comment: comment.user?.username,
      user_rep_id: user._id,
      comment_id: comment._id,
    });
  };

  return (
    <>
      <ListItem key={comment._id} disableGutters>
        <ListItemAvatar>
          <Avatar src={comment.user?.avatar.url} alt={comment.user.username} />
        </ListItemAvatar>
        <ListItemText
          primary={
            <>
              <Link
                style={{
                  color: "inherit",
                  fontSize: "14px",
                  fontWeight: 600,
                }}
                to={`/${comment.user?.username}`}
              >
                {comment.user?.username}
              </Link>{" "}
              <Typography style={{ fontSize: "14px" }} component="span">
                {comment.content}
              </Typography>
            </>
          }
          secondary={
            <>
              <Typography style={{ fontSize: "14px" }} component="span">
                {moment(comment.createdAt).fromNow()}
              </Typography>
              {commentPost.likes.length > 0 && (
                <Typography
                  style={{ fontSize: "14px", fontWeight: 500 }}
                  component="span"
                >
                  {" "}
                  {commentPost.likes.length} like
                </Typography>
              )}

              <Button
                color="inherit"
                disableElevation
                disableFocusRipple
                disableRipple
                className={classes.reply}
                onClick={handleReply}
              >
                Reply
              </Button>
            </>
          }
        />
        <ListItemSecondaryAction>
          {isLiked ? (
            <IconButton
              onClick={handleUnLikeComment}
              style={{ padding: "0" }}
              edge="end"
              aria-label="delete"
              disabled={loading}
            >
              <FavoriteIcon color="secondary" fontSize="small" />
            </IconButton>
          ) : (
            <IconButton
              onClick={handleLikeComment}
              style={{ padding: "0" }}
              edge="end"
              aria-label="delete"
              disabled={loading}
            >
              <FavoriteBorderIcon fontSize="small" />
            </IconButton>
          )}
        </ListItemSecondaryAction>
      </ListItem>
    </>
  );
}

export default CommentPostList;
