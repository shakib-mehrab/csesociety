/* eslint-disable no-unused-vars */

import React from 'react';
import { FaUsers, FaUserCheck, FaBullhorn, FaStickyNote, FaCalendarAlt, FaClipboardList, FaBars, FaTimes } from 'react-icons/fa';

import ClubJoinRequests from './ClubJoinRequests';
import ClubMembers from './ClubMembers';
import ClubNotices from './ClubNotices';
import ClubEvents from './ClubEvents';
import EventRegistrations from './EventRegistrations';
import ClubAnnouncements from './ClubAnnouncements';

const featureComponents = {
	joinRequests: <ClubJoinRequests />,
	members: <ClubMembers />,
	announcements: <ClubAnnouncements />,
	notices: <ClubNotices />,
	events: <ClubEvents />,
	registrations: <EventRegistrations />,
};

const sidebarLinks = [
	{ key: 'joinRequests', label: 'Join Requests', icon: <FaUserCheck size={18} /> },
	{ key: 'members', label: 'Members', icon: <FaUsers size={18} /> },
	{ key: 'announcements', label: 'Announcements', icon: <FaBullhorn size={18} /> },
	{ key: 'notices', label: 'Notices', icon: <FaStickyNote size={18} /> },
	{ key: 'events', label: 'Events', icon: <FaCalendarAlt size={18} /> },
	{ key: 'registrations', label: 'Registrations', icon: <FaClipboardList size={18} /> },
];

const AdminDashboard = () => {
	const [club, setClub] = React.useState(null);
	const [loading, setLoading] = React.useState(true);
	const [activeFeature, setActiveFeature] = React.useState('announcements');
	const [sidebarOpen, setSidebarOpen] = React.useState(false);

	React.useEffect(() => {
		// Fetch club info if needed, or remove if not required
		setLoading(false);
	}, []);

	return (
		<div className="min-h-screen bg-gray-50 flex font-sans">
			{/* Sidebar */}
			<div className={`
				fixed md:static z-40 top-0 left-0 h-full md:h-auto w-64 md:w-60 bg-white shadow-lg md:shadow-none transition-transform duration-300
				${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
				md:translate-x-0
				flex flex-col
				md:sticky md:top-0
			`} style={{ maxHeight: '100vh' }}>
				<div className="flex items-center justify-between px-6 py-4 border-b">
					<div className="flex items-center">
						{/* Club logo and name can be added here if needed */}
						<span className="font-bold text-lg text-gray-800">Admin</span>
					</div>
					<button className="md:hidden text-gray-600 hover:text-black" onClick={() => setSidebarOpen(false)}><FaTimes size={22} /></button>
				</div>
				<nav className="flex-1 overflow-y-auto py-4 px-2 custom-scrollbar">
					{sidebarLinks.map(link => (
						<button
							key={link.key}
							className={`flex items-center w-full px-4 py-2 mb-2 rounded-lg font-medium text-base transition-all
								${activeFeature === link.key
									? 'bg-blue-100 text-blue-700 shadow-md'
									: 'bg-white text-gray-700 hover:bg-gray-100 hover:shadow'}
								focus:outline-none focus:ring-2 focus:ring-blue-300
							`}
							style={{ fontWeight: activeFeature === link.key ? 600 : 500 }}
							onClick={() => { setActiveFeature(link.key); setSidebarOpen(false); }}
						>
							<span className="mr-3 text-lg">{link.icon}</span>
							{link.label}
						</button>
					))}
				</nav>
				<div className="hidden md:block px-6 pb-4 text-xs text-gray-400">&copy; {new Date().getFullYear()} Club Admin</div>
			</div>

			{/* Hamburger for mobile */}
			<button
				className="fixed top-4 left-4 z-50 md:hidden bg-white p-2 rounded-full shadow-lg border border-gray-200"
				onClick={() => setSidebarOpen(true)}
				style={{ display: sidebarOpen ? 'none' : 'block' }}
				aria-label="Open sidebar"
			>
				<FaBars size={22} />
			</button>

			{/* Main Content */}
			<main className="flex-1 flex flex-col items-center px-2 md:px-8 py-8 md:py-12 overflow-y-auto" style={{ minHeight: '100vh' }}>
				<div className="w-full max-w-4xl bg-white rounded-xl shadow p-6 md:p-10 custom-scrollbar">
					<div className="mb-6">
						<h2 className="text-3xl font-bold text-gray-900 mb-1">Admin Dashboard</h2>
					</div>
					<div className="min-h-[300px]">
						{activeFeature ? featureComponents[activeFeature] : <div className="text-gray-500">Select a feature from the sidebar.</div>}
					</div>
				</div>
			</main>
		</div>
	);
};

export default AdminDashboard;




