import React from 'react';
import { Box, Button, Grid, TextField } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useSnackbar } from 'notistack';
import axios from 'axios';

// Define the validation schema
const validationSchema = yup.object({
  name: yup.string().required('Tên không được để trống'),
  password: yup.string().required('Mật khẩu không được để trống'),
});

function AddAccount() {
  const { enqueueSnackbar } = useSnackbar();

  const form = useForm({
    defaultValues: {
      name: '',
      password: '',
    },
    resolver: yupResolver(validationSchema)
  });

  const { handleSubmit, register, formState: { errors } } = form;

  const onSubmit = async (values) => {
    try {
      const response = await axios.post('https://localhost:7217/api/Accounts', values);

      if (response.status === 201) {
        enqueueSnackbar('Tạo tài khoản thành công!', { variant: 'success', autoHideDuration: 5000  });
        // Sử dụng setTimeout để trì hoãn việc tải lại trang
        setTimeout(() => {
          location.reload();
        }, 1000); // Trì hoãn 1 giây để thông báo có thời gian hiển thị
      } else {
        // Nếu không phải mã trạng thái 201, thông báo lỗi chi tiết
        enqueueSnackbar(`Lỗi khi tạo tài khoản: ${response.statusText}`, { variant: 'error', autoHideDuration: 5000  });
      }
    } catch (error) {
      // Xử lý lỗi chi tiết từ server nếu có
      const errorMessage = error.response?.data?.message || 'Lỗi không xác định';
      enqueueSnackbar(`Lỗi khi tạo tài khoản: ${errorMessage}`, { variant: 'error', autoHideDuration: 5000  });
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ padding: 2 }}>
     <Grid container rowSpacing={2} columnSpacing={{ sm: 3}}>
        <Grid item xs={8}>
          <TextField
            label="Tên"
            {...register('name')}
            error={!!errors.name}
            helperText={errors.name?.message}
            fullWidth
            variant="outlined"
          />
        </Grid>
        <Grid item xs={8}>
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
      </Grid>
      <Box mt={2}>
        <Button type="submit" variant="contained" color="primary">
          Thêm tài khoản
        </Button>
       
      </Box>
    </Box>
  );
}

export default AddAccount;
