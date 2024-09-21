import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { authenticationApi } from 'api/authenticationApi'; // Correct import name

export const login = createAsyncThunk("account/login", async (payload) => {
    // Call the login API
    const response = await authenticationApi.login(payload);

    // Remove old user data from localStorage
    localStorage.removeItem("User");

    // Save the new user data to localStorage
    localStorage.setItem("User", JSON.stringify(response.data));

    return response.data;
});

// export const logout = createAsyncThunk("account/logout", async () => {
//     await authenticationApi.logout();
//     localStorage.removeItem("User");
//     return {};
// });

const initialState = {
    current: JSON.parse(localStorage.getItem("User")) || {},
    loading: false,
};

const accountSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(login.fulfilled, (state, action) => {
                state.current = action.payload;
            })
            .addCase(login.rejected, (state) => {
                state.current = "error";
            })
            // .addCase(logout.fulfilled, (state) => {
            //     state.current = {};
            // });
    },
});

export default accountSlice.reducer;
