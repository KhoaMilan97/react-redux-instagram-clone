import React from "react";

import { withStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";

import ListItemFollow from "../ListItemFollow";

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;

  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

export default function ListFollowModal({ open, setOpen, title, list }) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("xs"));

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        fullWidth
        maxWidth="xs"
        fullScreen={fullScreen}
      >
        <DialogTitle
          align="center"
          id="customized-dialog-title"
          onClose={handleClose}
        >
          {title}
        </DialogTitle>
        <DialogContent dividers>
          <List>
            {list.length > 0 ? (
              list.map((user) => (
                <ListItemFollow
                  key={user._id}
                  userFollow={user}
                  handleClose={handleClose}
                />
              ))
            ) : title === "Followers" ? (
              <Typography align="center">
                You'll see all the people who follow you here.
              </Typography>
            ) : (
              <Typography align="center">
                You'll see all the people you follow here.
              </Typography>
            )}
          </List>
        </DialogContent>
      </Dialog>
    </div>
  );
}
