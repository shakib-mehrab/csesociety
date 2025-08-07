import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../services/api';

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    studentId: '',
    department: 'CSE',
    phone: '',
    batch: '',
    profilePicture: '',
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    setPhotoFile(file);
    if (file) {
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    // Clean up the preview URL when the component unmounts or file changes
    return () => {
      if (photoPreview) {
        URL.revokeObjectURL(photoPreview);
      }
    };
  }, [photoPreview]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    let photoUrl = formData.profilePicture;
    try {
      if (photoFile) {
        const data = new FormData();
        data.append('image', photoFile);
        const uploadRes = await api.post('/upload', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        photoUrl = uploadRes.data.url;
      }
      await register({ ...formData, profilePicture: photoUrl });
      toast.success('Signed up successfully');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 py-8 px-2">
      <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-xl border border-blue-100">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-8">Create Your Account</h2>
        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            {photoPreview || formData.profilePicture ? (
              <img
                src={photoPreview || formData.profilePicture}
                alt="Profile Preview"
                className="w-24 h-24 rounded-full object-cover border-4 border-blue-200 shadow"
              />
            ) : (
              <span className="w-24 h-24 flex items-center justify-center rounded-full bg-blue-100 border-4 border-blue-200 shadow">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#3b82f6" className="w-14 h-14">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 19.5a7.5 7.5 0 1115 0v.75A2.25 2.25 0 0117.25 22.5h-10.5A2.25 2.25 0 014.5 20.25v-.75z" />
                </svg>
              </span>
            )}
            <label className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 cursor-pointer shadow-lg hover:bg-blue-700 transition">
              <input type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
              <span className="flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75V7.5A2.25 2.25 0 014.5 5.25h3.379c.414 0 .789-.252.948-.633l.447-1.074A1.125 1.125 0 0110.293 3h3.414c.462 0 .88.274 1.019.693l.447 1.074c.159.381.534.633.948.633H19.5a2.25 2.25 0 012.25 2.25v11.25a2.25 2.25 0 01-2.25 2.25H4.5A2.25 2.25 0 012.25 18.75z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                </svg>
              </span>
            </label>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Student ID</label>
            <input type="text" name="studentId" value={formData.studentId} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Department</label>
            <input type="text" name="department" value={formData.department} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Phone</label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Batch</label>
            <input type="text" name="batch" value={formData.batch} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
          </div>
        </div>
        <button
          type="submit"
          className="w-full mt-8 bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition text-lg shadow"
          disabled={loading}
        >
          {loading ? 'Signing Up...' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
};

export default SignUp;
