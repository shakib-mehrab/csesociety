/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
const API_BASE = '/api/users';

const colors = {
  darkest: '#00183a',
  dark: '#002a54',
  medium: '#034986',
  light: '#409fc8',
};

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [role, setRole] = useState('');
  const [refresh, setRefresh] = useState(false);
  const [clubs, setClubs] = useState([]);
  const [clubId, setClubId] = useState('');
  const [position, setPosition] = useState('');
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
      api.get('/clubs'),
    ])
      .then(([usersRes, joinReqRes, clubsRes]) => {
        setUsers(usersRes.data);
        setJoinRequests(joinReqRes.data);
        setClubs(clubsRes.data);
        setCurrentPage(1);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load users, clubs, or join requests');
        setLoading(false);
      });
  }, [refresh]);

  const handleRoleChange = (user) => {
    setSelectedUser(user);
    setRole(user.role);
    setClubId('');
    setPosition('');
  };

  const handleRoleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    // Validate
    if (!role) {
      setError('Please select a role.');
      setLoading(false);
      return;
    }
    if ((role === 'coordinator' || role === 'sub_coordinator') && !clubId) {
      setError('Please select a club for this position.');
      setLoading(false);
      return;
    }
    if ((role === 'coordinator' || role === 'sub_coordinator') && !position) {
      setError('Please select a position.');
      setLoading(false);
      return;
    }
    try {
      // 1. Update user role
      const res = await fetch(`${API_BASE}/${selectedUser._id}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify({ role }),
      });
      if (!res.ok) throw new Error('Failed to update role');

      // 2. If coordinator/sub_coordinator, update club
      if (role === 'coordinator' || role === 'sub_coordinator') {
        // Fetch club
        const club = clubs.find(c => c._id === clubId);
        if (!club) throw new Error('Club not found');
        let clubUpdate = {};
        if (position === 'coordinator') {
          clubUpdate.coordinator = selectedUser._id;
          // Remove from subCoordinators if present
          clubUpdate.subCoordinators = (club.subCoordinators || []).filter(u => u._id !== selectedUser._id);
        } else if (position === 'sub_coordinator') {
          clubUpdate.subCoordinators = [
            ...((club.subCoordinators || []).map(u => u._id)),
            selectedUser._id
          ];
          // If user was coordinator, demote
          if (club.coordinator === selectedUser._id) {
            clubUpdate.coordinator = null;
          }
        }
        // PATCH/PUT club
        await api.put(`/clubs/${clubId}`, clubUpdate);
      }
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
      <h3
        className="text-3xl font-extrabold mb-8 border-b pb-3"
        style={{ color: colors.darkest }}
      >
         User Management
      </h3>

      {error && (
        <div
          className="mb-6 p-4 rounded shadow-sm"
          style={{ backgroundColor: '#fddede', color: '#9b2226' }}
        >
          {error}
        </div>
      )}

      {loading ? (
        <div
          className="text-center font-semibold py-16"
          style={{ color: colors.medium }}
        >
          Loading users...
        </div>
      ) : (
        <>
          {/* Users Table */}
          <div
            className="overflow-x-auto rounded-lg shadow-lg bg-white"
            style={{ border: `1px solid ${colors.medium}` }}
          >
            <table className="min-w-full text-sm border-collapse" style={{ color: colors.darkest }}>
              <thead
                className="font-semibold select-none"
                style={{ backgroundColor: colors.light, color: '#fff' }}
              >
                <tr>
                  <th className="p-4 border-b" style={{ borderColor: colors.medium, textAlign: 'left', borderTopLeftRadius: 12 }}>
                    Name
                  </th>
                  <th className="p-4 border-b" style={{ borderColor: colors.medium, textAlign: 'left' }}>
                    Email
                  </th>
                  <th className="p-4 border-b" style={{ borderColor: colors.medium, textAlign: 'left' }}>
                    Role
                  </th>
                  <th className="p-4 border-b" style={{ borderColor: colors.medium, textAlign: 'left' }}>
                    Clubs Joined
                  </th>
                  <th className="p-4 border-b" style={{ borderColor: colors.medium, borderTopRightRadius: 12, textAlign: 'left' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="p-6 text-center"
                      style={{ color: colors.medium }}
                    >
                      No users found.
                    </td>
                  </tr>
                ) : (
                  currentUsers.map(user => (
                    <tr
                      key={user._id}
                      className="hover:bg-indigo-50 transition cursor-default"
                      style={{ borderBottom: `1px solid ${colors.light}` }}
                    >
                      <td className="p-4" style={{ borderColor: colors.medium }}>
                        {user.name}
                      </td>
                      <td className="p-4" style={{ borderColor: colors.medium }}>
                        {user.email}
                      </td>
                      <td
                        className="p-4 capitalize"
                        style={{ borderColor: colors.medium, color: colors.dark }}
                      >
                        {user.role}
                      </td>
                      <td className="p-4" style={{ borderColor: colors.medium }}>
                        {user.clubsJoined && user.clubsJoined.length > 0 ? (
                          <ul className="list-disc pl-4" style={{ color: colors.darkest }}>
                            {user.clubsJoined.map(club => (
                              <li key={club._id || club}>{club.name || club}</li>
                            ))}
                          </ul>
                        ) : (
                          <span style={{ color: '#999' }}>None</span>
                        )}
                      </td>
                      <td className="p-4 flex gap-2" style={{ borderColor: colors.medium }}>
                        <button
                          className="px-4 py-1 rounded-lg shadow transition font-semibold"
                          onClick={() => handleRoleChange(user)}
                          aria-label={`Change role for ${user.name}`}
                          style={{
                            backgroundColor: colors.light,
                            color: '#fff',
                          }}
                          onMouseOver={e => e.currentTarget.style.backgroundColor = colors.medium}
                          onMouseOut={e => e.currentTarget.style.backgroundColor = colors.light}
                        >
                          Change Role
                        </button>
                        <button
                          className="px-4 py-1 rounded-lg shadow transition font-semibold"
                          onClick={() => setDeleteUserId(user._id)}
                          aria-label={`Delete user ${user.name}`}
                          style={{
                            backgroundColor: '#9b2226',
                            color: '#fff',
                          }}
                          onMouseOver={e => e.currentTarget.style.backgroundColor = '#7a1a1d'}
                          onMouseOut={e => e.currentTarget.style.backgroundColor = '#9b2226'}
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

          {/* Pagination Controls */}
          <div className="flex justify-end items-center gap-5 mt-6 select-none">
            <button
              onClick={() => setCurrentPage(prev => prev - 1)}
              disabled={currentPage === 1}
              className={`px-5 py-2 rounded-lg font-semibold transition ${
                currentPage === 1
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'hover:bg-blue-700'
              }`}
              style={{
                backgroundColor: currentPage === 1 ? '#ddd' : colors.medium,
                color: currentPage === 1 ? '#999' : '#fff',
              }}
              aria-label="Previous page"
            >
              Previous
            </button>
            <span style={{ color: colors.darkest, fontWeight: '600' }}>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => prev + 1)}
              disabled={currentPage === totalPages}
              className={`px-5 py-2 rounded-lg font-semibold transition ${
                currentPage === totalPages
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'hover:bg-blue-700'
              }`}
              style={{
                backgroundColor: currentPage === totalPages ? '#ddd' : colors.medium,
                color: currentPage === totalPages ? '#999' : '#fff',
              }}
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
          <div
            className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full relative animate-fadeIn"
            style={{ borderColor: colors.medium, borderWidth: 1 }}
          >
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-red-600 text-3xl font-bold focus:outline-none"
              onClick={() => setSelectedUser(null)}
              aria-label="Close role change modal"
            >
              &times;
            </button>

            <h4
              id="changeRoleTitle"
              className="text-2xl font-extrabold mb-6"
              style={{ color: colors.darkest }}
            >
              Change Role for{' '}
              <span style={{ color: colors.medium }}>{selectedUser.name}</span>
            </h4>

            <form onSubmit={handleRoleSubmit}>
              <label className="block mb-2 font-semibold">Role</label>
              <select
                className="w-full rounded-xl border px-5 py-3 mb-4 focus:outline-none focus:ring-2 transition shadow-sm"
                style={{ borderColor: colors.medium, color: colors.darkest }}
                value={role}
                onChange={e => setRole(e.target.value)}
                aria-label="Select user role"
              >
                <option value="">Select role</option>
                <option value="member">Member</option>
                <option value="sub_coordinator">Sub-Coordinator</option>
                <option value="coordinator">Coordinator</option>
                <option value="admin">Admin</option>
                <option value="super_admin">Super Admin</option>
              </select>

              {(role === 'coordinator' || role === 'sub_coordinator') && (
                <>
                  <label className="block mb-2 font-semibold">Club</label>
                  <select
                    className="w-full rounded-xl border px-5 py-3 mb-4 focus:outline-none focus:ring-2 transition shadow-sm"
                    style={{ borderColor: colors.medium, color: colors.darkest }}
                    value={clubId}
                    onChange={e => setClubId(e.target.value)}
                    aria-label="Select club"
                  >
                    <option value="">Select club</option>
                    {clubs.map(club => (
                      <option key={club._id} value={club._id}>{club.name}</option>
                    ))}
                  </select>
                  <label className="block mb-2 font-semibold">Position</label>
                  <select
                    className="w-full rounded-xl border px-5 py-3 mb-6 focus:outline-none focus:ring-2 transition shadow-sm"
                    style={{ borderColor: colors.medium, color: colors.darkest }}
                    value={position}
                    onChange={e => setPosition(e.target.value)}
                    aria-label="Select position"
                  >
                    <option value="">Select position</option>
                    <option value="coordinator">Coordinator</option>
                    <option value="sub_coordinator">Sub-Coordinator</option>
                  </select>
                </>
              )}

              {error && <div className="text-red-600 mb-2">{error}</div>}
              <button
                type="submit"
                className="w-full py-3 rounded-full font-semibold shadow-lg transition"
                style={{
                  backgroundColor: colors.medium,
                  color: '#fff',
                }}
                onMouseOver={e => e.currentTarget.style.backgroundColor = colors.dark}
                onMouseOut={e => e.currentTarget.style.backgroundColor = colors.medium}
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Role & Position'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Club Join Requests Section */}
      <section className="mt-12">
        <h4
          className="text-2xl font-extrabold mb-6 border-b pb-2"
          style={{ color: colors.darkest }}
        >
          Club Join Requests
        </h4>
        <div
          className="overflow-x-auto rounded-lg shadow-lg bg-white"
          style={{ border: `1px solid ${colors.medium}` }}
        >
          <table className="min-w-full text-sm border-collapse" style={{ color: colors.darkest }}>
            <thead
              className="font-semibold select-none"
              style={{ backgroundColor: colors.light, color: '#fff' }}
            >
              <tr>
                <th
                  className="p-4 border-b text-left"
                  style={{ borderColor: colors.medium, borderTopLeftRadius: 12 }}
                >
                  User
                </th>
                <th
                  className="p-4 border-b text-left"
                  style={{ borderColor: colors.medium }}
                >
                  Student ID
                </th>
                <th
                  className="p-4 border-b text-left"
                  style={{ borderColor: colors.medium }}
                >
                  Club
                </th>
                <th
                  className="p-4 border-b text-left"
                  style={{ borderColor: colors.medium }}
                >
                  Status
                </th>
                <th
                  className="p-4 border-b text-left"
                  style={{ borderColor: colors.medium, borderTopRightRadius: 12 }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {joinRequests.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="p-6 text-center font-medium"
                    style={{ color: colors.medium }}
                  >
                    No join requests.
                  </td>
                </tr>
              ) : (
                joinRequests.map(req => (
                  <tr
                    key={req._id}
                    className="hover:bg-indigo-50 transition cursor-default"
                    style={{ borderBottom: `1px solid ${colors.light}` }}
                  >
                    <td className="p-4" style={{ borderColor: colors.medium }}>
                      {req.userId?.name} ({req.userId?.email})
                    </td>
                    <td className="p-4" style={{ borderColor: colors.medium }}>
                      {req.userId?.studentId}
                    </td>
                    <td className="p-4" style={{ borderColor: colors.medium }}>
                      {req.clubId?.name}
                    </td>
                    <td
                      className="p-4 capitalize"
                      style={{ borderColor: colors.medium, color: colors.dark }}
                    >
                      {req.status}
                    </td>
                    <td className="p-4 space-x-3" style={{ borderColor: colors.medium }}>
                      {req.status === 'pending' ? (
                        <>
                          <button
                            className="px-3 py-1 rounded-lg shadow transition font-semibold"
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
                            style={{
                              backgroundColor: colors.medium,
                              color: '#fff',
                            }}
                            onMouseOver={e => e.currentTarget.style.backgroundColor = colors.dark}
                            onMouseOut={e => e.currentTarget.style.backgroundColor = colors.medium}
                          >
                            Approve
                          </button>
                          <button
                            className="px-3 py-1 rounded-lg shadow transition font-semibold"
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
                            style={{
                              backgroundColor: '#9b2226',
                              color: '#fff',
                            }}
                            onMouseOver={e => e.currentTarget.style.backgroundColor = '#7a1a1d'}
                            onMouseOut={e => e.currentTarget.style.backgroundColor = '#9b2226'}
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <span style={{ color: '#666', fontWeight: '600', textTransform: 'capitalize' }}>
                          {req.status}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default UserManagement;
