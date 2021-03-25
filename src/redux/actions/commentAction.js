import { actionTypes } from "./actionType";
import {
  getPostComments,
  createComment,
  deleteComment,
  getCommentCount,
} from "../../functions/comment";

const getComments = () => ({
  type: actionTypes.GET_COMMENTS,
});

const getCommentsFail = () => ({
  type: actionTypes.GET_COMMENTS_FAILED,
});

const getCommentsSuccess = (comments) => ({
  type: actionTypes.GET_COMMENTS_SUCCEEDED,
  payload: comments,
});

const getTotalComments = (total) => ({
  type: actionTypes.GET_TOTAL_COMMENTS,
  payload: total,
});

export const clearOldComments = () => ({
  type: actionTypes.CLEAR_OLD_COMMENTS,
});

export const getTotalCommentsAction = (id, token) => async (dispatch) => {
  try {
    const res = await getCommentCount(id, token);
    dispatch(getTotalComments(res.data));
  } catch (err) {
    console.log(err);
  }
};

export const getCommentsAction = (id, page, token) => async (dispatch) => {
  dispatch(getComments());
  try {
    const res = await getPostComments(id, page, token);
    dispatch(getCommentsSuccess(res.data));
  } catch (err) {
    console.log(err);
    dispatch(getCommentsFail());
  }
};

export const createCommentAction = (data, token) => async (dispatch) => {
  try {
    const res = await createComment(data, token);
    dispatch({
      type: actionTypes.CREATE_COMMENTS,
      payload: res.data,
    });
  } catch (err) {
    console.log(err);
  }
};

export const deleteCommentAction = (id, token) => async (dispatch) => {
  try {
    await deleteComment(id, token);
    dispatch({
      type: actionTypes.DELETE_COMMENT,
      payload: id,
    });
  } catch (err) {
    console.log(err);
  }
};
