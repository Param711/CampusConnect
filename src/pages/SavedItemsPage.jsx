import React from 'react';
import { Bookmark, AlertCircle, ArrowRight } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import NoticeCard from '../components/NoticeCard';
import EventCard from '../components/EventCard';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';

const SavedItemsPage = () => {
  const { 
    notices, 
    events, 
    savedNotices, 
    savedEvents, 
    loading, 
    error, 
    fetchData 
  } = useDashboard();

  if (loading) {
    return (
      <div>
        <header className="page-header">
          <div>
            <h1 className="page-title">Bookmarked Items</h1>
            <p className="page-subtitle">Your personalized shelf of saved notices and events.</p>
          </div>
        </header>
        <div className="card-grid">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="card" style={{ height: '200px' }}>
              <div className="skeleton" style={{ height: '1.5rem', width: '70%' }}></div>
              <div className="skeleton" style={{ height: '3rem', marginTop: '1rem' }}></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchData} />;
  }

  // Filter actual items
  const bookmarkedNotices = notices.filter(notice => savedNotices.includes(notice.id));
  const bookmarkedEvents = events.filter(event => savedEvents.includes(event.id));

  const hasBookmarks = bookmarkedNotices.length > 0 || bookmarkedEvents.length > 0;

  return (
    <div>
      <header className="page-header">
        <div>
          <h1 className="page-title">Bookmarked Items</h1>
          <p className="page-subtitle">Your saved announcements, calendars, and schedules.</p>
        </div>
      </header>

      {hasBookmarks ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          
          {/* Notices Section */}
          {bookmarkedNotices.length > 0 && (
            <section className="dash-section">
              <h2 className="dash-section-title">Saved Notices ({bookmarkedNotices.length})</h2>
              <div className="card-grid">
                {bookmarkedNotices.map(notice => (
                  <NoticeCard key={notice.id} notice={notice} />
                ))}
              </div>
            </section>
          )}

          {/* Events Section */}
          {bookmarkedEvents.length > 0 && (
            <section className="dash-section">
              <h2 className="dash-section-title">Saved Events ({bookmarkedEvents.length})</h2>
              <div className="card-grid">
                {bookmarkedEvents.map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </section>
          )}

        </div>
      ) : (
        <EmptyState 
          title="No bookmarked items yet" 
          message="Click the bookmark ribbon on any notice or event card to save it here for quick access."
        />
      )}
    </div>
  );
};

export default SavedItemsPage;
