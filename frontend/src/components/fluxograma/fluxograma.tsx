import { useState, useCallback } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Node,
  Edge,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { LinearLayer } from './linear';
import { generateRandomHash, LayerBase, LayerType, LayerTypeName } from '../../core';
import { Menu, MenuItem, Typography } from '@mui/material';
import { ContentCopy, Delete, Help, Settings } from '@mui/icons-material';
import { useAppThemeContext } from '../../context';

const nodeTypes: any = {
  linearLayer: LinearLayer
};

export type FluxogramaProps = {
  onProperties?: (value: LayerBase) => void;
  onHelp?: (layer: LayerTypeName) => void;
}

export const Fluxograma: React.FC<FluxogramaProps> = ({ onHelp, onProperties }) => {
  const { themeType } = useAppThemeContext();
  const { setCenter, addNodes } = useReactFlow();

  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
    node: Node<LayerType>;
  } | null>(null);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [nodes, setNodes] = useState<Node<LayerType>[]>([
    {
      id: generateRandomHash(8),
      data: {
        name: "Linear",
        inShape: [8],
        outShape: [64],
        validateInShape: (shape) => shape.length === 1,
        validateOutShape: (_) => false,
      },
      position: { x: 0, y: 0 },
      type: 'linearLayer',
    },
    {
      id: generateRandomHash(8),
      data: {
        name: "Linear",
        inShape: [32],
        outShape: [128],
        validateInShape: (shape) => shape.length === 1,
        validateOutShape: (_) => false,
      },
      position: { x: 150, y: 75 },
      type: 'linearLayer',
    },
    {
      id: generateRandomHash(8),
      data: {
        name: "Linear",
        inShape: [64],
        outShape: [128],
        validateInShape: (shape) => shape.length === 1,
        validateOutShape: (_) => false,
      },
      position: { x: 150, y: -75 },
      type: 'linearLayer',
    },
  ]);


  const handleClose = () => {
    setContextMenu(null);
  };

  const handleRemove = () => {
    setContextMenu(null);
  };

  const handleDuplicate = () => {
    if (!contextMenu?.node) return;

    const node = {
      ...contextMenu.node,
      position: {
        x: contextMenu.node.position.x + 50,
        y: contextMenu.node.position.y + 50,
      },
      data: { ...contextMenu.node.data },
      id: generateRandomHash(8),
    };

    nodes.push(node);
    addNodes([node]);
    setContextMenu(null);
  };

  const handleHelp = () => {
    if (onHelp && contextMenu) onHelp(contextMenu.node.data.name);
    setContextMenu(null);
  };
  const handleProperties = () => {
    if (onProperties && contextMenu) onProperties(contextMenu.node.data);
    setContextMenu(null);
  };



  const onNodeClick = (_: React.MouseEvent, node: Node<LayerType>) => {
    if (onProperties) onProperties(node.data);

    setTimeout(() => {
      setCenter(node.position.x, node.position.y);
    }, 100);
  }
  const onNodeContextMenu = (event: React.MouseEvent, node: Node<LayerType>) => {
    event.preventDefault();
    setContextMenu({
      mouseX: event.clientX,
      mouseY: event.clientY,
      node: node,
    });
  }


  const onNodesChange = useCallback(
    (changes: any) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [],
  );
  const onEdgesChange = useCallback(
    (changes: any) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [],
  );
  const onConnect = useCallback(
    (params: any) => {
      setEdges((eds) => addEdge(params, eds));
    },
    [nodes],
  );

  return (<>

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

      <MenuItem onClick={() => handleDuplicate()}>
        <Item title={"Create a Copy"} icon={<ContentCopy />} />
      </MenuItem>

      <MenuItem onClick={() => handleProperties()}>
        <Item title={"Properties"} icon={<Settings />} />
      </MenuItem>

      <MenuItem onClick={() => handleHelp()}>
        <Item title={"Help"} icon={<Help />} />
      </MenuItem>

      <MenuItem onClick={() => handleRemove()}>
        <Item title={"Delete"} icon={<Delete />} />
      </MenuItem>

    </Menu>

    <div style={{ height: '100%', width: "100%" }}>
      <ReactFlow<Node<LayerType>>
        fitView
        colorMode={themeType ? "light" : "dark"}

        nodes={nodes}
        edges={edges}

        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}

        onConnect={onConnect}

        nodeTypes={nodeTypes}

        onNodeClick={onNodeClick}
        onNodeContextMenu={onNodeContextMenu}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>

  </>);
}



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