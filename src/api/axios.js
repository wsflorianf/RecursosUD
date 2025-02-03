import axios from 'axios'

const myAxios = axios.create({
    baseURL: "https://localhost:44357",
    withCredentials: true,
})

export default myAxios;