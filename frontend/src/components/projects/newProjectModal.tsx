import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Box,
} from '@mui/material';

interface CreateModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (name: string, description?: string, id?: number) => void;
  initialProject?: { id: number; name: string; description?: string; }
}

export const NewProjectModal: React.FC<CreateModalProps> = ({ initialProject, open, onClose, onCreate }) => {
  const [name, setName] = useState(initialProject?.name ?? "");
  const [description, setDescription] = useState<string | undefined>(initialProject?.description);
  const [nameError, setNameError] = useState(false);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    if (nameError && e.target.value.trim()) {
      setNameError(false);
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      setNameError(true);
      return;
    }
    onCreate(name, description, initialProject?.id);
    setName('');
    setDescription('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{`${initialProject ? 'Create a' : 'Edit'} Project`}</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Name"
            type="text"
            fullWidth
            variant="outlined"
            value={name.length === 0 ? initialProject?.name : name}
            onChange={handleNameChange}
            error={nameError}
            helperText={nameError ? 'Name is required' : ''}
          />
        </Box>
        <Box sx={{ mt: 2 }}>
          <TextField
            margin="dense"
            id="description"
            label="Description"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={4}
            value={(description ?? []).length === 0 ? initialProject?.description : description}
            onChange={handleDescriptionChange}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {initialProject? "Update": "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};