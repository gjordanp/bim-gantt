"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { BimViewerAdapter } from "@/modules/bim/viewer.adapter";

type LoadStatus = "idle" | "loading" | "ready" | "error";

/**
 * Visor 3D: escena three.js con grid de referencia; al subir un .ifc,
 * lo carga vía BimViewerAdapter (web-ifc-three) y encuadra la cámara.
 * Requiere los .wasm de web-ifc en public/wasm/ (ver ifcManager.setWasmPath).
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
    scene.background = new THREE.Color("#f3f4f6");

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

    const grid = new THREE.GridHelper(20, 20, 0xb91c1c, 0xe5e7eb);
    scene.add(grid);

    const light = new THREE.HemisphereLight(0xffffff, 0x444444, 1.5);
    scene.add(light);

    const adapter = new BimViewerAdapter(scene);
    adapter.setWasmPath("/wasm/");
    adapterRef.current = adapter;
    sceneRefs.current = { scene, camera, controls };

    let frameId: number;
    const animate = () => {
      if (status === "idle") grid.rotation.y += 0.0015;
      controls.update();
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);
      controls.dispose();
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    <div className="flex flex-col gap-3">
      <div
        ref={containerRef}
        className="h-80 w-full overflow-hidden rounded border border-border"
      />
      <div className="flex items-center gap-3">
        <label className="kg-chip w-fit cursor-pointer text-primary">
          Subir archivo .ifc
          <input
            type="file"
            accept=".ifc"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
        {status === "loading" && (
          <span className="text-xs text-muted">Cargando {fileName}…</span>
        )}
        {status === "ready" && (
          <span className="text-xs text-status-done">{fileName} cargado</span>
        )}
        {status === "error" && (
          <span className="text-xs text-status-blocked">{errorMessage}</span>
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
