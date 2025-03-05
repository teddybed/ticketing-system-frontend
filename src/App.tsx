import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RegistrationPage from './Auth/registration';
import LoginPage from './Auth/login';
import HomePage from './Componets/home/home';
import DashboardPage from './Componets/dashboard/dashboard';
import CreateTicket from './Componets/Tickets/createTickets';
import UpdateTicket from './Componets/Tickets/UpdateTicket';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<RegistrationPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/createTicket" element={<CreateTicket />} />
        {/* Path for UpdateTicket page with dynamic :id */}
        <Route path="/updateTicket/:id" element={<UpdateTicket />} />
        <Route path="/" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
