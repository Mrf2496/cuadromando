import { create } from 'zustand';

// Types
export interface StrategicPlan {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  description?: string;
  status: string;
  generalResponsible?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Perspective {
  id: string;
  strategicPlanId: string;
  name: string;
  description?: string;
  color: string;
  weight: number;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface StrategicObjective {
  id: string;
  perspectiveId: string;
  code: string;
  description: string;
  weight: number;
  targetDate?: string;
  responsible?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface Policy {
  id: string;
  objectiveId: string;
  code: string;
  description: string;
  status: string;
}

export interface CorporateGoal {
  id: string;
  objectiveId: string;
  indicator: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  targetDate?: string;
  progress: number;
  status: string;
}

export interface CorporateStrategy {
  id: string;
  objectiveId: string;
  code: string;
  description: string;
  type: string;
  status: string;
}

export interface CorporateKPI {
  id: string;
  objectiveId: string;
  name: string;
  formula?: string;
  frequency: string;
  currentValue: number;
  targetValue: number;
  trafficLight: string;
  unit?: string;
}

export interface ActionPlan {
  id: string;
  objectiveId: string;
  strategyId?: string;
  corporateGoalId?: string;
  code: string;
  name: string;
  description?: string;
  responsibleId?: string;
  teamId?: string;
  startDate: string;
  endDate: string;
  status: string;
  budget?: number;
  spentBudget: number;
  progress: number;
}

export interface Team {
  id: string;
  strategicPlanId: string;
  name: string;
  leaderId?: string;
  area?: string;
  description?: string;
}

export interface Employee {
  id: string;
  strategicPlanId: string;
  teamId?: string;
  name: string;
  position?: string;
  email?: string;
  phone?: string;
  avatar?: string;
}

export interface Alert {
  id: string;
  strategicPlanId: string;
  type: string;
  severity: string;
  title: string;
  message: string;
  relatedEntity?: string;
  entityType?: string;
  isRead: boolean;
  isResolved: boolean;
  createdAt: string;
}

interface AppState {
  // Current plan
  currentPlan: StrategicPlan | null;
  perspectives: Perspective[];
  objectives: StrategicObjective[];
  policies: Policy[];
  corporateGoals: CorporateGoal[];
  corporateStrategies: CorporateStrategy[];
  corporateKPIs: CorporateKPI[];
  actionPlans: ActionPlan[];
  teams: Team[];
  employees: Employee[];
  alerts: Alert[];
  
  // UI State
  sidebarCollapsed: boolean;
  activeView: string;
  isLoading: boolean;
  
  // Actions
  setCurrentPlan: (plan: StrategicPlan | null) => void;
  setPerspectives: (perspectives: Perspective[]) => void;
  setObjectives: (objectives: StrategicObjective[]) => void;
  setPolicies: (policies: Policy[]) => void;
  setCorporateGoals: (goals: CorporateGoal[]) => void;
  setCorporateStrategies: (strategies: CorporateStrategy[]) => void;
  setCorporateKPIs: (kpis: CorporateKPI[]) => void;
  setActionPlans: (plans: ActionPlan[]) => void;
  setTeams: (teams: Team[]) => void;
  setEmployees: (employees: Employee[]) => void;
  setAlerts: (alerts: Alert[]) => void;
  
  toggleSidebar: () => void;
  setActiveView: (view: string) => void;
  setIsLoading: (loading: boolean) => void;
  
  // Computed helpers
  getObjectivesByPerspective: (perspectiveId: string) => StrategicObjective[];
  getActionPlansByObjective: (objectiveId: string) => ActionPlan[];
  getEmployeesByTeam: (teamId: string) => Employee[];
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  currentPlan: null,
  perspectives: [],
  objectives: [],
  policies: [],
  corporateGoals: [],
  corporateStrategies: [],
  corporateKPIs: [],
  actionPlans: [],
  teams: [],
  employees: [],
  alerts: [],
  
  sidebarCollapsed: false,
  activeView: 'dashboard',
  isLoading: false,
  
  // Actions
  setCurrentPlan: (plan) => set({ currentPlan: plan }),
  setPerspectives: (perspectives) => set({ perspectives }),
  setObjectives: (objectives) => set({ objectives }),
  setPolicies: (policies) => set({ policies }),
  setCorporateGoals: (corporateGoals) => set({ corporateGoals }),
  setCorporateStrategies: (corporateStrategies) => set({ corporateStrategies }),
  setCorporateKPIs: (corporateKPIs) => set({ corporateKPIs }),
  setActionPlans: (actionPlans) => set({ actionPlans }),
  setTeams: (teams) => set({ teams }),
  setEmployees: (employees) => set({ employees }),
  setAlerts: (alerts) => set({ alerts }),
  
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setActiveView: (view) => set({ activeView: view }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  
  // Computed helpers
  getObjectivesByPerspective: (perspectiveId) => {
    return get().objectives.filter(obj => obj.perspectiveId === perspectiveId);
  },
  getActionPlansByObjective: (objectiveId) => {
    return get().actionPlans.filter(plan => plan.objectiveId === objectiveId);
  },
  getEmployeesByTeam: (teamId) => {
    return get().employees.filter(emp => emp.teamId === teamId);
  },
}));
