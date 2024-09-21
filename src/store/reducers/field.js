/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fieldApi } from '../../api/fieldApi';

const initialState = {
    loading: {},
    setting: {}
};

export const getField = createAsyncThunk("fields/get", async (payload) => {
    try {
        const result = await fieldApi.getAllField();
        return result.data;
    }
    catch (e) {
        return rejectWithValue(e.message);
    }
})

export const addField = createAsyncThunk("fields/add", async (payload, { rejectWithValue }) => {
    try {
        const result = await fieldApi.addField(payload);
        return result;
    }
    catch (e) {
        return rejectWithValue(e.response);
    
    }
})

export const editField = createAsyncThunk("fields/edit", async (payload, { rejectWithValue }) => {
    try {
        const result = await fieldApi.editField(payload);
        return result;
    }
    catch (e) {
        return rejectWithValue(e.response);
    }
})



export const deleteField = createAsyncThunk("fields/delete", async (payload, { rejectWithValue }) => {
    try {
        const result = await fieldApi.deleteField(payload);
        return result;
    }
    catch (e) {
        return rejectWithValue(e.response);
    }
})

export const Field = createSlice({
    name: 'Field',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(getField.fulfilled, (state, action) => {
                // reducer logic here
                state.current = action.payload
            })
            .addCase(getField.rejected, (state, action) => {
                // reducer logic here
                state.current = "error";
            })
            .addCase(addField.fulfilled, (state, action) => {
                state.current = action.payload;
            })
            .addCase(addField.rejected, (state, action) => {
                // reducer logic here
                state.current = null;
                state.error = action.payload;
            })
            .addCase(editField.fulfilled, (state, action) => {
                state.current = action.payload;
            })
            .addCase(editField.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(deleteField.fulfilled, (state, action) => {
                state.current = action.payload;
            })
            .addCase(deleteField.rejected, (state, action) => {
                state.error = action.payload;
            })

            ;
    }
})

export default Field.reducer;