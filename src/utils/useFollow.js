import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { followUser, unfollowUser } from "../functions/user";
import { actionTypes } from "../redux/actions/actionType";
import {
  createNotifyAction,
  removeNotifyAction,
} from "../redux/actions/notifyAction";

function useFollow(userId, token) {
  const [followLoading, setFollowLoading] = useState(false);
  const [userAfterFollow, setUserAfterFollow] = useState("");
  const dispatch = useDispatch();
  const { auth, socket } = useSelector((state) => state);

  const handleFollowAction = () => {
    setFollowLoading(true);
    followUser(userId, token)
      .then((res) => {
        setUserAfterFollow(res.data.userFollower);
        dispatch({
          type: actionTypes.GET_USER,
          payload: res.data.userFollowing,
        });
        setFollowLoading(false);

        //Notify
        const msg = {
          id: auth.user._id,
          text: "has started follow you.",
          recipients: [res.data.userFollower._id],
          url: `/${auth.user.username}`,
        };

        dispatch(createNotifyAction({ msg, auth, socket }));
      })
      .catch((err) => {
        console.log(err);
        setFollowLoading(false);
      });
  };

  const handleUnFollowAction = () => {
    setFollowLoading(true);
    unfollowUser(userId, token)
      .then((res) => {
        setUserAfterFollow(res.data.userFollower);
        dispatch({
          type: actionTypes.GET_USER,
          payload: res.data.userFollowing,
        });
        setFollowLoading(false);

        //Notify
        const msg = {
          id: auth.user._id,
          text: "has started follow you.",
          recipients: [res.data.userFollower._id],
          url: `/${auth.user.username}`,
        };

        dispatch(removeNotifyAction({ msg, auth, socket }));
      })
      .catch((err) => {
        console.log(err);
        setFollowLoading(false);
      });
  };

  return {
    userAfterFollow,
    followLoading,
    handleFollowAction,
    handleUnFollowAction,
  };
}

export default useFollow;
