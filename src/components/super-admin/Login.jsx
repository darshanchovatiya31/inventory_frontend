import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaShieldAlt } from 'react-icons/fa';
import { BaseUrl } from "../service/Uri";
import './AdminLogin.css';

const Login = () => {
  const [emailId, setEmailId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await axios.post(`${BaseUrl}/super-admin/signin`, {emailId,password});      
      const result = res.data;
      
      if(result.data){
        localStorage.setItem('adminToken', result.data.token);
        localStorage.setItem('admin',JSON.stringify(result.data.user))
        setErrorMsg('')
        navigate('/super-admin');
      }else{
        setErrorMsg(result.message)
      }
    } catch (error) {
      setErrorMsg(error.response?.data?.message || 'Login failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <div className="admin-login-logo-wrapper">
            <img 
              src="/icons/icon-192x192.png" 
              alt="IMS Logo" 
              className="admin-login-logo"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextElementSibling.style.display = 'flex';
              }}
            />
            <div className="admin-login-icon" style={{ display: 'none' }}>
              <FaShieldAlt />
            </div>
          </div>
          <h2 className="admin-login-title">Admin Login</h2>
          <p className="admin-login-subtitle">Sign in to access the admin panel</p>
        </div>

        <div className="admin-login-body">
          {errorMsg && (
            <div className="admin-login-error">
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="admin-form-group">
              <label className="admin-form-label">Email Address</label>
              <div className="admin-input-wrapper">
                <span className="admin-input-icon">
                  <FaEnvelope />
                </span>
                <input
                  type="email"
                  className="admin-form-input"
                  placeholder="Enter your email address"
                  value={emailId}
                  onChange={(e) => setEmailId(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Password</label>
              <div className="admin-input-wrapper">
                <span className="admin-input-icon">
                  <FaLock />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="admin-form-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="admin-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              className="admin-login-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="admin-spinner"></span>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
