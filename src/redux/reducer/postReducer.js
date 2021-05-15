import _ from "lodash";

import { actionTypes } from "../actions/actionType";

const initialState = {
  posts: [],
  loading: false,
  open: false,
  result: 0,
  hasMore: false,
};

const postReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.POST_MODAL:
      return {
        ...state,
        open: action.payload,
      };

    case actionTypes.CREATE_POST:
      return {
        ...state,
        posts: [action.payload, ...state.posts],
      };

    case actionTypes.POST_LOADING:
      return {
        ...state,
        loading: action.payload,
      };

    case actionTypes.UPDATE_POST:
      const index = state.posts.findIndex(
        (post) => post._id === action.payload._id
      );
      let postsUpdate = [...state.posts];

      if (index >= 0) {
        postsUpdate[index] = action.payload;
      }

      return {
        ...state,
        posts: postsUpdate,
      };

    case actionTypes.DELETE_POST:
      const posts = [...state.posts];
      let newPost;
      newPost = posts.filter((post) => post._id !== action.payload._id);
      return {
        ...state,
        posts: newPost,
      };

    case actionTypes.GET_HOME_POST:
      let newArr = [...state.posts, ...action.payload.posts];
      newArr = _.uniqBy(newArr, "_id");
      return {
        ...state,
        posts: newArr,
        result: action.payload.result,
        hasMore: action.payload.hasMore,
      };

    default:
      return state;
  }
};

export default postReducer;
