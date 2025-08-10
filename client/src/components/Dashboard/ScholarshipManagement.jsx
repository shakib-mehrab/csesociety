/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { PlusCircle, X, Loader2 } from 'lucide-react';

const ScholarshipManagement = () => {
  const [scholarships, setScholarships] = useState([]);
  const [applications, setApplications] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', eligibility: '', rules: '' });
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchScholarships();
    fetchApplications();
  }, []);

  const fetchScholarships = async () => {
    setLoading(true);
    try {
      const res = await api.get('/scholarships');
      setScholarships(res.data);
    } catch {
      setError('Failed to fetch scholarships');
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await api.get('/scholarships/applications/all');
      setApplications(res.data);
    } catch {
      setError('Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  const handleInput = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/scholarships', form);
      setForm({ name: '', eligibility: '', rules: '' });
      setShowForm(false);
      fetchScholarships();
    } catch {
      setError('Failed to add scholarship');
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (id, status) => {
    setLoading(true);
    try {
      await api.put(`/scholarships/applications/${id}/review`, { status });
      fetchApplications();
    } catch {
      setError('Failed to update application');
    } finally {
      setLoading(false);
    }
  };

  const statusBadge = status => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return (
      <span className={`px-3 py-1 text-xs font-medium rounded-full ${colors[status] || ''}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800 tracking-tight">
          🎓 Scholarship Management
        </h2>
        <button
          onClick={() => setShowForm(f => !f)}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white px-5 py-2 rounded-lg shadow-md transition-all"
        >
          <PlusCircle size={18} />
          {showForm ? 'Cancel' : 'Add Scholarship'}
        </button>
      </div>

      {/* Add Scholarship Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 space-y-4 animate-fadeIn"
        >
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Scholarship Name
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleInput}
                placeholder="Enter scholarship title"
                className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-indigo-400"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Eligibility Details
              </label>
              <textarea
                name="eligibility"
                value={form.eligibility}
                onChange={handleInput}
                placeholder="Describe eligibility criteria"
                className="border border-gray-300 p-3 rounded-lg w-full h-[100px] focus:ring-2 focus:ring-indigo-400"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Rules & Regulations
            </label>
            <textarea
              name="rules"
              value={form.rules}
              onChange={handleInput}
              placeholder="List the rules and regulations"
              className="border border-gray-300 p-3 rounded-lg w-full h-[120px] focus:ring-2 focus:ring-indigo-400"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg shadow-md"
          >
            Add Scholarship
          </button>
        </form>
      )}

      {/* Scholarships List */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <h3 className="text-lg font-semibold px-6 py-4 border-b bg-gray-50 text-gray-700">
          Available Scholarships
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-center">Eligibility</th>
                <th className="py-3 px-4 text-center">Rules</th>
                <th className="py-3 px-4 text-center">Created</th>
              </tr>
            </thead>
            <tbody>
              {scholarships.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-6 text-gray-500">
                    No scholarships available
                  </td>
                </tr>
              )}
              {scholarships.map(s => (
                <tr key={s._id} className="border-t hover:bg-gray-50 transition">
                  <td className="py-3 px-4 font-medium">{s.name}</td>
                  <td className="py-3 px-4 text-center">
                    <button
                      className="text-indigo-600 hover:underline"
                      onClick={() => setSelected(s._id + '-elig')}
                    >
                      View
                    </button>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      className="text-indigo-600 hover:underline"
                      onClick={() => setSelected(s._id + '-rules')}
                    >
                      View
                    </button>
                  </td>
                  <td className="py-3 px-4 text-center text-gray-500">
                    {s.createdAt?.slice(0, 10)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Scholarship Applications */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <h3 className="text-lg font-semibold px-6 py-4 border-b bg-gray-50 text-gray-700">
          Scholarship Applications
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4">Applicant</th>
                <th className="py-3 px-4">Scholarship</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Applied</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-gray-500">
                    No applications
                  </td>
                </tr>
              )}
              {applications.map(a => (
                <tr key={a._id} className="border-t hover:bg-gray-50 transition">
                  <td className="py-3 px-4 font-medium">{a.user?.name}</td>
                  <td className="py-3 px-4">{a.scholarship?.name}</td>
                  <td className="py-3 px-4">{statusBadge(a.status)}</td>
                  <td className="py-3 px-4 text-gray-500">{a.createdAt?.slice(0, 10)}</td>
                  <td className="py-3 px-4">
                    {a.status === 'pending' && (
                      <div className="flex flex-col gap-1 md:flex-row md:gap-2">
                        <button className="bg-blue-500 text-white px-2 py-1 rounded mb-1 md:mb-0" onClick={() => setSelected('view-' + a._id)}>View Application</button>
                        <button
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg"
                          onClick={() => handleReview(a._id, 'approved')}
                        >
                          Approve
                        </button>
                        <button
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg"
                          onClick={() => handleReview(a._id, 'rejected')}
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Application View Modal */}
      {selected && selected.startsWith('view-') && (() => {
        const appId = selected.replace('view-', '');
        const app = applications.find(a => a._id === appId);
        if (!app) return null;
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-20 backdrop-blur-md">
            <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 relative max-h-[90vh] overflow-y-auto">
              <button className="absolute top-2 right-2 text-gray-500 hover:text-black text-2xl font-bold" onClick={() => setSelected(null)}>&times;</button>
              <h4 className="text-xl font-bold mb-2 text-indigo-700">Scholarship Application Details</h4>
              <div className="mb-4 flex gap-4 items-center">
                {app.photo && (
                  <img src={app.photo} alt="Applicant" className="w-24 h-24 object-cover rounded border" />
                )}
                <div>
                  <div className="font-semibold">{app.user?.name}</div>
                  <div className="text-sm text-gray-500">{app.user?.email}</div>
                  <div className="text-sm text-gray-500">{app.user?.studentId}</div>
                </div>
              </div>
              <div className="mb-2"><span className="font-semibold">Scholarship:</span> {app.scholarship?.name}</div>
              <div className="mb-2"><span className="font-semibold">Status:</span> {statusBadge(app.status)}</div>
              <div className="mb-2"><span className="font-semibold">Applied On:</span> {app.createdAt?.slice(0,10)}</div>
              <hr className="my-3" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div><span className="font-semibold">Mother's Name:</span> {app.motherName}</div>
                <div><span className="font-semibold">Father's Name:</span> {app.fatherName}</div>
                <div><span className="font-semibold">Institution:</span> {app.institution}</div>
                <div><span className="font-semibold">Batch:</span> {app.batch}</div>
                <div><span className="font-semibold">Semester:</span> {app.semester}</div>
                <div><span className="font-semibold">Session:</span> {app.session}</div>
                <div><span className="font-semibold">Roll/ID:</span> {app.roll}</div>
                <div><span className="font-semibold">SSC Grade:</span> {app.sscGrade}</div>
                <div><span className="font-semibold">HSC Grade:</span> {app.hscGrade}</div>
                <div><span className="font-semibold">Semester Grades:</span> {app.semesterGrades}</div>
                <div className="md:col-span-2"><span className="font-semibold">Permanent Address:</span> {app.permanentAddress?.village}, {app.permanentAddress?.postOffice}, {app.permanentAddress?.upozilla}, {app.permanentAddress?.district}</div>
                <div className="md:col-span-2"><span className="font-semibold">Present Address:</span> {app.presentAddress}</div>
                <div className="md:col-span-2"><span className="font-semibold">Family Able to Take Expense:</span> {app.familyExpense ? 'Yes' : 'No'}</div>
                <div className="md:col-span-2"><span className="font-semibold">Family Economic Condition:</span> {app.familyCondition}</div>
                <div className="md:col-span-2"><span className="font-semibold">Reference:</span> {app.reference}</div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Modal */}
      {selected && (() => {
        const s = scholarships.find(x => selected.startsWith(x._id));
        if (!s) return null;
        const isElig = selected.endsWith('-elig');
        const isRules = selected.endsWith('-rules');
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-lg max-w-lg w-full p-6 relative max-h-[80vh] overflow-y-auto animate-fadeIn">
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                onClick={() => setSelected(null)}
              >
                <X size={20} />
              </button>
              <h4 className="font-bold mb-3 text-lg text-gray-800">
                {isElig ? 'Eligibility' : 'Rules & Regulations'}
              </h4>
              <div className="whitespace-pre-line text-gray-700 text-sm leading-relaxed">
                {isElig ? s.eligibility : s.rules}
              </div>
            </div>
          </div>
        );
      })()}

      {/* Error & Loader */}
      {error && <div className="text-red-500 mt-4">{error}</div>}
      {loading && (
        <div className="flex items-center gap-2 text-gray-500 mt-4">
          <Loader2 className="animate-spin" size={18} /> Loading...
        </div>
      )}
    </div>
  );
};

export default ScholarshipManagement;
