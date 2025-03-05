import { createSlice, configureStore, Dispatch, createAsyncThunk } from '@reduxjs/toolkit';

// Define the Ticket type
export interface Ticket {
  _id: string;
  title: string;
  description: string;
  status: 'open' | 'in-progress' | 'closed' | string;
}

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState: { token: localStorage.getItem('token') || null },
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },
  },
});

// Ticket slice
const ticketSlice = createSlice({
  name: 'tickets',
  initialState: { tickets: [] as Ticket[], loading: true, error: null },
  reducers: {
    setTickets: (state, action) => {
      state.tickets = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

// Create Ticket slice
const createTicketSlice = createSlice({
  name: 'createTicket',
  initialState: { ticket: null as Ticket | null, loading: false, error: null },
  reducers: {
    setCreatedTicket: (state, action) => {
      state.ticket = action.payload;
    },
    setCreating: (state, action) => {
      state.loading = action.payload;
    },
    setCreateError: (state, action) => {
      state.error = action.payload;
    },
  },
});

// Async function to fetch tickets
export const fetchTickets = (token: string) => async (dispatch: Dispatch) => {
  dispatch(ticketSlice.actions.setLoading(true));

  try {
    const response = await fetch('http://192.168.42.144:3000/tickets', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch tickets');
    }

    const data = await response.json();
    dispatch(ticketSlice.actions.setTickets(data));
  } catch (error) {
    dispatch(ticketSlice.actions.setError(error.message));
  } finally {
    dispatch(ticketSlice.actions.setLoading(false));
  }
};

// Async function to create a ticket
export const createTicket = (ticketData: Partial<Ticket>, token: string) => async (dispatch: Dispatch) => {
  dispatch(createTicketSlice.actions.setCreating(true));

  try {
    const response = await fetch('http://192.168.42.144:3000/tickets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(ticketData),
    });

    if (!response.ok) {
      throw new Error('Failed to create ticket');
    }

    const data = await response.json();
    dispatch(createTicketSlice.actions.setCreatedTicket(data));
  } catch (error) {
    dispatch(createTicketSlice.actions.setCreateError(error.message));
  } finally {
    dispatch(createTicketSlice.actions.setCreating(false));
  }
};

// Store configuration
export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    tickets: ticketSlice.reducer,
    createTicket: createTicketSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export const { setToken } = authSlice.actions;
export const { setTickets, setLoading, setError } = ticketSlice.actions;
export const { setCreatedTicket, setCreating, setCreateError } = createTicketSlice.actions;
