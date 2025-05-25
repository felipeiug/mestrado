import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Skeleton,
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
  Settings as SettingsIcon,
  Add,
  Save,
  FileOpen,
  Close
} from '@mui/icons-material';
import { Fluxograma, LayerEdit, LayerHelp } from '../../components';
import { useLayers } from '../../context/LayersContext';
import { LayerBase, LayerTypeName } from '../../core';
import { useLoading } from '../../context';
import { ReactFlowProvider } from '@xyflow/react';

interface DrawerItem {
  divider?: boolean;
  text?: string;
  icon?: React.ReactNode;
  onSelect?: () => void;
}

export const FlowPage: React.FC = () => {
  const theme = useTheme();
  const layers = useLayers();
  const setLoading = useLoading();

  const [helpText, setHelpText] = useState<string>();
  const [layerEdit, setLayerEdit] = useState<LayerBase>();
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    setLoading({ open: layers.length === 0 });
  }, [layers]);

  const handleHelp = (layerName: LayerTypeName) => {
    for (const layer of layers) {
      if (layer.name === layerName) {
        setHelpText(layer.desc);
      }
    }
  };

  const handleType = (layer: LayerBase) => {
    setHelpText(undefined);
    setLayerEdit(layer);
  }

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

  const handleNewLayers = () => {
    //
  };

  const handleDataset = () => {
    //
  };

  const handleTrain = () => {
    //
  };

  const handleSettings = () => {
    //
  };

  // Itens do menu lateral
  const drawerItems: DrawerItem[] = [
    { text: 'New Model', icon: <Add />, onSelect: handleAdd },
    { text: 'Save Model', icon: <Save />, onSelect: handleSave },
    { text: 'Load Model', icon: <FileOpen />, onSelect: handleLoad },
    { divider: true },
    { text: 'New Layer', icon: <LayersIcon />, onSelect: handleNewLayers },
    { text: 'Datasets', icon: <DatasetIcon />, onSelect: handleDataset },
    { text: 'Train Model', icon: <TrainIcon />, onSelect: handleTrain },
    { divider: true },
    { text: 'Settings', icon: <SettingsIcon />, onSelect: handleSettings },
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
            FlowTorch
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
        <Box sx={{
          p: "0.5em",
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }} >
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
            {layers.length === 0 ? <Skeleton sx={{ width: "100%", height: "100%" }} /> :
              <ReactFlowProvider>
                <Fluxograma onHelp={handleHelp} onProperties={handleType} />
              </ReactFlowProvider>
            }
          </Paper>
        </Box>

        {/* Ajuda */}
        {helpText && <Box sx={{ p: "0.5em", width: "45%", height: "100vh" }}>
          <Toolbar />
          <Paper sx={{ py: "0.5em", height: "91%", position: "relative" }}>

            <Tooltip title="Close Help" sx={{ position: 'absolute', top: "0.5em", right: "0.5em", zIndex: 2 }}>
              <IconButton onClick={() => setHelpText(undefined)}>
                <Close />
              </IconButton>
            </Tooltip>

            <LayerHelp
              key={helpText}
              startText={helpText}
            />
          </Paper>
        </Box>}

        {/* Editar propriedades */}
        {layerEdit && <Box sx={{ p: "0.5em", width: "45%", height: "100vh" }}>
          <Toolbar />
          <Paper sx={{ py: "0.5em", height: "91%", position: "relative" }}>

            <Tooltip title="Close Properties" sx={{ position: 'absolute', top: "0.5em", right: "0.5em", zIndex: 2 }}>
              <IconButton onClick={() => setLayerEdit(undefined)}>
                <Close />
              </IconButton>
            </Tooltip>

            <LayerEdit
              layer={layerEdit}
            />
          </Paper>
        </Box>}
      </Box>
    </Paper>
  );
};