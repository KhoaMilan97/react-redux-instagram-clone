import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { actionTypes } from "./redux/actions/actionType";
import { chatTypes } from "./redux/actions/chatAction";

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
  const { auth, socket, notify, online } = useSelector((state) => state);
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
    socket.emit("joinUser", auth.user);
  }, [socket, auth.user]);

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
  }, [dispatch, socket]);

  // Message/Chat
  useEffect(() => {
    socket.on("addMessageToClient", (msg) => {
      dispatch({ type: chatTypes.ADD_CHAT, payload: msg });

      dispatch({
        type: chatTypes.ADD_USER,
        payload: { ...msg.user, text: msg.text, media: msg.media },
      });
    });
    return () => socket.off("addMessageToClient");
  }, [dispatch, socket]);

  // check User Online
  useEffect(() => {
    socket.emit("checkUserOnline", auth.user);
  }, [socket, auth.user]);

  useEffect(() => {
    socket.on("checkUserOnlineToMe", (data) => {
      data.forEach((item) => {
        if (!online.includes(item.id)) {
          dispatch({
            type: chatTypes.ONLINE,
            payload: item.id,
          });
        }
      });
    });
    return () => socket.off("checkUserOnlineToMe");
  }, [dispatch, socket, online]);

  useEffect(() => {
    socket.on("checkUserOnlineToClient", (id) => {
      if (!online.includes(id)) {
        dispatch({
          type: chatTypes.ONLINE,
          payload: id,
        });
      }
    });
    return () => socket.off("checkUserOnlineToClient");
  }, [dispatch, socket, online]);

  // Check user offline

  useEffect(() => {
    socket.on("checkUserOffline", (id) => {
      dispatch({
        type: chatTypes.OFFLINE,
        payload: id,
      });
    });
    return () => socket.off("checkUserOffline");
  }, [dispatch, socket, online]);

  return (
    <audio controls={true} ref={audioRef} style={{ display: "none" }}>
      <source src={audioBell} type="audio/mp3" />
    </audio>
  );
}

export default SocketClient;
