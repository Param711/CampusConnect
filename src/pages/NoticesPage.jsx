import React, { useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import NoticeCard from '../components/NoticeCard';
import { SkeletonGrid } from '../components/SkeletonCard';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';

const NoticesPage = () => {
  const { notices, loading, error, fetchData } = useDashboard();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 4;

  const categories = ['All', 'Academic', 'Placement', 'Sports', 'Clubs', 'Administrative'];

  if (loading) {
    return (
      <div>
        <header className="page-header">
          <div>
            <h1 className="page-title">Campus Notices</h1>
            <p className="page-subtitle">Academic bulletins, internship announcements, and administrative posts.</p>
          </div>
        </header>
        
        {/* Loading Filter Bar Skeleton */}
        <div style={{ height: '70px', background: 'var(--glass-bg)', borderRadius: 'var(--radius-lg)', marginBottom: '2rem' }}></div>
        
        <SkeletonGrid count={6} />
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchData} />;
  }

  // Filter & Search Logic
  const filteredNotices = notices.filter(notice => {
    const matchesCategory = selectedCategory === 'All' || notice.category.toLowerCase() === selectedCategory.toLowerCase();
    
    const query = searchQuery.toLowerCase();
    const noticeContent = notice.description || notice.content || '';
    const authorName = notice.author?.name || notice.author || '';
    const matchesSearch = 
      notice.title.toLowerCase().includes(query) ||
      noticeContent.toLowerCase().includes(query) ||
      authorName.toLowerCase().includes(query) ||
      notice.category.toLowerCase().includes(query);

    return matchesCategory && matchesSearch;
  });

  return (
    <div>
      <header className="page-header">
        <div>
          <h1 className="page-title">Campus Notices</h1>
          <p className="page-subtitle">Academic bulletins, placement drives, and administrative alerts.</p>
        </div>
      </header>

      {/* Filter and Search Bar */}
      <section className="filter-bar">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search notices by keyword, title, author..." 
            className="search-input"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div className="filter-pills">
          <span style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.35rem', 
            fontSize: '0.8rem', 
            color: 'var(--text-muted)',
            marginRight: '0.25rem' 
          }}>
            <SlidersHorizontal size={14} />
            Filter:
          </span>
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
      </section>

      {/* Notice Feed Grid */}
      {filteredNotices.length > 0 ? (
        <>
          <div className="card-grid">
            {filteredNotices
              .slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
              .map(notice => (
                <NoticeCard key={notice.id} notice={notice} />
              ))}
          </div>

          {/* Pagination Controls */}
          {Math.ceil(filteredNotices.length / ITEMS_PER_PAGE) > 1 && (
            <div className="pagination">
              <button 
                className="pagination-btn"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Prev
              </button>
              {Array.from({ length: Math.ceil(filteredNotices.length / ITEMS_PER_PAGE) }, (_, i) => i + 1).map(pageNum => (
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
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredNotices.length / ITEMS_PER_PAGE)))}
                disabled={currentPage === Math.ceil(filteredNotices.length / ITEMS_PER_PAGE)}
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <EmptyState 
          title="No notices match your criteria" 
          message="Try typing a different keyword or choosing a different department category filter."
        />
      )}
    </div>
  );
};

export default NoticesPage;
