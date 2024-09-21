import React from 'react';
import { Box, Button, Grid, TextField, MenuItem, FormControl, InputLabel, Select } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useSnackbar } from 'notistack';
import axios from 'axios';

// Define the validation schema
const validationSchema = yup.object({
  name: yup.string().required('Tên không được để trống'),
  password: yup.string().required('Mật khẩu không được để trống'),
  roleID: yup.number().required('Vai trò ID không được để trống').oneOf([1, 2, 3], 'Vai trò không hợp lệ'),
  status: yup.number().required('Trạng thái không được để trống').min(0, 'Trạng thái không hợp lệ'),
  sex: yup.number().required('Giới tính không được để trống').oneOf([0, 1], 'Giới tính không hợp lệ')
});

function UpdateAccountForm({ account, onClose }) {
  const { enqueueSnackbar } = useSnackbar();

  // Initialize form with default values from the account prop
  const form = useForm({
    defaultValues: {
      name: account?.name ,
      password: '',
      roleID: account?.roleID ,
      status: account?.status ,
    },
    resolver: yupResolver(validationSchema)
  });

  const { handleSubmit, register, setValue, formState: { errors } } = form;

  const onSubmit = async (values) => {
    try {
      if (account?.id) {
        const response = await axios.put(`https://localhost:7217/api/Accounts/${account.id}`, values);

        if (response.status === 204) {
          enqueueSnackbar('Cập nhật thành công', { variant: 'success' });
          onClose();
        } else {
          enqueueSnackbar('Lỗi cập nhật', { variant: 'error' });
        }
      } else {
        enqueueSnackbar('Không tìm thấy tài khoản để cập nhật', { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar('Lỗi không xác định', { variant: 'error' });
    }
  };

  if (!account) {
    return <p>Không có thông tin tài khoản.</p>;
  }
  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ padding: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Tên"
            {...register('name')}
            error={!!errors.name}
            helperText={errors.name?.message}
            fullWidth
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Mật khẩu"
            type="password"
            {...register('password')}
            error={!!errors.password}
            helperText={errors.password?.message}
            fullWidth
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth variant="outlined" error={!!errors.roleID}>
            <InputLabel id="role-id-label">Vai trò</InputLabel>
            <Select
              labelId="role-id-label"
              label="Vai trò"
              {...register('roleID')}
              onChange={(e) => setValue('roleID', Number(e.target.value))}
            >
              <MenuItem value={1}>Sinh viên</MenuItem>
              <MenuItem value={2}>Giảng viên</MenuItem>
              <MenuItem value={3}>Quản trị viên</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            label="Trạng thái"
            type="number"
            {...register('status')}
            error={!!errors.status}
            helperText={errors.status?.message}
            fullWidth
            variant="outlined"
          />
        </Grid>
      </Grid>
      <Box mt={2}>
        <Button type="submit" variant="contained" color="primary">
          Cập nhật
        </Button>
        <Button onClick={onClose} variant="outlined" color="secondary" sx={{ ml: 2 }}>
          Đóng
        </Button>
      </Box>
    </Box>
  );
}

export default UpdateAccountForm;
