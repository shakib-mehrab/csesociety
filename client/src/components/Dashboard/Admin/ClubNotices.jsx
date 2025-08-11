/* eslint-disable no-unused-vars */

import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { useAuth } from '../../../hooks/useAuth';
import { Calendar, FileText, Pencil } from 'lucide-react';

const ClubNotices = () => {
  const { user } = useAuth();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ title: '', content: '', expiresAt: '' });
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [viewNotice, setViewNotice] = useState(null);
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
      setShowForm(false);
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
    setShowForm(true);
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

  return (
    <div className="bg-gradient-to-br from-[#eaf2fa] via-[#6aa9d0]/20 to-[#002147]/10 shadow-md rounded-2xl p-6 border border-[#01457e]/20">
      <h4 className="font-extrabold text-2xl mb-4 text-[#002147] tracking-wide">
        Club Notices
      </h4>

      <div className="mb-6">
        <button
          onClick={() => { setShowForm(true); setEditId(null); setForm({ title: '', content: '', expiresAt: '' }); }}
          className="bg-[#004983] hover:bg-[#002147] text-white px-6 py-2 rounded-lg font-semibold shadow transition"
        >
          Add Notice
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Blurry overlay */}
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" style={{ zIndex: 0 }} />
          <div className="relative bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg mx-4 flex flex-col items-center" style={{ zIndex: 1 }}>
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl"
              onClick={() => { setShowForm(false); setEditId(null); setForm({ title: '', content: '', expiresAt: '' }); }}
              aria-label="Close"
              type="button"
            >
              &times;
            </button>
            <form onSubmit={handleSubmit} className="w-full space-y-5 mt-2">
              {/* Title */}
              <div className="relative flex items-center">
                <Pencil className="absolute left-3 text-[#01457e]" size={20} />
                <input
                  name="title"
                  value={form.title}
                  onChange={handleInput}
                  placeholder="Notice Title"
                  className="pl-10 border border-[#01457e] p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#6aa9d0]"
                  required
                />
              </div>

              {/* Content */}
              <div className="relative flex items-start">
                <FileText className="absolute left-3 top-3 text-[#01457e]" size={20} />
                <textarea
                  name="content"
                  value={form.content}
                  onChange={handleInput}
                  placeholder="Notice Content"
                  className="pl-10 border border-[#01457e] p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#6aa9d0] resize-none"
                  rows={4}
                  required
                />
              </div>

              {/* Expires At */}
              <div className="relative flex items-center">
                <Calendar className="absolute left-3 text-[#01457e]" size={20} />
                <input
                  type="date"
                  name="expiresAt"
                  value={form.expiresAt}
                  onChange={handleInput}
                  className="pl-10 border border-[#01457e] p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#6aa9d0]"
                />
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="submit"
                  className="bg-[#004983] hover:bg-[#002147] text-white px-6 py-2 rounded-lg font-semibold shadow transition"
                >
                  {editId ? 'Update' : 'Publish'}
                </button>
                <button
                  type="button"
                  className="bg-[#6aa9d0] hover:bg-[#01457e] text-white px-6 py-2 rounded-lg font-semibold shadow transition"
                  onClick={() => { setEditId(null); setShowForm(false); setForm({ title: '', content: '', expiresAt: '' }); setError(''); }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-[#01457e]/30 shadow-sm mt-6">
        <table className="w-full table-auto text-sm rounded-xl overflow-hidden">
          <thead className="bg-gradient-to-r from-[#002147] via-[#01457e] to-[#004983] text-white">
            <tr>
              <th className="py-3 px-4 text-left font-semibold">Title</th>
              <th className="py-3 px-4 text-left font-semibold">Content</th>
              <th className="py-3 px-4 text-left font-semibold">Expires</th>
              <th className="py-3 px-4 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white/80">
            {notices.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-4 px-4 text-center text-[#01457e]">No notices</td>
              </tr>
            ) : (
              notices.map(n => (
                <tr key={n._id} className="hover:bg-[#eaf2fa] transition-colors border-b last:border-b-0">
                  <td className="py-3 px-4 text-[#002147] font-medium">{n.title}</td>
                  <td className="py-3 px-4 text-[#01457e]">
                    {n.content.split(' ').slice(0, 5).join(' ')}{n.content.split(' ').length > 5 ? '...' : ''}
                    <button
                      className="ml-2 px-4 py-1 rounded-full bg-[#eaf2fa] text-[#004983] hover:bg-[#6aa9d0] hover:text-white text-xs font-semibold shadow transition-all focus:outline-none focus:ring-2 focus:ring-[#01457e] focus:ring-offset-2"
                      style={{ minWidth: 60 }}
                      onClick={() => setViewNotice(n)}
                    >
                      View
                    </button>
                  </td>
                  <td className="py-3 px-4 text-[#01457e]">{n.expiresAt ? n.expiresAt.slice(0, 10) : '-'}</td>
                  <td className="py-3 px-4 space-x-2 flex flex-wrap items-center gap-2">
                    <button
                      className="bg-[#004983] hover:bg-[#002147] text-white px-3 py-1.5 rounded-lg transition shadow-sm"
                      onClick={() => handleEdit(n)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg transition shadow-sm"
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

      {/* Notice Details Modal */}
      {viewNotice && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ cursor: 'pointer' }}
          onClick={e => {
            // Only close if clicking the overlay, not the modal itself
            if (e.target === e.currentTarget) setViewNotice(null);
          }}
        >
          {/* Blurry overlay for modal consistency */}
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" style={{ zIndex: 0 }} />
          <div
            className="relative bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg mx-4 flex flex-col items-center animate-fadeIn"
            style={{ zIndex: 1, cursor: 'auto' }}
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl"
              onClick={() => setViewNotice(null)}
              aria-label="Close"
              type="button"
            >
              &times;
            </button>
            <h3 className="text-xl font-bold mb-2 text-blue-700 text-center w-full break-words">{viewNotice.title}</h3>
            <div className="mb-2 text-gray-700 whitespace-pre-line w-full text-center break-words">{viewNotice.content}</div>
            <div className="text-sm text-gray-500 w-full text-center mt-2">Expires: {viewNotice.expiresAt ? viewNotice.expiresAt.slice(0, 10) : '-'}</div>
            <button
              className="mt-6 px-6 py-2 rounded-lg bg-[#eaf2fa] text-[#004983] hover:bg-[#6aa9d0] hover:text-white font-semibold shadow transition-all focus:outline-none focus:ring-2 focus:ring-[#01457e] focus:ring-offset-2"
              onClick={() => setViewNotice(null)}
              type="button"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClubNotices;
