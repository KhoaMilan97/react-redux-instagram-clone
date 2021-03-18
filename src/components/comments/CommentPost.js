import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import CircularProgress from "@material-ui/core/CircularProgress";

import CommentPostList from "./CommentPostList";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
}));

const CommentPost = React.forwardRef((props, ref) => {
  const { comments, status } = props;
  const classes = useStyles();

  return (
    <List className={classes.root} ref={ref}>
      {status === "loading" && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50%",
          }}
        >
          <CircularProgress />
        </div>
      )}
      {comments.length > 0 &&
        comments.map((comment) => (
          <CommentPostList key={comment._id} comment={comment} />
        ))}
    </List>
  );
});

export default CommentPost;
