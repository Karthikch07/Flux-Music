import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import { PlayerContext } from '../context/PlayerContext';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2
} from 'lucide-react';

const Player = () => {
  const {
    track,
    seekbar,
    seekBg,
    playStatus,
    play,
    pause,
    Time,
    previous,
    next,
    seekSong,
    shuffle,
    toggleShuffle,
    loop,
    toggleLoop,
    audioRef
  } = useContext(PlayerContext);

  const navigate = useNavigate();
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Handle global keyboard shortcuts (Space to toggle play/pause)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't intercept if user is typing in an input or textarea
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;
      if (e.code === 'Space') {
        e.preventDefault();
        if (playStatus) {
          pause();
        } else {
          play();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playStatus, play, pause]);

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      if (newVolume > 0) {
        audioRef.current.muted = false;
        setIsMuted(false);
      }
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      const newMutedState = !audioRef.current.muted;
      audioRef.current.muted = newMutedState;
      setIsMuted(newMutedState);
    }
  };

  const handleFullScreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(err => console.log('Exit fullscreen error:', err));
      setIsFullscreen(false);
    } else {
      document.documentElement.requestFullscreen().catch(err => console.log('Fullscreen error:', err));
      setIsFullscreen(true);
    }
  };

  const formatTime = (timeObj) => {
    const min = timeObj?.minute || 0;
    const sec = String(timeObj?.second || 0).padStart(2, '0');
    return `${min}:${sec}`;
  };

  return (
    <div className='h-[68px] sm:h-[10%] bg-[#0f0f0f]/98 backdrop-blur-md border-t border-[#222222] flex justify-between items-center text-white px-2.5 sm:px-4 select-none relative z-40 shrink-0'>
      {/* Left: Track Artwork & Info (Responsive on mobile & desktop) */}
      <div className='flex items-center gap-2 sm:gap-3.5 max-w-[125px] sm:max-w-[190px] lg:min-w-[220px] shrink-0'>
        <img
          className='w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-md shadow-md border border-[#2a2a2a] shrink-0'
          src={track?.image || assets.img1}
          alt={track?.name || 'Track'}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = assets.img1;
          }}
        />
        <div className='truncate min-w-0 flex-1'>
          <div className='flex items-center gap-1 sm:gap-1.5'>
            <p className='font-bold text-xs sm:text-sm truncate text-white hover:underline cursor-pointer' onClick={() => navigate('/premium')}>
              {track?.name || 'No Track Selected'}
            </p>
            <span
              onClick={() => navigate('/premium')}
              className='cursor-pointer px-1 py-0.2 rounded text-[8px] sm:text-[9px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40 hover:bg-purple-500/40 transition shrink-0 hidden xs:inline-block'
              title='Flux Premium Hi-Res Audio Engine - Click to explore'
            >
              FLAC
            </span>
          </div>
          <p className='text-[10px] sm:text-xs text-gray-400 truncate hover:text-gray-300 cursor-pointer'>
            {track?.artist || track?.desc || 'Flux Music'}
          </p>
        </div>
      </div>

      {/* Center: Controls & Seekbar */}
      <div className='flex flex-col items-center gap-1.5 m-auto'>
        {/* Buttons Row */}
        <div className='flex items-center gap-2.5 sm:gap-6'>
          {/* Shuffle Button */}
          <button
            type='button'
            onClick={toggleShuffle}
            className={`p-1 rounded-full transition-all cursor-pointer hidden sm:block ${
              shuffle
                ? 'text-purple-400 scale-110 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]'
                : 'text-gray-400 hover:text-white hover:scale-105'
            }`}
            title={shuffle ? 'Shuffle On' : 'Shuffle Off'}
          >
            <Shuffle className='w-3.5 h-3.5 sm:w-4 sm:h-4' />
          </button>

          {/* Previous Track Button */}
          <button
            type='button'
            onClick={previous}
            className='p-1 rounded-full text-gray-300 hover:text-white hover:scale-110 active:scale-95 transition-all cursor-pointer'
            title='Previous Track'
          >
            <SkipBack className='w-4 h-4 sm:w-5 sm:h-5 fill-current' />
          </button>

          {/* Central Play/Pause Button - Guaranteed Visible High-Contrast Icon */}
          <button
            type='button'
            onClick={playStatus ? pause : play}
            className='w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white hover:bg-gray-200 text-black flex items-center justify-center cursor-pointer hover:scale-108 active:scale-95 transition-all duration-150 shadow-lg shadow-white/20'
            title={playStatus ? 'Pause (Space)' : 'Play (Space)'}
          >
            {playStatus ? (
              <Pause className='w-3.5 h-3.5 sm:w-4 sm:h-4 fill-black text-black' />
            ) : (
              <Play className='w-3.5 h-3.5 sm:w-4 sm:h-4 fill-black text-black ml-0.5' />
            )}
          </button>

          {/* Next Track Button */}
          <button
            type='button'
            onClick={next}
            className='p-1 rounded-full text-gray-300 hover:text-white hover:scale-110 active:scale-95 transition-all cursor-pointer'
            title='Next Track'
          >
            <SkipForward className='w-4 h-4 sm:w-5 sm:h-5 fill-current' />
          </button>

          {/* Loop Button */}
          <button
            type='button'
            onClick={toggleLoop}
            className={`p-1 rounded-full transition-all cursor-pointer hidden sm:block ${
              loop
                ? 'text-purple-400 scale-110 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]'
                : 'text-gray-400 hover:text-white hover:scale-105'
            }`}
            title={loop ? 'Repeat On' : 'Repeat Off'}
          >
            <Repeat className='w-3.5 h-3.5 sm:w-4 sm:h-4' />
          </button>
        </div>

        {/* Seekbar & Timestamps */}
        <div className='flex items-center gap-1.5 sm:gap-3 text-[10px] sm:text-xs text-gray-400 font-mono'>
          <span className='min-w-[28px] sm:min-w-[32px] text-right'>{formatTime(Time.currentTime)}</span>
          <div
            ref={seekBg}
            onClick={seekSong}
            className='w-[36vw] sm:w-[50vw] max-w-[500px] h-1 sm:h-1.5 bg-[#2c2c2c] hover:h-2 rounded-full cursor-pointer transition-all relative group'
          >
            <div
              ref={seekbar}
              className='h-full w-0 bg-purple-500 rounded-full relative group-hover:bg-purple-400'
            >
              <div className='hidden group-hover:block absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-white rounded-full shadow-md' />
            </div>
          </div>
          <span className='min-w-[28px] sm:min-w-[32px]'>{formatTime(Time.totalTime)}</span>
        </div>
      </div>

      {/* Right: Volume & Fullscreen Controls */}
      <div className='hidden md:flex items-center gap-2.5 sm:gap-3.5 min-w-[130px] lg:min-w-[220px] justify-end shrink-0'>
        <button
          type='button'
          onClick={toggleMute}
          className='p-1 text-gray-400 hover:text-white hover:scale-110 transition-all cursor-pointer'
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted || volume === 0 ? (
            <VolumeX className='w-4 h-4 text-red-400' />
          ) : (
            <Volume2 className='w-4 h-4' />
          )}
        </button>

        <input
          type='range'
          min='0'
          max='1'
          step='0.01'
          value={isMuted ? 0 : volume}
          onChange={handleVolumeChange}
          className='w-24 bg-[#333333] h-1 rounded cursor-pointer accent-purple-500 hover:accent-purple-400 transition'
          title={`Volume: ${Math.round((isMuted ? 0 : volume) * 100)}%`}
        />

        <button
          type='button'
          onClick={handleFullScreen}
          className='p-1 text-gray-400 hover:text-white hover:scale-110 transition-all cursor-pointer'
          title={isFullscreen ? 'Exit Fullscreen' : 'Toggle Fullscreen'}
        >
          {isFullscreen ? <Minimize2 className='w-4 h-4' /> : <Maximize2 className='w-4 h-4' />}
        </button>
      </div>
    </div>
  );
};

export default Player;
