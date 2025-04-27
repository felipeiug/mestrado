import { Box, Dialog, DialogContent, DialogTitle, Typography } from '@mui/material';

interface AuthFormContainerProps {
  title: string;
  children?: React.ReactNode;
}

export const AuthFormContainer = ({ title, children }: AuthFormContainerProps) => {
  return (
    <Box sx={{ width: "100vw", height: "100vh", display: "flex" }}>
      <Dialog open={true}>
        <DialogTitle>
          <Typography fontSize={34} gutterBottom align="center">
            {title}
          </Typography>
        </DialogTitle>

        {children && <DialogContent>
          {children}
        </DialogContent>}
      </Dialog>
    </Box>
  );
};