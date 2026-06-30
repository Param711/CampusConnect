import React from 'react';
import { AlertCircle } from 'lucide-react';

const EmptyState = ({ title = "No results found", message = "Try adjusting your search keywords or category filters." }) => {
  return (
    <div className="empty-state">
      <AlertCircle className="empty-state-icon" size={32} />
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-desc">{message}</p>
    </div>
  );
};

export default EmptyState;
