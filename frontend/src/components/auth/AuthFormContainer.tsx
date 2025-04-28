import { Box, Dialog, DialogContent, DialogTitle, Typography } from '@mui/material';
import Logo from "../../assets/logo.jpg";

interface AuthFormContainerProps {
  title: string;
  logo?: boolean;
  children?: React.ReactNode;
}

export const AuthFormContainer = ({ title, logo, children }: AuthFormContainerProps) => {
  return (
    <Box sx={{ width: "100vw", height: "100vh", display: "flex" }}>
      <Dialog open={true}>
        <DialogTitle>
          <Typography fontSize={34} gutterBottom align="center">
            {title}
          </Typography>
        </DialogTitle>

        <DialogContent>
          <Box sx={{
            flex: 1,
            gap: "1em",
            display: "flex",
            flexDirection: "row",
            height: logo ? "35vh" : undefined,
          }}>
            <Box sx={{ flex: 1 }}>
              {children}
            </Box>

            {logo && <Box sx={{
              flex: 0.6,
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: 'center',
            }}>
              <img
                src={Logo}
                alt="Logo"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "0.5em",
                }}
              />
            </Box>}

          </Box>
        </DialogContent>

      </Dialog>

    </Box>
  );
};