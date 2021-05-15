import React from "react";

import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import SearchUser from "../../components/message/SearchUser";

import bgMessenger from "../../assets/img/messenger.png";
import RightSide from "../../components/message/RightSide";

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

function Inbox() {
  const classes = useStyles();
  const theme = useTheme();
  const matchesXS = useMediaQuery(theme.breakpoints.down("xs"));

  return (
    <Container maxWidth="md">
      <Grid className={classes.root} container>
        <Grid className={classes.leftSide} item xs={matchesXS ? 3 : 4}>
          <SearchUser />
        </Grid>
        <Grid className={classes.rightSide} item xs={matchesXS ? 9 : 8}>
          <RightSide />
        </Grid>
      </Grid>
    </Container>
  );
}

export default Inbox;
