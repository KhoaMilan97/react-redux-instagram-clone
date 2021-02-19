import React from "react";

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
import { Button } from "@material-ui/core";

import SimpleSlider from "./SimpleSlider";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
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
  },
  icon: {
    padding: "5px",
    "&:hover": {
      backgroundColor: "transparent",
    },
  },
}));

export default function HomeCard() {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={
          <Avatar aria-label="recipe" className={classes.avatar}>
            R
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreHorizIcon />
          </IconButton>
        }
        title="yua_mikami"
      />

      <SimpleSlider />

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
      <CardContent style={{ paddingTop: 0 }}>
        <Typography>0 likes</Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          duongmydien Bạn follow tôi bao lâu rồi?
        </Typography>

        <FormControl fullWidth style={{ marginTop: "10px" }}>
          <Divider />
          <Input
            id="standard-adornment-password"
            type="text"
            style={{ marginTop: 5 }}
            disableUnderline
            placeholder="Add a comment..."
            endAdornment={
              <InputAdornment position="end">
                <Button className={classes.send}>Post</Button>
              </InputAdornment>
            }
          />
        </FormControl>
      </CardContent>
    </Card>
  );
}
