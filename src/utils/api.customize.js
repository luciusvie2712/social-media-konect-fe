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

const createPostAPI = (authorId, caption, visibility, files) => {
    const API_URL = `/api/create-post`
    const formData = new FormData()
    formData.append('author', authorId)
    formData.append('caption', caption)
    formData.append('visibility', visibility)
    files.forEach((file) => {
        formData.append("media", file)
    });

    return axios.post(API_URL, formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })
}

export {
    createUserAPI,
    loginUserAPI,
    getAUserByIdAPI,
    forgotPasswordAPI,
    resetPasswordAPI,
    createPostAPI,
}