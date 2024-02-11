import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Carousel from "react-bootstrap/Carousel";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../assets/styles/map.css";

const Map = (props) => {
  const [loading, setLoading] = useState(false);

  return (
    <div className={props.className}>
      <div style={{ height: "100%", width: "100%", border: "solid 1px black" }}>
        <MapContainer
          center={props.userPosition}
          zoom={10}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {props.products.map((product) => (
                // each product has a marker on the map
                <Marker
                  key={product._id}
                  position={[
                    product.location.coordinates[1],
                    product.location.coordinates[0],
                  ]}
                >
                  <Popup>
                    <div className="popup-container">
                      {loading ? (
                        <p>Loading products...</p>
                      ) : (

                        <div className="carousel-container">
                            <div className="map-product-info">
                              <a href={`/product/${product._id}`}>
                                <h5>{product.name}</h5>
                                <img
                                  className="map-product-image"
                                  src={
                                    product.images
                                      ? product.images[0].url
                                      : "no_image.png"
                                  }
                                  alt="Product Image"
                                />
                              </a>
                              <p>
                                <strong>Descr:</strong>{" "}
                                {product.description.slice(0,20)+"..."}
                                <br></br>
                                <strong>Price:</strong>{" "}
                                {product.price}
                                <br></br>
                                <strong>Date:</strong>{" "}
                                {new Date(
                                  product.date
                                ).toLocaleDateString()}
                                <br></br>
                              </p>
                            </div>
                          
                        </div>
                      )}
                    </div>
                  </Popup>
                </Marker>
              )
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default Map;
