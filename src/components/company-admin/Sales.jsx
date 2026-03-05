import { useEffect, useState } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';
import Swal from 'sweetalert2';
import { BaseUrl } from "../service/Uri";
import { FaShoppingCart, FaDownload, FaEdit, FaEye, FaTrash, FaPlus, FaSearch, FaFilter, FaRupeeSign, FaUser, FaCalendarAlt } from 'react-icons/fa';
import CommonHeader from './CommonHeader';
import { CreateSaleModal, EditSaleModal, ViewSaleModal } from './SalesModals';
import './CompanySales.css';

const Sales = ({ toggleSidebar, setCurrentPage, isOpen }) => {
  const [sales, setSales] = useState([]);
  const [inventories, setInventories] = useState([]);
  const [stats, setStats] = useState({ 
    totalSales: 0, 
    monthlySales: 0, 
    totalRevenue: 0, 
    monthlyRevenue: 0,
    paymentBreakdown: [],
    topProducts: []
  });
  const [loading, setLoading] = useState(true);
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

  const [searchTerm, setSearchTerm] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filterParams, setFilterParams] = useState({});

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 992);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchSales = async (params = {}, append = false) => {
    try {
      const token = localStorage.getItem('companyToken');
      const query = new URLSearchParams(params).toString();
      const url = `${BaseUrl}/sales/company-sales${query ? '?' + query : ''}`;
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.status === 200) {
        const newData = res.data.data.sales;
        if (append) {
          setSales(prev => [...prev, ...newData]);
        } else {
          setSales(newData);
        }
        setHasMore(newData.length === 10);
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

  const fetchStats = async (params = {}) => {
    try {
      const token = localStorage.getItem('companyToken');
      const query = new URLSearchParams(params).toString();
      const url = `${BaseUrl}/sales/dashboard/sales/${company._id}${query ? '?' + query : ''}`;
      const res = await axios.get(url, {
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
    const initialParams = { page: 1, limit: 10 };
    fetchSales(initialParams);
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

      const res = await axios.post(`${BaseUrl}/sales/create/${company._id}`, data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.data.data !== null) {
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
      setPage(1);
      setHasMore(true);
      fetchSales({ ...filterParams, page: 1, limit: 10 });
      fetchStats(filterParams);
      Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: 'Sale created successfully!',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
              });
      } else {
      Swal.fire({
                toast: true,
                position: 'top-end', // top-right corner
                icon: 'error',
                title: res.data.message || 'Failed to create sale.',
                showConfirmButton: false,
                timer: 4000, // auto close after 3 seconds
                timerProgressBar: true,
              });
      }
    } catch (error) {
      console.error("Error creating sale:", error);
     Swal.fire({
                toast: true,
                position: 'top-end', // top-right corner
                icon: 'error',
                title: 'Failed to create sale.',
                showConfirmButton: false,
                timer: 4000, // auto close after 3 seconds
                timerProgressBar: true,
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

      const res = await axios.put(`${BaseUrl}/sales/update/${selectedSale._id}`, data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.data.data !== null) {
      setShowEditModal(false);
      setPage(1);
      setHasMore(true);
      fetchSales({ ...filterParams, page: 1, limit: 10 });
      fetchStats(filterParams);
      Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: 'Sale updated successfully!',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
              });
      } else {
      Swal.fire({
                toast: true,
                position: 'top-end', // top-right corner
                icon: 'error',
                title: res.data.message || 'Failed to update sale.',
                showConfirmButton: false,
                timer: 4000, // auto close after 3 seconds
                timerProgressBar: true,
              });
      }
    } catch (error) {
      console.error("Error updating sale:", error);
      Swal.fire({
                toast: true,
                position: 'top-end', // top-right corner
                icon: 'error',
                title: 'Failed to update sale.',
                showConfirmButton: false,
                timer: 4000, // auto close after 3 seconds
                timerProgressBar: true,
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
          const res = await axios.delete(`${BaseUrl}/sales/delete/${sale._id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setPage(1);
          setHasMore(true);
          fetchSales({ ...filterParams, page: 1, limit: 10 });
          fetchStats(filterParams);
          Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title:  `Sale for ${sale.customerName} has been cancelled.`,
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
              });
        } catch (error) {
          console.error("Error cancelling sale:", error);
          Swal.fire({
                toast: true,
                position: 'top-end', // top-right corner
                icon: 'error',
                title: 'Failed to cancel sale.',
                showConfirmButton: false,
                timer: 3000, // auto close after 3 seconds
                timerProgressBar: true,
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

  const handleFilterTypeChange = (e) => {
    const type = e.target.value;
    setFilterType(type);
    const now = new Date();
    if (type === 'month') {
      setFromDate(new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]);
      setToDate(new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0]);
    } else if (type === 'year') {
      setFromDate(new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0]);
      setToDate(new Date(now.getFullYear(), 11, 31).toISOString().split('T')[0]);
    } else if (type === 'all') {
      setFromDate('');
      setToDate('');
    }
  };

  const applyFilters = () => {
    const params = {};
    if (searchTerm) params.customerName = searchTerm;
    if (fromDate) params.startDate = fromDate;
    if (toDate) params.endDate = toDate;
    setFilterParams(params);
    setPage(1);
    setHasMore(true);
    fetchSales({ ...params, page: 1, limit: 10 });
    fetchStats(params);
  };

  const clearFilters = () => {
    setFilterType('all');
    setSearchTerm('');
    setFromDate('');
    setToDate('');
    setFilterParams({});
    setPage(1);
    setHasMore(true);
    fetchSales({ page: 1, limit: 10 });
    fetchStats();
  };

  const handleShowMore = () => {
    const newPage = page + 1;
    setPage(newPage);
    fetchSales({ ...filterParams, page: newPage, limit: 10 }, true);
  };

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
    <div className="container-fluid p-0">
      <CommonHeader title="Sales" company={company} toggleSidebar={toggleSidebar} setCurrentPage={setCurrentPage} />
      <div className="company-sales">
        {/* Header Section */}
        <div className="company-sales-header">
          <div className="company-sales-header-top">
            <div className="company-sales-title-section">
              <h2 className="company-sales-title">
                <FaShoppingCart className="company-sales-title-icon" />
                Sales Management
              </h2>
              <p className="company-sales-subtitle">Track your product sales and customer transactions</p>
            </div>
            <div className="company-sales-header-actions">
              <button 
                className="company-sales-button company-sales-button-primary" 
                onClick={openCreateModal}
              >
                <FaPlus size={14} />
                New Sale
              </button>
              <button 
                className="company-sales-button company-sales-button-secondary" 
                onClick={downloadCSV}
              >
                <FaDownload size={14} />
                Export
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="company-sales-stats">
            <div className="company-sales-stat-card">
              <div className="company-sales-stat-header">
                <span className="company-sales-stat-badge">Total</span>
              </div>
              <div className="company-sales-stat-value">{stats.totalSales}</div>
              <p className="company-sales-stat-label">Sales</p>
            </div>
            <div className="company-sales-stat-card">
              <div className="company-sales-stat-header">
                <span className="company-sales-stat-badge">{fromDate && toDate ? 'Period' : 'Monthly'}</span>
              </div>
              <div className="company-sales-stat-value">{stats.monthlySales}</div>
              <p className="company-sales-stat-label">This Month</p>
            </div>
            <div className="company-sales-stat-card">
              <div className="company-sales-stat-header">
                <span className="company-sales-stat-badge">Revenue</span>
              </div>
              <div className="company-sales-stat-value">₹{stats.totalRevenue.toFixed(2)}</div>
              <p className="company-sales-stat-label">Total</p>
            </div>
            <div className="company-sales-stat-card">
              <div className="company-sales-stat-header">
                <span className="company-sales-stat-badge">{fromDate && toDate ? 'Period' : 'Monthly'}</span>
              </div>
              <div className="company-sales-stat-value">₹{stats.monthlyRevenue.toFixed(2)}</div>
              <p className="company-sales-stat-label">This Month</p>
            </div>
          </div>

          {/* Filter Section */}
          <div className="company-sales-filters">
            <div className="company-sales-filter-group">
              <select 
                className="company-sales-filter-input" 
                value={filterType} 
                onChange={handleFilterTypeChange}
              >
                <option value="all">All Time</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
                <option value="custom">Custom</option>
              </select>
            </div>
            {filterType === 'custom' && (
              <>
                <div className="company-sales-filter-group">
                  <input 
                    type="date" 
                    className="company-sales-filter-input" 
                    value={fromDate} 
                    onChange={(e) => setFromDate(e.target.value)}
                  />
                </div>
                <div className="company-sales-filter-group">
                  <input 
                    type="date" 
                    className="company-sales-filter-input" 
                    value={toDate} 
                    onChange={(e) => setToDate(e.target.value)}
                  />
                </div>
              </>
            )}
            <div className="company-sales-filter-group">
              <input 
                type="text" 
                className="company-sales-filter-input" 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by customer name"
              />
            </div>
            <div className="company-sales-filter-actions">
              <button 
                className="company-sales-filter-button company-sales-filter-button-primary" 
                onClick={applyFilters}
              >
                <FaFilter size={14} />
                Apply
              </button>
              <button 
                className="company-sales-filter-button company-sales-filter-button-secondary" 
                onClick={clearFilters}
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Sales List */}
        <div className="company-sales-table-container">
          {loading ? (
            <div className="company-sales-loading">
              <div className="company-sales-spinner"></div>
              <p className="company-sales-loading-text">Loading sales...</p>
            </div>
          ) : sales.length === 0 ? (
            <div className="company-sales-no-data">
              <div className="company-sales-no-data-icon">
                <FaShoppingCart />
              </div>
              <div className="company-sales-no-data-title">No sales found</div>
              <p className="company-sales-no-data-text">Start by creating your first sale</p>
              <button 
                className="company-sales-no-data-button" 
                onClick={openCreateModal}
              >
                <FaPlus size={14} />
                Create First Sale
              </button>
            </div>
          ) : (
            <>
              {/* Mobile Card View */}
              <div className="company-sales-cards">
                {sales.map((sale, index) => {
                  const getPaymentStatusClass = () => {
                    if (sale.paymentStatus === 'completed') return 'company-sales-table-status-success';
                    if (sale.paymentStatus === 'pending') return 'company-sales-table-status-warning';
                    return 'company-sales-table-status-danger';
                  };

                  const getPaymentMethodClass = () => {
                    if (sale.paymentMethod === 'cash') return 'company-sales-table-status-success';
                    if (sale.paymentMethod === 'online') return 'company-sales-table-status-primary';
                    return 'company-sales-table-status-info';
                  };

                  return (
                    <div key={index} className="company-sales-card">
                      <div className="company-sales-card-header">
                        <h6 className="company-sales-card-customer-name">{sale.customerName}</h6>
                        <p className="company-sales-card-product">{sale.inventoryId?.name || 'Product N/A'}</p>
                        <div className="company-sales-card-details">
                          <span className="company-sales-card-quantity">Qty: {sale.quantitySold}</span>
                          <span className="company-sales-card-amount">₹{sale.totalAmount}</span>
                        </div>
                      </div>
                      <div className="company-sales-card-fields">
                        <div className="company-sales-card-field">
                          <div className="company-sales-card-field-label">Payment</div>
                          <span className={`company-sales-card-field-value ${getPaymentMethodClass()}`}>
                            {sale.paymentMethod}
                          </span>
                        </div>
                        <div className="company-sales-card-field">
                          <div className="company-sales-card-field-label">Date</div>
                          <div className="company-sales-card-field-value">{new Date(sale.saleDate).toLocaleDateString()}</div>
                        </div>
                      </div>
                      <div className="company-sales-card-footer">
                        <span className={`company-sales-card-status ${getPaymentStatusClass()}`}>
                          {sale.paymentStatus}
                        </span>
                        <div className="company-sales-card-actions">
                          <button 
                            className="company-sales-card-action-button company-sales-card-action-button-primary" 
                            onClick={() => openViewModal(sale)}
                            title="View"
                          >
                            <FaEye size={12} />
                          </button>
                          <button 
                            className="company-sales-card-action-button company-sales-card-action-button-secondary" 
                            onClick={() => openEditModal(sale)}
                            title="Edit"
                          >
                            <FaEdit size={12} />
                          </button>
                          <button 
                            className="company-sales-card-action-button company-sales-card-action-button-danger" 
                            onClick={() => handleDelete(sale)}
                            title="Delete"
                          >
                            <FaTrash size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Desktop Table View */}
              <div className="company-sales-table-wrapper">
                <table className="company-sales-table">
                  <thead>
                    <tr>
                      <th>Customer</th>
                      <th>Product</th>
                      <th>Quantity</th>
                      <th>Unit Price</th>
                      <th>Total</th>
                      <th>Payment</th>
                      <th>Date</th>
                      <th>Payment Status</th>
                      <th className="text-end" style={{ minWidth: "150px" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sales.map((sale, index) => {
                      const getPaymentStatusClass = () => {
                        if (sale.paymentStatus === 'completed') return 'company-sales-table-status-success';
                        if (sale.paymentStatus === 'pending') return 'company-sales-table-status-warning';
                        return 'company-sales-table-status-danger';
                      };

                      const getPaymentMethodClass = () => {
                        if (sale.paymentMethod === 'cash') return 'company-sales-table-status-success';
                        if (sale.paymentMethod === 'online') return 'company-sales-table-status-primary';
                        return 'company-sales-table-status-info';
                      };

                      return (
                        <tr key={index}>
                          <td>
                            <div className="company-sales-table-customer">
                              <span className="company-sales-table-customer-name">{sale.customerName}</span>
                              {sale.customerEmail && (
                                <span className="company-sales-table-customer-email">{sale.customerEmail}</span>
                              )}
                            </div>
                          </td>
                          <td>
                            <div className="company-sales-table-product">
                              <span className="company-sales-table-product-name">{sale.inventoryId?.name || 'N/A'}</span>
                              {sale.inventoryId?.sku && (
                                <span className="company-sales-table-product-sku">SKU: {sale.inventoryId.sku}</span>
                              )}
                            </div>
                          </td>
                          <td>{sale.quantitySold}</td>
                          <td>₹{sale.unitPrice}</td>
                          <td>
                            <span className="company-sales-table-amount">₹{sale.totalAmount}</span>
                          </td>
                          <td>
                            <span className={`company-sales-table-status ${getPaymentMethodClass()}`}>
                              {sale.paymentMethod}
                            </span>
                          </td>
                          <td>{new Date(sale.saleDate).toLocaleDateString()}</td>
                          <td>
                            <span className={`company-sales-table-status ${getPaymentStatusClass()}`}>
                              {sale.paymentStatus}
                            </span>
                          </td>
                          <td className="text-end">
                            <div className="company-sales-table-actions">
                              <button 
                                className="company-sales-table-action-button company-sales-table-action-button-primary" 
                                onClick={() => openViewModal(sale)}
                                title="View"
                              >
                                <FaEye size={12} />
                              </button>
                              <button 
                                className="company-sales-table-action-button company-sales-table-action-button-secondary" 
                                onClick={() => openEditModal(sale)}
                                title="Edit"
                              >
                                <FaEdit size={12} />
                              </button>
                              <button 
                                className="company-sales-table-action-button company-sales-table-action-button-danger" 
                                onClick={() => handleDelete(sale)}
                                title="Delete"
                              >
                                <FaTrash size={12} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Show More */}
              {hasMore && (
                <div className="company-sales-show-more">
                  <button 
                    className="company-sales-show-more-button" 
                    onClick={handleShowMore}
                  >
                    Show More
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