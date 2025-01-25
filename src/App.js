import React, { useState } from 'react';
import SchemaMetadataList from './components/SchemaMetadataList';

function App() {
    const [message, setMessage] = useState('');

    // useEffect(() => {
    //     axios.get('/api/hello')
    //         .then(response => setMessage(response.data))
    //         .catch(error => console.error(error));
    // }, []);

    return (
        <div>
            <h1>Virtual Schema App</h1>
            <SchemaMetadataList/>
        </div>
    );
}

export default App;
