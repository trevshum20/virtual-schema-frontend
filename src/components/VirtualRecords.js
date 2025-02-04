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

  const [pendingRequests, setPendingRequests] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Editing state
  const [editingRecordId, setEditingRecordId] = useState(null);
  const [editRecordValues, setEditRecordValues] = useState({}); // { [schemaMetadataId]: { vfvId, value } }
  const [showEditForm, setShowEditForm] = useState(false);

  // Distinct record IDs
  const recordIds = [...new Set(fieldValues.map(fv => fv.recordId))];

  // Assume all share the same objectName
  const objectName = metadataList.length > 0 ? metadataList[0].objectName : 'Unknown';

  const getMaxNumber = (maxLength) => {
    if (maxLength >= 12) {
      return 999999999999;
    } else {
      let finalMaxNumber = '';
      for (let i = 0; i < maxLength; i++) {
        finalMaxNumber += '9';
      }
      return parseInt(finalMaxNumber);
    }
  }

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

  const handleCreateNewRecord = (event) => {
    event.preventDefault();
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

  // Close Edit Form
  const handleCloseEditForm = () => {
    setShowEditForm(false);
    setEditingRecordId(null);
    setEditRecordValues({});
  };

  // Handle Input Change for Edit
  const handleChangeEditValue = (schemaId, val) => {
    val = `${val}`;
    setEditRecordValues(prev => ({
      ...prev,
      [schemaId]: {
        ...prev[schemaId],
        value: val
      }
    }));
  };

  // Save Edited Record
  const handleSaveEditRecord = async (event) => {
    event.preventDefault();
    if (isSubmitting) return; // Prevent duplicate submissions
    setIsSubmitting(true);

    const updatePromises = Object.entries(editRecordValues)
      .filter(([schemaId, data]) => {
        const oldValueObj = fieldValues.find(
          fv => fv.recordId === editingRecordId && fv.schemaMetadataId === parseInt(schemaId, 10)
        );
        const oldValue = oldValueObj ? oldValueObj.value : null;
        const newValue = data.value;

        if (oldValue === newValue) {
          return false;
        }
        return true;
      })
      .map(async ([schemaId, data]) => {
        setPendingRequests(prev => prev + 1); // Start tracking request

        const { vfvId, value } = data;
        try {
          const result = vfvId
            ? await onUpdateValue(vfvId, {
              schemaMetadataId: parseInt(schemaId, 10),
              recordId: editingRecordId,
              value,
            })
            : await onCreateValue({
              schemaMetadataId: parseInt(schemaId, 10),
              recordId: editingRecordId,
              value,
            });
        } catch (error) {
          console.error(`Update failed for schemaId ${schemaId}`, error);
        } finally {
          setPendingRequests(prev => prev - 1); // Decrease counter when request is done
        }
      });

    await Promise.all(updatePromises); // Ensure all requests finish before proceeding

    setIsSubmitting(false); // Allow new submissions
    setShowEditForm(false);
    setEditingRecordId(null);
    setEditRecordValues({});
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
              <div>
                <form onSubmit={handleCreateNewRecord}>
                  <div className="modal-body" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    {metadataList.map(md => (
                      <div key={md.id} className="mb-3">
                        <label className="form-label">{md.fieldName}: </label>
                        <input
                          type={md.dataType === "NUMBER" ? "number" : "text"}
                          className="form-control"
                          value={newRecordValues[md.id] || ''}
                          onChange={e => handleChangeNewValue(md.id, `${e.target.value}`)}
                          required={md.requiredField}
                          maxLength={md.dataType === "TEXT" ? md.maxLength : undefined}
                          max={md.dataType === "NUMBER" ? getMaxNumber(md.maxLength) : undefined}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="modal-footer">
                    <button
                      type="submit"
                      className="btn btn-success"
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
                </form>
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
              <form onSubmit={handleSaveEditRecord}>
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
                          type={md.dataType === "NUMBER" ? "number" : "text"}
                          className="form-control"
                          value={
                            md.dataType === "NUMBER"
                              ? editRecordValues[md.id]?.value === "" // If empty, show empty input
                                ? ""
                                : parseFloat(editRecordValues[md.id]?.value) || 0 // Convert to number safely
                              : editRecordValues[md.id]?.value || ""
                          }
                          onChange={(e) => {
                            let newValue = e.target.value;
                            if (md.dataType === "NUMBER") {
                              newValue = newValue === "" ? "" : parseFloat(newValue); // Allow empty values
                            }
                            handleChangeEditValue(md.id, newValue);
                          }}
                          required={md.requiredField}
                          maxLength={md.dataType === "TEXT" ? md.maxLength : undefined}
                          max={md.dataType === "NUMBER" ? getMaxNumber(md.maxLength) : undefined}
                        />
                      </div>
                    );
                  })}
                </div>
                <div className="modal-footer">
                  <button
                    type="submit"
                    className="btn btn-success"
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
              </form>
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
