/* eslint-disable prettier/prettier */
import { axiosClient } from './axiosClient'

export const accountApi = {
    getAllAccount() {
        const url = '/Accounts';
        var result = axiosClient.get(url);
        return result;
    },

    editAccount(data) {
        const url = '/Accounts/' + data.id;
        return axiosClient.put(url, data);
    },
    deleteAccount(data) {
        const url = '/Accounts/' + data;
        return axiosClient.delete(url);
    }
    ,
  
}