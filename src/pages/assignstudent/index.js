import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Select, MenuItem, FormControl, InputLabel, Button, Typography, Snackbar } from '@mui/material';
import Alert from '@mui/material/Alert';

const TeacherStudentTopicSelector = () => {
    const [teachers, setTeachers] = useState([]);
    const [students, setStudents] = useState([]);
    const [topics, setTopics] = useState([]);
    const [selectedTeacher, setSelectedTeacher] = useState('');
    const [selectedStudent, setSelectedStudent] = useState('');
    const [selectedTopic, setSelectedTopic] = useState('');
    const [message, setMessage] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const teacherResponse = await axios.get('https://localhost:7217/api/Teacher');
                setTeachers(teacherResponse.data);

                const studentResponse = await axios.get('https://localhost:7217/api/Student/WithoutTopics');
                setStudents(studentResponse.data);
            } catch (error) {
                setMessage('Có lỗi xảy ra khi tải dữ liệu.');
                setOpenSnackbar(true);
            }
        };
        fetchData();
    }, []);

    const handleTeacherChange = async (event) => {
        const teacherId = event.target.value;
        setSelectedTeacher(teacherId);

        try {
            const response = await axios.get('https://localhost:7217/api/Topic/availabletopics', {
                params: { teacherId }
            });
            setTopics(response.data);
        } catch (error) {
            setTopics([]);
            setMessage('Có lỗi xảy ra khi tải danh sách đề tài.');
            setOpenSnackbar(true);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await axios.post('https://localhost:7217/api/Topic/assign', {
                TopicID: selectedTopic,
                StudentID: selectedStudent
            });
            setMessage('Đề tài đã được phân công thành công.');
            setOpenSnackbar(true);
        } catch (error) {
            setMessage('Có lỗi xảy ra khi phân công đề tài.');
            setOpenSnackbar(true);
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <div style={{ padding: 20 }}>
            <Typography variant="h4" gutterBottom>
                Phân Công Đề Tài
            </Typography>
            <form onSubmit={handleSubmit} noValidate autoComplete="off">
                <FormControl fullWidth margin="normal">
                    <InputLabel>Chọn Giảng Viên</InputLabel>
                    <Select
                        value={selectedTeacher}
                        onChange={handleTeacherChange}
                        label="Chọn Giảng Viên"
                    >
                        {teachers.map(teacher => (
                            <MenuItem key={teacher.teacherID} value={teacher.teacherID}>
                                {teacher.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <InputLabel>Chọn Sinh Viên</InputLabel>
                    <Select
                        value={selectedStudent}
                        onChange={(e) => setSelectedStudent(e.target.value)}
                        label="Chọn Sinh Viên"
                    >
                        {students.map(student => (
                            <MenuItem key={student.studentID} value={student.studentID}>
                                {student.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <InputLabel>Chọn Đề Tài</InputLabel>
                    <Select
                        value={selectedTopic}
                        onChange={(e) => setSelectedTopic(e.target.value)}
                        label="Chọn Đề Tài"
                    >
                        {topics.map(topic => (
                            <MenuItem key={topic.id} value={topic.id}>
                                {topic.title}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Button variant="contained" color="primary" type="submit">
                    Phân Công
                </Button>
            </form>

            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={message.includes('thành công') ? 'success' : 'error'}>
                    {message}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default TeacherStudentTopicSelector;
