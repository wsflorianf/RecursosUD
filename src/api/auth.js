import axios from "./axios"

export const loginRequest = async (email, password) => {
    return axios.post("/api/auth/login", { correo: email, contra: password, });
}

export const logoutRequest = async ()=>{

    return axios.post("/api/auth/logout");
}