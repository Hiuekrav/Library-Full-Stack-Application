import axios from "axios";
import properties from "@/properties/properties.ts";


const api = axios.create({
        baseURL: properties.serverAddress
});

api.interceptors.request.use( function (config){
    const token = localStorage.getItem('authToken');
    config.headers.Authorization = "Bearer " + token;
    return config;
});


export default api;


