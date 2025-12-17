import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { SEARCH_ENGINES } from '../constants';
import { playSfx } from '../utils/audio';
import { useLanguage } from '../contexts/LanguageContext';

interface SearchBarProps {
  onSearchChange?: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearchChange }) => {
  const { t } = useLanguage();
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [activeEngine, setActiveEngine] = useState(() => SEARCH_ENGINES.find(e => e.id === 'baidu') || SEARCH_ENGINES[0]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (onSearchChange) {
      onSearchChange(val);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      playSfx('click');
      window.open(`${activeEngine.url}${encodeURIComponent(query)}`, '_blank');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto relative z-20 px-0 flex flex-col items-center">
      
      {/* Engine Tabs - Pills above bar centered */}
      <div className="flex gap-4 mb-0 z-10">
        {SEARCH_ENGINES.map((engine) => (
          <button
            key={engine.id}
            onClick={() => { setActiveEngine(engine); playSfx('pop'); }}
            className={`
              w-12 h-8 flex items-center justify-center font-anime font-black text-sm border-2 border-black rounded-full transition-all shadow-[2px_2px_0_#000]
              ${activeEngine.id === engine.id 
                ? 'bg-jinx-pink text-white -translate-y-1 shadow-[4px_4px_0_#000]' 
                : 'bg-white text-black hover:bg-gray-100'
              }
            `}
          >
            {engine.name}
          </button>
        ))}
      </div>

      <form onSubmit={handleSearch} className="relative w-full z-20 mt-4">
        <div 
          className={`
            flex items-stretch bg-white border-[3px] border-black rounded-lg
            transition-all duration-300 h-14
            ${isFocused ? 'translate-y-[-2px]' : ''}
          `}
          style={{
             boxShadow: isFocused 
               ? `8px 8px 0px ${activeEngine.color}` 
               : `6px 6px 0px ${activeEngine.color}`
          }}
        >
          {/* Input Section (80%) */}
          <div className="flex-1 flex items-center px-4">
             <Search className="text-black w-6 h-6 mr-3 opacity-50" strokeWidth={3} />
             <input
                type="text"
                value={query}
                onChange={handleInputChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder={t('search.placeholder', { engine: activeEngine.name })}
                className="w-full text-xl font-anime font-bold bg-transparent outline-none placeholder-gray-300 text-black tracking-wide"
             />
          </div>
          
          {/* Button Section (20%) */}
          <button 
            type="submit"
            onClick={() => playSfx('click')}
            className="
              w-32 border-l-[3px] border-black bg-neon-green 
              flex items-center justify-center
              hover:bg-jinx-pink hover:text-white transition-colors rounded-r-md
            "
          >
            <span className="font-anime font-black text-xl italic tracking-wider">{t('search.go')}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;