import React, { useState } from 'react';
import { Grid, Stack, Typography, Box, Button } from '@mui/material';
import AuthWrapper from './AuthWrapper';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import InputField from '../../components/FormControl/InputField';
import PasswordField from '../../components/FormControl/PasswordField';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from 'store/reducers/authentication';

function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false);

    const validationSchema = yup.object({
        username: yup.string().required('Nhập vào tên tài khoản!'),
        password: yup.string().required('Chưa nhập mật khẩu').min(3, 'Mật khẩu phải lớn hơn 3 ký tự')
    });

  

    const showNotification = (message, type) => {
        enqueueSnackbar(message, { variant: type });
    }

    const onSubmit = async (values) => {
        setLoading(true);
        const loginData = {
            username: values.username,
            password: values.password
        };
    
        try {
            const resultAction = await dispatch(login(loginData));
            const result = resultAction.payload;
    
            if (result && result.account.roleID !== undefined) {
                showNotification('Xin chào, ' + values.username, "success");
    
                // Navigate based on roleID
                if (result.account.roleID === 1) { // Student
                    navigate('/');
                } else if (result.account.roleID === 2) { // Teacher
                    navigate('/');
                } else {
                    navigate('/'); // Default route for other roles
                }
    
                // Ensure the page is re-rendered to reflect the new role
                window.location.reload(); // This forces the page to reload and update the menu items
            } else {
                showNotification('Tài khoản hoặc mật khẩu chưa chính xác', "error");
            }
        } catch (error) {
            console.error('Login error:', error);
            showNotification('Đã xảy ra lỗi khi đăng nhập', "error");
        } finally {
            setLoading(false);
        }
    };
    

    const form = useForm({
        defaultValues: {
            username: '',
            password: ''
        },
        resolver: yupResolver(validationSchema)
    });

    return (
        <AuthWrapper>
            <Box component="form" style={{ minWidth: '400px' }} onSubmit={form.handleSubmit(onSubmit)}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Stack direction="row" justifyContent="space-between" alignItems="baseline">
                            <Typography variant="h3">HỆ THỐNG QUẢN LÝ ĐỒ ÁN</Typography>
                        </Stack>
                    </Grid>
                    <Grid item xs={12}>
                        <InputField form={form} name="username" label="Tên tài khoản" />
                        <PasswordField form={form} name='password' label='Mật khẩu' />
                        <Button disabled={loading} type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                            Đăng nhập
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </AuthWrapper>
    );
}

export default Login;
