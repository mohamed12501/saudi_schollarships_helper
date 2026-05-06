import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import ProgramDetails from './pages/ProgramDetails';
import { ProgramsProvider } from './context/ProgramsContext';

function App() {
  return (
    <Router>
      <ProgramsProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/program/:id" element={<ProgramDetails />} />
            {/* Catch all route - redirect to home */}
            <Route path="*" element={<Home />} />
          </Routes>
        </Layout>
      </ProgramsProvider>
    </Router>
  );
}

export default App;
