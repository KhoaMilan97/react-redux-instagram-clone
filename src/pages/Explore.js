import React, { useRef, useCallback, useState } from "react";
import { Link } from "react-router-dom";

import { makeStyles, useTheme } from "@material-ui/core/styles";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import CollectionsIcon from "@material-ui/icons/Collections";
import {
  GridListTileBar,
  useMediaQuery,
  CircularProgress,
  Typography,
} from "@material-ui/core";

import SingleLoading from "../components/loading/SingleLoading";

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
    // minHeight: "100vh",
    overflowY: "auto",
  },
  gridTile: {
    cursor: "pointer",
    // minHeight: "300px",
    // [theme.breakpoints.down("sm")]: {
    //   minHeight: "250px",
    // },
    // [theme.breakpoints.down("xs")]: {
    //   minHeight: "130px",
    // },
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
  },
  icon: {
    color: "white",
  },
}));

function Explore() {
  const [posts, setPosts] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);
  const [postLoading, setPostLoading] = useState(true);
  const [loadingPost, setLoadingPost] = useState(false);

  const classes = useStyles();
  const theme = useTheme();
  const matchesSm = useMediaQuery(theme.breakpoints.down("sm"));
  const matchesXs = useMediaQuery(theme.breakpoints.down("xs"));
  const observer = useRef();

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
    <div className={classes.root}>
      <GridList
        cellHeight={matchesXs ? 130 : matchesSm ? 250 : 300}
        className={classes.gridList}
        cols={3}
      >
        {posts.length > 0 ? (
          posts.map((post, index) => {
            if (posts.length > 11 && posts.length === index + 1) {
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
                      actionIcon={<CollectionsIcon className={classes.icon} />}
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
  );
}

export default Explore;
