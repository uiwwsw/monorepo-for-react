/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly API: string;
  readonly SOCKET: string;
  readonly PORT: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
