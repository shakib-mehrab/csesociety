import React, { useEffect, useState } from "react";
import api from "../../../services/api";
import { useAuth } from "../../../hooks/useAuth";

const TaskSection = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [viewTask, setViewTask] = useState(null);
  const [marking, setMarking] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    const clubId = user.clubsJoined && user.clubsJoined[0];
    if (!clubId) {
      setError("No club ID found for user");
      setLoading(false);
      return;
    }
    api
      .get(`/club-tasks/club/${clubId}`)
      .then((res) => setTasks(res.data))
      .catch(() => setError("Failed to load tasks"))
      .finally(() => setLoading(false));
  }, [user]);

  const handleView = (task) => setViewTask(task);

  const handleMarkCompleted = async (taskId) => {
    setMarking(true);
    try {
      await api.patch(`/club-tasks/${taskId}/complete`);
      setTasks((tasks) =>
        tasks.map((t) => (t._id === taskId ? { ...t, status: "completed" } : t))
      );
      setViewTask(null);
    } catch {
      setError("Failed to mark as completed");
    } finally {
      setMarking(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2 mb-4">
        Tasks Assigned to Your Club
      </h2>

      {error && (
        <div className="text-red-600 bg-red-100 px-4 py-2 rounded">{error}</div>
      )}

      {loading ? (
        <div className="text-center py-6 text-gray-500 font-medium">
          Loading tasks...
        </div>
      ) : (
        <div className="overflow-x-auto rounded-md border border-gray-200 shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {["Title", "Due Date", "Status", "Actions"].map((header) => (
                  <th
                    key={header}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tasks.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-6 text-gray-500">
                    No tasks assigned.
                  </td>
                </tr>
              ) : (
                tasks.map((task) => (
                  <tr
                    key={task._id}
                    className="hover:bg-gray-50 transition duration-150 ease-in-out"
                  >
                    <td
                      className="px-6 py-4 whitespace-nowrap text-gray-700 font-medium max-w-xs truncate"
                      title={task.title}
                    >
                      {task.title}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      {task.dueDate ? task.dueDate.slice(0, 10) : "-"}
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap font-semibold
                      ${
                        task.status === "completed"
                          ? "text-green-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {task.status.charAt(0).toUpperCase() +
                        task.status.slice(1)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleView(task)}
                        className="text-blue-600 hover:text-blue-800 font-semibold mr-4 transition"
                      >
                        View
                      </button>
                      {task.status !== "completed" && (
                        <button
                          onClick={() => handleMarkCompleted(task._id)}
                          disabled={marking}
                          className="text-green-600 hover:text-green-800 font-semibold disabled:text-green-300 transition"
                        >
                          Mark as Completed
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Task Details Modal */}
      {viewTask && (
        <div
         className="fixed inset-0 z-50 flex items-center justify-center bg-[#b8d3ff]/50 backdrop-blur-md transition-all duration-300 ease-out transform scale-100 opacity-100"
          aria-modal="true"
          role="dialog"
          tabIndex="-1"
          onClick={() => setViewTask(null)}
        >
          <div
            className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setViewTask(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl font-bold focus:outline-none"
              aria-label="Close modal"
            >
              &times;
            </button>
            <h3 className="text-xl font-bold mb-4 text-gray-800">
              {viewTask.title}
            </h3>
            <p className="mb-3 text-gray-700">
              <span className="font-semibold">Description:</span>{" "}
              {viewTask.description || "No description"}
            </p>
            <p className="mb-3 text-gray-700">
              <span className="font-semibold">Due Date:</span>{" "}
              {viewTask.dueDate ? viewTask.dueDate.slice(0, 10) : "-"}
            </p>
            <p className="mb-3 text-gray-700">
              <span className="font-semibold">Status:</span>
              <span
                className={`ml-2 font-semibold
                ${
                  viewTask.status === "completed"
                    ? "text-green-600"
                    : "text-yellow-600"
                }`}
              >
                {viewTask.status.charAt(0).toUpperCase() +
                  viewTask.status.slice(1)}
              </span>
            </p>
            {viewTask.status !== "completed" && (
              <button
                onClick={() => handleMarkCompleted(viewTask._id)}
                disabled={marking}
                className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded transition disabled:opacity-50"
              >
                {marking ? "Marking..." : "Mark as Completed"}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskSection;
