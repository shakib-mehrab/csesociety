import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';

const UserProfilePage = () => {
  const { user, setUser } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    batch: user?.batch || '',
    department: user?.department || '',
    photo: user?.profilePicture || '',
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleInput = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handlePhoto = e => {
    setPhotoFile(e.target.files[0]);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    let photoUrl = form.photo;
    try {
      if (photoFile) {
        const data = new FormData();
        data.append('image', photoFile);
        const uploadRes = await api.post('/upload', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        photoUrl = uploadRes.data.url;
      }
      const updateRes = await api.put('/users/profile', {
        ...form,
        profilePicture: photoUrl,
      });
      setUser && setUser(updateRes.data);
      setSuccess('Profile updated successfully!');
      setShowForm(false);
    } catch (err) {
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg border border-gray-100">
      <div className="flex items-center gap-6 mb-8">
        <div className="relative">
          <img
            src={user?.profilePicture || '/default-avatar.png'}
            alt="Profile"
            className="w-28 h-28 rounded-full object-cover border-4 border-blue-200 shadow"
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">{user?.name}</h1>
          <p className="text-gray-600">{user?.email}</p>
          <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">{user?.role}</span>
          <div className="mt-2 space-y-1 text-gray-500 text-sm">
            {user?.studentId && (
              <p><span className="font-medium">Student ID:</span> {user.studentId}</p>
            )}
            {user?.phone && (
              <p><span className="font-medium">Phone:</span> {user.phone}</p>
            )}
            {user?.batch && (
              <p><span className="font-medium">Batch:</span> {user.batch}</p>
            )}
            {user?.department && (
              <p><span className="font-medium">Department:</span> {user.department}</p>
            )}
            {user?.createdAt && (
              <p><span className="font-medium">Joined:</span> {new Date(user.createdAt).toLocaleDateString()}</p>
            )}
          </div>
          <button
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 transition"
            onClick={() => {
              setForm({
                name: user?.name || '',
                email: user?.email || '',
                phone: user?.phone || '',
                batch: user?.batch || '',
                department: user?.department || '',
                photo: user?.profilePicture || '',
              });
              setShowForm(true);
              setSuccess('');
              setError('');
            }}
            disabled={showForm}
          >
            Update
          </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <div className="relative flex flex-col items-center mb-4">
            <img
              src={form.photo || '/default-avatar.png'}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-4 border-blue-200 shadow"
            />
            <label className="absolute bottom-0 right-1 bg-blue-600 text-white rounded-full p-2 cursor-pointer shadow-lg hover:bg-blue-700 transition">
              <input type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
              <span className="text-xs">Edit</span>
            </label>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Name</label>
            <input name="name" value={form.name} onChange={handleInput} className="w-full border rounded px-3 py-2" required />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Email</label>
            <input name="email" value={form.email} onChange={handleInput} className="w-full border rounded px-3 py-2" required type="email" />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Phone</label>
            <input name="phone" value={form.phone} onChange={handleInput} className="w-full border rounded px-3 py-2" type="tel" />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Batch</label>
            <input name="batch" value={form.batch} onChange={handleInput} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Department</label>
            <input name="department" value={form.department} onChange={handleInput} className="w-full border rounded px-3 py-2" />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition" disabled={loading}>
              {loading ? 'Updating...' : 'Save Changes'}
            </button>
            <button
              type="button"
              className="flex-1 bg-gray-200 text-gray-700 py-2 rounded font-semibold hover:bg-gray-300 transition"
              onClick={() => setShowForm(false)}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
          {success && <div className="text-green-600 text-center mt-2">{success}</div>}
          {error && <div className="text-red-600 text-center mt-2">{error}</div>}
        </form>
      )}
    </div>
  );
};

export default UserProfilePage;
