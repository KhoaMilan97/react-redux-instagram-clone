import { actionTypes } from "../actions/actionType";

import { setMessage } from "./messageAction";
import {
  createNotify,
  deleteAllNotify,
  getNotify,
  isReadNotify,
  removeNotify,
} from "../../functions/notify";

export const createNotifyAction = ({ msg, auth, socket }) => async (
  dispatch
) => {
  try {
    const res = await createNotify(msg, auth.token);
    socket.emit("createNotify", {
      ...res.data.notify,
      user: {
        username: auth.user.username,
        avatar: auth.user.avatar,
      },
    });
  } catch (err) {
    dispatch(setMessage(err.response.data.msg, "error"));
  }
};

export const removeNotifyAction = ({ msg, auth, socket }) => async (
  dispatch
) => {
  try {
    await removeNotify(msg, auth.token);

    socket.emit("removeNotify", msg);
  } catch (err) {
    dispatch(setMessage(err.response.data.msg, "error"));
  }
};

export const getNotifyAction = (token) => async (dispatch) => {
  try {
    const res = await getNotify(token);
    dispatch({
      type: actionTypes.GET_NOTIFIES,
      payload: res.data.notifies,
    });
  } catch (err) {
    dispatch(setMessage(err.response.data.msg, "error"));
  }
};

export const isReadNotifyAction = (msg, token) => async (dispatch) => {
  dispatch({
    type: actionTypes.UPDATE_NOTIFY,
    payload: { ...msg, isRead: true },
  });
  try {
    await isReadNotify(msg._id, token);
  } catch (err) {
    dispatch(setMessage(err.response.data.msg, "error"));
  }
};

export const deleteAllNotifiesAction = (token) => async (dispatch) => {
  dispatch({ type: actionTypes.DELETE_ALL_NOTIFIES });
  try {
    await deleteAllNotify(token);
    dispatch(setMessage("All Notifications deleted!", "success"));
  } catch (err) {
    dispatch(setMessage(err.response.data.msg, "error"));
  }
};
