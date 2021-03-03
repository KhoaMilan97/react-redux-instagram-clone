import React, { useEffect, useState, useCallback } from "react";
import { useParams, useHistory, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

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
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import SimpleSlider from "../components/card/SimpleSlider";
import { getSinglePost, removePosts } from "../functions/post";
import { setMessage } from "../redux/actions/messageAction";
import Spinner from "../components/loading/Spinner";
import ConfirmModal from "../components/modal/ConfirmModal";

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
    objectFit: "cover",
    "&:focus": {
      border: "none",
      outline: "none",
    },
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
        dispatch(setMessage(res.data.msg, "Delete post success!"));
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
        <Grid item container justify="flex-end" sm={7}>
          <Card className={classes.card}>
            {post.images?.length > 0 ? (
              <SimpleSlider images={post.images} />
            ) : (
              <CardMedia
                image={post.images?.url}
                title="slide"
                className={classes.media}
              />
            )}
          </Card>
        </Grid>
        <Grid item container direction="column" sm={5}>
          <Grid className={classes.rightBox} item container alignItems="center">
            <Avatar src={post.postedBy?.avatar.url} alt="avatar" />
            <Typography className={classes.username}>
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
            ) : (
              <Button>Following</Button>
            )}
          </Grid>
          <Divider />
          <Grid className={classes.rightBox} item container alignItems="center">
            <Avatar src={post.postedBy?.avatar.url} alt="avatar" />
            <Typography className={classes.username}>
              {post.postedBy?.username}
            </Typography>
            <Typography>{post.title}</Typography>
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
