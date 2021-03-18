import React from "react";

import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import Skeleton from "@material-ui/lab/Skeleton";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import { Card, CardContent, CardHeader, Divider } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  skeletonImg: {
    width: "100%",
    height: "90vh",
  },
}));

function PostDetailSkeleton() {
  const classes = useStyles();

  return (
    <Container maxWidth="md">
      <Grid
        container
        component={Paper}
        variant="outlined"
        alignItems="stretch"
        square
      >
        <Grid item container md={7}>
          <Skeleton variant="rect" className={classes.skeletonImg} />
        </Grid>
        <Grid item container direction="column" md={5}>
          <Card
            variant="outlined"
            style={{
              height: "100%",
              borderRadius: 0,
              borderWidth: 0,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <CardHeader
              avatar={
                <Skeleton
                  animation="wave"
                  variant="circle"
                  width={40}
                  height={40}
                />
              }
              title={
                <Skeleton
                  animation="wave"
                  height={10}
                  width="80%"
                  style={{ marginBottom: 6 }}
                />
              }
              subheader={<Skeleton animation="wave" height={10} width="40%" />}
            />
            <Divider />
            <CardContent style={{ flex: 1 }} />
            <Divider />
            <div style={{ padding: "5px 14px" }}>
              <Skeleton
                animation="wave"
                height={20}
                width="90%"
                style={{ marginBottom: 6 }}
              />
              <Skeleton animation="wave" height={20} width="50%" />
            </div>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default PostDetailSkeleton;
