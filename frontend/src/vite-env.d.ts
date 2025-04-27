/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_DEBUG: boolean;
    readonly VITE_URL: string;
    readonly VITE_CLARITY_ID: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}