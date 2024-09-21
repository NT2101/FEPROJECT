/* eslint-disable prettier/prettier */
import { axiosClient } from './axiosClient'

export const teacherApi = {
    getAllTeacher() {
        const url = '/Teacher';
        var result = axiosClient.get(url);
        return result;
    },
    addTeacher(data) {
        const url = '/Teacher';
        return axiosClient.post(url, data);
    },
    editTeacher(data) {
        const url = '/Teacher/' + data.id;
        return axiosClient.put(url, data);
    },
    deleteTeacher(data) {
        const url = '/Teacher/' + data;
        return axiosClient.delete(url);
    }
    ,
  
}