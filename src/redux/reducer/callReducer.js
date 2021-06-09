import { actionTypes } from "../actions/actionType";

const callReducer = (state = null, action) => {
  switch (action.type) {
    case actionTypes.CALL:
      return action.payload;

    default:
      return state;
  }
};

export default callReducer;
