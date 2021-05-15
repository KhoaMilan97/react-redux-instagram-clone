import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import { makeStyles, useTheme } from "@material-ui/core/styles";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import CollectionsIcon from "@material-ui/icons/Collections";
import { GridListTileBar, Typography, useMediaQuery } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";

import { getSavedPosts } from "../../functions/user";

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

export default function SavedPost({ user }) {
  const classes = useStyles();
  const theme = useTheme();
  const matchesSm = useMediaQuery(theme.breakpoints.down("sm"));
  const matchesXs = useMediaQuery(theme.breakpoints.down("xs"));
  const [savedPosts, setSavedPosts] = useState(0);
  const auth = useSelector((state) => state.auth);
  const [loadingPost, setLoadingPost] = useState(false);

  const { username } = useParams();

  useEffect(() => {
    let cancel = false;
    setLoadingPost(true);
    getSavedPosts(username, auth.token)
      .then((res) => {
        if (!cancel) {
          setSavedPosts(res.data.posts);
          setLoadingPost(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setLoadingPost(false);
      });
    return () => {
      cancel = true;
    };
  }, [username, auth.token]);

  return (
    <div className={classes.root}>
      {loadingPost && (
        <div
          style={{ display: "flex", justifyContent: "center", marginTop: 50 }}
        >
          <CircularProgress size={25} />
        </div>
      )}
      <GridList
        cellHeight={matchesXs ? 130 : matchesSm ? 250 : 300}
        className={classes.gridList}
        cols={3}
      >
        {savedPosts.length > 0 &&
          !loadingPost &&
          savedPosts.map((post, index) => {
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
          })}
      </GridList>
      {savedPosts.length === 0 && !loadingPost && (
        <Typography>No Saved Post</Typography>
      )}
    </div>
  );
}
