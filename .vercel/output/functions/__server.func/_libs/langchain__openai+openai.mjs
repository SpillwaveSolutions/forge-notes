import { r as __exportAll } from "../_runtime.mjs";
import { $t as string, Bt as array, It as _enum, Jt as number, Kt as literal, Qt as record, Yt as object, hn as registry, in as parse, sn as toJSONSchema, tn as union, yn as parse$1 } from "./@better-auth/core+[...].mjs";
import { $n as isDataContentBlock, At as getSchemaDescription, C as makeInvalidToolCall, Cn as isAIMessage, E as JsonOutputParser, En as iife, F as isOpenAITool, It as isInteropZodSchema, Ln as ToolMessage, Lt as isZodSchemaV3, Mn as FunctionMessageChunk, Nn as ChatMessage, On as SystemMessageChunk, Pn as ChatMessageChunk, Qn as convertToProviderContentBlock, Rn as ToolMessageChunk, Rt as isZodSchemaV4, S as convertLangChainToolCallToOpenAI, Sn as AIMessageChunk, Tt as isSerializableSchema, _ as createFunctionCallingParser, bn as getEnvironmentVariable, c as isLangChainTool, er as parseBase64DataUrl, f as finalizeContentBlock, g as createContentParser, h as assembleStructuredOutputPipeline, it as ZodFirstPartyTypeKind, jn as HumanMessageChunk, l as BaseChatModel, n as convertToOpenAITool, nr as ContextOverflowError, q as RunnableLambda, rt as toJsonSchema, tr as parseMimeType, w as parseToolCall$2, xn as AIMessage, yn as getEnv, zt as ChatGenerationChunk } from "./@langchain/anthropic+[...].mjs";
import { r as convertOpenAICompletionsStream } from "./langchain__core+mustache.mjs";
//#region node_modules/@langchain/openai/dist/utils/errors.js
function addLangChainErrorFields(error, lc_error_code) {
	error.lc_error_code = lc_error_code;
	error.message = `${error.message}\n\nTroubleshooting URL: https://docs.langchain.com/oss/javascript/langchain/errors/${lc_error_code}/\n`;
	return error;
}
//#endregion
//#region node_modules/openai/internal/tslib.mjs
function __classPrivateFieldSet(receiver, state, value, kind, f) {
	if (kind === "m") throw new TypeError("Private method is not writable");
	if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
	if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
	return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
}
function __classPrivateFieldGet(receiver, state, kind, f) {
	if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
	if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
	return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}
//#endregion
//#region node_modules/openai/internal/utils/uuid.mjs
/**
* https://stackoverflow.com/a/2117523
*/
var uuid4 = function() {
	const { crypto } = globalThis;
	if (crypto?.randomUUID) {
		uuid4 = crypto.randomUUID.bind(crypto);
		return crypto.randomUUID();
	}
	const u8 = /* @__PURE__ */ new Uint8Array(1);
	const randomByte = crypto ? () => crypto.getRandomValues(u8)[0] : () => Math.random() * 255 & 255;
	return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) => (+c ^ randomByte() & 15 >> +c / 4).toString(16));
};
//#endregion
//#region node_modules/openai/internal/errors.mjs
function isAbortError(err) {
	return typeof err === "object" && err !== null && ("name" in err && err.name === "AbortError" || "message" in err && String(err.message).includes("FetchRequestCanceledException"));
}
var castToError = (err) => {
	if (err instanceof Error) return err;
	if (typeof err === "object" && err !== null) {
		try {
			if (Object.prototype.toString.call(err) === "[object Error]") {
				const error = new Error(err.message, err.cause ? { cause: err.cause } : {});
				if (err.stack) error.stack = err.stack;
				if (err.cause && !error.cause) error.cause = err.cause;
				if (err.name) error.name = err.name;
				return error;
			}
		} catch {}
		try {
			return new Error(JSON.stringify(err));
		} catch {}
	}
	return new Error(err);
};
//#endregion
//#region node_modules/openai/core/error.mjs
var OpenAIError = class extends Error {};
var APIError = class APIError extends OpenAIError {
	constructor(status, error, message, headers) {
		super(`${APIError.makeMessage(status, error, message)}`);
		this.status = status;
		this.headers = headers;
		this.requestID = headers?.get("x-request-id");
		this.error = error;
		const data = error;
		this.code = data?.["code"];
		this.param = data?.["param"];
		this.type = data?.["type"];
	}
	static makeMessage(status, error, message) {
		const msg = error?.message ? typeof error.message === "string" ? error.message : JSON.stringify(error.message) : error ? JSON.stringify(error) : message;
		if (status && msg) return `${status} ${msg}`;
		if (status) return `${status} status code (no body)`;
		if (msg) return msg;
		return "(no status code or body)";
	}
	static generate(status, errorResponse, message, headers) {
		if (!status || !headers) return new APIConnectionError({
			message,
			cause: castToError(errorResponse)
		});
		const error = errorResponse?.["error"];
		if (status === 400) return new BadRequestError(status, error, message, headers);
		if (status === 401) return new AuthenticationError(status, error, message, headers);
		if (status === 403) return new PermissionDeniedError(status, error, message, headers);
		if (status === 404) return new NotFoundError(status, error, message, headers);
		if (status === 409) return new ConflictError(status, error, message, headers);
		if (status === 422) return new UnprocessableEntityError(status, error, message, headers);
		if (status === 429) return new RateLimitError(status, error, message, headers);
		if (status >= 500) return new InternalServerError(status, error, message, headers);
		return new APIError(status, error, message, headers);
	}
};
var APIUserAbortError = class extends APIError {
	constructor({ message } = {}) {
		super(void 0, void 0, message || "Request was aborted.", void 0);
	}
};
var APIConnectionError = class extends APIError {
	constructor({ message, cause }) {
		super(void 0, void 0, message || "Connection error.", void 0);
		if (cause) this.cause = cause;
	}
};
var APIConnectionTimeoutError = class extends APIConnectionError {
	constructor({ message } = {}) {
		super({ message: message ?? "Request timed out." });
	}
};
var BadRequestError = class extends APIError {};
var AuthenticationError = class extends APIError {};
var PermissionDeniedError = class extends APIError {};
var NotFoundError = class extends APIError {};
var ConflictError = class extends APIError {};
var UnprocessableEntityError = class extends APIError {};
var RateLimitError = class extends APIError {};
var InternalServerError = class extends APIError {};
var LengthFinishReasonError = class extends OpenAIError {
	constructor() {
		super(`Could not parse response content as the length limit was reached`);
	}
};
var ContentFilterFinishReasonError = class extends OpenAIError {
	constructor() {
		super(`Could not parse response content as the request was rejected by the content filter`);
	}
};
var InvalidWebhookSignatureError = class extends Error {
	constructor(message) {
		super(message);
	}
};
/**
* Error thrown by the API server during OAuth token exchange.
* Can have status codes 400, 401, or 403.
* Other status codes from OAuth endpoints are raised as normal APIError types.
*/
var OAuthError = class extends APIError {
	constructor(status, error, headers) {
		let finalMessage = "OAuth2 authentication error";
		let error_code = void 0;
		if (error && typeof error === "object") {
			const errorData = error;
			error_code = errorData["error"];
			const description = errorData["error_description"];
			if (description && typeof description === "string") finalMessage = description;
			else if (error_code) finalMessage = error_code;
		}
		super(status, error, finalMessage, headers);
		this.error_code = error_code;
	}
};
var SubjectTokenProviderError = class extends OpenAIError {
	constructor(message, provider, cause) {
		super(message);
		this.provider = provider;
		this.cause = cause;
	}
};
//#endregion
//#region node_modules/openai/internal/utils/values.mjs
var startsWithSchemeRegexp = /^[a-z][a-z0-9+.-]*:/i;
var isAbsoluteURL = (url) => {
	return startsWithSchemeRegexp.test(url);
};
var isArray = (val) => (isArray = Array.isArray, isArray(val));
var isReadonlyArray = isArray;
/** Returns an object if the given value isn't an object, otherwise returns as-is */
function maybeObj(x) {
	if (typeof x !== "object") return {};
	return x ?? {};
}
function isEmptyObj$1(obj) {
	if (!obj) return true;
	for (const _k in obj) return false;
	return true;
}
function hasOwn(obj, key) {
	return Object.prototype.hasOwnProperty.call(obj, key);
}
function isObj(obj) {
	return obj != null && typeof obj === "object" && !Array.isArray(obj);
}
var validatePositiveInteger = (name, n) => {
	if (typeof n !== "number" || !Number.isInteger(n)) throw new OpenAIError(`${name} must be an integer`);
	if (n < 0) throw new OpenAIError(`${name} must be a positive integer`);
	return n;
};
var safeJSON = (text) => {
	try {
		return JSON.parse(text);
	} catch (err) {
		return;
	}
};
//#endregion
//#region node_modules/openai/internal/utils/sleep.mjs
var sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
//#endregion
//#region node_modules/openai/version.mjs
var VERSION = "6.49.0";
//#endregion
//#region node_modules/openai/internal/detect-platform.mjs
var isRunningInBrowser = () => {
	return typeof window !== "undefined" && typeof window.document !== "undefined" && typeof navigator !== "undefined";
};
/**
* Note this does not detect 'browser'; for that, use getBrowserInfo().
*/
function getDetectedPlatform() {
	if (typeof Deno !== "undefined" && Deno.build != null) return "deno";
	if (typeof EdgeRuntime !== "undefined") return "edge";
	if (Object.prototype.toString.call(typeof globalThis.process !== "undefined" ? globalThis.process : 0) === "[object process]") return "node";
	return "unknown";
}
var getPlatformProperties = () => {
	const detectedPlatform = getDetectedPlatform();
	if (detectedPlatform === "deno") return {
		"X-Stainless-Lang": "js",
		"X-Stainless-Package-Version": VERSION,
		"X-Stainless-OS": normalizePlatform(Deno.build.os),
		"X-Stainless-Arch": normalizeArch(Deno.build.arch),
		"X-Stainless-Runtime": "deno",
		"X-Stainless-Runtime-Version": typeof Deno.version === "string" ? Deno.version : Deno.version?.deno ?? "unknown"
	};
	if (typeof EdgeRuntime !== "undefined") return {
		"X-Stainless-Lang": "js",
		"X-Stainless-Package-Version": VERSION,
		"X-Stainless-OS": "Unknown",
		"X-Stainless-Arch": `other:${EdgeRuntime}`,
		"X-Stainless-Runtime": "edge",
		"X-Stainless-Runtime-Version": globalThis.process.version
	};
	if (detectedPlatform === "node") return {
		"X-Stainless-Lang": "js",
		"X-Stainless-Package-Version": VERSION,
		"X-Stainless-OS": normalizePlatform(globalThis.process.platform ?? "unknown"),
		"X-Stainless-Arch": normalizeArch(globalThis.process.arch ?? "unknown"),
		"X-Stainless-Runtime": "node",
		"X-Stainless-Runtime-Version": globalThis.process.version ?? "unknown"
	};
	const browserInfo = getBrowserInfo();
	if (browserInfo) return {
		"X-Stainless-Lang": "js",
		"X-Stainless-Package-Version": VERSION,
		"X-Stainless-OS": "Unknown",
		"X-Stainless-Arch": "unknown",
		"X-Stainless-Runtime": `browser:${browserInfo.browser}`,
		"X-Stainless-Runtime-Version": browserInfo.version
	};
	return {
		"X-Stainless-Lang": "js",
		"X-Stainless-Package-Version": VERSION,
		"X-Stainless-OS": "Unknown",
		"X-Stainless-Arch": "unknown",
		"X-Stainless-Runtime": "unknown",
		"X-Stainless-Runtime-Version": "unknown"
	};
};
function getBrowserInfo() {
	if (typeof navigator === "undefined" || !navigator) return null;
	for (const { key, pattern } of [
		{
			key: "edge",
			pattern: /Edge(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/
		},
		{
			key: "ie",
			pattern: /MSIE(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/
		},
		{
			key: "ie",
			pattern: /Trident(?:.*rv\:(\d+)\.(\d+)(?:\.(\d+))?)?/
		},
		{
			key: "chrome",
			pattern: /Chrome(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/
		},
		{
			key: "firefox",
			pattern: /Firefox(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/
		},
		{
			key: "safari",
			pattern: /(?:Version\W+(\d+)\.(\d+)(?:\.(\d+))?)?(?:\W+Mobile\S*)?\W+Safari/
		}
	]) {
		const match = pattern.exec(navigator.userAgent);
		if (match) return {
			browser: key,
			version: `${match[1] || 0}.${match[2] || 0}.${match[3] || 0}`
		};
	}
	return null;
}
var normalizeArch = (arch) => {
	if (arch === "x32") return "x32";
	if (arch === "x86_64" || arch === "x64") return "x64";
	if (arch === "arm") return "arm";
	if (arch === "aarch64" || arch === "arm64") return "arm64";
	if (arch) return `other:${arch}`;
	return "unknown";
};
var normalizePlatform = (platform) => {
	platform = platform.toLowerCase();
	if (platform.includes("ios")) return "iOS";
	if (platform === "android") return "Android";
	if (platform === "darwin") return "MacOS";
	if (platform === "win32") return "Windows";
	if (platform === "freebsd") return "FreeBSD";
	if (platform === "openbsd") return "OpenBSD";
	if (platform === "linux") return "Linux";
	if (platform) return `Other:${platform}`;
	return "Unknown";
};
var _platformHeaders;
var getPlatformHeaders = () => {
	return _platformHeaders ?? (_platformHeaders = getPlatformProperties());
};
//#endregion
//#region node_modules/openai/internal/shims.mjs
function getDefaultFetch() {
	if (typeof fetch !== "undefined") return fetch;
	throw new Error("`fetch` is not defined as a global; Either pass `fetch` to the client, `new OpenAI({ fetch })` or polyfill the global, `globalThis.fetch = fetch`");
}
function makeReadableStream(...args) {
	const ReadableStream = globalThis.ReadableStream;
	if (typeof ReadableStream === "undefined") throw new Error("`ReadableStream` is not defined as a global; You will need to polyfill it, `globalThis.ReadableStream = ReadableStream`");
	return new ReadableStream(...args);
}
function ReadableStreamFrom(iterable) {
	let iter = Symbol.asyncIterator in iterable ? iterable[Symbol.asyncIterator]() : iterable[Symbol.iterator]();
	return makeReadableStream({
		start() {},
		async pull(controller) {
			const { done, value } = await iter.next();
			if (done) controller.close();
			else controller.enqueue(value);
		},
		async cancel() {
			await iter.return?.();
		}
	});
}
/**
* Most browsers don't yet have async iterable support for ReadableStream,
* and Node has a very different way of reading bytes from its "ReadableStream".
*
* This polyfill was pulled from https://github.com/MattiasBuelens/web-streams-polyfill/pull/122#issuecomment-1627354490
*/
function ReadableStreamToAsyncIterable(stream) {
	if (stream[Symbol.asyncIterator]) return stream;
	const reader = stream.getReader();
	return {
		async next() {
			try {
				const result = await reader.read();
				if (result?.done) reader.releaseLock();
				return result;
			} catch (e) {
				reader.releaseLock();
				throw e;
			}
		},
		async return() {
			const cancelPromise = reader.cancel();
			reader.releaseLock();
			await cancelPromise;
			return {
				done: true,
				value: void 0
			};
		},
		[Symbol.asyncIterator]() {
			return this;
		}
	};
}
/**
* Cancels a ReadableStream we don't need to consume.
* See https://undici.nodejs.org/#/?id=garbage-collection
*/
async function CancelReadableStream(stream) {
	if (stream === null || typeof stream !== "object") return;
	if (stream[Symbol.asyncIterator]) {
		await stream[Symbol.asyncIterator]().return?.();
		return;
	}
	const reader = stream.getReader();
	const cancelPromise = reader.cancel();
	reader.releaseLock();
	await cancelPromise;
}
//#endregion
//#region node_modules/openai/internal/request-options.mjs
var FallbackEncoder = ({ headers, body }) => {
	return {
		bodyHeaders: { "content-type": "application/json" },
		body: JSON.stringify(body)
	};
};
//#endregion
//#region node_modules/openai/internal/qs/formats.mjs
var default_format = "RFC3986";
var default_formatter = (v) => String(v);
var formatters = {
	RFC1738: (v) => String(v).replace(/%20/g, "+"),
	RFC3986: default_formatter
};
//#endregion
//#region node_modules/openai/internal/qs/utils.mjs
var has = (obj, key) => (has = Object.hasOwn ?? Function.prototype.call.bind(Object.prototype.hasOwnProperty), has(obj, key));
var hex_table = /* @__PURE__ */ (() => {
	const array = [];
	for (let i = 0; i < 256; ++i) array.push("%" + ((i < 16 ? "0" : "") + i.toString(16)).toUpperCase());
	return array;
})();
var limit = 1024;
var encode = (str, _defaultEncoder, charset, _kind, format) => {
	if (str.length === 0) return str;
	let string = str;
	if (typeof str === "symbol") string = Symbol.prototype.toString.call(str);
	else if (typeof str !== "string") string = String(str);
	if (charset === "iso-8859-1") return escape(string).replace(/%u[0-9a-f]{4}/gi, function($0) {
		return "%26%23" + parseInt($0.slice(2), 16) + "%3B";
	});
	let out = "";
	for (let j = 0; j < string.length; j += limit) {
		const segment = string.length >= limit ? string.slice(j, j + limit) : string;
		const arr = [];
		for (let i = 0; i < segment.length; ++i) {
			let c = segment.charCodeAt(i);
			if (c === 45 || c === 46 || c === 95 || c === 126 || c >= 48 && c <= 57 || c >= 65 && c <= 90 || c >= 97 && c <= 122 || format === "RFC1738" && (c === 40 || c === 41)) {
				arr[arr.length] = segment.charAt(i);
				continue;
			}
			if (c < 128) {
				arr[arr.length] = hex_table[c];
				continue;
			}
			if (c < 2048) {
				arr[arr.length] = hex_table[192 | c >> 6] + hex_table[128 | c & 63];
				continue;
			}
			if (c < 55296 || c >= 57344) {
				arr[arr.length] = hex_table[224 | c >> 12] + hex_table[128 | c >> 6 & 63] + hex_table[128 | c & 63];
				continue;
			}
			i += 1;
			c = 65536 + ((c & 1023) << 10 | segment.charCodeAt(i) & 1023);
			arr[arr.length] = hex_table[240 | c >> 18] + hex_table[128 | c >> 12 & 63] + hex_table[128 | c >> 6 & 63] + hex_table[128 | c & 63];
		}
		out += arr.join("");
	}
	return out;
};
function is_buffer(obj) {
	if (!obj || typeof obj !== "object") return false;
	return !!(obj.constructor && obj.constructor.isBuffer && obj.constructor.isBuffer(obj));
}
function maybe_map(val, fn) {
	if (isArray(val)) {
		const mapped = [];
		for (let i = 0; i < val.length; i += 1) mapped.push(fn(val[i]));
		return mapped;
	}
	return fn(val);
}
//#endregion
//#region node_modules/openai/internal/qs/stringify.mjs
var array_prefix_generators = {
	brackets(prefix) {
		return String(prefix) + "[]";
	},
	comma: "comma",
	indices(prefix, key) {
		return String(prefix) + "[" + key + "]";
	},
	repeat(prefix) {
		return String(prefix);
	}
};
var push_to_array = function(arr, value_or_array) {
	Array.prototype.push.apply(arr, isArray(value_or_array) ? value_or_array : [value_or_array]);
};
var toISOString;
var defaults = {
	addQueryPrefix: false,
	allowDots: false,
	allowEmptyArrays: false,
	arrayFormat: "indices",
	charset: "utf-8",
	charsetSentinel: false,
	delimiter: "&",
	encode: true,
	encodeDotInKeys: false,
	encoder: encode,
	encodeValuesOnly: false,
	format: default_format,
	formatter: default_formatter,
	/** @deprecated */
	indices: false,
	serializeDate(date) {
		return (toISOString ?? (toISOString = Function.prototype.call.bind(Date.prototype.toISOString)))(date);
	},
	skipNulls: false,
	strictNullHandling: false
};
function is_non_nullish_primitive(v) {
	return typeof v === "string" || typeof v === "number" || typeof v === "boolean" || typeof v === "symbol" || typeof v === "bigint";
}
var sentinel = {};
function inner_stringify(object, prefix, generateArrayPrefix, commaRoundTrip, allowEmptyArrays, strictNullHandling, skipNulls, encodeDotInKeys, encoder, filter, sort, allowDots, serializeDate, format, formatter, encodeValuesOnly, charset, sideChannel) {
	let obj = object;
	let tmp_sc = sideChannel;
	let step = 0;
	let find_flag = false;
	while ((tmp_sc = tmp_sc.get(sentinel)) !== void 0 && !find_flag) {
		const pos = tmp_sc.get(object);
		step += 1;
		if (typeof pos !== "undefined") if (pos === step) throw new RangeError("Cyclic object value");
		else find_flag = true;
		if (typeof tmp_sc.get(sentinel) === "undefined") step = 0;
	}
	if (typeof filter === "function") obj = filter(prefix, obj);
	else if (obj instanceof Date) obj = serializeDate?.(obj);
	else if (generateArrayPrefix === "comma" && isArray(obj)) obj = maybe_map(obj, function(value) {
		if (value instanceof Date) return serializeDate?.(value);
		return value;
	});
	if (obj === null) {
		if (strictNullHandling) return encoder && !encodeValuesOnly ? encoder(prefix, defaults.encoder, charset, "key", format) : prefix;
		obj = "";
	}
	if (is_non_nullish_primitive(obj) || is_buffer(obj)) {
		if (encoder) {
			const key_value = encodeValuesOnly ? prefix : encoder(prefix, defaults.encoder, charset, "key", format);
			return [formatter?.(key_value) + "=" + formatter?.(encoder(obj, defaults.encoder, charset, "value", format))];
		}
		return [formatter?.(prefix) + "=" + formatter?.(String(obj))];
	}
	const values = [];
	if (typeof obj === "undefined") return values;
	let obj_keys;
	if (generateArrayPrefix === "comma" && isArray(obj)) {
		if (encodeValuesOnly && encoder) obj = maybe_map(obj, encoder);
		obj_keys = [{ value: obj.length > 0 ? obj.join(",") || null : void 0 }];
	} else if (isArray(filter)) obj_keys = filter;
	else {
		const keys = Object.keys(obj);
		obj_keys = sort ? keys.sort(sort) : keys;
	}
	const encoded_prefix = encodeDotInKeys ? String(prefix).replace(/\./g, "%2E") : String(prefix);
	const adjusted_prefix = commaRoundTrip && isArray(obj) && obj.length === 1 ? encoded_prefix + "[]" : encoded_prefix;
	if (allowEmptyArrays && isArray(obj) && obj.length === 0) return adjusted_prefix + "[]";
	for (let j = 0; j < obj_keys.length; ++j) {
		const key = obj_keys[j];
		const value = typeof key === "object" && typeof key.value !== "undefined" ? key.value : obj[key];
		if (skipNulls && value === null) continue;
		const encoded_key = allowDots && encodeDotInKeys ? key.replace(/\./g, "%2E") : key;
		const key_prefix = isArray(obj) ? typeof generateArrayPrefix === "function" ? generateArrayPrefix(adjusted_prefix, encoded_key) : adjusted_prefix : adjusted_prefix + (allowDots ? "." + encoded_key : "[" + encoded_key + "]");
		sideChannel.set(object, step);
		const valueSideChannel = /* @__PURE__ */ new WeakMap();
		valueSideChannel.set(sentinel, sideChannel);
		push_to_array(values, inner_stringify(value, key_prefix, generateArrayPrefix, commaRoundTrip, allowEmptyArrays, strictNullHandling, skipNulls, encodeDotInKeys, generateArrayPrefix === "comma" && encodeValuesOnly && isArray(obj) ? null : encoder, filter, sort, allowDots, serializeDate, format, formatter, encodeValuesOnly, charset, valueSideChannel));
	}
	return values;
}
function normalize_stringify_options(opts = defaults) {
	if (typeof opts.allowEmptyArrays !== "undefined" && typeof opts.allowEmptyArrays !== "boolean") throw new TypeError("`allowEmptyArrays` option can only be `true` or `false`, when provided");
	if (typeof opts.encodeDotInKeys !== "undefined" && typeof opts.encodeDotInKeys !== "boolean") throw new TypeError("`encodeDotInKeys` option can only be `true` or `false`, when provided");
	if (opts.encoder !== null && typeof opts.encoder !== "undefined" && typeof opts.encoder !== "function") throw new TypeError("Encoder has to be a function.");
	const charset = opts.charset || defaults.charset;
	if (typeof opts.charset !== "undefined" && opts.charset !== "utf-8" && opts.charset !== "iso-8859-1") throw new TypeError("The charset option must be either utf-8, iso-8859-1, or undefined");
	let format = default_format;
	if (typeof opts.format !== "undefined") {
		if (!has(formatters, opts.format)) throw new TypeError("Unknown format option provided.");
		format = opts.format;
	}
	const formatter = formatters[format];
	let filter = defaults.filter;
	if (typeof opts.filter === "function" || isArray(opts.filter)) filter = opts.filter;
	let arrayFormat;
	if (opts.arrayFormat && opts.arrayFormat in array_prefix_generators) arrayFormat = opts.arrayFormat;
	else if ("indices" in opts) arrayFormat = opts.indices ? "indices" : "repeat";
	else arrayFormat = defaults.arrayFormat;
	if ("commaRoundTrip" in opts && typeof opts.commaRoundTrip !== "boolean") throw new TypeError("`commaRoundTrip` must be a boolean, or absent");
	const allowDots = typeof opts.allowDots === "undefined" ? !!opts.encodeDotInKeys === true ? true : defaults.allowDots : !!opts.allowDots;
	return {
		addQueryPrefix: typeof opts.addQueryPrefix === "boolean" ? opts.addQueryPrefix : defaults.addQueryPrefix,
		allowDots,
		allowEmptyArrays: typeof opts.allowEmptyArrays === "boolean" ? !!opts.allowEmptyArrays : defaults.allowEmptyArrays,
		arrayFormat,
		charset,
		charsetSentinel: typeof opts.charsetSentinel === "boolean" ? opts.charsetSentinel : defaults.charsetSentinel,
		commaRoundTrip: !!opts.commaRoundTrip,
		delimiter: typeof opts.delimiter === "undefined" ? defaults.delimiter : opts.delimiter,
		encode: typeof opts.encode === "boolean" ? opts.encode : defaults.encode,
		encodeDotInKeys: typeof opts.encodeDotInKeys === "boolean" ? opts.encodeDotInKeys : defaults.encodeDotInKeys,
		encoder: typeof opts.encoder === "function" ? opts.encoder : defaults.encoder,
		encodeValuesOnly: typeof opts.encodeValuesOnly === "boolean" ? opts.encodeValuesOnly : defaults.encodeValuesOnly,
		filter,
		format,
		formatter,
		serializeDate: typeof opts.serializeDate === "function" ? opts.serializeDate : defaults.serializeDate,
		skipNulls: typeof opts.skipNulls === "boolean" ? opts.skipNulls : defaults.skipNulls,
		sort: typeof opts.sort === "function" ? opts.sort : null,
		strictNullHandling: typeof opts.strictNullHandling === "boolean" ? opts.strictNullHandling : defaults.strictNullHandling
	};
}
function stringify(object, opts = {}) {
	let obj = object;
	const options = normalize_stringify_options(opts);
	let obj_keys;
	let filter;
	if (typeof options.filter === "function") {
		filter = options.filter;
		obj = filter("", obj);
	} else if (isArray(options.filter)) {
		filter = options.filter;
		obj_keys = filter;
	}
	const keys = [];
	if (typeof obj !== "object" || obj === null) return "";
	const generateArrayPrefix = array_prefix_generators[options.arrayFormat];
	const commaRoundTrip = generateArrayPrefix === "comma" && options.commaRoundTrip;
	if (!obj_keys) obj_keys = Object.keys(obj);
	if (options.sort) obj_keys.sort(options.sort);
	const sideChannel = /* @__PURE__ */ new WeakMap();
	for (let i = 0; i < obj_keys.length; ++i) {
		const key = obj_keys[i];
		if (options.skipNulls && obj[key] === null) continue;
		push_to_array(keys, inner_stringify(obj[key], key, generateArrayPrefix, commaRoundTrip, options.allowEmptyArrays, options.strictNullHandling, options.skipNulls, options.encodeDotInKeys, options.encode ? options.encoder : null, options.filter, options.sort, options.allowDots, options.serializeDate, options.format, options.formatter, options.encodeValuesOnly, options.charset, sideChannel));
	}
	const joined = keys.join(options.delimiter);
	let prefix = options.addQueryPrefix === true ? "?" : "";
	if (options.charsetSentinel) if (options.charset === "iso-8859-1") prefix += "utf8=%26%2310003%3B&";
	else prefix += "utf8=%E2%9C%93&";
	return joined.length > 0 ? prefix + joined : "";
}
//#endregion
//#region node_modules/openai/internal/utils/query.mjs
function stringifyQuery(query) {
	return stringify(query, { arrayFormat: "brackets" });
}
//#endregion
//#region node_modules/openai/internal/utils/bytes.mjs
function concatBytes(buffers) {
	let length = 0;
	for (const buffer of buffers) length += buffer.length;
	const output = new Uint8Array(length);
	let index = 0;
	for (const buffer of buffers) {
		output.set(buffer, index);
		index += buffer.length;
	}
	return output;
}
var encodeUTF8_;
function encodeUTF8(str) {
	let encoder;
	return (encodeUTF8_ ?? (encoder = new globalThis.TextEncoder(), encodeUTF8_ = encoder.encode.bind(encoder)))(str);
}
var decodeUTF8_;
function decodeUTF8(bytes) {
	let decoder;
	return (decodeUTF8_ ?? (decoder = new globalThis.TextDecoder(), decodeUTF8_ = decoder.decode.bind(decoder)))(bytes);
}
//#endregion
//#region node_modules/openai/internal/decoders/line.mjs
var _LineDecoder_buffer;
var _LineDecoder_carriageReturnIndex;
/**
* A re-implementation of httpx's `LineDecoder` in Python that handles incrementally
* reading lines from text.
*
* https://github.com/encode/httpx/blob/920333ea98118e9cf617f246905d7b202510941c/httpx/_decoders.py#L258
*/
var LineDecoder = class {
	constructor() {
		_LineDecoder_buffer.set(this, void 0);
		_LineDecoder_carriageReturnIndex.set(this, void 0);
		__classPrivateFieldSet(this, _LineDecoder_buffer, /* @__PURE__ */ new Uint8Array(), "f");
		__classPrivateFieldSet(this, _LineDecoder_carriageReturnIndex, null, "f");
	}
	decode(chunk) {
		if (chunk == null) return [];
		const binaryChunk = chunk instanceof ArrayBuffer ? new Uint8Array(chunk) : typeof chunk === "string" ? encodeUTF8(chunk) : chunk;
		__classPrivateFieldSet(this, _LineDecoder_buffer, concatBytes([__classPrivateFieldGet(this, _LineDecoder_buffer, "f"), binaryChunk]), "f");
		const lines = [];
		let patternIndex;
		while ((patternIndex = findNewlineIndex(__classPrivateFieldGet(this, _LineDecoder_buffer, "f"), __classPrivateFieldGet(this, _LineDecoder_carriageReturnIndex, "f"))) != null) {
			if (patternIndex.carriage && __classPrivateFieldGet(this, _LineDecoder_carriageReturnIndex, "f") == null) {
				__classPrivateFieldSet(this, _LineDecoder_carriageReturnIndex, patternIndex.index, "f");
				continue;
			}
			if (__classPrivateFieldGet(this, _LineDecoder_carriageReturnIndex, "f") != null && (patternIndex.index !== __classPrivateFieldGet(this, _LineDecoder_carriageReturnIndex, "f") + 1 || patternIndex.carriage)) {
				lines.push(decodeUTF8(__classPrivateFieldGet(this, _LineDecoder_buffer, "f").subarray(0, __classPrivateFieldGet(this, _LineDecoder_carriageReturnIndex, "f") - 1)));
				__classPrivateFieldSet(this, _LineDecoder_buffer, __classPrivateFieldGet(this, _LineDecoder_buffer, "f").subarray(__classPrivateFieldGet(this, _LineDecoder_carriageReturnIndex, "f")), "f");
				__classPrivateFieldSet(this, _LineDecoder_carriageReturnIndex, null, "f");
				continue;
			}
			const endIndex = __classPrivateFieldGet(this, _LineDecoder_carriageReturnIndex, "f") !== null ? patternIndex.preceding - 1 : patternIndex.preceding;
			const line = decodeUTF8(__classPrivateFieldGet(this, _LineDecoder_buffer, "f").subarray(0, endIndex));
			lines.push(line);
			__classPrivateFieldSet(this, _LineDecoder_buffer, __classPrivateFieldGet(this, _LineDecoder_buffer, "f").subarray(patternIndex.index), "f");
			__classPrivateFieldSet(this, _LineDecoder_carriageReturnIndex, null, "f");
		}
		return lines;
	}
	flush() {
		if (!__classPrivateFieldGet(this, _LineDecoder_buffer, "f").length) return [];
		return this.decode("\n");
	}
};
_LineDecoder_buffer = /* @__PURE__ */ new WeakMap(), _LineDecoder_carriageReturnIndex = /* @__PURE__ */ new WeakMap();
LineDecoder.NEWLINE_CHARS = /* @__PURE__ */ new Set(["\n", "\r"]);
LineDecoder.NEWLINE_REGEXP = /\r\n|[\n\r]/g;
/**
* This function searches the buffer for the end patterns, (\r or \n)
* and returns an object with the index preceding the matched newline and the
* index after the newline char. `null` is returned if no new line is found.
*
* ```ts
* findNewLineIndex('abc\ndef') -> { preceding: 2, index: 3 }
* ```
*/
function findNewlineIndex(buffer, startIndex) {
	const newline = 10;
	const carriage = 13;
	for (let i = startIndex ?? 0; i < buffer.length; i++) {
		if (buffer[i] === newline) return {
			preceding: i,
			index: i + 1,
			carriage: false
		};
		if (buffer[i] === carriage) return {
			preceding: i,
			index: i + 1,
			carriage: true
		};
	}
	return null;
}
function findDoubleNewlineIndex(buffer) {
	const newline = 10;
	const carriage = 13;
	for (let i = 0; i < buffer.length - 1; i++) {
		if (buffer[i] === newline && buffer[i + 1] === newline) return i + 2;
		if (buffer[i] === carriage && buffer[i + 1] === carriage) return i + 2;
		if (buffer[i] === carriage && buffer[i + 1] === newline && i + 3 < buffer.length && buffer[i + 2] === carriage && buffer[i + 3] === newline) return i + 4;
	}
	return -1;
}
//#endregion
//#region node_modules/openai/internal/utils/log.mjs
var levelNumbers = {
	off: 0,
	error: 200,
	warn: 300,
	info: 400,
	debug: 500
};
var parseLogLevel = (maybeLevel, sourceName, client) => {
	if (!maybeLevel) return;
	if (hasOwn(levelNumbers, maybeLevel)) return maybeLevel;
	loggerFor(client).warn(`${sourceName} was set to ${JSON.stringify(maybeLevel)}, expected one of ${JSON.stringify(Object.keys(levelNumbers))}`);
};
function noop() {}
function makeLogFn(fnLevel, logger, logLevel) {
	if (!logger || levelNumbers[fnLevel] > levelNumbers[logLevel]) return noop;
	else return logger[fnLevel].bind(logger);
}
var noopLogger = {
	error: noop,
	warn: noop,
	info: noop,
	debug: noop
};
var cachedLoggers = /* @__PURE__ */ new WeakMap();
function loggerFor(client) {
	const logger = client.logger;
	const logLevel = client.logLevel ?? "off";
	if (!logger) return noopLogger;
	const cachedLogger = cachedLoggers.get(logger);
	if (cachedLogger && cachedLogger[0] === logLevel) return cachedLogger[1];
	const levelLogger = {
		error: makeLogFn("error", logger, logLevel),
		warn: makeLogFn("warn", logger, logLevel),
		info: makeLogFn("info", logger, logLevel),
		debug: makeLogFn("debug", logger, logLevel)
	};
	cachedLoggers.set(logger, [logLevel, levelLogger]);
	return levelLogger;
}
var formatRequestDetails = (details) => {
	if (details.options) {
		details.options = { ...details.options };
		delete details.options["headers"];
	}
	if (details.headers) details.headers = Object.fromEntries((details.headers instanceof Headers ? [...details.headers] : Object.entries(details.headers)).map(([name, value]) => [name, name.toLowerCase() === "authorization" || name.toLowerCase() === "api-key" || name.toLowerCase() === "x-api-key" || name.toLowerCase() === "x-amz-security-token" || name.toLowerCase() === "cookie" || name.toLowerCase() === "set-cookie" ? "***" : value]));
	if ("retryOfRequestLogID" in details) {
		if (details.retryOfRequestLogID) details.retryOf = details.retryOfRequestLogID;
		delete details.retryOfRequestLogID;
	}
	return details;
};
//#endregion
//#region node_modules/openai/core/streaming.mjs
var _Stream_client;
var Stream = class Stream {
	constructor(iterator, controller, client) {
		this.iterator = iterator;
		_Stream_client.set(this, void 0);
		this.controller = controller;
		__classPrivateFieldSet(this, _Stream_client, client, "f");
	}
	static fromSSEResponse(response, controller, client, synthesizeEventData) {
		let consumed = false;
		const logger = client ? loggerFor(client) : console;
		async function* iterator() {
			if (consumed) throw new OpenAIError("Cannot iterate over a consumed stream, use `.tee()` to split the stream.");
			consumed = true;
			let done = false;
			try {
				for await (const sse of _iterSSEMessages(response, controller)) {
					if (done) continue;
					if (sse.data.startsWith("[DONE]")) {
						done = true;
						continue;
					}
					if (sse.event === null || !sse.event.startsWith("thread.")) {
						let data;
						try {
							data = JSON.parse(sse.data);
						} catch (e) {
							logger.error(`Could not parse message into JSON:`, sse.data);
							logger.error(`From chunk:`, sse.raw);
							throw e;
						}
						if (data && data.error) throw new APIError(void 0, data.error, void 0, response.headers);
						yield synthesizeEventData ? {
							event: sse.event,
							data
						} : data;
					} else {
						let data;
						try {
							data = JSON.parse(sse.data);
						} catch (e) {
							console.error(`Could not parse message into JSON:`, sse.data);
							console.error(`From chunk:`, sse.raw);
							throw e;
						}
						if (sse.event == "error") throw new APIError(void 0, data.error, data.message, void 0);
						yield {
							event: sse.event,
							data
						};
					}
				}
				done = true;
			} catch (e) {
				if (isAbortError(e)) return;
				throw e;
			} finally {
				if (!done) controller.abort();
			}
		}
		return new Stream(iterator, controller, client);
	}
	/**
	* Generates a Stream from a newline-separated ReadableStream
	* where each item is a JSON value.
	*/
	static fromReadableStream(readableStream, controller, client) {
		let consumed = false;
		async function* iterLines() {
			const lineDecoder = new LineDecoder();
			const reader = readableStream.getReader();
			let closed = false;
			let cancelPromise;
			const cancel = () => {
				cancelPromise ?? (cancelPromise = reader.cancel());
				cancelPromise.catch(() => {});
			};
			controller.signal.addEventListener("abort", cancel, { once: true });
			try {
				if (controller.signal.aborted) {
					cancel();
					return;
				}
				while (true) {
					const { value: chunk, done } = await reader.read();
					if (done) {
						closed = true;
						break;
					}
					if (controller.signal.aborted) return;
					for (const line of lineDecoder.decode(chunk)) {
						if (controller.signal.aborted) return;
						yield line;
					}
				}
				if (controller.signal.aborted) return;
				for (const line of lineDecoder.flush()) {
					if (controller.signal.aborted) return;
					yield line;
				}
			} finally {
				controller.signal.removeEventListener("abort", cancel);
				if (!closed) cancel();
				reader.releaseLock();
			}
		}
		async function* iterator() {
			if (consumed) throw new OpenAIError("Cannot iterate over a consumed stream, use `.tee()` to split the stream.");
			consumed = true;
			let done = false;
			try {
				for await (const line of iterLines()) {
					if (done) continue;
					if (line) yield JSON.parse(line);
				}
				done = true;
			} catch (e) {
				if (controller.signal.aborted || isAbortError(e)) return;
				throw e;
			} finally {
				if (!done) controller.abort();
			}
		}
		return new Stream(iterator, controller, client);
	}
	[(_Stream_client = /* @__PURE__ */ new WeakMap(), Symbol.asyncIterator)]() {
		return this.iterator();
	}
	/**
	* Splits the stream into two streams which can be
	* independently read from at different speeds.
	*/
	tee() {
		const left = [];
		const right = [];
		const iterator = this.iterator();
		const teeIterator = (queue) => {
			return { next: () => {
				if (queue.length === 0) {
					const result = iterator.next();
					left.push(result);
					right.push(result);
				}
				return queue.shift();
			} };
		};
		return [new Stream(() => teeIterator(left), this.controller, __classPrivateFieldGet(this, _Stream_client, "f")), new Stream(() => teeIterator(right), this.controller, __classPrivateFieldGet(this, _Stream_client, "f"))];
	}
	/**
	* Converts this stream to a newline-separated ReadableStream of
	* JSON stringified values in the stream
	* which can be turned back into a Stream with `Stream.fromReadableStream()`.
	*/
	toReadableStream() {
		const self = this;
		let iter;
		return makeReadableStream({
			async start() {
				iter = self[Symbol.asyncIterator]();
			},
			async pull(ctrl) {
				try {
					const { value, done } = await iter.next();
					if (done) return ctrl.close();
					const bytes = encodeUTF8(JSON.stringify(value) + "\n");
					ctrl.enqueue(bytes);
				} catch (err) {
					ctrl.error(err);
				}
			},
			async cancel() {
				await iter.return?.();
			}
		});
	}
};
async function* _iterSSEMessages(response, controller) {
	if (!response.body) {
		controller.abort();
		if (typeof globalThis.navigator !== "undefined" && globalThis.navigator.product === "ReactNative") throw new OpenAIError(`The default react-native fetch implementation does not support streaming. Please use expo/fetch: https://docs.expo.dev/versions/latest/sdk/expo/#expofetch-api`);
		throw new OpenAIError(`Attempted to iterate over a response with no body`);
	}
	const sseDecoder = new SSEDecoder();
	const lineDecoder = new LineDecoder();
	const iter = ReadableStreamToAsyncIterable(response.body);
	for await (const sseChunk of iterSSEChunks(iter)) for (const line of lineDecoder.decode(sseChunk)) {
		const sse = sseDecoder.decode(line);
		if (sse) yield sse;
	}
	for (const line of lineDecoder.flush()) {
		const sse = sseDecoder.decode(line);
		if (sse) yield sse;
	}
}
/**
* Given an async iterable iterator, iterates over it and yields full
* SSE chunks, i.e. yields when a double new-line is encountered.
*/
async function* iterSSEChunks(iterator) {
	let data = /* @__PURE__ */ new Uint8Array();
	for await (const chunk of iterator) {
		if (chunk == null) continue;
		const binaryChunk = chunk instanceof ArrayBuffer ? new Uint8Array(chunk) : typeof chunk === "string" ? encodeUTF8(chunk) : chunk;
		let newData = new Uint8Array(data.length + binaryChunk.length);
		newData.set(data);
		newData.set(binaryChunk, data.length);
		data = newData;
		let patternIndex;
		while ((patternIndex = findDoubleNewlineIndex(data)) !== -1) {
			yield data.slice(0, patternIndex);
			data = data.slice(patternIndex);
		}
	}
	if (data.length > 0) yield data;
}
var SSEDecoder = class {
	constructor() {
		this.event = null;
		this.data = [];
		this.chunks = [];
	}
	decode(line) {
		if (line.endsWith("\r")) line = line.substring(0, line.length - 1);
		if (!line) {
			if (!this.event && !this.data.length) return null;
			const sse = {
				event: this.event,
				data: this.data.join("\n"),
				raw: this.chunks
			};
			this.event = null;
			this.data = [];
			this.chunks = [];
			return sse;
		}
		this.chunks.push(line);
		if (line.startsWith(":")) return null;
		let [fieldname, _, value] = partition(line, ":");
		if (value.startsWith(" ")) value = value.substring(1);
		if (fieldname === "event") this.event = value;
		else if (fieldname === "data") this.data.push(value);
		return null;
	}
};
function partition(str, delimiter) {
	const index = str.indexOf(delimiter);
	if (index !== -1) return [
		str.substring(0, index),
		delimiter,
		str.substring(index + delimiter.length)
	];
	return [
		str,
		"",
		""
	];
}
//#endregion
//#region node_modules/openai/internal/parse.mjs
async function defaultParseResponse(client, props) {
	const { response, requestLogID, retryOfRequestLogID, startTime } = props;
	const body = await (async () => {
		if (props.options.stream) {
			loggerFor(client).debug("response", response.status, response.url, response.headers, response.body);
			if (props.options.__streamClass) return props.options.__streamClass.fromSSEResponse(response, props.controller, client, props.options.__synthesizeEventData);
			return Stream.fromSSEResponse(response, props.controller, client, props.options.__synthesizeEventData);
		}
		if (response.status === 204) return null;
		if (props.options.__binaryResponse) return response;
		const mediaType = response.headers.get("content-type")?.split(";")[0]?.trim();
		if (mediaType?.includes("application/json") || mediaType?.endsWith("+json")) {
			if (response.headers.get("content-length") === "0") return;
			return addRequestID(await response.json(), response);
		}
		return await response.text();
	})();
	loggerFor(client).debug(`[${requestLogID}] response parsed`, formatRequestDetails({
		retryOfRequestLogID,
		url: response.url,
		status: response.status,
		body,
		durationMs: Date.now() - startTime
	}));
	return body;
}
function addRequestID(value, response) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return value;
	return Object.defineProperty(value, "_request_id", {
		value: response.headers.get("x-request-id"),
		enumerable: false
	});
}
//#endregion
//#region node_modules/openai/core/api-promise.mjs
var _APIPromise_client;
/**
* A subclass of `Promise` providing additional helper methods
* for interacting with the SDK.
*/
var APIPromise = class APIPromise extends Promise {
	constructor(client, responsePromise, parseResponse = defaultParseResponse) {
		super((resolve) => {
			resolve(null);
		});
		this.responsePromise = responsePromise;
		this.parseResponse = parseResponse;
		_APIPromise_client.set(this, void 0);
		__classPrivateFieldSet(this, _APIPromise_client, client, "f");
	}
	_thenUnwrap(transform) {
		return new APIPromise(__classPrivateFieldGet(this, _APIPromise_client, "f"), this.responsePromise, async (client, props) => addRequestID(transform(await this.parseResponse(client, props), props), props.response));
	}
	/**
	* Gets the raw `Response` instance instead of parsing the response
	* data.
	*
	* If you want to parse the response body but still get the `Response`
	* instance, you can use {@link withResponse()}.
	*
	* 👋 Getting the wrong TypeScript type for `Response`?
	* Try setting `"moduleResolution": "NodeNext"` or add `"lib": ["DOM"]`
	* to your `tsconfig.json`.
	*/
	asResponse() {
		return this.responsePromise.then((p) => p.response);
	}
	/**
	* Gets the parsed response data, the raw `Response` instance and the ID of the request,
	* returned via the X-Request-ID header which is useful for debugging requests and reporting
	* issues to OpenAI.
	*
	* If you just want to get the raw `Response` instance without parsing it,
	* you can use {@link asResponse()}.
	*
	* 👋 Getting the wrong TypeScript type for `Response`?
	* Try setting `"moduleResolution": "NodeNext"` or add `"lib": ["DOM"]`
	* to your `tsconfig.json`.
	*/
	async withResponse() {
		const [data, response] = await Promise.all([this.parse(), this.asResponse()]);
		return {
			data,
			response,
			request_id: response.headers.get("x-request-id")
		};
	}
	parse() {
		if (!this.parsedPromise) this.parsedPromise = this.responsePromise.then((data) => this.parseResponse(__classPrivateFieldGet(this, _APIPromise_client, "f"), data));
		return this.parsedPromise;
	}
	then(onfulfilled, onrejected) {
		return this.parse().then(onfulfilled, onrejected);
	}
	catch(onrejected) {
		return this.parse().catch(onrejected);
	}
	finally(onfinally) {
		return this.parse().finally(onfinally);
	}
};
_APIPromise_client = /* @__PURE__ */ new WeakMap();
//#endregion
//#region node_modules/openai/core/pagination.mjs
var _AbstractPage_client;
var AbstractPage = class {
	constructor(client, response, body, options) {
		_AbstractPage_client.set(this, void 0);
		__classPrivateFieldSet(this, _AbstractPage_client, client, "f");
		this.options = options;
		this.response = response;
		this.body = body;
	}
	hasNextPage() {
		if (!this.getPaginatedItems().length) return false;
		return this.nextPageRequestOptions() != null;
	}
	async getNextPage() {
		const nextOptions = this.nextPageRequestOptions();
		if (!nextOptions) throw new OpenAIError("No next page expected; please check `.hasNextPage()` before calling `.getNextPage()`.");
		return await __classPrivateFieldGet(this, _AbstractPage_client, "f").requestAPIList(this.constructor, nextOptions);
	}
	async *iterPages() {
		let page = this;
		yield page;
		while (page.hasNextPage()) {
			page = await page.getNextPage();
			yield page;
		}
	}
	async *[(_AbstractPage_client = /* @__PURE__ */ new WeakMap(), Symbol.asyncIterator)]() {
		for await (const page of this.iterPages()) for (const item of page.getPaginatedItems()) yield item;
	}
};
/**
* This subclass of Promise will resolve to an instantiated Page once the request completes.
*
* It also implements AsyncIterable to allow auto-paginating iteration on an unawaited list call, eg:
*
*    for await (const item of client.items.list()) {
*      console.log(item)
*    }
*/
var PagePromise = class extends APIPromise {
	constructor(client, request, Page) {
		super(client, request, async (client, props) => new Page(client, props.response, await defaultParseResponse(client, props), props.options));
	}
	/**
	* Allow auto-paginating iteration on an unawaited list call, eg:
	*
	*    for await (const item of client.items.list()) {
	*      console.log(item)
	*    }
	*/
	async *[Symbol.asyncIterator]() {
		const page = await this;
		for await (const item of page) yield item;
	}
};
/**
* Note: no pagination actually occurs yet, this is for forwards-compatibility.
*/
var Page = class extends AbstractPage {
	constructor(client, response, body, options) {
		super(client, response, body, options);
		this.data = body.data || [];
		this.object = body.object;
	}
	getPaginatedItems() {
		return this.data ?? [];
	}
	nextPageRequestOptions() {
		return null;
	}
};
var CursorPage = class extends AbstractPage {
	constructor(client, response, body, options) {
		super(client, response, body, options);
		this.data = body.data || [];
		this.has_more = body.has_more || false;
	}
	getPaginatedItems() {
		return this.data ?? [];
	}
	hasNextPage() {
		if (this.has_more === false) return false;
		return super.hasNextPage();
	}
	nextPageRequestOptions() {
		const data = this.getPaginatedItems();
		const id = data[data.length - 1]?.id;
		if (!id) return null;
		return {
			...this.options,
			query: {
				...maybeObj(this.options.query),
				after: id
			}
		};
	}
};
var ConversationCursorPage = class extends AbstractPage {
	constructor(client, response, body, options) {
		super(client, response, body, options);
		this.data = body.data || [];
		this.has_more = body.has_more || false;
		this.last_id = body.last_id || "";
	}
	getPaginatedItems() {
		return this.data ?? [];
	}
	hasNextPage() {
		if (this.has_more === false) return false;
		return super.hasNextPage();
	}
	nextPageRequestOptions() {
		const cursor = this.last_id;
		if (!cursor) return null;
		return {
			...this.options,
			query: {
				...maybeObj(this.options.query),
				after: cursor
			}
		};
	}
};
var NextCursorPage = class extends AbstractPage {
	constructor(client, response, body, options) {
		super(client, response, body, options);
		this.data = body.data || [];
		this.has_more = body.has_more || false;
		this.next = body.next || null;
	}
	getPaginatedItems() {
		return this.data ?? [];
	}
	hasNextPage() {
		if (this.has_more === false) return false;
		return super.hasNextPage();
	}
	nextPageRequestOptions() {
		const cursor = this.next;
		if (!cursor) return null;
		return {
			...this.options,
			query: {
				...maybeObj(this.options.query),
				after: cursor
			}
		};
	}
};
//#endregion
//#region node_modules/openai/auth/workload-identity-auth.mjs
var SUBJECT_TOKEN_TYPES = {
	jwt: "urn:ietf:params:oauth:token-type:jwt",
	id: "urn:ietf:params:oauth:token-type:id_token"
};
var TOKEN_EXCHANGE_GRANT_TYPE = "urn:ietf:params:oauth:grant-type:token-exchange";
var WorkloadIdentityAuth = class {
	constructor(config, fetch) {
		this.cachedToken = null;
		this.refreshPromise = null;
		this.tokenExchangeUrl = "https://auth.openai.com/oauth/token";
		this.config = config;
		this.fetch = fetch ?? getDefaultFetch();
	}
	async getToken() {
		if (!this.cachedToken || this.isTokenExpired(this.cachedToken)) {
			if (this.refreshPromise) return await this.refreshPromise;
			this.refreshPromise = this.refreshToken();
			try {
				return await this.refreshPromise;
			} finally {
				this.refreshPromise = null;
			}
		}
		if (this.needsRefresh(this.cachedToken) && !this.refreshPromise) this.refreshPromise = this.refreshToken().finally(() => {
			this.refreshPromise = null;
		});
		return this.cachedToken.token;
	}
	async refreshToken() {
		const body = {
			grant_type: TOKEN_EXCHANGE_GRANT_TYPE,
			subject_token: await this.config.provider.getToken(),
			subject_token_type: SUBJECT_TOKEN_TYPES[this.config.provider.tokenType],
			identity_provider_id: this.config.identityProviderId,
			service_account_id: this.config.serviceAccountId
		};
		if (this.config.clientId) body["client_id"] = this.config.clientId;
		const response = await this.fetch(this.tokenExchangeUrl, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(body)
		});
		if (!response.ok) {
			const errorText = await response.text();
			let body = void 0;
			try {
				body = JSON.parse(errorText);
			} catch {}
			if (response.status === 400 || response.status === 401 || response.status === 403) throw new OAuthError(response.status, body, response.headers);
			throw APIError.generate(response.status, body, `Token exchange failed with status ${response.status}`, response.headers);
		}
		const tokenResponse = await response.json();
		if (typeof tokenResponse !== "object" || tokenResponse === null || !("access_token" in tokenResponse) || typeof tokenResponse.access_token !== "string" || tokenResponse.access_token.trim().length === 0) throw new OpenAIError("Token exchange response missing 'access_token' field");
		const accessToken = tokenResponse.access_token;
		const expiresIn = tokenResponse.expires_in ?? 3600;
		const expiresAt = Date.now() + expiresIn * 1e3;
		this.cachedToken = {
			token: accessToken,
			expiresAt
		};
		return accessToken;
	}
	isTokenExpired(cachedToken) {
		return Date.now() >= cachedToken.expiresAt;
	}
	needsRefresh(cachedToken) {
		const bufferMs = (this.config.refreshBufferSeconds ?? 1200) * 1e3;
		return Date.now() >= cachedToken.expiresAt - bufferMs;
	}
	invalidateToken() {
		this.cachedToken = null;
		this.refreshPromise = null;
	}
};
//#endregion
//#region node_modules/openai/internal/headers.mjs
var brand_privateNullableHeaders = /* @__PURE__ */ Symbol("brand.privateNullableHeaders");
var httpTokenHeaderName = /^[!#$%&'*+\-.^_`|~0-9A-Za-z]+$/;
function* iterateHeaders(headers) {
	if (!headers) return;
	if (brand_privateNullableHeaders in headers) {
		const { values, nulls } = headers;
		yield* values.entries();
		for (const name of nulls) yield [name, null];
		return;
	}
	let shouldClear = false;
	let iter;
	if (headers instanceof Headers) iter = headers.entries();
	else if (isReadonlyArray(headers)) iter = headers;
	else {
		shouldClear = true;
		iter = Object.entries(headers ?? {});
	}
	for (let row of iter) {
		const name = row[0];
		if (typeof name !== "string") throw new TypeError("expected header name to be a string");
		const values = isReadonlyArray(row[1]) ? row[1] : [row[1]];
		let didClear = false;
		for (const value of values) {
			if (value === void 0) continue;
			if (shouldClear && !didClear) {
				didClear = true;
				yield [name, null];
			}
			yield [name, value];
		}
	}
}
var buildHeaders = (newHeaders) => {
	const targetHeaders = new Headers();
	const nullHeaders = /* @__PURE__ */ new Set();
	for (const headers of newHeaders) {
		const seenHeaders = /* @__PURE__ */ new Set();
		for (const [name, value] of iterateHeaders(headers)) {
			if (!httpTokenHeaderName.test(name)) throw new TypeError(`Header name must be a valid HTTP token ["${name}"]`);
			const lowerName = name.toLowerCase();
			if (!seenHeaders.has(lowerName)) {
				targetHeaders.delete(lowerName);
				seenHeaders.add(lowerName);
			}
			if (value === null) {
				targetHeaders.delete(lowerName);
				nullHeaders.add(lowerName);
			} else {
				targetHeaders.append(lowerName, value);
				nullHeaders.delete(lowerName);
			}
		}
	}
	return {
		[brand_privateNullableHeaders]: true,
		values: targetHeaders,
		nulls: nullHeaders
	};
};
//#endregion
//#region node_modules/openai/internal/uploads.mjs
var brand_privateStreamingFile = /* @__PURE__ */ Symbol("brand.privateStreamingFile");
/**
* Wrap a stream as an uploadable file without reading it into memory.
*
* Unlike {@link toFile}, this helper does not create a web `File`, because the `File` constructor
* must consume all of its contents up front. The stream is instead encoded lazily as multipart
* form data when the request is sent.
*/
function toStreamingFile(data, name, options) {
	if (!name) throw new TypeError("toStreamingFile requires a non-empty file name");
	return {
		[brand_privateStreamingFile]: true,
		data,
		name,
		...options?.type ? { type: options.type } : {}
	};
}
var checkFileSupport = () => {
	if (typeof File === "undefined") {
		const { process } = globalThis;
		const isOldNode = typeof process?.versions?.node === "string" && parseInt(process.versions.node.split(".")) < 20;
		throw new Error("`File` is not defined as a global, which is required for file uploads." + (isOldNode ? " Update to Node 20 LTS or newer, or set `globalThis.File` to `import('node:buffer').File`." : ""));
	}
};
/**
* Construct a `File` instance. This is used to ensure a helpful error is thrown
* for environments that don't define a global `File` yet.
*/
function makeFile(fileBits, fileName, options) {
	checkFileSupport();
	return new File(fileBits, fileName ?? "unknown_file", options);
}
function getName(value) {
	return (typeof value === "object" && value !== null && ("name" in value && value.name && String(value.name) || "url" in value && value.url && String(value.url) || "filename" in value && value.filename && String(value.filename) || "path" in value && value.path && String(value.path)) || "").split(/[\\/]/).pop() || void 0;
}
var isAsyncIterable = (value) => value != null && typeof value === "object" && typeof value[Symbol.asyncIterator] === "function";
/**
* Returns a multipart/form-data request if any part of the given request body contains a File / Blob value.
* Otherwise returns the request as is.
*/
var maybeMultipartFormRequestOptions = async (opts, fetch) => {
	if (!hasUploadableValue(opts.body)) return opts;
	if (hasStreamingUploadableValue(opts.body)) return createStreamingFormRequestOptions(opts);
	return {
		...opts,
		body: await createForm(opts.body, fetch)
	};
};
var multipartFormRequestOptions = async (opts, fetch) => {
	if (hasStreamingUploadableValue(opts.body)) return createStreamingFormRequestOptions(opts);
	return {
		...opts,
		body: await createForm(opts.body, fetch)
	};
};
var supportsFormDataMap = /* @__PURE__ */ new WeakMap();
/**
* node-fetch doesn't support the global FormData object in recent node versions. Instead of sending
* properly-encoded form data, it just stringifies the object, resulting in a request body of "[object FormData]".
* This function detects if the fetch function provided supports the global FormData object to avoid
* confusing error messages later on.
*/
function supportsFormData(fetchObject) {
	const fetch = typeof fetchObject === "function" ? fetchObject : fetchObject.fetch;
	const cached = supportsFormDataMap.get(fetch);
	if (cached) return cached;
	const promise = (async () => {
		try {
			const FetchResponse = "Response" in fetch ? fetch.Response : (await fetch("data:,")).constructor;
			const data = new FormData();
			if (data.toString() === await new FetchResponse(data).text()) return false;
			return true;
		} catch {
			return true;
		}
	})();
	supportsFormDataMap.set(fetch, promise);
	return promise;
}
var createForm = async (body, fetch) => {
	if (!await supportsFormData(fetch)) throw new TypeError("The provided fetch function does not support file uploads with the current global FormData class.");
	const form = new FormData();
	await Promise.all(Object.entries(body || {}).map(([key, value]) => addFormValue(form, key, value)));
	return form;
};
var isNamedBlob = (value) => value instanceof Blob && "name" in value;
var isReadableStream = (value) => typeof value === "object" && value !== null && "getReader" in value && typeof value.getReader === "function";
var isStreamingFile = (value) => typeof value === "object" && value !== null && brand_privateStreamingFile in value;
var isUploadable = (value) => typeof value === "object" && value !== null && (value instanceof Response || isAsyncIterable(value) || isReadableStream(value) || isStreamingFile(value) || isNamedBlob(value));
var hasStreamingUploadableValue = (value) => {
	if (isStreamingFile(value) || isAsyncIterable(value) || isReadableStream(value)) return true;
	if (Array.isArray(value)) return value.some(hasStreamingUploadableValue);
	if (value && typeof value === "object" && !isNamedBlob(value) && !(value instanceof Response)) {
		for (const k in value) if (hasStreamingUploadableValue(value[k])) return true;
	}
	return false;
};
var hasUploadableValue = (value) => {
	if (isUploadable(value)) return true;
	if (Array.isArray(value)) return value.some(hasUploadableValue);
	if (value && typeof value === "object") {
		for (const k in value) if (hasUploadableValue(value[k])) return true;
	}
	return false;
};
var createStreamingFormRequestOptions = (opts) => {
	const boundary = `openai-${Math.random().toString(36).slice(2)}`;
	const body = ReadableStreamFrom(iterateMultipartBody(opts.body, boundary));
	return {
		...opts,
		body,
		headers: buildHeaders([{ "content-type": `multipart/form-data; boundary=${boundary}` }, opts.headers])
	};
};
async function* iterateMultipartBody(body, boundary) {
	for await (const { key, value } of iterateFormEntries(body)) {
		yield encodeUTF8(`--${boundary}\r\n`);
		if (isUploadable(value)) {
			const filename = getStreamingFileName(value);
			const type = getStreamingFileType(value);
			yield encodeUTF8(`Content-Disposition: form-data; name="${escapeHeaderValue(key)}"; filename="${escapeHeaderValue(filename)}"\r\nContent-Type: ${type}\r\n\r\n`);
			yield* iterateBytes(getStreamingFileData(value));
		} else yield encodeUTF8(`Content-Disposition: form-data; name="${escapeHeaderValue(key)}"\r\n\r\n${String(value)}`);
		yield encodeUTF8("\r\n");
	}
	yield encodeUTF8(`--${boundary}--\r\n`);
}
async function* iterateFormEntries(body) {
	if (!body || typeof body !== "object") return;
	for (const [key, value] of Object.entries(body)) yield* iterateFormValue(key, value);
}
async function* iterateFormValue(key, value) {
	if (value === void 0) return;
	if (value == null) throw new TypeError(`Received null for "${key}"; to pass null in FormData, you must use the string 'null'`);
	if (typeof value === "string" || typeof value === "number" || typeof value === "boolean" || isUploadable(value)) yield {
		key,
		value
	};
	else if (Array.isArray(value)) for (const entry of value) yield* iterateFormValue(key + "[]", entry);
	else if (typeof value === "object") for (const [name, prop] of Object.entries(value)) yield* iterateFormValue(`${key}[${name}]`, prop);
	else throw new TypeError(`Invalid value given to form, expected a string, number, boolean, object, Array, File or Blob but got ${value} instead`);
}
function getStreamingFileName(value) {
	return isStreamingFile(value) ? value.name : getName(value) ?? "unknown_file";
}
function getStreamingFileType(value) {
	if (isStreamingFile(value)) return value.type || "application/octet-stream";
	if (isNamedBlob(value) && value.type) return value.type;
	if (value instanceof Response) return value.headers.get("content-type") || "application/octet-stream";
	return "application/octet-stream";
}
function getStreamingFileData(value) {
	if (isStreamingFile(value)) return value.data;
	return value;
}
async function* iterateBytes(value) {
	if (typeof value === "string") yield encodeUTF8(value);
	else if (ArrayBuffer.isView(value)) yield new Uint8Array(value.buffer, value.byteOffset, value.byteLength);
	else if (value instanceof ArrayBuffer) yield new Uint8Array(value);
	else if (value instanceof Response) if (value.body) yield* iterateBytes(value.body);
	else yield* iterateBytes(await value.blob());
	else if (value instanceof Blob) if (typeof value.stream === "function") yield* iterateBytes(value.stream());
	else yield new Uint8Array(await value.arrayBuffer());
	else if (isReadableStream(value)) for await (const chunk of ReadableStreamToAsyncIterable(value)) yield* iterateBytes(chunk);
	else if (isAsyncIterable(value)) for await (const chunk of value) yield* iterateBytes(chunk);
	else throw new TypeError(`Invalid streaming file chunk: ${String(value)}`);
}
function escapeHeaderValue(value) {
	return value.replace(/["\\\r\n]/g, (character) => encodeURIComponent(character));
}
var addFormValue = async (form, key, value) => {
	if (value === void 0) return;
	if (value == null) throw new TypeError(`Received null for "${key}"; to pass null in FormData, you must use the string 'null'`);
	if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") form.append(key, String(value));
	else if (value instanceof Response) form.append(key, makeFile([await value.blob()], getName(value)));
	else if (isAsyncIterable(value)) form.append(key, makeFile([await new Response(ReadableStreamFrom(value)).blob()], getName(value)));
	else if (isNamedBlob(value)) form.append(key, value, getName(value));
	else if (Array.isArray(value)) await Promise.all(value.map((entry) => addFormValue(form, key + "[]", entry)));
	else if (typeof value === "object") await Promise.all(Object.entries(value).map(([name, prop]) => addFormValue(form, `${key}[${name}]`, prop)));
	else throw new TypeError(`Invalid value given to form, expected a string, number, boolean, object, Array, File or Blob but got ${value} instead`);
};
//#endregion
//#region node_modules/openai/internal/to-file.mjs
/**
* This check adds the arrayBuffer() method type because it is available and used at runtime
*/
var isBlobLike = (value) => value != null && typeof value === "object" && typeof value.size === "number" && typeof value.type === "string" && typeof value.text === "function" && typeof value.slice === "function" && typeof value.arrayBuffer === "function";
/**
* This check adds the arrayBuffer() method type because it is available and used at runtime
*/
var isFileLike = (value) => value != null && typeof value === "object" && typeof value.name === "string" && typeof value.lastModified === "number" && isBlobLike(value);
var isResponseLike = (value) => value != null && typeof value === "object" && typeof value.url === "string" && typeof value.blob === "function";
/**
* Helper for creating a {@link File} to pass to an SDK upload method from a variety of different data formats
* @param value the raw content of the file. Can be an {@link Uploadable}, BlobLikePart, or AsyncIterable of BlobLikeParts
* @param {string=} name the name of the file. If omitted, toFile will try to determine a file name from bits if possible
* @param {Object=} options additional properties
* @param {string=} options.type the MIME type of the content
* @param {number=} options.lastModified the last modified timestamp
* @returns a {@link File} with the given properties
*/
async function toFile(value, name, options) {
	checkFileSupport();
	value = await value;
	if (isFileLike(value)) {
		if (value instanceof File) return value;
		return makeFile([await value.arrayBuffer()], value.name);
	}
	if (isResponseLike(value)) {
		const blob = await value.blob();
		name || (name = new URL(value.url).pathname.split(/[\\/]/).pop());
		return makeFile(await getBytes(blob), name, options);
	}
	const parts = await getBytes(value);
	name || (name = getName(value));
	if (!options?.type) {
		const type = parts.find((part) => typeof part === "object" && "type" in part && part.type);
		if (typeof type === "string") options = {
			...options,
			type
		};
	}
	return makeFile(parts, name, options);
}
async function getBytes(value) {
	let parts = [];
	if (typeof value === "string" || ArrayBuffer.isView(value) || value instanceof ArrayBuffer) parts.push(value);
	else if (isBlobLike(value)) parts.push(value instanceof Blob ? value : await value.arrayBuffer());
	else if (isAsyncIterable(value)) for await (const chunk of value) parts.push(...await getBytes(chunk));
	else {
		const constructor = value?.constructor?.name;
		throw new Error(`Unexpected data type: ${typeof value}${constructor ? `; constructor: ${constructor}` : ""}${propsForError(value)}`);
	}
	return parts;
}
function propsForError(value) {
	if (typeof value !== "object" || value === null) return "";
	return `; props: [${Object.getOwnPropertyNames(value).map((p) => `"${p}"`).join(", ")}]`;
}
//#endregion
//#region node_modules/openai/core/resource.mjs
var APIResource = class {
	constructor(client) {
		this._client = client;
	}
};
//#endregion
//#region node_modules/openai/internal/utils/path.mjs
/**
* Percent-encode everything that isn't safe to have in a path without encoding safe chars.
*
* Taken from https://datatracker.ietf.org/doc/html/rfc3986#section-3.3:
* > unreserved  = ALPHA / DIGIT / "-" / "." / "_" / "~"
* > sub-delims  = "!" / "$" / "&" / "'" / "(" / ")" / "*" / "+" / "," / ";" / "="
* > pchar       = unreserved / pct-encoded / sub-delims / ":" / "@"
*/
function encodeURIPath(str) {
	return str.replace(/[^A-Za-z0-9\-._~!$&'()*+,;=:@]+/g, encodeURIComponent);
}
var EMPTY = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.create(null));
var createPathTagFunction = (pathEncoder = encodeURIPath) => function path(statics, ...params) {
	if (statics.length === 1) return statics[0];
	let postPath = false;
	const invalidSegments = [];
	const path = statics.reduce((previousValue, currentValue, index) => {
		if (/[?#]/.test(currentValue)) postPath = true;
		const value = params[index];
		let encoded = (postPath ? encodeURIComponent : pathEncoder)("" + value);
		if (index !== params.length && (value == null || typeof value === "object" && value.toString === Object.getPrototypeOf(Object.getPrototypeOf(value.hasOwnProperty ?? EMPTY) ?? EMPTY)?.toString)) {
			encoded = value + "";
			invalidSegments.push({
				start: previousValue.length + currentValue.length,
				length: encoded.length,
				error: `Value of type ${Object.prototype.toString.call(value).slice(8, -1)} is not a valid path parameter`
			});
		}
		return previousValue + currentValue + (index === params.length ? "" : encoded);
	}, "");
	const pathOnly = path.split(/[?#]/, 1)[0];
	const invalidSegmentPattern = /(?<=^|\/)(?:\.|%2e){1,2}(?=\/|$)/gi;
	let match;
	while ((match = invalidSegmentPattern.exec(pathOnly)) !== null) invalidSegments.push({
		start: match.index,
		length: match[0].length,
		error: `Value "${match[0]}" can\'t be safely passed as a path parameter`
	});
	invalidSegments.sort((a, b) => a.start - b.start);
	if (invalidSegments.length > 0) {
		let lastEnd = 0;
		const underline = invalidSegments.reduce((acc, segment) => {
			const spaces = " ".repeat(segment.start - lastEnd);
			const arrows = "^".repeat(segment.length);
			lastEnd = segment.start + segment.length;
			return acc + spaces + arrows;
		}, "");
		throw new OpenAIError(`Path parameters result in path with invalid segments:\n${invalidSegments.map((e) => e.error).join("\n")}\n${path}\n${underline}`);
	}
	return path;
};
/**
* URI-encodes path params and ensures no unsafe /./ or /../ path segments are introduced.
*/
var path = /* @__PURE__ */ createPathTagFunction(encodeURIPath);
//#endregion
//#region node_modules/openai/resources/chat/completions/messages.mjs
/**
* Given a list of messages comprising a conversation, the model will return a response.
*/
var Messages$1 = class extends APIResource {
	/**
	* Get the messages in a stored chat completion. Only Chat Completions that have
	* been created with the `store` parameter set to `true` will be returned.
	*
	* @example
	* ```ts
	* // Automatically fetches more pages as needed.
	* for await (const chatCompletionStoreMessage of client.chat.completions.messages.list(
	*   'completion_id',
	* )) {
	*   // ...
	* }
	* ```
	*/
	list(completionID, query = {}, options) {
		return this._client.getAPIList(path`/chat/completions/${completionID}/messages`, CursorPage, {
			query,
			...options,
			__security: { bearerAuth: true }
		});
	}
};
//#endregion
//#region node_modules/openai/lib/parser.mjs
function isChatCompletionFunctionTool(tool) {
	return tool !== void 0 && "function" in tool && tool.function !== void 0;
}
function makeParseableResponseFormat$1(response_format, parser) {
	const obj = { ...response_format };
	Object.defineProperties(obj, {
		$brand: {
			value: "auto-parseable-response-format",
			enumerable: false
		},
		$parseRaw: {
			value: parser,
			enumerable: false
		}
	});
	return obj;
}
function isAutoParsableResponseFormat(response_format) {
	return response_format?.["$brand"] === "auto-parseable-response-format";
}
function isAutoParsableTool$1(tool) {
	return tool?.["$brand"] === "auto-parseable-tool";
}
function maybeParseChatCompletion(completion, params) {
	if (!params || !hasAutoParseableInput$1(params)) return {
		...completion,
		choices: completion.choices.map((choice) => {
			assertToolCallsAreChatCompletionFunctionToolCalls(choice.message.tool_calls);
			return {
				...choice,
				message: {
					...choice.message,
					parsed: null,
					...choice.message.tool_calls ? { tool_calls: choice.message.tool_calls } : void 0
				}
			};
		})
	};
	return parseChatCompletion(completion, params);
}
function parseChatCompletion(completion, params) {
	const choices = completion.choices.map((choice) => {
		if (choice.finish_reason === "length") throw new LengthFinishReasonError();
		if (choice.finish_reason === "content_filter") throw new ContentFilterFinishReasonError();
		assertToolCallsAreChatCompletionFunctionToolCalls(choice.message.tool_calls);
		return {
			...choice,
			message: {
				...choice.message,
				...choice.message.tool_calls ? { tool_calls: choice.message.tool_calls?.map((toolCall) => parseToolCall$1(params, toolCall)) ?? void 0 } : void 0,
				parsed: choice.message.content && !choice.message.refusal ? parseResponseFormat(params, choice.message.content) : null
			}
		};
	});
	return {
		...completion,
		choices
	};
}
function parseResponseFormat(params, content) {
	if (params.response_format?.type !== "json_schema") return null;
	if (params.response_format?.type === "json_schema") {
		if ("$parseRaw" in params.response_format) return params.response_format.$parseRaw(content);
		return JSON.parse(content);
	}
	return null;
}
function parseToolCall$1(params, toolCall) {
	const inputTool = params.tools?.find((inputTool) => isChatCompletionFunctionTool(inputTool) && inputTool.function?.name === toolCall.function.name);
	return {
		...toolCall,
		function: {
			...toolCall.function,
			parsed_arguments: isAutoParsableTool$1(inputTool) ? inputTool.$parseRaw(toolCall.function.arguments) : inputTool?.function.strict ? JSON.parse(toolCall.function.arguments) : null
		}
	};
}
function shouldParseToolCall(params, toolCall) {
	if (!params || !("tools" in params) || !params.tools) return false;
	const inputTool = params.tools?.find((inputTool) => isChatCompletionFunctionTool(inputTool) && inputTool.function?.name === toolCall.function.name);
	return isChatCompletionFunctionTool(inputTool) && (isAutoParsableTool$1(inputTool) || inputTool?.function.strict || false);
}
function hasAutoParseableInput$1(params) {
	if (isAutoParsableResponseFormat(params.response_format)) return true;
	return params.tools?.some((t) => isAutoParsableTool$1(t) || t.type === "function" && t.function.strict === true) ?? false;
}
function assertToolCallsAreChatCompletionFunctionToolCalls(toolCalls) {
	for (const toolCall of toolCalls || []) if (toolCall.type !== "function") throw new OpenAIError(`Currently only \`function\` tool calls are supported; Received \`${toolCall.type}\``);
}
function validateInputTools(tools) {
	for (const tool of tools ?? []) {
		if (tool.type !== "function") throw new OpenAIError(`Currently only \`function\` tool types support auto-parsing; Received \`${tool.type}\``);
		if (tool.function.strict !== true) throw new OpenAIError(`The \`${tool.function.name}\` tool is not marked with \`strict: true\`. Only strict function tools can be auto-parsed`);
	}
}
//#endregion
//#region node_modules/openai/lib/chatCompletionUtils.mjs
var isAssistantMessage = (message) => {
	return message?.role === "assistant";
};
var isToolMessage = (message) => {
	return message?.role === "tool";
};
//#endregion
//#region node_modules/openai/lib/EventStream.mjs
var _EventStream_instances;
var _EventStream_connectedPromise;
var _EventStream_resolveConnectedPromise;
var _EventStream_rejectConnectedPromise;
var _EventStream_endPromise;
var _EventStream_resolveEndPromise;
var _EventStream_rejectEndPromise;
var _EventStream_listeners;
var _EventStream_abortListeners;
var _EventStream_ended;
var _EventStream_errored;
var _EventStream_aborted;
var _EventStream_catchingPromiseCreated;
var _EventStream_removeAbortListeners;
var _EventStream_handleError;
var EventStream = class {
	constructor() {
		_EventStream_instances.add(this);
		this.controller = new AbortController();
		_EventStream_connectedPromise.set(this, void 0);
		_EventStream_resolveConnectedPromise.set(this, () => {});
		_EventStream_rejectConnectedPromise.set(this, () => {});
		_EventStream_endPromise.set(this, void 0);
		_EventStream_resolveEndPromise.set(this, () => {});
		_EventStream_rejectEndPromise.set(this, () => {});
		_EventStream_listeners.set(this, {});
		_EventStream_abortListeners.set(this, []);
		_EventStream_ended.set(this, false);
		_EventStream_errored.set(this, false);
		_EventStream_aborted.set(this, false);
		_EventStream_catchingPromiseCreated.set(this, false);
		__classPrivateFieldSet(this, _EventStream_connectedPromise, new Promise((resolve, reject) => {
			__classPrivateFieldSet(this, _EventStream_resolveConnectedPromise, resolve, "f");
			__classPrivateFieldSet(this, _EventStream_rejectConnectedPromise, reject, "f");
		}), "f");
		__classPrivateFieldSet(this, _EventStream_endPromise, new Promise((resolve, reject) => {
			__classPrivateFieldSet(this, _EventStream_resolveEndPromise, resolve, "f");
			__classPrivateFieldSet(this, _EventStream_rejectEndPromise, reject, "f");
		}), "f");
		__classPrivateFieldGet(this, _EventStream_connectedPromise, "f").catch(() => {});
		__classPrivateFieldGet(this, _EventStream_endPromise, "f").catch(() => {});
	}
	_run(executor) {
		setTimeout(() => {
			Promise.resolve().then(executor).then(() => {
				try {
					this._emitFinal();
				} catch (error) {
					__classPrivateFieldGet(this, _EventStream_instances, "m", _EventStream_handleError).call(this, error);
					return;
				}
				this._emit("end");
			}, __classPrivateFieldGet(this, _EventStream_instances, "m", _EventStream_handleError).bind(this));
		}, 0);
	}
	_connected() {
		if (this.ended) return;
		__classPrivateFieldGet(this, _EventStream_resolveConnectedPromise, "f").call(this);
		this._emit("connect");
	}
	get ended() {
		return __classPrivateFieldGet(this, _EventStream_ended, "f");
	}
	get errored() {
		return __classPrivateFieldGet(this, _EventStream_errored, "f");
	}
	get aborted() {
		return __classPrivateFieldGet(this, _EventStream_aborted, "f");
	}
	abort() {
		this.controller.abort();
	}
	_listenForAbort(signal) {
		if (!signal || this.ended) return;
		if (signal.aborted) {
			this.controller.abort();
			return;
		}
		const listener = () => this.controller.abort();
		signal.addEventListener("abort", listener, { once: true });
		__classPrivateFieldGet(this, _EventStream_abortListeners, "f").push({
			signal,
			listener
		});
	}
	/**
	* Adds the listener function to the end of the listeners array for the event.
	* No checks are made to see if the listener has already been added. Multiple calls passing
	* the same combination of event and listener will result in the listener being added, and
	* called, multiple times.
	* @returns this ChatCompletionStream, so that calls can be chained
	*/
	on(event, listener) {
		(__classPrivateFieldGet(this, _EventStream_listeners, "f")[event] || (__classPrivateFieldGet(this, _EventStream_listeners, "f")[event] = [])).push({ listener });
		return this;
	}
	/**
	* Removes the specified listener from the listener array for the event.
	* off() will remove, at most, one instance of a listener from the listener array. If any single
	* listener has been added multiple times to the listener array for the specified event, then
	* off() must be called multiple times to remove each instance.
	* @returns this ChatCompletionStream, so that calls can be chained
	*/
	off(event, listener) {
		const listeners = __classPrivateFieldGet(this, _EventStream_listeners, "f")[event];
		if (!listeners) return this;
		const index = listeners.findIndex((l) => l.listener === listener);
		if (index >= 0) listeners.splice(index, 1);
		return this;
	}
	/**
	* Adds a one-time listener function for the event. The next time the event is triggered,
	* this listener is removed and then invoked.
	* @returns this ChatCompletionStream, so that calls can be chained
	*/
	once(event, listener) {
		(__classPrivateFieldGet(this, _EventStream_listeners, "f")[event] || (__classPrivateFieldGet(this, _EventStream_listeners, "f")[event] = [])).push({
			listener,
			once: true
		});
		return this;
	}
	/**
	* This is similar to `.once()`, but returns a Promise that resolves the next time
	* the event is triggered, instead of calling a listener callback.
	* @returns a Promise that resolves the next time given event is triggered,
	* or rejects if an error is emitted.  (If you request the 'error' event,
	* returns a promise that resolves with the error).
	*
	* Example:
	*
	*   const message = await stream.emitted('message') // rejects if the stream errors
	*/
	emitted(event) {
		return new Promise((resolve, reject) => {
			__classPrivateFieldSet(this, _EventStream_catchingPromiseCreated, true, "f");
			if (event !== "error") this.once("error", reject);
			this.once(event, resolve);
		});
	}
	/**
	* Returns an async iterator that yields every time the event is triggered.
	* The iterator ends when the stream ends and rejects if the stream errors
	* or is aborted. If you request the 'error' or 'abort' event, the iterator
	* yields that event instead of rejecting.
	*
	* Example:
	*
	*   for await (const [message] of stream.events('message')) {
	*     await processMessage(message);
	*   }
	*/
	events(event) {
		const pushQueue = [];
		const readQueue = [];
		let ended = this.ended;
		let failure;
		let failureDelivered = false;
		const doneResult = () => ({
			value: void 0,
			done: true
		});
		const finishReaders = () => {
			while (readQueue.length) readQueue.shift().resolve(doneResult());
		};
		const rejectReader = () => {
			if (!failure || failureDelivered || !readQueue.length) return;
			failureDelivered = true;
			readQueue.shift().reject(failure);
		};
		const cleanup = () => {
			this.off(event, onEvent);
			this.off("end", onEnd);
			if (event !== "error") this.off("error", onFailure);
			if (event !== "abort") this.off("abort", onFailure);
		};
		const onEvent = (...args) => {
			if (ended) return;
			const reader = readQueue.shift();
			if (reader) reader.resolve({
				value: args,
				done: false
			});
			else pushQueue.push(args);
		};
		const onFailure = (error) => {
			failure = error;
			if (!pushQueue.length) rejectReader();
		};
		const onEnd = () => {
			ended = true;
			cleanup();
			if (!pushQueue.length) {
				rejectReader();
				finishReaders();
			}
		};
		if (!ended) {
			this.on(event, onEvent);
			this.on("end", onEnd);
			if (event !== "error") this.on("error", onFailure);
			if (event !== "abort") this.on("abort", onFailure);
		}
		return {
			next: () => {
				const value = pushQueue.shift();
				if (value) return Promise.resolve({
					value,
					done: false
				});
				if (failure && !failureDelivered) {
					failureDelivered = true;
					return Promise.reject(failure);
				}
				if (ended) return Promise.resolve(doneResult());
				return new Promise((resolve, reject) => {
					readQueue.push({
						resolve,
						reject
					});
				});
			},
			return: () => {
				ended = true;
				pushQueue.length = 0;
				cleanup();
				finishReaders();
				return Promise.resolve(doneResult());
			},
			[Symbol.asyncIterator]() {
				return this;
			}
		};
	}
	async done() {
		__classPrivateFieldSet(this, _EventStream_catchingPromiseCreated, true, "f");
		await __classPrivateFieldGet(this, _EventStream_endPromise, "f");
	}
	_emit(event, ...args) {
		if (__classPrivateFieldGet(this, _EventStream_ended, "f")) return;
		if (event === "end") {
			__classPrivateFieldGet(this, _EventStream_instances, "m", _EventStream_removeAbortListeners).call(this);
			__classPrivateFieldSet(this, _EventStream_ended, true, "f");
			__classPrivateFieldGet(this, _EventStream_resolveEndPromise, "f").call(this);
		}
		const listeners = __classPrivateFieldGet(this, _EventStream_listeners, "f")[event];
		if (listeners) {
			__classPrivateFieldGet(this, _EventStream_listeners, "f")[event] = listeners.filter((l) => !l.once);
			listeners.forEach(({ listener }) => listener(...args));
		}
		if (event === "abort") {
			const error = args[0];
			if (!__classPrivateFieldGet(this, _EventStream_catchingPromiseCreated, "f") && !listeners?.length) Promise.reject(error);
			__classPrivateFieldGet(this, _EventStream_rejectConnectedPromise, "f").call(this, error);
			__classPrivateFieldGet(this, _EventStream_rejectEndPromise, "f").call(this, error);
			this._emit("end");
			return;
		}
		if (event === "error") {
			const error = args[0];
			if (!__classPrivateFieldGet(this, _EventStream_catchingPromiseCreated, "f") && !listeners?.length) Promise.reject(error);
			__classPrivateFieldGet(this, _EventStream_rejectConnectedPromise, "f").call(this, error);
			__classPrivateFieldGet(this, _EventStream_rejectEndPromise, "f").call(this, error);
			this._emit("end");
		}
	}
	_emitFinal() {}
};
_EventStream_connectedPromise = /* @__PURE__ */ new WeakMap(), _EventStream_resolveConnectedPromise = /* @__PURE__ */ new WeakMap(), _EventStream_rejectConnectedPromise = /* @__PURE__ */ new WeakMap(), _EventStream_endPromise = /* @__PURE__ */ new WeakMap(), _EventStream_resolveEndPromise = /* @__PURE__ */ new WeakMap(), _EventStream_rejectEndPromise = /* @__PURE__ */ new WeakMap(), _EventStream_listeners = /* @__PURE__ */ new WeakMap(), _EventStream_abortListeners = /* @__PURE__ */ new WeakMap(), _EventStream_ended = /* @__PURE__ */ new WeakMap(), _EventStream_errored = /* @__PURE__ */ new WeakMap(), _EventStream_aborted = /* @__PURE__ */ new WeakMap(), _EventStream_catchingPromiseCreated = /* @__PURE__ */ new WeakMap(), _EventStream_instances = /* @__PURE__ */ new WeakSet(), _EventStream_removeAbortListeners = function _EventStream_removeAbortListeners() {
	for (const { signal, listener } of __classPrivateFieldGet(this, _EventStream_abortListeners, "f").splice(0)) signal.removeEventListener("abort", listener);
}, _EventStream_handleError = function _EventStream_handleError(error) {
	__classPrivateFieldSet(this, _EventStream_errored, true, "f");
	if (error instanceof Error && error.name === "AbortError") error = new APIUserAbortError();
	if (error instanceof APIUserAbortError) {
		__classPrivateFieldSet(this, _EventStream_aborted, true, "f");
		return this._emit("abort", error);
	}
	if (error instanceof OpenAIError) return this._emit("error", error);
	if (error instanceof Error) {
		const openAIError = new OpenAIError(error.message);
		openAIError.cause = error;
		return this._emit("error", openAIError);
	}
	return this._emit("error", new OpenAIError(String(error)));
};
//#endregion
//#region node_modules/openai/lib/RunnableFunction.mjs
function isRunnableFunctionWithParse(fn) {
	return typeof fn.parse === "function";
}
//#endregion
//#region node_modules/openai/lib/AbstractChatCompletionRunner.mjs
var _AbstractChatCompletionRunner_instances;
var _AbstractChatCompletionRunner_getFinalContent;
var _AbstractChatCompletionRunner_getFinalMessage;
var _AbstractChatCompletionRunner_getFinalFunctionToolCall;
var _AbstractChatCompletionRunner_getFinalFunctionToolCallResult;
var _AbstractChatCompletionRunner_calculateTotalUsage;
var _AbstractChatCompletionRunner_validateParams;
var _AbstractChatCompletionRunner_stringifyFunctionCallResult;
var DEFAULT_MAX_CHAT_COMPLETIONS = 10;
function normalizeToolCallIds(chatCompletion) {
	for (const choice of chatCompletion.choices) for (const toolCall of choice.message.tool_calls ?? []) if (!toolCall.id) toolCall.id = `call_${uuid4()}`;
}
/**
* Parsed completions contain response-only and helper-only fields. Keep those
* on runner.messages for callers, but only replay valid request fields.
*/
function toRequestMessage(message) {
	if (!isAssistantMessage(message)) return message;
	const requestMessage = { role: "assistant" };
	if (message.audio != null) requestMessage.audio = { id: message.audio.id };
	if (message.content !== void 0) requestMessage.content = message.content;
	if (message.function_call != null) requestMessage.function_call = message.function_call;
	if (message.name !== void 0) requestMessage.name = message.name;
	if (message.refusal != null) requestMessage.refusal = message.refusal;
	if (message.tool_calls !== void 0) requestMessage.tool_calls = message.tool_calls.map((toolCall) => {
		if (toolCall.type === "custom") return {
			id: toolCall.id,
			type: toolCall.type,
			custom: {
				input: toolCall.custom.input,
				name: toolCall.custom.name
			}
		};
		return {
			id: toolCall.id,
			type: toolCall.type,
			function: {
				arguments: toolCall.function.arguments,
				name: toolCall.function.name
			}
		};
	});
	return requestMessage;
}
var AbstractChatCompletionRunner = class extends EventStream {
	constructor() {
		super(...arguments);
		_AbstractChatCompletionRunner_instances.add(this);
		this._chatCompletions = [];
		this.messages = [];
	}
	_addChatCompletion(chatCompletion) {
		normalizeToolCallIds(chatCompletion);
		this._chatCompletions.push(chatCompletion);
		this._emit("chatCompletion", chatCompletion);
		const message = chatCompletion.choices[0]?.message;
		if (message) this._addMessage(message);
		return chatCompletion;
	}
	_addMessage(message, emit = true) {
		if (!("content" in message)) message.content = null;
		this.messages.push(message);
		if (emit) {
			this._emit("message", message);
			if (isToolMessage(message) && message.content) this._emit("functionToolCallResult", message.content);
			else if (isAssistantMessage(message) && message.tool_calls) {
				for (const tool_call of message.tool_calls) if (tool_call.type === "function") this._emit("functionToolCall", tool_call.function);
			}
		}
	}
	/**
	* @returns a promise that resolves with the final ChatCompletion, or rejects
	* if an error occurred or the stream ended prematurely without producing a ChatCompletion.
	*/
	async finalChatCompletion() {
		await this.done();
		const completion = this._chatCompletions[this._chatCompletions.length - 1];
		if (!completion) throw new OpenAIError("stream ended without producing a ChatCompletion");
		return completion;
	}
	/**
	* @returns a promise that resolves with the content of the final ChatCompletionMessage, or rejects
	* if an error occurred or the stream ended prematurely without producing a ChatCompletionMessage.
	*/
	async finalContent() {
		await this.done();
		return __classPrivateFieldGet(this, _AbstractChatCompletionRunner_instances, "m", _AbstractChatCompletionRunner_getFinalContent).call(this);
	}
	/**
	* @returns a promise that resolves with the final assistant ChatCompletionMessage response,
	* or rejects if an error occurred or the stream ended prematurely without producing a ChatCompletionMessage.
	*/
	async finalMessage() {
		await this.done();
		return __classPrivateFieldGet(this, _AbstractChatCompletionRunner_instances, "m", _AbstractChatCompletionRunner_getFinalMessage).call(this);
	}
	/**
	* @returns a promise that resolves with the content of the final FunctionCall, or rejects
	* if an error occurred or the stream ended prematurely without producing a ChatCompletionMessage.
	*/
	async finalFunctionToolCall() {
		await this.done();
		return __classPrivateFieldGet(this, _AbstractChatCompletionRunner_instances, "m", _AbstractChatCompletionRunner_getFinalFunctionToolCall).call(this);
	}
	async finalFunctionToolCallResult() {
		await this.done();
		return __classPrivateFieldGet(this, _AbstractChatCompletionRunner_instances, "m", _AbstractChatCompletionRunner_getFinalFunctionToolCallResult).call(this);
	}
	async totalUsage() {
		await this.done();
		return __classPrivateFieldGet(this, _AbstractChatCompletionRunner_instances, "m", _AbstractChatCompletionRunner_calculateTotalUsage).call(this);
	}
	allChatCompletions() {
		return [...this._chatCompletions];
	}
	_emitFinal() {
		const completion = this._chatCompletions[this._chatCompletions.length - 1];
		if (completion) this._emit("finalChatCompletion", completion);
		const finalMessage = __classPrivateFieldGet(this, _AbstractChatCompletionRunner_instances, "m", _AbstractChatCompletionRunner_getFinalMessage).call(this);
		if (finalMessage) this._emit("finalMessage", finalMessage);
		const finalContent = __classPrivateFieldGet(this, _AbstractChatCompletionRunner_instances, "m", _AbstractChatCompletionRunner_getFinalContent).call(this);
		if (finalContent) this._emit("finalContent", finalContent);
		const finalFunctionCall = __classPrivateFieldGet(this, _AbstractChatCompletionRunner_instances, "m", _AbstractChatCompletionRunner_getFinalFunctionToolCall).call(this);
		if (finalFunctionCall) this._emit("finalFunctionToolCall", finalFunctionCall);
		const finalFunctionCallResult = __classPrivateFieldGet(this, _AbstractChatCompletionRunner_instances, "m", _AbstractChatCompletionRunner_getFinalFunctionToolCallResult).call(this);
		if (finalFunctionCallResult != null) this._emit("finalFunctionToolCallResult", finalFunctionCallResult);
		if (this._chatCompletions.some((c) => c.usage)) this._emit("totalUsage", __classPrivateFieldGet(this, _AbstractChatCompletionRunner_instances, "m", _AbstractChatCompletionRunner_calculateTotalUsage).call(this));
	}
	async _createChatCompletion(client, params, options) {
		this._listenForAbort(options?.signal);
		__classPrivateFieldGet(this, _AbstractChatCompletionRunner_instances, "m", _AbstractChatCompletionRunner_validateParams).call(this, params);
		const chatCompletion = await client.chat.completions.create({
			...params,
			stream: false
		}, {
			...options,
			signal: this.controller.signal
		});
		this._connected();
		return this._addChatCompletion(parseChatCompletion(chatCompletion, params));
	}
	async _runChatCompletion(client, params, options) {
		for (const message of params.messages) this._addMessage(message, false);
		return await this._createChatCompletion(client, params, options);
	}
	async _runTools(client, params, runner, options) {
		const role = "tool";
		const { tool_choice = "auto", stream, toolContext: inputToolContext, ...restParams } = params;
		const toolContext = inputToolContext;
		const singleFunctionToCall = typeof tool_choice !== "string" && tool_choice.type === "function" && tool_choice?.function?.name;
		const { maxChatCompletions = DEFAULT_MAX_CHAT_COMPLETIONS, afterCompletion } = options || {};
		const inputTools = params.tools.map((tool) => {
			if (isAutoParsableTool$1(tool)) {
				if (!tool.$callback) throw new OpenAIError("Tool given to `.runTools()` that does not have an associated function");
				return {
					type: "function",
					function: {
						function: tool.$callback,
						name: tool.function.name,
						description: tool.function.description || "",
						parameters: tool.function.parameters,
						parse: tool.$parseRaw,
						strict: true
					}
				};
			}
			return tool;
		});
		const functionsByName = {};
		for (const f of inputTools) if (f.type === "function") functionsByName[f.function.name || f.function.function.name] = f.function;
		const tools = "tools" in params ? inputTools.map((t) => t.type === "function" ? {
			type: "function",
			function: {
				name: t.function.name || t.function.function.name,
				parameters: t.function.parameters,
				description: t.function.description,
				strict: t.function.strict
			}
		} : t) : void 0;
		for (const message of params.messages) this._addMessage(message, false);
		const runToolCall = async (toolCall) => {
			if (toolCall.type !== "function") return {
				message: void 0,
				functionCalled: false
			};
			const tool_call_id = toolCall.id;
			const { name, arguments: args } = toolCall.function;
			const fn = functionsByName[name];
			if (!fn) {
				const content = `Invalid tool_call: ${JSON.stringify(name)}. Available options are: ${Object.keys(functionsByName).map((name) => JSON.stringify(name)).join(", ")}. Please try again`;
				return {
					message: {
						role,
						tool_call_id,
						content
					},
					functionCalled: false
				};
			}
			if (singleFunctionToCall && singleFunctionToCall !== name) {
				const content = `Invalid tool_call: ${JSON.stringify(name)}. ${JSON.stringify(singleFunctionToCall)} requested. Please try again`;
				return {
					message: {
						role,
						tool_call_id,
						content
					},
					functionCalled: false
				};
			}
			let rawContent;
			if (isRunnableFunctionWithParse(fn)) {
				let parsed;
				try {
					parsed = await fn.parse(args);
				} catch (error) {
					const content = error instanceof Error ? error.message : String(error);
					return {
						message: {
							role,
							tool_call_id,
							content
						},
						functionCalled: false
					};
				}
				rawContent = await fn.function(parsed, runner, toolContext);
			} else rawContent = await fn.function(args, runner, toolContext);
			const content = __classPrivateFieldGet(this, _AbstractChatCompletionRunner_instances, "m", _AbstractChatCompletionRunner_stringifyFunctionCallResult).call(this, rawContent);
			return {
				message: {
					role,
					tool_call_id,
					content
				},
				functionCalled: true
			};
		};
		for (let i = 0; i < maxChatCompletions; ++i) {
			const chatCompletion = await this._createChatCompletion(client, {
				...restParams,
				tool_choice,
				tools,
				messages: this.messages.map(toRequestMessage)
			}, options);
			const message = chatCompletion.choices[0]?.message;
			if (!message) throw new OpenAIError(`missing message in ChatCompletion response`);
			if (!message.tool_calls?.length) {
				await afterCompletion?.(chatCompletion, runner);
				return;
			}
			if (singleFunctionToCall || params.parallel_tool_calls === false) for (const toolCall of message.tool_calls) {
				const result = await runToolCall(toolCall);
				if (result.message) this._addMessage(result.message);
				if (singleFunctionToCall && result.functionCalled) {
					await afterCompletion?.(chatCompletion, runner);
					return;
				}
			}
			else {
				const results = await Promise.allSettled(message.tool_calls.map(runToolCall));
				for (const result of results) if (result.status === "rejected") throw result.reason;
				for (const result of results) if (result.status === "fulfilled" && result.value.message) this._addMessage(result.value.message);
			}
			await afterCompletion?.(chatCompletion, runner);
		}
	}
};
_AbstractChatCompletionRunner_instances = /* @__PURE__ */ new WeakSet(), _AbstractChatCompletionRunner_getFinalContent = function _AbstractChatCompletionRunner_getFinalContent() {
	return __classPrivateFieldGet(this, _AbstractChatCompletionRunner_instances, "m", _AbstractChatCompletionRunner_getFinalMessage).call(this).content ?? null;
}, _AbstractChatCompletionRunner_getFinalMessage = function _AbstractChatCompletionRunner_getFinalMessage() {
	let i = this.messages.length;
	while (i-- > 0) {
		const message = this.messages[i];
		if (isAssistantMessage(message)) return {
			...message,
			content: message.content ?? null,
			refusal: message.refusal ?? null
		};
	}
	throw new OpenAIError("stream ended without producing a ChatCompletionMessage with role=assistant");
}, _AbstractChatCompletionRunner_getFinalFunctionToolCall = function _AbstractChatCompletionRunner_getFinalFunctionToolCall() {
	for (let i = this.messages.length - 1; i >= 0; i--) {
		const message = this.messages[i];
		if (isAssistantMessage(message) && message?.tool_calls?.length) for (let j = message.tool_calls.length - 1; j >= 0; j--) {
			const toolCall = message.tool_calls[j];
			if (toolCall?.type === "function") return toolCall.function;
		}
	}
}, _AbstractChatCompletionRunner_getFinalFunctionToolCallResult = function _AbstractChatCompletionRunner_getFinalFunctionToolCallResult() {
	for (let i = this.messages.length - 1; i >= 0; i--) {
		const message = this.messages[i];
		if (isToolMessage(message) && message.content != null && typeof message.content === "string" && this.messages.some((x) => x.role === "assistant" && x.tool_calls?.some((y) => y.type === "function" && y.id === message.tool_call_id))) return message.content;
	}
}, _AbstractChatCompletionRunner_calculateTotalUsage = function _AbstractChatCompletionRunner_calculateTotalUsage() {
	const total = {
		completion_tokens: 0,
		prompt_tokens: 0,
		total_tokens: 0
	};
	for (const { usage } of this._chatCompletions) if (usage) {
		total.completion_tokens += usage.completion_tokens;
		total.prompt_tokens += usage.prompt_tokens;
		total.total_tokens += usage.total_tokens;
	}
	return total;
}, _AbstractChatCompletionRunner_validateParams = function _AbstractChatCompletionRunner_validateParams(params) {
	if (params.n != null && params.n > 1) throw new OpenAIError("ChatCompletion convenience helpers only support n=1 at this time. To use n>1, please use chat.completions.create() directly.");
}, _AbstractChatCompletionRunner_stringifyFunctionCallResult = function _AbstractChatCompletionRunner_stringifyFunctionCallResult(rawContent) {
	return typeof rawContent === "string" ? rawContent : rawContent === void 0 ? "undefined" : JSON.stringify(rawContent);
};
//#endregion
//#region node_modules/openai/lib/ChatCompletionRunner.mjs
var ChatCompletionRunner = class ChatCompletionRunner extends AbstractChatCompletionRunner {
	static runTools(client, params, options) {
		const runner = new ChatCompletionRunner();
		const opts = {
			...options,
			headers: {
				...options?.headers,
				"X-Stainless-Helper-Method": "runTools"
			}
		};
		runner._run(() => runner._runTools(client, params, runner, opts));
		return runner;
	}
	_addMessage(message, emit = true) {
		super._addMessage(message, emit);
		if (isAssistantMessage(message) && message.content) this._emit("content", message.content);
	}
};
//#endregion
//#region node_modules/openai/_vendor/partial-json-parser/parser.mjs
var Allow = {
	STR: 1,
	NUM: 2,
	ARR: 4,
	OBJ: 8,
	NULL: 16,
	BOOL: 32,
	NAN: 64,
	INFINITY: 128,
	MINUS_INFINITY: 256,
	INF: 384,
	SPECIAL: 496,
	ATOM: 499,
	COLLECTION: 12,
	ALL: 511
};
var PartialJSON = class extends Error {};
var MalformedJSON = class extends Error {};
/**
* Parse incomplete JSON
* @param {string} jsonString Partial JSON to be parsed
* @param {number} allowPartial Specify what types are allowed to be partial, see {@link Allow} for details
* @returns The parsed JSON
* @throws {PartialJSON} If the JSON is incomplete (related to the `allow` parameter)
* @throws {MalformedJSON} If the JSON is malformed
*/
function parseJSON(jsonString, allowPartial = Allow.ALL) {
	if (typeof jsonString !== "string") throw new TypeError(`expecting str, got ${typeof jsonString}`);
	if (!jsonString.trim()) throw new Error(`${jsonString} is empty`);
	return _parseJSON(jsonString.trim(), allowPartial);
}
var _parseJSON = (jsonString, allow) => {
	const length = jsonString.length;
	let index = 0;
	const markPartialJSON = (msg) => {
		throw new PartialJSON(`${msg} at position ${index}`);
	};
	const throwMalformedError = (msg) => {
		throw new MalformedJSON(`${msg} at position ${index}`);
	};
	const parseAny = () => {
		skipBlank();
		if (index >= length) markPartialJSON("Unexpected end of input");
		if (jsonString[index] === "\"") return parseStr();
		if (jsonString[index] === "{") return parseObj();
		if (jsonString[index] === "[") return parseArr();
		if (jsonString.substring(index, index + 4) === "null" || Allow.NULL & allow && length - index < 4 && "null".startsWith(jsonString.substring(index))) {
			index += 4;
			return null;
		}
		if (jsonString.substring(index, index + 4) === "true" || Allow.BOOL & allow && length - index < 4 && "true".startsWith(jsonString.substring(index))) {
			index += 4;
			return true;
		}
		if (jsonString.substring(index, index + 5) === "false" || Allow.BOOL & allow && length - index < 5 && "false".startsWith(jsonString.substring(index))) {
			index += 5;
			return false;
		}
		if (jsonString.substring(index, index + 8) === "Infinity" || Allow.INFINITY & allow && length - index < 8 && "Infinity".startsWith(jsonString.substring(index))) {
			index += 8;
			return Infinity;
		}
		if (jsonString.substring(index, index + 9) === "-Infinity" || Allow.MINUS_INFINITY & allow && 1 < length - index && length - index < 9 && "-Infinity".startsWith(jsonString.substring(index))) {
			index += 9;
			return -Infinity;
		}
		if (jsonString.substring(index, index + 3) === "NaN" || Allow.NAN & allow && length - index < 3 && "NaN".startsWith(jsonString.substring(index))) {
			index += 3;
			return NaN;
		}
		return parseNum();
	};
	const parseStr = () => {
		const start = index;
		let escape = false;
		index++;
		while (index < length && (jsonString[index] !== "\"" || escape && jsonString[index - 1] === "\\")) {
			escape = jsonString[index] === "\\" ? !escape : false;
			index++;
		}
		if (jsonString.charAt(index) == "\"") try {
			return JSON.parse(jsonString.substring(start, ++index - Number(escape)));
		} catch (e) {
			throwMalformedError(String(e));
		}
		else if (Allow.STR & allow) try {
			return JSON.parse(jsonString.substring(start, index - Number(escape)) + "\"");
		} catch (e) {
			return JSON.parse(jsonString.substring(start, jsonString.lastIndexOf("\\")) + "\"");
		}
		markPartialJSON("Unterminated string literal");
	};
	const parseObj = () => {
		index++;
		skipBlank();
		const obj = {};
		try {
			while (jsonString[index] !== "}") {
				skipBlank();
				if (index >= length && Allow.OBJ & allow) return obj;
				const key = parseStr();
				skipBlank();
				index++;
				try {
					const value = parseAny();
					Object.defineProperty(obj, key, {
						value,
						writable: true,
						enumerable: true,
						configurable: true
					});
				} catch (e) {
					if (Allow.OBJ & allow) return obj;
					else throw e;
				}
				skipBlank();
				if (jsonString[index] === ",") index++;
			}
		} catch (e) {
			if (Allow.OBJ & allow) return obj;
			else markPartialJSON("Expected '}' at end of object");
		}
		index++;
		return obj;
	};
	const parseArr = () => {
		index++;
		const arr = [];
		try {
			while (jsonString[index] !== "]") {
				arr.push(parseAny());
				skipBlank();
				if (jsonString[index] === ",") index++;
			}
		} catch (e) {
			if (Allow.ARR & allow) return arr;
			markPartialJSON("Expected ']' at end of array");
		}
		index++;
		return arr;
	};
	const parseNum = () => {
		if (index === 0) {
			if (jsonString === "-" && Allow.NUM & allow) markPartialJSON("Not sure what '-' is");
			try {
				return JSON.parse(jsonString);
			} catch (e) {
				if (Allow.NUM & allow) try {
					if ("." === jsonString[jsonString.length - 1]) return JSON.parse(jsonString.substring(0, jsonString.lastIndexOf(".")));
					return JSON.parse(jsonString.substring(0, jsonString.lastIndexOf("e")));
				} catch (e) {}
				throwMalformedError(String(e));
			}
		}
		const start = index;
		if (jsonString[index] === "-") index++;
		while (jsonString[index] && !",]}".includes(jsonString[index])) index++;
		if (index == length && !(Allow.NUM & allow)) markPartialJSON("Unterminated number literal");
		try {
			return JSON.parse(jsonString.substring(start, index));
		} catch (e) {
			if (jsonString.substring(start, index) === "-" && Allow.NUM & allow) markPartialJSON("Not sure what '-' is");
			try {
				return JSON.parse(jsonString.substring(start, jsonString.lastIndexOf("e")));
			} catch (e) {
				throwMalformedError(String(e));
			}
		}
	};
	const skipBlank = () => {
		while (index < length && " \n\r	".includes(jsonString[index])) index++;
	};
	return parseAny();
};
var partialParse = (input) => parseJSON(input, Allow.ALL ^ Allow.NUM);
//#endregion
//#region node_modules/openai/lib/ChatCompletionStream.mjs
var _ChatCompletionStream_instances;
var _ChatCompletionStream_params;
var _ChatCompletionStream_audioDoneChoiceIndexes;
var _ChatCompletionStream_choiceEventStates;
var _ChatCompletionStream_currentChatCompletionSnapshot;
var _ChatCompletionStream_beginRequest;
var _ChatCompletionStream_getChoiceEventState;
var _ChatCompletionStream_addChunk;
var _ChatCompletionStream_emitToolCallDoneEvent;
var _ChatCompletionStream_emitContentDoneEvents;
var _ChatCompletionStream_endRequest;
var _ChatCompletionStream_getAutoParseableResponseFormat;
var _ChatCompletionStream_accumulateChatCompletion;
var CHAT_COMPLETION_READABLE_STREAM_MESSAGE_PREFIX = "chat.completion.chunk.message:";
function makeChatCompletionReadableStreamMessageChunk(chunk, message, toolCallIds) {
	const payload = {
		type: "message",
		message,
		...toolCallIds ? { tool_call_ids: toolCallIds } : {}
	};
	return {
		id: chunk.id,
		choices: [],
		created: chunk.created,
		model: chunk.model,
		object: `${CHAT_COMPLETION_READABLE_STREAM_MESSAGE_PREFIX}${JSON.stringify(payload)}`
	};
}
function isChatCompletionReadableStreamMessage(item) {
	return "type" in item && item.type === "message" && "message" in item || "object" in item && typeof item.object === "string" && item.object.startsWith(CHAT_COMPLETION_READABLE_STREAM_MESSAGE_PREFIX);
}
function getChatCompletionReadableStreamMessage(item) {
	if ("type" in item) return item;
	return JSON.parse(item.object.slice(30));
}
var ChatCompletionStream = class ChatCompletionStream extends AbstractChatCompletionRunner {
	constructor(params) {
		super();
		_ChatCompletionStream_instances.add(this);
		_ChatCompletionStream_params.set(this, void 0);
		_ChatCompletionStream_audioDoneChoiceIndexes.set(this, void 0);
		_ChatCompletionStream_choiceEventStates.set(this, void 0);
		_ChatCompletionStream_currentChatCompletionSnapshot.set(this, void 0);
		__classPrivateFieldSet(this, _ChatCompletionStream_params, params, "f");
		__classPrivateFieldSet(this, _ChatCompletionStream_audioDoneChoiceIndexes, /* @__PURE__ */ new Set(), "f");
		__classPrivateFieldSet(this, _ChatCompletionStream_choiceEventStates, [], "f");
	}
	get currentChatCompletionSnapshot() {
		return __classPrivateFieldGet(this, _ChatCompletionStream_currentChatCompletionSnapshot, "f");
	}
	/**
	* Intended for use on the frontend, consuming a stream produced with
	* `.toReadableStream()` on the backend.
	*
	* Note that messages sent to the model do not appear in `.on('message')`
	* in this context.
	*/
	static fromReadableStream(stream) {
		const runner = new ChatCompletionStream(null);
		runner._run(() => runner._fromReadableStream(stream));
		return runner;
	}
	static createChatCompletion(client, params, options) {
		const runner = new ChatCompletionStream(params);
		runner._run(() => runner._runChatCompletion(client, {
			...params,
			stream: true
		}, {
			...options,
			headers: {
				...options?.headers,
				"X-Stainless-Helper-Method": "stream"
			}
		}));
		return runner;
	}
	async _createChatCompletion(client, params, options) {
		super._createChatCompletion;
		this._listenForAbort(options?.signal);
		__classPrivateFieldGet(this, _ChatCompletionStream_instances, "m", _ChatCompletionStream_beginRequest).call(this);
		const stream = await client.chat.completions.create({
			...params,
			stream: true
		}, {
			...options,
			signal: this.controller.signal
		});
		this._connected();
		for await (const chunk of stream) __classPrivateFieldGet(this, _ChatCompletionStream_instances, "m", _ChatCompletionStream_addChunk).call(this, chunk);
		if (stream.controller.signal?.aborted) throw new APIUserAbortError();
		return this._addChatCompletion(__classPrivateFieldGet(this, _ChatCompletionStream_instances, "m", _ChatCompletionStream_endRequest).call(this));
	}
	async _fromReadableStream(readableStream, options) {
		this._listenForAbort(options?.signal);
		__classPrivateFieldGet(this, _ChatCompletionStream_instances, "m", _ChatCompletionStream_beginRequest).call(this);
		this._connected();
		const stream = Stream.fromReadableStream(readableStream, this.controller);
		let chatId;
		for await (const item of stream) {
			if (isChatCompletionReadableStreamMessage(item)) {
				const message = getChatCompletionReadableStreamMessage(item);
				if (__classPrivateFieldGet(this, _ChatCompletionStream_currentChatCompletionSnapshot, "f")) {
					const toolCalls = __classPrivateFieldGet(this, _ChatCompletionStream_currentChatCompletionSnapshot, "f").choices[0]?.message.tool_calls;
					for (const [index, id] of message.tool_call_ids?.entries() ?? []) {
						const toolCall = toolCalls?.[index];
						if (toolCall && id) toolCall.id = id;
					}
					this._addChatCompletion(__classPrivateFieldGet(this, _ChatCompletionStream_instances, "m", _ChatCompletionStream_endRequest).call(this));
					chatId = void 0;
				}
				this._addMessage(message.message);
				continue;
			}
			const chunk = item;
			if (chatId && chunk.id && chatId !== chunk.id) this._addChatCompletion(__classPrivateFieldGet(this, _ChatCompletionStream_instances, "m", _ChatCompletionStream_endRequest).call(this));
			__classPrivateFieldGet(this, _ChatCompletionStream_instances, "m", _ChatCompletionStream_addChunk).call(this, chunk);
			if (chunk.id) chatId = chunk.id;
		}
		if (stream.controller.signal?.aborted) throw new APIUserAbortError();
		if (__classPrivateFieldGet(this, _ChatCompletionStream_currentChatCompletionSnapshot, "f")) return this._addChatCompletion(__classPrivateFieldGet(this, _ChatCompletionStream_instances, "m", _ChatCompletionStream_endRequest).call(this));
		const lastChatCompletion = this._chatCompletions[this._chatCompletions.length - 1];
		if (lastChatCompletion) return lastChatCompletion;
		throw new OpenAIError(`request ended without sending any chunks`);
	}
	[(_ChatCompletionStream_params = /* @__PURE__ */ new WeakMap(), _ChatCompletionStream_audioDoneChoiceIndexes = /* @__PURE__ */ new WeakMap(), _ChatCompletionStream_choiceEventStates = /* @__PURE__ */ new WeakMap(), _ChatCompletionStream_currentChatCompletionSnapshot = /* @__PURE__ */ new WeakMap(), _ChatCompletionStream_instances = /* @__PURE__ */ new WeakSet(), _ChatCompletionStream_beginRequest = function _ChatCompletionStream_beginRequest() {
		if (this.ended) return;
		__classPrivateFieldSet(this, _ChatCompletionStream_audioDoneChoiceIndexes, /* @__PURE__ */ new Set(), "f");
		__classPrivateFieldSet(this, _ChatCompletionStream_currentChatCompletionSnapshot, void 0, "f");
	}, _ChatCompletionStream_getChoiceEventState = function _ChatCompletionStream_getChoiceEventState(choice) {
		let state = __classPrivateFieldGet(this, _ChatCompletionStream_choiceEventStates, "f")[choice.index];
		if (state) return state;
		state = {
			content_done: false,
			refusal_done: false,
			logprobs_content_done: false,
			logprobs_refusal_done: false,
			done_tool_calls: /* @__PURE__ */ new Set(),
			current_tool_call_index: null
		};
		__classPrivateFieldGet(this, _ChatCompletionStream_choiceEventStates, "f")[choice.index] = state;
		return state;
	}, _ChatCompletionStream_addChunk = function _ChatCompletionStream_addChunk(chunk) {
		if (this.ended) return;
		const completion = __classPrivateFieldGet(this, _ChatCompletionStream_instances, "m", _ChatCompletionStream_accumulateChatCompletion).call(this, chunk);
		this._emit("chunk", chunk, completion);
		for (const choice of chunk.choices) {
			const choiceSnapshot = completion.choices[choice.index];
			const { delta } = choice;
			if (delta?.content != null && choiceSnapshot.message?.role === "assistant" && choiceSnapshot.message?.content) {
				this._emit("content", delta.content, choiceSnapshot.message.content);
				this._emit("content.delta", {
					delta: delta.content,
					snapshot: choiceSnapshot.message.content,
					parsed: choiceSnapshot.message.parsed
				});
			}
			if (delta?.refusal != null && choiceSnapshot.message?.role === "assistant" && choiceSnapshot.message?.refusal) this._emit("refusal.delta", {
				delta: delta.refusal,
				snapshot: choiceSnapshot.message.refusal
			});
			if (choice.logprobs?.content != null && choiceSnapshot.message?.role === "assistant") this._emit("logprobs.content.delta", {
				content: choice.logprobs?.content,
				snapshot: choiceSnapshot.logprobs?.content ?? []
			});
			if (choice.logprobs?.refusal != null && choiceSnapshot.message?.role === "assistant") this._emit("logprobs.refusal.delta", {
				refusal: choice.logprobs?.refusal,
				snapshot: choiceSnapshot.logprobs?.refusal ?? []
			});
			const state = __classPrivateFieldGet(this, _ChatCompletionStream_instances, "m", _ChatCompletionStream_getChoiceEventState).call(this, choiceSnapshot);
			if (choiceSnapshot.finish_reason) {
				__classPrivateFieldGet(this, _ChatCompletionStream_instances, "m", _ChatCompletionStream_emitContentDoneEvents).call(this, choiceSnapshot);
				if (state.current_tool_call_index != null) __classPrivateFieldGet(this, _ChatCompletionStream_instances, "m", _ChatCompletionStream_emitToolCallDoneEvent).call(this, choiceSnapshot, state.current_tool_call_index);
			}
			for (const toolCall of delta?.tool_calls ?? []) {
				if (state.current_tool_call_index !== toolCall.index) {
					__classPrivateFieldGet(this, _ChatCompletionStream_instances, "m", _ChatCompletionStream_emitContentDoneEvents).call(this, choiceSnapshot);
					if (state.current_tool_call_index != null) __classPrivateFieldGet(this, _ChatCompletionStream_instances, "m", _ChatCompletionStream_emitToolCallDoneEvent).call(this, choiceSnapshot, state.current_tool_call_index);
				}
				state.current_tool_call_index = toolCall.index;
			}
			for (const toolCallDelta of delta?.tool_calls ?? []) {
				const toolCallSnapshot = choiceSnapshot.message.tool_calls?.[toolCallDelta.index];
				if (!toolCallSnapshot?.type) continue;
				if (toolCallSnapshot?.type === "function") this._emit("tool_calls.function.arguments.delta", {
					name: toolCallSnapshot.function?.name,
					index: toolCallDelta.index,
					arguments: toolCallSnapshot.function.arguments,
					parsed_arguments: toolCallSnapshot.function.parsed_arguments,
					arguments_delta: toolCallDelta.function?.arguments ?? ""
				});
				else toolCallSnapshot?.type;
			}
		}
	}, _ChatCompletionStream_emitToolCallDoneEvent = function _ChatCompletionStream_emitToolCallDoneEvent(choiceSnapshot, toolCallIndex) {
		if (__classPrivateFieldGet(this, _ChatCompletionStream_instances, "m", _ChatCompletionStream_getChoiceEventState).call(this, choiceSnapshot).done_tool_calls.has(toolCallIndex)) return;
		const toolCallSnapshot = choiceSnapshot.message.tool_calls?.[toolCallIndex];
		if (!toolCallSnapshot) throw new Error("no tool call snapshot");
		if (!toolCallSnapshot.type) throw new Error("tool call snapshot missing `type`");
		if (toolCallSnapshot.type === "function") {
			const inputTool = __classPrivateFieldGet(this, _ChatCompletionStream_params, "f")?.tools?.find((tool) => isChatCompletionFunctionTool(tool) && tool.function.name === toolCallSnapshot.function.name);
			this._emit("tool_calls.function.arguments.done", {
				name: toolCallSnapshot.function.name,
				index: toolCallIndex,
				arguments: toolCallSnapshot.function.arguments,
				parsed_arguments: isAutoParsableTool$1(inputTool) ? inputTool.$parseRaw(toolCallSnapshot.function.arguments) : inputTool?.function.strict ? JSON.parse(toolCallSnapshot.function.arguments) : null
			});
		} else toolCallSnapshot.type;
	}, _ChatCompletionStream_emitContentDoneEvents = function _ChatCompletionStream_emitContentDoneEvents(choiceSnapshot) {
		const state = __classPrivateFieldGet(this, _ChatCompletionStream_instances, "m", _ChatCompletionStream_getChoiceEventState).call(this, choiceSnapshot);
		if (choiceSnapshot.message.content && !state.content_done) {
			state.content_done = true;
			const responseFormat = __classPrivateFieldGet(this, _ChatCompletionStream_instances, "m", _ChatCompletionStream_getAutoParseableResponseFormat).call(this);
			this._emit("content.done", {
				content: choiceSnapshot.message.content,
				parsed: responseFormat ? responseFormat.$parseRaw(choiceSnapshot.message.content) : null
			});
		}
		if (choiceSnapshot.message.refusal && !state.refusal_done) {
			state.refusal_done = true;
			this._emit("refusal.done", { refusal: choiceSnapshot.message.refusal });
		}
		if (choiceSnapshot.logprobs?.content && !state.logprobs_content_done) {
			state.logprobs_content_done = true;
			this._emit("logprobs.content.done", { content: choiceSnapshot.logprobs.content });
		}
		if (choiceSnapshot.logprobs?.refusal && !state.logprobs_refusal_done) {
			state.logprobs_refusal_done = true;
			this._emit("logprobs.refusal.done", { refusal: choiceSnapshot.logprobs.refusal });
		}
	}, _ChatCompletionStream_endRequest = function _ChatCompletionStream_endRequest() {
		if (this.ended) throw new OpenAIError(`stream has ended, this shouldn't happen`);
		const snapshot = __classPrivateFieldGet(this, _ChatCompletionStream_currentChatCompletionSnapshot, "f");
		if (!snapshot) throw new OpenAIError(`request ended without sending any chunks`);
		const audioDoneChoiceIndexes = __classPrivateFieldGet(this, _ChatCompletionStream_audioDoneChoiceIndexes, "f");
		__classPrivateFieldSet(this, _ChatCompletionStream_audioDoneChoiceIndexes, /* @__PURE__ */ new Set(), "f");
		__classPrivateFieldSet(this, _ChatCompletionStream_currentChatCompletionSnapshot, void 0, "f");
		__classPrivateFieldSet(this, _ChatCompletionStream_choiceEventStates, [], "f");
		return finalizeChatCompletion(snapshot, __classPrivateFieldGet(this, _ChatCompletionStream_params, "f"), audioDoneChoiceIndexes);
	}, _ChatCompletionStream_getAutoParseableResponseFormat = function _ChatCompletionStream_getAutoParseableResponseFormat() {
		const responseFormat = __classPrivateFieldGet(this, _ChatCompletionStream_params, "f")?.response_format;
		if (isAutoParsableResponseFormat(responseFormat)) return responseFormat;
		return null;
	}, _ChatCompletionStream_accumulateChatCompletion = function _ChatCompletionStream_accumulateChatCompletion(chunk) {
		var _a, _b, _c, _d, _e;
		let snapshot = __classPrivateFieldGet(this, _ChatCompletionStream_currentChatCompletionSnapshot, "f");
		const { choices, ...rest } = chunk;
		if (!snapshot) snapshot = __classPrivateFieldSet(this, _ChatCompletionStream_currentChatCompletionSnapshot, {
			...rest,
			choices: []
		}, "f");
		else if (chunk.id) Object.assign(snapshot, rest);
		for (const { delta, finish_reason, index, logprobs = null, ...other } of chunk.choices) {
			let choice = snapshot.choices[index];
			if (!choice) choice = snapshot.choices[index] = {
				finish_reason,
				index,
				message: {},
				logprobs,
				...other
			};
			if (logprobs) if (!choice.logprobs) choice.logprobs = Object.assign({}, logprobs);
			else {
				const { content, refusal, ...rest } = logprobs;
				Object.assign(choice.logprobs, rest);
				if (content) {
					(_a = choice.logprobs).content ?? (_a.content = []);
					choice.logprobs.content.push(...content);
				}
				if (refusal) {
					(_b = choice.logprobs).refusal ?? (_b.refusal = []);
					choice.logprobs.refusal.push(...refusal);
				}
			}
			if (finish_reason) {
				choice.finish_reason = finish_reason;
				if (__classPrivateFieldGet(this, _ChatCompletionStream_params, "f") && hasAutoParseableInput$1(__classPrivateFieldGet(this, _ChatCompletionStream_params, "f"))) {
					if (finish_reason === "length") throw new LengthFinishReasonError();
					if (finish_reason === "content_filter") throw new ContentFilterFinishReasonError();
				}
			}
			Object.assign(choice, other);
			if (!delta) continue;
			__classPrivateFieldGet(this, _ChatCompletionStream_audioDoneChoiceIndexes, "f").delete(index);
			const { audio, content, refusal, function_call, role, tool_calls, ...rest } = delta;
			Object.assign(choice.message, rest);
			if (audio?.expires_at != null && audio.id == null && audio.data == null && audio.transcript == null && content == null && refusal == null && function_call == null && role == null && tool_calls == null && Object.keys(rest).length === 0) __classPrivateFieldGet(this, _ChatCompletionStream_audioDoneChoiceIndexes, "f").add(index);
			if (refusal) choice.message.refusal = (choice.message.refusal || "") + refusal;
			if (role) choice.message.role = role;
			if (audio) {
				const audioSnapshot = (_c = choice.message).audio ?? (_c.audio = {});
				if (audio.id != null) audioSnapshot.id = audio.id;
				if (audio.data != null) audioSnapshot.data = (audioSnapshot.data ?? "") + audio.data;
				if (audio.transcript != null) audioSnapshot.transcript = (audioSnapshot.transcript ?? "") + audio.transcript;
				if (audio.expires_at != null) audioSnapshot.expires_at = audio.expires_at;
			}
			if (function_call) if (!choice.message.function_call) choice.message.function_call = function_call;
			else {
				if (function_call.name) choice.message.function_call.name = function_call.name;
				if (function_call.arguments) {
					(_d = choice.message.function_call).arguments ?? (_d.arguments = "");
					choice.message.function_call.arguments += function_call.arguments;
				}
			}
			if (content) {
				choice.message.content = (choice.message.content || "") + content;
				if (!choice.message.refusal && __classPrivateFieldGet(this, _ChatCompletionStream_instances, "m", _ChatCompletionStream_getAutoParseableResponseFormat).call(this)) choice.message.parsed = choice.message.content.trim() ? partialParse(choice.message.content) : null;
			}
			if (tool_calls) {
				if (!choice.message.tool_calls) choice.message.tool_calls = [];
				for (const { index, id, type, function: fn, ...rest } of tool_calls) {
					const tool_call = (_e = choice.message.tool_calls)[index] ?? (_e[index] = {});
					Object.assign(tool_call, rest);
					if (id) tool_call.id = id;
					if (type) tool_call.type = type;
					if (fn) tool_call.function ?? (tool_call.function = {
						name: fn.name ?? "",
						arguments: ""
					});
					if (fn?.name) tool_call.function.name = fn.name;
					if (fn?.arguments) {
						tool_call.function.arguments += fn.arguments;
						if (shouldParseToolCall(__classPrivateFieldGet(this, _ChatCompletionStream_params, "f"), tool_call)) tool_call.function.parsed_arguments = partialParse(tool_call.function.arguments);
					}
				}
			}
		}
		return snapshot;
	}, Symbol.asyncIterator)]() {
		const pushQueue = [];
		const readQueue = [];
		let done = false;
		this.on("chunk", (chunk) => {
			const reader = readQueue.shift();
			if (reader) reader.resolve(chunk);
			else pushQueue.push(chunk);
		});
		this.on("end", () => {
			done = true;
			for (const reader of readQueue) reader.resolve(void 0);
			readQueue.length = 0;
		});
		this.on("abort", (err) => {
			done = true;
			for (const reader of readQueue) reader.reject(err);
			readQueue.length = 0;
		});
		this.on("error", (err) => {
			done = true;
			for (const reader of readQueue) reader.reject(err);
			readQueue.length = 0;
		});
		return {
			next: async () => {
				if (!pushQueue.length) {
					if (done) return {
						value: void 0,
						done: true
					};
					return new Promise((resolve, reject) => readQueue.push({
						resolve,
						reject
					})).then((chunk) => chunk ? {
						value: chunk,
						done: false
					} : {
						value: void 0,
						done: true
					});
				}
				return {
					value: pushQueue.shift(),
					done: false
				};
			},
			return: async () => {
				this.abort();
				return {
					value: void 0,
					done: true
				};
			}
		};
	}
	toReadableStream() {
		return new Stream(this[Symbol.asyncIterator].bind(this), this.controller).toReadableStream();
	}
};
function finalizeChatCompletion(snapshot, params, audioDoneChoiceIndexes) {
	const { id, choices, created, model, system_fingerprint, ...rest } = snapshot;
	return maybeParseChatCompletion({
		...rest,
		id,
		choices: choices.map(({ message, finish_reason, index, logprobs, ...choiceRest }) => {
			const { content = null, function_call, tool_calls, audio, ...messageRest } = message;
			const finishReason = finish_reason ?? (audioDoneChoiceIndexes.has(index) && isCompleteAudio(audio) ? "stop" : null);
			if (!finishReason) throw new OpenAIError(`missing finish_reason for choice ${index}`);
			const audioResponse = audio ? { audio } : {};
			const role = message.role;
			if (!role) throw new OpenAIError(`missing role for choice ${index}`);
			if (function_call) {
				const { arguments: args, name } = function_call;
				if (args == null) throw new OpenAIError(`missing function_call.arguments for choice ${index}`);
				if (!name) throw new OpenAIError(`missing function_call.name for choice ${index}`);
				return {
					...choiceRest,
					message: {
						...audioResponse,
						content,
						function_call: {
							arguments: args,
							name
						},
						role,
						refusal: message.refusal ?? null
					},
					finish_reason: finishReason,
					index,
					logprobs
				};
			}
			if (tool_calls) return {
				...choiceRest,
				index,
				finish_reason: finishReason,
				logprobs,
				message: {
					...messageRest,
					...audioResponse,
					role,
					content,
					refusal: message.refusal ?? null,
					tool_calls: tool_calls.map((tool_call, i) => {
						const { function: fn, type, id, ...toolRest } = tool_call;
						const { arguments: args, name, ...fnRest } = fn || {};
						if (type == null) throw new OpenAIError(`missing choices[${index}].tool_calls[${i}].type\n${str(snapshot)}`);
						if (name == null) throw new OpenAIError(`missing choices[${index}].tool_calls[${i}].function.name\n${str(snapshot)}`);
						if (args == null) throw new OpenAIError(`missing choices[${index}].tool_calls[${i}].function.arguments\n${str(snapshot)}`);
						return {
							...toolRest,
							id: id || `call_${uuid4()}`,
							type,
							function: {
								...fnRest,
								name,
								arguments: args
							}
						};
					})
				}
			};
			return {
				...choiceRest,
				message: {
					...messageRest,
					...audioResponse,
					content,
					role,
					refusal: message.refusal ?? null
				},
				finish_reason: finishReason,
				index,
				logprobs
			};
		}),
		created,
		model,
		object: "chat.completion",
		...system_fingerprint ? { system_fingerprint } : {}
	}, params);
}
function isCompleteAudio(audio) {
	return audio?.id != null && audio.data != null && audio.transcript != null && audio.expires_at != null;
}
function str(x) {
	return JSON.stringify(x);
}
//#endregion
//#region node_modules/openai/lib/ChatCompletionStreamingRunner.mjs
var ChatCompletionStreamingRunner = class ChatCompletionStreamingRunner extends ChatCompletionStream {
	static fromReadableStream(stream) {
		const runner = new ChatCompletionStreamingRunner(null);
		runner._run(() => runner._fromReadableStream(stream));
		return runner;
	}
	toReadableStream() {
		const pushQueue = [];
		const readQueue = [];
		let done = false;
		let lastChunk;
		let toolCallIds;
		const pushEvent = (event) => {
			const reader = readQueue.shift();
			if (reader) reader.resolve(event);
			else pushQueue.push(event);
		};
		this.on("chunk", (chunk) => {
			lastChunk = chunk;
			pushEvent(chunk);
		});
		this.on("message", (message) => {
			if (isAssistantMessage(message)) {
				toolCallIds = message.tool_calls?.map((toolCall) => toolCall.id);
				return;
			}
			if (isToolMessage(message)) {
				if (!lastChunk) throw new OpenAIError("cannot serialize a tool message before receiving any chunks");
				pushEvent(makeChatCompletionReadableStreamMessageChunk(lastChunk, message, toolCallIds));
			}
		});
		this.on("end", () => {
			done = true;
			for (const reader of readQueue) reader.resolve(void 0);
			readQueue.length = 0;
		});
		this.on("abort", (err) => {
			done = true;
			for (const reader of readQueue) reader.reject(err);
			readQueue.length = 0;
		});
		this.on("error", (err) => {
			done = true;
			for (const reader of readQueue) reader.reject(err);
			readQueue.length = 0;
		});
		const iterator = () => ({
			next: async () => {
				if (!pushQueue.length) {
					if (done) return {
						value: void 0,
						done: true
					};
					return new Promise((resolve, reject) => readQueue.push({
						resolve,
						reject
					})).then((event) => event ? {
						value: event,
						done: false
					} : {
						value: void 0,
						done: true
					});
				}
				const event = pushQueue.shift();
				if (!event) return {
					value: void 0,
					done: true
				};
				return {
					value: event,
					done: false
				};
			},
			return: async () => {
				this.abort();
				return {
					value: void 0,
					done: true
				};
			}
		});
		return new Stream(iterator, this.controller).toReadableStream();
	}
	static runTools(client, params, options) {
		const runner = new ChatCompletionStreamingRunner(params);
		const opts = {
			...options,
			headers: {
				...options?.headers,
				"X-Stainless-Helper-Method": "runTools"
			}
		};
		runner._run(() => runner._runTools(client, params, runner, opts));
		return runner;
	}
};
//#endregion
//#region node_modules/openai/resources/chat/completions/completions.mjs
/**
* Given a list of messages comprising a conversation, the model will return a response.
*/
var Completions$1 = class extends APIResource {
	constructor() {
		super(...arguments);
		this.messages = new Messages$1(this._client);
	}
	create(body, options) {
		return this._client.post("/chat/completions", {
			body,
			...options,
			stream: body.stream ?? false,
			__security: { bearerAuth: true }
		});
	}
	/**
	* Get a stored chat completion. Only Chat Completions that have been created with
	* the `store` parameter set to `true` will be returned.
	*
	* @example
	* ```ts
	* const chatCompletion =
	*   await client.chat.completions.retrieve('completion_id');
	* ```
	*/
	retrieve(completionID, options) {
		return this._client.get(path`/chat/completions/${completionID}`, {
			...options,
			__security: { bearerAuth: true }
		});
	}
	/**
	* Modify a stored chat completion. Only Chat Completions that have been created
	* with the `store` parameter set to `true` can be modified. Currently, the only
	* supported modification is to update the `metadata` field.
	*
	* @example
	* ```ts
	* const chatCompletion = await client.chat.completions.update(
	*   'completion_id',
	*   { metadata: { foo: 'string' } },
	* );
	* ```
	*/
	update(completionID, body, options) {
		return this._client.post(path`/chat/completions/${completionID}`, {
			body,
			...options,
			__security: { bearerAuth: true }
		});
	}
	/**
	* List stored Chat Completions. Only Chat Completions that have been stored with
	* the `store` parameter set to `true` will be returned.
	*
	* @example
	* ```ts
	* // Automatically fetches more pages as needed.
	* for await (const chatCompletion of client.chat.completions.list()) {
	*   // ...
	* }
	* ```
	*/
	list(query = {}, options) {
		return this._client.getAPIList("/chat/completions", CursorPage, {
			query,
			...options,
			__security: { bearerAuth: true }
		});
	}
	/**
	* Delete a stored chat completion. Only Chat Completions that have been created
	* with the `store` parameter set to `true` can be deleted.
	*
	* @example
	* ```ts
	* const chatCompletionDeleted =
	*   await client.chat.completions.delete('completion_id');
	* ```
	*/
	delete(completionID, options) {
		return this._client.delete(path`/chat/completions/${completionID}`, {
			...options,
			__security: { bearerAuth: true }
		});
	}
	parse(body, options) {
		validateInputTools(body.tools);
		return this._client.chat.completions.create(body, {
			...options,
			headers: {
				...options?.headers,
				"X-Stainless-Helper-Method": "chat.completions.parse"
			}
		})._thenUnwrap((completion) => parseChatCompletion(completion, body));
	}
	runTools(body, options) {
		if (body.stream) return ChatCompletionStreamingRunner.runTools(this._client, body, options);
		return ChatCompletionRunner.runTools(this._client, body, options);
	}
	/**
	* Creates a chat completion stream
	*/
	stream(body, options) {
		return ChatCompletionStream.createChatCompletion(this._client, body, options);
	}
};
Completions$1.Messages = Messages$1;
//#endregion
//#region node_modules/openai/resources/chat/chat.mjs
var Chat = class extends APIResource {
	constructor() {
		super(...arguments);
		this.completions = new Completions$1(this._client);
	}
};
Chat.Completions = Completions$1;
//#endregion
//#region node_modules/openai/resources/admin/organization/admin-api-keys.mjs
var AdminAPIKeys = class extends APIResource {
	/**
	* Create an organization admin API key
	*
	* @example
	* ```ts
	* const adminAPIKey =
	*   await client.admin.organization.adminAPIKeys.create({
	*     name: 'New Admin Key',
	*   });
	* ```
	*/
	create(body, options) {
		return this._client.post("/organization/admin_api_keys", {
			body,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Retrieve a single organization API key
	*
	* @example
	* ```ts
	* const adminAPIKey =
	*   await client.admin.organization.adminAPIKeys.retrieve(
	*     'key_id',
	*   );
	* ```
	*/
	retrieve(keyID, options) {
		return this._client.get(path`/organization/admin_api_keys/${keyID}`, {
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* List organization API keys
	*
	* @example
	* ```ts
	* // Automatically fetches more pages as needed.
	* for await (const adminAPIKey of client.admin.organization.adminAPIKeys.list()) {
	*   // ...
	* }
	* ```
	*/
	list(query = {}, options) {
		return this._client.getAPIList("/organization/admin_api_keys", CursorPage, {
			query,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Delete an organization admin API key
	*
	* @example
	* ```ts
	* const adminAPIKey =
	*   await client.admin.organization.adminAPIKeys.delete(
	*     'key_id',
	*   );
	* ```
	*/
	delete(keyID, options) {
		return this._client.delete(path`/organization/admin_api_keys/${keyID}`, {
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
};
//#endregion
//#region node_modules/openai/resources/admin/organization/audit-logs.mjs
/**
* List user actions and configuration changes within this organization.
*/
var AuditLogs = class extends APIResource {
	/**
	* List user actions and configuration changes within this organization.
	*
	* @example
	* ```ts
	* // Automatically fetches more pages as needed.
	* for await (const auditLogListResponse of client.admin.organization.auditLogs.list()) {
	*   // ...
	* }
	* ```
	*/
	list(query = {}, options) {
		return this._client.getAPIList("/organization/audit_logs", ConversationCursorPage, {
			query,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
};
//#endregion
//#region node_modules/openai/resources/admin/organization/certificates.mjs
var Certificates$1 = class extends APIResource {
	/**
	* Upload a certificate to the organization. This does **not** automatically
	* activate the certificate.
	*
	* Organizations can upload up to 50 certificates.
	*
	* @example
	* ```ts
	* const certificate =
	*   await client.admin.organization.certificates.create({
	*     certificate: 'certificate',
	*   });
	* ```
	*/
	create(body, options) {
		return this._client.post("/organization/certificates", {
			body,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Get a certificate that has been uploaded to the organization.
	*
	* You can get a certificate regardless of whether it is active or not.
	*
	* @example
	* ```ts
	* const certificate =
	*   await client.admin.organization.certificates.retrieve(
	*     'certificate_id',
	*   );
	* ```
	*/
	retrieve(certificateID, query = {}, options) {
		return this._client.get(path`/organization/certificates/${certificateID}`, {
			query,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Modify a certificate. Note that only the name can be modified.
	*
	* @example
	* ```ts
	* const certificate =
	*   await client.admin.organization.certificates.update(
	*     'certificate_id',
	*   );
	* ```
	*/
	update(certificateID, body, options) {
		return this._client.post(path`/organization/certificates/${certificateID}`, {
			body,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* List uploaded certificates for this organization.
	*
	* @example
	* ```ts
	* // Automatically fetches more pages as needed.
	* for await (const certificateListResponse of client.admin.organization.certificates.list()) {
	*   // ...
	* }
	* ```
	*/
	list(query = {}, options) {
		return this._client.getAPIList("/organization/certificates", ConversationCursorPage, {
			query,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Delete a certificate from the organization.
	*
	* The certificate must be inactive for the organization and all projects.
	*
	* @example
	* ```ts
	* const certificate =
	*   await client.admin.organization.certificates.delete(
	*     'certificate_id',
	*   );
	* ```
	*/
	delete(certificateID, options) {
		return this._client.delete(path`/organization/certificates/${certificateID}`, {
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Activate certificates at the organization level.
	*
	* You can atomically and idempotently activate up to 10 certificates at a time.
	*
	* @example
	* ```ts
	* // Automatically fetches more pages as needed.
	* for await (const certificateActivateResponse of client.admin.organization.certificates.activate(
	*   { certificate_ids: ['cert_abc'] },
	* )) {
	*   // ...
	* }
	* ```
	*/
	activate(body, options) {
		return this._client.getAPIList("/organization/certificates/activate", Page, {
			body,
			method: "post",
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Deactivate certificates at the organization level.
	*
	* You can atomically and idempotently deactivate up to 10 certificates at a time.
	*
	* @example
	* ```ts
	* // Automatically fetches more pages as needed.
	* for await (const certificateDeactivateResponse of client.admin.organization.certificates.deactivate(
	*   { certificate_ids: ['cert_abc'] },
	* )) {
	*   // ...
	* }
	* ```
	*/
	deactivate(body, options) {
		return this._client.getAPIList("/organization/certificates/deactivate", Page, {
			body,
			method: "post",
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
};
//#endregion
//#region node_modules/openai/resources/admin/organization/data-retention.mjs
var DataRetention$1 = class extends APIResource {
	/**
	* Retrieves organization data retention controls.
	*
	* @example
	* ```ts
	* const organizationDataRetention =
	*   await client.admin.organization.dataRetention.retrieve();
	* ```
	*/
	retrieve(options) {
		return this._client.get("/organization/data_retention", {
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Updates organization data retention controls.
	*
	* @example
	* ```ts
	* const organizationDataRetention =
	*   await client.admin.organization.dataRetention.update({
	*     retention_type: 'zero_data_retention',
	*   });
	* ```
	*/
	update(body, options) {
		return this._client.post("/organization/data_retention", {
			body,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
};
//#endregion
//#region node_modules/openai/resources/admin/organization/invites.mjs
var Invites = class extends APIResource {
	/**
	* Create an invite for a user to the organization. The invite must be accepted by
	* the user before they have access to the organization.
	*
	* @example
	* ```ts
	* const invite =
	*   await client.admin.organization.invites.create({
	*     email: 'email',
	*     role: 'reader',
	*   });
	* ```
	*/
	create(body, options) {
		return this._client.post("/organization/invites", {
			body,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Retrieves an invite.
	*
	* @example
	* ```ts
	* const invite =
	*   await client.admin.organization.invites.retrieve(
	*     'invite_id',
	*   );
	* ```
	*/
	retrieve(inviteID, options) {
		return this._client.get(path`/organization/invites/${inviteID}`, {
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Returns a list of invites in the organization.
	*
	* @example
	* ```ts
	* // Automatically fetches more pages as needed.
	* for await (const invite of client.admin.organization.invites.list()) {
	*   // ...
	* }
	* ```
	*/
	list(query = {}, options) {
		return this._client.getAPIList("/organization/invites", ConversationCursorPage, {
			query,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Delete an invite. If the invite has already been accepted, it cannot be deleted.
	*
	* @example
	* ```ts
	* const invite =
	*   await client.admin.organization.invites.delete(
	*     'invite_id',
	*   );
	* ```
	*/
	delete(inviteID, options) {
		return this._client.delete(path`/organization/invites/${inviteID}`, {
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
};
//#endregion
//#region node_modules/openai/resources/admin/organization/roles.mjs
var Roles$5 = class extends APIResource {
	/**
	* Creates a custom role for the organization.
	*
	* @example
	* ```ts
	* const role = await client.admin.organization.roles.create({
	*   permissions: ['string'],
	*   role_name: 'role_name',
	* });
	* ```
	*/
	create(body, options) {
		return this._client.post("/organization/roles", {
			body,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Retrieves an organization role.
	*
	* @example
	* ```ts
	* const role = await client.admin.organization.roles.retrieve(
	*   'role_id',
	* );
	* ```
	*/
	retrieve(roleID, options) {
		return this._client.get(path`/organization/roles/${roleID}`, {
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Updates an existing organization role.
	*
	* @example
	* ```ts
	* const role = await client.admin.organization.roles.update(
	*   'role_id',
	* );
	* ```
	*/
	update(roleID, body, options) {
		return this._client.post(path`/organization/roles/${roleID}`, {
			body,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Lists the roles configured for the organization.
	*
	* @example
	* ```ts
	* // Automatically fetches more pages as needed.
	* for await (const role of client.admin.organization.roles.list()) {
	*   // ...
	* }
	* ```
	*/
	list(query = {}, options) {
		return this._client.getAPIList("/organization/roles", NextCursorPage, {
			query,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Deletes a custom role from the organization.
	*
	* @example
	* ```ts
	* const role = await client.admin.organization.roles.delete(
	*   'role_id',
	* );
	* ```
	*/
	delete(roleID, options) {
		return this._client.delete(path`/organization/roles/${roleID}`, {
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
};
//#endregion
//#region node_modules/openai/resources/admin/organization/spend-alerts.mjs
var SpendAlerts$1 = class extends APIResource {
	/**
	* Creates an organization spend alert.
	*
	* @example
	* ```ts
	* const organizationSpendAlert =
	*   await client.admin.organization.spendAlerts.create({
	*     currency: 'USD',
	*     interval: 'month',
	*     notification_channel: {
	*       recipients: ['string'],
	*       type: 'email',
	*     },
	*     threshold_amount: 0,
	*   });
	* ```
	*/
	create(body, options) {
		return this._client.post("/organization/spend_alerts", {
			body,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Retrieves an organization spend alert.
	*
	* @example
	* ```ts
	* const organizationSpendAlert =
	*   await client.admin.organization.spendAlerts.retrieve(
	*     'alert_id',
	*   );
	* ```
	*/
	retrieve(alertID, options) {
		return this._client.get(path`/organization/spend_alerts/${alertID}`, {
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Updates an organization spend alert.
	*
	* @example
	* ```ts
	* const organizationSpendAlert =
	*   await client.admin.organization.spendAlerts.update(
	*     'alert_id',
	*     {
	*       currency: 'USD',
	*       interval: 'month',
	*       notification_channel: {
	*         recipients: ['string'],
	*         type: 'email',
	*       },
	*       threshold_amount: 0,
	*     },
	*   );
	* ```
	*/
	update(alertID, body, options) {
		return this._client.post(path`/organization/spend_alerts/${alertID}`, {
			body,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Lists organization spend alerts.
	*
	* @example
	* ```ts
	* // Automatically fetches more pages as needed.
	* for await (const organizationSpendAlert of client.admin.organization.spendAlerts.list()) {
	*   // ...
	* }
	* ```
	*/
	list(query = {}, options) {
		return this._client.getAPIList("/organization/spend_alerts", ConversationCursorPage, {
			query,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Deletes an organization spend alert.
	*
	* @example
	* ```ts
	* const organizationSpendAlertDeleted =
	*   await client.admin.organization.spendAlerts.delete(
	*     'alert_id',
	*   );
	* ```
	*/
	delete(alertID, options) {
		return this._client.delete(path`/organization/spend_alerts/${alertID}`, {
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
};
//#endregion
//#region node_modules/openai/resources/admin/organization/spend-limit.mjs
var SpendLimit$1 = class extends APIResource {
	/**
	* Get the organization's hard spend limit.
	*
	* @example
	* ```ts
	* const organizationSpendLimit =
	*   await client.admin.organization.spendLimit.retrieve();
	* ```
	*/
	retrieve(options) {
		return this._client.get("/organization/spend_limit", {
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Create or replace the organization's hard spend limit.
	*
	* @example
	* ```ts
	* const organizationSpendLimit =
	*   await client.admin.organization.spendLimit.update({
	*     currency: 'USD',
	*     interval: 'month',
	*     threshold_amount: 1,
	*   });
	* ```
	*/
	update(body, options) {
		return this._client.post("/organization/spend_limit", {
			body,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Delete the organization's hard spend limit.
	*
	* @example
	* ```ts
	* const organizationSpendLimitDeleted =
	*   await client.admin.organization.spendLimit.delete();
	* ```
	*/
	delete(options) {
		return this._client.delete("/organization/spend_limit", {
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
};
//#endregion
//#region node_modules/openai/resources/admin/organization/usage.mjs
var Usage = class extends APIResource {
	/**
	* Get audio speeches usage details for the organization.
	*
	* @example
	* ```ts
	* const response =
	*   await client.admin.organization.usage.audioSpeeches({
	*     start_time: 0,
	*   });
	* ```
	*/
	audioSpeeches(query, options) {
		return this._client.get("/organization/usage/audio_speeches", {
			query,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Get audio transcriptions usage details for the organization.
	*
	* @example
	* ```ts
	* const response =
	*   await client.admin.organization.usage.audioTranscriptions(
	*     { start_time: 0 },
	*   );
	* ```
	*/
	audioTranscriptions(query, options) {
		return this._client.get("/organization/usage/audio_transcriptions", {
			query,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Get code interpreter sessions usage details for the organization.
	*
	* @example
	* ```ts
	* const response =
	*   await client.admin.organization.usage.codeInterpreterSessions(
	*     { start_time: 0 },
	*   );
	* ```
	*/
	codeInterpreterSessions(query, options) {
		return this._client.get("/organization/usage/code_interpreter_sessions", {
			query,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Get completions usage details for the organization.
	*
	* @example
	* ```ts
	* const response =
	*   await client.admin.organization.usage.completions({
	*     start_time: 0,
	*   });
	* ```
	*/
	completions(query, options) {
		return this._client.get("/organization/usage/completions", {
			query,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Get costs details for the organization.
	*
	* @example
	* ```ts
	* const response =
	*   await client.admin.organization.usage.costs({
	*     start_time: 0,
	*   });
	* ```
	*/
	costs(query, options) {
		return this._client.get("/organization/costs", {
			query,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Get embeddings usage details for the organization.
	*
	* @example
	* ```ts
	* const response =
	*   await client.admin.organization.usage.embeddings({
	*     start_time: 0,
	*   });
	* ```
	*/
	embeddings(query, options) {
		return this._client.get("/organization/usage/embeddings", {
			query,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Get file search calls usage details for the organization.
	*
	* @example
	* ```ts
	* const response =
	*   await client.admin.organization.usage.fileSearchCalls({
	*     start_time: 0,
	*   });
	* ```
	*/
	fileSearchCalls(query, options) {
		return this._client.get("/organization/usage/file_search_calls", {
			query,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Get images usage details for the organization.
	*
	* @example
	* ```ts
	* const response =
	*   await client.admin.organization.usage.images({
	*     start_time: 0,
	*   });
	* ```
	*/
	images(query, options) {
		return this._client.get("/organization/usage/images", {
			query,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Get moderations usage details for the organization.
	*
	* @example
	* ```ts
	* const response =
	*   await client.admin.organization.usage.moderations({
	*     start_time: 0,
	*   });
	* ```
	*/
	moderations(query, options) {
		return this._client.get("/organization/usage/moderations", {
			query,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Get vector stores usage details for the organization.
	*
	* @example
	* ```ts
	* const response =
	*   await client.admin.organization.usage.vectorStores({
	*     start_time: 0,
	*   });
	* ```
	*/
	vectorStores(query, options) {
		return this._client.get("/organization/usage/vector_stores", {
			query,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Get web search calls usage details for the organization.
	*
	* @example
	* ```ts
	* const response =
	*   await client.admin.organization.usage.webSearchCalls({
	*     start_time: 0,
	*   });
	* ```
	*/
	webSearchCalls(query, options) {
		return this._client.get("/organization/usage/web_search_calls", {
			query,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
};
//#endregion
//#region node_modules/openai/resources/admin/organization/groups/roles.mjs
var Roles$4 = class extends APIResource {
	/**
	* Assigns an organization role to a group within the organization.
	*
	* @example
	* ```ts
	* const role =
	*   await client.admin.organization.groups.roles.create(
	*     'group_id',
	*     { role_id: 'role_id' },
	*   );
	* ```
	*/
	create(groupID, body, options) {
		return this._client.post(path`/organization/groups/${groupID}/roles`, {
			body,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Retrieves an organization role assigned to a group.
	*
	* @example
	* ```ts
	* const role =
	*   await client.admin.organization.groups.roles.retrieve(
	*     'role_id',
	*     { group_id: 'group_id' },
	*   );
	* ```
	*/
	retrieve(roleID, params, options) {
		const { group_id } = params;
		return this._client.get(path`/organization/groups/${group_id}/roles/${roleID}`, {
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Lists the organization roles assigned to a group within the organization.
	*
	* @example
	* ```ts
	* // Automatically fetches more pages as needed.
	* for await (const roleListResponse of client.admin.organization.groups.roles.list(
	*   'group_id',
	* )) {
	*   // ...
	* }
	* ```
	*/
	list(groupID, query = {}, options) {
		return this._client.getAPIList(path`/organization/groups/${groupID}/roles`, NextCursorPage, {
			query,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Unassigns an organization role from a group within the organization.
	*
	* @example
	* ```ts
	* const role =
	*   await client.admin.organization.groups.roles.delete(
	*     'role_id',
	*     { group_id: 'group_id' },
	*   );
	* ```
	*/
	delete(roleID, params, options) {
		const { group_id } = params;
		return this._client.delete(path`/organization/groups/${group_id}/roles/${roleID}`, {
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
};
//#endregion
//#region node_modules/openai/resources/admin/organization/groups/users.mjs
var Users$2 = class extends APIResource {
	/**
	* Adds a user to a group.
	*
	* @example
	* ```ts
	* const user =
	*   await client.admin.organization.groups.users.create(
	*     'group_id',
	*     { user_id: 'user_id' },
	*   );
	* ```
	*/
	create(groupID, body, options) {
		return this._client.post(path`/organization/groups/${groupID}/users`, {
			body,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Retrieves a user in a group.
	*
	* @example
	* ```ts
	* const user =
	*   await client.admin.organization.groups.users.retrieve(
	*     'user_id',
	*     { group_id: 'group_id' },
	*   );
	* ```
	*/
	retrieve(userID, params, options) {
		const { group_id } = params;
		return this._client.get(path`/organization/groups/${group_id}/users/${userID}`, {
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Lists the users assigned to a group.
	*
	* @example
	* ```ts
	* // Automatically fetches more pages as needed.
	* for await (const organizationGroupUser of client.admin.organization.groups.users.list(
	*   'group_id',
	* )) {
	*   // ...
	* }
	* ```
	*/
	list(groupID, query = {}, options) {
		return this._client.getAPIList(path`/organization/groups/${groupID}/users`, NextCursorPage, {
			query,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Removes a user from a group.
	*
	* @example
	* ```ts
	* const user =
	*   await client.admin.organization.groups.users.delete(
	*     'user_id',
	*     { group_id: 'group_id' },
	*   );
	* ```
	*/
	delete(userID, params, options) {
		const { group_id } = params;
		return this._client.delete(path`/organization/groups/${group_id}/users/${userID}`, {
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
};
//#endregion
//#region node_modules/openai/resources/admin/organization/groups/groups.mjs
var Groups$1 = class extends APIResource {
	constructor() {
		super(...arguments);
		this.users = new Users$2(this._client);
		this.roles = new Roles$4(this._client);
	}
	/**
	* Creates a new group in the organization.
	*
	* @example
	* ```ts
	* const group = await client.admin.organization.groups.create(
	*   { name: 'x' },
	* );
	* ```
	*/
	create(body, options) {
		return this._client.post("/organization/groups", {
			body,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Retrieves a group.
	*
	* @example
	* ```ts
	* const group =
	*   await client.admin.organization.groups.retrieve(
	*     'group_id',
	*   );
	* ```
	*/
	retrieve(groupID, options) {
		return this._client.get(path`/organization/groups/${groupID}`, {
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Updates a group's information.
	*
	* @example
	* ```ts
	* const group = await client.admin.organization.groups.update(
	*   'group_id',
	*   { name: 'x' },
	* );
	* ```
	*/
	update(groupID, body, options) {
		return this._client.post(path`/organization/groups/${groupID}`, {
			body,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Lists all groups in the organization.
	*
	* @example
	* ```ts
	* // Automatically fetches more pages as needed.
	* for await (const group of client.admin.organization.groups.list()) {
	*   // ...
	* }
	* ```
	*/
	list(query = {}, options) {
		return this._client.getAPIList("/organization/groups", NextCursorPage, {
			query,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Deletes a group from the organization.
	*
	* @example
	* ```ts
	* const group = await client.admin.organization.groups.delete(
	*   'group_id',
	* );
	* ```
	*/
	delete(groupID, options) {
		return this._client.delete(path`/organization/groups/${groupID}`, {
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
};
Groups$1.Users = Users$2;
Groups$1.Roles = Roles$4;
//#endregion
//#region node_modules/openai/resources/admin/organization/projects/api-keys.mjs
var APIKeys$1 = class extends APIResource {
	/**
	* Retrieves an API key in the project.
	*
	* @example
	* ```ts
	* const projectAPIKey =
	*   await client.admin.organization.projects.apiKeys.retrieve(
	*     'api_key_id',
	*     { project_id: 'project_id' },
	*   );
	* ```
	*/
	retrieve(apiKeyID, params, options) {
		const { project_id } = params;
		return this._client.get(path`/organization/projects/${project_id}/api_keys/${apiKeyID}`, {
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Returns a list of API keys in the project.
	*
	* @example
	* ```ts
	* // Automatically fetches more pages as needed.
	* for await (const projectAPIKey of client.admin.organization.projects.apiKeys.list(
	*   'project_id',
	* )) {
	*   // ...
	* }
	* ```
	*/
	list(projectID, query = {}, options) {
		return this._client.getAPIList(path`/organization/projects/${projectID}/api_keys`, ConversationCursorPage, {
			query,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Deletes an API key from the project.
	*
	* Returns confirmation of the key deletion, or an error if the key belonged to a
	* service account.
	*
	* @example
	* ```ts
	* const apiKey =
	*   await client.admin.organization.projects.apiKeys.delete(
	*     'api_key_id',
	*     { project_id: 'project_id' },
	*   );
	* ```
	*/
	delete(apiKeyID, params, options) {
		const { project_id } = params;
		return this._client.delete(path`/organization/projects/${project_id}/api_keys/${apiKeyID}`, {
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
};
//#endregion
//#region node_modules/openai/resources/admin/organization/projects/certificates.mjs
var Certificates = class extends APIResource {
	/**
	* List certificates for this project.
	*
	* @example
	* ```ts
	* // Automatically fetches more pages as needed.
	* for await (const certificateListResponse of client.admin.organization.projects.certificates.list(
	*   'project_id',
	* )) {
	*   // ...
	* }
	* ```
	*/
	list(projectID, query = {}, options) {
		return this._client.getAPIList(path`/organization/projects/${projectID}/certificates`, ConversationCursorPage, {
			query,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Activate certificates at the project level.
	*
	* You can atomically and idempotently activate up to 10 certificates at a time.
	*
	* @example
	* ```ts
	* // Automatically fetches more pages as needed.
	* for await (const certificateActivateResponse of client.admin.organization.projects.certificates.activate(
	*   'project_id',
	*   { certificate_ids: ['cert_abc'] },
	* )) {
	*   // ...
	* }
	* ```
	*/
	activate(projectID, body, options) {
		return this._client.getAPIList(path`/organization/projects/${projectID}/certificates/activate`, Page, {
			body,
			method: "post",
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Deactivate certificates at the project level. You can atomically and
	* idempotently deactivate up to 10 certificates at a time.
	*
	* @example
	* ```ts
	* // Automatically fetches more pages as needed.
	* for await (const certificateDeactivateResponse of client.admin.organization.projects.certificates.deactivate(
	*   'project_id',
	*   { certificate_ids: ['cert_abc'] },
	* )) {
	*   // ...
	* }
	* ```
	*/
	deactivate(projectID, body, options) {
		return this._client.getAPIList(path`/organization/projects/${projectID}/certificates/deactivate`, Page, {
			body,
			method: "post",
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
};
//#endregion
//#region node_modules/openai/resources/admin/organization/projects/data-retention.mjs
var DataRetention = class extends APIResource {
	/**
	* Retrieves project data retention controls.
	*
	* @example
	* ```ts
	* const projectDataRetention =
	*   await client.admin.organization.projects.dataRetention.retrieve(
	*     'project_id',
	*   );
	* ```
	*/
	retrieve(projectID, options) {
		return this._client.get(path`/organization/projects/${projectID}/data_retention`, {
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Updates project data retention controls.
	*
	* @example
	* ```ts
	* const projectDataRetention =
	*   await client.admin.organization.projects.dataRetention.update(
	*     'project_id',
	*     { retention_type: 'organization_default' },
	*   );
	* ```
	*/
	update(projectID, body, options) {
		return this._client.post(path`/organization/projects/${projectID}/data_retention`, {
			body,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
};
//#endregion
//#region node_modules/openai/resources/admin/organization/projects/hosted-tool-permissions.mjs
var HostedToolPermissions = class extends APIResource {
	/**
	* Returns hosted tool permissions for a project.
	*
	* @example
	* ```ts
	* const projectHostedToolPermissions =
	*   await client.admin.organization.projects.hostedToolPermissions.retrieve(
	*     'project_id',
	*   );
	* ```
	*/
	retrieve(projectID, options) {
		return this._client.get(path`/organization/projects/${projectID}/hosted_tool_permissions`, {
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Updates hosted tool permissions for a project.
	*
	* @example
	* ```ts
	* const projectHostedToolPermissions =
	*   await client.admin.organization.projects.hostedToolPermissions.update(
	*     'project_id',
	*   );
	* ```
	*/
	update(projectID, body, options) {
		return this._client.post(path`/organization/projects/${projectID}/hosted_tool_permissions`, {
			body,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
};
//#endregion
//#region node_modules/openai/resources/admin/organization/projects/model-permissions.mjs
var ModelPermissions = class extends APIResource {
	/**
	* Returns model permissions for a project.
	*
	* @example
	* ```ts
	* const projectModelPermissions =
	*   await client.admin.organization.projects.modelPermissions.retrieve(
	*     'project_id',
	*   );
	* ```
	*/
	retrieve(projectID, options) {
		return this._client.get(path`/organization/projects/${projectID}/model_permissions`, {
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Updates model permissions for a project.
	*
	* @example
	* ```ts
	* const projectModelPermissions =
	*   await client.admin.organization.projects.modelPermissions.update(
	*     'project_id',
	*     { mode: 'allow_list', model_ids: ['string'] },
	*   );
	* ```
	*/
	update(projectID, body, options) {
		return this._client.post(path`/organization/projects/${projectID}/model_permissions`, {
			body,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Deletes model permissions for a project.
	*
	* @example
	* ```ts
	* const projectModelPermissionsDeleted =
	*   await client.admin.organization.projects.modelPermissions.delete(
	*     'project_id',
	*   );
	* ```
	*/
	delete(projectID, options) {
		return this._client.delete(path`/organization/projects/${projectID}/model_permissions`, {
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
};
//#endregion
//#region node_modules/openai/resources/admin/organization/projects/rate-limits.mjs
var RateLimits = class extends APIResource {
	/**
	* Returns the rate limits per model for a project.
	*
	* @example
	* ```ts
	* // Automatically fetches more pages as needed.
	* for await (const projectRateLimit of client.admin.organization.projects.rateLimits.listRateLimits(
	*   'project_id',
	* )) {
	*   // ...
	* }
	* ```
	*/
	listRateLimits(projectID, query = {}, options) {
		return this._client.getAPIList(path`/organization/projects/${projectID}/rate_limits`, ConversationCursorPage, {
			query,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Updates a project rate limit.
	*
	* @example
	* ```ts
	* const projectRateLimit =
	*   await client.admin.organization.projects.rateLimits.updateRateLimit(
	*     'rate_limit_id',
	*     { project_id: 'project_id' },
	*   );
	* ```
	*/
	updateRateLimit(rateLimitID, params, options) {
		const { project_id, ...body } = params;
		return this._client.post(path`/organization/projects/${project_id}/rate_limits/${rateLimitID}`, {
			body,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
};
//#endregion
//#region node_modules/openai/resources/admin/organization/projects/roles.mjs
var Roles$3 = class extends APIResource {
	/**
	* Creates a custom role for a project.
	*
	* @example
	* ```ts
	* const role =
	*   await client.admin.organization.projects.roles.create(
	*     'project_id',
	*     { permissions: ['string'], role_name: 'role_name' },
	*   );
	* ```
	*/
	create(projectID, body, options) {
		return this._client.post(path`/projects/${projectID}/roles`, {
			body,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Retrieves a project role.
	*
	* @example
	* ```ts
	* const role =
	*   await client.admin.organization.projects.roles.retrieve(
	*     'role_id',
	*     { project_id: 'project_id' },
	*   );
	* ```
	*/
	retrieve(roleID, params, options) {
		const { project_id } = params;
		return this._client.get(path`/projects/${project_id}/roles/${roleID}`, {
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Updates an existing project role.
	*
	* @example
	* ```ts
	* const role =
	*   await client.admin.organization.projects.roles.update(
	*     'role_id',
	*     { project_id: 'project_id' },
	*   );
	* ```
	*/
	update(roleID, params, options) {
		const { project_id, ...body } = params;
		return this._client.post(path`/projects/${project_id}/roles/${roleID}`, {
			body,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Lists the roles configured for a project.
	*
	* @example
	* ```ts
	* // Automatically fetches more pages as needed.
	* for await (const role of client.admin.organization.projects.roles.list(
	*   'project_id',
	* )) {
	*   // ...
	* }
	* ```
	*/
	list(projectID, query = {}, options) {
		return this._client.getAPIList(path`/projects/${projectID}/roles`, NextCursorPage, {
			query,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Deletes a custom role from a project.
	*
	* @example
	* ```ts
	* const role =
	*   await client.admin.organization.projects.roles.delete(
	*     'role_id',
	*     { project_id: 'project_id' },
	*   );
	* ```
	*/
	delete(roleID, params, options) {
		const { project_id } = params;
		return this._client.delete(path`/projects/${project_id}/roles/${roleID}`, {
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
};
//#endregion
//#region node_modules/openai/resources/admin/organization/projects/spend-alerts.mjs
var SpendAlerts = class extends APIResource {
	/**
	* Creates a project spend alert.
	*
	* @example
	* ```ts
	* const projectSpendAlert =
	*   await client.admin.organization.projects.spendAlerts.create(
	*     'project_id',
	*     {
	*       currency: 'USD',
	*       interval: 'month',
	*       notification_channel: {
	*         recipients: ['string'],
	*         type: 'email',
	*       },
	*       threshold_amount: 0,
	*     },
	*   );
	* ```
	*/
	create(projectID, body, options) {
		return this._client.post(path`/organization/projects/${projectID}/spend_alerts`, {
			body,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Retrieves a project spend alert.
	*
	* @example
	* ```ts
	* const projectSpendAlert =
	*   await client.admin.organization.projects.spendAlerts.retrieve(
	*     'alert_id',
	*     { project_id: 'project_id' },
	*   );
	* ```
	*/
	retrieve(alertID, params, options) {
		const { project_id } = params;
		return this._client.get(path`/organization/projects/${project_id}/spend_alerts/${alertID}`, {
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Updates a project spend alert.
	*
	* @example
	* ```ts
	* const projectSpendAlert =
	*   await client.admin.organization.projects.spendAlerts.update(
	*     'alert_id',
	*     {
	*       project_id: 'project_id',
	*       currency: 'USD',
	*       interval: 'month',
	*       notification_channel: {
	*         recipients: ['string'],
	*         type: 'email',
	*       },
	*       threshold_amount: 0,
	*     },
	*   );
	* ```
	*/
	update(alertID, params, options) {
		const { project_id, ...body } = params;
		return this._client.post(path`/organization/projects/${project_id}/spend_alerts/${alertID}`, {
			body,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Lists project spend alerts.
	*
	* @example
	* ```ts
	* // Automatically fetches more pages as needed.
	* for await (const projectSpendAlert of client.admin.organization.projects.spendAlerts.list(
	*   'project_id',
	* )) {
	*   // ...
	* }
	* ```
	*/
	list(projectID, query = {}, options) {
		return this._client.getAPIList(path`/organization/projects/${projectID}/spend_alerts`, ConversationCursorPage, {
			query,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Deletes a project spend alert.
	*
	* @example
	* ```ts
	* const projectSpendAlertDeleted =
	*   await client.admin.organization.projects.spendAlerts.delete(
	*     'alert_id',
	*     { project_id: 'project_id' },
	*   );
	* ```
	*/
	delete(alertID, params, options) {
		const { project_id } = params;
		return this._client.delete(path`/organization/projects/${project_id}/spend_alerts/${alertID}`, {
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
};
//#endregion
//#region node_modules/openai/resources/admin/organization/projects/spend-limit.mjs
var SpendLimit = class extends APIResource {
	/**
	* Get a project's hard spend limit.
	*
	* @example
	* ```ts
	* const projectSpendLimit =
	*   await client.admin.organization.projects.spendLimit.retrieve(
	*     'proj_123',
	*   );
	* ```
	*/
	retrieve(projectID, options) {
		return this._client.get(path`/organization/projects/${projectID}/spend_limit`, {
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Create or replace a project's hard spend limit.
	*
	* @example
	* ```ts
	* const projectSpendLimit =
	*   await client.admin.organization.projects.spendLimit.update(
	*     'proj_123',
	*     {
	*       currency: 'USD',
	*       interval: 'month',
	*       threshold_amount: 1,
	*     },
	*   );
	* ```
	*/
	update(projectID, body, options) {
		return this._client.post(path`/organization/projects/${projectID}/spend_limit`, {
			body,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Delete a project's hard spend limit.
	*
	* @example
	* ```ts
	* const projectSpendLimitDeleted =
	*   await client.admin.organization.projects.spendLimit.delete(
	*     'proj_123',
	*   );
	* ```
	*/
	delete(projectID, options) {
		return this._client.delete(path`/organization/projects/${projectID}/spend_limit`, {
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
};
//#endregion
//#region node_modules/openai/resources/admin/organization/projects/groups/roles.mjs
var Roles$2 = class extends APIResource {
	/**
	* Assigns a project role to a group within a project.
	*
	* @example
	* ```ts
	* const role =
	*   await client.admin.organization.projects.groups.roles.create(
	*     'group_id',
	*     { project_id: 'project_id', role_id: 'role_id' },
	*   );
	* ```
	*/
	create(groupID, params, options) {
		const { project_id, ...body } = params;
		return this._client.post(path`/projects/${project_id}/groups/${groupID}/roles`, {
			body,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Retrieves a project role assigned to a group.
	*
	* @example
	* ```ts
	* const role =
	*   await client.admin.organization.projects.groups.roles.retrieve(
	*     'role_id',
	*     { project_id: 'project_id', group_id: 'group_id' },
	*   );
	* ```
	*/
	retrieve(roleID, params, options) {
		const { project_id, group_id } = params;
		return this._client.get(path`/projects/${project_id}/groups/${group_id}/roles/${roleID}`, {
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Lists the project roles assigned to a group within a project.
	*
	* @example
	* ```ts
	* // Automatically fetches more pages as needed.
	* for await (const roleListResponse of client.admin.organization.projects.groups.roles.list(
	*   'group_id',
	*   { project_id: 'project_id' },
	* )) {
	*   // ...
	* }
	* ```
	*/
	list(groupID, params, options) {
		const { project_id, ...query } = params;
		return this._client.getAPIList(path`/projects/${project_id}/groups/${groupID}/roles`, NextCursorPage, {
			query,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Unassigns a project role from a group within a project.
	*
	* @example
	* ```ts
	* const role =
	*   await client.admin.organization.projects.groups.roles.delete(
	*     'role_id',
	*     { project_id: 'project_id', group_id: 'group_id' },
	*   );
	* ```
	*/
	delete(roleID, params, options) {
		const { project_id, group_id } = params;
		return this._client.delete(path`/projects/${project_id}/groups/${group_id}/roles/${roleID}`, {
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
};
//#endregion
//#region node_modules/openai/resources/admin/organization/projects/groups/groups.mjs
var Groups = class extends APIResource {
	constructor() {
		super(...arguments);
		this.roles = new Roles$2(this._client);
	}
	/**
	* Grants a group access to a project.
	*
	* @example
	* ```ts
	* const projectGroup =
	*   await client.admin.organization.projects.groups.create(
	*     'project_id',
	*     { group_id: 'group_id', role: 'role' },
	*   );
	* ```
	*/
	create(projectID, body, options) {
		return this._client.post(path`/organization/projects/${projectID}/groups`, {
			body,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Retrieves a project's group.
	*
	* @example
	* ```ts
	* const projectGroup =
	*   await client.admin.organization.projects.groups.retrieve(
	*     'group_id',
	*     { project_id: 'project_id' },
	*   );
	* ```
	*/
	retrieve(groupID, params, options) {
		const { project_id, ...query } = params;
		return this._client.get(path`/organization/projects/${project_id}/groups/${groupID}`, {
			query,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Lists the groups that have access to a project.
	*
	* @example
	* ```ts
	* // Automatically fetches more pages as needed.
	* for await (const projectGroup of client.admin.organization.projects.groups.list(
	*   'project_id',
	* )) {
	*   // ...
	* }
	* ```
	*/
	list(projectID, query = {}, options) {
		return this._client.getAPIList(path`/organization/projects/${projectID}/groups`, NextCursorPage, {
			query,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Revokes a group's access to a project.
	*
	* @example
	* ```ts
	* const group =
	*   await client.admin.organization.projects.groups.delete(
	*     'group_id',
	*     { project_id: 'project_id' },
	*   );
	* ```
	*/
	delete(groupID, params, options) {
		const { project_id } = params;
		return this._client.delete(path`/organization/projects/${project_id}/groups/${groupID}`, {
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
};
Groups.Roles = Roles$2;
//#endregion
//#region node_modules/openai/resources/admin/organization/projects/service-accounts/api-keys.mjs
var APIKeys = class extends APIResource {
	/**
	* Creates an API key for a service account in the project.
	*
	* @example
	* ```ts
	* const apiKey =
	*   await client.admin.organization.projects.serviceAccounts.apiKeys.create(
	*     'service_account_id',
	*     { project_id: 'project_id' },
	*   );
	* ```
	*/
	create(serviceAccountID, params, options) {
		const { project_id, ...body } = params;
		return this._client.post(path`/organization/projects/${project_id}/service_accounts/${serviceAccountID}/api_keys`, {
			body,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
};
//#endregion
//#region node_modules/openai/resources/admin/organization/projects/service-accounts/service-accounts.mjs
var ServiceAccounts = class extends APIResource {
	constructor() {
		super(...arguments);
		this.apiKeys = new APIKeys(this._client);
	}
	/**
	* Creates a new service account in the project. By default, this also returns an
	* unredacted API key for the service account.
	*
	* @example
	* ```ts
	* const serviceAccount =
	*   await client.admin.organization.projects.serviceAccounts.create(
	*     'project_id',
	*     { name: 'name' },
	*   );
	* ```
	*/
	create(projectID, body, options) {
		return this._client.post(path`/organization/projects/${projectID}/service_accounts`, {
			body,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Retrieves a service account in the project.
	*
	* @example
	* ```ts
	* const projectServiceAccount =
	*   await client.admin.organization.projects.serviceAccounts.retrieve(
	*     'service_account_id',
	*     { project_id: 'project_id' },
	*   );
	* ```
	*/
	retrieve(serviceAccountID, params, options) {
		const { project_id } = params;
		return this._client.get(path`/organization/projects/${project_id}/service_accounts/${serviceAccountID}`, {
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Updates a service account in the project.
	*
	* @example
	* ```ts
	* const projectServiceAccount =
	*   await client.admin.organization.projects.serviceAccounts.update(
	*     'service_account_id',
	*     { project_id: 'project_id' },
	*   );
	* ```
	*/
	update(serviceAccountID, params, options) {
		const { project_id, ...body } = params;
		return this._client.post(path`/organization/projects/${project_id}/service_accounts/${serviceAccountID}`, {
			body,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Returns a list of service accounts in the project.
	*
	* @example
	* ```ts
	* // Automatically fetches more pages as needed.
	* for await (const projectServiceAccount of client.admin.organization.projects.serviceAccounts.list(
	*   'project_id',
	* )) {
	*   // ...
	* }
	* ```
	*/
	list(projectID, query = {}, options) {
		return this._client.getAPIList(path`/organization/projects/${projectID}/service_accounts`, ConversationCursorPage, {
			query,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Deletes a service account from the project.
	*
	* Returns confirmation of service account deletion, or an error if the project is
	* archived (archived projects have no service accounts).
	*
	* @example
	* ```ts
	* const serviceAccount =
	*   await client.admin.organization.projects.serviceAccounts.delete(
	*     'service_account_id',
	*     { project_id: 'project_id' },
	*   );
	* ```
	*/
	delete(serviceAccountID, params, options) {
		const { project_id } = params;
		return this._client.delete(path`/organization/projects/${project_id}/service_accounts/${serviceAccountID}`, {
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
};
ServiceAccounts.APIKeys = APIKeys;
//#endregion
//#region node_modules/openai/resources/admin/organization/projects/users/roles.mjs
var Roles$1 = class extends APIResource {
	/**
	* Assigns a project role to a user within a project.
	*
	* @example
	* ```ts
	* const role =
	*   await client.admin.organization.projects.users.roles.create(
	*     'user_id',
	*     { project_id: 'project_id', role_id: 'role_id' },
	*   );
	* ```
	*/
	create(userID, params, options) {
		const { project_id, ...body } = params;
		return this._client.post(path`/projects/${project_id}/users/${userID}/roles`, {
			body,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Retrieves a project role assigned to a user.
	*
	* @example
	* ```ts
	* const role =
	*   await client.admin.organization.projects.users.roles.retrieve(
	*     'role_id',
	*     { project_id: 'project_id', user_id: 'user_id' },
	*   );
	* ```
	*/
	retrieve(roleID, params, options) {
		const { project_id, user_id } = params;
		return this._client.get(path`/projects/${project_id}/users/${user_id}/roles/${roleID}`, {
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Lists the project roles assigned to a user within a project.
	*
	* @example
	* ```ts
	* // Automatically fetches more pages as needed.
	* for await (const roleListResponse of client.admin.organization.projects.users.roles.list(
	*   'user_id',
	*   { project_id: 'project_id' },
	* )) {
	*   // ...
	* }
	* ```
	*/
	list(userID, params, options) {
		const { project_id, ...query } = params;
		return this._client.getAPIList(path`/projects/${project_id}/users/${userID}/roles`, NextCursorPage, {
			query,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Unassigns a project role from a user within a project.
	*
	* @example
	* ```ts
	* const role =
	*   await client.admin.organization.projects.users.roles.delete(
	*     'role_id',
	*     { project_id: 'project_id', user_id: 'user_id' },
	*   );
	* ```
	*/
	delete(roleID, params, options) {
		const { project_id, user_id } = params;
		return this._client.delete(path`/projects/${project_id}/users/${user_id}/roles/${roleID}`, {
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
};
//#endregion
//#region node_modules/openai/resources/admin/organization/projects/users/users.mjs
var Users$1 = class extends APIResource {
	constructor() {
		super(...arguments);
		this.roles = new Roles$1(this._client);
	}
	/**
	* Adds a user to the project. Users must already be members of the organization to
	* be added to a project.
	*
	* @example
	* ```ts
	* const projectUser =
	*   await client.admin.organization.projects.users.create(
	*     'project_id',
	*     { role: 'role' },
	*   );
	* ```
	*/
	create(projectID, body, options) {
		return this._client.post(path`/organization/projects/${projectID}/users`, {
			body,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Retrieves a user in the project.
	*
	* @example
	* ```ts
	* const projectUser =
	*   await client.admin.organization.projects.users.retrieve(
	*     'user_id',
	*     { project_id: 'project_id' },
	*   );
	* ```
	*/
	retrieve(userID, params, options) {
		const { project_id } = params;
		return this._client.get(path`/organization/projects/${project_id}/users/${userID}`, {
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Modifies a user's role in the project.
	*
	* @example
	* ```ts
	* const projectUser =
	*   await client.admin.organization.projects.users.update(
	*     'user_id',
	*     { project_id: 'project_id' },
	*   );
	* ```
	*/
	update(userID, params, options) {
		const { project_id, ...body } = params;
		return this._client.post(path`/organization/projects/${project_id}/users/${userID}`, {
			body,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Returns a list of users in the project.
	*
	* @example
	* ```ts
	* // Automatically fetches more pages as needed.
	* for await (const projectUser of client.admin.organization.projects.users.list(
	*   'project_id',
	* )) {
	*   // ...
	* }
	* ```
	*/
	list(projectID, query = {}, options) {
		return this._client.getAPIList(path`/organization/projects/${projectID}/users`, ConversationCursorPage, {
			query,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Deletes a user from the project.
	*
	* Returns confirmation of project user deletion, or an error if the project is
	* archived (archived projects have no users).
	*
	* @example
	* ```ts
	* const user =
	*   await client.admin.organization.projects.users.delete(
	*     'user_id',
	*     { project_id: 'project_id' },
	*   );
	* ```
	*/
	delete(userID, params, options) {
		const { project_id } = params;
		return this._client.delete(path`/organization/projects/${project_id}/users/${userID}`, {
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
};
Users$1.Roles = Roles$1;
//#endregion
//#region node_modules/openai/resources/admin/organization/projects/projects.mjs
var Projects = class extends APIResource {
	constructor() {
		super(...arguments);
		this.users = new Users$1(this._client);
		this.serviceAccounts = new ServiceAccounts(this._client);
		this.apiKeys = new APIKeys$1(this._client);
		this.rateLimits = new RateLimits(this._client);
		this.modelPermissions = new ModelPermissions(this._client);
		this.hostedToolPermissions = new HostedToolPermissions(this._client);
		this.groups = new Groups(this._client);
		this.roles = new Roles$3(this._client);
		this.dataRetention = new DataRetention(this._client);
		this.spendLimit = new SpendLimit(this._client);
		this.spendAlerts = new SpendAlerts(this._client);
		this.certificates = new Certificates(this._client);
	}
	/**
	* Create a new project in the organization. Projects can be created and archived,
	* but cannot be deleted.
	*
	* @example
	* ```ts
	* const project =
	*   await client.admin.organization.projects.create({
	*     name: 'name',
	*   });
	* ```
	*/
	create(body, options) {
		return this._client.post("/organization/projects", {
			body,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Retrieves a project.
	*
	* @example
	* ```ts
	* const project =
	*   await client.admin.organization.projects.retrieve(
	*     'project_id',
	*   );
	* ```
	*/
	retrieve(projectID, options) {
		return this._client.get(path`/organization/projects/${projectID}`, {
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Modifies a project in the organization.
	*
	* @example
	* ```ts
	* const project =
	*   await client.admin.organization.projects.update(
	*     'project_id',
	*   );
	* ```
	*/
	update(projectID, body, options) {
		return this._client.post(path`/organization/projects/${projectID}`, {
			body,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Returns a list of projects.
	*
	* @example
	* ```ts
	* // Automatically fetches more pages as needed.
	* for await (const project of client.admin.organization.projects.list()) {
	*   // ...
	* }
	* ```
	*/
	list(query = {}, options) {
		return this._client.getAPIList("/organization/projects", ConversationCursorPage, {
			query,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Archives a project in the organization. Archived projects cannot be used or
	* updated.
	*
	* @example
	* ```ts
	* const project =
	*   await client.admin.organization.projects.archive(
	*     'project_id',
	*   );
	* ```
	*/
	archive(projectID, options) {
		return this._client.post(path`/organization/projects/${projectID}/archive`, {
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
};
Projects.Users = Users$1;
Projects.ServiceAccounts = ServiceAccounts;
Projects.APIKeys = APIKeys$1;
Projects.RateLimits = RateLimits;
Projects.ModelPermissions = ModelPermissions;
Projects.HostedToolPermissions = HostedToolPermissions;
Projects.Groups = Groups;
Projects.Roles = Roles$3;
Projects.DataRetention = DataRetention;
Projects.SpendLimit = SpendLimit;
Projects.SpendAlerts = SpendAlerts;
Projects.Certificates = Certificates;
//#endregion
//#region node_modules/openai/resources/admin/organization/users/roles.mjs
var Roles = class extends APIResource {
	/**
	* Assigns an organization role to a user within the organization.
	*
	* @example
	* ```ts
	* const role =
	*   await client.admin.organization.users.roles.create(
	*     'user_id',
	*     { role_id: 'role_id' },
	*   );
	* ```
	*/
	create(userID, body, options) {
		return this._client.post(path`/organization/users/${userID}/roles`, {
			body,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Retrieves an organization role assigned to a user.
	*
	* @example
	* ```ts
	* const role =
	*   await client.admin.organization.users.roles.retrieve(
	*     'role_id',
	*     { user_id: 'user_id' },
	*   );
	* ```
	*/
	retrieve(roleID, params, options) {
		const { user_id } = params;
		return this._client.get(path`/organization/users/${user_id}/roles/${roleID}`, {
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Lists the organization roles assigned to a user within the organization.
	*
	* @example
	* ```ts
	* // Automatically fetches more pages as needed.
	* for await (const roleListResponse of client.admin.organization.users.roles.list(
	*   'user_id',
	* )) {
	*   // ...
	* }
	* ```
	*/
	list(userID, query = {}, options) {
		return this._client.getAPIList(path`/organization/users/${userID}/roles`, NextCursorPage, {
			query,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Unassigns an organization role from a user within the organization.
	*
	* @example
	* ```ts
	* const role =
	*   await client.admin.organization.users.roles.delete(
	*     'role_id',
	*     { user_id: 'user_id' },
	*   );
	* ```
	*/
	delete(roleID, params, options) {
		const { user_id } = params;
		return this._client.delete(path`/organization/users/${user_id}/roles/${roleID}`, {
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
};
//#endregion
//#region node_modules/openai/resources/admin/organization/users/users.mjs
var Users = class extends APIResource {
	constructor() {
		super(...arguments);
		this.roles = new Roles(this._client);
	}
	/**
	* Retrieves a user by their identifier.
	*
	* @example
	* ```ts
	* const organizationUser =
	*   await client.admin.organization.users.retrieve('user_id');
	* ```
	*/
	retrieve(userID, options) {
		return this._client.get(path`/organization/users/${userID}`, {
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Modifies a user's role in the organization.
	*
	* @example
	* ```ts
	* const organizationUser =
	*   await client.admin.organization.users.update('user_id');
	* ```
	*/
	update(userID, body, options) {
		return this._client.post(path`/organization/users/${userID}`, {
			body,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Lists all of the users in the organization.
	*
	* @example
	* ```ts
	* // Automatically fetches more pages as needed.
	* for await (const organizationUser of client.admin.organization.users.list()) {
	*   // ...
	* }
	* ```
	*/
	list(query = {}, options) {
		return this._client.getAPIList("/organization/users", ConversationCursorPage, {
			query,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* Deletes a user from the organization.
	*
	* @example
	* ```ts
	* const user = await client.admin.organization.users.delete(
	*   'user_id',
	* );
	* ```
	*/
	delete(userID, options) {
		return this._client.delete(path`/organization/users/${userID}`, {
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
};
Users.Roles = Roles;
//#endregion
//#region node_modules/openai/resources/admin/organization/organization.mjs
var Organization = class extends APIResource {
	constructor() {
		super(...arguments);
		this.auditLogs = new AuditLogs(this._client);
		this.adminAPIKeys = new AdminAPIKeys(this._client);
		this.usage = new Usage(this._client);
		this.invites = new Invites(this._client);
		this.users = new Users(this._client);
		this.groups = new Groups$1(this._client);
		this.roles = new Roles$5(this._client);
		this.dataRetention = new DataRetention$1(this._client);
		this.spendLimit = new SpendLimit$1(this._client);
		this.spendAlerts = new SpendAlerts$1(this._client);
		this.certificates = new Certificates$1(this._client);
		this.projects = new Projects(this._client);
	}
};
Organization.AuditLogs = AuditLogs;
Organization.AdminAPIKeys = AdminAPIKeys;
Organization.Usage = Usage;
Organization.Invites = Invites;
Organization.Users = Users;
Organization.Groups = Groups$1;
Organization.Roles = Roles$5;
Organization.DataRetention = DataRetention$1;
Organization.SpendLimit = SpendLimit$1;
Organization.SpendAlerts = SpendAlerts$1;
Organization.Certificates = Certificates$1;
Organization.Projects = Projects;
//#endregion
//#region node_modules/openai/resources/admin/admin.mjs
var Admin = class extends APIResource {
	constructor() {
		super(...arguments);
		this.organization = new Organization(this._client);
	}
};
Admin.Organization = Organization;
//#endregion
//#region node_modules/openai/resources/audio/speech.mjs
/**
* Turn audio into text or text into audio.
*/
var Speech = class extends APIResource {
	/**
	* Generates audio from the input text.
	*
	* Returns the audio file content, or a stream of audio events.
	*
	* @example
	* ```ts
	* const speech = await client.audio.speech.create({
	*   input: 'input',
	*   model: 'tts-1',
	*   voice: 'alloy',
	* });
	*
	* const content = await speech.blob();
	* console.log(content);
	* ```
	*/
	create(body, options) {
		return this._client.post("/audio/speech", {
			body,
			...options,
			headers: buildHeaders([{ Accept: "application/octet-stream" }, options?.headers]),
			__security: { bearerAuth: true },
			__binaryResponse: true
		});
	}
};
//#endregion
//#region node_modules/openai/resources/audio/transcriptions.mjs
/**
* Turn audio into text or text into audio.
*/
var Transcriptions = class extends APIResource {
	create(body, options) {
		return this._client.post("/audio/transcriptions", multipartFormRequestOptions({
			body,
			...options,
			stream: body.stream ?? false,
			__metadata: { model: body.model },
			__security: { bearerAuth: true }
		}, this._client));
	}
};
//#endregion
//#region node_modules/openai/resources/audio/translations.mjs
/**
* Turn audio into text or text into audio.
*/
var Translations = class extends APIResource {
	create(body, options) {
		return this._client.post("/audio/translations", multipartFormRequestOptions({
			body,
			...options,
			__metadata: { model: body.model },
			__security: { bearerAuth: true }
		}, this._client));
	}
};
//#endregion
//#region node_modules/openai/resources/audio/audio.mjs
var Audio = class extends APIResource {
	constructor() {
		super(...arguments);
		this.transcriptions = new Transcriptions(this._client);
		this.translations = new Translations(this._client);
		this.speech = new Speech(this._client);
	}
};
Audio.Transcriptions = Transcriptions;
Audio.Translations = Translations;
Audio.Speech = Speech;
//#endregion
//#region node_modules/openai/resources/batches.mjs
/**
* Create large batches of API requests to run asynchronously.
*/
var Batches = class extends APIResource {
	/**
	* Creates and executes a batch from an uploaded file of requests
	*/
	create(body, options) {
		return this._client.post("/batches", {
			body,
			...options,
			__security: { bearerAuth: true }
		});
	}
	/**
	* Retrieves a batch.
	*/
	retrieve(batchID, options) {
		return this._client.get(path`/batches/${batchID}`, {
			...options,
			__security: { bearerAuth: true }
		});
	}
	/**
	* List your organization's batches.
	*/
	list(query = {}, options) {
		return this._client.getAPIList("/batches", CursorPage, {
			query,
			...options,
			__security: { bearerAuth: true }
		});
	}
	/**
	* Cancels an in-progress batch. The batch will be in status `cancelling` for up to
	* 10 minutes, before changing to `cancelled`, where it will have partial results
	* (if any) available in the output file.
	*/
	cancel(batchID, options) {
		return this._client.post(path`/batches/${batchID}/cancel`, {
			...options,
			__security: { bearerAuth: true }
		});
	}
};
//#endregion
//#region node_modules/openai/resources/beta/assistants.mjs
/**
* Build Assistants that can call models and use tools.
*/
var Assistants = class extends APIResource {
	/**
	* Create an assistant with a model and instructions.
	*
	* @deprecated
	*/
	create(body, options) {
		return this._client.post("/assistants", {
			body,
			...options,
			headers: buildHeaders([{ "OpenAI-Beta": "assistants=v2" }, options?.headers]),
			__security: { bearerAuth: true }
		});
	}
	/**
	* Retrieves an assistant.
	*
	* @deprecated
	*/
	retrieve(assistantID, options) {
		return this._client.get(path`/assistants/${assistantID}`, {
			...options,
			headers: buildHeaders([{ "OpenAI-Beta": "assistants=v2" }, options?.headers]),
			__security: { bearerAuth: true }
		});
	}
	/**
	* Modifies an assistant.
	*
	* @deprecated
	*/
	update(assistantID, body, options) {
		return this._client.post(path`/assistants/${assistantID}`, {
			body,
			...options,
			headers: buildHeaders([{ "OpenAI-Beta": "assistants=v2" }, options?.headers]),
			__security: { bearerAuth: true }
		});
	}
	/**
	* Returns a list of assistants.
	*
	* @deprecated
	*/
	list(query = {}, options) {
		return this._client.getAPIList("/assistants", CursorPage, {
			query,
			...options,
			headers: buildHeaders([{ "OpenAI-Beta": "assistants=v2" }, options?.headers]),
			__security: { bearerAuth: true }
		});
	}
	/**
	* Delete an assistant.
	*
	* @deprecated
	*/
	delete(assistantID, options) {
		return this._client.delete(path`/assistants/${assistantID}`, {
			...options,
			headers: buildHeaders([{ "OpenAI-Beta": "assistants=v2" }, options?.headers]),
			__security: { bearerAuth: true }
		});
	}
};
//#endregion
//#region node_modules/openai/resources/beta/realtime/sessions.mjs
var Sessions$1 = class extends APIResource {
	/**
	* Create an ephemeral API token for use in client-side applications with the
	* Realtime API. Can be configured with the same session parameters as the
	* `session.update` client event.
	*
	* It responds with a session object, plus a `client_secret` key which contains a
	* usable ephemeral API token that can be used to authenticate browser clients for
	* the Realtime API.
	*
	* @example
	* ```ts
	* const session =
	*   await client.beta.realtime.sessions.create();
	* ```
	*/
	create(body, options) {
		return this._client.post("/realtime/sessions", {
			body,
			...options,
			headers: buildHeaders([{ "OpenAI-Beta": "assistants=v2" }, options?.headers]),
			__security: { bearerAuth: true }
		});
	}
};
//#endregion
//#region node_modules/openai/resources/beta/realtime/transcription-sessions.mjs
var TranscriptionSessions = class extends APIResource {
	/**
	* Create an ephemeral API token for use in client-side applications with the
	* Realtime API specifically for realtime transcriptions. Can be configured with
	* the same session parameters as the `transcription_session.update` client event.
	*
	* It responds with a session object, plus a `client_secret` key which contains a
	* usable ephemeral API token that can be used to authenticate browser clients for
	* the Realtime API.
	*
	* @example
	* ```ts
	* const transcriptionSession =
	*   await client.beta.realtime.transcriptionSessions.create();
	* ```
	*/
	create(body, options) {
		return this._client.post("/realtime/transcription_sessions", {
			body,
			...options,
			headers: buildHeaders([{ "OpenAI-Beta": "assistants=v2" }, options?.headers]),
			__security: { bearerAuth: true }
		});
	}
};
//#endregion
//#region node_modules/openai/resources/beta/realtime/realtime.mjs
/**
* @deprecated Realtime has now launched and is generally available. The old beta API is now deprecated.
*/
var Realtime$1 = class extends APIResource {
	constructor() {
		super(...arguments);
		this.sessions = new Sessions$1(this._client);
		this.transcriptionSessions = new TranscriptionSessions(this._client);
	}
};
Realtime$1.Sessions = Sessions$1;
Realtime$1.TranscriptionSessions = TranscriptionSessions;
//#endregion
//#region node_modules/openai/resources/beta/chatkit/sessions.mjs
var Sessions = class extends APIResource {
	/**
	* Create a ChatKit session.
	*
	* @example
	* ```ts
	* const chatSession =
	*   await client.beta.chatkit.sessions.create({
	*     user: 'x',
	*     workflow: { id: 'id' },
	*   });
	* ```
	*/
	create(body, options) {
		return this._client.post("/chatkit/sessions", {
			body,
			...options,
			headers: buildHeaders([{ "OpenAI-Beta": "chatkit_beta=v1" }, options?.headers]),
			__security: { bearerAuth: true }
		});
	}
	/**
	* Cancel an active ChatKit session and return its most recent metadata.
	*
	* Cancelling prevents new requests from using the issued client secret.
	*
	* @example
	* ```ts
	* const chatSession =
	*   await client.beta.chatkit.sessions.cancel('cksess_123');
	* ```
	*/
	cancel(sessionID, options) {
		return this._client.post(path`/chatkit/sessions/${sessionID}/cancel`, {
			...options,
			headers: buildHeaders([{ "OpenAI-Beta": "chatkit_beta=v1" }, options?.headers]),
			__security: { bearerAuth: true }
		});
	}
};
//#endregion
//#region node_modules/openai/resources/beta/chatkit/threads.mjs
var Threads$1 = class extends APIResource {
	/**
	* Retrieve a ChatKit thread by its identifier.
	*
	* @example
	* ```ts
	* const chatkitThread =
	*   await client.beta.chatkit.threads.retrieve('cthr_123');
	* ```
	*/
	retrieve(threadID, options) {
		return this._client.get(path`/chatkit/threads/${threadID}`, {
			...options,
			headers: buildHeaders([{ "OpenAI-Beta": "chatkit_beta=v1" }, options?.headers]),
			__security: { bearerAuth: true }
		});
	}
	/**
	* List ChatKit threads with optional pagination and user filters.
	*
	* @example
	* ```ts
	* // Automatically fetches more pages as needed.
	* for await (const chatkitThread of client.beta.chatkit.threads.list()) {
	*   // ...
	* }
	* ```
	*/
	list(query = {}, options) {
		return this._client.getAPIList("/chatkit/threads", ConversationCursorPage, {
			query,
			...options,
			headers: buildHeaders([{ "OpenAI-Beta": "chatkit_beta=v1" }, options?.headers]),
			__security: { bearerAuth: true }
		});
	}
	/**
	* Delete a ChatKit thread along with its items and stored attachments.
	*
	* @example
	* ```ts
	* const thread = await client.beta.chatkit.threads.delete(
	*   'cthr_123',
	* );
	* ```
	*/
	delete(threadID, options) {
		return this._client.delete(path`/chatkit/threads/${threadID}`, {
			...options,
			headers: buildHeaders([{ "OpenAI-Beta": "chatkit_beta=v1" }, options?.headers]),
			__security: { bearerAuth: true }
		});
	}
	/**
	* List items that belong to a ChatKit thread.
	*
	* @example
	* ```ts
	* // Automatically fetches more pages as needed.
	* for await (const thread of client.beta.chatkit.threads.listItems(
	*   'cthr_123',
	* )) {
	*   // ...
	* }
	* ```
	*/
	listItems(threadID, query = {}, options) {
		return this._client.getAPIList(path`/chatkit/threads/${threadID}/items`, ConversationCursorPage, {
			query,
			...options,
			headers: buildHeaders([{ "OpenAI-Beta": "chatkit_beta=v1" }, options?.headers]),
			__security: { bearerAuth: true }
		});
	}
};
//#endregion
//#region node_modules/openai/resources/beta/chatkit/chatkit.mjs
var ChatKit = class extends APIResource {
	constructor() {
		super(...arguments);
		this.sessions = new Sessions(this._client);
		this.threads = new Threads$1(this._client);
	}
};
ChatKit.Sessions = Sessions;
ChatKit.Threads = Threads$1;
//#endregion
//#region node_modules/openai/resources/beta/responses/input-items.mjs
var InputItems$1 = class extends APIResource {
	/**
	* Returns a list of input items for a given response.
	*
	* @example
	* ```ts
	* // Automatically fetches more pages as needed.
	* for await (const betaResponseItem of client.beta.responses.inputItems.list(
	*   'response_id',
	* )) {
	*   // ...
	* }
	* ```
	*/
	list(responseID, params = {}, options) {
		const { betas, ...query } = params ?? {};
		return this._client.getAPIList(path`/responses/${responseID}/input_items?beta=true`, CursorPage, {
			query,
			...options,
			headers: buildHeaders([{ ...betas?.toString() != null ? { "openai-beta": betas?.toString() } : void 0 }, options?.headers]),
			__security: { bearerAuth: true }
		});
	}
};
//#endregion
//#region node_modules/openai/resources/beta/responses/input-tokens.mjs
var InputTokens$1 = class extends APIResource {
	/**
	* Returns input token counts of the request.
	*
	* Returns an object with `object` set to `response.input_tokens` and an
	* `input_tokens` count.
	*
	* @example
	* ```ts
	* const response =
	*   await client.beta.responses.inputTokens.count();
	* ```
	*/
	count(params = {}, options) {
		const { betas, ...body } = params ?? {};
		return this._client.post("/responses/input_tokens?beta=true", {
			body,
			...options,
			headers: buildHeaders([{ ...betas?.toString() != null ? { "openai-beta": betas?.toString() } : void 0 }, options?.headers]),
			__security: { bearerAuth: true }
		});
	}
};
//#endregion
//#region node_modules/openai/resources/beta/responses/responses.mjs
var Responses$1 = class extends APIResource {
	constructor() {
		super(...arguments);
		this.inputItems = new InputItems$1(this._client);
		this.inputTokens = new InputTokens$1(this._client);
	}
	create(params, options) {
		const { betas, ...body } = params;
		return this._client.post("/responses?beta=true", {
			body,
			...options,
			headers: buildHeaders([{ ...betas?.toString() != null ? { "openai-beta": betas?.toString() } : void 0 }, options?.headers]),
			stream: params.stream ?? false,
			__security: { bearerAuth: true }
		});
	}
	retrieve(responseID, params = {}, options) {
		const { betas, ...query } = params ?? {};
		return this._client.get(path`/responses/${responseID}?beta=true`, {
			query,
			...options,
			headers: buildHeaders([{ ...betas?.toString() != null ? { "openai-beta": betas?.toString() } : void 0 }, options?.headers]),
			stream: params?.stream ?? false,
			__security: { bearerAuth: true }
		});
	}
	/**
	* Deletes a model response with the given ID.
	*
	* @example
	* ```ts
	* await client.beta.responses.delete(
	*   'resp_677efb5139a88190b512bc3fef8e535d',
	* );
	* ```
	*/
	delete(responseID, params = {}, options) {
		const { betas } = params ?? {};
		return this._client.delete(path`/responses/${responseID}?beta=true`, {
			...options,
			headers: buildHeaders([{
				Accept: "*/*",
				...betas?.toString() != null ? { "openai-beta": betas?.toString() } : void 0
			}, options?.headers]),
			__security: { bearerAuth: true }
		});
	}
	/**
	* Cancels a model response with the given ID. Only responses created with the
	* `background` parameter set to `true` can be cancelled.
	* [Learn more](https://platform.openai.com/docs/guides/background).
	*
	* @example
	* ```ts
	* const betaResponse = await client.beta.responses.cancel(
	*   'resp_677efb5139a88190b512bc3fef8e535d',
	* );
	* ```
	*/
	cancel(responseID, params = {}, options) {
		const { betas } = params ?? {};
		return this._client.post(path`/responses/${responseID}/cancel?beta=true`, {
			...options,
			headers: buildHeaders([{ ...betas?.toString() != null ? { "openai-beta": betas?.toString() } : void 0 }, options?.headers]),
			__security: { bearerAuth: true }
		});
	}
	/**
	* Compact a conversation. Returns a compacted response object.
	*
	* Learn when and how to compact long-running conversations in the
	* [conversation state guide](https://platform.openai.com/docs/guides/conversation-state#managing-the-context-window).
	* For ZDR-compatible compaction details, see
	* [Compaction (advanced)](https://platform.openai.com/docs/guides/conversation-state#compaction-advanced).
	*
	* @example
	* ```ts
	* const betaCompactedResponse =
	*   await client.beta.responses.compact({
	*     model: 'gpt-5.6-sol',
	*   });
	* ```
	*/
	compact(params, options) {
		const { betas, ...body } = params;
		return this._client.post("/responses/compact?beta=true", {
			body,
			...options,
			headers: buildHeaders([{ ...betas?.toString() != null ? { "openai-beta": betas?.toString() } : void 0 }, options?.headers]),
			__security: { bearerAuth: true }
		});
	}
};
Responses$1.InputItems = InputItems$1;
Responses$1.InputTokens = InputTokens$1;
//#endregion
//#region node_modules/openai/resources/beta/threads/messages.mjs
/**
* Build Assistants that can call models and use tools.
*
* @deprecated The Assistants API is deprecated in favor of the Responses API
*/
var Messages = class extends APIResource {
	/**
	* Create a message.
	*
	* @deprecated The Assistants API is deprecated in favor of the Responses API
	*/
	create(threadID, body, options) {
		return this._client.post(path`/threads/${threadID}/messages`, {
			body,
			...options,
			headers: buildHeaders([{ "OpenAI-Beta": "assistants=v2" }, options?.headers]),
			__security: { bearerAuth: true }
		});
	}
	/**
	* Retrieve a message.
	*
	* @deprecated The Assistants API is deprecated in favor of the Responses API
	*/
	retrieve(messageID, params, options) {
		const { thread_id } = params;
		return this._client.get(path`/threads/${thread_id}/messages/${messageID}`, {
			...options,
			headers: buildHeaders([{ "OpenAI-Beta": "assistants=v2" }, options?.headers]),
			__security: { bearerAuth: true }
		});
	}
	/**
	* Modifies a message.
	*
	* @deprecated The Assistants API is deprecated in favor of the Responses API
	*/
	update(messageID, params, options) {
		const { thread_id, ...body } = params;
		return this._client.post(path`/threads/${thread_id}/messages/${messageID}`, {
			body,
			...options,
			headers: buildHeaders([{ "OpenAI-Beta": "assistants=v2" }, options?.headers]),
			__security: { bearerAuth: true }
		});
	}
	/**
	* Returns a list of messages for a given thread.
	*
	* @deprecated The Assistants API is deprecated in favor of the Responses API
	*/
	list(threadID, query = {}, options) {
		return this._client.getAPIList(path`/threads/${threadID}/messages`, CursorPage, {
			query,
			...options,
			headers: buildHeaders([{ "OpenAI-Beta": "assistants=v2" }, options?.headers]),
			__security: { bearerAuth: true }
		});
	}
	/**
	* Deletes a message.
	*
	* @deprecated The Assistants API is deprecated in favor of the Responses API
	*/
	delete(messageID, params, options) {
		const { thread_id } = params;
		return this._client.delete(path`/threads/${thread_id}/messages/${messageID}`, {
			...options,
			headers: buildHeaders([{ "OpenAI-Beta": "assistants=v2" }, options?.headers]),
			__security: { bearerAuth: true }
		});
	}
};
//#endregion
//#region node_modules/openai/resources/beta/threads/runs/steps.mjs
/**
* Build Assistants that can call models and use tools.
*
* @deprecated The Assistants API is deprecated in favor of the Responses API
*/
var Steps = class extends APIResource {
	/**
	* Retrieves a run step.
	*
	* @deprecated The Assistants API is deprecated in favor of the Responses API
	*/
	retrieve(stepID, params, options) {
		const { thread_id, run_id, ...query } = params;
		return this._client.get(path`/threads/${thread_id}/runs/${run_id}/steps/${stepID}`, {
			query,
			...options,
			headers: buildHeaders([{ "OpenAI-Beta": "assistants=v2" }, options?.headers]),
			__security: { bearerAuth: true }
		});
	}
	/**
	* Returns a list of run steps belonging to a run.
	*
	* @deprecated The Assistants API is deprecated in favor of the Responses API
	*/
	list(runID, params, options) {
		const { thread_id, ...query } = params;
		return this._client.getAPIList(path`/threads/${thread_id}/runs/${runID}/steps`, CursorPage, {
			query,
			...options,
			headers: buildHeaders([{ "OpenAI-Beta": "assistants=v2" }, options?.headers]),
			__security: { bearerAuth: true }
		});
	}
};
//#endregion
//#region node_modules/openai/internal/utils/base64.mjs
/**
* Converts a Base64 encoded string to a Float32Array.
* @param base64Str - The Base64 encoded string.
* @returns An Array of numbers interpreted as Float32 values.
*/
var toFloat32Array = (base64Str) => {
	if (typeof Buffer !== "undefined") {
		const buf = Buffer.from(base64Str, "base64");
		return Array.from(new Float32Array(buf.buffer, buf.byteOffset, buf.length / Float32Array.BYTES_PER_ELEMENT));
	} else {
		const binaryStr = atob(base64Str);
		const len = binaryStr.length;
		const bytes = new Uint8Array(len);
		for (let i = 0; i < len; i++) bytes[i] = binaryStr.charCodeAt(i);
		return Array.from(new Float32Array(bytes.buffer));
	}
};
//#endregion
//#region node_modules/openai/internal/utils/env.mjs
/**
* Read an environment variable.
*
* Trims beginning and trailing whitespace.
*
* Will return undefined if the environment variable doesn't exist or cannot be accessed.
*/
var readEnv = (env) => {
	if (typeof globalThis.process !== "undefined") return globalThis.process.env?.[env]?.trim() || void 0;
	if (typeof globalThis.Deno !== "undefined") return globalThis.Deno.env?.get?.(env)?.trim() || void 0;
};
//#endregion
//#region node_modules/openai/lib/AssistantStream.mjs
var _AssistantStream_instances;
var _a$1;
var _AssistantStream_events;
var _AssistantStream_runStepSnapshots;
var _AssistantStream_messageSnapshots;
var _AssistantStream_messageSnapshot;
var _AssistantStream_finalRun;
var _AssistantStream_currentContentIndex;
var _AssistantStream_currentContent;
var _AssistantStream_currentToolCallIndex;
var _AssistantStream_currentToolCall;
var _AssistantStream_currentEvent;
var _AssistantStream_currentRunSnapshot;
var _AssistantStream_currentRunStepSnapshot;
var _AssistantStream_addEvent;
var _AssistantStream_endRequest;
var _AssistantStream_handleMessage;
var _AssistantStream_handleRunStep;
var _AssistantStream_handleEvent;
var _AssistantStream_accumulateRunStep;
var _AssistantStream_accumulateMessage;
var _AssistantStream_accumulateContent;
var _AssistantStream_handleRun;
var AssistantStream = class extends EventStream {
	constructor() {
		super(...arguments);
		_AssistantStream_instances.add(this);
		_AssistantStream_events.set(this, []);
		_AssistantStream_runStepSnapshots.set(this, {});
		_AssistantStream_messageSnapshots.set(this, {});
		_AssistantStream_messageSnapshot.set(this, void 0);
		_AssistantStream_finalRun.set(this, void 0);
		_AssistantStream_currentContentIndex.set(this, void 0);
		_AssistantStream_currentContent.set(this, void 0);
		_AssistantStream_currentToolCallIndex.set(this, void 0);
		_AssistantStream_currentToolCall.set(this, void 0);
		_AssistantStream_currentEvent.set(this, void 0);
		_AssistantStream_currentRunSnapshot.set(this, void 0);
		_AssistantStream_currentRunStepSnapshot.set(this, void 0);
	}
	[(_AssistantStream_events = /* @__PURE__ */ new WeakMap(), _AssistantStream_runStepSnapshots = /* @__PURE__ */ new WeakMap(), _AssistantStream_messageSnapshots = /* @__PURE__ */ new WeakMap(), _AssistantStream_messageSnapshot = /* @__PURE__ */ new WeakMap(), _AssistantStream_finalRun = /* @__PURE__ */ new WeakMap(), _AssistantStream_currentContentIndex = /* @__PURE__ */ new WeakMap(), _AssistantStream_currentContent = /* @__PURE__ */ new WeakMap(), _AssistantStream_currentToolCallIndex = /* @__PURE__ */ new WeakMap(), _AssistantStream_currentToolCall = /* @__PURE__ */ new WeakMap(), _AssistantStream_currentEvent = /* @__PURE__ */ new WeakMap(), _AssistantStream_currentRunSnapshot = /* @__PURE__ */ new WeakMap(), _AssistantStream_currentRunStepSnapshot = /* @__PURE__ */ new WeakMap(), _AssistantStream_instances = /* @__PURE__ */ new WeakSet(), Symbol.asyncIterator)]() {
		const pushQueue = [];
		const readQueue = [];
		let done = false;
		this.on("event", (event) => {
			const eventCopy = structuredClone(event);
			const reader = readQueue.shift();
			if (reader) reader.resolve(eventCopy);
			else pushQueue.push(eventCopy);
		});
		this.on("end", () => {
			done = true;
			for (const reader of readQueue) reader.resolve(void 0);
			readQueue.length = 0;
		});
		this.on("abort", (err) => {
			done = true;
			for (const reader of readQueue) reader.reject(err);
			readQueue.length = 0;
		});
		this.on("error", (err) => {
			done = true;
			for (const reader of readQueue) reader.reject(err);
			readQueue.length = 0;
		});
		return {
			next: async () => {
				if (!pushQueue.length) {
					if (done) return {
						value: void 0,
						done: true
					};
					return new Promise((resolve, reject) => readQueue.push({
						resolve,
						reject
					})).then((chunk) => chunk ? {
						value: chunk,
						done: false
					} : {
						value: void 0,
						done: true
					});
				}
				return {
					value: pushQueue.shift(),
					done: false
				};
			},
			return: async () => {
				this.abort();
				return {
					value: void 0,
					done: true
				};
			}
		};
	}
	static fromReadableStream(stream) {
		const runner = new _a$1();
		runner._run(() => runner._fromReadableStream(stream));
		return runner;
	}
	async _fromReadableStream(readableStream, options) {
		this._listenForAbort(options?.signal);
		this._connected();
		const stream = Stream.fromReadableStream(readableStream, this.controller);
		for await (const event of stream) __classPrivateFieldGet(this, _AssistantStream_instances, "m", _AssistantStream_addEvent).call(this, event);
		if (stream.controller.signal?.aborted) throw new APIUserAbortError();
		return this._addRun(__classPrivateFieldGet(this, _AssistantStream_instances, "m", _AssistantStream_endRequest).call(this));
	}
	toReadableStream() {
		return new Stream(this[Symbol.asyncIterator].bind(this), this.controller).toReadableStream();
	}
	static createToolAssistantStream(runId, runs, params, options) {
		const runner = new _a$1();
		runner._run(() => runner._runToolAssistantStream(runId, runs, params, {
			...options,
			headers: {
				...options?.headers,
				"X-Stainless-Helper-Method": "stream"
			}
		}));
		return runner;
	}
	async _createToolAssistantStream(run, runId, params, options) {
		this._listenForAbort(options?.signal);
		const body = {
			...params,
			stream: true
		};
		const stream = await run.submitToolOutputs(runId, body, {
			...options,
			signal: this.controller.signal
		});
		this._connected();
		for await (const event of stream) __classPrivateFieldGet(this, _AssistantStream_instances, "m", _AssistantStream_addEvent).call(this, event);
		if (stream.controller.signal?.aborted) throw new APIUserAbortError();
		return this._addRun(__classPrivateFieldGet(this, _AssistantStream_instances, "m", _AssistantStream_endRequest).call(this));
	}
	static createThreadAssistantStream(params, thread, options) {
		const runner = new _a$1();
		runner._run(() => runner._threadAssistantStream(params, thread, {
			...options,
			headers: {
				...options?.headers,
				"X-Stainless-Helper-Method": "stream"
			}
		}));
		return runner;
	}
	static createAssistantStream(threadId, runs, params, options) {
		const runner = new _a$1();
		runner._run(() => runner._runAssistantStream(threadId, runs, params, {
			...options,
			headers: {
				...options?.headers,
				"X-Stainless-Helper-Method": "stream"
			}
		}));
		return runner;
	}
	currentEvent() {
		return __classPrivateFieldGet(this, _AssistantStream_currentEvent, "f");
	}
	currentRun() {
		return __classPrivateFieldGet(this, _AssistantStream_currentRunSnapshot, "f");
	}
	currentMessageSnapshot() {
		return __classPrivateFieldGet(this, _AssistantStream_messageSnapshot, "f");
	}
	currentRunStepSnapshot() {
		return __classPrivateFieldGet(this, _AssistantStream_currentRunStepSnapshot, "f");
	}
	async finalRunSteps() {
		await this.done();
		return Object.values(__classPrivateFieldGet(this, _AssistantStream_runStepSnapshots, "f"));
	}
	async finalMessages() {
		await this.done();
		return Object.values(__classPrivateFieldGet(this, _AssistantStream_messageSnapshots, "f"));
	}
	async finalRun() {
		await this.done();
		if (!__classPrivateFieldGet(this, _AssistantStream_finalRun, "f")) throw Error("Final run was not received.");
		return __classPrivateFieldGet(this, _AssistantStream_finalRun, "f");
	}
	async _createThreadAssistantStream(thread, params, options) {
		this._listenForAbort(options?.signal);
		const body = {
			...params,
			stream: true
		};
		const stream = await thread.createAndRun(body, {
			...options,
			signal: this.controller.signal
		});
		this._connected();
		for await (const event of stream) __classPrivateFieldGet(this, _AssistantStream_instances, "m", _AssistantStream_addEvent).call(this, event);
		if (stream.controller.signal?.aborted) throw new APIUserAbortError();
		return this._addRun(__classPrivateFieldGet(this, _AssistantStream_instances, "m", _AssistantStream_endRequest).call(this));
	}
	async _createAssistantStream(run, threadId, params, options) {
		this._listenForAbort(options?.signal);
		const body = {
			...params,
			stream: true
		};
		const stream = await run.create(threadId, body, {
			...options,
			signal: this.controller.signal
		});
		this._connected();
		for await (const event of stream) __classPrivateFieldGet(this, _AssistantStream_instances, "m", _AssistantStream_addEvent).call(this, event);
		if (stream.controller.signal?.aborted) throw new APIUserAbortError();
		return this._addRun(__classPrivateFieldGet(this, _AssistantStream_instances, "m", _AssistantStream_endRequest).call(this));
	}
	static accumulateDelta(acc, delta) {
		for (const [key, deltaValue] of Object.entries(delta)) {
			if (!acc.hasOwnProperty(key)) {
				acc[key] = deltaValue;
				continue;
			}
			let accValue = acc[key];
			if (accValue === null || accValue === void 0) {
				acc[key] = deltaValue;
				continue;
			}
			if (key === "index" || key === "type") {
				acc[key] = deltaValue;
				continue;
			}
			if (typeof accValue === "string" && typeof deltaValue === "string") accValue += deltaValue;
			else if (typeof accValue === "number" && typeof deltaValue === "number") accValue += deltaValue;
			else if (isObj(accValue) && isObj(deltaValue)) accValue = this.accumulateDelta(accValue, deltaValue);
			else if (Array.isArray(accValue) && Array.isArray(deltaValue)) {
				if (accValue.every((x) => typeof x === "string" || typeof x === "number")) {
					accValue.push(...deltaValue);
					continue;
				}
				for (const deltaEntry of deltaValue) {
					if (!isObj(deltaEntry)) throw new Error(`Expected array delta entry to be an object but got: ${deltaEntry}`);
					const index = deltaEntry["index"];
					if (index == null) {
						console.error(deltaEntry);
						throw new Error("Expected array delta entry to have an `index` property");
					}
					if (typeof index !== "number") throw new Error(`Expected array delta entry \`index\` property to be a number but got ${index}`);
					const accEntry = accValue[index];
					if (accEntry == null) accValue[index] = deltaEntry;
					else accValue[index] = this.accumulateDelta(accEntry, deltaEntry);
				}
				continue;
			} else throw Error(`Unhandled record type: ${key}, deltaValue: ${deltaValue}, accValue: ${accValue}`);
			acc[key] = accValue;
		}
		return acc;
	}
	_addRun(run) {
		return run;
	}
	async _threadAssistantStream(params, thread, options) {
		return await this._createThreadAssistantStream(thread, params, options);
	}
	async _runAssistantStream(threadId, runs, params, options) {
		return await this._createAssistantStream(runs, threadId, params, options);
	}
	async _runToolAssistantStream(runId, runs, params, options) {
		return await this._createToolAssistantStream(runs, runId, params, options);
	}
};
_a$1 = AssistantStream, _AssistantStream_addEvent = function _AssistantStream_addEvent(event) {
	if (this.ended) return;
	__classPrivateFieldSet(this, _AssistantStream_currentEvent, event, "f");
	__classPrivateFieldGet(this, _AssistantStream_instances, "m", _AssistantStream_handleEvent).call(this, event);
	switch (event.event) {
		case "thread.created": break;
		case "thread.run.created":
		case "thread.run.queued":
		case "thread.run.in_progress":
		case "thread.run.requires_action":
		case "thread.run.completed":
		case "thread.run.incomplete":
		case "thread.run.failed":
		case "thread.run.cancelling":
		case "thread.run.cancelled":
		case "thread.run.expired":
			__classPrivateFieldGet(this, _AssistantStream_instances, "m", _AssistantStream_handleRun).call(this, event);
			break;
		case "thread.run.step.created":
		case "thread.run.step.in_progress":
		case "thread.run.step.delta":
		case "thread.run.step.completed":
		case "thread.run.step.failed":
		case "thread.run.step.cancelled":
		case "thread.run.step.expired":
			__classPrivateFieldGet(this, _AssistantStream_instances, "m", _AssistantStream_handleRunStep).call(this, event);
			break;
		case "thread.message.created":
		case "thread.message.in_progress":
		case "thread.message.delta":
		case "thread.message.completed":
		case "thread.message.incomplete":
			__classPrivateFieldGet(this, _AssistantStream_instances, "m", _AssistantStream_handleMessage).call(this, event);
			break;
		case "error": throw new Error("Encountered an error event in event processing - errors should be processed earlier");
		default:
	}
}, _AssistantStream_endRequest = function _AssistantStream_endRequest() {
	if (this.ended) throw new OpenAIError(`stream has ended, this shouldn't happen`);
	if (!__classPrivateFieldGet(this, _AssistantStream_finalRun, "f")) throw Error("Final run has not been received");
	return __classPrivateFieldGet(this, _AssistantStream_finalRun, "f");
}, _AssistantStream_handleMessage = function _AssistantStream_handleMessage(event) {
	const [accumulatedMessage, newContent] = __classPrivateFieldGet(this, _AssistantStream_instances, "m", _AssistantStream_accumulateMessage).call(this, event, __classPrivateFieldGet(this, _AssistantStream_messageSnapshot, "f"));
	__classPrivateFieldSet(this, _AssistantStream_messageSnapshot, accumulatedMessage, "f");
	__classPrivateFieldGet(this, _AssistantStream_messageSnapshots, "f")[accumulatedMessage.id] = accumulatedMessage;
	for (const content of newContent) {
		const snapshotContent = accumulatedMessage.content[content.index];
		if (snapshotContent?.type == "text") this._emit("textCreated", snapshotContent.text);
	}
	switch (event.event) {
		case "thread.message.created":
			this._emit("messageCreated", event.data);
			break;
		case "thread.message.in_progress": break;
		case "thread.message.delta":
			this._emit("messageDelta", event.data.delta, accumulatedMessage);
			if (event.data.delta.content) for (const content of event.data.delta.content) {
				if (content.type == "text" && content.text) {
					let textDelta = content.text;
					let snapshot = accumulatedMessage.content[content.index];
					if (snapshot && snapshot.type == "text") this._emit("textDelta", textDelta, snapshot.text);
					else throw Error("The snapshot associated with this text delta is not text or missing");
				}
				if (content.index != __classPrivateFieldGet(this, _AssistantStream_currentContentIndex, "f")) {
					if (__classPrivateFieldGet(this, _AssistantStream_currentContent, "f")) switch (__classPrivateFieldGet(this, _AssistantStream_currentContent, "f").type) {
						case "text":
							this._emit("textDone", __classPrivateFieldGet(this, _AssistantStream_currentContent, "f").text, __classPrivateFieldGet(this, _AssistantStream_messageSnapshot, "f"));
							break;
						case "image_file":
							this._emit("imageFileDone", __classPrivateFieldGet(this, _AssistantStream_currentContent, "f").image_file, __classPrivateFieldGet(this, _AssistantStream_messageSnapshot, "f"));
							break;
					}
					__classPrivateFieldSet(this, _AssistantStream_currentContentIndex, content.index, "f");
				}
				__classPrivateFieldSet(this, _AssistantStream_currentContent, accumulatedMessage.content[content.index], "f");
			}
			break;
		case "thread.message.completed":
		case "thread.message.incomplete":
			if (__classPrivateFieldGet(this, _AssistantStream_currentContentIndex, "f") !== void 0) {
				const currentContent = event.data.content[__classPrivateFieldGet(this, _AssistantStream_currentContentIndex, "f")];
				if (currentContent) switch (currentContent.type) {
					case "image_file":
						this._emit("imageFileDone", currentContent.image_file, __classPrivateFieldGet(this, _AssistantStream_messageSnapshot, "f"));
						break;
					case "text":
						this._emit("textDone", currentContent.text, __classPrivateFieldGet(this, _AssistantStream_messageSnapshot, "f"));
						break;
				}
			}
			if (__classPrivateFieldGet(this, _AssistantStream_messageSnapshot, "f")) this._emit("messageDone", event.data);
			__classPrivateFieldSet(this, _AssistantStream_messageSnapshot, void 0, "f");
	}
}, _AssistantStream_handleRunStep = function _AssistantStream_handleRunStep(event) {
	const accumulatedRunStep = __classPrivateFieldGet(this, _AssistantStream_instances, "m", _AssistantStream_accumulateRunStep).call(this, event);
	__classPrivateFieldSet(this, _AssistantStream_currentRunStepSnapshot, accumulatedRunStep, "f");
	switch (event.event) {
		case "thread.run.step.created":
			this._emit("runStepCreated", event.data);
			break;
		case "thread.run.step.delta":
			const delta = event.data.delta;
			if (delta.step_details && delta.step_details.type == "tool_calls" && delta.step_details.tool_calls && accumulatedRunStep.step_details.type == "tool_calls") for (const toolCall of delta.step_details.tool_calls) if (toolCall.index == __classPrivateFieldGet(this, _AssistantStream_currentToolCallIndex, "f")) this._emit("toolCallDelta", toolCall, accumulatedRunStep.step_details.tool_calls[toolCall.index]);
			else {
				if (__classPrivateFieldGet(this, _AssistantStream_currentToolCall, "f")) this._emit("toolCallDone", __classPrivateFieldGet(this, _AssistantStream_currentToolCall, "f"));
				__classPrivateFieldSet(this, _AssistantStream_currentToolCallIndex, toolCall.index, "f");
				__classPrivateFieldSet(this, _AssistantStream_currentToolCall, accumulatedRunStep.step_details.tool_calls[toolCall.index], "f");
				if (__classPrivateFieldGet(this, _AssistantStream_currentToolCall, "f")) this._emit("toolCallCreated", __classPrivateFieldGet(this, _AssistantStream_currentToolCall, "f"));
			}
			this._emit("runStepDelta", event.data.delta, accumulatedRunStep);
			break;
		case "thread.run.step.completed":
		case "thread.run.step.failed":
		case "thread.run.step.cancelled":
		case "thread.run.step.expired":
			__classPrivateFieldSet(this, _AssistantStream_currentRunStepSnapshot, void 0, "f");
			if (event.data.step_details.type == "tool_calls") {
				if (__classPrivateFieldGet(this, _AssistantStream_currentToolCall, "f")) {
					this._emit("toolCallDone", __classPrivateFieldGet(this, _AssistantStream_currentToolCall, "f"));
					__classPrivateFieldSet(this, _AssistantStream_currentToolCall, void 0, "f");
				}
			}
			this._emit("runStepDone", event.data, accumulatedRunStep);
			break;
		case "thread.run.step.in_progress": break;
	}
}, _AssistantStream_handleEvent = function _AssistantStream_handleEvent(event) {
	__classPrivateFieldGet(this, _AssistantStream_events, "f").push(event);
	this._emit("event", event);
}, _AssistantStream_accumulateRunStep = function _AssistantStream_accumulateRunStep(event) {
	switch (event.event) {
		case "thread.run.step.created":
			__classPrivateFieldGet(this, _AssistantStream_runStepSnapshots, "f")[event.data.id] = event.data;
			return event.data;
		case "thread.run.step.delta":
			let snapshot = __classPrivateFieldGet(this, _AssistantStream_runStepSnapshots, "f")[event.data.id];
			if (!snapshot) throw Error("Received a RunStepDelta before creation of a snapshot");
			let data = event.data;
			if (data.delta) {
				const accumulated = _a$1.accumulateDelta(snapshot, data.delta);
				__classPrivateFieldGet(this, _AssistantStream_runStepSnapshots, "f")[event.data.id] = accumulated;
			}
			return __classPrivateFieldGet(this, _AssistantStream_runStepSnapshots, "f")[event.data.id];
		case "thread.run.step.completed":
		case "thread.run.step.failed":
		case "thread.run.step.cancelled":
		case "thread.run.step.expired":
		case "thread.run.step.in_progress":
			__classPrivateFieldGet(this, _AssistantStream_runStepSnapshots, "f")[event.data.id] = event.data;
			break;
	}
	if (__classPrivateFieldGet(this, _AssistantStream_runStepSnapshots, "f")[event.data.id]) return __classPrivateFieldGet(this, _AssistantStream_runStepSnapshots, "f")[event.data.id];
	throw new Error("No snapshot available");
}, _AssistantStream_accumulateMessage = function _AssistantStream_accumulateMessage(event, snapshot) {
	let newContent = [];
	switch (event.event) {
		case "thread.message.created": return [event.data, newContent];
		case "thread.message.delta":
			if (!snapshot) throw Error("Received a delta with no existing snapshot (there should be one from message creation)");
			let data = event.data;
			if (data.delta.content) for (const contentElement of data.delta.content) if (contentElement.index in snapshot.content) {
				let currentContent = snapshot.content[contentElement.index];
				snapshot.content[contentElement.index] = __classPrivateFieldGet(this, _AssistantStream_instances, "m", _AssistantStream_accumulateContent).call(this, contentElement, currentContent);
			} else {
				snapshot.content[contentElement.index] = contentElement;
				newContent.push(contentElement);
			}
			return [snapshot, newContent];
		case "thread.message.in_progress":
		case "thread.message.completed":
		case "thread.message.incomplete": if (snapshot) return [snapshot, newContent];
		else throw Error("Received thread message event with no existing snapshot");
	}
	throw Error("Tried to accumulate a non-message event");
}, _AssistantStream_accumulateContent = function _AssistantStream_accumulateContent(contentElement, currentContent) {
	return _a$1.accumulateDelta(currentContent, contentElement);
}, _AssistantStream_handleRun = function _AssistantStream_handleRun(event) {
	__classPrivateFieldSet(this, _AssistantStream_currentRunSnapshot, event.data, "f");
	switch (event.event) {
		case "thread.run.created": break;
		case "thread.run.queued": break;
		case "thread.run.in_progress": break;
		case "thread.run.requires_action":
		case "thread.run.cancelled":
		case "thread.run.failed":
		case "thread.run.completed":
		case "thread.run.expired":
		case "thread.run.incomplete":
			__classPrivateFieldSet(this, _AssistantStream_finalRun, event.data, "f");
			if (__classPrivateFieldGet(this, _AssistantStream_currentToolCall, "f")) {
				this._emit("toolCallDone", __classPrivateFieldGet(this, _AssistantStream_currentToolCall, "f"));
				__classPrivateFieldSet(this, _AssistantStream_currentToolCall, void 0, "f");
			}
			break;
		case "thread.run.cancelling": break;
	}
};
//#endregion
//#region node_modules/openai/resources/beta/threads/runs/runs.mjs
/**
* Build Assistants that can call models and use tools.
*
* @deprecated The Assistants API is deprecated in favor of the Responses API
*/
var Runs$1 = class extends APIResource {
	constructor() {
		super(...arguments);
		this.steps = new Steps(this._client);
	}
	create(threadID, params, options) {
		const { include, ...body } = params;
		return this._client.post(path`/threads/${threadID}/runs`, {
			query: { include },
			body,
			...options,
			headers: buildHeaders([{ "OpenAI-Beta": "assistants=v2" }, options?.headers]),
			stream: params.stream ?? false,
			__synthesizeEventData: true,
			__security: { bearerAuth: true }
		});
	}
	/**
	* Retrieves a run.
	*
	* @deprecated The Assistants API is deprecated in favor of the Responses API
	*/
	retrieve(runID, params, options) {
		const { thread_id } = params;
		return this._client.get(path`/threads/${thread_id}/runs/${runID}`, {
			...options,
			headers: buildHeaders([{ "OpenAI-Beta": "assistants=v2" }, options?.headers]),
			__security: { bearerAuth: true }
		});
	}
	/**
	* Modifies a run.
	*
	* @deprecated The Assistants API is deprecated in favor of the Responses API
	*/
	update(runID, params, options) {
		const { thread_id, ...body } = params;
		return this._client.post(path`/threads/${thread_id}/runs/${runID}`, {
			body,
			...options,
			headers: buildHeaders([{ "OpenAI-Beta": "assistants=v2" }, options?.headers]),
			__security: { bearerAuth: true }
		});
	}
	/**
	* Returns a list of runs belonging to a thread.
	*
	* @deprecated The Assistants API is deprecated in favor of the Responses API
	*/
	list(threadID, query = {}, options) {
		return this._client.getAPIList(path`/threads/${threadID}/runs`, CursorPage, {
			query,
			...options,
			headers: buildHeaders([{ "OpenAI-Beta": "assistants=v2" }, options?.headers]),
			__security: { bearerAuth: true }
		});
	}
	/**
	* Cancels a run that is `in_progress`.
	*
	* @deprecated The Assistants API is deprecated in favor of the Responses API
	*/
	cancel(runID, params, options) {
		const { thread_id } = params;
		return this._client.post(path`/threads/${thread_id}/runs/${runID}/cancel`, {
			...options,
			headers: buildHeaders([{ "OpenAI-Beta": "assistants=v2" }, options?.headers]),
			__security: { bearerAuth: true }
		});
	}
	/**
	* A helper to create a run an poll for a terminal state. More information on Run
	* lifecycles can be found here:
	* https://platform.openai.com/docs/assistants/how-it-works/runs-and-run-steps
	*/
	async createAndPoll(threadId, body, options) {
		const run = await this.create(threadId, body, options);
		return await this.poll(run.id, { thread_id: threadId }, options);
	}
	/**
	* Create a Run stream
	*
	* @deprecated use `stream` instead
	*/
	createAndStream(threadId, body, options) {
		return AssistantStream.createAssistantStream(threadId, this._client.beta.threads.runs, body, options);
	}
	/**
	* A helper to poll a run status until it reaches a terminal state. More
	* information on Run lifecycles can be found here:
	* https://platform.openai.com/docs/assistants/how-it-works/runs-and-run-steps
	*/
	async poll(runId, params, options) {
		const headers = buildHeaders([options?.headers, {
			"X-Stainless-Poll-Helper": "true",
			"X-Stainless-Custom-Poll-Interval": options?.pollIntervalMs?.toString() ?? void 0
		}]);
		while (true) {
			const { data: run, response } = await this.retrieve(runId, params, {
				...options,
				headers: {
					...options?.headers,
					...headers
				}
			}).withResponse();
			switch (run.status) {
				case "queued":
				case "in_progress":
				case "cancelling":
					let sleepInterval = 5e3;
					if (options?.pollIntervalMs) sleepInterval = options.pollIntervalMs;
					else {
						const headerInterval = response.headers.get("openai-poll-after-ms");
						if (headerInterval) {
							const headerIntervalMs = parseInt(headerInterval);
							if (!isNaN(headerIntervalMs)) sleepInterval = headerIntervalMs;
						}
					}
					await sleep(sleepInterval);
					break;
				case "requires_action":
				case "incomplete":
				case "cancelled":
				case "completed":
				case "failed":
				case "expired": return run;
			}
		}
	}
	/**
	* Create a Run stream
	*/
	stream(threadId, body, options) {
		return AssistantStream.createAssistantStream(threadId, this._client.beta.threads.runs, body, options);
	}
	submitToolOutputs(runID, params, options) {
		const { thread_id, ...body } = params;
		return this._client.post(path`/threads/${thread_id}/runs/${runID}/submit_tool_outputs`, {
			body,
			...options,
			headers: buildHeaders([{ "OpenAI-Beta": "assistants=v2" }, options?.headers]),
			stream: params.stream ?? false,
			__synthesizeEventData: true,
			__security: { bearerAuth: true }
		});
	}
	/**
	* A helper to submit a tool output to a run and poll for a terminal run state.
	* More information on Run lifecycles can be found here:
	* https://platform.openai.com/docs/assistants/how-it-works/runs-and-run-steps
	*/
	async submitToolOutputsAndPoll(runId, params, options) {
		const run = await this.submitToolOutputs(runId, params, options);
		return await this.poll(run.id, params, options);
	}
	/**
	* Submit the tool outputs from a previous run and stream the run to a terminal
	* state. More information on Run lifecycles can be found here:
	* https://platform.openai.com/docs/assistants/how-it-works/runs-and-run-steps
	*/
	submitToolOutputsStream(runId, params, options) {
		return AssistantStream.createToolAssistantStream(runId, this._client.beta.threads.runs, params, options);
	}
};
Runs$1.Steps = Steps;
//#endregion
//#region node_modules/openai/resources/beta/threads/threads.mjs
/**
* Build Assistants that can call models and use tools.
*
* @deprecated The Assistants API is deprecated in favor of the Responses API
*/
var Threads = class extends APIResource {
	constructor() {
		super(...arguments);
		this.runs = new Runs$1(this._client);
		this.messages = new Messages(this._client);
	}
	/**
	* Create a thread.
	*
	* @deprecated The Assistants API is deprecated in favor of the Responses API
	*/
	create(body = {}, options) {
		return this._client.post("/threads", {
			body,
			...options,
			headers: buildHeaders([{ "OpenAI-Beta": "assistants=v2" }, options?.headers]),
			__security: { bearerAuth: true }
		});
	}
	/**
	* Retrieves a thread.
	*
	* @deprecated The Assistants API is deprecated in favor of the Responses API
	*/
	retrieve(threadID, options) {
		return this._client.get(path`/threads/${threadID}`, {
			...options,
			headers: buildHeaders([{ "OpenAI-Beta": "assistants=v2" }, options?.headers]),
			__security: { bearerAuth: true }
		});
	}
	/**
	* Modifies a thread.
	*
	* @deprecated The Assistants API is deprecated in favor of the Responses API
	*/
	update(threadID, body, options) {
		return this._client.post(path`/threads/${threadID}`, {
			body,
			...options,
			headers: buildHeaders([{ "OpenAI-Beta": "assistants=v2" }, options?.headers]),
			__security: { bearerAuth: true }
		});
	}
	/**
	* Delete a thread.
	*
	* @deprecated The Assistants API is deprecated in favor of the Responses API
	*/
	delete(threadID, options) {
		return this._client.delete(path`/threads/${threadID}`, {
			...options,
			headers: buildHeaders([{ "OpenAI-Beta": "assistants=v2" }, options?.headers]),
			__security: { bearerAuth: true }
		});
	}
	createAndRun(body, options) {
		return this._client.post("/threads/runs", {
			body,
			...options,
			headers: buildHeaders([{ "OpenAI-Beta": "assistants=v2" }, options?.headers]),
			stream: body.stream ?? false,
			__synthesizeEventData: true,
			__security: { bearerAuth: true }
		});
	}
	/**
	* A helper to create a thread, start a run and then poll for a terminal state.
	* More information on Run lifecycles can be found here:
	* https://platform.openai.com/docs/assistants/how-it-works/runs-and-run-steps
	*/
	async createAndRunPoll(body, options) {
		const run = await this.createAndRun(body, options);
		return await this.runs.poll(run.id, { thread_id: run.thread_id }, options);
	}
	/**
	* Create a thread and stream the run back
	*/
	createAndRunStream(body, options) {
		return AssistantStream.createThreadAssistantStream(body, this._client.beta.threads, options);
	}
};
Threads.Runs = Runs$1;
Threads.Messages = Messages;
//#endregion
//#region node_modules/openai/resources/beta/beta.mjs
var Beta = class extends APIResource {
	constructor() {
		super(...arguments);
		this.realtime = new Realtime$1(this._client);
		this.responses = new Responses$1(this._client);
		this.chatkit = new ChatKit(this._client);
		this.assistants = new Assistants(this._client);
		this.threads = new Threads(this._client);
	}
};
Beta.Realtime = Realtime$1;
Beta.Responses = Responses$1;
Beta.ChatKit = ChatKit;
Beta.Assistants = Assistants;
Beta.Threads = Threads;
//#endregion
//#region node_modules/openai/resources/completions.mjs
/**
* Given a prompt, the model will return one or more predicted completions, and can also return the probabilities of alternative tokens at each position.
*/
var Completions = class extends APIResource {
	create(body, options) {
		return this._client.post("/completions", {
			body,
			...options,
			stream: body.stream ?? false,
			__security: { bearerAuth: true }
		});
	}
};
//#endregion
//#region node_modules/openai/resources/containers/files/content.mjs
var Content$2 = class extends APIResource {
	/**
	* Retrieve Container File Content
	*/
	retrieve(fileID, params, options) {
		const { container_id } = params;
		return this._client.get(path`/containers/${container_id}/files/${fileID}/content`, {
			...options,
			headers: buildHeaders([{ Accept: "application/binary" }, options?.headers]),
			__security: { bearerAuth: true },
			__binaryResponse: true
		});
	}
};
//#endregion
//#region node_modules/openai/resources/containers/files/files.mjs
var Files$2 = class extends APIResource {
	constructor() {
		super(...arguments);
		this.content = new Content$2(this._client);
	}
	/**
	* Create a Container File
	*
	* You can send either a multipart/form-data request with the raw file content, or
	* a JSON request with a file ID.
	*/
	create(containerID, body, options) {
		return this._client.post(path`/containers/${containerID}/files`, maybeMultipartFormRequestOptions({
			body,
			...options,
			__security: { bearerAuth: true }
		}, this._client));
	}
	/**
	* Retrieve Container File
	*/
	retrieve(fileID, params, options) {
		const { container_id } = params;
		return this._client.get(path`/containers/${container_id}/files/${fileID}`, {
			...options,
			__security: { bearerAuth: true }
		});
	}
	/**
	* List Container files
	*/
	list(containerID, query = {}, options) {
		return this._client.getAPIList(path`/containers/${containerID}/files`, CursorPage, {
			query,
			...options,
			__security: { bearerAuth: true }
		});
	}
	/**
	* Delete Container File
	*/
	delete(fileID, params, options) {
		const { container_id } = params;
		return this._client.delete(path`/containers/${container_id}/files/${fileID}`, {
			...options,
			headers: buildHeaders([{ Accept: "*/*" }, options?.headers]),
			__security: { bearerAuth: true }
		});
	}
};
Files$2.Content = Content$2;
//#endregion
//#region node_modules/openai/resources/containers/containers.mjs
var Containers = class extends APIResource {
	constructor() {
		super(...arguments);
		this.files = new Files$2(this._client);
	}
	/**
	* Create Container
	*/
	create(body, options) {
		return this._client.post("/containers", {
			body,
			...options,
			__security: { bearerAuth: true }
		});
	}
	/**
	* Retrieve Container
	*/
	retrieve(containerID, options) {
		return this._client.get(path`/containers/${containerID}`, {
			...options,
			__security: { bearerAuth: true }
		});
	}
	/**
	* List Containers
	*/
	list(query = {}, options) {
		return this._client.getAPIList("/containers", CursorPage, {
			query,
			...options,
			__security: { bearerAuth: true }
		});
	}
	/**
	* Delete Container
	*/
	delete(containerID, options) {
		return this._client.delete(path`/containers/${containerID}`, {
			...options,
			headers: buildHeaders([{ Accept: "*/*" }, options?.headers]),
			__security: { bearerAuth: true }
		});
	}
};
Containers.Files = Files$2;
//#endregion
//#region node_modules/openai/resources/conversations/items.mjs
/**
* Manage conversations and conversation items.
*/
var Items = class extends APIResource {
	/**
	* Create items in a conversation with the given ID.
	*/
	create(conversationID, params, options) {
		const { include, ...body } = params;
		return this._client.post(path`/conversations/${conversationID}/items`, {
			query: { include },
			body,
			...options,
			__security: { bearerAuth: true }
		});
	}
	/**
	* Get a single item from a conversation with the given IDs.
	*/
	retrieve(itemID, params, options) {
		const { conversation_id, ...query } = params;
		return this._client.get(path`/conversations/${conversation_id}/items/${itemID}`, {
			query,
			...options,
			__security: { bearerAuth: true }
		});
	}
	/**
	* List all items for a conversation with the given ID.
	*/
	list(conversationID, query = {}, options) {
		return this._client.getAPIList(path`/conversations/${conversationID}/items`, ConversationCursorPage, {
			query,
			...options,
			__security: { bearerAuth: true }
		});
	}
	/**
	* Delete an item from a conversation with the given IDs.
	*/
	delete(itemID, params, options) {
		const { conversation_id } = params;
		return this._client.delete(path`/conversations/${conversation_id}/items/${itemID}`, {
			...options,
			__security: { bearerAuth: true }
		});
	}
};
//#endregion
//#region node_modules/openai/resources/conversations/conversations.mjs
/**
* Manage conversations and conversation items.
*/
var Conversations = class extends APIResource {
	constructor() {
		super(...arguments);
		this.items = new Items(this._client);
	}
	/**
	* Create a conversation.
	*/
	create(body = {}, options) {
		return this._client.post("/conversations", {
			body,
			...options,
			__security: { bearerAuth: true }
		});
	}
	/**
	* Get a conversation
	*/
	retrieve(conversationID, options) {
		return this._client.get(path`/conversations/${conversationID}`, {
			...options,
			__security: { bearerAuth: true }
		});
	}
	/**
	* Update a conversation
	*/
	update(conversationID, body, options) {
		return this._client.post(path`/conversations/${conversationID}`, {
			body,
			...options,
			__security: { bearerAuth: true }
		});
	}
	/**
	* Delete a conversation. Items in the conversation will not be deleted.
	*/
	delete(conversationID, options) {
		return this._client.delete(path`/conversations/${conversationID}`, {
			...options,
			__security: { bearerAuth: true }
		});
	}
};
Conversations.Items = Items;
//#endregion
//#region node_modules/openai/resources/embeddings.mjs
/**
* Get a vector representation of a given input that can be easily consumed by machine learning models and algorithms.
*/
var Embeddings = class extends APIResource {
	/**
	* Creates an embedding vector representing the input text.
	*
	* @example
	* ```ts
	* const createEmbeddingResponse =
	*   await client.embeddings.create({
	*     input: 'The quick brown fox jumped over the lazy dog',
	*     model: 'text-embedding-3-small',
	*   });
	* ```
	*/
	create(body, options) {
		const hasUserProvidedEncodingFormat = !!body.encoding_format;
		let encoding_format = hasUserProvidedEncodingFormat ? body.encoding_format : "base64";
		if (hasUserProvidedEncodingFormat) loggerFor(this._client).debug("embeddings/user defined encoding_format:", body.encoding_format);
		const response = this._client.post("/embeddings", {
			body: {
				...body,
				encoding_format
			},
			...options,
			__security: { bearerAuth: true }
		});
		if (hasUserProvidedEncodingFormat) return response;
		loggerFor(this._client).debug("embeddings/decoding base64 embeddings from base64");
		return response._thenUnwrap((response) => {
			if (response && response.data) response.data.forEach((embeddingBase64Obj) => {
				const embeddingBase64Str = embeddingBase64Obj.embedding;
				embeddingBase64Obj.embedding = toFloat32Array(embeddingBase64Str);
			});
			return response;
		});
	}
};
//#endregion
//#region node_modules/openai/resources/evals/runs/output-items.mjs
/**
* Manage and run evals in the OpenAI platform.
*/
var OutputItems = class extends APIResource {
	/**
	* Get an evaluation run output item by ID.
	*/
	retrieve(outputItemID, params, options) {
		const { eval_id, run_id } = params;
		return this._client.get(path`/evals/${eval_id}/runs/${run_id}/output_items/${outputItemID}`, {
			...options,
			__security: { bearerAuth: true }
		});
	}
	/**
	* Get a list of output items for an evaluation run.
	*/
	list(runID, params, options) {
		const { eval_id, ...query } = params;
		return this._client.getAPIList(path`/evals/${eval_id}/runs/${runID}/output_items`, CursorPage, {
			query,
			...options,
			__security: { bearerAuth: true }
		});
	}
};
//#endregion
//#region node_modules/openai/resources/evals/runs/runs.mjs
/**
* Manage and run evals in the OpenAI platform.
*/
var Runs = class extends APIResource {
	constructor() {
		super(...arguments);
		this.outputItems = new OutputItems(this._client);
	}
	/**
	* Kicks off a new run for a given evaluation, specifying the data source, and what
	* model configuration to use to test. The datasource will be validated against the
	* schema specified in the config of the evaluation.
	*/
	create(evalID, body, options) {
		return this._client.post(path`/evals/${evalID}/runs`, {
			body,
			...options,
			__security: { bearerAuth: true }
		});
	}
	/**
	* Get an evaluation run by ID.
	*/
	retrieve(runID, params, options) {
		const { eval_id } = params;
		return this._client.get(path`/evals/${eval_id}/runs/${runID}`, {
			...options,
			__security: { bearerAuth: true }
		});
	}
	/**
	* Get a list of runs for an evaluation.
	*/
	list(evalID, query = {}, options) {
		return this._client.getAPIList(path`/evals/${evalID}/runs`, CursorPage, {
			query,
			...options,
			__security: { bearerAuth: true }
		});
	}
	/**
	* Delete an eval run.
	*/
	delete(runID, params, options) {
		const { eval_id } = params;
		return this._client.delete(path`/evals/${eval_id}/runs/${runID}`, {
			...options,
			__security: { bearerAuth: true }
		});
	}
	/**
	* Cancel an ongoing evaluation run.
	*/
	cancel(runID, params, options) {
		const { eval_id } = params;
		return this._client.post(path`/evals/${eval_id}/runs/${runID}`, {
			...options,
			__security: { bearerAuth: true }
		});
	}
};
Runs.OutputItems = OutputItems;
//#endregion
//#region node_modules/openai/resources/evals/evals.mjs
/**
* Manage and run evals in the OpenAI platform.
*/
var Evals = class extends APIResource {
	constructor() {
		super(...arguments);
		this.runs = new Runs(this._client);
	}
	/**
	* Create the structure of an evaluation that can be used to test a model's
	* performance. An evaluation is a set of testing criteria and the config for a
	* data source, which dictates the schema of the data used in the evaluation. After
	* creating an evaluation, you can run it on different models and model parameters.
	* We support several types of graders and datasources. For more information, see
	* the [Evals guide](https://platform.openai.com/docs/guides/evals).
	*/
	create(body, options) {
		return this._client.post("/evals", {
			body,
			...options,
			__security: { bearerAuth: true }
		});
	}
	/**
	* Get an evaluation by ID.
	*/
	retrieve(evalID, options) {
		return this._client.get(path`/evals/${evalID}`, {
			...options,
			__security: { bearerAuth: true }
		});
	}
	/**
	* Update certain properties of an evaluation.
	*/
	update(evalID, body, options) {
		return this._client.post(path`/evals/${evalID}`, {
			body,
			...options,
			__security: { bearerAuth: true }
		});
	}
	/**
	* List evaluations for a project.
	*/
	list(query = {}, options) {
		return this._client.getAPIList("/evals", CursorPage, {
			query,
			...options,
			__security: { bearerAuth: true }
		});
	}
	/**
	* Delete an evaluation.
	*/
	delete(evalID, options) {
		return this._client.delete(path`/evals/${evalID}`, {
			...options,
			__security: { bearerAuth: true }
		});
	}
};
Evals.Runs = Runs;
//#endregion
//#region node_modules/openai/resources/files.mjs
/**
* Files are used to upload documents that can be used with features like Assistants and Fine-tuning.
*/
var Files$1 = class extends APIResource {
	/**
	* Upload a file that can be used across various endpoints. Individual files can be
	* up to 512 MB, and each project can store up to 2.5 TB of files in total. There
	* is no organization-wide storage limit. Uploads to this endpoint are rate-limited
	* to 1,000 requests per minute per authenticated user.
	*
	* - The Assistants API supports files up to 2 million tokens and of specific file
	*   types. See the
	*   [Assistants Tools guide](https://platform.openai.com/docs/assistants/tools)
	*   for details.
	* - The Fine-tuning API only supports `.jsonl` files. The input also has certain
	*   required formats for fine-tuning
	*   [chat](https://platform.openai.com/docs/api-reference/fine-tuning/chat-input)
	*   or
	*   [completions](https://platform.openai.com/docs/api-reference/fine-tuning/completions-input)
	*   models.
	* - The Batch API only supports `.jsonl` files up to 200 MB in size. The input
	*   also has a specific required
	*   [format](https://platform.openai.com/docs/api-reference/batch/request-input).
	* - For Retrieval or `file_search` ingestion, upload files here first. If you need
	*   to attach multiple uploaded files to the same vector store, use
	*   [`/vector_stores/{vector_store_id}/file_batches`](https://platform.openai.com/docs/api-reference/vector-stores-file-batches/createBatch)
	*   instead of attaching them one by one. Vector store attachment has separate
	*   limits from file upload, including 2,000 attached files per minute per
	*   organization.
	*
	* Please [contact us](https://help.openai.com/) if you need to increase these
	* storage limits.
	*/
	create(body, options) {
		return this._client.post("/files", multipartFormRequestOptions({
			body,
			...options,
			__security: { bearerAuth: true }
		}, this._client));
	}
	/**
	* Returns information about a specific file.
	*/
	retrieve(fileID, options) {
		return this._client.get(path`/files/${fileID}`, {
			...options,
			__security: { bearerAuth: true }
		});
	}
	/**
	* Returns a list of files.
	*/
	list(query = {}, options) {
		return this._client.getAPIList("/files", CursorPage, {
			query,
			...options,
			__security: { bearerAuth: true }
		});
	}
	/**
	* Delete a file and remove it from all vector stores.
	*/
	delete(fileID, options) {
		return this._client.delete(path`/files/${fileID}`, {
			...options,
			__security: { bearerAuth: true }
		});
	}
	/**
	* Returns the contents of the specified file.
	*/
	content(fileID, options) {
		return this._client.get(path`/files/${fileID}/content`, {
			...options,
			headers: buildHeaders([{ Accept: "application/binary" }, options?.headers]),
			__security: { bearerAuth: true },
			__binaryResponse: true
		});
	}
	/**
	* Waits for the given file to be processed, default timeout is 30 mins.
	*/
	async waitForProcessing(id, { pollInterval = 5e3, maxWait = 1800 * 1e3 } = {}) {
		const TERMINAL_STATES = /* @__PURE__ */ new Set([
			"processed",
			"error",
			"deleted"
		]);
		const start = Date.now();
		let file = await this.retrieve(id);
		while (!file.status || !TERMINAL_STATES.has(file.status)) {
			await sleep(pollInterval);
			file = await this.retrieve(id);
			if (Date.now() - start > maxWait) throw new APIConnectionTimeoutError({ message: `Giving up on waiting for file ${id} to finish processing after ${maxWait} milliseconds.` });
		}
		return file;
	}
};
//#endregion
//#region node_modules/openai/resources/fine-tuning/methods.mjs
var Methods = class extends APIResource {};
//#endregion
//#region node_modules/openai/resources/fine-tuning/alpha/graders.mjs
/**
* Manage fine-tuning jobs to tailor a model to your specific training data.
*/
var Graders$1 = class extends APIResource {
	/**
	* Run a grader.
	*
	* @example
	* ```ts
	* const response = await client.fineTuning.alpha.graders.run({
	*   grader: {
	*     input: 'input',
	*     name: 'name',
	*     operation: 'eq',
	*     reference: 'reference',
	*     type: 'string_check',
	*   },
	*   model_sample: 'model_sample',
	* });
	* ```
	*/
	run(body, options) {
		return this._client.post("/fine_tuning/alpha/graders/run", {
			body,
			...options,
			__security: { bearerAuth: true }
		});
	}
	/**
	* Validate a grader.
	*
	* @example
	* ```ts
	* const response =
	*   await client.fineTuning.alpha.graders.validate({
	*     grader: {
	*       input: 'input',
	*       name: 'name',
	*       operation: 'eq',
	*       reference: 'reference',
	*       type: 'string_check',
	*     },
	*   });
	* ```
	*/
	validate(body, options) {
		return this._client.post("/fine_tuning/alpha/graders/validate", {
			body,
			...options,
			__security: { bearerAuth: true }
		});
	}
};
//#endregion
//#region node_modules/openai/resources/fine-tuning/alpha/alpha.mjs
var Alpha = class extends APIResource {
	constructor() {
		super(...arguments);
		this.graders = new Graders$1(this._client);
	}
};
Alpha.Graders = Graders$1;
//#endregion
//#region node_modules/openai/resources/fine-tuning/checkpoints/permissions.mjs
/**
* Manage fine-tuning jobs to tailor a model to your specific training data.
*/
var Permissions = class extends APIResource {
	/**
	* **NOTE:** Calling this endpoint requires an [admin API key](../admin-api-keys).
	*
	* This enables organization owners to share fine-tuned models with other projects
	* in their organization.
	*
	* @example
	* ```ts
	* // Automatically fetches more pages as needed.
	* for await (const permissionCreateResponse of client.fineTuning.checkpoints.permissions.create(
	*   'ft:gpt-4o-mini-2024-07-18:org:weather:B7R9VjQd',
	*   { project_ids: ['string'] },
	* )) {
	*   // ...
	* }
	* ```
	*/
	create(fineTunedModelCheckpoint, body, options) {
		return this._client.getAPIList(path`/fine_tuning/checkpoints/${fineTunedModelCheckpoint}/permissions`, Page, {
			body,
			method: "post",
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* **NOTE:** This endpoint requires an [admin API key](../admin-api-keys).
	*
	* Organization owners can use this endpoint to view all permissions for a
	* fine-tuned model checkpoint.
	*
	* @deprecated Retrieve is deprecated. Please swap to the paginated list method instead.
	*/
	retrieve(fineTunedModelCheckpoint, query = {}, options) {
		return this._client.get(path`/fine_tuning/checkpoints/${fineTunedModelCheckpoint}/permissions`, {
			query,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* **NOTE:** This endpoint requires an [admin API key](../admin-api-keys).
	*
	* Organization owners can use this endpoint to view all permissions for a
	* fine-tuned model checkpoint.
	*
	* @example
	* ```ts
	* // Automatically fetches more pages as needed.
	* for await (const permissionListResponse of client.fineTuning.checkpoints.permissions.list(
	*   'ft-AF1WoRqd3aJAHsqc9NY7iL8F',
	* )) {
	*   // ...
	* }
	* ```
	*/
	list(fineTunedModelCheckpoint, query = {}, options) {
		return this._client.getAPIList(path`/fine_tuning/checkpoints/${fineTunedModelCheckpoint}/permissions`, ConversationCursorPage, {
			query,
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
	/**
	* **NOTE:** This endpoint requires an [admin API key](../admin-api-keys).
	*
	* Organization owners can use this endpoint to delete a permission for a
	* fine-tuned model checkpoint.
	*
	* @example
	* ```ts
	* const permission =
	*   await client.fineTuning.checkpoints.permissions.delete(
	*     'cp_zc4Q7MP6XxulcVzj4MZdwsAB',
	*     {
	*       fine_tuned_model_checkpoint:
	*         'ft:gpt-4o-mini-2024-07-18:org:weather:B7R9VjQd',
	*     },
	*   );
	* ```
	*/
	delete(permissionID, params, options) {
		const { fine_tuned_model_checkpoint } = params;
		return this._client.delete(path`/fine_tuning/checkpoints/${fine_tuned_model_checkpoint}/permissions/${permissionID}`, {
			...options,
			__security: { adminAPIKeyAuth: true }
		});
	}
};
//#endregion
//#region node_modules/openai/resources/fine-tuning/checkpoints/checkpoints.mjs
var Checkpoints$1 = class extends APIResource {
	constructor() {
		super(...arguments);
		this.permissions = new Permissions(this._client);
	}
};
Checkpoints$1.Permissions = Permissions;
//#endregion
//#region node_modules/openai/resources/fine-tuning/jobs/checkpoints.mjs
/**
* Manage fine-tuning jobs to tailor a model to your specific training data.
*/
var Checkpoints = class extends APIResource {
	/**
	* List checkpoints for a fine-tuning job.
	*
	* @example
	* ```ts
	* // Automatically fetches more pages as needed.
	* for await (const fineTuningJobCheckpoint of client.fineTuning.jobs.checkpoints.list(
	*   'ft-AF1WoRqd3aJAHsqc9NY7iL8F',
	* )) {
	*   // ...
	* }
	* ```
	*/
	list(fineTuningJobID, query = {}, options) {
		return this._client.getAPIList(path`/fine_tuning/jobs/${fineTuningJobID}/checkpoints`, CursorPage, {
			query,
			...options,
			__security: { bearerAuth: true }
		});
	}
};
//#endregion
//#region node_modules/openai/resources/fine-tuning/jobs/jobs.mjs
/**
* Manage fine-tuning jobs to tailor a model to your specific training data.
*/
var Jobs = class extends APIResource {
	constructor() {
		super(...arguments);
		this.checkpoints = new Checkpoints(this._client);
	}
	/**
	* Creates a fine-tuning job which begins the process of creating a new model from
	* a given dataset.
	*
	* Response includes details of the enqueued job including job status and the name
	* of the fine-tuned models once complete.
	*
	* [Learn more about fine-tuning](https://platform.openai.com/docs/guides/model-optimization)
	*
	* @example
	* ```ts
	* const fineTuningJob = await client.fineTuning.jobs.create({
	*   model: 'gpt-4o-mini',
	*   training_file: 'file-abc123',
	* });
	* ```
	*/
	create(body, options) {
		return this._client.post("/fine_tuning/jobs", {
			body,
			...options,
			__security: { bearerAuth: true }
		});
	}
	/**
	* Get info about a fine-tuning job.
	*
	* [Learn more about fine-tuning](https://platform.openai.com/docs/guides/model-optimization)
	*
	* @example
	* ```ts
	* const fineTuningJob = await client.fineTuning.jobs.retrieve(
	*   'ft-AF1WoRqd3aJAHsqc9NY7iL8F',
	* );
	* ```
	*/
	retrieve(fineTuningJobID, options) {
		return this._client.get(path`/fine_tuning/jobs/${fineTuningJobID}`, {
			...options,
			__security: { bearerAuth: true }
		});
	}
	/**
	* List your organization's fine-tuning jobs
	*
	* @example
	* ```ts
	* // Automatically fetches more pages as needed.
	* for await (const fineTuningJob of client.fineTuning.jobs.list()) {
	*   // ...
	* }
	* ```
	*/
	list(query = {}, options) {
		return this._client.getAPIList("/fine_tuning/jobs", CursorPage, {
			query,
			...options,
			__security: { bearerAuth: true }
		});
	}
	/**
	* Immediately cancel a fine-tune job.
	*
	* @example
	* ```ts
	* const fineTuningJob = await client.fineTuning.jobs.cancel(
	*   'ft-AF1WoRqd3aJAHsqc9NY7iL8F',
	* );
	* ```
	*/
	cancel(fineTuningJobID, options) {
		return this._client.post(path`/fine_tuning/jobs/${fineTuningJobID}/cancel`, {
			...options,
			__security: { bearerAuth: true }
		});
	}
	/**
	* Get status updates for a fine-tuning job.
	*
	* @example
	* ```ts
	* // Automatically fetches more pages as needed.
	* for await (const fineTuningJobEvent of client.fineTuning.jobs.listEvents(
	*   'ft-AF1WoRqd3aJAHsqc9NY7iL8F',
	* )) {
	*   // ...
	* }
	* ```
	*/
	listEvents(fineTuningJobID, query = {}, options) {
		return this._client.getAPIList(path`/fine_tuning/jobs/${fineTuningJobID}/events`, CursorPage, {
			query,
			...options,
			__security: { bearerAuth: true }
		});
	}
	/**
	* Pause a fine-tune job.
	*
	* @example
	* ```ts
	* const fineTuningJob = await client.fineTuning.jobs.pause(
	*   'ft-AF1WoRqd3aJAHsqc9NY7iL8F',
	* );
	* ```
	*/
	pause(fineTuningJobID, options) {
		return this._client.post(path`/fine_tuning/jobs/${fineTuningJobID}/pause`, {
			...options,
			__security: { bearerAuth: true }
		});
	}
	/**
	* Resume a fine-tune job.
	*
	* @example
	* ```ts
	* const fineTuningJob = await client.fineTuning.jobs.resume(
	*   'ft-AF1WoRqd3aJAHsqc9NY7iL8F',
	* );
	* ```
	*/
	resume(fineTuningJobID, options) {
		return this._client.post(path`/fine_tuning/jobs/${fineTuningJobID}/resume`, {
			...options,
			__security: { bearerAuth: true }
		});
	}
};
Jobs.Checkpoints = Checkpoints;
//#endregion
//#region node_modules/openai/resources/fine-tuning/fine-tuning.mjs
var FineTuning = class extends APIResource {
	constructor() {
		super(...arguments);
		this.methods = new Methods(this._client);
		this.jobs = new Jobs(this._client);
		this.checkpoints = new Checkpoints$1(this._client);
		this.alpha = new Alpha(this._client);
	}
};
FineTuning.Methods = Methods;
FineTuning.Jobs = Jobs;
FineTuning.Checkpoints = Checkpoints$1;
FineTuning.Alpha = Alpha;
//#endregion
//#region node_modules/openai/resources/graders/grader-models.mjs
var GraderModels = class extends APIResource {};
//#endregion
//#region node_modules/openai/resources/graders/graders.mjs
var Graders = class extends APIResource {
	constructor() {
		super(...arguments);
		this.graderModels = new GraderModels(this._client);
	}
};
Graders.GraderModels = GraderModels;
//#endregion
//#region node_modules/openai/resources/images.mjs
/**
* Given a prompt and/or an input image, the model will generate a new image.
*/
var Images = class extends APIResource {
	/**
	* Creates a variation of a given image. This endpoint only supports `dall-e-2`.
	*
	* @example
	* ```ts
	* const imagesResponse = await client.images.createVariation({
	*   image: fs.createReadStream('otter.png'),
	* });
	* ```
	*/
	createVariation(body, options) {
		return this._client.post("/images/variations", multipartFormRequestOptions({
			body,
			...options,
			__security: { bearerAuth: true }
		}, this._client));
	}
	edit(body, options) {
		return this._client.post("/images/edits", multipartFormRequestOptions({
			body,
			...options,
			stream: body.stream ?? false,
			__security: { bearerAuth: true }
		}, this._client));
	}
	generate(body, options) {
		return this._client.post("/images/generations", {
			body,
			...options,
			stream: body.stream ?? false,
			__security: { bearerAuth: true }
		});
	}
};
//#endregion
//#region node_modules/openai/resources/models.mjs
/**
* List and describe the various models available in the API.
*/
var Models = class extends APIResource {
	/**
	* Retrieves a model instance, providing basic information about the model such as
	* the owner and permissioning.
	*/
	retrieve(model, options) {
		return this._client.get(path`/models/${model}`, {
			...options,
			__security: { bearerAuth: true }
		});
	}
	/**
	* Lists the currently available models, and provides basic information about each
	* one such as the owner and availability.
	*/
	list(options) {
		return this._client.getAPIList("/models", Page, {
			...options,
			__security: { bearerAuth: true }
		});
	}
	/**
	* Delete a fine-tuned model. You must have the Owner role in your organization to
	* delete a model.
	*/
	delete(model, options) {
		return this._client.delete(path`/models/${model}`, {
			...options,
			__security: { bearerAuth: true }
		});
	}
};
//#endregion
//#region node_modules/openai/resources/moderations.mjs
/**
* Given text and/or image inputs, classifies if those inputs are potentially harmful.
*/
var Moderations = class extends APIResource {
	/**
	* Classifies if text and/or image inputs are potentially harmful. Learn more in
	* the [moderation guide](https://platform.openai.com/docs/guides/moderation).
	*/
	create(body, options) {
		return this._client.post("/moderations", {
			body,
			...options,
			__security: { bearerAuth: true }
		});
	}
};
//#endregion
//#region node_modules/openai/resources/realtime/calls.mjs
var Calls = class extends APIResource {
	/**
	* Accept an incoming SIP call and configure the realtime session that will handle
	* it.
	*
	* @example
	* ```ts
	* await client.realtime.calls.accept('call_id', {
	*   type: 'realtime',
	* });
	* ```
	*/
	accept(callID, body, options) {
		return this._client.post(path`/realtime/calls/${callID}/accept`, {
			body,
			...options,
			headers: buildHeaders([{ Accept: "*/*" }, options?.headers]),
			__security: { bearerAuth: true }
		});
	}
	/**
	* End an active Realtime API call, whether it was initiated over SIP or WebRTC.
	*
	* @example
	* ```ts
	* await client.realtime.calls.hangup('call_id');
	* ```
	*/
	hangup(callID, options) {
		return this._client.post(path`/realtime/calls/${callID}/hangup`, {
			...options,
			headers: buildHeaders([{ Accept: "*/*" }, options?.headers]),
			__security: { bearerAuth: true }
		});
	}
	/**
	* Transfer an active SIP call to a new destination using the SIP REFER verb.
	*
	* @example
	* ```ts
	* await client.realtime.calls.refer('call_id', {
	*   target_uri: 'tel:+14155550123',
	* });
	* ```
	*/
	refer(callID, body, options) {
		return this._client.post(path`/realtime/calls/${callID}/refer`, {
			body,
			...options,
			headers: buildHeaders([{ Accept: "*/*" }, options?.headers]),
			__security: { bearerAuth: true }
		});
	}
	/**
	* Decline an incoming SIP call by returning a SIP status code to the caller.
	*
	* @example
	* ```ts
	* await client.realtime.calls.reject('call_id');
	* ```
	*/
	reject(callID, body = {}, options) {
		return this._client.post(path`/realtime/calls/${callID}/reject`, {
			body,
			...options,
			headers: buildHeaders([{ Accept: "*/*" }, options?.headers]),
			__security: { bearerAuth: true }
		});
	}
};
//#endregion
//#region node_modules/openai/resources/realtime/client-secrets.mjs
var ClientSecrets = class extends APIResource {
	/**
	* Create a Realtime client secret with an associated session configuration.
	*
	* Client secrets are short-lived tokens that can be passed to a client app, such
	* as a web frontend or mobile client, which grants access to the Realtime API
	* without leaking your main API key. You can configure a custom TTL for each
	* client secret.
	*
	* You can also attach session configuration options to the client secret, which
	* will be applied to any sessions created using that client secret, but these can
	* also be overridden by the client connection.
	*
	* [Learn more about authentication with client secrets over WebRTC](https://platform.openai.com/docs/guides/realtime-webrtc).
	*
	* Returns the created client secret and the effective session object. The client
	* secret is a string that looks like `ek_1234`.
	*
	* @example
	* ```ts
	* const clientSecret =
	*   await client.realtime.clientSecrets.create();
	* ```
	*/
	create(body, options) {
		return this._client.post("/realtime/client_secrets", {
			body,
			...options,
			__security: { bearerAuth: true }
		});
	}
};
//#endregion
//#region node_modules/openai/resources/realtime/realtime.mjs
var Realtime = class extends APIResource {
	constructor() {
		super(...arguments);
		this.clientSecrets = new ClientSecrets(this._client);
		this.calls = new Calls(this._client);
	}
};
Realtime.ClientSecrets = ClientSecrets;
Realtime.Calls = Calls;
//#endregion
//#region node_modules/openai/lib/ResponsesParser.mjs
function maybeParseResponse(response, params) {
	if (!params || !hasAutoParseableInput(params)) {
		const parsed = {
			...response,
			output_parsed: null,
			output: response.output.map((item) => {
				if (item.type === "function_call") return {
					...item,
					parsed_arguments: null
				};
				if (item.type === "message") return {
					...item,
					content: item.content.map((content) => ({
						...content,
						parsed: null
					}))
				};
				else return item;
			})
		};
		if (needsOutputText(response, parsed)) addOutputText(parsed);
		return parsed;
	}
	return parseResponse(response, params);
}
function parseResponse(response, params) {
	const shouldParse = !response.status || response.status === "completed";
	const output = response.output.map((item) => {
		if (item.type === "function_call") return shouldParse ? parseToolCall(params, item) : {
			...item,
			parsed_arguments: null
		};
		if (item.type === "message") {
			const content = item.content.map((content) => {
				if (content.type === "output_text") return {
					...content,
					parsed: shouldParse ? parseTextFormat(params, content.text) : null
				};
				return content;
			});
			return {
				...item,
				content
			};
		}
		return item;
	});
	const parsed = Object.assign({}, response, { output });
	if (needsOutputText(response, parsed)) addOutputText(parsed);
	Object.defineProperty(parsed, "output_parsed", {
		enumerable: true,
		get() {
			for (const output of parsed.output) {
				if (output.type !== "message") continue;
				for (const content of output.content) if (content.type === "output_text" && content.parsed !== null) return content.parsed;
			}
			return null;
		}
	});
	return parsed;
}
function parseTextFormat(params, content) {
	if (params.text?.format?.type !== "json_schema") return null;
	if ("$parseRaw" in params.text?.format) return (params.text?.format).$parseRaw(content);
	return JSON.parse(content);
}
function hasAutoParseableInput(params) {
	if (isAutoParsableResponseFormat(params.text?.format)) return true;
	return Array.isArray(params.tools) && params.tools.some((tool) => isAutoParsableTool(tool) || tool.type === "function" && tool.strict === true);
}
function isAutoParsableTool(tool) {
	return tool?.["$brand"] === "auto-parseable-tool";
}
function getInputToolByName(input_tools, name) {
	return input_tools.find((tool) => tool.type === "function" && tool.name === name);
}
function parseToolCall(params, toolCall) {
	const inputTool = getInputToolByName(params.tools ?? [], toolCall.name);
	return {
		...toolCall,
		...toolCall,
		parsed_arguments: isAutoParsableTool(inputTool) ? inputTool.$parseRaw(toolCall.arguments) : inputTool?.strict ? JSON.parse(toolCall.arguments) : null
	};
}
function needsOutputText(response, target) {
	return !Object.getOwnPropertyDescriptor(response, "output_text") || target.output_text == null;
}
function addOutputText(rsp) {
	const texts = [];
	for (const output of rsp.output) {
		if (output.type !== "message") continue;
		for (const content of output.content) if (content.type === "output_text") texts.push(content.text);
	}
	rsp.output_text = texts.join("");
}
//#endregion
//#region node_modules/openai/lib/responses/ResponseAccumulator.mjs
/**
* Applies a streaming event to a response snapshot.
*
* Always use the returned snapshot. Incremental events update the supplied snapshot
* in place, while response lifecycle events return a detached replacement. Event
* payloads are cloned, so retaining or replaying the raw events is safe.
*/
function accumulateResponse(event, snapshot) {
	if (!snapshot) {
		if (event.type !== "response.created") throw new OpenAIError(`When snapshot hasn't been set yet, expected 'response.created' event, got ${event.type}`);
		return cloneResponse(event.response);
	}
	switch (event.type) {
		case "response.output_item.added":
			snapshot.output.push(structuredClone(event.item));
			if (event.item.type === "message") addOutputText(snapshot);
			break;
		case "response.output_item.done":
			getOutput(snapshot, event.output_index);
			snapshot.output[event.output_index] = structuredClone(event.item);
			if (event.item.type === "message") addOutputText(snapshot);
			break;
		case "response.content_part.added": {
			const output = getOutput(snapshot, event.output_index);
			const type = output.type;
			const part = event.part;
			if (type === "message" && part.type !== "reasoning_text") {
				output.content.push(structuredClone(part));
				if (part.type === "output_text") addOutputText(snapshot);
			} else if (type === "reasoning" && part.type === "reasoning_text") {
				if (!output.content) output.content = [];
				output.content.push(structuredClone(part));
			}
			break;
		}
		case "response.content_part.done": {
			const output = getOutput(snapshot, event.output_index);
			const part = event.part;
			if (output.type === "message" && part.type !== "reasoning_text") {
				getContent(output.content, event.content_index);
				output.content[event.content_index] = structuredClone(part);
				if (part.type === "output_text") addOutputText(snapshot);
			} else if (output.type === "reasoning" && part.type === "reasoning_text") {
				const content = output.content;
				if (!content) throw new OpenAIError(`missing content at index ${event.content_index}`);
				getContent(content, event.content_index);
				content[event.content_index] = structuredClone(part);
			}
			break;
		}
		case "response.output_text.delta": {
			const output = getOutput(snapshot, event.output_index);
			if (output.type === "message") {
				const content = getContent(output.content, event.content_index);
				if (content.type !== "output_text") throw new OpenAIError(`expected content to be 'output_text', got ${content.type}`);
				content.text += event.delta;
				snapshot.output_text += event.delta;
			}
			break;
		}
		case "response.output_text.done": {
			const output = getOutput(snapshot, event.output_index);
			if (output.type === "message") {
				const content = getContent(output.content, event.content_index);
				if (content.type !== "output_text") throw new OpenAIError(`expected content to be 'output_text', got ${content.type}`);
				content.text = event.text;
				addOutputText(snapshot);
			}
			break;
		}
		case "response.output_text.annotation.added": {
			const output = getOutput(snapshot, event.output_index);
			if (output.type === "message") {
				const content = getContent(output.content, event.content_index);
				if (content.type !== "output_text") throw new OpenAIError(`expected content to be 'output_text', got ${content.type}`);
				content.annotations[event.annotation_index] = structuredClone(event.annotation);
			}
			break;
		}
		case "response.refusal.delta": {
			const output = getOutput(snapshot, event.output_index);
			if (output.type === "message") {
				const content = getContent(output.content, event.content_index);
				if (content.type !== "refusal") throw new OpenAIError(`expected content to be 'refusal', got ${content.type}`);
				content.refusal += event.delta;
			}
			break;
		}
		case "response.refusal.done": {
			const output = getOutput(snapshot, event.output_index);
			if (output.type === "message") {
				const content = getContent(output.content, event.content_index);
				if (content.type !== "refusal") throw new OpenAIError(`expected content to be 'refusal', got ${content.type}`);
				content.refusal = event.refusal;
			}
			break;
		}
		case "response.function_call_arguments.delta": {
			const output = getOutput(snapshot, event.output_index);
			if (output.type === "function_call") output.arguments += event.delta;
			break;
		}
		case "response.function_call_arguments.done": {
			const output = getOutput(snapshot, event.output_index);
			if (output.type === "function_call") output.arguments = event.arguments;
			break;
		}
		case "response.reasoning_text.delta": {
			const output = getOutput(snapshot, event.output_index);
			if (output.type === "reasoning") {
				if (!output.content) throw new OpenAIError(`missing content at index ${event.content_index}`);
				const content = getContent(output.content, event.content_index);
				if (content.type !== "reasoning_text") throw new OpenAIError(`expected content to be 'reasoning_text', got ${content.type}`);
				content.text += event.delta;
			}
			break;
		}
		case "response.reasoning_text.done": {
			const output = getOutput(snapshot, event.output_index);
			if (output.type === "reasoning") {
				if (!output.content) throw new OpenAIError(`missing content at index ${event.content_index}`);
				const content = getContent(output.content, event.content_index);
				if (content.type !== "reasoning_text") throw new OpenAIError(`expected content to be 'reasoning_text', got ${content.type}`);
				content.text = event.text;
			}
			break;
		}
		case "response.reasoning_summary_part.added": {
			const output = getOutput(snapshot, event.output_index);
			if (output.type === "reasoning") output.summary.push(structuredClone(event.part));
			break;
		}
		case "response.reasoning_summary_part.done": {
			const output = getOutput(snapshot, event.output_index);
			if (output.type === "reasoning") {
				getContent(output.summary, event.summary_index);
				output.summary[event.summary_index] = structuredClone(event.part);
			}
			break;
		}
		case "response.reasoning_summary_text.delta": {
			const output = getOutput(snapshot, event.output_index);
			if (output.type === "reasoning") {
				const part = getContent(output.summary, event.summary_index);
				part.text += event.delta;
			}
			break;
		}
		case "response.reasoning_summary_text.done": {
			const output = getOutput(snapshot, event.output_index);
			if (output.type === "reasoning") {
				const part = getContent(output.summary, event.summary_index);
				part.text = event.text;
			}
			break;
		}
		case "response.custom_tool_call_input.delta": {
			const output = getOutput(snapshot, event.output_index);
			if (output.type === "custom_tool_call") output.input += event.delta;
			break;
		}
		case "response.custom_tool_call_input.done": {
			const output = getOutput(snapshot, event.output_index);
			if (output.type === "custom_tool_call") output.input = event.input;
			break;
		}
		case "response.mcp_call_arguments.delta": {
			const output = getOutput(snapshot, event.output_index);
			if (output.type === "mcp_call") output.arguments += event.delta;
			break;
		}
		case "response.mcp_call_arguments.done": {
			const output = getOutput(snapshot, event.output_index);
			if (output.type === "mcp_call") output.arguments = event.arguments;
			break;
		}
		case "response.code_interpreter_call_code.delta": {
			const output = getOutput(snapshot, event.output_index);
			if (output.type === "code_interpreter_call") output.code = (output.code ?? "") + event.delta;
			break;
		}
		case "response.code_interpreter_call_code.done": {
			const output = getOutput(snapshot, event.output_index);
			if (output.type === "code_interpreter_call") output.code = event.code;
			break;
		}
		case "response.code_interpreter_call.in_progress": {
			const output = getOutput(snapshot, event.output_index);
			if (output.type === "code_interpreter_call") output.status = "in_progress";
			break;
		}
		case "response.code_interpreter_call.interpreting": {
			const output = getOutput(snapshot, event.output_index);
			if (output.type === "code_interpreter_call") output.status = "interpreting";
			break;
		}
		case "response.code_interpreter_call.completed": {
			const output = getOutput(snapshot, event.output_index);
			if (output.type === "code_interpreter_call") output.status = "completed";
			break;
		}
		case "response.file_search_call.in_progress": {
			const output = getOutput(snapshot, event.output_index);
			if (output.type === "file_search_call") output.status = "in_progress";
			break;
		}
		case "response.file_search_call.searching": {
			const output = getOutput(snapshot, event.output_index);
			if (output.type === "file_search_call") output.status = "searching";
			break;
		}
		case "response.file_search_call.completed": {
			const output = getOutput(snapshot, event.output_index);
			if (output.type === "file_search_call") output.status = "completed";
			break;
		}
		case "response.web_search_call.in_progress": {
			const output = getOutput(snapshot, event.output_index);
			if (output.type === "web_search_call") output.status = "in_progress";
			break;
		}
		case "response.web_search_call.searching": {
			const output = getOutput(snapshot, event.output_index);
			if (output.type === "web_search_call") output.status = "searching";
			break;
		}
		case "response.web_search_call.completed": {
			const output = getOutput(snapshot, event.output_index);
			if (output.type === "web_search_call") output.status = "completed";
			break;
		}
		case "response.image_generation_call.in_progress": {
			const output = getOutput(snapshot, event.output_index);
			if (output.type === "image_generation_call") output.status = "in_progress";
			break;
		}
		case "response.image_generation_call.generating": {
			const output = getOutput(snapshot, event.output_index);
			if (output.type === "image_generation_call") output.status = "generating";
			break;
		}
		case "response.image_generation_call.completed": {
			const output = getOutput(snapshot, event.output_index);
			if (output.type === "image_generation_call") output.status = "completed";
			break;
		}
		case "response.mcp_call.in_progress": {
			const output = getOutput(snapshot, event.output_index);
			if (output.type === "mcp_call") output.status = "in_progress";
			break;
		}
		case "response.mcp_call.completed": {
			const output = getOutput(snapshot, event.output_index);
			if (output.type === "mcp_call") output.status = "completed";
			break;
		}
		case "response.mcp_call.failed": {
			const output = getOutput(snapshot, event.output_index);
			if (output.type === "mcp_call") output.status = "failed";
			break;
		}
		case "response.created":
		case "response.queued":
		case "response.in_progress":
		case "response.completed":
		case "response.failed":
		case "response.incomplete":
			snapshot = cloneResponse(event.response);
			break;
		case "response.audio.delta":
		case "response.audio.done":
		case "response.audio.transcript.delta":
		case "response.audio.transcript.done":
		case "response.image_generation_call.partial_image":
		case "response.mcp_list_tools.in_progress":
		case "response.mcp_list_tools.completed":
		case "response.mcp_list_tools.failed":
		case "keepalive":
		case "error": break;
		default: assertNever(event);
	}
	return snapshot;
}
function cloneResponse(response) {
	const snapshot = structuredClone(response);
	if (!Object.getOwnPropertyDescriptor(snapshot, "output_text") || snapshot.output_text == null) addOutputText(snapshot);
	return snapshot;
}
function getOutput(snapshot, outputIndex) {
	const output = snapshot.output[outputIndex];
	if (!output) throw new OpenAIError(`missing output at index ${outputIndex}`);
	return output;
}
function getContent(content, contentIndex) {
	const part = content[contentIndex];
	if (!part) throw new OpenAIError(`missing content at index ${contentIndex}`);
	return part;
}
function assertNever(value) {
	throw new OpenAIError(`Unhandled response stream event: ${JSON.stringify(value)}`);
}
//#endregion
//#region node_modules/openai/lib/responses/ResponseStream.mjs
var _ResponseStream_instances;
var _ResponseStream_params;
var _ResponseStream_currentResponseSnapshot;
var _ResponseStream_finalResponse;
var _ResponseStream_beginRequest;
var _ResponseStream_addEvent;
var _ResponseStream_endRequest;
var ResponseStream = class ResponseStream extends EventStream {
	constructor(params) {
		super();
		_ResponseStream_instances.add(this);
		_ResponseStream_params.set(this, void 0);
		_ResponseStream_currentResponseSnapshot.set(this, void 0);
		_ResponseStream_finalResponse.set(this, void 0);
		__classPrivateFieldSet(this, _ResponseStream_params, params, "f");
	}
	static createResponse(client, params, options) {
		const runner = new ResponseStream(params);
		runner._run(() => runner._createOrRetrieveResponse(client, params, {
			...options,
			headers: {
				...options?.headers,
				"X-Stainless-Helper-Method": "stream"
			}
		}));
		return runner;
	}
	static fromReadableStream(stream) {
		const runner = new ResponseStream(null);
		runner._run(() => runner._fromReadableStream(stream));
		return runner;
	}
	async _createOrRetrieveResponse(client, params, options) {
		this._listenForAbort(options?.signal);
		__classPrivateFieldGet(this, _ResponseStream_instances, "m", _ResponseStream_beginRequest).call(this);
		let stream;
		let starting_after = null;
		if ("response_id" in params) {
			stream = await client.responses.retrieve(params.response_id, { stream: true }, {
				...options,
				signal: this.controller.signal,
				stream: true
			});
			starting_after = params.starting_after ?? null;
		} else stream = await client.responses.create({
			...params,
			stream: true
		}, {
			...options,
			signal: this.controller.signal
		});
		this._connected();
		for await (const event of stream) __classPrivateFieldGet(this, _ResponseStream_instances, "m", _ResponseStream_addEvent).call(this, event, starting_after);
		if (stream.controller.signal?.aborted) throw new APIUserAbortError();
		return __classPrivateFieldGet(this, _ResponseStream_instances, "m", _ResponseStream_endRequest).call(this);
	}
	async _fromReadableStream(readableStream, options) {
		this._listenForAbort(options?.signal);
		__classPrivateFieldGet(this, _ResponseStream_instances, "m", _ResponseStream_beginRequest).call(this);
		this._connected();
		const stream = Stream.fromReadableStream(readableStream, this.controller);
		for await (const event of stream) __classPrivateFieldGet(this, _ResponseStream_instances, "m", _ResponseStream_addEvent).call(this, event, null);
		if (stream.controller.signal?.aborted) throw new APIUserAbortError();
		return __classPrivateFieldGet(this, _ResponseStream_instances, "m", _ResponseStream_endRequest).call(this);
	}
	[(_ResponseStream_params = /* @__PURE__ */ new WeakMap(), _ResponseStream_currentResponseSnapshot = /* @__PURE__ */ new WeakMap(), _ResponseStream_finalResponse = /* @__PURE__ */ new WeakMap(), _ResponseStream_instances = /* @__PURE__ */ new WeakSet(), _ResponseStream_beginRequest = function _ResponseStream_beginRequest() {
		if (this.ended) return;
		__classPrivateFieldSet(this, _ResponseStream_currentResponseSnapshot, void 0, "f");
	}, _ResponseStream_addEvent = function _ResponseStream_addEvent(event, starting_after) {
		if (this.ended) return;
		const maybeEmit = (name, event) => {
			if (starting_after == null || event.sequence_number > starting_after) this._emit(name, event);
		};
		const response = accumulateResponse(event, __classPrivateFieldGet(this, _ResponseStream_currentResponseSnapshot, "f"));
		__classPrivateFieldSet(this, _ResponseStream_currentResponseSnapshot, response, "f");
		maybeEmit("event", event);
		switch (event.type) {
			case "response.output_text.delta": {
				const output = response.output[event.output_index];
				if (!output) throw new OpenAIError(`missing output at index ${event.output_index}`);
				if (output.type === "message") {
					const content = output.content[event.content_index];
					if (!content) throw new OpenAIError(`missing content at index ${event.content_index}`);
					if (content.type !== "output_text") throw new OpenAIError(`expected content to be 'output_text', got ${content.type}`);
					maybeEmit("response.output_text.delta", {
						...event,
						snapshot: content.text
					});
				}
				break;
			}
			case "response.function_call_arguments.delta": {
				const output = response.output[event.output_index];
				if (!output) throw new OpenAIError(`missing output at index ${event.output_index}`);
				if (output.type === "function_call") maybeEmit("response.function_call_arguments.delta", {
					...event,
					snapshot: output.arguments
				});
				break;
			}
			default:
				maybeEmit(event.type, event);
				break;
		}
	}, _ResponseStream_endRequest = function _ResponseStream_endRequest() {
		if (this.ended) throw new OpenAIError(`stream has ended, this shouldn't happen`);
		const snapshot = __classPrivateFieldGet(this, _ResponseStream_currentResponseSnapshot, "f");
		if (!snapshot) throw new OpenAIError(`request ended without sending any events`);
		__classPrivateFieldSet(this, _ResponseStream_currentResponseSnapshot, void 0, "f");
		const parsedResponse = finalizeResponse(snapshot, __classPrivateFieldGet(this, _ResponseStream_params, "f"));
		__classPrivateFieldSet(this, _ResponseStream_finalResponse, parsedResponse, "f");
		return parsedResponse;
	}, Symbol.asyncIterator)]() {
		const pushQueue = [];
		const readQueue = [];
		let done = false;
		this.on("event", (event) => {
			const reader = readQueue.shift();
			if (reader) reader.resolve(event);
			else pushQueue.push(event);
		});
		this.on("end", () => {
			done = true;
			for (const reader of readQueue) reader.resolve(void 0);
			readQueue.length = 0;
		});
		this.on("abort", (err) => {
			done = true;
			for (const reader of readQueue) reader.reject(err);
			readQueue.length = 0;
		});
		this.on("error", (err) => {
			done = true;
			for (const reader of readQueue) reader.reject(err);
			readQueue.length = 0;
		});
		return {
			next: async () => {
				if (!pushQueue.length) {
					if (done) return {
						value: void 0,
						done: true
					};
					return new Promise((resolve, reject) => readQueue.push({
						resolve,
						reject
					})).then((event) => event ? {
						value: event,
						done: false
					} : {
						value: void 0,
						done: true
					});
				}
				return {
					value: pushQueue.shift(),
					done: false
				};
			},
			return: async () => {
				this.abort();
				return {
					value: void 0,
					done: true
				};
			}
		};
	}
	/**
	* @returns a promise that resolves with the final Response, or rejects
	* if an error occurred or the stream ended prematurely without producing a REsponse.
	*/
	async finalResponse() {
		await this.done();
		const response = __classPrivateFieldGet(this, _ResponseStream_finalResponse, "f");
		if (!response) throw new OpenAIError("stream ended without producing a ChatCompletion");
		return response;
	}
};
function finalizeResponse(snapshot, params) {
	return maybeParseResponse(snapshot, params);
}
//#endregion
//#region node_modules/openai/resources/responses/input-items.mjs
var InputItems = class extends APIResource {
	/**
	* Returns a list of input items for a given response.
	*
	* @example
	* ```ts
	* // Automatically fetches more pages as needed.
	* for await (const responseItem of client.responses.inputItems.list(
	*   'response_id',
	* )) {
	*   // ...
	* }
	* ```
	*/
	list(responseID, query = {}, options) {
		return this._client.getAPIList(path`/responses/${responseID}/input_items`, CursorPage, {
			query,
			...options,
			__security: { bearerAuth: true }
		});
	}
};
//#endregion
//#region node_modules/openai/resources/responses/input-tokens.mjs
var InputTokens = class extends APIResource {
	/**
	* Returns input token counts of the request.
	*
	* Returns an object with `object` set to `response.input_tokens` and an
	* `input_tokens` count.
	*
	* @example
	* ```ts
	* const response = await client.responses.inputTokens.count();
	* ```
	*/
	count(body = {}, options) {
		return this._client.post("/responses/input_tokens", {
			body,
			...options,
			__security: { bearerAuth: true }
		});
	}
};
//#endregion
//#region node_modules/openai/resources/responses/responses.mjs
var Responses = class extends APIResource {
	constructor() {
		super(...arguments);
		this.inputItems = new InputItems(this._client);
		this.inputTokens = new InputTokens(this._client);
	}
	create(body, options) {
		return this._client.post("/responses", {
			body,
			...options,
			stream: body.stream ?? false,
			__security: { bearerAuth: true }
		})._thenUnwrap((rsp) => {
			if ("object" in rsp && rsp.object === "response") addOutputText(rsp);
			return rsp;
		});
	}
	retrieve(responseID, query = {}, options) {
		return this._client.get(path`/responses/${responseID}`, {
			query,
			...options,
			stream: query?.stream ?? false,
			__security: { bearerAuth: true }
		})._thenUnwrap((rsp) => {
			if ("object" in rsp && rsp.object === "response") addOutputText(rsp);
			return rsp;
		});
	}
	/**
	* Deletes a model response with the given ID.
	*
	* @example
	* ```ts
	* await client.responses.delete(
	*   'resp_677efb5139a88190b512bc3fef8e535d',
	* );
	* ```
	*/
	delete(responseID, options) {
		return this._client.delete(path`/responses/${responseID}`, {
			...options,
			headers: buildHeaders([{ Accept: "*/*" }, options?.headers]),
			__security: { bearerAuth: true }
		});
	}
	parse(body, options) {
		return this._client.responses.create(body, options)._thenUnwrap((response) => parseResponse(response, body));
	}
	/**
	* Creates a model response stream
	*/
	stream(body, options) {
		return ResponseStream.createResponse(this._client, body, options);
	}
	/**
	* Cancels a model response with the given ID. Only responses created with the
	* `background` parameter set to `true` can be cancelled.
	* [Learn more](https://platform.openai.com/docs/guides/background).
	*
	* @example
	* ```ts
	* const response = await client.responses.cancel(
	*   'resp_677efb5139a88190b512bc3fef8e535d',
	* );
	* ```
	*/
	cancel(responseID, options) {
		return this._client.post(path`/responses/${responseID}/cancel`, {
			...options,
			__security: { bearerAuth: true }
		});
	}
	/**
	* Compact a conversation. Returns a compacted response object.
	*
	* Learn when and how to compact long-running conversations in the
	* [conversation state guide](https://platform.openai.com/docs/guides/conversation-state#managing-the-context-window).
	* For ZDR-compatible compaction details, see
	* [Compaction (advanced)](https://platform.openai.com/docs/guides/conversation-state#compaction-advanced).
	*
	* @example
	* ```ts
	* const compactedResponse = await client.responses.compact({
	*   model: 'gpt-5.6-sol',
	* });
	* ```
	*/
	compact(body, options) {
		return this._client.post("/responses/compact", {
			body,
			...options,
			__security: { bearerAuth: true }
		});
	}
};
Responses.InputItems = InputItems;
Responses.InputTokens = InputTokens;
//#endregion
//#region node_modules/openai/resources/skills/content.mjs
var Content$1 = class extends APIResource {
	/**
	* Download a skill zip bundle by its ID.
	*/
	retrieve(skillID, options) {
		return this._client.get(path`/skills/${skillID}/content`, {
			...options,
			headers: buildHeaders([{ Accept: "application/binary" }, options?.headers]),
			__security: { bearerAuth: true },
			__binaryResponse: true
		});
	}
};
//#endregion
//#region node_modules/openai/resources/skills/versions/content.mjs
var Content = class extends APIResource {
	/**
	* Download a skill version zip bundle.
	*/
	retrieve(version, params, options) {
		const { skill_id } = params;
		return this._client.get(path`/skills/${skill_id}/versions/${version}/content`, {
			...options,
			headers: buildHeaders([{ Accept: "application/binary" }, options?.headers]),
			__security: { bearerAuth: true },
			__binaryResponse: true
		});
	}
};
//#endregion
//#region node_modules/openai/resources/skills/versions/versions.mjs
var Versions = class extends APIResource {
	constructor() {
		super(...arguments);
		this.content = new Content(this._client);
	}
	/**
	* Create a new immutable skill version.
	*/
	create(skillID, body = {}, options) {
		return this._client.post(path`/skills/${skillID}/versions`, maybeMultipartFormRequestOptions({
			body,
			...options,
			__security: { bearerAuth: true }
		}, this._client));
	}
	/**
	* Get a specific skill version.
	*/
	retrieve(version, params, options) {
		const { skill_id } = params;
		return this._client.get(path`/skills/${skill_id}/versions/${version}`, {
			...options,
			__security: { bearerAuth: true }
		});
	}
	/**
	* List skill versions for a skill.
	*/
	list(skillID, query = {}, options) {
		return this._client.getAPIList(path`/skills/${skillID}/versions`, CursorPage, {
			query,
			...options,
			__security: { bearerAuth: true }
		});
	}
	/**
	* Delete a skill version.
	*/
	delete(version, params, options) {
		const { skill_id } = params;
		return this._client.delete(path`/skills/${skill_id}/versions/${version}`, {
			...options,
			__security: { bearerAuth: true }
		});
	}
};
Versions.Content = Content;
//#endregion
//#region node_modules/openai/resources/skills/skills.mjs
var Skills = class extends APIResource {
	constructor() {
		super(...arguments);
		this.content = new Content$1(this._client);
		this.versions = new Versions(this._client);
	}
	/**
	* Create a new skill.
	*/
	create(body = {}, options) {
		return this._client.post("/skills", maybeMultipartFormRequestOptions({
			body,
			...options,
			__security: { bearerAuth: true }
		}, this._client));
	}
	/**
	* Get a skill by its ID.
	*/
	retrieve(skillID, options) {
		return this._client.get(path`/skills/${skillID}`, {
			...options,
			__security: { bearerAuth: true }
		});
	}
	/**
	* Update the default version pointer for a skill.
	*/
	update(skillID, body, options) {
		return this._client.post(path`/skills/${skillID}`, {
			body,
			...options,
			__security: { bearerAuth: true }
		});
	}
	/**
	* List all skills for the current project.
	*/
	list(query = {}, options) {
		return this._client.getAPIList("/skills", CursorPage, {
			query,
			...options,
			__security: { bearerAuth: true }
		});
	}
	/**
	* Delete a skill by its ID.
	*/
	delete(skillID, options) {
		return this._client.delete(path`/skills/${skillID}`, {
			...options,
			__security: { bearerAuth: true }
		});
	}
};
Skills.Content = Content$1;
Skills.Versions = Versions;
//#endregion
//#region node_modules/openai/resources/uploads/parts.mjs
/**
* Use Uploads to upload large files in multiple parts.
*/
var Parts = class extends APIResource {
	/**
	* Adds a
	* [Part](https://platform.openai.com/docs/api-reference/uploads/part-object) to an
	* [Upload](https://platform.openai.com/docs/api-reference/uploads/object) object.
	* A Part represents a chunk of bytes from the file you are trying to upload.
	*
	* Each Part can be at most 64 MB, and you can add Parts until you hit the Upload
	* maximum of 8 GB.
	*
	* It is possible to add multiple Parts in parallel. You can decide the intended
	* order of the Parts when you
	* [complete the Upload](https://platform.openai.com/docs/api-reference/uploads/complete).
	*/
	create(uploadID, body, options) {
		return this._client.post(path`/uploads/${uploadID}/parts`, multipartFormRequestOptions({
			body,
			...options,
			__security: { bearerAuth: true }
		}, this._client));
	}
};
//#endregion
//#region node_modules/openai/resources/uploads/uploads.mjs
/**
* Use Uploads to upload large files in multiple parts.
*/
var Uploads = class extends APIResource {
	constructor() {
		super(...arguments);
		this.parts = new Parts(this._client);
	}
	/**
	* Creates an intermediate
	* [Upload](https://platform.openai.com/docs/api-reference/uploads/object) object
	* that you can add
	* [Parts](https://platform.openai.com/docs/api-reference/uploads/part-object) to.
	* Currently, an Upload can accept at most 8 GB in total and expires after an hour
	* after you create it.
	*
	* Once you complete the Upload, we will create a
	* [File](https://platform.openai.com/docs/api-reference/files/object) object that
	* contains all the parts you uploaded. This File is usable in the rest of our
	* platform as a regular File object.
	*
	* For certain `purpose` values, the correct `mime_type` must be specified. Please
	* refer to documentation for the
	* [supported MIME types for your use case](https://platform.openai.com/docs/assistants/tools/file-search#supported-files).
	*
	* For guidance on the proper filename extensions for each purpose, please follow
	* the documentation on
	* [creating a File](https://platform.openai.com/docs/api-reference/files/create).
	*
	* Returns the Upload object with status `pending`.
	*/
	create(body, options) {
		return this._client.post("/uploads", {
			body,
			...options,
			__security: { bearerAuth: true }
		});
	}
	/**
	* Cancels the Upload. No Parts may be added after an Upload is cancelled.
	*
	* Returns the Upload object with status `cancelled`.
	*/
	cancel(uploadID, options) {
		return this._client.post(path`/uploads/${uploadID}/cancel`, {
			...options,
			__security: { bearerAuth: true }
		});
	}
	/**
	* Completes the
	* [Upload](https://platform.openai.com/docs/api-reference/uploads/object).
	*
	* Within the returned Upload object, there is a nested
	* [File](https://platform.openai.com/docs/api-reference/files/object) object that
	* is ready to use in the rest of the platform.
	*
	* You can specify the order of the Parts by passing in an ordered list of the Part
	* IDs.
	*
	* The number of bytes uploaded upon completion must match the number of bytes
	* initially specified when creating the Upload object. No Parts may be added after
	* an Upload is completed. Returns the Upload object with status `completed`,
	* including an additional `file` property containing the created usable File
	* object.
	*/
	complete(uploadID, body, options) {
		return this._client.post(path`/uploads/${uploadID}/complete`, {
			body,
			...options,
			__security: { bearerAuth: true }
		});
	}
};
Uploads.Parts = Parts;
//#endregion
//#region node_modules/openai/lib/Util.mjs
/**
* Like `Promise.allSettled()` but throws an error if any promises are rejected.
*/
var allSettledWithThrow = async (promises) => {
	const results = await Promise.allSettled(promises);
	const rejected = results.filter((result) => result.status === "rejected");
	if (rejected.length) {
		for (const result of rejected) console.error(result.reason);
		throw new Error(`${rejected.length} promise(s) failed - see the above errors`);
	}
	const values = [];
	for (const result of results) if (result.status === "fulfilled") values.push(result.value);
	return values;
};
//#endregion
//#region node_modules/openai/resources/vector-stores/file-batches.mjs
var FileBatches = class extends APIResource {
	/**
	* Create a vector store file batch.
	*/
	create(vectorStoreID, body, options) {
		return this._client.post(path`/vector_stores/${vectorStoreID}/file_batches`, {
			body,
			...options,
			headers: buildHeaders([{ "OpenAI-Beta": "assistants=v2" }, options?.headers]),
			__security: { bearerAuth: true }
		});
	}
	/**
	* Retrieves a vector store file batch.
	*/
	retrieve(batchID, params, options) {
		const { vector_store_id } = params;
		return this._client.get(path`/vector_stores/${vector_store_id}/file_batches/${batchID}`, {
			...options,
			headers: buildHeaders([{ "OpenAI-Beta": "assistants=v2" }, options?.headers]),
			__security: { bearerAuth: true }
		});
	}
	/**
	* Cancel a vector store file batch. This attempts to cancel the processing of
	* files in this batch as soon as possible.
	*/
	cancel(batchID, params, options) {
		const { vector_store_id } = params;
		return this._client.post(path`/vector_stores/${vector_store_id}/file_batches/${batchID}/cancel`, {
			...options,
			headers: buildHeaders([{ "OpenAI-Beta": "assistants=v2" }, options?.headers]),
			__security: { bearerAuth: true }
		});
	}
	/**
	* Create a vector store batch and poll until all files have been processed.
	*/
	async createAndPoll(vectorStoreId, body, options) {
		const batch = await this.create(vectorStoreId, body);
		return await this.poll(vectorStoreId, batch.id, options);
	}
	/**
	* Returns a list of vector store files in a batch.
	*/
	listFiles(batchID, params, options) {
		const { vector_store_id, ...query } = params;
		return this._client.getAPIList(path`/vector_stores/${vector_store_id}/file_batches/${batchID}/files`, CursorPage, {
			query,
			...options,
			headers: buildHeaders([{ "OpenAI-Beta": "assistants=v2" }, options?.headers]),
			__security: { bearerAuth: true }
		});
	}
	/**
	* Wait for the given file batch to be processed.
	*
	* Note: this will return even if one of the files failed to process, you need to
	* check batch.file_counts.failed_count to handle this case.
	*/
	async poll(vectorStoreID, batchID, options) {
		const headers = buildHeaders([options?.headers, {
			"X-Stainless-Poll-Helper": "true",
			"X-Stainless-Custom-Poll-Interval": options?.pollIntervalMs?.toString() ?? void 0
		}]);
		while (true) {
			const { data: batch, response } = await this.retrieve(batchID, { vector_store_id: vectorStoreID }, {
				...options,
				headers
			}).withResponse();
			switch (batch.status) {
				case "in_progress":
					let sleepInterval = 5e3;
					if (options?.pollIntervalMs) sleepInterval = options.pollIntervalMs;
					else {
						const headerInterval = response.headers.get("openai-poll-after-ms");
						if (headerInterval) {
							const headerIntervalMs = parseInt(headerInterval);
							if (!isNaN(headerIntervalMs)) sleepInterval = headerIntervalMs;
						}
					}
					await sleep(sleepInterval);
					break;
				case "failed":
				case "cancelled":
				case "completed": return batch;
			}
		}
	}
	/**
	* Uploads the given files concurrently and then creates a vector store file batch.
	*
	* The concurrency limit is configurable using the `maxConcurrency` parameter.
	*/
	async uploadAndPoll(vectorStoreId, { files, fileIds = [] }, options) {
		if (files == null || files.length == 0) throw new Error(`No \`files\` provided to process. If you've already uploaded files you should use \`.createAndPoll()\` instead`);
		const configuredConcurrency = options?.maxConcurrency ?? 5;
		const concurrencyLimit = Math.min(configuredConcurrency, files.length);
		const client = this._client;
		const fileIterator = files.values();
		const allFileIds = [...fileIds];
		async function processFiles(iterator) {
			for (let item of iterator) {
				const fileObj = await client.files.create({
					file: item,
					purpose: "assistants"
				}, options);
				allFileIds.push(fileObj.id);
			}
		}
		await allSettledWithThrow(Array(concurrencyLimit).fill(fileIterator).map(processFiles));
		return await this.createAndPoll(vectorStoreId, { file_ids: allFileIds });
	}
};
//#endregion
//#region node_modules/openai/resources/vector-stores/files.mjs
var Files = class extends APIResource {
	/**
	* Create a vector store file by attaching a
	* [File](https://platform.openai.com/docs/api-reference/files) to a
	* [vector store](https://platform.openai.com/docs/api-reference/vector-stores/object).
	*/
	create(vectorStoreID, body, options) {
		return this._client.post(path`/vector_stores/${vectorStoreID}/files`, {
			body,
			...options,
			headers: buildHeaders([{ "OpenAI-Beta": "assistants=v2" }, options?.headers]),
			__security: { bearerAuth: true }
		});
	}
	/**
	* Retrieves a vector store file.
	*/
	retrieve(fileID, params, options) {
		const { vector_store_id } = params;
		return this._client.get(path`/vector_stores/${vector_store_id}/files/${fileID}`, {
			...options,
			headers: buildHeaders([{ "OpenAI-Beta": "assistants=v2" }, options?.headers]),
			__security: { bearerAuth: true }
		});
	}
	/**
	* Update attributes on a vector store file.
	*/
	update(fileID, params, options) {
		const { vector_store_id, ...body } = params;
		return this._client.post(path`/vector_stores/${vector_store_id}/files/${fileID}`, {
			body,
			...options,
			headers: buildHeaders([{ "OpenAI-Beta": "assistants=v2" }, options?.headers]),
			__security: { bearerAuth: true }
		});
	}
	/**
	* Returns a list of vector store files.
	*/
	list(vectorStoreID, query = {}, options) {
		return this._client.getAPIList(path`/vector_stores/${vectorStoreID}/files`, CursorPage, {
			query,
			...options,
			headers: buildHeaders([{ "OpenAI-Beta": "assistants=v2" }, options?.headers]),
			__security: { bearerAuth: true }
		});
	}
	/**
	* Delete a vector store file. This will remove the file from the vector store but
	* the file itself will not be deleted. To delete the file, use the
	* [delete file](https://platform.openai.com/docs/api-reference/files/delete)
	* endpoint.
	*/
	delete(fileID, params, options) {
		const { vector_store_id } = params;
		return this._client.delete(path`/vector_stores/${vector_store_id}/files/${fileID}`, {
			...options,
			headers: buildHeaders([{ "OpenAI-Beta": "assistants=v2" }, options?.headers]),
			__security: { bearerAuth: true }
		});
	}
	/**
	* Attach a file to the given vector store and wait for it to be processed.
	*/
	async createAndPoll(vectorStoreId, body, options) {
		const file = await this.create(vectorStoreId, body, options);
		return await this.poll(vectorStoreId, file.id, options);
	}
	/**
	* Wait for the vector store file to finish processing.
	*
	* Note: this will return even if the file failed to process, you need to check
	* file.last_error and file.status to handle these cases
	*/
	async poll(vectorStoreID, fileID, options) {
		const headers = buildHeaders([options?.headers, {
			"X-Stainless-Poll-Helper": "true",
			"X-Stainless-Custom-Poll-Interval": options?.pollIntervalMs?.toString() ?? void 0
		}]);
		while (true) {
			const fileResponse = await this.retrieve(fileID, { vector_store_id: vectorStoreID }, {
				...options,
				headers
			}).withResponse();
			const file = fileResponse.data;
			switch (file.status) {
				case "in_progress":
					let sleepInterval = 5e3;
					if (options?.pollIntervalMs) sleepInterval = options.pollIntervalMs;
					else {
						const headerInterval = fileResponse.response.headers.get("openai-poll-after-ms");
						if (headerInterval) {
							const headerIntervalMs = parseInt(headerInterval);
							if (!isNaN(headerIntervalMs)) sleepInterval = headerIntervalMs;
						}
					}
					await sleep(sleepInterval);
					break;
				case "failed":
				case "completed": return file;
			}
		}
	}
	/**
	* Upload a file to the `files` API and then attach it to the given vector store.
	*
	* Note the file will be asynchronously processed (you can use the alternative
	* polling helper method to wait for processing to complete).
	*/
	async upload(vectorStoreId, file, options) {
		const fileInfo = await this._client.files.create({
			file,
			purpose: "assistants"
		}, options);
		return this.create(vectorStoreId, { file_id: fileInfo.id }, options);
	}
	/**
	* Add a file to a vector store and poll until processing is complete.
	*/
	async uploadAndPoll(vectorStoreId, file, options) {
		const fileInfo = await this.upload(vectorStoreId, file, options);
		return await this.poll(vectorStoreId, fileInfo.id, options);
	}
	/**
	* Retrieve the parsed contents of a vector store file.
	*/
	content(fileID, params, options) {
		const { vector_store_id } = params;
		return this._client.getAPIList(path`/vector_stores/${vector_store_id}/files/${fileID}/content`, Page, {
			...options,
			headers: buildHeaders([{ "OpenAI-Beta": "assistants=v2" }, options?.headers]),
			__security: { bearerAuth: true }
		});
	}
};
//#endregion
//#region node_modules/openai/resources/vector-stores/vector-stores.mjs
var VectorStores = class extends APIResource {
	constructor() {
		super(...arguments);
		this.files = new Files(this._client);
		this.fileBatches = new FileBatches(this._client);
	}
	/**
	* Create a vector store.
	*/
	create(body, options) {
		return this._client.post("/vector_stores", {
			body,
			...options,
			headers: buildHeaders([{ "OpenAI-Beta": "assistants=v2" }, options?.headers]),
			__security: { bearerAuth: true }
		});
	}
	/**
	* Retrieves a vector store.
	*/
	retrieve(vectorStoreID, options) {
		return this._client.get(path`/vector_stores/${vectorStoreID}`, {
			...options,
			headers: buildHeaders([{ "OpenAI-Beta": "assistants=v2" }, options?.headers]),
			__security: { bearerAuth: true }
		});
	}
	/**
	* Modifies a vector store.
	*/
	update(vectorStoreID, body, options) {
		return this._client.post(path`/vector_stores/${vectorStoreID}`, {
			body,
			...options,
			headers: buildHeaders([{ "OpenAI-Beta": "assistants=v2" }, options?.headers]),
			__security: { bearerAuth: true }
		});
	}
	/**
	* Returns a list of vector stores.
	*/
	list(query = {}, options) {
		return this._client.getAPIList("/vector_stores", CursorPage, {
			query,
			...options,
			headers: buildHeaders([{ "OpenAI-Beta": "assistants=v2" }, options?.headers]),
			__security: { bearerAuth: true }
		});
	}
	/**
	* Delete a vector store.
	*/
	delete(vectorStoreID, options) {
		return this._client.delete(path`/vector_stores/${vectorStoreID}`, {
			...options,
			headers: buildHeaders([{ "OpenAI-Beta": "assistants=v2" }, options?.headers]),
			__security: { bearerAuth: true }
		});
	}
	/**
	* Search a vector store for relevant chunks based on a query and file attributes
	* filter.
	*/
	search(vectorStoreID, body, options) {
		return this._client.getAPIList(path`/vector_stores/${vectorStoreID}/search`, Page, {
			body,
			method: "post",
			...options,
			headers: buildHeaders([{ "OpenAI-Beta": "assistants=v2" }, options?.headers]),
			__security: { bearerAuth: true }
		});
	}
};
VectorStores.Files = Files;
VectorStores.FileBatches = FileBatches;
//#endregion
//#region node_modules/openai/resources/videos.mjs
var Videos = class extends APIResource {
	/**
	* Create a new video generation job from a prompt and optional reference assets.
	*/
	create(body, options) {
		return this._client.post("/videos", multipartFormRequestOptions({
			body,
			...options,
			__security: { bearerAuth: true }
		}, this._client));
	}
	/**
	* Fetch the latest metadata for a generated video.
	*/
	retrieve(videoID, options) {
		return this._client.get(path`/videos/${videoID}`, {
			...options,
			__security: { bearerAuth: true }
		});
	}
	/**
	* List recently generated videos for the current project.
	*/
	list(query = {}, options) {
		return this._client.getAPIList("/videos", ConversationCursorPage, {
			query,
			...options,
			__security: { bearerAuth: true }
		});
	}
	/**
	* Permanently delete a completed or failed video and its stored assets.
	*/
	delete(videoID, options) {
		return this._client.delete(path`/videos/${videoID}`, {
			...options,
			__security: { bearerAuth: true }
		});
	}
	/**
	* Create a character from an uploaded video.
	*/
	createCharacter(body, options) {
		return this._client.post("/videos/characters", multipartFormRequestOptions({
			body,
			...options,
			__security: { bearerAuth: true }
		}, this._client));
	}
	/**
	* Download the generated video bytes or a derived preview asset.
	*
	* Streams the rendered video content for the specified video job.
	*/
	downloadContent(videoID, query = {}, options) {
		return this._client.get(path`/videos/${videoID}/content`, {
			query,
			...options,
			headers: buildHeaders([{ Accept: "application/binary" }, options?.headers]),
			__security: { bearerAuth: true },
			__binaryResponse: true
		});
	}
	/**
	* Create a new video generation job by editing a source video or existing
	* generated video.
	*/
	edit(body, options) {
		return this._client.post("/videos/edits", multipartFormRequestOptions({
			body,
			...options,
			__security: { bearerAuth: true }
		}, this._client));
	}
	/**
	* Create an extension of a completed video.
	*/
	extend(body, options) {
		return this._client.post("/videos/extensions", multipartFormRequestOptions({
			body,
			...options,
			__security: { bearerAuth: true }
		}, this._client));
	}
	/**
	* Fetch a character.
	*/
	getCharacter(characterID, options) {
		return this._client.get(path`/videos/characters/${characterID}`, {
			...options,
			__security: { bearerAuth: true }
		});
	}
	/**
	* Create a remix of a completed video using a refreshed prompt.
	*/
	remix(videoID, body, options) {
		return this._client.post(path`/videos/${videoID}/remix`, maybeMultipartFormRequestOptions({
			body,
			...options,
			__security: { bearerAuth: true }
		}, this._client));
	}
};
//#endregion
//#region node_modules/openai/resources/webhooks/webhooks.mjs
var _Webhooks_instances;
var _Webhooks_validateSecret;
var _Webhooks_getRequiredHeader;
var Webhooks = class extends APIResource {
	constructor() {
		super(...arguments);
		_Webhooks_instances.add(this);
	}
	/**
	* Validates that the given payload was sent by OpenAI and parses the payload.
	*/
	async unwrap(payload, headers, secret = this._client.webhookSecret, tolerance = 300) {
		await this.verifySignature(payload, headers, secret, tolerance);
		return JSON.parse(payload);
	}
	/**
	* Validates whether or not the webhook payload was sent by OpenAI.
	*
	* An error will be raised if the webhook payload was not sent by OpenAI.
	*
	* @param payload - The webhook payload
	* @param headers - The webhook headers
	* @param secret - The webhook secret (optional, will use client secret if not provided)
	* @param tolerance - Maximum age of the webhook in seconds (default: 300 = 5 minutes)
	*/
	async verifySignature(payload, headers, secret = this._client.webhookSecret, tolerance = 300) {
		if (typeof crypto === "undefined" || typeof crypto.subtle.importKey !== "function" || typeof crypto.subtle.verify !== "function") throw new Error("Webhook signature verification is only supported when the `crypto` global is defined");
		__classPrivateFieldGet(this, _Webhooks_instances, "m", _Webhooks_validateSecret).call(this, secret);
		const headersObj = buildHeaders([headers]).values;
		const signatureHeader = __classPrivateFieldGet(this, _Webhooks_instances, "m", _Webhooks_getRequiredHeader).call(this, headersObj, "webhook-signature");
		const timestamp = __classPrivateFieldGet(this, _Webhooks_instances, "m", _Webhooks_getRequiredHeader).call(this, headersObj, "webhook-timestamp");
		const webhookId = __classPrivateFieldGet(this, _Webhooks_instances, "m", _Webhooks_getRequiredHeader).call(this, headersObj, "webhook-id");
		const timestampSeconds = parseInt(timestamp, 10);
		if (isNaN(timestampSeconds)) throw new InvalidWebhookSignatureError("Invalid webhook timestamp format");
		const nowSeconds = Math.floor(Date.now() / 1e3);
		if (nowSeconds - timestampSeconds > tolerance) throw new InvalidWebhookSignatureError("Webhook timestamp is too old");
		if (timestampSeconds > nowSeconds + tolerance) throw new InvalidWebhookSignatureError("Webhook timestamp is too new");
		const signatures = signatureHeader.split(" ").map((part) => part.startsWith("v1,") ? part.substring(3) : part);
		const decodedSecret = secret.startsWith("whsec_") ? Buffer.from(secret.replace("whsec_", ""), "base64") : Buffer.from(secret, "utf-8");
		const signedPayload = webhookId ? `${webhookId}.${timestamp}.${payload}` : `${timestamp}.${payload}`;
		const key = await crypto.subtle.importKey("raw", decodedSecret, {
			name: "HMAC",
			hash: "SHA-256"
		}, false, ["verify"]);
		for (const signature of signatures) try {
			const signatureBytes = Buffer.from(signature, "base64");
			if (await crypto.subtle.verify("HMAC", key, signatureBytes, new TextEncoder().encode(signedPayload))) return;
		} catch {
			continue;
		}
		throw new InvalidWebhookSignatureError("The given webhook signature does not match the expected signature");
	}
};
_Webhooks_instances = /* @__PURE__ */ new WeakSet(), _Webhooks_validateSecret = function _Webhooks_validateSecret(secret) {
	if (typeof secret !== "string" || secret.length === 0) throw new Error(`The webhook secret must either be set using the env var, OPENAI_WEBHOOK_SECRET, on the client class, OpenAI({ webhookSecret: '123' }), or passed to this function`);
}, _Webhooks_getRequiredHeader = function _Webhooks_getRequiredHeader(headers, name) {
	if (!headers) throw new Error(`Headers are required`);
	const value = headers.get(name);
	if (value === null || value === void 0) throw new Error(`Missing required header: ${name}`);
	return value;
};
//#endregion
//#region node_modules/openai/internal/provider.mjs
/**
* A provider factory such as `bedrock(options)` captures configuration in a
* definition, while every OpenAI client receives a fresh runtime from
* `definition.configure()`. Keeping definitions out of the provider object
* makes providers opaque and prevents arbitrary objects from imitating one.
* It also leaves provider-specific dependencies outside the core SDK.
*
* The registry lives on `globalThis` under a global symbol so a provider made
* by one copy of the package still works with another copy, including mixed
* CommonJS and ESM installations. The WeakMap avoids retaining discarded
* provider configurations.
*/
var providerDefinitionsKey = Symbol.for("openai.node.providerDefinitions.v1");
var providerGlobal = globalThis;
var existingProviderDefinitions = providerGlobal[providerDefinitionsKey];
var providerDefinitions = existingProviderDefinitions ?? /* @__PURE__ */ new WeakMap();
if (!existingProviderDefinitions) Object.defineProperty(providerGlobal, providerDefinitionsKey, { value: providerDefinitions });
function configureProvider(provider) {
	const definition = providerDefinitions.get(provider);
	if (!definition) throw new Error("Invalid provider. Providers must be created with createProvider().");
	return definition.configure();
}
//#endregion
//#region node_modules/openai/client.mjs
var _OpenAI_instances;
var _a;
var _OpenAI_encoder;
var _OpenAI_baseURLOverridden;
var WORKLOAD_IDENTITY_API_KEY_PLACEHOLDER = "workload-identity-auth";
/**
* API Client for interfacing with the OpenAI API.
*/
var OpenAI = class {
	/**
	* API Client for interfacing with the OpenAI API.
	*
	* @param {string | null | undefined} [opts.apiKey=process.env['OPENAI_API_KEY'] ?? null]
	* @param {string | null | undefined} [opts.adminAPIKey=process.env['OPENAI_ADMIN_KEY'] ?? null]
	* @param {string | null | undefined} [opts.organization=process.env['OPENAI_ORG_ID'] ?? null]
	* @param {string | null | undefined} [opts.project=process.env['OPENAI_PROJECT_ID'] ?? null]
	* @param {string | null | undefined} [opts.webhookSecret=process.env['OPENAI_WEBHOOK_SECRET'] ?? null]
	* @param {string} [opts.baseURL=process.env['OPENAI_BASE_URL'] ?? https://api.openai.com/v1] - Override the default base URL for the API.
	* @param {Provider} [opts.provider] - Configure a third-party API provider. Mutually exclusive with top-level authentication and base URL options.
	* @param {number} [opts.timeout=10 minutes] - The maximum amount of time (in milliseconds) the client will wait for a response before timing out.
	* @param {MergedRequestInit} [opts.fetchOptions] - Additional `RequestInit` options to be passed to `fetch` calls.
	* @param {Fetch} [opts.fetch] - Specify a custom `fetch` function implementation.
	* @param {number} [opts.maxRetries=2] - The maximum number of times the client will retry a request.
	* @param {HeadersLike} opts.defaultHeaders - Default headers to include with every request to the API.
	* @param {Record<string, string | undefined>} opts.defaultQuery - Default query parameters to include with every request to the API.
	* @param {boolean} [opts.dangerouslyAllowBrowser=false] - By default, client-side use of this library is not allowed, as it risks exposing your secret API credentials to attackers.
	*/
	constructor(clientOptions = {}) {
		_OpenAI_instances.add(this);
		_OpenAI_encoder.set(this, void 0);
		/**
		* Given a prompt, the model will return one or more predicted completions, and can also return the probabilities of alternative tokens at each position.
		*/
		this.completions = new Completions(this);
		this.chat = new Chat(this);
		/**
		* Get a vector representation of a given input that can be easily consumed by machine learning models and algorithms.
		*/
		this.embeddings = new Embeddings(this);
		/**
		* Files are used to upload documents that can be used with features like Assistants and Fine-tuning.
		*/
		this.files = new Files$1(this);
		/**
		* Given a prompt and/or an input image, the model will generate a new image.
		*/
		this.images = new Images(this);
		this.audio = new Audio(this);
		/**
		* Given text and/or image inputs, classifies if those inputs are potentially harmful.
		*/
		this.moderations = new Moderations(this);
		/**
		* List and describe the various models available in the API.
		*/
		this.models = new Models(this);
		this.fineTuning = new FineTuning(this);
		this.graders = new Graders(this);
		this.vectorStores = new VectorStores(this);
		this.webhooks = new Webhooks(this);
		this.beta = new Beta(this);
		/**
		* Create large batches of API requests to run asynchronously.
		*/
		this.batches = new Batches(this);
		/**
		* Use Uploads to upload large files in multiple parts.
		*/
		this.uploads = new Uploads(this);
		this.admin = new Admin(this);
		this.responses = new Responses(this);
		this.realtime = new Realtime(this);
		/**
		* Manage conversations and conversation items.
		*/
		this.conversations = new Conversations(this);
		/**
		* Manage and run evals in the OpenAI platform.
		*/
		this.evals = new Evals(this);
		this.containers = new Containers(this);
		this.skills = new Skills(this);
		this.videos = new Videos(this);
		const provider = clientOptions.provider;
		if (provider) {
			const conflictingOptions = [
				"apiKey",
				"adminAPIKey",
				"workloadIdentity",
				"baseURL"
			].filter((key) => clientOptions[key] != null);
			if (conflictingOptions.length) throw new OpenAIError(`The \`provider\` option cannot be used with ${conflictingOptions.map((key) => `\`${key}\``).join(", ")}. Configure authentication and the base URL through the provider instead.`);
		}
		const { baseURL = provider ? null : readEnv("OPENAI_BASE_URL"), apiKey = provider ? null : readEnv("OPENAI_API_KEY") ?? null, adminAPIKey = provider ? null : readEnv("OPENAI_ADMIN_KEY") ?? null, organization = provider ? null : readEnv("OPENAI_ORG_ID") ?? null, project = provider ? null : readEnv("OPENAI_PROJECT_ID") ?? null, webhookSecret = readEnv("OPENAI_WEBHOOK_SECRET") ?? null, workloadIdentity, ...opts } = clientOptions;
		const providerRuntime = provider ? configureProvider(provider) : void 0;
		const options = {
			apiKey,
			adminAPIKey,
			organization,
			project,
			webhookSecret,
			workloadIdentity,
			provider,
			...opts,
			baseURL: providerRuntime?.baseURL ?? (baseURL || `https://api.openai.com/v1`)
		};
		if (apiKey && workloadIdentity) throw new OpenAIError("The `apiKey` and `workloadIdentity` options are mutually exclusive");
		if (!providerRuntime && !apiKey && !adminAPIKey && !workloadIdentity) throw new OpenAIError("Missing credentials. Please pass an `apiKey`, `workloadIdentity`, `adminAPIKey`, or set the `OPENAI_API_KEY` or `OPENAI_ADMIN_KEY` environment variable.");
		if (!options.dangerouslyAllowBrowser && isRunningInBrowser()) throw new OpenAIError("It looks like you're running in a browser-like environment.\n\nThis is disabled by default, as it risks exposing your secret API credentials to attackers.\nIf you understand the risks and have appropriate mitigations in place,\nyou can set the `dangerouslyAllowBrowser` option to `true`, e.g.,\n\nnew OpenAI({ apiKey, dangerouslyAllowBrowser: true });\n\nhttps://help.openai.com/en/articles/5112595-best-practices-for-api-key-safety\n");
		this.baseURL = options.baseURL;
		this.timeout = options.timeout ?? _a.DEFAULT_TIMEOUT;
		this.logger = options.logger ?? console;
		const defaultLogLevel = "warn";
		this.logLevel = defaultLogLevel;
		this.logLevel = parseLogLevel(options.logLevel, "ClientOptions.logLevel", this) ?? parseLogLevel(readEnv("OPENAI_LOG"), "process.env['OPENAI_LOG']", this) ?? defaultLogLevel;
		this.fetchOptions = options.fetchOptions;
		this.maxRetries = options.maxRetries ?? 2;
		this.fetch = options.fetch ?? getDefaultFetch();
		__classPrivateFieldSet(this, _OpenAI_encoder, FallbackEncoder, "f");
		const customHeadersEnv = provider ? void 0 : readEnv("OPENAI_CUSTOM_HEADERS");
		if (customHeadersEnv) {
			const parsed = {};
			for (const line of customHeadersEnv.split("\n")) {
				const colon = line.indexOf(":");
				if (colon >= 0) parsed[line.substring(0, colon).trim()] = line.substring(colon + 1).trim();
			}
			options.defaultHeaders = buildHeaders([parsed, options.defaultHeaders]);
		}
		this._options = options;
		this._provider = providerRuntime;
		if (workloadIdentity) this._workloadIdentityAuth = new WorkloadIdentityAuth(workloadIdentity, this.fetch);
		this.apiKey = typeof apiKey === "string" ? apiKey : null;
		this.adminAPIKey = adminAPIKey;
		this.organization = organization;
		this.project = project;
		this.webhookSecret = webhookSecret;
	}
	/**
	* Create a new client instance re-using the same options given to the current client with optional overriding.
	*/
	withOptions(options) {
		const inheritedProvider = this._options.provider;
		const provider = options.provider ?? inheritedProvider;
		const inheritedOptions = {
			...this._options,
			baseURL: this.baseURL,
			maxRetries: this.maxRetries,
			timeout: this.timeout,
			logger: this.logger,
			logLevel: this.logLevel,
			fetch: this.fetch,
			fetchOptions: this.fetchOptions,
			apiKey: this._options.apiKey,
			adminAPIKey: this.adminAPIKey,
			workloadIdentity: this._options.workloadIdentity,
			organization: this.organization,
			project: this.project,
			webhookSecret: this.webhookSecret
		};
		if (provider) {
			delete inheritedOptions.apiKey;
			delete inheritedOptions.adminAPIKey;
			delete inheritedOptions.workloadIdentity;
			delete inheritedOptions.baseURL;
			if (provider !== inheritedProvider) {
				delete inheritedOptions.organization;
				delete inheritedOptions.project;
				delete inheritedOptions.defaultHeaders;
			}
		}
		return new this.constructor({
			...inheritedOptions,
			...options,
			provider
		});
	}
	defaultQuery() {
		return this._options.defaultQuery;
	}
	validateHeaders({ values, nulls }, schemes = {
		bearerAuth: true,
		adminAPIKeyAuth: true
	}) {
		if (values.get("authorization") || values.get("api-key")) return;
		if (nulls.has("authorization") || nulls.has("api-key")) return;
		if (this._workloadIdentityAuth && schemes.bearerAuth) return;
		throw new Error("Could not resolve authentication method. Expected either apiKey or adminAPIKey to be set. Or for one of the \"Authorization\" or \"api-key\" headers to be explicitly omitted");
	}
	async authHeaders(opts, schemes = {
		bearerAuth: true,
		adminAPIKeyAuth: true
	}) {
		return buildHeaders([schemes.bearerAuth ? await this.bearerAuth(opts) : null, schemes.adminAPIKeyAuth ? await this.adminAPIKeyAuth(opts) : null]);
	}
	async bearerAuth(opts) {
		if (this._workloadIdentityAuth) return buildHeaders([{ Authorization: `Bearer ${await this._workloadIdentityAuth.getToken()}` }]);
		if (this.apiKey == null) return;
		return buildHeaders([{ Authorization: `Bearer ${this.apiKey}` }]);
	}
	async adminAPIKeyAuth(opts) {
		if (this.adminAPIKey == null) return;
		return buildHeaders([{ Authorization: `Bearer ${this.adminAPIKey}` }]);
	}
	stringifyQuery(query) {
		return stringifyQuery(query);
	}
	getUserAgent() {
		return `${this.constructor.name}/JS ${VERSION}`;
	}
	defaultIdempotencyKey() {
		return `stainless-node-retry-${uuid4()}`;
	}
	makeStatusError(status, error, message, headers) {
		return APIError.generate(status, error, message, headers);
	}
	async _callApiKey() {
		if (this._provider) return false;
		const apiKey = this._options.apiKey;
		if (typeof apiKey !== "function") return false;
		let token;
		try {
			token = await apiKey();
		} catch (err) {
			if (err instanceof OpenAIError) throw err;
			throw new OpenAIError(`Failed to get token from 'apiKey' function: ${err.message}`, { cause: err });
		}
		if (typeof token !== "string" || !token) throw new OpenAIError(`Expected 'apiKey' function argument to return a string but it returned ${token}`);
		this.apiKey = token;
		return true;
	}
	buildURL(path, query, defaultBaseURL) {
		const baseURL = !__classPrivateFieldGet(this, _OpenAI_instances, "m", _OpenAI_baseURLOverridden).call(this) && defaultBaseURL || this.baseURL;
		const url = isAbsoluteURL(path) ? new URL(path) : new URL(baseURL + (baseURL.endsWith("/") && path.startsWith("/") ? path.slice(1) : path));
		const defaultQuery = this.defaultQuery();
		const pathQuery = Object.fromEntries(url.searchParams);
		if (!isEmptyObj$1(defaultQuery) || !isEmptyObj$1(pathQuery)) query = {
			...pathQuery,
			...defaultQuery,
			...query
		};
		if (typeof query === "object" && query && !Array.isArray(query)) url.search = this.stringifyQuery(query);
		return url.toString();
	}
	/**
	* Used as a callback for mutating the given `FinalRequestOptions` object.
	*/
	async prepareOptions(options) {
		if (this._provider) return;
		if ((options.__security ?? { bearerAuth: true }).bearerAuth) await this._callApiKey();
	}
	/**
	* Used as a callback for mutating the given `RequestInit` object.
	*
	* This is useful for cases where you want to add certain headers based off of
	* the request properties, e.g. `method` or `url`.
	*/
	async prepareRequest(request, { url, options }) {}
	get(path, opts) {
		return this.methodRequest("get", path, opts);
	}
	post(path, opts) {
		return this.methodRequest("post", path, opts);
	}
	patch(path, opts) {
		return this.methodRequest("patch", path, opts);
	}
	put(path, opts) {
		return this.methodRequest("put", path, opts);
	}
	delete(path, opts) {
		return this.methodRequest("delete", path, opts);
	}
	methodRequest(method, path, opts) {
		return this.request(Promise.resolve(opts).then((opts) => {
			return {
				method,
				path,
				...opts
			};
		}));
	}
	request(options, remainingRetries = null) {
		return new APIPromise(this, this.makeRequest(options, remainingRetries, void 0));
	}
	async makeRequest(optionsInput, retriesRemaining, retryOfRequestLogID) {
		const options = await optionsInput;
		const maxRetries = options.maxRetries ?? this.maxRetries;
		if (retriesRemaining == null) retriesRemaining = maxRetries;
		await this.prepareOptions(options);
		const { req, url, timeout } = await this.buildRequest(options, { retryCount: maxRetries - retriesRemaining });
		const hasStreamingBody = options.__metadata?.["hasStreamingBody"] === true;
		await this.prepareRequest(req, {
			url,
			options
		});
		await this._provider?.prepareRequest?.(req, {
			url,
			options
		});
		/** Not an API request ID, just for correlating local log entries. */
		const requestLogID = "log_" + (Math.random() * (1 << 24) | 0).toString(16).padStart(6, "0");
		const retryLogStr = retryOfRequestLogID === void 0 ? "" : `, retryOf: ${retryOfRequestLogID}`;
		const startTime = Date.now();
		loggerFor(this).debug(`[${requestLogID}] sending request`, formatRequestDetails({
			retryOfRequestLogID,
			method: options.method,
			url,
			options,
			headers: req.headers
		}));
		if (options.signal?.aborted) throw new APIUserAbortError();
		const security = options.__security ?? { bearerAuth: true };
		const controller = new AbortController();
		const response = await this.fetchWithAuth(url, req, timeout, controller, security).catch(castToError);
		const headersTime = Date.now();
		if (response instanceof globalThis.Error) {
			const retryMessage = `retrying, ${retriesRemaining} attempts remaining`;
			if (options.signal?.aborted) throw new APIUserAbortError();
			const isTimeout = isAbortError(response) || /timed? ?out/i.test(String(response) + ("cause" in response ? String(response.cause) : ""));
			if (retriesRemaining && !hasStreamingBody) {
				loggerFor(this).info(`[${requestLogID}] connection ${isTimeout ? "timed out" : "failed"} - ${retryMessage}`);
				loggerFor(this).debug(`[${requestLogID}] connection ${isTimeout ? "timed out" : "failed"} (${retryMessage})`, formatRequestDetails({
					retryOfRequestLogID,
					url,
					durationMs: headersTime - startTime,
					message: response.message
				}));
				return this.retryRequest(options, retriesRemaining, retryOfRequestLogID ?? requestLogID);
			}
			const terminalMessage = hasStreamingBody ? "error; streaming body cannot be retried" : "error; no more retries left";
			loggerFor(this).info(`[${requestLogID}] connection ${isTimeout ? "timed out" : "failed"} - ${terminalMessage}`);
			loggerFor(this).debug(`[${requestLogID}] connection ${isTimeout ? "timed out" : "failed"} (${terminalMessage})`, formatRequestDetails({
				retryOfRequestLogID,
				url,
				durationMs: headersTime - startTime,
				message: response.message
			}));
			if (response instanceof OAuthError || response instanceof SubjectTokenProviderError) throw response;
			if (isTimeout) throw new APIConnectionTimeoutError();
			throw new APIConnectionError({
				message: getConnectionErrorMessage(response),
				cause: response
			});
		}
		const responseInfo = `[${requestLogID}${retryLogStr}${[...response.headers.entries()].filter(([name]) => name === "x-request-id").map(([name, value]) => ", " + name + ": " + JSON.stringify(value)).join("")}] ${req.method} ${url} ${response.ok ? "succeeded" : "failed"} with status ${response.status} in ${headersTime - startTime}ms`;
		if (!response.ok) {
			if (response.status === 401 && this._workloadIdentityAuth && security.bearerAuth && !options.__metadata?.["hasStreamingBody"] && !options.__metadata?.["workloadIdentityTokenRefreshed"]) {
				await CancelReadableStream(response.body);
				this._workloadIdentityAuth.invalidateToken();
				return this.makeRequest({
					...options,
					__metadata: {
						...options.__metadata,
						workloadIdentityTokenRefreshed: true
					}
				}, retriesRemaining, retryOfRequestLogID ?? requestLogID);
			}
			const shouldRetry = await this.shouldRetry(response);
			if (retriesRemaining && shouldRetry && !hasStreamingBody) {
				const retryMessage = `retrying, ${retriesRemaining} attempts remaining`;
				await CancelReadableStream(response.body);
				loggerFor(this).info(`${responseInfo} - ${retryMessage}`);
				loggerFor(this).debug(`[${requestLogID}] response error (${retryMessage})`, formatRequestDetails({
					retryOfRequestLogID,
					url: response.url,
					status: response.status,
					headers: response.headers,
					durationMs: headersTime - startTime
				}));
				return this.retryRequest(options, retriesRemaining, retryOfRequestLogID ?? requestLogID, response.headers);
			}
			const retryMessage = shouldRetry ? hasStreamingBody ? `error; streaming body cannot be retried` : `error; no more retries left` : `error; not retryable`;
			loggerFor(this).info(`${responseInfo} - ${retryMessage}`);
			const errText = await response.text().catch((err) => castToError(err).message);
			const errJSON = safeJSON(errText);
			const errMessage = errJSON ? void 0 : errText;
			loggerFor(this).debug(`[${requestLogID}] response error (${retryMessage})`, formatRequestDetails({
				retryOfRequestLogID,
				url: response.url,
				status: response.status,
				headers: response.headers,
				message: errMessage,
				durationMs: Date.now() - startTime
			}));
			throw this.makeStatusError(response.status, errJSON, errMessage, response.headers);
		}
		loggerFor(this).info(responseInfo);
		loggerFor(this).debug(`[${requestLogID}] response start`, formatRequestDetails({
			retryOfRequestLogID,
			url: response.url,
			status: response.status,
			headers: response.headers,
			durationMs: headersTime - startTime
		}));
		return {
			response,
			options,
			controller,
			requestLogID,
			retryOfRequestLogID,
			startTime
		};
	}
	getAPIList(path, Page, opts) {
		return this.requestAPIList(Page, opts && "then" in opts ? opts.then((opts) => ({
			method: "get",
			path,
			...opts
		})) : {
			method: "get",
			path,
			...opts
		});
	}
	requestAPIList(Page, options) {
		const request = this.makeRequest(options, null, void 0);
		return new PagePromise(this, request, Page);
	}
	async fetchWithAuth(url, init, timeout, controller, schemes = {
		bearerAuth: true,
		adminAPIKeyAuth: true
	}) {
		if (this._workloadIdentityAuth && schemes.bearerAuth) {
			const headers = init.headers;
			const authHeader = headers.get("Authorization");
			if (!authHeader || authHeader === `Bearer ${WORKLOAD_IDENTITY_API_KEY_PLACEHOLDER}`) {
				const token = await this._workloadIdentityAuth.getToken();
				headers.set("Authorization", `Bearer ${token}`);
			}
		}
		return await this.fetchWithTimeout(url, init, timeout, controller);
	}
	async fetchWithTimeout(url, init, ms, controller) {
		const { signal, method, ...options } = init || {};
		const abort = this._makeAbort(controller);
		if (signal) signal.addEventListener("abort", abort, { once: true });
		const timeout = setTimeout(abort, ms);
		const isReadableBody = globalThis.ReadableStream && options.body instanceof globalThis.ReadableStream || typeof options.body === "object" && options.body !== null && Symbol.asyncIterator in options.body;
		const fetchOptions = {
			signal: controller.signal,
			...isReadableBody ? { duplex: "half" } : {},
			method: "GET",
			...options
		};
		if (method) fetchOptions.method = method.toUpperCase();
		try {
			return await this.fetch.call(void 0, url, fetchOptions);
		} finally {
			clearTimeout(timeout);
		}
	}
	async shouldRetry(response) {
		const shouldRetryHeader = response.headers.get("x-should-retry");
		if (shouldRetryHeader === "true") return true;
		if (shouldRetryHeader === "false") return false;
		if (response.status === 408) return true;
		if (response.status === 409) return true;
		if (response.status === 429) return true;
		if (response.status >= 500) return true;
		return false;
	}
	async retryRequest(options, retriesRemaining, requestLogID, responseHeaders) {
		let timeoutMillis;
		const retryAfterMillisHeader = responseHeaders?.get("retry-after-ms");
		if (retryAfterMillisHeader) {
			const timeoutMs = parseFloat(retryAfterMillisHeader);
			if (!Number.isNaN(timeoutMs)) timeoutMillis = timeoutMs;
		}
		const retryAfterHeader = responseHeaders?.get("retry-after");
		if (retryAfterHeader && !timeoutMillis) {
			const timeoutSeconds = parseFloat(retryAfterHeader);
			if (!Number.isNaN(timeoutSeconds)) timeoutMillis = timeoutSeconds * 1e3;
			else timeoutMillis = Date.parse(retryAfterHeader) - Date.now();
		}
		if (timeoutMillis === void 0) {
			const maxRetries = options.maxRetries ?? this.maxRetries;
			timeoutMillis = this.calculateDefaultRetryTimeoutMillis(retriesRemaining, maxRetries);
		}
		await sleep(timeoutMillis);
		return this.makeRequest(options, retriesRemaining - 1, requestLogID);
	}
	calculateDefaultRetryTimeoutMillis(retriesRemaining, maxRetries) {
		const initialRetryDelay = .5;
		const maxRetryDelay = 8;
		const numRetries = maxRetries - retriesRemaining;
		return Math.min(initialRetryDelay * Math.pow(2, numRetries), maxRetryDelay) * (1 - Math.random() * .25) * 1e3;
	}
	async buildRequest(inputOptions, { retryCount = 0 } = {}) {
		const options = { ...inputOptions };
		const { method, path, query, defaultBaseURL } = options;
		const url = this.buildURL(path, query, defaultBaseURL);
		if ("timeout" in options) validatePositiveInteger("timeout", options.timeout);
		options.timeout = options.timeout ?? this.timeout;
		const { bodyHeaders, body, isStreamingBody } = this.buildBody({ options });
		if (isStreamingBody) inputOptions.__metadata = {
			...inputOptions.__metadata,
			hasStreamingBody: true
		};
		return {
			req: {
				method,
				headers: await this.buildHeaders({
					options: inputOptions,
					method,
					bodyHeaders,
					retryCount
				}),
				...options.signal && { signal: options.signal },
				...globalThis.ReadableStream && body instanceof globalThis.ReadableStream && { duplex: "half" },
				...body && { body },
				...this.fetchOptions ?? {},
				...options.fetchOptions ?? {}
			},
			url,
			timeout: options.timeout
		};
	}
	async buildHeaders({ options, method, bodyHeaders, retryCount }) {
		let idempotencyHeaders = {};
		if (this.idempotencyHeader && method !== "get") {
			if (!options.idempotencyKey) options.idempotencyKey = this.defaultIdempotencyKey();
			idempotencyHeaders[this.idempotencyHeader] = options.idempotencyKey;
		}
		const headers = buildHeaders([
			idempotencyHeaders,
			{
				Accept: "application/json",
				"User-Agent": this.getUserAgent(),
				"X-Stainless-Retry-Count": String(retryCount),
				...options.timeout ? { "X-Stainless-Timeout": String(Math.trunc(options.timeout / 1e3)) } : {},
				...getPlatformHeaders(),
				"OpenAI-Organization": this.organization,
				"OpenAI-Project": this.project
			},
			this._provider ? void 0 : await this.authHeaders(options, options.__security ?? { bearerAuth: true }),
			this._options.defaultHeaders,
			bodyHeaders,
			options.headers
		]);
		if (!this._provider) this.validateHeaders(headers, options.__security ?? { bearerAuth: true });
		return headers.values;
	}
	_makeAbort(controller) {
		return () => controller.abort();
	}
	buildBody({ options }) {
		const { body, headers: rawHeaders } = options;
		if (!body) {
			if (body === void 0 && "body" in options) return {
				...__classPrivateFieldGet(this, _OpenAI_encoder, "f").call(this, {
					body,
					headers: buildHeaders([rawHeaders])
				}),
				isStreamingBody: false
			};
			return {
				bodyHeaders: void 0,
				body: void 0,
				isStreamingBody: false
			};
		}
		const headers = buildHeaders([rawHeaders]);
		const isReadableStream = typeof globalThis.ReadableStream !== "undefined" && body instanceof globalThis.ReadableStream;
		const isRetryableBody = !isReadableStream && (typeof body === "string" || body instanceof ArrayBuffer || ArrayBuffer.isView(body) || typeof globalThis.Blob !== "undefined" && body instanceof globalThis.Blob || body instanceof URLSearchParams || body instanceof FormData);
		if (ArrayBuffer.isView(body) || body instanceof ArrayBuffer || body instanceof DataView || typeof body === "string" && headers.values.has("content-type") || globalThis.Blob && body instanceof globalThis.Blob || body instanceof FormData || body instanceof URLSearchParams || isReadableStream) return {
			bodyHeaders: void 0,
			body,
			isStreamingBody: !isRetryableBody
		};
		else if (typeof body === "object" && (Symbol.asyncIterator in body || Symbol.iterator in body && "next" in body && typeof body.next === "function")) return {
			bodyHeaders: void 0,
			body: ReadableStreamFrom(body),
			isStreamingBody: true
		};
		else if (typeof body === "object" && headers.values.get("content-type") === "application/x-www-form-urlencoded") return {
			bodyHeaders: { "content-type": "application/x-www-form-urlencoded" },
			body: this.stringifyQuery(body),
			isStreamingBody: false
		};
		else return {
			...__classPrivateFieldGet(this, _OpenAI_encoder, "f").call(this, {
				body,
				headers
			}),
			isStreamingBody: false
		};
	}
};
_a = OpenAI, _OpenAI_encoder = /* @__PURE__ */ new WeakMap(), _OpenAI_instances = /* @__PURE__ */ new WeakSet(), _OpenAI_baseURLOverridden = function _OpenAI_baseURLOverridden() {
	return this._provider !== void 0 || this.baseURL !== "https://api.openai.com/v1";
};
OpenAI.OpenAI = _a;
OpenAI.DEFAULT_TIMEOUT = 6e5;
OpenAI.OpenAIError = OpenAIError;
OpenAI.APIError = APIError;
OpenAI.APIConnectionError = APIConnectionError;
OpenAI.APIConnectionTimeoutError = APIConnectionTimeoutError;
OpenAI.APIUserAbortError = APIUserAbortError;
OpenAI.NotFoundError = NotFoundError;
OpenAI.ConflictError = ConflictError;
OpenAI.RateLimitError = RateLimitError;
OpenAI.BadRequestError = BadRequestError;
OpenAI.AuthenticationError = AuthenticationError;
OpenAI.InternalServerError = InternalServerError;
OpenAI.PermissionDeniedError = PermissionDeniedError;
OpenAI.UnprocessableEntityError = UnprocessableEntityError;
OpenAI.InvalidWebhookSignatureError = InvalidWebhookSignatureError;
OpenAI.toFile = toFile;
OpenAI.toStreamingFile = toStreamingFile;
OpenAI.Completions = Completions;
OpenAI.Chat = Chat;
OpenAI.Embeddings = Embeddings;
OpenAI.Files = Files$1;
OpenAI.Images = Images;
OpenAI.Audio = Audio;
OpenAI.Moderations = Moderations;
OpenAI.Models = Models;
OpenAI.FineTuning = FineTuning;
OpenAI.Graders = Graders;
OpenAI.VectorStores = VectorStores;
OpenAI.Webhooks = Webhooks;
OpenAI.Beta = Beta;
OpenAI.Batches = Batches;
OpenAI.Uploads = Uploads;
OpenAI.Admin = Admin;
OpenAI.Responses = Responses;
OpenAI.Realtime = Realtime;
OpenAI.Conversations = Conversations;
OpenAI.Evals = Evals;
OpenAI.Containers = Containers;
OpenAI.Skills = Skills;
OpenAI.Videos = Videos;
function getConnectionErrorMessage(error) {
	if (isUndiciDispatcherVersionMismatchError(error)) return `Connection error. This may be caused by passing an undici dispatcher, such as ProxyAgent, that is incompatible with the fetch implementation. If you are using undici's ProxyAgent, pass the fetch implementation from the same undici package: import { fetch, ProxyAgent } from 'undici'; new OpenAI({ fetch, fetchOptions: { dispatcher: new ProxyAgent(...) } });`;
}
function isUndiciDispatcherVersionMismatchError(error) {
	let current = error;
	for (let i = 0; i < 8 && current && typeof current === "object"; i++) {
		const err = current;
		if (err.code === "UND_ERR_INVALID_ARG" && typeof err.message === "string" && err.message.includes("invalid onRequestStart method")) return true;
		current = err.cause;
	}
	return false;
}
//#endregion
//#region node_modules/@langchain/openai/dist/utils/client.js
function _isOpenAIContextOverflowError(e) {
	if (String(e).includes("context_length_exceeded")) return true;
	if ("message" in e && typeof e.message === "string" && (e.message.includes("Input tokens exceed the configured limit") || e.message.includes("exceeds the context window") || e.message.includes("maximum context length"))) return true;
	return false;
}
function wrapOpenAIClientError(e) {
	if (!e || typeof e !== "object") return e;
	let error;
	if (e.constructor.name === APIConnectionTimeoutError.name && "message" in e && typeof e.message === "string") {
		error = new Error(e.message);
		error.name = "TimeoutError";
	} else if (e.constructor.name === APIUserAbortError.name && "message" in e && typeof e.message === "string") {
		error = new Error(e.message);
		error.name = "AbortError";
	} else if (_isOpenAIContextOverflowError(e)) error = ContextOverflowError.fromError(e);
	else if ("status" in e && e.status === 400 && "message" in e && typeof e.message === "string" && e.message.includes("tool_calls")) error = addLangChainErrorFields(e, "INVALID_TOOL_RESULTS");
	else if ("status" in e && e.status === 401) error = addLangChainErrorFields(e, "MODEL_AUTHENTICATION");
	else if ("status" in e && e.status === 429) error = addLangChainErrorFields(e, "MODEL_RATE_LIMIT");
	else if ("status" in e && e.status === 404) error = addLangChainErrorFields(e, "MODEL_NOT_FOUND");
	else error = e;
	return error;
}
//#endregion
//#region node_modules/@langchain/openai/dist/utils/misc.js
var iife$1 = (fn) => fn();
function isReasoningModel(model) {
	if (!model) return false;
	if (/^o\d/.test(model ?? "")) return true;
	if (model.startsWith("gpt-5") && !model.startsWith("gpt-5-chat")) return true;
	return false;
}
function extractGenericMessageCustomRole(message) {
	if (message.role !== "system" && message.role !== "developer" && message.role !== "assistant" && message.role !== "user" && message.role !== "function" && message.role !== "tool") console.warn(`Unknown message role: ${message.role}`);
	return message.role;
}
function getFilenameFromMetadata(block) {
	return block.metadata?.filename ?? block.metadata?.name ?? block.metadata?.title;
}
var LC_AUTOGENERATED_FILENAME = "LC_AUTOGENERATED";
function getRequiredFilenameFromMetadata(block) {
	const filename = block.metadata?.filename ?? block.metadata?.name ?? block.metadata?.title;
	if (!filename) {
		console.warn("OpenAI may require a filename for file uploads. Specify a filename in the content block metadata, e.g.: { type: 'file', mimeType: '...', data: '...', metadata: { filename: 'my-file.pdf' } }. Using placeholder filename 'LC_AUTOGENERATED'.");
		return LC_AUTOGENERATED_FILENAME;
	}
	return filename;
}
function messageToOpenAIRole(message) {
	const type = message._getType();
	switch (type) {
		case "system": return "system";
		case "ai": return "assistant";
		case "human": return "user";
		case "function": return "function";
		case "tool": return "tool";
		case "generic":
			if (!ChatMessage.isInstance(message)) throw new Error("Invalid generic chat message");
			return extractGenericMessageCustomRole(message);
		default: throw new Error(`Unknown message type: ${type}`);
	}
}
function _modelPrefersResponsesAPI(model) {
	if (model.includes("gpt-5.2-pro")) return true;
	if (model.includes("gpt-5.4-pro")) return true;
	if (model.includes("gpt-5.5-pro")) return true;
	if (model.includes("codex")) return true;
	return false;
}
//#endregion
//#region node_modules/@langchain/openai/dist/utils/azure.js
/**
* This function generates an endpoint URL for (Azure) OpenAI
* based on the configuration parameters provided.
*
* @param {OpenAIEndpointConfig} config - The configuration object for the (Azure) endpoint.
*
* @property {string} config.azureOpenAIApiDeploymentName - The deployment name of Azure OpenAI.
* @property {string} config.azureOpenAIApiInstanceName - The instance name of Azure OpenAI, e.g. `example-resource`.
* @property {string} config.azureOpenAIApiKey - The API Key for Azure OpenAI.
* @property {string} config.azureOpenAIBasePath - The base path for Azure OpenAI, e.g. `https://example-resource.azure.openai.com/openai/deployments/`.
* @property {string} config.baseURL - Some other custom base path URL.
* @property {string} config.azureOpenAIEndpoint - The endpoint for the Azure OpenAI instance, e.g. `https://example-resource.azure.openai.com/`.
*
* The function operates as follows:
* - If both `azureOpenAIBasePath` and `azureOpenAIApiDeploymentName` (plus `azureOpenAIApiKey`) are provided, it returns an URL combining these two parameters (`${azureOpenAIBasePath}/${azureOpenAIApiDeploymentName}`).
* - If both `azureOpenAIEndpoint` and `azureOpenAIApiDeploymentName` (plus `azureOpenAIApiKey`) are provided, it returns an URL combining these two parameters (`${azureOpenAIEndpoint}/openai/deployments/${azureOpenAIApiDeploymentName}`).
* - If `azureOpenAIApiKey` is provided, it checks for `azureOpenAIApiInstanceName` and `azureOpenAIApiDeploymentName` and throws an error if any of these is missing. If both are provided, it generates an URL incorporating these parameters.
* - If none of the above conditions are met, return any custom `baseURL`.
* - The function returns the generated URL as a string, or undefined if no custom paths are specified.
*
* @throws Will throw an error if the necessary parameters for generating the URL are missing.
*
* @returns {string | undefined} The generated (Azure) OpenAI endpoint URL.
*/
function getEndpoint(config) {
	const { azureOpenAIApiDeploymentName, azureOpenAIApiInstanceName, azureOpenAIApiKey, azureOpenAIBasePath, baseURL, azureADTokenProvider, azureOpenAIEndpoint } = config;
	if ((azureOpenAIApiKey || azureADTokenProvider) && azureOpenAIBasePath && azureOpenAIApiDeploymentName) return `${azureOpenAIBasePath}/${azureOpenAIApiDeploymentName}`;
	if ((azureOpenAIApiKey || azureADTokenProvider) && azureOpenAIEndpoint && azureOpenAIApiDeploymentName) return `${azureOpenAIEndpoint}/openai/deployments/${azureOpenAIApiDeploymentName}`;
	if (azureOpenAIApiKey || azureADTokenProvider) {
		if (!azureOpenAIApiInstanceName) throw new Error("azureOpenAIApiInstanceName is required when using azureOpenAIApiKey");
		if (!azureOpenAIApiDeploymentName) throw new Error("azureOpenAIApiDeploymentName is a required parameter when using azureOpenAIApiKey");
		return `https://${azureOpenAIApiInstanceName}.openai.azure.com/openai/deployments/${azureOpenAIApiDeploymentName}`;
	}
	return baseURL;
}
function isHeaders(headers) {
	return typeof Headers !== "undefined" && headers !== null && typeof headers === "object" && Object.prototype.toString.call(headers) === "[object Headers]";
}
/**
* Normalizes various header formats into a consistent Record format.
*
* This function accepts headers in multiple formats and converts them to a
* Record<string, HeaderValue | readonly HeaderValue[]> for consistent handling.
*
* @param headers - The headers to normalize. Can be:
*   - A Headers instance
*   - An array of [key, value] pairs
*   - A plain object with string keys
*   - A NullableHeaders-like object with a 'values' property containing Headers
*   - null or undefined
* @returns A normalized Record containing the header key-value pairs
*
* @example
* ```ts
* // With Headers instance
* const headers1 = new Headers([['content-type', 'application/json']]);
* const normalized1 = normalizeHeaders(headers1);
*
* // With plain object
* const headers2 = { 'content-type': 'application/json' };
* const normalized2 = normalizeHeaders(headers2);
*
* // With array of pairs
* const headers3 = [['content-type', 'application/json']];
* const normalized3 = normalizeHeaders(headers3);
* ```
*/
function normalizeHeaders(headers) {
	const output = iife$1(() => {
		if (isHeaders(headers)) return headers;
		else if (Array.isArray(headers)) return new Headers(headers);
		else if (typeof headers === "object" && headers !== null && "values" in headers && isHeaders(headers.values)) return headers.values;
		else if (typeof headers === "object" && headers !== null) {
			const entries = Object.entries(headers).filter(([, v]) => typeof v === "string").map(([k, v]) => [k, v]);
			return new Headers(entries);
		}
		return new Headers();
	});
	return Object.fromEntries(output.entries());
}
function getFormattedEnv() {
	let env = getEnv();
	if (env === "node" || env === "deno") env = `(${env}/${process.version}; ${process.platform}; ${process.arch})`;
	return env;
}
function getHeadersWithUserAgent(headers, isAzure = false, version = "1.0.0") {
	const normalizedHeaders = normalizeHeaders(headers);
	const env = getFormattedEnv();
	const library = `langchainjs${isAzure ? "-azure" : ""}-openai`;
	return {
		...normalizedHeaders,
		"User-Agent": normalizedHeaders["User-Agent"] ? `${library}/${version} (${env})${normalizedHeaders["User-Agent"]}` : `${library}/${version} (${env})`
	};
}
//#endregion
//#region node_modules/@langchain/openai/dist/utils/tools.js
/**
* Formats a tool in either OpenAI format, or LangChain structured tool format
* into an OpenAI tool format. If the tool is already in OpenAI format, return without
* any changes. If it is in LangChain structured tool format, convert it to OpenAI tool format
* using OpenAI's `zodFunction` util, falling back to `convertToOpenAIFunction` if the parameters
* returned from the `zodFunction` util are not defined.
*
* @param {BindToolsInput} tool The tool to convert to an OpenAI tool.
* @param {Object} [fields] Additional fields to add to the OpenAI tool.
* @returns {ToolDefinition} The inputted tool in OpenAI tool format.
*/
function _convertToOpenAITool(tool, fields) {
	let toolDef;
	if (isLangChainTool(tool)) toolDef = convertToOpenAITool(tool);
	else toolDef = tool;
	if (fields?.strict !== void 0) toolDef.function.strict = fields.strict;
	return toolDef;
}
function isAnyOfProp(prop) {
	return prop.anyOf !== void 0 && Array.isArray(prop.anyOf);
}
function formatFunctionDefinitions(functions) {
	const lines = ["namespace functions {", ""];
	for (const f of functions) {
		if (f.description) lines.push(`// ${f.description}`);
		if (Object.keys(f.parameters.properties ?? {}).length > 0) {
			lines.push(`type ${f.name} = (_: {`);
			lines.push(formatObjectProperties(f.parameters, 0));
			lines.push("}) => any;");
		} else lines.push(`type ${f.name} = () => any;`);
		lines.push("");
	}
	lines.push("} // namespace functions");
	return lines.join("\n");
}
function formatObjectProperties(obj, indent) {
	const lines = [];
	for (const [name, param] of Object.entries(obj.properties ?? {})) {
		if (param.description && indent < 2) lines.push(`// ${param.description}`);
		if (obj.required?.includes(name)) lines.push(`${name}: ${formatType(param, indent)},`);
		else lines.push(`${name}?: ${formatType(param, indent)},`);
	}
	return lines.map((line) => " ".repeat(indent) + line).join("\n");
}
function formatType(param, indent) {
	if (isAnyOfProp(param)) return param.anyOf.map((v) => formatType(v, indent)).join(" | ");
	switch (param.type) {
		case "string":
			if (param.enum) return param.enum.map((v) => `"${v}"`).join(" | ");
			return "string";
		case "number":
			if (param.enum) return param.enum.map((v) => `${v}`).join(" | ");
			return "number";
		case "integer":
			if (param.enum) return param.enum.map((v) => `${v}`).join(" | ");
			return "number";
		case "boolean": return "boolean";
		case "null": return "null";
		case "object": return [
			"{",
			formatObjectProperties(param, indent + 2),
			"}"
		].join("\n");
		case "array":
			if (param.items) return `${formatType(param.items, indent)}[]`;
			return "any[]";
		default: return "";
	}
}
function formatToOpenAIToolChoice(toolChoice) {
	if (!toolChoice) return;
	else if (toolChoice === "any" || toolChoice === "required") return "required";
	else if (toolChoice === "auto") return "auto";
	else if (toolChoice === "none") return "none";
	else if (typeof toolChoice === "string") return {
		type: "function",
		function: { name: toolChoice }
	};
	else return toolChoice;
}
function isBuiltInTool(tool) {
	return "type" in tool && tool.type !== "function";
}
/**
* Checks if a tool has a provider-specific tool definition in extras.providerToolDefinition.
* This is used for tools like localShell, shell, computerUse, and applyPatch
* that need to be sent as built-in tool types to the OpenAI API.
*/
function hasProviderToolDefinition(tool) {
	return typeof tool === "object" && tool !== null && "extras" in tool && typeof tool.extras === "object" && tool.extras !== null && "providerToolDefinition" in tool.extras && typeof tool.extras.providerToolDefinition === "object" && tool.extras.providerToolDefinition !== null;
}
function isBuiltInToolChoice(tool_choice) {
	return tool_choice != null && typeof tool_choice === "object" && "type" in tool_choice && tool_choice.type !== "function";
}
function isCustomTool(tool) {
	return typeof tool === "object" && tool !== null && "metadata" in tool && typeof tool.metadata === "object" && tool.metadata !== null && "customTool" in tool.metadata && typeof tool.metadata.customTool === "object" && tool.metadata.customTool !== null;
}
function isOpenAICustomTool(tool) {
	return "type" in tool && tool.type === "custom" && "custom" in tool && typeof tool.custom === "object" && tool.custom !== null;
}
function parseCustomToolCall(rawToolCall) {
	if (rawToolCall.type !== "custom_tool_call") return;
	return {
		...rawToolCall,
		type: "tool_call",
		call_id: rawToolCall.id,
		id: rawToolCall.call_id,
		name: rawToolCall.name,
		isCustomTool: true,
		args: { input: rawToolCall.input }
	};
}
/**
* Parses a computer_call output item from the OpenAI Responses API
* into a ToolCall format that can be processed by the ToolNode.
*
* @param rawToolCall - The raw computer_call output item from the API
* @returns A ComputerToolCall object if valid, undefined otherwise
*/
function parseComputerCall(rawToolCall) {
	if (rawToolCall.type !== "computer_call") return;
	return {
		...rawToolCall,
		type: "tool_call",
		call_id: rawToolCall.id,
		id: rawToolCall.call_id,
		name: "computer_use",
		isComputerTool: true,
		args: { action: rawToolCall.action }
	};
}
/**
* Checks if a tool call is a computer tool call.
* @param toolCall - The tool call to check.
* @returns True if the tool call is a computer tool call, false otherwise.
*/
function isComputerToolCall(toolCall) {
	return typeof toolCall === "object" && toolCall !== null && "type" in toolCall && toolCall.type === "tool_call" && "isComputerTool" in toolCall && toolCall.isComputerTool === true;
}
function isCustomToolCall(toolCall, customToolCallIds) {
	if (typeof toolCall !== "object" || toolCall === null || !("type" in toolCall) || toolCall.type !== "tool_call") return false;
	if ("isCustomTool" in toolCall && toolCall.isCustomTool === true) return true;
	if (customToolCallIds && "id" in toolCall && typeof toolCall.id === "string" && toolCall.id in customToolCallIds) return true;
	return false;
}
function convertCompletionsCustomTool(tool) {
	const getFormat = () => {
		if (!tool.custom.format) return;
		if (tool.custom.format.type === "grammar") return {
			type: "grammar",
			definition: tool.custom.format.grammar.definition,
			syntax: tool.custom.format.grammar.syntax
		};
		if (tool.custom.format.type === "text") return { type: "text" };
	};
	return {
		type: "custom",
		name: tool.custom.name,
		description: tool.custom.description,
		format: getFormat()
	};
}
function convertResponsesCustomTool(tool) {
	const getFormat = () => {
		if (!tool.format) return;
		if (tool.format.type === "grammar") return {
			type: "grammar",
			grammar: {
				definition: tool.format.definition,
				syntax: tool.format.syntax
			}
		};
		if (tool.format.type === "text") return { type: "text" };
	};
	return {
		type: "custom",
		custom: {
			name: tool.name,
			description: tool.description,
			format: getFormat()
		}
	};
}
//#endregion
//#region node_modules/openai/_vendor/zod-to-json-schema/Options.mjs
var ignoreOverride = Symbol("Let zodToJsonSchema decide on which parser to use");
var defaultOptions = {
	name: void 0,
	$refStrategy: "root",
	effectStrategy: "input",
	pipeStrategy: "all",
	dateStrategy: "format:date-time",
	mapStrategy: "entries",
	nullableStrategy: "from-target",
	removeAdditionalStrategy: "passthrough",
	definitionPath: "definitions",
	target: "jsonSchema7",
	strictUnions: false,
	errorMessages: false,
	markdownDescription: false,
	patternStrategy: "escape",
	applyRegexFlags: false,
	emailStrategy: "format:email",
	base64Strategy: "contentEncoding:base64",
	nameStrategy: "ref"
};
var getDefaultOptions = (options) => {
	return typeof options === "string" ? {
		...defaultOptions,
		basePath: ["#"],
		definitions: {},
		name: options
	} : {
		...defaultOptions,
		basePath: ["#"],
		definitions: {},
		...options
	};
};
//#endregion
//#region node_modules/openai/_vendor/zod-to-json-schema/util.mjs
var zodDef = (zodSchema) => {
	return "_def" in zodSchema ? zodSchema._def : zodSchema;
};
function isEmptyObj(obj) {
	if (!obj) return true;
	for (const _k in obj) return false;
	return true;
}
//#endregion
//#region node_modules/openai/_vendor/zod-to-json-schema/Refs.mjs
var getRefs = (options) => {
	const _options = getDefaultOptions(options);
	const currentPath = _options.name !== void 0 ? [
		..._options.basePath,
		_options.definitionPath,
		_options.name
	] : _options.basePath;
	return {
		..._options,
		currentPath,
		propertyPath: void 0,
		seenRefs: /* @__PURE__ */ new Set(),
		seen: new Map(Object.entries(_options.definitions).map(([name, def]) => [zodDef(def), {
			def: zodDef(def),
			path: [
				..._options.basePath,
				_options.definitionPath,
				name
			],
			jsonSchema: void 0
		}]))
	};
};
//#endregion
//#region node_modules/openai/_vendor/zod-to-json-schema/errorMessages.mjs
function addErrorMessage(res, key, errorMessage, refs) {
	if (!refs?.errorMessages) return;
	if (errorMessage) res.errorMessage = {
		...res.errorMessage,
		[key]: errorMessage
	};
}
function setResponseValueAndErrors(res, key, value, errorMessage, refs) {
	res[key] = value;
	addErrorMessage(res, key, errorMessage, refs);
}
//#endregion
//#region node_modules/openai/_vendor/zod-to-json-schema/parsers/any.mjs
function parseAnyDef() {
	return {};
}
//#endregion
//#region node_modules/openai/_vendor/zod-to-json-schema/parsers/array.mjs
function parseArrayDef(def, refs) {
	const res = { type: "array" };
	if (def.type?._def?.typeName !== ZodFirstPartyTypeKind.ZodAny) res.items = parseDef(def.type._def, {
		...refs,
		currentPath: [...refs.currentPath, "items"]
	});
	if (def.minLength) setResponseValueAndErrors(res, "minItems", def.minLength.value, def.minLength.message, refs);
	if (def.maxLength) setResponseValueAndErrors(res, "maxItems", def.maxLength.value, def.maxLength.message, refs);
	if (def.exactLength) {
		setResponseValueAndErrors(res, "minItems", def.exactLength.value, def.exactLength.message, refs);
		setResponseValueAndErrors(res, "maxItems", def.exactLength.value, def.exactLength.message, refs);
	}
	return res;
}
//#endregion
//#region node_modules/openai/_vendor/zod-to-json-schema/parsers/bigint.mjs
function parseBigintDef(def, refs) {
	const res = {
		type: "integer",
		format: "int64"
	};
	if (!def.checks) return res;
	for (const check of def.checks) switch (check.kind) {
		case "min":
			if (refs.target === "jsonSchema7") if (check.inclusive) setResponseValueAndErrors(res, "minimum", check.value, check.message, refs);
			else setResponseValueAndErrors(res, "exclusiveMinimum", check.value, check.message, refs);
			else {
				if (!check.inclusive) res.exclusiveMinimum = true;
				setResponseValueAndErrors(res, "minimum", check.value, check.message, refs);
			}
			break;
		case "max":
			if (refs.target === "jsonSchema7") if (check.inclusive) setResponseValueAndErrors(res, "maximum", check.value, check.message, refs);
			else setResponseValueAndErrors(res, "exclusiveMaximum", check.value, check.message, refs);
			else {
				if (!check.inclusive) res.exclusiveMaximum = true;
				setResponseValueAndErrors(res, "maximum", check.value, check.message, refs);
			}
			break;
		case "multipleOf":
			setResponseValueAndErrors(res, "multipleOf", check.value, check.message, refs);
			break;
	}
	return res;
}
//#endregion
//#region node_modules/openai/_vendor/zod-to-json-schema/parsers/boolean.mjs
function parseBooleanDef() {
	return { type: "boolean" };
}
//#endregion
//#region node_modules/openai/_vendor/zod-to-json-schema/parsers/branded.mjs
function parseBrandedDef(_def, refs, forceResolution) {
	return parseDef(_def.type._def, refs, forceResolution);
}
//#endregion
//#region node_modules/openai/_vendor/zod-to-json-schema/parsers/catch.mjs
var parseCatchDef = (def, refs, forceResolution) => {
	return parseDef(def.innerType._def, refs, forceResolution);
};
//#endregion
//#region node_modules/openai/_vendor/zod-to-json-schema/parsers/date.mjs
function parseDateDef(def, refs, overrideDateStrategy) {
	const strategy = overrideDateStrategy ?? refs.dateStrategy;
	if (Array.isArray(strategy)) return { anyOf: strategy.map((item, i) => parseDateDef(def, refs, item)) };
	switch (strategy) {
		case "string":
		case "format:date-time": return {
			type: "string",
			format: "date-time"
		};
		case "format:date": return {
			type: "string",
			format: "date"
		};
		case "integer": return integerDateParser(def, refs);
	}
}
var integerDateParser = (def, refs) => {
	const res = {
		type: "integer",
		format: "unix-time"
	};
	if (refs.target === "openApi3") return res;
	for (const check of def.checks) switch (check.kind) {
		case "min":
			setResponseValueAndErrors(res, "minimum", check.value, check.message, refs);
			break;
		case "max":
			setResponseValueAndErrors(res, "maximum", check.value, check.message, refs);
			break;
	}
	return res;
};
//#endregion
//#region node_modules/openai/_vendor/zod-to-json-schema/parsers/default.mjs
function parseDefaultDef(_def, refs, forceResolution) {
	return {
		...parseDef(_def.innerType._def, refs, forceResolution),
		default: _def.defaultValue()
	};
}
//#endregion
//#region node_modules/openai/_vendor/zod-to-json-schema/parsers/effects.mjs
function parseEffectsDef(_def, refs, forceResolution) {
	return refs.effectStrategy === "input" ? parseDef(_def.schema._def, refs, forceResolution) : {};
}
//#endregion
//#region node_modules/openai/_vendor/zod-to-json-schema/parsers/enum.mjs
function parseEnumDef(def) {
	return {
		type: "string",
		enum: [...def.values]
	};
}
//#endregion
//#region node_modules/openai/_vendor/zod-to-json-schema/parsers/intersection.mjs
var isJsonSchema7AllOfType = (type) => {
	if ("type" in type && type.type === "string") return false;
	return "allOf" in type;
};
function parseIntersectionDef(def, refs) {
	const allOf = [parseDef(def.left._def, {
		...refs,
		currentPath: [
			...refs.currentPath,
			"allOf",
			"0"
		]
	}), parseDef(def.right._def, {
		...refs,
		currentPath: [
			...refs.currentPath,
			"allOf",
			"1"
		]
	})].filter((x) => !!x);
	let unevaluatedProperties = refs.target === "jsonSchema2019-09" ? { unevaluatedProperties: false } : void 0;
	const mergedAllOf = [];
	allOf.forEach((schema) => {
		if (isJsonSchema7AllOfType(schema)) {
			mergedAllOf.push(...schema.allOf);
			if (schema.unevaluatedProperties === void 0) unevaluatedProperties = void 0;
		} else {
			let nestedSchema = schema;
			if ("additionalProperties" in schema && schema.additionalProperties === false) {
				const { additionalProperties, ...rest } = schema;
				nestedSchema = rest;
			} else unevaluatedProperties = void 0;
			mergedAllOf.push(nestedSchema);
		}
	});
	return mergedAllOf.length ? {
		allOf: mergedAllOf,
		...unevaluatedProperties
	} : void 0;
}
//#endregion
//#region node_modules/openai/_vendor/zod-to-json-schema/parsers/literal.mjs
function parseLiteralDef(def, refs) {
	const parsedType = typeof def.value;
	if (parsedType !== "bigint" && parsedType !== "number" && parsedType !== "boolean" && parsedType !== "string") return { type: Array.isArray(def.value) ? "array" : "object" };
	if (refs.target === "openApi3") return {
		type: parsedType === "bigint" ? "integer" : parsedType,
		enum: [def.value]
	};
	return {
		type: parsedType === "bigint" ? "integer" : parsedType,
		const: def.value
	};
}
//#endregion
//#region node_modules/openai/_vendor/zod-to-json-schema/parsers/string.mjs
var emojiRegex;
/**
* Generated from the regular expressions found here as of 2024-05-22:
* https://github.com/colinhacks/zod/blob/master/src/types.ts.
*
* Expressions with /i flag have been changed accordingly.
*/
var zodPatterns = {
	/**
	* `c` was changed to `[cC]` to replicate /i flag
	*/
	cuid: /^[cC][^\s-]{8,}$/,
	cuid2: /^[0-9a-z]+$/,
	ulid: /^[0-9A-HJKMNP-TV-Z]{26}$/,
	/**
	* `a-z` was added to replicate /i flag
	*/
	email: /^(?!\.)(?!.*\.\.)([a-zA-Z0-9_'+\-\.]*)[a-zA-Z0-9_+-]@([a-zA-Z0-9][a-zA-Z0-9\-]*\.)+[a-zA-Z]{2,}$/,
	/**
	* Constructed a valid Unicode RegExp
	*
	* Lazily instantiate since this type of regex isn't supported
	* in all envs (e.g. React Native).
	*
	* See:
	* https://github.com/colinhacks/zod/issues/2433
	* Fix in Zod:
	* https://github.com/colinhacks/zod/commit/9340fd51e48576a75adc919bff65dbc4a5d4c99b
	*/
	emoji: () => {
		if (emojiRegex === void 0) emojiRegex = RegExp("^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$", "u");
		return emojiRegex;
	},
	/**
	* Unused
	*/
	uuid: /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/,
	/**
	* Unused
	*/
	ipv4: /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/,
	/**
	* Unused
	*/
	ipv6: /^(([a-f0-9]{1,4}:){7}|::([a-f0-9]{1,4}:){0,6}|([a-f0-9]{1,4}:){1}:([a-f0-9]{1,4}:){0,5}|([a-f0-9]{1,4}:){2}:([a-f0-9]{1,4}:){0,4}|([a-f0-9]{1,4}:){3}:([a-f0-9]{1,4}:){0,3}|([a-f0-9]{1,4}:){4}:([a-f0-9]{1,4}:){0,2}|([a-f0-9]{1,4}:){5}:([a-f0-9]{1,4}:){0,1})([a-f0-9]{1,4}|(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2})))$/,
	base64: /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/,
	nanoid: /^[a-zA-Z0-9_-]{21}$/
};
function parseStringDef(def, refs) {
	const res = { type: "string" };
	function processPattern(value) {
		return refs.patternStrategy === "escape" ? escapeNonAlphaNumeric(value) : value;
	}
	if (def.checks) for (const check of def.checks) switch (check.kind) {
		case "min":
			setResponseValueAndErrors(res, "minLength", typeof res.minLength === "number" ? Math.max(res.minLength, check.value) : check.value, check.message, refs);
			break;
		case "max":
			setResponseValueAndErrors(res, "maxLength", typeof res.maxLength === "number" ? Math.min(res.maxLength, check.value) : check.value, check.message, refs);
			break;
		case "email":
			switch (refs.emailStrategy) {
				case "format:email":
					addFormat(res, "email", check.message, refs);
					break;
				case "format:idn-email":
					addFormat(res, "idn-email", check.message, refs);
					break;
				case "pattern:zod":
					addPattern(res, zodPatterns.email, check.message, refs);
					break;
			}
			break;
		case "url":
			addFormat(res, "uri", check.message, refs);
			break;
		case "uuid":
			addFormat(res, "uuid", check.message, refs);
			break;
		case "regex":
			addPattern(res, check.regex, check.message, refs);
			break;
		case "cuid":
			addPattern(res, zodPatterns.cuid, check.message, refs);
			break;
		case "cuid2":
			addPattern(res, zodPatterns.cuid2, check.message, refs);
			break;
		case "startsWith":
			addPattern(res, RegExp(`^${processPattern(check.value)}`), check.message, refs);
			break;
		case "endsWith":
			addPattern(res, RegExp(`${processPattern(check.value)}$`), check.message, refs);
			break;
		case "datetime":
			addFormat(res, "date-time", check.message, refs);
			break;
		case "date":
			addFormat(res, "date", check.message, refs);
			break;
		case "time":
			addFormat(res, "time", check.message, refs);
			break;
		case "duration":
			addFormat(res, "duration", check.message, refs);
			break;
		case "length":
			setResponseValueAndErrors(res, "minLength", typeof res.minLength === "number" ? Math.max(res.minLength, check.value) : check.value, check.message, refs);
			setResponseValueAndErrors(res, "maxLength", typeof res.maxLength === "number" ? Math.min(res.maxLength, check.value) : check.value, check.message, refs);
			break;
		case "includes":
			addPattern(res, RegExp(processPattern(check.value)), check.message, refs);
			break;
		case "ip":
			if (check.version !== "v6") addFormat(res, "ipv4", check.message, refs);
			if (check.version !== "v4") addFormat(res, "ipv6", check.message, refs);
			break;
		case "emoji":
			addPattern(res, zodPatterns.emoji, check.message, refs);
			break;
		case "ulid":
			addPattern(res, zodPatterns.ulid, check.message, refs);
			break;
		case "base64":
			switch (refs.base64Strategy) {
				case "format:binary":
					addFormat(res, "binary", check.message, refs);
					break;
				case "contentEncoding:base64":
					setResponseValueAndErrors(res, "contentEncoding", "base64", check.message, refs);
					break;
				case "pattern:zod":
					addPattern(res, zodPatterns.base64, check.message, refs);
					break;
			}
			break;
		case "nanoid": addPattern(res, zodPatterns.nanoid, check.message, refs);
		case "toLowerCase":
		case "toUpperCase":
		case "trim": break;
		default:
	}
	return res;
}
var escapeNonAlphaNumeric = (value) => Array.from(value).map((c) => /[a-zA-Z0-9]/.test(c) ? c : `\\${c}`).join("");
var addFormat = (schema, value, message, refs) => {
	if (schema.format || schema.anyOf?.some((x) => x.format)) {
		if (!schema.anyOf) schema.anyOf = [];
		if (schema.format) {
			schema.anyOf.push({
				format: schema.format,
				...schema.errorMessage && refs.errorMessages && { errorMessage: { format: schema.errorMessage.format } }
			});
			delete schema.format;
			if (schema.errorMessage) {
				delete schema.errorMessage.format;
				if (Object.keys(schema.errorMessage).length === 0) delete schema.errorMessage;
			}
		}
		schema.anyOf.push({
			format: value,
			...message && refs.errorMessages && { errorMessage: { format: message } }
		});
	} else setResponseValueAndErrors(schema, "format", value, message, refs);
};
var addPattern = (schema, regex, message, refs) => {
	if (schema.pattern || schema.allOf?.some((x) => x.pattern)) {
		if (!schema.allOf) schema.allOf = [];
		if (schema.pattern) {
			schema.allOf.push({
				pattern: schema.pattern,
				...schema.errorMessage && refs.errorMessages && { errorMessage: { pattern: schema.errorMessage.pattern } }
			});
			delete schema.pattern;
			if (schema.errorMessage) {
				delete schema.errorMessage.pattern;
				if (Object.keys(schema.errorMessage).length === 0) delete schema.errorMessage;
			}
		}
		schema.allOf.push({
			pattern: processRegExp(regex, refs),
			...message && refs.errorMessages && { errorMessage: { pattern: message } }
		});
	} else setResponseValueAndErrors(schema, "pattern", processRegExp(regex, refs), message, refs);
};
var processRegExp = (regexOrFunction, refs) => {
	const regex = typeof regexOrFunction === "function" ? regexOrFunction() : regexOrFunction;
	if (!refs.applyRegexFlags || !regex.flags) return regex.source;
	const flags = {
		i: regex.flags.includes("i"),
		m: regex.flags.includes("m"),
		s: regex.flags.includes("s")
	};
	const source = flags.i ? regex.source.toLowerCase() : regex.source;
	let pattern = "";
	let isEscaped = false;
	let inCharGroup = false;
	let inCharRange = false;
	for (let i = 0; i < source.length; i++) {
		if (isEscaped) {
			pattern += source[i];
			isEscaped = false;
			continue;
		}
		if (flags.i) {
			if (inCharGroup) {
				if (source[i].match(/[a-z]/)) {
					if (inCharRange) {
						pattern += source[i];
						pattern += `${source[i - 2]}-${source[i]}`.toUpperCase();
						inCharRange = false;
					} else if (source[i + 1] === "-" && source[i + 2]?.match(/[a-z]/)) {
						pattern += source[i];
						inCharRange = true;
					} else pattern += `${source[i]}${source[i].toUpperCase()}`;
					continue;
				}
			} else if (source[i].match(/[a-z]/)) {
				pattern += `[${source[i]}${source[i].toUpperCase()}]`;
				continue;
			}
		}
		if (flags.m) {
			if (source[i] === "^") {
				pattern += `(^|(?<=[\r\n]))`;
				continue;
			} else if (source[i] === "$") {
				pattern += `($|(?=[\r\n]))`;
				continue;
			}
		}
		if (flags.s && source[i] === ".") {
			pattern += inCharGroup ? `${source[i]}\r\n` : `[${source[i]}\r\n]`;
			continue;
		}
		pattern += source[i];
		if (source[i] === "\\") isEscaped = true;
		else if (inCharGroup && source[i] === "]") inCharGroup = false;
		else if (!inCharGroup && source[i] === "[") inCharGroup = true;
	}
	try {
		new RegExp(pattern);
	} catch {
		console.warn(`Could not convert regex pattern at ${refs.currentPath.join("/")} to a flag-independent form! Falling back to the flag-ignorant source`);
		return regex.source;
	}
	return pattern;
};
//#endregion
//#region node_modules/openai/_vendor/zod-to-json-schema/parsers/record.mjs
function parseRecordDef(def, refs) {
	if (refs.target === "openApi3" && def.keyType?._def.typeName === ZodFirstPartyTypeKind.ZodEnum) return {
		type: "object",
		required: def.keyType._def.values,
		properties: def.keyType._def.values.reduce((acc, key) => ({
			...acc,
			[key]: parseDef(def.valueType._def, {
				...refs,
				currentPath: [
					...refs.currentPath,
					"properties",
					key
				]
			}) ?? {}
		}), {}),
		additionalProperties: false
	};
	const schema = {
		type: "object",
		additionalProperties: parseDef(def.valueType._def, {
			...refs,
			currentPath: [...refs.currentPath, "additionalProperties"]
		}) ?? {}
	};
	if (refs.target === "openApi3") return schema;
	if (def.keyType?._def.typeName === ZodFirstPartyTypeKind.ZodString && def.keyType._def.checks?.length) {
		const keyType = Object.entries(parseStringDef(def.keyType._def, refs)).reduce((acc, [key, value]) => key === "type" ? acc : {
			...acc,
			[key]: value
		}, {});
		return {
			...schema,
			propertyNames: keyType
		};
	} else if (def.keyType?._def.typeName === ZodFirstPartyTypeKind.ZodEnum) return {
		...schema,
		propertyNames: { enum: def.keyType._def.values }
	};
	return schema;
}
//#endregion
//#region node_modules/openai/_vendor/zod-to-json-schema/parsers/map.mjs
function parseMapDef(def, refs) {
	if (refs.mapStrategy === "record") return parseRecordDef(def, refs);
	return {
		type: "array",
		maxItems: 125,
		items: {
			type: "array",
			items: [parseDef(def.keyType._def, {
				...refs,
				currentPath: [
					...refs.currentPath,
					"items",
					"items",
					"0"
				]
			}) || {}, parseDef(def.valueType._def, {
				...refs,
				currentPath: [
					...refs.currentPath,
					"items",
					"items",
					"1"
				]
			}) || {}],
			minItems: 2,
			maxItems: 2
		}
	};
}
//#endregion
//#region node_modules/openai/_vendor/zod-to-json-schema/parsers/nativeEnum.mjs
function parseNativeEnumDef(def) {
	const object = def.values;
	const actualValues = Object.keys(def.values).filter((key) => {
		return typeof object[object[key]] !== "number";
	}).map((key) => object[key]);
	const parsedTypes = Array.from(new Set(actualValues.map((values) => typeof values)));
	return {
		type: parsedTypes.length === 1 ? parsedTypes[0] === "string" ? "string" : "number" : ["string", "number"],
		enum: actualValues
	};
}
//#endregion
//#region node_modules/openai/_vendor/zod-to-json-schema/parsers/never.mjs
function parseNeverDef() {
	return { not: {} };
}
//#endregion
//#region node_modules/openai/_vendor/zod-to-json-schema/parsers/null.mjs
function parseNullDef(refs) {
	return refs.target === "openApi3" ? {
		enum: ["null"],
		nullable: true
	} : { type: "null" };
}
//#endregion
//#region node_modules/openai/_vendor/zod-to-json-schema/parsers/union.mjs
var primitiveMappings = {
	ZodString: "string",
	ZodNumber: "number",
	ZodBigInt: "integer",
	ZodBoolean: "boolean",
	ZodNull: "null"
};
function parseUnionDef(def, refs) {
	if (refs.target === "openApi3") return asAnyOf(def, refs);
	const options = def.options instanceof Map ? Array.from(def.options.values()) : def.options;
	if (options.every((x) => x._def.typeName in primitiveMappings && (!x._def.checks || !x._def.checks.length))) {
		const types = options.reduce((types, x) => {
			const type = primitiveMappings[x._def.typeName];
			return type && !types.includes(type) ? [...types, type] : types;
		}, []);
		return { type: types.length > 1 ? types : types[0] };
	} else if (options.every((x) => x._def.typeName === "ZodLiteral" && !x.description)) {
		const types = options.reduce((acc, x) => {
			const type = typeof x._def.value;
			switch (type) {
				case "string":
				case "number":
				case "boolean": return [...acc, type];
				case "bigint": return [...acc, "integer"];
				case "object": if (x._def.value === null) return [...acc, "null"];
				default: return acc;
			}
		}, []);
		if (types.length === options.length) {
			const uniqueTypes = types.filter((x, i, a) => a.indexOf(x) === i);
			return {
				type: uniqueTypes.length > 1 ? uniqueTypes : uniqueTypes[0],
				enum: options.reduce((acc, x) => {
					return acc.includes(x._def.value) ? acc : [...acc, x._def.value];
				}, [])
			};
		}
	} else if (options.every((x) => x._def.typeName === "ZodEnum")) return {
		type: "string",
		enum: options.reduce((acc, x) => [...acc, ...x._def.values.filter((x) => !acc.includes(x))], [])
	};
	return asAnyOf(def, refs);
}
var asAnyOf = (def, refs) => {
	const anyOf = (def.options instanceof Map ? Array.from(def.options.values()) : def.options).map((x, i) => parseDef(x._def, {
		...refs,
		currentPath: [
			...refs.currentPath,
			"anyOf",
			`${i}`
		]
	})).filter((x) => !!x && (!refs.strictUnions || typeof x === "object" && Object.keys(x).length > 0));
	return anyOf.length ? { anyOf } : void 0;
};
//#endregion
//#region node_modules/openai/_vendor/zod-to-json-schema/parsers/nullable.mjs
function parseNullableDef(def, refs, forceResolution) {
	if ([
		"ZodString",
		"ZodNumber",
		"ZodBigInt",
		"ZodBoolean",
		"ZodNull"
	].includes(def.innerType._def.typeName) && (!def.innerType._def.checks || !def.innerType._def.checks.length)) {
		if (refs.target === "openApi3" || refs.nullableStrategy === "property") return {
			type: primitiveMappings[def.innerType._def.typeName],
			nullable: true
		};
		return { type: [primitiveMappings[def.innerType._def.typeName], "null"] };
	}
	if (refs.target === "openApi3") {
		const base = parseDef(def.innerType._def, {
			...refs,
			currentPath: [...refs.currentPath]
		}, forceResolution);
		if (base && "$ref" in base) return {
			allOf: [base],
			nullable: true
		};
		return base && {
			...base,
			nullable: true
		};
	}
	const base = parseDef(def.innerType._def, {
		...refs,
		currentPath: [
			...refs.currentPath,
			"anyOf",
			"0"
		]
	});
	return base && { anyOf: [base, { type: "null" }] };
}
//#endregion
//#region node_modules/openai/_vendor/zod-to-json-schema/parsers/number.mjs
function parseNumberDef(def, refs) {
	const res = { type: "number" };
	if (!def.checks) return res;
	for (const check of def.checks) switch (check.kind) {
		case "int":
			res.type = "integer";
			addErrorMessage(res, "type", check.message, refs);
			break;
		case "min":
			if (refs.target === "jsonSchema7") if (check.inclusive) setResponseValueAndErrors(res, "minimum", check.value, check.message, refs);
			else setResponseValueAndErrors(res, "exclusiveMinimum", check.value, check.message, refs);
			else {
				if (!check.inclusive) res.exclusiveMinimum = true;
				setResponseValueAndErrors(res, "minimum", check.value, check.message, refs);
			}
			break;
		case "max":
			if (refs.target === "jsonSchema7") if (check.inclusive) setResponseValueAndErrors(res, "maximum", check.value, check.message, refs);
			else setResponseValueAndErrors(res, "exclusiveMaximum", check.value, check.message, refs);
			else {
				if (!check.inclusive) res.exclusiveMaximum = true;
				setResponseValueAndErrors(res, "maximum", check.value, check.message, refs);
			}
			break;
		case "multipleOf":
			setResponseValueAndErrors(res, "multipleOf", check.value, check.message, refs);
			break;
	}
	return res;
}
//#endregion
//#region node_modules/openai/_vendor/zod-to-json-schema/parsers/object.mjs
function decideAdditionalProperties(def, refs) {
	if (refs.removeAdditionalStrategy === "strict") return def.catchall._def.typeName === "ZodNever" ? def.unknownKeys !== "strict" : parseDef(def.catchall._def, {
		...refs,
		currentPath: [...refs.currentPath, "additionalProperties"]
	}) ?? true;
	else return def.catchall._def.typeName === "ZodNever" ? def.unknownKeys === "passthrough" : parseDef(def.catchall._def, {
		...refs,
		currentPath: [...refs.currentPath, "additionalProperties"]
	}) ?? true;
}
function parseObjectDef(def, refs) {
	const result = {
		type: "object",
		...Object.entries(def.shape()).reduce((acc, [propName, propDef]) => {
			if (propDef === void 0 || propDef._def === void 0) return acc;
			const propertyPath = [
				...refs.currentPath,
				"properties",
				propName
			];
			const parsedDef = parseDef(propDef._def, {
				...refs,
				currentPath: propertyPath,
				propertyPath
			});
			if (parsedDef === void 0) return acc;
			if (refs.openaiStrictMode && propDef.isOptional() && !propDef.isNullable() && typeof propDef._def?.defaultValue === "undefined") throw new Error(`Zod field at \`${propertyPath.join("/")}\` uses \`.optional()\` without \`.nullable()\` which is not supported by the API. See: https://platform.openai.com/docs/guides/structured-outputs?api-mode=responses#all-fields-must-be-required`);
			return {
				properties: {
					...acc.properties,
					[propName]: parsedDef
				},
				required: propDef.isOptional() && !refs.openaiStrictMode ? acc.required : [...acc.required, propName]
			};
		}, {
			properties: {},
			required: []
		}),
		additionalProperties: decideAdditionalProperties(def, refs)
	};
	if (!result.required.length) delete result.required;
	return result;
}
//#endregion
//#region node_modules/openai/_vendor/zod-to-json-schema/parsers/optional.mjs
var parseOptionalDef = (def, refs, forceResolution) => {
	if (refs.propertyPath && refs.currentPath.slice(0, refs.propertyPath.length).toString() === refs.propertyPath.toString()) return parseDef(def.innerType._def, {
		...refs,
		currentPath: refs.currentPath
	}, forceResolution);
	const innerSchema = parseDef(def.innerType._def, {
		...refs,
		currentPath: [
			...refs.currentPath,
			"anyOf",
			"1"
		]
	}, forceResolution);
	return innerSchema ? { anyOf: [{ not: {} }, innerSchema] } : {};
};
//#endregion
//#region node_modules/openai/_vendor/zod-to-json-schema/parsers/pipeline.mjs
var parsePipelineDef = (def, refs, forceResolution) => {
	if (refs.pipeStrategy === "input") return parseDef(def.in._def, refs, forceResolution);
	else if (refs.pipeStrategy === "output") return parseDef(def.out._def, refs, forceResolution);
	const a = parseDef(def.in._def, {
		...refs,
		currentPath: [
			...refs.currentPath,
			"allOf",
			"0"
		]
	});
	return { allOf: [a, parseDef(def.out._def, {
		...refs,
		currentPath: [
			...refs.currentPath,
			"allOf",
			a ? "1" : "0"
		]
	})].filter((x) => x !== void 0) };
};
//#endregion
//#region node_modules/openai/_vendor/zod-to-json-schema/parsers/promise.mjs
function parsePromiseDef(def, refs, forceResolution) {
	return parseDef(def.type._def, refs, forceResolution);
}
//#endregion
//#region node_modules/openai/_vendor/zod-to-json-schema/parsers/set.mjs
function parseSetDef(def, refs) {
	const schema = {
		type: "array",
		uniqueItems: true,
		items: parseDef(def.valueType._def, {
			...refs,
			currentPath: [...refs.currentPath, "items"]
		})
	};
	if (def.minSize) setResponseValueAndErrors(schema, "minItems", def.minSize.value, def.minSize.message, refs);
	if (def.maxSize) setResponseValueAndErrors(schema, "maxItems", def.maxSize.value, def.maxSize.message, refs);
	return schema;
}
//#endregion
//#region node_modules/openai/_vendor/zod-to-json-schema/parsers/tuple.mjs
function parseTupleDef(def, refs) {
	if (def.rest) return {
		type: "array",
		minItems: def.items.length,
		items: def.items.map((x, i) => parseDef(x._def, {
			...refs,
			currentPath: [
				...refs.currentPath,
				"items",
				`${i}`
			]
		})).reduce((acc, x) => x === void 0 ? acc : [...acc, x], []),
		additionalItems: parseDef(def.rest._def, {
			...refs,
			currentPath: [...refs.currentPath, "additionalItems"]
		})
	};
	else return {
		type: "array",
		minItems: def.items.length,
		maxItems: def.items.length,
		items: def.items.map((x, i) => parseDef(x._def, {
			...refs,
			currentPath: [
				...refs.currentPath,
				"items",
				`${i}`
			]
		})).reduce((acc, x) => x === void 0 ? acc : [...acc, x], [])
	};
}
//#endregion
//#region node_modules/openai/_vendor/zod-to-json-schema/parsers/undefined.mjs
function parseUndefinedDef() {
	return { not: {} };
}
//#endregion
//#region node_modules/openai/_vendor/zod-to-json-schema/parsers/unknown.mjs
function parseUnknownDef() {
	return {};
}
//#endregion
//#region node_modules/openai/_vendor/zod-to-json-schema/parsers/readonly.mjs
var parseReadonlyDef = (def, refs, forceResolution) => {
	return parseDef(def.innerType._def, refs, forceResolution);
};
//#endregion
//#region node_modules/openai/_vendor/zod-to-json-schema/parseDef.mjs
function parseDef(def, refs, forceResolution = false) {
	const seenItem = refs.seen.get(def);
	if (refs.override) {
		const overrideResult = refs.override?.(def, refs, seenItem, forceResolution);
		if (overrideResult !== ignoreOverride) return overrideResult;
	}
	if (seenItem && !forceResolution) {
		const seenSchema = get$ref(seenItem, refs);
		if (seenSchema !== void 0) {
			if ("$ref" in seenSchema) refs.seenRefs.add(seenSchema.$ref);
			return seenSchema;
		}
	}
	const newItem = {
		def,
		path: refs.currentPath,
		jsonSchema: void 0
	};
	refs.seen.set(def, newItem);
	try {
		const jsonSchema = selectParser(def, def.typeName, refs, forceResolution);
		if (jsonSchema) addMeta(def, refs, jsonSchema);
		newItem.jsonSchema = jsonSchema;
		return jsonSchema;
	} finally {
		if (forceResolution && seenItem) refs.seen.set(def, seenItem);
	}
}
var get$ref = (item, refs) => {
	switch (refs.$refStrategy) {
		case "root": return { $ref: item.path.join("/") };
		case "extract-to-root":
			const name = item.path.slice(refs.basePath.length + 1).map((part, index) => index === 0 ? part : encodeDefinitionPathPart(part)).join("_");
			if (name !== refs.name && refs.nameStrategy === "duplicate-ref") refs.definitions[name] = item.def;
			return { $ref: [
				...refs.basePath,
				refs.definitionPath,
				name
			].join("/") };
		case "relative": return { $ref: getRelativePath(refs.currentPath, item.path) };
		case "none":
		case "seen":
			if (item.path.length < refs.currentPath.length && item.path.every((value, index) => refs.currentPath[index] === value)) {
				console.warn(`Recursive reference detected at ${refs.currentPath.join("/")}! Defaulting to any`);
				return {};
			}
			return refs.$refStrategy === "seen" ? {} : void 0;
	}
};
var encodedDefinitionPathPartPrefix = "_x_";
var encodeDefinitionPathPart = (part) => {
	if (/^[A-Za-z0-9_-]*$/.test(part) && !part.startsWith(encodedDefinitionPathPartPrefix)) return part;
	let encoded = encodedDefinitionPathPartPrefix;
	for (let i = 0; i < part.length; i++) encoded += part.charCodeAt(i).toString(16).padStart(4, "0");
	return encoded;
};
var getRelativePath = (pathA, pathB) => {
	let i = 0;
	for (; i < pathA.length && i < pathB.length; i++) if (pathA[i] !== pathB[i]) break;
	return [(pathA.length - i).toString(), ...pathB.slice(i)].join("/");
};
var selectParser = (def, typeName, refs, forceResolution) => {
	switch (typeName) {
		case ZodFirstPartyTypeKind.ZodString: return parseStringDef(def, refs);
		case ZodFirstPartyTypeKind.ZodNumber: return parseNumberDef(def, refs);
		case ZodFirstPartyTypeKind.ZodObject: return parseObjectDef(def, refs);
		case ZodFirstPartyTypeKind.ZodBigInt: return parseBigintDef(def, refs);
		case ZodFirstPartyTypeKind.ZodBoolean: return parseBooleanDef();
		case ZodFirstPartyTypeKind.ZodDate: return parseDateDef(def, refs);
		case ZodFirstPartyTypeKind.ZodUndefined: return parseUndefinedDef();
		case ZodFirstPartyTypeKind.ZodNull: return parseNullDef(refs);
		case ZodFirstPartyTypeKind.ZodArray: return parseArrayDef(def, refs);
		case ZodFirstPartyTypeKind.ZodUnion:
		case ZodFirstPartyTypeKind.ZodDiscriminatedUnion: return parseUnionDef(def, refs);
		case ZodFirstPartyTypeKind.ZodIntersection: return parseIntersectionDef(def, refs);
		case ZodFirstPartyTypeKind.ZodTuple: return parseTupleDef(def, refs);
		case ZodFirstPartyTypeKind.ZodRecord: return parseRecordDef(def, refs);
		case ZodFirstPartyTypeKind.ZodLiteral: return parseLiteralDef(def, refs);
		case ZodFirstPartyTypeKind.ZodEnum: return parseEnumDef(def);
		case ZodFirstPartyTypeKind.ZodNativeEnum: return parseNativeEnumDef(def);
		case ZodFirstPartyTypeKind.ZodNullable: return parseNullableDef(def, refs, forceResolution);
		case ZodFirstPartyTypeKind.ZodOptional: return parseOptionalDef(def, refs, forceResolution);
		case ZodFirstPartyTypeKind.ZodMap: return parseMapDef(def, refs);
		case ZodFirstPartyTypeKind.ZodSet: return parseSetDef(def, refs);
		case ZodFirstPartyTypeKind.ZodLazy: return parseDef(def.getter()._def, refs, forceResolution);
		case ZodFirstPartyTypeKind.ZodPromise: return parsePromiseDef(def, refs, forceResolution);
		case ZodFirstPartyTypeKind.ZodNaN:
		case ZodFirstPartyTypeKind.ZodNever: return parseNeverDef();
		case ZodFirstPartyTypeKind.ZodEffects: return parseEffectsDef(def, refs, forceResolution);
		case ZodFirstPartyTypeKind.ZodAny: return parseAnyDef();
		case ZodFirstPartyTypeKind.ZodUnknown: return parseUnknownDef();
		case ZodFirstPartyTypeKind.ZodDefault: return parseDefaultDef(def, refs, forceResolution);
		case ZodFirstPartyTypeKind.ZodBranded: return parseBrandedDef(def, refs, forceResolution);
		case ZodFirstPartyTypeKind.ZodReadonly: return parseReadonlyDef(def, refs, forceResolution);
		case ZodFirstPartyTypeKind.ZodCatch: return parseCatchDef(def, refs, forceResolution);
		case ZodFirstPartyTypeKind.ZodPipeline: return parsePipelineDef(def, refs, forceResolution);
		case ZodFirstPartyTypeKind.ZodFunction:
		case ZodFirstPartyTypeKind.ZodVoid:
		case ZodFirstPartyTypeKind.ZodSymbol: return;
		default: return ((_) => void 0)(typeName);
	}
};
var addMeta = (def, refs, jsonSchema) => {
	if (def.description) {
		jsonSchema.description = def.description;
		if (refs.markdownDescription) jsonSchema.markdownDescription = def.description;
	}
	return jsonSchema;
};
//#endregion
//#region node_modules/openai/_vendor/zod-to-json-schema/zodToJsonSchema.mjs
var zodToJsonSchema = (schema, options) => {
	const refs = getRefs(options);
	const name = typeof options === "string" ? options : options?.nameStrategy === "title" ? void 0 : options?.name;
	const main = parseDef(schema._def, name === void 0 ? refs : {
		...refs,
		currentPath: [
			...refs.basePath,
			refs.definitionPath,
			name
		]
	}, false) ?? {};
	const title = typeof options === "object" && options.name !== void 0 && options.nameStrategy === "title" ? options.name : void 0;
	if (title !== void 0) main.title = title;
	const definitions = (() => {
		if (isEmptyObj(refs.definitions)) return;
		const definitions = {};
		const processedDefinitions = /* @__PURE__ */ new Set();
		for (let i = 0; i < 500; i++) {
			const newDefinitions = Object.entries(refs.definitions).filter(([key]) => !processedDefinitions.has(key));
			if (newDefinitions.length === 0) break;
			for (const [key, schema] of newDefinitions) {
				definitions[key] = parseDef(zodDef(schema), {
					...refs,
					currentPath: [
						...refs.basePath,
						refs.definitionPath,
						key
					]
				}, true) ?? {};
				processedDefinitions.add(key);
			}
		}
		return definitions;
	})();
	const combined = name === void 0 ? definitions ? {
		...main,
		[refs.definitionPath]: definitions
	} : main : refs.nameStrategy === "duplicate-ref" ? {
		...main,
		...definitions || refs.seenRefs.size ? { [refs.definitionPath]: {
			...definitions,
			...refs.seenRefs.size ? { [name]: main } : void 0
		} } : void 0
	} : {
		$ref: [
			...refs.$refStrategy === "relative" ? [] : refs.basePath,
			refs.definitionPath,
			name
		].join("/"),
		[refs.definitionPath]: {
			...definitions,
			[name]: main
		}
	};
	if (refs.target === "jsonSchema7") combined.$schema = "http://json-schema.org/draft-07/schema#";
	else if (refs.target === "jsonSchema2019-09") combined.$schema = "https://json-schema.org/draft/2019-09/schema#";
	return combined;
};
//#endregion
//#region node_modules/openai/lib/transform.mjs
var JSON_SCHEMA_ANNOTATION_KEYWORDS = /* @__PURE__ */ new Set([
	"$comment",
	"default",
	"description",
	"examples",
	"readOnly",
	"title",
	"writeOnly"
]);
var JSON_SCHEMA_ROOT_METADATA_KEYWORDS = /* @__PURE__ */ new Set(["$id", "$schema"]);
var JSON_SCHEMA_OBJECT_KEYWORDS = /* @__PURE__ */ new Set([
	"additionalProperties",
	"dependencies",
	"maxProperties",
	"minProperties",
	"patternProperties",
	"properties",
	"propertyNames",
	"required"
]);
var JSON_SCHEMA_SINGLE_SCHEMA_KEYWORDS = [
	"additionalItems",
	"additionalProperties",
	"contains",
	"contentSchema",
	"else",
	"if",
	"not",
	"propertyNames",
	"then",
	"unevaluatedItems",
	"unevaluatedProperties"
];
var JSON_SCHEMA_ARRAY_SCHEMA_KEYWORDS = [
	"allOf",
	"anyOf",
	"items",
	"oneOf",
	"prefixItems"
];
var JSON_SCHEMA_MAP_SCHEMA_KEYWORDS = [
	"$defs",
	"definitions",
	"dependentSchemas",
	"dependencies",
	"patternProperties",
	"properties"
];
var JSON_SCHEMA_UNSUPPORTED_SCHEMA_KEYWORDS = /* @__PURE__ */ new Set([
	"$anchor",
	"$dynamicAnchor",
	"$dynamicRef",
	"$recursiveAnchor",
	"$recursiveRef",
	"allOf",
	"contains",
	"contentEncoding",
	"contentMediaType",
	"contentSchema",
	"dependentRequired",
	"dependentSchemas",
	"dependencies",
	"else",
	"if",
	"maxContains",
	"maxProperties",
	"minContains",
	"minProperties",
	"not",
	"patternProperties",
	"prefixItems",
	"propertyNames",
	"then",
	"unevaluatedItems",
	"unevaluatedProperties",
	"uniqueItems"
]);
var MERGEABLE_OBJECT_ALL_OF_KEYWORDS = /* @__PURE__ */ new Set([
	...JSON_SCHEMA_ANNOTATION_KEYWORDS,
	"additionalProperties",
	"properties",
	"required",
	"type"
]);
/**
* Visits only values carried by JSON Schema keywords that contain schemas.
* Literal payloads such as enum, const, and default deliberately do not
* participate.
*/
function forEachJSONSchemaChild(schema, path, visit) {
	const record = schema;
	for (const keyword of JSON_SCHEMA_SINGLE_SCHEMA_KEYWORDS) if (keyword in record) visit(record[keyword], [...path, keyword], keyword);
	for (const keyword of JSON_SCHEMA_ARRAY_SCHEMA_KEYWORDS) {
		const children = record[keyword];
		if (Array.isArray(children)) for (const [index, child] of children.entries()) visit(child, [
			...path,
			keyword,
			String(index)
		], keyword);
		else if (children !== void 0) visit(children, [...path, keyword], keyword);
	}
	for (const keyword of JSON_SCHEMA_MAP_SCHEMA_KEYWORDS) {
		const children = record[keyword];
		if (!isObject(children)) continue;
		for (const [key, child] of Object.entries(children)) {
			if (keyword === "dependencies" && !isSchemaDefinition(child)) continue;
			visit(child, [
				...path,
				keyword,
				key
			], keyword);
		}
	}
}
function toStrictJsonSchema(schema) {
	const schemaCopy = structuredClone(schema);
	stripUndefinedSchemaKeywords(schemaCopy);
	normalizeSingletonTypeArrays(schemaCopy);
	assertNoNestedSchemaIds(schemaCopy);
	normalizeRootRefAndAllOf(schemaCopy);
	if (schemaCopy.type !== "object") throw new Error(`Root schema must have type: 'object' but got type: ${schemaCopy.type ? `'${schemaCopy.type}'` : "undefined"}`);
	if (schemaCopy.anyOf !== void 0) throw new Error("Root schema must not use `anyOf` because strict Structured Outputs requires a root object without a union.");
	validateRefSchemas(schemaCopy, [], schemaCopy);
	preserveAllOfRefTargets(schemaCopy);
	validateRefSchemas(schemaCopy, [], schemaCopy);
	rewriteLocalRefsIntoFilteredAnyOfBranches(schemaCopy);
	normalizeObjectAllOfBranches(schemaCopy, [], schemaCopy);
	const strictSchema = ensureStrictJsonSchema(schemaCopy, [], schemaCopy);
	validateRefSchemas(strictSchema, [], strictSchema);
	return strictSchema;
}
function stripUndefinedSchemaKeywords(schema, visited = /* @__PURE__ */ new Set()) {
	if (typeof schema === "boolean" || !isObject(schema) || visited.has(schema)) return;
	visited.add(schema);
	const schemaRecord = schema;
	for (const keyword of Object.keys(schemaRecord)) if (schemaRecord[keyword] === void 0) delete schemaRecord[keyword];
	forEachJSONSchemaChild(schema, [], (child) => {
		stripUndefinedSchemaKeywords(child, visited);
	});
}
/**
* Root ref inlining and singleton allOf flattening can expose each other.
* Iterate until flattening no longer produces another root ref so every
* exactly representable chain reaches its final object form before the root
* type check runs.
*/
function normalizeRootRefAndAllOf(schema) {
	const seenRefs = /* @__PURE__ */ new Set();
	while (true) {
		if (typeof schema.$ref === "string") {
			if (seenRefs.has(schema.$ref)) throw new Error("Cyclic local $ref at `<root>` is not supported: " + JSON.stringify(schema.$ref));
			seenRefs.add(schema.$ref);
		}
		inlineRootRefObject(schema);
		preserveAllOfRefTargets(schema, true);
		normalizeRootAllOf(schema);
		const normalizedAnyOf = normalizeRootAnyOf(schema);
		if (schema.$ref === void 0 && !normalizedAnyOf) return;
	}
}
/**
* Some Standard Schema converters emit the root object through a local ref,
* with the referenced schema stored in a root definition map. Structured
* Outputs requires the root itself to be an object, so inline that safe,
* definition-only form while keeping the root maps available for every local
* pointer in the schema.
*/
function inlineRootRefObject(schema) {
	let ref = schema.$ref;
	if (ref === void 0) return;
	assertLocalRootRef(ref);
	if (!hasOnlyRootRefAndDefinitions(schema)) throw new Error("Schema $ref at `<root>` has non-metadata siblings that Draft 7 ignores and cannot be represented in strict Structured Outputs.");
	const seenRefs = /* @__PURE__ */ new Set();
	const inheritedAnnotations = Object.fromEntries(Object.entries(schema).filter(([keyword]) => JSON_SCHEMA_ANNOTATION_KEYWORDS.has(keyword)));
	let resolved;
	while (true) {
		if (seenRefs.has(ref)) throw new Error("Cyclic local $ref at `<root>` is not supported: " + JSON.stringify(ref));
		seenRefs.add(ref);
		const target = resolveLocalRef(schema, ref);
		if (target === void 0) throw new Error("Local $ref at `<root>` does not resolve to an object or boolean schema: " + JSON.stringify(ref));
		if (typeof target === "boolean") throw new TypeError("Expected object schema but got boolean; path=<root>");
		const nextRef = target.$ref;
		if (nextRef === void 0) {
			resolved = target;
			break;
		}
		assertLocalRootRef(nextRef);
		if (seenRefs.has(nextRef)) throw new Error("Cyclic local $ref at `<root>` is not supported: " + JSON.stringify(nextRef));
		if (!hasOnlyRefAndAnnotations(target)) throw new Error("Schema $ref in root chain has non-annotation siblings that Draft 7 ignores and cannot be represented in strict Structured Outputs.");
		for (const keyword of JSON_SCHEMA_ANNOTATION_KEYWORDS) if (!(keyword in inheritedAnnotations) && keyword in target) inheritedAnnotations[keyword] = target[keyword];
		ref = nextRef;
	}
	const rootDefinitions = schema.$defs;
	const legacyDefinitions = schema.definitions;
	const rootMetadata = Object.fromEntries(Object.entries(schema).filter(([keyword]) => JSON_SCHEMA_ANNOTATION_KEYWORDS.has(keyword) || JSON_SCHEMA_ROOT_METADATA_KEYWORDS.has(keyword)));
	const inlined = structuredClone(resolved);
	for (const keyword of ["$defs", "definitions"]) if (schema[keyword] !== void 0 && inlined[keyword] !== void 0) delete inlined[keyword];
	const schemaRecord = schema;
	for (const keyword of Object.keys(schema)) delete schemaRecord[keyword];
	Object.assign(schema, inlined, inheritedAnnotations, rootMetadata);
	if (rootDefinitions !== void 0) schema.$defs = rootDefinitions;
	if (legacyDefinitions !== void 0) schema.definitions = legacyDefinitions;
}
/**
* Root object validation runs before recursive strictification, so normalize
* the same exactly representable allOf forms here that the recursive pass
* handles for nested schemas.
*/
function normalizeRootAllOf(schema) {
	while (schema.allOf !== void 0) {
		if (Array.isArray(schema.allOf)) for (const [index, branch] of schema.allOf.entries()) normalizeObjectAllOfBranches(branch, ["allOf", String(index)], schema);
		if (mergeObjectAllOf(schema, [], schema)) continue;
		const allOf = schema.allOf;
		if (!Array.isArray(allOf) || allOf.length !== 1 || !hasOnlyRootAllOfMetadataSiblings(schema)) return;
		const branch = allOf[0];
		if (typeof branch === "boolean" || !isObject(branch)) return;
		const rootMetadata = { ...schema };
		delete rootMetadata.allOf;
		const normalized = structuredClone(branch);
		const schemaRecord = schema;
		for (const keyword of Object.keys(schema)) delete schemaRecord[keyword];
		Object.assign(schema, normalized, rootMetadata);
	}
}
/**
* A singleton root anyOf with no validating siblings is equivalent to its
* only branch. Flatten it before the root-union check so converters that
* retain a redundant object wrapper can still produce a strict root object.
*/
function normalizeRootAnyOf(schema) {
	const anyOf = schema.anyOf;
	if (!Array.isArray(anyOf) || !hasOnlyRootAnyOfMetadataSiblings(schema)) return false;
	const realBranches = anyOf.map((branch, index) => ({
		branch,
		index
	})).filter(({ branch }) => branch !== false);
	if (realBranches.length !== 1) return false;
	const { branch, index: branchIndex } = realBranches[0];
	if (typeof branch === "boolean" || !isObject(branch) || !isObjectOnlySchema(branch, schema)) return false;
	const definitionRenames = planPromotedRootAnyOfDefinitionRenames(schema, branch);
	rewriteLocalRefsIntoPromotedRootAnyOfBranch(schema, branchIndex, definitionRenames);
	const rootMetadata = { ...schema };
	delete rootMetadata.anyOf;
	const normalized = structuredClone(branch);
	for (const keyword of ["$defs", "definitions"]) {
		const rootDefinitions = schema[keyword];
		const branchDefinitions = normalized[keyword];
		if (!isObject(rootDefinitions) || !isObject(branchDefinitions)) continue;
		const renames = definitionRenames.get(keyword);
		const mergedDefinitions = { ...rootDefinitions };
		for (const [name, definition] of Object.entries(branchDefinitions)) mergedDefinitions[renames?.get(name) ?? name] = definition;
		normalized[keyword] = mergedDefinitions;
		delete rootMetadata[keyword];
	}
	const schemaRecord = schema;
	for (const keyword of Object.keys(schema)) delete schemaRecord[keyword];
	Object.assign(schema, normalized, rootMetadata);
	return true;
}
/**
* Root and promoted branch definition maps occupy the same pointer after
* promotion. Give conflicting branch definitions stable aliases before refs
* are rewritten so neither original target is rebound.
*/
function planPromotedRootAnyOfDefinitionRenames(root, branch) {
	const renames = /* @__PURE__ */ new Map();
	for (const keyword of ["$defs", "definitions"]) {
		const rootDefinitions = root[keyword];
		const branchDefinitions = branch[keyword];
		if (!isObject(rootDefinitions) || !isObject(branchDefinitions)) continue;
		const usedNames = /* @__PURE__ */ new Set([...Object.keys(rootDefinitions), ...Object.keys(branchDefinitions)]);
		const keywordRenames = /* @__PURE__ */ new Map();
		let aliasIndex = 0;
		for (const [name, definition] of Object.entries(branchDefinitions)) {
			if (!Object.prototype.hasOwnProperty.call(rootDefinitions, name) || schemasEqual(rootDefinitions[name], definition)) continue;
			let alias = "__openai_strict_anyOf_definition_" + aliasIndex++;
			while (usedNames.has(alias)) alias = "__openai_strict_anyOf_definition_" + aliasIndex++;
			usedNames.add(alias);
			keywordRenames.set(name, alias);
		}
		if (keywordRenames.size > 0) renames.set(keyword, keywordRenames);
	}
	return renames;
}
/**
* Promoting a singleton root anyOf branch removes the original anyOf/index
* pointer prefix. Rewrite refs through that prefix while the old tree still
* exists so the promoted schema keeps naming the same targets.
*/
function rewriteLocalRefsIntoPromotedRootAnyOfBranch(root, branchIndex, definitionRenames) {
	const rewriteRef = (ref) => {
		const parts = parseLocalRef(ref);
		if (parts === void 0 || parts[0] !== "anyOf" || parts[1] !== String(branchIndex)) return ref;
		const promotedParts = parts.slice(2);
		const definitionKeyword = promotedParts[0];
		if (promotedParts.length > 1 && (definitionKeyword === "$defs" || definitionKeyword === "definitions")) {
			const renamed = definitionRenames.get(definitionKeyword)?.get(promotedParts[1]);
			if (renamed !== void 0) promotedParts[1] = renamed;
		}
		return promotedParts.length === 0 ? "#" : "#/" + promotedParts.map(encodeJSONPointerTokenForURIFragment).join("/");
	};
	const rewriteRefs = (value) => {
		if (typeof value === "boolean" || !isObject(value)) return;
		if (typeof value.$ref === "string") value.$ref = rewriteRef(value.$ref);
		forEachJSONSchemaChild(value, [], (child) => {
			rewriteRefs(child);
		});
	};
	rewriteRefs(root);
}
function assertLocalRootRef(ref) {
	if (typeof ref !== "string") throw new TypeError("Received non-string $ref - " + String(ref) + "; path=<root>");
	if (!ref.startsWith("#")) throw new Error("External $ref at `<root>` is not supported in strict Structured Outputs: " + JSON.stringify(ref));
}
function hasOnlyRootRefAndDefinitions(schema) {
	return Object.keys(schema).every((keyword) => keyword === "$ref" || keyword === "$defs" || keyword === "definitions" || JSON_SCHEMA_ROOT_METADATA_KEYWORDS.has(keyword) || JSON_SCHEMA_ANNOTATION_KEYWORDS.has(keyword));
}
/**
* Draft 7 permits `type` to be either a string or an array of strings. A
* singleton array has exactly the same validation semantics as its scalar
* form, so canonicalize it before root validation and recursive strictifying.
* Multi-type arrays carry real union semantics and must remain unchanged.
*/
function normalizeSingletonTypeArrays(schema) {
	if (typeof schema === "boolean" || !isObject(schema)) return;
	if (Array.isArray(schema.type) && schema.type.length === 1) schema.type = schema.type[0];
	forEachJSONSchemaChild(schema, [], (child) => {
		normalizeSingletonTypeArrays(child);
	});
}
function isNullable(schema, root, seenRefs = /* @__PURE__ */ new Set()) {
	if (typeof schema === "boolean") return schema;
	const ref = schema.$ref;
	if (ref !== void 0) {
		if (typeof ref !== "string" || !hasOnlyRefAndAnnotations(schema) || seenRefs.has(ref)) return false;
		const resolved = resolveLocalRef(root, ref);
		if (resolved === void 0) return false;
		return isNullable(resolved, root, /* @__PURE__ */ new Set([...seenRefs, ref]));
	}
	if (schema.type !== void 0 && schema.type !== "null" && !(Array.isArray(schema.type) && schema.type.includes("null"))) return false;
	if ("const" in schema && schema.const !== null) return false;
	if (schema.enum !== void 0 && (!Array.isArray(schema.enum) || !schema.enum.includes(null))) return false;
	if (schema.allOf !== void 0) {
		if (!Array.isArray(schema.allOf) || !schema.allOf.every((variant) => isNullable(variant, root))) return false;
	}
	if (schema.anyOf !== void 0) {
		if (!Array.isArray(schema.anyOf) || !schema.anyOf.some((variant) => isNullable(variant, root))) return false;
	}
	if (schema.oneOf !== void 0) {
		if (!Array.isArray(schema.oneOf) || schema.oneOf.filter((variant) => isNullable(variant, root)).length !== 1) return false;
	}
	if (schema.not !== void 0 || schema.if !== void 0 || schema.then !== void 0 || schema.else !== void 0) return false;
	return true;
}
/**
* Mutates the given JSON schema to ensure it conforms to the `strict` standard
* that the API expects.
*/
function ensureStrictJsonSchema(jsonSchema, path, root) {
	if (typeof jsonSchema === "boolean") throw new TypeError(`Expected object schema but got boolean; path=${path.join("/")}`);
	if (!isObject(jsonSchema)) throw new TypeError(`Expected ${JSON.stringify(jsonSchema)} to be an object; path=${path.join("/")}`);
	if (mergeObjectAllOf(jsonSchema, path, root)) return ensureStrictJsonSchema(jsonSchema, path, root);
	normalizeAnyOfFalseBranches(jsonSchema);
	normalizeObjectUnionWrapper(jsonSchema, path, root);
	if (hasObjectShape(jsonSchema)) {
		if (!("additionalProperties" in jsonSchema)) jsonSchema.additionalProperties = false;
		else if (jsonSchema.additionalProperties !== false) throw new Error(`Object schema at \`${path.join("/") || "<root>"}\` must set \`additionalProperties: false\` to be compatible with strict Structured Outputs.`);
	}
	const required = jsonSchema.required ?? [];
	if (!Array.isArray(required) || required.some((key) => typeof key !== "string")) throw new TypeError(`Expected \`required\` to be an array of strings; path=${path.join("/") || "<root>"}`);
	const properties = jsonSchema.properties;
	if (hasObjectShape(jsonSchema)) {
		for (const key of required) if (!isObject(properties) || !Object.prototype.hasOwnProperty.call(properties, key)) throw new Error(`Object schema at \`${path.join("/") || "<root>"}\` requires property \`${key}\` but does not declare it in \`properties\`.`);
	}
	if (isObject(properties)) {
		for (const [key, value] of Object.entries(properties)) if (!isNullable(value, root) && !required.includes(key)) throw new Error(`Schema field at \`${[
			...path,
			"properties",
			key
		].join("/")}\` uses \`.optional()\` without \`.nullable()\` which is not supported by the API. See: https://platform.openai.com/docs/guides/structured-outputs?api-mode=responses#all-fields-must-be-required`);
		jsonSchema.required = Object.keys(properties);
	}
	const items = jsonSchema.items;
	const additionalItems = jsonSchema.additionalItems;
	if (Array.isArray(items)) throw new Error(`Schema at \`${path.join("/") || "<root>"}\` uses tuple-form \`items\`, which cannot be represented in strict Structured Outputs.`);
	if (additionalItems !== void 0) throw new Error(`Schema at \`${path.join("/") || "<root>"}\` uses unsupported keyword \`additionalItems\` and cannot be represented in strict Structured Outputs.`);
	const allOf = jsonSchema.allOf;
	if (Array.isArray(allOf)) {
		if (allOf.length === 1 && hasOnlyAnnotationSiblings(jsonSchema, "allOf")) {
			const branch = allOf[0];
			if (branch === false) throw new Error(`Schema at \`${path.join("/") || "<root>"}\` uses \`allOf: [false]\`, which cannot be represented in strict Structured Outputs.`);
			if (branch === true) delete jsonSchema.allOf;
			else {
				const resolved = ensureStrictJsonSchema(branch, [
					...path,
					"allOf",
					"0"
				], root);
				const annotations = { ...jsonSchema };
				delete annotations.allOf;
				Object.assign(jsonSchema, resolved, annotations);
				delete jsonSchema.allOf;
			}
		}
	}
	normalizeArrayUnionWrapper(jsonSchema, root);
	const schemaRecord = jsonSchema;
	for (const keyword of JSON_SCHEMA_UNSUPPORTED_SCHEMA_KEYWORDS) {
		if (schemaRecord[keyword] !== void 0) throw new Error(`Schema at \`${path.join("/") || "<root>"}\` uses unsupported keyword \`${keyword}\` and cannot be represented in strict Structured Outputs.`);
		delete schemaRecord[keyword];
	}
	const type = jsonSchema.type;
	const currentItems = jsonSchema.items;
	if ((type === "array" || Array.isArray(type) && type.includes("array")) && currentItems === void 0) throw new Error(`Schema at \`${path.join("/") || "<root>"}\` declares an array without \`items\`, which cannot be represented in strict Structured Outputs.`);
	forEachJSONSchemaChild(jsonSchema, path, (child, childPath, keyword) => {
		if (typeof child === "boolean" && (keyword === "additionalProperties" || keyword === "additionalItems")) return;
		ensureStrictJsonSchema(child, childPath, root);
	});
	if (jsonSchema.default === null) delete jsonSchema.default;
	return jsonSchema;
}
function parseLocalRef(ref) {
	if (!ref.startsWith("#")) return;
	let pointer;
	try {
		pointer = decodeURIComponent(ref.slice(1));
	} catch {
		return;
	}
	if (pointer === "") return [];
	if (!pointer.startsWith("/")) return;
	const parts = [];
	for (const encodedPart of pointer.slice(1).split("/")) {
		if (/~(?:[^01]|$)/.test(encodedPart)) return;
		parts.push(encodedPart.replace(/~1/g, "/").replace(/~0/g, "~"));
	}
	return parts;
}
function resolvePointerPart(resolved, part) {
	if (Array.isArray(resolved)) {
		if (!/^(?:0|[1-9]\d*)$/.test(part)) return;
		const index = Number(part);
		if (!Object.prototype.hasOwnProperty.call(resolved, index)) return;
		return resolved[index];
	}
	if (!isObject(resolved) || !Object.prototype.hasOwnProperty.call(resolved, part)) return;
	return resolved[part];
}
function resolveLocalRef(root, ref) {
	const parts = parseLocalRef(ref);
	if (parts === void 0) return;
	let resolved = root;
	for (let index = 0; index < parts.length;) {
		if (!isObject(resolved)) return;
		const keyword = parts[index];
		if (JSON_SCHEMA_SINGLE_SCHEMA_KEYWORDS.includes(keyword)) {
			resolved = resolvePointerPart(resolved, keyword);
			index += 1;
			continue;
		}
		if (JSON_SCHEMA_ARRAY_SCHEMA_KEYWORDS.includes(keyword)) {
			resolved = resolvePointerPart(resolved, keyword);
			index += 1;
			if (Array.isArray(resolved)) {
				if (index >= parts.length) return;
				resolved = resolvePointerPart(resolved, parts[index]);
				index += 1;
			}
			continue;
		}
		if (JSON_SCHEMA_MAP_SCHEMA_KEYWORDS.includes(keyword)) {
			const children = resolvePointerPart(resolved, keyword);
			index += 1;
			if (!isObject(children) || index >= parts.length) return;
			resolved = resolvePointerPart(children, parts[index]);
			if (keyword === "dependencies" && !isSchemaDefinition(resolved)) return;
			index += 1;
			continue;
		}
		return;
	}
	return isSchemaDefinition(resolved) ? resolved : void 0;
}
function isObject(obj) {
	return typeof obj === "object" && obj !== null && !Array.isArray(obj);
}
function isSchemaDefinition(value) {
	return typeof value === "boolean" || isObject(value);
}
function isObjectOnlySchema(schema, root, seenRefs = /* @__PURE__ */ new Set()) {
	if (typeof schema === "boolean" || !isObject(schema)) return false;
	if (schema.$ref !== void 0) {
		if (typeof schema.$ref !== "string" || !hasOnlyRefAndAnnotations(schema) || seenRefs.has(schema.$ref)) return false;
		const resolved = resolveLocalRef(root, schema.$ref);
		if (resolved === void 0) return false;
		return isObjectOnlySchema(resolved, root, /* @__PURE__ */ new Set([...seenRefs, schema.$ref]));
	}
	if (schema.allOf !== void 0) {
		if (!Array.isArray(schema.allOf) || schema.allOf.length !== 1 || !hasOnlyAnnotationSiblings(schema, "allOf")) return false;
		const branch = schema.allOf[0];
		return branch !== void 0 && branch !== true && branch !== false ? isObjectOnlySchema(branch, root, seenRefs) : false;
	}
	return schema.type === "object" || Array.isArray(schema.type) && schema.type.length === 1 && schema.type[0] === "object";
}
function isArrayOnlySchema(schema, root, seenRefs = /* @__PURE__ */ new Set()) {
	if (typeof schema === "boolean" || !isObject(schema)) return false;
	if (schema.$ref !== void 0) {
		if (typeof schema.$ref !== "string" || !hasOnlyRefAndAnnotations(schema) || seenRefs.has(schema.$ref)) return false;
		const resolved = resolveLocalRef(root, schema.$ref);
		if (resolved === void 0) return false;
		return isArrayOnlySchema(resolved, root, /* @__PURE__ */ new Set([...seenRefs, schema.$ref]));
	}
	if (schema.allOf !== void 0) {
		if (!Array.isArray(schema.allOf) || schema.allOf.length !== 1 || !hasOnlyAnnotationSiblings(schema, "allOf")) return false;
		const branch = schema.allOf[0];
		return branch !== void 0 && branch !== true && branch !== false ? isArrayOnlySchema(branch, root, seenRefs) : false;
	}
	return schema.type === "array" || Array.isArray(schema.type) && schema.type.length === 1 && schema.type[0] === "array";
}
function hasOnlyRefAndAnnotations(schema) {
	return Object.keys(schema).every((keyword) => keyword === "$ref" || keyword === "$defs" || keyword === "definitions" || JSON_SCHEMA_ANNOTATION_KEYWORDS.has(keyword));
}
function hasOnlyAnnotationSiblings(schema, keyword) {
	const schemaRecord = schema;
	return Object.keys(schema).every((schemaKeyword) => schemaKeyword === keyword || (schemaKeyword === "$defs" || schemaKeyword === "definitions") && isObject(schemaRecord[schemaKeyword]) || JSON_SCHEMA_ANNOTATION_KEYWORDS.has(schemaKeyword));
}
function hasOnlyRootAllOfMetadataSiblings(schema) {
	return Object.keys(schema).every((keyword) => keyword === "allOf" || keyword === "$defs" || keyword === "definitions" || JSON_SCHEMA_ROOT_METADATA_KEYWORDS.has(keyword) || JSON_SCHEMA_ANNOTATION_KEYWORDS.has(keyword));
}
function hasOnlyRootAnyOfMetadataSiblings(schema) {
	return Object.keys(schema).every((keyword) => keyword === "anyOf" || keyword === "$defs" || keyword === "definitions" || keyword === "type" && schema.type === "object" || JSON_SCHEMA_ROOT_METADATA_KEYWORDS.has(keyword) || JSON_SCHEMA_ANNOTATION_KEYWORDS.has(keyword));
}
function hasObjectKeywords(schema) {
	return Object.keys(schema).some((keyword) => JSON_SCHEMA_OBJECT_KEYWORDS.has(keyword));
}
function hasObjectShape(schema) {
	const typ = schema.type;
	return typ === "object" || Array.isArray(typ) && typ.includes("object") || typ === void 0 && hasObjectKeywords(schema);
}
function isRedundantUnionWrapperType(type, branchType) {
	return type === branchType || Array.isArray(type) && type.length === 2 && type.includes(branchType) && type.includes("null");
}
function normalizeObjectUnionWrapper(jsonSchema, path, root) {
	if (jsonSchema.anyOf === void 0) return;
	const hasEmptyProperties = isObject(jsonSchema.properties) && Object.keys(jsonSchema.properties).length === 0;
	const hasEmptyRequired = Array.isArray(jsonSchema.required) && jsonSchema.required.length === 0;
	if (hasEmptyProperties) delete jsonSchema.properties;
	if (hasEmptyRequired) delete jsonSchema.required;
	if (!hasObjectShape(jsonSchema)) return;
	const hasOwnObjectConstraints = Object.keys(jsonSchema).some((keyword) => JSON_SCHEMA_OBJECT_KEYWORDS.has(keyword));
	if (isRedundantUnionWrapperType(jsonSchema.type, "object") && !hasOwnObjectConstraints && Array.isArray(jsonSchema.anyOf) && jsonSchema.anyOf.every((branch) => isObjectOnlySchema(branch, root))) {
		delete jsonSchema.type;
		return;
	}
	throw new Error("Object anyOf schema at `" + (path.join("/") || "<root>") + "` cannot be represented in strict Structured Outputs without changing Draft 7 validation.");
}
function normalizeArrayUnionWrapper(jsonSchema, root) {
	if (isRedundantUnionWrapperType(jsonSchema.type, "array") && jsonSchema.items === void 0 && Array.isArray(jsonSchema.anyOf) && jsonSchema.anyOf.every((branch) => isArrayOnlySchema(branch, root))) delete jsonSchema.type;
}
function normalizeAnyOfFalseBranches(jsonSchema) {
	if (!Array.isArray(jsonSchema.anyOf)) return;
	const realBranches = jsonSchema.anyOf.filter((branch) => branch !== false);
	if (realBranches.length > 0 && realBranches.length !== jsonSchema.anyOf.length) jsonSchema.anyOf = realBranches;
}
function assertNoNestedSchemaIds(schema) {
	const visit = (value, path) => {
		if (typeof value === "boolean" || !isObject(value)) return;
		if (path.length > 0 && value.$id !== void 0) throw new Error("Nested $id at " + JSON.stringify(path.join("/")) + " establishes a separate JSON Schema resource scope and cannot be represented in strict Structured Outputs.");
		forEachJSONSchemaChild(value, path, (child, childPath) => {
			visit(child, childPath);
		});
	};
	visit(schema, []);
}
function refTargetsAllOfBranch(root, ref) {
	const parts = parseLocalRef(ref);
	if (parts === void 0) return false;
	let resolved = root;
	for (const [index, part] of parts.entries()) {
		if (part === "allOf" && isObject(resolved) && Array.isArray(resolved["allOf"]) && index < parts.length - 1) return true;
		resolved = resolvePointerPart(resolved, part);
		if (resolved === void 0) return false;
	}
	return false;
}
function escapeJSONPointerToken(token) {
	return token.replace(/~/g, "~0").replace(/\//g, "~1");
}
function encodeJSONPointerTokenForURIFragment(token) {
	return encodeURIComponent(escapeJSONPointerToken(token)).replace(/%24/g, "$");
}
/**
* Strictification removes false anyOf alternatives. Rewrite pointers into
* surviving alternatives before that filtering happens so each local ref
* still names the same schema after earlier indices disappear.
*/
function rewriteLocalRefsIntoFilteredAnyOfBranches(root) {
	const rewriteRef = (ref) => {
		const originalParts = parseLocalRef(ref);
		if (originalParts === void 0 || originalParts.length === 0) return ref;
		const rewrittenParts = [...originalParts];
		let resolved = root;
		let changed = false;
		for (const [index, part] of originalParts.entries()) {
			const resolvedRecord = typeof resolved === "object" && resolved !== null && !Array.isArray(resolved) ? resolved : void 0;
			if (part === "anyOf" && index < originalParts.length - 1 && resolvedRecord !== void 0 && Array.isArray(resolvedRecord["anyOf"])) {
				const branches = resolvedRecord["anyOf"];
				const branchIndexPart = originalParts[index + 1];
				if (!/^(?:0|[1-9]\d*)$/.test(branchIndexPart)) return ref;
				const branchIndex = Number(branchIndexPart);
				if (!Object.prototype.hasOwnProperty.call(branches, branchIndex)) return ref;
				const realBranches = branches.filter((branch) => branch !== false);
				if (realBranches.length > 0 && realBranches.length !== branches.length) {
					if (branches[branchIndex] === false) return ref;
					const rewrittenIndex = branches.slice(0, branchIndex).filter((branch) => branch !== false).length;
					if (rewrittenIndex !== branchIndex) {
						rewrittenParts[index + 1] = String(rewrittenIndex);
						changed = true;
					}
				}
			}
			resolved = resolvePointerPart(resolved, part);
			if (resolved === void 0) return ref;
		}
		return changed ? "#/" + rewrittenParts.map(encodeJSONPointerTokenForURIFragment).join("/") : ref;
	};
	const rewriteRefs = (value) => {
		if (typeof value === "boolean" || !isObject(value)) return;
		if (typeof value.$ref === "string") value.$ref = rewriteRef(value.$ref);
		forEachJSONSchemaChild(value, [], (child) => {
			rewriteRefs(child);
		});
	};
	rewriteRefs(root);
}
/**
* Strictification removes every representable allOf. Preserve any schema
* referenced through an allOf branch under a stable root definition first so
* structural flattening cannot leave a dangling local pointer behind.
*/
function preserveAllOfRefTargets(root, rootOnly = false) {
	const refsToPreserve = /* @__PURE__ */ new Set();
	const collectRefs = (value) => {
		if (typeof value === "boolean" || !isObject(value)) return;
		if (typeof value.$ref === "string" && refTargetsAllOfBranch(root, value.$ref)) {
			const pointerParts = parseLocalRef(value.$ref);
			if (!rootOnly || pointerParts?.[0] === "allOf") refsToPreserve.add(value.$ref);
		}
		forEachJSONSchemaChild(value, [], (child) => {
			collectRefs(child);
		});
	};
	collectRefs(root);
	if (refsToPreserve.size === 0) return;
	if (root.$defs !== void 0 && !isObject(root.$defs)) throw new Error("Root schema has invalid $defs and cannot preserve local allOf references.");
	const definitions = root.$defs ?? (root.$defs = {});
	const rewrittenRefs = /* @__PURE__ */ new Map();
	let aliasIndex = 0;
	for (const ref of refsToPreserve) {
		const target = resolveLocalRef(root, ref);
		if (!isSchemaDefinition(target)) {
			if (rootOnly) continue;
			throw new Error("Local $ref cannot be preserved before allOf flattening: " + JSON.stringify(ref));
		}
		let alias = "__openai_strict_allOf_ref_" + aliasIndex++;
		while (Object.prototype.hasOwnProperty.call(definitions, alias)) alias = "__openai_strict_allOf_ref_" + aliasIndex++;
		definitions[alias] = structuredClone(target);
		rewrittenRefs.set(ref, "#/$defs/" + escapeJSONPointerToken(alias));
	}
	const rewriteRefs = (value) => {
		if (typeof value === "boolean" || !isObject(value)) return;
		if (typeof value.$ref === "string") value.$ref = rewrittenRefs.get(value.$ref) ?? value.$ref;
		forEachJSONSchemaChild(value, [], (child) => {
			rewriteRefs(child);
		});
	};
	rewriteRefs(root);
}
/**
* Closed allOf merges can discard optional property declarations. Preserve
* only local refs into declarations that are about to disappear, then rewrite
* those refs to stable root definitions before the merge removes their paths.
*/
function preserveDiscardedAllOfPropertyRefTargets(root, discardedPaths) {
	if (discardedPaths.length === 0) return;
	const refsToPreserve = /* @__PURE__ */ new Set();
	const collectRefs = (value) => {
		if (typeof value === "boolean" || !isObject(value)) return;
		if (typeof value.$ref === "string") {
			const parts = parseLocalRef(value.$ref);
			if (parts !== void 0 && discardedPaths.some((discardedPath) => parts.length >= discardedPath.length && discardedPath.every((part, index) => parts[index] === part))) refsToPreserve.add(value.$ref);
		}
		forEachJSONSchemaChild(value, [], (child) => {
			collectRefs(child);
		});
	};
	collectRefs(root);
	if (refsToPreserve.size === 0) return;
	if (root.$defs !== void 0 && !isObject(root.$defs)) throw new Error("Root schema has invalid $defs and cannot preserve discarded allOf properties.");
	const definitions = root.$defs ?? (root.$defs = {});
	const rewrittenRefs = /* @__PURE__ */ new Map();
	let aliasIndex = 0;
	for (const ref of refsToPreserve) {
		const target = resolveLocalRef(root, ref);
		if (!isSchemaDefinition(target)) throw new Error("Local $ref cannot be preserved before allOf property removal: " + JSON.stringify(ref));
		let alias = "__openai_strict_allOf_property_ref_" + aliasIndex++;
		while (Object.prototype.hasOwnProperty.call(definitions, alias)) alias = "__openai_strict_allOf_property_ref_" + aliasIndex++;
		definitions[alias] = structuredClone(target);
		rewrittenRefs.set(ref, "#/$defs/" + escapeJSONPointerToken(alias));
	}
	const rewriteRefs = (value) => {
		if (typeof value === "boolean" || !isObject(value)) return;
		if (typeof value.$ref === "string") value.$ref = rewrittenRefs.get(value.$ref) ?? value.$ref;
		forEachJSONSchemaChild(value, [], (child) => {
			rewriteRefs(child);
		});
	};
	rewriteRefs(root);
}
function validateRefSchemas(schema, path, root) {
	if (typeof schema === "boolean" || !isObject(schema)) return;
	const ref = schema.$ref;
	if (ref !== void 0) {
		if (typeof ref !== "string") throw new TypeError(`Received non-string $ref - ${ref}; path=${path.join("/")}`);
		if (!ref.startsWith("#")) throw new Error(`External $ref at \`${path.join("/") || "<root>"}\` is not supported in strict Structured Outputs: ${JSON.stringify(ref)}`);
		const resolved = resolveLocalRef(root, ref);
		if (resolved === void 0 || !isSchemaDefinition(resolved)) throw new Error(`Local $ref at \`${path.join("/") || "<root>"}\` does not resolve to an object or boolean schema: ${JSON.stringify(ref)}`);
		if (typeof resolved === "boolean") throw new TypeError(`Expected object schema but got boolean; path=${path.join("/")}`);
		if (!hasOnlyRefAndAnnotations(schema)) throw new Error(`Schema $ref at \`${path.join("/") || "<root>"}\` has non-annotation siblings that Draft 7 ignores and cannot be represented in strict Structured Outputs.`);
	}
	forEachJSONSchemaChild(schema, path, (child, childPath) => {
		validateRefSchemas(child, childPath, root);
	});
}
/**
* Resolve only local aliases whose siblings carry no validation semantics.
* Keeping this separate from general ref validation lets allOf merging inspect
* the effective object shape without broadening which refs or sibling
* constraints are accepted.
*/
function resolveObjectAllOfBranch(schema, root, normalizing) {
	const refChain = [schema];
	const seenRefs = /* @__PURE__ */ new Set();
	let resolved = schema;
	let resolvedPath = [];
	while (true) {
		while (resolved.$ref !== void 0) {
			const ref = resolved.$ref;
			if (typeof ref !== "string" || !hasOnlyRefAndAnnotations(resolved) || seenRefs.has(ref)) return;
			seenRefs.add(ref);
			const target = resolveLocalRef(root, ref);
			if (typeof target === "boolean" || !isObject(target)) return;
			const targetPath = parseLocalRef(ref);
			if (targetPath === void 0) return;
			resolved = target;
			resolvedPath = targetPath;
			refChain.push(resolved);
		}
		if (resolved.allOf !== void 0 && !normalizing.has(resolved)) {
			const previousAllOf = resolved.allOf;
			normalizeObjectAllOfBranches(resolved, resolvedPath, root, normalizing);
			if (resolved.$ref !== void 0 || resolved.allOf !== previousAllOf) continue;
		}
		return {
			schema: resolved,
			refChain
		};
	}
}
function normalizeObjectAllOfBranches(schema, path, root, normalizing = /* @__PURE__ */ new Set()) {
	if (typeof schema === "boolean" || !isObject(schema)) return;
	if (normalizing.has(schema)) return;
	normalizing.add(schema);
	try {
		while (true) {
			forEachJSONSchemaChild(schema, path, (child, childPath) => {
				normalizeObjectAllOfBranches(child, childPath, root, normalizing);
			});
			if (!mergeObjectAllOf(schema, path, root, normalizing)) return;
		}
	} finally {
		normalizing.delete(schema);
	}
}
function mergeObjectAllOf(jsonSchema, path, root, normalizing = /* @__PURE__ */ new Set()) {
	const allOf = jsonSchema.allOf;
	if (!Array.isArray(allOf) || allOf.length === 0) return false;
	const uniqueBranches = allOf.filter((branch, index) => !allOf.slice(0, index).some((candidate) => schemasEqual(candidate, branch)));
	if (uniqueBranches.length !== allOf.length) {
		jsonSchema.allOf = uniqueBranches;
		return true;
	}
	const nonNeutralBranches = allOf.filter((entry) => entry !== true);
	if (nonNeutralBranches.length !== allOf.length) {
		if (nonNeutralBranches.length === 0) delete jsonSchema.allOf;
		else jsonSchema.allOf = nonNeutralBranches;
		return true;
	}
	const parentHasObjectShape = hasObjectShapeWithoutAllOf(jsonSchema);
	const resolvedEntries = allOf.map((entry) => isObject(entry) ? resolveObjectAllOfBranch(entry, root, normalizing) : void 0);
	const objectBranches = resolvedEntries.map((entry) => entry?.schema).filter((entry) => entry !== void 0 && hasObjectShapeWithoutAllOf(entry));
	if (!parentHasObjectShape && objectBranches.length === 0) return false;
	if (!parentHasObjectShape && allOf.length === 1) return false;
	const fail = () => {
		throw new Error(`Object allOf at \`${path.join("/") || "<root>"}\` cannot be merged without changing Draft 7 validation.`);
	};
	if (!parentHasObjectShape && [
		"additionalProperties",
		"properties",
		"required",
		"type"
	].some((keyword) => keyword in jsonSchema)) fail();
	for (const keyword of Object.keys(jsonSchema)) if (keyword !== "allOf" && keyword !== "$defs" && keyword !== "definitions" && !(path.length === 0 && JSON_SCHEMA_ROOT_METADATA_KEYWORDS.has(keyword)) && !MERGEABLE_OBJECT_ALL_OF_KEYWORDS.has(keyword)) fail();
	const branches = [];
	if (parentHasObjectShape) branches.push({
		schema: jsonSchema,
		sourcePath: path
	});
	for (const [index, entry] of allOf.entries()) {
		if (!isObject(entry)) fail();
		const resolvedEntry = resolvedEntries[index];
		if (resolvedEntry === void 0) return fail();
		const branch = resolvedEntry.schema;
		if (hasObjectShapeWithoutAllOf(branch)) branches.push({
			schema: branch,
			sourcePath: branch === entry ? [
				...path,
				"allOf",
				String(index)
			] : void 0
		});
		else if (!hasOnlyNeutralAllOfBranchKeywords(branch)) fail();
	}
	const merged = {};
	for (const keyword of ["$defs", "definitions"]) if (jsonSchema[keyword] !== void 0) merged[keyword] = jsonSchema[keyword];
	if (path.length === 0) {
		for (const keyword of JSON_SCHEMA_ROOT_METADATA_KEYWORDS) if (keyword in jsonSchema) merged[keyword] = jsonSchema[keyword];
	}
	const mergedProperties = Object.create(null);
	const mergedRequired = /* @__PURE__ */ new Set();
	const closedPropertySets = [];
	const propertyEntries = [];
	let sawProperties = false;
	let sawRequired = false;
	let hasExplicitObjectType = false;
	let hasExplicitNullableObjectType = false;
	const mergeAnnotations = (schema) => {
		for (const keyword of JSON_SCHEMA_ANNOTATION_KEYWORDS) {
			if (!(keyword in schema)) continue;
			if (!(keyword in merged)) merged[keyword] = schema[keyword];
		}
	};
	mergeAnnotations(jsonSchema);
	for (const resolvedEntry of resolvedEntries) {
		if (resolvedEntry === void 0) continue;
		for (const entry of resolvedEntry.refChain) mergeAnnotations(entry);
	}
	for (const { schema: branch, sourcePath } of branches) {
		for (const keyword of Object.keys(branch)) {
			if (keyword === "allOf" && branch === jsonSchema) continue;
			if ((keyword === "$defs" || keyword === "definitions") && isObject(branch[keyword])) continue;
			if (branch === jsonSchema && path.length === 0 && JSON_SCHEMA_ROOT_METADATA_KEYWORDS.has(keyword)) continue;
			if (!MERGEABLE_OBJECT_ALL_OF_KEYWORDS.has(keyword)) fail();
		}
		if (branch.type !== void 0) {
			if (!isMergeableObjectType(branch.type)) fail();
			if (branch.type === "object") hasExplicitObjectType = true;
			else hasExplicitNullableObjectType = true;
		}
		if (branch.properties !== void 0) {
			if (!isObject(branch.properties)) fail();
			sawProperties = true;
			for (const [key, propertySchema] of Object.entries(branch.properties)) propertyEntries.push({
				key,
				propertySchema,
				sourcePath: sourcePath === void 0 ? void 0 : [
					...sourcePath,
					"properties",
					key
				]
			});
		}
		if (branch.required !== void 0) {
			if (!Array.isArray(branch.required) || branch.required.some((key) => typeof key !== "string")) fail();
			sawRequired = true;
			for (const key of branch.required) mergedRequired.add(key);
		}
		if ("additionalProperties" in branch) {
			if (branch.additionalProperties !== false) fail();
			closedPropertySets.push(new Set(Object.keys(branch.properties ?? {})));
		}
	}
	const allowedClosedProperties = closedPropertySets.length === 0 ? void 0 : closedPropertySets.slice(1).reduce((allowed, keys) => new Set([...allowed].filter((key) => keys.has(key))), new Set(closedPropertySets[0]));
	const excludesRequiredProperty = allowedClosedProperties !== void 0 && [...mergedRequired].some((key) => !allowedClosedProperties.has(key));
	const collapsesToNull = excludesRequiredProperty && !hasExplicitObjectType && hasExplicitNullableObjectType;
	preserveDiscardedAllOfPropertyRefTargets(root, propertyEntries.filter(({ key, sourcePath }) => sourcePath !== void 0 && (collapsesToNull || allowedClosedProperties !== void 0 && !allowedClosedProperties.has(key))).map(({ sourcePath }) => sourcePath));
	if (jsonSchema === root && root.$defs !== void 0) merged.$defs = root.$defs;
	if (excludesRequiredProperty) {
		if (collapsesToNull) {
			merged.type = "null";
			for (const keyword of Object.keys(jsonSchema)) delete jsonSchema[keyword];
			Object.assign(jsonSchema, merged);
			return true;
		}
		fail();
	}
	for (const { key, propertySchema } of propertyEntries) {
		if (allowedClosedProperties !== void 0 && !allowedClosedProperties.has(key)) continue;
		if (Object.prototype.hasOwnProperty.call(mergedProperties, key) && !schemasEqual(mergedProperties[key], propertySchema)) fail();
		mergedProperties[key] = propertySchema;
	}
	if (hasExplicitObjectType || hasExplicitNullableObjectType) merged.type = hasExplicitObjectType ? "object" : ["object", "null"];
	if (sawProperties) merged.properties = Object.fromEntries(Object.entries(mergedProperties));
	if (sawRequired) merged.required = [...mergedRequired];
	if (closedPropertySets.length > 0) merged.additionalProperties = false;
	for (const keyword of Object.keys(jsonSchema)) delete jsonSchema[keyword];
	Object.assign(jsonSchema, merged);
	return true;
}
function hasObjectShapeWithoutAllOf(schema) {
	if (schema.type !== void 0) return isMergeableObjectType(schema.type);
	return Object.keys(schema).some((keyword) => JSON_SCHEMA_OBJECT_KEYWORDS.has(keyword));
}
function hasOnlyNeutralAllOfBranchKeywords(schema) {
	const schemaRecord = schema;
	return Object.keys(schema).every((keyword) => JSON_SCHEMA_ANNOTATION_KEYWORDS.has(keyword) || (keyword === "$defs" || keyword === "definitions") && isObject(schemaRecord[keyword]));
}
function isMergeableObjectType(type) {
	return type === "object" || Array.isArray(type) && type.length === 2 && type.includes("object") && type.includes("null");
}
function schemasEqual(left, right) {
	if (left === right) return true;
	if (Array.isArray(left) || Array.isArray(right)) {
		if (!Array.isArray(left) || !Array.isArray(right) || left.length !== right.length) return false;
		return left.every((value, index) => schemasEqual(value, right[index]));
	}
	if (typeof left !== "object" || left === null || typeof right !== "object" || right === null) return false;
	const leftRecord = left;
	const rightRecord = right;
	const leftKeys = Object.keys(leftRecord).sort();
	const rightKeys = Object.keys(rightRecord).sort();
	if (leftKeys.length !== rightKeys.length) return false;
	return leftKeys.every((key, index) => key === rightKeys[index] && schemasEqual(leftRecord[key], rightRecord[key]));
}
//#endregion
//#region node_modules/openai/helpers/zod.mjs
function encodeSchemaDefinitionRefToken(token) {
	return encodeURIComponent(token.replace(/~/g, "~0").replace(/\//g, "~1"));
}
function validateSchemaDefinitions(schemaDefinitions) {
	if (schemaDefinitions && Object.prototype.hasOwnProperty.call(schemaDefinitions, "__proto__")) throw new Error("schemaDefinitions cannot include \"__proto__\" as a definition name");
}
function escapeSchemaDefinitionRefs(schema, schemaDefinitions) {
	const refReplacements = new Map(Object.keys(schemaDefinitions ?? {}).map((name) => [`#/definitions/${name}`, `#/definitions/${encodeSchemaDefinitionRefToken(name)}`]));
	const visit = (value) => {
		if (!value || typeof value !== "object") return;
		if (Array.isArray(value)) {
			for (const child of value) visit(child);
			return;
		}
		const record = value;
		const ref = record["$ref"];
		if (typeof ref === "string") record["$ref"] = refReplacements.get(ref) ?? ref;
		for (const child of Object.values(record)) visit(child);
	};
	visit(schema);
	return schema;
}
function getZodV3RootName(name, schemaDefinitions) {
	let rootName = name;
	while (schemaDefinitions && Object.prototype.hasOwnProperty.call(schemaDefinitions, rootName)) rootName = `${rootName}_root`;
	return rootName;
}
function zodV3ToJsonSchema(schema, options) {
	return escapeSchemaDefinitionRefs(zodToJsonSchema(schema, {
		openaiStrictMode: true,
		name: getZodV3RootName(options.name, options.schemaDefinitions),
		nameStrategy: "duplicate-ref",
		$refStrategy: "extract-to-root",
		nullableStrategy: "property",
		...options.schemaDefinitions ? { definitions: options.schemaDefinitions } : void 0
	}), options.schemaDefinitions);
}
function zodV4ToJsonSchema(schema, options = {}) {
	const metadata = options.schemaDefinitions ? registry() : void 0;
	for (const [name, definition] of Object.entries(options.schemaDefinitions ?? {})) metadata?.add(definition, { id: name });
	return toStrictJsonSchema(escapeSchemaDefinitionRefs(toJSONSchema(schema, {
		target: "draft-7",
		...metadata ? { metadata } : void 0,
		override: ({ zodSchema, jsonSchema }) => {
			const def = zodSchema._zod.def;
			if (def.type === "union" && "discriminator" in def && Array.isArray(jsonSchema.oneOf)) {
				if (jsonSchema.anyOf !== void 0) throw new Error("Zod discriminated union generated both `anyOf` and `oneOf`, which cannot be represented in an OpenAI strict schema");
				jsonSchema.anyOf = jsonSchema.oneOf;
				delete jsonSchema.oneOf;
			}
		}
	}), options.schemaDefinitions));
}
function isZodV4(zodObject) {
	return "_zod" in zodObject;
}
function parseZodObject(zodObject, content) {
	const parsed = JSON.parse(content);
	const parser = zodObject.parse;
	if (typeof parser === "function") return parser.call(zodObject, parsed);
	return parse(zodObject, parsed);
}
/**
* Creates a chat completion `JSONSchema` response format object from
* the given Zod schema.
*
* If this is passed to the `.parse()`, `.stream()` or `.runTools()`
* chat completion methods then the response message will contain a
* `.parsed` property that is the result of parsing the content with
* the given Zod object.
*
* ```ts
* const completion = await client.chat.completions.parse({
*    model: 'gpt-4o-2024-08-06',
*    messages: [
*      { role: 'system', content: 'You are a helpful math tutor.' },
*      { role: 'user', content: 'solve 8x + 31 = 2' },
*    ],
*    response_format: zodResponseFormat(
*      z.object({
*        steps: z.array(z.object({
*          explanation: z.string(),
*          answer: z.string(),
*        })),
*        final_answer: z.string(),
*      }),
*      'math_answer',
*    ),
*  });
*  const message = completion.choices[0]?.message;
*  if (message?.parsed) {
*    console.log(message.parsed);
*    console.log(message.parsed.final_answer);
* }
* ```
*
* This can be passed directly to the `.create()` method but will not
* result in any automatic parsing, you'll have to parse the response yourself.
*/
function zodResponseFormat(zodObject, name, props) {
	const zodSchema = zodObject;
	const { schemaDefinitions, ...responseFormatProps } = props ?? {};
	validateSchemaDefinitions(schemaDefinitions);
	return makeParseableResponseFormat$1({
		type: "json_schema",
		json_schema: {
			...responseFormatProps,
			name,
			strict: true,
			schema: isZodV4(zodSchema) ? zodV4ToJsonSchema(zodSchema, { schemaDefinitions }) : zodV3ToJsonSchema(zodSchema, {
				name,
				schemaDefinitions
			})
		}
	}, (content) => parseZodObject(zodObject, content));
}
//#endregion
//#region node_modules/@langchain/openai/dist/utils/output.js
var SUPPORTED_METHODS = [
	"jsonSchema",
	"functionCalling",
	"jsonMode"
];
/**
* Get the structured output method for a given model. By default, it uses
* `jsonSchema` if the model supports it, otherwise it uses `functionCalling`.
*
* @throws if the method is invalid, e.g. is not a string or invalid method is provided.
* @param model - The model name.
* @param config - The structured output method options.
* @returns The structured output method.
*/
function getStructuredOutputMethod(model, method) {
	/**
	* If a method is provided, validate it.
	*/
	if (typeof method !== "undefined" && !SUPPORTED_METHODS.includes(method)) throw new Error(`Invalid method: ${method}. Supported methods are: ${SUPPORTED_METHODS.join(", ")}`);
	const hasSupportForJsonSchema = !model.startsWith("gpt-3") && !model.startsWith("gpt-4-") && model !== "gpt-4";
	/**
	* If the model supports JSON Schema, use it by default.
	*/
	if (hasSupportForJsonSchema && !method) return "jsonSchema";
	if (!hasSupportForJsonSchema && method === "jsonSchema") throw new Error(`JSON Schema is not supported for model "${model}". Please use a different method, e.g. "functionCalling" or "jsonMode".`);
	/**
	* If the model does not support JSON Schema, use function calling by default.
	*/
	return method ?? "functionCalling";
}
function makeParseableResponseFormat(response_format, parser) {
	const obj = { ...response_format };
	Object.defineProperties(obj, {
		$brand: {
			value: "auto-parseable-response-format",
			enumerable: false
		},
		$parseRaw: {
			value: parser,
			enumerable: false
		}
	});
	return obj;
}
function interopZodResponseFormat(zodSchema, name, props) {
	if (isZodSchemaV3(zodSchema)) return zodResponseFormat(zodSchema, name, props);
	if (isZodSchemaV4(zodSchema)) return makeParseableResponseFormat({
		type: "json_schema",
		json_schema: {
			...props,
			name,
			strict: true,
			schema: toJsonSchema(zodSchema, {
				cycles: "ref",
				reused: "ref",
				override(ctx) {
					ctx.jsonSchema.title = name;
				}
			})
		}
	}, (content) => parse$1(zodSchema, JSON.parse(content)));
	throw new Error("Unsupported schema response format");
}
/**
* Handle multi modal response content.
*
* @param content The content of the message.
* @param messages The messages of the response.
* @returns The new content of the message.
*/
function handleMultiModalOutput(content, messages) {
	/**
	* Handle OpenRouter image responses
	* @see https://openrouter.ai/docs/features/multimodal/image-generation#api-usage
	*/
	if (messages && typeof messages === "object" && "images" in messages && Array.isArray(messages.images)) {
		const images = messages.images.filter((image) => typeof image?.image_url?.url === "string").map((image) => ({
			type: "image",
			url: image.image_url.url
		}));
		return [{
			type: "text",
			text: content
		}, ...images];
	}
	return content;
}
//#endregion
//#region node_modules/@langchain/openai/dist/chat_models/profiles.js
var PROFILES = {
	"gpt-4o-2024-11-20": {
		maxInputTokens: 128e3,
		imageInputs: true,
		audioInputs: false,
		pdfInputs: true,
		videoInputs: false,
		maxOutputTokens: 16384,
		reasoningOutput: false,
		imageOutputs: false,
		audioOutputs: false,
		videoOutputs: false,
		toolCalling: true,
		structuredOutput: true,
		imageUrlInputs: true,
		pdfToolMessage: true,
		imageToolMessage: true,
		toolChoice: true
	},
	"gpt-5.3-codex": {
		maxInputTokens: 4e5,
		imageInputs: true,
		audioInputs: false,
		pdfInputs: true,
		videoInputs: false,
		maxOutputTokens: 128e3,
		reasoningOutput: true,
		imageOutputs: false,
		audioOutputs: false,
		videoOutputs: false,
		toolCalling: true,
		structuredOutput: true,
		imageUrlInputs: true,
		pdfToolMessage: true,
		imageToolMessage: true,
		toolChoice: true
	},
	"gpt-5-codex": {
		maxInputTokens: 4e5,
		imageInputs: true,
		audioInputs: false,
		pdfInputs: true,
		videoInputs: false,
		maxOutputTokens: 128e3,
		reasoningOutput: true,
		imageOutputs: false,
		audioOutputs: false,
		videoOutputs: false,
		toolCalling: true,
		structuredOutput: true,
		imageUrlInputs: true,
		pdfToolMessage: true,
		imageToolMessage: true,
		toolChoice: true
	},
	"gpt-5-pro": {
		maxInputTokens: 4e5,
		imageInputs: true,
		audioInputs: false,
		pdfInputs: true,
		videoInputs: false,
		maxOutputTokens: 272e3,
		reasoningOutput: true,
		imageOutputs: false,
		audioOutputs: false,
		videoOutputs: false,
		toolCalling: true,
		structuredOutput: true,
		imageUrlInputs: true,
		pdfToolMessage: true,
		imageToolMessage: true,
		toolChoice: true
	},
	"gpt-4o-mini": {
		maxInputTokens: 128e3,
		imageInputs: true,
		audioInputs: false,
		pdfInputs: true,
		videoInputs: false,
		maxOutputTokens: 16384,
		reasoningOutput: false,
		imageOutputs: false,
		audioOutputs: false,
		videoOutputs: false,
		toolCalling: true,
		structuredOutput: true,
		imageUrlInputs: true,
		pdfToolMessage: true,
		imageToolMessage: true,
		toolChoice: true
	},
	"text-embedding-ada-002": {
		maxInputTokens: 8192,
		imageInputs: false,
		audioInputs: false,
		pdfInputs: true,
		videoInputs: false,
		maxOutputTokens: 1536,
		reasoningOutput: false,
		imageOutputs: false,
		audioOutputs: false,
		videoOutputs: false,
		toolCalling: false,
		structuredOutput: true,
		imageUrlInputs: true,
		pdfToolMessage: true,
		imageToolMessage: true,
		toolChoice: true
	},
	"gpt-5-chat-latest": {
		maxInputTokens: 4e5,
		imageInputs: true,
		audioInputs: false,
		pdfInputs: true,
		videoInputs: false,
		maxOutputTokens: 128e3,
		reasoningOutput: true,
		imageOutputs: false,
		audioOutputs: false,
		videoOutputs: false,
		toolCalling: false,
		structuredOutput: true,
		imageUrlInputs: true,
		pdfToolMessage: true,
		imageToolMessage: true,
		toolChoice: true
	},
	"codex-mini-latest": {
		maxInputTokens: 2e5,
		imageInputs: false,
		audioInputs: false,
		pdfInputs: true,
		videoInputs: false,
		maxOutputTokens: 1e5,
		reasoningOutput: true,
		imageOutputs: false,
		audioOutputs: false,
		videoOutputs: false,
		toolCalling: true,
		structuredOutput: true,
		imageUrlInputs: true,
		pdfToolMessage: true,
		imageToolMessage: true,
		toolChoice: true
	},
	"gpt-5.1-codex-max": {
		maxInputTokens: 4e5,
		imageInputs: true,
		audioInputs: false,
		pdfInputs: true,
		videoInputs: false,
		maxOutputTokens: 128e3,
		reasoningOutput: true,
		imageOutputs: false,
		audioOutputs: false,
		videoOutputs: false,
		toolCalling: true,
		structuredOutput: true,
		imageUrlInputs: true,
		pdfToolMessage: true,
		imageToolMessage: true,
		toolChoice: true
	},
	"gpt-4o-2024-05-13": {
		maxInputTokens: 128e3,
		imageInputs: true,
		audioInputs: false,
		pdfInputs: true,
		videoInputs: false,
		maxOutputTokens: 4096,
		reasoningOutput: false,
		imageOutputs: false,
		audioOutputs: false,
		videoOutputs: false,
		toolCalling: true,
		structuredOutput: true,
		imageUrlInputs: true,
		pdfToolMessage: true,
		imageToolMessage: true,
		toolChoice: true
	},
	"gpt-5.2-chat-latest": {
		maxInputTokens: 128e3,
		imageInputs: true,
		audioInputs: false,
		pdfInputs: true,
		videoInputs: false,
		maxOutputTokens: 16384,
		reasoningOutput: true,
		imageOutputs: false,
		audioOutputs: false,
		videoOutputs: false,
		toolCalling: true,
		structuredOutput: true,
		imageUrlInputs: true,
		pdfToolMessage: true,
		imageToolMessage: true,
		toolChoice: true
	},
	"gpt-5.2-codex": {
		maxInputTokens: 4e5,
		imageInputs: true,
		audioInputs: false,
		pdfInputs: true,
		videoInputs: false,
		maxOutputTokens: 128e3,
		reasoningOutput: true,
		imageOutputs: false,
		audioOutputs: false,
		videoOutputs: false,
		toolCalling: true,
		structuredOutput: true,
		imageUrlInputs: true,
		pdfToolMessage: true,
		imageToolMessage: true,
		toolChoice: true
	},
	"o3-deep-research": {
		maxInputTokens: 2e5,
		imageInputs: true,
		audioInputs: false,
		pdfInputs: true,
		videoInputs: false,
		maxOutputTokens: 1e5,
		reasoningOutput: true,
		imageOutputs: false,
		audioOutputs: false,
		videoOutputs: false,
		toolCalling: true,
		structuredOutput: true,
		imageUrlInputs: true,
		pdfToolMessage: true,
		imageToolMessage: true,
		toolChoice: true
	},
	o1: {
		maxInputTokens: 2e5,
		imageInputs: true,
		audioInputs: false,
		pdfInputs: true,
		videoInputs: false,
		maxOutputTokens: 1e5,
		reasoningOutput: true,
		imageOutputs: false,
		audioOutputs: false,
		videoOutputs: false,
		toolCalling: true,
		structuredOutput: true,
		imageUrlInputs: true,
		pdfToolMessage: true,
		imageToolMessage: true,
		toolChoice: true
	},
	"gpt-5.1": {
		maxInputTokens: 4e5,
		imageInputs: true,
		audioInputs: false,
		pdfInputs: true,
		videoInputs: false,
		maxOutputTokens: 128e3,
		reasoningOutput: true,
		imageOutputs: false,
		audioOutputs: false,
		videoOutputs: false,
		toolCalling: true,
		structuredOutput: true,
		imageUrlInputs: true,
		pdfToolMessage: true,
		imageToolMessage: true,
		toolChoice: true
	},
	"o4-mini-deep-research": {
		maxInputTokens: 2e5,
		imageInputs: true,
		audioInputs: false,
		pdfInputs: true,
		videoInputs: false,
		maxOutputTokens: 1e5,
		reasoningOutput: true,
		imageOutputs: false,
		audioOutputs: false,
		videoOutputs: false,
		toolCalling: true,
		structuredOutput: true,
		imageUrlInputs: true,
		pdfToolMessage: true,
		imageToolMessage: true,
		toolChoice: true
	},
	"gpt-5.3-codex-spark": {
		maxInputTokens: 128e3,
		imageInputs: true,
		audioInputs: false,
		pdfInputs: true,
		videoInputs: false,
		maxOutputTokens: 32e3,
		reasoningOutput: true,
		imageOutputs: false,
		audioOutputs: false,
		videoOutputs: false,
		toolCalling: true,
		structuredOutput: true,
		imageUrlInputs: true,
		pdfToolMessage: true,
		imageToolMessage: true,
		toolChoice: true
	},
	o3: {
		maxInputTokens: 2e5,
		imageInputs: true,
		audioInputs: false,
		pdfInputs: true,
		videoInputs: false,
		maxOutputTokens: 1e5,
		reasoningOutput: true,
		imageOutputs: false,
		audioOutputs: false,
		videoOutputs: false,
		toolCalling: true,
		structuredOutput: true,
		imageUrlInputs: true,
		pdfToolMessage: true,
		imageToolMessage: true,
		toolChoice: true
	},
	"text-embedding-3-small": {
		maxInputTokens: 8191,
		imageInputs: false,
		audioInputs: false,
		pdfInputs: true,
		videoInputs: false,
		maxOutputTokens: 1536,
		reasoningOutput: false,
		imageOutputs: false,
		audioOutputs: false,
		videoOutputs: false,
		toolCalling: false,
		structuredOutput: true,
		imageUrlInputs: true,
		pdfToolMessage: true,
		imageToolMessage: true,
		toolChoice: true
	},
	"gpt-4.1-nano": {
		maxInputTokens: 1047576,
		imageInputs: true,
		audioInputs: false,
		pdfInputs: true,
		videoInputs: false,
		maxOutputTokens: 32768,
		reasoningOutput: false,
		imageOutputs: false,
		audioOutputs: false,
		videoOutputs: false,
		toolCalling: true,
		structuredOutput: true,
		imageUrlInputs: true,
		pdfToolMessage: true,
		imageToolMessage: true,
		toolChoice: true
	},
	"text-embedding-3-large": {
		maxInputTokens: 8191,
		imageInputs: false,
		audioInputs: false,
		pdfInputs: true,
		videoInputs: false,
		maxOutputTokens: 3072,
		reasoningOutput: false,
		imageOutputs: false,
		audioOutputs: false,
		videoOutputs: false,
		toolCalling: false,
		structuredOutput: true,
		imageUrlInputs: true,
		pdfToolMessage: true,
		imageToolMessage: true,
		toolChoice: true
	},
	"gpt-3.5-turbo": {
		maxInputTokens: 16385,
		imageInputs: false,
		audioInputs: false,
		pdfInputs: false,
		videoInputs: false,
		maxOutputTokens: 4096,
		reasoningOutput: false,
		imageOutputs: false,
		audioOutputs: false,
		videoOutputs: false,
		toolCalling: false,
		structuredOutput: false,
		imageUrlInputs: false,
		pdfToolMessage: false,
		imageToolMessage: false,
		toolChoice: true
	},
	"gpt-5.1-codex-mini": {
		maxInputTokens: 4e5,
		imageInputs: true,
		audioInputs: false,
		pdfInputs: true,
		videoInputs: false,
		maxOutputTokens: 128e3,
		reasoningOutput: true,
		imageOutputs: false,
		audioOutputs: false,
		videoOutputs: false,
		toolCalling: true,
		structuredOutput: true,
		imageUrlInputs: true,
		pdfToolMessage: true,
		imageToolMessage: true,
		toolChoice: true
	},
	"gpt-5.2": {
		maxInputTokens: 4e5,
		imageInputs: true,
		audioInputs: false,
		pdfInputs: true,
		videoInputs: false,
		maxOutputTokens: 128e3,
		reasoningOutput: true,
		imageOutputs: false,
		audioOutputs: false,
		videoOutputs: false,
		toolCalling: true,
		structuredOutput: true,
		imageUrlInputs: true,
		pdfToolMessage: true,
		imageToolMessage: true,
		toolChoice: true
	},
	"gpt-4.1": {
		maxInputTokens: 1047576,
		imageInputs: true,
		audioInputs: false,
		pdfInputs: true,
		videoInputs: false,
		maxOutputTokens: 32768,
		reasoningOutput: false,
		imageOutputs: false,
		audioOutputs: false,
		videoOutputs: false,
		toolCalling: true,
		structuredOutput: true,
		imageUrlInputs: true,
		pdfToolMessage: true,
		imageToolMessage: true,
		toolChoice: true
	},
	"o3-pro": {
		maxInputTokens: 2e5,
		imageInputs: true,
		audioInputs: false,
		pdfInputs: true,
		videoInputs: false,
		maxOutputTokens: 1e5,
		reasoningOutput: true,
		imageOutputs: false,
		audioOutputs: false,
		videoOutputs: false,
		toolCalling: true,
		structuredOutput: true,
		imageUrlInputs: true,
		pdfToolMessage: true,
		imageToolMessage: true,
		toolChoice: true
	},
	"gpt-4-turbo": {
		maxInputTokens: 128e3,
		imageInputs: true,
		audioInputs: false,
		pdfInputs: true,
		videoInputs: false,
		maxOutputTokens: 4096,
		reasoningOutput: false,
		imageOutputs: false,
		audioOutputs: false,
		videoOutputs: false,
		toolCalling: true,
		structuredOutput: true,
		imageUrlInputs: true,
		pdfToolMessage: true,
		imageToolMessage: true,
		toolChoice: true
	},
	"gpt-5": {
		maxInputTokens: 4e5,
		imageInputs: true,
		audioInputs: false,
		pdfInputs: true,
		videoInputs: false,
		maxOutputTokens: 128e3,
		reasoningOutput: true,
		imageOutputs: false,
		audioOutputs: false,
		videoOutputs: false,
		toolCalling: true,
		structuredOutput: true,
		imageUrlInputs: true,
		pdfToolMessage: true,
		imageToolMessage: true,
		toolChoice: true
	},
	"o4-mini": {
		maxInputTokens: 2e5,
		imageInputs: true,
		audioInputs: false,
		pdfInputs: true,
		videoInputs: false,
		maxOutputTokens: 1e5,
		reasoningOutput: true,
		imageOutputs: false,
		audioOutputs: false,
		videoOutputs: false,
		toolCalling: true,
		structuredOutput: true,
		imageUrlInputs: true,
		pdfToolMessage: true,
		imageToolMessage: true,
		toolChoice: true
	},
	"gpt-4.1-mini": {
		maxInputTokens: 1047576,
		imageInputs: true,
		audioInputs: false,
		pdfInputs: true,
		videoInputs: false,
		maxOutputTokens: 32768,
		reasoningOutput: false,
		imageOutputs: false,
		audioOutputs: false,
		videoOutputs: false,
		toolCalling: true,
		structuredOutput: true,
		imageUrlInputs: true,
		pdfToolMessage: true,
		imageToolMessage: true,
		toolChoice: true
	},
	"gpt-5.4": {
		maxInputTokens: 105e4,
		imageInputs: true,
		audioInputs: false,
		pdfInputs: true,
		videoInputs: false,
		maxOutputTokens: 128e3,
		reasoningOutput: true,
		imageOutputs: false,
		audioOutputs: false,
		videoOutputs: false,
		toolCalling: true,
		structuredOutput: true,
		imageUrlInputs: true,
		pdfToolMessage: true,
		imageToolMessage: true,
		toolChoice: true
	},
	"o1-preview": {
		maxInputTokens: 128e3,
		imageInputs: false,
		audioInputs: false,
		pdfInputs: true,
		videoInputs: false,
		maxOutputTokens: 32768,
		reasoningOutput: true,
		imageOutputs: false,
		audioOutputs: false,
		videoOutputs: false,
		toolCalling: false,
		structuredOutput: true,
		imageUrlInputs: true,
		pdfToolMessage: true,
		imageToolMessage: true,
		toolChoice: true
	},
	"gpt-5.4-pro": {
		maxInputTokens: 105e4,
		imageInputs: true,
		audioInputs: false,
		pdfInputs: true,
		videoInputs: false,
		maxOutputTokens: 128e3,
		reasoningOutput: true,
		imageOutputs: false,
		audioOutputs: false,
		videoOutputs: false,
		toolCalling: true,
		structuredOutput: true,
		imageUrlInputs: true,
		pdfToolMessage: true,
		imageToolMessage: true,
		toolChoice: true
	},
	"gpt-5.5": {
		maxInputTokens: 105e4,
		imageInputs: true,
		audioInputs: false,
		pdfInputs: true,
		videoInputs: false,
		maxOutputTokens: 13e4,
		reasoningOutput: true,
		imageOutputs: false,
		audioOutputs: false,
		videoOutputs: false,
		toolCalling: true,
		structuredOutput: true,
		imageUrlInputs: true,
		pdfToolMessage: true,
		imageToolMessage: true,
		toolChoice: true
	},
	"gpt-5.5-pro": {
		maxInputTokens: 105e4,
		imageInputs: true,
		audioInputs: false,
		pdfInputs: true,
		videoInputs: false,
		maxOutputTokens: 128e3,
		reasoningOutput: true,
		imageOutputs: false,
		audioOutputs: false,
		videoOutputs: false,
		toolCalling: true,
		structuredOutput: true,
		imageUrlInputs: true,
		pdfToolMessage: true,
		imageToolMessage: true,
		toolChoice: true
	},
	"o1-pro": {
		maxInputTokens: 2e5,
		imageInputs: true,
		audioInputs: false,
		pdfInputs: true,
		videoInputs: false,
		maxOutputTokens: 1e5,
		reasoningOutput: true,
		imageOutputs: false,
		audioOutputs: false,
		videoOutputs: false,
		toolCalling: true,
		structuredOutput: true,
		imageUrlInputs: true,
		pdfToolMessage: true,
		imageToolMessage: true,
		toolChoice: true
	},
	"gpt-5.1-codex": {
		maxInputTokens: 4e5,
		imageInputs: true,
		audioInputs: false,
		pdfInputs: true,
		videoInputs: false,
		maxOutputTokens: 128e3,
		reasoningOutput: true,
		imageOutputs: false,
		audioOutputs: false,
		videoOutputs: false,
		toolCalling: true,
		structuredOutput: true,
		imageUrlInputs: true,
		pdfToolMessage: true,
		imageToolMessage: true,
		toolChoice: true
	},
	"gpt-5.2-pro": {
		maxInputTokens: 4e5,
		imageInputs: true,
		audioInputs: false,
		pdfInputs: true,
		videoInputs: false,
		maxOutputTokens: 128e3,
		reasoningOutput: true,
		imageOutputs: false,
		audioOutputs: false,
		videoOutputs: false,
		toolCalling: true,
		structuredOutput: true,
		imageUrlInputs: true,
		pdfToolMessage: true,
		imageToolMessage: true,
		toolChoice: true
	},
	"o3-mini": {
		maxInputTokens: 2e5,
		imageInputs: false,
		audioInputs: false,
		pdfInputs: true,
		videoInputs: false,
		maxOutputTokens: 1e5,
		reasoningOutput: true,
		imageOutputs: false,
		audioOutputs: false,
		videoOutputs: false,
		toolCalling: true,
		structuredOutput: true,
		imageUrlInputs: true,
		pdfToolMessage: true,
		imageToolMessage: true,
		toolChoice: true
	},
	"gpt-4o-2024-08-06": {
		maxInputTokens: 128e3,
		imageInputs: true,
		audioInputs: false,
		pdfInputs: true,
		videoInputs: false,
		maxOutputTokens: 16384,
		reasoningOutput: false,
		imageOutputs: false,
		audioOutputs: false,
		videoOutputs: false,
		toolCalling: true,
		structuredOutput: true,
		imageUrlInputs: true,
		pdfToolMessage: true,
		imageToolMessage: true,
		toolChoice: true
	},
	"gpt-5-mini": {
		maxInputTokens: 4e5,
		imageInputs: true,
		audioInputs: false,
		pdfInputs: true,
		videoInputs: false,
		maxOutputTokens: 128e3,
		reasoningOutput: true,
		imageOutputs: false,
		audioOutputs: false,
		videoOutputs: false,
		toolCalling: true,
		structuredOutput: true,
		imageUrlInputs: true,
		pdfToolMessage: true,
		imageToolMessage: true,
		toolChoice: true
	},
	"gpt-5.1-chat-latest": {
		maxInputTokens: 128e3,
		imageInputs: true,
		audioInputs: false,
		pdfInputs: true,
		videoInputs: false,
		maxOutputTokens: 16384,
		reasoningOutput: true,
		imageOutputs: false,
		audioOutputs: false,
		videoOutputs: false,
		toolCalling: true,
		structuredOutput: true,
		imageUrlInputs: true,
		pdfToolMessage: true,
		imageToolMessage: true,
		toolChoice: true
	},
	"gpt-4": {
		maxInputTokens: 8192,
		imageInputs: false,
		audioInputs: false,
		pdfInputs: true,
		videoInputs: false,
		maxOutputTokens: 8192,
		reasoningOutput: false,
		imageOutputs: false,
		audioOutputs: false,
		videoOutputs: false,
		toolCalling: true,
		structuredOutput: true,
		imageUrlInputs: true,
		pdfToolMessage: true,
		imageToolMessage: true,
		toolChoice: true
	},
	"gpt-5-nano": {
		maxInputTokens: 4e5,
		imageInputs: true,
		audioInputs: false,
		pdfInputs: true,
		videoInputs: false,
		maxOutputTokens: 128e3,
		reasoningOutput: true,
		imageOutputs: false,
		audioOutputs: false,
		videoOutputs: false,
		toolCalling: true,
		structuredOutput: true,
		imageUrlInputs: true,
		pdfToolMessage: true,
		imageToolMessage: true,
		toolChoice: true
	},
	"o1-mini": {
		maxInputTokens: 128e3,
		imageInputs: false,
		audioInputs: false,
		pdfInputs: true,
		videoInputs: false,
		maxOutputTokens: 65536,
		reasoningOutput: true,
		imageOutputs: false,
		audioOutputs: false,
		videoOutputs: false,
		toolCalling: false,
		structuredOutput: true,
		imageUrlInputs: true,
		pdfToolMessage: true,
		imageToolMessage: true,
		toolChoice: true
	},
	"gpt-4o": {
		maxInputTokens: 128e3,
		imageInputs: true,
		audioInputs: false,
		pdfInputs: true,
		videoInputs: false,
		maxOutputTokens: 16384,
		reasoningOutput: false,
		imageOutputs: false,
		audioOutputs: false,
		videoOutputs: false,
		toolCalling: true,
		structuredOutput: true,
		imageUrlInputs: true,
		pdfToolMessage: true,
		imageToolMessage: true,
		toolChoice: true
	}
};
//#endregion
//#region node_modules/@langchain/openai/dist/chat_models/base.js
function getChatOpenAIModelParams(modelOrParams, paramsArg) {
	if (typeof modelOrParams === "string") return {
		model: modelOrParams,
		...paramsArg ?? {}
	};
	if (modelOrParams == null) return paramsArg;
	return modelOrParams;
}
/** @internal */
var BaseChatOpenAI = class extends BaseChatModel {
	temperature;
	topP;
	frequencyPenalty;
	presencePenalty;
	n;
	logitBias;
	model = "gpt-3.5-turbo";
	modelKwargs;
	stop;
	stopSequences;
	user;
	timeout;
	streaming = false;
	streamUsage = true;
	maxTokens;
	logprobs;
	topLogprobs;
	apiKey;
	organization;
	__includeRawResponse;
	/** @internal */
	client;
	/** @internal */
	clientConfig;
	/**
	* Whether the model supports the `strict` argument when passing in tools.
	* If `undefined` the `strict` argument will not be passed to OpenAI.
	*/
	supportsStrictToolCalling;
	audio;
	modalities;
	reasoning;
	/**
	* Must be set to `true` in tenancies with Zero Data Retention. Setting to `true` will disable
	* output storage in the Responses API, but this DOES NOT enable Zero Data Retention in your
	* OpenAI organization or project. This must be configured directly with OpenAI.
	*
	* See:
	* https://platform.openai.com/docs/guides/your-data
	* https://platform.openai.com/docs/api-reference/responses/create#responses-create-store
	*
	* @default false
	*/
	zdrEnabled;
	/**
	* Service tier to use for this request. Can be "auto", "default", or "flex" or "priority".
	* Specifies the service tier for prioritization and latency optimization.
	*/
	service_tier;
	/**
	* Used by OpenAI to cache responses for similar requests to optimize your cache
	* hit rates.
	* [Learn more](https://platform.openai.com/docs/guides/prompt-caching).
	*/
	promptCacheKey;
	/**
	* Used by OpenAI to set cache retention time
	*/
	promptCacheRetention;
	/**
	* The verbosity of the model's response.
	*/
	verbosity;
	defaultOptions;
	_llmType() {
		return "openai";
	}
	static lc_name() {
		return "ChatOpenAI";
	}
	get callKeys() {
		return [
			...super.callKeys,
			"options",
			"function_call",
			"functions",
			"tools",
			"tool_choice",
			"promptIndex",
			"response_format",
			"seed",
			"reasoning",
			"reasoning_effort",
			"service_tier"
		];
	}
	lc_serializable = true;
	get lc_secrets() {
		return {
			apiKey: "OPENAI_API_KEY",
			organization: "OPENAI_ORGANIZATION"
		};
	}
	get lc_aliases() {
		return {
			apiKey: "openai_api_key",
			modelName: "model"
		};
	}
	get lc_serializable_keys() {
		return [
			"configuration",
			"logprobs",
			"topLogprobs",
			"prefixMessages",
			"supportsStrictToolCalling",
			"modalities",
			"audio",
			"temperature",
			"maxTokens",
			"topP",
			"frequencyPenalty",
			"presencePenalty",
			"n",
			"logitBias",
			"user",
			"streaming",
			"streamUsage",
			"model",
			"modelName",
			"modelKwargs",
			"stop",
			"stopSequences",
			"timeout",
			"apiKey",
			"cache",
			"maxConcurrency",
			"maxRetries",
			"verbose",
			"callbacks",
			"tags",
			"metadata",
			"disableStreaming",
			"zdrEnabled",
			"reasoning",
			"promptCacheKey",
			"promptCacheRetention",
			"verbosity"
		];
	}
	getLsParams(options) {
		const params = this.invocationParams(options);
		return {
			ls_provider: "openai",
			ls_model_name: this.model,
			ls_model_type: "chat",
			ls_temperature: params.temperature ?? void 0,
			ls_max_tokens: params.max_tokens ?? void 0,
			ls_stop: options.stop
		};
	}
	/** @ignore */
	_identifyingParams() {
		return {
			model_name: this.model,
			...this.invocationParams(),
			...this.clientConfig
		};
	}
	/**
	* Get the identifying parameters for the model
	*/
	identifyingParams() {
		return this._identifyingParams();
	}
	constructor(fields) {
		super(fields ?? {});
		const configApiKey = typeof fields?.configuration?.apiKey === "string" || typeof fields?.configuration?.apiKey === "function" ? fields?.configuration?.apiKey : void 0;
		this.apiKey = fields?.apiKey ?? configApiKey ?? getEnvironmentVariable("OPENAI_API_KEY");
		this.organization = fields?.configuration?.organization ?? getEnvironmentVariable("OPENAI_ORGANIZATION");
		this.model = fields?.model ?? fields?.modelName ?? this.model;
		this.modelKwargs = fields?.modelKwargs ?? {};
		this.timeout = fields?.timeout;
		this.temperature = fields?.temperature ?? this.temperature;
		this.topP = fields?.topP ?? this.topP;
		this.frequencyPenalty = fields?.frequencyPenalty ?? this.frequencyPenalty;
		this.presencePenalty = fields?.presencePenalty ?? this.presencePenalty;
		this.logprobs = fields?.logprobs;
		this.topLogprobs = fields?.topLogprobs;
		this.n = fields?.n ?? this.n;
		this.logitBias = fields?.logitBias;
		this.stop = fields?.stopSequences ?? fields?.stop;
		this.stopSequences = this.stop;
		this.user = fields?.user;
		this.__includeRawResponse = fields?.__includeRawResponse;
		this.audio = fields?.audio;
		this.modalities = fields?.modalities;
		this.reasoning = fields?.reasoning;
		this.maxTokens = fields?.maxCompletionTokens ?? fields?.maxTokens;
		this.promptCacheKey = fields?.promptCacheKey ?? this.promptCacheKey;
		this.promptCacheRetention = fields?.promptCacheRetention ?? this.promptCacheRetention;
		this.verbosity = fields?.verbosity ?? this.verbosity;
		this.disableStreaming = fields?.disableStreaming === true;
		this.streaming = fields?.streaming === true;
		if (this.disableStreaming) this.streaming = false;
		if (fields?.streaming === false) this.disableStreaming = true;
		this.streamUsage = fields?.streamUsage ?? this.streamUsage;
		if (this.disableStreaming) this.streamUsage = false;
		this.clientConfig = {
			apiKey: this.apiKey,
			organization: this.organization,
			dangerouslyAllowBrowser: true,
			...fields?.configuration
		};
		if (fields?.supportsStrictToolCalling !== void 0) this.supportsStrictToolCalling = fields.supportsStrictToolCalling;
		if (fields?.service_tier !== void 0) this.service_tier = fields.service_tier;
		this.zdrEnabled = fields?.zdrEnabled ?? false;
		this._addVersion("@langchain/openai", "1.5.5");
	}
	/**
	* Returns backwards compatible reasoning parameters from constructor params and call options
	* @internal
	*/
	_getReasoningParams(options) {
		if (!isReasoningModel(this.model)) return;
		let reasoning;
		if (this.reasoning !== void 0) reasoning = {
			...reasoning,
			...this.reasoning
		};
		if (options?.reasoning !== void 0) reasoning = {
			...reasoning,
			...options.reasoning
		};
		if (options?.reasoningEffort !== void 0 && reasoning?.effort === void 0) reasoning = {
			...reasoning,
			effort: options.reasoningEffort
		};
		return reasoning;
	}
	/**
	* Returns an openai compatible response format from a set of options
	* @internal
	*/
	_getResponseFormat(resFormat) {
		if (resFormat && resFormat.type === "json_schema" && resFormat.json_schema.schema && isInteropZodSchema(resFormat.json_schema.schema)) return interopZodResponseFormat(resFormat.json_schema.schema, resFormat.json_schema.name, { description: resFormat.json_schema.description });
		return resFormat;
	}
	_combineCallOptions(additionalOptions) {
		return {
			...this.defaultOptions,
			...additionalOptions ?? {}
		};
	}
	/** @internal */
	_getClientOptions(options) {
		if (!this.client) {
			const endpoint = getEndpoint({ baseURL: this.clientConfig.baseURL });
			const params = {
				...this.clientConfig,
				baseURL: endpoint,
				timeout: this.timeout,
				maxRetries: 0
			};
			if (!params.baseURL) delete params.baseURL;
			params.defaultHeaders = getHeadersWithUserAgent(params.defaultHeaders);
			this.client = new OpenAI(params);
		}
		return {
			...this.clientConfig,
			...options
		};
	}
	_convertChatOpenAIToolToCompletionsTool(tool, fields) {
		if (isCustomTool(tool)) return convertResponsesCustomTool(tool.metadata.customTool);
		if (isOpenAITool(tool)) {
			if (fields?.strict !== void 0) return {
				...tool,
				function: {
					...tool.function,
					strict: fields.strict
				}
			};
			return tool;
		}
		return _convertToOpenAITool(tool, fields);
	}
	bindTools(tools, kwargs) {
		let strict;
		if (kwargs?.strict !== void 0) strict = kwargs.strict;
		else if (this.supportsStrictToolCalling !== void 0) strict = this.supportsStrictToolCalling;
		return this.withConfig({
			tools: tools.map((tool) => {
				if (isBuiltInTool(tool) || isCustomTool(tool)) return tool;
				if (hasProviderToolDefinition(tool)) return tool.extras.providerToolDefinition;
				const converted = this._convertChatOpenAIToolToCompletionsTool(tool, { strict });
				if (isLangChainTool(tool) && tool.extras?.defer_loading === true) return {
					...converted,
					defer_loading: true
				};
				return converted;
			}),
			...kwargs
		});
	}
	async stream(input, options) {
		return super.stream(input, this._combineCallOptions(options));
	}
	async invoke(input, options) {
		return super.invoke(input, this._combineCallOptions(options));
	}
	/** @ignore */
	_combineLLMOutput(...llmOutputs) {
		return llmOutputs.reduce((acc, llmOutput) => {
			if (llmOutput && llmOutput.tokenUsage) {
				acc.tokenUsage.completionTokens += llmOutput.tokenUsage.completionTokens ?? 0;
				acc.tokenUsage.promptTokens += llmOutput.tokenUsage.promptTokens ?? 0;
				acc.tokenUsage.totalTokens += llmOutput.tokenUsage.totalTokens ?? 0;
			}
			return acc;
		}, { tokenUsage: {
			completionTokens: 0,
			promptTokens: 0,
			totalTokens: 0
		} });
	}
	async getNumTokensFromMessages(messages) {
		let totalCount = 0;
		let tokensPerMessage = 0;
		let tokensPerName = 0;
		if (this.model === "gpt-3.5-turbo-0301") {
			tokensPerMessage = 4;
			tokensPerName = -1;
		} else {
			tokensPerMessage = 3;
			tokensPerName = 1;
		}
		const countPerMessage = await Promise.all(messages.map(async (message) => {
			const [textCount, roleCount] = await Promise.all([this.getNumTokens(message.content), this.getNumTokens(messageToOpenAIRole(message))]);
			const nameCount = message.name !== void 0 ? tokensPerName + await this.getNumTokens(message.name) : 0;
			let count = textCount + tokensPerMessage + roleCount + nameCount;
			const openAIMessage = message;
			if (openAIMessage._getType() === "function") count -= 2;
			if (openAIMessage.additional_kwargs?.function_call) count += 3;
			if (openAIMessage?.additional_kwargs.function_call?.name) count += await this.getNumTokens(openAIMessage.additional_kwargs.function_call?.name);
			if (openAIMessage.additional_kwargs.function_call?.arguments) try {
				count += await this.getNumTokens(JSON.stringify(JSON.parse(openAIMessage.additional_kwargs.function_call?.arguments)));
			} catch (error) {
				console.error("Error parsing function arguments", error, JSON.stringify(openAIMessage.additional_kwargs.function_call));
				count += await this.getNumTokens(openAIMessage.additional_kwargs.function_call?.arguments);
			}
			totalCount += count;
			return count;
		}));
		totalCount += 3;
		return {
			totalCount,
			countPerMessage
		};
	}
	/** @internal */
	async _getNumTokensFromGenerations(generations) {
		return (await Promise.all(generations.map(async (generation) => {
			if (generation.message.additional_kwargs?.function_call) return (await this.getNumTokensFromMessages([generation.message])).countPerMessage[0];
			else return await this.getNumTokens(generation.message.content);
		}))).reduce((a, b) => a + b, 0);
	}
	/** @internal */
	async _getEstimatedTokenCountFromPrompt(messages, functions, function_call) {
		let tokens = (await this.getNumTokensFromMessages(messages)).totalCount;
		if (functions && function_call !== "auto") {
			const promptDefinitions = formatFunctionDefinitions(functions);
			tokens += await this.getNumTokens(promptDefinitions);
			tokens += 9;
		}
		if (functions && messages.find((m) => m._getType() === "system")) tokens -= 4;
		if (function_call === "none") tokens += 1;
		else if (typeof function_call === "object") tokens += await this.getNumTokens(function_call.name) + 4;
		return tokens;
	}
	/**
	* Moderate content using OpenAI's Moderation API.
	*
	* This method checks whether content violates OpenAI's content policy by
	* analyzing text for categories such as hate, harassment, self-harm,
	* sexual content, violence, and more.
	*
	* @param input - The text or array of texts to moderate
	* @param params - Optional parameters for the moderation request
	* @param params.model - The moderation model to use. Defaults to "omni-moderation-latest".
	* @param params.options - Additional options to pass to the underlying request
	* @returns A promise that resolves to the moderation response containing results for each input
	*
	* @example
	* ```typescript
	* const model = new ChatOpenAI({ model: "gpt-4o-mini" });
	*
	* // Moderate a single text
	* const result = await model.moderateContent("This is a test message");
	* console.log(result.results[0].flagged); // false
	* console.log(result.results[0].categories); // { hate: false, harassment: false, ... }
	*
	* // Moderate multiple texts
	* const results = await model.moderateContent([
	*   "Hello, how are you?",
	*   "This is inappropriate content"
	* ]);
	* results.results.forEach((result, index) => {
	*   console.log(`Text ${index + 1} flagged:`, result.flagged);
	* });
	*
	* // Use a specific moderation model
	* const stableResult = await model.moderateContent(
	*   "Test content",
	*   { model: "omni-moderation-latest" }
	* );
	* ```
	*/
	async moderateContent(input, params) {
		const clientOptions = this._getClientOptions(params?.options);
		const moderationRequest = {
			input,
			model: params?.model ?? "omni-moderation-latest"
		};
		return this.caller.call(async () => {
			try {
				return await this.client.moderations.create(moderationRequest, clientOptions);
			} catch (e) {
				throw wrapOpenAIClientError(e);
			}
		});
	}
	/**
	* Return profiling information for the model.
	*
	* Provides information about the model's capabilities and constraints,
	* including token limits, multimodal support, and advanced features like
	* tool calling and structured output.
	*
	* @returns {ModelProfile} An object describing the model's capabilities and constraints
	*
	* @example
	* ```typescript
	* const model = new ChatOpenAI({ model: "gpt-4o" });
	* const profile = model.profile;
	* console.log(profile.maxInputTokens); // 128000
	* console.log(profile.imageInputs); // true
	* ```
	*/
	get profile() {
		return PROFILES[this.model] ?? {};
	}
	/** @internal */
	_getStructuredOutputMethod(config) {
		const ensuredConfig = { ...config };
		if (!this.model.startsWith("gpt-3") && !this.model.startsWith("gpt-4-") && this.model !== "gpt-4") {
			if (ensuredConfig?.method === void 0) return "jsonSchema";
		} else if (ensuredConfig.method === "jsonSchema") console.warn(`[WARNING]: JSON Schema is not supported for model "${this.model}". Falling back to tool calling.`);
		return ensuredConfig.method;
	}
	/**
	* Add structured output to the model.
	*
	* The OpenAI model family supports the following structured output methods:
	* - `jsonSchema`: Use the `response_format` field in the response to return a JSON schema. Only supported with the `gpt-4o-mini`,
	*   `gpt-4o-mini-2024-07-18`, and `gpt-4o-2024-08-06` model snapshots and later.
	* - `functionCalling`: Function calling is useful when you are building an application that bridges the models and functionality
	*   of your application.
	* - `jsonMode`: JSON mode is a more basic version of the Structured Outputs feature. While JSON mode ensures that model
	*   output is valid JSON, Structured Outputs reliably matches the model's output to the schema you specify.
	*   We recommend you use `functionCalling` or `jsonSchema` if it is supported for your use case.
	*
	* The default method is `functionCalling`.
	*
	* @see https://platform.openai.com/docs/guides/structured-outputs
	* @param outputSchema - The schema to use for structured output.
	* @param config - The structured output method options.
	* @returns The model with structured output.
	*/
	withStructuredOutput(outputSchema, config) {
		let llm;
		let outputParser;
		const { schema, name, includeRaw } = {
			...config,
			schema: outputSchema
		};
		if (config?.strict !== void 0 && config.method === "jsonMode") throw new Error("Argument `strict` is only supported for `method` = 'function_calling'");
		const method = getStructuredOutputMethod(this.model, config?.method);
		if (method === "jsonMode") {
			outputParser = createContentParser(schema);
			const asJsonSchema = toJsonSchema(schema);
			llm = this.withConfig({
				outputVersion: "v0",
				response_format: { type: "json_object" },
				ls_structured_output_format: {
					kwargs: { method: "json_mode" },
					schema: {
						title: name ?? "extract",
						...asJsonSchema
					}
				}
			});
		} else if (method === "jsonSchema") {
			const asJsonSchema = toJsonSchema(schema);
			const openaiJsonSchemaParams = {
				name: name ?? "extract",
				description: getSchemaDescription(asJsonSchema),
				schema: isInteropZodSchema(schema) ? schema : asJsonSchema,
				strict: config?.strict
			};
			llm = this.withConfig({
				outputVersion: "v0",
				response_format: {
					type: "json_schema",
					json_schema: openaiJsonSchemaParams
				},
				ls_structured_output_format: {
					kwargs: { method: "json_schema" },
					schema: {
						title: openaiJsonSchemaParams.name,
						description: openaiJsonSchemaParams.description,
						...asJsonSchema
					}
				}
			});
			if (isInteropZodSchema(schema) || isSerializableSchema(schema)) {
				const altParser = createContentParser(schema);
				outputParser = RunnableLambda.from(async (aiMessage) => {
					if ("parsed" in aiMessage.additional_kwargs) return aiMessage.additional_kwargs.parsed;
					return altParser.invoke(aiMessage.content);
				});
			} else outputParser = new JsonOutputParser();
		} else {
			let functionName = name ?? "extract";
			const asJsonSchema = toJsonSchema(schema);
			let toolFunction;
			if (isInteropZodSchema(schema) || isSerializableSchema(schema)) toolFunction = {
				name: functionName,
				description: asJsonSchema.description,
				parameters: asJsonSchema
			};
			else if (typeof schema.name === "string" && typeof schema.parameters === "object" && schema.parameters != null) {
				toolFunction = schema;
				functionName = schema.name;
			} else {
				functionName = schema.title ?? functionName;
				toolFunction = {
					name: functionName,
					description: schema.description ?? "",
					parameters: schema
				};
			}
			llm = this.withConfig({
				outputVersion: "v0",
				tools: [{
					type: "function",
					function: toolFunction
				}],
				tool_choice: {
					type: "function",
					function: { name: functionName }
				},
				ls_structured_output_format: {
					kwargs: { method: "function_calling" },
					schema: {
						title: functionName,
						...asJsonSchema
					}
				},
				...config?.strict !== void 0 ? { strict: config.strict } : {}
			});
			outputParser = createFunctionCallingParser(schema, functionName);
		}
		return assembleStructuredOutputPipeline(llm, outputParser, includeRaw);
	}
};
//#endregion
//#region node_modules/@langchain/openai/dist/converters/completions.js
/**
* @deprecated This converter is an internal detail of the OpenAI provider. Do not use it directly. This will be revisited in a future release.
*/
var completionsApiContentBlockConverter = {
	providerName: "ChatOpenAI",
	fromStandardTextBlock(block) {
		return {
			type: "text",
			text: block.text
		};
	},
	fromStandardImageBlock(block) {
		if (block.source_type === "url") return {
			type: "image_url",
			image_url: {
				url: block.url,
				...block.metadata?.detail ? { detail: block.metadata.detail } : {}
			}
		};
		if (block.source_type === "base64") return {
			type: "image_url",
			image_url: {
				url: `data:${block.mime_type ?? ""};base64,${block.data}`,
				...block.metadata?.detail ? { detail: block.metadata.detail } : {}
			}
		};
		throw new Error(`Image content blocks with source_type ${block.source_type} are not supported for ChatOpenAI`);
	},
	fromStandardAudioBlock(block) {
		if (block.source_type === "url") {
			const data = parseBase64DataUrl({ dataUrl: block.url });
			if (!data) throw new Error(`URL audio blocks with source_type ${block.source_type} must be formatted as a data URL for ChatOpenAI`);
			const rawMimeType = data.mime_type || block.mime_type || "";
			let mimeType;
			try {
				mimeType = parseMimeType(rawMimeType);
			} catch {
				throw new Error(`Audio blocks with source_type ${block.source_type} must have mime type of audio/wav or audio/mp3`);
			}
			if (mimeType.type !== "audio" || mimeType.subtype !== "wav" && mimeType.subtype !== "mp3") throw new Error(`Audio blocks with source_type ${block.source_type} must have mime type of audio/wav or audio/mp3`);
			return {
				type: "input_audio",
				input_audio: {
					format: mimeType.subtype,
					data: data.data
				}
			};
		}
		if (block.source_type === "base64") {
			let mimeType;
			try {
				mimeType = parseMimeType(block.mime_type ?? "");
			} catch {
				throw new Error(`Audio blocks with source_type ${block.source_type} must have mime type of audio/wav or audio/mp3`);
			}
			if (mimeType.type !== "audio" || mimeType.subtype !== "wav" && mimeType.subtype !== "mp3") throw new Error(`Audio blocks with source_type ${block.source_type} must have mime type of audio/wav or audio/mp3`);
			return {
				type: "input_audio",
				input_audio: {
					format: mimeType.subtype,
					data: block.data
				}
			};
		}
		throw new Error(`Audio content blocks with source_type ${block.source_type} are not supported for ChatOpenAI`);
	},
	fromStandardFileBlock(block) {
		if (block.source_type === "url") {
			const data = parseBase64DataUrl({ dataUrl: block.url });
			const filename = getRequiredFilenameFromMetadata(block);
			if (!data) throw new Error(`URL file blocks with source_type ${block.source_type} must be formatted as a data URL for ChatOpenAI`);
			return {
				type: "file",
				file: {
					file_data: block.url,
					filename
				}
			};
		}
		if (block.source_type === "base64") {
			const filename = getRequiredFilenameFromMetadata(block);
			return {
				type: "file",
				file: {
					file_data: `data:${block.mime_type ?? ""};base64,${block.data}`,
					filename
				}
			};
		}
		if (block.source_type === "id") return {
			type: "file",
			file: { file_id: block.id }
		};
		throw new Error(`File content blocks with source_type ${block.source_type} are not supported for ChatOpenAI`);
	}
};
/**
* Converts an OpenAI Chat Completions API message to a LangChain BaseMessage.
*
* This converter transforms messages from OpenAI's Chat Completions API format into
* LangChain's internal message representation, handling various message types and
* preserving metadata, tool calls, and other relevant information.
*
* @remarks
* The converter handles the following message roles:
* - `assistant`: Converted to {@link AIMessage} with support for tool calls, function calls,
*   audio content, and multi-modal outputs
* - Other roles: Converted to generic {@link ChatMessage}
*
* For assistant messages, the converter:
* - Parses and validates tool calls, separating valid and invalid calls
* - Preserves function call information in additional_kwargs
* - Includes usage statistics and system fingerprint in response_metadata
* - Handles multi-modal content (text, images, audio)
* - Optionally includes the raw API response for debugging
*
* @param params - Conversion parameters
* @param params.message - The OpenAI chat completion message to convert
* @param params.rawResponse - The complete raw response from OpenAI's API, used to extract
*   metadata like model name, usage statistics, and system fingerprint
* @param params.includeRawResponse - If true, includes the raw OpenAI response in the
*   message's additional_kwargs under the `__raw_response` key. Useful for debugging
*   or accessing provider-specific fields. Defaults to false.
*
* @returns A LangChain BaseMessage instance:
*   - {@link AIMessage} for assistant messages with tool calls, metadata, and content
*   - {@link ChatMessage} for all other message types
*
* @example
* ```typescript
* const baseMessage = convertCompletionsMessageToBaseMessage({
*   message: {
*     role: "assistant",
*     content: "Hello! How can I help you?",
*     tool_calls: [
*       {
*         id: "call_123",
*         type: "function",
*         function: { name: "get_weather", arguments: '{"location":"NYC"}' }
*       }
*     ]
*   },
*   rawResponse: completionResponse,
*   includeRawResponse: true
* });
* // Returns an AIMessage with parsed tool calls and metadata
* ```
*
* @throws {Error} If tool call parsing fails, the invalid tool call is captured in
*   the `invalid_tool_calls` array rather than throwing an error
*
*/
var convertCompletionsMessageToBaseMessage = ({ message, rawResponse, includeRawResponse }) => {
	const rawToolCalls = message.tool_calls;
	const providerReasoningContent = message.reasoning_content;
	switch (message.role) {
		case "assistant": {
			const toolCalls = [];
			const invalidToolCalls = [];
			for (const rawToolCall of rawToolCalls ?? []) try {
				toolCalls.push(parseToolCall$2(rawToolCall, { returnId: true }));
			} catch (e) {
				invalidToolCalls.push(makeInvalidToolCall(rawToolCall, e.message));
			}
			const additional_kwargs = {
				function_call: message.function_call,
				tool_calls: rawToolCalls
			};
			if (includeRawResponse !== void 0) additional_kwargs.__raw_response = rawResponse;
			if (providerReasoningContent !== void 0) additional_kwargs.reasoning_content = providerReasoningContent;
			const response_metadata = {
				model_provider: "openai",
				model_name: rawResponse.model,
				...rawResponse.system_fingerprint ? {
					usage: { ...rawResponse.usage },
					system_fingerprint: rawResponse.system_fingerprint
				} : {}
			};
			if (message.audio) additional_kwargs.audio = message.audio;
			return new AIMessage({
				content: handleMultiModalOutput(message.content || "", rawResponse.choices?.[0]?.message),
				tool_calls: toolCalls,
				invalid_tool_calls: invalidToolCalls,
				additional_kwargs,
				response_metadata,
				id: rawResponse.id
			});
		}
		default: return new ChatMessage(message.content || "", message.role ?? "unknown");
	}
};
/**
* Converts an OpenAI Chat Completions API delta (streaming chunk) to a LangChain BaseMessageChunk.
*
* This converter is used during streaming responses to transform incremental updates from OpenAI's
* Chat Completions API into LangChain message chunks. It handles various message types, tool calls,
* function calls, audio content, and role-specific message chunk creation.
*
* @param params - Conversion parameters
* @param params.delta - The delta object from an OpenAI streaming chunk containing incremental
*   message updates. May include content, role, tool_calls, function_call, audio, etc.
* @param params.rawResponse - The complete raw ChatCompletionChunk response from OpenAI,
*   containing metadata like model info, usage stats, and the delta
* @param params.includeRawResponse - Optional flag to include the raw OpenAI response in the
*   message chunk's additional_kwargs. Useful for debugging or accessing provider-specific data
* @param params.defaultRole - Optional default role to use if the delta doesn't specify one.
*   Typically used to maintain role consistency across chunks in a streaming response
*
* @returns A BaseMessageChunk subclass appropriate for the message role:
*   - HumanMessageChunk for "user" role
*   - AIMessageChunk for "assistant" role (includes tool call chunks)
*   - SystemMessageChunk for "system" or "developer" roles
*   - FunctionMessageChunk for "function" role
*   - ToolMessageChunk for "tool" role
*   - ChatMessageChunk for any other role
*
* @example
* Basic streaming text chunk:
* ```typescript
* const chunk = convertCompletionsDeltaToBaseMessageChunk({
*   delta: { role: "assistant", content: "Hello" },
*   rawResponse: { id: "chatcmpl-123", model: "gpt-4", ... }
* });
* // Returns: AIMessageChunk with content "Hello"
* ```
*
* @example
* Streaming chunk with tool call:
* ```typescript
* const chunk = convertCompletionsDeltaToBaseMessageChunk({
*   delta: {
*     role: "assistant",
*     tool_calls: [{
*       index: 0,
*       id: "call_123",
*       function: { name: "get_weather", arguments: '{"location":' }
*     }]
*   },
*   rawResponse: { id: "chatcmpl-123", ... }
* });
* // Returns: AIMessageChunk with tool_call_chunks containing partial tool call data
* ```
*
* @remarks
* - Tool calls are converted to ToolCallChunk objects with incremental data
* - Audio content includes the chunk index from the raw response
* - The "developer" role is mapped to SystemMessageChunk with a special marker
* - Response metadata includes model provider info and usage statistics
* - Function calls and tool calls are stored in additional_kwargs for compatibility
*/
var convertCompletionsDeltaToBaseMessageChunk = ({ delta, rawResponse, includeRawResponse, defaultRole }) => {
	const role = delta.role ?? defaultRole;
	const content = delta.content ?? "";
	let additional_kwargs;
	if (delta.function_call) additional_kwargs = { function_call: delta.function_call };
	else if (delta.tool_calls) additional_kwargs = { tool_calls: delta.tool_calls };
	else additional_kwargs = {};
	if (includeRawResponse) additional_kwargs.__raw_response = rawResponse;
	if (delta.reasoning_content !== void 0) additional_kwargs.reasoning_content = delta.reasoning_content;
	if (delta.audio) additional_kwargs.audio = {
		...delta.audio,
		index: rawResponse.choices[0].index
	};
	const response_metadata = {
		model_provider: "openai",
		usage: { ...rawResponse.usage }
	};
	if (role === "user") return new HumanMessageChunk({
		content,
		response_metadata
	});
	else if (role === "assistant") {
		const toolCallChunks = [];
		if (Array.isArray(delta.tool_calls)) for (const rawToolCall of delta.tool_calls) toolCallChunks.push({
			name: rawToolCall.function?.name,
			args: rawToolCall.function?.arguments,
			id: rawToolCall.id,
			index: rawToolCall.index,
			type: "tool_call_chunk"
		});
		return new AIMessageChunk({
			content,
			tool_call_chunks: toolCallChunks,
			additional_kwargs,
			id: rawResponse.id,
			response_metadata
		});
	} else if (role === "system") return new SystemMessageChunk({
		content,
		response_metadata
	});
	else if (role === "developer") return new SystemMessageChunk({
		content,
		response_metadata,
		additional_kwargs: { __openai_role__: "developer" }
	});
	else if (role === "function") return new FunctionMessageChunk({
		content,
		additional_kwargs,
		name: delta.name,
		response_metadata
	});
	else if (role === "tool") return new ToolMessageChunk({
		content,
		additional_kwargs,
		tool_call_id: delta.tool_call_id,
		response_metadata
	});
	else return new ChatMessageChunk({
		content,
		role,
		response_metadata
	});
};
/**
* Converts a standard LangChain content block to an OpenAI Completions API content part.
*
* This converter transforms LangChain's standardized content blocks (image, audio, file)
* into the format expected by OpenAI's Chat Completions API. It handles various content
* types including images (URL or base64), audio (base64), and files (data or file ID).
*
* @param block - The standard content block to convert. Can be an image, audio, or file block.
*
* @returns An OpenAI Chat Completions content part object, or undefined if the block
*   cannot be converted (e.g., missing required data).
*
* @example
* Image with URL:
* ```typescript
* const block = { type: "image", url: "https://example.com/image.jpg" };
* const part = convertStandardContentBlockToCompletionsContentPart(block);
* // Returns: { type: "image_url", image_url: { url: "https://example.com/image.jpg" } }
* ```
*
* @example
* Image with base64 data:
* ```typescript
* const block = { type: "image", data: "iVBORw0KGgo...", mimeType: "image/png" };
* const part = convertStandardContentBlockToCompletionsContentPart(block);
* // Returns: { type: "image_url", image_url: { url: "data:image/png;base64,iVBORw0KGgo..." } }
* ```
*/
var convertStandardContentBlockToCompletionsContentPart = (block) => {
	if (block.type === "image") {
		if (block.url) return {
			type: "image_url",
			image_url: { url: block.url }
		};
		else if (block.data) return {
			type: "image_url",
			image_url: { url: `data:${block.mimeType};base64,${block.data}` }
		};
	}
	if (block.type === "audio") {
		if (block.data) {
			const format = iife(() => {
				const [, format] = block.mimeType.split("/");
				if (format === "wav" || format === "mp3") return format;
				return "wav";
			});
			return {
				type: "input_audio",
				input_audio: {
					data: block.data.toString(),
					format
				}
			};
		}
	}
	if (block.type === "file") {
		if (block.data) {
			const filename = getRequiredFilenameFromMetadata(block);
			return {
				type: "file",
				file: {
					file_data: `data:${block.mimeType};base64,${block.data}`,
					filename
				}
			};
		}
		if (block.fileId) return {
			type: "file",
			file: { file_id: block.fileId }
		};
	}
};
/**
* Converts a LangChain BaseMessage with standard content blocks to an OpenAI Chat Completions API message parameter.
*
* This converter transforms LangChain's standardized message format (using contentBlocks) into the format
* expected by OpenAI's Chat Completions API. It handles role mapping, content filtering, and multi-modal
* content conversion for various message types.
*
* @remarks
* The converter performs the following transformations:
* - Maps LangChain message roles to OpenAI API roles (user, assistant, system, developer, tool, function)
* - For reasoning models, automatically converts "system" role to "developer" role
* - Filters content blocks based on message role (most roles only include text blocks)
* - For user messages, converts multi-modal content blocks (images, audio, files) to OpenAI format
* - Preserves tool call IDs for tool messages and function names for function messages
*
* Role-specific behavior:
* - **developer**: Returns only text content blocks (used for reasoning models)
* - **system**: Returns only text content blocks
* - **assistant**: Returns only text content blocks
* - **tool**: Returns only text content blocks with tool_call_id preserved
* - **function**: Returns text content blocks joined as a single string with function name
* - **user** (default): Returns multi-modal content including text, images, audio, and files
*
* @param params - Conversion parameters
* @param params.message - The LangChain BaseMessage to convert. Must have contentBlocks property
*   containing an array of standard content blocks (text, image, audio, file, etc.)
* @param params.model - Optional model name. Used to determine if special role mapping is needed
*   (e.g., "system" -> "developer" for reasoning models like o1)
*
* @returns An OpenAI ChatCompletionMessageParam object formatted for the Chat Completions API.
*   The structure varies by role:
*   - Developer/System/Assistant: `{ role, content: TextBlock[] }`
*   - Tool: `{ role: "tool", tool_call_id, content: TextBlock[] }`
*   - Function: `{ role: "function", name, content: string }`
*   - User: `{ role: "user", content: Array<TextPart | ImagePart | AudioPart | FilePart> }`
*
* @example
* Simple text message:
* ```typescript
* const message = new HumanMessage({
*   content: [{ type: "text", text: "Hello!" }]
* });
* const param = convertStandardContentMessageToCompletionsMessage({ message });
* // Returns: { role: "user", content: [{ type: "text", text: "Hello!" }] }
* ```
*
* @example
* Multi-modal user message with image:
* ```typescript
* const message = new HumanMessage({
*   content: [
*     { type: "text", text: "What's in this image?" },
*     { type: "image", url: "https://example.com/image.jpg" }
*   ]
* });
* const param = convertStandardContentMessageToCompletionsMessage({ message });
* // Returns: {
* //   role: "user",
* //   content: [
* //     { type: "text", text: "What's in this image?" },
* //     { type: "image_url", image_url: { url: "https://example.com/image.jpg" } }
* //   ]
* // }
* ```
*/
var convertStandardContentMessageToCompletionsMessage = ({ message, model }) => {
	let role = messageToOpenAIRole(message);
	if (role === "system" && isReasoningModel(model)) role = "developer";
	if (role === "developer") return {
		role: "developer",
		content: message.contentBlocks.filter((block) => block.type === "text")
	};
	else if (role === "system") return {
		role: "system",
		content: message.contentBlocks.filter((block) => block.type === "text")
	};
	else if (role === "assistant") {
		const completionParam = {
			role: "assistant",
			content: message.contentBlocks.filter((block) => block.type === "text")
		};
		if (AIMessage.isInstance(message) && !!message.tool_calls?.length) completionParam.tool_calls = message.tool_calls.map(convertLangChainToolCallToOpenAI);
		else if (message.additional_kwargs.tool_calls != null) completionParam.tool_calls = message.additional_kwargs.tool_calls;
		return completionParam;
	} else if (role === "tool" && ToolMessage.isInstance(message)) return {
		role: "tool",
		tool_call_id: message.tool_call_id,
		content: message.contentBlocks.filter((block) => block.type === "text")
	};
	else if (role === "function") return {
		role: "function",
		name: message.name ?? "",
		content: message.contentBlocks.filter((block) => block.type === "text").join("")
	};
	function* iterateUserContent(blocks) {
		for (const block of blocks) {
			if (block.type === "text") yield {
				type: "text",
				text: block.text
			};
			const data = convertStandardContentBlockToCompletionsContentPart(block);
			if (data) yield data;
		}
	}
	return {
		role: "user",
		content: Array.from(iterateUserContent(message.contentBlocks))
	};
};
/**
* Converts an array of LangChain BaseMessages to OpenAI Chat Completions API message parameters.
*
* This converter transforms LangChain's internal message representation into the format required
* by OpenAI's Chat Completions API. It handles various message types, roles, content formats,
* tool calls, function calls, audio messages, and special model-specific requirements.
*
* @remarks
* The converter performs several key transformations:
* - Maps LangChain message types to OpenAI roles (user, assistant, system, tool, function, developer)
* - Converts standard content blocks (v1 format) using a specialized converter
* - Handles multimodal content including text, images, audio, and data blocks
* - Preserves tool calls and function calls with proper formatting
* - Applies model-specific role mappings (e.g., "system" → "developer" for reasoning models)
* - Splits audio messages into separate message parameters when needed
*
* @param params - Conversion parameters
* @param params.messages - Array of LangChain BaseMessages to convert. Can include any message
*   type: HumanMessage, AIMessage, SystemMessage, ToolMessage, FunctionMessage, etc.
* @param params.model - Optional model name used to determine if special role mapping is needed.
*   For reasoning models (o1, o3, etc.), "system" role is converted to "developer" role.
*
* @returns Array of ChatCompletionMessageParam objects formatted for OpenAI's Chat Completions API.
*   Some messages may be split into multiple parameters (e.g., audio messages).
*
* @example
* Basic message conversion:
* ```typescript
* const messages = [
*   new HumanMessage("What's the weather like?"),
*   new AIMessage("Let me check that for you.")
* ];
*
* const params = convertMessagesToCompletionsMessageParams({
*   messages,
*   model: "gpt-4"
* });
* // Returns:
* // [
* //   { role: "user", content: "What's the weather like?" },
* //   { role: "assistant", content: "Let me check that for you." }
* // ]
* ```
*
* @example
* Message with tool calls:
* ```typescript
* const messages = [
*   new AIMessage({
*     content: "",
*     tool_calls: [{
*       id: "call_123",
*       name: "get_weather",
*       args: { location: "San Francisco" }
*     }]
*   })
* ];
*
* const params = convertMessagesToCompletionsMessageParams({ messages });
* // Returns:
* // [{
* //   role: "assistant",
* //   content: "",
* //   tool_calls: [{
* //     id: "call_123",
* //     type: "function",
* //     function: { name: "get_weather", arguments: '{"location":"San Francisco"}' }
* //   }]
* // }]
* ```
*/
var convertMessagesToCompletionsMessageParams = ({ messages, model }) => {
	return messages.flatMap((message) => {
		if ("output_version" in message.response_metadata && message.response_metadata?.output_version === "v1") return convertStandardContentMessageToCompletionsMessage({ message });
		let role = messageToOpenAIRole(message);
		if (role === "system" && isReasoningModel(model)) role = "developer";
		const content = typeof message.content === "string" ? message.content : message.content.flatMap((m) => {
			if (isDataContentBlock(m)) return convertToProviderContentBlock(m, completionsApiContentBlockConverter);
			if (typeof m === "object" && m !== null && "type" in m && (m.type === "tool_use" || m.type === "tool_call" || m.type === "reasoning" || m.type === "reasoning_content" || m.type === "thinking")) return [];
			return m;
		});
		const completionParam = {
			role,
			content
		};
		if (message.name != null) completionParam.name = message.name;
		if (message.additional_kwargs.function_call != null) completionParam.function_call = message.additional_kwargs.function_call;
		if (AIMessage.isInstance(message) && !!message.tool_calls?.length) completionParam.tool_calls = message.tool_calls.map(convertLangChainToolCallToOpenAI);
		else {
			if (message.additional_kwargs.tool_calls != null) completionParam.tool_calls = message.additional_kwargs.tool_calls;
			if (ToolMessage.isInstance(message) && message.tool_call_id != null) completionParam.tool_call_id = message.tool_call_id;
		}
		if (message.additional_kwargs.audio && typeof message.additional_kwargs.audio === "object" && "id" in message.additional_kwargs.audio) return [completionParam, {
			role: "assistant",
			audio: { id: message.additional_kwargs.audio.id }
		}];
		return completionParam;
	});
};
//#endregion
//#region node_modules/@langchain/openai/dist/chat_models/completions.js
/**
* OpenAI Completions API implementation.
* @internal
*/
var ChatOpenAICompletions = class extends BaseChatOpenAI {
	constructor(modelOrFields, fieldsArg) {
		super(getChatOpenAIModelParams(modelOrFields, fieldsArg));
	}
	/** @internal */
	invocationParams(options, extra) {
		let strict;
		if (options?.strict !== void 0) strict = options.strict;
		else if (this.supportsStrictToolCalling !== void 0) strict = this.supportsStrictToolCalling;
		if (!(this.streaming || extra?.streaming) && options?.response_format?.type === "json_schema" && strict !== false) strict = true;
		let streamOptionsConfig = {};
		if (options?.stream_options !== void 0) streamOptionsConfig = { stream_options: options.stream_options };
		else if (this.streamUsage && (this.streaming || extra?.streaming)) streamOptionsConfig = { stream_options: { include_usage: true } };
		const params = {
			model: this.model,
			temperature: this.temperature,
			top_p: this.topP,
			frequency_penalty: this.frequencyPenalty,
			presence_penalty: this.presencePenalty,
			logprobs: this.logprobs,
			top_logprobs: this.topLogprobs,
			n: this.n,
			logit_bias: this.logitBias,
			stop: options?.stop ?? this.stopSequences,
			user: this.user,
			stream: this.streaming,
			functions: options?.functions,
			function_call: options?.function_call,
			tools: options?.tools?.length ? options.tools.map((tool) => this._convertChatOpenAIToolToCompletionsTool(tool, { strict })) : void 0,
			tool_choice: formatToOpenAIToolChoice(options?.tool_choice),
			response_format: this._getResponseFormat(options?.response_format),
			seed: options?.seed,
			...streamOptionsConfig,
			parallel_tool_calls: options?.parallel_tool_calls,
			...this.audio || options?.audio ? { audio: this.audio || options?.audio } : {},
			...this.modalities || options?.modalities ? { modalities: this.modalities || options?.modalities } : {},
			...this.modelKwargs,
			prompt_cache_key: options?.promptCacheKey ?? this.promptCacheKey,
			prompt_cache_retention: options?.promptCacheRetention ?? this.promptCacheRetention,
			verbosity: options?.verbosity ?? this.verbosity
		};
		if (options?.prediction !== void 0) params.prediction = options.prediction;
		if (this.service_tier !== void 0) params.service_tier = this.service_tier;
		if (options?.service_tier !== void 0) params.service_tier = options.service_tier;
		const reasoning = this._getReasoningParams(options);
		if (reasoning !== void 0 && reasoning.effort !== void 0) params.reasoning_effort = reasoning.effort;
		if (isReasoningModel(params.model)) params.max_completion_tokens = this.maxTokens === -1 ? void 0 : this.maxTokens;
		else params.max_tokens = this.maxTokens === -1 ? void 0 : this.maxTokens;
		return params;
	}
	async _generate(messages, options, runManager) {
		options.signal?.throwIfAborted();
		const usageMetadata = {};
		const params = this.invocationParams(options);
		const messagesMapped = convertMessagesToCompletionsMessageParams({
			messages,
			model: this.model
		});
		if (params.stream) {
			const stream = this._streamResponseChunks(messages, options, runManager);
			const finalChunks = {};
			for await (const chunk of stream) {
				chunk.message.response_metadata = {
					...chunk.generationInfo,
					...chunk.message.response_metadata
				};
				const index = chunk.generationInfo?.completion ?? 0;
				if (finalChunks[index] === void 0) finalChunks[index] = chunk;
				else finalChunks[index] = finalChunks[index].concat(chunk);
			}
			const generations = Object.entries(finalChunks).sort(([aKey], [bKey]) => parseInt(aKey, 10) - parseInt(bKey, 10)).map(([_, value]) => value);
			const { functions, function_call } = this.invocationParams(options);
			const promptTokenUsage = await this._getEstimatedTokenCountFromPrompt(messages, functions, function_call);
			const completionTokenUsage = await this._getNumTokensFromGenerations(generations);
			usageMetadata.input_tokens = promptTokenUsage;
			usageMetadata.output_tokens = completionTokenUsage;
			usageMetadata.total_tokens = promptTokenUsage + completionTokenUsage;
			return {
				generations,
				llmOutput: { estimatedTokenUsage: {
					promptTokens: usageMetadata.input_tokens,
					completionTokens: usageMetadata.output_tokens,
					totalTokens: usageMetadata.total_tokens
				} }
			};
		} else {
			const data = await this.completionWithRetry({
				...params,
				stream: false,
				messages: messagesMapped
			}, {
				signal: options?.signal,
				...options?.options
			});
			const { completion_tokens: completionTokens, prompt_tokens: promptTokens, total_tokens: totalTokens, prompt_tokens_details: promptTokensDetails, completion_tokens_details: completionTokensDetails } = data?.usage ?? {};
			if (completionTokens) usageMetadata.output_tokens = (usageMetadata.output_tokens ?? 0) + completionTokens;
			if (promptTokens) usageMetadata.input_tokens = (usageMetadata.input_tokens ?? 0) + promptTokens;
			if (totalTokens) usageMetadata.total_tokens = (usageMetadata.total_tokens ?? 0) + totalTokens;
			if (promptTokensDetails?.audio_tokens !== null || promptTokensDetails?.cached_tokens !== null) usageMetadata.input_token_details = {
				...promptTokensDetails?.audio_tokens !== null && { audio: promptTokensDetails?.audio_tokens },
				...promptTokensDetails?.cached_tokens !== null && { cache_read: promptTokensDetails?.cached_tokens }
			};
			if (completionTokensDetails?.audio_tokens !== null || completionTokensDetails?.reasoning_tokens !== null) usageMetadata.output_token_details = {
				...completionTokensDetails?.audio_tokens !== null && { audio: completionTokensDetails?.audio_tokens },
				...completionTokensDetails?.reasoning_tokens !== null && { reasoning: completionTokensDetails?.reasoning_tokens }
			};
			const generations = [];
			for (const part of data?.choices ?? []) {
				const generation = {
					text: part.message?.content ?? "",
					message: this._convertCompletionsMessageToBaseMessage(part.message ?? { role: "assistant" }, data)
				};
				generation.generationInfo = {
					...part.finish_reason ? { finish_reason: part.finish_reason } : {},
					...part.logprobs ? { logprobs: part.logprobs } : {}
				};
				if (isAIMessage(generation.message)) generation.message.usage_metadata = usageMetadata;
				generation.message = new AIMessage(Object.fromEntries(Object.entries(generation.message).filter(([key]) => !key.startsWith("lc_"))));
				generations.push(generation);
			}
			return {
				generations,
				llmOutput: { tokenUsage: {
					promptTokens: usageMetadata.input_tokens,
					completionTokens: usageMetadata.output_tokens,
					totalTokens: usageMetadata.total_tokens
				} }
			};
		}
	}
	/**
	* Native implementation of the content-block-centric streaming protocol
	* for OpenAI Chat Completions.
	*/
	async *_streamChatModelEvents(messages, options, _runManager) {
		const messagesMapped = convertMessagesToCompletionsMessageParams({
			messages,
			model: this.model
		});
		const params = {
			...this.invocationParams(options, { streaming: true }),
			messages: messagesMapped,
			stream: true
		};
		const streamIterable = await this.completionWithRetry(params, options);
		const shouldStreamUsage = this.streamUsage ?? options.streamUsage;
		const abortableStream = async function* (source, signal) {
			for await (const data of source) {
				if (signal?.aborted) return;
				yield data;
			}
		};
		yield* convertOpenAICompletionsStream(abortableStream(streamIterable, options.signal), {
			streamUsage: shouldStreamUsage ?? true,
			provider: this.streamEventProvider
		});
	}
	/** Provider id used in native stream protocol passthrough events. */
	get streamEventProvider() {
		return "openai";
	}
	async *_streamResponseChunks(messages, options, runManager) {
		const messagesMapped = convertMessagesToCompletionsMessageParams({
			messages,
			model: this.model
		});
		const params = {
			...this.invocationParams(options, { streaming: true }),
			messages: messagesMapped,
			stream: true
		};
		let defaultRole;
		const streamIterable = await this.completionWithRetry(params, options);
		let usage;
		for await (const data of streamIterable) {
			if (options.signal?.aborted) return;
			const choice = data?.choices?.[0];
			if (data.usage) usage = data.usage;
			if (!choice) continue;
			const { delta } = choice;
			if (!delta) continue;
			const chunk = this._convertCompletionsDeltaToBaseMessageChunk(delta, data, defaultRole);
			defaultRole = delta.role ?? defaultRole;
			const newTokenIndices = {
				prompt: options.promptIndex ?? 0,
				completion: choice.index ?? 0
			};
			if (typeof chunk.content !== "string") {
				console.log("[WARNING]: Received non-string content from OpenAI. This is currently not supported.");
				continue;
			}
			const generationInfo = { ...newTokenIndices };
			if (choice.finish_reason != null) {
				generationInfo.finish_reason = choice.finish_reason;
				generationInfo.system_fingerprint = data.system_fingerprint;
				generationInfo.model_name = data.model;
				generationInfo.service_tier = data.service_tier;
			}
			if (this.logprobs) generationInfo.logprobs = choice.logprobs;
			const generationChunk = new ChatGenerationChunk({
				message: chunk,
				text: chunk.content,
				generationInfo
			});
			yield generationChunk;
			await runManager?.handleLLMNewToken(generationChunk.text ?? "", newTokenIndices, void 0, void 0, void 0, { chunk: generationChunk });
		}
		if (usage) {
			const inputTokenDetails = {
				...usage.prompt_tokens_details?.audio_tokens !== null && { audio: usage.prompt_tokens_details?.audio_tokens },
				...usage.prompt_tokens_details?.cached_tokens !== null && { cache_read: usage.prompt_tokens_details?.cached_tokens }
			};
			const outputTokenDetails = {
				...usage.completion_tokens_details?.audio_tokens !== null && { audio: usage.completion_tokens_details?.audio_tokens },
				...usage.completion_tokens_details?.reasoning_tokens !== null && { reasoning: usage.completion_tokens_details?.reasoning_tokens }
			};
			const generationChunk = new ChatGenerationChunk({
				message: new AIMessageChunk({
					content: "",
					response_metadata: { usage: { ...usage } },
					usage_metadata: {
						input_tokens: usage.prompt_tokens,
						output_tokens: usage.completion_tokens,
						total_tokens: usage.total_tokens,
						...Object.keys(inputTokenDetails).length > 0 && { input_token_details: inputTokenDetails },
						...Object.keys(outputTokenDetails).length > 0 && { output_token_details: outputTokenDetails }
					}
				}),
				text: ""
			});
			yield generationChunk;
			await runManager?.handleLLMNewToken(generationChunk.text ?? "", {
				prompt: 0,
				completion: 0
			}, void 0, void 0, void 0, { chunk: generationChunk });
		}
		if (options.signal?.aborted) throw new Error("AbortError");
	}
	async completionWithRetry(request, requestOptions) {
		const clientOptions = this._getClientOptions(requestOptions);
		const isParseableFormat = request.response_format && request.response_format.type === "json_schema";
		return this.caller.call(async () => {
			try {
				if (isParseableFormat && !request.stream) return await this.client.chat.completions.parse(request, clientOptions);
				else return await this.client.chat.completions.create(request, clientOptions);
			} catch (e) {
				throw wrapOpenAIClientError(e);
			}
		});
	}
	/**
	* @deprecated
	* This function was hoisted into a publicly accessible function from a
	* different export, but to maintain backwards compatibility with chat models
	* that depend on ChatOpenAICompletions, we'll keep it here as an overridable
	* method. This will be removed in a future release
	*/
	_convertCompletionsDeltaToBaseMessageChunk(delta, rawResponse, defaultRole) {
		return convertCompletionsDeltaToBaseMessageChunk({
			delta,
			rawResponse,
			includeRawResponse: this.__includeRawResponse,
			defaultRole
		});
	}
	/**
	* @deprecated
	* This function was hoisted into a publicly accessible function from a
	* different export, but to maintain backwards compatibility with chat models
	* that depend on ChatOpenAICompletions, we'll keep it here as an overridable
	* method. This will be removed in a future release
	*/
	_convertCompletionsMessageToBaseMessage(message, rawResponse) {
		return convertCompletionsMessageToBaseMessage({
			message,
			rawResponse,
			includeRawResponse: this.__includeRawResponse
		});
	}
};
//#endregion
//#region node_modules/@langchain/openai/dist/converters/responses.js
var _FUNCTION_CALL_IDS_MAP_KEY = "__openai_function_call_ids__";
var _CUSTOM_TOOL_CALL_IDS_MAP_KEY = "__openai_custom_tool_call_ids__";
/**
* Converts an OpenAI annotation to a LangChain Citation or BaseContentBlock.
*
* OpenAI has several annotation types:
* - `url_citation`: Web citations with url, title, start_index, end_index
* - `file_citation`: File citations with file_id, filename, index
* - `container_file_citation`: Container file citations with container_id, file_id, filename, start_index, end_index
* - `file_path`: File paths with file_id, index
*
* This function maps them to LangChain's Citation format or preserves them as non-standard blocks.
*/
function convertOpenAIAnnotationToLangChain(annotation) {
	if (annotation.type === "url_citation") return {
		type: "citation",
		source: "url_citation",
		url: annotation.url,
		title: annotation.title,
		startIndex: annotation.start_index,
		endIndex: annotation.end_index
	};
	if (annotation.type === "file_citation") return {
		type: "citation",
		source: "file_citation",
		title: annotation.filename,
		startIndex: annotation.index,
		file_id: annotation.file_id
	};
	if (annotation.type === "container_file_citation") return {
		type: "citation",
		source: "container_file_citation",
		title: annotation.filename,
		startIndex: annotation.start_index,
		endIndex: annotation.end_index,
		file_id: annotation.file_id,
		container_id: annotation.container_id
	};
	if (annotation.type === "file_path") return {
		type: "citation",
		source: "file_path",
		startIndex: annotation.index,
		file_id: annotation.file_id
	};
	return {
		type: "non_standard",
		value: annotation
	};
}
/**
* Converts a LangChain Citation or BaseContentBlock back to an OpenAI annotation.
*
* This is the inverse of `convertOpenAIAnnotationToLangChain`. It handles all four
* annotation types (url_citation, file_citation, container_file_citation, file_path)
* and also passes through annotations that are already in OpenAI format.
*/
function convertLangChainAnnotationToOpenAI(annotation) {
	if (annotation.type === "url_citation" || annotation.type === "file_citation" || annotation.type === "container_file_citation" || annotation.type === "file_path") return annotation;
	if (annotation.type === "citation") {
		const citation = annotation;
		if (citation.source === "url_citation") return {
			type: "url_citation",
			url: citation.url ?? "",
			title: citation.title ?? "",
			start_index: citation.startIndex ?? 0,
			end_index: citation.endIndex ?? 0
		};
		if (citation.source === "file_citation") return {
			type: "file_citation",
			file_id: citation.file_id ?? "",
			filename: citation.title ?? "",
			index: citation.startIndex ?? 0
		};
		if (citation.source === "container_file_citation") return {
			type: "container_file_citation",
			file_id: citation.file_id ?? "",
			filename: citation.title ?? "",
			container_id: citation.container_id ?? "",
			start_index: citation.startIndex ?? 0,
			end_index: citation.endIndex ?? 0
		};
		if (citation.source === "file_path") return {
			type: "file_path",
			file_id: citation.file_id ?? "",
			index: citation.startIndex ?? 0
		};
	}
	if (annotation.type === "non_standard") return annotation.value;
	return annotation;
}
/**
* Converts OpenAI Responses API usage statistics to LangChain's UsageMetadata format.
*
* This converter transforms token usage information from OpenAI's Responses API into
* the standardized UsageMetadata format used throughout LangChain. It handles both
* basic token counts and detailed token breakdowns including cached tokens and
* reasoning tokens.
*
* @param usage - The usage statistics object from OpenAI's Responses API containing
*                token counts and optional detailed breakdowns.
*
* @returns A UsageMetadata object containing:
*   - `input_tokens`: Total number of tokens in the input/prompt (defaults to 0 if not provided)
*   - `output_tokens`: Total number of tokens in the model's output (defaults to 0 if not provided)
*   - `total_tokens`: Combined total of input and output tokens (defaults to 0 if not provided)
*   - `input_token_details`: Object containing detailed input token information:
*     - `cache_read`: Number of tokens read from cache (only included if available)
*   - `output_token_details`: Object containing detailed output token information:
*     - `reasoning`: Number of tokens used for reasoning (only included if available)
*
* @example
* ```typescript
* const usage = {
*   input_tokens: 100,
*   output_tokens: 50,
*   total_tokens: 150,
*   input_tokens_details: { cached_tokens: 20 },
*   output_tokens_details: { reasoning_tokens: 10 }
* };
*
* const metadata = convertResponsesUsageToUsageMetadata(usage);
* // Returns:
* // {
* //   input_tokens: 100,
* //   output_tokens: 50,
* //   total_tokens: 150,
* //   input_token_details: { cache_read: 20 },
* //   output_token_details: { reasoning: 10 }
* // }
* ```
*
* @remarks
* - The function safely handles undefined or null values by using optional chaining
*   and nullish coalescing operators
* - Detailed token information (cache_read, reasoning) is only included in the result
*   if the corresponding values are present in the input
* - Token counts default to 0 if not provided in the usage object
* - This converter is specifically designed for OpenAI's Responses API format and
*   may differ from other OpenAI API endpoints
*/
var convertResponsesUsageToUsageMetadata = (usage) => {
	const inputTokenDetails = { ...usage?.input_tokens_details?.cached_tokens != null && { cache_read: usage?.input_tokens_details?.cached_tokens } };
	const outputTokenDetails = { ...usage?.output_tokens_details?.reasoning_tokens != null && { reasoning: usage?.output_tokens_details?.reasoning_tokens } };
	return {
		input_tokens: usage?.input_tokens ?? 0,
		output_tokens: usage?.output_tokens ?? 0,
		total_tokens: usage?.total_tokens ?? 0,
		input_token_details: inputTokenDetails,
		output_token_details: outputTokenDetails
	};
};
/**
* Converts an OpenAI Responses API response to a LangChain AIMessage.
*
* This converter processes the output from OpenAI's Responses API (both `create` and `parse` methods)
* and transforms it into a LangChain AIMessage object with all relevant metadata, tool calls, and content.
*
* @param response - The response object from OpenAI's Responses API. Can be either:
*   - ResponsesCreateInvoke: Result from `responses.create()`
*   - ResponsesParseInvoke: Result from `responses.parse()`
*
* @returns An AIMessage containing:
*   - `id`: The message ID from the response output
*   - `content`: Array of message content blocks (text, images, etc.)
*   - `tool_calls`: Array of successfully parsed tool calls
*   - `invalid_tool_calls`: Array of tool calls that failed to parse
*   - `usage_metadata`: Token usage information converted to LangChain format
*   - `additional_kwargs`: Extra data including:
*     - `refusal`: Refusal text if the model refused to respond
*     - `reasoning`: Reasoning output for reasoning models
*     - `tool_outputs`: Results from built-in tools (web search, file search, etc.)
*     - `parsed`: Parsed structured output when using json_schema format
*     - Function call ID mappings for tracking
*   - `response_metadata`: Metadata about the response including model, timestamps, status, etc.
*
* @throws Error if the response contains an error object. The error message and code are extracted
*   from the response.error field.
*
* @example
* ```typescript
* const response = await client.responses.create({
*   model: "gpt-4",
*   input: [{ type: "message", content: "Hello" }]
* });
* const message = convertResponsesMessageToAIMessage(response);
* console.log(message.content); // Message content
* console.log(message.tool_calls); // Any tool calls made
* ```
*
* @remarks
* The converter handles multiple output item types:
* - `message`: Text and structured content from the model
* - `function_call`: Tool/function calls that need to be executed
* - `reasoning`: Reasoning traces from reasoning models (o1, o3, etc.)
* - `custom_tool_call`: Custom tool invocations
* - Built-in tool outputs: web_search, file_search, code_interpreter, etc.
*
* Tool calls are parsed and validated. Invalid tool calls (malformed JSON, etc.) are captured
* in the `invalid_tool_calls` array rather than throwing errors.
*/
var convertResponsesMessageToAIMessage = (response) => {
	if (response.error) {
		const error = new Error(response.error.message);
		error.name = response.error.code;
		throw error;
	}
	const content = [];
	const tool_calls = [];
	const invalid_tool_calls = [];
	const cleanedOutput = response.output.map((item) => {
		if (item.type === "function_call" && "parsed_arguments" in item) {
			const cleaned = { ...item };
			delete cleaned.parsed_arguments;
			return cleaned;
		}
		return item;
	});
	const response_metadata = {
		model_provider: "openai",
		model: response.model,
		created_at: response.created_at,
		id: response.id,
		incomplete_details: response.incomplete_details,
		metadata: response.metadata,
		object: response.object,
		output: cleanedOutput,
		status: response.status,
		user: response.user,
		service_tier: response.service_tier,
		model_name: response.model
	};
	const additional_kwargs = {};
	for (const item of response.output) if (item.type === "message") content.push(...item.content.flatMap((part) => {
		if (part.type === "output_text") {
			if ("parsed" in part && part.parsed != null) additional_kwargs.parsed = part.parsed;
			return {
				type: "text",
				text: part.text,
				annotations: part.annotations.map(convertOpenAIAnnotationToLangChain),
				...item.phase !== null ? { phase: item.phase } : {}
			};
		}
		if (part.type === "refusal") {
			additional_kwargs.refusal = part.refusal;
			return [];
		}
		return part;
	}));
	else if (item.type === "function_call") {
		const fnAdapter = {
			function: {
				name: item.name,
				arguments: item.arguments
			},
			id: item.call_id
		};
		try {
			tool_calls.push(parseToolCall$2(fnAdapter, { returnId: true }));
		} catch (e) {
			let errMessage;
			if (typeof e === "object" && e != null && "message" in e && typeof e.message === "string") errMessage = e.message;
			invalid_tool_calls.push(makeInvalidToolCall(fnAdapter, errMessage));
		}
		additional_kwargs[_FUNCTION_CALL_IDS_MAP_KEY] ??= {};
		if (item.id) additional_kwargs[_FUNCTION_CALL_IDS_MAP_KEY][item.call_id] = item.id;
	} else if (item.type === "reasoning") {
		additional_kwargs.reasoning = item;
		const reasoningText = item.summary?.map((s) => s.text).filter(Boolean).join("");
		if (reasoningText) content.push({
			type: "reasoning",
			reasoning: reasoningText
		});
	} else if (item.type === "custom_tool_call") {
		const parsed = parseCustomToolCall(item);
		if (parsed) {
			tool_calls.push(parsed);
			additional_kwargs[_CUSTOM_TOOL_CALL_IDS_MAP_KEY] ??= {};
			if (item.id && item.call_id) additional_kwargs[_CUSTOM_TOOL_CALL_IDS_MAP_KEY][item.call_id] = item.id;
		} else invalid_tool_calls.push(makeInvalidToolCall(item, "Malformed custom tool call"));
	} else if (item.type === "computer_call") {
		const parsed = parseComputerCall(item);
		if (parsed) tool_calls.push(parsed);
		else invalid_tool_calls.push(makeInvalidToolCall(item, "Malformed computer call"));
	} else if (item.type === "image_generation_call") {
		if (item.result) content.push({
			type: "image",
			mimeType: "image/png",
			data: item.result,
			id: item.id,
			metadata: { status: item.status }
		});
		additional_kwargs.tool_outputs ??= [];
		additional_kwargs.tool_outputs.push(item);
	} else {
		additional_kwargs.tool_outputs ??= [];
		additional_kwargs.tool_outputs.push(item);
	}
	return new AIMessage({
		id: response.id,
		content,
		tool_calls,
		invalid_tool_calls,
		usage_metadata: convertResponsesUsageToUsageMetadata(response.usage),
		additional_kwargs,
		response_metadata
	});
};
/**
* Converts a LangChain ChatOpenAI reasoning summary to an OpenAI Responses API reasoning item.
*
* This converter transforms reasoning summaries that have been accumulated during streaming
* (where summary parts may arrive in multiple chunks with the same index) into the final
* consolidated format expected by OpenAI's Responses API. It combines summary parts that
* share the same index and removes the index field from the final output.
*
* @param reasoning - A ChatOpenAI reasoning summary object containing:
*   - `id`: The reasoning item ID
*   - `type`: The type of reasoning (typically "reasoning")
*   - `summary`: Array of summary parts, each with:
*     - `text`: The summary text content
*     - `type`: The summary type (e.g., "summary_text")
*     - `index`: The index used to group related summary parts during streaming
*
* @returns An OpenAI Responses API ResponseReasoningItem with:
*   - All properties from the input reasoning object
*   - `summary`: Consolidated array of summary objects with:
*     - `text`: Combined text from all parts with the same index
*     - `type`: The summary type
*     - No `index` field (removed after consolidation)
*
* @example
* ```typescript
* // Input: Reasoning summary with multiple parts at the same index
* const reasoning = {
*   id: "reasoning_123",
*   type: "reasoning",
*   summary: [
*     { text: "First ", type: "summary_text", index: 0 },
*     { text: "part", type: "summary_text", index: 0 },
*     { text: "Second part", type: "summary_text", index: 1 }
*   ]
* };
*
* const result = convertReasoningSummaryToResponsesReasoningItem(reasoning);
* // Returns:
* // {
* //   id: "reasoning_123",
* //   type: "reasoning",
* //   summary: [
* //     { text: "First part", type: "summary_text" },
* //     { text: "Second part", type: "summary_text" }
* //   ]
* // }
* ```
*
* @remarks
* - This converter is primarily used when reconstructing complete reasoning items from
*   streaming chunks, where summary parts may arrive incrementally with index markers
* - Summary parts with the same index are concatenated in the order they appear
* - If the reasoning summary contains only one part, no reduction is performed
* - The index field is used internally during streaming to track which summary parts
*   belong together, but is removed from the final output as it's not part of the
*   OpenAI Responses API schema
* - This is the inverse operation of the streaming accumulation that happens in
*   `convertResponsesDeltaToChatGenerationChunk`
*/
var convertReasoningSummaryToResponsesReasoningItem = (reasoning) => {
	const summary = (reasoning.summary.length > 1 ? reasoning.summary.reduce((acc, curr) => {
		const last = acc[acc.length - 1];
		if (last.index === curr.index) last.text += curr.text;
		else acc.push(curr);
		return acc;
	}, [{ ...reasoning.summary[0] }]) : reasoning.summary).map((s) => Object.fromEntries(Object.entries(s).filter(([k]) => k !== "index")));
	return {
		...reasoning,
		summary
	};
};
/**
* Converts OpenAI Responses API stream events to LangChain ChatGenerationChunk objects.
*
* This converter processes streaming events from OpenAI's Responses API and transforms them
* into LangChain ChatGenerationChunk objects that can be used in streaming chat applications.
* It handles various event types including text deltas, tool calls, reasoning, and metadata updates.
*
* @param event - A streaming event from OpenAI's Responses API
*
* @returns A ChatGenerationChunk containing:
*   - `text`: Concatenated text content from all text parts in the event
*   - `message`: An AIMessageChunk with:
*     - `id`: Response ID (set on `response.created` / `response.completed`)
*     - `content`: Array of content blocks (text with optional annotations)
*     - `tool_call_chunks`: Incremental tool call data (name, args, id)
*     - `usage_metadata`: Token usage information (only in completion events)
*     - `additional_kwargs`: Extra data including:
*       - `refusal`: Refusal text if the model refused to respond
*       - `reasoning`: Reasoning output for reasoning models (id, type, summary)
*       - `tool_outputs`: Results from built-in tools (web search, file search, etc.)
*       - `parsed`: Parsed structured output when using json_schema format
*       - Function call ID mappings for tracking
*     - `response_metadata`: Metadata about the response (model, id, etc.)
*   - `generationInfo`: Additional generation information (e.g., tool output status)
*
*   Returns `null` for events that don't produce meaningful chunks:
*   - Partial image generation events (to avoid storing all partial images in history)
*   - Unrecognized event types
*
* @example
* ```typescript
* const stream = await client.responses.create({
*   model: "gpt-4",
*   input: [{ type: "message", content: "Hello" }],
*   stream: true
* });
*
* for await (const event of stream) {
*   const chunk = convertResponsesDeltaToChatGenerationChunk(event);
*   if (chunk) {
*     console.log(chunk.text); // Incremental text
*     console.log(chunk.message.tool_call_chunks); // Tool call updates
*   }
* }
* ```
*
* @remarks
* - Text content is accumulated in an array with index tracking for proper ordering
* - Tool call chunks include incremental arguments that need to be concatenated by the consumer
* - Reasoning summaries are built incrementally across multiple events
* - Function call IDs are tracked in `additional_kwargs` to map call_id to item id
* - The `text` field is provided for legacy compatibility with `onLLMNewToken` callbacks
* - Usage metadata is only available in `response.completed` events
* - Partial images are intentionally ignored to prevent memory bloat in conversation history
*/
var convertResponsesDeltaToChatGenerationChunk = (event) => {
	const content = [];
	let generationInfo = {};
	let usage_metadata;
	const tool_call_chunks = [];
	const response_metadata = { model_provider: "openai" };
	const additional_kwargs = {};
	let id;
	if (event.type === "response.output_text.delta") content.push({
		type: "text",
		text: event.delta,
		index: event.content_index
	});
	else if (event.type === "response.output_text.annotation.added") content.push({
		type: "text",
		text: "",
		annotations: [convertOpenAIAnnotationToLangChain(event.annotation)],
		index: event.content_index
	});
	else if (event.type === "response.output_item.added" && event.item.type === "message") {
		const phase = "phase" in event.item ? event.item.phase : void 0;
		if (phase) content.push({
			type: "text",
			text: "",
			phase,
			index: 0
		});
	} else if (event.type === "response.output_item.added" && event.item.type === "function_call") {
		tool_call_chunks.push({
			type: "tool_call_chunk",
			name: event.item.name,
			args: event.item.arguments,
			id: event.item.call_id,
			index: event.output_index
		});
		additional_kwargs[_FUNCTION_CALL_IDS_MAP_KEY] = { [event.item.call_id]: event.item.id };
	} else if (event.type === "response.output_item.added" && event.item.type === "custom_tool_call") {
		tool_call_chunks.push({
			type: "tool_call_chunk",
			isCustomTool: true,
			name: event.item.name,
			args: event.item.input,
			id: event.item.call_id,
			index: event.output_index
		});
		additional_kwargs[_CUSTOM_TOOL_CALL_IDS_MAP_KEY] = { [event.item.call_id]: event.item.id };
	} else if (event.type === "response.output_item.done" && event.item.type === "computer_call") {
		tool_call_chunks.push({
			type: "tool_call_chunk",
			name: "computer_use",
			args: JSON.stringify({ action: event.item.action }),
			id: event.item.call_id,
			index: event.output_index
		});
		additional_kwargs.tool_outputs = [event.item];
	} else if (event.type === "response.output_item.done" && event.item.type === "image_generation_call") {
		if (event.item.result) content.push({
			type: "image",
			mimeType: "image/png",
			data: event.item.result,
			id: event.item.id,
			metadata: { status: event.item.status }
		});
		additional_kwargs.tool_outputs = [event.item];
	} else if (event.type === "response.output_item.done" && [
		"web_search_call",
		"file_search_call",
		"code_interpreter_call",
		"shell_call",
		"local_shell_call",
		"mcp_call",
		"mcp_list_tools",
		"mcp_approval_request",
		"custom_tool_call",
		"tool_search_call",
		"tool_search_output"
	].includes(event.item.type)) additional_kwargs.tool_outputs = [event.item];
	else if (event.type === "response.created") {
		id = event.response.id;
		response_metadata.id = event.response.id;
		response_metadata.model_name = event.response.model;
		response_metadata.model = event.response.model;
	} else if (event.type === "response.completed" || event.type === "response.incomplete") {
		id = event.response.id;
		const msg = convertResponsesMessageToAIMessage(event.response);
		usage_metadata = convertResponsesUsageToUsageMetadata(event.response.usage);
		if (event.response.text?.format?.type === "json_schema" && msg.text) try {
			additional_kwargs.parsed ??= JSON.parse(msg.text);
		} catch {}
		for (const [key, value] of Object.entries(event.response)) {
			if (key === "id") continue;
			if (key === "output") response_metadata[key] = msg.response_metadata.output;
			else response_metadata[key] = value;
		}
	} else if (event.type === "response.function_call_arguments.delta" || event.type === "response.custom_tool_call_input.delta") tool_call_chunks.push({
		type: "tool_call_chunk",
		args: event.delta,
		index: event.output_index,
		...event.type === "response.custom_tool_call_input.delta" ? { isCustomTool: true } : {}
	});
	else if (event.type === "response.web_search_call.in_progress" || event.type === "response.web_search_call.searching" || event.type === "response.web_search_call.completed" || event.type === "response.file_search_call.in_progress" || event.type === "response.file_search_call.searching" || event.type === "response.file_search_call.completed" || event.type === "response.image_generation_call.in_progress" || event.type === "response.image_generation_call.generating" || event.type === "response.image_generation_call.completed") {
		const [, type, status] = event.type.match(/^response\.(.*)\.([^.]+)$/) ?? [
			"",
			"",
			""
		];
		generationInfo = { tool_outputs: {
			id: event.item_id,
			type,
			status
		} };
	} else if (event.type === "response.refusal.done") additional_kwargs.refusal = event.refusal;
	else if (event.type === "response.output_item.added" && "item" in event && event.item.type === "reasoning") {
		const summary = event.item.summary ? event.item.summary.map((s, index) => ({
			...s,
			index
		})) : void 0;
		additional_kwargs.reasoning = {
			id: event.item.id,
			type: event.item.type,
			...summary ? { summary } : {}
		};
		const reasoningText = event.item.summary?.map((s) => s.text).filter(Boolean).join("");
		if (reasoningText) content.push({
			type: "reasoning",
			reasoning: reasoningText
		});
	} else if (event.type === "response.reasoning_summary_part.added") {
		additional_kwargs.reasoning = {
			type: "reasoning",
			summary: [{
				...event.part,
				index: event.summary_index
			}]
		};
		if (event.part.text) content.push({
			type: "reasoning",
			reasoning: event.part.text,
			index: event.summary_index
		});
	} else if (event.type === "response.reasoning_summary_text.delta") {
		additional_kwargs.reasoning = {
			type: "reasoning",
			summary: [{
				text: event.delta,
				type: "summary_text",
				index: event.summary_index
			}]
		};
		if (event.delta) content.push({
			type: "reasoning",
			reasoning: event.delta,
			index: event.summary_index
		});
	} else if (event.type === "response.image_generation_call.partial_image") return null;
	else return null;
	return new ChatGenerationChunk({
		text: content.map((part) => part.text).join(""),
		message: new AIMessageChunk({
			id,
			content,
			tool_call_chunks,
			usage_metadata,
			additional_kwargs,
			response_metadata
		}),
		generationInfo
	});
};
/**
* Converts a single LangChain BaseMessage to OpenAI Responses API input format.
*
* This converter transforms a LangChain message into one or more ResponseInputItem objects
* that can be used with OpenAI's Responses API. It handles complex message structures including
* tool calls, reasoning blocks, multimodal content, and various content block types.
*
* @param message - The LangChain BaseMessage to convert. Can be any message type including
*   HumanMessage, AIMessage, SystemMessage, ToolMessage, etc.
*
* @returns An array of ResponseInputItem objects.
*
* @example
* Basic text message conversion:
* ```typescript
* const message = new HumanMessage("Hello, how are you?");
* const items = convertStandardContentMessageToResponsesInput(message);
* // Returns: [{ type: "message", role: "user", content: [{ type: "input_text", text: "Hello, how are you?" }] }]
* ```
*
* @example
* AI message with tool calls:
* ```typescript
* const message = new AIMessage({
*   content: "I'll check the weather for you.",
*   tool_calls: [{
*     id: "call_123",
*     name: "get_weather",
*     args: { location: "San Francisco" }
*   }]
* });
* const items = convertStandardContentMessageToResponsesInput(message);
* // Returns:
* // [
* //   { type: "message", role: "assistant", content: [{ type: "input_text", text: "I'll check the weather for you." }] },
* //   { type: "function_call", call_id: "call_123", name: "get_weather", arguments: '{"location":"San Francisco"}' }
* // ]
* ```
*/
var convertStandardContentMessageToResponsesInput = (message) => {
	const isResponsesMessage = AIMessage.isInstance(message) && message.response_metadata?.model_provider === "openai";
	function* iterateItems() {
		const messageRole = iife$1(() => {
			try {
				const role = messageToOpenAIRole(message);
				if (role === "system" || role === "developer" || role === "assistant" || role === "user") return role;
				return "assistant";
			} catch {
				return "assistant";
			}
		});
		const makeTextPart = (text) => messageRole === "assistant" ? {
			type: "output_text",
			text,
			annotations: []
		} : {
			type: "input_text",
			text
		};
		let currentMessage = void 0;
		const functionCallIdsWithBlocks = /* @__PURE__ */ new Set();
		const serverFunctionCallIdsWithBlocks = /* @__PURE__ */ new Set();
		const pendingFunctionChunks = /* @__PURE__ */ new Map();
		const pendingServerFunctionChunks = /* @__PURE__ */ new Map();
		function* flushMessage() {
			if (!currentMessage) return;
			const content = currentMessage.content;
			if (typeof content === "string" && content.length > 0 || Array.isArray(content) && content.length > 0) yield currentMessage;
			currentMessage = void 0;
		}
		const pushMessageContent = (content, phase) => {
			if (!currentMessage) currentMessage = {
				type: "message",
				role: messageRole,
				content: [],
				...phase ? { phase } : {}
			};
			if (typeof currentMessage.content === "string") currentMessage.content = currentMessage.content.length > 0 ? [makeTextPart(currentMessage.content), ...content] : [...content];
			else currentMessage.content.push(...content);
		};
		const toJsonString = (value) => {
			if (typeof value === "string") return value;
			try {
				return JSON.stringify(value ?? {});
			} catch {
				return "{}";
			}
		};
		const resolveImageItem = (block) => {
			const detail = iife$1(() => {
				const raw = block.metadata?.detail;
				if (raw === "low" || raw === "high" || raw === "auto") return raw;
				return "auto";
			});
			if (block.fileId) return {
				type: "input_image",
				detail,
				file_id: block.fileId
			};
			if (block.url) return {
				type: "input_image",
				detail,
				image_url: block.url
			};
			if (block.data) {
				const base64Data = typeof block.data === "string" ? block.data : Buffer.from(block.data).toString("base64");
				return {
					type: "input_image",
					detail,
					image_url: `data:${block.mimeType ?? "image/png"};base64,${base64Data}`
				};
			}
		};
		const resolveFileItem = (block) => {
			if (block.fileId) {
				const filename = getFilenameFromMetadata(block);
				return {
					type: "input_file",
					file_id: block.fileId,
					...filename ? { filename } : {}
				};
			}
			if (block.url) {
				const filename = getFilenameFromMetadata(block);
				return {
					...filename ? { filename } : {},
					type: "input_file",
					file_url: block.url
				};
			}
			if (block.data) {
				const filename = getRequiredFilenameFromMetadata(block);
				const encoded = typeof block.data === "string" ? block.data : Buffer.from(block.data).toString("base64");
				return {
					type: "input_file",
					file_data: `data:${block.mimeType ?? "application/octet-stream"};base64,${encoded}`,
					filename
				};
			}
		};
		const convertReasoningBlock = (block) => {
			const summaryEntries = iife$1(() => {
				if (Array.isArray(block.summary)) {
					const mapped = block.summary?.map((item) => item?.text).filter((text) => typeof text === "string") ?? [];
					if (mapped.length > 0) return mapped;
				}
				return block.reasoning ? [block.reasoning] : [];
			});
			const summary = summaryEntries.length > 0 ? summaryEntries.map((text) => ({
				type: "summary_text",
				text
			})) : [{
				type: "summary_text",
				text: ""
			}];
			return {
				type: "reasoning",
				...block.id ? { id: block.id } : {},
				summary
			};
		};
		const convertFunctionCall = (block) => ({
			type: "function_call",
			name: block.name ?? "",
			call_id: block.id ?? "",
			arguments: toJsonString(block.args)
		});
		const convertFunctionCallOutput = (block) => {
			const output = toJsonString(block.output);
			const status = block.status === "success" ? "completed" : block.status === "error" ? "incomplete" : void 0;
			return {
				type: "function_call_output",
				call_id: block.toolCallId ?? "",
				output,
				...status ? { status } : {}
			};
		};
		for (const block of message.contentBlocks) if (block.type === "text") {
			const phase = iife$1(() => {
				if (!("extras" in block && typeof block.extras === "object" && block.extras !== null && "phase" in block.extras)) return void 0;
				return block.extras.phase;
			});
			pushMessageContent([makeTextPart(block.text)], phase);
		} else if (block.type === "invalid_tool_call") {} else if (block.type === "reasoning") {
			yield* flushMessage();
			yield convertReasoningBlock(block);
		} else if (block.type === "tool_call") {
			yield* flushMessage();
			const id = block.id ?? "";
			if (id) {
				functionCallIdsWithBlocks.add(id);
				pendingFunctionChunks.delete(id);
			}
			yield convertFunctionCall(block);
		} else if (block.type === "tool_call_chunk") {
			if (block.id) {
				const existing = pendingFunctionChunks.get(block.id) ?? {
					name: block.name,
					args: []
				};
				if (block.name) existing.name = block.name;
				if (block.args) existing.args.push(block.args);
				pendingFunctionChunks.set(block.id, existing);
			}
		} else if (block.type === "server_tool_call") {
			yield* flushMessage();
			const id = block.id ?? "";
			if (id) {
				serverFunctionCallIdsWithBlocks.add(id);
				pendingServerFunctionChunks.delete(id);
			}
			yield convertFunctionCall(block);
		} else if (block.type === "server_tool_call_chunk") {
			if (block.id) {
				const existing = pendingServerFunctionChunks.get(block.id) ?? {
					name: block.name,
					args: []
				};
				if (block.name) existing.name = block.name;
				if (block.args) existing.args.push(block.args);
				pendingServerFunctionChunks.set(block.id, existing);
			}
		} else if (block.type === "server_tool_call_result") {
			yield* flushMessage();
			yield convertFunctionCallOutput(block);
		} else if (block.type === "audio") {} else if (block.type === "file") {
			const fileItem = resolveFileItem(block);
			if (fileItem) pushMessageContent([fileItem]);
		} else if (block.type === "image") {
			const imageItem = resolveImageItem(block);
			if (imageItem) pushMessageContent([imageItem]);
		} else if (block.type === "video") {
			const videoItem = resolveFileItem(block);
			if (videoItem) pushMessageContent([videoItem]);
		} else if (block.type === "text-plain") {
			if (block.text) pushMessageContent([makeTextPart(block.text)]);
		} else if (block.type === "non_standard" && isResponsesMessage) {
			yield* flushMessage();
			yield block.value;
		}
		yield* flushMessage();
		for (const [id, chunk] of pendingFunctionChunks) {
			if (!id || functionCallIdsWithBlocks.has(id)) continue;
			const args = chunk.args.join("");
			if (!chunk.name && !args) continue;
			yield {
				type: "function_call",
				call_id: id,
				name: chunk.name ?? "",
				arguments: args
			};
		}
		for (const [id, chunk] of pendingServerFunctionChunks) {
			if (!id || serverFunctionCallIdsWithBlocks.has(id)) continue;
			const args = chunk.args.join("");
			if (!chunk.name && !args) continue;
			yield {
				type: "function_call",
				call_id: id,
				name: chunk.name ?? "",
				arguments: args
			};
		}
	}
	return Array.from(iterateItems());
};
/**
* - MCP (Model Context Protocol) approval responses
* - Zero Data Retention (ZDR) mode handling
*
* @param params - Conversion parameters
* @param params.messages - Array of LangChain BaseMessages to convert
* @param params.zdrEnabled - Whether Zero Data Retention mode is enabled. When true, certain
*   metadata like message IDs and function call IDs are omitted from the output
* @param params.model - The model name being used. Used to determine if special role mapping
*   is needed (e.g., "system" -> "developer" for reasoning models)
*
* @returns Array of ResponsesInputItem objects formatted for the OpenAI Responses API
*
* @throws {Error} When a function message is encountered (not supported)
* @throws {Error} When computer call output format is invalid
*
* @example
* ```typescript
* const messages = [
*   new HumanMessage("Hello"),
*   new AIMessage({ content: "Hi there!", tool_calls: [...] })
* ];
*
* const input = convertMessagesToResponsesInput({
*   messages,
*   zdrEnabled: false,
*   model: "gpt-4"
* });
* ```
*/
var convertMessagesToResponsesInput = ({ messages, zdrEnabled, model }) => {
	return messages.flatMap((lcMsg) => {
		const responseMetadata = lcMsg.response_metadata;
		if (responseMetadata?.output_version === "v1") return convertStandardContentMessageToResponsesInput(lcMsg);
		const additional_kwargs = lcMsg.additional_kwargs;
		let role = messageToOpenAIRole(lcMsg);
		if (role === "system" && isReasoningModel(model)) role = "developer";
		if (role === "function") throw new Error("Function messages are not supported in Responses API");
		if (role === "tool") {
			const toolMessage = lcMsg;
			if (additional_kwargs?.type === "computer_call_output")
 /**
			* Cast needed because OpenAI SDK types don't yet include input_image
			* for computer-use-preview model output format
			*/
			return {
				type: "computer_call_output",
				output: (() => {
					if (typeof toolMessage.content === "string") return {
						type: "input_image",
						image_url: toolMessage.content
					};
					if (Array.isArray(toolMessage.content)) {
						/**
						* Check for input_image type first (computer-use-preview format)
						*/
						const inputImage = toolMessage.content.find((i) => i.type === "input_image");
						if (inputImage) return inputImage;
						/**
						* Check for computer_screenshot type (legacy format)
						*/
						const oaiScreenshot = toolMessage.content.find((i) => i.type === "computer_screenshot");
						if (oaiScreenshot) return oaiScreenshot;
						/**
						* Convert image_url content block to input_image format
						*/
						const lcImage = toolMessage.content.find((i) => i.type === "image_url");
						if (lcImage) return {
							type: "input_image",
							image_url: typeof lcImage.image_url === "string" ? lcImage.image_url : lcImage.image_url.url
						};
					}
					throw new Error("Invalid computer call output");
				})(),
				call_id: toolMessage.tool_call_id
			};
			if (toolMessage.additional_kwargs?.customTool) return {
				type: "custom_tool_call_output",
				call_id: toolMessage.tool_call_id,
				output: toolMessage.content
			};
			const isProviderNativeContent = Array.isArray(toolMessage.content) && toolMessage.content.every((item) => typeof item === "object" && item !== null && "type" in item && (item.type === "input_file" || item.type === "input_image" || item.type === "input_text"));
			return {
				type: "function_call_output",
				call_id: toolMessage.tool_call_id,
				id: toolMessage.id?.startsWith("fc_") ? toolMessage.id : void 0,
				output: isProviderNativeContent ? toolMessage.content : typeof toolMessage.content !== "string" ? JSON.stringify(toolMessage.content) : toolMessage.content
			};
		}
		if (role === "assistant") {
			if (!zdrEnabled && responseMetadata?.output != null && Array.isArray(responseMetadata?.output) && responseMetadata?.output.length > 0 && responseMetadata?.output.every((item) => "type" in item)) return responseMetadata?.output;
			const input = [];
			const reasoning = additional_kwargs?.reasoning;
			const hasEncryptedContent = !!reasoning?.encrypted_content;
			/**
			* With ZDR enabled, OpenAI does not retain reasoning items, so we only send
			* them when encrypted content is available (via include: ["reasoning.encrypted_content"]).
			* With ZDR disabled, we include reasoning item ids so OpenAI can reference them, as it's storing them.
			*/
			if (reasoning && (!zdrEnabled || hasEncryptedContent)) {
				const reasoningItem = convertReasoningSummaryToResponsesReasoningItem(reasoning);
				input.push(reasoningItem);
			}
			let { content } = lcMsg;
			if (additional_kwargs?.refusal) {
				if (typeof content === "string") content = [{
					type: "output_text",
					text: content,
					annotations: []
				}];
				content = [...content, {
					type: "refusal",
					refusal: additional_kwargs.refusal
				}];
			}
			if (typeof content === "string" || content.length > 0) {
				const messageItem = {
					type: "message",
					role: "assistant",
					...lcMsg.id && !zdrEnabled && lcMsg.id.startsWith("msg_") ? { id: lcMsg.id } : {},
					content: iife$1(() => {
						if (typeof content === "string") return content;
						return content.flatMap((item) => {
							if (item.type === "text") {
								const textItem = item;
								return {
									type: "output_text",
									text: textItem.text,
									annotations: (textItem.annotations ?? []).map(convertLangChainAnnotationToOpenAI)
								};
							}
							if (item.type === "output_text" || item.type === "refusal") return item;
							return [];
						});
					}),
					phase: iife$1(() => {
						if (!Array.isArray(content)) return;
						return content.find((item) => "phase" in item && typeof item.phase === "string")?.phase;
					})
				};
				input.push(messageItem);
			}
			const functionCallIds = additional_kwargs?.[_FUNCTION_CALL_IDS_MAP_KEY];
			const customToolCallIds = additional_kwargs?.[_CUSTOM_TOOL_CALL_IDS_MAP_KEY];
			if (AIMessage.isInstance(lcMsg) && !!lcMsg.tool_calls?.length) input.push(...lcMsg.tool_calls.map((toolCall) => {
				if (isCustomToolCall(toolCall, customToolCallIds)) return {
					type: "custom_tool_call",
					id: "call_id" in toolCall && typeof toolCall.call_id === "string" ? toolCall.call_id : customToolCallIds?.[toolCall.id ?? ""] ?? "",
					call_id: toolCall.id ?? "",
					input: toolCall.args.input,
					name: toolCall.name
				};
				if (isComputerToolCall(toolCall)) return {
					type: "computer_call",
					id: toolCall.call_id,
					call_id: toolCall.id ?? "",
					action: toolCall.args.action
				};
				return {
					type: "function_call",
					name: toolCall.name,
					arguments: JSON.stringify(toolCall.args),
					call_id: toolCall.id,
					...!zdrEnabled ? { id: functionCallIds?.[toolCall.id] } : {}
				};
			}));
			else if (additional_kwargs?.tool_calls) input.push(...additional_kwargs.tool_calls.map((toolCall) => ({
				type: "function_call",
				name: toolCall.function.name,
				call_id: toolCall.id,
				arguments: toolCall.function.arguments,
				...!zdrEnabled ? { id: functionCallIds?.[toolCall.id] } : {}
			})));
			const toolOutputs = (responseMetadata?.output)?.length ? responseMetadata?.output : additional_kwargs.tool_outputs;
			const fallthroughCallTypes = [
				"computer_call",
				"mcp_call",
				"code_interpreter_call",
				"image_generation_call",
				"shell_call",
				"local_shell_call"
			];
			if (toolOutputs != null) {
				const fallthroughCalls = toolOutputs?.filter((item) => fallthroughCallTypes.includes(item.type));
				if (fallthroughCalls.length > 0) input.push(...fallthroughCalls);
			}
			return input;
		}
		if (role === "user" || role === "system" || role === "developer") {
			if (typeof lcMsg.content === "string") return {
				type: "message",
				role,
				content: lcMsg.content
			};
			const messages = [];
			const content = lcMsg.content.flatMap((item) => {
				if (item.type === "mcp_approval_response") messages.push({
					type: "mcp_approval_response",
					approval_request_id: item.approval_request_id,
					approve: item.approve
				});
				if (isDataContentBlock(item)) {
					if (item.type === "file") {
						const filename = getFilenameFromMetadata(item);
						if (item.source_type === "url") return {
							type: "input_file",
							file_url: item.url,
							...filename ? { filename } : {}
						};
						if (item.source_type === "id") return {
							type: "input_file",
							file_id: item.id,
							...filename ? { filename } : {}
						};
						if (item.source_type === "base64") return {
							type: "input_file",
							file_data: `data:${item.mime_type ?? ""};base64,${item.data}`,
							filename: getRequiredFilenameFromMetadata(item)
						};
					}
					return convertToProviderContentBlock(item, completionsApiContentBlockConverter);
				}
				if (item.type === "text") return {
					type: "input_text",
					text: item.text
				};
				if (item.type === "image_url") return {
					type: "input_image",
					image_url: iife$1(() => {
						if (typeof item.image_url === "string") return item.image_url;
						else if (typeof item.image_url === "object" && item.image_url !== null && "url" in item.image_url) return item.image_url.url;
					}),
					detail: iife$1(() => {
						if (typeof item.image_url === "string") return "auto";
						else if (typeof item.image_url === "object" && item.image_url !== null && "detail" in item.image_url) return item.image_url.detail;
					})
				};
				if (item.type === "input_text" || item.type === "input_image" || item.type === "input_file") return item;
				return [];
			});
			if (content.length > 0) messages.push({
				type: "message",
				role,
				content
			});
			return messages;
		}
		console.warn(`Unsupported role found when converting to OpenAI Responses API: ${role}`);
		return [];
	});
};
//#endregion
//#region node_modules/@langchain/openai/dist/utils/responses_stream_events.js
async function* convertOpenAIResponsesStream(source, options = {}) {
	const shouldStreamUsage = options.streamUsage ?? true;
	const provider = options.provider ?? "openai";
	const blockAccumulators = /* @__PURE__ */ new Map();
	const blockKeyToIndex = /* @__PURE__ */ new Map();
	let nextBlockIndex = 0;
	let messageStarted = false;
	let messageId;
	let usageSnapshot;
	let finishReason;
	let responseMetadata;
	const finalizedBlockIndices = /* @__PURE__ */ new Set();
	const getOrCreateBlockIndex = (key, initial) => {
		const existing = blockKeyToIndex.get(key);
		if (existing !== void 0) return {
			index: existing,
			isNew: false
		};
		const index = nextBlockIndex++;
		blockKeyToIndex.set(key, index);
		blockAccumulators.set(index, { ...initial });
		return {
			index,
			isNew: true
		};
	};
	const ensureMessageStart = function* () {
		if (!messageStarted) {
			messageStarted = true;
			yield {
				event: "message-start",
				id: messageId
			};
		}
	};
	const finalizeBlock = function* (index) {
		if (finalizedBlockIndices.has(index)) return;
		const acc = blockAccumulators.get(index);
		if (!acc) return;
		finalizedBlockIndices.add(index);
		yield {
			event: "content-block-finish",
			index,
			content: finalizeContentBlock(acc)
		};
	};
	for await (const event of source) {
		if (event.type === "response.created") {
			messageId = event.response.id;
			yield* ensureMessageStart();
			yield {
				event: "provider",
				provider,
				name: "response.created",
				payload: {
					model: event.response.model,
					id: event.response.id
				}
			};
			continue;
		}
		if (event.type === "response.output_text.delta") {
			yield* ensureMessageStart();
			const { index, isNew } = getOrCreateBlockIndex(`text:${event.output_index}:${event.content_index}`, {
				type: "text",
				text: ""
			});
			if (isNew) yield {
				event: "content-block-start",
				index,
				content: {
					type: "text",
					text: ""
				}
			};
			const acc = blockAccumulators.get(index);
			acc.text = (acc.text ?? "") + event.delta;
			yield {
				event: "content-block-delta",
				index,
				delta: {
					type: "text-delta",
					text: event.delta
				}
			};
			continue;
		}
		if (event.type === "response.reasoning_summary_text.delta") {
			yield* ensureMessageStart();
			const { index, isNew } = getOrCreateBlockIndex(`reasoning:${event.output_index}:${event.summary_index}`, {
				type: "reasoning",
				reasoning: ""
			});
			if (isNew) yield {
				event: "content-block-start",
				index,
				content: {
					type: "reasoning",
					reasoning: ""
				}
			};
			const acc = blockAccumulators.get(index);
			acc.reasoning = (acc.reasoning ?? "") + event.delta;
			yield {
				event: "content-block-delta",
				index,
				delta: {
					type: "reasoning-delta",
					reasoning: event.delta
				}
			};
			continue;
		}
		if (event.type === "response.output_item.added" && (event.item.type === "function_call" || event.item.type === "custom_tool_call")) {
			yield* ensureMessageStart();
			const key = `tool:${event.output_index}`;
			const isCustom = event.item.type === "custom_tool_call";
			const initialArgs = event.item.type === "function_call" ? event.item.arguments ?? "" : event.item.input ?? "";
			const { index, isNew } = getOrCreateBlockIndex(key, {
				type: "tool_call_chunk",
				id: event.item.call_id,
				name: event.item.name,
				args: initialArgs,
				index: event.output_index,
				...isCustom ? { isCustomTool: true } : {}
			});
			if (isNew) yield {
				event: "content-block-start",
				index,
				content: {
					type: "tool_call_chunk",
					id: event.item.call_id,
					name: event.item.name,
					args: initialArgs,
					index: event.output_index
				}
			};
			if (initialArgs) {
				const acc = blockAccumulators.get(index);
				yield {
					event: "content-block-delta",
					index,
					delta: {
						type: "block-delta",
						fields: {
							type: "tool_call_chunk",
							...acc.id != null ? { id: acc.id } : {},
							...acc.name != null ? { name: acc.name } : {},
							args: acc.args
						}
					}
				};
			}
			continue;
		}
		if (event.type === "response.function_call_arguments.delta" || event.type === "response.custom_tool_call_input.delta") {
			yield* ensureMessageStart();
			const { index, isNew } = getOrCreateBlockIndex(`tool:${event.output_index}`, {
				type: "tool_call_chunk",
				args: "",
				index: event.output_index,
				...event.type === "response.custom_tool_call_input.delta" ? { isCustomTool: true } : {}
			});
			if (isNew) yield {
				event: "content-block-start",
				index,
				content: {
					type: "tool_call_chunk",
					args: "",
					index: event.output_index
				}
			};
			const acc = blockAccumulators.get(index);
			acc.args = (acc.args ?? "") + event.delta;
			yield {
				event: "content-block-delta",
				index,
				delta: {
					type: "block-delta",
					fields: {
						type: "tool_call_chunk",
						...acc.id != null ? { id: acc.id } : {},
						...acc.name != null ? { name: acc.name } : {},
						args: acc.args
					}
				}
			};
			continue;
		}
		if (event.type === "response.output_item.done" && (event.item.type === "function_call" || event.item.type === "custom_tool_call")) {
			yield* ensureMessageStart();
			const key = `tool:${event.output_index}`;
			const args = event.item.type === "function_call" ? event.item.arguments ?? "" : event.item.input ?? "";
			const { index, isNew } = getOrCreateBlockIndex(key, {
				type: "tool_call_chunk",
				id: event.item.call_id,
				name: event.item.name,
				args,
				index: event.output_index
			});
			if (isNew) yield {
				event: "content-block-start",
				index,
				content: {
					type: "tool_call_chunk",
					id: event.item.call_id,
					name: event.item.name,
					args,
					index: event.output_index
				}
			};
			else {
				const acc = blockAccumulators.get(index);
				acc.args = args;
				acc.id = event.item.call_id;
				acc.name = event.item.name;
			}
			yield* finalizeBlock(index);
			continue;
		}
		if (event.type === "response.completed" || event.type === "response.incomplete") {
			yield* ensureMessageStart();
			messageId = event.response.id;
			finishReason = mapResponseStatusToFinishReason(event.response.status, event.type);
			responseMetadata = {
				model_provider: provider,
				id: event.response.id,
				model: event.response.model,
				status: event.response.status
			};
			if (shouldStreamUsage && event.response.usage) {
				usageSnapshot = convertResponsesUsageToUsageMetadata(event.response.usage);
				yield {
					event: "usage",
					usage: usageSnapshot
				};
			}
			continue;
		}
		if (event.type === "response.image_generation_call.partial_image") continue;
		yield* ensureMessageStart();
		yield {
			event: "provider",
			provider,
			name: event.type,
			payload: event
		};
	}
	if (!messageStarted) yield { event: "message-start" };
	for (const [index] of blockAccumulators) if (!finalizedBlockIndices.has(index)) yield* finalizeBlock(index);
	yield {
		event: "message-finish",
		reason: finishReason,
		...usageSnapshot ? { usage: usageSnapshot } : {},
		...responseMetadata ? { responseMetadata } : {}
	};
}
function mapResponseStatusToFinishReason(status, eventType) {
	if (eventType === "response.incomplete") return "length";
	if (status === "completed") return "stop";
	if (status === "incomplete") return "length";
	return "stop";
}
//#endregion
//#region node_modules/@langchain/openai/dist/chat_models/responses.js
/**
* OpenAI Responses API implementation.
*
* Will be exported in a later version of @langchain/openai.
*
* @internal
*/
var ChatOpenAIResponses = class extends BaseChatOpenAI {
	constructor(modelOrFields, fieldsArg) {
		super(getChatOpenAIModelParams(modelOrFields, fieldsArg));
	}
	invocationParams(options) {
		let strict;
		if (options?.strict !== void 0) strict = options.strict;
		if (strict === void 0 && this.supportsStrictToolCalling !== void 0) strict = this.supportsStrictToolCalling;
		const params = {
			model: this.model,
			temperature: this.temperature,
			top_p: this.topP,
			user: this.user,
			service_tier: this.service_tier,
			stream: this.streaming,
			previous_response_id: options?.previous_response_id,
			truncation: options?.truncation,
			include: options?.include,
			tools: options?.tools?.length ? this._reduceChatOpenAITools(options.tools, {
				stream: this.streaming,
				strict
			}) : void 0,
			tool_choice: isBuiltInToolChoice(options?.tool_choice) ? options?.tool_choice : (() => {
				const formatted = formatToOpenAIToolChoice(options?.tool_choice);
				if (typeof formatted === "object" && "type" in formatted) {
					if (formatted.type === "function") return {
						type: "function",
						name: formatted.function.name
					};
					else if (formatted.type === "allowed_tools") return {
						type: "allowed_tools",
						mode: formatted.allowed_tools.mode,
						tools: formatted.allowed_tools.tools
					};
					else if (formatted.type === "custom") return {
						type: "custom",
						name: formatted.custom.name
					};
				}
			})(),
			text: (() => {
				if (options?.text) return options.text;
				const format = this._getResponseFormat(options?.response_format);
				if (format?.type === "json_schema") {
					if (format.json_schema.schema != null) return {
						format: {
							type: "json_schema",
							schema: format.json_schema.schema,
							description: format.json_schema.description,
							name: format.json_schema.name,
							strict: format.json_schema.strict
						},
						verbosity: options?.verbosity
					};
					return;
				}
				return {
					format,
					verbosity: options?.verbosity
				};
			})(),
			parallel_tool_calls: options?.parallel_tool_calls,
			max_output_tokens: this.maxTokens === -1 ? void 0 : this.maxTokens,
			prompt_cache_key: options?.promptCacheKey ?? this.promptCacheKey,
			prompt_cache_retention: options?.promptCacheRetention ?? this.promptCacheRetention,
			...this.zdrEnabled ? { store: false } : {},
			...this.modelKwargs
		};
		const reasoning = this._getReasoningParams(options);
		if (reasoning !== void 0) params.reasoning = reasoning;
		return params;
	}
	async _generate(messages, options, runManager) {
		options.signal?.throwIfAborted();
		const invocationParams = this.invocationParams(options);
		if (invocationParams.stream) {
			const stream = this._streamResponseChunks(messages, options, runManager);
			let finalChunk;
			for await (const chunk of stream) {
				chunk.message.response_metadata = {
					...chunk.generationInfo,
					...chunk.message.response_metadata
				};
				finalChunk = finalChunk?.concat(chunk) ?? chunk;
			}
			return {
				generations: finalChunk ? [finalChunk] : [],
				llmOutput: { estimatedTokenUsage: (finalChunk?.message)?.usage_metadata }
			};
		} else {
			const data = await this.completionWithRetry({
				input: convertMessagesToResponsesInput({
					messages,
					zdrEnabled: this.zdrEnabled ?? false,
					model: this.model
				}),
				...invocationParams,
				stream: false
			}, {
				signal: options?.signal,
				...options?.options
			});
			return {
				generations: [{
					text: data.output_text,
					message: convertResponsesMessageToAIMessage(data)
				}],
				llmOutput: {
					id: data.id,
					estimatedTokenUsage: data.usage ? {
						promptTokens: data.usage.input_tokens,
						completionTokens: data.usage.output_tokens,
						totalTokens: data.usage.total_tokens
					} : void 0
				}
			};
		}
	}
	async *_streamChatModelEvents(messages, options, _runManager) {
		const streamIterable = await this.completionWithRetry({
			...this.invocationParams(options),
			input: convertMessagesToResponsesInput({
				messages,
				zdrEnabled: this.zdrEnabled ?? false,
				model: this.model
			}),
			stream: true
		}, options);
		const shouldStreamUsage = this.streamUsage ?? options.streamUsage;
		const abortableStream = async function* (source, signal) {
			for await (const data of source) {
				if (signal?.aborted) return;
				yield data;
			}
		};
		yield* convertOpenAIResponsesStream(abortableStream(streamIterable, options.signal), {
			streamUsage: shouldStreamUsage ?? true,
			provider: this.streamEventProvider
		});
	}
	/** Provider id used in native stream protocol passthrough events. */
	get streamEventProvider() {
		return "openai";
	}
	async *_streamResponseChunks(messages, options, runManager) {
		const streamIterable = await this.completionWithRetry({
			...this.invocationParams(options),
			input: convertMessagesToResponsesInput({
				messages,
				zdrEnabled: this.zdrEnabled ?? false,
				model: this.model
			}),
			stream: true
		}, options);
		try {
			for await (const data of streamIterable) {
				if (options.signal?.aborted) return;
				const chunk = convertResponsesDeltaToChatGenerationChunk(data);
				if (chunk == null) continue;
				yield chunk;
				await runManager?.handleLLMNewToken(chunk.text || "", {
					prompt: options.promptIndex ?? 0,
					completion: 0
				}, void 0, void 0, void 0, { chunk });
			}
		} catch (e) {
			throw wrapOpenAIClientError(e);
		}
	}
	async completionWithRetry(request, requestOptions) {
		return this.caller.call(async () => {
			const clientOptions = this._getClientOptions(requestOptions);
			try {
				if (request.text?.format?.type === "json_schema" && !request.stream) return await this.client.responses.parse(request, clientOptions);
				return await this.client.responses.create(request, clientOptions);
			} catch (e) {
				throw wrapOpenAIClientError(e);
			}
		});
	}
	/** @internal */
	_reduceChatOpenAITools(tools, fields) {
		const reducedTools = [];
		for (const tool of tools) if (isBuiltInTool(tool)) {
			if (tool.type === "image_generation" && fields?.stream) tool.partial_images = 1;
			reducedTools.push(tool);
		} else if (isCustomTool(tool)) {
			const customToolData = tool.metadata.customTool;
			reducedTools.push({
				type: "custom",
				name: customToolData.name,
				description: customToolData.description,
				format: customToolData.format
			});
		} else if (isOpenAITool(tool)) {
			const extra = {};
			for (const [k, v] of Object.entries(tool)) if (k !== "type" && k !== "function") extra[k] = v;
			reducedTools.push({
				type: "function",
				name: tool.function.name,
				parameters: tool.function.parameters,
				description: tool.function.description,
				strict: fields?.strict ?? null,
				...extra
			});
		} else if (isOpenAICustomTool(tool)) reducedTools.push(convertCompletionsCustomTool(tool));
		return reducedTools;
	}
};
//#endregion
//#region node_modules/@langchain/openai/dist/chat_models/index.js
/**
* OpenAI chat model integration.
*
* To use with Azure, import the `AzureChatOpenAI` class.
*
* Setup:
* Install `@langchain/openai` and set an environment variable named `OPENAI_API_KEY`.
*
* ```bash
* npm install @langchain/openai
* export OPENAI_API_KEY="your-api-key"
* ```
*
* ## [Constructor args](https://api.js.langchain.com/classes/langchain_openai.ChatOpenAI.html#constructor)
*
* ## [Runtime args](https://api.js.langchain.com/interfaces/langchain_openai.ChatOpenAICallOptions.html)
*
* Runtime args can be passed as the second argument to any of the base runnable methods `.invoke`. `.stream`, `.batch`, etc.
* They can also be passed via `.withConfig`, or the second arg in `.bindTools`, like shown in the examples below:
*
* ```typescript
* // When calling `.withConfig`, call options should be passed via the first argument
* const llmWithArgsBound = llm.withConfig({
*   stop: ["\n"],
*   tools: [...],
* });
*
* // When calling `.bindTools`, call options should be passed via the second argument
* const llmWithTools = llm.bindTools(
*   [...],
*   {
*     tool_choice: "auto",
*   }
* );
* ```
*
* ## Examples
*
* <details open>
* <summary><strong>Instantiate</strong></summary>
*
* ```typescript
* import { ChatOpenAI } from '@langchain/openai';
*
* const llm = new ChatOpenAI({
*   model: "gpt-4o-mini",
*   temperature: 0,
*   maxTokens: undefined,
*   timeout: undefined,
*   maxRetries: 2,
*   // apiKey: "...",
*   // configuration: {
*   //   baseURL: "...",
*   // }
*   // organization: "...",
*   // other params...
* });
* ```
* </details>
*
* <br />
*
* <details>
* <summary><strong>Invoking</strong></summary>
*
* ```typescript
* const input = `Translate "I love programming" into French.`;
*
* // Models also accept a list of chat messages or a formatted prompt
* const result = await llm.invoke(input);
* console.log(result);
* ```
*
* ```txt
* AIMessage {
*   "id": "chatcmpl-9u4Mpu44CbPjwYFkTbeoZgvzB00Tz",
*   "content": "J'adore la programmation.",
*   "response_metadata": {
*     "tokenUsage": {
*       "completionTokens": 5,
*       "promptTokens": 28,
*       "totalTokens": 33
*     },
*     "finish_reason": "stop",
*     "system_fingerprint": "fp_3aa7262c27"
*   },
*   "usage_metadata": {
*     "input_tokens": 28,
*     "output_tokens": 5,
*     "total_tokens": 33
*   }
* }
* ```
* </details>
*
* <br />
*
* <details>
* <summary><strong>Streaming Chunks</strong></summary>
*
* ```typescript
* for await (const chunk of await llm.stream(input)) {
*   console.log(chunk);
* }
* ```
*
* ```txt
* AIMessageChunk {
*   "id": "chatcmpl-9u4NWB7yUeHCKdLr6jP3HpaOYHTqs",
*   "content": ""
* }
* AIMessageChunk {
*   "content": "J"
* }
* AIMessageChunk {
*   "content": "'adore"
* }
* AIMessageChunk {
*   "content": " la"
* }
* AIMessageChunk {
*   "content": " programmation",,
* }
* AIMessageChunk {
*   "content": ".",,
* }
* AIMessageChunk {
*   "content": "",
*   "response_metadata": {
*     "finish_reason": "stop",
*     "system_fingerprint": "fp_c9aa9c0491"
*   },
* }
* AIMessageChunk {
*   "content": "",
*   "usage_metadata": {
*     "input_tokens": 28,
*     "output_tokens": 5,
*     "total_tokens": 33
*   }
* }
* ```
* </details>
*
* <br />
*
* <details>
* <summary><strong>Aggregate Streamed Chunks</strong></summary>
*
* ```typescript
* import { AIMessageChunk } from '@langchain/core/messages';
* import { concat } from '@langchain/core/utils/stream';
*
* const stream = await llm.stream(input);
* let full: AIMessageChunk | undefined;
* for await (const chunk of stream) {
*   full = !full ? chunk : concat(full, chunk);
* }
* console.log(full);
* ```
*
* ```txt
* AIMessageChunk {
*   "id": "chatcmpl-9u4PnX6Fy7OmK46DASy0bH6cxn5Xu",
*   "content": "J'adore la programmation.",
*   "response_metadata": {
*     "prompt": 0,
*     "completion": 0,
*     "finish_reason": "stop",
*   },
*   "usage_metadata": {
*     "input_tokens": 28,
*     "output_tokens": 5,
*     "total_tokens": 33
*   }
* }
* ```
* </details>
*
* <br />
*
* <details>
* <summary><strong>Bind tools</strong></summary>
*
* ```typescript
* import { z } from 'zod';
*
* const GetWeather = {
*   name: "GetWeather",
*   description: "Get the current weather in a given location",
*   schema: z.object({
*     location: z.string().describe("The city and state, e.g. San Francisco, CA")
*   }),
* }
*
* const GetPopulation = {
*   name: "GetPopulation",
*   description: "Get the current population in a given location",
*   schema: z.object({
*     location: z.string().describe("The city and state, e.g. San Francisco, CA")
*   }),
* }
*
* const llmWithTools = llm.bindTools(
*   [GetWeather, GetPopulation],
*   {
*     // strict: true  // enforce tool args schema is respected
*   }
* );
* const aiMsg = await llmWithTools.invoke(
*   "Which city is hotter today and which is bigger: LA or NY?"
* );
* console.log(aiMsg.tool_calls);
* ```
*
* ```txt
* [
*   {
*     name: 'GetWeather',
*     args: { location: 'Los Angeles, CA' },
*     type: 'tool_call',
*     id: 'call_uPU4FiFzoKAtMxfmPnfQL6UK'
*   },
*   {
*     name: 'GetWeather',
*     args: { location: 'New York, NY' },
*     type: 'tool_call',
*     id: 'call_UNkEwuQsHrGYqgDQuH9nPAtX'
*   },
*   {
*     name: 'GetPopulation',
*     args: { location: 'Los Angeles, CA' },
*     type: 'tool_call',
*     id: 'call_kL3OXxaq9OjIKqRTpvjaCH14'
*   },
*   {
*     name: 'GetPopulation',
*     args: { location: 'New York, NY' },
*     type: 'tool_call',
*     id: 'call_s9KQB1UWj45LLGaEnjz0179q'
*   }
* ]
* ```
* </details>
*
* <br />
*
* <details>
* <summary><strong>Structured Output</strong></summary>
*
* ```typescript
* import { z } from 'zod';
*
* const Joke = z.object({
*   setup: z.string().describe("The setup of the joke"),
*   punchline: z.string().describe("The punchline to the joke"),
*   rating: z.number().nullable().describe("How funny the joke is, from 1 to 10")
* }).describe('Joke to tell user.');
*
* const structuredLlm = llm.withStructuredOutput(Joke, {
*   name: "Joke",
*   strict: true, // Optionally enable OpenAI structured outputs
* });
* const jokeResult = await structuredLlm.invoke("Tell me a joke about cats");
* console.log(jokeResult);
* ```
*
* ```txt
* {
*   setup: 'Why was the cat sitting on the computer?',
*   punchline: 'Because it wanted to keep an eye on the mouse!',
*   rating: 7
* }
* ```
* </details>
*
* <br />
*
* <details>
* <summary><strong>JSON Object Response Format</strong></summary>
*
* ```typescript
* const jsonLlm = llm.withConfig({ response_format: { type: "json_object" } });
* const jsonLlmAiMsg = await jsonLlm.invoke(
*   "Return a JSON object with key 'randomInts' and a value of 10 random ints in [0-99]"
* );
* console.log(jsonLlmAiMsg.content);
* ```
*
* ```txt
* {
*   "randomInts": [23, 87, 45, 12, 78, 34, 56, 90, 11, 67]
* }
* ```
* </details>
*
* <br />
*
* <details>
* <summary><strong>Multimodal</strong></summary>
*
* ```typescript
* import { HumanMessage } from '@langchain/core/messages';
*
* const imageUrl = "https://example.com/image.jpg";
* const imageData = await fetch(imageUrl).then(res => res.arrayBuffer());
* const base64Image = Buffer.from(imageData).toString('base64');
*
* const message = new HumanMessage({
*   content: [
*     { type: "text", text: "describe the weather in this image" },
*     {
*       type: "image_url",
*       image_url: { url: `data:image/jpeg;base64,${base64Image}` },
*     },
*   ]
* });
*
* const imageDescriptionAiMsg = await llm.invoke([message]);
* console.log(imageDescriptionAiMsg.content);
* ```
*
* ```txt
* The weather in the image appears to be clear and sunny. The sky is mostly blue with a few scattered white clouds, indicating fair weather. The bright sunlight is casting shadows on the green, grassy hill, suggesting it is a pleasant day with good visibility. There are no signs of rain or stormy conditions.
* ```
* </details>
*
* <br />
*
* <details>
* <summary><strong>Usage Metadata</strong></summary>
*
* ```typescript
* const aiMsgForMetadata = await llm.invoke(input);
* console.log(aiMsgForMetadata.usage_metadata);
* ```
*
* ```txt
* { input_tokens: 28, output_tokens: 5, total_tokens: 33 }
* ```
* </details>
*
* <br />
*
* <details>
* <summary><strong>Logprobs</strong></summary>
*
* ```typescript
* const logprobsLlm = new ChatOpenAI({ model: "gpt-4o-mini", logprobs: true });
* const aiMsgForLogprobs = await logprobsLlm.invoke(input);
* console.log(aiMsgForLogprobs.response_metadata.logprobs);
* ```
*
* ```txt
* {
*   content: [
*     {
*       token: 'J',
*       logprob: -0.000050616763,
*       bytes: [Array],
*       top_logprobs: []
*     },
*     {
*       token: "'",
*       logprob: -0.01868736,
*       bytes: [Array],
*       top_logprobs: []
*     },
*     {
*       token: 'ad',
*       logprob: -0.0000030545007,
*       bytes: [Array],
*       top_logprobs: []
*     },
*     { token: 'ore', logprob: 0, bytes: [Array], top_logprobs: [] },
*     {
*       token: ' la',
*       logprob: -0.515404,
*       bytes: [Array],
*       top_logprobs: []
*     },
*     {
*       token: ' programm',
*       logprob: -0.0000118755715,
*       bytes: [Array],
*       top_logprobs: []
*     },
*     { token: 'ation', logprob: 0, bytes: [Array], top_logprobs: [] },
*     {
*       token: '.',
*       logprob: -0.0000037697225,
*       bytes: [Array],
*       top_logprobs: []
*     }
*   ],
*   refusal: null
* }
* ```
* </details>
*
* <br />
*
* <details>
* <summary><strong>Response Metadata</strong></summary>
*
* ```typescript
* const aiMsgForResponseMetadata = await llm.invoke(input);
* console.log(aiMsgForResponseMetadata.response_metadata);
* ```
*
* ```txt
* {
*   tokenUsage: { completionTokens: 5, promptTokens: 28, totalTokens: 33 },
*   finish_reason: 'stop',
*   system_fingerprint: 'fp_3aa7262c27'
* }
* ```
* </details>
*
* <br />
*
* <details>
* <summary><strong>JSON Schema Structured Output</strong></summary>
*
* ```typescript
* const llmForJsonSchema = new ChatOpenAI({
*   model: "gpt-4o-2024-08-06",
* }).withStructuredOutput(
*   z.object({
*     command: z.string().describe("The command to execute"),
*     expectedOutput: z.string().describe("The expected output of the command"),
*     options: z
*       .array(z.string())
*       .describe("The options you can pass to the command"),
*   }),
*   {
*     method: "jsonSchema",
*     strict: true, // Optional when using the `jsonSchema` method
*   }
* );
*
* const jsonSchemaRes = await llmForJsonSchema.invoke(
*   "What is the command to list files in a directory?"
* );
* console.log(jsonSchemaRes);
* ```
*
* ```txt
* {
*   command: 'ls',
*   expectedOutput: 'A list of files and subdirectories within the specified directory.',
*   options: [
*     '-a: include directory entries whose names begin with a dot (.).',
*     '-l: use a long listing format.',
*     '-h: with -l, print sizes in human readable format (e.g., 1K, 234M, 2G).',
*     '-t: sort by time, newest first.',
*     '-r: reverse order while sorting.',
*     '-S: sort by file size, largest first.',
*     '-R: list subdirectories recursively.'
*   ]
* }
* ```
* </details>
*
* <br />
*
* <details>
* <summary><strong>Audio Outputs</strong></summary>
*
* ```typescript
* import { ChatOpenAI } from "@langchain/openai";
*
* const modelWithAudioOutput = new ChatOpenAI({
*   model: "gpt-4o-audio-preview",
*   // You may also pass these fields to `.withConfig` as a call argument.
*   modalities: ["text", "audio"], // Specifies that the model should output audio.
*   audio: {
*     voice: "alloy",
*     format: "wav",
*   },
* });
*
* const audioOutputResult = await modelWithAudioOutput.invoke("Tell me a joke about cats.");
* const castMessageContent = audioOutputResult.content[0] as Record<string, any>;
*
* console.log({
*   ...castMessageContent,
*   data: castMessageContent.data.slice(0, 100) // Sliced for brevity
* })
* ```
*
* ```txt
* {
*   id: 'audio_67117718c6008190a3afad3e3054b9b6',
*   data: 'UklGRqYwBgBXQVZFZm10IBAAAAABAAEAwF0AAIC7AAACABAATElTVBoAAABJTkZPSVNGVA4AAABMYXZmNTguMjkuMTAwAGRhdGFg',
*   expires_at: 1729201448,
*   transcript: 'Sure! Why did the cat sit on the computer? Because it wanted to keep an eye on the mouse!'
* }
* ```
* </details>
*
* <br />
*
* <details>
* <summary><strong>Audio Outputs</strong></summary>
*
* ```typescript
* import { ChatOpenAI } from "@langchain/openai";
*
* const modelWithAudioOutput = new ChatOpenAI({
*   model: "gpt-4o-audio-preview",
*   // You may also pass these fields to `.withConfig` as a call argument.
*   modalities: ["text", "audio"], // Specifies that the model should output audio.
*   audio: {
*     voice: "alloy",
*     format: "wav",
*   },
* });
*
* const audioOutputResult = await modelWithAudioOutput.invoke("Tell me a joke about cats.");
* const castAudioContent = audioOutputResult.additional_kwargs.audio as Record<string, any>;
*
* console.log({
*   ...castAudioContent,
*   data: castAudioContent.data.slice(0, 100) // Sliced for brevity
* })
* ```
*
* ```txt
* {
*   id: 'audio_67117718c6008190a3afad3e3054b9b6',
*   data: 'UklGRqYwBgBXQVZFZm10IBAAAAABAAEAwF0AAIC7AAACABAATElTVBoAAABJTkZPSVNGVA4AAABMYXZmNTguMjkuMTAwAGRhdGFg',
*   expires_at: 1729201448,
*   transcript: 'Sure! Why did the cat sit on the computer? Because it wanted to keep an eye on the mouse!'
* }
* ```
* </details>
*
* <br />
*/
var ChatOpenAI = class ChatOpenAI extends BaseChatOpenAI {
	/**
	* Whether to use the responses API for all requests. If `false` the responses API will be used
	* only when required in order to fulfill the request.
	*/
	useResponsesApi = false;
	responses;
	completions;
	get lc_serializable_keys() {
		return [...super.lc_serializable_keys, "useResponsesApi"];
	}
	get callKeys() {
		return [...super.callKeys, "useResponsesApi"];
	}
	fields;
	constructor(modelOrFields, fieldsArg) {
		const fields = getChatOpenAIModelParams(modelOrFields, fieldsArg);
		super(fields);
		this.fields = fields;
		this.useResponsesApi = fields?.useResponsesApi ?? false;
		this.responses = fields?.responses ?? new ChatOpenAIResponses(fields);
		this.completions = fields?.completions ?? new ChatOpenAICompletions(fields);
	}
	_useResponsesApi(options) {
		const usesBuiltInTools = options?.tools?.some(isBuiltInTool);
		const hasResponsesOnlyKwargs = options?.previous_response_id != null || options?.text != null || options?.truncation != null || options?.include != null || options?.reasoning?.summary != null || this.reasoning?.summary != null;
		const hasCustomTools = options?.tools?.some(isOpenAICustomTool) || options?.tools?.some(isCustomTool);
		return this.useResponsesApi || usesBuiltInTools || hasResponsesOnlyKwargs || hasCustomTools || _modelPrefersResponsesAPI(this.model);
	}
	getLsParams(options) {
		const optionsWithDefaults = this._combineCallOptions(options);
		if (this._useResponsesApi(options)) return this.responses.getLsParams(optionsWithDefaults);
		return this.completions.getLsParams(optionsWithDefaults);
	}
	invocationParams(options) {
		const optionsWithDefaults = this._combineCallOptions(options);
		if (this._useResponsesApi(options)) return this.responses.invocationParams(optionsWithDefaults);
		return this.completions.invocationParams(optionsWithDefaults);
	}
	/** @ignore */
	async _generate(messages, options, runManager) {
		if (this._useResponsesApi(options)) return this.responses._generate(messages, options, runManager);
		return this.completions._generate(messages, options, runManager);
	}
	async *_streamChatModelEvents(messages, options, runManager) {
		if (this._useResponsesApi(options)) {
			yield* this.responses._streamChatModelEvents(messages, this._combineCallOptions(options), runManager);
			return;
		}
		yield* this.completions._streamChatModelEvents(messages, this._combineCallOptions(options), runManager);
	}
	async *_streamResponseChunks(messages, options, runManager) {
		if (this._useResponsesApi(options)) {
			yield* this.responses._streamResponseChunks(messages, this._combineCallOptions(options), runManager);
			return;
		}
		yield* this.completions._streamResponseChunks(messages, this._combineCallOptions(options), runManager);
	}
	withConfig(config) {
		const newModel = new ChatOpenAI(this.fields);
		newModel.defaultOptions = {
			...this.defaultOptions,
			...config
		};
		return newModel;
	}
};
object({ action: union([
	object({ type: literal("screenshot") }),
	object({
		type: literal("click"),
		x: number(),
		y: number(),
		button: _enum([
			"left",
			"right",
			"wheel",
			"back",
			"forward"
		]).default("left")
	}),
	object({
		type: literal("double_click"),
		x: number(),
		y: number(),
		button: _enum([
			"left",
			"right",
			"wheel",
			"back",
			"forward"
		]).default("left")
	}),
	object({
		type: literal("drag"),
		path: array(object({
			x: number(),
			y: number()
		}))
	}),
	object({
		type: literal("keypress"),
		keys: array(string())
	}),
	object({
		type: literal("move"),
		x: number(),
		y: number()
	}),
	object({
		type: literal("scroll"),
		x: number(),
		y: number(),
		scroll_x: number(),
		scroll_y: number()
	}),
	object({
		type: literal("type"),
		text: string()
	}),
	object({
		type: literal("wait"),
		duration: number().optional()
	})
]) });
union([object({
	type: literal("exec"),
	command: array(string()),
	env: record(string(), string()).optional(),
	working_directory: string().optional(),
	timeout_ms: number().optional(),
	user: string().optional()
})]);
object({
	commands: array(string()).describe("Array of shell commands to execute"),
	timeout_ms: number().optional().describe("Optional timeout in milliseconds for the commands"),
	max_output_length: number().optional().describe("Optional maximum number of characters to return from each command")
});
union([
	object({
		type: literal("create_file"),
		path: string(),
		diff: string()
	}),
	object({
		type: literal("update_file"),
		path: string(),
		diff: string()
	}),
	object({
		type: literal("delete_file"),
		path: string()
	})
]);
//#endregion
//#region node_modules/@langchain/openai/dist/index.js
var dist_exports = /* @__PURE__ */ __exportAll({ ChatOpenAI: () => ChatOpenAI });
//#endregion
export { ChatOpenAICompletions as n, dist_exports as t };
