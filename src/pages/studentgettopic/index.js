import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  CircularProgress,
  Snackbar,
} from '@mui/material';

const StudentTopicDetails = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [topicData, setTopicData] = useState(null);

  useEffect(() => {
    const fetchStudentTopicData = async () => {
      setLoading(true);
      setError('');

      try {
        // Get studentID from localStorage
        const userDataStr = localStorage.getItem('User');
        if (!userDataStr) {
          setError('User data not found in localStorage.');
          return;
        }

        const userData = JSON.parse(userDataStr);
        if (!userData.studentInfo || !userData.studentInfo.studentID) {
          setError('Student ID not found in user data.');
          return;
        }

        const studentID = userData.studentInfo.studentID;

        const response = await axios.get(`https://localhost:7217/api/Student/${studentID}/topics`);
        setTopicData(response.data);
      } catch (error) {
        console.error('Error fetching student topic data:', error);
        setError('Failed to fetch student topic data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchStudentTopicData();
  }, []);

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ padding: '20px' }}>
        <Typography variant="h5" gutterBottom>
          Student Topic Details
        </Typography>
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 4 }}>
            <CircularProgress />
          </Box>
        )}
        {error && (
          <Snackbar
            open={!!error}
            autoHideDuration={6000}
            onClose={() => setError('')}
            message={error}
          />
        )}
        {topicData && (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6">Mã sinh viên: {topicData.studentID}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6">Sinh viên: {topicData.studentName}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6">Tiêu đề: {topicData.title}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1">Mô tả: {topicData.description}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6">Giảng viên: {topicData.teacherName}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6">Lĩnh vực: {topicData.fieldName}</Typography>
            </Grid>
          </Grid>
        )}
      </Paper>
    </Container>
  );
};

export default StudentTopicDetails;
