declare global {
  interface Window {
    logger: () => unknown;
  }
}
