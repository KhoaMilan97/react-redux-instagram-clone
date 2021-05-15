import React from "react";
import PropTypes from "prop-types";
import {
  EmailShareButton,
  EmailIcon,
  FacebookShareButton,
  FacebookIcon,
  RedditShareButton,
  RedditIcon,
  TwitterShareButton,
  TwitterIcon,
  WhatsappShareButton,
  WhatsappIcon,
  TelegramShareButton,
  TelegramIcon,
} from "react-share";

import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Dialog from "@material-ui/core/Dialog";

import ListItemIcon from "@material-ui/core/ListItemIcon";

const useStyles1 = makeStyles((theme) => ({
  shareButton: {
    marginBottom: "15px",
  },
}));

function ConfirmationDialogRaw(props) {
  const { onClose, open, url, ...other } = props;
  const classes = useStyles1();

  const handleCancel = () => {
    onClose();
  };

  return (
    <Dialog
      disableEscapeKeyDown
      maxWidth="xs"
      aria-labelledby="confirmation-dialog-title"
      open={open}
      onClose={onClose}
      {...other}
    >
      <DialogTitle
        style={{ textAlign: "center" }}
        id="confirmation-dialog-title"
      >
        Share to...
      </DialogTitle>
      <DialogContent dividers>
        <List>
          <ListItem
            className={classes.shareButton}
            component={FacebookShareButton}
            url={url}
          >
            <ListItemIcon>
              <FacebookIcon round={true} size={32} />
            </ListItemIcon>
            <ListItemText primary="Share to Facebook" />
          </ListItem>
          <ListItem
            className={classes.shareButton}
            component={EmailShareButton}
            url={url}
          >
            <ListItemIcon>
              <EmailIcon round={true} size={32} />
            </ListItemIcon>
            <ListItemText primary="Share via Email" />
          </ListItem>

          <ListItem
            className={classes.shareButton}
            component={RedditShareButton}
            url={url}
          >
            <ListItemIcon>
              <RedditIcon round={true} size={32} />
            </ListItemIcon>
            <ListItemText primary="Share to Reddit" />
          </ListItem>
          <ListItem
            className={classes.shareButton}
            component={TwitterShareButton}
            url={url}
          >
            <ListItemIcon>
              <TwitterIcon round={true} size={32} />
            </ListItemIcon>
            <ListItemText primary="Share to Twitter" />
          </ListItem>
          <ListItem
            className={classes.shareButton}
            component={WhatsappShareButton}
            url={url}
          >
            <ListItemIcon>
              <WhatsappIcon round={true} size={32} />
            </ListItemIcon>
            <ListItemText primary="Share to Whatsapp" />
          </ListItem>
          <ListItem
            className={classes.shareButton}
            component={TelegramShareButton}
            url={url}
          >
            <ListItemIcon>
              <TelegramIcon round={true} size={32} />
            </ListItemIcon>
            <ListItemText primary="Share to Telegram" />
          </ListItem>
        </List>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleCancel} color="primary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}

ConfirmationDialogRaw.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

const useStyles = makeStyles((theme) => ({
  paper: {
    width: "80%",
    maxHeight: 435,
  },
}));

export default function ShareModal({ open, setOpen, url }) {
  const classes = useStyles();

  const handleClose = (newValue) => {
    setOpen(false);
  };

  return (
    <ConfirmationDialogRaw
      classes={{
        paper: classes.paper,
      }}
      id="ringtone-menu"
      //keepMounted
      open={open}
      onClose={handleClose}
      url={url}
    />
  );
}
