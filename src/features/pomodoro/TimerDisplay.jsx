import CoffeeTimer from "./timers/CoffeeTimer";
import PlantTimer from "./timers/PlantTimer";
import CandleTimer from "./timers/CandleTimer";
import SimpleTimer from "./timers/SimpleTimer";

export function TimerDisplay({
  timeLeft,
  phase,
  status,
  linkedTask,
  focusMinutes,
  breakMinutes,
  timerType = "simple",
}) {
  const timerProps = {
    timeLeft,
    phase,
    status,
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
      return <CoffeeTimer {...timerProps} />;
    case "simple":
      return <SimpleTimer {...timerProps} />;
    default:
      return <SimpleTimer {...timerProps} />;
  }
}

export default TimerDisplay;
