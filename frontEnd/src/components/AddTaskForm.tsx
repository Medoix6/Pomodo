import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';
import { Priority, Category } from '@/types/task';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AddTaskFormProps {
  onAdd: (title: string, priority: Priority, note: string, categoryId: string) => void;
  categories: Category[];
  onAddCategory: (name: string, color: string) => Promise<Category> | Category;
}

export const AddTaskForm = ({ onAdd, categories, onAddCategory }: AddTaskFormProps) => {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [note, setNote] = useState('');
  const [categoryId, setCategoryId] = useState('default');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showNewCategory, setShowNewCategory] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAdd(title, priority, note, categoryId);
    setTitle('');
    setPriority('medium');
    setNote('');
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;

    const colors = [
      'hsl(var(--primary))',
      'hsl(var(--secondary))',
      'hsl(var(--accent))',
      'hsl(210, 100%, 60%)',
      'hsl(280, 100%, 60%)',
    ];
    const color = colors[Math.floor(Math.random() * colors.length)];

    const newCategory = await onAddCategory(newCategoryName, color);
    setCategoryId(newCategory.id);
    setNewCategoryName('');
    setShowNewCategory(false);
  };

  const priorities: Priority[] = ['high', 'medium', 'low'];

  return (
    <form onSubmit={handleSubmit} className="pomodo-card space-y-4">
      <Input
        placeholder="What needs to be done?"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="text-lg"
      />

      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">Category</label>
        <div className="flex gap-2">
          <Select value={categoryId} onValueChange={setCategoryId}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => setShowNewCategory(!showNewCategory)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {showNewCategory && (
          <div className="flex gap-2">
            <Input
              placeholder="New category name..."
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCategory())}
            />
            <Button type="button" variant="outline" onClick={handleAddCategory}>
              Add
            </Button>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        {priorities.map((p) => (
          <Button
            key={p}
            type="button"
            variant={priority === p ? 'default' : 'outline'}
            size="sm"
            onClick={() => setPriority(p)}
            className="capitalize"
          >
            {p}
          </Button>
        ))}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">Note (optional)</label>
        <Textarea
          placeholder="Add any additional details..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="resize-none"
          rows={3}
        />
      </div>

      <Button type="submit" className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Add Task
      </Button>
    </form>
  );
};
