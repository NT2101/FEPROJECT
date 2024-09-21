import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Container, Box, CircularProgress, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import { useSnackbar } from 'notistack';

const getUserStudentID = () => {
    const userDataStr = localStorage.getItem('User');
    if (userDataStr) {
        const userData = JSON.parse(userDataStr);
        const studentID = userData && userData.studentInfo ? userData.studentInfo.studentID : null;
        return { studentID };
    }
    return { studentID: null };
};

const TopicChangeRequestForm = () => {
    const { studentID } = getUserStudentID();
    const { control, handleSubmit } = useForm();
    const [currentTopic, setCurrentTopic] = useState(null);
    const [requestStatus, setRequestStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [fieldOptions, setFieldOptions] = useState([]);
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        const fetchCurrentTopicAndRequestStatus = async () => {
            setLoading(true);

            try {
                // Fetch current topic
                const topicResponse = await axios.get(`https://localhost:7217/api/Topic/student/${studentID}`);
                const topicData = topicResponse.data;
    
                // Check if the topic exists
                if (!topicData ) {
                    setCurrentTopic(null);
                    enqueueSnackbar('Chưa có đề tài được phân công. Không thể gửi yêu cầu.', { variant: 'warning', autoHideDuration: 5000 });
                    setLoading(false);
                    return;
                }
    
                setCurrentTopic(topicData);
    
                // Fetch request status
                const requestResponse = await axios.get(`https://localhost:7217/api/TopicChangeRequests/student/${studentID}`);
                const status = Number(requestResponse.data.status); // Ensure status is a number
    
                if (status === 0) {
                    setRequestStatus(0); // Pending
                } else if (status === 1) {
                    setRequestStatus(1); // Approved
                    enqueueSnackbar('Yêu cầu thay đổi đề tài đã được chấp nhận. Bạn không cần gửi yêu cầu nữa.', { variant: 'success', autoHideDuration: 5000 });
                } else if (status === 2) {
                    setRequestStatus(2); // Rejected
                    enqueueSnackbar('Đề tài đã bị từ chối. Vui lòng làm đề tài cũ.', { variant: 'warning', autoHideDuration: 5000 });
                } else {
                    setRequestStatus(null); // Unexpected status code
                    enqueueSnackbar('Trạng thái yêu cầu không hợp lệ.', { variant: 'warning', autoHideDuration: 5000 });
                }
    
                // Fetch field options
                axios.get('https://localhost:7217/api/Fields')
                .then(response => {
                    console.log('Fields API Response:', response); // Kiểm tra dữ liệu phản hồi
                    setFieldOptions(response.data);
                })
                .catch(error => console.error('Lỗi khi lấy dữ liệu lĩnh vực:', error));
            
            } catch (error) {
                enqueueSnackbar('Lỗi khi tải dữ liệu.', { variant: 'error', autoHideDuration: 5000 });
            } finally {
                setLoading(false);
            }
        };

        fetchCurrentTopicAndRequestStatus();
    }, [studentID, enqueueSnackbar]);
console.log(fieldOptions);
useEffect(() => {
    

    axios.get('https://localhost:7217/api/Fields')
      .then(response => {
        setFieldOptions(response.data);
      })
      .catch(error => console.error('Lỗi khi lấy dữ liệu lĩnh vực:', error));
  }, []);

    const onSubmit = async (data) => {
        if (!currentTopic) {
            enqueueSnackbar('Chưa có đề tài được phân công. Không thể gửi yêu cầu.', { variant: 'error', autoHideDuration: 5000 });
            return;
        }

        try {
            const response = await axios.post('https://localhost:7217/api/TopicChangeRequests', {
                studentID: studentID,
                topicID: currentTopic.ID,
                newTitle: data.newTitle,
                newDescription: data.newDescription,
                reasonForChange: data.reasonForChange,
                fieldID: data.fieldID, // Include the selected field ID
            });

            if (response.status === 201) {
                enqueueSnackbar('Yêu cầu thay đổi đề tài đã được gửi thành công!', { variant: 'success', autoHideDuration: 5000 });
                setRequestStatus(1); // Set to pending after successful post
            }
        } catch (error) {
            enqueueSnackbar('Lỗi khi gửi yêu cầu thay đổi đề tài.', { variant: 'error', autoHideDuration: 5000 });
        }
    };

    if (loading) {
        return (
            <Container>
                <CircularProgress />
            </Container>
        );
    }

    if (!currentTopic) {
        return (
            <Container>
                <Typography variant="body1">
                    Chưa có đề tài được phân công. Bạn không thể gửi yêu cầu thay đổi đề tài.
                </Typography>
            </Container>
        );
    }

    return (
        <Container>
            <Typography variant="h5" gutterBottom>
                Đăng ký thay đổi đề tài
            </Typography>
            {requestStatus === null || (requestStatus !== 1 && requestStatus !== 2) ? (
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Box mb={2}>
                        <Typography variant="body1">
                            <strong>Đề tài hiện tại:</strong> {currentTopic ? currentTopic.title : 'Chưa có đề tài'}
                        </Typography>
                    </Box>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Controller
                                name="newTitle"
                                control={control}
                                defaultValue=""
                                render={({ field }) => <TextField {...field} label="Tiêu đề mới" fullWidth required />}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Controller
                                name="fieldID"
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                    <FormControl fullWidth margin="normal">
                                        <InputLabel>Lĩnh Vực</InputLabel>
                                        <Select {...field} label="Lĩnh Vực" required>
                                            {fieldOptions.map(field => (
                                                <MenuItem key={field.id} value={field.id}>
                                                    {field.fieldName}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                )}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Controller
                                name="newDescription"
                                control={control}
                                defaultValue=""
                                render={({ field }) => <TextField {...field} label="Mô tả mới" multiline rows={4} fullWidth required />}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Controller
                                name="reasonForChange"
                                control={control}
                                defaultValue=""
                                render={({ field }) => <TextField {...field} label="Lý do thay đổi" multiline rows={4} fullWidth required />}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button type="submit" variant="contained" color="primary">
                                Gửi yêu cầu
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            ) : requestStatus === 1 ? (
                <Typography variant="body1">
                    Yêu cầu thay đổi đề tài đã được chấp nhận. Bạn không cần gửi yêu cầu nữa.
                </Typography>
            ) : requestStatus === 2 ? (
                <Typography variant="body1">
                    Đề tài đã bị từ chối. Vui lòng làm đề tài cũ.
                </Typography>
            ) : (
                <Typography variant="body1">
                    Trạng thái yêu cầu không hợp lệ.
                </Typography>
            )}
        </Container>
    );
};

export default TopicChangeRequestForm;
