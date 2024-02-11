import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    Nav,
    NavLink,
    Bars,
    NavMenu,
    NavBtn,
    NavBtnLink,
} from "./navbarElements";

import "./assets/styles/navExtra.css";
import loginServices from "./services/loginServices";

const Navbar = () => {
    const [loggedUser, setLoggedUser] = useState(undefined);

    useEffect(() => {
        setLoggedUser(loginServices.getUserLogged());
    }, [localStorage]);

    return (
        <>
            <Nav>
                {/* <Bars /> */}
                <NavMenu>
                    <NavLink to="/" id="create">Products</NavLink>
                    <NavLink to="/product/new" id="create">
                        Sell something
                    </NavLink>
                </NavMenu>

                <NavBtn>
                    <NavBtnLink to="/login">{
                        loggedUser != undefined ?
                            loggedUser.name
                        :
                            "Login"
                    }</NavBtnLink>
                </NavBtn>
            </Nav>
        </>
    );
};

export default Navbar;
