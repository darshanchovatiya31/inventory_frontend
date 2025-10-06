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

  return (
    show && (
      <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable" role="document">
          <div className="modal-content" style={{ borderRadius: '12px', border: 'none' }}>
            <div className="modal-header" style={{ borderBottom: '1px solid #e5e7eb' }}>
              <h5 className="modal-title fw-bold" style={{ color: '#1f2937' }}>Sale Details</h5>
              <button type="button" className="btn-close" onClick={onHide}></button>
            </div>
            <div className="modal-body" style={{ padding: '1.5rem' }}>
              <div className="row g-3">
                <div className="col-12">
                  <div className="p-3 rounded" style={{ backgroundColor: '#f8fafc' }}>
                    <h6 className="fw-bold mb-1" style={{ color: '#1f2937', fontSize: '1.1rem' }}>{selectedSale.customerName}</h6>
                    <p className="text-muted mb-0" style={{ fontSize: '0.875rem' }}>
                      {selectedSale.customerEmail || 'No email provided'}
                    </p>
                    {selectedSale.customerPhone && (
                      <p className="text-muted mb-0" style={{ fontSize: '0.875rem' }}>
                        Phone: {selectedSale.customerPhone}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="col-6">
                  <div className="p-3 rounded" style={{ backgroundColor: '#f8fafc' }}>
                    <label className="text-muted mb-1 d-block" style={{ fontSize: '0.75rem' }}>Product</label>
                    <span className="fw-medium" style={{ fontSize: '0.875rem' }}>
                      {selectedSale.inventoryId?.name || 'N/A'}
                    </span>
                    {selectedSale.inventoryId?.sku && (
                      <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                        SKU: {selectedSale.inventoryId.sku}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="col-6">
                  <div className="p-3 rounded" style={{ backgroundColor: '#f8fafc' }}>
                    <label className="text-muted mb-1 d-block" style={{ fontSize: '0.75rem' }}>Quantity Sold</label>
                    <span className="fw-medium" style={{ fontSize: '0.875rem' }}>{selectedSale.quantitySold}</span>
                  </div>
                </div>
                
                <div className="col-6">
                  <div className="p-3 rounded" style={{ backgroundColor: '#f8fafc' }}>
                    <label className="text-muted mb-1 d-block" style={{ fontSize: '0.75rem' }}>Unit Price</label>
                    <span className="fw-medium" style={{ fontSize: '0.875rem', color: '#4f46e5' }}>₹{selectedSale.unitPrice}</span>
                  </div>
                </div>
                
                <div className="col-6">
                  <div className="p-3 rounded" style={{ backgroundColor: '#f8fafc' }}>
                    <label className="text-muted mb-1 d-block" style={{ fontSize: '0.75rem' }}>Total Amount</label>
                    <span className="fw-bold" style={{ fontSize: '1rem', color: '#4f46e5' }}>₹{selectedSale.totalAmount}</span>
                  </div>
                </div>
                
                <div className="col-6">
                  <div className="p-3 rounded" style={{ backgroundColor: '#f8fafc' }}>
                    <label className="text-muted mb-1 d-block" style={{ fontSize: '0.75rem' }}>Payment Method</label>
                    <span 
                      className={`badge ${selectedSale.paymentMethod === 'cash' ? 'bg-success' : selectedSale.paymentMethod === 'online' ? 'bg-primary' : 'bg-info'}`}
                      style={{ fontSize: '0.75rem' }}
                    >
                      {selectedSale.paymentMethod}
                    </span>
                  </div>
                </div>
                
                <div className="col-6">
                  <div className="p-3 rounded" style={{ backgroundColor: '#f8fafc' }}>
                    <label className="text-muted mb-1 d-block" style={{ fontSize: '0.75rem' }}>Payment Status</label>
                    <span 
                      className={`badge ${selectedSale.paymentStatus === 'completed' ? 'bg-success' : selectedSale.paymentStatus === 'pending' ? 'bg-warning' : 'bg-danger'}`}
                      style={{ fontSize: '0.75rem' }}
                    >
                      {selectedSale.paymentStatus}
                    </span>
                  </div>
                </div>
                
                {selectedSale.transactionId && (
                  <div className="col-12">
                    <div className="p-3 rounded" style={{ backgroundColor: '#f8fafc' }}>
                      <label className="text-muted mb-1 d-block" style={{ fontSize: '0.75rem' }}>Transaction ID</label>
                      <span className="fw-medium" style={{ fontSize: '0.875rem' }}>{selectedSale.transactionId}</span>
                    </div>
                  </div>
                )}
                
                {selectedSale.paymentReceivedBy && (
                  <div className="col-6">
                    <div className="p-3 rounded" style={{ backgroundColor: '#f8fafc' }}>
                      <label className="text-muted mb-1 d-block" style={{ fontSize: '0.75rem' }}>Payment Received By</label>
                      <span className="fw-medium" style={{ fontSize: '0.875rem' }}>{selectedSale.paymentReceivedBy}</span>
                    </div>
                  </div>
                )}
                
                <div className="col-6">
                  <div className="p-3 rounded" style={{ backgroundColor: '#f8fafc' }}>
                    <label className="text-muted mb-1 d-block" style={{ fontSize: '0.75rem' }}>Sale Date</label>
                    <span className="fw-medium" style={{ fontSize: '0.875rem' }}>{new Date(selectedSale.saleDate).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="col-12">
                  <div className="p-3 rounded" style={{ backgroundColor: '#f8fafc' }}>
                    <label className="text-muted mb-1 d-block" style={{ fontSize: '0.75rem' }}>Status</label>
                    <span 
                      className={`badge ${selectedSale.status === 'active' ? 'bg-success' : selectedSale.status === 'cancelled' ? 'bg-danger' : 'bg-warning'}`}
                      style={{ fontSize: '0.75rem' }}
                    >
                      {selectedSale.status}
                    </span>
                  </div>
                </div>
                
                {selectedSale.notes && (
                  <div className="col-12">
                    <div className="p-3 rounded" style={{ backgroundColor: '#f8fafc' }}>
                      <label className="text-muted mb-1 d-block" style={{ fontSize: '0.75rem' }}>Notes</label>
                      <span className="fw-medium" style={{ fontSize: '0.875rem' }}>{selectedSale.notes}</span>
                    </div>
                  </div>
                )}
                
                <div className="col-12">
                  <div className="p-3 rounded" style={{ backgroundColor: '#f8fafc' }}>
                    <label className="text-muted mb-1 d-block" style={{ fontSize: '0.75rem' }}>Created At</label>
                    <span className="fw-medium" style={{ fontSize: '0.875rem' }}>{new Date(selectedSale.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer" style={{ borderTop: '1px solid #e5e7eb', padding: '1rem 1.5rem' }}>
              <button 
                type="button" 
                className="btn btn-outline-secondary me-2" 
                onClick={onHide}
                style={{ borderRadius: '8px', fontSize: '0.875rem' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );
};
