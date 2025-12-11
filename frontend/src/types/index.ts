// User types
export interface User {
  id: number;
  nickname: string;
  email: string;
  role: string;
}

export interface UserCreate {
  nickname: string;
  email: string;
  password: string;
}

export interface LoginCredentials {
  username: string; // email
  password: string;
}

export interface Token {
  access_token: string;
  token_type: string;
}

// Task types
export interface Task {
  id: number;
  title: string;
  description: string | null;
  is_important: boolean;
  deadline_at: string | null;
  quadrant: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  completed: boolean;
  created_at: string;
  completed_at: string | null;
  is_urgent: boolean;
  days_until_deadline: number | null;
}

export interface TaskCreate {
  title: string;
  description?: string;
  is_important: boolean;
  deadline_at?: string;
}

export interface TaskUpdate {
  title?: string;
  description?: string;
  is_important?: boolean;
  deadline_at?: string;
  completed?: boolean;
}

// Stats types
export interface Stats {
  total_tasks: number;
  by_quadrant: {
    Q1: number;
    Q2: number;
    Q3: number;
    Q4: number;
  };
  by_status: {
    completed: number;
    pending: number;
  };
}

export interface TaskDeadlineStats {
  title: string;
  description: string | null;
  created_at: string;
  days_until_deadline: number;
}