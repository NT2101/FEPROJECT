import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Grid, Paper, Typography, Button, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

const ManageProgress = () => {
    const [progresses, setProgresses] = useState([]);
    const [selectedProgress, setSelectedProgress] = useState(null);
    const [reports, setReports] = useState([]);

    // Fetch all progresses on component mount
    useEffect(() => {
        const fetchProgresses = async () => {
            try {
                const response = await axios.get('https://localhost:7217/api/ProgressReport/GetAllProgresses');
                setProgresses(response.data);
            } catch (error) {
                console.error('Failed to fetch progresses', error);
            }
        };
        fetchProgresses();
    }, []);

    

    // Handle progress click to fetch reports
    const handleProgressClick = async (progressID) => {
        setSelectedProgress(progressID);
        try {
            const response = await axios.get(`https://localhost:7217/api/ProgressReport/GetReportsByProgress/${progressID}`);
            setReports(response.data);
        } catch (error) {
            console.error('Failed to fetch reports', error);
        }
    };

    // Handle file download
    const handleDownload = async (reportID, fileName) => {
        try {
            const response = await axios.get(`https://localhost:7217/api/ProgressReport/DownloadReport/${reportID}`, {
                responseType: 'blob',  // Specify the response type as blob to handle binary data
            });

            // Create a link element to trigger the download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName); // Set the file name for the download
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Failed to download file', error);
        }
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Quản lý các kỳ báo cáo tiến độ
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                   
                </Grid>
                <Grid item xs={12}>
                    <Paper style={{ padding: 16 }}>
                        <Typography variant="h6" gutterBottom>
                            Danh sách các kỳ báo cáo tiến độ
                        </Typography>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Tiêu đề</TableCell>
                                    <TableCell>Mô tả</TableCell>
                                    <TableCell>Ngày bắt đầu</TableCell>
                                    <TableCell>Ngày kết thúc</TableCell>
                                    <TableCell>Hành động</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {progresses.map((progress) => (
                                    <TableRow key={progress.progressID}>
                                        <TableCell>{progress.progressID}</TableCell>
                                        <TableCell>{progress.title}</TableCell>
                                        <TableCell>{progress.description}</TableCell>
                                        <TableCell>{new Date(progress.startDate).toLocaleDateString()}</TableCell>
                                        <TableCell>{new Date(progress.endDate).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            <Button 
                                                variant="contained" 
                                                color="secondary"
                                                onClick={() => handleProgressClick(progress.progressID)}
                                            >
                                                Xem báo cáo
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Paper>
                </Grid>
                {selectedProgress && (
                    <Grid item xs={12}>
                        <Paper style={{ padding: 16 }}>
                            <Typography variant="h6" gutterBottom>
                                Danh sách báo cáo cho kỳ báo cáo {selectedProgress}
                            </Typography>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>ID Báo cáo</TableCell>
                                        <TableCell>Tên sinh viên</TableCell>
                                        <TableCell>Tên giảng viên</TableCell>
                                        <TableCell>TIến độ</TableCell>
                                        <TableCell>Ngày nộp</TableCell>
                                        <TableCell>Hành động</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {reports.map((report) => (
                                        <TableRow key={report.reportID}>
                                            <TableCell>{report.reportID}</TableCell>
                                            <TableCell>{report.studentName}</TableCell>
                                            <TableCell>{report.teacherName}</TableCell>
                                            <TableCell>{report.fileName}</TableCell>
                                            <TableCell>{new Date(report.submissionDate).toLocaleDateString()}</TableCell>
                                            <TableCell>
                                                <Button 
                                                    variant="contained" 
                                                    color="primary"
                                                    onClick={() => handleDownload(report.reportID, report.fileName)}
                                                >
                                                    Tải xuống
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Paper>
                    </Grid>
                )}
            </Grid>
        </Container>
    );
};

export default ManageProgress;
