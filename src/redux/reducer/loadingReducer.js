import { actionTypes } from "../actions/actionType";

const initialState = false;

const loadingReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.LOADING:
      return action.payload;

    default:
      return state;
  }
};

export default loadingReducer;
