import axios from 'axios';
import React, { useEffect, useState } from 'react';
import SchemaMetadataList from './SchemaMetadataList';
import VirtualRecords from './VirtualRecords';

function VirtualSchemaManager() {
  // All data stored here
  const [metadataList, setMetadataList] = useState([]);
  const [fieldValues, setFieldValues] = useState([]);

  // Fetch all data once on mount
  useEffect(() => {
    fetchAllData();
  }, []);

  // A single function to fetch both metadata and field values
  const fetchAllData = () => {
    Promise.all([
      axios.get('/api/schema-metadata', { withCredentials: true }),
      axios.get('/api/virtual-field-values', { withCredentials: true })
    ])
    .then(([metaRes, fvRes]) => {
      if (!Array.isArray(metaRes.data)) {
        console.log("Received non-array from /api/schema-metadata, possibly the login page. Redirecting to login.");
        window.location.href = "http://localhost:8080/login";
        return;
      }
      setMetadataList(metaRes.data);
      if (!Array.isArray(fvRes.data)) {
        console.log("Received non-array from /api/virtual-field-values, possibly the login page. Redirecting to login.");
        window.location.href = "http://localhost:8080/api/login";
        return;
      }
      setFieldValues(fvRes.data);
    })
    .catch(error => {
      if (error.response && error.response.status === 302) {
        window.location.href = 'http://localhost:8080/api/login';
      } else {
        console.error('Error fetching data:', error);
      }
    });
  };

  // --------------
  // CRUD FOR SCHEMA METADATA
  // --------------
  const createSchemaField = (newField) => {
    return axios.post('/api/schema-metadata', newField, { withCredentials: true })
      .then(() => {
        // Re-fetch or do a partial update
        fetchAllData();
      });
  };

  const deleteSchemaField = (id) => {
    return axios.delete(`/api/schema-metadata/${id}`, { withCredentials: true })
      .then(() => {
        fetchAllData();
      });
  };

  const onUpdateField = (id, updatedField) => {
    // "id" is the primary key of the schema_metadata record
    // "updatedField" is an object containing the new values (objectName, fieldName, dataType, createdByName)

    return axios.put(`/api/schema-metadata/${id}`, updatedField, { withCredentials: true })
      .then(() => {
        // After a successful update, refetch metadata to keep everything in sync
        fetchAllData();
      })
      .catch(err => {
        console.error('Error updating schema field:', err);
        throw err;
      });
  };

  // --------------
  // CRUD FOR VIRTUAL FIELD VALUES
  // --------------
  const createVirtualFieldValue = (data) => {
    return axios.post('/api/virtual-field-values', data, { withCredentials: true })
      .then(() => {
        fetchAllData();
      });
  };

  const updateVirtualFieldValue = (id, data) => {
    return axios.put(`/api/virtual-field-values/${id}`, data, { withCredentials: true })
      .then(() => {
        fetchAllData();
      });
  };

  const deleteRecordById = (recordId) => {
    return axios.delete(`/api/virtual-field-values/record/${recordId}`, { withCredentials: true })
      .then(() => {
        fetchAllData();
      });
  };

  // Alternatively, you can pass the entire object or more granular functions.
  // Some people prefer to do partial state updates rather than re-fetch from server each time.
  // For simplicity, we do a full fetchAllData() after each change.

  return (
    <div >
      {/* Pass down the data and CRUD methods */}
      <SchemaMetadataList
        metadataList={metadataList}
        onCreateField={createSchemaField}
        onDeleteField={deleteSchemaField}
        onUpdateField={onUpdateField}
      />

      <VirtualRecords
        metadataList={metadataList}
        fieldValues={fieldValues}
        onCreateValue={createVirtualFieldValue}
        onUpdateValue={updateVirtualFieldValue}
        onDeleteRecord={deleteRecordById}
      />
    </div>
  );
}

export default VirtualSchemaManager;
