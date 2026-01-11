import { getColorScheme } from "../styles/colorSchemes";

export function RangeSlider({
  value,
  onChange,
  min,
  max,
  step = 1,
  label,
  icon: Icon,
  colorTheme = "amber",
  unit = "",
  className = "",
}) {
  const colors = getColorScheme(colorTheme);

  const getThumbClasses = () => {
    switch (colorTheme) {
      case "emerald":
        return "[&::-webkit-slider-thumb]:from-emerald-400 [&::-webkit-slider-thumb]:to-emerald-600 [&::-moz-range-thumb]:from-emerald-400 [&::-moz-range-thumb]:to-emerald-600";
      case "blue":
        return "[&::-webkit-slider-thumb]:from-blue-400 [&::-webkit-slider-thumb]:to-blue-600 [&::-moz-range-thumb]:from-blue-400 [&::-moz-range-thumb]:to-blue-600";
      default:
        return "[&::-webkit-slider-thumb]:from-amber-400 [&::-webkit-slider-thumb]:to-amber-600 [&::-moz-range-thumb]:from-amber-400 [&::-moz-range-thumb]:to-amber-600";
    }
  };

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-3">
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          <div
            className={`w-8 h-8 ${colors.bg} rounded-lg flex items-center justify-center`}
          >
            <Icon className={`w-4 h-4 ${colors.text}`} />
          </div>
          {label}
        </label>
        <div className={`px-3 py-1.5 ${colors.bg} rounded-lg`}>
          <span className={`text-lg font-bold ${colors.text}`}>{value}</span>
          {unit && (
            <span className={`text-sm font-medium ${colors.text} ml-1`}>
              {unit}
            </span>
          )}
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={`w-full h-2.5 bg-gray-200 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-br [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full ${getThumbClasses()}`}
      />

      <div className="flex justify-between text-xs text-gray-500 mt-2 px-1">
        <span>
          {min} {unit}
        </span>
        <span>
          {max} {unit}
        </span>
      </div>
    </div>
  );
}

export default RangeSlider;
