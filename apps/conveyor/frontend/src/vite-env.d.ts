/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly API: string;
  readonly WS_API: string;
  readonly PORT: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
