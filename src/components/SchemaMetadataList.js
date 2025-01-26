import React, { useState } from 'react';

function SchemaMetadataList({ metadataList, onCreateField, onDeleteField, onUpdateField }) {
  const [newFieldName, setNewFieldName] = useState('');
  const [newDataType, setNewDataType] = useState('');

  // For inline editing
  const [editingId, setEditingId] = useState(null);
  const [editFieldName, setEditFieldName] = useState('');
  const [editDataType, setEditDataType] = useState('');

  // Determine the objectName (assume all metadata share the same object)
  const objectName = metadataList.length > 0
    ? metadataList[0].objectName
    : 'Unknown';

  // CREATE a new column
  const handleCreateField = () => {
    const newField = {
      objectName: objectName, // or dynamic if needed
      fieldName: newFieldName,
      dataType: newDataType,
      createdByName: 'GuestUser'
    };

    onCreateField(newField)
      .then(() => {
        setNewFieldName('');
        setNewDataType('');
      })
      .catch(err => console.error('Error creating schema field:', err));
  };

  // DELETE a column
  const handleDeleteField = (id) => {
    if (!window.confirm('Are you sure you want to delete this field?')) return;
    onDeleteField(id)
      .catch(err => console.error('Error deleting schema field:', err));
  };

  // EDIT a column (start editing mode)
  const handleEdit = (md) => {
    setEditingId(md.id);
    setEditFieldName(md.fieldName);
    setEditDataType(md.dataType);
  };

  // CANCEL editing
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditFieldName('');
    setEditDataType('');
  };

  // SAVE edited column
  const handleSaveEdit = (id) => {
    const updatedField = {
      objectName: objectName, // keep same object
      fieldName: editFieldName,
      dataType: editDataType,
      createdByName: 'GuestUser' // or track the original, if needed
    };

    onUpdateField(id, updatedField)
      .then(() => {
        // reset edit state
        setEditingId(null);
        setEditFieldName('');
        setEditDataType('');
      })
      .catch(err => console.error('Error updating schema field:', err));
  };

  return (
    <div className="container-fluid">
      {/* Display the object name */}
      <h2 className="my-4">{objectName} Object Fields</h2>

      {/* Row for table and input form */}
      <div className="row" style={{ gap: "3rem" }}>
        {/* Table Section */}
        <div className="col-md-7">
          <div id="table-section">
            <table className="table table-bordered custom-table">
              <thead className="thead-light">
                <tr>
                  <th>Field Name</th>
                  <th>Data Type</th>
                  <th>Created By</th>
                  <th>Created Date/Time</th>
                  <th style={{ width: "1%" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {metadataList.map(md => {
                  const isEditing = md.id === editingId;
                  return (
                    <tr key={md.id}>
                      <td>
                        {isEditing ? (
                          <input
                            type="text"
                            className="form-control"
                            value={editFieldName}
                            onChange={e => setEditFieldName(e.target.value)}
                          />
                        ) : (
                          md.fieldName
                        )}
                      </td>
                      <td>
                        {isEditing ? (
                          <select
                            className="form-select"
                            value={editDataType}
                            onChange={e => setEditDataType(e.target.value)}
                          >
                            <option value="TEXT">Text</option>
                            <option value="NUMBER">Number</option>
                          </select>
                        ) : (
                          md.dataType
                        )}
                      </td>
                      <td>{md.createdByName}</td>
                      <td>{md.createdDate}</td>
                      <td>
                        <div className="d-flex" style={{ gap: "0.5rem" }}>
                          {isEditing ? (
                            <>
                              <button
                                className="btn btn-success btn-sm me-2"
                                onClick={() => handleSaveEdit(md.id)}
                              >
                                Save
                              </button>
                              <button
                                className="btn btn-dark btn-sm"
                                onClick={handleCancelEdit}
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                className="btn btn-primary btn-sm me-2"
                                onClick={() => handleEdit(md)}
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => handleDeleteField(md.id)}
                              >
                                Delete
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Input Form Section */}
        <div className="col-md-4">
          <div id="form-section">


            <h3 className="mb-3">Add a New Field</h3>
            <form>
              <div className="mb-3">
                <label className="form-label">Object Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={objectName}
                  readOnly
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Created By</label>
                <input
                  type="text"
                  className="form-control"
                  value="GuestUser"
                  readOnly
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Field Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Field Name"
                  value={newFieldName}
                  onChange={e => setNewFieldName(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Data Type</label>
                <select
                  className="form-select"
                  value={newDataType}
                  onChange={e => setNewDataType(e.target.value)}
                >
                  <option value="">Select Data Type</option>
                  <option value="TEXT">Text</option>
                  <option value="NUMBER">Number</option>
                </select>
              </div>
              <button
                type="button"
                className="btn btn-success"
                onClick={handleCreateField}
              >
                Create Field
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SchemaMetadataList;