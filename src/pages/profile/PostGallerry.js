import React from "react";
import { Link } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import CollectionsIcon from "@material-ui/icons/Collections";
import { GridListTileBar, Typography } from "@material-ui/core";

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
    minHeight: "100vh",
    overflowY: "auto",
  },
  gridTile: {
    minHeight: "300px",
    cursor: "pointer",

    [theme.breakpoints.down("sm")]: {
      minHeight: "250px",
    },
    [theme.breakpoints.down("xs")]: {
      minHeight: "130px",
    },
    "&:hover": {
      opacity: "0.9",
    },

    "& img": {
      width: "100%",
      height: "auto",
    },
  },
  titleBar: {
    background: "transparent",
  },
  icon: {
    color: "white",
  },
}));

export default function PostGallerry({ posts }) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <GridList className={classes.gridList} cols={3}>
        {posts.length > 0 &&
          posts.map((post) => (
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
          ))}
      </GridList>
    </div>
  );
}
