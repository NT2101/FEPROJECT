import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Button, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MainCard from 'components/MainCard';
import AddTeacher from './components/AddTeacher';
import EditTeacher from './components/EditTeacher';
import { useSnackbar } from 'notistack';
import dayjs from 'dayjs'; // For date formatting
import ReactPaginate from 'react-paginate'; // Import ReactPaginate

function Faculty() {
  const { enqueueSnackbar } = useSnackbar();
  const [teachers, setTeachers] = useState([]);
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [page, setPage] = useState(0); // Current page

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await axios.get('https://localhost:7217/api/Teacher');
        setTeachers(response.data);
      } catch (error) {
        enqueueSnackbar('Lỗi khi lấy danh sách giảng viên', { variant: 'error' });
      }
    };

    fetchTeachers();
  }, [enqueueSnackbar]);

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
      await axios.delete(`https://localhost:7217/api/Teacher/${selectedItem.teacherID}`);
      setTeachers((prevTeachers) => prevTeachers.filter((teacher) => teacher.teacherID !== selectedItem.teacherID));
      enqueueSnackbar('Xóa giảng viên thành công', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Lỗi khi xóa giảng viên', { variant: 'error' });
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

  const handleImportSubmit = async () => {
    if (!file) {
      enqueueSnackbar('Chưa chọn file Excel', { variant: 'warning' });
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post('https://localhost:7217/api/Teacher/import', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      enqueueSnackbar('Nhập dữ liệu từ file Excel thành công', { variant: 'success' });
      setImportDialogOpen(false);
      // Reload teachers list
      const response = await axios.get('https://localhost:7217/api/Teacher');
      setTeachers(response.data);
    } catch (error) {
      enqueueSnackbar('Lỗi khi nhập dữ liệu từ file Excel', { variant: 'error' });
    }
  };

  const formatDate = (date) => {
    return date ? dayjs(date).format('DD/MM/YYYY') : '';
  };

  const handlePageClick = (event) => {
    setPage(event.selected);
  };

  return (
    <Box>
      <MainCard>
        <Grid container alignItems="center" justifyContent="space-between" mb={2}>
          <Grid item>
            <Typography variant="h5">Danh sách giảng viên</Typography>
          </Grid>
          <Grid item>
            <Button onClick={handleCreateOpen} variant="contained" color="primary">
              Thêm mới
            </Button>
            <Button onClick={handleImportOpen} variant="contained" color="secondary" style={{ marginLeft: 16 }}>
              Nhập từ Excel
            </Button>
          </Grid>
        </Grid>
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="teacher table">
              <TableHead>
                <TableRow>
                  <TableCell align="center">STT</TableCell>
                  <TableCell align="center">Tên</TableCell>
                  <TableCell align="center">Ngày sinh</TableCell>
                  <TableCell align="center">Giới tính</TableCell>
                  <TableCell align="center">Số điện thoại</TableCell>
                  <TableCell align="center">Địa chỉ email</TableCell>
                  <TableCell align="center">Mô tả</TableCell>
                  <TableCell align="center">Mã khoa</TableCell>
                  <TableCell align="center">Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {teachers.slice(page * 5, page * 5 + 5).map((teacher, index) => (
                  <TableRow key={teacher.teacherID}>
                    <TableCell align="center">{index + 1 + page * 5}</TableCell>
                    <TableCell align="">{teacher.name}</TableCell>
                    <TableCell align="center">{formatDate(teacher.dob)}</TableCell>
                    <TableCell align="center">{teacher.sex === 0 ? 'Nam' : 'Nữ'}</TableCell>
                    <TableCell align="">{teacher.phoneNumber}</TableCell>
                    <TableCell align="">{teacher.emailAddress}</TableCell>
                    <TableCell align="">{teacher.description}</TableCell>
                    <TableCell align="center">{teacher.facultyID}</TableCell>
                    <TableCell align="center">
                      <EditIcon
                        onClick={() => handleEditClick(teacher)}
                        style={{ cursor: 'pointer', marginRight: 8 }}
                      />
                      <DeleteIcon
                        onClick={() => handleDeleteClick(teacher)}
                        style={{ cursor: 'pointer' }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination Component */}
          <ReactPaginate
            pageCount={Math.ceil(teachers.length / 5)}
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

        <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
          <DialogTitle>Xác nhận xóa</DialogTitle>
          <DialogContent>
            Bạn có chắc chắn muốn xóa giảng viên {selectedItem?.name}?
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteCancel} color="primary">
              Hủy
            </Button>
            <Button onClick={handleDeleteConfirm} color="primary">
              Xác nhận
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={open} onClose={handleCreateClose} fullWidth maxWidth="sm">
          <DialogTitle>
            <Typography variant="h4" fontWeight="bold">
              Thêm giảng viên mới
            </Typography>
          </DialogTitle>
          <AddTeacher onClick={handleCreateClose} />
        </Dialog>

        <Dialog open={openEdit} onClose={handleEditClose} fullWidth maxWidth="sm">
          <DialogTitle>
            <Typography variant="h4" fontWeight="bold">
              Chỉnh sửa giảng viên
            </Typography>
          </DialogTitle>
          <EditTeacher item={selectedItem} onClick={handleEditClose} />
        </Dialog>

        <Dialog open={importDialogOpen} onClose={handleImportClose}>
          <DialogTitle>Nhập dữ liệu từ Excel</DialogTitle>
          <DialogContent>
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileChange}
              style={{ marginBottom: 16 }}
            />
            <Button
              onClick={handleImportSubmit}
              variant="contained"
              color="primary"
              disabled={!file}
            >
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

  export default Faculty;

