import { Add, AddCircle, Remove, Timeline } from '@mui/icons-material';
import { Box, IconButton, Paper, TextField, Tooltip, Typography, useTheme } from '@mui/material';
import { Connection, Handle, Node, useReactFlow } from '@xyflow/react';
import { EdgeBase, Position } from '@xyflow/system';
import { Linear } from '../../core';


export function LinearLayer(nodeData: Node<Linear>) {
  const theme = useTheme();
  const color = "rgb(175, 214, 46)";
  const { getNode, getNodeConnections } = useReactFlow();

  let shape = [nodeData.data.inShape, nodeData.data.outShape];
  const bias = nodeData.data.bias ?? true;

  const validateConnection = (edge: EdgeBase | Connection) => {
    if (edge.source === edge.target) return false;

    const nodeSource = getNode(edge.source) as Node<Linear>;
    const nodeTarget = getNode(edge.target) as Node<Linear>;

    const valid = (nodeSource.data.inShape.length === 2) && (nodeSource.data.inShape.length === nodeTarget.data.outShape.length);
    if (!valid) return false;

    const conn = getNodeConnections({
      type: "source",
      nodeId: nodeSource.id,
    });
    if (conn.length) return false;


    nodeSource.data.inShape = nodeTarget.data.outShape;
    nodeSource.data.onChange?.(nodeSource);
    nodeTarget.data.onChange?.(nodeTarget);

    return valid;
  };

  const handleChangeBias = (ev: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    ev.preventDefault();
    ev.stopPropagation();

    nodeData.data.bias = !bias;
    nodeData.data.onChange?.(nodeData);
  };

  const handleChangeOutput = (ev: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, output: number) => {
    ev.preventDefault();
    ev.stopPropagation();

    const newShape: [[number, number], [number, number]] = [nodeData.data.inShape, [nodeData.data.outShape[0], output]];
    nodeData.data.outShape = newShape[1];
    nodeData.data.onChange?.(nodeData);

    const connections = getNodeConnections({
      type: "target",
      nodeId: nodeData.id,
    });

    connections.forEach(conn => {
      const node = getNode(conn.source) as (Node<Linear> | undefined);
      if (node) {
        node.data.inShape = [nodeData.data.outShape[0], output];
        node.data.onChange?.(node);
      }
    });
  };

  return <>
    <Handle
      id={nodeData.id + "_T"}
      type="target"
      position={Position.Right}
      isValidConnection={validateConnection}
      style={{
        width: 8,
        height: 8,
        right: 0,
        top: 46 / 2,
        zIndex: 5,
        borderRadius: "50%",
        border: "0px solid black",
        backgroundColor: theme.palette.primary.dark
      }}
    />
    <Handle
      id={nodeData.id + "_S"}
      type="source"
      position={Position.Left}
      isValidConnection={validateConnection}
      style={{
        width: 4,
        height: 8,
        left: 0,
        top: 46 / 2,
        borderRadius: 2,
        zIndex: 5,
        border: "0px solid black",
        backgroundColor: theme.palette.primary.dark
      }}
    />



    {/* Conteúdo */}
    <Box
      sx={{
        gap: "1px",
        width: 46,
        display: 'flex',
        cursor: "pointer",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 0,
          width: 46,
          height: 46,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: 'relative',
          borderLeft: color ? `4px solid ${color}` : undefined,
          '&:hover': { boxShadow: theme.shadows[6] },
        }}
      >
        <Timeline sx={{
          fontSize: 22,
          color: color,
          position: "absolute"
        }} />

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
          <Tooltip title={(bias ? "" : "Not ") + "Using Bias"}>
            <AddCircle onClick={handleChangeBias} sx={{ fontSize: 9 }} color={bias ? 'success' : 'error'} />
          </Tooltip>
        </div>

      </Paper >


      <Typography
        fontSize={8}
        fontWeight={"bold"}
        textAlign={"center"}
      >
        Linear
      </Typography>

      <Box sx={{
        width: "46px",
        display: 'flex',
        flexDirection: "column",
      }}>
        <Tooltip
          title={
            <Box display="flex" alignItems="center" gap={0.5} p={0.5}>
              <IconButton size="small" onClick={(ev) => handleChangeOutput(ev, Math.max(1, shape[1][1] - 1))}>
                <Remove fontSize="inherit" />
              </IconButton>

              <TextField
                type="number"
                value={shape[1][1]}
                onChange={(e) => {
                  const value = Math.max(1, Number(e.target.value));
                  handleChangeOutput(e, value);
                }}
                inputProps={{
                  min: 1,
                  style: {
                    textAlign: 'center',
                    fontSize: 12,
                    width: 56,
                    padding: 0,
                  },
                }}
                variant="standard"
              />

              <IconButton size="small" onClick={(ev) => handleChangeOutput(ev, shape[1][1] + 1)}>
                <Add fontSize="inherit" />
              </IconButton>
            </Box>
          }
          arrow
          placement="top"
        >
          <Typography
            fontSize={6}
            fontWeight="bold"
            textAlign="center"
            sx={{
              cursor: "pointer",
              userSelect: "none",
              px: 0.5,
              py: 0.2,
              borderRadius: "4px",
              "&:hover": {
                backgroundColor: theme => theme.palette.action.hover,
              },
            }}
          >
            [{shape[0][1]}, {shape[1][1]}]
          </Typography>
        </Tooltip>

      </Box>
    </Box >
  </>;
};