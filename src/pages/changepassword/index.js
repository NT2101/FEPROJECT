import React from 'react';
import { useForm } from 'react-hook-form';
import { Box, Button, TextField, Typography, Grid, Container } from '@mui/material';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

const ChangePassword = () => {
    const { enqueueSnackbar } = useSnackbar();

    const showNotification = (message, type) => {
        enqueueSnackbar(message, { variant: type });
    };

    // Schema validation for the form using Yup
    const validationSchema = Yup.object().shape({
        oldPassword: Yup.string().required('Old password is required'),
        newPassword: Yup.string()
            .required('New password is required')
            .min(6, 'New password must be at least 6 characters'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
            .required('Confirm password is required'),
    });

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(validationSchema),
    });

    const onSubmit = async (data) => {
        try {
            const userDataStr = localStorage.getItem('User');
            const userData = JSON.parse(userDataStr);
            const accountID = userData?.account?.id;

            if (!accountID) {
                showNotification('User ID not found in local storage.', 'error');
                return;
            }

            const response = await axios.post(`https://localhost:7217/api/Authentication/ChangePassword`, {
                accountID: accountID,
                oldPassword: data.oldPassword,
                newPassword: data.newPassword,
            });

            if (response.data.success) {
                showNotification('Password changed successfully!', 'success');
            } else {
                showNotification(response.data.message || 'Failed to change password.', 'error');
            }
        } catch (error) {
            showNotification('Error changing password: ' + error.message, 'error');
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                sx={{
                    mt: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography component="h1" variant="h5" gutterBottom>
                   Đổi mật khẩu
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            variant="outlined"
                            fullWidth
                            label="Mật khẩu mới"
                            type="password"
                            {...register('oldPassword')}
                            error={Boolean(errors.oldPassword)}
                            helperText={errors.oldPassword?.message}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            variant="outlined"
                            fullWidth
                            label="Mật khẩu mới"
                            type="password"
                            {...register('newPassword')}
                            error={Boolean(errors.newPassword)}
                            helperText={errors.newPassword?.message}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            variant="outlined"
                            fullWidth
                            label="Xác nhận mật khẩu"
                            type="password"
                            {...register('confirmPassword')}
                            error={Boolean(errors.confirmPassword)}
                            helperText={errors.confirmPassword?.message}
                        />
                    </Grid>
                </Grid>
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    sx={{ mt: 3, mb: 2 }}
                >
                    Đổi mật khẩu
                </Button>
            </Box>
        </Container>
    );
};

export default ChangePassword;
