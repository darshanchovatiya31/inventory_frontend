import { useEffect, useState } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';
import Swal from 'sweetalert2';
import { BaseUrl } from "../service/Uri";
import { FaShoppingCart, FaDownload, FaEdit, FaEye, FaTrash, FaPlus, FaSearch, FaFilter, FaRupeeSign, FaUser, FaCalendarAlt } from 'react-icons/fa';
import CommonHeader from './CommonHeader';
import { CreateSaleModal, EditSaleModal, ViewSaleModal } from './SalesModals';

const Sales = ({ toggleSidebar, setCurrentPage, isOpen }) => {
  const [sales, setSales] = useState([]);
  const [inventories, setInventories] = useState([]);
  const [stats, setStats] = useState({ 
    totalSales: 0, 
    monthlySales: 0, 
    weeklySales: 0, 
    totalRevenue: 0, 
    monthlyRevenue: 0,
    paymentBreakdown: [],
    topProducts: []
  });
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPages] = useState(1);
  const itemsPerPage = 6;
  const company = JSON.parse(localStorage.getItem('company'));
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);

  // Modals and selected item
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);
  const [formData, setFormData] = useState({
    inventoryId: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    quantitySold: 1,
    unitPrice: 0,
    paymentMethod: 'cash',
    paymentStatus: 'completed',
    transactionId: '',
    notes: '',
    paymentReceivedBy: '',
    saleDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 992);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchSales = async () => {
    try {
      const token = localStorage.getItem('companyToken');
      const res = await axios.get(`${BaseUrl}/sales/company-sales`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.status === 200) {
        setSales(res.data.data.sales);
      } else {
        console.error("Failed to fetch sales:", res.data.message);
      }
    } catch (error) {
      console.error("Error fetching sales:", error);
    }
  };

  const fetchInventories = async () => {
    try {
      const token = localStorage.getItem('companyToken');
      const res = await axios.get(`${BaseUrl}/inventory/company-inventory`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.status === 200) {
        setInventories(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching inventories:", error);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('companyToken');
      const res = await axios.get(`${BaseUrl}/sales/dashboard/sales/${company._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.status === true) {
        setStats(res.data.data);
      } else {
        console.error("Failed to fetch sales stats:", res.data.message);
      }
    } catch (error) {
      console.error("Error fetching sales stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
    fetchInventories();
    fetchStats();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Auto-calculate total amount when quantity or unit price changes
    if (name === 'quantitySold' || name === 'unitPrice') {
      const quantity = name === 'quantitySold' ? Number(value) : formData.quantitySold;
      const price = name === 'unitPrice' ? Number(value) : formData.unitPrice;
      setFormData(prev => ({ ...prev, totalAmount: quantity * price }));
    }
  };

  const handleCreate = async () => {
    try {
      const token = localStorage.getItem('companyToken');
      const data = {
        ...formData,
        totalAmount: formData.quantitySold * formData.unitPrice
      };

      await axios.post(`${BaseUrl}/sales/create/${company._id}`, data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setShowCreateModal(false);
      setFormData({
        inventoryId: '',
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        quantitySold: 1,
        unitPrice: 0,
        paymentMethod: 'cash',
        paymentStatus: 'completed',
        transactionId: '',
        notes: '',
        paymentReceivedBy: '',
        saleDate: new Date().toISOString().split('T')[0]
      });
      fetchSales();
      fetchStats();
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Sale created successfully!',
      });
    } catch (error) {
      console.error("Error creating sale:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Failed to create sale.',
      });
    }
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('companyToken');
      const data = {
        ...formData,
        totalAmount: formData.quantitySold * formData.unitPrice
      };

      await axios.put(`${BaseUrl}/sales/update/${selectedSale._id}`, data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setShowEditModal(false);
      fetchSales();
      fetchStats();
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Sale updated successfully!',
      });
    } catch (error) {
      console.error("Error updating sale:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Failed to update sale.',
      });
    }
  };

  const handleDelete = async (sale) => {
    Swal.fire({
      title: `Are you sure you want to cancel this sale?`,
      text: "This will restore the inventory quantity and cannot be undone!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, cancel it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem('companyToken');
          await axios.delete(`${BaseUrl}/sales/delete/${sale._id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          fetchSales();
          fetchStats();
          Swal.fire({
            icon: 'success',
            title: 'Cancelled!',
            text: `Sale for ${sale.customerName} has been cancelled.`,
          });
        } catch (error) {
          console.error("Error cancelling sale:", error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to cancel sale.',
          });
        }
      }
    });
  };

  const openEditModal = (sale) => {
    setSelectedSale(sale);
    setFormData({
      inventoryId: sale.inventoryId._id,
      customerName: sale.customerName,
      customerEmail: sale.customerEmail || '',
      customerPhone: sale.customerPhone || '',
      quantitySold: sale.quantitySold,
      unitPrice: sale.unitPrice,
      paymentMethod: sale.paymentMethod,
      paymentStatus: sale.paymentStatus,
      transactionId: sale.transactionId || '',
      notes: sale.notes || '',
      paymentReceivedBy: sale.paymentReceivedBy || '',
      saleDate: new Date(sale.saleDate).toISOString().split('T')[0]
    });
    setShowEditModal(true);
  };

  const openViewModal = (sale) => {
    setSelectedSale(sale);
    setShowViewModal(true);
  };

  const openCreateModal = () => {
    setFormData({
      inventoryId: '',
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      quantitySold: 1,
      unitPrice: 0,
      paymentMethod: 'cash',
      paymentStatus: 'completed',
      transactionId: '',
      notes: '',
      paymentReceivedBy: '',
      saleDate: new Date().toISOString().split('T')[0]
    });
    setShowCreateModal(true);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSales = sales.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sales.length / itemsPerPage);

  const downloadCSV = () => {
    const headers = ['Customer Name', 'Product', 'SKU', 'Quantity', 'Unit Price', 'Total Amount', 'Payment Method', 'Sale Date', 'Payment Received By'];
    const rows = sales.map(s => [
      s.customerName,
      s.inventoryId?.name || 'N/A',
      s.inventoryId?.sku || 'N/A',
      s.quantitySold,
      s.unitPrice,
      s.totalAmount,
      s.paymentMethod,
      new Date(s.saleDate).toLocaleDateString(),
      s.paymentReceivedBy || 'N/A'
    ]);
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "sales.csv");
  };

  return (
    <div className="container-fluid p-0" style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <CommonHeader title="Sales" company={company} toggleSidebar={toggleSidebar} setCurrentPage={setCurrentPage} />

      {/* Header Section */}
      <div className="pt-4">
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mb-4">
          <div className="mb-3 mb-sm-0">
            <h2 className="fw-bold text-dark mb-1" style={{ fontSize: '1.75rem' }}>
              <FaShoppingCart className="me-2" style={{ color: '#4f46e5' }} />
              Sales Management
            </h2>
            <p className="text-muted mb-0" style={{ fontSize: '0.95rem' }}>
              Track your product sales and customer transactions
            </p>
          </div>
          <div className="d-flex gap-2">
            <button 
              className="btn btn-primary d-flex align-items-center px-3 py-2 fw-medium" 
              onClick={openCreateModal}
              style={{ 
                borderRadius: '10px',
                backgroundColor: '#4f46e5',
                border: 'none',
                fontSize: '0.875rem'
              }}
            >
              <FaPlus className="me-2" size={14} />
              New Sale
            </button>
            <button 
              className="btn btn-outline-primary d-flex align-items-center px-3 py-2 fw-medium" 
              onClick={downloadCSV}
              style={{ 
                borderRadius: '10px',
                borderColor: '#4f46e5',
                color: '#4f46e5',
                fontSize: '0.875rem'
              }}
            >
              <FaDownload className="me-2" size={14} />
              Export
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="row g-3 mb-4">
          <div className="col-6 col-lg-3">
            <div className="card border-0 h-100" style={{ 
              borderRadius: '12px', 
              backgroundColor: 'white',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}>
              <div className="card-body p-3">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <div className="p-2 rounded-circle" style={{ backgroundColor: '#eff6ff' }}>
                    <FaShoppingCart size={16} style={{ color: '#3b82f6' }} />
                  </div>
                  <span className="badge bg-light text-muted" style={{ fontSize: '0.75rem' }}>Total</span>
                </div>
                <h3 className="fw-bold mb-1" style={{ fontSize: '1.5rem', color: '#1f2937' }}>{stats.totalSales}</h3>
                <p className="text-muted mb-0" style={{ fontSize: '0.875rem' }}>Sales</p>
              </div>
            </div>
          </div>
          <div className="col-6 col-lg-3">
            <div className="card border-0 h-100" style={{ 
              borderRadius: '12px', 
              backgroundColor: 'white',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}>
              <div className="card-body p-3">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <div className="p-2 rounded-circle" style={{ backgroundColor: '#f0fdf4' }}>
                    <FaCalendarAlt size={16} style={{ color: '#22c55e' }} />
                  </div>
                  <span className="badge bg-light text-muted" style={{ fontSize: '0.75rem' }}>Monthly</span>
                </div>
                <h3 className="fw-bold mb-1" style={{ fontSize: '1.5rem', color: '#1f2937' }}>{stats.monthlySales}</h3>
                <p className="text-muted mb-0" style={{ fontSize: '0.875rem' }}>This Month</p>
              </div>
            </div>
          </div>
          <div className="col-6 col-lg-3">
            <div className="card border-0 h-100" style={{ 
              borderRadius: '12px', 
              backgroundColor: 'white',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}>
              <div className="card-body p-3">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <div className="p-2 rounded-circle" style={{ backgroundColor: '#fefce8' }}>
                    <FaRupeeSign size={16} style={{ color: '#eab308' }} />
                  </div>
                  <span className="badge bg-light text-muted" style={{ fontSize: '0.75rem' }}>Revenue</span>
                </div>
                <h3 className="fw-bold mb-1" style={{ fontSize: '1.5rem', color: '#1f2937' }}>₹{stats.totalRevenue.toFixed(2)}</h3>
                <p className="text-muted mb-0" style={{ fontSize: '0.875rem' }}>Total</p>
              </div>
            </div>
          </div>
          <div className="col-6 col-lg-3">
            <div className="card border-0 h-100" style={{ 
              borderRadius: '12px', 
              backgroundColor: 'white',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}>
              <div className="card-body p-3">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <div className="p-2 rounded-circle" style={{ backgroundColor: '#fef2f2' }}>
                    <FaUser size={16} style={{ color: '#ef4444' }} />
                  </div>
                  <span className="badge bg-light text-muted" style={{ fontSize: '0.75rem' }}>Monthly</span>
                </div>
                <h3 className="fw-bold mb-1" style={{ fontSize: '1.5rem', color: '#1f2937' }}>₹{stats.monthlyRevenue.toFixed(2)}</h3>
                <p className="text-muted mb-0" style={{ fontSize: '0.875rem' }}>This Month</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sales List */}
      <div className="pb-4">
        <div className="card border-0" style={{ 
          borderRadius: '12px', 
          backgroundColor: 'white',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border" style={{ color: '#4f46e5' }} role="status"></div>
              <p className="mt-3 text-muted">Loading sales...</p>
            </div>
          ) : sales.length === 0 ? (
            <div className="text-center py-5">
              <div className="mb-3 p-4 rounded-circle mx-auto" style={{ 
                backgroundColor: '#f8fafc', 
                width: 'fit-content' 
              }}>
                <FaShoppingCart size={48} className="text-muted" />
              </div>
              <h5 className="text-muted mb-2">No sales found</h5>
              <p className="text-muted mb-3">Start by creating your first sale</p>
              <button 
                className="btn btn-primary px-4 py-2" 
                onClick={openCreateModal}
                style={{ borderRadius: '10px', backgroundColor: '#4f46e5', border: 'none' }}
              >
                <FaPlus className="me-2" size={14} />
                Create First Sale
              </button>
            </div>
          ) : (
            <>
              {/* Mobile View */}
              {isMobile ? (
                <div className="">
                  {currentSales.map((sale, index) => (
                    <div 
                      key={index} 
                      className="card border-0 mb-3" 
                      style={{ 
                        borderRadius: '10px', 
                        backgroundColor: '#fafafa',
                        border: '1px solid #e5e7eb'
                      }}
                    >
                      <div className="card-body p-3">
                        <div className="d-flex align-items-start mb-3">
                          <div className="flex-grow-1">
                            <h6 className="fw-bold mb-1" style={{ fontSize: '1rem', color: '#1f2937' }}>
                              {sale.customerName}
                            </h6>
                            <p className="text-muted mb-1" style={{ fontSize: '0.875rem' }}>
                              {sale.inventoryId?.name || 'Product N/A'}
                            </p>
                            <div className="d-flex justify-content-between align-items-center">
                              <span className="text-muted" style={{ fontSize: '0.875rem' }}>
                                Qty: {sale.quantitySold}
                              </span>
                              <span className="fw-medium" style={{ fontSize: '0.875rem', color: '#4f46e5' }}>
                                ₹{sale.totalAmount}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="row g-2 mb-3">
                          <div className="col-6">
                            <div className="p-2 rounded" style={{ backgroundColor: 'white' }}>
                              <small className="text-muted d-block">Payment</small>
                              <span style={{ fontSize: '0.875rem' }}>{sale.paymentMethod}</span>
                            </div>
                          </div>
                          <div className="col-6">
                            <div className="p-2 rounded" style={{ backgroundColor: 'white' }}>
                              <small className="text-muted d-block">Date</small>
                              <span style={{ fontSize: '0.875rem' }}>{new Date(sale.saleDate).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="d-flex justify-content-between align-items-center">
                          <span 
                            className={`badge ${sale.status === 'active' ? 'bg-success' : sale.status === 'cancelled' ? 'bg-danger' : 'bg-warning'}`}
                            style={{ fontSize: '0.75rem' }}
                          >
                            {sale.status}
                          </span>
                          <div className="d-flex gap-1">
                            <button 
                              className="btn btn-sm btn-outline-primary d-flex align-items-center justify-content-center" 
                              onClick={() => openViewModal(sale)}
                              style={{ borderRadius: '6px', padding: '8px' }}
                            >
                              <FaEye size={12} />
                            </button>
                            <button 
                              className="btn btn-sm btn-outline-secondary d-flex align-items-center justify-content-center" 
                              onClick={() => openEditModal(sale)}
                              style={{ borderRadius: '6px', padding: '8px' }}
                            >
                              <FaEdit size={12} />
                            </button>
                            <button 
                              className="btn btn-sm btn-outline-danger d-flex align-items-center justify-content-center" 
                              onClick={() => handleDelete(sale)}
                              style={{ borderRadius: '6px', padding: '8px' }}
                            >
                              <FaTrash size={12} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Desktop View */
                <div className="table-responsive" style={{ maxWidth: isOpen ? 'calc(100vw - 312px)' : 'calc(100vw - 123px)', overflowX: 'auto' }}>
                  <table className="table table-hover mb-0">
                    <thead style={{ backgroundColor: '#f8fafc' }}>
                      <tr>
                        <th className="fw-semibold px-3 py-3" style={{ color: '#374151', fontSize: '0.875rem' }}>Customer</th>
                        <th className="fw-semibold px-3 py-3" style={{ color: '#374151', fontSize: '0.875rem' }}>Product</th>
                        <th className="fw-semibold px-3 py-3" style={{ color: '#374151', fontSize: '0.875rem' }}>Quantity</th>
                        <th className="fw-semibold px-3 py-3" style={{ color: '#374151', fontSize: '0.875rem' }}>Unit Price</th>
                        <th className="fw-semibold px-3 py-3" style={{ color: '#374151', fontSize: '0.875rem' }}>Total</th>
                        <th className="fw-semibold px-3 py-3" style={{ color: '#374151', fontSize: '0.875rem' }}>Payment</th>
                        <th className="fw-semibold px-3 py-3" style={{ color: '#374151', fontSize: '0.875rem' }}>Date</th>
                        <th className="fw-semibold px-3 py-3" style={{ color: '#374151', fontSize: '0.875rem' }}>Status</th>
                        <th className="fw-semibold px-3 py-3 text-end" style={{ minWidth: "150px", color: '#374151', fontSize: '0.875rem' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentSales.map((sale, index) => (
                        <tr key={index} style={{ borderBottom: '1px solid #f3f4f6' }}>
                          <td className="py-3 px-3" style={{ verticalAlign: 'middle' }}>
                            <div>
                              <span style={{ color: '#374151', fontSize: '0.875rem', fontWeight: '500' }}>
                                {sale.customerName}
                              </span>
                              {sale.customerEmail && (
                                <div style={{ color: '#6b7280', fontSize: '0.75rem' }}>
                                  {sale.customerEmail}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-3" style={{ verticalAlign: 'middle' }}>
                            <span style={{ color: '#374151', fontSize: '0.875rem' }}>
                              {sale.inventoryId?.name || 'N/A'}
                            </span>
                            {sale.inventoryId?.sku && (
                              <div style={{ color: '#6b7280', fontSize: '0.75rem' }}>
                                SKU: {sale.inventoryId.sku}
                              </div>
                            )}
                          </td>
                          <td className="py-3 px-3" style={{ verticalAlign: 'middle', color: '#374151', fontSize: '0.875rem' }}>
                            {sale.quantitySold}
                          </td>
                          <td className="py-3 px-3" style={{ verticalAlign: 'middle', color: '#374151', fontSize: '0.875rem' }}>
                            ₹{sale.unitPrice}
                          </td>
                          <td className="py-3 px-3" style={{ verticalAlign: 'middle', color: '#4f46e5', fontSize: '0.875rem', fontWeight: '600' }}>
                            ₹{sale.totalAmount}
                          </td>
                          <td className="py-3 px-3" style={{ verticalAlign: 'middle' }}>
                            <span className={`badge ${sale.paymentMethod === 'cash' ? 'bg-success' : sale.paymentMethod === 'online' ? 'bg-primary' : 'bg-info'}`} style={{ fontSize: '0.75rem' }}>
                              {sale.paymentMethod}
                            </span>
                          </td>
                          <td className="py-3 px-3" style={{ verticalAlign: 'middle', color: '#6b7280', fontSize: '0.875rem' }}>
                            {new Date(sale.saleDate).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-3" style={{ verticalAlign: 'middle' }}>
                            <span 
                              className={`badge ${sale.status === 'active' ? 'bg-success' : sale.status === 'cancelled' ? 'bg-danger' : 'bg-warning'}`}
                              style={{ fontSize: '0.75rem' }}
                            >
                              {sale.status}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-end" style={{ verticalAlign: 'middle' }}>
                            <div className="d-flex gap-1 justify-content-end">
                              <button 
                                className="btn btn-sm btn-outline-primary d-flex align-items-center justify-content-center" 
                                onClick={() => openViewModal(sale)}
                                style={{ borderRadius: '6px', padding: '8px' }}
                              >
                                <FaEye size={12} />
                              </button>
                              <button 
                                className="btn btn-sm btn-outline-secondary d-flex align-items-center justify-content-center" 
                                onClick={() => openEditModal(sale)}
                                style={{ borderRadius: '6px', padding: '8px' }}
                              >
                                <FaEdit size={12} />
                              </button>
                              <button 
                                className="btn btn-sm btn-outline-danger d-flex align-items-center justify-content-center" 
                                onClick={() => handleDelete(sale)}
                                style={{ borderRadius: '6px', padding: '8px' }}
                              >
                                <FaTrash size={12} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Pagination */}
              {sales.length > itemsPerPage && (
                <div className="d-flex justify-content-center align-items-center py-4" style={{ borderTop: '1px solid #f3f4f6' }}>
                  <button 
                    className="btn btn-outline-primary me-2" 
                    onClick={() => setCurrentPages(prev => Math.max(prev - 1, 1))} 
                    disabled={currentPage === 1}
                    style={{ 
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      borderColor: '#4f46e5',
                      color: '#4f46e5'
                    }}
                  >
                    Previous
                  </button>
                  <span className="fw-medium mx-3" style={{ color: '#374151', fontSize: '0.875rem' }}>
                    Page {currentPage} of {totalPages}
                  </span>
                  <button 
                    className="btn btn-outline-primary ms-2" 
                    onClick={() => setCurrentPages(prev => Math.min(prev + 1, totalPages))} 
                    disabled={currentPage === totalPages}
                    style={{ 
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      borderColor: '#4f46e5',
                      color: '#4f46e5'
                    }}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modals */}
      <CreateSaleModal 
        show={showCreateModal}
        onHide={() => setShowCreateModal(false)}
        formData={formData}
        handleInputChange={handleInputChange}
        handleCreate={handleCreate}
        inventories={inventories}
      />

      <EditSaleModal 
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        formData={formData}
        handleInputChange={handleInputChange}
        handleUpdate={handleUpdate}
        inventories={inventories}
      />

      <ViewSaleModal 
        show={showViewModal}
        onHide={() => setShowViewModal(false)}
        selectedSale={selectedSale}
      />
    </div>
  );
};

export default Sales;
