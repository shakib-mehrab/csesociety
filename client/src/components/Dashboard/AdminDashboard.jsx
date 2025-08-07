/* eslint-disable no-unused-vars */

import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

// --- Club Join Requests ---
const ClubJoinRequests = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    api.get('/clubs/requests')
      .then(res => {
        // Only show requests for this admin's club
        const clubId = user.clubsJoined[0];
        setRequests(res.data.filter(r => r.clubId._id === clubId));
        setLoading(false);
      })
      .catch(() => { setError('Failed to load join requests'); setLoading(false); });
  }, [user, refresh]);

  const handleProcess = async (id, status) => {
    setLoading(true);
    try {
      await api.put(`/clubs/requests/${id}`, { status });
      setRefresh(r => !r);
    } catch {
      setError('Failed to process request');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  return (
    <div>
      <h4 className="font-bold mb-2">Pending Join Requests</h4>
      <table className="w-full border mb-4">
        <thead><tr className="bg-gray-100"><th>Name</th><th>Email</th><th>Student ID</th><th>Actions</th></tr></thead>
        <tbody>
          {requests.length === 0 && <tr><td colSpan={4}>No pending requests</td></tr>}
          {requests.map(r => (
            <tr key={r._id}>
              <td>{r.userId.name}</td>
              <td>{r.userId.email}</td>
              <td>{r.userId.studentId}</td>
              <td>
                <button className="bg-green-500 text-white px-2 py-1 rounded mr-2" onClick={() => handleProcess(r._id, 'approved')}>Approve</button>
                <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => handleProcess(r._id, 'rejected')}>Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// --- Club Members ---
const ClubMembers = () => {
  const { user } = useAuth();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    const clubId = user.clubsJoined[0];
    api.get(`/clubs/${clubId}/members`)
      .then(res => { setMembers(res.data); setLoading(false); })
      .catch(() => { setError('Failed to load members'); setLoading(false); });
  }, [user]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  return (
    <div>
      <h4 className="font-bold mb-2">Club Members</h4>
      <table className="w-full border mb-4">
        <thead><tr className="bg-gray-100"><th>Name</th><th>Email</th><th>Student ID</th></tr></thead>
        <tbody>
          {members.length === 0 && <tr><td colSpan={3}>No members</td></tr>}
          {members.map(m => (
            <tr key={m._id}><td>{m.name}</td><td>{m.email}</td><td>{m.studentId}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// --- Club Notices ---
const ClubNotices = () => {
  const { user } = useAuth();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ title: '', content: '', expiresAt: '' });
  const [editId, setEditId] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const clubId = user?.clubsJoined[0];

  useEffect(() => {
    if (!clubId) return;
    setLoading(true);
    api.get(`/notices?type=club&clubId=${clubId}`)
      .then(res => { setNotices(res.data); setLoading(false); })
      .catch(() => { setError('Failed to load notices'); setLoading(false); });
  }, [clubId, refresh]);

  const handleInput = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editId) {
        await api.put(`/notices/${editId}`, { ...form, type: 'club', clubId });
      } else {
        await api.post('/notices', { ...form, type: 'club', clubId });
      }
      setForm({ title: '', content: '', expiresAt: '' });
      setEditId(null);
      setRefresh(r => !r);
    } catch {
      setError('Failed to save notice');
    } finally {
      setLoading(false);
    }
  };
  const handleEdit = n => setForm({ title: n.title, content: n.content, expiresAt: n.expiresAt?.slice(0,10) || '' }) || setEditId(n._id);
  const handleDelete = async id => {
    setLoading(true);
    try {
      await api.delete(`/notices/${id}`);
      setRefresh(r => !r);
    } catch {
      setError('Failed to delete notice');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h4 className="font-bold mb-2">Club Notices</h4>
      <form className="mb-4" onSubmit={handleSubmit}>
        <input name="title" value={form.title} onChange={handleInput} placeholder="Title" className="border p-2 rounded w-full mb-2" required />
        <textarea name="content" value={form.content} onChange={handleInput} placeholder="Content" className="border p-2 rounded w-full mb-2" required />
        <input type="date" name="expiresAt" value={form.expiresAt} onChange={handleInput} className="border p-2 rounded w-full mb-2" />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded mr-2">{editId ? 'Update' : 'Publish'}</button>
        {editId && <button type="button" className="bg-gray-400 text-white px-4 py-2 rounded" onClick={() => { setEditId(null); setForm({ title: '', content: '', expiresAt: '' }); }}>Cancel</button>}
      </form>
      <table className="w-full border mb-4">
        <thead><tr className="bg-gray-100"><th>Title</th><th>Content</th><th>Expires</th><th>Actions</th></tr></thead>
        <tbody>
          {notices.length === 0 && <tr><td colSpan={4}>No notices</td></tr>}
          {notices.map(n => (
            <tr key={n._id}>
              <td>{n.title}</td>
              <td>{n.content}</td>
              <td>{n.expiresAt ? n.expiresAt.slice(0,10) : '-'}</td>
              <td>
                <button className="bg-yellow-500 text-white px-2 py-1 rounded mr-2" onClick={() => handleEdit(n)}>Edit</button>
                <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => handleDelete(n._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// --- Club Events ---
const ClubEvents = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ title: '', description: '', date: '', time: '', venue: '', registrationDeadline: '', fee: 0 });
  const [editId, setEditId] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const clubId = user?.clubsJoined[0];

  useEffect(() => {
    if (!clubId) return;
    setLoading(true);
    api.get(`/events?clubId=${clubId}`)
      .then(res => { setEvents(res.data); setLoading(false); })
      .catch(() => { setError('Failed to load events'); setLoading(false); });
  }, [clubId, refresh]);

  const handleInput = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editId) {
        await api.put(`/events/${editId}`, { ...form, type: 'club', clubId });
      } else {
        await api.post('/events', { ...form, type: 'club', clubId });
      }
      setForm({ title: '', description: '', date: '', time: '', venue: '', registrationDeadline: '', fee: 0 });
      setEditId(null);
      setRefresh(r => !r);
    } catch {
      setError('Failed to save event');
    } finally {
      setLoading(false);
    }
  };
  const handleEdit = e => setForm({
    title: e.title, description: e.description, date: e.date?.slice(0,10) || '', time: e.time, venue: e.venue, registrationDeadline: e.registrationDeadline?.slice(0,10) || '', fee: e.fee || 0
  }) || setEditId(e._id);
  const handleDelete = async id => {
    setLoading(true);
    try {
      await api.delete(`/events/${id}`);
      setRefresh(r => !r);
    } catch {
      setError('Failed to delete event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h4 className="font-bold mb-2">Club Events</h4>
      <form className="mb-4" onSubmit={handleSubmit}>
        <input name="title" value={form.title} onChange={handleInput} placeholder="Title" className="border p-2 rounded w-full mb-2" required />
        <textarea name="description" value={form.description} onChange={handleInput} placeholder="Description" className="border p-2 rounded w-full mb-2" required />
        <input type="date" name="date" value={form.date} onChange={handleInput} className="border p-2 rounded w-full mb-2" required />
        <input name="time" value={form.time} onChange={handleInput} placeholder="Time" className="border p-2 rounded w-full mb-2" required />
        <input name="venue" value={form.venue} onChange={handleInput} placeholder="Venue" className="border p-2 rounded w-full mb-2" required />
        <input type="date" name="registrationDeadline" value={form.registrationDeadline} onChange={handleInput} className="border p-2 rounded w-full mb-2" />
        <input type="number" name="fee" value={form.fee} onChange={handleInput} placeholder="Fee" className="border p-2 rounded w-full mb-2" />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded mr-2">{editId ? 'Update' : 'Create'}</button>
        {editId && <button type="button" className="bg-gray-400 text-white px-4 py-2 rounded" onClick={() => { setEditId(null); setForm({ title: '', description: '', date: '', time: '', venue: '', registrationDeadline: '', fee: 0 }); }}>Cancel</button>}
      </form>
      <table className="w-full border mb-4">
        <thead><tr className="bg-gray-100"><th>Title</th><th>Date</th><th>Time</th><th>Venue</th><th>Actions</th></tr></thead>
        <tbody>
          {events.length === 0 && <tr><td colSpan={5}>No events</td></tr>}
          {events.map(e => (
            <tr key={e._id}>
              <td>{e.title}</td>
              <td>{e.date ? e.date.slice(0,10) : '-'}</td>
              <td>{e.time}</td>
              <td>{e.venue}</td>
              <td>
                <button className="bg-yellow-500 text-white px-2 py-1 rounded mr-2" onClick={() => handleEdit(e)}>Edit</button>
                <button className="bg-red-500 text-white px-2 py-1 rounded mr-2" onClick={() => handleDelete(e._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// --- Event Registrations ---
const EventRegistrations = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [selected, setSelected] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const clubId = user?.clubsJoined[0];

  useEffect(() => {
    if (!clubId) return;
    setLoading(true);
    api.get('/events')
      .then(res => {
        // Only show events hosted by this club
        setEvents((res.data || []).filter(e => e.type === 'club' && (e.clubId?._id === clubId || e.clubId === clubId)));
        setLoading(false);
      })
      .catch(() => { setError('Failed to load events'); setLoading(false); });
  }, [clubId]);

  const handleView = async (eventId) => {
    setLoading(true);
    try {
      const res = await api.get(`/events/${eventId}/registrations`);
      setRegistrations(res.data);
      setSelected(eventId);
    } catch {
      setError('Failed to load registrations');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h4 className="font-bold mb-2">Event Registrations</h4>
      <table className="w-full border mb-4">
        <thead><tr className="bg-gray-100"><th>Event</th><th>Actions</th></tr></thead>
        <tbody>
          {events.length === 0 && <tr><td colSpan={2}>No events</td></tr>}
          {events.map(e => (
            <tr key={e._id}>
              <td>{e.title}</td>
              <td><button className="bg-blue-500 text-white px-2 py-1 rounded" onClick={() => handleView(e._id)}>View Registrations</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      {selected && (
        <div className="mb-4">
          <h5 className="font-bold mb-2">Registrations for {events.find(e => e._id === selected)?.title}</h5>
          <table className="w-full border">
            <thead><tr className="bg-gray-100"><th>Name</th><th>Email</th><th>Student ID</th></tr></thead>
            <tbody>
              {registrations.length === 0 && <tr><td colSpan={3}>No registrations</td></tr>}
              {registrations.map(r => (
                <tr key={r._id}><td>{r.name}</td><td>{r.email}</td><td>{r.studentId}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};



// --- Club Announcements ---
const ClubAnnouncements = () => {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const clubId = user?.clubsJoined[0];

  useEffect(() => {
    if (!clubId) return;
    setLoading(true);
    Promise.all([
      api.get(`/notices?type=club&clubId=${clubId}`),
      api.get(`/events?clubId=${clubId}`)
    ])
      .then(([noticesRes, eventsRes]) => {
        const notices = (noticesRes.data || []).map(n => ({
          _id: n._id,
          type: 'Notice',
          title: n.title,
          content: n.content,
          date: n.createdAt || n.expiresAt,
        }));
        const events = (eventsRes.data || []).map(e => ({
          _id: e._id,
          type: 'Event',
          title: e.title,
          content: e.description,
          date: e.date,
        }));
        const all = [...notices, ...events].sort((a, b) => new Date(b.date) - new Date(a.date));
        setAnnouncements(all);
        setLoading(false);
      })
      .catch(() => { setError('Failed to load announcements'); setLoading(false); });
  }, [clubId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  return (
    <div>
      <h4 className="font-bold mb-2">Club Announcements</h4>
      <table className="w-full border mb-4">
        <thead>
          <tr className="bg-gray-100">
            <th>Type</th>
            <th>Title</th>
            <th>Date</th>
            <th>Content</th>
          </tr>
        </thead>
        <tbody>
          {announcements.length === 0 && <tr><td colSpan={4}>No announcements</td></tr>}
          {announcements.map(a => (
            <tr key={a.type + a._id}>
              <td>{a.type}</td>
              <td>{a.title}</td>
              <td>{a.date ? a.date.slice(0, 10) : '-'}</td>
              <td>{a.content?.slice(0, 60)}{a.content?.length > 60 ? '...' : ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const featureComponents = {
  joinRequests: <ClubJoinRequests />,
  members: <ClubMembers />,
  notices: <ClubNotices />,
  events: <ClubEvents />,
  registrations: <EventRegistrations />,
  announcements: <ClubAnnouncements />,
};


const AdminDashboard = () => {
  const { user } = useAuth();
  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeFeature, setActiveFeature] = useState(null);
  const handleOpen = (feature) => setActiveFeature(feature);
  const handleClose = () => setActiveFeature(null);

  useEffect(() => {
    const clubId = user?.clubsJoined?.[0];
    if (!clubId) return;
    setLoading(true);
    api.get(`/clubs/${clubId}`)
      .then(res => { setClub(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [user]);

  return (
    <div>
      <div className="flex items-center mb-6">
        {club?.logo && <img src={club.logo} alt="Club Logo" className="h-16 w-16 object-contain rounded-full mr-4 border" />}
        <div>
          <h2 className="text-2xl font-bold">{club?.name || 'Admin Dashboard'}</h2>
          {club?.description && <div className="text-gray-600 text-sm mt-1">{club.description}</div>}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
        <button className="bg-white p-4 rounded-lg shadow hover:bg-gray-100 transition" onClick={() => handleOpen('joinRequests')}>Manage Join Requests</button>
        <button className="bg-white p-4 rounded-lg shadow hover:bg-gray-100 transition" onClick={() => handleOpen('members')}>Manage Club Members</button>
        <button className="bg-white p-4 rounded-lg shadow hover:bg-gray-100 transition" onClick={() => handleOpen('announcements')}>Club Announcements</button>
        <button className="bg-white p-4 rounded-lg shadow hover:bg-gray-100 transition" onClick={() => handleOpen('notices')}>Club Notices</button>
        <button className="bg-white p-4 rounded-lg shadow hover:bg-gray-100 transition" onClick={() => handleOpen('events')}>Host Club Events</button>
        <button className="bg-white p-4 rounded-lg shadow hover:bg-gray-100 transition" onClick={() => handleOpen('registrations')}>Event Registrations</button>
      </div>

      {/* Modal for feature sections */}
      {activeFeature && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl relative">
            <button className="absolute top-2 right-2 text-gray-500 hover:text-black" onClick={handleClose}>&times;</button>
            {featureComponents[activeFeature]}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
