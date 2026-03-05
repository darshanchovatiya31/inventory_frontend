import React, { useEffect, useState } from 'react';
import { FaBox, FaDollarSign, FaShoppingCart, FaChartLine, FaCalendarAlt, FaMoneyBillWave } from 'react-icons/fa';
import axios from 'axios';
import { BaseUrl } from '../service/Uri';
import CommonHeader from './CommonHeader';
import './CompanyDashboard.css';

const CompanyDashboard = ({setCurrentPage,toggleSidebar}) => {
  const CompanyInfo = JSON.parse(localStorage.getItem('company'));
  const token = localStorage.getItem('companyToken');
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({ 
    totalItems: 0, 
    totalValue: 0,
    totalSales: 0,
    monthlySales: 0,
    totalRevenue: 0,
    monthlyRevenue: 0
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BaseUrl}/company/dashboard/company`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.status) {
          setDashboardData(response.data.data);
        }
      } catch (error) {
        console.error("Dashboard data fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    if (CompanyInfo?._id) fetchDashboardData();
  }, [CompanyInfo?._id, token]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  return (
    <div className="container-fluid p-0">
      <CommonHeader title="Dashboard" company={CompanyInfo} toggleSidebar={toggleSidebar} setCurrentPage={setCurrentPage} />

      <div className="company-dashboard">
        {loading ? (
          <div className="company-dashboard-skeleton-grid">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="company-dashboard-skeleton-card">
                <div className="company-skeleton company-dashboard-skeleton-icon"></div>
                <div className="company-dashboard-skeleton-content">
                  <div className="company-skeleton company-dashboard-skeleton-label"></div>
                  <div className="company-skeleton company-dashboard-skeleton-value"></div>
                  <div className="company-skeleton company-dashboard-skeleton-description"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="company-dashboard-grid">
            {/* Total Inventory */}
            <div className="company-dashboard-card company-dashboard-card-primary">
              <div className="company-dashboard-card-icon">
                <FaBox />
              </div>
              <div className="company-dashboard-card-content">
                <div className="company-dashboard-card-label">Total Inventory</div>
                <div className="company-dashboard-card-value">{dashboardData.totalItems}</div>
                <p className="company-dashboard-card-description">All time items</p>
              </div>
            </div>

            {/* Total Value */}
            <div className="company-dashboard-card company-dashboard-card-secondary">
              <div className="company-dashboard-card-icon">
                <FaDollarSign />
              </div>
              <div className="company-dashboard-card-content">
                <div className="company-dashboard-card-label">Total Value</div>
                <div className="company-dashboard-card-value">{formatCurrency(dashboardData.totalValue)}</div>
                <p className="company-dashboard-card-description">Inventory worth</p>
              </div>
            </div>

            {/* Total Sales */}
            <div className="company-dashboard-card company-dashboard-card-primary">
              <div className="company-dashboard-card-icon">
                <FaShoppingCart />
              </div>
              <div className="company-dashboard-card-content">
                <div className="company-dashboard-card-label">Total Sales</div>
                <div className="company-dashboard-card-value">{dashboardData.totalSales}</div>
                <p className="company-dashboard-card-description">All time transactions</p>
              </div>
            </div>

            {/* Total Revenue */}
            <div className="company-dashboard-card company-dashboard-card-secondary">
              <div className="company-dashboard-card-icon">
                <FaChartLine />
              </div>
              <div className="company-dashboard-card-content">
                <div className="company-dashboard-card-label">Total Revenue</div>
                <div className="company-dashboard-card-value">{formatCurrency(dashboardData.totalRevenue)}</div>
                <p className="company-dashboard-card-description">All time earnings</p>
              </div>
            </div>

            {/* Monthly Sales */}
            <div className="company-dashboard-card company-dashboard-card-primary">
              <div className="company-dashboard-card-icon">
                <FaCalendarAlt />
              </div>
              <div className="company-dashboard-card-content">
                <div className="company-dashboard-card-label">Monthly Sales</div>
                <div className="company-dashboard-card-value">{dashboardData.monthlySales}</div>
                <p className="company-dashboard-card-description">This month</p>
              </div>
            </div>

            {/* Monthly Revenue */}
            <div className="company-dashboard-card company-dashboard-card-secondary">
              <div className="company-dashboard-card-icon">
                <FaMoneyBillWave />
              </div>
              <div className="company-dashboard-card-content">
                <div className="company-dashboard-card-label">Monthly Revenue</div>
                <div className="company-dashboard-card-value">{formatCurrency(dashboardData.monthlyRevenue)}</div>
                <p className="company-dashboard-card-description">This month earnings</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyDashboard;
