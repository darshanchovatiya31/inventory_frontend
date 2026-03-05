// Updated Inventorys component
import { useEffect, useState } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';
import Swal from 'sweetalert2';
import { BaseUrl } from "../service/Uri";
import { FaBox, FaDownload, FaEdit, FaEye, FaTrash, FaPlus, FaSearch, FaFilter, FaHistory, FaExchangeAlt } from 'react-icons/fa';
import CommonHeader from './CommonHeader';
import './CompanyInventory.css';

const InventoryCard = ({ item, getInitials, openHistoryModal, openAdjustModal, openViewModal, openEditModal, handleDelete }) => {
  const [imageError, setImageError] = useState(false);
  const hasImage = item.image && !imageError;
  const getStatusClass = () => {
    if (item.quantity > 10) return 'company-inventory-table-status-success';
    if (item.quantity > 0) return 'company-inventory-table-status-warning';
    return 'company-inventory-table-status-danger';
  };

  return (
    <div className="company-inventory-card">
      <div className="company-inventory-card-header">
        {hasImage ? (
          <img 
            src={`${BaseUrl}/${item.image}`} 
            alt={item.name || 'Product'} 
            className="company-inventory-card-image"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="company-inventory-card-image-placeholder">
            {item.name ? getInitials(item.name) : <FaBox />}
          </div>
        )}
        <div className="company-inventory-card-info">
          <h6 className="company-inventory-card-name">{item.name || '—'}</h6>
          <p className="company-inventory-card-sku">SKU: {item.sku || '—'}</p>
          <div className="company-inventory-card-details">
            <span className="company-inventory-card-quantity">Qty: {item.quantity || '—'}</span>
            <span className="company-inventory-card-price">₹{item.price || '—'}</span>
          </div>
        </div>
      </div>
      <div className="company-inventory-card-fields">
        <div className="company-inventory-card-field">
          <div className="company-inventory-card-field-label">Category</div>
          <div className="company-inventory-card-field-value">{item.category || '—'}</div>
        </div>
        <div className="company-inventory-card-field">
          <div className="company-inventory-card-field-label">Supplier</div>
          <div className="company-inventory-card-field-value">{item.supplier || '—'}</div>
        </div>
      </div>
      <div className="company-inventory-card-footer">
        <span className={`company-inventory-card-status ${getStatusClass()}`}>
          {item.status || 'Active'}
        </span>
        <div className="company-inventory-card-actions">
          <button 
            className="company-inventory-card-action-button company-inventory-card-action-button-info" 
            onClick={() => openHistoryModal(item)}
            title="History"
          >
            <FaHistory size={12} />
          </button>
          <button 
            className="company-inventory-card-action-button company-inventory-card-action-button-warning" 
            onClick={() => openAdjustModal(item)}
            title="Adjust"
          >
            <FaExchangeAlt size={12} />
          </button>
          <button 
            className="company-inventory-card-action-button company-inventory-card-action-button-primary" 
            onClick={() => openViewModal(item)}
            title="View"
          >
            <FaEye size={12} />
          </button>
          <button 
            className="company-inventory-card-action-button company-inventory-card-action-button-secondary" 
            onClick={() => openEditModal(item)}
            title="Edit"
          >
            <FaEdit size={12} />
          </button>
          <button 
            className="company-inventory-card-action-button company-inventory-card-action-button-danger" 
            onClick={() => handleDelete(item)}
            title="Delete"
          >
            <FaTrash size={12} />
          </button>
        </div>
      </div>
    </div>
  );
};

const InventoryTableRow = ({ item, getInitials, openHistoryModal, openAdjustModal, openViewModal, openEditModal, handleDelete }) => {
  const [imageError, setImageError] = useState(false);
  const hasImage = item.image && !imageError;
  const getStatusClass = () => {
    if (item.quantity > 10) return 'company-inventory-table-status-success';
    if (item.quantity > 0) return 'company-inventory-table-status-warning';
    return 'company-inventory-table-status-danger';
  };

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

  return (
    <tr>
      {columns.map((col, idx) => (
        <td key={idx} style={{ textAlign: col.key === 'image' ? 'center' : 'left' }}>
          {col.key === 'image' ? (
            hasImage ? (
              <img 
                src={`${item.image}`} 
                alt={item.name || 'Product'} 
                className="company-inventory-table-image"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="company-inventory-table-image-placeholder">
                {item.name ? getInitials(item.name) : <FaBox />}
              </div>
            )
          ) : col.key === 'name' ? (
            <div className="company-inventory-table-name">{item[col.key] || '—'}</div>
          ) : col.key === 'status' ? (
            <span className={`company-inventory-table-status ${getStatusClass()}`}>
              {item[col.key] || 'Active'}
            </span>
          ) : (
            <span>{item[col.key] || '—'}</span>
          )}
        </td>
      ))}
      <td>{new Date(item.createdAt).toLocaleDateString()}</td>
      <td className="text-center">
        <div className="company-inventory-table-actions">
          <button 
            className="company-inventory-table-action-button company-inventory-table-action-button-info" 
            onClick={() => openHistoryModal(item)}
            title="History"
          >
            <FaHistory size={12} />
          </button>
          <button 
            className="company-inventory-table-action-button company-inventory-table-action-button-warning" 
            onClick={() => openAdjustModal(item)}
            title="Adjust"
          >
            <FaExchangeAlt size={12} />
          </button>
        </div>
      </td>
      <td className="text-end">
        <div className="company-inventory-table-actions">
          <button 
            className="company-inventory-table-action-button company-inventory-table-action-button-primary" 
            onClick={() => openViewModal(item)}
            title="View"
          >
            <FaEye size={12} />
          </button>
          <button 
            className="company-inventory-table-action-button company-inventory-table-action-button-secondary" 
            onClick={() => openEditModal(item)}
            title="Edit"
          >
            <FaEdit size={12} />
          </button>
          <button 
            className="company-inventory-table-action-button company-inventory-table-action-button-danger" 
            onClick={() => handleDelete(item)}
            title="Delete"
          >
            <FaTrash size={12} />
          </button>
        </div>
      </td>
    </tr>
  );
};

const Inventorys = ({ toggleSidebar, setCurrentPage, isOpen }) => {
  const [inventories, setInventories] = useState([]);
  const [stats, setStats] = useState({ totalItems: 0, monthlyItems: 0, totalValue: 0, lowStock: 0 });
  const [loading, setLoading] = useState(true);
  const company = JSON.parse(localStorage.getItem('company'));
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [stockHistory, setStockHistory] = useState([]);
  const [adjustFormData, setAdjustFormData] = useState({
    type: 'add',
    quantity: 0,
    price: 0,
    supplier: '',
    notes: ''
  });
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

  const fetchStockHistory = async (inventoryId) => {
    try {
      const token = localStorage.getItem('companyToken');
      const res = await axios.get(`${BaseUrl}/inventory/history/${inventoryId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.status === 200) {
        setStockHistory(res.data.data);
      } else {
        console.error("Failed to fetch stock history:", res.data.message);
      }
    } catch (error) {
      console.error("Error fetching stock history:", error);
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

  const handleAdjustInputChange = (e) => {
    const { name, value } = e.target;
    setAdjustFormData({ ...adjustFormData, [name]: value });
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

      const res = await axios.post(`${BaseUrl}/inventory/create/${company._id}`, data, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });

     if (res.data.data !== null) {
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
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Inventory item created successfully!',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
      } else {
        Swal.fire({
          toast: true,
          position: 'top-end', // top-right corner
          icon: 'error',
          title: res.data.message || 'Failed to create inventory item.',
          showConfirmButton: false,
          timer: 4000, // auto close after 3 seconds
          timerProgressBar: true,
        });
      }
    } catch (error) {
      console.error("Error creating inventory:", error);
       Swal.fire({
        toast: true,
        position: 'top-end', // top-right corner
        icon: 'error',
        title: 'Failed to create inventory item.',
        showConfirmButton: false,
        timer: 3000, // auto close after 3 seconds
        timerProgressBar: true,
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

      const res = await axios.put(`${BaseUrl}/inventory/update/${selectedItem._id}`, data, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
       if (res.data.data !== null) {
      setShowEditModal(false);
      setPage(1);
      setHasMore(true);
      fetchInventories({ ...filterParams, page: 1, limit: 10 });
      fetchStats(filterParams);
       Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Inventory item updated successfully!',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
      } else {
        Swal.fire({
          toast: true,
          position: 'top-end', // top-right corner
          icon: 'error',
          title: res.data.message || 'Failed to update inventory item.',
          showConfirmButton: false,
          timer: 4000, // auto close after 3 seconds
          timerProgressBar: true,
        });
      }
    } catch (error) {
      console.error("Error updating inventory:", error);
        Swal.fire({
        toast: true,
        position: 'top-end', // top-right corner
        icon: 'error',
        title: 'Failed to update inventory item.',
        showConfirmButton: false,
        timer: 3000, // auto close after 3 seconds
        timerProgressBar: true,
      });
    }
  };

  const handleAdjust = async () => {
    try {
      const token = localStorage.getItem('companyToken');
      const res = await axios.post(`${BaseUrl}/inventory/adjustment`, { ...adjustFormData, inventoryId: selectedItem._id }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.data !== null) {
      setShowAdjustModal(false);
      setAdjustFormData({
        type: 'add',
        quantity: 0,
        price: 0,
        supplier: '',
        notes: ''
      });
      setPage(1);
      setHasMore(true);
      fetchInventories({ ...filterParams, page: 1, limit: 10 });
      fetchStats(filterParams);
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Stock adjusted successfully!',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
      } else {
        Swal.fire({
          toast: true,
          position: 'top-end', // top-right corner
          icon: 'error',
          title: res.data.message || 'Failed to adjust stock.',
          showConfirmButton: false,
          timer: 4000, // auto close after 3 seconds
          timerProgressBar: true,
        });
      }
    } catch (error) {
      console.error("Error adjusting stock:", error);
        Swal.fire({
        toast: true,
        position: 'top-end', // top-right corner
        icon: 'error',
        title: 'Failed to adjust stock.',
        showConfirmButton: false,
        timer: 3000, // auto close after 3 seconds
        timerProgressBar: true,
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
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: `${item.name} has been deleted.`,
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
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

  const openHistoryModal = (item) => {
    setSelectedItem(item);
    fetchStockHistory(item._id);
    setShowHistoryModal(true);
  };

  const openAdjustModal = (item) => {
    setSelectedItem(item);
    setShowAdjustModal(true);
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

  const getInitials = (name) => {
    if (!name) return 'IT';
    const words = name.trim().split(/\s+/);
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="container-fluid p-0">
      <CommonHeader title="Inventorys" company={company} toggleSidebar={toggleSidebar} setCurrentPage={setCurrentPage} />
      <div className="company-inventory">
        {/* Header Section */}
        <div className="company-inventory-header">
          <div className="company-inventory-header-top">
            <div className="company-inventory-title-section">
              <h2 className="company-inventory-title">
                <FaBox className="company-inventory-title-icon" />
                Inventory
              </h2>
              <p className="company-inventory-subtitle">Manage your products and stock levels</p>
            </div>
            <div className="company-inventory-header-actions">
              <button 
                className="company-inventory-button company-inventory-button-primary" 
                onClick={openCreateModal}
              >
                <FaPlus size={14} />
                Add Item
              </button>
              <button 
                className="company-inventory-button company-inventory-button-secondary" 
                onClick={downloadCSV}
              >
                <FaDownload size={14} />
                Export
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="company-inventory-stats">
            <div className="company-inventory-stat-card">
              <div className="company-inventory-stat-header">
                <span className="company-inventory-stat-badge">Total</span>
              </div>
              <div className="company-inventory-stat-value">{stats.totalItems}</div>
              <p className="company-inventory-stat-label">Items</p>
            </div>
            <div className="company-inventory-stat-card">
              <div className="company-inventory-stat-header">
                <span className="company-inventory-stat-badge">{fromDate && toDate ? 'Period' : 'Monthly'}</span>
              </div>
              <div className="company-inventory-stat-value">{stats.monthlyItems}</div>
              <p className="company-inventory-stat-label">Added</p>
            </div>
            <div className="company-inventory-stat-card">
              <div className="company-inventory-stat-header">
                <span className="company-inventory-stat-badge">Value</span>
              </div>
              <div className="company-inventory-stat-value">₹{stats.totalValue.toFixed(2)}</div>
              <p className="company-inventory-stat-label">Total</p>
            </div>
            <div className="company-inventory-stat-card">
              <div className="company-inventory-stat-header">
                <span className="company-inventory-stat-badge">Alert</span>
              </div>
              <div className="company-inventory-stat-value">{stats.lowStock}</div>
              <p className="company-inventory-stat-label">Low Stock</p>
            </div>
          </div>

          {/* Filter Section */}
          <div className="company-inventory-filters">
            <div className="company-inventory-filter-group">
              <select 
                className="company-inventory-filter-input" 
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
                <div className="company-inventory-filter-group">
                  <input 
                    type="date" 
                    className="company-inventory-filter-input" 
                    value={fromDate} 
                    onChange={(e) => setFromDate(e.target.value)}
                  />
                </div>
                <div className="company-inventory-filter-group">
                  <input 
                    type="date" 
                    className="company-inventory-filter-input" 
                    value={toDate} 
                    onChange={(e) => setToDate(e.target.value)}
                  />
                </div>
              </>
            )}
            <div className="company-inventory-filter-group">
              <input 
                type="text" 
                className="company-inventory-filter-input" 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name"
              />
            </div>
            <div className="company-inventory-filter-actions">
              <button 
                className="company-inventory-filter-button company-inventory-filter-button-primary" 
                onClick={applyFilters}
              >
                <FaFilter size={14} />
                Apply
              </button>
              <button 
                className="company-inventory-filter-button company-inventory-filter-button-secondary" 
                onClick={clearFilters}
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Inventory List */}
        <div className="company-inventory-table-container">
          {loading ? (
            <div className="company-inventory-loading">
              <div className="company-inventory-spinner"></div>
              <p className="company-inventory-loading-text">Loading inventories...</p>
            </div>
          ) : inventories.length === 0 ? (
            <div className="company-inventory-no-data">
              <div className="company-inventory-no-data-icon">
                <FaBox />
              </div>
              <div className="company-inventory-no-data-title">No inventory items found</div>
              <p className="company-inventory-no-data-text">Start by adding your first inventory item</p>
              <button 
                className="company-inventory-no-data-button" 
                onClick={openCreateModal}
              >
                <FaPlus size={14} />
                Add First Item
              </button>
            </div>
          ) : (
            <>
              {/* Mobile Card View */}
              <div className="company-inventory-cards">
                {currentInventories.map((i, index) => (
                  <InventoryCard
                    key={index}
                    item={i}
                    getInitials={getInitials}
                    openHistoryModal={openHistoryModal}
                    openAdjustModal={openAdjustModal}
                    openViewModal={openViewModal}
                    openEditModal={openEditModal}
                    handleDelete={handleDelete}
                  />
                ))}
              </div>

              {/* Desktop Table View */}
              <div className="company-inventory-table-wrapper">
                <table className="company-inventory-table">
                  <thead>
                    <tr>
                      {columns.map((col, i) => (
                        <th 
                          key={i} 
                          style={{ textAlign: col.key === 'image' ? 'center' : 'left' }}
                        >
                          {col.label}
                        </th>
                      ))}
                      <th>Created At</th>
                      <th className="text-center" style={{ minWidth: "100px" }}>Stock Mgmt</th>
                      <th className="text-end" style={{ minWidth: "150px" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentInventories.map((i, index) => (
                      <InventoryTableRow
                        key={index}
                        item={i}
                        getInitials={getInitials}
                        openHistoryModal={openHistoryModal}
                        openAdjustModal={openAdjustModal}
                        openViewModal={openViewModal}
                        openEditModal={openEditModal}
                        handleDelete={handleDelete}
                      />
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Show More */}
              {hasMore && (
                <div className="company-inventory-show-more">
                  <button 
                    className="company-inventory-show-more-button" 
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

      {/* Create Modal */}
      {showCreateModal && (
        <div className="company-inventory-modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="company-inventory-modal company-inventory-modal-sm" onClick={(e) => e.stopPropagation()}>
            <div className="company-inventory-modal-header">
              <h5 className="company-inventory-modal-title">Add New Item</h5>
              <button type="button" className="company-inventory-modal-close" onClick={() => setShowCreateModal(false)}>×</button>
            </div>
            <div className="company-inventory-modal-body">
              <form onSubmit={(e) => { e.preventDefault(); handleCreate(); }}>
                <div className="company-inventory-modal-form-group">
                  <label className="company-inventory-modal-label">Name</label>
                  <input 
                    type="text" 
                    className="company-inventory-modal-input" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleInputChange}
                    placeholder="Enter item name"
                    required
                  />
                </div>
                <div className="company-inventory-modal-grid">
                  <div className="company-inventory-modal-form-group">
                    <label className="company-inventory-modal-label">SKU</label>
                    <input 
                      type="text" 
                      className="company-inventory-modal-input" 
                      name="sku" 
                      value={formData.sku} 
                      onChange={handleInputChange}
                      placeholder="Enter SKU code"
                      required
                    />
                  </div>
                  <div className="company-inventory-modal-form-group">
                    <label className="company-inventory-modal-label">Quantity</label>
                    <input 
                      type="number" 
                      className="company-inventory-modal-input" 
                      name="quantity" 
                      value={formData.quantity} 
                      onChange={handleInputChange}
                      placeholder="Enter quantity"
                      required
                    />
                  </div>
                  <div className="company-inventory-modal-form-group">
                    <label className="company-inventory-modal-label">Price</label>
                    <input 
                      type="number" 
                      className="company-inventory-modal-input" 
                      name="price" 
                      value={formData.price} 
                      onChange={handleInputChange}
                      placeholder="Enter price"
                      required
                    />
                  </div>
                  <div className="company-inventory-modal-form-group">
                    <label className="company-inventory-modal-label">Category</label>
                    <input 
                      type="text" 
                      className="company-inventory-modal-input" 
                      name="category" 
                      value={formData.category} 
                      onChange={handleInputChange}
                      placeholder="Enter category (optional)"
                    />
                  </div>
                  <div className="company-inventory-modal-form-group company-inventory-modal-form-group-full">
                    <label className="company-inventory-modal-label">Supplier</label>
                    <input 
                      type="text" 
                      className="company-inventory-modal-input" 
                      name="supplier" 
                      value={formData.supplier} 
                      onChange={handleInputChange}
                      placeholder="Enter supplier name (optional)"
                    />
                  </div>
                  <div className="company-inventory-modal-form-group company-inventory-modal-form-group-full">
                    <label className="company-inventory-modal-label">Product Image</label>
                    <input 
                      type="file" 
                      className="company-inventory-modal-file-input" 
                      onChange={handleFileChange}
                      accept="image/*"
                    />
                  </div>
                </div>
                <div className="company-inventory-modal-form-group">
                  <label className="company-inventory-modal-label">Description</label>
                  <textarea 
                    className="company-inventory-modal-textarea" 
                    name="description" 
                    value={formData.description} 
                    onChange={handleInputChange}
                    placeholder="Enter item description (optional)"
                    rows="2"
                  ></textarea>
                </div>
                <div className="company-inventory-modal-footer">
                  <button 
                    type="button" 
                    className="company-inventory-modal-button company-inventory-modal-button-secondary" 
                    onClick={() => setShowCreateModal(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="company-inventory-modal-button company-inventory-modal-button-primary"
                  >
                    Create Item
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="company-inventory-modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="company-inventory-modal company-inventory-modal-sm" onClick={(e) => e.stopPropagation()}>
            <div className="company-inventory-modal-header">
              <h5 className="company-inventory-modal-title">Edit Item</h5>
              <button type="button" className="company-inventory-modal-close" onClick={() => setShowEditModal(false)}>×</button>
            </div>
            <div className="company-inventory-modal-body">
              <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
                <div className="company-inventory-modal-form-group">
                  <label className="company-inventory-modal-label">Name</label>
                  <input 
                    type="text" 
                    className="company-inventory-modal-input" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleInputChange}
                    placeholder="Enter item name"
                  />
                </div>
                <div className="company-inventory-modal-grid">
                  <div className="company-inventory-modal-form-group">
                    <label className="company-inventory-modal-label">SKU</label>
                    <input 
                      type="text" 
                      className="company-inventory-modal-input" 
                      name="sku" 
                      value={formData.sku} 
                      onChange={handleInputChange}
                      placeholder="Enter SKU code"
                    />
                  </div>
                  <div className="company-inventory-modal-form-group">
                    <label className="company-inventory-modal-label">Quantity</label>
                    <input 
                      type="number" 
                      className="company-inventory-modal-input" 
                      name="quantity" 
                      value={formData.quantity} 
                      onChange={handleInputChange}
                      placeholder="Enter quantity"
                    />
                  </div>
                  <div className="company-inventory-modal-form-group">
                    <label className="company-inventory-modal-label">Price</label>
                    <input 
                      type="number" 
                      className="company-inventory-modal-input" 
                      name="price" 
                      value={formData.price} 
                      onChange={handleInputChange}
                      placeholder="Enter price"
                    />
                  </div>
                  <div className="company-inventory-modal-form-group">
                    <label className="company-inventory-modal-label">Category</label>
                    <input 
                      type="text" 
                      className="company-inventory-modal-input" 
                      name="category" 
                      value={formData.category} 
                      onChange={handleInputChange}
                      placeholder="Enter category (optional)"
                    />
                  </div>
                  <div className="company-inventory-modal-form-group company-inventory-modal-form-group-full">
                    <label className="company-inventory-modal-label">Supplier</label>
                    <input 
                      type="text" 
                      className="company-inventory-modal-input" 
                      name="supplier" 
                      value={formData.supplier} 
                      onChange={handleInputChange}
                      placeholder="Enter supplier name (optional)"
                    />
                  </div>
                  <div className="company-inventory-modal-form-group company-inventory-modal-form-group-full">
                    <label className="company-inventory-modal-label">Update Image</label>
                    <input 
                      type="file" 
                      className="company-inventory-modal-file-input" 
                      onChange={handleFileChange}
                      accept="image/*"
                    />
                    <small style={{ color: '#6b7280', fontSize: '13px', marginTop: '4px', display: 'block' }}>Leave empty to keep current image</small>
                  </div>
                </div>
                <div className="company-inventory-modal-form-group">
                  <label className="company-inventory-modal-label">Description</label>
                  <textarea 
                    className="company-inventory-modal-textarea" 
                    name="description" 
                    value={formData.description} 
                    onChange={handleInputChange}
                    placeholder="Enter item description (optional)"
                    rows="2"
                  ></textarea>
                </div>
                <div className="company-inventory-modal-footer">
                  <button 
                    type="button" 
                    className="company-inventory-modal-button company-inventory-modal-button-secondary" 
                    onClick={() => setShowEditModal(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="company-inventory-modal-button company-inventory-modal-button-primary"
                  >
                    Update Item
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && selectedItem && (
        <div className="company-inventory-modal-overlay" onClick={() => setShowViewModal(false)}>
          <div className="company-inventory-modal company-inventory-modal-sm" onClick={(e) => e.stopPropagation()}>
            <div className="company-inventory-modal-header">
              <h5 className="company-inventory-modal-title">Item Details</h5>
              <button type="button" className="company-inventory-modal-close" onClick={() => setShowViewModal(false)}>×</button>
            </div>
            <div className="company-inventory-modal-body">
              {selectedItem.image && (
                <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                  <img 
                    src={`${selectedItem.image}`} 
                    alt="Product" 
                    style={{ maxWidth: '120px', maxHeight: '120px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                  />
                </div>
              )}
              <div style={{ marginBottom: '12px' }}>
                <h6 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#1f2937' }}>{selectedItem.name}</h6>
                {selectedItem.description && (
                  <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#6b7280' }}>{selectedItem.description}</p>
                )}
              </div>
              <div className="company-inventory-view-grid">
                <div className="company-inventory-view-field">
                  <span className="company-inventory-view-label">SKU</span>
                  <span className="company-inventory-view-value">{selectedItem.sku}</span>
                </div>
                <div className="company-inventory-view-field">
                  <span className="company-inventory-view-label">Quantity</span>
                  <span className="company-inventory-view-value">{selectedItem.quantity}</span>
                </div>
                <div className="company-inventory-view-field">
                  <span className="company-inventory-view-label">Price</span>
                  <span className="company-inventory-view-value company-inventory-view-value-primary">₹{selectedItem.price}</span>
                </div>
                <div className="company-inventory-view-field">
                  <span className="company-inventory-view-label">Status</span>
                  <span className={`company-inventory-table-status ${selectedItem.quantity > 10 ? 'company-inventory-table-status-success' : selectedItem.quantity > 0 ? 'company-inventory-table-status-warning' : 'company-inventory-table-status-danger'}`}>
                    {selectedItem.status}
                  </span>
                </div>
                <div className="company-inventory-view-field">
                  <span className="company-inventory-view-label">Category</span>
                  <span className="company-inventory-view-value">{selectedItem.category || '—'}</span>
                </div>
                <div className="company-inventory-view-field">
                  <span className="company-inventory-view-label">Supplier</span>
                  <span className="company-inventory-view-value">{selectedItem.supplier || '—'}</span>
                </div>
              </div>
            </div>
            <div className="company-inventory-modal-footer">
              <button 
                type="button" 
                className="company-inventory-modal-button company-inventory-modal-button-secondary" 
                onClick={() => setShowViewModal(false)}
              >
                Close
              </button>
              <button 
                type="button" 
                className="company-inventory-modal-button company-inventory-modal-button-primary" 
                onClick={() => {
                  setShowViewModal(false);
                  openEditModal(selectedItem);
                }}
              >
                <FaEdit size={12} style={{ marginRight: '8px' }} />
                Edit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* History Modal */}
      {showHistoryModal && selectedItem && (
        <div className="company-inventory-modal-overlay" onClick={() => setShowHistoryModal(false)}>
          <div className="company-inventory-modal company-inventory-modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="company-inventory-modal-header">
              <h5 className="company-inventory-modal-title">Stock History for {selectedItem.name}</h5>
              <button type="button" className="company-inventory-modal-close" onClick={() => setShowHistoryModal(false)}>×</button>
            </div>
            <div className="company-inventory-modal-body">
              {stockHistory.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                  <FaHistory size={48} style={{ color: '#9ca3af', marginBottom: '16px' }} />
                  <p style={{ color: '#6b7280', margin: 0 }}>No stock adjustments found</p>
                </div>
              ) : (
                <>
                  <div className="company-inventory-history-table-wrapper">
                    <table className="company-inventory-history-table">
                      <thead>
                        <tr>
                          <th>Type</th>
                          <th>Quantity</th>
                          <th>Price</th>
                          <th>Supplier</th>
                          <th>Notes</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stockHistory.map((adj, idx) => (
                          <tr key={idx}>
                            <td>
                              <span className={`company-inventory-history-badge ${adj.type === 'add' ? 'company-inventory-history-badge-success' : 'company-inventory-history-badge-danger'}`}>
                                {adj.type.toUpperCase()}
                              </span>
                            </td>
                            <td>{adj.quantity}</td>
                            <td>₹{adj.price}</td>
                            <td>{adj.supplier || '—'}</td>
                            <td>{adj.notes || '—'}</td>
                            <td>{new Date(adj.createdAt).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="company-inventory-history-cards">
                    {stockHistory.map((adj, idx) => (
                      <div key={idx} className="company-inventory-history-card">
                        <div className="company-inventory-history-card-header">
                          <span className={`company-inventory-history-badge ${adj.type === 'add' ? 'company-inventory-history-badge-success' : 'company-inventory-history-badge-danger'}`}>
                            {adj.type.toUpperCase()}
                          </span>
                          <span style={{ fontSize: '13px', color: '#6b7280' }}>
                            {new Date(adj.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <div className="company-inventory-history-card-details">
                          <div className="company-inventory-history-card-field">
                            <span className="company-inventory-history-card-label">Quantity</span>
                            <span className="company-inventory-history-card-value">{adj.quantity}</span>
                          </div>
                          <div className="company-inventory-history-card-field">
                            <span className="company-inventory-history-card-label">Price</span>
                            <span className="company-inventory-history-card-value">₹{adj.price}</span>
                          </div>
                          {adj.supplier && (
                            <div className="company-inventory-history-card-field" style={{ gridColumn: '1 / -1' }}>
                              <span className="company-inventory-history-card-label">Supplier</span>
                              <span className="company-inventory-history-card-value">{adj.supplier}</span>
                            </div>
                          )}
                          {adj.notes && (
                            <div className="company-inventory-history-card-field" style={{ gridColumn: '1 / -1' }}>
                              <span className="company-inventory-history-card-label">Notes</span>
                              <span className="company-inventory-history-card-value">{adj.notes}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
            <div className="company-inventory-modal-footer">
              <button 
                type="button" 
                className="company-inventory-modal-button company-inventory-modal-button-secondary" 
                onClick={() => setShowHistoryModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Adjust Modal */}
      {showAdjustModal && selectedItem && (
        <div className="company-inventory-modal-overlay" onClick={() => setShowAdjustModal(false)}>
          <div className="company-inventory-modal company-inventory-modal-sm" onClick={(e) => e.stopPropagation()}>
            <div className="company-inventory-modal-header">
              <h5 className="company-inventory-modal-title">Adjust Stock</h5>
              <button type="button" className="company-inventory-modal-close" onClick={() => setShowAdjustModal(false)}>×</button>
            </div>
            <div className="company-inventory-modal-body">
              <form onSubmit={(e) => { e.preventDefault(); handleAdjust(); }}>
                <div className="company-inventory-modal-grid">
                  <div className="company-inventory-modal-form-group">
                    <label className="company-inventory-modal-label">Type</label>
                    <select 
                      className="company-inventory-modal-input" 
                      name="type" 
                      value={adjustFormData.type} 
                      onChange={handleAdjustInputChange}
                    >
                      <option value="add">Add</option>
                      <option value="subtract">Subtract</option>
                    </select>
                  </div>
                  <div className="company-inventory-modal-form-group">
                    <label className="company-inventory-modal-label">Quantity</label>
                    <input 
                      type="number" 
                      className="company-inventory-modal-input" 
                      name="quantity" 
                      value={adjustFormData.quantity} 
                      onChange={handleAdjustInputChange}
                      placeholder="Enter quantity"
                      min="1"
                      required
                    />
                  </div>
                  <div className="company-inventory-modal-form-group">
                    <label className="company-inventory-modal-label">Price per Unit</label>
                    <input 
                      type="number" 
                      className="company-inventory-modal-input" 
                      name="price" 
                      value={adjustFormData.price} 
                      onChange={handleAdjustInputChange}
                      placeholder="Enter price"
                      min="0"
                      required
                    />
                  </div>
                  <div className="company-inventory-modal-form-group">
                    <label className="company-inventory-modal-label">Supplier</label>
                    <input 
                      type="text" 
                      className="company-inventory-modal-input" 
                      name="supplier" 
                      value={adjustFormData.supplier} 
                      onChange={handleAdjustInputChange}
                      placeholder="Enter supplier (optional)"
                    />
                  </div>
                </div>
                <div className="company-inventory-modal-form-group">
                  <label className="company-inventory-modal-label">Notes</label>
                  <textarea 
                    className="company-inventory-modal-textarea" 
                    name="notes" 
                    value={adjustFormData.notes} 
                    onChange={handleAdjustInputChange}
                    placeholder="Enter notes (optional)"
                    rows="2"
                  ></textarea>
                </div>
                <div className="company-inventory-modal-footer">
                  <button 
                    type="button" 
                    className="company-inventory-modal-button company-inventory-modal-button-secondary" 
                    onClick={() => setShowAdjustModal(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="company-inventory-modal-button company-inventory-modal-button-primary"
                  >
                    Adjust Stock
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventorys;