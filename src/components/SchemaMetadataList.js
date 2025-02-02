import React, { useState } from 'react';

function SchemaMetadataList({ metadataList, onCreateField, onDeleteField, onUpdateField, onDecreaseMaxLength, onChangeTypeToNumber }) {
  const [newFieldName, setNewFieldName] = useState('');
  const [newDataType, setNewDataType] = useState('TEXT');
  const [newRequiredField, setNewRequiredField] = useState('false');
  const [newMaxLength, setNewMaxLength] = useState('255');

  // For inline editing
  const [editingId, setEditingId] = useState(null);
  const [editFieldName, setEditFieldName] = useState('');
  const [editDataType, setEditDataType] = useState('');
  const [editRequiredField, setEditRequiredField] = useState('');
  const [editMaxLength, setEditMaxLength] = useState('');

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
      createdByName: 'GuestUser',
      requiredField: newRequiredField,
      maxLength: newMaxLength
    };

    onCreateField(newField)
      .then(() => {
        setNewFieldName('');
        setNewDataType('');
        setNewMaxLength(255);
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
    setEditRequiredField(md.requiredField);
    setEditMaxLength(md.maxLength);

  };

  // CANCEL editing
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditFieldName('');
    setEditDataType('');
    setEditRequiredField('');
    setEditMaxLength('')
  };

  const getRequiredValue = (requiredValue) => {
    let returnString = "-";
    if (requiredValue === true) {
      returnString = "true";
    }
    return returnString;
  }

  // SAVE edited column
  const handleSaveEdit = (md) => {
    if (!editingId) return;

    // Check if data type is changing from TEXT to NUMBER
    if (md.dataType === 'TEXT' && editDataType === 'NUMBER') {
      if (window.confirm("If you change the datatype from TEXT to NUMBER, all the data currently in that column will be deleted and cannot be restored. Is this okay?")) {
        onChangeTypeToNumber(md.id).then(handleCancelEdit);
      } else {
        handleCancelEdit();
        return;
      }
    }

    // Check if max length is decreasing
    if (parseInt(editMaxLength) < parseInt(md.maxLength) && md.dataType === 'TEXT') {
      if (window.confirm(`If you reduce the max length to ${editMaxLength}, all values with length greater than ${editMaxLength} will be truncated to ${editMaxLength} and the data cannot be restored. Is this okay?`)) {
        onDecreaseMaxLength(md.id, editMaxLength).then(handleCancelEdit);
      } else {
        handleCancelEdit();
        return;
      }
    }
    
    // Proceed with normal update if there are no special conditions
    const updatedField = {
      objectName: objectName, // keep same object
      fieldName: editFieldName,
      dataType: editDataType,
      requiredField: editRequiredField,
      maxLength: editMaxLength,
      createdByName: 'GuestUser' // or track the original, if needed
    };
    
    // console.log(`>>> required: ${updatedField.requiredField}\nmax length: ${updatedField.maxLength}`);

    onUpdateField(md.id, updatedField)
      .then(() => {
        // reset edit state
        setEditingId(null);
        setEditFieldName('');
        setEditDataType('');
        setEditRequiredField('');
        setEditMaxLength('');
      })
      .catch(err => console.error('Error updating schema field:', err));
  };

  return (
    <div className="container-fluid">
      {/* Display the object name */}

      {/* Row for table and input form */}
      <div className="row" style={{ gap: "3rem" }}>
        {/* Table Section */}
        <div className="col-md-8">
          <h2 className="my-4">{objectName} Object Fields</h2>
          <div id="table-section">
            <table className="table table-bordered custom-table">
              <thead className="thead-light">
                <tr>
                  <th>Field Name</th>
                  <th>Data Type</th>
                  <th>Required?</th>
                  <th>Max Length</th>
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
                            <option value="TEXT">TEXT</option>
                            <option value="NUMBER">NUMBER</option>
                          </select>
                        ) : (
                          md.dataType
                        )}
                      </td>
                      <td>
                        {isEditing ? (
                          <select
                            className="form-select"
                            value={editRequiredField}
                            onChange={e => setEditRequiredField(e.target.value)}
                          >
                            <option value="true">TRUE</option>
                            <option value="false">FALSE</option>
                          </select>
                        ) : (
                          getRequiredValue(md.requiredField)
                        )}
                      </td>
                      <td>
                        {isEditing ? (
                          <input
                            type="number"
                            value={editMaxLength}
                            onChange={e => setEditMaxLength(e.target.value)}
                          ></input>
                        ) : (
                          md.maxLength
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
                                onClick={() => handleSaveEdit(md)}
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

        {/* New Field Form */}
        <div className="col-md-3">
          <br></br><br></br><br></br>
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
                  maxLength="255"
                />
              </div>
              <div className="d-flex gap-3" style={{ gap: "3rem" }}>
                <div className="mb-3">
                  <label className="form-label">Data Type</label><br></br>
                  <select
                    className="form-select"
                    value={newDataType}
                    onChange={e => setNewDataType(e.target.value)}
                  >
                    <option value="TEXT">TEXT</option>
                    <option value="NUMBER">NUMBER</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Required?</label><br></br>
                  <select
                    className="form-select"
                    value={newRequiredField}
                    onChange={e => setNewRequiredField(e.target.value)}
                  >
                    <option value="false">FALSE</option>
                    <option value="true">TRUE</option>
                  </select>
                </div>
                <div className="mb-3">
                <label className="form-label">Max Length</label><br></br>
                <input
                  type="number"
                  value={newMaxLength}
                  onChange={e => setNewMaxLength(e.target.value)}
                ></input>
              </div>
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