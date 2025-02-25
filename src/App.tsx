import { useEffect, useMemo } from "react";
import { JsonViewer } from "@textea/json-viewer";
import { Sidebar } from "./components/sidebar";
import { Input } from "@/components/ui/input";
import * as Y from "yjs";
import { Buffer } from "buffer";
import { useStore } from "zustand";
import { displayOptionStore, yDocOptionStore } from "./lib/store";

export default function App() {
  const { apiVersion, inputBuffer } = useStore(yDocOptionStore);

  useEffect(() => {
    const prev = displayOptionStore.getState().display;
    const buf = new Uint8Array(Buffer.from(inputBuffer, "hex"));
    const ydoc = new Y.Doc();

    try {
      if (buf.length > 0) {
        if (apiVersion === "v1") Y.applyUpdate(ydoc, buf);
        if (apiVersion === "v2") Y.applyUpdateV2(ydoc, buf);
      }
      displayOptionStore.setState({ display: ydoc, displayError: null });
      // @ts-expect-error expose ydoc for advance debug
      window.currentDoc = ydoc;
    } catch (e) {
      // @ts-expect-error expose ydoc for advance debug
      window.currentDoc = null;
      ydoc.destroy();
      displayOptionStore.setState({ display: null, displayError: e });
    }

    if (prev && prev.destroy) prev.destroy();
  }, [inputBuffer, apiVersion]);

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar />
      <main className="flex-1 flex flex-col p-4">
        <Input
          type="text"
          placeholder="Enter HEX state here"
          value={inputBuffer}
          onChange={(e) =>
            yDocOptionStore.setState({ inputBuffer: e.target.value })
          }
          className="mb-4 bg-gray-800 text-white border-gray-700"
        />
        <div className="flex-1 gap-4 grid grid-cols-2 overflow-auto bg-gray-800 rounded-lg p-4 [&>div]:px-4 [&>div]:py-2">
          <MainViewer />
          <SideViewer />
        </div>
      </main>
    </div>
  );
}

function MainViewer() {
  const {
    display,
    displayError,
    indentWidth,
    enableClipboard,
    displaySize,
    displayDataTypes,
  } = useStore(displayOptionStore);
  return (
    <JsonViewer
      theme="dark"
      value={displayError ?? display}
      indentWidth={indentWidth}
      enableClipboard={enableClipboard}
      displayDataTypes={displayDataTypes}
      displaySize={displaySize}
      defaultInspectDepth={3}
    />
  );
}

function SideViewer() {
  const {
    display,
    displayError,
    indentWidth,
    enableClipboard,
    displaySize,
    displayDataTypes,
  } = useStore(displayOptionStore);
  const getApiType = useStore(yDocOptionStore, (s) => s.getApiType);
  const contentDisplay = useMemo(() => {
    if (!display) return null;
    try {
      const ydoc = new Y.Doc();
      Y.applyUpdateV2(ydoc, Y.encodeStateAsUpdateV2(display));
      const displayObj: Record<string, unknown> = {};
      for (const key of ydoc.share.keys()) {
        displayObj[key] = ydoc[getApiType](key);
      }
      ydoc.destroy();
      return displayObj;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      return null;
    }
  }, [display, getApiType]);
  return (
    <JsonViewer
      theme="dark"
      value={displayError ?? contentDisplay}
      indentWidth={indentWidth}
      enableClipboard={enableClipboard}
      displayDataTypes={displayDataTypes}
      displaySize={displaySize}
      defaultInspectDepth={3}
    />
  );
}
