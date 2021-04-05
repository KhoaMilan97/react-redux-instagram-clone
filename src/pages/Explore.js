import React, { useRef, useCallback, useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import _ from "lodash";

import { makeStyles, useTheme } from "@material-ui/core/styles";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import CollectionsIcon from "@material-ui/icons/Collections";
import {
  GridListTileBar,
  useMediaQuery,
  CircularProgress,
  Typography,
  Container,
} from "@material-ui/core";

import SingleLoading from "../components/loading/SingleLoading";
import { getExplorePost } from "../functions/post";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    width: "100%",
    height: "auto",
    overflowY: "auto",
  },
  gridTile: {
    cursor: "pointer",
    "&:hover": {
      opacity: "0.9",
    },
    "& img": {
      width: "100%",
      height: "100%",
      objectFit: "cover",
    },
  },
  titleBar: {
    background: "transparent",
    marginRight: "5px",
  },
  icon: {
    color: "white",
  },
  gridTileTwoItem: {
    cursor: "default",

    "& img": {
      width: "100%",
      height: "100%",
      objectFit: "cover",
    },
  },
  gridTileTwoItemSmall: {
    height: "50%",
    position: "relative",
    "&:first-child": {
      paddingBottom: "4px",
    },
    "&:hover": {
      opacity: "0.9",
      cursor: "pointer",
    },
  },
}));

function Explore() {
  const [posts, setPosts] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);
  const [postLoading, setPostLoading] = useState(true);
  const [loadingPost, setLoadingPost] = useState(false);

  const auth = useSelector((state) => state.auth);
  const classes = useStyles();
  const theme = useTheme();
  const matchesSm = useMediaQuery(theme.breakpoints.down("sm"));
  const matchesXs = useMediaQuery(theme.breakpoints.down("xs"));
  const observer = useRef();
  const postsRef = useRef();
  const history = useHistory();

  useEffect(() => {
    postsRef.current = posts;
  }, [posts]);

  useEffect(() => {
    setLoadingPost(true);
    getExplorePost(auth.user._id, page, auth.token)
      .then((res) => {
        let newArr = [...postsRef.current, ...res.data];
        newArr = _.uniqBy(newArr, "_id");
        setPosts(newArr);
        setHasMore(res.data.length > 0);
        setLoadingPost(false);
        setPostLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoadingPost(false);
        setPostLoading(false);
      });
  }, [auth.user._id, auth.token, page]);

  const handleClickPost = (id) => {
    history.push(`/post/${id}`);
  };

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
    [loadingPost, hasMore, setPage]
  );

  if (postLoading) {
    return <SingleLoading pending={postLoading} />;
  }

  return (
    <Container maxWidth="md">
      <div className={classes.root}>
        <GridList
          cellHeight={matchesXs ? 130 : matchesSm ? 250 : 300}
          className={classes.gridList}
          cols={3}
        >
          {posts.length > 0 && (
            <GridListTile
              className={classes.gridTileTwoItem}
              style={{ cursor: "default" }}
              cols={1}
              rows={2}
            >
              <div
                onClick={() => handleClickPost(posts[0]._id)}
                className={classes.gridTileTwoItemSmall}
              >
                <img src={posts[0].images[0]?.url} alt="gird list" />
                {posts[0].images?.length > 1 && (
                  <GridListTileBar
                    className={classes.titleBar}
                    actionIcon={<CollectionsIcon className={classes.icon} />}
                    titlePosition="top"
                    actionPosition="right"
                  />
                )}
              </div>
              <div
                onClick={() => handleClickPost(posts[1]._id)}
                className={classes.gridTileTwoItemSmall}
              >
                <img src={posts[1].images[0]?.url} alt="gird list" />
                {posts[1].images?.length > 1 && (
                  <GridListTileBar
                    className={classes.titleBar}
                    actionIcon={<CollectionsIcon className={classes.icon} />}
                    titlePosition="top"
                    actionPosition="right"
                  />
                )}
              </div>
            </GridListTile>
          )}
          {posts.length > 0 && (
            <GridListTile
              component={Link}
              to={`/post/${posts[2]._id}`}
              className={classes.gridTile}
              cols={2}
              rows={2}
            >
              <img src={posts[2].images[0]?.url} alt="gird list" />
              {posts[2].images?.length > 1 && (
                <GridListTileBar
                  className={classes.titleBar}
                  actionIcon={<CollectionsIcon className={classes.icon} />}
                  titlePosition="top"
                  actionPosition="right"
                />
              )}
            </GridListTile>
          )}
          {posts.length > 0 ? (
            posts.slice(3).map((post, index) => {
              if (posts.length > 11 && posts.length - 3 === index + 1) {
                return (
                  <GridListTile
                    ref={lastPostElementRef}
                    component={Link}
                    to={`/post/${post._id}`}
                    className={classes.gridTile}
                    key={post._id}
                    cols={1}
                  >
                    <img src={post.images[0]?.url} alt="gird list" />
                    {post.images?.length > 1 && (
                      <GridListTileBar
                        className={classes.titleBar}
                        actionIcon={
                          <CollectionsIcon className={classes.icon} />
                        }
                        titlePosition="top"
                        actionPosition="right"
                      />
                    )}
                  </GridListTile>
                );
              }

              return (
                <GridListTile
                  component={Link}
                  to={`/post/${post._id}`}
                  className={classes.gridTile}
                  key={post._id}
                  cols={1}
                >
                  <img src={post.images[0]?.url} alt="gird list" />
                  {post.images?.length > 1 && (
                    <GridListTileBar
                      className={classes.titleBar}
                      actionIcon={<CollectionsIcon className={classes.icon} />}
                      titlePosition="top"
                      actionPosition="right"
                    />
                  )}
                </GridListTile>
              );
            })
          ) : (
            <Typography align="center" component="p">
              This User No Posts
            </Typography>
          )}
        </GridList>
        {loadingPost && (
          <div
            style={{ display: "flex", justifyContent: "center", marginTop: 50 }}
          >
            <CircularProgress size={25} />
          </div>
        )}
      </div>
    </Container>
  );
}

export default Explore;
