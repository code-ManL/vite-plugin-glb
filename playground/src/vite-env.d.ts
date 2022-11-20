/// <reference types="vite/client" />



interface ImportMeta {
  glb<T>(glob: string | string[], options?: GlobOptions<false>): Record<string, () => Promise<T>>,
  glb<T>(glob: string | string[], options: GlobOptions<true>): Record<string, T>,
  glb<T, K extends boolean>(
    glob: string | string[],
    options?: GlobOptions<K>
  ): K extends true
    ? Record<string, T>
    : Record<string, () => Promise<T>>
}


interface GlobOptions<K extends boolen> {
  as?: string,
  eager?: K
}