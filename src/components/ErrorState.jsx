import React from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';

const ErrorState = ({ message, onRetry }) => {
  return (
    <div className="error-container">
      <div className="error-icon-wrapper">
        <WifiOff size={40} />
      </div>
      <h2 className="error-title">Connection Interrupted</h2>
      <p className="error-message">
        {message || "We encountered an issue while trying to fetch the latest campus updates. Please try again."}
      </p>
      <button className="btn btn-primary" onClick={onRetry}>
        <RefreshCw size={16} />
        <span>Try Again</span>
      </button>
    </div>
  );
};

export default ErrorState;
