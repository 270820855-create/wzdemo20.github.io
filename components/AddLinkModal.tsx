import React, { useState, useEffect } from 'react';
import { NavLink, Category } from '../types';
import { X } from 'lucide-react';
import { COLORS, CATEGORIES } from '../constants';
import { playSfx } from '../utils/audio';
import { useLanguage } from '../contexts/LanguageContext';

interface AddLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (link: Omit<NavLink, 'id'>) => void;
  linkToEdit?: NavLink | null;
}

const AddLinkModal: React.FC<AddLinkModalProps> = ({ isOpen, onClose, onSave, linkToEdit }) => {
  const { t } = useLanguage();
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [icon, setIcon] = useState('🔗');
  const [color, setColor] = useState(COLORS[0]);
  const [category, setCategory] = useState<Category>('TOOLS');

  // Load data if editing, otherwise reset
  useEffect(() => {
    if (isOpen) {
        if (linkToEdit) {
            setTitle(linkToEdit.title);
            setUrl(linkToEdit.url);
            setIcon(linkToEdit.icon || '🔗');
            setColor(linkToEdit.color);
            setCategory(linkToEdit.category);
        } else {
            // Reset for new entry
            setTitle('');
            setUrl('');
            setIcon('🔗');
            setColor(COLORS[0]);
            setCategory('TOOLS');
        }
    }
  }, [isOpen, linkToEdit]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !url) return;
    let formattedUrl = url;
    if (!/^https?:\/\//i.test(url) && !/^http?:\/\//i.test(url)) formattedUrl = `https://${url}`;
    
    onSave({ title, url: formattedUrl, icon, color, category });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
      <div className="bg-white rough-border w-full max-w-lg shadow-sketch-hover relative animate-pop p-8 bg-scribble">
        <button onClick={() => { onClose(); playSfx('click'); }} className="absolute -top-4 -right-4 bg-jinx-pink border-2 border-black p-2 text-white hover:rotate-90 transition-transform shadow-[3px_3px_0_#000] rounded-full"><X size={24} /></button>
        
        <h2 className="font-anime text-4xl md:text-5xl text-black mb-6 text-center" style={{ textShadow: '3px 3px 0 #CCFF00' }}>
          {linkToEdit ? t('modal.title').replace('Title', 'Edit') : t('modal.newLink')}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4 font-anime text-lg">
          <div>
            <label className="block mb-1 font-black bg-black text-white inline-block px-2 transform -rotate-2 text-sm">{t('modal.title')}</label>
            <input required value={title} onChange={e => setTitle(e.target.value)} className="w-full border-[3px] border-black p-2 bg-white focus:shadow-[4px_4px_0_#00E5FF] outline-none" placeholder="Site Name" />
          </div>
          
          <div>
            <label className="block mb-1 font-black bg-black text-white inline-block px-2 transform rotate-1 text-sm">{t('modal.url')}</label>
            <input required value={url} onChange={e => setUrl(e.target.value)} className="w-full border-[3px] border-black p-2 bg-white focus:shadow-[4px_4px_0_#00E5FF] outline-none" placeholder="https://..." />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block mb-1 font-black text-sm">CATEGORY</label>
                <select 
                    value={category} 
                    onChange={e => setCategory(e.target.value as Category)}
                    className="w-full border-[3px] border-black p-2 bg-white outline-none"
                >
                    {CATEGORIES.filter(c => c.id !== 'ALL').map(c => (
                        <option key={c.id} value={c.id}>{c.id}</option>
                    ))}
                </select>
             </div>
             <div>
                <label className="block mb-1 font-black text-sm">{t('modal.icon')}</label>
                <input value={icon} onChange={e => setIcon(e.target.value)} className="w-full border-[3px] border-black p-2 text-center" maxLength={2} />
             </div>
          </div>

          <div>
             <label className="block mb-2 font-black text-sm">{t('modal.color')}</label>
             <div className="flex gap-2 justify-center flex-wrap">
               {COLORS.map(c => (
                 <button key={c} type="button" onClick={() => { setColor(c); playSfx('pop'); }} className={`w-8 h-8 rounded-full border-2 border-black ${c} ${color === c ? 'ring-2 ring-black ring-offset-2' : ''}`} />
               ))}
             </div>
          </div>

          <button type="submit" className="w-full mt-4 bg-neon-green text-black font-black text-2xl py-3 border-[3px] border-black hover:bg-black hover:text-neon-green transition-all shadow-[5px_5px_0_#000] active:translate-y-1 active:shadow-none rough-border-sm">
            {linkToEdit ? 'SAVE CHANGES' : t('modal.create')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddLinkModal;