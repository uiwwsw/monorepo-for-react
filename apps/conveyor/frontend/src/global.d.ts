interface Window {
  WS_API: string;
  send: <T>(type: SOCKET_NAME, arg: T | null = null) => void | undefined;
}
