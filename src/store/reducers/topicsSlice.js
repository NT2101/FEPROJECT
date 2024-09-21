// topicsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchTopics = createAsyncThunk('topics/fetchTopics', async () => {
  const response = await axios.get('https://localhost:7217/api/Topic/GetAllTopics');
  return response.data;
});

export const adminAgreeTopic = createAsyncThunk('topics/adminAgreeTopic', async (topicID) => {
  await axios.put(`https://localhost:7217/api/Topic/AdminAgree/${topicID}`);
  const response = await axios.get('https://localhost:7217/api/Topic/GetAllTopics');
  return response.data;
});

export const adminDisagreeTopic = createAsyncThunk('topics/adminDisagreeTopic', async (topicID) => {
  await axios.put(`https://localhost:7217/api/Topic/Disagree/${topicID}`);
  const response = await axios.get('https://localhost:7217/api/Topic/GetAllTopics');
  return response.data;
});

const topicsSlice = createSlice({
  name: 'topics',
  initialState: {
    topics: [],
    loading: false,
    error: '',
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTopics.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(fetchTopics.fulfilled, (state, action) => {
        state.topics = action.payload;
        state.loading = false;
      })
      .addCase(fetchTopics.rejected, (state) => {
        state.loading = false;
        state.error = 'Không có yêu cầu nào được gửi';
      })
      .addCase(adminAgreeTopic.pending, (state) => {
        state.loading = true;
      })
      .addCase(adminAgreeTopic.fulfilled, (state, action) => {
        state.topics = action.payload;
        state.loading = false;
      })
      .addCase(adminAgreeTopic.rejected, (state) => {
        state.loading = false;
        state.error = 'Error updating topic. Please try again later.';
      })
      .addCase(adminDisagreeTopic.pending, (state) => {
        state.loading = true;
      })
      .addCase(adminDisagreeTopic.fulfilled, (state, action) => {
        state.topics = action.payload;
        state.loading = false;
      })
      .addCase(adminDisagreeTopic.rejected, (state) => {
        state.loading = false;
        state.error = 'Error updating topic. Please try again later.';
      });
  },
});

export default topicsSlice.reducer;
