import axios from 'axios'

const instanceAxios = axios.create({
  baseURL: 'http://localhost:8888/'
});
instanceAxios.defaults.headers.common['Authorization'] = `Bearer`

// Add a request interceptor
instanceAxios.interceptors.request.use(function (config) {
    // Do something before request is sent
    config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`
    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });

// Add a response interceptor
instanceAxios.interceptors.response.use(function (response) {

    // if (response && response.data) return response.data // chi lay data 
    return response;
    
  }, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  });

export default instanceAxios