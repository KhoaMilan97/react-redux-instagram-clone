import { actionTypes } from "../actions/actionType";

const postDetailReducer = (state = [], action) => {
  switch (action.type) {
    case actionTypes.GET_POST:
      return [...state, action.payload];
    case actionTypes.UPDATE_POST:
      const index = state.findIndex((post) => post._id === action.payload._id);
      let postsUpdate = [...state];

      if (index >= 0) {
        postsUpdate[index] = action.payload;
      }

      return postsUpdate;

    default:
      return state;
  }
};

export default postDetailReducer;
