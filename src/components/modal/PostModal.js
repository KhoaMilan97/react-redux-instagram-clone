import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import Tooltip from "@material-ui/core/Tooltip";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import CancelIcon from "@material-ui/icons/Cancel";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import { CircularProgress, IconButton, Divider } from "@material-ui/core";

import FileUpload from "../form/FileUpload";

import { removeImages } from "../../functions/upload";
import { createPost } from "../../functions/post";
import { setMessage } from "../../redux/actions/messageAction";

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const useStyles = makeStyles((theme) => ({
  media: {
    display: "flex",
    justifyContent: "flex-end",
    width: "100%",
    marginTop: "15px",
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

export default function PostModal({ open, setOpen }) {
  const [images, setImages] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const auth = useSelector((state) => state.auth);
  const classes = useStyles();
  const dispatch = useDispatch();

  const handleRemoveImage = (id) => {
    setLoading(true);
    removeImages({ public_id: id }, auth.token)
      .then((res) => {
        if (res.data === "ok") {
          let filteredImage = images.filter((item) => {
            return item.public_id !== id;
          });
          setImages(filteredImage);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
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
        setOpen(false);
      })
      .catch((err) => {
        console.log(err);
        setOpen(false);
      });
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle align="center" onClose={handleClose}>
          Create Post
        </DialogTitle>
        <Divider variant="middle" />
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            multiline
            rows={4}
            label="What's on your mind"
            type="text"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

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

          <div className={classes.media}>
            <Tooltip title="Photos">
              <IconButton
                style={{ padding: 0 }}
                className={classes.iconButton}
                aria-label="search"
                disableRipple
                disableFocusRipple
              >
                <FileUpload
                  images={images}
                  setImages={setImages}
                  setLoading={setLoading}
                />
              </IconButton>
            </Tooltip>
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            disabled={!title}
            fullWidth
            onClick={handleCreatePost}
            color="primary"
            variant="contained"
          >
            {loading ? (
              <CircularProgress size={20} style={{ color: "white" }} />
            ) : (
              "Post"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
