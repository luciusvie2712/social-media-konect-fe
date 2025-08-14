import axios from 'axios'

const instance = axios.create({
    baseURL: 'http://localhost:8080/'
});

// Add a request interceptor
instance.interceptors.request.use(function (config) {
    const token = localStorage.getItem("accessToken");
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, function (error) {
    return Promise.reject(error);
});

// Add a response interceptor
instance.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response && response.data ? response.data : response;
}, async function as(error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    if (error.status === 401) {
        const refreshToken = localStorage.getItem('refreshToken')
        if (refreshToken) {
            try {
                const res = await axios.post('/refresh-token', {}, {
                    headers: {
                        'Authorization': `Bearer ${refreshToken}`,
                    }
                });
                localStorage.setItem("token", res.accessToken);
                error.config.headers['Authorization'] = `Bearer ${res.accessToken}`;
                return axios(error.config);
            } catch (e) {
                console.log(e)
                toast.error("Token expired. Please login again.");
                window.location.href = '/login';
            }
        } else {
            toast.error("No refresh token available. Please login again.");
            window.location.href = '/login';
        }
    }

    let errorMessage = ''
    switch (error.status) {
        case 400:
            errorMessage = 'Bad Request: The server could not understand the request.';
            toast.error(errorMessage)

            break;
        case 401:
            errorMessage = 'Unauthorized: Authentication is required.';
            toast.error(errorMessage)
            window.location.href = '/login'
            break;
        case 403:
            errorMessage = 'Forbidden: You do not have permission to access this resource.';
            toast.error(errorMessage)
            window.location.href = '/404-page'
            break;
        case 404:
            errorMessage = 'Not Found: The requested resource could not be found.';
            toast.error(errorMessage)
            break;
        case 500:
            errorMessage = 'Internal Server Error: There is a problem with the server.';
            toast.error(errorMessage)
            break;
        case 502:
            errorMessage = 'Bad Gateway: The server received an invalid response from an upstream server.';
            toast.error(errorMessage)
            break;
        case 503:
            errorMessage = 'Service Unavailable: The server is currently unable to handle the request.';
            toast.error(errorMessage)
            break;
        default:
            errorMessage = 'An unexpected error occurred.';
            toast.error(errorMessage)
            break;
    }

});
export default instance