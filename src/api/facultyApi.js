/* eslint-disable prettier/prettier */
import { axiosClient } from './axiosClient'

export const facultyApi = {
    getAllFaculty() {
        const url = '/Faculties';
        var result = axiosClient.get(url);
        return result;
    },
    addFaculty(data) {
        const url = '/Faculties';
        console.log('Sending data to API:', data); // Debug: Log data before sending
        return axiosClient.post(url, data);
    },

    editFaculty(data) {
        const url = `/Faculties/${data.id}`;
        return axiosClient.put(url, {
            facultyName: data.facultyName,
            description: data.description,
            // Include other fields as necessary
        });
    },
    
    deleteFaculty(id) {
        const url = `/Faculties/${id}`;
        return axiosClient.delete(url);
      },
  
}