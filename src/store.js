import { create } from "zustand";
import { AspectRatio, FillColor, DefaultPadding } from "./constants";

// Load initial state from localStorage
const savedState = localStorage.getItem("appState");
const initialState = savedState
  ? JSON.parse(savedState)
  : {
      aspectRatio: AspectRatio.FourToFive,
      fillColor: FillColor.WHITE,
      padding: DefaultPadding,
    };

export const useStore = create((set) => ({
  ...initialState,

  setAspectRatio: (value) => set({ aspectRatio: value }),
  setFillColor: (value) => set({ fillColor: value }),
  setPadding: (value) => set({ padding: value }),
}));

useStore.subscribe((state) => {
  const { setAspectRatio, setFillColor, setPadding, ...pureState } = state;
  localStorage.setItem("appState", JSON.stringify(pureState));
});
