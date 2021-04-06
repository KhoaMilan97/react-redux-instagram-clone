import React, { useState, useEffect, useCallback, forwardRef } from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

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
import CommentHomeCard from "../comments/CommentHomeCard";
import { createComment, getComment } from "../../functions/comment";
import CardModal from "../modal/CardModal";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    marginBottom: "50px",
    minHeight: "450px",
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
    "&:hover": {
      cursor: "pointer",
    },
  },
}));

const HomeCard = forwardRef((props, ref) => {
  const { post } = props;
  const [postCard, setPostCard] = useState(post);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [showMore, setShowMore] = useState(false);

  const [likeCount, setLikeCount] = useState(post.likes.length);
  const [open, setOpen] = useState(false);

  const auth = useSelector((state) => state.auth);

  // let imgHeight =
  //   (postCard.images[0]?.width / postCard.images[0]?.height) * 100;

  const classes = useStyles();

  const getPostComment = useCallback(() => {
    getComment(post._id, auth.token)
      .then((res) => {
        if (res.data) {
          setComments(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [post._id, auth.token]);

  useEffect(() => {
    getPostComment();
  }, [getPostComment]);

  const handleCreateComment = () => {
    createComment(
      {
        user: auth.user._id,
        content: comment,
        post_id: post._id,
      },
      auth.token
    )
      .then((res) => {
        getPostComment();

        setComment("");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Card ref={ref} variant="outlined" className={classes.root}>
      <CardHeader
        avatar={
          <Avatar
            aria-label="recipe"
            className={classes.avatar}
            src={postCard.postedBy?.avatar.url}
            component={Link}
            to={`/${postCard.postedBy?.username}`}
          />
        }
        action={
          <IconButton onClick={() => setOpen(true)} aria-label="settings">
            <MoreHorizIcon />
          </IconButton>
        }
        title={
          <Link
            style={{ color: "inherit" }}
            to={`/${postCard.postedBy?.username}`}
          >
            {postCard.postedBy?.username}
          </Link>
        }
      />
      {postCard.images.length > 0 && <SimpleSlider images={postCard.images} />}

      <CardAction
        post={postCard}
        setPost={setPostCard}
        auth={auth}
        setLikeCount={setLikeCount}
      />

      <CardContent className={classes.cardContent} style={{ paddingTop: 0 }}>
        <Typography>
          {likeCount} {likeCount > 1 ? "likes" : "like"}
        </Typography>
        <Typography
          variant="body2"
          color="textSecondary"
          style={{ color: "inherit" }}
          component="p"
        >
          <span style={{ color: "#262626", fontWeight: 600 }}>
            {postCard.postedBy?.username}
          </span>{" "}
          {showMore ? postCard.title : `${postCard.title.substr(0, 50)}...`}
          {!showMore && postCard.title.length > 50 && (
            <span className={classes.more} onClick={() => setShowMore(true)}>
              {" "}
              More
            </span>
          )}
        </Typography>
        {comments.length > 2 && (
          <Typography
            className={classes.link}
            component={Link}
            to={`/post/${postCard._id}`}
          >
            View all {comments.length} comments
          </Typography>
        )}

        {comments.length > 0 && <CommentHomeCard comments={comments} />}
        <Typography className={classes.time}>
          {moment(postCard.createdAt).fromNow()}
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
        user={postCard.postedBy}
        post={postCard}
      />
    </Card>
  );
});

export default HomeCard;
