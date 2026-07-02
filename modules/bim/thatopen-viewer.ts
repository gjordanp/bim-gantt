import * as THREE from "three";
import * as OBC from "@thatopen/components";
import * as OBF from "@thatopen/components-front";
import type * as FRAGS from "@thatopen/fragments";

export type SelectedElement = {
  modelId: string;
  localId: number;
  globalId: string | null;
  name: string | null;
};

type World = OBC.SimpleWorld<OBC.SimpleScene, OBC.OrthoPerspectiveCamera, OBF.PostproductionRenderer>;

/**
 * Encapsula el setup de @thatopen/components: mundo 3D, carga de IFC,
 * hover (Hoverer) y selección con contorno (Highlighter + Outliner).
 * Ver https://docs.thatopen.com/Tutorials/Components/Front para la API.
 */
export class ThatOpenViewer {
  private components: OBC.Components;
  private world: World;
  private fragments: OBC.FragmentsManager;
  private highlighter: OBF.Highlighter;
  private selectionCallbacks = new Set<(elements: SelectedElement[]) => void>();

  private constructor(components: OBC.Components, world: World, fragments: OBC.FragmentsManager, highlighter: OBF.Highlighter) {
    this.components = components;
    this.world = world;
    this.fragments = fragments;
    this.highlighter = highlighter;
  }

  static async create(container: HTMLElement): Promise<ThatOpenViewer> {
    // React StrictMode monta el efecto dos veces en desarrollo; si un
    // canvas de una instancia anterior quedó en el contenedor, lo limpiamos
    // para que PostproductionRenderer no apile un segundo <canvas>.
    container.innerHTML = "";

    const components = new OBC.Components();
    const worlds = components.get(OBC.Worlds);
    const world = worlds.create<OBC.SimpleScene, OBC.OrthoPerspectiveCamera, OBF.PostproductionRenderer>();

    world.scene = new OBC.SimpleScene(components);
    world.scene.setup();
    world.scene.three.background = new THREE.Color("#e9eef6");

    world.renderer = new OBF.PostproductionRenderer(components, container);
    world.camera = new OBC.OrthoPerspectiveCamera(components);

    components.init();

    const grids = components.get(OBC.Grids);
    const grid = grids.create(world);
    grid.config.color = new THREE.Color(0x1e40af);
    grid.config.primarySize = 1;
    grid.config.secondarySize = 10;
    grid.fade = false;

    components.get(OBC.Raycasters).get(world);

    const fragments = components.get(OBC.FragmentsManager);
    const workerUrl = await OBC.FragmentsManager.getWorker();
    fragments.init(workerUrl);
    fragments.list.onItemSet.add(({ value: model }) => {
      model.useCamera(world.camera.three);
      world.scene.three.add(model.object);
      fragments.core.update(true);
    });

    const ifcLoader = components.get(OBC.IfcLoader);
    await ifcLoader.setup({
      autoSetWasm: false,
      wasm: { path: "/wasm/", absolute: true },
    });

    const hoverer = components.get(OBF.Hoverer);
    hoverer.world = world;
    hoverer.enabled = true;
    hoverer.material = new THREE.MeshBasicMaterial({
      color: 0x1e40af,
      transparent: true,
      opacity: 0.4,
      depthTest: false,
    });

    const highlighter = components.get(OBF.Highlighter);
    highlighter.setup({
      world,
      selectMaterialDefinition: {
        color: new THREE.Color("#d97706"),
        opacity: 1,
        transparent: false,
        renderedFaces: 0,
      },
    });
    highlighter.multiple = "ctrlKey";

    const outliner = components.get(OBF.Outliner);
    world.renderer.postproduction.enabled = true;
    outliner.world = world;
    outliner.enabled = true;
    outliner.color = new THREE.Color(0xd97706);
    outliner.fillColor = new THREE.Color(0xd97706);
    outliner.fillOpacity = 0.15;
    outliner.thickness = 2;

    highlighter.events.select.onHighlight.add((modelIdMap) => {
      outliner.clean();
      outliner.addItems(modelIdMap);
    });
    highlighter.events.select.onClear.add(() => {
      outliner.clean();
    });

    const viewer = new ThatOpenViewer(components, world, fragments, highlighter);
    viewer.wireSelectionEvents();
    return viewer;
  }

  private wireSelectionEvents(): void {
    const notify = async (modelIdMap: OBC.ModelIdMap) => {
      const elements = await this.resolveElements(modelIdMap);
      for (const cb of this.selectionCallbacks) cb(elements);
    };
    this.highlighter.events.select.onHighlight.add(notify);
    this.highlighter.events.select.onClear.add(() => {
      for (const cb of this.selectionCallbacks) cb([]);
    });
  }

  private async resolveElements(modelIdMap: OBC.ModelIdMap): Promise<SelectedElement[]> {
    const elements: SelectedElement[] = [];
    for (const [modelId, localIdSet] of Object.entries(modelIdMap)) {
      if (!localIdSet || localIdSet.size === 0) continue;
      const model = this.fragments.list.get(modelId);
      if (!model) continue;

      const localIds = Array.from(localIdSet);
      const itemsData = await model.getItemsData(localIds, { attributesDefault: true });
      for (let i = 0; i < localIds.length; i++) {
        const data = itemsData[i] as Record<string, { value?: unknown } | undefined>;
        elements.push({
          modelId,
          localId: localIds[i],
          globalId: (data?.GlobalId?.value as string) ?? null,
          name: (data?.Name?.value as string) ?? null,
        });
      }
    }
    return elements;
  }

  onSelectionChange(callback: (elements: SelectedElement[]) => void): () => void {
    this.selectionCallbacks.add(callback);
    return () => this.selectionCallbacks.delete(callback);
  }

  /** Descarga de la escena todos los modelos cargados actualmente. */
  async clearModels(): Promise<void> {
    const modelIds = Array.from(this.fragments.list.keys());
    await Promise.all(modelIds.map((id) => this.fragments.core.disposeModel(id)));
  }

  async loadIfc(buffer: Uint8Array, name: string): Promise<FRAGS.FragmentsModel> {
    await this.clearModels();
    const ifcLoader = this.components.get(OBC.IfcLoader);
    const model = await ifcLoader.load(buffer, false, name);
    await this.fitToModel(model);
    return model;
  }

  private async fitToModel(model: FRAGS.FragmentsModel): Promise<void> {
    const box = new THREE.Box3().setFromObject(model.object);
    if (box.isEmpty()) return;
    await this.world.camera.controls.fitToBox(box, true);
  }

  dispose(): void {
    try {
      this.components.dispose();
    } catch {
      // React StrictMode monta el efecto dos veces en desarrollo; la
      // creación async puede seguir en curso cuando llega el cleanup del
      // primer montaje, dejando algún sub-componente a medio inicializar.
      // No hay estado útil que perder aquí: el visor se está descartando.
    }
  }
}
