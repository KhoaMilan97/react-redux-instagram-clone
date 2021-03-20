import { useEffect, useState, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
//import InfiniteScroll from "react-infinite-scroll-component";

import Container from "@material-ui/core/Container";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
import MuiLink from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import { CircularProgress, Hidden } from "@material-ui/core";

import HomeCard from "../components/card/HomeCard";
import CreatePostForm from "../components/form/CreatePostForm";
import { getFollowerPost } from "../functions/post";

const useStyles = makeStyles((theme) => ({
  avatar: {
    width: 60,
    height: 60,
  },
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

const Home = () => {
  const classes = useStyles();
  const theme = useTheme();
  const matchesSM = useMediaQuery(theme.breakpoints.down("sm"));
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingPost, setLoadingPost] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);

  const auth = useSelector((state) => state.auth);
  const { user, token } = auth;
  const observer = useRef();

  useEffect(() => {
    setLoadingPost(true);
    getFollowerPost(user._id, page, token)
      .then((res) => {
        setPosts((post) => [...post, ...res.data]);
        setHasMore(res.data.length > 0);

        setLoadingPost(false);
      })
      .catch((err) => {
        console.log(err);

        setLoadingPost(false);
      });
  }, [user._id, token, page]);

  const lastPostElementRef = useCallback(
    (node) => {
      if (loadingPost) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPageNumber) => prevPageNumber + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loadingPost, hasMore]
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

            {posts.map((post, index) => {
              if (posts.length > 5 && posts.length === index + 1) {
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
            {loadingPost && (
              <div style={{ display: "flex", justifyContent: "center" }}>
                <CircularProgress size={25} />
              </div>
            )}
          </Grid>
          <Hidden smDown>
            <Grid item md={4}>
              <Grid container direction="column">
                <Grid item container>
                  <Grid item md={3}>
                    {user.avatar?.url &&
                    !(
                      Object.keys(user.avatar?.url).length === 0 &&
                      user.avatar?.url.constructor === Object
                    ) ? (
                      <Avatar
                        className={classes.avatar}
                        src={user.avatar?.url}
                        alt="profile picture"
                      />
                    ) : (
                      <Avatar
                        className={classes.avatar}
                        alt="profile picture"
                      />
                    )}
                  </Grid>
                  <Grid item container alignItems="center" md>
                    <Typography className={classes.name} variant="body2">
                      {user.username}
                    </Typography>
                    <Typography style={{ color: "#8e8e8e" }}>
                      {user.fullname}
                    </Typography>
                  </Grid>
                  {/* <Grid item container alignItems="center" md>
                    <MuiLink className={classes.link}>Switch</MuiLink>
                  </Grid> */}
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
                    <Typography variant="body2">See all</Typography>
                  </Grid>
                </Grid>
                <Grid item container style={{ marginBottom: 10 }}>
                  <Grid item md={2}>
                    {user.avatar?.url ? (
                      <Avatar
                        className={classes.avatarSmall}
                        src={user.avatar?.url}
                        alt="profile picture"
                      />
                    ) : (
                      <Avatar
                        className={classes.avatarSmall}
                        alt="profile picture"
                      />
                    )}
                  </Grid>
                  <Grid item container alignItems="center" md>
                    <Typography className={classes.name} variant="body2">
                      p_25102002
                    </Typography>
                    <Typography style={{ color: "#8e8e8e", fontSize: 12 }}>
                      Followed by chicong.l
                    </Typography>
                  </Grid>
                  <Grid item container alignItems="center" md>
                    <MuiLink className={classes.link}>Follow</MuiLink>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Hidden>
        </Grid>
      </Container>
    </>
  );
};

export default Home;
