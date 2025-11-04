import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, Settings } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface PomodoroTimerProps {
  onComplete?: () => void;
}

type TimerMode = 'work' | 'shortBreak' | 'longBreak';

export const PomodoroTimer = ({ onComplete }: PomodoroTimerProps) => {
  const [workDuration, setWorkDuration] = useState(25);
  const [shortBreakDuration, setShortBreakDuration] = useState(5);
  const [longBreakDuration, setLongBreakDuration] = useState(15);
  const [mode, setMode] = useState<TimerMode>('work');
  const [seconds, setSeconds] = useState(workDuration * 60);
  const [isActive, setIsActive] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isActive && seconds > 0) {
      intervalRef.current = window.setInterval(() => {
        setSeconds(s => s - 1);
      }, 1000);
    } else if (seconds === 0) {
      setIsActive(false);
      
      if (mode === 'work') {
        if (onComplete) onComplete();
        const newSessionCount = sessionsCompleted + 1;
        setSessionsCompleted(newSessionCount);
        
        // Every 4 sessions, take a long break
        if (newSessionCount % 4 === 0) {
          setMode('longBreak');
          setSeconds(longBreakDuration * 60);
        } else {
          setMode('shortBreak');
          setSeconds(shortBreakDuration * 60);
        }
      } else {
        setMode('work');
        setSeconds(workDuration * 60);
      }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, seconds, mode, onComplete, sessionsCompleted, workDuration, shortBreakDuration, longBreakDuration]);

  const toggle = () => setIsActive(!isActive);

  const reset = () => {
    setIsActive(false);
    setMode('work');
    setSeconds(workDuration * 60);
    setSessionsCompleted(0);
  };

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  const getTotalTime = () => {
    if (mode === 'work') return workDuration * 60;
    if (mode === 'shortBreak') return shortBreakDuration * 60;
    return longBreakDuration * 60;
  };
  
  const progress = (seconds / getTotalTime()) * 100;
  
  const getModeLabel = () => {
    if (mode === 'work') return 'Focus Time';
    if (mode === 'shortBreak') return 'Short Break';
    return 'Long Break';
  };

  return (
    <div className="pomodo-card text-center">
      <div className="mb-4 flex items-center justify-center gap-3">
        <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          {getModeLabel()}
        </span>
        <span className="text-xs text-muted-foreground">
          (Session {sessionsCompleted + 1})
        </span>
      </div>
      
      {/* Settings Panel */}
      <Collapsible open={settingsOpen} onOpenChange={setSettingsOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="mb-4">
            <Settings className="h-4 w-4 mr-2" />
            Timer Settings
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4 mb-6 p-4 bg-muted/50 rounded-lg">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Work Duration</span>
              <span className="font-medium">{workDuration} min</span>
            </div>
            <Slider
              value={[workDuration]}
              onValueChange={(value) => {
                setWorkDuration(value[0]);
                if (mode === 'work' && !isActive) setSeconds(value[0] * 60);
              }}
              min={1}
              max={60}
              step={1}
              disabled={isActive}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Short Break</span>
              <span className="font-medium">{shortBreakDuration} min</span>
            </div>
            <Slider
              value={[shortBreakDuration]}
              onValueChange={(value) => {
                setShortBreakDuration(value[0]);
                if (mode === 'shortBreak' && !isActive) setSeconds(value[0] * 60);
              }}
              min={1}
              max={30}
              step={1}
              disabled={isActive}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Long Break</span>
              <span className="font-medium">{longBreakDuration} min</span>
            </div>
            <Slider
              value={[longBreakDuration]}
              onValueChange={(value) => {
                setLongBreakDuration(value[0]);
                if (mode === 'longBreak' && !isActive) setSeconds(value[0] * 60);
              }}
              min={1}
              max={60}
              step={1}
              disabled={isActive}
            />
          </div>
        </CollapsibleContent>
      </Collapsible>
      
      {/* Clean Circular Timer */}
      <div className="flex justify-center mb-8">
        <div className="relative w-72 h-72">
          {/* Outer glow ring */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 blur-xl" />
          
          {/* Main timer container */}
          <div className="relative w-full h-full rounded-full bg-gradient-to-br from-background to-muted/30 border-2 border-border shadow-2xl backdrop-blur-sm overflow-hidden">
            {/* Animated background gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 transition-opacity duration-1000 ${isActive ? 'opacity-100' : 'opacity-50'}`} />
            
            {/* Progress ring SVG */}
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 200 200">
              <defs>
                <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
                </linearGradient>
              </defs>
              
              {/* Background circle */}
              <circle
                cx="100"
                cy="100"
                r="85"
                fill="none"
                stroke="hsl(var(--muted))"
                strokeWidth="3"
                opacity="0.2"
              />
              
              {/* Progress circle */}
              <circle
                cx="100"
                cy="100"
                r="85"
                fill="none"
                stroke="url(#progressGrad)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={`${(progress / 100) * 534.07} 534.07`}
                className="transition-all duration-1000 ease-linear drop-shadow-lg"
                style={{
                  filter: isActive ? 'drop-shadow(0 0 8px hsl(var(--primary) / 0.6))' : 'none'
                }}
              />
            </svg>
            
            {/* Center content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              {/* Timer display */}
              <div className="text-7xl font-bold tabular-nums tracking-tight mb-2 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                {String(minutes).padStart(2, '0')}:{String(remainingSeconds).padStart(2, '0')}
              </div>
              
              {/* Status indicator */}
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full transition-all duration-500 ${
                  isActive 
                    ? 'bg-primary shadow-[0_0_10px_hsl(var(--primary))] animate-pulse' 
                    : 'bg-muted-foreground/40'
                }`} />
                <span className="text-sm font-medium text-muted-foreground">
                  {isActive ? 'Running' : 'Paused'}
                </span>
              </div>
              
              {/* Progress percentage */}
              <div className="mt-3 text-xs text-muted-foreground/60 font-medium">
                {Math.round(progress)}% complete
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex gap-3 justify-center mt-6">
        <Button
          size="lg"
          onClick={toggle}
          className="gap-2"
        >
          {isActive ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          {isActive ? 'Pause' : 'Start'}
        </Button>
        <Button
          size="lg"
          variant="outline"
          onClick={reset}
        >
          <RotateCcw className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};
