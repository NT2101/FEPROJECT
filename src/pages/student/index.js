import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box, Button, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Select, FormControl, InputLabel
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MainCard from 'components/MainCard';
import AddStudent from './components/AddStudent';
import EditStudent from './components/EditStudent';
import { useSnackbar } from 'notistack';
import dayjs from 'dayjs';
import ReactPaginate from 'react-paginate';
import './styles.css'; // Đảm bảo rằng bạn đã nhập CSS vào dự án của bạn

function Student() {
  const { enqueueSnackbar } = useSnackbar();
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get('https://localhost:7217/api/Student');
        setStudents(response.data);
        setFilteredStudents(response.data);
      } catch (error) {
        enqueueSnackbar('Lỗi khi lấy danh sách sinh viên', { variant: 'error' });
      }
    };

    fetchStudents();
  }, [enqueueSnackbar]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axios.get('https://localhost:7217/api/classes');
        setClasses(response.data);
      } catch (error) {
        enqueueSnackbar('Lỗi khi lấy danh sách lớp', { variant: 'error' });
      }
    };

    fetchClasses();
  }, [enqueueSnackbar]);

  useEffect(() => {
    if (selectedClass) {
      setFilteredStudents(students.filter(student => student.classID === selectedClass));
    } else {
      setFilteredStudents(students);
    }
  }, [selectedClass, students]);

  const handleEditClick = (item) => {
    setSelectedItem(item);
    setOpenEdit(true);
  };

  const handleDeleteClick = (item) => {
    setSelectedItem(item);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`https://localhost:7217/api/Student/${selectedItem.studentID}`);
      setStudents(prevStudents => prevStudents.filter(student => student.studentID !== selectedItem.studentID));
      setFilteredStudents(prevStudents => prevStudents.filter(student => student.studentID !== selectedItem.studentID));
      enqueueSnackbar('Xóa sinh viên thành công', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Lỗi khi xóa sinh viên', { variant: 'error' });
    }
    setDeleteDialogOpen(false);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  const handleEditClose = () => {
    setOpenEdit(false);
    setSelectedItem(null);
  };

  const handleCreateOpen = () => {
    setOpen(true);
  };

  const handleCreateClose = () => {
    setOpen(false);
  };

  const handleImportOpen = () => {
    setImportDialogOpen(true);
  };

  const handleImportClose = () => {
    setImportDialogOpen(false);
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleDownloadSample = async () => {
    try {
      const response = await axios.get('https://localhost:7217/api/Student/download-sample', {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'SampleStudentImport.xlsx');
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      enqueueSnackbar('Lỗi khi tải file mẫu', { variant: 'error', autoHideDuration: 5000  });
    }
  };

  const handleRefresh = () => {
    axios.get('https://localhost:7217/api/Student').then(response => {
        setStudents(response.data);
        setFilteredStudents(response.data);
    });
};
  const handleImportSubmit = async () => {
    if (!file) {
      enqueueSnackbar('Chưa chọn file Excel', { variant: 'warning', autoHideDuration: 5000  });
      return;
    }



    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post('https://localhost:7217/api/Student/import-students', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      enqueueSnackbar('Nhập dữ liệu từ file Excel thành công', { variant: 'success' , autoHideDuration: 5000 });
      setImportDialogOpen(false);
      const response = await axios.get('https://localhost:7217/api/Student');
      setStudents(response.data);
      setFilteredStudents(response.data);
    } catch (error) {
      enqueueSnackbar('Lỗi khi nhập dữ liệu từ file Excel', { variant: 'error' , autoHideDuration: 5000 });
    }
  };

  const handleExportClick = async () => {
    try {
      const response = await axios.get('https://localhost:7217/api/Student/export/students', {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'DanhSachSinhVien.xlsx');
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      enqueueSnackbar('Lỗi khi xuất dữ liệu', { variant: 'error' , autoHideDuration: 5000 });
    }
  };

  const formatDate = (date) => {
    return date ? dayjs(date).format('DD/MM/YYYY') : '';
  };

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  const displayedStudents = filteredStudents.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);
  const pageCount = Math.ceil(filteredStudents.length / itemsPerPage);

  return (
    <Box>
      <MainCard>
        <Grid container alignItems="center" justifyContent="space-between" mb={2}>
          <Grid item>
            <Typography variant="h5">Danh sách sinh viên</Typography>
          </Grid>
          <Grid item>
            <Button onClick={handleCreateOpen} variant="contained" color="primary">
              Thêm mới
            </Button>
            <Button onClick={handleImportOpen} variant="contained" color="secondary" style={{ marginLeft: 16 }}>
              Nhập từ Excel
            </Button>
            <Button onClick={handleExportClick} variant="contained" color="success" style={{ marginLeft: 16 }}>
              Xuất Excel
            </Button>
            <Button onClick={handleDownloadSample} variant="contained" color="info" style={{ marginLeft: 16 }}>
              Tải file mẫu
            </Button>
          </Grid>
        </Grid>
        <Grid container spacing={2} mb={2}>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Chọn lớp</InputLabel>
              <Select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                label="Chọn lớp"
              >
                <MenuItem value="">
                  <em>Tất cả</em>
                </MenuItem>
                {classes.map((cls) => (
                  <MenuItem key={cls.id} value={cls.id}>
                    {cls.className}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="student table">
            <TableHead>
              <TableRow>
                <TableCell align="center">STT</TableCell>
                <TableCell align="center">Mã sinh viên</TableCell>
                <TableCell align="center">Tên sinh viên</TableCell>
                <TableCell align="center">Ngày sinh</TableCell>
                <TableCell align="center">Giới tính</TableCell>
                <TableCell align="center">Địa chỉ</TableCell>
                <TableCell align="center">Số điện thoại</TableCell>
                <TableCell align="center">Email</TableCell>
                <TableCell align="center">Lớp</TableCell>
                <TableCell align="center">Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedStudents.map((student, index) => (
                <TableRow key={student.studentID}>
                  <TableCell align="center">{currentPage * itemsPerPage + index + 1}</TableCell>
                  <TableCell align="">{student.studentID}</TableCell>
                  <TableCell align="">{student.name}</TableCell>
                  <TableCell align="center">{formatDate(student.dob)}</TableCell>
                  <TableCell align="center">{student.sex === 0 ? 'Nam' : 'Nữ'}</TableCell>
                  <TableCell align="">{student.address}</TableCell>
                  <TableCell align="">{student.phoneNumber}</TableCell>
                  <TableCell align="">{student.emailAddress}</TableCell>
                  <TableCell align="center">{student.classID}</TableCell>
                 
                  <TableCell align="center">
                                        <EditIcon onClick={() => handleEditClick(student)} style={{ cursor: 'pointer', marginRight: 8 }} />
                                        <DeleteIcon style={{ cursor: 'pointer', marginRight: 8 }} onClick={() => handleDeleteClick(student)} />
                                    </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <ReactPaginate
          pageCount={pageCount}
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

      {/* Add Student Dialog */}
      <Dialog open={open} onClose={handleCreateClose}>
                <DialogTitle>Thêm Sinh Viên</DialogTitle>
                <DialogContent>
                    <AddStudent onClose={handleCreateClose} onRefresh={handleRefresh} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCreateClose} color="primary">
                        Đóng
                    </Button>
                </DialogActions>
            </Dialog>

      {/* Edit Student Dialog */}
      <Dialog open={openEdit} onClose={handleEditClose}>
        <DialogTitle>Chỉnh Sửa Sinh Viên</DialogTitle>
        <DialogContent>
          <EditStudent student={selectedItem} onClose={handleEditClose} onRefresh={() => {
            axios.get('https://localhost:7217/api/Student').then(response => {
              setStudents(response.data);
              setFilteredStudents(response.data);
            });
          }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose} color="primary">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Xác Nhận Xóa</DialogTitle>
        <DialogContent>
          <Typography variant="body1">Bạn có chắc chắn muốn xóa sinh viên này không?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Hủy
          </Button>
          <Button onClick={handleDeleteConfirm} color="secondary">
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      {/* Import Dialog */}
      <Dialog open={importDialogOpen} onClose={handleImportClose}>
        <DialogTitle>Nhập Sinh Viên Từ Excel</DialogTitle>
        <DialogContent>
          <Button variant="outlined" component="label">
            Chọn file
            <input type="file" accept=".xlsx, .xls" hidden onChange={handleFileChange} />
          </Button>
          <Button onClick={handleImportSubmit} variant="contained" color="primary" style={{ marginLeft: 16 }}>
            Nhập dữ liệu
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleImportClose} color="primary">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Student;
