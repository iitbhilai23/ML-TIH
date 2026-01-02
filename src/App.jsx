
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './modules/auth/Login';
import ProtectedRoute from './components/common/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './modules/dashboard/Dashboard';
import TrainerList from './modules/trainers/TrainerList';
import Subjects from './modules/masters/Subjects';
import Locations from './modules/masters/Locations';
import Trainings from './modules/trainings/Trainings';
import Participants from './modules/participants/Participants';
import PublicReport from './modules/reports/PublicReport';
import ChangePassword from './modules/change password/changePassword';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Route */}
          <Route path="/" element={<PublicReport />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Routes (Login Required) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<MainLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="trainers" element={<TrainerList />} />
              <Route path="trainings/subjects" element={<Subjects />} />
              <Route path="locations" element={<Locations />} />
              <Route path="trainings" element={<Trainings />} />
              <Route path="participants" element={<Participants />} />
              <Route path="trainings/chngpass" element={<ChangePassword />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;