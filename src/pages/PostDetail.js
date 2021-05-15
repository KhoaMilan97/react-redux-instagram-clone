import React, { useEffect, useState, useRef } from "react";
import { useParams, useHistory, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";

import {
  Container,
  Grid,
  Card,
  Avatar,
  Typography,
  Button,
  Paper,
  Divider,
  CardHeader,
  CardContent,
  FormControl,
  InputAdornment,
  Input,
  useMediaQuery,
  Hidden,
  CircularProgress,
} from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";

import ConfirmModal from "../components/modal/ConfirmModal";
import CardAction from "../components/card/CardAction";
import CommentPost from "../components/comments/CommentPost";
import PostDetailSkeleton from "../components/loading/PostDetailSkeleton";
import SimpleSlider from "../components/card/SimpleSlider";
import FollowModal from "../components/modal/FollowModal";

import useFollow from "../utils/useFollow";
//import { useScroll } from "../utils/useScroll";

import { deletePostAction, getPostAction } from "../redux/actions/postAction";
import { actionTypes } from "../redux/actions/actionType";
import { setMessage } from "../redux/actions/messageAction";
import { createCommentAction } from "../redux/actions/commentAction";
import PostModal from "../components/modal/PostModal";
import EmojiIcon from "../components/EmojiIcon";

const useStyles = makeStyles((theme) => ({
  card: {
    borderRadius: 0,
    width: "100%",
    height: "100%",
    //minHeight: "450px",
  },
  username: {
    padding: "0 15px",
  },
  rightBox: {
    padding: "15px 0 15px 15px",
  },

  input: {
    padding: "8px 16px",
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
  commentCard: {
    borderWidth: 0,
    display: "flex",
    flexDirection: "column",
    height: "100%",
    width: "100%",
    // overflow: "visible",
    [theme.breakpoints.down("md")]: {
      width: "100%",
    },
  },
  cardContent: {
    flexGrow: 1,
    overflowY: "scroll",
    "&::-webkit-scrollbar": {
      width: 0 /* Remove scrollbar space */,
      background: "transparent" /* Optional: just make scrollbar invisible */,
    },
    height: "100px",
    [theme.breakpoints.down("sm")]: {
      height: "auto",
      maxHeight: "600px",
      overflowY: "scroll",
    },
  },
}));

function PostDetail() {
  const [post, setPost] = useState("");
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [openFollowModal, setOpenFollowModal] = useState(false);
  const [comment, setComment] = useState("");

  const history = useHistory();
  const dispatch = useDispatch();
  const { auth, socket, postDetail, postReducer } = useSelector(
    (state) => state
  );

  const { followLoading, handleFollowAction, handleUnFollowAction } = useFollow(
    post?.postedBy?._id,
    auth.token
  );
  const classes = useStyles();
  const { id } = useParams();
  const commentRef = useRef();
  const theme = useTheme();
  const matchesMD = useMediaQuery(theme.breakpoints.down("md"));

  const checkUserIsFollow = (id) => {
    return auth.user.following.some((item) => item._id === id);
  };

  useEffect(() => {
    setLoading(true);
    dispatch(getPostAction(postDetail, id, auth));
    if (postDetail.length > 0) {
      const newArr = postDetail.filter((post) => post._id === id);
      setPost(newArr[0]);
      setLoading(false);
    }
  }, [postDetail, dispatch, id, auth]);

  const handleRemovePost = async () => {
    await dispatch(deletePostAction(post, auth, socket));
    dispatch(setMessage("Delete post success!", "success"));
    return history.push("/");
  };

  const handleCreateComment = () => {
    if (!comment.trim()) return;
    const newComment = {
      user: auth.user,
      content: comment,
      post_id: post._id,
      likes: [],
      userPostId: post.postedBy._id,
    };

    dispatch(createCommentAction(post, newComment, auth, socket));

    setComment("");
  };

  const handleFocus = (event) => {
    commentRef.current.focus();
  };

  if (loading) {
    return <PostDetailSkeleton />;
  }

  if (post?.length <= 0 || !post) {
    return <PostDetailSkeleton />;
  }

  const titleCard = (
    <Grid className={classes.rightBox} item container alignItems="center">
      <Avatar
        src={post.postedBy?.avatar.url}
        alt="avatar"
        component={Link}
        to={`/${post.postedBy?.username}`}
      />
      <Typography
        component={Link}
        style={{ color: "inherit" }}
        to={`/${post.postedBy?.username}`}
        className={classes.username}
      >
        {post.postedBy?.username}
      </Typography>
      {post.postedBy?._id === auth.user._id ? (
        <div style={{ flex: "1", textAlign: "right" }}>
          <Button
            color="primary"
            onClick={() => {
              dispatch({
                type: actionTypes.POST_MODAL,
                payload: { ...post, onEdit: true },
              });
            }}
          >
            Edit
          </Button>
          <Button color="secondary" onClick={() => setOpen(true)}>
            Delete
          </Button>
        </div>
      ) : checkUserIsFollow(post.postedBy?._id) ? (
        <Button onClick={() => setOpenFollowModal(true)}>
          {followLoading ? (
            <CircularProgress size={25} color="primary" />
          ) : (
            "Following"
          )}
        </Button>
      ) : (
        <Button color="primary" onClick={handleFollowAction}>
          {followLoading ? (
            <CircularProgress size={25} color="primary" />
          ) : (
            "Follow"
          )}
        </Button>
      )}
    </Grid>
  );

  return (
    <Container maxWidth="md">
      <PostModal open={postReducer.open} />
      <Grid
        container
        component={Paper}
        variant="outlined"
        alignItems="stretch"
        square
      >
        <Grid
          item
          container
          direction={matchesMD ? "column" : undefined}
          justify="flex-end"
          md={7}
        >
          <Hidden mdUp>{titleCard}</Hidden>
          <Grid item container>
            <Card className={classes.card} variant="outlined">
              {post.images?.length > 0 && (
                <SimpleSlider
                  images={post.images}
                  bottom="10px"
                  color="white"
                />
              )}
            </Card>
          </Grid>
        </Grid>
        <Grid item container direction="column" md={5}>
          <Hidden smDown>{titleCard}</Hidden>
          <Divider />

          <Grid
            item
            container
            style={{
              flex: 1,
            }}
          >
            <Card className={classes.commentCard} variant="outlined">
              <CardHeader
                avatar={
                  <Avatar
                    src={post.postedBy?.avatar.url}
                    aria-label="recipe"
                    className={classes.avatar}
                    component={Link}
                    to={`/${post.postedBy?.username}`}
                  />
                }
                title={
                  <>
                    <Link
                      style={{ color: "inherit" }}
                      to={`/${post.postedBy?.username}`}
                    >
                      {post.postedBy?.username}
                    </Link>{" "}
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      component="span"
                    >
                      {post.title}
                    </Typography>
                  </>
                }
                subheader={moment(post.createdAt).fromNow(true)}
              />
              <CardContent className={classes.cardContent}>
                {post.comments?.length > 0 && (
                  <CommentPost post={post} comments={post.comments} />
                )}
              </CardContent>
              <CardAction post={post} auth={auth} handleFocus={handleFocus} />
              <div style={{ padding: "5px 14px" }}>
                <Typography>
                  {post.likes?.length}{" "}
                  {post.likes?.length > 1 ? "likes" : "like"}
                </Typography>
                <Typography className={classes.time}>
                  {moment(post.createdAt).fromNow(true)}
                </Typography>
              </div>
              <Divider variant="fullWidth" />
              <FormControl fullWidth>
                <Input
                  type="text"
                  style={{ marginTop: 5 }}
                  disableUnderline
                  className={classes.input}
                  placeholder="Add a comment..."
                  inputRef={commentRef}
                  onChange={(e) => setComment(e.target.value)}
                  value={comment}
                  startAdornment={
                    <EmojiIcon title={comment} setTitle={setComment} />
                  }
                  endAdornment={
                    <InputAdornment position="end">
                      <Button
                        className={classes.send}
                        disableRipple
                        onClick={handleCreateComment}
                        style={{ paddingRight: 0 }}
                        disabled={comment.length < 1}
                      >
                        Post
                      </Button>
                    </InputAdornment>
                  }
                />
              </FormControl>
            </Card>
          </Grid>
        </Grid>
      </Grid>
      <ConfirmModal
        open={open}
        setOpen={setOpen}
        handleRemovePost={handleRemovePost}
      />
      <FollowModal
        open={openFollowModal}
        setOpen={setOpenFollowModal}
        user={post.postedBy}
        handleUnFollowAction={handleUnFollowAction}
      />
    </Container>
  );
}

export default PostDetail;
