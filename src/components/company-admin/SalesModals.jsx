import './CompanySales.css';

// Create Sale Modal Component
export const CreateSaleModal = ({ show, onHide, formData, handleInputChange, handleCreate, inventories }) => {
  return (
    show && (
      <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable" role="document">
          <div className="modal-content" style={{ borderRadius: '12px', border: 'none' }}>
            <div className="modal-header" style={{ borderBottom: '1px solid #e5e7eb' }}>
              <h5 className="modal-title fw-bold" style={{ color: '#1f2937' }}>Create New Sale</h5>
              <button type="button" className="btn-close" onClick={onHide}></button>
            </div>
            <div className="modal-body" style={{ padding: '1.5rem' }}>
              <form>
                <div className="mb-3">
                  <label className="form-label fw-medium" style={{ color: '#374151', fontSize: '0.875rem' }}>Select Product *</label>
                  <select 
                    className="form-control" 
                    name="inventoryId" 
                    value={formData.inventoryId} 
                    onChange={handleInputChange}
                    style={{ borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.875rem' }}
                    required
                  >
                    <option value="">Choose a product...</option>
                    {inventories.map(inventory => (
                      <option key={inventory._id} value={inventory._id}>
                        {inventory.name} (SKU: {inventory.sku}) - Stock: {inventory.quantity}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-medium" style={{ color: '#374151', fontSize: '0.875rem' }}>Customer Name *</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      name="customerName" 
                      value={formData.customerName} 
                      onChange={handleInputChange}
                      style={{ borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.875rem' }}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-medium" style={{ color: '#374151', fontSize: '0.875rem' }}>Customer Email</label>
                    <input 
                      type="email" 
                      className="form-control" 
                      name="customerEmail" 
                      value={formData.customerEmail} 
                      onChange={handleInputChange}
                      style={{ borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.875rem' }}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-medium" style={{ color: '#374151', fontSize: '0.875rem' }}>Customer Phone</label>
                    <input 
                      type="tel" 
                      className="form-control" 
                      name="customerPhone" 
                      value={formData.customerPhone} 
                      onChange={handleInputChange}
                      style={{ borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.875rem' }}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-medium" style={{ color: '#374151', fontSize: '0.875rem' }}>Payment Received By</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      name="paymentReceivedBy" 
                      value={formData.paymentReceivedBy} 
                      onChange={handleInputChange}
                      style={{ borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.875rem' }}
                      required
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-4 mb-3">
                    <label className="form-label fw-medium" style={{ color: '#374151', fontSize: '0.875rem' }}>Quantity *</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      name="quantitySold" 
                      value={formData.quantitySold} 
                      onChange={handleInputChange}
                      min="1"
                      style={{ borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.875rem' }}
                      required
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label fw-medium" style={{ color: '#374151', fontSize: '0.875rem' }}>Unit Price *</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      name="unitPrice" 
                      value={formData.unitPrice} 
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      style={{ borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.875rem' }}
                      required
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label fw-medium" style={{ color: '#374151', fontSize: '0.875rem' }}>Total Amount</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      value={formData.quantitySold * formData.unitPrice} 
                      disabled
                      style={{ borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.875rem', backgroundColor: '#f9fafb' }}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-medium" style={{ color: '#374151', fontSize: '0.875rem' }}>Payment Method *</label>
                    <select 
                      className="form-control" 
                      name="paymentMethod" 
                      value={formData.paymentMethod} 
                      onChange={handleInputChange}
                      style={{ borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.875rem' }}
                      required
                    >
                      <option value="cash">Cash</option>
                      <option value="online">Online</option>
                      <option value="card">Card</option>
                      <option value="upi">UPI</option>
                      <option value="cheque">Cheque</option>
                    </select>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-medium" style={{ color: '#374151', fontSize: '0.875rem' }}>Payment Status</label>
                    <select 
                      className="form-control" 
                      name="paymentStatus" 
                      value={formData.paymentStatus} 
                      onChange={handleInputChange}
                      style={{ borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.875rem' }}
                    >
                      <option value="completed">Completed</option>
                      <option value="pending">Pending</option>
                      <option value="failed">Failed</option>
                    </select>
                  </div>
                </div>

                {formData.paymentMethod === 'online' && (
                  <div className="mb-3">
                    <label className="form-label fw-medium" style={{ color: '#374151', fontSize: '0.875rem' }}>Transaction ID</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      name="transactionId" 
                      value={formData.transactionId} 
                      onChange={handleInputChange}
                      style={{ borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.875rem' }}
                    />
                  </div>
                )}

                <div className="mb-3">
                  <label className="form-label fw-medium" style={{ color: '#374151', fontSize: '0.875rem' }}>Sale Date</label>
                  <input 
                    type="date" 
                    className="form-control" 
                    name="saleDate" 
                    value={formData.saleDate} 
                    onChange={handleInputChange}
                    style={{ borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.875rem' }}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-medium" style={{ color: '#374151', fontSize: '0.875rem' }}>Notes</label>
                  <textarea 
                    className="form-control" 
                    name="notes" 
                    value={formData.notes} 
                    onChange={handleInputChange}
                    rows="3"
                    style={{ borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.875rem' }}
                  ></textarea>
                </div>
              </form>
            </div>
            <div className="modal-footer" style={{ borderTop: '1px solid #e5e7eb', padding: '1rem 1.5rem' }}>
              <button 
                type="button" 
                className="btn btn-outline-secondary me-2" 
                onClick={onHide}
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
                Create Sale
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

// Edit Sale Modal Component
export const EditSaleModal = ({ show, onHide, formData, handleInputChange, handleUpdate, inventories }) => {
  return (
    show && (
      <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable" role="document">
          <div className="modal-content" style={{ borderRadius: '12px', border: 'none' }}>
            <div className="modal-header" style={{ borderBottom: '1px solid #e5e7eb' }}>
              <h5 className="modal-title fw-bold" style={{ color: '#1f2937' }}>Edit Sale</h5>
              <button type="button" className="btn-close" onClick={onHide}></button>
            </div>
            <div className="modal-body" style={{ padding: '1.5rem' }}>
              <form>
                <div className="mb-3">
                  <label className="form-label fw-medium" style={{ color: '#374151', fontSize: '0.875rem' }}>Select Product *</label>
                  <select 
                    className="form-control" 
                    name="inventoryId" 
                    value={formData.inventoryId} 
                    onChange={handleInputChange}
                    style={{ borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.875rem' }}
                    required
                  >
                    <option value="">Choose a product...</option>
                    {inventories.map(inventory => (
                      <option key={inventory._id} value={inventory._id}>
                        {inventory.name} (SKU: {inventory.sku}) - Stock: {inventory.quantity}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-medium" style={{ color: '#374151', fontSize: '0.875rem' }}>Customer Name *</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      name="customerName" 
                      value={formData.customerName} 
                      onChange={handleInputChange}
                      style={{ borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.875rem' }}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-medium" style={{ color: '#374151', fontSize: '0.875rem' }}>Customer Email</label>
                    <input 
                      type="email" 
                      className="form-control" 
                      name="customerEmail" 
                      value={formData.customerEmail} 
                      onChange={handleInputChange}
                      style={{ borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.875rem' }}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-medium" style={{ color: '#374151', fontSize: '0.875rem' }}>Customer Phone</label>
                    <input 
                      type="tel" 
                      className="form-control" 
                      name="customerPhone" 
                      value={formData.customerPhone} 
                      onChange={handleInputChange}
                      style={{ borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.875rem' }}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-medium" style={{ color: '#374151', fontSize: '0.875rem' }}>Payment Received By</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      name="paymentReceivedBy" 
                      value={formData.paymentReceivedBy} 
                      onChange={handleInputChange}
                      style={{ borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.875rem' }}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-4 mb-3">
                    <label className="form-label fw-medium" style={{ color: '#374151', fontSize: '0.875rem' }}>Quantity *</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      name="quantitySold" 
                      value={formData.quantitySold} 
                      onChange={handleInputChange}
                      min="1"
                      style={{ borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.875rem' }}
                      required
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label fw-medium" style={{ color: '#374151', fontSize: '0.875rem' }}>Unit Price *</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      name="unitPrice" 
                      value={formData.unitPrice} 
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      style={{ borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.875rem' }}
                      required
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label fw-medium" style={{ color: '#374151', fontSize: '0.875rem' }}>Total Amount</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      value={formData.quantitySold * formData.unitPrice} 
                      disabled
                      style={{ borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.875rem', backgroundColor: '#f9fafb' }}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-medium" style={{ color: '#374151', fontSize: '0.875rem' }}>Payment Method *</label>
                    <select 
                      className="form-control" 
                      name="paymentMethod" 
                      value={formData.paymentMethod} 
                      onChange={handleInputChange}
                      style={{ borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.875rem' }}
                      required
                    >
                      <option value="cash">Cash</option>
                      <option value="online">Online</option>
                      <option value="card">Card</option>
                      <option value="upi">UPI</option>
                      <option value="cheque">Cheque</option>
                    </select>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-medium" style={{ color: '#374151', fontSize: '0.875rem' }}>Payment Status</label>
                    <select 
                      className="form-control" 
                      name="paymentStatus" 
                      value={formData.paymentStatus} 
                      onChange={handleInputChange}
                      style={{ borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.875rem' }}
                    >
                      <option value="completed">Completed</option>
                      <option value="pending">Pending</option>
                      <option value="failed">Failed</option>
                    </select>
                  </div>
                </div>

                {formData.paymentMethod === 'online' && (
                  <div className="mb-3">
                    <label className="form-label fw-medium" style={{ color: '#374151', fontSize: '0.875rem' }}>Transaction ID</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      name="transactionId" 
                      value={formData.transactionId} 
                      onChange={handleInputChange}
                      style={{ borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.875rem' }}
                    />
                  </div>
                )}

                <div className="mb-3">
                  <label className="form-label fw-medium" style={{ color: '#374151', fontSize: '0.875rem' }}>Sale Date</label>
                  <input 
                    type="date" 
                    className="form-control" 
                    name="saleDate" 
                    value={formData.saleDate} 
                    onChange={handleInputChange}
                    style={{ borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.875rem' }}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-medium" style={{ color: '#374151', fontSize: '0.875rem' }}>Notes</label>
                  <textarea 
                    className="form-control" 
                    name="notes" 
                    value={formData.notes} 
                    onChange={handleInputChange}
                    rows="3"
                    style={{ borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.875rem' }}
                  ></textarea>
                </div>
              </form>
            </div>
            <div className="modal-footer" style={{ borderTop: '1px solid #e5e7eb', padding: '1rem 1.5rem' }}>
              <button 
                type="button" 
                className="btn btn-outline-secondary me-2" 
                onClick={onHide}
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
                Update Sale
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

// View Sale Modal Component
export const ViewSaleModal = ({ show, onHide, selectedSale }) => {
  if (!selectedSale) return null;

  const getPaymentStatusClass = () => {
    if (selectedSale.paymentStatus === 'completed') return 'company-sales-view-badge-success';
    if (selectedSale.paymentStatus === 'pending') return 'company-sales-view-badge-warning';
    return 'company-sales-view-badge-danger';
  };

  const getPaymentMethodClass = () => {
    if (selectedSale.paymentMethod === 'cash') return 'company-sales-view-badge-success';
    if (selectedSale.paymentMethod === 'online') return 'company-sales-view-badge-primary';
    return 'company-sales-view-badge-info';
  };

  const getStatusClass = () => {
    if (selectedSale.status === 'active') return 'company-sales-view-badge-success';
    if (selectedSale.status === 'cancelled') return 'company-sales-view-badge-danger';
    return 'company-sales-view-badge-warning';
  };

  return (
    show && (
      <div className="company-sales-modal-overlay" onClick={onHide}>
        <div className="company-sales-modal company-sales-modal-sm" onClick={(e) => e.stopPropagation()}>
          <div className="company-sales-modal-header">
            <h5 className="company-sales-modal-title">Sale Details</h5>
            <button type="button" className="company-sales-modal-close" onClick={onHide}>×</button>
          </div>
          <div className="company-sales-modal-body">
            <div className="company-sales-view-field company-sales-view-field-full" style={{ marginBottom: '12px' }}>
              <h6 className="company-sales-view-title">{selectedSale.customerName}</h6>
              {selectedSale.customerEmail && (
                <p className="company-sales-view-description">{selectedSale.customerEmail}</p>
              )}
              {selectedSale.customerPhone && (
                <p className="company-sales-view-description" style={{ marginTop: '2px' }}>Phone: {selectedSale.customerPhone}</p>
              )}
            </div>
            <div className="company-sales-view-grid">
              <div className="company-sales-view-field">
                <span className="company-sales-view-label">Product</span>
                <span className="company-sales-view-value">{selectedSale.inventoryId?.name || 'N/A'}</span>
                {selectedSale.inventoryId?.sku && (
                  <span className="company-sales-view-value" style={{ fontSize: '11px', color: '#6b7280', display: 'block', marginTop: '2px' }}>
                    SKU: {selectedSale.inventoryId.sku}
                  </span>
                )}
              </div>
              <div className="company-sales-view-field">
                <span className="company-sales-view-label">Quantity</span>
                <span className="company-sales-view-value">{selectedSale.quantitySold}</span>
              </div>
              <div className="company-sales-view-field">
                <span className="company-sales-view-label">Unit Price</span>
                <span className="company-sales-view-value company-sales-view-value-primary">₹{selectedSale.unitPrice}</span>
              </div>
              <div className="company-sales-view-field">
                <span className="company-sales-view-label">Total Amount</span>
                <span className="company-sales-view-value company-sales-view-value-primary">₹{selectedSale.totalAmount}</span>
              </div>
              <div className="company-sales-view-field">
                <span className="company-sales-view-label">Payment Method</span>
                <span className={`company-sales-view-badge ${getPaymentMethodClass()}`}>
                  {selectedSale.paymentMethod}
                </span>
              </div>
              <div className="company-sales-view-field">
                <span className="company-sales-view-label">Payment Status</span>
                <span className={`company-sales-view-badge ${getPaymentStatusClass()}`}>
                  {selectedSale.paymentStatus}
                </span>
              </div>
              {selectedSale.transactionId && (
                <div className="company-sales-view-field company-sales-view-field-full">
                  <span className="company-sales-view-label">Transaction ID</span>
                  <span className="company-sales-view-value">{selectedSale.transactionId}</span>
                </div>
              )}
              {selectedSale.paymentReceivedBy && (
                <div className="company-sales-view-field">
                  <span className="company-sales-view-label">Received By</span>
                  <span className="company-sales-view-value">{selectedSale.paymentReceivedBy}</span>
                </div>
              )}
              <div className="company-sales-view-field">
                <span className="company-sales-view-label">Sale Date</span>
                <span className="company-sales-view-value">{new Date(selectedSale.saleDate).toLocaleDateString()}</span>
              </div>
              <div className="company-sales-view-field">
                <span className="company-sales-view-label">Status</span>
                <span className={`company-sales-view-badge ${getStatusClass()}`}>
                  {selectedSale.status || 'active'}
                </span>
              </div>
              {selectedSale.notes && (
                <div className="company-sales-view-field company-sales-view-field-full">
                  <span className="company-sales-view-label">Notes</span>
                  <span className="company-sales-view-value">{selectedSale.notes}</span>
                </div>
              )}
            </div>
          </div>
          <div className="company-sales-modal-footer">
            <button 
              type="button" 
              className="company-sales-modal-button company-sales-modal-button-secondary" 
              onClick={onHide}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    )
  );
};
