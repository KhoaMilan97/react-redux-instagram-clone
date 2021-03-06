import React, { useState } from "react";
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
import { Button, CardMedia } from "@material-ui/core";

import SimpleSlider from "./SimpleSlider";

import CardAction from "./CardAction";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    marginBottom: "50px",
  },
  cardContent: {
    paddingBottom: "14px",
  },
  media: {
    paddingTop: "56.25%", // 16:9
    minHeight: "600px",
    height: "100%",
    objectFit: "cover",
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
}));

export default function HomeCard({ post }) {
  const classes = useStyles();
  const [postCard, setPostCard] = useState(post);

  const auth = useSelector((state) => state.auth);

  return (
    <Card variant="outlined" className={classes.root}>
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
          <IconButton aria-label="settings">
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
      {postCard.images.length > 1 ? (
        <SimpleSlider images={postCard.images} />
      ) : (
        <CardMedia
          image={postCard.images[0]?.url}
          title="slide"
          className={classes.media}
        />
      )}

      <CardAction post={postCard} setPost={setPostCard} auth={auth} />

      <CardContent className={classes.cardContent} style={{ paddingTop: 0 }}>
        <Typography>
          {postCard.likes.length} {postCard.likes.length > 1 ? "likes" : "like"}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          <span style={{ color: "#262626" }}>
            {postCard.postedBy?.username}
          </span>{" "}
          {postCard.title}
        </Typography>
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
  );
}
