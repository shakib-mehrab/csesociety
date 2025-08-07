/* eslint-disable no-unused-vars */


import React, { useEffect, useState } from 'react';
import api from '../../services/api';

const ClubManagement = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', coordinator: '', contactEmail: '', logo: null });
  const [users, setUsers] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [editClub, setEditClub] = useState(null); // club being edited
  const [showView, setShowView] = useState(null); // club being viewed


  // Get auth token from localStorage


  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get('/clubs'),
      api.get('/users'),
    ])
      .then(([clubsRes, usersRes]) => {
        setClubs(clubsRes.data);
        setUsers(usersRes.data);
        setLoading(false);
      })
      .catch(() => { setError('Failed to load clubs or users'); setLoading(false); });
  }, [refresh]);

  const handleInput = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleLogo = e => setForm({ ...form, logo: e.target.files[0] });

  const handleCreate = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      let logoUrl = '';
      if (form.logo) {
        const data = new FormData();
        data.append('image', form.logo);
        const uploadRes = await api.post('/upload', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        logoUrl = uploadRes.data.url;
      }
      // Find coordinator by studentId
      const coordinatorUser = users.find(u => u.studentId === form.coordinator);
      if (!coordinatorUser) throw new Error('Coordinator not found by student ID');
      await api.post('/clubs', {
        name: form.name,
        description: form.description,
        coordinator: coordinatorUser._id,
        contactEmail: form.contactEmail,
        logo: logoUrl,
      });
      setShowCreate(false);
      setForm({ name: '', description: '', coordinator: '', contactEmail: '', logo: null });
      setRefresh(r => !r);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Edit club logic
  const handleEdit = club => {
    setEditClub(club);
    setForm({
      name: club.name,
      description: club.description,
      coordinator: club.coordinator?.studentId || '',
      contactEmail: club.contactEmail || '',
      logo: null,
    });
    setShowCreate(false);
  };

  const handleUpdate = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      let logoUrl = editClub.logo;
      if (form.logo) {
        const data = new FormData();
        data.append('image', form.logo);
        const uploadRes = await api.post('/upload', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        logoUrl = uploadRes.data.url;
      }
      const coordinatorUser = users.find(u => u.studentId === form.coordinator);
      if (!coordinatorUser) throw new Error('Coordinator not found by student ID');
      await api.put(`/clubs/${editClub._id}`, {
        name: form.name,
        description: form.description,
        coordinator: coordinatorUser._id,
        contactEmail: form.contactEmail,
        logo: logoUrl,
      });
      setEditClub(null);
      setForm({ name: '', description: '', coordinator: '', contactEmail: '', logo: null });
      setRefresh(r => !r);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // View club logic: fetch full club details (with members) before showing modal
  const handleView = async (club) => {
    setLoading(true);
    try {
      const res = await api.get(`/clubs/${club._id}`);
      setShowView(res.data);
    } catch (err) {
      setError('Failed to load club details');
    } finally {
      setLoading(false);
    }
  };
  const handleCloseView = () => setShowView(null);

  const handleDelete = async id => {
    if (!window.confirm('Delete this club?')) return;
    setLoading(true);
    setError('');
    try {
      await api.delete(`/clubs/${id}`);
      setRefresh(r => !r);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // TODO: Implement assign coordinator/sub-coordinators UI and logic

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Club Management</h3>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <button className="mb-4 px-4 py-2 bg-blue-600 text-white rounded" onClick={() => { setShowCreate(s => !s); setEditClub(null); }}>
        {showCreate ? 'Cancel' : 'Create New Club'}
      </button>

      {/* Create or Edit Club Form */}
      {(showCreate || editClub) && (
        <form className="mb-4 p-4 bg-gray-50 rounded" onSubmit={editClub ? handleUpdate : handleCreate}>
          <div className="mb-2">
            <input name="name" value={form.name} onChange={handleInput} placeholder="Club Name" className="border p-2 rounded w-full" required />
          </div>
          <div className="mb-2">
            <input name="description" value={form.description} onChange={handleInput} placeholder="Description" className="border p-2 rounded w-full" required />
          </div>
          <div className="mb-2">
            {/* Coordinator selection by studentId */}
            <input name="coordinator" value={form.coordinator} onChange={handleInput} placeholder="Coordinator Student ID" className="border p-2 rounded w-full" list="coordinator-list" required />
            <datalist id="coordinator-list">
              {users.map(u => (
                <option key={u._id} value={u.studentId}>{u.name} ({u.email})</option>
              ))}
            </datalist>
          </div>
          <div className="mb-2">
            <input name="contactEmail" value={form.contactEmail} onChange={handleInput} placeholder="Contact Email" className="border p-2 rounded w-full" />
          </div>
          <div className="mb-2">
            <input type="file" accept="image/*" onChange={handleLogo} className="border p-2 rounded w-full" />
          </div>
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded mr-2">{editClub ? 'Update' : 'Create'}</button>
          {editClub && <button type="button" className="bg-gray-400 text-white px-4 py-2 rounded" onClick={() => { setEditClub(null); setForm({ name: '', description: '', coordinator: '', contactEmail: '', logo: null }); }}>Cancel</button>}
        </form>
      )}

      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="w-full border mt-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Logo</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Description</th>
              <th className="p-2 border">Coordinator</th>
              <th className="p-2 border">Contact</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {clubs.map(club => (
              <tr key={club._id}>
                <td className="p-2 border text-center">{club.logo && <img src={club.logo} alt="logo" className="h-10 w-10 object-cover rounded-full mx-auto" />}</td>
                <td className="p-2 border">{club.name}</td>
                <td className="p-2 border">{club.description}</td>
                <td className="p-2 border">{club.coordinator?.name || club.coordinator || '-'}</td>
                <td className="p-2 border">{club.contactEmail}</td>
                <td className="p-2 border">
                  <button className="bg-blue-500 text-white px-2 py-1 rounded mr-2" onClick={() => handleView(club)}>View</button>
                  <button className="bg-yellow-500 text-white px-2 py-1 rounded mr-2" onClick={() => handleEdit(club)}>Edit</button>
                  <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => handleDelete(club._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Club Details Modal */}
      {showView && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative">
            <button className="absolute top-2 right-2 text-gray-500 hover:text-black" onClick={handleCloseView}>&times;</button>
            <h4 className="text-lg font-bold mb-2">{showView.name}</h4>
            {showView.logo && <img src={showView.logo} alt="logo" className="h-20 w-20 object-cover rounded-full mb-2" />}
            <div className="mb-2"><strong>Description:</strong> {showView.description}</div>
            <div className="mb-2"><strong>Contact:</strong> {showView.contactEmail}</div>
            <div className="mb-2"><strong>Coordinator:</strong> {showView.coordinator?.name} ({showView.coordinator?.email}, ID: {showView.coordinator?.studentId})</div>
            <div className="mb-2"><strong>Members:</strong>
              <ul className="list-disc ml-6">
                {Array.isArray(showView.members) && showView.members.length > 0 ? showView.members.map((m, idx) => (
                  <li key={m._id || idx}>{m.name} ({m.email}, ID: {m.studentId})</li>
                )) : <li>No members</li>}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClubManagement;
