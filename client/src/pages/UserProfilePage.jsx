/* eslint-disable no-empty */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import { FaEdit, FaPhone, FaUserGraduate, FaUniversity, FaCalendarAlt, FaEnvelope, FaIdBadge } from 'react-icons/fa';

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
  const [photoPreview, setPhotoPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleInput = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handlePhoto = (e) => {
    const file = e.target.files[0];
    setPhotoFile(file);
    if (file) setPhotoPreview(URL.createObjectURL(file));
  };

  useEffect(() => {
    return () => {
      if (photoPreview) URL.revokeObjectURL(photoPreview);
    };
  }, [photoPreview]);

  const handleSubmit = async (e) => {
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
      setSuccess('✅ Profile updated successfully!');
      setShowForm(false);
    } catch (err) {
      setError('❌ Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg border border-[#409fc8]">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
        <div className="relative">
          <img
            src={user?.profilePicture || '/default-avatar.png'}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-[#409fc8] shadow-lg"
          />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl font-bold mb-1 text-[#00183a]">{user?.name}</h1>
          <p className="flex items-center gap-2 justify-center md:justify-start text-[#034986]">
            <FaEnvelope /> {user?.email}
          </p>
          <span className="inline-block mt-3 px-3 py-1 bg-[#409fc8] text-white rounded-full text-xs font-semibold shadow-md">
            {user?.role}
          </span>

          {/* User details */}
          <div className="mt-4 space-y-2 text-sm text-[#002a54]">
            {user?.studentId && (
              <p className="flex items-center gap-2">
                <FaIdBadge /> <span className="font-medium">ID:</span> {user.studentId}
              </p>
            )}
            {user?.phone && (
              <p className="flex items-center gap-2">
                <FaPhone /> <span className="font-medium">Phone:</span> {user.phone}
              </p>
            )}
            {user?.batch && (
              <p className="flex items-center gap-2">
                <FaUserGraduate /> <span className="font-medium">Batch:</span> {user.batch}
              </p>
            )}
            {user?.department && (
              <p className="flex items-center gap-2">
                <FaUniversity /> <span className="font-medium">Dept:</span> {user.department}
              </p>
            )}
            {user?.createdAt && (
              <p className="flex items-center gap-2">
                <FaCalendarAlt /> <span className="font-medium">Joined:</span>{' '}
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            )}
          </div>

          {/* Update Button */}
          <button
            className="mt-5 px-5 py-2 bg-[#034986] text-white rounded-lg font-semibold shadow-md hover:bg-[#002a54] transition flex items-center gap-2 mx-auto md:mx-0"
            onClick={() => {
              setForm({
                name: user?.name || '',
                email: user?.email || '',
                phone: user?.phone ?? '',
                batch: user?.batch ?? '',
                department: user?.department ?? '',
                photo: user?.profilePicture || '',
              });
              setPhotoPreview('');
              setPhotoFile(null);
              setShowForm(true);
              setSuccess('');
              setError('');
            }}
            disabled={showForm}
          >
            <FaEdit /> Update Profile
          </button>
        </div>
      </div>

      {/* Edit Form */}
      {showForm && (
        <form
          onSubmit={async (e) => {
            await handleSubmit(e);
            try {
              const res = await api.get('/auth/me');
              setUser && setUser(res.data);
            } catch {}
          }}
          className="space-y-4 mt-6 bg-[#f8f9fa] p-5 rounded-xl shadow-inner"
        >
          {/* Photo Upload */}
          <div className="relative flex flex-col items-center mb-4">
            <img
              src={photoPreview || form.photo || '/default-avatar.png'}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-4 border-[#409fc8] shadow"
            />
            <label className="absolute bottom-0 right-[40%] bg-[#034986] text-white rounded-full p-2 cursor-pointer shadow-lg hover:bg-[#002a54] transition">
              <input type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
              <FaEdit />
            </label>
          </div>

          {/* Inputs */}
          {[
            { label: 'Name', name: 'name', type: 'text' },
            { label: 'Email', name: 'email', type: 'email' },
            { label: 'Phone', name: 'phone', type: 'tel' },
            { label: 'Batch', name: 'batch', type: 'text' },
            { label: 'Department', name: 'department', type: 'text' },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium mb-1 text-[#00183a]">{field.label}</label>
              <input
                name={field.name}
                type={field.type}
                value={form[field.name]}
                onChange={handleInput}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-[#00183a] focus:outline-none focus:border-[#409fc8] transition"
              />
            </div>
          ))}

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 bg-[#034986] text-white py-2 rounded-lg font-semibold hover:bg-[#002a54] transition"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Save Changes'}
            </button>
            <button
              type="button"
              className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg font-semibold hover:bg-gray-300 transition"
              onClick={() => setShowForm(false)}
              disabled={loading}
            >
              Cancel
            </button>
          </div>

          {/* Status Messages */}
          {success && <div className="text-green-600 text-center mt-2">{success}</div>}
          {error && <div className="text-red-600 text-center mt-2">{error}</div>}
        </form>
      )}
    </div>
  );
};

export default UserProfilePage;
