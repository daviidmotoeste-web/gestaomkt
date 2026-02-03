import React, { useState } from 'react';
import { useApp } from '../context';
import { Plus, X, Save, Trash2, ClipboardList, UploadCloud, Paperclip, FileText, Image } from 'lucide-react';
import { DavidTask, DavidTaskStatus, DavidTaskType, DayOfWeek, CoreType, TaskAttachment } from '../types';

export const DavidTasks: React.FC = () => {
  const { core, davidTasks, addDavidTask, updateDavidTask, deleteDavidTask } = useApp();
  
  // States for Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form States
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [taskCore, setTaskCore] = useState<CoreType>(core); // Default to current core but user can change
  const [activityType, setActivityType] = useState<DavidTaskType>('Outro');
  const [status, setStatus] = useState<DavidTaskStatus>('Planejar');
  const [day, setDay] = useState<DayOfWeek>('Segunda');
  const [attachments, setAttachments] = useState<TaskAttachment[]>([]);

  const days: DayOfWeek[] = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  
  // Styling Helpers
  const buttonClass = core === 'MOTOS' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700';
  const textClass = core === 'MOTOS' ? 'text-red-600' : 'text-blue-600';
  const borderDashedClass = core === 'MOTOS' ? 'border-red-200 hover:border-red-400 dark:border-red-800' : 'border-blue-200 hover:border-blue-400 dark:border-blue-800';

  const getStatusColor = (s: DavidTaskStatus) => {
      switch(s) {
          case 'Concluído': return 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800';
          case 'Aprovado': return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800';
          case 'Em andamento': return 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800';
          case 'Pendente': return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800';
          default: return 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-700 dark:text-slate-400 dark:border-slate-600';
      }
  };

  const getTypeColor = (t: DavidTaskType) => {
      switch(t) {
          case 'Post': return 'text-purple-600 bg-purple-50 dark:bg-purple-900/30 dark:text-purple-300';
          case 'Reels': return 'text-pink-600 bg-pink-50 dark:bg-pink-900/30 dark:text-pink-300';
          case 'Stories': return 'text-orange-600 bg-orange-50 dark:bg-orange-900/30 dark:text-orange-300';
          case 'Evento': return 'text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-300';
          case 'Reunião': return 'text-slate-600 bg-slate-50 dark:bg-slate-700 dark:text-slate-300';
          default: return 'text-gray-600 bg-gray-50 dark:bg-gray-800 dark:text-gray-300';
      }
  };

  // Handlers
  const handleOpenModal = (task?: DavidTask, defaultDay?: DayOfWeek) => {
      if (task) {
          setEditingId(task.id);
          setTitle(task.title);
          setDescription(task.description);
          setTaskCore(task.core);
          setActivityType(task.activityType);
          setStatus(task.status);
          setDay(task.day);
          setAttachments(task.attachments || []);
      } else {
          setEditingId(null);
          setTitle('');
          setDescription('');
          setTaskCore(core); // Default to current context core
          setActivityType('Outro');
          setStatus('Planejar');
          setDay(defaultDay || 'Segunda');
          setAttachments([]);
      }
      setIsModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
            const newAtt: TaskAttachment = {
                id: Date.now().toString(),
                name: file.name,
                url: event.target?.result as string,
                type: file.type.startsWith('image/') ? 'IMAGE' : 'FILE'
            };
            setAttachments([...attachments, newAtt]);
        };
        reader.readAsDataURL(file);
    }
  };

  const removeAttachment = (id: string) => {
      setAttachments(attachments.filter(a => a.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const payload: DavidTask = {
          id: editingId || Date.now().toString(),
          title,
          description,
          core: taskCore,
          activityType,
          status,
          day,
          attachments
      };

      if (editingId) {
          updateDavidTask(payload);
      } else {
          addDavidTask(payload);
      }
      setIsModalOpen(false);
  };

  const handleDelete = () => {
      if (editingId && window.confirm('Excluir esta demanda?')) {
          deleteDavidTask(editingId);
          setIsModalOpen(false);
      }
  };

  return (
    <div className="space-y-6 h-[calc(100vh-140px)] flex flex-col">
       <div className="flex justify-between items-center shrink-0">
         <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2 animate-fade-in">
                <ClipboardList className={textClass} />
                Demandas David
            </h1>
            <p className="text-slate-500 dark:text-slate-400">Planejamento semanal de atividades e tarefas.</p>
         </div>
         <button 
            onClick={() => handleOpenModal()}
            className={`flex items-center gap-2 px-4 py-2 text-white rounded-lg shadow-sm transition-all hover:scale-105 active:scale-95 ${buttonClass}`}
         >
            <Plus size={18} />
            Nova Demanda
         </button>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto pb-4">
          <div className="flex gap-4 h-full min-w-full">
              {days.map((d, index) => (
                  <div key={d} className="flex-1 min-w-[280px] max-w-sm flex flex-col h-full bg-slate-100/50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                      <div className="p-3 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-t-xl flex justify-between items-center sticky top-0">
                          <span className="font-bold text-slate-700 dark:text-slate-200">{d}</span>
                          <button onClick={() => handleOpenModal(undefined, d)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                              <Plus size={16} />
                          </button>
                      </div>
                      <div className="p-3 space-y-3 overflow-y-auto flex-1">
                          {davidTasks
                            .filter(t => t.day === d)
                            .map(task => (
                              <div 
                                key={task.id}
                                onClick={() => handleOpenModal(task)}
                                className={`bg-white dark:bg-slate-700 p-3 rounded-lg border shadow-sm cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group ${task.core === 'MOTOS' ? 'border-l-4 border-l-red-500 border-t-slate-200 dark:border-t-slate-600 border-r-slate-200 dark:border-r-slate-600 border-b-slate-200 dark:border-b-slate-600' : 'border-l-4 border-l-blue-500 border-t-slate-200 dark:border-t-slate-600 border-r-slate-200 dark:border-r-slate-600 border-b-slate-200 dark:border-b-slate-600'}`}
                              >
                                  <div className="flex justify-between items-start mb-2">
                                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${getTypeColor(task.activityType)}`}>
                                          {task.activityType}
                                      </span>
                                      {/* Core Badge (Optional visual indicator) */}
                                      <span className={`w-2 h-2 rounded-full ${task.core === 'MOTOS' ? 'bg-red-500' : 'bg-blue-500'}`}></span>
                                  </div>
                                  <h4 className="font-semibold text-slate-800 dark:text-white text-sm mb-1 line-clamp-2">{task.title}</h4>
                                  <p className="text-xs text-slate-500 dark:text-slate-300 line-clamp-2 mb-3">{task.description}</p>
                                  
                                  <div className="flex items-center justify-between">
                                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getStatusColor(task.status)}`}>
                                          {task.status}
                                      </span>
                                      {task.attachments && task.attachments.length > 0 && (
                                          <div className="flex items-center gap-1 text-slate-400 dark:text-slate-500 text-xs">
                                              <Paperclip size={12} />
                                              <span>{task.attachments.length}</span>
                                          </div>
                                      )}
                                  </div>
                              </div>
                          ))}
                          {davidTasks.filter(t => t.day === d).length === 0 && (
                              <div className="text-center py-6 text-slate-400 dark:text-slate-600 text-xs italic">
                                  Sem tarefas
                              </div>
                          )}
                      </div>
                  </div>
              ))}
          </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
             <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-lg flex flex-col animate-scale-in border border-slate-200 dark:border-slate-700">
                 <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-t-xl">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">{editingId ? 'Editar Demanda' : 'Nova Demanda'}</h2>
                    <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"><X size={24} /></button>
                </div>
                <div className="p-6 overflow-y-auto max-h-[80vh]">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Título</label>
                            <input 
                                required
                                type="text" 
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                            />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Dia da Semana</label>
                                <select 
                                    value={day}
                                    onChange={e => setDay(e.target.value as DayOfWeek)}
                                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                                >
                                    {days.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Núcleo (Área)</label>
                                <select 
                                    value={taskCore}
                                    onChange={e => setTaskCore(e.target.value as CoreType)}
                                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                                >
                                    <option value="MOTOS">Motos</option>
                                    <option value="CARROS">Carros</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tipo de Atividade</label>
                                <select 
                                    value={activityType}
                                    onChange={e => setActivityType(e.target.value as DavidTaskType)}
                                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                                >
                                    <option value="Post">Post</option>
                                    <option value="Reels">Reels</option>
                                    <option value="Stories">Stories</option>
                                    <option value="Evento">Evento</option>
                                    <option value="Reunião">Reunião</option>
                                    <option value="Outro">Outro</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status / Etiqueta</label>
                                <select 
                                    value={status}
                                    onChange={e => setStatus(e.target.value as DavidTaskStatus)}
                                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                                >
                                    <option value="Planejar">Planejar</option>
                                    <option value="Pendente">Pendente</option>
                                    <option value="Em andamento">Em andamento</option>
                                    <option value="Aprovado">Aprovado</option>
                                    <option value="Concluído">Concluído</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Descrição</label>
                            <textarea 
                                rows={3}
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                            />
                        </div>

                        {/* ATTACHMENT SECTION */}
                        <div>
                             <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Anexos</label>
                             <div className="space-y-3">
                                <label className={`flex items-center justify-center w-full p-4 border-2 border-dashed rounded-lg cursor-pointer bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors ${borderDashedClass}`}>
                                    <div className="flex flex-col items-center justify-center">
                                        <UploadCloud className="w-6 h-6 mb-1 text-slate-400" />
                                        <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Adicionar arquivo ou imagem</span>
                                    </div>
                                    <input type="file" className="hidden" onChange={handleFileChange} />
                                </label>
                                
                                {attachments.length > 0 && (
                                    <div className="space-y-2 max-h-40 overflow-y-auto">
                                        {attachments.map(att => (
                                            <div key={att.id} className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 border border-slate-100 dark:border-slate-600 rounded-lg animate-fade-in">
                                                <div className="flex items-center gap-2 overflow-hidden">
                                                    {att.type === 'IMAGE' ? <Image size={16} className="text-purple-500" /> : <FileText size={16} className="text-blue-500" />}
                                                    <span className="text-xs text-slate-700 dark:text-slate-200 truncate max-w-[200px]">{att.name}</span>
                                                </div>
                                                <button 
                                                    type="button"
                                                    onClick={() => removeAttachment(att.id)}
                                                    className="text-slate-400 hover:text-red-500 p-1 rounded"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                             </div>
                        </div>

                        <div className="flex justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
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
                            <div className="flex gap-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg font-medium">Cancelar</button>
                                <button type="submit" className={`px-6 py-2 text-white font-bold rounded-lg shadow-sm ${buttonClass}`}>Salvar</button>
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