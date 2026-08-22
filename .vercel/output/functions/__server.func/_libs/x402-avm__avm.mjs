import { a as TransactionType, i as groupTransactions, n as Transaction, o as Address, r as encodeTransactionRaw, t as AlgodClient } from "./@algorandfoundation/algokit-utils+[...].mjs";
//#region node_modules/@x402-avm/avm/dist/esm/chunk-DUGAE7GK.mjs
var ALGORAND_MAINNET_CAIP2 = "algorand:wGHE2Pwdvd7S12BL5FaOP20EGYesN73ktiC1qzkkit8=";
var ALGORAND_TESTNET_CAIP2 = "algorand:SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=";
var V1_ALGORAND_MAINNET = "algorand-mainnet";
var V1_ALGORAND_TESTNET = "algorand-testnet";
var V1_TO_CAIP2 = {
	[V1_ALGORAND_MAINNET]: ALGORAND_MAINNET_CAIP2,
	[V1_ALGORAND_TESTNET]: ALGORAND_TESTNET_CAIP2
};
var USDC_MAINNET_ASA_ID = "31566704";
var USDC_TESTNET_ASA_ID = "10458941";
var USDC_CONFIG = {
	[ALGORAND_MAINNET_CAIP2]: {
		asaId: USDC_MAINNET_ASA_ID,
		name: "USDC",
		decimals: 6
	},
	[ALGORAND_TESTNET_CAIP2]: {
		asaId: USDC_TESTNET_ASA_ID,
		name: "USDC",
		decimals: 6
	},
	[V1_ALGORAND_MAINNET]: {
		asaId: USDC_MAINNET_ASA_ID,
		name: "USDC",
		decimals: 6
	},
	[V1_ALGORAND_TESTNET]: {
		asaId: USDC_TESTNET_ASA_ID,
		name: "USDC",
		decimals: 6
	}
};
var FALLBACK_ALGOD_MAINNET = "https://mainnet-api.algonode.cloud";
var FALLBACK_ALGOD_TESTNET = "https://testnet-api.algonode.cloud";
var DEFAULT_ALGOD_MAINNET = typeof process !== "undefined" && process.env?.ALGOD_MAINNET_URL || FALLBACK_ALGOD_MAINNET;
var DEFAULT_ALGOD_TESTNET = typeof process !== "undefined" && process.env?.ALGOD_TESTNET_URL || FALLBACK_ALGOD_TESTNET;
var NETWORK_TO_ALGOD = {
	[ALGORAND_MAINNET_CAIP2]: DEFAULT_ALGOD_MAINNET,
	[ALGORAND_TESTNET_CAIP2]: DEFAULT_ALGOD_TESTNET,
	[V1_ALGORAND_MAINNET]: DEFAULT_ALGOD_MAINNET,
	[V1_ALGORAND_TESTNET]: DEFAULT_ALGOD_TESTNET
};
//#endregion
//#region node_modules/@x402-avm/avm/dist/esm/chunk-TLHHCNYP.mjs
function createAlgodClient(network, customUrl, token = "") {
	const url = customUrl ?? NETWORK_TO_ALGOD[network] ?? DEFAULT_ALGOD_TESTNET;
	return new AlgodClient({
		baseUrl: url,
		token: token || void 0
	});
}
function encodeTransaction(txn) {
	return Buffer.from(txn).toString("base64");
}
//#endregion
//#region node_modules/@x402-avm/avm/dist/esm/chunk-ZXLI3SMZ.mjs
var ExactAvmScheme$1 = class {
	/**
	* Creates a new ExactAvmScheme instance.
	*
	* @param signer - The AVM signer for client operations
	* @param config - Optional configuration for Algod client
	*/
	constructor(signer, config) {
		this.signer = signer;
		this.config = config;
		this.scheme = "exact";
	}
	/**
	* Creates a payment payload for the Exact scheme.
	*
	* Constructs an atomic transaction group with:
	* - Optional fee payer transaction (if feePayer specified in requirements.extra)
	* - ASA transfer transaction to payTo address
	*
	* @param x402Version - The x402 protocol version
	* @param paymentRequirements - The payment requirements
	* @returns Promise resolving to a payment payload result
	*/
	async createPaymentPayload(x402Version, paymentRequirements) {
		const { amount, asset, payTo, network, extra } = paymentRequirements;
		const suggestedParams = await (this.config?.algodClient ?? createAlgodClient(network, this.config?.algodUrl ?? DEFAULT_ALGOD_TESTNET, this.config?.algodToken)).suggestedParams();
		const assetId = this.getAssetId(asset, network);
		const feePayer = extra?.feePayer;
		const transactions = [];
		let paymentIndex = 0;
		const totalTxnCount = feePayer ? 2 : 1;
		const minFee = suggestedParams.minFee ?? BigInt(1e3);
		if (feePayer) {
			const feePayerTxn = new Transaction({
				type: TransactionType.Payment,
				sender: Address.fromString(feePayer),
				fee: minFee * BigInt(totalTxnCount),
				firstValid: suggestedParams.firstValid,
				lastValid: suggestedParams.lastValid,
				genesisHash: suggestedParams.genesisHash,
				genesisId: suggestedParams.genesisId,
				note: new Uint8Array(Buffer.from(`x402-fee-payer-${Date.now()}`)),
				payment: {
					receiver: Address.fromString(feePayer),
					amount: BigInt(0)
				}
			});
			transactions.push(feePayerTxn);
			paymentIndex = 1;
		}
		const assetTransferFee = feePayer ? BigInt(0) : suggestedParams.fee ?? minFee;
		const assetTransferTxn = new Transaction({
			type: TransactionType.AssetTransfer,
			sender: Address.fromString(this.signer.address),
			fee: assetTransferFee,
			firstValid: suggestedParams.firstValid,
			lastValid: suggestedParams.lastValid,
			genesisHash: suggestedParams.genesisHash,
			genesisId: suggestedParams.genesisId,
			note: new Uint8Array(Buffer.from(`x402-payment-v${x402Version}-${Date.now()}`)),
			assetTransfer: {
				receiver: Address.fromString(payTo),
				amount: BigInt(amount),
				assetId: BigInt(assetId)
			}
		});
		transactions.push(assetTransferTxn);
		let groupedTxns = transactions;
		if (transactions.length > 1) groupedTxns = groupTransactions(transactions);
		const encodedTxns = groupedTxns.map((txn) => encodeTransactionRaw(txn));
		const clientIndexes = groupedTxns.map((txn, i) => {
			return txn.sender.toString() === this.signer.address ? i : -1;
		}).filter((i) => i !== -1);
		console.log("[x402 AVM Client] Creating payment:", {
			sender: this.signer.address,
			receiver: payTo,
			amount,
			assetId: this.getAssetId(asset, network),
			network,
			clientIndexes,
			txnCount: groupedTxns.length,
			hasFeePayer: !!feePayer
		});
		const signedTxns = await this.signer.signTransactions(encodedTxns, clientIndexes);
		console.log("[x402 AVM Client] Signed transactions:", {
			signedCount: signedTxns.filter((t) => t !== null).length,
			totalCount: signedTxns.length,
			signedIndexes: signedTxns.map((t, i) => t !== null ? i : -1).filter((i) => i !== -1)
		});
		return {
			x402Version,
			payload: {
				paymentGroup: encodedTxns.map((txnBytes, i) => {
					const signedTxn = signedTxns[i];
					if (signedTxn) return encodeTransaction(signedTxn);
					return encodeTransaction(txnBytes);
				}),
				paymentIndex
			}
		};
	}
	/**
	* Gets the asset ID from the requirements or defaults to USDC
	*
	* @param asset - Asset identifier from requirements
	* @param network - Network identifier
	* @returns Asset ID as string
	*/
	getAssetId(asset, network) {
		if (/^\d+$/.test(asset)) return asset;
		const usdcConfig = USDC_CONFIG[network];
		if (usdcConfig) return usdcConfig.asaId;
		return asset;
	}
};
var NETWORKS = Object.keys({
	"algorand-mainnet": "algorand:wGHE2Pwdvd7S12BL5FaOP20EGYesN73ktiC1qzkkit8=",
	"algorand-testnet": "algorand:SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI="
});
//#endregion
//#region node_modules/@x402-avm/avm/dist/esm/chunk-EXTKAZHL.mjs
var ExactAvmSchemeV1 = class {
	/**
	* Creates a new ExactAvmSchemeV1 instance.
	*
	* @param signer - The AVM signer for client operations
	* @param config - Optional configuration for Algod client
	*/
	constructor(signer, config) {
		this.signer = signer;
		this.config = config;
		this.scheme = "exact";
	}
	/**
	* Creates a payment payload for the Exact scheme (V1).
	*
	* @param x402Version - The x402 protocol version
	* @param paymentRequirements - The payment requirements
	* @returns Promise resolving to a payment payload
	*/
	async createPaymentPayload(x402Version, paymentRequirements) {
		const selectedV1 = paymentRequirements;
		const v1Network = selectedV1.network;
		const caip2Network = V1_TO_CAIP2[v1Network] ?? v1Network;
		const suggestedParams = await (this.config?.algodClient ?? createAlgodClient(caip2Network, this.config?.algodUrl ?? DEFAULT_ALGOD_TESTNET, this.config?.algodToken)).suggestedParams();
		const assetId = this.getAssetId(selectedV1.asset, caip2Network);
		const assetTransferTxn = new Transaction({
			type: TransactionType.AssetTransfer,
			sender: Address.fromString(this.signer.address),
			fee: suggestedParams.fee ?? suggestedParams.minFee ?? BigInt(1e3),
			firstValid: suggestedParams.firstValid,
			lastValid: suggestedParams.lastValid,
			genesisHash: suggestedParams.genesisHash,
			genesisId: suggestedParams.genesisId,
			note: new Uint8Array(Buffer.from(`x402-payment-v${x402Version}`)),
			assetTransfer: {
				receiver: Address.fromString(selectedV1.payTo),
				amount: BigInt(selectedV1.maxAmountRequired),
				assetId: BigInt(assetId)
			}
		});
		const encodedTxn = encodeTransactionRaw(assetTransferTxn);
		const signedTxn = (await this.signer.signTransactions([encodedTxn], [0]))[0];
		if (!signedTxn) throw new Error("Failed to sign transaction");
		const payload = {
			paymentGroup: [encodeTransaction(signedTxn)],
			paymentIndex: 0
		};
		return {
			x402Version,
			scheme: selectedV1.scheme,
			network: selectedV1.network,
			payload
		};
	}
	/**
	* Gets the asset ID from the requirements or defaults to USDC
	*
	* @param asset - The asset identifier from requirements
	* @param network - The network identifier
	* @returns The resolved ASA ID string
	*/
	getAssetId(asset, network) {
		if (/^\d+$/.test(asset)) return asset;
		const usdcConfig = USDC_CONFIG[network];
		if (usdcConfig) return usdcConfig.asaId;
		return asset;
	}
};
//#endregion
//#region node_modules/@x402-avm/avm/dist/esm/exact/client/index.mjs
function registerExactAvmScheme$1(client, config) {
	const scheme = new ExactAvmScheme$1(config.signer, config.algodConfig);
	if (config.networks && config.networks.length > 0) config.networks.forEach((network) => {
		client.register(network, scheme);
	});
	else client.register("algorand:*", scheme);
	const v1Scheme = new ExactAvmSchemeV1(config.signer, config.algodConfig);
	NETWORKS.forEach((network) => {
		client.registerV1(network, v1Scheme);
	});
	if (config.policies) config.policies.forEach((policy) => {
		client.registerPolicy(policy);
	});
	return client;
}
//#endregion
//#region node_modules/@x402-avm/avm/dist/esm/exact/server/index.mjs
var ExactAvmScheme = class {
	constructor() {
		this.scheme = "exact";
		this.moneyParsers = [];
	}
	/**
	* Register a custom money parser in the parser chain.
	* Multiple parsers can be registered - they will be tried in registration order.
	* Each parser receives a decimal amount (e.g., 1.50 for $1.50).
	* If a parser returns null, the next parser in the chain will be tried.
	* The default parser is always the final fallback.
	*
	* @param parser - Custom function to convert amount to AssetAmount (or null to skip)
	* @returns The server instance for chaining
	*
	* @example
	* ```typescript
	* avmServer.registerMoneyParser(async (amount, network) => {
	*   // Custom conversion logic for non-USDC assets
	*   if (amount > 100) {
	*     return { amount: (amount * 1e6).toString(), asset: "12345678" };
	*   }
	*   return null; // Use next parser
	* });
	* ```
	*/
	registerMoneyParser(parser) {
		this.moneyParsers.push(parser);
		return this;
	}
	/**
	* Parses a price into an asset amount.
	* If price is already an AssetAmount, returns it directly.
	* If price is Money (string | number), parses to decimal and tries custom parsers.
	* Falls back to default conversion if all custom parsers return null.
	*
	* @param price - The price to parse
	* @param network - The network to use
	* @returns Promise that resolves to the parsed asset amount
	*/
	async parsePrice(price, network) {
		if (typeof price === "object" && price !== null && "amount" in price) {
			if (!price.asset) throw new Error(`Asset ID must be specified for AssetAmount on network ${network}`);
			return {
				amount: price.amount,
				asset: price.asset,
				extra: price.extra || {}
			};
		}
		const amount = this.parseMoneyToDecimal(price);
		for (const parser of this.moneyParsers) {
			const result = await parser(amount, network);
			if (result !== null) return result;
		}
		return this.defaultMoneyConversion(amount, network);
	}
	/**
	* Build payment requirements for this scheme/network combination
	*
	* @param paymentRequirements - The base payment requirements
	* @param supportedKind - The supported kind from facilitator (contains extra data like feePayer)
	* @param supportedKind.x402Version - The x402 version
	* @param supportedKind.scheme - The logical payment scheme
	* @param supportedKind.network - The network identifier in CAIP-2 format
	* @param supportedKind.extra - Optional extra metadata (e.g., feePayer address)
	* @param extensionKeys - Extension keys supported by the facilitator
	* @returns Payment requirements ready to be sent to clients
	*/
	enhancePaymentRequirements(paymentRequirements, supportedKind, extensionKeys) {
		const decimals = USDC_CONFIG[supportedKind.network]?.decimals ?? 6;
		const enhanced = {
			...paymentRequirements,
			extra: {
				...paymentRequirements.extra,
				decimals
			}
		};
		if (supportedKind.extra?.feePayer) enhanced.extra = {
			...enhanced.extra,
			feePayer: supportedKind.extra.feePayer
		};
		return Promise.resolve(enhanced);
	}
	/**
	* Parse Money (string | number) to a decimal number.
	* Handles formats like "$1.50", "1.50", 1.50, etc.
	*
	* @param money - The money value to parse
	* @returns Decimal number
	*/
	parseMoneyToDecimal(money) {
		if (typeof money === "number") return money;
		const cleanMoney = money.replace(/^\$/, "").trim();
		const amount = parseFloat(cleanMoney);
		if (isNaN(amount)) throw new Error(`Invalid money format: ${money}`);
		return amount;
	}
	/**
	* Default money conversion implementation.
	* Converts decimal amount to the default stablecoin (USDC) on the specified network.
	*
	* @param amount - The decimal amount (e.g., 1.50)
	* @param network - The network to use
	* @returns The parsed asset amount in USDC
	*/
	defaultMoneyConversion(amount, network) {
		const assetInfo = this.getDefaultAsset(network);
		return {
			amount: this.convertToTokenAmount(amount.toString(), assetInfo.decimals),
			asset: assetInfo.asaId,
			extra: {
				name: assetInfo.name,
				decimals: assetInfo.decimals
			}
		};
	}
	/**
	* Convert decimal amount to token units (e.g., 0.10 -> 100000 for 6-decimal tokens)
	*
	* @param decimalAmount - The decimal amount to convert
	* @param decimals - The number of decimals for the token
	* @returns The token amount as a string
	*/
	convertToTokenAmount(decimalAmount, decimals) {
		const amount = parseFloat(decimalAmount);
		if (isNaN(amount)) throw new Error(`Invalid amount: ${decimalAmount}`);
		const [intPart, decPart = ""] = String(amount).split(".");
		return (intPart + decPart.padEnd(decimals, "0").slice(0, decimals)).replace(/^0+/, "") || "0";
	}
	/**
	* Get the default asset info for a network (USDC)
	*
	* @param network - The network to get asset info for
	* @returns The asset information including ASA ID, name, and decimals
	*/
	getDefaultAsset(network) {
		const assetInfo = USDC_CONFIG[network];
		if (!assetInfo) throw new Error(`No default asset configured for network ${network}`);
		return assetInfo;
	}
};
function registerExactAvmScheme(server, config = {}) {
	const scheme = new ExactAvmScheme();
	if (config.networks && config.networks.length > 0) config.networks.forEach((network) => {
		server.register(network, scheme);
	});
	else server.register("algorand:*", scheme);
	return server;
}
//#endregion
export { registerExactAvmScheme$1 as n, ALGORAND_TESTNET_CAIP2 as r, registerExactAvmScheme as t };
