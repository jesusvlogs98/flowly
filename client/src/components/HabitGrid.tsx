import { useState } from "react";
import { useHabits, useToggleHabit, useHabitCompletions } from "@/hooks/use-habits";
import { format, isSameDay } from "date-fns";
import { motion } from "framer-motion";
import { Check, Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCreateHabit } from "@/hooks/use-habits";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface HabitGridProps {
  date: Date;
}

export function HabitGrid({ date }: HabitGridProps) {
  const { data: habits, isLoading: isLoadingHabits } = useHabits();
  const { data: completions, isLoading: isLoadingCompletions } = useHabitCompletions();
  const toggleHabit = useToggleHabit();
  const [newHabitOpen, setNewHabitOpen] = useState(false);

  const activeHabits = habits?.filter(h => h.active) || [];
  const dateStr = format(date, "yyyy-MM-dd");

  const isCompleted = (habitId: number) => {
    return completions?.some(c => c.habitId === habitId && c.date === dateStr && c.completed);
  };

  const handleToggle = (habitId: number) => {
    const currentStatus = isCompleted(habitId);
    toggleHabit.mutate({
      id: habitId,
      date: date,
      completed: !currentStatus
    });
  };

  if (isLoadingHabits || isLoadingCompletions) {
    return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-display font-semibold">Daily Habits</h3>
        <NewHabitDialog open={newHabitOpen} onOpenChange={setNewHabitOpen} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {activeHabits.length === 0 ? (
          <div className="col-span-full p-8 text-center border border-dashed rounded-xl text-muted-foreground bg-muted/30">
            No habits yet. Start small!
          </div>
        ) : (
          activeHabits.map((habit) => {
            const completed = isCompleted(habit.id);
            return (
              <motion.button
                key={habit.id}
                onClick={() => handleToggle(habit.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  relative flex items-center justify-between p-4 rounded-xl border text-left transition-all duration-300
                  ${completed 
                    ? "bg-primary/5 border-primary/20 shadow-md shadow-primary/5" 
                    : "bg-card border-border hover:border-primary/30 hover:shadow-sm"
                  }
                `}
              >
                <span className={`font-medium transition-colors ${completed ? "text-primary" : "text-foreground"}`}>
                  {habit.title}
                </span>
                
                <div className={`
                  w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 border
                  ${completed 
                    ? "bg-primary border-primary text-primary-foreground scale-110" 
                    : "bg-transparent border-muted-foreground/30 text-transparent"
                  }
                `}>
                  <Check className="w-3.5 h-3.5 stroke-[3px]" />
                </div>

                {/* Celebration effect placeholder - could use confetti here */}
              </motion.button>
            );
          })
        )}
      </div>
    </div>
  );
}

function NewHabitDialog({ open, onOpenChange }: { open: boolean, onOpenChange: (o: boolean) => void }) {
  const [title, setTitle] = useState("");
  const createHabit = useCreateHabit();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    createHabit.mutate({ title }, {
      onSuccess: () => {
        setTitle("");
        onOpenChange(false);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5 h-8 rounded-lg text-xs font-semibold uppercase tracking-wider">
          <Plus className="w-3.5 h-3.5" />
          Add Habit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-2xl p-6">
        <DialogHeader>
          <DialogTitle className="font-display">New Habit</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="title">Habit Name</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Read 10 pages"
              className="rounded-xl"
              autoFocus
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="rounded-lg">
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!title.trim() || createHabit.isPending}
              className="rounded-lg bg-primary hover:bg-primary/90"
            >
              {createHabit.isPending ? "Creating..." : "Create Habit"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
