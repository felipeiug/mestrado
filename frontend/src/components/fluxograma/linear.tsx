import { AddCircle, Timeline } from '@mui/icons-material';
import { Box, Paper, Tooltip, Typography, useTheme } from '@mui/material';
import { Connection, Handle, Node, Position, useEdges, useNodes } from '@xyflow/react';
import { EdgeBase } from '@xyflow/system';
import { LayerType, Linear } from '../../core';
import { useState } from 'react';

type Props = { onHelp?: (value: "Linear") => void; };

export function LinearLayer(nodeData: Node<Linear & Props>) {
  const theme = useTheme();
  const nodes = useNodes<Node<LayerType & Props>>();
  const edges = useEdges();

  const [state, setState] = useState(false);

  const validateConnection = (edge: EdgeBase | Connection) => {
    if (edge.source === edge.target) return false;

    const nodeSource = nodes.filter(value => value.id === edge.source)[0];
    const nodeTarget = nodes.filter(value => value.id === edge.target)[0];
    const valid = nodeTarget.data.validateInShape(nodeSource.data.outShape);

    for (const ed of edges) {
      if (ed.target === nodeTarget.id) return false;
    }

    if (valid) nodeTarget.data.inShape = nodeSource.data.outShape;

    return valid;
  };

  const handleConnect = () => {
    setState(!state);
  }

  return <>
    {/* Handle de entrada */}
    <Handle
      type="target"
      position={Position.Left}
      onConnect={handleConnect}
      isValidConnection={validateConnection}
      style={{
        width: 8,
        height: 8,
        left: -(8 / 2),
        top: 46 / 2,
        backgroundColor: theme.palette.primary.dark
      }}
    />

    {/* Handle de saída */}
    <Handle
      type="source"
      position={Position.Right}
      onConnect={handleConnect}
      isValidConnection={validateConnection}
      style={{
        width: 8,
        height: 8,
        right: -(8 / 2),
        top: 46 / 2,
        backgroundColor: theme.palette.secondary.dark
      }}
    />

    <Box sx={{
      gap: "1px",
      width: "46px",
      display: 'flex',
      flexDirection: "column",
      justifyContent: "space-between",
    }}>
      <Paper
        elevation={3}
        sx={{
          p: 0,
          width: "46px",
          height: "46px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          borderLeft: `4px solid ${theme.palette.primary.main}`,
          '&:hover': { boxShadow: theme.shadows[6] }
        }}
      >
        <div style={{ flex: 1, width: "5px", height: "15.5px" }} />
        <Timeline sx={{ fontSize: 22 }} color="primary" />
        <div style={{
          paddingRight: "2px",
          paddingBottom: "2px",
          flex: 1,
          display: "flex",
          flexDirection: "row",
          width: "100%",
          justifyContent: "end",
          alignItems: "end"
        }}>
          <Tooltip title="Bias">
            <AddCircle sx={{ fontSize: 9 }} color={(nodeData.data.bias ?? true) ? 'success' : 'error'} />
          </Tooltip>
        </div>
      </Paper >

      <Box sx={{
        width: "46px",
        display: 'flex',
        flexDirection: "column",
      }}>
        <Typography fontSize={8} fontWeight={"bold"} textAlign={"center"}>
          Linear
        </Typography>

        <Typography fontSize={6} fontWeight={"bold"} textAlign={"center"}>
          {`[${nodeData.data.inShape}, ${nodeData.data.outShape}]`}
        </Typography>
      </Box>
    </Box>
  </>;
};