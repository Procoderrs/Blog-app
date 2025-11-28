import axios from 'axios';
const api=axios.create({
   baseURL: import.meta.env.VITE_API_URI/api,
    
/*    baseURL:'http://localhost:5000/api', 
 */ 

})

export default api;