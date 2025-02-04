import React from 'react';
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import './App.css';
import About from './components/About';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import VirtualSchemaManager from './components/VirtualSchemaManager';

function App() {
    return (
        <Router>
          <div style={{
            margin: "0", // Eliminate extra margins
            padding: "0", // Eliminate extra padding
          }}>
            <Navbar />
            <div style={{ margin: "8px", padding: "8px" }}>
              <Routes>
                <Route path="/" element={<VirtualSchemaManager/>} />
                <Route path="/about" element={<About />} />
              </Routes>
            </div>
            <Footer/>
          </div>
        </Router>
      );
}

export default App;
