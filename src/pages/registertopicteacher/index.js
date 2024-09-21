import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  TextField,
  Button,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSnackbar } from 'notistack';

const getUserRoleAndTeacherID = () => {
  const userDataStr = localStorage.getItem('User');
  if (userDataStr) {
    const userData = JSON.parse(userDataStr);
    if (userData && userData.account) {
      const teacherID = userData.teacherInfo ? userData.teacherInfo.teacherID : null;
      return { teacherID };
    }
  }
  return { teacherID: null };
};

const RegisterTopicForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [fieldID, setFieldID] = useState('');
  const [fields, setFields] = useState([]);
  const [topics, setTopics] = useState([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const { enqueueSnackbar } = useSnackbar();
  const { teacherID } = getUserRoleAndTeacherID();

  useEffect(() => {
    const fetchFields = async () => {
      try {
        const response = await axios.get('https://localhost:7217/api/Fields');
        setFields(response.data);
      } catch (error) {
        enqueueSnackbar('Có lỗi xảy ra khi tải danh sách lĩnh vực.', { variant: 'error', autoHideDuration: 5000 });
      }
    };
    fetchFields();
  }, [enqueueSnackbar]);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await axios.get(`https://localhost:7217/api/Topic/GetTopicsByTeacherNull/${teacherID}`);
        setTopics(response.data);
      } catch (error) {
        enqueueSnackbar('Không có đề tài nào.', { variant: 'error', autoHideDuration: 5000 });
      }
    };
    fetchTopics();
  }, [teacherID, enqueueSnackbar]);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://localhost:7217/api/Topic/registerTeacher', {
        TeacherID: teacherID,
        Title: title,
        Description: description,
        FieldID: fieldID,
      });
      enqueueSnackbar('Đề tài đã được đăng ký thành công.', { variant: 'success', autoHideDuration: 5000 });
      setAddDialogOpen(false);
      await refreshTopics(); // Refresh topics list
    } catch (error) {
      enqueueSnackbar('Có lỗi xảy ra khi đăng ký đề tài.', { variant: 'error', autoHideDuration: 5000 });
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put('https://localhost:7217/api/Topic/updateTopic', {
        id: editItem.id,
        Title: title,
        Description: description,
        FieldID: fieldID,
      });
      enqueueSnackbar('Đề tài đã được cập nhật thành công.', { variant: 'success', autoHideDuration: 5000 });
      setEditDialogOpen(false);
      await refreshTopics(); // Refresh topics list
    } catch (error) {
      enqueueSnackbar('Có lỗi xảy ra khi cập nhật đề tài.', { variant: 'error', autoHideDuration: 5000 });
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`https://localhost:7217/api/Topic/deleteTopic/${selectedItem.id}`);
      enqueueSnackbar('Đề tài đã được xóa thành công.', { variant: 'success', autoHideDuration: 5000 });
      setDeleteDialogOpen(false);
      setSelectedItem(null);
      await refreshTopics(); // Refresh topics list
    } catch (error) {
      enqueueSnackbar('Có lỗi xảy ra khi xóa đề tài.', { variant: 'error', autoHideDuration: 5000 });
    }
  };

  const refreshTopics = async () => {
    try {
      const response = await axios.get(`https://localhost:7217/api/Topic/GetTopicsByTeacherNull/${teacherID}`);
      setTopics(response.data);
    } catch (error) {
      enqueueSnackbar('Không thể làm mới danh sách đề tài.', { variant: 'error', autoHideDuration: 5000 });
    }
  };

  const handleEditClick = (item) => {
    setEditItem(item);
    setTitle(item.title);
    setDescription(item.description);
    setFieldID(item.fieldID);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (item) => {
    setSelectedItem(item);
    setDeleteDialogOpen(true);
  };

  const handleAddClick = () => {
    setTitle('');
    setDescription('');
    setFieldID('');
    setAddDialogOpen(true);
  };

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5">
          Danh Sách Đề Tài Chưa Có Sinh Viên
        </Typography>
        <Button variant="contained" color="primary" onClick={handleAddClick}>
          Thêm Đề Tài
        </Button>
      </div>

      <TableContainer component={Paper} style={{ marginTop: 20 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">STT</TableCell>
              <TableCell align="center">Tên Giảng Viên</TableCell>
              <TableCell align="center">Tiêu Đề</TableCell>
              <TableCell align="center">Mô Tả</TableCell>
              <TableCell align="center">Thao Tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {topics.map((topic, index) => (
              <TableRow key={topic.id}>
                <TableCell align="center" component="th" scope="row">{index + 1}</TableCell>
                <TableCell>{topic.teacherName}</TableCell>
                <TableCell>{topic.title}</TableCell>
                <TableCell>{topic.description}</TableCell>
                <TableCell  align="center">
                  <IconButton color="primary" onClick={() => handleEditClick(topic)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDeleteClick(topic)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Dialog */}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>
          <Typography variant="h6">Đăng Ký Đề Tài</Typography>
        </DialogTitle>
        <DialogContent>
          <form noValidate autoComplete="off" onSubmit={handleAddSubmit}>
            <TextField
              label="Tiêu Đề"
              variant="outlined"
              fullWidth
              margin="normal"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <TextField
              label="Mô Tả"
              variant="outlined"
              fullWidth
              margin="normal"
              multiline
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Lĩnh Vực</InputLabel>
              <Select
                value={fieldID}
                onChange={(e) => setFieldID(e.target.value)}
                label="Lĩnh Vực"
                required
              >
                {fields.map(field => (
                  <MenuItem key={field.id} value={field.id}>
                    {field.fieldName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button variant="contained" color="primary" type="submit">
              Đăng Ký
            </Button>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)} color="primary">Hủy</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>
          <Typography variant="h6">Sửa Đề Tài</Typography>
        </DialogTitle>
        <DialogContent>
          <form noValidate autoComplete="off" onSubmit={handleEditSubmit}>
            <TextField
              label="Tiêu Đề"
              variant="outlined"
              fullWidth
              margin="normal"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <TextField
              label="Mô Tả"
              variant="outlined"
              fullWidth
              margin="normal"
              multiline
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Lĩnh Vực</InputLabel>
              <Select
                value={fieldID}
                onChange={(e) => setFieldID(e.target.value)}
                label="Lĩnh Vực"
                required
              >
                {fields.map(field => (
                  <MenuItem key={field.id} value={field.id}>
                    {field.fieldName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button variant="contained" color="primary" type="submit">
              Lưu
            </Button>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)} color="primary">Hủy</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>
          <Typography variant="h6">Xác Nhận Xóa</Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn xóa đề tài {selectedItem?.title} không?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">Hủy</Button>
          <Button onClick={handleDeleteConfirm} color="primary">Xóa</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default RegisterTopicForm;
