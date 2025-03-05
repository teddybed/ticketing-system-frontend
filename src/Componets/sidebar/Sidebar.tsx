// Sidebar.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar: React.FC = () => {
  return (
    <div className="w-64 bg-gray-800 text-white p-6">
      <h2 className="text-2xl font-semibold mb-6 text-center">Dashboard</h2>
      <ul className="space-y-4">
        <li>
          <Link to="#" className="block px-4 py-2 rounded-md hover:bg-gray-700">Dashboard</Link>
        </li>
        <li>
          <Link to="#" className="block px-4 py-2 rounded-md hover:bg-gray-700">Tickets</Link>
        </li>
        <li>
          <Link to="#" className="block px-4 py-2 rounded-md hover:bg-gray-700">Settings</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
