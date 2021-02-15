import { actionTypes } from "../actions/actionType";
import {
  login,
  register,
  forgotPassword,
  resetPassword,
} from "../../functions/auth";
import { setMessage } from "./messageAction";
import history from "../../utils/history";

export const loginSuccess = (user) => ({
  type: actionTypes.LOGIN_SUCCESS,
  payload: user,
});

export const loginFail = () => ({
  type: actionTypes.LOGIN_FAIL,
});

export const registerSuccess = (user) => ({
  type: actionTypes.REGISTER_SUCCESS,
  payload: user,
});

export const registerFail = () => ({
  type: actionTypes.REGISTER_FAIL,
});

export const logOutUser = () => ({
  type: actionTypes.LOGOUT,
});

export const checkCurrentUser = (user) => ({
  type: actionTypes.CHECK_CURRENT_USER,
  payload: user,
});

export const loginUserAction = (data) => async (dispatch) => {
  dispatch({
    type: actionTypes.LOADING,
    payload: true,
  });
  try {
    const res = await login(data);
    localStorage.setItem("firstLogin", true);

    dispatch(loginSuccess(res.data));
    dispatch({
      type: actionTypes.LOADING,
      payload: false,
    });
    history.push("/");
  } catch (err) {
    dispatch(loginFail());
    dispatch({
      type: actionTypes.LOADING,
      payload: false,
    });
    err.response.data.msg &&
      dispatch(setMessage(err.response.data.msg, "error"));
  }
};

export const registerAction = (data) => async (dispatch) => {
  dispatch({
    type: actionTypes.LOADING,
    payload: true,
  });
  try {
    const res = await register(data);
    localStorage.setItem("firstLogin", true);

    dispatch(registerSuccess(res.data));
    dispatch({
      type: actionTypes.LOADING,
      payload: false,
    });
    history.push("/");
  } catch (err) {
    dispatch(registerFail());
    dispatch({
      type: actionTypes.LOADING,
      payload: false,
    });
    err.response.data.msg &&
      dispatch(setMessage(err.response.data.msg, "error"));
  }
};

export const forgotPasswordAction = (data) => async (dispatch) => {
  dispatch({
    type: actionTypes.LOADING,
    payload: true,
  });
  try {
    const res = await forgotPassword(data.email);
    dispatch({
      type: actionTypes.LOADING,
      payload: false,
    });
    dispatch(setMessage(res.data.msg, "success"));
  } catch (err) {
    dispatch({
      type: actionTypes.LOADING,
      payload: false,
    });
    err.response.data.msg &&
      dispatch(setMessage(err.response.data.msg, "error"));
  }
};

export const resetPasswordAction = (data, token) => async (dispatch) => {
  dispatch({
    type: actionTypes.LOADING,
    payload: true,
  });
  try {
    const res = await resetPassword(data, token);
    dispatch({
      type: actionTypes.LOADING,
      payload: false,
    });
    dispatch(setMessage(res.data.msg, "success"));
    history.push("/signin");
  } catch (err) {
    dispatch({
      type: actionTypes.LOADING,
      payload: false,
    });
    err.response.data.msg &&
      dispatch(setMessage(err.response.data.msg, "error"));
  }
};
