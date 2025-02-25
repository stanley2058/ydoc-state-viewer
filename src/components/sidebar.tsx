import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useStore } from "zustand";
import { displayOptionStore, yDocOptionStore } from "@/lib/store";

export function Sidebar() {
  return (
    <aside className="w-64 bg-gray-900 p-4 flex flex-col gap-4">
      <h2 className="text-xl font-bold">Options</h2>
      <YDocOptions />
      <DisplayOptions />
    </aside>
  );
}

function YDocOptions() {
  const { apiVersion } = useStore(yDocOptionStore);
  return (
    <>
      <h3 className="text-lg font-semibold mt-2">Y.Doc Options</h3>

      <h4 className="text-sm font-semibold">API Version</h4>
      <div className="flex items-center space-x-2">
        <RadioGroup
          value={`option-${apiVersion}`}
          onValueChange={(v) =>
            yDocOptionStore.setState({
              apiVersion: v.split("-")[1] as "v1" | "v2",
            })
          }
        >
          <div className="flex items-center">
            <Label
              htmlFor="option-v1"
              className="cursor-pointer flex gap-2 justify-center items-center"
            >
              <RadioGroupItem value="option-v1" id="option-v1" />
              <span>V1</span>
            </Label>
          </div>
          <div className="flex items-center">
            <Label
              htmlFor="option-v2"
              className="cursor-pointer flex gap-2 justify-center items-center"
            >
              <RadioGroupItem value="option-v2" id="option-v2" />
              <span>V2</span>
            </Label>
          </div>
        </RadioGroup>
      </div>
    </>
  );
}

function DisplayOptions() {
  const { indentWidth, enableClipboard, displayDataTypes, displaySize } =
    useStore(displayOptionStore);
  return (
    <>
      <h3 className="text-lg font-semibold mt-2">Display Options</h3>

      <div className="space-y-2">
        <Label htmlFor="indent-width">Indent Width: {indentWidth}</Label>
        <Slider
          id="indent-width"
          min={1}
          max={8}
          step={1}
          value={[indentWidth]}
          onValueChange={(value) =>
            displayOptionStore.setState({ indentWidth: value[0] })
          }
          className="inline-flex"
        />
      </div>

      <div className="flex items-center">
        <Label
          htmlFor="clipboard"
          className="cursor-pointer flex gap-2 justify-center items-center"
        >
          <Switch
            id="clipboard"
            checked={enableClipboard}
            onCheckedChange={(e) =>
              displayOptionStore.setState({ enableClipboard: e })
            }
          />
          <span>Enable Clipboard</span>
        </Label>
      </div>

      <div className="flex items-center">
        <Label
          htmlFor="data-types"
          className="cursor-pointer flex gap-2 justify-center items-center"
        >
          <Switch
            id="data-types"
            checked={displayDataTypes}
            onCheckedChange={(e) =>
              displayOptionStore.setState({ displayDataTypes: e })
            }
          />
          <span>Display Data Types</span>
        </Label>
      </div>

      <div className="flex items-center">
        <Label
          htmlFor="size"
          className="cursor-pointer flex gap-2 justify-center items-center"
        >
          <Switch
            id="size"
            checked={displaySize}
            onCheckedChange={(e) =>
              displayOptionStore.setState({ displaySize: e })
            }
          />
          <span>Display Size</span>
        </Label>
      </div>
    </>
  );
}
