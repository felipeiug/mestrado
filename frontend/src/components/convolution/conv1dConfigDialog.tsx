import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button
} from '@mui/material';
import { Conv1DConfig } from './conv1dConfig';
import { useState } from 'react';

interface Conv1DConfigDialogProps {
  open: boolean;
  initialConfig?: Conv1DConfig;
  onClose: () => void;
  onSave: (config: Conv1DConfig) => void;
}

const Conv1DConfigDialog: React.FC<Conv1DConfigDialogProps> = ({ initialConfig, open, onClose, onSave }) => {

  const [config, setConfig] = useState<Conv1DConfig>(initialConfig ?? {
    filters: 32,
    kernelSize: 3,
    strides: 1,
    padding: 'valid',
  });

  const handleSave = () => {
    onSave(config);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Conv1D Configuration</DialogTitle>
      <DialogContent>
        <Conv1DConfig
          onChange={setConfig}
          initialConfig={initialConfig}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Cancelar</Button>
        <Button onClick={handleSave} variant="contained" color="primary">Salvar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default Conv1DConfigDialog;
