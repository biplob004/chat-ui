const baseURL = import.meta.env.VITE_API_URL;
import axios from "axios";

const instance = axios.create({
    withCredentials: true,
    baseURL
})

export default instance
