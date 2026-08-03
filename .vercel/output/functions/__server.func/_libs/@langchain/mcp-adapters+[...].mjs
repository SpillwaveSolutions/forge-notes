import { a as __toCommonJS, i as __require, n as __esmMin, o as __toESM, r as __exportAll, t as __commonJSMin } from "../../_runtime.mjs";
import { $t as string$1, Bt as array, En as NEVER, Gt as intersection, Ht as custom, It as _enum, Jt as number$1, Kt as literal, Mt as ZodBoolean, Nt as ZodNumber, Pt as ZodString, Qt as record, Rt as _null, Sn as prettifyError, Ut as discriminatedUnion, Vt as boolean$1, Xt as optional, Yt as object, Zt as preprocess, an as ZodError, cn as _coercedBoolean, ln as _coercedNumber, nn as unknown, on as datetime, qt as looseObject, rn as url, tn as union, un as _coercedString, xn as safeParse$1, zt as any } from "../@better-auth/core+[...].mjs";
import { Ct as voidType, Ln as ToolMessage, St as unknownType, _t as promiseType, bt as tupleType, ct as booleanType, dt as functionType, gt as optionalType, ht as objectType, i as DynamicStructuredTool, lt as custom$1, mt as numberType, pt as literalType, st as arrayType, ut as enumType, vt as recordType, wt as ZodError$1, xt as unionType, yt as stringType } from "./anthropic+[...].mjs";
import { g as Command, p as getCurrentTaskInput } from "./langgraph+[...].mjs";
import { PassThrough } from "node:stream";
import process$1 from "node:process";
//#region node_modules/zod/v4/classic/compat.js
/** @deprecated Use the raw string literal codes instead, e.g. "invalid_type". */
var ZodIssueCode = {
	invalid_type: "invalid_type",
	too_big: "too_big",
	too_small: "too_small",
	invalid_format: "invalid_format",
	not_multiple_of: "not_multiple_of",
	unrecognized_keys: "unrecognized_keys",
	invalid_union: "invalid_union",
	invalid_key: "invalid_key",
	invalid_element: "invalid_element",
	invalid_value: "invalid_value",
	custom: "custom"
};
/** @deprecated Do not use. Stub definition, only included for zod-to-json-schema compatibility. */
var ZodFirstPartyTypeKind;
ZodFirstPartyTypeKind || (ZodFirstPartyTypeKind = {});
//#endregion
//#region node_modules/zod/v4/classic/coerce.js
function string(params) {
	return _coercedString(ZodString, params);
}
function number(params) {
	return _coercedNumber(ZodNumber, params);
}
function boolean(params) {
	return _coercedBoolean(ZodBoolean, params);
}
//#endregion
//#region node_modules/@langchain/mcp-adapters/dist/hooks.js
var toolCallRequestSchema = objectType({
	serverName: stringType(),
	name: stringType(),
	args: unknownType()
});
var toolResultBeforeSchema = tupleType([custom$1(), arrayType(unionType([custom$1(), custom$1()]))]);
/**
* Tool result schema that users can return within the `afterToolCall` callback
*/
var toolResultSchema = unionType([
	stringType(),
	custom$1(),
	toolResultBeforeSchema,
	custom$1()
]);
var toolCallResultSchema = objectType({
	...toolCallRequestSchema.shape,
	result: toolResultBeforeSchema
});
var modifiedToolCallResultSchema = objectType({
	...toolCallRequestSchema.shape,
	result: toolResultSchema
});
var toolCallModificationSchema = objectType({
	headers: recordType(stringType()),
	args: unknownType()
}).partial();
var toolHooksSchema = objectType({
	beforeToolCall: functionType().args(toolCallRequestSchema, custom$1(), custom$1()).returns(unionType([
		promiseType(toolCallModificationSchema),
		toolCallModificationSchema,
		voidType(),
		promiseType(voidType())
	])).optional(),
	afterToolCall: functionType().args(toolCallResultSchema, custom$1(), custom$1()).returns(unionType([
		promiseType(modifiedToolCallResultSchema.pick({ result: true })),
		modifiedToolCallResultSchema.pick({ result: true }),
		voidType(),
		promiseType(voidType())
	])).optional()
});
//#endregion
//#region node_modules/@langchain/mcp-adapters/dist/types.js
var callToolResultContentTypes = [
	"audio",
	"image",
	"resource",
	"resource_link",
	"text"
];
/**
* The severity of a log message.
* @see {@link https://github.com/modelcontextprotocol/typescript-sdk/blob/main/src/types.ts#L1067}
*/
var LoggingLevelSchema$1 = enumType([
	"debug",
	"info",
	"notice",
	"warning",
	"error",
	"critical",
	"alert",
	"emergency"
]);
/**
* A uniquely identifying ID for a request in JSON-RPC.
* @see {@link https://github.com/modelcontextprotocol/typescript-sdk/blob/main/src/types.ts#L71C1-L74C72}
*/
var RequestIdSchema$1 = unionType([stringType(), numberType().int()]);
var outputHandlingSchema = unionType([unionType([literalType("content").describe("Put tool output into the ToolMessage.content array"), literalType("artifact").describe("Put tool output into the ToolMessage.artifact array")]), objectType(Object.fromEntries(callToolResultContentTypes.map((contentType) => [contentType, unionType([literalType("content").describe(`Put all ${contentType} tool output into the ToolMessage.content array`), literalType("artifact").describe(`Put all ${contentType} tool output into the ToolMessage.artifact array`)]).describe(`Where to place ${contentType} tool output in the LangChain ToolMessage`).optional()])))]).describe("Defines where to place each tool output type in the LangChain ToolMessage.\n\nItems in the `content` field will be used as input context for the LLM, while the artifact field is\nused for capturing tool output that won't be shown to the model, to be used in some later workflow\nstep.\n\nFor example, imagine that you have a SQL query tool that can return huge result sets. Rather than\nsending these large outputs directly to the model, perhaps you want the model to be able to inspect\nthe output in a code execution environment. In this case, you would set the output handling for the\n`resource` type to `artifact` (it's default value), and then upon initialization of your code\nexecution environment, you would look through your message history for `ToolMessage`s with the\n`artifact` field set to `resource`, and use the `content` field during initialization of the\nenvironment.");
/**
* Zod schema for validating OAuthClientProvider interface
* Since OAuthClientProvider has methods, we create a custom validator
*/
var oAuthClientProviderSchema = custom$1((val) => {
	if (!val || typeof val !== "object") return false;
	const requiredMethods = [
		"redirectUrl",
		"clientMetadata",
		"clientInformation",
		"tokens",
		"saveTokens"
	];
	if (!("redirectUrl" in val)) return false;
	if (!("clientMetadata" in val)) return false;
	for (const method of requiredMethods) if (!(method in val)) return false;
	return true;
}, { message: "Must be a valid OAuthClientProvider implementation with required properties: redirectUrl, clientMetadata, clientInformation, tokens, saveTokens" });
var baseConfigSchema = objectType({
	outputHandling: outputHandlingSchema.optional(),
	defaultToolTimeout: numberType().min(1).optional()
});
/**
* Stdio transport restart configuration
*/
var stdioRestartSchema = objectType({
	enabled: booleanType().describe("Whether to automatically restart the process if it exits").optional(),
	maxAttempts: numberType().describe("The maximum number of restart attempts").optional(),
	delayMs: numberType().describe("The delay in milliseconds between restart attempts").optional()
}).describe("Configuration for stdio transport restart");
/**
* Stdio transport connection
*/
var stdioConnectionSchema = objectType({
	transport: literalType("stdio").optional(),
	type: literalType("stdio").optional(),
	command: stringType().describe("The executable to run the server"),
	args: arrayType(stringType()).describe("Command line arguments to pass to the executable"),
	env: recordType(stringType()).describe("The environment to use when spawning the process").optional(),
	encoding: stringType().describe("The encoding to use when reading from the process").optional(),
	stderr: unionType([
		literalType("overlapped"),
		literalType("pipe"),
		literalType("ignore"),
		literalType("inherit")
	]).describe("How to handle stderr of the child process. This matches the semantics of Node's `child_process.spawn`").optional().default("inherit"),
	cwd: stringType().describe("The working directory to use when spawning the process").optional(),
	restart: stdioRestartSchema.optional()
}).and(baseConfigSchema).describe("Configuration for stdio transport connection");
/**
* Streamable HTTP transport reconnection configuration
*/
var streamableHttpReconnectSchema = objectType({
	enabled: booleanType().describe("Whether to automatically reconnect if the connection is lost").optional(),
	maxAttempts: numberType().describe("The maximum number of reconnection attempts").optional(),
	delayMs: numberType().describe("The delay in milliseconds between reconnection attempts").optional()
}).describe("Configuration for streamable HTTP transport reconnection");
/**
* Create combined schema for all transport connection types
*/
var connectionSchema = unionType([stdioConnectionSchema, objectType({
	transport: unionType([literalType("http"), literalType("sse")]).optional(),
	type: unionType([literalType("http"), literalType("sse")]).optional(),
	url: stringType().url(),
	headers: recordType(stringType()).optional(),
	authProvider: oAuthClientProviderSchema.optional(),
	reconnect: streamableHttpReconnectSchema.optional(),
	automaticSSEFallback: booleanType().optional().default(true)
}).and(baseConfigSchema).describe("Configuration for streamable HTTP transport connection")]).describe("Configuration for a single MCP server");
var eventContextSchema = unionType([objectType({
	type: literalType("tool"),
	name: stringType(),
	args: unknownType(),
	server: stringType()
}), objectType({ type: literalType("unknown") })]);
var serverMessageSourceSchema = objectType({
	server: stringType(),
	options: connectionSchema
});
var notifications = objectType({
	onMessage: functionType().args(objectType({
		level: LoggingLevelSchema$1,
		logger: optionalType(stringType()),
		data: unknownType()
	}), serverMessageSourceSchema).returns(unionType([voidType(), promiseType(voidType())])).optional(),
	onProgress: functionType().args(objectType({
		progress: numberType(),
		total: optionalType(numberType()),
		message: optionalType(stringType())
	}), eventContextSchema).returns(unionType([voidType(), promiseType(voidType())])).optional(),
	onCancelled: functionType().args(objectType({
		requestId: RequestIdSchema$1,
		reason: stringType().optional()
	}), serverMessageSourceSchema).returns(unionType([voidType(), promiseType(voidType())])).optional(),
	onInitialized: functionType().args(serverMessageSourceSchema).returns(unionType([voidType(), promiseType(voidType())])).optional(),
	onPromptsListChanged: functionType().args(serverMessageSourceSchema).returns(unionType([voidType(), promiseType(voidType())])).optional(),
	onResourcesListChanged: functionType().args(serverMessageSourceSchema).returns(unionType([voidType(), promiseType(voidType())])).optional(),
	onResourcesUpdated: functionType().args(objectType({ uri: stringType() }), serverMessageSourceSchema).returns(unionType([voidType(), promiseType(voidType())])).optional(),
	onRootsListChanged: functionType().args(serverMessageSourceSchema).returns(unionType([voidType(), promiseType(voidType())])).optional(),
	onToolsListChanged: functionType().args(serverMessageSourceSchema).returns(unionType([voidType(), promiseType(voidType())])).optional()
});
/**
* {@link MultiServerMCPClient} configuration
*/
var clientConfigSchema = objectType({
	mcpServers: recordType(connectionSchema).describe("A map of server names to their configuration"),
	throwOnLoadError: booleanType().describe("Whether to throw an error if a tool fails to load").optional().default(true),
	prefixToolNameWithServerName: booleanType().describe("Whether to prefix tool names with the server name").optional().default(false),
	additionalToolNamePrefix: stringType().describe("An additional prefix to add to the tool name").optional().default(""),
	useStandardContentBlocks: booleanType().describe("If true, the tool will use LangChain's standard multimodal content blocks for tools that output\nimage or audio content. When true, embedded resources will be converted to `StandardFileBlock`\nobjects. When `false`, all artifacts are left in their MCP format, but embedded resources will\nbe converted to `StandardFileBlock` objects if `outputHandling` causes embedded resources to be\ntreated as content, as otherwise ChatModel providers will not be able to interpret them.").optional().default(false),
	onConnectionError: unionType([enumType(["throw", "ignore"]), functionType().args(objectType({
		serverName: stringType(),
		error: unknownType()
	})).returns(voidType())]).describe("Behavior when a server fails to connect: 'throw' to error immediately, 'ignore' to skip failed servers, or a function for custom error handling").optional().default("throw")
}).and(baseConfigSchema).and(toolHooksSchema).and(notifications).describe("Configuration for the MCP client");
/**
* Helper function that expands a string literal OutputHandling to an object with all content types.
* Used when applying server-level overrides to the top-level config.
*
* @internal
*/
function _resolveDetailedOutputHandling(outputHandling, applyDefaults = false) {
	if (outputHandling == null) return {};
	if (typeof outputHandling === "string") return Object.fromEntries(callToolResultContentTypes.map((contentType) => [contentType, outputHandling]));
	const resolved = {};
	for (const contentType of callToolResultContentTypes) if (outputHandling[contentType] || applyDefaults) resolved[contentType] = outputHandling[contentType] ?? (contentType === "resource" ? "artifact" : "content");
	return resolved;
}
/**
* Given a base {@link OutputHandling}, apply any overrides from the override {@link OutputHandling}.
*
* @internal
*/
function _resolveAndApplyOverrideHandlingOverrides(base, override) {
	const expandedBase = _resolveDetailedOutputHandling(base);
	const expandedOverride = _resolveDetailedOutputHandling(override);
	return {
		...expandedBase,
		...expandedOverride
	};
}
//#endregion
//#region node_modules/ms/index.js
var require_ms = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Helpers.
	*/
	var s = 1e3;
	var m = s * 60;
	var h = m * 60;
	var d = h * 24;
	var w = d * 7;
	var y = d * 365.25;
	/**
	* Parse or format the given `val`.
	*
	* Options:
	*
	*  - `long` verbose formatting [false]
	*
	* @param {String|Number} val
	* @param {Object} [options]
	* @throws {Error} throw an error if val is not a non-empty string or a number
	* @return {String|Number}
	* @api public
	*/
	module.exports = function(val, options) {
		options = options || {};
		var type = typeof val;
		if (type === "string" && val.length > 0) return parse(val);
		else if (type === "number" && isFinite(val)) return options.long ? fmtLong(val) : fmtShort(val);
		throw new Error("val is not a non-empty string or a valid number. val=" + JSON.stringify(val));
	};
	/**
	* Parse the given `str` and return milliseconds.
	*
	* @param {String} str
	* @return {Number}
	* @api private
	*/
	function parse(str) {
		str = String(str);
		if (str.length > 100) return;
		var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(str);
		if (!match) return;
		var n = parseFloat(match[1]);
		switch ((match[2] || "ms").toLowerCase()) {
			case "years":
			case "year":
			case "yrs":
			case "yr":
			case "y": return n * y;
			case "weeks":
			case "week":
			case "w": return n * w;
			case "days":
			case "day":
			case "d": return n * d;
			case "hours":
			case "hour":
			case "hrs":
			case "hr":
			case "h": return n * h;
			case "minutes":
			case "minute":
			case "mins":
			case "min":
			case "m": return n * m;
			case "seconds":
			case "second":
			case "secs":
			case "sec":
			case "s": return n * s;
			case "milliseconds":
			case "millisecond":
			case "msecs":
			case "msec":
			case "ms": return n;
			default: return;
		}
	}
	/**
	* Short format for `ms`.
	*
	* @param {Number} ms
	* @return {String}
	* @api private
	*/
	function fmtShort(ms) {
		var msAbs = Math.abs(ms);
		if (msAbs >= d) return Math.round(ms / d) + "d";
		if (msAbs >= h) return Math.round(ms / h) + "h";
		if (msAbs >= m) return Math.round(ms / m) + "m";
		if (msAbs >= s) return Math.round(ms / s) + "s";
		return ms + "ms";
	}
	/**
	* Long format for `ms`.
	*
	* @param {Number} ms
	* @return {String}
	* @api private
	*/
	function fmtLong(ms) {
		var msAbs = Math.abs(ms);
		if (msAbs >= d) return plural(ms, msAbs, d, "day");
		if (msAbs >= h) return plural(ms, msAbs, h, "hour");
		if (msAbs >= m) return plural(ms, msAbs, m, "minute");
		if (msAbs >= s) return plural(ms, msAbs, s, "second");
		return ms + " ms";
	}
	/**
	* Pluralization helper.
	*/
	function plural(ms, msAbs, n, name) {
		var isPlural = msAbs >= n * 1.5;
		return Math.round(ms / n) + " " + name + (isPlural ? "s" : "");
	}
}));
//#endregion
//#region node_modules/debug/src/common.js
var require_common = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* This is the common logic for both the Node.js and web browser
	* implementations of `debug()`.
	*/
	function setup(env) {
		createDebug.debug = createDebug;
		createDebug.default = createDebug;
		createDebug.coerce = coerce;
		createDebug.disable = disable;
		createDebug.enable = enable;
		createDebug.enabled = enabled;
		createDebug.humanize = require_ms();
		createDebug.destroy = destroy;
		Object.keys(env).forEach((key) => {
			createDebug[key] = env[key];
		});
		/**
		* The currently active debug mode names, and names to skip.
		*/
		createDebug.names = [];
		createDebug.skips = [];
		/**
		* Map of special "%n" handling functions, for the debug "format" argument.
		*
		* Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
		*/
		createDebug.formatters = {};
		/**
		* Selects a color for a debug namespace
		* @param {String} namespace The namespace string for the debug instance to be colored
		* @return {Number|String} An ANSI color code for the given namespace
		* @api private
		*/
		function selectColor(namespace) {
			let hash = 0;
			for (let i = 0; i < namespace.length; i++) {
				hash = (hash << 5) - hash + namespace.charCodeAt(i);
				hash |= 0;
			}
			return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
		}
		createDebug.selectColor = selectColor;
		/**
		* Create a debugger with the given `namespace`.
		*
		* @param {String} namespace
		* @return {Function}
		* @api public
		*/
		function createDebug(namespace) {
			let prevTime;
			let enableOverride = null;
			let namespacesCache;
			let enabledCache;
			function debug(...args) {
				if (!debug.enabled) return;
				const self = debug;
				const curr = Number(/* @__PURE__ */ new Date());
				self.diff = curr - (prevTime || curr);
				self.prev = prevTime;
				self.curr = curr;
				prevTime = curr;
				args[0] = createDebug.coerce(args[0]);
				if (typeof args[0] !== "string") args.unshift("%O");
				let index = 0;
				args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
					if (match === "%%") return "%";
					index++;
					const formatter = createDebug.formatters[format];
					if (typeof formatter === "function") {
						const val = args[index];
						match = formatter.call(self, val);
						args.splice(index, 1);
						index--;
					}
					return match;
				});
				createDebug.formatArgs.call(self, args);
				(self.log || createDebug.log).apply(self, args);
			}
			debug.namespace = namespace;
			debug.useColors = createDebug.useColors();
			debug.color = createDebug.selectColor(namespace);
			debug.extend = extend;
			debug.destroy = createDebug.destroy;
			Object.defineProperty(debug, "enabled", {
				enumerable: true,
				configurable: false,
				get: () => {
					if (enableOverride !== null) return enableOverride;
					if (namespacesCache !== createDebug.namespaces) {
						namespacesCache = createDebug.namespaces;
						enabledCache = createDebug.enabled(namespace);
					}
					return enabledCache;
				},
				set: (v) => {
					enableOverride = v;
				}
			});
			if (typeof createDebug.init === "function") createDebug.init(debug);
			return debug;
		}
		function extend(namespace, delimiter) {
			const newDebug = createDebug(this.namespace + (typeof delimiter === "undefined" ? ":" : delimiter) + namespace);
			newDebug.log = this.log;
			return newDebug;
		}
		/**
		* Enables a debug mode by namespaces. This can include modes
		* separated by a colon and wildcards.
		*
		* @param {String} namespaces
		* @api public
		*/
		function enable(namespaces) {
			createDebug.save(namespaces);
			createDebug.namespaces = namespaces;
			createDebug.names = [];
			createDebug.skips = [];
			const split = (typeof namespaces === "string" ? namespaces : "").trim().replace(/\s+/g, ",").split(",").filter(Boolean);
			for (const ns of split) if (ns[0] === "-") createDebug.skips.push(ns.slice(1));
			else createDebug.names.push(ns);
		}
		/**
		* Checks if the given string matches a namespace template, honoring
		* asterisks as wildcards.
		*
		* @param {String} search
		* @param {String} template
		* @return {Boolean}
		*/
		function matchesTemplate(search, template) {
			let searchIndex = 0;
			let templateIndex = 0;
			let starIndex = -1;
			let matchIndex = 0;
			while (searchIndex < search.length) if (templateIndex < template.length && (template[templateIndex] === search[searchIndex] || template[templateIndex] === "*")) if (template[templateIndex] === "*") {
				starIndex = templateIndex;
				matchIndex = searchIndex;
				templateIndex++;
			} else {
				searchIndex++;
				templateIndex++;
			}
			else if (starIndex !== -1) {
				templateIndex = starIndex + 1;
				matchIndex++;
				searchIndex = matchIndex;
			} else return false;
			while (templateIndex < template.length && template[templateIndex] === "*") templateIndex++;
			return templateIndex === template.length;
		}
		/**
		* Disable debug output.
		*
		* @return {String} namespaces
		* @api public
		*/
		function disable() {
			const namespaces = [...createDebug.names, ...createDebug.skips.map((namespace) => "-" + namespace)].join(",");
			createDebug.enable("");
			return namespaces;
		}
		/**
		* Returns true if the given mode name is enabled, false otherwise.
		*
		* @param {String} name
		* @return {Boolean}
		* @api public
		*/
		function enabled(name) {
			for (const skip of createDebug.skips) if (matchesTemplate(name, skip)) return false;
			for (const ns of createDebug.names) if (matchesTemplate(name, ns)) return true;
			return false;
		}
		/**
		* Coerce `val`.
		*
		* @param {Mixed} val
		* @return {Mixed}
		* @api private
		*/
		function coerce(val) {
			if (val instanceof Error) return val.stack || val.message;
			return val;
		}
		/**
		* XXX DO NOT USE. This is a temporary stub function.
		* XXX It WILL be removed in the next major release.
		*/
		function destroy() {
			console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
		}
		createDebug.enable(createDebug.load());
		return createDebug;
	}
	module.exports = setup;
}));
//#endregion
//#region node_modules/debug/src/browser.js
var require_browser = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* This is the web browser implementation of `debug()`.
	*/
	exports.formatArgs = formatArgs;
	exports.save = save;
	exports.load = load;
	exports.useColors = useColors;
	exports.storage = localstorage();
	exports.destroy = (() => {
		let warned = false;
		return () => {
			if (!warned) {
				warned = true;
				console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
			}
		};
	})();
	/**
	* Colors.
	*/
	exports.colors = [
		"#0000CC",
		"#0000FF",
		"#0033CC",
		"#0033FF",
		"#0066CC",
		"#0066FF",
		"#0099CC",
		"#0099FF",
		"#00CC00",
		"#00CC33",
		"#00CC66",
		"#00CC99",
		"#00CCCC",
		"#00CCFF",
		"#3300CC",
		"#3300FF",
		"#3333CC",
		"#3333FF",
		"#3366CC",
		"#3366FF",
		"#3399CC",
		"#3399FF",
		"#33CC00",
		"#33CC33",
		"#33CC66",
		"#33CC99",
		"#33CCCC",
		"#33CCFF",
		"#6600CC",
		"#6600FF",
		"#6633CC",
		"#6633FF",
		"#66CC00",
		"#66CC33",
		"#9900CC",
		"#9900FF",
		"#9933CC",
		"#9933FF",
		"#99CC00",
		"#99CC33",
		"#CC0000",
		"#CC0033",
		"#CC0066",
		"#CC0099",
		"#CC00CC",
		"#CC00FF",
		"#CC3300",
		"#CC3333",
		"#CC3366",
		"#CC3399",
		"#CC33CC",
		"#CC33FF",
		"#CC6600",
		"#CC6633",
		"#CC9900",
		"#CC9933",
		"#CCCC00",
		"#CCCC33",
		"#FF0000",
		"#FF0033",
		"#FF0066",
		"#FF0099",
		"#FF00CC",
		"#FF00FF",
		"#FF3300",
		"#FF3333",
		"#FF3366",
		"#FF3399",
		"#FF33CC",
		"#FF33FF",
		"#FF6600",
		"#FF6633",
		"#FF9900",
		"#FF9933",
		"#FFCC00",
		"#FFCC33"
	];
	/**
	* Currently only WebKit-based Web Inspectors, Firefox >= v31,
	* and the Firebug extension (any Firefox version) are known
	* to support "%c" CSS customizations.
	*
	* TODO: add a `localStorage` variable to explicitly enable/disable colors
	*/
	function useColors() {
		if (typeof window !== "undefined" && window.process && (window.process.type === "renderer" || window.process.__nwjs)) return true;
		if (typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) return false;
		let m;
		return typeof document !== "undefined" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || typeof window !== "undefined" && window.console && (window.console.firebug || window.console.exception && window.console.table) || typeof navigator !== "undefined" && navigator.userAgent && (m = navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)) && parseInt(m[1], 10) >= 31 || typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
	}
	/**
	* Colorize log arguments if enabled.
	*
	* @api public
	*/
	function formatArgs(args) {
		args[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + args[0] + (this.useColors ? "%c " : " ") + "+" + module.exports.humanize(this.diff);
		if (!this.useColors) return;
		const c = "color: " + this.color;
		args.splice(1, 0, c, "color: inherit");
		let index = 0;
		let lastC = 0;
		args[0].replace(/%[a-zA-Z%]/g, (match) => {
			if (match === "%%") return;
			index++;
			if (match === "%c") lastC = index;
		});
		args.splice(lastC, 0, c);
	}
	/**
	* Invokes `console.debug()` when available.
	* No-op when `console.debug` is not a "function".
	* If `console.debug` is not available, falls back
	* to `console.log`.
	*
	* @api public
	*/
	exports.log = console.debug || console.log || (() => {});
	/**
	* Save `namespaces`.
	*
	* @param {String} namespaces
	* @api private
	*/
	function save(namespaces) {
		try {
			if (namespaces) exports.storage.setItem("debug", namespaces);
			else exports.storage.removeItem("debug");
		} catch (error) {}
	}
	/**
	* Load `namespaces`.
	*
	* @return {String} returns the previously persisted debug modes
	* @api private
	*/
	function load() {
		let r;
		try {
			r = exports.storage.getItem("debug") || exports.storage.getItem("DEBUG");
		} catch (error) {}
		if (!r && typeof process !== "undefined" && "env" in process) r = process.env.DEBUG;
		return r;
	}
	/**
	* Localstorage attempts to return the localstorage.
	*
	* This is necessary because safari throws
	* when a user disables cookies/localstorage
	* and you attempt to access it.
	*
	* @return {LocalStorage}
	* @api private
	*/
	function localstorage() {
		try {
			return localStorage;
		} catch (error) {}
	}
	module.exports = require_common()(exports);
	var { formatters } = module.exports;
	/**
	* Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
	*/
	formatters.j = function(v) {
		try {
			return JSON.stringify(v);
		} catch (error) {
			return "[UnexpectedJSONParseError]: " + error.message;
		}
	};
}));
//#endregion
//#region node_modules/has-flag/index.js
var require_has_flag = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = (flag, argv = process.argv) => {
		const prefix = flag.startsWith("-") ? "" : flag.length === 1 ? "-" : "--";
		const position = argv.indexOf(prefix + flag);
		const terminatorPosition = argv.indexOf("--");
		return position !== -1 && (terminatorPosition === -1 || position < terminatorPosition);
	};
}));
//#endregion
//#region node_modules/supports-color/index.js
var require_supports_color = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var os = __require("os");
	var tty$1 = __require("tty");
	var hasFlag = require_has_flag();
	var { env } = process;
	var forceColor;
	if (hasFlag("no-color") || hasFlag("no-colors") || hasFlag("color=false") || hasFlag("color=never")) forceColor = 0;
	else if (hasFlag("color") || hasFlag("colors") || hasFlag("color=true") || hasFlag("color=always")) forceColor = 1;
	if ("FORCE_COLOR" in env) if (env.FORCE_COLOR === "true") forceColor = 1;
	else if (env.FORCE_COLOR === "false") forceColor = 0;
	else forceColor = env.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(env.FORCE_COLOR, 10), 3);
	function translateLevel(level) {
		if (level === 0) return false;
		return {
			level,
			hasBasic: true,
			has256: level >= 2,
			has16m: level >= 3
		};
	}
	function supportsColor(haveStream, streamIsTTY) {
		if (forceColor === 0) return 0;
		if (hasFlag("color=16m") || hasFlag("color=full") || hasFlag("color=truecolor")) return 3;
		if (hasFlag("color=256")) return 2;
		if (haveStream && !streamIsTTY && forceColor === void 0) return 0;
		const min = forceColor || 0;
		if (env.TERM === "dumb") return min;
		if (process.platform === "win32") {
			const osRelease = os.release().split(".");
			if (Number(osRelease[0]) >= 10 && Number(osRelease[2]) >= 10586) return Number(osRelease[2]) >= 14931 ? 3 : 2;
			return 1;
		}
		if ("CI" in env) {
			if ([
				"TRAVIS",
				"CIRCLECI",
				"APPVEYOR",
				"GITLAB_CI",
				"GITHUB_ACTIONS",
				"BUILDKITE"
			].some((sign) => sign in env) || env.CI_NAME === "codeship") return 1;
			return min;
		}
		if ("TEAMCITY_VERSION" in env) return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
		if (env.COLORTERM === "truecolor") return 3;
		if ("TERM_PROGRAM" in env) {
			const version = parseInt((env.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
			switch (env.TERM_PROGRAM) {
				case "iTerm.app": return version >= 3 ? 3 : 2;
				case "Apple_Terminal": return 2;
			}
		}
		if (/-256(color)?$/i.test(env.TERM)) return 2;
		if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) return 1;
		if ("COLORTERM" in env) return 1;
		return min;
	}
	function getSupportLevel(stream) {
		return translateLevel(supportsColor(stream, stream && stream.isTTY));
	}
	module.exports = {
		supportsColor: getSupportLevel,
		stdout: translateLevel(supportsColor(true, tty$1.isatty(1))),
		stderr: translateLevel(supportsColor(true, tty$1.isatty(2)))
	};
}));
//#endregion
//#region node_modules/debug/src/node.js
var require_node = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Module dependencies.
	*/
	var tty = __require("tty");
	var util = __require("util");
	/**
	* This is the Node.js implementation of `debug()`.
	*/
	exports.init = init;
	exports.log = log;
	exports.formatArgs = formatArgs;
	exports.save = save;
	exports.load = load;
	exports.useColors = useColors;
	exports.destroy = util.deprecate(() => {}, "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
	/**
	* Colors.
	*/
	exports.colors = [
		6,
		2,
		3,
		4,
		5,
		1
	];
	try {
		const supportsColor = require_supports_color();
		if (supportsColor && (supportsColor.stderr || supportsColor).level >= 2) exports.colors = [
			20,
			21,
			26,
			27,
			32,
			33,
			38,
			39,
			40,
			41,
			42,
			43,
			44,
			45,
			56,
			57,
			62,
			63,
			68,
			69,
			74,
			75,
			76,
			77,
			78,
			79,
			80,
			81,
			92,
			93,
			98,
			99,
			112,
			113,
			128,
			129,
			134,
			135,
			148,
			149,
			160,
			161,
			162,
			163,
			164,
			165,
			166,
			167,
			168,
			169,
			170,
			171,
			172,
			173,
			178,
			179,
			184,
			185,
			196,
			197,
			198,
			199,
			200,
			201,
			202,
			203,
			204,
			205,
			206,
			207,
			208,
			209,
			214,
			215,
			220,
			221
		];
	} catch (error) {}
	/**
	* Build up the default `inspectOpts` object from the environment variables.
	*
	*   $ DEBUG_COLORS=no DEBUG_DEPTH=10 DEBUG_SHOW_HIDDEN=enabled node script.js
	*/
	exports.inspectOpts = Object.keys(process.env).filter((key) => {
		return /^debug_/i.test(key);
	}).reduce((obj, key) => {
		const prop = key.substring(6).toLowerCase().replace(/_([a-z])/g, (_, k) => {
			return k.toUpperCase();
		});
		let val = process.env[key];
		if (/^(yes|on|true|enabled)$/i.test(val)) val = true;
		else if (/^(no|off|false|disabled)$/i.test(val)) val = false;
		else if (val === "null") val = null;
		else val = Number(val);
		obj[prop] = val;
		return obj;
	}, {});
	/**
	* Is stdout a TTY? Colored output is enabled when `true`.
	*/
	function useColors() {
		return "colors" in exports.inspectOpts ? Boolean(exports.inspectOpts.colors) : tty.isatty(process.stderr.fd);
	}
	/**
	* Adds ANSI color escape codes if enabled.
	*
	* @api public
	*/
	function formatArgs(args) {
		const { namespace: name, useColors } = this;
		if (useColors) {
			const c = this.color;
			const colorCode = "\x1B[3" + (c < 8 ? c : "8;5;" + c);
			const prefix = `  ${colorCode};1m${name} \u001B[0m`;
			args[0] = prefix + args[0].split("\n").join("\n" + prefix);
			args.push(colorCode + "m+" + module.exports.humanize(this.diff) + "\x1B[0m");
		} else args[0] = getDate() + name + " " + args[0];
	}
	function getDate() {
		if (exports.inspectOpts.hideDate) return "";
		return (/* @__PURE__ */ new Date()).toISOString() + " ";
	}
	/**
	* Invokes `util.formatWithOptions()` with the specified arguments and writes to stderr.
	*/
	function log(...args) {
		return process.stderr.write(util.formatWithOptions(exports.inspectOpts, ...args) + "\n");
	}
	/**
	* Save `namespaces`.
	*
	* @param {String} namespaces
	* @api private
	*/
	function save(namespaces) {
		if (namespaces) process.env.DEBUG = namespaces;
		else delete process.env.DEBUG;
	}
	/**
	* Load `namespaces`.
	*
	* @return {String} returns the previously persisted debug modes
	* @api private
	*/
	function load() {
		return process.env.DEBUG;
	}
	/**
	* Init logic for `debug` instances.
	*
	* Create a new `inspectOpts` object in case `useColors` is set
	* differently for a particular `debug` instance.
	*/
	function init(debug) {
		debug.inspectOpts = {};
		const keys = Object.keys(exports.inspectOpts);
		for (let i = 0; i < keys.length; i++) debug.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];
	}
	module.exports = require_common()(exports);
	var { formatters } = module.exports;
	/**
	* Map %o to `util.inspect()`, all on a single line.
	*/
	formatters.o = function(v) {
		this.inspectOpts.colors = this.useColors;
		return util.inspect(v, this.inspectOpts).split("\n").map((str) => str.trim()).join(" ");
	};
	/**
	* Map %O to `util.inspect()`, allowing multiple lines if needed.
	*/
	formatters.O = function(v) {
		this.inspectOpts.colors = this.useColors;
		return util.inspect(v, this.inspectOpts);
	};
}));
//#endregion
//#region node_modules/@langchain/mcp-adapters/dist/logging.js
var import_src = /* @__PURE__ */ __toESM((/* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Detect Electron renderer / nwjs process, which is node, but we should
	* treat as a browser.
	*/
	if (typeof process === "undefined" || process.type === "renderer" || process.browser === true || process.__nwjs) module.exports = require_browser();
	else module.exports = require_node();
})))(), 1);
var packageName = "@langchain/mcp-adapters";
var debugLog$3 = {};
function getDebugLog(instanceName = "client") {
	const key = `${packageName}:${instanceName}`;
	if (!debugLog$3[key]) debugLog$3[key] = (0, import_src.default)(key);
	return debugLog$3[key];
}
//#endregion
//#region node_modules/@langchain/mcp-adapters/dist/tools.js
var debugLog$2 = getDebugLog("tools");
/**
* Dereferences $ref pointers in a JSON Schema by inlining the definitions from $defs.
* This is necessary because some JSON Schema validators (like @cfworker/json-schema)
* don't automatically resolve $ref references to $defs.
*
* @param schema - The JSON Schema to dereference
* @returns A new schema with all $ref pointers resolved
*/
function dereferenceJsonSchema(schema) {
	const definitions = schema.$defs ?? schema.definitions ?? {};
	/**
	* Recursively resolve $ref pointers in the schema.
	* Tracks visited refs to prevent infinite recursion with circular references.
	*/
	function resolveRefs(obj, visitedRefs = /* @__PURE__ */ new Set()) {
		if (typeof obj !== "object" || obj === null) return obj;
		if (obj.$ref && typeof obj.$ref === "string") {
			const refPath = obj.$ref;
			const defsMatch = refPath.match(/^#\/\$defs\/(.+)$/);
			const definitionsMatch = refPath.match(/^#\/definitions\/(.+)$/);
			const match = defsMatch || definitionsMatch;
			if (match) {
				const defName = match[1];
				const definition = definitions[defName];
				if (definition) {
					if (visitedRefs.has(refPath)) {
						debugLog$2(`WARNING: Circular reference detected for ${refPath}, using empty object`);
						return { type: "object" };
					}
					const newVisitedRefs = new Set(visitedRefs);
					newVisitedRefs.add(refPath);
					const { $ref: _, ...restOfObj } = obj;
					return {
						...resolveRefs(definition, newVisitedRefs),
						...restOfObj
					};
				} else debugLog$2(`WARNING: Could not resolve $ref: ${refPath}`);
			}
			return obj;
		}
		const result = {};
		for (const [key, value] of Object.entries(obj)) {
			if (key === "$defs" || key === "definitions") continue;
			if (Array.isArray(value)) result[key] = value.map((item) => typeof item === "object" && item !== null ? resolveRefs(item, visitedRefs) : item);
			else if (typeof value === "object" && value !== null) result[key] = resolveRefs(value, visitedRefs);
			else result[key] = value;
		}
		return result;
	}
	return resolveRefs(schema);
}
/**
* Deep merges two JSON Schema objects.
* Arrays are concatenated (with special handling for enum), objects are recursively merged,
* primitives are overwritten.
*
* @param target - The target schema to merge into
* @param source - The source schema to merge from
* @returns A new merged schema
*/
function deepMergeSchemas(target, source) {
	const result = { ...target };
	for (const [key, sourceValue] of Object.entries(source)) {
		const targetValue = result[key];
		if (key === "required" && Array.isArray(targetValue)) result[key] = [.../* @__PURE__ */ new Set([...targetValue, ...sourceValue])];
		else if (key === "const") {
			const existingConst = result.const;
			const existingEnum = result.enum;
			const values = /* @__PURE__ */ new Set();
			if (existingEnum) for (const v of existingEnum) values.add(v);
			if (existingConst !== void 0) values.add(existingConst);
			values.add(sourceValue);
			delete result.const;
			result.enum = [...values];
		} else if (key === "enum" && Array.isArray(sourceValue)) {
			const values = /* @__PURE__ */ new Set();
			if (Array.isArray(targetValue)) for (const v of targetValue) values.add(v);
			if (result.const !== void 0) {
				values.add(result.const);
				delete result.const;
			}
			for (const v of sourceValue) values.add(v);
			result[key] = [...values];
		} else if (key === "properties" && typeof targetValue === "object" && targetValue !== null) {
			const mergedProps = { ...targetValue };
			for (const [propKey, propValue] of Object.entries(sourceValue)) if (mergedProps[propKey] && typeof mergedProps[propKey] === "object" && typeof propValue === "object") mergedProps[propKey] = deepMergeSchemas(mergedProps[propKey], propValue);
			else mergedProps[propKey] = propValue;
			result[key] = mergedProps;
		} else if (Array.isArray(sourceValue) && Array.isArray(targetValue)) result[key] = [...targetValue, ...sourceValue];
		else if (typeof sourceValue === "object" && sourceValue !== null && !Array.isArray(sourceValue) && typeof targetValue === "object" && targetValue !== null && !Array.isArray(targetValue)) result[key] = deepMergeSchemas(targetValue, sourceValue);
		else result[key] = sourceValue;
	}
	return result;
}
/**
* Extracts and merges properties from if/then/else conditional schemas.
* This is used when processing allOf items that contain conditionals.
*
* @param schema - A schema that may contain if/then/else
* @returns Properties extracted from both then and else branches
*/
function extractPropertiesFromConditional(schema) {
	let result = {};
	if (schema.then && typeof schema.then === "object") {
		const thenSchema = schema.then;
		if (thenSchema.properties) result = deepMergeSchemas(result, { properties: thenSchema.properties });
		if (thenSchema.required) result.required = [.../* @__PURE__ */ new Set([...result.required || [], ...thenSchema.required])];
	}
	if (schema.else && typeof schema.else === "object") {
		const elseSchema = schema.else;
		if (elseSchema.properties) result = deepMergeSchemas(result, { properties: elseSchema.properties });
		if (elseSchema.required) result.required = [.../* @__PURE__ */ new Set([...result.required || [], ...elseSchema.required])];
	}
	return result;
}
/**
* Simplifies a JSON Schema for LLM compatibility by removing patterns that
* OpenAI and other LLM providers don't support at the top level:
* - allOf: merged into the main schema
* - anyOf/oneOf: flattened to the first object variant or merged if all are objects
* - if/then/else: conditional schemas are removed, but properties are extracted
* - not: negation constraints are removed
* - $schema: meta schema reference is removed
* - unevaluatedProperties: not supported by OpenAI
*
* This transformation is applied recursively to nested schemas as well.
*
* @param schema - The JSON Schema to simplify
* @returns A new simplified schema compatible with LLM tool calling APIs
*/
function simplifyJsonSchemaForLLM(schema) {
	if (typeof schema !== "object" || schema === null) return schema;
	const { allOf, anyOf, oneOf, not: _not, if: schemaIf, then: schemaThen, else: schemaElse, $schema: _$schema, unevaluatedProperties: _unevaluatedProperties, ...baseSchema } = schema;
	let result = { ...baseSchema };
	if (schemaIf || schemaThen || schemaElse) {
		const conditionalProps = extractPropertiesFromConditional({
			if: schemaIf,
			then: schemaThen,
			else: schemaElse
		});
		result = deepMergeSchemas(result, conditionalProps);
		debugLog$2(`INFO: Extracted properties from if/then/else conditional`);
	}
	if (Array.isArray(allOf)) {
		for (const subSchema of allOf) {
			if (subSchema.if || subSchema.then || subSchema.else) {
				const conditionalProps = extractPropertiesFromConditional(subSchema);
				result = deepMergeSchemas(result, conditionalProps);
			}
			const simplified = simplifyJsonSchemaForLLM(subSchema);
			result = deepMergeSchemas(result, simplified);
		}
		debugLog$2(`INFO: Flattened allOf with ${allOf.length} schemas into base schema`);
	}
	const unionSchemas = anyOf || oneOf;
	if (Array.isArray(unionSchemas) && unionSchemas.length > 0) {
		const allAreObjects = unionSchemas.every((s) => typeof s === "object" && s !== null && (s.type === "object" || s.properties));
		const mergedProperties = {};
		const requiredSets = [];
		const schemasToMerge = allAreObjects ? unionSchemas : unionSchemas.filter((s) => typeof s === "object" && s !== null && (s.type === "object" || s.properties));
		for (const subSchema of schemasToMerge) {
			const simplified = simplifyJsonSchemaForLLM(subSchema);
			if (simplified.properties) Object.assign(mergedProperties, simplified.properties);
			if (simplified.required && Array.isArray(simplified.required)) requiredSets.push(new Set(simplified.required));
			if (simplified.type && !result.type) result.type = simplified.type;
		}
		if (Object.keys(mergedProperties).length > 0) result.properties = {
			...result.properties,
			...mergedProperties
		};
		if (requiredSets.length > 0) {
			const commonRequired = requiredSets.reduce((acc, set) => {
				return new Set([...acc].filter((x) => set.has(x)));
			});
			if (commonRequired.size > 0) result.required = [.../* @__PURE__ */ new Set([...result.required || [], ...commonRequired])];
		}
		debugLog$2(`INFO: Merged ${schemasToMerge.length} object schemas from ${anyOf ? "anyOf" : "oneOf"}`);
	}
	if (result.properties && !result.type) result.type = "object";
	if (result.properties) {
		const simplifiedProperties = {};
		for (const [propName, propSchema] of Object.entries(result.properties)) if (typeof propSchema === "object" && propSchema !== null) simplifiedProperties[propName] = simplifyJsonSchemaForLLM(propSchema);
		else simplifiedProperties[propName] = propSchema;
		result.properties = simplifiedProperties;
	}
	if (result.items) {
		if (Array.isArray(result.items)) result.items = result.items.map((item) => typeof item === "object" && item !== null ? simplifyJsonSchemaForLLM(item) : item);
		else if (typeof result.items === "object") result.items = simplifyJsonSchemaForLLM(result.items);
	}
	if (typeof result.additionalProperties === "object" && result.additionalProperties !== null) result.additionalProperties = simplifyJsonSchemaForLLM(result.additionalProperties);
	return result;
}
/**
* Custom error class for tool exceptions
*/
var ToolException = class extends Error {
	constructor(message, cause) {
		super(message);
		this.name = "ToolException";
		/**
		* don't display the large ZodError stack trace
		*/
		if (cause && (cause instanceof ZodError || cause instanceof ZodError$1)) {
			const minifiedZodError = new Error(prettifyError(cause));
			const stackByLine = cause.stack?.split("\n") || [];
			minifiedZodError.stack = cause.stack?.split("\n").slice(stackByLine.findIndex((l) => l.includes("    at"))).join("\n");
			this.cause = minifiedZodError;
		} else if (cause) this.cause = cause;
	}
};
function isToolException(error) {
	return typeof error === "object" && error !== null && "name" in error && error.name === "ToolException";
}
function isResourceReference(resource) {
	return typeof resource === "object" && resource !== null && "uri" in resource && typeof resource.uri === "string" && (!("blob" in resource) || resource.blob == null) && (!("text" in resource) || resource.text == null);
}
async function* _embeddedResourceToStandardFileBlocks(resource, client) {
	if (isResourceReference(resource)) {
		const response = await client.readResource({ uri: resource.uri });
		for (const content of response.contents) yield* _embeddedResourceToStandardFileBlocks(content, client);
		return;
	}
	if ("blob" in resource && resource.blob != null) yield {
		type: "file",
		source_type: "base64",
		data: resource.blob,
		mime_type: resource.mimeType,
		...resource.uri != null ? { metadata: { uri: resource.uri } } : {}
	};
	if ("text" in resource && resource.text != null) yield {
		type: "file",
		source_type: "text",
		mime_type: resource.mimeType,
		text: resource.text,
		...resource.uri != null ? { metadata: { uri: resource.uri } } : {}
	};
}
async function _toolOutputToContentBlocks(content, useStandardContentBlocks, client, toolName, serverName) {
	const blocks = [];
	switch (content.type) {
		case "text": return [{
			type: "text",
			...useStandardContentBlocks ? { source_type: "text" } : {},
			text: content.text
		}];
		case "image":
			if (useStandardContentBlocks) return [{
				type: "image",
				source_type: "base64",
				data: content.data,
				mime_type: content.mimeType
			}];
			return [{
				type: "image_url",
				image_url: { url: `data:${content.mimeType};base64,${content.data}` }
			}];
		case "audio": return [{
			type: "audio",
			source_type: "base64",
			data: content.data,
			mime_type: content.mimeType
		}];
		case "resource":
			for await (const block of _embeddedResourceToStandardFileBlocks(content.resource, client)) blocks.push(block);
			return blocks;
		case "resource_link": return [{
			type: "file",
			source_type: "url",
			url: content.uri,
			mime_type: content.mimeType
		}];
		default: throw new ToolException(`MCP tool '${toolName}' on server '${serverName}' returned a content block with unexpected type "${content.type}." Expected one of ${callToolResultContentTypes.map((t) => `"${t}"`).join(", ")}.`);
	}
}
async function _embeddedResourceToArtifact(resource, useStandardContentBlocks, client, toolName, serverName) {
	if (useStandardContentBlocks) return _toolOutputToContentBlocks(resource, useStandardContentBlocks, client, toolName, serverName);
	if ((!("blob" in resource) || resource.blob == null) && (!("text" in resource) || resource.text == null) && "uri" in resource && typeof resource.uri === "string") return (await client.readResource({ uri: resource.uri })).contents.map((content) => ({
		type: "resource",
		resource: { ...content }
	}));
	return [resource];
}
function _getOutputTypeForContentType(contentType, outputHandling) {
	if (outputHandling === "content" || outputHandling === "artifact") return outputHandling;
	return _resolveDetailedOutputHandling(outputHandling)[contentType] ?? (contentType === "resource" ? "artifact" : "content");
}
/**
* Process the result from calling an MCP tool.
* Extracts text content and non-text content for better agent compatibility.
*
* @internal
*
* @param args - The arguments to pass to the tool
* @returns A tuple of [textContent, nonTextContent]
*/
async function _convertCallToolResult({ serverName, toolName, result, client, useStandardContentBlocks, outputHandling }) {
	if (!result) throw new ToolException(`MCP tool '${toolName}' on server '${serverName}' returned an invalid result - tool call response was undefined`);
	if (!Array.isArray(result.content)) throw new ToolException(`MCP tool '${toolName}' on server '${serverName}' returned an invalid result - expected an array of content, but was ${typeof result.content}`);
	if (result.isError) throw new ToolException(`MCP tool '${toolName}' on server '${serverName}' returned an error: ${result.content.map((content) => content.type === "text" ? content.text : "").join("\n")}`);
	const convertedContent = (await Promise.all(result.content.filter((content) => _getOutputTypeForContentType(content.type, outputHandling) === "content").map((content) => _toolOutputToContentBlocks(content, useStandardContentBlocks, client, toolName, serverName)))).flat();
	const artifacts = (await Promise.all(result.content.filter((content) => _getOutputTypeForContentType(content.type, outputHandling) === "artifact").map((content) => {
		return _embeddedResourceToArtifact(content, useStandardContentBlocks, client, toolName, serverName);
	}))).flat();
	const structuredContent = result.structuredContent;
	const meta = result._meta;
	const enhancedArtifacts = [...artifacts];
	if (structuredContent) enhancedArtifacts.push({
		type: "mcp_structured_content",
		data: structuredContent
	});
	if (meta) enhancedArtifacts.push({
		type: "mcp_meta",
		data: meta
	});
	if (convertedContent.length === 1 && convertedContent[0].type === "text") {
		const textBlock = convertedContent[0];
		const textContent = textBlock.text;
		if (structuredContent || meta) return [{
			...textBlock,
			...structuredContent ? { structuredContent } : {},
			...meta ? { meta } : {}
		}, enhancedArtifacts];
		return [textContent, enhancedArtifacts];
	}
	return [convertedContent, enhancedArtifacts];
}
/**
* Call an MCP tool.
*
* Use this with `.bind` to capture the fist three arguments, then pass to the constructor of DynamicStructuredTool.
*
* @internal
* @param args - The arguments to pass to the tool
* @returns A tuple of [textContent, nonTextContent]
*/
async function _callTool({ serverName, toolName, client, args, config, useStandardContentBlocks, outputHandling, onProgress, beforeToolCall, afterToolCall }) {
	try {
		debugLog$2(`INFO: Calling tool ${toolName}(${JSON.stringify(args)})`);
		const numericTimeout = config?.metadata?.timeoutMs ?? config?.timeout;
		const requestOptions = {
			...numericTimeout ? { timeout: numericTimeout } : {},
			...config?.signal ? { signal: config.signal } : {},
			...onProgress ? { onprogress: (progress) => {
				onProgress?.(progress, {
					type: "tool",
					name: toolName,
					args,
					server: serverName
				});
			} } : {}
		};
		let state = {};
		try {
			state = getCurrentTaskInput(config);
		} catch (error) {
			debugLog$2(`State can't be derrived as LangGraph is not used: ${String(error)}`);
		}
		const beforeToolCallInterception = await beforeToolCall?.({
			name: toolName,
			args,
			serverName
		}, state, config ?? {});
		const finalArgs = Object.assign(args, beforeToolCallInterception?.args || {});
		const headers = beforeToolCallInterception?.headers || {};
		const hasHeaderChanges = Object.entries(headers).length > 0;
		if (hasHeaderChanges && typeof client.fork !== "function") throw new ToolException(`MCP client for server "${serverName}" does not support header changes`);
		const finalClient = hasHeaderChanges && typeof client.fork === "function" ? await client.fork(headers) : client;
		const callToolArgs = [{
			name: toolName,
			arguments: finalArgs
		}];
		if (Object.keys(requestOptions).length > 0) {
			callToolArgs.push(void 0);
			callToolArgs.push(requestOptions);
		}
		const [content, artifacts] = await _convertCallToolResult({
			serverName,
			toolName,
			result: await finalClient.callTool(...callToolArgs),
			client: finalClient,
			useStandardContentBlocks,
			outputHandling
		});
		const normalizedContent = typeof content === "string" ? content : Array.isArray(content) ? content : [content];
		const normalizedArtifacts = artifacts.filter((artifact) => artifact.type === "resource" || artifact.type !== "mcp_structured_content" && artifact.type !== "mcp_meta" && typeof artifact === "object" && artifact !== null && "source_type" in artifact);
		const interceptedResult = await afterToolCall?.({
			name: toolName,
			args: finalArgs,
			result: [normalizedContent, normalizedArtifacts],
			serverName
		}, state, config ?? {});
		if (!interceptedResult) return [content, artifacts];
		if (typeof interceptedResult.result === "string") return [interceptedResult.result, []];
		if (Array.isArray(interceptedResult.result)) return interceptedResult.result;
		if (ToolMessage.isInstance(interceptedResult.result)) return [interceptedResult.result.contentBlocks, []];
		if (interceptedResult?.result instanceof Command) return interceptedResult.result;
		throw new Error(`Unexpected result value type from afterToolCall: expected either a Command, a ToolMessage or a tuple of ContentBlock and Artifact, but got ${interceptedResult.result}`);
	} catch (error) {
		if (error instanceof ZodError || error instanceof ZodError$1) throw new ToolException(prettifyError(error), error);
		debugLog$2(`Error calling tool ${toolName}: ${String(error)}`);
		if (isToolException(error)) throw error;
		throw new ToolException(`Error calling tool ${toolName}: ${String(error)}`);
	}
}
var defaultLoadMcpToolsOptions = {
	throwOnLoadError: true,
	prefixToolNameWithServerName: false,
	additionalToolNamePrefix: "",
	useStandardContentBlocks: false
};
/**
* Load all tools from an MCP client.
*
* @param serverName - The name of the server to load tools from
* @param client - The MCP client
* @returns A list of LangChain tools
*/
async function loadMcpTools(serverName, client, options) {
	const { throwOnLoadError, prefixToolNameWithServerName, additionalToolNamePrefix, useStandardContentBlocks, outputHandling, defaultToolTimeout } = {
		...defaultLoadMcpToolsOptions,
		...options ?? {}
	};
	const mcpTools = [];
	let toolsResponse;
	do {
		toolsResponse = await client.listTools({ ...toolsResponse?.nextCursor ? { cursor: toolsResponse.nextCursor } : {} });
		mcpTools.push(...toolsResponse.tools || []);
	} while (toolsResponse.nextCursor);
	debugLog$2(`INFO: Found ${mcpTools.length} MCP tools`);
	const toolNamePrefix = `${additionalToolNamePrefix ? `${additionalToolNamePrefix}__` : ""}${prefixToolNameWithServerName ? `${serverName}__` : ""}`;
	return (await Promise.all(mcpTools.filter((tool) => !!tool.name).map(async (tool) => {
		try {
			if (!tool.inputSchema.properties) tool.inputSchema.properties = {};
			const simplifiedSchema = simplifyJsonSchemaForLLM(dereferenceJsonSchema(tool.inputSchema));
			const dst = new DynamicStructuredTool({
				name: `${toolNamePrefix}${tool.name}`,
				description: tool.description || "",
				schema: simplifiedSchema,
				responseFormat: "content_and_artifact",
				metadata: { annotations: tool.annotations },
				defaultConfig: defaultToolTimeout ? { timeout: defaultToolTimeout } : void 0,
				func: async (args, _runManager, config) => {
					return _callTool({
						serverName,
						toolName: tool.name,
						client,
						args,
						config,
						useStandardContentBlocks,
						outputHandling,
						onProgress: options?.onProgress,
						beforeToolCall: options?.beforeToolCall,
						afterToolCall: options?.afterToolCall
					});
				}
			});
			debugLog$2(`INFO: Successfully loaded tool: ${dst.name}`);
			return dst;
		} catch (error) {
			debugLog$2(`ERROR: Failed to load tool "${tool.name}":`, error);
			if (throwOnLoadError) throw error;
			return null;
		}
	}))).filter(Boolean);
}
//#endregion
//#region node_modules/@langchain/mcp-adapters/dist/package.js
var package_default = {
	name: "@langchain/mcp-adapters",
	version: "1.1.3",
	description: "LangChain.js adapters for Model Context Protocol (MCP)",
	author: "LangChain",
	license: "MIT",
	type: "module",
	packageManager: "pnpm@10.14.0",
	repository: {
		"type": "git",
		"url": "git@github.com:langchain-ai/langchainjs.git"
	},
	homepage: "https://github.com/langchain-ai/langchainjs/tree/main/libs/langchain-mcp-adapters/",
	bugs: { "url": "https://github.com/langchain-ai/langchainjs/issues" },
	scripts: {
		"build": "turbo build:compile build:examples --filter @langchain/core --output-logs new-only",
		"build:compile": "tsdown",
		"build:examples": "tsc -p ./examples/tsconfig.json",
		"clean": "rm -rf dist/ dist-cjs/ .turbo/",
		"format": "prettier --write \"src/**/*.ts\" \"examples/**/*.ts\"",
		"format:check": "prettier --check \"src\" \"examples/**/*.ts\"",
		"lint": "run-s lint:eslint lint:dpdm",
		"lint:dpdm": "dpdm --skip-dynamic-imports circular --exit-code circular:1 --no-warning --no-tree src/**/*.ts examples/**/*.ts",
		"lint:eslint": "eslint --cache src/ examples/",
		"lint:fix": "pnpm lint:eslint --fix && pnpm lint:dpdm",
		"test": "vitest run",
		"test:coverage": "vitest run --coverage",
		"test:watch": "vitest"
	},
	keywords: [
		"langchain",
		"mcp",
		"model-context-protocol",
		"ai",
		"tools"
	],
	dependencies: {
		"@modelcontextprotocol/sdk": "^1.26.0",
		"debug": "^4.4.3",
		"zod": "^3.25.76 || ^4"
	},
	peerDependencies: {
		"@langchain/core": "^1.0.0",
		"@langchain/langgraph": "^1.0.0"
	},
	peerDependenciesMeta: {
		"@langchain/core": { "optional": false },
		"@langchain/langgraph": { "optional": false }
	},
	optionalDependencies: { "extended-eventsource": "^1.7.0" },
	devDependencies: {
		"@eslint/js": "^9.36.0",
		"@langchain/core": "workspace:^",
		"@langchain/eslint": "workspace:*",
		"@langchain/langgraph": "^1.0.0",
		"@langchain/openai": "workspace:*",
		"@langchain/tsconfig": "workspace:*",
		"@tsconfig/recommended": "^1.0.10",
		"@types/debug": "^4.1.12",
		"@types/express": "^5.0.6",
		"@types/node": "^22.18.8",
		"@vitest/coverage-v8": "^3.2.4",
		"dotenv": "^16.6.1",
		"dpdm": "^3.14.0",
		"eslint": "^9.36.0",
		"eventsource": "^4.1.0",
		"express": "^5.2.1",
		"langchain": "workspace:*",
		"npm-run-all2": "^8.0.4",
		"prettier": "^3.6.2",
		"ts-node": "^10.9.2",
		"typescript": "~5.8.3",
		"typescript-eslint": "^8.45.0",
		"vitest": "^3.2.4"
	},
	engines: { "node": ">=20.10.0" },
	directories: { "example": "examples" },
	main: "./dist/index.cjs",
	types: "./dist/index.d.cts",
	exports: {
		".": {
			"input": "./src/index.ts",
			"require": {
				"types": "./dist/index.d.cts",
				"default": "./dist/index.cjs"
			},
			"import": {
				"types": "./dist/index.d.ts",
				"default": "./dist/index.js"
			}
		},
		"./package.json": "./package.json"
	},
	files: [
		"dist/",
		"CHANGELOG.md",
		"README.md",
		"LICENSE"
	],
	module: "./dist/index.js"
};
//#endregion
//#region node_modules/eventsource-parser/dist/index.js
var ParseError = class extends Error {
	constructor(message, options) {
		super(message), this.name = "ParseError", this.type = options.type, this.field = options.field, this.value = options.value, this.line = options.line;
	}
};
var LF = 10;
var CR = 13;
var SPACE = 32;
function noop(_arg) {}
function createParser(config) {
	if (typeof config == "function") throw new TypeError("`config` must be an object, got a function instead. Did you mean `createParser({onEvent: fn})`?");
	const { onEvent = noop, onError = noop, onRetry = noop, onComment, maxBufferSize } = config, pendingFragments = [];
	let pendingFragmentsLength = 0, isFirstChunk = !0, id, data = "", dataLines = 0, eventType, terminated = !1;
	function feed(chunk) {
		if (terminated) throw new Error("Cannot feed parser: it was terminated after exceeding the configured max buffer size. Call `reset()` to resume parsing.");
		if (isFirstChunk && (isFirstChunk = !1, chunk.charCodeAt(0) === 239 && chunk.charCodeAt(1) === 187 && chunk.charCodeAt(2) === 191 && (chunk = chunk.slice(3))), pendingFragments.length === 0) {
			const trailing2 = processLines(chunk);
			trailing2 !== "" && (pendingFragments.push(trailing2), pendingFragmentsLength = trailing2.length), checkBufferSize();
			return;
		}
		if (chunk.indexOf(`
`) === -1 && chunk.indexOf("\r") === -1) {
			pendingFragments.push(chunk), pendingFragmentsLength += chunk.length, checkBufferSize();
			return;
		}
		pendingFragments.push(chunk);
		const input = pendingFragments.join("");
		pendingFragments.length = 0, pendingFragmentsLength = 0;
		const trailing = processLines(input);
		trailing !== "" && (pendingFragments.push(trailing), pendingFragmentsLength = trailing.length), checkBufferSize();
	}
	function checkBufferSize() {
		maxBufferSize !== void 0 && (pendingFragmentsLength + data.length <= maxBufferSize || (terminated = !0, pendingFragments.length = 0, pendingFragmentsLength = 0, id = void 0, data = "", dataLines = 0, eventType = void 0, onError(new ParseError(`Buffered data exceeded max buffer size of ${maxBufferSize} characters`, { type: "max-buffer-size-exceeded" }))));
	}
	function processLines(chunk) {
		let searchIndex = 0;
		if (chunk.indexOf("\r") === -1) {
			let lfIndex = chunk.indexOf(`
`, searchIndex);
			for (; lfIndex !== -1;) {
				if (searchIndex === lfIndex) {
					dataLines > 0 && onEvent({
						id,
						event: eventType,
						data
					}), id = void 0, data = "", dataLines = 0, eventType = void 0, searchIndex = lfIndex + 1, lfIndex = chunk.indexOf(`
`, searchIndex);
					continue;
				}
				const firstCharCode = chunk.charCodeAt(searchIndex);
				if (isDataPrefix(chunk, searchIndex, firstCharCode)) {
					const valueStart = chunk.charCodeAt(searchIndex + 5) === SPACE ? searchIndex + 6 : searchIndex + 5, value = chunk.slice(valueStart, lfIndex);
					if (dataLines === 0 && chunk.charCodeAt(lfIndex + 1) === LF) {
						onEvent({
							id,
							event: eventType,
							data: value
						}), id = void 0, data = "", eventType = void 0, searchIndex = lfIndex + 2, lfIndex = chunk.indexOf(`
`, searchIndex);
						continue;
					}
					data = dataLines === 0 ? value : `${data}
${value}`, dataLines++;
				} else isEventPrefix(chunk, searchIndex, firstCharCode) ? eventType = chunk.slice(chunk.charCodeAt(searchIndex + 6) === SPACE ? searchIndex + 7 : searchIndex + 6, lfIndex) || void 0 : parseLine(chunk, searchIndex, lfIndex);
				searchIndex = lfIndex + 1, lfIndex = chunk.indexOf(`
`, searchIndex);
			}
			return chunk.slice(searchIndex);
		}
		for (; searchIndex < chunk.length;) {
			const crIndex = chunk.indexOf("\r", searchIndex), lfIndex = chunk.indexOf(`
`, searchIndex);
			let lineEnd = -1;
			if (crIndex !== -1 && lfIndex !== -1 ? lineEnd = crIndex < lfIndex ? crIndex : lfIndex : crIndex !== -1 ? crIndex === chunk.length - 1 ? lineEnd = -1 : lineEnd = crIndex : lfIndex !== -1 && (lineEnd = lfIndex), lineEnd === -1) break;
			parseLine(chunk, searchIndex, lineEnd), searchIndex = lineEnd + 1, chunk.charCodeAt(searchIndex - 1) === CR && chunk.charCodeAt(searchIndex) === LF && searchIndex++;
		}
		return chunk.slice(searchIndex);
	}
	function parseLine(chunk, start, end) {
		if (start === end) {
			dispatchEvent();
			return;
		}
		const firstCharCode = chunk.charCodeAt(start);
		if (isDataPrefix(chunk, start, firstCharCode)) {
			const valueStart = chunk.charCodeAt(start + 5) === SPACE ? start + 6 : start + 5, value2 = chunk.slice(valueStart, end);
			data = dataLines === 0 ? value2 : `${data}
${value2}`, dataLines++;
			return;
		}
		if (isEventPrefix(chunk, start, firstCharCode)) {
			eventType = chunk.slice(chunk.charCodeAt(start + 6) === SPACE ? start + 7 : start + 6, end) || void 0;
			return;
		}
		if (firstCharCode === 105 && chunk.charCodeAt(start + 1) === 100 && chunk.charCodeAt(start + 2) === 58) {
			const value2 = chunk.slice(chunk.charCodeAt(start + 3) === SPACE ? start + 4 : start + 3, end);
			id = value2.includes("\0") ? void 0 : value2;
			return;
		}
		if (firstCharCode === 58) {
			if (onComment) {
				const line2 = chunk.slice(start, end);
				onComment(line2.slice(chunk.charCodeAt(start + 1) === SPACE ? 2 : 1));
			}
			return;
		}
		const line = chunk.slice(start, end), fieldSeparatorIndex = line.indexOf(":");
		if (fieldSeparatorIndex === -1) {
			processField(line, "", line);
			return;
		}
		const field = line.slice(0, fieldSeparatorIndex), offset = line.charCodeAt(fieldSeparatorIndex + 1) === SPACE ? 2 : 1;
		processField(field, line.slice(fieldSeparatorIndex + offset), line);
	}
	function processField(field, value, line) {
		switch (field) {
			case "event":
				eventType = value || void 0;
				break;
			case "data":
				data = dataLines === 0 ? value : `${data}
${value}`, dataLines++;
				break;
			case "id":
				id = value.includes("\0") ? void 0 : value;
				break;
			case "retry":
				/^\d+$/.test(value) ? onRetry(parseInt(value, 10)) : onError(new ParseError(`Invalid \`retry\` value: "${value}"`, {
					type: "invalid-retry",
					value,
					line
				}));
				break;
			default:
				onError(new ParseError(`Unknown field "${field.length > 20 ? `${field.slice(0, 20)}\u2026` : field}"`, {
					type: "unknown-field",
					field,
					value,
					line
				}));
				break;
		}
	}
	function dispatchEvent() {
		dataLines > 0 && onEvent({
			id,
			event: eventType,
			data
		}), id = void 0, data = "", dataLines = 0, eventType = void 0;
	}
	function reset(options = {}) {
		if (options.consume && pendingFragments.length > 0) {
			const incompleteLine = pendingFragments.join("");
			parseLine(incompleteLine, 0, incompleteLine.length);
		}
		isFirstChunk = !0, id = void 0, data = "", dataLines = 0, eventType = void 0, pendingFragments.length = 0, pendingFragmentsLength = 0, terminated = !1;
	}
	return {
		feed,
		reset
	};
}
function isDataPrefix(chunk, i, firstCharCode) {
	return firstCharCode === 100 && chunk.charCodeAt(i + 1) === 97 && chunk.charCodeAt(i + 2) === 116 && chunk.charCodeAt(i + 3) === 97 && chunk.charCodeAt(i + 4) === 58;
}
function isEventPrefix(chunk, i, firstCharCode) {
	return firstCharCode === 101 && chunk.charCodeAt(i + 1) === 118 && chunk.charCodeAt(i + 2) === 101 && chunk.charCodeAt(i + 3) === 110 && chunk.charCodeAt(i + 4) === 116 && chunk.charCodeAt(i + 5) === 58;
}
//#endregion
//#region node_modules/eventsource/dist/index.js
var ErrorEvent = class extends Event {
	/**
	* Constructs a new `ErrorEvent` instance. This is typically not called directly,
	* but rather emitted by the `EventSource` object when an error occurs.
	*
	* @param type - The type of the event (should be "error")
	* @param errorEventInitDict - Optional properties to include in the error event
	*/
	constructor(type, errorEventInitDict) {
		var _a, _b;
		super(type), this.code = (_a = errorEventInitDict == null ? void 0 : errorEventInitDict.code) != null ? _a : void 0, this.message = (_b = errorEventInitDict == null ? void 0 : errorEventInitDict.message) != null ? _b : void 0;
	}
	/**
	* Node.js "hides" the `message` and `code` properties of the `ErrorEvent` instance,
	* when it is `console.log`'ed. This makes it harder to debug errors. To ease debugging,
	* we explicitly include the properties in the `inspect` method.
	*
	* This is automatically called by Node.js when you `console.log` an instance of this class.
	*
	* @param _depth - The current depth
	* @param options - The options passed to `util.inspect`
	* @param inspect - The inspect function to use (prevents having to import it from `util`)
	* @returns A string representation of the error
	*/
	[Symbol.for("nodejs.util.inspect.custom")](_depth, options, inspect) {
		return inspect(inspectableError(this), options);
	}
	/**
	* Deno "hides" the `message` and `code` properties of the `ErrorEvent` instance,
	* when it is `console.log`'ed. This makes it harder to debug errors. To ease debugging,
	* we explicitly include the properties in the `inspect` method.
	*
	* This is automatically called by Deno when you `console.log` an instance of this class.
	*
	* @param inspect - The inspect function to use (prevents having to import it from `util`)
	* @param options - The options passed to `Deno.inspect`
	* @returns A string representation of the error
	*/
	[Symbol.for("Deno.customInspect")](inspect, options) {
		return inspect(inspectableError(this), options);
	}
};
function syntaxError(message) {
	const DomException = globalThis.DOMException;
	return typeof DomException == "function" ? new DomException(message, "SyntaxError") : new SyntaxError(message);
}
function flattenError(err) {
	return err instanceof Error ? "errors" in err && Array.isArray(err.errors) ? err.errors.map(flattenError).join(", ") : "cause" in err && err.cause instanceof Error ? `${err}: ${flattenError(err.cause)}` : err.message : `${err}`;
}
function inspectableError(err) {
	return {
		type: err.type,
		message: err.message,
		code: err.code,
		defaultPrevented: err.defaultPrevented,
		cancelable: err.cancelable,
		timeStamp: err.timeStamp
	};
}
var __typeError = (msg) => {
	throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var _readyState;
var _url;
var _redirectUrl;
var _withCredentials;
var _fetch;
var _reconnectInterval;
var _reconnectTimer;
var _lastEventId;
var _controller;
var _parser;
var _onError;
var _onMessage;
var _onOpen;
var _EventSource_instances;
var connect_fn;
var _onFetchResponse;
var _onFetchError;
var getRequestOptions_fn;
var _onEvent;
var _onRetryChange;
var failConnection_fn;
var scheduleReconnect_fn;
var _reconnect;
var EventSource = class extends EventTarget {
	constructor(url, eventSourceInitDict) {
		var _a, _b;
		super(), __privateAdd(this, _EventSource_instances), this.CONNECTING = 0, this.OPEN = 1, this.CLOSED = 2, __privateAdd(this, _readyState), __privateAdd(this, _url), __privateAdd(this, _redirectUrl), __privateAdd(this, _withCredentials), __privateAdd(this, _fetch), __privateAdd(this, _reconnectInterval), __privateAdd(this, _reconnectTimer), __privateAdd(this, _lastEventId, null), __privateAdd(this, _controller), __privateAdd(this, _parser), __privateAdd(this, _onError, null), __privateAdd(this, _onMessage, null), __privateAdd(this, _onOpen, null), __privateAdd(this, _onFetchResponse, async (response) => {
			var _a2;
			__privateGet(this, _parser).reset();
			const { body, redirected, status, headers } = response;
			if (status === 204) {
				__privateMethod(this, _EventSource_instances, failConnection_fn).call(this, "Server sent HTTP 204, not reconnecting", 204), this.close();
				return;
			}
			if (redirected ? __privateSet(this, _redirectUrl, new URL(response.url)) : __privateSet(this, _redirectUrl, void 0), status !== 200) {
				__privateMethod(this, _EventSource_instances, failConnection_fn).call(this, `Non-200 status code (${status})`, status);
				return;
			}
			if (!(headers.get("content-type") || "").startsWith("text/event-stream")) {
				__privateMethod(this, _EventSource_instances, failConnection_fn).call(this, "Invalid content type, expected \"text/event-stream\"", status);
				return;
			}
			if (__privateGet(this, _readyState) === this.CLOSED) return;
			__privateSet(this, _readyState, this.OPEN);
			const openEvent = new Event("open");
			if ((_a2 = __privateGet(this, _onOpen)) == null || _a2.call(this, openEvent), this.dispatchEvent(openEvent), typeof body != "object" || !body || !("getReader" in body)) {
				__privateMethod(this, _EventSource_instances, failConnection_fn).call(this, "Invalid response body, expected a web ReadableStream", status), this.close();
				return;
			}
			const decoder = new TextDecoder(), reader = body.getReader();
			let open = !0;
			do {
				const { done, value } = await reader.read();
				value && __privateGet(this, _parser).feed(decoder.decode(value, { stream: !done })), done && (open = !1, __privateGet(this, _parser).reset(), __privateMethod(this, _EventSource_instances, scheduleReconnect_fn).call(this));
			} while (open);
		}), __privateAdd(this, _onFetchError, (err) => {
			__privateSet(this, _controller, void 0), !(err.name === "AbortError" || err.type === "aborted") && __privateMethod(this, _EventSource_instances, scheduleReconnect_fn).call(this, flattenError(err));
		}), __privateAdd(this, _onEvent, (event) => {
			typeof event.id == "string" && __privateSet(this, _lastEventId, event.id);
			const messageEvent = new MessageEvent(event.event || "message", {
				data: event.data,
				origin: __privateGet(this, _redirectUrl) ? __privateGet(this, _redirectUrl).origin : __privateGet(this, _url).origin,
				lastEventId: event.id || ""
			});
			__privateGet(this, _onMessage) && (!event.event || event.event === "message") && __privateGet(this, _onMessage).call(this, messageEvent), this.dispatchEvent(messageEvent);
		}), __privateAdd(this, _onRetryChange, (value) => {
			__privateSet(this, _reconnectInterval, value);
		}), __privateAdd(this, _reconnect, () => {
			__privateSet(this, _reconnectTimer, void 0), __privateGet(this, _readyState) === this.CONNECTING && __privateMethod(this, _EventSource_instances, connect_fn).call(this);
		});
		try {
			if (url instanceof URL) __privateSet(this, _url, url);
			else if (typeof url == "string") __privateSet(this, _url, new URL(url, getBaseURL()));
			else throw new Error("Invalid URL");
		} catch {
			throw syntaxError("An invalid or illegal string was specified");
		}
		__privateSet(this, _parser, createParser({
			onEvent: __privateGet(this, _onEvent),
			onRetry: __privateGet(this, _onRetryChange)
		})), __privateSet(this, _readyState, this.CONNECTING), __privateSet(this, _reconnectInterval, 3e3), __privateSet(this, _fetch, (_a = eventSourceInitDict == null ? void 0 : eventSourceInitDict.fetch) != null ? _a : globalThis.fetch), __privateSet(this, _withCredentials, (_b = eventSourceInitDict == null ? void 0 : eventSourceInitDict.withCredentials) != null ? _b : !1), __privateMethod(this, _EventSource_instances, connect_fn).call(this);
	}
	/**
	* Returns the state of this EventSource object's connection. It can have the values described below.
	*
	* [MDN Reference](https://developer.mozilla.org/docs/Web/API/EventSource/readyState)
	*
	* Note: typed as `number` instead of `0 | 1 | 2` for compatibility with the `EventSource` interface,
	* defined in the TypeScript `dom` library.
	*
	* @public
	*/
	get readyState() {
		return __privateGet(this, _readyState);
	}
	/**
	* Returns the URL providing the event stream.
	*
	* [MDN Reference](https://developer.mozilla.org/docs/Web/API/EventSource/url)
	*
	* @public
	*/
	get url() {
		return __privateGet(this, _url).href;
	}
	/**
	* Returns true if the credentials mode for connection requests to the URL providing the event stream is set to "include", and false otherwise.
	*
	* [MDN Reference](https://developer.mozilla.org/docs/Web/API/EventSource/withCredentials)
	*/
	get withCredentials() {
		return __privateGet(this, _withCredentials);
	}
	/** [MDN Reference](https://developer.mozilla.org/docs/Web/API/EventSource/error_event) */
	get onerror() {
		return __privateGet(this, _onError);
	}
	set onerror(value) {
		__privateSet(this, _onError, value);
	}
	/** [MDN Reference](https://developer.mozilla.org/docs/Web/API/EventSource/message_event) */
	get onmessage() {
		return __privateGet(this, _onMessage);
	}
	set onmessage(value) {
		__privateSet(this, _onMessage, value);
	}
	/** [MDN Reference](https://developer.mozilla.org/docs/Web/API/EventSource/open_event) */
	get onopen() {
		return __privateGet(this, _onOpen);
	}
	set onopen(value) {
		__privateSet(this, _onOpen, value);
	}
	addEventListener(type, listener, options) {
		const listen = listener;
		super.addEventListener(type, listen, options);
	}
	removeEventListener(type, listener, options) {
		const listen = listener;
		super.removeEventListener(type, listen, options);
	}
	/**
	* Aborts any instances of the fetch algorithm started for this EventSource object, and sets the readyState attribute to CLOSED.
	*
	* [MDN Reference](https://developer.mozilla.org/docs/Web/API/EventSource/close)
	*
	* @public
	*/
	close() {
		__privateGet(this, _reconnectTimer) && clearTimeout(__privateGet(this, _reconnectTimer)), __privateGet(this, _readyState) !== this.CLOSED && (__privateGet(this, _controller) && __privateGet(this, _controller).abort(), __privateSet(this, _readyState, this.CLOSED), __privateSet(this, _controller, void 0));
	}
};
_readyState = /* @__PURE__ */ new WeakMap(), _url = /* @__PURE__ */ new WeakMap(), _redirectUrl = /* @__PURE__ */ new WeakMap(), _withCredentials = /* @__PURE__ */ new WeakMap(), _fetch = /* @__PURE__ */ new WeakMap(), _reconnectInterval = /* @__PURE__ */ new WeakMap(), _reconnectTimer = /* @__PURE__ */ new WeakMap(), _lastEventId = /* @__PURE__ */ new WeakMap(), _controller = /* @__PURE__ */ new WeakMap(), _parser = /* @__PURE__ */ new WeakMap(), _onError = /* @__PURE__ */ new WeakMap(), _onMessage = /* @__PURE__ */ new WeakMap(), _onOpen = /* @__PURE__ */ new WeakMap(), _EventSource_instances = /* @__PURE__ */ new WeakSet(), connect_fn = function() {
	__privateSet(this, _readyState, this.CONNECTING), __privateSet(this, _controller, new AbortController()), __privateGet(this, _fetch)(__privateGet(this, _url), __privateMethod(this, _EventSource_instances, getRequestOptions_fn).call(this)).then(__privateGet(this, _onFetchResponse)).catch(__privateGet(this, _onFetchError));
}, _onFetchResponse = /* @__PURE__ */ new WeakMap(), _onFetchError = /* @__PURE__ */ new WeakMap(), getRequestOptions_fn = function() {
	var _a;
	const init = {
		mode: "cors",
		redirect: "follow",
		headers: {
			Accept: "text/event-stream",
			...__privateGet(this, _lastEventId) ? { "Last-Event-ID": __privateGet(this, _lastEventId) } : void 0
		},
		cache: "no-store",
		signal: (_a = __privateGet(this, _controller)) == null ? void 0 : _a.signal
	};
	return "window" in globalThis && (init.credentials = this.withCredentials ? "include" : "same-origin"), init;
}, _onEvent = /* @__PURE__ */ new WeakMap(), _onRetryChange = /* @__PURE__ */ new WeakMap(), failConnection_fn = function(message, code) {
	var _a;
	__privateGet(this, _readyState) !== this.CLOSED && __privateSet(this, _readyState, this.CLOSED);
	const errorEvent = new ErrorEvent("error", {
		code,
		message
	});
	(_a = __privateGet(this, _onError)) == null || _a.call(this, errorEvent), this.dispatchEvent(errorEvent);
}, scheduleReconnect_fn = function(message, code) {
	var _a;
	if (__privateGet(this, _readyState) === this.CLOSED) return;
	__privateSet(this, _readyState, this.CONNECTING);
	const errorEvent = new ErrorEvent("error", {
		code,
		message
	});
	(_a = __privateGet(this, _onError)) == null || _a.call(this, errorEvent), this.dispatchEvent(errorEvent), __privateSet(this, _reconnectTimer, setTimeout(__privateGet(this, _reconnect), __privateGet(this, _reconnectInterval)));
}, _reconnect = /* @__PURE__ */ new WeakMap(), EventSource.CONNECTING = 0, EventSource.OPEN = 1, EventSource.CLOSED = 2;
function getBaseURL() {
	const doc = "document" in globalThis ? globalThis.document : void 0;
	return doc && typeof doc == "object" && "baseURI" in doc && typeof doc.baseURI == "string" ? doc.baseURI : void 0;
}
//#endregion
//#region node_modules/@modelcontextprotocol/sdk/dist/esm/shared/transport.js
/**
* Normalizes HeadersInit to a plain Record<string, string> for manipulation.
* Handles Headers objects, arrays of tuples, and plain objects.
*/
function normalizeHeaders(headers) {
	if (!headers) return {};
	if (headers instanceof Headers) return Object.fromEntries(headers.entries());
	if (Array.isArray(headers)) return Object.fromEntries(headers);
	return { ...headers };
}
/**
* Creates a fetch function that includes base RequestInit options.
* This ensures requests inherit settings like credentials, mode, headers, etc. from the base init.
*
* @param baseFetch - The base fetch function to wrap (defaults to global fetch)
* @param baseInit - The base RequestInit to merge with each request
* @returns A wrapped fetch function that merges base options with call-specific options
*/
function createFetchWithInit(baseFetch = fetch, baseInit) {
	if (!baseInit) return baseFetch;
	return async (url, init) => {
		return baseFetch(url, {
			...baseInit,
			...init,
			headers: init?.headers ? {
				...normalizeHeaders(baseInit.headers),
				...normalizeHeaders(init.headers)
			} : baseInit.headers
		});
	};
}
//#endregion
//#region node_modules/@modelcontextprotocol/sdk/dist/esm/types.js
var LATEST_PROTOCOL_VERSION = "2025-11-25";
var SUPPORTED_PROTOCOL_VERSIONS = [
	LATEST_PROTOCOL_VERSION,
	"2025-06-18",
	"2025-03-26",
	"2024-11-05",
	"2024-10-07"
];
var RELATED_TASK_META_KEY = "io.modelcontextprotocol/related-task";
/**
* Assert 'object' type schema.
*
* @internal
*/
var AssertObjectSchema = custom((v) => v !== null && (typeof v === "object" || typeof v === "function"));
/**
* A progress token, used to associate progress notifications with the original request.
*/
var ProgressTokenSchema = union([string$1(), number$1().int()]);
/**
* An opaque token used to represent a cursor for pagination.
*/
var CursorSchema = string$1();
looseObject({
	/**
	* Requested duration in milliseconds to retain task from creation.
	*/
	ttl: number$1().optional(),
	/**
	* Time in milliseconds to wait between task status requests.
	*/
	pollInterval: number$1().optional()
});
var TaskMetadataSchema = object({ ttl: number$1().optional() });
/**
* Metadata for associating messages with a task.
* Include this in the `_meta` field under the key `io.modelcontextprotocol/related-task`.
*/
var RelatedTaskMetadataSchema = object({ taskId: string$1() });
var RequestMetaSchema = looseObject({
	/**
	* If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
	*/
	progressToken: ProgressTokenSchema.optional(),
	/**
	* If specified, this request is related to the provided task.
	*/
	[RELATED_TASK_META_KEY]: RelatedTaskMetadataSchema.optional()
});
/**
* Common params for any request.
*/
var BaseRequestParamsSchema = object({ 
/**
* See [General fields: `_meta`](/specification/draft/basic/index#meta) for notes on `_meta` usage.
*/
_meta: RequestMetaSchema.optional() });
/**
* Common params for any task-augmented request.
*/
var TaskAugmentedRequestParamsSchema = BaseRequestParamsSchema.extend({ 
/**
* If specified, the caller is requesting task-augmented execution for this request.
* The request will return a CreateTaskResult immediately, and the actual result can be
* retrieved later via tasks/result.
*
* Task augmentation is subject to capability negotiation - receivers MUST declare support
* for task augmentation of specific request types in their capabilities.
*/
task: TaskMetadataSchema.optional() });
/**
* Checks if a value is a valid TaskAugmentedRequestParams.
* @param value - The value to check.
*
* @returns True if the value is a valid TaskAugmentedRequestParams, false otherwise.
*/
var isTaskAugmentedRequestParams = (value) => TaskAugmentedRequestParamsSchema.safeParse(value).success;
var RequestSchema = object({
	method: string$1(),
	params: BaseRequestParamsSchema.loose().optional()
});
var NotificationsParamsSchema = object({ 
/**
* See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
* for notes on _meta usage.
*/
_meta: RequestMetaSchema.optional() });
var NotificationSchema = object({
	method: string$1(),
	params: NotificationsParamsSchema.loose().optional()
});
var ResultSchema = looseObject({ 
/**
* See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
* for notes on _meta usage.
*/
_meta: RequestMetaSchema.optional() });
/**
* A uniquely identifying ID for a request in JSON-RPC.
*/
var RequestIdSchema = union([string$1(), number$1().int()]);
/**
* A request that expects a response.
*/
var JSONRPCRequestSchema = object({
	jsonrpc: literal("2.0"),
	id: RequestIdSchema,
	...RequestSchema.shape
}).strict();
var isJSONRPCRequest = (value) => JSONRPCRequestSchema.safeParse(value).success;
/**
* A notification which does not expect a response.
*/
var JSONRPCNotificationSchema = object({
	jsonrpc: literal("2.0"),
	...NotificationSchema.shape
}).strict();
var isJSONRPCNotification = (value) => JSONRPCNotificationSchema.safeParse(value).success;
/**
* A successful (non-error) response to a request.
*/
var JSONRPCResultResponseSchema = object({
	jsonrpc: literal("2.0"),
	id: RequestIdSchema,
	result: ResultSchema
}).strict();
/**
* Checks if a value is a valid JSONRPCResultResponse.
* @param value - The value to check.
*
* @returns True if the value is a valid JSONRPCResultResponse, false otherwise.
*/
var isJSONRPCResultResponse = (value) => JSONRPCResultResponseSchema.safeParse(value).success;
/**
* Error codes defined by the JSON-RPC specification.
*/
var ErrorCode;
(function(ErrorCode) {
	ErrorCode[ErrorCode["ConnectionClosed"] = -32e3] = "ConnectionClosed";
	ErrorCode[ErrorCode["RequestTimeout"] = -32001] = "RequestTimeout";
	ErrorCode[ErrorCode["ParseError"] = -32700] = "ParseError";
	ErrorCode[ErrorCode["InvalidRequest"] = -32600] = "InvalidRequest";
	ErrorCode[ErrorCode["MethodNotFound"] = -32601] = "MethodNotFound";
	ErrorCode[ErrorCode["InvalidParams"] = -32602] = "InvalidParams";
	ErrorCode[ErrorCode["InternalError"] = -32603] = "InternalError";
	ErrorCode[ErrorCode["UrlElicitationRequired"] = -32042] = "UrlElicitationRequired";
})(ErrorCode || (ErrorCode = {}));
/**
* A response to a request that indicates an error occurred.
*/
var JSONRPCErrorResponseSchema = object({
	jsonrpc: literal("2.0"),
	id: RequestIdSchema.optional(),
	error: object({
		/**
		* The error type that occurred.
		*/
		code: number$1().int(),
		/**
		* A short description of the error. The message SHOULD be limited to a concise single sentence.
		*/
		message: string$1(),
		/**
		* Additional information about the error. The value of this member is defined by the sender (e.g. detailed error information, nested errors etc.).
		*/
		data: unknown().optional()
	})
}).strict();
/**
* Checks if a value is a valid JSONRPCErrorResponse.
* @param value - The value to check.
*
* @returns True if the value is a valid JSONRPCErrorResponse, false otherwise.
*/
var isJSONRPCErrorResponse = (value) => JSONRPCErrorResponseSchema.safeParse(value).success;
var JSONRPCMessageSchema = union([
	JSONRPCRequestSchema,
	JSONRPCNotificationSchema,
	JSONRPCResultResponseSchema,
	JSONRPCErrorResponseSchema
]);
union([JSONRPCResultResponseSchema, JSONRPCErrorResponseSchema]);
/**
* A response that indicates success but carries no data.
*/
var EmptyResultSchema = ResultSchema.strict();
var CancelledNotificationParamsSchema = NotificationsParamsSchema.extend({
	/**
	* The ID of the request to cancel.
	*
	* This MUST correspond to the ID of a request previously issued in the same direction.
	*/
	requestId: RequestIdSchema.optional(),
	/**
	* An optional string describing the reason for the cancellation. This MAY be logged or presented to the user.
	*/
	reason: string$1().optional()
});
/**
* This notification can be sent by either side to indicate that it is cancelling a previously-issued request.
*
* The request SHOULD still be in-flight, but due to communication latency, it is always possible that this notification MAY arrive after the request has already finished.
*
* This notification indicates that the result will be unused, so any associated processing SHOULD cease.
*
* A client MUST NOT attempt to cancel its `initialize` request.
*/
var CancelledNotificationSchema = NotificationSchema.extend({
	method: literal("notifications/cancelled"),
	params: CancelledNotificationParamsSchema
});
/**
* Base schema to add `icons` property.
*
*/
var IconsSchema = object({ 
/**
* Optional set of sized icons that the client can display in a user interface.
*
* Clients that support rendering icons MUST support at least the following MIME types:
* - `image/png` - PNG images (safe, universal compatibility)
* - `image/jpeg` (and `image/jpg`) - JPEG images (safe, universal compatibility)
*
* Clients that support rendering icons SHOULD also support:
* - `image/svg+xml` - SVG images (scalable but requires security precautions)
* - `image/webp` - WebP images (modern, efficient format)
*/
icons: array(object({
	/**
	* URL or data URI for the icon.
	*/
	src: string$1(),
	/**
	* Optional MIME type for the icon.
	*/
	mimeType: string$1().optional(),
	/**
	* Optional array of strings that specify sizes at which the icon can be used.
	* Each string should be in WxH format (e.g., `"48x48"`, `"96x96"`) or `"any"` for scalable formats like SVG.
	*
	* If not provided, the client should assume that the icon can be used at any size.
	*/
	sizes: array(string$1()).optional(),
	/**
	* Optional specifier for the theme this icon is designed for. `light` indicates
	* the icon is designed to be used with a light background, and `dark` indicates
	* the icon is designed to be used with a dark background.
	*
	* If not provided, the client should assume the icon can be used with any theme.
	*/
	theme: _enum(["light", "dark"]).optional()
})).optional() });
/**
* Base metadata interface for common properties across resources, tools, prompts, and implementations.
*/
var BaseMetadataSchema = object({
	/** Intended for programmatic or logical use, but used as a display name in past specs or fallback */
	name: string$1(),
	/**
	* Intended for UI and end-user contexts — optimized to be human-readable and easily understood,
	* even by those unfamiliar with domain-specific terminology.
	*
	* If not provided, the name should be used for display (except for Tool,
	* where `annotations.title` should be given precedence over using `name`,
	* if present).
	*/
	title: string$1().optional()
});
/**
* Describes the name and version of an MCP implementation.
*/
var ImplementationSchema = BaseMetadataSchema.extend({
	...BaseMetadataSchema.shape,
	...IconsSchema.shape,
	version: string$1(),
	/**
	* An optional URL of the website for this implementation.
	*/
	websiteUrl: string$1().optional(),
	/**
	* An optional human-readable description of what this implementation does.
	*
	* This can be used by clients or servers to provide context about their purpose
	* and capabilities. For example, a server might describe the types of resources
	* or tools it provides, while a client might describe its intended use case.
	*/
	description: string$1().optional()
});
var ElicitationCapabilitySchema = preprocess((value) => {
	if (value && typeof value === "object" && !Array.isArray(value)) {
		if (Object.keys(value).length === 0) return { form: {} };
	}
	return value;
}, intersection(object({
	form: intersection(object({ applyDefaults: boolean$1().optional() }), record(string$1(), unknown())).optional(),
	url: AssertObjectSchema.optional()
}), record(string$1(), unknown()).optional()));
/**
* Task capabilities for clients, indicating which request types support task creation.
*/
var ClientTasksCapabilitySchema = looseObject({
	/**
	* Present if the client supports listing tasks.
	*/
	list: AssertObjectSchema.optional(),
	/**
	* Present if the client supports cancelling tasks.
	*/
	cancel: AssertObjectSchema.optional(),
	/**
	* Capabilities for task creation on specific request types.
	*/
	requests: looseObject({
		/**
		* Task support for sampling requests.
		*/
		sampling: looseObject({ createMessage: AssertObjectSchema.optional() }).optional(),
		/**
		* Task support for elicitation requests.
		*/
		elicitation: looseObject({ create: AssertObjectSchema.optional() }).optional()
	}).optional()
});
/**
* Task capabilities for servers, indicating which request types support task creation.
*/
var ServerTasksCapabilitySchema = looseObject({
	/**
	* Present if the server supports listing tasks.
	*/
	list: AssertObjectSchema.optional(),
	/**
	* Present if the server supports cancelling tasks.
	*/
	cancel: AssertObjectSchema.optional(),
	/**
	* Capabilities for task creation on specific request types.
	*/
	requests: looseObject({ 
	/**
	* Task support for tool requests.
	*/
tools: looseObject({ call: AssertObjectSchema.optional() }).optional() }).optional()
});
/**
* Capabilities a client may support. Known capabilities are defined here, in this schema, but this is not a closed set: any client can define its own, additional capabilities.
*/
var ClientCapabilitiesSchema = object({
	/**
	* Experimental, non-standard capabilities that the client supports.
	*/
	experimental: record(string$1(), AssertObjectSchema).optional(),
	/**
	* Present if the client supports sampling from an LLM.
	*/
	sampling: object({
		/**
		* Present if the client supports context inclusion via includeContext parameter.
		* If not declared, servers SHOULD only use `includeContext: "none"` (or omit it).
		*/
		context: AssertObjectSchema.optional(),
		/**
		* Present if the client supports tool use via tools and toolChoice parameters.
		*/
		tools: AssertObjectSchema.optional()
	}).optional(),
	/**
	* Present if the client supports eliciting user input.
	*/
	elicitation: ElicitationCapabilitySchema.optional(),
	/**
	* Present if the client supports listing roots.
	*/
	roots: object({ 
	/**
	* Whether the client supports issuing notifications for changes to the roots list.
	*/
listChanged: boolean$1().optional() }).optional(),
	/**
	* Present if the client supports task creation.
	*/
	tasks: ClientTasksCapabilitySchema.optional(),
	/**
	* Extensions that the client supports. Keys are extension identifiers (vendor-prefix/extension-name).
	*/
	extensions: record(string$1(), AssertObjectSchema).optional()
});
var InitializeRequestParamsSchema = BaseRequestParamsSchema.extend({
	/**
	* The latest version of the Model Context Protocol that the client supports. The client MAY decide to support older versions as well.
	*/
	protocolVersion: string$1(),
	capabilities: ClientCapabilitiesSchema,
	clientInfo: ImplementationSchema
});
/**
* This request is sent from the client to the server when it first connects, asking it to begin initialization.
*/
var InitializeRequestSchema = RequestSchema.extend({
	method: literal("initialize"),
	params: InitializeRequestParamsSchema
});
/**
* Capabilities that a server may support. Known capabilities are defined here, in this schema, but this is not a closed set: any server can define its own, additional capabilities.
*/
var ServerCapabilitiesSchema = object({
	/**
	* Experimental, non-standard capabilities that the server supports.
	*/
	experimental: record(string$1(), AssertObjectSchema).optional(),
	/**
	* Present if the server supports sending log messages to the client.
	*/
	logging: AssertObjectSchema.optional(),
	/**
	* Present if the server supports sending completions to the client.
	*/
	completions: AssertObjectSchema.optional(),
	/**
	* Present if the server offers any prompt templates.
	*/
	prompts: object({ 
	/**
	* Whether this server supports issuing notifications for changes to the prompt list.
	*/
listChanged: boolean$1().optional() }).optional(),
	/**
	* Present if the server offers any resources to read.
	*/
	resources: object({
		/**
		* Whether this server supports clients subscribing to resource updates.
		*/
		subscribe: boolean$1().optional(),
		/**
		* Whether this server supports issuing notifications for changes to the resource list.
		*/
		listChanged: boolean$1().optional()
	}).optional(),
	/**
	* Present if the server offers any tools to call.
	*/
	tools: object({ 
	/**
	* Whether this server supports issuing notifications for changes to the tool list.
	*/
listChanged: boolean$1().optional() }).optional(),
	/**
	* Present if the server supports task creation.
	*/
	tasks: ServerTasksCapabilitySchema.optional(),
	/**
	* Extensions that the server supports. Keys are extension identifiers (vendor-prefix/extension-name).
	*/
	extensions: record(string$1(), AssertObjectSchema).optional()
});
/**
* After receiving an initialize request from the client, the server sends this response.
*/
var InitializeResultSchema = ResultSchema.extend({
	/**
	* The version of the Model Context Protocol that the server wants to use. This may not match the version that the client requested. If the client cannot support this version, it MUST disconnect.
	*/
	protocolVersion: string$1(),
	capabilities: ServerCapabilitiesSchema,
	serverInfo: ImplementationSchema,
	/**
	* Instructions describing how to use the server and its features.
	*
	* This can be used by clients to improve the LLM's understanding of available tools, resources, etc. It can be thought of like a "hint" to the model. For example, this information MAY be added to the system prompt.
	*/
	instructions: string$1().optional()
});
/**
* This notification is sent from the client to the server after initialization has finished.
*/
var InitializedNotificationSchema = NotificationSchema.extend({
	method: literal("notifications/initialized"),
	params: NotificationsParamsSchema.optional()
});
var isInitializedNotification = (value) => InitializedNotificationSchema.safeParse(value).success;
/**
* A ping, issued by either the server or the client, to check that the other party is still alive. The receiver must promptly respond, or else may be disconnected.
*/
var PingRequestSchema = RequestSchema.extend({
	method: literal("ping"),
	params: BaseRequestParamsSchema.optional()
});
var ProgressSchema = object({
	/**
	* The progress thus far. This should increase every time progress is made, even if the total is unknown.
	*/
	progress: number$1(),
	/**
	* Total number of items to process (or total progress required), if known.
	*/
	total: optional(number$1()),
	/**
	* An optional message describing the current progress.
	*/
	message: optional(string$1())
});
var ProgressNotificationParamsSchema = object({
	...NotificationsParamsSchema.shape,
	...ProgressSchema.shape,
	/**
	* The progress token which was given in the initial request, used to associate this notification with the request that is proceeding.
	*/
	progressToken: ProgressTokenSchema
});
/**
* An out-of-band notification used to inform the receiver of a progress update for a long-running request.
*
* @category notifications/progress
*/
var ProgressNotificationSchema = NotificationSchema.extend({
	method: literal("notifications/progress"),
	params: ProgressNotificationParamsSchema
});
var PaginatedRequestParamsSchema = BaseRequestParamsSchema.extend({ 
/**
* An opaque token representing the current pagination position.
* If provided, the server should return results starting after this cursor.
*/
cursor: CursorSchema.optional() });
var PaginatedRequestSchema = RequestSchema.extend({ params: PaginatedRequestParamsSchema.optional() });
var PaginatedResultSchema = ResultSchema.extend({ 
/**
* An opaque token representing the pagination position after the last returned result.
* If present, there may be more results available.
*/
nextCursor: CursorSchema.optional() });
/**
* The status of a task.
* */
var TaskStatusSchema = _enum([
	"working",
	"input_required",
	"completed",
	"failed",
	"cancelled"
]);
/**
* A pollable state object associated with a request.
*/
var TaskSchema = object({
	taskId: string$1(),
	status: TaskStatusSchema,
	/**
	* Time in milliseconds to keep task results available after completion.
	* If null, the task has unlimited lifetime until manually cleaned up.
	*/
	ttl: union([number$1(), _null()]),
	/**
	* ISO 8601 timestamp when the task was created.
	*/
	createdAt: string$1(),
	/**
	* ISO 8601 timestamp when the task was last updated.
	*/
	lastUpdatedAt: string$1(),
	pollInterval: optional(number$1()),
	/**
	* Optional diagnostic message for failed tasks or other status information.
	*/
	statusMessage: optional(string$1())
});
/**
* Result returned when a task is created, containing the task data wrapped in a task field.
*/
var CreateTaskResultSchema = ResultSchema.extend({ task: TaskSchema });
/**
* Parameters for task status notification.
*/
var TaskStatusNotificationParamsSchema = NotificationsParamsSchema.merge(TaskSchema);
/**
* A notification sent when a task's status changes.
*/
var TaskStatusNotificationSchema = NotificationSchema.extend({
	method: literal("notifications/tasks/status"),
	params: TaskStatusNotificationParamsSchema
});
/**
* A request to get the state of a specific task.
*/
var GetTaskRequestSchema = RequestSchema.extend({
	method: literal("tasks/get"),
	params: BaseRequestParamsSchema.extend({ taskId: string$1() })
});
/**
* The response to a tasks/get request.
*/
var GetTaskResultSchema = ResultSchema.merge(TaskSchema);
/**
* A request to get the result of a specific task.
*/
var GetTaskPayloadRequestSchema = RequestSchema.extend({
	method: literal("tasks/result"),
	params: BaseRequestParamsSchema.extend({ taskId: string$1() })
});
ResultSchema.loose();
/**
* A request to list tasks.
*/
var ListTasksRequestSchema = PaginatedRequestSchema.extend({ method: literal("tasks/list") });
/**
* The response to a tasks/list request.
*/
var ListTasksResultSchema = PaginatedResultSchema.extend({ tasks: array(TaskSchema) });
/**
* A request to cancel a specific task.
*/
var CancelTaskRequestSchema = RequestSchema.extend({
	method: literal("tasks/cancel"),
	params: BaseRequestParamsSchema.extend({ taskId: string$1() })
});
/**
* The response to a tasks/cancel request.
*/
var CancelTaskResultSchema = ResultSchema.merge(TaskSchema);
/**
* The contents of a specific resource or sub-resource.
*/
var ResourceContentsSchema = object({
	/**
	* The URI of this resource.
	*/
	uri: string$1(),
	/**
	* The MIME type of this resource, if known.
	*/
	mimeType: optional(string$1()),
	/**
	* See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
	* for notes on _meta usage.
	*/
	_meta: record(string$1(), unknown()).optional()
});
var TextResourceContentsSchema = ResourceContentsSchema.extend({ 
/**
* The text of the item. This must only be set if the item can actually be represented as text (not binary data).
*/
text: string$1() });
/**
* A Zod schema for validating Base64 strings that is more performant and
* robust for very large inputs than the default regex-based check. It avoids
* stack overflows by using the native `atob` function for validation.
*/
var Base64Schema = string$1().refine((val) => {
	try {
		atob(val);
		return true;
	} catch {
		return false;
	}
}, { message: "Invalid Base64 string" });
var BlobResourceContentsSchema = ResourceContentsSchema.extend({ 
/**
* A base64-encoded string representing the binary data of the item.
*/
blob: Base64Schema });
/**
* The sender or recipient of messages and data in a conversation.
*/
var RoleSchema = _enum(["user", "assistant"]);
/**
* Optional annotations providing clients additional context about a resource.
*/
var AnnotationsSchema = object({
	/**
	* Intended audience(s) for the resource.
	*/
	audience: array(RoleSchema).optional(),
	/**
	* Importance hint for the resource, from 0 (least) to 1 (most).
	*/
	priority: number$1().min(0).max(1).optional(),
	/**
	* ISO 8601 timestamp for the most recent modification.
	*/
	lastModified: datetime({ offset: true }).optional()
});
/**
* A known resource that the server is capable of reading.
*/
var ResourceSchema = object({
	...BaseMetadataSchema.shape,
	...IconsSchema.shape,
	/**
	* The URI of this resource.
	*/
	uri: string$1(),
	/**
	* A description of what this resource represents.
	*
	* This can be used by clients to improve the LLM's understanding of available resources. It can be thought of like a "hint" to the model.
	*/
	description: optional(string$1()),
	/**
	* The MIME type of this resource, if known.
	*/
	mimeType: optional(string$1()),
	/**
	* The size of the raw resource content, in bytes (i.e., before base64 encoding or any tokenization), if known.
	*
	* This can be used by Hosts to display file sizes and estimate context window usage.
	*/
	size: optional(number$1()),
	/**
	* Optional annotations for the client.
	*/
	annotations: AnnotationsSchema.optional(),
	/**
	* See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
	* for notes on _meta usage.
	*/
	_meta: optional(looseObject({}))
});
/**
* A template description for resources available on the server.
*/
var ResourceTemplateSchema = object({
	...BaseMetadataSchema.shape,
	...IconsSchema.shape,
	/**
	* A URI template (according to RFC 6570) that can be used to construct resource URIs.
	*/
	uriTemplate: string$1(),
	/**
	* A description of what this template is for.
	*
	* This can be used by clients to improve the LLM's understanding of available resources. It can be thought of like a "hint" to the model.
	*/
	description: optional(string$1()),
	/**
	* The MIME type for all resources that match this template. This should only be included if all resources matching this template have the same type.
	*/
	mimeType: optional(string$1()),
	/**
	* Optional annotations for the client.
	*/
	annotations: AnnotationsSchema.optional(),
	/**
	* See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
	* for notes on _meta usage.
	*/
	_meta: optional(looseObject({}))
});
/**
* Sent from the client to request a list of resources the server has.
*/
var ListResourcesRequestSchema = PaginatedRequestSchema.extend({ method: literal("resources/list") });
/**
* The server's response to a resources/list request from the client.
*/
var ListResourcesResultSchema = PaginatedResultSchema.extend({ resources: array(ResourceSchema) });
/**
* Sent from the client to request a list of resource templates the server has.
*/
var ListResourceTemplatesRequestSchema = PaginatedRequestSchema.extend({ method: literal("resources/templates/list") });
/**
* The server's response to a resources/templates/list request from the client.
*/
var ListResourceTemplatesResultSchema = PaginatedResultSchema.extend({ resourceTemplates: array(ResourceTemplateSchema) });
var ResourceRequestParamsSchema = BaseRequestParamsSchema.extend({ 
/**
* The URI of the resource to read. The URI can use any protocol; it is up to the server how to interpret it.
*
* @format uri
*/
uri: string$1() });
/**
* Parameters for a `resources/read` request.
*/
var ReadResourceRequestParamsSchema = ResourceRequestParamsSchema;
/**
* Sent from the client to the server, to read a specific resource URI.
*/
var ReadResourceRequestSchema = RequestSchema.extend({
	method: literal("resources/read"),
	params: ReadResourceRequestParamsSchema
});
/**
* The server's response to a resources/read request from the client.
*/
var ReadResourceResultSchema = ResultSchema.extend({ contents: array(union([TextResourceContentsSchema, BlobResourceContentsSchema])) });
/**
* An optional notification from the server to the client, informing it that the list of resources it can read from has changed. This may be issued by servers without any previous subscription from the client.
*/
var ResourceListChangedNotificationSchema = NotificationSchema.extend({
	method: literal("notifications/resources/list_changed"),
	params: NotificationsParamsSchema.optional()
});
var SubscribeRequestParamsSchema = ResourceRequestParamsSchema;
/**
* Sent from the client to request resources/updated notifications from the server whenever a particular resource changes.
*/
var SubscribeRequestSchema = RequestSchema.extend({
	method: literal("resources/subscribe"),
	params: SubscribeRequestParamsSchema
});
var UnsubscribeRequestParamsSchema = ResourceRequestParamsSchema;
/**
* Sent from the client to request cancellation of resources/updated notifications from the server. This should follow a previous resources/subscribe request.
*/
var UnsubscribeRequestSchema = RequestSchema.extend({
	method: literal("resources/unsubscribe"),
	params: UnsubscribeRequestParamsSchema
});
/**
* Parameters for a `notifications/resources/updated` notification.
*/
var ResourceUpdatedNotificationParamsSchema = NotificationsParamsSchema.extend({ 
/**
* The URI of the resource that has been updated. This might be a sub-resource of the one that the client actually subscribed to.
*/
uri: string$1() });
/**
* A notification from the server to the client, informing it that a resource has changed and may need to be read again. This should only be sent if the client previously sent a resources/subscribe request.
*/
var ResourceUpdatedNotificationSchema = NotificationSchema.extend({
	method: literal("notifications/resources/updated"),
	params: ResourceUpdatedNotificationParamsSchema
});
/**
* Describes an argument that a prompt can accept.
*/
var PromptArgumentSchema = object({
	/**
	* The name of the argument.
	*/
	name: string$1(),
	/**
	* A human-readable description of the argument.
	*/
	description: optional(string$1()),
	/**
	* Whether this argument must be provided.
	*/
	required: optional(boolean$1())
});
/**
* A prompt or prompt template that the server offers.
*/
var PromptSchema = object({
	...BaseMetadataSchema.shape,
	...IconsSchema.shape,
	/**
	* An optional description of what this prompt provides
	*/
	description: optional(string$1()),
	/**
	* A list of arguments to use for templating the prompt.
	*/
	arguments: optional(array(PromptArgumentSchema)),
	/**
	* See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
	* for notes on _meta usage.
	*/
	_meta: optional(looseObject({}))
});
/**
* Sent from the client to request a list of prompts and prompt templates the server has.
*/
var ListPromptsRequestSchema = PaginatedRequestSchema.extend({ method: literal("prompts/list") });
/**
* The server's response to a prompts/list request from the client.
*/
var ListPromptsResultSchema = PaginatedResultSchema.extend({ prompts: array(PromptSchema) });
/**
* Parameters for a `prompts/get` request.
*/
var GetPromptRequestParamsSchema = BaseRequestParamsSchema.extend({
	/**
	* The name of the prompt or prompt template.
	*/
	name: string$1(),
	/**
	* Arguments to use for templating the prompt.
	*/
	arguments: record(string$1(), string$1()).optional()
});
/**
* Used by the client to get a prompt provided by the server.
*/
var GetPromptRequestSchema = RequestSchema.extend({
	method: literal("prompts/get"),
	params: GetPromptRequestParamsSchema
});
/**
* Text provided to or from an LLM.
*/
var TextContentSchema = object({
	type: literal("text"),
	/**
	* The text content of the message.
	*/
	text: string$1(),
	/**
	* Optional annotations for the client.
	*/
	annotations: AnnotationsSchema.optional(),
	/**
	* See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
	* for notes on _meta usage.
	*/
	_meta: record(string$1(), unknown()).optional()
});
/**
* An image provided to or from an LLM.
*/
var ImageContentSchema = object({
	type: literal("image"),
	/**
	* The base64-encoded image data.
	*/
	data: Base64Schema,
	/**
	* The MIME type of the image. Different providers may support different image types.
	*/
	mimeType: string$1(),
	/**
	* Optional annotations for the client.
	*/
	annotations: AnnotationsSchema.optional(),
	/**
	* See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
	* for notes on _meta usage.
	*/
	_meta: record(string$1(), unknown()).optional()
});
/**
* An Audio provided to or from an LLM.
*/
var AudioContentSchema = object({
	type: literal("audio"),
	/**
	* The base64-encoded audio data.
	*/
	data: Base64Schema,
	/**
	* The MIME type of the audio. Different providers may support different audio types.
	*/
	mimeType: string$1(),
	/**
	* Optional annotations for the client.
	*/
	annotations: AnnotationsSchema.optional(),
	/**
	* See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
	* for notes on _meta usage.
	*/
	_meta: record(string$1(), unknown()).optional()
});
/**
* A tool call request from an assistant (LLM).
* Represents the assistant's request to use a tool.
*/
var ToolUseContentSchema = object({
	type: literal("tool_use"),
	/**
	* The name of the tool to invoke.
	* Must match a tool name from the request's tools array.
	*/
	name: string$1(),
	/**
	* Unique identifier for this tool call.
	* Used to correlate with ToolResultContent in subsequent messages.
	*/
	id: string$1(),
	/**
	* Arguments to pass to the tool.
	* Must conform to the tool's inputSchema.
	*/
	input: record(string$1(), unknown()),
	/**
	* See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
	* for notes on _meta usage.
	*/
	_meta: record(string$1(), unknown()).optional()
});
/**
* The contents of a resource, embedded into a prompt or tool call result.
*/
var EmbeddedResourceSchema = object({
	type: literal("resource"),
	resource: union([TextResourceContentsSchema, BlobResourceContentsSchema]),
	/**
	* Optional annotations for the client.
	*/
	annotations: AnnotationsSchema.optional(),
	/**
	* See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
	* for notes on _meta usage.
	*/
	_meta: record(string$1(), unknown()).optional()
});
/**
* A content block that can be used in prompts and tool results.
*/
var ContentBlockSchema = union([
	TextContentSchema,
	ImageContentSchema,
	AudioContentSchema,
	ResourceSchema.extend({ type: literal("resource_link") }),
	EmbeddedResourceSchema
]);
/**
* Describes a message returned as part of a prompt.
*/
var PromptMessageSchema = object({
	role: RoleSchema,
	content: ContentBlockSchema
});
/**
* The server's response to a prompts/get request from the client.
*/
var GetPromptResultSchema = ResultSchema.extend({
	/**
	* An optional description for the prompt.
	*/
	description: string$1().optional(),
	messages: array(PromptMessageSchema)
});
/**
* An optional notification from the server to the client, informing it that the list of prompts it offers has changed. This may be issued by servers without any previous subscription from the client.
*/
var PromptListChangedNotificationSchema = NotificationSchema.extend({
	method: literal("notifications/prompts/list_changed"),
	params: NotificationsParamsSchema.optional()
});
/**
* Additional properties describing a Tool to clients.
*
* NOTE: all properties in ToolAnnotations are **hints**.
* They are not guaranteed to provide a faithful description of
* tool behavior (including descriptive properties like `title`).
*
* Clients should never make tool use decisions based on ToolAnnotations
* received from untrusted servers.
*/
var ToolAnnotationsSchema = object({
	/**
	* A human-readable title for the tool.
	*/
	title: string$1().optional(),
	/**
	* If true, the tool does not modify its environment.
	*
	* Default: false
	*/
	readOnlyHint: boolean$1().optional(),
	/**
	* If true, the tool may perform destructive updates to its environment.
	* If false, the tool performs only additive updates.
	*
	* (This property is meaningful only when `readOnlyHint == false`)
	*
	* Default: true
	*/
	destructiveHint: boolean$1().optional(),
	/**
	* If true, calling the tool repeatedly with the same arguments
	* will have no additional effect on the its environment.
	*
	* (This property is meaningful only when `readOnlyHint == false`)
	*
	* Default: false
	*/
	idempotentHint: boolean$1().optional(),
	/**
	* If true, this tool may interact with an "open world" of external
	* entities. If false, the tool's domain of interaction is closed.
	* For example, the world of a web search tool is open, whereas that
	* of a memory tool is not.
	*
	* Default: true
	*/
	openWorldHint: boolean$1().optional()
});
/**
* Execution-related properties for a tool.
*/
var ToolExecutionSchema = object({ 
/**
* Indicates the tool's preference for task-augmented execution.
* - "required": Clients MUST invoke the tool as a task
* - "optional": Clients MAY invoke the tool as a task or normal request
* - "forbidden": Clients MUST NOT attempt to invoke the tool as a task
*
* If not present, defaults to "forbidden".
*/
taskSupport: _enum([
	"required",
	"optional",
	"forbidden"
]).optional() });
/**
* Definition for a tool the client can call.
*/
var ToolSchema = object({
	...BaseMetadataSchema.shape,
	...IconsSchema.shape,
	/**
	* A human-readable description of the tool.
	*/
	description: string$1().optional(),
	/**
	* A JSON Schema 2020-12 object defining the expected parameters for the tool.
	* Must have type: 'object' at the root level per MCP spec.
	*/
	inputSchema: object({
		type: literal("object"),
		properties: record(string$1(), AssertObjectSchema).optional(),
		required: array(string$1()).optional()
	}).catchall(unknown()),
	/**
	* An optional JSON Schema 2020-12 object defining the structure of the tool's output
	* returned in the structuredContent field of a CallToolResult.
	* Must have type: 'object' at the root level per MCP spec.
	*/
	outputSchema: object({
		type: literal("object"),
		properties: record(string$1(), AssertObjectSchema).optional(),
		required: array(string$1()).optional()
	}).catchall(unknown()).optional(),
	/**
	* Optional additional tool information.
	*/
	annotations: ToolAnnotationsSchema.optional(),
	/**
	* Execution-related properties for this tool.
	*/
	execution: ToolExecutionSchema.optional(),
	/**
	* See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
	* for notes on _meta usage.
	*/
	_meta: record(string$1(), unknown()).optional()
});
/**
* Sent from the client to request a list of tools the server has.
*/
var ListToolsRequestSchema = PaginatedRequestSchema.extend({ method: literal("tools/list") });
/**
* The server's response to a tools/list request from the client.
*/
var ListToolsResultSchema = PaginatedResultSchema.extend({ tools: array(ToolSchema) });
/**
* The server's response to a tool call.
*/
var CallToolResultSchema = ResultSchema.extend({
	/**
	* A list of content objects that represent the result of the tool call.
	*
	* If the Tool does not define an outputSchema, this field MUST be present in the result.
	* For backwards compatibility, this field is always present, but it may be empty.
	*/
	content: array(ContentBlockSchema).default([]),
	/**
	* An object containing structured tool output.
	*
	* If the Tool defines an outputSchema, this field MUST be present in the result, and contain a JSON object that matches the schema.
	*/
	structuredContent: record(string$1(), unknown()).optional(),
	/**
	* Whether the tool call ended in an error.
	*
	* If not set, this is assumed to be false (the call was successful).
	*
	* Any errors that originate from the tool SHOULD be reported inside the result
	* object, with `isError` set to true, _not_ as an MCP protocol-level error
	* response. Otherwise, the LLM would not be able to see that an error occurred
	* and self-correct.
	*
	* However, any errors in _finding_ the tool, an error indicating that the
	* server does not support tool calls, or any other exceptional conditions,
	* should be reported as an MCP error response.
	*/
	isError: boolean$1().optional()
});
CallToolResultSchema.or(ResultSchema.extend({ toolResult: unknown() }));
/**
* Parameters for a `tools/call` request.
*/
var CallToolRequestParamsSchema = TaskAugmentedRequestParamsSchema.extend({
	/**
	* The name of the tool to call.
	*/
	name: string$1(),
	/**
	* Arguments to pass to the tool.
	*/
	arguments: record(string$1(), unknown()).optional()
});
/**
* Used by the client to invoke a tool provided by the server.
*/
var CallToolRequestSchema = RequestSchema.extend({
	method: literal("tools/call"),
	params: CallToolRequestParamsSchema
});
/**
* An optional notification from the server to the client, informing it that the list of tools it offers has changed. This may be issued by servers without any previous subscription from the client.
*/
var ToolListChangedNotificationSchema = NotificationSchema.extend({
	method: literal("notifications/tools/list_changed"),
	params: NotificationsParamsSchema.optional()
});
/**
* Base schema for list changed subscription options (without callback).
* Used internally for Zod validation of autoRefresh and debounceMs.
*/
var ListChangedOptionsBaseSchema = object({
	/**
	* If true, the list will be refreshed automatically when a list changed notification is received.
	* The callback will be called with the updated list.
	*
	* If false, the callback will be called with null items, allowing manual refresh.
	*
	* @default true
	*/
	autoRefresh: boolean$1().default(true),
	/**
	* Debounce time in milliseconds for list changed notification processing.
	*
	* Multiple notifications received within this timeframe will only trigger one refresh.
	* Set to 0 to disable debouncing.
	*
	* @default 300
	*/
	debounceMs: number$1().int().nonnegative().default(300)
});
/**
* The severity of a log message.
*/
var LoggingLevelSchema = _enum([
	"debug",
	"info",
	"notice",
	"warning",
	"error",
	"critical",
	"alert",
	"emergency"
]);
/**
* Parameters for a `logging/setLevel` request.
*/
var SetLevelRequestParamsSchema = BaseRequestParamsSchema.extend({ 
/**
* The level of logging that the client wants to receive from the server. The server should send all logs at this level and higher (i.e., more severe) to the client as notifications/logging/message.
*/
level: LoggingLevelSchema });
/**
* A request from the client to the server, to enable or adjust logging.
*/
var SetLevelRequestSchema = RequestSchema.extend({
	method: literal("logging/setLevel"),
	params: SetLevelRequestParamsSchema
});
/**
* Parameters for a `notifications/message` notification.
*/
var LoggingMessageNotificationParamsSchema = NotificationsParamsSchema.extend({
	/**
	* The severity of this log message.
	*/
	level: LoggingLevelSchema,
	/**
	* An optional name of the logger issuing this message.
	*/
	logger: string$1().optional(),
	/**
	* The data to be logged, such as a string message or an object. Any JSON serializable type is allowed here.
	*/
	data: unknown()
});
/**
* Notification of a log message passed from server to client. If no logging/setLevel request has been sent from the client, the server MAY decide which messages to send automatically.
*/
var LoggingMessageNotificationSchema = NotificationSchema.extend({
	method: literal("notifications/message"),
	params: LoggingMessageNotificationParamsSchema
});
/**
* The server's preferences for model selection, requested of the client during sampling.
*/
var ModelPreferencesSchema = object({
	/**
	* Optional hints to use for model selection.
	*/
	hints: array(object({ 
	/**
	* A hint for a model name.
	*/
name: string$1().optional() })).optional(),
	/**
	* How much to prioritize cost when selecting a model.
	*/
	costPriority: number$1().min(0).max(1).optional(),
	/**
	* How much to prioritize sampling speed (latency) when selecting a model.
	*/
	speedPriority: number$1().min(0).max(1).optional(),
	/**
	* How much to prioritize intelligence and capabilities when selecting a model.
	*/
	intelligencePriority: number$1().min(0).max(1).optional()
});
/**
* Controls tool usage behavior in sampling requests.
*/
var ToolChoiceSchema = object({ 
/**
* Controls when tools are used:
* - "auto": Model decides whether to use tools (default)
* - "required": Model MUST use at least one tool before completing
* - "none": Model MUST NOT use any tools
*/
mode: _enum([
	"auto",
	"required",
	"none"
]).optional() });
/**
* The result of a tool execution, provided by the user (server).
* Represents the outcome of invoking a tool requested via ToolUseContent.
*/
var ToolResultContentSchema = object({
	type: literal("tool_result"),
	toolUseId: string$1().describe("The unique identifier for the corresponding tool call."),
	content: array(ContentBlockSchema).default([]),
	structuredContent: object({}).loose().optional(),
	isError: boolean$1().optional(),
	/**
	* See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
	* for notes on _meta usage.
	*/
	_meta: record(string$1(), unknown()).optional()
});
/**
* Basic content types for sampling responses (without tool use).
* Used for backwards-compatible CreateMessageResult when tools are not used.
*/
var SamplingContentSchema = discriminatedUnion("type", [
	TextContentSchema,
	ImageContentSchema,
	AudioContentSchema
]);
/**
* Content block types allowed in sampling messages.
* This includes text, image, audio, tool use requests, and tool results.
*/
var SamplingMessageContentBlockSchema = discriminatedUnion("type", [
	TextContentSchema,
	ImageContentSchema,
	AudioContentSchema,
	ToolUseContentSchema,
	ToolResultContentSchema
]);
/**
* Describes a message issued to or received from an LLM API.
*/
var SamplingMessageSchema = object({
	role: RoleSchema,
	content: union([SamplingMessageContentBlockSchema, array(SamplingMessageContentBlockSchema)]),
	/**
	* See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
	* for notes on _meta usage.
	*/
	_meta: record(string$1(), unknown()).optional()
});
/**
* Parameters for a `sampling/createMessage` request.
*/
var CreateMessageRequestParamsSchema = TaskAugmentedRequestParamsSchema.extend({
	messages: array(SamplingMessageSchema),
	/**
	* The server's preferences for which model to select. The client MAY modify or omit this request.
	*/
	modelPreferences: ModelPreferencesSchema.optional(),
	/**
	* An optional system prompt the server wants to use for sampling. The client MAY modify or omit this prompt.
	*/
	systemPrompt: string$1().optional(),
	/**
	* A request to include context from one or more MCP servers (including the caller), to be attached to the prompt.
	* The client MAY ignore this request.
	*
	* Default is "none". Values "thisServer" and "allServers" are soft-deprecated. Servers SHOULD only use these values if the client
	* declares ClientCapabilities.sampling.context. These values may be removed in future spec releases.
	*/
	includeContext: _enum([
		"none",
		"thisServer",
		"allServers"
	]).optional(),
	temperature: number$1().optional(),
	/**
	* The requested maximum number of tokens to sample (to prevent runaway completions).
	*
	* The client MAY choose to sample fewer tokens than the requested maximum.
	*/
	maxTokens: number$1().int(),
	stopSequences: array(string$1()).optional(),
	/**
	* Optional metadata to pass through to the LLM provider. The format of this metadata is provider-specific.
	*/
	metadata: AssertObjectSchema.optional(),
	/**
	* Tools that the model may use during generation.
	* The client MUST return an error if this field is provided but ClientCapabilities.sampling.tools is not declared.
	*/
	tools: array(ToolSchema).optional(),
	/**
	* Controls how the model uses tools.
	* The client MUST return an error if this field is provided but ClientCapabilities.sampling.tools is not declared.
	* Default is `{ mode: "auto" }`.
	*/
	toolChoice: ToolChoiceSchema.optional()
});
/**
* A request from the server to sample an LLM via the client. The client has full discretion over which model to select. The client should also inform the user before beginning sampling, to allow them to inspect the request (human in the loop) and decide whether to approve it.
*/
var CreateMessageRequestSchema = RequestSchema.extend({
	method: literal("sampling/createMessage"),
	params: CreateMessageRequestParamsSchema
});
/**
* The client's response to a sampling/create_message request from the server.
* This is the backwards-compatible version that returns single content (no arrays).
* Used when the request does not include tools.
*/
var CreateMessageResultSchema = ResultSchema.extend({
	/**
	* The name of the model that generated the message.
	*/
	model: string$1(),
	/**
	* The reason why sampling stopped, if known.
	*
	* Standard values:
	* - "endTurn": Natural end of the assistant's turn
	* - "stopSequence": A stop sequence was encountered
	* - "maxTokens": Maximum token limit was reached
	*
	* This field is an open string to allow for provider-specific stop reasons.
	*/
	stopReason: optional(_enum([
		"endTurn",
		"stopSequence",
		"maxTokens"
	]).or(string$1())),
	role: RoleSchema,
	/**
	* Response content. Single content block (text, image, or audio).
	*/
	content: SamplingContentSchema
});
/**
* The client's response to a sampling/create_message request when tools were provided.
* This version supports array content for tool use flows.
*/
var CreateMessageResultWithToolsSchema = ResultSchema.extend({
	/**
	* The name of the model that generated the message.
	*/
	model: string$1(),
	/**
	* The reason why sampling stopped, if known.
	*
	* Standard values:
	* - "endTurn": Natural end of the assistant's turn
	* - "stopSequence": A stop sequence was encountered
	* - "maxTokens": Maximum token limit was reached
	* - "toolUse": The model wants to use one or more tools
	*
	* This field is an open string to allow for provider-specific stop reasons.
	*/
	stopReason: optional(_enum([
		"endTurn",
		"stopSequence",
		"maxTokens",
		"toolUse"
	]).or(string$1())),
	role: RoleSchema,
	/**
	* Response content. May be a single block or array. May include ToolUseContent if stopReason is "toolUse".
	*/
	content: union([SamplingMessageContentBlockSchema, array(SamplingMessageContentBlockSchema)])
});
/**
* Primitive schema definition for boolean fields.
*/
var BooleanSchemaSchema = object({
	type: literal("boolean"),
	title: string$1().optional(),
	description: string$1().optional(),
	default: boolean$1().optional()
});
/**
* Primitive schema definition for string fields.
*/
var StringSchemaSchema = object({
	type: literal("string"),
	title: string$1().optional(),
	description: string$1().optional(),
	minLength: number$1().optional(),
	maxLength: number$1().optional(),
	format: _enum([
		"email",
		"uri",
		"date",
		"date-time"
	]).optional(),
	default: string$1().optional()
});
/**
* Primitive schema definition for number fields.
*/
var NumberSchemaSchema = object({
	type: _enum(["number", "integer"]),
	title: string$1().optional(),
	description: string$1().optional(),
	minimum: number$1().optional(),
	maximum: number$1().optional(),
	default: number$1().optional()
});
/**
* Schema for single-selection enumeration without display titles for options.
*/
var UntitledSingleSelectEnumSchemaSchema = object({
	type: literal("string"),
	title: string$1().optional(),
	description: string$1().optional(),
	enum: array(string$1()),
	default: string$1().optional()
});
/**
* Schema for single-selection enumeration with display titles for each option.
*/
var TitledSingleSelectEnumSchemaSchema = object({
	type: literal("string"),
	title: string$1().optional(),
	description: string$1().optional(),
	oneOf: array(object({
		const: string$1(),
		title: string$1()
	})),
	default: string$1().optional()
});
/**
* Union of all primitive schema definitions.
*/
var PrimitiveSchemaDefinitionSchema = union([
	union([
		object({
			type: literal("string"),
			title: string$1().optional(),
			description: string$1().optional(),
			enum: array(string$1()),
			enumNames: array(string$1()).optional(),
			default: string$1().optional()
		}),
		union([UntitledSingleSelectEnumSchemaSchema, TitledSingleSelectEnumSchemaSchema]),
		union([object({
			type: literal("array"),
			title: string$1().optional(),
			description: string$1().optional(),
			minItems: number$1().optional(),
			maxItems: number$1().optional(),
			items: object({
				type: literal("string"),
				enum: array(string$1())
			}),
			default: array(string$1()).optional()
		}), object({
			type: literal("array"),
			title: string$1().optional(),
			description: string$1().optional(),
			minItems: number$1().optional(),
			maxItems: number$1().optional(),
			items: object({ anyOf: array(object({
				const: string$1(),
				title: string$1()
			})) }),
			default: array(string$1()).optional()
		})])
	]),
	BooleanSchemaSchema,
	StringSchemaSchema,
	NumberSchemaSchema
]);
/**
* The parameters for a request to elicit additional information from the user via the client.
*/
var ElicitRequestParamsSchema = union([TaskAugmentedRequestParamsSchema.extend({
	/**
	* The elicitation mode.
	*
	* Optional for backward compatibility. Clients MUST treat missing mode as "form".
	*/
	mode: literal("form").optional(),
	/**
	* The message to present to the user describing what information is being requested.
	*/
	message: string$1(),
	/**
	* A restricted subset of JSON Schema.
	* Only top-level properties are allowed, without nesting.
	*/
	requestedSchema: object({
		type: literal("object"),
		properties: record(string$1(), PrimitiveSchemaDefinitionSchema),
		required: array(string$1()).optional()
	})
}), TaskAugmentedRequestParamsSchema.extend({
	/**
	* The elicitation mode.
	*/
	mode: literal("url"),
	/**
	* The message to present to the user explaining why the interaction is needed.
	*/
	message: string$1(),
	/**
	* The ID of the elicitation, which must be unique within the context of the server.
	* The client MUST treat this ID as an opaque value.
	*/
	elicitationId: string$1(),
	/**
	* The URL that the user should navigate to.
	*/
	url: string$1().url()
})]);
/**
* A request from the server to elicit user input via the client.
* The client should present the message and form fields to the user (form mode)
* or navigate to a URL (URL mode).
*/
var ElicitRequestSchema = RequestSchema.extend({
	method: literal("elicitation/create"),
	params: ElicitRequestParamsSchema
});
/**
* Parameters for a `notifications/elicitation/complete` notification.
*
* @category notifications/elicitation/complete
*/
var ElicitationCompleteNotificationParamsSchema = NotificationsParamsSchema.extend({ 
/**
* The ID of the elicitation that completed.
*/
elicitationId: string$1() });
/**
* A notification from the server to the client, informing it of a completion of an out-of-band elicitation request.
*
* @category notifications/elicitation/complete
*/
var ElicitationCompleteNotificationSchema = NotificationSchema.extend({
	method: literal("notifications/elicitation/complete"),
	params: ElicitationCompleteNotificationParamsSchema
});
/**
* The client's response to an elicitation/create request from the server.
*/
var ElicitResultSchema = ResultSchema.extend({
	/**
	* The user action in response to the elicitation.
	* - "accept": User submitted the form/confirmed the action
	* - "decline": User explicitly decline the action
	* - "cancel": User dismissed without making an explicit choice
	*/
	action: _enum([
		"accept",
		"decline",
		"cancel"
	]),
	/**
	* The submitted form data, only present when action is "accept".
	* Contains values matching the requested schema.
	* Per MCP spec, content is "typically omitted" for decline/cancel actions.
	* We normalize null to undefined for leniency while maintaining type compatibility.
	*/
	content: preprocess((val) => val === null ? void 0 : val, record(string$1(), union([
		string$1(),
		number$1(),
		boolean$1(),
		array(string$1())
	])).optional())
});
/**
* A reference to a resource or resource template definition.
*/
var ResourceTemplateReferenceSchema = object({
	type: literal("ref/resource"),
	/**
	* The URI or URI template of the resource.
	*/
	uri: string$1()
});
/**
* Identifies a prompt.
*/
var PromptReferenceSchema = object({
	type: literal("ref/prompt"),
	/**
	* The name of the prompt or prompt template
	*/
	name: string$1()
});
/**
* Parameters for a `completion/complete` request.
*/
var CompleteRequestParamsSchema = BaseRequestParamsSchema.extend({
	ref: union([PromptReferenceSchema, ResourceTemplateReferenceSchema]),
	/**
	* The argument's information
	*/
	argument: object({
		/**
		* The name of the argument
		*/
		name: string$1(),
		/**
		* The value of the argument to use for completion matching.
		*/
		value: string$1()
	}),
	context: object({ 
	/**
	* Previously-resolved variables in a URI template or prompt.
	*/
arguments: record(string$1(), string$1()).optional() }).optional()
});
/**
* A request from the client to the server, to ask for completion options.
*/
var CompleteRequestSchema = RequestSchema.extend({
	method: literal("completion/complete"),
	params: CompleteRequestParamsSchema
});
/**
* The server's response to a completion/complete request
*/
var CompleteResultSchema = ResultSchema.extend({ completion: looseObject({
	/**
	* An array of completion values. Must not exceed 100 items.
	*/
	values: array(string$1()).max(100),
	/**
	* The total number of completion options available. This can exceed the number of values actually sent in the response.
	*/
	total: optional(number$1().int()),
	/**
	* Indicates whether there are additional completion options beyond those provided in the current response, even if the exact total is unknown.
	*/
	hasMore: optional(boolean$1())
}) });
/**
* Represents a root directory or file that the server can operate on.
*/
var RootSchema = object({
	/**
	* The URI identifying the root. This *must* start with file:// for now.
	*/
	uri: string$1().startsWith("file://"),
	/**
	* An optional name for the root.
	*/
	name: string$1().optional(),
	/**
	* See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
	* for notes on _meta usage.
	*/
	_meta: record(string$1(), unknown()).optional()
});
/**
* Sent from the server to request a list of root URIs from the client.
*/
var ListRootsRequestSchema = RequestSchema.extend({
	method: literal("roots/list"),
	params: BaseRequestParamsSchema.optional()
});
/**
* The client's response to a roots/list request from the server.
*/
var ListRootsResultSchema = ResultSchema.extend({ roots: array(RootSchema) });
/**
* A notification from the client to the server, informing it that the list of roots has changed.
*/
var RootsListChangedNotificationSchema = NotificationSchema.extend({
	method: literal("notifications/roots/list_changed"),
	params: NotificationsParamsSchema.optional()
});
union([
	PingRequestSchema,
	InitializeRequestSchema,
	CompleteRequestSchema,
	SetLevelRequestSchema,
	GetPromptRequestSchema,
	ListPromptsRequestSchema,
	ListResourcesRequestSchema,
	ListResourceTemplatesRequestSchema,
	ReadResourceRequestSchema,
	SubscribeRequestSchema,
	UnsubscribeRequestSchema,
	CallToolRequestSchema,
	ListToolsRequestSchema,
	GetTaskRequestSchema,
	GetTaskPayloadRequestSchema,
	ListTasksRequestSchema,
	CancelTaskRequestSchema
]);
union([
	CancelledNotificationSchema,
	ProgressNotificationSchema,
	InitializedNotificationSchema,
	RootsListChangedNotificationSchema,
	TaskStatusNotificationSchema
]);
union([
	EmptyResultSchema,
	CreateMessageResultSchema,
	CreateMessageResultWithToolsSchema,
	ElicitResultSchema,
	ListRootsResultSchema,
	GetTaskResultSchema,
	ListTasksResultSchema,
	CreateTaskResultSchema
]);
union([
	PingRequestSchema,
	CreateMessageRequestSchema,
	ElicitRequestSchema,
	ListRootsRequestSchema,
	GetTaskRequestSchema,
	GetTaskPayloadRequestSchema,
	ListTasksRequestSchema,
	CancelTaskRequestSchema
]);
union([
	CancelledNotificationSchema,
	ProgressNotificationSchema,
	LoggingMessageNotificationSchema,
	ResourceUpdatedNotificationSchema,
	ResourceListChangedNotificationSchema,
	ToolListChangedNotificationSchema,
	PromptListChangedNotificationSchema,
	TaskStatusNotificationSchema,
	ElicitationCompleteNotificationSchema
]);
union([
	EmptyResultSchema,
	InitializeResultSchema,
	CompleteResultSchema,
	GetPromptResultSchema,
	ListPromptsResultSchema,
	ListResourcesResultSchema,
	ListResourceTemplatesResultSchema,
	ReadResourceResultSchema,
	CallToolResultSchema,
	ListToolsResultSchema,
	GetTaskResultSchema,
	ListTasksResultSchema,
	CreateTaskResultSchema
]);
var McpError = class McpError extends Error {
	constructor(code, message, data) {
		super(`MCP error ${code}: ${message}`);
		this.code = code;
		this.data = data;
		this.name = "McpError";
	}
	/**
	* Factory method to create the appropriate error type based on the error code and data
	*/
	static fromError(code, message, data) {
		if (code === ErrorCode.UrlElicitationRequired && data) {
			const errorData = data;
			if (errorData.elicitations) return new UrlElicitationRequiredError(errorData.elicitations, message);
		}
		return new McpError(code, message, data);
	}
};
/**
* Specialized error type when a tool requires a URL mode elicitation.
* This makes it nicer for the client to handle since there is specific data to work with instead of just a code to check against.
*/
var UrlElicitationRequiredError = class extends McpError {
	constructor(elicitations, message = `URL elicitation${elicitations.length > 1 ? "s" : ""} required`) {
		super(ErrorCode.UrlElicitationRequired, message, { elicitations });
	}
	get elicitations() {
		return this.data?.elicitations ?? [];
	}
};
//#endregion
//#region node_modules/pkce-challenge/dist/index.node.js
var crypto = globalThis.crypto?.webcrypto ?? globalThis.crypto ?? import("node:crypto").then((m) => m.webcrypto);
/**
* Creates an array of length `size` of random bytes
* @param size
* @returns Array of random ints (0 to 255)
*/
async function getRandomValues(size) {
	return (await crypto).getRandomValues(new Uint8Array(size));
}
/** Generate cryptographically strong random string
* @param size The desired length of the string
* @returns The random string
*/
async function random(size) {
	const mask = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._~";
	const evenDistCutoff = Math.pow(2, 8) - Math.pow(2, 8) % 66;
	let result = "";
	while (result.length < size) {
		const randomBytes = await getRandomValues(size - result.length);
		for (const randomByte of randomBytes) if (randomByte < evenDistCutoff) result += mask[randomByte % 66];
	}
	return result;
}
/** Generate a PKCE challenge verifier
* @param length Length of the verifier
* @returns A random verifier `length` characters long
*/
async function generateVerifier(length) {
	return await random(length);
}
/** Generate a PKCE code challenge from a code verifier
* @param code_verifier
* @returns The base64 url encoded code challenge
*/
async function generateChallenge(code_verifier) {
	const buffer = await (await crypto).subtle.digest("SHA-256", new TextEncoder().encode(code_verifier));
	return btoa(String.fromCharCode(...new Uint8Array(buffer))).replace(/\//g, "_").replace(/\+/g, "-").replace(/=/g, "");
}
/** Generate a PKCE challenge pair
* @param length Length of the verifer (between 43-128). Defaults to 43.
* @returns PKCE challenge pair
*/
async function pkceChallenge(length) {
	if (!length) length = 43;
	if (length < 43 || length > 128) throw `Expected a length between 43 and 128. Received ${length}.`;
	const verifier = await generateVerifier(length);
	return {
		code_verifier: verifier,
		code_challenge: await generateChallenge(verifier)
	};
}
//#endregion
//#region node_modules/@modelcontextprotocol/sdk/dist/esm/shared/auth.js
/**
* Reusable URL validation that disallows javascript: scheme
*/
var SafeUrlSchema = url().superRefine((val, ctx) => {
	if (!URL.canParse(val)) {
		ctx.addIssue({
			code: ZodIssueCode.custom,
			message: "URL must be parseable",
			fatal: true
		});
		return NEVER;
	}
}).refine((url) => {
	const u = new URL(url);
	return u.protocol !== "javascript:" && u.protocol !== "data:" && u.protocol !== "vbscript:";
}, { message: "URL cannot use javascript:, data:, or vbscript: scheme" });
/**
* RFC 9728 OAuth Protected Resource Metadata
*/
var OAuthProtectedResourceMetadataSchema = looseObject({
	resource: string$1().url(),
	authorization_servers: array(SafeUrlSchema).optional(),
	jwks_uri: string$1().url().optional(),
	scopes_supported: array(string$1()).optional(),
	bearer_methods_supported: array(string$1()).optional(),
	resource_signing_alg_values_supported: array(string$1()).optional(),
	resource_name: string$1().optional(),
	resource_documentation: string$1().optional(),
	resource_policy_uri: string$1().url().optional(),
	resource_tos_uri: string$1().url().optional(),
	tls_client_certificate_bound_access_tokens: boolean$1().optional(),
	authorization_details_types_supported: array(string$1()).optional(),
	dpop_signing_alg_values_supported: array(string$1()).optional(),
	dpop_bound_access_tokens_required: boolean$1().optional()
});
/**
* RFC 8414 OAuth 2.0 Authorization Server Metadata
*/
var OAuthMetadataSchema = looseObject({
	issuer: string$1(),
	authorization_endpoint: SafeUrlSchema,
	token_endpoint: SafeUrlSchema,
	registration_endpoint: SafeUrlSchema.optional(),
	scopes_supported: array(string$1()).optional(),
	response_types_supported: array(string$1()),
	response_modes_supported: array(string$1()).optional(),
	grant_types_supported: array(string$1()).optional(),
	token_endpoint_auth_methods_supported: array(string$1()).optional(),
	token_endpoint_auth_signing_alg_values_supported: array(string$1()).optional(),
	service_documentation: SafeUrlSchema.optional(),
	revocation_endpoint: SafeUrlSchema.optional(),
	revocation_endpoint_auth_methods_supported: array(string$1()).optional(),
	revocation_endpoint_auth_signing_alg_values_supported: array(string$1()).optional(),
	introspection_endpoint: string$1().optional(),
	introspection_endpoint_auth_methods_supported: array(string$1()).optional(),
	introspection_endpoint_auth_signing_alg_values_supported: array(string$1()).optional(),
	code_challenge_methods_supported: array(string$1()).optional(),
	client_id_metadata_document_supported: boolean$1().optional()
});
/**
* OpenID Connect Discovery metadata that may include OAuth 2.0 fields
* This schema represents the real-world scenario where OIDC providers
* return a mix of OpenID Connect and OAuth 2.0 metadata fields
*/
var OpenIdProviderDiscoveryMetadataSchema = object({
	...looseObject({
		issuer: string$1(),
		authorization_endpoint: SafeUrlSchema,
		token_endpoint: SafeUrlSchema,
		userinfo_endpoint: SafeUrlSchema.optional(),
		jwks_uri: SafeUrlSchema,
		registration_endpoint: SafeUrlSchema.optional(),
		scopes_supported: array(string$1()).optional(),
		response_types_supported: array(string$1()),
		response_modes_supported: array(string$1()).optional(),
		grant_types_supported: array(string$1()).optional(),
		acr_values_supported: array(string$1()).optional(),
		subject_types_supported: array(string$1()),
		id_token_signing_alg_values_supported: array(string$1()),
		id_token_encryption_alg_values_supported: array(string$1()).optional(),
		id_token_encryption_enc_values_supported: array(string$1()).optional(),
		userinfo_signing_alg_values_supported: array(string$1()).optional(),
		userinfo_encryption_alg_values_supported: array(string$1()).optional(),
		userinfo_encryption_enc_values_supported: array(string$1()).optional(),
		request_object_signing_alg_values_supported: array(string$1()).optional(),
		request_object_encryption_alg_values_supported: array(string$1()).optional(),
		request_object_encryption_enc_values_supported: array(string$1()).optional(),
		token_endpoint_auth_methods_supported: array(string$1()).optional(),
		token_endpoint_auth_signing_alg_values_supported: array(string$1()).optional(),
		display_values_supported: array(string$1()).optional(),
		claim_types_supported: array(string$1()).optional(),
		claims_supported: array(string$1()).optional(),
		service_documentation: string$1().optional(),
		claims_locales_supported: array(string$1()).optional(),
		ui_locales_supported: array(string$1()).optional(),
		claims_parameter_supported: boolean$1().optional(),
		request_parameter_supported: boolean$1().optional(),
		request_uri_parameter_supported: boolean$1().optional(),
		require_request_uri_registration: boolean$1().optional(),
		op_policy_uri: SafeUrlSchema.optional(),
		op_tos_uri: SafeUrlSchema.optional(),
		client_id_metadata_document_supported: boolean$1().optional()
	}).shape,
	...OAuthMetadataSchema.pick({ code_challenge_methods_supported: true }).shape
});
/**
* OAuth 2.1 token response
*/
var OAuthTokensSchema = object({
	access_token: string$1(),
	id_token: string$1().optional(),
	token_type: string$1(),
	expires_in: number().optional(),
	scope: string$1().optional(),
	refresh_token: string$1().optional()
}).strip();
/**
* OAuth 2.1 error response
*/
var OAuthErrorResponseSchema = object({
	error: string$1(),
	error_description: string$1().optional(),
	error_uri: string$1().optional()
});
/**
* Optional version of SafeUrlSchema that allows empty string for retrocompatibility on tos_uri and logo_uri
*/
var OptionalSafeUrlSchema = SafeUrlSchema.optional().or(literal("").transform(() => void 0));
/**
* RFC 7591 OAuth 2.0 Dynamic Client Registration metadata
*/
var OAuthClientMetadataSchema = object({
	redirect_uris: array(SafeUrlSchema),
	token_endpoint_auth_method: string$1().optional(),
	grant_types: array(string$1()).optional(),
	response_types: array(string$1()).optional(),
	client_name: string$1().optional(),
	client_uri: SafeUrlSchema.optional(),
	logo_uri: OptionalSafeUrlSchema,
	scope: string$1().optional(),
	contacts: array(string$1()).optional(),
	tos_uri: OptionalSafeUrlSchema,
	policy_uri: string$1().optional(),
	jwks_uri: SafeUrlSchema.optional(),
	jwks: any().optional(),
	software_id: string$1().optional(),
	software_version: string$1().optional(),
	software_statement: string$1().optional()
}).strip();
/**
* RFC 7591 OAuth 2.0 Dynamic Client Registration client information
*/
var OAuthClientInformationSchema = object({
	client_id: string$1(),
	client_secret: string$1().optional(),
	client_id_issued_at: number$1().optional(),
	client_secret_expires_at: number$1().optional()
}).strip();
/**
* RFC 7591 OAuth 2.0 Dynamic Client Registration full response (client information plus metadata)
*/
var OAuthClientInformationFullSchema = OAuthClientMetadataSchema.merge(OAuthClientInformationSchema);
object({
	error: string$1(),
	error_description: string$1().optional()
}).strip();
object({
	token: string$1(),
	token_type_hint: string$1().optional()
}).strip();
//#endregion
//#region node_modules/@modelcontextprotocol/sdk/dist/esm/shared/auth-utils.js
/**
* Utilities for handling OAuth resource URIs.
*/
/**
* Converts a server URL to a resource URL by removing the fragment.
* RFC 8707 section 2 states that resource URIs "MUST NOT include a fragment component".
* Keeps everything else unchanged (scheme, domain, port, path, query).
*/
function resourceUrlFromServerUrl(url) {
	const resourceURL = typeof url === "string" ? new URL(url) : new URL(url.href);
	resourceURL.hash = "";
	return resourceURL;
}
/**
* Checks if a requested resource URL matches a configured resource URL.
* A requested resource matches if it has the same scheme, domain, port,
* and its path starts with the configured resource's path.
*
* @param requestedResource The resource URL being requested
* @param configuredResource The resource URL that has been configured
* @returns true if the requested resource matches the configured resource, false otherwise
*/
function checkResourceAllowed({ requestedResource, configuredResource }) {
	const requested = typeof requestedResource === "string" ? new URL(requestedResource) : new URL(requestedResource.href);
	const configured = typeof configuredResource === "string" ? new URL(configuredResource) : new URL(configuredResource.href);
	if (requested.origin !== configured.origin) return false;
	if (requested.pathname.length < configured.pathname.length) return false;
	const requestedPath = requested.pathname.endsWith("/") ? requested.pathname : requested.pathname + "/";
	const configuredPath = configured.pathname.endsWith("/") ? configured.pathname : configured.pathname + "/";
	return requestedPath.startsWith(configuredPath);
}
//#endregion
//#region node_modules/@modelcontextprotocol/sdk/dist/esm/server/auth/errors.js
/**
* Base class for all OAuth errors
*/
var OAuthError = class extends Error {
	constructor(message, errorUri) {
		super(message);
		this.errorUri = errorUri;
		this.name = this.constructor.name;
	}
	/**
	* Converts the error to a standard OAuth error response object
	*/
	toResponseObject() {
		const response = {
			error: this.errorCode,
			error_description: this.message
		};
		if (this.errorUri) response.error_uri = this.errorUri;
		return response;
	}
	get errorCode() {
		return this.constructor.errorCode;
	}
};
/**
* Invalid request error - The request is missing a required parameter,
* includes an invalid parameter value, includes a parameter more than once,
* or is otherwise malformed.
*/
var InvalidRequestError = class extends OAuthError {};
InvalidRequestError.errorCode = "invalid_request";
/**
* Invalid client error - Client authentication failed (e.g., unknown client, no client
* authentication included, or unsupported authentication method).
*/
var InvalidClientError = class extends OAuthError {};
InvalidClientError.errorCode = "invalid_client";
/**
* Invalid grant error - The provided authorization grant or refresh token is
* invalid, expired, revoked, does not match the redirection URI used in the
* authorization request, or was issued to another client.
*/
var InvalidGrantError = class extends OAuthError {};
InvalidGrantError.errorCode = "invalid_grant";
/**
* Unauthorized client error - The authenticated client is not authorized to use
* this authorization grant type.
*/
var UnauthorizedClientError = class extends OAuthError {};
UnauthorizedClientError.errorCode = "unauthorized_client";
/**
* Unsupported grant type error - The authorization grant type is not supported
* by the authorization server.
*/
var UnsupportedGrantTypeError = class extends OAuthError {};
UnsupportedGrantTypeError.errorCode = "unsupported_grant_type";
/**
* Invalid scope error - The requested scope is invalid, unknown, malformed, or
* exceeds the scope granted by the resource owner.
*/
var InvalidScopeError = class extends OAuthError {};
InvalidScopeError.errorCode = "invalid_scope";
/**
* Access denied error - The resource owner or authorization server denied the request.
*/
var AccessDeniedError = class extends OAuthError {};
AccessDeniedError.errorCode = "access_denied";
/**
* Server error - The authorization server encountered an unexpected condition
* that prevented it from fulfilling the request.
*/
var ServerError = class extends OAuthError {};
ServerError.errorCode = "server_error";
/**
* Temporarily unavailable error - The authorization server is currently unable to
* handle the request due to a temporary overloading or maintenance of the server.
*/
var TemporarilyUnavailableError = class extends OAuthError {};
TemporarilyUnavailableError.errorCode = "temporarily_unavailable";
/**
* Unsupported response type error - The authorization server does not support
* obtaining an authorization code using this method.
*/
var UnsupportedResponseTypeError = class extends OAuthError {};
UnsupportedResponseTypeError.errorCode = "unsupported_response_type";
/**
* Unsupported token type error - The authorization server does not support
* the requested token type.
*/
var UnsupportedTokenTypeError = class extends OAuthError {};
UnsupportedTokenTypeError.errorCode = "unsupported_token_type";
/**
* Invalid token error - The access token provided is expired, revoked, malformed,
* or invalid for other reasons.
*/
var InvalidTokenError = class extends OAuthError {};
InvalidTokenError.errorCode = "invalid_token";
/**
* Method not allowed error - The HTTP method used is not allowed for this endpoint.
* (Custom, non-standard error)
*/
var MethodNotAllowedError = class extends OAuthError {};
MethodNotAllowedError.errorCode = "method_not_allowed";
/**
* Too many requests error - Rate limit exceeded.
* (Custom, non-standard error based on RFC 6585)
*/
var TooManyRequestsError = class extends OAuthError {};
TooManyRequestsError.errorCode = "too_many_requests";
/**
* Invalid client metadata error - The client metadata is invalid.
* (Custom error for dynamic client registration - RFC 7591)
*/
var InvalidClientMetadataError = class extends OAuthError {};
InvalidClientMetadataError.errorCode = "invalid_client_metadata";
/**
* Insufficient scope error - The request requires higher privileges than provided by the access token.
*/
var InsufficientScopeError = class extends OAuthError {};
InsufficientScopeError.errorCode = "insufficient_scope";
/**
* Invalid target error - The requested resource is invalid, missing, unknown, or malformed.
* (Custom error for resource indicators - RFC 8707)
*/
var InvalidTargetError = class extends OAuthError {};
InvalidTargetError.errorCode = "invalid_target";
/**
* A full list of all OAuthErrors, enabling parsing from error responses
*/
var OAUTH_ERRORS = {
	[InvalidRequestError.errorCode]: InvalidRequestError,
	[InvalidClientError.errorCode]: InvalidClientError,
	[InvalidGrantError.errorCode]: InvalidGrantError,
	[UnauthorizedClientError.errorCode]: UnauthorizedClientError,
	[UnsupportedGrantTypeError.errorCode]: UnsupportedGrantTypeError,
	[InvalidScopeError.errorCode]: InvalidScopeError,
	[AccessDeniedError.errorCode]: AccessDeniedError,
	[ServerError.errorCode]: ServerError,
	[TemporarilyUnavailableError.errorCode]: TemporarilyUnavailableError,
	[UnsupportedResponseTypeError.errorCode]: UnsupportedResponseTypeError,
	[UnsupportedTokenTypeError.errorCode]: UnsupportedTokenTypeError,
	[InvalidTokenError.errorCode]: InvalidTokenError,
	[MethodNotAllowedError.errorCode]: MethodNotAllowedError,
	[TooManyRequestsError.errorCode]: TooManyRequestsError,
	[InvalidClientMetadataError.errorCode]: InvalidClientMetadataError,
	[InsufficientScopeError.errorCode]: InsufficientScopeError,
	[InvalidTargetError.errorCode]: InvalidTargetError
};
//#endregion
//#region node_modules/@modelcontextprotocol/sdk/dist/esm/client/auth.js
var UnauthorizedError = class extends Error {
	constructor(message) {
		super(message ?? "Unauthorized");
	}
};
function isClientAuthMethod(method) {
	return [
		"client_secret_basic",
		"client_secret_post",
		"none"
	].includes(method);
}
var AUTHORIZATION_CODE_RESPONSE_TYPE = "code";
var AUTHORIZATION_CODE_CHALLENGE_METHOD = "S256";
/**
* Determines the best client authentication method to use based on server support and client configuration.
*
* Priority order (highest to lowest):
* 1. client_secret_basic (if client secret is available)
* 2. client_secret_post (if client secret is available)
* 3. none (for public clients)
*
* @param clientInformation - OAuth client information containing credentials
* @param supportedMethods - Authentication methods supported by the authorization server
* @returns The selected authentication method
*/
function selectClientAuthMethod(clientInformation, supportedMethods) {
	const hasClientSecret = clientInformation.client_secret !== void 0;
	if ("token_endpoint_auth_method" in clientInformation && clientInformation.token_endpoint_auth_method && isClientAuthMethod(clientInformation.token_endpoint_auth_method) && (supportedMethods.length === 0 || supportedMethods.includes(clientInformation.token_endpoint_auth_method))) return clientInformation.token_endpoint_auth_method;
	if (supportedMethods.length === 0) return hasClientSecret ? "client_secret_basic" : "none";
	if (hasClientSecret && supportedMethods.includes("client_secret_basic")) return "client_secret_basic";
	if (hasClientSecret && supportedMethods.includes("client_secret_post")) return "client_secret_post";
	if (supportedMethods.includes("none")) return "none";
	return hasClientSecret ? "client_secret_post" : "none";
}
/**
* Applies client authentication to the request based on the specified method.
*
* Implements OAuth 2.1 client authentication methods:
* - client_secret_basic: HTTP Basic authentication (RFC 6749 Section 2.3.1)
* - client_secret_post: Credentials in request body (RFC 6749 Section 2.3.1)
* - none: Public client authentication (RFC 6749 Section 2.1)
*
* @param method - The authentication method to use
* @param clientInformation - OAuth client information containing credentials
* @param headers - HTTP headers object to modify
* @param params - URL search parameters to modify
* @throws {Error} When required credentials are missing
*/
function applyClientAuthentication(method, clientInformation, headers, params) {
	const { client_id, client_secret } = clientInformation;
	switch (method) {
		case "client_secret_basic":
			applyBasicAuth(client_id, client_secret, headers);
			return;
		case "client_secret_post":
			applyPostAuth(client_id, client_secret, params);
			return;
		case "none":
			applyPublicAuth(client_id, params);
			return;
		default: throw new Error(`Unsupported client authentication method: ${method}`);
	}
}
/**
* Applies HTTP Basic authentication (RFC 6749 Section 2.3.1)
*/
function applyBasicAuth(clientId, clientSecret, headers) {
	if (!clientSecret) throw new Error("client_secret_basic authentication requires a client_secret");
	const credentials = btoa(`${clientId}:${clientSecret}`);
	headers.set("Authorization", `Basic ${credentials}`);
}
/**
* Applies POST body authentication (RFC 6749 Section 2.3.1)
*/
function applyPostAuth(clientId, clientSecret, params) {
	params.set("client_id", clientId);
	if (clientSecret) params.set("client_secret", clientSecret);
}
/**
* Applies public client authentication (RFC 6749 Section 2.1)
*/
function applyPublicAuth(clientId, params) {
	params.set("client_id", clientId);
}
/**
* Parses an OAuth error response from a string or Response object.
*
* If the input is a standard OAuth2.0 error response, it will be parsed according to the spec
* and an instance of the appropriate OAuthError subclass will be returned.
* If parsing fails, it falls back to a generic ServerError that includes
* the response status (if available) and original content.
*
* @param input - A Response object or string containing the error response
* @returns A Promise that resolves to an OAuthError instance
*/
async function parseErrorResponse(input) {
	const statusCode = input instanceof Response ? input.status : void 0;
	const body = input instanceof Response ? await input.text() : input;
	try {
		const { error, error_description, error_uri } = OAuthErrorResponseSchema.parse(JSON.parse(body));
		return new (OAUTH_ERRORS[error] || ServerError)(error_description || "", error_uri);
	} catch (error) {
		return new ServerError(`${statusCode ? `HTTP ${statusCode}: ` : ""}Invalid OAuth error response: ${error}. Raw body: ${body}`);
	}
}
/**
* Orchestrates the full auth flow with a server.
*
* This can be used as a single entry point for all authorization functionality,
* instead of linking together the other lower-level functions in this module.
*/
async function auth(provider, options) {
	try {
		return await authInternal(provider, options);
	} catch (error) {
		if (error instanceof InvalidClientError || error instanceof UnauthorizedClientError) {
			await provider.invalidateCredentials?.("all");
			return await authInternal(provider, options);
		} else if (error instanceof InvalidGrantError) {
			await provider.invalidateCredentials?.("tokens");
			return await authInternal(provider, options);
		}
		throw error;
	}
}
async function authInternal(provider, { serverUrl, authorizationCode, scope, resourceMetadataUrl, fetchFn }) {
	const cachedState = await provider.discoveryState?.();
	let resourceMetadata;
	let authorizationServerUrl;
	let metadata;
	let effectiveResourceMetadataUrl = resourceMetadataUrl;
	if (!effectiveResourceMetadataUrl && cachedState?.resourceMetadataUrl) effectiveResourceMetadataUrl = new URL(cachedState.resourceMetadataUrl);
	if (cachedState?.authorizationServerUrl) {
		authorizationServerUrl = cachedState.authorizationServerUrl;
		resourceMetadata = cachedState.resourceMetadata;
		metadata = cachedState.authorizationServerMetadata ?? await discoverAuthorizationServerMetadata(authorizationServerUrl, { fetchFn });
		if (!resourceMetadata) try {
			resourceMetadata = await discoverOAuthProtectedResourceMetadata(serverUrl, { resourceMetadataUrl: effectiveResourceMetadataUrl }, fetchFn);
		} catch {}
		if (metadata !== cachedState.authorizationServerMetadata || resourceMetadata !== cachedState.resourceMetadata) await provider.saveDiscoveryState?.({
			authorizationServerUrl: String(authorizationServerUrl),
			resourceMetadataUrl: effectiveResourceMetadataUrl?.toString(),
			resourceMetadata,
			authorizationServerMetadata: metadata
		});
	} else {
		const serverInfo = await discoverOAuthServerInfo(serverUrl, {
			resourceMetadataUrl: effectiveResourceMetadataUrl,
			fetchFn
		});
		authorizationServerUrl = serverInfo.authorizationServerUrl;
		metadata = serverInfo.authorizationServerMetadata;
		resourceMetadata = serverInfo.resourceMetadata;
		await provider.saveDiscoveryState?.({
			authorizationServerUrl: String(authorizationServerUrl),
			resourceMetadataUrl: effectiveResourceMetadataUrl?.toString(),
			resourceMetadata,
			authorizationServerMetadata: metadata
		});
	}
	const resource = await selectResourceURL(serverUrl, provider, resourceMetadata);
	const resolvedScope = scope || resourceMetadata?.scopes_supported?.join(" ") || provider.clientMetadata.scope;
	let clientInformation = await Promise.resolve(provider.clientInformation());
	if (!clientInformation) {
		if (authorizationCode !== void 0) throw new Error("Existing OAuth client information is required when exchanging an authorization code");
		const supportsUrlBasedClientId = metadata?.client_id_metadata_document_supported === true;
		const clientMetadataUrl = provider.clientMetadataUrl;
		if (clientMetadataUrl && !isHttpsUrl(clientMetadataUrl)) throw new InvalidClientMetadataError(`clientMetadataUrl must be a valid HTTPS URL with a non-root pathname, got: ${clientMetadataUrl}`);
		if (supportsUrlBasedClientId && clientMetadataUrl) {
			clientInformation = { client_id: clientMetadataUrl };
			await provider.saveClientInformation?.(clientInformation);
		} else {
			if (!provider.saveClientInformation) throw new Error("OAuth client information must be saveable for dynamic registration");
			const fullInformation = await registerClient(authorizationServerUrl, {
				metadata,
				clientMetadata: provider.clientMetadata,
				scope: resolvedScope,
				fetchFn
			});
			await provider.saveClientInformation(fullInformation);
			clientInformation = fullInformation;
		}
	}
	const nonInteractiveFlow = !provider.redirectUrl;
	if (authorizationCode !== void 0 || nonInteractiveFlow) {
		const tokens = await fetchToken(provider, authorizationServerUrl, {
			metadata,
			resource,
			authorizationCode,
			fetchFn
		});
		await provider.saveTokens(tokens);
		return "AUTHORIZED";
	}
	const tokens = await provider.tokens();
	if (tokens?.refresh_token) try {
		const newTokens = await refreshAuthorization(authorizationServerUrl, {
			metadata,
			clientInformation,
			refreshToken: tokens.refresh_token,
			resource,
			addClientAuthentication: provider.addClientAuthentication,
			fetchFn
		});
		await provider.saveTokens(newTokens);
		return "AUTHORIZED";
	} catch (error) {
		if (!(error instanceof OAuthError) || error instanceof ServerError) {} else throw error;
	}
	const state = provider.state ? await provider.state() : void 0;
	const { authorizationUrl, codeVerifier } = await startAuthorization(authorizationServerUrl, {
		metadata,
		clientInformation,
		state,
		redirectUrl: provider.redirectUrl,
		scope: resolvedScope,
		resource
	});
	await provider.saveCodeVerifier(codeVerifier);
	await provider.redirectToAuthorization(authorizationUrl);
	return "REDIRECT";
}
/**
* SEP-991: URL-based Client IDs
* Validate that the client_id is a valid URL with https scheme
*/
function isHttpsUrl(value) {
	if (!value) return false;
	try {
		const url = new URL(value);
		return url.protocol === "https:" && url.pathname !== "/";
	} catch {
		return false;
	}
}
async function selectResourceURL(serverUrl, provider, resourceMetadata) {
	const defaultResource = resourceUrlFromServerUrl(serverUrl);
	if (provider.validateResourceURL) return await provider.validateResourceURL(defaultResource, resourceMetadata?.resource);
	if (!resourceMetadata) return;
	if (!checkResourceAllowed({
		requestedResource: defaultResource,
		configuredResource: resourceMetadata.resource
	})) throw new Error(`Protected resource ${resourceMetadata.resource} does not match expected ${defaultResource} (or origin)`);
	return new URL(resourceMetadata.resource);
}
/**
* Extract resource_metadata, scope, and error from WWW-Authenticate header.
*/
function extractWWWAuthenticateParams(res) {
	const authenticateHeader = res.headers.get("WWW-Authenticate");
	if (!authenticateHeader) return {};
	const [type, scheme] = authenticateHeader.split(" ");
	if (type.toLowerCase() !== "bearer" || !scheme) return {};
	const resourceMetadataMatch = extractFieldFromWwwAuth(res, "resource_metadata") || void 0;
	let resourceMetadataUrl;
	if (resourceMetadataMatch) try {
		resourceMetadataUrl = new URL(resourceMetadataMatch);
	} catch {}
	const scope = extractFieldFromWwwAuth(res, "scope") || void 0;
	const error = extractFieldFromWwwAuth(res, "error") || void 0;
	return {
		resourceMetadataUrl,
		scope,
		error
	};
}
/**
* Extracts a specific field's value from the WWW-Authenticate header string.
*
* @param response The HTTP response object containing the headers.
* @param fieldName The name of the field to extract (e.g., "realm", "nonce").
* @returns The field value
*/
function extractFieldFromWwwAuth(response, fieldName) {
	const wwwAuthHeader = response.headers.get("WWW-Authenticate");
	if (!wwwAuthHeader) return null;
	const pattern = new RegExp(`${fieldName}=(?:"([^"]+)"|([^\\s,]+))`);
	const match = wwwAuthHeader.match(pattern);
	if (match) return match[1] || match[2];
	return null;
}
/**
* Looks up RFC 9728 OAuth 2.0 Protected Resource Metadata.
*
* If the server returns a 404 for the well-known endpoint, this function will
* return `undefined`. Any other errors will be thrown as exceptions.
*/
async function discoverOAuthProtectedResourceMetadata(serverUrl, opts, fetchFn = fetch) {
	const response = await discoverMetadataWithFallback(serverUrl, "oauth-protected-resource", fetchFn, {
		protocolVersion: opts?.protocolVersion,
		metadataUrl: opts?.resourceMetadataUrl
	});
	if (!response || response.status === 404) {
		await response?.body?.cancel();
		throw new Error(`Resource server does not implement OAuth 2.0 Protected Resource Metadata.`);
	}
	if (!response.ok) {
		await response.body?.cancel();
		throw new Error(`HTTP ${response.status} trying to load well-known OAuth protected resource metadata.`);
	}
	return OAuthProtectedResourceMetadataSchema.parse(await response.json());
}
/**
* Helper function to handle fetch with CORS retry logic
*/
async function fetchWithCorsRetry(url, headers, fetchFn = fetch) {
	try {
		return await fetchFn(url, { headers });
	} catch (error) {
		if (error instanceof TypeError) if (headers) return fetchWithCorsRetry(url, void 0, fetchFn);
		else return;
		throw error;
	}
}
/**
* Constructs the well-known path for auth-related metadata discovery
*/
function buildWellKnownPath(wellKnownPrefix, pathname = "", options = {}) {
	if (pathname.endsWith("/")) pathname = pathname.slice(0, -1);
	return options.prependPathname ? `${pathname}/.well-known/${wellKnownPrefix}` : `/.well-known/${wellKnownPrefix}${pathname}`;
}
/**
* Tries to discover OAuth metadata at a specific URL
*/
async function tryMetadataDiscovery(url, protocolVersion, fetchFn = fetch) {
	return await fetchWithCorsRetry(url, { "MCP-Protocol-Version": protocolVersion }, fetchFn);
}
/**
* Determines if fallback to root discovery should be attempted
*/
function shouldAttemptFallback(response, pathname) {
	return !response || response.status >= 400 && response.status < 500 && pathname !== "/";
}
/**
* Generic function for discovering OAuth metadata with fallback support
*/
async function discoverMetadataWithFallback(serverUrl, wellKnownType, fetchFn, opts) {
	const issuer = new URL(serverUrl);
	const protocolVersion = opts?.protocolVersion ?? "2025-11-25";
	let url;
	if (opts?.metadataUrl) url = new URL(opts.metadataUrl);
	else {
		const wellKnownPath = buildWellKnownPath(wellKnownType, issuer.pathname);
		url = new URL(wellKnownPath, opts?.metadataServerUrl ?? issuer);
		url.search = issuer.search;
	}
	let response = await tryMetadataDiscovery(url, protocolVersion, fetchFn);
	if (!opts?.metadataUrl && shouldAttemptFallback(response, issuer.pathname)) response = await tryMetadataDiscovery(new URL(`/.well-known/${wellKnownType}`, issuer), protocolVersion, fetchFn);
	return response;
}
/**
* Builds a list of discovery URLs to try for authorization server metadata.
* URLs are returned in priority order:
* 1. OAuth metadata at the given URL
* 2. OIDC metadata endpoints at the given URL
*/
function buildDiscoveryUrls(authorizationServerUrl) {
	const url = typeof authorizationServerUrl === "string" ? new URL(authorizationServerUrl) : authorizationServerUrl;
	const hasPath = url.pathname !== "/";
	const urlsToTry = [];
	if (!hasPath) {
		urlsToTry.push({
			url: new URL("/.well-known/oauth-authorization-server", url.origin),
			type: "oauth"
		});
		urlsToTry.push({
			url: new URL(`/.well-known/openid-configuration`, url.origin),
			type: "oidc"
		});
		return urlsToTry;
	}
	let pathname = url.pathname;
	if (pathname.endsWith("/")) pathname = pathname.slice(0, -1);
	urlsToTry.push({
		url: new URL(`/.well-known/oauth-authorization-server${pathname}`, url.origin),
		type: "oauth"
	});
	urlsToTry.push({
		url: new URL(`/.well-known/openid-configuration${pathname}`, url.origin),
		type: "oidc"
	});
	urlsToTry.push({
		url: new URL(`${pathname}/.well-known/openid-configuration`, url.origin),
		type: "oidc"
	});
	return urlsToTry;
}
/**
* Discovers authorization server metadata with support for RFC 8414 OAuth 2.0 Authorization Server Metadata
* and OpenID Connect Discovery 1.0 specifications.
*
* This function implements a fallback strategy for authorization server discovery:
* 1. Attempts RFC 8414 OAuth metadata discovery first
* 2. If OAuth discovery fails, falls back to OpenID Connect Discovery
*
* @param authorizationServerUrl - The authorization server URL obtained from the MCP Server's
*                                 protected resource metadata, or the MCP server's URL if the
*                                 metadata was not found.
* @param options - Configuration options
* @param options.fetchFn - Optional fetch function for making HTTP requests, defaults to global fetch
* @param options.protocolVersion - MCP protocol version to use, defaults to LATEST_PROTOCOL_VERSION
* @returns Promise resolving to authorization server metadata, or undefined if discovery fails
*/
async function discoverAuthorizationServerMetadata(authorizationServerUrl, { fetchFn = fetch, protocolVersion = LATEST_PROTOCOL_VERSION } = {}) {
	const headers = {
		"MCP-Protocol-Version": protocolVersion,
		Accept: "application/json"
	};
	const urlsToTry = buildDiscoveryUrls(authorizationServerUrl);
	for (const { url: endpointUrl, type } of urlsToTry) {
		const response = await fetchWithCorsRetry(endpointUrl, headers, fetchFn);
		if (!response)
 /**
		* CORS error occurred - don't throw as the endpoint may not allow CORS,
		* continue trying other possible endpoints
		*/
		continue;
		if (!response.ok) {
			await response.body?.cancel();
			if (response.status >= 400 && response.status < 500) continue;
			throw new Error(`HTTP ${response.status} trying to load ${type === "oauth" ? "OAuth" : "OpenID provider"} metadata from ${endpointUrl}`);
		}
		if (type === "oauth") return OAuthMetadataSchema.parse(await response.json());
		else return OpenIdProviderDiscoveryMetadataSchema.parse(await response.json());
	}
}
/**
* Discovers the authorization server for an MCP server following
* {@link https://datatracker.ietf.org/doc/html/rfc9728 | RFC 9728} (OAuth 2.0 Protected
* Resource Metadata), with fallback to treating the server URL as the
* authorization server.
*
* This function combines two discovery steps into one call:
* 1. Probes `/.well-known/oauth-protected-resource` on the MCP server to find the
*    authorization server URL (RFC 9728).
* 2. Fetches authorization server metadata from that URL (RFC 8414 / OpenID Connect Discovery).
*
* Use this when you need the authorization server metadata for operations outside the
* {@linkcode auth} orchestrator, such as token refresh or token revocation.
*
* @param serverUrl - The MCP resource server URL
* @param opts - Optional configuration
* @param opts.resourceMetadataUrl - Override URL for the protected resource metadata endpoint
* @param opts.fetchFn - Custom fetch function for HTTP requests
* @returns Authorization server URL, metadata, and resource metadata (if available)
*/
async function discoverOAuthServerInfo(serverUrl, opts) {
	let resourceMetadata;
	let authorizationServerUrl;
	try {
		resourceMetadata = await discoverOAuthProtectedResourceMetadata(serverUrl, { resourceMetadataUrl: opts?.resourceMetadataUrl }, opts?.fetchFn);
		if (resourceMetadata.authorization_servers && resourceMetadata.authorization_servers.length > 0) authorizationServerUrl = resourceMetadata.authorization_servers[0];
	} catch {}
	if (!authorizationServerUrl) authorizationServerUrl = String(new URL("/", serverUrl));
	const authorizationServerMetadata = await discoverAuthorizationServerMetadata(authorizationServerUrl, { fetchFn: opts?.fetchFn });
	return {
		authorizationServerUrl,
		authorizationServerMetadata,
		resourceMetadata
	};
}
/**
* Begins the authorization flow with the given server, by generating a PKCE challenge and constructing the authorization URL.
*/
async function startAuthorization(authorizationServerUrl, { metadata, clientInformation, redirectUrl, scope, state, resource }) {
	let authorizationUrl;
	if (metadata) {
		authorizationUrl = new URL(metadata.authorization_endpoint);
		if (!metadata.response_types_supported.includes(AUTHORIZATION_CODE_RESPONSE_TYPE)) throw new Error(`Incompatible auth server: does not support response type ${AUTHORIZATION_CODE_RESPONSE_TYPE}`);
		if (metadata.code_challenge_methods_supported && !metadata.code_challenge_methods_supported.includes(AUTHORIZATION_CODE_CHALLENGE_METHOD)) throw new Error(`Incompatible auth server: does not support code challenge method ${AUTHORIZATION_CODE_CHALLENGE_METHOD}`);
	} else authorizationUrl = new URL("/authorize", authorizationServerUrl);
	const challenge = await pkceChallenge();
	const codeVerifier = challenge.code_verifier;
	const codeChallenge = challenge.code_challenge;
	authorizationUrl.searchParams.set("response_type", AUTHORIZATION_CODE_RESPONSE_TYPE);
	authorizationUrl.searchParams.set("client_id", clientInformation.client_id);
	authorizationUrl.searchParams.set("code_challenge", codeChallenge);
	authorizationUrl.searchParams.set("code_challenge_method", AUTHORIZATION_CODE_CHALLENGE_METHOD);
	authorizationUrl.searchParams.set("redirect_uri", String(redirectUrl));
	if (state) authorizationUrl.searchParams.set("state", state);
	if (scope) authorizationUrl.searchParams.set("scope", scope);
	if (scope?.includes("offline_access")) authorizationUrl.searchParams.append("prompt", "consent");
	if (resource) authorizationUrl.searchParams.set("resource", resource.href);
	return {
		authorizationUrl,
		codeVerifier
	};
}
/**
* Prepares token request parameters for an authorization code exchange.
*
* This is the default implementation used by fetchToken when the provider
* doesn't implement prepareTokenRequest.
*
* @param authorizationCode - The authorization code received from the authorization endpoint
* @param codeVerifier - The PKCE code verifier
* @param redirectUri - The redirect URI used in the authorization request
* @returns URLSearchParams for the authorization_code grant
*/
function prepareAuthorizationCodeRequest(authorizationCode, codeVerifier, redirectUri) {
	return new URLSearchParams({
		grant_type: "authorization_code",
		code: authorizationCode,
		code_verifier: codeVerifier,
		redirect_uri: String(redirectUri)
	});
}
/**
* Internal helper to execute a token request with the given parameters.
* Used by exchangeAuthorization, refreshAuthorization, and fetchToken.
*/
async function executeTokenRequest(authorizationServerUrl, { metadata, tokenRequestParams, clientInformation, addClientAuthentication, resource, fetchFn }) {
	const tokenUrl = metadata?.token_endpoint ? new URL(metadata.token_endpoint) : new URL("/token", authorizationServerUrl);
	const headers = new Headers({
		"Content-Type": "application/x-www-form-urlencoded",
		Accept: "application/json"
	});
	if (resource) tokenRequestParams.set("resource", resource.href);
	if (addClientAuthentication) await addClientAuthentication(headers, tokenRequestParams, tokenUrl, metadata);
	else if (clientInformation) applyClientAuthentication(selectClientAuthMethod(clientInformation, metadata?.token_endpoint_auth_methods_supported ?? []), clientInformation, headers, tokenRequestParams);
	const response = await (fetchFn ?? fetch)(tokenUrl, {
		method: "POST",
		headers,
		body: tokenRequestParams
	});
	if (!response.ok) throw await parseErrorResponse(response);
	return OAuthTokensSchema.parse(await response.json());
}
/**
* Exchange a refresh token for an updated access token.
*
* Supports multiple client authentication methods as specified in OAuth 2.1:
* - Automatically selects the best authentication method based on server support
* - Preserves the original refresh token if a new one is not returned
*
* @param authorizationServerUrl - The authorization server's base URL
* @param options - Configuration object containing client info, refresh token, etc.
* @returns Promise resolving to OAuth tokens (preserves original refresh_token if not replaced)
* @throws {Error} When token refresh fails or authentication is invalid
*/
async function refreshAuthorization(authorizationServerUrl, { metadata, clientInformation, refreshToken, resource, addClientAuthentication, fetchFn }) {
	return {
		refresh_token: refreshToken,
		...await executeTokenRequest(authorizationServerUrl, {
			metadata,
			tokenRequestParams: new URLSearchParams({
				grant_type: "refresh_token",
				refresh_token: refreshToken
			}),
			clientInformation,
			addClientAuthentication,
			resource,
			fetchFn
		})
	};
}
/**
* Unified token fetching that works with any grant type via provider.prepareTokenRequest().
*
* This function provides a single entry point for obtaining tokens regardless of the
* OAuth grant type. The provider's prepareTokenRequest() method determines which grant
* to use and supplies the grant-specific parameters.
*
* @param provider - OAuth client provider that implements prepareTokenRequest()
* @param authorizationServerUrl - The authorization server's base URL
* @param options - Configuration for the token request
* @returns Promise resolving to OAuth tokens
* @throws {Error} When provider doesn't implement prepareTokenRequest or token fetch fails
*
* @example
* // Provider for client_credentials:
* class MyProvider implements OAuthClientProvider {
*   prepareTokenRequest(scope) {
*     const params = new URLSearchParams({ grant_type: 'client_credentials' });
*     if (scope) params.set('scope', scope);
*     return params;
*   }
*   // ... other methods
* }
*
* const tokens = await fetchToken(provider, authServerUrl, { metadata });
*/
async function fetchToken(provider, authorizationServerUrl, { metadata, resource, authorizationCode, fetchFn } = {}) {
	const scope = provider.clientMetadata.scope;
	let tokenRequestParams;
	if (provider.prepareTokenRequest) tokenRequestParams = await provider.prepareTokenRequest(scope);
	if (!tokenRequestParams) {
		if (!authorizationCode) throw new Error("Either provider.prepareTokenRequest() or authorizationCode is required");
		if (!provider.redirectUrl) throw new Error("redirectUrl is required for authorization_code flow");
		tokenRequestParams = prepareAuthorizationCodeRequest(authorizationCode, await provider.codeVerifier(), provider.redirectUrl);
	}
	const clientInformation = await provider.clientInformation();
	return executeTokenRequest(authorizationServerUrl, {
		metadata,
		tokenRequestParams,
		clientInformation: clientInformation ?? void 0,
		addClientAuthentication: provider.addClientAuthentication,
		resource,
		fetchFn
	});
}
/**
* Performs OAuth 2.0 Dynamic Client Registration according to RFC 7591.
*
* If `scope` is provided, it overrides `clientMetadata.scope` in the registration
* request body. This allows callers to apply the Scope Selection Strategy (SEP-835)
* consistently across both DCR and the subsequent authorization request.
*/
async function registerClient(authorizationServerUrl, { metadata, clientMetadata, scope, fetchFn }) {
	let registrationUrl;
	if (metadata) {
		if (!metadata.registration_endpoint) throw new Error("Incompatible auth server: does not support dynamic client registration");
		registrationUrl = new URL(metadata.registration_endpoint);
	} else registrationUrl = new URL("/register", authorizationServerUrl);
	const response = await (fetchFn ?? fetch)(registrationUrl, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			...clientMetadata,
			...scope !== void 0 ? { scope } : {}
		})
	});
	if (!response.ok) throw await parseErrorResponse(response);
	return OAuthClientInformationFullSchema.parse(await response.json());
}
//#endregion
//#region node_modules/@modelcontextprotocol/sdk/dist/esm/client/sse.js
var SseError = class extends Error {
	constructor(code, message, event) {
		super(`SSE error: ${message}`);
		this.code = code;
		this.event = event;
	}
};
/**
* Client transport for SSE: this will connect to a server using Server-Sent Events for receiving
* messages and make separate POST requests for sending messages.
* @deprecated SSEClientTransport is deprecated. Prefer to use StreamableHTTPClientTransport where possible instead. Note that because some servers are still using SSE, clients may need to support both transports during the migration period.
*/
var SSEClientTransport = class {
	constructor(url, opts) {
		this._url = url;
		this._resourceMetadataUrl = void 0;
		this._scope = void 0;
		this._eventSourceInit = opts?.eventSourceInit;
		this._requestInit = opts?.requestInit;
		this._authProvider = opts?.authProvider;
		this._fetch = opts?.fetch;
		this._fetchWithInit = createFetchWithInit(opts?.fetch, opts?.requestInit);
	}
	async _authThenStart() {
		if (!this._authProvider) throw new UnauthorizedError("No auth provider");
		let result;
		try {
			result = await auth(this._authProvider, {
				serverUrl: this._url,
				resourceMetadataUrl: this._resourceMetadataUrl,
				scope: this._scope,
				fetchFn: this._fetchWithInit
			});
		} catch (error) {
			this.onerror?.(error);
			throw error;
		}
		if (result !== "AUTHORIZED") throw new UnauthorizedError();
		return await this._startOrAuth();
	}
	async _commonHeaders() {
		const headers = {};
		if (this._authProvider) {
			const tokens = await this._authProvider.tokens();
			if (tokens) headers["Authorization"] = `Bearer ${tokens.access_token}`;
		}
		if (this._protocolVersion) headers["mcp-protocol-version"] = this._protocolVersion;
		const extraHeaders = normalizeHeaders(this._requestInit?.headers);
		return new Headers({
			...headers,
			...extraHeaders
		});
	}
	_startOrAuth() {
		const fetchImpl = this?._eventSourceInit?.fetch ?? this._fetch ?? fetch;
		return new Promise((resolve, reject) => {
			this._eventSource = new EventSource(this._url.href, {
				...this._eventSourceInit,
				fetch: async (url, init) => {
					const headers = await this._commonHeaders();
					headers.set("Accept", "text/event-stream");
					const response = await fetchImpl(url, {
						...init,
						headers
					});
					if (response.status === 401 && response.headers.has("www-authenticate")) {
						const { resourceMetadataUrl, scope } = extractWWWAuthenticateParams(response);
						this._resourceMetadataUrl = resourceMetadataUrl;
						this._scope = scope;
					}
					return response;
				}
			});
			this._abortController = new AbortController();
			this._eventSource.onerror = (event) => {
				if (event.code === 401 && this._authProvider) {
					this._authThenStart().then(resolve, reject);
					return;
				}
				const error = new SseError(event.code, event.message, event);
				reject(error);
				this.onerror?.(error);
			};
			this._eventSource.onopen = () => {};
			this._eventSource.addEventListener("endpoint", (event) => {
				const messageEvent = event;
				try {
					this._endpoint = new URL(messageEvent.data, this._url);
					if (this._endpoint.origin !== this._url.origin) throw new Error(`Endpoint origin does not match connection origin: ${this._endpoint.origin}`);
				} catch (error) {
					reject(error);
					this.onerror?.(error);
					this.close();
					return;
				}
				resolve();
			});
			this._eventSource.onmessage = (event) => {
				const messageEvent = event;
				let message;
				try {
					message = JSONRPCMessageSchema.parse(JSON.parse(messageEvent.data));
				} catch (error) {
					this.onerror?.(error);
					return;
				}
				this.onmessage?.(message);
			};
		});
	}
	async start() {
		if (this._eventSource) throw new Error("SSEClientTransport already started! If using Client class, note that connect() calls start() automatically.");
		return await this._startOrAuth();
	}
	/**
	* Call this method after the user has finished authorizing via their user agent and is redirected back to the MCP client application. This will exchange the authorization code for an access token, enabling the next connection attempt to successfully auth.
	*/
	async finishAuth(authorizationCode) {
		if (!this._authProvider) throw new UnauthorizedError("No auth provider");
		if (await auth(this._authProvider, {
			serverUrl: this._url,
			authorizationCode,
			resourceMetadataUrl: this._resourceMetadataUrl,
			scope: this._scope,
			fetchFn: this._fetchWithInit
		}) !== "AUTHORIZED") throw new UnauthorizedError("Failed to authorize");
	}
	async close() {
		this._abortController?.abort();
		this._eventSource?.close();
		this.onclose?.();
	}
	async send(message) {
		if (!this._endpoint) throw new Error("Not connected");
		try {
			const headers = await this._commonHeaders();
			headers.set("content-type", "application/json");
			const init = {
				...this._requestInit,
				method: "POST",
				headers,
				body: JSON.stringify(message),
				signal: this._abortController?.signal
			};
			const response = await (this._fetch ?? fetch)(this._endpoint, init);
			if (!response.ok) {
				const text = await response.text().catch(() => null);
				if (response.status === 401 && this._authProvider) {
					const { resourceMetadataUrl, scope } = extractWWWAuthenticateParams(response);
					this._resourceMetadataUrl = resourceMetadataUrl;
					this._scope = scope;
					if (await auth(this._authProvider, {
						serverUrl: this._url,
						resourceMetadataUrl: this._resourceMetadataUrl,
						scope: this._scope,
						fetchFn: this._fetchWithInit
					}) !== "AUTHORIZED") throw new UnauthorizedError();
					return this.send(message);
				}
				throw new Error(`Error POSTing to endpoint (HTTP ${response.status}): ${text}`);
			}
			await response.body?.cancel();
		} catch (error) {
			this.onerror?.(error);
			throw error;
		}
	}
	setProtocolVersion(version) {
		this._protocolVersion = version;
	}
};
/*!
* content-type
* Copyright(c) 2015 Douglas Christopher Wilson
* MIT Licensed
*/
//#endregion
//#region node_modules/@modelcontextprotocol/sdk/dist/esm/shared/mediaType.js
var import_content_type = /* @__PURE__ */ __toESM((/* @__PURE__ */ __commonJSMin(((exports) => {
	/**
	* RegExp to match *( ";" parameter ) in RFC 7231 sec 3.1.1.1
	*
	* parameter     = token "=" ( token / quoted-string )
	* token         = 1*tchar
	* tchar         = "!" / "#" / "$" / "%" / "&" / "'" / "*"
	*               / "+" / "-" / "." / "^" / "_" / "`" / "|" / "~"
	*               / DIGIT / ALPHA
	*               ; any VCHAR, except delimiters
	* quoted-string = DQUOTE *( qdtext / quoted-pair ) DQUOTE
	* qdtext        = HTAB / SP / %x21 / %x23-5B / %x5D-7E / obs-text
	* obs-text      = %x80-FF
	* quoted-pair   = "\" ( HTAB / SP / VCHAR / obs-text )
	*/
	var PARAM_REGEXP = /; *([!#$%&'*+.^_`|~0-9A-Za-z-]+) *= *("(?:[\u000b\u0020\u0021\u0023-\u005b\u005d-\u007e\u0080-\u00ff]|\\[\u000b\u0020-\u00ff])*"|[!#$%&'*+.^_`|~0-9A-Za-z-]+) */g;
	/**
	* RegExp to match quoted-pair in RFC 7230 sec 3.2.6
	*
	* quoted-pair = "\" ( HTAB / SP / VCHAR / obs-text )
	* obs-text    = %x80-FF
	*/
	var QESC_REGEXP = /\\([\u000b\u0020-\u00ff])/g;
	/**
	* RegExp to match type in RFC 7231 sec 3.1.1.1
	*
	* media-type = type "/" subtype
	* type       = token
	* subtype    = token
	*/
	var TYPE_REGEXP = /^[!#$%&'*+.^_`|~0-9A-Za-z-]+\/[!#$%&'*+.^_`|~0-9A-Za-z-]+$/;
	exports.parse = parse;
	/**
	* Parse media type to object.
	*
	* @param {string|object} string
	* @return {Object}
	* @public
	*/
	function parse(string) {
		if (!string) throw new TypeError("argument string is required");
		var header = typeof string === "object" ? getcontenttype(string) : string;
		if (typeof header !== "string") throw new TypeError("argument string is required to be a string");
		var index = header.indexOf(";");
		var type = index !== -1 ? header.slice(0, index).trim() : header.trim();
		if (!TYPE_REGEXP.test(type)) throw new TypeError("invalid media type");
		var obj = new ContentType(type.toLowerCase());
		if (index !== -1) {
			var key;
			var match;
			var value;
			PARAM_REGEXP.lastIndex = index;
			while (match = PARAM_REGEXP.exec(header)) {
				if (match.index !== index) throw new TypeError("invalid parameter format");
				index += match[0].length;
				key = match[1].toLowerCase();
				value = match[2];
				if (value.charCodeAt(0) === 34) {
					value = value.slice(1, -1);
					if (value.indexOf("\\") !== -1) value = value.replace(QESC_REGEXP, "$1");
				}
				obj.parameters[key] = value;
			}
			if (index !== header.length) throw new TypeError("invalid parameter format");
		}
		return obj;
	}
	/**
	* Get content-type from req/res objects.
	*
	* @param {object}
	* @return {Object}
	* @private
	*/
	function getcontenttype(obj) {
		var header;
		if (typeof obj.getHeader === "function") header = obj.getHeader("content-type");
		else if (typeof obj.headers === "object") header = obj.headers && obj.headers["content-type"];
		if (typeof header !== "string") throw new TypeError("content-type header is missing from object");
		return header;
	}
	/**
	* Class to represent a content type.
	* @private
	*/
	function ContentType(type) {
		this.parameters = Object.create(null);
		this.type = type;
	}
})))(), 1);
/**
* Extracts the media type (the lowercased `type/subtype` pair, without
* parameters) from a raw `Content-Type` header value, or `undefined` when the
* header is missing or empty.
*
* Content-Type comparisons must use the parsed media type, never a substring
* search of the raw header: a value like `text/plain; a=application/json`
* contains the substring `application/json` but its media type is
* `text/plain`, and case variants or parameters make naive string comparison
* wrong in both directions.
*
* "Essence" is the WHATWG MIME Sniffing standard's term for the bare
* `type/subtype` pair (https://mimesniff.spec.whatwg.org/#mime-type-essence);
* the Fetch standard's request classification is defined against it
* (https://fetch.spec.whatwg.org/#cors-safelisted-request-header).
*
* Parsing is RFC 9110 (`content-type` package) first. When the parameter
* section is malformed (`application/json;`, `application/json; charset=`),
* browsers and most HTTP stacks still derive the media type from the segment
* before the first `;` — the fallback matches that widely-implemented
* behavior, so a header whose media type is unambiguous is not rejected for
* a sloppy parameter section.
*/
function mediaTypeEssence(header) {
	if (!header) return;
	try {
		return import_content_type.parse(header).type;
	} catch {
		const essence = (header.split(";", 1)[0] ?? "").trim().toLowerCase();
		if (essence === "" || header.slice(essence.length).includes(",")) return;
		return essence;
	}
}
//#endregion
//#region node_modules/eventsource-parser/dist/stream.js
var EventSourceParserStream = class extends TransformStream {
	constructor({ onError, onRetry, onComment, maxBufferSize } = {}) {
		let parser;
		super({
			start(controller) {
				parser = createParser({
					onEvent: (event) => {
						controller.enqueue(event);
					},
					onError(error) {
						typeof onError == "function" && onError(error), (onError === "terminate" || error.type === "max-buffer-size-exceeded") && controller.error(error);
					},
					onRetry,
					onComment,
					maxBufferSize
				});
			},
			transform(chunk) {
				parser.feed(chunk);
			}
		});
	}
};
//#endregion
//#region node_modules/@modelcontextprotocol/sdk/dist/esm/client/streamableHttp.js
var DEFAULT_STREAMABLE_HTTP_RECONNECTION_OPTIONS = {
	initialReconnectionDelay: 1e3,
	maxReconnectionDelay: 3e4,
	reconnectionDelayGrowFactor: 1.5,
	maxRetries: 2
};
var StreamableHTTPError = class extends Error {
	constructor(code, message) {
		super(`Streamable HTTP error: ${message}`);
		this.code = code;
	}
};
/**
* Client transport for Streamable HTTP: this implements the MCP Streamable HTTP transport specification.
* It will connect to a server using HTTP POST for sending messages and HTTP GET with Server-Sent Events
* for receiving messages.
*/
var StreamableHTTPClientTransport = class {
	constructor(url, opts) {
		this._hasCompletedAuthFlow = false;
		this._url = url;
		this._resourceMetadataUrl = void 0;
		this._scope = void 0;
		this._requestInit = opts?.requestInit;
		this._authProvider = opts?.authProvider;
		this._fetch = opts?.fetch;
		this._fetchWithInit = createFetchWithInit(opts?.fetch, opts?.requestInit);
		this._sessionId = opts?.sessionId;
		this._reconnectionOptions = opts?.reconnectionOptions ?? DEFAULT_STREAMABLE_HTTP_RECONNECTION_OPTIONS;
	}
	async _authThenStart() {
		if (!this._authProvider) throw new UnauthorizedError("No auth provider");
		let result;
		try {
			result = await auth(this._authProvider, {
				serverUrl: this._url,
				resourceMetadataUrl: this._resourceMetadataUrl,
				scope: this._scope,
				fetchFn: this._fetchWithInit
			});
		} catch (error) {
			this.onerror?.(error);
			throw error;
		}
		if (result !== "AUTHORIZED") throw new UnauthorizedError();
		return await this._startOrAuthSse({ resumptionToken: void 0 });
	}
	async _commonHeaders() {
		const headers = {};
		if (this._authProvider) {
			const tokens = await this._authProvider.tokens();
			if (tokens) headers["Authorization"] = `Bearer ${tokens.access_token}`;
		}
		if (this._sessionId) headers["mcp-session-id"] = this._sessionId;
		if (this._protocolVersion) headers["mcp-protocol-version"] = this._protocolVersion;
		const extraHeaders = normalizeHeaders(this._requestInit?.headers);
		return new Headers({
			...headers,
			...extraHeaders
		});
	}
	async _startOrAuthSse(options) {
		const { resumptionToken } = options;
		try {
			const headers = await this._commonHeaders();
			headers.set("Accept", "text/event-stream");
			if (resumptionToken) headers.set("last-event-id", resumptionToken);
			const response = await (this._fetch ?? fetch)(this._url, {
				method: "GET",
				headers,
				signal: this._abortController?.signal
			});
			if (!response.ok) {
				await response.body?.cancel();
				if (response.status === 401 && this._authProvider) return await this._authThenStart();
				if (response.status === 405) return;
				throw new StreamableHTTPError(response.status, `Failed to open SSE stream: ${response.statusText}`);
			}
			this._handleSseStream(response.body, options, true);
		} catch (error) {
			this.onerror?.(error);
			throw error;
		}
	}
	/**
	* Calculates the next reconnection delay using  backoff algorithm
	*
	* @param attempt Current reconnection attempt count for the specific stream
	* @returns Time to wait in milliseconds before next reconnection attempt
	*/
	_getNextReconnectionDelay(attempt) {
		if (this._serverRetryMs !== void 0) return this._serverRetryMs;
		const initialDelay = this._reconnectionOptions.initialReconnectionDelay;
		const growFactor = this._reconnectionOptions.reconnectionDelayGrowFactor;
		const maxDelay = this._reconnectionOptions.maxReconnectionDelay;
		return Math.min(initialDelay * Math.pow(growFactor, attempt), maxDelay);
	}
	/**
	* Schedule a reconnection attempt using server-provided retry interval or backoff
	*
	* @param lastEventId The ID of the last received event for resumability
	* @param attemptCount Current reconnection attempt count for this specific stream
	*/
	_scheduleReconnection(options, attemptCount = 0) {
		const maxRetries = this._reconnectionOptions.maxRetries;
		if (attemptCount >= maxRetries) {
			this.onerror?.(/* @__PURE__ */ new Error(`Maximum reconnection attempts (${maxRetries}) exceeded.`));
			return;
		}
		const delay = this._getNextReconnectionDelay(attemptCount);
		this._reconnectionTimeout = setTimeout(() => {
			this._startOrAuthSse(options).catch((error) => {
				this.onerror?.(/* @__PURE__ */ new Error(`Failed to reconnect SSE stream: ${error instanceof Error ? error.message : String(error)}`));
				this._scheduleReconnection(options, attemptCount + 1);
			});
		}, delay);
	}
	_handleSseStream(stream, options, isReconnectable) {
		if (!stream) return;
		const { onresumptiontoken, replayMessageId } = options;
		let lastEventId;
		let hasPrimingEvent = false;
		let receivedResponse = false;
		const processStream = async () => {
			try {
				const reader = stream.pipeThrough(new TextDecoderStream()).pipeThrough(new EventSourceParserStream({ onRetry: (retryMs) => {
					this._serverRetryMs = retryMs;
				} })).getReader();
				while (true) {
					const { value: event, done } = await reader.read();
					if (done) break;
					if (event.id) {
						lastEventId = event.id;
						hasPrimingEvent = true;
						onresumptiontoken?.(event.id);
					}
					if (!event.data) continue;
					if (!event.event || event.event === "message") try {
						const message = JSONRPCMessageSchema.parse(JSON.parse(event.data));
						if (isJSONRPCResultResponse(message)) {
							receivedResponse = true;
							if (replayMessageId !== void 0) message.id = replayMessageId;
						}
						this.onmessage?.(message);
					} catch (error) {
						this.onerror?.(error);
					}
				}
				if ((isReconnectable || hasPrimingEvent) && !receivedResponse && this._abortController && !this._abortController.signal.aborted) this._scheduleReconnection({
					resumptionToken: lastEventId,
					onresumptiontoken,
					replayMessageId
				}, 0);
			} catch (error) {
				this.onerror?.(/* @__PURE__ */ new Error(`SSE stream disconnected: ${error}`));
				if ((isReconnectable || hasPrimingEvent) && !receivedResponse && this._abortController && !this._abortController.signal.aborted) try {
					this._scheduleReconnection({
						resumptionToken: lastEventId,
						onresumptiontoken,
						replayMessageId
					}, 0);
				} catch (error) {
					this.onerror?.(/* @__PURE__ */ new Error(`Failed to reconnect: ${error instanceof Error ? error.message : String(error)}`));
				}
			}
		};
		processStream();
	}
	async start() {
		if (this._abortController) throw new Error("StreamableHTTPClientTransport already started! If using Client class, note that connect() calls start() automatically.");
		this._abortController = new AbortController();
	}
	/**
	* Call this method after the user has finished authorizing via their user agent and is redirected back to the MCP client application. This will exchange the authorization code for an access token, enabling the next connection attempt to successfully auth.
	*/
	async finishAuth(authorizationCode) {
		if (!this._authProvider) throw new UnauthorizedError("No auth provider");
		if (await auth(this._authProvider, {
			serverUrl: this._url,
			authorizationCode,
			resourceMetadataUrl: this._resourceMetadataUrl,
			scope: this._scope,
			fetchFn: this._fetchWithInit
		}) !== "AUTHORIZED") throw new UnauthorizedError("Failed to authorize");
	}
	async close() {
		if (this._reconnectionTimeout) {
			clearTimeout(this._reconnectionTimeout);
			this._reconnectionTimeout = void 0;
		}
		this._abortController?.abort();
		this.onclose?.();
	}
	async send(message, options) {
		try {
			const { resumptionToken, onresumptiontoken } = options || {};
			if (resumptionToken) {
				this._startOrAuthSse({
					resumptionToken,
					replayMessageId: isJSONRPCRequest(message) ? message.id : void 0
				}).catch((err) => this.onerror?.(err));
				return;
			}
			const headers = await this._commonHeaders();
			headers.set("content-type", "application/json");
			headers.set("accept", "application/json, text/event-stream");
			const init = {
				...this._requestInit,
				method: "POST",
				headers,
				body: JSON.stringify(message),
				signal: this._abortController?.signal
			};
			const response = await (this._fetch ?? fetch)(this._url, init);
			const sessionId = response.headers.get("mcp-session-id");
			if (sessionId) this._sessionId = sessionId;
			if (!response.ok) {
				const text = await response.text().catch(() => null);
				if (response.status === 401 && this._authProvider) {
					if (this._hasCompletedAuthFlow) throw new StreamableHTTPError(401, "Server returned 401 after successful authentication");
					const { resourceMetadataUrl, scope } = extractWWWAuthenticateParams(response);
					this._resourceMetadataUrl = resourceMetadataUrl;
					this._scope = scope;
					if (await auth(this._authProvider, {
						serverUrl: this._url,
						resourceMetadataUrl: this._resourceMetadataUrl,
						scope: this._scope,
						fetchFn: this._fetchWithInit
					}) !== "AUTHORIZED") throw new UnauthorizedError();
					this._hasCompletedAuthFlow = true;
					return this.send(message);
				}
				if (response.status === 403 && this._authProvider) {
					const { resourceMetadataUrl, scope, error } = extractWWWAuthenticateParams(response);
					if (error === "insufficient_scope") {
						const wwwAuthHeader = response.headers.get("WWW-Authenticate");
						if (this._lastUpscopingHeader === wwwAuthHeader) throw new StreamableHTTPError(403, "Server returned 403 after trying upscoping");
						if (scope) this._scope = scope;
						if (resourceMetadataUrl) this._resourceMetadataUrl = resourceMetadataUrl;
						this._lastUpscopingHeader = wwwAuthHeader ?? void 0;
						if (await auth(this._authProvider, {
							serverUrl: this._url,
							resourceMetadataUrl: this._resourceMetadataUrl,
							scope: this._scope,
							fetchFn: this._fetch
						}) !== "AUTHORIZED") throw new UnauthorizedError();
						return this.send(message);
					}
				}
				throw new StreamableHTTPError(response.status, `Error POSTing to endpoint: ${text}`);
			}
			this._hasCompletedAuthFlow = false;
			this._lastUpscopingHeader = void 0;
			if (response.status === 202) {
				await response.body?.cancel();
				if (isInitializedNotification(message)) this._startOrAuthSse({ resumptionToken: void 0 }).catch((err) => this.onerror?.(err));
				return;
			}
			const hasRequests = (Array.isArray(message) ? message : [message]).filter((msg) => "method" in msg && "id" in msg && msg.id !== void 0).length > 0;
			const contentType = response.headers.get("content-type");
			const responseMediaType = mediaTypeEssence(contentType);
			if (hasRequests) if (responseMediaType === "text/event-stream") this._handleSseStream(response.body, { onresumptiontoken }, false);
			else if (responseMediaType === "application/json") {
				const data = await response.json();
				const responseMessages = Array.isArray(data) ? data.map((msg) => JSONRPCMessageSchema.parse(msg)) : [JSONRPCMessageSchema.parse(data)];
				for (const msg of responseMessages) this.onmessage?.(msg);
			} else {
				await response.body?.cancel();
				throw new StreamableHTTPError(-1, `Unexpected content type: ${contentType}`);
			}
			else await response.body?.cancel();
		} catch (error) {
			this.onerror?.(error);
			throw error;
		}
	}
	get sessionId() {
		return this._sessionId;
	}
	/**
	* Terminates the current session by sending a DELETE request to the server.
	*
	* Clients that no longer need a particular session
	* (e.g., because the user is leaving the client application) SHOULD send an
	* HTTP DELETE to the MCP endpoint with the Mcp-Session-Id header to explicitly
	* terminate the session.
	*
	* The server MAY respond with HTTP 405 Method Not Allowed, indicating that
	* the server does not allow clients to terminate sessions.
	*/
	async terminateSession() {
		if (!this._sessionId) return;
		try {
			const headers = await this._commonHeaders();
			const init = {
				...this._requestInit,
				method: "DELETE",
				headers,
				signal: this._abortController?.signal
			};
			const response = await (this._fetch ?? fetch)(this._url, init);
			await response.body?.cancel();
			if (!response.ok && response.status !== 405) throw new StreamableHTTPError(response.status, `Failed to terminate session: ${response.statusText}`);
			this._sessionId = void 0;
		} catch (error) {
			this.onerror?.(error);
			throw error;
		}
	}
	setProtocolVersion(version) {
		this._protocolVersion = version;
	}
	get protocolVersion() {
		return this._protocolVersion;
	}
	/**
	* Resume an SSE stream from a previous event ID.
	* Opens a GET SSE connection with Last-Event-ID header to replay missed events.
	*
	* @param lastEventId The event ID to resume from
	* @param options Optional callback to receive new resumption tokens
	*/
	async resumeStream(lastEventId, options) {
		await this._startOrAuthSse({
			resumptionToken: lastEventId,
			onresumptiontoken: options?.onresumptiontoken
		});
	}
};
//#endregion
//#region node_modules/@modelcontextprotocol/sdk/dist/esm/server/zod-compat.js
function isZ4Schema(s) {
	return !!s._zod;
}
function safeParse(schema, data) {
	if (isZ4Schema(schema)) return safeParse$1(schema, data);
	return schema.safeParse(data);
}
function getObjectShape(schema) {
	if (!schema) return void 0;
	let rawShape;
	if (isZ4Schema(schema)) rawShape = schema._zod?.def?.shape;
	else rawShape = schema.shape;
	if (!rawShape) return void 0;
	if (typeof rawShape === "function") try {
		return rawShape();
	} catch {
		return;
	}
	return rawShape;
}
/**
* Gets the literal value from a schema, if it's a literal schema.
* Works with both Zod v3 and v4.
* Returns undefined if the schema is not a literal or the value cannot be determined.
*/
function getLiteralValue(schema) {
	if (isZ4Schema(schema)) {
		const def = schema._zod?.def;
		if (def) {
			if (def.value !== void 0) return def.value;
			if (Array.isArray(def.values) && def.values.length > 0) return def.values[0];
		}
	}
	const def = schema._def;
	if (def) {
		if (def.value !== void 0) return def.value;
		if (Array.isArray(def.values) && def.values.length > 0) return def.values[0];
	}
	const directValue = schema.value;
	if (directValue !== void 0) return directValue;
}
//#endregion
//#region node_modules/@modelcontextprotocol/sdk/dist/esm/experimental/tasks/interfaces.js
/**
* Experimental task interfaces for MCP SDK.
* WARNING: These APIs are experimental and may change without notice.
*/
/**
* Checks if a task status represents a terminal state.
* Terminal states are those where the task has finished and will not change.
*
* @param status - The task status to check
* @returns True if the status is terminal (completed, failed, or cancelled)
* @experimental
*/
function isTerminal(status) {
	return status === "completed" || status === "failed" || status === "cancelled";
}
//#endregion
//#region node_modules/@modelcontextprotocol/sdk/dist/esm/server/zod-json-schema-compat.js
function getMethodLiteral(schema) {
	const methodSchema = getObjectShape(schema)?.method;
	if (!methodSchema) throw new Error("Schema is missing a method literal");
	const value = getLiteralValue(methodSchema);
	if (typeof value !== "string") throw new Error("Schema method literal must be a string");
	return value;
}
function parseWithCompat(schema, data) {
	const result = safeParse(schema, data);
	if (!result.success) throw result.error;
	return result.data;
}
/**
* Implements MCP protocol framing on top of a pluggable transport, including
* features like request/response linking, notifications, and progress.
*/
var Protocol = class {
	constructor(_options) {
		this._options = _options;
		this._requestMessageId = 0;
		this._requestHandlers = /* @__PURE__ */ new Map();
		this._requestHandlerAbortControllers = /* @__PURE__ */ new Map();
		this._notificationHandlers = /* @__PURE__ */ new Map();
		this._responseHandlers = /* @__PURE__ */ new Map();
		this._progressHandlers = /* @__PURE__ */ new Map();
		this._timeoutInfo = /* @__PURE__ */ new Map();
		this._pendingDebouncedNotifications = /* @__PURE__ */ new Set();
		this._taskProgressTokens = /* @__PURE__ */ new Map();
		this._requestResolvers = /* @__PURE__ */ new Map();
		this.setNotificationHandler(CancelledNotificationSchema, (notification) => {
			this._oncancel(notification);
		});
		this.setNotificationHandler(ProgressNotificationSchema, (notification) => {
			this._onprogress(notification);
		});
		this.setRequestHandler(PingRequestSchema, (_request) => ({}));
		this._taskStore = _options?.taskStore;
		this._taskMessageQueue = _options?.taskMessageQueue;
		if (this._taskStore) {
			this.setRequestHandler(GetTaskRequestSchema, async (request, extra) => {
				const task = await this._taskStore.getTask(request.params.taskId, extra.sessionId);
				if (!task) throw new McpError(ErrorCode.InvalidParams, "Failed to retrieve task: Task not found");
				return { ...task };
			});
			this.setRequestHandler(GetTaskPayloadRequestSchema, async (request, extra) => {
				const handleTaskResult = async () => {
					const taskId = request.params.taskId;
					if (this._taskMessageQueue) {
						let queuedMessage;
						while (queuedMessage = await this._taskMessageQueue.dequeue(taskId, extra.sessionId)) {
							if (queuedMessage.type === "response" || queuedMessage.type === "error") {
								const message = queuedMessage.message;
								const requestId = message.id;
								const resolver = this._requestResolvers.get(requestId);
								if (resolver) {
									this._requestResolvers.delete(requestId);
									if (queuedMessage.type === "response") resolver(message);
									else {
										const errorMessage = message;
										resolver(new McpError(errorMessage.error.code, errorMessage.error.message, errorMessage.error.data));
									}
								} else {
									const messageType = queuedMessage.type === "response" ? "Response" : "Error";
									this._onerror(/* @__PURE__ */ new Error(`${messageType} handler missing for request ${requestId}`));
								}
								continue;
							}
							await this._transport?.send(queuedMessage.message, { relatedRequestId: extra.requestId });
						}
					}
					const task = await this._taskStore.getTask(taskId, extra.sessionId);
					if (!task) throw new McpError(ErrorCode.InvalidParams, `Task not found: ${taskId}`);
					if (!isTerminal(task.status)) {
						await this._waitForTaskUpdate(taskId, extra.signal);
						return await handleTaskResult();
					}
					if (isTerminal(task.status)) {
						const result = await this._taskStore.getTaskResult(taskId, extra.sessionId);
						this._clearTaskQueue(taskId);
						return {
							...result,
							_meta: {
								...result._meta,
								[RELATED_TASK_META_KEY]: { taskId }
							}
						};
					}
					return await handleTaskResult();
				};
				return await handleTaskResult();
			});
			this.setRequestHandler(ListTasksRequestSchema, async (request, extra) => {
				try {
					const { tasks, nextCursor } = await this._taskStore.listTasks(request.params?.cursor, extra.sessionId);
					return {
						tasks,
						nextCursor,
						_meta: {}
					};
				} catch (error) {
					throw new McpError(ErrorCode.InvalidParams, `Failed to list tasks: ${error instanceof Error ? error.message : String(error)}`);
				}
			});
			this.setRequestHandler(CancelTaskRequestSchema, async (request, extra) => {
				try {
					const task = await this._taskStore.getTask(request.params.taskId, extra.sessionId);
					if (!task) throw new McpError(ErrorCode.InvalidParams, `Task not found: ${request.params.taskId}`);
					if (isTerminal(task.status)) throw new McpError(ErrorCode.InvalidParams, `Cannot cancel task in terminal status: ${task.status}`);
					await this._taskStore.updateTaskStatus(request.params.taskId, "cancelled", "Client cancelled task execution.", extra.sessionId);
					this._clearTaskQueue(request.params.taskId);
					const cancelledTask = await this._taskStore.getTask(request.params.taskId, extra.sessionId);
					if (!cancelledTask) throw new McpError(ErrorCode.InvalidParams, `Task not found after cancellation: ${request.params.taskId}`);
					return {
						_meta: {},
						...cancelledTask
					};
				} catch (error) {
					if (error instanceof McpError) throw error;
					throw new McpError(ErrorCode.InvalidRequest, `Failed to cancel task: ${error instanceof Error ? error.message : String(error)}`);
				}
			});
		}
	}
	async _oncancel(notification) {
		if (!notification.params.requestId) return;
		this._requestHandlerAbortControllers.get(notification.params.requestId)?.abort(notification.params.reason);
	}
	_setupTimeout(messageId, timeout, maxTotalTimeout, onTimeout, resetTimeoutOnProgress = false) {
		this._timeoutInfo.set(messageId, {
			timeoutId: setTimeout(onTimeout, timeout),
			startTime: Date.now(),
			timeout,
			maxTotalTimeout,
			resetTimeoutOnProgress,
			onTimeout
		});
	}
	_resetTimeout(messageId) {
		const info = this._timeoutInfo.get(messageId);
		if (!info) return false;
		const totalElapsed = Date.now() - info.startTime;
		if (info.maxTotalTimeout && totalElapsed >= info.maxTotalTimeout) {
			this._timeoutInfo.delete(messageId);
			throw McpError.fromError(ErrorCode.RequestTimeout, "Maximum total timeout exceeded", {
				maxTotalTimeout: info.maxTotalTimeout,
				totalElapsed
			});
		}
		clearTimeout(info.timeoutId);
		info.timeoutId = setTimeout(info.onTimeout, info.timeout);
		return true;
	}
	_cleanupTimeout(messageId) {
		const info = this._timeoutInfo.get(messageId);
		if (info) {
			clearTimeout(info.timeoutId);
			this._timeoutInfo.delete(messageId);
		}
	}
	/**
	* Attaches to the given transport, starts it, and starts listening for messages.
	*
	* The Protocol object assumes ownership of the Transport, replacing any callbacks that have already been set, and expects that it is the only user of the Transport instance going forward.
	*/
	async connect(transport) {
		if (this._transport) throw new Error("Already connected to a transport. Call close() before connecting to a new transport, or use a separate Protocol instance per connection.");
		this._transport = transport;
		const _onclose = this.transport?.onclose;
		this._transport.onclose = () => {
			_onclose?.();
			this._onclose();
		};
		const _onerror = this.transport?.onerror;
		this._transport.onerror = (error) => {
			_onerror?.(error);
			this._onerror(error);
		};
		const _onmessage = this._transport?.onmessage;
		this._transport.onmessage = (message, extra) => {
			_onmessage?.(message, extra);
			if (isJSONRPCResultResponse(message) || isJSONRPCErrorResponse(message)) this._onresponse(message);
			else if (isJSONRPCRequest(message)) this._onrequest(message, extra);
			else if (isJSONRPCNotification(message)) this._onnotification(message);
			else this._onerror(/* @__PURE__ */ new Error(`Unknown message type: ${JSON.stringify(message)}`));
		};
		await this._transport.start();
	}
	_onclose() {
		const responseHandlers = this._responseHandlers;
		this._responseHandlers = /* @__PURE__ */ new Map();
		this._progressHandlers.clear();
		this._taskProgressTokens.clear();
		this._pendingDebouncedNotifications.clear();
		for (const info of this._timeoutInfo.values()) clearTimeout(info.timeoutId);
		this._timeoutInfo.clear();
		for (const controller of this._requestHandlerAbortControllers.values()) controller.abort();
		this._requestHandlerAbortControllers.clear();
		const error = McpError.fromError(ErrorCode.ConnectionClosed, "Connection closed");
		this._transport = void 0;
		this.onclose?.();
		for (const handler of responseHandlers.values()) handler(error);
	}
	_onerror(error) {
		this.onerror?.(error);
	}
	_onnotification(notification) {
		const handler = this._notificationHandlers.get(notification.method) ?? this.fallbackNotificationHandler;
		if (handler === void 0) return;
		Promise.resolve().then(() => handler(notification)).catch((error) => this._onerror(/* @__PURE__ */ new Error(`Uncaught error in notification handler: ${error}`)));
	}
	_onrequest(request, extra) {
		const handler = this._requestHandlers.get(request.method) ?? this.fallbackRequestHandler;
		const capturedTransport = this._transport;
		const relatedTaskId = request.params?._meta?.[RELATED_TASK_META_KEY]?.taskId;
		if (handler === void 0) {
			const errorResponse = {
				jsonrpc: "2.0",
				id: request.id,
				error: {
					code: ErrorCode.MethodNotFound,
					message: "Method not found"
				}
			};
			if (relatedTaskId && this._taskMessageQueue) this._enqueueTaskMessage(relatedTaskId, {
				type: "error",
				message: errorResponse,
				timestamp: Date.now()
			}, capturedTransport?.sessionId).catch((error) => this._onerror(/* @__PURE__ */ new Error(`Failed to enqueue error response: ${error}`)));
			else capturedTransport?.send(errorResponse).catch((error) => this._onerror(/* @__PURE__ */ new Error(`Failed to send an error response: ${error}`)));
			return;
		}
		const abortController = new AbortController();
		this._requestHandlerAbortControllers.set(request.id, abortController);
		const taskCreationParams = isTaskAugmentedRequestParams(request.params) ? request.params.task : void 0;
		const taskStore = this._taskStore ? this.requestTaskStore(request, capturedTransport?.sessionId) : void 0;
		const fullExtra = {
			signal: abortController.signal,
			sessionId: capturedTransport?.sessionId,
			_meta: request.params?._meta,
			sendNotification: async (notification) => {
				if (abortController.signal.aborted) return;
				const notificationOptions = { relatedRequestId: request.id };
				if (relatedTaskId) notificationOptions.relatedTask = { taskId: relatedTaskId };
				await this.notification(notification, notificationOptions);
			},
			sendRequest: async (r, resultSchema, options) => {
				if (abortController.signal.aborted) throw new McpError(ErrorCode.ConnectionClosed, "Request was cancelled");
				const requestOptions = {
					...options,
					relatedRequestId: request.id
				};
				if (relatedTaskId && !requestOptions.relatedTask) requestOptions.relatedTask = { taskId: relatedTaskId };
				const effectiveTaskId = requestOptions.relatedTask?.taskId ?? relatedTaskId;
				if (effectiveTaskId && taskStore) await taskStore.updateTaskStatus(effectiveTaskId, "input_required");
				return await this.request(r, resultSchema, requestOptions);
			},
			authInfo: extra?.authInfo,
			requestId: request.id,
			requestInfo: extra?.requestInfo,
			taskId: relatedTaskId,
			taskStore,
			taskRequestedTtl: taskCreationParams?.ttl,
			closeSSEStream: extra?.closeSSEStream,
			closeStandaloneSSEStream: extra?.closeStandaloneSSEStream
		};
		Promise.resolve().then(() => {
			if (taskCreationParams) this.assertTaskHandlerCapability(request.method);
		}).then(() => handler(request, fullExtra)).then(async (result) => {
			if (abortController.signal.aborted) return;
			const response = {
				result,
				jsonrpc: "2.0",
				id: request.id
			};
			if (relatedTaskId && this._taskMessageQueue) await this._enqueueTaskMessage(relatedTaskId, {
				type: "response",
				message: response,
				timestamp: Date.now()
			}, capturedTransport?.sessionId);
			else await capturedTransport?.send(response);
		}, async (error) => {
			if (abortController.signal.aborted) return;
			const errorResponse = {
				jsonrpc: "2.0",
				id: request.id,
				error: {
					code: Number.isSafeInteger(error["code"]) ? error["code"] : ErrorCode.InternalError,
					message: error.message ?? "Internal error",
					...error["data"] !== void 0 && { data: error["data"] }
				}
			};
			if (relatedTaskId && this._taskMessageQueue) await this._enqueueTaskMessage(relatedTaskId, {
				type: "error",
				message: errorResponse,
				timestamp: Date.now()
			}, capturedTransport?.sessionId);
			else await capturedTransport?.send(errorResponse);
		}).catch((error) => this._onerror(/* @__PURE__ */ new Error(`Failed to send response: ${error}`))).finally(() => {
			if (this._requestHandlerAbortControllers.get(request.id) === abortController) this._requestHandlerAbortControllers.delete(request.id);
		});
	}
	_onprogress(notification) {
		const { progressToken, ...params } = notification.params;
		const messageId = Number(progressToken);
		const handler = this._progressHandlers.get(messageId);
		if (!handler) {
			this._onerror(/* @__PURE__ */ new Error(`Received a progress notification for an unknown token: ${JSON.stringify(notification)}`));
			return;
		}
		const responseHandler = this._responseHandlers.get(messageId);
		const timeoutInfo = this._timeoutInfo.get(messageId);
		if (timeoutInfo && responseHandler && timeoutInfo.resetTimeoutOnProgress) try {
			this._resetTimeout(messageId);
		} catch (error) {
			this._responseHandlers.delete(messageId);
			this._progressHandlers.delete(messageId);
			this._cleanupTimeout(messageId);
			responseHandler(error);
			return;
		}
		handler(params);
	}
	_onresponse(response) {
		const messageId = Number(response.id);
		const resolver = this._requestResolvers.get(messageId);
		if (resolver) {
			this._requestResolvers.delete(messageId);
			if (isJSONRPCResultResponse(response)) resolver(response);
			else resolver(new McpError(response.error.code, response.error.message, response.error.data));
			return;
		}
		const handler = this._responseHandlers.get(messageId);
		if (handler === void 0) {
			this._onerror(/* @__PURE__ */ new Error(`Received a response for an unknown message ID: ${JSON.stringify(response)}`));
			return;
		}
		this._responseHandlers.delete(messageId);
		this._cleanupTimeout(messageId);
		let isTaskResponse = false;
		if (isJSONRPCResultResponse(response) && response.result && typeof response.result === "object") {
			const result = response.result;
			if (result.task && typeof result.task === "object") {
				const task = result.task;
				if (typeof task.taskId === "string") {
					isTaskResponse = true;
					this._taskProgressTokens.set(task.taskId, messageId);
				}
			}
		}
		if (!isTaskResponse) this._progressHandlers.delete(messageId);
		if (isJSONRPCResultResponse(response)) handler(response);
		else handler(McpError.fromError(response.error.code, response.error.message, response.error.data));
	}
	get transport() {
		return this._transport;
	}
	/**
	* Closes the connection.
	*/
	async close() {
		await this._transport?.close();
	}
	/**
	* Sends a request and returns an AsyncGenerator that yields response messages.
	* The generator is guaranteed to end with either a 'result' or 'error' message.
	*
	* @example
	* ```typescript
	* const stream = protocol.requestStream(request, resultSchema, options);
	* for await (const message of stream) {
	*   switch (message.type) {
	*     case 'taskCreated':
	*       console.log('Task created:', message.task.taskId);
	*       break;
	*     case 'taskStatus':
	*       console.log('Task status:', message.task.status);
	*       break;
	*     case 'result':
	*       console.log('Final result:', message.result);
	*       break;
	*     case 'error':
	*       console.error('Error:', message.error);
	*       break;
	*   }
	* }
	* ```
	*
	* @experimental Use `client.experimental.tasks.requestStream()` to access this method.
	*/
	async *requestStream(request, resultSchema, options) {
		const { task } = options ?? {};
		if (!task) {
			try {
				yield {
					type: "result",
					result: await this.request(request, resultSchema, options)
				};
			} catch (error) {
				yield {
					type: "error",
					error: error instanceof McpError ? error : new McpError(ErrorCode.InternalError, String(error))
				};
			}
			return;
		}
		let taskId;
		try {
			const createResult = await this.request(request, CreateTaskResultSchema, options);
			if (createResult.task) {
				taskId = createResult.task.taskId;
				yield {
					type: "taskCreated",
					task: createResult.task
				};
			} else throw new McpError(ErrorCode.InternalError, "Task creation did not return a task");
			while (true) {
				const task = await this.getTask({ taskId }, options);
				yield {
					type: "taskStatus",
					task
				};
				if (isTerminal(task.status)) {
					if (task.status === "completed") yield {
						type: "result",
						result: await this.getTaskResult({ taskId }, resultSchema, options)
					};
					else if (task.status === "failed") yield {
						type: "error",
						error: new McpError(ErrorCode.InternalError, `Task ${taskId} failed`)
					};
					else if (task.status === "cancelled") yield {
						type: "error",
						error: new McpError(ErrorCode.InternalError, `Task ${taskId} was cancelled`)
					};
					return;
				}
				if (task.status === "input_required") {
					yield {
						type: "result",
						result: await this.getTaskResult({ taskId }, resultSchema, options)
					};
					return;
				}
				const pollInterval = task.pollInterval ?? this._options?.defaultTaskPollInterval ?? 1e3;
				await new Promise((resolve) => setTimeout(resolve, pollInterval));
				options?.signal?.throwIfAborted();
			}
		} catch (error) {
			yield {
				type: "error",
				error: error instanceof McpError ? error : new McpError(ErrorCode.InternalError, String(error))
			};
		}
	}
	/**
	* Sends a request and waits for a response.
	*
	* Do not use this method to emit notifications! Use notification() instead.
	*/
	request(request, resultSchema, options) {
		const { relatedRequestId, resumptionToken, onresumptiontoken, task, relatedTask } = options ?? {};
		return new Promise((resolve, reject) => {
			const earlyReject = (error) => {
				reject(error);
			};
			if (!this._transport) {
				earlyReject(/* @__PURE__ */ new Error("Not connected"));
				return;
			}
			if (this._options?.enforceStrictCapabilities === true) try {
				this.assertCapabilityForMethod(request.method);
				if (task) this.assertTaskCapability(request.method);
			} catch (e) {
				earlyReject(e);
				return;
			}
			options?.signal?.throwIfAborted();
			const messageId = this._requestMessageId++;
			const jsonrpcRequest = {
				...request,
				jsonrpc: "2.0",
				id: messageId
			};
			if (options?.onprogress) {
				this._progressHandlers.set(messageId, options.onprogress);
				jsonrpcRequest.params = {
					...request.params,
					_meta: {
						...request.params?._meta || {},
						progressToken: messageId
					}
				};
			}
			if (task) jsonrpcRequest.params = {
				...jsonrpcRequest.params,
				task
			};
			if (relatedTask) jsonrpcRequest.params = {
				...jsonrpcRequest.params,
				_meta: {
					...jsonrpcRequest.params?._meta || {},
					[RELATED_TASK_META_KEY]: relatedTask
				}
			};
			const cancel = (reason) => {
				this._responseHandlers.delete(messageId);
				this._progressHandlers.delete(messageId);
				this._cleanupTimeout(messageId);
				this._transport?.send({
					jsonrpc: "2.0",
					method: "notifications/cancelled",
					params: {
						requestId: messageId,
						reason: String(reason)
					}
				}, {
					relatedRequestId,
					resumptionToken,
					onresumptiontoken
				}).catch((error) => this._onerror(/* @__PURE__ */ new Error(`Failed to send cancellation: ${error}`)));
				reject(reason instanceof McpError ? reason : new McpError(ErrorCode.RequestTimeout, String(reason)));
			};
			this._responseHandlers.set(messageId, (response) => {
				if (options?.signal?.aborted) return;
				if (response instanceof Error) return reject(response);
				try {
					const parseResult = safeParse(resultSchema, response.result);
					if (!parseResult.success) reject(parseResult.error);
					else resolve(parseResult.data);
				} catch (error) {
					reject(error);
				}
			});
			options?.signal?.addEventListener("abort", () => {
				cancel(options?.signal?.reason);
			});
			const timeout = options?.timeout ?? 6e4;
			const timeoutHandler = () => cancel(McpError.fromError(ErrorCode.RequestTimeout, "Request timed out", { timeout }));
			this._setupTimeout(messageId, timeout, options?.maxTotalTimeout, timeoutHandler, options?.resetTimeoutOnProgress ?? false);
			const relatedTaskId = relatedTask?.taskId;
			if (relatedTaskId) {
				const responseResolver = (response) => {
					const handler = this._responseHandlers.get(messageId);
					if (handler) handler(response);
					else this._onerror(/* @__PURE__ */ new Error(`Response handler missing for side-channeled request ${messageId}`));
				};
				this._requestResolvers.set(messageId, responseResolver);
				this._enqueueTaskMessage(relatedTaskId, {
					type: "request",
					message: jsonrpcRequest,
					timestamp: Date.now()
				}).catch((error) => {
					this._cleanupTimeout(messageId);
					reject(error);
				});
			} else this._transport.send(jsonrpcRequest, {
				relatedRequestId,
				resumptionToken,
				onresumptiontoken
			}).catch((error) => {
				this._cleanupTimeout(messageId);
				reject(error);
			});
		});
	}
	/**
	* Gets the current status of a task.
	*
	* @experimental Use `client.experimental.tasks.getTask()` to access this method.
	*/
	async getTask(params, options) {
		return this.request({
			method: "tasks/get",
			params
		}, GetTaskResultSchema, options);
	}
	/**
	* Retrieves the result of a completed task.
	*
	* @experimental Use `client.experimental.tasks.getTaskResult()` to access this method.
	*/
	async getTaskResult(params, resultSchema, options) {
		return this.request({
			method: "tasks/result",
			params
		}, resultSchema, options);
	}
	/**
	* Lists tasks, optionally starting from a pagination cursor.
	*
	* @experimental Use `client.experimental.tasks.listTasks()` to access this method.
	*/
	async listTasks(params, options) {
		return this.request({
			method: "tasks/list",
			params
		}, ListTasksResultSchema, options);
	}
	/**
	* Cancels a specific task.
	*
	* @experimental Use `client.experimental.tasks.cancelTask()` to access this method.
	*/
	async cancelTask(params, options) {
		return this.request({
			method: "tasks/cancel",
			params
		}, CancelTaskResultSchema, options);
	}
	/**
	* Emits a notification, which is a one-way message that does not expect a response.
	*/
	async notification(notification, options) {
		if (!this._transport) throw new Error("Not connected");
		this.assertNotificationCapability(notification.method);
		const relatedTaskId = options?.relatedTask?.taskId;
		if (relatedTaskId) {
			const jsonrpcNotification = {
				...notification,
				jsonrpc: "2.0",
				params: {
					...notification.params,
					_meta: {
						...notification.params?._meta || {},
						[RELATED_TASK_META_KEY]: options.relatedTask
					}
				}
			};
			await this._enqueueTaskMessage(relatedTaskId, {
				type: "notification",
				message: jsonrpcNotification,
				timestamp: Date.now()
			});
			return;
		}
		if ((this._options?.debouncedNotificationMethods ?? []).includes(notification.method) && !notification.params && !options?.relatedRequestId && !options?.relatedTask) {
			if (this._pendingDebouncedNotifications.has(notification.method)) return;
			this._pendingDebouncedNotifications.add(notification.method);
			Promise.resolve().then(() => {
				this._pendingDebouncedNotifications.delete(notification.method);
				if (!this._transport) return;
				let jsonrpcNotification = {
					...notification,
					jsonrpc: "2.0"
				};
				if (options?.relatedTask) jsonrpcNotification = {
					...jsonrpcNotification,
					params: {
						...jsonrpcNotification.params,
						_meta: {
							...jsonrpcNotification.params?._meta || {},
							[RELATED_TASK_META_KEY]: options.relatedTask
						}
					}
				};
				this._transport?.send(jsonrpcNotification, options).catch((error) => this._onerror(error));
			});
			return;
		}
		let jsonrpcNotification = {
			...notification,
			jsonrpc: "2.0"
		};
		if (options?.relatedTask) jsonrpcNotification = {
			...jsonrpcNotification,
			params: {
				...jsonrpcNotification.params,
				_meta: {
					...jsonrpcNotification.params?._meta || {},
					[RELATED_TASK_META_KEY]: options.relatedTask
				}
			}
		};
		await this._transport.send(jsonrpcNotification, options);
	}
	/**
	* Registers a handler to invoke when this protocol object receives a request with the given method.
	*
	* Note that this will replace any previous request handler for the same method.
	*/
	setRequestHandler(requestSchema, handler) {
		const method = getMethodLiteral(requestSchema);
		this.assertRequestHandlerCapability(method);
		this._requestHandlers.set(method, (request, extra) => {
			const parsed = parseWithCompat(requestSchema, request);
			return Promise.resolve(handler(parsed, extra));
		});
	}
	/**
	* Removes the request handler for the given method.
	*/
	removeRequestHandler(method) {
		this._requestHandlers.delete(method);
	}
	/**
	* Asserts that a request handler has not already been set for the given method, in preparation for a new one being automatically installed.
	*/
	assertCanSetRequestHandler(method) {
		if (this._requestHandlers.has(method)) throw new Error(`A request handler for ${method} already exists, which would be overridden`);
	}
	/**
	* Registers a handler to invoke when this protocol object receives a notification with the given method.
	*
	* Note that this will replace any previous notification handler for the same method.
	*/
	setNotificationHandler(notificationSchema, handler) {
		const method = getMethodLiteral(notificationSchema);
		this._notificationHandlers.set(method, (notification) => {
			const parsed = parseWithCompat(notificationSchema, notification);
			return Promise.resolve(handler(parsed));
		});
	}
	/**
	* Removes the notification handler for the given method.
	*/
	removeNotificationHandler(method) {
		this._notificationHandlers.delete(method);
	}
	/**
	* Cleans up the progress handler associated with a task.
	* This should be called when a task reaches a terminal status.
	*/
	_cleanupTaskProgressHandler(taskId) {
		const progressToken = this._taskProgressTokens.get(taskId);
		if (progressToken !== void 0) {
			this._progressHandlers.delete(progressToken);
			this._taskProgressTokens.delete(taskId);
		}
	}
	/**
	* Enqueues a task-related message for side-channel delivery via tasks/result.
	* @param taskId The task ID to associate the message with
	* @param message The message to enqueue
	* @param sessionId Optional session ID for binding the operation to a specific session
	* @throws Error if taskStore is not configured or if enqueue fails (e.g., queue overflow)
	*
	* Note: If enqueue fails, it's the TaskMessageQueue implementation's responsibility to handle
	* the error appropriately (e.g., by failing the task, logging, etc.). The Protocol layer
	* simply propagates the error.
	*/
	async _enqueueTaskMessage(taskId, message, sessionId) {
		if (!this._taskStore || !this._taskMessageQueue) throw new Error("Cannot enqueue task message: taskStore and taskMessageQueue are not configured");
		const maxQueueSize = this._options?.maxTaskQueueSize;
		await this._taskMessageQueue.enqueue(taskId, message, sessionId, maxQueueSize);
	}
	/**
	* Clears the message queue for a task and rejects any pending request resolvers.
	* @param taskId The task ID whose queue should be cleared
	* @param sessionId Optional session ID for binding the operation to a specific session
	*/
	async _clearTaskQueue(taskId, sessionId) {
		if (this._taskMessageQueue) {
			const messages = await this._taskMessageQueue.dequeueAll(taskId, sessionId);
			for (const message of messages) if (message.type === "request" && isJSONRPCRequest(message.message)) {
				const requestId = message.message.id;
				const resolver = this._requestResolvers.get(requestId);
				if (resolver) {
					resolver(new McpError(ErrorCode.InternalError, "Task cancelled or completed"));
					this._requestResolvers.delete(requestId);
				} else this._onerror(/* @__PURE__ */ new Error(`Resolver missing for request ${requestId} during task ${taskId} cleanup`));
			}
		}
	}
	/**
	* Waits for a task update (new messages or status change) with abort signal support.
	* Uses polling to check for updates at the task's configured poll interval.
	* @param taskId The task ID to wait for
	* @param signal Abort signal to cancel the wait
	* @returns Promise that resolves when an update occurs or rejects if aborted
	*/
	async _waitForTaskUpdate(taskId, signal) {
		let interval = this._options?.defaultTaskPollInterval ?? 1e3;
		try {
			const task = await this._taskStore?.getTask(taskId);
			if (task?.pollInterval) interval = task.pollInterval;
		} catch {}
		return new Promise((resolve, reject) => {
			if (signal.aborted) {
				reject(new McpError(ErrorCode.InvalidRequest, "Request cancelled"));
				return;
			}
			const timeoutId = setTimeout(resolve, interval);
			signal.addEventListener("abort", () => {
				clearTimeout(timeoutId);
				reject(new McpError(ErrorCode.InvalidRequest, "Request cancelled"));
			}, { once: true });
		});
	}
	requestTaskStore(request, sessionId) {
		const taskStore = this._taskStore;
		if (!taskStore) throw new Error("No task store configured");
		return {
			createTask: async (taskParams) => {
				if (!request) throw new Error("No request provided");
				return await taskStore.createTask(taskParams, request.id, {
					method: request.method,
					params: request.params
				}, sessionId);
			},
			getTask: async (taskId) => {
				const task = await taskStore.getTask(taskId, sessionId);
				if (!task) throw new McpError(ErrorCode.InvalidParams, "Failed to retrieve task: Task not found");
				return task;
			},
			storeTaskResult: async (taskId, status, result) => {
				await taskStore.storeTaskResult(taskId, status, result, sessionId);
				const task = await taskStore.getTask(taskId, sessionId);
				if (task) {
					const notification = TaskStatusNotificationSchema.parse({
						method: "notifications/tasks/status",
						params: task
					});
					await this.notification(notification);
					if (isTerminal(task.status)) this._cleanupTaskProgressHandler(taskId);
				}
			},
			getTaskResult: (taskId) => {
				return taskStore.getTaskResult(taskId, sessionId);
			},
			updateTaskStatus: async (taskId, status, statusMessage) => {
				const task = await taskStore.getTask(taskId, sessionId);
				if (!task) throw new McpError(ErrorCode.InvalidParams, `Task "${taskId}" not found - it may have been cleaned up`);
				if (isTerminal(task.status)) throw new McpError(ErrorCode.InvalidParams, `Cannot update task "${taskId}" from terminal status "${task.status}" to "${status}". Terminal states (completed, failed, cancelled) cannot transition to other states.`);
				await taskStore.updateTaskStatus(taskId, status, statusMessage, sessionId);
				const updatedTask = await taskStore.getTask(taskId, sessionId);
				if (updatedTask) {
					const notification = TaskStatusNotificationSchema.parse({
						method: "notifications/tasks/status",
						params: updatedTask
					});
					await this.notification(notification);
					if (isTerminal(updatedTask.status)) this._cleanupTaskProgressHandler(taskId);
				}
			},
			listTasks: (cursor) => {
				return taskStore.listTasks(cursor, sessionId);
			}
		};
	}
};
function isPlainObject(value) {
	return value !== null && typeof value === "object" && !Array.isArray(value);
}
function mergeCapabilities(base, additional) {
	const result = { ...base };
	for (const key in additional) {
		const k = key;
		const addValue = additional[k];
		if (addValue === void 0) continue;
		const baseValue = result[k];
		if (isPlainObject(baseValue) && isPlainObject(addValue)) result[k] = {
			...baseValue,
			...addValue
		};
		else result[k] = addValue;
	}
	return result;
}
//#endregion
//#region node_modules/@modelcontextprotocol/sdk/node_modules/ajv/dist/compile/codegen/code.js
var require_code$3 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.regexpCode = exports.getEsmExportName = exports.getProperty = exports.safeStringify = exports.stringify = exports.strConcat = exports.addCodeArg = exports.str = exports._ = exports.nil = exports._Code = exports.Name = exports.IDENTIFIER = exports._CodeOrName = void 0;
	var _CodeOrName = class {};
	exports._CodeOrName = _CodeOrName;
	exports.IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i;
	var Name = class extends _CodeOrName {
		constructor(s) {
			super();
			if (!exports.IDENTIFIER.test(s)) throw new Error("CodeGen: name must be a valid identifier");
			this.str = s;
		}
		toString() {
			return this.str;
		}
		emptyStr() {
			return false;
		}
		get names() {
			return { [this.str]: 1 };
		}
	};
	exports.Name = Name;
	var _Code = class extends _CodeOrName {
		constructor(code) {
			super();
			this._items = typeof code === "string" ? [code] : code;
		}
		toString() {
			return this.str;
		}
		emptyStr() {
			if (this._items.length > 1) return false;
			const item = this._items[0];
			return item === "" || item === "\"\"";
		}
		get str() {
			var _a;
			return (_a = this._str) !== null && _a !== void 0 ? _a : this._str = this._items.reduce((s, c) => `${s}${c}`, "");
		}
		get names() {
			var _a;
			return (_a = this._names) !== null && _a !== void 0 ? _a : this._names = this._items.reduce((names, c) => {
				if (c instanceof Name) names[c.str] = (names[c.str] || 0) + 1;
				return names;
			}, {});
		}
	};
	exports._Code = _Code;
	exports.nil = new _Code("");
	function _(strs, ...args) {
		const code = [strs[0]];
		let i = 0;
		while (i < args.length) {
			addCodeArg(code, args[i]);
			code.push(strs[++i]);
		}
		return new _Code(code);
	}
	exports._ = _;
	var plus = new _Code("+");
	function str(strs, ...args) {
		const expr = [safeStringify(strs[0])];
		let i = 0;
		while (i < args.length) {
			expr.push(plus);
			addCodeArg(expr, args[i]);
			expr.push(plus, safeStringify(strs[++i]));
		}
		optimize(expr);
		return new _Code(expr);
	}
	exports.str = str;
	function addCodeArg(code, arg) {
		if (arg instanceof _Code) code.push(...arg._items);
		else if (arg instanceof Name) code.push(arg);
		else code.push(interpolate(arg));
	}
	exports.addCodeArg = addCodeArg;
	function optimize(expr) {
		let i = 1;
		while (i < expr.length - 1) {
			if (expr[i] === plus) {
				const res = mergeExprItems(expr[i - 1], expr[i + 1]);
				if (res !== void 0) {
					expr.splice(i - 1, 3, res);
					continue;
				}
				expr[i++] = "+";
			}
			i++;
		}
	}
	function mergeExprItems(a, b) {
		if (b === "\"\"") return a;
		if (a === "\"\"") return b;
		if (typeof a == "string") {
			if (b instanceof Name || a[a.length - 1] !== "\"") return;
			if (typeof b != "string") return `${a.slice(0, -1)}${b}"`;
			if (b[0] === "\"") return a.slice(0, -1) + b.slice(1);
			return;
		}
		if (typeof b == "string" && b[0] === "\"" && !(a instanceof Name)) return `"${a}${b.slice(1)}`;
	}
	function strConcat(c1, c2) {
		return c2.emptyStr() ? c1 : c1.emptyStr() ? c2 : str`${c1}${c2}`;
	}
	exports.strConcat = strConcat;
	function interpolate(x) {
		return typeof x == "number" || typeof x == "boolean" || x === null ? x : safeStringify(Array.isArray(x) ? x.join(",") : x);
	}
	function stringify(x) {
		return new _Code(safeStringify(x));
	}
	exports.stringify = stringify;
	function safeStringify(x) {
		return JSON.stringify(x).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
	}
	exports.safeStringify = safeStringify;
	function getProperty(key) {
		return typeof key == "string" && exports.IDENTIFIER.test(key) ? new _Code(`.${key}`) : _`[${key}]`;
	}
	exports.getProperty = getProperty;
	function getEsmExportName(key) {
		if (typeof key == "string" && exports.IDENTIFIER.test(key)) return new _Code(`${key}`);
		throw new Error(`CodeGen: invalid export name: ${key}, use explicit $id name mapping`);
	}
	exports.getEsmExportName = getEsmExportName;
	function regexpCode(rx) {
		return new _Code(rx.toString());
	}
	exports.regexpCode = regexpCode;
}));
//#endregion
//#region node_modules/@modelcontextprotocol/sdk/node_modules/ajv/dist/compile/codegen/scope.js
var require_scope$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ValueScope = exports.ValueScopeName = exports.Scope = exports.varKinds = exports.UsedValueState = void 0;
	var code_1 = require_code$3();
	var ValueError = class extends Error {
		constructor(name) {
			super(`CodeGen: "code" for ${name} not defined`);
			this.value = name.value;
		}
	};
	var UsedValueState;
	(function(UsedValueState) {
		UsedValueState[UsedValueState["Started"] = 0] = "Started";
		UsedValueState[UsedValueState["Completed"] = 1] = "Completed";
	})(UsedValueState || (exports.UsedValueState = UsedValueState = {}));
	exports.varKinds = {
		const: new code_1.Name("const"),
		let: new code_1.Name("let"),
		var: new code_1.Name("var")
	};
	var Scope = class {
		constructor({ prefixes, parent } = {}) {
			this._names = {};
			this._prefixes = prefixes;
			this._parent = parent;
		}
		toName(nameOrPrefix) {
			return nameOrPrefix instanceof code_1.Name ? nameOrPrefix : this.name(nameOrPrefix);
		}
		name(prefix) {
			return new code_1.Name(this._newName(prefix));
		}
		_newName(prefix) {
			const ng = this._names[prefix] || this._nameGroup(prefix);
			return `${prefix}${ng.index++}`;
		}
		_nameGroup(prefix) {
			var _a, _b;
			if (((_b = (_a = this._parent) === null || _a === void 0 ? void 0 : _a._prefixes) === null || _b === void 0 ? void 0 : _b.has(prefix)) || this._prefixes && !this._prefixes.has(prefix)) throw new Error(`CodeGen: prefix "${prefix}" is not allowed in this scope`);
			return this._names[prefix] = {
				prefix,
				index: 0
			};
		}
	};
	exports.Scope = Scope;
	var ValueScopeName = class extends code_1.Name {
		constructor(prefix, nameStr) {
			super(nameStr);
			this.prefix = prefix;
		}
		setValue(value, { property, itemIndex }) {
			this.value = value;
			this.scopePath = (0, code_1._)`.${new code_1.Name(property)}[${itemIndex}]`;
		}
	};
	exports.ValueScopeName = ValueScopeName;
	var line = (0, code_1._)`\n`;
	var ValueScope = class extends Scope {
		constructor(opts) {
			super(opts);
			this._values = {};
			this._scope = opts.scope;
			this.opts = {
				...opts,
				_n: opts.lines ? line : code_1.nil
			};
		}
		get() {
			return this._scope;
		}
		name(prefix) {
			return new ValueScopeName(prefix, this._newName(prefix));
		}
		value(nameOrPrefix, value) {
			var _a;
			if (value.ref === void 0) throw new Error("CodeGen: ref must be passed in value");
			const name = this.toName(nameOrPrefix);
			const { prefix } = name;
			const valueKey = (_a = value.key) !== null && _a !== void 0 ? _a : value.ref;
			let vs = this._values[prefix];
			if (vs) {
				const _name = vs.get(valueKey);
				if (_name) return _name;
			} else vs = this._values[prefix] = /* @__PURE__ */ new Map();
			vs.set(valueKey, name);
			const s = this._scope[prefix] || (this._scope[prefix] = []);
			const itemIndex = s.length;
			s[itemIndex] = value.ref;
			name.setValue(value, {
				property: prefix,
				itemIndex
			});
			return name;
		}
		getValue(prefix, keyOrRef) {
			const vs = this._values[prefix];
			if (!vs) return;
			return vs.get(keyOrRef);
		}
		scopeRefs(scopeName, values = this._values) {
			return this._reduceValues(values, (name) => {
				if (name.scopePath === void 0) throw new Error(`CodeGen: name "${name}" has no value`);
				return (0, code_1._)`${scopeName}${name.scopePath}`;
			});
		}
		scopeCode(values = this._values, usedValues, getCode) {
			return this._reduceValues(values, (name) => {
				if (name.value === void 0) throw new Error(`CodeGen: name "${name}" has no value`);
				return name.value.code;
			}, usedValues, getCode);
		}
		_reduceValues(values, valueCode, usedValues = {}, getCode) {
			let code = code_1.nil;
			for (const prefix in values) {
				const vs = values[prefix];
				if (!vs) continue;
				const nameSet = usedValues[prefix] = usedValues[prefix] || /* @__PURE__ */ new Map();
				vs.forEach((name) => {
					if (nameSet.has(name)) return;
					nameSet.set(name, UsedValueState.Started);
					let c = valueCode(name);
					if (c) {
						const def = this.opts.es5 ? exports.varKinds.var : exports.varKinds.const;
						code = (0, code_1._)`${code}${def} ${name} = ${c};${this.opts._n}`;
					} else if (c = getCode === null || getCode === void 0 ? void 0 : getCode(name)) code = (0, code_1._)`${code}${c}${this.opts._n}`;
					else throw new ValueError(name);
					nameSet.set(name, UsedValueState.Completed);
				});
			}
			return code;
		}
	};
	exports.ValueScope = ValueScope;
}));
//#endregion
//#region node_modules/@modelcontextprotocol/sdk/node_modules/ajv/dist/compile/codegen/index.js
var require_codegen$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.or = exports.and = exports.not = exports.CodeGen = exports.operators = exports.varKinds = exports.ValueScopeName = exports.ValueScope = exports.Scope = exports.Name = exports.regexpCode = exports.stringify = exports.getProperty = exports.nil = exports.strConcat = exports.str = exports._ = void 0;
	var code_1 = require_code$3();
	var scope_1 = require_scope$1();
	var code_2 = require_code$3();
	Object.defineProperty(exports, "_", {
		enumerable: true,
		get: function() {
			return code_2._;
		}
	});
	Object.defineProperty(exports, "str", {
		enumerable: true,
		get: function() {
			return code_2.str;
		}
	});
	Object.defineProperty(exports, "strConcat", {
		enumerable: true,
		get: function() {
			return code_2.strConcat;
		}
	});
	Object.defineProperty(exports, "nil", {
		enumerable: true,
		get: function() {
			return code_2.nil;
		}
	});
	Object.defineProperty(exports, "getProperty", {
		enumerable: true,
		get: function() {
			return code_2.getProperty;
		}
	});
	Object.defineProperty(exports, "stringify", {
		enumerable: true,
		get: function() {
			return code_2.stringify;
		}
	});
	Object.defineProperty(exports, "regexpCode", {
		enumerable: true,
		get: function() {
			return code_2.regexpCode;
		}
	});
	Object.defineProperty(exports, "Name", {
		enumerable: true,
		get: function() {
			return code_2.Name;
		}
	});
	var scope_2 = require_scope$1();
	Object.defineProperty(exports, "Scope", {
		enumerable: true,
		get: function() {
			return scope_2.Scope;
		}
	});
	Object.defineProperty(exports, "ValueScope", {
		enumerable: true,
		get: function() {
			return scope_2.ValueScope;
		}
	});
	Object.defineProperty(exports, "ValueScopeName", {
		enumerable: true,
		get: function() {
			return scope_2.ValueScopeName;
		}
	});
	Object.defineProperty(exports, "varKinds", {
		enumerable: true,
		get: function() {
			return scope_2.varKinds;
		}
	});
	exports.operators = {
		GT: new code_1._Code(">"),
		GTE: new code_1._Code(">="),
		LT: new code_1._Code("<"),
		LTE: new code_1._Code("<="),
		EQ: new code_1._Code("==="),
		NEQ: new code_1._Code("!=="),
		NOT: new code_1._Code("!"),
		OR: new code_1._Code("||"),
		AND: new code_1._Code("&&"),
		ADD: new code_1._Code("+")
	};
	var Node = class {
		optimizeNodes() {
			return this;
		}
		optimizeNames(_names, _constants) {
			return this;
		}
	};
	var Def = class extends Node {
		constructor(varKind, name, rhs) {
			super();
			this.varKind = varKind;
			this.name = name;
			this.rhs = rhs;
		}
		render({ es5, _n }) {
			const varKind = es5 ? scope_1.varKinds.var : this.varKind;
			const rhs = this.rhs === void 0 ? "" : ` = ${this.rhs}`;
			return `${varKind} ${this.name}${rhs};` + _n;
		}
		optimizeNames(names, constants) {
			if (!names[this.name.str]) return;
			if (this.rhs) this.rhs = optimizeExpr(this.rhs, names, constants);
			return this;
		}
		get names() {
			return this.rhs instanceof code_1._CodeOrName ? this.rhs.names : {};
		}
	};
	var Assign = class extends Node {
		constructor(lhs, rhs, sideEffects) {
			super();
			this.lhs = lhs;
			this.rhs = rhs;
			this.sideEffects = sideEffects;
		}
		render({ _n }) {
			return `${this.lhs} = ${this.rhs};` + _n;
		}
		optimizeNames(names, constants) {
			if (this.lhs instanceof code_1.Name && !names[this.lhs.str] && !this.sideEffects) return;
			this.rhs = optimizeExpr(this.rhs, names, constants);
			return this;
		}
		get names() {
			return addExprNames(this.lhs instanceof code_1.Name ? {} : { ...this.lhs.names }, this.rhs);
		}
	};
	var AssignOp = class extends Assign {
		constructor(lhs, op, rhs, sideEffects) {
			super(lhs, rhs, sideEffects);
			this.op = op;
		}
		render({ _n }) {
			return `${this.lhs} ${this.op}= ${this.rhs};` + _n;
		}
	};
	var Label = class extends Node {
		constructor(label) {
			super();
			this.label = label;
			this.names = {};
		}
		render({ _n }) {
			return `${this.label}:` + _n;
		}
	};
	var Break = class extends Node {
		constructor(label) {
			super();
			this.label = label;
			this.names = {};
		}
		render({ _n }) {
			return `break${this.label ? ` ${this.label}` : ""};` + _n;
		}
	};
	var Throw = class extends Node {
		constructor(error) {
			super();
			this.error = error;
		}
		render({ _n }) {
			return `throw ${this.error};` + _n;
		}
		get names() {
			return this.error.names;
		}
	};
	var AnyCode = class extends Node {
		constructor(code) {
			super();
			this.code = code;
		}
		render({ _n }) {
			return `${this.code};` + _n;
		}
		optimizeNodes() {
			return `${this.code}` ? this : void 0;
		}
		optimizeNames(names, constants) {
			this.code = optimizeExpr(this.code, names, constants);
			return this;
		}
		get names() {
			return this.code instanceof code_1._CodeOrName ? this.code.names : {};
		}
	};
	var ParentNode = class extends Node {
		constructor(nodes = []) {
			super();
			this.nodes = nodes;
		}
		render(opts) {
			return this.nodes.reduce((code, n) => code + n.render(opts), "");
		}
		optimizeNodes() {
			const { nodes } = this;
			let i = nodes.length;
			while (i--) {
				const n = nodes[i].optimizeNodes();
				if (Array.isArray(n)) nodes.splice(i, 1, ...n);
				else if (n) nodes[i] = n;
				else nodes.splice(i, 1);
			}
			return nodes.length > 0 ? this : void 0;
		}
		optimizeNames(names, constants) {
			const { nodes } = this;
			let i = nodes.length;
			while (i--) {
				const n = nodes[i];
				if (n.optimizeNames(names, constants)) continue;
				subtractNames(names, n.names);
				nodes.splice(i, 1);
			}
			return nodes.length > 0 ? this : void 0;
		}
		get names() {
			return this.nodes.reduce((names, n) => addNames(names, n.names), {});
		}
	};
	var BlockNode = class extends ParentNode {
		render(opts) {
			return "{" + opts._n + super.render(opts) + "}" + opts._n;
		}
	};
	var Root = class extends ParentNode {};
	var Else = class extends BlockNode {};
	Else.kind = "else";
	var If = class If extends BlockNode {
		constructor(condition, nodes) {
			super(nodes);
			this.condition = condition;
		}
		render(opts) {
			let code = `if(${this.condition})` + super.render(opts);
			if (this.else) code += "else " + this.else.render(opts);
			return code;
		}
		optimizeNodes() {
			super.optimizeNodes();
			const cond = this.condition;
			if (cond === true) return this.nodes;
			let e = this.else;
			if (e) {
				const ns = e.optimizeNodes();
				e = this.else = Array.isArray(ns) ? new Else(ns) : ns;
			}
			if (e) {
				if (cond === false) return e instanceof If ? e : e.nodes;
				if (this.nodes.length) return this;
				return new If(not(cond), e instanceof If ? [e] : e.nodes);
			}
			if (cond === false || !this.nodes.length) return void 0;
			return this;
		}
		optimizeNames(names, constants) {
			var _a;
			this.else = (_a = this.else) === null || _a === void 0 ? void 0 : _a.optimizeNames(names, constants);
			if (!(super.optimizeNames(names, constants) || this.else)) return;
			this.condition = optimizeExpr(this.condition, names, constants);
			return this;
		}
		get names() {
			const names = super.names;
			addExprNames(names, this.condition);
			if (this.else) addNames(names, this.else.names);
			return names;
		}
	};
	If.kind = "if";
	var For = class extends BlockNode {};
	For.kind = "for";
	var ForLoop = class extends For {
		constructor(iteration) {
			super();
			this.iteration = iteration;
		}
		render(opts) {
			return `for(${this.iteration})` + super.render(opts);
		}
		optimizeNames(names, constants) {
			if (!super.optimizeNames(names, constants)) return;
			this.iteration = optimizeExpr(this.iteration, names, constants);
			return this;
		}
		get names() {
			return addNames(super.names, this.iteration.names);
		}
	};
	var ForRange = class extends For {
		constructor(varKind, name, from, to) {
			super();
			this.varKind = varKind;
			this.name = name;
			this.from = from;
			this.to = to;
		}
		render(opts) {
			const varKind = opts.es5 ? scope_1.varKinds.var : this.varKind;
			const { name, from, to } = this;
			return `for(${varKind} ${name}=${from}; ${name}<${to}; ${name}++)` + super.render(opts);
		}
		get names() {
			return addExprNames(addExprNames(super.names, this.from), this.to);
		}
	};
	var ForIter = class extends For {
		constructor(loop, varKind, name, iterable) {
			super();
			this.loop = loop;
			this.varKind = varKind;
			this.name = name;
			this.iterable = iterable;
		}
		render(opts) {
			return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render(opts);
		}
		optimizeNames(names, constants) {
			if (!super.optimizeNames(names, constants)) return;
			this.iterable = optimizeExpr(this.iterable, names, constants);
			return this;
		}
		get names() {
			return addNames(super.names, this.iterable.names);
		}
	};
	var Func = class extends BlockNode {
		constructor(name, args, async) {
			super();
			this.name = name;
			this.args = args;
			this.async = async;
		}
		render(opts) {
			return `${this.async ? "async " : ""}function ${this.name}(${this.args})` + super.render(opts);
		}
	};
	Func.kind = "func";
	var Return = class extends ParentNode {
		render(opts) {
			return "return " + super.render(opts);
		}
	};
	Return.kind = "return";
	var Try = class extends BlockNode {
		render(opts) {
			let code = "try" + super.render(opts);
			if (this.catch) code += this.catch.render(opts);
			if (this.finally) code += this.finally.render(opts);
			return code;
		}
		optimizeNodes() {
			var _a, _b;
			super.optimizeNodes();
			(_a = this.catch) === null || _a === void 0 || _a.optimizeNodes();
			(_b = this.finally) === null || _b === void 0 || _b.optimizeNodes();
			return this;
		}
		optimizeNames(names, constants) {
			var _a, _b;
			super.optimizeNames(names, constants);
			(_a = this.catch) === null || _a === void 0 || _a.optimizeNames(names, constants);
			(_b = this.finally) === null || _b === void 0 || _b.optimizeNames(names, constants);
			return this;
		}
		get names() {
			const names = super.names;
			if (this.catch) addNames(names, this.catch.names);
			if (this.finally) addNames(names, this.finally.names);
			return names;
		}
	};
	var Catch = class extends BlockNode {
		constructor(error) {
			super();
			this.error = error;
		}
		render(opts) {
			return `catch(${this.error})` + super.render(opts);
		}
	};
	Catch.kind = "catch";
	var Finally = class extends BlockNode {
		render(opts) {
			return "finally" + super.render(opts);
		}
	};
	Finally.kind = "finally";
	var CodeGen = class {
		constructor(extScope, opts = {}) {
			this._values = {};
			this._blockStarts = [];
			this._constants = {};
			this.opts = {
				...opts,
				_n: opts.lines ? "\n" : ""
			};
			this._extScope = extScope;
			this._scope = new scope_1.Scope({ parent: extScope });
			this._nodes = [new Root()];
		}
		toString() {
			return this._root.render(this.opts);
		}
		name(prefix) {
			return this._scope.name(prefix);
		}
		scopeName(prefix) {
			return this._extScope.name(prefix);
		}
		scopeValue(prefixOrName, value) {
			const name = this._extScope.value(prefixOrName, value);
			(this._values[name.prefix] || (this._values[name.prefix] = /* @__PURE__ */ new Set())).add(name);
			return name;
		}
		getScopeValue(prefix, keyOrRef) {
			return this._extScope.getValue(prefix, keyOrRef);
		}
		scopeRefs(scopeName) {
			return this._extScope.scopeRefs(scopeName, this._values);
		}
		scopeCode() {
			return this._extScope.scopeCode(this._values);
		}
		_def(varKind, nameOrPrefix, rhs, constant) {
			const name = this._scope.toName(nameOrPrefix);
			if (rhs !== void 0 && constant) this._constants[name.str] = rhs;
			this._leafNode(new Def(varKind, name, rhs));
			return name;
		}
		const(nameOrPrefix, rhs, _constant) {
			return this._def(scope_1.varKinds.const, nameOrPrefix, rhs, _constant);
		}
		let(nameOrPrefix, rhs, _constant) {
			return this._def(scope_1.varKinds.let, nameOrPrefix, rhs, _constant);
		}
		var(nameOrPrefix, rhs, _constant) {
			return this._def(scope_1.varKinds.var, nameOrPrefix, rhs, _constant);
		}
		assign(lhs, rhs, sideEffects) {
			return this._leafNode(new Assign(lhs, rhs, sideEffects));
		}
		add(lhs, rhs) {
			return this._leafNode(new AssignOp(lhs, exports.operators.ADD, rhs));
		}
		code(c) {
			if (typeof c == "function") c();
			else if (c !== code_1.nil) this._leafNode(new AnyCode(c));
			return this;
		}
		object(...keyValues) {
			const code = ["{"];
			for (const [key, value] of keyValues) {
				if (code.length > 1) code.push(",");
				code.push(key);
				if (key !== value || this.opts.es5) {
					code.push(":");
					(0, code_1.addCodeArg)(code, value);
				}
			}
			code.push("}");
			return new code_1._Code(code);
		}
		if(condition, thenBody, elseBody) {
			this._blockNode(new If(condition));
			if (thenBody && elseBody) this.code(thenBody).else().code(elseBody).endIf();
			else if (thenBody) this.code(thenBody).endIf();
			else if (elseBody) throw new Error("CodeGen: \"else\" body without \"then\" body");
			return this;
		}
		elseIf(condition) {
			return this._elseNode(new If(condition));
		}
		else() {
			return this._elseNode(new Else());
		}
		endIf() {
			return this._endBlockNode(If, Else);
		}
		_for(node, forBody) {
			this._blockNode(node);
			if (forBody) this.code(forBody).endFor();
			return this;
		}
		for(iteration, forBody) {
			return this._for(new ForLoop(iteration), forBody);
		}
		forRange(nameOrPrefix, from, to, forBody, varKind = this.opts.es5 ? scope_1.varKinds.var : scope_1.varKinds.let) {
			const name = this._scope.toName(nameOrPrefix);
			return this._for(new ForRange(varKind, name, from, to), () => forBody(name));
		}
		forOf(nameOrPrefix, iterable, forBody, varKind = scope_1.varKinds.const) {
			const name = this._scope.toName(nameOrPrefix);
			if (this.opts.es5) {
				const arr = iterable instanceof code_1.Name ? iterable : this.var("_arr", iterable);
				return this.forRange("_i", 0, (0, code_1._)`${arr}.length`, (i) => {
					this.var(name, (0, code_1._)`${arr}[${i}]`);
					forBody(name);
				});
			}
			return this._for(new ForIter("of", varKind, name, iterable), () => forBody(name));
		}
		forIn(nameOrPrefix, obj, forBody, varKind = this.opts.es5 ? scope_1.varKinds.var : scope_1.varKinds.const) {
			if (this.opts.ownProperties) return this.forOf(nameOrPrefix, (0, code_1._)`Object.keys(${obj})`, forBody);
			const name = this._scope.toName(nameOrPrefix);
			return this._for(new ForIter("in", varKind, name, obj), () => forBody(name));
		}
		endFor() {
			return this._endBlockNode(For);
		}
		label(label) {
			return this._leafNode(new Label(label));
		}
		break(label) {
			return this._leafNode(new Break(label));
		}
		return(value) {
			const node = new Return();
			this._blockNode(node);
			this.code(value);
			if (node.nodes.length !== 1) throw new Error("CodeGen: \"return\" should have one node");
			return this._endBlockNode(Return);
		}
		try(tryBody, catchCode, finallyCode) {
			if (!catchCode && !finallyCode) throw new Error("CodeGen: \"try\" without \"catch\" and \"finally\"");
			const node = new Try();
			this._blockNode(node);
			this.code(tryBody);
			if (catchCode) {
				const error = this.name("e");
				this._currNode = node.catch = new Catch(error);
				catchCode(error);
			}
			if (finallyCode) {
				this._currNode = node.finally = new Finally();
				this.code(finallyCode);
			}
			return this._endBlockNode(Catch, Finally);
		}
		throw(error) {
			return this._leafNode(new Throw(error));
		}
		block(body, nodeCount) {
			this._blockStarts.push(this._nodes.length);
			if (body) this.code(body).endBlock(nodeCount);
			return this;
		}
		endBlock(nodeCount) {
			const len = this._blockStarts.pop();
			if (len === void 0) throw new Error("CodeGen: not in self-balancing block");
			const toClose = this._nodes.length - len;
			if (toClose < 0 || nodeCount !== void 0 && toClose !== nodeCount) throw new Error(`CodeGen: wrong number of nodes: ${toClose} vs ${nodeCount} expected`);
			this._nodes.length = len;
			return this;
		}
		func(name, args = code_1.nil, async, funcBody) {
			this._blockNode(new Func(name, args, async));
			if (funcBody) this.code(funcBody).endFunc();
			return this;
		}
		endFunc() {
			return this._endBlockNode(Func);
		}
		optimize(n = 1) {
			while (n-- > 0) {
				this._root.optimizeNodes();
				this._root.optimizeNames(this._root.names, this._constants);
			}
		}
		_leafNode(node) {
			this._currNode.nodes.push(node);
			return this;
		}
		_blockNode(node) {
			this._currNode.nodes.push(node);
			this._nodes.push(node);
		}
		_endBlockNode(N1, N2) {
			const n = this._currNode;
			if (n instanceof N1 || N2 && n instanceof N2) {
				this._nodes.pop();
				return this;
			}
			throw new Error(`CodeGen: not in block "${N2 ? `${N1.kind}/${N2.kind}` : N1.kind}"`);
		}
		_elseNode(node) {
			const n = this._currNode;
			if (!(n instanceof If)) throw new Error("CodeGen: \"else\" without \"if\"");
			this._currNode = n.else = node;
			return this;
		}
		get _root() {
			return this._nodes[0];
		}
		get _currNode() {
			const ns = this._nodes;
			return ns[ns.length - 1];
		}
		set _currNode(node) {
			const ns = this._nodes;
			ns[ns.length - 1] = node;
		}
	};
	exports.CodeGen = CodeGen;
	function addNames(names, from) {
		for (const n in from) names[n] = (names[n] || 0) + (from[n] || 0);
		return names;
	}
	function addExprNames(names, from) {
		return from instanceof code_1._CodeOrName ? addNames(names, from.names) : names;
	}
	function optimizeExpr(expr, names, constants) {
		if (expr instanceof code_1.Name) return replaceName(expr);
		if (!canOptimize(expr)) return expr;
		return new code_1._Code(expr._items.reduce((items, c) => {
			if (c instanceof code_1.Name) c = replaceName(c);
			if (c instanceof code_1._Code) items.push(...c._items);
			else items.push(c);
			return items;
		}, []));
		function replaceName(n) {
			const c = constants[n.str];
			if (c === void 0 || names[n.str] !== 1) return n;
			delete names[n.str];
			return c;
		}
		function canOptimize(e) {
			return e instanceof code_1._Code && e._items.some((c) => c instanceof code_1.Name && names[c.str] === 1 && constants[c.str] !== void 0);
		}
	}
	function subtractNames(names, from) {
		for (const n in from) names[n] = (names[n] || 0) - (from[n] || 0);
	}
	function not(x) {
		return typeof x == "boolean" || typeof x == "number" || x === null ? !x : (0, code_1._)`!${par(x)}`;
	}
	exports.not = not;
	var andCode = mappend(exports.operators.AND);
	function and(...args) {
		return args.reduce(andCode);
	}
	exports.and = and;
	var orCode = mappend(exports.operators.OR);
	function or(...args) {
		return args.reduce(orCode);
	}
	exports.or = or;
	function mappend(op) {
		return (x, y) => x === code_1.nil ? y : y === code_1.nil ? x : (0, code_1._)`${par(x)} ${op} ${par(y)}`;
	}
	function par(x) {
		return x instanceof code_1.Name ? x : (0, code_1._)`(${x})`;
	}
}));
//#endregion
//#region node_modules/@modelcontextprotocol/sdk/node_modules/ajv/dist/compile/util.js
var require_util$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.checkStrictMode = exports.getErrorPath = exports.Type = exports.useFunc = exports.setEvaluated = exports.evaluatedPropsToName = exports.mergeEvaluated = exports.eachItem = exports.unescapeJsonPointer = exports.escapeJsonPointer = exports.escapeFragment = exports.unescapeFragment = exports.schemaRefOrVal = exports.schemaHasRulesButRef = exports.schemaHasRules = exports.checkUnknownRules = exports.alwaysValidSchema = exports.toHash = void 0;
	var codegen_1 = require_codegen$1();
	var code_1 = require_code$3();
	function toHash(arr) {
		const hash = {};
		for (const item of arr) hash[item] = true;
		return hash;
	}
	exports.toHash = toHash;
	function alwaysValidSchema(it, schema) {
		if (typeof schema == "boolean") return schema;
		if (Object.keys(schema).length === 0) return true;
		checkUnknownRules(it, schema);
		return !schemaHasRules(schema, it.self.RULES.all);
	}
	exports.alwaysValidSchema = alwaysValidSchema;
	function checkUnknownRules(it, schema = it.schema) {
		const { opts, self } = it;
		if (!opts.strictSchema) return;
		if (typeof schema === "boolean") return;
		const rules = self.RULES.keywords;
		for (const key in schema) if (!rules[key]) checkStrictMode(it, `unknown keyword: "${key}"`);
	}
	exports.checkUnknownRules = checkUnknownRules;
	function schemaHasRules(schema, rules) {
		if (typeof schema == "boolean") return !schema;
		for (const key in schema) if (rules[key]) return true;
		return false;
	}
	exports.schemaHasRules = schemaHasRules;
	function schemaHasRulesButRef(schema, RULES) {
		if (typeof schema == "boolean") return !schema;
		for (const key in schema) if (key !== "$ref" && RULES.all[key]) return true;
		return false;
	}
	exports.schemaHasRulesButRef = schemaHasRulesButRef;
	function schemaRefOrVal({ topSchemaRef, schemaPath }, schema, keyword, $data) {
		if (!$data) {
			if (typeof schema == "number" || typeof schema == "boolean") return schema;
			if (typeof schema == "string") return (0, codegen_1._)`${schema}`;
		}
		return (0, codegen_1._)`${topSchemaRef}${schemaPath}${(0, codegen_1.getProperty)(keyword)}`;
	}
	exports.schemaRefOrVal = schemaRefOrVal;
	function unescapeFragment(str) {
		return unescapeJsonPointer(decodeURIComponent(str));
	}
	exports.unescapeFragment = unescapeFragment;
	function escapeFragment(str) {
		return encodeURIComponent(escapeJsonPointer(str));
	}
	exports.escapeFragment = escapeFragment;
	function escapeJsonPointer(str) {
		if (typeof str == "number") return `${str}`;
		return str.replace(/~/g, "~0").replace(/\//g, "~1");
	}
	exports.escapeJsonPointer = escapeJsonPointer;
	function unescapeJsonPointer(str) {
		return str.replace(/~1/g, "/").replace(/~0/g, "~");
	}
	exports.unescapeJsonPointer = unescapeJsonPointer;
	function eachItem(xs, f) {
		if (Array.isArray(xs)) for (const x of xs) f(x);
		else f(xs);
	}
	exports.eachItem = eachItem;
	function makeMergeEvaluated({ mergeNames, mergeToName, mergeValues, resultToName }) {
		return (gen, from, to, toName) => {
			const res = to === void 0 ? from : to instanceof codegen_1.Name ? (from instanceof codegen_1.Name ? mergeNames(gen, from, to) : mergeToName(gen, from, to), to) : from instanceof codegen_1.Name ? (mergeToName(gen, to, from), from) : mergeValues(from, to);
			return toName === codegen_1.Name && !(res instanceof codegen_1.Name) ? resultToName(gen, res) : res;
		};
	}
	exports.mergeEvaluated = {
		props: makeMergeEvaluated({
			mergeNames: (gen, from, to) => gen.if((0, codegen_1._)`${to} !== true && ${from} !== undefined`, () => {
				gen.if((0, codegen_1._)`${from} === true`, () => gen.assign(to, true), () => gen.assign(to, (0, codegen_1._)`${to} || {}`).code((0, codegen_1._)`Object.assign(${to}, ${from})`));
			}),
			mergeToName: (gen, from, to) => gen.if((0, codegen_1._)`${to} !== true`, () => {
				if (from === true) gen.assign(to, true);
				else {
					gen.assign(to, (0, codegen_1._)`${to} || {}`);
					setEvaluated(gen, to, from);
				}
			}),
			mergeValues: (from, to) => from === true ? true : {
				...from,
				...to
			},
			resultToName: evaluatedPropsToName
		}),
		items: makeMergeEvaluated({
			mergeNames: (gen, from, to) => gen.if((0, codegen_1._)`${to} !== true && ${from} !== undefined`, () => gen.assign(to, (0, codegen_1._)`${from} === true ? true : ${to} > ${from} ? ${to} : ${from}`)),
			mergeToName: (gen, from, to) => gen.if((0, codegen_1._)`${to} !== true`, () => gen.assign(to, from === true ? true : (0, codegen_1._)`${to} > ${from} ? ${to} : ${from}`)),
			mergeValues: (from, to) => from === true ? true : Math.max(from, to),
			resultToName: (gen, items) => gen.var("items", items)
		})
	};
	function evaluatedPropsToName(gen, ps) {
		if (ps === true) return gen.var("props", true);
		const props = gen.var("props", (0, codegen_1._)`{}`);
		if (ps !== void 0) setEvaluated(gen, props, ps);
		return props;
	}
	exports.evaluatedPropsToName = evaluatedPropsToName;
	function setEvaluated(gen, props, ps) {
		Object.keys(ps).forEach((p) => gen.assign((0, codegen_1._)`${props}${(0, codegen_1.getProperty)(p)}`, true));
	}
	exports.setEvaluated = setEvaluated;
	var snippets = {};
	function useFunc(gen, f) {
		return gen.scopeValue("func", {
			ref: f,
			code: snippets[f.code] || (snippets[f.code] = new code_1._Code(f.code))
		});
	}
	exports.useFunc = useFunc;
	var Type;
	(function(Type) {
		Type[Type["Num"] = 0] = "Num";
		Type[Type["Str"] = 1] = "Str";
	})(Type || (exports.Type = Type = {}));
	function getErrorPath(dataProp, dataPropType, jsPropertySyntax) {
		if (dataProp instanceof codegen_1.Name) {
			const isNumber = dataPropType === Type.Num;
			return jsPropertySyntax ? isNumber ? (0, codegen_1._)`"[" + ${dataProp} + "]"` : (0, codegen_1._)`"['" + ${dataProp} + "']"` : isNumber ? (0, codegen_1._)`"/" + ${dataProp}` : (0, codegen_1._)`"/" + ${dataProp}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
		}
		return jsPropertySyntax ? (0, codegen_1.getProperty)(dataProp).toString() : "/" + escapeJsonPointer(dataProp);
	}
	exports.getErrorPath = getErrorPath;
	function checkStrictMode(it, msg, mode = it.opts.strictSchema) {
		if (!mode) return;
		msg = `strict mode: ${msg}`;
		if (mode === true) throw new Error(msg);
		it.self.logger.warn(msg);
	}
	exports.checkStrictMode = checkStrictMode;
}));
//#endregion
//#region node_modules/@modelcontextprotocol/sdk/node_modules/ajv/dist/compile/names.js
var require_names$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var codegen_1 = require_codegen$1();
	exports.default = {
		data: new codegen_1.Name("data"),
		valCxt: new codegen_1.Name("valCxt"),
		instancePath: new codegen_1.Name("instancePath"),
		parentData: new codegen_1.Name("parentData"),
		parentDataProperty: new codegen_1.Name("parentDataProperty"),
		rootData: new codegen_1.Name("rootData"),
		dynamicAnchors: new codegen_1.Name("dynamicAnchors"),
		vErrors: new codegen_1.Name("vErrors"),
		errors: new codegen_1.Name("errors"),
		this: new codegen_1.Name("this"),
		self: new codegen_1.Name("self"),
		scope: new codegen_1.Name("scope"),
		json: new codegen_1.Name("json"),
		jsonPos: new codegen_1.Name("jsonPos"),
		jsonLen: new codegen_1.Name("jsonLen"),
		jsonPart: new codegen_1.Name("jsonPart")
	};
}));
//#endregion
//#region node_modules/@modelcontextprotocol/sdk/node_modules/ajv/dist/compile/errors.js
var require_errors$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.extendErrors = exports.resetErrorsCount = exports.reportExtraError = exports.reportError = exports.keyword$DataError = exports.keywordError = void 0;
	var codegen_1 = require_codegen$1();
	var util_1 = require_util$1();
	var names_1 = require_names$1();
	exports.keywordError = { message: ({ keyword }) => (0, codegen_1.str)`must pass "${keyword}" keyword validation` };
	exports.keyword$DataError = { message: ({ keyword, schemaType }) => schemaType ? (0, codegen_1.str)`"${keyword}" keyword must be ${schemaType} ($data)` : (0, codegen_1.str)`"${keyword}" keyword is invalid ($data)` };
	function reportError(cxt, error = exports.keywordError, errorPaths, overrideAllErrors) {
		const { it } = cxt;
		const { gen, compositeRule, allErrors } = it;
		const errObj = errorObjectCode(cxt, error, errorPaths);
		if (overrideAllErrors !== null && overrideAllErrors !== void 0 ? overrideAllErrors : compositeRule || allErrors) addError(gen, errObj);
		else returnErrors(it, (0, codegen_1._)`[${errObj}]`);
	}
	exports.reportError = reportError;
	function reportExtraError(cxt, error = exports.keywordError, errorPaths) {
		const { it } = cxt;
		const { gen, compositeRule, allErrors } = it;
		addError(gen, errorObjectCode(cxt, error, errorPaths));
		if (!(compositeRule || allErrors)) returnErrors(it, names_1.default.vErrors);
	}
	exports.reportExtraError = reportExtraError;
	function resetErrorsCount(gen, errsCount) {
		gen.assign(names_1.default.errors, errsCount);
		gen.if((0, codegen_1._)`${names_1.default.vErrors} !== null`, () => gen.if(errsCount, () => gen.assign((0, codegen_1._)`${names_1.default.vErrors}.length`, errsCount), () => gen.assign(names_1.default.vErrors, null)));
	}
	exports.resetErrorsCount = resetErrorsCount;
	function extendErrors({ gen, keyword, schemaValue, data, errsCount, it }) {
		/* istanbul ignore if */
		if (errsCount === void 0) throw new Error("ajv implementation error");
		const err = gen.name("err");
		gen.forRange("i", errsCount, names_1.default.errors, (i) => {
			gen.const(err, (0, codegen_1._)`${names_1.default.vErrors}[${i}]`);
			gen.if((0, codegen_1._)`${err}.instancePath === undefined`, () => gen.assign((0, codegen_1._)`${err}.instancePath`, (0, codegen_1.strConcat)(names_1.default.instancePath, it.errorPath)));
			gen.assign((0, codegen_1._)`${err}.schemaPath`, (0, codegen_1.str)`${it.errSchemaPath}/${keyword}`);
			if (it.opts.verbose) {
				gen.assign((0, codegen_1._)`${err}.schema`, schemaValue);
				gen.assign((0, codegen_1._)`${err}.data`, data);
			}
		});
	}
	exports.extendErrors = extendErrors;
	function addError(gen, errObj) {
		const err = gen.const("err", errObj);
		gen.if((0, codegen_1._)`${names_1.default.vErrors} === null`, () => gen.assign(names_1.default.vErrors, (0, codegen_1._)`[${err}]`), (0, codegen_1._)`${names_1.default.vErrors}.push(${err})`);
		gen.code((0, codegen_1._)`${names_1.default.errors}++`);
	}
	function returnErrors(it, errs) {
		const { gen, validateName, schemaEnv } = it;
		if (schemaEnv.$async) gen.throw((0, codegen_1._)`new ${it.ValidationError}(${errs})`);
		else {
			gen.assign((0, codegen_1._)`${validateName}.errors`, errs);
			gen.return(false);
		}
	}
	var E = {
		keyword: new codegen_1.Name("keyword"),
		schemaPath: new codegen_1.Name("schemaPath"),
		params: new codegen_1.Name("params"),
		propertyName: new codegen_1.Name("propertyName"),
		message: new codegen_1.Name("message"),
		schema: new codegen_1.Name("schema"),
		parentSchema: new codegen_1.Name("parentSchema")
	};
	function errorObjectCode(cxt, error, errorPaths) {
		const { createErrors } = cxt.it;
		if (createErrors === false) return (0, codegen_1._)`{}`;
		return errorObject(cxt, error, errorPaths);
	}
	function errorObject(cxt, error, errorPaths = {}) {
		const { gen, it } = cxt;
		const keyValues = [errorInstancePath(it, errorPaths), errorSchemaPath(cxt, errorPaths)];
		extraErrorProps(cxt, error, keyValues);
		return gen.object(...keyValues);
	}
	function errorInstancePath({ errorPath }, { instancePath }) {
		const instPath = instancePath ? (0, codegen_1.str)`${errorPath}${(0, util_1.getErrorPath)(instancePath, util_1.Type.Str)}` : errorPath;
		return [names_1.default.instancePath, (0, codegen_1.strConcat)(names_1.default.instancePath, instPath)];
	}
	function errorSchemaPath({ keyword, it: { errSchemaPath } }, { schemaPath, parentSchema }) {
		let schPath = parentSchema ? errSchemaPath : (0, codegen_1.str)`${errSchemaPath}/${keyword}`;
		if (schemaPath) schPath = (0, codegen_1.str)`${schPath}${(0, util_1.getErrorPath)(schemaPath, util_1.Type.Str)}`;
		return [E.schemaPath, schPath];
	}
	function extraErrorProps(cxt, { params, message }, keyValues) {
		const { keyword, data, schemaValue, it } = cxt;
		const { opts, propertyName, topSchemaRef, schemaPath } = it;
		keyValues.push([E.keyword, keyword], [E.params, typeof params == "function" ? params(cxt) : params || (0, codegen_1._)`{}`]);
		if (opts.messages) keyValues.push([E.message, typeof message == "function" ? message(cxt) : message]);
		if (opts.verbose) keyValues.push([E.schema, schemaValue], [E.parentSchema, (0, codegen_1._)`${topSchemaRef}${schemaPath}`], [names_1.default.data, data]);
		if (propertyName) keyValues.push([E.propertyName, propertyName]);
	}
}));
//#endregion
//#region node_modules/@modelcontextprotocol/sdk/node_modules/ajv/dist/compile/validate/boolSchema.js
var require_boolSchema$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.boolOrEmptySchema = exports.topBoolOrEmptySchema = void 0;
	var errors_1 = require_errors$1();
	var codegen_1 = require_codegen$1();
	var names_1 = require_names$1();
	var boolError = { message: "boolean schema is false" };
	function topBoolOrEmptySchema(it) {
		const { gen, schema, validateName } = it;
		if (schema === false) falseSchemaError(it, false);
		else if (typeof schema == "object" && schema.$async === true) gen.return(names_1.default.data);
		else {
			gen.assign((0, codegen_1._)`${validateName}.errors`, null);
			gen.return(true);
		}
	}
	exports.topBoolOrEmptySchema = topBoolOrEmptySchema;
	function boolOrEmptySchema(it, valid) {
		const { gen, schema } = it;
		if (schema === false) {
			gen.var(valid, false);
			falseSchemaError(it);
		} else gen.var(valid, true);
	}
	exports.boolOrEmptySchema = boolOrEmptySchema;
	function falseSchemaError(it, overrideAllErrors) {
		const { gen, data } = it;
		const cxt = {
			gen,
			keyword: "false schema",
			data,
			schema: false,
			schemaCode: false,
			schemaValue: false,
			params: {},
			it
		};
		(0, errors_1.reportError)(cxt, boolError, void 0, overrideAllErrors);
	}
}));
//#endregion
//#region node_modules/@modelcontextprotocol/sdk/node_modules/ajv/dist/compile/rules.js
var require_rules$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.getRules = exports.isJSONType = void 0;
	var jsonTypes = /* @__PURE__ */ new Set([
		"string",
		"number",
		"integer",
		"boolean",
		"null",
		"object",
		"array"
	]);
	function isJSONType(x) {
		return typeof x == "string" && jsonTypes.has(x);
	}
	exports.isJSONType = isJSONType;
	function getRules() {
		const groups = {
			number: {
				type: "number",
				rules: []
			},
			string: {
				type: "string",
				rules: []
			},
			array: {
				type: "array",
				rules: []
			},
			object: {
				type: "object",
				rules: []
			}
		};
		return {
			types: {
				...groups,
				integer: true,
				boolean: true,
				null: true
			},
			rules: [
				{ rules: [] },
				groups.number,
				groups.string,
				groups.array,
				groups.object
			],
			post: { rules: [] },
			all: {},
			keywords: {}
		};
	}
	exports.getRules = getRules;
}));
//#endregion
//#region node_modules/@modelcontextprotocol/sdk/node_modules/ajv/dist/compile/validate/applicability.js
var require_applicability$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.shouldUseRule = exports.shouldUseGroup = exports.schemaHasRulesForType = void 0;
	function schemaHasRulesForType({ schema, self }, type) {
		const group = self.RULES.types[type];
		return group && group !== true && shouldUseGroup(schema, group);
	}
	exports.schemaHasRulesForType = schemaHasRulesForType;
	function shouldUseGroup(schema, group) {
		return group.rules.some((rule) => shouldUseRule(schema, rule));
	}
	exports.shouldUseGroup = shouldUseGroup;
	function shouldUseRule(schema, rule) {
		var _a;
		return schema[rule.keyword] !== void 0 || ((_a = rule.definition.implements) === null || _a === void 0 ? void 0 : _a.some((kwd) => schema[kwd] !== void 0));
	}
	exports.shouldUseRule = shouldUseRule;
}));
//#endregion
//#region node_modules/@modelcontextprotocol/sdk/node_modules/ajv/dist/compile/validate/dataType.js
var require_dataType$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.reportTypeError = exports.checkDataTypes = exports.checkDataType = exports.coerceAndCheckDataType = exports.getJSONTypes = exports.getSchemaTypes = exports.DataType = void 0;
	var rules_1 = require_rules$1();
	var applicability_1 = require_applicability$1();
	var errors_1 = require_errors$1();
	var codegen_1 = require_codegen$1();
	var util_1 = require_util$1();
	var DataType;
	(function(DataType) {
		DataType[DataType["Correct"] = 0] = "Correct";
		DataType[DataType["Wrong"] = 1] = "Wrong";
	})(DataType || (exports.DataType = DataType = {}));
	function getSchemaTypes(schema) {
		const types = getJSONTypes(schema.type);
		if (types.includes("null")) {
			if (schema.nullable === false) throw new Error("type: null contradicts nullable: false");
		} else {
			if (!types.length && schema.nullable !== void 0) throw new Error("\"nullable\" cannot be used without \"type\"");
			if (schema.nullable === true) types.push("null");
		}
		return types;
	}
	exports.getSchemaTypes = getSchemaTypes;
	function getJSONTypes(ts) {
		const types = Array.isArray(ts) ? ts : ts ? [ts] : [];
		if (types.every(rules_1.isJSONType)) return types;
		throw new Error("type must be JSONType or JSONType[]: " + types.join(","));
	}
	exports.getJSONTypes = getJSONTypes;
	function coerceAndCheckDataType(it, types) {
		const { gen, data, opts } = it;
		const coerceTo = coerceToTypes(types, opts.coerceTypes);
		const checkTypes = types.length > 0 && !(coerceTo.length === 0 && types.length === 1 && (0, applicability_1.schemaHasRulesForType)(it, types[0]));
		if (checkTypes) {
			const wrongType = checkDataTypes(types, data, opts.strictNumbers, DataType.Wrong);
			gen.if(wrongType, () => {
				if (coerceTo.length) coerceData(it, types, coerceTo);
				else reportTypeError(it);
			});
		}
		return checkTypes;
	}
	exports.coerceAndCheckDataType = coerceAndCheckDataType;
	var COERCIBLE = /* @__PURE__ */ new Set([
		"string",
		"number",
		"integer",
		"boolean",
		"null"
	]);
	function coerceToTypes(types, coerceTypes) {
		return coerceTypes ? types.filter((t) => COERCIBLE.has(t) || coerceTypes === "array" && t === "array") : [];
	}
	function coerceData(it, types, coerceTo) {
		const { gen, data, opts } = it;
		const dataType = gen.let("dataType", (0, codegen_1._)`typeof ${data}`);
		const coerced = gen.let("coerced", (0, codegen_1._)`undefined`);
		if (opts.coerceTypes === "array") gen.if((0, codegen_1._)`${dataType} == 'object' && Array.isArray(${data}) && ${data}.length == 1`, () => gen.assign(data, (0, codegen_1._)`${data}[0]`).assign(dataType, (0, codegen_1._)`typeof ${data}`).if(checkDataTypes(types, data, opts.strictNumbers), () => gen.assign(coerced, data)));
		gen.if((0, codegen_1._)`${coerced} !== undefined`);
		for (const t of coerceTo) if (COERCIBLE.has(t) || t === "array" && opts.coerceTypes === "array") coerceSpecificType(t);
		gen.else();
		reportTypeError(it);
		gen.endIf();
		gen.if((0, codegen_1._)`${coerced} !== undefined`, () => {
			gen.assign(data, coerced);
			assignParentData(it, coerced);
		});
		function coerceSpecificType(t) {
			switch (t) {
				case "string":
					gen.elseIf((0, codegen_1._)`${dataType} == "number" || ${dataType} == "boolean"`).assign(coerced, (0, codegen_1._)`"" + ${data}`).elseIf((0, codegen_1._)`${data} === null`).assign(coerced, (0, codegen_1._)`""`);
					return;
				case "number":
					gen.elseIf((0, codegen_1._)`${dataType} == "boolean" || ${data} === null
              || (${dataType} == "string" && ${data} && ${data} == +${data})`).assign(coerced, (0, codegen_1._)`+${data}`);
					return;
				case "integer":
					gen.elseIf((0, codegen_1._)`${dataType} === "boolean" || ${data} === null
              || (${dataType} === "string" && ${data} && ${data} == +${data} && !(${data} % 1))`).assign(coerced, (0, codegen_1._)`+${data}`);
					return;
				case "boolean":
					gen.elseIf((0, codegen_1._)`${data} === "false" || ${data} === 0 || ${data} === null`).assign(coerced, false).elseIf((0, codegen_1._)`${data} === "true" || ${data} === 1`).assign(coerced, true);
					return;
				case "null":
					gen.elseIf((0, codegen_1._)`${data} === "" || ${data} === 0 || ${data} === false`);
					gen.assign(coerced, null);
					return;
				case "array": gen.elseIf((0, codegen_1._)`${dataType} === "string" || ${dataType} === "number"
              || ${dataType} === "boolean" || ${data} === null`).assign(coerced, (0, codegen_1._)`[${data}]`);
			}
		}
	}
	function assignParentData({ gen, parentData, parentDataProperty }, expr) {
		gen.if((0, codegen_1._)`${parentData} !== undefined`, () => gen.assign((0, codegen_1._)`${parentData}[${parentDataProperty}]`, expr));
	}
	function checkDataType(dataType, data, strictNums, correct = DataType.Correct) {
		const EQ = correct === DataType.Correct ? codegen_1.operators.EQ : codegen_1.operators.NEQ;
		let cond;
		switch (dataType) {
			case "null": return (0, codegen_1._)`${data} ${EQ} null`;
			case "array":
				cond = (0, codegen_1._)`Array.isArray(${data})`;
				break;
			case "object":
				cond = (0, codegen_1._)`${data} && typeof ${data} == "object" && !Array.isArray(${data})`;
				break;
			case "integer":
				cond = numCond((0, codegen_1._)`!(${data} % 1) && !isNaN(${data})`);
				break;
			case "number":
				cond = numCond();
				break;
			default: return (0, codegen_1._)`typeof ${data} ${EQ} ${dataType}`;
		}
		return correct === DataType.Correct ? cond : (0, codegen_1.not)(cond);
		function numCond(_cond = codegen_1.nil) {
			return (0, codegen_1.and)((0, codegen_1._)`typeof ${data} == "number"`, _cond, strictNums ? (0, codegen_1._)`isFinite(${data})` : codegen_1.nil);
		}
	}
	exports.checkDataType = checkDataType;
	function checkDataTypes(dataTypes, data, strictNums, correct) {
		if (dataTypes.length === 1) return checkDataType(dataTypes[0], data, strictNums, correct);
		let cond;
		const types = (0, util_1.toHash)(dataTypes);
		if (types.array && types.object) {
			const notObj = (0, codegen_1._)`typeof ${data} != "object"`;
			cond = types.null ? notObj : (0, codegen_1._)`!${data} || ${notObj}`;
			delete types.null;
			delete types.array;
			delete types.object;
		} else cond = codegen_1.nil;
		if (types.number) delete types.integer;
		for (const t in types) cond = (0, codegen_1.and)(cond, checkDataType(t, data, strictNums, correct));
		return cond;
	}
	exports.checkDataTypes = checkDataTypes;
	var typeError = {
		message: ({ schema }) => `must be ${schema}`,
		params: ({ schema, schemaValue }) => typeof schema == "string" ? (0, codegen_1._)`{type: ${schema}}` : (0, codegen_1._)`{type: ${schemaValue}}`
	};
	function reportTypeError(it) {
		const cxt = getTypeErrorContext(it);
		(0, errors_1.reportError)(cxt, typeError);
	}
	exports.reportTypeError = reportTypeError;
	function getTypeErrorContext(it) {
		const { gen, data, schema } = it;
		const schemaCode = (0, util_1.schemaRefOrVal)(it, schema, "type");
		return {
			gen,
			keyword: "type",
			data,
			schema: schema.type,
			schemaCode,
			schemaValue: schemaCode,
			parentSchema: schema,
			params: {},
			it
		};
	}
}));
//#endregion
//#region node_modules/@modelcontextprotocol/sdk/node_modules/ajv/dist/compile/validate/defaults.js
var require_defaults$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.assignDefaults = void 0;
	var codegen_1 = require_codegen$1();
	var util_1 = require_util$1();
	function assignDefaults(it, ty) {
		const { properties, items } = it.schema;
		if (ty === "object" && properties) for (const key in properties) assignDefault(it, key, properties[key].default);
		else if (ty === "array" && Array.isArray(items)) items.forEach((sch, i) => assignDefault(it, i, sch.default));
	}
	exports.assignDefaults = assignDefaults;
	function assignDefault(it, prop, defaultValue) {
		const { gen, compositeRule, data, opts } = it;
		if (defaultValue === void 0) return;
		const childData = (0, codegen_1._)`${data}${(0, codegen_1.getProperty)(prop)}`;
		if (compositeRule) {
			(0, util_1.checkStrictMode)(it, `default is ignored for: ${childData}`);
			return;
		}
		let condition = (0, codegen_1._)`${childData} === undefined`;
		if (opts.useDefaults === "empty") condition = (0, codegen_1._)`${condition} || ${childData} === null || ${childData} === ""`;
		gen.if(condition, (0, codegen_1._)`${childData} = ${(0, codegen_1.stringify)(defaultValue)}`);
	}
}));
//#endregion
//#region node_modules/@modelcontextprotocol/sdk/node_modules/ajv/dist/vocabularies/code.js
var require_code$2 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.validateUnion = exports.validateArray = exports.usePattern = exports.callValidateCode = exports.schemaProperties = exports.allSchemaProperties = exports.noPropertyInData = exports.propertyInData = exports.isOwnProperty = exports.hasPropFunc = exports.reportMissingProp = exports.checkMissingProp = exports.checkReportMissingProp = void 0;
	var codegen_1 = require_codegen$1();
	var util_1 = require_util$1();
	var names_1 = require_names$1();
	var util_2 = require_util$1();
	function checkReportMissingProp(cxt, prop) {
		const { gen, data, it } = cxt;
		gen.if(noPropertyInData(gen, data, prop, it.opts.ownProperties), () => {
			cxt.setParams({ missingProperty: (0, codegen_1._)`${prop}` }, true);
			cxt.error();
		});
	}
	exports.checkReportMissingProp = checkReportMissingProp;
	function checkMissingProp({ gen, data, it: { opts } }, properties, missing) {
		return (0, codegen_1.or)(...properties.map((prop) => (0, codegen_1.and)(noPropertyInData(gen, data, prop, opts.ownProperties), (0, codegen_1._)`${missing} = ${prop}`)));
	}
	exports.checkMissingProp = checkMissingProp;
	function reportMissingProp(cxt, missing) {
		cxt.setParams({ missingProperty: missing }, true);
		cxt.error();
	}
	exports.reportMissingProp = reportMissingProp;
	function hasPropFunc(gen) {
		return gen.scopeValue("func", {
			ref: Object.prototype.hasOwnProperty,
			code: (0, codegen_1._)`Object.prototype.hasOwnProperty`
		});
	}
	exports.hasPropFunc = hasPropFunc;
	function isOwnProperty(gen, data, property) {
		return (0, codegen_1._)`${hasPropFunc(gen)}.call(${data}, ${property})`;
	}
	exports.isOwnProperty = isOwnProperty;
	function propertyInData(gen, data, property, ownProperties) {
		const cond = (0, codegen_1._)`${data}${(0, codegen_1.getProperty)(property)} !== undefined`;
		return ownProperties ? (0, codegen_1._)`${cond} && ${isOwnProperty(gen, data, property)}` : cond;
	}
	exports.propertyInData = propertyInData;
	function noPropertyInData(gen, data, property, ownProperties) {
		const cond = (0, codegen_1._)`${data}${(0, codegen_1.getProperty)(property)} === undefined`;
		return ownProperties ? (0, codegen_1.or)(cond, (0, codegen_1.not)(isOwnProperty(gen, data, property))) : cond;
	}
	exports.noPropertyInData = noPropertyInData;
	function allSchemaProperties(schemaMap) {
		return schemaMap ? Object.keys(schemaMap).filter((p) => p !== "__proto__") : [];
	}
	exports.allSchemaProperties = allSchemaProperties;
	function schemaProperties(it, schemaMap) {
		return allSchemaProperties(schemaMap).filter((p) => !(0, util_1.alwaysValidSchema)(it, schemaMap[p]));
	}
	exports.schemaProperties = schemaProperties;
	function callValidateCode({ schemaCode, data, it: { gen, topSchemaRef, schemaPath, errorPath }, it }, func, context, passSchema) {
		const dataAndSchema = passSchema ? (0, codegen_1._)`${schemaCode}, ${data}, ${topSchemaRef}${schemaPath}` : data;
		const valCxt = [
			[names_1.default.instancePath, (0, codegen_1.strConcat)(names_1.default.instancePath, errorPath)],
			[names_1.default.parentData, it.parentData],
			[names_1.default.parentDataProperty, it.parentDataProperty],
			[names_1.default.rootData, names_1.default.rootData]
		];
		if (it.opts.dynamicRef) valCxt.push([names_1.default.dynamicAnchors, names_1.default.dynamicAnchors]);
		const args = (0, codegen_1._)`${dataAndSchema}, ${gen.object(...valCxt)}`;
		return context !== codegen_1.nil ? (0, codegen_1._)`${func}.call(${context}, ${args})` : (0, codegen_1._)`${func}(${args})`;
	}
	exports.callValidateCode = callValidateCode;
	var newRegExp = (0, codegen_1._)`new RegExp`;
	function usePattern({ gen, it: { opts } }, pattern) {
		const u = opts.unicodeRegExp ? "u" : "";
		const { regExp } = opts.code;
		const rx = regExp(pattern, u);
		return gen.scopeValue("pattern", {
			key: rx.toString(),
			ref: rx,
			code: (0, codegen_1._)`${regExp.code === "new RegExp" ? newRegExp : (0, util_2.useFunc)(gen, regExp)}(${pattern}, ${u})`
		});
	}
	exports.usePattern = usePattern;
	function validateArray(cxt) {
		const { gen, data, keyword, it } = cxt;
		const valid = gen.name("valid");
		if (it.allErrors) {
			const validArr = gen.let("valid", true);
			validateItems(() => gen.assign(validArr, false));
			return validArr;
		}
		gen.var(valid, true);
		validateItems(() => gen.break());
		return valid;
		function validateItems(notValid) {
			const len = gen.const("len", (0, codegen_1._)`${data}.length`);
			gen.forRange("i", 0, len, (i) => {
				cxt.subschema({
					keyword,
					dataProp: i,
					dataPropType: util_1.Type.Num
				}, valid);
				gen.if((0, codegen_1.not)(valid), notValid);
			});
		}
	}
	exports.validateArray = validateArray;
	function validateUnion(cxt) {
		const { gen, schema, keyword, it } = cxt;
		/* istanbul ignore if */
		if (!Array.isArray(schema)) throw new Error("ajv implementation error");
		if (schema.some((sch) => (0, util_1.alwaysValidSchema)(it, sch)) && !it.opts.unevaluated) return;
		const valid = gen.let("valid", false);
		const schValid = gen.name("_valid");
		gen.block(() => schema.forEach((_sch, i) => {
			const schCxt = cxt.subschema({
				keyword,
				schemaProp: i,
				compositeRule: true
			}, schValid);
			gen.assign(valid, (0, codegen_1._)`${valid} || ${schValid}`);
			if (!cxt.mergeValidEvaluated(schCxt, schValid)) gen.if((0, codegen_1.not)(valid));
		}));
		cxt.result(valid, () => cxt.reset(), () => cxt.error(true));
	}
	exports.validateUnion = validateUnion;
}));
//#endregion
//#region node_modules/@modelcontextprotocol/sdk/node_modules/ajv/dist/compile/validate/keyword.js
var require_keyword$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.validateKeywordUsage = exports.validSchemaType = exports.funcKeywordCode = exports.macroKeywordCode = void 0;
	var codegen_1 = require_codegen$1();
	var names_1 = require_names$1();
	var code_1 = require_code$2();
	var errors_1 = require_errors$1();
	function macroKeywordCode(cxt, def) {
		const { gen, keyword, schema, parentSchema, it } = cxt;
		const macroSchema = def.macro.call(it.self, schema, parentSchema, it);
		const schemaRef = useKeyword(gen, keyword, macroSchema);
		if (it.opts.validateSchema !== false) it.self.validateSchema(macroSchema, true);
		const valid = gen.name("valid");
		cxt.subschema({
			schema: macroSchema,
			schemaPath: codegen_1.nil,
			errSchemaPath: `${it.errSchemaPath}/${keyword}`,
			topSchemaRef: schemaRef,
			compositeRule: true
		}, valid);
		cxt.pass(valid, () => cxt.error(true));
	}
	exports.macroKeywordCode = macroKeywordCode;
	function funcKeywordCode(cxt, def) {
		var _a;
		const { gen, keyword, schema, parentSchema, $data, it } = cxt;
		checkAsyncKeyword(it, def);
		const validateRef = useKeyword(gen, keyword, !$data && def.compile ? def.compile.call(it.self, schema, parentSchema, it) : def.validate);
		const valid = gen.let("valid");
		cxt.block$data(valid, validateKeyword);
		cxt.ok((_a = def.valid) !== null && _a !== void 0 ? _a : valid);
		function validateKeyword() {
			if (def.errors === false) {
				assignValid();
				if (def.modifying) modifyData(cxt);
				reportErrs(() => cxt.error());
			} else {
				const ruleErrs = def.async ? validateAsync() : validateSync();
				if (def.modifying) modifyData(cxt);
				reportErrs(() => addErrs(cxt, ruleErrs));
			}
		}
		function validateAsync() {
			const ruleErrs = gen.let("ruleErrs", null);
			gen.try(() => assignValid((0, codegen_1._)`await `), (e) => gen.assign(valid, false).if((0, codegen_1._)`${e} instanceof ${it.ValidationError}`, () => gen.assign(ruleErrs, (0, codegen_1._)`${e}.errors`), () => gen.throw(e)));
			return ruleErrs;
		}
		function validateSync() {
			const validateErrs = (0, codegen_1._)`${validateRef}.errors`;
			gen.assign(validateErrs, null);
			assignValid(codegen_1.nil);
			return validateErrs;
		}
		function assignValid(_await = def.async ? (0, codegen_1._)`await ` : codegen_1.nil) {
			const passCxt = it.opts.passContext ? names_1.default.this : names_1.default.self;
			const passSchema = !("compile" in def && !$data || def.schema === false);
			gen.assign(valid, (0, codegen_1._)`${_await}${(0, code_1.callValidateCode)(cxt, validateRef, passCxt, passSchema)}`, def.modifying);
		}
		function reportErrs(errors) {
			var _a;
			gen.if((0, codegen_1.not)((_a = def.valid) !== null && _a !== void 0 ? _a : valid), errors);
		}
	}
	exports.funcKeywordCode = funcKeywordCode;
	function modifyData(cxt) {
		const { gen, data, it } = cxt;
		gen.if(it.parentData, () => gen.assign(data, (0, codegen_1._)`${it.parentData}[${it.parentDataProperty}]`));
	}
	function addErrs(cxt, errs) {
		const { gen } = cxt;
		gen.if((0, codegen_1._)`Array.isArray(${errs})`, () => {
			gen.assign(names_1.default.vErrors, (0, codegen_1._)`${names_1.default.vErrors} === null ? ${errs} : ${names_1.default.vErrors}.concat(${errs})`).assign(names_1.default.errors, (0, codegen_1._)`${names_1.default.vErrors}.length`);
			(0, errors_1.extendErrors)(cxt);
		}, () => cxt.error());
	}
	function checkAsyncKeyword({ schemaEnv }, def) {
		if (def.async && !schemaEnv.$async) throw new Error("async keyword in sync schema");
	}
	function useKeyword(gen, keyword, result) {
		if (result === void 0) throw new Error(`keyword "${keyword}" failed to compile`);
		return gen.scopeValue("keyword", typeof result == "function" ? { ref: result } : {
			ref: result,
			code: (0, codegen_1.stringify)(result)
		});
	}
	function validSchemaType(schema, schemaType, allowUndefined = false) {
		return !schemaType.length || schemaType.some((st) => st === "array" ? Array.isArray(schema) : st === "object" ? schema && typeof schema == "object" && !Array.isArray(schema) : typeof schema == st || allowUndefined && typeof schema == "undefined");
	}
	exports.validSchemaType = validSchemaType;
	function validateKeywordUsage({ schema, opts, self, errSchemaPath }, def, keyword) {
		/* istanbul ignore if */
		if (Array.isArray(def.keyword) ? !def.keyword.includes(keyword) : def.keyword !== keyword) throw new Error("ajv implementation error");
		const deps = def.dependencies;
		if (deps === null || deps === void 0 ? void 0 : deps.some((kwd) => !Object.prototype.hasOwnProperty.call(schema, kwd))) throw new Error(`parent schema must have dependencies of ${keyword}: ${deps.join(",")}`);
		if (def.validateSchema) {
			if (!def.validateSchema(schema[keyword])) {
				const msg = `keyword "${keyword}" value is invalid at path "${errSchemaPath}": ` + self.errorsText(def.validateSchema.errors);
				if (opts.validateSchema === "log") self.logger.error(msg);
				else throw new Error(msg);
			}
		}
	}
	exports.validateKeywordUsage = validateKeywordUsage;
}));
//#endregion
//#region node_modules/@modelcontextprotocol/sdk/node_modules/ajv/dist/compile/validate/subschema.js
var require_subschema$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.extendSubschemaMode = exports.extendSubschemaData = exports.getSubschema = void 0;
	var codegen_1 = require_codegen$1();
	var util_1 = require_util$1();
	function getSubschema(it, { keyword, schemaProp, schema, schemaPath, errSchemaPath, topSchemaRef }) {
		if (keyword !== void 0 && schema !== void 0) throw new Error("both \"keyword\" and \"schema\" passed, only one allowed");
		if (keyword !== void 0) {
			const sch = it.schema[keyword];
			return schemaProp === void 0 ? {
				schema: sch,
				schemaPath: (0, codegen_1._)`${it.schemaPath}${(0, codegen_1.getProperty)(keyword)}`,
				errSchemaPath: `${it.errSchemaPath}/${keyword}`
			} : {
				schema: sch[schemaProp],
				schemaPath: (0, codegen_1._)`${it.schemaPath}${(0, codegen_1.getProperty)(keyword)}${(0, codegen_1.getProperty)(schemaProp)}`,
				errSchemaPath: `${it.errSchemaPath}/${keyword}/${(0, util_1.escapeFragment)(schemaProp)}`
			};
		}
		if (schema !== void 0) {
			if (schemaPath === void 0 || errSchemaPath === void 0 || topSchemaRef === void 0) throw new Error("\"schemaPath\", \"errSchemaPath\" and \"topSchemaRef\" are required with \"schema\"");
			return {
				schema,
				schemaPath,
				topSchemaRef,
				errSchemaPath
			};
		}
		throw new Error("either \"keyword\" or \"schema\" must be passed");
	}
	exports.getSubschema = getSubschema;
	function extendSubschemaData(subschema, it, { dataProp, dataPropType: dpType, data, dataTypes, propertyName }) {
		if (data !== void 0 && dataProp !== void 0) throw new Error("both \"data\" and \"dataProp\" passed, only one allowed");
		const { gen } = it;
		if (dataProp !== void 0) {
			const { errorPath, dataPathArr, opts } = it;
			dataContextProps(gen.let("data", (0, codegen_1._)`${it.data}${(0, codegen_1.getProperty)(dataProp)}`, true));
			subschema.errorPath = (0, codegen_1.str)`${errorPath}${(0, util_1.getErrorPath)(dataProp, dpType, opts.jsPropertySyntax)}`;
			subschema.parentDataProperty = (0, codegen_1._)`${dataProp}`;
			subschema.dataPathArr = [...dataPathArr, subschema.parentDataProperty];
		}
		if (data !== void 0) {
			dataContextProps(data instanceof codegen_1.Name ? data : gen.let("data", data, true));
			if (propertyName !== void 0) subschema.propertyName = propertyName;
		}
		if (dataTypes) subschema.dataTypes = dataTypes;
		function dataContextProps(_nextData) {
			subschema.data = _nextData;
			subschema.dataLevel = it.dataLevel + 1;
			subschema.dataTypes = [];
			it.definedProperties = /* @__PURE__ */ new Set();
			subschema.parentData = it.data;
			subschema.dataNames = [...it.dataNames, _nextData];
		}
	}
	exports.extendSubschemaData = extendSubschemaData;
	function extendSubschemaMode(subschema, { jtdDiscriminator, jtdMetadata, compositeRule, createErrors, allErrors }) {
		if (compositeRule !== void 0) subschema.compositeRule = compositeRule;
		if (createErrors !== void 0) subschema.createErrors = createErrors;
		if (allErrors !== void 0) subschema.allErrors = allErrors;
		subschema.jtdDiscriminator = jtdDiscriminator;
		subschema.jtdMetadata = jtdMetadata;
	}
	exports.extendSubschemaMode = extendSubschemaMode;
}));
//#endregion
//#region node_modules/fast-deep-equal/index.js
var require_fast_deep_equal = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = function equal(a, b) {
		if (a === b) return true;
		if (a && b && typeof a == "object" && typeof b == "object") {
			if (a.constructor !== b.constructor) return false;
			var length, i, keys;
			if (Array.isArray(a)) {
				length = a.length;
				if (length != b.length) return false;
				for (i = length; i-- !== 0;) if (!equal(a[i], b[i])) return false;
				return true;
			}
			if (a.constructor === RegExp) return a.source === b.source && a.flags === b.flags;
			if (a.valueOf !== Object.prototype.valueOf) return a.valueOf() === b.valueOf();
			if (a.toString !== Object.prototype.toString) return a.toString() === b.toString();
			keys = Object.keys(a);
			length = keys.length;
			if (length !== Object.keys(b).length) return false;
			for (i = length; i-- !== 0;) if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;
			for (i = length; i-- !== 0;) {
				var key = keys[i];
				if (!equal(a[key], b[key])) return false;
			}
			return true;
		}
		return a !== a && b !== b;
	};
}));
//#endregion
//#region node_modules/@modelcontextprotocol/sdk/node_modules/json-schema-traverse/index.js
var require_json_schema_traverse$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var traverse = module.exports = function(schema, opts, cb) {
		if (typeof opts == "function") {
			cb = opts;
			opts = {};
		}
		cb = opts.cb || cb;
		var pre = typeof cb == "function" ? cb : cb.pre || function() {};
		var post = cb.post || function() {};
		_traverse(opts, pre, post, schema, "", schema);
	};
	traverse.keywords = {
		additionalItems: true,
		items: true,
		contains: true,
		additionalProperties: true,
		propertyNames: true,
		not: true,
		if: true,
		then: true,
		else: true
	};
	traverse.arrayKeywords = {
		items: true,
		allOf: true,
		anyOf: true,
		oneOf: true
	};
	traverse.propsKeywords = {
		$defs: true,
		definitions: true,
		properties: true,
		patternProperties: true,
		dependencies: true
	};
	traverse.skipKeywords = {
		default: true,
		enum: true,
		const: true,
		required: true,
		maximum: true,
		minimum: true,
		exclusiveMaximum: true,
		exclusiveMinimum: true,
		multipleOf: true,
		maxLength: true,
		minLength: true,
		pattern: true,
		format: true,
		maxItems: true,
		minItems: true,
		uniqueItems: true,
		maxProperties: true,
		minProperties: true
	};
	function _traverse(opts, pre, post, schema, jsonPtr, rootSchema, parentJsonPtr, parentKeyword, parentSchema, keyIndex) {
		if (schema && typeof schema == "object" && !Array.isArray(schema)) {
			pre(schema, jsonPtr, rootSchema, parentJsonPtr, parentKeyword, parentSchema, keyIndex);
			for (var key in schema) {
				var sch = schema[key];
				if (Array.isArray(sch)) {
					if (key in traverse.arrayKeywords) for (var i = 0; i < sch.length; i++) _traverse(opts, pre, post, sch[i], jsonPtr + "/" + key + "/" + i, rootSchema, jsonPtr, key, schema, i);
				} else if (key in traverse.propsKeywords) {
					if (sch && typeof sch == "object") for (var prop in sch) _traverse(opts, pre, post, sch[prop], jsonPtr + "/" + key + "/" + escapeJsonPtr(prop), rootSchema, jsonPtr, key, schema, prop);
				} else if (key in traverse.keywords || opts.allKeys && !(key in traverse.skipKeywords)) _traverse(opts, pre, post, sch, jsonPtr + "/" + key, rootSchema, jsonPtr, key, schema);
			}
			post(schema, jsonPtr, rootSchema, parentJsonPtr, parentKeyword, parentSchema, keyIndex);
		}
	}
	function escapeJsonPtr(str) {
		return str.replace(/~/g, "~0").replace(/\//g, "~1");
	}
}));
//#endregion
//#region node_modules/@modelcontextprotocol/sdk/node_modules/ajv/dist/compile/resolve.js
var require_resolve$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.getSchemaRefs = exports.resolveUrl = exports.normalizeId = exports._getFullPath = exports.getFullPath = exports.inlineRef = void 0;
	var util_1 = require_util$1();
	var equal = require_fast_deep_equal();
	var traverse = require_json_schema_traverse$1();
	var SIMPLE_INLINED = /* @__PURE__ */ new Set([
		"type",
		"format",
		"pattern",
		"maxLength",
		"minLength",
		"maxProperties",
		"minProperties",
		"maxItems",
		"minItems",
		"maximum",
		"minimum",
		"uniqueItems",
		"multipleOf",
		"required",
		"enum",
		"const"
	]);
	function inlineRef(schema, limit = true) {
		if (typeof schema == "boolean") return true;
		if (limit === true) return !hasRef(schema);
		if (!limit) return false;
		return countKeys(schema) <= limit;
	}
	exports.inlineRef = inlineRef;
	var REF_KEYWORDS = /* @__PURE__ */ new Set([
		"$ref",
		"$recursiveRef",
		"$recursiveAnchor",
		"$dynamicRef",
		"$dynamicAnchor"
	]);
	function hasRef(schema) {
		for (const key in schema) {
			if (REF_KEYWORDS.has(key)) return true;
			const sch = schema[key];
			if (Array.isArray(sch) && sch.some(hasRef)) return true;
			if (typeof sch == "object" && hasRef(sch)) return true;
		}
		return false;
	}
	function countKeys(schema) {
		let count = 0;
		for (const key in schema) {
			if (key === "$ref") return Infinity;
			count++;
			if (SIMPLE_INLINED.has(key)) continue;
			if (typeof schema[key] == "object") (0, util_1.eachItem)(schema[key], (sch) => count += countKeys(sch));
			if (count === Infinity) return Infinity;
		}
		return count;
	}
	function getFullPath(resolver, id = "", normalize) {
		if (normalize !== false) id = normalizeId(id);
		return _getFullPath(resolver, resolver.parse(id));
	}
	exports.getFullPath = getFullPath;
	function _getFullPath(resolver, p) {
		return resolver.serialize(p).split("#")[0] + "#";
	}
	exports._getFullPath = _getFullPath;
	var TRAILING_SLASH_HASH = /#\/?$/;
	function normalizeId(id) {
		return id ? id.replace(TRAILING_SLASH_HASH, "") : "";
	}
	exports.normalizeId = normalizeId;
	function resolveUrl(resolver, baseId, id) {
		id = normalizeId(id);
		return resolver.resolve(baseId, id);
	}
	exports.resolveUrl = resolveUrl;
	var ANCHOR = /^[a-z_][-a-z0-9._]*$/i;
	function getSchemaRefs(schema, baseId) {
		if (typeof schema == "boolean") return {};
		const { schemaId, uriResolver } = this.opts;
		const schId = normalizeId(schema[schemaId] || baseId);
		const baseIds = { "": schId };
		const pathPrefix = getFullPath(uriResolver, schId, false);
		const localRefs = {};
		const schemaRefs = /* @__PURE__ */ new Set();
		traverse(schema, { allKeys: true }, (sch, jsonPtr, _, parentJsonPtr) => {
			if (parentJsonPtr === void 0) return;
			const fullPath = pathPrefix + jsonPtr;
			let innerBaseId = baseIds[parentJsonPtr];
			if (typeof sch[schemaId] == "string") innerBaseId = addRef.call(this, sch[schemaId]);
			addAnchor.call(this, sch.$anchor);
			addAnchor.call(this, sch.$dynamicAnchor);
			baseIds[jsonPtr] = innerBaseId;
			function addRef(ref) {
				const _resolve = this.opts.uriResolver.resolve;
				ref = normalizeId(innerBaseId ? _resolve(innerBaseId, ref) : ref);
				if (schemaRefs.has(ref)) throw ambiguos(ref);
				schemaRefs.add(ref);
				let schOrRef = this.refs[ref];
				if (typeof schOrRef == "string") schOrRef = this.refs[schOrRef];
				if (typeof schOrRef == "object") checkAmbiguosRef(sch, schOrRef.schema, ref);
				else if (ref !== normalizeId(fullPath)) if (ref[0] === "#") {
					checkAmbiguosRef(sch, localRefs[ref], ref);
					localRefs[ref] = sch;
				} else this.refs[ref] = fullPath;
				return ref;
			}
			function addAnchor(anchor) {
				if (typeof anchor == "string") {
					if (!ANCHOR.test(anchor)) throw new Error(`invalid anchor "${anchor}"`);
					addRef.call(this, `#${anchor}`);
				}
			}
		});
		return localRefs;
		function checkAmbiguosRef(sch1, sch2, ref) {
			if (sch2 !== void 0 && !equal(sch1, sch2)) throw ambiguos(ref);
		}
		function ambiguos(ref) {
			return /* @__PURE__ */ new Error(`reference "${ref}" resolves to more than one schema`);
		}
	}
	exports.getSchemaRefs = getSchemaRefs;
}));
//#endregion
//#region node_modules/@modelcontextprotocol/sdk/node_modules/ajv/dist/compile/validate/index.js
var require_validate$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.getData = exports.KeywordCxt = exports.validateFunctionCode = void 0;
	var boolSchema_1 = require_boolSchema$1();
	var dataType_1 = require_dataType$1();
	var applicability_1 = require_applicability$1();
	var dataType_2 = require_dataType$1();
	var defaults_1 = require_defaults$1();
	var keyword_1 = require_keyword$1();
	var subschema_1 = require_subschema$1();
	var codegen_1 = require_codegen$1();
	var names_1 = require_names$1();
	var resolve_1 = require_resolve$1();
	var util_1 = require_util$1();
	var errors_1 = require_errors$1();
	function validateFunctionCode(it) {
		if (isSchemaObj(it)) {
			checkKeywords(it);
			if (schemaCxtHasRules(it)) {
				topSchemaObjCode(it);
				return;
			}
		}
		validateFunction(it, () => (0, boolSchema_1.topBoolOrEmptySchema)(it));
	}
	exports.validateFunctionCode = validateFunctionCode;
	function validateFunction({ gen, validateName, schema, schemaEnv, opts }, body) {
		if (opts.code.es5) gen.func(validateName, (0, codegen_1._)`${names_1.default.data}, ${names_1.default.valCxt}`, schemaEnv.$async, () => {
			gen.code((0, codegen_1._)`"use strict"; ${funcSourceUrl(schema, opts)}`);
			destructureValCxtES5(gen, opts);
			gen.code(body);
		});
		else gen.func(validateName, (0, codegen_1._)`${names_1.default.data}, ${destructureValCxt(opts)}`, schemaEnv.$async, () => gen.code(funcSourceUrl(schema, opts)).code(body));
	}
	function destructureValCxt(opts) {
		return (0, codegen_1._)`{${names_1.default.instancePath}="", ${names_1.default.parentData}, ${names_1.default.parentDataProperty}, ${names_1.default.rootData}=${names_1.default.data}${opts.dynamicRef ? (0, codegen_1._)`, ${names_1.default.dynamicAnchors}={}` : codegen_1.nil}}={}`;
	}
	function destructureValCxtES5(gen, opts) {
		gen.if(names_1.default.valCxt, () => {
			gen.var(names_1.default.instancePath, (0, codegen_1._)`${names_1.default.valCxt}.${names_1.default.instancePath}`);
			gen.var(names_1.default.parentData, (0, codegen_1._)`${names_1.default.valCxt}.${names_1.default.parentData}`);
			gen.var(names_1.default.parentDataProperty, (0, codegen_1._)`${names_1.default.valCxt}.${names_1.default.parentDataProperty}`);
			gen.var(names_1.default.rootData, (0, codegen_1._)`${names_1.default.valCxt}.${names_1.default.rootData}`);
			if (opts.dynamicRef) gen.var(names_1.default.dynamicAnchors, (0, codegen_1._)`${names_1.default.valCxt}.${names_1.default.dynamicAnchors}`);
		}, () => {
			gen.var(names_1.default.instancePath, (0, codegen_1._)`""`);
			gen.var(names_1.default.parentData, (0, codegen_1._)`undefined`);
			gen.var(names_1.default.parentDataProperty, (0, codegen_1._)`undefined`);
			gen.var(names_1.default.rootData, names_1.default.data);
			if (opts.dynamicRef) gen.var(names_1.default.dynamicAnchors, (0, codegen_1._)`{}`);
		});
	}
	function topSchemaObjCode(it) {
		const { schema, opts, gen } = it;
		validateFunction(it, () => {
			if (opts.$comment && schema.$comment) commentKeyword(it);
			checkNoDefault(it);
			gen.let(names_1.default.vErrors, null);
			gen.let(names_1.default.errors, 0);
			if (opts.unevaluated) resetEvaluated(it);
			typeAndKeywords(it);
			returnResults(it);
		});
	}
	function resetEvaluated(it) {
		const { gen, validateName } = it;
		it.evaluated = gen.const("evaluated", (0, codegen_1._)`${validateName}.evaluated`);
		gen.if((0, codegen_1._)`${it.evaluated}.dynamicProps`, () => gen.assign((0, codegen_1._)`${it.evaluated}.props`, (0, codegen_1._)`undefined`));
		gen.if((0, codegen_1._)`${it.evaluated}.dynamicItems`, () => gen.assign((0, codegen_1._)`${it.evaluated}.items`, (0, codegen_1._)`undefined`));
	}
	function funcSourceUrl(schema, opts) {
		const schId = typeof schema == "object" && schema[opts.schemaId];
		return schId && (opts.code.source || opts.code.process) ? (0, codegen_1._)`/*# sourceURL=${schId} */` : codegen_1.nil;
	}
	function subschemaCode(it, valid) {
		if (isSchemaObj(it)) {
			checkKeywords(it);
			if (schemaCxtHasRules(it)) {
				subSchemaObjCode(it, valid);
				return;
			}
		}
		(0, boolSchema_1.boolOrEmptySchema)(it, valid);
	}
	function schemaCxtHasRules({ schema, self }) {
		if (typeof schema == "boolean") return !schema;
		for (const key in schema) if (self.RULES.all[key]) return true;
		return false;
	}
	function isSchemaObj(it) {
		return typeof it.schema != "boolean";
	}
	function subSchemaObjCode(it, valid) {
		const { schema, gen, opts } = it;
		if (opts.$comment && schema.$comment) commentKeyword(it);
		updateContext(it);
		checkAsyncSchema(it);
		const errsCount = gen.const("_errs", names_1.default.errors);
		typeAndKeywords(it, errsCount);
		gen.var(valid, (0, codegen_1._)`${errsCount} === ${names_1.default.errors}`);
	}
	function checkKeywords(it) {
		(0, util_1.checkUnknownRules)(it);
		checkRefsAndKeywords(it);
	}
	function typeAndKeywords(it, errsCount) {
		if (it.opts.jtd) return schemaKeywords(it, [], false, errsCount);
		const types = (0, dataType_1.getSchemaTypes)(it.schema);
		schemaKeywords(it, types, !(0, dataType_1.coerceAndCheckDataType)(it, types), errsCount);
	}
	function checkRefsAndKeywords(it) {
		const { schema, errSchemaPath, opts, self } = it;
		if (schema.$ref && opts.ignoreKeywordsWithRef && (0, util_1.schemaHasRulesButRef)(schema, self.RULES)) self.logger.warn(`$ref: keywords ignored in schema at path "${errSchemaPath}"`);
	}
	function checkNoDefault(it) {
		const { schema, opts } = it;
		if (schema.default !== void 0 && opts.useDefaults && opts.strictSchema) (0, util_1.checkStrictMode)(it, "default is ignored in the schema root");
	}
	function updateContext(it) {
		const schId = it.schema[it.opts.schemaId];
		if (schId) it.baseId = (0, resolve_1.resolveUrl)(it.opts.uriResolver, it.baseId, schId);
	}
	function checkAsyncSchema(it) {
		if (it.schema.$async && !it.schemaEnv.$async) throw new Error("async schema in sync schema");
	}
	function commentKeyword({ gen, schemaEnv, schema, errSchemaPath, opts }) {
		const msg = schema.$comment;
		if (opts.$comment === true) gen.code((0, codegen_1._)`${names_1.default.self}.logger.log(${msg})`);
		else if (typeof opts.$comment == "function") {
			const schemaPath = (0, codegen_1.str)`${errSchemaPath}/$comment`;
			const rootName = gen.scopeValue("root", { ref: schemaEnv.root });
			gen.code((0, codegen_1._)`${names_1.default.self}.opts.$comment(${msg}, ${schemaPath}, ${rootName}.schema)`);
		}
	}
	function returnResults(it) {
		const { gen, schemaEnv, validateName, ValidationError, opts } = it;
		if (schemaEnv.$async) gen.if((0, codegen_1._)`${names_1.default.errors} === 0`, () => gen.return(names_1.default.data), () => gen.throw((0, codegen_1._)`new ${ValidationError}(${names_1.default.vErrors})`));
		else {
			gen.assign((0, codegen_1._)`${validateName}.errors`, names_1.default.vErrors);
			if (opts.unevaluated) assignEvaluated(it);
			gen.return((0, codegen_1._)`${names_1.default.errors} === 0`);
		}
	}
	function assignEvaluated({ gen, evaluated, props, items }) {
		if (props instanceof codegen_1.Name) gen.assign((0, codegen_1._)`${evaluated}.props`, props);
		if (items instanceof codegen_1.Name) gen.assign((0, codegen_1._)`${evaluated}.items`, items);
	}
	function schemaKeywords(it, types, typeErrors, errsCount) {
		const { gen, schema, data, allErrors, opts, self } = it;
		const { RULES } = self;
		if (schema.$ref && (opts.ignoreKeywordsWithRef || !(0, util_1.schemaHasRulesButRef)(schema, RULES))) {
			gen.block(() => keywordCode(it, "$ref", RULES.all.$ref.definition));
			return;
		}
		if (!opts.jtd) checkStrictTypes(it, types);
		gen.block(() => {
			for (const group of RULES.rules) groupKeywords(group);
			groupKeywords(RULES.post);
		});
		function groupKeywords(group) {
			if (!(0, applicability_1.shouldUseGroup)(schema, group)) return;
			if (group.type) {
				gen.if((0, dataType_2.checkDataType)(group.type, data, opts.strictNumbers));
				iterateKeywords(it, group);
				if (types.length === 1 && types[0] === group.type && typeErrors) {
					gen.else();
					(0, dataType_2.reportTypeError)(it);
				}
				gen.endIf();
			} else iterateKeywords(it, group);
			if (!allErrors) gen.if((0, codegen_1._)`${names_1.default.errors} === ${errsCount || 0}`);
		}
	}
	function iterateKeywords(it, group) {
		const { gen, schema, opts: { useDefaults } } = it;
		if (useDefaults) (0, defaults_1.assignDefaults)(it, group.type);
		gen.block(() => {
			for (const rule of group.rules) if ((0, applicability_1.shouldUseRule)(schema, rule)) keywordCode(it, rule.keyword, rule.definition, group.type);
		});
	}
	function checkStrictTypes(it, types) {
		if (it.schemaEnv.meta || !it.opts.strictTypes) return;
		checkContextTypes(it, types);
		if (!it.opts.allowUnionTypes) checkMultipleTypes(it, types);
		checkKeywordTypes(it, it.dataTypes);
	}
	function checkContextTypes(it, types) {
		if (!types.length) return;
		if (!it.dataTypes.length) {
			it.dataTypes = types;
			return;
		}
		types.forEach((t) => {
			if (!includesType(it.dataTypes, t)) strictTypesError(it, `type "${t}" not allowed by context "${it.dataTypes.join(",")}"`);
		});
		narrowSchemaTypes(it, types);
	}
	function checkMultipleTypes(it, ts) {
		if (ts.length > 1 && !(ts.length === 2 && ts.includes("null"))) strictTypesError(it, "use allowUnionTypes to allow union type keyword");
	}
	function checkKeywordTypes(it, ts) {
		const rules = it.self.RULES.all;
		for (const keyword in rules) {
			const rule = rules[keyword];
			if (typeof rule == "object" && (0, applicability_1.shouldUseRule)(it.schema, rule)) {
				const { type } = rule.definition;
				if (type.length && !type.some((t) => hasApplicableType(ts, t))) strictTypesError(it, `missing type "${type.join(",")}" for keyword "${keyword}"`);
			}
		}
	}
	function hasApplicableType(schTs, kwdT) {
		return schTs.includes(kwdT) || kwdT === "number" && schTs.includes("integer");
	}
	function includesType(ts, t) {
		return ts.includes(t) || t === "integer" && ts.includes("number");
	}
	function narrowSchemaTypes(it, withTypes) {
		const ts = [];
		for (const t of it.dataTypes) if (includesType(withTypes, t)) ts.push(t);
		else if (withTypes.includes("integer") && t === "number") ts.push("integer");
		it.dataTypes = ts;
	}
	function strictTypesError(it, msg) {
		const schemaPath = it.schemaEnv.baseId + it.errSchemaPath;
		msg += ` at "${schemaPath}" (strictTypes)`;
		(0, util_1.checkStrictMode)(it, msg, it.opts.strictTypes);
	}
	var KeywordCxt = class {
		constructor(it, def, keyword) {
			(0, keyword_1.validateKeywordUsage)(it, def, keyword);
			this.gen = it.gen;
			this.allErrors = it.allErrors;
			this.keyword = keyword;
			this.data = it.data;
			this.schema = it.schema[keyword];
			this.$data = def.$data && it.opts.$data && this.schema && this.schema.$data;
			this.schemaValue = (0, util_1.schemaRefOrVal)(it, this.schema, keyword, this.$data);
			this.schemaType = def.schemaType;
			this.parentSchema = it.schema;
			this.params = {};
			this.it = it;
			this.def = def;
			if (this.$data) this.schemaCode = it.gen.const("vSchema", getData(this.$data, it));
			else {
				this.schemaCode = this.schemaValue;
				if (!(0, keyword_1.validSchemaType)(this.schema, def.schemaType, def.allowUndefined)) throw new Error(`${keyword} value must be ${JSON.stringify(def.schemaType)}`);
			}
			if ("code" in def ? def.trackErrors : def.errors !== false) this.errsCount = it.gen.const("_errs", names_1.default.errors);
		}
		result(condition, successAction, failAction) {
			this.failResult((0, codegen_1.not)(condition), successAction, failAction);
		}
		failResult(condition, successAction, failAction) {
			this.gen.if(condition);
			if (failAction) failAction();
			else this.error();
			if (successAction) {
				this.gen.else();
				successAction();
				if (this.allErrors) this.gen.endIf();
			} else if (this.allErrors) this.gen.endIf();
			else this.gen.else();
		}
		pass(condition, failAction) {
			this.failResult((0, codegen_1.not)(condition), void 0, failAction);
		}
		fail(condition) {
			if (condition === void 0) {
				this.error();
				if (!this.allErrors) this.gen.if(false);
				return;
			}
			this.gen.if(condition);
			this.error();
			if (this.allErrors) this.gen.endIf();
			else this.gen.else();
		}
		fail$data(condition) {
			if (!this.$data) return this.fail(condition);
			const { schemaCode } = this;
			this.fail((0, codegen_1._)`${schemaCode} !== undefined && (${(0, codegen_1.or)(this.invalid$data(), condition)})`);
		}
		error(append, errorParams, errorPaths) {
			if (errorParams) {
				this.setParams(errorParams);
				this._error(append, errorPaths);
				this.setParams({});
				return;
			}
			this._error(append, errorPaths);
		}
		_error(append, errorPaths) {
			(append ? errors_1.reportExtraError : errors_1.reportError)(this, this.def.error, errorPaths);
		}
		$dataError() {
			(0, errors_1.reportError)(this, this.def.$dataError || errors_1.keyword$DataError);
		}
		reset() {
			if (this.errsCount === void 0) throw new Error("add \"trackErrors\" to keyword definition");
			(0, errors_1.resetErrorsCount)(this.gen, this.errsCount);
		}
		ok(cond) {
			if (!this.allErrors) this.gen.if(cond);
		}
		setParams(obj, assign) {
			if (assign) Object.assign(this.params, obj);
			else this.params = obj;
		}
		block$data(valid, codeBlock, $dataValid = codegen_1.nil) {
			this.gen.block(() => {
				this.check$data(valid, $dataValid);
				codeBlock();
			});
		}
		check$data(valid = codegen_1.nil, $dataValid = codegen_1.nil) {
			if (!this.$data) return;
			const { gen, schemaCode, schemaType, def } = this;
			gen.if((0, codegen_1.or)((0, codegen_1._)`${schemaCode} === undefined`, $dataValid));
			if (valid !== codegen_1.nil) gen.assign(valid, true);
			if (schemaType.length || def.validateSchema) {
				gen.elseIf(this.invalid$data());
				this.$dataError();
				if (valid !== codegen_1.nil) gen.assign(valid, false);
			}
			gen.else();
		}
		invalid$data() {
			const { gen, schemaCode, schemaType, def, it } = this;
			return (0, codegen_1.or)(wrong$DataType(), invalid$DataSchema());
			function wrong$DataType() {
				if (schemaType.length) {
					/* istanbul ignore if */
					if (!(schemaCode instanceof codegen_1.Name)) throw new Error("ajv implementation error");
					const st = Array.isArray(schemaType) ? schemaType : [schemaType];
					return (0, codegen_1._)`${(0, dataType_2.checkDataTypes)(st, schemaCode, it.opts.strictNumbers, dataType_2.DataType.Wrong)}`;
				}
				return codegen_1.nil;
			}
			function invalid$DataSchema() {
				if (def.validateSchema) {
					const validateSchemaRef = gen.scopeValue("validate$data", { ref: def.validateSchema });
					return (0, codegen_1._)`!${validateSchemaRef}(${schemaCode})`;
				}
				return codegen_1.nil;
			}
		}
		subschema(appl, valid) {
			const subschema = (0, subschema_1.getSubschema)(this.it, appl);
			(0, subschema_1.extendSubschemaData)(subschema, this.it, appl);
			(0, subschema_1.extendSubschemaMode)(subschema, appl);
			const nextContext = {
				...this.it,
				...subschema,
				items: void 0,
				props: void 0
			};
			subschemaCode(nextContext, valid);
			return nextContext;
		}
		mergeEvaluated(schemaCxt, toName) {
			const { it, gen } = this;
			if (!it.opts.unevaluated) return;
			if (it.props !== true && schemaCxt.props !== void 0) it.props = util_1.mergeEvaluated.props(gen, schemaCxt.props, it.props, toName);
			if (it.items !== true && schemaCxt.items !== void 0) it.items = util_1.mergeEvaluated.items(gen, schemaCxt.items, it.items, toName);
		}
		mergeValidEvaluated(schemaCxt, valid) {
			const { it, gen } = this;
			if (it.opts.unevaluated && (it.props !== true || it.items !== true)) {
				gen.if(valid, () => this.mergeEvaluated(schemaCxt, codegen_1.Name));
				return true;
			}
		}
	};
	exports.KeywordCxt = KeywordCxt;
	function keywordCode(it, keyword, def, ruleType) {
		const cxt = new KeywordCxt(it, def, keyword);
		if ("code" in def) def.code(cxt, ruleType);
		else if (cxt.$data && def.validate) (0, keyword_1.funcKeywordCode)(cxt, def);
		else if ("macro" in def) (0, keyword_1.macroKeywordCode)(cxt, def);
		else if (def.compile || def.validate) (0, keyword_1.funcKeywordCode)(cxt, def);
	}
	var JSON_POINTER = /^\/(?:[^~]|~0|~1)*$/;
	var RELATIVE_JSON_POINTER = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
	function getData($data, { dataLevel, dataNames, dataPathArr }) {
		let jsonPointer;
		let data;
		if ($data === "") return names_1.default.rootData;
		if ($data[0] === "/") {
			if (!JSON_POINTER.test($data)) throw new Error(`Invalid JSON-pointer: ${$data}`);
			jsonPointer = $data;
			data = names_1.default.rootData;
		} else {
			const matches = RELATIVE_JSON_POINTER.exec($data);
			if (!matches) throw new Error(`Invalid JSON-pointer: ${$data}`);
			const up = +matches[1];
			jsonPointer = matches[2];
			if (jsonPointer === "#") {
				if (up >= dataLevel) throw new Error(errorMsg("property/index", up));
				return dataPathArr[dataLevel - up];
			}
			if (up > dataLevel) throw new Error(errorMsg("data", up));
			data = dataNames[dataLevel - up];
			if (!jsonPointer) return data;
		}
		let expr = data;
		const segments = jsonPointer.split("/");
		for (const segment of segments) if (segment) {
			data = (0, codegen_1._)`${data}${(0, codegen_1.getProperty)((0, util_1.unescapeJsonPointer)(segment))}`;
			expr = (0, codegen_1._)`${expr} && ${data}`;
		}
		return expr;
		function errorMsg(pointerType, up) {
			return `Cannot access ${pointerType} ${up} levels up, current level is ${dataLevel}`;
		}
	}
	exports.getData = getData;
}));
//#endregion
//#region node_modules/@modelcontextprotocol/sdk/node_modules/ajv/dist/runtime/validation_error.js
var require_validation_error$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var ValidationError = class extends Error {
		constructor(errors) {
			super("validation failed");
			this.errors = errors;
			this.ajv = this.validation = true;
		}
	};
	exports.default = ValidationError;
}));
//#endregion
//#region node_modules/@modelcontextprotocol/sdk/node_modules/ajv/dist/compile/ref_error.js
var require_ref_error$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var resolve_1 = require_resolve$1();
	var MissingRefError = class extends Error {
		constructor(resolver, baseId, ref, msg) {
			super(msg || `can't resolve reference ${ref} from id ${baseId}`);
			this.missingRef = (0, resolve_1.resolveUrl)(resolver, baseId, ref);
			this.missingSchema = (0, resolve_1.normalizeId)((0, resolve_1.getFullPath)(resolver, this.missingRef));
		}
	};
	exports.default = MissingRefError;
}));
//#endregion
//#region node_modules/@modelcontextprotocol/sdk/node_modules/ajv/dist/compile/index.js
var require_compile$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.resolveSchema = exports.getCompilingSchema = exports.resolveRef = exports.compileSchema = exports.SchemaEnv = void 0;
	var codegen_1 = require_codegen$1();
	var validation_error_1 = require_validation_error$1();
	var names_1 = require_names$1();
	var resolve_1 = require_resolve$1();
	var util_1 = require_util$1();
	var validate_1 = require_validate$1();
	var SchemaEnv = class {
		constructor(env) {
			var _a;
			this.refs = {};
			this.dynamicAnchors = {};
			let schema;
			if (typeof env.schema == "object") schema = env.schema;
			this.schema = env.schema;
			this.schemaId = env.schemaId;
			this.root = env.root || this;
			this.baseId = (_a = env.baseId) !== null && _a !== void 0 ? _a : (0, resolve_1.normalizeId)(schema === null || schema === void 0 ? void 0 : schema[env.schemaId || "$id"]);
			this.schemaPath = env.schemaPath;
			this.localRefs = env.localRefs;
			this.meta = env.meta;
			this.$async = schema === null || schema === void 0 ? void 0 : schema.$async;
			this.refs = {};
		}
	};
	exports.SchemaEnv = SchemaEnv;
	function compileSchema(sch) {
		const _sch = getCompilingSchema.call(this, sch);
		if (_sch) return _sch;
		const rootId = (0, resolve_1.getFullPath)(this.opts.uriResolver, sch.root.baseId);
		const { es5, lines } = this.opts.code;
		const { ownProperties } = this.opts;
		const gen = new codegen_1.CodeGen(this.scope, {
			es5,
			lines,
			ownProperties
		});
		let _ValidationError;
		if (sch.$async) _ValidationError = gen.scopeValue("Error", {
			ref: validation_error_1.default,
			code: (0, codegen_1._)`require("ajv/dist/runtime/validation_error").default`
		});
		const validateName = gen.scopeName("validate");
		sch.validateName = validateName;
		const schemaCxt = {
			gen,
			allErrors: this.opts.allErrors,
			data: names_1.default.data,
			parentData: names_1.default.parentData,
			parentDataProperty: names_1.default.parentDataProperty,
			dataNames: [names_1.default.data],
			dataPathArr: [codegen_1.nil],
			dataLevel: 0,
			dataTypes: [],
			definedProperties: /* @__PURE__ */ new Set(),
			topSchemaRef: gen.scopeValue("schema", this.opts.code.source === true ? {
				ref: sch.schema,
				code: (0, codegen_1.stringify)(sch.schema)
			} : { ref: sch.schema }),
			validateName,
			ValidationError: _ValidationError,
			schema: sch.schema,
			schemaEnv: sch,
			rootId,
			baseId: sch.baseId || rootId,
			schemaPath: codegen_1.nil,
			errSchemaPath: sch.schemaPath || (this.opts.jtd ? "" : "#"),
			errorPath: (0, codegen_1._)`""`,
			opts: this.opts,
			self: this
		};
		let sourceCode;
		try {
			this._compilations.add(sch);
			(0, validate_1.validateFunctionCode)(schemaCxt);
			gen.optimize(this.opts.code.optimize);
			const validateCode = gen.toString();
			sourceCode = `${gen.scopeRefs(names_1.default.scope)}return ${validateCode}`;
			if (this.opts.code.process) sourceCode = this.opts.code.process(sourceCode, sch);
			const validate = new Function(`${names_1.default.self}`, `${names_1.default.scope}`, sourceCode)(this, this.scope.get());
			this.scope.value(validateName, { ref: validate });
			validate.errors = null;
			validate.schema = sch.schema;
			validate.schemaEnv = sch;
			if (sch.$async) validate.$async = true;
			if (this.opts.code.source === true) validate.source = {
				validateName,
				validateCode,
				scopeValues: gen._values
			};
			if (this.opts.unevaluated) {
				const { props, items } = schemaCxt;
				validate.evaluated = {
					props: props instanceof codegen_1.Name ? void 0 : props,
					items: items instanceof codegen_1.Name ? void 0 : items,
					dynamicProps: props instanceof codegen_1.Name,
					dynamicItems: items instanceof codegen_1.Name
				};
				if (validate.source) validate.source.evaluated = (0, codegen_1.stringify)(validate.evaluated);
			}
			sch.validate = validate;
			return sch;
		} catch (e) {
			delete sch.validate;
			delete sch.validateName;
			if (sourceCode) this.logger.error("Error compiling schema, function code:", sourceCode);
			throw e;
		} finally {
			this._compilations.delete(sch);
		}
	}
	exports.compileSchema = compileSchema;
	function resolveRef(root, baseId, ref) {
		var _a;
		ref = (0, resolve_1.resolveUrl)(this.opts.uriResolver, baseId, ref);
		const schOrFunc = root.refs[ref];
		if (schOrFunc) return schOrFunc;
		let _sch = resolve.call(this, root, ref);
		if (_sch === void 0) {
			const schema = (_a = root.localRefs) === null || _a === void 0 ? void 0 : _a[ref];
			const { schemaId } = this.opts;
			if (schema) _sch = new SchemaEnv({
				schema,
				schemaId,
				root,
				baseId
			});
		}
		if (_sch === void 0) return;
		return root.refs[ref] = inlineOrCompile.call(this, _sch);
	}
	exports.resolveRef = resolveRef;
	function inlineOrCompile(sch) {
		if ((0, resolve_1.inlineRef)(sch.schema, this.opts.inlineRefs)) return sch.schema;
		return sch.validate ? sch : compileSchema.call(this, sch);
	}
	function getCompilingSchema(schEnv) {
		for (const sch of this._compilations) if (sameSchemaEnv(sch, schEnv)) return sch;
	}
	exports.getCompilingSchema = getCompilingSchema;
	function sameSchemaEnv(s1, s2) {
		return s1.schema === s2.schema && s1.root === s2.root && s1.baseId === s2.baseId;
	}
	function resolve(root, ref) {
		let sch;
		while (typeof (sch = this.refs[ref]) == "string") ref = sch;
		return sch || this.schemas[ref] || resolveSchema.call(this, root, ref);
	}
	function resolveSchema(root, ref) {
		const p = this.opts.uriResolver.parse(ref);
		const refPath = (0, resolve_1._getFullPath)(this.opts.uriResolver, p);
		let baseId = (0, resolve_1.getFullPath)(this.opts.uriResolver, root.baseId, void 0);
		if (Object.keys(root.schema).length > 0 && refPath === baseId) return getJsonPointer.call(this, p, root);
		const id = (0, resolve_1.normalizeId)(refPath);
		const schOrRef = this.refs[id] || this.schemas[id];
		if (typeof schOrRef == "string") {
			const sch = resolveSchema.call(this, root, schOrRef);
			if (typeof (sch === null || sch === void 0 ? void 0 : sch.schema) !== "object") return;
			return getJsonPointer.call(this, p, sch);
		}
		if (typeof (schOrRef === null || schOrRef === void 0 ? void 0 : schOrRef.schema) !== "object") return;
		if (!schOrRef.validate) compileSchema.call(this, schOrRef);
		if (id === (0, resolve_1.normalizeId)(ref)) {
			const { schema } = schOrRef;
			const { schemaId } = this.opts;
			const schId = schema[schemaId];
			if (schId) baseId = (0, resolve_1.resolveUrl)(this.opts.uriResolver, baseId, schId);
			return new SchemaEnv({
				schema,
				schemaId,
				root,
				baseId
			});
		}
		return getJsonPointer.call(this, p, schOrRef);
	}
	exports.resolveSchema = resolveSchema;
	var PREVENT_SCOPE_CHANGE = /* @__PURE__ */ new Set([
		"properties",
		"patternProperties",
		"enum",
		"dependencies",
		"definitions"
	]);
	function getJsonPointer(parsedRef, { baseId, schema, root }) {
		var _a;
		if (((_a = parsedRef.fragment) === null || _a === void 0 ? void 0 : _a[0]) !== "/") return;
		for (const part of parsedRef.fragment.slice(1).split("/")) {
			if (typeof schema === "boolean") return;
			const partSchema = schema[(0, util_1.unescapeFragment)(part)];
			if (partSchema === void 0) return;
			schema = partSchema;
			const schId = typeof schema === "object" && schema[this.opts.schemaId];
			if (!PREVENT_SCOPE_CHANGE.has(part) && schId) baseId = (0, resolve_1.resolveUrl)(this.opts.uriResolver, baseId, schId);
		}
		let env;
		if (typeof schema != "boolean" && schema.$ref && !(0, util_1.schemaHasRulesButRef)(schema, this.RULES)) {
			const $ref = (0, resolve_1.resolveUrl)(this.opts.uriResolver, baseId, schema.$ref);
			env = resolveSchema.call(this, root, $ref);
		}
		const { schemaId } = this.opts;
		env = env || new SchemaEnv({
			schema,
			schemaId,
			root,
			baseId
		});
		if (env.schema !== env.root.schema) return env;
	}
}));
//#endregion
//#region node_modules/@modelcontextprotocol/sdk/node_modules/ajv/dist/refs/data.json
var data_exports$1 = /* @__PURE__ */ __exportAll({
	$id: () => $id$3,
	additionalProperties: () => false,
	default: () => data_default$1,
	description: () => description$1,
	properties: () => properties$3,
	required: () => required$1,
	type: () => type$3
}), $id$3, description$1, type$3, required$1, properties$3, data_default$1;
var init_data$1 = __esmMin((() => {
	$id$3 = "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#";
	description$1 = "Meta-schema for $data reference (JSON AnySchema extension proposal)";
	type$3 = "object";
	required$1 = ["$data"];
	properties$3 = { "$data": {
		"type": "string",
		"anyOf": [{ "format": "relative-json-pointer" }, { "format": "json-pointer" }]
	} };
	data_default$1 = {
		$id: $id$3,
		description: description$1,
		type: type$3,
		required: required$1,
		properties: properties$3,
		additionalProperties: false
	};
}));
//#endregion
//#region node_modules/fast-uri/lib/utils.js
var require_utils = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** @type {(value: string) => boolean} */
	var isUUID = RegExp.prototype.test.bind(/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/iu);
	/** @type {(value: string) => boolean} */
	var isIPv4 = RegExp.prototype.test.bind(/^(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)$/u);
	/** @type {(value: string) => boolean} */
	var isHexPair = RegExp.prototype.test.bind(/^[\da-f]{2}$/iu);
	/** @type {(value: string) => boolean} */
	var isUnreserved = RegExp.prototype.test.bind(/^[\da-z\-._~]$/iu);
	/** @type {(value: string) => boolean} */
	var isPathCharacter = RegExp.prototype.test.bind(/^[\da-z\-._~!$&'()*+,;=:@/]$/iu);
	/**
	* @param {Array<string>} input
	* @returns {string}
	*/
	function stringArrayToHexStripped(input) {
		let acc = "";
		let code = 0;
		let i = 0;
		for (i = 0; i < input.length; i++) {
			code = input[i].charCodeAt(0);
			if (code === 48) continue;
			if (!(code >= 48 && code <= 57 || code >= 65 && code <= 70 || code >= 97 && code <= 102)) return "";
			acc += input[i];
			break;
		}
		for (i += 1; i < input.length; i++) {
			code = input[i].charCodeAt(0);
			if (!(code >= 48 && code <= 57 || code >= 65 && code <= 70 || code >= 97 && code <= 102)) return "";
			acc += input[i];
		}
		return acc;
	}
	/**
	* @typedef {Object} GetIPV6Result
	* @property {boolean} error - Indicates if there was an error parsing the IPv6 address.
	* @property {string} address - The parsed IPv6 address.
	* @property {string} [zone] - The zone identifier, if present.
	*/
	/**
	* @param {string} value
	* @returns {boolean}
	*/
	var nonSimpleDomain = RegExp.prototype.test.bind(/[^!"$&'()*+,\-.;=_`a-z{}~]/u);
	/**
	* @param {Array<string>} buffer
	* @returns {boolean}
	*/
	function consumeIsZone(buffer) {
		buffer.length = 0;
		return true;
	}
	/**
	* @param {Array<string>} buffer
	* @param {Array<string>} address
	* @param {GetIPV6Result} output
	* @returns {boolean}
	*/
	function consumeHextets(buffer, address, output) {
		if (buffer.length) {
			const hex = stringArrayToHexStripped(buffer);
			if (hex !== "") address.push(hex);
			else {
				output.error = true;
				return false;
			}
			buffer.length = 0;
		}
		return true;
	}
	/**
	* @param {string} input
	* @returns {GetIPV6Result}
	*/
	function getIPV6(input) {
		let tokenCount = 0;
		const output = {
			error: false,
			address: "",
			zone: ""
		};
		/** @type {Array<string>} */
		const address = [];
		/** @type {Array<string>} */
		const buffer = [];
		let endipv6Encountered = false;
		let endIpv6 = false;
		let consume = consumeHextets;
		for (let i = 0; i < input.length; i++) {
			const cursor = input[i];
			if (cursor === "[" || cursor === "]") continue;
			if (cursor === ":") {
				if (endipv6Encountered === true) endIpv6 = true;
				if (!consume(buffer, address, output)) break;
				if (++tokenCount > 7) {
					output.error = true;
					break;
				}
				if (i > 0 && input[i - 1] === ":") endipv6Encountered = true;
				address.push(":");
				continue;
			} else if (cursor === "%") {
				if (!consume(buffer, address, output)) break;
				consume = consumeIsZone;
			} else {
				buffer.push(cursor);
				continue;
			}
		}
		if (buffer.length) if (consume === consumeIsZone) output.zone = buffer.join("");
		else if (endIpv6) address.push(buffer.join(""));
		else address.push(stringArrayToHexStripped(buffer));
		output.address = address.join("");
		return output;
	}
	/**
	* @typedef {Object} NormalizeIPv6Result
	* @property {string} host - The normalized host.
	* @property {string} [escapedHost] - The escaped host.
	* @property {boolean} isIPV6 - Indicates if the host is an IPv6 address.
	*/
	/**
	* @param {string} host
	* @returns {NormalizeIPv6Result}
	*/
	function normalizeIPv6(host) {
		if (findToken(host, ":") < 2) return {
			host,
			isIPV6: false
		};
		const ipv6 = getIPV6(host);
		if (!ipv6.error) {
			let newHost = ipv6.address;
			let escapedHost = ipv6.address;
			if (ipv6.zone) {
				newHost += "%" + ipv6.zone;
				escapedHost += "%25" + ipv6.zone;
			}
			return {
				host: newHost,
				isIPV6: true,
				escapedHost
			};
		} else return {
			host,
			isIPV6: false
		};
	}
	/**
	* @param {string} str
	* @param {string} token
	* @returns {number}
	*/
	function findToken(str, token) {
		let ind = 0;
		for (let i = 0; i < str.length; i++) if (str[i] === token) ind++;
		return ind;
	}
	/**
	* @param {string} path
	* @returns {string}
	*
	* @see https://datatracker.ietf.org/doc/html/rfc3986#section-5.2.4
	*/
	function removeDotSegments(path) {
		let input = path;
		const output = [];
		let nextSlash = -1;
		let len = 0;
		while (len = input.length) {
			if (len === 1) if (input === ".") break;
			else if (input === "/") {
				output.push("/");
				break;
			} else {
				output.push(input);
				break;
			}
			else if (len === 2) {
				if (input[0] === ".") {
					if (input[1] === ".") break;
					else if (input[1] === "/") {
						input = input.slice(2);
						continue;
					}
				} else if (input[0] === "/") {
					if (input[1] === "." || input[1] === "/") {
						output.push("/");
						break;
					}
				}
			} else if (len === 3) {
				if (input === "/..") {
					if (output.length !== 0) output.pop();
					output.push("/");
					break;
				}
			}
			if (input[0] === ".") {
				if (input[1] === ".") {
					if (input[2] === "/") {
						input = input.slice(3);
						continue;
					}
				} else if (input[1] === "/") {
					input = input.slice(2);
					continue;
				}
			} else if (input[0] === "/") {
				if (input[1] === ".") {
					if (input[2] === "/") {
						input = input.slice(2);
						continue;
					} else if (input[2] === ".") {
						if (input[3] === "/") {
							input = input.slice(3);
							if (output.length !== 0) output.pop();
							continue;
						}
					}
				}
			}
			if ((nextSlash = input.indexOf("/", 1)) === -1) {
				output.push(input);
				break;
			} else {
				output.push(input.slice(0, nextSlash));
				input = input.slice(nextSlash);
			}
		}
		return output.join("");
	}
	/**
	* Re-escape RFC 3986 gen-delims that must not appear literally in the host.
	* After the URI regex parses, these characters cannot be literal in the host
	* field, so any that appear after decoding came from percent-encoding and
	* must be restored to prevent authority structure changes.
	*
	* @param {string} host
	* @param {boolean} isIP - true for IPv4/IPv6 hosts (skip colon re-escaping)
	* @returns {string}
	*/
	var HOST_DELIMS = {
		"@": "%40",
		"/": "%2F",
		"?": "%3F",
		"#": "%23",
		":": "%3A"
	};
	var HOST_DELIM_RE = /[@/?#:]/g;
	var HOST_DELIM_NO_COLON_RE = /[@/?#]/g;
	function reescapeHostDelimiters(host, isIP) {
		const re = isIP ? HOST_DELIM_NO_COLON_RE : HOST_DELIM_RE;
		re.lastIndex = 0;
		return host.replace(re, (ch) => HOST_DELIMS[ch]);
	}
	/**
	* Normalizes percent escapes and optionally decodes only unreserved ASCII bytes.
	* Reserved delimiters such as `%2F` and `%2E` stay escaped.
	*
	* @param {string} input
	* @param {boolean} [decodeUnreserved=false]
	* @returns {string}
	*/
	function normalizePercentEncoding(input, decodeUnreserved = false) {
		if (input.indexOf("%") === -1) return input;
		let output = "";
		for (let i = 0; i < input.length; i++) {
			if (input[i] === "%" && i + 2 < input.length) {
				const hex = input.slice(i + 1, i + 3);
				if (isHexPair(hex)) {
					const normalizedHex = hex.toUpperCase();
					const decoded = String.fromCharCode(parseInt(normalizedHex, 16));
					if (decodeUnreserved && isUnreserved(decoded)) output += decoded;
					else output += "%" + normalizedHex;
					i += 2;
					continue;
				}
			}
			output += input[i];
		}
		return output;
	}
	/**
	* Normalizes path data without turning reserved escapes into live path syntax.
	* Valid escapes are uppercased, raw unsafe characters are escaped, and only
	* unreserved bytes that are not `.` are decoded.
	*
	* @param {string} input
	* @returns {string}
	*/
	function normalizePathEncoding(input) {
		let output = "";
		for (let i = 0; i < input.length; i++) {
			if (input[i] === "%" && i + 2 < input.length) {
				const hex = input.slice(i + 1, i + 3);
				if (isHexPair(hex)) {
					const normalizedHex = hex.toUpperCase();
					const decoded = String.fromCharCode(parseInt(normalizedHex, 16));
					if (decoded !== "." && isUnreserved(decoded)) output += decoded;
					else output += "%" + normalizedHex;
					i += 2;
					continue;
				}
			}
			if (isPathCharacter(input[i])) output += input[i];
			else output += escape(input[i]);
		}
		return output;
	}
	/**
	* Escapes a component while preserving existing valid percent escapes.
	*
	* @param {string} input
	* @returns {string}
	*/
	function escapePreservingEscapes(input) {
		let output = "";
		for (let i = 0; i < input.length; i++) {
			if (input[i] === "%" && i + 2 < input.length) {
				const hex = input.slice(i + 1, i + 3);
				if (isHexPair(hex)) {
					output += "%" + hex.toUpperCase();
					i += 2;
					continue;
				}
			}
			output += escape(input[i]);
		}
		return output;
	}
	/**
	* @param {import('../types/index').URIComponent} component
	* @returns {string|undefined}
	*/
	function recomposeAuthority(component) {
		const uriTokens = [];
		if (component.userinfo !== void 0) {
			uriTokens.push(component.userinfo);
			uriTokens.push("@");
		}
		if (component.host !== void 0) {
			let host = unescape(component.host);
			if (!isIPv4(host)) {
				const ipV6res = normalizeIPv6(host);
				if (ipV6res.isIPV6 === true) host = `[${ipV6res.escapedHost}]`;
				else host = reescapeHostDelimiters(host, false);
			}
			uriTokens.push(host);
		}
		if (typeof component.port === "number" || typeof component.port === "string") {
			uriTokens.push(":");
			uriTokens.push(String(component.port));
		}
		return uriTokens.length ? uriTokens.join("") : void 0;
	}
	module.exports = {
		nonSimpleDomain,
		recomposeAuthority,
		reescapeHostDelimiters,
		normalizePercentEncoding,
		normalizePathEncoding,
		escapePreservingEscapes,
		removeDotSegments,
		isIPv4,
		isUUID,
		normalizeIPv6,
		stringArrayToHexStripped
	};
}));
//#endregion
//#region node_modules/fast-uri/lib/schemes.js
var require_schemes = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var { isUUID } = require_utils();
	var URN_REG = /([\da-z][\d\-a-z]{0,31}):((?:[\w!$'()*+,\-.:;=@]|%[\da-f]{2})+)/iu;
	var supportedSchemeNames = [
		"http",
		"https",
		"ws",
		"wss",
		"urn",
		"urn:uuid"
	];
	/** @typedef {supportedSchemeNames[number]} SchemeName */
	/**
	* @param {string} name
	* @returns {name is SchemeName}
	*/
	function isValidSchemeName(name) {
		return supportedSchemeNames.indexOf(name) !== -1;
	}
	/**
	* @callback SchemeFn
	* @param {import('../types/index').URIComponent} component
	* @param {import('../types/index').Options} options
	* @returns {import('../types/index').URIComponent}
	*/
	/**
	* @typedef {Object} SchemeHandler
	* @property {SchemeName} scheme - The scheme name.
	* @property {boolean} [domainHost] - Indicates if the scheme supports domain hosts.
	* @property {SchemeFn} parse - Function to parse the URI component for this scheme.
	* @property {SchemeFn} serialize - Function to serialize the URI component for this scheme.
	* @property {boolean} [skipNormalize] - Indicates if normalization should be skipped for this scheme.
	* @property {boolean} [absolutePath] - Indicates if the scheme uses absolute paths.
	* @property {boolean} [unicodeSupport] - Indicates if the scheme supports Unicode.
	*/
	/**
	* @param {import('../types/index').URIComponent} wsComponent
	* @returns {boolean}
	*/
	function wsIsSecure(wsComponent) {
		if (wsComponent.secure === true) return true;
		else if (wsComponent.secure === false) return false;
		else if (wsComponent.scheme) return wsComponent.scheme.length === 3 && (wsComponent.scheme[0] === "w" || wsComponent.scheme[0] === "W") && (wsComponent.scheme[1] === "s" || wsComponent.scheme[1] === "S") && (wsComponent.scheme[2] === "s" || wsComponent.scheme[2] === "S");
		else return false;
	}
	/** @type {SchemeFn} */
	function httpParse(component) {
		if (!component.host) component.error = component.error || "HTTP URIs must have a host.";
		return component;
	}
	/** @type {SchemeFn} */
	function httpSerialize(component) {
		const secure = String(component.scheme).toLowerCase() === "https";
		if (component.port === (secure ? 443 : 80) || component.port === "") component.port = void 0;
		if (!component.path) component.path = "/";
		return component;
	}
	/** @type {SchemeFn} */
	function wsParse(wsComponent) {
		wsComponent.secure = wsIsSecure(wsComponent);
		wsComponent.resourceName = (wsComponent.path || "/") + (wsComponent.query ? "?" + wsComponent.query : "");
		wsComponent.path = void 0;
		wsComponent.query = void 0;
		return wsComponent;
	}
	/** @type {SchemeFn} */
	function wsSerialize(wsComponent) {
		if (wsComponent.port === (wsIsSecure(wsComponent) ? 443 : 80) || wsComponent.port === "") wsComponent.port = void 0;
		if (typeof wsComponent.secure === "boolean") {
			wsComponent.scheme = wsComponent.secure ? "wss" : "ws";
			wsComponent.secure = void 0;
		}
		if (wsComponent.resourceName) {
			const [path, query] = wsComponent.resourceName.split("?");
			wsComponent.path = path && path !== "/" ? path : void 0;
			wsComponent.query = query;
			wsComponent.resourceName = void 0;
		}
		wsComponent.fragment = void 0;
		return wsComponent;
	}
	/** @type {SchemeFn} */
	function urnParse(urnComponent, options) {
		if (!urnComponent.path) {
			urnComponent.error = "URN can not be parsed";
			return urnComponent;
		}
		const matches = urnComponent.path.match(URN_REG);
		if (matches) {
			const scheme = options.scheme || urnComponent.scheme || "urn";
			urnComponent.nid = matches[1].toLowerCase();
			urnComponent.nss = matches[2];
			const schemeHandler = getSchemeHandler(`${scheme}:${options.nid || urnComponent.nid}`);
			urnComponent.path = void 0;
			if (schemeHandler) urnComponent = schemeHandler.parse(urnComponent, options);
		} else urnComponent.error = urnComponent.error || "URN can not be parsed.";
		return urnComponent;
	}
	/** @type {SchemeFn} */
	function urnSerialize(urnComponent, options) {
		if (urnComponent.nid === void 0) throw new Error("URN without nid cannot be serialized");
		const scheme = options.scheme || urnComponent.scheme || "urn";
		const nid = urnComponent.nid.toLowerCase();
		const schemeHandler = getSchemeHandler(`${scheme}:${options.nid || nid}`);
		if (schemeHandler) urnComponent = schemeHandler.serialize(urnComponent, options);
		const uriComponent = urnComponent;
		const nss = urnComponent.nss;
		uriComponent.path = `${nid || options.nid}:${nss}`;
		options.skipEscape = true;
		return uriComponent;
	}
	/** @type {SchemeFn} */
	function urnuuidParse(urnComponent, options) {
		const uuidComponent = urnComponent;
		uuidComponent.uuid = uuidComponent.nss;
		uuidComponent.nss = void 0;
		if (!options.tolerant && (!uuidComponent.uuid || !isUUID(uuidComponent.uuid))) uuidComponent.error = uuidComponent.error || "UUID is not valid.";
		return uuidComponent;
	}
	/** @type {SchemeFn} */
	function urnuuidSerialize(uuidComponent) {
		const urnComponent = uuidComponent;
		urnComponent.nss = (uuidComponent.uuid || "").toLowerCase();
		return urnComponent;
	}
	var http = {
		scheme: "http",
		domainHost: true,
		parse: httpParse,
		serialize: httpSerialize
	};
	var https = {
		scheme: "https",
		domainHost: http.domainHost,
		parse: httpParse,
		serialize: httpSerialize
	};
	var ws = {
		scheme: "ws",
		domainHost: true,
		parse: wsParse,
		serialize: wsSerialize
	};
	var SCHEMES = {
		http,
		https,
		ws,
		wss: {
			scheme: "wss",
			domainHost: ws.domainHost,
			parse: ws.parse,
			serialize: ws.serialize
		},
		urn: {
			scheme: "urn",
			parse: urnParse,
			serialize: urnSerialize,
			skipNormalize: true
		},
		"urn:uuid": {
			scheme: "urn:uuid",
			parse: urnuuidParse,
			serialize: urnuuidSerialize,
			skipNormalize: true
		}
	};
	Object.setPrototypeOf(SCHEMES, null);
	/**
	* @param {string|undefined} scheme
	* @returns {SchemeHandler|undefined}
	*/
	function getSchemeHandler(scheme) {
		return scheme && (SCHEMES[scheme] || SCHEMES[scheme.toLowerCase()]) || void 0;
	}
	module.exports = {
		wsIsSecure,
		SCHEMES,
		isValidSchemeName,
		getSchemeHandler
	};
}));
//#endregion
//#region node_modules/fast-uri/index.js
var require_fast_uri = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var { normalizeIPv6, removeDotSegments, recomposeAuthority, normalizePercentEncoding, normalizePathEncoding, escapePreservingEscapes, reescapeHostDelimiters, isIPv4, nonSimpleDomain } = require_utils();
	var { SCHEMES, getSchemeHandler } = require_schemes();
	/**
	* @template {import('./types/index').URIComponent|string} T
	* @param {T} uri
	* @param {import('./types/index').Options} [options]
	* @returns {T}
	*/
	function normalize(uri, options) {
		if (typeof uri === "string") uri = normalizeString(uri, options);
		else if (typeof uri === "object") uri = parse(serialize(uri, options), options);
		return uri;
	}
	/**
	* @param {string} baseURI
	* @param {string} relativeURI
	* @param {import('./types/index').Options} [options]
	* @returns {string}
	*/
	function resolve(baseURI, relativeURI, options) {
		const schemelessOptions = options ? Object.assign({ scheme: "null" }, options) : { scheme: "null" };
		const { parsed: baseParsed, malformedAuthorityOrPort: baseMalformed } = parseWithStatus(baseURI, schemelessOptions);
		const { parsed: relativeParsed, malformedAuthorityOrPort: relativeMalformed } = parseWithStatus(relativeURI, schemelessOptions);
		if (baseMalformed || relativeMalformed) throw new Error(baseParsed.error || relativeParsed.error || "URI is malformed.");
		const resolved = resolveComponent(baseParsed, relativeParsed, schemelessOptions, true);
		schemelessOptions.skipEscape = true;
		return serialize(resolved, schemelessOptions);
	}
	/**
	* @param {import ('./types/index').URIComponent} base
	* @param {import ('./types/index').URIComponent} relative
	* @param {import('./types/index').Options} [options]
	* @param {boolean} [skipNormalization=false]
	* @returns {import ('./types/index').URIComponent}
	*/
	function resolveComponent(base, relative, options, skipNormalization) {
		/** @type {import('./types/index').URIComponent} */
		const target = {};
		if (!skipNormalization) {
			base = parse(serialize(base, options), options);
			relative = parse(serialize(relative, options), options);
		}
		options = options || {};
		if (!options.tolerant && relative.scheme) {
			target.scheme = relative.scheme;
			target.userinfo = relative.userinfo;
			target.host = relative.host;
			target.port = relative.port;
			target.path = removeDotSegments(relative.path || "");
			target.query = relative.query;
		} else {
			if (relative.userinfo !== void 0 || relative.host !== void 0 || relative.port !== void 0) {
				target.userinfo = relative.userinfo;
				target.host = relative.host;
				target.port = relative.port;
				target.path = removeDotSegments(relative.path || "");
				target.query = relative.query;
			} else {
				if (!relative.path) {
					target.path = base.path;
					if (relative.query !== void 0) target.query = relative.query;
					else target.query = base.query;
				} else {
					if (relative.path[0] === "/") target.path = removeDotSegments(relative.path);
					else {
						if ((base.userinfo !== void 0 || base.host !== void 0 || base.port !== void 0) && !base.path) target.path = "/" + relative.path;
						else if (!base.path) target.path = relative.path;
						else target.path = base.path.slice(0, base.path.lastIndexOf("/") + 1) + relative.path;
						target.path = removeDotSegments(target.path);
					}
					target.query = relative.query;
				}
				target.userinfo = base.userinfo;
				target.host = base.host;
				target.port = base.port;
			}
			target.scheme = base.scheme;
		}
		target.fragment = relative.fragment;
		return target;
	}
	/**
	* @param {import ('./types/index').URIComponent|string} uriA
	* @param {import ('./types/index').URIComponent|string} uriB
	* @param {import ('./types/index').Options} options
	* @returns {boolean}
	*/
	function equal(uriA, uriB, options) {
		const normalizedA = normalizeComparableURI(uriA, options);
		const normalizedB = normalizeComparableURI(uriB, options);
		return normalizedA !== void 0 && normalizedB !== void 0 && normalizedA.toLowerCase() === normalizedB.toLowerCase();
	}
	/**
	* @param {Readonly<import('./types/index').URIComponent>} cmpts
	* @param {import('./types/index').Options} [opts]
	* @returns {string}
	*/
	function serialize(cmpts, opts) {
		const component = {
			host: cmpts.host,
			scheme: cmpts.scheme,
			userinfo: cmpts.userinfo,
			port: cmpts.port,
			path: cmpts.path,
			query: cmpts.query,
			nid: cmpts.nid,
			nss: cmpts.nss,
			uuid: cmpts.uuid,
			fragment: cmpts.fragment,
			reference: cmpts.reference,
			resourceName: cmpts.resourceName,
			secure: cmpts.secure,
			error: ""
		};
		const options = Object.assign({}, opts);
		const uriTokens = [];
		const schemeHandler = getSchemeHandler(options.scheme || component.scheme);
		if (schemeHandler && schemeHandler.serialize) schemeHandler.serialize(component, options);
		if (component.path !== void 0) if (!options.skipEscape) {
			component.path = escapePreservingEscapes(component.path);
			if (component.scheme !== void 0) component.path = component.path.split("%3A").join(":");
		} else component.path = normalizePercentEncoding(component.path);
		if (options.reference !== "suffix" && component.scheme) uriTokens.push(component.scheme, ":");
		const authority = recomposeAuthority(component);
		if (authority !== void 0) {
			if (options.reference !== "suffix") uriTokens.push("//");
			uriTokens.push(authority);
			if (component.path && component.path[0] !== "/") uriTokens.push("/");
		}
		if (component.path !== void 0) {
			let s = component.path;
			if (!options.absolutePath && (!schemeHandler || !schemeHandler.absolutePath)) s = removeDotSegments(s);
			if (authority === void 0 && s[0] === "/" && s[1] === "/") s = "/%2F" + s.slice(2);
			uriTokens.push(s);
		}
		if (component.query !== void 0) uriTokens.push("?", component.query);
		if (component.fragment !== void 0) uriTokens.push("#", component.fragment);
		return uriTokens.join("");
	}
	var URI_PARSE = /^(?:([^#/:?]+):)?(?:\/\/((?:([^#/?@]*)@)?(\[[^#/?\]]+\]|[^#/:?]*)(?::(\d*))?))?([^#?]*)(?:\?([^#]*))?(?:#((?:.|[\n\r])*))?/u;
	var AUTHORITY_PREFIX = /^(?:[^#/:?]+:)?\/\/([^/?#]*)/;
	var AUTHORITY_INTRODUCER_REGION = /^(?:[^#/:?]+:)?([/\\\t\n\r]*)/;
	/**
	* @param {import('./types/index').URIComponent} parsed
	* @param {RegExpMatchArray} matches
	* @returns {string|undefined}
	*/
	function getParseError(parsed, matches) {
		if (matches[2] !== void 0 && parsed.path && parsed.path[0] !== "/") return "URI path must start with \"/\" when authority is present.";
		if (typeof parsed.port === "number" && (parsed.port < 0 || parsed.port > 65535)) return "URI port is malformed.";
	}
	/**
	* @param {string} uri
	* @param {import('./types/index').Options} [opts]
	* @returns {{ parsed: import('./types/index').URIComponent, malformedAuthorityOrPort: boolean }}
	*/
	function parseWithStatus(uri, opts) {
		const options = Object.assign({}, opts);
		/** @type {import('./types/index').URIComponent} */
		const parsed = {
			scheme: void 0,
			userinfo: void 0,
			host: "",
			port: void 0,
			path: "",
			query: void 0,
			fragment: void 0
		};
		let malformedAuthorityOrPort = false;
		let isIP = false;
		if (options.reference === "suffix") if (options.scheme) uri = options.scheme + ":" + uri;
		else uri = "//" + uri;
		const authorityMatch = uri.match(AUTHORITY_PREFIX);
		if (authorityMatch !== null && authorityMatch[1].indexOf("\\") !== -1) {
			parsed.error = "URI authority must not contain a literal backslash.";
			malformedAuthorityOrPort = true;
		}
		const introducerMatch = uri.match(AUTHORITY_INTRODUCER_REGION);
		if (introducerMatch !== null) {
			const region = introducerMatch[1];
			const normalizedRegion = region.replace(/[\t\n\r]/g, "");
			if (normalizedRegion.length >= 2) {
				if (normalizedRegion.slice(0, 2) !== "//") {
					parsed.error = parsed.error || "URI authority must not contain a literal backslash.";
					malformedAuthorityOrPort = true;
				} else if (region.length !== normalizedRegion.length) {
					parsed.error = parsed.error || "URI authority introducer must not contain whitespace.";
					malformedAuthorityOrPort = true;
				}
			}
		}
		const matches = uri.match(URI_PARSE);
		if (matches) {
			parsed.scheme = matches[1];
			parsed.userinfo = matches[3];
			parsed.host = matches[4];
			parsed.port = parseInt(matches[5], 10);
			parsed.path = matches[6] || "";
			parsed.query = matches[7];
			parsed.fragment = matches[8];
			if (isNaN(parsed.port)) parsed.port = matches[5];
			const parseError = getParseError(parsed, matches);
			if (parseError !== void 0) {
				parsed.error = parsed.error || parseError;
				malformedAuthorityOrPort = true;
			}
			if (parsed.host) if (isIPv4(parsed.host) === false) {
				const ipv6result = normalizeIPv6(parsed.host);
				parsed.host = ipv6result.host.toLowerCase();
				isIP = ipv6result.isIPV6;
			} else isIP = true;
			if (parsed.scheme === void 0 && parsed.userinfo === void 0 && parsed.host === void 0 && parsed.port === void 0 && parsed.query === void 0 && !parsed.path) parsed.reference = "same-document";
			else if (parsed.scheme === void 0) parsed.reference = "relative";
			else if (parsed.fragment === void 0) parsed.reference = "absolute";
			else parsed.reference = "uri";
			if (options.reference && options.reference !== "suffix" && options.reference !== parsed.reference) parsed.error = parsed.error || "URI is not a " + options.reference + " reference.";
			const schemeHandler = getSchemeHandler(options.scheme || parsed.scheme);
			if (!options.unicodeSupport && (!schemeHandler || !schemeHandler.unicodeSupport)) {
				if (parsed.host && (options.domainHost || schemeHandler && schemeHandler.domainHost) && isIP === false && nonSimpleDomain(parsed.host)) try {
					parsed.host = new URL("http://" + parsed.host).hostname;
				} catch (e) {
					parsed.error = parsed.error || "Host's domain name can not be converted to ASCII: " + e;
				}
			}
			if (!schemeHandler || schemeHandler && !schemeHandler.skipNormalize) {
				if (uri.indexOf("%") !== -1) {
					if (parsed.scheme !== void 0) parsed.scheme = unescape(parsed.scheme);
					if (parsed.host !== void 0) parsed.host = reescapeHostDelimiters(unescape(parsed.host), isIP);
				}
				if (parsed.path) parsed.path = normalizePathEncoding(parsed.path);
				if (parsed.fragment) try {
					parsed.fragment = encodeURI(decodeURIComponent(parsed.fragment));
				} catch {
					parsed.error = parsed.error || "URI malformed";
				}
			}
			if (schemeHandler && schemeHandler.parse) schemeHandler.parse(parsed, options);
		} else parsed.error = parsed.error || "URI can not be parsed.";
		return {
			parsed,
			malformedAuthorityOrPort
		};
	}
	/**
	* @param {string} uri
	* @param {import('./types/index').Options} [opts]
	* @returns
	*/
	function parse(uri, opts) {
		return parseWithStatus(uri, opts).parsed;
	}
	/**
	* @param {string} uri
	* @param {import('./types/index').Options} [opts]
	* @returns {string}
	*/
	function normalizeString(uri, opts) {
		return normalizeStringWithStatus(uri, opts).normalized;
	}
	/**
	* @param {string} uri
	* @param {import('./types/index').Options} [opts]
	* @returns {{ normalized: string, malformedAuthorityOrPort: boolean }}
	*/
	function normalizeStringWithStatus(uri, opts) {
		const { parsed, malformedAuthorityOrPort } = parseWithStatus(uri, opts);
		return {
			normalized: malformedAuthorityOrPort ? uri : serialize(parsed, opts),
			malformedAuthorityOrPort
		};
	}
	/**
	* @param {import ('./types/index').URIComponent|string} uri
	* @param {import('./types/index').Options} [opts]
	* @returns {string|undefined}
	*/
	function normalizeComparableURI(uri, opts) {
		if (typeof uri === "string") {
			const { normalized, malformedAuthorityOrPort } = normalizeStringWithStatus(uri, opts);
			return malformedAuthorityOrPort ? void 0 : normalized;
		}
		if (typeof uri === "object") return serialize(uri, opts);
	}
	var fastUri = {
		SCHEMES,
		normalize,
		resolve,
		resolveComponent,
		equal,
		serialize,
		parse
	};
	module.exports = fastUri;
	module.exports.default = fastUri;
	module.exports.fastUri = fastUri;
}));
//#endregion
//#region node_modules/@modelcontextprotocol/sdk/node_modules/ajv/dist/runtime/uri.js
var require_uri$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var uri = require_fast_uri();
	uri.code = "require(\"ajv/dist/runtime/uri\").default";
	exports.default = uri;
}));
//#endregion
//#region node_modules/@modelcontextprotocol/sdk/node_modules/ajv/dist/core.js
var require_core$3 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.CodeGen = exports.Name = exports.nil = exports.stringify = exports.str = exports._ = exports.KeywordCxt = void 0;
	var validate_1 = require_validate$1();
	Object.defineProperty(exports, "KeywordCxt", {
		enumerable: true,
		get: function() {
			return validate_1.KeywordCxt;
		}
	});
	var codegen_1 = require_codegen$1();
	Object.defineProperty(exports, "_", {
		enumerable: true,
		get: function() {
			return codegen_1._;
		}
	});
	Object.defineProperty(exports, "str", {
		enumerable: true,
		get: function() {
			return codegen_1.str;
		}
	});
	Object.defineProperty(exports, "stringify", {
		enumerable: true,
		get: function() {
			return codegen_1.stringify;
		}
	});
	Object.defineProperty(exports, "nil", {
		enumerable: true,
		get: function() {
			return codegen_1.nil;
		}
	});
	Object.defineProperty(exports, "Name", {
		enumerable: true,
		get: function() {
			return codegen_1.Name;
		}
	});
	Object.defineProperty(exports, "CodeGen", {
		enumerable: true,
		get: function() {
			return codegen_1.CodeGen;
		}
	});
	var validation_error_1 = require_validation_error$1();
	var ref_error_1 = require_ref_error$1();
	var rules_1 = require_rules$1();
	var compile_1 = require_compile$1();
	var codegen_2 = require_codegen$1();
	var resolve_1 = require_resolve$1();
	var dataType_1 = require_dataType$1();
	var util_1 = require_util$1();
	var $dataRefSchema = (init_data$1(), __toCommonJS(data_exports$1).default);
	var uri_1 = require_uri$1();
	var defaultRegExp = (str, flags) => new RegExp(str, flags);
	defaultRegExp.code = "new RegExp";
	var META_IGNORE_OPTIONS = [
		"removeAdditional",
		"useDefaults",
		"coerceTypes"
	];
	var EXT_SCOPE_NAMES = /* @__PURE__ */ new Set([
		"validate",
		"serialize",
		"parse",
		"wrapper",
		"root",
		"schema",
		"keyword",
		"pattern",
		"formats",
		"validate$data",
		"func",
		"obj",
		"Error"
	]);
	var removedOptions = {
		errorDataPath: "",
		format: "`validateFormats: false` can be used instead.",
		nullable: "\"nullable\" keyword is supported by default.",
		jsonPointers: "Deprecated jsPropertySyntax can be used instead.",
		extendRefs: "Deprecated ignoreKeywordsWithRef can be used instead.",
		missingRefs: "Pass empty schema with $id that should be ignored to ajv.addSchema.",
		processCode: "Use option `code: {process: (code, schemaEnv: object) => string}`",
		sourceCode: "Use option `code: {source: true}`",
		strictDefaults: "It is default now, see option `strict`.",
		strictKeywords: "It is default now, see option `strict`.",
		uniqueItems: "\"uniqueItems\" keyword is always validated.",
		unknownFormats: "Disable strict mode or pass `true` to `ajv.addFormat` (or `formats` option).",
		cache: "Map is used as cache, schema object as key.",
		serialize: "Map is used as cache, schema object as key.",
		ajvErrors: "It is default now."
	};
	var deprecatedOptions = {
		ignoreKeywordsWithRef: "",
		jsPropertySyntax: "",
		unicode: "\"minLength\"/\"maxLength\" account for unicode characters by default."
	};
	var MAX_EXPRESSION = 200;
	function requiredOptions(o) {
		var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0;
		const s = o.strict;
		const _optz = (_a = o.code) === null || _a === void 0 ? void 0 : _a.optimize;
		const optimize = _optz === true || _optz === void 0 ? 1 : _optz || 0;
		const regExp = (_c = (_b = o.code) === null || _b === void 0 ? void 0 : _b.regExp) !== null && _c !== void 0 ? _c : defaultRegExp;
		const uriResolver = (_d = o.uriResolver) !== null && _d !== void 0 ? _d : uri_1.default;
		return {
			strictSchema: (_f = (_e = o.strictSchema) !== null && _e !== void 0 ? _e : s) !== null && _f !== void 0 ? _f : true,
			strictNumbers: (_h = (_g = o.strictNumbers) !== null && _g !== void 0 ? _g : s) !== null && _h !== void 0 ? _h : true,
			strictTypes: (_k = (_j = o.strictTypes) !== null && _j !== void 0 ? _j : s) !== null && _k !== void 0 ? _k : "log",
			strictTuples: (_m = (_l = o.strictTuples) !== null && _l !== void 0 ? _l : s) !== null && _m !== void 0 ? _m : "log",
			strictRequired: (_p = (_o = o.strictRequired) !== null && _o !== void 0 ? _o : s) !== null && _p !== void 0 ? _p : false,
			code: o.code ? {
				...o.code,
				optimize,
				regExp
			} : {
				optimize,
				regExp
			},
			loopRequired: (_q = o.loopRequired) !== null && _q !== void 0 ? _q : MAX_EXPRESSION,
			loopEnum: (_r = o.loopEnum) !== null && _r !== void 0 ? _r : MAX_EXPRESSION,
			meta: (_s = o.meta) !== null && _s !== void 0 ? _s : true,
			messages: (_t = o.messages) !== null && _t !== void 0 ? _t : true,
			inlineRefs: (_u = o.inlineRefs) !== null && _u !== void 0 ? _u : true,
			schemaId: (_v = o.schemaId) !== null && _v !== void 0 ? _v : "$id",
			addUsedSchema: (_w = o.addUsedSchema) !== null && _w !== void 0 ? _w : true,
			validateSchema: (_x = o.validateSchema) !== null && _x !== void 0 ? _x : true,
			validateFormats: (_y = o.validateFormats) !== null && _y !== void 0 ? _y : true,
			unicodeRegExp: (_z = o.unicodeRegExp) !== null && _z !== void 0 ? _z : true,
			int32range: (_0 = o.int32range) !== null && _0 !== void 0 ? _0 : true,
			uriResolver
		};
	}
	var Ajv = class {
		constructor(opts = {}) {
			this.schemas = {};
			this.refs = {};
			this.formats = Object.create(null);
			this._compilations = /* @__PURE__ */ new Set();
			this._loading = {};
			this._cache = /* @__PURE__ */ new Map();
			opts = this.opts = {
				...opts,
				...requiredOptions(opts)
			};
			const { es5, lines } = this.opts.code;
			this.scope = new codegen_2.ValueScope({
				scope: {},
				prefixes: EXT_SCOPE_NAMES,
				es5,
				lines
			});
			this.logger = getLogger(opts.logger);
			const formatOpt = opts.validateFormats;
			opts.validateFormats = false;
			this.RULES = (0, rules_1.getRules)();
			checkOptions.call(this, removedOptions, opts, "NOT SUPPORTED");
			checkOptions.call(this, deprecatedOptions, opts, "DEPRECATED", "warn");
			this._metaOpts = getMetaSchemaOptions.call(this);
			if (opts.formats) addInitialFormats.call(this);
			this._addVocabularies();
			this._addDefaultMetaSchema();
			if (opts.keywords) addInitialKeywords.call(this, opts.keywords);
			if (typeof opts.meta == "object") this.addMetaSchema(opts.meta);
			addInitialSchemas.call(this);
			opts.validateFormats = formatOpt;
		}
		_addVocabularies() {
			this.addKeyword("$async");
		}
		_addDefaultMetaSchema() {
			const { $data, meta, schemaId } = this.opts;
			let _dataRefSchema = $dataRefSchema;
			if (schemaId === "id") {
				_dataRefSchema = { ...$dataRefSchema };
				_dataRefSchema.id = _dataRefSchema.$id;
				delete _dataRefSchema.$id;
			}
			if (meta && $data) this.addMetaSchema(_dataRefSchema, _dataRefSchema[schemaId], false);
		}
		defaultMeta() {
			const { meta, schemaId } = this.opts;
			return this.opts.defaultMeta = typeof meta == "object" ? meta[schemaId] || meta : void 0;
		}
		validate(schemaKeyRef, data) {
			let v;
			if (typeof schemaKeyRef == "string") {
				v = this.getSchema(schemaKeyRef);
				if (!v) throw new Error(`no schema with key or ref "${schemaKeyRef}"`);
			} else v = this.compile(schemaKeyRef);
			const valid = v(data);
			if (!("$async" in v)) this.errors = v.errors;
			return valid;
		}
		compile(schema, _meta) {
			const sch = this._addSchema(schema, _meta);
			return sch.validate || this._compileSchemaEnv(sch);
		}
		compileAsync(schema, meta) {
			if (typeof this.opts.loadSchema != "function") throw new Error("options.loadSchema should be a function");
			const { loadSchema } = this.opts;
			return runCompileAsync.call(this, schema, meta);
			async function runCompileAsync(_schema, _meta) {
				await loadMetaSchema.call(this, _schema.$schema);
				const sch = this._addSchema(_schema, _meta);
				return sch.validate || _compileAsync.call(this, sch);
			}
			async function loadMetaSchema($ref) {
				if ($ref && !this.getSchema($ref)) await runCompileAsync.call(this, { $ref }, true);
			}
			async function _compileAsync(sch) {
				try {
					return this._compileSchemaEnv(sch);
				} catch (e) {
					if (!(e instanceof ref_error_1.default)) throw e;
					checkLoaded.call(this, e);
					await loadMissingSchema.call(this, e.missingSchema);
					return _compileAsync.call(this, sch);
				}
			}
			function checkLoaded({ missingSchema: ref, missingRef }) {
				if (this.refs[ref]) throw new Error(`AnySchema ${ref} is loaded but ${missingRef} cannot be resolved`);
			}
			async function loadMissingSchema(ref) {
				const _schema = await _loadSchema.call(this, ref);
				if (!this.refs[ref]) await loadMetaSchema.call(this, _schema.$schema);
				if (!this.refs[ref]) this.addSchema(_schema, ref, meta);
			}
			async function _loadSchema(ref) {
				const p = this._loading[ref];
				if (p) return p;
				try {
					return await (this._loading[ref] = loadSchema(ref));
				} finally {
					delete this._loading[ref];
				}
			}
		}
		addSchema(schema, key, _meta, _validateSchema = this.opts.validateSchema) {
			if (Array.isArray(schema)) {
				for (const sch of schema) this.addSchema(sch, void 0, _meta, _validateSchema);
				return this;
			}
			let id;
			if (typeof schema === "object") {
				const { schemaId } = this.opts;
				id = schema[schemaId];
				if (id !== void 0 && typeof id != "string") throw new Error(`schema ${schemaId} must be string`);
			}
			key = (0, resolve_1.normalizeId)(key || id);
			this._checkUnique(key);
			this.schemas[key] = this._addSchema(schema, _meta, key, _validateSchema, true);
			return this;
		}
		addMetaSchema(schema, key, _validateSchema = this.opts.validateSchema) {
			this.addSchema(schema, key, true, _validateSchema);
			return this;
		}
		validateSchema(schema, throwOrLogError) {
			if (typeof schema == "boolean") return true;
			let $schema;
			$schema = schema.$schema;
			if ($schema !== void 0 && typeof $schema != "string") throw new Error("$schema must be a string");
			$schema = $schema || this.opts.defaultMeta || this.defaultMeta();
			if (!$schema) {
				this.logger.warn("meta-schema not available");
				this.errors = null;
				return true;
			}
			const valid = this.validate($schema, schema);
			if (!valid && throwOrLogError) {
				const message = "schema is invalid: " + this.errorsText();
				if (this.opts.validateSchema === "log") this.logger.error(message);
				else throw new Error(message);
			}
			return valid;
		}
		getSchema(keyRef) {
			let sch;
			while (typeof (sch = getSchEnv.call(this, keyRef)) == "string") keyRef = sch;
			if (sch === void 0) {
				const { schemaId } = this.opts;
				const root = new compile_1.SchemaEnv({
					schema: {},
					schemaId
				});
				sch = compile_1.resolveSchema.call(this, root, keyRef);
				if (!sch) return;
				this.refs[keyRef] = sch;
			}
			return sch.validate || this._compileSchemaEnv(sch);
		}
		removeSchema(schemaKeyRef) {
			if (schemaKeyRef instanceof RegExp) {
				this._removeAllSchemas(this.schemas, schemaKeyRef);
				this._removeAllSchemas(this.refs, schemaKeyRef);
				return this;
			}
			switch (typeof schemaKeyRef) {
				case "undefined":
					this._removeAllSchemas(this.schemas);
					this._removeAllSchemas(this.refs);
					this._cache.clear();
					return this;
				case "string": {
					const sch = getSchEnv.call(this, schemaKeyRef);
					if (typeof sch == "object") this._cache.delete(sch.schema);
					delete this.schemas[schemaKeyRef];
					delete this.refs[schemaKeyRef];
					return this;
				}
				case "object": {
					const cacheKey = schemaKeyRef;
					this._cache.delete(cacheKey);
					let id = schemaKeyRef[this.opts.schemaId];
					if (id) {
						id = (0, resolve_1.normalizeId)(id);
						delete this.schemas[id];
						delete this.refs[id];
					}
					return this;
				}
				default: throw new Error("ajv.removeSchema: invalid parameter");
			}
		}
		addVocabulary(definitions) {
			for (const def of definitions) this.addKeyword(def);
			return this;
		}
		addKeyword(kwdOrDef, def) {
			let keyword;
			if (typeof kwdOrDef == "string") {
				keyword = kwdOrDef;
				if (typeof def == "object") {
					this.logger.warn("these parameters are deprecated, see docs for addKeyword");
					def.keyword = keyword;
				}
			} else if (typeof kwdOrDef == "object" && def === void 0) {
				def = kwdOrDef;
				keyword = def.keyword;
				if (Array.isArray(keyword) && !keyword.length) throw new Error("addKeywords: keyword must be string or non-empty array");
			} else throw new Error("invalid addKeywords parameters");
			checkKeyword.call(this, keyword, def);
			if (!def) {
				(0, util_1.eachItem)(keyword, (kwd) => addRule.call(this, kwd));
				return this;
			}
			keywordMetaschema.call(this, def);
			const definition = {
				...def,
				type: (0, dataType_1.getJSONTypes)(def.type),
				schemaType: (0, dataType_1.getJSONTypes)(def.schemaType)
			};
			(0, util_1.eachItem)(keyword, definition.type.length === 0 ? (k) => addRule.call(this, k, definition) : (k) => definition.type.forEach((t) => addRule.call(this, k, definition, t)));
			return this;
		}
		getKeyword(keyword) {
			const rule = this.RULES.all[keyword];
			return typeof rule == "object" ? rule.definition : !!rule;
		}
		removeKeyword(keyword) {
			const { RULES } = this;
			delete RULES.keywords[keyword];
			delete RULES.all[keyword];
			for (const group of RULES.rules) {
				const i = group.rules.findIndex((rule) => rule.keyword === keyword);
				if (i >= 0) group.rules.splice(i, 1);
			}
			return this;
		}
		addFormat(name, format) {
			if (typeof format == "string") format = new RegExp(format);
			this.formats[name] = format;
			return this;
		}
		errorsText(errors = this.errors, { separator = ", ", dataVar = "data" } = {}) {
			if (!errors || errors.length === 0) return "No errors";
			return errors.map((e) => `${dataVar}${e.instancePath} ${e.message}`).reduce((text, msg) => text + separator + msg);
		}
		$dataMetaSchema(metaSchema, keywordsJsonPointers) {
			const rules = this.RULES.all;
			metaSchema = JSON.parse(JSON.stringify(metaSchema));
			for (const jsonPointer of keywordsJsonPointers) {
				const segments = jsonPointer.split("/").slice(1);
				let keywords = metaSchema;
				for (const seg of segments) keywords = keywords[seg];
				for (const key in rules) {
					const rule = rules[key];
					if (typeof rule != "object") continue;
					const { $data } = rule.definition;
					const schema = keywords[key];
					if ($data && schema) keywords[key] = schemaOrData(schema);
				}
			}
			return metaSchema;
		}
		_removeAllSchemas(schemas, regex) {
			for (const keyRef in schemas) {
				const sch = schemas[keyRef];
				if (!regex || regex.test(keyRef)) {
					if (typeof sch == "string") delete schemas[keyRef];
					else if (sch && !sch.meta) {
						this._cache.delete(sch.schema);
						delete schemas[keyRef];
					}
				}
			}
		}
		_addSchema(schema, meta, baseId, validateSchema = this.opts.validateSchema, addSchema = this.opts.addUsedSchema) {
			let id;
			const { schemaId } = this.opts;
			if (typeof schema == "object") id = schema[schemaId];
			else if (this.opts.jtd) throw new Error("schema must be object");
			else if (typeof schema != "boolean") throw new Error("schema must be object or boolean");
			let sch = this._cache.get(schema);
			if (sch !== void 0) return sch;
			baseId = (0, resolve_1.normalizeId)(id || baseId);
			const localRefs = resolve_1.getSchemaRefs.call(this, schema, baseId);
			sch = new compile_1.SchemaEnv({
				schema,
				schemaId,
				meta,
				baseId,
				localRefs
			});
			this._cache.set(sch.schema, sch);
			if (addSchema && !baseId.startsWith("#")) {
				if (baseId) this._checkUnique(baseId);
				this.refs[baseId] = sch;
			}
			if (validateSchema) this.validateSchema(schema, true);
			return sch;
		}
		_checkUnique(id) {
			if (this.schemas[id] || this.refs[id]) throw new Error(`schema with key or id "${id}" already exists`);
		}
		_compileSchemaEnv(sch) {
			if (sch.meta) this._compileMetaSchema(sch);
			else compile_1.compileSchema.call(this, sch);
			/* istanbul ignore if */
			if (!sch.validate) throw new Error("ajv implementation error");
			return sch.validate;
		}
		_compileMetaSchema(sch) {
			const currentOpts = this.opts;
			this.opts = this._metaOpts;
			try {
				compile_1.compileSchema.call(this, sch);
			} finally {
				this.opts = currentOpts;
			}
		}
	};
	Ajv.ValidationError = validation_error_1.default;
	Ajv.MissingRefError = ref_error_1.default;
	exports.default = Ajv;
	function checkOptions(checkOpts, options, msg, log = "error") {
		for (const key in checkOpts) {
			const opt = key;
			if (opt in options) this.logger[log](`${msg}: option ${key}. ${checkOpts[opt]}`);
		}
	}
	function getSchEnv(keyRef) {
		keyRef = (0, resolve_1.normalizeId)(keyRef);
		return this.schemas[keyRef] || this.refs[keyRef];
	}
	function addInitialSchemas() {
		const optsSchemas = this.opts.schemas;
		if (!optsSchemas) return;
		if (Array.isArray(optsSchemas)) this.addSchema(optsSchemas);
		else for (const key in optsSchemas) this.addSchema(optsSchemas[key], key);
	}
	function addInitialFormats() {
		for (const name in this.opts.formats) {
			const format = this.opts.formats[name];
			if (format) this.addFormat(name, format);
		}
	}
	function addInitialKeywords(defs) {
		if (Array.isArray(defs)) {
			this.addVocabulary(defs);
			return;
		}
		this.logger.warn("keywords option as map is deprecated, pass array");
		for (const keyword in defs) {
			const def = defs[keyword];
			if (!def.keyword) def.keyword = keyword;
			this.addKeyword(def);
		}
	}
	function getMetaSchemaOptions() {
		const metaOpts = { ...this.opts };
		for (const opt of META_IGNORE_OPTIONS) delete metaOpts[opt];
		return metaOpts;
	}
	var noLogs = {
		log() {},
		warn() {},
		error() {}
	};
	function getLogger(logger) {
		if (logger === false) return noLogs;
		if (logger === void 0) return console;
		if (logger.log && logger.warn && logger.error) return logger;
		throw new Error("logger must implement log, warn and error methods");
	}
	var KEYWORD_NAME = /^[a-z_$][a-z0-9_$:-]*$/i;
	function checkKeyword(keyword, def) {
		const { RULES } = this;
		(0, util_1.eachItem)(keyword, (kwd) => {
			if (RULES.keywords[kwd]) throw new Error(`Keyword ${kwd} is already defined`);
			if (!KEYWORD_NAME.test(kwd)) throw new Error(`Keyword ${kwd} has invalid name`);
		});
		if (!def) return;
		if (def.$data && !("code" in def || "validate" in def)) throw new Error("$data keyword must have \"code\" or \"validate\" function");
	}
	function addRule(keyword, definition, dataType) {
		var _a;
		const post = definition === null || definition === void 0 ? void 0 : definition.post;
		if (dataType && post) throw new Error("keyword with \"post\" flag cannot have \"type\"");
		const { RULES } = this;
		let ruleGroup = post ? RULES.post : RULES.rules.find(({ type: t }) => t === dataType);
		if (!ruleGroup) {
			ruleGroup = {
				type: dataType,
				rules: []
			};
			RULES.rules.push(ruleGroup);
		}
		RULES.keywords[keyword] = true;
		if (!definition) return;
		const rule = {
			keyword,
			definition: {
				...definition,
				type: (0, dataType_1.getJSONTypes)(definition.type),
				schemaType: (0, dataType_1.getJSONTypes)(definition.schemaType)
			}
		};
		if (definition.before) addBeforeRule.call(this, ruleGroup, rule, definition.before);
		else ruleGroup.rules.push(rule);
		RULES.all[keyword] = rule;
		(_a = definition.implements) === null || _a === void 0 || _a.forEach((kwd) => this.addKeyword(kwd));
	}
	function addBeforeRule(ruleGroup, rule, before) {
		const i = ruleGroup.rules.findIndex((_rule) => _rule.keyword === before);
		if (i >= 0) ruleGroup.rules.splice(i, 0, rule);
		else {
			ruleGroup.rules.push(rule);
			this.logger.warn(`rule ${before} is not defined`);
		}
	}
	function keywordMetaschema(def) {
		let { metaSchema } = def;
		if (metaSchema === void 0) return;
		if (def.$data && this.opts.$data) metaSchema = schemaOrData(metaSchema);
		def.validateSchema = this.compile(metaSchema, true);
	}
	var $dataRef = { $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#" };
	function schemaOrData(schema) {
		return { anyOf: [schema, $dataRef] };
	}
}));
//#endregion
//#region node_modules/@modelcontextprotocol/sdk/node_modules/ajv/dist/vocabularies/core/id.js
var require_id$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = {
		keyword: "id",
		code() {
			throw new Error("NOT SUPPORTED: keyword \"id\", use \"$id\" for schema ID");
		}
	};
}));
//#endregion
//#region node_modules/@modelcontextprotocol/sdk/node_modules/ajv/dist/vocabularies/core/ref.js
var require_ref$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.callRef = exports.getValidate = void 0;
	var ref_error_1 = require_ref_error$1();
	var code_1 = require_code$2();
	var codegen_1 = require_codegen$1();
	var names_1 = require_names$1();
	var compile_1 = require_compile$1();
	var util_1 = require_util$1();
	var def = {
		keyword: "$ref",
		schemaType: "string",
		code(cxt) {
			const { gen, schema: $ref, it } = cxt;
			const { baseId, schemaEnv: env, validateName, opts, self } = it;
			const { root } = env;
			if (($ref === "#" || $ref === "#/") && baseId === root.baseId) return callRootRef();
			const schOrEnv = compile_1.resolveRef.call(self, root, baseId, $ref);
			if (schOrEnv === void 0) throw new ref_error_1.default(it.opts.uriResolver, baseId, $ref);
			if (schOrEnv instanceof compile_1.SchemaEnv) return callValidate(schOrEnv);
			return inlineRefSchema(schOrEnv);
			function callRootRef() {
				if (env === root) return callRef(cxt, validateName, env, env.$async);
				const rootName = gen.scopeValue("root", { ref: root });
				return callRef(cxt, (0, codegen_1._)`${rootName}.validate`, root, root.$async);
			}
			function callValidate(sch) {
				callRef(cxt, getValidate(cxt, sch), sch, sch.$async);
			}
			function inlineRefSchema(sch) {
				const schName = gen.scopeValue("schema", opts.code.source === true ? {
					ref: sch,
					code: (0, codegen_1.stringify)(sch)
				} : { ref: sch });
				const valid = gen.name("valid");
				const schCxt = cxt.subschema({
					schema: sch,
					dataTypes: [],
					schemaPath: codegen_1.nil,
					topSchemaRef: schName,
					errSchemaPath: $ref
				}, valid);
				cxt.mergeEvaluated(schCxt);
				cxt.ok(valid);
			}
		}
	};
	function getValidate(cxt, sch) {
		const { gen } = cxt;
		return sch.validate ? gen.scopeValue("validate", { ref: sch.validate }) : (0, codegen_1._)`${gen.scopeValue("wrapper", { ref: sch })}.validate`;
	}
	exports.getValidate = getValidate;
	function callRef(cxt, v, sch, $async) {
		const { gen, it } = cxt;
		const { allErrors, schemaEnv: env, opts } = it;
		const passCxt = opts.passContext ? names_1.default.this : codegen_1.nil;
		if ($async) callAsyncRef();
		else callSyncRef();
		function callAsyncRef() {
			if (!env.$async) throw new Error("async schema referenced by sync schema");
			const valid = gen.let("valid");
			gen.try(() => {
				gen.code((0, codegen_1._)`await ${(0, code_1.callValidateCode)(cxt, v, passCxt)}`);
				addEvaluatedFrom(v);
				if (!allErrors) gen.assign(valid, true);
			}, (e) => {
				gen.if((0, codegen_1._)`!(${e} instanceof ${it.ValidationError})`, () => gen.throw(e));
				addErrorsFrom(e);
				if (!allErrors) gen.assign(valid, false);
			});
			cxt.ok(valid);
		}
		function callSyncRef() {
			cxt.result((0, code_1.callValidateCode)(cxt, v, passCxt), () => addEvaluatedFrom(v), () => addErrorsFrom(v));
		}
		function addErrorsFrom(source) {
			const errs = (0, codegen_1._)`${source}.errors`;
			gen.assign(names_1.default.vErrors, (0, codegen_1._)`${names_1.default.vErrors} === null ? ${errs} : ${names_1.default.vErrors}.concat(${errs})`);
			gen.assign(names_1.default.errors, (0, codegen_1._)`${names_1.default.vErrors}.length`);
		}
		function addEvaluatedFrom(source) {
			var _a;
			if (!it.opts.unevaluated) return;
			const schEvaluated = (_a = sch === null || sch === void 0 ? void 0 : sch.validate) === null || _a === void 0 ? void 0 : _a.evaluated;
			if (it.props !== true) if (schEvaluated && !schEvaluated.dynamicProps) {
				if (schEvaluated.props !== void 0) it.props = util_1.mergeEvaluated.props(gen, schEvaluated.props, it.props);
			} else {
				const props = gen.var("props", (0, codegen_1._)`${source}.evaluated.props`);
				it.props = util_1.mergeEvaluated.props(gen, props, it.props, codegen_1.Name);
			}
			if (it.items !== true) if (schEvaluated && !schEvaluated.dynamicItems) {
				if (schEvaluated.items !== void 0) it.items = util_1.mergeEvaluated.items(gen, schEvaluated.items, it.items);
			} else {
				const items = gen.var("items", (0, codegen_1._)`${source}.evaluated.items`);
				it.items = util_1.mergeEvaluated.items(gen, items, it.items, codegen_1.Name);
			}
		}
	}
	exports.callRef = callRef;
	exports.default = def;
}));
//#endregion
//#region node_modules/@modelcontextprotocol/sdk/node_modules/ajv/dist/vocabularies/core/index.js
var require_core$2 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var id_1 = require_id$1();
	var ref_1 = require_ref$1();
	exports.default = [
		"$schema",
		"$id",
		"$defs",
		"$vocabulary",
		{ keyword: "$comment" },
		"definitions",
		id_1.default,
		ref_1.default
	];
}));
//#endregion
//#region node_modules/@modelcontextprotocol/sdk/node_modules/ajv/dist/vocabularies/validation/limitNumber.js
var require_limitNumber$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var codegen_1 = require_codegen$1();
	var ops = codegen_1.operators;
	var KWDs = {
		maximum: {
			okStr: "<=",
			ok: ops.LTE,
			fail: ops.GT
		},
		minimum: {
			okStr: ">=",
			ok: ops.GTE,
			fail: ops.LT
		},
		exclusiveMaximum: {
			okStr: "<",
			ok: ops.LT,
			fail: ops.GTE
		},
		exclusiveMinimum: {
			okStr: ">",
			ok: ops.GT,
			fail: ops.LTE
		}
	};
	exports.default = {
		keyword: Object.keys(KWDs),
		type: "number",
		schemaType: "number",
		$data: true,
		error: {
			message: ({ keyword, schemaCode }) => (0, codegen_1.str)`must be ${KWDs[keyword].okStr} ${schemaCode}`,
			params: ({ keyword, schemaCode }) => (0, codegen_1._)`{comparison: ${KWDs[keyword].okStr}, limit: ${schemaCode}}`
		},
		code(cxt) {
			const { keyword, data, schemaCode } = cxt;
			cxt.fail$data((0, codegen_1._)`${data} ${KWDs[keyword].fail} ${schemaCode} || isNaN(${data})`);
		}
	};
}));
//#endregion
//#region node_modules/@modelcontextprotocol/sdk/node_modules/ajv/dist/vocabularies/validation/multipleOf.js
var require_multipleOf$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var codegen_1 = require_codegen$1();
	exports.default = {
		keyword: "multipleOf",
		type: "number",
		schemaType: "number",
		$data: true,
		error: {
			message: ({ schemaCode }) => (0, codegen_1.str)`must be multiple of ${schemaCode}`,
			params: ({ schemaCode }) => (0, codegen_1._)`{multipleOf: ${schemaCode}}`
		},
		code(cxt) {
			const { gen, data, schemaCode, it } = cxt;
			const prec = it.opts.multipleOfPrecision;
			const res = gen.let("res");
			const invalid = prec ? (0, codegen_1._)`Math.abs(Math.round(${res}) - ${res}) > 1e-${prec}` : (0, codegen_1._)`${res} !== parseInt(${res})`;
			cxt.fail$data((0, codegen_1._)`(${schemaCode} === 0 || (${res} = ${data}/${schemaCode}, ${invalid}))`);
		}
	};
}));
//#endregion
//#region node_modules/@modelcontextprotocol/sdk/node_modules/ajv/dist/runtime/ucs2length.js
var require_ucs2length$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	function ucs2length(str) {
		const len = str.length;
		let length = 0;
		let pos = 0;
		let value;
		while (pos < len) {
			length++;
			value = str.charCodeAt(pos++);
			if (value >= 55296 && value <= 56319 && pos < len) {
				value = str.charCodeAt(pos);
				if ((value & 64512) === 56320) pos++;
			}
		}
		return length;
	}
	exports.default = ucs2length;
	ucs2length.code = "require(\"ajv/dist/runtime/ucs2length\").default";
}));
//#endregion
//#region node_modules/@modelcontextprotocol/sdk/node_modules/ajv/dist/vocabularies/validation/limitLength.js
var require_limitLength$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var codegen_1 = require_codegen$1();
	var util_1 = require_util$1();
	var ucs2length_1 = require_ucs2length$1();
	exports.default = {
		keyword: ["maxLength", "minLength"],
		type: "string",
		schemaType: "number",
		$data: true,
		error: {
			message({ keyword, schemaCode }) {
				const comp = keyword === "maxLength" ? "more" : "fewer";
				return (0, codegen_1.str)`must NOT have ${comp} than ${schemaCode} characters`;
			},
			params: ({ schemaCode }) => (0, codegen_1._)`{limit: ${schemaCode}}`
		},
		code(cxt) {
			const { keyword, data, schemaCode, it } = cxt;
			const op = keyword === "maxLength" ? codegen_1.operators.GT : codegen_1.operators.LT;
			const len = it.opts.unicode === false ? (0, codegen_1._)`${data}.length` : (0, codegen_1._)`${(0, util_1.useFunc)(cxt.gen, ucs2length_1.default)}(${data})`;
			cxt.fail$data((0, codegen_1._)`${len} ${op} ${schemaCode}`);
		}
	};
}));
//#endregion
//#region node_modules/@modelcontextprotocol/sdk/node_modules/ajv/dist/vocabularies/validation/pattern.js
var require_pattern$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var code_1 = require_code$2();
	var util_1 = require_util$1();
	var codegen_1 = require_codegen$1();
	exports.default = {
		keyword: "pattern",
		type: "string",
		schemaType: "string",
		$data: true,
		error: {
			message: ({ schemaCode }) => (0, codegen_1.str)`must match pattern "${schemaCode}"`,
			params: ({ schemaCode }) => (0, codegen_1._)`{pattern: ${schemaCode}}`
		},
		code(cxt) {
			const { gen, data, $data, schema, schemaCode, it } = cxt;
			const u = it.opts.unicodeRegExp ? "u" : "";
			if ($data) {
				const { regExp } = it.opts.code;
				const regExpCode = regExp.code === "new RegExp" ? (0, codegen_1._)`new RegExp` : (0, util_1.useFunc)(gen, regExp);
				const valid = gen.let("valid");
				gen.try(() => gen.assign(valid, (0, codegen_1._)`${regExpCode}(${schemaCode}, ${u}).test(${data})`), () => gen.assign(valid, false));
				cxt.fail$data((0, codegen_1._)`!${valid}`);
			} else {
				const regExp = (0, code_1.usePattern)(cxt, schema);
				cxt.fail$data((0, codegen_1._)`!${regExp}.test(${data})`);
			}
		}
	};
}));
//#endregion
//#region node_modules/@modelcontextprotocol/sdk/node_modules/ajv/dist/vocabularies/validation/limitProperties.js
var require_limitProperties$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var codegen_1 = require_codegen$1();
	exports.default = {
		keyword: ["maxProperties", "minProperties"],
		type: "object",
		schemaType: "number",
		$data: true,
		error: {
			message({ keyword, schemaCode }) {
				const comp = keyword === "maxProperties" ? "more" : "fewer";
				return (0, codegen_1.str)`must NOT have ${comp} than ${schemaCode} properties`;
			},
			params: ({ schemaCode }) => (0, codegen_1._)`{limit: ${schemaCode}}`
		},
		code(cxt) {
			const { keyword, data, schemaCode } = cxt;
			const op = keyword === "maxProperties" ? codegen_1.operators.GT : codegen_1.operators.LT;
			cxt.fail$data((0, codegen_1._)`Object.keys(${data}).length ${op} ${schemaCode}`);
		}
	};
}));
//#endregion
//#region node_modules/@modelcontextprotocol/sdk/node_modules/ajv/dist/vocabularies/validation/required.js
var require_required$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var code_1 = require_code$2();
	var codegen_1 = require_codegen$1();
	var util_1 = require_util$1();
	exports.default = {
		keyword: "required",
		type: "object",
		schemaType: "array",
		$data: true,
		error: {
			message: ({ params: { missingProperty } }) => (0, codegen_1.str)`must have required property '${missingProperty}'`,
			params: ({ params: { missingProperty } }) => (0, codegen_1._)`{missingProperty: ${missingProperty}}`
		},
		code(cxt) {
			const { gen, schema, schemaCode, data, $data, it } = cxt;
			const { opts } = it;
			if (!$data && schema.length === 0) return;
			const useLoop = schema.length >= opts.loopRequired;
			if (it.allErrors) allErrorsMode();
			else exitOnErrorMode();
			if (opts.strictRequired) {
				const props = cxt.parentSchema.properties;
				const { definedProperties } = cxt.it;
				for (const requiredKey of schema) if ((props === null || props === void 0 ? void 0 : props[requiredKey]) === void 0 && !definedProperties.has(requiredKey)) {
					const msg = `required property "${requiredKey}" is not defined at "${it.schemaEnv.baseId + it.errSchemaPath}" (strictRequired)`;
					(0, util_1.checkStrictMode)(it, msg, it.opts.strictRequired);
				}
			}
			function allErrorsMode() {
				if (useLoop || $data) cxt.block$data(codegen_1.nil, loopAllRequired);
				else for (const prop of schema) (0, code_1.checkReportMissingProp)(cxt, prop);
			}
			function exitOnErrorMode() {
				const missing = gen.let("missing");
				if (useLoop || $data) {
					const valid = gen.let("valid", true);
					cxt.block$data(valid, () => loopUntilMissing(missing, valid));
					cxt.ok(valid);
				} else {
					gen.if((0, code_1.checkMissingProp)(cxt, schema, missing));
					(0, code_1.reportMissingProp)(cxt, missing);
					gen.else();
				}
			}
			function loopAllRequired() {
				gen.forOf("prop", schemaCode, (prop) => {
					cxt.setParams({ missingProperty: prop });
					gen.if((0, code_1.noPropertyInData)(gen, data, prop, opts.ownProperties), () => cxt.error());
				});
			}
			function loopUntilMissing(missing, valid) {
				cxt.setParams({ missingProperty: missing });
				gen.forOf(missing, schemaCode, () => {
					gen.assign(valid, (0, code_1.propertyInData)(gen, data, missing, opts.ownProperties));
					gen.if((0, codegen_1.not)(valid), () => {
						cxt.error();
						gen.break();
					});
				}, codegen_1.nil);
			}
		}
	};
}));
//#endregion
//#region node_modules/@modelcontextprotocol/sdk/node_modules/ajv/dist/vocabularies/validation/limitItems.js
var require_limitItems$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var codegen_1 = require_codegen$1();
	exports.default = {
		keyword: ["maxItems", "minItems"],
		type: "array",
		schemaType: "number",
		$data: true,
		error: {
			message({ keyword, schemaCode }) {
				const comp = keyword === "maxItems" ? "more" : "fewer";
				return (0, codegen_1.str)`must NOT have ${comp} than ${schemaCode} items`;
			},
			params: ({ schemaCode }) => (0, codegen_1._)`{limit: ${schemaCode}}`
		},
		code(cxt) {
			const { keyword, data, schemaCode } = cxt;
			const op = keyword === "maxItems" ? codegen_1.operators.GT : codegen_1.operators.LT;
			cxt.fail$data((0, codegen_1._)`${data}.length ${op} ${schemaCode}`);
		}
	};
}));
//#endregion
//#region node_modules/@modelcontextprotocol/sdk/node_modules/ajv/dist/runtime/equal.js
var require_equal$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var equal = require_fast_deep_equal();
	equal.code = "require(\"ajv/dist/runtime/equal\").default";
	exports.default = equal;
}));
//#endregion
//#region node_modules/@modelcontextprotocol/sdk/node_modules/ajv/dist/vocabularies/validation/uniqueItems.js
var require_uniqueItems$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var dataType_1 = require_dataType$1();
	var codegen_1 = require_codegen$1();
	var util_1 = require_util$1();
	var equal_1 = require_equal$1();
	exports.default = {
		keyword: "uniqueItems",
		type: "array",
		schemaType: "boolean",
		$data: true,
		error: {
			message: ({ params: { i, j } }) => (0, codegen_1.str)`must NOT have duplicate items (items ## ${j} and ${i} are identical)`,
			params: ({ params: { i, j } }) => (0, codegen_1._)`{i: ${i}, j: ${j}}`
		},
		code(cxt) {
			const { gen, data, $data, schema, parentSchema, schemaCode, it } = cxt;
			if (!$data && !schema) return;
			const valid = gen.let("valid");
			const itemTypes = parentSchema.items ? (0, dataType_1.getSchemaTypes)(parentSchema.items) : [];
			cxt.block$data(valid, validateUniqueItems, (0, codegen_1._)`${schemaCode} === false`);
			cxt.ok(valid);
			function validateUniqueItems() {
				const i = gen.let("i", (0, codegen_1._)`${data}.length`);
				const j = gen.let("j");
				cxt.setParams({
					i,
					j
				});
				gen.assign(valid, true);
				gen.if((0, codegen_1._)`${i} > 1`, () => (canOptimize() ? loopN : loopN2)(i, j));
			}
			function canOptimize() {
				return itemTypes.length > 0 && !itemTypes.some((t) => t === "object" || t === "array");
			}
			function loopN(i, j) {
				const item = gen.name("item");
				const wrongType = (0, dataType_1.checkDataTypes)(itemTypes, item, it.opts.strictNumbers, dataType_1.DataType.Wrong);
				const indices = gen.const("indices", (0, codegen_1._)`{}`);
				gen.for((0, codegen_1._)`;${i}--;`, () => {
					gen.let(item, (0, codegen_1._)`${data}[${i}]`);
					gen.if(wrongType, (0, codegen_1._)`continue`);
					if (itemTypes.length > 1) gen.if((0, codegen_1._)`typeof ${item} == "string"`, (0, codegen_1._)`${item} += "_"`);
					gen.if((0, codegen_1._)`typeof ${indices}[${item}] == "number"`, () => {
						gen.assign(j, (0, codegen_1._)`${indices}[${item}]`);
						cxt.error();
						gen.assign(valid, false).break();
					}).code((0, codegen_1._)`${indices}[${item}] = ${i}`);
				});
			}
			function loopN2(i, j) {
				const eql = (0, util_1.useFunc)(gen, equal_1.default);
				const outer = gen.name("outer");
				gen.label(outer).for((0, codegen_1._)`;${i}--;`, () => gen.for((0, codegen_1._)`${j} = ${i}; ${j}--;`, () => gen.if((0, codegen_1._)`${eql}(${data}[${i}], ${data}[${j}])`, () => {
					cxt.error();
					gen.assign(valid, false).break(outer);
				})));
			}
		}
	};
}));
//#endregion
//#region node_modules/@modelcontextprotocol/sdk/node_modules/ajv/dist/vocabularies/validation/const.js
var require_const$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var codegen_1 = require_codegen$1();
	var util_1 = require_util$1();
	var equal_1 = require_equal$1();
	exports.default = {
		keyword: "const",
		$data: true,
		error: {
			message: "must be equal to constant",
			params: ({ schemaCode }) => (0, codegen_1._)`{allowedValue: ${schemaCode}}`
		},
		code(cxt) {
			const { gen, data, $data, schemaCode, schema } = cxt;
			if ($data || schema && typeof schema == "object") cxt.fail$data((0, codegen_1._)`!${(0, util_1.useFunc)(gen, equal_1.default)}(${data}, ${schemaCode})`);
			else cxt.fail((0, codegen_1._)`${schema} !== ${data}`);
		}
	};
}));
//#endregion
//#region node_modules/@modelcontextprotocol/sdk/node_modules/ajv/dist/vocabularies/validation/enum.js
var require_enum$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var codegen_1 = require_codegen$1();
	var util_1 = require_util$1();
	var equal_1 = require_equal$1();
	exports.default = {
		keyword: "enum",
		schemaType: "array",
		$data: true,
		error: {
			message: "must be equal to one of the allowed values",
			params: ({ schemaCode }) => (0, codegen_1._)`{allowedValues: ${schemaCode}}`
		},
		code(cxt) {
			const { gen, data, $data, schema, schemaCode, it } = cxt;
			if (!$data && schema.length === 0) throw new Error("enum must have non-empty array");
			const useLoop = schema.length >= it.opts.loopEnum;
			let eql;
			const getEql = () => eql !== null && eql !== void 0 ? eql : eql = (0, util_1.useFunc)(gen, equal_1.default);
			let valid;
			if (useLoop || $data) {
				valid = gen.let("valid");
				cxt.block$data(valid, loopEnum);
			} else {
				/* istanbul ignore if */
				if (!Array.isArray(schema)) throw new Error("ajv implementation error");
				const vSchema = gen.const("vSchema", schemaCode);
				valid = (0, codegen_1.or)(...schema.map((_x, i) => equalCode(vSchema, i)));
			}
			cxt.pass(valid);
			function loopEnum() {
				gen.assign(valid, false);
				gen.forOf("v", schemaCode, (v) => gen.if((0, codegen_1._)`${getEql()}(${data}, ${v})`, () => gen.assign(valid, true).break()));
			}
			function equalCode(vSchema, i) {
				const sch = schema[i];
				return typeof sch === "object" && sch !== null ? (0, codegen_1._)`${getEql()}(${data}, ${vSchema}[${i}])` : (0, codegen_1._)`${data} === ${sch}`;
			}
		}
	};
}));
//#endregion
//#region node_modules/@modelcontextprotocol/sdk/node_modules/ajv/dist/vocabularies/validation/index.js
var require_validation$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var limitNumber_1 = require_limitNumber$1();
	var multipleOf_1 = require_multipleOf$1();
	var limitLength_1 = require_limitLength$1();
	var pattern_1 = require_pattern$1();
	var limitProperties_1 = require_limitProperties$1();
	var required_1 = require_required$1();
	var limitItems_1 = require_limitItems$1();
	var uniqueItems_1 = require_uniqueItems$1();
	var const_1 = require_const$1();
	var enum_1 = require_enum$1();
	exports.default = [
		limitNumber_1.default,
		multipleOf_1.default,
		limitLength_1.default,
		pattern_1.default,
		limitProperties_1.default,
		required_1.default,
		limitItems_1.default,
		uniqueItems_1.default,
		{
			keyword: "type",
			schemaType: ["string", "array"]
		},
		{
			keyword: "nullable",
			schemaType: "boolean"
		},
		const_1.default,
		enum_1.default
	];
}));
//#endregion
//#region node_modules/@modelcontextprotocol/sdk/node_modules/ajv/dist/vocabularies/applicator/additionalItems.js
var require_additionalItems$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.validateAdditionalItems = void 0;
	var codegen_1 = require_codegen$1();
	var util_1 = require_util$1();
	var def = {
		keyword: "additionalItems",
		type: "array",
		schemaType: ["boolean", "object"],
		before: "uniqueItems",
		error: {
			message: ({ params: { len } }) => (0, codegen_1.str)`must NOT have more than ${len} items`,
			params: ({ params: { len } }) => (0, codegen_1._)`{limit: ${len}}`
		},
		code(cxt) {
			const { parentSchema, it } = cxt;
			const { items } = parentSchema;
			if (!Array.isArray(items)) {
				(0, util_1.checkStrictMode)(it, "\"additionalItems\" is ignored when \"items\" is not an array of schemas");
				return;
			}
			validateAdditionalItems(cxt, items);
		}
	};
	function validateAdditionalItems(cxt, items) {
		const { gen, schema, data, keyword, it } = cxt;
		it.items = true;
		const len = gen.const("len", (0, codegen_1._)`${data}.length`);
		if (schema === false) {
			cxt.setParams({ len: items.length });
			cxt.pass((0, codegen_1._)`${len} <= ${items.length}`);
		} else if (typeof schema == "object" && !(0, util_1.alwaysValidSchema)(it, schema)) {
			const valid = gen.var("valid", (0, codegen_1._)`${len} <= ${items.length}`);
			gen.if((0, codegen_1.not)(valid), () => validateItems(valid));
			cxt.ok(valid);
		}
		function validateItems(valid) {
			gen.forRange("i", items.length, len, (i) => {
				cxt.subschema({
					keyword,
					dataProp: i,
					dataPropType: util_1.Type.Num
				}, valid);
				if (!it.allErrors) gen.if((0, codegen_1.not)(valid), () => gen.break());
			});
		}
	}
	exports.validateAdditionalItems = validateAdditionalItems;
	exports.default = def;
}));
//#endregion
//#region node_modules/@modelcontextprotocol/sdk/node_modules/ajv/dist/vocabularies/applicator/items.js
var require_items$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.validateTuple = void 0;
	var codegen_1 = require_codegen$1();
	var util_1 = require_util$1();
	var code_1 = require_code$2();
	var def = {
		keyword: "items",
		type: "array",
		schemaType: [
			"object",
			"array",
			"boolean"
		],
		before: "uniqueItems",
		code(cxt) {
			const { schema, it } = cxt;
			if (Array.isArray(schema)) return validateTuple(cxt, "additionalItems", schema);
			it.items = true;
			if ((0, util_1.alwaysValidSchema)(it, schema)) return;
			cxt.ok((0, code_1.validateArray)(cxt));
		}
	};
	function validateTuple(cxt, extraItems, schArr = cxt.schema) {
		const { gen, parentSchema, data, keyword, it } = cxt;
		checkStrictTuple(parentSchema);
		if (it.opts.unevaluated && schArr.length && it.items !== true) it.items = util_1.mergeEvaluated.items(gen, schArr.length, it.items);
		const valid = gen.name("valid");
		const len = gen.const("len", (0, codegen_1._)`${data}.length`);
		schArr.forEach((sch, i) => {
			if ((0, util_1.alwaysValidSchema)(it, sch)) return;
			gen.if((0, codegen_1._)`${len} > ${i}`, () => cxt.subschema({
				keyword,
				schemaProp: i,
				dataProp: i
			}, valid));
			cxt.ok(valid);
		});
		function checkStrictTuple(sch) {
			const { opts, errSchemaPath } = it;
			const l = schArr.length;
			const fullTuple = l === sch.minItems && (l === sch.maxItems || sch[extraItems] === false);
			if (opts.strictTuples && !fullTuple) {
				const msg = `"${keyword}" is ${l}-tuple, but minItems or maxItems/${extraItems} are not specified or different at path "${errSchemaPath}"`;
				(0, util_1.checkStrictMode)(it, msg, opts.strictTuples);
			}
		}
	}
	exports.validateTuple = validateTuple;
	exports.default = def;
}));
//#endregion
//#region node_modules/@modelcontextprotocol/sdk/node_modules/ajv/dist/vocabularies/applicator/prefixItems.js
var require_prefixItems$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var items_1 = require_items$1();
	exports.default = {
		keyword: "prefixItems",
		type: "array",
		schemaType: ["array"],
		before: "uniqueItems",
		code: (cxt) => (0, items_1.validateTuple)(cxt, "items")
	};
}));
//#endregion
//#region node_modules/@modelcontextprotocol/sdk/node_modules/ajv/dist/vocabularies/applicator/items2020.js
var require_items2020$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var codegen_1 = require_codegen$1();
	var util_1 = require_util$1();
	var code_1 = require_code$2();
	var additionalItems_1 = require_additionalItems$1();
	exports.default = {
		keyword: "items",
		type: "array",
		schemaType: ["object", "boolean"],
		before: "uniqueItems",
		error: {
			message: ({ params: { len } }) => (0, codegen_1.str)`must NOT have more than ${len} items`,
			params: ({ params: { len } }) => (0, codegen_1._)`{limit: ${len}}`
		},
		code(cxt) {
			const { schema, parentSchema, it } = cxt;
			const { prefixItems } = parentSchema;
			it.items = true;
			if ((0, util_1.alwaysValidSchema)(it, schema)) return;
			if (prefixItems) (0, additionalItems_1.validateAdditionalItems)(cxt, prefixItems);
			else cxt.ok((0, code_1.validateArray)(cxt));
		}
	};
}));
//#endregion
//#region node_modules/@modelcontextprotocol/sdk/node_modules/ajv/dist/vocabularies/applicator/contains.js
var require_contains$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var codegen_1 = require_codegen$1();
	var util_1 = require_util$1();
	exports.default = {
		keyword: "contains",
		type: "array",
		schemaType: ["object", "boolean"],
		before: "uniqueItems",
		trackErrors: true,
		error: {
			message: ({ params: { min, max } }) => max === void 0 ? (0, codegen_1.str)`must contain at least ${min} valid item(s)` : (0, codegen_1.str)`must contain at least ${min} and no more than ${max} valid item(s)`,
			params: ({ params: { min, max } }) => max === void 0 ? (0, codegen_1._)`{minContains: ${min}}` : (0, codegen_1._)`{minContains: ${min}, maxContains: ${max}}`
		},
		code(cxt) {
			const { gen, schema, parentSchema, data, it } = cxt;
			let min;
			let max;
			const { minContains, maxContains } = parentSchema;
			if (it.opts.next) {
				min = minContains === void 0 ? 1 : minContains;
				max = maxContains;
			} else min = 1;
			const len = gen.const("len", (0, codegen_1._)`${data}.length`);
			cxt.setParams({
				min,
				max
			});
			if (max === void 0 && min === 0) {
				(0, util_1.checkStrictMode)(it, `"minContains" == 0 without "maxContains": "contains" keyword ignored`);
				return;
			}
			if (max !== void 0 && min > max) {
				(0, util_1.checkStrictMode)(it, `"minContains" > "maxContains" is always invalid`);
				cxt.fail();
				return;
			}
			if ((0, util_1.alwaysValidSchema)(it, schema)) {
				let cond = (0, codegen_1._)`${len} >= ${min}`;
				if (max !== void 0) cond = (0, codegen_1._)`${cond} && ${len} <= ${max}`;
				cxt.pass(cond);
				return;
			}
			it.items = true;
			const valid = gen.name("valid");
			if (max === void 0 && min === 1) validateItems(valid, () => gen.if(valid, () => gen.break()));
			else if (min === 0) {
				gen.let(valid, true);
				if (max !== void 0) gen.if((0, codegen_1._)`${data}.length > 0`, validateItemsWithCount);
			} else {
				gen.let(valid, false);
				validateItemsWithCount();
			}
			cxt.result(valid, () => cxt.reset());
			function validateItemsWithCount() {
				const schValid = gen.name("_valid");
				const count = gen.let("count", 0);
				validateItems(schValid, () => gen.if(schValid, () => checkLimits(count)));
			}
			function validateItems(_valid, block) {
				gen.forRange("i", 0, len, (i) => {
					cxt.subschema({
						keyword: "contains",
						dataProp: i,
						dataPropType: util_1.Type.Num,
						compositeRule: true
					}, _valid);
					block();
				});
			}
			function checkLimits(count) {
				gen.code((0, codegen_1._)`${count}++`);
				if (max === void 0) gen.if((0, codegen_1._)`${count} >= ${min}`, () => gen.assign(valid, true).break());
				else {
					gen.if((0, codegen_1._)`${count} > ${max}`, () => gen.assign(valid, false).break());
					if (min === 1) gen.assign(valid, true);
					else gen.if((0, codegen_1._)`${count} >= ${min}`, () => gen.assign(valid, true));
				}
			}
		}
	};
}));
//#endregion
//#region node_modules/@modelcontextprotocol/sdk/node_modules/ajv/dist/vocabularies/applicator/dependencies.js
var require_dependencies$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.validateSchemaDeps = exports.validatePropertyDeps = exports.error = void 0;
	var codegen_1 = require_codegen$1();
	var util_1 = require_util$1();
	var code_1 = require_code$2();
	exports.error = {
		message: ({ params: { property, depsCount, deps } }) => {
			const property_ies = depsCount === 1 ? "property" : "properties";
			return (0, codegen_1.str)`must have ${property_ies} ${deps} when property ${property} is present`;
		},
		params: ({ params: { property, depsCount, deps, missingProperty } }) => (0, codegen_1._)`{property: ${property},
    missingProperty: ${missingProperty},
    depsCount: ${depsCount},
    deps: ${deps}}`
	};
	var def = {
		keyword: "dependencies",
		type: "object",
		schemaType: "object",
		error: exports.error,
		code(cxt) {
			const [propDeps, schDeps] = splitDependencies(cxt);
			validatePropertyDeps(cxt, propDeps);
			validateSchemaDeps(cxt, schDeps);
		}
	};
	function splitDependencies({ schema }) {
		const propertyDeps = {};
		const schemaDeps = {};
		for (const key in schema) {
			if (key === "__proto__") continue;
			const deps = Array.isArray(schema[key]) ? propertyDeps : schemaDeps;
			deps[key] = schema[key];
		}
		return [propertyDeps, schemaDeps];
	}
	function validatePropertyDeps(cxt, propertyDeps = cxt.schema) {
		const { gen, data, it } = cxt;
		if (Object.keys(propertyDeps).length === 0) return;
		const missing = gen.let("missing");
		for (const prop in propertyDeps) {
			const deps = propertyDeps[prop];
			if (deps.length === 0) continue;
			const hasProperty = (0, code_1.propertyInData)(gen, data, prop, it.opts.ownProperties);
			cxt.setParams({
				property: prop,
				depsCount: deps.length,
				deps: deps.join(", ")
			});
			if (it.allErrors) gen.if(hasProperty, () => {
				for (const depProp of deps) (0, code_1.checkReportMissingProp)(cxt, depProp);
			});
			else {
				gen.if((0, codegen_1._)`${hasProperty} && (${(0, code_1.checkMissingProp)(cxt, deps, missing)})`);
				(0, code_1.reportMissingProp)(cxt, missing);
				gen.else();
			}
		}
	}
	exports.validatePropertyDeps = validatePropertyDeps;
	function validateSchemaDeps(cxt, schemaDeps = cxt.schema) {
		const { gen, data, keyword, it } = cxt;
		const valid = gen.name("valid");
		for (const prop in schemaDeps) {
			if ((0, util_1.alwaysValidSchema)(it, schemaDeps[prop])) continue;
			gen.if((0, code_1.propertyInData)(gen, data, prop, it.opts.ownProperties), () => {
				const schCxt = cxt.subschema({
					keyword,
					schemaProp: prop
				}, valid);
				cxt.mergeValidEvaluated(schCxt, valid);
			}, () => gen.var(valid, true));
			cxt.ok(valid);
		}
	}
	exports.validateSchemaDeps = validateSchemaDeps;
	exports.default = def;
}));
//#endregion
//#region node_modules/@modelcontextprotocol/sdk/node_modules/ajv/dist/vocabularies/applicator/propertyNames.js
var require_propertyNames$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var codegen_1 = require_codegen$1();
	var util_1 = require_util$1();
	exports.default = {
		keyword: "propertyNames",
		type: "object",
		schemaType: ["object", "boolean"],
		error: {
			message: "property name must be valid",
			params: ({ params }) => (0, codegen_1._)`{propertyName: ${params.propertyName}}`
		},
		code(cxt) {
			const { gen, schema, data, it } = cxt;
			if ((0, util_1.alwaysValidSchema)(it, schema)) return;
			const valid = gen.name("valid");
			gen.forIn("key", data, (key) => {
				cxt.setParams({ propertyName: key });
				cxt.subschema({
					keyword: "propertyNames",
					data: key,
					dataTypes: ["string"],
					propertyName: key,
					compositeRule: true
				}, valid);
				gen.if((0, codegen_1.not)(valid), () => {
					cxt.error(true);
					if (!it.allErrors) gen.break();
				});
			});
			cxt.ok(valid);
		}
	};
}));
//#endregion
//#region node_modules/@modelcontextprotocol/sdk/node_modules/ajv/dist/vocabularies/applicator/additionalProperties.js
var require_additionalProperties$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var code_1 = require_code$2();
	var codegen_1 = require_codegen$1();
	var names_1 = require_names$1();
	var util_1 = require_util$1();
	exports.default = {
		keyword: "additionalProperties",
		type: ["object"],
		schemaType: ["boolean", "object"],
		allowUndefined: true,
		trackErrors: true,
		error: {
			message: "must NOT have additional properties",
			params: ({ params }) => (0, codegen_1._)`{additionalProperty: ${params.additionalProperty}}`
		},
		code(cxt) {
			const { gen, schema, parentSchema, data, errsCount, it } = cxt;
			/* istanbul ignore if */
			if (!errsCount) throw new Error("ajv implementation error");
			const { allErrors, opts } = it;
			it.props = true;
			if (opts.removeAdditional !== "all" && (0, util_1.alwaysValidSchema)(it, schema)) return;
			const props = (0, code_1.allSchemaProperties)(parentSchema.properties);
			const patProps = (0, code_1.allSchemaProperties)(parentSchema.patternProperties);
			checkAdditionalProperties();
			cxt.ok((0, codegen_1._)`${errsCount} === ${names_1.default.errors}`);
			function checkAdditionalProperties() {
				gen.forIn("key", data, (key) => {
					if (!props.length && !patProps.length) additionalPropertyCode(key);
					else gen.if(isAdditional(key), () => additionalPropertyCode(key));
				});
			}
			function isAdditional(key) {
				let definedProp;
				if (props.length > 8) {
					const propsSchema = (0, util_1.schemaRefOrVal)(it, parentSchema.properties, "properties");
					definedProp = (0, code_1.isOwnProperty)(gen, propsSchema, key);
				} else if (props.length) definedProp = (0, codegen_1.or)(...props.map((p) => (0, codegen_1._)`${key} === ${p}`));
				else definedProp = codegen_1.nil;
				if (patProps.length) definedProp = (0, codegen_1.or)(definedProp, ...patProps.map((p) => (0, codegen_1._)`${(0, code_1.usePattern)(cxt, p)}.test(${key})`));
				return (0, codegen_1.not)(definedProp);
			}
			function deleteAdditional(key) {
				gen.code((0, codegen_1._)`delete ${data}[${key}]`);
			}
			function additionalPropertyCode(key) {
				if (opts.removeAdditional === "all" || opts.removeAdditional && schema === false) {
					deleteAdditional(key);
					return;
				}
				if (schema === false) {
					cxt.setParams({ additionalProperty: key });
					cxt.error();
					if (!allErrors) gen.break();
					return;
				}
				if (typeof schema == "object" && !(0, util_1.alwaysValidSchema)(it, schema)) {
					const valid = gen.name("valid");
					if (opts.removeAdditional === "failing") {
						applyAdditionalSchema(key, valid, false);
						gen.if((0, codegen_1.not)(valid), () => {
							cxt.reset();
							deleteAdditional(key);
						});
					} else {
						applyAdditionalSchema(key, valid);
						if (!allErrors) gen.if((0, codegen_1.not)(valid), () => gen.break());
					}
				}
			}
			function applyAdditionalSchema(key, valid, errors) {
				const subschema = {
					keyword: "additionalProperties",
					dataProp: key,
					dataPropType: util_1.Type.Str
				};
				if (errors === false) Object.assign(subschema, {
					compositeRule: true,
					createErrors: false,
					allErrors: false
				});
				cxt.subschema(subschema, valid);
			}
		}
	};
}));
//#endregion
//#region node_modules/@modelcontextprotocol/sdk/node_modules/ajv/dist/vocabularies/applicator/properties.js
var require_properties$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var validate_1 = require_validate$1();
	var code_1 = require_code$2();
	var util_1 = require_util$1();
	var additionalProperties_1 = require_additionalProperties$1();
	exports.default = {
		keyword: "properties",
		type: "object",
		schemaType: "object",
		code(cxt) {
			const { gen, schema, parentSchema, data, it } = cxt;
			if (it.opts.removeAdditional === "all" && parentSchema.additionalProperties === void 0) additionalProperties_1.default.code(new validate_1.KeywordCxt(it, additionalProperties_1.default, "additionalProperties"));
			const allProps = (0, code_1.allSchemaProperties)(schema);
			for (const prop of allProps) it.definedProperties.add(prop);
			if (it.opts.unevaluated && allProps.length && it.props !== true) it.props = util_1.mergeEvaluated.props(gen, (0, util_1.toHash)(allProps), it.props);
			const properties = allProps.filter((p) => !(0, util_1.alwaysValidSchema)(it, schema[p]));
			if (properties.length === 0) return;
			const valid = gen.name("valid");
			for (const prop of properties) {
				if (hasDefault(prop)) applyPropertySchema(prop);
				else {
					gen.if((0, code_1.propertyInData)(gen, data, prop, it.opts.ownProperties));
					applyPropertySchema(prop);
					if (!it.allErrors) gen.else().var(valid, true);
					gen.endIf();
				}
				cxt.it.definedProperties.add(prop);
				cxt.ok(valid);
			}
			function hasDefault(prop) {
				return it.opts.useDefaults && !it.compositeRule && schema[prop].default !== void 0;
			}
			function applyPropertySchema(prop) {
				cxt.subschema({
					keyword: "properties",
					schemaProp: prop,
					dataProp: prop
				}, valid);
			}
		}
	};
}));
//#endregion
//#region node_modules/@modelcontextprotocol/sdk/node_modules/ajv/dist/vocabularies/applicator/patternProperties.js
var require_patternProperties$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var code_1 = require_code$2();
	var codegen_1 = require_codegen$1();
	var util_1 = require_util$1();
	var util_2 = require_util$1();
	exports.default = {
		keyword: "patternProperties",
		type: "object",
		schemaType: "object",
		code(cxt) {
			const { gen, schema, data, parentSchema, it } = cxt;
			const { opts } = it;
			const patterns = (0, code_1.allSchemaProperties)(schema);
			const alwaysValidPatterns = patterns.filter((p) => (0, util_1.alwaysValidSchema)(it, schema[p]));
			if (patterns.length === 0 || alwaysValidPatterns.length === patterns.length && (!it.opts.unevaluated || it.props === true)) return;
			const checkProperties = opts.strictSchema && !opts.allowMatchingProperties && parentSchema.properties;
			const valid = gen.name("valid");
			if (it.props !== true && !(it.props instanceof codegen_1.Name)) it.props = (0, util_2.evaluatedPropsToName)(gen, it.props);
			const { props } = it;
			validatePatternProperties();
			function validatePatternProperties() {
				for (const pat of patterns) {
					if (checkProperties) checkMatchingProperties(pat);
					if (it.allErrors) validateProperties(pat);
					else {
						gen.var(valid, true);
						validateProperties(pat);
						gen.if(valid);
					}
				}
			}
			function checkMatchingProperties(pat) {
				for (const prop in checkProperties) if (new RegExp(pat).test(prop)) (0, util_1.checkStrictMode)(it, `property ${prop} matches pattern ${pat} (use allowMatchingProperties)`);
			}
			function validateProperties(pat) {
				gen.forIn("key", data, (key) => {
					gen.if((0, codegen_1._)`${(0, code_1.usePattern)(cxt, pat)}.test(${key})`, () => {
						const alwaysValid = alwaysValidPatterns.includes(pat);
						if (!alwaysValid) cxt.subschema({
							keyword: "patternProperties",
							schemaProp: pat,
							dataProp: key,
							dataPropType: util_2.Type.Str
						}, valid);
						if (it.opts.unevaluated && props !== true) gen.assign((0, codegen_1._)`${props}[${key}]`, true);
						else if (!alwaysValid && !it.allErrors) gen.if((0, codegen_1.not)(valid), () => gen.break());
					});
				});
			}
		}
	};
}));
//#endregion
//#region node_modules/@modelcontextprotocol/sdk/node_modules/ajv/dist/vocabularies/applicator/not.js
var require_not$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var util_1 = require_util$1();
	exports.default = {
		keyword: "not",
		schemaType: ["object", "boolean"],
		trackErrors: true,
		code(cxt) {
			const { gen, schema, it } = cxt;
			if ((0, util_1.alwaysValidSchema)(it, schema)) {
				cxt.fail();
				return;
			}
			const valid = gen.name("valid");
			cxt.subschema({
				keyword: "not",
				compositeRule: true,
				createErrors: false,
				allErrors: false
			}, valid);
			cxt.failResult(valid, () => cxt.reset(), () => cxt.error());
		},
		error: { message: "must NOT be valid" }
	};
}));
//#endregion
//#region node_modules/@modelcontextprotocol/sdk/node_modules/ajv/dist/vocabularies/applicator/anyOf.js
var require_anyOf$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = {
		keyword: "anyOf",
		schemaType: "array",
		trackErrors: true,
		code: require_code$2().validateUnion,
		error: { message: "must match a schema in anyOf" }
	};
}));
//#endregion
//#region node_modules/@modelcontextprotocol/sdk/node_modules/ajv/dist/vocabularies/applicator/oneOf.js
var require_oneOf$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var codegen_1 = require_codegen$1();
	var util_1 = require_util$1();
	exports.default = {
		keyword: "oneOf",
		schemaType: "array",
		trackErrors: true,
		error: {
			message: "must match exactly one schema in oneOf",
			params: ({ params }) => (0, codegen_1._)`{passingSchemas: ${params.passing}}`
		},
		code(cxt) {
			const { gen, schema, parentSchema, it } = cxt;
			/* istanbul ignore if */
			if (!Array.isArray(schema)) throw new Error("ajv implementation error");
			if (it.opts.discriminator && parentSchema.discriminator) return;
			const schArr = schema;
			const valid = gen.let("valid", false);
			const passing = gen.let("passing", null);
			const schValid = gen.name("_valid");
			cxt.setParams({ passing });
			gen.block(validateOneOf);
			cxt.result(valid, () => cxt.reset(), () => cxt.error(true));
			function validateOneOf() {
				schArr.forEach((sch, i) => {
					let schCxt;
					if ((0, util_1.alwaysValidSchema)(it, sch)) gen.var(schValid, true);
					else schCxt = cxt.subschema({
						keyword: "oneOf",
						schemaProp: i,
						compositeRule: true
					}, schValid);
					if (i > 0) gen.if((0, codegen_1._)`${schValid} && ${valid}`).assign(valid, false).assign(passing, (0, codegen_1._)`[${passing}, ${i}]`).else();
					gen.if(schValid, () => {
						gen.assign(valid, true);
						gen.assign(passing, i);
						if (schCxt) cxt.mergeEvaluated(schCxt, codegen_1.Name);
					});
				});
			}
		}
	};
}));
//#endregion
//#region node_modules/@modelcontextprotocol/sdk/node_modules/ajv/dist/vocabularies/applicator/allOf.js
var require_allOf$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var util_1 = require_util$1();
	exports.default = {
		keyword: "allOf",
		schemaType: "array",
		code(cxt) {
			const { gen, schema, it } = cxt;
			/* istanbul ignore if */
			if (!Array.isArray(schema)) throw new Error("ajv implementation error");
			const valid = gen.name("valid");
			schema.forEach((sch, i) => {
				if ((0, util_1.alwaysValidSchema)(it, sch)) return;
				const schCxt = cxt.subschema({
					keyword: "allOf",
					schemaProp: i
				}, valid);
				cxt.ok(valid);
				cxt.mergeEvaluated(schCxt);
			});
		}
	};
}));
//#endregion
//#region node_modules/@modelcontextprotocol/sdk/node_modules/ajv/dist/vocabularies/applicator/if.js
var require_if$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var codegen_1 = require_codegen$1();
	var util_1 = require_util$1();
	var def = {
		keyword: "if",
		schemaType: ["object", "boolean"],
		trackErrors: true,
		error: {
			message: ({ params }) => (0, codegen_1.str)`must match "${params.ifClause}" schema`,
			params: ({ params }) => (0, codegen_1._)`{failingKeyword: ${params.ifClause}}`
		},
		code(cxt) {
			const { gen, parentSchema, it } = cxt;
			if (parentSchema.then === void 0 && parentSchema.else === void 0) (0, util_1.checkStrictMode)(it, "\"if\" without \"then\" and \"else\" is ignored");
			const hasThen = hasSchema(it, "then");
			const hasElse = hasSchema(it, "else");
			if (!hasThen && !hasElse) return;
			const valid = gen.let("valid", true);
			const schValid = gen.name("_valid");
			validateIf();
			cxt.reset();
			if (hasThen && hasElse) {
				const ifClause = gen.let("ifClause");
				cxt.setParams({ ifClause });
				gen.if(schValid, validateClause("then", ifClause), validateClause("else", ifClause));
			} else if (hasThen) gen.if(schValid, validateClause("then"));
			else gen.if((0, codegen_1.not)(schValid), validateClause("else"));
			cxt.pass(valid, () => cxt.error(true));
			function validateIf() {
				const schCxt = cxt.subschema({
					keyword: "if",
					compositeRule: true,
					createErrors: false,
					allErrors: false
				}, schValid);
				cxt.mergeEvaluated(schCxt);
			}
			function validateClause(keyword, ifClause) {
				return () => {
					const schCxt = cxt.subschema({ keyword }, schValid);
					gen.assign(valid, schValid);
					cxt.mergeValidEvaluated(schCxt, valid);
					if (ifClause) gen.assign(ifClause, (0, codegen_1._)`${keyword}`);
					else cxt.setParams({ ifClause: keyword });
				};
			}
		}
	};
	function hasSchema(it, keyword) {
		const schema = it.schema[keyword];
		return schema !== void 0 && !(0, util_1.alwaysValidSchema)(it, schema);
	}
	exports.default = def;
}));
//#endregion
//#region node_modules/@modelcontextprotocol/sdk/node_modules/ajv/dist/vocabularies/applicator/thenElse.js
var require_thenElse$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var util_1 = require_util$1();
	exports.default = {
		keyword: ["then", "else"],
		schemaType: ["object", "boolean"],
		code({ keyword, parentSchema, it }) {
			if (parentSchema.if === void 0) (0, util_1.checkStrictMode)(it, `"${keyword}" without "if" is ignored`);
		}
	};
}));
//#endregion
//#region node_modules/@modelcontextprotocol/sdk/node_modules/ajv/dist/vocabularies/applicator/index.js
var require_applicator$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var additionalItems_1 = require_additionalItems$1();
	var prefixItems_1 = require_prefixItems$1();
	var items_1 = require_items$1();
	var items2020_1 = require_items2020$1();
	var contains_1 = require_contains$1();
	var dependencies_1 = require_dependencies$1();
	var propertyNames_1 = require_propertyNames$1();
	var additionalProperties_1 = require_additionalProperties$1();
	var properties_1 = require_properties$1();
	var patternProperties_1 = require_patternProperties$1();
	var not_1 = require_not$1();
	var anyOf_1 = require_anyOf$1();
	var oneOf_1 = require_oneOf$1();
	var allOf_1 = require_allOf$1();
	var if_1 = require_if$1();
	var thenElse_1 = require_thenElse$1();
	function getApplicator(draft2020 = false) {
		const applicator = [
			not_1.default,
			anyOf_1.default,
			oneOf_1.default,
			allOf_1.default,
			if_1.default,
			thenElse_1.default,
			propertyNames_1.default,
			additionalProperties_1.default,
			dependencies_1.default,
			properties_1.default,
			patternProperties_1.default
		];
		if (draft2020) applicator.push(prefixItems_1.default, items2020_1.default);
		else applicator.push(additionalItems_1.default, items_1.default);
		applicator.push(contains_1.default);
		return applicator;
	}
	exports.default = getApplicator;
}));
//#endregion
//#region node_modules/@modelcontextprotocol/sdk/node_modules/ajv/dist/vocabularies/format/format.js
var require_format$3 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var codegen_1 = require_codegen$1();
	exports.default = {
		keyword: "format",
		type: ["number", "string"],
		schemaType: "string",
		$data: true,
		error: {
			message: ({ schemaCode }) => (0, codegen_1.str)`must match format "${schemaCode}"`,
			params: ({ schemaCode }) => (0, codegen_1._)`{format: ${schemaCode}}`
		},
		code(cxt, ruleType) {
			const { gen, data, $data, schema, schemaCode, it } = cxt;
			const { opts, errSchemaPath, schemaEnv, self } = it;
			if (!opts.validateFormats) return;
			if ($data) validate$DataFormat();
			else validateFormat();
			function validate$DataFormat() {
				const fmts = gen.scopeValue("formats", {
					ref: self.formats,
					code: opts.code.formats
				});
				const fDef = gen.const("fDef", (0, codegen_1._)`${fmts}[${schemaCode}]`);
				const fType = gen.let("fType");
				const format = gen.let("format");
				gen.if((0, codegen_1._)`typeof ${fDef} == "object" && !(${fDef} instanceof RegExp)`, () => gen.assign(fType, (0, codegen_1._)`${fDef}.type || "string"`).assign(format, (0, codegen_1._)`${fDef}.validate`), () => gen.assign(fType, (0, codegen_1._)`"string"`).assign(format, fDef));
				cxt.fail$data((0, codegen_1.or)(unknownFmt(), invalidFmt()));
				function unknownFmt() {
					if (opts.strictSchema === false) return codegen_1.nil;
					return (0, codegen_1._)`${schemaCode} && !${format}`;
				}
				function invalidFmt() {
					const callFormat = schemaEnv.$async ? (0, codegen_1._)`(${fDef}.async ? await ${format}(${data}) : ${format}(${data}))` : (0, codegen_1._)`${format}(${data})`;
					const validData = (0, codegen_1._)`(typeof ${format} == "function" ? ${callFormat} : ${format}.test(${data}))`;
					return (0, codegen_1._)`${format} && ${format} !== true && ${fType} === ${ruleType} && !${validData}`;
				}
			}
			function validateFormat() {
				const formatDef = self.formats[schema];
				if (!formatDef) {
					unknownFormat();
					return;
				}
				if (formatDef === true) return;
				const [fmtType, format, fmtRef] = getFormat(formatDef);
				if (fmtType === ruleType) cxt.pass(validCondition());
				function unknownFormat() {
					if (opts.strictSchema === false) {
						self.logger.warn(unknownMsg());
						return;
					}
					throw new Error(unknownMsg());
					function unknownMsg() {
						return `unknown format "${schema}" ignored in schema at path "${errSchemaPath}"`;
					}
				}
				function getFormat(fmtDef) {
					const code = fmtDef instanceof RegExp ? (0, codegen_1.regexpCode)(fmtDef) : opts.code.formats ? (0, codegen_1._)`${opts.code.formats}${(0, codegen_1.getProperty)(schema)}` : void 0;
					const fmt = gen.scopeValue("formats", {
						key: schema,
						ref: fmtDef,
						code
					});
					if (typeof fmtDef == "object" && !(fmtDef instanceof RegExp)) return [
						fmtDef.type || "string",
						fmtDef.validate,
						(0, codegen_1._)`${fmt}.validate`
					];
					return [
						"string",
						fmtDef,
						fmt
					];
				}
				function validCondition() {
					if (typeof formatDef == "object" && !(formatDef instanceof RegExp) && formatDef.async) {
						if (!schemaEnv.$async) throw new Error("async format in sync schema");
						return (0, codegen_1._)`await ${fmtRef}(${data})`;
					}
					return typeof format == "function" ? (0, codegen_1._)`${fmtRef}(${data})` : (0, codegen_1._)`${fmtRef}.test(${data})`;
				}
			}
		}
	};
}));
//#endregion
//#region node_modules/@modelcontextprotocol/sdk/node_modules/ajv/dist/vocabularies/format/index.js
var require_format$2 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = [require_format$3().default];
}));
//#endregion
//#region node_modules/@modelcontextprotocol/sdk/node_modules/ajv/dist/vocabularies/metadata.js
var require_metadata$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.contentVocabulary = exports.metadataVocabulary = void 0;
	exports.metadataVocabulary = [
		"title",
		"description",
		"default",
		"deprecated",
		"readOnly",
		"writeOnly",
		"examples"
	];
	exports.contentVocabulary = [
		"contentMediaType",
		"contentEncoding",
		"contentSchema"
	];
}));
//#endregion
//#region node_modules/@modelcontextprotocol/sdk/node_modules/ajv/dist/vocabularies/draft7.js
var require_draft7$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var core_1 = require_core$2();
	var validation_1 = require_validation$1();
	var applicator_1 = require_applicator$1();
	var format_1 = require_format$2();
	var metadata_1 = require_metadata$1();
	exports.default = [
		core_1.default,
		validation_1.default,
		(0, applicator_1.default)(),
		format_1.default,
		metadata_1.metadataVocabulary,
		metadata_1.contentVocabulary
	];
}));
//#endregion
//#region node_modules/@modelcontextprotocol/sdk/node_modules/ajv/dist/vocabularies/discriminator/types.js
var require_types$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.DiscrError = void 0;
	var DiscrError;
	(function(DiscrError) {
		DiscrError["Tag"] = "tag";
		DiscrError["Mapping"] = "mapping";
	})(DiscrError || (exports.DiscrError = DiscrError = {}));
}));
//#endregion
//#region node_modules/@modelcontextprotocol/sdk/node_modules/ajv/dist/vocabularies/discriminator/index.js
var require_discriminator$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var codegen_1 = require_codegen$1();
	var types_1 = require_types$1();
	var compile_1 = require_compile$1();
	var ref_error_1 = require_ref_error$1();
	var util_1 = require_util$1();
	exports.default = {
		keyword: "discriminator",
		type: "object",
		schemaType: "object",
		error: {
			message: ({ params: { discrError, tagName } }) => discrError === types_1.DiscrError.Tag ? `tag "${tagName}" must be string` : `value of tag "${tagName}" must be in oneOf`,
			params: ({ params: { discrError, tag, tagName } }) => (0, codegen_1._)`{error: ${discrError}, tag: ${tagName}, tagValue: ${tag}}`
		},
		code(cxt) {
			const { gen, data, schema, parentSchema, it } = cxt;
			const { oneOf } = parentSchema;
			if (!it.opts.discriminator) throw new Error("discriminator: requires discriminator option");
			const tagName = schema.propertyName;
			if (typeof tagName != "string") throw new Error("discriminator: requires propertyName");
			if (schema.mapping) throw new Error("discriminator: mapping is not supported");
			if (!oneOf) throw new Error("discriminator: requires oneOf keyword");
			const valid = gen.let("valid", false);
			const tag = gen.const("tag", (0, codegen_1._)`${data}${(0, codegen_1.getProperty)(tagName)}`);
			gen.if((0, codegen_1._)`typeof ${tag} == "string"`, () => validateMapping(), () => cxt.error(false, {
				discrError: types_1.DiscrError.Tag,
				tag,
				tagName
			}));
			cxt.ok(valid);
			function validateMapping() {
				const mapping = getMapping();
				gen.if(false);
				for (const tagValue in mapping) {
					gen.elseIf((0, codegen_1._)`${tag} === ${tagValue}`);
					gen.assign(valid, applyTagSchema(mapping[tagValue]));
				}
				gen.else();
				cxt.error(false, {
					discrError: types_1.DiscrError.Mapping,
					tag,
					tagName
				});
				gen.endIf();
			}
			function applyTagSchema(schemaProp) {
				const _valid = gen.name("valid");
				const schCxt = cxt.subschema({
					keyword: "oneOf",
					schemaProp
				}, _valid);
				cxt.mergeEvaluated(schCxt, codegen_1.Name);
				return _valid;
			}
			function getMapping() {
				var _a;
				const oneOfMapping = {};
				const topRequired = hasRequired(parentSchema);
				let tagRequired = true;
				for (let i = 0; i < oneOf.length; i++) {
					let sch = oneOf[i];
					if ((sch === null || sch === void 0 ? void 0 : sch.$ref) && !(0, util_1.schemaHasRulesButRef)(sch, it.self.RULES)) {
						const ref = sch.$ref;
						sch = compile_1.resolveRef.call(it.self, it.schemaEnv.root, it.baseId, ref);
						if (sch instanceof compile_1.SchemaEnv) sch = sch.schema;
						if (sch === void 0) throw new ref_error_1.default(it.opts.uriResolver, it.baseId, ref);
					}
					const propSch = (_a = sch === null || sch === void 0 ? void 0 : sch.properties) === null || _a === void 0 ? void 0 : _a[tagName];
					if (typeof propSch != "object") throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${tagName}"`);
					tagRequired = tagRequired && (topRequired || hasRequired(sch));
					addMappings(propSch, i);
				}
				if (!tagRequired) throw new Error(`discriminator: "${tagName}" must be required`);
				return oneOfMapping;
				function hasRequired({ required }) {
					return Array.isArray(required) && required.includes(tagName);
				}
				function addMappings(sch, i) {
					if (sch.const) addMapping(sch.const, i);
					else if (sch.enum) for (const tagValue of sch.enum) addMapping(tagValue, i);
					else throw new Error(`discriminator: "properties/${tagName}" must have "const" or "enum"`);
				}
				function addMapping(tagValue, i) {
					if (typeof tagValue != "string" || tagValue in oneOfMapping) throw new Error(`discriminator: "${tagName}" values must be unique strings`);
					oneOfMapping[tagValue] = i;
				}
			}
		}
	};
}));
//#endregion
//#region node_modules/@modelcontextprotocol/sdk/node_modules/ajv/dist/refs/json-schema-draft-07.json
var json_schema_draft_07_exports$1 = /* @__PURE__ */ __exportAll({
	$id: () => $id$2,
	$schema: () => $schema$1,
	default: () => json_schema_draft_07_default$1,
	definitions: () => definitions$1,
	properties: () => properties$2,
	title: () => title$1,
	type: () => type$2
});
var $schema$1, $id$2, title$1, definitions$1, type$2, properties$2, json_schema_draft_07_default$1;
var init_json_schema_draft_07$1 = __esmMin((() => {
	$schema$1 = "http://json-schema.org/draft-07/schema#";
	$id$2 = "http://json-schema.org/draft-07/schema#";
	title$1 = "Core schema meta-schema";
	definitions$1 = {
		"schemaArray": {
			"type": "array",
			"minItems": 1,
			"items": { "$ref": "#" }
		},
		"nonNegativeInteger": {
			"type": "integer",
			"minimum": 0
		},
		"nonNegativeIntegerDefault0": { "allOf": [{ "$ref": "#/definitions/nonNegativeInteger" }, { "default": 0 }] },
		"simpleTypes": { "enum": [
			"array",
			"boolean",
			"integer",
			"null",
			"number",
			"object",
			"string"
		] },
		"stringArray": {
			"type": "array",
			"items": { "type": "string" },
			"uniqueItems": true,
			"default": []
		}
	};
	type$2 = ["object", "boolean"];
	properties$2 = {
		"$id": {
			"type": "string",
			"format": "uri-reference"
		},
		"$schema": {
			"type": "string",
			"format": "uri"
		},
		"$ref": {
			"type": "string",
			"format": "uri-reference"
		},
		"$comment": { "type": "string" },
		"title": { "type": "string" },
		"description": { "type": "string" },
		"default": true,
		"readOnly": {
			"type": "boolean",
			"default": false
		},
		"examples": {
			"type": "array",
			"items": true
		},
		"multipleOf": {
			"type": "number",
			"exclusiveMinimum": 0
		},
		"maximum": { "type": "number" },
		"exclusiveMaximum": { "type": "number" },
		"minimum": { "type": "number" },
		"exclusiveMinimum": { "type": "number" },
		"maxLength": { "$ref": "#/definitions/nonNegativeInteger" },
		"minLength": { "$ref": "#/definitions/nonNegativeIntegerDefault0" },
		"pattern": {
			"type": "string",
			"format": "regex"
		},
		"additionalItems": { "$ref": "#" },
		"items": {
			"anyOf": [{ "$ref": "#" }, { "$ref": "#/definitions/schemaArray" }],
			"default": true
		},
		"maxItems": { "$ref": "#/definitions/nonNegativeInteger" },
		"minItems": { "$ref": "#/definitions/nonNegativeIntegerDefault0" },
		"uniqueItems": {
			"type": "boolean",
			"default": false
		},
		"contains": { "$ref": "#" },
		"maxProperties": { "$ref": "#/definitions/nonNegativeInteger" },
		"minProperties": { "$ref": "#/definitions/nonNegativeIntegerDefault0" },
		"required": { "$ref": "#/definitions/stringArray" },
		"additionalProperties": { "$ref": "#" },
		"definitions": {
			"type": "object",
			"additionalProperties": { "$ref": "#" },
			"default": {}
		},
		"properties": {
			"type": "object",
			"additionalProperties": { "$ref": "#" },
			"default": {}
		},
		"patternProperties": {
			"type": "object",
			"additionalProperties": { "$ref": "#" },
			"propertyNames": { "format": "regex" },
			"default": {}
		},
		"dependencies": {
			"type": "object",
			"additionalProperties": { "anyOf": [{ "$ref": "#" }, { "$ref": "#/definitions/stringArray" }] }
		},
		"propertyNames": { "$ref": "#" },
		"const": true,
		"enum": {
			"type": "array",
			"items": true,
			"minItems": 1,
			"uniqueItems": true
		},
		"type": { "anyOf": [{ "$ref": "#/definitions/simpleTypes" }, {
			"type": "array",
			"items": { "$ref": "#/definitions/simpleTypes" },
			"minItems": 1,
			"uniqueItems": true
		}] },
		"format": { "type": "string" },
		"contentMediaType": { "type": "string" },
		"contentEncoding": { "type": "string" },
		"if": { "$ref": "#" },
		"then": { "$ref": "#" },
		"else": { "$ref": "#" },
		"allOf": { "$ref": "#/definitions/schemaArray" },
		"anyOf": { "$ref": "#/definitions/schemaArray" },
		"oneOf": { "$ref": "#/definitions/schemaArray" },
		"not": { "$ref": "#" }
	};
	json_schema_draft_07_default$1 = {
		$schema: $schema$1,
		$id: $id$2,
		title: title$1,
		definitions: definitions$1,
		type: type$2,
		properties: properties$2,
		"default": true
	};
}));
//#endregion
//#region node_modules/@modelcontextprotocol/sdk/node_modules/ajv/dist/ajv.js
var require_ajv$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.MissingRefError = exports.ValidationError = exports.CodeGen = exports.Name = exports.nil = exports.stringify = exports.str = exports._ = exports.KeywordCxt = exports.Ajv = void 0;
	var core_1 = require_core$3();
	var draft7_1 = require_draft7$1();
	var discriminator_1 = require_discriminator$1();
	var draft7MetaSchema = (init_json_schema_draft_07$1(), __toCommonJS(json_schema_draft_07_exports$1).default);
	var META_SUPPORT_DATA = ["/properties"];
	var META_SCHEMA_ID = "http://json-schema.org/draft-07/schema";
	var Ajv = class extends core_1.default {
		_addVocabularies() {
			super._addVocabularies();
			draft7_1.default.forEach((v) => this.addVocabulary(v));
			if (this.opts.discriminator) this.addKeyword(discriminator_1.default);
		}
		_addDefaultMetaSchema() {
			super._addDefaultMetaSchema();
			if (!this.opts.meta) return;
			const metaSchema = this.opts.$data ? this.$dataMetaSchema(draft7MetaSchema, META_SUPPORT_DATA) : draft7MetaSchema;
			this.addMetaSchema(metaSchema, META_SCHEMA_ID, false);
			this.refs["http://json-schema.org/schema"] = META_SCHEMA_ID;
		}
		defaultMeta() {
			return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(META_SCHEMA_ID) ? META_SCHEMA_ID : void 0);
		}
	};
	exports.Ajv = Ajv;
	module.exports = exports = Ajv;
	module.exports.Ajv = Ajv;
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Ajv;
	var validate_1 = require_validate$1();
	Object.defineProperty(exports, "KeywordCxt", {
		enumerable: true,
		get: function() {
			return validate_1.KeywordCxt;
		}
	});
	var codegen_1 = require_codegen$1();
	Object.defineProperty(exports, "_", {
		enumerable: true,
		get: function() {
			return codegen_1._;
		}
	});
	Object.defineProperty(exports, "str", {
		enumerable: true,
		get: function() {
			return codegen_1.str;
		}
	});
	Object.defineProperty(exports, "stringify", {
		enumerable: true,
		get: function() {
			return codegen_1.stringify;
		}
	});
	Object.defineProperty(exports, "nil", {
		enumerable: true,
		get: function() {
			return codegen_1.nil;
		}
	});
	Object.defineProperty(exports, "Name", {
		enumerable: true,
		get: function() {
			return codegen_1.Name;
		}
	});
	Object.defineProperty(exports, "CodeGen", {
		enumerable: true,
		get: function() {
			return codegen_1.CodeGen;
		}
	});
	var validation_error_1 = require_validation_error$1();
	Object.defineProperty(exports, "ValidationError", {
		enumerable: true,
		get: function() {
			return validation_error_1.default;
		}
	});
	var ref_error_1 = require_ref_error$1();
	Object.defineProperty(exports, "MissingRefError", {
		enumerable: true,
		get: function() {
			return ref_error_1.default;
		}
	});
}));
//#endregion
//#region node_modules/ajv-formats/dist/formats.js
var require_formats = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.formatNames = exports.fastFormats = exports.fullFormats = void 0;
	function fmtDef(validate, compare) {
		return {
			validate,
			compare
		};
	}
	exports.fullFormats = {
		date: fmtDef(date, compareDate),
		time: fmtDef(getTime(true), compareTime),
		"date-time": fmtDef(getDateTime(true), compareDateTime),
		"iso-time": fmtDef(getTime(), compareIsoTime),
		"iso-date-time": fmtDef(getDateTime(), compareIsoDateTime),
		duration: /^P(?!$)((\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+S)?)?|(\d+W)?)$/,
		uri,
		"uri-reference": /^(?:[a-z][a-z0-9+\-.]*:)?(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'"()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?(?:\?(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i,
		"uri-template": /^(?:(?:[^\x00-\x20"'<>%\\^`{|}]|%[0-9a-f]{2})|\{[+#./;?&=,!@|]?(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?(?:,(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?)*\})*$/i,
		url: /^(?:https?|ftp):\/\/(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)(?:\.(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)*(?:\.(?:[a-z\u{00a1}-\u{ffff}]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/iu,
		email: /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i,
		hostname: /^(?=.{1,253}\.?$)[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[-0-9a-z]{0,61}[0-9a-z])?)*\.?$/i,
		ipv4: /^(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)$/,
		ipv6: /^((([0-9a-f]{1,4}:){7}([0-9a-f]{1,4}|:))|(([0-9a-f]{1,4}:){6}(:[0-9a-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){5}(((:[0-9a-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){4}(((:[0-9a-f]{1,4}){1,3})|((:[0-9a-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){3}(((:[0-9a-f]{1,4}){1,4})|((:[0-9a-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){2}(((:[0-9a-f]{1,4}){1,5})|((:[0-9a-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){1}(((:[0-9a-f]{1,4}){1,6})|((:[0-9a-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9a-f]{1,4}){1,7})|((:[0-9a-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))$/i,
		regex,
		uuid: /^(?:urn:uuid:)?[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i,
		"json-pointer": /^(?:\/(?:[^~/]|~0|~1)*)*$/,
		"json-pointer-uri-fragment": /^#(?:\/(?:[a-z0-9_\-.!$&'()*+,;:=@]|%[0-9a-f]{2}|~0|~1)*)*$/i,
		"relative-json-pointer": /^(?:0|[1-9][0-9]*)(?:#|(?:\/(?:[^~/]|~0|~1)*)*)$/,
		byte,
		int32: {
			type: "number",
			validate: validateInt32
		},
		int64: {
			type: "number",
			validate: validateInt64
		},
		float: {
			type: "number",
			validate: validateNumber
		},
		double: {
			type: "number",
			validate: validateNumber
		},
		password: true,
		binary: true
	};
	exports.fastFormats = {
		...exports.fullFormats,
		date: fmtDef(/^\d\d\d\d-[0-1]\d-[0-3]\d$/, compareDate),
		time: fmtDef(/^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i, compareTime),
		"date-time": fmtDef(/^\d\d\d\d-[0-1]\d-[0-3]\dt(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i, compareDateTime),
		"iso-time": fmtDef(/^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i, compareIsoTime),
		"iso-date-time": fmtDef(/^\d\d\d\d-[0-1]\d-[0-3]\d[t\s](?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i, compareIsoDateTime),
		uri: /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/)?[^\s]*$/i,
		"uri-reference": /^(?:(?:[a-z][a-z0-9+\-.]*:)?\/?\/)?(?:[^\\\s#][^\s#]*)?(?:#[^\\\s]*)?$/i,
		email: /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*$/i
	};
	exports.formatNames = Object.keys(exports.fullFormats);
	function isLeapYear(year) {
		return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
	}
	var DATE = /^(\d\d\d\d)-(\d\d)-(\d\d)$/;
	var DAYS = [
		0,
		31,
		28,
		31,
		30,
		31,
		30,
		31,
		31,
		30,
		31,
		30,
		31
	];
	function date(str) {
		const matches = DATE.exec(str);
		if (!matches) return false;
		const year = +matches[1];
		const month = +matches[2];
		const day = +matches[3];
		return month >= 1 && month <= 12 && day >= 1 && day <= (month === 2 && isLeapYear(year) ? 29 : DAYS[month]);
	}
	function compareDate(d1, d2) {
		if (!(d1 && d2)) return void 0;
		if (d1 > d2) return 1;
		if (d1 < d2) return -1;
		return 0;
	}
	var TIME = /^(\d\d):(\d\d):(\d\d(?:\.\d+)?)(z|([+-])(\d\d)(?::?(\d\d))?)?$/i;
	function getTime(strictTimeZone) {
		return function time(str) {
			const matches = TIME.exec(str);
			if (!matches) return false;
			const hr = +matches[1];
			const min = +matches[2];
			const sec = +matches[3];
			const tz = matches[4];
			const tzSign = matches[5] === "-" ? -1 : 1;
			const tzH = +(matches[6] || 0);
			const tzM = +(matches[7] || 0);
			if (tzH > 23 || tzM > 59 || strictTimeZone && !tz) return false;
			if (hr <= 23 && min <= 59 && sec < 60) return true;
			const utcMin = min - tzM * tzSign;
			const utcHr = hr - tzH * tzSign - (utcMin < 0 ? 1 : 0);
			return (utcHr === 23 || utcHr === -1) && (utcMin === 59 || utcMin === -1) && sec < 61;
		};
	}
	function compareTime(s1, s2) {
		if (!(s1 && s2)) return void 0;
		const t1 = (/* @__PURE__ */ new Date("2020-01-01T" + s1)).valueOf();
		const t2 = (/* @__PURE__ */ new Date("2020-01-01T" + s2)).valueOf();
		if (!(t1 && t2)) return void 0;
		return t1 - t2;
	}
	function compareIsoTime(t1, t2) {
		if (!(t1 && t2)) return void 0;
		const a1 = TIME.exec(t1);
		const a2 = TIME.exec(t2);
		if (!(a1 && a2)) return void 0;
		t1 = a1[1] + a1[2] + a1[3];
		t2 = a2[1] + a2[2] + a2[3];
		if (t1 > t2) return 1;
		if (t1 < t2) return -1;
		return 0;
	}
	var DATE_TIME_SEPARATOR = /t|\s/i;
	function getDateTime(strictTimeZone) {
		const time = getTime(strictTimeZone);
		return function date_time(str) {
			const dateTime = str.split(DATE_TIME_SEPARATOR);
			return dateTime.length === 2 && date(dateTime[0]) && time(dateTime[1]);
		};
	}
	function compareDateTime(dt1, dt2) {
		if (!(dt1 && dt2)) return void 0;
		const d1 = new Date(dt1).valueOf();
		const d2 = new Date(dt2).valueOf();
		if (!(d1 && d2)) return void 0;
		return d1 - d2;
	}
	function compareIsoDateTime(dt1, dt2) {
		if (!(dt1 && dt2)) return void 0;
		const [d1, t1] = dt1.split(DATE_TIME_SEPARATOR);
		const [d2, t2] = dt2.split(DATE_TIME_SEPARATOR);
		const res = compareDate(d1, d2);
		if (res === void 0) return void 0;
		return res || compareTime(t1, t2);
	}
	var NOT_URI_FRAGMENT = /\/|:/;
	var URI = /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)(?:\?(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i;
	function uri(str) {
		return NOT_URI_FRAGMENT.test(str) && URI.test(str);
	}
	var BYTE = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/gm;
	function byte(str) {
		BYTE.lastIndex = 0;
		return BYTE.test(str);
	}
	var MIN_INT32 = -(2 ** 31);
	var MAX_INT32 = 2 ** 31 - 1;
	function validateInt32(value) {
		return Number.isInteger(value) && value <= MAX_INT32 && value >= MIN_INT32;
	}
	function validateInt64(value) {
		return Number.isInteger(value);
	}
	function validateNumber() {
		return true;
	}
	var Z_ANCHOR = /[^\\]\\Z/;
	function regex(str) {
		if (Z_ANCHOR.test(str)) return false;
		try {
			new RegExp(str);
			return true;
		} catch (e) {
			return false;
		}
	}
}));
//#endregion
//#region node_modules/ajv-formats/node_modules/ajv/dist/compile/codegen/code.js
var require_code$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.regexpCode = exports.getEsmExportName = exports.getProperty = exports.safeStringify = exports.stringify = exports.strConcat = exports.addCodeArg = exports.str = exports._ = exports.nil = exports._Code = exports.Name = exports.IDENTIFIER = exports._CodeOrName = void 0;
	var _CodeOrName = class {};
	exports._CodeOrName = _CodeOrName;
	exports.IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i;
	var Name = class extends _CodeOrName {
		constructor(s) {
			super();
			if (!exports.IDENTIFIER.test(s)) throw new Error("CodeGen: name must be a valid identifier");
			this.str = s;
		}
		toString() {
			return this.str;
		}
		emptyStr() {
			return false;
		}
		get names() {
			return { [this.str]: 1 };
		}
	};
	exports.Name = Name;
	var _Code = class extends _CodeOrName {
		constructor(code) {
			super();
			this._items = typeof code === "string" ? [code] : code;
		}
		toString() {
			return this.str;
		}
		emptyStr() {
			if (this._items.length > 1) return false;
			const item = this._items[0];
			return item === "" || item === "\"\"";
		}
		get str() {
			var _a;
			return (_a = this._str) !== null && _a !== void 0 ? _a : this._str = this._items.reduce((s, c) => `${s}${c}`, "");
		}
		get names() {
			var _a;
			return (_a = this._names) !== null && _a !== void 0 ? _a : this._names = this._items.reduce((names, c) => {
				if (c instanceof Name) names[c.str] = (names[c.str] || 0) + 1;
				return names;
			}, {});
		}
	};
	exports._Code = _Code;
	exports.nil = new _Code("");
	function _(strs, ...args) {
		const code = [strs[0]];
		let i = 0;
		while (i < args.length) {
			addCodeArg(code, args[i]);
			code.push(strs[++i]);
		}
		return new _Code(code);
	}
	exports._ = _;
	var plus = new _Code("+");
	function str(strs, ...args) {
		const expr = [safeStringify(strs[0])];
		let i = 0;
		while (i < args.length) {
			expr.push(plus);
			addCodeArg(expr, args[i]);
			expr.push(plus, safeStringify(strs[++i]));
		}
		optimize(expr);
		return new _Code(expr);
	}
	exports.str = str;
	function addCodeArg(code, arg) {
		if (arg instanceof _Code) code.push(...arg._items);
		else if (arg instanceof Name) code.push(arg);
		else code.push(interpolate(arg));
	}
	exports.addCodeArg = addCodeArg;
	function optimize(expr) {
		let i = 1;
		while (i < expr.length - 1) {
			if (expr[i] === plus) {
				const res = mergeExprItems(expr[i - 1], expr[i + 1]);
				if (res !== void 0) {
					expr.splice(i - 1, 3, res);
					continue;
				}
				expr[i++] = "+";
			}
			i++;
		}
	}
	function mergeExprItems(a, b) {
		if (b === "\"\"") return a;
		if (a === "\"\"") return b;
		if (typeof a == "string") {
			if (b instanceof Name || a[a.length - 1] !== "\"") return;
			if (typeof b != "string") return `${a.slice(0, -1)}${b}"`;
			if (b[0] === "\"") return a.slice(0, -1) + b.slice(1);
			return;
		}
		if (typeof b == "string" && b[0] === "\"" && !(a instanceof Name)) return `"${a}${b.slice(1)}`;
	}
	function strConcat(c1, c2) {
		return c2.emptyStr() ? c1 : c1.emptyStr() ? c2 : str`${c1}${c2}`;
	}
	exports.strConcat = strConcat;
	function interpolate(x) {
		return typeof x == "number" || typeof x == "boolean" || x === null ? x : safeStringify(Array.isArray(x) ? x.join(",") : x);
	}
	function stringify(x) {
		return new _Code(safeStringify(x));
	}
	exports.stringify = stringify;
	function safeStringify(x) {
		return JSON.stringify(x).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
	}
	exports.safeStringify = safeStringify;
	function getProperty(key) {
		return typeof key == "string" && exports.IDENTIFIER.test(key) ? new _Code(`.${key}`) : _`[${key}]`;
	}
	exports.getProperty = getProperty;
	function getEsmExportName(key) {
		if (typeof key == "string" && exports.IDENTIFIER.test(key)) return new _Code(`${key}`);
		throw new Error(`CodeGen: invalid export name: ${key}, use explicit $id name mapping`);
	}
	exports.getEsmExportName = getEsmExportName;
	function regexpCode(rx) {
		return new _Code(rx.toString());
	}
	exports.regexpCode = regexpCode;
}));
//#endregion
//#region node_modules/ajv-formats/node_modules/ajv/dist/compile/codegen/scope.js
var require_scope = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ValueScope = exports.ValueScopeName = exports.Scope = exports.varKinds = exports.UsedValueState = void 0;
	var code_1 = require_code$1();
	var ValueError = class extends Error {
		constructor(name) {
			super(`CodeGen: "code" for ${name} not defined`);
			this.value = name.value;
		}
	};
	var UsedValueState;
	(function(UsedValueState) {
		UsedValueState[UsedValueState["Started"] = 0] = "Started";
		UsedValueState[UsedValueState["Completed"] = 1] = "Completed";
	})(UsedValueState || (exports.UsedValueState = UsedValueState = {}));
	exports.varKinds = {
		const: new code_1.Name("const"),
		let: new code_1.Name("let"),
		var: new code_1.Name("var")
	};
	var Scope = class {
		constructor({ prefixes, parent } = {}) {
			this._names = {};
			this._prefixes = prefixes;
			this._parent = parent;
		}
		toName(nameOrPrefix) {
			return nameOrPrefix instanceof code_1.Name ? nameOrPrefix : this.name(nameOrPrefix);
		}
		name(prefix) {
			return new code_1.Name(this._newName(prefix));
		}
		_newName(prefix) {
			const ng = this._names[prefix] || this._nameGroup(prefix);
			return `${prefix}${ng.index++}`;
		}
		_nameGroup(prefix) {
			var _a, _b;
			if (((_b = (_a = this._parent) === null || _a === void 0 ? void 0 : _a._prefixes) === null || _b === void 0 ? void 0 : _b.has(prefix)) || this._prefixes && !this._prefixes.has(prefix)) throw new Error(`CodeGen: prefix "${prefix}" is not allowed in this scope`);
			return this._names[prefix] = {
				prefix,
				index: 0
			};
		}
	};
	exports.Scope = Scope;
	var ValueScopeName = class extends code_1.Name {
		constructor(prefix, nameStr) {
			super(nameStr);
			this.prefix = prefix;
		}
		setValue(value, { property, itemIndex }) {
			this.value = value;
			this.scopePath = (0, code_1._)`.${new code_1.Name(property)}[${itemIndex}]`;
		}
	};
	exports.ValueScopeName = ValueScopeName;
	var line = (0, code_1._)`\n`;
	var ValueScope = class extends Scope {
		constructor(opts) {
			super(opts);
			this._values = {};
			this._scope = opts.scope;
			this.opts = {
				...opts,
				_n: opts.lines ? line : code_1.nil
			};
		}
		get() {
			return this._scope;
		}
		name(prefix) {
			return new ValueScopeName(prefix, this._newName(prefix));
		}
		value(nameOrPrefix, value) {
			var _a;
			if (value.ref === void 0) throw new Error("CodeGen: ref must be passed in value");
			const name = this.toName(nameOrPrefix);
			const { prefix } = name;
			const valueKey = (_a = value.key) !== null && _a !== void 0 ? _a : value.ref;
			let vs = this._values[prefix];
			if (vs) {
				const _name = vs.get(valueKey);
				if (_name) return _name;
			} else vs = this._values[prefix] = /* @__PURE__ */ new Map();
			vs.set(valueKey, name);
			const s = this._scope[prefix] || (this._scope[prefix] = []);
			const itemIndex = s.length;
			s[itemIndex] = value.ref;
			name.setValue(value, {
				property: prefix,
				itemIndex
			});
			return name;
		}
		getValue(prefix, keyOrRef) {
			const vs = this._values[prefix];
			if (!vs) return;
			return vs.get(keyOrRef);
		}
		scopeRefs(scopeName, values = this._values) {
			return this._reduceValues(values, (name) => {
				if (name.scopePath === void 0) throw new Error(`CodeGen: name "${name}" has no value`);
				return (0, code_1._)`${scopeName}${name.scopePath}`;
			});
		}
		scopeCode(values = this._values, usedValues, getCode) {
			return this._reduceValues(values, (name) => {
				if (name.value === void 0) throw new Error(`CodeGen: name "${name}" has no value`);
				return name.value.code;
			}, usedValues, getCode);
		}
		_reduceValues(values, valueCode, usedValues = {}, getCode) {
			let code = code_1.nil;
			for (const prefix in values) {
				const vs = values[prefix];
				if (!vs) continue;
				const nameSet = usedValues[prefix] = usedValues[prefix] || /* @__PURE__ */ new Map();
				vs.forEach((name) => {
					if (nameSet.has(name)) return;
					nameSet.set(name, UsedValueState.Started);
					let c = valueCode(name);
					if (c) {
						const def = this.opts.es5 ? exports.varKinds.var : exports.varKinds.const;
						code = (0, code_1._)`${code}${def} ${name} = ${c};${this.opts._n}`;
					} else if (c = getCode === null || getCode === void 0 ? void 0 : getCode(name)) code = (0, code_1._)`${code}${c}${this.opts._n}`;
					else throw new ValueError(name);
					nameSet.set(name, UsedValueState.Completed);
				});
			}
			return code;
		}
	};
	exports.ValueScope = ValueScope;
}));
//#endregion
//#region node_modules/ajv-formats/node_modules/ajv/dist/compile/codegen/index.js
var require_codegen = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.or = exports.and = exports.not = exports.CodeGen = exports.operators = exports.varKinds = exports.ValueScopeName = exports.ValueScope = exports.Scope = exports.Name = exports.regexpCode = exports.stringify = exports.getProperty = exports.nil = exports.strConcat = exports.str = exports._ = void 0;
	var code_1 = require_code$1();
	var scope_1 = require_scope();
	var code_2 = require_code$1();
	Object.defineProperty(exports, "_", {
		enumerable: true,
		get: function() {
			return code_2._;
		}
	});
	Object.defineProperty(exports, "str", {
		enumerable: true,
		get: function() {
			return code_2.str;
		}
	});
	Object.defineProperty(exports, "strConcat", {
		enumerable: true,
		get: function() {
			return code_2.strConcat;
		}
	});
	Object.defineProperty(exports, "nil", {
		enumerable: true,
		get: function() {
			return code_2.nil;
		}
	});
	Object.defineProperty(exports, "getProperty", {
		enumerable: true,
		get: function() {
			return code_2.getProperty;
		}
	});
	Object.defineProperty(exports, "stringify", {
		enumerable: true,
		get: function() {
			return code_2.stringify;
		}
	});
	Object.defineProperty(exports, "regexpCode", {
		enumerable: true,
		get: function() {
			return code_2.regexpCode;
		}
	});
	Object.defineProperty(exports, "Name", {
		enumerable: true,
		get: function() {
			return code_2.Name;
		}
	});
	var scope_2 = require_scope();
	Object.defineProperty(exports, "Scope", {
		enumerable: true,
		get: function() {
			return scope_2.Scope;
		}
	});
	Object.defineProperty(exports, "ValueScope", {
		enumerable: true,
		get: function() {
			return scope_2.ValueScope;
		}
	});
	Object.defineProperty(exports, "ValueScopeName", {
		enumerable: true,
		get: function() {
			return scope_2.ValueScopeName;
		}
	});
	Object.defineProperty(exports, "varKinds", {
		enumerable: true,
		get: function() {
			return scope_2.varKinds;
		}
	});
	exports.operators = {
		GT: new code_1._Code(">"),
		GTE: new code_1._Code(">="),
		LT: new code_1._Code("<"),
		LTE: new code_1._Code("<="),
		EQ: new code_1._Code("==="),
		NEQ: new code_1._Code("!=="),
		NOT: new code_1._Code("!"),
		OR: new code_1._Code("||"),
		AND: new code_1._Code("&&"),
		ADD: new code_1._Code("+")
	};
	var Node = class {
		optimizeNodes() {
			return this;
		}
		optimizeNames(_names, _constants) {
			return this;
		}
	};
	var Def = class extends Node {
		constructor(varKind, name, rhs) {
			super();
			this.varKind = varKind;
			this.name = name;
			this.rhs = rhs;
		}
		render({ es5, _n }) {
			const varKind = es5 ? scope_1.varKinds.var : this.varKind;
			const rhs = this.rhs === void 0 ? "" : ` = ${this.rhs}`;
			return `${varKind} ${this.name}${rhs};` + _n;
		}
		optimizeNames(names, constants) {
			if (!names[this.name.str]) return;
			if (this.rhs) this.rhs = optimizeExpr(this.rhs, names, constants);
			return this;
		}
		get names() {
			return this.rhs instanceof code_1._CodeOrName ? this.rhs.names : {};
		}
	};
	var Assign = class extends Node {
		constructor(lhs, rhs, sideEffects) {
			super();
			this.lhs = lhs;
			this.rhs = rhs;
			this.sideEffects = sideEffects;
		}
		render({ _n }) {
			return `${this.lhs} = ${this.rhs};` + _n;
		}
		optimizeNames(names, constants) {
			if (this.lhs instanceof code_1.Name && !names[this.lhs.str] && !this.sideEffects) return;
			this.rhs = optimizeExpr(this.rhs, names, constants);
			return this;
		}
		get names() {
			return addExprNames(this.lhs instanceof code_1.Name ? {} : { ...this.lhs.names }, this.rhs);
		}
	};
	var AssignOp = class extends Assign {
		constructor(lhs, op, rhs, sideEffects) {
			super(lhs, rhs, sideEffects);
			this.op = op;
		}
		render({ _n }) {
			return `${this.lhs} ${this.op}= ${this.rhs};` + _n;
		}
	};
	var Label = class extends Node {
		constructor(label) {
			super();
			this.label = label;
			this.names = {};
		}
		render({ _n }) {
			return `${this.label}:` + _n;
		}
	};
	var Break = class extends Node {
		constructor(label) {
			super();
			this.label = label;
			this.names = {};
		}
		render({ _n }) {
			return `break${this.label ? ` ${this.label}` : ""};` + _n;
		}
	};
	var Throw = class extends Node {
		constructor(error) {
			super();
			this.error = error;
		}
		render({ _n }) {
			return `throw ${this.error};` + _n;
		}
		get names() {
			return this.error.names;
		}
	};
	var AnyCode = class extends Node {
		constructor(code) {
			super();
			this.code = code;
		}
		render({ _n }) {
			return `${this.code};` + _n;
		}
		optimizeNodes() {
			return `${this.code}` ? this : void 0;
		}
		optimizeNames(names, constants) {
			this.code = optimizeExpr(this.code, names, constants);
			return this;
		}
		get names() {
			return this.code instanceof code_1._CodeOrName ? this.code.names : {};
		}
	};
	var ParentNode = class extends Node {
		constructor(nodes = []) {
			super();
			this.nodes = nodes;
		}
		render(opts) {
			return this.nodes.reduce((code, n) => code + n.render(opts), "");
		}
		optimizeNodes() {
			const { nodes } = this;
			let i = nodes.length;
			while (i--) {
				const n = nodes[i].optimizeNodes();
				if (Array.isArray(n)) nodes.splice(i, 1, ...n);
				else if (n) nodes[i] = n;
				else nodes.splice(i, 1);
			}
			return nodes.length > 0 ? this : void 0;
		}
		optimizeNames(names, constants) {
			const { nodes } = this;
			let i = nodes.length;
			while (i--) {
				const n = nodes[i];
				if (n.optimizeNames(names, constants)) continue;
				subtractNames(names, n.names);
				nodes.splice(i, 1);
			}
			return nodes.length > 0 ? this : void 0;
		}
		get names() {
			return this.nodes.reduce((names, n) => addNames(names, n.names), {});
		}
	};
	var BlockNode = class extends ParentNode {
		render(opts) {
			return "{" + opts._n + super.render(opts) + "}" + opts._n;
		}
	};
	var Root = class extends ParentNode {};
	var Else = class extends BlockNode {};
	Else.kind = "else";
	var If = class If extends BlockNode {
		constructor(condition, nodes) {
			super(nodes);
			this.condition = condition;
		}
		render(opts) {
			let code = `if(${this.condition})` + super.render(opts);
			if (this.else) code += "else " + this.else.render(opts);
			return code;
		}
		optimizeNodes() {
			super.optimizeNodes();
			const cond = this.condition;
			if (cond === true) return this.nodes;
			let e = this.else;
			if (e) {
				const ns = e.optimizeNodes();
				e = this.else = Array.isArray(ns) ? new Else(ns) : ns;
			}
			if (e) {
				if (cond === false) return e instanceof If ? e : e.nodes;
				if (this.nodes.length) return this;
				return new If(not(cond), e instanceof If ? [e] : e.nodes);
			}
			if (cond === false || !this.nodes.length) return void 0;
			return this;
		}
		optimizeNames(names, constants) {
			var _a;
			this.else = (_a = this.else) === null || _a === void 0 ? void 0 : _a.optimizeNames(names, constants);
			if (!(super.optimizeNames(names, constants) || this.else)) return;
			this.condition = optimizeExpr(this.condition, names, constants);
			return this;
		}
		get names() {
			const names = super.names;
			addExprNames(names, this.condition);
			if (this.else) addNames(names, this.else.names);
			return names;
		}
	};
	If.kind = "if";
	var For = class extends BlockNode {};
	For.kind = "for";
	var ForLoop = class extends For {
		constructor(iteration) {
			super();
			this.iteration = iteration;
		}
		render(opts) {
			return `for(${this.iteration})` + super.render(opts);
		}
		optimizeNames(names, constants) {
			if (!super.optimizeNames(names, constants)) return;
			this.iteration = optimizeExpr(this.iteration, names, constants);
			return this;
		}
		get names() {
			return addNames(super.names, this.iteration.names);
		}
	};
	var ForRange = class extends For {
		constructor(varKind, name, from, to) {
			super();
			this.varKind = varKind;
			this.name = name;
			this.from = from;
			this.to = to;
		}
		render(opts) {
			const varKind = opts.es5 ? scope_1.varKinds.var : this.varKind;
			const { name, from, to } = this;
			return `for(${varKind} ${name}=${from}; ${name}<${to}; ${name}++)` + super.render(opts);
		}
		get names() {
			return addExprNames(addExprNames(super.names, this.from), this.to);
		}
	};
	var ForIter = class extends For {
		constructor(loop, varKind, name, iterable) {
			super();
			this.loop = loop;
			this.varKind = varKind;
			this.name = name;
			this.iterable = iterable;
		}
		render(opts) {
			return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render(opts);
		}
		optimizeNames(names, constants) {
			if (!super.optimizeNames(names, constants)) return;
			this.iterable = optimizeExpr(this.iterable, names, constants);
			return this;
		}
		get names() {
			return addNames(super.names, this.iterable.names);
		}
	};
	var Func = class extends BlockNode {
		constructor(name, args, async) {
			super();
			this.name = name;
			this.args = args;
			this.async = async;
		}
		render(opts) {
			return `${this.async ? "async " : ""}function ${this.name}(${this.args})` + super.render(opts);
		}
	};
	Func.kind = "func";
	var Return = class extends ParentNode {
		render(opts) {
			return "return " + super.render(opts);
		}
	};
	Return.kind = "return";
	var Try = class extends BlockNode {
		render(opts) {
			let code = "try" + super.render(opts);
			if (this.catch) code += this.catch.render(opts);
			if (this.finally) code += this.finally.render(opts);
			return code;
		}
		optimizeNodes() {
			var _a, _b;
			super.optimizeNodes();
			(_a = this.catch) === null || _a === void 0 || _a.optimizeNodes();
			(_b = this.finally) === null || _b === void 0 || _b.optimizeNodes();
			return this;
		}
		optimizeNames(names, constants) {
			var _a, _b;
			super.optimizeNames(names, constants);
			(_a = this.catch) === null || _a === void 0 || _a.optimizeNames(names, constants);
			(_b = this.finally) === null || _b === void 0 || _b.optimizeNames(names, constants);
			return this;
		}
		get names() {
			const names = super.names;
			if (this.catch) addNames(names, this.catch.names);
			if (this.finally) addNames(names, this.finally.names);
			return names;
		}
	};
	var Catch = class extends BlockNode {
		constructor(error) {
			super();
			this.error = error;
		}
		render(opts) {
			return `catch(${this.error})` + super.render(opts);
		}
	};
	Catch.kind = "catch";
	var Finally = class extends BlockNode {
		render(opts) {
			return "finally" + super.render(opts);
		}
	};
	Finally.kind = "finally";
	var CodeGen = class {
		constructor(extScope, opts = {}) {
			this._values = {};
			this._blockStarts = [];
			this._constants = {};
			this.opts = {
				...opts,
				_n: opts.lines ? "\n" : ""
			};
			this._extScope = extScope;
			this._scope = new scope_1.Scope({ parent: extScope });
			this._nodes = [new Root()];
		}
		toString() {
			return this._root.render(this.opts);
		}
		name(prefix) {
			return this._scope.name(prefix);
		}
		scopeName(prefix) {
			return this._extScope.name(prefix);
		}
		scopeValue(prefixOrName, value) {
			const name = this._extScope.value(prefixOrName, value);
			(this._values[name.prefix] || (this._values[name.prefix] = /* @__PURE__ */ new Set())).add(name);
			return name;
		}
		getScopeValue(prefix, keyOrRef) {
			return this._extScope.getValue(prefix, keyOrRef);
		}
		scopeRefs(scopeName) {
			return this._extScope.scopeRefs(scopeName, this._values);
		}
		scopeCode() {
			return this._extScope.scopeCode(this._values);
		}
		_def(varKind, nameOrPrefix, rhs, constant) {
			const name = this._scope.toName(nameOrPrefix);
			if (rhs !== void 0 && constant) this._constants[name.str] = rhs;
			this._leafNode(new Def(varKind, name, rhs));
			return name;
		}
		const(nameOrPrefix, rhs, _constant) {
			return this._def(scope_1.varKinds.const, nameOrPrefix, rhs, _constant);
		}
		let(nameOrPrefix, rhs, _constant) {
			return this._def(scope_1.varKinds.let, nameOrPrefix, rhs, _constant);
		}
		var(nameOrPrefix, rhs, _constant) {
			return this._def(scope_1.varKinds.var, nameOrPrefix, rhs, _constant);
		}
		assign(lhs, rhs, sideEffects) {
			return this._leafNode(new Assign(lhs, rhs, sideEffects));
		}
		add(lhs, rhs) {
			return this._leafNode(new AssignOp(lhs, exports.operators.ADD, rhs));
		}
		code(c) {
			if (typeof c == "function") c();
			else if (c !== code_1.nil) this._leafNode(new AnyCode(c));
			return this;
		}
		object(...keyValues) {
			const code = ["{"];
			for (const [key, value] of keyValues) {
				if (code.length > 1) code.push(",");
				code.push(key);
				if (key !== value || this.opts.es5) {
					code.push(":");
					(0, code_1.addCodeArg)(code, value);
				}
			}
			code.push("}");
			return new code_1._Code(code);
		}
		if(condition, thenBody, elseBody) {
			this._blockNode(new If(condition));
			if (thenBody && elseBody) this.code(thenBody).else().code(elseBody).endIf();
			else if (thenBody) this.code(thenBody).endIf();
			else if (elseBody) throw new Error("CodeGen: \"else\" body without \"then\" body");
			return this;
		}
		elseIf(condition) {
			return this._elseNode(new If(condition));
		}
		else() {
			return this._elseNode(new Else());
		}
		endIf() {
			return this._endBlockNode(If, Else);
		}
		_for(node, forBody) {
			this._blockNode(node);
			if (forBody) this.code(forBody).endFor();
			return this;
		}
		for(iteration, forBody) {
			return this._for(new ForLoop(iteration), forBody);
		}
		forRange(nameOrPrefix, from, to, forBody, varKind = this.opts.es5 ? scope_1.varKinds.var : scope_1.varKinds.let) {
			const name = this._scope.toName(nameOrPrefix);
			return this._for(new ForRange(varKind, name, from, to), () => forBody(name));
		}
		forOf(nameOrPrefix, iterable, forBody, varKind = scope_1.varKinds.const) {
			const name = this._scope.toName(nameOrPrefix);
			if (this.opts.es5) {
				const arr = iterable instanceof code_1.Name ? iterable : this.var("_arr", iterable);
				return this.forRange("_i", 0, (0, code_1._)`${arr}.length`, (i) => {
					this.var(name, (0, code_1._)`${arr}[${i}]`);
					forBody(name);
				});
			}
			return this._for(new ForIter("of", varKind, name, iterable), () => forBody(name));
		}
		forIn(nameOrPrefix, obj, forBody, varKind = this.opts.es5 ? scope_1.varKinds.var : scope_1.varKinds.const) {
			if (this.opts.ownProperties) return this.forOf(nameOrPrefix, (0, code_1._)`Object.keys(${obj})`, forBody);
			const name = this._scope.toName(nameOrPrefix);
			return this._for(new ForIter("in", varKind, name, obj), () => forBody(name));
		}
		endFor() {
			return this._endBlockNode(For);
		}
		label(label) {
			return this._leafNode(new Label(label));
		}
		break(label) {
			return this._leafNode(new Break(label));
		}
		return(value) {
			const node = new Return();
			this._blockNode(node);
			this.code(value);
			if (node.nodes.length !== 1) throw new Error("CodeGen: \"return\" should have one node");
			return this._endBlockNode(Return);
		}
		try(tryBody, catchCode, finallyCode) {
			if (!catchCode && !finallyCode) throw new Error("CodeGen: \"try\" without \"catch\" and \"finally\"");
			const node = new Try();
			this._blockNode(node);
			this.code(tryBody);
			if (catchCode) {
				const error = this.name("e");
				this._currNode = node.catch = new Catch(error);
				catchCode(error);
			}
			if (finallyCode) {
				this._currNode = node.finally = new Finally();
				this.code(finallyCode);
			}
			return this._endBlockNode(Catch, Finally);
		}
		throw(error) {
			return this._leafNode(new Throw(error));
		}
		block(body, nodeCount) {
			this._blockStarts.push(this._nodes.length);
			if (body) this.code(body).endBlock(nodeCount);
			return this;
		}
		endBlock(nodeCount) {
			const len = this._blockStarts.pop();
			if (len === void 0) throw new Error("CodeGen: not in self-balancing block");
			const toClose = this._nodes.length - len;
			if (toClose < 0 || nodeCount !== void 0 && toClose !== nodeCount) throw new Error(`CodeGen: wrong number of nodes: ${toClose} vs ${nodeCount} expected`);
			this._nodes.length = len;
			return this;
		}
		func(name, args = code_1.nil, async, funcBody) {
			this._blockNode(new Func(name, args, async));
			if (funcBody) this.code(funcBody).endFunc();
			return this;
		}
		endFunc() {
			return this._endBlockNode(Func);
		}
		optimize(n = 1) {
			while (n-- > 0) {
				this._root.optimizeNodes();
				this._root.optimizeNames(this._root.names, this._constants);
			}
		}
		_leafNode(node) {
			this._currNode.nodes.push(node);
			return this;
		}
		_blockNode(node) {
			this._currNode.nodes.push(node);
			this._nodes.push(node);
		}
		_endBlockNode(N1, N2) {
			const n = this._currNode;
			if (n instanceof N1 || N2 && n instanceof N2) {
				this._nodes.pop();
				return this;
			}
			throw new Error(`CodeGen: not in block "${N2 ? `${N1.kind}/${N2.kind}` : N1.kind}"`);
		}
		_elseNode(node) {
			const n = this._currNode;
			if (!(n instanceof If)) throw new Error("CodeGen: \"else\" without \"if\"");
			this._currNode = n.else = node;
			return this;
		}
		get _root() {
			return this._nodes[0];
		}
		get _currNode() {
			const ns = this._nodes;
			return ns[ns.length - 1];
		}
		set _currNode(node) {
			const ns = this._nodes;
			ns[ns.length - 1] = node;
		}
	};
	exports.CodeGen = CodeGen;
	function addNames(names, from) {
		for (const n in from) names[n] = (names[n] || 0) + (from[n] || 0);
		return names;
	}
	function addExprNames(names, from) {
		return from instanceof code_1._CodeOrName ? addNames(names, from.names) : names;
	}
	function optimizeExpr(expr, names, constants) {
		if (expr instanceof code_1.Name) return replaceName(expr);
		if (!canOptimize(expr)) return expr;
		return new code_1._Code(expr._items.reduce((items, c) => {
			if (c instanceof code_1.Name) c = replaceName(c);
			if (c instanceof code_1._Code) items.push(...c._items);
			else items.push(c);
			return items;
		}, []));
		function replaceName(n) {
			const c = constants[n.str];
			if (c === void 0 || names[n.str] !== 1) return n;
			delete names[n.str];
			return c;
		}
		function canOptimize(e) {
			return e instanceof code_1._Code && e._items.some((c) => c instanceof code_1.Name && names[c.str] === 1 && constants[c.str] !== void 0);
		}
	}
	function subtractNames(names, from) {
		for (const n in from) names[n] = (names[n] || 0) - (from[n] || 0);
	}
	function not(x) {
		return typeof x == "boolean" || typeof x == "number" || x === null ? !x : (0, code_1._)`!${par(x)}`;
	}
	exports.not = not;
	var andCode = mappend(exports.operators.AND);
	function and(...args) {
		return args.reduce(andCode);
	}
	exports.and = and;
	var orCode = mappend(exports.operators.OR);
	function or(...args) {
		return args.reduce(orCode);
	}
	exports.or = or;
	function mappend(op) {
		return (x, y) => x === code_1.nil ? y : y === code_1.nil ? x : (0, code_1._)`${par(x)} ${op} ${par(y)}`;
	}
	function par(x) {
		return x instanceof code_1.Name ? x : (0, code_1._)`(${x})`;
	}
}));
//#endregion
//#region node_modules/ajv-formats/node_modules/ajv/dist/compile/util.js
var require_util = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.checkStrictMode = exports.getErrorPath = exports.Type = exports.useFunc = exports.setEvaluated = exports.evaluatedPropsToName = exports.mergeEvaluated = exports.eachItem = exports.unescapeJsonPointer = exports.escapeJsonPointer = exports.escapeFragment = exports.unescapeFragment = exports.schemaRefOrVal = exports.schemaHasRulesButRef = exports.schemaHasRules = exports.checkUnknownRules = exports.alwaysValidSchema = exports.toHash = void 0;
	var codegen_1 = require_codegen();
	var code_1 = require_code$1();
	function toHash(arr) {
		const hash = {};
		for (const item of arr) hash[item] = true;
		return hash;
	}
	exports.toHash = toHash;
	function alwaysValidSchema(it, schema) {
		if (typeof schema == "boolean") return schema;
		if (Object.keys(schema).length === 0) return true;
		checkUnknownRules(it, schema);
		return !schemaHasRules(schema, it.self.RULES.all);
	}
	exports.alwaysValidSchema = alwaysValidSchema;
	function checkUnknownRules(it, schema = it.schema) {
		const { opts, self } = it;
		if (!opts.strictSchema) return;
		if (typeof schema === "boolean") return;
		const rules = self.RULES.keywords;
		for (const key in schema) if (!rules[key]) checkStrictMode(it, `unknown keyword: "${key}"`);
	}
	exports.checkUnknownRules = checkUnknownRules;
	function schemaHasRules(schema, rules) {
		if (typeof schema == "boolean") return !schema;
		for (const key in schema) if (rules[key]) return true;
		return false;
	}
	exports.schemaHasRules = schemaHasRules;
	function schemaHasRulesButRef(schema, RULES) {
		if (typeof schema == "boolean") return !schema;
		for (const key in schema) if (key !== "$ref" && RULES.all[key]) return true;
		return false;
	}
	exports.schemaHasRulesButRef = schemaHasRulesButRef;
	function schemaRefOrVal({ topSchemaRef, schemaPath }, schema, keyword, $data) {
		if (!$data) {
			if (typeof schema == "number" || typeof schema == "boolean") return schema;
			if (typeof schema == "string") return (0, codegen_1._)`${schema}`;
		}
		return (0, codegen_1._)`${topSchemaRef}${schemaPath}${(0, codegen_1.getProperty)(keyword)}`;
	}
	exports.schemaRefOrVal = schemaRefOrVal;
	function unescapeFragment(str) {
		return unescapeJsonPointer(decodeURIComponent(str));
	}
	exports.unescapeFragment = unescapeFragment;
	function escapeFragment(str) {
		return encodeURIComponent(escapeJsonPointer(str));
	}
	exports.escapeFragment = escapeFragment;
	function escapeJsonPointer(str) {
		if (typeof str == "number") return `${str}`;
		return str.replace(/~/g, "~0").replace(/\//g, "~1");
	}
	exports.escapeJsonPointer = escapeJsonPointer;
	function unescapeJsonPointer(str) {
		return str.replace(/~1/g, "/").replace(/~0/g, "~");
	}
	exports.unescapeJsonPointer = unescapeJsonPointer;
	function eachItem(xs, f) {
		if (Array.isArray(xs)) for (const x of xs) f(x);
		else f(xs);
	}
	exports.eachItem = eachItem;
	function makeMergeEvaluated({ mergeNames, mergeToName, mergeValues, resultToName }) {
		return (gen, from, to, toName) => {
			const res = to === void 0 ? from : to instanceof codegen_1.Name ? (from instanceof codegen_1.Name ? mergeNames(gen, from, to) : mergeToName(gen, from, to), to) : from instanceof codegen_1.Name ? (mergeToName(gen, to, from), from) : mergeValues(from, to);
			return toName === codegen_1.Name && !(res instanceof codegen_1.Name) ? resultToName(gen, res) : res;
		};
	}
	exports.mergeEvaluated = {
		props: makeMergeEvaluated({
			mergeNames: (gen, from, to) => gen.if((0, codegen_1._)`${to} !== true && ${from} !== undefined`, () => {
				gen.if((0, codegen_1._)`${from} === true`, () => gen.assign(to, true), () => gen.assign(to, (0, codegen_1._)`${to} || {}`).code((0, codegen_1._)`Object.assign(${to}, ${from})`));
			}),
			mergeToName: (gen, from, to) => gen.if((0, codegen_1._)`${to} !== true`, () => {
				if (from === true) gen.assign(to, true);
				else {
					gen.assign(to, (0, codegen_1._)`${to} || {}`);
					setEvaluated(gen, to, from);
				}
			}),
			mergeValues: (from, to) => from === true ? true : {
				...from,
				...to
			},
			resultToName: evaluatedPropsToName
		}),
		items: makeMergeEvaluated({
			mergeNames: (gen, from, to) => gen.if((0, codegen_1._)`${to} !== true && ${from} !== undefined`, () => gen.assign(to, (0, codegen_1._)`${from} === true ? true : ${to} > ${from} ? ${to} : ${from}`)),
			mergeToName: (gen, from, to) => gen.if((0, codegen_1._)`${to} !== true`, () => gen.assign(to, from === true ? true : (0, codegen_1._)`${to} > ${from} ? ${to} : ${from}`)),
			mergeValues: (from, to) => from === true ? true : Math.max(from, to),
			resultToName: (gen, items) => gen.var("items", items)
		})
	};
	function evaluatedPropsToName(gen, ps) {
		if (ps === true) return gen.var("props", true);
		const props = gen.var("props", (0, codegen_1._)`{}`);
		if (ps !== void 0) setEvaluated(gen, props, ps);
		return props;
	}
	exports.evaluatedPropsToName = evaluatedPropsToName;
	function setEvaluated(gen, props, ps) {
		Object.keys(ps).forEach((p) => gen.assign((0, codegen_1._)`${props}${(0, codegen_1.getProperty)(p)}`, true));
	}
	exports.setEvaluated = setEvaluated;
	var snippets = {};
	function useFunc(gen, f) {
		return gen.scopeValue("func", {
			ref: f,
			code: snippets[f.code] || (snippets[f.code] = new code_1._Code(f.code))
		});
	}
	exports.useFunc = useFunc;
	var Type;
	(function(Type) {
		Type[Type["Num"] = 0] = "Num";
		Type[Type["Str"] = 1] = "Str";
	})(Type || (exports.Type = Type = {}));
	function getErrorPath(dataProp, dataPropType, jsPropertySyntax) {
		if (dataProp instanceof codegen_1.Name) {
			const isNumber = dataPropType === Type.Num;
			return jsPropertySyntax ? isNumber ? (0, codegen_1._)`"[" + ${dataProp} + "]"` : (0, codegen_1._)`"['" + ${dataProp} + "']"` : isNumber ? (0, codegen_1._)`"/" + ${dataProp}` : (0, codegen_1._)`"/" + ${dataProp}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
		}
		return jsPropertySyntax ? (0, codegen_1.getProperty)(dataProp).toString() : "/" + escapeJsonPointer(dataProp);
	}
	exports.getErrorPath = getErrorPath;
	function checkStrictMode(it, msg, mode = it.opts.strictSchema) {
		if (!mode) return;
		msg = `strict mode: ${msg}`;
		if (mode === true) throw new Error(msg);
		it.self.logger.warn(msg);
	}
	exports.checkStrictMode = checkStrictMode;
}));
//#endregion
//#region node_modules/ajv-formats/node_modules/ajv/dist/compile/names.js
var require_names = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var codegen_1 = require_codegen();
	exports.default = {
		data: new codegen_1.Name("data"),
		valCxt: new codegen_1.Name("valCxt"),
		instancePath: new codegen_1.Name("instancePath"),
		parentData: new codegen_1.Name("parentData"),
		parentDataProperty: new codegen_1.Name("parentDataProperty"),
		rootData: new codegen_1.Name("rootData"),
		dynamicAnchors: new codegen_1.Name("dynamicAnchors"),
		vErrors: new codegen_1.Name("vErrors"),
		errors: new codegen_1.Name("errors"),
		this: new codegen_1.Name("this"),
		self: new codegen_1.Name("self"),
		scope: new codegen_1.Name("scope"),
		json: new codegen_1.Name("json"),
		jsonPos: new codegen_1.Name("jsonPos"),
		jsonLen: new codegen_1.Name("jsonLen"),
		jsonPart: new codegen_1.Name("jsonPart")
	};
}));
//#endregion
//#region node_modules/ajv-formats/node_modules/ajv/dist/compile/errors.js
var require_errors = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.extendErrors = exports.resetErrorsCount = exports.reportExtraError = exports.reportError = exports.keyword$DataError = exports.keywordError = void 0;
	var codegen_1 = require_codegen();
	var util_1 = require_util();
	var names_1 = require_names();
	exports.keywordError = { message: ({ keyword }) => (0, codegen_1.str)`must pass "${keyword}" keyword validation` };
	exports.keyword$DataError = { message: ({ keyword, schemaType }) => schemaType ? (0, codegen_1.str)`"${keyword}" keyword must be ${schemaType} ($data)` : (0, codegen_1.str)`"${keyword}" keyword is invalid ($data)` };
	function reportError(cxt, error = exports.keywordError, errorPaths, overrideAllErrors) {
		const { it } = cxt;
		const { gen, compositeRule, allErrors } = it;
		const errObj = errorObjectCode(cxt, error, errorPaths);
		if (overrideAllErrors !== null && overrideAllErrors !== void 0 ? overrideAllErrors : compositeRule || allErrors) addError(gen, errObj);
		else returnErrors(it, (0, codegen_1._)`[${errObj}]`);
	}
	exports.reportError = reportError;
	function reportExtraError(cxt, error = exports.keywordError, errorPaths) {
		const { it } = cxt;
		const { gen, compositeRule, allErrors } = it;
		addError(gen, errorObjectCode(cxt, error, errorPaths));
		if (!(compositeRule || allErrors)) returnErrors(it, names_1.default.vErrors);
	}
	exports.reportExtraError = reportExtraError;
	function resetErrorsCount(gen, errsCount) {
		gen.assign(names_1.default.errors, errsCount);
		gen.if((0, codegen_1._)`${names_1.default.vErrors} !== null`, () => gen.if(errsCount, () => gen.assign((0, codegen_1._)`${names_1.default.vErrors}.length`, errsCount), () => gen.assign(names_1.default.vErrors, null)));
	}
	exports.resetErrorsCount = resetErrorsCount;
	function extendErrors({ gen, keyword, schemaValue, data, errsCount, it }) {
		/* istanbul ignore if */
		if (errsCount === void 0) throw new Error("ajv implementation error");
		const err = gen.name("err");
		gen.forRange("i", errsCount, names_1.default.errors, (i) => {
			gen.const(err, (0, codegen_1._)`${names_1.default.vErrors}[${i}]`);
			gen.if((0, codegen_1._)`${err}.instancePath === undefined`, () => gen.assign((0, codegen_1._)`${err}.instancePath`, (0, codegen_1.strConcat)(names_1.default.instancePath, it.errorPath)));
			gen.assign((0, codegen_1._)`${err}.schemaPath`, (0, codegen_1.str)`${it.errSchemaPath}/${keyword}`);
			if (it.opts.verbose) {
				gen.assign((0, codegen_1._)`${err}.schema`, schemaValue);
				gen.assign((0, codegen_1._)`${err}.data`, data);
			}
		});
	}
	exports.extendErrors = extendErrors;
	function addError(gen, errObj) {
		const err = gen.const("err", errObj);
		gen.if((0, codegen_1._)`${names_1.default.vErrors} === null`, () => gen.assign(names_1.default.vErrors, (0, codegen_1._)`[${err}]`), (0, codegen_1._)`${names_1.default.vErrors}.push(${err})`);
		gen.code((0, codegen_1._)`${names_1.default.errors}++`);
	}
	function returnErrors(it, errs) {
		const { gen, validateName, schemaEnv } = it;
		if (schemaEnv.$async) gen.throw((0, codegen_1._)`new ${it.ValidationError}(${errs})`);
		else {
			gen.assign((0, codegen_1._)`${validateName}.errors`, errs);
			gen.return(false);
		}
	}
	var E = {
		keyword: new codegen_1.Name("keyword"),
		schemaPath: new codegen_1.Name("schemaPath"),
		params: new codegen_1.Name("params"),
		propertyName: new codegen_1.Name("propertyName"),
		message: new codegen_1.Name("message"),
		schema: new codegen_1.Name("schema"),
		parentSchema: new codegen_1.Name("parentSchema")
	};
	function errorObjectCode(cxt, error, errorPaths) {
		const { createErrors } = cxt.it;
		if (createErrors === false) return (0, codegen_1._)`{}`;
		return errorObject(cxt, error, errorPaths);
	}
	function errorObject(cxt, error, errorPaths = {}) {
		const { gen, it } = cxt;
		const keyValues = [errorInstancePath(it, errorPaths), errorSchemaPath(cxt, errorPaths)];
		extraErrorProps(cxt, error, keyValues);
		return gen.object(...keyValues);
	}
	function errorInstancePath({ errorPath }, { instancePath }) {
		const instPath = instancePath ? (0, codegen_1.str)`${errorPath}${(0, util_1.getErrorPath)(instancePath, util_1.Type.Str)}` : errorPath;
		return [names_1.default.instancePath, (0, codegen_1.strConcat)(names_1.default.instancePath, instPath)];
	}
	function errorSchemaPath({ keyword, it: { errSchemaPath } }, { schemaPath, parentSchema }) {
		let schPath = parentSchema ? errSchemaPath : (0, codegen_1.str)`${errSchemaPath}/${keyword}`;
		if (schemaPath) schPath = (0, codegen_1.str)`${schPath}${(0, util_1.getErrorPath)(schemaPath, util_1.Type.Str)}`;
		return [E.schemaPath, schPath];
	}
	function extraErrorProps(cxt, { params, message }, keyValues) {
		const { keyword, data, schemaValue, it } = cxt;
		const { opts, propertyName, topSchemaRef, schemaPath } = it;
		keyValues.push([E.keyword, keyword], [E.params, typeof params == "function" ? params(cxt) : params || (0, codegen_1._)`{}`]);
		if (opts.messages) keyValues.push([E.message, typeof message == "function" ? message(cxt) : message]);
		if (opts.verbose) keyValues.push([E.schema, schemaValue], [E.parentSchema, (0, codegen_1._)`${topSchemaRef}${schemaPath}`], [names_1.default.data, data]);
		if (propertyName) keyValues.push([E.propertyName, propertyName]);
	}
}));
//#endregion
//#region node_modules/ajv-formats/node_modules/ajv/dist/compile/validate/boolSchema.js
var require_boolSchema = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.boolOrEmptySchema = exports.topBoolOrEmptySchema = void 0;
	var errors_1 = require_errors();
	var codegen_1 = require_codegen();
	var names_1 = require_names();
	var boolError = { message: "boolean schema is false" };
	function topBoolOrEmptySchema(it) {
		const { gen, schema, validateName } = it;
		if (schema === false) falseSchemaError(it, false);
		else if (typeof schema == "object" && schema.$async === true) gen.return(names_1.default.data);
		else {
			gen.assign((0, codegen_1._)`${validateName}.errors`, null);
			gen.return(true);
		}
	}
	exports.topBoolOrEmptySchema = topBoolOrEmptySchema;
	function boolOrEmptySchema(it, valid) {
		const { gen, schema } = it;
		if (schema === false) {
			gen.var(valid, false);
			falseSchemaError(it);
		} else gen.var(valid, true);
	}
	exports.boolOrEmptySchema = boolOrEmptySchema;
	function falseSchemaError(it, overrideAllErrors) {
		const { gen, data } = it;
		const cxt = {
			gen,
			keyword: "false schema",
			data,
			schema: false,
			schemaCode: false,
			schemaValue: false,
			params: {},
			it
		};
		(0, errors_1.reportError)(cxt, boolError, void 0, overrideAllErrors);
	}
}));
//#endregion
//#region node_modules/ajv-formats/node_modules/ajv/dist/compile/rules.js
var require_rules = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.getRules = exports.isJSONType = void 0;
	var jsonTypes = /* @__PURE__ */ new Set([
		"string",
		"number",
		"integer",
		"boolean",
		"null",
		"object",
		"array"
	]);
	function isJSONType(x) {
		return typeof x == "string" && jsonTypes.has(x);
	}
	exports.isJSONType = isJSONType;
	function getRules() {
		const groups = {
			number: {
				type: "number",
				rules: []
			},
			string: {
				type: "string",
				rules: []
			},
			array: {
				type: "array",
				rules: []
			},
			object: {
				type: "object",
				rules: []
			}
		};
		return {
			types: {
				...groups,
				integer: true,
				boolean: true,
				null: true
			},
			rules: [
				{ rules: [] },
				groups.number,
				groups.string,
				groups.array,
				groups.object
			],
			post: { rules: [] },
			all: {},
			keywords: {}
		};
	}
	exports.getRules = getRules;
}));
//#endregion
//#region node_modules/ajv-formats/node_modules/ajv/dist/compile/validate/applicability.js
var require_applicability = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.shouldUseRule = exports.shouldUseGroup = exports.schemaHasRulesForType = void 0;
	function schemaHasRulesForType({ schema, self }, type) {
		const group = self.RULES.types[type];
		return group && group !== true && shouldUseGroup(schema, group);
	}
	exports.schemaHasRulesForType = schemaHasRulesForType;
	function shouldUseGroup(schema, group) {
		return group.rules.some((rule) => shouldUseRule(schema, rule));
	}
	exports.shouldUseGroup = shouldUseGroup;
	function shouldUseRule(schema, rule) {
		var _a;
		return schema[rule.keyword] !== void 0 || ((_a = rule.definition.implements) === null || _a === void 0 ? void 0 : _a.some((kwd) => schema[kwd] !== void 0));
	}
	exports.shouldUseRule = shouldUseRule;
}));
//#endregion
//#region node_modules/ajv-formats/node_modules/ajv/dist/compile/validate/dataType.js
var require_dataType = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.reportTypeError = exports.checkDataTypes = exports.checkDataType = exports.coerceAndCheckDataType = exports.getJSONTypes = exports.getSchemaTypes = exports.DataType = void 0;
	var rules_1 = require_rules();
	var applicability_1 = require_applicability();
	var errors_1 = require_errors();
	var codegen_1 = require_codegen();
	var util_1 = require_util();
	var DataType;
	(function(DataType) {
		DataType[DataType["Correct"] = 0] = "Correct";
		DataType[DataType["Wrong"] = 1] = "Wrong";
	})(DataType || (exports.DataType = DataType = {}));
	function getSchemaTypes(schema) {
		const types = getJSONTypes(schema.type);
		if (types.includes("null")) {
			if (schema.nullable === false) throw new Error("type: null contradicts nullable: false");
		} else {
			if (!types.length && schema.nullable !== void 0) throw new Error("\"nullable\" cannot be used without \"type\"");
			if (schema.nullable === true) types.push("null");
		}
		return types;
	}
	exports.getSchemaTypes = getSchemaTypes;
	function getJSONTypes(ts) {
		const types = Array.isArray(ts) ? ts : ts ? [ts] : [];
		if (types.every(rules_1.isJSONType)) return types;
		throw new Error("type must be JSONType or JSONType[]: " + types.join(","));
	}
	exports.getJSONTypes = getJSONTypes;
	function coerceAndCheckDataType(it, types) {
		const { gen, data, opts } = it;
		const coerceTo = coerceToTypes(types, opts.coerceTypes);
		const checkTypes = types.length > 0 && !(coerceTo.length === 0 && types.length === 1 && (0, applicability_1.schemaHasRulesForType)(it, types[0]));
		if (checkTypes) {
			const wrongType = checkDataTypes(types, data, opts.strictNumbers, DataType.Wrong);
			gen.if(wrongType, () => {
				if (coerceTo.length) coerceData(it, types, coerceTo);
				else reportTypeError(it);
			});
		}
		return checkTypes;
	}
	exports.coerceAndCheckDataType = coerceAndCheckDataType;
	var COERCIBLE = /* @__PURE__ */ new Set([
		"string",
		"number",
		"integer",
		"boolean",
		"null"
	]);
	function coerceToTypes(types, coerceTypes) {
		return coerceTypes ? types.filter((t) => COERCIBLE.has(t) || coerceTypes === "array" && t === "array") : [];
	}
	function coerceData(it, types, coerceTo) {
		const { gen, data, opts } = it;
		const dataType = gen.let("dataType", (0, codegen_1._)`typeof ${data}`);
		const coerced = gen.let("coerced", (0, codegen_1._)`undefined`);
		if (opts.coerceTypes === "array") gen.if((0, codegen_1._)`${dataType} == 'object' && Array.isArray(${data}) && ${data}.length == 1`, () => gen.assign(data, (0, codegen_1._)`${data}[0]`).assign(dataType, (0, codegen_1._)`typeof ${data}`).if(checkDataTypes(types, data, opts.strictNumbers), () => gen.assign(coerced, data)));
		gen.if((0, codegen_1._)`${coerced} !== undefined`);
		for (const t of coerceTo) if (COERCIBLE.has(t) || t === "array" && opts.coerceTypes === "array") coerceSpecificType(t);
		gen.else();
		reportTypeError(it);
		gen.endIf();
		gen.if((0, codegen_1._)`${coerced} !== undefined`, () => {
			gen.assign(data, coerced);
			assignParentData(it, coerced);
		});
		function coerceSpecificType(t) {
			switch (t) {
				case "string":
					gen.elseIf((0, codegen_1._)`${dataType} == "number" || ${dataType} == "boolean"`).assign(coerced, (0, codegen_1._)`"" + ${data}`).elseIf((0, codegen_1._)`${data} === null`).assign(coerced, (0, codegen_1._)`""`);
					return;
				case "number":
					gen.elseIf((0, codegen_1._)`${dataType} == "boolean" || ${data} === null
              || (${dataType} == "string" && ${data} && ${data} == +${data})`).assign(coerced, (0, codegen_1._)`+${data}`);
					return;
				case "integer":
					gen.elseIf((0, codegen_1._)`${dataType} === "boolean" || ${data} === null
              || (${dataType} === "string" && ${data} && ${data} == +${data} && !(${data} % 1))`).assign(coerced, (0, codegen_1._)`+${data}`);
					return;
				case "boolean":
					gen.elseIf((0, codegen_1._)`${data} === "false" || ${data} === 0 || ${data} === null`).assign(coerced, false).elseIf((0, codegen_1._)`${data} === "true" || ${data} === 1`).assign(coerced, true);
					return;
				case "null":
					gen.elseIf((0, codegen_1._)`${data} === "" || ${data} === 0 || ${data} === false`);
					gen.assign(coerced, null);
					return;
				case "array": gen.elseIf((0, codegen_1._)`${dataType} === "string" || ${dataType} === "number"
              || ${dataType} === "boolean" || ${data} === null`).assign(coerced, (0, codegen_1._)`[${data}]`);
			}
		}
	}
	function assignParentData({ gen, parentData, parentDataProperty }, expr) {
		gen.if((0, codegen_1._)`${parentData} !== undefined`, () => gen.assign((0, codegen_1._)`${parentData}[${parentDataProperty}]`, expr));
	}
	function checkDataType(dataType, data, strictNums, correct = DataType.Correct) {
		const EQ = correct === DataType.Correct ? codegen_1.operators.EQ : codegen_1.operators.NEQ;
		let cond;
		switch (dataType) {
			case "null": return (0, codegen_1._)`${data} ${EQ} null`;
			case "array":
				cond = (0, codegen_1._)`Array.isArray(${data})`;
				break;
			case "object":
				cond = (0, codegen_1._)`${data} && typeof ${data} == "object" && !Array.isArray(${data})`;
				break;
			case "integer":
				cond = numCond((0, codegen_1._)`!(${data} % 1) && !isNaN(${data})`);
				break;
			case "number":
				cond = numCond();
				break;
			default: return (0, codegen_1._)`typeof ${data} ${EQ} ${dataType}`;
		}
		return correct === DataType.Correct ? cond : (0, codegen_1.not)(cond);
		function numCond(_cond = codegen_1.nil) {
			return (0, codegen_1.and)((0, codegen_1._)`typeof ${data} == "number"`, _cond, strictNums ? (0, codegen_1._)`isFinite(${data})` : codegen_1.nil);
		}
	}
	exports.checkDataType = checkDataType;
	function checkDataTypes(dataTypes, data, strictNums, correct) {
		if (dataTypes.length === 1) return checkDataType(dataTypes[0], data, strictNums, correct);
		let cond;
		const types = (0, util_1.toHash)(dataTypes);
		if (types.array && types.object) {
			const notObj = (0, codegen_1._)`typeof ${data} != "object"`;
			cond = types.null ? notObj : (0, codegen_1._)`!${data} || ${notObj}`;
			delete types.null;
			delete types.array;
			delete types.object;
		} else cond = codegen_1.nil;
		if (types.number) delete types.integer;
		for (const t in types) cond = (0, codegen_1.and)(cond, checkDataType(t, data, strictNums, correct));
		return cond;
	}
	exports.checkDataTypes = checkDataTypes;
	var typeError = {
		message: ({ schema }) => `must be ${schema}`,
		params: ({ schema, schemaValue }) => typeof schema == "string" ? (0, codegen_1._)`{type: ${schema}}` : (0, codegen_1._)`{type: ${schemaValue}}`
	};
	function reportTypeError(it) {
		const cxt = getTypeErrorContext(it);
		(0, errors_1.reportError)(cxt, typeError);
	}
	exports.reportTypeError = reportTypeError;
	function getTypeErrorContext(it) {
		const { gen, data, schema } = it;
		const schemaCode = (0, util_1.schemaRefOrVal)(it, schema, "type");
		return {
			gen,
			keyword: "type",
			data,
			schema: schema.type,
			schemaCode,
			schemaValue: schemaCode,
			parentSchema: schema,
			params: {},
			it
		};
	}
}));
//#endregion
//#region node_modules/ajv-formats/node_modules/ajv/dist/compile/validate/defaults.js
var require_defaults = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.assignDefaults = void 0;
	var codegen_1 = require_codegen();
	var util_1 = require_util();
	function assignDefaults(it, ty) {
		const { properties, items } = it.schema;
		if (ty === "object" && properties) for (const key in properties) assignDefault(it, key, properties[key].default);
		else if (ty === "array" && Array.isArray(items)) items.forEach((sch, i) => assignDefault(it, i, sch.default));
	}
	exports.assignDefaults = assignDefaults;
	function assignDefault(it, prop, defaultValue) {
		const { gen, compositeRule, data, opts } = it;
		if (defaultValue === void 0) return;
		const childData = (0, codegen_1._)`${data}${(0, codegen_1.getProperty)(prop)}`;
		if (compositeRule) {
			(0, util_1.checkStrictMode)(it, `default is ignored for: ${childData}`);
			return;
		}
		let condition = (0, codegen_1._)`${childData} === undefined`;
		if (opts.useDefaults === "empty") condition = (0, codegen_1._)`${condition} || ${childData} === null || ${childData} === ""`;
		gen.if(condition, (0, codegen_1._)`${childData} = ${(0, codegen_1.stringify)(defaultValue)}`);
	}
}));
//#endregion
//#region node_modules/ajv-formats/node_modules/ajv/dist/vocabularies/code.js
var require_code = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.validateUnion = exports.validateArray = exports.usePattern = exports.callValidateCode = exports.schemaProperties = exports.allSchemaProperties = exports.noPropertyInData = exports.propertyInData = exports.isOwnProperty = exports.hasPropFunc = exports.reportMissingProp = exports.checkMissingProp = exports.checkReportMissingProp = void 0;
	var codegen_1 = require_codegen();
	var util_1 = require_util();
	var names_1 = require_names();
	var util_2 = require_util();
	function checkReportMissingProp(cxt, prop) {
		const { gen, data, it } = cxt;
		gen.if(noPropertyInData(gen, data, prop, it.opts.ownProperties), () => {
			cxt.setParams({ missingProperty: (0, codegen_1._)`${prop}` }, true);
			cxt.error();
		});
	}
	exports.checkReportMissingProp = checkReportMissingProp;
	function checkMissingProp({ gen, data, it: { opts } }, properties, missing) {
		return (0, codegen_1.or)(...properties.map((prop) => (0, codegen_1.and)(noPropertyInData(gen, data, prop, opts.ownProperties), (0, codegen_1._)`${missing} = ${prop}`)));
	}
	exports.checkMissingProp = checkMissingProp;
	function reportMissingProp(cxt, missing) {
		cxt.setParams({ missingProperty: missing }, true);
		cxt.error();
	}
	exports.reportMissingProp = reportMissingProp;
	function hasPropFunc(gen) {
		return gen.scopeValue("func", {
			ref: Object.prototype.hasOwnProperty,
			code: (0, codegen_1._)`Object.prototype.hasOwnProperty`
		});
	}
	exports.hasPropFunc = hasPropFunc;
	function isOwnProperty(gen, data, property) {
		return (0, codegen_1._)`${hasPropFunc(gen)}.call(${data}, ${property})`;
	}
	exports.isOwnProperty = isOwnProperty;
	function propertyInData(gen, data, property, ownProperties) {
		const cond = (0, codegen_1._)`${data}${(0, codegen_1.getProperty)(property)} !== undefined`;
		return ownProperties ? (0, codegen_1._)`${cond} && ${isOwnProperty(gen, data, property)}` : cond;
	}
	exports.propertyInData = propertyInData;
	function noPropertyInData(gen, data, property, ownProperties) {
		const cond = (0, codegen_1._)`${data}${(0, codegen_1.getProperty)(property)} === undefined`;
		return ownProperties ? (0, codegen_1.or)(cond, (0, codegen_1.not)(isOwnProperty(gen, data, property))) : cond;
	}
	exports.noPropertyInData = noPropertyInData;
	function allSchemaProperties(schemaMap) {
		return schemaMap ? Object.keys(schemaMap).filter((p) => p !== "__proto__") : [];
	}
	exports.allSchemaProperties = allSchemaProperties;
	function schemaProperties(it, schemaMap) {
		return allSchemaProperties(schemaMap).filter((p) => !(0, util_1.alwaysValidSchema)(it, schemaMap[p]));
	}
	exports.schemaProperties = schemaProperties;
	function callValidateCode({ schemaCode, data, it: { gen, topSchemaRef, schemaPath, errorPath }, it }, func, context, passSchema) {
		const dataAndSchema = passSchema ? (0, codegen_1._)`${schemaCode}, ${data}, ${topSchemaRef}${schemaPath}` : data;
		const valCxt = [
			[names_1.default.instancePath, (0, codegen_1.strConcat)(names_1.default.instancePath, errorPath)],
			[names_1.default.parentData, it.parentData],
			[names_1.default.parentDataProperty, it.parentDataProperty],
			[names_1.default.rootData, names_1.default.rootData]
		];
		if (it.opts.dynamicRef) valCxt.push([names_1.default.dynamicAnchors, names_1.default.dynamicAnchors]);
		const args = (0, codegen_1._)`${dataAndSchema}, ${gen.object(...valCxt)}`;
		return context !== codegen_1.nil ? (0, codegen_1._)`${func}.call(${context}, ${args})` : (0, codegen_1._)`${func}(${args})`;
	}
	exports.callValidateCode = callValidateCode;
	var newRegExp = (0, codegen_1._)`new RegExp`;
	function usePattern({ gen, it: { opts } }, pattern) {
		const u = opts.unicodeRegExp ? "u" : "";
		const { regExp } = opts.code;
		const rx = regExp(pattern, u);
		return gen.scopeValue("pattern", {
			key: rx.toString(),
			ref: rx,
			code: (0, codegen_1._)`${regExp.code === "new RegExp" ? newRegExp : (0, util_2.useFunc)(gen, regExp)}(${pattern}, ${u})`
		});
	}
	exports.usePattern = usePattern;
	function validateArray(cxt) {
		const { gen, data, keyword, it } = cxt;
		const valid = gen.name("valid");
		if (it.allErrors) {
			const validArr = gen.let("valid", true);
			validateItems(() => gen.assign(validArr, false));
			return validArr;
		}
		gen.var(valid, true);
		validateItems(() => gen.break());
		return valid;
		function validateItems(notValid) {
			const len = gen.const("len", (0, codegen_1._)`${data}.length`);
			gen.forRange("i", 0, len, (i) => {
				cxt.subschema({
					keyword,
					dataProp: i,
					dataPropType: util_1.Type.Num
				}, valid);
				gen.if((0, codegen_1.not)(valid), notValid);
			});
		}
	}
	exports.validateArray = validateArray;
	function validateUnion(cxt) {
		const { gen, schema, keyword, it } = cxt;
		/* istanbul ignore if */
		if (!Array.isArray(schema)) throw new Error("ajv implementation error");
		if (schema.some((sch) => (0, util_1.alwaysValidSchema)(it, sch)) && !it.opts.unevaluated) return;
		const valid = gen.let("valid", false);
		const schValid = gen.name("_valid");
		gen.block(() => schema.forEach((_sch, i) => {
			const schCxt = cxt.subschema({
				keyword,
				schemaProp: i,
				compositeRule: true
			}, schValid);
			gen.assign(valid, (0, codegen_1._)`${valid} || ${schValid}`);
			if (!cxt.mergeValidEvaluated(schCxt, schValid)) gen.if((0, codegen_1.not)(valid));
		}));
		cxt.result(valid, () => cxt.reset(), () => cxt.error(true));
	}
	exports.validateUnion = validateUnion;
}));
//#endregion
//#region node_modules/ajv-formats/node_modules/ajv/dist/compile/validate/keyword.js
var require_keyword = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.validateKeywordUsage = exports.validSchemaType = exports.funcKeywordCode = exports.macroKeywordCode = void 0;
	var codegen_1 = require_codegen();
	var names_1 = require_names();
	var code_1 = require_code();
	var errors_1 = require_errors();
	function macroKeywordCode(cxt, def) {
		const { gen, keyword, schema, parentSchema, it } = cxt;
		const macroSchema = def.macro.call(it.self, schema, parentSchema, it);
		const schemaRef = useKeyword(gen, keyword, macroSchema);
		if (it.opts.validateSchema !== false) it.self.validateSchema(macroSchema, true);
		const valid = gen.name("valid");
		cxt.subschema({
			schema: macroSchema,
			schemaPath: codegen_1.nil,
			errSchemaPath: `${it.errSchemaPath}/${keyword}`,
			topSchemaRef: schemaRef,
			compositeRule: true
		}, valid);
		cxt.pass(valid, () => cxt.error(true));
	}
	exports.macroKeywordCode = macroKeywordCode;
	function funcKeywordCode(cxt, def) {
		var _a;
		const { gen, keyword, schema, parentSchema, $data, it } = cxt;
		checkAsyncKeyword(it, def);
		const validateRef = useKeyword(gen, keyword, !$data && def.compile ? def.compile.call(it.self, schema, parentSchema, it) : def.validate);
		const valid = gen.let("valid");
		cxt.block$data(valid, validateKeyword);
		cxt.ok((_a = def.valid) !== null && _a !== void 0 ? _a : valid);
		function validateKeyword() {
			if (def.errors === false) {
				assignValid();
				if (def.modifying) modifyData(cxt);
				reportErrs(() => cxt.error());
			} else {
				const ruleErrs = def.async ? validateAsync() : validateSync();
				if (def.modifying) modifyData(cxt);
				reportErrs(() => addErrs(cxt, ruleErrs));
			}
		}
		function validateAsync() {
			const ruleErrs = gen.let("ruleErrs", null);
			gen.try(() => assignValid((0, codegen_1._)`await `), (e) => gen.assign(valid, false).if((0, codegen_1._)`${e} instanceof ${it.ValidationError}`, () => gen.assign(ruleErrs, (0, codegen_1._)`${e}.errors`), () => gen.throw(e)));
			return ruleErrs;
		}
		function validateSync() {
			const validateErrs = (0, codegen_1._)`${validateRef}.errors`;
			gen.assign(validateErrs, null);
			assignValid(codegen_1.nil);
			return validateErrs;
		}
		function assignValid(_await = def.async ? (0, codegen_1._)`await ` : codegen_1.nil) {
			const passCxt = it.opts.passContext ? names_1.default.this : names_1.default.self;
			const passSchema = !("compile" in def && !$data || def.schema === false);
			gen.assign(valid, (0, codegen_1._)`${_await}${(0, code_1.callValidateCode)(cxt, validateRef, passCxt, passSchema)}`, def.modifying);
		}
		function reportErrs(errors) {
			var _a;
			gen.if((0, codegen_1.not)((_a = def.valid) !== null && _a !== void 0 ? _a : valid), errors);
		}
	}
	exports.funcKeywordCode = funcKeywordCode;
	function modifyData(cxt) {
		const { gen, data, it } = cxt;
		gen.if(it.parentData, () => gen.assign(data, (0, codegen_1._)`${it.parentData}[${it.parentDataProperty}]`));
	}
	function addErrs(cxt, errs) {
		const { gen } = cxt;
		gen.if((0, codegen_1._)`Array.isArray(${errs})`, () => {
			gen.assign(names_1.default.vErrors, (0, codegen_1._)`${names_1.default.vErrors} === null ? ${errs} : ${names_1.default.vErrors}.concat(${errs})`).assign(names_1.default.errors, (0, codegen_1._)`${names_1.default.vErrors}.length`);
			(0, errors_1.extendErrors)(cxt);
		}, () => cxt.error());
	}
	function checkAsyncKeyword({ schemaEnv }, def) {
		if (def.async && !schemaEnv.$async) throw new Error("async keyword in sync schema");
	}
	function useKeyword(gen, keyword, result) {
		if (result === void 0) throw new Error(`keyword "${keyword}" failed to compile`);
		return gen.scopeValue("keyword", typeof result == "function" ? { ref: result } : {
			ref: result,
			code: (0, codegen_1.stringify)(result)
		});
	}
	function validSchemaType(schema, schemaType, allowUndefined = false) {
		return !schemaType.length || schemaType.some((st) => st === "array" ? Array.isArray(schema) : st === "object" ? schema && typeof schema == "object" && !Array.isArray(schema) : typeof schema == st || allowUndefined && typeof schema == "undefined");
	}
	exports.validSchemaType = validSchemaType;
	function validateKeywordUsage({ schema, opts, self, errSchemaPath }, def, keyword) {
		/* istanbul ignore if */
		if (Array.isArray(def.keyword) ? !def.keyword.includes(keyword) : def.keyword !== keyword) throw new Error("ajv implementation error");
		const deps = def.dependencies;
		if (deps === null || deps === void 0 ? void 0 : deps.some((kwd) => !Object.prototype.hasOwnProperty.call(schema, kwd))) throw new Error(`parent schema must have dependencies of ${keyword}: ${deps.join(",")}`);
		if (def.validateSchema) {
			if (!def.validateSchema(schema[keyword])) {
				const msg = `keyword "${keyword}" value is invalid at path "${errSchemaPath}": ` + self.errorsText(def.validateSchema.errors);
				if (opts.validateSchema === "log") self.logger.error(msg);
				else throw new Error(msg);
			}
		}
	}
	exports.validateKeywordUsage = validateKeywordUsage;
}));
//#endregion
//#region node_modules/ajv-formats/node_modules/ajv/dist/compile/validate/subschema.js
var require_subschema = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.extendSubschemaMode = exports.extendSubschemaData = exports.getSubschema = void 0;
	var codegen_1 = require_codegen();
	var util_1 = require_util();
	function getSubschema(it, { keyword, schemaProp, schema, schemaPath, errSchemaPath, topSchemaRef }) {
		if (keyword !== void 0 && schema !== void 0) throw new Error("both \"keyword\" and \"schema\" passed, only one allowed");
		if (keyword !== void 0) {
			const sch = it.schema[keyword];
			return schemaProp === void 0 ? {
				schema: sch,
				schemaPath: (0, codegen_1._)`${it.schemaPath}${(0, codegen_1.getProperty)(keyword)}`,
				errSchemaPath: `${it.errSchemaPath}/${keyword}`
			} : {
				schema: sch[schemaProp],
				schemaPath: (0, codegen_1._)`${it.schemaPath}${(0, codegen_1.getProperty)(keyword)}${(0, codegen_1.getProperty)(schemaProp)}`,
				errSchemaPath: `${it.errSchemaPath}/${keyword}/${(0, util_1.escapeFragment)(schemaProp)}`
			};
		}
		if (schema !== void 0) {
			if (schemaPath === void 0 || errSchemaPath === void 0 || topSchemaRef === void 0) throw new Error("\"schemaPath\", \"errSchemaPath\" and \"topSchemaRef\" are required with \"schema\"");
			return {
				schema,
				schemaPath,
				topSchemaRef,
				errSchemaPath
			};
		}
		throw new Error("either \"keyword\" or \"schema\" must be passed");
	}
	exports.getSubschema = getSubschema;
	function extendSubschemaData(subschema, it, { dataProp, dataPropType: dpType, data, dataTypes, propertyName }) {
		if (data !== void 0 && dataProp !== void 0) throw new Error("both \"data\" and \"dataProp\" passed, only one allowed");
		const { gen } = it;
		if (dataProp !== void 0) {
			const { errorPath, dataPathArr, opts } = it;
			dataContextProps(gen.let("data", (0, codegen_1._)`${it.data}${(0, codegen_1.getProperty)(dataProp)}`, true));
			subschema.errorPath = (0, codegen_1.str)`${errorPath}${(0, util_1.getErrorPath)(dataProp, dpType, opts.jsPropertySyntax)}`;
			subschema.parentDataProperty = (0, codegen_1._)`${dataProp}`;
			subschema.dataPathArr = [...dataPathArr, subschema.parentDataProperty];
		}
		if (data !== void 0) {
			dataContextProps(data instanceof codegen_1.Name ? data : gen.let("data", data, true));
			if (propertyName !== void 0) subschema.propertyName = propertyName;
		}
		if (dataTypes) subschema.dataTypes = dataTypes;
		function dataContextProps(_nextData) {
			subschema.data = _nextData;
			subschema.dataLevel = it.dataLevel + 1;
			subschema.dataTypes = [];
			it.definedProperties = /* @__PURE__ */ new Set();
			subschema.parentData = it.data;
			subschema.dataNames = [...it.dataNames, _nextData];
		}
	}
	exports.extendSubschemaData = extendSubschemaData;
	function extendSubschemaMode(subschema, { jtdDiscriminator, jtdMetadata, compositeRule, createErrors, allErrors }) {
		if (compositeRule !== void 0) subschema.compositeRule = compositeRule;
		if (createErrors !== void 0) subschema.createErrors = createErrors;
		if (allErrors !== void 0) subschema.allErrors = allErrors;
		subschema.jtdDiscriminator = jtdDiscriminator;
		subschema.jtdMetadata = jtdMetadata;
	}
	exports.extendSubschemaMode = extendSubschemaMode;
}));
//#endregion
//#region node_modules/ajv-formats/node_modules/json-schema-traverse/index.js
var require_json_schema_traverse = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var traverse = module.exports = function(schema, opts, cb) {
		if (typeof opts == "function") {
			cb = opts;
			opts = {};
		}
		cb = opts.cb || cb;
		var pre = typeof cb == "function" ? cb : cb.pre || function() {};
		var post = cb.post || function() {};
		_traverse(opts, pre, post, schema, "", schema);
	};
	traverse.keywords = {
		additionalItems: true,
		items: true,
		contains: true,
		additionalProperties: true,
		propertyNames: true,
		not: true,
		if: true,
		then: true,
		else: true
	};
	traverse.arrayKeywords = {
		items: true,
		allOf: true,
		anyOf: true,
		oneOf: true
	};
	traverse.propsKeywords = {
		$defs: true,
		definitions: true,
		properties: true,
		patternProperties: true,
		dependencies: true
	};
	traverse.skipKeywords = {
		default: true,
		enum: true,
		const: true,
		required: true,
		maximum: true,
		minimum: true,
		exclusiveMaximum: true,
		exclusiveMinimum: true,
		multipleOf: true,
		maxLength: true,
		minLength: true,
		pattern: true,
		format: true,
		maxItems: true,
		minItems: true,
		uniqueItems: true,
		maxProperties: true,
		minProperties: true
	};
	function _traverse(opts, pre, post, schema, jsonPtr, rootSchema, parentJsonPtr, parentKeyword, parentSchema, keyIndex) {
		if (schema && typeof schema == "object" && !Array.isArray(schema)) {
			pre(schema, jsonPtr, rootSchema, parentJsonPtr, parentKeyword, parentSchema, keyIndex);
			for (var key in schema) {
				var sch = schema[key];
				if (Array.isArray(sch)) {
					if (key in traverse.arrayKeywords) for (var i = 0; i < sch.length; i++) _traverse(opts, pre, post, sch[i], jsonPtr + "/" + key + "/" + i, rootSchema, jsonPtr, key, schema, i);
				} else if (key in traverse.propsKeywords) {
					if (sch && typeof sch == "object") for (var prop in sch) _traverse(opts, pre, post, sch[prop], jsonPtr + "/" + key + "/" + escapeJsonPtr(prop), rootSchema, jsonPtr, key, schema, prop);
				} else if (key in traverse.keywords || opts.allKeys && !(key in traverse.skipKeywords)) _traverse(opts, pre, post, sch, jsonPtr + "/" + key, rootSchema, jsonPtr, key, schema);
			}
			post(schema, jsonPtr, rootSchema, parentJsonPtr, parentKeyword, parentSchema, keyIndex);
		}
	}
	function escapeJsonPtr(str) {
		return str.replace(/~/g, "~0").replace(/\//g, "~1");
	}
}));
//#endregion
//#region node_modules/ajv-formats/node_modules/ajv/dist/compile/resolve.js
var require_resolve = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.getSchemaRefs = exports.resolveUrl = exports.normalizeId = exports._getFullPath = exports.getFullPath = exports.inlineRef = void 0;
	var util_1 = require_util();
	var equal = require_fast_deep_equal();
	var traverse = require_json_schema_traverse();
	var SIMPLE_INLINED = /* @__PURE__ */ new Set([
		"type",
		"format",
		"pattern",
		"maxLength",
		"minLength",
		"maxProperties",
		"minProperties",
		"maxItems",
		"minItems",
		"maximum",
		"minimum",
		"uniqueItems",
		"multipleOf",
		"required",
		"enum",
		"const"
	]);
	function inlineRef(schema, limit = true) {
		if (typeof schema == "boolean") return true;
		if (limit === true) return !hasRef(schema);
		if (!limit) return false;
		return countKeys(schema) <= limit;
	}
	exports.inlineRef = inlineRef;
	var REF_KEYWORDS = /* @__PURE__ */ new Set([
		"$ref",
		"$recursiveRef",
		"$recursiveAnchor",
		"$dynamicRef",
		"$dynamicAnchor"
	]);
	function hasRef(schema) {
		for (const key in schema) {
			if (REF_KEYWORDS.has(key)) return true;
			const sch = schema[key];
			if (Array.isArray(sch) && sch.some(hasRef)) return true;
			if (typeof sch == "object" && hasRef(sch)) return true;
		}
		return false;
	}
	function countKeys(schema) {
		let count = 0;
		for (const key in schema) {
			if (key === "$ref") return Infinity;
			count++;
			if (SIMPLE_INLINED.has(key)) continue;
			if (typeof schema[key] == "object") (0, util_1.eachItem)(schema[key], (sch) => count += countKeys(sch));
			if (count === Infinity) return Infinity;
		}
		return count;
	}
	function getFullPath(resolver, id = "", normalize) {
		if (normalize !== false) id = normalizeId(id);
		return _getFullPath(resolver, resolver.parse(id));
	}
	exports.getFullPath = getFullPath;
	function _getFullPath(resolver, p) {
		return resolver.serialize(p).split("#")[0] + "#";
	}
	exports._getFullPath = _getFullPath;
	var TRAILING_SLASH_HASH = /#\/?$/;
	function normalizeId(id) {
		return id ? id.replace(TRAILING_SLASH_HASH, "") : "";
	}
	exports.normalizeId = normalizeId;
	function resolveUrl(resolver, baseId, id) {
		id = normalizeId(id);
		return resolver.resolve(baseId, id);
	}
	exports.resolveUrl = resolveUrl;
	var ANCHOR = /^[a-z_][-a-z0-9._]*$/i;
	function getSchemaRefs(schema, baseId) {
		if (typeof schema == "boolean") return {};
		const { schemaId, uriResolver } = this.opts;
		const schId = normalizeId(schema[schemaId] || baseId);
		const baseIds = { "": schId };
		const pathPrefix = getFullPath(uriResolver, schId, false);
		const localRefs = {};
		const schemaRefs = /* @__PURE__ */ new Set();
		traverse(schema, { allKeys: true }, (sch, jsonPtr, _, parentJsonPtr) => {
			if (parentJsonPtr === void 0) return;
			const fullPath = pathPrefix + jsonPtr;
			let innerBaseId = baseIds[parentJsonPtr];
			if (typeof sch[schemaId] == "string") innerBaseId = addRef.call(this, sch[schemaId]);
			addAnchor.call(this, sch.$anchor);
			addAnchor.call(this, sch.$dynamicAnchor);
			baseIds[jsonPtr] = innerBaseId;
			function addRef(ref) {
				const _resolve = this.opts.uriResolver.resolve;
				ref = normalizeId(innerBaseId ? _resolve(innerBaseId, ref) : ref);
				if (schemaRefs.has(ref)) throw ambiguos(ref);
				schemaRefs.add(ref);
				let schOrRef = this.refs[ref];
				if (typeof schOrRef == "string") schOrRef = this.refs[schOrRef];
				if (typeof schOrRef == "object") checkAmbiguosRef(sch, schOrRef.schema, ref);
				else if (ref !== normalizeId(fullPath)) if (ref[0] === "#") {
					checkAmbiguosRef(sch, localRefs[ref], ref);
					localRefs[ref] = sch;
				} else this.refs[ref] = fullPath;
				return ref;
			}
			function addAnchor(anchor) {
				if (typeof anchor == "string") {
					if (!ANCHOR.test(anchor)) throw new Error(`invalid anchor "${anchor}"`);
					addRef.call(this, `#${anchor}`);
				}
			}
		});
		return localRefs;
		function checkAmbiguosRef(sch1, sch2, ref) {
			if (sch2 !== void 0 && !equal(sch1, sch2)) throw ambiguos(ref);
		}
		function ambiguos(ref) {
			return /* @__PURE__ */ new Error(`reference "${ref}" resolves to more than one schema`);
		}
	}
	exports.getSchemaRefs = getSchemaRefs;
}));
//#endregion
//#region node_modules/ajv-formats/node_modules/ajv/dist/compile/validate/index.js
var require_validate = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.getData = exports.KeywordCxt = exports.validateFunctionCode = void 0;
	var boolSchema_1 = require_boolSchema();
	var dataType_1 = require_dataType();
	var applicability_1 = require_applicability();
	var dataType_2 = require_dataType();
	var defaults_1 = require_defaults();
	var keyword_1 = require_keyword();
	var subschema_1 = require_subschema();
	var codegen_1 = require_codegen();
	var names_1 = require_names();
	var resolve_1 = require_resolve();
	var util_1 = require_util();
	var errors_1 = require_errors();
	function validateFunctionCode(it) {
		if (isSchemaObj(it)) {
			checkKeywords(it);
			if (schemaCxtHasRules(it)) {
				topSchemaObjCode(it);
				return;
			}
		}
		validateFunction(it, () => (0, boolSchema_1.topBoolOrEmptySchema)(it));
	}
	exports.validateFunctionCode = validateFunctionCode;
	function validateFunction({ gen, validateName, schema, schemaEnv, opts }, body) {
		if (opts.code.es5) gen.func(validateName, (0, codegen_1._)`${names_1.default.data}, ${names_1.default.valCxt}`, schemaEnv.$async, () => {
			gen.code((0, codegen_1._)`"use strict"; ${funcSourceUrl(schema, opts)}`);
			destructureValCxtES5(gen, opts);
			gen.code(body);
		});
		else gen.func(validateName, (0, codegen_1._)`${names_1.default.data}, ${destructureValCxt(opts)}`, schemaEnv.$async, () => gen.code(funcSourceUrl(schema, opts)).code(body));
	}
	function destructureValCxt(opts) {
		return (0, codegen_1._)`{${names_1.default.instancePath}="", ${names_1.default.parentData}, ${names_1.default.parentDataProperty}, ${names_1.default.rootData}=${names_1.default.data}${opts.dynamicRef ? (0, codegen_1._)`, ${names_1.default.dynamicAnchors}={}` : codegen_1.nil}}={}`;
	}
	function destructureValCxtES5(gen, opts) {
		gen.if(names_1.default.valCxt, () => {
			gen.var(names_1.default.instancePath, (0, codegen_1._)`${names_1.default.valCxt}.${names_1.default.instancePath}`);
			gen.var(names_1.default.parentData, (0, codegen_1._)`${names_1.default.valCxt}.${names_1.default.parentData}`);
			gen.var(names_1.default.parentDataProperty, (0, codegen_1._)`${names_1.default.valCxt}.${names_1.default.parentDataProperty}`);
			gen.var(names_1.default.rootData, (0, codegen_1._)`${names_1.default.valCxt}.${names_1.default.rootData}`);
			if (opts.dynamicRef) gen.var(names_1.default.dynamicAnchors, (0, codegen_1._)`${names_1.default.valCxt}.${names_1.default.dynamicAnchors}`);
		}, () => {
			gen.var(names_1.default.instancePath, (0, codegen_1._)`""`);
			gen.var(names_1.default.parentData, (0, codegen_1._)`undefined`);
			gen.var(names_1.default.parentDataProperty, (0, codegen_1._)`undefined`);
			gen.var(names_1.default.rootData, names_1.default.data);
			if (opts.dynamicRef) gen.var(names_1.default.dynamicAnchors, (0, codegen_1._)`{}`);
		});
	}
	function topSchemaObjCode(it) {
		const { schema, opts, gen } = it;
		validateFunction(it, () => {
			if (opts.$comment && schema.$comment) commentKeyword(it);
			checkNoDefault(it);
			gen.let(names_1.default.vErrors, null);
			gen.let(names_1.default.errors, 0);
			if (opts.unevaluated) resetEvaluated(it);
			typeAndKeywords(it);
			returnResults(it);
		});
	}
	function resetEvaluated(it) {
		const { gen, validateName } = it;
		it.evaluated = gen.const("evaluated", (0, codegen_1._)`${validateName}.evaluated`);
		gen.if((0, codegen_1._)`${it.evaluated}.dynamicProps`, () => gen.assign((0, codegen_1._)`${it.evaluated}.props`, (0, codegen_1._)`undefined`));
		gen.if((0, codegen_1._)`${it.evaluated}.dynamicItems`, () => gen.assign((0, codegen_1._)`${it.evaluated}.items`, (0, codegen_1._)`undefined`));
	}
	function funcSourceUrl(schema, opts) {
		const schId = typeof schema == "object" && schema[opts.schemaId];
		return schId && (opts.code.source || opts.code.process) ? (0, codegen_1._)`/*# sourceURL=${schId} */` : codegen_1.nil;
	}
	function subschemaCode(it, valid) {
		if (isSchemaObj(it)) {
			checkKeywords(it);
			if (schemaCxtHasRules(it)) {
				subSchemaObjCode(it, valid);
				return;
			}
		}
		(0, boolSchema_1.boolOrEmptySchema)(it, valid);
	}
	function schemaCxtHasRules({ schema, self }) {
		if (typeof schema == "boolean") return !schema;
		for (const key in schema) if (self.RULES.all[key]) return true;
		return false;
	}
	function isSchemaObj(it) {
		return typeof it.schema != "boolean";
	}
	function subSchemaObjCode(it, valid) {
		const { schema, gen, opts } = it;
		if (opts.$comment && schema.$comment) commentKeyword(it);
		updateContext(it);
		checkAsyncSchema(it);
		const errsCount = gen.const("_errs", names_1.default.errors);
		typeAndKeywords(it, errsCount);
		gen.var(valid, (0, codegen_1._)`${errsCount} === ${names_1.default.errors}`);
	}
	function checkKeywords(it) {
		(0, util_1.checkUnknownRules)(it);
		checkRefsAndKeywords(it);
	}
	function typeAndKeywords(it, errsCount) {
		if (it.opts.jtd) return schemaKeywords(it, [], false, errsCount);
		const types = (0, dataType_1.getSchemaTypes)(it.schema);
		schemaKeywords(it, types, !(0, dataType_1.coerceAndCheckDataType)(it, types), errsCount);
	}
	function checkRefsAndKeywords(it) {
		const { schema, errSchemaPath, opts, self } = it;
		if (schema.$ref && opts.ignoreKeywordsWithRef && (0, util_1.schemaHasRulesButRef)(schema, self.RULES)) self.logger.warn(`$ref: keywords ignored in schema at path "${errSchemaPath}"`);
	}
	function checkNoDefault(it) {
		const { schema, opts } = it;
		if (schema.default !== void 0 && opts.useDefaults && opts.strictSchema) (0, util_1.checkStrictMode)(it, "default is ignored in the schema root");
	}
	function updateContext(it) {
		const schId = it.schema[it.opts.schemaId];
		if (schId) it.baseId = (0, resolve_1.resolveUrl)(it.opts.uriResolver, it.baseId, schId);
	}
	function checkAsyncSchema(it) {
		if (it.schema.$async && !it.schemaEnv.$async) throw new Error("async schema in sync schema");
	}
	function commentKeyword({ gen, schemaEnv, schema, errSchemaPath, opts }) {
		const msg = schema.$comment;
		if (opts.$comment === true) gen.code((0, codegen_1._)`${names_1.default.self}.logger.log(${msg})`);
		else if (typeof opts.$comment == "function") {
			const schemaPath = (0, codegen_1.str)`${errSchemaPath}/$comment`;
			const rootName = gen.scopeValue("root", { ref: schemaEnv.root });
			gen.code((0, codegen_1._)`${names_1.default.self}.opts.$comment(${msg}, ${schemaPath}, ${rootName}.schema)`);
		}
	}
	function returnResults(it) {
		const { gen, schemaEnv, validateName, ValidationError, opts } = it;
		if (schemaEnv.$async) gen.if((0, codegen_1._)`${names_1.default.errors} === 0`, () => gen.return(names_1.default.data), () => gen.throw((0, codegen_1._)`new ${ValidationError}(${names_1.default.vErrors})`));
		else {
			gen.assign((0, codegen_1._)`${validateName}.errors`, names_1.default.vErrors);
			if (opts.unevaluated) assignEvaluated(it);
			gen.return((0, codegen_1._)`${names_1.default.errors} === 0`);
		}
	}
	function assignEvaluated({ gen, evaluated, props, items }) {
		if (props instanceof codegen_1.Name) gen.assign((0, codegen_1._)`${evaluated}.props`, props);
		if (items instanceof codegen_1.Name) gen.assign((0, codegen_1._)`${evaluated}.items`, items);
	}
	function schemaKeywords(it, types, typeErrors, errsCount) {
		const { gen, schema, data, allErrors, opts, self } = it;
		const { RULES } = self;
		if (schema.$ref && (opts.ignoreKeywordsWithRef || !(0, util_1.schemaHasRulesButRef)(schema, RULES))) {
			gen.block(() => keywordCode(it, "$ref", RULES.all.$ref.definition));
			return;
		}
		if (!opts.jtd) checkStrictTypes(it, types);
		gen.block(() => {
			for (const group of RULES.rules) groupKeywords(group);
			groupKeywords(RULES.post);
		});
		function groupKeywords(group) {
			if (!(0, applicability_1.shouldUseGroup)(schema, group)) return;
			if (group.type) {
				gen.if((0, dataType_2.checkDataType)(group.type, data, opts.strictNumbers));
				iterateKeywords(it, group);
				if (types.length === 1 && types[0] === group.type && typeErrors) {
					gen.else();
					(0, dataType_2.reportTypeError)(it);
				}
				gen.endIf();
			} else iterateKeywords(it, group);
			if (!allErrors) gen.if((0, codegen_1._)`${names_1.default.errors} === ${errsCount || 0}`);
		}
	}
	function iterateKeywords(it, group) {
		const { gen, schema, opts: { useDefaults } } = it;
		if (useDefaults) (0, defaults_1.assignDefaults)(it, group.type);
		gen.block(() => {
			for (const rule of group.rules) if ((0, applicability_1.shouldUseRule)(schema, rule)) keywordCode(it, rule.keyword, rule.definition, group.type);
		});
	}
	function checkStrictTypes(it, types) {
		if (it.schemaEnv.meta || !it.opts.strictTypes) return;
		checkContextTypes(it, types);
		if (!it.opts.allowUnionTypes) checkMultipleTypes(it, types);
		checkKeywordTypes(it, it.dataTypes);
	}
	function checkContextTypes(it, types) {
		if (!types.length) return;
		if (!it.dataTypes.length) {
			it.dataTypes = types;
			return;
		}
		types.forEach((t) => {
			if (!includesType(it.dataTypes, t)) strictTypesError(it, `type "${t}" not allowed by context "${it.dataTypes.join(",")}"`);
		});
		narrowSchemaTypes(it, types);
	}
	function checkMultipleTypes(it, ts) {
		if (ts.length > 1 && !(ts.length === 2 && ts.includes("null"))) strictTypesError(it, "use allowUnionTypes to allow union type keyword");
	}
	function checkKeywordTypes(it, ts) {
		const rules = it.self.RULES.all;
		for (const keyword in rules) {
			const rule = rules[keyword];
			if (typeof rule == "object" && (0, applicability_1.shouldUseRule)(it.schema, rule)) {
				const { type } = rule.definition;
				if (type.length && !type.some((t) => hasApplicableType(ts, t))) strictTypesError(it, `missing type "${type.join(",")}" for keyword "${keyword}"`);
			}
		}
	}
	function hasApplicableType(schTs, kwdT) {
		return schTs.includes(kwdT) || kwdT === "number" && schTs.includes("integer");
	}
	function includesType(ts, t) {
		return ts.includes(t) || t === "integer" && ts.includes("number");
	}
	function narrowSchemaTypes(it, withTypes) {
		const ts = [];
		for (const t of it.dataTypes) if (includesType(withTypes, t)) ts.push(t);
		else if (withTypes.includes("integer") && t === "number") ts.push("integer");
		it.dataTypes = ts;
	}
	function strictTypesError(it, msg) {
		const schemaPath = it.schemaEnv.baseId + it.errSchemaPath;
		msg += ` at "${schemaPath}" (strictTypes)`;
		(0, util_1.checkStrictMode)(it, msg, it.opts.strictTypes);
	}
	var KeywordCxt = class {
		constructor(it, def, keyword) {
			(0, keyword_1.validateKeywordUsage)(it, def, keyword);
			this.gen = it.gen;
			this.allErrors = it.allErrors;
			this.keyword = keyword;
			this.data = it.data;
			this.schema = it.schema[keyword];
			this.$data = def.$data && it.opts.$data && this.schema && this.schema.$data;
			this.schemaValue = (0, util_1.schemaRefOrVal)(it, this.schema, keyword, this.$data);
			this.schemaType = def.schemaType;
			this.parentSchema = it.schema;
			this.params = {};
			this.it = it;
			this.def = def;
			if (this.$data) this.schemaCode = it.gen.const("vSchema", getData(this.$data, it));
			else {
				this.schemaCode = this.schemaValue;
				if (!(0, keyword_1.validSchemaType)(this.schema, def.schemaType, def.allowUndefined)) throw new Error(`${keyword} value must be ${JSON.stringify(def.schemaType)}`);
			}
			if ("code" in def ? def.trackErrors : def.errors !== false) this.errsCount = it.gen.const("_errs", names_1.default.errors);
		}
		result(condition, successAction, failAction) {
			this.failResult((0, codegen_1.not)(condition), successAction, failAction);
		}
		failResult(condition, successAction, failAction) {
			this.gen.if(condition);
			if (failAction) failAction();
			else this.error();
			if (successAction) {
				this.gen.else();
				successAction();
				if (this.allErrors) this.gen.endIf();
			} else if (this.allErrors) this.gen.endIf();
			else this.gen.else();
		}
		pass(condition, failAction) {
			this.failResult((0, codegen_1.not)(condition), void 0, failAction);
		}
		fail(condition) {
			if (condition === void 0) {
				this.error();
				if (!this.allErrors) this.gen.if(false);
				return;
			}
			this.gen.if(condition);
			this.error();
			if (this.allErrors) this.gen.endIf();
			else this.gen.else();
		}
		fail$data(condition) {
			if (!this.$data) return this.fail(condition);
			const { schemaCode } = this;
			this.fail((0, codegen_1._)`${schemaCode} !== undefined && (${(0, codegen_1.or)(this.invalid$data(), condition)})`);
		}
		error(append, errorParams, errorPaths) {
			if (errorParams) {
				this.setParams(errorParams);
				this._error(append, errorPaths);
				this.setParams({});
				return;
			}
			this._error(append, errorPaths);
		}
		_error(append, errorPaths) {
			(append ? errors_1.reportExtraError : errors_1.reportError)(this, this.def.error, errorPaths);
		}
		$dataError() {
			(0, errors_1.reportError)(this, this.def.$dataError || errors_1.keyword$DataError);
		}
		reset() {
			if (this.errsCount === void 0) throw new Error("add \"trackErrors\" to keyword definition");
			(0, errors_1.resetErrorsCount)(this.gen, this.errsCount);
		}
		ok(cond) {
			if (!this.allErrors) this.gen.if(cond);
		}
		setParams(obj, assign) {
			if (assign) Object.assign(this.params, obj);
			else this.params = obj;
		}
		block$data(valid, codeBlock, $dataValid = codegen_1.nil) {
			this.gen.block(() => {
				this.check$data(valid, $dataValid);
				codeBlock();
			});
		}
		check$data(valid = codegen_1.nil, $dataValid = codegen_1.nil) {
			if (!this.$data) return;
			const { gen, schemaCode, schemaType, def } = this;
			gen.if((0, codegen_1.or)((0, codegen_1._)`${schemaCode} === undefined`, $dataValid));
			if (valid !== codegen_1.nil) gen.assign(valid, true);
			if (schemaType.length || def.validateSchema) {
				gen.elseIf(this.invalid$data());
				this.$dataError();
				if (valid !== codegen_1.nil) gen.assign(valid, false);
			}
			gen.else();
		}
		invalid$data() {
			const { gen, schemaCode, schemaType, def, it } = this;
			return (0, codegen_1.or)(wrong$DataType(), invalid$DataSchema());
			function wrong$DataType() {
				if (schemaType.length) {
					/* istanbul ignore if */
					if (!(schemaCode instanceof codegen_1.Name)) throw new Error("ajv implementation error");
					const st = Array.isArray(schemaType) ? schemaType : [schemaType];
					return (0, codegen_1._)`${(0, dataType_2.checkDataTypes)(st, schemaCode, it.opts.strictNumbers, dataType_2.DataType.Wrong)}`;
				}
				return codegen_1.nil;
			}
			function invalid$DataSchema() {
				if (def.validateSchema) {
					const validateSchemaRef = gen.scopeValue("validate$data", { ref: def.validateSchema });
					return (0, codegen_1._)`!${validateSchemaRef}(${schemaCode})`;
				}
				return codegen_1.nil;
			}
		}
		subschema(appl, valid) {
			const subschema = (0, subschema_1.getSubschema)(this.it, appl);
			(0, subschema_1.extendSubschemaData)(subschema, this.it, appl);
			(0, subschema_1.extendSubschemaMode)(subschema, appl);
			const nextContext = {
				...this.it,
				...subschema,
				items: void 0,
				props: void 0
			};
			subschemaCode(nextContext, valid);
			return nextContext;
		}
		mergeEvaluated(schemaCxt, toName) {
			const { it, gen } = this;
			if (!it.opts.unevaluated) return;
			if (it.props !== true && schemaCxt.props !== void 0) it.props = util_1.mergeEvaluated.props(gen, schemaCxt.props, it.props, toName);
			if (it.items !== true && schemaCxt.items !== void 0) it.items = util_1.mergeEvaluated.items(gen, schemaCxt.items, it.items, toName);
		}
		mergeValidEvaluated(schemaCxt, valid) {
			const { it, gen } = this;
			if (it.opts.unevaluated && (it.props !== true || it.items !== true)) {
				gen.if(valid, () => this.mergeEvaluated(schemaCxt, codegen_1.Name));
				return true;
			}
		}
	};
	exports.KeywordCxt = KeywordCxt;
	function keywordCode(it, keyword, def, ruleType) {
		const cxt = new KeywordCxt(it, def, keyword);
		if ("code" in def) def.code(cxt, ruleType);
		else if (cxt.$data && def.validate) (0, keyword_1.funcKeywordCode)(cxt, def);
		else if ("macro" in def) (0, keyword_1.macroKeywordCode)(cxt, def);
		else if (def.compile || def.validate) (0, keyword_1.funcKeywordCode)(cxt, def);
	}
	var JSON_POINTER = /^\/(?:[^~]|~0|~1)*$/;
	var RELATIVE_JSON_POINTER = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
	function getData($data, { dataLevel, dataNames, dataPathArr }) {
		let jsonPointer;
		let data;
		if ($data === "") return names_1.default.rootData;
		if ($data[0] === "/") {
			if (!JSON_POINTER.test($data)) throw new Error(`Invalid JSON-pointer: ${$data}`);
			jsonPointer = $data;
			data = names_1.default.rootData;
		} else {
			const matches = RELATIVE_JSON_POINTER.exec($data);
			if (!matches) throw new Error(`Invalid JSON-pointer: ${$data}`);
			const up = +matches[1];
			jsonPointer = matches[2];
			if (jsonPointer === "#") {
				if (up >= dataLevel) throw new Error(errorMsg("property/index", up));
				return dataPathArr[dataLevel - up];
			}
			if (up > dataLevel) throw new Error(errorMsg("data", up));
			data = dataNames[dataLevel - up];
			if (!jsonPointer) return data;
		}
		let expr = data;
		const segments = jsonPointer.split("/");
		for (const segment of segments) if (segment) {
			data = (0, codegen_1._)`${data}${(0, codegen_1.getProperty)((0, util_1.unescapeJsonPointer)(segment))}`;
			expr = (0, codegen_1._)`${expr} && ${data}`;
		}
		return expr;
		function errorMsg(pointerType, up) {
			return `Cannot access ${pointerType} ${up} levels up, current level is ${dataLevel}`;
		}
	}
	exports.getData = getData;
}));
//#endregion
//#region node_modules/ajv-formats/node_modules/ajv/dist/runtime/validation_error.js
var require_validation_error = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var ValidationError = class extends Error {
		constructor(errors) {
			super("validation failed");
			this.errors = errors;
			this.ajv = this.validation = true;
		}
	};
	exports.default = ValidationError;
}));
//#endregion
//#region node_modules/ajv-formats/node_modules/ajv/dist/compile/ref_error.js
var require_ref_error = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var resolve_1 = require_resolve();
	var MissingRefError = class extends Error {
		constructor(resolver, baseId, ref, msg) {
			super(msg || `can't resolve reference ${ref} from id ${baseId}`);
			this.missingRef = (0, resolve_1.resolveUrl)(resolver, baseId, ref);
			this.missingSchema = (0, resolve_1.normalizeId)((0, resolve_1.getFullPath)(resolver, this.missingRef));
		}
	};
	exports.default = MissingRefError;
}));
//#endregion
//#region node_modules/ajv-formats/node_modules/ajv/dist/compile/index.js
var require_compile = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.resolveSchema = exports.getCompilingSchema = exports.resolveRef = exports.compileSchema = exports.SchemaEnv = void 0;
	var codegen_1 = require_codegen();
	var validation_error_1 = require_validation_error();
	var names_1 = require_names();
	var resolve_1 = require_resolve();
	var util_1 = require_util();
	var validate_1 = require_validate();
	var SchemaEnv = class {
		constructor(env) {
			var _a;
			this.refs = {};
			this.dynamicAnchors = {};
			let schema;
			if (typeof env.schema == "object") schema = env.schema;
			this.schema = env.schema;
			this.schemaId = env.schemaId;
			this.root = env.root || this;
			this.baseId = (_a = env.baseId) !== null && _a !== void 0 ? _a : (0, resolve_1.normalizeId)(schema === null || schema === void 0 ? void 0 : schema[env.schemaId || "$id"]);
			this.schemaPath = env.schemaPath;
			this.localRefs = env.localRefs;
			this.meta = env.meta;
			this.$async = schema === null || schema === void 0 ? void 0 : schema.$async;
			this.refs = {};
		}
	};
	exports.SchemaEnv = SchemaEnv;
	function compileSchema(sch) {
		const _sch = getCompilingSchema.call(this, sch);
		if (_sch) return _sch;
		const rootId = (0, resolve_1.getFullPath)(this.opts.uriResolver, sch.root.baseId);
		const { es5, lines } = this.opts.code;
		const { ownProperties } = this.opts;
		const gen = new codegen_1.CodeGen(this.scope, {
			es5,
			lines,
			ownProperties
		});
		let _ValidationError;
		if (sch.$async) _ValidationError = gen.scopeValue("Error", {
			ref: validation_error_1.default,
			code: (0, codegen_1._)`require("ajv/dist/runtime/validation_error").default`
		});
		const validateName = gen.scopeName("validate");
		sch.validateName = validateName;
		const schemaCxt = {
			gen,
			allErrors: this.opts.allErrors,
			data: names_1.default.data,
			parentData: names_1.default.parentData,
			parentDataProperty: names_1.default.parentDataProperty,
			dataNames: [names_1.default.data],
			dataPathArr: [codegen_1.nil],
			dataLevel: 0,
			dataTypes: [],
			definedProperties: /* @__PURE__ */ new Set(),
			topSchemaRef: gen.scopeValue("schema", this.opts.code.source === true ? {
				ref: sch.schema,
				code: (0, codegen_1.stringify)(sch.schema)
			} : { ref: sch.schema }),
			validateName,
			ValidationError: _ValidationError,
			schema: sch.schema,
			schemaEnv: sch,
			rootId,
			baseId: sch.baseId || rootId,
			schemaPath: codegen_1.nil,
			errSchemaPath: sch.schemaPath || (this.opts.jtd ? "" : "#"),
			errorPath: (0, codegen_1._)`""`,
			opts: this.opts,
			self: this
		};
		let sourceCode;
		try {
			this._compilations.add(sch);
			(0, validate_1.validateFunctionCode)(schemaCxt);
			gen.optimize(this.opts.code.optimize);
			const validateCode = gen.toString();
			sourceCode = `${gen.scopeRefs(names_1.default.scope)}return ${validateCode}`;
			if (this.opts.code.process) sourceCode = this.opts.code.process(sourceCode, sch);
			const validate = new Function(`${names_1.default.self}`, `${names_1.default.scope}`, sourceCode)(this, this.scope.get());
			this.scope.value(validateName, { ref: validate });
			validate.errors = null;
			validate.schema = sch.schema;
			validate.schemaEnv = sch;
			if (sch.$async) validate.$async = true;
			if (this.opts.code.source === true) validate.source = {
				validateName,
				validateCode,
				scopeValues: gen._values
			};
			if (this.opts.unevaluated) {
				const { props, items } = schemaCxt;
				validate.evaluated = {
					props: props instanceof codegen_1.Name ? void 0 : props,
					items: items instanceof codegen_1.Name ? void 0 : items,
					dynamicProps: props instanceof codegen_1.Name,
					dynamicItems: items instanceof codegen_1.Name
				};
				if (validate.source) validate.source.evaluated = (0, codegen_1.stringify)(validate.evaluated);
			}
			sch.validate = validate;
			return sch;
		} catch (e) {
			delete sch.validate;
			delete sch.validateName;
			if (sourceCode) this.logger.error("Error compiling schema, function code:", sourceCode);
			throw e;
		} finally {
			this._compilations.delete(sch);
		}
	}
	exports.compileSchema = compileSchema;
	function resolveRef(root, baseId, ref) {
		var _a;
		ref = (0, resolve_1.resolveUrl)(this.opts.uriResolver, baseId, ref);
		const schOrFunc = root.refs[ref];
		if (schOrFunc) return schOrFunc;
		let _sch = resolve.call(this, root, ref);
		if (_sch === void 0) {
			const schema = (_a = root.localRefs) === null || _a === void 0 ? void 0 : _a[ref];
			const { schemaId } = this.opts;
			if (schema) _sch = new SchemaEnv({
				schema,
				schemaId,
				root,
				baseId
			});
		}
		if (_sch === void 0) return;
		return root.refs[ref] = inlineOrCompile.call(this, _sch);
	}
	exports.resolveRef = resolveRef;
	function inlineOrCompile(sch) {
		if ((0, resolve_1.inlineRef)(sch.schema, this.opts.inlineRefs)) return sch.schema;
		return sch.validate ? sch : compileSchema.call(this, sch);
	}
	function getCompilingSchema(schEnv) {
		for (const sch of this._compilations) if (sameSchemaEnv(sch, schEnv)) return sch;
	}
	exports.getCompilingSchema = getCompilingSchema;
	function sameSchemaEnv(s1, s2) {
		return s1.schema === s2.schema && s1.root === s2.root && s1.baseId === s2.baseId;
	}
	function resolve(root, ref) {
		let sch;
		while (typeof (sch = this.refs[ref]) == "string") ref = sch;
		return sch || this.schemas[ref] || resolveSchema.call(this, root, ref);
	}
	function resolveSchema(root, ref) {
		const p = this.opts.uriResolver.parse(ref);
		const refPath = (0, resolve_1._getFullPath)(this.opts.uriResolver, p);
		let baseId = (0, resolve_1.getFullPath)(this.opts.uriResolver, root.baseId, void 0);
		if (Object.keys(root.schema).length > 0 && refPath === baseId) return getJsonPointer.call(this, p, root);
		const id = (0, resolve_1.normalizeId)(refPath);
		const schOrRef = this.refs[id] || this.schemas[id];
		if (typeof schOrRef == "string") {
			const sch = resolveSchema.call(this, root, schOrRef);
			if (typeof (sch === null || sch === void 0 ? void 0 : sch.schema) !== "object") return;
			return getJsonPointer.call(this, p, sch);
		}
		if (typeof (schOrRef === null || schOrRef === void 0 ? void 0 : schOrRef.schema) !== "object") return;
		if (!schOrRef.validate) compileSchema.call(this, schOrRef);
		if (id === (0, resolve_1.normalizeId)(ref)) {
			const { schema } = schOrRef;
			const { schemaId } = this.opts;
			const schId = schema[schemaId];
			if (schId) baseId = (0, resolve_1.resolveUrl)(this.opts.uriResolver, baseId, schId);
			return new SchemaEnv({
				schema,
				schemaId,
				root,
				baseId
			});
		}
		return getJsonPointer.call(this, p, schOrRef);
	}
	exports.resolveSchema = resolveSchema;
	var PREVENT_SCOPE_CHANGE = /* @__PURE__ */ new Set([
		"properties",
		"patternProperties",
		"enum",
		"dependencies",
		"definitions"
	]);
	function getJsonPointer(parsedRef, { baseId, schema, root }) {
		var _a;
		if (((_a = parsedRef.fragment) === null || _a === void 0 ? void 0 : _a[0]) !== "/") return;
		for (const part of parsedRef.fragment.slice(1).split("/")) {
			if (typeof schema === "boolean") return;
			const partSchema = schema[(0, util_1.unescapeFragment)(part)];
			if (partSchema === void 0) return;
			schema = partSchema;
			const schId = typeof schema === "object" && schema[this.opts.schemaId];
			if (!PREVENT_SCOPE_CHANGE.has(part) && schId) baseId = (0, resolve_1.resolveUrl)(this.opts.uriResolver, baseId, schId);
		}
		let env;
		if (typeof schema != "boolean" && schema.$ref && !(0, util_1.schemaHasRulesButRef)(schema, this.RULES)) {
			const $ref = (0, resolve_1.resolveUrl)(this.opts.uriResolver, baseId, schema.$ref);
			env = resolveSchema.call(this, root, $ref);
		}
		const { schemaId } = this.opts;
		env = env || new SchemaEnv({
			schema,
			schemaId,
			root,
			baseId
		});
		if (env.schema !== env.root.schema) return env;
	}
}));
//#endregion
//#region node_modules/ajv-formats/node_modules/ajv/dist/refs/data.json
var data_exports = /* @__PURE__ */ __exportAll({
	$id: () => $id$1,
	additionalProperties: () => false,
	default: () => data_default,
	description: () => description,
	properties: () => properties$1,
	required: () => required,
	type: () => type$1
}), $id$1, description, type$1, required, properties$1, data_default;
var init_data = __esmMin((() => {
	$id$1 = "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#";
	description = "Meta-schema for $data reference (JSON AnySchema extension proposal)";
	type$1 = "object";
	required = ["$data"];
	properties$1 = { "$data": {
		"type": "string",
		"anyOf": [{ "format": "relative-json-pointer" }, { "format": "json-pointer" }]
	} };
	data_default = {
		$id: $id$1,
		description,
		type: type$1,
		required,
		properties: properties$1,
		additionalProperties: false
	};
}));
//#endregion
//#region node_modules/ajv-formats/node_modules/ajv/dist/runtime/uri.js
var require_uri = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var uri = require_fast_uri();
	uri.code = "require(\"ajv/dist/runtime/uri\").default";
	exports.default = uri;
}));
//#endregion
//#region node_modules/ajv-formats/node_modules/ajv/dist/core.js
var require_core$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.CodeGen = exports.Name = exports.nil = exports.stringify = exports.str = exports._ = exports.KeywordCxt = void 0;
	var validate_1 = require_validate();
	Object.defineProperty(exports, "KeywordCxt", {
		enumerable: true,
		get: function() {
			return validate_1.KeywordCxt;
		}
	});
	var codegen_1 = require_codegen();
	Object.defineProperty(exports, "_", {
		enumerable: true,
		get: function() {
			return codegen_1._;
		}
	});
	Object.defineProperty(exports, "str", {
		enumerable: true,
		get: function() {
			return codegen_1.str;
		}
	});
	Object.defineProperty(exports, "stringify", {
		enumerable: true,
		get: function() {
			return codegen_1.stringify;
		}
	});
	Object.defineProperty(exports, "nil", {
		enumerable: true,
		get: function() {
			return codegen_1.nil;
		}
	});
	Object.defineProperty(exports, "Name", {
		enumerable: true,
		get: function() {
			return codegen_1.Name;
		}
	});
	Object.defineProperty(exports, "CodeGen", {
		enumerable: true,
		get: function() {
			return codegen_1.CodeGen;
		}
	});
	var validation_error_1 = require_validation_error();
	var ref_error_1 = require_ref_error();
	var rules_1 = require_rules();
	var compile_1 = require_compile();
	var codegen_2 = require_codegen();
	var resolve_1 = require_resolve();
	var dataType_1 = require_dataType();
	var util_1 = require_util();
	var $dataRefSchema = (init_data(), __toCommonJS(data_exports).default);
	var uri_1 = require_uri();
	var defaultRegExp = (str, flags) => new RegExp(str, flags);
	defaultRegExp.code = "new RegExp";
	var META_IGNORE_OPTIONS = [
		"removeAdditional",
		"useDefaults",
		"coerceTypes"
	];
	var EXT_SCOPE_NAMES = /* @__PURE__ */ new Set([
		"validate",
		"serialize",
		"parse",
		"wrapper",
		"root",
		"schema",
		"keyword",
		"pattern",
		"formats",
		"validate$data",
		"func",
		"obj",
		"Error"
	]);
	var removedOptions = {
		errorDataPath: "",
		format: "`validateFormats: false` can be used instead.",
		nullable: "\"nullable\" keyword is supported by default.",
		jsonPointers: "Deprecated jsPropertySyntax can be used instead.",
		extendRefs: "Deprecated ignoreKeywordsWithRef can be used instead.",
		missingRefs: "Pass empty schema with $id that should be ignored to ajv.addSchema.",
		processCode: "Use option `code: {process: (code, schemaEnv: object) => string}`",
		sourceCode: "Use option `code: {source: true}`",
		strictDefaults: "It is default now, see option `strict`.",
		strictKeywords: "It is default now, see option `strict`.",
		uniqueItems: "\"uniqueItems\" keyword is always validated.",
		unknownFormats: "Disable strict mode or pass `true` to `ajv.addFormat` (or `formats` option).",
		cache: "Map is used as cache, schema object as key.",
		serialize: "Map is used as cache, schema object as key.",
		ajvErrors: "It is default now."
	};
	var deprecatedOptions = {
		ignoreKeywordsWithRef: "",
		jsPropertySyntax: "",
		unicode: "\"minLength\"/\"maxLength\" account for unicode characters by default."
	};
	var MAX_EXPRESSION = 200;
	function requiredOptions(o) {
		var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0;
		const s = o.strict;
		const _optz = (_a = o.code) === null || _a === void 0 ? void 0 : _a.optimize;
		const optimize = _optz === true || _optz === void 0 ? 1 : _optz || 0;
		const regExp = (_c = (_b = o.code) === null || _b === void 0 ? void 0 : _b.regExp) !== null && _c !== void 0 ? _c : defaultRegExp;
		const uriResolver = (_d = o.uriResolver) !== null && _d !== void 0 ? _d : uri_1.default;
		return {
			strictSchema: (_f = (_e = o.strictSchema) !== null && _e !== void 0 ? _e : s) !== null && _f !== void 0 ? _f : true,
			strictNumbers: (_h = (_g = o.strictNumbers) !== null && _g !== void 0 ? _g : s) !== null && _h !== void 0 ? _h : true,
			strictTypes: (_k = (_j = o.strictTypes) !== null && _j !== void 0 ? _j : s) !== null && _k !== void 0 ? _k : "log",
			strictTuples: (_m = (_l = o.strictTuples) !== null && _l !== void 0 ? _l : s) !== null && _m !== void 0 ? _m : "log",
			strictRequired: (_p = (_o = o.strictRequired) !== null && _o !== void 0 ? _o : s) !== null && _p !== void 0 ? _p : false,
			code: o.code ? {
				...o.code,
				optimize,
				regExp
			} : {
				optimize,
				regExp
			},
			loopRequired: (_q = o.loopRequired) !== null && _q !== void 0 ? _q : MAX_EXPRESSION,
			loopEnum: (_r = o.loopEnum) !== null && _r !== void 0 ? _r : MAX_EXPRESSION,
			meta: (_s = o.meta) !== null && _s !== void 0 ? _s : true,
			messages: (_t = o.messages) !== null && _t !== void 0 ? _t : true,
			inlineRefs: (_u = o.inlineRefs) !== null && _u !== void 0 ? _u : true,
			schemaId: (_v = o.schemaId) !== null && _v !== void 0 ? _v : "$id",
			addUsedSchema: (_w = o.addUsedSchema) !== null && _w !== void 0 ? _w : true,
			validateSchema: (_x = o.validateSchema) !== null && _x !== void 0 ? _x : true,
			validateFormats: (_y = o.validateFormats) !== null && _y !== void 0 ? _y : true,
			unicodeRegExp: (_z = o.unicodeRegExp) !== null && _z !== void 0 ? _z : true,
			int32range: (_0 = o.int32range) !== null && _0 !== void 0 ? _0 : true,
			uriResolver
		};
	}
	var Ajv = class {
		constructor(opts = {}) {
			this.schemas = {};
			this.refs = {};
			this.formats = Object.create(null);
			this._compilations = /* @__PURE__ */ new Set();
			this._loading = {};
			this._cache = /* @__PURE__ */ new Map();
			opts = this.opts = {
				...opts,
				...requiredOptions(opts)
			};
			const { es5, lines } = this.opts.code;
			this.scope = new codegen_2.ValueScope({
				scope: {},
				prefixes: EXT_SCOPE_NAMES,
				es5,
				lines
			});
			this.logger = getLogger(opts.logger);
			const formatOpt = opts.validateFormats;
			opts.validateFormats = false;
			this.RULES = (0, rules_1.getRules)();
			checkOptions.call(this, removedOptions, opts, "NOT SUPPORTED");
			checkOptions.call(this, deprecatedOptions, opts, "DEPRECATED", "warn");
			this._metaOpts = getMetaSchemaOptions.call(this);
			if (opts.formats) addInitialFormats.call(this);
			this._addVocabularies();
			this._addDefaultMetaSchema();
			if (opts.keywords) addInitialKeywords.call(this, opts.keywords);
			if (typeof opts.meta == "object") this.addMetaSchema(opts.meta);
			addInitialSchemas.call(this);
			opts.validateFormats = formatOpt;
		}
		_addVocabularies() {
			this.addKeyword("$async");
		}
		_addDefaultMetaSchema() {
			const { $data, meta, schemaId } = this.opts;
			let _dataRefSchema = $dataRefSchema;
			if (schemaId === "id") {
				_dataRefSchema = { ...$dataRefSchema };
				_dataRefSchema.id = _dataRefSchema.$id;
				delete _dataRefSchema.$id;
			}
			if (meta && $data) this.addMetaSchema(_dataRefSchema, _dataRefSchema[schemaId], false);
		}
		defaultMeta() {
			const { meta, schemaId } = this.opts;
			return this.opts.defaultMeta = typeof meta == "object" ? meta[schemaId] || meta : void 0;
		}
		validate(schemaKeyRef, data) {
			let v;
			if (typeof schemaKeyRef == "string") {
				v = this.getSchema(schemaKeyRef);
				if (!v) throw new Error(`no schema with key or ref "${schemaKeyRef}"`);
			} else v = this.compile(schemaKeyRef);
			const valid = v(data);
			if (!("$async" in v)) this.errors = v.errors;
			return valid;
		}
		compile(schema, _meta) {
			const sch = this._addSchema(schema, _meta);
			return sch.validate || this._compileSchemaEnv(sch);
		}
		compileAsync(schema, meta) {
			if (typeof this.opts.loadSchema != "function") throw new Error("options.loadSchema should be a function");
			const { loadSchema } = this.opts;
			return runCompileAsync.call(this, schema, meta);
			async function runCompileAsync(_schema, _meta) {
				await loadMetaSchema.call(this, _schema.$schema);
				const sch = this._addSchema(_schema, _meta);
				return sch.validate || _compileAsync.call(this, sch);
			}
			async function loadMetaSchema($ref) {
				if ($ref && !this.getSchema($ref)) await runCompileAsync.call(this, { $ref }, true);
			}
			async function _compileAsync(sch) {
				try {
					return this._compileSchemaEnv(sch);
				} catch (e) {
					if (!(e instanceof ref_error_1.default)) throw e;
					checkLoaded.call(this, e);
					await loadMissingSchema.call(this, e.missingSchema);
					return _compileAsync.call(this, sch);
				}
			}
			function checkLoaded({ missingSchema: ref, missingRef }) {
				if (this.refs[ref]) throw new Error(`AnySchema ${ref} is loaded but ${missingRef} cannot be resolved`);
			}
			async function loadMissingSchema(ref) {
				const _schema = await _loadSchema.call(this, ref);
				if (!this.refs[ref]) await loadMetaSchema.call(this, _schema.$schema);
				if (!this.refs[ref]) this.addSchema(_schema, ref, meta);
			}
			async function _loadSchema(ref) {
				const p = this._loading[ref];
				if (p) return p;
				try {
					return await (this._loading[ref] = loadSchema(ref));
				} finally {
					delete this._loading[ref];
				}
			}
		}
		addSchema(schema, key, _meta, _validateSchema = this.opts.validateSchema) {
			if (Array.isArray(schema)) {
				for (const sch of schema) this.addSchema(sch, void 0, _meta, _validateSchema);
				return this;
			}
			let id;
			if (typeof schema === "object") {
				const { schemaId } = this.opts;
				id = schema[schemaId];
				if (id !== void 0 && typeof id != "string") throw new Error(`schema ${schemaId} must be string`);
			}
			key = (0, resolve_1.normalizeId)(key || id);
			this._checkUnique(key);
			this.schemas[key] = this._addSchema(schema, _meta, key, _validateSchema, true);
			return this;
		}
		addMetaSchema(schema, key, _validateSchema = this.opts.validateSchema) {
			this.addSchema(schema, key, true, _validateSchema);
			return this;
		}
		validateSchema(schema, throwOrLogError) {
			if (typeof schema == "boolean") return true;
			let $schema;
			$schema = schema.$schema;
			if ($schema !== void 0 && typeof $schema != "string") throw new Error("$schema must be a string");
			$schema = $schema || this.opts.defaultMeta || this.defaultMeta();
			if (!$schema) {
				this.logger.warn("meta-schema not available");
				this.errors = null;
				return true;
			}
			const valid = this.validate($schema, schema);
			if (!valid && throwOrLogError) {
				const message = "schema is invalid: " + this.errorsText();
				if (this.opts.validateSchema === "log") this.logger.error(message);
				else throw new Error(message);
			}
			return valid;
		}
		getSchema(keyRef) {
			let sch;
			while (typeof (sch = getSchEnv.call(this, keyRef)) == "string") keyRef = sch;
			if (sch === void 0) {
				const { schemaId } = this.opts;
				const root = new compile_1.SchemaEnv({
					schema: {},
					schemaId
				});
				sch = compile_1.resolveSchema.call(this, root, keyRef);
				if (!sch) return;
				this.refs[keyRef] = sch;
			}
			return sch.validate || this._compileSchemaEnv(sch);
		}
		removeSchema(schemaKeyRef) {
			if (schemaKeyRef instanceof RegExp) {
				this._removeAllSchemas(this.schemas, schemaKeyRef);
				this._removeAllSchemas(this.refs, schemaKeyRef);
				return this;
			}
			switch (typeof schemaKeyRef) {
				case "undefined":
					this._removeAllSchemas(this.schemas);
					this._removeAllSchemas(this.refs);
					this._cache.clear();
					return this;
				case "string": {
					const sch = getSchEnv.call(this, schemaKeyRef);
					if (typeof sch == "object") this._cache.delete(sch.schema);
					delete this.schemas[schemaKeyRef];
					delete this.refs[schemaKeyRef];
					return this;
				}
				case "object": {
					const cacheKey = schemaKeyRef;
					this._cache.delete(cacheKey);
					let id = schemaKeyRef[this.opts.schemaId];
					if (id) {
						id = (0, resolve_1.normalizeId)(id);
						delete this.schemas[id];
						delete this.refs[id];
					}
					return this;
				}
				default: throw new Error("ajv.removeSchema: invalid parameter");
			}
		}
		addVocabulary(definitions) {
			for (const def of definitions) this.addKeyword(def);
			return this;
		}
		addKeyword(kwdOrDef, def) {
			let keyword;
			if (typeof kwdOrDef == "string") {
				keyword = kwdOrDef;
				if (typeof def == "object") {
					this.logger.warn("these parameters are deprecated, see docs for addKeyword");
					def.keyword = keyword;
				}
			} else if (typeof kwdOrDef == "object" && def === void 0) {
				def = kwdOrDef;
				keyword = def.keyword;
				if (Array.isArray(keyword) && !keyword.length) throw new Error("addKeywords: keyword must be string or non-empty array");
			} else throw new Error("invalid addKeywords parameters");
			checkKeyword.call(this, keyword, def);
			if (!def) {
				(0, util_1.eachItem)(keyword, (kwd) => addRule.call(this, kwd));
				return this;
			}
			keywordMetaschema.call(this, def);
			const definition = {
				...def,
				type: (0, dataType_1.getJSONTypes)(def.type),
				schemaType: (0, dataType_1.getJSONTypes)(def.schemaType)
			};
			(0, util_1.eachItem)(keyword, definition.type.length === 0 ? (k) => addRule.call(this, k, definition) : (k) => definition.type.forEach((t) => addRule.call(this, k, definition, t)));
			return this;
		}
		getKeyword(keyword) {
			const rule = this.RULES.all[keyword];
			return typeof rule == "object" ? rule.definition : !!rule;
		}
		removeKeyword(keyword) {
			const { RULES } = this;
			delete RULES.keywords[keyword];
			delete RULES.all[keyword];
			for (const group of RULES.rules) {
				const i = group.rules.findIndex((rule) => rule.keyword === keyword);
				if (i >= 0) group.rules.splice(i, 1);
			}
			return this;
		}
		addFormat(name, format) {
			if (typeof format == "string") format = new RegExp(format);
			this.formats[name] = format;
			return this;
		}
		errorsText(errors = this.errors, { separator = ", ", dataVar = "data" } = {}) {
			if (!errors || errors.length === 0) return "No errors";
			return errors.map((e) => `${dataVar}${e.instancePath} ${e.message}`).reduce((text, msg) => text + separator + msg);
		}
		$dataMetaSchema(metaSchema, keywordsJsonPointers) {
			const rules = this.RULES.all;
			metaSchema = JSON.parse(JSON.stringify(metaSchema));
			for (const jsonPointer of keywordsJsonPointers) {
				const segments = jsonPointer.split("/").slice(1);
				let keywords = metaSchema;
				for (const seg of segments) keywords = keywords[seg];
				for (const key in rules) {
					const rule = rules[key];
					if (typeof rule != "object") continue;
					const { $data } = rule.definition;
					const schema = keywords[key];
					if ($data && schema) keywords[key] = schemaOrData(schema);
				}
			}
			return metaSchema;
		}
		_removeAllSchemas(schemas, regex) {
			for (const keyRef in schemas) {
				const sch = schemas[keyRef];
				if (!regex || regex.test(keyRef)) {
					if (typeof sch == "string") delete schemas[keyRef];
					else if (sch && !sch.meta) {
						this._cache.delete(sch.schema);
						delete schemas[keyRef];
					}
				}
			}
		}
		_addSchema(schema, meta, baseId, validateSchema = this.opts.validateSchema, addSchema = this.opts.addUsedSchema) {
			let id;
			const { schemaId } = this.opts;
			if (typeof schema == "object") id = schema[schemaId];
			else if (this.opts.jtd) throw new Error("schema must be object");
			else if (typeof schema != "boolean") throw new Error("schema must be object or boolean");
			let sch = this._cache.get(schema);
			if (sch !== void 0) return sch;
			baseId = (0, resolve_1.normalizeId)(id || baseId);
			const localRefs = resolve_1.getSchemaRefs.call(this, schema, baseId);
			sch = new compile_1.SchemaEnv({
				schema,
				schemaId,
				meta,
				baseId,
				localRefs
			});
			this._cache.set(sch.schema, sch);
			if (addSchema && !baseId.startsWith("#")) {
				if (baseId) this._checkUnique(baseId);
				this.refs[baseId] = sch;
			}
			if (validateSchema) this.validateSchema(schema, true);
			return sch;
		}
		_checkUnique(id) {
			if (this.schemas[id] || this.refs[id]) throw new Error(`schema with key or id "${id}" already exists`);
		}
		_compileSchemaEnv(sch) {
			if (sch.meta) this._compileMetaSchema(sch);
			else compile_1.compileSchema.call(this, sch);
			/* istanbul ignore if */
			if (!sch.validate) throw new Error("ajv implementation error");
			return sch.validate;
		}
		_compileMetaSchema(sch) {
			const currentOpts = this.opts;
			this.opts = this._metaOpts;
			try {
				compile_1.compileSchema.call(this, sch);
			} finally {
				this.opts = currentOpts;
			}
		}
	};
	Ajv.ValidationError = validation_error_1.default;
	Ajv.MissingRefError = ref_error_1.default;
	exports.default = Ajv;
	function checkOptions(checkOpts, options, msg, log = "error") {
		for (const key in checkOpts) {
			const opt = key;
			if (opt in options) this.logger[log](`${msg}: option ${key}. ${checkOpts[opt]}`);
		}
	}
	function getSchEnv(keyRef) {
		keyRef = (0, resolve_1.normalizeId)(keyRef);
		return this.schemas[keyRef] || this.refs[keyRef];
	}
	function addInitialSchemas() {
		const optsSchemas = this.opts.schemas;
		if (!optsSchemas) return;
		if (Array.isArray(optsSchemas)) this.addSchema(optsSchemas);
		else for (const key in optsSchemas) this.addSchema(optsSchemas[key], key);
	}
	function addInitialFormats() {
		for (const name in this.opts.formats) {
			const format = this.opts.formats[name];
			if (format) this.addFormat(name, format);
		}
	}
	function addInitialKeywords(defs) {
		if (Array.isArray(defs)) {
			this.addVocabulary(defs);
			return;
		}
		this.logger.warn("keywords option as map is deprecated, pass array");
		for (const keyword in defs) {
			const def = defs[keyword];
			if (!def.keyword) def.keyword = keyword;
			this.addKeyword(def);
		}
	}
	function getMetaSchemaOptions() {
		const metaOpts = { ...this.opts };
		for (const opt of META_IGNORE_OPTIONS) delete metaOpts[opt];
		return metaOpts;
	}
	var noLogs = {
		log() {},
		warn() {},
		error() {}
	};
	function getLogger(logger) {
		if (logger === false) return noLogs;
		if (logger === void 0) return console;
		if (logger.log && logger.warn && logger.error) return logger;
		throw new Error("logger must implement log, warn and error methods");
	}
	var KEYWORD_NAME = /^[a-z_$][a-z0-9_$:-]*$/i;
	function checkKeyword(keyword, def) {
		const { RULES } = this;
		(0, util_1.eachItem)(keyword, (kwd) => {
			if (RULES.keywords[kwd]) throw new Error(`Keyword ${kwd} is already defined`);
			if (!KEYWORD_NAME.test(kwd)) throw new Error(`Keyword ${kwd} has invalid name`);
		});
		if (!def) return;
		if (def.$data && !("code" in def || "validate" in def)) throw new Error("$data keyword must have \"code\" or \"validate\" function");
	}
	function addRule(keyword, definition, dataType) {
		var _a;
		const post = definition === null || definition === void 0 ? void 0 : definition.post;
		if (dataType && post) throw new Error("keyword with \"post\" flag cannot have \"type\"");
		const { RULES } = this;
		let ruleGroup = post ? RULES.post : RULES.rules.find(({ type: t }) => t === dataType);
		if (!ruleGroup) {
			ruleGroup = {
				type: dataType,
				rules: []
			};
			RULES.rules.push(ruleGroup);
		}
		RULES.keywords[keyword] = true;
		if (!definition) return;
		const rule = {
			keyword,
			definition: {
				...definition,
				type: (0, dataType_1.getJSONTypes)(definition.type),
				schemaType: (0, dataType_1.getJSONTypes)(definition.schemaType)
			}
		};
		if (definition.before) addBeforeRule.call(this, ruleGroup, rule, definition.before);
		else ruleGroup.rules.push(rule);
		RULES.all[keyword] = rule;
		(_a = definition.implements) === null || _a === void 0 || _a.forEach((kwd) => this.addKeyword(kwd));
	}
	function addBeforeRule(ruleGroup, rule, before) {
		const i = ruleGroup.rules.findIndex((_rule) => _rule.keyword === before);
		if (i >= 0) ruleGroup.rules.splice(i, 0, rule);
		else {
			ruleGroup.rules.push(rule);
			this.logger.warn(`rule ${before} is not defined`);
		}
	}
	function keywordMetaschema(def) {
		let { metaSchema } = def;
		if (metaSchema === void 0) return;
		if (def.$data && this.opts.$data) metaSchema = schemaOrData(metaSchema);
		def.validateSchema = this.compile(metaSchema, true);
	}
	var $dataRef = { $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#" };
	function schemaOrData(schema) {
		return { anyOf: [schema, $dataRef] };
	}
}));
//#endregion
//#region node_modules/ajv-formats/node_modules/ajv/dist/vocabularies/core/id.js
var require_id = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = {
		keyword: "id",
		code() {
			throw new Error("NOT SUPPORTED: keyword \"id\", use \"$id\" for schema ID");
		}
	};
}));
//#endregion
//#region node_modules/ajv-formats/node_modules/ajv/dist/vocabularies/core/ref.js
var require_ref = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.callRef = exports.getValidate = void 0;
	var ref_error_1 = require_ref_error();
	var code_1 = require_code();
	var codegen_1 = require_codegen();
	var names_1 = require_names();
	var compile_1 = require_compile();
	var util_1 = require_util();
	var def = {
		keyword: "$ref",
		schemaType: "string",
		code(cxt) {
			const { gen, schema: $ref, it } = cxt;
			const { baseId, schemaEnv: env, validateName, opts, self } = it;
			const { root } = env;
			if (($ref === "#" || $ref === "#/") && baseId === root.baseId) return callRootRef();
			const schOrEnv = compile_1.resolveRef.call(self, root, baseId, $ref);
			if (schOrEnv === void 0) throw new ref_error_1.default(it.opts.uriResolver, baseId, $ref);
			if (schOrEnv instanceof compile_1.SchemaEnv) return callValidate(schOrEnv);
			return inlineRefSchema(schOrEnv);
			function callRootRef() {
				if (env === root) return callRef(cxt, validateName, env, env.$async);
				const rootName = gen.scopeValue("root", { ref: root });
				return callRef(cxt, (0, codegen_1._)`${rootName}.validate`, root, root.$async);
			}
			function callValidate(sch) {
				callRef(cxt, getValidate(cxt, sch), sch, sch.$async);
			}
			function inlineRefSchema(sch) {
				const schName = gen.scopeValue("schema", opts.code.source === true ? {
					ref: sch,
					code: (0, codegen_1.stringify)(sch)
				} : { ref: sch });
				const valid = gen.name("valid");
				const schCxt = cxt.subschema({
					schema: sch,
					dataTypes: [],
					schemaPath: codegen_1.nil,
					topSchemaRef: schName,
					errSchemaPath: $ref
				}, valid);
				cxt.mergeEvaluated(schCxt);
				cxt.ok(valid);
			}
		}
	};
	function getValidate(cxt, sch) {
		const { gen } = cxt;
		return sch.validate ? gen.scopeValue("validate", { ref: sch.validate }) : (0, codegen_1._)`${gen.scopeValue("wrapper", { ref: sch })}.validate`;
	}
	exports.getValidate = getValidate;
	function callRef(cxt, v, sch, $async) {
		const { gen, it } = cxt;
		const { allErrors, schemaEnv: env, opts } = it;
		const passCxt = opts.passContext ? names_1.default.this : codegen_1.nil;
		if ($async) callAsyncRef();
		else callSyncRef();
		function callAsyncRef() {
			if (!env.$async) throw new Error("async schema referenced by sync schema");
			const valid = gen.let("valid");
			gen.try(() => {
				gen.code((0, codegen_1._)`await ${(0, code_1.callValidateCode)(cxt, v, passCxt)}`);
				addEvaluatedFrom(v);
				if (!allErrors) gen.assign(valid, true);
			}, (e) => {
				gen.if((0, codegen_1._)`!(${e} instanceof ${it.ValidationError})`, () => gen.throw(e));
				addErrorsFrom(e);
				if (!allErrors) gen.assign(valid, false);
			});
			cxt.ok(valid);
		}
		function callSyncRef() {
			cxt.result((0, code_1.callValidateCode)(cxt, v, passCxt), () => addEvaluatedFrom(v), () => addErrorsFrom(v));
		}
		function addErrorsFrom(source) {
			const errs = (0, codegen_1._)`${source}.errors`;
			gen.assign(names_1.default.vErrors, (0, codegen_1._)`${names_1.default.vErrors} === null ? ${errs} : ${names_1.default.vErrors}.concat(${errs})`);
			gen.assign(names_1.default.errors, (0, codegen_1._)`${names_1.default.vErrors}.length`);
		}
		function addEvaluatedFrom(source) {
			var _a;
			if (!it.opts.unevaluated) return;
			const schEvaluated = (_a = sch === null || sch === void 0 ? void 0 : sch.validate) === null || _a === void 0 ? void 0 : _a.evaluated;
			if (it.props !== true) if (schEvaluated && !schEvaluated.dynamicProps) {
				if (schEvaluated.props !== void 0) it.props = util_1.mergeEvaluated.props(gen, schEvaluated.props, it.props);
			} else {
				const props = gen.var("props", (0, codegen_1._)`${source}.evaluated.props`);
				it.props = util_1.mergeEvaluated.props(gen, props, it.props, codegen_1.Name);
			}
			if (it.items !== true) if (schEvaluated && !schEvaluated.dynamicItems) {
				if (schEvaluated.items !== void 0) it.items = util_1.mergeEvaluated.items(gen, schEvaluated.items, it.items);
			} else {
				const items = gen.var("items", (0, codegen_1._)`${source}.evaluated.items`);
				it.items = util_1.mergeEvaluated.items(gen, items, it.items, codegen_1.Name);
			}
		}
	}
	exports.callRef = callRef;
	exports.default = def;
}));
//#endregion
//#region node_modules/ajv-formats/node_modules/ajv/dist/vocabularies/core/index.js
var require_core = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var id_1 = require_id();
	var ref_1 = require_ref();
	exports.default = [
		"$schema",
		"$id",
		"$defs",
		"$vocabulary",
		{ keyword: "$comment" },
		"definitions",
		id_1.default,
		ref_1.default
	];
}));
//#endregion
//#region node_modules/ajv-formats/node_modules/ajv/dist/vocabularies/validation/limitNumber.js
var require_limitNumber = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var codegen_1 = require_codegen();
	var ops = codegen_1.operators;
	var KWDs = {
		maximum: {
			okStr: "<=",
			ok: ops.LTE,
			fail: ops.GT
		},
		minimum: {
			okStr: ">=",
			ok: ops.GTE,
			fail: ops.LT
		},
		exclusiveMaximum: {
			okStr: "<",
			ok: ops.LT,
			fail: ops.GTE
		},
		exclusiveMinimum: {
			okStr: ">",
			ok: ops.GT,
			fail: ops.LTE
		}
	};
	exports.default = {
		keyword: Object.keys(KWDs),
		type: "number",
		schemaType: "number",
		$data: true,
		error: {
			message: ({ keyword, schemaCode }) => (0, codegen_1.str)`must be ${KWDs[keyword].okStr} ${schemaCode}`,
			params: ({ keyword, schemaCode }) => (0, codegen_1._)`{comparison: ${KWDs[keyword].okStr}, limit: ${schemaCode}}`
		},
		code(cxt) {
			const { keyword, data, schemaCode } = cxt;
			cxt.fail$data((0, codegen_1._)`${data} ${KWDs[keyword].fail} ${schemaCode} || isNaN(${data})`);
		}
	};
}));
//#endregion
//#region node_modules/ajv-formats/node_modules/ajv/dist/vocabularies/validation/multipleOf.js
var require_multipleOf = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var codegen_1 = require_codegen();
	exports.default = {
		keyword: "multipleOf",
		type: "number",
		schemaType: "number",
		$data: true,
		error: {
			message: ({ schemaCode }) => (0, codegen_1.str)`must be multiple of ${schemaCode}`,
			params: ({ schemaCode }) => (0, codegen_1._)`{multipleOf: ${schemaCode}}`
		},
		code(cxt) {
			const { gen, data, schemaCode, it } = cxt;
			const prec = it.opts.multipleOfPrecision;
			const res = gen.let("res");
			const invalid = prec ? (0, codegen_1._)`Math.abs(Math.round(${res}) - ${res}) > 1e-${prec}` : (0, codegen_1._)`${res} !== parseInt(${res})`;
			cxt.fail$data((0, codegen_1._)`(${schemaCode} === 0 || (${res} = ${data}/${schemaCode}, ${invalid}))`);
		}
	};
}));
//#endregion
//#region node_modules/ajv-formats/node_modules/ajv/dist/runtime/ucs2length.js
var require_ucs2length = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	function ucs2length(str) {
		const len = str.length;
		let length = 0;
		let pos = 0;
		let value;
		while (pos < len) {
			length++;
			value = str.charCodeAt(pos++);
			if (value >= 55296 && value <= 56319 && pos < len) {
				value = str.charCodeAt(pos);
				if ((value & 64512) === 56320) pos++;
			}
		}
		return length;
	}
	exports.default = ucs2length;
	ucs2length.code = "require(\"ajv/dist/runtime/ucs2length\").default";
}));
//#endregion
//#region node_modules/ajv-formats/node_modules/ajv/dist/vocabularies/validation/limitLength.js
var require_limitLength = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var codegen_1 = require_codegen();
	var util_1 = require_util();
	var ucs2length_1 = require_ucs2length();
	exports.default = {
		keyword: ["maxLength", "minLength"],
		type: "string",
		schemaType: "number",
		$data: true,
		error: {
			message({ keyword, schemaCode }) {
				const comp = keyword === "maxLength" ? "more" : "fewer";
				return (0, codegen_1.str)`must NOT have ${comp} than ${schemaCode} characters`;
			},
			params: ({ schemaCode }) => (0, codegen_1._)`{limit: ${schemaCode}}`
		},
		code(cxt) {
			const { keyword, data, schemaCode, it } = cxt;
			const op = keyword === "maxLength" ? codegen_1.operators.GT : codegen_1.operators.LT;
			const len = it.opts.unicode === false ? (0, codegen_1._)`${data}.length` : (0, codegen_1._)`${(0, util_1.useFunc)(cxt.gen, ucs2length_1.default)}(${data})`;
			cxt.fail$data((0, codegen_1._)`${len} ${op} ${schemaCode}`);
		}
	};
}));
//#endregion
//#region node_modules/ajv-formats/node_modules/ajv/dist/vocabularies/validation/pattern.js
var require_pattern = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var code_1 = require_code();
	var util_1 = require_util();
	var codegen_1 = require_codegen();
	exports.default = {
		keyword: "pattern",
		type: "string",
		schemaType: "string",
		$data: true,
		error: {
			message: ({ schemaCode }) => (0, codegen_1.str)`must match pattern "${schemaCode}"`,
			params: ({ schemaCode }) => (0, codegen_1._)`{pattern: ${schemaCode}}`
		},
		code(cxt) {
			const { gen, data, $data, schema, schemaCode, it } = cxt;
			const u = it.opts.unicodeRegExp ? "u" : "";
			if ($data) {
				const { regExp } = it.opts.code;
				const regExpCode = regExp.code === "new RegExp" ? (0, codegen_1._)`new RegExp` : (0, util_1.useFunc)(gen, regExp);
				const valid = gen.let("valid");
				gen.try(() => gen.assign(valid, (0, codegen_1._)`${regExpCode}(${schemaCode}, ${u}).test(${data})`), () => gen.assign(valid, false));
				cxt.fail$data((0, codegen_1._)`!${valid}`);
			} else {
				const regExp = (0, code_1.usePattern)(cxt, schema);
				cxt.fail$data((0, codegen_1._)`!${regExp}.test(${data})`);
			}
		}
	};
}));
//#endregion
//#region node_modules/ajv-formats/node_modules/ajv/dist/vocabularies/validation/limitProperties.js
var require_limitProperties = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var codegen_1 = require_codegen();
	exports.default = {
		keyword: ["maxProperties", "minProperties"],
		type: "object",
		schemaType: "number",
		$data: true,
		error: {
			message({ keyword, schemaCode }) {
				const comp = keyword === "maxProperties" ? "more" : "fewer";
				return (0, codegen_1.str)`must NOT have ${comp} than ${schemaCode} properties`;
			},
			params: ({ schemaCode }) => (0, codegen_1._)`{limit: ${schemaCode}}`
		},
		code(cxt) {
			const { keyword, data, schemaCode } = cxt;
			const op = keyword === "maxProperties" ? codegen_1.operators.GT : codegen_1.operators.LT;
			cxt.fail$data((0, codegen_1._)`Object.keys(${data}).length ${op} ${schemaCode}`);
		}
	};
}));
//#endregion
//#region node_modules/ajv-formats/node_modules/ajv/dist/vocabularies/validation/required.js
var require_required = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var code_1 = require_code();
	var codegen_1 = require_codegen();
	var util_1 = require_util();
	exports.default = {
		keyword: "required",
		type: "object",
		schemaType: "array",
		$data: true,
		error: {
			message: ({ params: { missingProperty } }) => (0, codegen_1.str)`must have required property '${missingProperty}'`,
			params: ({ params: { missingProperty } }) => (0, codegen_1._)`{missingProperty: ${missingProperty}}`
		},
		code(cxt) {
			const { gen, schema, schemaCode, data, $data, it } = cxt;
			const { opts } = it;
			if (!$data && schema.length === 0) return;
			const useLoop = schema.length >= opts.loopRequired;
			if (it.allErrors) allErrorsMode();
			else exitOnErrorMode();
			if (opts.strictRequired) {
				const props = cxt.parentSchema.properties;
				const { definedProperties } = cxt.it;
				for (const requiredKey of schema) if ((props === null || props === void 0 ? void 0 : props[requiredKey]) === void 0 && !definedProperties.has(requiredKey)) {
					const msg = `required property "${requiredKey}" is not defined at "${it.schemaEnv.baseId + it.errSchemaPath}" (strictRequired)`;
					(0, util_1.checkStrictMode)(it, msg, it.opts.strictRequired);
				}
			}
			function allErrorsMode() {
				if (useLoop || $data) cxt.block$data(codegen_1.nil, loopAllRequired);
				else for (const prop of schema) (0, code_1.checkReportMissingProp)(cxt, prop);
			}
			function exitOnErrorMode() {
				const missing = gen.let("missing");
				if (useLoop || $data) {
					const valid = gen.let("valid", true);
					cxt.block$data(valid, () => loopUntilMissing(missing, valid));
					cxt.ok(valid);
				} else {
					gen.if((0, code_1.checkMissingProp)(cxt, schema, missing));
					(0, code_1.reportMissingProp)(cxt, missing);
					gen.else();
				}
			}
			function loopAllRequired() {
				gen.forOf("prop", schemaCode, (prop) => {
					cxt.setParams({ missingProperty: prop });
					gen.if((0, code_1.noPropertyInData)(gen, data, prop, opts.ownProperties), () => cxt.error());
				});
			}
			function loopUntilMissing(missing, valid) {
				cxt.setParams({ missingProperty: missing });
				gen.forOf(missing, schemaCode, () => {
					gen.assign(valid, (0, code_1.propertyInData)(gen, data, missing, opts.ownProperties));
					gen.if((0, codegen_1.not)(valid), () => {
						cxt.error();
						gen.break();
					});
				}, codegen_1.nil);
			}
		}
	};
}));
//#endregion
//#region node_modules/ajv-formats/node_modules/ajv/dist/vocabularies/validation/limitItems.js
var require_limitItems = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var codegen_1 = require_codegen();
	exports.default = {
		keyword: ["maxItems", "minItems"],
		type: "array",
		schemaType: "number",
		$data: true,
		error: {
			message({ keyword, schemaCode }) {
				const comp = keyword === "maxItems" ? "more" : "fewer";
				return (0, codegen_1.str)`must NOT have ${comp} than ${schemaCode} items`;
			},
			params: ({ schemaCode }) => (0, codegen_1._)`{limit: ${schemaCode}}`
		},
		code(cxt) {
			const { keyword, data, schemaCode } = cxt;
			const op = keyword === "maxItems" ? codegen_1.operators.GT : codegen_1.operators.LT;
			cxt.fail$data((0, codegen_1._)`${data}.length ${op} ${schemaCode}`);
		}
	};
}));
//#endregion
//#region node_modules/ajv-formats/node_modules/ajv/dist/runtime/equal.js
var require_equal = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var equal = require_fast_deep_equal();
	equal.code = "require(\"ajv/dist/runtime/equal\").default";
	exports.default = equal;
}));
//#endregion
//#region node_modules/ajv-formats/node_modules/ajv/dist/vocabularies/validation/uniqueItems.js
var require_uniqueItems = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var dataType_1 = require_dataType();
	var codegen_1 = require_codegen();
	var util_1 = require_util();
	var equal_1 = require_equal();
	exports.default = {
		keyword: "uniqueItems",
		type: "array",
		schemaType: "boolean",
		$data: true,
		error: {
			message: ({ params: { i, j } }) => (0, codegen_1.str)`must NOT have duplicate items (items ## ${j} and ${i} are identical)`,
			params: ({ params: { i, j } }) => (0, codegen_1._)`{i: ${i}, j: ${j}}`
		},
		code(cxt) {
			const { gen, data, $data, schema, parentSchema, schemaCode, it } = cxt;
			if (!$data && !schema) return;
			const valid = gen.let("valid");
			const itemTypes = parentSchema.items ? (0, dataType_1.getSchemaTypes)(parentSchema.items) : [];
			cxt.block$data(valid, validateUniqueItems, (0, codegen_1._)`${schemaCode} === false`);
			cxt.ok(valid);
			function validateUniqueItems() {
				const i = gen.let("i", (0, codegen_1._)`${data}.length`);
				const j = gen.let("j");
				cxt.setParams({
					i,
					j
				});
				gen.assign(valid, true);
				gen.if((0, codegen_1._)`${i} > 1`, () => (canOptimize() ? loopN : loopN2)(i, j));
			}
			function canOptimize() {
				return itemTypes.length > 0 && !itemTypes.some((t) => t === "object" || t === "array");
			}
			function loopN(i, j) {
				const item = gen.name("item");
				const wrongType = (0, dataType_1.checkDataTypes)(itemTypes, item, it.opts.strictNumbers, dataType_1.DataType.Wrong);
				const indices = gen.const("indices", (0, codegen_1._)`{}`);
				gen.for((0, codegen_1._)`;${i}--;`, () => {
					gen.let(item, (0, codegen_1._)`${data}[${i}]`);
					gen.if(wrongType, (0, codegen_1._)`continue`);
					if (itemTypes.length > 1) gen.if((0, codegen_1._)`typeof ${item} == "string"`, (0, codegen_1._)`${item} += "_"`);
					gen.if((0, codegen_1._)`typeof ${indices}[${item}] == "number"`, () => {
						gen.assign(j, (0, codegen_1._)`${indices}[${item}]`);
						cxt.error();
						gen.assign(valid, false).break();
					}).code((0, codegen_1._)`${indices}[${item}] = ${i}`);
				});
			}
			function loopN2(i, j) {
				const eql = (0, util_1.useFunc)(gen, equal_1.default);
				const outer = gen.name("outer");
				gen.label(outer).for((0, codegen_1._)`;${i}--;`, () => gen.for((0, codegen_1._)`${j} = ${i}; ${j}--;`, () => gen.if((0, codegen_1._)`${eql}(${data}[${i}], ${data}[${j}])`, () => {
					cxt.error();
					gen.assign(valid, false).break(outer);
				})));
			}
		}
	};
}));
//#endregion
//#region node_modules/ajv-formats/node_modules/ajv/dist/vocabularies/validation/const.js
var require_const = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var codegen_1 = require_codegen();
	var util_1 = require_util();
	var equal_1 = require_equal();
	exports.default = {
		keyword: "const",
		$data: true,
		error: {
			message: "must be equal to constant",
			params: ({ schemaCode }) => (0, codegen_1._)`{allowedValue: ${schemaCode}}`
		},
		code(cxt) {
			const { gen, data, $data, schemaCode, schema } = cxt;
			if ($data || schema && typeof schema == "object") cxt.fail$data((0, codegen_1._)`!${(0, util_1.useFunc)(gen, equal_1.default)}(${data}, ${schemaCode})`);
			else cxt.fail((0, codegen_1._)`${schema} !== ${data}`);
		}
	};
}));
//#endregion
//#region node_modules/ajv-formats/node_modules/ajv/dist/vocabularies/validation/enum.js
var require_enum = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var codegen_1 = require_codegen();
	var util_1 = require_util();
	var equal_1 = require_equal();
	exports.default = {
		keyword: "enum",
		schemaType: "array",
		$data: true,
		error: {
			message: "must be equal to one of the allowed values",
			params: ({ schemaCode }) => (0, codegen_1._)`{allowedValues: ${schemaCode}}`
		},
		code(cxt) {
			const { gen, data, $data, schema, schemaCode, it } = cxt;
			if (!$data && schema.length === 0) throw new Error("enum must have non-empty array");
			const useLoop = schema.length >= it.opts.loopEnum;
			let eql;
			const getEql = () => eql !== null && eql !== void 0 ? eql : eql = (0, util_1.useFunc)(gen, equal_1.default);
			let valid;
			if (useLoop || $data) {
				valid = gen.let("valid");
				cxt.block$data(valid, loopEnum);
			} else {
				/* istanbul ignore if */
				if (!Array.isArray(schema)) throw new Error("ajv implementation error");
				const vSchema = gen.const("vSchema", schemaCode);
				valid = (0, codegen_1.or)(...schema.map((_x, i) => equalCode(vSchema, i)));
			}
			cxt.pass(valid);
			function loopEnum() {
				gen.assign(valid, false);
				gen.forOf("v", schemaCode, (v) => gen.if((0, codegen_1._)`${getEql()}(${data}, ${v})`, () => gen.assign(valid, true).break()));
			}
			function equalCode(vSchema, i) {
				const sch = schema[i];
				return typeof sch === "object" && sch !== null ? (0, codegen_1._)`${getEql()}(${data}, ${vSchema}[${i}])` : (0, codegen_1._)`${data} === ${sch}`;
			}
		}
	};
}));
//#endregion
//#region node_modules/ajv-formats/node_modules/ajv/dist/vocabularies/validation/index.js
var require_validation = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var limitNumber_1 = require_limitNumber();
	var multipleOf_1 = require_multipleOf();
	var limitLength_1 = require_limitLength();
	var pattern_1 = require_pattern();
	var limitProperties_1 = require_limitProperties();
	var required_1 = require_required();
	var limitItems_1 = require_limitItems();
	var uniqueItems_1 = require_uniqueItems();
	var const_1 = require_const();
	var enum_1 = require_enum();
	exports.default = [
		limitNumber_1.default,
		multipleOf_1.default,
		limitLength_1.default,
		pattern_1.default,
		limitProperties_1.default,
		required_1.default,
		limitItems_1.default,
		uniqueItems_1.default,
		{
			keyword: "type",
			schemaType: ["string", "array"]
		},
		{
			keyword: "nullable",
			schemaType: "boolean"
		},
		const_1.default,
		enum_1.default
	];
}));
//#endregion
//#region node_modules/ajv-formats/node_modules/ajv/dist/vocabularies/applicator/additionalItems.js
var require_additionalItems = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.validateAdditionalItems = void 0;
	var codegen_1 = require_codegen();
	var util_1 = require_util();
	var def = {
		keyword: "additionalItems",
		type: "array",
		schemaType: ["boolean", "object"],
		before: "uniqueItems",
		error: {
			message: ({ params: { len } }) => (0, codegen_1.str)`must NOT have more than ${len} items`,
			params: ({ params: { len } }) => (0, codegen_1._)`{limit: ${len}}`
		},
		code(cxt) {
			const { parentSchema, it } = cxt;
			const { items } = parentSchema;
			if (!Array.isArray(items)) {
				(0, util_1.checkStrictMode)(it, "\"additionalItems\" is ignored when \"items\" is not an array of schemas");
				return;
			}
			validateAdditionalItems(cxt, items);
		}
	};
	function validateAdditionalItems(cxt, items) {
		const { gen, schema, data, keyword, it } = cxt;
		it.items = true;
		const len = gen.const("len", (0, codegen_1._)`${data}.length`);
		if (schema === false) {
			cxt.setParams({ len: items.length });
			cxt.pass((0, codegen_1._)`${len} <= ${items.length}`);
		} else if (typeof schema == "object" && !(0, util_1.alwaysValidSchema)(it, schema)) {
			const valid = gen.var("valid", (0, codegen_1._)`${len} <= ${items.length}`);
			gen.if((0, codegen_1.not)(valid), () => validateItems(valid));
			cxt.ok(valid);
		}
		function validateItems(valid) {
			gen.forRange("i", items.length, len, (i) => {
				cxt.subschema({
					keyword,
					dataProp: i,
					dataPropType: util_1.Type.Num
				}, valid);
				if (!it.allErrors) gen.if((0, codegen_1.not)(valid), () => gen.break());
			});
		}
	}
	exports.validateAdditionalItems = validateAdditionalItems;
	exports.default = def;
}));
//#endregion
//#region node_modules/ajv-formats/node_modules/ajv/dist/vocabularies/applicator/items.js
var require_items = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.validateTuple = void 0;
	var codegen_1 = require_codegen();
	var util_1 = require_util();
	var code_1 = require_code();
	var def = {
		keyword: "items",
		type: "array",
		schemaType: [
			"object",
			"array",
			"boolean"
		],
		before: "uniqueItems",
		code(cxt) {
			const { schema, it } = cxt;
			if (Array.isArray(schema)) return validateTuple(cxt, "additionalItems", schema);
			it.items = true;
			if ((0, util_1.alwaysValidSchema)(it, schema)) return;
			cxt.ok((0, code_1.validateArray)(cxt));
		}
	};
	function validateTuple(cxt, extraItems, schArr = cxt.schema) {
		const { gen, parentSchema, data, keyword, it } = cxt;
		checkStrictTuple(parentSchema);
		if (it.opts.unevaluated && schArr.length && it.items !== true) it.items = util_1.mergeEvaluated.items(gen, schArr.length, it.items);
		const valid = gen.name("valid");
		const len = gen.const("len", (0, codegen_1._)`${data}.length`);
		schArr.forEach((sch, i) => {
			if ((0, util_1.alwaysValidSchema)(it, sch)) return;
			gen.if((0, codegen_1._)`${len} > ${i}`, () => cxt.subschema({
				keyword,
				schemaProp: i,
				dataProp: i
			}, valid));
			cxt.ok(valid);
		});
		function checkStrictTuple(sch) {
			const { opts, errSchemaPath } = it;
			const l = schArr.length;
			const fullTuple = l === sch.minItems && (l === sch.maxItems || sch[extraItems] === false);
			if (opts.strictTuples && !fullTuple) {
				const msg = `"${keyword}" is ${l}-tuple, but minItems or maxItems/${extraItems} are not specified or different at path "${errSchemaPath}"`;
				(0, util_1.checkStrictMode)(it, msg, opts.strictTuples);
			}
		}
	}
	exports.validateTuple = validateTuple;
	exports.default = def;
}));
//#endregion
//#region node_modules/ajv-formats/node_modules/ajv/dist/vocabularies/applicator/prefixItems.js
var require_prefixItems = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var items_1 = require_items();
	exports.default = {
		keyword: "prefixItems",
		type: "array",
		schemaType: ["array"],
		before: "uniqueItems",
		code: (cxt) => (0, items_1.validateTuple)(cxt, "items")
	};
}));
//#endregion
//#region node_modules/ajv-formats/node_modules/ajv/dist/vocabularies/applicator/items2020.js
var require_items2020 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var codegen_1 = require_codegen();
	var util_1 = require_util();
	var code_1 = require_code();
	var additionalItems_1 = require_additionalItems();
	exports.default = {
		keyword: "items",
		type: "array",
		schemaType: ["object", "boolean"],
		before: "uniqueItems",
		error: {
			message: ({ params: { len } }) => (0, codegen_1.str)`must NOT have more than ${len} items`,
			params: ({ params: { len } }) => (0, codegen_1._)`{limit: ${len}}`
		},
		code(cxt) {
			const { schema, parentSchema, it } = cxt;
			const { prefixItems } = parentSchema;
			it.items = true;
			if ((0, util_1.alwaysValidSchema)(it, schema)) return;
			if (prefixItems) (0, additionalItems_1.validateAdditionalItems)(cxt, prefixItems);
			else cxt.ok((0, code_1.validateArray)(cxt));
		}
	};
}));
//#endregion
//#region node_modules/ajv-formats/node_modules/ajv/dist/vocabularies/applicator/contains.js
var require_contains = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var codegen_1 = require_codegen();
	var util_1 = require_util();
	exports.default = {
		keyword: "contains",
		type: "array",
		schemaType: ["object", "boolean"],
		before: "uniqueItems",
		trackErrors: true,
		error: {
			message: ({ params: { min, max } }) => max === void 0 ? (0, codegen_1.str)`must contain at least ${min} valid item(s)` : (0, codegen_1.str)`must contain at least ${min} and no more than ${max} valid item(s)`,
			params: ({ params: { min, max } }) => max === void 0 ? (0, codegen_1._)`{minContains: ${min}}` : (0, codegen_1._)`{minContains: ${min}, maxContains: ${max}}`
		},
		code(cxt) {
			const { gen, schema, parentSchema, data, it } = cxt;
			let min;
			let max;
			const { minContains, maxContains } = parentSchema;
			if (it.opts.next) {
				min = minContains === void 0 ? 1 : minContains;
				max = maxContains;
			} else min = 1;
			const len = gen.const("len", (0, codegen_1._)`${data}.length`);
			cxt.setParams({
				min,
				max
			});
			if (max === void 0 && min === 0) {
				(0, util_1.checkStrictMode)(it, `"minContains" == 0 without "maxContains": "contains" keyword ignored`);
				return;
			}
			if (max !== void 0 && min > max) {
				(0, util_1.checkStrictMode)(it, `"minContains" > "maxContains" is always invalid`);
				cxt.fail();
				return;
			}
			if ((0, util_1.alwaysValidSchema)(it, schema)) {
				let cond = (0, codegen_1._)`${len} >= ${min}`;
				if (max !== void 0) cond = (0, codegen_1._)`${cond} && ${len} <= ${max}`;
				cxt.pass(cond);
				return;
			}
			it.items = true;
			const valid = gen.name("valid");
			if (max === void 0 && min === 1) validateItems(valid, () => gen.if(valid, () => gen.break()));
			else if (min === 0) {
				gen.let(valid, true);
				if (max !== void 0) gen.if((0, codegen_1._)`${data}.length > 0`, validateItemsWithCount);
			} else {
				gen.let(valid, false);
				validateItemsWithCount();
			}
			cxt.result(valid, () => cxt.reset());
			function validateItemsWithCount() {
				const schValid = gen.name("_valid");
				const count = gen.let("count", 0);
				validateItems(schValid, () => gen.if(schValid, () => checkLimits(count)));
			}
			function validateItems(_valid, block) {
				gen.forRange("i", 0, len, (i) => {
					cxt.subschema({
						keyword: "contains",
						dataProp: i,
						dataPropType: util_1.Type.Num,
						compositeRule: true
					}, _valid);
					block();
				});
			}
			function checkLimits(count) {
				gen.code((0, codegen_1._)`${count}++`);
				if (max === void 0) gen.if((0, codegen_1._)`${count} >= ${min}`, () => gen.assign(valid, true).break());
				else {
					gen.if((0, codegen_1._)`${count} > ${max}`, () => gen.assign(valid, false).break());
					if (min === 1) gen.assign(valid, true);
					else gen.if((0, codegen_1._)`${count} >= ${min}`, () => gen.assign(valid, true));
				}
			}
		}
	};
}));
//#endregion
//#region node_modules/ajv-formats/node_modules/ajv/dist/vocabularies/applicator/dependencies.js
var require_dependencies = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.validateSchemaDeps = exports.validatePropertyDeps = exports.error = void 0;
	var codegen_1 = require_codegen();
	var util_1 = require_util();
	var code_1 = require_code();
	exports.error = {
		message: ({ params: { property, depsCount, deps } }) => {
			const property_ies = depsCount === 1 ? "property" : "properties";
			return (0, codegen_1.str)`must have ${property_ies} ${deps} when property ${property} is present`;
		},
		params: ({ params: { property, depsCount, deps, missingProperty } }) => (0, codegen_1._)`{property: ${property},
    missingProperty: ${missingProperty},
    depsCount: ${depsCount},
    deps: ${deps}}`
	};
	var def = {
		keyword: "dependencies",
		type: "object",
		schemaType: "object",
		error: exports.error,
		code(cxt) {
			const [propDeps, schDeps] = splitDependencies(cxt);
			validatePropertyDeps(cxt, propDeps);
			validateSchemaDeps(cxt, schDeps);
		}
	};
	function splitDependencies({ schema }) {
		const propertyDeps = {};
		const schemaDeps = {};
		for (const key in schema) {
			if (key === "__proto__") continue;
			const deps = Array.isArray(schema[key]) ? propertyDeps : schemaDeps;
			deps[key] = schema[key];
		}
		return [propertyDeps, schemaDeps];
	}
	function validatePropertyDeps(cxt, propertyDeps = cxt.schema) {
		const { gen, data, it } = cxt;
		if (Object.keys(propertyDeps).length === 0) return;
		const missing = gen.let("missing");
		for (const prop in propertyDeps) {
			const deps = propertyDeps[prop];
			if (deps.length === 0) continue;
			const hasProperty = (0, code_1.propertyInData)(gen, data, prop, it.opts.ownProperties);
			cxt.setParams({
				property: prop,
				depsCount: deps.length,
				deps: deps.join(", ")
			});
			if (it.allErrors) gen.if(hasProperty, () => {
				for (const depProp of deps) (0, code_1.checkReportMissingProp)(cxt, depProp);
			});
			else {
				gen.if((0, codegen_1._)`${hasProperty} && (${(0, code_1.checkMissingProp)(cxt, deps, missing)})`);
				(0, code_1.reportMissingProp)(cxt, missing);
				gen.else();
			}
		}
	}
	exports.validatePropertyDeps = validatePropertyDeps;
	function validateSchemaDeps(cxt, schemaDeps = cxt.schema) {
		const { gen, data, keyword, it } = cxt;
		const valid = gen.name("valid");
		for (const prop in schemaDeps) {
			if ((0, util_1.alwaysValidSchema)(it, schemaDeps[prop])) continue;
			gen.if((0, code_1.propertyInData)(gen, data, prop, it.opts.ownProperties), () => {
				const schCxt = cxt.subschema({
					keyword,
					schemaProp: prop
				}, valid);
				cxt.mergeValidEvaluated(schCxt, valid);
			}, () => gen.var(valid, true));
			cxt.ok(valid);
		}
	}
	exports.validateSchemaDeps = validateSchemaDeps;
	exports.default = def;
}));
//#endregion
//#region node_modules/ajv-formats/node_modules/ajv/dist/vocabularies/applicator/propertyNames.js
var require_propertyNames = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var codegen_1 = require_codegen();
	var util_1 = require_util();
	exports.default = {
		keyword: "propertyNames",
		type: "object",
		schemaType: ["object", "boolean"],
		error: {
			message: "property name must be valid",
			params: ({ params }) => (0, codegen_1._)`{propertyName: ${params.propertyName}}`
		},
		code(cxt) {
			const { gen, schema, data, it } = cxt;
			if ((0, util_1.alwaysValidSchema)(it, schema)) return;
			const valid = gen.name("valid");
			gen.forIn("key", data, (key) => {
				cxt.setParams({ propertyName: key });
				cxt.subschema({
					keyword: "propertyNames",
					data: key,
					dataTypes: ["string"],
					propertyName: key,
					compositeRule: true
				}, valid);
				gen.if((0, codegen_1.not)(valid), () => {
					cxt.error(true);
					if (!it.allErrors) gen.break();
				});
			});
			cxt.ok(valid);
		}
	};
}));
//#endregion
//#region node_modules/ajv-formats/node_modules/ajv/dist/vocabularies/applicator/additionalProperties.js
var require_additionalProperties = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var code_1 = require_code();
	var codegen_1 = require_codegen();
	var names_1 = require_names();
	var util_1 = require_util();
	exports.default = {
		keyword: "additionalProperties",
		type: ["object"],
		schemaType: ["boolean", "object"],
		allowUndefined: true,
		trackErrors: true,
		error: {
			message: "must NOT have additional properties",
			params: ({ params }) => (0, codegen_1._)`{additionalProperty: ${params.additionalProperty}}`
		},
		code(cxt) {
			const { gen, schema, parentSchema, data, errsCount, it } = cxt;
			/* istanbul ignore if */
			if (!errsCount) throw new Error("ajv implementation error");
			const { allErrors, opts } = it;
			it.props = true;
			if (opts.removeAdditional !== "all" && (0, util_1.alwaysValidSchema)(it, schema)) return;
			const props = (0, code_1.allSchemaProperties)(parentSchema.properties);
			const patProps = (0, code_1.allSchemaProperties)(parentSchema.patternProperties);
			checkAdditionalProperties();
			cxt.ok((0, codegen_1._)`${errsCount} === ${names_1.default.errors}`);
			function checkAdditionalProperties() {
				gen.forIn("key", data, (key) => {
					if (!props.length && !patProps.length) additionalPropertyCode(key);
					else gen.if(isAdditional(key), () => additionalPropertyCode(key));
				});
			}
			function isAdditional(key) {
				let definedProp;
				if (props.length > 8) {
					const propsSchema = (0, util_1.schemaRefOrVal)(it, parentSchema.properties, "properties");
					definedProp = (0, code_1.isOwnProperty)(gen, propsSchema, key);
				} else if (props.length) definedProp = (0, codegen_1.or)(...props.map((p) => (0, codegen_1._)`${key} === ${p}`));
				else definedProp = codegen_1.nil;
				if (patProps.length) definedProp = (0, codegen_1.or)(definedProp, ...patProps.map((p) => (0, codegen_1._)`${(0, code_1.usePattern)(cxt, p)}.test(${key})`));
				return (0, codegen_1.not)(definedProp);
			}
			function deleteAdditional(key) {
				gen.code((0, codegen_1._)`delete ${data}[${key}]`);
			}
			function additionalPropertyCode(key) {
				if (opts.removeAdditional === "all" || opts.removeAdditional && schema === false) {
					deleteAdditional(key);
					return;
				}
				if (schema === false) {
					cxt.setParams({ additionalProperty: key });
					cxt.error();
					if (!allErrors) gen.break();
					return;
				}
				if (typeof schema == "object" && !(0, util_1.alwaysValidSchema)(it, schema)) {
					const valid = gen.name("valid");
					if (opts.removeAdditional === "failing") {
						applyAdditionalSchema(key, valid, false);
						gen.if((0, codegen_1.not)(valid), () => {
							cxt.reset();
							deleteAdditional(key);
						});
					} else {
						applyAdditionalSchema(key, valid);
						if (!allErrors) gen.if((0, codegen_1.not)(valid), () => gen.break());
					}
				}
			}
			function applyAdditionalSchema(key, valid, errors) {
				const subschema = {
					keyword: "additionalProperties",
					dataProp: key,
					dataPropType: util_1.Type.Str
				};
				if (errors === false) Object.assign(subschema, {
					compositeRule: true,
					createErrors: false,
					allErrors: false
				});
				cxt.subschema(subschema, valid);
			}
		}
	};
}));
//#endregion
//#region node_modules/ajv-formats/node_modules/ajv/dist/vocabularies/applicator/properties.js
var require_properties = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var validate_1 = require_validate();
	var code_1 = require_code();
	var util_1 = require_util();
	var additionalProperties_1 = require_additionalProperties();
	exports.default = {
		keyword: "properties",
		type: "object",
		schemaType: "object",
		code(cxt) {
			const { gen, schema, parentSchema, data, it } = cxt;
			if (it.opts.removeAdditional === "all" && parentSchema.additionalProperties === void 0) additionalProperties_1.default.code(new validate_1.KeywordCxt(it, additionalProperties_1.default, "additionalProperties"));
			const allProps = (0, code_1.allSchemaProperties)(schema);
			for (const prop of allProps) it.definedProperties.add(prop);
			if (it.opts.unevaluated && allProps.length && it.props !== true) it.props = util_1.mergeEvaluated.props(gen, (0, util_1.toHash)(allProps), it.props);
			const properties = allProps.filter((p) => !(0, util_1.alwaysValidSchema)(it, schema[p]));
			if (properties.length === 0) return;
			const valid = gen.name("valid");
			for (const prop of properties) {
				if (hasDefault(prop)) applyPropertySchema(prop);
				else {
					gen.if((0, code_1.propertyInData)(gen, data, prop, it.opts.ownProperties));
					applyPropertySchema(prop);
					if (!it.allErrors) gen.else().var(valid, true);
					gen.endIf();
				}
				cxt.it.definedProperties.add(prop);
				cxt.ok(valid);
			}
			function hasDefault(prop) {
				return it.opts.useDefaults && !it.compositeRule && schema[prop].default !== void 0;
			}
			function applyPropertySchema(prop) {
				cxt.subschema({
					keyword: "properties",
					schemaProp: prop,
					dataProp: prop
				}, valid);
			}
		}
	};
}));
//#endregion
//#region node_modules/ajv-formats/node_modules/ajv/dist/vocabularies/applicator/patternProperties.js
var require_patternProperties = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var code_1 = require_code();
	var codegen_1 = require_codegen();
	var util_1 = require_util();
	var util_2 = require_util();
	exports.default = {
		keyword: "patternProperties",
		type: "object",
		schemaType: "object",
		code(cxt) {
			const { gen, schema, data, parentSchema, it } = cxt;
			const { opts } = it;
			const patterns = (0, code_1.allSchemaProperties)(schema);
			const alwaysValidPatterns = patterns.filter((p) => (0, util_1.alwaysValidSchema)(it, schema[p]));
			if (patterns.length === 0 || alwaysValidPatterns.length === patterns.length && (!it.opts.unevaluated || it.props === true)) return;
			const checkProperties = opts.strictSchema && !opts.allowMatchingProperties && parentSchema.properties;
			const valid = gen.name("valid");
			if (it.props !== true && !(it.props instanceof codegen_1.Name)) it.props = (0, util_2.evaluatedPropsToName)(gen, it.props);
			const { props } = it;
			validatePatternProperties();
			function validatePatternProperties() {
				for (const pat of patterns) {
					if (checkProperties) checkMatchingProperties(pat);
					if (it.allErrors) validateProperties(pat);
					else {
						gen.var(valid, true);
						validateProperties(pat);
						gen.if(valid);
					}
				}
			}
			function checkMatchingProperties(pat) {
				for (const prop in checkProperties) if (new RegExp(pat).test(prop)) (0, util_1.checkStrictMode)(it, `property ${prop} matches pattern ${pat} (use allowMatchingProperties)`);
			}
			function validateProperties(pat) {
				gen.forIn("key", data, (key) => {
					gen.if((0, codegen_1._)`${(0, code_1.usePattern)(cxt, pat)}.test(${key})`, () => {
						const alwaysValid = alwaysValidPatterns.includes(pat);
						if (!alwaysValid) cxt.subschema({
							keyword: "patternProperties",
							schemaProp: pat,
							dataProp: key,
							dataPropType: util_2.Type.Str
						}, valid);
						if (it.opts.unevaluated && props !== true) gen.assign((0, codegen_1._)`${props}[${key}]`, true);
						else if (!alwaysValid && !it.allErrors) gen.if((0, codegen_1.not)(valid), () => gen.break());
					});
				});
			}
		}
	};
}));
//#endregion
//#region node_modules/ajv-formats/node_modules/ajv/dist/vocabularies/applicator/not.js
var require_not = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var util_1 = require_util();
	exports.default = {
		keyword: "not",
		schemaType: ["object", "boolean"],
		trackErrors: true,
		code(cxt) {
			const { gen, schema, it } = cxt;
			if ((0, util_1.alwaysValidSchema)(it, schema)) {
				cxt.fail();
				return;
			}
			const valid = gen.name("valid");
			cxt.subschema({
				keyword: "not",
				compositeRule: true,
				createErrors: false,
				allErrors: false
			}, valid);
			cxt.failResult(valid, () => cxt.reset(), () => cxt.error());
		},
		error: { message: "must NOT be valid" }
	};
}));
//#endregion
//#region node_modules/ajv-formats/node_modules/ajv/dist/vocabularies/applicator/anyOf.js
var require_anyOf = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = {
		keyword: "anyOf",
		schemaType: "array",
		trackErrors: true,
		code: require_code().validateUnion,
		error: { message: "must match a schema in anyOf" }
	};
}));
//#endregion
//#region node_modules/ajv-formats/node_modules/ajv/dist/vocabularies/applicator/oneOf.js
var require_oneOf = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var codegen_1 = require_codegen();
	var util_1 = require_util();
	exports.default = {
		keyword: "oneOf",
		schemaType: "array",
		trackErrors: true,
		error: {
			message: "must match exactly one schema in oneOf",
			params: ({ params }) => (0, codegen_1._)`{passingSchemas: ${params.passing}}`
		},
		code(cxt) {
			const { gen, schema, parentSchema, it } = cxt;
			/* istanbul ignore if */
			if (!Array.isArray(schema)) throw new Error("ajv implementation error");
			if (it.opts.discriminator && parentSchema.discriminator) return;
			const schArr = schema;
			const valid = gen.let("valid", false);
			const passing = gen.let("passing", null);
			const schValid = gen.name("_valid");
			cxt.setParams({ passing });
			gen.block(validateOneOf);
			cxt.result(valid, () => cxt.reset(), () => cxt.error(true));
			function validateOneOf() {
				schArr.forEach((sch, i) => {
					let schCxt;
					if ((0, util_1.alwaysValidSchema)(it, sch)) gen.var(schValid, true);
					else schCxt = cxt.subschema({
						keyword: "oneOf",
						schemaProp: i,
						compositeRule: true
					}, schValid);
					if (i > 0) gen.if((0, codegen_1._)`${schValid} && ${valid}`).assign(valid, false).assign(passing, (0, codegen_1._)`[${passing}, ${i}]`).else();
					gen.if(schValid, () => {
						gen.assign(valid, true);
						gen.assign(passing, i);
						if (schCxt) cxt.mergeEvaluated(schCxt, codegen_1.Name);
					});
				});
			}
		}
	};
}));
//#endregion
//#region node_modules/ajv-formats/node_modules/ajv/dist/vocabularies/applicator/allOf.js
var require_allOf = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var util_1 = require_util();
	exports.default = {
		keyword: "allOf",
		schemaType: "array",
		code(cxt) {
			const { gen, schema, it } = cxt;
			/* istanbul ignore if */
			if (!Array.isArray(schema)) throw new Error("ajv implementation error");
			const valid = gen.name("valid");
			schema.forEach((sch, i) => {
				if ((0, util_1.alwaysValidSchema)(it, sch)) return;
				const schCxt = cxt.subschema({
					keyword: "allOf",
					schemaProp: i
				}, valid);
				cxt.ok(valid);
				cxt.mergeEvaluated(schCxt);
			});
		}
	};
}));
//#endregion
//#region node_modules/ajv-formats/node_modules/ajv/dist/vocabularies/applicator/if.js
var require_if = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var codegen_1 = require_codegen();
	var util_1 = require_util();
	var def = {
		keyword: "if",
		schemaType: ["object", "boolean"],
		trackErrors: true,
		error: {
			message: ({ params }) => (0, codegen_1.str)`must match "${params.ifClause}" schema`,
			params: ({ params }) => (0, codegen_1._)`{failingKeyword: ${params.ifClause}}`
		},
		code(cxt) {
			const { gen, parentSchema, it } = cxt;
			if (parentSchema.then === void 0 && parentSchema.else === void 0) (0, util_1.checkStrictMode)(it, "\"if\" without \"then\" and \"else\" is ignored");
			const hasThen = hasSchema(it, "then");
			const hasElse = hasSchema(it, "else");
			if (!hasThen && !hasElse) return;
			const valid = gen.let("valid", true);
			const schValid = gen.name("_valid");
			validateIf();
			cxt.reset();
			if (hasThen && hasElse) {
				const ifClause = gen.let("ifClause");
				cxt.setParams({ ifClause });
				gen.if(schValid, validateClause("then", ifClause), validateClause("else", ifClause));
			} else if (hasThen) gen.if(schValid, validateClause("then"));
			else gen.if((0, codegen_1.not)(schValid), validateClause("else"));
			cxt.pass(valid, () => cxt.error(true));
			function validateIf() {
				const schCxt = cxt.subschema({
					keyword: "if",
					compositeRule: true,
					createErrors: false,
					allErrors: false
				}, schValid);
				cxt.mergeEvaluated(schCxt);
			}
			function validateClause(keyword, ifClause) {
				return () => {
					const schCxt = cxt.subschema({ keyword }, schValid);
					gen.assign(valid, schValid);
					cxt.mergeValidEvaluated(schCxt, valid);
					if (ifClause) gen.assign(ifClause, (0, codegen_1._)`${keyword}`);
					else cxt.setParams({ ifClause: keyword });
				};
			}
		}
	};
	function hasSchema(it, keyword) {
		const schema = it.schema[keyword];
		return schema !== void 0 && !(0, util_1.alwaysValidSchema)(it, schema);
	}
	exports.default = def;
}));
//#endregion
//#region node_modules/ajv-formats/node_modules/ajv/dist/vocabularies/applicator/thenElse.js
var require_thenElse = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var util_1 = require_util();
	exports.default = {
		keyword: ["then", "else"],
		schemaType: ["object", "boolean"],
		code({ keyword, parentSchema, it }) {
			if (parentSchema.if === void 0) (0, util_1.checkStrictMode)(it, `"${keyword}" without "if" is ignored`);
		}
	};
}));
//#endregion
//#region node_modules/ajv-formats/node_modules/ajv/dist/vocabularies/applicator/index.js
var require_applicator = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var additionalItems_1 = require_additionalItems();
	var prefixItems_1 = require_prefixItems();
	var items_1 = require_items();
	var items2020_1 = require_items2020();
	var contains_1 = require_contains();
	var dependencies_1 = require_dependencies();
	var propertyNames_1 = require_propertyNames();
	var additionalProperties_1 = require_additionalProperties();
	var properties_1 = require_properties();
	var patternProperties_1 = require_patternProperties();
	var not_1 = require_not();
	var anyOf_1 = require_anyOf();
	var oneOf_1 = require_oneOf();
	var allOf_1 = require_allOf();
	var if_1 = require_if();
	var thenElse_1 = require_thenElse();
	function getApplicator(draft2020 = false) {
		const applicator = [
			not_1.default,
			anyOf_1.default,
			oneOf_1.default,
			allOf_1.default,
			if_1.default,
			thenElse_1.default,
			propertyNames_1.default,
			additionalProperties_1.default,
			dependencies_1.default,
			properties_1.default,
			patternProperties_1.default
		];
		if (draft2020) applicator.push(prefixItems_1.default, items2020_1.default);
		else applicator.push(additionalItems_1.default, items_1.default);
		applicator.push(contains_1.default);
		return applicator;
	}
	exports.default = getApplicator;
}));
//#endregion
//#region node_modules/ajv-formats/node_modules/ajv/dist/vocabularies/format/format.js
var require_format$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var codegen_1 = require_codegen();
	exports.default = {
		keyword: "format",
		type: ["number", "string"],
		schemaType: "string",
		$data: true,
		error: {
			message: ({ schemaCode }) => (0, codegen_1.str)`must match format "${schemaCode}"`,
			params: ({ schemaCode }) => (0, codegen_1._)`{format: ${schemaCode}}`
		},
		code(cxt, ruleType) {
			const { gen, data, $data, schema, schemaCode, it } = cxt;
			const { opts, errSchemaPath, schemaEnv, self } = it;
			if (!opts.validateFormats) return;
			if ($data) validate$DataFormat();
			else validateFormat();
			function validate$DataFormat() {
				const fmts = gen.scopeValue("formats", {
					ref: self.formats,
					code: opts.code.formats
				});
				const fDef = gen.const("fDef", (0, codegen_1._)`${fmts}[${schemaCode}]`);
				const fType = gen.let("fType");
				const format = gen.let("format");
				gen.if((0, codegen_1._)`typeof ${fDef} == "object" && !(${fDef} instanceof RegExp)`, () => gen.assign(fType, (0, codegen_1._)`${fDef}.type || "string"`).assign(format, (0, codegen_1._)`${fDef}.validate`), () => gen.assign(fType, (0, codegen_1._)`"string"`).assign(format, fDef));
				cxt.fail$data((0, codegen_1.or)(unknownFmt(), invalidFmt()));
				function unknownFmt() {
					if (opts.strictSchema === false) return codegen_1.nil;
					return (0, codegen_1._)`${schemaCode} && !${format}`;
				}
				function invalidFmt() {
					const callFormat = schemaEnv.$async ? (0, codegen_1._)`(${fDef}.async ? await ${format}(${data}) : ${format}(${data}))` : (0, codegen_1._)`${format}(${data})`;
					const validData = (0, codegen_1._)`(typeof ${format} == "function" ? ${callFormat} : ${format}.test(${data}))`;
					return (0, codegen_1._)`${format} && ${format} !== true && ${fType} === ${ruleType} && !${validData}`;
				}
			}
			function validateFormat() {
				const formatDef = self.formats[schema];
				if (!formatDef) {
					unknownFormat();
					return;
				}
				if (formatDef === true) return;
				const [fmtType, format, fmtRef] = getFormat(formatDef);
				if (fmtType === ruleType) cxt.pass(validCondition());
				function unknownFormat() {
					if (opts.strictSchema === false) {
						self.logger.warn(unknownMsg());
						return;
					}
					throw new Error(unknownMsg());
					function unknownMsg() {
						return `unknown format "${schema}" ignored in schema at path "${errSchemaPath}"`;
					}
				}
				function getFormat(fmtDef) {
					const code = fmtDef instanceof RegExp ? (0, codegen_1.regexpCode)(fmtDef) : opts.code.formats ? (0, codegen_1._)`${opts.code.formats}${(0, codegen_1.getProperty)(schema)}` : void 0;
					const fmt = gen.scopeValue("formats", {
						key: schema,
						ref: fmtDef,
						code
					});
					if (typeof fmtDef == "object" && !(fmtDef instanceof RegExp)) return [
						fmtDef.type || "string",
						fmtDef.validate,
						(0, codegen_1._)`${fmt}.validate`
					];
					return [
						"string",
						fmtDef,
						fmt
					];
				}
				function validCondition() {
					if (typeof formatDef == "object" && !(formatDef instanceof RegExp) && formatDef.async) {
						if (!schemaEnv.$async) throw new Error("async format in sync schema");
						return (0, codegen_1._)`await ${fmtRef}(${data})`;
					}
					return typeof format == "function" ? (0, codegen_1._)`${fmtRef}(${data})` : (0, codegen_1._)`${fmtRef}.test(${data})`;
				}
			}
		}
	};
}));
//#endregion
//#region node_modules/ajv-formats/node_modules/ajv/dist/vocabularies/format/index.js
var require_format = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = [require_format$1().default];
}));
//#endregion
//#region node_modules/ajv-formats/node_modules/ajv/dist/vocabularies/metadata.js
var require_metadata = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.contentVocabulary = exports.metadataVocabulary = void 0;
	exports.metadataVocabulary = [
		"title",
		"description",
		"default",
		"deprecated",
		"readOnly",
		"writeOnly",
		"examples"
	];
	exports.contentVocabulary = [
		"contentMediaType",
		"contentEncoding",
		"contentSchema"
	];
}));
//#endregion
//#region node_modules/ajv-formats/node_modules/ajv/dist/vocabularies/draft7.js
var require_draft7 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var core_1 = require_core();
	var validation_1 = require_validation();
	var applicator_1 = require_applicator();
	var format_1 = require_format();
	var metadata_1 = require_metadata();
	exports.default = [
		core_1.default,
		validation_1.default,
		(0, applicator_1.default)(),
		format_1.default,
		metadata_1.metadataVocabulary,
		metadata_1.contentVocabulary
	];
}));
//#endregion
//#region node_modules/ajv-formats/node_modules/ajv/dist/vocabularies/discriminator/types.js
var require_types = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.DiscrError = void 0;
	var DiscrError;
	(function(DiscrError) {
		DiscrError["Tag"] = "tag";
		DiscrError["Mapping"] = "mapping";
	})(DiscrError || (exports.DiscrError = DiscrError = {}));
}));
//#endregion
//#region node_modules/ajv-formats/node_modules/ajv/dist/vocabularies/discriminator/index.js
var require_discriminator = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var codegen_1 = require_codegen();
	var types_1 = require_types();
	var compile_1 = require_compile();
	var ref_error_1 = require_ref_error();
	var util_1 = require_util();
	exports.default = {
		keyword: "discriminator",
		type: "object",
		schemaType: "object",
		error: {
			message: ({ params: { discrError, tagName } }) => discrError === types_1.DiscrError.Tag ? `tag "${tagName}" must be string` : `value of tag "${tagName}" must be in oneOf`,
			params: ({ params: { discrError, tag, tagName } }) => (0, codegen_1._)`{error: ${discrError}, tag: ${tagName}, tagValue: ${tag}}`
		},
		code(cxt) {
			const { gen, data, schema, parentSchema, it } = cxt;
			const { oneOf } = parentSchema;
			if (!it.opts.discriminator) throw new Error("discriminator: requires discriminator option");
			const tagName = schema.propertyName;
			if (typeof tagName != "string") throw new Error("discriminator: requires propertyName");
			if (schema.mapping) throw new Error("discriminator: mapping is not supported");
			if (!oneOf) throw new Error("discriminator: requires oneOf keyword");
			const valid = gen.let("valid", false);
			const tag = gen.const("tag", (0, codegen_1._)`${data}${(0, codegen_1.getProperty)(tagName)}`);
			gen.if((0, codegen_1._)`typeof ${tag} == "string"`, () => validateMapping(), () => cxt.error(false, {
				discrError: types_1.DiscrError.Tag,
				tag,
				tagName
			}));
			cxt.ok(valid);
			function validateMapping() {
				const mapping = getMapping();
				gen.if(false);
				for (const tagValue in mapping) {
					gen.elseIf((0, codegen_1._)`${tag} === ${tagValue}`);
					gen.assign(valid, applyTagSchema(mapping[tagValue]));
				}
				gen.else();
				cxt.error(false, {
					discrError: types_1.DiscrError.Mapping,
					tag,
					tagName
				});
				gen.endIf();
			}
			function applyTagSchema(schemaProp) {
				const _valid = gen.name("valid");
				const schCxt = cxt.subschema({
					keyword: "oneOf",
					schemaProp
				}, _valid);
				cxt.mergeEvaluated(schCxt, codegen_1.Name);
				return _valid;
			}
			function getMapping() {
				var _a;
				const oneOfMapping = {};
				const topRequired = hasRequired(parentSchema);
				let tagRequired = true;
				for (let i = 0; i < oneOf.length; i++) {
					let sch = oneOf[i];
					if ((sch === null || sch === void 0 ? void 0 : sch.$ref) && !(0, util_1.schemaHasRulesButRef)(sch, it.self.RULES)) {
						const ref = sch.$ref;
						sch = compile_1.resolveRef.call(it.self, it.schemaEnv.root, it.baseId, ref);
						if (sch instanceof compile_1.SchemaEnv) sch = sch.schema;
						if (sch === void 0) throw new ref_error_1.default(it.opts.uriResolver, it.baseId, ref);
					}
					const propSch = (_a = sch === null || sch === void 0 ? void 0 : sch.properties) === null || _a === void 0 ? void 0 : _a[tagName];
					if (typeof propSch != "object") throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${tagName}"`);
					tagRequired = tagRequired && (topRequired || hasRequired(sch));
					addMappings(propSch, i);
				}
				if (!tagRequired) throw new Error(`discriminator: "${tagName}" must be required`);
				return oneOfMapping;
				function hasRequired({ required }) {
					return Array.isArray(required) && required.includes(tagName);
				}
				function addMappings(sch, i) {
					if (sch.const) addMapping(sch.const, i);
					else if (sch.enum) for (const tagValue of sch.enum) addMapping(tagValue, i);
					else throw new Error(`discriminator: "properties/${tagName}" must have "const" or "enum"`);
				}
				function addMapping(tagValue, i) {
					if (typeof tagValue != "string" || tagValue in oneOfMapping) throw new Error(`discriminator: "${tagName}" values must be unique strings`);
					oneOfMapping[tagValue] = i;
				}
			}
		}
	};
}));
//#endregion
//#region node_modules/ajv-formats/node_modules/ajv/dist/refs/json-schema-draft-07.json
var json_schema_draft_07_exports = /* @__PURE__ */ __exportAll({
	$id: () => $id,
	$schema: () => $schema,
	default: () => json_schema_draft_07_default,
	definitions: () => definitions,
	properties: () => properties,
	title: () => title,
	type: () => type
});
var $schema, $id, title, definitions, type, properties, json_schema_draft_07_default;
var init_json_schema_draft_07 = __esmMin((() => {
	$schema = "http://json-schema.org/draft-07/schema#";
	$id = "http://json-schema.org/draft-07/schema#";
	title = "Core schema meta-schema";
	definitions = {
		"schemaArray": {
			"type": "array",
			"minItems": 1,
			"items": { "$ref": "#" }
		},
		"nonNegativeInteger": {
			"type": "integer",
			"minimum": 0
		},
		"nonNegativeIntegerDefault0": { "allOf": [{ "$ref": "#/definitions/nonNegativeInteger" }, { "default": 0 }] },
		"simpleTypes": { "enum": [
			"array",
			"boolean",
			"integer",
			"null",
			"number",
			"object",
			"string"
		] },
		"stringArray": {
			"type": "array",
			"items": { "type": "string" },
			"uniqueItems": true,
			"default": []
		}
	};
	type = ["object", "boolean"];
	properties = {
		"$id": {
			"type": "string",
			"format": "uri-reference"
		},
		"$schema": {
			"type": "string",
			"format": "uri"
		},
		"$ref": {
			"type": "string",
			"format": "uri-reference"
		},
		"$comment": { "type": "string" },
		"title": { "type": "string" },
		"description": { "type": "string" },
		"default": true,
		"readOnly": {
			"type": "boolean",
			"default": false
		},
		"examples": {
			"type": "array",
			"items": true
		},
		"multipleOf": {
			"type": "number",
			"exclusiveMinimum": 0
		},
		"maximum": { "type": "number" },
		"exclusiveMaximum": { "type": "number" },
		"minimum": { "type": "number" },
		"exclusiveMinimum": { "type": "number" },
		"maxLength": { "$ref": "#/definitions/nonNegativeInteger" },
		"minLength": { "$ref": "#/definitions/nonNegativeIntegerDefault0" },
		"pattern": {
			"type": "string",
			"format": "regex"
		},
		"additionalItems": { "$ref": "#" },
		"items": {
			"anyOf": [{ "$ref": "#" }, { "$ref": "#/definitions/schemaArray" }],
			"default": true
		},
		"maxItems": { "$ref": "#/definitions/nonNegativeInteger" },
		"minItems": { "$ref": "#/definitions/nonNegativeIntegerDefault0" },
		"uniqueItems": {
			"type": "boolean",
			"default": false
		},
		"contains": { "$ref": "#" },
		"maxProperties": { "$ref": "#/definitions/nonNegativeInteger" },
		"minProperties": { "$ref": "#/definitions/nonNegativeIntegerDefault0" },
		"required": { "$ref": "#/definitions/stringArray" },
		"additionalProperties": { "$ref": "#" },
		"definitions": {
			"type": "object",
			"additionalProperties": { "$ref": "#" },
			"default": {}
		},
		"properties": {
			"type": "object",
			"additionalProperties": { "$ref": "#" },
			"default": {}
		},
		"patternProperties": {
			"type": "object",
			"additionalProperties": { "$ref": "#" },
			"propertyNames": { "format": "regex" },
			"default": {}
		},
		"dependencies": {
			"type": "object",
			"additionalProperties": { "anyOf": [{ "$ref": "#" }, { "$ref": "#/definitions/stringArray" }] }
		},
		"propertyNames": { "$ref": "#" },
		"const": true,
		"enum": {
			"type": "array",
			"items": true,
			"minItems": 1,
			"uniqueItems": true
		},
		"type": { "anyOf": [{ "$ref": "#/definitions/simpleTypes" }, {
			"type": "array",
			"items": { "$ref": "#/definitions/simpleTypes" },
			"minItems": 1,
			"uniqueItems": true
		}] },
		"format": { "type": "string" },
		"contentMediaType": { "type": "string" },
		"contentEncoding": { "type": "string" },
		"if": { "$ref": "#" },
		"then": { "$ref": "#" },
		"else": { "$ref": "#" },
		"allOf": { "$ref": "#/definitions/schemaArray" },
		"anyOf": { "$ref": "#/definitions/schemaArray" },
		"oneOf": { "$ref": "#/definitions/schemaArray" },
		"not": { "$ref": "#" }
	};
	json_schema_draft_07_default = {
		$schema,
		$id,
		title,
		definitions,
		type,
		properties,
		"default": true
	};
}));
//#endregion
//#region node_modules/ajv-formats/node_modules/ajv/dist/ajv.js
var require_ajv = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.MissingRefError = exports.ValidationError = exports.CodeGen = exports.Name = exports.nil = exports.stringify = exports.str = exports._ = exports.KeywordCxt = exports.Ajv = void 0;
	var core_1 = require_core$1();
	var draft7_1 = require_draft7();
	var discriminator_1 = require_discriminator();
	var draft7MetaSchema = (init_json_schema_draft_07(), __toCommonJS(json_schema_draft_07_exports).default);
	var META_SUPPORT_DATA = ["/properties"];
	var META_SCHEMA_ID = "http://json-schema.org/draft-07/schema";
	var Ajv = class extends core_1.default {
		_addVocabularies() {
			super._addVocabularies();
			draft7_1.default.forEach((v) => this.addVocabulary(v));
			if (this.opts.discriminator) this.addKeyword(discriminator_1.default);
		}
		_addDefaultMetaSchema() {
			super._addDefaultMetaSchema();
			if (!this.opts.meta) return;
			const metaSchema = this.opts.$data ? this.$dataMetaSchema(draft7MetaSchema, META_SUPPORT_DATA) : draft7MetaSchema;
			this.addMetaSchema(metaSchema, META_SCHEMA_ID, false);
			this.refs["http://json-schema.org/schema"] = META_SCHEMA_ID;
		}
		defaultMeta() {
			return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(META_SCHEMA_ID) ? META_SCHEMA_ID : void 0);
		}
	};
	exports.Ajv = Ajv;
	module.exports = exports = Ajv;
	module.exports.Ajv = Ajv;
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Ajv;
	var validate_1 = require_validate();
	Object.defineProperty(exports, "KeywordCxt", {
		enumerable: true,
		get: function() {
			return validate_1.KeywordCxt;
		}
	});
	var codegen_1 = require_codegen();
	Object.defineProperty(exports, "_", {
		enumerable: true,
		get: function() {
			return codegen_1._;
		}
	});
	Object.defineProperty(exports, "str", {
		enumerable: true,
		get: function() {
			return codegen_1.str;
		}
	});
	Object.defineProperty(exports, "stringify", {
		enumerable: true,
		get: function() {
			return codegen_1.stringify;
		}
	});
	Object.defineProperty(exports, "nil", {
		enumerable: true,
		get: function() {
			return codegen_1.nil;
		}
	});
	Object.defineProperty(exports, "Name", {
		enumerable: true,
		get: function() {
			return codegen_1.Name;
		}
	});
	Object.defineProperty(exports, "CodeGen", {
		enumerable: true,
		get: function() {
			return codegen_1.CodeGen;
		}
	});
	var validation_error_1 = require_validation_error();
	Object.defineProperty(exports, "ValidationError", {
		enumerable: true,
		get: function() {
			return validation_error_1.default;
		}
	});
	var ref_error_1 = require_ref_error();
	Object.defineProperty(exports, "MissingRefError", {
		enumerable: true,
		get: function() {
			return ref_error_1.default;
		}
	});
}));
//#endregion
//#region node_modules/ajv-formats/dist/limit.js
var require_limit = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.formatLimitDefinition = void 0;
	var ajv_1 = require_ajv();
	var codegen_1 = require_codegen();
	var ops = codegen_1.operators;
	var KWDs = {
		formatMaximum: {
			okStr: "<=",
			ok: ops.LTE,
			fail: ops.GT
		},
		formatMinimum: {
			okStr: ">=",
			ok: ops.GTE,
			fail: ops.LT
		},
		formatExclusiveMaximum: {
			okStr: "<",
			ok: ops.LT,
			fail: ops.GTE
		},
		formatExclusiveMinimum: {
			okStr: ">",
			ok: ops.GT,
			fail: ops.LTE
		}
	};
	exports.formatLimitDefinition = {
		keyword: Object.keys(KWDs),
		type: "string",
		schemaType: "string",
		$data: true,
		error: {
			message: ({ keyword, schemaCode }) => (0, codegen_1.str)`should be ${KWDs[keyword].okStr} ${schemaCode}`,
			params: ({ keyword, schemaCode }) => (0, codegen_1._)`{comparison: ${KWDs[keyword].okStr}, limit: ${schemaCode}}`
		},
		code(cxt) {
			const { gen, data, schemaCode, keyword, it } = cxt;
			const { opts, self } = it;
			if (!opts.validateFormats) return;
			const fCxt = new ajv_1.KeywordCxt(it, self.RULES.all.format.definition, "format");
			if (fCxt.$data) validate$DataFormat();
			else validateFormat();
			function validate$DataFormat() {
				const fmts = gen.scopeValue("formats", {
					ref: self.formats,
					code: opts.code.formats
				});
				const fmt = gen.const("fmt", (0, codegen_1._)`${fmts}[${fCxt.schemaCode}]`);
				cxt.fail$data((0, codegen_1.or)((0, codegen_1._)`typeof ${fmt} != "object"`, (0, codegen_1._)`${fmt} instanceof RegExp`, (0, codegen_1._)`typeof ${fmt}.compare != "function"`, compareCode(fmt)));
			}
			function validateFormat() {
				const format = fCxt.schema;
				const fmtDef = self.formats[format];
				if (!fmtDef || fmtDef === true) return;
				if (typeof fmtDef != "object" || fmtDef instanceof RegExp || typeof fmtDef.compare != "function") throw new Error(`"${keyword}": format "${format}" does not define "compare" function`);
				const fmt = gen.scopeValue("formats", {
					key: format,
					ref: fmtDef,
					code: opts.code.formats ? (0, codegen_1._)`${opts.code.formats}${(0, codegen_1.getProperty)(format)}` : void 0
				});
				cxt.fail$data(compareCode(fmt));
			}
			function compareCode(fmt) {
				return (0, codegen_1._)`${fmt}.compare(${data}, ${schemaCode}) ${KWDs[keyword].fail} 0`;
			}
		},
		dependencies: ["format"]
	};
	var formatLimitPlugin = (ajv) => {
		ajv.addKeyword(exports.formatLimitDefinition);
		return ajv;
	};
	exports.default = formatLimitPlugin;
}));
//#endregion
//#region node_modules/ajv-formats/dist/index.js
var require_dist = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var formats_1 = require_formats();
	var limit_1 = require_limit();
	var codegen_1 = require_codegen();
	var fullName = new codegen_1.Name("fullFormats");
	var fastName = new codegen_1.Name("fastFormats");
	var formatsPlugin = (ajv, opts = { keywords: true }) => {
		if (Array.isArray(opts)) {
			addFormats(ajv, opts, formats_1.fullFormats, fullName);
			return ajv;
		}
		const [formats, exportName] = opts.mode === "fast" ? [formats_1.fastFormats, fastName] : [formats_1.fullFormats, fullName];
		addFormats(ajv, opts.formats || formats_1.formatNames, formats, exportName);
		if (opts.keywords) (0, limit_1.default)(ajv);
		return ajv;
	};
	formatsPlugin.get = (name, mode = "full") => {
		const f = (mode === "fast" ? formats_1.fastFormats : formats_1.fullFormats)[name];
		if (!f) throw new Error(`Unknown format "${name}"`);
		return f;
	};
	function addFormats(ajv, list, fs, exportName) {
		var _a;
		var _b;
		(_a = (_b = ajv.opts.code).formats) !== null && _a !== void 0 || (_b.formats = (0, codegen_1._)`require("ajv-formats/dist/formats").${exportName}`);
		for (const f of list) ajv.addFormat(f, fs[f]);
	}
	module.exports = exports = formatsPlugin;
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = formatsPlugin;
}));
//#endregion
//#region node_modules/@modelcontextprotocol/sdk/dist/esm/validation/ajv-provider.js
var import_ajv = /* @__PURE__ */ __toESM(require_ajv$1(), 1);
var import_dist = /* @__PURE__ */ __toESM(require_dist(), 1);
function createDefaultAjvInstance() {
	const ajv = new import_ajv.default({
		strict: false,
		validateFormats: true,
		validateSchema: false,
		allErrors: true
	});
	(0, import_dist.default)(ajv);
	return ajv;
}
/**
* @example
* ```typescript
* // Use with default AJV instance (recommended)
* import { AjvJsonSchemaValidator } from '@modelcontextprotocol/sdk/validation/ajv';
* const validator = new AjvJsonSchemaValidator();
*
* // Use with custom AJV instance
* import { Ajv } from 'ajv';
* const ajv = new Ajv({ strict: true, allErrors: true });
* const validator = new AjvJsonSchemaValidator(ajv);
* ```
*/
var AjvJsonSchemaValidator = class {
	/**
	* Create an AJV validator
	*
	* @param ajv - Optional pre-configured AJV instance. If not provided, a default instance will be created.
	*
	* @example
	* ```typescript
	* // Use default configuration (recommended for most cases)
	* import { AjvJsonSchemaValidator } from '@modelcontextprotocol/sdk/validation/ajv';
	* const validator = new AjvJsonSchemaValidator();
	*
	* // Or provide custom AJV instance for advanced configuration
	* import { Ajv } from 'ajv';
	* import addFormats from 'ajv-formats';
	*
	* const ajv = new Ajv({ validateFormats: true });
	* addFormats(ajv);
	* const validator = new AjvJsonSchemaValidator(ajv);
	* ```
	*/
	constructor(ajv) {
		this._ajv = ajv ?? createDefaultAjvInstance();
	}
	/**
	* Create a validator for the given JSON Schema
	*
	* The validator is compiled once and can be reused multiple times.
	* If the schema has an $id, it will be cached by AJV automatically.
	*
	* @param schema - Standard JSON Schema object
	* @returns A validator function that validates input data
	*/
	getValidator(schema) {
		const ajvValidator = "$id" in schema && typeof schema.$id === "string" ? this._ajv.getSchema(schema.$id) ?? this._ajv.compile(schema) : this._ajv.compile(schema);
		return (input) => {
			if (ajvValidator(input)) return {
				valid: true,
				data: input,
				errorMessage: void 0
			};
			else return {
				valid: false,
				data: void 0,
				errorMessage: this._ajv.errorsText(ajvValidator.errors)
			};
		};
	}
};
//#endregion
//#region node_modules/@modelcontextprotocol/sdk/dist/esm/experimental/tasks/client.js
/**
* Experimental client task features for MCP SDK.
* WARNING: These APIs are experimental and may change without notice.
*
* @experimental
*/
/**
* Experimental task features for MCP clients.
*
* Access via `client.experimental.tasks`:
* ```typescript
* const stream = client.experimental.tasks.callToolStream({ name: 'tool', arguments: {} });
* const task = await client.experimental.tasks.getTask(taskId);
* ```
*
* @experimental
*/
var ExperimentalClientTasks = class {
	constructor(_client) {
		this._client = _client;
	}
	/**
	* Calls a tool and returns an AsyncGenerator that yields response messages.
	* The generator is guaranteed to end with either a 'result' or 'error' message.
	*
	* This method provides streaming access to tool execution, allowing you to
	* observe intermediate task status updates for long-running tool calls.
	* Automatically validates structured output if the tool has an outputSchema.
	*
	* @example
	* ```typescript
	* const stream = client.experimental.tasks.callToolStream({ name: 'myTool', arguments: {} });
	* for await (const message of stream) {
	*   switch (message.type) {
	*     case 'taskCreated':
	*       console.log('Tool execution started:', message.task.taskId);
	*       break;
	*     case 'taskStatus':
	*       console.log('Tool status:', message.task.status);
	*       break;
	*     case 'result':
	*       console.log('Tool result:', message.result);
	*       break;
	*     case 'error':
	*       console.error('Tool error:', message.error);
	*       break;
	*   }
	* }
	* ```
	*
	* @param params - Tool call parameters (name and arguments)
	* @param resultSchema - Zod schema for validating the result (defaults to CallToolResultSchema)
	* @param options - Optional request options (timeout, signal, task creation params, etc.)
	* @returns AsyncGenerator that yields ResponseMessage objects
	*
	* @experimental
	*/
	async *callToolStream(params, resultSchema = CallToolResultSchema, options) {
		const clientInternal = this._client;
		const optionsWithTask = {
			...options,
			task: options?.task ?? (clientInternal.isToolTask(params.name) ? {} : void 0)
		};
		const stream = clientInternal.requestStream({
			method: "tools/call",
			params
		}, resultSchema, optionsWithTask);
		const validator = clientInternal.getToolOutputValidator(params.name);
		for await (const message of stream) {
			if (message.type === "result" && validator) {
				const result = message.result;
				if (!result.structuredContent && !result.isError) {
					yield {
						type: "error",
						error: new McpError(ErrorCode.InvalidRequest, `Tool ${params.name} has an output schema but did not return structured content`)
					};
					return;
				}
				if (result.structuredContent) try {
					const validationResult = validator(result.structuredContent);
					if (!validationResult.valid) {
						yield {
							type: "error",
							error: new McpError(ErrorCode.InvalidParams, `Structured content does not match the tool's output schema: ${validationResult.errorMessage}`)
						};
						return;
					}
				} catch (error) {
					if (error instanceof McpError) {
						yield {
							type: "error",
							error
						};
						return;
					}
					yield {
						type: "error",
						error: new McpError(ErrorCode.InvalidParams, `Failed to validate structured content: ${error instanceof Error ? error.message : String(error)}`)
					};
					return;
				}
			}
			yield message;
		}
	}
	/**
	* Gets the current status of a task.
	*
	* @param taskId - The task identifier
	* @param options - Optional request options
	* @returns The task status
	*
	* @experimental
	*/
	async getTask(taskId, options) {
		return this._client.getTask({ taskId }, options);
	}
	/**
	* Retrieves the result of a completed task.
	*
	* @param taskId - The task identifier
	* @param resultSchema - Zod schema for validating the result
	* @param options - Optional request options
	* @returns The task result
	*
	* @experimental
	*/
	async getTaskResult(taskId, resultSchema, options) {
		return this._client.getTaskResult({ taskId }, resultSchema, options);
	}
	/**
	* Lists tasks with optional pagination.
	*
	* @param cursor - Optional pagination cursor
	* @param options - Optional request options
	* @returns List of tasks with optional next cursor
	*
	* @experimental
	*/
	async listTasks(cursor, options) {
		return this._client.listTasks(cursor ? { cursor } : void 0, options);
	}
	/**
	* Cancels a running task.
	*
	* @param taskId - The task identifier
	* @param options - Optional request options
	*
	* @experimental
	*/
	async cancelTask(taskId, options) {
		return this._client.cancelTask({ taskId }, options);
	}
	/**
	* Sends a request and returns an AsyncGenerator that yields response messages.
	* The generator is guaranteed to end with either a 'result' or 'error' message.
	*
	* This method provides streaming access to request processing, allowing you to
	* observe intermediate task status updates for task-augmented requests.
	*
	* @param request - The request to send
	* @param resultSchema - Zod schema for validating the result
	* @param options - Optional request options (timeout, signal, task creation params, etc.)
	* @returns AsyncGenerator that yields ResponseMessage objects
	*
	* @experimental
	*/
	requestStream(request, resultSchema, options) {
		return this._client.requestStream(request, resultSchema, options);
	}
};
//#endregion
//#region node_modules/@modelcontextprotocol/sdk/dist/esm/experimental/tasks/helpers.js
/**
* Experimental task capability assertion helpers.
* WARNING: These APIs are experimental and may change without notice.
*
* @experimental
*/
/**
* Asserts that task creation is supported for tools/call.
* Used by Client.assertTaskCapability and Server.assertTaskHandlerCapability.
*
* @param requests - The task requests capability object
* @param method - The method being checked
* @param entityName - 'Server' or 'Client' for error messages
* @throws Error if the capability is not supported
*
* @experimental
*/
function assertToolsCallTaskCapability(requests, method, entityName) {
	if (!requests) throw new Error(`${entityName} does not support task creation (required for ${method})`);
	switch (method) {
		case "tools/call":
			if (!requests.tools?.call) throw new Error(`${entityName} does not support task creation for tools/call (required for ${method})`);
			break;
		default: break;
	}
}
/**
* Asserts that task creation is supported for sampling/createMessage or elicitation/create.
* Used by Server.assertTaskCapability and Client.assertTaskHandlerCapability.
*
* @param requests - The task requests capability object
* @param method - The method being checked
* @param entityName - 'Server' or 'Client' for error messages
* @throws Error if the capability is not supported
*
* @experimental
*/
function assertClientRequestTaskCapability(requests, method, entityName) {
	if (!requests) throw new Error(`${entityName} does not support task creation (required for ${method})`);
	switch (method) {
		case "sampling/createMessage":
			if (!requests.sampling?.createMessage) throw new Error(`${entityName} does not support task creation for sampling/createMessage (required for ${method})`);
			break;
		case "elicitation/create":
			if (!requests.elicitation?.create) throw new Error(`${entityName} does not support task creation for elicitation/create (required for ${method})`);
			break;
		default: break;
	}
}
//#endregion
//#region node_modules/@modelcontextprotocol/sdk/dist/esm/client/index.js
/**
* Elicitation default application helper. Applies defaults to the data based on the schema.
*
* @param schema - The schema to apply defaults to.
* @param data - The data to apply defaults to.
*/
function applyElicitationDefaults(schema, data) {
	if (!schema || data === null || typeof data !== "object") return;
	if (schema.type === "object" && schema.properties && typeof schema.properties === "object") {
		const obj = data;
		const props = schema.properties;
		for (const key of Object.keys(props)) {
			const propSchema = props[key];
			if (obj[key] === void 0 && Object.prototype.hasOwnProperty.call(propSchema, "default")) obj[key] = propSchema.default;
			if (obj[key] !== void 0) applyElicitationDefaults(propSchema, obj[key]);
		}
	}
	if (Array.isArray(schema.anyOf)) {
		for (const sub of schema.anyOf) if (typeof sub !== "boolean") applyElicitationDefaults(sub, data);
	}
	if (Array.isArray(schema.oneOf)) {
		for (const sub of schema.oneOf) if (typeof sub !== "boolean") applyElicitationDefaults(sub, data);
	}
}
/**
* Determines which elicitation modes are supported based on declared client capabilities.
*
* According to the spec:
* - An empty elicitation capability object defaults to form mode support (backwards compatibility)
* - URL mode is only supported if explicitly declared
*
* @param capabilities - The client's elicitation capabilities
* @returns An object indicating which modes are supported
*/
function getSupportedElicitationModes(capabilities) {
	if (!capabilities) return {
		supportsFormMode: false,
		supportsUrlMode: false
	};
	const hasFormCapability = capabilities.form !== void 0;
	const hasUrlCapability = capabilities.url !== void 0;
	return {
		supportsFormMode: hasFormCapability || !hasFormCapability && !hasUrlCapability,
		supportsUrlMode: hasUrlCapability
	};
}
/**
* An MCP client on top of a pluggable transport.
*
* The client will automatically begin the initialization flow with the server when connect() is called.
*
* To use with custom types, extend the base Request/Notification/Result types and pass them as type parameters:
*
* ```typescript
* // Custom schemas
* const CustomRequestSchema = RequestSchema.extend({...})
* const CustomNotificationSchema = NotificationSchema.extend({...})
* const CustomResultSchema = ResultSchema.extend({...})
*
* // Type aliases
* type CustomRequest = z.infer<typeof CustomRequestSchema>
* type CustomNotification = z.infer<typeof CustomNotificationSchema>
* type CustomResult = z.infer<typeof CustomResultSchema>
*
* // Create typed client
* const client = new Client<CustomRequest, CustomNotification, CustomResult>({
*   name: "CustomClient",
*   version: "1.0.0"
* })
* ```
*/
var Client = class extends Protocol {
	/**
	* Initializes this client with the given name and version information.
	*/
	constructor(_clientInfo, options) {
		super(options);
		this._clientInfo = _clientInfo;
		this._cachedToolOutputValidators = /* @__PURE__ */ new Map();
		this._cachedKnownTaskTools = /* @__PURE__ */ new Set();
		this._cachedRequiredTaskTools = /* @__PURE__ */ new Set();
		this._listChangedDebounceTimers = /* @__PURE__ */ new Map();
		this._capabilities = options?.capabilities ?? {};
		this._jsonSchemaValidator = options?.jsonSchemaValidator ?? new AjvJsonSchemaValidator();
		if (options?.listChanged) this._pendingListChangedConfig = options.listChanged;
	}
	/**
	* Set up handlers for list changed notifications based on config and server capabilities.
	* This should only be called after initialization when server capabilities are known.
	* Handlers are silently skipped if the server doesn't advertise the corresponding listChanged capability.
	* @internal
	*/
	_setupListChangedHandlers(config) {
		if (config.tools && this._serverCapabilities?.tools?.listChanged) this._setupListChangedHandler("tools", ToolListChangedNotificationSchema, config.tools, async () => {
			return (await this.listTools()).tools;
		});
		if (config.prompts && this._serverCapabilities?.prompts?.listChanged) this._setupListChangedHandler("prompts", PromptListChangedNotificationSchema, config.prompts, async () => {
			return (await this.listPrompts()).prompts;
		});
		if (config.resources && this._serverCapabilities?.resources?.listChanged) this._setupListChangedHandler("resources", ResourceListChangedNotificationSchema, config.resources, async () => {
			return (await this.listResources()).resources;
		});
	}
	/**
	* Access experimental features.
	*
	* WARNING: These APIs are experimental and may change without notice.
	*
	* @experimental
	*/
	get experimental() {
		if (!this._experimental) this._experimental = { tasks: new ExperimentalClientTasks(this) };
		return this._experimental;
	}
	/**
	* Registers new capabilities. This can only be called before connecting to a transport.
	*
	* The new capabilities will be merged with any existing capabilities previously given (e.g., at initialization).
	*/
	registerCapabilities(capabilities) {
		if (this.transport) throw new Error("Cannot register capabilities after connecting to transport");
		this._capabilities = mergeCapabilities(this._capabilities, capabilities);
	}
	/**
	* Override request handler registration to enforce client-side validation for elicitation.
	*/
	setRequestHandler(requestSchema, handler) {
		const methodSchema = getObjectShape(requestSchema)?.method;
		if (!methodSchema) throw new Error("Schema is missing a method literal");
		const methodValue = getLiteralValue(methodSchema);
		if (typeof methodValue !== "string") throw new Error("Schema method literal must be a string");
		const method = methodValue;
		if (method === "elicitation/create") {
			const wrappedHandler = async (request, extra) => {
				const validatedRequest = safeParse(ElicitRequestSchema, request);
				if (!validatedRequest.success) {
					const errorMessage = validatedRequest.error instanceof Error ? validatedRequest.error.message : String(validatedRequest.error);
					throw new McpError(ErrorCode.InvalidParams, `Invalid elicitation request: ${errorMessage}`);
				}
				const { params } = validatedRequest.data;
				params.mode = params.mode ?? "form";
				const { supportsFormMode, supportsUrlMode } = getSupportedElicitationModes(this._capabilities.elicitation);
				if (params.mode === "form" && !supportsFormMode) throw new McpError(ErrorCode.InvalidParams, "Client does not support form-mode elicitation requests");
				if (params.mode === "url" && !supportsUrlMode) throw new McpError(ErrorCode.InvalidParams, "Client does not support URL-mode elicitation requests");
				const result = await Promise.resolve(handler(request, extra));
				if (params.task) {
					const taskValidationResult = safeParse(CreateTaskResultSchema, result);
					if (!taskValidationResult.success) {
						const errorMessage = taskValidationResult.error instanceof Error ? taskValidationResult.error.message : String(taskValidationResult.error);
						throw new McpError(ErrorCode.InvalidParams, `Invalid task creation result: ${errorMessage}`);
					}
					return taskValidationResult.data;
				}
				const validationResult = safeParse(ElicitResultSchema, result);
				if (!validationResult.success) {
					const errorMessage = validationResult.error instanceof Error ? validationResult.error.message : String(validationResult.error);
					throw new McpError(ErrorCode.InvalidParams, `Invalid elicitation result: ${errorMessage}`);
				}
				const validatedResult = validationResult.data;
				const requestedSchema = params.mode === "form" ? params.requestedSchema : void 0;
				if (params.mode === "form" && validatedResult.action === "accept" && validatedResult.content && requestedSchema) {
					if (this._capabilities.elicitation?.form?.applyDefaults) try {
						applyElicitationDefaults(requestedSchema, validatedResult.content);
					} catch {}
				}
				return validatedResult;
			};
			return super.setRequestHandler(requestSchema, wrappedHandler);
		}
		if (method === "sampling/createMessage") {
			const wrappedHandler = async (request, extra) => {
				const validatedRequest = safeParse(CreateMessageRequestSchema, request);
				if (!validatedRequest.success) {
					const errorMessage = validatedRequest.error instanceof Error ? validatedRequest.error.message : String(validatedRequest.error);
					throw new McpError(ErrorCode.InvalidParams, `Invalid sampling request: ${errorMessage}`);
				}
				const { params } = validatedRequest.data;
				const result = await Promise.resolve(handler(request, extra));
				if (params.task) {
					const taskValidationResult = safeParse(CreateTaskResultSchema, result);
					if (!taskValidationResult.success) {
						const errorMessage = taskValidationResult.error instanceof Error ? taskValidationResult.error.message : String(taskValidationResult.error);
						throw new McpError(ErrorCode.InvalidParams, `Invalid task creation result: ${errorMessage}`);
					}
					return taskValidationResult.data;
				}
				const validationResult = safeParse(params.tools || params.toolChoice ? CreateMessageResultWithToolsSchema : CreateMessageResultSchema, result);
				if (!validationResult.success) {
					const errorMessage = validationResult.error instanceof Error ? validationResult.error.message : String(validationResult.error);
					throw new McpError(ErrorCode.InvalidParams, `Invalid sampling result: ${errorMessage}`);
				}
				return validationResult.data;
			};
			return super.setRequestHandler(requestSchema, wrappedHandler);
		}
		return super.setRequestHandler(requestSchema, handler);
	}
	assertCapability(capability, method) {
		if (!this._serverCapabilities?.[capability]) throw new Error(`Server does not support ${capability} (required for ${method})`);
	}
	async connect(transport, options) {
		await super.connect(transport);
		if (transport.sessionId !== void 0) return;
		try {
			const result = await this.request({
				method: "initialize",
				params: {
					protocolVersion: LATEST_PROTOCOL_VERSION,
					capabilities: this._capabilities,
					clientInfo: this._clientInfo
				}
			}, InitializeResultSchema, options);
			if (result === void 0) throw new Error(`Server sent invalid initialize result: ${result}`);
			if (!SUPPORTED_PROTOCOL_VERSIONS.includes(result.protocolVersion)) throw new Error(`Server's protocol version is not supported: ${result.protocolVersion}`);
			this._serverCapabilities = result.capabilities;
			this._serverVersion = result.serverInfo;
			if (transport.setProtocolVersion) transport.setProtocolVersion(result.protocolVersion);
			this._instructions = result.instructions;
			await this.notification({ method: "notifications/initialized" });
			if (this._pendingListChangedConfig) {
				this._setupListChangedHandlers(this._pendingListChangedConfig);
				this._pendingListChangedConfig = void 0;
			}
		} catch (error) {
			this.close();
			throw error;
		}
	}
	/**
	* After initialization has completed, this will be populated with the server's reported capabilities.
	*/
	getServerCapabilities() {
		return this._serverCapabilities;
	}
	/**
	* After initialization has completed, this will be populated with information about the server's name and version.
	*/
	getServerVersion() {
		return this._serverVersion;
	}
	/**
	* After initialization has completed, this may be populated with information about the server's instructions.
	*/
	getInstructions() {
		return this._instructions;
	}
	assertCapabilityForMethod(method) {
		switch (method) {
			case "logging/setLevel":
				if (!this._serverCapabilities?.logging) throw new Error(`Server does not support logging (required for ${method})`);
				break;
			case "prompts/get":
			case "prompts/list":
				if (!this._serverCapabilities?.prompts) throw new Error(`Server does not support prompts (required for ${method})`);
				break;
			case "resources/list":
			case "resources/templates/list":
			case "resources/read":
			case "resources/subscribe":
			case "resources/unsubscribe":
				if (!this._serverCapabilities?.resources) throw new Error(`Server does not support resources (required for ${method})`);
				if (method === "resources/subscribe" && !this._serverCapabilities.resources.subscribe) throw new Error(`Server does not support resource subscriptions (required for ${method})`);
				break;
			case "tools/call":
			case "tools/list":
				if (!this._serverCapabilities?.tools) throw new Error(`Server does not support tools (required for ${method})`);
				break;
			case "completion/complete":
				if (!this._serverCapabilities?.completions) throw new Error(`Server does not support completions (required for ${method})`);
				break;
			case "initialize": break;
			case "ping": break;
		}
	}
	assertNotificationCapability(method) {
		switch (method) {
			case "notifications/roots/list_changed":
				if (!this._capabilities.roots?.listChanged) throw new Error(`Client does not support roots list changed notifications (required for ${method})`);
				break;
			case "notifications/initialized": break;
			case "notifications/cancelled": break;
			case "notifications/progress": break;
		}
	}
	assertRequestHandlerCapability(method) {
		if (!this._capabilities) return;
		switch (method) {
			case "sampling/createMessage":
				if (!this._capabilities.sampling) throw new Error(`Client does not support sampling capability (required for ${method})`);
				break;
			case "elicitation/create":
				if (!this._capabilities.elicitation) throw new Error(`Client does not support elicitation capability (required for ${method})`);
				break;
			case "roots/list":
				if (!this._capabilities.roots) throw new Error(`Client does not support roots capability (required for ${method})`);
				break;
			case "tasks/get":
			case "tasks/list":
			case "tasks/result":
			case "tasks/cancel":
				if (!this._capabilities.tasks) throw new Error(`Client does not support tasks capability (required for ${method})`);
				break;
			case "ping": break;
		}
	}
	assertTaskCapability(method) {
		assertToolsCallTaskCapability(this._serverCapabilities?.tasks?.requests, method, "Server");
	}
	assertTaskHandlerCapability(method) {
		if (!this._capabilities) return;
		assertClientRequestTaskCapability(this._capabilities.tasks?.requests, method, "Client");
	}
	async ping(options) {
		return this.request({ method: "ping" }, EmptyResultSchema, options);
	}
	async complete(params, options) {
		return this.request({
			method: "completion/complete",
			params
		}, CompleteResultSchema, options);
	}
	async setLoggingLevel(level, options) {
		return this.request({
			method: "logging/setLevel",
			params: { level }
		}, EmptyResultSchema, options);
	}
	async getPrompt(params, options) {
		return this.request({
			method: "prompts/get",
			params
		}, GetPromptResultSchema, options);
	}
	async listPrompts(params, options) {
		return this.request({
			method: "prompts/list",
			params
		}, ListPromptsResultSchema, options);
	}
	async listResources(params, options) {
		return this.request({
			method: "resources/list",
			params
		}, ListResourcesResultSchema, options);
	}
	async listResourceTemplates(params, options) {
		return this.request({
			method: "resources/templates/list",
			params
		}, ListResourceTemplatesResultSchema, options);
	}
	async readResource(params, options) {
		return this.request({
			method: "resources/read",
			params
		}, ReadResourceResultSchema, options);
	}
	async subscribeResource(params, options) {
		return this.request({
			method: "resources/subscribe",
			params
		}, EmptyResultSchema, options);
	}
	async unsubscribeResource(params, options) {
		return this.request({
			method: "resources/unsubscribe",
			params
		}, EmptyResultSchema, options);
	}
	/**
	* Calls a tool and waits for the result. Automatically validates structured output if the tool has an outputSchema.
	*
	* For task-based execution with streaming behavior, use client.experimental.tasks.callToolStream() instead.
	*/
	async callTool(params, resultSchema = CallToolResultSchema, options) {
		if (this.isToolTaskRequired(params.name)) throw new McpError(ErrorCode.InvalidRequest, `Tool "${params.name}" requires task-based execution. Use client.experimental.tasks.callToolStream() instead.`);
		const result = await this.request({
			method: "tools/call",
			params
		}, resultSchema, options);
		const validator = this.getToolOutputValidator(params.name);
		if (validator) {
			if (!result.structuredContent && !result.isError) throw new McpError(ErrorCode.InvalidRequest, `Tool ${params.name} has an output schema but did not return structured content`);
			if (result.structuredContent) try {
				const validationResult = validator(result.structuredContent);
				if (!validationResult.valid) throw new McpError(ErrorCode.InvalidParams, `Structured content does not match the tool's output schema: ${validationResult.errorMessage}`);
			} catch (error) {
				if (error instanceof McpError) throw error;
				throw new McpError(ErrorCode.InvalidParams, `Failed to validate structured content: ${error instanceof Error ? error.message : String(error)}`);
			}
		}
		return result;
	}
	isToolTask(toolName) {
		if (!this._serverCapabilities?.tasks?.requests?.tools?.call) return false;
		return this._cachedKnownTaskTools.has(toolName);
	}
	/**
	* Check if a tool requires task-based execution.
	* Unlike isToolTask which includes 'optional' tools, this only checks for 'required'.
	*/
	isToolTaskRequired(toolName) {
		return this._cachedRequiredTaskTools.has(toolName);
	}
	/**
	* Cache validators for tool output schemas.
	* Called after listTools() to pre-compile validators for better performance.
	*/
	cacheToolMetadata(tools) {
		this._cachedToolOutputValidators.clear();
		this._cachedKnownTaskTools.clear();
		this._cachedRequiredTaskTools.clear();
		for (const tool of tools) {
			if (tool.outputSchema) {
				const toolValidator = this._jsonSchemaValidator.getValidator(tool.outputSchema);
				this._cachedToolOutputValidators.set(tool.name, toolValidator);
			}
			const taskSupport = tool.execution?.taskSupport;
			if (taskSupport === "required" || taskSupport === "optional") this._cachedKnownTaskTools.add(tool.name);
			if (taskSupport === "required") this._cachedRequiredTaskTools.add(tool.name);
		}
	}
	/**
	* Get cached validator for a tool
	*/
	getToolOutputValidator(toolName) {
		return this._cachedToolOutputValidators.get(toolName);
	}
	async listTools(params, options) {
		const result = await this.request({
			method: "tools/list",
			params
		}, ListToolsResultSchema, options);
		this.cacheToolMetadata(result.tools);
		return result;
	}
	/**
	* Set up a single list changed handler.
	* @internal
	*/
	_setupListChangedHandler(listType, notificationSchema, options, fetcher) {
		const parseResult = ListChangedOptionsBaseSchema.safeParse(options);
		if (!parseResult.success) throw new Error(`Invalid ${listType} listChanged options: ${parseResult.error.message}`);
		if (typeof options.onChanged !== "function") throw new Error(`Invalid ${listType} listChanged options: onChanged must be a function`);
		const { autoRefresh, debounceMs } = parseResult.data;
		const { onChanged } = options;
		const refresh = async () => {
			if (!autoRefresh) {
				onChanged(null, null);
				return;
			}
			try {
				const items = await fetcher();
				onChanged(null, items);
			} catch (e) {
				const error = e instanceof Error ? e : new Error(String(e));
				onChanged(error, null);
			}
		};
		const handler = () => {
			if (debounceMs) {
				const existingTimer = this._listChangedDebounceTimers.get(listType);
				if (existingTimer) clearTimeout(existingTimer);
				const timer = setTimeout(refresh, debounceMs);
				this._listChangedDebounceTimers.set(listType, timer);
			} else refresh();
		};
		this.setNotificationHandler(notificationSchema, handler);
	}
	async sendRootsListChanged() {
		return this.notification({ method: "notifications/roots/list_changed" });
	}
};
//#endregion
//#region node_modules/isexe/windows.js
var require_windows = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = isexe;
	isexe.sync = sync;
	var fs$2 = __require("fs");
	function checkPathExt(path, options) {
		var pathext = options.pathExt !== void 0 ? options.pathExt : process.env.PATHEXT;
		if (!pathext) return true;
		pathext = pathext.split(";");
		if (pathext.indexOf("") !== -1) return true;
		for (var i = 0; i < pathext.length; i++) {
			var p = pathext[i].toLowerCase();
			if (p && path.substr(-p.length).toLowerCase() === p) return true;
		}
		return false;
	}
	function checkStat(stat, path, options) {
		if (!stat.isSymbolicLink() && !stat.isFile()) return false;
		return checkPathExt(path, options);
	}
	function isexe(path, options, cb) {
		fs$2.stat(path, function(er, stat) {
			cb(er, er ? false : checkStat(stat, path, options));
		});
	}
	function sync(path, options) {
		return checkStat(fs$2.statSync(path), path, options);
	}
}));
//#endregion
//#region node_modules/isexe/mode.js
var require_mode = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = isexe;
	isexe.sync = sync;
	var fs$1 = __require("fs");
	function isexe(path, options, cb) {
		fs$1.stat(path, function(er, stat) {
			cb(er, er ? false : checkStat(stat, options));
		});
	}
	function sync(path, options) {
		return checkStat(fs$1.statSync(path), options);
	}
	function checkStat(stat, options) {
		return stat.isFile() && checkMode(stat, options);
	}
	function checkMode(stat, options) {
		var mod = stat.mode;
		var uid = stat.uid;
		var gid = stat.gid;
		var myUid = options.uid !== void 0 ? options.uid : process.getuid && process.getuid();
		var myGid = options.gid !== void 0 ? options.gid : process.getgid && process.getgid();
		var u = parseInt("100", 8);
		var g = parseInt("010", 8);
		var o = parseInt("001", 8);
		var ug = u | g;
		return mod & o || mod & g && gid === myGid || mod & u && uid === myUid || mod & ug && myUid === 0;
	}
}));
//#endregion
//#region node_modules/isexe/index.js
var require_isexe = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	__require("fs");
	var core;
	if (process.platform === "win32" || global.TESTING_WINDOWS) core = require_windows();
	else core = require_mode();
	module.exports = isexe;
	isexe.sync = sync;
	function isexe(path, options, cb) {
		if (typeof options === "function") {
			cb = options;
			options = {};
		}
		if (!cb) {
			if (typeof Promise !== "function") throw new TypeError("callback not provided");
			return new Promise(function(resolve, reject) {
				isexe(path, options || {}, function(er, is) {
					if (er) reject(er);
					else resolve(is);
				});
			});
		}
		core(path, options || {}, function(er, is) {
			if (er) {
				if (er.code === "EACCES" || options && options.ignoreErrors) {
					er = null;
					is = false;
				}
			}
			cb(er, is);
		});
	}
	function sync(path, options) {
		try {
			return core.sync(path, options || {});
		} catch (er) {
			if (options && options.ignoreErrors || er.code === "EACCES") return false;
			else throw er;
		}
	}
}));
//#endregion
//#region node_modules/which/which.js
var require_which = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var isWindows = process.platform === "win32" || process.env.OSTYPE === "cygwin" || process.env.OSTYPE === "msys";
	var path$2 = __require("path");
	var COLON = isWindows ? ";" : ":";
	var isexe = require_isexe();
	var getNotFoundError = (cmd) => Object.assign(/* @__PURE__ */ new Error(`not found: ${cmd}`), { code: "ENOENT" });
	var getPathInfo = (cmd, opt) => {
		const colon = opt.colon || COLON;
		const pathEnv = cmd.match(/\//) || isWindows && cmd.match(/\\/) ? [""] : [...isWindows ? [process.cwd()] : [], ...(opt.path || process.env.PATH || "").split(colon)];
		const pathExtExe = isWindows ? opt.pathExt || process.env.PATHEXT || ".EXE;.CMD;.BAT;.COM" : "";
		const pathExt = isWindows ? pathExtExe.split(colon) : [""];
		if (isWindows) {
			if (cmd.indexOf(".") !== -1 && pathExt[0] !== "") pathExt.unshift("");
		}
		return {
			pathEnv,
			pathExt,
			pathExtExe
		};
	};
	var which = (cmd, opt, cb) => {
		if (typeof opt === "function") {
			cb = opt;
			opt = {};
		}
		if (!opt) opt = {};
		const { pathEnv, pathExt, pathExtExe } = getPathInfo(cmd, opt);
		const found = [];
		const step = (i) => new Promise((resolve, reject) => {
			if (i === pathEnv.length) return opt.all && found.length ? resolve(found) : reject(getNotFoundError(cmd));
			const ppRaw = pathEnv[i];
			const pathPart = /^".*"$/.test(ppRaw) ? ppRaw.slice(1, -1) : ppRaw;
			const pCmd = path$2.join(pathPart, cmd);
			const p = !pathPart && /^\.[\\\/]/.test(cmd) ? cmd.slice(0, 2) + pCmd : pCmd;
			resolve(subStep(p, i, 0));
		});
		const subStep = (p, i, ii) => new Promise((resolve, reject) => {
			if (ii === pathExt.length) return resolve(step(i + 1));
			const ext = pathExt[ii];
			isexe(p + ext, { pathExt: pathExtExe }, (er, is) => {
				if (!er && is) if (opt.all) found.push(p + ext);
				else return resolve(p + ext);
				return resolve(subStep(p, i, ii + 1));
			});
		});
		return cb ? step(0).then((res) => cb(null, res), cb) : step(0);
	};
	var whichSync = (cmd, opt) => {
		opt = opt || {};
		const { pathEnv, pathExt, pathExtExe } = getPathInfo(cmd, opt);
		const found = [];
		for (let i = 0; i < pathEnv.length; i++) {
			const ppRaw = pathEnv[i];
			const pathPart = /^".*"$/.test(ppRaw) ? ppRaw.slice(1, -1) : ppRaw;
			const pCmd = path$2.join(pathPart, cmd);
			const p = !pathPart && /^\.[\\\/]/.test(cmd) ? cmd.slice(0, 2) + pCmd : pCmd;
			for (let j = 0; j < pathExt.length; j++) {
				const cur = p + pathExt[j];
				try {
					if (isexe.sync(cur, { pathExt: pathExtExe })) if (opt.all) found.push(cur);
					else return cur;
				} catch (ex) {}
			}
		}
		if (opt.all && found.length) return found;
		if (opt.nothrow) return null;
		throw getNotFoundError(cmd);
	};
	module.exports = which;
	which.sync = whichSync;
}));
//#endregion
//#region node_modules/path-key/index.js
var require_path_key = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var pathKey = (options = {}) => {
		const environment = options.env || process.env;
		if ((options.platform || process.platform) !== "win32") return "PATH";
		return Object.keys(environment).reverse().find((key) => key.toUpperCase() === "PATH") || "Path";
	};
	module.exports = pathKey;
	module.exports.default = pathKey;
}));
//#endregion
//#region node_modules/cross-spawn/lib/util/resolveCommand.js
var require_resolveCommand = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var path$1 = __require("path");
	var which = require_which();
	var getPathKey = require_path_key();
	function resolveCommandAttempt(parsed, withoutPathExt) {
		const env = parsed.options.env || process.env;
		const cwd = process.cwd();
		const hasCustomCwd = parsed.options.cwd != null;
		const shouldSwitchCwd = hasCustomCwd && process.chdir !== void 0 && !process.chdir.disabled;
		if (shouldSwitchCwd) try {
			process.chdir(parsed.options.cwd);
		} catch (err) {}
		let resolved;
		try {
			resolved = which.sync(parsed.command, {
				path: env[getPathKey({ env })],
				pathExt: withoutPathExt ? path$1.delimiter : void 0
			});
		} catch (e) {} finally {
			if (shouldSwitchCwd) process.chdir(cwd);
		}
		if (resolved) resolved = path$1.resolve(hasCustomCwd ? parsed.options.cwd : "", resolved);
		return resolved;
	}
	function resolveCommand(parsed) {
		return resolveCommandAttempt(parsed) || resolveCommandAttempt(parsed, true);
	}
	module.exports = resolveCommand;
}));
//#endregion
//#region node_modules/cross-spawn/lib/util/escape.js
var require_escape = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var metaCharsRegExp = /([()\][%!^"`<>&|;, *?])/g;
	function escapeCommand(arg) {
		arg = arg.replace(metaCharsRegExp, "^$1");
		return arg;
	}
	function escapeArgument(arg, doubleEscapeMetaChars) {
		arg = `${arg}`;
		arg = arg.replace(/(?=(\\+?)?)\1"/g, "$1$1\\\"");
		arg = arg.replace(/(?=(\\+?)?)\1$/, "$1$1");
		arg = `"${arg}"`;
		arg = arg.replace(metaCharsRegExp, "^$1");
		if (doubleEscapeMetaChars) arg = arg.replace(metaCharsRegExp, "^$1");
		return arg;
	}
	module.exports.command = escapeCommand;
	module.exports.argument = escapeArgument;
}));
//#endregion
//#region node_modules/shebang-regex/index.js
var require_shebang_regex = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = /^#!(.*)/;
}));
//#endregion
//#region node_modules/shebang-command/index.js
var require_shebang_command = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var shebangRegex = require_shebang_regex();
	module.exports = (string = "") => {
		const match = string.match(shebangRegex);
		if (!match) return null;
		const [path, argument] = match[0].replace(/#! ?/, "").split(" ");
		const binary = path.split("/").pop();
		if (binary === "env") return argument;
		return argument ? `${binary} ${argument}` : binary;
	};
}));
//#endregion
//#region node_modules/cross-spawn/lib/util/readShebang.js
var require_readShebang = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var fs = __require("fs");
	var shebangCommand = require_shebang_command();
	function readShebang(command) {
		const size = 150;
		const buffer = Buffer.alloc(size);
		let fd;
		try {
			fd = fs.openSync(command, "r");
			fs.readSync(fd, buffer, 0, size, 0);
			fs.closeSync(fd);
		} catch (e) {}
		return shebangCommand(buffer.toString());
	}
	module.exports = readShebang;
}));
//#endregion
//#region node_modules/cross-spawn/lib/parse.js
var require_parse = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var path = __require("path");
	var resolveCommand = require_resolveCommand();
	var escape = require_escape();
	var readShebang = require_readShebang();
	var isWin = process.platform === "win32";
	var isExecutableRegExp = /\.(?:com|exe)$/i;
	var isCmdShimRegExp = /node_modules[\\/].bin[\\/][^\\/]+\.cmd$/i;
	function detectShebang(parsed) {
		parsed.file = resolveCommand(parsed);
		const shebang = parsed.file && readShebang(parsed.file);
		if (shebang) {
			parsed.args.unshift(parsed.file);
			parsed.command = shebang;
			return resolveCommand(parsed);
		}
		return parsed.file;
	}
	function parseNonShell(parsed) {
		if (!isWin) return parsed;
		const commandFile = detectShebang(parsed);
		const needsShell = !isExecutableRegExp.test(commandFile);
		if (parsed.options.forceShell || needsShell) {
			const needsDoubleEscapeMetaChars = isCmdShimRegExp.test(commandFile);
			parsed.command = path.normalize(parsed.command);
			parsed.command = escape.command(parsed.command);
			parsed.args = parsed.args.map((arg) => escape.argument(arg, needsDoubleEscapeMetaChars));
			parsed.args = [
				"/d",
				"/s",
				"/c",
				`"${[parsed.command].concat(parsed.args).join(" ")}"`
			];
			parsed.command = process.env.comspec || "cmd.exe";
			parsed.options.windowsVerbatimArguments = true;
		}
		return parsed;
	}
	function parse(command, args, options) {
		if (args && !Array.isArray(args)) {
			options = args;
			args = null;
		}
		args = args ? args.slice(0) : [];
		options = Object.assign({}, options);
		const parsed = {
			command,
			args,
			options,
			file: void 0,
			original: {
				command,
				args
			}
		};
		return options.shell ? parsed : parseNonShell(parsed);
	}
	module.exports = parse;
}));
//#endregion
//#region node_modules/cross-spawn/lib/enoent.js
var require_enoent = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var isWin = process.platform === "win32";
	function notFoundError(original, syscall) {
		return Object.assign(/* @__PURE__ */ new Error(`${syscall} ${original.command} ENOENT`), {
			code: "ENOENT",
			errno: "ENOENT",
			syscall: `${syscall} ${original.command}`,
			path: original.command,
			spawnargs: original.args
		});
	}
	function hookChildProcess(cp, parsed) {
		if (!isWin) return;
		const originalEmit = cp.emit;
		cp.emit = function(name, arg1) {
			if (name === "exit") {
				const err = verifyENOENT(arg1, parsed);
				if (err) return originalEmit.call(cp, "error", err);
			}
			return originalEmit.apply(cp, arguments);
		};
	}
	function verifyENOENT(status, parsed) {
		if (isWin && status === 1 && !parsed.file) return notFoundError(parsed.original, "spawn");
		return null;
	}
	function verifyENOENTSync(status, parsed) {
		if (isWin && status === 1 && !parsed.file) return notFoundError(parsed.original, "spawnSync");
		return null;
	}
	module.exports = {
		hookChildProcess,
		verifyENOENT,
		verifyENOENTSync,
		notFoundError
	};
}));
//#endregion
//#region node_modules/@modelcontextprotocol/sdk/dist/esm/shared/stdio.js
var import_cross_spawn = /* @__PURE__ */ __toESM((/* @__PURE__ */ __commonJSMin(((exports, module) => {
	var cp = __require("child_process");
	var parse = require_parse();
	var enoent = require_enoent();
	function spawn(command, args, options) {
		const parsed = parse(command, args, options);
		const spawned = cp.spawn(parsed.command, parsed.args, parsed.options);
		enoent.hookChildProcess(spawned, parsed);
		return spawned;
	}
	function spawnSync(command, args, options) {
		const parsed = parse(command, args, options);
		const result = cp.spawnSync(parsed.command, parsed.args, parsed.options);
		result.error = result.error || enoent.verifyENOENTSync(result.status, parsed);
		return result;
	}
	module.exports = spawn;
	module.exports.spawn = spawn;
	module.exports.sync = spawnSync;
	module.exports._parse = parse;
	module.exports._enoent = enoent;
})))(), 1);
/**
* Buffers a continuous stdio stream into discrete JSON-RPC messages.
*/
var ReadBuffer = class {
	constructor(options) {
		this._maxBufferSize = options?.maxBufferSize ?? 10485760;
	}
	append(chunk) {
		if ((this._buffer?.length ?? 0) + chunk.length > this._maxBufferSize) {
			this.clear();
			throw new Error(`ReadBuffer exceeded maximum size of ${this._maxBufferSize} bytes`);
		}
		this._buffer = this._buffer ? Buffer.concat([this._buffer, chunk]) : chunk;
	}
	readMessage() {
		if (!this._buffer) return null;
		const index = this._buffer.indexOf("\n");
		if (index === -1) return null;
		const line = this._buffer.toString("utf8", 0, index).replace(/\r$/, "");
		this._buffer = this._buffer.subarray(index + 1);
		return deserializeMessage(line);
	}
	clear() {
		this._buffer = void 0;
	}
};
function deserializeMessage(line) {
	return JSONRPCMessageSchema.parse(JSON.parse(line));
}
function serializeMessage(message) {
	return JSON.stringify(message) + "\n";
}
//#endregion
//#region node_modules/@modelcontextprotocol/sdk/dist/esm/client/stdio.js
/**
* Environment variables to inherit by default, if an environment is not explicitly given.
*/
var DEFAULT_INHERITED_ENV_VARS = process$1.platform === "win32" ? [
	"APPDATA",
	"HOMEDRIVE",
	"HOMEPATH",
	"LOCALAPPDATA",
	"PATH",
	"PROCESSOR_ARCHITECTURE",
	"SYSTEMDRIVE",
	"SYSTEMROOT",
	"TEMP",
	"USERNAME",
	"USERPROFILE",
	"PROGRAMFILES"
] : [
	"HOME",
	"LOGNAME",
	"PATH",
	"SHELL",
	"TERM",
	"USER"
];
/**
* Returns a default environment object including only environment variables deemed safe to inherit.
*/
function getDefaultEnvironment() {
	const env = {};
	for (const key of DEFAULT_INHERITED_ENV_VARS) {
		const value = process$1.env[key];
		if (value === void 0) continue;
		if (value.startsWith("()")) continue;
		env[key] = value;
	}
	return env;
}
/**
* Client transport for stdio: this will connect to a server by spawning a process and communicating with it over stdin/stdout.
*
* This transport is only available in Node.js environments.
*/
var StdioClientTransport = class {
	constructor(server) {
		this._stderrStream = null;
		this._serverParams = server;
		this._readBuffer = new ReadBuffer({ maxBufferSize: server.maxBufferSize });
		if (server.stderr === "pipe" || server.stderr === "overlapped") this._stderrStream = new PassThrough();
	}
	/**
	* Starts the server process and prepares to communicate with it.
	*/
	async start() {
		if (this._process) throw new Error("StdioClientTransport already started! If using Client class, note that connect() calls start() automatically.");
		return new Promise((resolve, reject) => {
			this._process = (0, import_cross_spawn.default)(this._serverParams.command, this._serverParams.args ?? [], {
				env: {
					...getDefaultEnvironment(),
					...this._serverParams.env
				},
				stdio: [
					"pipe",
					"pipe",
					this._serverParams.stderr ?? "inherit"
				],
				shell: false,
				windowsHide: process$1.platform === "win32",
				cwd: this._serverParams.cwd
			});
			this._process.on("error", (error) => {
				reject(error);
				this.onerror?.(error);
			});
			this._process.on("spawn", () => {
				resolve();
			});
			this._process.on("close", (_code) => {
				this._process = void 0;
				this.onclose?.();
			});
			this._process.stdin?.on("error", (error) => {
				this.onerror?.(error);
			});
			this._process.stdout?.on("data", (chunk) => {
				try {
					this._readBuffer.append(chunk);
					this.processReadBuffer();
				} catch (error) {
					this.onerror?.(error);
					this.close().catch(() => {});
				}
			});
			this._process.stdout?.on("error", (error) => {
				this.onerror?.(error);
			});
			if (this._stderrStream && this._process.stderr) this._process.stderr.pipe(this._stderrStream);
		});
	}
	/**
	* The stderr stream of the child process, if `StdioServerParameters.stderr` was set to "pipe" or "overlapped".
	*
	* If stderr piping was requested, a PassThrough stream is returned _immediately_, allowing callers to
	* attach listeners before the start method is invoked. This prevents loss of any early
	* error output emitted by the child process.
	*/
	get stderr() {
		if (this._stderrStream) return this._stderrStream;
		return this._process?.stderr ?? null;
	}
	/**
	* The child process pid spawned by this transport.
	*
	* This is only available after the transport has been started.
	*/
	get pid() {
		return this._process?.pid ?? null;
	}
	processReadBuffer() {
		while (true) try {
			const message = this._readBuffer.readMessage();
			if (message === null) break;
			this.onmessage?.(message);
		} catch (error) {
			this.onerror?.(error);
		}
	}
	async close() {
		if (this._process) {
			const processToClose = this._process;
			this._process = void 0;
			const closePromise = new Promise((resolve) => {
				processToClose.once("close", () => {
					resolve();
				});
			});
			try {
				processToClose.stdin?.end();
			} catch {}
			await Promise.race([closePromise, new Promise((resolve) => setTimeout(resolve, 2e3).unref())]);
			if (processToClose.exitCode === null) {
				try {
					processToClose.kill("SIGTERM");
				} catch {}
				await Promise.race([closePromise, new Promise((resolve) => setTimeout(resolve, 2e3).unref())]);
			}
			if (processToClose.exitCode === null) try {
				processToClose.kill("SIGKILL");
			} catch {}
		}
		this._readBuffer.clear();
	}
	send(message) {
		return new Promise((resolve) => {
			if (!this._process?.stdin) throw new Error("Not connected");
			const json = serializeMessage(message);
			if (this._process.stdin.write(json)) resolve();
			else this._process.stdin.once("drain", resolve);
		});
	}
};
//#endregion
//#region node_modules/@langchain/mcp-adapters/dist/connection.js
var debugLog$1 = getDebugLog("connection");
var transportTypes = [
	"http",
	"sse",
	"stdio"
];
/**
* Manages a pool of MCP clients with different transport, server name and connection configurations.
* This ensures we don't create multiple connections for the same server with the same configuration.
*/
var ConnectionManager = class {
	#connections = /* @__PURE__ */ new Map();
	#hooks;
	constructor(hooks = {}) {
		this.#hooks = hooks;
	}
	async createClient(...args) {
		const [type, serverName, options] = args;
		if (!transportTypes.includes(type)) throw new Error(`Invalid transport type: ${type}`);
		const transport = type === "http" ? await this.#createStreamableHTTPTransport(serverName, options) : type === "sse" ? await this.#createSSETransport(serverName, options) : await this.#createStdioTransport(options);
		const mcpClient = new Client({
			name: package_default.name,
			version: package_default.version
		});
		await mcpClient.connect(transport);
		if (this.#hooks.onMessage) mcpClient.setNotificationHandler(LoggingMessageNotificationSchema, (notification) => this.#hooks.onMessage?.(notification.params, {
			server: serverName,
			options
		}));
		if (this.#hooks.onInitialized) mcpClient.setNotificationHandler(InitializedNotificationSchema, () => this.#hooks.onInitialized?.({
			server: serverName,
			options
		}));
		if (this.#hooks.onCancelled) mcpClient.setNotificationHandler(CancelledNotificationSchema, (notification) => {
			const { requestId, reason } = notification.params;
			if (requestId == null) return;
			const result = this.#hooks.onCancelled?.({
				requestId,
				reason
			}, {
				server: serverName,
				options
			});
			if (result && typeof result.catch === "function") result.catch(() => {});
		});
		if (this.#hooks.onPromptsListChanged) mcpClient.setNotificationHandler(PromptListChangedNotificationSchema, () => this.#hooks.onPromptsListChanged?.({
			server: serverName,
			options
		}));
		if (this.#hooks.onResourcesListChanged) mcpClient.setNotificationHandler(ResourceListChangedNotificationSchema, () => this.#hooks.onResourcesListChanged?.({
			server: serverName,
			options
		}));
		if (this.#hooks.onResourcesUpdated) mcpClient.setNotificationHandler(ResourceUpdatedNotificationSchema, (notification) => this.#hooks.onResourcesUpdated?.(notification.params, {
			server: serverName,
			options
		}));
		if (this.#hooks.onRootsListChanged) mcpClient.setNotificationHandler(RootsListChangedNotificationSchema, () => this.#hooks.onRootsListChanged?.({
			server: serverName,
			options
		}));
		if (this.#hooks.onToolsListChanged) mcpClient.setNotificationHandler(ToolListChangedNotificationSchema, () => this.#hooks.onToolsListChanged?.({
			server: serverName,
			options
		}));
		const key = type === "stdio" ? { serverName } : {
			serverName,
			headers: serializeHeaders(options.headers),
			authProvider: options.authProvider
		};
		const forkClient = (headers) => {
			return this.#forkClient(key, headers);
		};
		const client = new Proxy(mcpClient, { get(target, prop) {
			if (prop === "fork") return forkClient.bind(this);
			return target[prop];
		} });
		this.#connections.set(key, {
			transport,
			client,
			transportOptions: options,
			closeCallback: async () => client.close()
		});
		return client;
	}
	/**
	* Allows to fork a client with a new set of headers
	*/
	#forkClient(key, headers) {
		const [, connection] = [...this.#connections.entries()].find(([k]) => key === k) ?? [];
		if (!connection) throw new Error("Transport not found");
		const type = connection.transportOptions.type ?? connection.transportOptions.transport;
		if (type === "stdio") throw new Error("Forking stdio transport is not supported");
		return this.createClient(type, key.serverName, {
			...connection.transportOptions,
			headers
		});
	}
	get(options) {
		if (typeof options === "string") return this.#queryConnection({ serverName: options })?.connection.client;
		return this.#queryConnection(options)?.connection.client;
	}
	/**
	* Get all clients
	* @returns All clients
	*/
	getAllClients() {
		return Array.from(this.#connections.values()).map((connection) => connection.client);
	}
	/**
	* Find the connection based on the parameter provided. This approach makes sure
	* that `this.get({ serverName })` and `this.get({ serverName, headers: undefined, authProvider: undefined })`
	* will return the same connection.
	*
	* @param options - The options for the transport
	* @returns The connection and the key
	*/
	#queryConnection(options) {
		const headers = serializeHeaders(options.headers);
		const [key, connection] = [...this.#connections.entries()].find(([key$1]) => {
			if (options.headers && options.authProvider) return key$1.serverName === options.serverName && key$1.headers === headers && key$1.authProvider === options.authProvider;
			if (options.headers && !options.authProvider) return key$1.serverName === options.serverName && key$1.headers === headers;
			if (options.authProvider && !options.headers) return key$1.serverName === options.serverName && key$1.authProvider === options.authProvider;
			return key$1.serverName === options.serverName;
		}) ?? [];
		if (key && connection) return {
			key,
			connection
		};
	}
	has(options) {
		return Boolean(typeof options === "string" ? this.get(options) : this.get(options));
	}
	/**
	* Delete the transport based on server name and connection configuration.
	* @param options - The options for the transport, if not provided, all transports are deleted
	*/
	async delete(options) {
		if (!options) {
			await Promise.all(Array.from(this.#connections.values()).map((connection) => connection.closeCallback()));
			this.#connections.clear();
			return;
		}
		const result = this.#queryConnection(options);
		if (result) {
			await result.connection.closeCallback();
			this.#connections.delete(result.key);
		}
	}
	getTransport(opts) {
		/**
		* if a client instance is passed in
		*/
		if ("listTools" in opts) return [...this.#connections.values()].find((connection$1) => connection$1.client === opts)?.transport;
		const result = this.#queryConnection(opts);
		if (result) return result.connection.transport;
	}
	async #createStreamableHTTPTransport(serverName, args) {
		const { url, headers, reconnect, authProvider } = args;
		const options = {
			...authProvider ? { authProvider } : {},
			...headers ? { requestInit: { headers } } : {}
		};
		if (reconnect != null) {
			const reconnectionOptions = {
				initialReconnectionDelay: reconnect?.delayMs ?? 1e3,
				maxReconnectionDelay: reconnect?.delayMs ?? 3e4,
				maxRetries: reconnect?.maxAttempts ?? 2,
				reconnectionDelayGrowFactor: 1.5
			};
			if (reconnect.enabled === false) reconnectionOptions.maxRetries = 0;
			options.reconnectionOptions = reconnectionOptions;
		}
		if (options.requestInit?.headers) debugLog$1(`DEBUG: Using custom headers for SSE transport to server "${serverName}"`);
		if (options.authProvider) debugLog$1(`DEBUG: Using OAuth authentication for Streamable HTTP transport to server "${serverName}"`);
		if (options.reconnectionOptions) if (options.reconnectionOptions.maxRetries === 0) debugLog$1(`DEBUG: Disabling reconnection for Streamable HTTP transport to server "${serverName}"`);
		else debugLog$1(`DEBUG: Using custom reconnection options for Streamable HTTP transport to server "${serverName}"`);
		return Object.keys(options).length > 0 ? new StreamableHTTPClientTransport(new URL(url), options) : new StreamableHTTPClientTransport(new URL(url));
	}
	/**
	* Create an SSE transport with appropriate EventSource implementation
	*
	* @param serverName - The name of the server
	* @param url - The URL of the server
	* @param headers - The headers to send with the request
	* @param authProvider - The OAuth client provider to use for authentication
	* @returns The SSE transport
	*/
	async #createSSETransport(serverName, args) {
		const { url, headers, authProvider } = args;
		const options = {};
		if (authProvider) {
			options.authProvider = authProvider;
			debugLog$1(`DEBUG: Using OAuth authentication for SSE transport to server "${serverName}"`);
		}
		if (headers) {
			options.eventSourceInit = { fetch: async (url$1, init) => {
				const requestHeaders = new Headers(init?.headers);
				if (authProvider) {
					const tokens = await authProvider.tokens();
					if (tokens) requestHeaders.set("Authorization", `Bearer ${tokens.access_token}`);
				}
				Object.entries(headers).forEach(([key, value]) => {
					requestHeaders.set(key, value);
				});
				requestHeaders.set("Accept", "text/event-stream");
				return fetch(url$1, {
					...init,
					headers: requestHeaders
				});
			} };
			options.requestInit = { headers };
			debugLog$1(`DEBUG: Using custom headers for SSE transport to server "${serverName}"`);
		}
		return new SSEClientTransport(new URL(url), options);
	}
	#createStdioTransport(options) {
		const { command, args, env, stderr, cwd } = options;
		return new StdioClientTransport({
			command,
			args,
			stderr,
			cwd,
			...env ? { env: {
				PATH: process.env.PATH,
				...env
			} } : {}
		});
	}
};
/**
* A utility function that serializes the headers object to a string
* and orders the keys alphabetically so that the same headers object
* will always produce the same string.
* @param headers - The headers object to serialize
* @returns The serialized headers object
*/
function serializeHeaders(headers) {
	if (!headers) return;
	return Object.entries(headers).sort(([a], [b]) => a.localeCompare(b)).map(([key, value]) => `${key}: ${value}`).join("\n");
}
//#endregion
//#region node_modules/@langchain/mcp-adapters/dist/client.js
var debugLog = getDebugLog();
/**
* Error class for MCP client operations
*/
var MCPClientError = class extends Error {
	constructor(message, serverName) {
		super(message);
		this.serverName = serverName;
		this.name = "MCPClientError";
	}
};
/**
* Checks if the connection configuration is for a stdio transport
* @param connection - The connection configuration
* @returns True if the connection configuration is for a stdio transport
*/
function isResolvedStdioConnection(connection) {
	if (typeof connection !== "object" || connection === null || Array.isArray(connection)) return false;
	if ("transport" in connection && connection.transport === "stdio") return true;
	if ("type" in connection && connection.type === "stdio") return true;
	if ("command" in connection && typeof connection.command === "string") return true;
	return false;
}
/**
* Checks if the connection configuration is for a streamable HTTP transport
* @param connection - The connection configuration
* @returns True if the connection configuration is for a streamable HTTP transport
*/
function isResolvedStreamableHTTPConnection(connection) {
	if (typeof connection !== "object" || connection === null || Array.isArray(connection)) return false;
	if ("transport" in connection && typeof connection.transport === "string" && ["http", "sse"].includes(connection.transport) || "type" in connection && typeof connection.type === "string" && ["http", "sse"].includes(connection.type)) return true;
	if ("url" in connection && typeof connection.url === "string") try {
		new URL(connection.url);
		return true;
	} catch {
		return false;
	}
	return false;
}
/**
* Client for connecting to multiple MCP servers and loading LangChain-compatible tools.
*/
var MultiServerMCPClient = class {
	/**
	* Cached map of server names to tools
	*/
	#serverNameToTools = {};
	/**
	* Configured MCP servers
	*/
	#mcpServers;
	/**
	* Cached map of server names to load tools options
	*/
	#loadToolsOptions = {};
	/**
	* Connection manager
	*/
	#clientConnections;
	/**
	* Resolved client config
	*/
	#config;
	/**
	* Behavior when a server fails to connect
	*/
	#onConnectionError;
	/**
	* Set of server names that have failed to connect (when onConnectionError is "ignore")
	*/
	#failedServers = /* @__PURE__ */ new Set();
	/**
	* Returns clone of server config for inspection purposes.
	*
	* Client does not support config modifications.
	*/
	get config() {
		return JSON.parse(JSON.stringify(this.#config));
	}
	/**
	* Create a new MultiServerMCPClient.
	*
	* @param config - Configuration object
	*/
	constructor(config) {
		let parsedServerConfig;
		const configSchema = clientConfigSchema;
		if ("mcpServers" in config) parsedServerConfig = configSchema.parse(config);
		else {
			const parsedMcpServers = recordType(connectionSchema).parse(config);
			parsedServerConfig = configSchema.parse({ mcpServers: parsedMcpServers });
		}
		if (Object.keys(parsedServerConfig.mcpServers).length === 0) throw new MCPClientError("No MCP servers provided");
		for (const [serverName, serverConfig] of Object.entries(parsedServerConfig.mcpServers)) {
			const outputHandling = _resolveAndApplyOverrideHandlingOverrides(parsedServerConfig.outputHandling, serverConfig.outputHandling);
			const defaultToolTimeout = parsedServerConfig.defaultToolTimeout ?? serverConfig.defaultToolTimeout;
			this.#loadToolsOptions[serverName] = {
				throwOnLoadError: parsedServerConfig.throwOnLoadError,
				prefixToolNameWithServerName: parsedServerConfig.prefixToolNameWithServerName,
				additionalToolNamePrefix: parsedServerConfig.additionalToolNamePrefix,
				useStandardContentBlocks: parsedServerConfig.useStandardContentBlocks,
				...Object.keys(outputHandling).length > 0 ? { outputHandling } : {},
				...defaultToolTimeout ? { defaultToolTimeout } : {},
				onProgress: parsedServerConfig.onProgress,
				beforeToolCall: parsedServerConfig.beforeToolCall,
				afterToolCall: parsedServerConfig.afterToolCall
			};
		}
		this.#config = parsedServerConfig;
		this.#mcpServers = parsedServerConfig.mcpServers;
		this.#clientConnections = new ConnectionManager(parsedServerConfig);
		this.#onConnectionError = parsedServerConfig.onConnectionError;
	}
	/**
	* Proactively initialize connections to all servers. This will be called automatically when
	* methods requiring an active connection (like {@link getTools} or {@link getClient}) are called,
	* but you can call it directly to ensure all connections are established before using the tools.
	*
	* When a server fails to connect, the client will throw an error if `onConnectionError` is "throw",
	* otherwise it will skip the server and continue with the remaining servers.
	*
	* @returns A map of server names to arrays of tools
	* @throws {MCPClientError} If initialization fails and `onConnectionError` is "throw" (default)
	*/
	async initializeConnections(customTransportOptions) {
		if (!this.#mcpServers || Object.keys(this.#mcpServers).length === 0) throw new MCPClientError("No connections to initialize");
		for (const [serverName, connection] of Object.entries(this.#mcpServers)) {
			if ((this.#onConnectionError === "ignore" || typeof this.#onConnectionError === "function") && this.#failedServers.has(serverName)) continue;
			try {
				await this._initializeConnection(serverName, connection, customTransportOptions);
				this.#failedServers.delete(serverName);
			} catch (error) {
				if (this.#onConnectionError === "throw") throw error;
				if (typeof this.#onConnectionError === "function") {
					this.#onConnectionError({
						serverName,
						error
					});
					this.#failedServers.add(serverName);
					debugLog(`WARN: Failed to initialize connection to server "${serverName}": ${String(error)}`);
					continue;
				}
				this.#failedServers.add(serverName);
				debugLog(`WARN: Failed to initialize connection to server "${serverName}": ${String(error)}`);
				continue;
			}
		}
		if (this.#onConnectionError === "ignore" && Object.keys(this.#serverNameToTools).length === 0) debugLog(`WARN: No servers successfully connected. All connection attempts failed.`);
		return this.#serverNameToTools;
	}
	async getTools(...args) {
		if (args.length === 0 || args.every((arg) => typeof arg === "string")) {
			await this.initializeConnections();
			const servers$1 = args;
			return servers$1.length === 0 ? this._getAllToolsAsFlatArray() : this._getToolsFromServers(servers$1);
		}
		const [servers, options] = args;
		await this.initializeConnections(options);
		return servers.length === 0 ? this._getAllToolsAsFlatArray() : this._getToolsFromServers(servers);
	}
	async setLoggingLevel(...args) {
		if (args.length === 1 && typeof args[0] === "string") {
			const level$1 = args[0];
			await Promise.all(this.#clientConnections.getAllClients().map((client) => client.setLoggingLevel(level$1)));
			return;
		}
		const [serverName, level] = args;
		await this.#clientConnections.get(serverName)?.setLoggingLevel(level);
	}
	/**
	* Get a the MCP client for a specific server. Useful for fetching prompts or resources from that server.
	*
	* @param serverName - The name of the server
	* @returns The client for the server, or undefined if the server is not connected
	*/
	async getClient(serverName, options) {
		await this.initializeConnections(options);
		return this.#clientConnections.get({
			serverName,
			headers: options?.headers,
			authProvider: options?.authProvider
		});
	}
	async listResources(...args) {
		let servers;
		let options;
		if (args.length === 0 || args.every((arg) => typeof arg === "string")) {
			servers = args;
			await this.initializeConnections();
		} else {
			[servers, options] = args;
			await this.initializeConnections(options);
		}
		const targetServers = servers.length > 0 ? servers : Object.keys(this.#config.mcpServers);
		const result = {};
		for (const serverName of targetServers) {
			const client = await this.getClient(serverName, options);
			if (!client) {
				debugLog(`WARN: Server "${serverName}" not found or not connected`);
				continue;
			}
			try {
				result[serverName] = (await client.listResources()).resources.map((resource) => ({
					uri: resource.uri,
					name: resource.title ?? resource.name,
					description: resource.description,
					mimeType: resource.mimeType
				}));
				debugLog(`INFO: Listed ${result[serverName].length} resources from server "${serverName}"`);
			} catch (error) {
				debugLog(`ERROR: Failed to list resources from server "${serverName}": ${error}`);
				result[serverName] = [];
			}
		}
		return result;
	}
	async listResourceTemplates(...args) {
		let servers;
		let options;
		if (args.length === 0 || args.every((arg) => typeof arg === "string")) {
			servers = args;
			await this.initializeConnections();
		} else {
			[servers, options] = args;
			await this.initializeConnections(options);
		}
		const targetServers = servers.length > 0 ? servers : Object.keys(this.#config.mcpServers);
		const result = {};
		for (const serverName of targetServers) {
			const client = await this.getClient(serverName, options);
			if (!client) {
				debugLog(`WARN: Server "${serverName}" not found or not connected`);
				continue;
			}
			try {
				result[serverName] = (await client.listResourceTemplates()).resourceTemplates.map((template) => ({
					uriTemplate: template.uriTemplate,
					name: template.title ?? template.name,
					description: template.description,
					mimeType: template.mimeType
				}));
				debugLog(`INFO: Listed ${result[serverName].length} resource templates from server "${serverName}"`);
			} catch (error) {
				debugLog(`ERROR: Failed to list resource templates from server "${serverName}": ${error}`);
				result[serverName] = [];
			}
		}
		return result;
	}
	/**
	* Read a resource from a specific server.
	*
	* @param serverName - The name of the server to read the resource from
	* @param uri - The URI of the resource to read
	* @param options - Optional connection options for reading the resource, e.g. custom auth provider or headers.
	* @returns The resource contents
	*
	* @example
	* ```ts
	* const content = await client.readResource("server1", "file://path/to/resource");
	* ```
	*/
	async readResource(serverName, uri, options) {
		await this.initializeConnections(options);
		const client = await this.getClient(serverName, options);
		if (!client) throw new MCPClientError(`Server "${serverName}" not found or not connected`, serverName);
		try {
			debugLog(`INFO: Reading resource "${uri}" from server "${serverName}"`);
			return (await client.readResource({ uri })).contents.map((content) => ({
				uri: content.uri,
				mimeType: content.mimeType,
				text: "text" in content ? content.text : void 0,
				blob: "blob" in content ? content.blob : void 0
			}));
		} catch (error) {
			throw new MCPClientError(`Failed to read resource "${uri}" from server "${serverName}": ${error}`, serverName);
		}
	}
	/**
	* Close all connections.
	*/
	async close() {
		debugLog(`INFO: Closing all MCP connections...`);
		this.#serverNameToTools = {};
		this.#failedServers.clear();
		await this.#clientConnections.delete();
		debugLog(`INFO: All MCP connections closed`);
	}
	/**
	* Initialize a connection to a specific server
	*/
	async _initializeConnection(serverName, connection, customTransportOptions) {
		if (isResolvedStdioConnection(connection)) {
			debugLog(`INFO: Initializing stdio connection to server "${serverName}"...`);
			/**
			* check if we already initialized this stdio connection
			*/
			if (this.#clientConnections.has(serverName)) return;
			await this._initializeStdioConnection(serverName, connection);
		} else if (isResolvedStreamableHTTPConnection(connection)) {
			/**
			* Users may want to use different connection options for tool calls or tool discovery.
			*/
			const { authProvider, headers } = customTransportOptions ?? {};
			const updatedConnection = {
				...connection,
				authProvider: authProvider ?? connection.authProvider,
				headers: {
					...headers,
					...connection.headers
				}
			};
			/**
			* check if we already initialized this streamable HTTP connection
			*/
			const key = {
				serverName,
				headers: updatedConnection.headers,
				authProvider: updatedConnection.authProvider
			};
			if (this.#clientConnections.has(key)) return;
			if (connection.type === "sse" || connection.transport === "sse") await this._initializeSSEConnection(serverName, updatedConnection);
			else await this._initializeStreamableHTTPConnection(serverName, updatedConnection);
		} else throw new MCPClientError(`Unsupported transport type for server "${serverName}"`, serverName);
	}
	/**
	* Initialize a stdio connection
	*/
	async _initializeStdioConnection(serverName, connection) {
		const { command, args, restart } = connection;
		debugLog(`DEBUG: Creating stdio transport for server "${serverName}" with command: ${command} ${args.join(" ")}`);
		try {
			const client = await this.#clientConnections.createClient("stdio", serverName, connection);
			const transport = this.#clientConnections.getTransport({ serverName });
			if (restart?.enabled) this._setupStdioRestart(serverName, transport, connection, restart);
			await this._loadToolsForServer(serverName, client);
		} catch (error) {
			throw new MCPClientError(`Failed to connect to stdio server "${serverName}": ${error}`, serverName);
		}
	}
	/**
	* Set up stdio restart handling
	*/
	_setupStdioRestart(serverName, transport, connection, restart) {
		const originalOnClose = transport.onclose;
		transport.onclose = async () => {
			if (originalOnClose) await originalOnClose();
			if (this.#clientConnections.get(serverName)) {
				debugLog(`INFO: Process for server "${serverName}" exited, attempting to restart...`);
				await this._attemptReconnect(serverName, connection, restart.maxAttempts, restart.delayMs);
			}
		};
	}
	_getHttpErrorCode(error) {
		const streamableError = error;
		let { code } = streamableError;
		if (code == null) {
			const m = streamableError.message.match(/\(HTTP (\d\d\d)\)/);
			if (m && m.length > 1) code = parseInt(m[1], 10);
		}
		return code;
	}
	_createAuthenticationErrorMessage(serverName, url, transport, originalError) {
		return `Authentication failed for ${transport} server "${serverName}" at ${url}. Please check your credentials, authorization headers, or OAuth configuration. Original error: ${originalError}`;
	}
	_toSSEConnectionURL(url) {
		const urlObj = new URL(url);
		const pathnameParts = urlObj.pathname.split("/");
		const lastPart = pathnameParts.at(-1);
		if (lastPart && lastPart === "mcp") pathnameParts[pathnameParts.length - 1] = "sse";
		urlObj.pathname = pathnameParts.join("/");
		return urlObj.toString();
	}
	/**
	* Initialize a streamable HTTP connection
	*/
	async _initializeStreamableHTTPConnection(serverName, connection) {
		const { url, type: typeField, transport: transportField } = connection;
		const automaticSSEFallback = connection.automaticSSEFallback ?? true;
		const transportType = typeField || transportField;
		debugLog(`DEBUG: Creating Streamable HTTP transport for server "${serverName}" with URL: ${url}`);
		if (transportType === "http" || transportType == null) try {
			const client = await this.#clientConnections.createClient("http", serverName, connection);
			await this._loadToolsForServer(serverName, client);
		} catch (error) {
			const code = this._getHttpErrorCode(error);
			if (automaticSSEFallback && code != null && code >= 400 && code < 500) try {
				await this._initializeSSEConnection(serverName, connection);
			} catch (firstSSEError) {
				const sseUrl = this._toSSEConnectionURL(url);
				if (sseUrl !== url) try {
					await this._initializeSSEConnection(serverName, {
						...connection,
						url: sseUrl
					});
				} catch (secondSSEError) {
					if (code === 401) throw new MCPClientError(this._createAuthenticationErrorMessage(serverName, url, "HTTP", `${error}. Also tried SSE fallback at ${url} and ${sseUrl}, but both failed with authentication errors.`), serverName);
					throw new MCPClientError(`Failed to connect to streamable HTTP server "${serverName}, url: ${url}": ${error}. Additionally, tried falling back to SSE at ${url} and ${sseUrl}, but this also failed: ${secondSSEError}`, serverName);
				}
				else {
					if (code === 401) throw new MCPClientError(this._createAuthenticationErrorMessage(serverName, url, "HTTP", `${error}. Also tried SSE fallback at ${url}, but it failed with authentication error: ${firstSSEError}`), serverName);
					throw new MCPClientError(`Failed to connect to streamable HTTP server after trying to fall back to SSE: "${serverName}, url: ${url}": ${error} (SSE fallback failed with error ${firstSSEError})`, serverName);
				}
			}
			else {
				if (code === 401) throw new MCPClientError(this._createAuthenticationErrorMessage(serverName, url, "HTTP", `${error}`), serverName);
				throw new MCPClientError(`Failed to connect to streamable HTTP server "${serverName}, url: ${url}": ${error}`, serverName);
			}
		}
	}
	/**
	* Initialize an SSE connection
	*
	* Don't call this directly unless SSE transport is explicitly requested. Otherwise,
	* use _initializeStreamableHTTPConnection and it'll fall back to SSE if needed for
	* backwards compatibility.
	*
	* @param serverName - The name of the server
	* @param connection - The connection configuration
	*/
	async _initializeSSEConnection(serverName, connection) {
		const { url, headers, reconnect, authProvider } = connection;
		try {
			const client = await this.#clientConnections.createClient("sse", serverName, connection);
			const transport = this.#clientConnections.getTransport({
				serverName,
				headers,
				authProvider
			});
			if (reconnect?.enabled) this._setupSSEReconnect(serverName, transport, connection, reconnect);
			await this._loadToolsForServer(serverName, client);
		} catch (error) {
			if (error && error.name === "MCPClientError") throw error;
			if (error && this._getHttpErrorCode(error) === 401) throw new MCPClientError(this._createAuthenticationErrorMessage(serverName, url, "SSE", `${error}`), serverName);
			throw new MCPClientError(`Failed to create SSE transport for server "${serverName}, url: ${url}": ${error}`, serverName);
		}
	}
	/**
	* Set up reconnect handling for SSE (Streamable HTTP reconnects are more complex and are handled internally by the SDK)
	*/
	_setupSSEReconnect(serverName, transport, connection, reconnect) {
		const originalOnClose = transport.onclose;
		transport.onclose = async () => {
			if (originalOnClose) await originalOnClose();
			if (this.#clientConnections.get({
				serverName,
				headers: connection.headers,
				authProvider: connection.authProvider
			})) {
				debugLog(`INFO: HTTP connection for server "${serverName}" closed, attempting to reconnect...`);
				await this._attemptReconnect(serverName, connection, reconnect.maxAttempts, reconnect.delayMs);
			}
		};
	}
	/**
	* Load tools for a specific server
	*/
	async _loadToolsForServer(serverName, client) {
		try {
			debugLog(`DEBUG: Loading tools for server "${serverName}"...`);
			const tools = await loadMcpTools(serverName, client, this.#loadToolsOptions[serverName]);
			this.#serverNameToTools[serverName] = tools;
			debugLog(`INFO: Successfully loaded ${tools.length} tools from server "${serverName}"`);
		} catch (error) {
			throw new MCPClientError(`Failed to load tools from server "${serverName}": ${error}`);
		}
	}
	/**
	* Attempt to reconnect to a server after a connection failure.
	*
	* @param serverName - The name of the server to reconnect to
	* @param connection - The connection configuration
	* @param maxAttempts - Maximum number of reconnection attempts
	* @param delayMs - Delay in milliseconds between reconnection attempts
	* @private
	*/
	async _attemptReconnect(serverName, connection, maxAttempts = 3, delayMs = 1e3) {
		let connected = false;
		let attempts = 0;
		if ("headers" in connection || "authProvider" in connection) {
			const { headers, authProvider } = connection;
			await this.#cleanupServerResources({
				serverName,
				authProvider,
				headers
			});
		} else await this.#cleanupServerResources({ serverName });
		while (!connected && (maxAttempts === void 0 || attempts < maxAttempts)) {
			attempts += 1;
			debugLog(`INFO: Reconnection attempt ${attempts}${maxAttempts ? `/${maxAttempts}` : ""} for server "${serverName}"`);
			try {
				if (delayMs) await new Promise((resolve) => {
					setTimeout(resolve, delayMs);
				});
				if (isResolvedStdioConnection(connection)) await this._initializeStdioConnection(serverName, connection);
				else if (isResolvedStreamableHTTPConnection(connection)) if (connection.type === "sse" || connection.transport === "sse") await this._initializeSSEConnection(serverName, connection);
				else await this._initializeStreamableHTTPConnection(serverName, connection);
				const key = "headers" in connection ? {
					serverName,
					headers: connection.headers,
					authProvider: connection.authProvider
				} : { serverName };
				if (this.#clientConnections.has(key)) {
					connected = true;
					debugLog(`INFO: Successfully reconnected to server "${serverName}"`);
				}
			} catch (error) {
				debugLog(`ERROR: Failed to reconnect to server "${serverName}" (attempt ${attempts}): ${error}`);
			}
		}
		if (!connected) debugLog(`ERROR: Failed to reconnect to server "${serverName}" after ${attempts} attempts`);
	}
	/**
	* Clean up resources for a specific server
	*/
	async #cleanupServerResources(transportOptions) {
		const { serverName, authProvider, headers } = transportOptions;
		delete this.#serverNameToTools[serverName];
		await this.#clientConnections.delete({
			serverName,
			authProvider,
			headers
		});
	}
	/**
	* Get all tools from all servers as a flat array.
	*
	* @returns A flattened array of all tools
	*/
	_getAllToolsAsFlatArray() {
		const allTools = [];
		for (const tools of Object.values(this.#serverNameToTools)) allTools.push(...tools);
		return allTools;
	}
	/**
	* Get tools from specific servers as a flat array.
	*
	* @param serverNames - Names of servers to get tools from
	* @returns A flattened array of tools from the specified servers
	*/
	_getToolsFromServers(serverNames) {
		const allTools = [];
		for (const serverName of serverNames) {
			const tools = this.#serverNameToTools[serverName];
			if (tools) allTools.push(...tools);
		}
		return allTools;
	}
};
//#endregion
//#region node_modules/@langchain/mcp-adapters/dist/index.js
var dist_exports = /* @__PURE__ */ __exportAll({ MultiServerMCPClient: () => MultiServerMCPClient });
//#endregion
export { string as i, boolean as n, number as r, dist_exports as t };
