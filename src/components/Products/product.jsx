import React from "react";
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

import "../../assets/styles/product.css";
import productServices from "../../services/productServices";
import clientServices from "../../services/clientServices";
import loginServices from "../../services/loginServices";

export default function Product({ userLogged }) {
  const navigate = useNavigate();

  const productId = useParams().id;
  const [product, setProduct] = useState({});
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
      const productData = await productServices.getProduct(productId);

      if (productData._id) {
        setProduct(productData);
      } else {
        navigate("/");
        return;
      }

      const ownerData = await clientServices.getClient(productData.userID);
      setOwner(ownerData);
    };

    fetchData().catch(console.error);
  }, []);

  useEffect(() => {
    const calculateTimeLeft = (startDate) => {
      const date = Date.parse(startDate);
      const today = new Date().getTime();

      let length = product.length;
      if (length == undefined) length = 7;

      const maxDiff = length * 24 * 60 * 60 * 1000;

      const diff = date + maxDiff - today;

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / 1000 / 60) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };

    if (product.date != undefined) {
      const interval = setInterval(() => calculateTimeLeft(product.date), 1000);

      return () => clearInterval(interval);
    }
  }, [product]);

  const prevImage = () => {
    let newSelected = selectedImage - 1;
    if (newSelected < 0) newSelected += product.images.length;
    setSelectedImage(newSelected % product.images.length);
  };

  const nextImage = () => {
    setSelectedImage((selectedImage + 1) % product.images.length);
  };

  const endedBid = () => {
    return (
      timeLeft.seconds < 0 ||
      timeLeft.minutes < 0 ||
      timeLeft.hours < 0 ||
      timeLeft.days < 0
    );
  };

  const handleDate = (dateStr) => {
    let date = new Date(Date.parse(dateStr));

    const options = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    return date.toLocaleDateString(undefined, options); //'es-ES'
  };

  const timeLeftStr = () => {
    return (
      timeLeft.days +
      "d " +
      timeLeft.hours +
      "h " +
      timeLeft.minutes +
      "m " +
      timeLeft.seconds +
      "s"
    );
  };

  const deleteProduct = async () => {
    
    await productServices.deleteProduct(productId, userLogged.token);
    navigate("/");
    
  };

  const modifyProduct = () => {
    navigate(`/product/edit/${productId}`);
  };

  return (
    <div className="product-container">
      <div className="product-image-container">
        <img
          className="product-page-image"
          src={
            product.images != undefined && product.images.length > 0
              ? product.images[selectedImage].secure_url
              : "http://localhost:5173/no_image.png"
          }
          alt="Product Image"
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
          {userLogged != undefined && userLogged._id == product.userID ? (
            <>
              <button id="product-modify" onClick={() => modifyProduct()}>
                <span className="material-icons">edit</span>
              </button>
              <button id="product-delete" onClick={() => deleteProduct()}>
                <span className="material-icons">delete</span>
              </button>
            </>
          ) : null}
        </div>
      </div>
      <div className="product-info-container">
        <div className="product-details">
          <h2>{product.name}</h2>
          <p>{product.description}</p>
          <p className={"product-price "}>
            {product.price}€
          </p>

          <div className="product-owner">
            <img src={"/user.jpg"} />
            <Link to={`/profile/${owner._id}`}>{owner.email}</Link>
            {userLogged != undefined && userLogged._id != product.userID ? (
              <div className="asksomething">
                <p> Any question? </p>
                <span className="material-icons"> chat </span>
              </div>
            ) : null}
          </div>

          <div className={`product-status ${endedBid() ? "off" : "on"}`}>
            {endedBid() ? (
              <p>
                {" "}
                <b>
                  {" "}
                  Bid auction ended {Math.abs(timeLeft.days)} days ago{" "}
                </b>{" "}
              </p>
            ) : (
              <p>
                {" "}
                <b> The auction is still ongoing </b>{" "}
              </p>
            )}
            <p>
              {" "}
              <b> {endedBid() ? "" : timeLeftStr()} </b>{" "}
            </p>
          </div>
        </div>

        
      </div>
    </div>
  );
}
