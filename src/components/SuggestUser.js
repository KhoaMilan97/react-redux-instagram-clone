import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { Grid, Avatar, Typography, CircularProgress } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import MuiLink from "@material-ui/core/Link";
import FollowModal from "./modal/FollowModal";
import useFollow from "../utils/useFollow";

const useStyles = makeStyles((theme) => ({
  avatarSmall: {
    width: 40,
    height: 40,
  },
  link: {
    width: "100%",
    textAlign: "right",
    display: "inline-block",
    fontSize: "14px",
    lineHeight: "14px",
    color: "#0095f6",
    fontWeight: "600",
    "&:hover": {
      cursor: "pointer",
      textDecoration: "none",
    },
  },
  name: {
    color: "#262626",
    fontWeight: 600,
    width: "100%",
    display: "block",
  },
}));

function SuggestUser({ user }) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const [isFollow, setIsFollow] = useState(false);
  const auth = useSelector((state) => state.auth);
  const {
    userAfterFollow,
    followLoading,
    handleFollowAction,
    handleUnFollowAction,
  } = useFollow(user._id, auth.token);

  const handleClick = () => {
    handleFollowAction();
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  useEffect(() => {
    const check = auth.user.following.some((item) => item._id === user._id);
    setIsFollow(check);
  }, [userAfterFollow, auth.user.following, user._id]);

  return (
    <>
      <FollowModal
        open={open}
        setOpen={setOpen}
        user={user}
        handleUnFollowAction={handleUnFollowAction}
      />
      <Grid item container style={{ marginBottom: 10 }}>
        <Grid item md={2}>
          {user.avatar?.url ? (
            <Avatar
              className={classes.avatarSmall}
              src={user.avatar?.url}
              component={Link}
              to={`/${user.username}`}
              alt="profile picture"
            />
          ) : (
            <Avatar
              className={classes.avatarSmall}
              component={Link}
              to={`/${user.username}`}
              alt="profile picture"
            />
          )}
        </Grid>
        <Grid item container alignItems="center" md={7}>
          <Typography className={classes.name} variant="body2">
            <Link style={{ color: "inherit" }} to={`/${user.username}`}>
              {user.username}
            </Link>
          </Typography>
        </Grid>
        <Grid item container alignItems="center" md={3}>
          {isFollow ? (
            <MuiLink
              onClick={handleClickOpen}
              style={{ color: "inherit" }}
              className={classes.link}
            >
              {followLoading ? (
                <CircularProgress size={22} color="primary" />
              ) : (
                "Following"
              )}
            </MuiLink>
          ) : (
            <MuiLink onClick={handleClick} className={classes.link}>
              {followLoading ? (
                <CircularProgress size={22} color="primary" />
              ) : (
                "Follow"
              )}
            </MuiLink>
          )}
        </Grid>
      </Grid>
    </>
  );
}

export default SuggestUser;
