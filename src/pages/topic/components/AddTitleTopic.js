// src/pages/Topic/AddBasic.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Typography, FormControl, InputLabel, Select, MenuItem, Grid } from '@mui/material';

const AddBasic = () => {
    const [fields, setFields] = useState([]);
    const [topic, setTopic] = useState({
        title: '',
        description: '',
        fieldID: '',
    });

    useEffect(() => {
        const fetchFields = async () => {
            try {
                const response = await axios.get('https://localhost:7217/api/Fields');
                setFields(response.data);
            } catch (error) {
                console.error('Failed to fetch fields', error);
            }
        };
        fetchFields();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await axios.post('https://localhost:7217/api/Topics/AddBasic', topic);
            // Redirect or show success message
        } catch (error) {
            console.error('Failed to add basic topic', error);
        }
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Thêm Đề tài Cơ bản
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
                    Thêm Đề tài
                </Button>
            </form>
        </Container>
    );
};

export default AddBasic;
