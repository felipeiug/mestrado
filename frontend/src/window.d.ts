export { };

declare global {
    interface Window {
        clarity: any;
        JSXToHTML: (item: JSX.Element) => HTMLElement;
    }
}