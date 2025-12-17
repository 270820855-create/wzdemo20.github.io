import React, { useState, useEffect, useRef } from 'react';
import { X, Download, Upload, RotateCcw, Scaling, Globe, Loader2 } from 'lucide-react';
import { NavLink, Language } from '../types';
import { playSfx } from '../utils/audio';
import { useLanguage } from '../contexts/LanguageContext';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  links: NavLink[];
  onImport: (links: NavLink[]) => void;
  onReset: () => void;
  petScale: number;
  onScaleChange: (scale: number) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, 
  onClose, 
  links,
  onImport,
  onReset,
  petScale,
  onScaleChange
}) => {
  const { language, setLanguage, t } = useLanguage();
  const [shouldRender, setShouldRender] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  
  // Loading states
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Manage mount/unmount with animation delay
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setIsClosing(false);
    } else if (shouldRender) {
      // Start closing animation
      setIsClosing(true);
      // Wait for animation to finish before unmounting
      const timer = setTimeout(() => {
        setShouldRender(false);
        setIsClosing(false);
      }, 400); // Matches cloth-fold duration
      return () => clearTimeout(timer);
    }
  }, [isOpen, shouldRender]);

  const handleExport = () => {
    if (isExporting) return;
    playSfx('pop');
    setIsExporting(true);

    // Simulate a brief delay so the user sees the spinner/interaction
    setTimeout(() => {
        try {
            const dataStr = JSON.stringify(links, null, 2);
            const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
            const exportFileDefaultName = `unknown-dimension-data-${new Date().toISOString().slice(0,10)}.json`;

            const linkElement = document.createElement('a');
            linkElement.setAttribute('href', dataUri);
            linkElement.setAttribute('download', exportFileDefaultName);
            document.body.appendChild(linkElement);
            linkElement.click();
            document.body.removeChild(linkElement);
            
            playSfx('success');
        } catch (e) {
            console.error("Export failed", e);
            playSfx('delete');
        } finally {
            setIsExporting(false);
        }
    }, 800);
  };

  const handleImportClick = () => {
      playSfx('pop');
      if (fileInputRef.current) {
          fileInputRef.current.click();
      }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      setIsImporting(true);

      const reader = new FileReader();
      reader.onload = (e) => {
          setTimeout(() => { // Simulate processing delay
              try {
                  const content = e.target?.result as string;
                  const parsed = JSON.parse(content);
                  if (Array.isArray(parsed)) {
                      onImport(parsed);
                      playSfx('success');
                      // Close modal or just feedback? Keeping modal open usually better for settings
                  } else {
                      throw new Error("Invalid format");
                  }
              } catch (err) {
                  console.error("Import failed", err);
                  playSfx('delete');
                  alert("Failed to import: Invalid file format");
              } finally {
                  setIsImporting(false);
                  if (fileInputRef.current) fileInputRef.current.value = ''; // Reset input
              }
          }, 800);
      };
      reader.readAsText(file);
  };
  
  if (!shouldRender) return null;

  const languages: { code: Language; label: string }[] = [
    { code: 'zh-CN', label: '中文 (Chinese)' },
    { code: 'en-US', label: 'English' },
    { code: 'ja-JP', label: '日本語 (Japanese)' },
  ];

  return (
    <div className="fixed inset-0 z-[70] flex justify-end items-start pointer-events-none">
      {/* Backdrop - Transparent to keep background unchanged */}
      <div 
        className="absolute inset-0 pointer-events-auto"
        onClick={onClose}
      />
      
      {/* Modal - Cloth Animation */}
      <div 
        className={`
          relative mt-16 mr-4 md:mt-24 md:mr-8 w-full max-w-lg origin-top-right pointer-events-auto
          ${isClosing ? 'animate-cloth-fold' : 'animate-cloth-unfold'}
        `}
      >
        {/* Decorative Tape/Pin */}
        <div className="absolute -top-3 -right-2 z-20 transform rotate-12">
            <div className="w-24 h-6 bg-neon-green rough-border-sm opacity-80 shadow-sm border border-black/20"></div>
        </div>

        <div className="bg-white rough-border shadow-sketch-hover p-6 md:p-8 bg-scribble max-h-[80vh] overflow-y-auto border-[3px] border-black transform rotate-1">
          <div className="flex justify-between items-center mb-8 border-b-4 border-black pb-4">
            <h2 className="font-anime text-4xl text-black font-black">{t('settings.title')}</h2>
            <button 
                onClick={() => { onClose(); playSfx('click'); }} 
                className="bg-black text-white p-2 hover:bg-jinx-blue transition-colors rounded-full hover:rotate-90"
            >
                <X size={24} />
            </button>
          </div>
          
          <div className="space-y-6 font-anime">
              {/* Language Control */}
              <div className="border-[3px] border-black p-4 bg-white relative mt-2 shadow-[2px_2px_0_rgba(0,0,0,0.1)]">
                 <div className="absolute -top-3 left-4 bg-jinx-blue border-2 border-black px-2 text-sm font-bold -rotate-1 shadow-[2px_2px_0_#000]">
                   {t('settings.language')}
                 </div>
                 <div className="flex flex-col gap-2 mt-2">
                   {languages.map(lang => (
                     <button
                       key={lang.code}
                       onClick={() => { setLanguage(lang.code); playSfx('pop'); }}
                       className={`
                         flex items-center gap-4 p-3 border-2 border-black transition-all
                         ${language === lang.code ? 'bg-black text-white' : 'bg-white hover:bg-gray-100 hover:translate-x-1'}
                       `}
                     >
                       <Globe size={20} />
                       <span className="font-bold text-xl">{lang.label}</span>
                     </button>
                   ))}
                 </div>
              </div>

              {/* Pet Scale Control */}
              <div className="border-[3px] border-black p-4 bg-white relative mt-2 shadow-[2px_2px_0_rgba(0,0,0,0.1)]">
                 <div className="absolute -top-3 left-4 bg-neon-green border-2 border-black px-2 text-sm font-bold rotate-1 shadow-[2px_2px_0_#000]">
                   {t('settings.petSize')}
                 </div>
                 <div className="flex items-center gap-4 mt-4">
                   <Scaling size={28} strokeWidth={2.5} />
                   <input 
                      type="range" 
                      min="0.3" 
                      max="2.0" 
                      step="0.1"
                      value={petScale}
                      onChange={(e) => onScaleChange(parseFloat(e.target.value))}
                      className="w-full h-4 bg-gray-200 rounded-lg cursor-pointer border-2 border-black accent-jinx-pink"
                   />
                   <span className="font-bold text-2xl min-w-[3ch] text-right">{petScale.toFixed(1)}x</span>
                 </div>
              </div>

              <div className="grid gap-4 pt-2">
                  <button 
                      onClick={handleExport}
                      disabled={isExporting}
                      className={`
                          p-3 border-[3px] border-black bg-paper hover:bg-jinx-blue hover:text-white 
                          transition-all text-xl font-bold flex items-center justify-center gap-4 
                          shadow-[4px_4px_0_#000] active:translate-y-1 active:shadow-none
                          ${isExporting ? 'opacity-70 cursor-wait' : ''}
                      `}
                  >
                      {isExporting ? <Loader2 size={20} className="animate-spin" /> : <Download size={20} />} 
                      {isExporting ? 'EXPORTING...' : t('settings.export')}
                  </button>
                  
                  {/* Hidden File Input */}
                  <input 
                      type="file" 
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept=".json"
                      className="hidden"
                  />

                  <button 
                      onClick={handleImportClick}
                      disabled={isImporting}
                      className={`
                          p-3 border-[3px] border-black bg-paper hover:bg-neon-green hover:text-black 
                          transition-all text-xl font-bold flex items-center justify-center gap-4 
                          shadow-[4px_4px_0_#000] active:translate-y-1 active:shadow-none
                          ${isImporting ? 'opacity-70 cursor-wait' : ''}
                      `}
                  >
                      {isImporting ? <Loader2 size={20} className="animate-spin" /> : <Upload size={20} />} 
                      {isImporting ? 'IMPORTING...' : t('settings.import')}
                  </button>
                  
                  <button onClick={onReset} className="p-3 border-[3px] border-black bg-red-500 text-white hover:bg-black transition-all text-xl font-bold flex items-center justify-center gap-4 shadow-[4px_4px_0_#000] active:translate-y-1 active:shadow-none">
                      <RotateCcw size={20} /> {t('settings.reset')}
                  </button>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SettingsModal;