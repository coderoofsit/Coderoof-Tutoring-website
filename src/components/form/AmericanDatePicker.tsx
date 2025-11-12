import { useMemo, useState } from "react";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { formatAmericanDate, parseAmericanDate } from "@/lib/date";

type AmericanDatePickerProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
  className?: string;
  disablePastDates?: boolean;
};

const AmericanDatePicker = ({
  label,
  value,
  onChange,
  required,
  placeholder = "MM/DD/YYYY",
  className,
  disablePastDates = true,
}: AmericanDatePickerProps) => {
  const [open, setOpen] = useState(false);
  const selectedDate = useMemo(() => parseAmericanDate(value) ?? undefined, [value]);

  const isPastDate = (candidate?: Date) => {
    if (!candidate) return false;
    const normalizedCandidate = new Date(candidate);
    normalizedCandidate.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return normalizedCandidate < today;
  };

  return (
    <label className={cn("flex flex-col gap-2 text-sm font-medium text-gray-700", className)}>
      {label}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            type="button"
            className={cn(
              "w-full justify-start rounded-xl border border-indigo-100 bg-white px-4 py-3 text-base font-normal text-gray-900 shadow-sm transition-colors",
              "!bg-white !text-gray-900 hover:!bg-indigo-50 hover:!text-indigo-700 hover:border-indigo-200 focus-visible:ring-indigo-500",
              !value && "text-gray-500",
            )}
            aria-required={required || undefined}
            aria-invalid={required && !value ? true : undefined}
          >
            <CalendarIcon className="mr-2 h-4 w-4 text-indigo-500" />
            {value || placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(day) => {
              onChange(day ? formatAmericanDate(day) : "");
              setOpen(false);
            }}
            disabled={disablePastDates ? isPastDate : undefined}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </label>
  );
};

export default AmericanDatePicker;
