import { useState, useEffect } from 'react';
import { Category } from '@/types/task';
import { fetchJSON, postJSON, putJSON, deleteJSON } from '@/lib/api';

const STORAGE_KEY = 'pomodo-categories';
const SESSION_KEY = 'pomodo-guest-categories';

const DEFAULT_CATEGORIES: Category[] = [
  {
    id: 'default',
    name: 'Uncategorized',
    color: 'hsl(var(--muted))',
    createdAt: new Date().toISOString(),
  },
];

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      // Authenticated: Try backend first, fall back to localStorage
      (async () => {
        try {
          const remote = await fetchJSON('/categories');
          setCategories(remote.length > 0 ? remote : DEFAULT_CATEGORIES);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(remote));
        } catch (e) {
          const stored = localStorage.getItem(STORAGE_KEY);
          if (stored) {
            const parsed = JSON.parse(stored);
            setCategories(parsed.length > 0 ? parsed : DEFAULT_CATEGORIES);
          }
        }
      })();
    } else {
      // Guest: Use sessionStorage
      const stored = sessionStorage.getItem(SESSION_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setCategories(parsed.length > 0 ? parsed : DEFAULT_CATEGORIES);
      }
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
    } else {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(categories));
    }
  }, [categories, token]);

  const addCategory = async (name: string, color: string) => {
    const newCategory: Category = {
      id: crypto.randomUUID(),
      name,
      color,
      createdAt: new Date().toISOString(),
    };

    if (token) {
      try {
        const created = await postJSON('/categories', newCategory);
        setCategories(prev => [...prev, created]);
        return created;
      } catch (e) {
        setCategories(prev => [...prev, newCategory]);
        return newCategory;
      }
    } else {
      // Guest mode
      setCategories(prev => [...prev, newCategory]);
      return newCategory;
    }
  };

  const deleteCategory = async (id: string) => {
    if (id === 'default') return;

    if (token) {
      try {
        await deleteJSON(`/categories/${id}`);
        setCategories(categories.filter(cat => cat.id !== id));
      } catch (e) {
        setCategories(categories.filter(cat => cat.id !== id));
      }
    } else {
      setCategories(categories.filter(cat => cat.id !== id));
    }
  };

  const updateCategory = async (id: string, updates: Partial<Category>) => {
    const c = categories.find(c => c.id === id);
    if (!c) return;
    const merged = { ...c, ...updates } as Category;

    if (token) {
      try {
        const res = await putJSON(`/categories/${id}`, merged);
        setCategories(categories.map(cat => cat.id === id ? res : cat));
      } catch (e) {
        setCategories(categories.map(cat => cat.id === id ? merged : cat));
      }
    } else {
      setCategories(categories.map(cat => cat.id === id ? merged : cat));
    }
  };

  return {
    categories,
    addCategory,
    deleteCategory,
    updateCategory,
  };
};
