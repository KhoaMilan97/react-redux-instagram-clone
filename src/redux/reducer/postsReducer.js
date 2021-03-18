import { actionTypes } from "../actions/actionType";

const initialState = {
  posts: [],
  post: "",
  loading: false,
  error: "",
};

const postsReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.UPDATE_POST:
      return {
        ...state,
        post: action.payload,
      };

    default:
      return state;
  }
};

export default postsReducer;
