<script setup lang="ts">
import PWABadge from "./components/PWABadge.vue";
import BlockPlayer from "./pages/BlockPlayer.vue";
import Increments from "./pages/Increments.vue";
import RandomBpmSelfContained from "./pages/RandomBpmSelfContained.vue";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
</script>

<template>
  <Tabs default-value="blocks" class="w-[400px]">
    <TabsList>
      <TabsTrigger value="blocks">BlockPlayer</TabsTrigger>
      <TabsTrigger value="randomBPM">Random BPM</TabsTrigger>
      <TabsTrigger value="increments">Increments</TabsTrigger>
    </TabsList>
    <TabsContent value="blocks">
      <BlockPlayer />
    </TabsContent>
    <TabsContent value="randomBPM">
      <RandomBpmSelfContained />
    </TabsContent>
    <TabsContent value="increments">
      <Increments />
    </TabsContent>
  </Tabs>

  <PWABadge />
</template>

<style scoped></style>
