import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  List,
  Collapse,
  ListItem,
  FormControl,
  Input,
  InputAdornment,
  Button,
} from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";

import { createCommentAction } from "../../redux/actions/commentAction";
import EmojiIcon from "../EmojiIcon";

const useStyles = makeStyles((theme) => ({
  input: {
    padding: "0px",
  },
  send: {
    color: "#0095f6",
    fontSize: "14px",
    textTransform: "capitalize",
    "&:hover": {
      backgroundColor: "transparent",
    },
    "&:disabled": {
      color: "#0095f6",
      opacity: "0.4",
    },
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

function InputComment({ onReply, setOnReply, post, title }) {
  const [replyContent, setReplyContent] = useState("");
  const classes = useStyles();
  const dispatch = useDispatch();
  const { auth, socket } = useSelector((state) => state);

  const handleCreateReplyComment = () => {
    if (!replyContent.trim()) {
      if (setOnReply) return setOnReply(false);
      return;
    }
    const newComment = {
      user: auth.user,
      content: replyContent,
      post_id: post._id,
      likes: [],
      reply: onReply && onReply.commentId,
      tag: onReply && onReply.user,
      userPostId: post.postedBy._id,
    };

    dispatch(createCommentAction(post, newComment, auth, socket));

    setReplyContent("");
    if (setOnReply) return setOnReply(false);
  };

  return (
    <Collapse in={Boolean(onReply)} timeout="auto" unmountOnExit>
      <List component="div" disablePadding>
        <ListItem className={classes.nested}>
          <FormControl fullWidth>
            <Input
              type="text"
              style={{ marginTop: 5 }}
              disableUnderline
              className={classes.input}
              placeholder={title}
              autoFocus
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              startAdornment={
                <>
                  <EmojiIcon title={replyContent} setTitle={setReplyContent} />
                  <Link
                    to={`/${onReply?.user?.username}`}
                    style={{ marginRight: 5 }}
                  >
                    @{onReply?.user?.username}:
                  </Link>
                </>
              }
              endAdornment={
                <>
                  <InputAdornment style={{ marginLeft: 0 }} position="end">
                    <Button
                      className={classes.send}
                      disableRipple
                      onClick={handleCreateReplyComment}
                      style={{ paddingRight: 0 }}
                      disabled={!replyContent}
                    >
                      Post
                    </Button>
                  </InputAdornment>
                </>
              }
            />
          </FormControl>
        </ListItem>
      </List>
    </Collapse>
  );
}

export default InputComment;
