import React from "react";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import IconButton from "@material-ui/core/IconButton";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import Box from "@material-ui/core/Box";

function CommentHomeCard({ comment }) {
  return (
    <>
      <List style={{ paddingTop: 0, paddingBottom: 0 }}>
        <ListItem style={{ paddingTop: 0, paddingBottom: 0 }} disableGutters>
          <Box textAlign="right" style={{ paddingRight: 5, fontSize: "14px" }}>
            {comment.user.username}
          </Box>
          <ListItemText
            secondaryTypographyProps={{ align: "left" }}
            secondary={comment.content}
            style={{ marginTop: 0, marginBottom: 0 }}
          />

          <ListItemSecondaryAction>
            <IconButton style={{ padding: "0" }} edge="end" aria-label="delete">
              <FavoriteBorderIcon fontSize="small" />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      </List>
    </>
  );
}

export default CommentHomeCard;
