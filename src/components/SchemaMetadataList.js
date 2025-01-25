import React, { useEffect, useState } from 'react';
import { deleteMetadata, getAllMetadata, updateMetadata } from '../api/schemaMetadataService';
import CreateMetadataForm from './CreateMetadataForm';

function SchemaMetadataList() {
  const [metadataList, setMetadataList] = useState([]);
  const [objectName, setObjectName] = useState('');

  // Track the record being edited
  const [editingId, setEditingId] = useState(null);
  const [editFieldName, setEditFieldName] = useState('');
  const [editDataType, setEditDataType] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    getAllMetadata()
    .then(response => {
      // Store the entire list
      setMetadataList(response.data);

      // If there's at least one record, use its objectName
      if (response.data.length > 0) {
        setObjectName(response.data[0].objectName);
      } else {
        setObjectName('Unknown'); // or handle empty scenario
      }
    })
    .catch(error => console.error(error));
  }
  
  const handleDelete = (id) => {
    deleteMetadata(id)
      .then(() => {
        setMetadataList(prev => prev.filter(item => item.id !== id));
      })
      .catch(error => console.error(error));
  };

  const handleCreate = (newItem) => {
    setMetadataList(prev => [...prev, newItem]);
    fetchData();
  };

  // 1. Start editing a record
  const startEditing = (id, currentFieldName, currentDataType) => {
    setEditingId(id);
    setEditFieldName(currentFieldName);
    setEditDataType(currentDataType);
  };

  // 2. Cancel editing
  const cancelEditing = () => {
    setEditingId(null);
    setEditFieldName('');
    setEditDataType('');
  };

  // 3. Save edits
  const saveEdits = (id) => {
    const updated = {
      // other fields like objectName, createdByName unchanged from DB,
      // but we only need to send updated fields plus anything required by the API
      objectName: objectName,
      fieldName: editFieldName,
      dataType: editDataType,
      createdByName: 'GuestUser' // or set from the original record if needed
    };

    updateMetadata(id, updated)
      .then(response => {
        // Update the list with the updated record
        setMetadataList(prevList =>
          prevList.map(item =>
            item.id === id
              ? { ...item, fieldName: editFieldName, dataType: editDataType }
              : item
          )
        );
        cancelEditing();
      })
      .catch(error => console.error(error));
  };

  return (
    <div>
      <h2>Schema for {objectName} Object</h2>
      <CreateMetadataForm onCreate={handleCreate} objectName={objectName} />

      <table border="1">
        <thead>
          <tr>
            <th>Field Name</th>
            <th>Data Type</th>
            <th>Created By</th>
            <th>Created Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {metadataList.map(item => {
            const isEditing = (item.id === editingId);

            return (
              <tr key={item.id}>
                {/* If editing, show input fields; otherwise, show text */}
                <td>
                  {isEditing ? (
                    <input
                      value={editFieldName}
                      onChange={(e) => setEditFieldName(e.target.value)}
                    />
                  ) : (
                    item.fieldName
                  )}
                </td>
                <td>
                  {isEditing ? (
                    <select
                      value={editDataType}
                      onChange={(e) => setEditDataType(e.target.value)}
                    >
                      <option value="TEXT">Text</option>
                      <option value="NUMBER">Number</option>
                    </select>
                  ) : (
                    item.dataType
                  )}
                </td>
                <td>{item.createdByName}</td>
                <td>{item.createdDate ?? 'N/A'}</td>
                <td>
                  {isEditing ? (
                    <>
                      <button onClick={() => saveEdits(item.id)}>Save</button>
                      <button onClick={cancelEditing}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() =>
                          startEditing(item.id, item.fieldName, item.dataType)
                        }
                      >
                        Edit
                      </button>
                      <button onClick={() => handleDelete(item.id)}>Delete</button>
                    </>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default SchemaMetadataList;
