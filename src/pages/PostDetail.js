import React, { useEffect, useState, useCallback } from "react";
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
  CardMedia,
  CardHeader,
  CardContent,
  FormControl,
  InputAdornment,
  Input,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import SimpleSlider from "../components/card/SimpleSlider";
import { getSinglePost, removePosts } from "../functions/post";
import { setMessage } from "../redux/actions/messageAction";
import Spinner from "../components/loading/Spinner";
import ConfirmModal from "../components/modal/ConfirmModal";
import CardAction from "../components/card/CardAction";

const useStyles = makeStyles((theme) => ({
  card: {
    borderRadius: 0,
    width: "100%",
    height: "100%",
  },
  username: {
    padding: "0 15px",
  },
  rightBox: {
    padding: "15px 0 15px 15px",
  },
  media: {
    paddingTop: "56.25%", // 16:9
    minHeight: "600px",
    height: "100%",

    "&:focus": {
      border: "none",
      outline: "none",
    },
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
}));

function PostDetail() {
  const [post, setPost] = useState("");
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const history = useHistory();
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const classes = useStyles();
  const { id } = useParams();

  const checkUserIsFollow = (id) => {
    return auth.user.following.some((item) => item._id === id);
  };

  const getPost = useCallback(() => {
    setLoading(true);
    getSinglePost(id, auth.token)
      .then((response) => {
        setPost(response.data.post);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [id, auth.token]);

  useEffect(() => {
    getPost();
  }, [getPost]);

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

  if (loading) {
    return <Spinner pending={loading} />;
  }

  return (
    <Container maxWidth="md">
      <Grid container component={Paper} variant="outlined" square>
        <Grid item container justify="flex-end" md={7}>
          <Card className={classes.card} variant="outlined">
            {post.images?.length > 1 ? (
              <SimpleSlider images={post.images} bottom="10px" color="white" />
            ) : (
              <CardMedia
                image={post.images[0]?.url}
                title="slide"
                className={classes.media}
              />
            )}
          </Card>
        </Grid>
        <Grid item container direction="column" md={5}>
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
              <Button>Following</Button>
            ) : (
              <Button>Follow</Button>
            )}
          </Grid>
          <Divider />

          <Grid
            item
            container
            style={{
              flex: 1,
            }}
          >
            <Card
              variant="outlined"
              style={{
                borderWidth: 0,
                display: "flex",
                flexDirection: "column",
                height: "100%",
              }}
            >
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
                  <Link
                    style={{ color: "inherit" }}
                    to={`/${post.postedBy?.username}`}
                  >
                    {post.postedBy?.username}
                  </Link>
                }
                subheader={post.title}
              />
              <CardContent style={{ flexGrow: 1 }}>
                <Typography variant="body2" color="textSecondary" component="p">
                  This impressive paella is a perfect party dish and a fun meal
                  to cook together with your guests. Add 1 cup of frozen peas
                  along with the mussels, if you like.
                </Typography>
              </CardContent>
              <CardAction post={post} setPost={setPost} auth={auth} />
              <div style={{ padding: "5px 14px" }}>
                <Typography>
                  {post.likes.length} {post.likes.length > 1 ? "likes" : "like"}
                </Typography>
                <Typography className={classes.time}>
                  {moment(post.createdAt).fromNow()}
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
                  endAdornment={
                    <InputAdornment position="end">
                      <Button
                        className={classes.send}
                        disableRipple
                        style={{ paddingRight: 0 }}
                        disabled
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
    </Container>
  );
}

export default PostDetail;
