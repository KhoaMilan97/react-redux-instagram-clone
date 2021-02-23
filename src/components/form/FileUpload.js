import React from "react";
import Resizer from "react-image-file-resizer";
import { useSelector } from "react-redux";

import { makeStyles } from "@material-ui/core/styles";

import InsertPhotoIcon from "@material-ui/icons/InsertPhoto";

import { uploadImages } from "../../functions/upload";

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

export default function FileUpload({ setLoading, setImages, images }) {
  const classes = useStyles();
  const { token } = useSelector((state) => state.auth);

  const fileUploadAndResize = (e) => {
    const files = e.target.files;
    //const allUploadFiles = [];

    if (files) {
      setLoading(true);
      for (let i = 0; i < files.length; i++) {
        Resizer.imageFileResizer(
          files[i],
          1080,
          1080,
          "JPEG",
          100,
          0,
          (uri) => {
            uploadImages({ image: uri }, token)
              .then((res) => {
                //allUploadFiles.push(res.data);
                setImages((prevArray) => [...prevArray, res.data]);
                setLoading(false);
              })
              .catch((err) => {
                console.log(err);
                setLoading(false);
              });
          },
          "base64"
        );
      }
    }
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
