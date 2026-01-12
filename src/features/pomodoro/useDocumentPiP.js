import { useState, useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export function useDocumentPiP() {
  const [pipWindow, setPipWindow] = useState(null);
  const [isSupported] = useState(() => "documentPictureInPicture" in window);

  const openPiP = useCallback(
    async (options = { width: 320, height: 80 }) => {
      if (!isSupported) {
        console.warn("Document Picture-in-Picture not supported");
        return null;
      }

      try {
        // Close existing PiP window if any
        if (pipWindow) {
          pipWindow.close();
        }

        // Request new PiP window
        const newPipWindow =
          await window.documentPictureInPicture.requestWindow(options);

        // Copy stylesheets to PiP window
        const allCSS = [...document.styleSheets];
        allCSS.forEach((styleSheet) => {
          try {
            const cssRules = [...styleSheet.cssRules]
              .map((rule) => rule.cssText)
              .join("");
            const style = document.createElement("style");
            style.textContent = cssRules;
            newPipWindow.document.head.appendChild(style);
          } catch (e) {
            // Handle cross-origin stylesheets
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = styleSheet.href;
            newPipWindow.document.head.appendChild(link);
          }
        });

        // Set background color
        newPipWindow.document.body.style.margin = "0";
        newPipWindow.document.body.style.padding = "0";
        newPipWindow.document.body.style.backgroundColor = "#18181b";
        newPipWindow.document.body.style.overflow = "hidden";

        // Listen for close event
        newPipWindow.addEventListener("pagehide", () => {
          setPipWindow(null);
        });

        setPipWindow(newPipWindow);
        return newPipWindow;
      } catch (error) {
        console.error("Failed to open PiP window:", error);
        return null;
      }
    },
    [isSupported, pipWindow]
  );

  const closePiP = useCallback(() => {
    if (pipWindow) {
      pipWindow.close();
      setPipWindow(null);
    }
  }, [pipWindow]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (pipWindow) {
        pipWindow.close();
      }
    };
  }, [pipWindow]);

  return {
    pipWindow,
    isSupported,
    isOpen: !!pipWindow,
    openPiP,
    closePiP,
  };
}

export function PiPPortal({ pipWindow, children }) {
  if (!pipWindow) return null;
  return createPortal(children, pipWindow.document.body);
}
