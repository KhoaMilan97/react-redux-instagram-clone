import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";

import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Dialog from "@material-ui/core/Dialog";
import { ListItemText, ListItemIcon, IconButton } from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import CallEndIcon from "@material-ui/icons/CallEnd";
import CallIcon from "@material-ui/icons/Call";
import VideoCallIcon from "@material-ui/icons/VideoCall";
import { actionTypes } from "../../redux/actions/actionType";

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
}));

export default function CallModal() {
  const [open, setOpen] = useState(false);
  const [times, setTimes] = useState(0);
  const [timeOn, setTimeOn] = useState(false);
  const [answer, setAnswer] = useState(false);

  const { call, auth, socket } = useSelector((state) => state);
  const dispatch = useDispatch();
  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("xs"));
  const yourVideo = useRef();
  const otherVideo = useRef();

  useEffect(() => {
    let interval = null;
    if (timeOn) {
      interval = setInterval(() => {
        setTimes((prevTime) => prevTime + 10);
      }, 10);
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
          dispatch({ type: actionTypes.CALL, payload: null });
          setTimes(0);
        }, 15000);
        return () => {
          clearTimeout(timer);
        };
      }
    }
  }, [dispatch, timeOn, answer]);

  useEffect(() => {
    if (call) {
      setOpen(true);
      setTimeOn(true);
    } else {
      setOpen(false);
      setTimeOn(false);
    }
  }, [call]);

  const handleClose = () => {
    dispatch({ type: actionTypes.CALL, payload: null });
    socket.emit("endCall", call);
    setTimes(0);
  };

  useEffect(() => {
    socket.on("endCallToClient", (data) => {
      dispatch({ type: actionTypes.CALL, payload: null });
    });
    return () => socket.off("endCallToClient");
  }, [socket, dispatch]);

  const handleAnswer = () => {
    setAnswer(true);
  };

  return (
    <Dialog
      //onClose={handleClose}
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
              ? ("0" + Math.floor((times / 3600000) % 60)).slice(-2) +
                ":" +
                ("0" + Math.floor((times / 60000) % 60)).slice(-2) +
                ":" +
                ("0" + Math.floor((times / 1000) % 60)).slice(-2)
              : call?.video
              ? "Calling video..."
              : "Calling audio"}
          </ListItemText>
        </ListItem>
        {!answer && (
          <ListItem>
            <ListItemText align="center">
              {("0" + Math.floor((times / 3600000) % 60)).slice(-2) +
                ":" +
                ("0" + Math.floor((times / 60000) % 60)).slice(-2) +
                ":" +
                ("0" + Math.floor((times / 1000) % 60)).slice(-2)}
            </ListItemText>
          </ListItem>
        )}

        {answer && (
          <ListItem>
            <video ref={yourVideo} />
            <video ref={otherVideo} />
            <ListItemText align="center">
              {("0" + Math.floor((times / 3600000) % 60)).slice(-2) +
                ":" +
                ("0" + Math.floor((times / 60000) % 60)).slice(-2) +
                ":" +
                ("0" + Math.floor((times / 1000) % 60)).slice(-2)}
            </ListItemText>
            <ListItemIcon>
              <IconButton
                onClick={() => handleClose()}
                className={classes.button}
              >
                <CallEndIcon color="error" />
              </IconButton>
            </ListItemIcon>
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
                  <IconButton onClick={handleAnswer} className={classes.button}>
                    <VideoCallIcon color="primary" />
                  </IconButton>
                ) : (
                  <IconButton onClick={handleAnswer} className={classes.button}>
                    <CallIcon color="primary" />
                  </IconButton>
                )}
              </>
            )}
          </ListItemIcon>
        </ListItem>
      </List>
    </Dialog>
  );
}
