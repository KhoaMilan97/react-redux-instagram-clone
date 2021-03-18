import { actionTypes } from "../actions/actionType";
import { setMessage } from "./messageAction";
import { likePost, unLikePost } from "../functions/post";
import history from "../../utils/history";

export const likePost = (post) => ({
  type: actionTypes.LIKE_POST,
  payload: post,
});

export const unLikePost = (post) => ({
  type: actionTypes.UNLIKE_POST,
  payload: post,
});

export const likePostAction = (user_id, post_id, token) => async (dispatch) => {
  try {
    const res = await likePost(user_id, post_id, token);
    dispatch(likePost(res.data));
  } catch (err) {
    err.response.data.msg &&
      dispatch(setMessage(err.response.data.msg, "error"));
  }
};

export const unLikePostAction = (user_id, post_id, token) => async (
  dispatch
) => {
  try {
    const res = await unLikePost(user_id, post_id, token);
    dispatch(unLikePost(res.data));
  } catch (err) {
    err.response.data.msg &&
      dispatch(setMessage(err.response.data.msg, "error"));
  }
};
