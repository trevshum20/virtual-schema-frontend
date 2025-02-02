import axios from 'axios';
import React, { useEffect, useState } from 'react';
import SchemaMetadataList from './SchemaMetadataList';
import VirtualRecords from './VirtualRecords';

function VirtualSchemaManager() {
  // All data stored here
  const [metadataList, setMetadataList] = useState([]);
  const [fieldValues, setFieldValues] = useState([]);
  let baseUrl = process.env.REACT_APP_BACKEND_BASE_URL;

  // Fetch all data once on mount
  useEffect(() => {
    fetchAllData();
  }, []);

  // A single function to fetch both metadata and field values
  const fetchAllData = () => {
    let newUrl = `${process.env.REACT_APP_BACKEND_BASE_URL}/login`;
    Promise.all([
      axios.get(`${baseUrl}/api/schema-metadata`, { withCredentials: true }),
      axios.get(`${baseUrl}/api/virtual-field-values`, { withCredentials: true })
    ])
    .then(([metaRes, fvRes]) => {
      if (typeof metaRes.data === "string" && metaRes.data.includes("<!DOCTYPE html")) {
        window.location.href = newUrl;
        return;
      } else if (Array.isArray(metaRes.data)) {
        setMetadataList(metaRes.data);
      } else {
        console.log("Unexpected data type from /api/schema-metadata:");
        console.log("Type:", typeof metaRes.data);
        console.log("Raw data:", metaRes.data);
        console.log("Stringified data:", JSON.stringify(metaRes.data));
        return;
      }
    
      if (typeof fvRes.data === "string" && fvRes.data.includes("<!DOCTYPE html")) {
        window.location.href = newUrl;
        return;
      } else if (Array.isArray(fvRes.data)) {
        setFieldValues(fvRes.data);
      } else {
        console.log("Unexpected data type from /api/virtual-field-values:");
        console.log("Type:", typeof fvRes.data);
        console.log("Raw data:", fvRes.data);
        console.log("Stringified data:", JSON.stringify(fvRes.data));
        return;
      }
    })
    .catch(error => {
      if (error.response && error.response.status === 302) {
        console.error('302 redirect. Changing window to login page');
        window.location.href = newUrl;
      } else {
        console.error('Error fetching data:', error);
      }
    });
  };

  // --------------
  // CRUD FOR SCHEMA METADATA
  // --------------
  const createSchemaField = (newField) => {
    return axios.post(`${baseUrl}/api/schema-metadata`, newField, { withCredentials: true })
      .then(() => {
        // Re-fetch or do a partial update
        fetchAllData();
      });
  };

  const deleteSchemaField = (id) => {
    return axios.delete(`${baseUrl}/api/schema-metadata/${id}`, { withCredentials: true })
      .then(() => {
        fetchAllData();
      });
  };

  const onUpdateField = (id, updatedField) => {
    // "id" is the primary key of the schema_metadata record
    // "updatedField" is an object containing the new values (objectName, fieldName, dataType, createdByName)

    return axios.put(`${baseUrl}/api/schema-metadata/${id}`, updatedField, { withCredentials: true })
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
    return axios.post(`${baseUrl}/api/virtual-field-values`, data, { withCredentials: true })
      .then(() => {
        fetchAllData();
      });
  };

  const updateVirtualFieldValue = (id, data) => {
    return axios.put(`${baseUrl}/api/virtual-field-values/${id}`, data, { withCredentials: true })
      .then(() => {
        fetchAllData();
      });
  };

  const deleteRecordById = (recordId) => {
    return axios.delete(`${baseUrl}/api/virtual-field-values/record/${recordId}`, { withCredentials: true })
      .then(() => {
        fetchAllData();
      });
  };

  const changeDataTypeByMetadataId = (metadataId) => {
    return axios.get(`${baseUrl}/api/virtual-field-values/mass-type-change/${metadataId}`, { withCredentials: true })
      .then(() => {
        fetchAllData();
      });
  }

  const truncateFieldLengthByMetadataId = (metadataId, newLength) => {
    return axios.get(`${baseUrl}/api/virtual-field-values/mass-truncate/${metadataId}/${newLength}`, { withCredentials: true })
    .then(() => {
      fetchAllData();
    });
  }

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
        onDecreaseMaxLength={truncateFieldLengthByMetadataId}
        onChangeTypeToNumber={changeDataTypeByMetadataId}
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
