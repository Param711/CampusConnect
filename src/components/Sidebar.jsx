import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, Megaphone, Calendar, Bookmark, 
  WifiOff, LogIn, LogOut, User, PlusCircle 
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import AuthModal from './AuthModal';
import AdminCreator from './AdminCreator';

const Sidebar = () => {
  const { 
    simulateDelay, 
    setSimulateDelay, 
    simulateError, 
    setSimulateError,
    savedNotices,
    savedEvents,
    currentUser,
    logoutUser
  } = useDashboard();

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  const totalSaved = savedNotices.length + savedEvents.length;
  const isAdmin = currentUser?.role === 'admin';

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
                <span className="badge-counter">{totalSaved}</span>
              )}
            </NavLink>

            {isAdmin && (
              <button 
                onClick={() => setIsAdminOpen(true)}
                className="sidebar-link"
                style={{ 
                  width: '100%', 
                  background: 'rgba(99, 102, 241, 0.12)', 
                  color: 'var(--color-academic-text)',
                  border: '1px solid rgba(99, 102, 241, 0.25)',
                  marginTop: '1rem',
                  cursor: 'pointer'
                }}
              >
                <PlusCircle size={20} style={{ color: 'var(--color-academic-text)' }} />
                <span style={{ fontWeight: '600' }}>Create Content</span>
              </button>
            )}
          </nav>
        </div>

        <div>
          {/* User Session profile area */}
          <div className="user-profile-section">
            {currentUser ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div className="user-avatar">
                    <User size={18} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-primary)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                      {currentUser.name}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      {currentUser.role}
                    </span>
                  </div>
                </div>
                <button className="sidebar-link btn-logout" onClick={logoutUser}>
                  <LogOut size={16} />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <button className="sidebar-link btn-login" onClick={() => setIsAuthOpen(true)}>
                <LogIn size={18} />
                <span>Sign In / Register</span>
              </button>
            )}
          </div>

          {/* Debug Simulation Controls in Sidebar Footer */}
          <div className="sidebar-footer-controls">
            <h4 style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
              Simulate Network
            </h4>
            
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

            <label className="sim-control-label" style={{ marginTop: '0.45rem' }}>
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

        {isAdmin && (
          <button 
            onClick={() => setIsAdminOpen(true)}
            className="mobile-nav-link"
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <PlusCircle size={20} style={{ color: 'var(--color-academic-text)' }} />
            <span>Create</span>
          </button>
        )}
        
        <NavLink to="/events" className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}>
          <Calendar size={20} />
          <span>Events</span>
        </NavLink>
        
        <button 
          onClick={currentUser ? logoutUser : () => setIsAuthOpen(true)}
          className="mobile-nav-link"
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        >
          {currentUser ? <LogOut size={20} /> : <LogIn size={20} />}
          <span>{currentUser ? 'Logout' : 'Sign In'}</span>
        </button>
      </nav>

      {/* Modal Dialog Portals */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      <AdminCreator isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />
    </>
  );
};

export default Sidebar;
