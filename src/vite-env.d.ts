/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly REACT_APP_API_BASE: string
  readonly REACT_APP_DEBUG?: string
  readonly MODE: string
  readonly DEV: boolean
  readonly PROD: boolean
  readonly SSR: boolean
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}