import { Category, Task } from '@/types/task';
import { TaskItem } from './TaskItem';
import { Folder, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CategorySectionProps {
  category: Category;
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onDeleteCategory: (id: string) => void;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
}

export const CategorySection = ({
  category,
  tasks,
  onToggleTask,
  onDeleteTask,
  onDeleteCategory,
  onUpdateTask,
}: CategorySectionProps) => {
  if (tasks.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 group">
        <Folder className="h-5 w-5" style={{ color: category.color }} />
        <h2 className="text-xl font-semibold">{category.name}</h2>
        <span className="text-sm text-muted-foreground">({tasks.length})</span>
        {category.id !== 'default' && (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => onDeleteCategory(category.id)}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        )}
      </div>
      
      <div className="space-y-2 pl-7">
        {tasks.map(task => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={onToggleTask}
            onDelete={onDeleteTask}
            onUpdate={onUpdateTask}
          />
        ))}
      </div>
    </div>
  );
};
