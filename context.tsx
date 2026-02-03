import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { CoreType, MarketingEvent, InstaPost, Report, MyHondaCampaign, Asset, Area, Status, InstaStatus, InstaFormat, User, FileCategory, DavidTask, DayOfWeek } from './types';

// --- CONTEXT SETUP ---

interface AppContextType {
  core: CoreType;
  setCore: (core: CoreType) => void;
  
  // Theme
  theme: 'light' | 'dark';
  toggleTheme: () => void;

  user: User | null;
  allUsers: User[];
  login: (email: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (updatedUser: User) => Promise<void>;
  addUser: (newUser: User) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  
  events: MarketingEvent[];
  addEvent: (event: MarketingEvent) => Promise<void>;
  updateEvent: (event: MarketingEvent) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  
  posts: InstaPost[];
  addPost: (post: InstaPost) => Promise<void>;
  updatePost: (post: InstaPost) => Promise<void>;
  deletePost: (id: string) => Promise<void>;
  
  reports: Report[];
  addReport: (report: Report) => Promise<void>;
  updateReport: (report: Report) => Promise<void>;
  deleteReport: (id: string) => Promise<void>;
  
  campaigns: MyHondaCampaign[];
  addCampaign: (campaign: MyHondaCampaign) => Promise<void>;
  updateCampaign: (campaign: MyHondaCampaign) => Promise<void>;
  deleteCampaign: (id: string) => Promise<void>;
  
  assets: Asset[];
  addAsset: (asset: Asset) => Promise<void>;
  updateAsset: (asset: Asset) => Promise<void>;
  deleteAsset: (id: string) => Promise<void>;
  
  categories: FileCategory[];
  addCategory: (category: FileCategory) => Promise<void>;
  updateCategory: (category: FileCategory) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;

  davidTasks: DavidTask[];
  addDavidTask: (task: DavidTask) => Promise<void>;
  updateDavidTask: (task: DavidTask) => Promise<void>;
  deleteDavidTask: (id: string) => Promise<void>;

  currentDate: Date;
  setCurrentDate: (date: Date) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [core, setCore] = useState<CoreType>('MOTOS');
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Theme State
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('theme');
        return (saved === 'dark' || saved === 'light') ? saved : 'light';
    }
    return 'light';
  });

  // Apply Theme Effect
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
        root.classList.add('dark');
    } else {
        root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
      setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Auth State
  const [user, setUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  
  // Data State
  const [events, setEvents] = useState<MarketingEvent[]>([]);
  const [posts, setPosts] = useState<InstaPost[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [campaigns, setCampaigns] = useState<MyHondaCampaign[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [categories, setCategories] = useState<FileCategory[]>([]);
  const [davidTasks, setDavidTasks] = useState<DavidTask[]>([]);

  // --- INITIALIZATION & DATA FETCHING ---

  // Check LocalStorage for persisted session
  useEffect(() => {
    const persistedUser = localStorage.getItem('motoeste_user');
    if (persistedUser) {
        try {
            const parsedUser = JSON.parse(persistedUser);
            setUser(parsedUser);
        } catch (e) {
            console.error("Failed to parse user from storage", e);
            localStorage.removeItem('motoeste_user');
        }
    }
  }, []);

  // SEED DEFAULT USERS (Run once)
  useEffect(() => {
    const seedUsers = async () => {
        const hasSeeded = localStorage.getItem('motoeste_seeded_v1');
        if (hasSeeded) return;

        const defaultUsers = [
            { name: 'Eduarda Medeiros', email: 'eduarda@motoeste.com.br', role: 'user', id: 'eduarda' },
            { name: 'Ricardo de Paula', email: 'ricardo@motoeste.com.br', role: 'user', id: 'ricardo' },
            { name: 'Lecivania', email: 'lecivania@motoeste.com.br', role: 'user', id: 'lecivania' }
        ];

        for (const u of defaultUsers) {
            const { data: existing } = await supabase.from('profiles').select('*').eq('email', u.email);
            if (!existing || existing.length === 0) {
                await supabase.from('profiles').insert({
                    id: u.id + '_' + Date.now(), // Unique ID
                    name: u.name,
                    email: u.email,
                    role: u.role,
                    avatar: ''
                });
            }
        }
        localStorage.setItem('motoeste_seeded_v1', 'true');
    };
    
    seedUsers();
  }, []);

  // Fetch all data when user is authenticated (or identified)
  useEffect(() => {
    if (user) {
        fetchAllData();
    }
  }, [user]);

  const fetchAllData = async () => {
      try {
          // Parallel fetching
          const [
              { data: eventsData },
              { data: postsData },
              { data: reportsData },
              { data: campaignsData },
              { data: assetsData },
              { data: categoriesData },
              { data: tasksData },
              { data: usersData }
          ] = await Promise.all([
              supabase.from('marketing_events').select('*'),
              supabase.from('insta_posts').select('*'),
              supabase.from('reports').select('*'),
              supabase.from('my_honda_campaigns').select('*'),
              supabase.from('assets').select('*'),
              supabase.from('file_categories').select('*'),
              supabase.from('david_tasks').select('*'),
              supabase.from('profiles').select('*')
          ]);

          if (eventsData) setEvents(eventsData);
          if (postsData) setPosts(postsData);
          if (reportsData) setReports(reportsData);
          if (campaignsData) setCampaigns(campaignsData);
          if (assetsData) setAssets(assetsData);
          if (categoriesData) setCategories(categoriesData);
          if (tasksData) setDavidTasks(tasksData);
          if (usersData) setAllUsers(usersData);

      } catch (error) {
          console.error("Error fetching data:", error);
      }
  };

  // --- AUTH METHODS (EMAIL ONLY) ---

  const login = async (email: string): Promise<boolean> => {
    try {
        // 1. Try to find user in 'profiles' by email
        const { data: existingUsers, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('email', email);

        if (existingUsers && existingUsers.length > 0) {
            const foundUser = existingUsers[0];
            setUser(foundUser);
            localStorage.setItem('motoeste_user', JSON.stringify(foundUser));
            return true;
        }

        // 2. If not found, create new user automatically
        const newUser: User = {
            id: Date.now().toString(), // Using simple ID generation for Email-Only mode
            email: email,
            name: email.split('@')[0], // Default name from email
            role: 'user',
            avatar: ''
        };

        const { data: createdUser, error: createError } = await supabase
            .from('profiles')
            .insert(newUser)
            .select()
            .single();

        if (createdUser) {
            setUser(createdUser);
            localStorage.setItem('motoeste_user', JSON.stringify(createdUser));
            return true;
        } else if (createError) {
            console.error("Error creating profile:", createError);
            // Fallback: Log in locally even if DB insert fails (e.g. permission issues)
            setUser(newUser);
            localStorage.setItem('motoeste_user', JSON.stringify(newUser));
            return true;
        }

        return false;
    } catch (err) {
        console.error("Login process error", err);
        return false;
    }
  };

  const logout = async () => {
      // Clear Supabase session just in case, though we primarily use local state now
      await supabase.auth.signOut();
      localStorage.removeItem('motoeste_user');
      setUser(null);
      setEvents([]);
      setPosts([]);
  };

  // --- USER MANAGEMENT (ADMIN) ---
  
  const addUser = async (newUser: User) => {
      const { data, error } = await supabase.from('profiles').insert(newUser).select().single();
      if (data) setAllUsers(prev => [...prev, data]);
      else if (!error) setAllUsers(prev => [...prev, newUser]);
  };

  const updateUser = async (updatedUser: User) => {
      const { error } = await supabase
        .from('profiles')
        .update(updatedUser)
        .eq('id', updatedUser.id);
        
      if (!error) {
        setAllUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
        
        // If updating self, update local session and storage
        if (user && user.id === updatedUser.id) {
            setUser(updatedUser);
            localStorage.setItem('motoeste_user', JSON.stringify(updatedUser));
        }
      }
  };

  const deleteUser = async (userId: string) => {
      const { error } = await supabase.from('profiles').delete().eq('id', userId);
      if (!error) {
          setAllUsers(prev => prev.filter(u => u.id !== userId));
      }
  };

  // --- EVENTS ---

  const addEvent = async (event: MarketingEvent) => {
      const { data, error } = await supabase.from('marketing_events').insert(event).select().single();
      if (data) setEvents(prev => [...prev, data]);
      else if (!error) setEvents(prev => [...prev, event]); 
  };

  const updateEvent = async (updatedEvent: MarketingEvent) => {
      const { error } = await supabase.from('marketing_events').update(updatedEvent).eq('id', updatedEvent.id);
      if (!error) setEvents(prev => prev.map(e => e.id === updatedEvent.id ? updatedEvent : e));
  };

  const deleteEvent = async (id: string) => {
      const { error } = await supabase.from('marketing_events').delete().eq('id', id);
      if (!error) setEvents(prev => prev.filter(e => e.id !== id));
  };

  // --- POSTS ---

  const addPost = async (post: InstaPost) => {
      const { data, error } = await supabase.from('insta_posts').insert(post).select().single();
      if (data) setPosts(prev => [...prev, data]);
      else if (!error) setPosts(prev => [...prev, post]);
  };

  const updatePost = async (updatedPost: InstaPost) => {
      const { error } = await supabase.from('insta_posts').update(updatedPost).eq('id', updatedPost.id);
      if (!error) setPosts(prev => prev.map(p => p.id === updatedPost.id ? updatedPost : p));
  };

  const deletePost = async (id: string) => {
      const { error } = await supabase.from('insta_posts').delete().eq('id', id);
      if (!error) setPosts(prev => prev.filter(p => p.id !== id));
  };

  // --- REPORTS ---

  const addReport = async (report: Report) => {
      const { data, error } = await supabase.from('reports').insert(report).select().single();
      if (data) setReports(prev => [...prev, data]);
      else if (!error) setReports(prev => [...prev, report]);
  };
  
  const updateReport = async (updatedReport: Report) => {
      const { error } = await supabase.from('reports').update(updatedReport).eq('id', updatedReport.id);
      if (!error) setReports(prev => prev.map(r => r.id === updatedReport.id ? updatedReport : r));
  };

  const deleteReport = async (id: string) => {
      const { error } = await supabase.from('reports').delete().eq('id', id);
      if (!error) setReports(prev => prev.filter(r => r.id !== id));
  };

  // --- CAMPAIGNS ---

  const addCampaign = async (campaign: MyHondaCampaign) => {
      const { data, error } = await supabase.from('my_honda_campaigns').insert(campaign).select().single();
      if (data) setCampaigns(prev => [...prev, data]);
      else if (!error) setCampaigns(prev => [...prev, campaign]);
  };

  const updateCampaign = async (campaign: MyHondaCampaign) => {
      const { error } = await supabase.from('my_honda_campaigns').update(campaign).eq('id', campaign.id);
      if (!error) setCampaigns(prev => prev.map(c => c.id === campaign.id ? campaign : c));
  };

  const deleteCampaign = async (id: string) => {
      const { error } = await supabase.from('my_honda_campaigns').delete().eq('id', id);
      if (!error) setCampaigns(prev => prev.filter(c => c.id !== id));
  };

  // --- ASSETS & CATEGORIES ---

  const addAsset = async (asset: Asset) => {
    const { data, error } = await supabase.from('assets').insert(asset).select().single();
    if (data) setAssets(prev => [...prev, data]);
    else if (!error) setAssets(prev => [...prev, asset]);
  };
  
  const updateAsset = async (updatedAsset: Asset) => {
      const { error } = await supabase.from('assets').update(updatedAsset).eq('id', updatedAsset.id);
      if (!error) setAssets(prev => prev.map(a => a.id === updatedAsset.id ? updatedAsset : a));
  };

  const deleteAsset = async (id: string) => {
    const { error } = await supabase.from('assets').delete().eq('id', id);
    if (!error) setAssets(prev => prev.filter(a => a.id !== id));
  };

  const addCategory = async (category: FileCategory) => {
      const { data, error } = await supabase.from('file_categories').insert(category).select().single();
      if (data) setCategories(prev => [...prev, data]);
      else if (!error) setCategories(prev => [...prev, category]);
  };

  const updateCategory = async (category: FileCategory) => {
      const { error } = await supabase.from('file_categories').update(category).eq('id', category.id);
      if (!error) setCategories(prev => prev.map(c => c.id === category.id ? category : c));
  };

  const deleteCategory = async (id: string) => {
      const { error } = await supabase.from('file_categories').delete().eq('id', id);
      if (!error) setCategories(prev => prev.filter(c => c.id !== id));
  };

  // --- DAVID TASKS ---

  const addDavidTask = async (task: DavidTask) => {
      const { data, error } = await supabase.from('david_tasks').insert(task).select().single();
      if (data) setDavidTasks(prev => [...prev, data]);
      else if (!error) setDavidTasks(prev => [...prev, task]);
  };

  const updateDavidTask = async (task: DavidTask) => {
      const { error } = await supabase.from('david_tasks').update(task).eq('id', task.id);
      if (!error) setDavidTasks(prev => prev.map(t => t.id === task.id ? task : t));
  };

  const deleteDavidTask = async (id: string) => {
      const { error } = await supabase.from('david_tasks').delete().eq('id', id);
      if (!error) setDavidTasks(prev => prev.filter(t => t.id !== id));
  };

  return (
    <AppContext.Provider value={{
      core,
      setCore,
      theme,
      toggleTheme,
      user,
      allUsers,
      login,
      logout,
      updateUser,
      addUser,
      deleteUser,
      events,
      addEvent,
      updateEvent,
      deleteEvent,
      posts,
      addPost,
      updatePost,
      deletePost,
      reports,
      addReport,
      updateReport,
      deleteReport,
      campaigns,
      addCampaign,
      updateCampaign,
      deleteCampaign,
      assets,
      addAsset,
      updateAsset,
      deleteAsset,
      categories,
      addCategory,
      updateCategory,
      deleteCategory,
      davidTasks,
      addDavidTask,
      updateDavidTask,
      deleteDavidTask,
      currentDate,
      setCurrentDate
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};