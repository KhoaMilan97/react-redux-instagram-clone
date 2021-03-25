import React, { useEffect, useRef, useState } from "react";
import {
  useParams,
  Link,
  useRouteMatch,
  Switch,
  useLocation,
} from "react-router-dom";
import { useSelector } from "react-redux";
import ReactHtmlParser from "react-html-parser";
import _ from "lodash";

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

import BookmarkBorderOutlinedIcon from "@material-ui/icons/BookmarkBorderOutlined";

import CircularProgress from "@material-ui/core/CircularProgress";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import PersonIcon from "@material-ui/icons/Person";
import DoneIcon from "@material-ui/icons/Done";
import MuiLink from "@material-ui/core/Link";

import NotFound from "../NotFound";
import { getUser } from "../../functions/user";
import Spinner from "../../components/loading/Spinner";
import PostGallerry from "./PostGallerry";
import FollowModal from "../../components/modal/FollowModal";
import { getPosts } from "../../functions/post";
import ListFollowModal from "../../components/modal/ListFollowModal";
import PrivateRoute from "../../utils/privateRoute";
import SavedPost from "./SavedPost";
import useFollow from "../../utils/useFollow";

const useStyles = makeStyles((theme) => ({
  avatar: {
    width: 150,
    height: 150,
    [theme.breakpoints.down("xs")]: {
      marginTop: 20,
    },
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
  story: {
    "& p": {
      marginTop: "5px",
      marginBottom: "5px",
    },
  },
  muiLink: {
    cursor: "pointer",
    textDecorationLine: "none",
    color: "inherit",
    "&:hover": {
      textDecorationLine: "none",
    },
  },
}));

function Profile() {
  const [value, setValue] = useState(0);
  const [user, setUser] = useState("");
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [postLoading, setPostLoading] = useState(true);
  const [openListFollow, setOpenListFollow] = useState(false);
  const [title, setTitle] = useState("");
  const [listFollow, setListFollow] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingPost, setLoadingPost] = useState(false);

  const classes = useStyles();
  const { username } = useParams();
  const auth = useSelector((state) => state.auth);
  const theme = useTheme();
  const matchesSM = useMediaQuery(theme.breakpoints.down("sm"));
  const postsRef = useRef();

  let { path, url } = useRouteMatch();
  const location = useLocation();
  const {
    userAfterFollow,
    followLoading,
    handleFollowAction,
    handleUnFollowAction,
  } = useFollow(user._id, auth.token);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  useEffect(() => {
    if (userAfterFollow) {
      setUser(userAfterFollow);
    }
  }, [userAfterFollow]);

  useEffect(() => {
    postsRef.current = posts;
  }, [posts]);

  useEffect(() => {
    if (window.location.pathname === url) {
      setValue(0);
    } else if (
      window.location.pathname === `${url}/saved/` ||
      window.location.pathname === `${url}/saved`
    ) {
      setValue(1);
    }
  }, [url, location]);

  useEffect(() => {
    setPosts([]);
    setPage(1);
    setPostLoading(true);
    setUser("");
    setLoading(true);
  }, [username]);

  useEffect(() => {
    if (username === auth.user.username) {
      setUser(auth.user);
      setLoading(false);
    } else {
      //setLoading(true);
      getUser(username)
        .then((res) => {
          setUser(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
  }, [username, auth.user]);

  useEffect(() => {
    if (user?._id) {
      //setPostLoading(true);
      setLoadingPost(true);
      getPosts(user._id, page, auth.token)
        .then((res) => {
          let newArr = [...postsRef.current, ...res.data.post];
          newArr = _.uniqBy(newArr, "_id");
          setPosts(newArr);
          setHasMore(res.data.post.length > 0);
          setPostLoading(false);
          setLoadingPost(false);
        })
        .catch((err) => {
          console.log(err);
          setPostLoading(false);
          setLoadingPost(false);
        });
    }
  }, [user?._id, page, auth.token]);

  useEffect(() => {
    if (title === "Followers" && openListFollow) {
      setListFollow(user.followers);
    } else if (title === "Following" && openListFollow) {
      setListFollow(user.following);
    }
  }, [title, openListFollow, user?.followers, user?.following]);

  const checkUserIsFollow = (id) => {
    return auth.user.following.some((item) => item._id === id);
  };

  const handleClickFollowOpen = () => {
    setTitle("Followers");
    setOpenListFollow(true);
  };

  const handleClickFollowingOpen = () => {
    setTitle("Following");
    setOpenListFollow(true);
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

  if (loading) {
    return <Spinner pending={loading} />;
  }

  if (!user && !loading) {
    return <NotFound />;
  }

  return (
    <>
      <ListFollowModal
        open={openListFollow}
        setOpen={setOpenListFollow}
        title={title}
        list={listFollow}
      />

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
          <Grid
            style={{ textAlign: matchesSM ? "center" : "left" }}
            item
            sm={8}
          >
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
              <Grid item style={{ marginLeft: matchesSM ? 15 : 0 }}>
                <Typography>
                  <span className={classes.number}>{posts.length}</span> posts
                </Typography>
              </Grid>
              <Grid item style={{ margin: "0 50px" }}>
                <Typography
                  component={MuiLink}
                  className={classes.muiLink}
                  onClick={handleClickFollowOpen}
                >
                  <span className={classes.number}>
                    {user.followers.length}
                  </span>{" "}
                  followers
                </Typography>
              </Grid>
              <Grid item>
                <Typography
                  component={MuiLink}
                  className={classes.muiLink}
                  onClick={handleClickFollowingOpen}
                >
                  <span className={classes.number}>
                    {user.following.length}
                  </span>{" "}
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
            <div className={classes.story}>
              {ReactHtmlParser(user.description)}
            </div>
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
          <Paper className={classes.root} variant="outlined">
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
                component={Link}
                to={`${url}`}
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
                component={Link}
                to={`${url}/saved/`}
                label={
                  <div>
                    <BookmarkBorderOutlinedIcon
                      style={{ verticalAlign: "middle", fontSize: 16 }}
                    />{" "}
                    Saved
                  </div>
                }
              />
            </Tabs>
          </Paper>
        </Grid>

        <Switch>
          <PrivateRoute
            sensitive
            exact
            path={`${path}`}
            render={() => (
              <PostGallerry
                posts={posts}
                setPage={setPage}
                hasMore={hasMore}
                loadingPost={loadingPost}
                postLoading={postLoading}
              />
            )}
          />
          <PrivateRoute
            sensitive
            exact
            path={`${path}/saved/`}
            render={() => <SavedPost user={user} />}
          />
        </Switch>
      </Container>
    </>
  );
}

export default Profile;
