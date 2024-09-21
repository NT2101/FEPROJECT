import React, { useEffect } from 'react';
import { Box, Button, TextField, Grid } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import { useSnackbar } from 'notistack';  // Import useSnackbar

const validationSchema = yup.object({
    fieldName: yup.string().required('Trường tên không được để trống'),
    description: yup.string(),
});

function EditField({ field, onClick }) {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(validationSchema)
    });
    const { enqueueSnackbar } = useSnackbar();  // Initialize useSnackbar

    useEffect(() => {
        if (field) {
            setValue('fieldName', field.fieldName);
            setValue('description', field.description);
        }
    }, [field, setValue]);

    const onSubmit = async (data) => {
        try {
            await axios.put(`https://localhost:7217/api/Fields/${field.id}`, data);
            enqueueSnackbar('Cập nhật dữ liệu thành công', { variant: 'success', autoHideDuration: 5000 });  // Show success notification
            onClick();  // Close the form
        } catch (error) {
            console.error('Error updating field:', error);
            enqueueSnackbar('Lỗi khi cập nhật dữ liệu', { variant: 'error', autoHideDuration: 5000 });  // Show error notification
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
                        Cập Nhật
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
}

export default EditField;
