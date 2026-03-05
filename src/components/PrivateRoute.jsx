import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { BaseUrl } from './service/Uri';

export const PrivateRoute = ({ children }) => {
  const [isValid, setIsValid] = useState(null);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('adminToken');
      const adminData = localStorage.getItem('admin');
      
      if (!token) {
        setIsValid(false);
        return;
      }

      // If we have cached admin data, use it temporarily while verifying
      if (adminData) {
        try {
          const res = await axios.get(`${BaseUrl}/super-admin/verify-token`, {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 5000, // 5 second timeout
          });
          if (res.data.status === 200) {
            localStorage.setItem('admin', JSON.stringify(res.data.data));
            setIsValid(true);
          } else {
            localStorage.removeItem('adminToken');
            localStorage.removeItem('admin');
            setIsValid(false);
          }
        } catch (err) {
          // If network error but we have cached data, allow access temporarily
          // Token will be verified on next successful API call
          if (adminData && (err.code === 'ECONNABORTED' || err.message.includes('timeout') || !navigator.onLine)) {
            setIsValid(true);
          } else {
            localStorage.removeItem('adminToken');
            localStorage.removeItem('admin');
            setIsValid(false);
          }
        }
      } else {
        // No cached data, must verify
        try {
          const res = await axios.get(`${BaseUrl}/super-admin/verify-token`, {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 5000,
          });
          if (res.data.status === 200) {
            localStorage.setItem('admin', JSON.stringify(res.data.data));
            setIsValid(true);
          } else {
            localStorage.removeItem('adminToken');
            setIsValid(false);
          }
        } catch (err) {
          localStorage.removeItem('adminToken');
          setIsValid(false);
        }
      }
    };
    verifyToken();
  }, []);

  if (isValid === null) return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      width: '100vw'
    }}>
      <div className="spinner-border" style={{ color: '#4f46e5', width: '3rem', height: '3rem' }} role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
  return isValid ? children : <Navigate to="/admin/login" />;
};

export const CompanyPrivateRoute = ({ children }) => {
  const [isValid, setIsValid] = useState(null);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('companyToken');
      const companyData = localStorage.getItem('company');
      
      if (!token) {
        setIsValid(false);
        return;
      }

      // If we have cached company data, use it temporarily while verifying
      if (companyData) {
        try {
          const res = await axios.get(`${BaseUrl}/company/verify-company`, {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 5000, // 5 second timeout
          });
          if (res.data.status === 200) {
            localStorage.setItem('company', JSON.stringify(res.data.data));
            setIsValid(true);
          } else {
            localStorage.removeItem('companyToken');
            localStorage.removeItem('company');
            setIsValid(false);
          }
        } catch (err) {
          // If network error but we have cached data, allow access temporarily
          // Token will be verified on next successful API call
          if (companyData && (err.code === 'ECONNABORTED' || err.message.includes('timeout') || !navigator.onLine)) {
            setIsValid(true);
          } else {
            localStorage.removeItem('companyToken');
            localStorage.removeItem('company');
            setIsValid(false);
          }
        }
      } else {
        // No cached data, must verify
        try {
          const res = await axios.get(`${BaseUrl}/company/verify-company`, {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 5000,
          });
          if (res.data.status === 200) {
            localStorage.setItem('company', JSON.stringify(res.data.data));
            setIsValid(true);
          } else {
            localStorage.removeItem('companyToken');
            setIsValid(false);
          }
        } catch (err) {
          localStorage.removeItem('companyToken');
          setIsValid(false);
        }
      }
    };
    verifyToken();
  }, []);

  if (isValid === null) return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      width: '100vw'
    }}>
      <div className="spinner-border" style={{ color: '#4f46e5', width: '3rem', height: '3rem' }} role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
  return isValid ? children : <Navigate to="/" />;
};
