export interface ModuleType {
  name: string
}

export const list1 = import.meta.glb<ModuleType>('./modules/*.ts')

export const list2 = import.meta.glb([
  './modules/*.ts',
  '!**/index.ts'
])

export const list3 = import.meta.glb<ModuleType>([
  './modules/*.ts',
  '!**/index.ts'
], { eager: true, as: 'raw' })


export const list4 = import.meta.glb<ModuleType>([
  './modules/*.ts',
], { eager: true })