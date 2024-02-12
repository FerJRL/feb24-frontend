import axios from "axios";
import loginServices from "./loginServices";
import clientServices from "./clientServices";

const sofasConn = import.meta.env.VITE_PRODUCTS_URL;
const cloudinaryConn = import.meta.env.VITE_CLOUDINARY_URL;

const getSofa = async (id) => {
  const response = await axios.get(`${sofasConn}/v1/${id}`);
  loginServices.checkResponse(response.data);
  return response.data;
};

const createSofa = async (body, token) => {
  const response = await axios.post(
    `${sofasConn}/v1/`,
    {
      ...body
    },
    {
      headers: {
        Authorization: token,
      },
    }
  );
  loginServices.checkResponse(response.data);
  return response.data;
};

const deleteSofa = async (id, token) => {
  const response = await axios.delete(`${sofasConn}/v2/${id}`, {
    headers: {
      Authorization: token,
    },
  });
  loginServices.checkResponse(response.data);
  return response.data;
};

const modifySofa = async (id, body, token) => {
  const response = await axios.put(
    `${sofasConn}/v1/${id}`,
    body,
    {
      headers: {
        Authorization: token,
      },
    }
  );
  loginServices.checkResponse(response.data);
  return response.data;
};

const addImage = async (id, image, token) => {
  let data = new FormData();
  data.append("image", image);
  data.append("productId", id);

  const response = await axios.post(
    `${cloudinaryConn}/v2/images`,
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: token,
      },
    }
  );

  return response.data.image;
};

const deleteImage = async (imageId, token) => {
  const imgFields = imageId.split("/");
  const body = {
    productId: imgFields[0],
    imageName: imgFields[1],
  };

  const response = await axios.delete(
    `${cloudinaryConn}/v2/images`,
    {
      data: body,
    },
    {
      headers: {
        Authorization: token,
      },
    }
  );
  loginServices.checkResponse(response.data);

  return response.data;
};

const createEmptySofa = async (loggedUserEmail, token) => {
  const body = {
    anfitrion: loggedUserEmail,
    direccion: ""
  };

  const response = await axios.post(`${sofasConn}/v1/`, body, {
    headers: {
      Authorization: token,
    },
  });
  loginServices.checkResponse(response.data);
  return response.data;
};

const sofaServices = {
  getSofa,
  createSofa,
  deleteSofa,
  modifySofa,
  addImage,
  deleteImage,
  createEmptySofa
};

export default sofaServices;
