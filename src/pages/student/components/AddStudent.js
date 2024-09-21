import React, { useEffect, useState } from 'react';
import { Box, TextField, Typography, Button, Grid, Select, MenuItem, InputLabel, DialogContent } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useSnackbar } from 'notistack';
import { useDispatch } from 'react-redux';
import { getClass } from '../../../store/reducers/class'; // Update imports accordingly

function AddStudent({ onClose, onRefresh }) {
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const [faculties, setFaculties] = useState([]);
    const [file, setFile] = useState(null);

    const showNotification = (message, type) => {
        enqueueSnackbar(message, { variant: type });
    };

    useEffect(() => {
        const fetchFaculties = async () => {
            try {
                const resultAction = await dispatch(getClass());
                if (resultAction.payload) {
                    const arrayOfObjects = resultAction.payload.map(item => ({
                        id: item.id,
                        className: item.className,
                    }));
                    setFaculties(arrayOfObjects);
                }
            } catch (error) {
                console.error('Error fetching faculties:', error);
                showNotification('Lỗi khi lấy dữ liệu lớp học: ' + error.message, 'error');
            }
        };

        fetchFaculties();
    }, [dispatch]);

    const validationSchema = yup.object({
        studentID: yup.string().required('Mã sinh viên là bắt buộc'),
        name: yup.string().required('Tên sinh viên là bắt buộc'),
        dob: yup.date().required('Ngày sinh là bắt buộc').typeError('Ngày sinh không hợp lệ'),
        classID: yup.string().required('Mã lớp là bắt buộc')
    });

    const form = useForm({
        defaultValues: {
            studentID: '',
            name: '',
            dob: '',
            classID: faculties.length > 0 ? faculties[0].id : '' // Đặt giá trị mặc định nếu cần
        },
        resolver: yupResolver(validationSchema)
    });

    const onSubmit = async (values) => {
        const formData = new FormData();
        formData.append('StudentID', values.studentID);
        formData.append('Name', values.name);
        formData.append('Dob', new Date(values.dob).toISOString());
        formData.append('ClassID', values.classID);
    
        if (file) {
            formData.append('ProfilePicture', file);
        } else {
            formData.append('ProfilePictureUrl', '');
        }
    
        // Log các giá trị FormData để xác minh
        for (const [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }
    
        try {
            const response = await fetch('https://localhost:7217/api/Student', {
                method: 'POST',
                body: formData,
            });
    
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! Status: ${response.status}, Details: ${errorText}`);
            }
    
            showNotification('Thêm sinh viên thành công', 'success');
            form.reset(); // Reset form
            setFile(null);
            onClose(); // Đóng form khi thêm thành công
            if (onRefresh) onRefresh(); // Gọi hàm onRefresh nếu có
        } catch (error) {
            console.error('Error adding student:', error);
            showNotification('Lỗi khi thêm sinh viên: ' + error.message, 'error');
        }
    };

    return (
        <Box component="form" onSubmit={form.handleSubmit(onSubmit)}>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField {...form.register('studentID')} label="Mã sinh viên" fullWidth />
                        <Typography variant="body2" color="error">{form.formState.errors.studentID?.message}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField {...form.register('name')} label="Tên sinh viên" fullWidth />
                        <Typography variant="body2" color="error">{form.formState.errors.name?.message}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField {...form.register('dob')} label="Ngày sinh" type="date" fullWidth InputLabelProps={{ shrink: true }} />
                        <Typography variant="body2" color="error">{form.formState.errors.dob?.message}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <InputLabel id="classID-label">Chọn Lớp</InputLabel>
                        <Select
                            labelId="classID-label"
                            id="classID"
                            {...form.register('classID')}
                            fullWidth
                            error={!!form.formState.errors.classID}
                        >
                            {faculties.length > 0 ? faculties.map((faculty) => (
                                <MenuItem key={faculty.id} value={faculty.id}>
                                    {faculty.className}
                                </MenuItem>
                            )) : (
                                <MenuItem value="">
                                    <em>Không có dữ liệu</em>
                                </MenuItem>
                            )}
                        </Select>
                        <Typography variant="caption" color="error">
                            {form.formState.errors.classID?.message}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Button type="submit" variant="contained" color="primary">Thêm Sinh Viên</Button>
                    </Grid>
                </Grid>
            </DialogContent>
        </Box>
    );
}

export default AddStudent;
