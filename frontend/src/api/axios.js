// Axios instance configured for our API
// withCredentials: true ensures cookies are sent with every request
// This is critical for JWT authentication via HTTP-only cookies
import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,  // Send cookies with requests (required for JWT in cookies)
  headers: {
    'Content-Type': 'application/json'
  }
});

export default API;
