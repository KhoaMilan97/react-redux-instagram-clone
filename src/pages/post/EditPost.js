import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useHistory } from "react-router-dom";

import {
  Container,
  Typography,
  Divider,
  TextField,
  GridList,
  GridListTile,
  GridListTileBar,
  Button,
  IconButton,
  CircularProgress,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CancelIcon from "@material-ui/icons/Cancel";

import { getSinglePost, updatePost } from "../../functions/post";
import Spinner from "../../components/loading/Spinner";
import { removeImages } from "../../functions/upload";
import FileUpload from "../../components/form/FileUpload";
import { setMessage } from "../../redux/actions/messageAction";

const useStyles = makeStyles((theme) => ({
  title: {
    marginTop: "20px",
    marginBottom: "20px",
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
    height: "auto",
  },
  icon: {
    color: "rgba(255, 255, 255, 0.54)",
  },
  titleBar: {
    background: "transparent",
  },
}));

function EditPost() {
  const classes = useStyles();
  const auth = useSelector((state) => state.auth);
  const { id } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [titlePost, setTitlePost] = useState("");
  const [imgLoading, setImgLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getSinglePost(id, auth.token)
      .then((response) => {
        setTitlePost(response.data.post.title);
        setImages(response.data.post.images);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [id, auth.token]);

  const handleRemoveImage = (id) => {
    removeImages({ public_id: id }, auth.token)
      .then((res) => {
        if (res.data === "ok") {
          let filteredImage = images.filter((item) => {
            return item.public_id !== id;
          });

          setImages(filteredImage);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleUpdatePost = () => {
    updatePost({ title: titlePost, images }, id, auth.token)
      .then((res) => {
        history.push(`/post/${id}`);
        dispatch(setMessage("Update Success!", "success"));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  if (loading) {
    return <Spinner pending={loading} />;
  }

  return (
    <Container maxWidth="sm">
      <Typography
        style={{ textTransform: "uppercase", fontWeight: 600 }}
        variant="h5"
        color="primary"
        align="center"
      >
        Edit post
      </Typography>
      <Divider style={{ margin: "10px 0" }} />
      <TextField
        defaultValue={titlePost}
        onChange={(e) => setTitlePost(e.target.value)}
        label="Title"
        fullWidth
      />
      <Typography className={classes.title}>Images </Typography>

      <div className={classes.preview}>
        <GridList cellHeight={180} className={classes.gridList} cols={3}>
          {images.map((image) => (
            <GridListTile key={image.public_id} cols={1}>
              <img src={image.url} alt="Preview" />
              <GridListTileBar
                className={classes.titleBar}
                titlePosition="top"
                actionIcon={
                  <IconButton
                    onClick={() => handleRemoveImage(image.public_id)}
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

      <div style={{ margin: "20px 0" }}>
        <FileUpload
          images={images}
          setImages={setImages}
          setLoading={setImgLoading}
        />
      </div>
      <Button
        onClick={handleUpdatePost}
        variant="contained"
        color="primary"
        fullWidth
      >
        {imgLoading ? <CircularProgress size={20} /> : "Save"}
      </Button>
    </Container>
  );
}

export default EditPost;
