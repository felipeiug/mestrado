import React from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Container,
  useTheme,
  useMediaQuery,
  AppBar,
  Toolbar,
  CardMedia,
  Divider
} from '@mui/material';
import { Cloud, Code, Extension, SwapHorizontalCircle } from '@mui/icons-material';
import Logo from "../../assets/logo.jpg";
import { useNavigate } from 'react-router-dom';

export const HomePage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const nUsers = 10045;

  const handleStart = () => {
    navigate("/app/projects");
  };
  const handleExamples = () => {
    navigate("/app/examples");
  };
  const handleDocs = () => {
    navigate("/app/docs");
  };
  const handleCommunity = () => {
    navigate("/community");
  };

  return (
    <Box
      sx={{
        height: '100vh',
        fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif',
        overflowX: 'hidden',
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <AppBar color="transparent">
        <Toolbar>
          <Box sx={{ width: 32, height: 32 }}>
            <CardMedia
              component="img"
              image={Logo}
              alt="Imagem"
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center center',
                borderRadius: "0.3em"
              }}
            />
          </Box>
          <div style={{ width: "1em" }} />
          <Typography fontWeight={"bold"} color='textPrimary'>
            FlowTorch
          </Typography>

          <Box sx={{ display: 'flex', flex: 1, justifyContent: 'flex-end', gap: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Button variant='text' onClick={handleDocs} sx={{ color: 'secondary.main', fontSize: 14, fontWeight: 'medium', textDecoration: 'none' }}>
                {isMobile ? "Docs" : "Documentation"}
              </Button>
              <Button variant='text' onClick={handleExamples} sx={{ color: 'secondary.main', fontSize: 14, fontWeight: 'medium', textDecoration: 'none' }}>
                Examples
              </Button>
              <Button variant='text' onClick={handleCommunity} sx={{ color: 'secondary.main', fontSize: 14, fontWeight: 'medium', textDecoration: 'none' }}>
                Community
              </Button>
            </Box>
            <Button
              onClick={handleStart}
              variant="contained"
              sx={{
                minWidth: 84,
                maxWidth: 480,
                borderRadius: '12px',
                height: 40,
                px: 3,
                fontSize: 14,
                fontWeight: 'bold',
                textTransform: 'none',
              }}
            >
              {isMobile ? "Start" : "Get Started"}
            </Button>
          </Box>

        </Toolbar>
      </AppBar>

      {/* Spacer */}
      <Toolbar />

      {/* Main Content */}
      <Box sx={{ flex: 1, py: 2, overflow: "auto", display: "flex", flexDirection: "column", gap: "1em" }}>
        <Container maxWidth="lg" sx={{ py: 2, }}>
          {/* Hero Section */}
          <Box
            sx={{
              minHeight: 480,
              display: 'flex',
              flexDirection: 'column',
              gap: isMobile ? 4 : 6,
              alignItems: 'center',
              justifyContent: 'center',
              p: isMobile ? 2 : 4,
              borderRadius: isMobile ? 0 : '12px',
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.4) 100%), url("${Logo}")`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              mb: 4
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, textAlign: 'center' }}>
              <Typography
                variant="h1"
                color='white'
                sx={{
                  fontSize: isMobile ? '2.25rem' : '3rem',
                  fontWeight: 'black',
                  lineHeight: 1.2,
                  letterSpacing: '-0.033em',
                  textShadow: `
                    -1px -1px 0 #000,
                     1px -1px 0 #000,
                    -1px  1px 0 #000,
                     1px  1px 0 #000
                  `,
                }}
              >
                Build and Train ANN Models Visually
              </Typography>
              <Typography
                variant="subtitle1"
                color='white'
                sx={{
                  fontSize: isMobile ? 14 : 16,
                  fontWeight: 'normal',
                  textShadow: `
                    -1px -1px 0 #000,
                     1px -1px 0 #000,
                    -1px  1px 0 #000,
                     1px  1px 0 #000
                  `,
                }}
              >
                FlowTorch is a no-code/low-code platform that empowers you to create and train Artificial Neural Networks models using intuitive flowcharts.
              </Typography>
            </Box>
            <Button
              onClick={handleStart}
              variant="contained"
              sx={{
                minWidth: 84,
                maxWidth: 480,
                borderRadius: '12px',
                height: isMobile ? 40 : 48,
                px: isMobile ? 3 : 4,
                fontSize: isMobile ? 14 : 16,
                fontWeight: 'bold',
              }}
            >
              Get Started
            </Button>
          </Box>

          {/* Features Section */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, px: isMobile ? 2 : 4, py: 5 }}>
            {/* Title */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography
                color='textPrimary'
                variant="h2"
                sx={{
                  fontSize: isMobile ? '2rem' : '2.5rem',
                  fontWeight: 'black',
                  lineHeight: 1.2,
                  letterSpacing: '-0.033em',
                  maxWidth: 720
                }}
              >
                Key Features
              </Typography>
              <Typography
                color='textPrimary'
                variant="body1"
                sx={{ maxWidth: 720 }}
              >
                FlowTorch simplifies the process of building and deploying Pytorch models, making it accessible to everyone.
              </Typography>
            </Box>

            {/* Cards */}
            <Grid container spacing={2}>
              {/* Model Build */}
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Card sx={{ height: '100%', borderRadius: '1em' }}>
                  <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Extension sx={{ fontSize: 24 }} />
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        Visual Model Building
                      </Typography>
                      <Typography variant="body2">
                        Construct complex Pytorch models using a visual flowchart interface. Connect nodes to define the flow of data and operations.
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Drag And Drop */}
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Card sx={{ height: '100%', borderRadius: '1em' }}>
                  <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <SwapHorizontalCircle sx={{ fontSize: 24 }} />
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        Drag-and-Drop Interface
                      </Typography>
                      <Typography variant="body2">
                        Easily manipulate model components with a drag-and-drop interface. Customize parameters and connections with a few clicks.
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Deploy */}
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Card sx={{ height: '100%', borderRadius: '1em' }}>
                  <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Cloud sx={{ fontSize: 24 }} />
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        Cloud Deployment
                      </Typography>
                      <Typography variant="body2">
                        Deploy your models to the cloud with a single click. FlowTorch handles the infrastructure, allowing you to focus on your model.
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Code Generation */}
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Card sx={{ height: '100%', borderRadius: '1em' }}>
                  <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Code sx={{ fontSize: 24 }} />
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        Code Generation
                      </Typography>
                      <Typography variant="body2">
                        Generate Pytorch code from your visual models. Export your flowcharts as Python scripts for further customization and integration.
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>

          {/* CTA Section */}
          <Box sx={{ px: isMobile ? 2 : 4, py: isMobile ? 5 : 10 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: isMobile ? 3 : 4, alignItems: 'center' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, textAlign: 'center', maxWidth: 720 }}>
                <Typography
                  variant="h2"
                  color='textPrimary'
                  sx={{
                    fontSize: isMobile ? '2rem' : '2.5rem',
                    fontWeight: 'black',
                    lineHeight: 1.2,
                    letterSpacing: '-0.033em'
                  }}
                >
                  Ready to Build Your First Model?
                </Typography>
                <Typography variant="body1" color='textPrimary'>
                  {`Join with ${nUsers} users who are building and deploying Pytorch models without writing a single line of code.`}
                </Typography>
              </Box>
              <Button
                variant="contained"
                sx={{
                  minWidth: 84,
                  maxWidth: 480,
                  borderRadius: '12px',
                  height: isMobile ? 40 : 48,
                  px: isMobile ? 3 : 4,
                  fontSize: isMobile ? 14 : 16,
                  fontWeight: 'bold',
                }}
              >
                Get Started
              </Button>
            </Box>
          </Box>
        </Container>

        {/* Footer */}
        <Divider />
        <Typography align='center' fontSize={12}>
          {`© ${new Date(Date.now()).getFullYear()} Paradigma. All rights reserved.`}
        </Typography>
      </Box>
    </Box>
  );
};