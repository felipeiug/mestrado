import { Box, Menu, MenuItem, Paper, Typography, useTheme } from '@mui/material';
import { useState } from 'react';
import { ContentCopy, Delete, Help, Settings } from '@mui/icons-material';
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

  onHelp?: () => void;
  onClick?: () => void;
  onRemove?: () => void;
  onDuplicate?: () => void;
  onProperties?: () => void;
}

export const BaseNode: React.FC<Props> = ({
  title,
  validateConnection,
  onConnection,
  onProperties,
  onRemove,
  onDuplicate,
  onHelp,
  onClick,
  color,
  children,
  inShape,
  outShape,
  height,
  width,
}) => {
  const theme = useTheme();

  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);

  const handleItemRightClick = (event: React.MouseEvent) => {
    event.preventDefault();
    setContextMenu({
      mouseX: event.clientX,
      mouseY: event.clientY,
    });
  };

  const handleClose = () => {
    setContextMenu(null);
  };

  return <>

    <Menu
      open={contextMenu !== null}
      onClose={handleClose}
      anchorReference="anchorPosition"
      anchorPosition={
        contextMenu !== null
          ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
          : undefined
      }
    >

      <MenuItem
        onClick={() => {
          if (onDuplicate) onDuplicate();
          handleClose();
        }}
      >
        <Item title={"Create a Copy"} icon={<ContentCopy />} />
      </MenuItem>

      <MenuItem
        onClick={() => {
          if (onProperties) onProperties();
          handleClose();
        }}
      >
        <Item title={"Properties"} icon={<Settings />} />
      </MenuItem>

      <MenuItem
        onClick={() => {
          if (onHelp) onHelp();
          handleClose();
        }}
      >
        <Item title={"Help"} icon={<Help />} />
      </MenuItem>

      <MenuItem
        onClick={() => {
          if (onRemove) onRemove();
          handleClose();
        }}
      >
        <Item title={"Delete"} icon={<Delete />} />
      </MenuItem>

    </Menu>

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
      onClick={onClick}
      onContextMenu={handleItemRightClick}
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

interface ItemProps {
  title: string;
  icon?: React.ReactNode;
}
const Item: React.FC<ItemProps> = ({ title, icon }) => {
  return <div
    style={{
      flex: 1,
      gap: "1em",
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
    }}>
    <Typography>
      {title}
    </Typography>
    {icon}
  </div>;
}