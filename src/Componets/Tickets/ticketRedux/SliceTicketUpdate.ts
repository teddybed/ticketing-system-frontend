// ticketSlice.ts
import { createSlice, configureStore } from '@reduxjs/toolkit';

// Define a Redux slice
const ticketSlice = createSlice({
  name: 'ticket',
  initialState: {
    ticket: null,
    loading: false,
    error: '',
    newStatus: '',
  },
  reducers: {
    setTicketDetails: (state, action) => {
      state.ticket = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setNewStatus: (state, action) => {
      state.newStatus = action.payload;
    },
  },
});

const { setTicketDetails, setLoading, setError, setNewStatus } = ticketSlice.actions;

// Configure the Redux store
const store = configureStore({
  reducer: {
    ticket: ticketSlice.reducer,
  },
});

export { store, setTicketDetails, setLoading, setError, setNewStatus };
