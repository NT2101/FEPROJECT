import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Typography,
    TextField,
    Card,
    CardContent,
    Divider,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper
} from '@mui/material';
import { useSnackbar } from 'notistack';
import axios from 'axios';

// Function to get user role and studentID
const getUserRoleAndStudentID = () => {
    const userDataStr = localStorage.getItem('User');
    if (userDataStr) {
        const userData = JSON.parse(userDataStr);
        const studentID = userData && userData.studentInfo ? userData.studentInfo.studentID : null;
        const statusProgess = userData && userData.studentInfo ? userData.studentInfo.statusProgess : null;

        return { studentID, statusProgess };
    }
    return { studentID: null, statusProgess: null };
};

const SubmitReport = () => {
    const { studentID, statusProgess } = getUserRoleAndStudentID();
    const [file, setFile] = useState(null);
    const [submittedFiles, setSubmittedFiles] = useState([]);
    const [isDeadlinePassed, setIsDeadlinePassed] = useState(false);
    const [progress, setProgress] = useState(null);
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        const fetchSubmittedFiles = async () => {
            if (statusProgess === 2 && studentID) {
                try {
                    const response = await axios.get(`https://localhost:7217/api/ProgressReport/GetSubmittedFiles/${studentID}`);
                    setSubmittedFiles(response.data);
                } catch (error) {
                    enqueueSnackbar('Lấy danh sách file đã nộp thất bại', { variant: 'error' });
                }
            }
        };

        fetchSubmittedFiles();
    }, [studentID, statusProgess, enqueueSnackbar]);

    useEffect(() => {
        const fetchDeadlineStatus = async () => {
            if (studentID) {
                try {
                    const response = await axios.get(`https://localhost:7217/api/Progress/CheckProgressForToday`);
                    if (response.data.status) {
                        setProgress(response.data.progress);
                        setIsDeadlinePassed(false);
                    } else {
                        setIsDeadlinePassed(true);
                    }
                } catch (error) {
                    enqueueSnackbar('Không thể kiểm tra tiến độ cho hôm nay', { variant: 'error' });
                }
            }
        };

        fetchDeadlineStatus();
    }, [studentID, enqueueSnackbar]);
console.log(progress);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!file) {
            enqueueSnackbar('Vui lòng chọn một file để tải lên', { variant: 'warning' });
            return;
        }

        if (!progress) {
            enqueueSnackbar('Không có kỳ báo cáo nào trong ngày hôm nay', { variant: 'error' });
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('studentID', studentID);
        formData.append('progressID', progress.progressID);

        try {
            await axios.post('https://localhost:7217/api/ProgressReport/SubmitReport', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            enqueueSnackbar('Nộp báo cáo thành công', { variant: 'success' });

            // Update statusProgess to 2
            const updatedUserData = {
                ...JSON.parse(localStorage.getItem('User')),
                studentInfo: {
                    ...JSON.parse(localStorage.getItem('User')).studentInfo,
                    statusProgess: 2
                }
            };
            localStorage.setItem('User', JSON.stringify(updatedUserData));

            setFile(null); // Clear selected file after successful submission
            
            // Refresh submitted files
            const response = await axios.get(`https://localhost:7217/api/ProgressReport/GetSubmittedFiles/${studentID}`);
            setSubmittedFiles(response.data);

        } catch (error) {
            enqueueSnackbar('Nộp báo cáo thất bại', { variant: 'error' });
        }
    };

    return (
        <Box padding={3} maxWidth="800px" mx="auto">
            <Typography variant="h4" gutterBottom>
                Nộp Báo Cáo Tiến Độ
            </Typography>
            <Card variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                    {isDeadlinePassed ? (
                        <Typography variant="body1" color="error">
                            Thời gian nộp báo cáo đã qua. Bạn không thể nộp báo cáo nữa.
                        </Typography>
                    ) : statusProgess === 1 ? (
                        <>
                            <Typography variant="h6" gutterBottom>
                                Tải lên báo cáo
                            </Typography>
                            <TextField 
                                type="file" 
                                onChange={handleFileChange} 
                                fullWidth 
                                margin="normal" 
                                variant="outlined" 
                            />
                            <Button 
                                type="submit" 
                                variant="contained" 
                                color="primary" 
                                sx={{ mt: 2 }}
                                onClick={handleSubmit}
                            >
                                Nộp
                            </Button>
                        </>
                    ) : statusProgess === 2 ? (
                        <Box>
                            <Typography variant="h6" gutterBottom>
                                Các File Đã Nộp
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Tên Tiến Độ</TableCell>
                                            <TableCell>Tên File</TableCell>
                                            <TableCell>Nhận Xét</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {submittedFiles.length > 0 ? (
                                            submittedFiles.map((file) => (
                                                <TableRow key={file.reportID}>
                                                    <TableCell>{file.title}</TableCell>
                                                    <TableCell>{file.fileName}</TableCell>
                                                    <TableCell>{file.comments ? file.comments : 'Chưa có nhận xét'}</TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={3}>
                                                    <Typography variant="body1" align="center">
                                                        Không có file nào được nộp.
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    ) : (
                        <Typography variant="body1">
                            Trạng thái tiến độ của bạn không được thiết lập để cho phép nộp báo cáo hoặc xem.
                        </Typography>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
};

export default SubmitReport;
