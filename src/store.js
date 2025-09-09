import { create } from "zustand";
import { AspectRatio, FillColor, DefaultPadding } from "./constants";

const savedRaw = localStorage.getItem("appState");
let savedState;

try {
  savedState = savedRaw ? JSON.parse(savedRaw) : null;
} catch (err) {
  console.warn("Failed to parse saved state:", err);
}

const initialState = savedState
  ? savedState
  : {
      aspectRatio: AspectRatio.FourToFive,
      fillColor: FillColor.WHITE,
      padding: DefaultPadding,
      isCroppingEnabled: false,
    };

export const useStore = create((set) => ({
  ...initialState,

  setAspectRatio: (value) => set({ aspectRatio: value }),
  setFillColor: (value) => set({ fillColor: value }),
  setPadding: (value) => set({ padding: value }),
  setIsCroppingEnabled: (value) => set({ isCroppingEnabled: value }),
}));

useStore.subscribe((state) => {
  const {
    setAspectRatio,
    setFillColor,
    setPadding,
    setIsCroppingEnabled,
    ...pureState
  } = state;
  localStorage.setItem("appState", JSON.stringify(pureState));
});
