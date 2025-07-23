import { useState } from "react";
import {
  Box,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  useTheme,
} from "@mui/material";
import * as XLSX from "xlsx";

// Ícones
import DescriptionIcon from "@mui/icons-material/Description";
import TableChartIcon from "@mui/icons-material/TableChart";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import JsonIcon from "@mui/icons-material/Code";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";

const SUPPORTED_EXTENSIONS = [".csv", ".xlsx", ".xls"];

type DragItem = {
  file: File;
  sheet?: string;
};

type FilesSelectorProps = {
  onItemDrag?: (item: DragItem) => void;
};

export const FilesSelector = ({ onItemDrag }: FilesSelectorProps) => {
  const theme = useTheme();
  const [files, setFiles] = useState<File[]>([]);
  const [excelSheets, setExcelSheets] = useState<Record<string, string[]>>({});

  const handleUploadFile = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = SUPPORTED_EXTENSIONS.join(",");
    input.multiple = true;
    input.onchange = (e: any) => {
      const selected = Array.from(e.target.files) as File[];
      const validFiles = selected.filter(file =>
        SUPPORTED_EXTENSIONS.some(ext => file.name.toLowerCase().endsWith(ext))
      );

      setFiles(prev => [...prev, ...validFiles]);
      validFiles.forEach(async file => {
        if (file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
          const data = await file.arrayBuffer();
          const workbook = XLSX.read(data);
          const sheets = workbook.SheetNames;
          setExcelSheets(prev => ({ ...prev, [file.name]: sheets }));
        }
      });
    };
    input.click();
  };

  const handleDragStart = (item: DragItem) => (e: React.DragEvent) => {
    e.dataTransfer.setData("application/json", JSON.stringify(item));
    if (onItemDrag) onItemDrag(item);
  };

  const getFileIcon = (filename: string) => {
    const ext = filename.split(".").pop()?.toLowerCase();
    switch (ext) {
      case "csv":
      case "tsv":
        return <TableChartIcon />;
      case "xlsx":
      case "xls":
        return <DescriptionIcon />;
      case "json":
        return <JsonIcon />;
      case "txt":
        return <TextSnippetIcon />;
      default:
        return <InsertDriveFileIcon />;
    }
  };

  return (
    <Box display="flex" flexDirection="column" height="100%" width="100%">
      <Box
        sx={{
          flexGrow: 1,
          overflow: "auto",
          minHeight: 0,
        }}
      >
        {files.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No file selected
          </Typography>
        ) : (
          <List dense>
            {files.map((file, index) => (
              <Box key={index}>
                <ListItem
                  draggable
                  onDragStart={handleDragStart({ file })}
                  sx={{
                    bgcolor: theme.palette.action.hover,
                    borderRadius: 1,
                    mb: 0.5,
                    "&:hover": {
                      bgcolor: theme.palette.action.selected,
                    },
                  }}
                >
                  <ListItemIcon>{getFileIcon(file.name)}</ListItemIcon>
                  <ListItemText primary={file.name} />
                </ListItem>

                {excelSheets[file.name]?.map((sheet, i) => (
                  <ListItem
                    key={i}
                    draggable
                    onDragStart={handleDragStart({ file, sheet })}
                    sx={{
                      pl: 4,
                      ml: 1,
                      borderLeft: `2px solid ${theme.palette.divider}`,
                      "&:hover": {
                        bgcolor: theme.palette.action.hover,
                      },
                    }}
                  >
                    <ListItemIcon>
                      <TableChartIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={`• ${sheet}`} />
                  </ListItem>
                ))}
              </Box>
            ))}
          </List>
        )}
      </Box>

      <Button fullWidth variant="contained" onClick={handleUploadFile}>
        Upload File
      </Button>
    </Box>
  );
};
