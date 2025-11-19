/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

declare module "virtual:pwa-register/react" {
    export function registerSW(options?: {
      immediate?: boolean;
      onNeedRefresh?: () => void;
      onOfflineReady?: () => void;
    }): (reloadPage?: boolean) => void;
  }