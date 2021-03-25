import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { CopyToClipboard } from "react-copy-to-clipboard";

import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Dialog from "@material-ui/core/Dialog";
import Divider from "@material-ui/core/Divider";
import { ListItemText } from "@material-ui/core";

import { setMessage } from "../../redux/actions/messageAction";

const useStyles = makeStyles({
  red: {
    color: "#ed4956",
    fontWeight: 600,
    "& span": {
      fontWeight: 600,
      fontSize: 14,
    },
  },
  link: {
    cursor: "pointer",
  },
});

function SimpleDialog(props) {
  const [copied, setCopied] = useState(false);

  const classes = useStyles();
  const { onClose, open, user, post } = props;
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  let url = window.location.href;
  url = `${url}post/${post._id}`;

  const handleClose = () => {
    onClose();
  };

  useEffect(() => {
    if (copied === true) {
      dispatch(setMessage("Link copied to clipboard.", "info"));
    }
  }, [copied, dispatch]);

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
          className={classes.link}
          component={Link}
          button
          to={`/post/${post._id}`}
          onClick={() => handleClose()}
        >
          <ListItemText align="center">Go to post</ListItemText>
        </ListItem>
        <Divider />
        {auth.user._id === user._id && (
          <>
            <ListItem
              component={Link}
              className={classes.link}
              to={`/post/edit/${post._id}`}
              onClick={() => handleClose()}
            >
              <ListItemText align="center">Edit post</ListItemText>
            </ListItem>
            <Divider />
          </>
        )}

        <ListItem
          button
          onClick={() => {
            handleClose();
          }}
        >
          <CopyToClipboard text={url} onCopy={() => setCopied(true)}>
            <ListItemText className={classes.red} align="center">
              Coppy Link
            </ListItemText>
          </CopyToClipboard>
        </ListItem>
        <Divider />
        <ListItem button onClick={() => handleClose()}>
          <ListItemText align="center">Cancel</ListItemText>
        </ListItem>
      </List>
    </Dialog>
  );
}

export default function CardModal({ open, setOpen, user, post }) {
  const handleClose = (value) => {
    setOpen(false);
  };

  return (
    <div>
      <SimpleDialog user={user} open={open} post={post} onClose={handleClose} />
    </div>
  );
}
