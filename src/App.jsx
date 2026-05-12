import { Routes, Route, Navigate } from 'react-router-dom'
import { useApp } from './context/AppContext'

import Splash from './screens/Splash'
import VisitorHome from './screens/VisitorHome'
import Explore from './screens/Explore'
import DestinationDetail from './screens/DestinationDetail'
import SignUp from './screens/SignUp'
import Login from './screens/Login'
import OTPVerify from './screens/OTPVerify'
import TouristHome from './screens/TouristHome'
import MyTrips from './screens/MyTrips'
import Profile from './screens/Profile'
import Packages from './screens/Packages'
import PackageDetail from './screens/PackageDetail'
import Payment from './screens/Payment'
import BookingConfirmed from './screens/BookingConfirmed'
import PadharoAI from './screens/PadharoAI'
import Grievances from './screens/Grievances'
import FileGrievance from './screens/FileGrievance'
import GrievanceSubmitted from './screens/GrievanceSubmitted'
import GrievanceDetail from './screens/GrievanceDetail'
import BSPList from './screens/BSPList'
import OfficerLogin from './screens/OfficerLogin'
import OfficerDashboard from './screens/OfficerDashboard'
import ProfileSetup from './screens/ProfileSetup'
import ItineraryBuilder from './screens/ItineraryBuilder'
import EmergencySOS from './screens/EmergencySOS'
import VisualAI from './screens/VisualAI'

function ProtectedRoute({ children }) {
  const { isLoggedIn } = useApp()
  return isLoggedIn ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Splash />} />
      <Route path="/visitor" element={<VisitorHome />} />
      <Route path="/explore" element={<Explore />} />
      <Route path="/destination/:id" element={<DestinationDetail />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/otp" element={<OTPVerify />} />
      <Route path="/profile-setup" element={<ProfileSetup />} />

      {/* Tourist portal (protected) */}
      <Route path="/home" element={<ProtectedRoute><TouristHome /></ProtectedRoute>} />
      <Route path="/my-trips" element={<ProtectedRoute><MyTrips /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/packages" element={<ProtectedRoute><Packages /></ProtectedRoute>} />
      <Route path="/package/:id" element={<ProtectedRoute><PackageDetail /></ProtectedRoute>} />
      <Route path="/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
      <Route path="/booking-confirmed" element={<ProtectedRoute><BookingConfirmed /></ProtectedRoute>} />
      <Route path="/ai-chat" element={<ProtectedRoute><PadharoAI /></ProtectedRoute>} />
      <Route path="/grievances" element={<ProtectedRoute><Grievances /></ProtectedRoute>} />
      <Route path="/file-grievance" element={<ProtectedRoute><FileGrievance /></ProtectedRoute>} />
      <Route path="/grievance-submitted" element={<ProtectedRoute><GrievanceSubmitted /></ProtectedRoute>} />
      <Route path="/grievance/:id" element={<ProtectedRoute><GrievanceDetail /></ProtectedRoute>} />
      <Route path="/bsp" element={<ProtectedRoute><BSPList /></ProtectedRoute>} />
      <Route path="/checkin" element={<ProtectedRoute><TouristHome /></ProtectedRoute>} />
      <Route path="/itinerary-builder" element={<ProtectedRoute><ItineraryBuilder /></ProtectedRoute>} />
      <Route path="/sos" element={<ProtectedRoute><EmergencySOS /></ProtectedRoute>} />
      <Route path="/visual-ai" element={<ProtectedRoute><VisualAI /></ProtectedRoute>} />

      {/* Officer portal */}
      <Route path="/officer-login" element={<OfficerLogin />} />
      <Route path="/officer-dashboard" element={<OfficerDashboard />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
