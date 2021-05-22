import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import { makeStyles } from "@material-ui/core/styles";
import { Divider, Tooltip } from "@material-ui/core";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import IconButton from "@material-ui/core/IconButton";
import Grid from "@material-ui/core/Grid";
import Input from "@material-ui/core/Input";
import FormControl from "@material-ui/core/FormControl";
import InputAdornment from "@material-ui/core/InputAdornment";
import TelegramIcon from "@material-ui/icons/Telegram";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import CancelIcon from "@material-ui/icons/Cancel";
import CircularProgress from "@material-ui/core/CircularProgress";
import CallIcon from "@material-ui/icons/Call";
import VideoCallIcon from "@material-ui/icons/VideoCall";

import FileUpload from "../form/FileUpload";
import { imageUpload } from "../../utils/uploadImage";
import {
  addChatAction,
  getMessageAction,
  loadMoreMessageAction,
  deleteConversationAction,
} from "../../redux/actions/chatAction";
import MessageDisplay from "./MessageDisplay";
import EmojiIcon from "../EmojiIcon";
import ConfirmModal from "../modal/ConfirmModal";

const useStyles = makeStyles((theme) => ({
  avatar: {
    width: "24px",
    height: "24px",
  },
  input: {
    marginTop: "10px",
    marginBottom: "10px",
    padding: "0 10px",
  },
  messageContent: {
    flexGrow: "1",
    height: "0px",
    overflow: "auto",
  },
  content: {
    // flex: "1 1 auto",
    overflowY: "auto",
    // height: "100px",
    // alignsItem: "flex-end",
  },
  preview: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    width: "100%",
    padding: "10px 15px",
    height: "auto",
  },
  icon: {
    color: "rgba(255, 255, 255, 0.54)",
  },
  titleBar: {
    background: "transparent",
  },
}));

function RightSide() {
  const { auth, chat, socket } = useSelector((state) => state);
  const dispatch = useDispatch();
  const [user, setUser] = useState([]);
  const [images, setImages] = useState([]);
  const [text, setText] = useState("");
  const [loadMedia, setLoadMedia] = useState(false);
  const [page, setPage] = useState(0);
  const [data, setData] = useState([]);
  const [result, setResult] = useState(9);
  const [hasMore, setHasMore] = useState(0);
  const [open, setOpen] = useState(false);

  const { id } = useParams();
  const classes = useStyles();
  const pageEnd = useRef();
  const messageRef = useRef();
  const history = useHistory();

  useEffect(() => {
    const newData = chat.data.find((item) => item._id === id);

    if (newData) {
      setData(newData.messages);
      setResult(newData.result);
      setPage(newData.page);
    }
  }, [chat.data, id]);

  const scrollToBottom = () => {
    messageRef.current?.scrollIntoView({
      behavior: "smooth",
      // inline: "nearest",
      block: "end",
    });
  };

  useEffect(() => {
    if (id && chat.users.length > 0) {
      setTimeout(() => {
        scrollToBottom();
      }, 50);
      const newUser = chat.users.find((user) => user._id === id);
      if (newUser) {
        setUser(newUser);
      }
    }
  }, [chat.users, id]);

  useEffect(() => {
    if (id) {
      const getMessage = async () => {
        if (chat.data.every((item) => item._id !== id)) {
          console.log("get data");
          await dispatch(getMessageAction(id, auth));
          setTimeout(() => {
            scrollToBottom();
          }, 50);
        }
      };

      getMessage();
    }
  }, [id, auth, dispatch, chat.data]);

  const handleRemoveImage = (index) => {
    const newArr = [...images];
    newArr.splice(index, 1);
    setImages(newArr);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!text.trim() && images.length === 0) return;
    setLoadMedia(true);
    let media = [];
    if (images.length > 0) media = await imageUpload(images);
    const msg = {
      sender: auth.user._id,
      recipient: id,
      text,
      media,
      createdAt: new Date().toISOString(),
    };
    setLoadMedia(false);
    setText("");
    setImages([]);

    await dispatch(addChatAction(msg, auth, socket));

    scrollToBottom();
  };

  // Load More chat
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setHasMore((p) => p + 1);
        }
      },
      {
        threshold: 0.1,
      }
    );

    observer.observe(pageEnd.current);
  }, [setHasMore]);

  useEffect(() => {
    if (hasMore > 1) {
      if (result >= page * 9) {
        dispatch(loadMoreMessageAction(id, auth, page + 1));
        setHasMore(1);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasMore]);

  const handleDeleteConversation = () => {
    dispatch(deleteConversationAction(auth, id));
    return history.push("/messages");
  };

  const handleAudioCall = () => {};

  const handleVideoCall = () => {};

  return (
    <Grid container direction="column" style={{ height: "100%" }}>
      <ConfirmModal
        open={open}
        setOpen={setOpen}
        handleRemovePost={handleDeleteConversation}
        title="Delete Conversation."
        subtitle="Do you want delete this Conversation?"
      />
      <List
        style={{ padding: 0 }}
        component="nav"
        aria-label="main mailbox folders"
      >
        <ListItem style={{ paddingTop: 4, paddingBottom: 4 }}>
          <ListItemIcon style={{ minWidth: "30px" }}>
            {user.avatar?.url ? (
              <Avatar
                className={classes.avatar}
                alt="profile picture"
                src={user.avatar?.url}
              />
            ) : (
              <Avatar className={classes.avatar} alt="profile picture" />
            )}
          </ListItemIcon>
          <ListItemText
            style={{ margin: 0 }}
            primary={user.username}
            secondary={user.fullname}
          />

          <Tooltip title="Audio Call">
            <IconButton onClick={handleAudioCall} style={{ padding: 10 }}>
              <CallIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Video Call">
            <IconButton
              onClick={handleVideoCall}
              style={{ pading: "10px 0px" }}
            >
              <VideoCallIcon color="primary" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Conservation">
            <IconButton onClick={() => setOpen(true)} style={{ padding: 10 }}>
              <DeleteForeverIcon color="error" />
            </IconButton>
          </Tooltip>
        </ListItem>
      </List>
      <Divider />
      <Grid
        item
        container
        direction="column"
        justify="flex-end"
        className={classes.messageContent}
      >
        <div className={classes.content}>
          {chat.loading && (
            <IconButton style={{ width: "100%" }} size="small">
              <CircularProgress size={24} />
            </IconButton>
          )}
          <div ref={pageEnd} style={{ visibility: "hidden" }}></div>

          {data.map((msg, index) => (
            <React.Fragment key={index}>
              {msg.sender !== auth.user._id && (
                <div style={{ width: "auto", maxWidth: "300px" }}>
                  <MessageDisplay user={user} msg={msg} data={data} />
                </div>
              )}
              {msg.sender === auth.user._id && (
                <div
                  style={{
                    width: "auto",
                    maxWidth: "300px",
                    marginLeft: "auto",
                  }}
                >
                  <MessageDisplay
                    user={auth.user}
                    msg={msg}
                    yourMessage={true}
                    data={data}
                  />
                </div>
              )}
            </React.Fragment>
          ))}

          <div style={{ width: 0, height: 0 }} ref={messageRef}></div>
        </div>
      </Grid>
      {images.length > 0 && (
        <>
          <Divider />
          <div className={classes.preview}>
            <GridList cellHeight={80} className={classes.gridList} cols={8}>
              {images.map((image, index) => (
                <GridListTile key={index} cols={1}>
                  <img
                    src={
                      image.camera
                        ? image.camera
                        : image.url
                        ? image.url
                        : URL.createObjectURL(image)
                    }
                    alt="Preview"
                  />
                  <GridListTileBar
                    className={classes.titleBar}
                    titlePosition="top"
                    actionIcon={
                      <IconButton
                        onClick={() => handleRemoveImage(index)}
                        className={classes.icon}
                      >
                        <CancelIcon />
                      </IconButton>
                    }
                    actionPosition="right"
                  />
                </GridListTile>
              ))}
            </GridList>
          </div>
        </>
      )}
      <Divider />
      <form onSubmit={handleSubmit}>
        <FormControl fullWidth className={classes.input}>
          <Input
            disableUnderline
            placeholder="Message..."
            autoFocus
            value={text}
            onChange={(e) => setText(e.target.value)}
            // onClick={(event) => {
            //   event.target.value = null;
            // }}
            startAdornment={<EmojiIcon title={text} setTitle={setText} />}
            endAdornment={
              <InputAdornment position="end">
                <FileUpload images={images} setImages={setImages} />

                <IconButton
                  type="submit"
                  disabled={!text && images.length <= 0}
                >
                  {loadMedia ? (
                    <CircularProgress color="primary" size={20} />
                  ) : (
                    <TelegramIcon />
                  )}
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
      </form>
    </Grid>
  );
}

export default RightSide;
