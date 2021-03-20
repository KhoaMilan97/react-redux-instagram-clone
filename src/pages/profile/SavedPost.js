import React from "react";
import { Link } from "react-router-dom";

import { makeStyles, useTheme } from "@material-ui/core/styles";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import CollectionsIcon from "@material-ui/icons/Collections";
import { GridListTileBar, useMediaQuery } from "@material-ui/core";

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

  return (
    <div className={classes.root}>
      <GridList
        cellHeight={matchesXs ? 130 : matchesSm ? 250 : 300}
        className={classes.gridList}
        cols={3}
      >
        {user.saved.length > 0 &&
          user.saved.map((post, index) => {
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
    </div>
  );
}
