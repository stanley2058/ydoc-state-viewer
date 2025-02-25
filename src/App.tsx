import { useEffect } from "react";
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
      displayOptionStore.setState({ display: ydoc });
      // @ts-expect-error expose ydoc for advance debug
      window.currentDoc = ydoc;
    } catch (e) {
      displayOptionStore.setState({ display: e });
    }

    if (
      typeof prev === "object" &&
      prev &&
      "destroy" in prev &&
      typeof prev.destroy === "function"
    ) {
      prev.destroy();
    }
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
        <div className="flex-1 overflow-auto bg-gray-800 rounded-lg p-4 [&>div]:px-4 [&>div]:py-2">
          <Viewer />
        </div>
      </main>
    </div>
  );
}

function Viewer() {
  const {
    display,
    indentWidth,
    enableClipboard,
    displaySize,
    displayDataTypes,
  } = useStore(displayOptionStore);
  return (
    <JsonViewer
      theme="dark"
      value={display}
      indentWidth={indentWidth}
      enableClipboard={enableClipboard}
      displayDataTypes={displayDataTypes}
      displaySize={displaySize}
      defaultInspectDepth={3}
    />
  );
}
