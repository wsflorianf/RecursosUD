import axios from "./axios";

export const getReservations= async ()=>{
    return axios.get("/api/reserva", {headers: {Authorization: "Bearer "+document.cookie.split("=")[1],}})
}

export const createReservation= async (data)=>{
    return axios.post("/api/reserva", {
        usuarioId: data.userId,
        recursoId: data.resourceId,
        fecha: data.date,
        horaInicio: data.start,
        horaFin: data.end
    }, {headers: {Authorization: "Bearer "+document.cookie.split("=")[1], }})
}