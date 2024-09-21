import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { format, parse } from 'date-fns';

const StudentUpdateForm = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { register, handleSubmit, setValue } = useForm();
  const [studentID, setStudentID] = useState(null);
  const [studentStatus, setStudentStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [studentData, setStudentData] = useState(null);

  useEffect(() => {
    const fetchStudentID = () => {
      const userDataStr = localStorage.getItem('User');
      if (userDataStr) {
        const userData = JSON.parse(userDataStr);
        if (userData && userData.studentInfo && userData.studentInfo.studentID) {
          setStudentID(userData.studentInfo.studentID);
          setStudentStatus(userData.studentInfo.status);
        }
      }
    };

    fetchStudentID();
  }, []);

  useEffect(() => {
    if (studentID) {
      fetchStudentData();
    }
  }, [studentID]);

  const fetchStudentData = async () => {
    try {
      const response = await axios.get(`https://localhost:7217/api/Student/StudentID?StudentID=${studentID}`);
      if (response.status === 200) {
        const studentData = response.data;
        setStudentData(studentData);

        // Convert date format to dd/MM/yyyy
        const formattedDate = format(new Date(studentData.dob), 'dd/MM/yyyy');

        setValue('name', studentData.name);
        setValue('dob', formattedDate);
        setValue('sex', studentData.sex);
        setValue('address', studentData.address);
        setValue('phoneNumber', studentData.phoneNumber);
        setValue('emailAddress', studentData.emailAddress);
        setValue('country', studentData.country);
      }
    } catch (err) {
      showNotification('Lấy thông tin sinh viên thất bại: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitForm = async (data) => {
    try {
      // Convert date format from dd/MM/yyyy to yyyy-MM-dd
      const parsedDate = parse(data.dob, 'dd/MM/yyyy', new Date());
      const formattedDateForApi = format(parsedDate, 'yyyy-MM-dd');
  
      const response = await axios.put(
        `https://localhost:7217/api/Student/Update/${studentID}`,
        {
          ...data,
          dob: formattedDateForApi
        }
      );
      if (response.status === 204) {
        showNotification('Cập nhật thông tin sinh viên thành công!', 'success');
     
        const userDataStr = localStorage.getItem('User');
        if (userDataStr) {
          const userData = JSON.parse(userDataStr);
          userData.studentInfo.status = 2; // Update status
          userData.studentInfo.statusTopic = 1; // Update status
          localStorage.setItem('User', JSON.stringify(userData));
        }

        // Navigate to a different page
        location.reload(); // Replace '/new-page' with the route you want to navigate to

        // Update studentStatus
  
        // Refresh the data to show updated values
        fetchStudentData();
      }
    } catch (err) {
      showNotification('Cập nhật thông tin sinh viên thất bại: ' + err.message, 'error');
    }
  };
  
console.log(studentStatus);

  const showNotification = (message, type) => {
    enqueueSnackbar(message, { variant: type });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom sx={{ marginBottom: 2 }}>
        {studentStatus === 1 ? 'Cập Nhật Sinh Viên' : 'Thông Tin Sinh Viên'}
      </Typography>
      
      {studentStatus === 1 ? (
        <form onSubmit={handleSubmit(handleSubmitForm)}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Tên"
                {...register('name', { required: 'Tên là bắt buộc' })}
                InputLabelProps={{ shrink: true }}
                sx={{ '& .MuiInputLabel-root': { top: -6, left: 0 }, '& .MuiInputBase-root': { paddingTop: '16px' } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="text"
                label="Ngày sinh"
                placeholder="dd/MM/yyyy"
                InputLabelProps={{ shrink: true }}
                {...register('dob', { required: 'Ngày sinh là bắt buộc' })}
                sx={{ '& .MuiInputLabel-root': { top: -6, left: 0 }, '& .MuiInputBase-root': { paddingTop: '16px' } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="gender-label">Giới tính</InputLabel>
                <Select
                  labelId="gender-label"
                  label="Giới tính"
                  {...register('sex', { required: 'Giới tính là bắt buộc' })}
                >
                  <MenuItem value={0}>Nam</MenuItem>
                  <MenuItem value={1}>Nữ</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Địa chỉ"
                {...register('address', { required: 'Địa chỉ là bắt buộc' })}
                InputLabelProps={{ shrink: true }}
                sx={{ '& .MuiInputLabel-root': { top: -6, left: 0 }, '& .MuiInputBase-root': { paddingTop: '16px' } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Số điện thoại"
                {...register('phoneNumber', { required: 'Số điện thoại là bắt buộc' })}
                InputLabelProps={{ shrink: true }}
                sx={{ '& .MuiInputLabel-root': { top: -6, left: 0 }, '& .MuiInputBase-root': { paddingTop: '16px' } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                {...register('emailAddress', { required: 'Email là bắt buộc' })}
                InputLabelProps={{ shrink: true }}
                sx={{ '& .MuiInputLabel-root': { top: -6, left: 0 }, '& .MuiInputBase-root': { paddingTop: '16px' } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Quê quán"
                {...register('country', { required: 'Quê quán là bắt buộc' })}
                InputLabelProps={{ shrink: true }}
                sx={{ '& .MuiInputLabel-root': { top: -6, left: 0 }, '& .MuiInputBase-root': { paddingTop: '16px' } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Mật khẩu"
                type="password"
                {...register('password', { required: 'Mật khẩu là bắt buộc' })}
                InputLabelProps={{ shrink: true }}
                sx={{ '& .MuiInputLabel-root': { top: -6, left: 0 }, '& .MuiInputBase-root': { paddingTop: '16px' } }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary">
                Cập nhật
              </Button>
            </Grid>
          </Grid>
        </form>
      ) : (
        <Box sx={{ marginTop: 2 }}>
          <Card sx={{ maxWidth: 800, margin: 'auto' }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Thông tin của sinh viên
              </Typography>
              <Divider sx={{ marginY: 2 }} />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="body1">
                  <strong>Tên:</strong> {studentData?.name}
                </Typography>
                <Typography variant="body1">
                  <strong>Ngày sinh:</strong> {studentData ? format(new Date(studentData.dob), 'dd/MM/yyyy') : ''}
                </Typography>
                <Typography variant="body1">
                  <strong>Giới tính:</strong> {studentData?.sex === 0 ? 'Nam' : 'Nữ'}
                </Typography>
                <Typography variant="body1">
                  <strong>Địa chỉ:</strong> {studentData?.address}
                </Typography>
                <Typography variant="body1">
                  <strong>Số điện thoại:</strong> {studentData?.phoneNumber}
                </Typography>
                <Typography variant="body1">
                  <strong>Email:</strong> {studentData?.emailAddress}
                </Typography>
                <Typography variant="body1">
                  <strong>Quê quán:</strong> {studentData?.country}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>
      )}
    </Box>
  );
};

export default StudentUpdateForm;
