import router from '@/router';
import axios from 'axios'

const request = axios.create({
    baseURL : 'http://localhost:8088',
    timeout : 30000,
})




request.interceptors.request.use(config => {
    config.headers['Content-Type'] = 'application/json;charset=utf-8';
    const tokennow = localStorage.getItem('token');
    config.headers['token'] = tokennow;


    return config
}, error => {
    console.error('request error : ' + error);
    return Promise.reject(error);
}
);



request.interceptors.response.use(
    response => {
        if(response.data.data === 'NOT LOGIN') {
            router.push('/login')
        }
        return response;
    },
    error => {
        console.error('response error : ' + error)
        return Promise.reject(error)
    }
);




export default request



