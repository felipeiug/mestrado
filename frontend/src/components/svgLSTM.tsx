
export interface SVGLSTMProps {
  width: number;
  height: number;
}
export const SVGLSTM: React.FC<SVGLSTMProps> = ({ height, width }) => {
  return (
    <>
      {/* SVG LSTM */}
      < svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
      >

        <defs>
          <marker id="arrow" markerWidth="10" markerHeight="10" refX="6" refY="3" orient="auto">
            <path d="M0,0 L0,6 L9,3 z" fill="#000" />
          </marker>
        </defs>

        {/* Caixa da célula LSTM */}
        <rect x="0" y="0" width={width} height={height} rx="8" fill="#96a38900" strokeWidth="2" />

        {/* Entradas */}
        <text x={`${0.02 * width}`} y={`${0.47 * height}`} fontSize="12">xₜ</text>
        <line x1={`${0.08 * width}`} y1={`${0.5 * height}`} x2={`${0.08 * width}`} y2={`${0.8 * height}`} stroke="black" strokeWidth={0.5} />
        <line x1={`${0.08 * width}`} y1={`${0.5 * height}`} x2={`${0.0 * width}`} y2={`${0.5 * height}`} stroke="black" strokeWidth={0.5} />

        <text x={`${0.02 * width}`} y={`${0.78 * height}`} fontSize="12">hₜ₋₁</text>
        <line x1={`${0 * width}`} y1={`${0.8 * height}`} x2={`${0.15 * width}`} y2={`${0.8 * height}`} markerEnd="url(#arrow)" stroke="black" strokeWidth={0.5} />

        <text x={`${0.02 * width}`} y={`${0.16 * height}`} fontSize="12">cₜ₋₁</text>

        {/* Linha Superior, cruza de lado ao outro */}
        <line x1={`${0 * width}`} y1={`${0.2 * height}`} x2={`${0.9 * width}`} y2={`${0.2 * height}`} stroke="black" markerEnd="url(#arrow)" strokeWidth={0.5} />
        <line x1={`${(0.9 * width)}`} y1={`${(0.2 * height)}`} x2={`${(1 * width)}`} y2={`${(0.2 * height)}`} stroke="black" strokeWidth={0.5} />

        {/* Linha inferior, vai até quase o fim */}
        <line x1={`${0 * width}`} y1={`${0.8 * height}`} x2={`${(0.54 * width) + (0.12 * width) / 2}`} y2={`${0.8 * height}`} stroke="black" strokeWidth={0.5} />

        {/* ft gate */}
        <line x1={`${(0.12 * width) + (0.12 * width) / 2}`} y1={`${0.8 * height}`} x2={`${(0.12 * width) + (0.12 * width) / 2}`} y2={`${(0.21 * height) + (0.05 * height)}`} stroke="black" markerEnd="url(#arrow)" strokeWidth={0.5} />
        <rect x={`${0.12 * width}`} y={`${0.55 * height}`} width={`${0.12 * width}`} height={`${0.15 * height}`} rx="5" fill="yellow" stroke="#888" />
        <text x={`${(0.12 * width) + (0.12 * width) / 3}`} y={`${(0.55 * height) + (0.15 * height) / 1.5}`} fontSize="12" fontWeight="bold">σ</text>
        <text x={`${(0.12 * width)}`} y={`${(0.52 * height)}`} fontSize="12">fₜ</text>

        <circle cx={`${(0.12 * width) + (0.12 * width) / 2}`} cy={`${0.21 * height}`} r={`${0.05 * height}`} fill="pink" stroke="black" />
        <text x={`${(0.11 * width) + (0.11 * width) / 2}`} y={`${0.21 * height}`} fontSize="10" fontWeight="bold" alignmentBaseline='central'>×</text>

        {/* it gate */}
        <line x1={`${(0.26 * width) + (0.12 * width) / 2}`} y1={`${0.38 * height}`} x2={`${(0.40 * width) + ((0.11 * width) / 2) - (0.05 * height)}`} y2={`${0.38 * height}`} stroke="black" markerEnd="url(#arrow)" strokeWidth={0.5} />
        <line x1={`${(0.26 * width) + (0.12 * width) / 2}`} y1={`${0.8 * height}`} x2={`${(0.26 * width) + (0.12 * width) / 2}`} y2={`${0.38 * height}`} stroke="black" strokeWidth={0.5} />
        <rect x={`${0.26 * width}`} y={`${0.55 * height}`} width={`${0.12 * width}`} height={`${0.15 * height}`} rx="5" fill="lightgreen" stroke="#888" />
        <text x={`${(0.26 * width) + (0.12 * width) / 3}`} y={`${(0.55 * height) + (0.15 * height) / 1.5}`} fontSize="12" fontWeight="bold">σ</text>
        <text x={`${(0.26 * width)}`} y={`${(0.52 * height)}`} fontSize="12">iₜ</text>

        {/* ĉt - tanh */}
        <line x1={`${(0.40 * width) + (0.12 * width) / 2}`} y1={`${0.8 * height}`} x2={`${(0.40 * width) + (0.12 * width) / 2}`} y2={`${(0.21 * height) + (0.05 * height)}`} stroke="black" markerEnd="url(#arrow)" strokeWidth={0.5} />
        <rect x={`${0.40 * width}`} y={`${0.55 * height}`} width={`${0.12 * width}`} height={`${0.15 * height}`} rx="5" fill="gold" stroke="#888" />
        <text x={`${(0.40 * width) + (0.12 * width) / 14}`} y={`${(0.55 * height) + (0.15 * height) / 1.5}`} fontSize="10" fontWeight="bold">tanh</text>
        <text x={`${(0.40 * width)}`} y={`${(0.52 * height)}`} fontSize="12">ĉₜ</text>

        <circle cx={`${(0.4 * width) + (0.12 * width) / 2}`} cy={`${0.38 * height}`} r={`${0.05 * height}`} fill="pink" stroke="black" />
        <text x={`${(0.39 * width) + (0.11 * width) / 2}`} y={`${0.38 * height}`} fontSize="10" fontWeight="bold" alignmentBaseline='central'>×</text>

        <circle cx={`${(0.4 * width) + (0.12 * width) / 2}`} cy={`${0.21 * height}`} r={`${0.05 * height}`} fill="#90caf9" stroke="black" />
        <text x={`${(0.38 * width) + (0.13 * width) / 2}`} y={`${0.21 * height}`} fontSize="10" fontWeight="bold" alignmentBaseline='central'>+</text>

        {/* ot gate */}
        <line x1={`${(0.54 * width) + (0.12 * width) / 2}`} y1={`${0.46 * height}`} x2={`${(0.66 * width) + ((0.11 * width) / 2) - (0.05 * height)}`} y2={`${0.46 * height}`} stroke="black" markerEnd="url(#arrow)" strokeWidth={0.5} />
        <line x1={`${(0.54 * width) + (0.12 * width) / 2}`} y1={`${0.8 * height}`} x2={`${(0.54 * width) + (0.12 * width) / 2}`} y2={`${0.46 * height}`} stroke="black" strokeWidth={0.5} />
        <rect x={`${0.54 * width}`} y={`${0.55 * height}`} width={`${0.12 * width}`} height={`${0.15 * height}`} rx="5" fill="red" stroke="#888" />
        <text x={`${(0.54 * width) + (0.12 * width) / 3}`} y={`${(0.55 * height) + (0.15 * height) / 1.5}`} fontSize="12" fontWeight="bold">σ</text>
        <text x={`${(0.54 * width)}`} y={`${(0.52 * height)}`} fontSize="12">oₜ</text>

        {/* Última linha */}
        <line x1={`${(0.66 * width) + (0.11 * width) / 2}`} y1={`${0.8 * height}`} x2={`${(0.66 * width) + (0.11 * width) / 2}`} y2={`${(0.2 * height)}`} stroke="black" strokeWidth={0.5} />
        <line x1={`${(0.66 * width) + (0.11 * width) / 2}`} y1={`${(0.8 * height)}`} x2={`${(0.9 * width)}`} y2={`${(0.8 * height)}`} stroke="black" markerEnd="url(#arrow)" strokeWidth={0.5} />
        <line x1={`${(0.9 * width)}`} y1={`${(0.8 * height)}`} x2={`${(1 * width)}`} y2={`${(0.8 * height)}`} stroke="black" strokeWidth={0.5} />

        <ellipse cx={`${(0.66 * width) + ((0.11 * width) / 2)}`} cy={`${0.3 * height}`} rx={`${0.05 * width}`} ry={`${0.05 * height}`} fill="violet" stroke="black" />
        <text x={`${(0.62 * width) + ((0.11 * width) / 2)}`} y={`${0.32 * height}`} fontSize="7" fontWeight="bold">tanh</text>

        <circle cx={`${(0.66 * width) + ((0.11 * width) / 2)}`} cy={`${0.46 * height}`} r={`${0.05 * height}`} fill="pink" stroke="black" />
        <text x={`${(0.65 * width) + ((0.1 * width) / 2)}`} y={`${0.46 * height}`} fontSize="10" fontWeight="bold" alignmentBaseline='central'>×</text>

        {/* Saída */}
        <text x={`${0.94 * width}`} y={`${0.78 * height}`} fontSize="12">hₜ</text>
        <text x={`${0.94 * width}`} y={`${0.17 * height}`} fontSize="12">cₜ</text>

        <line x1={`${(0.85 * width)}`} y1={`${(0.5 * height)}`} x2={`${(0.9 * width)}`} y2={`${(0.5 * height)}`} stroke="black" markerEnd="url(#arrow)" strokeWidth={0.5} />
        <line x1={`${(0.9 * width)}`} y1={`${(0.5 * height)}`} x2={`${(1 * width)}`} y2={`${(0.5 * height)}`} stroke="black" strokeWidth={0.5} />
        <line x1={`${(0.85 * width)}`} y1={`${(0.8 * height)}`} x2={`${(0.85 * width)}`} y2={`${(0.5 * height)}`} stroke="black" strokeWidth={0.5} />

        <text x={`${(0.94 * width)}`} y={`${(0.46 * height)}`} fontSize="12">yₜ</text>
      </svg >
    </>
  );
};