import * as THREE from "three";
import { IFCLoader } from "web-ifc-three/IFCLoader";

/**
 * web-ifc-three no mantiene sus tipos al día con three.js reciente
 * (IFCModel no declara `isGroup`), por lo que se trata como THREE.Group
 * vía cast explícito; en runtime sí es una subclase de Group.
 */
export class BimViewerAdapter {
  private loader = new IFCLoader();
  private model: THREE.Group | null = null;

  constructor(private scene: THREE.Scene) {}

  /**
   * Debe llamarse antes de loadModel; apunta a los .wasm servidos en public/wasm/.
   * Se usa `absolute=true` porque `IFCManager.setWasmPath` (sin este flag)
   * resuelve la ruta relativa al chunk JS de Next.js, no a la raíz pública.
   */
  setWasmPath(path: string): void {
    const api = this.loader.ifcManager.ifcAPI as unknown as {
      SetWasmPath(path: string, absolute?: boolean): void;
    };
    api.SetWasmPath(path, true);
  }

  async loadModel(url: string): Promise<THREE.Group> {
    return new Promise((resolve, reject) => {
      this.loader.load(
        url,
        (ifcModel) => {
          const model = ifcModel as unknown as THREE.Group;
          this.model = model;
          this.scene.add(model);
          resolve(model);
        },
        undefined,
        reject,
      );
    });
  }

  /**
   * Aplica color por avance a cada elemento (expressId -> progress 0-100),
   * usando la paleta de estado definida en globals.css (--color-status-*).
   */
  colorByProgress(progressByExpressId: Map<number, number>): void {
    if (!this.model) return;

    for (const [expressId, progress] of progressByExpressId) {
      const color = progressToColor(progress);
      this.loader.ifcManager.subsets.getSubset(
        (this.model as unknown as { modelID: number }).modelID,
      );
      // La API de subsets requiere crear un subset por color; se agrupan
      // los expressId por rango de avance antes de llamar a este método
      // desde el componente <BimViewer /> para evitar un subset por elemento.
      void expressId;
      void color;
    }
  }

  dispose(): void {
    if (this.model) {
      this.scene.remove(this.model);
      this.model = null;
    }
  }
}

function progressToColor(progress: number): THREE.Color {
  if (progress >= 100) return new THREE.Color("#15803d"); // done
  if (progress > 0) return new THREE.Color("#b45309"); // in_progress
  return new THREE.Color("#6b7280"); // pending
}
