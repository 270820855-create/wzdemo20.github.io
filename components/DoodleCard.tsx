import React from 'react';
import { NavLink } from '../types';
import { Trash2, ExternalLink, Pencil } from 'lucide-react';
import { playSfx } from '../utils/audio';

interface DoodleCardProps {
  link: NavLink;
  onDelete: (id: string) => void;
  onEdit: (link: NavLink) => void;
  index: number;
  isHovered: boolean;
  isDimmed: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragOver?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragEnd?: (e: React.DragEvent<HTMLDivElement>) => void;
  isDragging?: boolean;
  onJump?: (link: NavLink) => void;
}

const DoodleCard: React.FC<DoodleCardProps> = ({ 
  link, 
  onDelete, 
  onEdit,
  index,
  isHovered,
  isDimmed,
  onMouseEnter,
  onMouseLeave,
  draggable,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  isDragging,
  onJump
}) => {
  
  const handleCardClick = () => {
    playSfx('click');
    if (onJump) {
        onJump(link);
    } else {
        window.open(link.url, '_blank');
    }
  };

  // Extract hostname
  const hostname = new URL(link.url).hostname.replace('www.', '');

  return (
    <div 
      onClick={handleCardClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      draggable={draggable}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
      className={`
        relative group p-4
        transition-all duration-300 cubic-bezier(0.34, 1.56, 0.64, 1)
        border-[3px] border-black rounded-lg
        flex flex-col h-[200px] w-full
        overflow-hidden select-none
        
        /* Default State: Transparent Background, Black Shadow */
        bg-transparent shadow-[4px_4px_0px_#000] transform scale-100 rotate-0

        /* Hover State: White Background, Bright Blue Highlight (Shadow), Pop up, Scale */
        hover:bg-white 
        hover:-translate-y-2
        hover:scale-[1.03]
        hover:shadow-[10px_10px_0px_#00E5FF]
        hover:border-black hover:rotate-1
        hover:z-10

        /* Drag Styles */
        ${isDragging ? 'opacity-30 border-dashed scale-95' : 'opacity-100'}
        ${isDimmed && !isDragging ? 'opacity-40 grayscale' : ''}
      `}
      style={{ 
        cursor: draggable ? (isDragging ? 'grabbing' : 'grab') : 'pointer'
      }}
    >
      {/* Category Tag - Anime Sticker Style */}
      <div className="absolute top-0 right-4 transform -translate-y-1/2 bg-black text-white px-3 py-1 z-20 shadow-[2px_2px_0_#CCFF00] rotate-2 group-hover:rotate-0 transition-transform">
         <span className="text-[10px] font-black tracking-widest uppercase">
           {link.category}
         </span>
      </div>

      {/* Index Number - Giant Background Watermark */}
      <div className={`
        absolute -bottom-4 -right-2 text-8xl font-black pointer-events-none select-none z-0 tracking-tighter italic
        transition-all duration-300
        text-stroke-1 opacity-10 group-hover:opacity-20 group-hover:scale-110 group-hover:text-jinx-blue group-hover:translate-x-2
      `}>
        {String(index + 1).padStart(2, '0')}
      </div>

      {/* Decorative corner accent - appears on hover */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t-[6px] border-l-[6px] border-jinx-blue rounded-tl-md z-10 opacity-0 group-hover:opacity-100 transition-opacity"></div>

      {/* Icon Section */}
      <div className="relative z-10 flex justify-start mb-4 mt-2">
        <div className={`
          w-12 h-12 flex items-center justify-center text-2xl
          ${link.color} text-black border-[3px] border-black
          shadow-[3px_3px_0px_rgba(0,0,0,1)] rounded-md
          transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6 group-hover:shadow-[4px_4px_0_#CCFF00]
        `}>
          {link.icon}
        </div>
      </div>
      
      {/* Content Section */}
      <div className="relative z-10 flex-1 flex flex-col">
        <h3 className="font-anime text-2xl font-black text-black leading-none line-clamp-2 mb-2 text-left transform group-hover:translate-x-1 transition-transform">
          {link.title}
        </h3>
        
        {/* URL */}
        <div className="flex items-center gap-2 text-gray-500 group-hover:text-black text-[10px] font-mono mt-auto transition-colors bg-white/50 group-hover:bg-neon-green/30 px-2 py-0.5 self-start border border-transparent group-hover:border-black rounded-sm">
            <ExternalLink size={10} /> 
            <span className="truncate max-w-[120px]">{hostname}</span>
        </div>
      </div>

      {/* Action Buttons - Slide in from right */}
      <div className={`
          absolute top-10 right-2 flex flex-col gap-2 z-30 transition-all duration-200
          ${isHovered && !isDragging ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0 pointer-events-none'}
      `}>
          <button 
              onClick={(e) => { e.stopPropagation(); onEdit(link); }}
              className="p-1.5 bg-white border-2 border-black hover:bg-black hover:text-white text-black shadow-[2px_2px_0_#000] active:translate-y-0.5 active:shadow-none transition-all"
              title="Edit"
          >
              <Pencil size={14} strokeWidth={3} />
          </button>
          <button 
              onClick={(e) => { e.stopPropagation(); onDelete(link.id); }}
              className="p-1.5 bg-white border-2 border-black hover:bg-jinx-pink hover:text-white text-black shadow-[2px_2px_0_#000] active:translate-y-0.5 active:shadow-none transition-all"
              title="Delete"
          >
              <Trash2 size={14} strokeWidth={3} />
          </button>
      </div>
    </div>
  );
};

export default DoodleCard;