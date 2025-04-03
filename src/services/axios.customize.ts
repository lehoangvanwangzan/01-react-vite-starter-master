import axios from "axios";
import NProgress from "nprogress";
const instance = axios.create({
    baseURL: import.meta.env.VITE_URL_BACKEND,

});
NProgress.configure({
    showSpinner: true,
    trickleSpeed: 100,
});
// Add a request interceptor
instance.interceptors.request.use(function (config) {
    NProgress.start();
    // if (typeof window !== "undefined" && window && window.localStorage && window.localStorage.getItem('access_token')) {
    //     config.headers.Authorization = 'Bearer ' + window.localStorage.getItem('access_token');
    // }
    const token = localStorage.getItem("access_token");
    const auth = token ? `Bearer ${token}` : '';
    config.headers['Authorization'] = auth;
    // Do something before request is sent
    return config;
}, function (error) {
    NProgress.done();
    // Do something with request error
    return Promise.reject(error);
});

// Add a response interceptor
instance.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    NProgress.done();
    if (response && response.data.data) return response.data;

    return response;
}, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    NProgress.done();
    if (error.response && error.response.data) return error.response.data;
    return Promise.reject(error);
});
export default instance;