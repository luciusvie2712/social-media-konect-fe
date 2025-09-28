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

const getListUserChatted = (userId) => {
    return axios.get(`/user-chatted-byId?userId=${userId}`)
}
const getConversation = (senderId, receiverId) => {
    return axios.get(`/api/get-conservation?senderId=${senderId}&&receiverId=${receiverId}`)
}

const sendMessage = (formData) => {
    return axios.post('/api/send-message', formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        }
    }
    )
}
const GetfriendSuggestion = (id) => {
    return axios.get(`/api/get-friend-suggestion?id=${id}`)
}
const sendFriendRequest = (requesterId, recipientId) => {
    return axios.post(`/api/send-friend-request`, {requesterId, recipientId})
}
const rejectFriendRequest = (requesterId, recipientId) => {
    return axios.post(`/api/reject-friend-request`, {requesterId, recipientId})
}
export {
    createUserAPI,
    loginUserAPI,
    getAUserByIdAPI,
    forgotPasswordAPI,
    resetPasswordAPI,
    createPostAPI,
    getDataUserLoginGoogle,
    getListUserChatted,
    getConversation,
    sendMessage,
    GetfriendSuggestion,
    sendFriendRequest,
    rejectFriendRequest
}