/* eslint-disable no-unused-vars */

import React, { useEffect, useState } from 'react';
import api from '../../../services/api';

const ClubManagement = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', coordinator: '', contactEmail: '', logo: null });
  const [users, setUsers] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [editClub, setEditClub] = useState(null);
  const [showView, setShowView] = useState(null);

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

  return (
    <div className="p-6 bg-gray-50 min-h-full">
      <h3 className="text-3xl font-extrabold text-indigo-700 mb-6 border-b pb-2">Club Management</h3>

      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded shadow-sm">{error}</div>}

      <button
        className="mb-6 inline-block bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-purple-600 hover:to-indigo-600
          text-white font-semibold px-6 py-3 rounded-full shadow-lg transition"
        onClick={() => { setShowCreate(s => !s); setEditClub(null); setError(''); }}
      >
        {showCreate ? 'Cancel Create' : editClub ? 'Cancel Edit' : 'Create New Club'}
      </button>

      {(showCreate || editClub) && (
        <form
          onSubmit={editClub ? handleUpdate : handleCreate}
          className="mb-8 bg-white p-8 rounded-2xl shadow-xl max-w-3xl mx-auto"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2" htmlFor="name">Club Name <span className="text-red-500">*</span></label>
              <input
                id="name"
                name="name"
                value={form.name}
                onChange={handleInput}
                placeholder="Enter club name"
                required
                className="w-full p-3 rounded-xl border border-gray-300 focus:border-indigo-500
                  focus:ring-2 focus:ring-indigo-400 transition outline-none shadow-sm"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2" htmlFor="coordinator">Coordinator Student ID <span className="text-red-500">*</span></label>
              <input
                id="coordinator"
                name="coordinator"
                value={form.coordinator}
                onChange={handleInput}
                placeholder="Coordinator student ID"
                list="coordinator-list"
                required
                className="w-full p-3 rounded-xl border border-gray-300 focus:border-indigo-500
                  focus:ring-2 focus:ring-indigo-400 transition outline-none shadow-sm"
              />
              <datalist id="coordinator-list">
                {users.map(u => (
                  <option key={u._id} value={u.studentId}>{u.name} ({u.email})</option>
                ))}
              </datalist>
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-700 font-semibold mb-2" htmlFor="description">Description <span className="text-red-500">*</span></label>
              <input
                id="description"
                name="description"
                value={form.description}
                onChange={handleInput}
                placeholder="Brief description about the club"
                required
                className="w-full p-3 rounded-xl border border-gray-300 focus:border-indigo-500
                  focus:ring-2 focus:ring-indigo-400 transition outline-none shadow-sm"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2" htmlFor="contactEmail">Contact Email</label>
              <input
                id="contactEmail"
                name="contactEmail"
                value={form.contactEmail}
                onChange={handleInput}
                placeholder="Email address"
                type="email"
                className="w-full p-3 rounded-xl border border-gray-300 focus:border-indigo-500
                  focus:ring-2 focus:ring-indigo-400 transition outline-none shadow-sm"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2" htmlFor="logo">Club Logo</label>
              <input
                id="logo"
                type="file"
                accept="image/*"
                onChange={handleLogo}
                className="w-full p-2 rounded-xl border border-gray-300 cursor-pointer
                  focus:outline-none focus:ring-2 focus:ring-indigo-400 transition shadow-sm"
              />
              {form.logo && (
                <div className="mt-3">
                  <p className="text-sm text-gray-600">Selected file: {form.logo.name}</p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 flex gap-4 justify-start">
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold px-8 py-3 rounded-full shadow-lg
                hover:from-purple-600 hover:to-indigo-600 transition disabled:opacity-50"
            >
              {editClub ? 'Update Club' : 'Create Club'}
            </button>
            {(editClub || showCreate) && (
              <button
                type="button"
                onClick={() => {
                  setEditClub(null);
                  setShowCreate(false);
                  setForm({ name: '', description: '', coordinator: '', contactEmail: '', logo: null });
                  setError('');
                }}
                className="bg-gray-300 text-gray-700 font-semibold px-6 py-3 rounded-full
                  hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      )}

      {loading ? (
        <div className="text-center text-indigo-600 font-semibold py-12">Loading clubs...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full max-w-7xl mx-auto bg-white rounded-lg shadow-md border border-gray-200">
            <thead className="bg-indigo-100 text-indigo-900 font-semibold">
              <tr>
                <th className="p-4 border-r border-indigo-200 rounded-tl-lg">Logo</th>
                <th className="p-4 border-r border-indigo-200">Name</th>
                <th className="p-4 border-r border-indigo-200">Description</th>
                <th className="p-4 border-r border-indigo-200">Coordinator</th>
                <th className="p-4 border-r border-indigo-200">Contact</th>
                <th className="p-4 rounded-tr-lg">Actions</th>
              </tr>
            </thead>
            <tbody>
              {clubs.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-6 text-center text-gray-500">
                    No clubs found.
                  </td>
                </tr>
              )}
              {clubs.map(club => (
                <tr
                  key={club._id}
                  className="hover:bg-indigo-50 transition cursor-pointer"
                >
                  <td className="p-4 border-r border-indigo-200 text-center">
                    {club.logo ? (
                      <img
                        src={club.logo}
                        alt={`${club.name} logo`}
                        className="h-12 w-12 rounded-full object-cover mx-auto"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-indigo-200 mx-auto flex items-center justify-center text-indigo-600 font-bold">
                        {club.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </td>
                  <td className="p-4 border-r border-indigo-200">{club.name}</td>
                  <td className="p-4 border-r border-indigo-200 truncate max-w-xs" title={club.description}>{club.description}</td>
                  <td className="p-4 border-r border-indigo-200">{club.coordinator?.name || club.coordinator || '-'}</td>
                  <td className="p-4 border-r border-indigo-200">{club.contactEmail || '-'}</td>
                  <td className="p-4 flex gap-2 justify-center">
                    <button
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-md shadow-sm transition"
                      onClick={() => handleView(club)}
                      title="View Details"
                    >
                      View
                    </button>
                    <button
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md shadow-sm transition"
                      onClick={() => handleEdit(club)}
                      title="Edit Club"
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md shadow-sm transition"
                      onClick={() => handleDelete(club._id)}
                      title="Delete Club"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Club Details Modal */}
      {showView && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div
            className="bg-white rounded-3xl shadow-xl max-w-lg w-full max-h-[80vh] overflow-y-auto p-8 relative"
            role="dialog"
            aria-modal="true"
            aria-labelledby="clubDetailsTitle"
          >
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 text-3xl font-bold focus:outline-none"
              onClick={handleCloseView}
              aria-label="Close details modal"
            >
              &times;
            </button>

            <h4 id="clubDetailsTitle" className="text-3xl font-extrabold mb-4 text-indigo-700">
              {showView.name}
            </h4>

            {showView.logo && (
              <img
                src={showView.logo}
                alt={`${showView.name} logo`}
                className="h-24 w-24 rounded-full object-cover mb-6 mx-auto"
              />
            )}

            <p className="mb-3"><strong>Description:</strong> {showView.description}</p>
            <p className="mb-3"><strong>Contact:</strong> {showView.contactEmail || '-'}</p>
            <p className="mb-3">
              <strong>Coordinator:</strong> {showView.coordinator?.name} (
              {showView.coordinator?.email}, ID: {showView.coordinator?.studentId})
            </p>

            <div>
              <strong>Members:</strong>
              {Array.isArray(showView.members) && showView.members.length > 0 ? (
                <ul className="list-disc ml-6 max-h-48 overflow-y-auto">
                  {showView.members.map((m, idx) => (
                    <li key={m._id || idx}>
                      {m.name} ({m.email}, ID: {m.studentId})
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No members</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClubManagement;
