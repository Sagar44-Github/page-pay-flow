/**
 * Pera Wallet ONLY — official @perawallet/connect on Algorand Testnet.
 * No multi-wallet chooser: connect() goes straight into Pera's flow.
 */
import { PeraWalletConnect } from "@perawallet/connect";
import algosdk from "algosdk";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { WalletSigner } from "@/lib/x402/client";

export const PERA_CHAIN_TESTNET = 416002;

export function truncateAddress(address: string) {
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

export interface PeraWallet {
  address: string | null;
  connecting: boolean;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  signer: WalletSigner | null;
}

export function usePeraWallet(): PeraWallet {
  const peraRef = useRef<PeraWalletConnect | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getPera = useCallback(() => {
    if (!peraRef.current) {
      peraRef.current = new PeraWalletConnect({ chainId: PERA_CHAIN_TESTNET });
    }
    return peraRef.current;
  }, []);

  useEffect(() => {
    const pera = getPera();
    pera
      .reconnectSession()
      .then((accounts) => {
        if (accounts.length > 0 && accounts[0]) setAddress(accounts[0]);
        pera.connector?.on("disconnect", () => setAddress(null));
      })
      .catch(() => {
        /* no previous session */
      });
    return () => {
      pera.connector?.off("disconnect");
    };
  }, [getPera]);

  const connect = useCallback(async () => {
    setError(null);
    setConnecting(true);
    try {
      const pera = getPera();
      const accounts = await pera.connect();
      pera.connector?.on("disconnect", () => setAddress(null));
      if (accounts.length === 0 || !accounts[0]) {
        setError("Pera returned no account. Open Pera, unlock it, and try again.");
        return;
      }
      setAddress(accounts[0]);
    } catch (connectError) {
      const message = connectError instanceof Error ? connectError.message : String(connectError);
      setError(
        /cancel|close/i.test(message)
          ? "Pera connection was cancelled."
          : `Couldn't reach Pera Wallet on Algorand Testnet. Install Pera (mobile or extension), switch it to Testnet, then retry. (${message})`,
      );
    } finally {
      setConnecting(false);
    }
  }, [getPera]);

  const disconnect = useCallback(async () => {
    try {
      await getPera().disconnect();
    } catch {
      /* ignore */
    }
    setAddress(null);
    setError(null);
  }, [getPera]);

  const signer = useMemo<WalletSigner | null>(() => {
    if (!address) return null;
    return {
      address,
      async signTransactions(txns: Uint8Array[], indexesToSign?: number[]) {
        const indexes = indexesToSign ?? txns.map((_, index) => index);
        const group = txns.map((bytes, index) => {
          const txn = algosdk.decodeUnsignedTransaction(bytes);
          return indexes.includes(index) ? { txn } : { txn, signers: [] };
        });
        const signed = await getPera().signTransaction([group], address);
        const queue = [...signed];
        return txns.map((_, index) => (indexes.includes(index) ? (queue.shift() ?? null) : null));
      },
    };
  }, [address, getPera]);

  return { address, connecting, error, connect, disconnect, signer };
}
