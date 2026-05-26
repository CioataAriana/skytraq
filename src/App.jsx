import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import FlightDetail from './pages/FlightDetail'
import AddFlight from './pages/AddFlight'
import EditFlight from './pages/EditFlight'
import { FlightProvider } from './store/FlightContext'
import { AuthProvider, useAuth } from './store/AuthContext'

// ── Protected Route Guard ──
function ProtectedRoute({ children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  return (
    <AuthProvider>
      <FlightProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/flights/add" element={<ProtectedRoute><AddFlight /></ProtectedRoute>} />
            <Route path="/flights/:id" element={<ProtectedRoute><FlightDetail /></ProtectedRoute>} />
            <Route path="/flights/:id/edit" element={<ProtectedRoute><EditFlight /></ProtectedRoute>} />
            
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </BrowserRouter>
      </FlightProvider>
    </AuthProvider>
  )
}