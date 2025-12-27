import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PhaseNavigationProps {
  onBack: () => void;
  onNext: () => void;
  canGoBack: boolean;
  canGoNext: boolean;
  nextLabel?: string;
}

export const PhaseNavigation = ({
  onBack,
  onNext,
  canGoBack,
  canGoNext,
  nextLabel = "Next",
}: PhaseNavigationProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-green-900 border-t border-amber-400/20 p-3 flex justify-between gap-4">
      <Button
        type="button"
        onClick={onBack}
        disabled={!canGoBack}
        className="flex-1 h-12 bg-green-700 [@media(hover:hover)]:hover:bg-green-600 focus:bg-green-700 active:bg-green-700 text-white border border-green-600 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft size={20} className="mr-1" />
        Back
      </Button>
      <Button
        type="button"
        onClick={onNext}
        disabled={!canGoNext}
        className="flex-1 h-12 bg-amber-400 [@media(hover:hover)]:hover:bg-amber-500 focus:bg-amber-400 active:bg-amber-400 text-green-900 font-semibold disabled:bg-amber-400/50 disabled:text-green-900/50 disabled:cursor-not-allowed disabled:opacity-100"
      >
        {nextLabel}
        <ChevronRight size={20} className="ml-1" />
      </Button>
    </div>
  );
};
