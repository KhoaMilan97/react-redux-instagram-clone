import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

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
import { getSinglePost } from "../functions/post";
import Spinner from "../components/loading/Spinner";

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
  const classes = useStyles();
  const { id } = useParams();
  const [post, setPost] = useState("");
  const auth = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
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
    }
  }, [id, auth.token]);

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
            <Button>Following</Button>
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
    </Container>
  );
}

export default PostDetail;
