import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface AuthState {
  formData: {
    username: string;
    email: string;
    password: string;
    role: string;
  };
  loading: boolean;
  error: string | null;
  successMessage: string | null;
  role: string | null; // Store role in state
}

const initialState: AuthState = {
  formData: { username: '', email: '', password: '', role: 'user' },
  loading: false,
  error: null,
  successMessage: null,
  role: localStorage.getItem('role') || null, // Initialize role from localStorage
};

// Async thunk for registering a user
// Updated async thunk for registering a user
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({ formData, navigate }: { formData: AuthState['formData']; navigate: Function }, { rejectWithValue }) => {
    try {
      const response = await fetch('http://192.168.42.144:3000/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData), // Ensure the form data including the role is sent
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Registration failed.');

      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role); // Store role in localStorage

      navigate('/dashboard');

      return { message: 'Registration successful! You can now log in.', role: data.role };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);


// Async thunk for logging in a user
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password, navigate }: { email: string; password: string; navigate: Function }, { rejectWithValue }) => {
    try {
      const response = await fetch('http://192.168.42.144:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Login failed.');

      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role); // Store role in localStorage

      navigate('/dashboard');

      return { message: 'Login successful!', role: data.role };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice for authentication
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    updateFormData: (state, action) => {
      const { name, value } = action.payload;
      state.formData = { ...state.formData, [name]: value };
    },
    setRole: (state, action) => { // New reducer to update role in state
      state.role = action.payload;
      localStorage.setItem('role', action.payload); // Update role in localStorage
    },
  },
  extraReducers: (builder) => {
    builder
      // Register user
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
        state.role = action.payload.role; // Update role in state
        state.formData = { username: '', email: '', password: '', role: 'user' };
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Login user
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
        state.role = action.payload.role; // Update role in state
        state.formData = { username: '', email: '', password: '', role: 'user' };
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { updateFormData, setRole } = authSlice.actions;
export default authSlice.reducer;
