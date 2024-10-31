<script setup lang="ts">
import { Block, BlockType } from "../lib/block.ts";

defineProps<{
  block: Block;
  active: boolean;
}>();
</script>

<template>
  <div
    class="flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm"
  >
    <div class="flex w-full flex-col gap-1">
      <div class="flex items-center">
        <div class="flex items-center gap-2">
          <div class="font-semibold">{{ BlockType[block.type] }}</div>
          <span v-if="active" class="flex h-2 w-2 rounded-full bg-blue-600" />
        </div>
        <div class="ml-auto text-xs text-foreground">{{ block.duration }}s</div>
      </div>

      <div v-if="block.bpm" class="text-xs font-medium">
        BPM: {{ block.bpm }}
      </div>
    </div>
  </div>
</template>
