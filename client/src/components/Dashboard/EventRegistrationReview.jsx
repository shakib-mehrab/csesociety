/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import api from "../../services/api";

const EventRegistrationReview = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    setLoading(true);
    api
      .get("/events")
      .then((res) => {
        // Only show society events
        setEvents((res.data || []).filter((e) => e.type === "society"));
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load events");
        setLoading(false);
      });
  }, [refresh]);

  const handleView = async (eventId) => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get(`/events/${eventId}/registrations`);
      setRegistrations(res.data);
      setSelectedEvent(eventId);
    } catch {
      setError("Failed to load registrations");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8 bg-white rounded-xl shadow-md">
      <h3 className="text-2xl font-bold mb-6 text-gray-800">
        📅 Event Registration Review
      </h3>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      {loading && <p className="text-gray-600 mb-4">Loading...</p>}

      <table className="w-full border border-gray-200 rounded-lg overflow-hidden mb-6">
        <thead className="bg-gray-100 text-gray-700 text-left">
          <tr>
            <th className="p-4 border-b">Event</th>
            <th className="p-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.length === 0 ? (
            <tr>
              <td colSpan={2} className="p-4 text-center text-gray-500">
                No society events found.
              </td>
            </tr>
          ) : (
            events.map((event) => (
              <tr key={event._id} className="hover:bg-gray-50 transition">
                <td className="p-4 border-b">{event.title}</td>
                <td className="p-4 border-b">
                  <button
                    onClick={() => handleView(event._id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
                  >
                    Review Registrations
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {selectedEvent && (
        <div>
          <h4 className="text-xl font-semibold mb-2 text-gray-800">
            Registrations for{" "}
            <span className="text-indigo-600">
              {events.find((e) => e._id === selectedEvent)?.title}
            </span>
          </h4>
          <div className="mb-6 flex items-center gap-3">
            <div className="bg-gradient-to-r from-blue-100 to-indigo-100 border border-indigo-200 shadow rounded-xl px-6 py-3 flex items-center gap-3">
              <span className="text-2xl font-bold text-indigo-700">
                {registrations.length}
              </span>
              <span className="text-gray-700 font-medium text-base">
                Total Registrations
              </span>
            </div>
          </div>
          <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-100 text-gray-700 text-left">
              <tr>
                <th className="p-4 border-b">Name</th>
                <th className="p-4 border-b">Email</th>
                <th className="p-4 border-b">Student ID</th>
              </tr>
            </thead>
            <tbody>
              {registrations.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-4 text-center text-gray-500">
                    No registrations found.
                  </td>
                </tr>
              ) : (
                registrations.map((reg) => (
                  <tr key={reg._id} className="hover:bg-gray-50 transition">
                    <td className="p-4 border-b">{reg.name}</td>
                    <td className="p-4 border-b">{reg.email}</td>
                    <td className="p-4 border-b">{reg.studentId}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EventRegistrationReview;
