import { createStore } from "zustand";
import { persist } from "zustand/middleware";
import type * as Y from "yjs";

export const getApis = [
  "getArray",
  "getMap",
  "getText",
  "getXmlElement",
  "getXmlFragment",
] as const;
export type GetApi = (typeof getApis)[number];

interface DisplayOptionStore {
  display: Y.Doc | null;
  displayError: unknown;
  indentWidth: number;
  enableClipboard: boolean;
  displayDataTypes: boolean;
  displaySize: boolean;
}

interface YDocOptionStore {
  inputBuffer: string;
  apiVersion: "v1" | "v2";
  getApiType: GetApi;
}

export const displayOptionStore = createStore<DisplayOptionStore>()(
  persist<DisplayOptionStore>(
    () => ({
      display: null,
      displayError: null,
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
      getApiType: "getArray",
    }),
    { name: "ydoc-inspector-ydoc-option" },
  ),
);
