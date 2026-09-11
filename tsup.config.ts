import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  clean: true,

  /**
   * ⚠️ `treeshake` DOIT RESTER DÉSACTIVÉ.
   *
   * C'est lui qui supprimait la bannière `"use client"` en 0.1.1 : le `dist`
   * publié n'en contenait AUCUNE, et le paquet était donc inutilisable depuis
   * l'App Router — sans que rien ne le signale, ni au build, ni au typecheck.
   *
   * Une vérification automatique l'empêche désormais de se reproduire :
   *     npm run verify   (lancé par `prepublishOnly`)
   */
  treeshake: false,

  /**
   * LE PAQUET ENTIER EST CLIENT, ET C'EST UN CHOIX.
   *
   * Sur les six modules, deux seulement utilisent des hooks (`patterns.tsx`,
   * `useLongPress.ts`). La solution « propre » serait deux points d'entrée,
   * un serveur et un client. Elle est écartée : elle scinde la surface
   * d'import de TOUTES les applications de l'écosystème, pour économiser
   * quelques kilo-octets sur un paquet de 736 lignes.
   *
   * Un composant client reste rendu par un composant serveur sans difficulté ;
   * le seul coût réel est le JavaScript envoyé au navigateur, et il est
   * négligeable ici. À rouvrir si le paquet grossit d'un ordre de grandeur.
   */
  banner: { js: '"use client";' },

  // React et les icônes restent fournis par l'app consommatrice (peerDeps).
  external: ["react", "react-dom", "lucide-react"],
});
