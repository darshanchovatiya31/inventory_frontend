import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import CompanyDashboard from './CompanyDashboard';
import Inventorys from './Inventorys';
import Sales from './Sales';
import ProfileSetting from './ProfileSetting';

const CompanyPanel = () => {
  const [isOpen, setIsOpen] = useState(window.innerWidth >= 992);
  const [currentPage, setCurrentPage] = useState(() => {
    return localStorage.getItem('currentPage') || 'Dashboard';
  });

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleResize = () => {
    if (window.innerWidth >= 992) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    localStorage.setItem('currentPage', currentPage);
  }, [currentPage]);

  const renderContent = () => {
    switch (currentPage) {
      case 'Dashboard':
        return <CompanyDashboard setCurrentPage={setCurrentPage} toggleSidebar={toggleSidebar} />;
      case 'Inventorys':
        return <Inventorys setCurrentPage={setCurrentPage} toggleSidebar={toggleSidebar} isOpen={isOpen}/>;
      case 'Sales':
        return <Sales setCurrentPage={setCurrentPage} toggleSidebar={toggleSidebar} isOpen={isOpen}/>;
      case 'Account Setting':
        return <ProfileSetting setCurrentPage={setCurrentPage} toggleSidebar={toggleSidebar} />;
      default:
        return <CompanyDashboard setCurrentPage={setCurrentPage} toggleSidebar={toggleSidebar} />;
    }
  };

  const isMobile = window.innerWidth < 992;

  return (
    <div className="d-flex" style={{ background: '#f8f9fb', minHeight: '100vh', overflow: 'hidden' }}>
      <Sidebar 
        isOpen={isOpen} 
        toggleSidebar={toggleSidebar} 
        currentPage={currentPage} 
        setCurrentPage={(name) => { 
          setCurrentPage(name); 
          if (isMobile) setIsOpen(false); 
        }}
      />
      <div className="flex-grow-1" style={{ transition: 'margin-left 0.3s ease', overflowY: 'auto', height: '100vh' }}>
        {renderContent()}
      </div>
    </div>
  );
};

export default CompanyPanel;
