/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { studentApi } from '../../api/studentApi';

const initialState = {
    loading: {},
    setting: {}
};

export const getStudent = createAsyncThunk("Students/get", async (payload) => {
    try {
        const result = await studentApi.getAllStudent();
        return result.data;
    }
    catch (e) {
        return rejectWithValue(e.message);
    }
})

export const addStudent = createAsyncThunk("Students/add", async (payload, { rejectWithValue }) => {
    try {
        const result = await studentApi.addStudent(payload);
        return result;
    } catch (e) {
        if (e.response && e.response.data && e.response.data.errors) {
            return rejectWithValue(e.response.data.errors);
        } else {
            return rejectWithValue(e.response.data);
        }
    }
});

export const editStudent = createAsyncThunk("Students/edit", async (payload, { rejectWithValue }) => {
    try {
        const result = await studentApi.editStudent(payload);
        return result;
    }
    catch (e) {
        return rejectWithValue(e.response);
    }
})



export const deleteStudent = createAsyncThunk("Students/delete", async (payload, { rejectWithValue }) => {
    try {
        const result = await studentApi.deleteStudent(payload);
        return result;
    }
    catch (e) {
        return rejectWithValue(e.response);
    }
})

export const Student = createSlice({
    name: 'Student',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(getStudent.fulfilled, (state, action) => {
                // reducer logic here
                state.current = action.payload
            })
            .addCase(getStudent.rejected, (state, action) => {
                // reducer logic here
                state.current = "error";
            })
            .addCase(addStudent.fulfilled, (state, action) => {
                state.current = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(addStudent.rejected, (state, action) => {
                state.current = null;
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(editStudent.fulfilled, (state, action) => {
                state.current = action.payload;
            })
            .addCase(editStudent.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(deleteStudent.fulfilled, (state, action) => {
                state.current = action.payload;
            })
            .addCase(deleteStudent.rejected, (state, action) => {
                state.error = action.payload;
            })

            ;
    }
})

export default Student.reducer;