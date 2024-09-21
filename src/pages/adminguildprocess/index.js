import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const AdminDashboard = () => {
  const [reports, setReports] = useState([]);
  const [newReport, setNewReport] = useState({ studentId: '', teacherId: '', comments: '' });

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    const response = await axios.get('https://localhost:7217//api/ProgressReports');
    setReports(response.data);
  };

  const handleCreateReport = async () => {
    await axios.post('https://localhost:7217/api/ProgressReports', newReport);
    fetchReports();
  };

  return (
    <Container>
      <h2>Admin Dashboard</h2>
      <TextField
        label="Student ID"
        value={newReport.studentId}
        onChange={(e) => setNewReport({ ...newReport, studentId: e.target.value })}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Teacher ID"
        value={newReport.teacherId}
        onChange={(e) => setNewReport({ ...newReport, teacherId: e.target.value })}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Comments"
        value={newReport.comments}
        onChange={(e) => setNewReport({ ...newReport, comments: e.target.value })}
        fullWidth
        margin="normal"
      />
      <Button variant="contained" color="primary" onClick={handleCreateReport}>Create Report</Button>
      
      <h3>Progress Reports</h3>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Student ID</TableCell>
              <TableCell>Teacher ID</TableCell>
              <TableCell>Comments</TableCell>
              <TableCell>Submission Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reports.map((report) => (
              <TableRow key={report.reportID}>
                <TableCell>{report.reportID}</TableCell>
                <TableCell>{report.studentID}</TableCell>
                <TableCell>{report.teacherID}</TableCell>
                <TableCell>{report.comments}</TableCell>
                <TableCell>{report.submissionDate}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default AdminDashboard;
