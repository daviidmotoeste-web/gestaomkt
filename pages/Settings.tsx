import React, { useState } from 'react';
import { useApp } from '../context';
import { User, Mail, Camera, UserPlus, Trash2, Shield, Edit2, X, Save } from 'lucide-react';
import { User as UserType } from '../types';

export const Settings: React.FC = () => {
  const { user, updateUser, allUsers, addUser, deleteUser, core } = useApp();
  const [activeTab, setActiveTab] = useState<'PROFILE' | 'TEAM'>('PROFILE');
  const [isAddingUser, setIsAddingUser] = useState(false);

  // Profile Form State
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');

  // New User Form State
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<'admin' | 'user'>('user');

  // Edit User Modal State
  const [editingUser, setEditingUser] = useState<UserType | null>(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editRole, setEditRole] = useState<'admin' | 'user'>('user');

  const buttonClass = core === 'MOTOS' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700';
  const textClass = core === 'MOTOS' ? 'text-red-600' : 'text-blue-600';

  // --- Profile Handlers ---
  const handleUpdateProfile = (e: React.FormEvent) => {
      e.preventDefault();
      if (user) {
          updateUser({
              ...user,
              name,
              email,
              avatar
          });
          alert('Perfil atualizado com sucesso!');
      }
  };

  // --- Add User Handlers ---
  const handleAddUser = (e: React.FormEvent) => {
      e.preventDefault();
      const newUser = {
          id: Date.now().toString(),
          name: newUserName,
          email: newUserEmail,
          role: newUserRole,
          avatar: ''
      };
      addUser(newUser);
      setIsAddingUser(false);
      setNewUserName('');
      setNewUserEmail('');
      alert('Usuário criado com sucesso!');
  };

  // --- Edit User Handlers ---
  const handleEditClick = (u: UserType) => {
      setEditingUser(u);
      setEditName(u.name);
      setEditEmail(u.email);
      setEditRole(u.role);
  };

  const handleSaveEditUser = (e: React.FormEvent) => {
      e.preventDefault();
      if (editingUser) {
          updateUser({
              ...editingUser,
              name: editName,
              email: editEmail,
              role: editRole
          });
          setEditingUser(null);
      }
  };

  return (
    <div className="space-y-6">
       <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Configurações</h1>
          <p className="text-slate-500 dark:text-slate-400">Gerencie seu perfil e acessos da plataforma.</p>
       </div>

       {/* Tabs */}
       <div className="flex border-b border-slate-200 dark:border-slate-700">
           <button 
             onClick={() => setActiveTab('PROFILE')}
             className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'PROFILE' ? `border-slate-800 dark:border-white text-slate-800 dark:text-white` : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
           >
             Meu Perfil
           </button>
           {user?.role === 'admin' && (
             <button 
                onClick={() => setActiveTab('TEAM')}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'TEAM' ? `border-slate-800 dark:border-white text-slate-800 dark:text-white` : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
             >
                Gestão de Acessos
             </button>
           )}
       </div>

       {/* Profile Tab */}
       {activeTab === 'PROFILE' && (
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <div className="col-span-1">
                   <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 text-center">
                       <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-700 mx-auto mb-4 flex items-center justify-center overflow-hidden relative group">
                           {avatar ? (
                               <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
                           ) : (
                               <User size={40} className="text-slate-400" />
                           )}
                           <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center text-white cursor-pointer" title="A URL da foto é gerenciada no formulário ao lado">
                                <Camera size={20} />
                           </div>
                       </div>
                       <h3 className="font-bold text-slate-800 dark:text-white">{user?.name}</h3>
                       <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">{user?.email}</p>
                       <span className="inline-block px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold uppercase">
                           {user?.role === 'admin' ? 'Administrador' : 'Colaborador'}
                       </span>
                   </div>
               </div>
               <div className="col-span-2">
                   <form onSubmit={handleUpdateProfile} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 space-y-4">
                       <h3 className="font-bold text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-3 mb-4">Editar Informações</h3>
                       
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <div>
                               <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nome Completo</label>
                               <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <input 
                                        type="text" 
                                        value={name} 
                                        onChange={e => setName(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                                    />
                               </div>
                           </div>
                           <div>
                               <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">E-mail</label>
                               <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <input 
                                        type="email" 
                                        value={email} 
                                        onChange={e => setEmail(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                                    />
                               </div>
                           </div>
                           <div className="col-span-2">
                               <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">URL da Foto de Perfil</label>
                               <div className="relative">
                                    <Camera className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <input 
                                        type="text" 
                                        value={avatar} 
                                        onChange={e => setAvatar(e.target.value)}
                                        placeholder="https://..."
                                        className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                                    />
                               </div>
                           </div>
                       </div>
                       <div className="pt-4 flex justify-end">
                           <button type="submit" className={`px-6 py-2 text-white rounded-lg shadow-sm font-medium transition-colors ${buttonClass}`}>
                               Salvar Alterações
                           </button>
                       </div>
                   </form>
               </div>
           </div>
       )}

       {/* Team Tab */}
       {activeTab === 'TEAM' && (
           <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
               <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                   <div>
                       <h3 className="font-bold text-slate-800 dark:text-white">Usuários Cadastrados</h3>
                       <p className="text-sm text-slate-500 dark:text-slate-400">Gerencie quem tem acesso à plataforma.</p>
                   </div>
                   <button 
                    onClick={() => setIsAddingUser(!isAddingUser)}
                    className={`flex items-center gap-2 px-4 py-2 text-white rounded-lg shadow-sm transition-colors ${buttonClass}`}
                   >
                       <UserPlus size={18} />
                       Adicionar Usuário
                   </button>
               </div>
               
               {isAddingUser && (
                   <div className="p-6 bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
                        <form onSubmit={handleAddUser} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                            <div>
                                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Nome</label>
                                <input required type="text" value={newUserName} onChange={e => setNewUserName(e.target.value)} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-slate-800 dark:text-white" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Email</label>
                                <input required type="email" value={newUserEmail} onChange={e => setNewUserEmail(e.target.value)} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-slate-800 dark:text-white" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Nível</label>
                                <select value={newUserRole} onChange={e => setNewUserRole(e.target.value as any)} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-slate-800 dark:text-white">
                                    <option value="user">Colaborador</option>
                                    <option value="admin">Administrador</option>
                                </select>
                            </div>
                            <button type="submit" className="bg-slate-800 dark:bg-slate-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-900 dark:hover:bg-slate-500">Salvar</button>
                        </form>
                   </div>
               )}

               <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
                  <thead className="bg-slate-50 dark:bg-slate-700 text-xs uppercase font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-600">
                      <tr>
                          <th className="px-6 py-4">Usuário</th>
                          <th className="px-6 py-4">Email</th>
                          <th className="px-6 py-4">Nível</th>
                          <th className="px-6 py-4 text-right">Ações</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                      {allUsers.map(u => (
                          <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                              <td className="px-6 py-4 flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300 overflow-hidden">
                                      {u.avatar ? <img src={u.avatar} alt={u.name} className="w-full h-full object-cover" /> : u.name.charAt(0)}
                                  </div>
                                  <span className="font-medium text-slate-800 dark:text-white">{u.name}</span>
                              </td>
                              <td className="px-6 py-4">{u.email}</td>
                              <td className="px-6 py-4">
                                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-bold uppercase ${u.role === 'admin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' : 'bg-slate-100 text-slate-600 dark:bg-slate-600 dark:text-slate-300'}`}>
                                      {u.role === 'admin' && <Shield size={10} />}
                                      {u.role}
                                  </span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    <button 
                                        onClick={() => handleEditClick(u)}
                                        className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors p-1"
                                        title="Editar usuário"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    {u.id !== user?.id && (
                                        <button 
                                            onClick={() => { if(window.confirm('Tem certeza?')) deleteUser(u.id); }}
                                            className="text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors p-1"
                                            title="Remover acesso"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    )}
                                  </div>
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
           </div>
       )}

       {/* EDIT USER MODAL */}
       {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
             <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-lg flex flex-col animate-in fade-in zoom-in duration-200 border border-slate-200 dark:border-slate-700">
                 {/* Header */}
                 <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-700 sticky top-0 bg-white dark:bg-slate-800 z-10">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                            Editar Usuário
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                           Atualize os dados de acesso.
                        </p>
                    </div>
                    <button 
                        onClick={() => setEditingUser(null)}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="p-8">
                    <form onSubmit={handleSaveEditUser} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nome Completo</label>
                            <input 
                                required
                                type="text" 
                                value={editName}
                                onChange={e => setEditName(e.target.value)}
                                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">E-mail de Acesso</label>
                            <input 
                                required
                                type="email" 
                                value={editEmail}
                                onChange={e => setEditEmail(e.target.value)}
                                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                            />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nível de Acesso</label>
                            <select 
                                value={editRole}
                                onChange={e => setEditRole(e.target.value as any)}
                                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                            >
                                <option value="user">Colaborador</option>
                                <option value="admin">Administrador</option>
                            </select>
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                             <button 
                                type="button" 
                                onClick={() => setEditingUser(null)}
                                className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg font-medium"
                            >
                                Cancelar
                            </button>
                            <button 
                                type="submit" 
                                className={`flex items-center gap-2 px-6 py-2 text-white font-bold rounded-lg shadow-sm transition-colors ${buttonClass}`}
                            >
                                <Save size={18} />
                                Salvar
                            </button>
                        </div>
                    </form>
                </div>
             </div>
        </div>
       )}
    </div>
  );
};