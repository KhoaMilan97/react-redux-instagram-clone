import React from "react";

import List from "@material-ui/core/List";

import ListCommentHomeCard from "./ListCommentHomeCard";

function CommentHomeCard({ comments }) {
  return (
    <>
      <List style={{ paddingTop: 0, paddingBottom: 0 }}>
        {comments.slice(0, 2).map((comment) => (
          <ListCommentHomeCard key={comment._id} comment={comment} />
        ))}
      </List>
    </>
  );
}

export default CommentHomeCard;
