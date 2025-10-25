import React, { useContext } from 'react'
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
  return (
    <div className='h-screen bg-black'>
      {}
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
