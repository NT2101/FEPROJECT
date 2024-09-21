import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { useSnackbar } from 'notistack';
import { Box, Button, DialogActions, DialogContent, Grid, MenuItem, Typography, InputLabel, Select, TextField, FormControl } from '@mui/material';
import {  editClass } from '../../../store/reducers/class';
import { getSpecialization } from '../../../store/reducers/specialization';

function EditClass({ item, onClick }) {
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const [specializations, setSpecializations] = useState([]);

    useEffect(() => {
        const fetchSpecializations = async () => {
            try {
                const resultAction = await dispatch(getSpecialization());
                if (resultAction.payload) {
                    setSpecializations(resultAction.payload);
                }
            } catch (error) {
                console.error('Error fetching specializations:', error);
            }
        };

        fetchSpecializations();
    }, [dispatch]);

    const validationSchema = yup.object({
        id: yup.string().required('Nhập vào mã lớp!'),
        className: yup.string().required('Nhập vào tên lớp!'),
        specializationID: yup.string().required('Chọn ngành!'),
        description: yup.string().required('Nhập vào mô tả!'),
    });

    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        defaultValues: item,
        resolver: yupResolver(validationSchema)
    });

    const onSubmit = async (values) => {
        try {
            const resultAction = await dispatch(editClass(values));
            if (resultAction.payload) {
                enqueueSnackbar('Ghi dữ liệu thành công', { variant: 'success' });
                onClick();
            } else {
                enqueueSnackbar('Lỗi không xác định', { variant: 'error' });
            }
        } catch (error) {
            enqueueSnackbar('Có lỗi xảy ra khi gửi biểu mẫu', { variant: 'error' });
        }
    };

    const handleClose = () => {
        onClick();
    };

    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ padding: 2 }}>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            label="Mã lớp"
                            {...register('id')}
                            error={!!errors.id}
                            helperText={errors.id?.message}
                            fullWidth
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Tên lớp"
                            {...register('className')}
                            error={!!errors.className}
                            helperText={errors.className?.message}
                            fullWidth
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth variant="outlined" error={!!errors.specializationID}>
                            <InputLabel id="specializationID-label">Chọn ngành</InputLabel>
                            <Select
                                labelId="specializationID-label"
                                label="Chọn ngành"
                                {...register('specializationID')}
                                onChange={(e) => setValue('specializationID', e.target.value)}
                            >
                                {specializations.map((specialization) => (
                                    <MenuItem key={specialization.id} value={specialization.id}>
                                        {specialization.name}
                                    </MenuItem>
                                ))}
                            </Select>
                            <Typography variant="caption" color="error">
                                {errors.specializationID?.message}
                            </Typography>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Mô tả"
                            {...register('description')}
                            error={!!errors.description}
                            helperText={errors.description?.message}
                            fullWidth
                            variant="outlined"
                            multiline
                            rows={4}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} variant="contained" color="error">
                    Thoát
                </Button>
                <Button type="submit" variant="contained" color="success">
                    Ghi dữ liệu
                </Button>
            </DialogActions>
        </Box>
    );
}

export default EditClass;
