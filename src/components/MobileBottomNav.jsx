import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Search, Radio, Library, Crown } from 'lucide-react';

const MobileBottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Search', path: '/search', icon: Search },
    { name: 'Podcasts', path: '/podcasts', icon: Radio },
    { name: 'Library', path: '/playlists', icon: Library },
    { name: 'Premium', path: '/premium', icon: Crown, isPremium: true }
  ];

  return (
    <nav className='lg:hidden w-full h-[54px] bg-[#0c0a14]/95 backdrop-blur-lg border-t border-[#221c32] flex items-center justify-around px-2 select-none z-50 shrink-0'>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));

        return (
          <button
            key={item.path}
            type='button'
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all relative ${
              isActive
                ? item.isPremium
                  ? 'text-amber-400 font-bold'
                  : 'text-purple-400 font-bold'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <div className='relative'>
              <Icon className={`w-5 h-5 ${isActive ? 'scale-110 drop-shadow-[0_0_8px_rgba(168,85,247,0.4)]' : ''}`} />
              {item.isPremium && (
                <span className='absolute -top-1 -right-2 px-1 py-0.2 rounded-full text-[8px] font-black bg-gradient-to-r from-amber-400 to-orange-500 text-black'>
                  VIP
                </span>
              )}
            </div>
            <span className='text-[10px] mt-0.5 tracking-tight'>{item.name}</span>
            {isActive && (
              <span className={`w-1 h-1 rounded-full mt-0.5 ${item.isPremium ? 'bg-amber-400' : 'bg-purple-400'}`} />
            )}
          </button>
        );
      })}
    </nav>
  );
};

export default MobileBottomNav;

