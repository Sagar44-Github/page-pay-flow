import { AlgorandClient } from "@algorandfoundation/algokit-utils";
import fs from "fs";

function getMnemonic(): string {
  const envContent = fs.readFileSync(".env", "utf8");
  const match = envContent.match(/TEST_PAYER_MNEMONIC=["']?([^"'\n\r]+)["']?/);
  if (!match || !match[1]) throw new Error("TEST_PAYER_MNEMONIC not found in .env");
  return match[1].trim();
}

async function optInUsdc() {
  const mnemonic = getMnemonic();
  const algorand = AlgorandClient.testNet();
  const account = algorand.account.fromMnemonic(mnemonic);

  console.log("Opting in test account to Testnet USDC (ASA 10458941) via AlgoKit...");
  console.log("Address:", account.addr.toString());

  const result = await algorand.send.assetOptIn({
    sender: account.addr,
    assetId: BigInt(10458941),
    signer: account,
  });

  console.log("✅ Opt-in Transaction Confirmed!");
  console.log("TxID:", result.txId);
}

optInUsdc().catch(console.error);
