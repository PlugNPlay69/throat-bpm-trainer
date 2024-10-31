<
<script setup lang="ts">
import { Block, BlockType } from "../lib/block.ts";
import BlockEntry from "../components/BlockEntry.vue";

defineProps<{
  blocks: Block[];
  currentBlock: int;
}>();
</script>

<template>
  <div class="flex-1 flex flex-col gap-2 p-4 pt-0">
    <BlockEntry
      v-for="(block, index) of blocks"
      :block="block"
      :active="index === currentBlock"
    />
  </div>
</template>
