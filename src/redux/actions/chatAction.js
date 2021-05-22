import {
  getConservations,
  getMessages,
  createMessage,
  deleteMessages,
  deleteConservation,
} from "../../functions/message";
import { setMessage } from "./messageAction";

export const chatTypes = {
  ADD_USER: "ADD_USER",
  ADD_CHAT: "ADD_CHAT",
  GET_CONSERVATIONS: "GET_CONSERVATIONS",
  GET_MESSAGES: "GET_MESSAGES",
  CLEAR_MESSAGES: "CLEAR_MESSAGES",
  CHAT_LOADING: "CHAT_LOADING",
  UPDATE_MESSAGES: "UPDATE_MESSAGES",
  DELETE_MESSAGES: "DELETE_MESSAGES",
  DELETE_CONVERSATION: "DELETE_CONVERSATION",
  ONLINE: "ONLINE",
  OFFLINE: "OFFLINE",
  CHECK_ONLINE_OFFLINE: "CHECK_ONLINE_OFFLINE",
  UPDATE_CHAT: "UPDATE_CHAT",
};

export const addChatAction = (msg, auth, socket) => async (dispatch) => {
  dispatch({ type: chatTypes.ADD_CHAT, payload: msg });
  const { _id, username, fullname, avatar } = auth.user;
  try {
    const res = await createMessage(msg, auth.token);
    const { newMessage } = res.data;

    dispatch({
      type: chatTypes.UPDATE_CHAT,
      payload: newMessage,
    });

    socket.emit("addMessage", {
      ...msg,
      user: { _id, username, fullname, avatar },
    });
  } catch (err) {
    err.response?.data?.msg &&
      dispatch(setMessage(err.response?.data?.msg, "error"));
    console.log(err);
  }
};

export const getConservationAction = (auth) => async (dispatch) => {
  try {
    const res = await getConservations(auth.token);
    let newArr = [];
    res.data.conservations.forEach((conservation) => {
      conservation.recipients.forEach((item) => {
        if (item._id !== auth.user._id) {
          newArr.push({
            ...item,
            text: conservation.text,
            media: conservation.media,
          });
        }
      });
    });
    dispatch({
      type: chatTypes.GET_CONSERVATIONS,
      payload: { newArr, result: res.data.result },
    });
  } catch (err) {
    err.response.data.msg &&
      dispatch(setMessage(err.response.data.msg, "error"));
  }
};

export const getMessageAction =
  (id, auth, page = 1) =>
  async (dispatch) => {
    try {
      dispatch({
        type: chatTypes.CHAT_LOADING,
        payload: true,
      });
      const res = await getMessages(id, auth.token, page);

      const newData = { ...res.data, messages: res.data.messages.reverse() };

      dispatch({
        type: chatTypes.GET_MESSAGES,
        payload: { ...newData, _id: id, page },
      });

      dispatch({
        type: chatTypes.CHAT_LOADING,
        payload: false,
      });
    } catch (err) {
      // err.response.data.msg &&
      //   dispatch(setMessage(err.response.data.msg, "error"));
      console.log(err);
      dispatch({
        type: chatTypes.CHAT_LOADING,
        payload: false,
      });
    }
  };

export const loadMoreMessageAction = (id, auth, page) => async (dispatch) => {
  try {
    dispatch({
      type: chatTypes.CHAT_LOADING,
      payload: true,
    });
    const res = await getMessages(id, auth.token, page);

    const newData = { ...res.data, messages: res.data.messages.reverse() };

    dispatch({
      type: chatTypes.UPDATE_MESSAGES,
      payload: { ...newData, _id: id, page },
    });

    dispatch({
      type: chatTypes.CHAT_LOADING,
      payload: false,
    });
  } catch (err) {
    err.response.data.msg &&
      dispatch(setMessage(err.response.data.msg, "error"));
    dispatch({
      type: chatTypes.CHAT_LOADING,
      payload: false,
    });
  }
};

export const deleteMessageAction = (msg, data, auth) => async (dispatch) => {
  const newData = data.filter((item) => item._id !== msg._id);
  dispatch({
    type: chatTypes.DELETE_MESSAGES,
    payload: { newData, _id: msg.recipient },
  });

  try {
    await deleteMessages(msg._id, auth.token);
  } catch (err) {
    err.response.data.msg &&
      dispatch(setMessage(err.response.data.msg, "error"));
  }
};

export const deleteConversationAction = (auth, id) => async (dispatch) => {
  dispatch({
    type: chatTypes.DELETE_CONVERSATION,
    payload: id,
  });
  try {
    await deleteConservation(id, auth.token);
  } catch (err) {
    err.response.data.msg &&
      dispatch(setMessage(err.response.data.msg, "error"));
  }
};
