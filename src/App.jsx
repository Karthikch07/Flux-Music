import React, { useContext, useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Player from './components/Player'
import Display from './components/Display'
import { PlayerContext } from './context/PlayerContext'
import { AuthContext } from './context/AuthContext'
import { useLocation } from 'react-router-dom'
const App = () => {
  const {audioRef,track} = useContext(PlayerContext);
  const { authMessage } = useContext(AuthContext);
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const [showBackendWarning, setShowBackendWarning] = useState(false);

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    if (apiUrl.includes('localhost') && window.location.hostname !== 'localhost') {
      setShowBackendWarning(true);
    }
  }, []);

  return (
    <div className='h-screen bg-black'>
      {}
      {showBackendWarning && (
        <div className="fixed top-0 left-0 right-0 bg-yellow-600 text-black px-4 py-3 z-50 flex items-center justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="font-semibold">Backend Not Connected:</span>
            <span className="text-sm">Login/Register features require backend API. See <a href="https://github.com/Karthikch07/Flux-Music/blob/main/DEPLOYMENT.md" target="_blank" rel="noopener noreferrer" className="underline font-semibold">DEPLOYMENT.md</a></span>
          </div>
          <button onClick={() => setShowBackendWarning(false)} className="text-black hover:text-gray-800 ml-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}
      {authMessage && (
        <div className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-in ${
          authMessage.type === 'success' ? 'bg-green-600' : 
          authMessage.type === 'error' ? 'bg-red-600' : 'bg-blue-600'
        } text-white`}>
          {authMessage.message}
        </div>
      )}
      <div className='h-[90%] flex'>
        {!isAuthPage && <Sidebar />}
        <Display />
      </div>
      {!isAuthPage && <Player />}
      <audio ref={audioRef} src={track.file} preload='auto'></audio>
    </div>
  )
}
export default App
