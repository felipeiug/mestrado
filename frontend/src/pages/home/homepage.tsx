import React, { useState } from 'react';
import {
  AppBar,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Toolbar,
  Tooltip,
  Typography,
  useTheme
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountCircle as AccountIcon,
  Layers as LayersIcon,
  Dataset as DatasetIcon,
  PlayCircle as TrainIcon,
  CloudUpload as DeployIcon,
  Settings as SettingsIcon,
  Help as HelpIcon,
  Add,
  Save,
  FileOpen
} from '@mui/icons-material';

export const HomePage: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleAdd = () => {
    //
  };

  const handleSave = () => {
    //
  };

  const handleLoad = () => {
    //
  };

  // Itens do menu lateral
  const drawerItems = [
    { text: 'New Model', icon: <Add />, onSelect: () => { } },
    { text: 'Save Model', icon: <Save />, onSelect: () => { } },
    { text: 'Load Model', icon: <FileOpen />, onSelect: () => { } },
    { divider: true },
    { text: 'New Layer', icon: <LayersIcon />, onSelect: () => { } },
    { text: 'Datasets', icon: <DatasetIcon />, onSelect: () => { } },
    { text: 'Train Model', icon: <TrainIcon />, onSelect: () => { } },
    { divider: true },
    { text: 'Settings', icon: <SettingsIcon />, onSelect: () => { } },
    { text: 'Help', icon: <HelpIcon />, onSelect: () => { } }
  ];

  return (
    <Paper elevation={0} sx={{ width: "100vw", height: "100vh", display: 'flex', flexDirection: "column" }}>

      {/* Drawer completo (abre sobre a barra reduzida em desktop) */}
      <Drawer
        open={drawerOpen}
        onClose={handleDrawerToggle}
        sx={{
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
            zIndex: theme.zIndex.drawer + 2
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {drawerItems.map((item, index) => (
              item.divider ? (
                <Divider key={`divider-${index}`} sx={{ my: 1 }} />
              ) : (
                <ListItem key={item.text} disablePadding onClick={() => item.onSelect && item.onSelect()}>
                  <ListItemButton>
                    <ListItemIcon>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.text} />
                  </ListItemButton>
                </ListItem>
              )
            ))}
          </List>
        </Box>
      </Drawer>

      {/* AppBar superior */}
      <AppBar sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            NeuroDepp
          </Typography>
          <IconButton color="inherit">
            <AccountIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box sx={{ width: "100vw", height: "100%", display: 'flex', flexDirection: "row" }}>

        {/* Barra lateral */}
        <Paper sx={{ overflow: 'auto', width: 56, boxSizing: 'border-box' }}>
          <Toolbar />
          <List>
            {drawerItems.map((item, index) => (
              item.divider ? (
                <Divider key={`divider-${index}`} sx={{ my: 1 }} />
              ) : (
                <ListItem
                  key={item.text}
                  disablePadding
                  onClick={() => item.onSelect && item.onSelect()}
                >
                  <Tooltip title={item.text ?? ""}>
                    <ListItemButton sx={{ justifyContent: 'center' }}>
                      <ListItemIcon sx={{ minWidth: 'auto' }}>
                        {item.icon}
                      </ListItemIcon>
                    </ListItemButton>
                  </Tooltip>
                </ListItem>
              )
            ))}
          </List>
        </Paper>

        {/* Conteúdo principal */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            p: "0.5em",
            flexGrow: 1,
            width: `100%`,
          }}
        >
          <Toolbar />

          {/* Área do fluxograma (central) */}
          <Paper sx={{
            height: "100%",
            display: 'flex',
            borderRadius: 2,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'background.default',
          }} >
            <Typography variant="h6" color="text.secondary">
              Fluxograma para construção da RNA aparecerá aqui
            </Typography>
          </Paper>

        </Box>
      </Box>
    </Paper>
  );
};