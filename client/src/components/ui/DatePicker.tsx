import { format, addDays, subDays } from "date-fns";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

interface DatePickerProps {
  date: Date;
  onSelect: (date: Date) => void;
}

export function DatePicker({ date, onSelect }: DatePickerProps) {
  return (
    <div className="flex items-center gap-2">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => onSelect(subDays(date, 1))}
        className="h-8 w-8 rounded-full"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="min-w-[200px] justify-start text-left font-medium rounded-xl border-border/60 bg-white/50 hover:bg-white transition-all shadow-sm"
          >
            <Calendar className="mr-2 h-4 w-4 text-primary" />
            {format(date, "EEEE, MMMM do")}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <CalendarComponent
            mode="single"
            selected={date}
            onSelect={(d) => d && onSelect(d)}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => onSelect(addDays(date, 1))}
        className="h-8 w-8 rounded-full"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
