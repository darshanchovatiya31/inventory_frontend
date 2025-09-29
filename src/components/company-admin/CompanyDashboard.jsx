import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BaseUrl } from '../service/Uri';
import CommonHeader from './CommonHeader';

const CompanyDashboard = ({setCurrentPage,toggleSidebar}) => {
  const CompanyInfo = JSON.parse(localStorage.getItem('company'));
  const token = localStorage.getItem('companyToken');
  const [inventoryStats, setInventoryStats] = useState({ totalItems: 0, monthlyItems: 0 });

  useEffect(() => {
    const fetchInventoryStats = async () => {
      try {
        const response = await axios.get(`${BaseUrl}/inventory/dashboard/inventory/${CompanyInfo._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.status) {
          setInventoryStats(response.data.data);
        }
      } catch (error) {
        console.error("Inventorys stats fetch error:", error);
      }
    };
    if (CompanyInfo?._id) fetchInventoryStats();
  }, []);

  return (
    <div className="container-fluid p-0">
      <CommonHeader title="Dashboard" company={CompanyInfo} toggleSidebar={toggleSidebar} setCurrentPage={setCurrentPage} />

      <div className="row g-4 mt-3">
        <div className="col-md-6">
          <div className="row m-0 mb-2">
            <div className="card border-0 shadow-sm h-100 text-white" style={{ background: 'linear-gradient(to right, rgb(34 44 107), rgb(139 146 177))' }}>
              <div className="card-body py-5">
                <h6>Total Inventorys</h6>
                <h2>{inventoryStats.totalItems}</h2>
                <p>All time Inventorys</p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="row m-0">
            <div className="card border-0 shadow-sm h-100 text-white" style={{ background: 'linear-gradient(to right, rgb(14 74 67), rgb(143 160 113))' }}>
              <div className="card-body py-5">
                <h6>Monthly Inventorys</h6>
                <h2>{inventoryStats.monthlyItems}</h2>
                <p>This month</p>
              </div>
            </div>
          </div>
        </div>

        {/* <div className="col-md-6">
          <div className="row m-0">
            <div className="card border-0 shadow-sm h-100 text-white" style={{ background: 'linear-gradient(to right, rgb(14 74 67), rgb(143 160 113))' }}>
              <div className="card-body py-5">
                <h6>Monthly Inventorys</h6>
                <h2>{inventoryStats.monthlyItems}</h2>
                <p>This month</p>
              </div>
            </div>
          </div>
        </div>

         <div className="col-md-6">
          <div className="row m-0 mb-4">
            <div className="card border-0 shadow-sm h-100 text-white" style={{ background: 'linear-gradient(to right, rgb(34 44 107), rgb(139 146 177))' }}>
              <div className="card-body py-5">
                <h6>Total Inventorys</h6>
                <h2>{inventoryStats.totalItems}</h2>
                <p>All time Inventorys</p>
              </div>
            </div>
          </div>
        </div> */}
        
      </div>
    </div>
  );
};

export default CompanyDashboard;
