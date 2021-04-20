import React from "react";
import { Editor } from "@tinymce/tinymce-react";

const SimpleEditor = ({ data, setDescription }) => {
  const handleEditorChange = (content, editor) => {
    setDescription(content);
  };

  return (
    <>
      <Editor
        apiKey={process.env.REACT_APP_TINY_MCE_API_KEY}
        initialValue={data ? data : "<p>Story</p>"}
        init={{
          selector: "textarea",
          menubar: false,
          statusbar: false,
          plugins: [
            "advlist lists pagebreak charmap print preview",
            "searchreplace visualblocks code fullscreen",
            "insertdatetime media table paste code help wordcount",
          ],
          toolbar: "",
          // icons: "material",
          // skin: "material-outline",
          // content_css: "material-outline",
        }}
        onEditorChange={handleEditorChange}
      />
    </>
  );
};

export default SimpleEditor;
