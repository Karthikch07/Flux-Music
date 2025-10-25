import React, { useEffect, useRef } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import DisplayHome from './DisplayHome'
import DisplayAlbum from './DisplayAlbum'
import Search from './Search'
import Login from './Login'
import Register from './Register'
import Podcasts from './Podcasts'
import MyPlaylists from './MyPlaylists'
import { albumsData } from '../assets/assets'
const Display = () => {
  const displayRef = useRef();
  const location = useLocation();
  const isAlbum = location.pathname.includes('album');
  const isAuth = location.pathname.includes('login') || location.pathname.includes('register');
  const albumId = isAlbum ? location.pathname.slice(-1) : "";
  const albumData = albumsData[Number(albumId)];
  const bgColor = albumData?.bgColor || '#121212';
  useEffect(() => {
    if (isAuth) {
      displayRef.current.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    } else if (isAlbum && albumData) {
      displayRef.current.style.background = `linear-gradient(${bgColor}, #121212)`;
    } else {
      displayRef.current.style.background = '#121212';
    }
  }, [isAlbum, isAuth, bgColor, albumData])
  return (
    <div ref={displayRef} className='w-[100%] m-2 px-6 pt-4 rounded bg-[#121212] text-white overflow-auto lg:w-[75%] lg:ml-0'>
        <Routes>
             <Route path='/' element={<DisplayHome />} />
             <Route path='/album/:id' element={<DisplayAlbum />} />
             <Route path='/search' element={<Search />} />
             <Route path='/podcasts' element={<Podcasts />} />
             <Route path='/playlists' element={<MyPlaylists />} />
             <Route path='/login' element={<Login />} />
             <Route path='/register' element={<Register />} />
        </Routes>
    </div>
  )
}
export default Display
