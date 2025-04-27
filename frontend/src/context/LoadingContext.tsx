import { CircularProgress, Dialog, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { createContext, useContext, useState } from "react";

export interface MyLoading {
  open: boolean;
  title?: string;
  message?: string;
  onClose?: () => void;
}


const LoadingContext = createContext<(loading: MyLoading) => void>(() => {
  // 
});

export const useLoading = () => {
  return useContext(LoadingContext);
};

export const LoadingProvider: React.FC<Props> = ({ children }) => {
  const [loading, setLoading] = useState<MyLoading>({ open: false });

  return (
    <LoadingContext.Provider value={setLoading}>
      {children}

      {/* Dialog para erros importantes */}
      {loading && (
        <Dialog
          open={loading.open}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          {loading.title && <DialogTitle id="alert-dialog-title">
            {loading.title}
          </DialogTitle>}

          <DialogContent>
            <CircularProgress />
            {loading.message && <DialogContentText id="alert-dialog-description">
              {loading.message}
            </DialogContentText>}
          </DialogContent>
        </Dialog>
      )}
    </LoadingContext.Provider>
  );
};

type Props = { children?: React.ReactNode; };