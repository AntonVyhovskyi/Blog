import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";

export const fetchUserData = createAsyncThunk('posts/fetchUserData', async (params) => {
    const {data} = await axios.post('/auth/login', params);
    return data;
})

export const fetchUserDataMe = createAsyncThunk('posts/fetchUserDataMe', async () => {
    const {data} = await axios.get('/auth/me');
    return data;
})

export const fetchUserRegistr = createAsyncThunk('posts/fetchUserRegistr', async (params) => {
    const {data} = await axios.post('/auth/register', params);
    return data;
})

export const fetchUserUpdate = createAsyncThunk('posts/fetchUserUpdate', async (params) => {
    const {data} = await axios.patch(`/user/${params.id}`, params);
    return data;
})

const LOADING = 'loading'
const LOADED = 'loaded'
const ERROR = 'error'

const initialState = {
    data: null, 
    status: LOADING,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.data = null
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserData.pending, (state) => {
                state.status = LOADING
                state.data = null
            })
            .addCase(fetchUserData.fulfilled, (state, action) => {
                
                state.status = LOADED
                state.data = action.payload
            })
            .addCase(fetchUserData.rejected, (state) => {
                state.status = ERROR
                state.data = null
            })
            .addCase(fetchUserDataMe.pending, (state) => {
                state.status = LOADING
                state.data = null
            })
            .addCase(fetchUserDataMe.fulfilled, (state, action) => {
                
                state.status = LOADED
                state.data = action.payload
            })
            .addCase(fetchUserDataMe.rejected, (state) => {
                state.status = ERROR
                state.data = null
            })
            .addCase(fetchUserRegistr.pending, (state) => {
                state.status = LOADING
                state.data = null
            })
            .addCase(fetchUserRegistr.fulfilled, (state, action) => {
                
                state.status = LOADED
                state.data = action.payload
            })
            .addCase(fetchUserRegistr.rejected, (state) => {
                state.status = ERROR
                state.data = null
            })

            // --------------------- update -------------------------


            .addCase(fetchUserUpdate.pending, (state) => {
                state.status = LOADING
                state.data = null
            })
            .addCase(fetchUserUpdate.fulfilled, (state, action) => {
                
                state.status = LOADED
                state.data = action.payload
            })
            .addCase(fetchUserUpdate.rejected, (state) => {
                state.status = ERROR
                state.data = null
            })


    },
})
export const selectUserData = (state) => state.auth.data

export const selectIsAuth = (state) => Boolean(state.auth.data)

export const { logout } = authSlice.actions

export const authReducer = authSlice.reducer;