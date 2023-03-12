import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:420/'
});

export default api;
