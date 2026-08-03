import { r as __exportAll } from "../../_runtime.mjs";
import { Gt as concat, It as isInteropZodSchema, Sn as AIMessageChunk, Tt as isSerializableSchema, _ as createFunctionCallingParser, bn as getEnvironmentVariable, f as finalizeContentBlock, g as createContentParser, h as assembleStructuredOutputPipeline, l as BaseChatModel, n as convertToOpenAITool, pn as v4, rt as toJsonSchema, xn as AIMessage, zt as ChatGenerationChunk } from "./anthropic+[...].mjs";
import "../langchain__core+mustache.mjs";
//#region node_modules/@langchain/ollama/dist/utils/stream_events.js
/**
* Converts Ollama chat stream chunks into LangChain ChatModelStreamEvents.
*
* @module
*/
async function* convertOllamaStream(source, options = {}) {
	const shouldStreamUsage = options.streamUsage ?? true;
	const preferThinking = options.think ?? false;
	const blockAccumulators = /* @__PURE__ */ new Map();
	const blockKeyToIndex = /* @__PURE__ */ new Map();
	let nextBlockIndex = 0;
	let messageStarted = false;
	let usageSnapshot;
	let finishReason;
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
	for await (const chunk of source) {
		if (!messageStarted) {
			messageStarted = true;
			yield { event: "message-start" };
		}
		if (shouldStreamUsage) {
			const input = chunk.prompt_eval_count ?? 0;
			const output = chunk.eval_count ?? 0;
			if (input > 0 || output > 0) {
				usageSnapshot = {
					input_tokens: input,
					output_tokens: output,
					total_tokens: input + output
				};
				yield {
					event: "usage",
					usage: usageSnapshot
				};
			}
		}
		if (chunk.done_reason) finishReason = mapOllamaDoneReason(chunk.done_reason);
		const { message } = chunk;
		if (preferThinking && message.thinking) {
			const { index, isNew } = getOrCreateBlockIndex("reasoning", {
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
			acc.reasoning = (acc.reasoning ?? "") + message.thinking;
			yield {
				event: "content-block-delta",
				index,
				delta: {
					type: "reasoning-delta",
					reasoning: message.thinking
				}
			};
		}
		if (message.content) {
			const { index, isNew } = getOrCreateBlockIndex("text", {
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
			acc.text = (acc.text ?? "") + message.content;
			yield {
				event: "content-block-delta",
				index,
				delta: {
					type: "text-delta",
					text: message.content
				}
			};
		}
		if (message.tool_calls?.length) for (let i = 0; i < message.tool_calls.length; i++) {
			const tc = message.tool_calls[i];
			const key = `tool:${i}`;
			const args = typeof tc.function.arguments === "string" ? tc.function.arguments : JSON.stringify(tc.function.arguments);
			const { index, isNew } = getOrCreateBlockIndex(key, {
				type: "tool_call_chunk",
				name: tc.function.name,
				args: "",
				index: i
			});
			if (isNew) yield {
				event: "content-block-start",
				index,
				content: {
					type: "tool_call_chunk",
					name: tc.function.name,
					args: "",
					index: i
				}
			};
			const acc = blockAccumulators.get(index);
			acc.name = tc.function.name;
			acc.args = args;
			yield {
				event: "content-block-delta",
				index,
				delta: {
					type: "block-delta",
					fields: {
						type: "tool_call_chunk",
						name: acc.name,
						args: acc.args
					}
				}
			};
		}
	}
	for (const [index, acc] of blockAccumulators) yield {
		event: "content-block-finish",
		index,
		content: finalizeContentBlock(acc)
	};
	yield {
		event: "message-finish",
		reason: finishReason,
		...usageSnapshot ? { usage: usageSnapshot } : {},
		responseMetadata: { model_provider: "ollama" }
	};
}
function mapOllamaDoneReason(reason) {
	switch (reason) {
		case "stop": return "stop";
		case "length": return "length";
		default: return "stop";
	}
}
//#endregion
//#region node_modules/@langchain/ollama/dist/utils.js
function convertOllamaMessagesToLangChain(messages, extra) {
	return new AIMessageChunk({
		content: messages.content ?? "",
		additional_kwargs: messages.thinking && messages.thinking !== "" ? { reasoning_content: messages.thinking } : {},
		tool_call_chunks: messages.tool_calls?.map((tc) => ({
			name: tc.function.name,
			args: JSON.stringify(tc.function.arguments),
			type: "tool_call_chunk",
			index: 0,
			id: v4()
		})),
		response_metadata: {
			...extra?.responseMetadata,
			model_provider: "ollama"
		},
		usage_metadata: extra?.usageMetadata
	});
}
function extractBase64FromDataUrl(dataUrl) {
	const match = dataUrl.match(/^data:.*?;base64,(.*)$/);
	return match ? match[1] : "";
}
function convertAMessagesToOllama(messages) {
	if (typeof messages.content === "string") {
		if (messages.tool_calls?.length) {
			const toolCalls = messages.tool_calls.map((tc) => ({
				id: tc.id,
				type: "function",
				function: {
					name: tc.name,
					arguments: tc.args
				}
			}));
			return [{
				role: "assistant",
				content: messages.content,
				tool_calls: toolCalls
			}];
		}
		return [{
			role: "assistant",
			content: messages.content
		}];
	}
	const textMessages = messages.content.filter((c) => c.type === "text" && typeof c.text === "string").map((c) => ({
		role: "assistant",
		content: c.text
	}));
	let toolCallMsgs;
	if (messages.content.find((c) => c.type === "tool_use") && messages.tool_calls?.length) {
		const toolCalls = messages.tool_calls?.map((tc) => ({
			id: tc.id,
			type: "function",
			function: {
				name: tc.name,
				arguments: tc.args
			}
		}));
		if (toolCalls) toolCallMsgs = {
			role: "assistant",
			tool_calls: toolCalls,
			content: ""
		};
	} else if (messages.content.find((c) => c.type === "tool_use") && !messages.tool_calls?.length) throw new Error("'tool_use' content type is not supported without tool calls.");
	return [...textMessages, ...toolCallMsgs ? [toolCallMsgs] : []];
}
function convertHumanGenericMessagesToOllama(message) {
	if (typeof message.content === "string") return [{
		role: "user",
		content: message.content
	}];
	return message.content.map((c) => {
		if (c.type === "text") return {
			role: "user",
			content: c.text
		};
		else if (c.type === "image_url") {
			if (typeof c.image_url === "string") return {
				role: "user",
				content: "",
				images: [extractBase64FromDataUrl(c.image_url)]
			};
			else if (c.image_url.url && typeof c.image_url.url === "string") return {
				role: "user",
				content: "",
				images: [extractBase64FromDataUrl(c.image_url.url)]
			};
		}
		throw new Error(`Unsupported content type: ${c.type}`);
	});
}
function convertSystemMessageToOllama(message) {
	if (typeof message.content === "string") return [{
		role: "system",
		content: message.content
	}];
	else if (message.content.every((c) => c.type === "text" && typeof c.text === "string")) return message.content.map((c) => ({
		role: "system",
		content: c.text
	}));
	else throw new Error(`Unsupported content type(s): ${message.content.map((c) => c.type).join(", ")}`);
}
function convertToolMessageToOllama(message) {
	if (typeof message.content !== "string") throw new Error("Non string tool message content is not supported");
	return [{
		role: "tool",
		content: message.content
	}];
}
function convertToOllamaMessages(messages) {
	return messages.flatMap((msg) => {
		if (["human", "generic"].includes(msg._getType())) return convertHumanGenericMessagesToOllama(msg);
		else if (msg._getType() === "ai") return convertAMessagesToOllama(msg);
		else if (msg._getType() === "system") return convertSystemMessageToOllama(msg);
		else if (msg._getType() === "tool") return convertToolMessageToOllama(msg);
		else throw new Error(`Unsupported message type: ${msg._getType()}`);
	});
}
//#endregion
//#region node_modules/whatwg-fetch/fetch.js
var g = typeof globalThis !== "undefined" && globalThis || typeof self !== "undefined" && self || typeof global !== "undefined" && global || {};
var support = {
	searchParams: "URLSearchParams" in g,
	iterable: "Symbol" in g && "iterator" in Symbol,
	blob: "FileReader" in g && "Blob" in g && (function() {
		try {
			new Blob();
			return true;
		} catch (e) {
			return false;
		}
	})(),
	formData: "FormData" in g,
	arrayBuffer: "ArrayBuffer" in g
};
function isDataView(obj) {
	return obj && DataView.prototype.isPrototypeOf(obj);
}
if (support.arrayBuffer) {
	var viewClasses = [
		"[object Int8Array]",
		"[object Uint8Array]",
		"[object Uint8ClampedArray]",
		"[object Int16Array]",
		"[object Uint16Array]",
		"[object Int32Array]",
		"[object Uint32Array]",
		"[object Float32Array]",
		"[object Float64Array]"
	];
	var isArrayBufferView = ArrayBuffer.isView || function(obj) {
		return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1;
	};
}
function normalizeName(name) {
	if (typeof name !== "string") name = String(name);
	if (/[^a-z0-9\-#$%&'*+.^_`|~!]/i.test(name) || name === "") throw new TypeError("Invalid character in header field name: \"" + name + "\"");
	return name.toLowerCase();
}
function normalizeValue(value) {
	if (typeof value !== "string") value = String(value);
	return value;
}
function iteratorFor(items) {
	var iterator = { next: function() {
		var value = items.shift();
		return {
			done: value === void 0,
			value
		};
	} };
	if (support.iterable) iterator[Symbol.iterator] = function() {
		return iterator;
	};
	return iterator;
}
function Headers$1(headers) {
	this.map = {};
	if (headers instanceof Headers$1) headers.forEach(function(value, name) {
		this.append(name, value);
	}, this);
	else if (Array.isArray(headers)) headers.forEach(function(header) {
		if (header.length != 2) throw new TypeError("Headers constructor: expected name/value pair to be length 2, found" + header.length);
		this.append(header[0], header[1]);
	}, this);
	else if (headers) Object.getOwnPropertyNames(headers).forEach(function(name) {
		this.append(name, headers[name]);
	}, this);
}
Headers$1.prototype.append = function(name, value) {
	name = normalizeName(name);
	value = normalizeValue(value);
	var oldValue = this.map[name];
	this.map[name] = oldValue ? oldValue + ", " + value : value;
};
Headers$1.prototype["delete"] = function(name) {
	delete this.map[normalizeName(name)];
};
Headers$1.prototype.get = function(name) {
	name = normalizeName(name);
	return this.has(name) ? this.map[name] : null;
};
Headers$1.prototype.has = function(name) {
	return this.map.hasOwnProperty(normalizeName(name));
};
Headers$1.prototype.set = function(name, value) {
	this.map[normalizeName(name)] = normalizeValue(value);
};
Headers$1.prototype.forEach = function(callback, thisArg) {
	for (var name in this.map) if (this.map.hasOwnProperty(name)) callback.call(thisArg, this.map[name], name, this);
};
Headers$1.prototype.keys = function() {
	var items = [];
	this.forEach(function(value, name) {
		items.push(name);
	});
	return iteratorFor(items);
};
Headers$1.prototype.values = function() {
	var items = [];
	this.forEach(function(value) {
		items.push(value);
	});
	return iteratorFor(items);
};
Headers$1.prototype.entries = function() {
	var items = [];
	this.forEach(function(value, name) {
		items.push([name, value]);
	});
	return iteratorFor(items);
};
if (support.iterable) Headers$1.prototype[Symbol.iterator] = Headers$1.prototype.entries;
function consumed(body) {
	if (body._noBody) return;
	if (body.bodyUsed) return Promise.reject(/* @__PURE__ */ new TypeError("Already read"));
	body.bodyUsed = true;
}
function fileReaderReady(reader) {
	return new Promise(function(resolve, reject) {
		reader.onload = function() {
			resolve(reader.result);
		};
		reader.onerror = function() {
			reject(reader.error);
		};
	});
}
function readBlobAsArrayBuffer(blob) {
	var reader = new FileReader();
	var promise = fileReaderReady(reader);
	reader.readAsArrayBuffer(blob);
	return promise;
}
function readBlobAsText(blob) {
	var reader = new FileReader();
	var promise = fileReaderReady(reader);
	var match = /charset=([A-Za-z0-9_-]+)/.exec(blob.type);
	var encoding = match ? match[1] : "utf-8";
	reader.readAsText(blob, encoding);
	return promise;
}
function readArrayBufferAsText(buf) {
	var view = new Uint8Array(buf);
	var chars = new Array(view.length);
	for (var i = 0; i < view.length; i++) chars[i] = String.fromCharCode(view[i]);
	return chars.join("");
}
function bufferClone(buf) {
	if (buf.slice) return buf.slice(0);
	else {
		var view = new Uint8Array(buf.byteLength);
		view.set(new Uint8Array(buf));
		return view.buffer;
	}
}
function Body() {
	this.bodyUsed = false;
	this._initBody = function(body) {
		this.bodyUsed = this.bodyUsed;
		this._bodyInit = body;
		if (!body) {
			this._noBody = true;
			this._bodyText = "";
		} else if (typeof body === "string") this._bodyText = body;
		else if (support.blob && Blob.prototype.isPrototypeOf(body)) this._bodyBlob = body;
		else if (support.formData && FormData.prototype.isPrototypeOf(body)) this._bodyFormData = body;
		else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) this._bodyText = body.toString();
		else if (support.arrayBuffer && support.blob && isDataView(body)) {
			this._bodyArrayBuffer = bufferClone(body.buffer);
			this._bodyInit = new Blob([this._bodyArrayBuffer]);
		} else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) this._bodyArrayBuffer = bufferClone(body);
		else this._bodyText = body = Object.prototype.toString.call(body);
		if (!this.headers.get("content-type")) {
			if (typeof body === "string") this.headers.set("content-type", "text/plain;charset=UTF-8");
			else if (this._bodyBlob && this._bodyBlob.type) this.headers.set("content-type", this._bodyBlob.type);
			else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8");
		}
	};
	if (support.blob) this.blob = function() {
		var rejected = consumed(this);
		if (rejected) return rejected;
		if (this._bodyBlob) return Promise.resolve(this._bodyBlob);
		else if (this._bodyArrayBuffer) return Promise.resolve(new Blob([this._bodyArrayBuffer]));
		else if (this._bodyFormData) throw new Error("could not read FormData body as blob");
		else return Promise.resolve(new Blob([this._bodyText]));
	};
	this.arrayBuffer = function() {
		if (this._bodyArrayBuffer) {
			var isConsumed = consumed(this);
			if (isConsumed) return isConsumed;
			else if (ArrayBuffer.isView(this._bodyArrayBuffer)) return Promise.resolve(this._bodyArrayBuffer.buffer.slice(this._bodyArrayBuffer.byteOffset, this._bodyArrayBuffer.byteOffset + this._bodyArrayBuffer.byteLength));
			else return Promise.resolve(this._bodyArrayBuffer);
		} else if (support.blob) return this.blob().then(readBlobAsArrayBuffer);
		else throw new Error("could not read as ArrayBuffer");
	};
	this.text = function() {
		var rejected = consumed(this);
		if (rejected) return rejected;
		if (this._bodyBlob) return readBlobAsText(this._bodyBlob);
		else if (this._bodyArrayBuffer) return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer));
		else if (this._bodyFormData) throw new Error("could not read FormData body as text");
		else return Promise.resolve(this._bodyText);
	};
	if (support.formData) this.formData = function() {
		return this.text().then(decode);
	};
	this.json = function() {
		return this.text().then(JSON.parse);
	};
	return this;
}
var methods = [
	"CONNECT",
	"DELETE",
	"GET",
	"HEAD",
	"OPTIONS",
	"PATCH",
	"POST",
	"PUT",
	"TRACE"
];
function normalizeMethod(method) {
	var upcased = method.toUpperCase();
	return methods.indexOf(upcased) > -1 ? upcased : method;
}
function Request(input, options) {
	if (!(this instanceof Request)) throw new TypeError("Please use the \"new\" operator, this DOM object constructor cannot be called as a function.");
	options = options || {};
	var body = options.body;
	if (input instanceof Request) {
		if (input.bodyUsed) throw new TypeError("Already read");
		this.url = input.url;
		this.credentials = input.credentials;
		if (!options.headers) this.headers = new Headers$1(input.headers);
		this.method = input.method;
		this.mode = input.mode;
		this.signal = input.signal;
		if (!body && input._bodyInit != null) {
			body = input._bodyInit;
			input.bodyUsed = true;
		}
	} else this.url = String(input);
	this.credentials = options.credentials || this.credentials || "same-origin";
	if (options.headers || !this.headers) this.headers = new Headers$1(options.headers);
	this.method = normalizeMethod(options.method || this.method || "GET");
	this.mode = options.mode || this.mode || null;
	this.signal = options.signal || this.signal || function() {
		if ("AbortController" in g) return new AbortController().signal;
	}();
	this.referrer = null;
	if ((this.method === "GET" || this.method === "HEAD") && body) throw new TypeError("Body not allowed for GET or HEAD requests");
	this._initBody(body);
	if (this.method === "GET" || this.method === "HEAD") {
		if (options.cache === "no-store" || options.cache === "no-cache") {
			var reParamSearch = /([?&])_=[^&]*/;
			if (reParamSearch.test(this.url)) this.url = this.url.replace(reParamSearch, "$1_=" + (/* @__PURE__ */ new Date()).getTime());
			else {
				var reQueryString = /\?/;
				this.url += (reQueryString.test(this.url) ? "&" : "?") + "_=" + (/* @__PURE__ */ new Date()).getTime();
			}
		}
	}
}
Request.prototype.clone = function() {
	return new Request(this, { body: this._bodyInit });
};
function decode(body) {
	var form = new FormData();
	body.trim().split("&").forEach(function(bytes) {
		if (bytes) {
			var split = bytes.split("=");
			var name = split.shift().replace(/\+/g, " ");
			var value = split.join("=").replace(/\+/g, " ");
			form.append(decodeURIComponent(name), decodeURIComponent(value));
		}
	});
	return form;
}
function parseHeaders(rawHeaders) {
	var headers = new Headers$1();
	rawHeaders.replace(/\r?\n[\t ]+/g, " ").split("\r").map(function(header) {
		return header.indexOf("\n") === 0 ? header.substr(1, header.length) : header;
	}).forEach(function(line) {
		var parts = line.split(":");
		var key = parts.shift().trim();
		if (key) {
			var value = parts.join(":").trim();
			try {
				headers.append(key, value);
			} catch (error) {
				console.warn("Response " + error.message);
			}
		}
	});
	return headers;
}
Body.call(Request.prototype);
function Response(bodyInit, options) {
	if (!(this instanceof Response)) throw new TypeError("Please use the \"new\" operator, this DOM object constructor cannot be called as a function.");
	if (!options) options = {};
	this.type = "default";
	this.status = options.status === void 0 ? 200 : options.status;
	if (this.status < 200 || this.status > 599) throw new RangeError("Failed to construct 'Response': The status provided (0) is outside the range [200, 599].");
	this.ok = this.status >= 200 && this.status < 300;
	this.statusText = options.statusText === void 0 ? "" : "" + options.statusText;
	this.headers = new Headers$1(options.headers);
	this.url = options.url || "";
	this._initBody(bodyInit);
}
Body.call(Response.prototype);
Response.prototype.clone = function() {
	return new Response(this._bodyInit, {
		status: this.status,
		statusText: this.statusText,
		headers: new Headers$1(this.headers),
		url: this.url
	});
};
Response.error = function() {
	var response = new Response(null, {
		status: 200,
		statusText: ""
	});
	response.ok = false;
	response.status = 0;
	response.type = "error";
	return response;
};
var redirectStatuses = [
	301,
	302,
	303,
	307,
	308
];
Response.redirect = function(url, status) {
	if (redirectStatuses.indexOf(status) === -1) throw new RangeError("Invalid status code");
	return new Response(null, {
		status,
		headers: { location: url }
	});
};
var DOMException = g.DOMException;
try {
	new DOMException();
} catch (err) {
	DOMException = function(message, name) {
		this.message = message;
		this.name = name;
		var error = Error(message);
		this.stack = error.stack;
	};
	DOMException.prototype = Object.create(Error.prototype);
	DOMException.prototype.constructor = DOMException;
}
function fetch$1(input, init) {
	return new Promise(function(resolve, reject) {
		var request = new Request(input, init);
		if (request.signal && request.signal.aborted) return reject(new DOMException("Aborted", "AbortError"));
		var xhr = new XMLHttpRequest();
		function abortXhr() {
			xhr.abort();
		}
		xhr.onload = function() {
			var options = {
				statusText: xhr.statusText,
				headers: parseHeaders(xhr.getAllResponseHeaders() || "")
			};
			if (request.url.indexOf("file://") === 0 && (xhr.status < 200 || xhr.status > 599)) options.status = 200;
			else options.status = xhr.status;
			options.url = "responseURL" in xhr ? xhr.responseURL : options.headers.get("X-Request-URL");
			var body = "response" in xhr ? xhr.response : xhr.responseText;
			setTimeout(function() {
				resolve(new Response(body, options));
			}, 0);
		};
		xhr.onerror = function() {
			setTimeout(function() {
				reject(/* @__PURE__ */ new TypeError("Network request failed"));
			}, 0);
		};
		xhr.ontimeout = function() {
			setTimeout(function() {
				reject(/* @__PURE__ */ new TypeError("Network request timed out"));
			}, 0);
		};
		xhr.onabort = function() {
			setTimeout(function() {
				reject(new DOMException("Aborted", "AbortError"));
			}, 0);
		};
		function fixUrl(url) {
			try {
				return url === "" && g.location.href ? g.location.href : url;
			} catch (e) {
				return url;
			}
		}
		xhr.open(request.method, fixUrl(request.url), true);
		if (request.credentials === "include") xhr.withCredentials = true;
		else if (request.credentials === "omit") xhr.withCredentials = false;
		if ("responseType" in xhr) {
			if (support.blob) xhr.responseType = "blob";
			else if (support.arrayBuffer) xhr.responseType = "arraybuffer";
		}
		if (init && typeof init.headers === "object" && !(init.headers instanceof Headers$1 || g.Headers && init.headers instanceof g.Headers)) {
			var names = [];
			Object.getOwnPropertyNames(init.headers).forEach(function(name) {
				names.push(normalizeName(name));
				xhr.setRequestHeader(name, normalizeValue(init.headers[name]));
			});
			request.headers.forEach(function(value, name) {
				if (names.indexOf(name) === -1) xhr.setRequestHeader(name, value);
			});
		} else request.headers.forEach(function(value, name) {
			xhr.setRequestHeader(name, value);
		});
		if (request.signal) {
			request.signal.addEventListener("abort", abortXhr);
			xhr.onreadystatechange = function() {
				if (xhr.readyState === 4) request.signal.removeEventListener("abort", abortXhr);
			};
		}
		xhr.send(typeof request._bodyInit === "undefined" ? null : request._bodyInit);
	});
}
fetch$1.polyfill = true;
if (!g.fetch) {
	g.fetch = fetch$1;
	g.Headers = Headers$1;
	g.Request = Request;
	g.Response = Response;
}
//#endregion
//#region node_modules/ollama/dist/browser.mjs
var defaultPort = "11434";
var defaultHost = `http://127.0.0.1:${defaultPort}`;
var version = "0.6.3";
var __defProp$1 = Object.defineProperty;
var __defNormalProp$1 = (obj, key, value) => key in obj ? __defProp$1(obj, key, {
	enumerable: true,
	configurable: true,
	writable: true,
	value
}) : obj[key] = value;
var __publicField$1 = (obj, key, value) => {
	__defNormalProp$1(obj, typeof key !== "symbol" ? key + "" : key, value);
	return value;
};
var ResponseError = class ResponseError extends Error {
	constructor(error, status_code) {
		super(error);
		this.error = error;
		this.status_code = status_code;
		this.name = "ResponseError";
		if (Error.captureStackTrace) Error.captureStackTrace(this, ResponseError);
	}
};
var AbortableAsyncIterator = class {
	constructor(abortController, itr, doneCallback) {
		__publicField$1(this, "abortController");
		__publicField$1(this, "itr");
		__publicField$1(this, "doneCallback");
		this.abortController = abortController;
		this.itr = itr;
		this.doneCallback = doneCallback;
	}
	abort() {
		this.abortController.abort();
	}
	async *[Symbol.asyncIterator]() {
		for await (const message of this.itr) {
			if ("error" in message) throw new Error(message.error);
			yield message;
			if (message.done || message.status === "success") {
				this.doneCallback();
				return;
			}
		}
		throw new Error("Did not receive done or success response in stream.");
	}
};
var checkOk = async (response) => {
	if (response.ok) return;
	let message = `Error ${response.status}: ${response.statusText}`;
	let errorData = null;
	if (response.headers.get("content-type")?.includes("application/json")) try {
		errorData = await response.json();
		message = errorData.error || message;
	} catch (error) {
		console.log("Failed to parse error response as JSON");
	}
	else try {
		console.log("Getting text from response");
		message = await response.text() || message;
	} catch (error) {
		console.log("Failed to get text from error response");
	}
	throw new ResponseError(message, response.status);
};
function getPlatform() {
	if (typeof window !== "undefined" && window.navigator) {
		const nav = navigator;
		if ("userAgentData" in nav && nav.userAgentData?.platform) return `${nav.userAgentData.platform.toLowerCase()} Browser/${navigator.userAgent};`;
		if (navigator.platform) return `${navigator.platform.toLowerCase()} Browser/${navigator.userAgent};`;
		return `unknown Browser/${navigator.userAgent};`;
	} else if (typeof process !== "undefined") return `${process.arch} ${process.platform} Node.js/${process.version}`;
	return "";
}
function normalizeHeaders(headers) {
	if (headers instanceof Headers) {
		const obj = {};
		headers.forEach((value, key) => {
			obj[key] = value;
		});
		return obj;
	} else if (Array.isArray(headers)) return Object.fromEntries(headers);
	else return headers || {};
}
var readEnvVar = (obj, key) => {
	return obj[key];
};
var fetchWithHeaders = async (fetch, url, options = {}) => {
	const defaultHeaders = {
		"Content-Type": "application/json",
		Accept: "application/json",
		"User-Agent": `ollama-js/${version} (${getPlatform()})`
	};
	options.headers = normalizeHeaders(options.headers);
	try {
		const parsed = new URL(url);
		if (parsed.protocol === "https:" && parsed.hostname === "ollama.com") {
			const apiKey = typeof process === "object" && process !== null && typeof process.env === "object" && process.env !== null ? readEnvVar(process.env, "OLLAMA_API_KEY") : void 0;
			if (!(options.headers["authorization"] || options.headers["Authorization"]) && apiKey) options.headers["Authorization"] = `Bearer ${apiKey}`;
		}
	} catch (error) {
		console.error("error parsing url", error);
	}
	const customHeaders = Object.fromEntries(Object.entries(options.headers).filter(([key]) => !Object.keys(defaultHeaders).some((defaultKey) => defaultKey.toLowerCase() === key.toLowerCase())));
	options.headers = {
		...defaultHeaders,
		...customHeaders
	};
	return fetch(url, options);
};
var get = async (fetch, host, options) => {
	const response = await fetchWithHeaders(fetch, host, { headers: options?.headers });
	await checkOk(response);
	return response;
};
var post = async (fetch, host, data, options) => {
	const isRecord = (input) => {
		return input !== null && typeof input === "object" && !Array.isArray(input);
	};
	const response = await fetchWithHeaders(fetch, host, {
		method: "POST",
		body: isRecord(data) ? JSON.stringify(data) : data,
		signal: options?.signal,
		headers: options?.headers
	});
	await checkOk(response);
	return response;
};
var del = async (fetch, host, data, options) => {
	const response = await fetchWithHeaders(fetch, host, {
		method: "DELETE",
		body: JSON.stringify(data),
		headers: options?.headers
	});
	await checkOk(response);
	return response;
};
var parseJSON = async function* (itr) {
	const decoder = new TextDecoder("utf-8");
	let buffer = "";
	const reader = itr.getReader();
	while (true) {
		const { done, value: chunk } = await reader.read();
		if (done) break;
		buffer += decoder.decode(chunk, { stream: true });
		const parts = buffer.split("\n");
		buffer = parts.pop() ?? "";
		for (const part of parts) try {
			yield JSON.parse(part);
		} catch (error) {
			console.warn("invalid json: ", part);
		}
	}
	buffer += decoder.decode();
	for (const part of buffer.split("\n").filter((p) => p !== "")) try {
		yield JSON.parse(part);
	} catch (error) {
		console.warn("invalid json: ", part);
	}
};
var formatHost = (host) => {
	if (!host) return defaultHost;
	let isExplicitProtocol = host.includes("://");
	if (host.startsWith(":")) {
		host = `http://127.0.0.1${host}`;
		isExplicitProtocol = true;
	}
	if (!isExplicitProtocol) host = `http://${host}`;
	const url = new URL(host);
	let port = url.port;
	if (!port) if (!isExplicitProtocol) port = defaultPort;
	else port = url.protocol === "https:" ? "443" : "80";
	let auth = "";
	if (url.username) {
		auth = url.username;
		if (url.password) auth += `:${url.password}`;
		auth += "@";
	}
	let formattedHost = `${url.protocol}//${auth}${url.hostname}:${port}${url.pathname}`;
	if (formattedHost.endsWith("/")) formattedHost = formattedHost.slice(0, -1);
	return formattedHost;
};
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, {
	enumerable: true,
	configurable: true,
	writable: true,
	value
}) : obj[key] = value;
var __publicField = (obj, key, value) => {
	__defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
	return value;
};
var Ollama$1 = class Ollama {
	constructor(config) {
		__publicField(this, "config");
		__publicField(this, "fetch");
		__publicField(this, "ongoingStreamedRequests", []);
		this.config = {
			host: "",
			headers: config?.headers
		};
		if (!config?.proxy) this.config.host = formatHost(config?.host ?? defaultHost);
		this.fetch = config?.fetch ?? fetch;
	}
	abort() {
		for (const request of this.ongoingStreamedRequests) request.abort();
		this.ongoingStreamedRequests.length = 0;
	}
	/**
	* Processes a request to the Ollama server. If the request is streamable, it will return a
	* AbortableAsyncIterator that yields the response messages. Otherwise, it will return the response
	* object.
	* @param endpoint {string} - The endpoint to send the request to.
	* @param request {object} - The request object to send to the endpoint.
	* @protected {T | AbortableAsyncIterator<T>} - The response object or a AbortableAsyncIterator that yields
	* response messages.
	* @throws {Error} - If the response body is missing or if the response is an error.
	* @returns {Promise<T | AbortableAsyncIterator<T>>} - The response object or a AbortableAsyncIterator that yields the streamed response.
	*/
	async processStreamableRequest(endpoint, request) {
		request.stream = request.stream ?? false;
		const host = `${this.config.host}/api/${endpoint}`;
		if (request.stream) {
			const abortController = new AbortController();
			const response2 = await post(this.fetch, host, request, {
				signal: abortController.signal,
				headers: this.config.headers
			});
			if (!response2.body) throw new Error("Missing body");
			const abortableAsyncIterator = new AbortableAsyncIterator(abortController, parseJSON(response2.body), () => {
				const i = this.ongoingStreamedRequests.indexOf(abortableAsyncIterator);
				if (i > -1) this.ongoingStreamedRequests.splice(i, 1);
			});
			this.ongoingStreamedRequests.push(abortableAsyncIterator);
			return abortableAsyncIterator;
		}
		return await (await post(this.fetch, host, request, { headers: this.config.headers })).json();
	}
	/**
	* Encodes an image to base64 if it is a Uint8Array.
	* @param image {Uint8Array | string} - The image to encode.
	* @returns {Promise<string>} - The base64 encoded image.
	*/
	async encodeImage(image) {
		if (typeof image !== "string") {
			const uint8Array = new Uint8Array(image);
			let byteString = "";
			const len = uint8Array.byteLength;
			for (let i = 0; i < len; i++) byteString += String.fromCharCode(uint8Array[i]);
			return btoa(byteString);
		}
		return image;
	}
	/**
	* Generates a response from a text prompt.
	* @param request {GenerateRequest} - The request object.
	* @returns {Promise<GenerateResponse | AbortableAsyncIterator<GenerateResponse>>} - The response object or
	* an AbortableAsyncIterator that yields response messages.
	*/
	async generate(request) {
		if (request.images) request.images = await Promise.all(request.images.map(this.encodeImage.bind(this)));
		return this.processStreamableRequest("generate", request);
	}
	/**
	* Chats with the model. The request object can contain messages with images that are either
	* Uint8Arrays or base64 encoded strings. The images will be base64 encoded before sending the
	* request.
	* @param request {ChatRequest} - The request object.
	* @returns {Promise<ChatResponse | AbortableAsyncIterator<ChatResponse>>} - The response object or an
	* AbortableAsyncIterator that yields response messages.
	*/
	async chat(request) {
		if (request.messages) {
			for (const message of request.messages) if (message.images) message.images = await Promise.all(message.images.map(this.encodeImage.bind(this)));
		}
		return this.processStreamableRequest("chat", request);
	}
	/**
	* Creates a new model from a stream of data.
	* @param request {CreateRequest} - The request object.
	* @returns {Promise<ProgressResponse | AbortableAsyncIterator<ProgressResponse>>} - The response object or a stream of progress responses.
	*/
	async create(request) {
		return this.processStreamableRequest("create", { ...request });
	}
	/**
	* Pulls a model from the Ollama registry. The request object can contain a stream flag to indicate if the
	* response should be streamed.
	* @param request {PullRequest} - The request object.
	* @returns {Promise<ProgressResponse | AbortableAsyncIterator<ProgressResponse>>} - The response object or
	* an AbortableAsyncIterator that yields response messages.
	*/
	async pull(request) {
		return this.processStreamableRequest("pull", {
			name: request.model,
			stream: request.stream,
			insecure: request.insecure
		});
	}
	/**
	* Pushes a model to the Ollama registry. The request object can contain a stream flag to indicate if the
	* response should be streamed.
	* @param request {PushRequest} - The request object.
	* @returns {Promise<ProgressResponse | AbortableAsyncIterator<ProgressResponse>>} - The response object or
	* an AbortableAsyncIterator that yields response messages.
	*/
	async push(request) {
		return this.processStreamableRequest("push", {
			name: request.model,
			stream: request.stream,
			insecure: request.insecure
		});
	}
	/**
	* Deletes a model from the server. The request object should contain the name of the model to
	* delete.
	* @param request {DeleteRequest} - The request object.
	* @returns {Promise<StatusResponse>} - The response object.
	*/
	async delete(request) {
		await del(this.fetch, `${this.config.host}/api/delete`, { name: request.model }, { headers: this.config.headers });
		return { status: "success" };
	}
	/**
	* Copies a model from one name to another. The request object should contain the name of the
	* model to copy and the new name.
	* @param request {CopyRequest} - The request object.
	* @returns {Promise<StatusResponse>} - The response object.
	*/
	async copy(request) {
		await post(this.fetch, `${this.config.host}/api/copy`, { ...request }, { headers: this.config.headers });
		return { status: "success" };
	}
	/**
	* Lists the models on the server.
	* @returns {Promise<ListResponse>} - The response object.
	* @throws {Error} - If the response body is missing.
	*/
	async list() {
		return await (await get(this.fetch, `${this.config.host}/api/tags`, { headers: this.config.headers })).json();
	}
	/**
	* Shows the metadata of a model. The request object should contain the name of the model.
	* @param request {ShowRequest} - The request object.
	* @returns {Promise<ShowResponse>} - The response object.
	*/
	async show(request) {
		return await (await post(this.fetch, `${this.config.host}/api/show`, { ...request }, { headers: this.config.headers })).json();
	}
	/**
	* Embeds text input into vectors.
	* @param request {EmbedRequest} - The request object.
	* @returns {Promise<EmbedResponse>} - The response object.
	*/
	async embed(request) {
		return await (await post(this.fetch, `${this.config.host}/api/embed`, { ...request }, { headers: this.config.headers })).json();
	}
	/**
	* Embeds a text prompt into a vector.
	* @param request {EmbeddingsRequest} - The request object.
	* @returns {Promise<EmbeddingsResponse>} - The response object.
	*/
	async embeddings(request) {
		return await (await post(this.fetch, `${this.config.host}/api/embeddings`, { ...request }, { headers: this.config.headers })).json();
	}
	/**
	* Lists the running models on the server
	* @returns {Promise<ListResponse>} - The response object.
	* @throws {Error} - If the response body is missing.
	*/
	async ps() {
		return await (await get(this.fetch, `${this.config.host}/api/ps`, { headers: this.config.headers })).json();
	}
	/**
	* Returns the Ollama server version.
	* @returns {Promise<VersionResponse>} - The server version object.
	*/
	async version() {
		return await (await get(this.fetch, `${this.config.host}/api/version`, { headers: this.config.headers })).json();
	}
	/**
	* Performs web search using the Ollama web search API
	* @param request {WebSearchRequest} - The search request containing query and options
	* @returns {Promise<WebSearchResponse>} - The search results
	* @throws {Error} - If the request is invalid or the server returns an error
	*/
	async webSearch(request) {
		if (!request.query || request.query.length === 0) throw new Error("Query is required");
		return await (await post(this.fetch, `https://ollama.com/api/web_search`, { ...request }, { headers: this.config.headers })).json();
	}
	/**
	* Fetches a single page using the Ollama web fetch API
	* @param request {WebFetchRequest} - The fetch request containing a URL
	* @returns {Promise<WebFetchResponse>} - The fetch result
	* @throws {Error} - If the request is invalid or the server returns an error
	*/
	async webFetch(request) {
		if (!request.url || request.url.length === 0) throw new Error("URL is required");
		return await (await post(this.fetch, `https://ollama.com/api/web_fetch`, { ...request }, { headers: this.config.headers })).json();
	}
};
new Ollama$1();
//#endregion
//#region node_modules/@langchain/ollama/dist/chat_models.js
/**
* Ollama chat model integration.
*
* Setup:
* Install `@langchain/ollama` and the Ollama app.
*
* ```bash
* npm install @langchain/ollama
* export OLLAMA_BASE_URL="http://127.0.0.1:11434" # Optional; defaults to http://127.0.0.1:11434 if not set
* ```
*
* ## [Constructor args](https://api.js.langchain.com/classes/_langchain_ollama.ChatOllama.html#constructor)
*
* ## [Runtime args](https://api.js.langchain.com/interfaces/_langchain_ollama.ChatOllamaCallOptions.html)
*
* Runtime args can be passed as the second argument to any of the base runnable methods `.invoke`. `.stream`, `.batch`, etc.
* They can also be passed via `.withConfig`, or the second arg in `.bindTools`, like shown in the examples below:
*
* ```typescript
* // When calling `.withConfig`, call options should be passed via the first argument
* const llmWithArgsBound = llm.withConfig({
*   stop: ["\n"],
* });
*
* // When calling `.bindTools`, call options should be passed via the second argument
* const llmWithTools = llm.bindTools(
*   [...],
*   {
*     stop: ["\n"],
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
* import { ChatOllama } from '@langchain/ollama';
*
* const llm = new ChatOllama({
*   model: "llama-3.1:8b",
*   temperature: 0,
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
*   "content": "The translation of \"I love programming\" into French is:\n\n\"J'adore programmer.\"",
*   "additional_kwargs": {},
*   "response_metadata": {
*     "model": "llama3.1:8b",
*     "created_at": "2024-08-12T22:12:23.09468Z",
*     "done_reason": "stop",
*     "done": true,
*     "total_duration": 3715571291,
*     "load_duration": 35244375,
*     "prompt_eval_count": 19,
*     "prompt_eval_duration": 3092116000,
*     "eval_count": 20,
*     "eval_duration": 585789000
*   },
*   "tool_calls": [],
*   "invalid_tool_calls": [],
*   "usage_metadata": {
*     "input_tokens": 19,
*     "output_tokens": 20,
*     "total_tokens": 39
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
*   "content": "The",
*   "additional_kwargs": {},
*   "response_metadata": {},
*   "tool_calls": [],
*   "tool_call_chunks": [],
*   "invalid_tool_calls": []
* }
* AIMessageChunk {
*   "content": " translation",
*   "additional_kwargs": {},
*   "response_metadata": {},
*   "tool_calls": [],
*   "tool_call_chunks": [],
*   "invalid_tool_calls": []
* }
* AIMessageChunk {
*   "content": " of",
*   "additional_kwargs": {},
*   "response_metadata": {},
*   "tool_calls": [],
*   "tool_call_chunks": [],
*   "invalid_tool_calls": []
* }
* AIMessageChunk {
*   "content": " \"",
*   "additional_kwargs": {},
*   "response_metadata": {},
*   "tool_calls": [],
*   "tool_call_chunks": [],
*   "invalid_tool_calls": []
* }
* AIMessageChunk {
*   "content": "I",
*   "additional_kwargs": {},
*   "response_metadata": {},
*   "tool_calls": [],
*   "tool_call_chunks": [],
*   "invalid_tool_calls": []
* }
* ...
* AIMessageChunk {
*   "content": "",
*   "additional_kwargs": {},
*   "response_metadata": {},
*   "tool_calls": [],
*   "tool_call_chunks": [],
*   "invalid_tool_calls": []
* }
* AIMessageChunk {
*   "content": "",
*   "additional_kwargs": {},
*   "response_metadata": {
*     "model": "llama3.1:8b",
*     "created_at": "2024-08-12T22:13:22.22423Z",
*     "done_reason": "stop",
*     "done": true,
*     "total_duration": 8599883208,
*     "load_duration": 35975875,
*     "prompt_eval_count": 19,
*     "prompt_eval_duration": 7918195000,
*     "eval_count": 20,
*     "eval_duration": 643569000
*   },
*   "tool_calls": [],
*   "tool_call_chunks": [],
*   "invalid_tool_calls": [],
*   "usage_metadata": {
*     "input_tokens": 19,
*     "output_tokens": 20,
*     "total_tokens": 39
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
* const llmWithTools = llm.bindTools([GetWeather, GetPopulation]);
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
*     id: '49410cad-2163-415e-bdcd-d26938a9c8c5',
*     type: 'tool_call'
*   },
*   {
*     name: 'GetPopulation',
*     args: { location: 'New York, NY' },
*     id: '39e230e4-63ec-4fae-9df0-21c3abe735ad',
*     type: 'tool_call'
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
*   rating: z.number().optional().describe("How funny the joke is, from 1 to 10")
* }).describe('Joke to tell user.');
*
* const structuredLlm = llm.withStructuredOutput(Joke, { name: "Joke" });
* const jokeResult = await structuredLlm.invoke("Tell me a joke about cats");
* console.log(jokeResult);
* ```
*
* ```txt
* {
*   punchline: 'Why did the cat join a band? Because it wanted to be the purr-cussionist!',
*   rating: 8,
*   setup: 'A cat walks into a music store and asks the owner...'
* }
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
* { input_tokens: 19, output_tokens: 20, total_tokens: 39 }
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
*   model: 'llama3.1:8b',
*   created_at: '2024-08-12T22:17:42.274795Z',
*   done_reason: 'stop',
*   done: true,
*   total_duration: 6767071209,
*   load_duration: 31628209,
*   prompt_eval_count: 19,
*   prompt_eval_duration: 6124504000,
*   eval_count: 20,
*   eval_duration: 608785000
* }
* ```
* </details>
*
* <br />
*/
var ChatOllama = class extends BaseChatModel {
	static lc_name() {
		return "ChatOllama";
	}
	model = "llama3";
	numa;
	numCtx;
	numBatch;
	numGpu;
	mainGpu;
	lowVram;
	f16Kv;
	logitsAll;
	vocabOnly;
	useMmap;
	useMlock;
	embeddingOnly;
	numThread;
	numKeep;
	seed;
	numPredict;
	topK;
	topP;
	tfsZ;
	typicalP;
	repeatLastN;
	temperature;
	repeatPenalty;
	presencePenalty;
	frequencyPenalty;
	mirostat;
	mirostatTau;
	mirostatEta;
	penalizeNewline;
	streaming;
	format;
	keepAlive;
	client;
	checkOrPullModel = false;
	baseUrl = "http://127.0.0.1:11434";
	think;
	constructor(modelOrFields, fieldsArg) {
		const fields = typeof modelOrFields === "string" ? {
			...fieldsArg ?? {},
			model: modelOrFields
		} : modelOrFields ?? {};
		super(fields);
		this._addVersion("@langchain/ollama", "1.3.0");
		this.baseUrl = fields.baseUrl ?? getEnvironmentVariable("OLLAMA_BASE_URL") ?? this.baseUrl;
		this.client = new Ollama$1({
			fetch: fields.fetch,
			host: this.baseUrl,
			headers: fields.headers
		});
		this.model = fields.model ?? this.model;
		this.numa = fields.numa;
		this.numCtx = fields.numCtx;
		this.numBatch = fields.numBatch;
		this.numGpu = fields.numGpu;
		this.mainGpu = fields.mainGpu;
		this.lowVram = fields.lowVram;
		this.f16Kv = fields.f16Kv;
		this.logitsAll = fields.logitsAll;
		this.vocabOnly = fields.vocabOnly;
		this.useMmap = fields.useMmap;
		this.useMlock = fields.useMlock;
		this.embeddingOnly = fields.embeddingOnly;
		this.numThread = fields.numThread;
		this.numKeep = fields.numKeep;
		this.seed = fields.seed;
		this.numPredict = fields.numPredict;
		this.topK = fields.topK;
		this.topP = fields.topP;
		this.tfsZ = fields.tfsZ;
		this.typicalP = fields.typicalP;
		this.repeatLastN = fields.repeatLastN;
		this.temperature = fields.temperature;
		this.repeatPenalty = fields.repeatPenalty;
		this.presencePenalty = fields.presencePenalty;
		this.frequencyPenalty = fields.frequencyPenalty;
		this.mirostat = fields.mirostat;
		this.mirostatTau = fields.mirostatTau;
		this.mirostatEta = fields.mirostatEta;
		this.penalizeNewline = fields.penalizeNewline;
		this.streaming = fields.streaming;
		this.format = fields.format;
		this.keepAlive = fields.keepAlive;
		this.think = fields.think;
		this.checkOrPullModel = fields.checkOrPullModel ?? this.checkOrPullModel;
	}
	_llmType() {
		return "ollama";
	}
	/**
	* Download a model onto the local machine.
	*
	* @param {string} model The name of the model to download.
	* @param {PullModelOptions | undefined} options Options for pulling the model.
	* @returns {Promise<void>}
	*/
	async pull(model, options) {
		const { stream, insecure, logProgress } = {
			stream: true,
			...options
		};
		if (stream) {
			for await (const chunk of await this.client.pull({
				model,
				insecure,
				stream
			})) if (logProgress) console.log(chunk);
		} else {
			const response = await this.client.pull({
				model,
				insecure
			});
			if (logProgress) console.log(response);
		}
	}
	bindTools(tools, kwargs) {
		return this.withConfig({
			tools: tools.map((tool) => convertToOpenAITool(tool)),
			...kwargs
		});
	}
	getLsParams(options) {
		const params = this.invocationParams(options);
		return {
			ls_provider: "ollama",
			ls_model_name: this.model,
			ls_model_type: "chat",
			ls_temperature: params.options?.temperature ?? void 0,
			ls_max_tokens: params.options?.num_predict ?? void 0,
			ls_stop: options.stop
		};
	}
	invocationParams(options) {
		return {
			model: this.model,
			format: options?.format ?? this.format,
			keep_alive: this.keepAlive,
			think: this.think,
			options: {
				numa: this.numa,
				num_ctx: this.numCtx,
				num_batch: this.numBatch,
				num_gpu: this.numGpu,
				main_gpu: this.mainGpu,
				low_vram: this.lowVram,
				f16_kv: this.f16Kv,
				logits_all: this.logitsAll,
				vocab_only: this.vocabOnly,
				use_mmap: this.useMmap,
				use_mlock: this.useMlock,
				embedding_only: this.embeddingOnly,
				num_thread: this.numThread,
				num_keep: this.numKeep,
				seed: this.seed,
				num_predict: this.numPredict,
				top_k: this.topK,
				top_p: this.topP,
				tfs_z: this.tfsZ,
				typical_p: this.typicalP,
				repeat_last_n: this.repeatLastN,
				temperature: this.temperature,
				repeat_penalty: this.repeatPenalty,
				presence_penalty: this.presencePenalty,
				frequency_penalty: this.frequencyPenalty,
				mirostat: this.mirostat,
				mirostat_tau: this.mirostatTau,
				mirostat_eta: this.mirostatEta,
				penalize_newline: this.penalizeNewline,
				stop: options?.stop
			},
			tools: options?.tools?.length ? options.tools.map((tool) => convertToOpenAITool(tool)) : void 0
		};
	}
	/**
	* Check if a model exists on the local machine.
	*
	* @param {string} model The name of the model to check.
	* @returns {Promise<boolean>} Whether or not the model exists.
	*/
	async checkModelExistsOnMachine(model) {
		const { models } = await this.client.list();
		return !!models.find((m) => m.name === model || m.name === `${model}:latest`);
	}
	async ensureModelAvailable() {
		if (this.checkOrPullModel) {
			if (!await this.checkModelExistsOnMachine(this.model)) await this.pull(this.model, { logProgress: true });
		}
	}
	async _generate(messages, options, runManager) {
		options.signal?.throwIfAborted();
		await this.ensureModelAvailable();
		let finalChunk;
		for await (const chunk of this._streamResponseChunks(messages, options, runManager)) if (!finalChunk) finalChunk = chunk.message;
		else finalChunk = concat(finalChunk, chunk.message);
		const nonChunkMessage = new AIMessage({
			id: finalChunk?.id,
			content: finalChunk?.content ?? "",
			additional_kwargs: finalChunk?.additional_kwargs,
			tool_calls: finalChunk?.tool_calls,
			response_metadata: finalChunk?.response_metadata,
			usage_metadata: finalChunk?.usage_metadata
		});
		return { generations: [{
			text: typeof nonChunkMessage.content === "string" ? nonChunkMessage.content : "",
			message: nonChunkMessage
		}] };
	}
	async *_streamChatModelEvents(messages, options, _runManager) {
		await this.ensureModelAvailable();
		const params = this.invocationParams(options);
		const ollamaMessages = convertToOllamaMessages(messages);
		const stream = await this.client.chat({
			...params,
			messages: ollamaMessages,
			stream: true
		});
		const shouldStreamUsage = options.streamUsage ?? true;
		const abortableStream = async function* (source, signal) {
			for await (const chunk of source) {
				if (signal?.aborted) return;
				yield chunk;
			}
		};
		yield* convertOllamaStream(abortableStream(stream, options.signal), {
			streamUsage: shouldStreamUsage,
			think: this.think
		});
	}
	async *_streamResponseChunks(messages, options, runManager) {
		await this.ensureModelAvailable();
		const params = this.invocationParams(options);
		const ollamaMessages = convertToOllamaMessages(messages);
		const usageMetadata = {
			input_tokens: 0,
			output_tokens: 0,
			total_tokens: 0
		};
		const stream = await this.client.chat({
			...params,
			messages: ollamaMessages,
			stream: true
		});
		let lastMetadata;
		for await (const streamChunk of stream) {
			if (options.signal?.aborted) {
				this.client.abort();
				return;
			}
			const { message: responseMessage, ...rest } = streamChunk;
			usageMetadata.input_tokens += rest.prompt_eval_count ?? 0;
			usageMetadata.output_tokens += rest.eval_count ?? 0;
			usageMetadata.total_tokens = usageMetadata.input_tokens + usageMetadata.output_tokens;
			lastMetadata = rest;
			const token = this.think ? responseMessage.thinking ?? responseMessage.content ?? "" : responseMessage.content ?? "";
			const chunk = new ChatGenerationChunk({
				text: token,
				message: convertOllamaMessagesToLangChain(responseMessage)
			});
			yield chunk;
			await runManager?.handleLLMNewToken(token, void 0, void 0, void 0, void 0, { chunk });
		}
		yield new ChatGenerationChunk({
			text: "",
			message: new AIMessageChunk({
				content: "",
				response_metadata: {
					...lastMetadata,
					model_provider: "ollama"
				},
				usage_metadata: usageMetadata
			})
		});
	}
	withStructuredOutput(outputSchema, config) {
		let llm;
		let outputParser;
		const { schema, name, includeRaw } = {
			...config,
			schema: outputSchema
		};
		const method = config?.method ?? "jsonSchema";
		if (method === "functionCalling") {
			let functionName = name ?? "extract";
			let toolFunction;
			const jsonSchema = toJsonSchema(schema);
			if (isInteropZodSchema(schema) || isSerializableSchema(schema)) toolFunction = {
				name: functionName,
				description: jsonSchema.description,
				parameters: jsonSchema
			};
			else if (typeof schema.name === "string" && typeof schema.parameters === "object" && schema.parameters != null) {
				toolFunction = schema;
				functionName = schema.name;
			} else toolFunction = {
				name: functionName,
				description: schema.description ?? "",
				parameters: schema
			};
			llm = this.bindTools([{
				type: "function",
				function: toolFunction
			}]).withConfig({ ls_structured_output_format: {
				kwargs: { method },
				schema: isInteropZodSchema(schema) || isSerializableSchema(schema) ? jsonSchema : schema
			} });
			outputParser = createFunctionCallingParser(schema, functionName);
		} else if (method === "jsonMode" || method === "jsonSchema") {
			outputParser = createContentParser(schema);
			const jsonSchema = toJsonSchema(schema);
			llm = this.withConfig({
				format: method === "jsonMode" ? "json" : jsonSchema,
				ls_structured_output_format: {
					kwargs: { method },
					schema: jsonSchema
				}
			});
		} else throw new TypeError(`Unrecognized structured output method '${method}'. Expected one of 'functionCalling', 'jsonMode', or 'jsonSchema'`);
		return assembleStructuredOutputPipeline(llm, outputParser, includeRaw, includeRaw ? "StructuredOutputRunnable" : "ChatOllamaStructuredOutput");
	}
};
//#endregion
//#region node_modules/@langchain/ollama/dist/index.js
var dist_exports = /* @__PURE__ */ __exportAll({ ChatOllama: () => ChatOllama });
//#endregion
export { dist_exports as t };
