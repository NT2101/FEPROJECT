/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { Box, Button, Grid, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import InputField from 'components/FormControl/InputField/index';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import React, { useEffect, useState } from 'react';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useSnackbar } from 'notistack';
import { useDispatch } from 'react-redux';
import { getFaculty } from '../../../store/reducers/faculty';
import { editSpecialization } from '../../../store/reducers/specialization';

function EditSpecialization({ item, onClick }) {
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const [faculties, setFaculties] = useState([]);

    const showNotification = (message, type) => {
        enqueueSnackbar(message, { variant: type });
    }

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
        id: yup.string().required('Chưa nhập thông tin mã ngành!'),
        name: yup.string().required('Chưa nhập tên ngành!'),
        facultyID: yup.string().required('Chưa chọn khoa!'),
    });

    const form = useForm({
        defaultValues: {
            id: item.id,
            name: item.name,
            description: item.description ? item.description : '',
            facultyID: item.facultyID ? item.facultyID : '',
        },
        resolver: yupResolver(validationSchema)
    });

    const handleClose = () => {
        onClick();
    };

    const onSubmit = async (values) => {
        try {
            const resultAction = await dispatch(editSpecialization(values));
            if (resultAction.payload && resultAction.payload.status === 409) {
                showNotification("Mã ngành đã tồn tại trong hệ thống", "error");
            } else if (resultAction.payload && (resultAction.payload.status === 204 || resultAction.payload.status === 200)) {
                showNotification("Ghi dữ liệu thành công", "success");
                onClick();
            } else {
                showNotification("Lỗi không xác định " + resultAction.payload.status, "error");
            }
        } catch (error) {
            showNotification("Lỗi không xác định " + error.message, "error");
        }
    };

    return (
        <Box component="form" onSubmit={form.handleSubmit(onSubmit)}>
            <DialogContent>
                <Grid container alignItems="center" spacing={2}>
                    <Grid item xs={12} sm={12}>
                        <InputField form={form} name="id" label="Nhập mã ngành" disabled={true} />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <InputField form={form} name="name" label="Nhập tên ngành" />
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
                    <Grid item xs={12} sm={12}>
                        <InputField
                            name="description"
                            form={form}
                            multiline
                            rows={4}
                            placeholder="Nhập mô tả"
                            fullWidth
                            sx={{ mt: 2 }}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions sx={{ mr: 2 }}>
                <Button onClick={handleClose} variant="contained" color="error">Thoát</Button>
                <Button type="submit" variant="contained" color="success">
                    Ghi dữ liệu
                </Button>
            </DialogActions>
        </Box>
    )
}

export default EditSpecialization;
