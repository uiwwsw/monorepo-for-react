interface Window {
  send: <T>(type: SOCKET_NAME, arg: T | null = null) => void | undefined;
}
