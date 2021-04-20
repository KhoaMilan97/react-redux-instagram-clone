import { actionTypes } from "../actions/actionType";

import { setMessage } from "./messageAction";
import { createNotify, getNotify, removeNotify } from "../../functions/notify";

export const createNotifyAction = ({ msg, auth, socket }) => async (
  dispatch
) => {
  try {
    const res = await createNotify(msg, auth.token);
    console.log(res);
  } catch (err) {
    dispatch(setMessage(err.response.data.msg, "error"));
  }
};

export const removeNotifyAction = ({ msg, auth, socket }) => async (
  dispatch
) => {
  try {
    const res = await removeNotify(msg, auth.token);
    console.log(res);
  } catch (err) {
    dispatch(setMessage(err.response.data.msg, "error"));
  }
};

export const getNotifyAction = (token) => async (dispatch) => {
  try {
    const res = await getNotify(token);
    dispatch({
      type: actionTypes.NOTIFY,
      payload: res.data.notifies,
    });
    console.log(res);
  } catch (err) {
    dispatch(setMessage(err.response.data.msg, "error"));
  }
};
