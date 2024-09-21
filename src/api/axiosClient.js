/* eslint-disable prettier/prettier */
import axios from 'axios'

export const axiosClient = axios.create({
    // baseURL: 'http://25.12.254.139:8010/api',
    baseURL: 'https://localhost:7217/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor
axios.interceptors.request.use(function (config) {
    // Do something before request is sent
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

// Add a response interceptor
axios.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
}, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log('Response data:', error.response.data);
        console.log('Response status:', error.response.status);
        console.log('Response headers:', error.response.headers);
    } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log('Request data:', error.request);
    } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error message:', error.message);
    }
    console.log('Error config:', error.config);


    return Promise.reject(error);
});