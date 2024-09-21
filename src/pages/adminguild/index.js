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

const getStatusLabel = (status) => {
  switch (status) {
    case 1:
      return 'Đang chờ giảng viên xét duyệt';
    case 2:
      return 'Chưa xác nhận';
    case 3:
      return 'Bị từ chối';
    case 4:
      return 'Đã xác nhận';
    default:
      return 'Unknown';
  }
};

const GetTopics = () => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await axios.get('https://localhost:7217/api/Topic/GetTopicsByStatus');
        setTopics(response.data);
      } catch (err) {
        setError('Không có yêu cầu nào được gửi');
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, []);

  const handleAgree = async (topicID) => {
    try {
      await axios.put(`https://localhost:7217/api/Topic/AdminAgree/${topicID}`);
      const response = await axios.get('https://localhost:7217/api/Topic/GetAllTopics');
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
      const response = await axios.get('https://localhost:7217/api/Topic/GetAllTopics');
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
        Danh sách đề tài
      </Typography>
      <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
        <TableContainer component={Paper} sx={{ width: '100%', overflowX: 'auto' }}>
          <Table sx={{ minWidth: 1200 }}>
            <TableHead>
              <TableRow>
                <TableCell align="center">STT</TableCell>
                <TableCell align="center">Tên đề tài</TableCell>
                <TableCell align="center">Mã sinh viên</TableCell>
                <TableCell align="center">Tên sinh viên</TableCell>
                <TableCell align="center">Lớp</TableCell>
                <TableCell align="center">Mô tả</TableCell>
                <TableCell align="center">Trạng thái</TableCell>
                <TableCell align="center">Tên giảng viên</TableCell>
                <TableCell align="center">Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {topics.map((topic, index) => (
                <TableRow key={topic.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell align="center" component="th" scope="row">{index + 1}</TableCell>
                  <TableCell align="">{topic.title}</TableCell>
                  <TableCell align="center">{topic.studentID}</TableCell>
                  <TableCell align="">{topic.studentName}</TableCell>
                  <TableCell align="">{topic.classID}</TableCell>
                  <TableCell align="  ">{topic.description}</TableCell>
                  <TableCell align="">{getStatusLabel(topic.status)}</TableCell>
                  <TableCell align="">{topic.teacherName}</TableCell>
                  <TableCell align="center">z
                    {topic.status === 2 && (
                      <>
                        <Button variant="contained" color="primary" onClick={() => handleAgree(topic.id)}>
                          Xác nhận
                        </Button>
                        <Button variant="contained" color="secondary" onClick={() => handleDisagree(topic.id)} sx={{ marginLeft: 1 }}>
                          Từ chối
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default GetTopics;
