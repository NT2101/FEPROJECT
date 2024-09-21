/* eslint-disable prettier/prettier */
import { axiosClient } from './axiosClient'

export const topicApi = {
    getAllTopic() {
        const url = '/Topic';
        var result = axiosClient.get(url);
        return result;
    },
    addTopic(data) {
        const url = '/Topic';
        return axiosClient.post(url, data);
    },
    editTopic(data) {
        const url = '/Topic/' + data.id;
        return axiosClient.put(url, data);
    },
    deleteTopic(data) {
        const url = '/Topic/' + data;
        return axiosClient.delete(url);
    }
    ,
  
}