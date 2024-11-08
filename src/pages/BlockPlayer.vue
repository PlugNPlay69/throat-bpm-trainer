<script setup lang="ts">
import { Block, BlockType } from "../lib/block.ts";
import { Button } from "@/components/ui/button";
import BlockList from "@/components/BlockList.vue";
import { ref, computed } from "vue";
import { usePlayer } from "../lib/player.ts";

const { start, stop, isRunning, currentBlock, blocks } = usePlayer();

const tempBlocks: Block[] = [
  {
    type: BlockType.BPM,
    durationS: 15,
    bpm: 10,
  },
  {
    type: BlockType.BPM,
    durationS: 15,
    bpm: 30,
  },
  {
    type: BlockType.BPM,
    durationS: 15,
    bpm: 60,
  },
  {
    type: BlockType.Break,
    durationS: 15,
  },
];

blocks.value = tempBlocks;

const toggle = () => {
  console.log("toggle clicked");
  if (isRunning.value) {
    stop();
    return;
  }

  console.log("trying to play blocks");
  start(); // not awaiting, it should run in the background
};
</script>

<template>
  <Button @click="toggle">{{ isRunning ? "Stop" : "Start" }}</Button>
  <BlockList :blocks="blocks" :currentBlock="currentBlock" />
</template>
