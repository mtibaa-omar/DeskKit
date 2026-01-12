import { Coffee, Flower2, Flame, Clock } from "lucide-react";
import ButtonIcon from "../../components/ButtonIcon";

const timerTypes = [
  {
    id: "simple",
    name: "Simple",
    icon: Clock,
    focusColor: "gray",
  },
  {
    id: "coffee",
    name: "Coffee Cup",
    icon: Coffee,
    focusColor: "amber",
  },
  {
    id: "plant",
    name: "Plant Growth",
    icon: Flower2,
    focusColor: "emerald",
  },
  {
    id: "candle",
    name: "Candle",
    icon: Flame,
    focusColor: "orange",
  },
];

export function TimerSelector({
  selectedTimer,
  onSelectTimer,
  disabled = false,
}) {
  return (
    <div className="flex items-center gap-2">
      {timerTypes.map((timer) => {
        return (
          <ButtonIcon
            id={timer.id}
            name={timer.name}
            icon={timer.icon}
            onSelectTimer={onSelectTimer}
            disabled={disabled}
            selectedTimer={selectedTimer}
            colorTheme={timer.focusColor}
          />
        );
      })}
    </div>
  );
}

export default TimerSelector;
