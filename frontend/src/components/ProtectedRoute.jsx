import React from "react";
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";


 function ProtectedRoute({children}){
  console.log('protected route render');
  const {user}=useContext(AuthContext);

  if(!user){
    return <Navigate to='/login' replace />;

  }
  return children;
}

export default React.memo(ProtectedRoute);