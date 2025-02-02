import React, { useState } from 'react';

function VirtualRecords({
  metadataList,
  fieldValues,
  onCreateValue,
  onUpdateValue,
  onDeleteRecord
}) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRecordValues, setNewRecordValues] = useState({});

  // Editing state
  const [editingRecordId, setEditingRecordId] = useState(null);
  const [editRecordValues, setEditRecordValues] = useState({}); // { [schemaMetadataId]: { vfvId, value } }
  const [showEditForm, setShowEditForm] = useState(false);

  // Distinct record IDs
  const recordIds = [...new Set(fieldValues.map(fv => fv.recordId))];

  // Assume all share the same objectName
  const objectName = metadataList.length > 0 ? metadataList[0].objectName : 'Unknown';

  // ------------------
  // ADD NEW RECORD
  // ------------------
  const handleOpenAddForm = () => {
    // Prepare newRecordValues with empty strings for each field
    const initial = {};
    metadataList.forEach(md => {
      initial[md.id] = '';
    });
    setNewRecordValues(initial);
    setShowAddForm(true);
  };

  const handleCloseAddForm = () => {
    setShowAddForm(false);
  };

  const handleChangeNewValue = (schemaId, val) => {
    setNewRecordValues(prev => ({
      ...prev,
      [schemaId]: val
    }));
  };

  const handleCreateNewRecord = () => {
    // For demonstration, pick the next recordId (max + 1)
    const maxRecordId = recordIds.length === 0 ? 0 : Math.max(...recordIds);
    const newRecordId = maxRecordId + 1;

    // POST each field
    const promises = metadataList.map(md => {
      return onCreateValue({
        schemaMetadataId: md.id,
        recordId: newRecordId,
        value: newRecordValues[md.id]
      });
    });

    Promise.all(promises)
      .then(() => {
        setShowAddForm(false);
      })
      .catch(err => console.error('Error creating new record:', err));
  };

  // -------------------
  // EDIT AN EXISTING RECORD
  // -------------------
  const handleOpenEditForm = (recordId) => {
    setEditingRecordId(recordId);
    
    // Build a map for the existing field values
    // Key: schemaMetadataId; Value: { vfvId, value }
    const currentValues = {};
    // For each field in metadata
    metadataList.forEach(md => {
      const existingField = fieldValues.find(
        fv => fv.recordId === recordId && fv.schemaMetadataId === md.id
      );
      if (existingField) {
        currentValues[md.id] = { vfvId: existingField.id, value: existingField.value };
      } else {
        // If field doesn't exist, user can add it
        currentValues[md.id] = { vfvId: null, value: '' };
      }
    });

    setEditRecordValues(currentValues);
    setShowEditForm(true);
  };

  const handleCloseEditForm = () => {
    setShowEditForm(false);
    setEditingRecordId(null);
    setEditRecordValues({});
  };

  const handleChangeEditValue = (schemaId, val) => {
    setEditRecordValues(prev => ({
      ...prev,
      [schemaId]: {
        ...prev[schemaId],
        value: val
      }
    }));
  };

  const handleSaveEditRecord = () => {
    // For each field in editRecordValues:
    // If we have a vfvId, call onUpdateValue
    // If vfvId is null, call onCreateValue
    const updatePromises = Object.entries(editRecordValues).map(([schemaId, data]) => {
      const { vfvId, value } = data;
      if (!vfvId) {
        // This field didn't exist, so create a new vfv
        return onCreateValue({
          schemaMetadataId: parseInt(schemaId, 10),
          recordId: editingRecordId,
          value
        });
      } else {
        // Update existing field
        return onUpdateValue(vfvId, {
          schemaMetadataId: parseInt(schemaId, 10),
          recordId: editingRecordId,
          value
        });
      }
    });

    Promise.all(updatePromises)
      .then(() => {
        setShowEditForm(false);
        setEditingRecordId(null);
        setEditRecordValues({});
      })
      .catch(err => console.error('Error updating record:', err));
  };

  // -------------------
  // DELETE ENTIRE RECORD
  // -------------------
  const handleDeleteRecord = (recordId) => {
    if (!window.confirm(`Delete record ${recordId}?`)) return;
    onDeleteRecord(recordId);
  };

  return (
    <div className="container-fluid my-4">
      <div className="d-flex align-items-center mb-3" style={{ gap: '1rem' }}>
        <h2 className="mb-3">{objectName} Records</h2>
        {/* ADD NEW RECORD BUTTON */}
        <div className="mb-3">
          <button
            className="btn btn-success"
            onClick={handleOpenAddForm}
          >
            Add New Record
          </button>
        </div>
      </div>
  
  
      {/* RECORD TABLE */}
      <table className="table table-bordered table-hover">
        <thead className="thead-light">
          <tr>
            {metadataList.map(md => (
              <th key={md.id}>{md.fieldName}</th>
            ))}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {recordIds.map(rid => (
            <tr key={rid}>
              {metadataList.map(md => {
                const match = fieldValues.find(
                  fv => fv.recordId === rid && fv.schemaMetadataId === md.id
                );
                return (
                  <td key={md.id}>{match ? match.value : ''}</td>
                );
              })}
              <td>
                <div className="d-flex" style={{ gap: "0.5rem" }}>
                  <button
                    className="btn btn-primary btn-sm me-2"
                    onClick={() => handleOpenEditForm(rid)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeleteRecord(rid)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
  
      {/* ADD NEW RECORD MODAL */}
      {showAddForm && (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New Record</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseAddForm}
                ></button>
              </div>
              <div className="modal-body" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {metadataList.map(md => (
                  <div key={md.id} className="mb-3">
                    <label className="form-label">{md.fieldName}: </label>
                    <input
                      type="text"
                      className="form-control"
                      value={newRecordValues[md.id] || ''}
                      onChange={e => handleChangeNewValue(md.id, e.target.value)}
                    />
                  </div>
                ))}
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-success"
                  onClick={handleCreateNewRecord}
                >
                  Save
                </button>
                <button
                  className="btn btn-dark"
                  onClick={handleCloseAddForm}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT EXISTING RECORD MODAL */}
      {showEditForm && (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Record {editingRecordId}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseEditForm}
                ></button>
              </div>
              <div className="modal-body" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {metadataList.map(md => {
                  const data = editRecordValues[md.id];
                  return (
                    <div key={md.id} className="mb-3">
                      <label className="form-label">{md.fieldName}: </label>
                      <input
                        type="text"
                        className="form-control"
                        value={data.value}
                        onChange={e => handleChangeEditValue(md.id, e.target.value)}
                      />
                    </div>
                  );
                })}
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-success"
                  onClick={handleSaveEditRecord}
                >
                  Save
                </button>
                <button
                  className="btn btn-dark"
                  onClick={handleCloseEditForm}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
  
}

const modalStyle = {
  position: 'fixed',
  top: '20%',
  left: '30%',
  width: '40%',
  backgroundColor: '#fff',
  padding: '1rem',
  border: '1px solid #ccc',
  zIndex: 999
};

export default VirtualRecords;
