import { i as __require$1 } from "../_runtime.mjs";
//#region node_modules/@x402-avm/core/dist/esm/chunk-HRQUGJ3Y.mjs
var VerifyError = class extends Error {
	/**
	* Creates a VerifyError from a failed verification response.
	*
	* @param statusCode - HTTP status code from the facilitator
	* @param response - The verify response containing error details
	*/
	constructor(statusCode, response) {
		const reason = response.invalidReason || "unknown reason";
		const message = response.invalidMessage;
		super(message ? `${reason}: ${message}` : reason);
		this.name = "VerifyError";
		this.statusCode = statusCode;
		this.invalidReason = response.invalidReason;
		this.invalidMessage = response.invalidMessage;
		this.payer = response.payer;
	}
};
var SettleError = class extends Error {
	/**
	* Creates a SettleError from a failed settlement response.
	*
	* @param statusCode - HTTP status code from the facilitator
	* @param response - The settle response containing error details
	*/
	constructor(statusCode, response) {
		const reason = response.errorReason || "unknown reason";
		const message = response.errorMessage;
		super(message ? `${reason}: ${message}` : reason);
		this.name = "SettleError";
		this.statusCode = statusCode;
		this.errorReason = response.errorReason;
		this.errorMessage = response.errorMessage;
		this.payer = response.payer;
		this.transaction = response.transaction;
		this.network = response.network;
	}
};
//#endregion
//#region node_modules/@x402-avm/core/dist/esm/chunk-TDLQZ6MP.mjs
var findSchemesByNetwork = (map, network) => {
	let implementationsByScheme = map.get(network);
	if (!implementationsByScheme) for (const [registeredNetworkPattern, implementations] of map.entries()) {
		const pattern = registeredNetworkPattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\\\*/g, ".*");
		if (new RegExp(`^${pattern}$`).test(network)) {
			implementationsByScheme = implementations;
			break;
		}
	}
	return implementationsByScheme;
};
var findByNetworkAndScheme = (map, scheme, network) => {
	return findSchemesByNetwork(map, network)?.get(scheme);
};
var Base64EncodedRegex = /^[A-Za-z0-9+/]*={0,2}$/;
function safeBase64Encode(data) {
	if (typeof globalThis !== "undefined" && typeof globalThis.btoa === "function") {
		const bytes = new TextEncoder().encode(data);
		const binaryString = Array.from(bytes, (byte) => String.fromCharCode(byte)).join("");
		return globalThis.btoa(binaryString);
	}
	return Buffer.from(data, "utf8").toString("base64");
}
function safeBase64Decode(data) {
	if (typeof globalThis !== "undefined" && typeof globalThis.atob === "function") {
		const binaryString = globalThis.atob(data);
		const bytes = new Uint8Array(binaryString.length);
		for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
		return new TextDecoder("utf-8").decode(bytes);
	}
	return Buffer.from(data, "base64").toString("utf-8");
}
function deepEqual(obj1, obj2) {
	const normalize = (obj) => {
		if (obj === null || obj === void 0) return JSON.stringify(obj);
		if (typeof obj !== "object") return JSON.stringify(obj);
		if (Array.isArray(obj)) return JSON.stringify(obj.map((item) => typeof item === "object" && item !== null ? JSON.parse(normalize(item)) : item));
		const sorted = {};
		Object.keys(obj).sort().forEach((key) => {
			const value = obj[key];
			sorted[key] = typeof value === "object" && value !== null ? JSON.parse(normalize(value)) : value;
		});
		return JSON.stringify(sorted);
	};
	try {
		return normalize(obj1) === normalize(obj2);
	} catch {
		return JSON.stringify(obj1) === JSON.stringify(obj2);
	}
}
//#endregion
//#region node_modules/@x402-avm/core/dist/esm/chunk-BJTO5JO5.mjs
var __require = /* @__PURE__ */ ((x) => typeof __require$1 !== "undefined" ? __require$1 : typeof Proxy !== "undefined" ? new Proxy(x, { get: (a, b) => (typeof __require$1 !== "undefined" ? __require$1 : a)[b] }) : x)(function(x) {
	if (typeof __require$1 !== "undefined") return __require$1.apply(this, arguments);
	throw Error("Dynamic require of \"" + x + "\" is not supported");
});
//#endregion
//#region node_modules/@x402-avm/core/dist/esm/chunk-L5XMR4QC.mjs
var RouteConfigurationError = class extends Error {
	/**
	* Creates a new RouteConfigurationError with the given validation errors.
	*
	* @param errors - The validation errors that caused this exception.
	*/
	constructor(errors) {
		const message = `x402 Route Configuration Errors:
${errors.map((e) => `  - ${e.message}`).join("\n")}`;
		super(message);
		this.name = "RouteConfigurationError";
		this.errors = errors;
	}
};
var x402HTTPResourceServer = class {
	/**
	* Creates a new x402HTTPResourceServer instance.
	*
	* @param ResourceServer - The core x402ResourceServer instance to use
	* @param routes - Route configuration for payment-protected endpoints
	*/
	constructor(ResourceServer, routes) {
		this.compiledRoutes = [];
		this.protectedRequestHooks = [];
		this.ResourceServer = ResourceServer;
		this.routesConfig = routes;
		const normalizedRoutes = typeof routes === "object" && !("accepts" in routes) ? routes : { "*": routes };
		for (const [pattern, config] of Object.entries(normalizedRoutes)) {
			const parsed = this.parseRoutePattern(pattern);
			this.compiledRoutes.push({
				verb: parsed.verb,
				regex: parsed.regex,
				config
			});
		}
	}
	/**
	* Get the underlying x402ResourceServer instance.
	*
	* @returns The underlying x402ResourceServer instance
	*/
	get server() {
		return this.ResourceServer;
	}
	/**
	* Get the routes configuration.
	*
	* @returns The routes configuration
	*/
	get routes() {
		return this.routesConfig;
	}
	/**
	* Initialize the HTTP resource server.
	*
	* This method initializes the underlying resource server (fetching facilitator support)
	* and then validates that all route payment configurations have corresponding
	* registered schemes and facilitator support.
	*
	* @throws RouteConfigurationError if any route's payment options don't have
	*         corresponding registered schemes or facilitator support
	*
	* @example
	* ```typescript
	* const httpServer = new x402HTTPResourceServer(server, routes);
	* await httpServer.initialize();
	* ```
	*/
	async initialize() {
		await this.ResourceServer.initialize();
		const errors = this.validateRouteConfiguration();
		if (errors.length > 0) throw new RouteConfigurationError(errors);
	}
	/**
	* Register a custom paywall provider for generating HTML
	*
	* @param provider - PaywallProvider instance
	* @returns This service instance for chaining
	*/
	registerPaywallProvider(provider) {
		this.paywallProvider = provider;
		return this;
	}
	/**
	* Register a hook that runs on every request to a protected route, before payment processing.
	* Hooks are executed in order of registration. The first hook to return a non-void result wins.
	*
	* @param hook - The request hook function
	* @returns The x402HTTPResourceServer instance for chaining
	*/
	onProtectedRequest(hook) {
		this.protectedRequestHooks.push(hook);
		return this;
	}
	/**
	* Process HTTP request and return response instructions
	* This is the main entry point for framework middleware
	*
	* @param context - HTTP request context
	* @param paywallConfig - Optional paywall configuration
	* @returns Process result indicating next action for middleware
	*/
	async processHTTPRequest(context, paywallConfig) {
		const { adapter, path, method } = context;
		const routeConfig = this.getRouteConfig(path, method);
		if (!routeConfig) return { type: "no-payment-required" };
		for (const hook of this.protectedRequestHooks) {
			const result = await hook(context, routeConfig);
			if (result && "grantAccess" in result) return { type: "no-payment-required" };
			if (result && "abort" in result) return {
				type: "payment-error",
				response: {
					status: 403,
					headers: { "Content-Type": "application/json" },
					body: { error: result.reason }
				}
			};
		}
		const paymentOptions = this.normalizePaymentOptions(routeConfig);
		const paymentPayload = this.extractPayment(adapter);
		const resourceInfo = {
			url: routeConfig.resource || context.adapter.getUrl(),
			description: routeConfig.description || "",
			mimeType: routeConfig.mimeType || ""
		};
		let requirements = await this.ResourceServer.buildPaymentRequirementsFromOptions(paymentOptions, context);
		let extensions = routeConfig.extensions;
		if (extensions) extensions = this.ResourceServer.enrichExtensions(extensions, context);
		const transportContext = { request: context };
		const paymentRequired = await this.ResourceServer.createPaymentRequiredResponse(requirements, resourceInfo, !paymentPayload ? "Payment required" : void 0, extensions, transportContext);
		if (!paymentPayload) {
			const unpaidBody = routeConfig.unpaidResponseBody ? await routeConfig.unpaidResponseBody(context) : void 0;
			return {
				type: "payment-error",
				response: this.createHTTPResponse(paymentRequired, this.isWebBrowser(adapter), paywallConfig, routeConfig.customPaywallHtml, unpaidBody)
			};
		}
		try {
			const matchingRequirements = this.ResourceServer.findMatchingRequirements(paymentRequired.accepts, paymentPayload);
			if (!matchingRequirements) {
				const errorResponse = await this.ResourceServer.createPaymentRequiredResponse(requirements, resourceInfo, "No matching payment requirements", routeConfig.extensions, transportContext);
				return {
					type: "payment-error",
					response: this.createHTTPResponse(errorResponse, false, paywallConfig)
				};
			}
			const verifyResult = await this.ResourceServer.verifyPayment(paymentPayload, matchingRequirements);
			if (!verifyResult.isValid) {
				const errorResponse = await this.ResourceServer.createPaymentRequiredResponse(requirements, resourceInfo, verifyResult.invalidReason, routeConfig.extensions, transportContext);
				return {
					type: "payment-error",
					response: this.createHTTPResponse(errorResponse, false, paywallConfig)
				};
			}
			return {
				type: "payment-verified",
				paymentPayload,
				paymentRequirements: matchingRequirements,
				declaredExtensions: routeConfig.extensions
			};
		} catch (error) {
			const errorResponse = await this.ResourceServer.createPaymentRequiredResponse(requirements, resourceInfo, error instanceof Error ? error.message : "Payment verification failed", routeConfig.extensions, transportContext);
			return {
				type: "payment-error",
				response: this.createHTTPResponse(errorResponse, false, paywallConfig)
			};
		}
	}
	/**
	* Process settlement after successful response
	*
	* @param paymentPayload - The verified payment payload
	* @param requirements - The matching payment requirements
	* @param declaredExtensions - Optional declared extensions (for per-key enrichment)
	* @param transportContext - Optional HTTP transport context
	* @returns ProcessSettleResultResponse - SettleResponse with headers if success or errorReason if failure
	*/
	async processSettlement(paymentPayload, requirements, declaredExtensions, transportContext) {
		try {
			const settleResponse = await this.ResourceServer.settlePayment(paymentPayload, requirements, declaredExtensions, transportContext);
			if (!settleResponse.success) {
				const failure = {
					...settleResponse,
					success: false,
					errorReason: settleResponse.errorReason || "Settlement failed",
					errorMessage: settleResponse.errorMessage || settleResponse.errorReason || "Settlement failed",
					headers: this.createSettlementHeaders(settleResponse)
				};
				const response = await this.buildSettlementFailureResponse(failure, transportContext);
				return {
					...failure,
					response
				};
			}
			return {
				...settleResponse,
				success: true,
				headers: this.createSettlementHeaders(settleResponse),
				requirements
			};
		} catch (error) {
			if (error instanceof SettleError) {
				const errorReason2 = error.errorReason || error.message;
				const settleResponse2 = {
					success: false,
					errorReason: errorReason2,
					errorMessage: error.errorMessage || errorReason2,
					payer: error.payer,
					network: error.network,
					transaction: error.transaction
				};
				const failure2 = {
					...settleResponse2,
					success: false,
					errorReason: errorReason2,
					headers: this.createSettlementHeaders(settleResponse2)
				};
				const response2 = await this.buildSettlementFailureResponse(failure2, transportContext);
				return {
					...failure2,
					response: response2
				};
			}
			const errorReason = error instanceof Error ? error.message : "Settlement failed";
			const settleResponse = {
				success: false,
				errorReason,
				errorMessage: errorReason,
				network: requirements.network,
				transaction: ""
			};
			const failure = {
				...settleResponse,
				success: false,
				errorReason,
				headers: this.createSettlementHeaders(settleResponse)
			};
			const response = await this.buildSettlementFailureResponse(failure, transportContext);
			return {
				...failure,
				response
			};
		}
	}
	/**
	* Check if a request requires payment based on route configuration
	*
	* @param context - HTTP request context
	* @returns True if the route requires payment, false otherwise
	*/
	requiresPayment(context) {
		return this.getRouteConfig(context.path, context.method) !== void 0;
	}
	/**
	* Build HTTPResponseInstructions for settlement failure.
	* Uses settlementFailedResponseBody hook if configured, otherwise defaults to empty body.
	*
	* @param failure - Settlement failure result with headers
	* @param transportContext - Optional HTTP transport context for the request
	* @returns HTTP response instructions for the 402 settlement failure response
	*/
	async buildSettlementFailureResponse(failure, transportContext) {
		const settlementHeaders = failure.headers;
		const routeConfig = transportContext ? this.getRouteConfig(transportContext.request.path, transportContext.request.method) : void 0;
		const customBody = routeConfig?.settlementFailedResponseBody ? await routeConfig.settlementFailedResponseBody(transportContext.request, failure) : void 0;
		const contentType = customBody ? customBody.contentType : "application/json";
		const body = customBody ? customBody.body : {};
		return {
			status: 402,
			headers: {
				"Content-Type": contentType,
				...settlementHeaders
			},
			body,
			isHtml: contentType.includes("text/html")
		};
	}
	/**
	* Normalizes a RouteConfig's accepts field into an array of PaymentOptions
	* Handles both single PaymentOption and array formats
	*
	* @param routeConfig - Route configuration
	* @returns Array of payment options
	*/
	normalizePaymentOptions(routeConfig) {
		return Array.isArray(routeConfig.accepts) ? routeConfig.accepts : [routeConfig.accepts];
	}
	/**
	* Validates that all payment options in routes have corresponding registered schemes
	* and facilitator support.
	*
	* @returns Array of validation errors (empty if all routes are valid)
	*/
	validateRouteConfiguration() {
		const errors = [];
		const normalizedRoutes = typeof this.routesConfig === "object" && !("accepts" in this.routesConfig) ? Object.entries(this.routesConfig) : [["*", this.routesConfig]];
		for (const [pattern, config] of normalizedRoutes) {
			const paymentOptions = this.normalizePaymentOptions(config);
			for (const option of paymentOptions) {
				if (!this.ResourceServer.hasRegisteredScheme(option.network, option.scheme)) {
					errors.push({
						routePattern: pattern,
						scheme: option.scheme,
						network: option.network,
						reason: "missing_scheme",
						message: `Route "${pattern}": No scheme implementation registered for "${option.scheme}" on network "${option.network}"`
					});
					continue;
				}
				if (!this.ResourceServer.getSupportedKind(2, option.network, option.scheme)) errors.push({
					routePattern: pattern,
					scheme: option.scheme,
					network: option.network,
					reason: "missing_facilitator",
					message: `Route "${pattern}": Facilitator does not support scheme "${option.scheme}" on network "${option.network}"`
				});
			}
		}
		return errors;
	}
	/**
	* Get route configuration for a request
	*
	* @param path - Request path
	* @param method - HTTP method
	* @returns Route configuration or undefined if no match
	*/
	getRouteConfig(path, method) {
		const normalizedPath = this.normalizePath(path);
		const upperMethod = method.toUpperCase();
		return this.compiledRoutes.find((route) => route.regex.test(normalizedPath) && (route.verb === "*" || route.verb === upperMethod))?.config;
	}
	/**
	* Extract payment from HTTP headers (handles v1 and v2)
	*
	* @param adapter - HTTP adapter
	* @returns Decoded payment payload or null
	*/
	extractPayment(adapter) {
		const header = adapter.getHeader("payment-signature") || adapter.getHeader("PAYMENT-SIGNATURE");
		if (header) try {
			return decodePaymentSignatureHeader(header);
		} catch (error) {
			console.warn("Failed to decode PAYMENT-SIGNATURE header:", error);
		}
		return null;
	}
	/**
	* Check if request is from a web browser
	*
	* @param adapter - HTTP adapter
	* @returns True if request appears to be from a browser
	*/
	isWebBrowser(adapter) {
		const accept = adapter.getAcceptHeader();
		const userAgent = adapter.getUserAgent();
		return accept.includes("text/html") && userAgent.includes("Mozilla");
	}
	/**
	* Create HTTP response instructions from payment required
	*
	* @param paymentRequired - Payment requirements
	* @param isWebBrowser - Whether request is from browser
	* @param paywallConfig - Paywall configuration
	* @param customHtml - Custom HTML template
	* @param unpaidResponse - Optional custom response (content type and body) for unpaid API requests
	* @returns Response instructions
	*/
	createHTTPResponse(paymentRequired, isWebBrowser, paywallConfig, customHtml, unpaidResponse) {
		const status = paymentRequired.error === "permit2_allowance_required" ? 412 : 402;
		if (isWebBrowser) return {
			status,
			headers: { "Content-Type": "text/html" },
			body: this.generatePaywallHTML(paymentRequired, paywallConfig, customHtml),
			isHtml: true
		};
		const response = this.createHTTPPaymentRequiredResponse(paymentRequired);
		const contentType = unpaidResponse ? unpaidResponse.contentType : "application/json";
		const body = unpaidResponse ? unpaidResponse.body : {};
		return {
			status,
			headers: {
				"Content-Type": contentType,
				...response.headers
			},
			body
		};
	}
	/**
	* Create HTTP payment required response (v1 puts in body, v2 puts in header)
	*
	* @param paymentRequired - Payment required object
	* @returns Headers and body for the HTTP response
	*/
	createHTTPPaymentRequiredResponse(paymentRequired) {
		return { headers: { "PAYMENT-REQUIRED": encodePaymentRequiredHeader(paymentRequired) } };
	}
	/**
	* Create settlement response headers
	*
	* @param settleResponse - Settlement response
	* @returns Headers to add to response
	*/
	createSettlementHeaders(settleResponse) {
		return { "PAYMENT-RESPONSE": encodePaymentResponseHeader(settleResponse) };
	}
	/**
	* Parse route pattern into verb and regex
	*
	* @param pattern - Route pattern like "GET /api/*" or "/api/[id]"
	* @returns Parsed pattern with verb and regex
	*/
	parseRoutePattern(pattern) {
		const [verb, path] = pattern.includes(" ") ? pattern.split(/\s+/) : ["*", pattern];
		const regex = new RegExp(`^${path.replace(/[$()+.?^{|}]/g, "\\$&").replace(/\*/g, ".*?").replace(/\[([^\]]+)\]/g, "[^/]+").replace(/\//g, "\\/")}$`, "i");
		return {
			verb: verb.toUpperCase(),
			regex
		};
	}
	/**
	* Normalize path for matching
	*
	* @param path - Raw path from request
	* @returns Normalized path
	*/
	normalizePath(path) {
		const pathWithoutQuery = path.split(/[?#]/)[0];
		let decodedOrRawPath;
		try {
			decodedOrRawPath = decodeURIComponent(pathWithoutQuery);
		} catch {
			decodedOrRawPath = pathWithoutQuery;
		}
		return decodedOrRawPath.replace(/\\/g, "/").replace(/\/+/g, "/").replace(/(.+?)\/+$/, "$1");
	}
	/**
	* Generate paywall HTML for browser requests
	*
	* @param paymentRequired - Payment required response
	* @param paywallConfig - Optional paywall configuration
	* @param customHtml - Optional custom HTML template
	* @returns HTML string
	*/
	generatePaywallHTML(paymentRequired, paywallConfig, customHtml) {
		if (customHtml) return customHtml;
		if (this.paywallProvider) return this.paywallProvider.generateHtml(paymentRequired, paywallConfig);
		try {
			const paywall = __require("@x402-avm/paywall");
			const displayAmount2 = this.getDisplayAmount(paymentRequired);
			const resource2 = paymentRequired.resource;
			return paywall.getPaywallHtml({
				amount: displayAmount2,
				paymentRequired,
				currentUrl: resource2?.url || paywallConfig?.currentUrl || "",
				testnet: paywallConfig?.testnet ?? true,
				appName: paywallConfig?.appName,
				appLogo: paywallConfig?.appLogo,
				sessionTokenEndpoint: paywallConfig?.sessionTokenEndpoint
			});
		} catch {}
		const resource = paymentRequired.resource;
		const displayAmount = this.getDisplayAmount(paymentRequired);
		return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Payment Required</title>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body>
          <div style="max-width: 600px; margin: 50px auto; padding: 20px; font-family: system-ui, -apple-system, sans-serif;">
            ${paywallConfig?.appLogo ? `<img src="${paywallConfig.appLogo}" alt="${paywallConfig.appName || "App"}" style="max-width: 200px; margin-bottom: 20px;">` : ""}
            <h1>Payment Required</h1>
            ${resource ? `<p><strong>Resource:</strong> ${resource.description || resource.url}</p>` : ""}
            <p><strong>Amount:</strong> $${displayAmount.toFixed(2)} USDC</p>
            <div id="payment-widget" 
                 data-requirements='${JSON.stringify(paymentRequired)}'
                 data-app-name="${paywallConfig?.appName || ""}"
                 data-testnet="${paywallConfig?.testnet || false}">
              <!-- Install @x402-avm/paywall for full wallet integration -->
              <p style="margin-top: 2rem; padding: 1rem; background: #fef3c7; border-radius: 0.5rem;">
                <strong>Note:</strong> Install <code>@x402-avm/paywall</code> for full wallet connection and payment UI.
              </p>
            </div>
          </div>
        </body>
      </html>
    `;
	}
	/**
	* Extract display amount from payment requirements.
	*
	* @param paymentRequired - The payment required object
	* @returns The display amount in decimal format
	*/
	getDisplayAmount(paymentRequired) {
		const accepts = paymentRequired.accepts;
		if (accepts && accepts.length > 0) {
			const firstReq = accepts[0];
			if ("amount" in firstReq) return parseFloat(firstReq.amount) / 1e6;
		}
		return 0;
	}
};
var DEFAULT_FACILITATOR_URL = "https://facilitator.goplausible.xyz";
var GET_SUPPORTED_RETRIES = 3;
var GET_SUPPORTED_RETRY_DELAY_MS = 1e3;
var HTTPFacilitatorClient = class {
	/**
	* Creates a new HTTPFacilitatorClient instance.
	*
	* @param config - Configuration options for the facilitator client
	*/
	constructor(config) {
		this.url = config?.url || DEFAULT_FACILITATOR_URL;
		this._createAuthHeaders = config?.createAuthHeaders;
	}
	/**
	* Verify a payment with the facilitator
	*
	* @param paymentPayload - The payment to verify
	* @param paymentRequirements - The requirements to verify against
	* @returns Verification response
	*/
	async verify(paymentPayload, paymentRequirements) {
		let headers = { "Content-Type": "application/json" };
		if (this._createAuthHeaders) {
			const authHeaders = await this.createAuthHeaders("verify");
			headers = {
				...headers,
				...authHeaders.headers
			};
		}
		const response = await fetch(`${this.url}/verify`, {
			method: "POST",
			headers,
			body: JSON.stringify({
				x402Version: paymentPayload.x402Version,
				paymentPayload: this.toJsonSafe(paymentPayload),
				paymentRequirements: this.toJsonSafe(paymentRequirements)
			})
		});
		const data = await response.json();
		if (typeof data === "object" && data !== null && "isValid" in data) {
			const verifyResponse = data;
			if (!response.ok) throw new VerifyError(response.status, verifyResponse);
			return verifyResponse;
		}
		throw new Error(`Facilitator verify failed (${response.status}): ${JSON.stringify(data)}`);
	}
	/**
	* Settle a payment with the facilitator
	*
	* @param paymentPayload - The payment to settle
	* @param paymentRequirements - The requirements for settlement
	* @returns Settlement response
	*/
	async settle(paymentPayload, paymentRequirements) {
		let headers = { "Content-Type": "application/json" };
		if (this._createAuthHeaders) {
			const authHeaders = await this.createAuthHeaders("settle");
			headers = {
				...headers,
				...authHeaders.headers
			};
		}
		const response = await fetch(`${this.url}/settle`, {
			method: "POST",
			headers,
			body: JSON.stringify({
				x402Version: paymentPayload.x402Version,
				paymentPayload: this.toJsonSafe(paymentPayload),
				paymentRequirements: this.toJsonSafe(paymentRequirements)
			})
		});
		const data = await response.json();
		if (typeof data === "object" && data !== null && "success" in data) {
			const settleResponse = data;
			if (!response.ok) throw new SettleError(response.status, settleResponse);
			return settleResponse;
		}
		throw new Error(`Facilitator settle failed (${response.status}): ${JSON.stringify(data)}`);
	}
	/**
	* Get supported payment kinds and extensions from the facilitator.
	* Retries with exponential backoff on 429 rate limit errors.
	*
	* @returns Supported payment kinds and extensions
	*/
	async getSupported() {
		let headers = { "Content-Type": "application/json" };
		if (this._createAuthHeaders) {
			const authHeaders = await this.createAuthHeaders("supported");
			headers = {
				...headers,
				...authHeaders.headers
			};
		}
		let lastError = null;
		for (let attempt = 0; attempt < GET_SUPPORTED_RETRIES; attempt++) {
			const response = await fetch(`${this.url}/supported`, {
				method: "GET",
				headers
			});
			if (response.ok) return await response.json();
			const errorText = await response.text().catch(() => response.statusText);
			lastError = /* @__PURE__ */ new Error(`Facilitator getSupported failed (${response.status}): ${errorText}`);
			if (response.status === 429 && attempt < GET_SUPPORTED_RETRIES - 1) {
				const delay = GET_SUPPORTED_RETRY_DELAY_MS * Math.pow(2, attempt);
				await new Promise((resolve) => setTimeout(resolve, delay));
				continue;
			}
			throw lastError;
		}
		throw lastError ?? /* @__PURE__ */ new Error("Facilitator getSupported failed after retries");
	}
	/**
	* Creates authentication headers for a specific path.
	*
	* @param path - The path to create authentication headers for (e.g., "verify", "settle", "supported")
	* @returns An object containing the authentication headers for the specified path
	*/
	async createAuthHeaders(path) {
		if (this._createAuthHeaders) return { headers: (await this._createAuthHeaders())[path] ?? {} };
		return { headers: {} };
	}
	/**
	* Helper to convert objects to JSON-safe format.
	* Handles BigInt and other non-JSON types.
	*
	* @param obj - The object to convert
	* @returns The JSON-safe representation of the object
	*/
	toJsonSafe(obj) {
		return JSON.parse(JSON.stringify(obj, (_, value) => typeof value === "bigint" ? value.toString() : value));
	}
};
var x402HTTPClient = class {
	/**
	* Creates a new x402HTTPClient instance.
	*
	* @param client - The underlying x402Client for payment logic
	*/
	constructor(client) {
		this.client = client;
		this.paymentRequiredHooks = [];
	}
	/**
	* Register a hook to handle 402 responses before payment.
	* Hooks run in order; first to return headers wins.
	*
	* @param hook - The hook function to register
	* @returns This instance for chaining
	*/
	onPaymentRequired(hook) {
		this.paymentRequiredHooks.push(hook);
		return this;
	}
	/**
	* Run hooks and return headers if any hook provides them.
	*
	* @param paymentRequired - The payment required response from the server
	* @returns Headers to use for retry, or null to proceed to payment
	*/
	async handlePaymentRequired(paymentRequired) {
		for (const hook of this.paymentRequiredHooks) {
			const result = await hook({ paymentRequired });
			if (result?.headers) return result.headers;
		}
		return null;
	}
	/**
	* Encodes a payment payload into appropriate HTTP headers based on version.
	*
	* @param paymentPayload - The payment payload to encode
	* @returns HTTP headers containing the encoded payment signature
	*/
	encodePaymentSignatureHeader(paymentPayload) {
		switch (paymentPayload.x402Version) {
			case 2: return { "PAYMENT-SIGNATURE": encodePaymentSignatureHeader(paymentPayload) };
			case 1: return { "X-PAYMENT": encodePaymentSignatureHeader(paymentPayload) };
			default: throw new Error(`Unsupported x402 version: ${paymentPayload.x402Version}`);
		}
	}
	/**
	* Extracts payment required information from HTTP response.
	*
	* @param getHeader - Function to retrieve header value by name (case-insensitive)
	* @param body - Optional response body for v1 compatibility
	* @returns The payment required object
	*/
	getPaymentRequiredResponse(getHeader, body) {
		const paymentRequired = getHeader("PAYMENT-REQUIRED");
		if (paymentRequired) return decodePaymentRequiredHeader(paymentRequired);
		if (body && body instanceof Object && "x402Version" in body && body.x402Version === 1) return body;
		throw new Error("Invalid payment required response");
	}
	/**
	* Extracts payment settlement response from HTTP headers.
	*
	* @param getHeader - Function to retrieve header value by name (case-insensitive)
	* @returns The settlement response object
	*/
	getPaymentSettleResponse(getHeader) {
		const paymentResponse = getHeader("PAYMENT-RESPONSE");
		if (paymentResponse) return decodePaymentResponseHeader(paymentResponse);
		const xPaymentResponse = getHeader("X-PAYMENT-RESPONSE");
		if (xPaymentResponse) return decodePaymentResponseHeader(xPaymentResponse);
		throw new Error("Payment response header not found");
	}
	/**
	* Creates a payment payload for the given payment requirements.
	* Delegates to the underlying x402Client.
	*
	* @param paymentRequired - The payment required response from the server
	* @returns Promise resolving to the payment payload
	*/
	async createPaymentPayload(paymentRequired) {
		return this.client.createPaymentPayload(paymentRequired);
	}
};
function encodePaymentSignatureHeader(paymentPayload) {
	return safeBase64Encode(JSON.stringify(paymentPayload));
}
function decodePaymentSignatureHeader(paymentSignatureHeader) {
	if (!Base64EncodedRegex.test(paymentSignatureHeader)) throw new Error("Invalid payment signature header");
	return JSON.parse(safeBase64Decode(paymentSignatureHeader));
}
function encodePaymentRequiredHeader(paymentRequired) {
	return safeBase64Encode(JSON.stringify(paymentRequired));
}
function decodePaymentRequiredHeader(paymentRequiredHeader) {
	if (!Base64EncodedRegex.test(paymentRequiredHeader)) throw new Error("Invalid payment required header");
	return JSON.parse(safeBase64Decode(paymentRequiredHeader));
}
function encodePaymentResponseHeader(paymentResponse) {
	return safeBase64Encode(JSON.stringify(paymentResponse));
}
function decodePaymentResponseHeader(paymentResponseHeader) {
	if (!Base64EncodedRegex.test(paymentResponseHeader)) throw new Error("Invalid payment response header");
	return JSON.parse(safeBase64Decode(paymentResponseHeader));
}
//#endregion
//#region node_modules/@x402-avm/core/dist/esm/client/index.mjs
var x402Client = class _x402Client {
	/**
	* Creates a new x402Client instance.
	*
	* @param paymentRequirementsSelector - Function to select payment requirements from available options
	*/
	constructor(paymentRequirementsSelector) {
		this.registeredClientSchemes = /* @__PURE__ */ new Map();
		this.policies = [];
		this.registeredExtensions = /* @__PURE__ */ new Map();
		this.beforePaymentCreationHooks = [];
		this.afterPaymentCreationHooks = [];
		this.onPaymentCreationFailureHooks = [];
		this.paymentRequirementsSelector = paymentRequirementsSelector || ((x402Version2, accepts) => accepts[0]);
	}
	/**
	* Creates a new x402Client instance from a configuration object.
	*
	* @param config - The client configuration including schemes, policies, and payment requirements selector
	* @returns A configured x402Client instance
	*/
	static fromConfig(config) {
		const client = new _x402Client(config.paymentRequirementsSelector);
		config.schemes.forEach((scheme) => {
			if (scheme.x402Version === 1) client.registerV1(scheme.network, scheme.client);
			else client.register(scheme.network, scheme.client);
		});
		config.policies?.forEach((policy) => {
			client.registerPolicy(policy);
		});
		return client;
	}
	/**
	* Registers a scheme client for the current x402 version.
	*
	* @param network - The network to register the client for
	* @param client - The scheme network client to register
	* @returns The x402Client instance for chaining
	*/
	register(network, client) {
		return this._registerScheme(2, network, client);
	}
	/**
	* Registers a scheme client for x402 version 1.
	*
	* @param network - The v1 network identifier (e.g., 'base-sepolia', 'solana-devnet')
	* @param client - The scheme network client to register
	* @returns The x402Client instance for chaining
	*/
	registerV1(network, client) {
		return this._registerScheme(1, network, client);
	}
	/**
	* Registers a policy to filter or transform payment requirements.
	*
	* Policies are applied in order after filtering by registered schemes
	* and before the selector chooses the final payment requirement.
	*
	* @param policy - Function to filter/transform payment requirements
	* @returns The x402Client instance for chaining
	*
	* @example
	* ```typescript
	* // Prefer cheaper options
	* client.registerPolicy((version, reqs) =>
	*   reqs.filter(r => BigInt(r.value) < BigInt('1000000'))
	* );
	*
	* // Prefer specific networks
	* client.registerPolicy((version, reqs) =>
	*   reqs.filter(r => r.network.startsWith('eip155:'))
	* );
	* ```
	*/
	registerPolicy(policy) {
		this.policies.push(policy);
		return this;
	}
	/**
	* Registers a client extension that can enrich payment payloads.
	*
	* Extensions are invoked after the scheme creates the base payload and the
	* payload is wrapped with extensions/resource/accepted data. If the extension's
	* key is present in `paymentRequired.extensions`, the extension's
	* `enrichPaymentPayload` hook is called to modify the payload.
	*
	* @param extension - The client extension to register
	* @returns The x402Client instance for chaining
	*/
	registerExtension(extension) {
		this.registeredExtensions.set(extension.key, extension);
		return this;
	}
	/**
	* Register a hook to execute before payment payload creation.
	* Can abort creation by returning { abort: true, reason: string }
	*
	* @param hook - The hook function to register
	* @returns The x402Client instance for chaining
	*/
	onBeforePaymentCreation(hook) {
		this.beforePaymentCreationHooks.push(hook);
		return this;
	}
	/**
	* Register a hook to execute after successful payment payload creation.
	*
	* @param hook - The hook function to register
	* @returns The x402Client instance for chaining
	*/
	onAfterPaymentCreation(hook) {
		this.afterPaymentCreationHooks.push(hook);
		return this;
	}
	/**
	* Register a hook to execute when payment payload creation fails.
	* Can recover from failure by returning { recovered: true, payload: PaymentPayload }
	*
	* @param hook - The hook function to register
	* @returns The x402Client instance for chaining
	*/
	onPaymentCreationFailure(hook) {
		this.onPaymentCreationFailureHooks.push(hook);
		return this;
	}
	/**
	* Creates a payment payload based on a PaymentRequired response.
	*
	* Automatically extracts x402Version, resource, and extensions from the PaymentRequired
	* response and constructs a complete PaymentPayload with the accepted requirements.
	*
	* @param paymentRequired - The PaymentRequired response from the server
	* @returns Promise resolving to the complete payment payload
	*/
	async createPaymentPayload(paymentRequired) {
		const clientSchemesByNetwork = this.registeredClientSchemes.get(paymentRequired.x402Version);
		if (!clientSchemesByNetwork) throw new Error(`No client registered for x402 version: ${paymentRequired.x402Version}`);
		const requirements = this.selectPaymentRequirements(paymentRequired.x402Version, paymentRequired.accepts);
		const context = {
			paymentRequired,
			selectedRequirements: requirements
		};
		for (const hook of this.beforePaymentCreationHooks) {
			const result = await hook(context);
			if (result && "abort" in result && result.abort) throw new Error(`Payment creation aborted: ${result.reason}`);
		}
		try {
			const schemeNetworkClient = findByNetworkAndScheme(clientSchemesByNetwork, requirements.scheme, requirements.network);
			if (!schemeNetworkClient) throw new Error(`No client registered for scheme: ${requirements.scheme} and network: ${requirements.network}`);
			const partialPayload = await schemeNetworkClient.createPaymentPayload(paymentRequired.x402Version, requirements, { extensions: paymentRequired.extensions });
			let paymentPayload;
			if (partialPayload.x402Version == 1) paymentPayload = partialPayload;
			else {
				const mergedExtensions = this.mergeExtensions(paymentRequired.extensions, partialPayload.extensions);
				paymentPayload = {
					x402Version: partialPayload.x402Version,
					payload: partialPayload.payload,
					extensions: mergedExtensions,
					resource: paymentRequired.resource,
					accepted: requirements
				};
			}
			paymentPayload = await this.enrichPaymentPayloadWithExtensions(paymentPayload, paymentRequired);
			const createdContext = {
				...context,
				paymentPayload
			};
			for (const hook of this.afterPaymentCreationHooks) await hook(createdContext);
			return paymentPayload;
		} catch (error) {
			const failureContext = {
				...context,
				error
			};
			for (const hook of this.onPaymentCreationFailureHooks) {
				const result = await hook(failureContext);
				if (result && "recovered" in result && result.recovered) return result.payload;
			}
			throw error;
		}
	}
	/**
	* Merges server-declared extensions with scheme-provided extensions.
	* Scheme extensions overlay on top of server extensions at each key,
	* preserving server-provided schema while overlaying scheme-provided info.
	*
	* @param serverExtensions - Extensions declared by the server in the 402 response
	* @param schemeExtensions - Extensions provided by the scheme client (e.g. EIP-2612)
	* @returns The merged extensions object, or undefined if both inputs are undefined
	*/
	mergeExtensions(serverExtensions, schemeExtensions) {
		if (!schemeExtensions) return serverExtensions;
		if (!serverExtensions) return schemeExtensions;
		const merged = { ...serverExtensions };
		for (const [key, schemeValue] of Object.entries(schemeExtensions)) {
			const serverValue = merged[key];
			if (serverValue && typeof serverValue === "object" && schemeValue && typeof schemeValue === "object") merged[key] = {
				...serverValue,
				...schemeValue
			};
			else merged[key] = schemeValue;
		}
		return merged;
	}
	/**
	* Enriches a payment payload by calling registered extension hooks.
	* For each extension key present in the PaymentRequired response,
	* invokes the corresponding extension's enrichPaymentPayload callback.
	*
	* @param paymentPayload - The payment payload to enrich with extension data
	* @param paymentRequired - The PaymentRequired response containing extension declarations
	* @returns The enriched payment payload with extension data applied
	*/
	async enrichPaymentPayloadWithExtensions(paymentPayload, paymentRequired) {
		if (!paymentRequired.extensions || this.registeredExtensions.size === 0) return paymentPayload;
		let enriched = paymentPayload;
		for (const [key, extension] of this.registeredExtensions) if (key in paymentRequired.extensions && extension.enrichPaymentPayload) enriched = await extension.enrichPaymentPayload(enriched, paymentRequired);
		return enriched;
	}
	/**
	* Selects appropriate payment requirements based on registered clients and policies.
	*
	* Selection process:
	* 1. Filter by registered schemes (network + scheme support)
	* 2. Apply all registered policies in order
	* 3. Use selector to choose final requirement
	*
	* @param x402Version - The x402 protocol version
	* @param paymentRequirements - Array of available payment requirements
	* @returns The selected payment requirements
	*/
	selectPaymentRequirements(x402Version2, paymentRequirements) {
		const clientSchemesByNetwork = this.registeredClientSchemes.get(x402Version2);
		if (!clientSchemesByNetwork) throw new Error(`No client registered for x402 version: ${x402Version2}`);
		const supportedPaymentRequirements = paymentRequirements.filter((requirement) => {
			let clientSchemes = findSchemesByNetwork(clientSchemesByNetwork, requirement.network);
			if (!clientSchemes) return false;
			return clientSchemes.has(requirement.scheme);
		});
		if (supportedPaymentRequirements.length === 0) throw new Error(`No network/scheme registered for x402 version: ${x402Version2} which comply with the payment requirements. ${JSON.stringify({
			x402Version: x402Version2,
			paymentRequirements,
			x402Versions: Array.from(this.registeredClientSchemes.keys()),
			networks: Array.from(clientSchemesByNetwork.keys()),
			schemes: Array.from(clientSchemesByNetwork.values()).map((schemes) => Array.from(schemes.keys())).flat()
		})}`);
		let filteredRequirements = supportedPaymentRequirements;
		for (const policy of this.policies) {
			filteredRequirements = policy(x402Version2, filteredRequirements);
			if (filteredRequirements.length === 0) throw new Error(`All payment requirements were filtered out by policies for x402 version: ${x402Version2}`);
		}
		return this.paymentRequirementsSelector(x402Version2, filteredRequirements);
	}
	/**
	* Internal method to register a scheme client.
	*
	* @param x402Version - The x402 protocol version
	* @param network - The network to register the client for
	* @param client - The scheme network client to register
	* @returns The x402Client instance for chaining
	*/
	_registerScheme(x402Version2, network, client) {
		if (!this.registeredClientSchemes.has(x402Version2)) this.registeredClientSchemes.set(x402Version2, /* @__PURE__ */ new Map());
		const clientSchemesByNetwork = this.registeredClientSchemes.get(x402Version2);
		if (!clientSchemesByNetwork.has(network)) clientSchemesByNetwork.set(network, /* @__PURE__ */ new Map());
		const clientByScheme = clientSchemesByNetwork.get(network);
		if (!clientByScheme.has(client.scheme)) clientByScheme.set(client.scheme, client);
		return this;
	}
};
//#endregion
//#region node_modules/@x402-avm/core/dist/esm/server/index.mjs
var x402ResourceServer = class {
	/**
	* Creates a new x402ResourceServer instance.
	*
	* @param facilitatorClients - Optional facilitator client(s) for payment processing
	*/
	constructor(facilitatorClients) {
		this.registeredServerSchemes = /* @__PURE__ */ new Map();
		this.supportedResponsesMap = /* @__PURE__ */ new Map();
		this.facilitatorClientsMap = /* @__PURE__ */ new Map();
		this.registeredExtensions = /* @__PURE__ */ new Map();
		this.beforeVerifyHooks = [];
		this.afterVerifyHooks = [];
		this.onVerifyFailureHooks = [];
		this.beforeSettleHooks = [];
		this.afterSettleHooks = [];
		this.onSettleFailureHooks = [];
		if (!facilitatorClients) this.facilitatorClients = [new HTTPFacilitatorClient()];
		else if (Array.isArray(facilitatorClients)) this.facilitatorClients = facilitatorClients.length > 0 ? facilitatorClients : [new HTTPFacilitatorClient()];
		else this.facilitatorClients = [facilitatorClients];
	}
	/**
	* Register a scheme/network server implementation.
	*
	* @param network - The network identifier
	* @param server - The scheme/network server implementation
	* @returns The x402ResourceServer instance for chaining
	*/
	register(network, server) {
		if (!this.registeredServerSchemes.has(network)) this.registeredServerSchemes.set(network, /* @__PURE__ */ new Map());
		const serverByScheme = this.registeredServerSchemes.get(network);
		if (!serverByScheme.has(server.scheme)) serverByScheme.set(server.scheme, server);
		return this;
	}
	/**
	* Check if a scheme is registered for a given network.
	*
	* @param network - The network identifier
	* @param scheme - The payment scheme name
	* @returns True if the scheme is registered for the network, false otherwise
	*/
	hasRegisteredScheme(network, scheme) {
		return !!findByNetworkAndScheme(this.registeredServerSchemes, scheme, network);
	}
	/**
	* Registers a resource service extension that can enrich extension declarations.
	*
	* @param extension - The extension to register
	* @returns The x402ResourceServer instance for chaining
	*/
	registerExtension(extension) {
		this.registeredExtensions.set(extension.key, extension);
		return this;
	}
	/**
	* Check if an extension is registered.
	*
	* @param key - The extension key
	* @returns True if the extension is registered
	*/
	hasExtension(key) {
		return this.registeredExtensions.has(key);
	}
	/**
	* Get all registered extensions.
	*
	* @returns Array of registered extensions
	*/
	getExtensions() {
		return Array.from(this.registeredExtensions.values());
	}
	/**
	* Enriches declared extensions using registered extension hooks.
	*
	* @param declaredExtensions - Extensions declared on the route
	* @param transportContext - Transport-specific context (HTTP, A2A, MCP, etc.)
	* @returns Enriched extensions map
	*/
	enrichExtensions(declaredExtensions, transportContext) {
		const enriched = {};
		for (const [key, declaration] of Object.entries(declaredExtensions)) {
			const extension = this.registeredExtensions.get(key);
			if (extension?.enrichDeclaration) enriched[key] = extension.enrichDeclaration(declaration, transportContext);
			else enriched[key] = declaration;
		}
		return enriched;
	}
	/**
	* Register a hook to execute before payment verification.
	* Can abort verification by returning { abort: true, reason: string }
	*
	* @param hook - The hook function to register
	* @returns The x402ResourceServer instance for chaining
	*/
	onBeforeVerify(hook) {
		this.beforeVerifyHooks.push(hook);
		return this;
	}
	/**
	* Register a hook to execute after successful payment verification.
	*
	* @param hook - The hook function to register
	* @returns The x402ResourceServer instance for chaining
	*/
	onAfterVerify(hook) {
		this.afterVerifyHooks.push(hook);
		return this;
	}
	/**
	* Register a hook to execute when payment verification fails.
	* Can recover from failure by returning { recovered: true, result: VerifyResponse }
	*
	* @param hook - The hook function to register
	* @returns The x402ResourceServer instance for chaining
	*/
	onVerifyFailure(hook) {
		this.onVerifyFailureHooks.push(hook);
		return this;
	}
	/**
	* Register a hook to execute before payment settlement.
	* Can abort settlement by returning { abort: true, reason: string }
	*
	* @param hook - The hook function to register
	* @returns The x402ResourceServer instance for chaining
	*/
	onBeforeSettle(hook) {
		this.beforeSettleHooks.push(hook);
		return this;
	}
	/**
	* Register a hook to execute after successful payment settlement.
	*
	* @param hook - The hook function to register
	* @returns The x402ResourceServer instance for chaining
	*/
	onAfterSettle(hook) {
		this.afterSettleHooks.push(hook);
		return this;
	}
	/**
	* Register a hook to execute when payment settlement fails.
	* Can recover from failure by returning { recovered: true, result: SettleResponse }
	*
	* @param hook - The hook function to register
	* @returns The x402ResourceServer instance for chaining
	*/
	onSettleFailure(hook) {
		this.onSettleFailureHooks.push(hook);
		return this;
	}
	/**
	* Initialize by fetching supported kinds from all facilitators
	* Creates mappings for supported responses and facilitator clients
	* Earlier facilitators in the array get precedence
	*/
	async initialize() {
		this.supportedResponsesMap.clear();
		this.facilitatorClientsMap.clear();
		for (const facilitatorClient of this.facilitatorClients) try {
			const supported = await facilitatorClient.getSupported();
			for (const kind of supported.kinds) {
				const x402Version2 = kind.x402Version;
				if (!this.supportedResponsesMap.has(x402Version2)) this.supportedResponsesMap.set(x402Version2, /* @__PURE__ */ new Map());
				const responseVersionMap = this.supportedResponsesMap.get(x402Version2);
				if (!this.facilitatorClientsMap.has(x402Version2)) this.facilitatorClientsMap.set(x402Version2, /* @__PURE__ */ new Map());
				const clientVersionMap = this.facilitatorClientsMap.get(x402Version2);
				if (!responseVersionMap.has(kind.network)) responseVersionMap.set(kind.network, /* @__PURE__ */ new Map());
				const responseNetworkMap = responseVersionMap.get(kind.network);
				if (!clientVersionMap.has(kind.network)) clientVersionMap.set(kind.network, /* @__PURE__ */ new Map());
				const clientNetworkMap = clientVersionMap.get(kind.network);
				if (!responseNetworkMap.has(kind.scheme)) {
					responseNetworkMap.set(kind.scheme, supported);
					clientNetworkMap.set(kind.scheme, facilitatorClient);
				}
			}
		} catch (error) {
			console.warn(`Failed to fetch supported kinds from facilitator: ${error}`);
		}
		if (this.supportedResponsesMap.size === 0) throw new Error("Failed to initialize: no supported payment kinds loaded from any facilitator.");
	}
	/**
	* Get supported kind for a specific version, network, and scheme
	*
	* @param x402Version - The x402 version
	* @param network - The network identifier
	* @param scheme - The payment scheme
	* @returns The supported kind or undefined if not found
	*/
	getSupportedKind(x402Version2, network, scheme) {
		const versionMap = this.supportedResponsesMap.get(x402Version2);
		if (!versionMap) return void 0;
		const supportedResponse = findByNetworkAndScheme(versionMap, scheme, network);
		if (!supportedResponse) return void 0;
		return supportedResponse.kinds.find((kind) => kind.x402Version === x402Version2 && kind.network === network && kind.scheme === scheme);
	}
	/**
	* Get facilitator extensions for a specific version, network, and scheme
	*
	* @param x402Version - The x402 version
	* @param network - The network identifier
	* @param scheme - The payment scheme
	* @returns The facilitator extensions or empty array if not found
	*/
	getFacilitatorExtensions(x402Version2, network, scheme) {
		const versionMap = this.supportedResponsesMap.get(x402Version2);
		if (!versionMap) return [];
		return findByNetworkAndScheme(versionMap, scheme, network)?.extensions || [];
	}
	/**
	* Build payment requirements for a protected resource
	*
	* @param resourceConfig - Configuration for the protected resource
	* @returns Array of payment requirements
	*/
	async buildPaymentRequirements(resourceConfig) {
		const requirements = [];
		const scheme = resourceConfig.scheme;
		const SchemeNetworkServer = findByNetworkAndScheme(this.registeredServerSchemes, scheme, resourceConfig.network);
		if (!SchemeNetworkServer) {
			console.warn(`No server implementation registered for scheme: ${scheme}, network: ${resourceConfig.network}`);
			return requirements;
		}
		const supportedKind = this.getSupportedKind(2, resourceConfig.network, SchemeNetworkServer.scheme);
		if (!supportedKind) throw new Error(`Facilitator does not support ${SchemeNetworkServer.scheme} on ${resourceConfig.network}. Make sure to call initialize() to fetch supported kinds from facilitators.`);
		const facilitatorExtensions = this.getFacilitatorExtensions(2, resourceConfig.network, SchemeNetworkServer.scheme);
		const parsedPrice = await SchemeNetworkServer.parsePrice(resourceConfig.price, resourceConfig.network);
		const baseRequirements = {
			scheme: SchemeNetworkServer.scheme,
			network: resourceConfig.network,
			amount: parsedPrice.amount,
			asset: parsedPrice.asset,
			payTo: resourceConfig.payTo,
			maxTimeoutSeconds: resourceConfig.maxTimeoutSeconds || 300,
			extra: {
				...parsedPrice.extra,
				...resourceConfig.extra
			}
		};
		const requirement = await SchemeNetworkServer.enhancePaymentRequirements(baseRequirements, {
			...supportedKind,
			x402Version: 2
		}, facilitatorExtensions);
		requirements.push(requirement);
		return requirements;
	}
	/**
	* Build payment requirements from multiple payment options
	* This method handles resolving dynamic payTo/price functions and builds requirements for each option
	*
	* @param paymentOptions - Array of payment options to convert
	* @param context - HTTP request context for resolving dynamic functions
	* @returns Array of payment requirements (one per option)
	*/
	async buildPaymentRequirementsFromOptions(paymentOptions, context) {
		const allRequirements = [];
		for (const option of paymentOptions) {
			const resolvedPayTo = typeof option.payTo === "function" ? await option.payTo(context) : option.payTo;
			const resolvedPrice = typeof option.price === "function" ? await option.price(context) : option.price;
			const resourceConfig = {
				scheme: option.scheme,
				payTo: resolvedPayTo,
				price: resolvedPrice,
				network: option.network,
				maxTimeoutSeconds: option.maxTimeoutSeconds,
				extra: option.extra
			};
			const requirements = await this.buildPaymentRequirements(resourceConfig);
			allRequirements.push(...requirements);
		}
		return allRequirements;
	}
	/**
	* Create a payment required response
	*
	* @param requirements - Payment requirements
	* @param resourceInfo - Resource information
	* @param error - Error message
	* @param extensions - Optional declared extensions (for per-key enrichment)
	* @param transportContext - Optional transport-specific context (e.g., HTTP request, MCP tool context)
	* @returns Payment required response object
	*/
	async createPaymentRequiredResponse(requirements, resourceInfo, error, extensions, transportContext) {
		let response = {
			x402Version: 2,
			error,
			resource: resourceInfo,
			accepts: requirements
		};
		if (extensions && Object.keys(extensions).length > 0) response.extensions = extensions;
		if (extensions) for (const [key, declaration] of Object.entries(extensions)) {
			const extension = this.registeredExtensions.get(key);
			if (extension?.enrichPaymentRequiredResponse) try {
				const context = {
					requirements,
					resourceInfo,
					error,
					paymentRequiredResponse: response,
					transportContext
				};
				const extensionData = await extension.enrichPaymentRequiredResponse(declaration, context);
				if (extensionData !== void 0) {
					if (!response.extensions) response.extensions = {};
					response.extensions[key] = extensionData;
				}
			} catch (error2) {
				console.error(`Error in enrichPaymentRequiredResponse hook for extension ${key}:`, error2);
			}
		}
		return response;
	}
	/**
	* Verify a payment against requirements
	*
	* @param paymentPayload - The payment payload to verify
	* @param requirements - The payment requirements
	* @returns Verification response
	*/
	async verifyPayment(paymentPayload, requirements) {
		const context = {
			paymentPayload,
			requirements
		};
		for (const hook of this.beforeVerifyHooks) try {
			const result = await hook(context);
			if (result && "abort" in result && result.abort) return {
				isValid: false,
				invalidReason: result.reason,
				invalidMessage: result.message
			};
		} catch (error) {
			throw new VerifyError(400, {
				isValid: false,
				invalidReason: "before_verify_hook_error",
				invalidMessage: error instanceof Error ? error.message : ""
			});
		}
		try {
			const facilitatorClient = this.getFacilitatorClient(paymentPayload.x402Version, requirements.network, requirements.scheme);
			let verifyResult;
			if (!facilitatorClient) {
				let lastError;
				for (const client of this.facilitatorClients) try {
					verifyResult = await client.verify(paymentPayload, requirements);
					break;
				} catch (error) {
					lastError = error;
				}
				if (!verifyResult) throw lastError || /* @__PURE__ */ new Error(`No facilitator supports ${requirements.scheme} on ${requirements.network} for v${paymentPayload.x402Version}`);
			} else verifyResult = await facilitatorClient.verify(paymentPayload, requirements);
			const resultContext = {
				...context,
				result: verifyResult
			};
			for (const hook of this.afterVerifyHooks) await hook(resultContext);
			return verifyResult;
		} catch (error) {
			const failureContext = {
				...context,
				error
			};
			for (const hook of this.onVerifyFailureHooks) {
				const result = await hook(failureContext);
				if (result && "recovered" in result && result.recovered) return result.result;
			}
			throw error;
		}
	}
	/**
	* Settle a verified payment
	*
	* @param paymentPayload - The payment payload to settle
	* @param requirements - The payment requirements
	* @param declaredExtensions - Optional declared extensions (for per-key enrichment)
	* @param transportContext - Optional transport-specific context (e.g., HTTP request/response, MCP tool context)
	* @returns Settlement response
	*/
	async settlePayment(paymentPayload, requirements, declaredExtensions, transportContext) {
		const context = {
			paymentPayload,
			requirements
		};
		for (const hook of this.beforeSettleHooks) try {
			const result = await hook(context);
			if (result && "abort" in result && result.abort) throw new SettleError(400, {
				success: false,
				errorReason: result.reason,
				errorMessage: result.message,
				transaction: "",
				network: requirements.network
			});
		} catch (error) {
			if (error instanceof SettleError) throw error;
			throw new SettleError(400, {
				success: false,
				errorReason: "before_settle_hook_error",
				errorMessage: error instanceof Error ? error.message : "",
				transaction: "",
				network: requirements.network
			});
		}
		try {
			const facilitatorClient = this.getFacilitatorClient(paymentPayload.x402Version, requirements.network, requirements.scheme);
			let settleResult;
			if (!facilitatorClient) {
				let lastError;
				for (const client of this.facilitatorClients) try {
					settleResult = await client.settle(paymentPayload, requirements);
					break;
				} catch (error) {
					lastError = error;
				}
				if (!settleResult) throw lastError || /* @__PURE__ */ new Error(`No facilitator supports ${requirements.scheme} on ${requirements.network} for v${paymentPayload.x402Version}`);
			} else settleResult = await facilitatorClient.settle(paymentPayload, requirements);
			const resultContext = {
				...context,
				result: settleResult,
				transportContext
			};
			for (const hook of this.afterSettleHooks) await hook(resultContext);
			if (declaredExtensions) for (const [key, declaration] of Object.entries(declaredExtensions)) {
				const extension = this.registeredExtensions.get(key);
				if (extension?.enrichSettlementResponse) try {
					const extensionData = await extension.enrichSettlementResponse(declaration, resultContext);
					if (extensionData !== void 0) {
						if (!settleResult.extensions) settleResult.extensions = {};
						settleResult.extensions[key] = extensionData;
					}
				} catch (error) {
					console.error(`Error in enrichSettlementResponse hook for extension ${key}:`, error);
				}
			}
			return settleResult;
		} catch (error) {
			const failureContext = {
				...context,
				error
			};
			for (const hook of this.onSettleFailureHooks) {
				const result = await hook(failureContext);
				if (result && "recovered" in result && result.recovered) return result.result;
			}
			throw error;
		}
	}
	/**
	* Find matching payment requirements for a payment
	*
	* @param availableRequirements - Array of available payment requirements
	* @param paymentPayload - The payment payload
	* @returns Matching payment requirements or undefined
	*/
	findMatchingRequirements(availableRequirements, paymentPayload) {
		switch (paymentPayload.x402Version) {
			case 2: return availableRequirements.find((paymentRequirements) => deepEqual(paymentRequirements, paymentPayload.accepted));
			case 1: return availableRequirements.find((req) => req.scheme === paymentPayload.accepted.scheme && req.network === paymentPayload.accepted.network);
			default: throw new Error(`Unsupported x402 version: ${paymentPayload.x402Version}`);
		}
	}
	/**
	* Process a payment request
	*
	* @param paymentPayload - Optional payment payload if provided
	* @param resourceConfig - Configuration for the protected resource
	* @param resourceInfo - Information about the resource being accessed
	* @param extensions - Optional extensions to include in the response
	* @returns Processing result
	*/
	async processPaymentRequest(paymentPayload, resourceConfig, resourceInfo, extensions) {
		const requirements = await this.buildPaymentRequirements(resourceConfig);
		if (!paymentPayload) return {
			success: false,
			requiresPayment: await this.createPaymentRequiredResponse(requirements, resourceInfo, "Payment required", extensions)
		};
		const matchingRequirements = this.findMatchingRequirements(requirements, paymentPayload);
		if (!matchingRequirements) return {
			success: false,
			requiresPayment: await this.createPaymentRequiredResponse(requirements, resourceInfo, "No matching payment requirements found", extensions)
		};
		const verificationResult = await this.verifyPayment(paymentPayload, matchingRequirements);
		if (!verificationResult.isValid) return {
			success: false,
			error: verificationResult.invalidReason,
			verificationResult
		};
		return {
			success: true,
			verificationResult
		};
	}
	/**
	* Get facilitator client for a specific version, network, and scheme
	*
	* @param x402Version - The x402 version
	* @param network - The network identifier
	* @param scheme - The payment scheme
	* @returns The facilitator client or undefined if not found
	*/
	getFacilitatorClient(x402Version2, network, scheme) {
		const versionMap = this.facilitatorClientsMap.get(x402Version2);
		if (!versionMap) return void 0;
		return findByNetworkAndScheme(versionMap, scheme, network);
	}
};
//#endregion
export { x402HTTPResourceServer as a, x402HTTPClient as i, x402Client as n, HTTPFacilitatorClient as r, x402ResourceServer as t };
