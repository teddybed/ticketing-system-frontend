import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Provider } from 'react-redux';
import { store, RootState, setToken, fetchTickets } from '../Tickets/ticketRedux/SliceTicket';
import Sidebar from '../sidebar/Sidebar';
import { useNavigate } from 'react-router-dom';

// Dashboard Component
const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state: RootState) => state.auth.token);
  const tickets = useSelector((state: RootState) => state.tickets.tickets);
  const loading = useSelector((state: RootState) => state.tickets.loading);
  const error = useSelector((state: RootState) => state.tickets.error);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedRole = localStorage.getItem('role');
    if (savedToken) {
      dispatch(setToken(savedToken));
      dispatch(fetchTickets(savedToken) as any);
    }
    if (savedRole) {
      setRole(savedRole);
    } else if (!savedToken) {
      navigate('/login'); // Navigate to login page if no token is found
    }
  }, [dispatch, navigate]);

  const handleLogout = () => {
    // Clear token and role from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('role');

    // Dispatch action to clear token in Redux store (if necessary)
    dispatch(setToken(''));

    // Navigate to homepage
    navigate('/');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-semibold text-gray-800">Tickets Dashboard</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/createTicket')}
              className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-green-600"
            >
              Create Ticket
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>

        {token ? (
          <>
            {loading ? (
              <p className="text-center text-gray-500">Loading tickets...</p>
            ) : error ? (
              <p className="text-center text-red-500">{error}</p>
            ) : (
              <div className="overflow-x-auto">
                <h2 className="text-xl font-semibold mb-6">Tickets</h2>
                <table className="min-w-full table-auto bg-white border border-gray-200 rounded-lg shadow-md">
                  <thead>
                    <tr className="bg-gray-100 text-left text-sm font-medium text-gray-600">
                      <th className="px-4 py-2 border-b">Title</th>
                      <th className="px-4 py-2 border-b">Description</th>
                      <th className="px-4 py-2 border-b">Status</th>
                      <th className="px-4 py-2 border-b">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tickets.map((ticket) => (
                      <tr key={ticket._id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-2 text-sm text-gray-700">{ticket.title}</td>
                        <td className="px-4 py-2 text-sm text-gray-700">{ticket.description}</td>
                        <td className={`px-4 py-2 text-sm font-medium ${ticket.status === 'open' ? 'text-green-500' : (ticket.status === 'closed' ? 'text-red-500' : 'text-gray-500')}`}>
                          {ticket.status || 'N/A'}
                        </td>
                        <td className="px-4 py-2 text-sm">
                          {role === 'admin' && (
                            <button
                              onClick={() => navigate(`/updateTicket/${ticket._id}`)}
                              className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
                            >
                              Edit
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        ) : (
          <p className="text-center text-red-500">No token found. Please log in again.</p>
        )}
      </div>
    </div>
  );
};

// Wrap with Provider
const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Dashboard />
    </Provider>
  );
};

export default App;
