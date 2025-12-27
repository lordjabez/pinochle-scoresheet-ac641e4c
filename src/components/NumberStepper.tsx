import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown } from "lucide-react";

interface NumberStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  className?: string;
}

export const NumberStepper = ({
  value,
  onChange,
  min = 0,
  max = 999,
  step = 1,
  label,
  className = "",
}: NumberStepperProps) => {
  const increment = () => {
    const newValue = value + step;
    if (newValue <= max) {
      onChange(newValue);
    }
  };

  const decrement = () => {
    const newValue = value - step;
    if (newValue >= min) {
      onChange(newValue);
    }
  };

  return (
    <div className={`flex flex-col items-center gap-1 ${className}`}>
      {label && (
        <span className="text-sm text-amber-400 font-medium">{label}</span>
      )}
      <div className="flex items-center gap-2">
        <Button
          type="button"
          size="icon"
          onClick={decrement}
          disabled={value <= min}
          className="h-10 w-10 bg-green-700 [@media(hover:hover)]:hover:bg-green-600 focus:bg-green-700 active:bg-green-700 text-white border border-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronDown size={20} />
        </Button>
        <div className="text-3xl font-bold text-white min-w-[60px] text-center tabular-nums">
          {value}
        </div>
        <Button
          type="button"
          size="icon"
          onClick={increment}
          disabled={value >= max}
          className="h-10 w-10 bg-green-700 [@media(hover:hover)]:hover:bg-green-600 focus:bg-green-700 active:bg-green-700 text-white border border-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronUp size={20} />
        </Button>
      </div>
    </div>
  );
};
