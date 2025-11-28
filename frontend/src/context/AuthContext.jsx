import { createContext,useState,useEffect } from "react";

export const AuthContext=createContext();


export default function AuthProvider({children}){
  console.log('auth provider render');
  const[user,setUser]=useState(()=>{
    return JSON.parse(localStorage.getItem('user'))|| null;
  })

const login = (data) => {
  const userData = {
    _id: data._id,
    name: data.name,
    email: data.email,
    role: data.role,
    token: data.token,
  };

  setUser(userData);
  localStorage.setItem("user", JSON.stringify(userData));
};
const logout=()=>{
  setUser(null);
  localStorage.removeItem('user')
}
return(
  <AuthContext.Provider value={{user,login,logout}}>
    {children}
  </AuthContext.Provider>
)
}