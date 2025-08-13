import { Add, AddCircle, Remove, Timer } from '@mui/icons-material';
import { Box, IconButton, Paper, TextField, Tooltip, Typography, useTheme } from '@mui/material';
import { Connection, Edge, Handle, Node, useReactFlow } from '@xyflow/react';
import { EdgeBase, Position } from '@xyflow/system';
import { LayerBase, LSTM } from '../../core';


export function LSTMLayer(nodeData: Node<LSTM>) {
  const theme = useTheme();
  const color = "#ffd51bff";
  const { getNode, getNodeConnections, deleteElements, getEdge } = useReactFlow();

  const shape = [nodeData.data.inShape, nodeData.data.outShape];
  const returnSequences = nodeData.data.returnSequences;
  const hiddenSize = nodeData.data.hiddenSize;

  const validateXTConnection = (edge: EdgeBase | Connection) => {
    if (edge.source === edge.target) return false;

    const nodeTarget = getNode(edge.target) as Node<LayerBase>;
    const nodeSource = getNode(edge.source) as Node<LSTM>;

    const conn = getNodeConnections({
      type: "source",
      nodeId: nodeSource.id,
    }).filter(conn => conn.sourceHandle === edge.sourceHandle);
    if (conn.length) return false;

    if (nodeTarget.data.outShape.length !== 3) return false;

    nodeSource.data.inShape = nodeTarget.data.outShape as [number, number, number];

    nodeSource.data.onChange?.(nodeSource);
    nodeTarget.data.onChange?.(nodeTarget);

    return true;
  };

  const validateYTConnection = (edge: EdgeBase | Connection) => {
    if (edge.source === edge.target) return false;

    const nodeTarget = getNode(edge.target) as Node<LSTM>;
    const nodeSource = getNode(edge.source) as Node<LayerBase>;

    const conn = getNodeConnections({
      type: "source",
      nodeId: nodeSource.id,
    }).filter(conn => conn.sourceHandle === edge.sourceHandle);
    if (conn.length) return false;

    if (nodeTarget.data.returnSequences) {
      if (nodeSource.data.inShape.length !== 3) return false;
    } else {
      if (nodeSource.data.inShape.length !== 2) return false;
    }

    nodeSource.data.inShape = nodeTarget.data.outShape;

    nodeSource.data.onChange?.(nodeSource);
    nodeTarget.data.onChange?.(nodeTarget);

    return true;
  };

  const validateCTHTConnection = (edge: EdgeBase | Connection) => {
    if (edge.source === edge.target) return false;

    const nodeTarget = getNode(edge.target) as Node<LSTM>;
    const nodeSource = getNode(edge.source) as Node<LayerBase | LSTM>;

    const conn = getNodeConnections({
      type: "source",
      nodeId: nodeSource.id,
    }).filter(conn => conn.sourceHandle === edge.sourceHandle);
    if (conn.length) return false;

    if (nodeSource.type !== "lstmLayer" && nodeSource.data.inShape.length !== 2) return false;
    else if (nodeSource.type === "lstmLayer" && (nodeSource.data as LSTM).hiddenSize !== nodeTarget.data.hiddenSize) return false;

    if (nodeSource.type !== "lstmLayer") {
      nodeSource.data.inShape = [nodeTarget.data.inShape[0], nodeTarget.data.hiddenSize];
    }

    nodeSource.data.onChange?.(nodeSource);
    nodeTarget.data.onChange?.(nodeTarget);

    return true;
  };

  const validateCTHT_1Connection = (edge: EdgeBase | Connection) => {
    if (edge.source === edge.target) return false;

    const nodeTarget = getNode(edge.target) as Node<LSTM>;
    const nodeSource = getNode(edge.source) as Node<LSTM>;

    if (nodeTarget.type !== "lstmLayer") return false;

    const conn = getNodeConnections({
      type: "source",
      nodeId: nodeSource.id,
    }).filter(conn => conn.sourceHandle === edge.sourceHandle);
    if (conn.length) return false;

    const tOutLen = nodeTarget.data.outShape.length;
    if (nodeTarget.data.outShape[tOutLen - 1] !== nodeSource.data.hiddenSize) return false;

    nodeSource.data.onChange?.(nodeSource);
    nodeTarget.data.onChange?.(nodeTarget);

    return true;
  };


  const handleChangeSequences = (ev: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    ev.preventDefault();
    ev.stopPropagation();

    nodeData.data.returnSequences = !returnSequences;

    if (nodeData.data.returnSequences) {
      nodeData.data.outShape = [nodeData.data.outShape[0], nodeData.data.inShape[1], hiddenSize];
    } else {
      nodeData.data.outShape = [nodeData.data.outShape[0], hiddenSize];
    }

    const connections = getNodeConnections({ nodeId: nodeData.id });

    const edges = connections.map(conn => getEdge(conn.edgeId)).filter(ed => ed) as Edge[];
    deleteElements({ edges: edges });

    nodeData.data.onChange?.(nodeData);
  };

  const handleChangeUnits = (ev: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, hiddenSize: number) => {
    ev.preventDefault();
    ev.stopPropagation();

    if (returnSequences) {
      nodeData.data.outShape = [nodeData.data.outShape[0], nodeData.data.inShape[1], hiddenSize];
    } else {
      nodeData.data.outShape = [nodeData.data.outShape[0], hiddenSize];
    }

    nodeData.data.hiddenSize = hiddenSize;
    nodeData.data.onChange?.(nodeData);

    const connections = getNodeConnections({ nodeId: nodeData.id });

    const edges = connections.map(conn => getEdge(conn.edgeId)).filter(ed => ed) as Edge[];
    deleteElements({ edges: edges });
  };

  return <>
    <Handle
      id={nodeData.id + "_Xt"}
      type="source"
      position={Position.Top}
      isValidConnection={validateXTConnection}
      style={{
        width: 4,
        height: 8,
        left: 4 + ((46 - 4) / 4),
        top: 0,
        borderRadius: 2,
        zIndex: 5,
        border: "0px solid black",
        backgroundColor: theme.palette.primary.dark
      }}
    />
    <Handle
      id={nodeData.id + "_Yt"}
      type="target"
      position={Position.Top}
      isValidConnection={validateYTConnection}
      style={{
        width: 8,
        height: 8,
        left: 4 + ((46 - 4) * 2 / 3),
        top: 0,
        zIndex: 5,
        borderRadius: "50%",
        border: "0px solid black",
        backgroundColor: theme.palette.primary.dark
      }}
    />


    <Handle
      id={nodeData.id + "_Ct"}
      type="target"
      position={Position.Right}
      isValidConnection={validateCTHTConnection}
      style={{
        width: 4,
        height: 4,
        right: -(4 / 2),
        top: 46 / 4,
        zIndex: 5,
        backgroundColor: theme.palette.primary.dark,
      }} />
    <Handle
      id={nodeData.id + "_Ht"}
      type="target"
      position={Position.Right}
      isValidConnection={validateCTHTConnection}
      style={{
        width: 4,
        height: 4,
        right: -(4 / 2),
        top: 46 * 2 / 3,
        zIndex: 5,
        backgroundColor: theme.palette.primary.dark,
      }}
    />


    <Handle
      id={nodeData.id + "_Ct-1"}
      type="source"
      position={Position.Left}
      isValidConnection={validateCTHT_1Connection}
      style={{
        width: 4,
        height: 4,
        left: -(4 / 2),
        top: 46 / 4,
        zIndex: 5,
        backgroundColor: theme.palette.primary.dark
      }}
    />
    <Handle
      id={nodeData.id + "_Ht-1"}
      type="source"
      position={Position.Left}
      isValidConnection={validateCTHT_1Connection}
      style={{
        width: 4,
        height: 4,
        left: -(4 / 2),
        top: 46 * 2 / 3,
        zIndex: 5,
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
          borderLeft: color ? `4px solid ${color}` : undefined,
          '&:hover': { boxShadow: theme.shadows[6] },
          position: "relative",
          zIndex: 1,
        }}
      >
        <Timer sx={{ fontSize: 22, color: color, position: "absolute" }} />

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
          <Tooltip title={(returnSequences ? "" : "Not ") + "Return Sequences"}>
            <AddCircle onClick={handleChangeSequences} sx={{ fontSize: 9 }} color={returnSequences ? 'success' : 'error'} />
          </Tooltip>
        </div>

        <Typography
          fontSize={5}
          fontWeight={"bold"}
          textAlign={"center"}
          sx={{
            position: "absolute",
            right: 2,
            top: 8,
          }}
        >
          Ct
        </Typography>

        <Typography
          fontSize={5}
          fontWeight={"bold"}
          textAlign={"center"}
          sx={{
            position: "absolute",
            right: 2,
            top: 27,
          }}
        >
          Ht
        </Typography>

        <Typography
          fontSize={5}
          fontWeight={"bold"}
          textAlign={"center"}
          sx={{
            position: "absolute",
            left: 1,
            top: 8,
          }}
        >
          Ct-1
        </Typography>

        <Typography
          fontSize={5}
          fontWeight={"bold"}
          textAlign={"center"}
          sx={{
            position: "absolute",
            left: 1,
            top: 27,
          }}
        >
          Ht-1
        </Typography>
      </Paper >

      <Typography
        fontSize={8}
        fontWeight={"bold"}
        textAlign={"center"}
      >
        LSTM
      </Typography>

      {/* Título e nome */}
      <Tooltip
        sx={{ bgcolor: "#ffffffff" }}
        title={
          <Box>
            <Typography
              fontSize={12}
              fontWeight="bold"
              textAlign="center"
            >
              Unidades LSTM
            </Typography>
            <Box display="flex" alignItems="center" gap={0.5} p={0.5}>
              <IconButton size="small" onClick={(ev) => handleChangeUnits(ev, Math.max(1, shape[1][shape[1].length - 1] - 1))}>
                <Remove fontSize="inherit" />
              </IconButton>

              <TextField
                type="number"
                value={hiddenSize}
                onChange={(e) => {
                  const value = Math.max(1, Number(e.target.value));
                  handleChangeUnits(e, value);
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

              <IconButton size="small" onClick={(ev) => handleChangeUnits(ev, shape[1][shape[1].length - 1] + 1)}>
                <Add fontSize="inherit" />
              </IconButton>
            </Box>
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
          {shapeText(shape as [[number, number, number], ([number, number] | [number, number, number])])}
        </Typography>
      </Tooltip>

    </Box >
  </>;
};

function shapeText(shape: [[number, number, number], ([number, number] | [number, number, number])]) {
  let text = `[[${shape[0][1]}, ${shape[0][2]}], `;
  if (shape[1].length == 2) {
    text += `${shape[1][1]}]`;
  } else {
    text += `[${shape[1][1]}, ${shape[1][2]}]]`;
  }

  return text;
}

