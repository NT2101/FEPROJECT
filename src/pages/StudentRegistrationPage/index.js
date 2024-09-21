import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { TextField, Button, MenuItem, Grid, Typography, Select, FormControl, InputLabel, Box, Card, CardContent, Divider } from '@mui/material';
import axios from 'axios';

const getStatusLabel = (status) => {
  switch (status) {
    case 1:
      return 'Chưa xác nhận';
    case 2:
      return 'Đang chờ xét duyệt';
    case 3:
      return 'Đã bị từ chối, vui lòng đăng ký lại';
    case 4:
      return 'Đã xác nhận';
    default:
      return 'Đã được thay đổi';
  }
};


const StudentRegistrationPage = () => {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm();
  const [studentID, setStudentID] = useState('');
  const [teacherOptions, setTeacherOptions] = useState([]);
  const [fieldOptions, setFieldOptions] = useState([]);
  const [statusTopic, setStatusTopic] = useState(null);
  const [status, setStatus] = useState(null);
  const [statuss, setStatuss] = useState(null);
  const [existingTopic, setExistingTopic] = useState(null);
  const [newTopic, setNewTopic] = useState(null);

  const selectedTeacherID = watch('teacherID', '');
  const selectedFieldID = watch('fieldID', '');

  // Fetch initial data for student ID and status topic
  useEffect(() => {
    const userDataStr = localStorage.getItem('User');
    if (userDataStr) {
      const userData = JSON.parse(userDataStr);
      if (userData && userData.studentInfo && userData.studentInfo.studentID) {
        setStudentID(userData.studentInfo.studentID);
        setStatusTopic(userData.studentInfo.statusTopic);
      }
    }

    axios.get('https://localhost:7217/api/Teacher')
      .then(response => {
        setTeacherOptions(response.data);
      })
      .catch(error => console.error('Lỗi khi lấy dữ liệu giảng viên:', error));

    axios.get('https://localhost:7217/api/Fields')
      .then(response => {
        setFieldOptions(response.data);
      })
      .catch(error => console.error('Lỗi khi lấy dữ liệu lĩnh vực:', error));
  }, []);

  // Fetch existing topic data if studentID and statusTopic are set
// Fetch existing topic data if studentID and statusTopic are set
useEffect(() => {
  if (studentID && (statusTopic === 2 || statusTopic === 3)) {
    axios.get(`https://localhost:7217/GetTopicStudent/${studentID}`)
      .then(response => {
        const topic = response.data[0];
        setExistingTopic(topic);
        setStatus(topic.status);
        if (statusTopic === 3) {
          setValue('title', topic.title);
          setValue('description', topic.description);
          setValue('teacherID', topic.teacherID);
          setValue('fieldID', topic.fieldID);
        }
      })
      .catch(error => {
        console.error('Lỗi khi lấy đề tài của sinh viên:', error);
        alert('Không thể lấy dữ liệu đề tài. Vui lòng thử lại sau.');
      });

    axios.get(`https://localhost:7217/api/TopicChangeRequests/student/${studentID}`)
      .then(response => {
        const topics = response.data;
        console.log(topics);
        
        if (topics) {
          setNewTopic(topics);
          setStatuss(topics.status);
          if (topics.status === 1) {
            setValue('title', topics.newTitle);
            setValue('description', topics.newDescription);
          }
        } else {
          console.error('Lỗi: Không có dữ liệu đề tài thay đổi.');
          alert('Không có đề tài thay đổi cho sinh viên này.');
        }
      })
      .catch(error => {
        console.error('Lỗi khi lấy đề tài thay đổi của sinh viên:', error);
        alert('Không thể lấy dữ liệu đề tài thay đổi. Vui lòng thử lại sau.');
      });
  }
}, [studentID, statusTopic, setValue]);


  // Display status alert
  useEffect(() => {
    if (status !== null) {
      alert(`Trạng thái đề tài: ${getStatusLabel(status)}`);
    }
  }, [status]);

  // Handle form submission
  const handleSubmitForm = (data) => {
    const topicData = {
      title: data.title,
      description: data.description,
      studentID: studentID,
      teacherID: parseInt(data.teacherID, 10),
      fieldID: parseInt(data.fieldID, 10),
    };

    if (statusTopic === 1) {
      axios.post('https://localhost:7217/api/Topic/Create', topicData)
        .then(() => {
          updateStatusTopic(2);
          alert("Đăng ký đề tài thành công, chờ đợi xét duyệt!");
        })
        .catch(error => {
          console.error('Lỗi khi đăng ký đề tài:', error);
          alert("Đã xảy ra lỗi khi đăng ký đề tài. Vui lòng thử lại.");
        });
    } else if (statusTopic === 3) {
      axios.put('https://localhost:7217/api/Topic/api/UpdateTopic', topicData)
  .then(() => {
    updateStatusTopic(2);
    alert("Cập nhật đề tài thành công, chờ đợi xét duyệt!");
  })
  .catch(error => {
    console.error('Lỗi khi cập nhật đề tài:', error);
    alert("Đã xảy ra lỗi khi cập nhật đề tài. Vui lòng thử lại.");
  });

    }
  };

  // Update status topic in local storage and reload page
  const updateStatusTopic = (newStatus) => {
    axios.put(`https://localhost:7217/api/Topic/api/UpdateStudentStatus/${studentID}/${newStatus}`, { statusTopic: newStatus })
      .then(() => {
        const userDataStr = localStorage.getItem('User');
        if (userDataStr) {
          const userData = JSON.parse(userDataStr);
          userData.studentInfo.statusTopic = newStatus;
          localStorage.setItem('User', JSON.stringify(userData));
          window.location.reload();
        }
      })
      .catch(error => console.error('Lỗi khi cập nhật trạng thái đề tài:', error));
  };

  return  (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom sx={{ marginBottom: 2 }}>
        {statusTopic === 1 || statusTopic === 3 ? 'Đăng ký đề tài' : 'Thông tin đăng ký'}
      </Typography>
  
      {/* Kiểm tra nếu statusTopic là 0 thì hiển thị thông báo, ngược lại hiển thị form */}
      {statusTopic === 0 ? (
        <Typography variant="h6" color="error">
          Hãy cập nhật thông tin để đăng ký đề tài.
        </Typography>
      ) : statusTopic === 1 || statusTopic === 3 ? (
  
        <form onSubmit={handleSubmit(handleSubmitForm)}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required
                label="Tiêu đề"
                fullWidth
                {...register('title', { required: 'Tiêu đề là bắt buộc' })}
                error={!!errors.title}
                helperText={errors.title?.message}
                InputLabelProps={{ shrink: true }} // Làm nhãn luôn đứng yên
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                label="Mô tả"
                fullWidth
                multiline
                rows={4}
                {...register('description', { required: 'Mô tả là bắt buộc' })}
                error={!!errors.description}
                helperText={errors.description?.message}
                InputLabelProps={{ shrink: true }} // Làm nhãn luôn đứng yên
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth error={!!errors.teacherID}>
                <InputLabel id="teacherID-label">Chọn giảng viên</InputLabel>
                <Select
                  labelId="teacherID-label"
                  id="teacherID"
                  value={selectedTeacherID}
                  onChange={(e) => setValue('teacherID', e.target.value)}
                  {...register('teacherID', { required: 'Vui lòng chọn giảng viên' })}
                >
                  {teacherOptions.length > 0 ? teacherOptions.map((teacher) => (
                    <MenuItem key={teacher.teacherID} value={teacher.teacherID}>
                      {teacher.name}
                    </MenuItem>
                  )) : (
                    <MenuItem value="">
                      <em>Không có dữ liệu</em>
                    </MenuItem>
                  )}
                </Select>
                <Typography variant="caption" color="error">
                  {errors.teacherID?.message}
                </Typography>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth error={!!errors.fieldID}>
                <InputLabel id="fieldID-label">Lĩnh vực</InputLabel>
                <Select
                  labelId="fieldID-label"
                  id="fieldID"
                  value={selectedFieldID}
                  onChange={(e) => setValue('fieldID', e.target.value)}
                  {...register('fieldID', { required: 'Vui lòng chọn lĩnh vực' })}
                >
                  {fieldOptions.length > 0 ? fieldOptions.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.fieldName}
                    </MenuItem>
                  )) : (
                    <MenuItem value="">
                      <em>Không có dữ liệu</em>
                    </MenuItem>
                  )}
                </Select>
                <Typography variant="caption" color="error">
                  {errors.fieldID?.message}
                </Typography>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" type="submit" fullWidth>
                {statusTopic === 1 ? 'Đăng ký đề tài' : 'Cập nhật đề tài'}
              </Button>
            </Grid>
          </Grid>
        </form>
      ) : (
        <>
          <Card>
            <CardContent>
              <Typography variant="h5">Thông tin đề tài:</Typography>
              <Divider sx={{ marginY: 1 }} />
              <Typography variant="body1"><strong>Tiêu đề:</strong> {existingTopic?.title}</Typography>
              <Typography variant="body1"><strong>Mô tả:</strong> {existingTopic?.description}</Typography>
              <Typography variant="body1"><strong>Giảng viên:</strong> {teacherOptions.find(teacher => teacher.teacherID === existingTopic?.teacherID)?.name}</Typography>
              <Typography variant="body1"><strong>Lĩnh vực:</strong> {fieldOptions.find(field => field.id === existingTopic?.fieldID)?.fieldName}</Typography>
              <Typography variant="body1"><strong>Trạng thái:</strong> {getStatusLabel(status)}</Typography>
            </CardContent>
          </Card>

          {statuss === 1 && newTopic ? (
            <>
              <Typography variant="h6" gutterBottom sx={{ marginTop: 2 }}>
                Thông tin đề tài thay đổi
              </Typography>
              <Card>
                <CardContent>
                  <Typography variant="body1"><strong>Tiêu đề:</strong> {newTopic.newTitle}</Typography>
                  <Typography variant="body1"><strong>Lĩnh vực</strong> {newTopic.fieldName}</Typography>
                  <Typography variant="body1"><strong>Mô tả:</strong> {newTopic.newDescription}</Typography>
                </CardContent>
              </Card>
            </>
          ) : null}
        </>
      )}
    </Box>
  );
};

export default StudentRegistrationPage;
