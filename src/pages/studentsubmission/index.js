import React, { useState } from 'react';
import axios from 'axios';
import { Container, TextField, Button } from '@mui/material';

const StudentSubmission = () => {
  const [studentId, setStudentId] = useState('');
  const [teacherId, setTeacherId] = useState('');
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('studentId', studentId);
    formData.append('teacherId', teacherId);
    formData.append('file', file);

    await axios.post('https://localhost:7217/api/StudentProgress/Submit', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    alert('File uploaded successfully');
  };

  return (
    <Container>
      <h2>Student Submission</h2>
      <TextField
        label="Student ID"
        value={studentId}
        onChange={(e) => setStudentId(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Teacher ID"
        value={teacherId}
        onChange={(e) => setTeacherId(e.target.value)}
        fullWidth
        margin="normal"
      />
      <input type="file" onChange={handleFileChange} />
      <Button variant="contained" color="primary" onClick={handleSubmit}>Submit</Button>
    </Container>
  );
};

export default StudentSubmission;
