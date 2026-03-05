import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { BaseUrl, FrontendUrl } from "../service/Uri";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import './AdminCompany.css';

const CompanyCard = ({ company, getInitials, copiedId, setCopiedId, generateCompanyUrl, handleUpdateClick, handleDelete }) => {
  const [logoError, setLogoError] = useState(false);
  const hasLogo = company.logo && !logoError;

  return (
    <div className="admin-company-card">
      <div className="admin-company-card-header">
        <div className="admin-company-card-logo-wrapper">
          {hasLogo ? (
            <img 
              src={`${company.logo}`} 
              alt={company.name} 
              className="admin-company-card-logo"
              onError={() => setLogoError(true)}
            />
          ) : (
            <div className="admin-company-card-logo-placeholder">
              {getInitials(company.name)}
            </div>
          )}
        </div>
        <div className="admin-company-card-title-section">
          <h3 className="admin-company-card-name">{company.name}</h3>
          <span className={`admin-company-card-status ${company.isActive ? 'admin-company-status-active' : 'admin-company-status-inactive'}`}>
            {company.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>
      <div className="admin-company-card-body">
        <div className="admin-company-card-field">
          <span className="admin-company-card-label">Email</span>
          <span className="admin-company-card-value">{company.email}</span>
        </div>
        <div className="admin-company-card-field">
          <span className="admin-company-card-label">Mobile</span>
          <span className="admin-company-card-value">{company.mobile}</span>
        </div>
        <div className="admin-company-card-field">
          <span className="admin-company-card-label">Contact Person</span>
          <span className="admin-company-card-value">{company.pname}</span>
        </div>
        <div className="admin-company-card-field">
          <span className="admin-company-card-label">Address</span>
          <span className="admin-company-card-value">{company.address}</span>
        </div>
        <div className="admin-company-card-field">
          <span className="admin-company-card-label">URL</span>
          <div className="admin-company-card-url">
            {copiedId === company._id ? (
              <span className="admin-company-url-copied">Copied!</span>
            ) : (
              <button 
                className="admin-company-url-button"
                onClick={() => { 
                  const companyUrl = generateCompanyUrl(company.name); 
                  navigator.clipboard.writeText(companyUrl);
                  setCopiedId(company._id); 
                  setTimeout(() => setCopiedId(null), 1000);
                }}
              >
                Copy URL
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="admin-company-card-footer">
        <button 
          className="admin-company-action-button admin-company-action-edit" 
          onClick={() => handleUpdateClick(company)}
        >
          Edit
        </button>
        <button 
          className="admin-company-action-button admin-company-action-delete" 
          onClick={() => handleDelete(company._id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

const Company = () => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', logo: null, email: '', password: '', isActive: true });
  const [errorMsg, setErrorMsg] = useState('');
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [currentCompany, setCurrentCompany] = useState(null);
  const [updateData, setUpdateData] = useState({ name: '', logo: null, email: '', password: '', isActive: true });
  const [updateErrorMsg, setUpdateErrorMsg] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [showFieldModal, setShowFieldModal] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);

  useEffect(() => {
    fetchCompanies();
  }, []);

useEffect(() => {
  const handleResize = () => setIsMobile(window.innerWidth < 992);
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);

const fetchCompanies = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const res = await axios.get(`${BaseUrl}/company/getall`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setCompanies(res.data.data || []);
    } catch (error) {
      console.error('Error fetching companies:', error);
    } finally {
      setLoading(false);
    }
};

const handleFormChange = (e) => {
  const { name, value, type, checked, files } = e.target;
  if (name === 'mobile') {
    const numericValue = value.replace(/\D/g, '');
    if (numericValue.length <= 10) {
      setFormData({ ...formData, [name]: numericValue });
    }
    return;
  }

  if (type === 'checkbox') {
    setFormData({ ...formData, [name]: checked });
  } else if (type === 'file') {
    const file = files[0];
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (file && allowedTypes.includes(file.type)) {
      setFormData({ ...formData, logo: file });
    } else {
      alert('Only JPG, JPEG, or PNG files are allowed.');
    }
  } else {
    setFormData({ ...formData, [name]: value });
  }
};

const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      const form = new FormData();
      for (const key in formData) {
        form.append(key, formData[key]);
      }
      const response = await axios.post(`${BaseUrl}/company/create`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      if (response.data && response.data.data) {
      setErrorMsg('')
      fetchCompanies();
      setShowAddModal(false)
      setFormData({ name: '', logo: null, email: '', password: '',mobile:'',pname:'',address:'' , isActive: true });
    } else {
      setErrorMsg(response.data.message || 'Failed to create company.');
    }
    } catch (error) {
      console.error('Error adding company:', error);
    }
};

const handleDelete = (id) => {
  Swal.fire({
    title: 'Are you sure?',
    text: 'Do you want to delete this company?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc3545',
    cancelButtonColor: '#6c757d',
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel',
    customClass: {
      confirmButton: 'btn btn-danger me-2',
      cancelButton: 'btn btn-secondary'
    },
    buttonsStyling: false
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('adminToken');
        await axios.delete(`${BaseUrl}/company/delete/${id}`, {
          headers: { Authorization: `Bearer ${token}`}
        });
        Swal.fire({
                    title: 'Deleted!',
                    text: 'Company has been deleted.',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                  })
        fetchCompanies();
      } catch (error) {
        console.error('Error deleting company:', error);
        Swal.fire('Error', 'Something went wrong!', 'error');
      }
    }
  });
};

const handleUpdateClick = (company) => {
  setUpdateErrorMsg('');
  setCurrentCompany(company);
  setUpdateData({
    name: company.name,
    logo: null,
    email: company.email,
    mobile: company.mobile,
    pname: company.pname,
    address: company.address,
    password: company.password,
    isActive: company.isActive,
  });
  setShowUpdateModal(true);
};
const handleUpdateChange = (e) => {
  const { name, value, type, checked, files } = e.target;
  if (name === 'mobile') {
    const numericValue = value.replace(/\D/g, '');
    if (numericValue.length <= 10) {
      setUpdateData({ ...updateData, [name]: numericValue });
    }
    return;
  }
  if (type === 'checkbox') {
    setUpdateData({ ...updateData, [name]: checked });
  } else if (type === 'file') {
  const file = files[0];
  if (file) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      setUpdateErrorMsg('Only JPG, JPEG, and PNG formats are allowed.');
      return;
    }
  }
  setUpdateData({ ...updateData, logo: file });
  } else {
    setUpdateData({ ...updateData, [name]: value });
  }
};
const handleUpdateSubmit = async (e) => {
  e.preventDefault();
  if (!currentCompany) return;
  try {
    const token = localStorage.getItem('adminToken');
    const form = new FormData();
    for (const key in updateData) {
      if (updateData[key] !== null) {
        form.append(key, updateData[key]);
      }
    }
    const res = await axios.put(`${BaseUrl}/company/update/${currentCompany._id}`, form, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    if (res.data && res.data.data) {
      fetchCompanies();
      setShowUpdateModal(false);
      setCurrentCompany(null);
      setUpdateErrorMsg('');
    }else {
      setUpdateErrorMsg(res.data.message || 'Update failed.');
    }
  } catch (err) {
    console.error("Update Error:", err);
  }
};

const generateCompanyUrl = (name) => {
  return `${FrontendUrl}/${name.toLowerCase().replace(/\s+/g, '-')}`;
};

  const filteredCompanies = companies.filter(c => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      filter === 'All' ||
      (filter === 'Active' && c.isActive === true) ||
      (filter === 'Inactive' && c.isActive === false);
    return matchesSearch && matchesStatus;
  });

  return (
    <>
    <div className="admin-company">
      <div className="admin-company-filters">
        <select className="admin-company-select" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="All">All Companies</option>
          <option value="Active">Active Companies</option>
          <option value="Inactive">Inactive Companies</option>
        </select>
        <input 
          type="text" 
          className="admin-company-search" 
          placeholder="Search company..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)}
        />
        <button 
          className="admin-company-add-button" 
          onClick={() => {
            setFormData({ name: '', logo: null, email: '', password: '', mobile: '', pname: '', address: '', isActive: true });
            setErrorMsg('');
            setShowAddModal(true);
          }}
        >
          + Add Company
        </button>
      </div>

      {loading ? (
        <div className="admin-company-loading">Loading...</div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="admin-company-table-container">
            <table className="admin-company-table">
            <thead>
              <tr>
                <th style={{minWidth:"90px"}}>Logo</th>
                <th style={{minWidth:"150px"}}>Company Name</th>
                <th style={{minWidth:"200px"}}>Contact Details</th>
                <th style={{minWidth:"200px"}}>Address</th>
                <th style={{minWidth:"100px"}}>URL</th>
                <th style={{width:"110px"}}>Status</th>
                <th className="text-center" style={{width:"180px"}}>Action</th>
              </tr>
            </thead>
              <tbody>
                {filteredCompanies.length > 0 ? (
                  filteredCompanies.map((c) => (
                    <tr key={c._id}>
                      <td>
                        <div className="admin-company-logo-container">
                          <img src={`${c.logo}`} alt={c.name} className="admin-company-logo" />
                        </div>
                      </td>
                    <td>
                      <div className="admin-company-name">{c.name}</div>
                    </td>
                    <td>
                      <div className="admin-company-contact-details">
                        <div className="admin-company-contact-person">{c.pname}</div>
                        <div className="admin-company-contact-email">{c.email}</div>
                        <div className="admin-company-contact-mobile">{c.mobile}</div>
                      </div>
                    </td>
                    <td>
                      <div className="admin-company-address">{c.address}</div>
                    </td>
                      <td>
                        <div className="admin-company-url-container">
                          {copiedId === c._id ? (
                            <span className="admin-company-url-copied">Copied!</span>
                          ) : (
                            <button 
                              className="admin-company-url-button"
                              onClick={() => { 
                                const companyUrl = generateCompanyUrl(c.name); 
                                navigator.clipboard.writeText(companyUrl);
                                setCopiedId(c._id); 
                                setTimeout(() => setCopiedId(null), 1000);
                              }}
                            >
                              🔗 Copy URL
                            </button>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className={`admin-company-status-badge ${c.isActive ? 'admin-company-status-active' : 'admin-company-status-inactive'}`}>
                          {c.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <div className="admin-company-actions">
                          <button 
                            className="admin-company-action-button admin-company-action-edit" 
                            onClick={() => handleUpdateClick(c)}
                          >
                            Edit
                          </button>
                          <button 
                            className="admin-company-action-button admin-company-action-delete" 
                            onClick={() => handleDelete(c._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td colSpan="7" className="admin-company-no-data">
                    <div className="admin-company-no-data-icon">📊</div>
                    <div className="admin-company-no-data-title">No companies found</div>
                    <p className="admin-company-no-data-text">Try adjusting your search criteria</p>
                  </td>
                </tr>
              )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="admin-company-cards-container">
            {filteredCompanies.length > 0 ? (
              filteredCompanies.map((c) => {
                const getInitials = (name) => {
                  if (!name) return 'CO';
                  const words = name.trim().split(/\s+/);
                  if (words.length >= 2) {
                    return (words[0][0] + words[1][0]).toUpperCase();
                  }
                  return name.substring(0, 2).toUpperCase();
                };

                return (
                  <CompanyCard 
                    key={c._id}
                    company={c}
                    getInitials={getInitials}
                    copiedId={copiedId}
                    setCopiedId={setCopiedId}
                    generateCompanyUrl={generateCompanyUrl}
                    handleUpdateClick={handleUpdateClick}
                    handleDelete={handleDelete}
                  />
                );
              })
            ) : (
              <div className="admin-company-no-data">
                <div className="admin-company-no-data-icon">📊</div>
                <div className="admin-company-no-data-title">No companies found</div>
                <p className="admin-company-no-data-text">Try adjusting your search criteria</p>
              </div>
            )}
          </div>
        </>
      )}

{showUpdateModal && (
  <div className="admin-company-modal-overlay">
    <div className="admin-company-modal">
      <form onSubmit={handleUpdateSubmit}>
        <div className="admin-company-modal-header">
          <h5 className="admin-company-modal-title">Edit Company</h5>
          <button type="button" className="admin-company-modal-close" onClick={() => setShowUpdateModal(false)}>×</button>
        </div>
        <div className="admin-company-modal-body">
          <div className="admin-company-modal-form-group">
            <label className="admin-company-modal-label">Company Name</label>
            <input type="text" className="admin-company-modal-input" name="name" value={updateData.name} onChange={handleUpdateChange} required />
          </div>
          <div className="admin-company-modal-form-group">
            <label className="admin-company-modal-label">Email</label>
            <input type="email" className="admin-company-modal-input" name="email" value={updateData.email} onChange={handleUpdateChange} required />
          </div>
          <div className="admin-company-modal-form-group">
            <label className="admin-company-modal-label">Mobile Number</label>
            <input type="text" className="admin-company-modal-input" name="mobile" value={updateData.mobile} onChange={handleUpdateChange} maxLength="10" pattern="^[0-9]{10}$" title="Mobile number must be exactly 10 digits" required />
          </div>
          <div className="admin-company-modal-form-group">
            <label className="admin-company-modal-label">Contact Person Name</label>
            <input type="text" className="admin-company-modal-input" name="pname" value={updateData.pname} onChange={handleUpdateChange} required />
          </div>
          <div className="admin-company-modal-form-group">
            <label className="admin-company-modal-label">Address</label>
            <input type="text" className="admin-company-modal-input" name="address" value={updateData.address} onChange={handleUpdateChange} required />
          </div>
          <div className="admin-company-modal-form-group">
            <label className="admin-company-modal-label">Password</label>
            <input type="text" className="admin-company-modal-input" name="password" value={updateData.password} onChange={handleUpdateChange} required />
          </div>
          <div className="admin-company-modal-form-group">
            <label className="admin-company-modal-label">Logo (optional) (JPG, JPEG, PNG)</label>
            <input type="file" className="admin-company-modal-file-input" name="logo" accept=".jpg,.jpeg,.png" onChange={handleUpdateChange} />
            {currentCompany?.logo && (
              <div className="admin-company-modal-logo-preview">
                <img src={`${currentCompany.logo}`} alt="Current Logo" className="admin-company-modal-logo-image" />
              </div>
            )}
          </div>
          <div className="admin-company-modal-form-group">
            <div className="admin-company-modal-switch">
              <input className="admin-company-modal-switch-input" type="checkbox" name="isActive" checked={updateData.isActive} onChange={handleUpdateChange} />
              <label className="admin-company-modal-switch-label">Active</label>
            </div>
          </div>
          {updateErrorMsg && (
            <div className="admin-company-modal-alert admin-company-modal-alert-danger">{updateErrorMsg}</div>
          )}
        </div>
        <div className="admin-company-modal-footer">
          <button type="button" className="admin-company-modal-button admin-company-modal-button-secondary" onClick={() => setShowUpdateModal(false)}>Cancel</button>
          <button type="submit" className="admin-company-modal-button admin-company-modal-button-primary">Update</button>
        </div>
      </form>
    </div>
  </div>
)}

{showAddModal && (
  <div className="admin-company-modal-overlay">
    <div className="admin-company-modal admin-company-modal-lg">
      <form onSubmit={handleSubmit}>
        <div className="admin-company-modal-header">
          <h5 className="admin-company-modal-title">Add Company</h5>
          <button type="button" className="admin-company-modal-close" onClick={() => setShowAddModal(false)}>×</button>
        </div>
        <div className="admin-company-modal-body">
          <div className="admin-company-modal-grid">
            <div className="admin-company-modal-form-group">
              <label className="admin-company-modal-label">Company Name</label>
              <input 
                type="text" 
                className="admin-company-modal-input" 
                name="name" 
                value={formData.name} 
                onChange={handleFormChange} 
                placeholder="Enter company name"
                required 
              />
            </div>
            <div className="admin-company-modal-form-group">
              <label className="admin-company-modal-label">Email</label>
              <input 
                type="email" 
                className="admin-company-modal-input" 
                name="email" 
                value={formData.email} 
                onChange={handleFormChange} 
                placeholder="Enter email address"
                required 
              />
            </div>
            <div className="admin-company-modal-form-group">
              <label className="admin-company-modal-label">Mobile Number</label>
              <input 
                type="text" 
                className="admin-company-modal-input" 
                name="mobile" 
                value={formData.mobile} 
                onChange={handleFormChange} 
                pattern="^[0-9]{10}$" 
                maxLength="10" 
                placeholder="Enter 10-digit mobile number"
                required 
              />
            </div>
            <div className="admin-company-modal-form-group">
              <label className="admin-company-modal-label">Contact Person Name</label>
              <input 
                type="text" 
                className="admin-company-modal-input" 
                name="pname" 
                value={formData.pname} 
                onChange={handleFormChange} 
                placeholder="Enter contact person name"
                required 
              />
            </div>
            <div className="admin-company-modal-form-group admin-company-modal-form-group-full">
              <label className="admin-company-modal-label">Address</label>
              <input 
                type="text" 
                className="admin-company-modal-input" 
                name="address" 
                value={formData.address} 
                onChange={handleFormChange} 
                placeholder="Enter company address"
                required 
              />
            </div>
            <div className="admin-company-modal-form-group">
              <label className="admin-company-modal-label">Password</label>
              <input 
                type="password" 
                className="admin-company-modal-input" 
                name="password" 
                value={formData.password} 
                onChange={handleFormChange} 
                placeholder="Enter password"
                required 
              />
            </div>
            <div className="admin-company-modal-form-group">
              <label className="admin-company-modal-label">Logo (JPG, JPEG, PNG)</label>
              <input 
                type="file" 
                accept=".jpg,.jpeg,.png" 
                className="admin-company-modal-file-input" 
                name="logo" 
                onChange={handleFormChange} 
              />
            </div>
            <div className="admin-company-modal-form-group admin-company-modal-form-group-full">
              <div className="admin-company-modal-switch">
                <input 
                  className="admin-company-modal-switch-input" 
                  type="checkbox" 
                  name="isActive" 
                  checked={formData.isActive} 
                  onChange={handleFormChange} 
                />
                <label className="admin-company-modal-switch-label">Active</label>
              </div>
            </div>
          </div>
          {errorMsg && (
            <div className="admin-company-modal-alert admin-company-modal-alert-danger">{errorMsg}</div>
          )}
        </div>
        <div className="admin-company-modal-footer">
          <button 
            type="button" 
            className="admin-company-modal-button admin-company-modal-button-secondary" 
            onClick={() => {
              setShowAddModal(false);
              setFormData({ name: '', logo: null, email: '', password: '', mobile: '', pname: '', address: '', isActive: true });
              setErrorMsg('');
            }}
          >
            Cancel
          </button>
          <button type="submit" className="admin-company-modal-button admin-company-modal-button-primary">Save Company</button>
        </div>
      </form>
    </div>
  </div>
)}
    </div>
    </>
  );
};

export default Company;
