/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { accountApi } from '../../api/accountApi';

const initialState = {
    loading: {},
    setting: {}
};

export const getAccount = createAsyncThunk("accounts/get", async (payload) => {
    try {
        const result = await accountApi.getAllAccount();
        return result.data;
    }
    catch (e) {
        return rejectWithValue(e.message);
    }
})



export const editAccount = createAsyncThunk("accounts/edit", async (payload, { rejectWithValue }) => {
    try {
        const result = await accountApi.editAccount(payload);
        return result;
    }
    catch (e) {
        return rejectWithValue(e.response);
    }
})



export const deleteAccount = createAsyncThunk("accounts/delete", async (payload, { rejectWithValue }) => {
    try {
        const result = await accountApi.deleteAccount(payload);
        return result;
    }
    catch (e) {
        return rejectWithValue(e.response);
    }
})

export const Account = createSlice({
    name: 'Account',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAccount.fulfilled, (state, action) => {
                // reducer logic here
                state.current = action.payload
            })
            .addCase(getAccount.rejected, (state, action) => {
                // reducer logic here
                state.current = "error";
            })
            .addCase(editAccount.fulfilled, (state, action) => {
                state.current = action.payload;
            })
            .addCase(editAccount.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(deleteAccount.fulfilled, (state, action) => {
                state.current = action.payload;
            })
            .addCase(deleteAccount.rejected, (state, action) => {
                state.error = action.payload;
            })

            ;
    }
})

export default Account.reducer;