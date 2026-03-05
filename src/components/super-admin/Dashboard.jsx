import React, { useEffect, useState } from 'react';
import { FaBuilding, FaBox } from 'react-icons/fa';
import axios from 'axios';
import { BaseUrl } from '../service/Uri';
import './AdminDashboard.css';

const Dashboard = () => {
  const token = localStorage.getItem('adminToken');
  const [stats, setStats] = useState({ totalCompanies: 0, totalVisitor: 0 });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BaseUrl}/company/dashboard/company`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.status) {
        setStats(res.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="admin-dashboard">
      {loading ? (
        <div className="admin-dashboard-loading">
          <div className="admin-dashboard-spinner"></div>
          <p className="admin-dashboard-loading-text">Loading dashboard...</p>
        </div>
      ) : (
        <div className="admin-dashboard-grid">
          <div className="admin-dashboard-card admin-dashboard-card-primary">
            <div className="admin-dashboard-card-icon">
              <FaBuilding />
            </div>
            <div className="admin-dashboard-card-content">
              <div className="admin-dashboard-card-label">Total Companies</div>
              <div className="admin-dashboard-card-value">{stats.totalCompanies}</div>
              <div className="admin-dashboard-card-description">All time companies</div>
            </div>
          </div>

          <div className="admin-dashboard-card admin-dashboard-card-secondary">
            <div className="admin-dashboard-card-icon">
              <FaBox />
            </div>
            <div className="admin-dashboard-card-content">
              <div className="admin-dashboard-card-label">Total Inventorys</div>
              <div className="admin-dashboard-card-value">{stats.totalVisitor}</div>
              <div className="admin-dashboard-card-description">All time inventorys</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
