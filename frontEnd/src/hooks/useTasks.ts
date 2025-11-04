import { useState, useEffect } from 'react';
import { Task, Priority } from '@/types/task';
import { fetchJSON, postJSON, putJSON, deleteJSON } from '@/lib/api';

const STORAGE_KEY = 'pomodo-tasks';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    // Try backend first, fall back to localStorage
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
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

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
    try {
      const created = await postJSON('/tasks', newTask);
      setTasks(prev => [created, ...prev]);
    } catch (e) {
      // fallback
      setTasks(prev => [newTask, ...prev]);
    }
  };

  const toggleTask = async (id: string) => {
    const t = tasks.find(t => t.id === id);
    if (!t) return;
    const updated = { ...t, completed: !t.completed };
    try {
      const res = await putJSON(`/tasks/${id}`, updated);
      setTasks(tasks.map(task => task.id === id ? res : task));
    } catch (e) {
      setTasks(tasks.map(task => task.id === id ? updated : task));
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await deleteJSON(`/tasks/${id}`);
      setTasks(tasks.filter(task => task.id !== id));
    } catch (e) {
      setTasks(tasks.filter(task => task.id !== id));
    }
  };

  const incrementPomodoro = async (id: string) => {
    const t = tasks.find(t => t.id === id);
    if (!t) return;
    const updated = { ...t, pomodoroCount: t.pomodoroCount + 1 };
    try {
      const res = await putJSON(`/tasks/${id}`, updated);
      setTasks(tasks.map(task => task.id === id ? res : task));
    } catch (e) {
      setTasks(tasks.map(task => task.id === id ? updated : task));
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    const t = tasks.find(t => t.id === id);
    if (!t) return;
    const merged = { ...t, ...updates } as Task;
    try {
      const res = await putJSON(`/tasks/${id}`, merged);
      setTasks(tasks.map(task => task.id === id ? res : task));
    } catch (e) {
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
