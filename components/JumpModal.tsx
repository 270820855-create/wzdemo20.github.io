import React from 'react';
import { NavLink } from '../types';
import { AlertTriangle, ExternalLink, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { playSfx } from '../utils/audio';

interface JumpModalProps {
  link: NavLink | null;
  onClose: () => void;
  onConfirm: () => void;
}

const JumpModal: React.FC<JumpModalProps> = ({ link, onClose, onConfirm }) => {
  const { t } = useLanguage();
  if (!link) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
       {/* Modal Container */}
       <div className="bg-white border-[3px] border-black w-full max-w-md relative p-6 shadow-[8px_8px_0_#FF0055] animate-pop flex flex-col items-center text-center overflow-hidden">
          
          {/* Hazard Stripes Background Effect (Top Bar) */}
          <div className="absolute top-0 left-0 w-full h-4 bg-[length:20px_20px] bg-repeat-x opacity-80" 
               style={{ backgroundImage: 'linear-gradient(45deg, #FACC15 25%, #000 25%, #000 50%, #FACC15 50%, #FACC15 75%, #000 75%, #000 100%)' }}>
          </div>
          
          <button 
            onClick={() => { playSfx('click'); onClose(); }} 
            className="absolute top-6 right-4 p-1 hover:bg-black hover:text-white transition-colors border-2 border-transparent hover:border-black rounded"
          >
             <X size={24} />
          </button>

          <div className="mt-6 mb-4 text-jinx-pink animate-pulse">
             <AlertTriangle size={64} strokeWidth={2.5} />
          </div>

          <h2 className="font-pixel font-bold text-2xl md:text-3xl mb-2 uppercase tracking-tighter leading-tight text-black">
             {t('jump.title')}
          </h2>
          
          {/* Destination Card */}
          <div className="w-full bg-gray-100 border-2 border-black p-4 mb-6 relative group hover:bg-white transition-colors">
              <div className="text-xs font-black bg-black text-white absolute -top-2 left-2 px-2 rotate-1 shadow-[2px_2px_0_#FF0055]">
                 {t('jump.destination')}
              </div>
              <div className="font-anime text-xl font-black mb-1 truncate text-black">{link.title}</div>
              <div className="font-mono text-xs text-gray-500 flex items-center justify-center gap-1 truncate border-t border-dashed border-gray-300 pt-2 mt-2">
                 <ExternalLink size={10} /> {link.url}
              </div>
          </div>

          <div className="flex w-full gap-4 font-anime font-black text-xl">
              <button 
                 onClick={() => { playSfx('click'); onClose(); }}
                 className="flex-1 py-3 border-[3px] border-black bg-white hover:bg-gray-200 transition-transform active:scale-95 shadow-[4px_4px_0_#000]"
              >
                 {t('jump.cancel')}
              </button>
              <button 
                 onClick={() => { playSfx('pop'); onConfirm(); }}
                 className="flex-1 py-3 border-[3px] border-black bg-neon-green hover:bg-jinx-pink hover:text-white transition-all active:scale-95 shadow-[4px_4px_0_#000] hover:shadow-[6px_6px_0_#000] group"
              >
                 <span className="group-hover:hidden">{t('jump.confirm')}</span>
                 <span className="hidden group-hover:inline">WARP &gt;&gt;</span>
              </button>
          </div>
       </div>
    </div>
  );
};
export default JumpModal;