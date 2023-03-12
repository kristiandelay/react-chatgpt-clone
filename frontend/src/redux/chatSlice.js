import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../api';

// Define a thunk to fetch all chats
export const fetchChats = createAsyncThunk('chats/fetchChats', async () => {
  try {
    const response = await api.get('/api/chatgpt/history');
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
});

// Define the initial state
const initialState = {
  chats: [],
  status: 'idle',
  error: null,
};

// Define the chat slice
const chatSlice = createSlice({
  name: 'chats',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Handle fetchChats.pending
    builder.addCase(fetchChats.pending, (state) => {
        state.status = 'loading';
    });

    // Handle fetchChats.fulfilled
    builder.addCase(fetchChats.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.chats = action.payload;
    });

    // Handle fetchChats.rejected
    builder.addCase(fetchChats.rejected, (state, action) => {
        state.status = 'failed';
      state.error = action.error.message;
    });
  },
});

export default chatSlice.reducer;