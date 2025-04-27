import { Alert, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar } from "@mui/material";
import { createContext, useContext, useState } from "react";

export interface MyError {
  error: string;
  message?: string;
  onClose?: () => void;
  type?: "dialog" | "snackbar";
}


const ErrorContext = createContext<(error: MyError) => void>(() => {
  // 
});

export const useError = () => {
  return useContext(ErrorContext);
};

export const ErrorProvider: React.FC<Props> = ({ children }) => {
  const [error, setError] = useState<MyError>();

  const handleClose = () => {
    setError(undefined);
    if (error?.onClose) error.onClose();
  };

  return (
    <ErrorContext.Provider value={setError}>
      {children}

      {/* Snackbar para erros rápidos */}
      {error?.type === "snackbar" && (
        <Snackbar
          open={Boolean(error)}
          autoHideDuration={6000}
          onClose={handleClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
            {error.error}
            {error.message && <div>{error.message}</div>}
          </Alert>
        </Snackbar>
      )}

      {/* Dialog para erros importantes */}
      {error && (error.type ?? "dialog") === "dialog" && (
        <Dialog
          open={Boolean(error)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {error.error}
          </DialogTitle>
          {error.message && <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {error.message}
            </DialogContentText>
          </DialogContent>}

          <DialogActions>
            <Button onClick={handleClose} autoFocus>
              Fechar
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </ErrorContext.Provider>
  );
};

type Props = { children?: React.ReactNode; };