import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Box, Grid, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddTopicForm from './components/AddTopic'; // Ensure path is correct
import EditTopicForm from './components/EditTopic'; // Ensure path is correct
import { useSnackbar } from 'notistack'; // Import useSnackbar for notifications

const GetAll = () => {
    const [topics, setTopics] = useState([]);
    const [openAdd, setOpenAdd] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [selectedTopic, setSelectedTopic] = useState(null);
    const { enqueueSnackbar } = useSnackbar(); // Initialize useSnackbar

    useEffect(() => {
        fetchTopics();
    }, []);

    const fetchTopics = async () => {
        try {
            const response = await axios.get('https://localhost:7217/api/Topic/GetAllTopics');
            setTopics(response.data);
        } catch (error) {
            console.error('Failed to fetch topics', error);
        }
    };

    const handleAddOpen = () => setOpenAdd(true);
    const handleAddClose = () => {
        setOpenAdd(false);
        fetchTopics(); // Refetch topics when closing the add dialog
    };

    const handleEditOpen = (topic) => {
        setSelectedTopic(topic);
        setOpenEdit(true);
    };
    const handleEditClose = () => setOpenEdit(false);

    const handleDeleteOpen = (topic) => {
        setSelectedTopic(topic);
        setOpenDelete(true);
    };
    const handleDeleteClose = () => setOpenDelete(false);

    const handleDeleteConfirm = async () => {
        try {
            await axios.delete(`https://localhost:7217/api/Topic/${selectedTopic.id}`);
            setTopics(topics.filter(topic => topic.id !== selectedTopic.id));
            setOpenDelete(false);
        } catch (error) {
            console.error('Failed to delete topic', error);
        }
    };

    const handleExportClick = async () => {
        try {
            const response = await axios.get('https://localhost:7217/api/Topic/ExportToExcel', {
                responseType: 'blob', // Important for handling file download
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'DanhSachDeTai.xlsx'); // File name for download
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            enqueueSnackbar('Lỗi khi xuất dữ liệu', { variant: 'error' });
        }
    };

    return (
        <Box>
            <Grid container alignItems="center" justifyContent="space-between" mb={2}>
                <Grid item>
                    <Typography variant="h5">Danh sách Đề tài</Typography>
                </Grid>
                <Grid item>
                    <Button onClick={handleAddOpen} variant="contained" color="primary" startIcon={<AddIcon />}>
                        Thêm Đề tài
                    </Button>
                    <Button onClick={handleExportClick} variant="contained" color="secondary" sx={{ ml: 2 }}>
                        Xuất Excel
                    </Button>
                </Grid>
            </Grid>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">STT</TableCell>
                            <TableCell align="center">Tiêu đề</TableCell>
                            <TableCell align="center">Mô tả</TableCell>
                            <TableCell align="center">Mã sinh viên</TableCell>
                            <TableCell align="center">Sinh viên</TableCell>
                            <TableCell align="center">Giảng viên</TableCell>
                            <TableCell align="center">Lớp</TableCell>
                            <TableCell align="center">Thao tác</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {topics.map((topic, index) => (
                            <TableRow key={topic.id}>
                                <TableCell align="center">{index + 1}</TableCell>
                                <TableCell align="">{topic.title}</TableCell>
                                <TableCell align="">{topic.description}</TableCell>
                                <TableCell align="center">{topic.studentID}</TableCell>
                                <TableCell align="">{topic.studentName}</TableCell>
                                <TableCell align="">{topic.teacherName}</TableCell>
                                <TableCell align="center">{topic.classID}</TableCell>
                                <TableCell align="center">
                                    <EditIcon onClick={() => handleEditOpen(topic)} style={{ cursor: 'pointer', marginRight: 8 }} />
                                    <DeleteIcon onClick={() => handleDeleteOpen(topic)} style={{ cursor: 'pointer' }} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Add Topic Dialog */}
            <Dialog open={openAdd} onClose={handleAddClose} fullWidth maxWidth="sm">
                <DialogTitle>
                    <Typography variant="h4" fontWeight="bold">
                        Thêm mới đề tài
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <AddTopicForm onClose={handleAddClose} />
                </DialogContent>
            </Dialog>

            {/* Edit Topic Dialog */}
            <Dialog open={openEdit} onClose={handleEditClose} fullWidth maxWidth="sm">
                <DialogTitle>
                    <Typography variant="h4" fontWeight="bold">
                        Cập nhật đề tài
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <EditTopicForm topic={selectedTopic} onClose={handleEditClose} />
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={openDelete} onClose={handleDeleteClose}>
                <DialogTitle id="alert-dialog-title">{"Xác nhận xóa"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Bạn có chắc chắn muốn xóa {selectedTopic?.title} không?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteClose} color="primary">
                        Không
                    </Button>
                    <Button onClick={handleDeleteConfirm} color="primary" autoFocus>
                        Có
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default GetAll;
