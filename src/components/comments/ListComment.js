import React, { useEffect, useState } from "react";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import { makeStyles } from "@material-ui/core/styles";
import Collapse from "@material-ui/core/Collapse";

import CommentItem from "./CommentItem";

const useStyles = makeStyles((theme) => ({
  link: {
    color: "#8e8e8e",
    fontSize: "14px",
    marginTop: "10px",
    "&:hover": {
      cursor: "pointer",
    },
  },
  replyButon: {
    paddingLeft: theme.spacing(4),
    color: "#8e8e8e",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer",
  },
}));

function ListComment({ comment, post, replyCmt }) {
  const classes = useStyles();
  const [showReplyComments, setShowReplyComments] = useState([]);
  const [nextRep, setNextRep] = useState(1);

  useEffect(() => {
    let nextArr = replyCmt.length - nextRep;
    if (replyCmt.length < nextRep) {
      nextArr = 0;
    }
    setShowReplyComments(replyCmt.slice(nextArr));
  }, [replyCmt, nextRep]);

  return (
    <List component="div">
      <CommentItem comment={comment} post={post}>
        {replyCmt.length - nextRep > 0 ? (
          <Typography
            onClick={() => setNextRep(nextRep + 2)}
            className={classes.replyButon}
          >
            &#8212;&#8212;{" "}
            {nextRep === 0
              ? `${replyCmt.length} Replies`
              : `View ${
                  replyCmt.length - showReplyComments.length
                }  more replies`}
          </Typography>
        ) : (
          replyCmt.length > 1 && (
            <Typography
              onClick={() => {
                setNextRep(1);
              }}
              className={classes.replyButon}
            >
              &#8212;&#8212; Hide replies
            </Typography>
          )
        )}
        <Collapse
          in={Boolean(showReplyComments.length)}
          timeout="auto"
          unmountOnExit
        >
          {showReplyComments.map((item, index) => (
            <CommentItem
              key={item._id ? item._id : index}
              comment={item}
              post={post}
              nested={true}
            />
          ))}
        </Collapse>
      </CommentItem>
    </List>
  );
}

export default ListComment;
