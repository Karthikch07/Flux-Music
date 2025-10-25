import React, { useState, useContext } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

const Navbar = () => {

  const navigate = useNavigate();
  const { user, isAuthenticated, logout, showMessage } = useContext(AuthContext);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handlePremium = () => {
    if (!isAuthenticated) {
      showMessage('Please login to access Premium features', 'info');
      navigate('/login');
      return;
    }
    // Show premium upgrade page/modal
    showMessage('🎵 Premium: Ad-free listening, offline downloads, and high-quality audio!', 'success');
    // In a real app, you'd navigate to a premium subscription page
    // navigate('/premium');
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  return (
    <>
    <div className='w-full flex justify-between items-center font-semibold'>
        <div className='flex items-center gap-2'>
            <img onClick={() => navigate(-1)} className='w-8 bg-black p-2 rounded-2xl cursor-pointer hover:scale-110 transition' src={assets.arrow_left} alt="" />
            <img onClick={() => navigate(1)} className='w-8 bg-black p-2 rounded-2xl cursor-pointer hover:scale-110 transition' src={assets.arrow_right} alt="" />
        </div>
        <div className='flex items-center gap-4'>
            <p onClick={handlePremium} className='bg-white text-black text-[15px] px-4 py-1 rounded-2xl hidden md:block cursor-pointer hover:scale-105 transition'>Explore Premium</p>
            
            {isAuthenticated ? (
              <div className='relative'>
                <div 
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className='bg-purple-500 text-white px-3 py-1 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition min-w-[32px] h-8'
                >
                  {user?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
                
                {showUserMenu && (
                  <div className='absolute right-0 mt-2 w-48 bg-gray-900 rounded-lg shadow-xl border border-gray-700 py-2 z-50'>
                    <div className='px-4 py-2 border-b border-gray-700'>
                      <p className='text-white font-semibold'>{user?.username}</p>
                      <p className='text-gray-400 text-sm'>{user?.email}</p>
                    </div>
                    <button 
                      onClick={() => { setShowUserMenu(false); navigate('/'); }}
                      className='w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-800'
                    >
                      Profile
                    </button>
                    <button 
                      onClick={handleLogout}
                      className='w-full text-left px-4 py-2 text-red-400 hover:bg-gray-800'
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className='flex items-center gap-2'>
                <button 
                  onClick={() => navigate('/login')}
                  className='bg-white text-black px-4 py-1 rounded-2xl text-[15px] cursor-pointer hover:scale-105 transition'
                >
                  Login
                </button>
                <button 
                  onClick={() => navigate('/register')}
                  className='bg-purple-500 text-white px-4 py-1 rounded-2xl text-[15px] cursor-pointer hover:scale-105 transition'
                >
                  Sign Up
                </button>
              </div>
            )}
        </div>
        </div>
        <div className='flex items-center gap-2 mt-4'>
            <p onClick={() => navigate('/')} className='bg-white text-black px-4 py-1 rounded-2xl cursor-pointer hover:scale-105 transition'> All</p>
            <p onClick={() => navigate('/')} className='bg-black px-4 py-1 rounded-2xl text-white cursor-pointer hover:scale-105 transition'> Music</p>
            <p onClick={() => navigate('/podcasts')} className='bg-black px-4 py-1 rounded-2xl text-white cursor-pointer hover:scale-105 transition'> Podcasts</p>

        </div>
    </>
  )
}

export default Navbar