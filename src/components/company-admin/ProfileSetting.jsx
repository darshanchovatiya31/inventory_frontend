import React, { useState } from 'react';
import axios from 'axios';
import { BaseUrl } from '../service/Uri';
import CommonHeader from './CommonHeader';
import './CompanyProfileSetting.css';

const ProfileSetting = ({ toggleSidebar, setCurrentPage }) => {
  const company = JSON.parse(localStorage.getItem('company'));
  const [formData, setFormData] = useState({
    name: company.name,
    email: company.email,
    mobile: company.mobile || '',
    pname: company.pname || '',
    address: company.address || '',
    logo: null
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [passwordData, setPasswordData] = useState({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
});
const [passwordError, setPasswordError] = useState('');
const [passwordSuccess, setPasswordSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (name === 'mobile' && !/^\d*$/.test(value)) return;
    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else if (type === 'file') {
      setFormData({ ...formData, logo: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('companyToken');
      const form = new FormData();
      for (const key in formData) {
        if (formData[key] !== null) {
          form.append(key, formData[key]);
        }
      }
      const res = await axios.put(`${BaseUrl}/company/profile/update/${company._id}`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      if (res.data?.data) {
        localStorage.setItem('company', JSON.stringify(res.data.data));
        setSuccessMsg('Profile updated successfully.');
        window.location.reload();
        setErrorMsg('');
      } else {
        setErrorMsg(res.data.message || 'Update failed.');
      }
    } catch (err) {
      console.error('Update Error:', err);
      setErrorMsg('Something went wrong.');
    }
  };

  const handlePasswordChange = (e) => {
  const { name, value } = e.target;
  setPasswordData({ ...passwordData, [name]: value });
};

const handlePasswordSubmit = async (e) => {
  e.preventDefault();
  setPasswordError('');
  setPasswordSuccess('');
  
  if (passwordData.newPassword !== passwordData.confirmPassword) {
    setPasswordError('New password and confirm password do not match.');
    return;
  }
  try {
    const token = localStorage.getItem('companyToken');
    const res = await axios.put(`${BaseUrl}/company/change-password/${company._id}`, passwordData, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json'}
    });
    if (res.data?.message === 'Password updated successfully') {
      setPasswordSuccess('Password updated successfully.');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } else {
      setPasswordError(res.data.message || 'Failed to update password.');
    }
  } catch (err) {
    console.error('Password Update Error:', err);
    setPasswordError('Something went wrong.');
  }
};

  return (
    <div className="container-fluid p-0">
      <CommonHeader title="Account Setting" company={company} toggleSidebar={toggleSidebar} setCurrentPage={setCurrentPage} />
      <div className="company-profile-setting">
        <div className="company-profile-setting-grid">
          {/* Profile Settings Card */}
          <div className="company-profile-setting-card">
            <h2 className="company-profile-setting-title">Profile Settings</h2>
            <form onSubmit={handleUpdateSubmit}>
              <div className="company-profile-setting-form-group">
                <label className="company-profile-setting-label">Company Name</label>
                <input 
                  className="company-profile-setting-input" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="company-profile-setting-form-group">
                <label className="company-profile-setting-label">Email</label>
                <input 
                  className="company-profile-setting-input" 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="company-profile-setting-form-group">
                <label className="company-profile-setting-label">Mobile Number</label>
                <input 
                  className="company-profile-setting-input" 
                  type="text" 
                  name="mobile" 
                  value={formData.mobile} 
                  maxLength="10" 
                  pattern="^[0-9]{10}$" 
                  title="Mobile number must be 10 digits" 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="company-profile-setting-form-group">
                <label className="company-profile-setting-label">Contact Person Name</label>
                <input 
                  className="company-profile-setting-input" 
                  name="pname" 
                  value={formData.pname} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="company-profile-setting-form-group">
                <label className="company-profile-setting-label">Address</label>
                <input 
                  className="company-profile-setting-input" 
                  name="address" 
                  value={formData.address} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="company-profile-setting-form-group">
                <label className="company-profile-setting-label">Logo (optional)</label>
                <input 
                  className="company-profile-setting-file-input" 
                  type="file" 
                  accept="image/*" 
                  name="logo" 
                  onChange={handleChange} 
                />
                {company.logo && (
                  <div className="company-profile-setting-logo-preview">
                    <img 
                      src={`${company.logo}`} 
                      alt="Current Logo" 
                      className="company-profile-setting-logo-image"
                    />
                  </div>
                )}
              </div>
              {errorMsg && (
                <div className="company-profile-setting-alert company-profile-setting-alert-danger">
                  {errorMsg}
                </div>
              )}
              {successMsg && (
                <div className="company-profile-setting-alert company-profile-setting-alert-success">
                  {successMsg}
                </div>
              )}
              <button type="submit" className="company-profile-setting-button">
                Update Profile
              </button>
            </form>
          </div>

          {/* Change Password Card */}
          <div className="company-profile-setting-card">
            <h2 className="company-profile-setting-title">Change Password</h2>
            <form onSubmit={handlePasswordSubmit}>
              <div className="company-profile-setting-form-group">
                <label className="company-profile-setting-label">Current Password</label>
                <input 
                  type="password" 
                  name="currentPassword" 
                  className="company-profile-setting-input" 
                  required 
                  onChange={handlePasswordChange} 
                />
              </div>
              <div className="company-profile-setting-form-group">
                <label className="company-profile-setting-label">New Password</label>
                <input 
                  type="password" 
                  name="newPassword" 
                  className="company-profile-setting-input" 
                  required 
                  minLength="6" 
                  onChange={handlePasswordChange} 
                />
              </div>
              <div className="company-profile-setting-form-group">
                <label className="company-profile-setting-label">Confirm New Password</label>
                <input 
                  type="password" 
                  name="confirmPassword" 
                  className="company-profile-setting-input" 
                  required 
                  minLength="6" 
                  onChange={handlePasswordChange} 
                />
              </div>
              {passwordError && (
                <div className="company-profile-setting-alert company-profile-setting-alert-danger">
                  {passwordError}
                </div>
              )}
              {passwordSuccess && (
                <div className="company-profile-setting-alert company-profile-setting-alert-success">
                  {passwordSuccess}
                </div>
              )}
              <button type="submit" className="company-profile-setting-button">
                Change Password
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetting;
