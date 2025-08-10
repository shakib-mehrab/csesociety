/* eslint-disable no-unused-vars */
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
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  // Delete user handler
  const handleDeleteUser = async () => {
    if (!deleteUserId) return;
    setDeleting(true);
    setError('');
    try {
      await api.delete(`/users/${deleteUserId}`);
      setDeleteUserId(null);
      setRefresh(r => !r);
    } catch (err) {
      setError('Failed to delete user');
    } finally {
      setDeleting(false);
    }
  };

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

  // Pagination calculations
  const totalPages = Math.ceil(users.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const currentUsers = users.slice(startIndex, startIndex + usersPerPage);

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      <h3 className="text-3xl font-extrabold mb-8 text-indigo-700 border-b pb-3">
        👥 User Management
      </h3>

      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded shadow-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center text-indigo-600 font-semibold py-16">
          Loading users...
        </div>
      ) : (
        <>
          {/* Users Table */}
          <div className="overflow-x-auto rounded-lg shadow-lg bg-white">
            <table className="min-w-full text-sm text-gray-700 border-collapse">
              <thead className="bg-indigo-100 text-indigo-900 font-semibold select-none">
                <tr>
                  <th className="p-4 border-b border-indigo-200 text-left rounded-tl-lg">
                    Name
                  </th>
                  <th className="p-4 border-b border-indigo-200 text-left">Email</th>
                  <th className="p-4 border-b border-indigo-200 text-left">Role</th>
                  <th className="p-4 border-b border-indigo-200 rounded-tr-lg text-left">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.length === 0 && (
                  <tr>
                    <td colSpan="4" className="p-6 text-center text-gray-500">
                      No users found.
                    </td>
                  </tr>
                )}
                {currentUsers.map(user => (
                  <tr
                    key={user._id}
                    className="hover:bg-indigo-50 transition cursor-default"
                  >
                    <td className="p-4 border-b border-indigo-200">{user.name}</td>
                    <td className="p-4 border-b border-indigo-200">{user.email}</td>
                    <td className="p-4 border-b border-indigo-200 capitalize">{user.role}</td>
                    <td className="p-4 border-b border-indigo-200 flex gap-2">
                      <button
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1 rounded-lg shadow transition"
                        onClick={() => handleRoleChange(user)}
                        aria-label={`Change role for ${user.name}`}
                      >
                        Change Role
                      </button>
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-lg shadow transition"
                        onClick={() => setDeleteUserId(user._id)}
                        aria-label={`Delete user ${user.name}`}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
      {/* Delete Confirmation Modal */}
      {deleteUserId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-5" role="dialog" aria-modal="true">
          <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full relative animate-fadeIn">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-red-600 text-3xl font-bold focus:outline-none"
              onClick={() => setDeleteUserId(null)}
              aria-label="Close delete modal"
            >
              &times;
            </button>
            <h4 className="text-2xl font-extrabold mb-6 text-red-700">Confirm Deletion</h4>
            <p className="mb-6">Are you sure you want to delete this user? This action cannot be undone.</p>
            <div className="flex gap-4">
              <button
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded-full font-semibold shadow transition"
                onClick={() => setDeleteUserId(null)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-full font-semibold shadow transition"
                onClick={handleDeleteUser}
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-end items-center gap-5 mt-6 select-none">
            <button
              onClick={() => setCurrentPage(prev => prev - 1)}
              disabled={currentPage === 1}
              className={`px-5 py-2 rounded-lg font-semibold transition ${
                currentPage === 1
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
              aria-label="Previous page"
            >
              Previous
            </button>
            <span className="text-indigo-900 font-semibold">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => prev + 1)}
              disabled={currentPage === totalPages}
              className={`px-5 py-2 rounded-lg font-semibold transition ${
                currentPage === totalPages
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
              aria-label="Next page"
            >
              Next
            </button>
          </div>
        </>
      )}

      {/* Role Change Modal */}
      {selectedUser && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-5"
          role="dialog"
          aria-modal="true"
          aria-labelledby="changeRoleTitle"
        >
          <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full relative animate-fadeIn">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-red-600 text-3xl font-bold focus:outline-none"
              onClick={() => setSelectedUser(null)}
              aria-label="Close role change modal"
            >
              &times;
            </button>

            <h4
              id="changeRoleTitle"
              className="text-2xl font-extrabold mb-6 text-indigo-700"
            >
              Change Role for{' '}
              <span className="text-indigo-900">{selectedUser.name}</span>
            </h4>

            <form onSubmit={handleRoleSubmit}>
              <select
                className="w-full rounded-xl border border-gray-300 px-5 py-3 mb-6
                  focus:outline-none focus:ring-2 focus:ring-indigo-500 transition shadow-sm"
                value={role}
                onChange={e => setRole(e.target.value)}
                aria-label="Select user role"
              >
                <option value="member">Member</option>
                <option value="sub_coordinator">Sub-Coordinator</option>
                <option value="coordinator">Coordinator</option>
                <option value="admin">Admin</option>
                <option value="super_admin">Super Admin</option>
              </select>
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-full font-semibold shadow-lg transition"
              >
                Update Role
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Club Join Requests Section */}
      <section className="mt-12">
        <h4 className="text-2xl font-extrabold mb-6 text-indigo-700 border-b pb-2">
          Club Join Requests
        </h4>
        <div className="overflow-x-auto rounded-lg shadow-lg bg-white">
          <table className="min-w-full text-sm text-gray-700 border-collapse">
            <thead className="bg-indigo-100 text-indigo-900 font-semibold select-none">
              <tr>
                <th className="p-4 border-b border-indigo-200 text-left rounded-tl-lg">
                  User
                </th>
                <th className="p-4 border-b border-indigo-200 text-left">
                  Student ID
                </th>
                <th className="p-4 border-b border-indigo-200 text-left">Club</th>
                <th className="p-4 border-b border-indigo-200 text-left">Status</th>
                <th className="p-4 border-b border-indigo-200 text-left rounded-tr-lg">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {joinRequests.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="p-6 text-center text-gray-500 font-medium"
                  >
                    No join requests.
                  </td>
                </tr>
              )}
              {joinRequests.map(req => (
                <tr
                  key={req._id}
                  className="hover:bg-indigo-50 transition cursor-default"
                >
                  <td className="p-4 border-b border-indigo-200">
                    {req.userId?.name} ({req.userId?.email})
                  </td>
                  <td className="p-4 border-b border-indigo-200">
                    {req.userId?.studentId}
                  </td>
                  <td className="p-4 border-b border-indigo-200">{req.clubId?.name}</td>
                  <td className="p-4 border-b border-indigo-200 capitalize">
                    {req.status}
                  </td>
                  <td className="p-4 border-b border-indigo-200 space-x-3">
                    {req.status === 'pending' ? (
                      <>
                        <button
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg shadow transition"
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
                          aria-label={`Approve join request from ${req.userId?.name}`}
                        >
                          Approve
                        </button>
                        <button
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg shadow transition"
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
                          aria-label={`Reject join request from ${req.userId?.name}`}
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <span className="text-gray-500 font-medium capitalize">
                        {req.status}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default UserManagement;
