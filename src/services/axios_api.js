import axios from 'axios';

const axios_api = axios.create({
  baseURL: "https://linux03/im/atdHumano/middleware/atd_api.php/"
})

export default axios_api;
export function axiosTokenJWT(token) {
    axios_api.defaults.headers.common['Authorization'] = token
}
