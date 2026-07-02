import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // web-ifc (Node build) resuelve la ruta de su .wasm relativa a su propio
  // __dirname; si Next lo empaqueta en el bundle del servidor esa ruta se
  // rompe (ENOENT en una ruta inventada). Se mantiene como paquete externo
  // para que se cargue tal cual desde node_modules en runtime.
  serverExternalPackages: ["web-ifc"],
  turbopack: {
    // Fija la raíz explícitamente: hay un package-lock.json ajeno en el
    // directorio padre (C:\Users\gjordan\) que Turbopack detecta e infiere
    // erróneamente como workspace root.
    root: path.join(__dirname),
    resolveAlias: {
      // three/examples/jsm/loaders/TTFLoader.js (importado estáticamente por
      // @thatopen/components-front, aunque no usamos carga de fuentes .ttf)
      // hace `import opentype from "https://cdn.jsdelivr.net/npm/opentype.js@1.3.4/+esm"`.
      // Turbopack no soporta imports ESM de URLs externas absolutas; se
      // redirige a un stub local. Ver shims/opentype-stub.js.
      "https://cdn.jsdelivr.net/npm/opentype.js@1.3.4/+esm": "./shims/opentype-stub.js",
    },
  },
};

export default nextConfig;
