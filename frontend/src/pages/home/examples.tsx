import React from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  useTheme,
  useMediaQuery,
  AppBar,
  Toolbar,
  CardMedia,
  Divider,
  CardActionArea,
  Container
} from '@mui/material';
import Logo from "../../assets/logo.jpg";
import { ParticleGraph } from '../../components/randomANN';
import { useNavigate } from 'react-router-dom';

export const ExamplesPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleStart = () => {
    navigate("/app/projects");
  };
  const handleHome = () => {
    navigate("/app/home");
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
        pb: "1em",
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
              <Button variant='text' onClick={handleHome} sx={{ color: 'secondary.main', fontSize: 14, fontWeight: 'medium', textDecoration: 'none' }}>
                Home
              </Button>
              <Button variant='text' onClick={handleDocs} sx={{ color: 'secondary.main', fontSize: 14, fontWeight: 'medium', textDecoration: 'none' }}>
                {isMobile ? "Docs" : "Documentation"}
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
      <Box sx={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column", gap: "1em" }}>
        <Container maxWidth="lg" sx={{ py: 2, gap: "1em", display: "flex", flexDirection: "column" }}>

          {/* Title */}
          <Box>
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
              Explore
            </Typography>
            <Typography color='textPrimary' variant="body1">
              Browse pre-built models and flowcharts to learn and get inspired.
            </Typography>
          </Box>

          {/* Models */}
          <Typography
            color='textPrimary'
            variant="h4"
            fontSize={isMobile ? '1rem' : '1.5rem'}
            fontWeight='bold'
          >
            Models
          </Typography>

          {/* Exemplos */}
          <Grid container spacing={2}>

            <Grid size={{ xs: 12, sm: 12 / 2, md: 12 / 4 }}>
              <ExampleItem
                title='Image Classification CNN'
                description='A convolutional neural network pipeline for categorizing images with layered feature extraction and pooling operations.'
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 12 / 2, md: 12 / 4 }}>
              <ExampleItem
                title='Text Sentiment LSTM'
                description='Recurrent network architecture processing sequential text data to predict emotional tone through memory cells.'
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 12 / 2, md: 12 / 4 }}>
              <ExampleItem
                title='Neural Style Transfer'
                description='Creative algorithm blending content and style features between images using VGG-based feature extraction.'
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 12 / 2, md: 12 / 4 }}>
              <ExampleItem
                title='Object Detection Faster-RCNN'
                description='Advanced localization system combining region proposal networks with bounding box regression.'
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 12 / 2, md: 12 / 4 }}>
              <ExampleItem
                title='Generative Adversarial Network'
                description='Dual-network framework where generator and discriminator compete to produce synthetic data.'
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 12 / 2, md: 12 / 4 }}>
              <ExampleItem
                title='Speech Recognition Transformer'
                description='Attention-based model processing audio waveforms into text transcripts through positional encoding.'
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 12 / 2, md: 12 / 4 }}>
              <ExampleItem
                title='Recommendation System'
                description='Embedding-based collaborative filtering approach predicting user preferences via latent features.'
              />
            </Grid>
          </Grid>

        </Container>

        {/* Footer */}
        <Divider />
        <Typography align='center' fontSize={12}>
          {`© ${new Date(Date.now()).getFullYear()} Paradigma. All rights reserved.`}
        </Typography>
      </Box>
    </Box >
  );
};

interface ExampleItemProps {
  isMobile?: boolean;
  title: string;
  description: string;
  onClick?: () => void;
}
const ExampleItem: React.FC<ExampleItemProps> = ({
  isMobile,
  title,
  description,
  onClick,
}) => {
  return (
    <Box sx={{
      flex: 1,
      display: "flex",
      flexDirection: "column",
    }}>
      <Card
        sx={{
          height: '13em',
          display: 'flex',
          flexDirection: 'column',
          gap: isMobile ? 4 : 6,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: isMobile ? 0 : '12px',
          transition: 'transform 0.2s, box-shadow 0.2s',
          mb: "0.5em",
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 6px 20px rgba(0,0,0,0.1)'
          }
        }}
      >
        <CardActionArea onClick={onClick} sx={{ height: '100%', width: "100%" }}>
          <ParticleGraph seed={title} style={{ width: '100%', height: '100%' }} />
        </CardActionArea>
      </Card>

      <Typography fontWeight={'bold'} fontSize={16} textAlign={'justify'}>
        {title}
      </Typography>

      <Typography fontSize={14} textAlign={'justify'}>
        {description}
      </Typography>

    </Box>);
}