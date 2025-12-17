import React, { useState } from 'react';
import { CATEGORIES, PET_SKINS, BUILT_IN_GAMES } from '../constants';
import { Category, PetSkinId, GameId } from '../types';
import { Smile, Gamepad2, X, ChevronRight, ChevronLeft, Eye, EyeOff, Zap, PlayCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface SidebarProps {
  activeCategory: Category;
  onSelectCategory: (category: Category) => void;
  currentPetId: PetSkinId;
  onSelectPet: (id: PetSkinId) => void;
  onOpenGame: (id: GameId) => void;
  onClose: () => void;
  isPetVisible: boolean;
  onTogglePetVisibility: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeCategory, 
  onSelectCategory,
  currentPetId,
  onSelectPet,
  onOpenGame,
  onClose,
  isPetVisible,
  onTogglePetVisibility,
  isCollapsed = false,
  onToggleCollapse
}) => {
  const { t } = useLanguage();
  const [glitchingId, setGlitchingId] = useState<string | null>(null);

  const triggerGlitch = (id: string, callback: () => void) => {
      setGlitchingId(id);
      // Wait for half the animation to switch content, makes it feel like the glitch "loaded" the new state
      setTimeout(() => callback(), 100); 
      setTimeout(() => setGlitchingId(null), 350); 
  };

  const getJPTitle = (key: string) => {
    const map: Record<string, string> = {
        'ALL': '総合', 'AI': '人工知能', 'DESIGN': 'デザイン', 
        'FRONTEND': '開発', 'MEDIA': 'メディア', 'TOOLS': 'ツール', 
        'GAME': 'ゲーム'
    };
    return map[key] || '';
  };

  const isCompact = isCollapsed;

  return (
    <aside className="h-full w-full flex flex-col bg-white border-r-[3px] border-black relative z-20 overflow-visible">
      
      {/* Texture Overlay for the Sidebar Background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0" 
           style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>

      {/* Mobile Close Button - Square Sticker Style */}
      <button 
        onClick={onClose}
        className="md:hidden absolute top-3 right-3 z-[60] w-10 h-10 bg-black text-white border-2 border-white shadow-[3px_3px_0_#CCFF00] flex items-center justify-center active:scale-95 transition-all cursor-pointer"
        aria-label="Close"
      >
        <X size={24} strokeWidth={3} />
      </button>

      {/* Desktop Collapse Toggle - Tech Tab Style */}
      {onToggleCollapse && (
          <button 
            onClick={onToggleCollapse}
            className="
              hidden md:flex 
              absolute -right-8 top-1/2 -translate-y-1/2 
              w-8 h-20
              bg-black border-y-[3px] border-r-[3px] border-black text-cyber-lime
              items-center justify-center 
              z-[60] cursor-pointer
              hover:bg-cyber-lime hover:text-black hover:w-10 hover:shadow-[0_0_10px_#CCFF00]
              transition-all duration-100 ease-linear
              cyber-clip
            "
            title={isCompact ? "Expand" : "Collapse"}
          >
            {isCompact ? <ChevronRight size={24} strokeWidth={3} /> : <ChevronLeft size={24} strokeWidth={3} />}
          </button>
      )}

      {/* Scrollable Content */}
      <div className="flex-1 w-full overflow-y-auto scrollbar-hide flex flex-col overflow-x-hidden relative z-10 py-6">
        
        {/* Header Section */}
        <div className={`mb-8 transition-all duration-300 ${isCompact ? 'px-2 flex justify-center' : 'px-5'}`}>
            {isCompact ? (
                <div className="w-12 h-12 bg-black text-cyber-lime flex items-center justify-center border-2 border-white shadow-[3px_3px_0_#CCFF00]">
                    <span className="font-pixel font-bold text-2xl">M</span>
                </div>
            ) : (
                <div className="relative group select-none">
                    {/* Decorative Top Line */}
                    <div className="w-12 h-2 bg-black mb-1 skew-x-[-12deg]"></div>
                    <h2 className="font-apple text-5xl font-black text-black tracking-tighter leading-none italic transform -skew-x-6 relative z-10" style={{ textShadow: '2px 2px 0 #CCFF00' }}>
                      MENU
                    </h2>
                    {/* Cyber Decor */}
                    <div className="absolute top-0 -right-2 text-[10px] font-mono font-bold text-gray-300 transform rotate-90 origin-top-right">V.3.2</div>
                    
                    <div className="flex items-center justify-between mt-1 border-b-4 border-black pb-1">
                        <span className="font-mono text-[10px] font-bold tracking-[0.2em] bg-cyber-lime text-black px-1">SELECT_MODE</span>
                        <span className="font-apple text-xs font-bold text-gray-400">メニュー</span>
                    </div>
                </div>
            )}
        </div>
        
        {/* Navigation Links - Cyberpunk UI Style */}
        <nav className={`flex-1 space-y-3 ${isCompact ? 'px-2' : 'px-4'}`}>
            {CATEGORIES.map((cat, idx) => {
                const isActive = activeCategory === cat.id;
                const isGlitching = glitchingId === cat.id;
                
                return (
                    <button
                        key={cat.id}
                        onClick={() => triggerGlitch(cat.id, () => onSelectCategory(cat.id))}
                        className={`
                            relative w-full flex items-center transition-all duration-75 group cyber-clip
                            border-2 border-black
                            ${isCompact ? 'justify-center h-12' : 'h-14 pl-4 pr-2'}
                            
                            /* Normal State */
                            bg-white text-black
                            
                            /* Active State - Cyber Lime + Red Shadow */
                            ${isActive 
                                ? 'bg-cyber-lime border-black shadow-[4px_4px_0_#FF003C] translate-x-1 z-10' 
                                : 'hover:bg-black hover:text-cyber-lime hover:border-cyber-lime hover:shadow-[4px_4px_0_#00F0FF] hover:-translate-y-0.5'
                            }
                            
                            /* Glitch Animation */
                            ${isGlitching ? 'animate-cyber-glitch !border-transparent' : ''}
                        `}
                    >
                        {/* Decorative side bar for active items */}
                        {isActive && !isCompact && !isGlitching && (
                            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-black"></div>
                        )}

                        {/* Icon */}
                        <span className={`
                            text-xl transition-transform duration-300 relative z-10
                            ${isActive ? 'scale-110' : 'group-hover:scale-110'}
                            ${isCompact ? '' : 'mr-4'}
                            ${isGlitching ? 'text-black' : ''}
                        `}>
                            {cat.icon}
                        </span>

                        {/* Text Content */}
                        {!isCompact && (
                            <div className="flex flex-col items-start leading-none relative z-10 w-full overflow-hidden">
                                <span className={`
                                    font-apple font-black text-lg tracking-wide uppercase italic
                                    ${isActive ? 'text-black' : 'group-hover:text-cyber-lime'}
                                    ${isGlitching ? 'text-shadow-cyber' : ''}
                                `}>
                                    {t(`category.${cat.id}`)}
                                </span>
                                
                                <div className="flex items-center gap-2 mt-0.5 opacity-60">
                                    <span className={`text-[9px] font-mono font-bold ${isActive ? 'text-black' : 'group-hover:text-cyber-lime'}`}>
                                        0{idx + 1}
                                    </span>
                                    {/* Scanline decoration line */}
                                    <div className={`h-[1px] flex-1 ${isActive ? 'bg-black' : 'bg-gray-400 group-hover:bg-cyber-lime'}`}></div>
                                    <span className={`text-[8px] font-bold ${isActive ? 'text-black' : 'group-hover:text-cyber-lime'}`}>
                                        {getJPTitle(cat.id)}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Active Chevron */}
                        {isActive && !isCompact && !isGlitching && (
                            <div className="ml-auto text-black animate-pulse">
                                <ChevronRight size={20} strokeWidth={4} />
                            </div>
                        )}
                    </button>
                );
            })}
        </nav>

        {/* Widgets Section - Panel Style */}
        <div className={`mt-auto pt-6 pb-6 space-y-6 ${isCompact ? 'px-2' : 'px-4'}`}>
                
                {/* --- Game Widget --- */}
                {isCompact ? (
                    <div className="flex flex-col gap-3">
                         <button 
                            className={`w-full aspect-square border-[3px] border-black bg-neon-green hover:bg-black hover:text-cyber-lime hover:border-cyber-lime transition-colors flex items-center justify-center shadow-[3px_3px_0_#000] ${glitchingId === 'game-snake' ? 'animate-cyber-glitch' : ''}`}
                            onClick={() => !isCollapsed && triggerGlitch('game-snake', () => onOpenGame('snake'))}
                         >
                            <Gamepad2 size={24} />
                         </button>
                         <button 
                            onClick={(e) => { e.stopPropagation(); onTogglePetVisibility(); }}
                            className={`w-full aspect-square border-[3px] border-black flex items-center justify-center shadow-[3px_3px_0_#000] transition-colors ${isPetVisible ? 'bg-jinx-pink text-white' : 'bg-white text-gray-400'}`}
                        >
                            {isPetVisible ? <Eye size={24} /> : <EyeOff size={24} />}
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Arcade Panel */}
                        <div className="relative group">
                             {/* Panel Header */}
                             <div className="flex justify-between items-end mb-1 pl-1">
                                 <span className="font-pixel font-bold text-xs bg-black text-white px-2 py-0.5">ARCADE_SYS</span>
                                 <div className="flex gap-1">
                                    <div className="w-2 h-2 bg-cyber-red animate-pulse"></div>
                                    <div className="w-2 h-2 bg-cyber-lime"></div>
                                 </div>
                             </div>
                             
                             {/* Panel Body */}
                             <div className="border-[3px] border-black bg-white p-2 shadow-[4px_4px_0_#000] relative">
                                 {/* Decorative Corner */}
                                 <div className="absolute bottom-0 right-0 w-0 h-0 border-l-[12px] border-l-transparent border-b-[12px] border-b-black"></div>

                                 <div className="grid grid-cols-1 gap-2">
                                     {BUILT_IN_GAMES.map((game) => (
                                         <button
                                            key={game.id}
                                            onClick={() => triggerGlitch(`game-${game.id}`, () => onOpenGame(game.id))}
                                            className={`
                                                flex items-center gap-3 p-2 bg-gray-50 border-2 border-transparent hover:border-black hover:bg-cyber-lime transition-all group/game cyber-clip
                                                ${glitchingId === `game-${game.id}` ? 'animate-cyber-glitch' : ''}
                                            `}
                                         >
                                             <div className={`w-8 h-8 flex items-center justify-center border-2 border-black bg-white group-hover/game:scale-110 transition-transform`}>
                                                 <span className="text-lg">{game.icon}</span>
                                             </div>
                                             <div className="flex flex-col items-start">
                                                 <span className="font-black text-xs font-apple uppercase tracking-tight">{game.name}</span>
                                                 <span className="text-[9px] font-mono text-gray-500 group-hover/game:text-black">BOOT.EXE</span>
                                             </div>
                                             <PlayCircle size={14} className="ml-auto opacity-0 group-hover/game:opacity-100 transition-opacity" />
                                         </button>
                                     ))}
                                 </div>
                             </div>
                        </div>

                        {/* Pet Panel */}
                        <div className="relative">
                             {/* Panel Header */}
                             <div className="flex justify-between items-center mb-1 pl-1">
                                 <span className="font-pixel font-bold text-xs bg-jinx-pink text-white px-2 py-0.5">AI_COMPANION</span>
                                 <button 
                                    onClick={(e) => { e.stopPropagation(); onTogglePetVisibility(); }}
                                    className={`text-[10px] font-bold border border-black px-1.5 py-0.5 hover:bg-black hover:text-white transition-colors ${!isPetVisible ? 'line-through opacity-50' : ''}`}
                                 >
                                     {isPetVisible ? 'ON' : 'OFF'}
                                 </button>
                             </div>

                             {/* Panel Body */}
                             <div className={`
                                border-[3px] border-black bg-white p-3 shadow-[4px_4px_0_#000] 
                                flex justify-between items-center relative overflow-hidden
                                ${isPetVisible ? '' : 'grayscale opacity-60'}
                             `}>
                                 {/* Background diagonal lines */}
                                 <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 0, transparent 50%)', backgroundSize: '10px 10px' }}></div>
                                 
                                 {PET_SKINS.map((skin) => (
                                     <button
                                        key={skin.id}
                                        onClick={() => triggerGlitch(`pet-${skin.id}`, () => onSelectPet(skin.id))}
                                        className={`
                                            relative w-8 h-8 border-2 transition-all transform hover:-translate-y-1 z-10
                                            ${currentPetId === skin.id 
                                                ? 'border-black shadow-[2px_2px_0_#000] scale-110 ring-2 ring-cyber-lime' 
                                                : 'border-gray-300 opacity-60 hover:opacity-100 hover:border-black'
                                            }
                                            ${glitchingId === `pet-${skin.id}` ? 'animate-cyber-glitch' : ''}
                                        `}
                                        style={{ backgroundColor: skin.avatarColor }}
                                        title={skin.name}
                                     >
                                        {currentPetId === skin.id && (
                                            <div className="absolute -top-3 -right-3 text-black animate-bounce">
                                                <Zap size={14} fill="#CCFF00" />
                                            </div>
                                        )}
                                     </button>
                                 ))}
                             </div>
                        </div>
                    </>
                )}
        </div>
        
        {/* Footer info */}
        {!isCompact && (
            <div className="mt-4 px-6 opacity-40">
                <div className="h-0.5 w-full bg-black mb-1"></div>
                <div className="flex justify-between text-[9px] font-mono">
                    <span>SYS.VER.3.2</span>
                    <span>NIGHT_CITY</span>
                </div>
            </div>
        )}
      </div>

    </aside>
  );
};

export default Sidebar;