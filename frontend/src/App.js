import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './routes';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Profile from './pages/Profile';
import ReportForm from './pages/ReportForm';
import EcoComplianceHub from './pages/EcoComplianceHub';
import TopicDetail from './pages/TopicDetail';
import QuizPage from './pages/QuizPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />

          <Routes>
            {/* Public Routes */}
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/report" element={<ReportForm />} />
            <Route path="/eco-compliance-hub" element={<EcoComplianceHub />} />
            <Route path="/topic/:topicParam" element={<TopicDetail />} />
            <Route path="/quiz/:quizId" element={<QuizPage />} />

            {/* Redirect root to register */}
            <Route path="/" element={<Navigate to="/register" replace />} />

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/home" replace />} />

          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
