import { AddCircle, Timeline } from '@mui/icons-material';
import { Tooltip } from '@mui/material';
import { Connection, Node, useEdges, useNodes } from '@xyflow/react';
import { EdgeBase } from '@xyflow/system';
import { LayerType, Linear } from '../../core';
import { useState } from 'react';
import { BaseNode } from './baseNode';


export function LinearLayer(nodeData: Node<Linear>) {
  const color = "rgb(175, 214, 46)";

  const nodes = useNodes<Node<LayerType>>();
  const edges = useEdges();

  const [state, setState] = useState(false);

  const validateConnection = (edge: EdgeBase | Connection) => {
    if (edge.source === edge.target) return false;

    const nodeSource = nodes.filter(value => value.id === edge.source)[0];
    const nodeTarget = nodes.filter(value => value.id === edge.target)[0];
    const valid = nodeTarget.data.validateInShape(nodeSource.data.outShape);

    for (const ed of edges) {
      if (ed.target === nodeTarget.id) return false;
    }

    if (valid) nodeTarget.data.inShape = nodeSource.data.outShape;

    return valid;
  };

  const handleConnect = () => {
    setState(!state);
  }

  return <BaseNode
    title='Linear'
    color={color}

    inShape={nodeData.data.inShape}
    outShape={nodeData.data.outShape}

    onConnection={handleConnect}
    validateConnection={validateConnection}
  >
    <Timeline sx={{ fontSize: 22, color: color }} />
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
  </BaseNode>;
};