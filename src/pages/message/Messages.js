import React from "react";

import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import SearchUser from "../../components/message/SearchUser";
import bgMessenger from "../../assets/img/messenger.png";

const useStyles = makeStyles((theme) => ({
  root: {
    border: "1px solid #dbdbdb",
    backgroundColor: "#fff",
    borderRadius: "5px",
  },
  leftSide: {
    borderRight: "1px solid #dbdbdb",
  },
  rightSide: {
    height: "500px",
  },
}));

function Messages() {
  const classes = useStyles();
  const theme = useTheme();
  const matchesXS = useMediaQuery(theme.breakpoints.down("xs"));

  return (
    <Container maxWidth="md">
      <Grid className={classes.root} container>
        <Grid className={classes.leftSide} item xs={matchesXS ? 3 : 4}>
          <SearchUser />
        </Grid>
        <Grid
          className={classes.rightSide}
          alignItems="center"
          justify="center"
          container
          item
          xs={matchesXS ? 9 : 8}
        >
          <img
            style={{ width: "200px", height: "auto" }}
            src={bgMessenger}
            alt="background messenger"
          />
        </Grid>
      </Grid>
    </Container>
  );
}

export default Messages;
