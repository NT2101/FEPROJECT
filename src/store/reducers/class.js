/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {classesApi} from '../../api/classApi';

const initialState = {
    loading: false,
    error: null,
    current: null,
};

export const getClass = createAsyncThunk("classes/get", async (payload, { rejectWithValue }) => {
    try {
        const result = await classesApi.getAllClasses();
        return result.data;
    } catch (e) {
        return rejectWithValue(e.message);
    }
});
export const addClass = createAsyncThunk("faculties/add", async (payload, { rejectWithValue }) => {
    try {
        const result = await classesApi.addClass(payload);
        return result;
    } catch (e) {
        if (e.response && e.response.data && e.response.data.errors) {
            return rejectWithValue(e.response.data.errors);
        } else {
            return rejectWithValue(e.response.data);
        }
    }
});
export const editClass = createAsyncThunk("classes/edit", async (payload, { rejectWithValue }) => {
    try {
        const result = await classesApi.editClass(payload);
        return result;
    } catch (e) {
        return rejectWithValue(e.response);
    }
});


export const deleteClass = createAsyncThunk('classes/delete', async (id, { rejectWithValue }) => {
    try {
      await classesApi.deleteClass(id);
      return id; // Trả về id của khoa đã xóa
    } catch (e) {
      return rejectWithValue(e.message);
    }
  });

export const ClassSlice = createSlice({
    name: 'Class',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getClass.fulfilled, (state, action) => {
                state.current = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getClass.rejected, (state, action) => {
                state.current = null;
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addClass.fulfilled, (state, action) => {
                state.current = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(addClass.rejected, (state, action) => {
                state.current = null;
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(editClass.fulfilled, (state, action) => {
                state.current = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(editClass.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })
            .addCase(deleteClass.fulfilled, (state, action) => {
                state.classes = state.classes.filter(f => f.id !== action.payload);
                state.loading = false;
                state.error = null;
              })
              .addCase(deleteClass.rejected, (state, action) => {
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

export default ClassSlice.reducer;
