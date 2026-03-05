import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaBuilding } from 'react-icons/fa';
import { BaseUrl } from "../service/Uri";
import 'bootstrap/dist/css/bootstrap.min.css';
import './CompanyLogin.css';

const CompanyLogin = () => {
  const { companyName } = useParams(); 
  const [emailId, setEmailId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [companyInfo, setCompanyInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompanyInfo = async () => {
      try {
        const res = await axios.get(`${BaseUrl}/company/slug-info/${companyName}`);
        setCompanyInfo(res.data.data);
      } catch (err) {
        console.error("Error fetching company info:", err);
      }
    };
    if (companyName) {
      fetchCompanyInfo();
    }
  }, [companyName]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const response = await axios.post(`${BaseUrl}/company/login`, {email: emailId,password: password});
      const result = response.data;
      if (result.data) {
        localStorage.setItem('companyToken', result.data.token);
        localStorage.setItem('company', JSON.stringify(result.data.company));
        setErrorMsg('');
        navigate('/company');
      } else {
        setErrorMsg(result.message || 'Login failed');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Login failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="company-login-container">
      <div className="company-login-card">
        <div className="company-login-header">
          <div className="company-logo-wrapper">
            {companyInfo?.logo ? (
              <img 
                src={`${BaseUrl}/${companyInfo.logo}`} 
                alt="Company Logo" 
                className="company-logo-img"
                onError={(e) => {
                  e.target.style.display = 'none';
                  const appLogo = e.target.parentElement.querySelector('.company-app-logo');
                  if (appLogo) appLogo.style.display = 'block';
                }}
              />
            ) : (
              <img 
                src="/icons/icon-192x192.png" 
                alt="IMS Logo" 
                className="company-logo-img company-app-logo"
                onError={(e) => {
                  e.target.style.display = 'none';
                  const placeholder = e.target.parentElement.querySelector('.company-logo-placeholder');
                  if (placeholder) placeholder.style.display = 'flex';
                }}
              />
            )}
            <div className="company-logo-placeholder" style={{ display: 'none' }}>
              <FaBuilding />
            </div>
          </div>
          <h2 className="company-login-title">
            {companyInfo?.name ? companyInfo.name : 'Company Portal'}
          </h2>
          <p className="company-login-subtitle">Sign in to access your dashboard</p>
        </div>

        <div className="company-login-body">
          {errorMsg && (
            <div className="company-login-error">
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="company-form-group">
              <label className="company-form-label">Email Address</label>
              <div className="company-input-wrapper">
                <span className="company-input-icon">
                  <FaEnvelope />
                </span>
                <input
                  type="email"
                  className="company-form-input"
                  placeholder="Enter your email address"
                  value={emailId}
                  onChange={(e) => setEmailId(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="company-form-group">
              <label className="company-form-label">Password</label>
              <div className="company-input-wrapper">
                <span className="company-input-icon">
                  <FaLock />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="company-form-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="company-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              className="company-login-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="company-spinner"></span>
                  Signing in...
                </>
              ) : (
                'Sign In to Dashboard'
              )}
            </button>
          </form>

          <div className="company-login-footer">
            <p className="company-login-footer-text">Secure company authentication portal</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyLogin;
