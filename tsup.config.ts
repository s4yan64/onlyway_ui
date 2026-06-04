import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  treeshake: true,
  // React + icônes restent fournis par l'app consommatrice (peerDeps).
  external: ["react", "react-dom", "lucide-react"],
  // Les composants utilisent des hooks/handlers → client components (Next App Router).
  banner: { js: '"use client";' },
});
