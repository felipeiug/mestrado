import { MyDXEditor } from "../editor";

export interface LayerHelpProps {
  startText?: string;
  editable?: boolean;
}

export const LayerHelp: React.FC<LayerHelpProps> = ({ editable, startText }) => {
  return <div style={{
    width: "100%",
    height: "100%",
    overflow: "auto",
    textAlign: "justify",
    padding: "0.5em",
  }}>
    <MyDXEditor
      startText={startText}
      diffText={startText}
      readOnly={!editable}
    />
  </div>;
};