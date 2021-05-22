import moment from "moment";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
// import GridListTileBar from "@material-ui/core/GridListTileBar";
// import CancelIcon from "@material-ui/icons/Cancel";
import { makeStyles } from "@material-ui/core/styles";
import DeleteIcon from "@material-ui/icons/Delete";
import Tooltip from "@material-ui/core/Tooltip";

import { deleteMessageAction } from "../../redux/actions/chatAction";
import ConfirmModal from "../modal/ConfirmModal";

const useStyles = makeStyles((theme) => ({
  messageRoot: {
    padding: "5px 10px",
    cursor: "pointer",
  },
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
    padding: "10px 0px",
    height: "auto",
  },
  icon: {
    color: "rgba(255, 255, 255, 0.54)",
  },
  titleBar: {
    background: "transparent",
  },
  deleteIcon: {
    display: "inline-block",
    verticalAlign: "middle",

    "&:hover": {
      cursor: "pointer",
    },
  },
}));

function MessageDisplay({ user, msg, yourMessage, data }) {
  const classes = useStyles(yourMessage);
  const [show, setShow] = useState(false);
  const { auth } = useSelector((state) => state);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const handleDelete = () => {
    dispatch(deleteMessageAction(msg, data, auth));
  };

  return (
    <Grid container className={classes.messageRoot}>
      <ConfirmModal
        open={open}
        setOpen={setOpen}
        handleRemovePost={handleDelete}
        title="Delete Message."
        subtitle="Are you sure you want delete this message?"
      />
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
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      >
        {show && auth.user._id === user._id && (
          <Tooltip title="Delete Messages?">
            <DeleteIcon
              onClick={() => setOpen(true)}
              className={classes.deleteIcon}
              color="secondary"
            />
          </Tooltip>
        )}
        {msg.text && (
          <>
            <Typography
              className={classes.messageText}
              style={{
                backgroundColor: yourMessage ? "#efefef" : "#fff",
              }}
            >
              {msg.text}
            </Typography>
          </>
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
                  <GridListTile
                    style={{ borderRadius: 3 }}
                    key={index}
                    cols={1}
                  >
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
