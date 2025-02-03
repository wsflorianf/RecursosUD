import axios from "./axios";

export const getResources= async ()=>{
    return axios.get("/api/recurso", {headers: {Authorization: "Bearer "+document.cookie.split("=")[1],}})
}

export const createResource= async (data)=>{
    return axios.post("/api/recurso", {
        tipoRecursoId: data.idResourceType,
        nombre: data.name,
        identificador: data.identifier,
        caracteristicas: data.characteristics,
    }, {headers: {Authorization: "Bearer "+document.cookie.split("=")[1], }})
}