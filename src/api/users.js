import axios from "./axios"

export const registerUserRequest = async (data) => {
  return axios.post('/api/usuario', {
    nombre: data.name,
    correo: data.email,
    contra: data.password,
    admin: data.admin,
  })
}

export const getUserRequest = async (id) => {
  return axios.get(`/api/usuario/${id}`, {headers: {Authorization: "Bearer "+document.cookie.split("=")[1],}})
}