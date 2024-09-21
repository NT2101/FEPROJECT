import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Grid, Paper, Typography, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';

const CommitteesPage = () => {
  const [committees, setCommittees] = useState([]);

  const getTeacherID = () => {
    const userDataStr = localStorage.getItem('User');
    if (userDataStr) {
      const userData = JSON.parse(userDataStr);
      if (userData && userData.teacherInfo && userData.teacherInfo.teacherID) {
        return userData.teacherInfo.teacherID;
      }
    }
    return null;
  };

  const fetchCommitteesForTeacher = async () => {
    const teacherID = getTeacherID();
    if (teacherID) {
      try {
        const response = await axios.get(`https://localhost:7217/api/Committee/GetCommitteesByTeacher/${teacherID}`);
        console.log('Fetched committees:', response.data); // Log dữ liệu nhận được từ API
        setCommittees(response.data || []); // Đảm bảo giá trị mặc định là mảng rỗng
      } catch (error) {
        console.error("Error fetching committees for teacher:", error);
      }
    }
  };

  useEffect(() => {
    fetchCommitteesForTeacher();
  }, []);

  console.log('Committees data:', committees); // Log dữ liệu để kiểm tra

  return (
    <Grid container spacing={2} padding={2}>
      <Grid item xs={12}>
        <Paper style={{ padding: 16 }}>
          <Typography variant="h6" gutterBottom>
            Danh sách hội đồng của bạn
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Mã hội đồng</TableCell>
                <TableCell>Tên hội đồng</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {committees.length > 0 ? (
                committees.map((committee) => (
                  <TableRow key={committee.committeeID}>
                    <TableCell>{committee.committeeID}</TableCell>
                    <TableCell>{committee.committeeName}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2}>Không có dữ liệu</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default CommitteesPage;
