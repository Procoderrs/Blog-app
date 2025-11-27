import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function  LoggedIn({children}){
  console.log('logged-in render');
const {user}=useContext(AuthContext);

if(user){
  return <Navigate to='/dashboard' replace/>
}
return children;
}