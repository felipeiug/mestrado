export type LayerTypeName = 'MoE' | 'Linear' | 'Conv1d' | 'Conv2d' | 'LSTM' | 'Dropout' | 'BatchNorm2d' | 'MultiheadAttention' | 'ReLU' | 'Sigmoid' | 'Tanh' | 'LeakyReLU' | 'GELU' | 'SiLU' | 'Softmax';

export type LayerBase = {
  name: LayerTypeName;
  category: string;
  desc?: string;
  inShape: number[];
  outShape: number[];
  validateInShape: (shape: number[]) => boolean;
  validateOutShape: (shape: number[]) => boolean;
}

export type Linear = LayerBase & {
  name: 'Linear';
  bias?: boolean;
}

export type Conv1d = LayerBase & {
  name: 'Conv1d';
  kernelSize: number;
  stride?: number;
  padding?: number;
}

export type Conv2d = LayerBase & {
  name: 'Conv2d';
  kernelSize: number | [number, number];
  stride?: number | [number, number];
  padding?: number | [number, number];
  bias?: boolean;
}

export type LSTM = LayerBase & {
  name: 'LSTM';
  hiddenSize: number;
  inShape: [number, number]; //[timesteps, features]
  numLayers?: number;
}

export type Dropout = LayerBase & {
  name: 'Dropout';
  p?: number;  // Between 0 and 1
}

export type BatchNorm2d = LayerBase & {
  name: 'BatchNorm2d';
  numFeatures: number;
}

export type MultiheadAttention = LayerBase & {
  name: 'MultiheadAttention';
  embedDim: number;
  numHeads: number;
}

export type ReLU = LayerBase & {
  name: 'ReLU';
  inplace?: boolean;
}

export type Sigmoid = LayerBase & {
  name: 'Sigmoid';
}

export type Tanh = LayerBase & {
  name: 'Tanh';
}

export type LeakyReLU = LayerBase & {
  name: 'LeakyReLU';
  negativeSlope?: number;
  inplace?: boolean;
}

export type GELU = LayerBase & {
  name: 'GELU';
}

export type SiLU = LayerBase & {
  name: 'SiLU';
}

export type Softmax = LayerBase & {
  name: 'Softmax';
  dim?: number;
}

export type MoE = LayerBase & {
  name: 'MoE';
  experts: Omit<LayerType, 'MoE'>[];
  outFeatures: number;
  bias?: boolean;
}

export type LayerType = MoE | Linear | Conv1d | Conv2d | LSTM | Dropout | BatchNorm2d | MultiheadAttention | ReLU | Sigmoid | Tanh | LeakyReLU | GELU | SiLU | Softmax;