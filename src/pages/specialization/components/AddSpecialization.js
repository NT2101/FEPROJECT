import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { Box, Button, DialogActions, DialogContent, Grid, MenuItem, Typography, InputLabel, Select } from '@mui/material';
import InputField from 'components/FormControl/InputField/index';
import { addSpecialization } from '../../../store/reducers/specialization';
import { getFaculty } from '../../../store/reducers/faculty';

function AddSpecialization({ onClick }) {
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const { loading, error } = useSelector((state) => state.Specialization) ?? {};
    const [faculties, setFaculties] = useState([]);

    useEffect(() => {
        const fetchFaculties = async () => {
            try {
                const resultAction = await dispatch(getFaculty());
                if (resultAction.payload != null) {
                    const arrayOfObjects = resultAction.payload.map(item => ({
                        id: item.id,
                        facultyName: item.facultyName,
                    }));
                    setFaculties(arrayOfObjects);
                }
            } catch (error) {
                console.error('Error fetching faculties:', error);
            }
        };

        fetchFaculties();
    }, [dispatch]);

    const validationSchema = yup.object({
        id: yup.string().required('Nhập vào mã chuyên ngành!'),
        name: yup.string().required('Nhập vào tên chuyên ngành!'),
        facultyID: yup.string().required('Chọn khoa!')
    });

    const form = useForm({
        defaultValues: {
            id: '',
            name: '',
            description: '',
            facultyID: ''
        },
        resolver: yupResolver(validationSchema)
    });

    const handleClose = () => {
        onClick();
    };

    const onSubmit = async (values) => {
        try {
            const item = await dispatch(addSpecialization(values));
            if (item.payload) {
                if (item.payload.status === 409) {
                    showNotification('Mã chuyên ngành đã tồn tại trong hệ thống', 'error');
                } else if (item.payload.status === 201) {
                    showNotification('Ghi dữ liệu thành công', 'success');
                    onClick();
                } else {
                    showNotification('Lỗi không xác định ' + item.payload.status, 'error');
                }
            } else {
                showNotification('Không nhận được phản hồi từ máy chủ', 'error');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            showNotification('Có lỗi xảy ra khi gửi biểu mẫu', 'error');
        }
    };

    const showNotification = (message, type) => {
        enqueueSnackbar(message, { variant: type });
    };

    return (
        <Box component="form" onSubmit={form.handleSubmit(onSubmit)}>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <InputField form={form} name="id" label="Mã chuyên ngành" />
                    </Grid>
                    <Grid item xs={12}>
                        <InputField form={form} name="name" label="Tên chuyên ngành" />
                    </Grid>
                    <Grid item xs={12}>
                        <InputLabel id="facultyID-label">Chọn khoa</InputLabel>
                        <Select
                            labelId="facultyID-label"
                            id="facultyID"
                            value={form.watch('facultyID')}
                            onChange={(e) => form.setValue('facultyID', e.target.value)}
                            fullWidth
                            error={!!form.formState.errors.facultyID}
                        >
                            {faculties.length > 0 ? faculties.map((faculty) => (
                                <MenuItem key={faculty.id} value={faculty.id}>
                                    {faculty.facultyName}
                                </MenuItem>
                            )) : (
                                <MenuItem value="">
                                    <em>Không có dữ liệu</em>
                                </MenuItem>
                            )}
                        </Select>
                        <Typography variant="caption" color="error">
                            {form.formState.errors.facultyID?.message}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <InputField
                            form={form}
                            name="description"
                            label="Mô tả"
                            multiline
                            rows={4}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12}>
                        {loading && <Typography>Loading...</Typography>}
                        {error && <Typography color="error">Error: {error}</Typography>}
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="error">
                    Thoát
                </Button>
                <Button type="submit" variant="contained" color="success">
                    Ghi dữ liệu
                </Button>
            </DialogActions>
        </Box>
    );
}

export default AddSpecialization;
