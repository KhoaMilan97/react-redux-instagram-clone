import React from "react";
import Resizer from "react-image-file-resizer";
import { useSelector, useDispatch } from "react-redux";

import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

import { upload } from "../../functions/upload";
import { actionTypes } from "../../redux/actions/actionType";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",

    "& > *": {
      margin: theme.spacing(1),
    },
  },
  input: {
    display: "none",
  },
  upload: {
    marginLeft: 0,
    padding: 0,
    color: "#0095f6",
    textTransform: "capitalize",
    fontWeight: 600,
  },
}));

export default function UploadAvatar({ center, setImageLoading }) {
  const classes = useStyles();
  const { token, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const fileUploadAndResize = (e) => {
    const files = e.target.files[0];

    if (files) {
      setImageLoading(true);
      Resizer.imageFileResizer(
        files,
        250,
        250,
        "JPEG",
        100,
        0,
        (uri) => {
          upload({ image: uri, userid: user._id }, token)
            .then((res) => {
              dispatch({
                type: actionTypes.UPDATE_USER,
                payload: res.data,
              });
              setImageLoading(false);
            })
            .catch((err) => {
              console.log(err);
              setImageLoading(false);
            });
        },
        "base64"
      );
    }
  };

  return (
    <div
      className={classes.root}
      style={{ textAlign: center ? "center" : "left" }}
    >
      <input
        accept="image/*"
        className={classes.input}
        id="contained-button-file"
        onChange={fileUploadAndResize}
        type="file"
      />
      <label htmlFor="contained-button-file">
        <Button className={classes.upload} color="primary" component="span">
          Change Profile Photo
        </Button>
      </label>
    </div>
  );
}
