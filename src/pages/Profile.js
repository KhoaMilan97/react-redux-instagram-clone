import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import Avatar from "@material-ui/core/Avatar";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Paper from "@material-ui/core/Paper";
import ViewComfyIcon from "@material-ui/icons/ViewComfy";
import MovieIcon from "@material-ui/icons/Movie";
import BookmarkBorderOutlinedIcon from "@material-ui/icons/BookmarkBorderOutlined";
import LocalOfferIcon from "@material-ui/icons/LocalOffer";
import CircularProgress from "@material-ui/core/CircularProgress";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import NotFound from "../pages/NotFound";
import { getUser, followUser, unfollowUser } from "../functions/user";
import Spinner from "../components/loading/Spinner";
import { actionTypes } from "../redux/actions/actionType";

const useStyles = makeStyles((theme) => ({
  avatar: {
    width: 150,
    height: 150,
  },
  root: {
    flexGrow: 1,
    backgroundColor: "#fafafa",
  },
  name: {
    fontWeight: 300,
    fontSize: "28px",
    lineHeight: "32px",
    color: "#262626",
    marginTop: "15px",
  },
  indicator: {
    top: "0px",
  },
  tab: {
    color: "#8e8e8e",
  },
  button: {
    minWidth: "100px",
    minHeight: "35px",
  },
  circularProgress: {
    width: "20px !important",
    height: "20px !important",
    display: "block",
    color: "white",
  },
  number: {
    color: "#262626",
    fontWeight: 600,
  },
}));

function Profile() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const { username } = useParams();
  const [user, setUser] = useState("");
  const [loading, setLoading] = useState(true);
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [followLoading, setFollowLoading] = useState(false);
  const theme = useTheme();
  const matchesSM = useMediaQuery(theme.breakpoints.down("sm"));

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    setLoading(true);
    getUser(username)
      .then((res) => {
        setUser(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [username]);

  if (loading) {
    return <Spinner pending={loading} />;
  }

  if (!user && !loading) {
    return <NotFound />;
  }

  const handleFollowAction = () => {
    setFollowLoading(true);
    followUser(user._id, auth.token)
      .then((res) => {
        setUser(res.data.userFollower);
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
    unfollowUser(user._id, auth.token)
      .then((res) => {
        setUser(res.data.userFollower);
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

  const checkUserIsFollow = (id) => {
    return auth.user.following.some((item) => item._id === id);
  };

  const renderAction = () => {
    if (auth.user.username === username) {
      return (
        <Button
          component={Link}
          to="/accounts/edit"
          variant="outlined"
          style={{ marginLeft: 10 }}
        >
          Edit Profile
        </Button>
      );
    } else {
      if (checkUserIsFollow(user._id)) {
        return (
          <Button
            color="secondary"
            variant="contained"
            style={{ marginLeft: 10 }}
            onClick={handleUnFollowAction}
            className={classes.button}
          >
            {followLoading ? (
              <CircularProgress className={classes.circularProgress} />
            ) : (
              "Un Follow"
            )}
          </Button>
        );
      } else {
        return (
          <Button
            color="primary"
            variant="contained"
            style={{ marginLeft: 10 }}
            onClick={handleFollowAction}
            className={classes.button}
          >
            {followLoading ? (
              <CircularProgress className={classes.circularProgress} />
            ) : (
              "Follow"
            )}
          </Button>
        );
      }
    }
  };

  return (
    <Container maxWidth="md">
      <Grid container justify={matchesSM ? "center" : undefined}>
        <Grid item container sm={4} justify="center">
          {user.avatar?.url ? (
            <Avatar
              alt="profile picture"
              src={user.avatar?.url}
              className={classes.avatar}
            />
          ) : (
            <Avatar alt="profile picture" className={classes.avatar} />
          )}
        </Grid>
        <Grid item sm={8}>
          <Typography className={classes.name}>
            {user.username} {renderAction()}
          </Typography>

          <Grid container style={{ marginTop: 10 }}>
            <Grid item>
              <Typography>
                <span className={classes.number}>0</span> posts
              </Typography>
            </Grid>
            <Grid item style={{ margin: "0 50px" }}>
              <Typography>
                <span className={classes.number}>{user.followers.length}</span>{" "}
                followers
              </Typography>
            </Grid>
            <Grid item>
              <Typography>
                <span className={classes.number}>{user.following.length}</span>{" "}
                following
              </Typography>
            </Grid>
          </Grid>
          <Typography style={{ marginTop: "15px" }}>{user.fullname}</Typography>
        </Grid>
      </Grid>
      <Grid container style={{ marginTop: 30 }}>
        <Paper className={classes.root}>
          <Tabs
            value={value}
            classes={{
              indicator: classes.indicator,
            }}
            onChange={handleChange}
            indicatorColor="primary"
            textColor="primary"
            centered
          >
            <Tab
              className={classes.tab}
              label={
                <div>
                  <ViewComfyIcon
                    style={{ verticalAlign: "middle", fontSize: 16 }}
                  />{" "}
                  Post
                </div>
              }
            />

            <Tab
              label={
                <div>
                  <MovieIcon
                    style={{ verticalAlign: "middle", fontSize: 16 }}
                  />{" "}
                  IGTV
                </div>
              }
            />
            <Tab
              label={
                <div>
                  <BookmarkBorderOutlinedIcon
                    style={{ verticalAlign: "middle", fontSize: 16 }}
                  />{" "}
                  Saved
                </div>
              }
            />
            <Tab
              label={
                <div>
                  <LocalOfferIcon
                    style={{ verticalAlign: "middle", fontSize: 16 }}
                  />{" "}
                  Tagged
                </div>
              }
            />
          </Tabs>
        </Paper>
      </Grid>
    </Container>
  );
}

export default Profile;
