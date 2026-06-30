import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Users, Bookmark, Check } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';

const EventCard = ({ event }) => {
  const navigate = useNavigate();
  const { toggleBookmarkEvent, isEventBookmarked, toggleRSVP, hasRSVPed } = useDashboard();
  
  const isBookmarked = isEventBookmarked(event.id);
  const isRsvped = hasRSVPed(event.id);

  const getCategoryClass = (category) => {
    switch (category.toLowerCase()) {
      case 'academic': return 'badge-academic';
      case 'workshop': return 'badge-placement';
      case 'sports': return 'badge-sports';
      case 'cultural': return 'badge-clubs';
      case 'social': return 'badge-administrative';
      default: return 'badge-academic';
    }
  };

  const handleCardClick = () => {
    navigate(`/events/${event.id}`);
  };

  const handleBookmarkClick = (e) => {
    e.stopPropagation();
    toggleBookmarkEvent(event.id);
  };

  const handleRSVPClick = (e) => {
    e.stopPropagation();
    toggleRSVP(event.id);
  };

  // Format date helper: "2026-07-03" -> "Jul 03, 2026"
  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <article className="card" onClick={handleCardClick}>
      <div>
        <div className="card-header">
          <span className={`badge ${getCategoryClass(event.category)}`}>
            {event.category}
          </span>
          <span className="card-date">{formatDate(event.date || event.startTime)}</span>
        </div>
        
        <h3 className="card-title">{event.title}</h3>
        <p className="card-desc">{event.description}</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
        <div className="card-meta-item">
          <MapPin size={14} className="text-muted" />
          <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
            {event.venue}
          </span>
        </div>
        <div className="card-meta-item">
          <Users size={14} className="text-muted" />
          <span>{event.rsvps || 0} attending</span>
        </div>
      </div>

      <div className="card-footer">
        <button 
          className={`btn ${isRsvped ? 'btn-success' : 'btn-secondary'}`}
          style={{ padding: '0.4rem 1rem', fontSize: '0.8rem', borderRadius: 'var(--radius-sm)' }}
          onClick={handleRSVPClick}
        >
          {isRsvped ? (
            <>
              <Check size={14} />
              <span>Attending</span>
            </>
          ) : (
            <span>RSVP</span>
          )}
        </button>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            className={`card-action-btn ${isBookmarked ? 'active' : ''}`}
            onClick={handleBookmarkClick}
            title={isBookmarked ? "Remove Bookmark" : "Bookmark Event"}
            aria-label="Bookmark event"
          >
            <Bookmark size={16} fill={isBookmarked ? "currentColor" : "none"} />
          </button>
        </div>
      </div>
    </article>
  );
};

export default EventCard;
