import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Box
} from '@mui/material';

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

const getStatusLabel = (status) => {
  switch (status) {
    case 1:
      return 'Chưa xác nhận';
    case 2:
      return 'Đang chờ xét duyệt';
    case 3:
      return 'Đã bị từ chối';
    case 4:
      return 'Đã xác nhận';
    default:
      return 'Unknown';
  }
};

const GetTopicsByTeacher = () => {
  const { teacherID } = getUserRoleAndTeacherID();

  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        if (!teacherID) {
          throw new Error('Teacher ID not found');
        }

        const response = await axios.get(`https://localhost:7217/api/Topic/GetTopicsByTeacher/${teacherID}`);
        setTopics(response.data);
      } catch (err) {
        setError('Không có yêu cầu nào được gửi');
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, [teacherID]);

  const handleAgree = async (topicID) => {
    try {
      await axios.put(`https://localhost:7217/api/Topic/Agree/${topicID}`);
      const response = await axios.get(`https://localhost:7217/api/Topic/GetTopicsByTeacher/${teacherID}`);
      setTopics(response.data);
    } catch (err) {
      console.error('Error updating topic:', err);
      setError('Error updating topic. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleDisagree = async (topicID) => {
    try {
      await axios.put(`https://localhost:7217/api/Topic/Disagree/${topicID}`);
      const response = await axios.get(`https://localhost:7217/api/Topic/GetTopicsByTeacher/${teacherID}`);
      setTopics(response.data);
    } catch (err) {
      console.error('Error updating topic:', err);
      setError('Error updating topic. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box sx={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column', padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Danh sách hướng dẫn của giảng viên
      </Typography>
      <Box sx={{ flexGrow: 1, overflowX: 'auto' }}>
        <TableContainer component={Paper} sx={{ width: '100%' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">STT</TableCell>
                <TableCell align="center">Tên đề tài</TableCell>
                <TableCell align="center">Mã sinh viên</TableCell>
                <TableCell align="center">Tên sinh viên</TableCell>
                <TableCell align="center">Lớp</TableCell>
                <TableCell align="center">Mô tả</TableCell>
                <TableCell align="center">Trạng thái</TableCell>
                <TableCell align="center">Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {topics.map((topic, index) => (
                topic.status !== 3 &&  topic.status !== 6  && ( // Ẩn dòng có status là 3
                  <TableRow key={topic.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell align="center" component="th" scope="row">{index +1 }</TableCell>
                    <TableCell >{topic.title}</TableCell>
                    <TableCell align="center">{topic.studentID}</TableCell>
                    <TableCell >{topic.studentName}</TableCell>
                    <TableCell>{topic.classID}</TableCell>
                    <TableCell  >{topic.description}</TableCell>
                    <TableCell align="center">{getStatusLabel(topic.status)}</TableCell>
                    <TableCell align="center">z
                      {topic.status === 1 && ( // Hiển thị nút Agree khi status là 1
                        <Button variant="contained" color="primary" onClick={() => handleAgree(topic.id)}>
                          Xác nhận
                        </Button>
                      )}
                      {topic.status === 1 && ( // Hiển thị nút Disagree khi status là 1
                        <Button variant="contained" color="secondary" onClick={() => handleDisagree(topic.id)} sx={{ marginLeft: 1 }}>
                          Từ chối
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                )
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default GetTopicsByTeacher;
