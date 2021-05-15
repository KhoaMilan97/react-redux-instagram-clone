import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { actionTypes } from "./redux/actions/actionType";

import audioBell from "./audio/unconvinced-569.mp3";

var notification;

const spawnNotification = (body, icon, url, title) => {
  let options = {
    body,
    icon,
  };

  notification = new Notification(title, options);

  notification.onclick = (e) => {
    e.preventDefault();
    window.open(url, "_blank");
  };
};

function SocketClient() {
  const { auth, socket, notify } = useSelector((state) => state);
  const dispatch = useDispatch();
  const audioRef = useRef();

  useEffect(() => {
    const closeEvent = () => {
      if (window.visibilityState === "visible") {
        console.log("heheh");
        // The tab has become visible so clear the now-stale Notification.
        notification.close();
      }
    };

    window.addEventListener("visibilitychange", closeEvent);
    return () => window.removeEventListener("visibilitychange", closeEvent);
  }, []);

  // Join User
  useEffect(() => {
    socket.emit("joinUser", auth?.user?._id);
  }, [socket, auth.user._id]);

  // Likes
  useEffect(() => {
    socket.on("likeToClient", (newPost) => {
      dispatch({
        type: actionTypes.UPDATE_POST,
        payload: newPost,
      });
    });
    return () => socket.off("likeToClient");
  }, [socket, dispatch]);

  useEffect(() => {
    socket.on("unLikeToClient", (newPost) => {
      dispatch({
        type: actionTypes.UPDATE_POST,
        payload: newPost,
      });
    });
    return () => socket.off("unLikeToClient");
  }, [socket, dispatch]);

  // Comments
  useEffect(() => {
    socket.on("createCommentToClient", (newPost) => {
      dispatch({
        type: actionTypes.UPDATE_POST,
        payload: newPost,
      });
    });
    return () => socket.off("createCommentToClient");
  }, [socket, dispatch]);

  useEffect(() => {
    socket.on("deleteCommentToClient", (newPost) => {
      dispatch({
        type: actionTypes.UPDATE_POST,
        payload: newPost,
      });
    });
    return () => socket.off("deleteCommentToClient");
  }, [socket, dispatch]);

  // Notify
  useEffect(() => {
    socket.on("createNotifyToClient", (msg) => {
      dispatch({ type: actionTypes.CREATE_NOTIFY, payload: msg });
      if (notify.sound) {
        console.log("Yes play");
        audioRef.current.play();
      }
      spawnNotification(
        msg.user.username + " " + msg.text,
        msg.user.avatar.url,
        msg.url,
        "Instagram"
      );
    });
    return () => socket.off("createNotifyToClient");
  }, [dispatch, socket, notify.sound]);

  useEffect(() => {
    socket.on("removeNotifyToClient", (msg) => {
      dispatch({ type: actionTypes.REMOVE_NOTIFY, payload: msg });
    });
    return () => socket.off("removeNotifyToClient");
  });

  return (
    <audio controls={true} ref={audioRef} style={{ display: "none" }}>
      <source src={audioBell} type="audio/mp3" />
    </audio>
  );
}

export default SocketClient;
