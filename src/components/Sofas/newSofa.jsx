import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import "../../assets/styles/productForm.css";
import sofaServices from "../../services/sofaServices";

export default function NewSofa({ userLogged }) {
  const navigate = useNavigate();

  let sofaId;

  useEffect(() => {
    if (userLogged == undefined) {
      alert("Login needed. Please login and try again");
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    const redirect = async () => {
      const newSofa = await sofaServices.createEmptySofa(
        userLogged.email,
        userLogged.token
      );
      sofaId = newSofa.insertedId;

      navigate(`/sofa/edit/${sofaId}`);
    };

    redirect().catch(console.error);
  }, []);

  return <></>;
}
