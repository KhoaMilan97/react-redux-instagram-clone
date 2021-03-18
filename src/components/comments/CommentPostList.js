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
import CircularProgress from "@material-ui/core/CircularProgress";
import { List, Collapse, Chip } from "@material-ui/core";

import {
  likeComment,
  unLikeComment,
  replyComment,
} from "../../functions/comment";
import { deleteCommentAction } from "../../redux/actions/commentAction";

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
  replyButon: {
    paddingLeft: theme.spacing(4),
    color: "#8e8e8e",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer",
  },
}));

function CommentPostList({ comment }) {
  const [commentPost, setCommentPost] = useState(comment);
  const [loading, setLoading] = useState(false);
  const [cmtLoading, setCmtLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [replyCmt, setReplyCmnt] = useState({
    username_comment: "",
    user_rep_id: "",
    comment_id: "",
    user_rep_name: "",
    user_rep_avatar: "",
    content: "",
  });
  const [isLiked, setIsLiked] = useState(false);
  const [openReply, setOpenReply] = useState(false);

  const [likeCount, setLikeCount] = useState(commentPost.likes.length);
  const {
    username_comment,
    user_rep_id,
    user_rep_name,
    user_rep_avatar,
    comment_id,
    content,
  } = replyCmt;

  const classes = useStyles();
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const userIsLiked = commentPost.likes.some((like) => like === user._id);
    if (userIsLiked) setIsLiked(true);
  }, [user._id, commentPost.likes]);

  const handleLikeComment = () => {
    if (loading) return;
    setLoading(true);
    setIsLiked(true);
    setLikeCount((previousCount) => previousCount + 1);
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
    if (loading) return;
    setLoading(true);
    setIsLiked(false);
    setLikeCount((previousCount) => previousCount - 1);
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

  const handleReply = () => {
    setReplyCmnt({
      ...replyCmt,
      username_comment: commentPost.user?.username,
      user_rep_id: user._id,
      user_rep_name: user.username,
      user_rep_avatar: user.avatar?.url,
      comment_id: commentPost._id,
    });
    setOpen(true);
  };

  const handleRepReply = (cmt) => {
    setReplyCmnt({
      ...replyCmt,
      username_comment: cmt.user_rep_name,
      user_rep_id: user._id,
      user_rep_name: user.username,
      user_rep_avatar: user.avatar?.url,
      comment_id: commentPost._id,
    });
    setOpen(true);
  };

  const handleCreateReplyComment = () => {
    // comment_id, username_comment, user_rep_id, content
    setCmtLoading(true);
    replyComment(
      {
        comment_id,
        username_comment,
        user_rep_id,
        user_rep_name,
        user_rep_avatar,
        content,
      },
      token
    )
      .then((res) => {
        setCommentPost(res.data);
        setCmtLoading(false);

        setOpen(false);
        setOpenReply(true);
        setReplyCmnt({
          content: "",
          username_comment: "",
          user_rep_id: "",
          user_rep_name: "",
          user_rep_avatar: "",
          comment_id: "",
        });
      })
      .catch((err) => {
        console.log(err);
        setCmtLoading(false);
        setOpen(false);
      });
  };

  const handleToggleReply = () => {
    setOpenReply(!openReply);
  };

  const handleDeleteCmt = async (id) => {
    await dispatch(deleteCommentAction(id, token));
  };

  return (
    <>
      <ListItem key={commentPost._id} disableGutters>
        <ListItemAvatar>
          <Avatar
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
                {commentPost.content}
              </Typography>
            </>
          }
          secondary={
            <>
              <Typography style={{ fontSize: "14px" }} component="span">
                {moment(commentPost.createdAt).fromNow()}
              </Typography>
              {likeCount > 0 && (
                <Typography
                  style={{ fontSize: "14px", fontWeight: 500 }}
                  component="span"
                >
                  {" "}
                  {likeCount} like
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
              {commentPost.user?.username === user.username && (
                <Button
                  color="inherit"
                  disableElevation
                  disableFocusRipple
                  disableRipple
                  className={classes.reply}
                  onClick={() => handleDeleteCmt(commentPost._id)}
                >
                  Delete
                </Button>
              )}
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
      {commentPost.reply.length > 0 &&
        (!openReply ? (
          <Typography
            onClick={handleToggleReply}
            className={classes.replyButon}
          >
            &#8212;&#8212; View replies ({commentPost.reply.length})
          </Typography>
        ) : (
          <Typography
            onClick={handleToggleReply}
            className={classes.replyButon}
          >
            &#8212;&#8212; Hide replies
          </Typography>
        ))}

      <Collapse in={openReply} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {commentPost.reply.map((cmt, index) => (
            <ListItem key={index} className={classes.nested}>
              <ListItemAvatar>
                <Avatar src={cmt.user_rep_avatar} alt={cmt.username_comment} />
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
                      to={`/${cmt.user_rep_name}`}
                    >
                      {cmt.user_rep_name}
                    </Link>{" "}
                    <Typography style={{ fontSize: "14px" }} component="span">
                      <Link
                        style={{ color: "#00376b" }}
                        to={`/${cmt.username_comment}`}
                      >
                        @{cmt.username_comment}
                      </Link>{" "}
                      {cmt.content}
                    </Typography>
                  </>
                }
                secondary={
                  <>
                    <Typography style={{ fontSize: "14px" }} component="span">
                      {cmt.createdAt ? moment(cmt.createdAt).fromNow() : ""}
                    </Typography>
                    {/* {likeCount > 0 && (
                      <Typography
                        style={{ fontSize: "14px", fontWeight: 500 }}
                        component="span"
                      >
                        {" "}
                        {likeCount} like
                      </Typography>
                    )} */}

                    <Button
                      color="inherit"
                      disableElevation
                      disableFocusRipple
                      disableRipple
                      className={classes.reply}
                      onClick={() => handleRepReply(cmt)}
                    >
                      Reply
                    </Button>
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
      </Collapse>

      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItem className={classes.nested}>
            <FormControl fullWidth>
              <Input
                type="text"
                style={{ marginTop: 5 }}
                disableUnderline
                className={classes.input}
                placeholder="Add a comment..."
                autoFocus
                value={content}
                onChange={(e) =>
                  setReplyCmnt({ ...replyCmt, content: e.target.value })
                }
                startAdornment={
                  <InputAdornment position="start">
                    <Chip
                      size="small"
                      variant="outlined"
                      label={username_comment}
                    />
                  </InputAdornment>
                }
                endAdornment={
                  <InputAdornment position="end">
                    <Button
                      className={classes.send}
                      disableRipple
                      onClick={handleCreateReplyComment}
                      style={{ paddingRight: 0 }}
                      disabled={!content}
                    >
                      {cmtLoading ? (
                        <CircularProgress color="primary" size={20} />
                      ) : (
                        "Post"
                      )}
                    </Button>
                  </InputAdornment>
                }
              />
            </FormControl>
          </ListItem>
        </List>
      </Collapse>
    </>
  );
}

export default CommentPostList;
