import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { PlayerContext } from '../context/PlayerContext'

const Player = () => {

    const {track,seekbar,seekBg,playStatus,play,pause,Time,previous,next,seekSong,shuffle,toggleShuffle,loop,toggleLoop,audioRef} = useContext(PlayerContext);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);

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
        } else {
            document.documentElement.requestFullscreen().catch(err => console.log('Fullscreen error:', err));
        }
    };
    return (
        <div className=' h-[10%] bg-black flex justify-between items-center text-white px-4'>
            <div className='hidden lg:flex items-center gap-4'>
                <img className='w-12' src={track.image} alt="" />
                <div>
                    <p>{track.name}</p>
                    <p>{track.desc.slice(0, 12)}</p>
                </div>
            </div>
            <div className='flex flex-col items-center gap-1 m-auto'>
                <div className='flex gap-4'>
                    <img onClick={toggleShuffle} className={`w-4 cursor-pointer ${shuffle ? 'opacity-100' : 'opacity-50'}`} src={assets.shuffle_icon} alt="" title={shuffle ? "Shuffle On" : "Shuffle Off"} />
                    <img onClick={previous} className='w-4 cursor-pointer' src={assets.prev_icon} alt="" />
                    {playStatus 
                    ?<img onClick={pause} className='w-4 cursor-pointer' src={assets.pause_icon} alt="" />
                :<img onClick={play} className='w-4 cursor-pointer' src={assets.play_icon} alt="" />
                }
                    <img onClick={next} className='w-4 cursor-pointer' src={assets.next_icon} alt="" />
                    <img onClick={toggleLoop} className={`w-4 cursor-pointer ${loop ? 'opacity-100' : 'opacity-50'}`} src={assets.loop_icon} alt="" title={loop ? "Loop On" : "Loop Off"} />

                </div>
                <div className='flex items-center gap-5'>
                    <p>{Time.currentTime.minute}:{Time.currentTime.second}</p>
                    <div ref={seekBg} onClick={seekSong} className=' w-[60vw] max-w-[500px] bg-gray-300 rounded-full cursor-pointer'>
                        <hr ref={seekbar} className='h-1 border-none w-0 bg-purple-800 rounded-full' />
                    </div>
                    <p>{Time.totalTime.minute}:{Time.totalTime.second }</p>
                </div>

            </div>
            <div className='hidden lg:flex items-center gap-2 opacity-75'>
                <div className='relative'>
                    <img 
                        onClick={toggleMute}
                        className='w-4 cursor-pointer hover:opacity-100 transition'
                        src={assets.volume_icon} 
                        alt="Volume" 
                        title={isMuted ? "Unmute" : "Mute"}
                    />
                    {isMuted && (
                        <div className='absolute top-1/2 left-0 w-full h-[2px] bg-white rotate-45 transform -translate-y-1/2'></div>
                    )}
                </div>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={handleVolumeChange}
                    className='w-20 bg-slate-50 h-1 rounded'
                />
                <img 
                    onClick={handleFullScreen}
                    className='w-4 cursor-pointer hover:opacity-100 transition' 
                    src={assets.zoom_icon} 
                    alt="Full screen" 
                    title="Full screen"
                />
            </div>
        </div>
    )
}

export default Player