import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import CollectionsIcon from "@material-ui/icons/Collections";
import { GridListTileBar } from "@material-ui/core";

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
      minHeight: "200px",
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

let tileData = [
  {
    img:
      "https://res.cloudinary.com/khoa-milan/image/upload/v1613726025/152080731_321119076319698_8940594879176684497_n_pdnspp.jpg",
  },
  {
    img:
      "https://res.cloudinary.com/khoa-milan/image/upload/v1613726025/caokyduyen_hy4cws.jpg",
  },
  {
    img:
      "https://res.cloudinary.com/khoa-milan/image/upload/v1613622766/x6dgcmmkgtylcncw3iqa.jpg",
  },
];

export default function PostGallerry() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <GridList className={classes.gridList} cols={3}>
        {tileData.map((tile) => (
          <GridListTile className={classes.gridTile} key={tile.img} cols={1}>
            <img src={tile.img} alt="gird list" />
            <GridListTileBar
              className={classes.titleBar}
              actionIcon={<CollectionsIcon className={classes.icon} />}
              titlePosition="top"
              actionPosition="right"
            />
          </GridListTile>
        ))}
      </GridList>
    </div>
  );
}
