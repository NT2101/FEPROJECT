/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { teacherApi } from '../../api/teacherApi';

const initialState = {
    loading: {},
    setting: {}
};

export const getTeacher = createAsyncThunk("Teachers/get", async (payload) => {
    try {
        const result = await teacherApi.getAllTeacher();
        return result.data;
    }
    catch (e) {
        return rejectWithValue(e.message);
    }
})

export const addTeacher = createAsyncThunk("Teachers/add", async (payload, { rejectWithValue }) => {
    try {
        const result = await teacherApi.addTeacher(payload);
        return result;
    }
    catch (e) {
        return rejectWithValue(e.response);
    
    }
})

export const editTeacher = createAsyncThunk("Teachers/edit", async (payload, { rejectWithValue }) => {
    try {
        const result = await teacherApi.editTeacher(payload);
        return result;
    }
    catch (e) {
        return rejectWithValue(e.response);
    }
})



export const deleteTeacher = createAsyncThunk("Teachers/delete", async (payload, { rejectWithValue }) => {
    try {
        const result = await teacherApi.deleteTeacher(payload);
        return result;
    }
    catch (e) {
        return rejectWithValue(e.response);
    }
})

export const Teacher = createSlice({
    name: 'Teacher',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(getTeacher.fulfilled, (state, action) => {
                // reducer logic here
                state.current = action.payload
            })
            .addCase(getTeacher.rejected, (state, action) => {
                // reducer logic here
                state.current = "error";
            })
            .addCase(addTeacher.fulfilled, (state, action) => {
                state.current = action.payload;
            })
            .addCase(addTeacher.rejected, (state, action) => {
                // reducer logic here
                state.current = null;
                state.error = action.payload;
            })
            .addCase(editTeacher.fulfilled, (state, action) => {
                state.current = action.payload;
            })
            .addCase(editTeacher.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(deleteTeacher.fulfilled, (state, action) => {
                state.current = action.payload;
            })
            .addCase(deleteTeacher.rejected, (state, action) => {
                state.error = action.payload;
            })

            ;
    }
})

export default Teacher.reducer;