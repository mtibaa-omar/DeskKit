import CoffeeTimer from "./timers/CoffeeTimer";
import PlantTimer from "./timers/PlantTimer";
import CandleTimer from "./timers/CandleTimer";

export function TimerDisplay({
  timeLeft,
  phase,
  linkedTask,
  focusMinutes,
  breakMinutes,
  timerType = "coffee",
}) {
  const timerProps = {
    timeLeft,
    phase,
    linkedTask,
    focusMinutes,
    breakMinutes,
  };

  switch (timerType) {
    case "plant":
      return <PlantTimer {...timerProps} />;
    case "candle":
      return <CandleTimer {...timerProps} />;
    case "coffee":
    default:
      return <CoffeeTimer {...timerProps} />;
  }
}

export default TimerDisplay;
