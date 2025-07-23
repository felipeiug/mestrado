import React, { useEffect, useState } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  Box,
  ListItemIcon,
  IconButton,
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
} from '@mui/material';
import { useLayers } from '../../context/LayersContext';
import { ExpandMore, Help } from '@mui/icons-material';
import { LayerType } from '../../core';

interface Props {
  onHelpText?: (helpText: string) => void;
}

export const LayerList: React.FC<Props> = ({ onHelpText }) => {

  const layers = useLayers();

  const [cetegories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const categories = [...new Set(layers.map(layer => layer.category))].sort();
    setCategories(categories);
  }, [layers]);


  const handleDragStart = (event: React.DragEvent<HTMLLIElement>, layer: LayerType) => {
    event.dataTransfer.setData('application/json', JSON.stringify(layer));
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", width: "100%", height: "100%", overflow: "auto" }}>
      {cetegories.map(category => {

        return (
          <Accordion key={category} sx={{ '&.MuiAccordion-root': { boxShadow: 'none' } }}>

            <AccordionSummary expandIcon={<ExpandMore fontSize="small" />} sx={{
              padding: '0 8px',
              minHeight: '40px !important',
              '& .MuiAccordionSummary-content': { margin: '6px 0' },
            }}>
              <Typography fontWeight="bold">{category}</Typography>
            </AccordionSummary>

            <AccordionDetails>
              <List>
                {layers.filter(layer => layer.category === category).map((layer, index) => (
                  <ListItem
                    key={index}
                    draggable
                    disablePadding
                    onDragStart={(e) => handleDragStart(e, layer)}
                    sx={{ cursor: 'grab' }}
                  >
                    <ListItemText primary={layer.name} />
                    <ListItemIcon>
                      <IconButton size='small' onClick={() => onHelpText && onHelpText(layer.desc ?? "Sem Descrição")}>
                        <Help fontSize='small' />
                      </IconButton>
                    </ListItemIcon>
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>

          </Accordion>
        );
      })}
    </Box>
  );
};
