import React, { useEffect } from "react";
import moment from "moment";

import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import CancelIcon from "@material-ui/icons/Cancel";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  time: {
    color: "#8e8e8e",
    fontSize: "12px",
    fontWeight: 400,
    marginTop: "5px",
    marginRight: "10px",
  },
  avatar: {
    width: 24,
    height: 24,
    marginLeft: 5,
  },
  messageText: {
    border: "1px solid #eee",
    borderRadius: 22,
    padding: 16,
    display: "inline-block",
    overflowWrap: "break-word",
    width: "auto",
    maxWidth: "100%",
    textAlign: "left",
  },
  preview: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    width: "100%",
    padding: "10px 15px",
    height: "auto",
  },
  icon: {
    color: "rgba(255, 255, 255, 0.54)",
  },
  titleBar: {
    background: "transparent",
  },
}));

function MessageDisplay({ user, msg, yourMessage }) {
  const classes = useStyles(yourMessage);

  return (
    <Grid
      container
      style={{
        padding: "20px 10px",
      }}
    >
      {!yourMessage && (
        <Grid
          item
          xs={2}
          style={{ alignSelf: "flex-end", marginBottom: "20px" }}
        >
          <Avatar src={user?.avatar?.url} className={classes.avatar} />
        </Grid>
      )}

      <Grid
        style={{ textAlign: yourMessage === true ? "right" : "left" }}
        item
        xs={yourMessage ? 12 : 10}
      >
        {msg.text && (
          <Typography
            className={classes.messageText}
            style={{
              backgroundColor: yourMessage ? "#efefef" : "#fff",
            }}
          >
            {msg.text}
          </Typography>
        )}
        {msg.media.length > 0 && (
          <>
            <div className={classes.preview}>
              <GridList
                cellHeight={msg.media.length === 1 ? 400 : 200}
                className={classes.gridList}
                cols={msg.media.length > 2 ? 3 : msg.media.length > 1 ? 2 : 1}
              >
                {msg.media.map((image, index) => (
                  <GridListTile key={index} cols={1}>
                    <img
                      src={
                        image.camera
                          ? image.camera
                          : image.url
                          ? image.url
                          : URL.createObjectURL(image)
                      }
                      alt="Preview"
                    />
                    {/* <GridListTileBar
                      className={classes.titleBar}
                      titlePosition="top"
                      actionIcon={
                        <IconButton
                          onClick={() => handleRemoveImage(index)}
                          className={classes.icon}
                        >
                          <CancelIcon />
                        </IconButton>
                      }
                      actionPosition="right"
                    /> */}
                  </GridListTile>
                ))}
              </GridList>
            </div>
          </>
        )}
        <Typography className={classes.time}>
          {moment(msg.createdAt).fromNow()}
        </Typography>
      </Grid>
    </Grid>
  );
}

export default MessageDisplay;
