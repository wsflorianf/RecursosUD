import axios from "./axios";

export const getReservations= async ()=>{
    return axios.get("/api/recurso", {headers: {Authorization: "Bearer "+document.cookie.split("=")[1],}})
}

export const createReservation= async (data)=>{
    return axios.post("/api/recurso", {
        tipoRecursoId: data.idResourceType,
        nombre: data.name,
        identificador: data.identifier,
        caracteristicas: data.characteristics,
    }, {headers: {Authorization: "Bearer "+document.cookie.split("=")[1], }})
}