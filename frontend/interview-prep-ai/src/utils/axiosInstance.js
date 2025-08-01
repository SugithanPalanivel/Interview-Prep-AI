import axios from "axios";
import { BASE_URL } from "./apiPaths";


const axiosInstance=axios.create({
    baseURL:BASE_URL,
    timeout:80000,
    headers:{
        "Content-Type":"application/json",
        Accept:"application/json"
    }
});


// Request Intercepters

axiosInstance.interceptors.request.use(
    (config)=>{
        const accessToken=localStorage.getItem("token");
        if(accessToken){
            config.headers.Authorization=`Bearer ${accessToken}`
        }
        return config;
    },
    (error)=>{
        return Promise.reject(error);
    }
);
// Response Interceptors
axiosInstance.interceptors.response.use(
    (response)=>{
        return response;
    },
    (error)=>{
        // Handle common errors globally
        if(error.response){
            if(error.response.status===401){
                // Redirect to login page
                window.location.href="/";
            }
            else if(error.response.status===500){
                console.error("Server Error ,Please try again later.")
            }
        }
        else if(error.code==="ECONNABORTED"){
            console.error("REquest timeout.Please try again.")
        }
        return Promise.reject(error);
    }
)

export default axiosInstance;