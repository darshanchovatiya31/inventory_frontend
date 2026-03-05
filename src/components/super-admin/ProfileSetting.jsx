import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BaseUrl } from '../service/Uri';
import './AdminProfileSetting.css';

const ProfileSetting = () => {
  const [initialLoading, setInitialLoading] = useState(true);
  const storedAdmin = JSON.parse(localStorage.getItem('admin'));
  const token = localStorage.getItem('adminToken');
  const [emailId, setEmailId] = useState(storedAdmin?.emailId || '');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Simulate loading time for consistency
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!emailId || !password) {
      setError("Both email and password are required.");
      return;
    }
    try {
      setLoading(true);
      setError('');
      setMessage('');
      const response = await axios.put(`${BaseUrl}/super-admin/update-profile/${storedAdmin._id}`,{ emailId, password },{ headers: {Authorization: `Bearer ${token}`,},}
      );
      if (response.data.data) {
        const updatedAdmin = {
          ...storedAdmin,
          emailId: response.data.data.emailId,
        };
        localStorage.setItem('admin', JSON.stringify(updatedAdmin));
      }
      setMessage(response.data.message || "Profile updated successfully!");
      setPassword('');
    } catch (error) {
      console.error("Update failed:", error);
      setError(error?.response?.data?.message || "Something went wrong while updating profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-profile-setting">
      <div className="admin-profile-setting-container">
        {initialLoading ? (
          <div className="admin-profile-setting-skeleton-card">
            <div className="admin-skeleton admin-profile-setting-skeleton-title"></div>
            {[...Array(2)].map((_, index) => (
              <div key={index} className="admin-profile-setting-skeleton-form-group">
                <div className="admin-skeleton admin-profile-setting-skeleton-label"></div>
                <div className="admin-skeleton admin-profile-setting-skeleton-input"></div>
              </div>
            ))}
            <div className="admin-skeleton admin-profile-setting-skeleton-button"></div>
          </div>
        ) : (
          <div className="admin-profile-setting-card">
            <h2 className="admin-profile-setting-title">Account Settings</h2>
            <form onSubmit={handleUpdate}>
            <div className="admin-profile-setting-form-group">
              <label className="admin-profile-setting-label">Email</label>
              <input 
                type="email" 
                className="admin-profile-setting-input" 
                value={emailId} 
                onChange={(e) => setEmailId(e.target.value)} 
                required 
              />
            </div>
            <div className="admin-profile-setting-form-group">
              <label className="admin-profile-setting-label">New Password</label>
              <input 
                type="password" 
                className="admin-profile-setting-input" 
                placeholder="Enter new password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>
            {error && (
              <div className="admin-profile-setting-alert admin-profile-setting-alert-danger">
                {error}
              </div>
            )}
            {message && (
              <div className="admin-profile-setting-alert admin-profile-setting-alert-success">
                {message}
              </div>
            )}
            <button 
              type="submit" 
              className="admin-profile-setting-button" 
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Account"}
            </button>
          </form>
        </div>
        )}
      </div>
    </div>
  );
};

export default ProfileSetting;
