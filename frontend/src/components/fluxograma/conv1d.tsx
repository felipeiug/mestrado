import { BorderInner, BorderOuter, GraphicEq } from '@mui/icons-material';
import { Box, Paper, Tooltip, Typography, useTheme } from '@mui/material';
import { Connection, Handle, Node, useReactFlow } from '@xyflow/react';
import { EdgeBase, Position } from '@xyflow/system';
import { Conv1d, LayerBase } from '../../core';
import { Conv1DConfig, getConv1DOutputShape } from '../convolution';


export function Conv1DLayer(nodeData: Node<Conv1d>) {
  const theme = useTheme();
  const color = "rgba(248, 126, 12, 1)";
  const { getNode, getNodeConnections } = useReactFlow();

  const data = nodeData.data;
  let shape = [data.inShape, data.outShape];
  const padding = data.padding;

  const validateTConnection = (edge: EdgeBase | Connection) => {
    if (edge.source === edge.target) return false;

    const nodeSource = getNode(edge.source) as Node<LayerBase>;
    const nodeTarget = getNode(edge.target) as Node<Conv1d>;

    const valid = (nodeSource.data.inShape.length === 3);
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

  const validateSConnection = (edge: EdgeBase | Connection) => {
    if (edge.source === edge.target) return false;

    const nodeSource = getNode(edge.source) as Node<Conv1d>;
    const nodeTarget = getNode(edge.target) as Node<Conv1d>;

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

  const handleChangePadding = (ev: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    ev.preventDefault();
    ev.stopPropagation();

    nodeData.data.padding = (padding === "same") ? "valid" : "same";
    nodeData.data.onChange?.(nodeData);
  };

  const handleChangeConv = (config: Conv1DConfig) => {
    const outShape = getConv1DOutputShape(config);

    nodeData.data = {
      ...nodeData.data,
      filters: config.filters,
      kernelSize: config.kernelSize,
      padding: config.padding,
      stride: config.strides,
      outShape: outShape,
    };
    data.onChange?.(nodeData);
  };

  return <>
    <Handle
      id={nodeData.id + "_T"}
      type="target"
      position={Position.Right}
      isValidConnection={validateTConnection}
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
      isValidConnection={validateSConnection}
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
        <GraphicEq sx={{
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
          <Tooltip title={padding === "same" ? "Padding Same" : "Padding Valid"}>
            {
              (padding === "same") ?
                <BorderInner onClick={handleChangePadding} sx={{ fontSize: 9 }} /> :
                <BorderOuter onClick={handleChangePadding} sx={{ fontSize: 9 }} />
            }
          </Tooltip>
        </div>

      </Paper >


      <Typography
        fontSize={8}
        fontWeight={"bold"}
        textAlign={"center"}
      >
        Conv1D
      </Typography>

      <Box sx={{
        width: "46px",
        display: 'flex',
        flexDirection: "column",
      }}>
        <Tooltip
          slotProps={{
            tooltip: {
              sx: {
                bgcolor: "#fff",
                color: 'white',
                border: "1px solid black",
              }
            },
            popper: {
              style: {
                zIndex: 0,
                backgroundColor: "#fff",
              }
            }
          }}
          title={
            <Box display="flex" alignItems="center" gap={0.5} p={0.5}>
              <Conv1DConfig
                initialConfig={{
                  filters: data.filters,
                  padding: data.padding,
                  inputshape: data.inShape,
                  strides: data.stride ?? 1,
                  kernelSize: data.kernelSize,

                }}
                onChange={handleChangeConv}
              />
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