import { useState } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  Node,
  Edge,
  useReactFlow,
  EdgeMouseHandler,
  useEdgesState,
  useNodesState,
  OnConnect,
  OnNodesChange,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Conv1d, generateRandomHash, LayerBase, LayerTypeName, LSTM } from '../../core';
import { Box, Menu, MenuItem, Typography } from '@mui/material';
import { ContentCopy, Delete, Help, Settings } from '@mui/icons-material';
import { FlowType, useAppThemeContext } from '../../context';
import { LSTMLayer } from './lstm';
import { Conv1DLayer } from './conv1d';
import { LinearLayer } from './linear';

const nodeTypes: any = {
  linearLayer: LinearLayer,
  lstmLayer: LSTMLayer,
  conv1DLayer: Conv1DLayer,
};

export type FluxogramaProps = {
  initialFlow?: FlowType;
  onProperties?: (value: LayerBase) => void;
  onHelp?: (layer: LayerTypeName) => void;
}

export const Fluxograma: React.FC<FluxogramaProps> = ({ initialFlow, onHelp, onProperties }) => {
  const { themeType } = useAppThemeContext();
  const reactFlow = useReactFlow();

  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
    node: Node<LayerBase>;
  } | null>(null);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [nodes, setNodes, onNodesChange] = useNodesState<Node<LayerBase>>([
    {
      id: generateRandomHash(8),
      data: {
        name: "Conv1d",
        category: "",
        kernelSize: 5,
        outChannels: 16,
        inShape: [3, 8, 2],
        outShape: [3, 8, 64],
        onChange: (node) => reactFlow.updateNodeData(node.id, node.data),
      } as Conv1d,
      position: { x: -300, y: -150 },
      type: 'conv1DLayer',
    },
    {
      id: generateRandomHash(8),
      data: {
        name: "LSTM",
        category: "",
        hiddenSize: 64,
        returnSequences: true,
        inShape: [3, 8, 2],
        outShape: [3, 8, 64],
        onChange: (node) => reactFlow.updateNodeData(node.id, node.data),
      } as LSTM,
      position: { x: -300, y: 0 },
      type: 'lstmLayer',
    },
    {
      id: generateRandomHash(8),
      data: {
        name: "LSTM",
        category: "",
        hiddenSize: 64,
        returnSequences: true,
        inShape: [3, 8, 2],
        outShape: [3, 8, 64],
        onChange: (node) => reactFlow.updateNodeData(node.id, node.data),
      } as LSTM,
      position: { x: -150, y: 0 },
      type: 'lstmLayer',
    },
    {
      id: generateRandomHash(8),
      data: {
        name: "LSTM",
        category: "",
        hiddenSize: 64,
        inShape: [3, 8, 2],
        outShape: [3, 64],
        onChange: (node) => reactFlow.updateNodeData(node.id, node.data),
      } as LSTM,
      position: { x: 0, y: 0 },
      type: 'lstmLayer',
    },
    {
      id: generateRandomHash(8),
      data: {
        name: "Linear",
        category: "",
        inShape: [3, 32],
        outShape: [3, 128],
        onChange: (node) => reactFlow.updateNodeData(node.id, node.data),
      },
      position: { x: 150, y: -150 },
      type: 'linearLayer',
    },
    {
      id: generateRandomHash(8),
      data: {
        name: "Linear",
        category: "",
        inShape: [3, 32],
        outShape: [3, 128],
        onChange: (node) => reactFlow.updateNodeData(node.id, node.data),
      },
      position: { x: 150, y: 0 },
      type: 'linearLayer',
    },
    {
      id: generateRandomHash(8),
      data: {
        name: "Linear",
        category: "",
        inShape: [3, 64],
        outShape: [3, 128],
        onChange: (node) => reactFlow.updateNodeData(node.id, node.data),
      },
      position: { x: 150, y: 150 },
      type: 'linearLayer',
    },
  ]);

  const handleNodesChange: OnNodesChange<Node<LayerBase>> = (changes) => {
    // console.log(changes);

    onNodesChange(changes);
  }


  const handleClose = () => {
    setContextMenu(null);
  };

  const handleRemove = () => {
    if (!contextMenu?.node) return;

    setContextMenu(null);
    setNodes((nds) => nds.filter((node) => node.id !== contextMenu.node.id));
    setEdges((eds) => eds.filter((edge) => !edge.source.startsWith(contextMenu.node.id) && !edge.target.startsWith(contextMenu.node.id)));
  };

  const handleRemoveEdge: EdgeMouseHandler<Edge> = (_, ed) => {
    reactFlow.deleteElements({ edges: [ed] });
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

    reactFlow.addNodes([node]);
    setContextMenu(null);
  };

  const handleHelp = () => {
    if (contextMenu) onHelp?.(contextMenu.node.data.name);
    setContextMenu(null);
  };
  const handleProperties = () => {
    if (contextMenu) onProperties?.(contextMenu.node.data);
    setContextMenu(null);
  };


  const onNodeClick = (_: React.MouseEvent, node: Node<LayerBase>) => {
    onProperties?.(node.data);

    setTimeout(() => {
      reactFlow.setCenter(node.position.x, node.position.y);
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

  const onConnect: OnConnect = (conn) => {
    const edge: Edge = {
      ...conn,
      id: generateRandomHash(8),
    };

    reactFlow.addEdges(edge);
  };

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

            onNodesChange={handleNodesChange}
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