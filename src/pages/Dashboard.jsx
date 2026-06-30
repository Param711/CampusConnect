import React from 'react';
import { Link } from 'react-router-dom';
import { Megaphone, Calendar, Bookmark, TrendingUp, AlertTriangle, ArrowRight } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import NoticeCard from '../components/NoticeCard';
import EventCard from '../components/EventCard';
import { SkeletonGrid } from '../components/SkeletonCard';
import ErrorState from '../components/ErrorState';

const Dashboard = () => {
  const { 
    notices, 
    events, 
    loading, 
    error, 
    fetchData,
    savedNotices,
    savedEvents,
    rsvpedEvents
  } = useDashboard();

  if (loading) {
    return (
      <div>
        <header className="page-header">
          <div>
            <h1 className="page-title">Campus Dashboard</h1>
            <p className="page-subtitle">Welcome back! Fetching the latest campus buzz...</p>
          </div>
        </header>

        <div className="stats-grid">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="stat-card" style={{ height: '80px' }}>
              <div className="skeleton" style={{ height: '0.75rem', width: '60px' }}></div>
              <div className="skeleton" style={{ height: '1.75rem', width: '40px', marginTop: '0.25rem' }}></div>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: '2.5rem' }}>
          <div className="skeleton" style={{ height: '80px', borderRadius: 'var(--radius-lg)' }}></div>
        </div>

        <div className="dashboard-grid">
          <div className="dash-section">
            <div className="skeleton" style={{ height: '1.5rem', width: '150px' }}></div>
            <SkeletonGrid count={2} />
          </div>
          <div className="dash-section">
            <div className="skeleton" style={{ height: '1.5rem', width: '150px' }}></div>
            <SkeletonGrid count={2} />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchData} />;
  }

  // Find most recent urgent notice
  const urgentNotice = notices.find(n => n.isUrgent);

  // Recent 3 notices and events
  const recentNotices = notices.slice(0, 3);
  const upcomingEvents = events.slice(0, 3);

  return (
    <div>
      <header className="page-header">
        <div>
          <h1 className="page-title">Campus Dashboard</h1>
          <p className="page-subtitle">Here's what is happening on campus this week.</p>
        </div>
      </header>

      {/* Stats Section */}
      <section className="stats-grid">
        <div className="stat-card">
          <span className="stat-title">Notices</span>
          <span className="stat-value">{notices.length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-title">Events</span>
          <span className="stat-value">{events.length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-title">RSVPs</span>
          <span className="stat-value">{rsvpedEvents.length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-title">Bookmarks</span>
          <span className="stat-value">{savedNotices.length + savedEvents.length}</span>
        </div>
      </section>

      {/* Urgent Announcement Banner */}
      {urgentNotice && (
        <section className="urgent-banner">
          <div className="urgent-icon-wrapper">
            <AlertTriangle size={24} />
          </div>
          <div className="urgent-content">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="badge badge-urgent">URGENT ANNOUNCEMENT</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{urgentNotice.postedDate}</span>
            </div>
            <h2 className="urgent-title" style={{ marginTop: '0.25rem' }}>{urgentNotice.title}</h2>
            <p className="urgent-desc">{urgentNotice.description}</p>
            <Link to={`/notices/${urgentNotice.id}`} className="urgent-link">
              <span>Read complete notice guidelines</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </section>
      )}

      {/* Main Dashboard Feed Grid */}
      <div className="dashboard-grid">
        {/* Notices Section */}
        <section className="dash-section">
          <div className="dash-section-header">
            <h2 className="dash-section-title">Latest Announcements</h2>
            <Link to="/notices" className="view-all-link">View All Notices</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {recentNotices.length > 0 ? (
              recentNotices.map(notice => (
                <NoticeCard key={notice.id} notice={notice} />
              ))
            ) : (
              <p style={{ color: 'var(--text-secondary)' }}>No notices posted recently.</p>
            )}
          </div>
        </section>

        {/* Events Section */}
        <section className="dash-section">
          <div className="dash-section-header">
            <h2 className="dash-section-title">Upcoming Campus Events</h2>
            <Link to="/events" className="view-all-link">View All Events</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))
            ) : (
              <p style={{ color: 'var(--text-secondary)' }}>No upcoming events scheduled.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
