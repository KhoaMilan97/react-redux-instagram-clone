import React from "react";
import { useDispatch, useSelector } from "react-redux";

import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MoreVertIcon from "@material-ui/icons/MoreVert";

import { removeCommentAction } from "../../redux/actions/commentAction";

export default function CommentMenu({ post, user, comment, setOnEdit }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const dispatch = useDispatch();
  const { auth, socket } = useSelector((state) => state);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleRemove = () => {
    if (post.postedBy._id === user._id || comment.user._id === user._id) {
      dispatch(removeCommentAction({ post, comment }, auth, socket));
    }

    handleClose();
  };

  return (
    <div>
      <IconButton
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {comment.user?._id === user._id && (
          <MenuItem
            onClick={() => {
              setOnEdit(true);
              handleClose();
            }}
          >
            Edit
          </MenuItem>
        )}
        {post.postedBy._id === user._id || comment.user._id === user._id ? (
          <MenuItem onClick={handleRemove}>Remove</MenuItem>
        ) : (
          <MenuItem onClick={handleClose}>Hide</MenuItem>
        )}
      </Menu>
    </div>
  );
}
