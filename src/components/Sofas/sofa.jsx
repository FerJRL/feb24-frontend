import React from "react";
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

import "../../assets/styles/product.css";
import sofaServices from "../../services/sofaServices";
import clientServices from "../../services/clientServices";
import loginServices from "../../services/loginServices";

export default function Sofa({ userLogged }) {
  const navigate = useNavigate();

  const sofaId = useParams().id;
  const [sofa, setSofa] = useState({});
  const [selectedImage, setSelectedImage] = useState(0);
  const [owner, setOwner] = useState({});
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      const sofaData = await sofaServices.getSofa(sofaId);

      if (sofaData._id) {
        setSofa(sofaData);
      } else {
        navigate("/");
        return;
      }

      const ownerData = await clientServices.getClient(sofaData.userID);
      setOwner(ownerData);
    };

    fetchData().catch(console.error);
  }, []);

  const prevImage = () => {
    let newSelected = selectedImage - 1;
    if (newSelected < 0) newSelected += sofa.images.length;
    setSelectedImage(newSelected % sofa.images.length);
  };

  const nextImage = () => {
    setSelectedImage((selectedImage + 1) % sofa.images.length);
  };


  const deleteSofa = async () => {
    
    await sofaServices.deleteSofa(sofaId, userLogged.token);
    navigate("/");
    
  };

  const modifySofa = () => {
    navigate(`/sofa/edit/${sofaId}`);
  };

  return (
    <div className="product-container">
      <div className="product-image-container">
        <img
          className="product-page-image"
          src={
            sofa.images != undefined && sofa.images.length > 0
              ? sofa.images[selectedImage].secure_url
              : "http://localhost:5173/no_image.png"
          }
          alt="Sofa Image"
        ></img>
        <button
          className="product-image-button prev"
          onClick={() => prevImage()}
        >
          &#8249;
        </button>
        <button
          className="product-image-button next"
          onClick={() => nextImage()}
        >
          &#8250;
        </button>
        <div className="product-owner-options">
          {userLogged != undefined && userLogged._id == sofa.userID ? (
            <>
              <button id="product-modify" onClick={() => modifySofa()}>
                <span className="material-icons">edit</span>
              </button>
              <button id="product-delete" onClick={() => deleteSofa()}>
                <span className="material-icons">delete</span>
              </button>
            </>
          ) : null}
        </div>
      </div>
      <div className="product-info-container">
        <div className="product-details">
          <h2>{sofa.direccion}</h2>

          <div className="product-owner">
            <img src={"/user.jpg"} />
            {sofa.anfitrion}
            
          </div>
        </div>

        
      </div>
    </div>
  );
}
