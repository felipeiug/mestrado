import { Box, Paper, Typography, useTheme } from '@mui/material';
import { Handle, IsValidConnection, OnConnect, Position } from '@xyflow/react';

interface Props {
  title: string;
  color?: string;

  height?: number;
  width?: number;

  children?: React.ReactNode;

  inShape?: number[];
  outShape?: number[];

  onConnection?: OnConnect;
  validateConnection?: IsValidConnection;
}

export const BaseNode: React.FC<Props> = ({
  title,
  validateConnection,
  onConnection,
  color,
  children,
  inShape,
  outShape,
  height,
  width,
}) => {
  const theme = useTheme();

  return <>

    {/* Handle de entrada */}
    {inShape && inShape.map((_, idx) => <Handle
      key={idx}
      type="target"
      position={Position.Left}
      onConnect={onConnection}
      isValidConnection={validateConnection}
      style={{
        width: 8,
        height: 8,
        left: -(8 / 2),
        top: (idx + 1) * (height ?? 46) / (inShape.length + 1),
        backgroundColor: theme.palette.primary.dark
      }}
    />)}

    {/* Handle de saída */}
    {outShape && outShape.map((_, idx) => <Handle
      key={idx}
      type="source"
      position={Position.Right}
      onConnect={onConnection}
      isValidConnection={validateConnection}
      style={{
        width: 8,
        height: 8,
        right: -(8 / 2),
        top: (idx + 1) * (height ?? 46) / (outShape.length + 1),
        backgroundColor: theme.palette.primary.dark
      }}
    />)}

    {/* Conteúdo */}
    <Box
      sx={{
        gap: "1px",
        width: width ?? 46,
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
          width: width ?? 46,
          height: height ?? 46,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          borderLeft: color ? `4px solid ${color}` : undefined,
          '&:hover': { boxShadow: theme.shadows[6] },
        }}
      >
        <div style={{ flex: 1, width: "5px", height: "15.5px" }} />
        {children}
      </Paper >

      <Box sx={{
        width: "46px",
        display: 'flex',
        flexDirection: "column",
      }}>
        <Typography fontSize={8} fontWeight={"bold"} textAlign={"center"}>
          {title}
        </Typography>

        <Typography fontSize={6} fontWeight={"bold"} textAlign={"center"}>
          {`[${inShape}, ${outShape}]`}
        </Typography>
      </Box>
    </Box>
  </>;
};