import axios from "axios";

export const imageUpload = async (images) => {
  let imgArr = [];
  for (const item of images) {
    const formData = new FormData();
    if (item.camera) {
      formData.append("file", item.camera);
    }
    formData.append("file", item);
    formData.append("upload_preset", "instagram-clone");
    formData.append("cloud_name", "khoa-milan");

    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/khoa-milan/upload",
      formData
    );
    const data = res.data;
    imgArr.push({ public_id: data.public_id, url: data.secure_url });
  }
  return imgArr;
};
