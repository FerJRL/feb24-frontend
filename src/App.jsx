import Login from "./components/Login/login.jsx";

import Sofas from "./components/Sofas/sofas.jsx";
import Sofa from "./components/Sofas/sofa.jsx";
import SofaForm from "./components/Sofas/sofaForm.jsx";
import NewSofa from "./components/Sofas/newSofa.jsx";

import Navbar from "./NavBar.jsx";

import { Route, Routes, useNavigate } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import { useState, useEffect } from "react";

import loginServices from "./services/loginServices.js";

function App() {
    const navigate = useNavigate();

    const errorHandler = (error, componentStack) => {
        console.log(error);
    }
    
    const [userLogged, setUserLogged] = useState(undefined);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const user = loginServices.getUserLogged();
        if (user != undefined) {
          if (Math.floor(new Date().getTime() / 1000.0) < user.exp) setUserLogged(user);
          else {
            alert("Session expired. Please login again");
            localStorage.removeItem("user");
            navigate("/login");
          }
        }
        setLoading(false);
    }, []);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <ErrorBoundary onError={errorHandler}>
                <Navbar />

                <Routes>
                    <Route path="/" element={<Sofas userLogged={userLogged} />} />
                    <Route path="/sofa/:id" element={<Sofa userLogged={userLogged} />} />
                    <Route path="/sofa/edit/:id" element={<SofaForm userLogged={userLogged} />} />
                    <Route path="/sofa/new" element={<NewSofa userLogged={userLogged} />} />
                    <Route path="/login" element={<Login userLogged={userLogged} setUserLogged={setUserLogged} />} />
                </Routes>
        </ErrorBoundary>
    );
}

export default App;
