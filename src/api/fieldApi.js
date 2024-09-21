/* eslint-disable prettier/prettier */
import { axiosClient } from './axiosClient'

export const fieldApi = {
    getAllField() {
        const url = '/Fields';
        var result = axiosClient.get(url);
        return result;
    },
    addField(data) {
        const url = '/Fields';
        return axiosClient.post(url, data);
    },
    editField(data) {
        const url = '/Fields/' + data.id;
        return axiosClient.put(url, data);
    },
    deleteField(data) {
        const url = '/Fields/' + data;
        return axiosClient.delete(url);
    }
    ,
  
}