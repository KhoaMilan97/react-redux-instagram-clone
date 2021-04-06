import React from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  toolBarMargin: {
    ...theme.mixins.toolbar,
    marginTop: "20px",
  },
}));

function ToolBarMargin() {
  const classes = useStyles();
  return <div className={classes.toolBarMargin} />;
}

export default ToolBarMargin;
