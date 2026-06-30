import React from 'react';

const SkeletonCard = () => {
  return (
    <div className="card" style={{ cursor: 'default', pointerEvents: 'none' }}>
      <div>
        <div className="card-header">
          <div className="skeleton skeleton-badge"></div>
          <div className="skeleton" style={{ height: '0.75rem', width: '60px' }}></div>
        </div>
        
        <div className="skeleton skeleton-title"></div>
        <div className="skeleton skeleton-title" style={{ width: '60%' }}></div>
        
        <div className="skeleton skeleton-desc" style={{ marginTop: '1rem' }}></div>
      </div>
      
      <div className="card-footer" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.02)' }}>
        <div className="skeleton" style={{ height: '1rem', width: '120px' }}></div>
        <div className="skeleton" style={{ height: '1.5rem', width: '32px', borderRadius: '50%' }}></div>
      </div>
    </div>
  );
};

export const SkeletonGrid = ({ count = 3 }) => {
  return (
    <div className="card-grid">
      {Array.from({ length: count }).map((_, idx) => (
        <SkeletonCard key={idx} />
      ))}
    </div>
  );
};

export default SkeletonCard;
