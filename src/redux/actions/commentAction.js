import { actionTypes } from "./actionType";
import {
  createComment,
  updateComment,
  likeComment,
  unLikeComment,
  deleteComment,
} from "../../functions/comment";
import { setMessage } from "./messageAction";
import { createNotifyAction, removeNotifyAction } from "./notifyAction";

export const createCommentAction =
  (post, newComment, auth, socket) => async (dispatch) => {
    const newPost = { ...post, comments: [...post.comments, newComment] };
    dispatch({ type: actionTypes.UPDATE_POST, payload: newPost });
    try {
      const res = await createComment(newComment, auth.token);
      const newData = { ...res.data.comment, postedBy: auth.user };
      const newPost = { ...post, comments: [...post.comments, newData] };
      dispatch({ type: actionTypes.UPDATE_POST, payload: newPost });

      // socket
      socket.emit("createComment", newPost);

      // Notify
      const msg = {
        id: res.data.comment._id,
        text: newComment.reply
          ? "mentioned you in comment"
          : "has commented on your post",
        recipients: newComment.reply
          ? [newComment.tag._id]
          : [post.postedBy._id],
        url: `/post/${post._id}`,
        content: post.title,
        image: post.images[0].url,
      };

      dispatch(createNotifyAction({ msg, auth, socket }));
    } catch (err) {
      console.log(err);
    }
  };

export const updateCommentAction =
  ({ post, comment, content }, auth) =>
  async (dispatch) => {
    const index = post.comments.findIndex((cmt) => cmt._id === comment._id);
    const newComments = [...post.comments];
    newComments[index].content = content;
    const newPost = { ...post, comments: newComments };

    dispatch({ type: actionTypes.UPDATE_POST, payload: newPost });

    try {
      await updateComment(comment._id, { content }, auth.token);
    } catch (err) {
      console.log(err);
      err.response?.data?.msg &&
        dispatch(setMessage(err.response.data.msg, "error"));
    }
  };

export const likeCommentAction = (comment, post, auth) => async (dispatch) => {
  const newComment = { ...comment, likes: [...comment.likes, auth.user] };
  const index = post.comments.findIndex((cmt) => cmt._id === comment._id);
  const newComments = [...post.comments];
  newComments[index] = newComment;

  const newPost = { ...post, comments: newComments };

  dispatch({ type: actionTypes.UPDATE_POST, payload: newPost });

  try {
    await likeComment(comment._id, { id: auth.user._id }, auth.token);
  } catch (err) {
    console.log(err);
    err.response?.data?.msg &&
      dispatch(setMessage(err.response.data.msg, "error"));
  }
};

export const unLikeCommentAction =
  (comment, post, auth) => async (dispatch) => {
    const newComment = {
      ...comment,
      likes: comment.likes.filter((cmt) => cmt._id !== auth.user._id),
    };
    const index = post.comments.findIndex((cmt) => cmt._id === comment._id);
    const newComments = [...post.comments];
    newComments[index] = newComment;

    const newPost = { ...post, comments: newComments };

    dispatch({ type: actionTypes.UPDATE_POST, payload: newPost });
    try {
      await unLikeComment(comment._id, { id: auth.user._id }, auth.token);
    } catch (err) {
      console.log(err);
      err.response?.data?.msg &&
        dispatch(setMessage(err.response.data.msg, "error"));
    }
  };

export const removeCommentAction =
  ({ post, comment }, auth, socket) =>
  (dispatch) => {
    const arrDelete = [
      ...post.comments.filter((cmt) => cmt.reply === comment._id),
      comment,
    ];
    const newPost = {
      ...post,
      comments: post.comments.filter(
        (cm) => !arrDelete.find((da) => da._id === cm._id)
      ),
    };
    //console.log(arrDelete);

    dispatch({ type: actionTypes.UPDATE_POST, payload: newPost });

    socket.emit("deleteComment", newPost);
    try {
      arrDelete.forEach((item) => {
        deleteComment(item._id, auth.token);

        // Notify
        const msg = {
          id: item._id,
          text: comment.reply
            ? "mentioned you in comment"
            : "has commented on your post",
          recipients: comment.reply ? [comment.tag._id] : [post.postedBy._id],
          url: `/post/${post._id}`,
        };

        dispatch(removeNotifyAction({ msg, auth, socket }));
      });
    } catch (err) {
      console.log(err);
    }
  };
