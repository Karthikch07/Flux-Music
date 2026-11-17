import React, { useEffect, useRef } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import DisplayHome from './DisplayHome'
import DisplayAlbum from './DisplayAlbum'
import Search from './Search'
import Login from './Login'
import Register from './Register'
import Podcasts from './Podcasts'
import MyPlaylists from './MyPlaylists'
import DisplayPlaylist from './DisplayPlaylist'
import Premium from './Premium'
import { albumsData } from '../assets/assets'

const Display = () => {
  const displayRef = useRef();
  const location = useLocation();
  const isAlbum = location.pathname.includes('album');
  const isAuth = location.pathname.includes('login') || location.pathname.includes('register');
  const albumId = isAlbum ? location.pathname.split('/').filter(Boolean).pop() : "";
  const albumData = albumsData.find(a => a.id.toString() === albumId) || albumsData[Number(albumId)];
  const bgColor = albumData?.bgColor || '#121212';

  useEffect(() => {
    if (isAuth) {
      displayRef.current.style.background = 'transparent';
    } else if (isAlbum && albumData) {
      displayRef.current.style.background = `linear-gradient(${bgColor}, #121212)`;
    } else {
      displayRef.current.style.background = '#121212';
    }
  }, [isAlbum, isAuth, bgColor, albumData]);

  return (
    <div 
      ref={displayRef} 
      className={`text-white transition-colors duration-500 overflow-y-auto overflow-x-hidden flex-1 min-h-0 ${
        isAuth 
          ? 'w-full h-full m-0 p-0 rounded-none bg-transparent' 
          : 'w-full lg:w-[75%] lg:ml-0 m-1 sm:m-2 px-3 sm:px-6 pt-3 sm:pt-4 rounded-xl bg-[#121212]'
      }`}
    >
        <Routes>
             <Route path='/' element={<DisplayHome />} />
             <Route path='/album/:id' element={<DisplayAlbum />} />
             <Route path='/search' element={<Search />} />
             <Route path='/podcasts' element={<Podcasts />} />
             <Route path='/playlists' element={<MyPlaylists />} />
             <Route path='/playlist/:id' element={<DisplayPlaylist />} />
             <Route path='/premium' element={<Premium />} />
             <Route path='/login' element={<Login />} />
             <Route path='/register' element={<Register />} />
        </Routes>
    </div>
  );
};

export default Display;
