import { useEffect, useState } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';
import Swal from 'sweetalert2';
import { BaseUrl } from "../service/Uri";
import { FaBox, FaDownload, FaEdit, FaEye, FaTrash, FaPlus, FaSearch, FaFilter } from 'react-icons/fa';
import CommonHeader from './CommonHeader';

const Inventorys = ({ toggleSidebar, setCurrentPage, isOpen }) => {
  const [inventories, setInventories] = useState([]);
  const [stats, setStats] = useState({ totalItems: 0, monthlyItems: 0, totalValue: 0, lowStock: 0 });
  const [loading, setLoading] = useState(true);
  const company = JSON.parse(localStorage.getItem('company'));
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    sku: '',
    quantity: 0,
    price: 0,
    category: '',
    supplier: '',
    image: null
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

  const fetchInventories = async (params = {}, append = false) => {
    try {
      const token = localStorage.getItem('companyToken');
      const query = new URLSearchParams(params).toString();
      const url = `${BaseUrl}/inventory/company-inventory${query ? '?' + query : ''}`;
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.status === 200) {
        const newData = res.data.data;
        if (append) {
          setInventories(prev => [...prev, ...newData]);
        } else {
          setInventories(newData);
        }
        setHasMore(newData.length === 10);
      } else {
        console.error("Failed to fetch inventories:", res.data.message);
      }
    } catch (error) {
      console.error("Error fetching inventories:", error);
    }
  };

  const fetchStats = async (params = {}) => {
    try {
      const token = localStorage.getItem('companyToken');
      const query = new URLSearchParams(params).toString();
      const url = `${BaseUrl}/inventory/dashboard/inventory/${company._id}${query ? '?' + query : ''}`;
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.status === true) {
        setStats(res.data.data);
      } else {
        console.error("Failed to fetch inventory stats:", res.data.message);
      }
    } catch (error) {
      console.error("Error fetching inventory stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initialParams = { page: 1, limit: 10 };
    fetchInventories(initialParams);
    fetchStats();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleCreate = async () => {
    try {
      const token = localStorage.getItem('companyToken');
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (key !== 'image') data.append(key, formData[key]);
      });
      if (formData.image) data.append('image', formData.image);

      await axios.post(`${BaseUrl}/inventory/create/${company._id}`, data, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      setShowCreateModal(false);
      setFormData({
        name: '',
        description: '',
        sku: '',
        quantity: 0,
        price: 0,
        category: '',
        supplier: '',
        image: null
      });
      setPage(1);
      setHasMore(true);
      fetchInventories({ ...filterParams, page: 1, limit: 10 });
      fetchStats(filterParams);
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Inventory item created successfully!',
      });
    } catch (error) {
      console.error("Error creating inventory:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to create inventory item.',
      });
    }
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('companyToken');
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (key !== 'image' && formData[key] !== undefined) data.append(key, formData[key]);
      });
      if (formData.image) data.append('image', formData.image);

      await axios.put(`${BaseUrl}/inventory/update/${selectedItem._id}`, data, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      setShowEditModal(false);
      setPage(1);
      setHasMore(true);
      fetchInventories({ ...filterParams, page: 1, limit: 10 });
      fetchStats(filterParams);
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Inventory item updated successfully!',
      });
    } catch (error) {
      console.error("Error updating inventory:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update inventory item.',
      });
    }
  };

  const handleDelete = async (item) => {
    Swal.fire({
      title: `Are you sure you want to delete ${item.name}?`,
      text: "This action cannot be undone!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem('companyToken');
          await axios.delete(`${BaseUrl}/inventory/delete/${item._id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setPage(1);
          setHasMore(true);
          fetchInventories({ ...filterParams, page: 1, limit: 10 });
          fetchStats(filterParams);
          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: `${item.name} has been deleted.`,
          });
        } catch (error) {
          console.error("Error deleting inventory:", error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to delete inventory item.',
          });
        }
      }
    });
  };

  const openEditModal = (item) => {
    setSelectedItem(item);
    setFormData({
      name: item.name,
      description: item.description || '',
      sku: item.sku,
      quantity: item.quantity,
      price: item.price,
      category: item.category || '',
      supplier: item.supplier || '',
      image: null
    });
    setShowEditModal(true);
  };

  const openViewModal = (item) => {
    setSelectedItem(item);
    setShowViewModal(true);
  };

  const openCreateModal = () => {
    setFormData({
      name: '',
      description: '',
      sku: '',
      quantity: 0,
      price: 0,
      category: '',
      supplier: '',
      image: null
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
    if (searchTerm) params.search = searchTerm;
    if (fromDate) params.fromDate = fromDate;
    if (toDate) params.toDate = toDate;
    setFilterParams(params);
    setPage(1);
    setHasMore(true);
    fetchInventories({ ...params, page: 1, limit: 10 });
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
    fetchInventories({ page: 1, limit: 10 });
    fetchStats();
  };

  const handleShowMore = () => {
    const newPage = page + 1;
    setPage(newPage);
    fetchInventories({ ...filterParams, page: newPage, limit: 10 }, true);
  };

  const currentInventories = inventories;

  const columns = [
    { key: 'image', label: 'Image' },
    { key: 'name', label: 'Name' },
    { key: 'sku', label: 'SKU' },
    { key: 'quantity', label: 'Quantity' },
    { key: 'price', label: 'Price' },
    { key: 'category', label: 'Category' },
    { key: 'supplier', label: 'Supplier' },
    { key: 'status', label: 'Status' }
  ];

  const downloadCSV = () => {
    const headers = [...columns.map(col => col.label), 'Date', 'Time'];
    const rows = inventories.map(i => [
      i.image ? 'Yes' : 'No',
      i.name,
      i.sku,
      i.quantity,
      i.price,
      i.category || '',
      i.supplier || '',
      i.status,
      new Date(i.createdAt).toLocaleDateString(),
      new Date(i.createdAt).toLocaleTimeString()
    ]);
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "inventories.csv");
  };

  return (
    <div className="container-fluid p-0" style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <CommonHeader title="Inventorys" company={company} toggleSidebar={toggleSidebar} setCurrentPage={setCurrentPage} />

      {/* Header Section */}
      <div className="pt-4">
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mb-4">
          <div className="mb-3 mb-sm-0">
            <h2 className="fw-bold text-dark mb-1" style={{ fontSize: '1.75rem' }}>
              <FaBox className="me-2" style={{ color: '#4f46e5' }} />
              Inventory
            </h2>
            <p className="text-muted mb-0" style={{ fontSize: '0.95rem' }}>
              Manage your products and stock levels
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
              Add Item
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
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.2s ease'
            }}>
              <div className="card-body p-3">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <div className="p-2 rounded-circle" style={{ backgroundColor: '#eff6ff' }}>
                    <FaBox size={16} style={{ color: '#3b82f6' }} />
                  </div>
                  <span className="badge bg-light text-muted" style={{ fontSize: '0.75rem' }}>Total</span>
                </div>
                <h3 className="fw-bold mb-1" style={{ fontSize: '1.5rem', color: '#1f2937' }}>{stats.totalItems}</h3>
                <p className="text-muted mb-0" style={{ fontSize: '0.875rem' }}>Items</p>
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
                    <FaPlus size={16} style={{ color: '#22c55e' }} />
                  </div>
                  <span className="badge bg-light text-muted" style={{ fontSize: '0.75rem' }}>{fromDate && toDate ? 'Period' : 'Monthly'}</span>
                </div>
                <h3 className="fw-bold mb-1" style={{ fontSize: '1.5rem', color: '#1f2937' }}>{stats.monthlyItems}</h3>
                <p className="text-muted mb-0" style={{ fontSize: '0.875rem' }}>Added</p>
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
                    <span style={{ color: '#eab308', fontSize: '16px', fontWeight: 'bold' }}>₹</span>
                  </div>
                  <span className="badge bg-light text-muted" style={{ fontSize: '0.75rem' }}>Value</span>
                </div>
                <h3 className="fw-bold mb-1" style={{ fontSize: '1.5rem', color: '#1f2937' }}>₹{stats.totalValue.toFixed(2)}</h3>
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
                    <span style={{ color: '#ef4444', fontSize: '16px' }}>⚠</span>
                  </div>
                  <span className="badge bg-light text-muted" style={{ fontSize: '0.75rem' }}>Alert</span>
                </div>
                <h3 className="fw-bold mb-1" style={{ fontSize: '1.5rem', color: '#1f2937' }}>{stats.lowStock}</h3>
                <p className="text-muted mb-0" style={{ fontSize: '0.875rem' }}>Low Stock</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="row g-3 mb-4">
          <div className="col-md-3 col-sm-6">
            <select 
              className="form-select" 
              value={filterType} 
              onChange={handleFilterTypeChange}
              style={{ borderRadius: '10px', fontSize: '0.875rem' }}
            >
              <option value="all">All Time</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
              <option value="custom">Custom</option>
            </select>
          </div>
          {filterType === 'custom' && (
            <>
              <div className="col-md-3 col-sm-6">
                <input 
                  type="date" 
                  className="form-control" 
                  value={fromDate} 
                  onChange={(e) => setFromDate(e.target.value)}
                  style={{ borderRadius: '10px', fontSize: '0.875rem' }}
                />
              </div>
              <div className="col-md-3 col-sm-6">
                <input 
                  type="date" 
                  className="form-control" 
                  value={toDate} 
                  onChange={(e) => setToDate(e.target.value)}
                  style={{ borderRadius: '10px', fontSize: '0.875rem' }}
                />
              </div>
            </>
          )}
          <div className="col-md-3 col-sm-6">
            <input 
              type="text" 
              className="form-control" 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name"
              style={{ borderRadius: '10px', fontSize: '0.875rem' }}
            />
          </div>
          <div className="col-md-3 col-sm-12 d-flex gap-2">
            <button 
              className="btn btn-primary flex-grow-1" 
              onClick={applyFilters}
              style={{ borderRadius: '10px', fontSize: '0.875rem' }}
            >
              <FaFilter className="me-2" size={14} />
              Apply
            </button>
            <button 
              className="btn btn-outline-secondary flex-grow-1" 
              onClick={clearFilters}
              style={{ borderRadius: '10px', fontSize: '0.875rem', borderColor: '#4f46e5', color: '#4f46e5' }}
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Inventory List */}
      <div className=" pb-4">
        <div className="card border-0" style={{ 
          borderRadius: '12px', 
          backgroundColor: 'white',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border" style={{ color: '#4f46e5' }} role="status"></div>
              <p className="mt-3 text-muted">Loading inventories...</p>
            </div>
          ) : inventories.length === 0 ? (
            <div className="text-center py-5">
              <div className="mb-3 p-4 rounded-circle mx-auto" style={{ 
                backgroundColor: '#f8fafc', 
                width: 'fit-content' 
              }}>
                <FaBox size={48} className="text-muted" />
              </div>
              <h5 className="text-muted mb-2">No inventory items found</h5>
              <p className="text-muted mb-3">Start by adding your first inventory item</p>
              <button 
                className="btn btn-primary px-4 py-2" 
                onClick={openCreateModal}
                style={{ borderRadius: '10px', backgroundColor: '#4f46e5', border: 'none' }}
              >
                <FaPlus className="me-2" size={14} />
                Add First Item
              </button>
            </div>
          ) : (
            <>
              {/* Mobile View */}
              {isMobile ? (
                <div className="">
                  {currentInventories.map((i, index) => (
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
                          {i.image ? (
                            <img 
                              src={`${BaseUrl}/${i.image}`} 
                              alt="Product" 
                              style={{ 
                                width: "60px", 
                                height: "60px", 
                                objectFit: "cover", 
                                borderRadius: "8px",
                                marginRight: "12px"
                              }} 
                            />
                          ) : (
                            <div 
                              className="d-flex align-items-center justify-content-center" 
                              style={{ 
                                width: "60px",
                                height: "60px", 
                                borderRadius: "8px", 
                                marginRight: "12px",
                                backgroundColor: '#e5e7eb'
                              }}
                            >
                              <FaBox size={20} className="text-muted" />
                            </div>
                          )}
                          <div className="flex-grow-1">
                            <h6 className="fw-bold mb-1" style={{ fontSize: '1rem', color: '#1f2937' }}>
                              {i.name || '—'}
                            </h6>
                            <p className="text-muted mb-1" style={{ fontSize: '0.875rem' }}>
                              SKU: {i.sku || '—'}
                            </p>
                            <div className="d-flex justify-content-between align-items-center">
                              <span className="text-muted" style={{ fontSize: '0.875rem' }}>
                                Qty: {i.quantity || '—'}
                              </span>
                              <span className="fw-medium" style={{ fontSize: '0.875rem', color: '#4f46e5' }}>
                                ₹{i.price || '—'}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="row g-2 mb-3">
                          <div className="col-6">
                            <div className="p-2 rounded" style={{ backgroundColor: 'white' }}>
                              <small className="text-muted d-block">Category</small>
                              <span style={{ fontSize: '0.875rem' }}>{i.category || '—'}</span>
                            </div>
                          </div>
                          <div className="col-6">
                            <div className="p-2 rounded" style={{ backgroundColor: 'white' }}>
                              <small className="text-muted d-block">Supplier</small>
                              <span style={{ fontSize: '0.875rem' }}>{i.supplier || '—'}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="d-flex justify-content-between align-items-center">
                          <span 
                            className={`badge ${i.quantity > 10 ? 'bg-success' : i.quantity > 0 ? 'bg-warning' : 'bg-danger'}`}
                            style={{ fontSize: '0.75rem' }}
                          >
                            {i.status || 'Active'}
                          </span>
                          <div className="d-flex gap-1">
                            <button 
                              className="btn btn-sm btn-outline-primary d-flex align-items-center justify-content-center" 
                              onClick={() => openViewModal(i)}
                              style={{ borderRadius: '6px', padding: '8px' }}
                            >
                              <FaEye size={12} />
                            </button>
                            <button 
                              className="btn btn-sm btn-outline-secondary d-flex align-items-center justify-content-center" 
                              onClick={() => openEditModal(i)}
                              style={{ borderRadius: '6px', padding: '8px' }}
                            >
                              <FaEdit size={12} />
                            </button>
                            <button 
                              className="btn btn-sm btn-outline-danger d-flex align-items-center justify-content-center" 
                              onClick={() => handleDelete(i)}
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
                        {columns.map((col, i) => (
                          <th 
                            key={i} 
                            className="fw-semibold px-3 py-3" 
                            style={{ 
                              textAlign: col.key === 'image' ? 'center' : 'left',
                              color: '#374151',
                              fontSize: '0.875rem',
                              borderBottom: '1px solid #e5e7eb'
                            }}
                          >
                            {col.label}
                          </th>
                        ))}
                        <th className="fw-semibold px-3 py-3" style={{ color: '#374151', fontSize: '0.875rem' }}>Created At</th>
                        <th className="fw-semibold px-3 py-3 text-end" style={{ minWidth: "150px", color: '#374151', fontSize: '0.875rem' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentInventories.map((i, index) => (
                        <tr key={index} style={{ borderBottom: '1px solid #f3f4f6' }}>
                          {columns.map((col, idx) => (
                            <td key={idx} className="py-3 px-3" style={{ textAlign: col.key === 'image' ? 'center' : 'left', verticalAlign: 'middle' }}>
                              {col.key === 'image' ? (
                                i.image ? (
                                  <img 
                                    src={`${BaseUrl}/${i.image}`} 
                                    alt="Product" 
                                    style={{ 
                                      width: "50px", 
                                      height: "50px", 
                                      objectFit: "cover", 
                                      borderRadius: "8px"
                                    }} 
                                  />
                                ) : (
                                  <div 
                                    className="d-flex align-items-center justify-content-center mx-auto" 
                                    style={{ 
                                      width: "50px", 
                                      height: "50px", 
                                      borderRadius: "8px",
                                      backgroundColor: '#f3f4f6'
                                    }}
                                  >
                                    <FaBox size={16} className="text-muted" />
                                  </div>
                                )
                              ) : (
                                <span style={{ color: '#374151', fontSize: '0.875rem' }}>
                                  {i[col.key] || <span className="text-muted">—</span>}
                                </span>
                              )}
                            </td>
                          ))}
                          <td className="py-3 px-3" style={{ verticalAlign: 'middle', color: '#6b7280', fontSize: '0.875rem' }}>
                            {new Date(i.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-3 text-end" style={{ verticalAlign: 'middle' }}>
                            <div className="d-flex gap-1 justify-content-end">
                              <button 
                                className="btn btn-sm btn-outline-primary d-flex align-items-center justify-content-center" 
                                onClick={() => openViewModal(i)}
                                style={{ borderRadius: '6px', padding: '8px' }}
                              >
                                <FaEye size={12} />
                              </button>
                              <button 
                                className="btn btn-sm btn-outline-secondary d-flex align-items-center justify-content-center" 
                                onClick={() => openEditModal(i)}
                                style={{ borderRadius: '6px', padding: '8px' }}
                              >
                                <FaEdit size={12} />
                              </button>
                              <button 
                                className="btn btn-sm btn-outline-danger d-flex align-items-center justify-content-center" 
                                onClick={() => handleDelete(i)}
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

              {/* Show More */}
              {hasMore && (
                <div className="d-flex justify-content-center align-items-center py-4" style={{ borderTop: '1px solid #f3f4f6' }}>
                  <button 
                    className="btn btn-outline-primary" 
                    onClick={handleShowMore}
                    style={{ 
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      borderColor: '#4f46e5',
                      color: '#4f46e5'
                    }}
                  >
                    Show More
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable" role="document">
            <div className="modal-content" style={{ borderRadius: '12px', border: 'none' }}>
              <div className="modal-header" style={{ borderBottom: '1px solid #e5e7eb' }}>
                <h5 className="modal-title fw-bold" style={{ color: '#1f2937' }}>Add New Item</h5>
                <button type="button" className="btn-close" onClick={() => setShowCreateModal(false)}></button>
              </div>
              <div className="modal-body" style={{ padding: '1.5rem' }}>
                <form>
                  <div className="mb-3">
                    <label className="form-label fw-medium" style={{ color: '#374151', fontSize: '0.875rem' }}>Name</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      name="name" 
                      value={formData.name} 
                      onChange={handleInputChange}
                      style={{ borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.875rem' }}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-medium" style={{ color: '#374151', fontSize: '0.875rem' }}>Description</label>
                    <textarea 
                      className="form-control" 
                      name="description" 
                      value={formData.description} 
                      onChange={handleInputChange}
                      rows="3"
                      style={{ borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.875rem' }}
                    ></textarea>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-medium" style={{ color: '#374151', fontSize: '0.875rem' }}>SKU</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        name="sku" 
                        value={formData.sku} 
                        onChange={handleInputChange}
                        style={{ borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.875rem' }}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-medium" style={{ color: '#374151', fontSize: '0.875rem' }}>Quantity</label>
                      <input 
                        type="number" 
                        className="form-control" 
                        name="quantity" 
                        value={formData.quantity} 
                        onChange={handleInputChange}
                        style={{ borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.875rem' }}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-medium" style={{ color: '#374151', fontSize: '0.875rem' }}>Price</label>
                      <input 
                        type="number" 
                        className="form-control" 
                        name="price" 
                        value={formData.price} 
                        onChange={handleInputChange}
                        style={{ borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.875rem' }}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-medium" style={{ color: '#374151', fontSize: '0.875rem' }}>Category</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        name="category" 
                        value={formData.category} 
                        onChange={handleInputChange}
                        style={{ borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.875rem' }}
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-medium" style={{ color: '#374151', fontSize: '0.875rem' }}>Supplier</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      name="supplier" 
                      value={formData.supplier} 
                      onChange={handleInputChange}
                      style={{ borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.875rem' }}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-medium" style={{ color: '#374151', fontSize: '0.875rem' }}>Product Image</label>
                    <input 
                      type="file" 
                      className="form-control" 
                      onChange={handleFileChange}
                      accept="image/*"
                      style={{ borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.875rem' }}
                    />
                  </div>
                </form>
              </div>
              <div className="modal-footer" style={{ borderTop: '1px solid #e5e7eb', padding: '1rem 1.5rem' }}>
                <button 
                  type="button" 
                  className="btn btn-outline-secondary me-2" 
                  onClick={() => setShowCreateModal(false)}
                  style={{ borderRadius: '8px', fontSize: '0.875rem' }}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary" 
                  onClick={handleCreate}
                  style={{ borderRadius: '8px', backgroundColor: '#4f46e5', border: 'none', fontSize: '0.875rem' }}
                >
                  Create Item
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable" role="document">
            <div className="modal-content" style={{ borderRadius: '12px', border: 'none' }}>
              <div className="modal-header" style={{ borderBottom: '1px solid #e5e7eb' }}>
                <h5 className="modal-title fw-bold" style={{ color: '#1f2937' }}>Edit Item</h5>
                <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
              </div>
              <div className="modal-body" style={{ padding: '1.5rem' }}>
                <form>
                  <div className="mb-3">
                    <label className="form-label fw-medium" style={{ color: '#374151', fontSize: '0.875rem' }}>Name</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      name="name" 
                      value={formData.name} 
                      onChange={handleInputChange}
                      style={{ borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.875rem' }}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-medium" style={{ color: '#374151', fontSize: '0.875rem' }}>Description</label>
                    <textarea 
                      className="form-control" 
                      name="description" 
                      value={formData.description} 
                      onChange={handleInputChange}
                      rows="3"
                      style={{ borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.875rem' }}
                    ></textarea>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-medium" style={{ color: '#374151', fontSize: '0.875rem' }}>SKU</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        name="sku" 
                        value={formData.sku} 
                        onChange={handleInputChange}
                        style={{ borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.875rem' }}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-medium" style={{ color: '#374151', fontSize: '0.875rem' }}>Quantity</label>
                      <input 
                        type="number" 
                        className="form-control" 
                        name="quantity" 
                        value={formData.quantity} 
                        onChange={handleInputChange}
                        style={{ borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.875rem' }}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-medium" style={{ color: '#374151', fontSize: '0.875rem' }}>Price</label>
                      <input 
                        type="number" 
                        className="form-control" 
                        name="price" 
                        value={formData.price} 
                        onChange={handleInputChange}
                        style={{ borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.875rem' }}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-medium" style={{ color: '#374151', fontSize: '0.875rem' }}>Category</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        name="category" 
                        value={formData.category} 
                        onChange={handleInputChange}
                        style={{ borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.875rem' }}
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-medium" style={{ color: '#374151', fontSize: '0.875rem' }}>Supplier</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      name="supplier" 
                      value={formData.supplier} 
                      onChange={handleInputChange}
                      style={{ borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.875rem' }}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-medium" style={{ color: '#374151', fontSize: '0.875rem' }}>Update Image</label>
                    <input 
                      type="file" 
                      className="form-control" 
                      onChange={handleFileChange}
                      accept="image/*"
                      style={{ borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.875rem' }}
                    />
                    <small className="text-muted">Leave empty to keep current image</small>
                  </div>
                </form>
              </div>
              <div className="modal-footer" style={{ borderTop: '1px solid #e5e7eb', padding: '1rem 1.5rem' }}>
                <button 
                  type="button" 
                  className="btn btn-outline-secondary me-2" 
                  onClick={() => setShowEditModal(false)}
                  style={{ borderRadius: '8px', fontSize: '0.875rem' }}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary" 
                  onClick={handleUpdate}
                  style={{ borderRadius: '8px', backgroundColor: '#4f46e5', border: 'none', fontSize: '0.875rem' }}
                >
                  Update Item
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && selectedItem && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable" role="document">
            <div className="modal-content" style={{ borderRadius: '12px', border: 'none' }}>
              <div className="modal-header" style={{ borderBottom: '1px solid #e5e7eb' }}>
                <h5 className="modal-title fw-bold" style={{ color: '#1f2937' }}>Item Details</h5>
                <button type="button" className="btn-close" onClick={() => setShowViewModal(false)}></button>
              </div>
              <div className="modal-body" style={{ padding: '1.5rem' }}>
                {selectedItem.image && (
                  <div className="text-center mb-4">
                    <img 
                      src={`${BaseUrl}/${selectedItem.image}`} 
                      alt="Product" 
                      className="img-fluid rounded" 
                      style={{ 
                        maxHeight: "200px", 
                        objectFit: "cover",
                        borderRadius: '10px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                      }} 
                    />
                  </div>
                )}
                
                <div className="row g-3">
                  <div className="col-12">
                    <div className="p-3 rounded" style={{ backgroundColor: '#f8fafc' }}>
                      <h6 className="fw-bold mb-1" style={{ color: '#1f2937', fontSize: '1.1rem' }}>{selectedItem.name}</h6>
                      <p className="text-muted mb-0" style={{ fontSize: '0.875rem' }}>{selectedItem.description || 'No description available'}</p>
                    </div>
                  </div>
                  
                  <div className="col-6">
                    <div className="p-3 rounded" style={{ backgroundColor: '#f8fafc' }}>
                      <label className="text-muted mb-1 d-block" style={{ fontSize: '0.75rem' }}>SKU</label>
                      <span className="fw-medium" style={{ fontSize: '0.875rem' }}>{selectedItem.sku}</span>
                    </div>
                  </div>
                  
                  <div className="col-6">
                    <div className="p-3 rounded" style={{ backgroundColor: '#f8fafc' }}>
                      <label className="text-muted mb-1 d-block" style={{ fontSize: '0.75rem' }}>Quantity</label>
                      <span className="fw-medium" style={{ fontSize: '0.875rem' }}>{selectedItem.quantity}</span>
                    </div>
                  </div>
                  
                  <div className="col-6">
                    <div className="p-3 rounded" style={{ backgroundColor: '#f8fafc' }}>
                      <label className="text-muted mb-1 d-block" style={{ fontSize: '0.75rem' }}>Price</label>
                      <span className="fw-medium" style={{ fontSize: '0.875rem', color: '#4f46e5' }}>₹{selectedItem.price}</span>
                    </div>
                  </div>
                  
                  <div className="col-6">
                    <div className="p-3 rounded" style={{ backgroundColor: '#f8fafc' }}>
                      <label className="text-muted mb-1 d-block" style={{ fontSize: '0.75rem' }}>Status</label>
                      <span 
                        className={`badge ${selectedItem.quantity > 10 ? 'bg-success' : selectedItem.quantity > 0 ? 'bg-warning' : 'bg-danger'}`}
                        style={{ fontSize: '0.75rem' }}
                      >
                        {selectedItem.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="col-6">
                    <div className="p-3 rounded" style={{ backgroundColor: '#f8fafc' }}>
                      <label className="text-muted mb-1 d-block" style={{ fontSize: '0.75rem' }}>Category</label>
                      <span className="fw-medium" style={{ fontSize: '0.875rem' }}>{selectedItem.category || '—'}</span>
                    </div>
                  </div>
                  
                  <div className="col-6">
                    <div className="p-3 rounded" style={{ backgroundColor: '#f8fafc' }}>
                      <label className="text-muted mb-1 d-block" style={{ fontSize: '0.75rem' }}>Supplier</label>
                      <span className="fw-medium" style={{ fontSize: '0.875rem' }}>{selectedItem.supplier || '—'}</span>
                    </div>
                  </div>
                  
                  <div className="col-12">
                    <div className="p-3 rounded" style={{ backgroundColor: '#f8fafc' }}>
                      <label className="text-muted mb-1 d-block" style={{ fontSize: '0.75rem' }}>Created At</label>
                      <span className="fw-medium" style={{ fontSize: '0.875rem' }}>{new Date(selectedItem.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer" style={{ borderTop: '1px solid #e5e7eb', padding: '1rem 1.5rem' }}>
                <button 
                  type="button" 
                  className="btn btn-outline-secondary me-2" 
                  onClick={() => setShowViewModal(false)}
                  style={{ borderRadius: '8px', fontSize: '0.875rem' }}
                >
                  Close
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary" 
                  onClick={() => {
                    setShowViewModal(false);
                    openEditModal(selectedItem);
                  }}
                  style={{ borderRadius: '8px', backgroundColor: '#4f46e5', border: 'none', fontSize: '0.875rem' }}
                >
                  <FaEdit className="me-2" size={12} />
                  Edit Item
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventorys;