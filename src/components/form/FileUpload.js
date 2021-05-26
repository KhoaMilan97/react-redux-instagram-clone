import React from "react";
import { useDispatch } from "react-redux";

import { makeStyles } from "@material-ui/core/styles";
import InsertPhotoIcon from "@material-ui/icons/InsertPhoto";

import { setMessage } from "../../redux/actions/messageAction";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    "&:hover label": {
      cursor: "pointer",
    },
  },
  input: {
    display: "none",
  },
}));

export default function FileUpload({ setImages, images }) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const fileUploadAndResize = (e) => {
    const files = [...e.target.files];

    let err = "";
    let newImages = [];

    files.forEach((file) => {
      if (!file) return (err = "File doesn't exist");
      if (file.size > 1024 * 1024 * 5) {
        return (err = "The Image largest is 5mb.");
      }

      return newImages.push(file);
    });

    if (err) dispatch(setMessage(err, "error"));
    setImages([...images, ...newImages]);
  };

  return (
    <>
      <div className={classes.root}>
        <input
          accept="image/*"
          className={classes.input}
          id="contained-button-file"
          onChange={fileUploadAndResize}
          multiple
          type="file"
        />
        <label htmlFor="contained-button-file">
          <InsertPhotoIcon />
        </label>
      </div>
    </>
  );
}
