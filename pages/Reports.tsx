import React, { useState, useMemo } from 'react';
import { useApp } from '../context';
import { FileText, Download, UploadCloud, Search, Plus, X, Save, Trash2, Calendar, Edit2, Eye, Maximize2 } from 'lucide-react';
import { Report } from '../types';

export const Reports: React.FC = () => {
  const { core, reports, addReport, updateReport, deleteReport } = useApp();
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  // Preview State
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
  const [filterMonth, setFilterMonth] = useState('Todos');

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [platform, setPlatform] = useState<Report['platform']>('Geral');
  const [fileUrl, setFileUrl] = useState('');
  const [fileName, setFileName] = useState('');

  const coreReports = reports.filter(r => r.core === core);
  
  // Filtering logic
  const filteredReports = useMemo(() => {
    return coreReports.filter(r => {
        if (filterMonth === 'Todos') return true;
        const reportDate = new Date(r.year, r.month - 1);
        const dateStr = reportDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
        return dateStr.toLowerCase().includes(filterMonth.toLowerCase()) || 
               r.title.toLowerCase().includes(filterMonth.toLowerCase()) ||
               r.platform.toLowerCase().includes(filterMonth.toLowerCase());
    });
  }, [coreReports, filterMonth]);

  // Extract unique years for grouping
  const years = useMemo(() => {
    const uniqueYears = Array.from(new Set(filteredReports.map(r => r.year)));
    const currentYear = new Date().getFullYear();
    // Ensure current year always exists in the list so we can show the "Add" button
    if (!uniqueYears.includes(currentYear) && filterMonth === 'Todos') {
        uniqueYears.push(currentYear);
    }
    return uniqueYears.sort((a: number, b: number) => b - a);
  }, [filteredReports, filterMonth]);

  const buttonClass = core === 'MOTOS' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700';
  const borderDashedClass = core === 'MOTOS' ? 'border-red-200 hover:border-red-400 dark:border-red-800' : 'border-blue-200 hover:border-blue-400 dark:border-blue-800';
  const iconBgClass = core === 'MOTOS' ? 'bg-red-50 text-red-600 group-hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:group-hover:bg-red-900/40' : 'bg-blue-50 text-blue-600 group-hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:group-hover:bg-blue-900/40';

  const handleOpenForm = (report?: Report) => {
      if (report) {
          setEditingId(report.id);
          setTitle(report.title);
          setMonth(report.month);
          setYear(report.year);
          setPlatform(report.platform);
          setFileUrl(report.url);
          setFileName('Arquivo Atual'); // Placeholder since we can't extract name from base64 easily without storing it
      } else {
          setEditingId(null);
          setTitle('');
          setMonth(new Date().getMonth() + 1);
          setYear(new Date().getFullYear());
          setPlatform('Geral');
          setFileUrl('');
          setFileName('');
      }
      setIsFormOpen(true);
      setIsPreviewOpen(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFileUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      
      const payload: Report = {
          id: editingId || Date.now().toString(),
          core,
          title,
          month,
          year,
          platform,
          url: fileUrl || '#'
      };

      if (editingId) {
          updateReport(payload);
          alert('Relatório atualizado com sucesso!');
      } else {
          addReport(payload);
          alert('Relatório criado com sucesso!');
      }
      
      setIsFormOpen(false);
  };

  const handleDelete = (id: string) => {
      if (window.confirm('Tem certeza que deseja excluir este relatório?')) {
          deleteReport(id);
          if (editingId === id) setIsFormOpen(false); // Close modal if deleting the open report
      }
  };

  // Helper to check if url is likely an image
  const isImage = (url: string) => {
      return url.startsWith('data:image') || url.match(/\.(jpeg|jpg|gif|png|webp)$/i);
  };

  const months = [
      { value: 1, label: 'Janeiro' },
      { value: 2, label: 'Fevereiro' },
      { value: 3, label: 'Março' },
      { value: 4, label: 'Abril' },
      { value: 5, label: 'Maio' },
      { value: 6, label: 'Junho' },
      { value: 7, label: 'Julho' },
      { value: 8, label: 'Agosto' },
      { value: 9, label: 'Setembro' },
      { value: 10, label: 'Outubro' },
      { value: 11, label: 'Novembro' },
      { value: 12, label: 'Dezembro' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
         <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Relatórios de Performance</h1>
            <p className="text-slate-500 dark:text-slate-400">Central de resultados de tráfego e campanhas.</p>
         </div>
         <button 
            onClick={() => handleOpenForm()}
            className={`flex items-center gap-2 px-4 py-2 text-white rounded-lg shadow-sm transition-colors ${buttonClass}`}
         >
            <Plus size={18} />
            Novo Relatório
         </button>
      </div>

      <div className="flex gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                value={filterMonth === 'Todos' ? '' : filterMonth}
                onChange={(e) => setFilterMonth(e.target.value || 'Todos')}
                placeholder="Buscar relatórios por nome, mês ou plataforma..." 
                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-600 text-slate-800 dark:text-white placeholder-slate-400"
              />
          </div>
      </div>

      <div className="space-y-10">
        {years.map(displayYear => (
            <div key={displayYear}>
                <div className="flex items-center gap-3 mb-4">
                     <h2 className="text-xl font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                        <Calendar className="text-slate-400" size={20} />
                        {displayYear}
                     </h2>
                     <div className="h-px bg-slate-200 dark:bg-slate-700 flex-1"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Add New Placeholder - Show only in current year section if no filter is active */}
                    {displayYear === new Date().getFullYear() && filterMonth === 'Todos' && (
                        <div 
                            onClick={() => handleOpenForm()}
                            className={`bg-white dark:bg-slate-800/50 border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-8 transition-all cursor-pointer min-h-[220px] group hover:shadow-md ${borderDashedClass}`}
                        >
                            <div className={`p-4 rounded-full mb-3 transition-colors ${iconBgClass}`}>
                                <Plus size={32} />
                            </div>
                            <p className="font-bold text-slate-800 dark:text-white text-lg">Novo Relatório</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Clique para adicionar arquivo</p>
                        </div>
                    )}

                    {filteredReports
                        .filter(r => r.year === displayYear)
                        .map((report) => (
                        <div 
                            key={report.id} 
                            onClick={() => handleOpenForm(report)}
                            className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow group relative flex flex-col justify-between min-h-[220px] cursor-pointer"
                        >
                            <div>
                                <div className="absolute top-4 right-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); handleOpenForm(report); }}
                                        className="p-1.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition-colors"
                                        title="Editar / Visualizar"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); handleDelete(report.id); }}
                                        className="p-1.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 hover:text-red-500 dark:text-slate-300 dark:hover:text-red-400 transition-colors"
                                        title="Excluir"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>

                                <div className="flex justify-between items-start mb-4 pr-16">
                                    <div className={`p-3 rounded-lg ${report.platform === 'Meta Ads' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : report.platform === 'Google Ads' ? 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'}`}>
                                        <FileText size={24} />
                                    </div>
                                    <span className="text-xs font-semibold text-slate-400 uppercase flex items-center gap-1 bg-slate-50 dark:bg-slate-700 px-2 py-1 rounded">
                                        {months[report.month - 1]?.label.substring(0, 3)}
                                    </span>
                                </div>
                                <h3 className="font-bold text-slate-800 dark:text-white mb-1 line-clamp-2 text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{report.title}</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">{report.platform}</p>
                            </div>
                            
                            <div className="pt-4 border-t border-slate-50 dark:border-slate-700 flex justify-between items-center mt-4">
                                <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">PDF • Documento</span>
                                <div className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-white transition-colors">
                                    Visualizar
                                    <Download size={16} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        ))}
        
        {years.length === 0 && (
             <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                <p className="text-slate-400">Nenhum relatório encontrado.</p>
             </div>
        )}
      </div>

      {/* FORM MODAL */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
             <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col animate-in fade-in zoom-in duration-200 border border-slate-200 dark:border-slate-700 relative">
                 {/* Header */}
                 <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-700 sticky top-0 bg-white dark:bg-slate-800 z-10">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                            {editingId ? 'Visualizar / Editar Relatório' : 'Novo Relatório'}
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                           {editingId ? 'Detalhes do relatório' : 'Adicione um relatório de performance'} para <span className={`font-bold ${core === 'MOTOS' ? 'text-red-600' : 'text-blue-600'}`}>{core}</span>
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
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Título do Relatório</label>
                            <input 
                                required
                                type="text" 
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                placeholder="Ex: Performance Fevereiro - Meta Ads"
                                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Mês de Referência</label>
                                <select 
                                    value={month}
                                    onChange={e => setMonth(Number(e.target.value))}
                                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                                >
                                    {months.map(m => (
                                        <option key={m.value} value={m.value}>{m.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Ano</label>
                                <input 
                                    type="number"
                                    value={year}
                                    onChange={e => setYear(Number(e.target.value))}
                                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Plataforma</label>
                            <select 
                                value={platform}
                                onChange={e => setPlatform(e.target.value as any)}
                                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                            >
                                <option value="Geral">Geral</option>
                                <option value="Meta Ads">Meta Ads (Facebook/Instagram)</option>
                                <option value="Google Ads">Google Ads</option>
                                <option value="Orgânico">Orgânico / Social Media</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Anexo (PDF/Arquivo)</label>
                            
                            {/* Current File Preview if exists */}
                            {fileUrl && fileUrl !== '#' && (
                                <div className="mb-3 p-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-lg flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white dark:bg-slate-600 rounded text-red-500">
                                            <FileText size={20} />
                                        </div>
                                        <div className="overflow-hidden">
                                            <p className="text-sm font-semibold text-slate-700 dark:text-white truncate max-w-[200px]">{fileName || 'Relatório Anexado'}</p>
                                            <p className="text-xs text-slate-400">Pronto para visualização</p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setIsPreviewOpen(true)}
                                        className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-600 border border-slate-200 dark:border-slate-500 rounded text-xs font-bold text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-500 transition-colors"
                                    >
                                        <Eye size={14} />
                                        Visualizar
                                    </button>
                                </div>
                            )}

                            <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors ${borderDashedClass}`}>
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <UploadCloud className="w-8 h-8 mb-2 text-slate-400" />
                                    <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold">
                                        {fileUrl && fileUrl !== '#' ? 'Clique para substituir o arquivo' : 'Clique para enviar arquivo'}
                                    </p>
                                    <p className="text-xs text-slate-400 dark:text-slate-500">PDF, Excel ou Imagens</p>
                                </div>
                                <input type="file" className="hidden" onChange={handleFileChange} />
                            </label>
                        </div>

                        <div className="flex justify-between pt-6 border-t border-slate-100 dark:border-slate-700">
                             <div>
                                {editingId && (
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(editingId)}
                                        className="px-4 py-2 text-red-600 font-medium hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex items-center gap-2"
                                    >
                                        <Trash2 size={18} />
                                        Excluir Relatório
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
                                    {editingId ? 'Salvar Alterações' : 'Salvar Relatório'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
             </div>
        </div>
      )}

      {/* --- PREVIEW MODAL OVERLAY --- */}
      {isPreviewOpen && fileUrl && (
         <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
             <div className="bg-white dark:bg-slate-900 w-full h-[90vh] max-w-5xl rounded-xl shadow-2xl flex flex-col relative overflow-hidden">
                {/* Preview Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 z-10">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded text-slate-500">
                           <FileText size={20} />
                        </div>
                        <div>
                           <h3 className="font-bold text-slate-800 dark:text-white text-sm">{title || 'Pré-visualização de Arquivo'}</h3>
                           <p className="text-xs text-slate-500">{fileName || 'Documento anexado'}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <a 
                           href={fileUrl} 
                           download={fileName || 'relatorio'}
                           className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500 dark:text-slate-400 transition-colors"
                           title="Baixar Arquivo"
                        >
                            <Download size={20} />
                        </a>
                        <button 
                           onClick={() => setIsPreviewOpen(false)}
                           className="p-2 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-full text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* Preview Content */}
                <div className="flex-1 bg-slate-100 dark:bg-slate-950 p-4 overflow-hidden flex items-center justify-center relative">
                    {isImage(fileUrl) ? (
                        <img 
                           src={fileUrl} 
                           alt="Preview" 
                           className="max-w-full max-h-full object-contain shadow-lg rounded" 
                        />
                    ) : (
                        <iframe 
                           src={fileUrl} 
                           className="w-full h-full rounded shadow-sm bg-white" 
                           title="PDF Preview"
                        />
                    )}
                </div>
             </div>
         </div>
      )}
    </div>
  );
};