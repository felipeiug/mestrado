export * from "./lightTheme";
export * from "./darkTheme";

declare module "@mui/material/styles" {
  interface Palette {
    calendario: {
      simuladoColor: string;
    };
  }
  interface PaletteOptions {
    calendario?: {
      simuladoColor?: string;
    };
  }
}
