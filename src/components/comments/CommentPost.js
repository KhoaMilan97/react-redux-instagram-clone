import React, { useState, useEffect } from "react";

import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";

import ListComment from "./ListComment";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
  link: {
    color: "#8e8e8e",
    fontSize: "14px",
    marginTop: "10px",
    "&:hover": {
      cursor: "pointer",
    },
  },
}));

const CommentPost = React.forwardRef((props, ref) => {
  const classes = useStyles();
  const [comments, setComments] = useState([]);
  const [replyComments, setReplyComments] = useState([]);
  const [showComments, setShowComments] = useState([]);

  const [next, setNext] = useState(2);

  useEffect(() => {
    const newComment = props.comments.filter((comment) => !comment.reply);
    setComments(newComment);
    let nextArr = newComment.length - next;
    if (newComment.length < next) {
      nextArr = 0;
    }
    setShowComments(newComment.slice(nextArr));
  }, [props.comments, next]);

  useEffect(() => {
    const newReply = props.comments.filter((comment) => comment.reply);
    setReplyComments(newReply);
  }, [props.comments]);

  return (
    <List className={classes.root} ref={ref}>
      {props.status === "loading" && (
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
      {showComments.length > 0 &&
        showComments.map((comment, index) => (
          <ListComment
            key={comment._id ? comment._id : index}
            comment={comment}
            post={props.post}
            replyCmt={replyComments.filter((cmt) => cmt.reply === comment._id)}
          />
        ))}

      {comments.length - next > 0 ? (
        <Typography className={classes.link} onClick={() => setNext(next + 5)}>
          View more comments
        </Typography>
      ) : (
        comments.length > 2 && (
          <Typography className={classes.link} onClick={() => setNext(2)}>
            Hide comments
          </Typography>
        )
      )}
    </List>
  );
});

export default CommentPost;
