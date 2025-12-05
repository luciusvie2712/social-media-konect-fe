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
const updateAuser = (dataUpdate) => {
    return axios.put('/api/update-user', dataUpdate)
}
const getAUserByIdAPI = (id) => {
    const API_URL = `/api/get-a-user?id=${id}`
    return axios.get(API_URL)
}
const forgotPasswordAPI = (email) => {
    const API_URL = '/api/forgot-password'
    return axios.post(API_URL, { email })
}
const resetPasswordAPI = (newPass) => {
    const API_URL = '/api/reset-password/:token'
    return axios.post(API_URL, newPass)
}
const getDataUserLoginGoogle = (sessionId) => {
    return axios.get(`/data/user/redis?session_id=${sessionId}`)
}

const createPostAPI = (formData) => {
    return axios.post("/api/create-post", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
}
const getPost = (id) => {
    return axios.get(`/api/get-post?id=${id}`)
}
const LikePost = (userId, postId) => {
    return axios.post(`/api/like-post?userId=${userId}&&postId=${postId}`)
}
const createComment = (dataComment) => {
    return axios.post('/api/Create-comment', dataComment)
}
const getComment = (postId) => {
    return axios.get(`/api/get-comment?postId=${postId}`)
}
const deleteComment = (commentId,) => {
    return axios.delete(`/api/delete-comment?commentId=${commentId}`)
}
const deletePost = (postId) => {
    return axios.delete(`/api/delete/post?id=${postId}`)
}
const sharePost = (data) => {
    return axios.post('/api/share-post', data)
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
    })
}

const GetfriendSuggestion = (id) => {
    return axios.get(`/api/get-friend-suggestion?id=${id}`)
}
const sendFriendRequest = (requesterId, recipientId) => {
    return axios.post(`/api/send-friend-request`, { requesterId, recipientId })
}
const rejectFriendRequest = (requesterId, recipientId) => {
    return axios.post(`/api/reject-friend-request`, { requesterId, recipientId })
}
const acceptFriendRequest = (requesterId, recipientId) => {
    return axios.post(`/api/accept-friend-request`, { requesterId, recipientId })
}
const getFriendRequest = (userId) => {
    return axios.get(`/api/get-accept-request?userId=${userId}`)
}
const getListFriends = () => {
    return axios.get(`/api/get-listfriend`)
}

const getNotifications = (id) => {
    return axios.get(`/api/get-notification-user?userId=${id}`)
}
const maskAsReadAPI = (notiId) => {
    return axios.post(`/api/markAsRead-notification?notiId=${notiId}`)
}
const getAllUserTable = (limit, page) => {
    return axios.get(`/api/get-User-table?limit=${limit}&&page=${page}`)
}
const deleteUserTable = (id) => {
    return axios.delete(`/api/DeleteUser?id=${id}`)
}
const getTablePost = (limit, page) => {
    return axios.get(`/api/get-post-table?limit=${limit}&&page=${page}`)
}
const handleProcessReportPost = (data) => {
    return axios.put(`/api/handle-report-post`, data)
}
const createLogo = (formData) => {
    return axios.post(`/api/upload-logo`, formData)
}
const handleReportPost = (postId, reporterId, reason) => {
    return axios.post(`/api/report-post`, { postId, reporterId, reason })
}
const handleSharePost = (userId, postId, caption, visibility) => {
    return axios.post(`/api/share-post`, { userId, postId, caption, visibility })
}
const saveHistorySearch = (userId, keyword, targetUserId) => {
    return axios.post(`/api/search-history`, { userId, keyword, targetUserId })
}
const getHistorySearch = () => {
    return axios.get(`/api/search-history`,)
}
const searchUserByName = (name) => {
    return axios.get(`/api/find-user-by-name?name=${name}`,)
}

//addasboard
const getAdminSummary = () => {
    return axios.get(`/api/summary`)
}
const getUserStats = () => {
    return axios.get(`/api/stats/users`)
}
const getPostStats = () => {
    return axios.get(`/api/stats/posts`)
}
const statusAccount = (status, userId) => {
    return axios.post(`/api/account-status?status=${status}&&userId=${userId}`)
}
export {
    createUserAPI, loginUserAPI,
    getAUserByIdAPI, updateAuser,
    forgotPasswordAPI,
    resetPasswordAPI,
    createPostAPI,
    getPost, sharePost,
    getDataUserLoginGoogle,
    getListUserChatted, getConversation, sendMessage,
    GetfriendSuggestion, sendFriendRequest, rejectFriendRequest, getFriendRequest, acceptFriendRequest, getListFriends,
    LikePost,
    getNotifications, maskAsReadAPI,
    getAllUserTable, deleteUserTable,
    createComment,
    getComment, deleteComment,
    getTablePost, deletePost, handleProcessReportPost, handleReportPost, handleSharePost,
    createLogo,
    saveHistorySearch, searchUserByName, getHistorySearch,
    getAdminSummary, getUserStats, getPostStats,
    statusAccount
}