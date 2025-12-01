import axios from 'axios';
const api=axios.create({
   /* baseURL: import.meta.env.VITE_API_URI, */
    
   baseURL: import.meta.env.VITE_API_URI + "/api",
 

})

export default api;