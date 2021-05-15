import {
  createPost,
  getFollowerPost,
  updatePost,
  likePost,
  unLikePost,
  getSinglePost,
  removePosts,
} from "../../functions/post";
import { setMessage } from "./messageAction";
import { imageUpload } from "../../utils/uploadImage";
import { actionTypes } from "./actionType";
import { createNotifyAction, removeNotifyAction } from "./notifyAction";

export const createPostAction = (newPost, auth, socket) => async (dispatch) => {
  let media = [];
  dispatch({
    type: actionTypes.POST_LOADING,
    payload: true,
  });
  try {
    if (newPost.images.length > 0) media = await imageUpload(newPost.images);
    const res = await createPost(
      {
        title: newPost.title,
        images: media,
        postedBy: newPost.postedBy,
      },
      auth.token
    );
    dispatch({
      type: actionTypes.CREATE_POST,
      payload: res.data.post,
    });
    dispatch(setMessage("New Post is created.", "success"));
    dispatch({
      type: actionTypes.POST_LOADING,
      payload: false,
    });
    dispatch({
      type: actionTypes.POST_MODAL,
      payload: false,
    });

    // Notify
    const msg = {
      id: res.data.post._id,
      text: "added new post",
      recipients: res.data.post.postedBy.followers,
      url: `/post/${res.data.post._id}`,
      content: res.data.post.title,
      image: res.data.post.images[0].url,
    };

    dispatch(createNotifyAction({ msg, auth, socket }));
  } catch (err) {
    dispatch(setMessage(err.response.data.msg, "error"));
    dispatch({
      type: actionTypes.POST_LOADING,
      payload: false,
    });
  }
};

export const updatePostAction = (newPost, auth) => async (dispatch) => {
  let media = [];
  const newImageUrl = newPost.images.filter((img) => !img.url);
  const oldImageUrl = newPost.images.filter((img) => img.url);
  if (
    newImageUrl.length === 0 &&
    oldImageUrl.length === newPost.open.images.length &&
    newPost.title === newPost.open.title
  ) {
    dispatch({
      type: actionTypes.POST_MODAL,
      payload: false,
    });
    return;
  }

  try {
    dispatch({
      type: actionTypes.POST_LOADING,
      payload: true,
    });
    if (newImageUrl.length > 0) media = await imageUpload(newImageUrl);
    const res = await updatePost(
      {
        title: newPost.title,
        images: [...oldImageUrl, ...media],
        postedBy: newPost.postedBy,
      },
      newPost.open._id,
      auth.token
    );
    console.log(res);
    dispatch({
      type: actionTypes.UPDATE_POST,
      payload: res.data,
    });
    dispatch(setMessage("Post is updated.", "success"));
    dispatch({
      type: actionTypes.POST_LOADING,
      payload: false,
    });
    dispatch({
      type: actionTypes.POST_MODAL,
      payload: false,
    });
  } catch (err) {
    dispatch(setMessage(err.response.data.msg, "error"));
    dispatch({
      type: actionTypes.POST_LOADING,
      payload: false,
    });
  }
};

export const getHomePostAction = (id, token, page) => async (dispatch) => {
  try {
    dispatch({
      type: actionTypes.POST_LOADING,
      payload: true,
    });
    const res = await getFollowerPost(id, page, token);
    dispatch({
      type: actionTypes.GET_HOME_POST,
      payload: {
        posts: res.data.posts,
        result: res.data.result,
        hasMore: res.data.posts.length > 5,
      },
    });
    dispatch({
      type: actionTypes.POST_LOADING,
      payload: false,
    });
  } catch (err) {
    // err.response.data.msg &&
    //   dispatch(setMessage(err.response.data.msg, "error"));
    dispatch({
      type: actionTypes.POST_LOADING,
      payload: false,
    });
  }
};

export const likePostAction = (post, auth, socket) => async (dispatch) => {
  const newPost = { ...post, likes: [...post.likes, auth.user] };
  dispatch({ type: actionTypes.UPDATE_POST, payload: newPost });
  socket.emit("likePost", newPost);
  try {
    await likePost({ id: auth.user._id }, post._id, auth.token);

    // Notify
    const msg = {
      id: auth.user._id,
      text: "like your post",
      recipients: [post.postedBy._id],
      url: `/post/${post._id}`,
      content: post.title,
      image: post.images[0].url,
    };

    dispatch(createNotifyAction({ msg, auth, socket }));
  } catch (err) {
    err.response?.data?.msg &&
      dispatch(setMessage(err.response.data.msg, "error"));
  }
};

export const UnLikePostAction = (post, auth, socket) => async (dispatch) => {
  const newPost = {
    ...post,
    likes: post.likes.filter((like) => like._id !== auth.user._id),
  };
  dispatch({ type: actionTypes.UPDATE_POST, payload: newPost });
  socket.emit("unLikePost", newPost);
  try {
    await unLikePost({ id: auth.user._id }, post._id, auth.token);

    // Notify
    const msg = {
      id: auth.user._id,
      text: "like your post",
      recipients: [post.postedBy._id],
      url: `/post/${post._id}`,
    };

    dispatch(removeNotifyAction({ msg, auth, socket }));
  } catch (err) {
    err.response?.data?.msg &&
      dispatch(setMessage(err.response.data.msg, "error"));
  }
};

export const getPostAction = (postDetail, id, auth) => async (dispatch) => {
  try {
    if (postDetail.every((post) => post._id !== id)) {
      const res = await getSinglePost(id, auth.token);
      dispatch({ type: actionTypes.GET_POST, payload: res.data.post });
    }
  } catch (err) {
    err.response?.data?.msg &&
      dispatch(setMessage(err.response?.data?.msg, "error"));
  }
};

export const deletePostAction = (post, auth, socket) => async (dispatch) => {
  dispatch({ type: actionTypes.DELETE_POST, payload: post });
  try {
    const res = await removePosts(post._id, auth.token);
    dispatch({
      type: actionTypes.POST_MODAL,
      payload: false,
    });

    // Notify
    const msg = {
      id: res.data.post._id,
      recipients: res.data.post.postedBy.followers,
      url: `/post/${res.data.post._id}`,
    };

    dispatch(removeNotifyAction({ msg, auth, socket }));
  } catch (err) {
    err.response?.data?.msg &&
      dispatch(setMessage(err.response?.data?.msg, "error"));
  }
};
