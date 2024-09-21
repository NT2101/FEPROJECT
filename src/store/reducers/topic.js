/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { classesApi } from '../../api/classApi';

const initialState = {
    loading: {},
    setting: {}
};

export const getClass = createAsyncThunk("classes/get", async (payload) => {
    try {
        const result = await classesApi.getAllClasses();
        return result.data;
    }
    catch (e) {
        return rejectWithValue(e.message);
    }
})

export const addClass = createAsyncThunk("classes/add", async (payload, { rejectWithValue }) => {
    try {
        const result = await classesApi.addClass(payload);
        return result;
    }
    catch (e) {
        return rejectWithValue(e.response);
    
    }
})

export const editClass = createAsyncThunk("classes/edit", async (payload, { rejectWithValue }) => {
    try {
        const result = await classesApi.editClass(payload);
        return result;
    }
    catch (e) {
        return rejectWithValue(e.response);
    }
})



export const deleteClass = createAsyncThunk("classes/delete", async (payload, { rejectWithValue }) => {
    try {
        const result = await classesApi.deleteClass(payload);
        return result;
    }
    catch (e) {
        return rejectWithValue(e.response);
    }
})

export const Class = createSlice({
    name: 'Class',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(getClass.fulfilled, (state, action) => {
                // reducer logic here
                state.current = action.payload
            })
            .addCase(getClass.rejected, (state, action) => {
                // reducer logic here
                state.current = "error";
            })
            .addCase(addClass.fulfilled, (state, action) => {
                state.current = action.payload;
            })
            .addCase(addClass.rejected, (state, action) => {
                // reducer logic here
                state.current = null;
                state.error = action.payload;
            })
            .addCase(editClass.fulfilled, (state, action) => {
                state.current = action.payload;
            })
            .addCase(editClass.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(deleteClass.fulfilled, (state, action) => {
                state.current = action.payload;
            })
            .addCase(deleteClass.rejected, (state, action) => {
                state.error = action.payload;
            })

            ;
    }
})

export default Class.reducer;