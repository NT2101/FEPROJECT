import { Box, Button, Grid, TextField, MenuItem, Select, InputLabel, FormControl, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';

function AddTeacher({ onClick }) {
    const { enqueueSnackbar } = useSnackbar();
    const [faculties, setFaculties] = useState([]);
    
    // Initialize the form with default values
    const { handleSubmit, register, reset, formState: { errors } } = useForm({
        defaultValues: {
            teacherID: '',
            name: '',
            dob: '',
            sex: 0,
            phoneNumber: '',
            emailAddress: '',
            description: '',
            facultyID: ''
        }
    });

    useEffect(() => {
        const fetchFaculties = async () => {
            try {
                const response = await fetch('https://localhost:7217/api/Faculties');
                const data = await response.json();
                setFaculties(data);
            } catch (error) {
                enqueueSnackbar("Lỗi khi lấy dữ liệu khoa", "error");
            }
        };
        fetchFaculties();
    }, [enqueueSnackbar]);

    const showNotification = (message, type) => {
        enqueueSnackbar(message, { variant: type });
    };

    const onSubmit = async (values) => {
        const formattedValues = {
            ...values,
            dob: values.dob ? dayjs(values.dob).format('YYYY-MM-DD') : '' // Convert date to yyyy-mm-dd format
        };

        try {
            const response = await fetch('https://localhost:7217/api/Teacher', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formattedValues)
            });
            if (response.ok) {
                showNotification("Thêm mới thành công", "success");
                // Reset the form fields to default values
                reset();
                // Optionally trigger a parent component action
                onClick();
            } else {
                const errorData = await response.json();
                showNotification(`Lỗi khi thêm mới: ${errorData.message}`, "error");
            }
        } catch (error) {
            showNotification("Lỗi không xác định", "error");
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ padding: 2 }}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <TextField {...register('name')} label="Tên giảng viên" fullWidth required />
                    {errors.name && <Typography variant="body2" color="error">{errors.name.message}</Typography>}
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        {...register('dob', {
                            required: 'Ngày sinh là bắt buộc'
                        })}
                        label="Ngày sinh"
                        type="date"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                    />
                    {errors.dob && <Typography variant="body2" color="error">{errors.dob.message}</Typography>}
                </Grid>
                <Grid item xs={12}>
                    <FormControl fullWidth>
                        <InputLabel>Giới tính</InputLabel>
                        <Select
                            {...register('sex')}
                            label="Giới tính"
                            required
                        >
                            <MenuItem value={0}>Nam</MenuItem>
                            <MenuItem value={1}>Nữ</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <TextField {...register('phoneNumber')} label="Số điện thoại" fullWidth />
                </Grid>
                <Grid item xs={12}>
                    <TextField {...register('emailAddress')} label="Địa chỉ email" fullWidth />
                </Grid>
                <Grid item xs={12}>
                    <TextField {...register('description')} label="Mô tả" multiline rows={4} fullWidth />
                </Grid>
                <Grid item xs={12}>
                    <FormControl fullWidth>
                        <InputLabel>Chọn khoa</InputLabel>
                        <Select
                            {...register('facultyID')}
                            label="Chọn khoa"
                            required
                        >
                            {faculties.map(faculty => (
                                <MenuItem key={faculty.id} value={faculty.id}>
                                    {faculty.facultyName}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <Button type="submit" variant="contained" color="primary">Thêm giảng viên</Button>
                </Grid>
            </Grid>
        </Box>
    );
}

export default AddTeacher;
