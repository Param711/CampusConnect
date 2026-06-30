import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DashboardProvider } from './context/DashboardContext';
import Sidebar from './components/Sidebar';
import ThemeToggle from './components/ThemeToggle';

// Pages
import Dashboard from './pages/Dashboard';
import NoticesPage from './pages/NoticesPage';
import EventsPage from './pages/EventsPage';
import DetailPage from './pages/DetailPage';
import SavedItemsPage from './pages/SavedItemsPage';

function App() {
  return (
    <DashboardProvider>
      <Router>
        <div className="app-container">
          <Sidebar />
          <main className="main-content">
            <ThemeToggle />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/notices" element={<NoticesPage />} />
              <Route path="/notices/:id" element={<DetailPage type="notice" />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/events/:id" element={<DetailPage type="event" />} />
              <Route path="/saved" element={<SavedItemsPage />} />
              
              {/* Fallback route */}
              <Route path="*" element={
                <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                  <h1 className="page-title" style={{ fontSize: '1.75rem', marginBottom: '1rem', background: 'none', WebkitTextFillColor: 'initial', color: 'white' }}>
                    Page Not Found
                  </h1>
                  <p style={{ color: 'var(--text-secondary)' }}>The page you are looking for does not exist.</p>
                </div>
              } />
            </Routes>
          </main>
        </div>
      </Router>
    </DashboardProvider>
  );
}

export default App;
