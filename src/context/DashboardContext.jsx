import React, { createContext, useState, useEffect, useContext } from 'react';

const DashboardContext = createContext();

export const useDashboard = () => useContext(DashboardContext);

export const DashboardProvider = ({ children }) => {
  const [notices, setNotices] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Bookmarks
  const [savedNotices, setSavedNotices] = useState(() => {
    const saved = localStorage.getItem('savedNotices');
    return saved ? JSON.parse(saved) : [];
  });
  const [savedEvents, setSavedEvents] = useState(() => {
    const saved = localStorage.getItem('savedEvents');
    return saved ? JSON.parse(saved) : [];
  });

  // RSVPs for events
  const [rsvpedEvents, setRsvpedEvents] = useState(() => {
    const saved = localStorage.getItem('rsvpedEvents');
    return saved ? JSON.parse(saved) : [];
  });

  // Simulation controls
  const [simulateDelay, setSimulateDelay] = useState(true);
  const [simulateError, setSimulateError] = useState(false);

  // Theme preference
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : true;
  });

  // Auth state
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('currentUser');
    return saved ? JSON.parse(saved) : null;
  });
  const [authToken, setAuthToken] = useState(() => {
    return localStorage.getItem('authToken') || null;
  });

  // Apply theme class to document body
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.body.classList.remove('light-theme');
    } else {
      document.body.classList.add('light-theme');
    }
  }, [darkMode]);

  // Sync bookmarks & RSVPs to localStorage
  useEffect(() => {
    localStorage.setItem('savedNotices', JSON.stringify(savedNotices));
  }, [savedNotices]);

  useEffect(() => {
    localStorage.setItem('savedEvents', JSON.stringify(savedEvents));
  }, [savedEvents]);

  useEffect(() => {
    localStorage.setItem('rsvpedEvents', JSON.stringify(rsvpedEvents));
  }, [rsvpedEvents]);

  // Sync auth state to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [currentUser]);

  useEffect(() => {
    if (authToken) {
      localStorage.setItem('authToken', authToken);
    } else {
      localStorage.removeItem('authToken');
    }
  }, [authToken]);

  // Determine the API base URL dynamically
  const getApiBase = () => {
    return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      ? 'http://localhost:3000/api'
      : `${window.location.origin}/api`;
  };

  // Fetch / Load data function
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API fetch delay if toggle is active
      if (simulateDelay) {
        await new Promise(resolve => setTimeout(resolve, 1200));
      }

      if (simulateError) {
        throw new Error('Simulated network error: Failed to connect to campus hub server.');
      }

      const apiBase = getApiBase();

      // Fetch real data from live REST API endpoints
      const [noticesRes, eventsRes] = await Promise.all([
        fetch(`${apiBase}/notices?limit=100`),
        fetch(`${apiBase}/events?limit=100`)
      ]);

      if (!noticesRes.ok || !eventsRes.ok) {
        throw new Error(`Server returned error. Notices: ${noticesRes.status}, Events: ${eventsRes.status}`);
      }

      const noticesData = await noticesRes.json();
      const eventsData = await eventsRes.json();

      // Extract results list from pagination envelope
      setNotices(noticesData.results || []);
      setEvents(eventsData.results || []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message || 'Failed to fetch data from campus server. Please check your network connection or try again later.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [simulateError]);

  // Auth methods
  const registerUser = async (name, email, role) => {
    const res = await fetch(`${getApiBase()}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, role })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to register.');
    }
    setCurrentUser(data.user);
    setAuthToken(data.token);
    return data.user;
  };

  const loginUser = async (email) => {
    const res = await fetch(`${getApiBase()}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to log in.');
    }
    setCurrentUser(data.user);
    setAuthToken(data.token);
    return data.user;
  };

  const logoutUser = () => {
    setCurrentUser(null);
    setAuthToken(null);
  };

  // Create Notice
  const createNotice = async (noticeData) => {
    const res = await fetch(`${getApiBase()}/notices`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(noticeData)
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to publish notice.');
    }
    await fetchData();
    return data;
  };

  // Create Event
  const createEvent = async (eventData) => {
    const res = await fetch(`${getApiBase()}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(eventData)
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to schedule event.');
    }
    await fetchData();
    return data;
  };

  // Bookmark actions
  const toggleBookmarkNotice = (id) => {
    setSavedNotices(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleBookmarkEvent = (id) => {
    setSavedEvents(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // RSVP action
  const toggleRSVP = (id) => {
    const hasRsvped = rsvpedEvents.includes(id);
    setRsvpedEvents(prev => 
      hasRsvped ? prev.filter(item => item !== id) : [...prev, id]
    );
    
    setEvents(prevEvents => 
      prevEvents.map(event => {
        if (event.id === id) {
          const currentRsvps = event.rsvps || 0;
          return {
            ...event,
            rsvps: hasRsvped ? Math.max(0, currentRsvps - 1) : currentRsvps + 1
          };
        }
        return event;
      })
    );
  };

  const isNoticeBookmarked = (id) => savedNotices.includes(id);
  const isEventBookmarked = (id) => savedEvents.includes(id);
  const hasRSVPed = (id) => rsvpedEvents.includes(id);

  return (
    <DashboardContext.Provider value={{
      notices,
      events,
      loading,
      error,
      savedNotices,
      savedEvents,
      rsvpedEvents,
      simulateDelay,
      setSimulateDelay,
      simulateError,
      setSimulateError,
      darkMode,
      setDarkMode,
      currentUser,
      authToken,
      registerUser,
      loginUser,
      logoutUser,
      createNotice,
      createEvent,
      fetchData,
      toggleBookmarkNotice,
      toggleBookmarkEvent,
      toggleRSVP,
      isNoticeBookmarked,
      isEventBookmarked,
      hasRSVPed
    }}>
      {children}
    </DashboardContext.Provider>
  );
};
