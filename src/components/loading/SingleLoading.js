import React from "react";

import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  singleLoad: {
    width: "100%",
    height: "50vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: theme.palette.primary.light,
  },
}));

function SingleLoading({ pending }) {
  const classes = useStyles();
  return (
    <div className={classes.singleLoad} open={pending}>
      <CircularProgress color="inherit" />
    </div>
  );
}

export default SingleLoading;
