import { useEffect } from 'react';
import { FaBars, FaTachometerAlt, FaSignOutAlt, FaShoppingCart } from 'react-icons/fa';
import { MdOutlineInventory } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { IoMdSettings } from "react-icons/io";
import './CompanySidebar.css';

const Sidebar = ({ isOpen, toggleSidebar, currentPage, setCurrentPage }) => {
  const navigate = useNavigate();
  const CompanyInfo = JSON.parse(localStorage.getItem('company'));
  const isMobile = window.innerWidth < 992;

  const handleItemClick = (name) => {
    if (name === 'Logout') {
      Swal.fire({
        title: 'Are you sure?',
        text: "You will be logged out!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, logout!',
        backdrop: true
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
          }).then(() => {
            navigate('/');
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
    { name: 'Inventorys', icon: <MdOutlineInventory /> },
    { name: 'Sales', icon: <FaShoppingCart /> },
    { name: 'Account Setting', icon: <IoMdSettings /> },
    { name: 'Logout', icon: <FaSignOutAlt /> },
  ];

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (isMobile && isOpen && !e.target.closest('.company-sidebar')) {
        toggleSidebar();
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [isMobile, isOpen, toggleSidebar]);

  return (
    <>
      {isMobile && isOpen && (
        <div className="company-sidebar-overlay" onClick={toggleSidebar} />
      )}

      <div className={`company-sidebar ${isOpen ? 'company-sidebar-open' : 'company-sidebar-collapsed'} ${isMobile ? 'company-sidebar-mobile' : ''}`}>
        <div className="company-sidebar-header">
          {isOpen && (
            <div className="company-sidebar-brand">
              <h5 className="company-sidebar-title">
                {CompanyInfo?.name || 'Company'}
              </h5>
              <small className="company-sidebar-subtitle">Company Panel</small>
            </div>
          )}
          <button 
            className="company-sidebar-toggle" 
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            <FaBars />
          </button>
        </div>

        <div className="company-sidebar-content">
          {sidebarItems.slice(0, -1).map((item) => (
            <div 
              key={item.name} 
              onClick={() => handleItemClick(item.name)}
              className={`company-sidebar-item ${currentPage === item.name ? 'company-sidebar-item-active' : ''}`}
            >
              <span className="company-sidebar-icon">
                {item.icon}
              </span>
              {isOpen && (
                <span className="company-sidebar-label">
                  {item.name}
                </span>
              )}
            </div>
          ))}
          
          <div className="company-sidebar-divider"></div>
          
          {sidebarItems.slice(-1).map((item) => (
            <div 
              key={item.name} 
              onClick={() => handleItemClick(item.name)}
              className={`company-sidebar-item company-sidebar-item-logout ${currentPage === item.name ? 'company-sidebar-item-active' : ''}`}
            >
              <span className="company-sidebar-icon">
                {item.icon}
              </span>
              {isOpen && (
                <span className="company-sidebar-label">
                  {item.name}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
