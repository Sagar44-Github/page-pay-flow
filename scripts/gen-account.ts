import algosdk from "algosdk";
import fs from "fs";

const account = algosdk.generateAccount();
const mnemonic = algosdk.secretKeyToMnemonic(account.sk);
const address = account.addr.toString();

console.log("==========================================");
console.log("TEST PAYER ACCOUNT CREATED");
console.log("ADDRESS:", address);
console.log("==========================================");

// Read existing .env
let envContent = "";
try {
  envContent = fs.readFileSync(".env", "utf8");
} catch {
  envContent = "";
}

// Append or replace TEST_PAYER_MNEMONIC
if (envContent.includes("TEST_PAYER_MNEMONIC=")) {
  envContent = envContent.replace(/TEST_PAYER_MNEMONIC=.*/, `TEST_PAYER_MNEMONIC="${mnemonic}"`);
} else {
  envContent += `\nTEST_PAYER_MNEMONIC="${mnemonic}"\n`;
}

fs.writeFileSync(".env", envContent, "utf8");
console.log("Saved TEST_PAYER_MNEMONIC to local .env file securely.");
