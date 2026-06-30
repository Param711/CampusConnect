import React, { useState } from 'react';
import { Search, CalendarDays } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import EventCard from '../components/EventCard';
import { SkeletonGrid } from '../components/SkeletonCard';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';

const EventsPage = () => {
  const { events, loading, error, fetchData } = useDashboard();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [timeFilter, setTimeFilter] = useState('all'); // 'all', 'today', 'upcoming'
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 4;

  const categories = ['All', 'Academic', 'Workshop', 'Cultural', 'Sports', 'Career', 'Social'];

  if (loading) {
    return (
      <div>
        <header className="page-header">
          <div>
            <h1 className="page-title">Campus Events</h1>
            <p className="page-subtitle">Hackathons, concerts, workshops, and sports matches.</p>
          </div>
        </header>
        
        <div style={{ height: '70px', background: 'var(--glass-bg)', borderRadius: 'var(--radius-lg)', marginBottom: '2rem' }}></div>
        
        <SkeletonGrid count={6} />
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchData} />;
  }

  // Filter & Search Logic
  const filteredEvents = events.filter(event => {
    const matchesCategory = selectedCategory === 'All' || event.category.toLowerCase() === selectedCategory.toLowerCase();
    
    // Time filter logic
    let matchesTime = true;
    const todayStr = '2026-06-27'; // Fixed current local time date context from metadata
    const eventDate = event.date || (event.startTime ? event.startTime.split('T')[0] : '');
    if (timeFilter === 'today') {
      matchesTime = eventDate === todayStr;
    } else if (timeFilter === 'upcoming') {
      matchesTime = eventDate > todayStr;
    }

    const query = searchQuery.toLowerCase();
    const eventTags = event.tags || [];
    const matchesSearch = 
      event.title.toLowerCase().includes(query) ||
      event.description.toLowerCase().includes(query) ||
      event.venue.toLowerCase().includes(query) ||
      event.category.toLowerCase().includes(query) ||
      eventTags.some(tag => tag.toLowerCase().includes(query));

    return matchesCategory && matchesTime && matchesSearch;
  });

  return (
    <div>
      <header className="page-header">
        <div>
          <h1 className="page-title">Campus Events</h1>
          <p className="page-subtitle">Tech hackathons, cultural fests, bootcamps, and soccer derbies.</p>
        </div>
      </header>

      {/* Filter and Search Bar */}
      <section className="filter-bar">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search events by title, venue, keywords..." 
            className="search-input"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
          {/* Time Filter Select */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CalendarDays size={16} style={{ color: 'var(--text-muted)' }} />
            <select
              value={timeFilter}
              onChange={(e) => {
                setTimeFilter(e.target.value);
                setCurrentPage(1);
              }}
              style={{
                background: 'rgba(0,0,0,0.2)',
                border: '1px solid var(--glass-border)',
                color: 'var(--text-primary)',
                padding: '0.45rem 1rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              <option value="all">All Dates</option>
              <option value="today">Happening Today</option>
              <option value="upcoming">Upcoming Events</option>
            </select>
          </div>

          <div className="filter-pills">
            {categories.map(category => (
              <button
                key={category}
                className={`filter-pill ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => {
                  setSelectedCategory(category);
                  setCurrentPage(1);
                }}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Event Feed Grid */}
      {filteredEvents.length > 0 ? (
        <>
          <div className="card-grid">
            {filteredEvents
              .slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
              .map(event => (
                <EventCard key={event.id} event={event} />
              ))}
          </div>

          {/* Pagination Controls */}
          {Math.ceil(filteredEvents.length / ITEMS_PER_PAGE) > 1 && (
            <div className="pagination">
              <button 
                className="pagination-btn"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Prev
              </button>
              {Array.from({ length: Math.ceil(filteredEvents.length / ITEMS_PER_PAGE) }, (_, i) => i + 1).map(pageNum => (
                <button
                  key={pageNum}
                  className={`pagination-btn ${currentPage === pageNum ? 'active' : ''}`}
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </button>
              ))}
              <button 
                className="pagination-btn"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredEvents.length / ITEMS_PER_PAGE)))}
                disabled={currentPage === Math.ceil(filteredEvents.length / ITEMS_PER_PAGE)}
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <EmptyState 
          title="No events found" 
          message="Try adjusting your keyword search, selecting another category, or changing the date filter."
        />
      )}
    </div>
  );
};

export default EventsPage;
