import axios from 'axios';

// Create an Axios instance pointing to your backend
const API = axios.create({
    baseURL: 'http://localhost:5000/api', 
});

// Automatically attach the JWT token to every request if the user is logged in
API.interceptors.request.use((req) => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
        const parsedInfo = JSON.parse(userInfo);
        req.headers.Authorization = `Bearer ${parsedInfo.token}`;
    }
    return req;
});

export default API;