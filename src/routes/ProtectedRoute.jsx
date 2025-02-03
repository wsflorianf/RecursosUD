import React from "react";
import { Navigate } from "react-router";
import { useAuthStore } from "../store/authStore";

export const ProtectedRoute = (props)=>{
    
    const user = useAuthStore((state) => state.user);
  
    return user ? props.children : <Navigate to="/login" />;
}