import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './Auth/authRedux/store';
import App from './App';
import './App.css';
import DashboardPage from './Componets/dashboard/dashboard';


ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <App />
  </Provider>
);
