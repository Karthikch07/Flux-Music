import React, { useState, useContext } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { Crown, Sparkles } from 'lucide-react'

const Navbar = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, showMessage } = useContext(AuthContext);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handlePremium = () => {
    navigate('/premium');
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
            {user?.isPremium ? (
              <div 
                onClick={handlePremium} 
                className='bg-gradient-to-r from-amber-400 via-orange-500 to-yellow-400 text-black text-xs font-black px-3.5 py-1.5 rounded-full hidden md:flex items-center gap-1.5 cursor-pointer hover:scale-105 transition shadow-lg shadow-orange-500/25'
              >
                <Crown className='w-3.5 h-3.5 fill-black' />
                <span>PREMIUM PASS</span>
              </div>
            ) : (
              <p onClick={handlePremium} className='bg-white text-black text-[15px] px-4 py-1 rounded-2xl hidden md:flex items-center gap-1.5 cursor-pointer hover:scale-105 transition'>
                <Sparkles className='w-3.5 h-3.5 text-purple-600' />
                <span>Explore Premium</span>
              </p>
            )}
            {isAuthenticated ? (
              <div className='relative'>
                <div 
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className='bg-purple-500 text-white px-3 py-1 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition min-w-[32px] h-8 relative'
                >
                  {user?.username?.charAt(0).toUpperCase() || 'U'}
                  {user?.isPremium && (
                    <div className='absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-amber-400 flex items-center justify-center'>
                      <Crown className='w-2 h-2 text-black' />
                    </div>
                  )}
                </div>
                {showUserMenu && (
                  <div className='absolute right-0 mt-2 w-52 bg-gray-900 rounded-xl shadow-2xl border border-gray-700 py-2 z-50'>
                    <div className='px-4 py-2 border-b border-gray-700'>
                      <div className='flex items-center gap-1.5'>
                        <p className='text-white font-semibold'>{user?.username}</p>
                        {user?.isPremium && (
                          <span className='px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40'>
                            VIP
                          </span>
                        )}
                      </div>
                      <p className='text-gray-400 text-xs truncate'>{user?.email}</p>
                    </div>
                    <button 
                      onClick={() => { setShowUserMenu(false); navigate('/premium'); }}
                      className='w-full text-left px-4 py-2 text-purple-300 hover:bg-gray-800 flex items-center gap-2 text-xs font-semibold'
                    >
                      <Crown className='w-3.5 h-3.5 text-amber-400' />
                      <span>{user?.isPremium ? 'Manage Premium' : 'Explore Premium'}</span>
                    </button>
                    <button 
                      onClick={() => { setShowUserMenu(false); navigate('/'); }}
                      className='w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-800 text-xs'
                    >
                      Home Studio
                    </button>
                    <button 
                      onClick={handleLogout}
                      className='w-full text-left px-4 py-2 text-red-400 hover:bg-gray-800 text-xs'
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
