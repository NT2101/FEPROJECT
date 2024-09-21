/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { specializationsApi } from '../../api/specializationApi';

const initialState = {
    loading: false,
    error: null,
    current: null,
};

export const getSpecialization = createAsyncThunk("specializations/get", async (payload, { rejectWithValue }) => {
    try {
        const result = await specializationsApi.getAllSpecializations();
        return result.data;
    } catch (e) {
        return rejectWithValue(e.message);
    }
});

export const addSpecialization = createAsyncThunk("specializations/add", async (payload, { rejectWithValue }) => {
    try {
        const result = await specializationsApi.addSpecialization(payload); // Correct method name
        return result;
    } catch (e) {
        if (e.response && e.response.data && e.response.data.errors) {
            return rejectWithValue(e.response.data.errors);
        } else {
            return rejectWithValue(e.response.data);
        }
    }
});

export const editSpecialization = createAsyncThunk("specializations/edit", async (payload, { rejectWithValue }) => {
    try {
        const result = await specializationsApi.editSpecialization(payload);
        return result;
    } catch (e) {
        return rejectWithValue(e.response);
    }
});

export const deleteSpecialization = createAsyncThunk('specializations/delete', async (id, { rejectWithValue }) => {
    try {
      await specializationsApi.deleteSpecialization(id);
      return id; // Trả về id của khoa đã xóa
    } catch (e) {
      return rejectWithValue(e.message);
    }
  });

export const SpecializationSlice = createSlice({
    name: 'Specialization',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getSpecialization.fulfilled, (state, action) => {
                state.current = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getSpecialization.rejected, (state, action) => {
                state.current = null;
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addSpecialization.fulfilled, (state, action) => {
                state.current = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(addSpecialization.rejected, (state, action) => {
                state.current = null;
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(editSpecialization.fulfilled, (state, action) => {
                state.current = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(editSpecialization.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })
            .addCase(deleteSpecialization.fulfilled, (state, action) => {
                state.specializations = state.specializations.filter(f => f.id !== action.payload);
                state.loading = false;
                state.error = null;
              })
              .addCase(deleteSpecialization.rejected, (state, action) => {
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

export default SpecializationSlice.reducer;
