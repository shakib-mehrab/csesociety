/* eslint-disable no-unused-vars */

import React, { useEffect, useState } from 'react';
import api from '../../../services/api';

const colors = {
  darkest: '#00183a',
  dark: '#002a54',
  medium: '#034986',
  light: '#409fc8',
};

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
    <div
      className="p-6 bg-gray-50 min-h-full"
      style={{ border: `1px solid ${colors.medium}` }}
    >
      <h3
        className="text-3xl font-extrabold mb-6 border-b pb-2"
        style={{ color: colors.darkest, borderColor: colors.medium }}
      >
        Club Management
      </h3>

      {error && (
        <div
          className="mb-4 p-3 rounded shadow-sm"
          style={{ backgroundColor: '#fddede', color: '#9b2226' }}
        >
          {error}
        </div>
      )}

      <button
        className="mb-6 inline-block text-white font-semibold px-6 py-3 rounded-full shadow-lg transition"
        onClick={() => { setShowCreate(s => !s); setEditClub(null); setError(''); }}
        style={{
          backgroundImage: `linear-gradient(to right, ${colors.medium}, #6b3cb0)`,
        }}
        onMouseOver={e => e.currentTarget.style.backgroundImage = `linear-gradient(to right, #6b3cb0, ${colors.medium})`}
        onMouseOut={e => e.currentTarget.style.backgroundImage = `linear-gradient(to right, ${colors.medium}, #6b3cb0)`}
      >
        {showCreate ? 'Cancel Create' : editClub ? 'Cancel Edit' : 'Create New Club'}
      </button>

      {(showCreate || editClub) && (
        <form
          onSubmit={editClub ? handleUpdate : handleCreate}
          className="mb-8 bg-white p-8 rounded-2xl shadow-xl max-w-3xl mx-auto"
          style={{ border: `1px solid ${colors.light}` }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { id: 'name', label: 'Club Name', required: true, placeholder: 'Enter club name', type: 'text' },
              { id: 'coordinator', label: 'Coordinator Student ID', required: true, placeholder: 'Coordinator student ID', type: 'text', list: 'coordinator-list' },
              { id: 'description', label: 'Description', required: true, placeholder: 'Brief description about the club', type: 'text', colSpan: 'md:col-span-2' },
              { id: 'contactEmail', label: 'Contact Email', required: false, placeholder: 'Email address', type: 'email' },
            ].map(({ id, label, required, placeholder, type, list, colSpan }) => (
              <div key={id} className={colSpan || ''}>
                <label className="block font-semibold mb-2" htmlFor={id} style={{ color: colors.dark }}>
                  {label} {required && <span className="text-red-500">*</span>}
                </label>
                <input
                  id={id}
                  name={id}
                  value={form[id]}
                  onChange={handleInput}
                  placeholder={placeholder}
                  required={required}
                  type={type}
                  list={list}
                  className="w-full p-3 rounded-xl transition outline-none shadow-sm"
                  style={{
                    border: `1px solid #ccc`,
                    color: colors.darkest,
                  }}
                  onFocus={e => e.currentTarget.style.borderColor = colors.medium}
                  onBlur={e => e.currentTarget.style.borderColor = '#ccc'}
                />
                {list === 'coordinator-list' && (
                  <datalist id="coordinator-list">
                    {users.map(u => (
                      <option key={u._id} value={u.studentId}>{u.name} ({u.email})</option>
                    ))}
                  </datalist>
                )}
              </div>
            ))}
            <div>
              <label className="block font-semibold mb-2" htmlFor="logo" style={{ color: colors.dark }}>
                Club Logo
              </label>
              <input
                id="logo"
                type="file"
                accept="image/*"
                onChange={handleLogo}
                className="w-full p-2 rounded-xl cursor-pointer transition shadow-sm"
                style={{
                  border: `1px solid #ccc`,
                  color: colors.darkest,
                }}
                onFocus={e => e.currentTarget.style.borderColor = colors.medium}
                onBlur={e => e.currentTarget.style.borderColor = '#ccc'}
              />
              {form.logo && (
                <div className="mt-3" style={{ color: colors.dark }}>
                  <p className="text-sm">Selected file: {form.logo.name}</p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 flex gap-4 justify-start">
            <button
              type="submit"
              disabled={loading}
              className="text-white font-semibold px-8 py-3 rounded-full shadow-lg transition disabled:opacity-50"
              style={{
                backgroundImage: `linear-gradient(to right, ${colors.medium}, #6b3cb0)`,
              }}
              onMouseOver={e => e.currentTarget.style.backgroundImage = `linear-gradient(to right, #6b3cb0, ${colors.medium})`}
              onMouseOut={e => e.currentTarget.style.backgroundImage = `linear-gradient(to right, ${colors.medium}, #6b3cb0)`}
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
                className="font-semibold px-6 py-3 rounded-full transition"
                style={{
                  backgroundColor: '#ddd',
                  color: colors.darkest,
                }}
                onMouseOver={e => {
                  e.currentTarget.style.backgroundColor = '#ccc';
                }}
                onMouseOut={e => {
                  e.currentTarget.style.backgroundColor = '#ddd';
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      )}

      {loading ? (
        <div className="text-center font-semibold py-12" style={{ color: colors.medium }}>
          Loading clubs...
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table
            className="w-full max-w-7xl mx-auto bg-white rounded-lg shadow-md border"
            style={{ borderColor: colors.light, color: colors.darkest }}
          >
            <thead
              className="font-semibold"
              style={{ backgroundColor: colors.light, color: '#fff' }}
            >
              <tr>
                <th className="p-4 border-r rounded-tl-lg" style={{ borderColor: colors.medium }}>Logo</th>
                <th className="p-4 border-r" style={{ borderColor: colors.medium }}>Name</th>
                <th className="p-4 border-r truncate max-w-xs" style={{ borderColor: colors.medium }}>Description</th>
                <th className="p-4 border-r" style={{ borderColor: colors.medium }}>Coordinator</th>
                <th className="p-4 border-r" style={{ borderColor: colors.medium }}>Contact</th>
                <th className="p-4 rounded-tr-lg" style={{ borderColor: colors.medium }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {clubs.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-6 text-center" style={{ color: colors.medium }}>
                    No clubs found.
                  </td>
                </tr>
              )}
              {clubs.map(club => (
                <tr
                  key={club._id}
                  className="hover:bg-indigo-50 transition cursor-pointer"
                  style={{ borderBottom: `1px solid ${colors.light}` }}
                >
                  <td className="p-4 border-r text-center" style={{ borderColor: colors.medium }}>
                    {club.logo ? (
                      <img
                        src={club.logo}
                        alt={`${club.name} logo`}
                        className="h-12 w-12 rounded-full object-cover mx-auto"
                      />
                    ) : (
                      <div
                        className="h-12 w-12 rounded-full mx-auto flex items-center justify-center font-bold"
                        style={{ backgroundColor: colors.light, color: colors.darkest }}
                      >
                        {club.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </td>
                  <td className="p-4 border-r" style={{ borderColor: colors.medium }}>{club.name}</td>
                  <td
                    className="p-4 border-r truncate max-w-xs"
                    title={club.description}
                    style={{ borderColor: colors.medium }}
                  >
                    {club.description}
                  </td>
                  <td className="p-4 border-r" style={{ borderColor: colors.medium }}>
                    {club.coordinator?.name || club.coordinator || '-'}
                  </td>
                  <td className="p-4 border-r" style={{ borderColor: colors.medium }}>
                    {club.contactEmail || '-'}
                  </td>
                  <td className="p-4 flex gap-2 justify-center">
                    <button
                      className="text-white px-3 py-1 rounded-md shadow-sm transition"
                      onClick={() => handleView(club)}
                      title="View Details"
                      style={{ backgroundColor: colors.medium }}
                      onMouseOver={e => e.currentTarget.style.backgroundColor = colors.dark}
                      onMouseOut={e => e.currentTarget.style.backgroundColor = colors.medium}
                    >
                      View
                    </button>
                    <button
                      className="text-white px-3 py-1 rounded-md shadow-sm transition"
                      onClick={() => handleEdit(club)}
                      title="Edit Club"
                      style={{ backgroundColor: '#d97706' /* amber-600 */ }}
                      onMouseOver={e => e.currentTarget.style.backgroundColor = '#b45309' /* amber-700 */ }
                      onMouseOut={e => e.currentTarget.style.backgroundColor = '#d97706'}
                    >
                      Edit
                    </button>
                    <button
                      className="text-white px-3 py-1 rounded-md shadow-sm transition"
                      onClick={() => handleDelete(club._id)}
                      title="Delete Club"
                      style={{ backgroundColor: '#9b2226' }}
                      onMouseOver={e => e.currentTarget.style.backgroundColor = '#7a1a1d'}
                      onMouseOut={e => e.currentTarget.style.backgroundColor = '#9b2226'}
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
            style={{ border: `2px solid ${colors.medium}` }}
          >
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 text-3xl font-bold focus:outline-none"
              onClick={handleCloseView}
              aria-label="Close details modal"
              style={{ color: colors.darkest }}
              onMouseOver={e => e.currentTarget.style.color = colors.medium}
              onMouseOut={e => e.currentTarget.style.color = colors.darkest}
            >
              &times;
            </button>

            <h4
              id="clubDetailsTitle"
              className="text-3xl font-extrabold mb-4"
              style={{ color: colors.darkest }}
            >
              {showView.name}
            </h4>

            {showView.logo && (
              <img
                src={showView.logo}
                alt={`${showView.name} logo`}
                className="h-24 w-24 rounded-full object-cover mb-6 mx-auto"
              />
            )}

            <p className="mb-3" style={{ color: colors.dark }}>
              <strong>Description:</strong> {showView.description}
            </p>
            <p className="mb-3" style={{ color: colors.dark }}>
              <strong>Contact:</strong> {showView.contactEmail || '-'}
            </p>
            <p className="mb-3" style={{ color: colors.dark }}>
              <strong>Coordinator:</strong> {showView.coordinator?.name} (
              {showView.coordinator?.email}, ID: {showView.coordinator?.studentId})
            </p>

            <div style={{ color: colors.dark }}>
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
