import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import "../../assets/styles/productForm.css";
import sofaServices from "../../services/sofaServices";
import geoapiServices from "../../services/geoapiServices";

export default function NewSofaForm({ userLogged }) {
  const navigate = useNavigate();

  const [images, setImages] = useState([]);
  const [newImages, setNewImages] = useState([]);

  const [loading, setLoading] = useState(false);

  const [sofa, setSofa] = useState({
    name: "",
    description: "",
    price: 0.0,
    length: 1,
  });

  let sofaId = useParams().id;

  useEffect(() => {
    if (userLogged == undefined) {
      alert("Login needed. Please login and try again");
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);


      const sofaData = await sofaServices.getSofa(
        sofaId,
        userLogged.token
      );
      if (sofaData.images != undefined) setImages(sofaData.images);
      if (sofaData._id == undefined) {
        navigate("/");
        return;
      } else if (sofaData.anfitrion != userLogged.email) {
        navigate(`/sofa/${sofaId}`);
        return;
      } else {
        setSofa(sofaData);
      }

      setLoading(false);
    };

    fetchData().catch(console.error);
  }, []);

  const setDireccion = (event) => {
    const newDireccion = {
      ...sofa,
      direccion: event.target.value,
    };
    setSofa(newDireccion);
  };

  const handleUploadImage = async (event) => {
    setLoading(true);
    const image = await sofaServices.addImage(
      sofaId,
      event.target.files[0],
      userLogged.token
    );
    setLoading(false);

    setNewImages([...newImages, image]);
  };

  const handleDeleteImage = async (image) => {
    setLoading(true);
    await sofaServices.deleteImage(image.public_id, userLogged.token);
    setImages(images.filter((img) => image.public_id != img.public_id));
    setLoading(false);
  };

  const handleDeleteNewImage = async (image) => {
    setLoading(true);
    await sofaServices.deleteImage(image.public_id, userLogged.token);
    setNewImages(newImages.filter((img) => image.public_id != img.public_id));
    setLoading(false);
  };

  const handleCancel = async () => {
    newImages.forEach(async (image) => {
      await sofaServices.deleteImage(image.public_id, userLogged.token);
    });
    const sofaData = await sofaServices.getSofa(
      sofaId,
      userLogged.token
    );

    if (sofaData.name == "") {
      sofaServices.deleteSofa(sofaId, userLogged.token);
    }
    navigate(`/`);
  };

  const handleSave = async () => {

    const body = {
      anfitrion: userLogged.email,
      direccion: sofa.direccion,
      location: {
        type: "Point",
        coordinates: [36.602274, -4.531727],
      }
    };

    let response;

    response = await geoapiServices.getCoordinates(body.direccion);
    body.location.coordinates = [response.lon, response.lat];

    if (images.length != 0 || newImages.length != 0)
      body.images = [...images, ...newImages];

    
    if (sofaId == undefined) {
      response = await sofaServices.createSofa(
        body,
        userLogged.token
      );
      sofaId = response.insertedId;
    } else {
      response = await sofaServices.modifySofa(
        sofaId,
        body,
        userLogged.token
      );
    }

    if (response.error != undefined) {
      if (confirm(response.error)) {
        handleCancel();
      }
    } else {
      navigate(`/sofa/${sofaId}`);
    }
  };

  return (
    <>
      <div className="editproduct-container">
        <div className="product-images-table">
          <div className="editproduct-input-file">
            <button
              onClick={() => document.getElementById("input-file").click()}
            >
              <span className="material-icons">add</span>Add new image
            </button>
            <input
              type="file"
              accept=".png,.jpg,.jpeg"
              id="input-file"
              onChange={handleUploadImage}
              hidden
            />
          </div>

          <table className="editproduct-table">
            <thead>
              {/* merge the two columns into one */}

              <tr>
                <th colSpan={2}>Images</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={2} className="loading-spinner-editproduct"></td>
                </tr>
              ) : (
                images.map((image) => {
                  return (
                    <tr key={image.public_id}>
                      <td className="action-buttons">
                        <button onClick={() => handleDeleteImage(image)}>
                          <i className="material-icons">delete</i>
                        </button>
                      </td>
                      <td className="editproduct-image-container">
                        <img
                          className="editproduct-image"
                          src={image.secure_url}
                          alt="Sofao"
                        ></img>
                      </td>
                    </tr>
                  );
                })
              )}
              {loading
                ? ""
                : newImages.map((image) => {
                    return (
                      <tr key={image.public_id}>
                        <td className="action-buttons">
                          <button onClick={() => handleDeleteNewImage(image)}>
                            <i className="material-icons">delete</i>
                          </button>
                        </td>
                        <td className="editproduct-image-container">
                          <img
                            className="editproduct-image"
                            src={image.secure_url}
                            alt="Sofao"
                          ></img>
                        </td>
                      </tr>
                    );
                  })}
            </tbody>
          </table>
        </div>

        <div className="productedit-form-container">
          <form>
            <label>Dirección (para geolocalizar): </label>
            <input type="text" value={sofa.direccion} onChange={setDireccion}></input>
            <br />
          </form>
        </div>
      </div>
      <div className="editproduct-finalbuttons">
        <button id="cancel-button" onClick={handleCancel}>
          Cancel
        </button>
        <button id="accept-button" onClick={handleSave}>
          Save changes
        </button>
      </div>
    </>
  );
}
