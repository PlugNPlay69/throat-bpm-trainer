enum BlockType {
  'pause',
  'hold',
  'bpm'
}

interface Block {
  type: BlockType;
  durationS: number;
  bpm?: number;
}

