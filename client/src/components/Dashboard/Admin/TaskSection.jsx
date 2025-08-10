import React, { useEffect, useState } from 'react';
import api from '../../../services/api';
import { useAuth } from '../../../hooks/useAuth';

const TaskSection = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [viewTask, setViewTask] = useState(null);
  const [marking, setMarking] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    // Try user.club, fallback to user.clubsJoined[0]._id if available
    console.log(user);
    const clubId = (user.clubsJoined && user.clubsJoined[0]);
    console.log(clubId);
    if (!clubId) {
      setError('No club ID found for user');
      setLoading(false);
      return;
    }
    api.get(`/club-tasks/club/${clubId}`)
      .then(res => setTasks(res.data))
      .catch(() => setError('Failed to load tasks'))
      .finally(() => setLoading(false));
  }, [user]);

  const handleView = (task) => setViewTask(task);

  const handleMarkCompleted = async (taskId) => {
    setMarking(true);
    try {
      await api.patch(`/club-tasks/${taskId}/complete`);
      setTasks(tasks => tasks.map(t => t._id === taskId ? { ...t, status: 'completed' } : t));
      setViewTask(null);
    } catch {
      setError('Failed to mark as completed');
    } finally {
      setMarking(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Tasks Assigned to Your Club</h2>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {loading ? <div>Loading...</div> : (
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-left">
              <th className="p-3 border-b">Title</th>
              <th className="p-3 border-b">Due Date</th>
              <th className="p-3 border-b">Status</th>
              <th className="p-3 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.length === 0 && (
              <tr><td colSpan={4} className="text-center py-4 text-gray-500">No tasks assigned.</td></tr>
            )}
            {tasks.map(task => (
              <tr key={task._id} className="hover:bg-gray-50">
                <td className="p-3 border-b">{task.title}</td>
                <td className="p-3 border-b">{task.dueDate ? task.dueDate.slice(0, 10) : '-'}</td>
                <td className="p-3 border-b">{task.status}</td>
                <td className="p-3 border-b">
                  <button className="text-blue-600 hover:underline mr-2" onClick={() => handleView(task)}>View</button>
                  {task.status !== 'completed' && (
                    <button className="text-green-600 hover:underline" onClick={() => handleMarkCompleted(task._id)} disabled={marking}>Mark as Completed</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {/* Task Details Modal */}
      {viewTask && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button className="absolute top-2 right-2 text-gray-500 hover:text-black" onClick={() => setViewTask(null)}>&times;</button>
            <h3 className="text-lg font-bold mb-2">{viewTask.title}</h3>
            <p className="mb-2"><span className="font-semibold">Description:</span> {viewTask.description}</p>
            <p className="mb-2"><span className="font-semibold">Due Date:</span> {viewTask.dueDate ? viewTask.dueDate.slice(0, 10) : '-'}</p>
            <p className="mb-2"><span className="font-semibold">Status:</span> {viewTask.status}</p>
            {viewTask.status !== 'completed' && (
              <button className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded" onClick={() => handleMarkCompleted(viewTask._id)} disabled={marking}>
                {marking ? 'Marking...' : 'Mark as Completed'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskSection;
