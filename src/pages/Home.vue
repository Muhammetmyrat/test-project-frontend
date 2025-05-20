<script setup lang="ts">
import { ref } from 'vue'
import { Container, Draggable, type DropResult } from 'vue3-smooth-dnd'
import { applyDrag } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Move } from 'lucide-vue-next'
import ConfirmDialog from '@/components/ConfirmDialog.vue'

interface Item {
  id: number
  name: string
}

const userItems = ref<Item[]>([
  { id: 1, name: 'Shoes 1' },
  { id: 2, name: 'Shoes 2' },
  { id: 3, name: 'Shoes 3' },
  { id: 4, name: 'Shoes 4' },
  { id: 5, name: 'T-shirt 1' },
  { id: 6, name: 'T-shirt 2' },
  { id: 7, name: 'T-shirt 3' },
  { id: 8, name: 'T-shirt 4' },
])

const selectableItems = ref<Item[]>([
  { id: 11, name: 'Jacket 1' },
  { id: 12, name: 'Jacket 2' },
  { id: 13, name: 'Jacket 3' },
  { id: 14, name: 'Jacket 4' },
  { id: 15, name: 'Hoodie 1' },
  { id: 16, name: 'Hoodie 2' },
  { id: 17, name: 'Hoodie 3' },
  { id: 18, name: 'Hoodie 4' },
])

const selectedUserItems = ref<Item[]>([])
const selectedItem = ref<Item | null>(null)

const itemToRemove = ref<Item | null>(null)
const itemToRemoveSelectable = ref<'items' | 'item'>('items')

function toggleUserItem(item: Item, checked: boolean | string) {
  if (checked) {
    if (selectedUserItems.value.length < 6 && !isUserItemSelected(item)) {
      selectedUserItems.value.push(item)
    }
  } else {
    selectedUserItems.value = selectedUserItems.value.filter(
      i => i.id !== item.id
    )
  }
}

function removeUserItem(item: Item) {
  if (itemToRemoveSelectable.value === 'items') {
    selectedUserItems.value = selectedUserItems.value.filter(
      i => i.id !== item.id
    )
  } else {
    selectedItem.value = null
  }
}

function confirmRemoveUserItem(item: Item, value: 'items' | 'item' = 'items') {
  itemToRemove.value = item
  itemToRemoveSelectable.value = value
}

function handleConfirmRemove() {
  if (itemToRemove.value) {
    removeUserItem(itemToRemove.value)
    handleCloseDialog()
  }
}

function handleCloseDialog() {
  itemToRemove.value = null
}

function isUserItemSelected(item: Item) {
  return selectedUserItems.value.some(i => i.id === item.id)
}

function selectItem(item: Item, checked: boolean | string) {
  selectedItem.value = checked ? item : null
}

function onSelectedUserItemsDrop(dropResult: DropResult) {
  selectedUserItems.value = applyDrag(selectedUserItems.value, dropResult)
}
</script>

<template>
  <div class="h-full w-full flex items-start justify-center">
    <div class="max-w-5xl w-full flex flex-col gap-4 p-4">
      <div class="p-6 space-y-8">
        <div class="grid grid-cols-2 gap-6">
          <Card>
            <CardContent>
              <Container
                orientation="horizontal"
                behaviour="move"
                @drop="onSelectedUserItemsDrop"
                drag-handle-selector=".drag-handle"
                style="display: flex !important"
                class="flex-wrap gap-2"
              >
                <template v-if="selectedUserItems.length > 0">
                  <Draggable v-for="item in selectedUserItems" :key="item.id">
                    <div
                      class="flex items-center gap-1 bg-muted text-sm px-2 py-1 rounded"
                    >
                      <Move
                        class="w-3 h-3 text-muted-foreground cursor-move drag-handle"
                      />
                      {{ item.name }}
                      <button
                        @click="confirmRemoveUserItem(item, 'items')"
                        class="text-red-500 hover:text-red-700 text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  </Draggable>
                </template>
                <template v-else>
                  <div class="text-sm text-muted-foreground italic px-2 py-1">
                    No items selected
                  </div>
                </template>
              </Container>

              <p class="mt-2 text-sm text-muted-foreground">
                Selected: {{ selectedUserItems.length }} / 6
              </p>
            </CardContent>
          </Card>

          <Card class="flex items-center justify-center">
            <CardContent>
              <template v-if="selectedItem">
                <div class="flex items-center justify-center gap-2 text-lg">
                  <span>{{ selectedItem.name }}</span>
                  <button
                    @click="confirmRemoveUserItem(selectedItem, 'item')"
                    class="text-red-500 hover:text-red-700 text-sm"
                  >
                    ✕
                  </button>
                </div>
              </template>
              <template v-else>
                <div class="text-sm text-muted-foreground italic text-center">
                  No item selected
                </div>
              </template>
            </CardContent>
          </Card>
        </div>

        <div class="grid grid-cols-2 gap-6">
          <Card>
            <CardContent class="flex flex-wrap gap-4">
              <div
                v-for="item in userItems"
                :key="item.id"
                class="flex items-center space-x-2"
              >
                <Checkbox
                  :model-value="isUserItemSelected(item)"
                  @update:model-value="checked => toggleUserItem(item, checked)"
                />
                <label class="text-sm">{{ item.name }}</label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent class="flex flex-wrap gap-4">
              <div
                v-for="item in selectableItems"
                :key="item.id"
                class="flex items-center space-x-2"
              >
                <Checkbox
                  :model-value="selectedItem?.id === item.id"
                  @update:model-value="checked => selectItem(item, checked)"
                />
                <label class="text-sm">{{ item.name }}</label>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </div>

  <ConfirmDialog
    :open="itemToRemove ? true : false"
    :description="`Удалить ${itemToRemove?.name}?`"
    @close="handleCloseDialog"
    @confirm="handleConfirmRemove"
  />
</template>
