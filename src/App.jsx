import React, { useContext } from 'react'
import Sidebar from './components/Sidebar'
import Player from './components/Player'
import Display from './components/Display'
import MobileBottomNav from './components/MobileBottomNav'
import { PlayerContext } from './context/PlayerContext'
import { AuthContext } from './context/AuthContext'
import { useLocation } from 'react-router-dom'

const App = () => {
  const { audioRef, track, loop, next } = useContext(PlayerContext);
  const { authMessage } = useContext(AuthContext);
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  const handleAudioEnded = () => {
    if (loop) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(e => console.log(e));
      }
    } else {
      next();
    }
  };

  return (
    <div className='h-screen w-full bg-black flex flex-col overflow-hidden'>
      {authMessage && (
        <div className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-in ${
          authMessage.type === 'success' ? 'bg-green-600' : 
          authMessage.type === 'error' ? 'bg-red-600' : 'bg-purple-600'
        } text-white font-medium`}>
          {authMessage.message}
        </div>
      )}
      <div className={`${isAuthPage ? 'h-full w-full' : 'flex-1 min-h-0 flex overflow-hidden'}`}>
        {!isAuthPage && <Sidebar />}
        <Display />
      </div>
      {!isAuthPage && <Player />}
      {!isAuthPage && <MobileBottomNav />}
      <audio 
        ref={audioRef} 
        src={track?.file} 
        preload='auto'
        onEnded={handleAudioEnded}
      ></audio>
    </div>
  );
};

export default App;
