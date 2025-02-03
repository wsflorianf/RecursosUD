import axios from "./axios";

export const getUnits= async ()=>{
    return axios.get("/api/unidad", {headers: {Authorization: "Bearer "+document.cookie.split("=")[1],}})
}