export interface DragResult<T = any> {
  removedIndex: number | null
  addedIndex: number | null
  payload: T
}
