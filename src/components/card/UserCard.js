import React from "react";
import { useHistory } from "react-router-dom";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";

function UserCard(props) {
  const history = useHistory();
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
              <Avatar alt="profile picture" src={user.avatar?.url} />
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
