import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BaseUrl } from '../service/Uri';
import CommonHeader from './CommonHeader';

const CompanyDashboard = ({setCurrentPage,toggleSidebar}) => {
  const CompanyInfo = JSON.parse(localStorage.getItem('company'));
  const token = localStorage.getItem('companyToken');
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
        const response = await axios.get(`${BaseUrl}/company/dashboard/company`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.status) {
          setDashboardData(response.data.data);
        }
      } catch (error) {
        console.error("Dashboard data fetch error:", error);
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

      <div className="row g-4 mt-3">
        {/* Inventory Cards */}
        <div className="col-md-6">
          <div className="row m-0 mb-2">
            <div className="card border-0 shadow-sm h-100 text-white" style={{ background: 'linear-gradient(to right, rgb(34 44 107), rgb(139 146 177))' }}>
              <div className="card-body py-5">
                <h6>Total Inventory</h6>
                <h2>{dashboardData.totalItems}</h2>
                <p>All time items</p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="row m-0 mb-2">
            <div className="card border-0 shadow-sm h-100 text-white" style={{ background: 'linear-gradient(to right, rgb(139 69 19), rgb(205 133 63))' }}>
              <div className="card-body py-5">
                <h6>Total Value</h6>
                <h2>{formatCurrency(dashboardData.totalValue)}</h2>
                <p>Inventory worth</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sales Cards */}
        <div className="col-md-6">
          <div className="row m-0 mb-2">
            <div className="card border-0 shadow-sm h-100 text-white" style={{ background: 'linear-gradient(to right, rgb(21 94 117), rgb(34 197 94))' }}>
              <div className="card-body py-5">
                <h6>Total Sales</h6>
                <h2>{dashboardData.totalSales}</h2>
                <p>All time transactions</p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="row m-0 mb-2">
            <div className="card border-0 shadow-sm h-100 text-white" style={{ background: 'linear-gradient(to right, rgb(5 150 105), rgb(16 185 129))' }}>
              <div className="card-body py-5">
                <h6>Total Revenue</h6>
                <h2>{formatCurrency(dashboardData.totalRevenue)}</h2>
                <p>All time earnings</p>
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Cards */}
        <div className="col-md-6">
          <div className="row m-0 mb-2">
            <div className="card border-0 shadow-sm h-100 text-white" style={{ background: 'linear-gradient(to right, rgb(147 51 234), rgb(168 85 247))' }}>
              <div className="card-body py-5">
                <h6>Monthly Sales</h6>
                <h2>{dashboardData.monthlySales}</h2>
                <p>This month</p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="row m-0 mb-2">
            <div className="card border-0 shadow-sm h-100 text-white" style={{ background: 'linear-gradient(to right, rgb(236 72 153), rgb(244 114 182))' }}>
              <div className="card-body py-5">
                <h6>Monthly Revenue</h6>
                <h2>{formatCurrency(dashboardData.monthlyRevenue)}</h2>
                <p>This month earnings</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;
