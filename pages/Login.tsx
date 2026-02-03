import React, { useState } from 'react';
import { useApp } from '../context';
import { useNavigate } from 'react-router-dom';
import { Bike, Car, ArrowRight, Mail } from 'lucide-react';

export const Login: React.FC = () => {
  const { login } = useApp();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email.includes('@') || !email.includes('.')) {
        setError('Por favor, insira um e-mail válido.');
        return;
    }

    setLoading(true);
    
    try {
        // Simple login just passes the email
        const success = await login(email);
        if (success) {
            navigate('/');
        } else {
            setError('Não foi possível conectar. Tente novamente.');
        }
    } catch (err) {
        setError('Ocorreu um erro inesperado.');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col justify-center items-center p-4 relative overflow-hidden transition-colors">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-br from-slate-900 to-slate-800 dark:from-black dark:to-slate-900 z-0"></div>
      <div className="absolute top-1/2 left-0 w-full h-1/2 bg-slate-50 dark:bg-slate-900 z-0"></div>
      
      <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl w-full max-w-md z-10 border border-slate-100 dark:border-slate-700 animate-scale-in">
        <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight flex items-center justify-center gap-2 mb-2 text-red-600 dark:text-red-500">
                Motoeste
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 uppercase tracking-widest font-semibold">Acesso Corporativo</p>
        </div>

        {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-100 dark:border-red-900 text-red-600 dark:text-red-400 text-sm rounded-lg text-center animate-fade-in">
                {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Confirme seu e-mail</label>
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-slate-800 dark:text-white"
                        placeholder="nome@motoeste.com.br"
                        required
                        autoFocus
                    />
                </div>
            </div>

            <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-slate-900 dark:bg-slate-700 text-white py-3 rounded-lg font-semibold hover:bg-slate-800 dark:hover:bg-slate-600 transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-slate-900/20 disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {loading ? 'Verificando...' : 'Acessar Plataforma'}
                {!loading && <ArrowRight size={18} />}
            </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700 flex justify-center gap-6 opacity-60">
            <div className="flex flex-col items-center gap-1 text-slate-400 dark:text-slate-500">
                <Bike size={20} />
                <span className="text-[10px] font-medium uppercase">Motos</span>
            </div>
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-600"></div>
            <div className="flex flex-col items-center gap-1 text-slate-400 dark:text-slate-500">
                <Car size={20} />
                <span className="text-[10px] font-medium uppercase">Carros</span>
            </div>
        </div>
      </div>
      
      <p className="mt-6 text-xs text-slate-400 dark:text-slate-500 z-10 animate-fade-in delay-200">© 2026 Grupo Motoeste. Todos os direitos reservados.</p>
    </div>
  );
};