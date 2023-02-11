export type SegmentInput = {
  type: string;
  'x-input': string;
  'y-input': string;
  'x-1-input'?: string;
  'y-1-input'?: string;
  'x-2-input'?: string;
  'y-2-input'?: string;
} & Record<string, string>;