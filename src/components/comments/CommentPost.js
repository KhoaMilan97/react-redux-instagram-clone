import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";

import CommentPostList from "./CommentPostList";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function CommentPost({ comments, handleFocus, setReplyCmnt }) {
  const classes = useStyles();

  return (
    <List className={classes.root}>
      {comments.length > 0 &&
        comments.map((comment) => (
          <CommentPostList
            key={comment._id}
            comment={comment}
            handleFocus={handleFocus}
            setReplyCmnt={setReplyCmnt}
          />
        ))}
    </List>
  );
}
