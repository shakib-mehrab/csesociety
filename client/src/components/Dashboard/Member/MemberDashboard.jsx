/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import api from '../../../services/api';
import { useAuth } from '../../../hooks/useAuth';
import {
  Users, Bell, Calendar, ClipboardList, BookMarked, AlertCircle
} from 'lucide-react';

// Section Card Component
const Section = ({ icon: Icon, title, children, color }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow p-6 flex flex-col">
    <h3 className="text-lg font-semibold flex items-center gap-3 mb-4">
      <span className={`p-2 rounded-lg ${color} bg-opacity-10`}>
        <Icon className={`w-5 h-5 ${color.replace('bg', 'text')}`} />
      </span>
      <span className="text-gray-800">{title}</span>
    </h3>
    <div className="flex-1">{children}</div>
  </div>
);

// Reusable List Item
const ListItem = ({ title, content, extra }) => (
  <li className="py-3 border-b border-gray-100 last:border-none hover:bg-gray-50 px-3 rounded-lg transition-colors">
    <p className="font-medium text-gray-900">{title}</p>
    {content && <p className="text-gray-600 text-sm mt-0.5">{content}</p>}
    {extra && <p className="text-sm text-gray-500 mt-1">{extra}</p>}
  </li>
);

const MemberDashboard = () => {
  const { user } = useAuth();
  const [clubs, setClubs] = useState([]);
  const [clubNotices, setClubNotices] = useState([]);
  const [clubEvents, setClubEvents] = useState([]);
  const [societyNotices, setSocietyNotices] = useState([]);
  const [otherEvents, setOtherEvents] = useState([]);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [allEvents, setAllEvents] = useState([]);

  useEffect(() => {
    if (!user) return;
    api.get('/clubs').then(res => {
      setClubs(res.data.filter(c => user.clubsJoined.includes(c._id)));
    });
    if (user.clubsJoined.length > 0) {
      Promise.all([
        api.get('/notices?type=club'),
        api.get('/events')
      ]).then(([noticesRes, eventsRes]) => {
        setClubNotices((noticesRes.data || []).filter(n => user.clubsJoined.includes(n.clubId?._id || n.clubId)));
        setClubEvents((eventsRes.data || []).filter(e => e.type === 'club' && user.clubsJoined.includes(e.clubId?._id || e.clubId)));
        setAllEvents(eventsRes.data || []);
      });
    } else {
      api.get('/events').then(res => setAllEvents(res.data || []));
    }
    api.get('/notices?type=society').then(res => setSocietyNotices(res.data || []));
  }, [user]);

  useEffect(() => {
    if (!user) return;
    setRegisteredEvents(
      allEvents.filter(e => (e.registeredUsers || []).some(u => (u._id || u) === user._id))
    );
    setOtherEvents(
      allEvents.filter(e =>
        (e.type === 'society') ||
        (e.type === 'club' && !user.clubsJoined.includes(e.clubId?._id || e.clubId))
      )
    );
  }, [allEvents, user]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-10">
        <ClipboardList className="w-8 h-8 text-blue-600" />
        <h2 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.name || 'Member'}
        </h2>
      </div>

      {/* Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <Section title="My Clubs" icon={Users} color="bg-blue-500">
          {clubs.length === 0 ? (
            <div className="text-gray-500 text-sm">No clubs joined.</div>
          ) : (
            <ul>
              {clubs.map(c => (
                <ListItem key={c._id} title={c.name} />
              ))}
            </ul>
          )}
        </Section>

        <Section title="Club Notices" icon={Bell} color="bg-green-500">
          {clubNotices.length === 0 ? (
            <div className="text-gray-500 text-sm">No club notices.</div>
          ) : (
            <ul>
              {clubNotices.map(n => (
                <ListItem
                  key={n._id}
                  title={n.title}
                  content={`${n.content?.slice(0, 60)}${n.content?.length > 60 ? '...' : ''}`}
                />
              ))}
            </ul>
          )}
        </Section>

        <Section title="Club Events" icon={Calendar} color="bg-purple-500">
          {clubEvents.length === 0 ? (
            <div className="text-gray-500 text-sm">No club events.</div>
          ) : (
            <ul>
              {clubEvents.map(e => (
                <ListItem
                  key={e._id}
                  title={e.title}
                  extra={`${e.date?.slice(0, 10) || '-'} | ${e.venue}`}
                />
              ))}
            </ul>
          )}
        </Section>

        <Section title="Society Notices" icon={AlertCircle} color="bg-red-500">
          {societyNotices.length === 0 ? (
            <div className="text-gray-500 text-sm">No society notices.</div>
          ) : (
            <ul>
              {societyNotices.map(n => (
                <ListItem
                  key={n._id}
                  title={n.title}
                  content={`${n.content?.slice(0, 60)}${n.content?.length > 60 ? '...' : ''}`}
                />
              ))}
            </ul>
          )}
        </Section>

        <Section title="Other Events" icon={Calendar} color="bg-yellow-500">
          {otherEvents.length === 0 ? (
            <div className="text-gray-500 text-sm">No other events.</div>
          ) : (
            <ul>
              {otherEvents.map(e => (
                <ListItem
                  key={e._id}
                  title={e.title}
                  extra={`${e.date?.slice(0, 10) || '-'} | ${e.venue} (${e.type === 'society' ? 'Society' : 'Club'})`}
                />
              ))}
            </ul>
          )}
        </Section>

        <Section title="My Registered Events" icon={BookMarked} color="bg-indigo-500">
          {registeredEvents.length === 0 ? (
            <div className="text-gray-500 text-sm">No registered events.</div>
          ) : (
            <ul>
              {registeredEvents.map(e => (
                <ListItem
                  key={e._id}
                  title={e.title}
                  extra={`${e.date?.slice(0, 10) || '-'} | ${e.venue}`}
                />
              ))}
            </ul>
          )}
        </Section>
      </div>
    </div>
  );
};

export default MemberDashboard;
