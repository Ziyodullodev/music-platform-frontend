import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { AudioProvider, useAudio } from './context/AudioContext'
import Home from './pages/Home'
import MusicDetail from './pages/MusicDetail'
import PlaylistDetail from './pages/PlaylistDetail'
import Playlists from './pages/Playlists'
import EditPlaylist from './pages/EditPlaylist'
import UploadMusic from './pages/UploadMusic'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Register from './pages/Register'
import OtpVerify from './pages/OtpVerify'
import BottomNav from './components/BottomNav'
import MiniPlayer from './components/MiniPlayer'

function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

function AppContent() {
  const { track: audioTrack } = useAudio()
  const location = useLocation()
  const isMusicDetail = location.pathname.startsWith('/music/')
  const isEditPlaylist = location.pathname.includes('/edit')
  const isAuth = ['/login', '/register', '/otp-verify'].includes(location.pathname)

  const hideShell = isMusicDetail || isEditPlaylist || isAuth

  return (
    <div className="dark">
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/otp-verify" element={<OtpVerify />} />

        {/* Protected */}
        <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/music/:id" element={<PrivateRoute><MusicDetail /></PrivateRoute>} />
        <Route path="/playlists" element={<PrivateRoute><Playlists /></PrivateRoute>} />
        <Route path="/playlists/new/edit" element={<PrivateRoute><EditPlaylist /></PrivateRoute>} />
        <Route path="/playlists/:id/edit" element={<PrivateRoute><EditPlaylist /></PrivateRoute>} />
        <Route path="/playlists/:id" element={<PrivateRoute><PlaylistDetail /></PrivateRoute>} />
        <Route path="/upload" element={<PrivateRoute><UploadMusic /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
      </Routes>

      {!hideShell && (
        <>
          {audioTrack && <MiniPlayer />}
          <BottomNav />
        </>
      )}
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AudioProvider>
          <AppContent />
        </AudioProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
