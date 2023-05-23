import axios from 'axios'



export const newAxios = axios.create({
    baseURL:'https://api-chat-ukxi.onrender.com/api',
    withCredentials:true
})