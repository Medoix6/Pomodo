import { useState, useEffect } from 'react';
import { Category } from '@/types/task';
import { fetchJSON, postJSON, putJSON, deleteJSON } from '@/lib/api';

const STORAGE_KEY = 'pomodo-categories';

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

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
  }, [categories]);

  const addCategory = async (name: string, color: string) => {
    const newCategory: Category = {
      id: crypto.randomUUID(),
      name,
      color,
      createdAt: new Date().toISOString(),
    };
    try {
      const created = await postJSON('/categories', newCategory);
      setCategories(prev => [...prev, created]);
      return created;
    } catch (e) {
      setCategories(prev => [...prev, newCategory]);
      return newCategory;
    }
  };

  const deleteCategory = async (id: string) => {
    if (id === 'default') return;
    try {
      await deleteJSON(`/categories/${id}`);
      setCategories(categories.filter(cat => cat.id !== id));
    } catch (e) {
      setCategories(categories.filter(cat => cat.id !== id));
    }
  };

  const updateCategory = async (id: string, updates: Partial<Category>) => {
    const c = categories.find(c => c.id === id);
    if (!c) return;
    const merged = { ...c, ...updates } as Category;
    try {
      const res = await putJSON(`/categories/${id}`, merged);
      setCategories(categories.map(cat => cat.id === id ? res : cat));
    } catch (e) {
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
