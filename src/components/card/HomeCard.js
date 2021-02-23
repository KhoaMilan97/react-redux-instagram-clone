import React from "react";
import moment from "moment";

import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";

import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import { red } from "@material-ui/core/colors";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import BookmarkBorderOutlinedIcon from "@material-ui/icons/BookmarkBorderOutlined";
import FavoriteBorderOutlinedIcon from "@material-ui/icons/FavoriteBorderOutlined";
import ModeCommentOutlinedIcon from "@material-ui/icons/ModeCommentOutlined";
import SendIcon from "@material-ui/icons/Send";
import FormControl from "@material-ui/core/FormControl";
import InputAdornment from "@material-ui/core/InputAdornment";
import Input from "@material-ui/core/Input";
import Divider from "@material-ui/core/Divider";
import { Button, CardMedia } from "@material-ui/core";

import SimpleSlider from "./SimpleSlider";

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
  expand: {
    marginLeft: "auto",
    padding: "5px",
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
  icon: {
    padding: "5px",
    "&:hover": {
      backgroundColor: "transparent",
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

  return (
    <Card variant="outlined" className={classes.root}>
      <CardHeader
        avatar={
          <Avatar
            aria-label="recipe"
            className={classes.avatar}
            src={post.postedBy?.avatar.url}
          />
        }
        action={
          <IconButton aria-label="settings">
            <MoreHorizIcon />
          </IconButton>
        }
        title={post.postedBy?.username}
      />
      {post.images.length > 1 ? (
        <SimpleSlider images={post.images} />
      ) : (
        <CardMedia
          image={post.images[0]?.url}
          title="slide"
          className={classes.media}
        />
      )}
      {/* <SimpleSlider /> */}

      <CardActions disableSpacing>
        <IconButton className={classes.icon} aria-label="add to favorites">
          <FavoriteBorderOutlinedIcon />
        </IconButton>
        <IconButton className={classes.icon} aria-label="comment">
          <ModeCommentOutlinedIcon />
        </IconButton>
        <IconButton className={classes.icon} aria-label="share">
          <SendIcon />
        </IconButton>
        <IconButton className={classes.expand} aria-label="show more">
          <BookmarkBorderOutlinedIcon />
        </IconButton>
      </CardActions>
      <CardContent className={classes.cardContent} style={{ paddingTop: 0 }}>
        <Typography>0 likes</Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          <span style={{ color: "#262626" }}>{post.postedBy?.username}</span>{" "}
          {post.title}
        </Typography>
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
