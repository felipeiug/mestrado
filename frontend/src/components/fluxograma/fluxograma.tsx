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
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { LinearLayer } from './linear';
import { LayerType, LayerTypeName, Linear } from '../../core';

const nodeTypes: any = {
  linearLayer: LinearLayer
};

export type FluxogramaProps = {
  onHelp?: (layer: LayerTypeName) => void;
}

export const Fluxograma: React.FC<FluxogramaProps> = ({ onHelp }) => {

  const [edges, setEdges] = useState<Edge[]>([]);
  const [nodes, setNodes] = useState<Node<LayerType & FluxogramaProps>[]>([
    {
      id: "1",
      data: {
        inShape: [8],
        outShape: [64],
        validateInShape: (shape) => shape.length === 1,
        validateOutShape: (_) => false,
        onHelp: onHelp,
      } as Linear & FluxogramaProps,
      position: { x: 0, y: 0 },
      type: 'linearLayer',
    },
    {
      id: "2",
      data: {
        inShape: [32],
        outShape: [128],
        validateInShape: (shape) => shape.length === 1,
        validateOutShape: (_) => false,
        onHelp: onHelp,
      } as Linear & FluxogramaProps,
      position: { x: 150, y: 75 },
      type: 'linearLayer',
    },
    {
      id: "3",
      data: {
        inShape: [64],
        outShape: [128],
        validateInShape: (shape) => shape.length === 1,
        validateOutShape: (_) => false,
        onHelp: onHelp,
      } as Linear & FluxogramaProps,
      position: { x: 150, y: -75 },
      type: 'linearLayer',
    },
  ]);

  const onNodesChange = useCallback(
    (changes: any) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [],
  );
  const onEdgesChange = useCallback(
    (changes: any) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [],
  );

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [],
  );

  return (
    <div style={{ height: '100%', width: "100%" }}>
      <ReactFlow<Node<LayerType & FluxogramaProps>>
        fitView
        nodes={nodes}
        onNodesChange={onNodesChange}
        edges={edges}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}