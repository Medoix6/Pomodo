import { Button } from '@/components/ui/button';
import { Priority } from '@/types/task';

interface TaskFiltersProps {
  selectedPriority: Priority | 'all';
  onPriorityChange: (priority: Priority | 'all') => void;
}

export const TaskFilters = ({
  selectedPriority,
  onPriorityChange,
}: TaskFiltersProps) => {
  const priorities: (Priority | 'all')[] = ['all', 'high', 'medium', 'low'];

  return (
    <div className="pomodo-card space-y-4">
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-2">Filter by Priority</h3>
        <div className="flex gap-2 flex-wrap">
          {priorities.map((p) => (
            <Button
              key={p}
              variant={selectedPriority === p ? 'default' : 'outline'}
              size="sm"
              onClick={() => onPriorityChange(p)}
              className="capitalize"
            >
              {p}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};
