import { actionTypes } from "../actions/actionType";

const initialState = [];

const socketReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SOCKET:
      return action.payload;

    default:
      return state;
  }
};

export default socketReducer;
