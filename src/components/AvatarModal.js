import React from "react";

import { useSelector, useDispatch } from "react-redux";

import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";

import { blue } from "@material-ui/core/colors";
import { Divider } from "@material-ui/core";

import UploadAvatar from "./form/UploadAvatar";
import { removeAvatars } from "../functions/upload";
import { actionTypes } from "../redux/actions/actionType";

const useStyles = makeStyles({
  avatar: {
    backgroundColor: blue[100],
    color: blue[600],
  },

  remove: {
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
  const { onClose, open, setImageLoading } = props;

  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleClose = () => {
    onClose();
  };

  const handleRemoveAvatar = () => {
    setImageLoading(true);
    removeAvatars({ public_id: user.avatar.public_id, userid: user._id }, token)
      .then((res) => {
        console.log(res);
        dispatch({
          type: actionTypes.UPDATE_USER,
          payload: res.data,
        });
        setImageLoading(false);
      })
      .catch((err) => {
        setImageLoading(false);
      });
    onClose();
  };

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="simple-dialog-title"
      open={open}
    >
      <DialogTitle id="simple-dialog-title">Change Profile Photo</DialogTitle>
      <Divider />
      <List>
        <ListItem button>
          <UploadAvatar center="center" setImageLoading={setImageLoading} />
        </ListItem>
        <Divider />
        <ListItem button onClick={handleRemoveAvatar}>
          <ListItemText
            className={classes.remove}
            align="center"
            primary="Remove Current Photo"
          />
        </ListItem>
        <Divider />

        <ListItem autoFocus button onClick={() => handleClose()}>
          <ListItemText align="center" primary="Cancel" />
        </ListItem>
      </List>
    </Dialog>
  );
}

export default function AvatarModal({ setImageLoading }) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button
        style={{
          marginLeft: 0,
          padding: 0,
          color: "#0095f6",
          textTransform: "capitalize",
          fontWeight: 600,
        }}
        color="primary"
        onClick={handleClickOpen}
      >
        Change Profile Photo
      </Button>
      <SimpleDialog
        setImageLoading={setImageLoading}
        open={open}
        onClose={handleClose}
      />
    </div>
  );
}
