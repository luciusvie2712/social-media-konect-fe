import axios from 'axios'
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import store from '../store/ReduxStore'
import actiontypes from '../store/Action/ActionTypes';
const instance = axios.create({
    baseURL: 'http://localhost:8080/' //env
});
let hasShown429Toast = false;
// Add a request interceptor
instance.interceptors.request.use(function (config) {
    const state = store.getState();
    const accessToken = state.user?.account?.accessToken;
    if (accessToken) {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
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
    const originalRequest = error.config;
    const state = store.getState();
    const refreshToken = state.user?.account?.refreshToken;
    if (error.response?.status === 401 && refreshToken && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
            const res = await axios.post(
                'http://localhost:8080/api/refresh-token',
                {},
                {
                    headers: {
                        Authorization: `Bearer ${refreshToken}`,
                    },
                }
            );

            if (res?.data?.EC === 0) {
                const newAccessToken = res.data.accessToken;
                const newRefreshToken = res.data.newRefreshToken;

                store.dispatch({
                    type: 'USER_UPDATE_TOKEN',
                    payload: {
                        accessToken: newAccessToken,
                        refreshToken: newRefreshToken,
                    },
                });

                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                return instance(originalRequest);
            } else {
                toast.error('Session expired. Please login again.');
                store.dispatch({ type: actiontypes.USER_LOGOUT });
                window.location.href = '/login';
                return Promise.reject(error);
            }
        } catch (e) {
            toast.error('Token expired. Please login again.');
            store.dispatch({ type: actiontypes.USER_LOGOUT });
            window.location.href = '/login';
            return Promise.reject(e);
        }
    }

    if (error.response?.status === 401 && !refreshToken) {
        toast.error('No refresh token available. Please login again.');
        store.dispatch({ type: actiontypes.USER_LOGOUT });
        window.location.href = '/login';
    }
    let errorMessage = ''
    switch (error.response?.status) {
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
        case 429:
            if (!hasShown429Toast) {
                toast.error('Too many requests, please try again later.');
                hasShown429Toast = true;
                setTimeout(() => { hasShown429Toast = false; }, 5000);
            }
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