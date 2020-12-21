import axios from 'axios'

let baseUrl = ''
if(window.location.hostname == 'localhost'){
  baseUrl = 'https://linux03'
}else{
  baseUrl = 'https://'+window.location.hostname
}

const axios_api = axios.create({
  baseURL: `${baseUrl}/im/atdHumano/middleware/atd_api.php/`
})

export default axios_api;
export function axiosTokenJWT(token) {
  axios_api.defaults.headers.common['Authorization'] = token
}
