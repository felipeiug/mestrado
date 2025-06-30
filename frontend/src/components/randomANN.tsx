import React, { useEffect, useMemo, useRef, useState } from 'react';
import { generateRandomColor, SeededRandom } from '../core';

// Função para gerar variações de cor
function generateColorVariations(baseColor: string, count: number, random: SeededRandom) {
  // Converter para HSL que é mais fácil de manipular
  let hex = baseColor.replace('#', '');

  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('');
  }

  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);

  r /= 255, g /= 255, b /= 255;

  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  const variations: string[] = [];

  for (let i = 0; i < count; i++) {
    // Variações de matiz (hue), saturação e luminosidade
    const newH = (h + (random.next() * 0.2 - 0.1)) % 1;
    const newS = Math.min(1, Math.max(0, s + (random.next() * 0.3 - 0.15)));
    const newL = Math.min(0.9, Math.max(0.1, l + (random.next() * 0.3 - 0.15)));

    // Converter HSL de volta para RGB
    const rgb = hslToRgb(newH, newS, newL);
    variations.push(`#${rgb.r.toString(16).padStart(2, '0')}${rgb.g.toString(16).padStart(2, '0')}${rgb.b.toString(16).padStart(2, '0')}`);
  }

  return variations;
}

// Função auxiliar para converter HSL para RGB
function hslToRgb(h: number, s: number, l: number) {
  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}

interface ParticleGraphProps extends React.SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  seed?: number | string;
  connectionProbability?: number;
  baseColor?: string; // Nova prop para a cor base
  minParticleSize?: number;
  maxParticleSize?: number;
}

export const ParticleGraph: React.FC<ParticleGraphProps> = ({
  seed = Date.now(),
  connectionProbability = 0.2,
  minParticleSize = 2,
  maxParticleSize = 10,
  ...svgProps
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Efeito para observar mudanças no tamanho do container
  useEffect(() => {
    const updateDimensions = () => {
      if (svgRef.current) {
        const { width, height } = svgRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };

    updateDimensions();

    const resizeObserver = new ResizeObserver(updateDimensions);
    if (svgRef.current) {
      resizeObserver.observe(svgRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  const random = useMemo(() => {
    if (typeof seed === 'number') return new SeededRandom(seed + 1);
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      const char = seed.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0; // Converte para 32-bit integer
    }
    return new SeededRandom(hash + 1);
  }, [seed]);

  // Base color
  const baseColor = useMemo(() => generateRandomColor(true, random), [random]);

  // Quantidade de partículas
  const particleCount = useMemo(() => Math.round(random.next() * 30), [random]);

  // Gerar cores baseadas na cor principal
  const colorPalette = useMemo(() =>
    generateColorVariations(baseColor, particleCount, random),
    [baseColor, random]
  );

  // Gerar partículas aleatórias
  const particles = useMemo(() => {
    return Array.from({ length: particleCount }).map((_, i) => ({
      id: i,
      x: (random.next() * (dimensions.width * 0.8)) + dimensions.width * 0.1,
      y: (random.next() * (dimensions.height * 0.8)) + dimensions.height * 0.1,
      size: minParticleSize + random.next() * (maxParticleSize - minParticleSize),
      color: colorPalette[i],
    }));
  }, [random, dimensions, minParticleSize, maxParticleSize, colorPalette]);

  // Gerar conexões aleatórias entre partículas
  const connections = useMemo(() => {
    const result: { x1: number; y1: number; x2: number; y2: number; width: number }[] = [];

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        if (random.next() < connectionProbability) {
          const p1 = particles[i];
          const p2 = particles[j];

          result.push({
            x1: p1.x,
            y1: p1.y,
            x2: p2.x,
            y2: p2.y,
            width: 0.5,
          });
        }
      }
    }

    return result;
  }, [particles, connectionProbability, dimensions]);

  return (
    <svg
      ref={svgRef}
      width={dimensions.width}
      height={dimensions.height}
      viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
      {...svgProps}
    >
      {/* Desenhar conexões primeiro (para ficarem atrás das partículas) */}
      {connections.map((conn, index) => (
        <line
          key={`conn-${index}`}
          x1={conn.x1}
          y1={conn.y1}
          x2={conn.x2}
          y2={conn.y2}
          stroke={"#000"}
          strokeWidth={conn.width}
          strokeOpacity={0.3}
        />
      ))}

      {/* Desenhar partículas */}
      {particles.map((particle) => (
        <React.Fragment key={`particle-${particle.id}`}>
          {/* Partícula principal */}
          <circle
            cx={particle.x}
            cy={particle.y}
            r={particle.size}
            fill={particle.color}
          />
        </React.Fragment>
      ))}
    </svg>
  );
};

interface Node {
  id: string;
  x: number;
  y: number;
  color: string;
}
interface Layer {
  nodes: Node[];
}

interface ANNProps extends React.SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  initLayers?: Layer[];
  seed?: number | string;
  baseColor?: string; // Nova prop para a cor base
  minLayers?: number;
  maxLayers?: number;
  minLayerSize?: number;
  maxLayerSize?: number;
}

export const ANN: React.FC<ANNProps> = ({
  seed = Date.now(),
  minLayers = 3,
  maxLayers = 7,
  minLayerSize = 3,
  maxLayerSize = 10,
  initLayers,
  ...svgProps
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [layers, setLayers] = useState<Layer[] | undefined>(initLayers);

  const random = useMemo(() => {
    if (typeof seed === 'number') return new SeededRandom(seed + 1);
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      const char = seed.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0; // Converte para 32-bit integer
    }
    return new SeededRandom(hash + 1);
  }, [seed]);

  // Base color
  const baseColor = useMemo(() => generateRandomColor(true, random), [random]);

  // Gerar cores baseadas na cor principal
  const colorPalette = useMemo(() =>
    layers ? generateColorVariations(baseColor, layers.length, random) : [],
    [layers]
  );

  // Efeito para observar mudanças no tamanho do container
  useEffect(() => {
    const updateDimensions = () => {
      if (svgRef.current) {
        const { width, height } = svgRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };

    updateDimensions();

    const resizeObserver = new ResizeObserver(updateDimensions);
    if (svgRef.current) {
      resizeObserver.observe(svgRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  // Gerar layers
  useEffect(() => {
    const n_layers = Math.floor(random.next() * (maxLayers - minLayers)) + minLayers;
    const dx = (dimensions.width * 0.8) / (n_layers - 1);

    const newLayers = Array.from({ length: n_layers }).map((_, idLayer) => {
      const n_nodes = Math.floor(random.next() * (idLayer === 0 ? minLayerSize : (maxLayerSize - minLayerSize))) + minLayerSize;
      const dy = (dimensions.height * 0.8) / (n_nodes - 1);

      const x = ((dimensions.width * 0.2) / 2) + dx * idLayer;

      const nodes = Array.from({ length: n_nodes }).map((_, idNode) => {
        const y = ((dimensions.height * 0.2) / 2) + dy * idNode;
        return {
          id: `${idLayer}-${idNode}`,
          x: x,
          y: y,
          color: layers?.[idLayer]?.nodes?.[idNode]?.color ?? colorPalette[idLayer],
        };
      });

      return { nodes: nodes };
    });

    setLayers(newLayers);
  }, [random, dimensions, minLayers, maxLayers, minLayerSize, maxLayerSize]);

  // Gerar conexões aleatórias entre partículas
  const connections = useMemo(() => {
    const result: { x1: number; y1: number; x2: number; y2: number; width: number }[] = [];

    for (let i = 0; i < (layers?.length ?? 0); i++) {
      const layer = layers?.[i];
      const nextLayer = layers?.[i + 1];

      if (!layer || !nextLayer) break;

      for (let j = 0; j < layer.nodes.length; j++) {
        const node = layer.nodes[j];
        const p1 = {
          x: node.x,
          y: node.y
        };

        for (let k = 0; k < nextLayer.nodes.length; k++) {
          const node = nextLayer.nodes[k];
          const p2 = {
            x: node.x,
            y: node.y,
          };

          result.push({
            x1: p1.x,
            y1: p1.y,
            x2: p2.x,
            y2: p2.y,
            width: 1,
          });

        }
      }
    }

    return result;
  }, [layers]);

  return (
    <svg
      ref={svgRef}
      width={dimensions.width}
      height={dimensions.height}
      viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
      {...svgProps}
    >
      {/* Desenhar conexões primeiro (para ficarem atrás das partículas) */}
      {connections.map((conn, index) => (
        <line
          key={`conn-${index}`}
          x1={conn.x1}
          y1={conn.y1}
          x2={conn.x2}
          y2={conn.y2}
          stroke={"#000"}
          strokeWidth={conn.width}
          strokeOpacity={0.3}
        />
      ))}

      {/* Desenhar partículas */}
      {layers?.flatMap((layer, idx) => layer.nodes.map((node) => (
        <circle
          key={node.id}
          r={5}
          cx={node.x}
          cy={node.y}
          fill={node.color ?? colorPalette?.[idx] ?? "#fa0"}
        />
      ))
      )}
    </svg>
  );
};