import React, { useState, useRef, useEffect } from "react";
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
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import PhotoCameraIcon from "@material-ui/icons/PhotoCamera";
import CameraEnhanceIcon from "@material-ui/icons/CameraEnhance";

import FileUpload from "../form/FileUpload";
//import { removeImages } from "../../functions/upload";
import Icon from "../Icon";

import {
  createPostAction,
  updatePostAction,
} from "../../redux/actions/postAction";
import { actionTypes } from "../../redux/actions/actionType";

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

export default function PostModal({ open }) {
  const [images, setImages] = useState([]);
  const [title, setTitle] = useState("");
  const [stream, setStream] = useState(false);
  const videoRef = useRef();
  const refCanvas = useRef();
  const [tracks, setTracks] = useState("");

  const { auth, socket, postReducer } = useSelector((state) => state);
  const classes = useStyles();
  const dispatch = useDispatch();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("xs"));

  const handleRemoveImage = (index) => {
    const newArr = [...images];
    newArr.splice(index, 1);
    setImages(newArr);
  };

  const handleCreatePost = async () => {
    let postedBy = auth.user._id;

    if (postReducer.open.onEdit) {
      await dispatch(
        updatePostAction(
          { title, images, postedBy, open: postReducer.open },
          auth
        )
      );
    } else {
      await dispatch(
        createPostAction({ title, images, postedBy }, auth, socket)
      );
    }

    setTitle("");
    setImages([]);
    if (tracks) tracks.stop();
  };

  useEffect(() => {
    if (postReducer.open.onEdit) {
      setTitle(postReducer.open.title);
      setImages(postReducer.open.images);
    }
  }, [postReducer.open]);

  const handleClose = () => {
    dispatch({
      type: actionTypes.POST_MODAL,
      payload: false,
    });
  };

  const handleStream = () => {
    setStream(true);
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((mediaStream) => {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play();
          const track = mediaStream.getTracks();
          setTracks(track[0]);
        })
        .catch((err) => console.log(err));
    }
  };

  const handleCapture = () => {
    const width = videoRef.current.clientWidth;
    const height = videoRef.current.clientHeight;

    refCanvas.current.setAttribute("width", width);
    refCanvas.current.setAttribute("height", height);
    const ctx = refCanvas.current.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0, width, height);
    let URL = refCanvas.current.toDataURL();
    setImages([...images, { camera: URL }]);
  };

  const handleEndStream = () => {
    tracks.stop();
    setStream(false);
  };

  return (
    <div>
      <Dialog
        open={open.onEdit ? open.onEdit : open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        fullWidth
        maxWidth="xs"
        fullScreen={fullScreen}
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
                {images.map((image, index) => (
                  <GridListTile key={index} cols={1}>
                    <img
                      src={
                        image.camera
                          ? image.camera
                          : image.url
                          ? image.url
                          : URL.createObjectURL(image)
                      }
                      alt="Preview"
                    />
                    <GridListTileBar
                      className={classes.titleBar}
                      titlePosition="top"
                      actionIcon={
                        <IconButton
                          onClick={() => handleRemoveImage(index)}
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

          {stream && (
            <div className={classes.stream}>
              <span
                style={{
                  cursor: "pointer",
                  display: "block",
                  textAlign: "right",
                  fontSize: 25,
                  fontWeight: 600,
                  color: "#f44336",
                }}
                onClick={handleEndStream}
              >
                &times;
              </span>
              <video autoPlay muted ref={videoRef} width="100%" height="100%" />

              <canvas ref={refCanvas} style={{ display: "none" }} />
            </div>
          )}

          <div className={classes.media}>
            {stream ? (
              <Tooltip title="Capture">
                <IconButton
                  style={{ padding: "0px 10px 2px 0px" }}
                  className={classes.iconButton}
                  disableRipple
                  disableFocusRipple
                  onClick={handleCapture}
                >
                  <CameraEnhanceIcon />
                </IconButton>
              </Tooltip>
            ) : (
              <Tooltip title="Camera">
                <IconButton
                  style={{ padding: "0px 10px 2px 0px" }}
                  className={classes.iconButton}
                  disableRipple
                  disableFocusRipple
                  onClick={handleStream}
                >
                  <PhotoCameraIcon />
                </IconButton>
              </Tooltip>
            )}

            <Icon title={title} setTitle={setTitle} />

            <Tooltip title="Photos">
              <IconButton
                style={{ padding: 0 }}
                className={classes.iconButton}
                aria-label="search"
                disableRipple
                disableFocusRipple
              >
                <FileUpload images={images} setImages={setImages} />
              </IconButton>
            </Tooltip>
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            disabled={!title || !images.length}
            fullWidth
            onClick={handleCreatePost}
            color="primary"
            variant="contained"
          >
            {postReducer.loading ? (
              <CircularProgress size={23} style={{ color: "white" }} />
            ) : (
              "Save"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
