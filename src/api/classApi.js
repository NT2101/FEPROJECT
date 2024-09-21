/* eslint-disable prettier/prettier */
import { axiosClient } from './axiosClient';

export const classesApi = {
    getAllClasses() {
        const url = '/Classes';
        return axiosClient.get(url);
    },
    addClass(data) {
        const url = '/Classes';
        console.log('Sending data to API:', data); // Debug: Log data before sending
        return axiosClient.post(url, data);
    },
 
    editClass(data) {
        const url = `/Classes/${data.id}`;
        return axiosClient.put(url, {
            className: data.className,
            description: data.description,
            specializationID: data.specializationID,
            // Include other fields as necessary
        });
    },
    deleteClass(id) {
        const url = `/Classes/${id}`;
        return axiosClient.delete(url);
    }
};

