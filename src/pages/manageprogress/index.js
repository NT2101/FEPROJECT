import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Grid, Paper, Typography, TextField, IconButton, Table,Button, TableBody, TableCell, TableHead, TableRow, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useSnackbar } from 'notistack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DownloadIcon from '@mui/icons-material/Download';
import CloseIcon from '@mui/icons-material/Close';

const ManageProgress = () => {
    const { enqueueSnackbar } = useSnackbar();
    const [progresses, setProgresses] = useState([]);
    const [newProgress, setNewProgress] = useState({
        title: '',
        description: '',
        startDate: '',
        endDate: ''
    });
    const [selectedProgress, setSelectedProgress] = useState(null);
    const [reports, setReports] = useState([]);
    const [editingProgress, setEditingProgress] = useState(null);

    // Fetch all progresses on component mount
    useEffect(() => {
        const fetchProgresses = async () => {
            try {
                const response = await axios.get('https://localhost:7217/api/ProgressReport/GetAllProgresses');
                setProgresses(response.data);
            } catch (error) {
                console.error('Failed to fetch progresses', error);
                enqueueSnackbar('Không có báo cáo nào trong tiến độ', { variant: 'error', autoHideDuration: 3000 });
            }
        };
        fetchProgresses();
    }, [enqueueSnackbar]);

    // Handle creating a new progress
    const handleCreateProgress = async () => {
        if (!newProgress.title || !newProgress.description || !newProgress.startDate || !newProgress.endDate) {
            alert('Vui lòng điền đầy đủ các trường');
            return;
        }

        try {
            await axios.post('https://localhost:7217/api/Progress', newProgress);
            setNewProgress({ title: '', description: '', startDate: '', endDate: '' });
            enqueueSnackbar('Tạo kỳ báo cáo mới thành công', { variant: 'success', autoHideDuration: 3000 });

            const fetchResponse = await axios.get('https://localhost:7217/api/ProgressReport/GetAllProgresses');
            setProgresses(fetchResponse.data);
        } catch (error) {
            console.error('Failed to create progress', error);
            enqueueSnackbar('Tạo kỳ báo cáo mới thất bại', { variant: 'error', autoHideDuration: 3000 });
        }
    };

    // Handle progress click to fetch reports
    const handleProgressClick = async (progressID) => {
        setSelectedProgress(progressID);
        setReports([]);
        try {
            const response = await axios.get(`https://localhost:7217/api/ProgressReport/GetReportsByProgress/${progressID}`);
            setReports(response.data);
            enqueueSnackbar('Lấy danh sách báo cáo thành công', { variant: 'success', autoHideDuration: 3000 });
        } catch (error) {
            console.error('Failed to fetch reports', error);
            enqueueSnackbar('Không có báo cáo trong tiến độ', { variant: 'error', autoHideDuration: 3000 });
        }
    };

    // Handle file download
    const handleDownload = async (reportID, fileName) => {
        try {
            const response = await axios.get(`https://localhost:7217/api/ProgressReport/DownloadReport/${reportID}`, {
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
            enqueueSnackbar('Tải xuống thành công', { variant: 'success', autoHideDuration: 5000 });
        } catch (error) {
            console.error('Failed to download file', error);
            enqueueSnackbar('Tải xuống thất bại', { variant: 'error', autoHideDuration: 5000 });
        }
    };

    // Handle edit progress
    const handleEditProgress = async () => {
        if (!editingProgress.title || !editingProgress.description || !editingProgress.startDate || !editingProgress.endDate) {
            alert('Vui lòng điền đầy đủ các trường');
            return;
        }

        try {
            await axios.put(`https://localhost:7217/api/Progress/${editingProgress.progressID}`, editingProgress);
            setEditingProgress(null);
            enqueueSnackbar('Cập nhật kỳ báo cáo thành công', { variant: 'success', autoHideDuration: 3000 });

            const fetchResponse = await axios.get('https://localhost:7217/api/ProgressReport/GetAllProgresses');
            setProgresses(fetchResponse.data);
        } catch (error) {
            console.error('Failed to update progress', error);
            enqueueSnackbar('Cập nhật kỳ báo cáo thất bại', { variant: 'error', autoHideDuration: 3000 });
        }
    };

    // Handle delete progress
    const handleDeleteProgress = async (progressID) => {
        try {
            await axios.delete(`https://localhost:7217/api/Progress/${progressID}`);
            setSelectedProgress(null);
            enqueueSnackbar('Xóa kỳ báo cáo thành công', { variant: 'success', autoHideDuration: 3000 });

            const fetchResponse = await axios.get('https://localhost:7217/api/ProgressReport/GetAllProgresses');
            setProgresses(fetchResponse.data);
        } catch (error) {
            console.error('Failed to delete progress', error);
            enqueueSnackbar('Xóa kỳ báo cáo thất bại', { variant: 'error', autoHideDuration: 3000 });
        }
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Quản lý các kỳ báo cáo tiến độ
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper style={{ padding: 16 }}>
                        <Typography variant="h6" gutterBottom>
                            Tạo kỳ báo cáo mới
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Tiêu đề"
                                    value={newProgress.title}
                                    onChange={(e) => setNewProgress({ ...newProgress, title: e.target.value })}
                                    fullWidth
                                    margin="none"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Mô tả"
                                    value={newProgress.description}
                                    onChange={(e) => setNewProgress({ ...newProgress, description: e.target.value })}
                                    fullWidth
                                    margin="none"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Ngày bắt đầu"
                                    type="date"
                                    value={newProgress.startDate}
                                    onChange={(e) => setNewProgress({ ...newProgress, startDate: e.target.value })}
                                    fullWidth
                                    margin="none"
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Ngày kết thúc"
                                    type="date"
                                    value={newProgress.endDate}
                                    onChange={(e) => setNewProgress({ ...newProgress, endDate: e.target.value })}
                                    fullWidth
                                    margin="none"
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                        </Grid>
                        <Button 
                            onClick={handleCreateProgress} 
                            variant="contained" 
                            color="primary"
                            style={{ marginTop: 16 }}
                        >
                            Tạo mới
                        </Button>
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Paper style={{ padding: 16 }}>
                        <Typography variant="h6" gutterBottom>
                            Danh sách các kỳ báo cáo tiến độ
                        </Typography>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">STT</TableCell>
                                    <TableCell align="center">Tiêu đề</TableCell>
                                    <TableCell align="center">Mô tả</TableCell>
                                    <TableCell align="center">Ngày bắt đầu</TableCell>
                                    <TableCell align="center">Ngày kết thúc</TableCell>
                                    <TableCell align="center">Hành động</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {progresses.map((progress, index) => (
                                    <TableRow key={progress.progressID}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{progress.title}</TableCell>
                                        <TableCell>{progress.description}</TableCell>
                                        <TableCell align="center">{new Date(progress.startDate).toLocaleDateString()}</TableCell>
                                        <TableCell align="center">{new Date(progress.endDate).toLocaleDateString()}</TableCell>
                                        <TableCell align="center">
                                            <IconButton onClick={() => handleProgressClick(progress.progressID)} color="success">
                                                <VisibilityIcon />
                                            </IconButton>
                                            <IconButton onClick={() => { setEditingProgress(progress); }} color="primary">
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton onClick={() => handleDeleteProgress(progress.progressID)} color="error">
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Paper>
                </Grid>
            </Grid>
            <Dialog open={!!editingProgress} onClose={() => setEditingProgress(null)}>
                <DialogTitle>Sửa kỳ báo cáo</DialogTitle>
                <DialogContent>
                    {editingProgress && (
                        <>
                            <TextField
                                label="Tiêu đề"
                                value={editingProgress.title}
                                onChange={(e) => setEditingProgress({ ...editingProgress, title: e.target.value })}
                                fullWidth
                                margin="none"
                            />
                            <TextField
                                label="Mô tả"
                                value={editingProgress.description}
                                onChange={(e) => setEditingProgress({ ...editingProgress, description: e.target.value })}
                                fullWidth
                                margin="none"
                            />
                            <TextField
                                label="Ngày bắt đầu"
                                type="date"
                                value={editingProgress.startDate}
                                onChange={(e) => setEditingProgress({ ...editingProgress, startDate: e.target.value })}
                                fullWidth
                                margin="none"
                                InputLabelProps={{ shrink: true }}
                            />
                            <TextField
                                label="Ngày kết thúc"
                                type="date"
                                value={editingProgress.endDate}
                                onChange={(e) => setEditingProgress({ ...editingProgress, endDate: e.target.value })}
                                fullWidth
                                margin="none"
                                InputLabelProps={{ shrink: true }}
                            />
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <IconButton onClick={() => setEditingProgress(null)} color="default">
                        <CloseIcon />
                    </IconButton>
                    <IconButton onClick={handleEditProgress} color="primary">
                        <EditIcon />
                    </IconButton>
                </DialogActions>
            </Dialog>
            <Dialog open={Boolean(selectedProgress)} onClose={() => setSelectedProgress(null)}>
                <DialogContent>
                    {reports.length > 0 ? (
                        <Table>
                            <TableHead>
                                <TableRow>
                                <TableCell align="center">Mã sinh viên</TableCell>
                                <TableCell align="center">Sinh viên</TableCell>
                                <TableCell align="center">Giảng viên</TableCell>
                                    <TableCell align="center">Tên báo cáo</TableCell>
                                    <TableCell align="center">Tải xuống</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {reports.map((report) => (
                                    
                                    <TableRow key={report.reportID}>
                                          <TableCell>{report.studentID}</TableCell>
                                          <TableCell>{report.studentName}</TableCell>
                                          <TableCell>{report.teacherName}</TableCell>
                                        <TableCell>{report.fileName}</TableCell>
                                        <TableCell align="center">
                                            <IconButton onClick={() => handleDownload(report.reportID, report.fileName)} color="primary">
                                                <DownloadIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <Typography variant="body1">Không có báo cáo nào.</Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <IconButton onClick={() => setSelectedProgress(null)} color="default">
                        <CloseIcon />
                    </IconButton>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default ManageProgress;
