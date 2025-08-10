import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { useAuth } from '../../../hooks/useAuth';

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
  const handleEdit = n => {
    setForm({ title: n.title, content: n.content, expiresAt: n.expiresAt?.slice(0, 10) || '' });
    setEditId(n._id);
  };
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

  if (loading) {
    return (
      <div className="flex justify-center py-6 text-gray-600 text-lg">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 bg-red-50 p-3 rounded-lg border border-red-200 mb-4">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-xl p-6">
      <h4 className="font-semibold text-lg mb-4 text-gray-800">
        Club Notices
      </h4>

      <form className="mb-6" onSubmit={handleSubmit}>
        <input
          name="title"
          value={form.title}
          onChange={handleInput}
          placeholder="Title"
          className="border border-gray-300 p-3 rounded-lg w-full mb-3 focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />
        <textarea
          name="content"
          value={form.content}
          onChange={handleInput}
          placeholder="Content"
          className="border border-gray-300 p-3 rounded-lg w-full mb-3 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
          rows={4}
          required
        />
        <input
          type="date"
          name="expiresAt"
          value={form.expiresAt}
          onChange={handleInput}
          className="border border-gray-300 p-3 rounded-lg w-full mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <div>
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg mr-3 transition"
          >
            {editId ? 'Update' : 'Publish'}
          </button>
          {editId && (
            <button
              type="button"
              className="bg-gray-400 hover:bg-gray-500 text-white px-5 py-2 rounded-lg transition"
              onClick={() => {
                setEditId(null);
                setForm({ title: '', content: '', expiresAt: '' });
                setError('');
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-50 text-gray-700">
            <tr>
              <th className="py-3 px-4 text-left">Title</th>
              <th className="py-3 px-4 text-left">Content</th>
              <th className="py-3 px-4 text-left">Expires</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {notices.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-4 px-4 text-center text-gray-500">
                  No notices
                </td>
              </tr>
            ) : (
              notices.map(n => (
                <tr key={n._id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4">{n.title}</td>
                  <td className="py-3 px-4">{n.content.split(' ').slice(0, 5).join(' ')}{n.content.split(' ').length > 5 ? '...' : ''}</td>
                  <td className="py-3 px-4">{n.expiresAt ? n.expiresAt.slice(0, 10) : '-'}</td>
                  <td className="py-3 px-4 space-x-2">
                    <button
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1.5 rounded-lg transition"
                      onClick={() => handleEdit(n)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg transition"
                      onClick={() => handleDelete(n._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClubNotices;
