import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { Avatar, Grid, Paper, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import PostModal from "../modal/PostModal";

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
  const [open, setOpen] = React.useState(false);

  const auth = useSelector((state) => state.auth);
  const classes = useStyles();

  const handleClickOpen = () => {
    setOpen(true);
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
      <PostModal open={open} setOpen={setOpen} />
    </Paper>
  );
}

export default CreatePostForm;
