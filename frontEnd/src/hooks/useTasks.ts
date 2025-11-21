import { useState, useEffect } from 'react';
import { Task, Priority } from '@/types/task';
import { fetchJSON, postJSON, putJSON, deleteJSON } from '@/lib/api';

const STORAGE_KEY = 'pomodo-tasks';
const SESSION_KEY = 'pomodo-guest-tasks';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      // Authenticated: Try backend first, fall back to localStorage
      (async () => {
        try {
          const remote = await fetchJSON('/tasks');
          setTasks(remote ?? []);
          // keep localStorage in sync
          localStorage.setItem(STORAGE_KEY, JSON.stringify(remote ?? []));
        } catch (e) {
          const stored = localStorage.getItem(STORAGE_KEY);
          if (stored) setTasks(JSON.parse(stored));
        }
      })();
    } else {
      // Guest: Use sessionStorage
      const stored = sessionStorage.getItem(SESSION_KEY);
      if (stored) {
        setTasks(JSON.parse(stored));
      }
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } else {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(tasks));
    }
  }, [tasks, token]);

  const addTask = async (title: string, priority: Priority, note: string, categoryId: string = 'default') => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      completed: false,
      priority,
      note,
      createdAt: new Date().toISOString(),
      pomodoroCount: 0,
      categoryId,
    };

    if (token) {
      try {
        const created = await postJSON('/tasks', newTask);
        setTasks(prev => [created, ...prev]);
      } catch (e) {
        // fallback
        setTasks(prev => [newTask, ...prev]);
      }
    } else {
      // Guest mode
      setTasks(prev => [newTask, ...prev]);
    }
  };

  const toggleTask = async (id: string) => {
    const t = tasks.find(t => t.id === id);
    if (!t) return;
    const updated = { ...t, completed: !t.completed };

    if (token) {
      try {
        const res = await putJSON(`/tasks/${id}`, updated);
        setTasks(tasks.map(task => task.id === id ? res : task));
      } catch (e) {
        setTasks(tasks.map(task => task.id === id ? updated : task));
      }
    } else {
      setTasks(tasks.map(task => task.id === id ? updated : task));
    }
  };

  const deleteTask = async (id: string) => {
    if (token) {
      try {
        await deleteJSON(`/tasks/${id}`);
        setTasks(tasks.filter(task => task.id !== id));
      } catch (e) {
        setTasks(tasks.filter(task => task.id !== id));
      }
    } else {
      setTasks(tasks.filter(task => task.id !== id));
    }
  };

  const incrementPomodoro = async (id: string) => {
    const t = tasks.find(t => t.id === id);
    if (!t) return;
    const updated = { ...t, pomodoroCount: t.pomodoroCount + 1 };

    if (token) {
      try {
        const res = await putJSON(`/tasks/${id}`, updated);
        setTasks(tasks.map(task => task.id === id ? res : task));
      } catch (e) {
        setTasks(tasks.map(task => task.id === id ? updated : task));
      }
    } else {
      setTasks(tasks.map(task => task.id === id ? updated : task));
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    const t = tasks.find(t => t.id === id);
    if (!t) return;
    const merged = { ...t, ...updates } as Task;

    if (token) {
      try {
        const res = await putJSON(`/tasks/${id}`, merged);
        setTasks(tasks.map(task => task.id === id ? res : task));
      } catch (e) {
        setTasks(tasks.map(task => task.id === id ? merged : task));
      }
    } else {
      setTasks(tasks.map(task => task.id === id ? merged : task));
    }
  };

  return {
    tasks,
    addTask,
    toggleTask,
    deleteTask,
    incrementPomodoro,
    updateTask,
  };
};
