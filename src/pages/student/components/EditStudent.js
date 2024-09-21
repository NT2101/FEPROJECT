import { Box, Button, Grid, InputLabel, MenuItem, Select, Typography,DialogContent,TextField } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useSnackbar } from 'notistack';
import { useDispatch } from 'react-redux';
import { editStudent } from '../../../store/reducers/student';
import {  getClass } from '../../../store/reducers/class'; // Update imports accordingly
import React, { useEffect, useState } from 'react';
import InputField from 'components/FormControl/InputField/index';

function EditStudent({ onClick }) {
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const [faculties, setFaculties] = useState([]);


    const showNotification = (message, type) => {
        enqueueSnackbar(message, { variant: type });
    };
    useEffect(() => {
        const fetchFaculties = async () => {
            try {
                const resultAction = await dispatch(getClass());
                if (resultAction.payload != null) {
                    const arrayOfObjects = resultAction.payload.map(item => ({
                        id: item.id,
                        className: item.className,
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
        studentID: yup.string().required('Mã sinh viên là bắt buộc'),
        name: yup.string().required('Tên sinh viên là bắt buộc'),
        dob: yup.string().required('Ngày sinh là bắt buộc'),
        sex: yup.string().required('Giới tính là bắt buộc'),
        address: yup.string().required('Địa chỉ là bắt buộc'),
        phoneNumber: yup.string().required('Số điện thoại là bắt buộc'),
        emailAddress: yup.string().email('Địa chỉ email không hợp lệ').required('Địa chỉ email là bắt buộc'),
        country: yup.string().required('Quê quán là bắt buộc'),
        classID: yup.string().required('Mã lớp là bắt buộc')
    });

    const form = useForm({
        defaultValues: {
            studentID: '',
            name: '',
            dob: '',
            sex: '', // Ensure this matches one of the MenuItem values ("0" or "1")
            address: '',
            phoneNumber: '',
            emailAddress: '',
            country: '',
            classID: ''
        },
        resolver: yupResolver(validationSchema)
    });

    const handleClose = () => {
        onClick();
    };

    const onSubmit = async (values) => {
        try {
            const item = await editStudent(values);
            console.log('Item after addStudent:', item); // Log to see what `item` contains
            
            const resultAction = await dispatch(item);
            console.log('Result action after dispatch:', resultAction); // Log to see what `resultAction` contains
            
            if (resultAction.payload != null && resultAction.payload.status === 201) {
                showNotification('Sửa sinh viên thành công', 'success');
            } else {
                onClick();
                showNotification('Sửa sinh viên thành công', 'success');
            }
        } catch (error) {
            console.error('Error adding student:', error); // Log any caught errors
            showNotification('Lỗi khi Sửa sinh viên: ' + error.message, 'error');
        }
    };
    

    return (
        <Box component="form" onSubmit={form.handleSubmit(onSubmit)}>
               <DialogContent>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Typography variant="h6">Thêm mới sinh viên</Typography>
                </Grid>
                <Grid item xs={12}>
                        <InputField form={form} name="studentID" label="Mã sinh viên" />
                    </Grid>
               <Grid item xs={12}>
                        <InputField form={form} name="name" label="Tên sinh viên" />
                    </Grid>
                <Grid item xs={12}>
                    <TextField {...form.register('dob')} label="Ngày sinh" type="date" fullWidth InputLabelProps={{ shrink: true }} />
                    <Typography variant="body2" color="error">{form.formState.errors.dob?.message}</Typography>
                </Grid>
                <Grid item xs={12}>
                    <InputLabel>Giới tính</InputLabel>
                    <Select {...form.register('sex')} fullWidth>
                        <MenuItem value="0">Nam</MenuItem>
                        <MenuItem value="1">Nữ</MenuItem>
                    </Select>
                    <Typography variant="body2" color="error">{form.formState.errors.sex?.message}</Typography>
                </Grid>
                <Grid item xs={12}>
                        <InputField form={form} name="address" label="Địa chỉ" />
                    </Grid>
                <Grid item xs={12}>
                        <InputField form={form} name="phoneNumber" label="Số điện thoại" />
                    </Grid>
                <Grid item xs={12}>
                        <InputField form={form} name="emailAddress" label="Địa chỉ email" />
                    </Grid>
               <Grid item xs={12}>
                        <InputField form={form} name="country" label="Quê quán" />
                    </Grid>
                <Grid item xs={12}>
                        <InputLabel id="classID-label"> Lớp</InputLabel>
                        <Select
                            labelId="classID-label"
                            id="classID"
                            value={form.watch('classID')} // Ensure this correctly reflects the selected value
                            onChange={(e) => form.setValue('classID', e.target.value)} // Update form state on change
                            fullWidth
                            error={!!form.formState.errors.classID}
                        >
                            {faculties.length > 0 ? faculties.map((faculty) => (
                                <MenuItem key={faculty.id} value={faculty.id}>
                                    {faculty.className} {/* Display the class name or another relevant field */}
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
                    <Button variant="contained" color="error" onClick={handleClose}>Thoát</Button>
                    <Button variant="contained" color="success" type="submit">Ghi dữ liệu</Button>
                </Grid>
            </Grid>
            </DialogContent>
        </Box>
    );
}

export default EditStudent;
