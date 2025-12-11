import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function AdminRoute({children}){
  console.log('admin-route-render');
const {user, loading} = useContext(AuthContext);

  if(loading) return null; // or spinner
if(!user) return <Navigate to='/' />;
if(user.role !== 'admin') return <Navigate to='/' />;

return children;
}
