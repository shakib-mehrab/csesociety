import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Common/Navbar';
import Footer from './components/Common/Footer';
import HomePage from './pages/HomePage';
import ClubsPage from './pages/ClubsPage';
import ClubDetailsPage from './pages/ClubDetailsPage';
import EventsPage from './pages/EventsPage';
import EventDetails from './components/Events/EventDetails';
import NoticesPage from './pages/NoticesPage';
import NoticeDetails from './components/Notices/NoticeDetails';
import ScholarshipPage from './pages/ScholarshipPage';
import DashboardPage from './pages/DashboardPage';
import UserProfilePage from './pages/UserProfilePage';
import PaymentPage from './pages/PaymentPage';
import SignIn from './components/Auth/SignIn';
import SignUp from './components/Auth/SignUp';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/Common/ProtectedRoute';

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/clubs" element={<ClubsPage />} />
          <Route path="/clubs/:id" element={<ClubDetailsPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/notices" element={<NoticesPage />} />
          <Route path="/notices/:id" element={<NoticeDetails />} />
          <Route path="/scholarships" element={<ScholarshipPage />} />
          
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><UserProfilePage /></ProtectedRoute>} />
          <Route path="/payments" element={<ProtectedRoute roles={['super_admin']}><PaymentPage /></ProtectedRoute>} />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;

