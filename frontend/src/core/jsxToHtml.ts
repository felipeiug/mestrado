import { JSX } from "react";
import { createRoot } from "react-dom/client";

export const JSXToHTML = (item: JSX.Element): HTMLElement => {
  const div = document.createElement('div');

  div.style.backgroundColor = 'transparent';
  div.style.padding = '0px';
  div.style.margin = '0px';
  div.style.borderRadius = '0px';

  if (item.props.style) {
    div.style.display = item.props.style.display;
    div.style.justifyContent = item.props.style.justifyContent;
    div.style.alignItems = item.props.style.alignItems;

    div.style.minWidth = item.props.style.minWidth;
    div.style.maxWidth = item.props.style.maxWidth;
    div.style.width = item.props.style.width;

    div.style.minHeight = item.props.style.minHeight;
    div.style.maxHeight = item.props.style.maxHeight;
    div.style.height = item.props.style.height;
  }

  const root = createRoot(div);
  root.render(item);

  return div;
};