import { useRef, useCallback, useEffect } from "react";

export const SOUND_TYPES = {
  start: "start",
  complete: "complete",
  pause: "pause",
  resume: "resume",
};

const SOUND_FILES = {
  [SOUND_TYPES.start]: "/sounds/start.mp3",
  [SOUND_TYPES.complete]: "/sounds/complete.mp3",
  [SOUND_TYPES.pause]: "/sounds/pause.mp3",
  [SOUND_TYPES.resume]: "/sounds/resume.mp3",
};

export const AMBIENT_SOUNDS = {
  none: { label: "None", url: null },
  rain: { label: "Rain", url: "/sounds/rain.mp3" },
  forest: { label: "Forest", url: "/sounds/forest.mp3" },
  cafe: { label: "Café", url: "/sounds/cafe.mp3" },
  fireplace: { label: "Fireplace", url: "/sounds/fireplace.mp3" },
  lofi: { label: "Lo-Fi", url: "/sounds/lofi 1hour.mp3" },
};

export function usePomodoroSounds(enabled = true, volume = 0.7) {
  const audioCache = useRef({});
  const ambientAudioRef = useRef(null);

  useEffect(() => {
    if (!enabled) return;

    Object.entries(SOUND_FILES).forEach(([key, path]) => {
      const audio = new Audio(path);
      audio.preload = "auto";
      audioCache.current[key] = audio;
    });

    return () => {
      Object.values(audioCache.current).forEach((audio) => {
        audio.pause();
        audio.src = "";
      });
      audioCache.current = {};
    };
  }, [enabled]);

  const playSound = useCallback(
    (soundType) => {
      if (!enabled) return;

      const path = SOUND_FILES[soundType];
      if (!path) return;

      try {
        const audio = new Audio(path);
        audio.volume = volume;
        audio.play().catch((err) => {
          console.warn("Failed to play sound:", err);
        });
      } catch (error) {
        console.warn("Failed to play sound:", error);
      }
    },
    [enabled, volume]
  );

  const playAmbient = useCallback(
    (ambientType) => {
      if (!enabled || ambientType === "none") {
        stopAmbient();
        return;
      }

      const ambient = AMBIENT_SOUNDS[ambientType];
      if (!ambient?.url) return;

      stopAmbient();

      try {
        const audio = new Audio(ambient.url);
        audio.loop = true;
        audio.volume = volume * 0.3;
        audio.play().catch(console.warn);
        ambientAudioRef.current = audio;
      } catch (error) {
        console.warn("Failed to play ambient sound:", error);
      }
    },
    [enabled, volume]
  );

  const stopAmbient = useCallback(() => {
    if (ambientAudioRef.current) {
      ambientAudioRef.current.pause();
      ambientAudioRef.current.currentTime = 0;
      ambientAudioRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (ambientAudioRef.current) {
      ambientAudioRef.current.volume = volume * 0.3;
    }
  }, [volume]);

  useEffect(() => {
    return () => {
      stopAmbient();
    };
  }, [stopAmbient]);

  return {
    playSound,
    playAmbient,
    stopAmbient,
    SOUND_TYPES,
    AMBIENT_SOUNDS,
  };
}

export default usePomodoroSounds;
