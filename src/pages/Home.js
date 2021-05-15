import { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import Container from "@material-ui/core/Container";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import { CircularProgress, Hidden } from "@material-ui/core";
import Skeleton from "@material-ui/lab/Skeleton";
import ReplayIcon from "@material-ui/icons/Replay";
import IconButton from "@material-ui/core/IconButton";

import HomeCard from "../components/card/HomeCard";
import CreatePostForm from "../components/form/CreatePostForm";
import { suggestUser } from "../functions/user";
import SuggestUser from "../components/SuggestUser";
import { getHomePostAction } from "../redux/actions/postAction";

const useStyles = makeStyles((theme) => ({
  avatar: {
    width: 60,
    height: 60,
  },
  name: {
    color: "#262626",
    fontWeight: 600,
    width: "100%",
    display: "block",
  },
  fixedTop: {
    position: "sticky",
    top: `calc(${theme.mixins.toolbar.minHeight}px + 38px)`,
  },
  icon: {
    padding: 0,
  },
}));

const Home = () => {
  const classes = useStyles();
  const theme = useTheme();
  const matchesSM = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch();

  const [suggestListUser, setSuggestListUser] = useState([]);
  const [suggestLoading, setSuggestLoading] = useState(true);

  const [page, setPage] = useState(1);

  const { auth, postReducer } = useSelector((state) => state);
  const { user, token } = auth;
  const observer = useRef();
  const skeletonList = [1, 2, 3, 4, 5];

  useEffect(() => {
    if (auth.token) {
      dispatch(getHomePostAction(auth.user._id, auth.token, page));
    }
  }, [dispatch, auth.user._id, auth.token, page]);

  const getSuggestListItem = useCallback(() => {
    setSuggestLoading(true);
    suggestUser(user._id, token)
      .then((res) => {
        setSuggestListUser(res.data.users);
        setSuggestLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setSuggestLoading(false);
      });
  }, [user._id, token]);

  useEffect(() => {
    getSuggestListItem();
  }, [getSuggestListItem]);

  const lastPostElementRef = useCallback(
    (node) => {
      if (postReducer.loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && postReducer.hasMore) {
          setPage((prevPageNumber) => prevPageNumber + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [postReducer.loading, postReducer.hasMore]
  );

  return (
    <>
      <Container maxWidth="md">
        <Grid container justify="center">
          <Grid
            item
            xs={12}
            sm={8}
            style={{ paddingRight: matchesSM ? 0 : 30 }}
          >
            <CreatePostForm />

            {postReducer.posts.result === 0 && !postReducer.loading && (
              <Typography variant="body1">No posts</Typography>
            )}

            {postReducer.posts.map((post, index) => {
              if (
                postReducer.posts.length > 5 &&
                postReducer.posts.length === index + 1
              ) {
                return (
                  <HomeCard
                    ref={lastPostElementRef}
                    key={post._id}
                    post={post}
                  />
                );
              }
              return <HomeCard key={post._id} post={post} />;
            })}
            {postReducer.loading && (
              <div style={{ display: "flex", justifyContent: "center" }}>
                <CircularProgress size={25} />
              </div>
            )}
          </Grid>
          <Hidden smDown>
            <Grid item md={4} style={{ position: "relative" }}>
              <Grid container direction="column" className={classes.fixedTop}>
                <Grid item container>
                  <Grid item md={3}>
                    {user.avatar?.url &&
                    !(
                      Object.keys(user.avatar?.url).length === 0 &&
                      user.avatar?.url.constructor === Object
                    ) ? (
                      <Avatar
                        className={classes.avatar}
                        component={Link}
                        to={`/${user.username}`}
                        src={user.avatar?.url}
                        alt="profile picture"
                      />
                    ) : (
                      <Avatar
                        className={classes.avatar}
                        component={Link}
                        to={`/${user.username}`}
                        alt="profile picture"
                      />
                    )}
                  </Grid>
                  <Grid item container alignItems="center" md>
                    <Typography
                      component={Link}
                      to={`/${user.username}`}
                      className={classes.name}
                      variant="body2"
                    >
                      {user.username}
                    </Typography>
                    <Typography style={{ color: "#8e8e8e" }}>
                      {user.fullname}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid
                  item
                  container
                  style={{ marginTop: 20, marginBottom: 20 }}
                >
                  <Grid container justify="space-between">
                    <Typography variant="body2" style={{ color: "#8e8e8e" }}>
                      Suggestions For You
                    </Typography>
                    <IconButton
                      onClick={getSuggestListItem}
                      className={classes.icon}
                    >
                      <ReplayIcon fontSize="small" />
                    </IconButton>
                  </Grid>
                </Grid>
                {suggestLoading
                  ? skeletonList.map((item) => (
                      <Grid
                        key={item}
                        style={{ marginBottom: "10px" }}
                        item
                        container
                        alignItems="center"
                      >
                        <Skeleton variant="circle" width={40} height={40} />
                        <Skeleton
                          style={{ marginLeft: "10px" }}
                          variant="rect"
                          width="80%"
                          height={20}
                        />
                      </Grid>
                    ))
                  : suggestListUser.length > 0 &&
                    suggestListUser.map((u) => (
                      <SuggestUser key={u._id} user={u} />
                    ))}
              </Grid>
            </Grid>
          </Hidden>
        </Grid>
      </Container>
    </>
  );
};

export default Home;
