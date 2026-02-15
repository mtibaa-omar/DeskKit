import { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX, ChevronDown, CloudRain, Trees, Coffee, Flame, Music } from "lucide-react";
import { usePomodoroSettings, useUpdatePomodoroSettings } from "./usePomodoroSettings";

const SOUND_OPTIONS = [
  { key: "none", label: "Off", icon: VolumeX },
  { key: "rain", label: "Rain", icon: CloudRain },
  { key: "forest", label: "Forest", icon: Trees },
  { key: "cafe", label: "Café", icon: Coffee },
  { key: "fireplace", label: "Fire", icon: Flame },
  { key: "lofi", label: "Lo-Fi", icon: Music },
];

export function SoundToggle() {
  const { settings, isLoading } = usePomodoroSettings();
  const { updateSettings, isUpdating } = useUpdatePomodoroSettings();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const currentKey = settings?.ambient_sound || "none";
  const current = SOUND_OPTIONS.find((s) => s.key === currentKey) || SOUND_OPTIONS[0];
  const isOn = currentKey !== "none";
  const Icon = isOn ? Volume2 : VolumeX;

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selectSound = (key) => {
    updateSettings({
      ambient_sound: key,
      sound_enabled: key !== "none",
    });
    setOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      {/* Trigger */}
      <button
        onClick={() => setOpen((v) => !v)}
        disabled={isLoading || isUpdating}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-all ${
          isOn
            ? "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
            : "bg-gray-100 text-gray-400 hover:bg-gray-200"
        } disabled:opacity-50`}
        title="Ambient sound"
      >
        <Icon className="w-4 h-4" />
        <span className="hidden sm:inline">{current.label}</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-44 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
          {SOUND_OPTIONS.map((opt) => {
            const OptIcon = opt.icon;
            const isActive = opt.key === currentKey;
            return (
              <button
                key={opt.key}
                onClick={() => selectSound(opt.key)}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm transition-colors ${
                  isActive
                    ? "bg-indigo-50 text-indigo-700 font-medium"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <OptIcon className={`w-4 h-4 ${isActive ? "text-indigo-500" : "text-gray-400"}`} />
                {opt.label}
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default SoundToggle;
