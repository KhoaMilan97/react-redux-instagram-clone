import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Dialog from "@material-ui/core/Dialog";
import Divider from "@material-ui/core/Divider";
import { ListItemText } from "@material-ui/core";

const useStyles = makeStyles({
  avatar: {
    width: "90px !important",
    height: "90px !important",
  },
  unFollow: {
    color: "#ed4956",
    fontWeight: 600,
    "& span": {
      fontWeight: 600,
      fontSize: 14,
    },
  },
});

function SimpleDialog(props) {
  const classes = useStyles();
  const { onClose, open, user, handleUnFollowAction } = props;

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="simple-dialog-title"
      open={open}
      maxWidth="xs"
      fullWidth={true}
    >
      <List>
        <ListItem
          button
          style={{ justifyContent: "center" }}
          onClick={() => handleClose()}
        >
          <Avatar
            className={classes.avatar}
            src={user.avatar?.url}
            alt="avatar"
          />
        </ListItem>
        <ListItem onClick={() => handleClose()}>
          <ListItemText align="center">Unfollow {user.username}?</ListItemText>
        </ListItem>
        <Divider />
        <ListItem
          button
          onClick={() => {
            handleClose();
            handleUnFollowAction();
          }}
        >
          <ListItemText className={classes.unFollow} align="center">
            UnFollow
          </ListItemText>
        </ListItem>
        <Divider />
        <ListItem button onClick={() => handleClose()}>
          <ListItemText align="center">Cancel</ListItemText>
        </ListItem>
      </List>
    </Dialog>
  );
}

export default function FollowModal({
  open,
  setOpen,
  user,
  handleUnFollowAction,
}) {
  const handleClose = (value) => {
    setOpen(false);
  };

  return (
    <div>
      <SimpleDialog
        user={user}
        open={open}
        onClose={handleClose}
        handleUnFollowAction={handleUnFollowAction}
      />
    </div>
  );
}
