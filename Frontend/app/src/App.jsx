import React, { useState } from 'react';
import Dashboard from './dashboard';
import Auth from './auth';
import { BrowserRouter, Routes, Route} from 'react-router-dom';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/auth" element={<Auth />} />        
      </Routes>
    </BrowserRouter>
  )
}

export default App;
