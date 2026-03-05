import React, { useState, useEffect, useRef } from "react";
import { FaBars, FaCog, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { BaseUrl } from "../service/Uri";
import './CompanyHeader.css';

const CommonHeader = ({ title, company, toggleSidebar, setCurrentPage }) => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
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

  useEffect(() => {
    // Reset image error when company changes
    setImageError(false);
  }, [company?.logo]);

  const getCompanyInitials = (name) => {
    if (!name) return 'C';
    const words = name.trim().split(/\s+/);
    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase();
    }
    return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, logout!",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('companyToken');
        localStorage.removeItem('company');
        localStorage.removeItem('currentPage');
        Swal.fire({
          title: 'Logged Out!',
          text: 'You have been successfully logged out.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        })
        .then(() => {
          navigate("/");
        });
      }
    });
    setDropdownOpen(false);
  };

  const handleAccountSetting = () => {
    setCurrentPage("Account Setting");
    setDropdownOpen(false);
  };

  return (
    <header className="company-header">
      <div className="company-header-left">
        <button 
          className="company-header-menu-btn d-lg-none" 
          onClick={(e) => {
            e.stopPropagation();
            toggleSidebar();
          }}
          aria-label="Toggle sidebar"
        >
          <FaBars />
        </button>
        <h1 className="company-header-title">{title}</h1>
      </div>

      <div className="company-header-right" ref={dropdownRef}>
        <div 
          className="company-header-user" 
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <div className="company-header-logo">
            {company?.logo && !imageError ? (
              <img 
                src={`${BaseUrl}/${company.logo}`} 
                alt="Company Logo" 
                className="company-header-logo-img"
                onError={handleImageError}
              />
            ) : (
              <div className="company-header-logo-placeholder">
                {getCompanyInitials(company?.name)}
              </div>
            )}
          </div>
          <div className="company-header-user-info">
            <div className="company-header-user-name">{company?.name || 'Company'}</div>
          </div>
        </div>

        {dropdownOpen && (
          <div className="company-header-dropdown">
            <div 
              className="company-header-dropdown-item" 
              onClick={handleAccountSetting}
            >
              <FaCog className="company-header-dropdown-icon" />
              <span>Account Setting</span>
            </div>
            <div 
              className="company-header-dropdown-item company-header-dropdown-item-danger" 
              onClick={handleLogout}
            >
              <FaSignOutAlt className="company-header-dropdown-icon" />
              <span>Logout</span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default CommonHeader;
