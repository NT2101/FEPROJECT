/* eslint-disable prettier/prettier */
import { axiosClient } from './axiosClient'

export const specializationsApi = {
    getAllSpecializations() {
        const url = '/Specializations';
        return axiosClient.get(url);
    },
    addSpecialization(data) { // Correct method name
        const url = '/Specializations';
        console.log('Sending data to API:', data); // Debug: Log data before sending
        return axiosClient.post(url, data);
    },
    editSpecialization(data) {
        const url = `/Specializations/${data.id}`;
        return axiosClient.put(url, {
            name: data.name,
            description: data.description,
            facultyID: data.facultyID
        });
    },
    deleteSpecialization(id) {
        const url = `/Specializations/${id}`;
        return axiosClient.delete(url);
    }
}
