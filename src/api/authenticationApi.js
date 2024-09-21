import { axiosClient } from './axiosClient';


export const authenticationApi = {
    login(data) {
        const url = '/Authentication/login';
        return axiosClient.post(url, data);
    },
    // logout() {
    //     const url = '/Authentication/logout';
    //     return axiosClient.post(url);
    // },
    getCurrentUser() {
        const url = '/Authentication/current';
        return axiosClient.get(url);
    }
};