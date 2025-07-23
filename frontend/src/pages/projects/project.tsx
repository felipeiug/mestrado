import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import {
  Toolbar,
  Typography,
  Grid,
  Box,
  Button,
  Paper,
  TextField,
  Select,
  MenuItem,
  useTheme,
  useMediaQuery,
  IconButton,
  Divider,
  Tooltip,
  Dialog,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  ArrowBack,
  PlayArrow,
  Stop,
  Fullscreen,
  Close,
  ArrowRightAlt
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { useApi } from '../../services';
import { Project, useError, useLoading, useUser } from '../../context';
import { useEffect, useState } from 'react';
import { LossFunctions, Optimizers } from '../../core';
import { FilesSelector, Fluxograma, LayerHelp, LayerList } from '../../components';
import { ReactFlowProvider } from '@xyflow/react';


export interface EpochData {
  epoch: number;
  loss: number;
  acc: number;
}

interface UpdateConfig {
  epochs: number;
  learningRate: number;
  optimizer: Optimizers;
  lossFunction: LossFunctions;
}

export const ProjectPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const api = useApi();
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const user = useUser();
  const setLoading = useLoading();
  const setError = useError();


  const [helpText, setHelpText] = useState<string>();
  const [projeto, setProjeto] = useState<Project>();
  const [showLayersType, setShowLayersType] = useState(true);

  // Controles
  const [totalEpochs, setTotalEpochs] = useState(100);
  const [optimizer, setOptimizer] = useState<Optimizers>("adam");
  const [learningRate, setLearningRate] = useState(0.001);
  const [updateConfig, setUpdateConfig] = useState<UpdateConfig>({
    epochs: 100,
    learningRate: 0.001,
    optimizer: "adam",
    lossFunction: "MSE",
  });

  // Métricas

  const [epochs, setEpochs] = useState<EpochData[]>([
    { epoch: 0, loss: 1E10, acc: 0 },
    { epoch: 1, loss: 1E2, acc: 0.001 },
    { epoch: 2, loss: 14.34567, acc: 0.01 },
    { epoch: 3, loss: 1.1276971, acc: 0.023456 },
  ]);


  // Obter dados do estudo
  useEffect(() => {
    setLoading({ open: true });
    if (!user) {
      setLoading({ open: false });
      return;
    }

    api.projects.getProject(Number(id)).then(value => {
      if ("error" in value) {
        setError(value);
        setLoading({ open: false });
        return;
      }
      setProjeto(value);
      setLoading({ open: false });
    });
  }, [id, user]);

  const handleStartTrain = () => { };
  const handlePauseTrain = () => { };
  const handleStopTrain = () => { };

  const handleOpenFullScreenFlow = () => { };
  const handleSetConfig = () => { };

  ////////////////////// Cálculos de cada iteração

  // Evolução do Loss e Acc
  let evoLoss: number | undefined = undefined;
  let evoAcc: number | undefined = undefined;
  if (epochs.length > 1) {
    const idx = epochs.length - 1;
    evoLoss = epochs[idx - 1].loss - epochs[idx].loss;
    evoAcc = epochs[idx].acc - epochs[idx - 1].acc;
  }

  return (
    <>
      <Dialog maxWidth={'lg'} open={Boolean(helpText)} onClose={() => setHelpText(undefined)}>
        <DialogContent>
          <LayerHelp startText={helpText ?? ""} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setHelpText(undefined)}>Fechar</Button>
        </DialogActions>
      </Dialog>

      {/* Page */}
      <Box sx={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <Toolbar>
          <IconButton onClick={() => navigate("/app/projects")}>
            <ArrowBack />
          </IconButton>

          <div style={{ width: "1em" }} />
          <Typography fontWeight={"bold"} color='textPrimary' fontSize='1.5rem'>
            {!projeto ? "Nome do Projeto" : projeto.name}
          </Typography>


          <Box sx={{ display: 'flex', flex: 1, justifyContent: 'flex-end', alignItems: "center", gap: 1 }}>
            <Tooltip title="Start Train">
              <IconButton onClick={handleStartTrain}>
                <PlayArrow />
              </IconButton>
            </Tooltip>
            <Tooltip title="Stop Train">
              <IconButton onClick={handleStopTrain}>
                <Stop />
              </IconButton>
            </Tooltip>

            <Typography>
              00:00
            </Typography>
          </Box>
        </Toolbar>
        <Divider />

        {/* Página */}
        <Box flex={1} p={1} display="flex" flexDirection="column" gap={2} overflow='auto'>

          {/* Título e métricas */}
          <Box px={1} display="flex" flexDirection="row">
            <Typography color='secondary' variant="h5" fontWeight="bold">Neural Network Design</Typography>
            <div style={{ flex: 1 }} />

            {/* Descrição atual */}
            <Box sx={{
              display: "flex",
              flexDirection: "row",
            }}>
              <Typography color="warning">Epoch {(epochs.length + 1).toFixed(0)}</Typography>
              <div style={{ width: "15px" }} />
              <Typography color='success'>Loss</Typography>
              <div style={{ width: "5px" }} />
              <Typography fontWeight="bold">{(epochs.length > 0 ? epochs[epochs.length - 1].loss : 0).toFixed(5)}</Typography>
              <div style={{ width: "15px" }} />
              <Typography color='success'>Accuracy:</Typography>
              <div style={{ width: "5px" }} />
              <Typography fontWeight="bold">{((epochs.length > 0 ? epochs[epochs.length - 1].acc : 0) * 100).toFixed(2) + "%"}</Typography>
            </Box>

          </Box>

          {/* Items e Fluxograma */}
          <Paper elevation={3} sx={{ m: "15px", p: "15px", display: 'flex', flexDirection: 'row', height: "calc(70vh + 60px)" }}>

            {/* Tipos de Layers */}
            {showLayersType && <Box p={2} display='flex' flexDirection='column' width="18vw" height="70vh">
              <Typography variant="h6" fontWeight="bold" mb={1}>
                Layers
              </Typography>
              <LayerList onHelpText={setHelpText} />
            </Box>}

            {/* Fluxograma */}
            <Paper sx={{
              p: 0,
              gap: 3,
              flex: 1,
              height: "70vh",
              display: 'flex',
              position: "relative",
              alignItems: 'center',
              justifyContent: "center",
              flexDirection: 'column',
              border: `2px dashed ${theme.palette.primary.main}`,
            }}>
              {/* Ações do Fluxograma */}
              <Box position='absolute' top="0" left="0">
                <Tooltip title={showLayersType ? "Close Layers" : "Open Layers"}>
                  <IconButton onClick={() => setShowLayersType(!showLayersType)}>
                    {showLayersType ? <Close /> : <ArrowRightAlt />}
                  </IconButton>
                </Tooltip>
                <Tooltip title="Open Fullscreen Flow">
                  <IconButton onClick={handleOpenFullScreenFlow}>
                    <Fullscreen />
                  </IconButton>
                </Tooltip>
              </Box>

              <ReactFlowProvider>
                <Fluxograma initialFlow={projeto?.flow} />
              </ReactFlowProvider>
            </Paper>

            {/* Arquivos Disponíveis */}
            <Box p={2} display='flex' flexDirection='column' width="18vw" height="70vh">
              <Typography variant="h6" fontWeight="bold" mb={1}>
                Files
              </Typography>
              <FilesSelector />
            </Box>

          </Paper>

          <Divider />

          {/* Parameters */}
          <Box display="flex" flexDirection="column" px={3}>

            <Typography variant="h5" fontWeight="bold" color='textPrimary' py={2}>Parameters</Typography>

            <Grid container spacing={3} pb={3}>

              {/* Epochs */}
              <Grid size={{ xs: 12, sm: 12 / 2, md: 12 / 4 }}>
                <TextField
                  fullWidth
                  label='Epochs'
                  placeholder={`Enter number`}
                  type='number'
                  value={updateConfig.epochs}
                  onChange={(ev) => setUpdateConfig(last => ({ ...last, epochs: parseInt(ev.target.value.split(".")[0]) }))}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      bgcolor: '#1a2632',
                      borderColor: '#344d65',
                      height: 56
                    },
                    '& .MuiInputLabel-root': {
                      color: 'secondary'
                    }
                  }}
                />
              </Grid>

              {/* Learning Rate */}
              <Grid size={{ xs: 12, sm: 12 / 2, md: 12 / 4 }}>
                <TextField
                  fullWidth
                  label='Learning Rate'
                  placeholder={`Enter rate`}
                  type='number'
                  value={updateConfig.learningRate}
                  onChange={(ev) => setUpdateConfig(last => ({ ...last, learningRate: Number(ev.target.value) }))}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      bgcolor: '#1a2632',
                      borderColor: '#344d65',
                      height: 56
                    },
                    '& .MuiInputLabel-root': {
                      color: 'secondary'
                    }
                  }}
                />
              </Grid>

              {/* Optimizer */}
              <Grid size={{ xs: 12, sm: 12 / 2, md: 12 / 4 }}>
                <Select
                  fullWidth
                  label='Optimizer'
                  value={updateConfig.optimizer}
                  onChange={(ev) => setUpdateConfig(last => ({ ...last, optimizer: ev.target.value as Optimizers }))}
                  sx={{
                    color: 'white',
                    bgcolor: '#1a2632',
                    borderColor: '#344d65',
                    height: 56,
                    '& .MuiSelect-icon': {
                      color: 'secondary'
                    }
                  }}
                >
                  <MenuItem value="adam">Adam</MenuItem>
                  <MenuItem value="adamw">AdamW</MenuItem>
                </Select>
              </Grid>

              {/* Loss Function */}
              <Grid size={{ xs: 12, sm: 12 / 2, md: 12 / 4 }}>
                <Select
                  fullWidth
                  label='Loss Function'
                  value={updateConfig.lossFunction}
                  onChange={(ev) => setUpdateConfig(last => ({ ...last, lossFunction: ev.target.value as LossFunctions }))}
                  sx={{
                    color: 'white',
                    bgcolor: '#1a2632',
                    borderColor: '#344d65',
                    height: 56,
                    '& .MuiSelect-icon': {
                      color: 'secondary'
                    }
                  }}
                >
                  <MenuItem value="MSE">Mean Squared Error</MenuItem>
                  <MenuItem value="RMSE">Root Mean Squared Error</MenuItem>
                </Select>
              </Grid>

              {/* Button */}
              <Grid size={12}>
                <Button fullWidth variant="contained" onClick={handleSetConfig}>
                  Apply
                </Button>
              </Grid>

            </Grid>
          </Box>

          {/* Gráficos das métricas */}
          <Typography variant="h5" fontWeight="bold" px={2} py={3}>Training Metrics</Typography>
          <Grid container spacing={3} px={2} pb={3}>

            {/* LOSS */}
            <Grid size={{ xs: 12, sm: 12 / 2, md: 12 / 4 }}>
              <Paper sx={{ p: 4, border: '1px solid asd', bgcolor: 'primary' }}>

                <Typography>Loss</Typography>
                <Typography variant="h3" fontWeight="bold">{(epochs.length > 0 ? epochs[epochs.length - 1].loss : 0).toFixed(5)}</Typography>

                <Box display="flex" gap={1}>
                  <Typography color="primary">Epoch {(epochs.length + 1).toFixed(0)}</Typography>
                  {evoLoss && <Typography color={evoLoss < 0 ? "error" : "success"} fontWeight="medium">{evoLoss.toFixed(5)}</Typography>}
                </Box>

                {/* Chart */}
                <Box height={180} my={2}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={
                        epochs.map((epoch, idx) => ({
                          epoch: idx + 1,
                          loss: epoch.loss,
                        }))
                      }>
                      <XAxis dataKey="epoch"
                        tick={{ fill: theme.palette.text.primary }}          // Cor dos rótulos
                        axisLine={{ stroke: theme.palette.text.primary }}    // Cor da linha do eixo
                        tickLine={{ stroke: theme.palette.text.primary }}    // Cor dos tracinhos
                      />
                      <YAxis
                        dataKey="loss"
                        tickFormatter={(value: number) => value.toExponential(2)}
                        domain={['auto', 'auto']}
                        tick={{ fill: theme.palette.text.primary }}          // Cor dos rótulos
                        axisLine={{ stroke: theme.palette.text.primary }}    // Cor da linha do eixo
                        tickLine={{ stroke: theme.palette.text.primary }}    // Cor dos tracinhos
                      />
                      <Line type="monotone" dataKey="loss" stroke={theme.palette.primary.main} />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>

              </Paper>
            </Grid>

            {/* Accuracy */}
            <Grid size={{ xs: 12, sm: 12 / 2, md: 12 / 4 }}>
              <Paper sx={{ p: 4, border: '1px solid asd', bgcolor: 'primary' }}>

                <Typography>Accuracy</Typography>
                <Typography variant="h3" fontWeight="bold">{((epochs.length > 0 ? epochs[epochs.length - 1].acc : 0) * 100).toFixed(2) + "%"}</Typography>

                <Box display="flex" gap={1}>
                  <Typography color="primary">Epoch {(epochs.length + 1).toFixed(0)}</Typography>
                  {evoAcc && <Typography color={evoAcc < 0 ? "error" : "success"} fontWeight="medium">{(evoAcc * 100).toFixed(2) + "%"}</Typography>}
                </Box>

                {/* Chart */}
                <Box height={180} my={2}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={
                        epochs.map((epoch, idx) => ({
                          epoch: idx + 1,
                          acc: epoch.acc,
                        }))
                      }>
                      <XAxis
                        dataKey="epoch"
                        tick={{ fill: theme.palette.text.primary }}          // Cor dos rótulos
                        axisLine={{ stroke: theme.palette.text.primary }}    // Cor da linha do eixo
                        tickLine={{ stroke: theme.palette.text.primary }}    // Cor dos tracinhos
                      />
                      <YAxis
                        dataKey="acc"
                        tickFormatter={(value: number) => value.toExponential(2)}
                        domain={['auto', 'auto']}
                        tick={{ fill: theme.palette.text.primary }}          // Cor dos rótulos
                        axisLine={{ stroke: theme.palette.text.primary }}    // Cor da linha do eixo
                        tickLine={{ stroke: theme.palette.text.primary }}    // Cor dos tracinhos
                      />
                      <Bar
                        type="monotone"
                        dataKey="acc"
                        stroke={theme.palette.primary.main}
                        fill={theme.palette.primary.main}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </Paper>
            </Grid>
          </Grid>

          {/* Footer */}
          <Divider />
          <Box sx={{ height: "36px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <Typography align='center' fontSize={12}>
              {`© ${new Date(Date.now()).getFullYear()} Paradigma. All rights reserved.`}
            </Typography>
          </Box>
        </Box>
      </Box>

    </>
  );
};
