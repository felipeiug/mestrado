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
  EdgeMouseHandler,
  useEdgesState,
  useNodesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { LinearLayer } from './linear';
import { generateRandomHash, LayerBase, LayerTypeName } from '../../core';
import { Box, Menu, MenuItem, Typography } from '@mui/material';
import { ContentCopy, Delete, Help, Settings } from '@mui/icons-material';
import { FlowType, useAppThemeContext } from '../../context';

const nodeTypes: any = {
  linearLayer: LinearLayer
};

export type FluxogramaProps = {
  initialFlow?: FlowType;
  onProperties?: (value: LayerBase) => void;
  onHelp?: (layer: LayerTypeName) => void;
}

export const Fluxograma: React.FC<FluxogramaProps> = ({ initialFlow, onHelp, onProperties }) => {
  const { themeType } = useAppThemeContext();
  const { setCenter, addNodes } = useReactFlow();

  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
    node: Node<LayerBase>;
  } | null>(null);
  const [edges, setEdges] = useEdgesState<Edge>([]);
  const [nodes, setNodes] = useNodesState<Node<LayerBase>>([
    {
      id: generateRandomHash(8),
      data: {
        name: "Linear",
        category: "",
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
        category: "",
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
        category: "",
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
    if (!contextMenu?.node) return;

    setContextMenu(null);
    setNodes((nds) => nds.filter((node) => node.id !== contextMenu.node.id));
    setEdges((eds) => eds.filter((edge) => !edge.source.startsWith(contextMenu.node.id) && !edge.target.startsWith(contextMenu.node.id)));
  };

  const handleRemoveEdge: EdgeMouseHandler<Edge> = (ev, ed) => {
    setEdges(edges => edges.filter(edge => edge.id !== ed.id));
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



  const onNodeClick = (_: React.MouseEvent, node: Node<LayerBase>) => {
    if (onProperties) onProperties(node.data);

    setTimeout(() => {
      setCenter(node.position.x, node.position.y);
    }, 100);
  }
  const onNodeContextMenu = (event: React.MouseEvent, node: Node<LayerBase>) => {
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

    {/* Context Menu */}
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

    {(edges.length === 0 && nodes.length === 0) ?
      (<Box textAlign="center">
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Drag and drop nodes to design your network
        </Typography>
        <Typography color="text.secondary">
          Start by adding input, hidden, and output layers. Connect them to define the data flow.
        </Typography>
      </Box>) : (
        <div style={{ height: '100%', width: "100%" }}>
          <ReactFlow<Node<LayerBase>>
            fitView
            colorMode={themeType ? "light" : "dark"}
            deleteKeyCode={['Delete']}

            nodes={nodes}
            edges={edges}

            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}

            onConnect={onConnect}

            nodeTypes={nodeTypes}

            onNodeClick={onNodeClick}
            onNodeContextMenu={onNodeContextMenu}
            onEdgeDoubleClick={handleRemoveEdge}
          >
            <Background />
            <Controls />
          </ReactFlow>
        </div>
      )
    }


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