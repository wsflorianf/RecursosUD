import axios from "./axios";

export const getTypes= async ()=>{
    return axios.get("/api/tipo", {headers: {Authorization: "Bearer "+document.cookie.split("=")[1],}})
}

export const createType= async (data)=>{
    return axios.post("/api/tipo", {
        unidadId: data.idUnit,
        nombre: data.name,
        descripcion: data.description,
        caracteristicas: data.characteristics,
        horarioDisponibilidad: data.horary
    }, {headers: {Authorization: "Bearer "+document.cookie.split("=")[1], }})
}