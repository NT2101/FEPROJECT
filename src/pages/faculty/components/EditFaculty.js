/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import { Box, Button, Grid } from '@mui/material';
import InputField from 'components/FormControl/InputField/index';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useSnackbar } from 'notistack';
import { useDispatch } from 'react-redux';
import { editFaculty } from '../../../store/reducers/faculty';

function EditFaculty({ item, onClick }) {
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    
    const showNotification = (message, type) => {
        enqueueSnackbar(message, { variant: type });
    }

    const validationSchema = yup.object({
        id: yup.string().required('Chưa nhập thông tin mã khoa!'),
        facultyName: yup.string().required('Chưa nhập tên khoa!')
    });

    const form = useForm({
        defaultValues: {
            id: item.id,
            facultyName: item.facultyName,
            description: item.description
        },
        resolver: yupResolver(validationSchema)
    });

    const handleClose = () => {
        onClick();
    };

    const onSubmit = async (values) => {
        const resultAction = await dispatch(editFaculty(values));
        if (editFaculty.fulfilled.match(resultAction)) {
            showNotification("Ghi dữ liệu thành công", "success");
            onClick();
        } else if (resultAction.payload && resultAction.payload.status === 409) {
            showNotification("Mã khoa đã tồn tại trong hệ thống", "error");
        } else {
            showNotification("Lỗi không xác định " + (resultAction.payload ? resultAction.payload.status : ""), "error");
        }
    };

    return (
        <Box component="form" onSubmit={form.handleSubmit(onSubmit)}>
            <DialogContent>
                <Grid container alignItems="center" spacing={0}>
                    <Grid item xs={12} sm={12}>
                        <InputField form={form} name="id" label="Nhập mã Khoa" disabled />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <InputField form={form} name="facultyName" label="Nhập tên Khoa" />
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
    );
}

export default EditFaculty;
