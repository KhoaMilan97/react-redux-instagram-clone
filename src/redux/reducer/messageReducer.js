import { actionTypes } from "../actions/actionType";

const initialState = {
  open: false,
  vertical: "top",
  horizontal: "right",
  msg: "",
  type: "error",
};

const messageReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_MESSAGE:
      return {
        ...state,
        msg: action.payload.message,
        type: action.payload.type,
        open: true,
      };
    case actionTypes.CLEAR_MESSAGE:
      return {
        ...state,
        // msg: "",
        // type: "error",
        open: false,
      };
    default:
      return state;
  }
};

export default messageReducer;
