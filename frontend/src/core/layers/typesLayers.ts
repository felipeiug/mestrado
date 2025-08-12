import { Node } from "@xyflow/react";

export type LayerTypeName = 'MoE' | 'Linear' | 'Conv1d' | 'Conv2d' | 'LSTM' | 'Dropout' | 'BatchNorm2d' | 'MultiheadAttention' | 'ReLU' | 'Sigmoid' | 'Tanh' | 'LeakyReLU' | 'GELU' | 'SiLU' | 'Softmax';

export type LayerBase = {
  name: LayerTypeName;
  category: string;
  desc?: string;
  inShape: number[];
  outShape: number[];
  onChange?: (node: Node) => void;
}

/**
 * The `Linear`
 * 
 * name: 'Linear';
 * 
 * bias?: boolean;
 * 
 * hiddenSize: number;
 * 
 * inShape: [number, number]; //BatchSize, inputSize
 * 
 * outShape: [number, number]; // BatchSize, outputSize
 *
 * @public
 */
export type Linear = LayerBase & {
  name: 'Linear';
  bias?: boolean;
  inShape: [number, number];
  outShape: [number, number];
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

/**
 * The `LSTM`
 * 
 * name: 'LSTM';
 * 
 * hiddenSize: number;
 * 
 * returnSequences?: boolean;
 * 
 * inShape: [number, number, number];                    //[batchSize, timesteps, features]
 * 
 * outShape: [number, number, number]|[number, number];  // Caso returnSequences => [batchSize, timesteps, hiddenSize] se não [batchSize, hiddenSize]
 *
 * @public
 */
export type LSTM = LayerBase & {
  name: 'LSTM';
  hiddenSize: number;
  returnSequences?: boolean;
  inShape: [number, number, number];                    //[batchSize, timesteps, features]
  outShape: [number, number] | [number, number, number];  // Caso returnSequences => [batchSize, hiddenSize] se não [batchSize, timesteps, hiddenSize]
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