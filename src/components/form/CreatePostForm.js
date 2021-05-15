import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { Avatar, Grid, Paper, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import PostModal from "../modal/PostModal";
import { actionTypes } from "../../redux/actions/actionType";

const useStyles = makeStyles((theme) => ({
  button: {
    borderRadius: 20,
    backgroundColor: "rgb(240, 242, 245)",
    borderWidth: 0,
    textAlign: "left",
    "& span": {
      justifyContent: "left",
      textTransform: "none",
      color: "rgb(101, 103, 107)",
      fontSize: "17px",
      fontWeight: "normal",
    },
    "&:hover": {
      backgroundColor: "#E4E6E9",
    },
  },
}));

function CreatePostForm() {
  const { auth, postReducer } = useSelector((state) => state);
  const classes = useStyles();
  const dispatch = useDispatch();

  const handleClickOpen = () => {
    dispatch({
      type: actionTypes.POST_MODAL,
      payload: true,
    });
  };

  return (
    <Paper variant="outlined" style={{ marginBottom: "30px", padding: "10px" }}>
      <Grid container alignItems="center">
        <Grid item>
          <Avatar
            component={Link}
            to={`/${auth.user.username}`}
            src={auth.user.avatar?.url}
          />
        </Grid>
        <Grid item style={{ flex: "1", marginLeft: "10px" }}>
          <Button
            onClick={handleClickOpen}
            className={classes.button}
            fullWidth
            variant="outlined"
          >
            What's on your mind?
          </Button>
        </Grid>
      </Grid>
      <PostModal open={postReducer.open} />
    </Paper>
  );
}

export default CreatePostForm;
