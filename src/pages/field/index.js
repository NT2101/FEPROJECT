import React, { useEffect, useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Grid } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContentText from '@mui/material/DialogContentText';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import AddField from './components/AddField';  // Ensure the path is correct
import EditField from './components/EditField'; // Ensure the path is correct

function FieldManagement() {
    const { enqueueSnackbar } = useSnackbar();
    const [fields, setFields] = useState([]);
    const [openAdd, setOpenAdd] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedField, setSelectedField] = useState(null);
    const [reload, setReload] = useState(false);

    useEffect(() => {
        const fetchFields = async () => {
            try {
                const response = await axios.get('https://localhost:7217/api/Fields');
                setFields(response.data);
            } catch (error) {
                console.error('Error fetching fields:', error);
                enqueueSnackbar('Lỗi khi tải dữ liệu', { variant: 'error' });
            }
        };

        fetchFields();
    }, [reload]);

    // DELETE
    const handleDeleteClick = (field) => {
        setSelectedField(field);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (selectedField) {
            try {
                await axios.delete(`https://localhost:7217/api/Fields/${selectedField.id}`);
                enqueueSnackbar('Xóa dữ liệu thành công', { variant: 'success' });
                setReload(prev => !prev);
                setSelectedField(null);
            } catch (error) {
                console.error('Error deleting field:', error);
                enqueueSnackbar('Lỗi khi xóa dữ liệu', { variant: 'error' });
            }
        }
        setDeleteDialogOpen(false);
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
        setSelectedField(null);
    };

    // EDIT
    const handleEditClick = (field) => {
        setSelectedField(field);
        setOpenEdit(true);
    };

    const handleEditClose = () => {
        setOpenEdit(false);
        setReload(prev => !prev);  // Reload data after closing
    };

    // ADD
    const handleClickOpenAdd = () => {
        setOpenAdd(true);
    };

    const handleCloseAdd = () => {
        setOpenAdd(false);
    };

    const handleAddClick = () => {
        setOpenAdd(false);
        setReload(prev => !prev);
    };

    return (
        <Box>
            <Grid container alignItems="center" justifyContent="space-between" mb={2}>
                <Grid item>
                    <Typography variant="h5">Danh sách Trường</Typography>
                </Grid>
                <Grid item>
                    <Button onClick={handleClickOpenAdd} variant="contained" color="primary">Thêm mới</Button>
                </Grid>
            </Grid>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">STT</TableCell>
                            <TableCell align="center">Tên Trường</TableCell>
                            <TableCell align="center">Mô Tả</TableCell>
                            <TableCell align="center">Thao tác</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {fields.map((field, index) => (
                            <TableRow key={field.id}>
                                <TableCell align="center" component="th" scope="row">{index + 1}</TableCell>
                                <TableCell align="">{field.fieldName}</TableCell>
                                <TableCell align="">{field.description || ''}</TableCell>
                                <TableCell align="center">
                                    <EditIcon onClick={() => handleEditClick(field)} style={{ cursor: 'pointer', marginRight: 8 }} />
                                    <DeleteIcon style={{ cursor: 'pointer', marginRight: 8 }} onClick={() => handleDeleteClick(field)} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
                <DialogTitle id="alert-dialog-title">{"Xác nhận xóa"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Bạn có chắc chắn muốn xóa {selectedField?.fieldName} không?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteCancel} color="primary">Không</Button>
                    <Button onClick={handleDeleteConfirm} color="primary" autoFocus>Có</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openAdd} onClose={handleCloseAdd} fullWidth maxWidth="sm">
                <DialogTitle sx={{ mb: 0 }}>
                    <Typography variant="h4" fontWeight="bold">Thêm mới trường</Typography>
                </DialogTitle>
                <AddField onClick={handleAddClick} />
            </Dialog>

            <Dialog open={openEdit} onClose={handleEditClose} fullWidth maxWidth="sm">
                <DialogTitle sx={{ mb: 0 }}>
                    <Typography variant="h4" fontWeight="bold">Cập nhật thông tin trường</Typography>
                </DialogTitle>
                <EditField field={selectedField} onClick={handleEditClose} />
            </Dialog>
        </Box>
    );
}

export default FieldManagement;
