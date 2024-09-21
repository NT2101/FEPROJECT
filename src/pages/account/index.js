import React, { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useDispatch } from 'react-redux';
import axios from 'axios'; // Import axios
import ReactPaginate from 'react-paginate'; // Import ReactPaginate
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
import { getAccount } from './../../store/reducers/account';
import { Box, Typography, Button, Grid } from '@mui/material';
import MainCard from 'components/MainCard';

// Dialog
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContentText from '@mui/material/DialogContentText';
import AddAccount from './components/AddAccount';
import UpdateAccountForm from './components/EditAccount';
import './style.css'

function Faculty() {
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();

    const showNotification = (message, type) => {
        enqueueSnackbar(message, { variant: type });
    };

    const [rows, setRows] = useState([]);
    const [page, setPage] = useState(0); // Pagination page
    const [rowsPerPage] = useState(5); // Rows per page
    const [open, setOpen] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [reload, setReload] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const item = await getAccount();
                const resultAction = await dispatch(item);
                if (resultAction.payload != null) {
                    const arrayOfObjects = resultAction.payload.map(item => ({
                        id: item.id,
                        name: item.name,
                        password: item.password,
                        roleID: item.roleID === 1 ? 'Sinh viên' : item.roleID === 2 ? 'Giảng viên' : 'Quản trị',
                        status: item.status === 1 ? 'Hoạt động' : 'Hết hạn'
                    }));
                    setRows(arrayOfObjects);
                }
            } catch (error) {
                console.error('Error fetching accounts:', error);
                showNotification('Lỗi khi tải danh sách tài khoản', 'error');
            }
        })();
    }, [reload]);

    // DELETE
    const handleDeleteClick = (item) => {
        setSelectedItem(item);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (selectedItem && selectedItem.id) {
            try {
                const response = await axios.delete(`https://localhost:7217/api/Accounts?id=${selectedItem.id}`);
                if (response.status === 204) {
                    showNotification("Xóa dữ liệu thành công", "success");
                    setReload(prev => !prev); // Trigger reload
                    setSelectedItem(null);
                } else {
                    showNotification(`Lỗi khi xóa dữ liệu: ${response.statusText} (${response.status})`, "error");
                }
            } catch (error) {
                console.log('Error details:', error);
                showNotification(`Lỗi khi xóa dữ liệu: ${error.response?.data?.message || 'Lỗi không xác định'}`, "error");
            }
        } else {
            showNotification('Lỗi khi xóa dữ liệu: Không có dữ liệu để xóa', 'error');
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
        setReload((prev) => !prev); // Trigger reload
    };

    const handlePageClick = (event) => {
        setPage(event.selected);
    };

    return (
        <Box>
            <MainCard>
                <Grid container alignItems="center" justifyContent="space-between" mb={2}>
                    <Grid item>
                        <Typography variant="h5">Danh sách Tài Khoản</Typography>
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
                                <TableCell align="">Tên tài khoản</TableCell>
                                <TableCell align="center">Mật khẩu</TableCell>
                                <TableCell align="center">Quyền</TableCell>
                                <TableCell align="center">Tình trạng</TableCell>
                                <TableCell align="center">Thao tác</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                                <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell align="center" component="th" scope="row">{page * rowsPerPage + index + 1}</TableCell>
                                    <TableCell align="">{row.name}</TableCell>
                                    <TableCell align="center">{row.password}</TableCell>
                                    <TableCell align="center">{row.roleID}</TableCell>
                                    <TableCell align="center">{row.status}</TableCell>
                                    <TableCell align="center">
                                        <EditIcon onClick={() => handleEditClick(row)} style={{ cursor: 'pointer', marginRight: 8 }} />
                                        <DeleteIcon style={{ cursor: 'pointer', marginRight: 8 }} onClick={() => handleDeleteClick(row)} />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <ReactPaginate
                    pageCount={Math.ceil(rows.length / rowsPerPage)}
                    onPageChange={handlePageClick}
                    containerClassName="pagination"
                    pageClassName="page-item"
                    pageLinkClassName="page-link"
                    previousClassName="page-item"
                    previousLinkClassName="page-link"
                    nextClassName="page-item"
                    nextLinkClassName="page-link"
                    breakClassName="page-item"
                    breakLinkClassName="page-link"
                    activeClassName="active"
                    previousLabel="Trước"
                    nextLabel="Tiếp theo"
                />
            </MainCard>

            <Dialog
                open={deleteDialogOpen}
                onClose={handleDeleteCancel}
            >
                <DialogTitle id="alert-dialog-title">{"Xác nhận xóa"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Bạn có chắc chắn muốn xóa {selectedItem?.name} không?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteCancel} color="primary">
                        Không
                    </Button>
                    <Button onClick={handleDeleteConfirm} color="primary" autoFocus>
                        Có
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                <DialogTitle sx={{ mb: 0 }}>
                    <Typography variant="h4" fontWeight="bold">
                        Thêm mới tài khoản
                    </Typography>
                </DialogTitle>
                <AddAccount onClick={handleClick} />
            </Dialog>

            <Dialog open={openEdit} onClose={handleEditClose} fullWidth maxWidth="sm">
                <DialogTitle sx={{ mb: 0 }}>
                    <Typography variant="h4" fontWeight="bold">
                        Cập nhật tài khoản
                    </Typography>
                </DialogTitle>
                <UpdateAccountForm account={selectedItem} onClose={handleClick} />
            </Dialog>
        </Box>
    );
}

export default Faculty;
