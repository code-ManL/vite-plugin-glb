import fg from 'fast-glob'
import { dirname } from "path";
import MagicString from "magic-string";
import { parse } from 'acorn'
import type { Literal, ArrayExpression, ObjectExpression, Property, Identifier } from 'estree'

const importGlobRE = /\bimport\.meta\.glb(?:<\w+>)?\(([\s\S]*?)\)/g
const importPrefix = '__vite_glob_next_'
/**
 * @param {string} code 文件的内容 
 * @param {string} id 匹配到的文件的路径
 * @returns  
 */
export async function transform(code: string, id: string) {
  const maths = Array.from(code.matchAll(importGlobRE))
  if (!maths.length) {
    return
  }

  const s = new MagicString(code)

  let num = 0
  for (const match of maths) {

    const argumentString = `[${match[1]}]`


    // @ts-expect-error let me do it  
    const ast = parse(argumentString, { ecmaVersion: 'latest' }).body[0].expression as ArrayExpression
    const arg1 = ast.elements[0] as Literal | ArrayExpression
    const globs: string[] = []


    if (arg1.type === 'ArrayExpression') {
      for (const elelment of arg1.elements) {
        if (elelment?.type === 'Literal') {
          globs.push(elelment.value as string)
        }
      }
    } else {
      globs.push(arg1.value as string)

    }

    // @ts-expect-error let me do it
    const options: GlobOptions<boolean> = {}

    const arg2 = ast.elements[1] as ObjectExpression | undefined

    if (arg2) {
      for (const property of arg2.properties) {
        // @ts-expect-error let me do it
        options[property.key.name] = property.value.value
      }
    }

    const files = await fg(globs, { dot: true, cwd: dirname(id) })

    const start = match.index! // import.meta.globNext("./fixtures/*.ts") -> start
    const end = start + match[0].length // start + import.meta.globNext("./fixtures/*.ts").length  -> end
    const query = options.as ? `?${options.as}` : ''

    if (options.eager) {
      const imports = files.map((file, index) => `import * as ${importPrefix}${num}_${index} from '${file}${query}'`).join('\n')
      s.prepend(`${imports}\n`)
      const replacement = `{\n${files.map((file, index) => `'${file}': ${importPrefix}${num}_${index}`).join(',\n')}\n}`
      s.overwrite(start, end, replacement)
    } else {
      const replacement = `{\n${files.map(i => `'${i}': () => import('${i}${query}')`).join(',\n')}\n}`
      s.overwrite(start, end, replacement)
    }
    num += 1
  }
  return {
    code: s.toString(),
    map: s.generateMap()
  }

}