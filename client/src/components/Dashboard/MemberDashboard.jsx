import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import {
  Users, Bell, Calendar, ClipboardList, BookMarked, AlertCircle
} from 'lucide-react';

// Section Card Component
const Section = ({ icon: Icon, title, children }) => (
  <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
    <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-800 mb-4">
      <Icon className="w-5 h-5 text-blue-600" />
      {title}
    </h3>
    {children}
  </div>
);

// Reusable List Item
const ListItem = ({ title, content, extra }) => (
  <li className="border-b border-gray-200 py-2">
    <p className="font-medium text-gray-800">{title}</p>
    {content && <p className="text-gray-600 text-sm">{content}</p>}
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
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-2">
        <ClipboardList className="w-6 h-6 text-blue-600" />
        {user?.name || 'Member'}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* My Clubs */}
        <Section title="My Clubs" icon={Users}>
          {clubs.length === 0 ? (
            <div className="text-gray-600">No clubs joined.</div>
          ) : (
            <ul>
              {clubs.map(c => (
                <ListItem key={c._id} title={c.name} />
              ))}
            </ul>
          )}
        </Section>

        {/* Club Notices */}
        <Section title="Club Notices" icon={Bell}>
          {clubNotices.length === 0 ? (
            <div className="text-gray-600">No club notices.</div>
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

        {/* Club Events */}
        <Section title="Club Events" icon={Calendar}>
          {clubEvents.length === 0 ? (
            <div className="text-gray-600">No club events.</div>
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

        {/* Society Notices */}
        <Section title="Society Notices" icon={AlertCircle}>
          {societyNotices.length === 0 ? (
            <div className="text-gray-600">No society notices.</div>
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

        {/* Other Events */}
        <Section title="Other Events (Society & Other Clubs)" icon={Calendar}>
          {otherEvents.length === 0 ? (
            <div className="text-gray-600">No other events.</div>
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

        {/* Registered Events */}
        <Section title="My Registered Events" icon={BookMarked}>
          {registeredEvents.length === 0 ? (
            <div className="text-gray-600">No registered events.</div>
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
