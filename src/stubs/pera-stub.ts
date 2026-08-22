export class PeraWalletConnect {
  platform = "web";
  isConnected = false;
  connector = null;

  connect() {
    return Promise.resolve([] as string[]);
  }

  disconnect() {
    return Promise.resolve();
  }

  reconnectSession() {
    return Promise.resolve([] as string[]);
  }

  signTransaction() {
    return Promise.resolve([] as Uint8Array[]);
  }
}

export default { PeraWalletConnect };
