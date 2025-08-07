

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
      const clubRes = await api.post('/clubs', {
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
      <button className="mb-4 px-4 py-2 bg-blue-600 text-white rounded" onClick={() => setShowCreate(s => !s)}>
        {showCreate ? 'Cancel' : 'Create New Club'}
      </button>
      {showCreate && (
        <form className="mb-4 p-4 bg-gray-50 rounded" onSubmit={handleCreate}>
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
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Create</button>
        </form>
      )}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="w-full border mt-4">
          <thead>
            <tr className="bg-gray-100">
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
                <td className="p-2 border">{club.name}</td>
                <td className="p-2 border">{club.description}</td>
                <td className="p-2 border">{club.coordinator?.name || club.coordinator || '-'}</td>
                <td className="p-2 border">{club.contactEmail}</td>
                <td className="p-2 border">
                  <button className="bg-red-500 text-white px-2 py-1 rounded mr-2" onClick={() => handleDelete(club._id)}>Delete</button>
                  {/* TODO: Add assign coordinator/sub-coordinators button */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ClubManagement;
