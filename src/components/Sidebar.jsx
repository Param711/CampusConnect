import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Megaphone, Calendar, Bookmark, AlertCircle, WifiOff } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';

const Sidebar = () => {
  const { 
    simulateDelay, 
    setSimulateDelay, 
    simulateError, 
    setSimulateError,
    savedNotices,
    savedEvents
  } = useDashboard();

  const totalSaved = savedNotices.length + savedEvents.length;

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="sidebar">
        <div>
          <NavLink to="/" className="sidebar-logo">
            <div style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              color: 'white',
              fontSize: '1rem'
            }}>C</div>
            <span className="sidebar-logo-text">Campus Hub</span>
          </NavLink>
          
          <nav className="sidebar-menu">
            <NavLink to="/" end className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </NavLink>
            
            <NavLink to="/notices" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Megaphone size={20} />
              <span>Notices</span>
            </NavLink>
            
            <NavLink to="/events" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Calendar size={20} />
              <span>Events</span>
            </NavLink>
            
            <NavLink to="/saved" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Bookmark size={20} />
              <span>Saved Items</span>
              {totalSaved > 0 && (
                <span style={{
                  marginLeft: 'auto',
                  background: '#6366f1',
                  color: 'white',
                  borderRadius: '50%',
                  fontSize: '0.7rem',
                  width: '18px',
                  height: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold'
                }}>{totalSaved}</span>
              )}
            </NavLink>
          </nav>
        </div>

        {/* Debug Simulation Controls in Sidebar Footer */}
        <div style={{ 
          borderTop: '1px solid rgba(255, 255, 255, 0.05)', 
          paddingTop: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem'
        }}>
          <h4 style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Simulate Network</h4>
          
          <label className="sim-control-label">
            <input 
              type="checkbox" 
              checked={simulateDelay} 
              onChange={(e) => setSimulateDelay(e.target.checked)} 
            />
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              Delay API (1.2s)
            </span>
          </label>

          <label className="sim-control-label">
            <input 
              type="checkbox" 
              checked={simulateError} 
              onChange={(e) => setSimulateError(e.target.checked)} 
            />
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: simulateError ? 'var(--color-urgent-text)' : 'inherit' }}>
              <WifiOff size={14} /> Network Error
            </span>
          </label>
        </div>
      </aside>

      {/* Mobile Sticky Bottom Navigation */}
      <nav className="mobile-nav">
        <NavLink to="/" end className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>
        
        <NavLink to="/notices" className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}>
          <Megaphone size={20} />
          <span>Notices</span>
        </NavLink>
        
        <NavLink to="/events" className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}>
          <Calendar size={20} />
          <span>Events</span>
        </NavLink>
        
        <NavLink to="/saved" className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}>
          <div style={{ position: 'relative' }}>
            <Bookmark size={20} />
            {totalSaved > 0 && (
              <span style={{
                position: 'absolute',
                top: '-5px',
                right: '-10px',
                background: '#6366f1',
                color: 'white',
                borderRadius: '50%',
                fontSize: '0.6rem',
                width: '14px',
                height: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold'
              }}>{totalSaved}</span>
            )}
          </div>
          <span>Saved</span>
        </NavLink>
      </nav>
    </>
  );
};

export default Sidebar;
