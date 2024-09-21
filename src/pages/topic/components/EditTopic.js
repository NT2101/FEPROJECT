// src/pages/Topic/Edit.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

const Edit = () => {
    const { id } = useParams(); // Get topic ID from URL
    const [fields, setFields] = useState([]);
    const [topic, setTopic] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTopic = async () => {
            try {
                const response = await axios.get(`https://localhost:7217/api/Topics/${id}`);
                setTopic(response.data);
            } catch (error) {
                console.error('Failed to fetch topic', error);
            }
        };

        const fetchFields = async () => {
            try {
                const response = await axios.get('https://localhost:7217/api/Fields');
                setFields(response.data);
            } catch (error) {
                console.error('Failed to fetch fields', error);
            }
        };

        fetchTopic();
        fetchFields();
    }, [id]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await axios.put(`https://localhost:7217/api/Topics/${id}`, topic);
            // Redirect or show success message
            navigate('/get-all');
        } catch (error) {
            console.error('Failed to update topic', error);
        }
    };

    if (!topic) return <Typography variant="h6">Loading...</Typography>;

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Chỉnh sửa Đề tài
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Tiêu đề"
                    value={topic.title}
                    onChange={(e) => setTopic({ ...topic, title: e.target.value })}
                    fullWidth
                    required
                    margin="normal"
                />
                <TextField
                    label="Mô tả"
                    value={topic.description}
                    onChange={(e) => setTopic({ ...topic, description: e.target.value })}
                    fullWidth
                    required
                    margin="normal"
                />
                <FormControl fullWidth margin="normal">
                    <InputLabel>Lĩnh vực</InputLabel>
                    <Select
                        value={topic.fieldID}
                        onChange={(e) => setTopic({ ...topic, fieldID: e.target.value })}
                        required
                    >
                        {fields.map((field) => (
                            <MenuItem key={field.id} value={field.id}>
                                {field.fieldName}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Button type="submit" variant="contained" color="primary">
                    Cập nhật Đề tài
                </Button>
            </form>
        </Container>
    );
};

export default Edit;
