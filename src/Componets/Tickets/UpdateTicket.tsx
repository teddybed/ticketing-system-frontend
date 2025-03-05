// UpdateTicket.tsx
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setTicketDetails, setLoading, setError, setNewStatus } from './ticketRedux/SliceTicketUpdate'; // Import actions
import { Provider } from 'react-redux';
import { store } from './ticketRedux/SliceTicketUpdate'; // Import the store

const UpdateTicket: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Extract ticket ID from URL params
  const dispatch = useDispatch();
  const { ticket, loading, error, newStatus } = useSelector((state: any) => state.ticket); // Access Redux state

  useEffect(() => {
    if (id) {
      fetchTicketDetails(id); // Fetch ticket details when the component mounts
    }
  }, [id]);

  // Function to fetch ticket details
  const fetchTicketDetails = async (ticketId: string) => {
    dispatch(setLoading(true));
    dispatch(setError(''));
    try {
      const response = await fetch(`http://192.168.42.144:3000/tickets/${ticketId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Assuming JWT token for authentication
        },
      });

      const data = await response.json();

      if (response.status === 200) {
        dispatch(setTicketDetails(data)); // Update ticket state in Redux
      } else {
        dispatch(setError(data.message || 'Error fetching ticket details'));
      }
    } catch (err) {
      dispatch(setError('Error fetching ticket details'));
      console.error('Error fetching ticket details:', err);
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Function to update the status of the ticket
  const updateTicketStatus = async () => {
    if (!newStatus) return; // Don't update if no new status is selected
    dispatch(setLoading(true));
    dispatch(setError(''));
    try {
      const response = await fetch(`http://192.168.42.144:3000/tickets/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Assuming JWT token for authentication
        },
        body: JSON.stringify({ status: newStatus }), // Update only the status
      });

      const data = await response.json();
      if (response.status === 200) {
        dispatch(setTicketDetails(data)); // Update ticket state with the new status
        dispatch(setError('')); // Clear any previous error
      } else {
        dispatch(setError(data.message || 'Error updating ticket status'));
      }
    } catch (err) {
      dispatch(setError('Error updating ticket status'));
      console.error('Error updating ticket status:', err);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Ticket Details - ID: {id}</h2>
      {loading ? (
        <div className="text-center text-gray-600">Loading...</div>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        ticket && (
          <div>
            <p className="text-gray-700 mb-4">Title: <span className="font-semibold">{ticket.title}</span></p>
            <p className="text-gray-700 mb-4">Description: <span className="font-semibold">{ticket.description}</span></p>
            <p className="text-gray-700 mb-4">Status: <span className="font-semibold">{ticket.status}</span></p>
            <p className="text-gray-700 mb-4">User ID: <span className="font-semibold">{ticket.user}</span></p>
            <p className="text-gray-700 mb-4">Version: <span className="font-semibold">{ticket.__v}</span></p>

            {/* Dropdown to select new status */}
            <div className="mb-4">
              <label className="block text-gray-700">Update Status:</label>
              <select
                value={newStatus}
                onChange={(e) => dispatch(setNewStatus(e.target.value))}
                className="mt-1 p-2 border border-gray-300 rounded"
              >
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            {/* Button to update status */}
            <button
              onClick={updateTicketStatus}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Update Status
            </button>
          </div>
        )
      )}
    </div>
  );
};

// Wrap your App in the Redux provider
const App: React.FC = () => (
  <Provider store={store}>
    <UpdateTicket />
  </Provider>
);

export default App;
