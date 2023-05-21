import axios from 'axios'



export const newAxios = axios.create({
    baseURL:'http://localhost:8800/api',
    withCredentials:true
})