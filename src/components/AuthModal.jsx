import React, { useState } from 'react';
import { X, LogIn, UserPlus, AlertCircle, Loader2 } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';

const AuthModal = ({ isOpen, onClose }) => {
  const { loginUser, registerUser } = useDashboard();
  const [isLogin, setIsLogin] = useState(true);
  
  // Form fields
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('student');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        if (!email.trim()) throw new Error('Email is required.');
        await loginUser(email.trim());
      } else {
        if (!name.trim()) throw new Error('Name is required.');
        if (!email.trim()) throw new Error('Email is required.');
        await registerUser(name.trim(), email.trim(), role);
      }
      onClose();
    } catch (err) {
      setError(err.message || 'An authentication error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={18} />
        </button>

        <div className="modal-tabs">
          <button 
            className={`modal-tab ${isLogin ? 'active' : ''}`} 
            onClick={() => { setIsLogin(true); setError(''); }}
          >
            <LogIn size={16} />
            <span>Sign In</span>
          </button>
          <button 
            className={`modal-tab ${!isLogin ? 'active' : ''}`} 
            onClick={() => { setIsLogin(false); setError(''); }}
          >
            <UserPlus size={16} />
            <span>Create Account</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ marginTop: '1.5rem' }}>
          {error && (
            <div className="form-error-banner">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {!isLogin && (
            <div className="form-group">
              <label className="form-label" htmlFor="auth-name">Full Name</label>
              <input 
                id="auth-name"
                type="text" 
                placeholder="e.g. John Doe" 
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="auth-email">Campus Email</label>
            <input 
              id="auth-email"
              type="email" 
              placeholder="e.g. john@campus.edu" 
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label className="form-label" htmlFor="auth-role">I am a</label>
              <select 
                id="auth-role"
                className="form-input" 
                value={role} 
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="student">Student</option>
                <option value="admin">Administrator (Admin)</option>
              </select>
            </div>
          )}

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
            {loading ? (
              <>
                <Loader2 size={16} className="spinner" />
                <span>Authenticating...</span>
              </>
            ) : (
              <span>{isLogin ? 'Sign In' : 'Sign Up'}</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
