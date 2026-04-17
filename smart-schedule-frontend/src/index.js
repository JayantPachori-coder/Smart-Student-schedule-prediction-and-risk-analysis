import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// 🔥 ADD THIS IMPORT
import { GoogleOAuthProvider } from '@react-oauth/google';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>

    {/* 🔥 WRAP YOUR APP HERE */}
    <GoogleOAuthProvider clientId="519436286812-aei1q3phe2kjprs6m3akctr54f65sqpk.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>

  </React.StrictMode>
);

reportWebVitals();