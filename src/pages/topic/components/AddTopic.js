import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, TextField, Button, FormControl, InputLabel, Select, MenuItem, Typography, Grid } from '@mui/material';
import { useSnackbar } from 'notistack';

const AddTopicForm = ({ onClose }) => {
    const { enqueueSnackbar } = useSnackbar();
    const [fields, setFields] = useState([]);
    const [students, setStudents] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [topic, setTopic] = useState({
        title: '',
        description: '',
        fieldID: '',
        studentID: '',
        teacherID: '',
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [fieldsResponse, studentsResponse, teachersResponse] = await Promise.all([
                    axios.get('https://localhost:7217/api/Fields'),
                    axios.get('https://localhost:7217/api/Student/WithoutTopics'),
                    axios.get('https://localhost:7217/api/Teacher'),
                ]);
                setFields(fieldsResponse.data);
                setStudents(studentsResponse.data);
                setTeachers(teachersResponse.data);
            } catch (error) {
                console.error('Failed to fetch data', error);
            }
        };
        fetchData();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await axios.post('https://localhost:7217/api/Topic/AddFull', topic);
            enqueueSnackbar('Đề tài đã được thêm thành công!', { variant: 'success' });
            setTopic({
                title: '',
                description: '',
                fieldID: '',
                studentID: '',
                teacherID: '',
            }); // Reset form data
            if (onClose) onClose(); // Notify parent component to refetch data
        } catch (error) {
            console.error('Failed to add topic:', error.response ? error.response.data : error.message);

            if (error.response?.status === 409) {
                enqueueSnackbar('Đề tài với tiêu đề này đã tồn tại!', { variant: 'warning' });
            } else {
                enqueueSnackbar('Không thể thêm đề tài. Vui lòng thử lại!', { variant: 'error' });
            }
        }
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Thêm Đề tài Toàn bộ
            </Typography>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            label="Tiêu đề"
                            value={topic.title}
                            onChange={(e) => setTopic({ ...topic, title: e.target.value })}
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Mô tả"
                            value={topic.description}
                            onChange={(e) => setTopic({ ...topic, description: e.target.value })}
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                            <InputLabel>Lĩnh vực</InputLabel>
                            <Select
                                value={topic.fieldID}
                                onChange={(e) => setTopic({ ...topic, fieldID: e.target.value })}
                                required
                            >
                                {fields.map((field) => (
                                    <MenuItem key={field.id} value={field.id}>
                                        {field.fieldName}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                            <InputLabel>Sinh viên</InputLabel>
                            <Select
                                value={topic.studentID}
                                onChange={(e) => setTopic({ ...topic, studentID: e.target.value })}
                                required
                            >
                                {students.map((student) => (
                                    <MenuItem key={student.studentID} value={student.studentID}>
                                        {student.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                            <InputLabel>Giảng viên</InputLabel>
                            <Select
                                value={topic.teacherID}
                                onChange={(e) => setTopic({ ...topic, teacherID: e.target.value })}
                                required
                            >
                                {teachers.map((teacher) => (
                                    <MenuItem key={teacher.teacherID} value={teacher.teacherID}>
                                        {teacher.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <Button type="submit" variant="contained" color="primary">
                            Thêm Đề tài
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Container>
    );
};

export default AddTopicForm;
