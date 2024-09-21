/* eslint-disable no-empty */
/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useDispatch } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// Table
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getSpecialization, deleteSpecialization } from '../../store/reducers/specialization';
import { Box, Typography, Button, Grid } from '@mui/material';
import MainCard from 'components/MainCard';

// Dialog
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContentText from '@mui/material/DialogContentText';
import AddSpecialization from './components/AddSpecialization';
import EditSpecialization from './components/EditSpecialization';

function Specialization(props) {
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();

    const showNotification = (message, type) => {
        enqueueSnackbar(message, { variant: type });
    };

    const validationSchema = yup.object({
        id: yup.string().required('Nhập vào địa chỉ email!'),
        name: yup.string().required('Required')
    });

    const form = useForm({
        defaultValues: {
            id: '',
            name: ''
        },
        resolver: yupResolver(validationSchema)
    });

    const [rows, setRows] = useState([]);
    const [open, setOpen] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [reload, setReload] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    useEffect(() => {
        (async () => {
            const item = await getSpecialization();
            const resultAction = await dispatch(item);
            if (resultAction.payload != null) {
                const arrayOfObjects = resultAction.payload.map(item => ({
                    id: item.id,
                    name: item.name,
                    description: item.description,
                    facultyID: item.facultyID
                }));
                setRows(arrayOfObjects);
            }
        })();
    }, [reload]);

    // DELETE
    const handleDeleteClick = (item) => {
        setSelectedItem(item);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (selectedItem) {
            try {
                const resultAction = await dispatch(deleteSpecialization(selectedItem.id));
                if (!resultAction.error) {
                    showNotification("Xóa dữ liệu thành công", "success");
                    setReload(prev => !prev);
                    setSelectedItem(null);
                } else {
                    showNotification("Lỗi khi xóa dữ liệu", "error");
                }
            } catch (error) {
                console.error('Error deleting item:', error);
                showNotification("Lỗi khi xóa dữ liệu: " + error.message, "error");
            }
        }
        setDeleteDialogOpen(false);
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
        setSelectedItem(null);
    };

    // EDIT
    const handleEditClick = (item) => {
        setSelectedItem(item);
        setOpenEdit(true);
    };

    const handleEditClose = () => {
        setOpenEdit(false);
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleClick = () => {
        setOpen(false);
        setOpenEdit(false);
        setReload((prev) => !prev);
        form.reset();  // Trigger reload
    };

    return (
        <Box>
            <MainCard>
                <Grid container alignItems="center" justifyContent="space-between" mb={2}>
                    <Grid item>
                        <Typography variant="h5">Danh sách Khoa</Typography>
                    </Grid>
                    <Grid item>
                        <Button onClick={handleClickOpen} variant="contained" color="primary">Thêm mới</Button>
                    </Grid>
                </Grid>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">STT</TableCell>
                                <TableCell align="center">Mã Chuyên Ngành</TableCell>
                                <TableCell align="center">Tên chuyên ngành</TableCell>
                                <TableCell align="center">Mô tả</TableCell>
                                <TableCell align="center">Mã Khoa</TableCell>
                                <TableCell align="center">Thao tác</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row, index) => (
                                <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell align="center" component="th" scope="row">{index + 1}</TableCell>
                                    <TableCell align="center">{row.id}</TableCell>
                                    <TableCell align="">{row.name}</TableCell>
                                    <TableCell align="">{row.description ? row.description : ""}</TableCell>
                                    <TableCell align="center">{row.facultyID}</TableCell>
                                    <TableCell align="center">
                                        <EditIcon onClick={() => handleEditClick(row)} style={{ cursor: 'pointer', marginRight: 8 }} />
                                        <DeleteIcon style={{ cursor: 'pointer', marginRight: 8 }} onClick={() => handleDeleteClick(row)} />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </MainCard>

            <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
                <DialogTitle id="alert-dialog-title">{"Xác nhận xóa"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Bạn có chắc chắn muốn xóa {selectedItem?.name} không?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteCancel} color="primary">
                        No
                    </Button>
                    <Button onClick={handleDeleteConfirm} color="primary" autoFocus>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                <DialogTitle sx={{ mb: 0 }}>
                    <Typography variant="h4" fontWeight="bold">
                        Thêm mới thông tin Khoa
                    </Typography>
                </DialogTitle>
                <AddSpecialization onClick={handleClick} />
            </Dialog>

            <Dialog open={openEdit} onClose={handleEditClose} fullWidth maxWidth="sm">
                <DialogTitle sx={{ mb: 0 }}>
                    <Typography variant="h4" fontWeight="bold">
                        Cập nhật thông tin Khoa
                    </Typography>
                </DialogTitle>
                <EditSpecialization item={selectedItem} onClick={handleClick} />
            </Dialog>
        </Box>
    );
}

export default Specialization;
