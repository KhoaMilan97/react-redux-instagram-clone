import axios from "axios";

export const upload = async (data, token) =>
  await axios.post(
    `/api/uploadavatars`,
    { image: data.image, userid: data.userid },
    {
      headers: {
        Authorization: token,
      },
    }
  );

export const removeAvatars = async (data, token) =>
  await axios.post(
    `/api/removeavatars`,
    { public_id: data.public_id, userid: data.userid },
    {
      headers: {
        Authorization: token,
      },
    }
  );
