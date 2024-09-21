/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {facultyApi} from '../../api/facultyApi';

const initialState = {
    loading: false,
    error: null,
    current: null,
};

export const getFaculty = createAsyncThunk("faculties/get", async (payload, { rejectWithValue }) => {
    try {
        const result = await facultyApi.getAllFaculty();
        return result.data;
    } catch (e) {
        return rejectWithValue(e.message);
    }
});

export const addFaculty = createAsyncThunk("faculties/add", async (payload, { rejectWithValue }) => {
    try {
        const result = await facultyApi.addFaculty(payload);
        return result;
    } catch (e) {
        if (e.response && e.response.data && e.response.data.errors) {
            return rejectWithValue(e.response.data.errors);
        } else {
            return rejectWithValue(e.response.data);
        }
    }
});

export const editFaculty = createAsyncThunk("faculties/edit", async (payload, { rejectWithValue }) => {
    try {
        const result = await facultyApi.editFaculty(payload);
        return result;
    } catch (e) {
        return rejectWithValue(e.response);
    }
});

export const deleteFaculty = createAsyncThunk('faculties/delete', async (id, { rejectWithValue }) => {
    try {
      await facultyApi.deleteFaculty(id);
      return id; // Trả về id của khoa đã xóa
    } catch (e) {
      return rejectWithValue(e.message);
    }
  });

export const facultySlice = createSlice({
    name: 'faculty',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getFaculty.fulfilled, (state, action) => {
                state.current = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getFaculty.rejected, (state, action) => {
                state.current = null;
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addFaculty.fulfilled, (state, action) => {
                state.current = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(addFaculty.rejected, (state, action) => {
                state.current = null;
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(editFaculty.fulfilled, (state, action) => {
                state.current = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(editFaculty.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })
            .addCase(deleteFaculty.fulfilled, (state, action) => {
                state.faculties = state.faculties.filter(f => f.id !== action.payload);
                state.loading = false;
                state.error = null;
              })
              .addCase(deleteFaculty.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
              })
            .addMatcher(
                action => action.type.endsWith('/pending'),
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            );
    }
});

export default facultySlice.reducer;
