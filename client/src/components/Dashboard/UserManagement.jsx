
import React, { useState, useEffect } from 'react';
import api from '../../services/api';
const API_BASE = '/api/users';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [role, setRole] = useState('');
  const [refresh, setRefresh] = useState(false);

  const [joinRequests, setJoinRequests] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;
  const getAuthToken = () => localStorage.getItem('token');

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get('/users'),
      api.get('/clubs/requests'),
    ])
      .then(([usersRes, joinReqRes]) => {
        setUsers(usersRes.data);
        setJoinRequests(joinReqRes.data);
        setCurrentPage(1);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load users or join requests');
        setLoading(false);
      });
  }, [refresh]);

  const handleRoleChange = (user) => {
    setSelectedUser(user);
    setRole(user.role);
  };

  const handleRoleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/${selectedUser._id}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify({ role }),
      });
      if (!res.ok) throw new Error('Failed to update role');
      setSelectedUser(null);
      setRefresh(r => !r);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/${userId}/approve`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
        },
      });
      if (!res.ok) throw new Error('Failed to approve user');
      setRefresh(r => !r);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Pagination calculations
  const totalPages = Math.ceil(users.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const currentUsers = users.slice(startIndex, startIndex + usersPerPage);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h3 className="text-2xl font-semibold mb-6 text-gray-800">👥 User Management</h3>

      {error && <div className="bg-red-100 text-red-600 px-4 py-2 rounded mb-4">{error}</div>}
      {loading ? (
        <div className="text-center text-gray-600">Loading users...</div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border-collapse rounded shadow overflow-hidden">
              <thead className="bg-gray-100 text-gray-700 text-left">
                <tr>
                  <th className="p-3 border-b">Name</th>
                  <th className="p-3 border-b">Email</th>
                  <th className="p-3 border-b">Role</th>
                  <th className="p-3 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map(user => (
                  <tr key={user._id} className="hover:bg-gray-50 transition">
                    <td className="p-3 border-b">{user.name}</td>
                    <td className="p-3 border-b">{user.email}</td>
                    <td className="p-3 border-b capitalize">{user.role}</td>
                    <td className="p-3 border-b">
                      <button
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded shadow transition"
                        onClick={() => handleRoleChange(user)}
                      >
                        Change Role
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-end items-center gap-4 mt-4">
            <button
              onClick={() => setCurrentPage(prev => prev - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded ${
                currentPage === 1 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              Previous
            </button>
            <span className="text-gray-700 font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => prev + 1)}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded ${
                currentPage === totalPages ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              Next
            </button>
          </div>
        </>
      )}

      {/* Role change modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative animate-fadeIn">
            <button
              className="absolute top-2 right-3 text-gray-500 hover:text-red-600 text-2xl"
              onClick={() => setSelectedUser(null)}
            >
              &times;
            </button>
            <h4 className="text-xl font-bold mb-4 text-gray-800">
              Change Role for <span className="text-blue-600">{selectedUser.name}</span>
            </h4>
            <form onSubmit={handleRoleSubmit}>
              <select
                className="border border-gray-300 rounded px-4 py-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={role}
                onChange={e => setRole(e.target.value)}
              >
                <option value="member">Member</option>
                <option value="sub_coordinator">Sub-Coordinator</option>
                <option value="coordinator">Coordinator</option>
                <option value="admin">Admin</option>
                <option value="super_admin">Super Admin</option>
              </select>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition shadow"
              >
                Update Role
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Club Join Requests Section */}
      <div className="mt-10">
        <h4 className="text-xl font-bold mb-4 text-gray-800">Club Join Requests</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border-collapse rounded shadow overflow-hidden">
            <thead className="bg-gray-100 text-gray-700 text-left">
              <tr>
                <th className="p-3 border-b">User</th>
                <th className="p-3 border-b">Student ID</th>
                <th className="p-3 border-b">Club</th>
                <th className="p-3 border-b">Status</th>
                <th className="p-3 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {joinRequests.map(req => (
                <tr key={req._id} className="hover:bg-gray-50 transition">
                  <td className="p-3 border-b">{req.userId?.name} ({req.userId?.email})</td>
                  <td className="p-3 border-b">{req.userId?.studentId}</td>
                  <td className="p-3 border-b">{req.clubId?.name}</td>
                  <td className="p-3 border-b capitalize">{req.status}</td>
                  <td className="p-3 border-b space-x-2">
                    {req.status === 'pending' && (
                      <>
                        <button
                          className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded"
                          onClick={async () => {
                            setLoading(true);
                            try {
                              await api.put(`/clubs/requests/${req._id}`, { status: 'approved' });
                              setRefresh(r => !r);
                            } catch {
                              setError('Failed to approve request');
                            } finally {
                              setLoading(false);
                            }
                          }}
                        >
                          Approve
                        </button>
                        <button
                          className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                          onClick={async () => {
                            setLoading(true);
                            try {
                              await api.put(`/clubs/requests/${req._id}`, { status: 'rejected' });
                              setRefresh(r => !r);
                            } catch {
                              setError('Failed to reject request');
                            } finally {
                              setLoading(false);
                            }
                          }}
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
