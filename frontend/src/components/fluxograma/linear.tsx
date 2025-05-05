import { AddCircle, Timeline } from '@mui/icons-material';
import { Paper, Tooltip, useTheme } from '@mui/material';
import { Connection, Handle, Node, Position, useNodes } from '@xyflow/react';
import { EdgeBase } from '@xyflow/system';
import { LayerType, Linear } from '../../core';

type Props = { onHelp?: (value: "Linear") => void; };

export function LinearLayer(nodeData: Node & Linear & Props) {
  const theme = useTheme();
  const nodes = useNodes<Node<LayerType & Props>>();

  const validateConnection = (edge: EdgeBase | Connection) => {
    if (edge.source === edge.target) return false;

    const nodeSource = nodes.filter(value => value.id === edge.source)[0];
    const nodeTarget = nodes.filter(value => value.id === edge.target)[0];
    const valid = nodeTarget.data.validateInShape(nodeSource.data.outShape);

    if (valid) {
      nodeTarget.data.inShape = nodeSource.data.outShape;
    }

    return valid;
  };

  return <>
    {/* Handle de entrada */}
    <Handle
      type="target"
      position={Position.Left}
      isValidConnection={validateConnection}
      style={{
        width: 8,
        height: 8,
        left: -(8 / 2),
        backgroundColor: theme.palette.primary.dark
      }}
    />

    {/* Handle de saída */}
    <Handle
      type="source"
      position={Position.Right}
      isValidConnection={validateConnection}
      style={{
        width: 8,
        height: 8,
        right: -(8 / 2),
        backgroundColor: theme.palette.secondary.dark
      }}
    />

    <Paper
      elevation={3}
      sx={{
        p: 0,
        width: "46px",
        height: "46px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
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
  </>;
};