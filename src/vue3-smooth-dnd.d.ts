declare module 'vue3-smooth-dnd' {
  import type { DefineComponent } from 'vue'

  export const Container: DefineComponent<any, any, any>
  export const Draggable: DefineComponent<any, any, any>

  export interface DropResult {
    removedIndex: number | null
    addedIndex: number | null
    payload: T
  }

  export function applyDrag<T>(arr: T[], dragResult: DropResult): T[]
}
