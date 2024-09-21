/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import { Box, TextField, TextareaAutosize, InputLabel, Typography, Button, Grid } from '@mui/material';
import InputField from 'components/FormControl/InputField/index';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useSnackbar } from 'notistack';
import { useDispatch } from 'react-redux';

import { addFaculty, getFaculty } from '../../../store/reducers/faculty';

function AddFaculty({ onClick }) {
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const showNotification = (message, type) => {
        enqueueSnackbar(message, { variant: type })
    }

    const validationSchema = yup.object({
        id: yup.string().required('Nhập vào địa chỉ email!'),
        facultyName: yup.string().required('Required')
    });
    const form = useForm({
        defaultValues: {
            id: '',
            facultyName: '',
            description: ''
        },
        resolver: yupResolver(validationSchema)
    });

    const handleClose = () => {
        onClick();
    };

    const onSubmit = async (values) => {
        const item = await addFaculty(values);
        const resultAction = await dispatch(item);
        if (resultAction.payload != null && resultAction.payload.status == 409) {
            showNotification("Mã khoa đã tồn tại trong hệ thống", "error");
        }
        else if (resultAction.payload != null && resultAction.payload.status == 201) {
            showNotification("Ghi dữ liệu thành công", "success");
            onClick();
        }
        else {
            showNotification("Lỗi không xác định " + resultAction.payload.status, "error");
        }
    };
    return (
        <Box component="form" onSubmit={form.handleSubmit(onSubmit)}>
            <DialogContent>
                <Grid container alignItems="center" spacing={0}>
                    <Grid item xs={12} sm={12}>
                        <InputField form={form} name="id" label="Nhập mã Khoa" />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <InputField form={form} name="facultyName" label="Nhập tên Khoa" />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <InputField
                            name="description"
                            form={form}
                            multiline={true}
                            rows={4}
                            label="Nhập mô tả"
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

export default AddFaculty;