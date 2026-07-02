"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Upload } from "lucide-react";
import { BimViewerAdapter } from "@/modules/bim/viewer.adapter";

type LoadStatus = "idle" | "loading" | "ready" | "error";

/**
 * Visor 3D a pantalla completa: escena three.js con grid de referencia; al
 * subir un .ifc, lo carga vía BimViewerAdapter (web-ifc-three) y encuadra
 * la cámara. Requiere los .wasm de web-ifc en public/wasm/.
 */
export function BimViewer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const adapterRef = useRef<BimViewerAdapter | null>(null);
  const sceneRefs = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    controls: OrbitControls;
  } | null>(null);

  const [status, setStatus] = useState<LoadStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#e9eef6");

    const camera = new THREE.PerspectiveCamera(
      50,
      container.clientWidth / container.clientHeight,
      0.1,
      1000,
    );
    camera.position.set(6, 6, 6);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    const grid = new THREE.GridHelper(20, 20, 0x1e40af, 0xdbeafe);
    scene.add(grid);

    const light = new THREE.HemisphereLight(0xffffff, 0x444444, 1.5);
    scene.add(light);

    const adapter = new BimViewerAdapter(scene);
    adapter.setWasmPath("/wasm/");
    adapterRef.current = adapter;
    sceneRefs.current = { scene, camera, controls };

    let frameId: number;
    let idle = true;
    const animate = () => {
      if (idle) grid.rotation.y += 0.0015;
      controls.update();
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    const resizeObserver = new ResizeObserver(() => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    });
    resizeObserver.observe(container);

    return () => {
      idle = false;
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      controls.dispose();
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, []);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file || !adapterRef.current || !sceneRefs.current) return;

    setStatus("loading");
    setErrorMessage(null);
    setFileName(file.name);

    const url = URL.createObjectURL(file);
    try {
      const model = await adapterRef.current.loadModel(url);
      fitCameraToModel(model, sceneRefs.current.camera, sceneRefs.current.controls);
      setStatus("ready");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "No se pudo cargar el archivo .ifc");
    } finally {
      URL.revokeObjectURL(url);
      event.target.value = "";
    }
  }

  return (
    <div className="relative h-full w-full">
      <div ref={containerRef} className="h-full w-full" />

      <div className="pointer-events-none absolute inset-x-4 top-4 flex items-center gap-3">
        <label className="pointer-events-auto flex cursor-pointer items-center gap-2 rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium text-ink shadow-sm hover:bg-surface-alt">
          <Upload size={15} strokeWidth={2} />
          Subir archivo .ifc
          <input
            type="file"
            accept=".ifc"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
        {status === "loading" && (
          <span className="pointer-events-auto rounded-md bg-surface px-3 py-2 text-xs text-muted shadow-sm">
            Cargando {fileName}…
          </span>
        )}
        {status === "ready" && (
          <span className="pointer-events-auto rounded-md bg-surface px-3 py-2 text-xs text-status-done shadow-sm">
            {fileName} cargado
          </span>
        )}
        {status === "error" && (
          <span className="pointer-events-auto rounded-md bg-surface px-3 py-2 text-xs text-status-blocked shadow-sm">
            {errorMessage}
          </span>
        )}
      </div>
    </div>
  );
}

function fitCameraToModel(
  model: THREE.Group,
  camera: THREE.PerspectiveCamera,
  controls: OrbitControls,
): void {
  const box = new THREE.Box3().setFromObject(model);
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z, 1);
  const distance = maxDim / (2 * Math.tan((camera.fov * Math.PI) / 360));

  camera.position.set(
    center.x + distance,
    center.y + distance,
    center.z + distance,
  );
  camera.lookAt(center);
  controls.target.copy(center);
  controls.update();
}
