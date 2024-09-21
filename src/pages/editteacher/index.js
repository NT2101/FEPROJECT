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
} from '@mui/material';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { format, parseISO, parse } from 'date-fns';

const TeacherUpdateForm = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { register, handleSubmit, setValue } = useForm();
  const [teacherID, setTeacherID] = useState(null);
  const [teacherStatus, setTeacherStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [teacherData, setTeacherData] = useState(null);

  useEffect(() => {
    const fetchTeacherID = () => {
      const userDataStr = localStorage.getItem('User');
      if (userDataStr) {
        const userData = JSON.parse(userDataStr);
        if (userData && userData.teacherInfo && userData.teacherInfo.teacherID) {
          setTeacherID(userData.teacherInfo.teacherID);
          setTeacherStatus(userData.teacherInfo.status);
        }
      }
    };

    fetchTeacherID();
  }, []);

  useEffect(() => {
    if (teacherID) {
      fetchTeacherData();
    }
  }, [teacherID]);

  const fetchTeacherData = async () => {
    try {
      const response = await axios.get(`https://localhost:7217/api/Teacher/${teacherID}`);
      if (response.status === 200) {
        const teacherData = response.data;
        setTeacherData(teacherData);

        // Convert date format to dd/MM/yyyy
        const formattedDate = format(parseISO(teacherData.dob), 'dd/MM/yyyy');

        setValue('name', teacherData.name);
        setValue('dob', formattedDate);
        setValue('sex', teacherData.sex);
        setValue('phoneNumber', teacherData.phoneNumber);
        setValue('description', teacherData.description);
        setValue('emailAddress', teacherData.emailAddress);
        setValue('password', ''); // Ensure the password field is set but not pre-filled
      }
    } catch (err) {
      showNotification('Lấy thông tin giảng viên thất bại: ' + err.message, 'error');
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
        `https://localhost:7217/api/Teacher/Update/${teacherID}`,
        {
          ...data,
          dob: formattedDateForApi
        }
      );
      if (response.status === 204) {
        showNotification('Cập nhật thông tin giảng viên thành công!', 'success');

        // Update localStorage
        const userDataStr = localStorage.getItem('User');
        if (userDataStr) {
          const userData = JSON.parse(userDataStr);
          userData.teacherInfo.status = 2; // Update status
          localStorage.setItem('User', JSON.stringify(userData));
        }

        // Navigate to a different page
        location.reload(); // Replace '/new-page' with the route you want to navigate to

        fetchTeacherData(); // Refresh the data to show updated values
      }
    } catch (err) {
      showNotification('Cập nhật thông tin giảng viên thất bại: ' + err.message, 'error');
    }
  };
console.log(teacherStatus);

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
    <Box sx={{ padding: 4, maxWidth: 900, margin: 'auto' }}>
      <Typography variant="h4" gutterBottom sx={{ marginBottom: 2, fontWeight: 'bold' }}>
        {teacherStatus === 1 ? 'Cập Nhật Giảng Viên' : 'Thông Tin Giảng Viên'}
      </Typography>
      
      {teacherStatus === 1 ? (
        <form onSubmit={handleSubmit(handleSubmitForm)}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Tên"
                {...register('name', { required: 'Tên là bắt buộc' })}
                InputLabelProps={{ shrink: true }}
                sx={{ '& .MuiInputLabel-root': { top: -6, left: 0 } }}
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
                sx={{ '& .MuiInputLabel-root': { top: -6, left: 0 } }}
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
                label="Mô tả" 
                {...register('description', { required: 'Mô tả là bắt buộc' })}
                InputLabelProps={{ shrink: true }}
                sx={{ '& .MuiInputLabel-root': { top: -6, left: 0 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Số điện thoại"
                {...register('phoneNumber', { required: 'Số điện thoại là bắt buộc' })}
                InputLabelProps={{ shrink: true }}
                sx={{ '& .MuiInputLabel-root': { top: -6, left: 0 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                {...register('emailAddress', { required: 'Email là bắt buộc' })}
                InputLabelProps={{ shrink: true }}
                sx={{ '& .MuiInputLabel-root': { top: -6, left: 0 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Mật khẩu"
                type="password"
                {...register('password', { required: 'Mật khẩu là bắt buộc' })}
                InputLabelProps={{ shrink: true }}
                sx={{ '& .MuiInputLabel-root': { top: -6, left: 0 } }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" sx={{ marginTop: 2 }}>
                Cập nhật
              </Button>
            </Grid>
          </Grid>
        </form>
      ) : (
        <Box sx={{ marginTop: 4 }}>
        <Card sx={{ maxWidth: 800, margin: 'auto', boxShadow: 3, borderRadius: 2 }}>
          <CardContent sx={{ padding: 4 }}>
  
            <Box>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Tên:</strong> {teacherData?.name}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Ngày sinh:</strong> {format(parseISO(teacherData?.dob), 'dd/MM/yyyy')}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Giới tính:</strong> {teacherData?.sex === 0 ? 'Nam' : 'Nữ'}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Số điện thoại:</strong> {teacherData?.phoneNumber}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Email:</strong> {teacherData?.emailAddress}
              </Typography>
              <Typography variant="body1">
                <strong>Mô tả:</strong> {teacherData?.description}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
      
      )}
    </Box>
  );
};

export default TeacherUpdateForm;
