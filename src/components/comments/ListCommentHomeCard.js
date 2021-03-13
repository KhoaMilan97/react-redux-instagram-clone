import React, { useState } from "react";
import { useSelector } from "react-redux";

import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import IconButton from "@material-ui/core/IconButton";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import FavoriteIcon from "@material-ui/icons/Favorite";
import Box from "@material-ui/core/Box";

import { likeComment, unLikeComment } from "../../functions/comment";

function ListCommentHomeCard({ comment }) {
  const [commentPost, setCommentPost] = useState(comment);
  const [loading, setLoading] = useState(false);
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

  return (
    <>
      <ListItem style={{ paddingTop: 0, paddingBottom: 0 }} disableGutters>
        <Box textAlign="right" style={{ paddingRight: 5, fontSize: "14px" }}>
          {comment.user.username}
        </Box>
        <ListItemText
          secondaryTypographyProps={{ align: "left" }}
          secondary={comment.content}
          style={{ marginTop: 0, marginBottom: 0 }}
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

export default ListCommentHomeCard;
