import React, { useState, useEffect } from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

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
import FormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";
import InputAdornment from "@material-ui/core/InputAdornment";

import {
  likeCommentAction,
  unLikeCommentAction,
  updateCommentAction,
} from "../../redux/actions/commentAction";
import CommentMenu from "../post-detail/CommentMenu";
import InputComment from "./InputComment";

const useStyles = makeStyles((theme) => ({
  reply: {
    fontSize: "14px",
    textTransform: "capitalize",
    "&:hover": {
      backgroundColor: "transparent",
    },
  },
  input: {
    padding: "0px",
  },
  send: {
    color: "#0095f6",
    fontSize: "14px",
    textTransform: "capitalize",
    "&:hover": {
      backgroundColor: "transparent",
    },
    "&:disabled": {
      color: "#0095f6",
      opacity: "0.4",
    },
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },

  cancel: {
    color: theme.palette.secondary.main,
    fontSize: "14px",
    textTransform: "capitalize",
    "&:hover": {
      backgroundColor: "transparent",
    },
  },
  smallAvatar: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  tagName: {
    color: theme.palette.primary.main,
  },
}));

function CommentItem({ comment, post, nested, children }) {
  const [commentPost, setCommentPost] = useState(comment);

  const [loading, setLoading] = useState(false);

  const [isLiked, setIsLiked] = useState(false);
  const [onReply, setOnReply] = useState(false);
  const [onEdit, setOnEdit] = useState(false);
  const [content, setContent] = useState(comment?.content);

  const classes = useStyles();
  const auth = useSelector((state) => state.auth);
  const { user } = auth;
  const dispatch = useDispatch();

  useEffect(() => {
    if (comment) {
      setCommentPost(comment);
    }
  }, [comment]);

  useEffect(() => {
    const userIsLiked = comment.likes.some((like) => like._id === user._id);
    if (userIsLiked) setIsLiked(true);
  }, [user._id, comment?.likes]);

  const handleLikeComment = async () => {
    if (loading) return;
    setLoading(true);
    setIsLiked(true);
    await dispatch(likeCommentAction(comment, post, auth));
    setLoading(false);
  };

  const handleUnLikeComment = async () => {
    if (loading) return;
    setLoading(true);
    setIsLiked(false);
    await dispatch(unLikeCommentAction(comment, post, auth));
    setLoading(false);
  };

  const handleReply = () => {
    if (onReply) return setOnReply(false);
    setOnReply({ ...comment, commentId: comment._id });
  };

  const handleUpdateComment = () => {
    if (comment.content !== content) {
      setOnEdit(false);
      dispatch(updateCommentAction({ post, comment, content }, auth));
    } else {
      setOnEdit(false);
    }
  };

  return (
    <>
      {onEdit ? (
        <FormControl fullWidth className={nested ? classes.nested : undefined}>
          <Input
            type="text"
            style={{ marginTop: 10 }}
            autoFocus
            className={classes.input}
            placeholder="Update a comment..."
            onChange={(e) => setContent(e.target.value)}
            value={content}
            startAdornment={
              <InputAdornment position="start">
                <Avatar
                  className={classes.smallAvatar}
                  component={Link}
                  to={`/${commentPost.user?.username}`}
                  src={commentPost.user?.avatar?.url}
                  alt={commentPost.user.username}
                />
                {nested && (
                  <Link
                    style={{ marginLeft: 5 }}
                    className={classes.tagName}
                    to={`/${commentPost.tag?.username}`}
                  >
                    @{commentPost.tag?.username}
                  </Link>
                )}
              </InputAdornment>
            }
            endAdornment={
              <InputAdornment position="end">
                <Button
                  className={classes.cancel}
                  disableRipple
                  style={{ paddingRight: 10 }}
                  onClick={() => setOnEdit(false)}
                >
                  Cancel
                </Button>
                <Button
                  className={classes.send}
                  disableRipple
                  style={{ paddingRight: 0 }}
                  onClick={handleUpdateComment}
                  disabled={commentPost.length < 1}
                >
                  Update
                </Button>
              </InputAdornment>
            }
          />
        </FormControl>
      ) : (
        <ListItem
          style={{ paddingTop: 0, paddingBottom: 0 }}
          key={commentPost._id}
          disableGutters
          className={nested ? classes.nested : undefined}
        >
          <ListItemAvatar>
            <Avatar
              component={Link}
              to={`/${commentPost.user?.username}`}
              src={commentPost.user?.avatar?.url}
              alt={commentPost.user.username}
            />
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
                  to={`/${commentPost.user?.username}`}
                >
                  {commentPost.user?.username}
                </Link>{" "}
                <Typography style={{ fontSize: "14px" }} component="span">
                  {nested && (
                    <Link
                      className={classes.tagName}
                      to={`/${commentPost.tag?.username}`}
                    >
                      @{commentPost.tag?.username}
                    </Link>
                  )}{" "}
                  {commentPost.content}
                </Typography>
              </>
            }
            secondary={
              <>
                <Typography style={{ fontSize: "14px" }} component="span">
                  {moment(commentPost.createdAt).fromNow(true)}
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
                  {onReply ? "Cancel" : "Reply"}
                </Button>
              </>
            }
          />
          <ListItemSecondaryAction style={{ display: "flex" }}>
            <CommentMenu
              post={post}
              user={user}
              comment={comment}
              setOnEdit={setOnEdit}
            />
            {isLiked ? (
              <IconButton
                onClick={handleUnLikeComment}
                style={{ padding: "0" }}
                edge="end"
                aria-label="delete"
              >
                <FavoriteIcon color="secondary" fontSize="small" />
              </IconButton>
            ) : (
              <IconButton
                onClick={handleLikeComment}
                style={{ padding: "0" }}
                edge="end"
                aria-label="delete"
              >
                <FavoriteBorderIcon fontSize="small" />
              </IconButton>
            )}
          </ListItemSecondaryAction>
        </ListItem>
      )}
      {children}

      <InputComment
        onReply={onReply}
        setOnReply={setOnReply}
        post={post}
        title="Add reply comment..."
      />
    </>
  );
}

export default CommentItem;
