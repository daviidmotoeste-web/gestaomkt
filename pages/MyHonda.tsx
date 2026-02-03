import React, { useState, useMemo } from 'react';
import { useApp } from '../context';
import { Megaphone, Users, CalendarClock, ArrowRight, X, Save, Trash2 } from 'lucide-react';
import { Status, MyHondaCampaign, Area } from '../types';

export const MyHondaCampaigns: React.FC = () => {
  const { core, campaigns, addCampaign, updateCampaign, deleteCampaign, user } = useApp();
  const coreCampaigns = campaigns.filter(c => c.core === core);
  
  const accentColor = core === 'MOTOS' ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400';
  const buttonClass = core === 'MOTOS' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700';
  const textClass = core === 'MOTOS' ? 'text-red-600' : 'text-blue-600';

  // Modal State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [area, setArea] = useState<Area>(Area.VENDAS);
  const [targetAudience, setTargetAudience] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [type, setType] = useState<MyHondaCampaign['type']>('Promocional');
  const [status, setStatus] = useState<Status>(Status.PLANEJADO);
  const [responsible, setResponsible] = useState(user?.name || '');

  // Group campaigns by Month/Year
  const groupedCampaigns = useMemo(() => {
    const groups: Record<string, MyHondaCampaign[]> = {};

    coreCampaigns.forEach(campaign => {
        const date = new Date(campaign.startDate);
        // Create a sortable key: YYYY-MM
        const sortKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        
        if (!groups[sortKey]) {
            groups[sortKey] = [];
        }
        groups[sortKey].push(campaign);
    });

    // Sort keys and map to display structure
    return Object.keys(groups).sort().map(key => {
        const [year, month] = key.split('-');
        const dateObj = new Date(parseInt(year), parseInt(month) - 1);
        const monthName = dateObj.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
        
        return {
            id: key,
            title: monthName.charAt(0).toUpperCase() + monthName.slice(1),
            items: groups[key]
        };
    });
  }, [coreCampaigns]);

  const handleOpenForm = (campaign?: MyHondaCampaign) => {
      if (campaign) {
          setEditingId(campaign.id);
          setTitle(campaign.title);
          setArea(campaign.area);
          setTargetAudience(campaign.targetAudience);
          setStartDate(campaign.startDate);
          setEndDate(campaign.endDate);
          setType(campaign.type);
          setStatus(campaign.status);
          setResponsible(campaign.responsible);
      } else {
          setEditingId(null);
          setTitle('');
          setArea(Area.VENDAS);
          setTargetAudience('');
          setStartDate('');
          setEndDate('');
          setType('Promocional');
          setStatus(Status.PLANEJADO);
          setResponsible(user?.name || '');
      }
      setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      
      const payload: MyHondaCampaign = {
          id: editingId || Date.now().toString(),
          core,
          title,
          area,
          targetAudience,
          startDate,
          endDate,
          type,
          status,
          responsible
      };

      if (editingId) {
          updateCampaign(payload);
          alert('Campanha atualizada!');
      } else {
          addCampaign(payload);
          alert('Campanha criada!');
      }
      setIsFormOpen(false);
  };

  const handleDelete = () => {
      if (editingId && window.confirm('Tem certeza que deseja excluir esta campanha?')) {
          deleteCampaign(editingId);
          setIsFormOpen(false);
      }
  };

  return (
    <div className="space-y-8 relative">
      <div className="flex justify-between items-center">
         <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                Gestão de Campanhas <span className={`${accentColor}`}>MyHonda</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400">Controle de disparos e réguas de relacionamento.</p>
         </div>
         <button 
            onClick={() => handleOpenForm()}
            className={`px-4 py-2 text-white rounded-lg shadow-sm font-medium transition-colors ${buttonClass}`}
         >
            Nova Campanha
         </button>
      </div>

      {groupedCampaigns.length > 0 ? (
        groupedCampaigns.map((group) => (
            <div key={group.id} className="space-y-4">
                <div className="flex items-center gap-3">
                    <h2 className="text-lg font-bold text-slate-700 dark:text-slate-200">{group.title}</h2>
                    <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700"></div>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                    {group.items.map(campaign => (
                        <div 
                            key={campaign.id} 
                            onClick={() => handleOpenForm(campaign)}
                            className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 flex flex-col md:flex-row gap-6 hover:shadow-md transition-shadow cursor-pointer group"
                        >
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 ${core === 'MOTOS' ? 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                                <Megaphone size={28} />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{campaign.title}</h3>
                                        <span className="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 mb-3">
                                            {campaign.type}
                                        </span>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${campaign.status === Status.EM_ANDAMENTO ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400'}`}>
                                        {campaign.status}
                                    </span>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                                    <div className="flex items-start gap-2">
                                        <Users size={16} className="text-slate-400 mt-0.5" />
                                        <div>
                                            <p className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">Público</p>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">{campaign.targetAudience}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <CalendarClock size={16} className="text-slate-400 mt-0.5" />
                                        <div>
                                            <p className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">Período</p>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">{new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <div className="w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center text-[8px] font-bold text-slate-600 dark:text-slate-300 mt-0.5">{campaign.responsible.charAt(0)}</div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">Criador</p>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">{campaign.responsible}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-center md:border-l border-slate-100 dark:border-slate-700 md:pl-6">
                                <button className="p-3 rounded-full hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                                    <ArrowRight size={24} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        ))
      ) : (
          <div className="text-center py-20 text-slate-400 dark:text-slate-500">
              Nenhuma campanha encontrada para este núcleo.
          </div>
      )}

      {/* Modal Form */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
             <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto flex flex-col animate-in fade-in zoom-in duration-200 border border-slate-200 dark:border-slate-700">
                 {/* Header */}
                 <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-700 sticky top-0 bg-white dark:bg-slate-800 z-10">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                            {editingId ? 'Editar Campanha' : 'Nova Campanha MyHonda'}
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            {editingId ? 'Gerenciar régua de relacionamento' : 'Criar novo disparo'} para <span className={`font-bold ${textClass}`}>{core}</span>
                        </p>
                    </div>
                    <button 
                        onClick={() => setIsFormOpen(false)}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Título da Campanha</label>
                                <input 
                                    required
                                    type="text" 
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    placeholder="Ex: Troca de Óleo Premiada"
                                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tipo de Disparo</label>
                                <select 
                                    value={type}
                                    onChange={e => setType(e.target.value as MyHondaCampaign['type'])}
                                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                                >
                                    <option value="Informativo">Informativo</option>
                                    <option value="Promocional">Promocional</option>
                                    <option value="Relacionamento">Relacionamento</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Área</label>
                                <select 
                                    value={area}
                                    onChange={e => setArea(e.target.value as Area)}
                                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                                >
                                     {Object.values(Area).map(a => (
                                        <option key={a} value={a}>{a}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Início</label>
                                <input 
                                    required
                                    type="date" 
                                    value={startDate}
                                    onChange={e => setStartDate(e.target.value)}
                                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Fim</label>
                                <input 
                                    required
                                    type="date" 
                                    value={endDate}
                                    onChange={e => setEndDate(e.target.value)}
                                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                                />
                            </div>

                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Público-Alvo</label>
                                <input 
                                    required
                                    type="text" 
                                    value={targetAudience}
                                    onChange={e => setTargetAudience(e.target.value)}
                                    placeholder="Ex: Clientes inativos há mais de 6 meses..."
                                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status</label>
                                <select 
                                    value={status}
                                    onChange={e => setStatus(e.target.value as Status)}
                                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                                >
                                     {Object.values(Status).map(s => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
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
                        </div>

                         <div className="flex justify-between pt-6 border-t border-slate-100 dark:border-slate-700">
                            <div>
                                {editingId && (
                                    <button
                                        type="button"
                                        onClick={handleDelete}
                                        className="px-4 py-2 text-red-600 font-medium hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors flex items-center gap-2"
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
                                    {editingId ? 'Salvar Alterações' : 'Criar Campanha'}
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