// Stub para "opentype.js" (CDN externo importado estáticamente por
// three/examples/jsm/loaders/TTFLoader.js, un módulo que @thatopen/components-front
// referencia pero que esta app no usa — no cargamos fuentes .ttf en el visor).
// Turbopack no soporta imports ESM de URLs externas absolutas; ver next.config.ts
// (turbopack.resolveAlias) para el redirect.
export default {
  parse() {
    throw new Error("opentype.js stub: TTFLoader no está soportado en este visor.");
  },
};
