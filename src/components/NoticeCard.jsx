import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bookmark, Calendar, ArrowRight } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';

const NoticeCard = ({ notice }) => {
  const navigate = useNavigate();
  const { toggleBookmarkNotice, isNoticeBookmarked } = useDashboard();
  const isBookmarked = isNoticeBookmarked(notice.id);

  const getCategoryClass = (category) => {
    switch (category.toLowerCase()) {
      case 'academic': return 'badge-academic';
      case 'placement': return 'badge-placement';
      case 'sports': return 'badge-sports';
      case 'clubs': return 'badge-clubs';
      case 'administrative': return 'badge-administrative';
      default: return 'badge-academic';
    }
  };

  const handleCardClick = () => {
    navigate(`/notices/${notice.id}`);
  };

  const handleBookmarkClick = (e) => {
    e.stopPropagation(); // prevent card click navigation
    toggleBookmarkNotice(notice.id);
  };

  return (
    <article 
      className={`card ${notice.isUrgent ? 'card-urgent' : ''}`}
      onClick={handleCardClick}
    >
      <div>
        <div className="card-header">
          <span className={`badge ${getCategoryClass(notice.category)}`}>
            {notice.category}
          </span>
          {notice.isUrgent && (
            <span className="badge badge-urgent" style={{ marginLeft: '0.5rem' }}>
              Urgent
            </span>
          )}
          <span className="card-date">{notice.postedDate || (notice.createdAt ? notice.createdAt.split('T')[0] : '')}</span>
        </div>
        
        <h3 className="card-title">{notice.title}</h3>
        <p className="card-desc">{notice.description || notice.content}</p>
      </div>

      <div className="card-footer">
        <span className="card-meta-item">
          <Calendar size={14} />
          <span>Posted by {(notice.author?.name || notice.author || 'Administrative').split(' ')[0]}...</span>
        </span>
        
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            className={`card-action-btn ${isBookmarked ? 'active' : ''}`}
            onClick={handleBookmarkClick}
            title={isBookmarked ? "Remove Bookmark" : "Bookmark Notice"}
            aria-label="Bookmark notice"
          >
            <Bookmark size={16} fill={isBookmarked ? "currentColor" : "none"} />
          </button>
          
          <button 
            className="card-action-btn"
            style={{ color: 'var(--color-indigo)' }}
            title="View Details"
            aria-label="View notice details"
          >
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </article>
  );
};

export default NoticeCard;
