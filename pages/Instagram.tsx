import React, { useState, useMemo } from 'react';
import { useApp } from '../context';
import { InstaStatus, InstaFormat, InstaPost } from '../types';
import { LayoutGrid, Calendar as CalendarIcon, Plus, Instagram as InstaIcon, MoreHorizontal, ChevronLeft, ChevronRight, X, Save, Trash2, Link, Image, Upload } from 'lucide-react';

const PostCard: React.FC<{ post: InstaPost; onClick: (post: InstaPost) => void }> = ({ post, onClick }) => (
  <div onClick={() => onClick(post)} className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group hover:border-slate-300 dark:hover:border-slate-600 animate-scale-in">
    <div className="flex justify-between items-start mb-2">
      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300`}>
        {post.format}
      </span>
      <button className="text-slate-300 hover:text-slate-600 dark:hover:text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity">
          <MoreHorizontal size={16} />
      </button>
    </div>
    {post.imageUrl && (
      <div className="mb-3 rounded-md overflow-hidden h-32 bg-slate-100 dark:bg-slate-700 relative group-hover:opacity-90 transition-opacity">
           <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
           <div className="absolute top-2 right-2 bg-black/50 p-1 rounded text-white backdrop-blur-sm">
              <InstaIcon size={12} />
           </div>
      </div>
    )}
    <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-sm mb-1 line-clamp-2">{post.title}</h4>
    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">{post.description}</p>
    
    <div className="flex items-center justify-between pt-2 border-t border-slate-50 dark:border-slate-700">
      <span className="text-[10px] text-slate-400 dark:text-slate-500">{new Date(post.date).toLocaleDateString()}</span>
      <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center text-[10px] font-bold text-slate-600 dark:text-slate-300">
          {post.responsible.charAt(0)}
      </div>
    </div>
  </div>
);

export const InstagramManager: React.FC = () => {
  const { core, posts, addPost, updatePost, deletePost, user } = useApp();
  const [viewMode, setViewMode] = useState<'KANBAN' | 'CALENDAR'>('KANBAN');
  const [viewDate, setViewDate] = useState(new Date());
  
  // --- FORM STATE ---
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [format, setFormat] = useState<InstaFormat>(InstaFormat.FEED);
  const [type, setType] = useState<InstaPost['type']>('Institucional');
  const [status, setStatus] = useState<InstaStatus>(InstaStatus.IDEIA);
  const [responsible, setResponsible] = useState(user?.name || '');
  const [imageUrl, setImageUrl] = useState('');

  const corePosts = posts.filter(p => p.core === core);
  
  // Filter posts based on the selected viewDate (Month/Year)
  const filteredPosts = useMemo(() => {
    return corePosts.filter(p => {
        // Parse "YYYY-MM-DD" safely
        const [year, month] = p.date.split('-').map(Number);
        return year === viewDate.getFullYear() && (month - 1) === viewDate.getMonth();
    });
  }, [corePosts, viewDate]);

  const coreColor = core === 'MOTOS' ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400';
  const buttonClass = core === 'MOTOS' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700';
  const dashedBorderClass = core === 'MOTOS' ? 'border-red-200 hover:border-red-400 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20' : 'border-blue-200 hover:border-blue-400 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20';

  const columns = [
    { id: InstaStatus.IDEIA, title: 'Ideias / Briefing', color: 'bg-slate-100 dark:bg-slate-800/50' },
    { id: InstaStatus.CRIACAO, title: 'Em Criação', color: 'bg-blue-50 dark:bg-blue-900/20' },
    { id: InstaStatus.REVISAO, title: 'Revisão', color: 'bg-amber-50 dark:bg-amber-900/20' },
    { id: InstaStatus.APROVADO, title: 'Aprovado', color: 'bg-emerald-50 dark:bg-emerald-900/20' },
    { id: InstaStatus.PUBLICADO, title: 'Publicado', color: 'bg-purple-50 dark:bg-purple-900/20' },
  ];

  // --- HANDLERS ---
  const handleOpenForm = (post?: InstaPost) => {
      if (post) {
          setEditingId(post.id);
          setTitle(post.title);
          setDescription(post.description);
          setDate(post.date);
          setFormat(post.format);
          setType(post.type);
          setStatus(post.status);
          setResponsible(post.responsible);
          setImageUrl(post.imageUrl || '');
      } else {
          setEditingId(null);
          setTitle('');
          setDescription('');
          // Default date to current viewDate to ensure it appears in the current Kanban view
          const year = viewDate.getFullYear();
          const month = String(viewDate.getMonth() + 1).padStart(2, '0');
          const day = String(new Date().getDate()).padStart(2, '0');
          setDate(`${year}-${month}-${day}`);
          
          setFormat(InstaFormat.FEED);
          setType('Institucional');
          setStatus(InstaStatus.IDEIA);
          setResponsible(user?.name || '');
          setImageUrl('');
      }
      setIsFormOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      
      const payload: InstaPost = {
          id: editingId || Date.now().toString(),
          core,
          title,
          description,
          date,
          format,
          type,
          status,
          responsible,
          imageUrl: imageUrl || undefined
      };

      if (editingId) {
          updatePost(payload);
      } else {
          addPost(payload);
      }
      setIsFormOpen(false);
  };

  const handleDelete = () => {
      if (editingId && window.confirm('Tem certeza que deseja excluir este post?')) {
          deletePost(editingId);
          setIsFormOpen(false);
      }
  };

  // --- CALENDAR LOGIC ---
  const calendarData = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const days = [];
    
    for (let i = firstDay - 1; i >= 0; i--) {
        const d = new Date(year, month - 1, daysInPrevMonth - i);
        days.push({ date: d, day: daysInPrevMonth - i, isCurrentMonth: false, dateStr: d.toISOString().split('T')[0] });
    }
    for (let i = 1; i <= daysInMonth; i++) {
        const d = new Date(year, month, i);
        days.push({ date: d, day: i, isCurrentMonth: true, dateStr: d.toISOString().split('T')[0] });
    }
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
        const d = new Date(year, month + 1, i);
        days.push({ date: d, day: i, isCurrentMonth: false, dateStr: d.toISOString().split('T')[0] });
    }
    return days;
  }, [viewDate]);

  const goToPrevMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  const goToNextMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  const goToToday = () => setViewDate(new Date());

  const monthName = viewDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
  const capitalizedMonthName = monthName.charAt(0).toUpperCase() + monthName.slice(1);

  const getFormatColor = (format: InstaFormat) => {
      switch(format) {
          case InstaFormat.REELS: return 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300';
          case InstaFormat.STORIES: return 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300';
          default: return 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300';
      }
  };

  const MonthNavigation = () => (
    <div className="flex items-center gap-2 bg-white dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600 p-1">
        <button onClick={goToPrevMonth} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-600 rounded text-slate-600 dark:text-slate-300 transition-colors">
            <ChevronLeft size={18} />
        </button>
        <button onClick={goToToday} className="px-3 py-1 text-xs font-bold uppercase hover:bg-slate-100 dark:hover:bg-slate-600 rounded text-slate-600 dark:text-slate-300 transition-colors">
            Hoje
        </button>
        <button onClick={goToNextMonth} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-600 rounded text-slate-600 dark:text-slate-300 transition-colors">
            <ChevronRight size={18} />
        </button>
    </div>
  );

  return (
    <div className="space-y-6 h-[calc(100vh-140px)] flex flex-col relative">
      <div className="flex justify-between items-center shrink-0">
        <div>
           <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2 animate-fade-in">
             <InstaIcon className={coreColor} />
             Gestão de Instagram
           </h1>
        </div>
        <div className="flex gap-3">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-1 flex">
             <button 
                onClick={() => setViewMode('KANBAN')}
                className={`p-2 rounded flex items-center gap-2 text-sm font-medium transition-all ${viewMode === 'KANBAN' ? 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}
             >
                <LayoutGrid size={18} />
                <span className="hidden md:inline">Kanban</span>
             </button>
             <button 
                onClick={() => setViewMode('CALENDAR')}
                className={`p-2 rounded flex items-center gap-2 text-sm font-medium transition-all ${viewMode === 'CALENDAR' ? 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}
             >
                <CalendarIcon size={18} />
                <span className="hidden md:inline">Calendário</span>
             </button>
          </div>
          <button 
            onClick={() => handleOpenForm()}
            className={`flex items-center gap-2 px-4 py-2 text-white rounded-lg shadow-sm transition-all hover:scale-105 active:scale-95 ${buttonClass}`}
          >
            <Plus size={18} />
            Novo Post
          </button>
        </div>
      </div>

      {/* Kanban View */}
      {viewMode === 'KANBAN' && (
          <div className="flex flex-col h-full overflow-hidden animate-slide-up">
             {/* Kanban Header (Month Navigation) */}
             <div className="flex items-center justify-between mb-4 bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm shrink-0">
                <div className="flex items-center gap-2">
                    <CalendarIcon size={20} className={core === 'MOTOS' ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'} />
                    <h2 className="text-lg font-bold text-slate-800 dark:text-white">{capitalizedMonthName}</h2>
                </div>
                <MonthNavigation />
             </div>

             <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
                <div className="flex gap-6 h-full min-w-full">
                    {columns.map((col, idx) => (
                        <div key={col.id} className={`min-w-[280px] w-full max-w-sm flex flex-col h-full animate-slide-up`} style={{ animationDelay: `${idx * 100}ms` }}>
                            <div className={`p-3 rounded-t-lg font-semibold text-sm text-slate-700 dark:text-slate-200 flex justify-between items-center border-b-2 border-slate-200 dark:border-slate-600 ${col.color}`}>
                                {col.title}
                                <span className="bg-white/50 dark:bg-black/20 px-2 py-0.5 rounded text-xs transition-transform hover:scale-110">{filteredPosts.filter(p => p.status === col.id).length}</span>
                            </div>
                            <div className="bg-slate-50/50 dark:bg-slate-900/50 flex-1 rounded-b-lg border border-slate-200 dark:border-slate-700 p-3 space-y-3 overflow-y-auto">
                                {filteredPosts.filter(p => p.status === col.id).map(post => (
                                    <PostCard key={post.id} post={post} onClick={handleOpenForm} />
                                ))}
                                <button 
                                    onClick={() => {
                                        handleOpenForm();
                                        setStatus(col.id);
                                    }}
                                    className="w-full py-2 border-2 border-dashed border-slate-200 dark:border-slate-600 rounded-lg text-slate-400 dark:text-slate-500 text-xs font-semibold hover:border-slate-300 dark:hover:border-slate-500 hover:text-slate-500 dark:hover:text-slate-400 hover:bg-white dark:hover:bg-slate-800 transition-all"
                                >
                                    + Adicionar Card
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
             </div>
          </div>
      )}

      {/* Calendar View */}
      {viewMode === 'CALENDAR' && (
          <div className="flex-1 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col animate-slide-up">
              {/* Calendar Header */}
              <div className="p-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <CalendarIcon size={20} className={core === 'MOTOS' ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'} />
                    {capitalizedMonthName}
                </h2>
                <MonthNavigation />
              </div>

              {/* Days Header */}
              <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 shrink-0">
                {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                    <div key={day} className="py-3 text-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                    {day}
                    </div>
                ))}
              </div>

              {/* Days Grid */}
              <div className="grid grid-cols-7 auto-rows-fr flex-1 overflow-y-auto">
                {calendarData.map((cell, i) => {
                    const dayPosts = filteredPosts.filter(p => p.date === cell.dateStr);
                    const isToday = new Date().toISOString().split('T')[0] === cell.dateStr;

                    return (
                        <div key={i} className={`min-h-[100px] border-b border-r border-slate-100 dark:border-slate-700 p-2 relative transition-colors ${!cell.isCurrentMonth ? 'bg-slate-50/40 dark:bg-slate-800/40 text-slate-300 dark:text-slate-600' : 'bg-white dark:bg-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-700/50'}`}>
                            <div className="flex justify-between items-start mb-1">
                                <span className={`text-sm font-medium w-6 h-6 flex items-center justify-center rounded-full transition-transform hover:scale-110 
                                    ${isToday 
                                        ? (core === 'MOTOS' ? 'bg-red-600 text-white' : 'bg-blue-600 text-white') 
                                        : (cell.isCurrentMonth ? 'text-slate-700 dark:text-slate-300' : 'text-slate-300 dark:text-slate-600')
                                    }`}>
                                    {cell.day}
                                </span>
                            </div>
                            
                            <div className="space-y-1">
                                {dayPosts.map(post => (
                                    <div 
                                        key={post.id} 
                                        onClick={() => handleOpenForm(post)}
                                        className="group relative p-1.5 rounded border border-slate-100 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-sm hover:shadow-md transition-all cursor-pointer hover:scale-[1.02]"
                                    >
                                        <div className="flex items-center gap-1.5 mb-1">
                                            <span className={`text-[9px] font-bold px-1 rounded uppercase ${getFormatColor(post.format)}`}>
                                                {post.format === InstaFormat.STORIES ? 'St' : post.format === InstaFormat.REELS ? 'Re' : 'Fd'}
                                            </span>
                                            <p className="text-[10px] font-medium text-slate-700 dark:text-slate-200 truncate">{post.title}</p>
                                        </div>
                                        <div className={`h-1 w-full rounded-full ${
                                            post.status === InstaStatus.PUBLICADO ? 'bg-purple-400' :
                                            post.status === InstaStatus.APROVADO ? 'bg-green-400' :
                                            'bg-slate-200 dark:bg-slate-500'
                                        }`}></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
              </div>
          </div>
      )}

      {/* --- CREATE/EDIT MODAL --- */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
             <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto flex flex-col animate-scale-in border border-slate-200 dark:border-slate-700">
                 {/* Header */}
                 <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-700 sticky top-0 bg-white dark:bg-slate-800 z-10">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                            {editingId ? 'Editar Post' : 'Novo Post'}
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            {editingId ? 'Alterar detalhes ou mover card' : 'Planejar nova publicação'} para <span className={`font-bold ${core === 'MOTOS' ? 'text-red-600' : 'text-blue-600'}`}>{core}</span>
                        </p>
                    </div>
                    <button 
                        onClick={() => setIsFormOpen(false)}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Form Body */}
                <div className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Título / Ideia Principal</label>
                                <input 
                                    required
                                    type="text" 
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    placeholder="Ex: Reels Lançamento Sahara"
                                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Data de Publicação</label>
                                <input 
                                    required
                                    type="date" 
                                    value={date}
                                    onChange={e => setDate(e.target.value)}
                                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                                />
                            </div>

                             <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status (Coluna)</label>
                                <select 
                                    value={status}
                                    onChange={e => setStatus(e.target.value as InstaStatus)}
                                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                                >
                                    {Object.values(InstaStatus).map(s => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Formato</label>
                                <select 
                                    value={format}
                                    onChange={e => setFormat(e.target.value as InstaFormat)}
                                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                                >
                                    {Object.values(InstaFormat).map(f => (
                                        <option key={f} value={f}>{f}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tipo de Conteúdo</label>
                                <select 
                                    value={type}
                                    onChange={e => setType(e.target.value as any)}
                                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                                >
                                    <option value="Institucional">Institucional</option>
                                    <option value="Oferta">Oferta</option>
                                    <option value="Evento">Evento</option>
                                    <option value="Engajamento">Engajamento</option>
                                    <option value="Bastidores">Bastidores</option>
                                </select>
                            </div>

                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Mídia do Post (Imagem/Vídeo)</label>
                                <div className="space-y-3">
                                    {/* Upload Area */}
                                    <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-slate-50 dark:bg-slate-700/50 transition-colors ${dashedBorderClass}`}>
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <Upload className="w-8 h-8 mb-2 text-slate-400" />
                                            <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold">Clique para enviar do PC</p>
                                            <p className="text-xs text-slate-400 dark:text-slate-500">PNG, JPG ou GIF</p>
                                        </div>
                                        <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                    </label>

                                    {/* URL Fallback */}
                                    <div className="flex gap-2 items-center">
                                        <span className="text-xs text-slate-400 uppercase font-bold">Ou URL externa</span>
                                        <div className="relative flex-1">
                                            <Link className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                            <input 
                                                type="text" 
                                                value={imageUrl}
                                                onChange={e => setImageUrl(e.target.value)}
                                                placeholder="https://exemplo.com/imagem.jpg"
                                                className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white text-sm"
                                            />
                                        </div>
                                    </div>

                                    {/* Preview */}
                                    {imageUrl && (
                                        <div className="mt-2 w-full h-48 rounded-lg border border-slate-200 dark:border-slate-600 overflow-hidden bg-slate-100 dark:bg-slate-900 relative group animate-fade-in">
                                            <img src={imageUrl} alt="Preview" className="w-full h-full object-contain" />
                                            <button 
                                                type="button"
                                                onClick={() => setImageUrl('')}
                                                className="absolute top-2 right-2 bg-black/60 text-white p-1.5 rounded-full hover:bg-black/80 transition-colors"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                             <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Responsável</label>
                                <input 
                                    required
                                    type="text" 
                                    value={responsible}
                                    onChange={e => setResponsible(e.target.value)}
                                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                                />
                            </div>

                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Descrição / Legenda</label>
                                <textarea 
                                    rows={4}
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                    placeholder="Escreva o briefing ou a legenda do post..."
                                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                                />
                            </div>
                        </div>

                         <div className="flex justify-between pt-6 border-t border-slate-100 dark:border-slate-700">
                            <div>
                                {editingId && (
                                    <button
                                        type="button"
                                        onClick={handleDelete}
                                        className="px-4 py-2 text-red-600 font-medium hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex items-center gap-2"
                                    >
                                        <Trash2 size={18} />
                                        Excluir
                                    </button>
                                )}
                            </div>
                            <div className="flex gap-4">
                                <button 
                                    type="button" 
                                    onClick={() => setIsFormOpen(false)}
                                    className="px-6 py-2 text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button 
                                    type="submit" 
                                    className={`flex items-center gap-2 px-6 py-2 text-white font-bold rounded-lg shadow-sm transition-colors ${buttonClass}`}
                                >
                                    <Save size={18} />
                                    {editingId ? 'Salvar Alterações' : 'Criar Post'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
             </div>
        </div>
      )}
    </div>
  );
};