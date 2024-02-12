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

          {props.sofas.map((sofa) => (
                // each sofa has a marker on the map
                <Marker
                  key={sofa._id}
                  position={[
                    sofa.location.coordinates[1],
                    sofa.location.coordinates[0],
                  ]}
                >
                  <Popup>
                    <div className="popup-container">
                      {loading ? (
                        <p>Loading sofas...</p>
                      ) : (

                        <div className="carousel-container">
                            <div className="map-product-info">
                              <a href={`/product/${sofa._id}`}>
                                <h5>{sofa.anfitrion}</h5>
                                <img
                                  className="map-product-image"
                                  src={
                                    sofa.images
                                      ? sofa.images[0].url
                                      : "no_image.png"
                                  }
                                  alt="Sofa Image"
                                />
                              </a>
                              <p>
                                <strong>Direccion:</strong>{" "}
                                {sofa.direccion.slice(0,20)+"..."}
                                
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
