import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import NotesPage from './pages/NotesPage';
import PYPPage from './pages/PYPPage';
import ChatPage from './pages/ChatPage';
import DashboardLayout from './components/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';
import { Toaster } from 'react-hot-toast';
import AttendancePage from './pages/AttendancePage';
import LandingPage from './pages/LandingPage';

const App = () => {
  return (
    <Router>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        
        {/* Protected Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard/notes" replace />} />
          <Route path="notes" element={<NotesPage />} />
          <Route path="pyp" element={<PYPPage />} />  
          <Route path="attendance" element={<AttendancePage />} />
          <Route path="chat" element={<ChatPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
