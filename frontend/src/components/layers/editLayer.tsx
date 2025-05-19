import { Box } from "@mui/material"
import { LayerBase } from "../../core";

export interface EditLayerProps {
  layer: LayerBase;
}

export const LayerEdit: React.FC<EditLayerProps> = ({
  layer
}) => {

  console.log(layer);

  return <Box></Box>;
}