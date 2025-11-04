import { Task } from '@/types/task';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, Timer, Edit2, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Task>) => void;
}

const priorityColors = {
  high: 'priority-badge-high',
  medium: 'priority-badge-medium',
  low: 'priority-badge-low',
};

export const TaskItem = ({ task, onToggle, onDelete, onUpdate }: TaskItemProps) => {
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [editedNote, setEditedNote] = useState(task.note);

  const handleSaveNote = () => {
    onUpdate(task.id, { note: editedNote });
    setIsEditingNote(false);
  };

  const handleCancelEdit = () => {
    setEditedNote(task.note);
    setIsEditingNote(false);
  };

  return (
    <div className={cn(
      "pomodo-card flex items-start gap-4 group transition-all hover:shadow-lg",
      task.completed && "opacity-60"
    )}>
      <Checkbox
        checked={task.completed}
        onCheckedChange={() => onToggle(task.id)}
        className="h-5 w-5 mt-0.5"
      />
      
      <div className="flex-1 min-w-0">
        <h3 className={cn(
          "font-medium text-foreground mb-1",
          task.completed && "line-through text-muted-foreground"
        )}>
          {task.title}
        </h3>
        
        <div className="flex items-center gap-2 flex-wrap mb-2">
          <Badge variant="outline" className={cn("text-xs border", priorityColors[task.priority])}>
            {task.priority}
          </Badge>
          
          {task.pomodoroCount > 0 && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Timer className="h-3 w-3" />
              <span>{task.pomodoroCount}</span>
            </div>
          )}
        </div>

        {isEditingNote ? (
          <div className="space-y-2">
            <Textarea
              value={editedNote}
              onChange={(e) => setEditedNote(e.target.value)}
              className="resize-none text-sm"
              rows={2}
              placeholder="Add a note..."
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleSaveNote}>
                <Check className="h-3 w-3 mr-1" />
                Save
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                <X className="h-3 w-3 mr-1" />
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-2">
            {task.note ? (
              <p className="text-sm text-muted-foreground flex-1">{task.note}</p>
            ) : (
              <p className="text-sm text-muted-foreground/60 italic flex-1">No note added</p>
            )}
          </div>
        )}
      </div>

      <div className="flex gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsEditingNote(true)}
          className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
        >
          <Edit2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(task.id)}
          className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </div>
    </div>
  );
};
