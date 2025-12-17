import React, { useState, useEffect } from 'react';
import { Settings, Bell, Menu, Sparkles } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface HeaderProps {
  onOpenSettings: () => void;
  onToggleMenu: () => void;
  onToggleImmersive: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenSettings, onToggleMenu, onToggleImmersive }) => {
  const { t } = useLanguage();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="h-20 w-full flex items-center justify-between px-6 flex-shrink-0 z-40 relative bg-white border-b-[3px] border-black">
       {/* Left: Logo & Title */}
       <div className="flex items-center gap-4">
          <button 
            onClick={onToggleMenu}
            className="md:hidden text-black active:scale-95 transition-transform"
          >
            <Menu size={28} strokeWidth={3} />
          </button>

          {/* Logo */}
          <div className="w-12 h-12 border-[3px] border-black flex items-center justify-center relative bg-white shadow-[3px_3px_0_#000]">
             <span className="font-black text-2xl tracking-tighter">UD</span>
             {/* Tiny accent */}
             <div className="absolute -top-1 -right-1 w-2 h-2 bg-jinx-pink border border-black"></div>
          </div>

          {/* Title Text */}
          <div className="flex flex-col leading-none select-none">
            <h1 className="text-3xl font-anime font-black text-black tracking-tight">
              {t('app.title')}
            </h1>
            <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-gray-400 tracking-[0.3em] uppercase">PROJECT</span>
                <span className="text-[10px] font-bold bg-black text-white px-1.5 py-[1px] transform -rotate-2">
                  {t('app.subtitle')}
                </span>
            </div>
          </div>
       </div>

       {/* Center: Decorative cat (optional) */}
        <div className="hidden lg:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20 hover:opacity-100 transition-opacity">
            <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBhdGggZD0iTTEyIDVjMi44IDAgNSAyLjIgNSA1di4ybC44LjZDOC42IDEyLjUgOSAxMyA5IDEzLjVjMCAxLjQuNiAyLjUgMS43IDMuM0wxMCAxOWgtNHYtM2wtLjQtLjVDNC44IDE0LjUgNCAxMi41IDQgMTAuNWMwLTMgMi4yLTUuNSA1LTUuNXoiLz48cGF0aCBkPSJNMTEgNWMtMS0yLjUtMi0zLTItMyIvPjxwYXRoIGQ9Ik0xMyA1YzEtMi41IDItMyAyLTMiLz48L3N2Zz4=" className="w-8 h-8" alt="cat" />
        </div>

       {/* Right: Actions & Time */}
       <div className="flex items-center gap-6">
          {/* Time Display */}
          <div className="hidden lg:flex flex-col items-end font-mono select-none text-right">
              <span className="text-2xl font-black text-black leading-none tracking-tight">
                {currentTime.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' })}
              </span>
              <span className="text-[10px] font-bold text-gray-400 tracking-wider">
                {currentTime.toLocaleDateString()}
              </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Immersive Mode Button */}
            <button 
                onClick={onToggleImmersive}
                className="p-2 border-2 border-black rounded-lg hover:bg-jinx-blue hover:text-white transition-all active:translate-y-0.5 bg-white hover:shadow-[3px_3px_0_#000]"
                title="Immersive Mode"
            >
                <Sparkles size={20} strokeWidth={2.5} />
            </button>

            <button className="p-2 border-2 border-black rounded-lg hover:bg-black hover:text-white transition-all active:translate-y-0.5">
                <Bell size={20} strokeWidth={2.5} />
            </button>
            
            <button 
                onClick={onOpenSettings}
                className="flex items-center gap-2 px-4 py-2 border-2 border-black rounded-lg hover:bg-neon-green hover:shadow-[3px_3px_0_#000] transition-all active:translate-y-0.5 active:shadow-none bg-white"
            >
                <Settings size={18} strokeWidth={2.5} />
                <span className="font-anime font-bold hidden sm:inline">{t('app.setup')}</span>
            </button>
          </div>
       </div>
    </header>
  );
};

export default Header;