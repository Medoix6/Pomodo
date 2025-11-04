export type Priority = 'high' | 'medium' | 'low';

export interface Category {
  id: string;
  name: string;
  color: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: Priority;
  note: string;
  createdAt: string;
  pomodoroCount: number;
  categoryId: string;
}
