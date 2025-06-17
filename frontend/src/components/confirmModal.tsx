import React from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    DialogContentText,
} from '@mui/material';

interface ConfirmModalProps {
    open: boolean;
    title: string;
    message?: string;
    onCancel: () => void;
    onConfirm: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({ open, title, message, onCancel, onConfirm }) => {

    return (
        <Dialog open={open} onClose={onCancel} fullWidth maxWidth="xs">
            <DialogTitle>{title}</DialogTitle>
            {message &&
                <DialogContent>
                    <DialogContentText>
                        {message}
                    </DialogContentText>
                </DialogContent>
            }

            <DialogActions>
                <Button onClick={onCancel} variant="contained" color="primary">Cancel</Button>
                <Button onClick={onConfirm}>Confirm</Button>
            </DialogActions>
        </Dialog>
    );
};