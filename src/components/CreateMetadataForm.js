import React, { useEffect, useState } from 'react';
import { createMetadata } from '../api/schemaMetadataService';

function CreateMetadataForm({ onCreate, objectName }) {
  const [formData, setFormData] = useState({
    objectName: objectName,  // Default from parent
    fieldName: '',
    dataType: '',
    createdByName: 'GuestUser'
  });

  // If objectName can change at runtime in the parent, keep it in sync:
  useEffect(() => {
    setFormData(prev => ({ ...prev, objectName }));
  }, [objectName]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createMetadata(formData)
      .then(response => {
        onCreate(response.data);
        setFormData({
          objectName: objectName, // reset to default
          fieldName: '',
          dataType: '',
          createdByName: 'GuestUser'
        });
      })
      .catch(error => console.error(error));
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Create New Field</h3>

      {/* Read-Only or Hidden Input for Object Name */}
      <div>
        <label>Object Name:</label>
        <input
          name="objectName"
          value={formData.objectName}
          readOnly  // user can't edit
        />
      </div>

      {/* Other fields */}
      <div>
        <label>Field Name:</label>
        <input
          name="fieldName"
          value={formData.fieldName}
          onChange={handleChange}
          required
        />
      </div>
      {/* Dropdown for Data Type */}
      <div>
        <label>Data Type:</label>
        <select
          name="dataType"
          value={formData.dataType}
          onChange={handleChange}
          required
        >
          <option value="">Select Type</option>
          <option value="TEXT">Text</option>
          <option value="NUMBER">Number</option>
        </select>
      </div>
      <div>
      <div>
        <label>Created By:</label>
        <input
          name="createdByName"
          value="GuestUser"
          readOnly  // user cannot edit
        />
      </div>
      </div>
      <button type="submit">Create</button>
    </form>
  );
}

export default CreateMetadataForm;
