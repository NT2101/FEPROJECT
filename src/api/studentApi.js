/* eslint-disable prettier/prettier */
import { axiosClient } from './axiosClient'

export const studentApi = {
    getAllStudent() {
        const url = '/Student';
        var result = axiosClient.get(url);
        return result;
    },
    addStudent(data) {
        const url = '/Student';
        console.log('Sending data to API:', data); // Debug: Log data before sending
        return axiosClient.post(url, data);
    },
    editStudent(data) {
        const url = `/Student/${data.id}`;
        return axiosClient.put(url, {
            studentID: data.studentID,
            name: data.name,
            dob: data.dob,
            sex: data.sex,
            address: data.address,
            phoneNumber: data.phoneNumber,
            emailAddress: data.emailAddress,
            country: data.country,
            classID: data.classID,
            // Include other fields as necessary
        });
    },
    deleteStudent(data) {
        const url = '/Student/' + data;
        return axiosClient.delete(url);
    }
    ,
  
}