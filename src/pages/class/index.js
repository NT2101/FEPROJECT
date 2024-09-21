import React, { useState, useEffect } from 'react';
import { Box, Button, Grid, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import MainCard from 'components/MainCard';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContentText from '@mui/material/DialogContentText';
import AddClass from './components/AddClass';
import EditClass from './components/EditClass';
import { useDispatch } from 'react-redux';
import { deleteClass, getClass } from '../../store/reducers/class'; // Update imports accordingly

function Class() {
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();

    const showNotification = (message, type) => {
        enqueueSnackbar(message, { variant: type });
    };

    const [rows, setRows] = useState([]);
    const [open, setOpen] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [reload, setReload] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    useEffect(() => {
        (async () => {
            const item = await getClass();
            const resultAction = await dispatch(item);
            if (resultAction.payload) {
                const arrayOfObjects = resultAction.payload.map(item => ({
                    id: item.id,
                    className: item.className,
                    description: item.description,
                    specializationID: item.specializationID,
                }));
                setRows(arrayOfObjects);
            } else {
                showNotification('Lỗi khi tải dữ liệu', 'error');
            }
        })();
    }, [reload, dispatch, showNotification]);

    const handleDeleteClick = (item) => {
        setSelectedItem(item);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            const result = await dispatch(deleteClass(selectedItem.id));
            if (!result.error) {
                showNotification('Xóa dữ liệu thành công', 'success');
                setReload(prev => !prev);
                setSelectedItem(null);
            } else {
                showNotification('Lỗi khi xóa dữ liệu: ' + result.error.message, 'error');
            }
        } catch (error) {
            showNotification('Lỗi khi xóa dữ liệu: ' + error.message, 'error');
        }
        setDeleteDialogOpen(false);
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
        setSelectedItem(null);
    };

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
        setReload(prev => !prev);
    };

    return (
        <Box>
            <MainCard>
                <Grid container alignItems="center" justifyContent="space-between" mb={2}>
                    <Grid item>
                        <Typography variant="h5">Danh sách Lớp</Typography>
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
                                <TableCell align="center">Mã lớp học</TableCell>
                                <TableCell align="center">Tên lớp học</TableCell>
                                <TableCell align="center">Mã chuyên ngành</TableCell>
                                <TableCell align="center" sx={{ minWidth: 200 }}>Mô tả</TableCell>
                                <TableCell align="center">Thao tác</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row, index) => (
                                <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell align="center" component="th" scope="row">{index + 1}</TableCell>
                                    <TableCell align="center">{row.id}</TableCell>
                                    <TableCell align="">{row.className}</TableCell>
                                    <TableCell align="center">{row.specializationID}</TableCell>
                                    <TableCell align="">{row.description || ""}</TableCell>
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

            <Dialog
                open={deleteDialogOpen}
                onClose={handleDeleteCancel}
            >
                <DialogTitle id="alert-dialog-title">{"Xác nhận xóa"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Bạn có chắc chắn muốn xóa {selectedItem?.className} không?
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
                        Thêm mới thông tin Lớp
                    </Typography>
                </DialogTitle>
                <AddClass onClick={handleClick} />
            </Dialog>

            <Dialog open={openEdit} onClose={handleEditClose} fullWidth maxWidth="sm">
                <DialogTitle sx={{ mb: 0 }}>
                    <Typography variant="h4" fontWeight="bold">
                        Cập nhật thông tin Lớp
                    </Typography>
                </DialogTitle>
                <EditClass item={selectedItem} onClick={handleClick} />
            </Dialog>
        </Box>
    );
}

export default Class;
