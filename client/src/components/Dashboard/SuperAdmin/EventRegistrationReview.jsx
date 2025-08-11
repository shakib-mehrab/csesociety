/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import api from "../../../services/api";

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
    <div
      className="max-w-6xl mx-auto p-8 bg-white rounded-xl shadow-md"
      style={{ border: "1px solid #409fc8" }}
    >
      <h3
        className="text-2xl font-bold mb-6"
        style={{ color: "#00183a" }}
      >
        Event Registration Review
      </h3>

      {error && (
        <div
          className="mb-4 p-3 rounded"
          style={{ backgroundColor: "#fde2e2", color: "#9b1c1c" }}
        >
          {error}
        </div>
      )}

      {loading && (
        <p className="mb-4" style={{ color: "#002a54" }}>
          Loading...
        </p>
      )}

      <table
        className="w-full rounded-lg overflow-hidden mb-6"
        style={{ borderCollapse: "collapse", border: "1px solid #409fc8" }}
      >
        <thead
          style={{ backgroundColor: "#409fc8", color: "white", textAlign: "left" }}
        >
          <tr>
            <th className="p-4" style={{ borderBottom: "1px solid #034986" }}>
              Event
            </th>
            <th className="p-4" style={{ borderBottom: "1px solid #034986" }}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {events.length === 0 ? (
            <tr>
              <td
                colSpan={2}
                className="p-4 text-center"
                style={{ color: "#002a54" }}
              >
                No society events found.
              </td>
            </tr>
          ) : (
            events.map((event, idx) => (
              <tr
                key={event._id}
                style={{
                  backgroundColor: idx % 2 === 0 ? "white" : "#e5f1fb",
                  transition: "background-color 0.3s",
                }}
                className="hover:bg-[#c3defd]"
              >
                <td className="p-4" style={{ borderBottom: "1px solid #409fc8", color: "#00183a" }}>
                  {event.title}
                </td>
                <td className="p-4" style={{ borderBottom: "1px solid #409fc8" }}>
                  <button
                    onClick={() => handleView(event._id)}
                    className="px-4 py-2 rounded transition"
                    style={{ backgroundColor: "#034986", color: "white" }}
                    onMouseOver={e => (e.currentTarget.style.backgroundColor = "#002a54")}
                    onMouseOut={e => (e.currentTarget.style.backgroundColor = "#034986")}
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
          <h4
            className="text-xl font-semibold mb-2"
            style={{ color: "#00183a" }}
          >
            Registrations for{" "}
            <span style={{ color: "#034986" }}>
              {events.find((e) => e._id === selectedEvent)?.title}
            </span>
          </h4>
          <div className="mb-6 flex items-center gap-3">
            <div
              className="rounded-xl px-6 py-3 flex items-center gap-3"
              style={{
                background: "linear-gradient(to right, #dbe9fb, #cde6fc)",
                border: "1px solid #409fc8",
                boxShadow: "0 1px 5px rgba(64, 159, 200, 0.4)",
              }}
            >
              <span
                className="text-2xl font-bold"
                style={{ color: "#034986" }}
              >
                {registrations.length}
              </span>
              <span
                className="font-medium text-base"
                style={{ color: "#002a54" }}
              >
                Total Registrations
              </span>
            </div>
          </div>
          <table
            className="w-full rounded-lg overflow-hidden"
            style={{ borderCollapse: "collapse", border: "1px solid #409fc8" }}
          >
            <thead
              style={{ backgroundColor: "#409fc8", color: "white", textAlign: "left" }}
            >
              <tr>
                <th className="p-4" style={{ borderBottom: "1px solid #034986" }}>
                  Name
                </th>
                <th className="p-4" style={{ borderBottom: "1px solid #034986" }}>
                  Email
                </th>
                <th className="p-4" style={{ borderBottom: "1px solid #034986" }}>
                  Student ID
                </th>
                <th className="p-4" style={{ borderBottom: "1px solid #034986" }}>
                  Payment Amount
                </th>
                <th className="p-4" style={{ borderBottom: "1px solid #034986" }}>
                  Transaction ID
                </th>
                <th className="p-4" style={{ borderBottom: "1px solid #034986" }}>
                  Payment Status
                </th>
                <th className="p-4" style={{ borderBottom: "1px solid #034986" }}>
                  Payment Date
                </th>
              </tr>
            </thead>
            <tbody>
              {registrations.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="p-4 text-center"
                    style={{ color: "#002a54" }}
                  >
                    No registrations found.
                  </td>
                </tr>
              ) : (
                registrations.map((reg, idx) => (
                  <tr
                    key={reg._id}
                    style={{
                      backgroundColor: idx % 2 === 0 ? "white" : "#e5f1fb",
                      transition: "background-color 0.3s",
                    }}
                    className="hover:bg-[#c3defd]"
                  >
                    <td
                      className="p-4"
                      style={{ borderBottom: "1px solid #409fc8", color: "#00183a" }}
                    >
                      {reg.name}
                    </td>
                    <td
                      className="p-4"
                      style={{ borderBottom: "1px solid #409fc8", color: "#00183a" }}
                    >
                      {reg.email}
                    </td>
                    <td
                      className="p-4"
                      style={{ borderBottom: "1px solid #409fc8", color: "#002a54" }}
                    >
                      {reg.studentId}
                    </td>
                    <td
                      className="p-4"
                      style={{ borderBottom: "1px solid #409fc8", color: "#002a54" }}
                    >
                      {reg.payment ? reg.payment.amount : <span style={{ color: '#b0b0b0' }}>-</span>}
                    </td>
                    <td
                      className="p-4"
                      style={{ borderBottom: "1px solid #409fc8", color: "#002a54" }}
                    >
                      {reg.payment ? reg.payment.transactionId : <span style={{ color: '#b0b0b0' }}>-</span>}
                    </td>
                    <td
                      className="p-4"
                      style={{ borderBottom: "1px solid #409fc8", color: "#002a54" }}
                    >
                      {reg.payment ? reg.payment.status : <span style={{ color: '#b0b0b0' }}>-</span>}
                    </td>
                    <td
                      className="p-4"
                      style={{ borderBottom: "1px solid #409fc8", color: "#002a54" }}
                    >
                      {reg.payment && reg.payment.paymentDate ? new Date(reg.payment.paymentDate).toLocaleString() : <span style={{ color: '#b0b0b0' }}>-</span>}
                    </td>
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
