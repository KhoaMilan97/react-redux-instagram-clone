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
import PersonIcon from "@material-ui/icons/Person";
import DoneIcon from "@material-ui/icons/Done";
import MuiLink from "@material-ui/core/Link";

import NotFound from "../NotFound";
import { getUser, followUser, unfollowUser } from "../../functions/user";
import Spinner from "../../components/loading/Spinner";
import { actionTypes } from "../../redux/actions/actionType";
import PostGallerry from "./PostGallerry";
import FollowModal from "../../components/modal/FollowModal";
import { getPosts } from "../../functions/post";
import SingleLoading from "../../components/loading/SingleLoading";

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
    "@media (min-width: 500px)": {
      minWidth: "110px",
    },
    "@media (min-width: 700px)": {
      minWidth: "160px",
    },
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
  const [value, setValue] = useState(0);
  const [user, setUser] = useState("");
  const [loading, setLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [postLoading, setPostLoading] = useState(false);

  const classes = useStyles();
  const { username } = useParams();
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const theme = useTheme();
  const matchesSM = useMediaQuery(theme.breakpoints.down("sm"));

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleClickOpen = () => {
    setOpen(true);
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

  useEffect(() => {
    if (user._id) {
      setPostLoading(true);
      getPosts(user._id, auth.token)
        .then((res) => {
          setPosts(res.data.post);
          setPostLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setPostLoading(false);
        });
    }
  }, [user._id, auth.token]);

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
            variant="outlined"
            style={{ marginLeft: 10 }}
            onClick={handleClickOpen}
            className={classes.button}
          >
            {followLoading ? (
              <CircularProgress
                style={{ color: "black" }}
                className={classes.circularProgress}
              />
            ) : (
              <>
                <PersonIcon />
                <DoneIcon />
              </>
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
          <FollowModal
            user={user}
            open={open}
            setOpen={setOpen}
            handleUnFollowAction={handleUnFollowAction}
          />

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
          <Typography style={{ marginTop: "15px", fontWeight: 600 }}>
            {user.fullname}
            {user.phoneNumber && (
              <span style={{ color: "#3f51b5" }}>
                {" - "}
                {user.phoneNumber}
              </span>
            )}
          </Typography>
          <Typography>{user.description}</Typography>
          {user.website && (
            <MuiLink
              target="_blank"
              rel="noopener"
              style={{ fontWeight: 600 }}
              href={user.website}
            >
              {user.website}
            </MuiLink>
          )}
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
              className={classes.tab}
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
              className={classes.tab}
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
              className={classes.tab}
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
      {postLoading ? (
        <SingleLoading pending={postLoading} />
      ) : posts.length > 0 ? (
        <PostGallerry posts={posts} />
      ) : (
        <Typography>This User No Posts</Typography>
      )}
    </Container>
  );
}

export default Profile;
