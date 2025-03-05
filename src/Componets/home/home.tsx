import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';


const HomePage: React.FC = () => {
  useEffect(() => {
    // Prevent going back by manipulating the browser history
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = ''; // Standard way of preventing default unload behavior
    };

    window.history.pushState(null, '', window.location.href); // Push a state to prevent back navigation
    window.addEventListener('popstate', () => {
      window.history.pushState(null, '', window.location.href); // Prevent going back when the back button is pressed
    });

    // Add before unload handler
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      // Clean up the event listeners on component unmount
      window.removeEventListener('popstate', () => {
        window.history.pushState(null, '', window.location.href);
      });
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-semibold text-gray-800">Welcome to Ticketing System App</h1>
        <p className="text-lg text-gray-600 mt-4">Join our community and get started!</p>
      </div>
      <div className="space-x-4">
        <Link to="/signup">
          <button className="px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-300">
            Register
          </button>
        </Link>
        <Link to="/login">
          <button className="px-6 py-3 text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition duration-300">
            Login
          </button>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
