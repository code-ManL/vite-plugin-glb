import type { Plugin } from "vite";
import { transform } from './transform'

export interface Options { }

// dirname返回path的目录名，path.dirname('/foo/bar/baz/asdf/quux');  '/foo/bar/baz/asdf'
export default function (_options: Options = {}): Plugin {
  return {
    name: 'vite-plugin-glb',
    transform(code, id) {
      return transform(code, id)
    }
  }
}