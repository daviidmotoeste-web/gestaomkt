import React, { useState, useMemo } from 'react';
import { useApp } from '../context';
import { Plus, Filter, Calendar as CalendarIcon, MapPin, Clock, ChevronLeft, ChevronRight, Save, Trash2, X, ChevronDown } from 'lucide-react';
import { MarketingEvent, Area, Status } from '../types';

export const Events: React.FC = () => {
  const { core, events, addEvent, updateEvent, deleteEvent, user } = useApp();
  const [viewDate, setViewDate] = useState(new Date());
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Filter State
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterType, setFilterType] = useState('Todos');
  const [filterArea, setFilterArea] = useState('Todas');
  const [filterStatus, setFilterStatus] = useState('Todos');

  // Date Picker State
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  
  // Form State
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<MarketingEvent['type']>('Ação');
  const [newArea, setNewArea] = useState<Area>(Area.VENDAS);
  const [newStartDate, setNewStartDate] = useState('');
  const [newEndDate, setNewEndDate] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newResponsible, setNewResponsible] = useState(user?.name || '');

  const coreEvents = events.filter(e => e.core === core);

  // Apply filters
  const filteredEvents = useMemo(() => {
      return coreEvents.filter(e => {
          const matchType = filterType === 'Todos' || e.type === filterType;
          const matchArea = filterArea === 'Todas' || e.area === filterArea;
          const matchStatus = filterStatus === 'Todos' || e.status === filterStatus;
          return matchType && matchArea && matchStatus;
      });
  }, [coreEvents, filterType, filterArea, filterStatus]);

  const buttonClass = core === 'MOTOS' 
    ? 'bg-red-600 hover:bg-red-700' 
    : 'bg-blue-600 hover:bg-blue-700';
  
  const textClass = core === 'MOTOS' ? 'text-red-600' : 'text-blue-600';

  const badgeClass = (area: string) => {
    switch (area) {
        case 'Vendas': return 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400';
        case 'Pós-venda': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-400';
        default: return 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300';
    }
  };

  // Calendar Logic
  const calendarData = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    
    // First day of current month (0-6)
    const firstDay = new Date(year, month, 1).getDay();
    // Days in current month
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    // Days in previous month
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const days = [];
    
    // Previous Month Padding
    for (let i = firstDay - 1; i >= 0; i--) {
        const d = new Date(year, month - 1, daysInPrevMonth - i);
        days.push({
            date: d,
            day: daysInPrevMonth - i,
            isCurrentMonth: false,
            dateStr: d.toISOString().split('T')[0]
        });
    }

    // Current Month
    for (let i = 1; i <= daysInMonth; i++) {
        const d = new Date(year, month, i);
        days.push({
            date: d,
            day: i,
            isCurrentMonth: true,
            dateStr: d.toISOString().split('T')[0]
        });
    }

    // Next Month Padding (fill up to 42 cells for 6 rows)
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
        const d = new Date(year, month + 1, i);
        days.push({
            date: d,
            day: i,
            isCurrentMonth: false,
            dateStr: d.toISOString().split('T')[0]
        });
    }

    return days;
  }, [viewDate]);

  const goToPrevMonth = () => {
      setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
      setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
      setViewDate(new Date());
  };

  // Date Picker Logic
  const monthsList = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const changeMonth = (monthIndex: number) => {
      setViewDate(new Date(viewDate.getFullYear(), monthIndex, 1));
      setIsDatePickerOpen(false);
  };

  const changeYear = (increment: number) => {
      setViewDate(new Date(viewDate.getFullYear() + increment, viewDate.getMonth(), 1));
  };

  const handleOpenForm = (event?: MarketingEvent) => {
    if (event) {
        // Edit Mode
        setEditingId(event.id);
        setNewTitle(event.title);
        setNewType(event.type);
        setNewArea(event.area);
        setNewStartDate(event.startDate);
        setNewEndDate(event.endDate);
        setNewDesc(event.description);
        setNewResponsible(event.responsible);
    } else {
        // Create Mode
        setEditingId(null);
        setNewTitle('');
        setNewType('Ação');
        setNewArea(Area.VENDAS);
        setNewStartDate('');
        setNewEndDate('');
        setNewDesc('');
        setNewResponsible(user?.name || '');
    }
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
        // Update Existing
        const updatedEvent: MarketingEvent = {
            id: editingId,
            core: core,
            title: newTitle,
            type: newType,
            area: newArea,
            startDate: newStartDate,
            endDate: newEndDate || newStartDate,
            description: newDesc,
            status: Status.PLANEJADO,
            responsible: newResponsible
        };
        updateEvent(updatedEvent);
        alert('Ação atualizada com sucesso!');
    } else {
        // Create New
        const newEvent: MarketingEvent = {
            id: Date.now().toString(),
            core: core,
            title: newTitle,
            type: newType,
            area: newArea,
            startDate: newStartDate,
            endDate: newEndDate || newStartDate,
            description: newDesc,
            status: Status.PLANEJADO,
            responsible: newResponsible
        };
        addEvent(newEvent);
        alert('Ação criada com sucesso!');
    }

    setIsFormOpen(false);
  };

  const handleDelete = () => {
      if (editingId && window.confirm('Tem certeza que deseja excluir esta ação?')) {
          deleteEvent(editingId);
          setIsFormOpen(false);
      }
  };

  const handleClearFilters = () => {
      setFilterType('Todos');
      setFilterArea('Todas');
      setFilterStatus('Todos');
      setIsFilterOpen(false);
  };

  const monthName = viewDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
  const capitalizedMonthName = monthName.charAt(0).toUpperCase() + monthName.slice(1);

  // Filter events for the currently visible list view (current month events only)
  const currentMonthEvents = filteredEvents.filter(e => {
    const d = new Date(e.startDate);
    return d.getMonth() === viewDate.getMonth() && d.getFullYear() === viewDate.getFullYear();
  }).sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

  const hasActiveFilters = filterType !== 'Todos' || filterArea !== 'Todas' || filterStatus !== 'Todos';

  return (
    <div className="space-y-6 relative">
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Calendário de Ações</h1>
          <p className="text-slate-500 dark:text-slate-400">Gestão de eventos, lançamentos e ações de vendas.</p>
        </div>
        <div className="flex gap-3 relative">
          <div className="relative">
            <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 font-medium transition-colors ${isFilterOpen || hasActiveFilters ? 'ring-2 ring-slate-200 dark:ring-slate-600 bg-slate-50 dark:bg-slate-700' : ''}`}
            >
                <Filter size={18} />
                Filtrar
                {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-red-500 absolute top-2 right-2"></span>}
            </button>

            {/* Filter Dropdown */}
            {isFilterOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 z-30 p-4 animate-scale-in">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-slate-700 dark:text-white text-sm">Filtros</h3>
                        {hasActiveFilters && (
                            <button onClick={handleClearFilters} className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium">
                                Limpar
                            </button>
                        )}
                    </div>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Tipo</label>
                            <select 
                                value={filterType} 
                                onChange={e => setFilterType(e.target.value)} 
                                className="w-full text-sm border border-slate-200 dark:border-slate-600 rounded-lg p-2 bg-white dark:bg-slate-700 text-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            >
                                <option value="Todos">Todos</option>
                                <option value="Ação">Ação</option>
                                <option value="Evento">Evento</option>
                                <option value="Campanha">Campanha</option>
                                <option value="Lançamento">Lançamento</option>
                                <option value="Live">Live</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Área</label>
                            <select 
                                value={filterArea} 
                                onChange={e => setFilterArea(e.target.value)} 
                                className="w-full text-sm border border-slate-200 dark:border-slate-600 rounded-lg p-2 bg-white dark:bg-slate-700 text-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            >
                                <option value="Todas">Todas</option>
                                {Object.values(Area).map(a => <option key={a} value={a}>{a}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Status</label>
                            <select 
                                value={filterStatus} 
                                onChange={e => setFilterStatus(e.target.value)} 
                                className="w-full text-sm border border-slate-200 dark:border-slate-600 rounded-lg p-2 bg-white dark:bg-slate-700 text-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            >
                                <option value="Todos">Todos</option>
                                {Object.values(Status).map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700">
                        <button 
                            onClick={() => setIsFilterOpen(false)}
                            className={`w-full py-2 rounded-lg text-sm font-bold text-white ${core === 'MOTOS' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                        >
                            Aplicar
                        </button>
                    </div>
                </div>
            )}
          </div>

          <button 
            onClick={() => handleOpenForm()}
            className={`flex items-center gap-2 px-4 py-2 text-white rounded-lg shadow-sm transition-colors ${buttonClass}`}
          >
            <Plus size={18} />
            Nova Ação
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        {/* Calendar Header / Navigation */}
        <div className="p-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
            <div className="relative">
                <button 
                    onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                    className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 px-2 py-1 rounded-lg transition-colors"
                >
                    <CalendarIcon size={20} className={core === 'MOTOS' ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'} />
                    {capitalizedMonthName}
                    <ChevronDown size={16} className={`text-slate-400 transition-transform ${isDatePickerOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Date Picker Popover */}
                {isDatePickerOpen && (
                    <div className="absolute top-full left-0 mt-2 bg-white dark:bg-slate-800 shadow-xl rounded-xl border border-slate-200 dark:border-slate-700 p-4 z-40 w-[280px] animate-scale-in">
                        {/* Year Control */}
                        <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100 dark:border-slate-700">
                             <button 
                                onClick={() => changeYear(-1)}
                                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-slate-500"
                            >
                                <ChevronLeft size={16} />
                             </button>
                             <span className="font-bold text-slate-800 dark:text-white">{viewDate.getFullYear()}</span>
                             <button 
                                onClick={() => changeYear(1)}
                                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-slate-500"
                            >
                                <ChevronRight size={16} />
                             </button>
                        </div>
                        {/* Months Grid */}
                        <div className="grid grid-cols-3 gap-2">
                            {monthsList.map((m, idx) => (
                                <button
                                    key={m}
                                    onClick={() => changeMonth(idx)}
                                    className={`text-xs py-2 rounded-lg font-medium transition-colors ${
                                        viewDate.getMonth() === idx 
                                        ? (core === 'MOTOS' ? 'bg-red-600 text-white' : 'bg-blue-600 text-white')
                                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                                    }`}
                                >
                                    {m.substring(0, 3)}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="flex items-center gap-2 bg-white dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600 p-1">
                <button onClick={goToPrevMonth} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-600 rounded text-slate-600 dark:text-slate-300">
                    <ChevronLeft size={18} />
                </button>
                <button onClick={goToToday} className="px-3 py-1 text-xs font-bold uppercase hover:bg-slate-100 dark:hover:bg-slate-600 rounded text-slate-600 dark:text-slate-300">
                    Hoje
                </button>
                <button onClick={goToNextMonth} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-600 rounded text-slate-600 dark:text-slate-300">
                    <ChevronRight size={18} />
                </button>
            </div>
        </div>

        {/* Days Header */}
        <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
            <div key={day} className="py-3 text-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              {day}
            </div>
          ))}
        </div>
        
        {/* Days Grid */}
        <div className="grid grid-cols-7 auto-rows-[minmax(120px,auto)]">
          {calendarData.map((cell, i) => {
             const dayEvents = filteredEvents.filter(e => {
                const start = e.startDate;
                const end = e.endDate;
                return cell.dateStr >= start && cell.dateStr <= end;
             });
             
             const isToday = new Date().toISOString().split('T')[0] === cell.dateStr;

             return (
               <div key={i} className={`border-b border-r border-slate-100 dark:border-slate-700 p-2 relative transition-colors ${!cell.isCurrentMonth ? 'bg-slate-50/40 dark:bg-slate-800/40 text-slate-300 dark:text-slate-600' : 'bg-white dark:bg-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-700/50'}`}>
                 <div className="flex justify-between items-start">
                     <span className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full 
                        ${isToday 
                            ? (core === 'MOTOS' ? 'bg-red-600 text-white' : 'bg-blue-600 text-white') 
                            : (cell.isCurrentMonth ? 'text-slate-700 dark:text-slate-300' : 'text-slate-300 dark:text-slate-600')
                        }`}>
                        {cell.day}
                     </span>
                 </div>
                 
                 <div className="mt-2 space-y-1">
                    {dayEvents.map(ev => {
                        const isStart = ev.startDate === cell.dateStr;
                        const isSunday = cell.date.getDay() === 0;
                        const showTitle = isStart || isSunday;

                        return (
                            <div key={ev.id} 
                                 onClick={(e) => { e.stopPropagation(); handleOpenForm(ev); }}
                                 className={`text-xs px-2 py-1 rounded truncate cursor-pointer shadow-sm hover:opacity-80 transition-opacity mb-1
                                 ${core === 'MOTOS' 
                                    ? 'bg-red-50 dark:bg-red-900/40 border-l-2 border-red-500 text-red-700 dark:text-red-300' 
                                    : 'bg-blue-50 dark:bg-blue-900/40 border-l-2 border-blue-500 text-blue-700 dark:text-blue-300'
                                 }`}>
                                {showTitle ? ev.title : '...'}
                            </div>
                        );
                    })}
                 </div>
               </div>
             );
          })}
        </div>
      </div>

      {/* Detailed List View (Current Month) */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="p-6 border-b border-slate-100 dark:border-slate-700">
             <h3 className="font-bold text-slate-800 dark:text-white">Detalhamento ({capitalizedMonthName})</h3>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {currentMonthEvents.length > 0 ? (
                currentMonthEvents.map(event => (
                    <div 
                        key={event.id} 
                        onClick={() => handleOpenForm(event)}
                        className="p-4 flex flex-col md:flex-row md:items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                    >
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold text-slate-800 dark:text-slate-200">{event.title}</h4>
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${badgeClass(event.area)}`}>
                                    {event.area}
                                </span>
                            </div>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">{event.description}</p>
                            <div className="flex items-center gap-4 text-xs text-slate-400 dark:text-slate-500">
                                <span className="flex items-center gap-1"><Clock size={14}/> {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}</span>
                                <span className="flex items-center gap-1"><MapPin size={14}/> Concessionária Principal</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden md:block">
                                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{event.responsible}</p>
                                <p className="text-[10px] text-slate-400">Responsável</p>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div className="p-8 text-center text-slate-400 dark:text-slate-500">
                    Nenhum evento encontrado {hasActiveFilters ? 'com os filtros selecionados' : 'para este mês'}.
                </div>
            )}
          </div>
      </div>

      {/* MODAL OVERLAY */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto flex flex-col animate-in fade-in zoom-in duration-200 border border-slate-200 dark:border-slate-700">
                {/* Modal Header */}
                <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-700 sticky top-0 bg-white dark:bg-slate-800 z-10">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                            {editingId ? 'Editar Ação / Evento' : 'Nova Ação / Evento'}
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            {editingId ? 'Editando informações' : 'Cadastrando para o núcleo'} <span className={`font-bold ${textClass}`}>{core}</span>
                        </p>
                    </div>
                    <button 
                        onClick={() => setIsFormOpen(false)}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Form Content */}
                <div className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Título da Ação</label>
                                <input 
                                    required
                                    type="text" 
                                    value={newTitle}
                                    onChange={e => setNewTitle(e.target.value)}
                                    placeholder="Ex: Lançamento Nova Sahara 300"
                                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tipo</label>
                                <select 
                                    value={newType}
                                    onChange={e => setNewType(e.target.value as any)}
                                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                                >
                                    <option value="Ação">Ação</option>
                                    <option value="Evento">Evento</option>
                                    <option value="Campanha">Campanha</option>
                                    <option value="Lançamento">Lançamento</option>
                                    <option value="Live">Live</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Área Responsável</label>
                                <select 
                                    value={newArea}
                                    onChange={e => setNewArea(e.target.value as Area)}
                                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                                >
                                    {Object.values(Area).map(area => (
                                        <option key={area} value={area}>{area}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Data de Início</label>
                                <input 
                                    required
                                    type="date" 
                                    value={newStartDate}
                                    onChange={e => setNewStartDate(e.target.value)}
                                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Data de Término</label>
                                <input 
                                    required
                                    type="date" 
                                    value={newEndDate}
                                    onChange={e => setNewEndDate(e.target.value)}
                                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Responsável</label>
                                <input 
                                    required
                                    type="text" 
                                    value={newResponsible}
                                    onChange={e => setNewResponsible(e.target.value)}
                                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                                />
                            </div>

                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Descrição / Detalhes</label>
                                <textarea 
                                    rows={4}
                                    value={newDesc}
                                    onChange={e => setNewDesc(e.target.value)}
                                    placeholder="Descreva os objetivos e detalhes da ação..."
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
                                    {editingId ? 'Salvar Alterações' : 'Salvar Ação'}
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