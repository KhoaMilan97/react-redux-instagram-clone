import React, { useEffect, useState, useCallback, useRef } from "react";
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
  IconButton,
  CircularProgress,
} from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";

import SimpleSlider from "../components/card/SimpleSlider";
import { getSinglePost, removePosts } from "../functions/post";
import { setMessage } from "../redux/actions/messageAction";
import {
  getCommentsAction,
  createCommentAction,
  getTotalCommentsAction,
  clearOldComments,
} from "../redux/actions/commentAction";
import ConfirmModal from "../components/modal/ConfirmModal";
import CardAction from "../components/card/CardAction";
import CommentPost from "../components/comments/CommentPost";
import { useScroll } from "../utils/useScroll";
import PostDetailSkeleton from "../components/loading/PostDetailSkeleton";
import useFollow from "../utils/useFollow";
import FollowModal from "../components/modal/FollowModal";

const useStyles = makeStyles((theme) => ({
  card: {
    borderRadius: 0,
    width: "100%",
    height: "100%",
    minHeight: "450px",
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
    //maxHeight: "592px",
    width: "100%",
    [theme.breakpoints.down("md")]: {
      width: "100%",
    },
  },
  cardContent: {
    "&::-webkit-scrollbar": {
      width: 0 /* Remove scrollbar space */,
      background: "transparent" /* Optional: just make scrollbar invisible */,
    },
  },
}));

function PostDetail() {
  const [post, setPost] = useState("");
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [openFollowModal, setOpenFollowModal] = useState(false);
  const [page, setPage] = useState(1);
  const [comment, setComment] = useState("");
  const [cmtLoading, setCmtLoading] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const [executeScroll, elRef] = useScroll();
  const history = useHistory();
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const { comments, status, totalComments, limit } = useSelector(
    (state) => state.comments
  );
  const { followLoading, handleFollowAction, handleUnFollowAction } = useFollow(
    post.postedBy?._id,
    auth.token
  );
  const classes = useStyles();
  const { id } = useParams();
  const commentRef = useRef();
  const theme = useTheme();
  const matchesMD = useMediaQuery(theme.breakpoints.down("md"));
  const limitRef = useRef();

  const checkUserIsFollow = (id) => {
    return auth.user.following.some((item) => item._id === id);
  };

  useEffect(() => {
    limitRef.current = limit;
  }, [limit]);

  useEffect(() => {
    dispatch(clearOldComments());
  }, [id, dispatch]);

  const getComments = useCallback(() => {
    dispatch(getCommentsAction(id, page, limitRef.current, auth.token));
  }, [id, page, auth.token, dispatch]);

  const getPost = useCallback(() => {
    setLoading(true);
    getSinglePost(id, auth.token)
      .then((response) => {
        setPost(response.data.post);
        setLikeCount(response.data.post.likes.length);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [id, auth.token]);

  useEffect(() => {
    getComments();
  }, [getComments]);

  useEffect(() => {
    getPost();
  }, [getPost]);

  useEffect(() => {
    dispatch(getTotalCommentsAction(id, auth.token));
  }, [id, auth.token, dispatch]);

  const handleRemovePost = () => {
    removePosts(id, auth.token)
      .then((res) => {
        dispatch(setMessage("Delete post success!", "success"));
        history.push(`/${auth.user.username}`);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleCreateComment = async () => {
    setCmtLoading(true);
    await dispatch(
      createCommentAction(
        { user: auth.user._id, content: comment, post_id: post._id },
        auth.token
      )
    );
    setComment("");
    setCmtLoading(false);
    executeScroll();
  };

  const handleFocus = (event) => {
    commentRef.current.focus();
  };

  const handleLoadMoreComment = () => {
    setPage((prevPage) => prevPage + 1);
  };

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
            component={Link}
            to={`/post/edit/${post._id}`}
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

  if (loading) {
    return <PostDetailSkeleton />;
  }

  return (
    <Container maxWidth="md">
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
              <CardContent
                className={classes.cardContent}
                style={{ flexGrow: 1, overflowY: "scroll" }}
              >
                <CommentPost comments={comments} status={status} ref={elRef} />
                {totalComments > comments.length && status === "succeeded" && (
                  <IconButton
                    onClick={handleLoadMoreComment}
                    style={{ display: "block", margin: "0 auto" }}
                  >
                    <AddCircleOutlineIcon />
                  </IconButton>
                )}
              </CardContent>
              <CardAction
                post={post}
                setPost={setPost}
                auth={auth}
                handleFocus={handleFocus}
                setLikeCount={setLikeCount}
              />
              <div style={{ padding: "5px 14px" }}>
                <Typography>
                  {likeCount} {likeCount > 1 ? "likes" : "like"}
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
                  ref={commentRef}
                  onChange={(e) => setComment(e.target.value)}
                  value={comment}
                  endAdornment={
                    <InputAdornment position="end">
                      <Button
                        className={classes.send}
                        disableRipple
                        onClick={handleCreateComment}
                        style={{ paddingRight: 0 }}
                        disabled={comment.length < 1}
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
