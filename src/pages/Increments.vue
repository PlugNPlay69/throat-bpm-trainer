<script setup lang="ts">
import { BlockType } from "../lib/block.ts";
import { Button } from "@/components/ui/button";
import BlockList from "@/components/BlockList.vue";
import { usePlayer } from "../lib/player.ts";
import { watch } from "vue";

const { start, stop, isRunning, currentBlock, blocks } = usePlayer();

blocks.value = [
  {
    type: BlockType.BPM,
    nTotal: 2,
    bpm: 15,
  },
  {
    type: BlockType.Break,
    durationS: 2,
  },
];

const toggle = () => {
  if (isRunning.value) {
    stop();
    return;
  }

  start(); // not awaiting, it should run in the background
};

let nChanges = 0;

watch(currentBlock, (newBlock) => {
  // during break, update bpm and number of times
  if (newBlock == 1) {
    const bpmBlock = blocks.value[0];
    bpmBlock.nTotal! += 1;
    bpmBlock.bpm! += 5;

    nChanges++;
  }

  // every third round, increase break time
  if (nChanges % 3 == 0) {
    const breakBlock = blocks.value[1];
    breakBlock.durationS! += 2;
  }
});
</script>

<template>
  <Button @click="toggle">{{ isRunning ? "Stop" : "Start" }}</Button>
  <BlockList :blocks="blocks" :currentBlock="currentBlock" />
</template>
