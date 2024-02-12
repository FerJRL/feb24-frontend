import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Map from "../Map/map";
import loginServices from "../../services/loginServices";
import "../../assets/styles/products.css";



export default function Sofas({ userLogged }) {
    const navigate = useNavigate();

    let userPosition = [36.602274, -4.531727];
    
    

    const [sofas, setSofas] = useState([]);
    const [loading, setLoading] = useState(true);

    const sofasConn = import.meta.env.VITE_PRODUCTS_URL;

    const getSofasFromAPI = async () => {
        try {
            const sofasResponse = await axios.get(
                `${sofasConn}/v2/`
            );

            loginServices.checkResponse(sofasResponse.data);

            setSofas(sofasResponse.data);

        } catch (error) {
            console.error("Error fetching sofas:", error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {    
                await getSofasFromAPI();
            } catch (error) {
                setLoading(false);
                console.error("Error in useEffect:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);


    return (
        <>
            <div>
                

                {loading ? (
                    <div className="loading-spinner"></div>
                ) : (
                    <>
                        <div className="products-map-div">
                            <Map
                                className="products-map"
                                sofas={sofas}
                                userPosition={userPosition}
                            />
                        </div>

                        <div className="products">
                            {sofas.map((sofa) => {

                                return (
                                    <div className="product" key={sofa._id}>
                                        <div
                                            className="product-user"
                                        >
                                            <img src="user.jpg"></img>
                                            <p className="product-user-name">{sofa.anfitrion}</p>
                                        </div>
                                        <div className="product-info">
                                            <h2 className="product-name">{sofa.direccion}</h2>
                                        </div>
                                        {sofa.images ? (
                                            <div className="product-image">
                                                <img src={sofa.images[0].url} alt={sofa.direccion} />
                                            </div>
                                        ) : (
                                            <div className="product-image">
                                                <img src="no_image.png" alt="No image available" />
                                            </div>
                                        )}
                                        
                                        
                                        <div className="product-buttons">
                                            <button
                                                className="product-button"
                                                onClick={() => {
                                                    navigate("/sofa/" + sofa._id);
                                                }}
                                            >
                                                Detalles
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>
        </>
    );
}
