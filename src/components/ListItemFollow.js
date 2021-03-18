import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";

import { followUser, unfollowUser } from "../functions/user";
import { actionTypes } from "../redux/actions/actionType";
import FollowModal from "./modal/FollowModal";

function ListItemFollow({ userFollow, handleClose }) {
  const [userFollows, setUserFollows] = useState(userFollow);
  const [followLoading, setFollowLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const { user, token } = useSelector((state) => state.auth);
  const checkIsFollow = user.following.some(
    (item) => item._id === userFollows._id
  );
  const dispatch = useDispatch();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleFollowAction = () => {
    setFollowLoading(true);
    followUser(userFollows._id, token)
      .then((res) => {
        setUserFollows(res.data.userFollower);
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
    unfollowUser(userFollows._id, token)
      .then((res) => {
        setUserFollows(res.data.userFollower);
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

  return (
    <>
      <FollowModal
        user={userFollows}
        open={open}
        setOpen={setOpen}
        handleUnFollowAction={handleUnFollowAction}
      />
      <ListItem>
        <ListItemAvatar>
          <Avatar
            component={Link}
            to={`/${userFollows.username}`}
            src={userFollows.avatar?.url}
            onClick={handleClose}
          />
        </ListItemAvatar>
        <ListItemText
          primary={
            <Link
              onClick={handleClose}
              style={{ color: "inherit" }}
              to={`/${userFollows.username}`}
            >
              {userFollows.username}
            </Link>
          }
          secondary={userFollows.fullname}
        />
        {user._id !== userFollows._id && (
          <ListItemSecondaryAction>
            {checkIsFollow ? (
              <Button
                onClick={handleClickOpen}
                variant="outlined"
                edge="end"
                aria-label="delete"
              >
                {followLoading ? (
                  <CircularProgress size={22} color="inherit" />
                ) : (
                  "Following"
                )}
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                edge="end"
                aria-label="delete"
                onClick={handleFollowAction}
              >
                {followLoading ? (
                  <CircularProgress size={22} color="inherit" />
                ) : (
                  "Follow"
                )}
              </Button>
            )}
          </ListItemSecondaryAction>
        )}
      </ListItem>
    </>
  );
}

export default ListItemFollow;
