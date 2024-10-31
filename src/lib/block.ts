export enum BlockType {
  Break,
  Hold,
  BPM
}

export interface Block {
  type: BlockType;
  durationS: number;
  bpm?: number;
}

