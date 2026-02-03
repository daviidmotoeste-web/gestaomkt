// Core types
export type CoreType = 'MOTOS' | 'CARROS';

export enum Area {
  VENDAS = 'Vendas',
  POS_VENDA = 'Pós-venda',
  FINANCEIRO = 'Financeiro',
  INSTITUCIONAL = 'Institucional',
}

export enum Status {
  PLANEJADO = 'Planejado',
  EM_ANDAMENTO = 'Em andamento',
  CONCLUIDO = 'Concluído',
  CANCELADO = 'Cancelado',
}

// Auth Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  password?: string; // Mock password storage
  avatar?: string;
}

// Event Types
export interface MarketingEvent {
  id: string;
  core: CoreType;
  title: string;
  type: 'Ação' | 'Evento' | 'Campanha' | 'Lançamento' | 'Live';
  area: Area;
  startDate: string; // ISO Date
  endDate: string;   // ISO Date
  description: string;
  status: Status;
  responsible: string;
}

// Instagram Types
export enum InstaFormat {
  FEED = 'Feed',
  REELS = 'Reels',
  STORIES = 'Stories',
}

export enum InstaStatus {
  IDEIA = 'Ideia',
  CRIACAO = 'Em criação',
  REVISAO = 'Revisão',
  APROVADO = 'Aprovado',
  PUBLICADO = 'Publicado',
}

export interface InstaPost {
  id: string;
  core: CoreType;
  date: string;
  format: InstaFormat;
  type: 'Institucional' | 'Oferta' | 'Evento' | 'Engajamento' | 'Bastidores';
  title: string;
  description: string;
  status: InstaStatus;
  responsible: string;
  imageUrl?: string;
}

// Report Types
export interface Report {
  id: string;
  core: CoreType;
  title: string;
  month: number;
  year: number;
  platform: 'Meta Ads' | 'Google Ads' | 'Orgânico' | 'Geral';
  url: string;
}

// MyHonda Campaign Types
export interface MyHondaCampaign {
  id: string;
  core: CoreType;
  title: string;
  area: Area;
  targetAudience: string;
  startDate: string;
  endDate: string;
  type: 'Informativo' | 'Promocional' | 'Relacionamento';
  status: Status;
  responsible: string;
}

// File/Asset Types
export interface Asset {
  id: string;
  core: CoreType;
  title: string;
  type: 'PDF' | 'IMAGE' | 'DOC' | 'LINK';
  category: string; // ID or Name of the category
  area: Area;
  url: string;
}

export interface FileCategory {
    id: string;
    core: CoreType;
    name: string;
    isSystem?: boolean; // If true, cannot be deleted
}

// David Tasks Types
export type DayOfWeek = 'Segunda' | 'Terça' | 'Quarta' | 'Quinta' | 'Sexta' | 'Sábado';

export type DavidTaskType = 'Post' | 'Reels' | 'Stories' | 'Evento' | 'Reunião' | 'Outro';

export type DavidTaskStatus = 'Concluído' | 'Aprovado' | 'Em andamento' | 'Pendente' | 'Planejar';

export interface TaskAttachment {
    id: string;
    name: string;
    url: string;
    type: 'IMAGE' | 'FILE';
}

export interface DavidTask {
    id: string;
    title: string;
    description: string;
    core: CoreType; // Moto vs Carro
    activityType: DavidTaskType;
    status: DavidTaskStatus;
    day: DayOfWeek;
    attachments: TaskAttachment[];
}