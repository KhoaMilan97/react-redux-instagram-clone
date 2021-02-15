import { actionTypes } from "../actions/actionType";

export const setMessage = (message, type) => ({
  type: actionTypes.SET_MESSAGE,
  payload: { message, type },
});

export const clearMessage = () => ({
  type: actionTypes.CLEAR_MESSAGE,
});
