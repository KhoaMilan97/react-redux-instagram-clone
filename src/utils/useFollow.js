import { useState } from "react";
import { useDispatch } from "react-redux";

import { followUser, unfollowUser } from "../functions/user";
import { actionTypes } from "../redux/actions/actionType";

function useFollow(userId, token) {
  const [followLoading, setFollowLoading] = useState(false);
  const [userAfterFollow, setUserAfterFollow] = useState("");
  const dispatch = useDispatch();

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
