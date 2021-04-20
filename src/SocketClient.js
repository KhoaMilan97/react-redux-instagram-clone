import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

function SocketClient() {
  const { auth, socket } = useSelector((state) => state);
  const dispatch = useDispatch();

  // Join User
  useEffect(() => {
    socket.emit("joinUser", auth?.user?._id);
  }, [socket, auth.user._id]);

  return <div></div>;
}

export default SocketClient;
