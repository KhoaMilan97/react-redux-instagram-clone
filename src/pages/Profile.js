import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";

import Avatar from "@material-ui/core/Avatar";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Paper from "@material-ui/core/Paper";
import ViewComfyIcon from "@material-ui/icons/ViewComfy";
import MovieIcon from "@material-ui/icons/Movie";
import BookmarkBorderOutlinedIcon from "@material-ui/icons/BookmarkBorderOutlined";
import LocalOfferIcon from "@material-ui/icons/LocalOffer";

import NotFound from "../pages/NotFound";

const useStyles = makeStyles((theme) => ({
  avatar: {
    width: 150,
    height: 150,
  },
  root: {
    flexGrow: 1,
    backgroundColor: "#fafafa",
  },
  tab: {
    color: "#8e8e8e",
  },
}));

function Profile() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const { username } = useParams();
  const { user } = useSelector((state) => state.user);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  if (user.username !== username) {
    return <NotFound />;
  }

  return (
    <Container maxWidth="md">
      <Grid container>
        <Grid item container md={4} justify="center">
          <Avatar
            className={classes.avatar}
            src={user.avatar.url}
            alt="profile picture"
          />
        </Grid>
        <Grid item md={4}>
          <Typography>
            {user.username}{" "}
            <Button
              component={Link}
              to="/accounts/edit"
              variant="outlined"
              style={{ marginLeft: 10 }}
            >
              Edit Profile
            </Button>
          </Typography>

          <Grid container justify="space-between" style={{ marginTop: 10 }}>
            <Grid item>
              <Typography>0 posts</Typography>
            </Grid>
            <Grid item>
              <Typography>0 followers</Typography>
            </Grid>
            <Grid item>
              <Typography>0 following</Typography>
            </Grid>
          </Grid>
          <Typography>{user.fullname}</Typography>
        </Grid>
      </Grid>
      <Grid container style={{ marginTop: 30 }}>
        <Paper className={classes.root}>
          <Tabs
            value={value}
            onChange={handleChange}
            indicatorColor="primary"
            textColor="primary"
            centered
          >
            <Tab
              className={classes.tab}
              label={
                <div>
                  <ViewComfyIcon
                    style={{ verticalAlign: "middle", fontSize: 16 }}
                  />{" "}
                  Post{" "}
                </div>
              }
            />

            <Tab
              label={
                <div>
                  <MovieIcon
                    style={{ verticalAlign: "middle", fontSize: 16 }}
                  />{" "}
                  IGTV{" "}
                </div>
              }
            />
            <Tab
              label={
                <div>
                  <BookmarkBorderOutlinedIcon
                    style={{ verticalAlign: "middle", fontSize: 16 }}
                  />{" "}
                  Saved{" "}
                </div>
              }
            />
            <Tab
              label={
                <div>
                  <LocalOfferIcon
                    style={{ verticalAlign: "middle", fontSize: 16 }}
                  />{" "}
                  Tagged{" "}
                </div>
              }
            />
          </Tabs>
        </Paper>
      </Grid>
    </Container>
  );
}

export default Profile;
