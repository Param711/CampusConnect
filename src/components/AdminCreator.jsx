import React, { useState } from 'react';
import { X, Megaphone, Calendar, AlertCircle, Loader2 } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';

const AdminCreator = ({ isOpen, onClose }) => {
  const { createNotice, createEvent, currentUser } = useDashboard();
  const [isNotice, setIsNotice] = useState(true);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Notice Form State
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeCategory, setNoticeCategory] = useState('Academic');
  const [noticeContent, setNoticeContent] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);

  // Event Form State
  const [eventTitle, setEventTitle] = useState('');
  const [eventCategory, setEventCategory] = useState('Academic');
  const [eventDescription, setEventDescription] = useState('');
  const [eventVenue, setEventVenue] = useState('');
  const [eventOrganizer, setEventOrganizer] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  if (!isOpen) return null;

  const handleNoticeSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (!currentUser) throw new Error('You must be signed in to create notices.');
      
      const payload = {
        title: noticeTitle.trim(),
        content: noticeContent.trim(),
        category: noticeCategory,
        isUrgent,
        postedBy: currentUser.id
      };

      await createNotice(payload);
      setSuccess('Notice published successfully!');
      
      // Reset form
      setNoticeTitle('');
      setNoticeContent('');
      setIsUrgent(false);
      
      setTimeout(() => {
        setSuccess('');
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to publish notice.');
    } finally {
      setLoading(false);
    }
  };

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (!currentUser) throw new Error('You must be signed in to create events.');
      if (!startTime || !endTime) throw new Error('Start and End times are required.');
      
      const start = new Date(startTime);
      const end = new Date(endTime);
      
      if (start >= end) {
        throw new Error('Chronological Error: Event End Time must come after its Start Time.');
      }

      const payload = {
        title: eventTitle.trim(),
        description: eventDescription.trim(),
        category: eventCategory,
        venue: eventVenue.trim(),
        startTime: start.toISOString(),
        endTime: end.toISOString(),
        organizer: eventOrganizer.trim()
      };

      await createEvent(payload);
      setSuccess('Event scheduled successfully!');
      
      // Reset form
      setEventTitle('');
      setEventDescription('');
      setEventVenue('');
      setEventOrganizer('');
      setStartTime('');
      setEndTime('');
      
      setTimeout(() => {
        setSuccess('');
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to schedule event.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card modal-large" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={18} />
        </button>

        <div className="modal-tabs">
          <button 
            className={`modal-tab ${isNotice ? 'active' : ''}`} 
            onClick={() => { setIsNotice(true); setError(''); setSuccess(''); }}
          >
            <Megaphone size={16} />
            <span>Publish Notice</span>
          </button>
          <button 
            className={`modal-tab ${!isNotice ? 'active' : ''}`} 
            onClick={() => { setIsNotice(false); setError(''); setSuccess(''); }}
          >
            <Calendar size={16} />
            <span>Schedule Event</span>
          </button>
        </div>

        {error && (
          <div className="form-error-banner" style={{ marginTop: '1.5rem' }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="form-success-banner" style={{ marginTop: '1.5rem' }}>
            <span>{success}</span>
          </div>
        )}

        {isNotice ? (
          <form onSubmit={handleNoticeSubmit} style={{ marginTop: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="notice-title">Notice Title</label>
              <input 
                id="notice-title"
                type="text" 
                placeholder="e.g. Midterm Exams Schedule" 
                className="form-input"
                value={noticeTitle}
                onChange={(e) => setNoticeTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group flex-1">
                <label className="form-label" htmlFor="notice-category">Category</label>
                <select 
                  id="notice-category"
                  className="form-input"
                  value={noticeCategory}
                  onChange={(e) => setNoticeCategory(e.target.value)}
                >
                  <option value="Academic">Academic</option>
                  <option value="Placement">Placement</option>
                  <option value="Sports">Sports</option>
                  <option value="Clubs">Clubs</option>
                  <option value="Administrative">Administrative</option>
                </select>
              </div>
              
              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.8rem' }}>
                <label className="sim-control-label" style={{ fontSize: '0.9rem' }} htmlFor="notice-urgent">
                  <input 
                    id="notice-urgent"
                    type="checkbox" 
                    checked={isUrgent}
                    onChange={(e) => setIsUrgent(e.target.checked)}
                  />
                  <span>Mark as Urgent</span>
                </label>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="notice-content">Notice Content / Guidelines</label>
              <textarea 
                id="notice-content"
                rows="4" 
                placeholder="Provide detailed notice descriptions here..." 
                className="form-input"
                value={noticeContent}
                onChange={(e) => setNoticeContent(e.target.value)}
                required
              ></textarea>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 size={16} className="spinner" />
                  <span>Publishing...</span>
                </>
              ) : (
                <span>Publish Announcement</span>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleEventSubmit} style={{ marginTop: '1.5rem' }}>
            <div className="form-row">
              <div className="form-group flex-1">
                <label className="form-label" htmlFor="event-title">Event Title</label>
                <input 
                  id="event-title"
                  type="text" 
                  placeholder="e.g. Annual Hackathon" 
                  className="form-input"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group" style={{ width: '200px' }}>
                <label className="form-label" htmlFor="event-category">Category</label>
                <select 
                  id="event-category"
                  className="form-input"
                  value={eventCategory}
                  onChange={(e) => setEventCategory(e.target.value)}
                >
                  <option value="Academic">Academic</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Cultural">Cultural</option>
                  <option value="Sports">Sports</option>
                  <option value="Career">Career</option>
                  <option value="Social">Social</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group flex-1">
                <label className="form-label" htmlFor="event-venue">Venue</label>
                <input 
                  id="event-venue"
                  type="text" 
                  placeholder="e.g. Seminar Hall B" 
                  className="form-input"
                  value={eventVenue}
                  onChange={(e) => setEventVenue(e.target.value)}
                  required
                />
              </div>

              <div className="form-group flex-1">
                <label className="form-label" htmlFor="event-organizer">Organizer</label>
                <input 
                  id="event-organizer"
                  type="text" 
                  placeholder="e.g. Developers' Society" 
                  className="form-input"
                  value={eventOrganizer}
                  onChange={(e) => setEventOrganizer(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group flex-1">
                <label className="form-label" htmlFor="event-start">Start Date & Time</label>
                <input 
                  id="event-start"
                  type="datetime-local" 
                  className="form-input"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                />
              </div>

              <div className="form-group flex-1">
                <label className="form-label" htmlFor="event-end">End Date & Time</label>
                <input 
                  id="event-end"
                  type="datetime-local" 
                  className="form-input"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="event-desc">Event Description</label>
              <textarea 
                id="event-desc"
                rows="3" 
                placeholder="Provide event details, registration links, or timelines..." 
                className="form-input"
                value={eventDescription}
                onChange={(e) => setEventDescription(e.target.value)}
                required
              ></textarea>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 size={16} className="spinner" />
                  <span>Scheduling...</span>
                </>
              ) : (
                <span>Schedule Campus Event</span>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminCreator;
