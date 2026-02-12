import axios from 'axios';
const API = axios.create({
    baseURL: 'https://rate-limit-api-94st.onrender.com',
    withCredentials: true // Important for cookies
});

// Add token to requests if it exists
API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

export default API;