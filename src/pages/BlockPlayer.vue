<script setup lang="ts">
import { Block, BlockType } from "../lib/block.ts";
import { Button } from "@/components/ui/button";
import BlockList from "@/components/BlockList.vue";
import { ref, computed } from "vue";
import { usePlayer } from "../lib/player.ts";

const blocks: Block[] = [
  {
    type: BlockType.BPM,
    duration: 20,
    bpm: 10,
  },
  {
    type: BlockType.BPM,
    duration: 20,
    bpm: 30,
  },
  {
    type: BlockType.BPM,
    duration: 20,
    bpm: 60,
  },
  {
    type: BlockType.Break,
    duration: 10,
  },
];

// TODO use Player should return start, stop, running, currentBlock, blocks
const { playBlocks } = usePlayer();
const running = ref(false);
let stop;
let currentBlock = ref(-1);

const toggle = () => {
  console.log("toggle clicked");
  if (running.value) {
    stop();
    running.value = false;
    return;
  }

  console.log("trying to play blocks");
  const { stop_, currentBlock_ } = playBlocks(blocks);
  stop = stop_;
  currentBlock = currentBlock_;
  running.value = true;
};
</script>

<template>
  <Button @click="toggle">{{ running ? "Stop" : "Start" }}</Button>
  <BlockList :blocks="blocks" :currentBlock="currentBlock" />
</template>
