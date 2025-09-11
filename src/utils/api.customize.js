import axios from "./axios.customize"


const createUserAPI = (name, email, password) => {
    const API_URL = 'api/CreateUser'
    return axios.post(API_URL, {
        name,
        email,
        password
    })
}

const loginUserAPI = (email, password) => {
    const API_URL = '/api/login-User'
    console.log("......a.s fas")
    return axios.post(API_URL, {
        email,
        password
    })
}

const getAUserByIdAPI = (id) => {
    const API_URL = `/api/get-a-user?id=${id}`
    return axios.get(API_URL)
}

const forgotPasswordAPI = (email) => {
    const API_URL = '/api/forgot-password'
    console.log(email)
    return axios.post(API_URL, { email })
}

const resetPasswordAPI = (newPass) => {
    const API_URL = '/api/reset-password/:token'
    return axios.post(API_URL, newPass)
}

const createPostAPI = (formData) => {
    return axios.post("/api/create-post", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
}
const getDataUserLoginGoogle = (sessionId) => {
    return axios.get(`/data/user/redis?session_id=${sessionId}`)
}
export {
    createUserAPI,
    loginUserAPI,
    getAUserByIdAPI,
    forgotPasswordAPI,
    resetPasswordAPI,
    createPostAPI,
    getDataUserLoginGoogle
}