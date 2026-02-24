import { useEffect, useRef } from "react";
import { AppState } from "react-native";

export function useAppForeground(callback: () => void) {
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (appState.current.match(/background/) && nextAppState === "active") {
        callback();
      }
      appState.current = nextAppState;
    });

    return () => subscription.remove();
  }, [callback]);
}
