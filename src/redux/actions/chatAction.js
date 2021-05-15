import { getConservations, getMessages } from "../../functions/message";
import { createMessage } from "../../functions/message";
import { setMessage } from "./messageAction";

export const chatTypes = {
  ADD_USER: "ADD_USER",
  ADD_CHAT: "ADD_CHAT",
  GET_CONSERVATIONS: "GET_CONSERVATIONS",
  GET_MESSAGES: "GET_MESSAGES",
};

export const addUserAction = (user, chat) => (dispatch) => {
  if (chat.users.every((item) => item._id !== user._id)) {
    dispatch({
      type: chatTypes.ADD_USER,
      payload: { ...user, text: "", media: [] },
    });
  }
};

export const addChatAction = (msg, auth, socket) => async (dispatch) => {
  dispatch({ type: chatTypes.ADD_CHAT, payload: msg });
  try {
    await createMessage(msg, auth.token);
  } catch (err) {
    err.response.data.msg &&
      dispatch(setMessage(err.response.data.msg, "error"));
  }
};

export const getConservationAction = (auth) => async (dispatch) => {
  try {
    const res = await getConservations(auth.token);
    const newArr = [];
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

export const getMessageAction = (id, auth) => async (dispatch) => {
  try {
    const res = await getMessages(id, auth.token);

    dispatch({ type: chatTypes.GET_MESSAGES, payload: res.data });
  } catch (err) {
    err.response.data.msg &&
      dispatch(setMessage(err.response.data.msg, "error"));
  }
};
