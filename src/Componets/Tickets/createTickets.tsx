import React, { useState } from 'react';
import { connect, Provider } from 'react-redux';
import { createTicket } from './ticketRedux/SliceTicket'; // Ensure correct path for createTicket
import { RootState, store } from './ticketRedux/SliceTicket'; // Assuming RootState is defined in your store file
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom

interface CreateTicketProps {
  token: string | null;
  loading: boolean;
  error: string | null;
  createTicket: (ticketData: { title: string; description: string }, token: string) => void;
}

const CreateTicket: React.FC<CreateTicketProps> = ({ token, loading, error, createTicket }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate(); // Initialize navigate hook

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'title') {
      setTitle(value);
    } else if (name === 'description') {
      setDescription(value);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (token) {
      createTicket({ title, description }, token); // Dispatch the action here
      navigate('/dashboard'); // Navigate to dashboard after ticket is created
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-50 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg max-w-md w-full shadow-lg">
        <h2 className="text-2xl font-semibold mb-6 text-center">Create a Ticket</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input
              type="text"
              name="title"
              value={title}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              name="description"
              value={description}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Ticket'}
          </button>
        </form>
      </div>
    </div>
  );
};

// mapStateToProps with proper types
const mapStateToProps = (state: RootState) => ({
  token: state.auth.token,
  loading: state.createTicket.loading,
  error: state.createTicket.error,
});

// Explicitly define mapDispatchToProps with types
const mapDispatchToProps = {
  createTicket, // Redux action creator
};

type DispatchProps = typeof mapDispatchToProps;

// Combine prop types for the component
type Props = CreateTicketProps & DispatchProps;

const ConnectedCreateTicket = connect(mapStateToProps, mapDispatchToProps)(CreateTicket);

// Wrap your component in the Provider
const App = () => {
  return (
    <Provider store={store}>
      <ConnectedCreateTicket />
    </Provider>
  );
};

export default App;
