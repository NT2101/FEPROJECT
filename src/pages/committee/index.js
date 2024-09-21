import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, MenuItem, Select, FormControl, InputLabel, CircularProgress } from '@mui/material';
import axios from 'axios';
import { useSnackbar } from 'notistack';

function CommitteeManagementPage() {
  const { enqueueSnackbar } = useSnackbar();
  const [committees, setCommittees] = useState([]);
  const [student, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [numberOfCommittees, setNumberOfCommittees] = useState(1);
  const [selectedCommittee, setSelectedCommittee] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [committeeDetails, setCommitteeDetails] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [studentCount, setStudentCount] = useState('');
  const [remainingStudents, setRemainingStudents] = useState(0);
  const [totalStudentCount, setTotalStudentCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [committeesRes, studentsRes, teachersRes, totalStudentCountRes] = await Promise.all([
          axios.get('https://localhost:7217/api/committee'),
          axios.get('https://localhost:7217/api/student'),
          axios.get('https://localhost:7217/api/teacher'),
          axios.get('https://localhost:7217/api/student/total-student-count')
        ]);
        
        setCommittees(committeesRes.data);
        setStudents(studentsRes.data);
        setTeachers(teachersRes.data);
        setRemainingStudents(studentsRes.data.length);
        setTotalStudentCount(totalStudentCountRes.data.totalCount);
      } catch (error) {
        console.error('Error fetching data:', error);
        enqueueSnackbar('Error fetching data', { variant: 'error' });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [enqueueSnackbar]);
student
  const handleCreateCommittees = async () => {
    try {
      await axios.post('https://localhost:7217/api/Committee/create', { numberOfCommittees });
      setNumberOfCommittees(1); // Reset the number of committees input
      await fetchCommittees(); // Refresh the committee list
      enqueueSnackbar('Committees created successfully', { variant: 'success' });
    } catch (error) {
      console.error('Error creating committees:', error);
      enqueueSnackbar('Error creating committees', { variant: 'error' });
    }
  };
  const handleExportToExcel = async () => {
    try {
      const response = await axios.get('https://localhost:7217/api/Committee/export-excel', {
        responseType: 'blob' // Important to set this to handle binary data
      });
  
      // Create a URL for the blob data
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Danh sách hội đồng.xlsx'); // Set the filename for the download
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      enqueueSnackbar('Xuất file excel thành công', { variant: 'success' });
    } catch (error) {
      console.error('Lỗi khi xuất file Excel:', error);
      enqueueSnackbar('Lỗi khi xuất file Excel', { variant: 'error' });
    }
  };
  const handleAddTeacher = async () => {
    try {
      await axios.post(`https://localhost:7217/api/committee/${selectedCommittee}/add-teacher`, { teacherId: selectedTeacher, role: selectedRole });
      await fetchCommittees(); // Refresh the committee list
      enqueueSnackbar('Thêm giảng viên thành công', { variant: 'success' });
    } catch (error) {
      console.error('Lỗi khi thêm giảng viên:', error);
      enqueueSnackbar('Lỗi khi thêm giảng viên', { variant: 'error' });
    }
  };

  const handleSetStudentCount = async () => {
    try {
      await axios.post(
        `https://localhost:7217/api/committee/${selectedCommittee}/set-student-count`,
        { studentCount: parseInt(studentCount, 10) },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      setStudentCount('');
      await fetchCommittees(); // Refresh the committee list
      enqueueSnackbar('Xét số lượng sinh viên thành công', { variant: 'success' });
    } catch (error) {
      console.error('Lỗi khi xét số lượng sinh viên:', error);
      enqueueSnackbar('Lỗi khi xét số lượng sinh viên', { variant: 'error' });
    }
  };

  const handleRandomAssignStudents = async () => {
    try {
      const response = await axios.post('https://localhost:7217/api/committee/random-assign-students');
      setRemainingStudents(prev => prev - response.data.assignedStudents.length);
      enqueueSnackbar('Students assigned randomly successfully', { variant: 'success' });
    } catch (error) {
      console.error('Error random assigning students:', error);
      enqueueSnackbar('Error random assigning students', { variant: 'error' });
    }
  };

  const fetchCommittees = async () => {
    try {
      const response = await axios.get('https://localhost:7217/api/committee');
      setCommittees(response.data);
    } catch (error) {
      console.error('Error fetching committees:', error);
      enqueueSnackbar('Error fetching committees', { variant: 'error' });
    }
  };
  useEffect(() => {
    const fetchCommitteeDetails = async () => {
      if (!selectedCommittee) return; // No committee selected
  
      try {
        const response = await axios.get(`https://localhost:7217/api/committee/${selectedCommittee}/details`);
        setCommitteeDetails(response.data); // Assume committeeDetails is a state to store the details
      } catch (error) {
        console.error('Error fetching committee details:', error);
        enqueueSnackbar('Error fetching committee details', { variant: 'error' });
      }
    };
  
    fetchCommitteeDetails();
  }, [selectedCommittee, enqueueSnackbar]);

  return (
    <Container>
      {loading ? (
        <CircularProgress />
        
      ) : (
        <>
          {/* Create Committees */}
          <Paper style={{ padding: 16, marginBottom: 16 }}>
          <Typography variant="h5">Xuất Dữ Liệu Ra Excel</Typography>
          <Button variant="contained" onClick={handleExportToExcel}>Xuất Excel</Button>
            <Typography variant="h5">Tạo Hội Đồng</Typography>
            <TextField
              label="Số Lượng Hội Đồng"
              type="number"
              value={numberOfCommittees}
              onChange={(e) => setNumberOfCommittees(e.target.value)}
              fullWidth
              margin="normal"
            />
            <Button variant="contained" onClick={handleCreateCommittees}>Tạo Hội Đồng</Button>
          </Paper>

          {/* Add Teacher */}
          <Paper style={{ padding: 16, marginBottom: 16 }}>
            <Typography variant="h5">Thêm Giảng Viên vào Hội Đồng</Typography>
            <FormControl fullWidth margin="normal">
              <InputLabel>Hội Đồng</InputLabel>
              <Select
                value={selectedCommittee}
                onChange={(e) => setSelectedCommittee(e.target.value)}
              >
                {committees.map((committee) => (
                  <MenuItem key={committee.committeeID} value={committee.committeeID}>
                    {committee.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel>Giảng Viên</InputLabel>
              <Select
                value={selectedTeacher}
                onChange={(e) => setSelectedTeacher(e.target.value)}
              >
                {teachers.map((teacher) => (
                  <MenuItem key={teacher.teacherID} value={teacher.teacherID}>
                    {teacher.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel>Vai Trò</InputLabel>
              <Select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                <MenuItem value="0">Chủ Tịch</MenuItem>
                <MenuItem value="1">Thư Ký</MenuItem>
                <MenuItem value="2">Thành Viên</MenuItem>
              </Select>
            </FormControl>

            <Button variant="contained" onClick={handleAddTeacher}>Thêm Giảng Viên</Button>
          </Paper>

          {/* Set Student Count */}
          <Paper style={{ padding: 16, marginBottom: 16 }}>
            <Typography variant="h5">Cài Đặt Số Lượng Sinh Viên cho Hội Đồng</Typography>
            <Typography variant="body1">Số lượng sinh viên còn lại: {remainingStudents}</Typography>
            <Typography variant="body1">Tổng số sinh viên: {totalStudentCount}</Typography>
            <FormControl fullWidth margin="normal">
              <InputLabel>Hội Đồng</InputLabel>
              <Select
                value={selectedCommittee}
                onChange={(e) => setSelectedCommittee(e.target.value)}
              >
                {committees.map((committee) => (
                  <MenuItem key={committee.committeeID} value={committee.committeeID}>
                    {committee.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Số Lượng Sinh Viên"
              type="number"
              value={studentCount}
              onChange={(e) => setStudentCount(e.target.value)}
              fullWidth
              margin="normal"
            />
            <Button variant="contained" onClick={handleSetStudentCount}>Cài Đặt Số Lượng Sinh Viên</Button>
          </Paper>

          {/* Random Assign Students */}
          <Paper style={{ padding: 16, marginBottom: 16 }}>
            <Typography variant="h5">Gán Sinh Viên Ngẫu Nhiên</Typography>
            <Button variant="contained" onClick={handleRandomAssignStudents}>Gán Sinh Viên</Button>
          </Paper>

          {/* Display Committees */}
          <Paper style={{ padding: 16 }}>
            <Typography variant="h5">Danh Sách Hội Đồng</Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>STT</TableCell>
                    <TableCell>Tên</TableCell>
                    <TableCell>Số lượng</TableCell>
                    <TableCell>Mô Tả</TableCell>
                    <TableCell>Ngày Tạo</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {committees.map((committee, index) => (
                    <TableRow key={committee.committeeID}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{committee.name}</TableCell>
                      <TableCell>{committee.studentCount}</TableCell>
                      <TableCell>{committee.description}</TableCell>
                      <TableCell>{new Date(committee.createdDate).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          {/* Display Students */}
          <Paper style={{ padding: 16, marginTop: 16 }}>
            <Typography variant="h5">Danh Sách Sinh Viên Theo Hội Đồng</Typography>
            <FormControl fullWidth margin="normal">
              <InputLabel>Chọn Hội Đồng</InputLabel>
              <Select
                value={selectedCommittee}
                onChange={(e) => setSelectedCommittee(e.target.value)}
              >
                {committees.map((committee) => (
                  <MenuItem key={committee.committeeID} value={committee.committeeID}>
                    {committee.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

           {/* Display Committee Details */}
           {committeeDetails && (
  <Paper style={{ padding: 16, marginTop: 16 }}>
 
    <Typography variant="h6" style={{ fontSize: '1.25rem' }}>Giảng Viên:</Typography>
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>STT</TableCell>
            <TableCell>Tên</TableCell>
            <TableCell>Vai Trò</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {committeeDetails.teachers.map((teacher, index) => (
            <TableRow key={teacher.teacherID}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{teacher.teacherName}</TableCell>
              <TableCell>{teacher.role}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    <Typography variant="h6" style={{ fontSize: '1.25rem' }}>Sinh Viên:</Typography>
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>STT</TableCell>
            <TableCell>Mã sinh viên</TableCell>
            <TableCell>Tên sinh viên</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {committeeDetails.students.map((student, index) => (
            <TableRow key={student.studentID}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{student.studentID}</TableCell>
              <TableCell>{student.studentName}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </Paper>
)}

          </Paper>
        </>
      )}
    </Container>
  );
}

export default CommitteeManagementPage;
