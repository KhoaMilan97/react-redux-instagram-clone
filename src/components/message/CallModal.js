import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";

import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Dialog from "@material-ui/core/Dialog";
import {
  ListItemText,
  ListItemIcon,
  IconButton,
  DialogContent,
  Typography,
} from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import CallEndIcon from "@material-ui/icons/CallEnd";
import CallIcon from "@material-ui/icons/Call";
import VideoCallIcon from "@material-ui/icons/VideoCall";
import { actionTypes } from "../../redux/actions/actionType";
import DialogActions from "@material-ui/core/DialogActions";

import { setMessage } from "../../redux/actions/messageAction";
import { addChatAction } from "../../redux/actions/chatAction";
import MessengerSound from "../../audio/Facebook_messenger_ringtone.mp3";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "#393e46",
    color: "white",
    padding: "25px 0",
  },
  avatar: {
    width: "90px !important",
    height: "90px !important",
  },
  unFollow: {
    color: "#ed4956",
    fontWeight: 600,
    "& span": {
      fontWeight: 600,
      fontSize: 14,
    },
  },
  listItem: {
    justifyContent: "center",
  },
  button: {
    borderRadius: "50%",
    backgroundColor: "white",
    "&:hover": {
      backgroundColor: "white",
    },
  },
  videoContainer: {
    position: "relative",
  },
  otherVideo: {
    width: "100%",
    height: "500px",
  },
  yourVideo: {
    width: 300,
    position: "absolute",
    top: 0,
    right: 0,
  },
}));

export default function CallModal() {
  const [open, setOpen] = useState(false);
  const [openVideo, setOpenVideo] = useState(false);
  const [times, setTimes] = useState(0);
  const [timeOn, setTimeOn] = useState(false);
  const [answer, setAnswer] = useState(false);
  const [tracks, setTracks] = useState(null);
  const [newCall, setNewCall] = useState(null);

  const { call, auth, socket, peer } = useSelector((state) => state);
  const dispatch = useDispatch();
  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("xs"));
  const yourVideo = useRef();
  const otherVideo = useRef();
  const audio = useRef(new Audio(MessengerSound));

  const addCallMessage = useCallback(
    (call, times, disconnect) => {
      if (call.recipient !== auth.user._id || disconnect) {
        const msg = {
          sender: call.sender,
          recipient: call.recipient,
          text: "",
          media: [],
          call: { video: call.video, times },
          createdAt: new Date().toISOString(),
        };

        dispatch(addChatAction(msg, auth, socket));
      }
    },
    [auth, dispatch, socket]
  );

  useEffect(() => {
    let interval = null;
    if (timeOn) {
      interval = setInterval(() => {
        setTimes((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [timeOn]);

  useEffect(() => {
    if (timeOn) {
      if (answer) {
        setTimes(0);
      } else {
        const timer = setTimeout(() => {
          socket.emit("endCall", { ...call, times: 0 });
          addCallMessage(call, 0);
          dispatch({ type: actionTypes.CALL, payload: null });
          setTimes(0);
        }, 15000);
        return () => {
          clearTimeout(timer);
        };
      }
    }
  }, [dispatch, timeOn, answer, call, socket, addCallMessage]);

  useEffect(() => {
    if (call) {
      setOpen(true);
      setTimeOn(true);
      setTimes(0);
    } else {
      setOpen(false);
      setTimeOn(false);
      setTimes(0);
    }
  }, [call]);

  const handleClose = () => {
    tracks && tracks.forEach((track) => track.stop());
    if (newCall) newCall.close();
    if (answer) {
      socket.emit("endCall", { ...call, times });
    } else {
      socket.emit("endCall", { ...call, times: 0 });
    }
    answer ? addCallMessage(call, times) : addCallMessage(call, 0);
    dispatch({ type: actionTypes.CALL, payload: null });
    setTimes(0);
    call.video && setOpenVideo(false);
    setAnswer(false);
  };

  useEffect(() => {
    socket.on("endCallToClient", (data) => {
      tracks && tracks.forEach((track) => track.stop());
      if (newCall) newCall.close();
      addCallMessage(data, data.times);
      dispatch({ type: actionTypes.CALL, payload: null });
    });
    return () => socket.off("endCallToClient");
  }, [socket, dispatch, tracks, addCallMessage, newCall]);

  // Stream Media
  const openStream = (video) => {
    const config = { audio: true, video };
    return navigator.mediaDevices.getUserMedia(config);
  };

  const playStream = (tag, stream) => {
    let video = tag;
    video.srcObject = stream;
    video.play();
  };

  const handleAnswer = () => {
    openStream(call.video).then((stream) => {
      playStream(yourVideo.current, stream);
      const track = stream.getTracks();
      setTracks(track);

      const newCall = peer.call(call.peerId, stream);

      newCall.on("stream", function (remoteStream) {
        // Show stream in some video/canvas element.
        playStream(otherVideo.current, remoteStream);
      });

      setAnswer(true);
      setNewCall(newCall);
    });
  };

  useEffect(() => {
    peer.on("call", (newCall) => {
      setAnswer(true);
      openStream(call?.video).then((stream) => {
        if (yourVideo.current) {
          playStream(yourVideo.current, stream);
        }
        const track = stream.getTracks();
        setTracks(track);

        newCall.answer(stream);
        newCall.on("stream", function (remoteStream) {
          if (otherVideo.current) {
            playStream(otherVideo.current, remoteStream);
          }
        });

        setNewCall(newCall);
      });
    });
    return () => peer.removeListener("call");
  }, [peer, call?.video]);

  useEffect(() => {
    if (answer && call?.video) {
      setOpenVideo(true);
      setOpen(false);
    } else {
      setOpenVideo(false);
    }
  }, [answer, call?.video]);

  // Disconnect
  useEffect(() => {
    socket.on("callerDisconnect", () => {
      tracks && tracks.forEach((track) => track.stop());
      if (newCall) newCall.close();
      let totalTimes = answer ? times : 0;
      addCallMessage(call, totalTimes, true);

      dispatch({ type: actionTypes.CALL, payload: null });
      setTimes(0);
      call?.video && setOpenVideo(false);
      setAnswer(false);
      dispatch(setMessage(`The ${call.username} disconnect`, "error"));
    });
    return () => socket.off("callerDisconnect");
  }, [socket, call, dispatch, tracks, addCallMessage, answer, times, newCall]);

  useEffect(() => {
    if (answer || call === null) {
      audio.current.pause();
      audio.current.currentTime = 0;
    } else if (call && !answer) {
      audio.current.play();
      audio.current.loop = true;
    }
    // return () => {
    //   audio.current.pause();
    //   audio.current.currentTime = 0;
    // };
  }, [answer, call]);

  const renderTimes = (times) =>
    ("0" + Math.floor((times / 3600) % 60)).slice(-2) +
    ":" +
    ("0" + Math.floor((times / 60) % 60)).slice(-2) +
    ":" +
    ("0" + Math.floor(times % 60)).slice(-2);

  const videoModal = (openVideo) => {
    return (
      <Dialog open={openVideo} fullWidth={true} keepMounted maxWidth="md">
        <DialogContent style={{ backgroundColor: "#393e46" }}>
          <div className={classes.videoContainer}>
            <video
              ref={yourVideo}
              muted
              className={classes.yourVideo}
              playsInline
            />
            <video
              ref={otherVideo}
              muted
              className={classes.otherVideo}
              playsInline
            />
          </div>
        </DialogContent>
        <DialogActions
          style={{
            justifyContent: "center",
            flexDirection: "column",
            backgroundColor: "#393e46",
          }}
        >
          <Typography variant="body1" component="p" style={{ color: "white" }}>
            {renderTimes(times)}
          </Typography>
          <IconButton onClick={() => handleClose()} className={classes.button}>
            <CallEndIcon color="error" />
          </IconButton>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <>
      {videoModal(openVideo)}
      <Dialog
        aria-labelledby="simple-dialog-title"
        open={open}
        fullWidth={true}
        maxWidth="xs"
        fullScreen={fullScreen}
      >
        <List className={classes.root}>
          <ListItem style={{ justifyContent: "center" }}>
            <Avatar
              className={classes.avatar}
              src={call?.avatar?.url}
              alt="avatar"
            />
          </ListItem>
          <ListItem>
            <ListItemText align="center"> {call?.fullname}</ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText align="center">
              {answer
                ? renderTimes(times)
                : call?.video
                ? "Calling video..."
                : "Calling audio"}
            </ListItemText>
          </ListItem>
          {!answer && (
            <ListItem>
              <ListItemText align="center">{renderTimes(times)}</ListItemText>
            </ListItem>
          )}

          <ListItem className={classes.listItem}>
            <ListItemIcon>
              <IconButton
                onClick={() => handleClose()}
                className={classes.button}
              >
                <CallEndIcon color="error" />
              </IconButton>
              {call?.recipient === auth.user._id && !answer && (
                <>
                  <div style={{ width: "40px" }}></div>
                  {call?.video ? (
                    <IconButton
                      onClick={handleAnswer}
                      className={classes.button}
                    >
                      <VideoCallIcon color="primary" />
                    </IconButton>
                  ) : (
                    <IconButton
                      onClick={handleAnswer}
                      className={classes.button}
                    >
                      <CallIcon color="primary" />
                    </IconButton>
                  )}
                </>
              )}
            </ListItemIcon>
          </ListItem>
        </List>
      </Dialog>
    </>
  );
}
