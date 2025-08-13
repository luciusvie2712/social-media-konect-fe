import axios from "./axios.customize"

const createUserAPI = (name, email, password) => {
    const API_URL = '/api/CreateUser'
    return axios.post(API_URL, {
        name,
        email,
        password
    })
}

const loginUserAPI = ( email, password ) => {
    const API_URL = '/api/login-User'
    return axios.post(API_URL, {
        email,
        password
    })
}

export { 
    createUserAPI,
    loginUserAPI
}