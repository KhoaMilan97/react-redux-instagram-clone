import React from "react";
import { useSelector } from "react-redux";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import { deleteAllNotifiesAction } from "../../redux/actions/notifyAction";

export default function NotifyModalConfirm({
  open,
  setOpen,
  dispatch,
  notifyUnRead,
}) {
  const handleClose = () => {
    setOpen(false);
  };
  const { token } = useSelector((state) => state.auth);

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Delete All Notifications
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            You have {notifyUnRead} unread notifies. Are you sure you want
            delete all?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              dispatch(deleteAllNotifiesAction(token));
              handleClose();
            }}
            color="secondary"
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
