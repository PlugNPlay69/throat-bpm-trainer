enum BlockType {
  Pause,
  Hold,
  BPM
}

interface Block {
  type: BlockType;
  durationS: number;
  bpm?: number;
}

