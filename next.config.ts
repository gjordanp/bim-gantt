import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Fija la raíz explícitamente: hay un package-lock.json ajeno en el
    // directorio padre (C:\Users\gjordan\) que Turbopack detecta e infiere
    // erróneamente como workspace root.
    root: path.join(__dirname),
  },
};

export default nextConfig;
