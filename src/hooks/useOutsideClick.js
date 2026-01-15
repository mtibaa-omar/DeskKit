import { useEffect, useRef } from "react";

/**
 * Hook to detect clicks outside of a referenced element
 * Creates and returns a ref that you attach to your element
 * @param {Function} handler - Callback when click is detected outside
 * @param {boolean} listenCapturing - Use capture phase instead of bubble phase (default: true)
 * @returns {React.RefObject} - Ref to attach to your element
 */
export function useOutsideClick(handler, listenCapturing = true) {
  const ref = useRef();
  
  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        handler();
      }
    }
    
    document.addEventListener("click", handleClick, listenCapturing);
    return () => document.removeEventListener("click", handleClick, listenCapturing);
  }, [handler, listenCapturing]);
  
  return ref;
}
