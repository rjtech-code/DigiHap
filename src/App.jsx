import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProfileProvider } from './context/ProfileContext';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import WardDetails from './pages/WardDetails';
import Profile from './pages/Profile';

function App() {
  return (
    <LanguageProvider>
      <ProfileProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/ward/:id" element={<WardDetails />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </div>
        </Router>
      </ProfileProvider>
    </LanguageProvider>
  );
}

export default App;

