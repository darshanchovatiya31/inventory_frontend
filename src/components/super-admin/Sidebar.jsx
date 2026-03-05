import React from 'react';
import { FaBars, FaBuilding, FaTachometerAlt, FaSignOutAlt } from 'react-icons/fa';
import { IoMdSettings } from 'react-icons/io';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import './AdminSidebar.css';

const Sidebar = ({ isOpen, toggleSidebar, currentPage, setCurrentPage, isMobile }) => {
  const navigate = useNavigate();

  const handleItemClick = (name) => {
    if (name === 'Logout') {
      Swal.fire({
        title: 'Are you sure?',
        text: "You will be logged out!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, logout!'
      }).then((result) => {
        if (result.isConfirmed) {
          localStorage.removeItem('adminToken');
          localStorage.removeItem('admin');
          localStorage.removeItem('adminCurrentPage');
          Swal.fire({
            title: 'Logged Out!',
            text: 'You have been successfully logged out.',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
          }).then(() => {
            navigate('/admin/login');
          });
        }
      });
    } else {
      setCurrentPage(name);
      if (isMobile) toggleSidebar();
    }
  };

  const sidebarItems = [
    { name: 'Dashboard', icon: <FaTachometerAlt /> },
    { name: 'Company', icon: <FaBuilding /> },
    { name: 'Account Setting', icon: <IoMdSettings /> },
    { name: 'Logout', icon: <FaSignOutAlt /> },
  ];

  return (
    <>
      {isMobile && isOpen && (
        <div className="admin-sidebar-overlay" onClick={toggleSidebar} />
      )}

      <div className={`admin-sidebar ${isOpen ? 'admin-sidebar-open' : 'admin-sidebar-collapsed'} ${isMobile ? 'admin-sidebar-mobile' : ''}`}>
        <div className="admin-sidebar-header">
          {isOpen && (
            <div className="admin-sidebar-brand">
              <h5 className="admin-sidebar-title">SuperAdmin</h5>
              <small className="admin-sidebar-subtitle">Admin Panel</small>
            </div>
          )}
          <button 
            className="admin-sidebar-toggle" 
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            <FaBars />
          </button>
        </div>

        <div className="admin-sidebar-content">
          {sidebarItems.slice(0, -1).map((item) => (
            <div 
              key={item.name} 
              onClick={() => handleItemClick(item.name)}
              className={`admin-sidebar-item ${currentPage === item.name ? 'admin-sidebar-item-active' : ''}`}
            >
              <span className="admin-sidebar-icon">
                {item.icon}
              </span>
              {isOpen && (
                <span className="admin-sidebar-label">
                  {item.name}
                </span>
              )}
            </div>
          ))}
          
          <div className="admin-sidebar-divider"></div>
          
          {sidebarItems.slice(-1).map((item) => (
            <div 
              key={item.name} 
              onClick={() => handleItemClick(item.name)}
              className={`admin-sidebar-item admin-sidebar-item-logout ${currentPage === item.name ? 'admin-sidebar-item-active' : ''}`}
            >
              <span className="admin-sidebar-icon">
                {item.icon}
              </span>
              {isOpen && (
                <span className="admin-sidebar-label">
                  {item.name}
                </span>
              )}
            </div>
          ))}
        </div>

        {isOpen && (
          <div className="admin-sidebar-footer">
            <small className="admin-sidebar-version">Version 1.0.0</small>
          </div>
        )}
      </div>
    </>
  );
};

export default Sidebar;