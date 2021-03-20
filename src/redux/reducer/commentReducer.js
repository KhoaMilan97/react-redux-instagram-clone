import { actionTypes } from "../actions/actionType";

const initialState = {
  comments: [],
  status: "idle",
  totalComments: 0,
  limit: 0,
};

//  | 'loading' | 'succeeded' | 'failed'

const commentReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_COMMENTS:
      return {
        ...state,
        status: "loading",
      };
    case actionTypes.GET_COMMENTS_FAILED:
      return {
        ...state,
        status: "failed",
      };
    case actionTypes.GET_COMMENTS_SUCCEEDED:
      return {
        ...state,
        status: "succeeded",
        comments: [...state.comments, ...action.payload],
      };
    case actionTypes.GET_TOTAL_COMMENTS:
      return {
        ...state,
        totalComments: action.payload,
      };
    case actionTypes.CREATE_COMMENTS:
      return {
        ...state,
        comments: [action.payload, ...state.comments],
        totalComments: state.totalComments + 1,
        limit: state.limit + 1,
      };
    case actionTypes.DELETE_COMMENT:
      const id = action.payload;
      const existingComment = state.comments.find((cmt) => cmt._id === id);
      let newComments = [...state.comments];
      if (existingComment) {
        newComments = newComments.filter((cmt) => cmt._id !== id);
      }

      return {
        ...state,
        comments: newComments,
        totalComments: state.totalComments - 1,
        limit: state.limit - 1,
      };
    case actionTypes.CLEAR_OLD_COMMENTS:
      return {
        comments: [],
        status: "idle",
        totalComments: 0,
        limit: 0,
      };

    default:
      return state;
  }
};

export default commentReducer;
