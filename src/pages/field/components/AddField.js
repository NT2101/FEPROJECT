import React from 'react';
import { Box, Button, TextField, Grid } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import { useSnackbar } from 'notistack';

const validationSchema = yup.object({
    fieldName: yup.string().required('Trường tên không được để trống'),
    description: yup.string(),
});

function AddField({ onClick }) {
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            fieldName: '',
            description: '',
        },
        resolver: yupResolver(validationSchema)
    });

    const { enqueueSnackbar } = useSnackbar();  // Hook for notifications

    const onSubmit = async (data) => {
        try {
            await axios.post('https://localhost:7217/api/Fields', data);
            enqueueSnackbar('Thêm dữ liệu thành công', { variant: 'success' ,autoHideDuration: 5000 });  // Show success notification

            onClick();  // Refresh the list
        } catch (error) {
            console.error('Error adding field:', error);
            enqueueSnackbar('Lỗi khi thêm dữ liệu', { variant: 'error' ,autoHideDuration: 5000 });  // Show error notification
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        label="Tên Trường"
                        {...register('fieldName')}
                        fullWidth
                        error={Boolean(errors.fieldName)}
                        helperText={errors.fieldName?.message}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="Mô Tả"
                        {...register('description')}
                        fullWidth
                        multiline
                        rows={4}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button type="submit" variant="contained" color="primary">
                        Thêm Mới
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
}

export default AddField;
