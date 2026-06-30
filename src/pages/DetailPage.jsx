import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, Bookmark, Share2, MapPin, 
  Calendar, Clock, Award, Users, Check, CopyCheck 
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import ErrorState from '../components/ErrorState';

const DetailPage = ({ type }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    notices, 
    events, 
    loading, 
    error, 
    fetchData,
    toggleBookmarkNotice,
    toggleBookmarkEvent,
    isNoticeBookmarked,
    isEventBookmarked,
    toggleRSVP,
    hasRSVPed
  } = useDashboard();

  const [shareCopied, setShareCopied] = useState(false);

  if (loading) {
    return (
      <div className="detail-view">
        <div className="skeleton" style={{ height: '38px', width: '100px', marginBottom: '2rem' }}></div>
        <div className="skeleton" style={{ height: '1.25rem', width: '120px', marginBottom: '1.5rem' }}></div>
        <div className="skeleton" style={{ height: '3rem', width: '80%', marginBottom: '2rem' }}></div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
          <div className="skeleton" style={{ height: '80px', borderRadius: 'var(--radius-lg)' }}></div>
          <div className="skeleton" style={{ height: '80px', borderRadius: 'var(--radius-lg)' }}></div>
          <div className="skeleton" style={{ height: '80px', borderRadius: 'var(--radius-lg)' }}></div>
        </div>
        <div className="skeleton" style={{ height: '150px' }}></div>
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchData} />;
  }

  const isNotice = type === 'notice';
  const item = isNotice 
    ? notices.find(n => n.id === id)
    : events.find(e => e.id === id);

  if (!item) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <h2 className="page-title" style={{ fontSize: '1.5rem', marginBottom: '1rem', background: 'none', WebkitTextFillColor: 'initial', color: 'white' }}>
          Item Not Found
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          The requested {isNotice ? 'notice' : 'event'} could not be found. It may have expired or been removed.
        </p>
        <Link to={isNotice ? '/notices' : '/events'} className="btn btn-primary">
          <ArrowLeft size={16} />
          <span>Back to {isNotice ? 'Notices' : 'Events'}</span>
        </Link>
      </div>
    );
  }

  const isBookmarked = isNotice ? isNoticeBookmarked(item.id) : isEventBookmarked(item.id);
  const isRsvped = isNotice ? false : hasRSVPed(item.id);

  const getCategoryClass = (category) => {
    switch (category.toLowerCase()) {
      case 'academic': return 'badge-academic';
      case 'placement': return 'badge-placement';
      case 'sports': return 'badge-sports';
      case 'clubs': return 'badge-clubs';
      case 'administrative': return 'badge-administrative';
      case 'workshop': return 'badge-placement';
      case 'cultural': return 'badge-clubs';
      case 'social': return 'badge-administrative';
      default: return 'badge-academic';
    }
  };

  const handleBookmarkToggle = () => {
    if (isNotice) {
      toggleBookmarkNotice(item.id);
    } else {
      toggleBookmarkEvent(item.id);
    }
  };

  const handleShareClick = () => {
    // Copy the current URL
    navigator.clipboard.writeText(window.location.href);
    setShareCopied(true);
    setTimeout(() => {
      setShareCopied(false);
    }, 2000);
  };

  return (
    <div>
      <Link to={isNotice ? '/notices' : '/events'} className="detail-back-btn">
        <ArrowLeft size={16} />
        <span>Back to {isNotice ? 'Notices' : 'Events'}</span>
      </Link>

      <article className="detail-view">
        {/* Urgent Marker Line */}
        {isNotice && item.isUrgent && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '6px',
            background: 'var(--color-urgent-text)'
          }}></div>
        )}

        <div className="detail-header-meta">
          <span className={`badge ${getCategoryClass(item.category)}`}>
            {item.category}
          </span>
          {isNotice && item.isUrgent && (
            <span className="badge badge-urgent">URGENT</span>
          )}
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {isNotice ? `Posted on ${item.postedDate || (item.createdAt ? item.createdAt.split('T')[0] : '')}` : `Event Date: ${item.date || (item.startTime ? item.startTime.split('T')[0] : '')}`}
          </span>
        </div>

        <h1 className="detail-title">{item.title}</h1>

        {/* Info Grid */}
        <div className="detail-info-grid">
          {isNotice ? (
            <>
              <div className="detail-info-card">
                <div className="detail-info-icon-wrapper">
                  <Award size={20} />
                </div>
                <div>
                  <div className="detail-info-label">Issued By</div>
                  <div className="detail-info-value">{item.author?.name || item.author || 'Administrative'}</div>
                </div>
              </div>
              <div className="detail-info-card">
                <div className="detail-info-icon-wrapper">
                  <Calendar size={20} />
                </div>
                <div>
                  <div className="detail-info-label">Category</div>
                  <div className="detail-info-value">{item.category} Announcement</div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="detail-info-card">
                <div className="detail-info-icon-wrapper">
                  <MapPin size={20} />
                </div>
                <div>
                  <div className="detail-info-label">Venue</div>
                  <div className="detail-info-value">{item.venue}</div>
                </div>
              </div>
              <div className="detail-info-card">
                <div className="detail-info-icon-wrapper">
                  <Clock size={20} />
                </div>
                <div>
                  <div className="detail-info-label">Schedule</div>
                  <div className="detail-info-value">{item.time || (item.startTime ? `${new Date(item.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - ${new Date(item.endTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}` : '')}</div>
                </div>
              </div>
              <div className="detail-info-card">
                <div className="detail-info-icon-wrapper">
                  <Users size={20} />
                </div>
                <div>
                  <div className="detail-info-label">Attendance</div>
                  <div className="detail-info-value">{item.rsvps || 0} RSVPed</div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Detailed Body description */}
        <div className="detail-body">
          <p style={{ whiteSpace: 'pre-line' }}>{item.description || item.content}</p>
          
          {/* Sub-details box */}
          {isNotice && item.content && (
            <div className="detail-extra-box">
              <h3 className="detail-extra-box-title">Important Details & Guidelines</h3>
              <p className="detail-extra-box-content">{item.content}</p>
            </div>
          )}

          {/* Event Organizer / Tags box */}
          {!isNotice && (
            <div style={{ marginTop: '2.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
                Organizer Details
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                Hosted by <strong>{item.organizer}</strong>. For queries, please contact the coordinator desk.
              </p>
              
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {(item.tags || []).map(tag => (
                  <span 
                    key={tag} 
                    style={{ 
                      background: 'rgba(255, 255, 255, 0.03)', 
                      border: '1px solid var(--glass-border)',
                      padding: '0.35rem 0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.8rem',
                      color: 'var(--text-secondary)'
                    }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Actions Footer */}
        <div className="detail-actions">
          {!isNotice && (
            <button 
              className={`btn ${isRsvped ? 'btn-success' : 'btn-primary'}`}
              onClick={() => toggleRSVP(item.id)}
            >
              {isRsvped ? (
                <>
                  <Check size={18} />
                  <span>Attending (Click to Cancel)</span>
                </>
              ) : (
                <span>RSVP for Event</span>
              )}
            </button>
          )}
          
          <button 
            className={`btn btn-secondary ${isBookmarked ? 'active' : ''}`}
            onClick={handleBookmarkToggle}
            style={{ 
              color: isBookmarked ? 'var(--color-indigo)' : 'inherit',
              borderColor: isBookmarked ? 'rgba(99, 102, 241, 0.3)' : 'inherit'
            }}
          >
            <Bookmark size={18} fill={isBookmarked ? "currentColor" : "none"} />
            <span>{isBookmarked ? 'Saved to Bookmarks' : 'Bookmark Item'}</span>
          </button>

          <button 
            className="btn btn-secondary" 
            onClick={handleShareClick}
            style={{ marginLeft: 'auto' }}
          >
            {shareCopied ? (
              <>
                <CopyCheck size={18} style={{ color: '#10b981' }} />
                <span style={{ color: '#10b981' }}>Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 size={18} />
                <span>Share Link</span>
              </>
            )}
          </button>
        </div>
      </article>
    </div>
  );
};

export default DetailPage;
