import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar, Megaphone, CheckCircle2, AlertCircle } from 'lucide-react';
import { Status, InstaStatus } from '../types';

export const Dashboard: React.FC = () => {
  const { core, events, posts, campaigns, reports } = useApp();
  const navigate = useNavigate();

  // Filter Data by Core
  const coreEvents = events.filter(e => e.core === core);
  const corePosts = posts.filter(p => p.core === core);
  const coreCampaigns = campaigns.filter(c => c.core === core);
  const coreReports = reports.filter(r => r.core === core);

  // KPIs
  const activeEventsCount = coreEvents.filter(e => e.status === Status.EM_ANDAMENTO).length;
  const plannedPostsCount = corePosts.filter(p => p.status === InstaStatus.CRIACAO || p.status === InstaStatus.IDEIA).length;
  const activeCampaignsCount = coreCampaigns.filter(c => c.status === Status.EM_ANDAMENTO).length;
  const reportsCount = coreReports.length;

  // Chart Data Preparation (Mocking trend data)
  const activityData = [
    { name: 'Sem 1', posts: 4, eventos: 1 },
    { name: 'Sem 2', posts: 6, eventos: 2 },
    { name: 'Sem 3', posts: 3, eventos: 1 },
    { name: 'Sem 4', posts: 8, eventos: 3 },
  ];

  const colorPrimary = core === 'MOTOS' ? '#dc2626' : '#2563eb';
  const colorSecondary = core === 'MOTOS' ? '#fca5a5' : '#93c5fd';

  const KPICard = ({ title, value, icon: Icon, colorClass, delay }: any) => (
    <div className={`bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-start justify-between hover:shadow-lg hover:scale-[1.02] transition-all duration-300 animate-slide-up ${delay}`}>
      <div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-slate-800 dark:text-white">{value}</h3>
      </div>
      <div className={`p-3 rounded-lg ${colorClass} shadow-md`}>
        <Icon size={24} className="text-white" />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard 
          title="Eventos Ativos" 
          value={activeEventsCount} 
          icon={Calendar} 
          colorClass={core === 'MOTOS' ? 'bg-red-500' : 'bg-blue-500'} 
          delay="delay-0"
        />
        <KPICard 
          title="Posts em Produção" 
          value={plannedPostsCount} 
          icon={CheckCircle2} 
          colorClass="bg-emerald-500" 
          delay="delay-75"
        />
        <KPICard 
          title="Campanhas MyHonda" 
          value={activeCampaignsCount} 
          icon={Megaphone} 
          colorClass="bg-amber-500" 
          delay="delay-100"
        />
        <KPICard 
          title="Relatórios (Mês)" 
          value={reportsCount} 
          icon={AlertCircle} 
          colorClass="bg-purple-500" 
          delay="delay-150"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 animate-slide-up delay-200 hover:shadow-md transition-shadow duration-300">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Atividade de Marketing (Últimos 30 dias)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData}>
                <defs>
                  <linearGradient id="colorPosts" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={colorPrimary} stopOpacity={0.1}/>
                    <stop offset="95%" stopColor={colorPrimary} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:opacity-20" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', backgroundColor: '#fff' }}
                    animationDuration={300}
                />
                <Area type="monotone" dataKey="posts" stroke={colorPrimary} strokeWidth={2} fillOpacity={1} fill="url(#colorPosts)" animationDuration={1000} />
                <Area type="monotone" dataKey="eventos" stroke={colorSecondary} strokeWidth={2} fillOpacity={0} fill="transparent" animationDuration={1000} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity List */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col animate-slide-up delay-300 hover:shadow-md transition-shadow duration-300">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Próximas Ações</h3>
          <div className="flex-1 overflow-auto space-y-4">
            {coreEvents.slice(0, 4).map((event, index) => (
              <div 
                key={event.id} 
                className="flex gap-4 items-center p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-all border border-transparent hover:border-slate-100 dark:hover:border-slate-600 hover:scale-[1.02] cursor-default animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-12 h-12 rounded-lg flex-shrink-0 flex items-center justify-center font-bold text-lg shadow-sm ${core === 'MOTOS' ? 'bg-red-50 text-red-600 dark:bg-red-900/50 dark:text-red-400' : 'bg-blue-50 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400'}`}>
                  {new Date(event.startDate).getDate()}
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-sm line-clamp-1">{event.title}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{event.type} • {event.area}</p>
                </div>
                <span className={`ml-auto text-xs px-2 py-1 rounded-full font-medium ${event.status === Status.EM_ANDAMENTO ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'}`}>
                    {event.status === Status.EM_ANDAMENTO ? 'Ativo' : 'Plan'}
                </span>
              </div>
            ))}
            {coreEvents.length === 0 && (
                <div className="text-center py-10 text-slate-400 text-sm">Nenhum evento próximo.</div>
            )}
          </div>
          <button 
            onClick={() => navigate('/events')}
            className={`mt-4 w-full py-2 rounded-lg text-sm font-medium border border-dashed hover:bg-slate-50 dark:hover:bg-slate-700 transition-all active:scale-95 ${core === 'MOTOS' ? 'text-red-600 border-red-200 dark:border-red-900 dark:text-red-400' : 'text-blue-600 border-blue-200 dark:border-blue-900 dark:text-blue-400'}`}
          >
            Ver Calendário Completo
          </button>
        </div>
      </div>
    </div>
  );
};