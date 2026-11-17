import React, { useContext } from 'react';
import { PlayerContext } from '../context/PlayerContext';
import { Play, Pause } from 'lucide-react';
import { assets } from '../assets/assets';

const SongItem = ({ name, image, desc, id }) => {
    const { playWithId, track, playStatus, pause, play } = useContext(PlayerContext);
    const isCurrentTrack = track && (track.id === id || track._id === id);
    const isPlayingThis = isCurrentTrack && playStatus;

    const handlePlayClick = (e) => {
        e.stopPropagation();
        if (isPlayingThis) {
            pause();
        } else if (isCurrentTrack) {
            play();
        } else {
            playWithId(id);
        }
    };

    return (
        <div 
            onClick={() => playWithId(id)}
            className='min-w-[180px] p-2.5 px-3 rounded-xl cursor-pointer hover:bg-[#181818] transition-all duration-200 group relative border border-transparent hover:border-[#2a2a2a]'
        >
            <div className='relative overflow-hidden rounded-lg shadow-md aspect-square bg-[#1a1a1a]'>
                <img 
                    className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300' 
                    src={image || assets.img1} 
                    alt={name} 
                    onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = assets.img1;
                    }}
                />
                
                {/* Floating Play / Pause Button with maximum visibility */}
                <button
                    type="button"
                    onClick={handlePlayClick}
                    className={`absolute right-2.5 bottom-2.5 w-10 h-10 rounded-full bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center shadow-xl shadow-black/50 transition-all duration-200 hover:scale-110 active:scale-95 ${
                        isPlayingThis ? 'opacity-100 scale-100' : 'opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0'
                    }`}
                    title={isPlayingThis ? "Pause" : "Play"}
                >
                    {isPlayingThis ? (
                        <Pause className='w-4 h-4 fill-white text-white' />
                    ) : (
                        <Play className='w-4 h-4 fill-white text-white ml-0.5' />
                    )}
                </button>
            </div>
            <p className={`font-bold mt-2.5 mb-1 text-sm truncate ${isCurrentTrack ? 'text-purple-400' : 'text-white'}`}>
                {name}
            </p>
            <p className='text-gray-400 text-xs truncate'>{desc}</p>
        </div>
    );
};

export default SongItem;
