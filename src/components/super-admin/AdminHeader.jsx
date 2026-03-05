import React, { useState, useEffect, useRef } from 'react';
import { FaUserCircle, FaBars, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './AdminHeader.css';

const AdminHeader = ({ title, toggleSidebar, isMobile, setCurrentPage }) => {
  const admin = JSON.parse(localStorage.getItem('admin'));
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  const handleLogout = () => {
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
    setDropdownOpen(false);
  };

  const handleAccountSetting = () => {
    setCurrentPage('Account Setting');
    setDropdownOpen(false);
  };

  return (
    <header className="admin-header">
      <div className="admin-header-left">
        {isMobile && (
          <button 
            className="admin-header-menu-btn" 
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            <FaBars />
          </button>
        )}
        <h1 className="admin-header-title">{title}</h1>
      </div>

      <div className="admin-header-right" ref={dropdownRef}>
        <div 
          className="admin-header-user" 
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <div className="admin-header-avatar">
            <FaUserCircle />
          </div>
          <div className="admin-header-user-info">
            <div className="admin-header-user-name">Super Admin</div>
            <div className="admin-header-user-email">{admin?.emailId || 'admin@example.com'}</div>
          </div>
        </div>

        {dropdownOpen && (
          <div className="admin-header-dropdown">
            <div 
              className="admin-header-dropdown-item" 
              onClick={handleAccountSetting}
            >
              <FaCog className="admin-header-dropdown-icon" />
              <span>Account Setting</span>
            </div>
            <div 
              className="admin-header-dropdown-item admin-header-dropdown-item-danger" 
              onClick={handleLogout}
            >
              <FaSignOutAlt className="admin-header-dropdown-icon" />
              <span>Logout</span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default AdminHeader;
