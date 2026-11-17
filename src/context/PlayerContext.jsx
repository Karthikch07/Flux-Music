import { createContext, useRef, useState, useEffect } from "react";
import { songsData, resolveSongImage, resolveSongAudio } from "../assets/assets";
import { songAPI } from "../services/api";

export const PlayerContext = createContext();

const normalizeSong = (s, idx) => ({
    ...s,
    id: s.id !== undefined ? s.id : (s._id || idx),
    _id: s._id || s.id,
    name: s.name,
    artist: s.artist || 'Flux Artist',
    album: s.album || 'Trending Global',
    desc: s.desc || '',
    duration: s.duration || '3:00',
    image: resolveSongImage(s.image),
    file: resolveSongAudio(s.file)
});

const PlayerContextProvider = (props) => {
    const audioRef = useRef();
    const seekBg = useRef();
    const seekbar = useRef();

    const initialSongs = songsData.map(normalizeSong);
    const [songs, setSongs] = useState(initialSongs);
    const [track, setTrack] = useState(initialSongs[0]);
    const [playStatus, setPlayStatus] = useState(false);
    const [shuffle, setShuffle] = useState(false);
    const [loop, setLoop] = useState(false);
    const [isLoadingSongs, setIsLoadingSongs] = useState(false);
    const [Time, setTime] = useState({
        currentTime: {
            second: 0,
            minute: 0
        },
        totalTime: {
            second: 0,
            minute: 0
        }
    });

    // Fetch songs from Backend API on mount
    const fetchSongs = async () => {
        try {
            setIsLoadingSongs(true);
            const res = await songAPI.getAll();
            if (res && res.data && res.data.songs && res.data.songs.length > 0) {
                const apiSongs = res.data.songs.map((s, i) => normalizeSong(s, i));
                setSongs(apiSongs);
                // Keep playing track consistent or default to first
                setTrack(prev => {
                    const match = apiSongs.find(s => s._id === prev?._id || s.name === prev?.name);
                    return match || apiSongs[0];
                });
            }
        } catch (error) {
            console.log('Backend not connected or failed to fetch songs, using assets:', error.message);
        } finally {
            setIsLoadingSongs(false);
        }
    };

    useEffect(() => {
        fetchSongs();
    }, []);

    const play = () => {
        if (audioRef.current) {
            audioRef.current.play().catch(e => console.log('Audio play error:', e));
            setPlayStatus(true);
        }
    };

    const pause = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            setPlayStatus(false);
        }
    };

    const playWithId = async (id) => {
        const targetSong = songs.find(s => s.id === id || s._id === id || s.id === Number(id));
        if (targetSong) {
            setTrack(targetSong);
            setTimeout(() => {
                if (audioRef.current) {
                    audioRef.current.play().catch(e => console.log('Audio play error:', e));
                    setPlayStatus(true);
                }
            }, 100);

            if (targetSong._id) {
                songAPI.incrementPlay(targetSong._id).catch(() => {});
            }
        }
    };

    const playSongObject = (songObj) => {
        const normalized = normalizeSong(songObj, songs.length);
        setTrack(normalized);
        setTimeout(() => {
            if (audioRef.current) {
                audioRef.current.play().catch(e => console.log('Audio play error:', e));
                setPlayStatus(true);
            }
        }, 100);
    };

    const previous = async () => {
        if (songs.length === 0) return;
        const currentIndex = songs.findIndex(s => (s._id && s._id === track._id) || s.id === track.id || s.name === track.name);
        let nextIndex;
        if (shuffle) {
            nextIndex = Math.floor(Math.random() * songs.length);
        } else if (currentIndex > 0) {
            nextIndex = currentIndex - 1;
        } else {
            nextIndex = songs.length - 1;
        }

        const nextTrack = songs[nextIndex];
        setTrack(nextTrack);
        setTimeout(() => {
            if (audioRef.current) {
                audioRef.current.play().catch(e => console.log(e));
                setPlayStatus(true);
            }
        }, 100);
    };

    const next = async () => {
        if (songs.length === 0) return;
        const currentIndex = songs.findIndex(s => (s._id && s._id === track._id) || s.id === track.id || s.name === track.name);
        let nextIndex;
        if (shuffle) {
            nextIndex = Math.floor(Math.random() * songs.length);
        } else if (currentIndex < songs.length - 1) {
            nextIndex = currentIndex + 1;
        } else {
            nextIndex = 0;
        }

        const nextTrack = songs[nextIndex];
        setTrack(nextTrack);
        setTimeout(() => {
            if (audioRef.current) {
                audioRef.current.play().catch(e => console.log(e));
                setPlayStatus(true);
            }
        }, 100);
    };

    const toggleShuffle = () => {
        setShuffle(!shuffle);
    };

    const toggleLoop = () => {
        setLoop(!loop);
    };

    const seekSong = async (e) => {
        if (audioRef.current && seekBg.current && audioRef.current.duration) {
            audioRef.current.currentTime = ((e.nativeEvent.offsetX / seekBg.current.offsetWidth) * audioRef.current.duration);
        }
    };

    // Add Song Method
    const addSong = async (songData) => {
        try {
            // Check for duplicate in current state first
            const isDuplicate = songs.some(
                s => s.name.trim().toLowerCase() === songData.name.trim().toLowerCase() &&
                     (s.artist || '').trim().toLowerCase() === (songData.artist || '').trim().toLowerCase()
            );

            if (isDuplicate) {
                return {
                    success: false,
                    error: `A song named "${songData.name}" by "${songData.artist}" already exists!`
                };
            }

            let newSong;
            try {
                const res = await songAPI.create(songData);
                newSong = normalizeSong(res.data.song, songs.length);
            } catch (apiError) {
                console.log('API add failed, saving to local state:', apiError.message);
                if (apiError.response?.status === 409) {
                    return {
                        success: false,
                        error: apiError.response?.data?.message || 'Duplicate song detected.'
                    };
                }
                newSong = normalizeSong({
                    ...songData,
                    id: Date.now()
                }, songs.length);
            }

            setSongs(prev => [newSong, ...prev]);
            return { success: true, song: newSong };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    // Remove Duplicates Method
    const removeDuplicates = async () => {
        try {
            let apiMessage = '';
            let removedCount = 0;

            try {
                const res = await songAPI.removeDuplicates();
                removedCount = res.duplicatesRemoved || 0;
                apiMessage = res.message;
            } catch (err) {
                console.log('API dedupe error, performing in-memory deduplication:', err.message);
            }

            // Deduplicate local state
            const seen = new Map();
            const uniqueList = [];
            let localRemoved = 0;

            for (const s of songs) {
                const key = `${s.name.trim().toLowerCase()}:::${(s.artist || '').trim().toLowerCase()}`;
                if (!seen.has(key)) {
                    seen.set(key, true);
                    uniqueList.push(s);
                } else {
                    localRemoved++;
                }
            }

            setSongs(uniqueList);
            const totalRemoved = Math.max(removedCount, localRemoved);

            return {
                success: true,
                message: totalRemoved > 0 
                    ? `Cleaned up ${totalRemoved} duplicate song(s)! Your music library is pristine.` 
                    : 'All songs are already unique. No duplicates found!',
                duplicatesRemoved: totalRemoved
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            if (audioRef.current && audioRef.current.duration) {
                if (seekbar.current) {
                    seekbar.current.style.width = (Math.floor((audioRef.current.currentTime / audioRef.current.duration) * 100)) + "%";
                }
                setTime({
                    currentTime: {
                        second: Math.floor(audioRef.current.currentTime % 60),
                        minute: Math.floor(audioRef.current.currentTime / 60)
                    },
                    totalTime: {
                        second: Math.floor(audioRef.current.duration % 60),
                        minute: Math.floor(audioRef.current.duration / 60)
                    }
                });
            }
        }, 500);

        return () => clearInterval(interval);
    }, [audioRef]);

    const contextValue = {
        audioRef,
        seekbar,
        seekBg,
        track, setTrack,
        songs, setSongs,
        isLoadingSongs,
        playStatus, setPlayStatus,
        Time, setTime,
        play, pause,
        playWithId,
        playSongObject,
        previous, next,
        seekSong,
        shuffle, toggleShuffle,
        loop, toggleLoop,
        addSong,
        removeDuplicates,
        fetchSongs
    };

    return (
        <PlayerContext.Provider value={contextValue}>
            {props.children}
        </PlayerContext.Provider>
    );
};

export default PlayerContextProvider;
