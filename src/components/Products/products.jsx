import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Map from "../Map/map";
import loginServices from "../../services/loginServices";
import "../../assets/styles/products.css";



export default function Products({ userLogged }) {
    const navigate = useNavigate();

    let userPosition = [36.602274, -4.531727];
    
    

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const productsConn = import.meta.env.VITE_PRODUCTS_URL;

    const getProductsFromAPI = async () => {
        try {
            const productsResponse = await axios.get(
                `${productsConn}/v2/`
            );

            loginServices.checkResponse(productsResponse.data);

            setProducts(productsResponse.data);

        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {    
                await getProductsFromAPI();
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
                                products={products}
                                userPosition={userPosition}
                            />
                        </div>

                        <div className="products">
                            {products.map((product) => {
                                const limitDate = new Date(product.date);
                                limitDate.setDate(limitDate.getDate() + product.length);

                                return (
                                    <div className="product" key={product._id}>
                                        <div
                                            className="product-user"
                                            onClick={() => {
                                                navigate("/profile/" + user._id);
                                            }}
                                        >
                                            <img src="user.jpg"></img>
                                            <p className="product-user-name">nombreusuario</p>
                                        </div>
                                        <div className="product-info">
                                            <h2 className="product-name">{product.name}</h2>
                                            <p className="product-description">
                                                {product.description}
                                            </p>
                                        </div>
                                        {product.images ? (
                                            <div className="product-image">
                                                <img src={product.images[0].url} alt={product.name} />
                                            </div>
                                        ) : (
                                            <div className="product-image">
                                                <img src="no_image.png" alt="No image available" />
                                            </div>
                                        )}
                                        <div className="product-bids">
                                            <p className={"product-price "} >
                                                Initial price: {product.price}€
                                            </p>
                                        </div>
                                        
                                        <div className="product-buttons">
                                            <button
                                                className="product-button"
                                                onClick={() => {
                                                    navigate("/product/" + product._id);
                                                }}
                                            >
                                                Product details
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
