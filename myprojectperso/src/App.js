import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import ExamGenerationForm from './Form';
import HomePage from './component/HomePage';
import './App.css';
import ExamPreview from './component/ExamPreview';




function App() {
    return (
        <Router>
            
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/examform" element={<ExamGenerationForm />} />
                <Route path="/exam-preview" element={<ExamPreview />} />
            </Routes>
        </Router>
    );
}

export default App;