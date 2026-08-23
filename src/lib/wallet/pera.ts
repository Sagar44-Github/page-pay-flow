/**
 * Pera Wallet ONLY — official @perawallet/connect on Algorand Testnet.
 * No multi-wallet chooser: connect() goes straight into Pera's flow.
 *
 * NOTE: @perawallet/connect is browser-only (references `self`).
 * We lazy-import it inside getPera() so SSR on Node.js never loads the module.
 */
import type { PeraWalletConnect as PeraWalletConnectType } from "@perawallet/connect";
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
  const peraRef = useRef<PeraWalletConnectType | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getPera = useCallback(async () => {
    if (!peraRef.current) {
      const { PeraWalletConnect } = await import("@perawallet/connect");
      peraRef.current = new PeraWalletConnect({ chainId: PERA_CHAIN_TESTNET });
    }
    return peraRef.current;
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    let mounted = true;
    getPera()
      .then((pera) => {
        if (!mounted) return;
        pera
          .reconnectSession()
          .then((accounts) => {
            if (!mounted) return;
            if (accounts.length > 0 && accounts[0]) setAddress(accounts[0]);
            pera.connector?.on("disconnect", () => setAddress(null));
          })
          .catch(() => {
            /* no previous session */
          });
      })
      .catch((err) => {
        console.warn("[pagepay] PeraWalletConnect init ignored on auto-reconnect:", err);
      });
    return () => {
      mounted = false;
      if (peraRef.current?.connector) {
        peraRef.current.connector.off("disconnect");
      }
    };
  }, [getPera]);

  const connect = useCallback(async () => {
    setError(null);
    setConnecting(true);
    try {
      const pera = await getPera();
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
          : `Couldn't reach Pera Wallet on Algorand Testnet. On desktop use Pera Web (web.perawallet.app) or scan the QR with the Pera mobile app. (${message})`,
      );
    } finally {
      setConnecting(false);
    }
  }, [getPera]);

  const disconnect = useCallback(async () => {
    try {
      const pera = await getPera();
      await pera.disconnect();
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
        const pera = await getPera();
        console.log("[pagepay] pera signTransactions", {
          txnCount: txns.length,
          indexes,
          platform: pera.platform,
          connected: pera.isConnected,
        });

        const group = txns.map((bytes, index) => {
          const txn = algosdk.decodeUnsignedTransaction(bytes);
          if (indexes.includes(index)) {
            return { txn, signers: [address] };
          }
          return { txn, signers: [] };
        });

        let signed: Uint8Array[];
        try {
          // Omit signerAddress — each slot already declares signers explicitly (ARC-0001).
          signed = await Promise.race([
            pera.signTransaction([group]),
            new Promise<never>((_, reject) => {
              setTimeout(
                () =>
                  reject(
                    new Error(
                      "Pera Wallet did not respond within 2 minutes. " +
                        "On desktop, a new tab should open at web.perawallet.app — approve the USDC transfer there. " +
                        "Or scan the QR with the Pera mobile app. Do not use Cursor's built-in browser; use Chrome or Edge.",
                    ),
                  ),
                120_000,
              );
            }),
          ]);
        } catch (signError) {
          console.error("[pagepay] pera signTransaction failed", signError);
          throw signError;
        }

        console.log("[pagepay] pera signed count", signed.length, "expected", indexes.length);
        const queue = [...signed];
        return txns.map((_, index) => (indexes.includes(index) ? (queue.shift() ?? null) : null));
      },
    };
  }, [address, getPera]);

  return { address, connecting, error, connect, disconnect, signer };
}
