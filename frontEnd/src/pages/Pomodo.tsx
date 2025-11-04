import { useState, useMemo } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { useCategories } from '@/hooks/useCategories';
import { PomodoroTimer } from '@/components/PomodoroTimer';
import { AddTaskForm } from '@/components/AddTaskForm';
import { CategorySection } from '@/components/CategorySection';
import { TaskFilters } from '@/components/TaskFilters';
import { Button } from '@/components/ui/button';
import { LogOut, Sun, Moon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from 'next-themes';
import { Priority } from '@/types/task';

const Pomodo = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { tasks, addTask, toggleTask, deleteTask, incrementPomodoro, updateTask } = useTasks();
  const { categories, addCategory, deleteCategory } = useCategories();
  const [selectedPriority, setSelectedPriority] = useState<Priority | 'all'>('all');
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const priorityMatch = selectedPriority === 'all' || task.priority === selectedPriority;
      return priorityMatch;
    });
  }, [tasks, selectedPriority]);

  const tasksByCategory = useMemo(() => {
    const grouped = new Map<string, typeof filteredTasks>();
    
    categories.forEach(cat => {
      grouped.set(cat.id, []);
    });
    
    filteredTasks.forEach(task => {
      const categoryTasks = grouped.get(task.categoryId) || [];
      grouped.set(task.categoryId, [...categoryTasks, task]);
    });
    
    return grouped;
  }, [filteredTasks, categories]);

  const handlePomodoroComplete = () => {
    if (activeTaskId) {
      incrementPomodoro(activeTaskId);
    }
  };

  const handleLogout = () => {
    navigate('/auth');
  };

  const handleDeleteCategory = (categoryId: string) => {
    // Move tasks from deleted category to default
    tasks.forEach(task => {
      if (task.categoryId === categoryId) {
        updateTask(task.id, { categoryId: 'default' });
      }
    });
    deleteCategory(categoryId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              Pomodo
            </h1>
            <p className="text-muted-foreground mt-1">Focus on what matters</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </header>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <AddTaskForm 
              onAdd={addTask} 
              categories={categories}
              onAddCategory={addCategory}
            />

            <TaskFilters
              selectedPriority={selectedPriority}
              onPriorityChange={setSelectedPriority}
            />

            <div className="space-y-6">
              {filteredTasks.length === 0 ? (
                <div className="pomodo-card text-center py-12">
                  <p className="text-muted-foreground">No tasks yet. Add one to get started!</p>
                </div>
              ) : (
                categories.map(category => (
                  <CategorySection
                    key={category.id}
                    category={category}
                    tasks={tasksByCategory.get(category.id) || []}
                    onToggleTask={toggleTask}
                    onDeleteTask={deleteTask}
                    onDeleteCategory={handleDeleteCategory}
                    onUpdateTask={updateTask}
                  />
                ))
              )}
            </div>
          </div>

          <div className="space-y-6">
            <PomodoroTimer onComplete={handlePomodoroComplete} />
            
            {filteredTasks.length > 0 && (
              <div className="pomodo-card">
                <h3 className="text-sm font-medium text-muted-foreground mb-3">Select Active Task</h3>
                <div className="space-y-2">
                  {filteredTasks.filter(t => !t.completed).slice(0, 5).map(task => (
                    <Button
                      key={task.id}
                      variant={activeTaskId === task.id ? 'default' : 'outline'}
                      className="w-full justify-start text-left"
                      onClick={() => setActiveTaskId(task.id)}
                    >
                      <span className="truncate">{task.title}</span>
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pomodo;
