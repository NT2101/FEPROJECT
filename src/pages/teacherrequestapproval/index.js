import React, { useState, useEffect } from 'react';
import { Container, CircularProgress, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import axios from 'axios';
import { useSnackbar } from 'notistack';

const getUserRoleAndTeacherID = () => {
    const userDataStr = localStorage.getItem('User');
    if (userDataStr) {
        const userData = JSON.parse(userDataStr);
        if (userData && userData.teacherInfo) {
            const teacherID = userData.teacherInfo.teacherID;
            return { teacherID };
        }
    }
    return { teacherID: null };
};

const TeacherRequestApproval = () => {
    const { teacherID } = getUserRoleAndTeacherID();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const { enqueueSnackbar } = useSnackbar();

    // Define fetchRequests function outside of useEffect
    const fetchRequests = async () => {
        if (teacherID) {
            setLoading(true);
            try {
                const response = await axios.get(`https://localhost:7217/api/TopicChangeRequests/teacher/${teacherID}`);
                setRequests(response.data);
            } catch (error) {
                enqueueSnackbar('Lỗi khi lấy yêu cầu thay đổi đề tài.', { variant: 'error' });
            } finally {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        fetchRequests();
    }, [teacherID]);

    const handleApprove = async (requestID) => {
        try {
            await axios.put(`https://localhost:7217/api/TopicChangeRequests/Agree/${requestID}`);
            enqueueSnackbar('Yêu cầu đã được chấp nhận.', { variant: 'success' });
            fetchRequests(); // Refresh the request list
        } catch (error) {
            enqueueSnackbar('Lỗi khi chấp nhận yêu cầu.', { variant: 'error' });
        }
    };

    const handleReject = async (requestID) => {
        try {
            await axios.put(`https://localhost:7217/api/TopicChangeRequests/Disagree/${requestID}`);
            enqueueSnackbar('Yêu cầu đã bị từ chối.', { variant: 'warning' });
            fetchRequests(); // Refresh the request list
        } catch (error) {
            enqueueSnackbar('Lỗi khi từ chối yêu cầu.', { variant: 'error' });
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 0:
                return 'Chưa xác nhận';
            case 1:
                return 'Đã xác nhận';
            case 2:
                return 'Đã từ chối';
            default:
                return 'Không xác định';
        }
    };

    if (loading) {
        return (
            <Container>
                <CircularProgress />
            </Container>
        );
    }

    return (
        <Container>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>STT</TableCell>
                            <TableCell>Mã sinh viên</TableCell>
                            <TableCell>Tên sinh viên</TableCell>
                            <TableCell>Tiêu đề mới</TableCell>
                            <TableCell>Mô tả mới</TableCell>
                            <TableCell>Lý do thay đổi</TableCell>
                            <TableCell>Trạng thái</TableCell>
                            <TableCell>Hành động</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {requests.map((request, index) => (
                            <TableRow key={request.id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{request.student?.studentID || 'N/A'}</TableCell>
                                <TableCell>{request.student?.name || 'N/A'}</TableCell>
                                <TableCell>{request.newTitle}</TableCell>
                                <TableCell>{request.newDescription}</TableCell>
                                <TableCell>{request.reasonForChange}</TableCell>
                                <TableCell>{getStatusText(request.status)}</TableCell>
                                <TableCell>
                                    {request.status === 0 && (
                                        <>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={() => handleApprove(request.id)}
                                                style={{ marginRight: '10px' }}
                                            >
                                                Chấp nhận
                                            </Button>
                                            <Button
                                                variant="contained"
                                                color="secondary"
                                                onClick={() => handleReject(request.id)}
                                            >
                                                Từ chối
                                            </Button>
                                        </>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default TeacherRequestApproval;
