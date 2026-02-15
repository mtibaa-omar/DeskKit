import {
  Clock,
  Coffee,
  X,
  Volume2,
  VolumeX,
  Play,
  RotateCcw,
  ChevronDown,
  Save,
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import { useUpdatePomodoroSettings } from "./usePomodoroSettings";
import Modal from "../../components/Modal";
import Button from "../../components/Button";
import RangeSlider from "../../components/RangeSlider";

function Toggle({ enabled, onChange, disabled }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!enabled)}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        enabled ? "bg-blue-600" : "bg-gray-300"
      } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
          enabled ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

export function TimerSettings({
  focusMinutes,
  breakMinutes,
  autoStartBreak,
  autoStartFocus,
  soundEnabled,
  soundVolume,
  disabled,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const { updateSettings } = useUpdatePomodoroSettings();

  const { control, handleSubmit, reset, watch } = useForm({
    defaultValues: {
      focus: focusMinutes,
      break: breakMinutes,
      autoStartBreak,
      autoStartFocus,
      soundEnabled,
      soundVolume: Math.round(soundVolume * 100),
    },
  });

  const watchSoundEnabled = watch("soundEnabled");

  useEffect(() => {
    reset({
      focus: focusMinutes,
      break: breakMinutes,
      autoStartBreak,
      autoStartFocus,
      soundEnabled,
      soundVolume: Math.round(soundVolume * 100),
    });
  }, [
    focusMinutes,
    breakMinutes,
    autoStartBreak,
    autoStartFocus,
    soundEnabled,
    soundVolume,
    reset,
  ]);

  const onSubmit = (data) => {
    updateSettings({
      focus_minutes: data.focus,
      break_minutes: data.break,
      auto_start_break: data.autoStartBreak,
      auto_start_focus: data.autoStartFocus,
      sound_enabled: data.soundEnabled,
      sound_volume: data.soundVolume / 100,
    });
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        disabled={disabled}
        className="group flex items-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-4 sm:py-2.5 bg-white/70 hover:bg-white/90 backdrop-blur-md rounded-xl border border-gray-200 shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-600" />
          <span className="text-sm font-semibold text-gray-700">
            {focusMinutes}m
          </span>
        </div>
        <div className="w-px h-4 bg-gray-300" />
        <div className="flex items-center gap-2">
          <Coffee className="w-4 h-4 text-emerald-600" />
          <span className="text-sm font-semibold text-gray-700">
            {breakMinutes}m
          </span>
        </div>
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Timer Settings"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          <Controller
            name="focus"
            control={control}
            render={({ field }) => (
              <RangeSlider
                value={field.value}
                onChange={field.onChange}
                min={5}
                max={60}
                step={5}
                label="Focus Duration"
                icon={Clock}
                colorTheme="amber"
                unit="min"
                className="mb-6"
              />
            )}
          />

          <Controller
            name="break"
            control={control}
            render={({ field }) => (
              <RangeSlider
                value={field.value}
                onChange={field.onChange}
                min={5}
                max={15}
                step={5}
                label="Break Duration"
                icon={Coffee}
                colorTheme="emerald"
                unit="min"
                className="mb-6"
              />
            )}
          />

          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full flex items-center justify-between py-3 px-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors mb-4"
          >
            <span className="text-sm font-semibold text-gray-700">
              Advanced Settings
            </span>
            <ChevronDown
              className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                showAdvanced ? "rotate-180" : ""
              }`}
            />
          </button>

          <AnimatePresence>
            {showAdvanced && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="border-t border-gray-200 pt-4 mb-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-4">
                    Auto-start
                  </h4>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                        <Play className="w-4 h-4 text-emerald-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        Auto-start Break
                      </span>
                    </div>
                    <Controller
                      name="autoStartBreak"
                      control={control}
                      render={({ field }) => (
                        <Toggle
                          enabled={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                        <RotateCcw className="w-4 h-4 text-amber-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        Auto-start Focus
                      </span>
                    </div>
                    <Controller
                      name="autoStartFocus"
                      control={control}
                      render={({ field }) => (
                        <Toggle
                          enabled={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 mb-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-4">
                    Sound
                  </h4>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        {watchSoundEnabled ? (
                          <Volume2 className="w-4 h-4 text-blue-600" />
                        ) : (
                          <VolumeX className="w-4 h-4 text-blue-600" />
                        )}
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        Sound Enabled
                      </span>
                    </div>
                    <Controller
                      name="soundEnabled"
                      control={control}
                      render={({ field }) => (
                        <Toggle
                          enabled={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />
                  </div>

                  {watchSoundEnabled && (
                    <Controller
                      name="soundVolume"
                      control={control}
                      render={({ field }) => (
                        <RangeSlider
                          value={field.value}
                          onChange={field.onChange}
                          min={0}
                          max={100}
                          step={10}
                          label="Volume"
                          icon={Volume2}
                          colorTheme="blue"
                          unit="%"
                        />
                      )}
                    />
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex gap-3 mt-4">
            <Button
              variant="primary"
              type="submit"
              icon={Save}
              className="flex-1"
            >
              Save Changes
            </Button>
            <Button
              variant="secondary"
              type="button"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}

export default TimerSettings;
