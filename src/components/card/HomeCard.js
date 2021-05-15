import React, { useState, forwardRef } from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";

import CardContent from "@material-ui/core/CardContent";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import { red } from "@material-ui/core/colors";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import FormControl from "@material-ui/core/FormControl";
import InputAdornment from "@material-ui/core/InputAdornment";
import Input from "@material-ui/core/Input";
import Divider from "@material-ui/core/Divider";
import { Button } from "@material-ui/core";

import SimpleSlider from "./SimpleSlider";
import CardAction from "./CardAction";

import CardModal from "../modal/CardModal";
import { createCommentAction } from "../../redux/actions/commentAction";
import CommentPost from "../comments/CommentPost";
// import Icon from "../Icon";
import EmojiIcon from "../EmojiIcon";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    marginBottom: "50px",
    minHeight: "450px",
    // overflow: "visible",
  },
  cardContent: {
    paddingBottom: "14px",
  },

  avatar: {
    backgroundColor: red[500],
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

  time: {
    color: "#8e8e8e",
    fontSize: "10px",
    textTransform: "uppercase",
    marginTop: "5px",
    lineHeight: "18px",
  },
  input: {
    padding: "10px 16px",
  },
  link: {
    color: "#8e8e8e",
    fontSize: "14px",
  },
  more: {
    color: "#8e8e8e",
    "&:hover": {
      cursor: "pointer",
    },
  },
}));

const HomeCard = forwardRef((props, ref) => {
  const [comment, setComment] = useState("");
  const [showMore, setShowMore] = useState(false);
  const { post } = props;

  const [open, setOpen] = useState(false);

  const { auth, socket } = useSelector((state) => state);
  const dispatch = useDispatch();

  const classes = useStyles();

  const handleCreateComment = () => {
    if (!comment.trim()) return;
    const newComment = {
      user: auth.user,
      content: comment,
      post_id: props.post._id,
      likes: [],
      userPostId: post.postedBy._id,
    };

    dispatch(createCommentAction(props.post, newComment, auth, socket));

    setComment("");
  };

  return (
    <Card ref={ref} variant="outlined" className={classes.root}>
      <CardHeader
        avatar={
          <Avatar
            aria-label="recipe"
            className={classes.avatar}
            src={props.post.postedBy?.avatar.url}
            component={Link}
            to={`/${props.post.postedBy?.username}`}
          />
        }
        action={
          <IconButton onClick={() => setOpen(true)} aria-label="settings">
            <MoreHorizIcon />
          </IconButton>
        }
        title={
          <Link style={{ color: "inherit" }} to={`/${post.postedBy?.username}`}>
            {post.postedBy?.username}
          </Link>
        }
      />
      {post.images.length > 0 && <SimpleSlider images={post.images} />}

      <CardAction post={post} auth={auth} />

      <CardContent className={classes.cardContent} style={{ paddingTop: 0 }}>
        <Typography>
          {post.likes.length} {post.likes.length > 1 ? "likes" : "like"}
        </Typography>
        <Typography
          variant="body2"
          color="textSecondary"
          style={{ color: "inherit" }}
          component="p"
        >
          <span style={{ color: "#262626", fontWeight: 600 }}>
            {post.postedBy?.username}
          </span>{" "}
          {showMore
            ? post.title
            : post.title.length > 60
            ? `${post.title.substr(0, 60)}...`
            : post.title}{" "}
          {!showMore && post.title.length > 60 && (
            <span className={classes.more} onClick={() => setShowMore(true)}>
              More
            </span>
          )}
        </Typography>

        {post.comments.length > 0 && (
          <CommentPost post={post} comments={post.comments} />
        )}
        <Typography className={classes.time}>
          {moment(post.createdAt).fromNow()}
        </Typography>
      </CardContent>
      <Divider variant="fullWidth" />
      <FormControl fullWidth>
        <Input
          type="text"
          style={{ marginTop: 5 }}
          disableUnderline
          className={classes.input}
          placeholder="Add a comment..."
          onChange={(e) => setComment(e.target.value)}
          value={comment}
          startAdornment={<EmojiIcon title={comment} setTitle={setComment} />}
          endAdornment={
            <InputAdornment position="end">
              <Button
                className={classes.send}
                disableRipple
                style={{ paddingRight: 0 }}
                onClick={handleCreateComment}
                disabled={comment.length < 1}
              >
                Post
              </Button>
            </InputAdornment>
          }
        />
      </FormControl>

      <CardModal
        open={open}
        setOpen={setOpen}
        user={post.postedBy}
        post={post}
      />
    </Card>
  );
});

export default HomeCard;
