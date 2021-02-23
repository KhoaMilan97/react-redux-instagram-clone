import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import CircularProgress from "@material-ui/core/CircularProgress";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import CancelIcon from "@material-ui/icons/Cancel";

import FileUpload from "./FileUpload";
import { removeImages } from "../../functions/upload";
import { createPost } from "../../functions/post";
import { setMessage } from "../../redux/actions/messageAction";
import Message from "../../utils/Message";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
    width: "100%",
    marginBottom: "24px",
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },
  preview: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    width: 500,
    height: "auto",
  },
  icon: {
    color: "rgba(255, 255, 255, 0.54)",
  },
  titleBar: {
    background: "transparent",
  },
}));

export default function CreatePostForm() {
  const classes = useStyles();
  const auth = useSelector((state) => state.auth);
  const [title, setTitle] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleRemoveImage = (id) => {
    removeImages({ public_id: id }, auth.token)
      .then((res) => {
        if (res.data === "ok") {
          let filteredImage = images.filter((item) => {
            return item.public_id !== id;
          });
          setImages(filteredImage);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleCreatePost = () => {
    let postedBy = auth.user._id;
    createPost({ title, images, postedBy }, auth.token)
      .then((res) => {
        console.log(res);
        dispatch(setMessage("New Post is created.", "success"));
        setTitle("");
        setImages([]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <Message />
      <Paper variant="outlined" component="form" className={classes.root}>
        <IconButton className={classes.iconButton} aria-label="menu">
          <Avatar src={auth.user.avatar?.url} />
        </IconButton>
        <InputBase
          className={classes.input}
          placeholder="What's on your mind?"
          inputProps={{ "aria-label": "What's on your mind?" }}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Tooltip title="Photos">
          <IconButton
            style={{ padding: 0 }}
            className={classes.iconButton}
            aria-label="search"
            disableRipple
            disableFocusRipple
          >
            <FileUpload
              setLoading={setLoading}
              setImages={setImages}
              images={images}
            />
          </IconButton>
        </Tooltip>

        <Divider className={classes.divider} orientation="vertical" />
        <IconButton
          color="primary"
          className={classes.iconButton}
          aria-label="directions"
          onClick={handleCreatePost}
        >
          {loading ? (
            <CircularProgress size={20} />
          ) : (
            <Typography>Post</Typography>
          )}
        </IconButton>
      </Paper>

      {images.length > 0 && (
        <div className={classes.preview}>
          <GridList cellHeight={180} className={classes.gridList} cols={3}>
            {images.map((image) => (
              <GridListTile key={image.public_id} cols={1}>
                <img src={image.url} alt="Preview" />
                <GridListTileBar
                  className={classes.titleBar}
                  titlePosition="top"
                  actionIcon={
                    <IconButton
                      onClick={() => handleRemoveImage(image.public_id)}
                      className={classes.icon}
                    >
                      <CancelIcon />
                    </IconButton>
                  }
                  actionPosition="right"
                />
              </GridListTile>
            ))}
          </GridList>
        </div>
      )}
    </>
  );
}
