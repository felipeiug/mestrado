import {
  TextField, MenuItem, Grid
} from '@mui/material';
import { useState } from 'react';


export interface Conv1DConfig {
  inputshape: [number, number, number];
  filters: number;
  kernelSize: number;
  strides: number;
  padding: 'valid' | 'same';
}

export interface Conv1DProps {
  initialConfig?: Conv1DConfig;
  onChange?: (config: Conv1DConfig) => void;
}

export const Conv1DConfig: React.FC<Conv1DProps> = ({ initialConfig, onChange }) => {
  const [config, setConfig] = useState<Conv1DConfig>(initialConfig ?? {
    inputshape: [3, 24, 3],
    filters: 32,
    kernelSize: 3,
    strides: 1,
    padding: 'valid',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const { name, value } = e.target;
    const newConfig = {
      ...config,
      [name]: ['filters', 'kernelSize', 'strides'].includes(name)
        ? parseInt(value)
        : value
    };

    if (!isConv1DConfigValid(newConfig.inputshape[2], newConfig.filters, newConfig.kernelSize, newConfig.strides, newConfig.padding)) {
      return;
    }

    setConfig(newConfig);
    onChange?.(newConfig);
  };

  return <Grid container spacing={2} mt={1}>
    <Grid size={6}>
      <TextField
        label="Filters"
        name="filters"
        type="number"
        fullWidth
        value={config.filters}
        onChange={handleChange}
      />
    </Grid>
    <Grid size={6}>
      <TextField
        label="Kernel Size"
        name="kernelSize"
        type="number"
        fullWidth
        value={config.kernelSize}
        onChange={handleChange}
      />
    </Grid>
    <Grid size={6}>
      <TextField
        sx={{ zIndex: 100 }}
        label="Strides"
        name="strides"
        type="number"
        fullWidth
        value={config.strides}
        onChange={handleChange}
      />
    </Grid>
    <Grid size={6}>
      <TextField
        select
        sx={{ zIndex: 10000 }}
        label="Padding"
        name="padding"
        fullWidth
        value={config.padding}
        onChange={handleChange}
      >
        <MenuItem value="valid">valid</MenuItem>
        <MenuItem value="same">same</MenuItem>
      </TextField>
    </Grid>
  </Grid>;
}

export const isConv1DConfigValid = (inputSteps: number, filters: number, kernelSize: number, strides: number, padding: 'valid' | 'same') => {
  if (filters < 1) return false;

  const pad = padding === 'same' ? Math.floor(kernelSize / 2) : 0;
  const outputSteps = Math.floor((inputSteps + 2 * pad - kernelSize) / strides + 1);

  return (kernelSize >= 1 && strides >= 1 && kernelSize <= (inputSteps + 2 * pad) && outputSteps > 0);
}

export const getConv1DOutputShape = (config: Conv1DConfig) => {
  const [batchSize, inputSteps, _] = config.inputshape;
  const { kernelSize, strides, padding, filters } = config;

  const pad = padding === 'same' ? Math.floor(kernelSize / 2) : 0;

  const outputSteps = Math.floor((inputSteps + 2 * pad - kernelSize) / strides + 1);

  if (outputSteps <= 0) {
    throw new Error(`Output shape inválido: outputSteps = ${outputSteps}`);
  }

  return [batchSize, outputSteps, filters] as [number, number, number];
};