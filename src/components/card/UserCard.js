import React from "react";
import { useHistory } from "react-router-dom";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import Badge from "@material-ui/core/Badge";
import { makeStyles, withStyles } from "@material-ui/core/styles";

import VideocamOffIcon from "@material-ui/icons/VideocamOff";
import PhoneCallbackIcon from "@material-ui/icons/PhoneCallback";
import VideocamIcon from "@material-ui/icons/Videocam";
import CallIcon from "@material-ui/icons/Call";

const StyledBadge = withStyles((theme) => ({
  badge: {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "$ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}))(Badge);

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    "& > *": {
      margin: theme.spacing(1),
    },
  },
}));

function UserCard(props) {
  const history = useHistory();
  const classes = useStyles();
  const { users, handleClose, link, handleAddUser, isActive, matchesXS } =
    props;

  const handleClick = (user) => {
    if (link) {
      history.push(`/${user.username}`);
      handleClose();
    } else {
      handleAddUser(user);
    }
  };

  const showText = (user) => {
    if (user.text)
      return user.text.length > 20
        ? `${user.text.substring(0, 20)}...`
        : user.text;
    if (user.media?.length > 0) {
      if (user.media?.length > 1)
        return `You sent ${user.media?.length} photos.`;
      return `You sent a photo.`;
    }
    if (user.call) {
      return user.call.times === 0 ? (
        user.call.video ? (
          <VideocamOffIcon fontSize="small" color="secondary" />
        ) : (
          <PhoneCallbackIcon fontSize="small" color="secondary" />
        )
      ) : user.call.video ? (
        <VideocamIcon fontSize="small" />
      ) : (
        <CallIcon fontSize="small" />
      );
    }
    return user.fullname;
  };

  return (
    <List component="nav" aria-label="main mailbox folders">
      {users.map((user) => (
        <ListItem
          style={{
            backgroundColor: isActive
              ? isActive(user)
                ? "#efefef"
                : "#fff"
              : "#fff",
          }}
          onClick={() => handleClick(user)}
          key={user._id}
          button
        >
          <ListItemIcon>
            {user.avatar?.url ? (
              <div className={classes.root}>
                {user.online ? (
                  <StyledBadge
                    overlap="circle"
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                    variant="dot"
                  >
                    <Avatar alt="profile picture" src={user.avatar?.url} />
                  </StyledBadge>
                ) : (
                  <Avatar alt="profile picture" src={user.avatar?.url} />
                )}
              </div>
            ) : (
              <Avatar alt="profile picture" />
            )}
          </ListItemIcon>
          {!matchesXS && (
            <ListItemText
              style={{ textOverflow: "ellipsis" }}
              primary={user.username}
              secondary={showText(user)}
            />
          )}
        </ListItem>
      ))}
    </List>
  );
}

export default UserCard;
