/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API: string;
  readonly VITE_SOCKET: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
