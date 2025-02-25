import { createStore } from "zustand";
import { persist } from "zustand/middleware";

interface DisplayOptionStore {
  display: unknown;
  indentWidth: number;
  enableClipboard: boolean;
  displayDataTypes: boolean;
  displaySize: boolean;
}

interface YDocOptionStore {
  inputBuffer: string;
  apiVersion: "v1" | "v2";
}

export const displayOptionStore = createStore<DisplayOptionStore>()(
  persist<DisplayOptionStore>(
    () => ({
      display: null,
      indentWidth: 4,
      enableClipboard: true,
      displayDataTypes: false,
      displaySize: true,
    }),
    {
      name: "ydoc-inspector-display-option",
    },
  ),
);

export const yDocOptionStore = createStore<YDocOptionStore>()(
  persist<YDocOptionStore>(
    () => ({
      inputBuffer: "",
      apiVersion: "v1",
    }),
    { name: "ydoc-inspector-ydoc-option" },
  ),
);
