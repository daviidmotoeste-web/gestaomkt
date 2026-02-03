import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context';
import { 
  LayoutDashboard, 
  Calendar, 
  Instagram, 
  BarChart3, 
  FolderOpen, 
  Megaphone, 
  Car, 
  Bike,
  Menu,
  X,
  LogOut,
  Settings,
  ClipboardList,
  Sun,
  Moon
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { core, setCore, user, logout, theme, toggleTheme } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Dynamic Styles based on Core
  const activeColorClass = core === 'MOTOS' ? 'bg-red-600' : 'bg-blue-600';
  const activeTextClass = core === 'MOTOS' ? 'text-red-600' : 'text-blue-600';
  const lightBgClass = core === 'MOTOS' ? 'bg-red-50' : 'bg-blue-50';
  // Note: We use dark: classes for dark mode
  
  const handleLogout = () => {
      logout();
      navigate('/login');
  };

  const NavItem = ({ to, icon: Icon, label }: { to: string; icon: any; label: string }) => {
    const isActive = location.pathname === to || (to !== '/' && location.pathname.startsWith(to));
    return (
      <NavLink
        to={to}
        onClick={() => setIsMobileMenuOpen(false)}
        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group ${
          isActive 
            ? `${activeColorClass} text-white shadow-md translate-x-1` 
            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:translate-x-1'
        }`}
      >
        <Icon size={20} className={`transition-colors duration-300 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'}`} />
        <span className="font-medium">{label}</span>
      </NavLink>
    );
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 overflow-hidden transition-colors duration-300">
      
      {/* Sidebar - Desktop */}
      <aside className={`hidden md:flex flex-col w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 shadow-sm z-10 transition-all duration-500 animate-fade-in`}>
        <div className="p-6">
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-slate-800 dark:text-white">
            <span className={activeTextClass}>Motoeste</span>
          </h1>
          <p className="text-xs text-slate-400 uppercase tracking-wider mt-1 font-semibold">Gestão de Marketing</p>
        </div>

        {/* Core Switcher */}
        <div className="px-4 mb-6">
          <div className="bg-slate-100 dark:bg-slate-700 p-1 rounded-xl flex transition-colors duration-300">
            <button
              onClick={() => setCore('MOTOS')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                core === 'MOTOS' ? 'bg-white dark:bg-slate-800 text-red-600 shadow-sm scale-105' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-600'
              }`}
            >
              <Bike size={16} />
              Motos
            </button>
            <button
              onClick={() => setCore('CARROS')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                core === 'CARROS' ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-sm scale-105' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-600'
              }`}
            >
              <Car size={16} />
              Carros
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
          <NavItem to="/" icon={LayoutDashboard} label="Dashboard" />
          <NavItem to="/david-tasks" icon={ClipboardList} label="Demandas David" />
          <NavItem to="/events" icon={Calendar} label="Eventos & Ações" />
          <NavItem to="/instagram" icon={Instagram} label="Instagram" />
          <NavItem to="/myhonda" icon={Megaphone} label="Campanhas MyHonda" />
          <NavItem to="/reports" icon={BarChart3} label="Relatórios" />
          <NavItem to="/files" icon={FolderOpen} label="Banco de Arquivos" />
          <div className="pt-4 mt-2 border-t border-slate-100 dark:border-slate-700">
             <NavItem to="/settings" icon={Settings} label="Configurações" />
          </div>
        </nav>

        <div className="p-4 border-t border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-3 mb-3">
                <div className={`w-8 h-8 rounded-full ${activeColorClass} flex items-center justify-center text-white text-xs font-bold overflow-hidden transition-colors duration-300`}>
                    {user?.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                        user?.name.charAt(0) || 'U'
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">{user?.name || 'Usuário'}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.role === 'admin' ? 'Administrador' : 'Colaborador'}</p>
                </div>
                
                {/* Theme Toggle */}
                <button 
                  onClick={toggleTheme} 
                  className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                >
                    {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                </button>
            </div>
            <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
            >
                <LogOut size={14} />
                Sair da Conta
            </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 w-full bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 z-50 px-4 py-3 flex items-center justify-between shadow-sm">
         <span className={`font-bold text-lg ${activeTextClass}`}>Motoeste</span>
         <div className="flex items-center gap-2">
            <button onClick={toggleTheme} className="text-slate-600 dark:text-slate-300 p-2">
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-600 dark:text-slate-300 transition-transform active:scale-95">
                {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
         </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-white dark:bg-slate-800 pt-16 px-4 flex flex-col h-full animate-fade-in">
             <div className="mb-6 bg-slate-100 dark:bg-slate-700 p-1 rounded-xl flex">
                <button onClick={() => { setCore('MOTOS'); setIsMobileMenuOpen(false); }} className={`flex-1 py-3 text-center rounded-lg ${core === 'MOTOS' ? 'bg-white dark:bg-slate-800 shadow text-red-600 font-bold' : 'text-slate-500 dark:text-slate-400'}`}>Motos</button>
                <button onClick={() => { setCore('CARROS'); setIsMobileMenuOpen(false); }} className={`flex-1 py-3 text-center rounded-lg ${core === 'CARROS' ? 'bg-white dark:bg-slate-800 shadow text-blue-600 font-bold' : 'text-slate-500 dark:text-slate-400'}`}>Carros</button>
            </div>
            <nav className="space-y-2 flex-1">
                <NavItem to="/" icon={LayoutDashboard} label="Dashboard" />
                <NavItem to="/david-tasks" icon={ClipboardList} label="Demandas David" />
                <NavItem to="/events" icon={Calendar} label="Eventos" />
                <NavItem to="/instagram" icon={Instagram} label="Instagram" />
                <NavItem to="/myhonda" icon={Megaphone} label="MyHonda" />
                <NavItem to="/reports" icon={BarChart3} label="Relatórios" />
                <NavItem to="/files" icon={FolderOpen} label="Arquivos" />
                <NavItem to="/settings" icon={Settings} label="Configurações" />
            </nav>
            <div className="p-4 border-t border-slate-100 dark:border-slate-700 pb-8">
                 <button 
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-lg font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                >
                    <LogOut size={16} />
                    Sair
                </button>
            </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-auto w-full pt-16 md:pt-0 bg-slate-50 dark:bg-slate-900 transition-colors">
        <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 h-16 flex items-center justify-between px-8 sticky top-0 z-20 backdrop-blur-sm bg-white/90 dark:bg-slate-800/90 transition-all duration-300">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-white animate-slide-up">
                {core === 'MOTOS' ? 'Núcleo de Motocicletas' : 'Núcleo de Automóveis'}
            </h2>
            <div className={`hidden md:block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide transition-colors duration-300 ${lightBgClass} dark:bg-slate-700 ${activeTextClass} animate-scale-in`}>
                {core} Environment
            </div>
        </header>
        <div className="p-4 md:p-8 w-full animate-fade-in delay-100">
            {children}
        </div>
      </main>
    </div>
  );
};