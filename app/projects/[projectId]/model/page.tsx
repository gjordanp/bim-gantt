import { BimViewer } from "@/components/viewer/BimViewer";
import { ModelOverlays } from "@/components/viewer/ModelOverlays";
import { MOCK_TASKS } from "@/modules/shared/mock-data";

const MOCK_ELEMENTS = [
  { type: "IfcWall", count: 248 },
  { type: "IfcSlab", count: 36 },
  { type: "IfcColumn", count: 112 },
  { type: "IfcBeam", count: 97 },
];

export default function ModelPage() {
  return (
    <div className="relative h-full w-full">
      <BimViewer />
      <ModelOverlays elements={MOCK_ELEMENTS} tasks={MOCK_TASKS} />
    </div>
  );
}
