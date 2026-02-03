import React, { useState } from 'react';
import { useApp } from '../context';
import { Folder, Image, FileText, Link as LinkIcon, MoreVertical, Plus, Trash2, Edit2, Save, X, UploadCloud, FolderPlus, Download, Eye, Maximize2 } from 'lucide-react';
import { Area, Asset, FileCategory } from '../types';

export const Files: React.FC = () => {
  const { core, assets, categories, addCategory, updateCategory, deleteCategory, addAsset, updateAsset, deleteAsset } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  
  // -- Folder Modal State --
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [folderName, setFolderName] = useState('');
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);

  // -- File Modal State --
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);
  const [editingFileId, setEditingFileId] = useState<string | null>(null);
  
  const [fileTitle, setFileTitle] = useState('');
  const [fileType, setFileType] = useState<Asset['type']>('IMAGE');
  const [fileCategory, setFileCategory] = useState('');
  const [fileArea, setFileArea] = useState<Area>(Area.INSTITUCIONAL);
  const [fileUrl, setFileUrl] = useState('');
  const [fileName, setFileName] = useState('');

  // -- Preview Modal State --
  const [previewAsset, setPreviewAsset] = useState<Asset | null>(null);

  // Filter Logic
  const coreCategories = categories.filter(c => c.core === core);
  const coreAssets = assets.filter(a => a.core === core).filter(a => {
      if (selectedCategory === 'Todos') return true;
      return a.category === selectedCategory;
  });

  const buttonClass = core === 'MOTOS' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700';
  const textClass = core === 'MOTOS' ? 'text-red-600' : 'text-blue-600';
  const borderDashedClass = core === 'MOTOS' ? 'border-red-200 hover:border-red-400 dark:border-red-800' : 'border-blue-200 hover:border-blue-400 dark:border-blue-800';

  // --- Folder Handlers ---

  const handleOpenFolderModal = (category?: FileCategory) => {
      if (category) {
          setEditingFolderId(category.id);
          setFolderName(category.name);
      } else {
          setEditingFolderId(null);
          setFolderName('');
      }
      setIsFolderModalOpen(true);
  };

  const handleSaveFolder = (e: React.FormEvent) => {
      e.preventDefault();
      if (editingFolderId) {
          const category = categories.find(c => c.id === editingFolderId);
          if (category) {
              updateCategory({ ...category, name: folderName });
          }
      } else {
          addCategory({
              id: Date.now().toString(),
              core,
              name: folderName,
              isSystem: false
          });
      }
      setIsFolderModalOpen(false);
  };

  const handleDeleteFolder = (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      if (window.confirm('Tem certeza? Isso não apagará os arquivos, apenas a pasta.')) {
          deleteCategory(id);
          if (selectedCategory === categories.find(c => c.id === id)?.name) {
              setSelectedCategory('Todos');
          }
      }
  };

  // --- File Handlers ---

  const handleOpenFileModal = (asset?: Asset) => {
      if (asset) {
          setEditingFileId(asset.id);
          setFileTitle(asset.title);
          setFileType(asset.type);
          setFileCategory(asset.category);
          setFileArea(asset.area);
          setFileUrl(asset.url);
          setFileName('Arquivo Existente');
      } else {
          setEditingFileId(null);
          setFileTitle('');
          setFileType('IMAGE');
          // Default to currently selected category if not 'Todos', otherwise first available
          setFileCategory(selectedCategory !== 'Todos' ? selectedCategory : coreCategories[0]?.name || '');
          setFileArea(Area.INSTITUCIONAL);
          setFileUrl('');
          setFileName('');
      }
      setIsFileModalOpen(true);
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

  const handleSaveFile = (e: React.FormEvent) => {
      e.preventDefault();
      
      const assetPayload: Asset = {
          id: editingFileId || Date.now().toString(),
          core,
          title: fileTitle,
          type: fileType,
          category: fileCategory,
          area: fileArea,
          url: fileUrl || '#'
      };

      if (editingFileId) {
          updateAsset(assetPayload);
      } else {
          addAsset(assetPayload);
      }
      
      setIsFileModalOpen(false);
  };

  const handleDeleteAsset = (id: string) => {
      if(window.confirm('Excluir este arquivo permanentemente?')) {
          deleteAsset(id);
      }
  };

  const getIcon = (type: string) => {
    switch(type) {
        case 'IMAGE': return <Image size={24} className="text-purple-500" />;
        case 'PDF': return <FileText size={24} className="text-red-500" />;
        case 'LINK': return <LinkIcon size={24} className="text-blue-500" />;
        default: return <FileText size={24} className="text-slate-500" />;
    }
  };

  // Helper to check if url is likely an image
  const isImage = (url: string) => {
      return url.startsWith('data:image') || url.match(/\.(jpeg|jpg|gif|png|webp)$/i);
  };

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
         <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Banco de Arquivos</h1>
            <p className="text-slate-500 dark:text-slate-400">Central de ativos digitais, logos e manuais.</p>
         </div>
         <button 
            onClick={() => handleOpenFileModal()}
            className={`flex items-center gap-2 px-4 py-2 text-white rounded-lg shadow-sm transition-colors ${buttonClass}`}
         >
            <Plus size={18} />
            Novo Arquivo
         </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         {/* Categories Sidebar */}
         <div className="space-y-4">
            <div className="flex justify-between items-center px-2">
                <h3 className="font-bold text-slate-700 dark:text-slate-200">Pastas</h3>
                <button 
                    onClick={() => handleOpenFolderModal()}
                    className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-500 dark:text-slate-400" 
                    title="Nova Pasta"
                >
                    <FolderPlus size={18} />
                </button>
            </div>
            
            <div className="space-y-1">
                <div 
                    onClick={() => setSelectedCategory('Todos')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium cursor-pointer flex items-center gap-2 ${selectedCategory === 'Todos' ? 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                >
                    <Folder size={16} className={selectedCategory === 'Todos' ? 'text-slate-800 dark:text-white' : 'text-slate-400 dark:text-slate-500'} />
                    Todos os Arquivos
                </div>

                {coreCategories.map((cat) => (
                    <div 
                        key={cat.id} 
                        onClick={() => setSelectedCategory(cat.name)}
                        className={`group relative px-4 py-2 rounded-lg text-sm font-medium cursor-pointer flex items-center justify-between ${selectedCategory === cat.name ? 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                    >
                        <div className="flex items-center gap-2 truncate">
                            <Folder size={16} className={selectedCategory === cat.name ? 'text-slate-800 dark:text-white' : 'text-slate-400 dark:text-slate-500'} />
                            <span className="truncate">{cat.name}</span>
                        </div>
                        
                        {!cat.isSystem && (
                            <div className="hidden group-hover:flex items-center gap-1">
                                <button 
                                    onClick={(e) => { e.stopPropagation(); handleOpenFolderModal(cat); }}
                                    className="p-1 hover:bg-slate-300 dark:hover:bg-slate-600 rounded text-slate-500 hover:text-blue-600"
                                >
                                    <Edit2 size={12} />
                                </button>
                                <button 
                                    onClick={(e) => handleDeleteFolder(cat.id, e)}
                                    className="p-1 hover:bg-slate-300 dark:hover:bg-slate-600 rounded text-slate-500 hover:text-red-600"
                                >
                                    <Trash2 size={12} />
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
         </div>

         {/* Files Grid */}
         <div className="md:col-span-3">
             <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 min-h-[500px] p-6">
                 {coreAssets.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {coreAssets.map(asset => (
                            <div key={asset.id} className="relative p-4 border border-slate-100 dark:border-slate-700 rounded-lg hover:shadow-md transition-all flex items-start gap-3 group bg-slate-50/50 dark:bg-slate-900/30 hover:bg-white dark:hover:bg-slate-700">
                                <div className="bg-white dark:bg-slate-800 p-2 rounded shadow-sm flex-shrink-0">
                                    {getIcon(asset.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-slate-800 dark:text-white text-sm truncate" title={asset.title}>{asset.title}</h4>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{asset.category}</p>
                                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 uppercase">{asset.area}</p>
                                </div>
                                
                                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white dark:bg-slate-800 rounded shadow-sm border border-slate-100 dark:border-slate-700 p-0.5">
                                    {asset.type !== 'LINK' && (
                                        <button 
                                            onClick={() => setPreviewAsset(asset)}
                                            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-400 hover:text-blue-600 dark:text-slate-500 dark:hover:text-blue-400 rounded transition-colors"
                                            title="Visualizar"
                                        >
                                            <Eye size={14} />
                                        </button>
                                    )}
                                    {asset.type === 'LINK' && (
                                        <a 
                                            href={asset.url} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-400 hover:text-blue-600 dark:text-slate-500 dark:hover:text-blue-400 rounded transition-colors"
                                            title="Abrir Link"
                                        >
                                            <LinkIcon size={14} />
                                        </a>
                                    )}
                                    <button 
                                        onClick={() => handleOpenFileModal(asset)}
                                        className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-300 rounded transition-colors"
                                        title="Editar"
                                    >
                                        <Edit2 size={14} />
                                    </button>
                                    <button 
                                        onClick={() => handleDeleteAsset(asset.id)}
                                        className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/30 text-slate-400 hover:text-red-600 dark:text-slate-500 dark:hover:text-red-400 rounded transition-colors"
                                        title="Excluir"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                        {/* Add File Quick Button */}
                        <div 
                            onClick={() => handleOpenFileModal()}
                            className={`p-4 border border-dashed rounded-lg flex flex-col items-center justify-center text-slate-400 gap-2 cursor-pointer transition-colors ${borderDashedClass} bg-transparent`}
                        >
                            <Plus size={24} />
                            <span className="text-sm font-medium">Novo Arquivo</span>
                        </div>
                    </div>
                 ) : (
                     <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 py-20">
                         <Folder size={48} className="mb-4 opacity-20" />
                         <p>Esta pasta está vazia.</p>
                         <button onClick={() => handleOpenFileModal()} className={`mt-4 text-sm font-bold ${textClass}`}>
                             Adicionar primeiro arquivo
                         </button>
                     </div>
                 )}
             </div>
         </div>
      </div>

      {/* --- FOLDER MODAL --- */}
      {isFolderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-sm flex flex-col animate-in fade-in zoom-in duration-200 border border-slate-200 dark:border-slate-700">
                <div className="flex justify-between items-center p-4 border-b border-slate-100 dark:border-slate-700">
                    <h3 className="font-bold text-slate-800 dark:text-white">{editingFolderId ? 'Renomear Pasta' : 'Nova Pasta'}</h3>
                    <button onClick={() => setIsFolderModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"><X size={20} /></button>
                </div>
                <form onSubmit={handleSaveFolder} className="p-4">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Nome da Pasta</label>
                    <input 
                        required
                        type="text" 
                        value={folderName}
                        onChange={e => setFolderName(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                        placeholder="Ex: Eventos 2026"
                    />
                    <div className="flex justify-end gap-2 mt-4">
                        <button type="button" onClick={() => setIsFolderModalOpen(false)} className="px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">Cancelar</button>
                        <button type="submit" className={`px-4 py-2 text-sm text-white rounded-lg font-medium ${buttonClass}`}>Salvar</button>
                    </div>
                </form>
            </div>
        </div>
      )}

      {/* --- FILE MODAL --- */}
      {isFileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
             <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto flex flex-col animate-in fade-in zoom-in duration-200 border border-slate-200 dark:border-slate-700">
                 <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-700 sticky top-0 bg-white dark:bg-slate-800 z-10">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">{editingFileId ? 'Editar Arquivo' : 'Novo Arquivo'}</h2>
                    <button onClick={() => setIsFileModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"><X size={24} /></button>
                </div>
                <div className="p-8">
                    <form onSubmit={handleSaveFile} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nome do Arquivo</label>
                            <input 
                                required
                                type="text" 
                                value={fileTitle}
                                onChange={e => setFileTitle(e.target.value)}
                                placeholder="Ex: Logo Oficial 2026"
                                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tipo</label>
                                <select 
                                    value={fileType}
                                    onChange={e => setFileType(e.target.value as any)}
                                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                                >
                                    <option value="IMAGE">Imagem</option>
                                    <option value="PDF">PDF</option>
                                    <option value="DOC">Documento</option>
                                    <option value="LINK">Link Externo</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Área</label>
                                <select 
                                    value={fileArea}
                                    onChange={e => setFileArea(e.target.value as any)}
                                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                                >
                                    {Object.values(Area).map(a => <option key={a} value={a}>{a}</option>)}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Pasta (Categoria)</label>
                            <select 
                                value={fileCategory}
                                onChange={e => setFileCategory(e.target.value)}
                                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                            >
                                {coreCategories.map(c => (
                                    <option key={c.id} value={c.name}>{c.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Arquivo ou Link</label>
                            {fileType === 'LINK' ? (
                                <input 
                                    required
                                    type="url" 
                                    value={fileUrl}
                                    onChange={e => setFileUrl(e.target.value)}
                                    placeholder="https://..."
                                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                                />
                            ) : (
                                <div>
                                    {editingFileId && fileUrl && fileUrl !== '#' && (
                                        <div className="mb-2 text-xs text-slate-500">
                                            Arquivo atual selecionado. Envie outro para substituir.
                                        </div>
                                    )}
                                    <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-slate-50 dark:bg-slate-700/50 transition-colors ${borderDashedClass}`}>
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <UploadCloud className="w-8 h-8 mb-2 text-slate-400" />
                                            {fileName ? (
                                                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 px-4 text-center">{fileName}</p>
                                            ) : (
                                                <>
                                                    <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold">
                                                        {editingFileId ? 'Clique para substituir' : 'Clique para enviar'}
                                                    </p>
                                                    <p className="text-xs text-slate-400 dark:text-slate-500">PDF, JPG, PNG, DOC</p>
                                                </>
                                            )}
                                        </div>
                                        <input type="file" className="hidden" onChange={handleFileChange} />
                                    </label>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-700 gap-3">
                            <button type="button" onClick={() => setIsFileModalOpen(false)} className="px-6 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg font-medium">Cancelar</button>
                            <button type="submit" className={`px-6 py-2 text-white font-bold rounded-lg shadow-sm ${buttonClass}`}>
                                {editingFileId ? 'Salvar Alterações' : 'Salvar Arquivo'}
                            </button>
                        </div>
                    </form>
                </div>
             </div>
        </div>
      )}

      {/* --- PREVIEW MODAL --- */}
      {previewAsset && (
         <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
             <div className="bg-white dark:bg-slate-900 w-full h-[90vh] max-w-5xl rounded-xl shadow-2xl flex flex-col relative overflow-hidden">
                {/* Preview Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 z-10">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded text-slate-500">
                           {getIcon(previewAsset.type)}
                        </div>
                        <div>
                           <h3 className="font-bold text-slate-800 dark:text-white text-sm">{previewAsset.title}</h3>
                           <p className="text-xs text-slate-500">{previewAsset.category} • {previewAsset.area}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <a 
                           href={previewAsset.url} 
                           download={previewAsset.title}
                           className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500 dark:text-slate-400 transition-colors"
                           title="Baixar Arquivo"
                        >
                            <Download size={20} />
                        </a>
                        <button 
                           onClick={() => setPreviewAsset(null)}
                           className="p-2 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-full text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* Preview Content */}
                <div className="flex-1 bg-slate-100 dark:bg-slate-950 p-4 overflow-hidden flex items-center justify-center relative">
                    {previewAsset.type === 'IMAGE' || isImage(previewAsset.url) ? (
                        <img 
                           src={previewAsset.url} 
                           alt="Preview" 
                           className="max-w-full max-h-full object-contain shadow-lg rounded" 
                        />
                    ) : (
                        <iframe 
                           src={previewAsset.url} 
                           className="w-full h-full rounded shadow-sm bg-white" 
                           title="File Preview"
                        />
                    )}
                </div>
             </div>
         </div>
      )}
    </div>
  );
};