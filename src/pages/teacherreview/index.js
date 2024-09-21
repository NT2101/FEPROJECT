import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Link, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const getUserRoleAndTeacherID = () => {
  const userDataStr = localStorage.getItem('User');
  if (userDataStr) {
    const userData = JSON.parse(userDataStr);
    if (userData && userData.account) {
      const teacherID = userData.teacherInfo ? userData.teacherInfo.teacherID : null;
      return { teacherID };
    }
  }
  return { teacherID: null };
};

const TeacherReview = () => {
  const [progresses, setProgresses] = useState([]);
  const [selectedProgressID, setSelectedProgressID] = useState('');
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [comments, setComment] = useState('');
  const { teacherID } = getUserRoleAndTeacherID();

  useEffect(() => {
    const fetchProgresses = async () => {
      try {
        const response = await axios.get(`https://localhost:7217/api/TeacherReview/GetProgressesWithReports/${teacherID}`);
        setProgresses(response.data);
      } catch (error) {
        console.error('Lỗi khi lấy tiến độ:', error);
      }
    };

    fetchProgresses();
  }, [teacherID]);

  useEffect(() => {
    if (selectedProgressID) {
      const fetchReports = async () => {
        try {
          const response = await axios.get(`https://localhost:7217/api/ProgressReport/GetReportsByProgressAndTeacher/${selectedProgressID}/${teacherID}`);
          setReports(response.data);
        } catch (error) {
          console.error('Lỗi khi lấy báo cáo:', error);
        }
      };

      fetchReports();
    }
  }, [selectedProgressID, teacherID]);

  const handleAddComment = async () => {
    try {
      await axios.put(`https://localhost:7217/api/ProgressReport/AddComment/${selectedReport.reportID}`, 
        { Comment: comments }, // Adjusted to match CommentDTO
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      // Refresh reports list after adding comment
      const response = await axios.get(`https://localhost:7217/api/ProgressReport/GetReportsByProgressAndTeacher/${selectedProgressID}/${teacherID}`);
      setReports(response.data);
      setSelectedReport(null);
      setComment('');
    } catch (error) {
      console.error('Lỗi khi thêm bình luận:', error);
    }
  };

  return (
    <Container>
      <h3>Báo cáo tiến độ</h3>
      <FormControl fullWidth margin="normal">
        <InputLabel>Chọn tiến độ</InputLabel>
        <Select
          value={selectedProgressID}
          onChange={(e) => setSelectedProgressID(e.target.value)}
        >
          {progresses.map((progress) => (
            <MenuItem key={progress.progressID} value={progress.progressID}>
              {progress.title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>STT</TableCell>
              <TableCell>Mã Sinh viên</TableCell>
              <TableCell>Tên Sinh viên</TableCell>
              <TableCell>Tệp</TableCell>
              <TableCell>Bình luận</TableCell>
              <TableCell>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {reports.map((report, index) => (
            <TableRow key={report.reportID}>
              <TableCell>{index + 1}</TableCell> {/* Sequential number */}
              <TableCell>{report.studentID}</TableCell>
              <TableCell>{report.studentName}</TableCell>
              <TableCell>
                {report.filePath && (
                  <Link href={`https://localhost:7217/api/TeacherReview/DownloadFile/${report.reportID}`} target="_blank">
                    {report.fileName}
                  </Link>
                )}
              </TableCell>
              <TableCell>{report.comments || 'Chưa có bình luận'}</TableCell>
              <TableCell>
                <Button variant="contained" color="secondary" onClick={() => setSelectedReport(report)}>Thêm bình luận</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>

        </Table>
      </TableContainer>

      {selectedReport && (
        <div>
          <h3>Thêm nhận xét cho báo cáo </h3>
          <TextField
            label="Nhận xét"
            value={comments}
            onChange={(e) => setComment(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Button variant="contained" color="primary" onClick={handleAddComment}>Thêm nhận xét</Button>
        </div>
      )}
    </Container>
  );
};

export default TeacherReview;
