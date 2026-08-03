import { i as __require, o as __toESM, t as __commonJSMin } from "../_runtime.mjs";
import { $t as string, Bt as array, Ht as custom, Jt as number, Lt as _instanceof, Qt as record, Vt as boolean, Yt as object, Zt as preprocess, tn as union, zt as any } from "./@better-auth/core+[...].mjs";
import { r as number$1 } from "./@langchain/mcp-adapters+[...].mjs";
import { An as HumanMessage, At as getSchemaDescription, Dn as SystemMessage, Ft as isInteropZodObject, G as Runnable, In as ToolInputParsingException, It as isInteropZodSchema, J as RunnableSequence, Jt as ensureConfig, K as RunnableBinding, Ln as ToolMessage, Mt as interopSafeParseAsync, N as BaseLanguageModel, Nt as interopZodObjectMakeFieldsOptional, Pt as interopZodObjectPartial, Qt as AsyncLocalStorageProviderSingleton, Rt as isZodSchemaV4, Sn as AIMessageChunk, Tn as getBufferString, Tt as isSerializableSchema, Ut as AsyncGeneratorWithSetup, Vn as BaseMessage, Wt as IterableReadableStream, Yt as mergeConfigs, _t as promiseType, c as isLangChainTool, ct as booleanType, dt as functionType, ft as instanceOfType, ht as objectType, jt as interopParse, kn as RemoveMessage, kt as getInteropZodObjectShape, l as BaseChatModel, lt as custom$1, mt as numberType, n as convertToOpenAITool, nr as ContextOverflowError, o as tool, ot as anyType, p as ChatModelStream, pt as literalType, q as RunnableLambda, qt as raceWithSignal, rt as toJsonSchema, st as arrayType, ut as enumType, vt as recordType, xn as AIMessage, xt as unionType, yt as stringType } from "./@langchain/anthropic+[...].mjs";
import { t as Validator } from "./cfworker__json-schema.mjs";
import { _ as END, a as REMOVE_ALL_MESSAGES, b as isCommand, c as ReducedValue, d as StreamChannel, f as getConfig, g as Command, h as isGraphInterrupt, i as MessagesValue, l as interrupt, m as isGraphBubbleUp, n as StateGraph, o as StateSchema, p as getCurrentTaskInput, r as schemaMetaRegistry, s as UntrackedValue, u as createMessagesTransformer, v as START, y as Send } from "./@langchain/langgraph+[...].mjs";
import { n as context } from "./langchain__core+mustache.mjs";
import { t as require_braces } from "./braces+[...].mjs";
import { t as Client } from "./@langchain/langgraph-sdk+[...].mjs";
import { n as require_out$1 } from "./@nodelib/fs.scandir+[...].mjs";
import { t as require_out$2 } from "./fastq+nodelib__fs.walk+reusify.mjs";
import { spawn } from "node:child_process";
import fs$1 from "node:fs/promises";
import fs from "node:fs";
import path from "node:path";
import "node:os";
//#region node_modules/langchain/dist/chat_models/universal.js
var MODEL_PROVIDER_CONFIG = {
	openai: {
		package: "@langchain/openai",
		className: "ChatOpenAI"
	},
	anthropic: {
		package: "@langchain/anthropic",
		className: "ChatAnthropic"
	},
	azure_openai: {
		package: "@langchain/openai",
		className: "AzureChatOpenAI"
	},
	cohere: {
		package: "@langchain/cohere",
		className: "ChatCohere"
	},
	google: {
		package: "@langchain/google",
		className: "ChatGoogle"
	},
	"google-vertexai": {
		package: "@langchain/google-vertexai",
		className: "ChatVertexAI"
	},
	"google-vertexai-web": {
		package: "@langchain/google-vertexai-web",
		className: "ChatVertexAI"
	},
	"google-genai": {
		package: "@langchain/google-genai",
		className: "ChatGoogleGenerativeAI"
	},
	ollama: {
		package: "@langchain/ollama",
		className: "ChatOllama"
	},
	mistralai: {
		package: "@langchain/mistralai",
		className: "ChatMistralAI"
	},
	mistral: {
		package: "@langchain/mistralai",
		className: "ChatMistralAI"
	},
	groq: {
		package: "@langchain/groq",
		className: "ChatGroq"
	},
	bedrock: {
		package: "@langchain/aws",
		className: "ChatBedrockConverse"
	},
	aws: {
		package: "@langchain/aws",
		className: "ChatBedrockConverse"
	},
	deepseek: {
		package: "@langchain/deepseek",
		className: "ChatDeepSeek"
	},
	xai: {
		package: "@langchain/xai",
		className: "ChatXAI"
	},
	cerebras: {
		package: "@langchain/cerebras",
		className: "ChatCerebras"
	},
	fireworks: {
		package: "@langchain/fireworks",
		className: "ChatFireworks"
	},
	together: {
		package: "@langchain/together-ai",
		className: "ChatTogetherAI",
		hasCircularDependency: true
	},
	perplexity: {
		package: "@langchain/perplexity",
		className: "ChatPerplexity"
	}
};
var SUPPORTED_PROVIDERS = Object.keys(MODEL_PROVIDER_CONFIG);
/**
* Helper function to get a chat model class by its class name or model provider.
* @param className The class name (e.g., "ChatOpenAI", "ChatAnthropic")
* @param modelProvider Optional model provider key for direct lookup (e.g., "google-vertexai-web").
*                      When provided, uses direct lookup to avoid className collision issues.
* @returns The imported model class or undefined if not found
*/
async function getChatModelByClassName(className, modelProvider) {
	let config;
	if (modelProvider) config = MODEL_PROVIDER_CONFIG[modelProvider];
	else {
		const providerEntry = Object.entries(MODEL_PROVIDER_CONFIG).find(([, c]) => c.className === className);
		config = providerEntry ? providerEntry[1] : void 0;
	}
	if (!config) return;
	try {
		return (await import(config.package))[config.className];
	} catch (e) {
		const err = e;
		if ("code" in err && err.code?.toString().includes("ERR_MODULE_NOT_FOUND") && "message" in err && typeof err.message === "string") {
			const attemptedPackage = (err.message.startsWith("Error: ") ? err.message.slice(7) : err.message).split("Cannot find package '")[1].split("'")[0];
			throw new Error(`Unable to import ${attemptedPackage}. Please install with \`npm install ${attemptedPackage}\` or \`pnpm install ${attemptedPackage}\``);
		}
		throw e;
	}
}
async function _initChatModelHelper(model, modelProvider, params = {}) {
	const modelProviderCopy = modelProvider || _inferModelProvider(model);
	if (!modelProviderCopy) throw new Error(`Unable to infer model provider for { model: ${model} }, please specify modelProvider directly.`);
	const config = MODEL_PROVIDER_CONFIG[modelProviderCopy];
	if (!config) {
		const supported = SUPPORTED_PROVIDERS.join(", ");
		throw new Error(`Unsupported { modelProvider: ${modelProviderCopy} }.\n\nSupported model providers are: ${supported}`);
	}
	const { modelProvider: _unused, ...passedParams } = params;
	return new (await (getChatModelByClassName(config.className, modelProviderCopy)))({
		model,
		...passedParams
	});
}
/**
* Attempts to infer the model provider based on the given model name.
*
* @param {string} modelName - The name of the model to infer the provider for.
* @returns {string | undefined} The inferred model provider name, or undefined if unable to infer.
*
* @example
* _inferModelProvider("gpt-4"); // returns "openai"
* _inferModelProvider("claude-2"); // returns "anthropic"
* _inferModelProvider("unknown-model"); // returns undefined
*/
function _inferModelProvider(modelName) {
	if (modelName.startsWith("gpt-3") || modelName.startsWith("gpt-4") || modelName.startsWith("gpt-5") || modelName.startsWith("o1") || modelName.startsWith("o3") || modelName.startsWith("o4")) return "openai";
	else if (modelName.startsWith("claude")) return "anthropic";
	else if (modelName.startsWith("command")) return "cohere";
	else if (modelName.startsWith("accounts/fireworks")) return "fireworks";
	else if (modelName.startsWith("gemini")) return "google-vertexai";
	else if (modelName.startsWith("amazon.")) return "bedrock";
	else if (modelName.startsWith("mistral")) return "mistralai";
	else if (modelName.startsWith("sonar") || modelName.startsWith("pplx")) return "perplexity";
	else return;
}
/**
* Internal class used to create chat models.
*
* @internal
*/
var ConfigurableModel = class ConfigurableModel extends BaseChatModel {
	_llmType() {
		return "chat_model";
	}
	lc_namespace = ["langchain", "chat_models"];
	_defaultConfig = {};
	/**
	* @default "any"
	*/
	_configurableFields = "any";
	/**
	* @default ""
	*/
	_configPrefix;
	/**
	* Methods which should be called after the model is initialized.
	* The key will be the method name, and the value will be the arguments.
	*/
	_queuedMethodOperations = {};
	/** @internal */
	_modelInstanceCache = /* @__PURE__ */ new Map();
	/** @internal */
	_profile;
	constructor(fields) {
		super(fields);
		this._defaultConfig = fields.defaultConfig ?? {};
		if (fields.configurableFields === "any") this._configurableFields = "any";
		else this._configurableFields = fields.configurableFields ?? ["model", "modelProvider"];
		if (fields.configPrefix) this._configPrefix = fields.configPrefix.endsWith("_") ? fields.configPrefix : `${fields.configPrefix}_`;
		else this._configPrefix = "";
		this._queuedMethodOperations = fields.queuedMethodOperations ?? this._queuedMethodOperations;
		this._profile = fields.profile ?? void 0;
		this.metadata = {
			...this.metadata,
			ls_integration: "langchain_init_chat_model"
		};
	}
	async _getModelInstance(config) {
		const cacheKey = this._getCacheKey(config);
		const cachedModel = this._modelInstanceCache.get(cacheKey);
		if (cachedModel) return cachedModel;
		const params = {
			...this._defaultConfig,
			...this._modelParams(config)
		};
		let initializedModel = await _initChatModelHelper(params.model, params.modelProvider, params);
		for (const [method, args] of Object.entries(this._queuedMethodOperations)) if (method in initializedModel && typeof initializedModel[method] === "function") initializedModel = await initializedModel[method](...args);
		this._modelInstanceCache.set(cacheKey, initializedModel);
		return initializedModel;
	}
	async _generate(messages, options, runManager) {
		return (await this._getModelInstance(options))._generate(messages, options ?? {}, runManager);
	}
	bindTools(tools, params) {
		const newQueuedOperations = { ...this._queuedMethodOperations };
		newQueuedOperations.bindTools = [tools, params];
		return new ConfigurableModel({
			defaultConfig: this._defaultConfig,
			configurableFields: this._configurableFields,
			configPrefix: this._configPrefix,
			queuedMethodOperations: newQueuedOperations
		});
	}
	withStructuredOutput = (schema, ...args) => {
		const newQueuedOperations = { ...this._queuedMethodOperations };
		newQueuedOperations.withStructuredOutput = [schema, ...args];
		return new ConfigurableModel({
			defaultConfig: this._defaultConfig,
			configurableFields: this._configurableFields,
			configPrefix: this._configPrefix,
			queuedMethodOperations: newQueuedOperations
		});
	};
	_modelParams(config) {
		const configurable = config?.configurable ?? {};
		let modelParams = {};
		for (const [key, value] of Object.entries(configurable)) if (key.startsWith(this._configPrefix)) {
			const strippedKey = this._removePrefix(key, this._configPrefix);
			modelParams[strippedKey] = value;
		}
		if (this._configurableFields !== "any") modelParams = Object.fromEntries(Object.entries(modelParams).filter(([key]) => this._configurableFields.includes(key)));
		return modelParams;
	}
	_removePrefix(str, prefix) {
		return str.startsWith(prefix) ? str.slice(prefix.length) : str;
	}
	/**
	* Bind config to a Runnable, returning a new Runnable.
	* @param {RunnableConfig | undefined} [config] - The config to bind.
	* @returns {RunnableBinding<RunInput, RunOutput, CallOptions>} A new RunnableBinding with the bound config.
	*/
	withConfig(config) {
		const mergedConfig = { ...config || {} };
		const modelParams = this._modelParams(mergedConfig);
		const remainingConfig = Object.fromEntries(Object.entries(mergedConfig).filter(([k]) => k !== "configurable"));
		remainingConfig.configurable = Object.fromEntries(Object.entries(mergedConfig.configurable || {}).filter(([k]) => this._configPrefix && !Object.keys(modelParams).includes(this._removePrefix(k, this._configPrefix))));
		return new RunnableBinding({
			config: mergedConfig,
			bound: new ConfigurableModel({
				defaultConfig: {
					...this._defaultConfig,
					...modelParams
				},
				configurableFields: Array.isArray(this._configurableFields) ? [...this._configurableFields] : this._configurableFields,
				configPrefix: this._configPrefix,
				queuedMethodOperations: this._queuedMethodOperations
			})
		});
	}
	async invoke(input, options) {
		const model = await this._getModelInstance(options);
		const config = ensureConfig(options);
		return model.invoke(input, config);
	}
	async stream(input, options) {
		const wrappedGenerator = new AsyncGeneratorWithSetup({
			generator: await (await this._getModelInstance(options)).stream(input, options),
			config: options
		});
		await wrappedGenerator.setup;
		return IterableReadableStream.fromAsyncGenerator(wrappedGenerator);
	}
	async batch(inputs, options, batchOptions) {
		return super.batch(inputs, options, batchOptions);
	}
	async *transform(generator, options) {
		const model = await this._getModelInstance(options);
		const config = ensureConfig(options);
		yield* model.transform(generator, config);
	}
	async *streamLog(input, options, streamOptions) {
		const model = await this._getModelInstance(options);
		const config = ensureConfig(options);
		yield* model.streamLog(input, config, {
			...streamOptions,
			_schemaFormat: "original",
			includeNames: streamOptions?.includeNames,
			includeTypes: streamOptions?.includeTypes,
			includeTags: streamOptions?.includeTags,
			excludeNames: streamOptions?.excludeNames,
			excludeTypes: streamOptions?.excludeTypes,
			excludeTags: streamOptions?.excludeTags
		});
	}
	streamEvents(input, options, streamOptions) {
		if (options?.version === "v1" || options?.version === "v2") {
			const outerThis = this;
			const tracingCallOptions = options;
			async function* wrappedGenerator() {
				const model = await outerThis._getModelInstance(tracingCallOptions);
				const tracingOptions = {
					...ensureConfig(tracingCallOptions),
					version: tracingCallOptions.version,
					...tracingCallOptions.encoding !== void 0 ? { encoding: tracingCallOptions.encoding } : {}
				};
				let eventStream;
				if (tracingCallOptions.version === "v1" && tracingCallOptions.encoding === "text/event-stream") eventStream = model.streamEvents(input, tracingOptions, streamOptions);
				else if (tracingCallOptions.version === "v1") eventStream = model.streamEvents(input, tracingOptions, streamOptions);
				else if (tracingCallOptions.version === "v2" && tracingCallOptions.encoding === "text/event-stream") eventStream = model.streamEvents(input, tracingOptions, streamOptions);
				else eventStream = model.streamEvents(input, tracingOptions, streamOptions);
				for await (const chunk of eventStream) yield chunk;
			}
			return IterableReadableStream.fromAsyncGenerator(wrappedGenerator());
		}
		const outerThis = this;
		async function* deferredEvents() {
			const model = await outerThis._getModelInstance(options);
			const config = ensureConfig(options);
			yield* model.streamEvents(input, config);
		}
		return new ChatModelStream(deferredEvents());
	}
	/**
	* Return profiling information for the model.
	*
	* @returns {ModelProfile} An object describing the model's capabilities and constraints
	*/
	get profile() {
		if (this._profile) return this._profile;
		const cacheKey = this._getCacheKey({});
		return this._modelInstanceCache.get(cacheKey)?.profile ?? {};
	}
	/** @internal */
	_getCacheKey(config) {
		let toStringify = config ?? {};
		if (toStringify.configurable) {
			const { configurable } = toStringify;
			const filtered = {};
			for (const [k, v] of Object.entries(configurable)) if (!k.startsWith("__pregel_")) filtered[k] = v;
			toStringify = {
				...toStringify,
				configurable: filtered
			};
		}
		return JSON.stringify(toStringify);
	}
};
/**
* Initialize a ChatModel from the model name and provider.
* Must have the integration package corresponding to the model provider installed.
*
* @template {extends BaseLanguageModelInput = BaseLanguageModelInput} RunInput - The input type for the model.
* @template {extends ConfigurableChatModelCallOptions = ConfigurableChatModelCallOptions} CallOptions - Call options for the model.
*
* @param {string | ChatModelProvider} [model] - The name of the model, e.g. "gpt-4", "claude-3-opus-20240229".
*   Can be prefixed with the model provider, e.g. "openai:gpt-4", "anthropic:claude-3-opus-20240229".
* @param {Object} [fields] - Additional configuration options.
* @param {string} [fields.modelProvider] - The model provider. Supported values include:
*   - openai (@langchain/openai)
*   - anthropic (@langchain/anthropic)
*   - azure_openai (@langchain/openai)
*   - google-vertexai (@langchain/google-vertexai)
*   - google-vertexai-web (@langchain/google-vertexai-web)
*   - google-genai (@langchain/google-genai)
*   - bedrock (@langchain/aws)
*   - cohere (@langchain/cohere)
*   - fireworks (@langchain/fireworks)
*   - together (@langchain/together-ai)
*   - mistralai (@langchain/mistralai)
*   - groq (@langchain/groq)
*   - ollama (@langchain/ollama)
*   - perplexity (@langchain/perplexity)
*   - cerebras (@langchain/cerebras)
*   - deepseek (@langchain/deepseek)
*   - xai (@langchain/xai)
* @param {string[] | "any"} [fields.configurableFields] - Which model parameters are configurable:
*   - undefined: No configurable fields.
*   - "any": All fields are configurable. (See Security Note in description)
*   - string[]: Specified fields are configurable.
* @param {string} [fields.configPrefix] - Prefix for configurable fields at runtime.
* @param {ModelProfile} [fields.profile] - Overrides the profiling information for the model. If not provided,
*   the profile will be inferred from the inner model instance.
* @param {Record<string, any>} [fields.params] - Additional keyword args to pass to the ChatModel constructor.
* @returns {Promise<ConfigurableModel<RunInput, CallOptions>>} A class which extends BaseChatModel.
* @throws {Error} If modelProvider cannot be inferred or isn't supported.
* @throws {Error} If the model provider integration package is not installed.
*
* @example Initialize non-configurable models
* ```typescript
* import { initChatModel } from "langchain/chat_models/universal";
*
* const gpt4 = await initChatModel("openai:gpt-4", {
*   temperature: 0.25,
* });
* const gpt4Result = await gpt4.invoke("what's your name");
*
* const claude = await initChatModel("anthropic:claude-3-opus-20240229", {
*   temperature: 0.25,
* });
* const claudeResult = await claude.invoke("what's your name");
*
* const gemini = await initChatModel("gemini-1.5-pro", {
*   modelProvider: "google-vertexai",
*   temperature: 0.25,
* });
* const geminiResult = await gemini.invoke("what's your name");
* ```
*
* @example Create a partially configurable model with no default model
* ```typescript
* import { initChatModel } from "langchain/chat_models/universal";
*
* const configurableModel = await initChatModel(undefined, {
*   temperature: 0,
*   configurableFields: ["model", "apiKey"],
* });
*
* const gpt4Result = await configurableModel.invoke("what's your name", {
*   configurable: {
*     model: "gpt-4",
*   },
* });
*
* const claudeResult = await configurableModel.invoke("what's your name", {
*   configurable: {
*     model: "claude-sonnet-4-5-20250929",
*   },
* });
* ```
*
* @example Create a fully configurable model with a default model and a config prefix
* ```typescript
* import { initChatModel } from "langchain/chat_models/universal";
*
* const configurableModelWithDefault = await initChatModel("gpt-4", {
*   modelProvider: "openai",
*   configurableFields: "any",
*   configPrefix: "foo",
*   temperature: 0,
* });
*
* const openaiResult = await configurableModelWithDefault.invoke(
*   "what's your name",
*   {
*     configurable: {
*       foo_apiKey: process.env.OPENAI_API_KEY,
*     },
*   }
* );
*
* const claudeResult = await configurableModelWithDefault.invoke(
*   "what's your name",
*   {
*     configurable: {
*       foo_model: "claude-sonnet-4-5-20250929",
*       foo_modelProvider: "anthropic",
*       foo_temperature: 0.6,
*       foo_apiKey: process.env.ANTHROPIC_API_KEY,
*     },
*   }
* );
* ```
*
* @example Bind tools to a configurable model:
* ```typescript
* import { initChatModel } from "langchain/chat_models/universal";
* import { z } from "zod/v3";
* import { tool } from "@langchain/core/tools";
*
* const getWeatherTool = tool(
*   (input) => {
*     // Do something with the input
*     return JSON.stringify(input);
*   },
*   {
*     schema: z
*       .object({
*         location: z
*           .string()
*           .describe("The city and state, e.g. San Francisco, CA"),
*       })
*       .describe("Get the current weather in a given location"),
*     name: "GetWeather",
*     description: "Get the current weather in a given location",
*   }
* );
*
* const getPopulationTool = tool(
*   (input) => {
*     // Do something with the input
*     return JSON.stringify(input);
*   },
*   {
*     schema: z
*       .object({
*         location: z
*           .string()
*           .describe("The city and state, e.g. San Francisco, CA"),
*       })
*       .describe("Get the current population in a given location"),
*     name: "GetPopulation",
*     description: "Get the current population in a given location",
*   }
* );
*
* const configurableModel = await initChatModel("gpt-4", {
*   configurableFields: ["model", "modelProvider", "apiKey"],
*   temperature: 0,
* });
*
* const configurableModelWithTools = configurableModel.bindTools([
*   getWeatherTool,
*   getPopulationTool,
* ]);
*
* const configurableToolResult = await configurableModelWithTools.invoke(
*   "Which city is hotter today and which is bigger: LA or NY?",
*   {
*     configurable: {
*       apiKey: process.env.OPENAI_API_KEY,
*     },
*   }
* );
*
* const configurableToolResult2 = await configurableModelWithTools.invoke(
*   "Which city is hotter today and which is bigger: LA or NY?",
*   {
*     configurable: {
*       model: "claude-sonnet-4-5-20250929",
*       apiKey: process.env.ANTHROPIC_API_KEY,
*     },
*   }
* );
* ```
*
* @example Initialize a model with a custom profile
* ```typescript
* import { initChatModel } from "langchain/chat_models/universal";
*
* const model = await initChatModel("gpt-4o-mini", {
*   profile: {
*     maxInputTokens: 100000,
*   },
* });
*
* @description
* This function initializes a ChatModel based on the provided model name and provider.
* It supports various model providers and allows for runtime configuration of model parameters.
*
* Security Note: Setting `configurableFields` to "any" means fields like apiKey, baseUrl, etc.
* can be altered at runtime, potentially redirecting model requests to a different service/user.
* Make sure that if you're accepting untrusted configurations, you enumerate the
* `configurableFields` explicitly.
*
* The function will attempt to infer the model provider from the model name if not specified.
* Certain model name prefixes are associated with specific providers:
* - gpt-3... or gpt-4... -> openai
* - claude... -> anthropic
* - amazon.... -> bedrock
* - gemini... -> google-vertexai
* - command... -> cohere
* - accounts/fireworks... -> fireworks
*
* @since 0.2.11
* @version 0.2.11
*/
async function initChatModel(model, fields) {
	let { configurableFields, configPrefix, modelProvider, profile, ...params } = {
		configPrefix: "",
		...fields ?? {}
	};
	if (modelProvider === void 0 && model?.includes(":")) {
		const [provider, ...remainingParts] = model.split(":");
		const modelComponents = remainingParts.length === 0 ? [provider] : [provider, remainingParts.join(":")];
		if (SUPPORTED_PROVIDERS.includes(modelComponents[0])) [modelProvider, model] = modelComponents;
	}
	let configurableFieldsCopy = Array.isArray(configurableFields) ? [...configurableFields] : configurableFields;
	if (!model && configurableFieldsCopy === void 0) configurableFieldsCopy = ["model", "modelProvider"];
	if (configPrefix && configurableFieldsCopy === void 0) console.warn(`{ configPrefix: ${configPrefix} } has been set but no fields are configurable. Set { configurableFields: [...] } to specify the model params that are configurable.`);
	const paramsCopy = { ...params };
	let configurableModel;
	if (configurableFieldsCopy === void 0) configurableModel = new ConfigurableModel({
		defaultConfig: {
			...paramsCopy,
			model,
			modelProvider
		},
		configPrefix,
		profile
	});
	else {
		if (model) paramsCopy.model = model;
		if (modelProvider) paramsCopy.modelProvider = modelProvider;
		configurableModel = new ConfigurableModel({
			defaultConfig: paramsCopy,
			configPrefix,
			configurableFields: configurableFieldsCopy,
			profile
		});
	}
	await configurableModel._getModelInstance();
	return configurableModel;
}
//#endregion
//#region node_modules/langchain/dist/tools/headless.js
/**
* Unified Tool Primitive for LangChain Agents
*
* This module re-exports the `tool` primitive from `@langchain/core/tools` with
* an additional overload: when called without an implementation function, it
* creates a **headless tool** that interrupts agent execution and delegates the
* implementation to the client (e.g. via `useStream({ tools: [...] })`).
*
* @module
*/
function createHeadlessTool(fields) {
	const { name, description, schema } = fields;
	const wrappedTool = tool(async (args, config) => {
		const { interrupt } = await import("./@langchain/langgraph+[...].mjs").then((n) => n.t);
		return interrupt({
			type: "tool",
			toolCall: {
				id: config?.toolCall?.id,
				name,
				args
			}
		});
	}, {
		name,
		description,
		schema,
		metadata: { headlessTool: true }
	});
	const headlessTool = Object.assign(wrappedTool, { implement: (execute) => ({
		tool: headlessTool,
		execute
	}) });
	return headlessTool;
}
/**
* Unified tool primitive for LangChain agents.
*
* Enhances the `tool` function from `@langchain/core/tools` with a headless
* overload: when called **without** an implementation function, the tool
* interrupts agent execution and lets the client supply the implementation.
*
* ---
*
* **Normal tool** — pass an implementation function as the first argument:
*
* ```typescript
* import { tool } from "langchain/tools";
* import { z } from "zod";
*
* const getWeather = tool(
*   async ({ city }) => `The weather in ${city} is sunny.`,
*   {
*     name: "get_weather",
*     description: "Get the weather for a city",
*     schema: z.object({ city: z.string() }),
*   }
* );
* ```
*
* ---
*
* **Headless tool** — omit the implementation; the client provides it later:
*
* ```typescript
* import { tool } from "langchain/tools";
* import { z } from "zod";
*
* // Server: define the tool shape — no implementation needed
* export const getLocation = tool({
*   name: "get_location",
*   description: "Get the user's current GPS location",
*   schema: z.object({
*     highAccuracy: z.boolean().optional().describe("Request high accuracy GPS"),
*   }),
* });
*
* // Server: register with the agent
* const agent = createAgent({
*   model: "openai:gpt-4o",
*   tools: [getLocation],
* });
*
* // Client: provide the implementation in useStream
* const stream = useStream({
*   assistantId: "agent",
*   tools: [
*     getLocation.implement(async ({ highAccuracy }) => {
*       return new Promise((resolve, reject) => {
*         navigator.geolocation.getCurrentPosition(
*           (pos) => resolve({
*             latitude: pos.coords.latitude,
*             longitude: pos.coords.longitude,
*           }),
*           (err) => reject(new Error(err.message)),
*           { enableHighAccuracy: highAccuracy }
*         );
*       });
*     }),
*   ],
* });
* ```
*/
var tool$1 = ((funcOrFields, fields) => {
	if (typeof funcOrFields !== "function") return createHeadlessTool(funcOrFields);
	return tool(funcOrFields, fields);
});
//#endregion
//#region node_modules/langchain/dist/agents/errors.js
var MultipleToolsBoundError = class extends Error {
	constructor() {
		super("The provided LLM already has bound tools. Please provide an LLM without bound tools to createAgent. The agent will bind the tools provided in the 'tools' parameter.");
	}
};
/**
* Raised when model returns multiple structured output tool calls when only one is expected.
*/
var MultipleStructuredOutputsError = class extends Error {
	toolNames;
	constructor(toolNames) {
		super(`The model has called multiple tools: ${toolNames.join(", ")} to return a structured output. This is not supported. Please provide a single structured output.`);
		this.toolNames = toolNames;
	}
};
/**
* Raised when structured output tool call arguments fail to parse according to the schema.
*/
var StructuredOutputParsingError = class extends Error {
	toolName;
	errors;
	constructor(toolName, errors) {
		super(`Failed to parse structured output for tool '${toolName}':${errors.map((e) => `\n  - ${e}`).join("")}.`);
		this.toolName = toolName;
		this.errors = errors;
	}
};
/**
* Raised when a tool call is throwing an error.
*/
var ToolInvocationError = class extends Error {
	"~brand" = "ToolInvocationError";
	toolCall;
	toolError;
	constructor(toolError, toolCall) {
		const error = toolError instanceof Error ? toolError : new Error(String(toolError));
		const toolArgs = JSON.stringify(toolCall.args);
		super(`Error invoking tool '${toolCall.name}' with kwargs ${toolArgs} with error: ${error.stack}\n Please fix the error and try again.`);
		this.toolCall = toolCall;
		this.toolError = error;
	}
	/**
	* Check if the error is a ToolInvocationError.
	* @param error - The error to check
	* @returns Whether the error is a ToolInvocationError
	*/
	static isInstance(error) {
		return error instanceof Error && "~brand" in error && error["~brand"] === "ToolInvocationError";
	}
};
/**
* Error thrown when a middleware fails.
*
* Use `MiddlewareError.wrap()` to create instances. The constructor is private
* to ensure that GraphBubbleUp errors (like GraphInterrupt) are never wrapped.
*/
var MiddlewareError = class MiddlewareError extends Error {
	"~brand" = "MiddlewareError";
	constructor(error, middlewareName) {
		const errorMessage = error instanceof Error ? error.message : String(error);
		super(errorMessage);
		this.name = error instanceof Error ? error.name : `${middlewareName[0].toUpperCase() + middlewareName.slice(1)}Error`;
		if (error instanceof Error) this.cause = error;
	}
	/**
	* Wrap an error in a MiddlewareError, unless it's a GraphBubbleUp error
	* (like GraphInterrupt) which should propagate unchanged.
	*
	* @param error - The error to wrap
	* @param middlewareName - The name of the middleware that threw the error
	* @returns The original error if it's a GraphBubbleUp, otherwise a new MiddlewareError
	*/
	static wrap(error, middlewareName) {
		if (isGraphBubbleUp(error)) return error;
		return new MiddlewareError(error, middlewareName);
	}
	/**
	* Check if the error is a MiddlewareError.
	* @param error - The error to check
	* @returns Whether the error is a MiddlewareError
	*/
	static isInstance(error) {
		return error instanceof Error && "~brand" in error && error["~brand"] === "MiddlewareError";
	}
};
//#endregion
//#region node_modules/langchain/dist/agents/model.js
function isBaseChatModel(model) {
	return "invoke" in model && typeof model.invoke === "function" && "_streamResponseChunks" in model;
}
function isConfigurableModel(model) {
	return typeof model === "object" && model != null && "_queuedMethodOperations" in model && "_getModelInstance" in model && typeof model._getModelInstance === "function";
}
//#endregion
//#region node_modules/langchain/dist/agents/responses.js
/**
* Default value for strict mode in providerStrategy.
*
* When using providerStrategy with json_schema response format, OpenAI's parse() method
* requires all function tools to have strict: true. This ensures the model's output
* exactly matches the provided JSON schema.
*
* @see https://platform.openai.com/docs/guides/structured-outputs
*/
var PROVIDER_STRATEGY_DEFAULT_STRICT = true;
/**
* This is a global counter for generating unique names for tools.
*/
var bindingIdentifier = 0;
/**
* Information for tracking structured output tool metadata.
* This contains all necessary information to handle structured responses generated
* via tool calls, including the original schema, its type classification, and the
* corresponding tool implementation used by the tools strategy.
*/
var ToolStrategy = class ToolStrategy {
	constructor(schema, tool, options) {
		this.schema = schema;
		this.tool = tool;
		this.options = options;
	}
	get name() {
		return this.tool.function.name;
	}
	static fromSchema(schema, outputOptions) {
		/**
		* It is required for tools to have a name so we can map the tool call to the correct tool
		* when parsing the response.
		*/
		function getFunctionName(name) {
			return name ?? `extract-${++bindingIdentifier}`;
		}
		if (isSerializableSchema(schema) || isInteropZodSchema(schema)) {
			const asJsonSchema = toJsonSchema(schema);
			return new ToolStrategy(asJsonSchema, {
				type: "function",
				function: {
					name: getFunctionName(asJsonSchema.title),
					strict: false,
					description: asJsonSchema.description ?? "Tool for extracting structured output from the model's response.",
					parameters: asJsonSchema
				}
			}, outputOptions);
		}
		let functionDefinition;
		if (typeof schema.name === "string" && typeof schema.parameters === "object" && schema.parameters != null) functionDefinition = schema;
		else functionDefinition = {
			name: getFunctionName(schema.title),
			description: schema.description ?? "",
			parameters: schema.schema || schema
		};
		return new ToolStrategy(toJsonSchema(schema), {
			type: "function",
			function: functionDefinition
		}, outputOptions);
	}
	/**
	* Parse tool arguments according to the schema.
	*
	* @throws {StructuredOutputParsingError} if the response is not valid
	* @param toolArgs - The arguments from the tool call
	* @returns The parsed response according to the schema type
	*/
	parse(toolArgs) {
		const result = new Validator(this.schema).validate(toolArgs);
		if (!result.valid) throw new StructuredOutputParsingError(this.name, result.errors.map((e) => e.error));
		return toolArgs;
	}
};
var ProviderStrategy = class ProviderStrategy {
	_schemaType;
	/**
	* The schema to use for the provider strategy
	*/
	schema;
	/**
	* Whether to use strict mode for the provider strategy
	*/
	strict;
	constructor(schemaOrOptions, strict) {
		if ("schema" in schemaOrOptions && typeof schemaOrOptions.schema === "object" && schemaOrOptions.schema !== null && !("type" in schemaOrOptions)) {
			const options = schemaOrOptions;
			this.schema = options.schema;
			this.strict = options.strict ?? PROVIDER_STRATEGY_DEFAULT_STRICT;
		} else {
			this.schema = schemaOrOptions;
			this.strict = strict ?? PROVIDER_STRATEGY_DEFAULT_STRICT;
		}
	}
	static fromSchema(schema, strict) {
		return new ProviderStrategy(toJsonSchema(schema), strict);
	}
	/**
	* Parse tool arguments according to the schema. If the response is not valid, return undefined.
	*
	* @param response - The AI message response to parse
	* @returns The parsed response according to the schema type
	*/
	parse(response) {
		/**
		* Extract text content from the response.
		* Handles both string content and array content (e.g., from thinking models).
		*/
		let textContent;
		if (typeof response.content === "string") textContent = response.content;
		else if (Array.isArray(response.content)) {
			/**
			* For thinking models, content is an array with thinking blocks and text blocks.
			* Extract the text from text blocks.
			*/
			for (const block of response.content) if (typeof block === "object" && block !== null && "type" in block && block.type === "text" && "text" in block && typeof block.text === "string") {
				textContent = block.text;
				break;
			}
		}
		if (!textContent || textContent === "") return;
		try {
			const content = JSON.parse(textContent);
			if (!new Validator(this.schema).validate(content).valid) return;
			return content;
		} catch {}
	}
};
/**
* Handle user input for `responseFormat` parameter of `CreateAgentParams`.
* This function defines the default behavior for the `responseFormat` parameter, which is:
*
* - if value is a Zod schema, default to structured output via tool calling
* - if value is a JSON schema, default to structured output via tool calling
* - if value is a custom response format, return it as is
* - if value is an array, ensure all array elements are instance of `ToolStrategy`
* @param responseFormat - The response format to transform, provided by the user
* @param options - The response format options for tool strategy
* @param model - The model to check if it supports JSON schema output
* @returns
*/
function transformResponseFormat(responseFormat, options, model) {
	if (!responseFormat) return [];
	if (typeof responseFormat === "object" && responseFormat !== null && "__responseFormatUndefined" in responseFormat) return [];
	/**
	* If users provide an array, it should only contain raw schemas (Zod, Standard Schema or JSON schema),
	* not ToolStrategy or ProviderStrategy instances.
	*/
	if (Array.isArray(responseFormat)) {
		/**
		* if every entry is a ToolStrategy or ProviderStrategy instance, return the array as is
		*/
		if (responseFormat.every((item) => item instanceof ToolStrategy || item instanceof ProviderStrategy)) return responseFormat;
		/**
		* Check if all items are Standard Schema
		*/
		if (responseFormat.every((item) => isSerializableSchema(item))) return responseFormat.map((item) => ToolStrategy.fromSchema(item, options));
		/**
		* Check if all items are Zod schemas
		*/
		if (responseFormat.every((item) => isInteropZodObject(item))) return responseFormat.map((item) => ToolStrategy.fromSchema(item, options));
		/**
		* Check if all items are plain objects (JSON schema)
		*/
		if (responseFormat.every((item) => typeof item === "object" && item !== null && !isInteropZodObject(item) && !isSerializableSchema(item))) return responseFormat.map((item) => ToolStrategy.fromSchema(item, options));
		throw new Error("Invalid response format: list contains mixed types.\nAll items must be either InteropZodObject, Standard Schema, or plain JSON schema objects.");
	}
	if (responseFormat instanceof ToolStrategy || responseFormat instanceof ProviderStrategy) return [responseFormat];
	const useProviderStrategy = hasSupportForJsonSchemaOutput(model);
	/**
	* `responseFormat` is a Standard Schema
	*/
	if (isSerializableSchema(responseFormat)) return useProviderStrategy ? [ProviderStrategy.fromSchema(responseFormat)] : [ToolStrategy.fromSchema(responseFormat, options)];
	/**
	* `responseFormat` is a Zod schema
	*/
	if (isInteropZodObject(responseFormat)) return useProviderStrategy ? [ProviderStrategy.fromSchema(responseFormat)] : [ToolStrategy.fromSchema(responseFormat, options)];
	/**
	* Handle plain object (JSON schema)
	*/
	if (typeof responseFormat === "object" && responseFormat !== null && "properties" in responseFormat) return useProviderStrategy ? [ProviderStrategy.fromSchema(responseFormat)] : [ToolStrategy.fromSchema(responseFormat, options)];
	throw new Error(`Invalid response format: ${String(responseFormat)}`);
}
/**
* Creates a tool strategy for structured output using function calling.
*
* This function configures structured output by converting schemas into function tools that
* the model calls. Unlike `providerStrategy`, which uses native JSON schema support,
* `toolStrategy` works with any model that supports function calling, making it more
* widely compatible across providers and model versions.
*
* The model will call a function with arguments matching your schema, and the agent will
* extract and validate the structured output from the tool call. This approach is automatically
* used when your model doesn't support native JSON schema output.
*
* @param responseFormat - The schema(s) to enforce. Can be a single Zod schema, a Standard Schema
*   (e.g., Valibot, ArkType, TypeBox), a JSON schema object, or arrays of any of these.
* @param options - Optional configuration for the tool strategy
* @param options.handleError - How to handle errors when the model calls multiple structured output tools
*   or when the output doesn't match the schema. Defaults to `true` (auto-retry). Can be `false` (throw),
*   a `string` (retry with message), or a `function` (custom handler).
* @param options.toolMessageContent - Custom message content to include in conversation history
*   when structured output is generated via tool call
* @returns A `TypedToolStrategy` instance that can be used as the `responseFormat` in `createAgent`
*
* @example
* ```ts
* import { toolStrategy, createAgent } from "langchain";
* import { z } from "zod";
*
* const agent = createAgent({
*   model: "claude-haiku-4-5",
*   responseFormat: toolStrategy(
*     z.object({
*       answer: z.string(),
*       confidence: z.number().min(0).max(1),
*     })
*   ),
* });
* ```
*
* @example
* ```ts
* // Multiple schemas - model can choose which one to use
* const agent = createAgent({
*   model: "claude-haiku-4-5",
*   responseFormat: toolStrategy([
*     z.object({ name: z.string(), age: z.number() }),
*     z.object({ email: z.string(), phone: z.string() }),
*   ]),
* });
* ```
*/
function toolStrategy(responseFormat, options) {
	return transformResponseFormat(responseFormat, options);
}
/**
* Identifies the models that support JSON schema output by reading
* the model's profile metadata.
*
* @param model - A resolved model instance to check. Callers should resolve
*   string model names and ConfigurableModel wrappers before calling this.
* @returns True if the model supports JSON schema output, false otherwise
*/
function hasSupportForJsonSchemaOutput(model) {
	if (!model || !isBaseChatModel(model) || !("profile" in model) || typeof model.profile !== "object" || !model.profile) return false;
	return "structuredOutput" in model.profile && model.profile.structuredOutput === true;
}
//#endregion
//#region node_modules/langchain/dist/agents/middleware/utils.js
/**
* Default token counter that approximates based on character count.
*
* If tools are provided, the token count also includes stringified tool schemas.
*
* @param messages Messages to count tokens for
* @param tools Optional list of tools to include in the token count. Each tool
*   can be either a LangChain tool instance or a dict representing a tool schema.
*   LangChain tool instances are converted to OpenAI tool format before counting.
* @returns Approximate token count
*/
function countTokensApproximately(messages, tools) {
	const charsPerToken = 4;
	let totalChars = 0;
	if (tools && tools.length > 0) {
		let toolsChars = 0;
		for (const tool of tools) {
			const toolDict = isLangChainTool(tool) ? convertToOpenAITool(tool) : tool;
			toolsChars += JSON.stringify(toolDict).length;
		}
		totalChars += toolsChars;
	}
	for (const msg of messages) {
		let textContent;
		if (typeof msg.content === "string") textContent = msg.content;
		else if (Array.isArray(msg.content)) textContent = msg.content.map((item) => {
			if (typeof item === "string") return item;
			if (item.type === "text" && "text" in item) return item.text;
			return "";
		}).join("");
		else textContent = "";
		if (AIMessage.isInstance(msg) && Array.isArray(msg.tool_calls) && msg.tool_calls.length > 0) textContent += JSON.stringify(msg.tool_calls);
		if (ToolMessage.isInstance(msg)) textContent += msg.tool_call_id ?? "";
		totalChars += textContent.length;
	}
	return Math.ceil(totalChars / charsPerToken);
}
function getHookConstraint(hook) {
	if (!hook || typeof hook === "function") return;
	return hook.canJumpTo;
}
function getHookFunction(arg) {
	if (typeof arg === "function") return arg;
	return arg.hook;
}
//#endregion
//#region node_modules/langchain/dist/agents/transformers/tool-call.js
/**
* Returns true when `ns` belongs to the agent's own graph — i.e. it
* starts with `path` and is at most one level deeper (the agent's
* internal nodes like `tools`, `model_request`, etc.).
*
* Events from subagent subgraphs (two or more levels deeper) are
* excluded, so `run.toolCalls` / `run.middleware` only show events
* from the agent itself, not from its subagents.
*/
function isOwnEvent(ns, path) {
	if (ns.length < path.length || ns.length > path.length + 1) return false;
	for (let i = 0; i < path.length; i += 1) if (ns[i] !== path[i]) return false;
	return true;
}
/**
* Detects when a `tool-error` payload is actually a graph interrupt rather
* than a genuine tool failure.
*
* A tool that calls `interrupt()` throws a `GraphInterrupt`, whose message is
* the JSON-serialized `Interrupt[]` array. Each entry has the LangGraph
* `Interrupt` shape `{ id, value }`: a stable `id` (a hash of the checkpoint
* namespace, generated by `interrupt()` and always present during graph
* execution) plus the `value` passed to `interrupt(...)`. We require BOTH a
* string `id` and a `value` on every entry — a bare `value` is not a reliable
* discriminator, since a genuine tool error message can also be a JSON array
* of `{ value }` records (e.g. a validator emitting
* `[{ "value": "bad input", "message": "invalid" }]`). Keying off the
* interrupt `id` keeps real tool failures on the error path.
*
* An interrupt is control flow that *suspends* the run (the tool re-runs on
* resume); it is not an error, so the tool call must stay pending rather than
* have its `output` promise rejected. Any interrupt qualifies regardless of
* its `value` shape: HITL middleware interrupts (`value.type === "tool"`) and
* raw `interrupt(...)` calls from inside a tool are treated identically —
* raising an interrupt in a tool must work whether or not
* `humanInTheLoopMiddleware` is involved.
*/
function isToolInterrupt(message) {
	let parsed;
	try {
		parsed = JSON.parse(message);
	} catch {
		return false;
	}
	if (!Array.isArray(parsed) || parsed.length === 0) return false;
	return parsed.every((entry) => {
		if (entry == null || typeof entry !== "object") return false;
		const record = entry;
		return typeof record.id === "string" && "value" in record;
	});
}
/**
* Detects serialized LangChain `ToolMessage` values that can appear on
* `tool-finished.output` after crossing a protocol or serialization boundary.
*
* @example
* ```ts
* {
*   lc: 1,
*   type: "constructor",
*   id: ["langchain_core", "messages", "ToolMessage"],
*   kwargs: { content: "raw tool result", tool_call_id: "call_1" }
* }
* ```
*/
function isSerializedToolMessage(value) {
	if (value == null || typeof value !== "object") return false;
	const record = value;
	if (record.type !== "constructor" || !Array.isArray(record.id)) return false;
	return record.id[record.id.length - 1] === "ToolMessage";
}
function normalizeToolOutput(output) {
	if (ToolMessage.isInstance(output)) return output.content;
	if (isSerializedToolMessage(output)) return output.kwargs?.content;
	return output;
}
/**
* Creates a native transformer that correlates `tools` channel events
* into per-call {@link ToolCallStream} objects.
*
* Marked `__native: true` — projection keys land directly on the
* `GraphRunStream` instance as `run.toolCalls`.
*/
function createToolCallTransformer(path) {
	return () => {
		const toolCallsLog = StreamChannel.local();
		const pendingCalls = /* @__PURE__ */ new Map();
		function createToolCallEntry(callId, name, rawInput) {
			if (pendingCalls.has(callId)) return;
			const input = typeof rawInput === "string" ? JSON.parse(rawInput) : rawInput;
			let resolveOutput;
			let rejectOutput;
			let resolveStatus;
			let resolveError;
			const output = new Promise((res, rej) => {
				resolveOutput = res;
				rejectOutput = rej;
			});
			const status = new Promise((res) => {
				resolveStatus = res;
			});
			const error = new Promise((res) => {
				resolveError = res;
			});
			pendingCalls.set(callId, {
				resolveOutput,
				rejectOutput,
				resolveStatus,
				resolveError
			});
			toolCallsLog.push({
				name,
				callId,
				input,
				output,
				status,
				error
			});
		}
		return {
			__native: true,
			init: () => ({ toolCalls: toolCallsLog }),
			process(event) {
				/**
				* Only process events that are at the same depth as the agent's graph.
				*/
				if (!isOwnEvent(event.params.namespace, path)) return true;
				if (event.method === "messages") {
					const data = event.params.data;
					if (data.event === "content-block-finish") {
						const cb = data.contentBlock ?? data.content_block;
						if (cb?.type === "tool_call") createToolCallEntry(String(cb.id ?? ""), String(cb.name ?? ""), cb.args ?? cb.input);
					}
				}
				if (event.method === "tools") {
					const data = event.params.data;
					const toolCallId = data.tool_call_id;
					if (data.event === "tool-started") createToolCallEntry(toolCallId, data.tool_name ?? "unknown", data.input);
					const pending = toolCallId ? pendingCalls.get(toolCallId) : void 0;
					if (pending) {
						if (data.event === "tool-finished") {
							pending.resolveOutput(normalizeToolOutput(data.output));
							pending.resolveStatus("finished");
							pending.resolveError(void 0);
							pendingCalls.delete(toolCallId);
						} else if (data.event === "tool-error") {
							const message = data.message ?? "unknown error";
							if (isToolInterrupt(message)) return true;
							pending.rejectOutput(new Error(message));
							pending.resolveStatus("error");
							pending.resolveError(message);
							pendingCalls.delete(toolCallId);
						}
					}
				}
				return true;
			},
			finalize() {
				for (const pending of pendingCalls.values()) {
					pending.resolveStatus("finished");
					pending.resolveError(void 0);
					pending.resolveOutput(void 0);
				}
				pendingCalls.clear();
				toolCallsLog.close();
			},
			fail(err) {
				for (const pending of pendingCalls.values()) {
					pending.resolveStatus("error");
					pending.resolveError(err instanceof Error ? err.message : String(err));
					pending.rejectOutput(err);
				}
				pendingCalls.clear();
				toolCallsLog.fail(err);
			}
		};
	};
}
//#endregion
//#region node_modules/langchain/dist/agents/transformers/subagent.js
function isRecord(value) {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}
/** Stable string key for a namespace. */
function nsKey(ns) {
	return ns.join("\0");
}
/** Tests whether `ns` starts with every segment in `prefix`. */
function hasPrefix(ns, prefix) {
	if (prefix.length > ns.length) return false;
	for (let i = 0; i < prefix.length; i += 1) if (ns[i] !== prefix[i]) return false;
	return true;
}
/**
* Creates a native transformer that surfaces nested named agents on
* `run.subagents`.
*
* It watches `tasks` events to record each namespace's `lc_agent_name` (set by
* `createAgent({ name })`) and the triggering tool call, then — for any nested
* run one level below {@link scope} that carries an `lc_agent_name` — emits a
* typed {@link SubagentRunStream} handle.
*
* Each handle is backed by its own per-subagent transformer instances
* ({@link createMessagesTransformer}, {@link createToolCallTransformer}, and a
* nested {@link createSubagentTransformer}) scoped to the subagent's namespace.
* Every event in the subtree is fed straight into those transformers, which
* self-filter by namespace; the subagent's final `output` is resolved from its
* last `values` snapshot when its `lifecycle` completes.
*
* Marked `__native: true` — the `subagents` projection lands directly on the
* `GraphRunStream` instance as `run.subagents`.
*
* @param scope - Namespace prefix this transformer is scoped to. The root agent
*   uses `[]`; nested handles use their subagent's namespace, so grandchild
*   subagents are discovered recursively.
*/
function createSubagentTransformer(scope = []) {
	return () => {
		const subagentsLog = StreamChannel.local();
		/** `lc_agent_name` observed per namespace (first task event wins). */
		const lcByNs = /* @__PURE__ */ new Map();
		/** Triggering task id -> originating LLM `tool_call_id`. */
		const pendingToolCalls = /* @__PURE__ */ new Map();
		/**
		* Namespace key -> the `tool_call_id` of the most recent tool to start
		* executing there. A tool that invokes a subagent emits its `tool-started`
		* at the tools-node namespace (`tools:<task_id>`) where the subagent then
		* roots, so this is the tool call that caused the subagent.
		*/
		const activeToolCallByNs = /* @__PURE__ */ new Map();
		const handles = /* @__PURE__ */ new Map();
		const depth = scope.length;
		function recordIdentity(ns, data) {
			const key = nsKey(ns);
			if (lcByNs.has(key)) return;
			const lc = (isRecord(data) && isRecord(data.metadata) ? data.metadata : void 0)?.lc_agent_name;
			lcByNs.set(key, typeof lc === "string" ? lc : void 0);
		}
		function recordPendingToolCalls(data) {
			if (!isRecord(data)) return;
			const taskId = data.id;
			if (typeof taskId !== "string") return;
			const input = data.input;
			let toolCallId;
			if (isRecord(input) && isRecord(input.tool_call)) {
				const candidate = input.tool_call.id;
				if (typeof candidate === "string") toolCallId = candidate;
			} else if (Array.isArray(input)) {
				for (const toolCall of input) if (isRecord(toolCall) && typeof toolCall.id === "string") {
					toolCallId = toolCall.id;
					break;
				}
			}
			if (toolCallId != null) pendingToolCalls.set(taskId, toolCallId);
		}
		/**
		* Derive the `toolCall` cause for a named-subagent namespace.
		*
		* Primary signal: the tool whose `tool-started` event fired at the
		* subagent's own namespace (the tools node it roots under). Fallback: the
		* namespace segment's task id (`node:<task_id>`) joined to a tool call
		* harvested from a `tool_call_with_context`-shaped task input, so the
		* derivation stays correct if that shape reaches the stream in the future.
		*/
		function deriveCause(ns) {
			const active = activeToolCallByNs.get(nsKey(ns));
			if (typeof active === "string" && active.length > 0) return {
				type: "toolCall",
				tool_call_id: active
			};
			const segment = ns[ns.length - 1];
			const colon = segment.indexOf(":");
			if (colon === -1) return void 0;
			const triggerCallId = segment.slice(colon + 1);
			if (triggerCallId.length === 0) return void 0;
			const toolCallId = pendingToolCalls.get(triggerCallId);
			if (typeof toolCallId !== "string" || toolCallId.length === 0) return;
			return {
				type: "toolCall",
				tool_call_id: toolCallId
			};
		}
		function maybeStartSubagent(ns) {
			if (ns.length !== depth + 1 || !hasPrefix(ns, scope)) return;
			const key = nsKey(ns);
			if (handles.has(key)) return;
			const lc = lcByNs.get(key);
			if (typeof lc !== "string" || lc.length === 0) return;
			const messages = createMessagesTransformer(ns);
			const messagesProjection = messages.init();
			const toolCall = createToolCallTransformer(ns)();
			const toolCallProjection = toolCall.init();
			const nested = createSubagentTransformer(ns)();
			const nestedProjection = nested.init();
			let resolveOutput;
			let rejectOutput;
			const output = new Promise((resolve, reject) => {
				resolveOutput = resolve;
				rejectOutput = reject;
			});
			handles.set(key, {
				key,
				path: ns,
				name: lc,
				messages,
				toolCall,
				nested,
				resolveOutput,
				rejectOutput,
				latestValues: void 0,
				done: false
			});
			subagentsLog.push({
				name: lc,
				cause: deriveCause(ns),
				output,
				messages: messagesProjection.messages,
				toolCalls: toolCallProjection.toolCalls,
				subagents: nestedProjection.subagents
			});
		}
		function finishHandle(handle, outcome) {
			if (handle.done) return;
			handle.done = true;
			if (outcome.type === "resolve") handle.resolveOutput(handle.latestValues);
			else handle.rejectOutput(outcome.error);
			handle.messages.finalize?.();
			handle.toolCall.finalize?.();
			handle.nested.finalize?.();
		}
		return {
			__native: true,
			init: () => ({ subagents: subagentsLog }),
			process(event) {
				const ns = event.params.namespace;
				const data = event.params.data;
				const isTaskResult = event.method === "tasks" && isRecord(data) && "result" in data;
				if (event.method === "tools" && isRecord(data) && data.event === "tool-started" && typeof data.tool_call_id === "string" && data.tool_call_id.length > 0) activeToolCallByNs.set(nsKey(ns), data.tool_call_id);
				if (event.method === "tasks" && !isTaskResult) {
					recordIdentity(ns, data);
					recordPendingToolCalls(data);
					maybeStartSubagent(ns);
				}
				for (const handle of handles.values()) {
					if (handle.done) continue;
					if (!hasPrefix(ns, handle.path)) continue;
					handle.messages.process(event);
					handle.toolCall.process(event);
					handle.nested.process(event);
					if (nsKey(ns) === handle.key) {
						if (event.method === "values" && isRecord(data)) handle.latestValues = data;
						else if (event.method === "lifecycle" && isRecord(data)) {
							const status = data.event;
							if (status === "completed" || status === "interrupted") finishHandle(handle, { type: "resolve" });
							else if (status === "failed") finishHandle(handle, {
								type: "reject",
								error: /* @__PURE__ */ new Error(`Subagent ${handle.name} failed`)
							});
						}
					}
				}
				return true;
			},
			finalize() {
				for (const handle of handles.values()) finishHandle(handle, { type: "resolve" });
				subagentsLog.close();
			},
			fail(err) {
				for (const handle of handles.values()) finishHandle(handle, {
					type: "reject",
					error: err
				});
				subagentsLog.fail(err);
			}
		};
	};
}
//#endregion
//#region node_modules/langchain/dist/agents/middleware/types.js
/**
* Unique symbol used to brand middleware instances.
* This prevents functions from being accidentally assignable to AgentMiddleware
* since functions have a 'name' property that would otherwise make them structurally compatible.
*/
var MIDDLEWARE_BRAND = Symbol.for("AgentMiddleware");
//#endregion
//#region node_modules/langchain/dist/agents/middleware.js
/**
* Creates a middleware instance with automatic schema inference.
*
* @param config - Middleware configuration
* @param config.name - The name of the middleware
* @param config.stateSchema - The schema of the middleware state
* @param config.contextSchema - The schema of the middleware context
* @param config.wrapModelCall - The function to wrap model invocation
* @param config.wrapToolCall - The function to wrap tool invocation
* @param config.beforeModel - The function to run before the model call
* @param config.afterModel - The function to run after the model call
* @param config.beforeAgent - The function to run before the agent execution starts
* @param config.afterAgent - The function to run after the agent execution completes
* @param config.tools - Additional tools registered by the middleware
* @param config.streamTransformers - Stream transformer factories registered by the middleware
* @returns A middleware instance
*
* @example Using Zod schema
* ```ts
* const authMiddleware = createMiddleware({
*   name: "AuthMiddleware",
*   stateSchema: z.object({
*     isAuthenticated: z.boolean().default(false),
*   }),
*   contextSchema: z.object({
*     userId: z.string(),
*   }),
*   beforeModel: async (state, runtime) => {
*     if (!state.isAuthenticated) {
*       throw new Error("Not authenticated");
*     }
*   },
* });
* ```
*
* @example Using StateSchema
* ```ts
* import { StateSchema, ReducedValue } from "@langchain/langgraph";
*
* const historyMiddleware = createMiddleware({
*   name: "HistoryMiddleware",
*   stateSchema: new StateSchema({
*     count: z.number().default(0),
*     history: new ReducedValue(
*       z.array(z.string()).default(() => []),
*       { inputSchema: z.string(), reducer: (current, next) => [...current, next] }
*     ),
*   }),
*   beforeModel: async (state, runtime) => {
*     return { count: state.count + 1 };
*   },
* });
* ```
*/
function createMiddleware(config) {
	return {
		[MIDDLEWARE_BRAND]: true,
		name: config.name,
		stateSchema: config.stateSchema,
		contextSchema: config.contextSchema,
		wrapToolCall: config.wrapToolCall,
		wrapModelCall: config.wrapModelCall,
		beforeAgent: config.beforeAgent,
		beforeModel: config.beforeModel,
		afterModel: config.afterModel,
		afterAgent: config.afterAgent,
		tools: config.tools,
		streamTransformers: config.streamTransformers
	};
}
//#endregion
//#region node_modules/langchain/dist/agents/annotation.js
function createAgentState(hasStructuredResponse = true, stateSchema, middlewareList = []) {
	/**
	* Collect fields from state schemas
	*/
	const stateFields = { jumpTo: new UntrackedValue() };
	const inputFields = {};
	const outputFields = {};
	const applySchema = (schema) => {
		if (StateSchema.isInstance(schema)) {
			for (const [key, field] of Object.entries(schema.fields)) if (!(key in stateFields)) {
				stateFields[key] = field;
				if (key.startsWith("_")) continue;
				if (ReducedValue.isInstance(field)) {
					inputFields[key] = field.inputSchema || field.valueSchema;
					outputFields[key] = field.valueSchema;
				} else {
					inputFields[key] = field;
					outputFields[key] = field;
				}
			}
			return;
		}
		const shape = getInteropZodObjectShape(schema);
		for (const [key, fieldSchema] of Object.entries(shape)) {
			const isPrivate = key.startsWith("_");
			if (!(key in stateFields)) {
				if (isZodSchemaV4(fieldSchema)) {
					const meta = schemaMetaRegistry.get(fieldSchema);
					if (meta?.reducer) {
						if (meta.reducer.schema) {
							stateFields[key] = new ReducedValue(fieldSchema, {
								inputSchema: meta.reducer.schema,
								reducer: meta.reducer.fn
							});
							if (!isPrivate) {
								inputFields[key] = meta.reducer.schema;
								outputFields[key] = fieldSchema;
							}
						} else {
							stateFields[key] = new ReducedValue(fieldSchema, { reducer: meta.reducer.fn });
							if (!isPrivate) {
								inputFields[key] = fieldSchema;
								outputFields[key] = fieldSchema;
							}
						}
						continue;
					}
				}
				stateFields[key] = fieldSchema;
				if (!isPrivate) {
					inputFields[key] = fieldSchema;
					outputFields[key] = fieldSchema;
				}
			}
		}
	};
	/**
	* Add state schema properties from user-provided schema.
	* Supports both StateSchema and Zod v3/v4 objects.
	*/
	if (stateSchema && (StateSchema.isInstance(stateSchema) || isInteropZodObject(stateSchema))) applySchema(stateSchema);
	/**
	* Add state schema properties from middleware.
	* Supports both StateSchema and Zod v3/v4 objects.
	*/
	for (const middleware of middlewareList) if (middleware.stateSchema && (StateSchema.isInstance(middleware.stateSchema) || isInteropZodObject(middleware.stateSchema))) applySchema(middleware.stateSchema);
	if (hasStructuredResponse) outputFields.structuredResponse = new UntrackedValue();
	/**
	* Create StateSchema instances for state, input, and output.
	* Using MessagesValue provides the proper message reducer behavior.
	*/
	return {
		state: new StateSchema({
			messages: MessagesValue,
			...stateFields
		}),
		input: new StateSchema({
			messages: MessagesValue,
			...inputFields
		}),
		output: new StateSchema({
			messages: MessagesValue,
			...outputFields
		})
	};
}
//#endregion
//#region node_modules/langchain/dist/agents/utils.js
var NAME_PATTERN = /<name>(.*?)<\/name>/s;
var CONTENT_PATTERN = /<content>(.*?)<\/content>/s;
/**
* Parse middleware state from the full agent state based on the middleware's stateSchema.
*
* Handles two types of state schemas:
* 1. Zod schemas (v3 or v4) - parsed using interopParse
* 2. LangGraph StateSchema - extracts only the keys defined in `fields`
*
* @param stateSchema - The middleware's state schema (Zod or LangGraph StateSchema)
* @param state - The full agent state to parse from
* @returns Parsed state containing only the keys defined in the schema
*/
function parseMiddlewareState(stateSchema, state) {
	if (StateSchema.isInstance(stateSchema)) {
		const result = {};
		for (const key of Object.keys(stateSchema.fields)) if (key in state) result[key] = state[key];
		return result;
	}
	if (isInteropZodSchema(stateSchema)) return interopParse(stateSchema, state);
	throw new Error(`Invalid state schema type: ${typeof stateSchema}`);
}
/**
* Attach formatted agent names to the messages passed to and from a language model.
*
* This is useful for making a message history with multiple agents more coherent.
*
* NOTE: agent name is consumed from the message.name field.
* If you're using an agent built with createAgent, name is automatically set.
* If you're building a custom agent, make sure to set the name on the AI message returned by the LLM.
*
* @param message - Message to add agent name formatting to
* @returns Message with agent name formatting
*
* @internal
*/
function _addInlineAgentName(message) {
	if (!AIMessage.isInstance(message) || AIMessageChunk.isInstance(message)) return message;
	if (!message.name) return message;
	const { name } = message;
	if (typeof message.content === "string") return new AIMessage({
		...message.lc_kwargs,
		content: `<name>${name}</name><content>${message.content}</content>`,
		name: void 0
	});
	const updatedContent = [];
	let textBlockCount = 0;
	for (const contentBlock of message.content) if (typeof contentBlock === "string") {
		textBlockCount += 1;
		updatedContent.push(`<name>${name}</name><content>${contentBlock}</content>`);
	} else if (typeof contentBlock === "object" && "type" in contentBlock && contentBlock.type === "text") {
		textBlockCount += 1;
		updatedContent.push({
			...contentBlock,
			text: `<name>${name}</name><content>${contentBlock.text}</content>`
		});
	} else updatedContent.push(contentBlock);
	if (!textBlockCount) updatedContent.unshift({
		type: "text",
		text: `<name>${name}</name><content></content>`
	});
	return new AIMessage({
		...message.lc_kwargs,
		content: updatedContent,
		name: void 0
	});
}
/**
* Remove explicit name and content XML tags from the AI message content.
*
* Examples:
*
* @example
* ```typescript
* removeInlineAgentName(new AIMessage({ content: "<name>assistant</name><content>Hello</content>", name: "assistant" }))
* // AIMessage with content: "Hello"
*
* removeInlineAgentName(new AIMessage({ content: [{type: "text", text: "<name>assistant</name><content>Hello</content>"}], name: "assistant" }))
* // AIMessage with content: [{type: "text", text: "Hello"}]
* ```
*
* @internal
*/
function _removeInlineAgentName(message) {
	if (!AIMessage.isInstance(message) || !message.content) return message;
	let updatedContent = [];
	let updatedName;
	if (Array.isArray(message.content)) updatedContent = message.content.filter((block) => {
		if (block.type === "text" && typeof block.text === "string") {
			const nameMatch = block.text.match(NAME_PATTERN);
			const contentMatch = block.text.match(CONTENT_PATTERN);
			if (nameMatch && (!contentMatch || contentMatch[1] === "")) {
				updatedName = nameMatch[1];
				return false;
			}
			return true;
		}
		return true;
	}).map((block) => {
		if (block.type === "text" && typeof block.text === "string") {
			const nameMatch = block.text.match(NAME_PATTERN);
			const contentMatch = block.text.match(CONTENT_PATTERN);
			if (!nameMatch || !contentMatch) return block;
			updatedName = nameMatch[1];
			return {
				...block,
				text: contentMatch[1]
			};
		}
		return block;
	});
	else {
		const content = message.content;
		const nameMatch = content.match(NAME_PATTERN);
		const contentMatch = content.match(CONTENT_PATTERN);
		if (!nameMatch || !contentMatch) return message;
		updatedName = nameMatch[1];
		updatedContent = contentMatch[1];
	}
	return new AIMessage({
		...Object.keys(message.lc_kwargs ?? {}).length > 0 ? message.lc_kwargs : message,
		content: updatedContent,
		name: updatedName
	});
}
function isClientTool(tool) {
	return Runnable.isRunnable(tool);
}
/**
* Helper function to check if a language model has a bindTools method.
* @param llm - The language model to check if it has a bindTools method.
* @returns True if the language model has a bindTools method, false otherwise.
*/
function _isChatModelWithBindTools(llm) {
	if (!isBaseChatModel(llm)) return false;
	return "bindTools" in llm && typeof llm.bindTools === "function";
}
/**
* Helper function to bind tools to a language model.
* @param llm - The language model to bind tools to.
* @param toolClasses - The tools to bind to the language model.
* @param options - The options to pass to the language model.
* @returns The language model with the tools bound to it.
*/
var _simpleBindTools = (llm, toolClasses, options = {}) => {
	if (_isChatModelWithBindTools(llm)) return llm.bindTools(toolClasses, options);
	if (RunnableBinding.isRunnableBinding(llm) && _isChatModelWithBindTools(llm.bound)) {
		const newBound = llm.bound.bindTools(toolClasses, options);
		if (RunnableBinding.isRunnableBinding(newBound)) return new RunnableBinding({
			bound: newBound.bound,
			config: {
				...llm.config,
				...newBound.config
			},
			kwargs: {
				...llm.kwargs,
				...newBound.kwargs
			},
			configFactories: newBound.configFactories ?? llm.configFactories
		});
		return new RunnableBinding({
			bound: newBound,
			config: llm.config,
			kwargs: llm.kwargs,
			configFactories: llm.configFactories
		});
	}
	return null;
};
/**
* Check if the LLM already has bound tools and throw if it does.
*
* @param llm - The LLM to check.
* @returns void
*/
function validateLLMHasNoBoundTools(llm) {
	/**
	* If llm is a function, we can't validate until runtime, so skip
	*/
	if (typeof llm === "function") return;
	let model = llm;
	/**
	* If model is a RunnableSequence, find a RunnableBinding in its steps
	*/
	if (RunnableSequence.isRunnableSequence(model)) model = model.steps.find((step) => RunnableBinding.isRunnableBinding(step)) || model;
	/**
	* If model is configurable, get the underlying model
	*/
	if (isConfigurableModel(model))
 /**
	* Can't validate async model retrieval in constructor
	*/
	return;
	/**
	* Check if model is a RunnableBinding with bound tools
	*/
	if (RunnableBinding.isRunnableBinding(model)) {
		const hasToolsInKwargs = model.kwargs != null && typeof model.kwargs === "object" && "tools" in model.kwargs && Array.isArray(model.kwargs.tools) && model.kwargs.tools.length > 0;
		const hasToolsInConfig = model.config != null && typeof model.config === "object" && "tools" in model.config && Array.isArray(model.config.tools) && model.config.tools.length > 0;
		if (hasToolsInKwargs || hasToolsInConfig) throw new MultipleToolsBoundError();
	}
	/**
	* Also check if model has tools property directly (e.g., FakeToolCallingModel)
	*/
	if ("tools" in model && model.tools !== void 0 && Array.isArray(model.tools) && model.tools.length > 0) throw new MultipleToolsBoundError();
}
/**
* Check if the last message in the messages array has tool calls.
*
* @param messages - The messages to check.
* @returns True if the last message has tool calls, false otherwise.
*/
function hasToolCalls(message) {
	return Boolean(AIMessage.isInstance(message) && message.tool_calls && message.tool_calls.length > 0);
}
/**
* Normalizes a system prompt to a SystemMessage object.
* If it's already a SystemMessage, returns it as-is.
* If it's a string, converts it to a SystemMessage.
* If it's undefined, creates an empty system message so it is easier to append to it later.
*/
function normalizeSystemPrompt$1(systemPrompt) {
	if (systemPrompt == null) return new SystemMessage("");
	if (SystemMessage.isInstance(systemPrompt)) return systemPrompt;
	if (typeof systemPrompt === "string") return new SystemMessage({ content: [{
		type: "text",
		text: systemPrompt
	}] });
	throw new Error(`Invalid systemPrompt type: expected string or SystemMessage, got ${typeof systemPrompt}`);
}
/**
* Helper function to bind tools to a language model.
* @param llm - The language model to bind tools to.
* @param toolClasses - The tools to bind to the language model.
* @param options - The options to pass to the language model.
* @returns The language model with the tools bound to it.
*/
async function bindTools(llm, toolClasses, options = {}) {
	const model = _simpleBindTools(llm, toolClasses, options);
	if (model) return model;
	if (isConfigurableModel(llm)) {
		const model = _simpleBindTools(await llm._getModelInstance(), toolClasses, options);
		if (model) return model;
	}
	if (RunnableSequence.isRunnableSequence(llm)) {
		const modelStep = llm.steps.findIndex((step) => RunnableBinding.isRunnableBinding(step) || isBaseChatModel(step) || isConfigurableModel(step));
		if (modelStep >= 0) {
			const model = _simpleBindTools(llm.steps[modelStep], toolClasses, options);
			if (model) {
				const nextSteps = llm.steps.slice();
				nextSteps.splice(modelStep, 1, model);
				return RunnableSequence.from(nextSteps);
			}
		}
	}
	throw new Error(`llm ${llm} must define bindTools method.`);
}
/**
* Compose multiple wrapToolCall handlers into a single middleware stack.
*
* Composes handlers so the first in the list becomes the outermost layer.
* Each handler receives a handler callback to execute inner layers.
*
* @param handlers - List of handlers. First handler wraps all others.
* @returns Composed handler, or undefined if handlers array is empty.
*
* @example
* ```typescript
* // handlers=[auth, retry] means: auth wraps retry
* // Flow: auth calls retry, retry calls base handler
* const auth: ToolCallWrapper = async (request, handler) => {
*   try {
*     return await handler(request);
*   } catch (error) {
*     if (error.message === "Unauthorized") {
*       await refreshToken();
*       return await handler(request);
*     }
*     throw error;
*   }
* };
*
* const retry: ToolCallWrapper = async (request, handler) => {
*   for (let attempt = 0; attempt < 3; attempt++) {
*     try {
*       return await handler(request);
*     } catch (error) {
*       if (attempt === 2) throw error;
*     }
*   }
*   throw new Error("Unreachable");
* };
*
* const composedHandler = chainToolCallHandlers([auth, retry]);
* ```
*/
function chainToolCallHandlers(handlers) {
	if (handlers.length === 0) return;
	if (handlers.length === 1) return handlers[0];
	function composeTwo(outer, inner) {
		return async (request, handler) => {
			const innerHandler = async (passedRequest) => {
				return inner(passedRequest, handler);
			};
			return outer(request, innerHandler);
		};
	}
	let result = handlers[handlers.length - 1];
	for (let i = handlers.length - 2; i >= 0; i--) result = composeTwo(handlers[i], result);
	return result;
}
/**
* Wrapping `wrapToolCall` invocation so we can inject middleware name into
* the error message.
*
* @param middleware list of middleware passed to the agent
* @param state state of the agent
* @returns single wrap function
*/
function wrapToolCall(middleware) {
	const middlewareWithWrapToolCall = middleware.filter((m) => m.wrapToolCall);
	if (middlewareWithWrapToolCall.length === 0) return;
	return chainToolCallHandlers(middlewareWithWrapToolCall.map((m) => {
		const originalHandler = m.wrapToolCall;
		/**
		* Wrap with error handling and validation
		*/
		const wrappedHandler = async (request, handler) => {
			/**
			* Capture the original state for this middleware's schema parsing.
			* This is important because the request may be modified (via override)
			* as it passes through the middleware chain, but each middleware
			* should always see the full original state for its schema parsing.
			*/
			const originalState = request.state;
			/**
			* Create a handler that preserves state parsing for this middleware
			* while allowing tool/toolCall/state modifications from inner middleware
			*/
			const downstreamErrors = /* @__PURE__ */ new Set();
			const wrappedInnerHandler = async (passedRequest) => {
				/**
				* Merge the passed request with the original state for parsing.
				* This ensures middleware can override tool/toolCall while
				* maintaining proper state parsing for each middleware in the chain.
				*/
				const mergedState = {
					...originalState,
					...passedRequest.state
				};
				try {
					return await handler({
						...passedRequest,
						state: mergedState
					});
				} catch (error) {
					downstreamErrors.add(error);
					throw error;
				}
			};
			try {
				const result = await originalHandler({
					...request,
					/**
					* override state with the state from the specific middleware
					*/
					state: {
						messages: originalState.messages,
						...m.stateSchema ? parseMiddlewareState(m.stateSchema, { ...originalState }) : {}
					}
				}, wrappedInnerHandler);
				/**
				* Validate return type
				*/
				if (!ToolMessage.isInstance(result) && !isCommand(result)) throw new Error(`Invalid response from "wrapToolCall" in middleware "${m.name}": expected ToolMessage or Command, got ${typeof result}`);
				return result;
			} catch (error) {
				if (downstreamErrors.has(error)) throw error;
				throw MiddlewareError.wrap(error, m.name);
			}
		};
		return wrappedHandler;
	}));
}
/**
* Static LangGraph config keys propagated from ReactAgent defaults onto the
* compiled inner graph. This ensures values set via `withConfig()` survive
* LangGraph API loading, which unwraps ReactAgent to `.graph` before execution.
*/
var GRAPH_DEFAULT_CONFIG_KEYS = [
	"tags",
	"metadata",
	"runName",
	"maxConcurrency",
	"recursionLimit",
	"configurable"
];
function toGraphDefaultConfig(config) {
	const result = {};
	for (const key of GRAPH_DEFAULT_CONFIG_KEYS) {
		const value = config[key];
		if (value !== void 0) result[key] = value;
	}
	return result;
}
//#endregion
//#region node_modules/langchain/dist/agents/nodes/utils.js
/**
* Helper function to initialize middleware state defaults.
* This is used to ensure all middleware state properties are initialized.
*
* Private properties (starting with _) are automatically made optional since
* users cannot provide them when invoking the agent.
*/
async function initializeMiddlewareStates(middlewareList, state) {
	const middlewareStates = {};
	for (const middleware of middlewareList) {
		/**
		* skip middleware if it doesn't have a state schema
		*/
		if (!middleware.stateSchema) continue;
		let zodSchema;
		if (StateSchema.isInstance(middleware.stateSchema)) {
			const zodShape = {};
			for (const [key, field] of Object.entries(middleware.stateSchema.fields)) if (ReducedValue.isInstance(field)) zodShape[key] = field.inputSchema || field.valueSchema;
			else zodShape[key] = field;
			zodSchema = object(zodShape);
		} else if (isInteropZodObject(middleware.stateSchema)) zodSchema = middleware.stateSchema;
		else continue;
		const parseResult = await interopSafeParseAsync(interopZodObjectMakeFieldsOptional(zodSchema, (key) => key.startsWith("_")), state);
		if (parseResult.success) {
			Object.assign(middlewareStates, parseResult.data);
			continue;
		}
		/**
		* If safeParse fails, there are required public fields missing.
		* Note: Zod v3 uses message "Required", Zod v4 uses "Invalid input: expected X, received undefined"
		*/
		const requiredFields = parseResult.error.issues.filter((issue) => issue.code === "invalid_type").map((issue) => `  - ${issue.path.join(".")}: Required`).join("\n");
		throw new Error(`Middleware "${middleware.name}" has required state fields that must be initialized:\n${requiredFields}\n\nTo fix this, either:\n1. Provide default values in your middleware's state schema using .default():\n   stateSchema: z.object({\n     myField: z.string().default("default value")\n   })\n\n2. Or make the fields optional using .optional():\n   stateSchema: z.object({\n     myField: z.string().optional()\n   })\n\n3. Or ensure you pass these values when invoking the agent:\n   agent.invoke({\n     messages: [...],\n     ${parseResult.error.issues[0]?.path.join(".")}: "value"\n   })`);
	}
	return middlewareStates;
}
/**
* Users can define private and public state for a middleware. Private state properties start with an underscore.
* This function will return the private state properties from the state schema, making all of them optional.
* @param stateSchema - The middleware state schema
* @returns A new schema containing only the private properties (underscore-prefixed), all made optional
*/
function derivePrivateState(stateSchema) {
	const builtInStateSchema = {
		messages: custom(() => []),
		structuredResponse: any().optional()
	};
	if (!stateSchema) return object(builtInStateSchema);
	let shape;
	if (StateSchema.isInstance(stateSchema)) {
		shape = {};
		for (const [key, field] of Object.entries(stateSchema.fields)) if (ReducedValue.isInstance(field)) shape[key] = field.inputSchema || field.valueSchema;
		else shape[key] = field;
	} else if (isInteropZodObject(stateSchema)) shape = getInteropZodObjectShape(stateSchema);
	else return object(builtInStateSchema);
	const privateShape = { ...builtInStateSchema };
	for (const [key, value] of Object.entries(shape)) if (key.startsWith("_")) privateShape[key] = value.optional();
	else privateShape[key] = value;
	return object(privateShape);
}
/**
* Converts any supported schema type (ZodObject, StateSchema, AnnotationRoot) to a partial Zod object.
* This is useful for parsing state loosely where all fields are optional.
*
* @param schema - The schema to convert (InteropZodObject, StateSchema, or AnnotationRoot)
* @returns A partial Zod object schema where all fields are optional
*/
function toPartialZodObject(schema) {
	if (isInteropZodObject(schema)) return interopZodObjectPartial(schema);
	if (StateSchema.isInstance(schema)) {
		const partialShape = {};
		for (const [key, field] of Object.entries(schema.fields)) {
			let fieldSchema;
			if (ReducedValue.isInstance(field)) fieldSchema = field.inputSchema || field.valueSchema;
			else fieldSchema = field;
			partialShape[key] = isZodSchemaV4(fieldSchema) ? fieldSchema.optional() : any().optional();
		}
		return object(partialShape);
	}
	return object({});
}
function parseJumpToTarget(target) {
	if (!target) return;
	/**
	* if target is already a valid jump target, return it
	*/
	if ([
		"model_request",
		"tools",
		"__end__"
	].includes(target)) return target;
	if (target === "model") return "model_request";
	if (target === "tools") return "tools";
	if (target === "end") return END;
	throw new Error(`Invalid jump target: ${target}, must be "model", "tools" or "end".`);
}
/**
* `config` always contains a signal from LangGraphs Pregel class.
* To ensure we acknowledge the abort signal from the user, we merge it
* with the signal from the ToolNode.
*
* @param signals - The signals to merge.
* @returns The merged signal.
*/
function mergeAbortSignals(...signals) {
	return AbortSignal.any(signals.filter((maybeSignal) => maybeSignal !== null && maybeSignal !== void 0 && typeof maybeSignal === "object" && "aborted" in maybeSignal && typeof maybeSignal.aborted === "boolean"));
}
//#endregion
//#region node_modules/langchain/dist/agents/RunnableCallable.js
var RunnableCallable = class extends Runnable {
	lc_namespace = ["langgraph"];
	func;
	tags;
	config;
	trace = true;
	recurse = true;
	#state;
	constructor(fields) {
		super();
		this.name = fields.name ?? fields.func.name;
		this.func = fields.func;
		this.config = fields.tags ? { tags: fields.tags } : void 0;
		this.recurse = fields.recurse ?? this.recurse;
	}
	getState() {
		return this.#state;
	}
	/**
	* This allows us to set the state of the runnable, e.g. for model and middleware nodes.
	* @internal
	*/
	setState(state) {
		this.#state = {
			...this.#state,
			...state
		};
	}
	async invoke(input, options) {
		const mergedConfig = mergeConfigs(this.config, options);
		const returnValue = await AsyncLocalStorageProviderSingleton.runWithConfig(mergedConfig, async () => this.func(input, mergedConfig));
		if (Runnable.isRunnable(returnValue) && this.recurse) return await AsyncLocalStorageProviderSingleton.runWithConfig(mergedConfig, async () => returnValue.invoke(input, mergedConfig));
		this.#state = returnValue;
		return returnValue;
	}
};
//#endregion
//#region node_modules/langchain/dist/agents/withAgentName.js
/**
* Attach formatted agent names to the messages passed to and from a language model.
*
* This is useful for making a message history with multiple agents more coherent.
*
* NOTE: agent name is consumed from the message.name field.
* If you're using an agent built with createAgent, name is automatically set.
* If you're building a custom agent, make sure to set the name on the AI message returned by the LLM.
*
* @param model - Language model to add agent name formatting to
* @param agentNameMode - How to expose the agent name to the LLM
*   - "inline": Add the agent name directly into the content field of the AI message using XML-style tags.
*     Example: "How can I help you" -> "<name>agent_name</name><content>How can I help you?</content>".
*/
function withAgentName(model, agentNameMode) {
	let processInputMessage;
	let processOutputMessage;
	if (agentNameMode === "inline") {
		processInputMessage = _addInlineAgentName;
		processOutputMessage = _removeInlineAgentName;
	} else throw new Error(`Invalid agent name mode: ${agentNameMode}. Needs to be one of: "inline"`);
	function processInputMessages(messages) {
		return messages.map(processInputMessage);
	}
	return RunnableSequence.from([
		RunnableLambda.from(processInputMessages),
		model,
		RunnableLambda.from(processOutputMessage)
	]);
}
//#endregion
//#region node_modules/langchain/dist/agents/nodes/AgentNode.js
/**
* Check if the response is an internal model response.
* @param response - The response to check.
* @returns True if the response is an internal model response, false otherwise.
*/
function isInternalModelResponse(response) {
	return AIMessage.isInstance(response) || isCommand(response) || typeof response === "object" && response !== null && "structuredResponse" in response && "messages" in response;
}
/**
* The name of the agent node in the state graph.
*/
var AGENT_NODE_NAME = "model_request";
var AgentNode = class extends RunnableCallable {
	#options;
	#systemMessage;
	constructor(options) {
		super({
			name: options.name ?? "model",
			func: (input, config) => this.#run(input, config)
		});
		this.#options = options;
		this.#systemMessage = options.systemMessage;
	}
	/**
	* Returns response format primtivies based on given model and response format provided by the user.
	*
	* If the user selects a tool output:
	* - return a record of tools to extract structured output from the model's response
	*
	* if the user selects a native schema output or if the model supports JSON schema output:
	* - return a provider strategy to extract structured output from the model's response
	*
	* @param model - The model to get the response format for.
	* @returns The response format.
	*/
	async #getResponseFormat(model, responseFormat = this.#options.responseFormat) {
		if (!responseFormat) return;
		let resolvedModel;
		if (isConfigurableModel(model)) resolvedModel = await model._getModelInstance();
		else if (typeof model !== "string") resolvedModel = model;
		const strategies = transformResponseFormat(responseFormat, void 0, resolvedModel);
		if (strategies.length === 0) return;
		/**
		* Populate a list of structured tool info.
		*/
		if (!strategies.every((format) => format instanceof ProviderStrategy)) return {
			type: "tool",
			tools: strategies.filter((format) => format instanceof ToolStrategy).reduce((acc, format) => {
				acc[format.name] = format;
				return acc;
			}, {})
		};
		return {
			type: "native",
			/**
			* there can only be one provider strategy
			*/
			strategy: strategies[0]
		};
	}
	async #run(state, config) {
		/**
		* Check if we just executed a returnDirect tool
		* If so, we should generate structured response (if needed) and stop
		*/
		const lastMessage = state.messages.at(-1);
		if (lastMessage && ToolMessage.isInstance(lastMessage) && lastMessage.name && this.#options.shouldReturnDirect.has(lastMessage.name)) return [new Command({ update: { messages: [] } })];
		const { response, lastAiMessage, collectedCommands } = await this.#invokeModel(state, config);
		/**
		* structuredResponse — return as a plain state update dict (not a Command)
		* because the structuredResponse channel uses UntrackedValue(guard=true)
		* which only allows a single write per step.
		*/
		if (typeof response === "object" && response !== null && "structuredResponse" in response && "messages" in response) {
			const { structuredResponse, messages } = response;
			return {
				messages: [...state.messages, ...messages],
				structuredResponse
			};
		}
		const commands = [];
		const aiMessage = AIMessage.isInstance(response) ? response : lastAiMessage;
		if (aiMessage) {
			aiMessage.name = this.name;
			aiMessage.lc_kwargs.name = this.name;
			if (this.#areMoreStepsNeeded(state, aiMessage)) commands.push(new Command({ update: { messages: [new AIMessage({
				content: "Sorry, need more steps to process this request.",
				name: this.name,
				id: aiMessage.id
			})] } }));
			else commands.push(new Command({ update: { messages: [aiMessage] } }));
		}
		if (isCommand(response) && !collectedCommands.includes(response)) commands.push(response);
		commands.push(...collectedCommands);
		return commands;
	}
	/**
	* Derive the model from the options.
	* @param state - The state of the agent.
	* @param config - The config of the agent.
	* @returns The model.
	*/
	#deriveModel() {
		if (typeof this.#options.model === "string") return initChatModel(this.#options.model);
		if (this.#options.model) return this.#options.model;
		throw new Error("No model option was provided, either via `model` option.");
	}
	async #invokeModel(state, config, options = {}) {
		const model = await this.#deriveModel();
		const lgConfig = config;
		/**
		* Create a local variable for current system message to avoid concurrency issues
		* Each invocation gets its own copy
		*/
		let currentSystemMessage = this.#systemMessage;
		/**
		* Shared tracking state for AIMessage and Command collection.
		* lastAiMessage tracks the effective AIMessage through the middleware chain.
		* collectedCommands accumulates Commands returned by middleware (not base handler).
		*/
		let lastAiMessage = null;
		const collectedCommands = [];
		/**
		* Create the base handler that performs the actual model invocation
		*/
		const baseHandler = async (request) => {
			/**
			* Check if the LLM already has bound tools and throw if it does.
			*/
			validateLLMHasNoBoundTools(request.model);
			const structuredResponseFormat = await this.#getResponseFormat(request.model, request.responseFormat);
			const modelWithTools = await this.#bindTools(request.model, request, structuredResponseFormat);
			/**
			* prepend the system message to the messages if it is not empty
			*/
			const messages = [...currentSystemMessage.text === "" ? [] : [currentSystemMessage], ...request.messages];
			const signal = mergeAbortSignals(this.#options.signal, config.signal);
			const response = await raceWithSignal(modelWithTools.invoke(messages, {
				...config,
				signal
			}), signal);
			lastAiMessage = response;
			/**
			* if the user requests a native schema output, try to parse the response
			* and return the structured response if it is valid
			*/
			if (structuredResponseFormat?.type === "native") {
				const structuredResponse = structuredResponseFormat.strategy.parse(response);
				if (structuredResponse) return {
					structuredResponse,
					messages: [response]
				};
				/**
				* If the model produced a terminal response (no tool calls) but the
				* output failed to satisfy the provider strategy's schema, throw an
				* informative error instead of silently exiting with
				* `structuredResponse: undefined`. If tool calls are present, the
				* agent loop continues and a subsequent terminal step will get
				* another chance to produce a valid structured response.
				*/
				if (!response.tool_calls || response.tool_calls.length === 0) throw new StructuredOutputParsingError(typeof structuredResponseFormat.strategy.schema?.title === "string" ? structuredResponseFormat.strategy.schema.title : "providerStrategy", ["Model output did not satisfy the provided response schema."]);
				return response;
			}
			if (!structuredResponseFormat || !response.tool_calls) return response;
			const toolCalls = response.tool_calls.filter((call) => call.name in structuredResponseFormat.tools);
			/**
			* if there were not structured tool calls, we can return the response
			*/
			if (toolCalls.length === 0) return response;
			/**
			* if there were multiple structured tool calls, we should throw an error as this
			* scenario is not defined/supported.
			*/
			if (toolCalls.length > 1) return this.#handleMultipleStructuredOutputs(response, toolCalls, structuredResponseFormat);
			const toolMessageContent = structuredResponseFormat.tools[toolCalls[0].name]?.options?.toolMessageContent;
			return this.#handleSingleStructuredOutput(response, toolCalls[0], structuredResponseFormat, toolMessageContent ?? options.lastMessage);
		};
		const wrapperMiddleware = this.#options.wrapModelCallHookMiddleware ?? [];
		let wrappedHandler = baseHandler;
		/**
		* Build composed handler from last to first so first middleware becomes outermost
		*/
		for (let i = wrapperMiddleware.length - 1; i >= 0; i--) {
			const middlewareEntry = wrapperMiddleware[i];
			const middleware = Array.isArray(middlewareEntry) ? middlewareEntry[0] : middlewareEntry;
			if (middleware.wrapModelCall) {
				const innerHandler = wrappedHandler;
				const currentMiddleware = middleware;
				wrappedHandler = async (request) => {
					const baselineSystemMessage = currentSystemMessage;
					/**
					* Merge context with default context of middleware
					*/
					const context = currentMiddleware.contextSchema ? interopParse(currentMiddleware.contextSchema, lgConfig?.context || {}) : lgConfig?.context;
					/**
					* Create runtime
					*/
					const runtime = Object.freeze({
						context,
						store: lgConfig.store,
						configurable: lgConfig.configurable,
						writer: lgConfig.writer,
						interrupt: lgConfig.interrupt,
						signal: lgConfig.signal
					});
					/**
					* Create the request with state and runtime
					*/
					const requestWithStateAndRuntime = {
						...request,
						state: {
							...middleware.stateSchema ? interopParse(toPartialZodObject(middleware.stateSchema), state) : {},
							messages: state.messages
						},
						runtime
					};
					/**
					* Create handler that validates tools and calls the inner handler
					*/
					const handlerWithValidation = async (req) => {
						currentSystemMessage = baselineSystemMessage;
						/**
						* Validate tool modifications in wrapModelCall.
						*
						* Classify each client tool as either:
						* - "added": a genuinely new tool name not in the static toolClasses
						* - "replaced": same name as a registered tool but different instance
						*
						* Added tools are allowed when a wrapToolCall middleware exists to
						* handle their execution. Replaced tools are always rejected to
						* preserve ToolNode execution identity.
						*/
						const modifiedTools = req.tools ?? [];
						const registeredToolsByName = new Map(this.#options.toolClasses.filter(isClientTool).map((t) => [t.name, t]));
						const addedClientTools = modifiedTools.filter((tool) => isClientTool(tool) && !registeredToolsByName.has(tool.name));
						const replacedClientTools = modifiedTools.filter((tool) => {
							if (!isClientTool(tool)) return false;
							const original = registeredToolsByName.get(tool.name);
							return original != null && original !== tool;
						});
						if (addedClientTools.length > 0) {
							if (!this.#options.middleware?.some((m) => m.wrapToolCall != null)) throw new Error(`You have added a new tool in "wrapModelCall" hook of middleware "${currentMiddleware.name}": ${addedClientTools.map((tool) => tool.name).join(", ")}. This is not supported unless a middleware provides a "wrapToolCall" handler to execute it.`);
						}
						if (replacedClientTools.length > 0) throw new Error(`You have modified a tool in "wrapModelCall" hook of middleware "${currentMiddleware.name}": ${replacedClientTools.map((tool) => tool.name).join(", ")}. This is not supported.`);
						let normalizedReq = req;
						const hasSystemPromptChanged = req.systemPrompt !== currentSystemMessage.text;
						const hasSystemMessageChanged = req.systemMessage !== currentSystemMessage;
						if (hasSystemPromptChanged && hasSystemMessageChanged) throw new Error("Cannot change both systemPrompt and systemMessage in the same request.");
						/**
						* Check if systemPrompt is a string was changed, if so create a new SystemMessage
						*/
						if (hasSystemPromptChanged) {
							currentSystemMessage = new SystemMessage({ content: [{
								type: "text",
								text: req.systemPrompt
							}] });
							normalizedReq = {
								...req,
								systemPrompt: currentSystemMessage.text,
								systemMessage: currentSystemMessage
							};
						}
						/**
						* If the systemMessage was changed, update the current system message
						*/
						if (hasSystemMessageChanged) {
							currentSystemMessage = new SystemMessage({ ...req.systemMessage });
							normalizedReq = {
								...req,
								systemPrompt: currentSystemMessage.text,
								systemMessage: currentSystemMessage
							};
						}
						const innerHandlerResult = await innerHandler(normalizedReq);
						/**
						* Normalize Commands so middleware always sees AIMessage from handler().
						* When an inner handler (base handler or nested middleware) returns a
						* Command (e.g. structured-output retry), substitute the tracked
						* lastAiMessage so the middleware sees an AIMessage, and collect the
						* raw Command so the framework can still propagate it (e.g. for retries).
						*
						* Only collect if not already present: Commands from inner middleware
						* are already tracked via the middleware validation layer (line ~627).
						*/
						if (isCommand(innerHandlerResult) && lastAiMessage) {
							if (!collectedCommands.includes(innerHandlerResult)) collectedCommands.push(innerHandlerResult);
							return lastAiMessage;
						}
						return innerHandlerResult;
					};
					if (!currentMiddleware.wrapModelCall) return handlerWithValidation(requestWithStateAndRuntime);
					try {
						const middlewareResponse = await currentMiddleware.wrapModelCall(requestWithStateAndRuntime, handlerWithValidation);
						/**
						* Validate that this specific middleware returned a valid response
						*/
						if (!isInternalModelResponse(middlewareResponse)) throw new Error(`Invalid response from "wrapModelCall" in middleware "${currentMiddleware.name}": expected AIMessage or Command, got ${typeof middlewareResponse}`);
						if (AIMessage.isInstance(middlewareResponse)) lastAiMessage = middlewareResponse;
						else if (isCommand(middlewareResponse)) collectedCommands.push(middlewareResponse);
						return middlewareResponse;
					} catch (error) {
						throw MiddlewareError.wrap(error, currentMiddleware.name);
					}
				};
			}
		}
		/**
		* Execute the wrapped handler with the initial request
		* Reset current system prompt to initial state and convert to string using .text getter
		* for backwards compatibility with ModelRequest
		*/
		currentSystemMessage = this.#systemMessage;
		const initialRequest = {
			model,
			responseFormat: this.#options.responseFormat,
			systemPrompt: currentSystemMessage?.text,
			systemMessage: currentSystemMessage,
			messages: state.messages,
			tools: this.#options.toolClasses,
			state,
			runtime: Object.freeze({
				context: lgConfig?.context,
				store: lgConfig.store,
				configurable: lgConfig.configurable,
				writer: lgConfig.writer,
				interrupt: lgConfig.interrupt,
				signal: lgConfig.signal
			})
		};
		return {
			response: await wrappedHandler(initialRequest),
			lastAiMessage,
			collectedCommands
		};
	}
	/**
	* If the model returns multiple structured outputs, we need to handle it.
	* @param response - The response from the model
	* @param toolCalls - The tool calls that were made
	* @returns The response from the model
	*/
	#handleMultipleStructuredOutputs(response, toolCalls, responseFormat) {
		const multipleStructuredOutputsError = new MultipleStructuredOutputsError(toolCalls.map((call) => call.name));
		return this.#handleToolStrategyError(multipleStructuredOutputsError, response, toolCalls[0], responseFormat);
	}
	/**
	* If the model returns a single structured output, we need to handle it.
	* @param toolCall - The tool call that was made
	* @returns The structured response and a message to the LLM if needed
	*/
	#handleSingleStructuredOutput(response, toolCall, responseFormat, lastMessage) {
		const tool = responseFormat.tools[toolCall.name];
		try {
			const structuredResponse = tool.parse(toolCall.args);
			return {
				structuredResponse,
				messages: [
					response,
					new ToolMessage({
						tool_call_id: toolCall.id ?? "",
						content: JSON.stringify(structuredResponse),
						name: toolCall.name
					}),
					new AIMessage(lastMessage ?? `Returning structured response: ${JSON.stringify(structuredResponse)}`)
				]
			};
		} catch (error) {
			return this.#handleToolStrategyError(error, response, toolCall, responseFormat);
		}
	}
	async #handleToolStrategyError(error, response, toolCall, responseFormat) {
		/**
		* Using the `errorHandler` option of the first `ToolStrategy` entry is sufficient here.
		* There is technically only one `ToolStrategy` entry in `structuredToolInfo` if the user
		* uses `toolStrategy` to define the response format. If the user applies a list of json
		* schema objects, these will be transformed into multiple `ToolStrategy` entries but all
		* with the same `handleError` option.
		*/
		const errorHandler = Object.values(responseFormat.tools).at(0)?.options?.handleError;
		const toolCallId = toolCall.id;
		if (!toolCallId) throw new Error("Tool call ID is required to handle tool output errors. Please provide a tool call ID.");
		/**
		* Default behavior: retry if `errorHandler` is undefined or truthy.
		* Only throw if explicitly set to `false`.
		*/
		if (errorHandler === false) throw error;
		/**
		* retry if:
		*/
		if (errorHandler === void 0 || typeof errorHandler === "boolean" && errorHandler || Array.isArray(errorHandler) && errorHandler.some((h) => h instanceof MultipleStructuredOutputsError)) return new Command({
			update: { messages: [response, new ToolMessage({
				content: error.message,
				tool_call_id: toolCallId
			})] },
			goto: AGENT_NODE_NAME
		});
		/**
		* if `errorHandler` is a string, retry the tool call with given string
		*/
		if (typeof errorHandler === "string") return new Command({
			update: { messages: [response, new ToolMessage({
				content: errorHandler,
				tool_call_id: toolCallId
			})] },
			goto: AGENT_NODE_NAME
		});
		/**
		* if `errorHandler` is a function, retry the tool call with the function
		*/
		if (typeof errorHandler === "function") {
			const content = await errorHandler(error);
			if (typeof content !== "string") throw new Error("Error handler must return a string.");
			return new Command({
				update: { messages: [response, new ToolMessage({
					content,
					tool_call_id: toolCallId
				})] },
				goto: AGENT_NODE_NAME
			});
		}
		/**
		* Default: retry if we reach here
		*/
		return new Command({
			update: { messages: [response, new ToolMessage({
				content: error.message,
				tool_call_id: toolCallId
			})] },
			goto: AGENT_NODE_NAME
		});
	}
	#areMoreStepsNeeded(state, response) {
		const allToolsReturnDirect = AIMessage.isInstance(response) && response.tool_calls?.every((call) => this.#options.shouldReturnDirect.has(call.name));
		const remainingSteps = "remainingSteps" in state ? state.remainingSteps : void 0;
		return Boolean(remainingSteps && (remainingSteps < 1 && allToolsReturnDirect || remainingSteps < 2 && hasToolCalls(state.messages.at(-1))));
	}
	async #bindTools(model, preparedOptions, structuredResponseFormat) {
		const options = {};
		const structuredTools = Object.values(structuredResponseFormat && "tools" in structuredResponseFormat ? structuredResponseFormat.tools : {});
		/**
		* Use tools from preparedOptions if provided, otherwise use default tools
		*/
		const allTools = [...preparedOptions?.tools ?? this.#options.toolClasses, ...structuredTools.map((toolStrategy) => toolStrategy.tool)];
		/**
		* If there are structured tools, we need to set the tool choice to "any"
		* so that the model can choose to use a structured tool or not.
		*/
		const toolChoice = preparedOptions?.toolChoice || (structuredTools.length > 0 ? "any" : void 0);
		/**
		* check if the user requests a native schema output
		*/
		if (structuredResponseFormat?.type === "native") {
			const resolvedStrict = preparedOptions?.modelSettings?.strict ?? structuredResponseFormat?.strategy?.strict ?? true;
			const jsonSchemaParams = {
				name: structuredResponseFormat.strategy.schema?.name ?? "extract",
				description: getSchemaDescription(structuredResponseFormat.strategy.schema),
				schema: structuredResponseFormat.strategy.schema,
				strict: resolvedStrict
			};
			Object.assign(options, {
				/**
				* OpenAI-style options
				* Used by ChatOpenAI, ChatXAI, and other OpenAI-compatible providers.
				*/
				response_format: {
					type: "json_schema",
					json_schema: jsonSchemaParams
				},
				/**
				* Anthropic-style options
				*/
				outputConfig: { format: {
					type: "json_schema",
					schema: structuredResponseFormat.strategy.schema
				} },
				/**
				* Google-style options
				* Used by ChatGoogle and other Gemini-based providers.
				*/
				responseSchema: structuredResponseFormat.strategy.schema,
				/**
				* for LangSmith structured output tracing
				*/
				ls_structured_output_format: {
					kwargs: { method: "json_schema" },
					schema: structuredResponseFormat.strategy.schema
				},
				/**
				* Don't force strict on tools: it makes Anthropic's combined grammar
				* "too complex for compilation", and only OpenAI Chat Completions needs
				* it (re-applied there). Honor an explicit override; else leave unset.
				*/
				strict: preparedOptions?.modelSettings?.strict
			});
		}
		/**
		* Bind tools to the model if they are not already bound.
		*/
		const modelWithTools = await bindTools(model, allTools, {
			...options,
			...preparedOptions?.modelSettings,
			tool_choice: toolChoice
		});
		return this.#options.includeAgentName === "inline" ? withAgentName(modelWithTools, this.#options.includeAgentName) : modelWithTools;
	}
	/**
	* Returns internal bookkeeping state for StateManager, not graph output.
	* The return shape differs from the node's output type (Command).
	*/
	getState() {
		const state = super.getState();
		return {
			messages: [],
			...state && !isCommand(state) ? state : {}
		};
	}
};
//#endregion
//#region node_modules/langchain/dist/agents/nodes/ToolNode.js
/**
* Error message template for when middleware adds tools that can't be executed.
* This happens when middleware modifies tools in wrapModelCall but doesn't provide
* a wrapToolCall handler to execute them.
*/
var getInvalidToolError = (toolName, availableTools) => `Error: ${toolName} is not a valid tool, try one of [${availableTools.join(", ")}].`;
/**
* The name of the tool node in the state graph.
*/
var TOOLS_NODE_NAME = "tools";
var isBaseMessageArray = (input) => Array.isArray(input) && input.every(BaseMessage.isInstance);
var isMessagesState = (input) => typeof input === "object" && input != null && "messages" in input && isBaseMessageArray(input.messages);
var isSendInput = (input) => typeof input === "object" && input != null && "lg_tool_call" in input;
/**
* Default error handler for tool errors.
*
* This is applied to errors from baseHandler (tool execution).
* For errors from wrapToolCall middleware, those are handled separately
* and will bubble up by default.
*
* Catches all tool execution errors and converts them to ToolMessage.
* This allows the LLM to see the error and potentially retry with different arguments.
*/
function defaultHandleToolErrors(error, toolCall) {
	if (ToolInvocationError.isInstance(error)) return new ToolMessage({
		content: error.message,
		tool_call_id: toolCall.id,
		name: toolCall.name
	});
	/**
	* Catch all other tool errors and convert to ToolMessage
	*/
	return new ToolMessage({
		content: `${error}\n Please fix your mistakes.`,
		tool_call_id: toolCall.id,
		name: toolCall.name
	});
}
/**
* `ToolNode` is a built-in LangGraph component that handles tool calls within an agent's workflow.
* It works seamlessly with `createAgent`, offering advanced tool execution control, built
* in parallelism, and error handling.
*
* @example
* ```ts
* import { ToolNode, tool, AIMessage } from "langchain";
* import { z } from "zod/v3";
*
* const getWeather = tool((input) => {
*   if (["sf", "san francisco"].includes(input.location.toLowerCase())) {
*     return "It's 60 degrees and foggy.";
*   } else {
*     return "It's 90 degrees and sunny.";
*   }
* }, {
*   name: "get_weather",
*   description: "Call to get the current weather.",
*   schema: z.object({
*     location: z.string().describe("Location to get the weather for."),
*   }),
* });
*
* const tools = [getWeather];
* const toolNode = new ToolNode(tools);
*
* const messageWithSingleToolCall = new AIMessage({
*   content: "",
*   tool_calls: [
*     {
*       name: "get_weather",
*       args: { location: "sf" },
*       id: "tool_call_id",
*       type: "tool_call",
*     }
*   ]
* })
*
* await toolNode.invoke({ messages: [messageWithSingleToolCall] });
* // Returns tool invocation responses as:
* // { messages: ToolMessage[] }
* ```
*/
var ToolNode = class extends RunnableCallable {
	tools;
	trace = false;
	signal;
	handleToolErrors = defaultHandleToolErrors;
	wrapToolCall;
	constructor(tools, options) {
		const { name, tags, handleToolErrors, signal, wrapToolCall } = options ?? {};
		super({
			name,
			tags,
			func: (state, config) => this.run(state, config)
		});
		this.options = options;
		this.tools = tools;
		this.handleToolErrors = handleToolErrors ?? this.handleToolErrors;
		this.signal = signal;
		this.wrapToolCall = wrapToolCall;
	}
	/**
	* Handle errors from tool execution or middleware.
	* @param error - The error to handle
	* @param call - The tool call that caused the error
	* @param isMiddlewareError - Whether the error came from wrapToolCall middleware
	* @returns ToolMessage if error is handled, otherwise re-throws
	*/
	#handleError(error, call, isMiddlewareError) {
		/**
		* {@link NodeInterrupt} errors are a breakpoint to bring a human into the loop.
		* As such, they are not recoverable by the agent and shouldn't be fed
		* back. Instead, re-throw these errors even when `handleToolErrors = true`.
		*/
		if (isGraphInterrupt(error)) throw error;
		/**
		* If the signal is aborted, we want to bubble up the error to the invoke caller.
		*/
		if (this.signal?.aborted) throw error;
		/**
		* A recoverable tool error (e.g. tool-input schema validation) can be
		* rewrapped as a {@link MiddlewareError} with the original error on `.cause`
		* — once per `wrapToolCall` middleware, so it may be nested several layers
		* deep. Walk the cause chain to the root; if it's a {@link ToolInvocationError},
		* unwrap it so the intended `handleToolErrors` self-correction path still
		* applies. Genuine middleware errors stay fatal by default.
		*/
		let effectiveError = error;
		let errorFromMiddleware = isMiddlewareError;
		if (isMiddlewareError) {
			let unwrapped = error;
			while (MiddlewareError.isInstance(unwrapped)) unwrapped = unwrapped.cause;
			if (ToolInvocationError.isInstance(unwrapped)) {
				effectiveError = unwrapped;
				errorFromMiddleware = false;
			}
		}
		/**
		* If error is from middleware and handleToolErrors is not true, bubble up
		* (default handler and false both re-raise middleware errors)
		*/
		if (errorFromMiddleware && this.handleToolErrors !== true) throw effectiveError;
		/**
		* If handleToolErrors is false, throw all errors
		*/
		if (!this.handleToolErrors) throw effectiveError;
		/**
		* Apply handleToolErrors to the error
		*/
		if (typeof this.handleToolErrors === "function") {
			const result = this.handleToolErrors(effectiveError, call);
			if (result && ToolMessage.isInstance(result)) return result;
			/**
			* `handleToolErrors` returned undefined - re-raise
			*/
			throw effectiveError;
		} else if (this.handleToolErrors) return new ToolMessage({
			name: call.name,
			content: `${effectiveError}\n Please fix your mistakes.`,
			tool_call_id: call.id
		});
		/**
		* Shouldn't reach here, but throw as fallback
		*/
		throw effectiveError;
	}
	async runTool(call, config, state) {
		/**
		* Build runtime from LangGraph config
		*/
		const lgConfig = config;
		const runtime = {
			context: lgConfig?.context,
			store: lgConfig?.store,
			configurable: lgConfig?.configurable,
			writer: lgConfig?.writer,
			interrupt: lgConfig?.interrupt,
			signal: lgConfig?.signal
		};
		/**
		* Find the tool instance to include in the request.
		* For dynamically registered tools, this may be undefined.
		*/
		const registeredTool = this.tools.find((t) => t.name === call.name);
		/**
		* Define the base handler that executes the tool.
		* When wrapToolCall middleware is present, this handler does NOT catch errors
		* so the middleware can handle them.
		* When no middleware, errors are caught and handled here.
		*
		* The handler now accepts an overridden tool from the request, allowing
		* middleware to provide tool implementations for dynamically registered tools.
		*/
		const baseHandler = async (request) => {
			const { toolCall, tool: requestTool } = request;
			/**
			* Use the tool from the request (which may be overridden via spread syntax)
			* or fall back to finding it in registered tools.
			* This allows middleware to provide dynamic tool implementations.
			*/
			const tool = requestTool ?? this.tools.find((t) => t.name === toolCall.name);
			if (tool === void 0) {
				/**
				* Tool not found - return a graceful error message rather than throwing.
				* This allows the LLM to see the error and potentially retry.
				*/
				const availableTools = this.tools.map((t) => t.name);
				return new ToolMessage({
					content: getInvalidToolError(toolCall.name, availableTools),
					tool_call_id: toolCall.id,
					name: toolCall.name,
					status: "error"
				});
			}
			/**
			* Cast tool to a common invokable type.
			* The tool can be from registered tools (StructuredToolInterface | DynamicTool | RunnableToolLike)
			* or from middleware override (ClientTool | ServerTool).
			*/
			const invokableTool = tool;
			try {
				const output = await invokableTool.invoke({
					...toolCall,
					type: "tool_call"
				}, {
					...config,
					/**
					* extend to match ToolRuntime
					*/
					config,
					toolCallId: toolCall.id,
					state: config.configurable?.__pregel_scratchpad?.currentTaskInput,
					signal: mergeAbortSignals(this.signal, config.signal)
				});
				if (ToolMessage.isInstance(output) || isCommand(output)) return output;
				return new ToolMessage({
					name: invokableTool.name,
					content: typeof output === "string" ? output : JSON.stringify(output),
					tool_call_id: toolCall.id
				});
			} catch (e) {
				/**
				* Handle errors from tool execution (not from wrapToolCall)
				* If tool invocation fails due to input parsing error, throw a {@link ToolInvocationError}
				*/
				if (e instanceof ToolInputParsingException) throw new ToolInvocationError(e, toolCall);
				/**
				* Re-throw to be handled by caller
				*/
				throw e;
			}
		};
		/**
		* Create request object for middleware
		* Cast to ToolCallRequest<AgentBuiltInState> to satisfy type constraints
		* of wrapToolCall which expects AgentBuiltInState
		*/
		const request = {
			toolCall: call,
			tool: registeredTool,
			state,
			runtime
		};
		/**
		* If wrapToolCall is provided, use it to wrap the tool execution
		*/
		if (this.wrapToolCall) try {
			return await this.wrapToolCall(request, baseHandler);
		} catch (e) {
			/**
			* Handle middleware errors
			*/
			return this.#handleError(e, call, true);
		}
		/**
		* No wrapToolCall - if tool wasn't found, return graceful error
		*/
		if (!registeredTool) {
			const availableTools = this.tools.map((t) => t.name);
			return new ToolMessage({
				content: getInvalidToolError(call.name, availableTools),
				tool_call_id: call.id,
				name: call.name,
				status: "error"
			});
		}
		/**
		* No wrapToolCall - execute tool directly and handle errors here
		*/
		try {
			return await baseHandler(request);
		} catch (e) {
			/**
			* Handle tool errors when no middleware provided
			*/
			return this.#handleError(e, call, false);
		}
	}
	async run(state, config) {
		let outputs;
		if (isSendInput(state)) {
			const { lg_tool_call: _, jumpTo: __, ...newState } = state;
			outputs = [await this.runTool(state.lg_tool_call, config, newState)];
		} else {
			let messages;
			if (isBaseMessageArray(state)) messages = state;
			else if (isMessagesState(state)) messages = state.messages;
			else throw new Error("ToolNode only accepts BaseMessage[] or { messages: BaseMessage[] } as input.");
			const toolMessageIds = new Set(messages.filter((msg) => msg.getType() === "tool").map((msg) => msg.tool_call_id));
			let aiMessage;
			for (let i = messages.length - 1; i >= 0; i -= 1) {
				const message = messages[i];
				if (AIMessage.isInstance(message)) {
					aiMessage = message;
					break;
				}
			}
			if (!AIMessage.isInstance(aiMessage)) throw new Error("ToolNode only accepts AIMessages as input.");
			outputs = await Promise.all(aiMessage.tool_calls?.filter((call) => call.id == null || !toolMessageIds.has(call.id)).map((call) => this.runTool(call, config, state)) ?? []);
		}
		if (!outputs.some(isCommand)) return Array.isArray(state) ? outputs : { messages: outputs };
		const combinedOutputs = [];
		let parentCommand = null;
		for (const output of outputs) if (isCommand(output)) if (output.graph === Command.PARENT && Array.isArray(output.goto) && output.goto.every((send) => isSend(send))) if (parentCommand) parentCommand.goto.push(...output.goto);
		else parentCommand = new Command({
			graph: Command.PARENT,
			goto: output.goto
		});
		else combinedOutputs.push(output);
		else combinedOutputs.push(Array.isArray(state) ? [output] : { messages: [output] });
		if (parentCommand) combinedOutputs.push(parentCommand);
		return combinedOutputs;
	}
};
function isSend(x) {
	return x instanceof Send;
}
//#endregion
//#region node_modules/langchain/dist/agents/nodes/middleware.js
/**
* Named class for context objects to provide better error messages
*/
var AgentContext = class {};
var AgentRuntime = class {};
var MiddlewareNode = class extends RunnableCallable {
	constructor(fields) {
		super(fields);
	}
	async invokeMiddleware(invokeState, config) {
		/**
		* Filter context based on middleware's contextSchema
		*/
		let filteredContext = {};
		/**
		* Parse context using middleware's contextSchema to apply defaults and validation
		*/
		if (this.middleware.contextSchema && isInteropZodObject(this.middleware.contextSchema)) {
			/**
			* Extract only the fields relevant to this middleware's schema
			*/
			const schemaShape = getInteropZodObjectShape(this.middleware.contextSchema);
			if (schemaShape) {
				const relevantContext = {};
				const invokeContext = config?.context || {};
				for (const key of Object.keys(schemaShape)) if (key in invokeContext) relevantContext[key] = invokeContext[key];
				/**
				* Parse to apply defaults and validation, even if relevantContext is empty
				* This will throw if required fields are missing and no defaults exist
				*/
				filteredContext = interopParse(this.middleware.contextSchema, relevantContext);
			}
		}
		const state = {
			...invokeState,
			/**
			* don't overwrite possible outdated messages from other middleware nodes
			*/
			messages: invokeState.messages
		};
		const runtime = {
			context: filteredContext,
			store: config?.store,
			configurable: config?.configurable,
			writer: config?.writer,
			interrupt: config?.interrupt,
			signal: config?.signal
		};
		const result = await this.runHook(
			state,
			/**
			* assign runtime and context values into empty named class
			* instances to create a better error message.
			*/
			Object.freeze(Object.assign(new AgentRuntime(), {
				...runtime,
				context: Object.freeze(Object.assign(new AgentContext(), filteredContext))
			}))
		);
		/**
		* If result is undefined, the hook made no state changes — return
		* only the jumpTo sentinel so we don't re-emit every input key as
		* a state update.
		*/
		if (!result) return { jumpTo: void 0 };
		/**
		* Verify that the jump target is allowed for the middleware
		*/
		let jumpToConstraint;
		let constraint;
		if (this.name?.startsWith("BeforeAgentNode_")) {
			jumpToConstraint = getHookConstraint(this.middleware.beforeAgent);
			constraint = "beforeAgent.canJumpTo";
		} else if (this.name?.startsWith("BeforeModelNode_")) {
			jumpToConstraint = getHookConstraint(this.middleware.beforeModel);
			constraint = "beforeModel.canJumpTo";
		} else if (this.name?.startsWith("AfterAgentNode_")) {
			jumpToConstraint = getHookConstraint(this.middleware.afterAgent);
			constraint = "afterAgent.canJumpTo";
		} else if (this.name?.startsWith("AfterModelNode_")) {
			jumpToConstraint = getHookConstraint(this.middleware.afterModel);
			constraint = "afterModel.canJumpTo";
		}
		if (typeof result.jumpTo === "string" && !jumpToConstraint?.includes(result.jumpTo)) {
			const suggestion = jumpToConstraint && jumpToConstraint.length > 0 ? `must be one of: ${jumpToConstraint?.join(", ")}.` : constraint ? `no ${constraint} defined in middleware ${this.middleware.name}` : "";
			throw new Error(`Invalid jump target: ${result.jumpTo}, ${suggestion}.`);
		}
		/**
		* If result is a control action, handle it
		*/
		if (typeof result === "object" && "type" in result) {
			if (result.type === "terminate") {
				if (result.error) throw result.error;
				return {
					...state,
					...result.result || {},
					jumpTo: result.jumpTo
				};
			}
			throw new Error(`Invalid control action: ${JSON.stringify(result)}`);
		}
		/**
		* If result is a state update, merge it with current state
		*/
		return {
			...state,
			...result,
			jumpTo: result.jumpTo
		};
	}
	get nodeOptions() {
		return { input: derivePrivateState(this.middleware.stateSchema) };
	}
};
//#endregion
//#region node_modules/langchain/dist/agents/nodes/BeforeAgentNode.js
/**
* Node for executing a single middleware's beforeAgent hook.
*/
var BeforeAgentNode = class extends MiddlewareNode {
	lc_namespace = [
		"langchain",
		"agents",
		"beforeAgentNodes"
	];
	constructor(middleware) {
		super({
			name: `BeforeAgentNode_${middleware.name}`,
			func: async (state, config) => this.invokeMiddleware(state, config)
		});
		this.middleware = middleware;
	}
	runHook(state, runtime) {
		return getHookFunction(this.middleware.beforeAgent)(state, runtime);
	}
};
//#endregion
//#region node_modules/langchain/dist/agents/nodes/BeforeModelNode.js
/**
* Node for executing a single middleware's beforeModel hook.
*/
var BeforeModelNode = class extends MiddlewareNode {
	lc_namespace = [
		"langchain",
		"agents",
		"beforeModelNodes"
	];
	constructor(middleware) {
		super({
			name: `BeforeModelNode_${middleware.name}`,
			func: async (state, config) => this.invokeMiddleware(state, config)
		});
		this.middleware = middleware;
	}
	runHook(state, runtime) {
		return getHookFunction(this.middleware.beforeModel)(state, runtime);
	}
};
//#endregion
//#region node_modules/langchain/dist/agents/nodes/AfterModelNode.js
/**
* Node for executing a single middleware's afterModel hook.
*/
var AfterModelNode = class extends MiddlewareNode {
	lc_namespace = [
		"langchain",
		"agents",
		"afterModelNodes"
	];
	constructor(middleware) {
		super({
			name: `AfterModelNode_${middleware.name}`,
			func: async (state, config) => this.invokeMiddleware(state, config)
		});
		this.middleware = middleware;
	}
	runHook(state, runtime) {
		return getHookFunction(this.middleware.afterModel)(state, runtime);
	}
};
//#endregion
//#region node_modules/langchain/dist/agents/nodes/AfterAgentNode.js
/**
* Node for executing a single middleware's afterAgent hook.
*/
var AfterAgentNode = class extends MiddlewareNode {
	lc_namespace = [
		"langchain",
		"agents",
		"afterAgentNodes"
	];
	constructor(middleware) {
		super({
			name: `AfterAgentNode_${middleware.name}`,
			func: async (state, config) => this.invokeMiddleware(state, config)
		});
		this.middleware = middleware;
	}
	runHook(state, runtime) {
		return getHookFunction(this.middleware.afterAgent)(state, runtime);
	}
};
//#endregion
//#region node_modules/langchain/dist/agents/ReactAgent.js
/**
* ReactAgent is a production-ready ReAct (Reasoning + Acting) agent that combines
* language models with tools and middleware.
*
* The agent is parameterized by a single type bag `Types` that encapsulates all
* type information:
*
* @typeParam Types - An {@link AgentTypeConfig} that bundles:
*   - `Response`: The structured response type
*   - `State`: The custom state schema type
*   - `Context`: The context schema type
*   - `Middleware`: The middleware array type
*   - `Tools`: The combined tools type from agent and middleware
*
* @example
* ```typescript
* // Using the type bag pattern
* type MyTypes = AgentTypeConfig<
*   { name: string },  // Response
*   typeof myState,    // State
*   typeof myContext,  // Context
*   typeof middleware, // Middleware
*   typeof tools       // Tools
* >;
*
* const agent: ReactAgent<MyTypes> = createAgent({ ... });
* ```
*/
var ReactAgent = class ReactAgent {
	#graph;
	#toolBehaviorVersion = "v2";
	#agentNode;
	#defaultConfig;
	constructor(options, defaultConfig) {
		this.options = options;
		this.#defaultConfig = mergeConfigs(defaultConfig ?? {}, {
			metadata: { ls_integration: "langchain_create_agent" },
			configurable: { ls_agent_type: "root" }
		});
		if (options.name) this.#defaultConfig = mergeConfigs(this.#defaultConfig, { metadata: { lc_agent_name: options.name } });
		this.#toolBehaviorVersion = options.version ?? this.#toolBehaviorVersion;
		/**
		* validate that model option is provided
		*/
		if (!options.model) throw new Error("`model` option is required to create an agent.");
		/**
		* Check if the LLM already has bound tools and throw if it does.
		*/
		if (typeof options.model !== "string") validateLLMHasNoBoundTools(options.model);
		/**
		* define complete list of tools based on options and middleware
		*/
		const middlewareTools = this.options.middleware?.filter((m) => m.tools).flatMap((m) => m.tools) ?? [];
		const toolClasses = [...options.tools ?? [], ...middlewareTools];
		/**
		* If any of the tools are configured to return_directly after running,
		* our graph needs to check if these were called
		*/
		const shouldReturnDirect = new Set(toolClasses.filter(isClientTool).filter((tool) => "returnDirect" in tool && tool.returnDirect).map((tool) => tool.name));
		/**
		* Create a schema that merges agent base schema with middleware state schemas
		* Using Zod with withLangGraph ensures LangGraph Studio gets proper metadata
		*/
		const hasDynamicStructuredResponse = Boolean(this.options.middleware?.some((middleware) => middleware.wrapModelCall));
		const { state, input, output } = createAgentState(this.options.responseFormat !== void 0 || hasDynamicStructuredResponse, this.options.stateSchema, this.options.middleware);
		const allNodeWorkflows = new StateGraph(state, {
			input,
			output,
			context: this.options.contextSchema
		});
		const beforeAgentNodes = [];
		const beforeModelNodes = [];
		const afterModelNodes = [];
		const afterAgentNodes = [];
		const wrapModelCallHookMiddleware = [];
		this.#agentNode = new AgentNode({
			model: this.options.model,
			systemMessage: normalizeSystemPrompt$1(this.options.systemPrompt),
			includeAgentName: this.options.includeAgentName,
			name: this.options.name,
			responseFormat: this.options.responseFormat,
			middleware: this.options.middleware,
			toolClasses,
			shouldReturnDirect,
			signal: this.options.signal,
			wrapModelCallHookMiddleware
		});
		const middlewareNames = /* @__PURE__ */ new Set();
		const middleware = this.options.middleware ?? [];
		for (let i = 0; i < middleware.length; i++) {
			let beforeAgentNode;
			let beforeModelNode;
			let afterModelNode;
			let afterAgentNode;
			const m = middleware[i];
			if (middlewareNames.has(m.name)) throw new Error(`Middleware ${m.name} is defined multiple times`);
			middlewareNames.add(m.name);
			if (m.beforeAgent) {
				beforeAgentNode = new BeforeAgentNode(m);
				const name = `${m.name}.before_agent`;
				beforeAgentNodes.push({
					index: i,
					name,
					allowed: getHookConstraint(m.beforeAgent)
				});
				allNodeWorkflows.addNode(name, beforeAgentNode, beforeAgentNode.nodeOptions);
			}
			if (m.beforeModel) {
				beforeModelNode = new BeforeModelNode(m);
				const name = `${m.name}.before_model`;
				beforeModelNodes.push({
					index: i,
					name,
					allowed: getHookConstraint(m.beforeModel)
				});
				allNodeWorkflows.addNode(name, beforeModelNode, beforeModelNode.nodeOptions);
			}
			if (m.afterModel) {
				afterModelNode = new AfterModelNode(m);
				const name = `${m.name}.after_model`;
				afterModelNodes.push({
					index: i,
					name,
					allowed: getHookConstraint(m.afterModel)
				});
				allNodeWorkflows.addNode(name, afterModelNode, afterModelNode.nodeOptions);
			}
			if (m.afterAgent) {
				afterAgentNode = new AfterAgentNode(m);
				const name = `${m.name}.after_agent`;
				afterAgentNodes.push({
					index: i,
					name,
					allowed: getHookConstraint(m.afterAgent)
				});
				allNodeWorkflows.addNode(name, afterAgentNode, afterAgentNode.nodeOptions);
			}
			if (m.wrapModelCall) wrapModelCallHookMiddleware.push(m);
		}
		/**
		* Add Nodes
		*/
		allNodeWorkflows.addNode(AGENT_NODE_NAME, this.#agentNode);
		/**
		* Check if any middleware has wrapToolCall defined.
		* If so, we need to create a ToolNode even without pre-registered tools
		* to allow middleware to handle dynamically registered tools.
		*/
		const hasWrapToolCallMiddleware = middleware.some((m) => m.wrapToolCall);
		const clientTools = toolClasses.filter(isClientTool);
		/**
		* Create ToolNode if we have client-side tools OR if middleware defines wrapToolCall
		* (which may handle dynamically registered tools)
		*/
		if (clientTools.length > 0 || hasWrapToolCallMiddleware) {
			const toolNode = new ToolNode(clientTools, {
				signal: this.options.signal,
				wrapToolCall: wrapToolCall(middleware)
			});
			allNodeWorkflows.addNode(TOOLS_NODE_NAME, toolNode);
		}
		/**
		* Add Edges
		*/
		let entryNode;
		if (beforeAgentNodes.length > 0) entryNode = beforeAgentNodes[0].name;
		else if (beforeModelNodes.length > 0) entryNode = beforeModelNodes[0].name;
		else entryNode = AGENT_NODE_NAME;
		const loopEntryNode = beforeModelNodes.length > 0 ? beforeModelNodes[0].name : AGENT_NODE_NAME;
		const exitNode = afterAgentNodes.length > 0 ? afterAgentNodes[afterAgentNodes.length - 1].name : END;
		allNodeWorkflows.addEdge(START, entryNode);
		/**
		* Determine if we have tools available for routing.
		* This includes both registered client tools AND dynamic tools via middleware.
		*/
		const hasToolsAvailable = clientTools.length > 0 || hasWrapToolCallMiddleware;
		for (let i = 0; i < beforeAgentNodes.length; i++) {
			const node = beforeAgentNodes[i];
			const current = node.name;
			const nextDefault = i === beforeAgentNodes.length - 1 ? loopEntryNode : beforeAgentNodes[i + 1].name;
			if (node.allowed && node.allowed.length > 0) {
				const allowedMapped = node.allowed.map((t) => parseJumpToTarget(t)).filter((dest) => dest !== "tools" || hasToolsAvailable);
				const destinations = Array.from(/* @__PURE__ */ new Set([nextDefault, ...allowedMapped.map((dest) => dest === "__end__" ? exitNode : dest)]));
				allNodeWorkflows.addConditionalEdges(current, this.#createBeforeAgentRouter(clientTools, nextDefault, exitNode, hasToolsAvailable), destinations);
			} else allNodeWorkflows.addEdge(current, nextDefault);
		}
		for (let i = 0; i < beforeModelNodes.length; i++) {
			const node = beforeModelNodes[i];
			const current = node.name;
			const nextDefault = i === beforeModelNodes.length - 1 ? AGENT_NODE_NAME : beforeModelNodes[i + 1].name;
			if (node.allowed && node.allowed.length > 0) {
				const allowedMapped = node.allowed.map((t) => parseJumpToTarget(t)).filter((dest) => dest !== "tools" || hasToolsAvailable);
				const destinations = Array.from(/* @__PURE__ */ new Set([nextDefault, ...allowedMapped]));
				allNodeWorkflows.addConditionalEdges(current, this.#createBeforeModelRouter(clientTools, nextDefault, hasToolsAvailable), destinations);
			} else allNodeWorkflows.addEdge(current, nextDefault);
		}
		const lastAfterModelNode = afterModelNodes.at(-1);
		if (afterModelNodes.length > 0 && lastAfterModelNode) allNodeWorkflows.addEdge(AGENT_NODE_NAME, lastAfterModelNode.name);
		else {
			const destinations = this.#getModelPaths(clientTools, false, hasToolsAvailable).map((p) => p === "__end__" ? exitNode : p);
			if (destinations.length === 1) allNodeWorkflows.addEdge(AGENT_NODE_NAME, destinations[0]);
			else allNodeWorkflows.addConditionalEdges(AGENT_NODE_NAME, this.#createModelRouter(exitNode), destinations);
		}
		for (let i = afterModelNodes.length - 1; i > 0; i--) {
			const node = afterModelNodes[i];
			const current = node.name;
			const nextDefault = afterModelNodes[i - 1].name;
			if (node.allowed && node.allowed.length > 0) {
				const allowedMapped = node.allowed.map((t) => parseJumpToTarget(t)).filter((dest) => dest !== "tools" || hasToolsAvailable);
				const destinations = Array.from(/* @__PURE__ */ new Set([nextDefault, ...allowedMapped]));
				allNodeWorkflows.addConditionalEdges(current, this.#createAfterModelSequenceRouter(clientTools, node.allowed, nextDefault, hasToolsAvailable), destinations);
			} else allNodeWorkflows.addEdge(current, nextDefault);
		}
		if (afterModelNodes.length > 0) {
			const firstAfterModel = afterModelNodes[0];
			const firstAfterModelNode = firstAfterModel.name;
			const modelPaths = this.#getModelPaths(clientTools, true, hasToolsAvailable).filter((p) => p !== "tools" || hasToolsAvailable);
			const allowJump = Boolean(firstAfterModel.allowed && firstAfterModel.allowed.length > 0);
			const destinations = modelPaths.map((p) => p === "__end__" ? exitNode : p);
			allNodeWorkflows.addConditionalEdges(firstAfterModelNode, this.#createAfterModelRouter(clientTools, allowJump, exitNode, hasToolsAvailable), destinations);
		}
		for (let i = afterAgentNodes.length - 1; i > 0; i--) {
			const node = afterAgentNodes[i];
			const current = node.name;
			const nextDefault = afterAgentNodes[i - 1].name;
			if (node.allowed && node.allowed.length > 0) {
				const allowedMapped = node.allowed.map((t) => parseJumpToTarget(t)).filter((dest) => dest !== "tools" || hasToolsAvailable);
				const destinations = Array.from(/* @__PURE__ */ new Set([nextDefault, ...allowedMapped]));
				allNodeWorkflows.addConditionalEdges(current, this.#createAfterModelSequenceRouter(clientTools, node.allowed, nextDefault, hasToolsAvailable), destinations);
			} else allNodeWorkflows.addEdge(current, nextDefault);
		}
		if (afterAgentNodes.length > 0) {
			const firstAfterAgent = afterAgentNodes[0];
			const firstAfterAgentNode = firstAfterAgent.name;
			if (firstAfterAgent.allowed && firstAfterAgent.allowed.length > 0) {
				const allowedMapped = firstAfterAgent.allowed.map((t) => parseJumpToTarget(t)).filter((dest) => dest !== "tools" || hasToolsAvailable);
				/**
				* For after_agent, only use explicitly allowed destinations (don't add loopEntryNode)
				* The default destination (when no jump occurs) should be END
				*/
				const destinations = Array.from(/* @__PURE__ */ new Set([END, ...allowedMapped]));
				allNodeWorkflows.addConditionalEdges(firstAfterAgentNode, this.#createAfterModelSequenceRouter(clientTools, firstAfterAgent.allowed, END, hasToolsAvailable), destinations);
			} else allNodeWorkflows.addEdge(firstAfterAgentNode, END);
		}
		/**
		* add edges for tools node (includes both registered tools and dynamic tools via middleware)
		*/
		if (hasToolsAvailable) {
			const toolReturnTarget = loopEntryNode;
			if (shouldReturnDirect.size > 0) allNodeWorkflows.addConditionalEdges(TOOLS_NODE_NAME, this.#createToolsRouter(shouldReturnDirect, exitNode, toolReturnTarget), [toolReturnTarget, exitNode]);
			else allNodeWorkflows.addEdge(TOOLS_NODE_NAME, toolReturnTarget);
		}
		/**
		* compile the graph with native + user-defined stream transformers
		*/
		const middlewareStreamTransformers = (this.options.middleware ?? []).flatMap((m) => m.streamTransformers ?? []);
		const compileTransformers = [
			createToolCallTransformer([]),
			createSubagentTransformer([]),
			...middlewareStreamTransformers,
			...this.options.streamTransformers ?? []
		];
		this.#graph = allNodeWorkflows.compile({
			checkpointer: this.options.checkpointer,
			store: this.options.store,
			name: this.options.name,
			description: this.options.description,
			transformers: compileTransformers
		});
		/**
		* LangGraph API resolves exported agents by unwrapping ReactAgent to the
		* inner compiled graph (see langgraph-api load.utils `afterResolve`) and
		* calls streamEvents on that pregel directly. That path only sees config
		* baked into the graph via `.withConfig()`, not ReactAgent's #defaultConfig
		* merged at invoke/stream time — so propagate static defaults here.
		*/
		const graphDefaultConfig = toGraphDefaultConfig(this.#defaultConfig);
		if (Object.keys(graphDefaultConfig).length > 0) this.#graph = this.#graph.withConfig(graphDefaultConfig);
	}
	/**
	* Get the compiled {@link https://docs.langchain.com/oss/javascript/langgraph/use-graph-api | StateGraph}.
	*/
	get graph() {
		return this.#graph;
	}
	get checkpointer() {
		return this.#graph.checkpointer;
	}
	set checkpointer(value) {
		this.#graph.checkpointer = value;
	}
	get store() {
		return this.#graph.store;
	}
	set store(value) {
		this.#graph.store = value;
	}
	/**
	* Creates a new ReactAgent with the given config merged into the existing config.
	* Follows the same pattern as LangGraph's Pregel.withConfig().
	*
	* The merged config is applied as a default that gets merged with any config
	* passed at invocation time (invoke/stream). Invocation-time config takes precedence.
	*
	* @param config - Configuration to merge with existing config
	* @returns A new ReactAgent instance with the merged configuration
	*
	* @example
	* ```typescript
	* const agent = createAgent({ model: "gpt-4o", tools: [...] });
	*
	* // Set a default recursion limit
	* const configuredAgent = agent.withConfig({ recursionLimit: 1000 });
	*
	* // Chain multiple configs
	* const debugAgent = agent
	*   .withConfig({ recursionLimit: 1000 })
	*   .withConfig({ tags: ["debug"] });
	* ```
	*/
	withConfig(config) {
		return new ReactAgent(this.options, mergeConfigs(this.#defaultConfig, config));
	}
	/**
	* Get possible edge destinations from model node.
	* @param toolClasses names of tools to call
	* @param includeModelRequest whether to include "model_request" as a valid path (for jumpTo routing)
	* @param hasToolsAvailable whether tools are available (includes dynamic tools via middleware)
	* @returns list of possible edge destinations
	*/
	#getModelPaths(toolClasses, includeModelRequest = false, hasToolsAvailable = toolClasses.length > 0) {
		const paths = [];
		if (hasToolsAvailable) paths.push(TOOLS_NODE_NAME);
		if (includeModelRequest) paths.push(AGENT_NODE_NAME);
		paths.push(END);
		return paths;
	}
	/**
	* Create routing function for tools node conditional edges.
	*/
	#createToolsRouter(shouldReturnDirect, exitNode, toolReturnTarget) {
		return (state) => {
			const messages = state.messages;
			const lastMessage = messages[messages.length - 1];
			if (ToolMessage.isInstance(lastMessage) && lastMessage.name && shouldReturnDirect.has(lastMessage.name)) return this.options.responseFormat ? toolReturnTarget : exitNode;
			return toolReturnTarget;
		};
	}
	/**
	* Create routing function for model node conditional edges.
	* @param exitNode - The exit node to route to (could be after_agent or END)
	*/
	#createModelRouter(exitNode = END) {
		/**
		* determine if the agent should continue or not
		*/
		return (state) => {
			const lastMessage = state.messages.at(-1);
			if (!AIMessage.isInstance(lastMessage) || !lastMessage.tool_calls || lastMessage.tool_calls.length === 0) return exitNode;
			if (lastMessage.tool_calls.every((toolCall) => toolCall.name.startsWith("extract-"))) return exitNode;
			/**
			* The tool node processes a single message.
			*/
			if (this.#toolBehaviorVersion === "v1") return TOOLS_NODE_NAME;
			/**
			* Route to tools node (filter out any structured response tool calls)
			*/
			const regularToolCalls = lastMessage.tool_calls.filter((toolCall) => !toolCall.name.startsWith("extract-"));
			if (regularToolCalls.length === 0) return exitNode;
			return regularToolCalls.map((toolCall) => new Send(TOOLS_NODE_NAME, {
				...state,
				lg_tool_call: toolCall
			}));
		};
	}
	/**
	* Create routing function for jumpTo functionality after afterModel hooks.
	*
	* This router checks if the `jumpTo` property is set in the state after afterModel middleware
	* execution. If set, it routes to the specified target ("model_request" or "tools").
	* If not set, it falls back to the normal model routing logic for afterModel context.
	*
	* The jumpTo property is automatically cleared after use to prevent infinite loops.
	*
	* @param toolClasses - Available tool classes for validation
	* @param allowJump - Whether jumping is allowed
	* @param exitNode - The exit node to route to (could be after_agent or END)
	* @param hasToolsAvailable - Whether tools are available (includes dynamic tools via middleware)
	* @returns Router function that handles jumpTo logic and normal routing
	*/
	#createAfterModelRouter(toolClasses, allowJump, exitNode, hasToolsAvailable = toolClasses.length > 0) {
		const hasStructuredResponse = Boolean(this.options.responseFormat);
		return (state) => {
			const builtInState = state;
			const messages = builtInState.messages;
			const lastMessage = messages.at(-1);
			if (AIMessage.isInstance(lastMessage) && (!lastMessage.tool_calls || lastMessage.tool_calls.length === 0)) return exitNode;
			if (allowJump && builtInState.jumpTo) {
				const destination = parseJumpToTarget(builtInState.jumpTo);
				if (destination === "__end__") return exitNode;
				if (destination === "tools") {
					if (!hasToolsAvailable) return exitNode;
					return new Send(TOOLS_NODE_NAME, {
						...state,
						jumpTo: void 0
					});
				}
				return new Send(AGENT_NODE_NAME, {
					...state,
					jumpTo: void 0
				});
			}
			const toolMessages = messages.filter(ToolMessage.isInstance);
			const lastAiMessage = messages.filter(AIMessage.isInstance).at(-1);
			const pendingToolCalls = lastAiMessage?.tool_calls?.filter((call) => !toolMessages.some((m) => m.tool_call_id === call.id));
			if (pendingToolCalls && pendingToolCalls.length > 0) {
				/**
				* v1: route the full message to the ToolNode; it filters already-processed
				* calls internally and runs the remaining ones via Promise.all.
				* v2: dispatch each pending call as a separate Send task.
				*/
				if (this.#toolBehaviorVersion === "v1") return TOOLS_NODE_NAME;
				return pendingToolCalls.map((toolCall) => new Send(TOOLS_NODE_NAME, {
					...state,
					lg_tool_call: toolCall
				}));
			}
			const hasStructuredResponseCalls = lastAiMessage?.tool_calls?.some((toolCall) => toolCall.name.startsWith("extract-"));
			if (pendingToolCalls && pendingToolCalls.length === 0 && !hasStructuredResponseCalls && hasStructuredResponse) return AGENT_NODE_NAME;
			if (!AIMessage.isInstance(lastMessage) || !lastMessage.tool_calls || lastMessage.tool_calls.length === 0) return exitNode;
			const hasOnlyStructuredResponseCalls = lastMessage.tool_calls.every((toolCall) => toolCall.name.startsWith("extract-"));
			const hasRegularToolCalls = lastMessage.tool_calls.some((toolCall) => !toolCall.name.startsWith("extract-"));
			if (hasOnlyStructuredResponseCalls || !hasRegularToolCalls) return exitNode;
			/**
			* v1: route the full AIMessage to a single ToolNode invocation so all
			* tool calls run concurrently via Promise.all.
			*
			* v2: dispatch each regular tool call as a separate Send task, matching
			* the behaviour of #createModelRouter when no afterModel middleware is
			* present.
			*/
			if (this.#toolBehaviorVersion === "v1") return TOOLS_NODE_NAME;
			const regularToolCalls = lastMessage.tool_calls.filter((toolCall) => !toolCall.name.startsWith("extract-"));
			if (regularToolCalls.length === 0) return exitNode;
			return regularToolCalls.map((toolCall) => new Send(TOOLS_NODE_NAME, {
				...state,
				lg_tool_call: toolCall
			}));
		};
	}
	/**
	* Router for afterModel sequence nodes (connecting later middlewares to earlier ones),
	* honoring allowed jump targets and defaulting to the next node.
	* @param toolClasses - Available tool classes for validation
	* @param allowed - List of allowed jump targets
	* @param nextDefault - Default node to route to
	* @param hasToolsAvailable - Whether tools are available (includes dynamic tools via middleware)
	*/
	#createAfterModelSequenceRouter(toolClasses, allowed, nextDefault, hasToolsAvailable = toolClasses.length > 0) {
		const allowedSet = new Set(allowed.map((t) => parseJumpToTarget(t)));
		return (state) => {
			const builtInState = state;
			if (builtInState.jumpTo) {
				const dest = parseJumpToTarget(builtInState.jumpTo);
				if (dest === "__end__" && allowedSet.has("__end__")) return END;
				if (dest === "tools" && allowedSet.has("tools")) {
					if (!hasToolsAvailable) return END;
					return new Send(TOOLS_NODE_NAME, {
						...state,
						jumpTo: void 0
					});
				}
				if (dest === "model_request" && allowedSet.has("model_request")) return new Send(AGENT_NODE_NAME, {
					...state,
					jumpTo: void 0
				});
			}
			return nextDefault;
		};
	}
	/**
	* Create routing function for jumpTo functionality after beforeAgent hooks.
	* Falls back to the default next node if no jumpTo is present.
	* When jumping to END, routes to exitNode (which could be an afterAgent node).
	* @param toolClasses - Available tool classes for validation
	* @param nextDefault - Default node to route to
	* @param exitNode - Exit node to route to (could be after_agent or END)
	* @param hasToolsAvailable - Whether tools are available (includes dynamic tools via middleware)
	*/
	#createBeforeAgentRouter(toolClasses, nextDefault, exitNode, hasToolsAvailable = toolClasses.length > 0) {
		return (state) => {
			const builtInState = state;
			if (!builtInState.jumpTo) return nextDefault;
			const destination = parseJumpToTarget(builtInState.jumpTo);
			if (destination === "__end__")
 /**
			* When beforeAgent jumps to END, route to exitNode (first afterAgent node)
			*/
			return exitNode;
			if (destination === "tools") {
				if (!hasToolsAvailable) return exitNode;
				return new Send(TOOLS_NODE_NAME, {
					...state,
					jumpTo: void 0
				});
			}
			return new Send(AGENT_NODE_NAME, {
				...state,
				jumpTo: void 0
			});
		};
	}
	/**
	* Create routing function for jumpTo functionality after beforeModel hooks.
	* Falls back to the default next node if no jumpTo is present.
	* @param toolClasses - Available tool classes for validation
	* @param nextDefault - Default node to route to
	* @param hasToolsAvailable - Whether tools are available (includes dynamic tools via middleware)
	*/
	#createBeforeModelRouter(toolClasses, nextDefault, hasToolsAvailable = toolClasses.length > 0) {
		return (state) => {
			const builtInState = state;
			if (!builtInState.jumpTo) return nextDefault;
			const destination = parseJumpToTarget(builtInState.jumpTo);
			if (destination === "__end__") return END;
			if (destination === "tools") {
				if (!hasToolsAvailable) return END;
				return new Send(TOOLS_NODE_NAME, {
					...state,
					jumpTo: void 0
				});
			}
			return new Send(AGENT_NODE_NAME, {
				...state,
				jumpTo: void 0
			});
		};
	}
	/**
	* Initialize middleware states if not already present in the input state.
	*/
	async #initializeMiddlewareStates(state, config) {
		if (!this.options.middleware || this.options.middleware.length === 0 || state instanceof Command || !state) return state;
		const defaultStates = await initializeMiddlewareStates(this.options.middleware, state);
		const updatedState = {
			...(await this.#graph.getState(config).catch(() => ({ values: {} }))).values,
			...state
		};
		if (!updatedState) return updatedState;
		for (const [key, value] of Object.entries(defaultStates)) if (!(key in updatedState)) updatedState[key] = value;
		return updatedState;
	}
	/**
	* Executes the agent with the given state and returns the final state after all processing.
	*
	* This method runs the agent's entire workflow synchronously, including:
	* - Processing the input messages through any configured middleware
	* - Calling the language model to generate responses
	* - Executing any tool calls made by the model
	* - Running all middleware hooks (beforeModel, afterModel, etc.)
	*
	* @param state - The initial state for the agent execution. Can be:
	*   - An object containing `messages` array and any middleware-specific state properties
	*   - A Command object for more advanced control flow
	*
	* @param config - Optional runtime configuration including:
	* @param config.context - The context for the agent execution.
	* @param config.configurable - LangGraph configuration options like `thread_id`, `run_id`, etc.
	* @param config.store - The store for the agent execution for persisting state, see more in {@link https://docs.langchain.com/oss/javascript/langgraph/memory#memory-storage | Memory storage}.
	* @param config.signal - An optional {@link https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal | `AbortSignal`} for the agent execution.
	* @param config.recursionLimit - The recursion limit for the agent execution.
	*
	* @returns A Promise that resolves to the final agent state after execution completes.
	*          The returned state includes:
	*          - a `messages` property containing an array with all messages (input, AI responses, tool calls/results)
	*          - a `structuredResponse` property containing the structured response (if configured)
	*          - all state values defined in the middleware
	*
	* @example
	* ```typescript
	* const agent = new ReactAgent({
	*   llm: myModel,
	*   tools: [calculator, webSearch],
	*   responseFormat: z.object({
	*     weather: z.string(),
	*   }),
	* });
	*
	* const result = await agent.invoke({
	*   messages: [{ role: "human", content: "What's the weather in Paris?" }]
	* });
	*
	* console.log(result.structuredResponse.weather); // outputs: "It's sunny and 75°F."
	* ```
	*/
	async invoke(state, config) {
		const mergedConfig = mergeConfigs(this.#defaultConfig, config);
		const initializedState = await this.#initializeMiddlewareStates(state, mergedConfig);
		return this.#graph.invoke(initializedState, mergedConfig);
	}
	/**
	* Executes the agent with streaming, returning an async iterable of state updates as they occur.
	*
	* This method runs the agent's workflow similar to `invoke`, but instead of waiting for
	* completion, it streams high-level state updates in real-time. This allows you to:
	* - Display intermediate results to users as they're generated
	* - Monitor the agent's progress through each step
	* - React to state changes as nodes complete
	*
	* For more granular event-level streaming (like individual LLM tokens), use `streamEvents` instead.
	*
	* @param state - The initial state for the agent execution. Can be:
	*   - An object containing `messages` array and any middleware-specific state properties
	*   - A Command object for more advanced control flow
	*
	* @param config - Optional runtime configuration including:
	* @param config.context - The context for the agent execution.
	* @param config.configurable - LangGraph configuration options like `thread_id`, `run_id`, etc.
	* @param config.store - The store for the agent execution for persisting state, see more in {@link https://docs.langchain.com/oss/javascript/langgraph/memory#memory-storage | Memory storage}.
	* @param config.signal - An optional {@link https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal | `AbortSignal`} for the agent execution.
	* @param config.streamMode - The streaming mode for the agent execution, see more in {@link https://docs.langchain.com/oss/javascript/langgraph/streaming#supported-stream-modes | Supported stream modes}.
	* @param config.recursionLimit - The recursion limit for the agent execution.
	*
	* @returns A Promise that resolves to an IterableReadableStream of state updates.
	*          Each update contains the current state after a node completes.
	*
	* @example
	* ```typescript
	* const agent = new ReactAgent({
	*   llm: myModel,
	*   tools: [calculator, webSearch]
	* });
	*
	* const stream = await agent.stream({
	*   messages: [{ role: "human", content: "What's 2+2 and the weather in NYC?" }]
	* });
	*
	* for await (const chunk of stream) {
	*   console.log(chunk); // State update from each node
	* }
	* ```
	*/
	async stream(state, config) {
		const mergedConfig = mergeConfigs(this.#defaultConfig, config);
		const initializedState = await this.#initializeMiddlewareStates(state, mergedConfig);
		return this.#graph.stream(initializedState, mergedConfig);
	}
	streamEvents(state, config, streamOptions) {
		if (config?.version !== "v3" || streamOptions != null) {
			const mergedConfig = mergeConfigs(this.#defaultConfig, config);
			const version = config?.version === "v1" || config?.version === "v2" ? config.version : "v2";
			return this.#graph.streamEvents(state, {
				...mergedConfig,
				version
			}, streamOptions);
		}
		return (async () => {
			const { transformers: callSiteTransformers, version: _version, ...restConfig } = config ?? {};
			const mergedConfig = mergeConfigs(this.#defaultConfig, restConfig);
			const initializedState = await this.#initializeMiddlewareStates(state, mergedConfig);
			return await this.#graph.streamEvents(initializedState, {
				...mergedConfig,
				version: "v3",
				transformers: callSiteTransformers
			});
		})();
	}
	/**
	* Visualize the graph as a PNG image.
	* @param params - Parameters for the drawMermaidPng method.
	* @param params.withStyles - Whether to include styles in the graph.
	* @param params.curveStyle - The style of the graph's curves.
	* @param params.nodeColors - The colors of the graph's nodes.
	* @param params.wrapLabelNWords - The maximum number of words to wrap in a node's label.
	* @param params.backgroundColor - The background color of the graph.
	* @returns PNG image as a buffer
	*/
	async drawMermaidPng(params) {
		const arrayBuffer = await (await (await this.#graph.getGraphAsync()).drawMermaidPng(params)).arrayBuffer();
		return new Uint8Array(arrayBuffer);
	}
	/**
	* Draw the graph as a Mermaid string.
	* @param params - Parameters for the drawMermaid method.
	* @param params.withStyles - Whether to include styles in the graph.
	* @param params.curveStyle - The style of the graph's curves.
	* @param params.nodeColors - The colors of the graph's nodes.
	* @param params.wrapLabelNWords - The maximum number of words to wrap in a node's label.
	* @param params.backgroundColor - The background color of the graph.
	* @returns Mermaid string
	*/
	async drawMermaid(params) {
		return (await this.#graph.getGraphAsync()).drawMermaid(params);
	}
	/**
	* The following are internal methods to enable support for LangGraph Platform.
	* They are not part of the createAgent public API.
	*
	* Note: we intentionally return as `never` to avoid type errors due to type inference.
	*/
	/**
	* @internal
	*/
	getGraphAsync(config) {
		return this.#graph.getGraphAsync(config);
	}
	/**
	* @internal
	*/
	getState(config, options) {
		return this.#graph.getState(config, options);
	}
	/**
	* @internal
	*/
	getStateHistory(config, options) {
		return this.#graph.getStateHistory(config, options);
	}
	/**
	* @internal
	*/
	getSubgraphs(namespace, recurse) {
		return this.#graph.getSubgraphs(namespace, recurse);
	}
	/**
	* @internal
	*/
	getSubgraphsAsync(namespace, recurse) {
		return this.#graph.getSubgraphsAsync(namespace, recurse);
	}
	/**
	* @internal
	*/
	updateState(inputConfig, values, asNode) {
		return this.#graph.updateState(inputConfig, values, asNode);
	}
	/**
	* @internal
	*/
	get builder() {
		return this.#graph.builder;
	}
};
//#endregion
//#region node_modules/langchain/dist/agents/index.js
function createAgent(params) {
	return new ReactAgent(params);
}
//#endregion
//#region node_modules/langchain/dist/agents/middleware/hitl.js
var WhenFunctionSchema = functionType().args(custom$1()).returns(unionType([booleanType(), promiseType(booleanType())]));
var DescriptionFunctionSchema = functionType().args(custom$1(), custom$1(), custom$1()).returns(unionType([stringType(), promiseType(stringType())]));
/**
* The type of decision a human can make.
*/
var ALLOWED_DECISIONS = [
	"approve",
	"edit",
	"reject"
];
var InterruptOnConfigSchema = objectType({
	/**
	* The decisions that are allowed for this action.
	*/
	allowedDecisions: arrayType(enumType(ALLOWED_DECISIONS)),
	/**
	* The description attached to the request for human input.
	* Can be either:
	* - A static string describing the approval request
	* - A callable that dynamically generates the description based on agent state,
	*   runtime, and tool call information
	*
	* @example
	* Static string description
	* ```typescript
	* import type { InterruptOnConfig } from "langchain";
	*
	* const config: InterruptOnConfig = {
	*   allowedDecisions: ["approve", "reject"],
	*   description: "Please review this tool execution"
	* };
	* ```
	*
	* @example
	* Dynamic callable description
	* ```typescript
	* import type {
	*   AgentBuiltInState,
	*   Runtime,
	*   DescriptionFactory,
	*   ToolCall,
	*   InterruptOnConfig
	* } from "langchain";
	*
	* const formatToolDescription: DescriptionFactory = (
	*   toolCall: ToolCall,
	*   state: AgentBuiltInState,
	*   runtime: Runtime<unknown>
	* ) => {
	*   return `Tool: ${toolCall.name}\nArguments:\n${JSON.stringify(toolCall.args, null, 2)}`;
	* };
	*
	* const config: InterruptOnConfig = {
	*   allowedDecisions: ["approve", "edit"],
	*   description: formatToolDescription
	* };
	* ```
	*/
	description: unionType([stringType(), DescriptionFunctionSchema]).optional(),
	/**
	* JSON schema for the arguments associated with the action, if edits are allowed.
	*/
	argsSchema: recordType(anyType()).optional(),
	/**
	* Optional predicate controlling whether to interrupt for a given tool call.
	*
	* Receives a {@link ToolCallRequest} and returns `true` to interrupt or
	* `false` to auto-approve the tool call.
	*
	* The request is constructed with `tool` set to `undefined` and `runtime` set
	* to the node-level {@link Runtime}, so `request.tool` is not available.
	*
	* @example
	* ```typescript
	* import type { InterruptOnConfig } from "langchain";
	*
	* // Only interrupt delete_file calls targeting /etc
	* const config: InterruptOnConfig = {
	*   allowedDecisions: ["approve", "reject"],
	*   when: (request) =>
	*     String(request.toolCall.args.path ?? "").startsWith("/etc"),
	* };
	* ```
	*/
	when: WhenFunctionSchema.optional()
});
var contextSchema$6 = objectType({
	/**
	* Mapping of tool name to allowed reviewer responses.
	* If a tool doesn't have an entry, it's auto-approved by default.
	*
	* - `true` -> pause for approval and allow approve/edit/reject decisions
	* - `false` -> auto-approve (no human review)
	* - `InterruptOnConfig` -> explicitly specify which decisions are allowed for this tool
	*/
	interruptOn: recordType(unionType([booleanType(), InterruptOnConfigSchema])).optional(),
	/**
	* Prefix used when constructing human-facing approval messages.
	* Provides context about the tool call being reviewed; does not change the underlying action.
	*
	* Note: This prefix is only applied for tools that do not provide a custom
	* `description` via their {@link InterruptOnConfig}. If a tool specifies a custom
	* `description`, that per-tool text is used and this prefix is ignored.
	*/
	descriptionPrefix: stringType().default("Tool execution requires approval")
});
/**
* Creates a Human-in-the-Loop (HITL) middleware for tool approval and oversight.
*
* This middleware intercepts tool calls made by an AI agent and provides human oversight
* capabilities before execution. It enables selective approval workflows where certain tools
* require human intervention while others can execute automatically.
*
* A invocation result that has been interrupted by the middleware will have a `__interrupt__`
* property that contains the interrupt request.
*
* ```ts
* import { type HITLRequest, type HITLResponse } from "langchain";
* import { type Interrupt } from "langchain";
*
* const result = await agent.invoke(request);
* const interruptRequest = result.__interrupt__?.[0] as Interrupt<HITLRequest>;
*
* // Examine the action requests and review configs
* const actionRequests = interruptRequest.value.actionRequests;
* const reviewConfigs = interruptRequest.value.reviewConfigs;
*
* // Create decisions for each action
* const resume: HITLResponse = {
*   decisions: actionRequests.map((action, i) => {
*     if (action.name === "calculator") {
*       return { type: "approve" };
*     } else if (action.name === "write_file") {
*       return {
*         type: "edit",
*         editedAction: { name: "write_file", args: { filename: "safe.txt", content: "Safe content" } }
*       };
*     }
*     return { type: "reject", message: "Action not allowed" };
*   })
* };
*
* // Resume with decisions
* await agent.invoke(new Command({ resume }), config);
* ```
*
* ## Features
*
* - **Selective Tool Approval**: Configure which tools require human approval
* - **Multiple Decision Types**: Approve, edit, or reject tool calls
* - **Asynchronous Workflow**: Uses LangGraph's interrupt mechanism for non-blocking approval
* - **Custom Approval Messages**: Provide context-specific descriptions for approval requests
*
* ## Decision Types
*
* When a tool requires approval, the human operator can respond with:
* - `approve`: Execute the tool with original arguments
* - `edit`: Modify the tool name and/or arguments before execution
* - `reject`: Provide a manual response instead of executing the tool
*
* @param options - Configuration options for the middleware
* @param options.interruptOn - Per-tool configuration mapping tool names to their settings
* @param options.interruptOn[toolName].allowedDecisions - Array of decision types allowed for this tool (e.g., ["approve", "edit", "reject"])
* @param options.interruptOn[toolName].description - Custom approval message for the tool. Can be either a static string or a callable that dynamically generates the description based on agent state, runtime, and tool call information
* @param options.interruptOn[toolName].argsSchema - JSON schema for the arguments associated with the action, if edits are allowed
* @param options.interruptOn[toolName].when - Optional predicate that dynamically controls whether a tool call triggers an interrupt. Returns `true` to interrupt or `false` to auto-approve the tool call.
* @param options.descriptionPrefix - Default prefix for approval messages (default: "Tool execution requires approval"). Only used for tools that do not define a custom `description` in their InterruptOnConfig.
*
* @returns A middleware instance that can be passed to `createAgent`
*
* @example
* Basic usage with selective tool approval
* ```typescript
* import { humanInTheLoopMiddleware } from "langchain";
* import { createAgent } from "langchain";
*
* const hitlMiddleware = humanInTheLoopMiddleware({
*   interruptOn: {
*     // Interrupt write_file tool and allow edits or approvals
*     "write_file": {
*       allowedDecisions: ["approve", "edit"],
*       description: "⚠️ File write operation requires approval"
*     },
*     // Auto-approve read_file tool
*     "read_file": false
*   }
* });
*
* const agent = createAgent({
*   model: "openai:gpt-4",
*   tools: [writeFileTool, readFileTool],
*   middleware: [hitlMiddleware]
* });
* ```
*
* @example
* Handling approval requests
* ```typescript
* import { type HITLRequest, type HITLResponse, type Interrupt } from "langchain";
* import { Command } from "@langchain/langgraph";
*
* // Initial agent invocation
* const result = await agent.invoke({
*   messages: [new HumanMessage("Write 'Hello' to output.txt")]
* }, config);
*
* // Check if agent is paused for approval
* if (result.__interrupt__) {
*   const interruptRequest = result.__interrupt__?.[0] as Interrupt<HITLRequest>;
*
*   // Show tool call details to user
*   console.log("Actions:", interruptRequest.value.actionRequests);
*   console.log("Review configs:", interruptRequest.value.reviewConfigs);
*
*   // Resume with approval
*   const resume: HITLResponse = {
*     decisions: [{ type: "approve" }]
*   };
*   await agent.invoke(
*     new Command({ resume }),
*     config
*   );
* }
* ```
*
* @example
* Different decision types
* ```typescript
* import { type HITLResponse } from "langchain";
*
* // Approve the tool call as-is
* const resume: HITLResponse = {
*   decisions: [{ type: "approve" }]
* };
*
* // Edit the tool arguments
* const resume: HITLResponse = {
*   decisions: [{
*     type: "edit",
*     editedAction: { name: "write_file", args: { filename: "safe.txt", content: "Modified" } }
*   }]
* };
*
* // Reject with feedback
* const resume: HITLResponse = {
*   decisions: [{
*     type: "reject",
*     message: "File operation not allowed in demo mode"
*   }]
* };
* ```
*
* @example
* Production use case with database operations
* ```typescript
* const hitlMiddleware = humanInTheLoopMiddleware({
*   interruptOn: {
*     "execute_sql": {
*       allowedDecisions: ["approve", "edit", "reject"],
*       description: "🚨 SQL query requires DBA approval\nPlease review for safety and performance"
*     },
*     "read_schema": false,  // Reading metadata is safe
*     "delete_records": {
*       allowedDecisions: ["approve", "reject"],
*       description: "⛔ DESTRUCTIVE OPERATION - Requires manager approval"
*     }
*   },
*   descriptionPrefix: "Database operation pending approval"
* });
* ```
*
* @example
* Using dynamic callable descriptions
* ```typescript
* import { type DescriptionFactory, type ToolCall } from "langchain";
* import type { AgentBuiltInState, Runtime } from "langchain/agents";
*
* // Define a dynamic description factory
* const formatToolDescription: DescriptionFactory = (
*   toolCall: ToolCall,
*   state: AgentBuiltInState,
*   runtime: Runtime<unknown>
* ) => {
*   return `Tool: ${toolCall.name}\nArguments:\n${JSON.stringify(toolCall.args, null, 2)}`;
* };
*
* const hitlMiddleware = humanInTheLoopMiddleware({
*   interruptOn: {
*     "write_file": {
*       allowedDecisions: ["approve", "edit"],
*       // Use dynamic description that can access tool call, state, and runtime
*       description: formatToolDescription
*     },
*     // Or use an inline function
*     "send_email": {
*       allowedDecisions: ["approve", "reject"],
*       description: (toolCall, state, runtime) => {
*         const { to, subject } = toolCall.args;
*         return `Email to ${to}\nSubject: ${subject}\n\nRequires approval before sending`;
*       }
*     }
*   }
* });
* ```
*
* @remarks
* - Tool calls are processed in the order they appear in the AI message
* - Auto-approved tools execute immediately without interruption
* - Multiple tools requiring approval are bundled into a single interrupt request
* - The middleware operates in the `afterModel` phase, intercepting before tool execution
* - Requires a checkpointer to maintain state across interruptions
*
* @see {@link createAgent} for agent creation
* @see {@link Command} for resuming interrupted execution
* @public
*/
function humanInTheLoopMiddleware(options) {
	const createActionAndConfig = async (toolCall, config, state, runtime) => {
		const toolName = toolCall.name;
		const toolArgs = toolCall.args;
		const descriptionValue = config.description;
		let description;
		if (typeof descriptionValue === "function") description = await descriptionValue(toolCall, state, runtime);
		else if (descriptionValue !== void 0) description = descriptionValue;
		else description = `${options.descriptionPrefix ?? "Tool execution requires approval"}\n\nTool: ${toolName}\nArgs: ${JSON.stringify(toolArgs, null, 2)}`;
		/**
		* Create ActionRequest with description
		*/
		const actionRequest = {
			name: toolName,
			args: toolArgs,
			description
		};
		/**
		* Create ReviewConfig
		*/
		const reviewConfig = {
			actionName: toolName,
			allowedDecisions: config.allowedDecisions
		};
		if (config.argsSchema) reviewConfig.argsSchema = config.argsSchema;
		return {
			actionRequest,
			reviewConfig
		};
	};
	/**
	* Return `false` if the `when` predicate rejects this tool call, `true` otherwise.
	*
	* When no `when` predicate is configured the tool call always interrupts.
	*/
	const shouldInterrupt = async (toolCall, config, state, runtime) => {
		const { when } = config;
		if (when == null) return true;
		return when({
			toolCall,
			tool: void 0,
			state,
			runtime
		});
	};
	const processDecision = (decision, toolCall, config) => {
		const allowedDecisions = config.allowedDecisions;
		if (decision.type === "approve" && allowedDecisions.includes("approve")) return {
			revisedToolCall: toolCall,
			toolMessage: null
		};
		if (decision.type === "edit" && allowedDecisions.includes("edit")) {
			const editedAction = decision.editedAction;
			/**
			* Validate edited action structure
			*/
			if (!editedAction || typeof editedAction.name !== "string") throw new Error(`Invalid edited action for tool "${toolCall.name}": name must be a string`);
			if (!editedAction.args || typeof editedAction.args !== "object") throw new Error(`Invalid edited action for tool "${toolCall.name}": args must be an object`);
			return {
				revisedToolCall: {
					type: "tool_call",
					name: editedAction.name,
					args: editedAction.args,
					id: toolCall.id
				},
				toolMessage: null
			};
		}
		if (decision.type === "reject" && allowedDecisions.includes("reject")) {
			/**
			* Validate that message is a string if provided
			*/
			if (decision.message !== void 0 && typeof decision.message !== "string") throw new Error(`Tool call response for "${toolCall.name}" must be a string, got ${typeof decision.message}`);
			return {
				revisedToolCall: toolCall,
				toolMessage: new ToolMessage({
					content: decision.message ?? `User rejected the tool call for \`${toolCall.name}\` with id ${toolCall.id}`,
					name: toolCall.name,
					tool_call_id: toolCall.id,
					status: "error"
				})
			};
		}
		const msg = `Unexpected human decision: ${JSON.stringify(decision)}. Decision type '${decision.type}' is not allowed for tool '${toolCall.name}'. Expected one of ${JSON.stringify(allowedDecisions)} based on the tool's configuration.`;
		throw new Error(msg);
	};
	return createMiddleware({
		name: "HumanInTheLoopMiddleware",
		contextSchema: contextSchema$6,
		afterModel: {
			canJumpTo: ["model"],
			hook: async (state, runtime) => {
				const config = interopParse(contextSchema$6, {
					...options,
					...runtime.context || {}
				});
				if (!config) return;
				const { messages } = state;
				if (!messages.length) return;
				/**
				* Don't do anything if the last message isn't an AI message with tool calls.
				*/
				const lastMessage = [...messages].reverse().find((msg) => AIMessage.isInstance(msg));
				if (!lastMessage || !lastMessage.tool_calls?.length) return;
				/**
				* If the user omits the interruptOn config, we don't do anything.
				*/
				if (!config.interruptOn) return;
				/**
				* Resolve per-tool configs (boolean true -> all decisions allowed; false -> auto-approve)
				*/
				const resolvedConfigs = {};
				for (const [toolName, toolConfig] of Object.entries(config.interruptOn)) if (typeof toolConfig === "boolean") {
					if (toolConfig === true) resolvedConfigs[toolName] = { allowedDecisions: [...ALLOWED_DECISIONS] };
				} else if (toolConfig.allowedDecisions) resolvedConfigs[toolName] = toolConfig;
				const interruptToolCalls = [];
				const autoApprovedToolCalls = [];
				for (const toolCall of lastMessage.tool_calls) {
					const interruptConfig = resolvedConfigs[toolCall.name];
					/**
					* A tool call is interrupted only when it has a resolved config and its
					* optional `when` predicate doesn't opt it out. Otherwise it is
					* auto-approved.
					*/
					if (interruptConfig && await shouldInterrupt(toolCall, interruptConfig, state, runtime)) interruptToolCalls.push(toolCall);
					else autoApprovedToolCalls.push(toolCall);
				}
				/**
				* No interrupt tool calls, so we can just return.
				*/
				if (!interruptToolCalls.length) return;
				/**
				* Create action requests and review configs for all tools that need approval
				*/
				const actionRequests = [];
				const reviewConfigs = [];
				for (const toolCall of interruptToolCalls) {
					const interruptConfig = resolvedConfigs[toolCall.name];
					/**
					* Create ActionRequest and ReviewConfig using helper method
					*/
					const { actionRequest, reviewConfig } = await createActionAndConfig(toolCall, interruptConfig, state, runtime);
					actionRequests.push(actionRequest);
					reviewConfigs.push(reviewConfig);
				}
				const decisions = (await interrupt({
					actionRequests,
					reviewConfigs
				})).decisions;
				/**
				* Validate that decisions is a valid array before checking length
				*/
				if (!decisions || !Array.isArray(decisions)) throw new Error("Invalid HITLResponse: decisions must be a non-empty array");
				/**
				* Validate that the number of decisions matches the number of interrupt tool calls
				*/
				if (decisions.length !== interruptToolCalls.length) throw new Error(`Number of human decisions (${decisions.length}) does not match number of hanging tool calls (${interruptToolCalls.length}).`);
				const revisedToolCalls = [...autoApprovedToolCalls];
				const artificialToolMessages = [];
				const hasRejectedToolCalls = decisions.some((decision) => decision.type === "reject");
				/**
				* Process each decision using helper method
				*/
				for (let i = 0; i < decisions.length; i++) {
					const decision = decisions[i];
					const toolCall = interruptToolCalls[i];
					const interruptConfig = resolvedConfigs[toolCall.name];
					const { revisedToolCall, toolMessage } = processDecision(decision, toolCall, interruptConfig);
					if (revisedToolCall && (!hasRejectedToolCalls || decision.type === "reject")) revisedToolCalls.push(revisedToolCall);
					if (toolMessage) artificialToolMessages.push(toolMessage);
				}
				/**
				* Update the AI message to only include approved tool calls
				*/
				if (AIMessage.isInstance(lastMessage)) lastMessage.tool_calls = revisedToolCalls;
				const jumpTo = hasRejectedToolCalls ? "model" : void 0;
				return {
					messages: [lastMessage, ...artificialToolMessages],
					jumpTo
				};
			}
		}
	});
}
//#endregion
//#region node_modules/langchain/dist/agents/middleware/summarization.js
var DEFAULT_SUMMARY_PROMPT$1 = `<role>
Context Extraction Assistant
</role>

<primary_objective>
Your sole objective in this task is to extract the highest quality/most relevant context from the conversation history below.
</primary_objective>

<objective_information>
You're nearing the total number of input tokens you can accept, so you must extract the highest quality/most relevant pieces of information from your conversation history.
This context will then overwrite the conversation history presented below. Because of this, ensure the context you extract is only the most important information to your overall goal.
</objective_information>

<instructions>
The conversation history below will be replaced with the context you extract in this step. Because of this, you must do your very best to extract and record all of the most important context from the conversation history.
You want to ensure that you don't repeat any actions you've already completed, so the context you extract from the conversation history should be focused on the most important information to your overall goal.
</instructions>

The user will message you with the full message history you'll be extracting context from, to then replace. Carefully read over it all, and think deeply about what information is most important to your overall goal that should be saved:

With all of this in mind, please carefully read over the entire conversation history, and extract the most important and relevant context to replace it so that you can free up space in the conversation history.
Respond ONLY with the extracted context. Do not include any additional information, or text before or after the extracted context.

<messages>
Messages to summarize:
{messages}
</messages>`;
var tokenCounterSchema = functionType().args(arrayType(custom$1())).returns(unionType([numberType(), promiseType(numberType())]));
var contextSizeSchema = objectType({
	/**
	* Fraction of the model's context size to use as the trigger
	*/
	fraction: numberType().gt(0, "Fraction must be greater than 0").max(1, "Fraction must be less than or equal to 1").optional(),
	/**
	* Number of tokens to use as the trigger
	*/
	tokens: numberType().positive("Tokens must be greater than 0").optional(),
	/**
	* Number of messages to use as the trigger
	*/
	messages: numberType().int("Messages must be an integer").positive("Messages must be greater than 0").optional()
}).refine((data) => {
	return [
		data.fraction,
		data.tokens,
		data.messages
	].filter((v) => v !== void 0).length >= 1;
}, { message: "At least one of fraction, tokens, or messages must be provided" });
var keepSchema = objectType({
	/**
	* Fraction of the model's context size to keep
	*/
	fraction: numberType().min(0, "Messages must be non-negative").max(1, "Fraction must be less than or equal to 1").optional(),
	/**
	* Number of tokens to keep
	*/
	tokens: numberType().min(0, "Tokens must be greater than or equal to 0").optional(),
	messages: numberType().int("Messages must be an integer").min(0, "Messages must be non-negative").optional()
}).refine((data) => {
	return [
		data.fraction,
		data.tokens,
		data.messages
	].filter((v) => v !== void 0).length === 1;
}, { message: "Exactly one of fraction, tokens, or messages must be provided" });
objectType({
	/**
	* Model to use for summarization
	*/
	model: custom$1(),
	/**
	* Trigger conditions for summarization.
	* Can be a single condition object (all properties must be met) or an array of conditions (any condition must be met).
	*
	* @example
	* ```ts
	* // Single condition: trigger if tokens >= 5000 AND messages >= 3
	* trigger: { tokens: 5000, messages: 3 }
	*
	* // Multiple conditions: trigger if (tokens >= 5000 AND messages >= 3) OR (tokens >= 3000 AND messages >= 6)
	* trigger: [
	*   { tokens: 5000, messages: 3 },
	*   { tokens: 3000, messages: 6 }
	* ]
	* ```
	*/
	trigger: unionType([contextSizeSchema, arrayType(contextSizeSchema)]).optional(),
	/**
	* Keep conditions for summarization
	*/
	keep: keepSchema.optional(),
	/**
	* Token counter function to use for summarization
	*/
	tokenCounter: tokenCounterSchema.optional(),
	/**
	* Summary prompt to use for summarization
	* @default {@link DEFAULT_SUMMARY_PROMPT}
	*/
	summaryPrompt: stringType().default(DEFAULT_SUMMARY_PROMPT$1),
	/**
	* Number of tokens to trim to before summarizing
	*/
	trimTokensToSummarize: numberType().optional(),
	/**
	* Prefix to add to the summary
	*/
	summaryPrefix: stringType().optional(),
	/**
	* @deprecated Use `trigger: { tokens: value }` instead.
	*/
	maxTokensBeforeSummary: numberType().optional(),
	/**
	* @deprecated Use `keep: { messages: value }` instead.
	*/
	messagesToKeep: numberType().optional()
});
objectType({
	/**
	* The language model to use for tool selection (default: the provided model from the agent options).
	*/
	model: stringType().or(instanceOfType(BaseLanguageModel)).optional(),
	/**
	* System prompt for the tool selection model.
	*/
	systemPrompt: stringType().optional(),
	/**
	* Maximum number of tools to select. If the model selects more,
	* only the first maxTools will be used. No limit if not specified.
	*/
	maxTools: numberType().optional(),
	/**
	* Tool names to always include regardless of selection.
	* These do not count against the maxTools limit.
	*/
	alwaysInclude: arrayType(stringType()).optional()
});
objectType({
	/**
	* Whether to check user messages before model call
	*/
	applyToInput: booleanType().optional(),
	/**
	* Whether to check AI messages after model call
	*/
	applyToOutput: booleanType().optional(),
	/**
	* Whether to check tool result messages after tool execution
	*/
	applyToToolResults: booleanType().optional()
});
objectType({ 
/**
* A record of PII detection rules to apply
* @default DEFAULT_PII_RULES (with enabled rules only)
*/
rules: recordType(stringType(), instanceOfType(RegExp).describe("Regular expression pattern to match PII")).optional() });
/**
* Schema for the exit behavior.
*/
var exitBehaviorSchema = enumType([
	"continue",
	"error",
	"end"
]).default("continue");
objectType({
	/**
	* Name of the specific tool to limit. If undefined, limits apply to all tools.
	*/
	toolName: stringType().optional(),
	/**
	* Maximum number of tool calls allowed per thread.
	* undefined means no limit.
	*/
	threadLimit: numberType().optional(),
	/**
	* Maximum number of tool calls allowed per run.
	* undefined means no limit.
	*/
	runLimit: numberType().optional(),
	/**
	* What to do when limits are exceeded.
	* - "continue": Block exceeded tools with error messages, let other tools continue (default)
	* - "error": Raise a ToolCallLimitExceededError exception
	* - "end": Stop execution immediately, injecting a ToolMessage and an AI message
	*   for the single tool call that exceeded the limit. Raises NotImplementedError
	*   if there are multiple tool calls.
	*
	* @default "continue"
	*/
	exitBehavior: exitBehaviorSchema
});
objectType({
	threadToolCallCount: recordType(stringType(), numberType()).default({}),
	runToolCallCount: recordType(stringType(), numberType()).default({})
});
//#endregion
//#region node_modules/langchain/dist/agents/middleware/todoListMiddleware.js
/**
* Description for the write_todos tool
* Ported exactly from Python WRITE_TODOS_DESCRIPTION
*/
var WRITE_TODOS_DESCRIPTION = `Use this tool to create and manage a structured task list for your current work session. This helps you track progress, organize complex tasks, and demonstrate thoroughness to the user.
It also helps the user understand the progress of the task and overall progress of their requests.
Only use this tool if you think it will be helpful in staying organized. If the user's request is trivial and takes less than 3 steps, it is better to NOT use this tool and just do the task directly.

## When to Use This Tool
Use this tool in these scenarios:

1. Complex multi-step tasks - When a task requires 3 or more distinct steps or actions
2. Non-trivial and complex tasks - Tasks that require careful planning or multiple operations
3. User explicitly requests todo list - When the user directly asks you to use the todo list
4. User provides multiple tasks - When users provide a list of things to be done (numbered or comma-separated)
5. The plan may need future revisions or updates based on results from the first few steps. Keeping track of this in a list is helpful.

## How to Use This Tool
1. When you start working on a task - Mark it as in_progress BEFORE beginning work.
2. After completing a task - Mark it as completed and add any new follow-up tasks discovered during implementation.
3. You can also update future tasks, such as deleting them if they are no longer necessary, or adding new tasks that are necessary. Don't change previously completed tasks.
4. You can make several updates to the todo list at once. For example, when you complete a task, you can mark the next task you need to start as in_progress.

## When NOT to Use This Tool
It is important to skip using this tool when:
1. There is only a single, straightforward task
2. The task is trivial and tracking it provides no benefit
3. The task can be completed in less than 3 trivial steps
4. The task is purely conversational or informational

## Examples of When to Use the Todo List

<example>
User: I want to add a dark mode toggle to the application settings. Make sure you run the tests and build when you're done!
Assistant: I'll help add a dark mode toggle to your application settings. Let me create a todo list to track this implementation.
*Creates todo list with the following items:*
1. Create dark mode toggle component in Settings page
2. Add dark mode state management (context/store)
3. Implement CSS-in-JS styles for dark theme
4. Update existing components to support theme switching
5. Run tests and build process, addressing any failures or errors that occur
*Begins working on the first task*

<reasoning>
The assistant used the todo list because:
1. Adding dark mode in it of itself is a multi-step feature requiring UI, state management, and styling changes
2. The assistant inferred that tests and build need to pass by adding "Ensure tests and build succeed" as the final task
3. Both of the user's requests are complex and require multiple steps to complete.
</reasoning>
</example>

<example>
User: Help me plan a comprehensive marketing campaign for our new product launch, including social media, email marketing, and press releases.
Assistant: I'll help you plan a comprehensive marketing campaign for your product launch. Let me create a todo list to organize all the components.
*Creates todo list with the following items:*
1. Define target audience and key messaging
2. Create social media content calendar and posting schedule
3. Design email marketing sequence and automation flows
4. Draft press release and identify media contacts
5. Set up tracking and analytics for campaign performance
6. Create visual assets and brand materials
7. Coordinate launch timeline and deliverables
*Begins working on the first task*

<reasoning>
The assistant used the todo list because:
1. Marketing campaign planning involves multiple distinct channels and activities
2. Each component requires careful coordination and planning
3. The systematic approach ensures all aspects of the launch are covered
</reasoning>
</example>

<example>
User: Help me rename the function getCwd to getCurrentWorkingDirectory across my project
Assistant: Let me first search through your codebase to find all occurrences of 'getCwd'.
*Uses search tools to locate all instances of getCwd in the codebase*
Assistant: I've found 15 instances of 'getCwd' across 8 different files. Let me create a todo list to track these changes.
*Creates todo list with specific items for each file that needs updating*

<reasoning>
The assistant used the todo list because:
1. The assistant searched to understand the scope of the task
2. Upon finding multiple occurrences across different files, it determined this was a complex task with multiple steps (>3)
3. The todo list helps ensure every instance is tracked and updated systematically
4. This approach prevents missing any occurrences and maintains consistency.
</reasoning>
</example>

<example>
User: I need help organizing my home office: decluttering the desk, setting up a filing system, organizing digital files, and creating a daily workflow.
Assistant: I'll help you organize your home office systematically. Let me create a todo list to track each area of organization.
*Creates todo list with items like: 1) Sort and declutter desk items, 2) Set up physical filing system for documents, 3) Organize digital files and folders, 4) Create daily workflow and productivity systems, 5) Establish maintenance routines*
Let's start with decluttering your desk space to create a clean foundation for the other organizational systems.

<reasoning>
The assistant used the todo list because:
1. The user provided multiple distinct organizational tasks
2. Each area requires different approaches and careful planning
3. Home organization benefits from systematic, step-by-step completion
4. Progress tracking ensures all areas are addressed thoroughly
</reasoning>
</example>

## Examples of When NOT to Use the Todo List

<example>
User: How do I print 'Hello World' in Python?
Assistant: In Python, you can print "Hello World" with this simple code:

\`\`\`python
print("Hello World")
\`\`\`

This will output the text "Hello World" to the console when executed.</assistant>

<reasoning>
The assistant did not use the todo list because this is a single, trivial task that can be completed in one step. There's no need to track multiple tasks or steps for such a straightforward request.
</reasoning>
</example>

<example>
User: What's the best way to water houseplants?
Assistant: The best way to water houseplants depends on the specific plant type, but here are some general guidelines:

- Check soil moisture by inserting your finger about 1-2 inches into the soil
- Water thoroughly when the top inch feels dry, allowing water to drain from the bottom
- Use room temperature water and water in the morning when possible
- Avoid overwatering, which is more harmful than underwatering for most plants

Different plants have different needs, so it's important to research your specific varieties for optimal care.

<reasoning>
The assistant did not use the todo list because this is an informational request with no actual tasks to complete. The user is simply asking for advice and explanation, not for the assistant to perform multiple steps or activities.
</reasoning>
</example>

<example>
User: Can you add a comment to the calculateTotal function to explain what it does?
Assistant: Sure, let me add a comment to the calculateTotal function to explain what it does.
* Uses the Edit tool to add a comment to the calculateTotal function *

<reasoning>
The assistant did not use the todo list because this is a single, straightforward task confined to one location. Adding a comment doesn't require tracking multiple steps or systematic organization.
</reasoning>
</example>

<example>
User: What time is it in Tokyo right now?
Assistant: I'll check the current time in Tokyo for you.

*Searches for current time in Tokyo*

The current time in Tokyo, Japan is [current time]. Tokyo is in the Japan Standard Time (JST) zone, which is UTC+9.

<reasoning>
The assistant did not use the todo list because this is a single information lookup with immediate results. There are no multiple steps to track or organize, making the todo list unnecessary for this straightforward request.
</reasoning>
</example>

<example>
User: I need to write a function that checks if a number is prime and then test it out.
Assistant: I'll help you write a function that checks if a number is prime and then test it out.
*Writes function that checks if a number is prime*
*Tests the function*

<reasoning>
Even though this is a multi-step task, it is very straightforward and can be completed in two trivial steps (which is less than 3 steps!). Using the todo list here is overkill and wastes time and tokens.
</reasoning>
</example>

<example>
User: I want you to order a pizza from Dominos, order a burger from McDonald's, and order a salad from Subway.
Assistant: I'll help you order a pizza from Dominos, order a burger from McDonald's, and order a salad from Subway.
*Orders a pizza from Dominos*
*Orders a burger from McDonald's*
*Orders a salad from Subway*

<reasoning>
Even though this is a multi-step task, assuming the assistant has the ability to order from these restaurants, it is very straightforward and can be completed in three trivial tool calls. 
Using the todo list here is overkill and wastes time and tokens. These three tool calls should be made in parallel, in fact.
</reasoning>
</example>


## Task States and Management

1. **Task States**: Use these states to track progress:
   - pending: Task not yet started
   - in_progress: Currently working on (you can have multiple tasks in_progress at a time if they are not related to each other and can be run in parallel)
   - completed: Task finished successfully

2. **Task Management**:
   - Update task status in real-time as you work
   - Mark tasks complete IMMEDIATELY after finishing (don't batch completions)
   - Complete current tasks before starting new ones
   - Remove tasks that are no longer relevant from the list entirely
   - IMPORTANT: When you write this todo list, you should mark your first task (or tasks) as in_progress immediately!.
   - IMPORTANT: Unless all tasks are completed, you should always have at least one task in_progress to show the user that you are working on something.

3. **Task Completion Requirements**:
   - ONLY mark a task as completed when you have FULLY accomplished it
   - If you encounter errors, blockers, or cannot finish, keep the task as in_progress
   - When blocked, create a new task describing what needs to be resolved
   - Never mark a task as completed if:
     - There are unresolved issues or errors
     - Work is partial or incomplete
     - You encountered blockers that prevent completion
     - You couldn't find necessary resources or dependencies
     - Quality standards haven't been met

4. **Task Breakdown**:
   - Create specific, actionable items
   - Break complex tasks into smaller, manageable steps
   - Use clear, descriptive task names

Being proactive with task management demonstrates attentiveness and ensures you complete all requirements successfully
Remember: If you only need to make a few tool calls to complete a task, and it is clear what you need to do, it is better to just do the task directly and NOT call this tool at all.`;
var TODO_LIST_MIDDLEWARE_SYSTEM_PROMPT = `## \`write_todos\`

You have access to the \`write_todos\` tool to help you manage and plan complex objectives. 
Use this tool for complex objectives to ensure that you are tracking each necessary step and giving the user visibility into your progress.
This tool is very helpful for planning complex objectives, and for breaking down these larger complex objectives into smaller steps.

It is critical that you mark todos as completed as soon as you are done with a step. Do not batch up multiple steps before marking them as completed.
For simple objectives that only require a few steps, it is better to just complete the objective directly and NOT use this tool.
Writing todos takes time and tokens, use it when it is helpful for managing complex many-step problems! But not for simple few-step requests.

## Important To-Do List Usage Notes to Remember
- The \`write_todos\` tool should never be called multiple times in parallel.
- Don't be afraid to revise the To-Do list as you go. New information may reveal new tasks that need to be done, or old tasks that are irrelevant.`;
var TodoStatus = enumType([
	"pending",
	"in_progress",
	"completed"
]).describe("Status of the todo");
var TodoSchema = objectType({
	content: stringType().describe("Content of the todo item"),
	status: TodoStatus
});
var stateSchema$1 = objectType({ todos: arrayType(TodoSchema).default([]) });
/**
* Creates a middleware that provides todo list management capabilities to agents.
*
* This middleware adds a `write_todos` tool that allows agents to create and manage
* structured task lists for complex multi-step operations. It's designed to help
* agents track progress, organize complex tasks, and provide users with visibility
* into task completion status.
*
* The middleware automatically injects system prompts that guide the agent on when
* and how to use the todo functionality effectively. It also enforces that the
* `write_todos` tool is called at most once per model turn, since the tool replaces
* the entire todo list and parallel calls would create ambiguity about precedence.
*
* @example
* ```typescript
* import { todoListMiddleware, createAgent } from 'langchain';
*
* const agent = createAgent({
*   model: "openai:gpt-4o",
*   middleware: [todoListMiddleware()],
* });
*
* // Agent now has access to write_todos tool and todo state tracking
* const result = await agent.invoke({
*   messages: [new HumanMessage("Help me refactor my codebase")]
* });
*
* console.log(result.todos); // Array of todo items with status tracking
* ```
*
* @returns A configured middleware instance that provides todo management capabilities
*
* @see {@link TodoMiddlewareState} for the state schema
* @see {@link writeTodos} for the tool implementation
*/
function todoListMiddleware(options) {
	/**
	* Write todos tool - manages todo list with Command return
	*/
	const writeTodos = tool(({ todos }, config) => {
		return new Command({ update: {
			todos,
			messages: [new ToolMessage({
				content: `Updated todo list to ${JSON.stringify(todos)}`,
				tool_call_id: config.toolCall?.id,
				name: "write_todos"
			})]
		} });
	}, {
		name: "write_todos",
		description: options?.toolDescription ?? WRITE_TODOS_DESCRIPTION,
		schema: objectType({ todos: arrayType(TodoSchema).describe("List of todo items to update") })
	});
	return createMiddleware({
		name: "todoListMiddleware",
		stateSchema: stateSchema$1,
		tools: [writeTodos],
		wrapModelCall: (request, handler) => handler({
			...request,
			systemMessage: request.systemMessage.concat(`\n\n${options?.systemPrompt ?? TODO_LIST_MIDDLEWARE_SYSTEM_PROMPT}`)
		}),
		afterModel: (state) => {
			/**
			* Check for parallel write_todos tool calls and return errors if detected.
			*
			* The todo list is designed to be updated at most once per model turn. Since
			* the `write_todos` tool replaces the entire todo list with each call, making
			* multiple parallel calls would create ambiguity about which update should take
			* precedence. This method prevents such conflicts by rejecting any response that
			* contains multiple write_todos tool calls.
			*/
			const messages = state.messages;
			if (!messages || messages.length === 0) return;
			/**
			* Find the last AI message
			*/
			const lastAiMsg = [...messages].reverse().find((msg) => AIMessage.isInstance(msg));
			if (!lastAiMsg || !lastAiMsg.tool_calls || lastAiMsg.tool_calls.length === 0) return;
			/**
			* Count write_todos tool calls
			*/
			const writeTodosCalls = lastAiMsg.tool_calls.filter((tc) => tc.name === writeTodos.name);
			if (writeTodosCalls.length > 1)
 /**
			* Keep the tool calls in the AI message but return error messages
			* This follows the same pattern as HumanInTheLoopMiddleware
			*/
			return { messages: writeTodosCalls.map((tc) => new ToolMessage({
				content: "Error: The `write_todos` tool should never be called multiple times in parallel. Please call it only once per model invocation to update the todo list.",
				tool_call_id: tc.id,
				name: "write_todos",
				status: "error"
			})) };
		}
	});
}
objectType({
	/**
	* The maximum number of model calls allowed per thread.
	*/
	threadLimit: numberType().optional(),
	/**
	* The maximum number of model calls allowed per run.
	*/
	runLimit: numberType().optional(),
	/**
	* The behavior to take when the limit is exceeded.
	* - "error" will throw an error and stop the agent.
	* - "end" will end the agent.
	* @default "end"
	*/
	exitBehavior: enumType(["error", "end"]).optional()
});
objectType({
	threadModelCallCount: numberType().default(0),
	runModelCallCount: numberType().default(0)
});
//#endregion
//#region node_modules/langchain/dist/agents/middleware/constants.js
var RetrySchema = objectType({
	/**
	* Maximum number of retry attempts after the initial call.
	* Default is 2 retries (3 total attempts). Must be >= 0.
	*/
	maxRetries: numberType().min(0).default(2),
	/**
	* Either an array of error constructors to retry on, or a function
	* that takes an error and returns `true` if it should be retried.
	* Default is to retry on all errors.
	*/
	retryOn: unionType([functionType().args(instanceOfType(Error)).returns(booleanType()), arrayType(custom$1())]).default(() => () => true),
	/**
	* Multiplier for exponential backoff. Each retry waits
	* `initialDelayMs * (backoffFactor ** retryNumber)` milliseconds.
	* Set to 0.0 for constant delay. Default is 2.0.
	*/
	backoffFactor: numberType().min(0).default(2),
	/**
	* Initial delay in milliseconds before first retry. Default is 1000 (1 second).
	*/
	initialDelayMs: numberType().min(0).default(1e3),
	/**
	* Maximum delay in milliseconds between retries. Caps exponential
	* backoff growth. Default is 60000 (60 seconds).
	*/
	maxDelayMs: numberType().min(0).default(6e4),
	/**
	* Whether to add random jitter (±25%) to delay to avoid thundering herd.
	* Default is `true`.
	*/
	jitter: booleanType().default(true)
});
objectType({ 
/**
* Behavior when all retries are exhausted. Options:
* - `"continue"` (default): Return an AIMessage with error details, allowing
*   the agent to potentially handle the failure gracefully.
* - `"error"`: Re-raise the exception, stopping agent execution.
* - Custom function: Function that takes the exception and returns a string
*   for the AIMessage content, allowing custom error formatting.
*/
onFailure: unionType([
	literalType("error"),
	literalType("continue"),
	functionType().args(instanceOfType(Error)).returns(stringType())
]).default("continue") }).merge(RetrySchema);
objectType({
	/**
	* Optional list of tools or tool names to apply retry logic to.
	* Can be a list of `BaseTool` instances or tool name strings.
	* If `undefined`, applies to all tools. Default is `undefined`.
	*/
	tools: arrayType(unionType([
		custom$1(),
		custom$1(),
		stringType()
	])).optional(),
	/**
	* Behavior when all retries are exhausted. Options:
	* - `"continue"` (default): Return an AIMessage with error details, allowing
	*   the agent to potentially handle the failure gracefully.
	* - `"error"`: Re-raise the exception, stopping agent execution.
	* - Custom function: Function that takes the exception and returns a string
	*   for the AIMessage content, allowing custom error formatting.
	*
	* Deprecated values:
	* - `"raise"`: use `"error"` instead.
	* - `"return_message"`: use `"continue"` instead.
	*/
	onFailure: unionType([
		literalType("error"),
		literalType("continue"),
		literalType("raise"),
		literalType("return_message"),
		functionType().args(instanceOfType(Error)).returns(stringType())
	]).default("continue")
}).merge(RetrySchema);
//#endregion
//#region node_modules/langchain/dist/agents/middleware/provider/anthropic/promptCaching.js
var DEFAULT_ENABLE_CACHING$1 = true;
var DEFAULT_TTL$1 = "5m";
var DEFAULT_MIN_MESSAGES_TO_CACHE$1 = 3;
var DEFAULT_UNSUPPORTED_MODEL_BEHAVIOR$1 = "warn";
var contextSchema$1 = objectType({
	/**
	* Whether to enable prompt caching.
	* @default true
	*/
	enableCaching: booleanType().optional(),
	/**
	* The time-to-live for the cached prompt.
	* @default "5m"
	*/
	ttl: enumType(["5m", "1h"]).optional(),
	/**
	* The minimum number of messages required before caching is applied.
	* @default 3
	*/
	minMessagesToCache: numberType().optional(),
	/**
	* The behavior to take when an unsupported model is used.
	* - "ignore" will ignore the unsupported model and continue without caching.
	* - "warn" will warn the user and continue without caching.
	* - "raise" will raise an error and stop the agent.
	* @default "warn"
	*/
	unsupportedModelBehavior: enumType([
		"ignore",
		"warn",
		"raise"
	]).optional()
});
var PromptCachingMiddlewareError = class extends Error {
	constructor(message) {
		super(message);
		this.name = "PromptCachingMiddlewareError";
	}
};
/**
* Creates a prompt caching middleware for Anthropic models to optimize API usage.
*
* This middleware automatically adds cache control headers to the last messages when using Anthropic models,
* enabling their prompt caching feature. This can significantly reduce costs for applications with repetitive
* prompts, long system messages, or extensive conversation histories.
*
* ## How It Works
*
* The middleware intercepts model requests and adds cache control metadata that tells Anthropic's
* API to cache processed prompt prefixes. On subsequent requests with matching prefixes, the
* cached representations are reused, skipping redundant token processing.
*
* ## Benefits
*
* - **Cost Reduction**: Avoid reprocessing the same tokens repeatedly (up to 90% savings on cached portions)
* - **Lower Latency**: Cached prompts are processed faster as embeddings are pre-computed
* - **Better Scalability**: Reduced computational load enables handling more requests
* - **Consistent Performance**: Stable response times for repetitive queries
*
* @param middlewareOptions - Configuration options for the caching behavior
* @param middlewareOptions.enableCaching - Whether to enable prompt caching (default: `true`)
* @param middlewareOptions.ttl - Cache time-to-live: `"5m"` for 5 minutes or `"1h"` for 1 hour (default: `"5m"`)
* @param middlewareOptions.minMessagesToCache - Minimum number of messages required before caching is applied (default: `3`)
* @param middlewareOptions.unsupportedModelBehavior - The behavior to take when an unsupported model is used (default: `"warn"`)
*
* @returns A middleware instance that can be passed to `createAgent`
*
* @throws {Error} If used with non-Anthropic models
*
* @example
* Basic usage with default settings
* ```typescript
* import { createAgent } from "langchain";
* import { anthropicPromptCachingMiddleware } from "langchain";
*
* const agent = createAgent({
*   model: "anthropic:claude-sonnet-4-5",
*   middleware: [
*     anthropicPromptCachingMiddleware()
*   ]
* });
* ```
*
* @example
* Custom configuration for longer conversations
* ```typescript
* const cachingMiddleware = anthropicPromptCachingMiddleware({
*   ttl: "1h",  // Cache for 1 hour instead of default 5 minutes
*   minMessagesToCache: 5  // Only cache after 5 messages
* });
*
* const agent = createAgent({
*   model: "anthropic:claude-sonnet-4-5",
*   systemPrompt: "You are a helpful assistant with deep knowledge of...", // Long system prompt
*   middleware: [cachingMiddleware]
* });
* ```
*
* @example
* Conditional caching based on runtime context
* ```typescript
* const agent = createAgent({
*   model: "anthropic:claude-sonnet-4-5",
*   middleware: [
*     anthropicPromptCachingMiddleware({
*       enableCaching: true,
*       ttl: "5m"
*     })
*   ]
* });
*
* // Disable caching for specific requests
* await agent.invoke(
*   { messages: [new HumanMessage("Process this without caching")] },
*   {
*     configurable: {
*       middleware_context: { enableCaching: false }
*     }
*   }
* );
* ```
*
* @example
* Optimal setup for customer support chatbot
* ```typescript
* const supportAgent = createAgent({
*   model: "anthropic:claude-sonnet-4-5",
*   systemPrompt: `You are a customer support agent for ACME Corp.
*
*     Company policies:
*     - Always be polite and professional
*     - Refer to knowledge base for product information
*     - Escalate billing issues to human agents
*     ... (extensive policies and guidelines)
*   `,
*   tools: [searchKnowledgeBase, createTicket, checkOrderStatus],
*   middleware: [
*     anthropicPromptCachingMiddleware({
*       ttl: "1h",  // Long TTL for stable system prompt
*       minMessagesToCache: 1  // Cache immediately due to large system prompt
*     })
*   ]
* });
* ```
*
* @remarks
* - **Anthropic Only**: This middleware only works with Anthropic models and will throw an error if used with other providers
* - **Automatic Application**: Caching is applied automatically when message count exceeds `minMessagesToCache`
* - **Cache Scope**: Caches are isolated per API key and cannot be shared across different keys
* - **TTL Options**: Only supports "5m" (5 minutes) and "1h" (1 hour) as TTL values per Anthropic's API
* - **Best Use Cases**: Long system prompts, multi-turn conversations, repetitive queries, RAG applications
* - **Cost Impact**: Cached tokens are billed at 10% of the base input token price, cache writes are billed at 25% of the base
*
* @see {@link createAgent} for agent creation
* @see {@link https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching} Anthropic's prompt caching documentation
* @public
*/
function anthropicPromptCachingMiddleware(middlewareOptions) {
	return createMiddleware({
		name: "PromptCachingMiddleware",
		contextSchema: contextSchema$1,
		wrapModelCall: (request, handler) => {
			/**
			* Prefer runtime context values over middleware options values over defaults
			*/
			const enableCaching = request.runtime.context.enableCaching ?? middlewareOptions?.enableCaching ?? DEFAULT_ENABLE_CACHING$1;
			const ttl = request.runtime.context.ttl ?? middlewareOptions?.ttl ?? DEFAULT_TTL$1;
			const minMessagesToCache = request.runtime.context.minMessagesToCache ?? middlewareOptions?.minMessagesToCache ?? DEFAULT_MIN_MESSAGES_TO_CACHE$1;
			const unsupportedModelBehavior = request.runtime.context.unsupportedModelBehavior ?? middlewareOptions?.unsupportedModelBehavior ?? DEFAULT_UNSUPPORTED_MODEL_BEHAVIOR$1;
			if (!enableCaching || !request.model) return handler(request);
			if (!(request.model.getName() === "ChatAnthropic" || request.model.getName() === "ConfigurableModel" && request.model._defaultConfig?.modelProvider === "anthropic")) {
				const modelName = request.model.getName();
				const baseMessage = `Unsupported model '${request.model.getName() === "ConfigurableModel" ? `${modelName} (${request.model._defaultConfig?.modelProvider})` : modelName}'. Prompt caching requires an Anthropic model`;
				if (unsupportedModelBehavior === "raise") throw new PromptCachingMiddlewareError(`${baseMessage} (e.g., 'anthropic:claude-4-0-sonnet').`);
				else if (unsupportedModelBehavior === "warn") console.warn(`PromptCachingMiddleware: Skipping caching for ${modelName}. Consider switching to an Anthropic model for caching benefits.`);
				return handler(request);
			}
			if (request.state.messages.length + (request.systemPrompt ? 1 : 0) < minMessagesToCache) return handler(request);
			/**
			* The cache_control is applied at the final message formatting layer in ChatAnthropic,
			* which avoids issues with message content block manipulation during earlier
			* processing stages (e.g., streaming response reassembly).
			*
			* @see https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching
			*/
			return handler({
				...request,
				modelSettings: {
					...request.modelSettings,
					cache_control: {
						type: "ephemeral",
						ttl
					}
				}
			});
		}
	});
}
//#endregion
//#region node_modules/langchain/dist/agents/middleware/provider/aws/promptCaching.js
var DEFAULT_ENABLE_CACHING = true;
var DEFAULT_TTL = "5m";
var DEFAULT_MIN_MESSAGES_TO_CACHE = 1;
var DEFAULT_UNSUPPORTED_MODEL_BEHAVIOR = "warn";
var contextSchema = objectType({
	/**
	* Whether to enable prompt caching.
	* @default true
	*/
	enableCaching: booleanType().optional(),
	/**
	* The time-to-live for the cached prompt.
	* @default "5m"
	*/
	ttl: enumType(["5m", "1h"]).optional(),
	/**
	* The minimum number of messages required before caching is applied.
	* @default 1
	*/
	minMessagesToCache: numberType().optional(),
	/**
	* The behavior to take when an unsupported model is used.
	* - "ignore" will ignore the unsupported model and continue without caching.
	* - "warn" will warn the user and continue without caching.
	* - "raise" will raise an error and stop the agent.
	* @default "warn"
	*/
	unsupportedModelBehavior: enumType([
		"ignore",
		"warn",
		"raise"
	]).optional()
});
var BedrockPromptCachingMiddlewareError = class extends Error {
	constructor(message) {
		super(message);
		this.name = "BedrockPromptCachingMiddlewareError";
	}
};
/**
* Creates a prompt caching middleware for AWS Bedrock Converse models to optimize API usage.
*
* This middleware automatically enables Bedrock's prompt caching when using AWS Bedrock Converse
* models. This can significantly reduce costs for applications with repetitive prompts, long
* system messages, or extensive conversation histories.
*
* ## How It Works
*
* The middleware intercepts model requests and sets a cache control signal that
* `ChatBedrockConverse` translates into Bedrock `cachePoint` breakpoints. Cache points are
* inserted after the system prompt, after the tool definitions, and after the final message, so
* the stable prefix of each request is cached. On subsequent requests with a matching prefix, the
* cached representations are reused, skipping redundant token processing. Exact placement varies
* by model (e.g. Amazon Nova models cache fewer breakpoints and ignore the `"1h"` TTL).
*
* ## Benefits
*
* - **Cost Reduction**: Avoid reprocessing the same tokens repeatedly
* - **Lower Latency**: Cached prompts are processed faster as embeddings are pre-computed
* - **Better Scalability**: Reduced computational load enables handling more requests
* - **Consistent Performance**: Stable response times for repetitive queries
*
* @param middlewareOptions - Configuration options for the caching behavior
* @param middlewareOptions.enableCaching - Whether to enable prompt caching (default: `true`)
* @param middlewareOptions.ttl - Cache time-to-live: `"5m"` for 5 minutes or `"1h"` for 1 hour (default: `"5m"`)
* @param middlewareOptions.minMessagesToCache - Minimum number of messages required before caching is applied (default: `1`)
* @param middlewareOptions.unsupportedModelBehavior - The behavior to take when an unsupported model is used (default: `"warn"`)
*
* @returns A middleware instance that can be passed to `createAgent`
*
* @throws {Error} When `unsupportedModelBehavior` is `"raise"` and the model is not a
* cache-capable Bedrock Converse model — either a non-Bedrock provider, or a Bedrock
* Converse model outside the Anthropic Claude / Amazon Nova families.
*
* @example
* Basic usage with default settings
* ```typescript
* import { createAgent } from "langchain";
* import { bedrockPromptCachingMiddleware } from "langchain";
*
* const agent = createAgent({
*   model: "bedrock:anthropic.claude-haiku-4-5-20251001-v1:0",
*   middleware: [
*     bedrockPromptCachingMiddleware()
*   ]
* });
* ```
*
* @example
* Custom configuration for longer conversations
* ```typescript
* const cachingMiddleware = bedrockPromptCachingMiddleware({
*   ttl: "1h",  // Cache for 1 hour instead of default 5 minutes
*   minMessagesToCache: 5  // Only cache after 5 messages
* });
*
* const agent = createAgent({
*   model: "bedrock:anthropic.claude-haiku-4-5-20251001-v1:0",
*   systemPrompt: "You are a helpful assistant with deep knowledge of...", // Long system prompt
*   middleware: [cachingMiddleware]
* });
* ```
*
* @example
* Conditional caching based on runtime context
* ```typescript
* const agent = createAgent({
*   model: "bedrock:anthropic.claude-haiku-4-5-20251001-v1:0",
*   middleware: [
*     bedrockPromptCachingMiddleware({
*       enableCaching: true,
*       ttl: "5m"
*     })
*   ]
* });
*
* // Disable caching for specific requests
* await agent.invoke(
*   { messages: [new HumanMessage("Process this without caching")] },
*   {
*     configurable: {
*       middleware_context: { enableCaching: false }
*     }
*   }
* );
* ```
*
* @example
* Optimal setup for customer support chatbot
* ```typescript
* const supportAgent = createAgent({
*   model: "bedrock:anthropic.claude-haiku-4-5-20251001-v1:0",
*   systemPrompt: `You are a customer support agent for ACME Corp.
*
*     Company policies:
*     - Always be polite and professional
*     - Refer to knowledge base for product information
*     - Escalate billing issues to human agents
*     ... (extensive policies and guidelines)
*   `,
*   tools: [searchKnowledgeBase, createTicket, checkOrderStatus],
*   middleware: [
*     bedrockPromptCachingMiddleware({
*       ttl: "1h",  // Long TTL for stable system prompt
*       minMessagesToCache: 1  // Cache immediately due to large system prompt
*     })
*   ]
* });
* ```
*
* @remarks
* - **Bedrock Converse Only**: This middleware only applies caching to AWS Bedrock Converse models. Other providers are handled per `unsupportedModelBehavior`
* - **Supported Families**: Bedrock prompt caching is only available on the **Anthropic Claude** and **Amazon Nova** model families. Other Bedrock Converse models (e.g. Mistral, Cohere, Meta) reject cache points at request time, so they are treated as unsupported and routed through `unsupportedModelBehavior`
* - **Automatic Application**: Caching is applied automatically when the message count reaches `minMessagesToCache`
* - **TTL Options**: Only supports "5m" (5 minutes) and "1h" (1 hour) as TTL values; actual support varies by model
* - **Best Use Cases**: Long system prompts, multi-turn conversations, repetitive queries, RAG applications
*
* @see {@link createAgent} for agent creation
* @see {@link https://docs.aws.amazon.com/bedrock/latest/userguide/prompt-caching.html} AWS Bedrock prompt caching documentation
* @public
*/
function bedrockPromptCachingMiddleware(middlewareOptions) {
	return createMiddleware({
		name: "BedrockPromptCachingMiddleware",
		contextSchema,
		wrapModelCall: (request, handler) => {
			const enableCaching = request.runtime.context.enableCaching ?? middlewareOptions?.enableCaching ?? DEFAULT_ENABLE_CACHING;
			const ttl = request.runtime.context.ttl ?? middlewareOptions?.ttl ?? DEFAULT_TTL;
			const minMessagesToCache = request.runtime.context.minMessagesToCache ?? middlewareOptions?.minMessagesToCache ?? DEFAULT_MIN_MESSAGES_TO_CACHE;
			const unsupportedModelBehavior = request.runtime.context.unsupportedModelBehavior ?? middlewareOptions?.unsupportedModelBehavior ?? DEFAULT_UNSUPPORTED_MODEL_BEHAVIOR;
			if (!enableCaching || !request.model) return handler(request);
			const modelName = request.model.getName();
			const isBedrockConverseModel = modelName === "ChatBedrockConverse" || modelName === "ConfigurableModel" && (request.model._defaultConfig?.modelProvider === "bedrock" || request.model._defaultConfig?.modelProvider === "aws");
			const modelId = modelName === "ConfigurableModel" ? request.model._defaultConfig?.model : request.model.model;
			if (!(isBedrockConverseModel && typeof modelId === "string" && (modelId.toLowerCase().includes("anthropic.claude") || modelId.toLowerCase().includes("amazon.nova")))) {
				const modelInfo = modelName === "ConfigurableModel" ? `${modelName} (${request.model._defaultConfig?.modelProvider})` : modelName;
				const baseMessage = isBedrockConverseModel ? `Unsupported model '${modelInfo}'. Bedrock prompt caching is only supported on Anthropic Claude and Amazon Nova models` : `Unsupported model '${modelInfo}'. Prompt caching requires an AWS Bedrock Converse model`;
				if (unsupportedModelBehavior === "raise") throw new BedrockPromptCachingMiddlewareError(`${baseMessage} (e.g., 'bedrock:anthropic.claude-haiku-4-5-20251001-v1:0').`);
				else if (unsupportedModelBehavior === "warn") console.warn(`BedrockPromptCachingMiddleware: Skipping caching for ${modelName}. Consider switching to an Anthropic Claude or Amazon Nova model for caching benefits.`);
				return handler(request);
			}
			if (request.state.messages.length + (request.systemPrompt ? 1 : 0) < minMessagesToCache) return handler(request);
			/**
			* The cache_control is applied at the final message formatting layer in
			* ChatBedrockConverse (translated into Converse `cachePoint` blocks).
			*
			* @see https://docs.aws.amazon.com/bedrock/latest/userguide/prompt-caching.html
			*/
			return handler({
				...request,
				modelSettings: {
					...request.modelSettings,
					cache_control: {
						type: "ephemeral",
						ttl
					}
				}
			});
		}
	});
}
//#endregion
//#region node_modules/micromatch/node_modules/picomatch/lib/constants.js
var require_constants = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var path$7 = __require("path");
	var WIN_SLASH = "\\\\/";
	var WIN_NO_SLASH = `[^${WIN_SLASH}]`;
	var DEFAULT_MAX_EXTGLOB_RECURSION = 0;
	/**
	* Posix glob regex
	*/
	var DOT_LITERAL = "\\.";
	var PLUS_LITERAL = "\\+";
	var QMARK_LITERAL = "\\?";
	var SLASH_LITERAL = "\\/";
	var ONE_CHAR = "(?=.)";
	var QMARK = "[^/]";
	var END_ANCHOR = `(?:${SLASH_LITERAL}|$)`;
	var START_ANCHOR = `(?:^|${SLASH_LITERAL})`;
	var DOTS_SLASH = `${DOT_LITERAL}{1,2}${END_ANCHOR}`;
	var POSIX_CHARS = {
		DOT_LITERAL,
		PLUS_LITERAL,
		QMARK_LITERAL,
		SLASH_LITERAL,
		ONE_CHAR,
		QMARK,
		END_ANCHOR,
		DOTS_SLASH,
		NO_DOT: `(?!${DOT_LITERAL})`,
		NO_DOTS: `(?!${START_ANCHOR}${DOTS_SLASH})`,
		NO_DOT_SLASH: `(?!${DOT_LITERAL}{0,1}${END_ANCHOR})`,
		NO_DOTS_SLASH: `(?!${DOTS_SLASH})`,
		QMARK_NO_DOT: `[^.${SLASH_LITERAL}]`,
		STAR: `${QMARK}*?`,
		START_ANCHOR
	};
	/**
	* Windows glob regex
	*/
	var WINDOWS_CHARS = {
		...POSIX_CHARS,
		SLASH_LITERAL: `[${WIN_SLASH}]`,
		QMARK: WIN_NO_SLASH,
		STAR: `${WIN_NO_SLASH}*?`,
		DOTS_SLASH: `${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$)`,
		NO_DOT: `(?!${DOT_LITERAL})`,
		NO_DOTS: `(?!(?:^|[${WIN_SLASH}])${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$))`,
		NO_DOT_SLASH: `(?!${DOT_LITERAL}{0,1}(?:[${WIN_SLASH}]|$))`,
		NO_DOTS_SLASH: `(?!${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$))`,
		QMARK_NO_DOT: `[^.${WIN_SLASH}]`,
		START_ANCHOR: `(?:^|[${WIN_SLASH}])`,
		END_ANCHOR: `(?:[${WIN_SLASH}]|$)`
	};
	module.exports = {
		DEFAULT_MAX_EXTGLOB_RECURSION,
		MAX_LENGTH: 1024 * 64,
		POSIX_REGEX_SOURCE: {
			__proto__: null,
			alnum: "a-zA-Z0-9",
			alpha: "a-zA-Z",
			ascii: "\\x00-\\x7F",
			blank: " \\t",
			cntrl: "\\x00-\\x1F\\x7F",
			digit: "0-9",
			graph: "\\x21-\\x7E",
			lower: "a-z",
			print: "\\x20-\\x7E ",
			punct: "\\-!\"#$%&'()\\*+,./:;<=>?@[\\]^_`{|}~",
			space: " \\t\\r\\n\\v\\f",
			upper: "A-Z",
			word: "A-Za-z0-9_",
			xdigit: "A-Fa-f0-9"
		},
		REGEX_BACKSLASH: /\\(?![*+?^${}(|)[\]])/g,
		REGEX_NON_SPECIAL_CHARS: /^[^@![\].,$*+?^{}()|\\/]+/,
		REGEX_SPECIAL_CHARS: /[-*+?.^${}(|)[\]]/,
		REGEX_SPECIAL_CHARS_BACKREF: /(\\?)((\W)(\3*))/g,
		REGEX_SPECIAL_CHARS_GLOBAL: /([-*+?.^${}(|)[\]])/g,
		REGEX_REMOVE_BACKSLASH: /(?:\[.*?[^\\]\]|\\(?=.))/g,
		REPLACEMENTS: {
			__proto__: null,
			"***": "*",
			"**/**": "**",
			"**/**/**": "**"
		},
		CHAR_0: 48,
		CHAR_9: 57,
		CHAR_UPPERCASE_A: 65,
		CHAR_LOWERCASE_A: 97,
		CHAR_UPPERCASE_Z: 90,
		CHAR_LOWERCASE_Z: 122,
		CHAR_LEFT_PARENTHESES: 40,
		CHAR_RIGHT_PARENTHESES: 41,
		CHAR_ASTERISK: 42,
		CHAR_AMPERSAND: 38,
		CHAR_AT: 64,
		CHAR_BACKWARD_SLASH: 92,
		CHAR_CARRIAGE_RETURN: 13,
		CHAR_CIRCUMFLEX_ACCENT: 94,
		CHAR_COLON: 58,
		CHAR_COMMA: 44,
		CHAR_DOT: 46,
		CHAR_DOUBLE_QUOTE: 34,
		CHAR_EQUAL: 61,
		CHAR_EXCLAMATION_MARK: 33,
		CHAR_FORM_FEED: 12,
		CHAR_FORWARD_SLASH: 47,
		CHAR_GRAVE_ACCENT: 96,
		CHAR_HASH: 35,
		CHAR_HYPHEN_MINUS: 45,
		CHAR_LEFT_ANGLE_BRACKET: 60,
		CHAR_LEFT_CURLY_BRACE: 123,
		CHAR_LEFT_SQUARE_BRACKET: 91,
		CHAR_LINE_FEED: 10,
		CHAR_NO_BREAK_SPACE: 160,
		CHAR_PERCENT: 37,
		CHAR_PLUS: 43,
		CHAR_QUESTION_MARK: 63,
		CHAR_RIGHT_ANGLE_BRACKET: 62,
		CHAR_RIGHT_CURLY_BRACE: 125,
		CHAR_RIGHT_SQUARE_BRACKET: 93,
		CHAR_SEMICOLON: 59,
		CHAR_SINGLE_QUOTE: 39,
		CHAR_SPACE: 32,
		CHAR_TAB: 9,
		CHAR_UNDERSCORE: 95,
		CHAR_VERTICAL_LINE: 124,
		CHAR_ZERO_WIDTH_NOBREAK_SPACE: 65279,
		SEP: path$7.sep,
		/**
		* Create EXTGLOB_CHARS
		*/
		extglobChars(chars) {
			return {
				"!": {
					type: "negate",
					open: "(?:(?!(?:",
					close: `))${chars.STAR})`
				},
				"?": {
					type: "qmark",
					open: "(?:",
					close: ")?"
				},
				"+": {
					type: "plus",
					open: "(?:",
					close: ")+"
				},
				"*": {
					type: "star",
					open: "(?:",
					close: ")*"
				},
				"@": {
					type: "at",
					open: "(?:",
					close: ")"
				}
			};
		},
		/**
		* Create GLOB_CHARS
		*/
		globChars(win32) {
			return win32 === true ? WINDOWS_CHARS : POSIX_CHARS;
		}
	};
}));
//#endregion
//#region node_modules/micromatch/node_modules/picomatch/lib/utils.js
var require_utils$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	var path$6 = __require("path");
	var win32 = process.platform === "win32";
	var { REGEX_BACKSLASH, REGEX_REMOVE_BACKSLASH, REGEX_SPECIAL_CHARS, REGEX_SPECIAL_CHARS_GLOBAL } = require_constants();
	exports.isObject = (val) => val !== null && typeof val === "object" && !Array.isArray(val);
	exports.hasRegexChars = (str) => REGEX_SPECIAL_CHARS.test(str);
	exports.isRegexChar = (str) => str.length === 1 && exports.hasRegexChars(str);
	exports.escapeRegex = (str) => str.replace(REGEX_SPECIAL_CHARS_GLOBAL, "\\$1");
	exports.toPosixSlashes = (str) => str.replace(REGEX_BACKSLASH, "/");
	exports.removeBackslashes = (str) => {
		return str.replace(REGEX_REMOVE_BACKSLASH, (match) => {
			return match === "\\" ? "" : match;
		});
	};
	exports.supportsLookbehinds = () => {
		const segs = process.version.slice(1).split(".").map(Number);
		if (segs.length === 3 && segs[0] >= 9 || segs[0] === 8 && segs[1] >= 10) return true;
		return false;
	};
	exports.isWindows = (options) => {
		if (options && typeof options.windows === "boolean") return options.windows;
		return win32 === true || path$6.sep === "\\";
	};
	exports.escapeLast = (input, char, lastIdx) => {
		const idx = input.lastIndexOf(char, lastIdx);
		if (idx === -1) return input;
		if (input[idx - 1] === "\\") return exports.escapeLast(input, char, idx - 1);
		return `${input.slice(0, idx)}\\${input.slice(idx)}`;
	};
	exports.removePrefix = (input, state = {}) => {
		let output = input;
		if (output.startsWith("./")) {
			output = output.slice(2);
			state.prefix = "./";
		}
		return output;
	};
	exports.wrapOutput = (input, state = {}, options = {}) => {
		let output = `${options.contains ? "" : "^"}(?:${input})${options.contains ? "" : "$"}`;
		if (state.negated === true) output = `(?:^(?!${output}).*$)`;
		return output;
	};
}));
//#endregion
//#region node_modules/micromatch/node_modules/picomatch/lib/scan.js
var require_scan = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var utils = require_utils$1();
	var { CHAR_ASTERISK, CHAR_AT, CHAR_BACKWARD_SLASH, CHAR_COMMA, CHAR_DOT, CHAR_EXCLAMATION_MARK, CHAR_FORWARD_SLASH, CHAR_LEFT_CURLY_BRACE, CHAR_LEFT_PARENTHESES, CHAR_LEFT_SQUARE_BRACKET, CHAR_PLUS, CHAR_QUESTION_MARK, CHAR_RIGHT_CURLY_BRACE, CHAR_RIGHT_PARENTHESES, CHAR_RIGHT_SQUARE_BRACKET } = require_constants();
	var isPathSeparator = (code) => {
		return code === CHAR_FORWARD_SLASH || code === CHAR_BACKWARD_SLASH;
	};
	var depth = (token) => {
		if (token.isPrefix !== true) token.depth = token.isGlobstar ? Infinity : 1;
	};
	/**
	* Quickly scans a glob pattern and returns an object with a handful of
	* useful properties, like `isGlob`, `path` (the leading non-glob, if it exists),
	* `glob` (the actual pattern), `negated` (true if the path starts with `!` but not
	* with `!(`) and `negatedExtglob` (true if the path starts with `!(`).
	*
	* ```js
	* const pm = require('picomatch');
	* console.log(pm.scan('foo/bar/*.js'));
	* { isGlob: true, input: 'foo/bar/*.js', base: 'foo/bar', glob: '*.js' }
	* ```
	* @param {String} `str`
	* @param {Object} `options`
	* @return {Object} Returns an object with tokens and regex source string.
	* @api public
	*/
	var scan = (input, options) => {
		const opts = options || {};
		const length = input.length - 1;
		const scanToEnd = opts.parts === true || opts.scanToEnd === true;
		const slashes = [];
		const tokens = [];
		const parts = [];
		let str = input;
		let index = -1;
		let start = 0;
		let lastIndex = 0;
		let isBrace = false;
		let isBracket = false;
		let isGlob = false;
		let isExtglob = false;
		let isGlobstar = false;
		let braceEscaped = false;
		let backslashes = false;
		let negated = false;
		let negatedExtglob = false;
		let finished = false;
		let braces = 0;
		let prev;
		let code;
		let token = {
			value: "",
			depth: 0,
			isGlob: false
		};
		const eos = () => index >= length;
		const peek = () => str.charCodeAt(index + 1);
		const advance = () => {
			prev = code;
			return str.charCodeAt(++index);
		};
		while (index < length) {
			code = advance();
			let next;
			if (code === CHAR_BACKWARD_SLASH) {
				backslashes = token.backslashes = true;
				code = advance();
				if (code === CHAR_LEFT_CURLY_BRACE) braceEscaped = true;
				continue;
			}
			if (braceEscaped === true || code === CHAR_LEFT_CURLY_BRACE) {
				braces++;
				while (eos() !== true && (code = advance())) {
					if (code === CHAR_BACKWARD_SLASH) {
						backslashes = token.backslashes = true;
						advance();
						continue;
					}
					if (code === CHAR_LEFT_CURLY_BRACE) {
						braces++;
						continue;
					}
					if (braceEscaped !== true && code === CHAR_DOT && (code = advance()) === CHAR_DOT) {
						isBrace = token.isBrace = true;
						isGlob = token.isGlob = true;
						finished = true;
						if (scanToEnd === true) continue;
						break;
					}
					if (braceEscaped !== true && code === CHAR_COMMA) {
						isBrace = token.isBrace = true;
						isGlob = token.isGlob = true;
						finished = true;
						if (scanToEnd === true) continue;
						break;
					}
					if (code === CHAR_RIGHT_CURLY_BRACE) {
						braces--;
						if (braces === 0) {
							braceEscaped = false;
							isBrace = token.isBrace = true;
							finished = true;
							break;
						}
					}
				}
				if (scanToEnd === true) continue;
				break;
			}
			if (code === CHAR_FORWARD_SLASH) {
				slashes.push(index);
				tokens.push(token);
				token = {
					value: "",
					depth: 0,
					isGlob: false
				};
				if (finished === true) continue;
				if (prev === CHAR_DOT && index === start + 1) {
					start += 2;
					continue;
				}
				lastIndex = index + 1;
				continue;
			}
			if (opts.noext !== true) {
				if ((code === CHAR_PLUS || code === CHAR_AT || code === CHAR_ASTERISK || code === CHAR_QUESTION_MARK || code === CHAR_EXCLAMATION_MARK) === true && peek() === CHAR_LEFT_PARENTHESES) {
					isGlob = token.isGlob = true;
					isExtglob = token.isExtglob = true;
					finished = true;
					if (code === CHAR_EXCLAMATION_MARK && index === start) negatedExtglob = true;
					if (scanToEnd === true) {
						while (eos() !== true && (code = advance())) {
							if (code === CHAR_BACKWARD_SLASH) {
								backslashes = token.backslashes = true;
								code = advance();
								continue;
							}
							if (code === CHAR_RIGHT_PARENTHESES) {
								isGlob = token.isGlob = true;
								finished = true;
								break;
							}
						}
						continue;
					}
					break;
				}
			}
			if (code === CHAR_ASTERISK) {
				if (prev === CHAR_ASTERISK) isGlobstar = token.isGlobstar = true;
				isGlob = token.isGlob = true;
				finished = true;
				if (scanToEnd === true) continue;
				break;
			}
			if (code === CHAR_QUESTION_MARK) {
				isGlob = token.isGlob = true;
				finished = true;
				if (scanToEnd === true) continue;
				break;
			}
			if (code === CHAR_LEFT_SQUARE_BRACKET) {
				while (eos() !== true && (next = advance())) {
					if (next === CHAR_BACKWARD_SLASH) {
						backslashes = token.backslashes = true;
						advance();
						continue;
					}
					if (next === CHAR_RIGHT_SQUARE_BRACKET) {
						isBracket = token.isBracket = true;
						isGlob = token.isGlob = true;
						finished = true;
						break;
					}
				}
				if (scanToEnd === true) continue;
				break;
			}
			if (opts.nonegate !== true && code === CHAR_EXCLAMATION_MARK && index === start) {
				negated = token.negated = true;
				start++;
				continue;
			}
			if (opts.noparen !== true && code === CHAR_LEFT_PARENTHESES) {
				isGlob = token.isGlob = true;
				if (scanToEnd === true) {
					while (eos() !== true && (code = advance())) {
						if (code === CHAR_LEFT_PARENTHESES) {
							backslashes = token.backslashes = true;
							code = advance();
							continue;
						}
						if (code === CHAR_RIGHT_PARENTHESES) {
							finished = true;
							break;
						}
					}
					continue;
				}
				break;
			}
			if (isGlob === true) {
				finished = true;
				if (scanToEnd === true) continue;
				break;
			}
		}
		if (opts.noext === true) {
			isExtglob = false;
			isGlob = false;
		}
		let base = str;
		let prefix = "";
		let glob = "";
		if (start > 0) {
			prefix = str.slice(0, start);
			str = str.slice(start);
			lastIndex -= start;
		}
		if (base && isGlob === true && lastIndex > 0) {
			base = str.slice(0, lastIndex);
			glob = str.slice(lastIndex);
		} else if (isGlob === true) {
			base = "";
			glob = str;
		} else base = str;
		if (base && base !== "" && base !== "/" && base !== str) {
			if (isPathSeparator(base.charCodeAt(base.length - 1))) base = base.slice(0, -1);
		}
		if (opts.unescape === true) {
			if (glob) glob = utils.removeBackslashes(glob);
			if (base && backslashes === true) base = utils.removeBackslashes(base);
		}
		const state = {
			prefix,
			input,
			start,
			base,
			glob,
			isBrace,
			isBracket,
			isGlob,
			isExtglob,
			isGlobstar,
			negated,
			negatedExtglob
		};
		if (opts.tokens === true) {
			state.maxDepth = 0;
			if (!isPathSeparator(code)) tokens.push(token);
			state.tokens = tokens;
		}
		if (opts.parts === true || opts.tokens === true) {
			let prevIndex;
			for (let idx = 0; idx < slashes.length; idx++) {
				const n = prevIndex ? prevIndex + 1 : start;
				const i = slashes[idx];
				const value = input.slice(n, i);
				if (opts.tokens) {
					if (idx === 0 && start !== 0) {
						tokens[idx].isPrefix = true;
						tokens[idx].value = prefix;
					} else tokens[idx].value = value;
					depth(tokens[idx]);
					state.maxDepth += tokens[idx].depth;
				}
				if (idx !== 0 || value !== "") parts.push(value);
				prevIndex = i;
			}
			if (prevIndex && prevIndex + 1 < input.length) {
				const value = input.slice(prevIndex + 1);
				parts.push(value);
				if (opts.tokens) {
					tokens[tokens.length - 1].value = value;
					depth(tokens[tokens.length - 1]);
					state.maxDepth += tokens[tokens.length - 1].depth;
				}
			}
			state.slashes = slashes;
			state.parts = parts;
		}
		return state;
	};
	module.exports = scan;
}));
//#endregion
//#region node_modules/micromatch/node_modules/picomatch/lib/parse.js
var require_parse = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var constants = require_constants();
	var utils = require_utils$1();
	/**
	* Constants
	*/
	var { MAX_LENGTH, POSIX_REGEX_SOURCE, REGEX_NON_SPECIAL_CHARS, REGEX_SPECIAL_CHARS_BACKREF, REPLACEMENTS } = constants;
	/**
	* Helpers
	*/
	var expandRange = (args, options) => {
		if (typeof options.expandRange === "function") return options.expandRange(...args, options);
		args.sort();
		const value = `[${args.join("-")}]`;
		try {
			new RegExp(value);
		} catch (ex) {
			return args.map((v) => utils.escapeRegex(v)).join("..");
		}
		return value;
	};
	/**
	* Create the message for a syntax error
	*/
	var syntaxError = (type, char) => {
		return `Missing ${type}: "${char}" - use "\\\\${char}" to match literal characters`;
	};
	var splitTopLevel = (input) => {
		const parts = [];
		let bracket = 0;
		let paren = 0;
		let quote = 0;
		let value = "";
		let escaped = false;
		for (const ch of input) {
			if (escaped === true) {
				value += ch;
				escaped = false;
				continue;
			}
			if (ch === "\\") {
				value += ch;
				escaped = true;
				continue;
			}
			if (ch === "\"") {
				quote = quote === 1 ? 0 : 1;
				value += ch;
				continue;
			}
			if (quote === 0) {
				if (ch === "[") bracket++;
				else if (ch === "]" && bracket > 0) bracket--;
				else if (bracket === 0) {
					if (ch === "(") paren++;
					else if (ch === ")" && paren > 0) paren--;
					else if (ch === "|" && paren === 0) {
						parts.push(value);
						value = "";
						continue;
					}
				}
			}
			value += ch;
		}
		parts.push(value);
		return parts;
	};
	var isPlainBranch = (branch) => {
		let escaped = false;
		for (const ch of branch) {
			if (escaped === true) {
				escaped = false;
				continue;
			}
			if (ch === "\\") {
				escaped = true;
				continue;
			}
			if (/[?*+@!()[\]{}]/.test(ch)) return false;
		}
		return true;
	};
	var normalizeSimpleBranch = (branch) => {
		let value = branch.trim();
		let changed = true;
		while (changed === true) {
			changed = false;
			if (/^@\([^\\()[\]{}|]+\)$/.test(value)) {
				value = value.slice(2, -1);
				changed = true;
			}
		}
		if (!isPlainBranch(value)) return;
		return value.replace(/\\(.)/g, "$1");
	};
	var hasRepeatedCharPrefixOverlap = (branches) => {
		const values = branches.map(normalizeSimpleBranch).filter(Boolean);
		for (let i = 0; i < values.length; i++) for (let j = i + 1; j < values.length; j++) {
			const a = values[i];
			const b = values[j];
			const char = a[0];
			if (!char || a !== char.repeat(a.length) || b !== char.repeat(b.length)) continue;
			if (a === b || a.startsWith(b) || b.startsWith(a)) return true;
		}
		return false;
	};
	var parseRepeatedExtglob = (pattern, requireEnd = true) => {
		if (pattern[0] !== "+" && pattern[0] !== "*" || pattern[1] !== "(") return;
		let bracket = 0;
		let paren = 0;
		let quote = 0;
		let escaped = false;
		for (let i = 1; i < pattern.length; i++) {
			const ch = pattern[i];
			if (escaped === true) {
				escaped = false;
				continue;
			}
			if (ch === "\\") {
				escaped = true;
				continue;
			}
			if (ch === "\"") {
				quote = quote === 1 ? 0 : 1;
				continue;
			}
			if (quote === 1) continue;
			if (ch === "[") {
				bracket++;
				continue;
			}
			if (ch === "]" && bracket > 0) {
				bracket--;
				continue;
			}
			if (bracket > 0) continue;
			if (ch === "(") {
				paren++;
				continue;
			}
			if (ch === ")") {
				paren--;
				if (paren === 0) {
					if (requireEnd === true && i !== pattern.length - 1) return;
					return {
						type: pattern[0],
						body: pattern.slice(2, i),
						end: i
					};
				}
			}
		}
	};
	var getStarExtglobSequenceOutput = (pattern) => {
		let index = 0;
		const chars = [];
		while (index < pattern.length) {
			const match = parseRepeatedExtglob(pattern.slice(index), false);
			if (!match || match.type !== "*") return;
			const branches = splitTopLevel(match.body).map((branch) => branch.trim());
			if (branches.length !== 1) return;
			const branch = normalizeSimpleBranch(branches[0]);
			if (!branch || branch.length !== 1) return;
			chars.push(branch);
			index += match.end + 1;
		}
		if (chars.length < 1) return;
		return `${chars.length === 1 ? utils.escapeRegex(chars[0]) : `[${chars.map((ch) => utils.escapeRegex(ch)).join("")}]`}*`;
	};
	var repeatedExtglobRecursion = (pattern) => {
		let depth = 0;
		let value = pattern.trim();
		let match = parseRepeatedExtglob(value);
		while (match) {
			depth++;
			value = match.body.trim();
			match = parseRepeatedExtglob(value);
		}
		return depth;
	};
	var analyzeRepeatedExtglob = (body, options) => {
		if (options.maxExtglobRecursion === false) return { risky: false };
		const max = typeof options.maxExtglobRecursion === "number" ? options.maxExtglobRecursion : constants.DEFAULT_MAX_EXTGLOB_RECURSION;
		const branches = splitTopLevel(body).map((branch) => branch.trim());
		if (branches.length > 1) {
			if (branches.some((branch) => branch === "") || branches.some((branch) => /^[*?]+$/.test(branch)) || hasRepeatedCharPrefixOverlap(branches)) return { risky: true };
		}
		for (const branch of branches) {
			const safeOutput = getStarExtglobSequenceOutput(branch);
			if (safeOutput) return {
				risky: true,
				safeOutput
			};
			if (repeatedExtglobRecursion(branch) > max) return { risky: true };
		}
		return { risky: false };
	};
	/**
	* Parse the given input string.
	* @param {String} input
	* @param {Object} options
	* @return {Object}
	*/
	var parse = (input, options) => {
		if (typeof input !== "string") throw new TypeError("Expected a string");
		input = REPLACEMENTS[input] || input;
		const opts = { ...options };
		const max = typeof opts.maxLength === "number" ? Math.min(MAX_LENGTH, opts.maxLength) : MAX_LENGTH;
		let len = input.length;
		if (len > max) throw new SyntaxError(`Input length: ${len}, exceeds maximum allowed length: ${max}`);
		const bos = {
			type: "bos",
			value: "",
			output: opts.prepend || ""
		};
		const tokens = [bos];
		const capture = opts.capture ? "" : "?:";
		const win32 = utils.isWindows(options);
		const PLATFORM_CHARS = constants.globChars(win32);
		const EXTGLOB_CHARS = constants.extglobChars(PLATFORM_CHARS);
		const { DOT_LITERAL, PLUS_LITERAL, SLASH_LITERAL, ONE_CHAR, DOTS_SLASH, NO_DOT, NO_DOT_SLASH, NO_DOTS_SLASH, QMARK, QMARK_NO_DOT, STAR, START_ANCHOR } = PLATFORM_CHARS;
		const globstar = (opts) => {
			return `(${capture}(?:(?!${START_ANCHOR}${opts.dot ? DOTS_SLASH : DOT_LITERAL}).)*?)`;
		};
		const nodot = opts.dot ? "" : NO_DOT;
		const qmarkNoDot = opts.dot ? QMARK : QMARK_NO_DOT;
		let star = opts.bash === true ? globstar(opts) : STAR;
		if (opts.capture) star = `(${star})`;
		if (typeof opts.noext === "boolean") opts.noextglob = opts.noext;
		const state = {
			input,
			index: -1,
			start: 0,
			dot: opts.dot === true,
			consumed: "",
			output: "",
			prefix: "",
			backtrack: false,
			negated: false,
			brackets: 0,
			braces: 0,
			parens: 0,
			quotes: 0,
			globstar: false,
			tokens
		};
		input = utils.removePrefix(input, state);
		len = input.length;
		const extglobs = [];
		const braces = [];
		const stack = [];
		let prev = bos;
		let value;
		/**
		* Tokenizing helpers
		*/
		const eos = () => state.index === len - 1;
		const peek = state.peek = (n = 1) => input[state.index + n];
		const advance = state.advance = () => input[++state.index] || "";
		const remaining = () => input.slice(state.index + 1);
		const consume = (value = "", num = 0) => {
			state.consumed += value;
			state.index += num;
		};
		const append = (token) => {
			state.output += token.output != null ? token.output : token.value;
			consume(token.value);
		};
		const negate = () => {
			let count = 1;
			while (peek() === "!" && (peek(2) !== "(" || peek(3) === "?")) {
				advance();
				state.start++;
				count++;
			}
			if (count % 2 === 0) return false;
			state.negated = true;
			state.start++;
			return true;
		};
		const increment = (type) => {
			state[type]++;
			stack.push(type);
		};
		const decrement = (type) => {
			state[type]--;
			stack.pop();
		};
		/**
		* Push tokens onto the tokens array. This helper speeds up
		* tokenizing by 1) helping us avoid backtracking as much as possible,
		* and 2) helping us avoid creating extra tokens when consecutive
		* characters are plain text. This improves performance and simplifies
		* lookbehinds.
		*/
		const push = (tok) => {
			if (prev.type === "globstar") {
				const isBrace = state.braces > 0 && (tok.type === "comma" || tok.type === "brace");
				const isExtglob = tok.extglob === true || extglobs.length && (tok.type === "pipe" || tok.type === "paren");
				if (tok.type !== "slash" && tok.type !== "paren" && !isBrace && !isExtglob) {
					state.output = state.output.slice(0, -prev.output.length);
					prev.type = "star";
					prev.value = "*";
					prev.output = star;
					state.output += prev.output;
				}
			}
			if (extglobs.length && tok.type !== "paren") extglobs[extglobs.length - 1].inner += tok.value;
			if (tok.value || tok.output) append(tok);
			if (prev && prev.type === "text" && tok.type === "text") {
				prev.value += tok.value;
				prev.output = (prev.output || "") + tok.value;
				return;
			}
			tok.prev = prev;
			tokens.push(tok);
			prev = tok;
		};
		const extglobOpen = (type, value) => {
			const token = {
				...EXTGLOB_CHARS[value],
				conditions: 1,
				inner: ""
			};
			token.prev = prev;
			token.parens = state.parens;
			token.output = state.output;
			token.startIndex = state.index;
			token.tokensIndex = tokens.length;
			const output = (opts.capture ? "(" : "") + token.open;
			increment("parens");
			push({
				type,
				value,
				output: state.output ? "" : ONE_CHAR
			});
			push({
				type: "paren",
				extglob: true,
				value: advance(),
				output
			});
			extglobs.push(token);
		};
		const extglobClose = (token) => {
			const literal = input.slice(token.startIndex, state.index + 1);
			const analysis = analyzeRepeatedExtglob(input.slice(token.startIndex + 2, state.index), opts);
			if ((token.type === "plus" || token.type === "star") && analysis.risky) {
				const safeOutput = analysis.safeOutput ? (token.output ? "" : ONE_CHAR) + (opts.capture ? `(${analysis.safeOutput})` : analysis.safeOutput) : void 0;
				const open = tokens[token.tokensIndex];
				open.type = "text";
				open.value = literal;
				open.output = safeOutput || utils.escapeRegex(literal);
				for (let i = token.tokensIndex + 1; i < tokens.length; i++) {
					tokens[i].value = "";
					tokens[i].output = "";
					delete tokens[i].suffix;
				}
				state.output = token.output + open.output;
				state.backtrack = true;
				push({
					type: "paren",
					extglob: true,
					value,
					output: ""
				});
				decrement("parens");
				return;
			}
			let output = token.close + (opts.capture ? ")" : "");
			let rest;
			if (token.type === "negate") {
				let extglobStar = star;
				if (token.inner && token.inner.length > 1 && token.inner.includes("/")) extglobStar = globstar(opts);
				if (extglobStar !== star || eos() || /^\)+$/.test(remaining())) output = token.close = `)$))${extglobStar}`;
				if (token.inner.includes("*") && (rest = remaining()) && /^\.[^\\/.]+$/.test(rest)) output = token.close = `)${parse(rest, {
					...options,
					fastpaths: false
				}).output})${extglobStar})`;
				if (token.prev.type === "bos") state.negatedExtglob = true;
			}
			push({
				type: "paren",
				extglob: true,
				value,
				output
			});
			decrement("parens");
		};
		/**
		* Fast paths
		*/
		if (opts.fastpaths !== false && !/(^[*!]|[/()[\]{}"])/.test(input)) {
			let backslashes = false;
			let output = input.replace(REGEX_SPECIAL_CHARS_BACKREF, (m, esc, chars, first, rest, index) => {
				if (first === "\\") {
					backslashes = true;
					return m;
				}
				if (first === "?") {
					if (esc) return esc + first + (rest ? QMARK.repeat(rest.length) : "");
					if (index === 0) return qmarkNoDot + (rest ? QMARK.repeat(rest.length) : "");
					return QMARK.repeat(chars.length);
				}
				if (first === ".") return DOT_LITERAL.repeat(chars.length);
				if (first === "*") {
					if (esc) return esc + first + (rest ? star : "");
					return star;
				}
				return esc ? m : `\\${m}`;
			});
			if (backslashes === true) if (opts.unescape === true) output = output.replace(/\\/g, "");
			else output = output.replace(/\\+/g, (m) => {
				return m.length % 2 === 0 ? "\\\\" : m ? "\\" : "";
			});
			if (output === input && opts.contains === true) {
				state.output = input;
				return state;
			}
			state.output = utils.wrapOutput(output, state, options);
			return state;
		}
		/**
		* Tokenize input until we reach end-of-string
		*/
		while (!eos()) {
			value = advance();
			if (value === "\0") continue;
			/**
			* Escaped characters
			*/
			if (value === "\\") {
				const next = peek();
				if (next === "/" && opts.bash !== true) continue;
				if (next === "." || next === ";") continue;
				if (!next) {
					value += "\\";
					push({
						type: "text",
						value
					});
					continue;
				}
				const match = /^\\+/.exec(remaining());
				let slashes = 0;
				if (match && match[0].length > 2) {
					slashes = match[0].length;
					state.index += slashes;
					if (slashes % 2 !== 0) value += "\\";
				}
				if (opts.unescape === true) value = advance();
				else value += advance();
				if (state.brackets === 0) {
					push({
						type: "text",
						value
					});
					continue;
				}
			}
			/**
			* If we're inside a regex character class, continue
			* until we reach the closing bracket.
			*/
			if (state.brackets > 0 && (value !== "]" || prev.value === "[" || prev.value === "[^")) {
				if (opts.posix !== false && value === ":") {
					const inner = prev.value.slice(1);
					if (inner.includes("[")) {
						prev.posix = true;
						if (inner.includes(":")) {
							const idx = prev.value.lastIndexOf("[");
							const pre = prev.value.slice(0, idx);
							const posix = POSIX_REGEX_SOURCE[prev.value.slice(idx + 2)];
							if (posix) {
								prev.value = pre + posix;
								state.backtrack = true;
								advance();
								if (!bos.output && tokens.indexOf(prev) === 1) bos.output = ONE_CHAR;
								continue;
							}
						}
					}
				}
				if (value === "[" && peek() !== ":" || value === "-" && peek() === "]") value = `\\${value}`;
				if (value === "]" && (prev.value === "[" || prev.value === "[^")) value = `\\${value}`;
				if (opts.posix === true && value === "!" && prev.value === "[") value = "^";
				prev.value += value;
				append({ value });
				continue;
			}
			/**
			* If we're inside a quoted string, continue
			* until we reach the closing double quote.
			*/
			if (state.quotes === 1 && value !== "\"") {
				value = utils.escapeRegex(value);
				prev.value += value;
				append({ value });
				continue;
			}
			/**
			* Double quotes
			*/
			if (value === "\"") {
				state.quotes = state.quotes === 1 ? 0 : 1;
				if (opts.keepQuotes === true) push({
					type: "text",
					value
				});
				continue;
			}
			/**
			* Parentheses
			*/
			if (value === "(") {
				increment("parens");
				push({
					type: "paren",
					value
				});
				continue;
			}
			if (value === ")") {
				if (state.parens === 0 && opts.strictBrackets === true) throw new SyntaxError(syntaxError("opening", "("));
				const extglob = extglobs[extglobs.length - 1];
				if (extglob && state.parens === extglob.parens + 1) {
					extglobClose(extglobs.pop());
					continue;
				}
				push({
					type: "paren",
					value,
					output: state.parens ? ")" : "\\)"
				});
				decrement("parens");
				continue;
			}
			/**
			* Square brackets
			*/
			if (value === "[") {
				if (opts.nobracket === true || !remaining().includes("]")) {
					if (opts.nobracket !== true && opts.strictBrackets === true) throw new SyntaxError(syntaxError("closing", "]"));
					value = `\\${value}`;
				} else increment("brackets");
				push({
					type: "bracket",
					value
				});
				continue;
			}
			if (value === "]") {
				if (opts.nobracket === true || prev && prev.type === "bracket" && prev.value.length === 1) {
					push({
						type: "text",
						value,
						output: `\\${value}`
					});
					continue;
				}
				if (state.brackets === 0) {
					if (opts.strictBrackets === true) throw new SyntaxError(syntaxError("opening", "["));
					push({
						type: "text",
						value,
						output: `\\${value}`
					});
					continue;
				}
				decrement("brackets");
				const prevValue = prev.value.slice(1);
				if (prev.posix !== true && prevValue[0] === "^" && !prevValue.includes("/")) value = `/${value}`;
				prev.value += value;
				append({ value });
				if (opts.literalBrackets === false || utils.hasRegexChars(prevValue)) continue;
				const escaped = utils.escapeRegex(prev.value);
				state.output = state.output.slice(0, -prev.value.length);
				if (opts.literalBrackets === true) {
					state.output += escaped;
					prev.value = escaped;
					continue;
				}
				prev.value = `(${capture}${escaped}|${prev.value})`;
				state.output += prev.value;
				continue;
			}
			/**
			* Braces
			*/
			if (value === "{" && opts.nobrace !== true) {
				increment("braces");
				const open = {
					type: "brace",
					value,
					output: "(",
					outputIndex: state.output.length,
					tokensIndex: state.tokens.length
				};
				braces.push(open);
				push(open);
				continue;
			}
			if (value === "}") {
				const brace = braces[braces.length - 1];
				if (opts.nobrace === true || !brace) {
					push({
						type: "text",
						value,
						output: value
					});
					continue;
				}
				let output = ")";
				if (brace.dots === true) {
					const arr = tokens.slice();
					const range = [];
					for (let i = arr.length - 1; i >= 0; i--) {
						tokens.pop();
						if (arr[i].type === "brace") break;
						if (arr[i].type !== "dots") range.unshift(arr[i].value);
					}
					output = expandRange(range, opts);
					state.backtrack = true;
				}
				if (brace.comma !== true && brace.dots !== true) {
					const out = state.output.slice(0, brace.outputIndex);
					const toks = state.tokens.slice(brace.tokensIndex);
					brace.value = brace.output = "\\{";
					value = output = "\\}";
					state.output = out;
					for (const t of toks) state.output += t.output || t.value;
				}
				push({
					type: "brace",
					value,
					output
				});
				decrement("braces");
				braces.pop();
				continue;
			}
			/**
			* Pipes
			*/
			if (value === "|") {
				if (extglobs.length > 0) extglobs[extglobs.length - 1].conditions++;
				push({
					type: "text",
					value
				});
				continue;
			}
			/**
			* Commas
			*/
			if (value === ",") {
				let output = value;
				const brace = braces[braces.length - 1];
				if (brace && stack[stack.length - 1] === "braces") {
					brace.comma = true;
					output = "|";
				}
				push({
					type: "comma",
					value,
					output
				});
				continue;
			}
			/**
			* Slashes
			*/
			if (value === "/") {
				if (prev.type === "dot" && state.index === state.start + 1) {
					state.start = state.index + 1;
					state.consumed = "";
					state.output = "";
					tokens.pop();
					prev = bos;
					continue;
				}
				push({
					type: "slash",
					value,
					output: SLASH_LITERAL
				});
				continue;
			}
			/**
			* Dots
			*/
			if (value === ".") {
				if (state.braces > 0 && prev.type === "dot") {
					if (prev.value === ".") prev.output = DOT_LITERAL;
					const brace = braces[braces.length - 1];
					prev.type = "dots";
					prev.output += value;
					prev.value += value;
					brace.dots = true;
					continue;
				}
				if (state.braces + state.parens === 0 && prev.type !== "bos" && prev.type !== "slash") {
					push({
						type: "text",
						value,
						output: DOT_LITERAL
					});
					continue;
				}
				push({
					type: "dot",
					value,
					output: DOT_LITERAL
				});
				continue;
			}
			/**
			* Question marks
			*/
			if (value === "?") {
				if (!(prev && prev.value === "(") && opts.noextglob !== true && peek() === "(" && peek(2) !== "?") {
					extglobOpen("qmark", value);
					continue;
				}
				if (prev && prev.type === "paren") {
					const next = peek();
					let output = value;
					if (next === "<" && !utils.supportsLookbehinds()) throw new Error("Node.js v10 or higher is required for regex lookbehinds");
					if (prev.value === "(" && !/[!=<:]/.test(next) || next === "<" && !/<([!=]|\w+>)/.test(remaining())) output = `\\${value}`;
					push({
						type: "text",
						value,
						output
					});
					continue;
				}
				if (opts.dot !== true && (prev.type === "slash" || prev.type === "bos")) {
					push({
						type: "qmark",
						value,
						output: QMARK_NO_DOT
					});
					continue;
				}
				push({
					type: "qmark",
					value,
					output: QMARK
				});
				continue;
			}
			/**
			* Exclamation
			*/
			if (value === "!") {
				if (opts.noextglob !== true && peek() === "(") {
					if (peek(2) !== "?" || !/[!=<:]/.test(peek(3))) {
						extglobOpen("negate", value);
						continue;
					}
				}
				if (opts.nonegate !== true && state.index === 0) {
					negate();
					continue;
				}
			}
			/**
			* Plus
			*/
			if (value === "+") {
				if (opts.noextglob !== true && peek() === "(" && peek(2) !== "?") {
					extglobOpen("plus", value);
					continue;
				}
				if (prev && prev.value === "(" || opts.regex === false) {
					push({
						type: "plus",
						value,
						output: PLUS_LITERAL
					});
					continue;
				}
				if (prev && (prev.type === "bracket" || prev.type === "paren" || prev.type === "brace") || state.parens > 0) {
					push({
						type: "plus",
						value
					});
					continue;
				}
				push({
					type: "plus",
					value: PLUS_LITERAL
				});
				continue;
			}
			/**
			* Plain text
			*/
			if (value === "@") {
				if (opts.noextglob !== true && peek() === "(" && peek(2) !== "?") {
					push({
						type: "at",
						extglob: true,
						value,
						output: ""
					});
					continue;
				}
				push({
					type: "text",
					value
				});
				continue;
			}
			/**
			* Plain text
			*/
			if (value !== "*") {
				if (value === "$" || value === "^") value = `\\${value}`;
				const match = REGEX_NON_SPECIAL_CHARS.exec(remaining());
				if (match) {
					value += match[0];
					state.index += match[0].length;
				}
				push({
					type: "text",
					value
				});
				continue;
			}
			/**
			* Stars
			*/
			if (prev && (prev.type === "globstar" || prev.star === true)) {
				prev.type = "star";
				prev.star = true;
				prev.value += value;
				prev.output = star;
				state.backtrack = true;
				state.globstar = true;
				consume(value);
				continue;
			}
			let rest = remaining();
			if (opts.noextglob !== true && /^\([^?]/.test(rest)) {
				extglobOpen("star", value);
				continue;
			}
			if (prev.type === "star") {
				if (opts.noglobstar === true) {
					consume(value);
					continue;
				}
				const prior = prev.prev;
				const before = prior.prev;
				const isStart = prior.type === "slash" || prior.type === "bos";
				const afterStar = before && (before.type === "star" || before.type === "globstar");
				if (opts.bash === true && (!isStart || rest[0] && rest[0] !== "/")) {
					push({
						type: "star",
						value,
						output: ""
					});
					continue;
				}
				const isBrace = state.braces > 0 && (prior.type === "comma" || prior.type === "brace");
				const isExtglob = extglobs.length && (prior.type === "pipe" || prior.type === "paren");
				if (!isStart && prior.type !== "paren" && !isBrace && !isExtglob) {
					push({
						type: "star",
						value,
						output: ""
					});
					continue;
				}
				while (rest.slice(0, 3) === "/**") {
					const after = input[state.index + 4];
					if (after && after !== "/") break;
					rest = rest.slice(3);
					consume("/**", 3);
				}
				if (prior.type === "bos" && eos()) {
					prev.type = "globstar";
					prev.value += value;
					prev.output = globstar(opts);
					state.output = prev.output;
					state.globstar = true;
					consume(value);
					continue;
				}
				if (prior.type === "slash" && prior.prev.type !== "bos" && !afterStar && eos()) {
					state.output = state.output.slice(0, -(prior.output + prev.output).length);
					prior.output = `(?:${prior.output}`;
					prev.type = "globstar";
					prev.output = globstar(opts) + (opts.strictSlashes ? ")" : "|$)");
					prev.value += value;
					state.globstar = true;
					state.output += prior.output + prev.output;
					consume(value);
					continue;
				}
				if (prior.type === "slash" && prior.prev.type !== "bos" && rest[0] === "/") {
					const end = rest[1] !== void 0 ? "|$" : "";
					state.output = state.output.slice(0, -(prior.output + prev.output).length);
					prior.output = `(?:${prior.output}`;
					prev.type = "globstar";
					prev.output = `${globstar(opts)}${SLASH_LITERAL}|${SLASH_LITERAL}${end})`;
					prev.value += value;
					state.output += prior.output + prev.output;
					state.globstar = true;
					consume(value + advance());
					push({
						type: "slash",
						value: "/",
						output: ""
					});
					continue;
				}
				if (prior.type === "bos" && rest[0] === "/") {
					prev.type = "globstar";
					prev.value += value;
					prev.output = `(?:^|${SLASH_LITERAL}|${globstar(opts)}${SLASH_LITERAL})`;
					state.output = prev.output;
					state.globstar = true;
					consume(value + advance());
					push({
						type: "slash",
						value: "/",
						output: ""
					});
					continue;
				}
				state.output = state.output.slice(0, -prev.output.length);
				prev.type = "globstar";
				prev.output = globstar(opts);
				prev.value += value;
				state.output += prev.output;
				state.globstar = true;
				consume(value);
				continue;
			}
			const token = {
				type: "star",
				value,
				output: star
			};
			if (opts.bash === true) {
				token.output = ".*?";
				if (prev.type === "bos" || prev.type === "slash") token.output = nodot + token.output;
				push(token);
				continue;
			}
			if (prev && (prev.type === "bracket" || prev.type === "paren") && opts.regex === true) {
				token.output = value;
				push(token);
				continue;
			}
			if (state.index === state.start || prev.type === "slash" || prev.type === "dot") {
				if (prev.type === "dot") {
					state.output += NO_DOT_SLASH;
					prev.output += NO_DOT_SLASH;
				} else if (opts.dot === true) {
					state.output += NO_DOTS_SLASH;
					prev.output += NO_DOTS_SLASH;
				} else {
					state.output += nodot;
					prev.output += nodot;
				}
				if (peek() !== "*") {
					state.output += ONE_CHAR;
					prev.output += ONE_CHAR;
				}
			}
			push(token);
		}
		while (state.brackets > 0) {
			if (opts.strictBrackets === true) throw new SyntaxError(syntaxError("closing", "]"));
			state.output = utils.escapeLast(state.output, "[");
			decrement("brackets");
		}
		while (state.parens > 0) {
			if (opts.strictBrackets === true) throw new SyntaxError(syntaxError("closing", ")"));
			state.output = utils.escapeLast(state.output, "(");
			decrement("parens");
		}
		while (state.braces > 0) {
			if (opts.strictBrackets === true) throw new SyntaxError(syntaxError("closing", "}"));
			state.output = utils.escapeLast(state.output, "{");
			decrement("braces");
		}
		if (opts.strictSlashes !== true && (prev.type === "star" || prev.type === "bracket")) push({
			type: "maybe_slash",
			value: "",
			output: `${SLASH_LITERAL}?`
		});
		if (state.backtrack === true) {
			state.output = "";
			for (const token of state.tokens) {
				state.output += token.output != null ? token.output : token.value;
				if (token.suffix) state.output += token.suffix;
			}
		}
		return state;
	};
	/**
	* Fast paths for creating regular expressions for common glob patterns.
	* This can significantly speed up processing and has very little downside
	* impact when none of the fast paths match.
	*/
	parse.fastpaths = (input, options) => {
		const opts = { ...options };
		const max = typeof opts.maxLength === "number" ? Math.min(MAX_LENGTH, opts.maxLength) : MAX_LENGTH;
		const len = input.length;
		if (len > max) throw new SyntaxError(`Input length: ${len}, exceeds maximum allowed length: ${max}`);
		input = REPLACEMENTS[input] || input;
		const win32 = utils.isWindows(options);
		const { DOT_LITERAL, SLASH_LITERAL, ONE_CHAR, DOTS_SLASH, NO_DOT, NO_DOTS, NO_DOTS_SLASH, STAR, START_ANCHOR } = constants.globChars(win32);
		const nodot = opts.dot ? NO_DOTS : NO_DOT;
		const slashDot = opts.dot ? NO_DOTS_SLASH : NO_DOT;
		const capture = opts.capture ? "" : "?:";
		const state = {
			negated: false,
			prefix: ""
		};
		let star = opts.bash === true ? ".*?" : STAR;
		if (opts.capture) star = `(${star})`;
		const globstar = (opts) => {
			if (opts.noglobstar === true) return star;
			return `(${capture}(?:(?!${START_ANCHOR}${opts.dot ? DOTS_SLASH : DOT_LITERAL}).)*?)`;
		};
		const create = (str) => {
			switch (str) {
				case "*": return `${nodot}${ONE_CHAR}${star}`;
				case ".*": return `${DOT_LITERAL}${ONE_CHAR}${star}`;
				case "*.*": return `${nodot}${star}${DOT_LITERAL}${ONE_CHAR}${star}`;
				case "*/*": return `${nodot}${star}${SLASH_LITERAL}${ONE_CHAR}${slashDot}${star}`;
				case "**": return nodot + globstar(opts);
				case "**/*": return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${slashDot}${ONE_CHAR}${star}`;
				case "**/*.*": return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${slashDot}${star}${DOT_LITERAL}${ONE_CHAR}${star}`;
				case "**/.*": return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${DOT_LITERAL}${ONE_CHAR}${star}`;
				default: {
					const match = /^(.*?)\.(\w+)$/.exec(str);
					if (!match) return;
					const source = create(match[1]);
					if (!source) return;
					return source + DOT_LITERAL + match[2];
				}
			}
		};
		let source = create(utils.removePrefix(input, state));
		if (source && opts.strictSlashes !== true) source += `${SLASH_LITERAL}?`;
		return source;
	};
	module.exports = parse;
}));
//#endregion
//#region node_modules/micromatch/node_modules/picomatch/lib/picomatch.js
var require_picomatch$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var path$5 = __require("path");
	var scan = require_scan();
	var parse = require_parse();
	var utils = require_utils$1();
	var constants = require_constants();
	var isObject = (val) => val && typeof val === "object" && !Array.isArray(val);
	/**
	* Creates a matcher function from one or more glob patterns. The
	* returned function takes a string to match as its first argument,
	* and returns true if the string is a match. The returned matcher
	* function also takes a boolean as the second argument that, when true,
	* returns an object with additional information.
	*
	* ```js
	* const picomatch = require('picomatch');
	* // picomatch(glob[, options]);
	*
	* const isMatch = picomatch('*.!(*a)');
	* console.log(isMatch('a.a')); //=> false
	* console.log(isMatch('a.b')); //=> true
	* ```
	* @name picomatch
	* @param {String|Array} `globs` One or more glob patterns.
	* @param {Object=} `options`
	* @return {Function=} Returns a matcher function.
	* @api public
	*/
	var picomatch = (glob, options, returnState = false) => {
		if (Array.isArray(glob)) {
			const fns = glob.map((input) => picomatch(input, options, returnState));
			const arrayMatcher = (str) => {
				for (const isMatch of fns) {
					const state = isMatch(str);
					if (state) return state;
				}
				return false;
			};
			return arrayMatcher;
		}
		const isState = isObject(glob) && glob.tokens && glob.input;
		if (glob === "" || typeof glob !== "string" && !isState) throw new TypeError("Expected pattern to be a non-empty string");
		const opts = options || {};
		const posix = utils.isWindows(options);
		const regex = isState ? picomatch.compileRe(glob, options) : picomatch.makeRe(glob, options, false, true);
		const state = regex.state;
		delete regex.state;
		let isIgnored = () => false;
		if (opts.ignore) {
			const ignoreOpts = {
				...options,
				ignore: null,
				onMatch: null,
				onResult: null
			};
			isIgnored = picomatch(opts.ignore, ignoreOpts, returnState);
		}
		const matcher = (input, returnObject = false) => {
			const { isMatch, match, output } = picomatch.test(input, regex, options, {
				glob,
				posix
			});
			const result = {
				glob,
				state,
				regex,
				posix,
				input,
				output,
				match,
				isMatch
			};
			if (typeof opts.onResult === "function") opts.onResult(result);
			if (isMatch === false) {
				result.isMatch = false;
				return returnObject ? result : false;
			}
			if (isIgnored(input)) {
				if (typeof opts.onIgnore === "function") opts.onIgnore(result);
				result.isMatch = false;
				return returnObject ? result : false;
			}
			if (typeof opts.onMatch === "function") opts.onMatch(result);
			return returnObject ? result : true;
		};
		if (returnState) matcher.state = state;
		return matcher;
	};
	/**
	* Test `input` with the given `regex`. This is used by the main
	* `picomatch()` function to test the input string.
	*
	* ```js
	* const picomatch = require('picomatch');
	* // picomatch.test(input, regex[, options]);
	*
	* console.log(picomatch.test('foo/bar', /^(?:([^/]*?)\/([^/]*?))$/));
	* // { isMatch: true, match: [ 'foo/', 'foo', 'bar' ], output: 'foo/bar' }
	* ```
	* @param {String} `input` String to test.
	* @param {RegExp} `regex`
	* @return {Object} Returns an object with matching info.
	* @api public
	*/
	picomatch.test = (input, regex, options, { glob, posix } = {}) => {
		if (typeof input !== "string") throw new TypeError("Expected input to be a string");
		if (input === "") return {
			isMatch: false,
			output: ""
		};
		const opts = options || {};
		const format = opts.format || (posix ? utils.toPosixSlashes : null);
		let match = input === glob;
		let output = match && format ? format(input) : input;
		if (match === false) {
			output = format ? format(input) : input;
			match = output === glob;
		}
		if (match === false || opts.capture === true) if (opts.matchBase === true || opts.basename === true) match = picomatch.matchBase(input, regex, options, posix);
		else match = regex.exec(output);
		return {
			isMatch: Boolean(match),
			match,
			output
		};
	};
	/**
	* Match the basename of a filepath.
	*
	* ```js
	* const picomatch = require('picomatch');
	* // picomatch.matchBase(input, glob[, options]);
	* console.log(picomatch.matchBase('foo/bar.js', '*.js'); // true
	* ```
	* @param {String} `input` String to test.
	* @param {RegExp|String} `glob` Glob pattern or regex created by [.makeRe](#makeRe).
	* @return {Boolean}
	* @api public
	*/
	picomatch.matchBase = (input, glob, options, posix = utils.isWindows(options)) => {
		return (glob instanceof RegExp ? glob : picomatch.makeRe(glob, options)).test(path$5.basename(input));
	};
	/**
	* Returns true if **any** of the given glob `patterns` match the specified `string`.
	*
	* ```js
	* const picomatch = require('picomatch');
	* // picomatch.isMatch(string, patterns[, options]);
	*
	* console.log(picomatch.isMatch('a.a', ['b.*', '*.a'])); //=> true
	* console.log(picomatch.isMatch('a.a', 'b.*')); //=> false
	* ```
	* @param {String|Array} str The string to test.
	* @param {String|Array} patterns One or more glob patterns to use for matching.
	* @param {Object} [options] See available [options](#options).
	* @return {Boolean} Returns true if any patterns match `str`
	* @api public
	*/
	picomatch.isMatch = (str, patterns, options) => picomatch(patterns, options)(str);
	/**
	* Parse a glob pattern to create the source string for a regular
	* expression.
	*
	* ```js
	* const picomatch = require('picomatch');
	* const result = picomatch.parse(pattern[, options]);
	* ```
	* @param {String} `pattern`
	* @param {Object} `options`
	* @return {Object} Returns an object with useful properties and output to be used as a regex source string.
	* @api public
	*/
	picomatch.parse = (pattern, options) => {
		if (Array.isArray(pattern)) return pattern.map((p) => picomatch.parse(p, options));
		return parse(pattern, {
			...options,
			fastpaths: false
		});
	};
	/**
	* Scan a glob pattern to separate the pattern into segments.
	*
	* ```js
	* const picomatch = require('picomatch');
	* // picomatch.scan(input[, options]);
	*
	* const result = picomatch.scan('!./foo/*.js');
	* console.log(result);
	* { prefix: '!./',
	*   input: '!./foo/*.js',
	*   start: 3,
	*   base: 'foo',
	*   glob: '*.js',
	*   isBrace: false,
	*   isBracket: false,
	*   isGlob: true,
	*   isExtglob: false,
	*   isGlobstar: false,
	*   negated: true }
	* ```
	* @param {String} `input` Glob pattern to scan.
	* @param {Object} `options`
	* @return {Object} Returns an object with
	* @api public
	*/
	picomatch.scan = (input, options) => scan(input, options);
	/**
	* Compile a regular expression from the `state` object returned by the
	* [parse()](#parse) method.
	*
	* @param {Object} `state`
	* @param {Object} `options`
	* @param {Boolean} `returnOutput` Intended for implementors, this argument allows you to return the raw output from the parser.
	* @param {Boolean} `returnState` Adds the state to a `state` property on the returned regex. Useful for implementors and debugging.
	* @return {RegExp}
	* @api public
	*/
	picomatch.compileRe = (state, options, returnOutput = false, returnState = false) => {
		if (returnOutput === true) return state.output;
		const opts = options || {};
		const prepend = opts.contains ? "" : "^";
		const append = opts.contains ? "" : "$";
		let source = `${prepend}(?:${state.output})${append}`;
		if (state && state.negated === true) source = `^(?!${source}).*$`;
		const regex = picomatch.toRegex(source, options);
		if (returnState === true) regex.state = state;
		return regex;
	};
	/**
	* Create a regular expression from a parsed glob pattern.
	*
	* ```js
	* const picomatch = require('picomatch');
	* const state = picomatch.parse('*.js');
	* // picomatch.compileRe(state[, options]);
	*
	* console.log(picomatch.compileRe(state));
	* //=> /^(?:(?!\.)(?=.)[^/]*?\.js)$/
	* ```
	* @param {String} `state` The object returned from the `.parse` method.
	* @param {Object} `options`
	* @param {Boolean} `returnOutput` Implementors may use this argument to return the compiled output, instead of a regular expression. This is not exposed on the options to prevent end-users from mutating the result.
	* @param {Boolean} `returnState` Implementors may use this argument to return the state from the parsed glob with the returned regular expression.
	* @return {RegExp} Returns a regex created from the given pattern.
	* @api public
	*/
	picomatch.makeRe = (input, options = {}, returnOutput = false, returnState = false) => {
		if (!input || typeof input !== "string") throw new TypeError("Expected a non-empty string");
		let parsed = {
			negated: false,
			fastpaths: true
		};
		if (options.fastpaths !== false && (input[0] === "." || input[0] === "*")) parsed.output = parse.fastpaths(input, options);
		if (!parsed.output) parsed = parse(input, options);
		return picomatch.compileRe(parsed, options, returnOutput, returnState);
	};
	/**
	* Create a regular expression from the given regex source string.
	*
	* ```js
	* const picomatch = require('picomatch');
	* // picomatch.toRegex(source[, options]);
	*
	* const { output } = picomatch.parse('*.js');
	* console.log(picomatch.toRegex(output));
	* //=> /^(?:(?!\.)(?=.)[^/]*?\.js)$/
	* ```
	* @param {String} `source` Regular expression source string.
	* @param {Object} `options`
	* @return {RegExp}
	* @api public
	*/
	picomatch.toRegex = (source, options) => {
		try {
			const opts = options || {};
			return new RegExp(source, opts.flags || (opts.nocase ? "i" : ""));
		} catch (err) {
			if (options && options.debug === true) throw err;
			return /$^/;
		}
	};
	/**
	* Picomatch constants.
	* @return {Object}
	*/
	picomatch.constants = constants;
	/**
	* Expose "picomatch"
	*/
	module.exports = picomatch;
}));
//#endregion
//#region node_modules/micromatch/node_modules/picomatch/index.js
var require_picomatch = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = require_picomatch$1();
}));
//#endregion
//#region node_modules/micromatch/index.js
var require_micromatch = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var util = __require("util");
	var braces = require_braces();
	var picomatch = require_picomatch();
	var utils = require_utils$1();
	var isEmptyString = (v) => v === "" || v === "./";
	var hasBraces = (v) => {
		const index = v.indexOf("{");
		return index > -1 && v.indexOf("}", index) > -1;
	};
	/**
	* Returns an array of strings that match one or more glob patterns.
	*
	* ```js
	* const mm = require('micromatch');
	* // mm(list, patterns[, options]);
	*
	* console.log(mm(['a.js', 'a.txt'], ['*.js']));
	* //=> [ 'a.js' ]
	* ```
	* @param {String|Array<string>} `list` List of strings to match.
	* @param {String|Array<string>} `patterns` One or more glob patterns to use for matching.
	* @param {Object} `options` See available [options](#options)
	* @return {Array} Returns an array of matches
	* @summary false
	* @api public
	*/
	var micromatch = (list, patterns, options) => {
		patterns = [].concat(patterns);
		list = [].concat(list);
		let omit = /* @__PURE__ */ new Set();
		let keep = /* @__PURE__ */ new Set();
		let items = /* @__PURE__ */ new Set();
		let negatives = 0;
		let onResult = (state) => {
			items.add(state.output);
			if (options && options.onResult) options.onResult(state);
		};
		for (let i = 0; i < patterns.length; i++) {
			let isMatch = picomatch(String(patterns[i]), {
				...options,
				onResult
			}, true);
			let negated = isMatch.state.negated || isMatch.state.negatedExtglob;
			if (negated) negatives++;
			for (let item of list) {
				let matched = isMatch(item, true);
				if (!(negated ? !matched.isMatch : matched.isMatch)) continue;
				if (negated) omit.add(matched.output);
				else {
					omit.delete(matched.output);
					keep.add(matched.output);
				}
			}
		}
		let matches = (negatives === patterns.length ? [...items] : [...keep]).filter((item) => !omit.has(item));
		if (options && matches.length === 0) {
			if (options.failglob === true) throw new Error(`No matches found for "${patterns.join(", ")}"`);
			if (options.nonull === true || options.nullglob === true) return options.unescape ? patterns.map((p) => p.replace(/\\/g, "")) : patterns;
		}
		return matches;
	};
	/**
	* Backwards compatibility
	*/
	micromatch.match = micromatch;
	/**
	* Returns a matcher function from the given glob `pattern` and `options`.
	* The returned function takes a string to match as its only argument and returns
	* true if the string is a match.
	*
	* ```js
	* const mm = require('micromatch');
	* // mm.matcher(pattern[, options]);
	*
	* const isMatch = mm.matcher('*.!(*a)');
	* console.log(isMatch('a.a')); //=> false
	* console.log(isMatch('a.b')); //=> true
	* ```
	* @param {String} `pattern` Glob pattern
	* @param {Object} `options`
	* @return {Function} Returns a matcher function.
	* @api public
	*/
	micromatch.matcher = (pattern, options) => picomatch(pattern, options);
	/**
	* Returns true if **any** of the given glob `patterns` match the specified `string`.
	*
	* ```js
	* const mm = require('micromatch');
	* // mm.isMatch(string, patterns[, options]);
	*
	* console.log(mm.isMatch('a.a', ['b.*', '*.a'])); //=> true
	* console.log(mm.isMatch('a.a', 'b.*')); //=> false
	* ```
	* @param {String} `str` The string to test.
	* @param {String|Array} `patterns` One or more glob patterns to use for matching.
	* @param {Object} `[options]` See available [options](#options).
	* @return {Boolean} Returns true if any patterns match `str`
	* @api public
	*/
	micromatch.isMatch = (str, patterns, options) => picomatch(patterns, options)(str);
	/**
	* Backwards compatibility
	*/
	micromatch.any = micromatch.isMatch;
	/**
	* Returns a list of strings that _**do not match any**_ of the given `patterns`.
	*
	* ```js
	* const mm = require('micromatch');
	* // mm.not(list, patterns[, options]);
	*
	* console.log(mm.not(['a.a', 'b.b', 'c.c'], '*.a'));
	* //=> ['b.b', 'c.c']
	* ```
	* @param {Array} `list` Array of strings to match.
	* @param {String|Array} `patterns` One or more glob pattern to use for matching.
	* @param {Object} `options` See available [options](#options) for changing how matches are performed
	* @return {Array} Returns an array of strings that **do not match** the given patterns.
	* @api public
	*/
	micromatch.not = (list, patterns, options = {}) => {
		patterns = [].concat(patterns).map(String);
		let result = /* @__PURE__ */ new Set();
		let items = [];
		let onResult = (state) => {
			if (options.onResult) options.onResult(state);
			items.push(state.output);
		};
		let matches = new Set(micromatch(list, patterns, {
			...options,
			onResult
		}));
		for (let item of items) if (!matches.has(item)) result.add(item);
		return [...result];
	};
	/**
	* Returns true if the given `string` contains the given pattern. Similar
	* to [.isMatch](#isMatch) but the pattern can match any part of the string.
	*
	* ```js
	* var mm = require('micromatch');
	* // mm.contains(string, pattern[, options]);
	*
	* console.log(mm.contains('aa/bb/cc', '*b'));
	* //=> true
	* console.log(mm.contains('aa/bb/cc', '*d'));
	* //=> false
	* ```
	* @param {String} `str` The string to match.
	* @param {String|Array} `patterns` Glob pattern to use for matching.
	* @param {Object} `options` See available [options](#options) for changing how matches are performed
	* @return {Boolean} Returns true if any of the patterns matches any part of `str`.
	* @api public
	*/
	micromatch.contains = (str, pattern, options) => {
		if (typeof str !== "string") throw new TypeError(`Expected a string: "${util.inspect(str)}"`);
		if (Array.isArray(pattern)) return pattern.some((p) => micromatch.contains(str, p, options));
		if (typeof pattern === "string") {
			if (isEmptyString(str) || isEmptyString(pattern)) return false;
			if (str.includes(pattern) || str.startsWith("./") && str.slice(2).includes(pattern)) return true;
		}
		return micromatch.isMatch(str, pattern, {
			...options,
			contains: true
		});
	};
	/**
	* Filter the keys of the given object with the given `glob` pattern
	* and `options`. Does not attempt to match nested keys. If you need this feature,
	* use [glob-object][] instead.
	*
	* ```js
	* const mm = require('micromatch');
	* // mm.matchKeys(object, patterns[, options]);
	*
	* const obj = { aa: 'a', ab: 'b', ac: 'c' };
	* console.log(mm.matchKeys(obj, '*b'));
	* //=> { ab: 'b' }
	* ```
	* @param {Object} `object` The object with keys to filter.
	* @param {String|Array} `patterns` One or more glob patterns to use for matching.
	* @param {Object} `options` See available [options](#options) for changing how matches are performed
	* @return {Object} Returns an object with only keys that match the given patterns.
	* @api public
	*/
	micromatch.matchKeys = (obj, patterns, options) => {
		if (!utils.isObject(obj)) throw new TypeError("Expected the first argument to be an object");
		let keys = micromatch(Object.keys(obj), patterns, options);
		let res = {};
		for (let key of keys) res[key] = obj[key];
		return res;
	};
	/**
	* Returns true if some of the strings in the given `list` match any of the given glob `patterns`.
	*
	* ```js
	* const mm = require('micromatch');
	* // mm.some(list, patterns[, options]);
	*
	* console.log(mm.some(['foo.js', 'bar.js'], ['*.js', '!foo.js']));
	* // true
	* console.log(mm.some(['foo.js'], ['*.js', '!foo.js']));
	* // false
	* ```
	* @param {String|Array} `list` The string or array of strings to test. Returns as soon as the first match is found.
	* @param {String|Array} `patterns` One or more glob patterns to use for matching.
	* @param {Object} `options` See available [options](#options) for changing how matches are performed
	* @return {Boolean} Returns true if any `patterns` matches any of the strings in `list`
	* @api public
	*/
	micromatch.some = (list, patterns, options) => {
		let items = [].concat(list);
		for (let pattern of [].concat(patterns)) {
			let isMatch = picomatch(String(pattern), options);
			if (items.some((item) => isMatch(item))) return true;
		}
		return false;
	};
	/**
	* Returns true if every string in the given `list` matches
	* any of the given glob `patterns`.
	*
	* ```js
	* const mm = require('micromatch');
	* // mm.every(list, patterns[, options]);
	*
	* console.log(mm.every('foo.js', ['foo.js']));
	* // true
	* console.log(mm.every(['foo.js', 'bar.js'], ['*.js']));
	* // true
	* console.log(mm.every(['foo.js', 'bar.js'], ['*.js', '!foo.js']));
	* // false
	* console.log(mm.every(['foo.js'], ['*.js', '!foo.js']));
	* // false
	* ```
	* @param {String|Array} `list` The string or array of strings to test.
	* @param {String|Array} `patterns` One or more glob patterns to use for matching.
	* @param {Object} `options` See available [options](#options) for changing how matches are performed
	* @return {Boolean} Returns true if all `patterns` matches all of the strings in `list`
	* @api public
	*/
	micromatch.every = (list, patterns, options) => {
		let items = [].concat(list);
		for (let pattern of [].concat(patterns)) {
			let isMatch = picomatch(String(pattern), options);
			if (!items.every((item) => isMatch(item))) return false;
		}
		return true;
	};
	/**
	* Returns true if **all** of the given `patterns` match
	* the specified string.
	*
	* ```js
	* const mm = require('micromatch');
	* // mm.all(string, patterns[, options]);
	*
	* console.log(mm.all('foo.js', ['foo.js']));
	* // true
	*
	* console.log(mm.all('foo.js', ['*.js', '!foo.js']));
	* // false
	*
	* console.log(mm.all('foo.js', ['*.js', 'foo.js']));
	* // true
	*
	* console.log(mm.all('foo.js', ['*.js', 'f*', '*o*', '*o.js']));
	* // true
	* ```
	* @param {String|Array} `str` The string to test.
	* @param {String|Array} `patterns` One or more glob patterns to use for matching.
	* @param {Object} `options` See available [options](#options) for changing how matches are performed
	* @return {Boolean} Returns true if any patterns match `str`
	* @api public
	*/
	micromatch.all = (str, patterns, options) => {
		if (typeof str !== "string") throw new TypeError(`Expected a string: "${util.inspect(str)}"`);
		return [].concat(patterns).every((p) => picomatch(p, options)(str));
	};
	/**
	* Returns an array of matches captured by `pattern` in `string, or `null` if the pattern did not match.
	*
	* ```js
	* const mm = require('micromatch');
	* // mm.capture(pattern, string[, options]);
	*
	* console.log(mm.capture('test/*.js', 'test/foo.js'));
	* //=> ['foo']
	* console.log(mm.capture('test/*.js', 'foo/bar.css'));
	* //=> null
	* ```
	* @param {String} `glob` Glob pattern to use for matching.
	* @param {String} `input` String to match
	* @param {Object} `options` See available [options](#options) for changing how matches are performed
	* @return {Array|null} Returns an array of captures if the input matches the glob pattern, otherwise `null`.
	* @api public
	*/
	micromatch.capture = (glob, input, options) => {
		let posix = utils.isWindows(options);
		let match = picomatch.makeRe(String(glob), {
			...options,
			capture: true
		}).exec(posix ? utils.toPosixSlashes(input) : input);
		if (match) return match.slice(1).map((v) => v === void 0 ? "" : v);
	};
	/**
	* Create a regular expression from the given glob `pattern`.
	*
	* ```js
	* const mm = require('micromatch');
	* // mm.makeRe(pattern[, options]);
	*
	* console.log(mm.makeRe('*.js'));
	* //=> /^(?:(\.[\\\/])?(?!\.)(?=.)[^\/]*?\.js)$/
	* ```
	* @param {String} `pattern` A glob pattern to convert to regex.
	* @param {Object} `options`
	* @return {RegExp} Returns a regex created from the given pattern.
	* @api public
	*/
	micromatch.makeRe = (...args) => picomatch.makeRe(...args);
	/**
	* Scan a glob pattern to separate the pattern into segments. Used
	* by the [split](#split) method.
	*
	* ```js
	* const mm = require('micromatch');
	* const state = mm.scan(pattern[, options]);
	* ```
	* @param {String} `pattern`
	* @param {Object} `options`
	* @return {Object} Returns an object with
	* @api public
	*/
	micromatch.scan = (...args) => picomatch.scan(...args);
	/**
	* Parse a glob pattern to create the source string for a regular
	* expression.
	*
	* ```js
	* const mm = require('micromatch');
	* const state = mm.parse(pattern[, options]);
	* ```
	* @param {String} `glob`
	* @param {Object} `options`
	* @return {Object} Returns an object with useful properties and output to be used as regex source string.
	* @api public
	*/
	micromatch.parse = (patterns, options) => {
		let res = [];
		for (let pattern of [].concat(patterns || [])) for (let str of braces(String(pattern), options)) res.push(picomatch.parse(str, options));
		return res;
	};
	/**
	* Process the given brace `pattern`.
	*
	* ```js
	* const { braces } = require('micromatch');
	* console.log(braces('foo/{a,b,c}/bar'));
	* //=> [ 'foo/(a|b|c)/bar' ]
	*
	* console.log(braces('foo/{a,b,c}/bar', { expand: true }));
	* //=> [ 'foo/a/bar', 'foo/b/bar', 'foo/c/bar' ]
	* ```
	* @param {String} `pattern` String with brace pattern to process.
	* @param {Object} `options` Any [options](#options) to change how expansion is performed. See the [braces][] library for all available options.
	* @return {Array}
	* @api public
	*/
	micromatch.braces = (pattern, options) => {
		if (typeof pattern !== "string") throw new TypeError("Expected a string");
		if (options && options.nobrace === true || !hasBraces(pattern)) return [pattern];
		return braces(pattern, options);
	};
	/**
	* Expand braces
	*/
	micromatch.braceExpand = (pattern, options) => {
		if (typeof pattern !== "string") throw new TypeError("Expected a string");
		return micromatch.braces(pattern, {
			...options,
			expand: true
		});
	};
	/**
	* Expose micromatch
	*/
	micromatch.hasBraces = hasBraces;
	module.exports = micromatch;
}));
//#endregion
//#region node_modules/yaml/dist/nodes/identity.js
var require_identity = /* @__PURE__ */ __commonJSMin(((exports) => {
	var ALIAS = Symbol.for("yaml.alias");
	var DOC = Symbol.for("yaml.document");
	var MAP = Symbol.for("yaml.map");
	var PAIR = Symbol.for("yaml.pair");
	var SCALAR = Symbol.for("yaml.scalar");
	var SEQ = Symbol.for("yaml.seq");
	var NODE_TYPE = Symbol.for("yaml.node.type");
	var isAlias = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === ALIAS;
	var isDocument = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === DOC;
	var isMap = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === MAP;
	var isPair = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === PAIR;
	var isScalar = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === SCALAR;
	var isSeq = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === SEQ;
	function isCollection(node) {
		if (node && typeof node === "object") switch (node[NODE_TYPE]) {
			case MAP:
			case SEQ: return true;
		}
		return false;
	}
	function isNode(node) {
		if (node && typeof node === "object") switch (node[NODE_TYPE]) {
			case ALIAS:
			case MAP:
			case SCALAR:
			case SEQ: return true;
		}
		return false;
	}
	var hasAnchor = (node) => (isScalar(node) || isCollection(node)) && !!node.anchor;
	exports.ALIAS = ALIAS;
	exports.DOC = DOC;
	exports.MAP = MAP;
	exports.NODE_TYPE = NODE_TYPE;
	exports.PAIR = PAIR;
	exports.SCALAR = SCALAR;
	exports.SEQ = SEQ;
	exports.hasAnchor = hasAnchor;
	exports.isAlias = isAlias;
	exports.isCollection = isCollection;
	exports.isDocument = isDocument;
	exports.isMap = isMap;
	exports.isNode = isNode;
	exports.isPair = isPair;
	exports.isScalar = isScalar;
	exports.isSeq = isSeq;
}));
//#endregion
//#region node_modules/yaml/dist/visit.js
var require_visit = /* @__PURE__ */ __commonJSMin(((exports) => {
	var identity = require_identity();
	var BREAK = Symbol("break visit");
	var SKIP = Symbol("skip children");
	var REMOVE = Symbol("remove node");
	/**
	* Apply a visitor to an AST node or document.
	*
	* Walks through the tree (depth-first) starting from `node`, calling a
	* `visitor` function with three arguments:
	*   - `key`: For sequence values and map `Pair`, the node's index in the
	*     collection. Within a `Pair`, `'key'` or `'value'`, correspondingly.
	*     `null` for the root node.
	*   - `node`: The current node.
	*   - `path`: The ancestry of the current node.
	*
	* The return value of the visitor may be used to control the traversal:
	*   - `undefined` (default): Do nothing and continue
	*   - `visit.SKIP`: Do not visit the children of this node, continue with next
	*     sibling
	*   - `visit.BREAK`: Terminate traversal completely
	*   - `visit.REMOVE`: Remove the current node, then continue with the next one
	*   - `Node`: Replace the current node, then continue by visiting it
	*   - `number`: While iterating the items of a sequence or map, set the index
	*     of the next step. This is useful especially if the index of the current
	*     node has changed.
	*
	* If `visitor` is a single function, it will be called with all values
	* encountered in the tree, including e.g. `null` values. Alternatively,
	* separate visitor functions may be defined for each `Map`, `Pair`, `Seq`,
	* `Alias` and `Scalar` node. To define the same visitor function for more than
	* one node type, use the `Collection` (map and seq), `Value` (map, seq & scalar)
	* and `Node` (alias, map, seq & scalar) targets. Of all these, only the most
	* specific defined one will be used for each node.
	*/
	function visit(node, visitor) {
		const visitor_ = initVisitor(visitor);
		if (identity.isDocument(node)) {
			if (visit_(null, node.contents, visitor_, Object.freeze([node])) === REMOVE) node.contents = null;
		} else visit_(null, node, visitor_, Object.freeze([]));
	}
	/** Terminate visit traversal completely */
	visit.BREAK = BREAK;
	/** Do not visit the children of the current node */
	visit.SKIP = SKIP;
	/** Remove the current node */
	visit.REMOVE = REMOVE;
	function visit_(key, node, visitor, path) {
		const ctrl = callVisitor(key, node, visitor, path);
		if (identity.isNode(ctrl) || identity.isPair(ctrl)) {
			replaceNode(key, path, ctrl);
			return visit_(key, ctrl, visitor, path);
		}
		if (typeof ctrl !== "symbol") {
			if (identity.isCollection(node)) {
				path = Object.freeze(path.concat(node));
				for (let i = 0; i < node.items.length; ++i) {
					const ci = visit_(i, node.items[i], visitor, path);
					if (typeof ci === "number") i = ci - 1;
					else if (ci === BREAK) return BREAK;
					else if (ci === REMOVE) {
						node.items.splice(i, 1);
						i -= 1;
					}
				}
			} else if (identity.isPair(node)) {
				path = Object.freeze(path.concat(node));
				const ck = visit_("key", node.key, visitor, path);
				if (ck === BREAK) return BREAK;
				else if (ck === REMOVE) node.key = null;
				const cv = visit_("value", node.value, visitor, path);
				if (cv === BREAK) return BREAK;
				else if (cv === REMOVE) node.value = null;
			}
		}
		return ctrl;
	}
	/**
	* Apply an async visitor to an AST node or document.
	*
	* Walks through the tree (depth-first) starting from `node`, calling a
	* `visitor` function with three arguments:
	*   - `key`: For sequence values and map `Pair`, the node's index in the
	*     collection. Within a `Pair`, `'key'` or `'value'`, correspondingly.
	*     `null` for the root node.
	*   - `node`: The current node.
	*   - `path`: The ancestry of the current node.
	*
	* The return value of the visitor may be used to control the traversal:
	*   - `Promise`: Must resolve to one of the following values
	*   - `undefined` (default): Do nothing and continue
	*   - `visit.SKIP`: Do not visit the children of this node, continue with next
	*     sibling
	*   - `visit.BREAK`: Terminate traversal completely
	*   - `visit.REMOVE`: Remove the current node, then continue with the next one
	*   - `Node`: Replace the current node, then continue by visiting it
	*   - `number`: While iterating the items of a sequence or map, set the index
	*     of the next step. This is useful especially if the index of the current
	*     node has changed.
	*
	* If `visitor` is a single function, it will be called with all values
	* encountered in the tree, including e.g. `null` values. Alternatively,
	* separate visitor functions may be defined for each `Map`, `Pair`, `Seq`,
	* `Alias` and `Scalar` node. To define the same visitor function for more than
	* one node type, use the `Collection` (map and seq), `Value` (map, seq & scalar)
	* and `Node` (alias, map, seq & scalar) targets. Of all these, only the most
	* specific defined one will be used for each node.
	*/
	async function visitAsync(node, visitor) {
		const visitor_ = initVisitor(visitor);
		if (identity.isDocument(node)) {
			if (await visitAsync_(null, node.contents, visitor_, Object.freeze([node])) === REMOVE) node.contents = null;
		} else await visitAsync_(null, node, visitor_, Object.freeze([]));
	}
	/** Terminate visit traversal completely */
	visitAsync.BREAK = BREAK;
	/** Do not visit the children of the current node */
	visitAsync.SKIP = SKIP;
	/** Remove the current node */
	visitAsync.REMOVE = REMOVE;
	async function visitAsync_(key, node, visitor, path) {
		const ctrl = await callVisitor(key, node, visitor, path);
		if (identity.isNode(ctrl) || identity.isPair(ctrl)) {
			replaceNode(key, path, ctrl);
			return visitAsync_(key, ctrl, visitor, path);
		}
		if (typeof ctrl !== "symbol") {
			if (identity.isCollection(node)) {
				path = Object.freeze(path.concat(node));
				for (let i = 0; i < node.items.length; ++i) {
					const ci = await visitAsync_(i, node.items[i], visitor, path);
					if (typeof ci === "number") i = ci - 1;
					else if (ci === BREAK) return BREAK;
					else if (ci === REMOVE) {
						node.items.splice(i, 1);
						i -= 1;
					}
				}
			} else if (identity.isPair(node)) {
				path = Object.freeze(path.concat(node));
				const ck = await visitAsync_("key", node.key, visitor, path);
				if (ck === BREAK) return BREAK;
				else if (ck === REMOVE) node.key = null;
				const cv = await visitAsync_("value", node.value, visitor, path);
				if (cv === BREAK) return BREAK;
				else if (cv === REMOVE) node.value = null;
			}
		}
		return ctrl;
	}
	function initVisitor(visitor) {
		if (typeof visitor === "object" && (visitor.Collection || visitor.Node || visitor.Value)) return Object.assign({
			Alias: visitor.Node,
			Map: visitor.Node,
			Scalar: visitor.Node,
			Seq: visitor.Node
		}, visitor.Value && {
			Map: visitor.Value,
			Scalar: visitor.Value,
			Seq: visitor.Value
		}, visitor.Collection && {
			Map: visitor.Collection,
			Seq: visitor.Collection
		}, visitor);
		return visitor;
	}
	function callVisitor(key, node, visitor, path) {
		if (typeof visitor === "function") return visitor(key, node, path);
		if (identity.isMap(node)) return visitor.Map?.(key, node, path);
		if (identity.isSeq(node)) return visitor.Seq?.(key, node, path);
		if (identity.isPair(node)) return visitor.Pair?.(key, node, path);
		if (identity.isScalar(node)) return visitor.Scalar?.(key, node, path);
		if (identity.isAlias(node)) return visitor.Alias?.(key, node, path);
	}
	function replaceNode(key, path, node) {
		const parent = path[path.length - 1];
		if (identity.isCollection(parent)) parent.items[key] = node;
		else if (identity.isPair(parent)) if (key === "key") parent.key = node;
		else parent.value = node;
		else if (identity.isDocument(parent)) parent.contents = node;
		else {
			const pt = identity.isAlias(parent) ? "alias" : "scalar";
			throw new Error(`Cannot replace node with ${pt} parent`);
		}
	}
	exports.visit = visit;
	exports.visitAsync = visitAsync;
}));
//#endregion
//#region node_modules/yaml/dist/doc/directives.js
var require_directives = /* @__PURE__ */ __commonJSMin(((exports) => {
	var identity = require_identity();
	var visit = require_visit();
	var escapeChars = {
		"!": "%21",
		",": "%2C",
		"[": "%5B",
		"]": "%5D",
		"{": "%7B",
		"}": "%7D"
	};
	var escapeTagName = (tn) => tn.replace(/[!,[\]{}]/g, (ch) => escapeChars[ch]);
	var Directives = class Directives {
		constructor(yaml, tags) {
			/**
			* The directives-end/doc-start marker `---`. If `null`, a marker may still be
			* included in the document's stringified representation.
			*/
			this.docStart = null;
			/** The doc-end marker `...`.  */
			this.docEnd = false;
			this.yaml = Object.assign({}, Directives.defaultYaml, yaml);
			this.tags = Object.assign({}, Directives.defaultTags, tags);
		}
		clone() {
			const copy = new Directives(this.yaml, this.tags);
			copy.docStart = this.docStart;
			return copy;
		}
		/**
		* During parsing, get a Directives instance for the current document and
		* update the stream state according to the current version's spec.
		*/
		atDocument() {
			const res = new Directives(this.yaml, this.tags);
			switch (this.yaml.version) {
				case "1.1":
					this.atNextDocument = true;
					break;
				case "1.2":
					this.atNextDocument = false;
					this.yaml = {
						explicit: Directives.defaultYaml.explicit,
						version: "1.2"
					};
					this.tags = Object.assign({}, Directives.defaultTags);
					break;
			}
			return res;
		}
		/**
		* @param onError - May be called even if the action was successful
		* @returns `true` on success
		*/
		add(line, onError) {
			if (this.atNextDocument) {
				this.yaml = {
					explicit: Directives.defaultYaml.explicit,
					version: "1.1"
				};
				this.tags = Object.assign({}, Directives.defaultTags);
				this.atNextDocument = false;
			}
			const parts = line.trim().split(/[ \t]+/);
			const name = parts.shift();
			switch (name) {
				case "%TAG": {
					if (parts.length !== 2) {
						onError(0, "%TAG directive should contain exactly two parts");
						if (parts.length < 2) return false;
					}
					const [handle, prefix] = parts;
					this.tags[handle] = prefix;
					return true;
				}
				case "%YAML": {
					this.yaml.explicit = true;
					if (parts.length !== 1) {
						onError(0, "%YAML directive should contain exactly one part");
						return false;
					}
					const [version] = parts;
					if (version === "1.1" || version === "1.2") {
						this.yaml.version = version;
						return true;
					} else {
						const isValid = /^\d+\.\d+$/.test(version);
						onError(6, `Unsupported YAML version ${version}`, isValid);
						return false;
					}
				}
				default:
					onError(0, `Unknown directive ${name}`, true);
					return false;
			}
		}
		/**
		* Resolves a tag, matching handles to those defined in %TAG directives.
		*
		* @returns Resolved tag, which may also be the non-specific tag `'!'` or a
		*   `'!local'` tag, or `null` if unresolvable.
		*/
		tagName(source, onError) {
			if (source === "!") return "!";
			if (source[0] !== "!") {
				onError(`Not a valid tag: ${source}`);
				return null;
			}
			if (source[1] === "<") {
				const verbatim = source.slice(2, -1);
				if (verbatim === "!" || verbatim === "!!") {
					onError(`Verbatim tags aren't resolved, so ${source} is invalid.`);
					return null;
				}
				if (source[source.length - 1] !== ">") onError("Verbatim tags must end with a >");
				return verbatim;
			}
			const [, handle, suffix] = source.match(/^(.*!)([^!]*)$/s);
			if (!suffix) onError(`The ${source} tag has no suffix`);
			const prefix = this.tags[handle];
			if (prefix) try {
				return prefix + decodeURIComponent(suffix);
			} catch (error) {
				onError(String(error));
				return null;
			}
			if (handle === "!") return source;
			onError(`Could not resolve tag: ${source}`);
			return null;
		}
		/**
		* Given a fully resolved tag, returns its printable string form,
		* taking into account current tag prefixes and defaults.
		*/
		tagString(tag) {
			for (const [handle, prefix] of Object.entries(this.tags)) if (tag.startsWith(prefix)) return handle + escapeTagName(tag.substring(prefix.length));
			return tag[0] === "!" ? tag : `!<${tag}>`;
		}
		toString(doc) {
			const lines = this.yaml.explicit ? [`%YAML ${this.yaml.version || "1.2"}`] : [];
			const tagEntries = Object.entries(this.tags);
			let tagNames;
			if (doc && tagEntries.length > 0 && identity.isNode(doc.contents)) {
				const tags = {};
				visit.visit(doc.contents, (_key, node) => {
					if (identity.isNode(node) && node.tag) tags[node.tag] = true;
				});
				tagNames = Object.keys(tags);
			} else tagNames = [];
			for (const [handle, prefix] of tagEntries) {
				if (handle === "!!" && prefix === "tag:yaml.org,2002:") continue;
				if (!doc || tagNames.some((tn) => tn.startsWith(prefix))) lines.push(`%TAG ${handle} ${prefix}`);
			}
			return lines.join("\n");
		}
	};
	Directives.defaultYaml = {
		explicit: false,
		version: "1.2"
	};
	Directives.defaultTags = { "!!": "tag:yaml.org,2002:" };
	exports.Directives = Directives;
}));
//#endregion
//#region node_modules/yaml/dist/doc/anchors.js
var require_anchors = /* @__PURE__ */ __commonJSMin(((exports) => {
	var identity = require_identity();
	var visit = require_visit();
	/**
	* Verify that the input string is a valid anchor.
	*
	* Will throw on errors.
	*/
	function anchorIsValid(anchor) {
		if (/[\x00-\x19\s,[\]{}]/.test(anchor)) {
			const msg = `Anchor must not contain whitespace or control characters: ${JSON.stringify(anchor)}`;
			throw new Error(msg);
		}
		return true;
	}
	function anchorNames(root) {
		const anchors = /* @__PURE__ */ new Set();
		visit.visit(root, { Value(_key, node) {
			if (node.anchor) anchors.add(node.anchor);
		} });
		return anchors;
	}
	/** Find a new anchor name with the given `prefix` and a one-indexed suffix. */
	function findNewAnchor(prefix, exclude) {
		for (let i = 1;; ++i) {
			const name = `${prefix}${i}`;
			if (!exclude.has(name)) return name;
		}
	}
	function createNodeAnchors(doc, prefix) {
		const aliasObjects = [];
		const sourceObjects = /* @__PURE__ */ new Map();
		let prevAnchors = null;
		return {
			onAnchor: (source) => {
				aliasObjects.push(source);
				prevAnchors ?? (prevAnchors = anchorNames(doc));
				const anchor = findNewAnchor(prefix, prevAnchors);
				prevAnchors.add(anchor);
				return anchor;
			},
			/**
			* With circular references, the source node is only resolved after all
			* of its child nodes are. This is why anchors are set only after all of
			* the nodes have been created.
			*/
			setAnchors: () => {
				for (const source of aliasObjects) {
					const ref = sourceObjects.get(source);
					if (typeof ref === "object" && ref.anchor && (identity.isScalar(ref.node) || identity.isCollection(ref.node))) ref.node.anchor = ref.anchor;
					else {
						const error = /* @__PURE__ */ new Error("Failed to resolve repeated object (this should not happen)");
						error.source = source;
						throw error;
					}
				}
			},
			sourceObjects
		};
	}
	exports.anchorIsValid = anchorIsValid;
	exports.anchorNames = anchorNames;
	exports.createNodeAnchors = createNodeAnchors;
	exports.findNewAnchor = findNewAnchor;
}));
//#endregion
//#region node_modules/yaml/dist/doc/applyReviver.js
var require_applyReviver = /* @__PURE__ */ __commonJSMin(((exports) => {
	/**
	* Applies the JSON.parse reviver algorithm as defined in the ECMA-262 spec,
	* in section 24.5.1.1 "Runtime Semantics: InternalizeJSONProperty" of the
	* 2021 edition: https://tc39.es/ecma262/#sec-json.parse
	*
	* Includes extensions for handling Map and Set objects.
	*/
	function applyReviver(reviver, obj, key, val) {
		if (val && typeof val === "object") if (Array.isArray(val)) for (let i = 0, len = val.length; i < len; ++i) {
			const v0 = val[i];
			const v1 = applyReviver(reviver, val, String(i), v0);
			if (v1 === void 0) delete val[i];
			else if (v1 !== v0) val[i] = v1;
		}
		else if (val instanceof Map) for (const k of Array.from(val.keys())) {
			const v0 = val.get(k);
			const v1 = applyReviver(reviver, val, k, v0);
			if (v1 === void 0) val.delete(k);
			else if (v1 !== v0) val.set(k, v1);
		}
		else if (val instanceof Set) for (const v0 of Array.from(val)) {
			const v1 = applyReviver(reviver, val, v0, v0);
			if (v1 === void 0) val.delete(v0);
			else if (v1 !== v0) {
				val.delete(v0);
				val.add(v1);
			}
		}
		else for (const [k, v0] of Object.entries(val)) {
			const v1 = applyReviver(reviver, val, k, v0);
			if (v1 === void 0) delete val[k];
			else if (v1 !== v0) val[k] = v1;
		}
		return reviver.call(obj, key, val);
	}
	exports.applyReviver = applyReviver;
}));
//#endregion
//#region node_modules/yaml/dist/nodes/toJS.js
var require_toJS = /* @__PURE__ */ __commonJSMin(((exports) => {
	var identity = require_identity();
	/**
	* Recursively convert any node or its contents to native JavaScript
	*
	* @param value - The input value
	* @param arg - If `value` defines a `toJSON()` method, use this
	*   as its first argument
	* @param ctx - Conversion context, originally set in Document#toJS(). If
	*   `{ keep: true }` is not set, output should be suitable for JSON
	*   stringification.
	*/
	function toJS(value, arg, ctx) {
		if (Array.isArray(value)) return value.map((v, i) => toJS(v, String(i), ctx));
		if (value && typeof value.toJSON === "function") {
			if (!ctx || !identity.hasAnchor(value)) return value.toJSON(arg, ctx);
			const data = {
				aliasCount: 0,
				count: 1,
				res: void 0
			};
			ctx.anchors.set(value, data);
			ctx.onCreate = (res) => {
				data.res = res;
				delete ctx.onCreate;
			};
			const res = value.toJSON(arg, ctx);
			if (ctx.onCreate) ctx.onCreate(res);
			return res;
		}
		if (typeof value === "bigint" && !ctx?.keep) return Number(value);
		return value;
	}
	exports.toJS = toJS;
}));
//#endregion
//#region node_modules/yaml/dist/nodes/Node.js
var require_Node = /* @__PURE__ */ __commonJSMin(((exports) => {
	var applyReviver = require_applyReviver();
	var identity = require_identity();
	var toJS = require_toJS();
	var NodeBase = class {
		constructor(type) {
			Object.defineProperty(this, identity.NODE_TYPE, { value: type });
		}
		/** Create a copy of this node.  */
		clone() {
			const copy = Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
			if (this.range) copy.range = this.range.slice();
			return copy;
		}
		/** A plain JavaScript representation of this node. */
		toJS(doc, { mapAsMap, maxAliasCount, onAnchor, reviver } = {}) {
			if (!identity.isDocument(doc)) throw new TypeError("A document argument is required");
			const ctx = {
				anchors: /* @__PURE__ */ new Map(),
				doc,
				keep: true,
				mapAsMap: mapAsMap === true,
				mapKeyWarned: false,
				maxAliasCount: typeof maxAliasCount === "number" ? maxAliasCount : 100
			};
			const res = toJS.toJS(this, "", ctx);
			if (typeof onAnchor === "function") for (const { count, res } of ctx.anchors.values()) onAnchor(res, count);
			return typeof reviver === "function" ? applyReviver.applyReviver(reviver, { "": res }, "", res) : res;
		}
	};
	exports.NodeBase = NodeBase;
}));
//#endregion
//#region node_modules/yaml/dist/nodes/Alias.js
var require_Alias = /* @__PURE__ */ __commonJSMin(((exports) => {
	var anchors = require_anchors();
	var visit = require_visit();
	var identity = require_identity();
	var Node = require_Node();
	var toJS = require_toJS();
	var Alias = class extends Node.NodeBase {
		constructor(source) {
			super(identity.ALIAS);
			this.source = source;
			Object.defineProperty(this, "tag", { set() {
				throw new Error("Alias nodes cannot have tags");
			} });
		}
		/**
		* Resolve the value of this alias within `doc`, finding the last
		* instance of the `source` anchor before this node.
		*/
		resolve(doc, ctx) {
			if (ctx?.maxAliasCount === 0) throw new ReferenceError("Alias resolution is disabled");
			let nodes;
			if (ctx?.aliasResolveCache) nodes = ctx.aliasResolveCache;
			else {
				nodes = [];
				visit.visit(doc, { Node: (_key, node) => {
					if (identity.isAlias(node) || identity.hasAnchor(node)) nodes.push(node);
				} });
				if (ctx) ctx.aliasResolveCache = nodes;
			}
			let found = void 0;
			for (const node of nodes) {
				if (node === this) break;
				if (node.anchor === this.source) found = node;
			}
			return found;
		}
		toJSON(_arg, ctx) {
			if (!ctx) return { source: this.source };
			const { anchors, doc, maxAliasCount } = ctx;
			const source = this.resolve(doc, ctx);
			if (!source) {
				const msg = `Unresolved alias (the anchor must be set before the alias): ${this.source}`;
				throw new ReferenceError(msg);
			}
			let data = anchors.get(source);
			if (!data) {
				toJS.toJS(source, null, ctx);
				data = anchors.get(source);
			}
			/* istanbul ignore if */
			if (data?.res === void 0) throw new ReferenceError("This should not happen: Alias anchor was not resolved?");
			if (maxAliasCount >= 0) {
				data.count += 1;
				if (data.aliasCount === 0) data.aliasCount = getAliasCount(doc, source, anchors);
				if (data.count * data.aliasCount > maxAliasCount) throw new ReferenceError("Excessive alias count indicates a resource exhaustion attack");
			}
			return data.res;
		}
		toString(ctx, _onComment, _onChompKeep) {
			const src = `*${this.source}`;
			if (ctx) {
				anchors.anchorIsValid(this.source);
				if (ctx.options.verifyAliasOrder && !ctx.anchors.has(this.source)) {
					const msg = `Unresolved alias (the anchor must be set before the alias): ${this.source}`;
					throw new Error(msg);
				}
				if (ctx.implicitKey) return `${src} `;
			}
			return src;
		}
	};
	function getAliasCount(doc, node, anchors) {
		if (identity.isAlias(node)) {
			const source = node.resolve(doc);
			const anchor = anchors && source && anchors.get(source);
			return anchor ? anchor.count * anchor.aliasCount : 0;
		} else if (identity.isCollection(node)) {
			let count = 0;
			for (const item of node.items) {
				const c = getAliasCount(doc, item, anchors);
				if (c > count) count = c;
			}
			return count;
		} else if (identity.isPair(node)) {
			const kc = getAliasCount(doc, node.key, anchors);
			const vc = getAliasCount(doc, node.value, anchors);
			return Math.max(kc, vc);
		}
		return 1;
	}
	exports.Alias = Alias;
}));
//#endregion
//#region node_modules/yaml/dist/nodes/Scalar.js
var require_Scalar = /* @__PURE__ */ __commonJSMin(((exports) => {
	var identity = require_identity();
	var Node = require_Node();
	var toJS = require_toJS();
	var isScalarValue = (value) => !value || typeof value !== "function" && typeof value !== "object";
	var Scalar = class extends Node.NodeBase {
		constructor(value) {
			super(identity.SCALAR);
			this.value = value;
		}
		toJSON(arg, ctx) {
			return ctx?.keep ? this.value : toJS.toJS(this.value, arg, ctx);
		}
		toString() {
			return String(this.value);
		}
	};
	Scalar.BLOCK_FOLDED = "BLOCK_FOLDED";
	Scalar.BLOCK_LITERAL = "BLOCK_LITERAL";
	Scalar.PLAIN = "PLAIN";
	Scalar.QUOTE_DOUBLE = "QUOTE_DOUBLE";
	Scalar.QUOTE_SINGLE = "QUOTE_SINGLE";
	exports.Scalar = Scalar;
	exports.isScalarValue = isScalarValue;
}));
//#endregion
//#region node_modules/yaml/dist/doc/createNode.js
var require_createNode = /* @__PURE__ */ __commonJSMin(((exports) => {
	var Alias = require_Alias();
	var identity = require_identity();
	var Scalar = require_Scalar();
	var defaultTagPrefix = "tag:yaml.org,2002:";
	function findTagObject(value, tagName, tags) {
		if (tagName) {
			const match = tags.filter((t) => t.tag === tagName);
			const tagObj = match.find((t) => !t.format) ?? match[0];
			if (!tagObj) throw new Error(`Tag ${tagName} not found`);
			return tagObj;
		}
		return tags.find((t) => t.identify?.(value) && !t.format);
	}
	function createNode(value, tagName, ctx) {
		if (identity.isDocument(value)) value = value.contents;
		if (identity.isNode(value)) return value;
		if (identity.isPair(value)) {
			const map = ctx.schema[identity.MAP].createNode?.(ctx.schema, null, ctx);
			map.items.push(value);
			return map;
		}
		if (value instanceof String || value instanceof Number || value instanceof Boolean || typeof BigInt !== "undefined" && value instanceof BigInt) value = value.valueOf();
		const { aliasDuplicateObjects, onAnchor, onTagObj, schema, sourceObjects } = ctx;
		let ref = void 0;
		if (aliasDuplicateObjects && value && typeof value === "object") {
			ref = sourceObjects.get(value);
			if (ref) {
				ref.anchor ?? (ref.anchor = onAnchor(value));
				return new Alias.Alias(ref.anchor);
			} else {
				ref = {
					anchor: null,
					node: null
				};
				sourceObjects.set(value, ref);
			}
		}
		if (tagName?.startsWith("!!")) tagName = defaultTagPrefix + tagName.slice(2);
		let tagObj = findTagObject(value, tagName, schema.tags);
		if (!tagObj) {
			if (value && typeof value.toJSON === "function") value = value.toJSON();
			if (!value || typeof value !== "object") {
				const node = new Scalar.Scalar(value);
				if (ref) ref.node = node;
				return node;
			}
			tagObj = value instanceof Map ? schema[identity.MAP] : Symbol.iterator in Object(value) ? schema[identity.SEQ] : schema[identity.MAP];
		}
		if (onTagObj) {
			onTagObj(tagObj);
			delete ctx.onTagObj;
		}
		const node = tagObj?.createNode ? tagObj.createNode(ctx.schema, value, ctx) : typeof tagObj?.nodeClass?.from === "function" ? tagObj.nodeClass.from(ctx.schema, value, ctx) : new Scalar.Scalar(value);
		if (tagName) node.tag = tagName;
		else if (!tagObj.default) node.tag = tagObj.tag;
		if (ref) ref.node = node;
		return node;
	}
	exports.createNode = createNode;
}));
//#endregion
//#region node_modules/yaml/dist/nodes/Collection.js
var require_Collection = /* @__PURE__ */ __commonJSMin(((exports) => {
	var createNode = require_createNode();
	var identity = require_identity();
	var Node = require_Node();
	function collectionFromPath(schema, path, value) {
		let v = value;
		for (let i = path.length - 1; i >= 0; --i) {
			const k = path[i];
			if (typeof k === "number" && Number.isInteger(k) && k >= 0) {
				const a = [];
				a[k] = v;
				v = a;
			} else v = /* @__PURE__ */ new Map([[k, v]]);
		}
		return createNode.createNode(v, void 0, {
			aliasDuplicateObjects: false,
			keepUndefined: false,
			onAnchor: () => {
				throw new Error("This should not happen, please report a bug.");
			},
			schema,
			sourceObjects: /* @__PURE__ */ new Map()
		});
	}
	var isEmptyPath = (path) => path == null || typeof path === "object" && !!path[Symbol.iterator]().next().done;
	var Collection = class extends Node.NodeBase {
		constructor(type, schema) {
			super(type);
			Object.defineProperty(this, "schema", {
				value: schema,
				configurable: true,
				enumerable: false,
				writable: true
			});
		}
		/**
		* Create a copy of this collection.
		*
		* @param schema - If defined, overwrites the original's schema
		*/
		clone(schema) {
			const copy = Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
			if (schema) copy.schema = schema;
			copy.items = copy.items.map((it) => identity.isNode(it) || identity.isPair(it) ? it.clone(schema) : it);
			if (this.range) copy.range = this.range.slice();
			return copy;
		}
		/**
		* Adds a value to the collection. For `!!map` and `!!omap` the value must
		* be a Pair instance or a `{ key, value }` object, which may not have a key
		* that already exists in the map.
		*/
		addIn(path, value) {
			if (isEmptyPath(path)) this.add(value);
			else {
				const [key, ...rest] = path;
				const node = this.get(key, true);
				if (identity.isCollection(node)) node.addIn(rest, value);
				else if (node === void 0 && this.schema) this.set(key, collectionFromPath(this.schema, rest, value));
				else throw new Error(`Expected YAML collection at ${key}. Remaining path: ${rest}`);
			}
		}
		/**
		* Removes a value from the collection.
		* @returns `true` if the item was found and removed.
		*/
		deleteIn(path) {
			const [key, ...rest] = path;
			if (rest.length === 0) return this.delete(key);
			const node = this.get(key, true);
			if (identity.isCollection(node)) return node.deleteIn(rest);
			else throw new Error(`Expected YAML collection at ${key}. Remaining path: ${rest}`);
		}
		/**
		* Returns item at `key`, or `undefined` if not found. By default unwraps
		* scalar values from their surrounding node; to disable set `keepScalar` to
		* `true` (collections are always returned intact).
		*/
		getIn(path, keepScalar) {
			const [key, ...rest] = path;
			const node = this.get(key, true);
			if (rest.length === 0) return !keepScalar && identity.isScalar(node) ? node.value : node;
			else return identity.isCollection(node) ? node.getIn(rest, keepScalar) : void 0;
		}
		hasAllNullValues(allowScalar) {
			return this.items.every((node) => {
				if (!identity.isPair(node)) return false;
				const n = node.value;
				return n == null || allowScalar && identity.isScalar(n) && n.value == null && !n.commentBefore && !n.comment && !n.tag;
			});
		}
		/**
		* Checks if the collection includes a value with the key `key`.
		*/
		hasIn(path) {
			const [key, ...rest] = path;
			if (rest.length === 0) return this.has(key);
			const node = this.get(key, true);
			return identity.isCollection(node) ? node.hasIn(rest) : false;
		}
		/**
		* Sets a value in this collection. For `!!set`, `value` needs to be a
		* boolean to add/remove the item from the set.
		*/
		setIn(path, value) {
			const [key, ...rest] = path;
			if (rest.length === 0) this.set(key, value);
			else {
				const node = this.get(key, true);
				if (identity.isCollection(node)) node.setIn(rest, value);
				else if (node === void 0 && this.schema) this.set(key, collectionFromPath(this.schema, rest, value));
				else throw new Error(`Expected YAML collection at ${key}. Remaining path: ${rest}`);
			}
		}
	};
	exports.Collection = Collection;
	exports.collectionFromPath = collectionFromPath;
	exports.isEmptyPath = isEmptyPath;
}));
//#endregion
//#region node_modules/yaml/dist/stringify/stringifyComment.js
var require_stringifyComment = /* @__PURE__ */ __commonJSMin(((exports) => {
	/**
	* Stringifies a comment.
	*
	* Empty comment lines are left empty,
	* lines consisting of a single space are replaced by `#`,
	* and all other lines are prefixed with a `#`.
	*/
	var stringifyComment = (str) => str.replace(/^(?!$)(?: $)?/gm, "#");
	function indentComment(comment, indent) {
		if (/^\n+$/.test(comment)) return comment.substring(1);
		return indent ? comment.replace(/^(?! *$)/gm, indent) : comment;
	}
	var lineComment = (str, indent, comment) => str.endsWith("\n") ? indentComment(comment, indent) : comment.includes("\n") ? "\n" + indentComment(comment, indent) : (str.endsWith(" ") ? "" : " ") + comment;
	exports.indentComment = indentComment;
	exports.lineComment = lineComment;
	exports.stringifyComment = stringifyComment;
}));
//#endregion
//#region node_modules/yaml/dist/stringify/foldFlowLines.js
var require_foldFlowLines = /* @__PURE__ */ __commonJSMin(((exports) => {
	var FOLD_FLOW = "flow";
	var FOLD_BLOCK = "block";
	var FOLD_QUOTED = "quoted";
	/**
	* Tries to keep input at up to `lineWidth` characters, splitting only on spaces
	* not followed by newlines or spaces unless `mode` is `'quoted'`. Lines are
	* terminated with `\n` and started with `indent`.
	*/
	function foldFlowLines(text, indent, mode = "flow", { indentAtStart, lineWidth = 80, minContentWidth = 20, onFold, onOverflow } = {}) {
		if (!lineWidth || lineWidth < 0) return text;
		if (lineWidth < minContentWidth) minContentWidth = 0;
		const endStep = Math.max(1 + minContentWidth, 1 + lineWidth - indent.length);
		if (text.length <= endStep) return text;
		const folds = [];
		const escapedFolds = {};
		let end = lineWidth - indent.length;
		if (typeof indentAtStart === "number") if (indentAtStart > lineWidth - Math.max(2, minContentWidth)) folds.push(0);
		else end = lineWidth - indentAtStart;
		let split = void 0;
		let prev = void 0;
		let overflow = false;
		let i = -1;
		let escStart = -1;
		let escEnd = -1;
		if (mode === FOLD_BLOCK) {
			i = consumeMoreIndentedLines(text, i, indent.length);
			if (i !== -1) end = i + endStep;
		}
		for (let ch; ch = text[i += 1];) {
			if (mode === FOLD_QUOTED && ch === "\\") {
				escStart = i;
				switch (text[i + 1]) {
					case "x":
						i += 3;
						break;
					case "u":
						i += 5;
						break;
					case "U":
						i += 9;
						break;
					default: i += 1;
				}
				escEnd = i;
			}
			if (ch === "\n") {
				if (mode === FOLD_BLOCK) i = consumeMoreIndentedLines(text, i, indent.length);
				end = i + indent.length + endStep;
				split = void 0;
			} else {
				if (ch === " " && prev && prev !== " " && prev !== "\n" && prev !== "	") {
					const next = text[i + 1];
					if (next && next !== " " && next !== "\n" && next !== "	") split = i;
				}
				if (i >= end) if (split) {
					folds.push(split);
					end = split + endStep;
					split = void 0;
				} else if (mode === FOLD_QUOTED) {
					while (prev === " " || prev === "	") {
						prev = ch;
						ch = text[i += 1];
						overflow = true;
					}
					const j = i > escEnd + 1 ? i - 2 : escStart - 1;
					if (escapedFolds[j]) return text;
					folds.push(j);
					escapedFolds[j] = true;
					end = j + endStep;
					split = void 0;
				} else overflow = true;
			}
			prev = ch;
		}
		if (overflow && onOverflow) onOverflow();
		if (folds.length === 0) return text;
		if (onFold) onFold();
		let res = text.slice(0, folds[0]);
		for (let i = 0; i < folds.length; ++i) {
			const fold = folds[i];
			const end = folds[i + 1] || text.length;
			if (fold === 0) res = `\n${indent}${text.slice(0, end)}`;
			else {
				if (mode === FOLD_QUOTED && escapedFolds[fold]) res += `${text[fold]}\\`;
				res += `\n${indent}${text.slice(fold + 1, end)}`;
			}
		}
		return res;
	}
	/**
	* Presumes `i + 1` is at the start of a line
	* @returns index of last newline in more-indented block
	*/
	function consumeMoreIndentedLines(text, i, indent) {
		let end = i;
		let start = i + 1;
		let ch = text[start];
		while (ch === " " || ch === "	") if (i < start + indent) ch = text[++i];
		else {
			do
				ch = text[++i];
			while (ch && ch !== "\n");
			end = i;
			start = i + 1;
			ch = text[start];
		}
		return end;
	}
	exports.FOLD_BLOCK = FOLD_BLOCK;
	exports.FOLD_FLOW = FOLD_FLOW;
	exports.FOLD_QUOTED = FOLD_QUOTED;
	exports.foldFlowLines = foldFlowLines;
}));
//#endregion
//#region node_modules/yaml/dist/stringify/stringifyString.js
var require_stringifyString = /* @__PURE__ */ __commonJSMin(((exports) => {
	var Scalar = require_Scalar();
	var foldFlowLines = require_foldFlowLines();
	var getFoldOptions = (ctx, isBlock) => ({
		indentAtStart: isBlock ? ctx.indent.length : ctx.indentAtStart,
		lineWidth: ctx.options.lineWidth,
		minContentWidth: ctx.options.minContentWidth
	});
	var containsDocumentMarker = (str) => /^(%|---|\.\.\.)/m.test(str);
	function lineLengthOverLimit(str, lineWidth, indentLength) {
		if (!lineWidth || lineWidth < 0) return false;
		const limit = lineWidth - indentLength;
		const strLen = str.length;
		if (strLen <= limit) return false;
		for (let i = 0, start = 0; i < strLen; ++i) if (str[i] === "\n") {
			if (i - start > limit) return true;
			start = i + 1;
			if (strLen - start <= limit) return false;
		}
		return true;
	}
	function doubleQuotedString(value, ctx) {
		const json = JSON.stringify(value);
		if (ctx.options.doubleQuotedAsJSON) return json;
		const { implicitKey } = ctx;
		const minMultiLineLength = ctx.options.doubleQuotedMinMultiLineLength;
		const indent = ctx.indent || (containsDocumentMarker(value) ? "  " : "");
		let str = "";
		let start = 0;
		for (let i = 0, ch = json[i]; ch; ch = json[++i]) {
			if (ch === " " && json[i + 1] === "\\" && json[i + 2] === "n") {
				str += json.slice(start, i) + "\\ ";
				i += 1;
				start = i;
				ch = "\\";
			}
			if (ch === "\\") switch (json[i + 1]) {
				case "u":
					{
						str += json.slice(start, i);
						const code = json.substr(i + 2, 4);
						switch (code) {
							case "0000":
								str += "\\0";
								break;
							case "0007":
								str += "\\a";
								break;
							case "000b":
								str += "\\v";
								break;
							case "001b":
								str += "\\e";
								break;
							case "0085":
								str += "\\N";
								break;
							case "00a0":
								str += "\\_";
								break;
							case "2028":
								str += "\\L";
								break;
							case "2029":
								str += "\\P";
								break;
							default: if (code.substr(0, 2) === "00") str += "\\x" + code.substr(2);
							else str += json.substr(i, 6);
						}
						i += 5;
						start = i + 1;
					}
					break;
				case "n":
					if (implicitKey || json[i + 2] === "\"" || json.length < minMultiLineLength) i += 1;
					else {
						str += json.slice(start, i) + "\n\n";
						while (json[i + 2] === "\\" && json[i + 3] === "n" && json[i + 4] !== "\"") {
							str += "\n";
							i += 2;
						}
						str += indent;
						if (json[i + 2] === " ") str += "\\";
						i += 1;
						start = i + 1;
					}
					break;
				default: i += 1;
			}
		}
		str = start ? str + json.slice(start) : json;
		return implicitKey ? str : foldFlowLines.foldFlowLines(str, indent, foldFlowLines.FOLD_QUOTED, getFoldOptions(ctx, false));
	}
	function singleQuotedString(value, ctx) {
		if (ctx.options.singleQuote === false || ctx.implicitKey && value.includes("\n") || /[ \t]\n|\n[ \t]/.test(value)) return doubleQuotedString(value, ctx);
		const indent = ctx.indent || (containsDocumentMarker(value) ? "  " : "");
		const res = "'" + value.replace(/'/g, "''").replace(/\n+/g, `$&\n${indent}`) + "'";
		return ctx.implicitKey ? res : foldFlowLines.foldFlowLines(res, indent, foldFlowLines.FOLD_FLOW, getFoldOptions(ctx, false));
	}
	function quotedString(value, ctx) {
		const { singleQuote } = ctx.options;
		let qs;
		if (singleQuote === false) qs = doubleQuotedString;
		else {
			const hasDouble = value.includes("\"");
			const hasSingle = value.includes("'");
			if (hasDouble && !hasSingle) qs = singleQuotedString;
			else if (hasSingle && !hasDouble) qs = doubleQuotedString;
			else qs = singleQuote ? singleQuotedString : doubleQuotedString;
		}
		return qs(value, ctx);
	}
	var blockEndNewlines;
	try {
		blockEndNewlines = /* @__PURE__ */ new RegExp("(^|(?<!\n))\n+(?!\n|$)", "g");
	} catch {
		blockEndNewlines = /\n+(?!\n|$)/g;
	}
	function blockString({ comment, type, value }, ctx, onComment, onChompKeep) {
		const { blockQuote, commentString, lineWidth } = ctx.options;
		if (!blockQuote || /\n[\t ]+$/.test(value)) return quotedString(value, ctx);
		const indent = ctx.indent || (ctx.forceBlockIndent || containsDocumentMarker(value) ? "  " : "");
		const literal = blockQuote === "literal" ? true : blockQuote === "folded" || type === Scalar.Scalar.BLOCK_FOLDED ? false : type === Scalar.Scalar.BLOCK_LITERAL ? true : !lineLengthOverLimit(value, lineWidth, indent.length);
		if (!value) return literal ? "|\n" : ">\n";
		let chomp;
		let endStart;
		for (endStart = value.length; endStart > 0; --endStart) {
			const ch = value[endStart - 1];
			if (ch !== "\n" && ch !== "	" && ch !== " ") break;
		}
		let end = value.substring(endStart);
		const endNlPos = end.indexOf("\n");
		if (endNlPos === -1) chomp = "-";
		else if (value === end || endNlPos !== end.length - 1) {
			chomp = "+";
			if (onChompKeep) onChompKeep();
		} else chomp = "";
		if (end) {
			value = value.slice(0, -end.length);
			if (end[end.length - 1] === "\n") end = end.slice(0, -1);
			end = end.replace(blockEndNewlines, `$&${indent}`);
		}
		let startWithSpace = false;
		let startEnd;
		let startNlPos = -1;
		for (startEnd = 0; startEnd < value.length; ++startEnd) {
			const ch = value[startEnd];
			if (ch === " ") startWithSpace = true;
			else if (ch === "\n") startNlPos = startEnd;
			else break;
		}
		let start = value.substring(0, startNlPos < startEnd ? startNlPos + 1 : startEnd);
		if (start) {
			value = value.substring(start.length);
			start = start.replace(/\n+/g, `$&${indent}`);
		}
		let header = (startWithSpace ? indent ? "2" : "1" : "") + chomp;
		if (comment) {
			header += " " + commentString(comment.replace(/ ?[\r\n]+/g, " "));
			if (onComment) onComment();
		}
		if (!literal) {
			const foldedValue = value.replace(/\n+/g, "\n$&").replace(/(?:^|\n)([\t ].*)(?:([\n\t ]*)\n(?![\n\t ]))?/g, "$1$2").replace(/\n+/g, `$&${indent}`);
			let literalFallback = false;
			const foldOptions = getFoldOptions(ctx, true);
			if (blockQuote !== "folded" && type !== Scalar.Scalar.BLOCK_FOLDED) foldOptions.onOverflow = () => {
				literalFallback = true;
			};
			const body = foldFlowLines.foldFlowLines(`${start}${foldedValue}${end}`, indent, foldFlowLines.FOLD_BLOCK, foldOptions);
			if (!literalFallback) return `>${header}\n${indent}${body}`;
		}
		value = value.replace(/\n+/g, `$&${indent}`);
		return `|${header}\n${indent}${start}${value}${end}`;
	}
	function plainString(item, ctx, onComment, onChompKeep) {
		const { type, value } = item;
		const { actualString, implicitKey, indent, indentStep, inFlow } = ctx;
		if (implicitKey && value.includes("\n") || inFlow && /[[\]{},]/.test(value)) return quotedString(value, ctx);
		if (/^[\n\t ,[\]{}#&*!|>'"%@`]|^[?-]$|^[?-][ \t]|[\n:][ \t]|[ \t]\n|[\n\t ]#|[\n\t :]$/.test(value)) return implicitKey || inFlow || !value.includes("\n") ? quotedString(value, ctx) : blockString(item, ctx, onComment, onChompKeep);
		if (!implicitKey && !inFlow && type !== Scalar.Scalar.PLAIN && value.includes("\n")) return blockString(item, ctx, onComment, onChompKeep);
		if (containsDocumentMarker(value)) {
			if (indent === "") {
				ctx.forceBlockIndent = true;
				return blockString(item, ctx, onComment, onChompKeep);
			} else if (implicitKey && indent === indentStep) return quotedString(value, ctx);
		}
		const str = value.replace(/\n+/g, `$&\n${indent}`);
		if (actualString) {
			const test = (tag) => tag.default && tag.tag !== "tag:yaml.org,2002:str" && tag.test?.test(str);
			const { compat, tags } = ctx.doc.schema;
			if (tags.some(test) || compat?.some(test)) return quotedString(value, ctx);
		}
		return implicitKey ? str : foldFlowLines.foldFlowLines(str, indent, foldFlowLines.FOLD_FLOW, getFoldOptions(ctx, false));
	}
	function stringifyString(item, ctx, onComment, onChompKeep) {
		const { implicitKey, inFlow } = ctx;
		const ss = typeof item.value === "string" ? item : Object.assign({}, item, { value: String(item.value) });
		let { type } = item;
		if (type !== Scalar.Scalar.QUOTE_DOUBLE) {
			if (/[\x00-\x08\x0b-\x1f\x7f-\x9f\u{D800}-\u{DFFF}]/u.test(ss.value)) type = Scalar.Scalar.QUOTE_DOUBLE;
		}
		const _stringify = (_type) => {
			switch (_type) {
				case Scalar.Scalar.BLOCK_FOLDED:
				case Scalar.Scalar.BLOCK_LITERAL: return implicitKey || inFlow ? quotedString(ss.value, ctx) : blockString(ss, ctx, onComment, onChompKeep);
				case Scalar.Scalar.QUOTE_DOUBLE: return doubleQuotedString(ss.value, ctx);
				case Scalar.Scalar.QUOTE_SINGLE: return singleQuotedString(ss.value, ctx);
				case Scalar.Scalar.PLAIN: return plainString(ss, ctx, onComment, onChompKeep);
				default: return null;
			}
		};
		let res = _stringify(type);
		if (res === null) {
			const { defaultKeyType, defaultStringType } = ctx.options;
			const t = implicitKey && defaultKeyType || defaultStringType;
			res = _stringify(t);
			if (res === null) throw new Error(`Unsupported default string type ${t}`);
		}
		return res;
	}
	exports.stringifyString = stringifyString;
}));
//#endregion
//#region node_modules/yaml/dist/stringify/stringify.js
var require_stringify = /* @__PURE__ */ __commonJSMin(((exports) => {
	var anchors = require_anchors();
	var identity = require_identity();
	var stringifyComment = require_stringifyComment();
	var stringifyString = require_stringifyString();
	function createStringifyContext(doc, options) {
		const opt = Object.assign({
			blockQuote: true,
			commentString: stringifyComment.stringifyComment,
			defaultKeyType: null,
			defaultStringType: "PLAIN",
			directives: null,
			doubleQuotedAsJSON: false,
			doubleQuotedMinMultiLineLength: 40,
			falseStr: "false",
			flowCollectionPadding: true,
			indentSeq: true,
			lineWidth: 80,
			minContentWidth: 20,
			nullStr: "null",
			simpleKeys: false,
			singleQuote: null,
			trailingComma: false,
			trueStr: "true",
			verifyAliasOrder: true
		}, doc.schema.toStringOptions, options);
		let inFlow;
		switch (opt.collectionStyle) {
			case "block":
				inFlow = false;
				break;
			case "flow":
				inFlow = true;
				break;
			default: inFlow = null;
		}
		return {
			anchors: /* @__PURE__ */ new Set(),
			doc,
			flowCollectionPadding: opt.flowCollectionPadding ? " " : "",
			indent: "",
			indentStep: typeof opt.indent === "number" ? " ".repeat(opt.indent) : "  ",
			inFlow,
			options: opt
		};
	}
	function getTagObject(tags, item) {
		if (item.tag) {
			const match = tags.filter((t) => t.tag === item.tag);
			if (match.length > 0) return match.find((t) => t.format === item.format) ?? match[0];
		}
		let tagObj = void 0;
		let obj;
		if (identity.isScalar(item)) {
			obj = item.value;
			let match = tags.filter((t) => t.identify?.(obj));
			if (match.length > 1) {
				const testMatch = match.filter((t) => t.test);
				if (testMatch.length > 0) match = testMatch;
			}
			tagObj = match.find((t) => t.format === item.format) ?? match.find((t) => !t.format);
		} else {
			obj = item;
			tagObj = tags.find((t) => t.nodeClass && obj instanceof t.nodeClass);
		}
		if (!tagObj) {
			const name = obj?.constructor?.name ?? (obj === null ? "null" : typeof obj);
			throw new Error(`Tag not resolved for ${name} value`);
		}
		return tagObj;
	}
	function stringifyProps(node, tagObj, { anchors: anchors$1, doc }) {
		if (!doc.directives) return "";
		const props = [];
		const anchor = (identity.isScalar(node) || identity.isCollection(node)) && node.anchor;
		if (anchor && anchors.anchorIsValid(anchor)) {
			anchors$1.add(anchor);
			props.push(`&${anchor}`);
		}
		const tag = node.tag ?? (tagObj.default ? null : tagObj.tag);
		if (tag) props.push(doc.directives.tagString(tag));
		return props.join(" ");
	}
	function stringify(item, ctx, onComment, onChompKeep) {
		if (identity.isPair(item)) return item.toString(ctx, onComment, onChompKeep);
		if (identity.isAlias(item)) {
			if (ctx.doc.directives) return item.toString(ctx);
			if (ctx.resolvedAliases?.has(item)) throw new TypeError(`Cannot stringify circular structure without alias nodes`);
			else {
				if (ctx.resolvedAliases) ctx.resolvedAliases.add(item);
				else ctx.resolvedAliases = /* @__PURE__ */ new Set([item]);
				item = item.resolve(ctx.doc);
			}
		}
		let tagObj = void 0;
		const node = identity.isNode(item) ? item : ctx.doc.createNode(item, { onTagObj: (o) => tagObj = o });
		tagObj ?? (tagObj = getTagObject(ctx.doc.schema.tags, node));
		const props = stringifyProps(node, tagObj, ctx);
		if (props.length > 0) ctx.indentAtStart = (ctx.indentAtStart ?? 0) + props.length + 1;
		const str = typeof tagObj.stringify === "function" ? tagObj.stringify(node, ctx, onComment, onChompKeep) : identity.isScalar(node) ? stringifyString.stringifyString(node, ctx, onComment, onChompKeep) : node.toString(ctx, onComment, onChompKeep);
		if (!props) return str;
		return identity.isScalar(node) || str[0] === "{" || str[0] === "[" ? `${props} ${str}` : `${props}\n${ctx.indent}${str}`;
	}
	exports.createStringifyContext = createStringifyContext;
	exports.stringify = stringify;
}));
//#endregion
//#region node_modules/yaml/dist/stringify/stringifyPair.js
var require_stringifyPair = /* @__PURE__ */ __commonJSMin(((exports) => {
	var identity = require_identity();
	var Scalar = require_Scalar();
	var stringify = require_stringify();
	var stringifyComment = require_stringifyComment();
	function stringifyPair({ key, value }, ctx, onComment, onChompKeep) {
		const { allNullValues, doc, indent, indentStep, options: { commentString, indentSeq, simpleKeys } } = ctx;
		let keyComment = identity.isNode(key) && key.comment || null;
		if (simpleKeys) {
			if (keyComment) throw new Error("With simple keys, key nodes cannot have comments");
			if (identity.isCollection(key) || !identity.isNode(key) && typeof key === "object") throw new Error("With simple keys, collection cannot be used as a key value");
		}
		let explicitKey = !simpleKeys && (!key || keyComment && value == null && !ctx.inFlow || identity.isCollection(key) || (identity.isScalar(key) ? key.type === Scalar.Scalar.BLOCK_FOLDED || key.type === Scalar.Scalar.BLOCK_LITERAL : typeof key === "object"));
		ctx = Object.assign({}, ctx, {
			allNullValues: false,
			implicitKey: !explicitKey && (simpleKeys || !allNullValues),
			indent: indent + indentStep
		});
		let keyCommentDone = false;
		let chompKeep = false;
		let str = stringify.stringify(key, ctx, () => keyCommentDone = true, () => chompKeep = true);
		if (!explicitKey && !ctx.inFlow && str.length > 1024) {
			if (simpleKeys) throw new Error("With simple keys, single line scalar must not span more than 1024 characters");
			explicitKey = true;
		}
		if (ctx.inFlow) {
			if (allNullValues || value == null) {
				if (keyCommentDone && onComment) onComment();
				return str === "" ? "?" : explicitKey ? `? ${str}` : str;
			}
		} else if (allNullValues && !simpleKeys || value == null && explicitKey) {
			str = `? ${str}`;
			if (keyComment && !keyCommentDone) str += stringifyComment.lineComment(str, ctx.indent, commentString(keyComment));
			else if (chompKeep && onChompKeep) onChompKeep();
			return str;
		}
		if (keyCommentDone) keyComment = null;
		if (explicitKey) {
			if (keyComment) str += stringifyComment.lineComment(str, ctx.indent, commentString(keyComment));
			str = `? ${str}\n${indent}:`;
		} else {
			str = `${str}:`;
			if (keyComment) str += stringifyComment.lineComment(str, ctx.indent, commentString(keyComment));
		}
		let vsb, vcb, valueComment;
		if (identity.isNode(value)) {
			vsb = !!value.spaceBefore;
			vcb = value.commentBefore;
			valueComment = value.comment;
		} else {
			vsb = false;
			vcb = null;
			valueComment = null;
			if (value && typeof value === "object") value = doc.createNode(value);
		}
		ctx.implicitKey = false;
		if (!explicitKey && !keyComment && identity.isScalar(value)) ctx.indentAtStart = str.length + 1;
		chompKeep = false;
		if (!indentSeq && indentStep.length >= 2 && !ctx.inFlow && !explicitKey && identity.isSeq(value) && !value.flow && !value.tag && !value.anchor) ctx.indent = ctx.indent.substring(2);
		let valueCommentDone = false;
		const valueStr = stringify.stringify(value, ctx, () => valueCommentDone = true, () => chompKeep = true);
		let ws = " ";
		if (keyComment || vsb || vcb) {
			ws = vsb ? "\n" : "";
			if (vcb) {
				const cs = commentString(vcb);
				ws += `\n${stringifyComment.indentComment(cs, ctx.indent)}`;
			}
			if (valueStr === "" && !ctx.inFlow) {
				if (ws === "\n" && valueComment) ws = "\n\n";
			} else ws += `\n${ctx.indent}`;
		} else if (!explicitKey && identity.isCollection(value)) {
			const vs0 = valueStr[0];
			const nl0 = valueStr.indexOf("\n");
			const hasNewline = nl0 !== -1;
			const flow = ctx.inFlow ?? value.flow ?? value.items.length === 0;
			if (hasNewline || !flow) {
				let hasPropsLine = false;
				if (hasNewline && (vs0 === "&" || vs0 === "!")) {
					let sp0 = valueStr.indexOf(" ");
					if (vs0 === "&" && sp0 !== -1 && sp0 < nl0 && valueStr[sp0 + 1] === "!") sp0 = valueStr.indexOf(" ", sp0 + 1);
					if (sp0 === -1 || nl0 < sp0) hasPropsLine = true;
				}
				if (!hasPropsLine) ws = `\n${ctx.indent}`;
			}
		} else if (valueStr === "" || valueStr[0] === "\n") ws = "";
		str += ws + valueStr;
		if (ctx.inFlow) {
			if (valueCommentDone && onComment) onComment();
		} else if (valueComment && !valueCommentDone) str += stringifyComment.lineComment(str, ctx.indent, commentString(valueComment));
		else if (chompKeep && onChompKeep) onChompKeep();
		return str;
	}
	exports.stringifyPair = stringifyPair;
}));
//#endregion
//#region node_modules/yaml/dist/log.js
var require_log = /* @__PURE__ */ __commonJSMin(((exports) => {
	var node_process$2 = __require("process");
	function debug(logLevel, ...messages) {
		if (logLevel === "debug") console.log(...messages);
	}
	function warn(logLevel, warning) {
		if (logLevel === "debug" || logLevel === "warn") if (typeof node_process$2.emitWarning === "function") node_process$2.emitWarning(warning);
		else console.warn(warning);
	}
	exports.debug = debug;
	exports.warn = warn;
}));
//#endregion
//#region node_modules/yaml/dist/schema/yaml-1.1/merge.js
var require_merge = /* @__PURE__ */ __commonJSMin(((exports) => {
	var identity = require_identity();
	var Scalar = require_Scalar();
	var MERGE_KEY = "<<";
	var merge = {
		identify: (value) => value === MERGE_KEY || typeof value === "symbol" && value.description === MERGE_KEY,
		default: "key",
		tag: "tag:yaml.org,2002:merge",
		test: /^<<$/,
		resolve: () => Object.assign(new Scalar.Scalar(Symbol(MERGE_KEY)), { addToJSMap: addMergeToJSMap }),
		stringify: () => MERGE_KEY
	};
	var isMergeKey = (ctx, key) => (merge.identify(key) || identity.isScalar(key) && (!key.type || key.type === Scalar.Scalar.PLAIN) && merge.identify(key.value)) && ctx?.doc.schema.tags.some((tag) => tag.tag === merge.tag && tag.default);
	function addMergeToJSMap(ctx, map, value) {
		const source = resolveAliasValue(ctx, value);
		if (identity.isSeq(source)) for (const it of source.items) mergeValue(ctx, map, it);
		else if (Array.isArray(source)) for (const it of source) mergeValue(ctx, map, it);
		else mergeValue(ctx, map, source);
	}
	function mergeValue(ctx, map, value) {
		const source = resolveAliasValue(ctx, value);
		if (!identity.isMap(source)) throw new Error("Merge sources must be maps or map aliases");
		const srcMap = source.toJSON(null, ctx, Map);
		for (const [key, value] of srcMap) if (map instanceof Map) {
			if (!map.has(key)) map.set(key, value);
		} else if (map instanceof Set) map.add(key);
		else if (!Object.prototype.hasOwnProperty.call(map, key)) Object.defineProperty(map, key, {
			value,
			writable: true,
			enumerable: true,
			configurable: true
		});
		return map;
	}
	function resolveAliasValue(ctx, value) {
		return ctx && identity.isAlias(value) ? value.resolve(ctx.doc, ctx) : value;
	}
	exports.addMergeToJSMap = addMergeToJSMap;
	exports.isMergeKey = isMergeKey;
	exports.merge = merge;
}));
//#endregion
//#region node_modules/yaml/dist/nodes/addPairToJSMap.js
var require_addPairToJSMap = /* @__PURE__ */ __commonJSMin(((exports) => {
	var log = require_log();
	var merge = require_merge();
	var stringify = require_stringify();
	var identity = require_identity();
	var toJS = require_toJS();
	function addPairToJSMap(ctx, map, { key, value }) {
		if (identity.isNode(key) && key.addToJSMap) key.addToJSMap(ctx, map, value);
		else if (merge.isMergeKey(ctx, key)) merge.addMergeToJSMap(ctx, map, value);
		else {
			const jsKey = toJS.toJS(key, "", ctx);
			if (map instanceof Map) map.set(jsKey, toJS.toJS(value, jsKey, ctx));
			else if (map instanceof Set) map.add(jsKey);
			else {
				const stringKey = stringifyKey(key, jsKey, ctx);
				const jsValue = toJS.toJS(value, stringKey, ctx);
				if (stringKey in map) Object.defineProperty(map, stringKey, {
					value: jsValue,
					writable: true,
					enumerable: true,
					configurable: true
				});
				else map[stringKey] = jsValue;
			}
		}
		return map;
	}
	function stringifyKey(key, jsKey, ctx) {
		if (jsKey === null) return "";
		if (typeof jsKey !== "object") return String(jsKey);
		if (identity.isNode(key) && ctx?.doc) {
			const strCtx = stringify.createStringifyContext(ctx.doc, {});
			strCtx.anchors = /* @__PURE__ */ new Set();
			for (const node of ctx.anchors.keys()) strCtx.anchors.add(node.anchor);
			strCtx.inFlow = true;
			strCtx.inStringifyKey = true;
			const strKey = key.toString(strCtx);
			if (!ctx.mapKeyWarned) {
				let jsonStr = JSON.stringify(strKey);
				if (jsonStr.length > 40) jsonStr = jsonStr.substring(0, 36) + "...\"";
				log.warn(ctx.doc.options.logLevel, `Keys with collection values will be stringified due to JS Object restrictions: ${jsonStr}. Set mapAsMap: true to use object keys.`);
				ctx.mapKeyWarned = true;
			}
			return strKey;
		}
		return JSON.stringify(jsKey);
	}
	exports.addPairToJSMap = addPairToJSMap;
}));
//#endregion
//#region node_modules/yaml/dist/nodes/Pair.js
var require_Pair = /* @__PURE__ */ __commonJSMin(((exports) => {
	var createNode = require_createNode();
	var stringifyPair = require_stringifyPair();
	var addPairToJSMap = require_addPairToJSMap();
	var identity = require_identity();
	function createPair(key, value, ctx) {
		return new Pair(createNode.createNode(key, void 0, ctx), createNode.createNode(value, void 0, ctx));
	}
	var Pair = class Pair {
		constructor(key, value = null) {
			Object.defineProperty(this, identity.NODE_TYPE, { value: identity.PAIR });
			this.key = key;
			this.value = value;
		}
		clone(schema) {
			let { key, value } = this;
			if (identity.isNode(key)) key = key.clone(schema);
			if (identity.isNode(value)) value = value.clone(schema);
			return new Pair(key, value);
		}
		toJSON(_, ctx) {
			const pair = ctx?.mapAsMap ? /* @__PURE__ */ new Map() : {};
			return addPairToJSMap.addPairToJSMap(ctx, pair, this);
		}
		toString(ctx, onComment, onChompKeep) {
			return ctx?.doc ? stringifyPair.stringifyPair(this, ctx, onComment, onChompKeep) : JSON.stringify(this);
		}
	};
	exports.Pair = Pair;
	exports.createPair = createPair;
}));
//#endregion
//#region node_modules/yaml/dist/stringify/stringifyCollection.js
var require_stringifyCollection = /* @__PURE__ */ __commonJSMin(((exports) => {
	var identity = require_identity();
	var stringify = require_stringify();
	var stringifyComment = require_stringifyComment();
	function stringifyCollection(collection, ctx, options) {
		return (ctx.inFlow ?? collection.flow ? stringifyFlowCollection : stringifyBlockCollection)(collection, ctx, options);
	}
	function stringifyBlockCollection({ comment, items }, ctx, { blockItemPrefix, flowChars, itemIndent, onChompKeep, onComment }) {
		const { indent, options: { commentString } } = ctx;
		const itemCtx = Object.assign({}, ctx, {
			indent: itemIndent,
			type: null
		});
		let chompKeep = false;
		const lines = [];
		for (let i = 0; i < items.length; ++i) {
			const item = items[i];
			let comment = null;
			if (identity.isNode(item)) {
				if (!chompKeep && item.spaceBefore) lines.push("");
				addCommentBefore(ctx, lines, item.commentBefore, chompKeep);
				if (item.comment) comment = item.comment;
			} else if (identity.isPair(item)) {
				const ik = identity.isNode(item.key) ? item.key : null;
				if (ik) {
					if (!chompKeep && ik.spaceBefore) lines.push("");
					addCommentBefore(ctx, lines, ik.commentBefore, chompKeep);
				}
			}
			chompKeep = false;
			let str = stringify.stringify(item, itemCtx, () => comment = null, () => chompKeep = true);
			if (comment) str += stringifyComment.lineComment(str, itemIndent, commentString(comment));
			if (chompKeep && comment) chompKeep = false;
			lines.push(blockItemPrefix + str);
		}
		let str;
		if (lines.length === 0) str = flowChars.start + flowChars.end;
		else {
			str = lines[0];
			for (let i = 1; i < lines.length; ++i) {
				const line = lines[i];
				str += line ? `\n${indent}${line}` : "\n";
			}
		}
		if (comment) {
			str += "\n" + stringifyComment.indentComment(commentString(comment), indent);
			if (onComment) onComment();
		} else if (chompKeep && onChompKeep) onChompKeep();
		return str;
	}
	function stringifyFlowCollection({ items }, ctx, { flowChars, itemIndent }) {
		const { indent, indentStep, flowCollectionPadding: fcPadding, options: { commentString } } = ctx;
		itemIndent += indentStep;
		const itemCtx = Object.assign({}, ctx, {
			indent: itemIndent,
			inFlow: true,
			type: null
		});
		let reqNewline = false;
		let linesAtValue = 0;
		const lines = [];
		for (let i = 0; i < items.length; ++i) {
			const item = items[i];
			let comment = null;
			if (identity.isNode(item)) {
				if (item.spaceBefore) lines.push("");
				addCommentBefore(ctx, lines, item.commentBefore, false);
				if (item.comment) comment = item.comment;
			} else if (identity.isPair(item)) {
				const ik = identity.isNode(item.key) ? item.key : null;
				if (ik) {
					if (ik.spaceBefore) lines.push("");
					addCommentBefore(ctx, lines, ik.commentBefore, false);
					if (ik.comment) reqNewline = true;
				}
				const iv = identity.isNode(item.value) ? item.value : null;
				if (iv) {
					if (iv.comment) comment = iv.comment;
					if (iv.commentBefore) reqNewline = true;
				} else if (item.value == null && ik?.comment) comment = ik.comment;
			}
			if (comment) reqNewline = true;
			let str = stringify.stringify(item, itemCtx, () => comment = null);
			reqNewline || (reqNewline = lines.length > linesAtValue || str.includes("\n"));
			if (i < items.length - 1) str += ",";
			else if (ctx.options.trailingComma) {
				if (ctx.options.lineWidth > 0) reqNewline || (reqNewline = lines.reduce((sum, line) => sum + line.length + 2, 2) + (str.length + 2) > ctx.options.lineWidth);
				if (reqNewline) str += ",";
			}
			if (comment) str += stringifyComment.lineComment(str, itemIndent, commentString(comment));
			lines.push(str);
			linesAtValue = lines.length;
		}
		const { start, end } = flowChars;
		if (lines.length === 0) return start + end;
		else {
			if (!reqNewline) {
				const len = lines.reduce((sum, line) => sum + line.length + 2, 2);
				reqNewline = ctx.options.lineWidth > 0 && len > ctx.options.lineWidth;
			}
			if (reqNewline) {
				let str = start;
				for (const line of lines) str += line ? `\n${indentStep}${indent}${line}` : "\n";
				return `${str}\n${indent}${end}`;
			} else return `${start}${fcPadding}${lines.join(" ")}${fcPadding}${end}`;
		}
	}
	function addCommentBefore({ indent, options: { commentString } }, lines, comment, chompKeep) {
		if (comment && chompKeep) comment = comment.replace(/^\n+/, "");
		if (comment) {
			const ic = stringifyComment.indentComment(commentString(comment), indent);
			lines.push(ic.trimStart());
		}
	}
	exports.stringifyCollection = stringifyCollection;
}));
//#endregion
//#region node_modules/yaml/dist/nodes/YAMLMap.js
var require_YAMLMap = /* @__PURE__ */ __commonJSMin(((exports) => {
	var stringifyCollection = require_stringifyCollection();
	var addPairToJSMap = require_addPairToJSMap();
	var Collection = require_Collection();
	var identity = require_identity();
	var Pair = require_Pair();
	var Scalar = require_Scalar();
	function findPair(items, key) {
		const k = identity.isScalar(key) ? key.value : key;
		for (const it of items) if (identity.isPair(it)) {
			if (it.key === key || it.key === k) return it;
			if (identity.isScalar(it.key) && it.key.value === k) return it;
		}
	}
	var YAMLMap = class extends Collection.Collection {
		static get tagName() {
			return "tag:yaml.org,2002:map";
		}
		constructor(schema) {
			super(identity.MAP, schema);
			this.items = [];
		}
		/**
		* A generic collection parsing method that can be extended
		* to other node classes that inherit from YAMLMap
		*/
		static from(schema, obj, ctx) {
			const { keepUndefined, replacer } = ctx;
			const map = new this(schema);
			const add = (key, value) => {
				if (typeof replacer === "function") value = replacer.call(obj, key, value);
				else if (Array.isArray(replacer) && !replacer.includes(key)) return;
				if (value !== void 0 || keepUndefined) map.items.push(Pair.createPair(key, value, ctx));
			};
			if (obj instanceof Map) for (const [key, value] of obj) add(key, value);
			else if (obj && typeof obj === "object") for (const key of Object.keys(obj)) add(key, obj[key]);
			if (typeof schema.sortMapEntries === "function") map.items.sort(schema.sortMapEntries);
			return map;
		}
		/**
		* Adds a value to the collection.
		*
		* @param overwrite - If not set `true`, using a key that is already in the
		*   collection will throw. Otherwise, overwrites the previous value.
		*/
		add(pair, overwrite) {
			let _pair;
			if (identity.isPair(pair)) _pair = pair;
			else if (!pair || typeof pair !== "object" || !("key" in pair)) _pair = new Pair.Pair(pair, pair?.value);
			else _pair = new Pair.Pair(pair.key, pair.value);
			const prev = findPair(this.items, _pair.key);
			const sortEntries = this.schema?.sortMapEntries;
			if (prev) {
				if (!overwrite) throw new Error(`Key ${_pair.key} already set`);
				if (identity.isScalar(prev.value) && Scalar.isScalarValue(_pair.value)) prev.value.value = _pair.value;
				else prev.value = _pair.value;
			} else if (sortEntries) {
				const i = this.items.findIndex((item) => sortEntries(_pair, item) < 0);
				if (i === -1) this.items.push(_pair);
				else this.items.splice(i, 0, _pair);
			} else this.items.push(_pair);
		}
		delete(key) {
			const it = findPair(this.items, key);
			if (!it) return false;
			return this.items.splice(this.items.indexOf(it), 1).length > 0;
		}
		get(key, keepScalar) {
			const node = findPair(this.items, key)?.value;
			return (!keepScalar && identity.isScalar(node) ? node.value : node) ?? void 0;
		}
		has(key) {
			return !!findPair(this.items, key);
		}
		set(key, value) {
			this.add(new Pair.Pair(key, value), true);
		}
		/**
		* @param ctx - Conversion context, originally set in Document#toJS()
		* @param {Class} Type - If set, forces the returned collection type
		* @returns Instance of Type, Map, or Object
		*/
		toJSON(_, ctx, Type) {
			const map = Type ? new Type() : ctx?.mapAsMap ? /* @__PURE__ */ new Map() : {};
			if (ctx?.onCreate) ctx.onCreate(map);
			for (const item of this.items) addPairToJSMap.addPairToJSMap(ctx, map, item);
			return map;
		}
		toString(ctx, onComment, onChompKeep) {
			if (!ctx) return JSON.stringify(this);
			for (const item of this.items) if (!identity.isPair(item)) throw new Error(`Map items must all be pairs; found ${JSON.stringify(item)} instead`);
			if (!ctx.allNullValues && this.hasAllNullValues(false)) ctx = Object.assign({}, ctx, { allNullValues: true });
			return stringifyCollection.stringifyCollection(this, ctx, {
				blockItemPrefix: "",
				flowChars: {
					start: "{",
					end: "}"
				},
				itemIndent: ctx.indent || "",
				onChompKeep,
				onComment
			});
		}
	};
	exports.YAMLMap = YAMLMap;
	exports.findPair = findPair;
}));
//#endregion
//#region node_modules/yaml/dist/schema/common/map.js
var require_map = /* @__PURE__ */ __commonJSMin(((exports) => {
	var identity = require_identity();
	var YAMLMap = require_YAMLMap();
	exports.map = {
		collection: "map",
		default: true,
		nodeClass: YAMLMap.YAMLMap,
		tag: "tag:yaml.org,2002:map",
		resolve(map, onError) {
			if (!identity.isMap(map)) onError("Expected a mapping for this tag");
			return map;
		},
		createNode: (schema, obj, ctx) => YAMLMap.YAMLMap.from(schema, obj, ctx)
	};
}));
//#endregion
//#region node_modules/yaml/dist/nodes/YAMLSeq.js
var require_YAMLSeq = /* @__PURE__ */ __commonJSMin(((exports) => {
	var createNode = require_createNode();
	var stringifyCollection = require_stringifyCollection();
	var Collection = require_Collection();
	var identity = require_identity();
	var Scalar = require_Scalar();
	var toJS = require_toJS();
	var YAMLSeq = class extends Collection.Collection {
		static get tagName() {
			return "tag:yaml.org,2002:seq";
		}
		constructor(schema) {
			super(identity.SEQ, schema);
			this.items = [];
		}
		add(value) {
			this.items.push(value);
		}
		/**
		* Removes a value from the collection.
		*
		* `key` must contain a representation of an integer for this to succeed.
		* It may be wrapped in a `Scalar`.
		*
		* @returns `true` if the item was found and removed.
		*/
		delete(key) {
			const idx = asItemIndex(key);
			if (typeof idx !== "number") return false;
			return this.items.splice(idx, 1).length > 0;
		}
		get(key, keepScalar) {
			const idx = asItemIndex(key);
			if (typeof idx !== "number") return void 0;
			const it = this.items[idx];
			return !keepScalar && identity.isScalar(it) ? it.value : it;
		}
		/**
		* Checks if the collection includes a value with the key `key`.
		*
		* `key` must contain a representation of an integer for this to succeed.
		* It may be wrapped in a `Scalar`.
		*/
		has(key) {
			const idx = asItemIndex(key);
			return typeof idx === "number" && idx < this.items.length;
		}
		/**
		* Sets a value in this collection. For `!!set`, `value` needs to be a
		* boolean to add/remove the item from the set.
		*
		* If `key` does not contain a representation of an integer, this will throw.
		* It may be wrapped in a `Scalar`.
		*/
		set(key, value) {
			const idx = asItemIndex(key);
			if (typeof idx !== "number") throw new Error(`Expected a valid index, not ${key}.`);
			const prev = this.items[idx];
			if (identity.isScalar(prev) && Scalar.isScalarValue(value)) prev.value = value;
			else this.items[idx] = value;
		}
		toJSON(_, ctx) {
			const seq = [];
			if (ctx?.onCreate) ctx.onCreate(seq);
			let i = 0;
			for (const item of this.items) seq.push(toJS.toJS(item, String(i++), ctx));
			return seq;
		}
		toString(ctx, onComment, onChompKeep) {
			if (!ctx) return JSON.stringify(this);
			return stringifyCollection.stringifyCollection(this, ctx, {
				blockItemPrefix: "- ",
				flowChars: {
					start: "[",
					end: "]"
				},
				itemIndent: (ctx.indent || "") + "  ",
				onChompKeep,
				onComment
			});
		}
		static from(schema, obj, ctx) {
			const { replacer } = ctx;
			const seq = new this(schema);
			if (obj && Symbol.iterator in Object(obj)) {
				let i = 0;
				for (let it of obj) {
					if (typeof replacer === "function") {
						const key = obj instanceof Set ? it : String(i++);
						it = replacer.call(obj, key, it);
					}
					seq.items.push(createNode.createNode(it, void 0, ctx));
				}
			}
			return seq;
		}
	};
	function asItemIndex(key) {
		let idx = identity.isScalar(key) ? key.value : key;
		if (idx && typeof idx === "string") idx = Number(idx);
		return typeof idx === "number" && Number.isInteger(idx) && idx >= 0 ? idx : null;
	}
	exports.YAMLSeq = YAMLSeq;
}));
//#endregion
//#region node_modules/yaml/dist/schema/common/seq.js
var require_seq = /* @__PURE__ */ __commonJSMin(((exports) => {
	var identity = require_identity();
	var YAMLSeq = require_YAMLSeq();
	exports.seq = {
		collection: "seq",
		default: true,
		nodeClass: YAMLSeq.YAMLSeq,
		tag: "tag:yaml.org,2002:seq",
		resolve(seq, onError) {
			if (!identity.isSeq(seq)) onError("Expected a sequence for this tag");
			return seq;
		},
		createNode: (schema, obj, ctx) => YAMLSeq.YAMLSeq.from(schema, obj, ctx)
	};
}));
//#endregion
//#region node_modules/yaml/dist/schema/common/string.js
var require_string$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	var stringifyString = require_stringifyString();
	exports.string = {
		identify: (value) => typeof value === "string",
		default: true,
		tag: "tag:yaml.org,2002:str",
		resolve: (str) => str,
		stringify(item, ctx, onComment, onChompKeep) {
			ctx = Object.assign({ actualString: true }, ctx);
			return stringifyString.stringifyString(item, ctx, onComment, onChompKeep);
		}
	};
}));
//#endregion
//#region node_modules/yaml/dist/schema/common/null.js
var require_null = /* @__PURE__ */ __commonJSMin(((exports) => {
	var Scalar = require_Scalar();
	var nullTag = {
		identify: (value) => value == null,
		createNode: () => new Scalar.Scalar(null),
		default: true,
		tag: "tag:yaml.org,2002:null",
		test: /^(?:~|[Nn]ull|NULL)?$/,
		resolve: () => new Scalar.Scalar(null),
		stringify: ({ source }, ctx) => typeof source === "string" && nullTag.test.test(source) ? source : ctx.options.nullStr
	};
	exports.nullTag = nullTag;
}));
//#endregion
//#region node_modules/yaml/dist/schema/core/bool.js
var require_bool$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	var Scalar = require_Scalar();
	var boolTag = {
		identify: (value) => typeof value === "boolean",
		default: true,
		tag: "tag:yaml.org,2002:bool",
		test: /^(?:[Tt]rue|TRUE|[Ff]alse|FALSE)$/,
		resolve: (str) => new Scalar.Scalar(str[0] === "t" || str[0] === "T"),
		stringify({ source, value }, ctx) {
			if (source && boolTag.test.test(source)) {
				if (value === (source[0] === "t" || source[0] === "T")) return source;
			}
			return value ? ctx.options.trueStr : ctx.options.falseStr;
		}
	};
	exports.boolTag = boolTag;
}));
//#endregion
//#region node_modules/yaml/dist/stringify/stringifyNumber.js
var require_stringifyNumber = /* @__PURE__ */ __commonJSMin(((exports) => {
	function stringifyNumber({ format, minFractionDigits, tag, value }) {
		if (typeof value === "bigint") return String(value);
		const num = typeof value === "number" ? value : Number(value);
		if (!isFinite(num)) return isNaN(num) ? ".nan" : num < 0 ? "-.inf" : ".inf";
		let n = Object.is(value, -0) ? "-0" : JSON.stringify(value);
		if (!format && minFractionDigits && (!tag || tag === "tag:yaml.org,2002:float") && /^-?\d/.test(n) && !n.includes("e")) {
			let i = n.indexOf(".");
			if (i < 0) {
				i = n.length;
				n += ".";
			}
			let d = minFractionDigits - (n.length - i - 1);
			while (d-- > 0) n += "0";
		}
		return n;
	}
	exports.stringifyNumber = stringifyNumber;
}));
//#endregion
//#region node_modules/yaml/dist/schema/core/float.js
var require_float$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	var Scalar = require_Scalar();
	var stringifyNumber = require_stringifyNumber();
	var floatNaN = {
		identify: (value) => typeof value === "number",
		default: true,
		tag: "tag:yaml.org,2002:float",
		test: /^(?:[-+]?\.(?:inf|Inf|INF)|\.nan|\.NaN|\.NAN)$/,
		resolve: (str) => str.slice(-3).toLowerCase() === "nan" ? NaN : str[0] === "-" ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY,
		stringify: stringifyNumber.stringifyNumber
	};
	var floatExp = {
		identify: (value) => typeof value === "number",
		default: true,
		tag: "tag:yaml.org,2002:float",
		format: "EXP",
		test: /^[-+]?(?:\.[0-9]+|[0-9]+(?:\.[0-9]*)?)[eE][-+]?[0-9]+$/,
		resolve: (str) => parseFloat(str),
		stringify(node) {
			const num = Number(node.value);
			return isFinite(num) ? num.toExponential() : stringifyNumber.stringifyNumber(node);
		}
	};
	exports.float = {
		identify: (value) => typeof value === "number",
		default: true,
		tag: "tag:yaml.org,2002:float",
		test: /^[-+]?(?:\.[0-9]+|[0-9]+\.[0-9]*)$/,
		resolve(str) {
			const node = new Scalar.Scalar(parseFloat(str));
			const dot = str.indexOf(".");
			if (dot !== -1 && str[str.length - 1] === "0") node.minFractionDigits = str.length - dot - 1;
			return node;
		},
		stringify: stringifyNumber.stringifyNumber
	};
	exports.floatExp = floatExp;
	exports.floatNaN = floatNaN;
}));
//#endregion
//#region node_modules/yaml/dist/schema/core/int.js
var require_int$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	var stringifyNumber = require_stringifyNumber();
	var intIdentify = (value) => typeof value === "bigint" || Number.isInteger(value);
	var intResolve = (str, offset, radix, { intAsBigInt }) => intAsBigInt ? BigInt(str) : parseInt(str.substring(offset), radix);
	function intStringify(node, radix, prefix) {
		const { value } = node;
		if (intIdentify(value) && value >= 0) return prefix + value.toString(radix);
		return stringifyNumber.stringifyNumber(node);
	}
	var intOct = {
		identify: (value) => intIdentify(value) && value >= 0,
		default: true,
		tag: "tag:yaml.org,2002:int",
		format: "OCT",
		test: /^0o[0-7]+$/,
		resolve: (str, _onError, opt) => intResolve(str, 2, 8, opt),
		stringify: (node) => intStringify(node, 8, "0o")
	};
	var int = {
		identify: intIdentify,
		default: true,
		tag: "tag:yaml.org,2002:int",
		test: /^[-+]?[0-9]+$/,
		resolve: (str, _onError, opt) => intResolve(str, 0, 10, opt),
		stringify: stringifyNumber.stringifyNumber
	};
	var intHex = {
		identify: (value) => intIdentify(value) && value >= 0,
		default: true,
		tag: "tag:yaml.org,2002:int",
		format: "HEX",
		test: /^0x[0-9a-fA-F]+$/,
		resolve: (str, _onError, opt) => intResolve(str, 2, 16, opt),
		stringify: (node) => intStringify(node, 16, "0x")
	};
	exports.int = int;
	exports.intHex = intHex;
	exports.intOct = intOct;
}));
//#endregion
//#region node_modules/yaml/dist/schema/core/schema.js
var require_schema$2 = /* @__PURE__ */ __commonJSMin(((exports) => {
	var map = require_map();
	var _null = require_null();
	var seq = require_seq();
	var string = require_string$1();
	var bool = require_bool$1();
	var float = require_float$1();
	var int = require_int$1();
	exports.schema = [
		map.map,
		seq.seq,
		string.string,
		_null.nullTag,
		bool.boolTag,
		int.intOct,
		int.int,
		int.intHex,
		float.floatNaN,
		float.floatExp,
		float.float
	];
}));
//#endregion
//#region node_modules/yaml/dist/schema/json/schema.js
var require_schema$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	var Scalar = require_Scalar();
	var map = require_map();
	var seq = require_seq();
	function intIdentify(value) {
		return typeof value === "bigint" || Number.isInteger(value);
	}
	var stringifyJSON = ({ value }) => JSON.stringify(value);
	var jsonScalars = [
		{
			identify: (value) => typeof value === "string",
			default: true,
			tag: "tag:yaml.org,2002:str",
			resolve: (str) => str,
			stringify: stringifyJSON
		},
		{
			identify: (value) => value == null,
			createNode: () => new Scalar.Scalar(null),
			default: true,
			tag: "tag:yaml.org,2002:null",
			test: /^null$/,
			resolve: () => null,
			stringify: stringifyJSON
		},
		{
			identify: (value) => typeof value === "boolean",
			default: true,
			tag: "tag:yaml.org,2002:bool",
			test: /^true$|^false$/,
			resolve: (str) => str === "true",
			stringify: stringifyJSON
		},
		{
			identify: intIdentify,
			default: true,
			tag: "tag:yaml.org,2002:int",
			test: /^-?(?:0|[1-9][0-9]*)$/,
			resolve: (str, _onError, { intAsBigInt }) => intAsBigInt ? BigInt(str) : parseInt(str, 10),
			stringify: ({ value }) => intIdentify(value) ? value.toString() : JSON.stringify(value)
		},
		{
			identify: (value) => typeof value === "number",
			default: true,
			tag: "tag:yaml.org,2002:float",
			test: /^-?(?:0|[1-9][0-9]*)(?:\.[0-9]*)?(?:[eE][-+]?[0-9]+)?$/,
			resolve: (str) => parseFloat(str),
			stringify: stringifyJSON
		}
	];
	exports.schema = [map.map, seq.seq].concat(jsonScalars, {
		default: true,
		tag: "",
		test: /^/,
		resolve(str, onError) {
			onError(`Unresolved plain scalar ${JSON.stringify(str)}`);
			return str;
		}
	});
}));
//#endregion
//#region node_modules/yaml/dist/schema/yaml-1.1/binary.js
var require_binary = /* @__PURE__ */ __commonJSMin(((exports) => {
	var node_buffer = __require("buffer");
	var Scalar = require_Scalar();
	var stringifyString = require_stringifyString();
	exports.binary = {
		identify: (value) => value instanceof Uint8Array,
		default: false,
		tag: "tag:yaml.org,2002:binary",
		/**
		* Returns a Buffer in node and an Uint8Array in browsers
		*
		* To use the resulting buffer as an image, you'll want to do something like:
		*
		*   const blob = new Blob([buffer], { type: 'image/jpeg' })
		*   document.querySelector('#photo').src = URL.createObjectURL(blob)
		*/
		resolve(src, onError) {
			if (typeof node_buffer.Buffer === "function") return node_buffer.Buffer.from(src, "base64");
			else if (typeof atob === "function") {
				const str = atob(src.replace(/[\n\r]/g, ""));
				const buffer = new Uint8Array(str.length);
				for (let i = 0; i < str.length; ++i) buffer[i] = str.charCodeAt(i);
				return buffer;
			} else {
				onError("This environment does not support reading binary tags; either Buffer or atob is required");
				return src;
			}
		},
		stringify({ comment, type, value }, ctx, onComment, onChompKeep) {
			if (!value) return "";
			const buf = value;
			let str;
			if (typeof node_buffer.Buffer === "function") str = buf instanceof node_buffer.Buffer ? buf.toString("base64") : node_buffer.Buffer.from(buf.buffer).toString("base64");
			else if (typeof btoa === "function") {
				let s = "";
				for (let i = 0; i < buf.length; ++i) s += String.fromCharCode(buf[i]);
				str = btoa(s);
			} else throw new Error("This environment does not support writing binary tags; either Buffer or btoa is required");
			type ?? (type = Scalar.Scalar.BLOCK_LITERAL);
			if (type !== Scalar.Scalar.QUOTE_DOUBLE) {
				const lineWidth = Math.max(ctx.options.lineWidth - ctx.indent.length, ctx.options.minContentWidth);
				const n = Math.ceil(str.length / lineWidth);
				const lines = new Array(n);
				for (let i = 0, o = 0; i < n; ++i, o += lineWidth) lines[i] = str.substr(o, lineWidth);
				str = lines.join(type === Scalar.Scalar.BLOCK_LITERAL ? "\n" : " ");
			}
			return stringifyString.stringifyString({
				comment,
				type,
				value: str
			}, ctx, onComment, onChompKeep);
		}
	};
}));
//#endregion
//#region node_modules/yaml/dist/schema/yaml-1.1/pairs.js
var require_pairs = /* @__PURE__ */ __commonJSMin(((exports) => {
	var identity = require_identity();
	var Pair = require_Pair();
	var Scalar = require_Scalar();
	var YAMLSeq = require_YAMLSeq();
	function resolvePairs(seq, onError) {
		if (identity.isSeq(seq)) for (let i = 0; i < seq.items.length; ++i) {
			let item = seq.items[i];
			if (identity.isPair(item)) continue;
			else if (identity.isMap(item)) {
				if (item.items.length > 1) onError("Each pair must have its own sequence indicator");
				const pair = item.items[0] || new Pair.Pair(new Scalar.Scalar(null));
				if (item.commentBefore) pair.key.commentBefore = pair.key.commentBefore ? `${item.commentBefore}\n${pair.key.commentBefore}` : item.commentBefore;
				if (item.comment) {
					const cn = pair.value ?? pair.key;
					cn.comment = cn.comment ? `${item.comment}\n${cn.comment}` : item.comment;
				}
				item = pair;
			}
			seq.items[i] = identity.isPair(item) ? item : new Pair.Pair(item);
		}
		else onError("Expected a sequence for this tag");
		return seq;
	}
	function createPairs(schema, iterable, ctx) {
		const { replacer } = ctx;
		const pairs = new YAMLSeq.YAMLSeq(schema);
		pairs.tag = "tag:yaml.org,2002:pairs";
		let i = 0;
		if (iterable && Symbol.iterator in Object(iterable)) for (let it of iterable) {
			if (typeof replacer === "function") it = replacer.call(iterable, String(i++), it);
			let key, value;
			if (Array.isArray(it)) if (it.length === 2) {
				key = it[0];
				value = it[1];
			} else throw new TypeError(`Expected [key, value] tuple: ${it}`);
			else if (it && it instanceof Object) {
				const keys = Object.keys(it);
				if (keys.length === 1) {
					key = keys[0];
					value = it[key];
				} else throw new TypeError(`Expected tuple with one key, not ${keys.length} keys`);
			} else key = it;
			pairs.items.push(Pair.createPair(key, value, ctx));
		}
		return pairs;
	}
	var pairs = {
		collection: "seq",
		default: false,
		tag: "tag:yaml.org,2002:pairs",
		resolve: resolvePairs,
		createNode: createPairs
	};
	exports.createPairs = createPairs;
	exports.pairs = pairs;
	exports.resolvePairs = resolvePairs;
}));
//#endregion
//#region node_modules/yaml/dist/schema/yaml-1.1/omap.js
var require_omap = /* @__PURE__ */ __commonJSMin(((exports) => {
	var identity = require_identity();
	var toJS = require_toJS();
	var YAMLMap = require_YAMLMap();
	var YAMLSeq = require_YAMLSeq();
	var pairs = require_pairs();
	var YAMLOMap = class YAMLOMap extends YAMLSeq.YAMLSeq {
		constructor() {
			super();
			this.add = YAMLMap.YAMLMap.prototype.add.bind(this);
			this.delete = YAMLMap.YAMLMap.prototype.delete.bind(this);
			this.get = YAMLMap.YAMLMap.prototype.get.bind(this);
			this.has = YAMLMap.YAMLMap.prototype.has.bind(this);
			this.set = YAMLMap.YAMLMap.prototype.set.bind(this);
			this.tag = YAMLOMap.tag;
		}
		/**
		* If `ctx` is given, the return type is actually `Map<unknown, unknown>`,
		* but TypeScript won't allow widening the signature of a child method.
		*/
		toJSON(_, ctx) {
			if (!ctx) return super.toJSON(_);
			const map = /* @__PURE__ */ new Map();
			if (ctx?.onCreate) ctx.onCreate(map);
			for (const pair of this.items) {
				let key, value;
				if (identity.isPair(pair)) {
					key = toJS.toJS(pair.key, "", ctx);
					value = toJS.toJS(pair.value, key, ctx);
				} else key = toJS.toJS(pair, "", ctx);
				if (map.has(key)) throw new Error("Ordered maps must not include duplicate keys");
				map.set(key, value);
			}
			return map;
		}
		static from(schema, iterable, ctx) {
			const pairs$1 = pairs.createPairs(schema, iterable, ctx);
			const omap = new this();
			omap.items = pairs$1.items;
			return omap;
		}
	};
	YAMLOMap.tag = "tag:yaml.org,2002:omap";
	var omap = {
		collection: "seq",
		identify: (value) => value instanceof Map,
		nodeClass: YAMLOMap,
		default: false,
		tag: "tag:yaml.org,2002:omap",
		resolve(seq, onError) {
			const pairs$1 = pairs.resolvePairs(seq, onError);
			const seenKeys = [];
			for (const { key } of pairs$1.items) if (identity.isScalar(key)) if (seenKeys.includes(key.value)) onError(`Ordered maps must not include duplicate keys: ${key.value}`);
			else seenKeys.push(key.value);
			return Object.assign(new YAMLOMap(), pairs$1);
		},
		createNode: (schema, iterable, ctx) => YAMLOMap.from(schema, iterable, ctx)
	};
	exports.YAMLOMap = YAMLOMap;
	exports.omap = omap;
}));
//#endregion
//#region node_modules/yaml/dist/schema/yaml-1.1/bool.js
var require_bool = /* @__PURE__ */ __commonJSMin(((exports) => {
	var Scalar = require_Scalar();
	function boolStringify({ value, source }, ctx) {
		if (source && (value ? trueTag : falseTag).test.test(source)) return source;
		return value ? ctx.options.trueStr : ctx.options.falseStr;
	}
	var trueTag = {
		identify: (value) => value === true,
		default: true,
		tag: "tag:yaml.org,2002:bool",
		test: /^(?:Y|y|[Yy]es|YES|[Tt]rue|TRUE|[Oo]n|ON)$/,
		resolve: () => new Scalar.Scalar(true),
		stringify: boolStringify
	};
	var falseTag = {
		identify: (value) => value === false,
		default: true,
		tag: "tag:yaml.org,2002:bool",
		test: /^(?:N|n|[Nn]o|NO|[Ff]alse|FALSE|[Oo]ff|OFF)$/,
		resolve: () => new Scalar.Scalar(false),
		stringify: boolStringify
	};
	exports.falseTag = falseTag;
	exports.trueTag = trueTag;
}));
//#endregion
//#region node_modules/yaml/dist/schema/yaml-1.1/float.js
var require_float = /* @__PURE__ */ __commonJSMin(((exports) => {
	var Scalar = require_Scalar();
	var stringifyNumber = require_stringifyNumber();
	var floatNaN = {
		identify: (value) => typeof value === "number",
		default: true,
		tag: "tag:yaml.org,2002:float",
		test: /^(?:[-+]?\.(?:inf|Inf|INF)|\.nan|\.NaN|\.NAN)$/,
		resolve: (str) => str.slice(-3).toLowerCase() === "nan" ? NaN : str[0] === "-" ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY,
		stringify: stringifyNumber.stringifyNumber
	};
	var floatExp = {
		identify: (value) => typeof value === "number",
		default: true,
		tag: "tag:yaml.org,2002:float",
		format: "EXP",
		test: /^[-+]?(?:[0-9][0-9_]*)?(?:\.[0-9_]*)?[eE][-+]?[0-9]+$/,
		resolve: (str) => parseFloat(str.replace(/_/g, "")),
		stringify(node) {
			const num = Number(node.value);
			return isFinite(num) ? num.toExponential() : stringifyNumber.stringifyNumber(node);
		}
	};
	exports.float = {
		identify: (value) => typeof value === "number",
		default: true,
		tag: "tag:yaml.org,2002:float",
		test: /^[-+]?(?:[0-9][0-9_]*)?\.[0-9_]*$/,
		resolve(str) {
			const node = new Scalar.Scalar(parseFloat(str.replace(/_/g, "")));
			const dot = str.indexOf(".");
			if (dot !== -1) {
				const f = str.substring(dot + 1).replace(/_/g, "");
				if (f[f.length - 1] === "0") node.minFractionDigits = f.length;
			}
			return node;
		},
		stringify: stringifyNumber.stringifyNumber
	};
	exports.floatExp = floatExp;
	exports.floatNaN = floatNaN;
}));
//#endregion
//#region node_modules/yaml/dist/schema/yaml-1.1/int.js
var require_int = /* @__PURE__ */ __commonJSMin(((exports) => {
	var stringifyNumber = require_stringifyNumber();
	var intIdentify = (value) => typeof value === "bigint" || Number.isInteger(value);
	function intResolve(str, offset, radix, { intAsBigInt }) {
		const sign = str[0];
		if (sign === "-" || sign === "+") offset += 1;
		str = str.substring(offset).replace(/_/g, "");
		if (intAsBigInt) {
			switch (radix) {
				case 2:
					str = `0b${str}`;
					break;
				case 8:
					str = `0o${str}`;
					break;
				case 16:
					str = `0x${str}`;
					break;
			}
			const n = BigInt(str);
			return sign === "-" ? BigInt(-1) * n : n;
		}
		const n = parseInt(str, radix);
		return sign === "-" ? -1 * n : n;
	}
	function intStringify(node, radix, prefix) {
		const { value } = node;
		if (intIdentify(value)) {
			const str = value.toString(radix);
			return value < 0 ? "-" + prefix + str.substr(1) : prefix + str;
		}
		return stringifyNumber.stringifyNumber(node);
	}
	var intBin = {
		identify: intIdentify,
		default: true,
		tag: "tag:yaml.org,2002:int",
		format: "BIN",
		test: /^[-+]?0b[0-1_]+$/,
		resolve: (str, _onError, opt) => intResolve(str, 2, 2, opt),
		stringify: (node) => intStringify(node, 2, "0b")
	};
	var intOct = {
		identify: intIdentify,
		default: true,
		tag: "tag:yaml.org,2002:int",
		format: "OCT",
		test: /^[-+]?0[0-7_]+$/,
		resolve: (str, _onError, opt) => intResolve(str, 1, 8, opt),
		stringify: (node) => intStringify(node, 8, "0")
	};
	var int = {
		identify: intIdentify,
		default: true,
		tag: "tag:yaml.org,2002:int",
		test: /^[-+]?[0-9][0-9_]*$/,
		resolve: (str, _onError, opt) => intResolve(str, 0, 10, opt),
		stringify: stringifyNumber.stringifyNumber
	};
	var intHex = {
		identify: intIdentify,
		default: true,
		tag: "tag:yaml.org,2002:int",
		format: "HEX",
		test: /^[-+]?0x[0-9a-fA-F_]+$/,
		resolve: (str, _onError, opt) => intResolve(str, 2, 16, opt),
		stringify: (node) => intStringify(node, 16, "0x")
	};
	exports.int = int;
	exports.intBin = intBin;
	exports.intHex = intHex;
	exports.intOct = intOct;
}));
//#endregion
//#region node_modules/yaml/dist/schema/yaml-1.1/set.js
var require_set = /* @__PURE__ */ __commonJSMin(((exports) => {
	var identity = require_identity();
	var Pair = require_Pair();
	var YAMLMap = require_YAMLMap();
	var YAMLSet = class YAMLSet extends YAMLMap.YAMLMap {
		constructor(schema) {
			super(schema);
			this.tag = YAMLSet.tag;
		}
		add(key) {
			let pair;
			if (identity.isPair(key)) pair = key;
			else if (key && typeof key === "object" && "key" in key && "value" in key && key.value === null) pair = new Pair.Pair(key.key, null);
			else pair = new Pair.Pair(key, null);
			if (!YAMLMap.findPair(this.items, pair.key)) this.items.push(pair);
		}
		/**
		* If `keepPair` is `true`, returns the Pair matching `key`.
		* Otherwise, returns the value of that Pair's key.
		*/
		get(key, keepPair) {
			const pair = YAMLMap.findPair(this.items, key);
			return !keepPair && identity.isPair(pair) ? identity.isScalar(pair.key) ? pair.key.value : pair.key : pair;
		}
		set(key, value) {
			if (typeof value !== "boolean") throw new Error(`Expected boolean value for set(key, value) in a YAML set, not ${typeof value}`);
			const prev = YAMLMap.findPair(this.items, key);
			if (prev && !value) this.items.splice(this.items.indexOf(prev), 1);
			else if (!prev && value) this.items.push(new Pair.Pair(key));
		}
		toJSON(_, ctx) {
			return super.toJSON(_, ctx, Set);
		}
		toString(ctx, onComment, onChompKeep) {
			if (!ctx) return JSON.stringify(this);
			if (this.hasAllNullValues(true)) return super.toString(Object.assign({}, ctx, { allNullValues: true }), onComment, onChompKeep);
			else throw new Error("Set items must all have null values");
		}
		static from(schema, iterable, ctx) {
			const { replacer } = ctx;
			const set = new this(schema);
			if (iterable && Symbol.iterator in Object(iterable)) for (let value of iterable) {
				if (typeof replacer === "function") value = replacer.call(iterable, value, value);
				set.items.push(Pair.createPair(value, null, ctx));
			}
			return set;
		}
	};
	YAMLSet.tag = "tag:yaml.org,2002:set";
	var set = {
		collection: "map",
		identify: (value) => value instanceof Set,
		nodeClass: YAMLSet,
		default: false,
		tag: "tag:yaml.org,2002:set",
		createNode: (schema, iterable, ctx) => YAMLSet.from(schema, iterable, ctx),
		resolve(map, onError) {
			if (identity.isMap(map)) if (map.hasAllNullValues(true)) return Object.assign(new YAMLSet(), map);
			else onError("Set items must all have null values");
			else onError("Expected a mapping for this tag");
			return map;
		}
	};
	exports.YAMLSet = YAMLSet;
	exports.set = set;
}));
//#endregion
//#region node_modules/yaml/dist/schema/yaml-1.1/timestamp.js
var require_timestamp = /* @__PURE__ */ __commonJSMin(((exports) => {
	var stringifyNumber = require_stringifyNumber();
	/** Internal types handle bigint as number, because TS can't figure it out. */
	function parseSexagesimal(str, asBigInt) {
		const sign = str[0];
		const parts = sign === "-" || sign === "+" ? str.substring(1) : str;
		const num = (n) => asBigInt ? BigInt(n) : Number(n);
		const res = parts.replace(/_/g, "").split(":").reduce((res, p) => res * num(60) + num(p), num(0));
		return sign === "-" ? num(-1) * res : res;
	}
	/**
	* hhhh:mm:ss.sss
	*
	* Internal types handle bigint as number, because TS can't figure it out.
	*/
	function stringifySexagesimal(node) {
		let { value } = node;
		let num = (n) => n;
		if (typeof value === "bigint") num = (n) => BigInt(n);
		else if (isNaN(value) || !isFinite(value)) return stringifyNumber.stringifyNumber(node);
		let sign = "";
		if (value < 0) {
			sign = "-";
			value *= num(-1);
		}
		const _60 = num(60);
		const parts = [value % _60];
		if (value < 60) parts.unshift(0);
		else {
			value = (value - parts[0]) / _60;
			parts.unshift(value % _60);
			if (value >= 60) {
				value = (value - parts[0]) / _60;
				parts.unshift(value);
			}
		}
		return sign + parts.map((n) => String(n).padStart(2, "0")).join(":").replace(/000000\d*$/, "");
	}
	var intTime = {
		identify: (value) => typeof value === "bigint" || Number.isInteger(value),
		default: true,
		tag: "tag:yaml.org,2002:int",
		format: "TIME",
		test: /^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+$/,
		resolve: (str, _onError, { intAsBigInt }) => parseSexagesimal(str, intAsBigInt),
		stringify: stringifySexagesimal
	};
	var floatTime = {
		identify: (value) => typeof value === "number",
		default: true,
		tag: "tag:yaml.org,2002:float",
		format: "TIME",
		test: /^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\.[0-9_]*$/,
		resolve: (str) => parseSexagesimal(str, false),
		stringify: stringifySexagesimal
	};
	var timestamp = {
		identify: (value) => value instanceof Date,
		default: true,
		tag: "tag:yaml.org,2002:timestamp",
		test: RegExp("^([0-9]{4})-([0-9]{1,2})-([0-9]{1,2})(?:(?:t|T|[ \\t]+)([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2}(\\.[0-9]+)?)(?:[ \\t]*(Z|[-+][012]?[0-9](?::[0-9]{2})?))?)?$"),
		resolve(str) {
			const match = str.match(timestamp.test);
			if (!match) throw new Error("!!timestamp expects a date, starting with yyyy-mm-dd");
			const [, year, month, day, hour, minute, second] = match.map(Number);
			const millisec = match[7] ? Number((match[7] + "00").substr(1, 3)) : 0;
			let date = Date.UTC(year, month - 1, day, hour || 0, minute || 0, second || 0, millisec);
			const tz = match[8];
			if (tz && tz !== "Z") {
				let d = parseSexagesimal(tz, false);
				if (Math.abs(d) < 30) d *= 60;
				date -= 6e4 * d;
			}
			return new Date(date);
		},
		stringify: ({ value }) => value?.toISOString().replace(/(T00:00:00)?\.000Z$/, "") ?? ""
	};
	exports.floatTime = floatTime;
	exports.intTime = intTime;
	exports.timestamp = timestamp;
}));
//#endregion
//#region node_modules/yaml/dist/schema/yaml-1.1/schema.js
var require_schema = /* @__PURE__ */ __commonJSMin(((exports) => {
	var map = require_map();
	var _null = require_null();
	var seq = require_seq();
	var string = require_string$1();
	var binary = require_binary();
	var bool = require_bool();
	var float = require_float();
	var int = require_int();
	var merge = require_merge();
	var omap = require_omap();
	var pairs = require_pairs();
	var set = require_set();
	var timestamp = require_timestamp();
	exports.schema = [
		map.map,
		seq.seq,
		string.string,
		_null.nullTag,
		bool.trueTag,
		bool.falseTag,
		int.intBin,
		int.intOct,
		int.int,
		int.intHex,
		float.floatNaN,
		float.floatExp,
		float.float,
		binary.binary,
		merge.merge,
		omap.omap,
		pairs.pairs,
		set.set,
		timestamp.intTime,
		timestamp.floatTime,
		timestamp.timestamp
	];
}));
//#endregion
//#region node_modules/yaml/dist/schema/tags.js
var require_tags = /* @__PURE__ */ __commonJSMin(((exports) => {
	var map = require_map();
	var _null = require_null();
	var seq = require_seq();
	var string = require_string$1();
	var bool = require_bool$1();
	var float = require_float$1();
	var int = require_int$1();
	var schema = require_schema$2();
	var schema$1 = require_schema$1();
	var binary = require_binary();
	var merge = require_merge();
	var omap = require_omap();
	var pairs = require_pairs();
	var schema$2 = require_schema();
	var set = require_set();
	var timestamp = require_timestamp();
	var schemas = /* @__PURE__ */ new Map([
		["core", schema.schema],
		["failsafe", [
			map.map,
			seq.seq,
			string.string
		]],
		["json", schema$1.schema],
		["yaml11", schema$2.schema],
		["yaml-1.1", schema$2.schema]
	]);
	var tagsByName = {
		binary: binary.binary,
		bool: bool.boolTag,
		float: float.float,
		floatExp: float.floatExp,
		floatNaN: float.floatNaN,
		floatTime: timestamp.floatTime,
		int: int.int,
		intHex: int.intHex,
		intOct: int.intOct,
		intTime: timestamp.intTime,
		map: map.map,
		merge: merge.merge,
		null: _null.nullTag,
		omap: omap.omap,
		pairs: pairs.pairs,
		seq: seq.seq,
		set: set.set,
		timestamp: timestamp.timestamp
	};
	var coreKnownTags = {
		"tag:yaml.org,2002:binary": binary.binary,
		"tag:yaml.org,2002:merge": merge.merge,
		"tag:yaml.org,2002:omap": omap.omap,
		"tag:yaml.org,2002:pairs": pairs.pairs,
		"tag:yaml.org,2002:set": set.set,
		"tag:yaml.org,2002:timestamp": timestamp.timestamp
	};
	function getTags(customTags, schemaName, addMergeTag) {
		const schemaTags = schemas.get(schemaName);
		if (schemaTags && !customTags) return addMergeTag && !schemaTags.includes(merge.merge) ? schemaTags.concat(merge.merge) : schemaTags.slice();
		let tags = schemaTags;
		if (!tags) if (Array.isArray(customTags)) tags = [];
		else {
			const keys = Array.from(schemas.keys()).filter((key) => key !== "yaml11").map((key) => JSON.stringify(key)).join(", ");
			throw new Error(`Unknown schema "${schemaName}"; use one of ${keys} or define customTags array`);
		}
		if (Array.isArray(customTags)) for (const tag of customTags) tags = tags.concat(tag);
		else if (typeof customTags === "function") tags = customTags(tags.slice());
		if (addMergeTag) tags = tags.concat(merge.merge);
		return tags.reduce((tags, tag) => {
			const tagObj = typeof tag === "string" ? tagsByName[tag] : tag;
			if (!tagObj) {
				const tagName = JSON.stringify(tag);
				const keys = Object.keys(tagsByName).map((key) => JSON.stringify(key)).join(", ");
				throw new Error(`Unknown custom tag ${tagName}; use one of ${keys}`);
			}
			if (!tags.includes(tagObj)) tags.push(tagObj);
			return tags;
		}, []);
	}
	exports.coreKnownTags = coreKnownTags;
	exports.getTags = getTags;
}));
//#endregion
//#region node_modules/yaml/dist/schema/Schema.js
var require_Schema = /* @__PURE__ */ __commonJSMin(((exports) => {
	var identity = require_identity();
	var map = require_map();
	var seq = require_seq();
	var string = require_string$1();
	var tags = require_tags();
	var sortMapEntriesByKey = (a, b) => a.key < b.key ? -1 : a.key > b.key ? 1 : 0;
	exports.Schema = class Schema {
		constructor({ compat, customTags, merge, resolveKnownTags, schema, sortMapEntries, toStringDefaults }) {
			this.compat = Array.isArray(compat) ? tags.getTags(compat, "compat") : compat ? tags.getTags(null, compat) : null;
			this.name = typeof schema === "string" && schema || "core";
			this.knownTags = resolveKnownTags ? tags.coreKnownTags : {};
			this.tags = tags.getTags(customTags, this.name, merge);
			this.toStringOptions = toStringDefaults ?? null;
			Object.defineProperty(this, identity.MAP, { value: map.map });
			Object.defineProperty(this, identity.SCALAR, { value: string.string });
			Object.defineProperty(this, identity.SEQ, { value: seq.seq });
			this.sortMapEntries = typeof sortMapEntries === "function" ? sortMapEntries : sortMapEntries === true ? sortMapEntriesByKey : null;
		}
		clone() {
			const copy = Object.create(Schema.prototype, Object.getOwnPropertyDescriptors(this));
			copy.tags = this.tags.slice();
			return copy;
		}
	};
}));
//#endregion
//#region node_modules/yaml/dist/stringify/stringifyDocument.js
var require_stringifyDocument = /* @__PURE__ */ __commonJSMin(((exports) => {
	var identity = require_identity();
	var stringify = require_stringify();
	var stringifyComment = require_stringifyComment();
	function stringifyDocument(doc, options) {
		const lines = [];
		let hasDirectives = options.directives === true;
		if (options.directives !== false && doc.directives) {
			const dir = doc.directives.toString(doc);
			if (dir) {
				lines.push(dir);
				hasDirectives = true;
			} else if (doc.directives.docStart) hasDirectives = true;
		}
		if (hasDirectives) lines.push("---");
		const ctx = stringify.createStringifyContext(doc, options);
		const { commentString } = ctx.options;
		if (doc.commentBefore) {
			if (lines.length !== 1) lines.unshift("");
			const cs = commentString(doc.commentBefore);
			lines.unshift(stringifyComment.indentComment(cs, ""));
		}
		let chompKeep = false;
		let contentComment = null;
		if (doc.contents) {
			if (identity.isNode(doc.contents)) {
				if (doc.contents.spaceBefore && hasDirectives) lines.push("");
				if (doc.contents.commentBefore) {
					const cs = commentString(doc.contents.commentBefore);
					lines.push(stringifyComment.indentComment(cs, ""));
				}
				ctx.forceBlockIndent = !!doc.comment;
				contentComment = doc.contents.comment;
			}
			const onChompKeep = contentComment ? void 0 : () => chompKeep = true;
			let body = stringify.stringify(doc.contents, ctx, () => contentComment = null, onChompKeep);
			if (contentComment) body += stringifyComment.lineComment(body, "", commentString(contentComment));
			if ((body[0] === "|" || body[0] === ">") && lines[lines.length - 1] === "---") lines[lines.length - 1] = `--- ${body}`;
			else lines.push(body);
		} else lines.push(stringify.stringify(doc.contents, ctx));
		if (doc.directives?.docEnd) if (doc.comment) {
			const cs = commentString(doc.comment);
			if (cs.includes("\n")) {
				lines.push("...");
				lines.push(stringifyComment.indentComment(cs, ""));
			} else lines.push(`... ${cs}`);
		} else lines.push("...");
		else {
			let dc = doc.comment;
			if (dc && chompKeep) dc = dc.replace(/^\n+/, "");
			if (dc) {
				if ((!chompKeep || contentComment) && lines[lines.length - 1] !== "") lines.push("");
				lines.push(stringifyComment.indentComment(commentString(dc), ""));
			}
		}
		return lines.join("\n") + "\n";
	}
	exports.stringifyDocument = stringifyDocument;
}));
//#endregion
//#region node_modules/yaml/dist/doc/Document.js
var require_Document = /* @__PURE__ */ __commonJSMin(((exports) => {
	var Alias = require_Alias();
	var Collection = require_Collection();
	var identity = require_identity();
	var Pair = require_Pair();
	var toJS = require_toJS();
	var Schema = require_Schema();
	var stringifyDocument = require_stringifyDocument();
	var anchors = require_anchors();
	var applyReviver = require_applyReviver();
	var createNode = require_createNode();
	var directives = require_directives();
	var Document = class Document {
		constructor(value, replacer, options) {
			/** A comment before this Document */
			this.commentBefore = null;
			/** A comment immediately after this Document */
			this.comment = null;
			/** Errors encountered during parsing. */
			this.errors = [];
			/** Warnings encountered during parsing. */
			this.warnings = [];
			Object.defineProperty(this, identity.NODE_TYPE, { value: identity.DOC });
			let _replacer = null;
			if (typeof replacer === "function" || Array.isArray(replacer)) _replacer = replacer;
			else if (options === void 0 && replacer) {
				options = replacer;
				replacer = void 0;
			}
			const opt = Object.assign({
				intAsBigInt: false,
				keepSourceTokens: false,
				logLevel: "warn",
				prettyErrors: true,
				strict: true,
				stringKeys: false,
				uniqueKeys: true,
				version: "1.2"
			}, options);
			this.options = opt;
			let { version } = opt;
			if (options?._directives) {
				this.directives = options._directives.atDocument();
				if (this.directives.yaml.explicit) version = this.directives.yaml.version;
			} else this.directives = new directives.Directives({ version });
			this.setSchema(version, options);
			this.contents = value === void 0 ? null : this.createNode(value, _replacer, options);
		}
		/**
		* Create a deep copy of this Document and its contents.
		*
		* Custom Node values that inherit from `Object` still refer to their original instances.
		*/
		clone() {
			const copy = Object.create(Document.prototype, { [identity.NODE_TYPE]: { value: identity.DOC } });
			copy.commentBefore = this.commentBefore;
			copy.comment = this.comment;
			copy.errors = this.errors.slice();
			copy.warnings = this.warnings.slice();
			copy.options = Object.assign({}, this.options);
			if (this.directives) copy.directives = this.directives.clone();
			copy.schema = this.schema.clone();
			copy.contents = identity.isNode(this.contents) ? this.contents.clone(copy.schema) : this.contents;
			if (this.range) copy.range = this.range.slice();
			return copy;
		}
		/** Adds a value to the document. */
		add(value) {
			if (assertCollection(this.contents)) this.contents.add(value);
		}
		/** Adds a value to the document. */
		addIn(path, value) {
			if (assertCollection(this.contents)) this.contents.addIn(path, value);
		}
		/**
		* Create a new `Alias` node, ensuring that the target `node` has the required anchor.
		*
		* If `node` already has an anchor, `name` is ignored.
		* Otherwise, the `node.anchor` value will be set to `name`,
		* or if an anchor with that name is already present in the document,
		* `name` will be used as a prefix for a new unique anchor.
		* If `name` is undefined, the generated anchor will use 'a' as a prefix.
		*/
		createAlias(node, name) {
			if (!node.anchor) {
				const prev = anchors.anchorNames(this);
				node.anchor = !name || prev.has(name) ? anchors.findNewAnchor(name || "a", prev) : name;
			}
			return new Alias.Alias(node.anchor);
		}
		createNode(value, replacer, options) {
			let _replacer = void 0;
			if (typeof replacer === "function") {
				value = replacer.call({ "": value }, "", value);
				_replacer = replacer;
			} else if (Array.isArray(replacer)) {
				const keyToStr = (v) => typeof v === "number" || v instanceof String || v instanceof Number;
				const asStr = replacer.filter(keyToStr).map(String);
				if (asStr.length > 0) replacer = replacer.concat(asStr);
				_replacer = replacer;
			} else if (options === void 0 && replacer) {
				options = replacer;
				replacer = void 0;
			}
			const { aliasDuplicateObjects, anchorPrefix, flow, keepUndefined, onTagObj, tag } = options ?? {};
			const { onAnchor, setAnchors, sourceObjects } = anchors.createNodeAnchors(this, anchorPrefix || "a");
			const ctx = {
				aliasDuplicateObjects: aliasDuplicateObjects ?? true,
				keepUndefined: keepUndefined ?? false,
				onAnchor,
				onTagObj,
				replacer: _replacer,
				schema: this.schema,
				sourceObjects
			};
			const node = createNode.createNode(value, tag, ctx);
			if (flow && identity.isCollection(node)) node.flow = true;
			setAnchors();
			return node;
		}
		/**
		* Convert a key and a value into a `Pair` using the current schema,
		* recursively wrapping all values as `Scalar` or `Collection` nodes.
		*/
		createPair(key, value, options = {}) {
			const k = this.createNode(key, null, options);
			const v = this.createNode(value, null, options);
			return new Pair.Pair(k, v);
		}
		/**
		* Removes a value from the document.
		* @returns `true` if the item was found and removed.
		*/
		delete(key) {
			return assertCollection(this.contents) ? this.contents.delete(key) : false;
		}
		/**
		* Removes a value from the document.
		* @returns `true` if the item was found and removed.
		*/
		deleteIn(path) {
			if (Collection.isEmptyPath(path)) {
				if (this.contents == null) return false;
				this.contents = null;
				return true;
			}
			return assertCollection(this.contents) ? this.contents.deleteIn(path) : false;
		}
		/**
		* Returns item at `key`, or `undefined` if not found. By default unwraps
		* scalar values from their surrounding node; to disable set `keepScalar` to
		* `true` (collections are always returned intact).
		*/
		get(key, keepScalar) {
			return identity.isCollection(this.contents) ? this.contents.get(key, keepScalar) : void 0;
		}
		/**
		* Returns item at `path`, or `undefined` if not found. By default unwraps
		* scalar values from their surrounding node; to disable set `keepScalar` to
		* `true` (collections are always returned intact).
		*/
		getIn(path, keepScalar) {
			if (Collection.isEmptyPath(path)) return !keepScalar && identity.isScalar(this.contents) ? this.contents.value : this.contents;
			return identity.isCollection(this.contents) ? this.contents.getIn(path, keepScalar) : void 0;
		}
		/**
		* Checks if the document includes a value with the key `key`.
		*/
		has(key) {
			return identity.isCollection(this.contents) ? this.contents.has(key) : false;
		}
		/**
		* Checks if the document includes a value at `path`.
		*/
		hasIn(path) {
			if (Collection.isEmptyPath(path)) return this.contents !== void 0;
			return identity.isCollection(this.contents) ? this.contents.hasIn(path) : false;
		}
		/**
		* Sets a value in this document. For `!!set`, `value` needs to be a
		* boolean to add/remove the item from the set.
		*/
		set(key, value) {
			if (this.contents == null) this.contents = Collection.collectionFromPath(this.schema, [key], value);
			else if (assertCollection(this.contents)) this.contents.set(key, value);
		}
		/**
		* Sets a value in this document. For `!!set`, `value` needs to be a
		* boolean to add/remove the item from the set.
		*/
		setIn(path, value) {
			if (Collection.isEmptyPath(path)) this.contents = value;
			else if (this.contents == null) this.contents = Collection.collectionFromPath(this.schema, Array.from(path), value);
			else if (assertCollection(this.contents)) this.contents.setIn(path, value);
		}
		/**
		* Change the YAML version and schema used by the document.
		* A `null` version disables support for directives, explicit tags, anchors, and aliases.
		* It also requires the `schema` option to be given as a `Schema` instance value.
		*
		* Overrides all previously set schema options.
		*/
		setSchema(version, options = {}) {
			if (typeof version === "number") version = String(version);
			let opt;
			switch (version) {
				case "1.1":
					if (this.directives) this.directives.yaml.version = "1.1";
					else this.directives = new directives.Directives({ version: "1.1" });
					opt = {
						resolveKnownTags: false,
						schema: "yaml-1.1"
					};
					break;
				case "1.2":
				case "next":
					if (this.directives) this.directives.yaml.version = version;
					else this.directives = new directives.Directives({ version });
					opt = {
						resolveKnownTags: true,
						schema: "core"
					};
					break;
				case null:
					if (this.directives) delete this.directives;
					opt = null;
					break;
				default: {
					const sv = JSON.stringify(version);
					throw new Error(`Expected '1.1', '1.2' or null as first argument, but found: ${sv}`);
				}
			}
			if (options.schema instanceof Object) this.schema = options.schema;
			else if (opt) this.schema = new Schema.Schema(Object.assign(opt, options));
			else throw new Error(`With a null YAML version, the { schema: Schema } option is required`);
		}
		toJS({ json, jsonArg, mapAsMap, maxAliasCount, onAnchor, reviver } = {}) {
			const ctx = {
				anchors: /* @__PURE__ */ new Map(),
				doc: this,
				keep: !json,
				mapAsMap: mapAsMap === true,
				mapKeyWarned: false,
				maxAliasCount: typeof maxAliasCount === "number" ? maxAliasCount : 100
			};
			const res = toJS.toJS(this.contents, jsonArg ?? "", ctx);
			if (typeof onAnchor === "function") for (const { count, res } of ctx.anchors.values()) onAnchor(res, count);
			return typeof reviver === "function" ? applyReviver.applyReviver(reviver, { "": res }, "", res) : res;
		}
		/**
		* A JSON representation of the document `contents`.
		*
		* @param jsonArg Used by `JSON.stringify` to indicate the array index or
		*   property name.
		*/
		toJSON(jsonArg, onAnchor) {
			return this.toJS({
				json: true,
				jsonArg,
				mapAsMap: false,
				onAnchor
			});
		}
		/** A YAML representation of the document. */
		toString(options = {}) {
			if (this.errors.length > 0) throw new Error("Document with errors cannot be stringified");
			if ("indent" in options && (!Number.isInteger(options.indent) || Number(options.indent) <= 0)) {
				const s = JSON.stringify(options.indent);
				throw new Error(`"indent" option must be a positive integer, not ${s}`);
			}
			return stringifyDocument.stringifyDocument(this, options);
		}
	};
	function assertCollection(contents) {
		if (identity.isCollection(contents)) return true;
		throw new Error("Expected a YAML collection as document contents");
	}
	exports.Document = Document;
}));
//#endregion
//#region node_modules/yaml/dist/errors.js
var require_errors = /* @__PURE__ */ __commonJSMin(((exports) => {
	var YAMLError = class extends Error {
		constructor(name, pos, code, message) {
			super();
			this.name = name;
			this.code = code;
			this.message = message;
			this.pos = pos;
		}
	};
	var YAMLParseError = class extends YAMLError {
		constructor(pos, code, message) {
			super("YAMLParseError", pos, code, message);
		}
	};
	var YAMLWarning = class extends YAMLError {
		constructor(pos, code, message) {
			super("YAMLWarning", pos, code, message);
		}
	};
	var prettifyError = (src, lc) => (error) => {
		if (error.pos[0] === -1) return;
		error.linePos = error.pos.map((pos) => lc.linePos(pos));
		const { line, col } = error.linePos[0];
		error.message += ` at line ${line}, column ${col}`;
		let ci = col - 1;
		let lineStr = src.substring(lc.lineStarts[line - 1], lc.lineStarts[line]).replace(/[\n\r]+$/, "");
		if (ci >= 60 && lineStr.length > 80) {
			const trimStart = Math.min(ci - 39, lineStr.length - 79);
			lineStr = "…" + lineStr.substring(trimStart);
			ci -= trimStart - 1;
		}
		if (lineStr.length > 80) lineStr = lineStr.substring(0, 79) + "…";
		if (line > 1 && /^ *$/.test(lineStr.substring(0, ci))) {
			let prev = src.substring(lc.lineStarts[line - 2], lc.lineStarts[line - 1]);
			if (prev.length > 80) prev = prev.substring(0, 79) + "…\n";
			lineStr = prev + lineStr;
		}
		if (/[^ ]/.test(lineStr)) {
			let count = 1;
			const end = error.linePos[1];
			if (end?.line === line && end.col > col) count = Math.max(1, Math.min(end.col - col, 80 - ci));
			const pointer = " ".repeat(ci) + "^".repeat(count);
			error.message += `:\n\n${lineStr}\n${pointer}\n`;
		}
	};
	exports.YAMLError = YAMLError;
	exports.YAMLParseError = YAMLParseError;
	exports.YAMLWarning = YAMLWarning;
	exports.prettifyError = prettifyError;
}));
//#endregion
//#region node_modules/yaml/dist/compose/resolve-props.js
var require_resolve_props = /* @__PURE__ */ __commonJSMin(((exports) => {
	function resolveProps(tokens, { flow, indicator, next, offset, onError, parentIndent, startOnNewline }) {
		let spaceBefore = false;
		let atNewline = startOnNewline;
		let hasSpace = startOnNewline;
		let comment = "";
		let commentSep = "";
		let hasNewline = false;
		let reqSpace = false;
		let tab = null;
		let anchor = null;
		let tag = null;
		let newlineAfterProp = null;
		let comma = null;
		let found = null;
		let start = null;
		for (const token of tokens) {
			if (reqSpace) {
				if (token.type !== "space" && token.type !== "newline" && token.type !== "comma") onError(token.offset, "MISSING_CHAR", "Tags and anchors must be separated from the next token by white space");
				reqSpace = false;
			}
			if (tab) {
				if (atNewline && token.type !== "comment" && token.type !== "newline") onError(tab, "TAB_AS_INDENT", "Tabs are not allowed as indentation");
				tab = null;
			}
			switch (token.type) {
				case "space":
					if (!flow && (indicator !== "doc-start" || next?.type !== "flow-collection") && token.source.includes("	")) tab = token;
					hasSpace = true;
					break;
				case "comment": {
					if (!hasSpace) onError(token, "MISSING_CHAR", "Comments must be separated from other tokens by white space characters");
					const cb = token.source.substring(1) || " ";
					if (!comment) comment = cb;
					else comment += commentSep + cb;
					commentSep = "";
					atNewline = false;
					break;
				}
				case "newline":
					if (atNewline) {
						if (comment) comment += token.source;
						else if (!found || indicator !== "seq-item-ind") spaceBefore = true;
					} else commentSep += token.source;
					atNewline = true;
					hasNewline = true;
					if (anchor || tag) newlineAfterProp = token;
					hasSpace = true;
					break;
				case "anchor":
					if (anchor) onError(token, "MULTIPLE_ANCHORS", "A node can have at most one anchor");
					if (token.source.endsWith(":")) onError(token.offset + token.source.length - 1, "BAD_ALIAS", "Anchor ending in : is ambiguous", true);
					anchor = token;
					start ?? (start = token.offset);
					atNewline = false;
					hasSpace = false;
					reqSpace = true;
					break;
				case "tag":
					if (tag) onError(token, "MULTIPLE_TAGS", "A node can have at most one tag");
					tag = token;
					start ?? (start = token.offset);
					atNewline = false;
					hasSpace = false;
					reqSpace = true;
					break;
				case indicator:
					if (anchor || tag) onError(token, "BAD_PROP_ORDER", `Anchors and tags must be after the ${token.source} indicator`);
					if (found) onError(token, "UNEXPECTED_TOKEN", `Unexpected ${token.source} in ${flow ?? "collection"}`);
					found = token;
					atNewline = indicator === "seq-item-ind" || indicator === "explicit-key-ind";
					hasSpace = false;
					break;
				case "comma": if (flow) {
					if (comma) onError(token, "UNEXPECTED_TOKEN", `Unexpected , in ${flow}`);
					comma = token;
					atNewline = false;
					hasSpace = false;
					break;
				}
				default:
					onError(token, "UNEXPECTED_TOKEN", `Unexpected ${token.type} token`);
					atNewline = false;
					hasSpace = false;
			}
		}
		const last = tokens[tokens.length - 1];
		const end = last ? last.offset + last.source.length : offset;
		if (reqSpace && next && next.type !== "space" && next.type !== "newline" && next.type !== "comma" && (next.type !== "scalar" || next.source !== "")) onError(next.offset, "MISSING_CHAR", "Tags and anchors must be separated from the next token by white space");
		if (tab && (atNewline && tab.indent <= parentIndent || next?.type === "block-map" || next?.type === "block-seq")) onError(tab, "TAB_AS_INDENT", "Tabs are not allowed as indentation");
		return {
			comma,
			found,
			spaceBefore,
			comment,
			hasNewline,
			anchor,
			tag,
			newlineAfterProp,
			end,
			start: start ?? end
		};
	}
	exports.resolveProps = resolveProps;
}));
//#endregion
//#region node_modules/yaml/dist/compose/util-contains-newline.js
var require_util_contains_newline = /* @__PURE__ */ __commonJSMin(((exports) => {
	function containsNewline(key) {
		if (!key) return null;
		switch (key.type) {
			case "alias":
			case "scalar":
			case "double-quoted-scalar":
			case "single-quoted-scalar":
				if (key.source.includes("\n")) return true;
				if (key.end) {
					for (const st of key.end) if (st.type === "newline") return true;
				}
				return false;
			case "flow-collection":
				for (const it of key.items) {
					for (const st of it.start) if (st.type === "newline") return true;
					if (it.sep) {
						for (const st of it.sep) if (st.type === "newline") return true;
					}
					if (containsNewline(it.key) || containsNewline(it.value)) return true;
				}
				return false;
			default: return true;
		}
	}
	exports.containsNewline = containsNewline;
}));
//#endregion
//#region node_modules/yaml/dist/compose/util-flow-indent-check.js
var require_util_flow_indent_check = /* @__PURE__ */ __commonJSMin(((exports) => {
	var utilContainsNewline = require_util_contains_newline();
	function flowIndentCheck(indent, fc, onError) {
		if (fc?.type === "flow-collection") {
			const end = fc.end[0];
			if (end.indent === indent && (end.source === "]" || end.source === "}") && utilContainsNewline.containsNewline(fc)) onError(end, "BAD_INDENT", "Flow end indicator should be more indented than parent", true);
		}
	}
	exports.flowIndentCheck = flowIndentCheck;
}));
//#endregion
//#region node_modules/yaml/dist/compose/util-map-includes.js
var require_util_map_includes = /* @__PURE__ */ __commonJSMin(((exports) => {
	var identity = require_identity();
	function mapIncludes(ctx, items, search) {
		const { uniqueKeys } = ctx.options;
		if (uniqueKeys === false) return false;
		const isEqual = typeof uniqueKeys === "function" ? uniqueKeys : (a, b) => a === b || identity.isScalar(a) && identity.isScalar(b) && a.value === b.value;
		return items.some((pair) => isEqual(pair.key, search));
	}
	exports.mapIncludes = mapIncludes;
}));
//#endregion
//#region node_modules/yaml/dist/compose/resolve-block-map.js
var require_resolve_block_map = /* @__PURE__ */ __commonJSMin(((exports) => {
	var Pair = require_Pair();
	var YAMLMap = require_YAMLMap();
	var resolveProps = require_resolve_props();
	var utilContainsNewline = require_util_contains_newline();
	var utilFlowIndentCheck = require_util_flow_indent_check();
	var utilMapIncludes = require_util_map_includes();
	var startColMsg = "All mapping items must start at the same column";
	function resolveBlockMap({ composeNode, composeEmptyNode }, ctx, bm, onError, tag) {
		const map = new ((tag?.nodeClass) ?? YAMLMap.YAMLMap)(ctx.schema);
		if (ctx.atRoot) ctx.atRoot = false;
		let offset = bm.offset;
		let commentEnd = null;
		for (const collItem of bm.items) {
			const { start, key, sep, value } = collItem;
			const keyProps = resolveProps.resolveProps(start, {
				indicator: "explicit-key-ind",
				next: key ?? sep?.[0],
				offset,
				onError,
				parentIndent: bm.indent,
				startOnNewline: true
			});
			const implicitKey = !keyProps.found;
			if (implicitKey) {
				if (key) {
					if (key.type === "block-seq") onError(offset, "BLOCK_AS_IMPLICIT_KEY", "A block sequence may not be used as an implicit map key");
					else if ("indent" in key && key.indent !== bm.indent) onError(offset, "BAD_INDENT", startColMsg);
				}
				if (!keyProps.anchor && !keyProps.tag && !sep) {
					commentEnd = keyProps.end;
					if (keyProps.comment) if (map.comment) map.comment += "\n" + keyProps.comment;
					else map.comment = keyProps.comment;
					continue;
				}
				if (keyProps.newlineAfterProp || utilContainsNewline.containsNewline(key)) onError(key ?? start[start.length - 1], "MULTILINE_IMPLICIT_KEY", "Implicit keys need to be on a single line");
			} else if (keyProps.found?.indent !== bm.indent) onError(offset, "BAD_INDENT", startColMsg);
			ctx.atKey = true;
			const keyStart = keyProps.end;
			const keyNode = key ? composeNode(ctx, key, keyProps, onError) : composeEmptyNode(ctx, keyStart, start, null, keyProps, onError);
			if (ctx.schema.compat) utilFlowIndentCheck.flowIndentCheck(bm.indent, key, onError);
			ctx.atKey = false;
			if (utilMapIncludes.mapIncludes(ctx, map.items, keyNode)) onError(keyStart, "DUPLICATE_KEY", "Map keys must be unique");
			const valueProps = resolveProps.resolveProps(sep ?? [], {
				indicator: "map-value-ind",
				next: value,
				offset: keyNode.range[2],
				onError,
				parentIndent: bm.indent,
				startOnNewline: !key || key.type === "block-scalar"
			});
			offset = valueProps.end;
			if (valueProps.found) {
				if (implicitKey) {
					if (value?.type === "block-map" && !valueProps.hasNewline) onError(offset, "BLOCK_AS_IMPLICIT_KEY", "Nested mappings are not allowed in compact mappings");
					if (ctx.options.strict && keyProps.start < valueProps.found.offset - 1024) onError(keyNode.range, "KEY_OVER_1024_CHARS", "The : indicator must be at most 1024 chars after the start of an implicit block mapping key");
				}
				const valueNode = value ? composeNode(ctx, value, valueProps, onError) : composeEmptyNode(ctx, offset, sep, null, valueProps, onError);
				if (ctx.schema.compat) utilFlowIndentCheck.flowIndentCheck(bm.indent, value, onError);
				offset = valueNode.range[2];
				const pair = new Pair.Pair(keyNode, valueNode);
				if (ctx.options.keepSourceTokens) pair.srcToken = collItem;
				map.items.push(pair);
			} else {
				if (implicitKey) onError(keyNode.range, "MISSING_CHAR", "Implicit map keys need to be followed by map values");
				if (valueProps.comment) if (keyNode.comment) keyNode.comment += "\n" + valueProps.comment;
				else keyNode.comment = valueProps.comment;
				const pair = new Pair.Pair(keyNode);
				if (ctx.options.keepSourceTokens) pair.srcToken = collItem;
				map.items.push(pair);
			}
		}
		if (commentEnd && commentEnd < offset) onError(commentEnd, "IMPOSSIBLE", "Map comment with trailing content");
		map.range = [
			bm.offset,
			offset,
			commentEnd ?? offset
		];
		return map;
	}
	exports.resolveBlockMap = resolveBlockMap;
}));
//#endregion
//#region node_modules/yaml/dist/compose/resolve-block-seq.js
var require_resolve_block_seq = /* @__PURE__ */ __commonJSMin(((exports) => {
	var YAMLSeq = require_YAMLSeq();
	var resolveProps = require_resolve_props();
	var utilFlowIndentCheck = require_util_flow_indent_check();
	function resolveBlockSeq({ composeNode, composeEmptyNode }, ctx, bs, onError, tag) {
		const seq = new ((tag?.nodeClass) ?? YAMLSeq.YAMLSeq)(ctx.schema);
		if (ctx.atRoot) ctx.atRoot = false;
		if (ctx.atKey) ctx.atKey = false;
		let offset = bs.offset;
		let commentEnd = null;
		for (const { start, value } of bs.items) {
			const props = resolveProps.resolveProps(start, {
				indicator: "seq-item-ind",
				next: value,
				offset,
				onError,
				parentIndent: bs.indent,
				startOnNewline: true
			});
			if (!props.found) if (props.anchor || props.tag || value) if (value?.type === "block-seq") onError(props.end, "BAD_INDENT", "All sequence items must start at the same column");
			else onError(offset, "MISSING_CHAR", "Sequence item without - indicator");
			else {
				commentEnd = props.end;
				if (props.comment) seq.comment = props.comment;
				continue;
			}
			const node = value ? composeNode(ctx, value, props, onError) : composeEmptyNode(ctx, props.end, start, null, props, onError);
			if (ctx.schema.compat) utilFlowIndentCheck.flowIndentCheck(bs.indent, value, onError);
			offset = node.range[2];
			seq.items.push(node);
		}
		seq.range = [
			bs.offset,
			offset,
			commentEnd ?? offset
		];
		return seq;
	}
	exports.resolveBlockSeq = resolveBlockSeq;
}));
//#endregion
//#region node_modules/yaml/dist/compose/resolve-end.js
var require_resolve_end = /* @__PURE__ */ __commonJSMin(((exports) => {
	function resolveEnd(end, offset, reqSpace, onError) {
		let comment = "";
		if (end) {
			let hasSpace = false;
			let sep = "";
			for (const token of end) {
				const { source, type } = token;
				switch (type) {
					case "space":
						hasSpace = true;
						break;
					case "comment": {
						if (reqSpace && !hasSpace) onError(token, "MISSING_CHAR", "Comments must be separated from other tokens by white space characters");
						const cb = source.substring(1) || " ";
						if (!comment) comment = cb;
						else comment += sep + cb;
						sep = "";
						break;
					}
					case "newline":
						if (comment) sep += source;
						hasSpace = true;
						break;
					default: onError(token, "UNEXPECTED_TOKEN", `Unexpected ${type} at node end`);
				}
				offset += source.length;
			}
		}
		return {
			comment,
			offset
		};
	}
	exports.resolveEnd = resolveEnd;
}));
//#endregion
//#region node_modules/yaml/dist/compose/resolve-flow-collection.js
var require_resolve_flow_collection = /* @__PURE__ */ __commonJSMin(((exports) => {
	var identity = require_identity();
	var Pair = require_Pair();
	var YAMLMap = require_YAMLMap();
	var YAMLSeq = require_YAMLSeq();
	var resolveEnd = require_resolve_end();
	var resolveProps = require_resolve_props();
	var utilContainsNewline = require_util_contains_newline();
	var utilMapIncludes = require_util_map_includes();
	var blockMsg = "Block collections are not allowed within flow collections";
	var isBlock = (token) => token && (token.type === "block-map" || token.type === "block-seq");
	function resolveFlowCollection({ composeNode, composeEmptyNode }, ctx, fc, onError, tag) {
		const isMap = fc.start.source === "{";
		const fcName = isMap ? "flow map" : "flow sequence";
		const coll = new ((tag?.nodeClass) ?? (isMap ? YAMLMap.YAMLMap : YAMLSeq.YAMLSeq))(ctx.schema);
		coll.flow = true;
		const atRoot = ctx.atRoot;
		if (atRoot) ctx.atRoot = false;
		if (ctx.atKey) ctx.atKey = false;
		let offset = fc.offset + fc.start.source.length;
		for (let i = 0; i < fc.items.length; ++i) {
			const collItem = fc.items[i];
			const { start, key, sep, value } = collItem;
			const props = resolveProps.resolveProps(start, {
				flow: fcName,
				indicator: "explicit-key-ind",
				next: key ?? sep?.[0],
				offset,
				onError,
				parentIndent: fc.indent,
				startOnNewline: false
			});
			if (!props.found) {
				if (!props.anchor && !props.tag && !sep && !value) {
					if (i === 0 && props.comma) onError(props.comma, "UNEXPECTED_TOKEN", `Unexpected , in ${fcName}`);
					else if (i < fc.items.length - 1) onError(props.start, "UNEXPECTED_TOKEN", `Unexpected empty item in ${fcName}`);
					if (props.comment) if (coll.comment) coll.comment += "\n" + props.comment;
					else coll.comment = props.comment;
					offset = props.end;
					continue;
				}
				if (!isMap && ctx.options.strict && utilContainsNewline.containsNewline(key)) onError(key, "MULTILINE_IMPLICIT_KEY", "Implicit keys of flow sequence pairs need to be on a single line");
			}
			if (i === 0) {
				if (props.comma) onError(props.comma, "UNEXPECTED_TOKEN", `Unexpected , in ${fcName}`);
			} else {
				if (!props.comma) onError(props.start, "MISSING_CHAR", `Missing , between ${fcName} items`);
				if (props.comment) {
					let prevItemComment = "";
					loop: for (const st of start) switch (st.type) {
						case "comma":
						case "space": break;
						case "comment":
							prevItemComment = st.source.substring(1);
							break loop;
						default: break loop;
					}
					if (prevItemComment) {
						let prev = coll.items[coll.items.length - 1];
						if (identity.isPair(prev)) prev = prev.value ?? prev.key;
						if (prev.comment) prev.comment += "\n" + prevItemComment;
						else prev.comment = prevItemComment;
						props.comment = props.comment.substring(prevItemComment.length + 1);
					}
				}
			}
			if (!isMap && !sep && !props.found) {
				const valueNode = value ? composeNode(ctx, value, props, onError) : composeEmptyNode(ctx, props.end, sep, null, props, onError);
				coll.items.push(valueNode);
				offset = valueNode.range[2];
				if (isBlock(value)) onError(valueNode.range, "BLOCK_IN_FLOW", blockMsg);
			} else {
				ctx.atKey = true;
				const keyStart = props.end;
				const keyNode = key ? composeNode(ctx, key, props, onError) : composeEmptyNode(ctx, keyStart, start, null, props, onError);
				if (isBlock(key)) onError(keyNode.range, "BLOCK_IN_FLOW", blockMsg);
				ctx.atKey = false;
				const valueProps = resolveProps.resolveProps(sep ?? [], {
					flow: fcName,
					indicator: "map-value-ind",
					next: value,
					offset: keyNode.range[2],
					onError,
					parentIndent: fc.indent,
					startOnNewline: false
				});
				if (valueProps.found) {
					if (!isMap && !props.found && ctx.options.strict) {
						if (sep) for (const st of sep) {
							if (st === valueProps.found) break;
							if (st.type === "newline") {
								onError(st, "MULTILINE_IMPLICIT_KEY", "Implicit keys of flow sequence pairs need to be on a single line");
								break;
							}
						}
						if (props.start < valueProps.found.offset - 1024) onError(valueProps.found, "KEY_OVER_1024_CHARS", "The : indicator must be at most 1024 chars after the start of an implicit flow sequence key");
					}
				} else if (value) if ("source" in value && value.source?.[0] === ":") onError(value, "MISSING_CHAR", `Missing space after : in ${fcName}`);
				else onError(valueProps.start, "MISSING_CHAR", `Missing , or : between ${fcName} items`);
				const valueNode = value ? composeNode(ctx, value, valueProps, onError) : valueProps.found ? composeEmptyNode(ctx, valueProps.end, sep, null, valueProps, onError) : null;
				if (valueNode) {
					if (isBlock(value)) onError(valueNode.range, "BLOCK_IN_FLOW", blockMsg);
				} else if (valueProps.comment) if (keyNode.comment) keyNode.comment += "\n" + valueProps.comment;
				else keyNode.comment = valueProps.comment;
				const pair = new Pair.Pair(keyNode, valueNode);
				if (ctx.options.keepSourceTokens) pair.srcToken = collItem;
				if (isMap) {
					const map = coll;
					if (utilMapIncludes.mapIncludes(ctx, map.items, keyNode)) onError(keyStart, "DUPLICATE_KEY", "Map keys must be unique");
					map.items.push(pair);
				} else {
					const map = new YAMLMap.YAMLMap(ctx.schema);
					map.flow = true;
					map.items.push(pair);
					const endRange = (valueNode ?? keyNode).range;
					map.range = [
						keyNode.range[0],
						endRange[1],
						endRange[2]
					];
					coll.items.push(map);
				}
				offset = valueNode ? valueNode.range[2] : valueProps.end;
			}
		}
		const expectedEnd = isMap ? "}" : "]";
		const [ce, ...ee] = fc.end;
		let cePos = offset;
		if (ce?.source === expectedEnd) cePos = ce.offset + ce.source.length;
		else {
			const name = fcName[0].toUpperCase() + fcName.substring(1);
			const msg = atRoot ? `${name} must end with a ${expectedEnd}` : `${name} in block collection must be sufficiently indented and end with a ${expectedEnd}`;
			onError(offset, atRoot ? "MISSING_CHAR" : "BAD_INDENT", msg);
			if (ce && ce.source.length !== 1) ee.unshift(ce);
		}
		if (ee.length > 0) {
			const end = resolveEnd.resolveEnd(ee, cePos, ctx.options.strict, onError);
			if (end.comment) if (coll.comment) coll.comment += "\n" + end.comment;
			else coll.comment = end.comment;
			coll.range = [
				fc.offset,
				cePos,
				end.offset
			];
		} else coll.range = [
			fc.offset,
			cePos,
			cePos
		];
		return coll;
	}
	exports.resolveFlowCollection = resolveFlowCollection;
}));
//#endregion
//#region node_modules/yaml/dist/compose/compose-collection.js
var require_compose_collection = /* @__PURE__ */ __commonJSMin(((exports) => {
	var identity = require_identity();
	var Scalar = require_Scalar();
	var YAMLMap = require_YAMLMap();
	var YAMLSeq = require_YAMLSeq();
	var resolveBlockMap = require_resolve_block_map();
	var resolveBlockSeq = require_resolve_block_seq();
	var resolveFlowCollection = require_resolve_flow_collection();
	function resolveCollection(CN, ctx, token, onError, tagName, tag) {
		const coll = token.type === "block-map" ? resolveBlockMap.resolveBlockMap(CN, ctx, token, onError, tag) : token.type === "block-seq" ? resolveBlockSeq.resolveBlockSeq(CN, ctx, token, onError, tag) : resolveFlowCollection.resolveFlowCollection(CN, ctx, token, onError, tag);
		const Coll = coll.constructor;
		if (tagName === "!" || tagName === Coll.tagName) {
			coll.tag = Coll.tagName;
			return coll;
		}
		if (tagName) coll.tag = tagName;
		return coll;
	}
	function composeCollection(CN, ctx, token, props, onError) {
		const tagToken = props.tag;
		const tagName = !tagToken ? null : ctx.directives.tagName(tagToken.source, (msg) => onError(tagToken, "TAG_RESOLVE_FAILED", msg));
		if (token.type === "block-seq") {
			const { anchor, newlineAfterProp: nl } = props;
			const lastProp = anchor && tagToken ? anchor.offset > tagToken.offset ? anchor : tagToken : anchor ?? tagToken;
			if (lastProp && (!nl || nl.offset < lastProp.offset)) onError(lastProp, "MISSING_CHAR", "Missing newline after block sequence props");
		}
		const expType = token.type === "block-map" ? "map" : token.type === "block-seq" ? "seq" : token.start.source === "{" ? "map" : "seq";
		if (!tagToken || !tagName || tagName === "!" || tagName === YAMLMap.YAMLMap.tagName && expType === "map" || tagName === YAMLSeq.YAMLSeq.tagName && expType === "seq") return resolveCollection(CN, ctx, token, onError, tagName);
		let tag = ctx.schema.tags.find((t) => t.tag === tagName && t.collection === expType);
		if (!tag) {
			const kt = ctx.schema.knownTags[tagName];
			if (kt?.collection === expType) {
				ctx.schema.tags.push(Object.assign({}, kt, { default: false }));
				tag = kt;
			} else {
				if (kt) onError(tagToken, "BAD_COLLECTION_TYPE", `${kt.tag} used for ${expType} collection, but expects ${kt.collection ?? "scalar"}`, true);
				else onError(tagToken, "TAG_RESOLVE_FAILED", `Unresolved tag: ${tagName}`, true);
				return resolveCollection(CN, ctx, token, onError, tagName);
			}
		}
		const coll = resolveCollection(CN, ctx, token, onError, tagName, tag);
		const res = tag.resolve?.(coll, (msg) => onError(tagToken, "TAG_RESOLVE_FAILED", msg), ctx.options) ?? coll;
		const node = identity.isNode(res) ? res : new Scalar.Scalar(res);
		node.range = coll.range;
		node.tag = tagName;
		if (tag?.format) node.format = tag.format;
		return node;
	}
	exports.composeCollection = composeCollection;
}));
//#endregion
//#region node_modules/yaml/dist/compose/resolve-block-scalar.js
var require_resolve_block_scalar = /* @__PURE__ */ __commonJSMin(((exports) => {
	var Scalar = require_Scalar();
	function resolveBlockScalar(ctx, scalar, onError) {
		const start = scalar.offset;
		const header = parseBlockScalarHeader(scalar, ctx.options.strict, onError);
		if (!header) return {
			value: "",
			type: null,
			comment: "",
			range: [
				start,
				start,
				start
			]
		};
		const type = header.mode === ">" ? Scalar.Scalar.BLOCK_FOLDED : Scalar.Scalar.BLOCK_LITERAL;
		const lines = scalar.source ? splitLines(scalar.source) : [];
		let chompStart = lines.length;
		for (let i = lines.length - 1; i >= 0; --i) {
			const content = lines[i][1];
			if (content === "" || content === "\r") chompStart = i;
			else break;
		}
		if (chompStart === 0) {
			const value = header.chomp === "+" && lines.length > 0 ? "\n".repeat(Math.max(1, lines.length - 1)) : "";
			let end = start + header.length;
			if (scalar.source) end += scalar.source.length;
			return {
				value,
				type,
				comment: header.comment,
				range: [
					start,
					end,
					end
				]
			};
		}
		let trimIndent = scalar.indent + header.indent;
		let offset = scalar.offset + header.length;
		let contentStart = 0;
		for (let i = 0; i < chompStart; ++i) {
			const [indent, content] = lines[i];
			if (content === "" || content === "\r") {
				if (header.indent === 0 && indent.length > trimIndent) trimIndent = indent.length;
			} else {
				if (indent.length < trimIndent) onError(offset + indent.length, "MISSING_CHAR", "Block scalars with more-indented leading empty lines must use an explicit indentation indicator");
				if (header.indent === 0) trimIndent = indent.length;
				contentStart = i;
				if (trimIndent === 0 && !ctx.atRoot) onError(offset, "BAD_INDENT", "Block scalar values in collections must be indented");
				break;
			}
			offset += indent.length + content.length + 1;
		}
		for (let i = lines.length - 1; i >= chompStart; --i) if (lines[i][0].length > trimIndent) chompStart = i + 1;
		let value = "";
		let sep = "";
		let prevMoreIndented = false;
		for (let i = 0; i < contentStart; ++i) value += lines[i][0].slice(trimIndent) + "\n";
		for (let i = contentStart; i < chompStart; ++i) {
			let [indent, content] = lines[i];
			offset += indent.length + content.length + 1;
			const crlf = content[content.length - 1] === "\r";
			if (crlf) content = content.slice(0, -1);
			/* istanbul ignore if already caught in lexer */
			if (content && indent.length < trimIndent) {
				const message = `Block scalar lines must not be less indented than their ${header.indent ? "explicit indentation indicator" : "first line"}`;
				onError(offset - content.length - (crlf ? 2 : 1), "BAD_INDENT", message);
				indent = "";
			}
			if (type === Scalar.Scalar.BLOCK_LITERAL) {
				value += sep + indent.slice(trimIndent) + content;
				sep = "\n";
			} else if (indent.length > trimIndent || content[0] === "	") {
				if (sep === " ") sep = "\n";
				else if (!prevMoreIndented && sep === "\n") sep = "\n\n";
				value += sep + indent.slice(trimIndent) + content;
				sep = "\n";
				prevMoreIndented = true;
			} else if (content === "") if (sep === "\n") value += "\n";
			else sep = "\n";
			else {
				value += sep + content;
				sep = " ";
				prevMoreIndented = false;
			}
		}
		switch (header.chomp) {
			case "-": break;
			case "+":
				for (let i = chompStart; i < lines.length; ++i) value += "\n" + lines[i][0].slice(trimIndent);
				if (value[value.length - 1] !== "\n") value += "\n";
				break;
			default: value += "\n";
		}
		const end = start + header.length + scalar.source.length;
		return {
			value,
			type,
			comment: header.comment,
			range: [
				start,
				end,
				end
			]
		};
	}
	function parseBlockScalarHeader({ offset, props }, strict, onError) {
		/* istanbul ignore if should not happen */
		if (props[0].type !== "block-scalar-header") {
			onError(props[0], "IMPOSSIBLE", "Block scalar header not found");
			return null;
		}
		const { source } = props[0];
		const mode = source[0];
		let indent = 0;
		let chomp = "";
		let error = -1;
		for (let i = 1; i < source.length; ++i) {
			const ch = source[i];
			if (!chomp && (ch === "-" || ch === "+")) chomp = ch;
			else {
				const n = Number(ch);
				if (!indent && n) indent = n;
				else if (error === -1) error = offset + i;
			}
		}
		if (error !== -1) onError(error, "UNEXPECTED_TOKEN", `Block scalar header includes extra characters: ${source}`);
		let hasSpace = false;
		let comment = "";
		let length = source.length;
		for (let i = 1; i < props.length; ++i) {
			const token = props[i];
			switch (token.type) {
				case "space": hasSpace = true;
				case "newline":
					length += token.source.length;
					break;
				case "comment":
					if (strict && !hasSpace) onError(token, "MISSING_CHAR", "Comments must be separated from other tokens by white space characters");
					length += token.source.length;
					comment = token.source.substring(1);
					break;
				case "error":
					onError(token, "UNEXPECTED_TOKEN", token.message);
					length += token.source.length;
					break;
				/* istanbul ignore next should not happen */
				default: {
					onError(token, "UNEXPECTED_TOKEN", `Unexpected token in block scalar header: ${token.type}`);
					const ts = token.source;
					if (ts && typeof ts === "string") length += ts.length;
				}
			}
		}
		return {
			mode,
			indent,
			chomp,
			comment,
			length
		};
	}
	/** @returns Array of lines split up as `[indent, content]` */
	function splitLines(source) {
		const split = source.split(/\n( *)/);
		const first = split[0];
		const m = first.match(/^( *)/);
		const lines = [m?.[1] ? [m[1], first.slice(m[1].length)] : ["", first]];
		for (let i = 1; i < split.length; i += 2) lines.push([split[i], split[i + 1]]);
		return lines;
	}
	exports.resolveBlockScalar = resolveBlockScalar;
}));
//#endregion
//#region node_modules/yaml/dist/compose/resolve-flow-scalar.js
var require_resolve_flow_scalar = /* @__PURE__ */ __commonJSMin(((exports) => {
	var Scalar = require_Scalar();
	var resolveEnd = require_resolve_end();
	function resolveFlowScalar(scalar, strict, onError) {
		const { offset, type, source, end } = scalar;
		let _type;
		let value;
		const _onError = (rel, code, msg) => onError(offset + rel, code, msg);
		switch (type) {
			case "scalar":
				_type = Scalar.Scalar.PLAIN;
				value = plainValue(source, _onError);
				break;
			case "single-quoted-scalar":
				_type = Scalar.Scalar.QUOTE_SINGLE;
				value = singleQuotedValue(source, _onError);
				break;
			case "double-quoted-scalar":
				_type = Scalar.Scalar.QUOTE_DOUBLE;
				value = doubleQuotedValue(source, _onError);
				break;
			/* istanbul ignore next should not happen */
			default:
				onError(scalar, "UNEXPECTED_TOKEN", `Expected a flow scalar value, but found: ${type}`);
				return {
					value: "",
					type: null,
					comment: "",
					range: [
						offset,
						offset + source.length,
						offset + source.length
					]
				};
		}
		const valueEnd = offset + source.length;
		const re = resolveEnd.resolveEnd(end, valueEnd, strict, onError);
		return {
			value,
			type: _type,
			comment: re.comment,
			range: [
				offset,
				valueEnd,
				re.offset
			]
		};
	}
	function plainValue(source, onError) {
		let badChar = "";
		switch (source[0]) {
			/* istanbul ignore next should not happen */
			case "	":
				badChar = "a tab character";
				break;
			case ",":
				badChar = "flow indicator character ,";
				break;
			case "%":
				badChar = "directive indicator character %";
				break;
			case "|":
			case ">":
				badChar = `block scalar indicator ${source[0]}`;
				break;
			case "@":
			case "`":
				badChar = `reserved character ${source[0]}`;
				break;
		}
		if (badChar) onError(0, "BAD_SCALAR_START", `Plain value cannot start with ${badChar}`);
		return foldLines(source);
	}
	function singleQuotedValue(source, onError) {
		if (source[source.length - 1] !== "'" || source.length === 1) onError(source.length, "MISSING_CHAR", "Missing closing 'quote");
		return foldLines(source.slice(1, -1)).replace(/''/g, "'");
	}
	function foldLines(source) {
		/**
		* The negative lookbehind here and in the `re` RegExp is to
		* prevent causing a polynomial search time in certain cases.
		*
		* The try-catch is for Safari, which doesn't support this yet:
		* https://caniuse.com/js-regexp-lookbehind
		*/
		let first, line;
		try {
			first = /* @__PURE__ */ new RegExp("(.*?)(?<![ 	])[ 	]*\r?\n", "sy");
			line = /* @__PURE__ */ new RegExp("[ 	]*(.*?)(?:(?<![ 	])[ 	]*)?\r?\n", "sy");
		} catch {
			first = /(.*?)[ \t]*\r?\n/sy;
			line = /[ \t]*(.*?)[ \t]*\r?\n/sy;
		}
		let match = first.exec(source);
		if (!match) return source;
		let res = match[1];
		let sep = " ";
		let pos = first.lastIndex;
		line.lastIndex = pos;
		while (match = line.exec(source)) {
			if (match[1] === "") if (sep === "\n") res += sep;
			else sep = "\n";
			else {
				res += sep + match[1];
				sep = " ";
			}
			pos = line.lastIndex;
		}
		const last = /[ \t]*(.*)/sy;
		last.lastIndex = pos;
		match = last.exec(source);
		return res + sep + (match?.[1] ?? "");
	}
	function doubleQuotedValue(source, onError) {
		let res = "";
		for (let i = 1; i < source.length - 1; ++i) {
			const ch = source[i];
			if (ch === "\r" && source[i + 1] === "\n") continue;
			if (ch === "\n") {
				const { fold, offset } = foldNewline(source, i);
				res += fold;
				i = offset;
			} else if (ch === "\\") {
				let next = source[++i];
				const cc = escapeCodes[next];
				if (cc) res += cc;
				else if (next === "\n") {
					next = source[i + 1];
					while (next === " " || next === "	") next = source[++i + 1];
				} else if (next === "\r" && source[i + 1] === "\n") {
					next = source[++i + 1];
					while (next === " " || next === "	") next = source[++i + 1];
				} else if (next === "x" || next === "u" || next === "U") {
					const length = next === "x" ? 2 : next === "u" ? 4 : 8;
					res += parseCharCode(source, i + 1, length, onError);
					i += length;
				} else {
					const raw = source.substr(i - 1, 2);
					onError(i - 1, "BAD_DQ_ESCAPE", `Invalid escape sequence ${raw}`);
					res += raw;
				}
			} else if (ch === " " || ch === "	") {
				const wsStart = i;
				let next = source[i + 1];
				while (next === " " || next === "	") next = source[++i + 1];
				if (next !== "\n" && !(next === "\r" && source[i + 2] === "\n")) res += i > wsStart ? source.slice(wsStart, i + 1) : ch;
			} else res += ch;
		}
		if (source[source.length - 1] !== "\"" || source.length === 1) onError(source.length, "MISSING_CHAR", "Missing closing \"quote");
		return res;
	}
	/**
	* Fold a single newline into a space, multiple newlines to N - 1 newlines.
	* Presumes `source[offset] === '\n'`
	*/
	function foldNewline(source, offset) {
		let fold = "";
		let ch = source[offset + 1];
		while (ch === " " || ch === "	" || ch === "\n" || ch === "\r") {
			if (ch === "\r" && source[offset + 2] !== "\n") break;
			if (ch === "\n") fold += "\n";
			offset += 1;
			ch = source[offset + 1];
		}
		if (!fold) fold = " ";
		return {
			fold,
			offset
		};
	}
	var escapeCodes = {
		"0": "\0",
		a: "\x07",
		b: "\b",
		e: "\x1B",
		f: "\f",
		n: "\n",
		r: "\r",
		t: "	",
		v: "\v",
		N: "",
		_: "\xA0",
		L: "\u2028",
		P: "\u2029",
		" ": " ",
		"\"": "\"",
		"/": "/",
		"\\": "\\",
		"	": "	"
	};
	function parseCharCode(source, offset, length, onError) {
		const cc = source.substr(offset, length);
		const code = cc.length === length && /^[0-9a-fA-F]+$/.test(cc) ? parseInt(cc, 16) : NaN;
		try {
			return String.fromCodePoint(code);
		} catch {
			const raw = source.substr(offset - 2, length + 2);
			onError(offset - 2, "BAD_DQ_ESCAPE", `Invalid escape sequence ${raw}`);
			return raw;
		}
	}
	exports.resolveFlowScalar = resolveFlowScalar;
}));
//#endregion
//#region node_modules/yaml/dist/compose/compose-scalar.js
var require_compose_scalar = /* @__PURE__ */ __commonJSMin(((exports) => {
	var identity = require_identity();
	var Scalar = require_Scalar();
	var resolveBlockScalar = require_resolve_block_scalar();
	var resolveFlowScalar = require_resolve_flow_scalar();
	function composeScalar(ctx, token, tagToken, onError) {
		const { value, type, comment, range } = token.type === "block-scalar" ? resolveBlockScalar.resolveBlockScalar(ctx, token, onError) : resolveFlowScalar.resolveFlowScalar(token, ctx.options.strict, onError);
		const tagName = tagToken ? ctx.directives.tagName(tagToken.source, (msg) => onError(tagToken, "TAG_RESOLVE_FAILED", msg)) : null;
		let tag;
		if (ctx.options.stringKeys && ctx.atKey) tag = ctx.schema[identity.SCALAR];
		else if (tagName) tag = findScalarTagByName(ctx.schema, value, tagName, tagToken, onError);
		else if (token.type === "scalar") tag = findScalarTagByTest(ctx, value, token, onError);
		else tag = ctx.schema[identity.SCALAR];
		let scalar;
		try {
			const res = tag.resolve(value, (msg) => onError(tagToken ?? token, "TAG_RESOLVE_FAILED", msg), ctx.options);
			scalar = identity.isScalar(res) ? res : new Scalar.Scalar(res);
		} catch (error) {
			const msg = error instanceof Error ? error.message : String(error);
			onError(tagToken ?? token, "TAG_RESOLVE_FAILED", msg);
			scalar = new Scalar.Scalar(value);
		}
		scalar.range = range;
		scalar.source = value;
		if (type) scalar.type = type;
		if (tagName) scalar.tag = tagName;
		if (tag.format) scalar.format = tag.format;
		if (comment) scalar.comment = comment;
		return scalar;
	}
	function findScalarTagByName(schema, value, tagName, tagToken, onError) {
		if (tagName === "!") return schema[identity.SCALAR];
		const matchWithTest = [];
		for (const tag of schema.tags) if (!tag.collection && tag.tag === tagName) if (tag.default && tag.test) matchWithTest.push(tag);
		else return tag;
		for (const tag of matchWithTest) if (tag.test?.test(value)) return tag;
		const kt = schema.knownTags[tagName];
		if (kt && !kt.collection) {
			schema.tags.push(Object.assign({}, kt, {
				default: false,
				test: void 0
			}));
			return kt;
		}
		onError(tagToken, "TAG_RESOLVE_FAILED", `Unresolved tag: ${tagName}`, tagName !== "tag:yaml.org,2002:str");
		return schema[identity.SCALAR];
	}
	function findScalarTagByTest({ atKey, directives, schema }, value, token, onError) {
		const tag = schema.tags.find((tag) => (tag.default === true || atKey && tag.default === "key") && tag.test?.test(value)) || schema[identity.SCALAR];
		if (schema.compat) {
			const compat = schema.compat.find((tag) => tag.default && tag.test?.test(value)) ?? schema[identity.SCALAR];
			if (tag.tag !== compat.tag) onError(token, "TAG_RESOLVE_FAILED", `Value may be parsed as either ${directives.tagString(tag.tag)} or ${directives.tagString(compat.tag)}`, true);
		}
		return tag;
	}
	exports.composeScalar = composeScalar;
}));
//#endregion
//#region node_modules/yaml/dist/compose/util-empty-scalar-position.js
var require_util_empty_scalar_position = /* @__PURE__ */ __commonJSMin(((exports) => {
	function emptyScalarPosition(offset, before, pos) {
		if (before) {
			pos ?? (pos = before.length);
			for (let i = pos - 1; i >= 0; --i) {
				let st = before[i];
				switch (st.type) {
					case "space":
					case "comment":
					case "newline":
						offset -= st.source.length;
						continue;
				}
				st = before[++i];
				while (st?.type === "space") {
					offset += st.source.length;
					st = before[++i];
				}
				break;
			}
		}
		return offset;
	}
	exports.emptyScalarPosition = emptyScalarPosition;
}));
//#endregion
//#region node_modules/yaml/dist/compose/compose-node.js
var require_compose_node = /* @__PURE__ */ __commonJSMin(((exports) => {
	var Alias = require_Alias();
	var identity = require_identity();
	var composeCollection = require_compose_collection();
	var composeScalar = require_compose_scalar();
	var resolveEnd = require_resolve_end();
	var utilEmptyScalarPosition = require_util_empty_scalar_position();
	var CN = {
		composeNode,
		composeEmptyNode
	};
	function composeNode(ctx, token, props, onError) {
		const atKey = ctx.atKey;
		const { spaceBefore, comment, anchor, tag } = props;
		let node;
		let isSrcToken = true;
		switch (token.type) {
			case "alias":
				node = composeAlias(ctx, token, onError);
				if (anchor || tag) onError(token, "ALIAS_PROPS", "An alias node must not specify any properties");
				break;
			case "scalar":
			case "single-quoted-scalar":
			case "double-quoted-scalar":
			case "block-scalar":
				node = composeScalar.composeScalar(ctx, token, tag, onError);
				if (anchor) node.anchor = anchor.source.substring(1);
				break;
			case "block-map":
			case "block-seq":
			case "flow-collection":
				try {
					node = composeCollection.composeCollection(CN, ctx, token, props, onError);
					if (anchor) node.anchor = anchor.source.substring(1);
				} catch (error) {
					onError(token, "RESOURCE_EXHAUSTION", error instanceof Error ? error.message : String(error));
				}
				break;
			default:
				onError(token, "UNEXPECTED_TOKEN", token.type === "error" ? token.message : `Unsupported token (type: ${token.type})`);
				isSrcToken = false;
		}
		node ?? (node = composeEmptyNode(ctx, token.offset, void 0, null, props, onError));
		if (anchor && node.anchor === "") onError(anchor, "BAD_ALIAS", "Anchor cannot be an empty string");
		if (atKey && ctx.options.stringKeys && (!identity.isScalar(node) || typeof node.value !== "string" || node.tag && node.tag !== "tag:yaml.org,2002:str")) onError(tag ?? token, "NON_STRING_KEY", "With stringKeys, all keys must be strings");
		if (spaceBefore) node.spaceBefore = true;
		if (comment) if (token.type === "scalar" && token.source === "") node.comment = comment;
		else node.commentBefore = comment;
		if (ctx.options.keepSourceTokens && isSrcToken) node.srcToken = token;
		return node;
	}
	function composeEmptyNode(ctx, offset, before, pos, { spaceBefore, comment, anchor, tag, end }, onError) {
		const token = {
			type: "scalar",
			offset: utilEmptyScalarPosition.emptyScalarPosition(offset, before, pos),
			indent: -1,
			source: ""
		};
		const node = composeScalar.composeScalar(ctx, token, tag, onError);
		if (anchor) {
			node.anchor = anchor.source.substring(1);
			if (node.anchor === "") onError(anchor, "BAD_ALIAS", "Anchor cannot be an empty string");
		}
		if (spaceBefore) node.spaceBefore = true;
		if (comment) {
			node.comment = comment;
			node.range[2] = end;
		}
		return node;
	}
	function composeAlias({ options }, { offset, source, end }, onError) {
		const alias = new Alias.Alias(source.substring(1));
		if (alias.source === "") onError(offset, "BAD_ALIAS", "Alias cannot be an empty string");
		if (alias.source.endsWith(":")) onError(offset + source.length - 1, "BAD_ALIAS", "Alias ending in : is ambiguous", true);
		const valueEnd = offset + source.length;
		const re = resolveEnd.resolveEnd(end, valueEnd, options.strict, onError);
		alias.range = [
			offset,
			valueEnd,
			re.offset
		];
		if (re.comment) alias.comment = re.comment;
		return alias;
	}
	exports.composeEmptyNode = composeEmptyNode;
	exports.composeNode = composeNode;
}));
//#endregion
//#region node_modules/yaml/dist/compose/compose-doc.js
var require_compose_doc = /* @__PURE__ */ __commonJSMin(((exports) => {
	var Document = require_Document();
	var composeNode = require_compose_node();
	var resolveEnd = require_resolve_end();
	var resolveProps = require_resolve_props();
	function composeDoc(options, directives, { offset, start, value, end }, onError) {
		const opts = Object.assign({ _directives: directives }, options);
		const doc = new Document.Document(void 0, opts);
		const ctx = {
			atKey: false,
			atRoot: true,
			directives: doc.directives,
			options: doc.options,
			schema: doc.schema
		};
		const props = resolveProps.resolveProps(start, {
			indicator: "doc-start",
			next: value ?? end?.[0],
			offset,
			onError,
			parentIndent: 0,
			startOnNewline: true
		});
		if (props.found) {
			doc.directives.docStart = true;
			if (value && (value.type === "block-map" || value.type === "block-seq") && !props.hasNewline) onError(props.end, "MISSING_CHAR", "Block collection cannot start on same line with directives-end marker");
		}
		doc.contents = value ? composeNode.composeNode(ctx, value, props, onError) : composeNode.composeEmptyNode(ctx, props.end, start, null, props, onError);
		const contentEnd = doc.contents.range[2];
		const re = resolveEnd.resolveEnd(end, contentEnd, false, onError);
		if (re.comment) doc.comment = re.comment;
		doc.range = [
			offset,
			contentEnd,
			re.offset
		];
		return doc;
	}
	exports.composeDoc = composeDoc;
}));
//#endregion
//#region node_modules/yaml/dist/compose/composer.js
var require_composer = /* @__PURE__ */ __commonJSMin(((exports) => {
	var node_process$1 = __require("process");
	var directives = require_directives();
	var Document = require_Document();
	var errors = require_errors();
	var identity = require_identity();
	var composeDoc = require_compose_doc();
	var resolveEnd = require_resolve_end();
	function getErrorPos(src) {
		if (typeof src === "number") return [src, src + 1];
		if (Array.isArray(src)) return src.length === 2 ? src : [src[0], src[1]];
		const { offset, source } = src;
		return [offset, offset + (typeof source === "string" ? source.length : 1)];
	}
	function parsePrelude(prelude) {
		let comment = "";
		let atComment = false;
		let afterEmptyLine = false;
		for (let i = 0; i < prelude.length; ++i) {
			const source = prelude[i];
			switch (source[0]) {
				case "#":
					comment += (comment === "" ? "" : afterEmptyLine ? "\n\n" : "\n") + (source.substring(1) || " ");
					atComment = true;
					afterEmptyLine = false;
					break;
				case "%":
					if (prelude[i + 1]?.[0] !== "#") i += 1;
					atComment = false;
					break;
				default:
					if (!atComment) afterEmptyLine = true;
					atComment = false;
			}
		}
		return {
			comment,
			afterEmptyLine
		};
	}
	/**
	* Compose a stream of CST nodes into a stream of YAML Documents.
	*
	* ```ts
	* import { Composer, Parser } from 'yaml'
	*
	* const src: string = ...
	* const tokens = new Parser().parse(src)
	* const docs = new Composer().compose(tokens)
	* ```
	*/
	var Composer = class {
		constructor(options = {}) {
			this.doc = null;
			this.atDirectives = false;
			this.prelude = [];
			this.errors = [];
			this.warnings = [];
			this.onError = (source, code, message, warning) => {
				const pos = getErrorPos(source);
				if (warning) this.warnings.push(new errors.YAMLWarning(pos, code, message));
				else this.errors.push(new errors.YAMLParseError(pos, code, message));
			};
			this.directives = new directives.Directives({ version: options.version || "1.2" });
			this.options = options;
		}
		decorate(doc, afterDoc) {
			const { comment, afterEmptyLine } = parsePrelude(this.prelude);
			if (comment) {
				const dc = doc.contents;
				if (afterDoc) doc.comment = doc.comment ? `${doc.comment}\n${comment}` : comment;
				else if (afterEmptyLine || doc.directives.docStart || !dc) doc.commentBefore = comment;
				else if (identity.isCollection(dc) && !dc.flow && dc.items.length > 0) {
					let it = dc.items[0];
					if (identity.isPair(it)) it = it.key;
					const cb = it.commentBefore;
					it.commentBefore = cb ? `${comment}\n${cb}` : comment;
				} else {
					const cb = dc.commentBefore;
					dc.commentBefore = cb ? `${comment}\n${cb}` : comment;
				}
			}
			if (afterDoc) {
				for (let i = 0; i < this.errors.length; ++i) doc.errors.push(this.errors[i]);
				for (let i = 0; i < this.warnings.length; ++i) doc.warnings.push(this.warnings[i]);
			} else {
				doc.errors = this.errors;
				doc.warnings = this.warnings;
			}
			this.prelude = [];
			this.errors = [];
			this.warnings = [];
		}
		/**
		* Current stream status information.
		*
		* Mostly useful at the end of input for an empty stream.
		*/
		streamInfo() {
			return {
				comment: parsePrelude(this.prelude).comment,
				directives: this.directives,
				errors: this.errors,
				warnings: this.warnings
			};
		}
		/**
		* Compose tokens into documents.
		*
		* @param forceDoc - If the stream contains no document, still emit a final document including any comments and directives that would be applied to a subsequent document.
		* @param endOffset - Should be set if `forceDoc` is also set, to set the document range end and to indicate errors correctly.
		*/
		*compose(tokens, forceDoc = false, endOffset = -1) {
			for (const token of tokens) yield* this.next(token);
			yield* this.end(forceDoc, endOffset);
		}
		/** Advance the composer by one CST token. */
		*next(token) {
			if (node_process$1.env.LOG_STREAM) console.dir(token, { depth: null });
			switch (token.type) {
				case "directive":
					this.directives.add(token.source, (offset, message, warning) => {
						const pos = getErrorPos(token);
						pos[0] += offset;
						this.onError(pos, "BAD_DIRECTIVE", message, warning);
					});
					this.prelude.push(token.source);
					this.atDirectives = true;
					break;
				case "document": {
					const doc = composeDoc.composeDoc(this.options, this.directives, token, this.onError);
					if (this.atDirectives && !doc.directives.docStart) this.onError(token, "MISSING_CHAR", "Missing directives-end/doc-start indicator line");
					this.decorate(doc, false);
					if (this.doc) yield this.doc;
					this.doc = doc;
					this.atDirectives = false;
					break;
				}
				case "byte-order-mark":
				case "space": break;
				case "comment":
				case "newline":
					this.prelude.push(token.source);
					break;
				case "error": {
					const msg = token.source ? `${token.message}: ${JSON.stringify(token.source)}` : token.message;
					const error = new errors.YAMLParseError(getErrorPos(token), "UNEXPECTED_TOKEN", msg);
					if (this.atDirectives || !this.doc) this.errors.push(error);
					else this.doc.errors.push(error);
					break;
				}
				case "doc-end": {
					if (!this.doc) {
						this.errors.push(new errors.YAMLParseError(getErrorPos(token), "UNEXPECTED_TOKEN", "Unexpected doc-end without preceding document"));
						break;
					}
					this.doc.directives.docEnd = true;
					const end = resolveEnd.resolveEnd(token.end, token.offset + token.source.length, this.doc.options.strict, this.onError);
					this.decorate(this.doc, true);
					if (end.comment) {
						const dc = this.doc.comment;
						this.doc.comment = dc ? `${dc}\n${end.comment}` : end.comment;
					}
					this.doc.range[2] = end.offset;
					break;
				}
				default: this.errors.push(new errors.YAMLParseError(getErrorPos(token), "UNEXPECTED_TOKEN", `Unsupported token ${token.type}`));
			}
		}
		/**
		* Call at end of input to yield any remaining document.
		*
		* @param forceDoc - If the stream contains no document, still emit a final document including any comments and directives that would be applied to a subsequent document.
		* @param endOffset - Should be set if `forceDoc` is also set, to set the document range end and to indicate errors correctly.
		*/
		*end(forceDoc = false, endOffset = -1) {
			if (this.doc) {
				this.decorate(this.doc, true);
				yield this.doc;
				this.doc = null;
			} else if (forceDoc) {
				const opts = Object.assign({ _directives: this.directives }, this.options);
				const doc = new Document.Document(void 0, opts);
				if (this.atDirectives) this.onError(endOffset, "MISSING_CHAR", "Missing directives-end indicator line");
				doc.range = [
					0,
					endOffset,
					endOffset
				];
				this.decorate(doc, false);
				yield doc;
			}
		}
	};
	exports.Composer = Composer;
}));
//#endregion
//#region node_modules/yaml/dist/parse/cst-scalar.js
var require_cst_scalar = /* @__PURE__ */ __commonJSMin(((exports) => {
	var resolveBlockScalar = require_resolve_block_scalar();
	var resolveFlowScalar = require_resolve_flow_scalar();
	var errors = require_errors();
	var stringifyString = require_stringifyString();
	function resolveAsScalar(token, strict = true, onError) {
		if (token) {
			const _onError = (pos, code, message) => {
				const offset = typeof pos === "number" ? pos : Array.isArray(pos) ? pos[0] : pos.offset;
				if (onError) onError(offset, code, message);
				else throw new errors.YAMLParseError([offset, offset + 1], code, message);
			};
			switch (token.type) {
				case "scalar":
				case "single-quoted-scalar":
				case "double-quoted-scalar": return resolveFlowScalar.resolveFlowScalar(token, strict, _onError);
				case "block-scalar": return resolveBlockScalar.resolveBlockScalar({ options: { strict } }, token, _onError);
			}
		}
		return null;
	}
	/**
	* Create a new scalar token with `value`
	*
	* Values that represent an actual string but may be parsed as a different type should use a `type` other than `'PLAIN'`,
	* as this function does not support any schema operations and won't check for such conflicts.
	*
	* @param value The string representation of the value, which will have its content properly indented.
	* @param context.end Comments and whitespace after the end of the value, or after the block scalar header. If undefined, a newline will be added.
	* @param context.implicitKey Being within an implicit key may affect the resolved type of the token's value.
	* @param context.indent The indent level of the token.
	* @param context.inFlow Is this scalar within a flow collection? This may affect the resolved type of the token's value.
	* @param context.offset The offset position of the token.
	* @param context.type The preferred type of the scalar token. If undefined, the previous type of the `token` will be used, defaulting to `'PLAIN'`.
	*/
	function createScalarToken(value, context) {
		const { implicitKey = false, indent, inFlow = false, offset = -1, type = "PLAIN" } = context;
		const source = stringifyString.stringifyString({
			type,
			value
		}, {
			implicitKey,
			indent: indent > 0 ? " ".repeat(indent) : "",
			inFlow,
			options: {
				blockQuote: true,
				lineWidth: -1
			}
		});
		const end = context.end ?? [{
			type: "newline",
			offset: -1,
			indent,
			source: "\n"
		}];
		switch (source[0]) {
			case "|":
			case ">": {
				const he = source.indexOf("\n");
				const head = source.substring(0, he);
				const body = source.substring(he + 1) + "\n";
				const props = [{
					type: "block-scalar-header",
					offset,
					indent,
					source: head
				}];
				if (!addEndtoBlockProps(props, end)) props.push({
					type: "newline",
					offset: -1,
					indent,
					source: "\n"
				});
				return {
					type: "block-scalar",
					offset,
					indent,
					props,
					source: body
				};
			}
			case "\"": return {
				type: "double-quoted-scalar",
				offset,
				indent,
				source,
				end
			};
			case "'": return {
				type: "single-quoted-scalar",
				offset,
				indent,
				source,
				end
			};
			default: return {
				type: "scalar",
				offset,
				indent,
				source,
				end
			};
		}
	}
	/**
	* Set the value of `token` to the given string `value`, overwriting any previous contents and type that it may have.
	*
	* Best efforts are made to retain any comments previously associated with the `token`,
	* though all contents within a collection's `items` will be overwritten.
	*
	* Values that represent an actual string but may be parsed as a different type should use a `type` other than `'PLAIN'`,
	* as this function does not support any schema operations and won't check for such conflicts.
	*
	* @param token Any token. If it does not include an `indent` value, the value will be stringified as if it were an implicit key.
	* @param value The string representation of the value, which will have its content properly indented.
	* @param context.afterKey In most cases, values after a key should have an additional level of indentation.
	* @param context.implicitKey Being within an implicit key may affect the resolved type of the token's value.
	* @param context.inFlow Being within a flow collection may affect the resolved type of the token's value.
	* @param context.type The preferred type of the scalar token. If undefined, the previous type of the `token` will be used, defaulting to `'PLAIN'`.
	*/
	function setScalarValue(token, value, context = {}) {
		let { afterKey = false, implicitKey = false, inFlow = false, type } = context;
		let indent = "indent" in token ? token.indent : null;
		if (afterKey && typeof indent === "number") indent += 2;
		if (!type) switch (token.type) {
			case "single-quoted-scalar":
				type = "QUOTE_SINGLE";
				break;
			case "double-quoted-scalar":
				type = "QUOTE_DOUBLE";
				break;
			case "block-scalar": {
				const header = token.props[0];
				if (header.type !== "block-scalar-header") throw new Error("Invalid block scalar header");
				type = header.source[0] === ">" ? "BLOCK_FOLDED" : "BLOCK_LITERAL";
				break;
			}
			default: type = "PLAIN";
		}
		const source = stringifyString.stringifyString({
			type,
			value
		}, {
			implicitKey: implicitKey || indent === null,
			indent: indent !== null && indent > 0 ? " ".repeat(indent) : "",
			inFlow,
			options: {
				blockQuote: true,
				lineWidth: -1
			}
		});
		switch (source[0]) {
			case "|":
			case ">":
				setBlockScalarValue(token, source);
				break;
			case "\"":
				setFlowScalarValue(token, source, "double-quoted-scalar");
				break;
			case "'":
				setFlowScalarValue(token, source, "single-quoted-scalar");
				break;
			default: setFlowScalarValue(token, source, "scalar");
		}
	}
	function setBlockScalarValue(token, source) {
		const he = source.indexOf("\n");
		const head = source.substring(0, he);
		const body = source.substring(he + 1) + "\n";
		if (token.type === "block-scalar") {
			const header = token.props[0];
			if (header.type !== "block-scalar-header") throw new Error("Invalid block scalar header");
			header.source = head;
			token.source = body;
		} else {
			const { offset } = token;
			const indent = "indent" in token ? token.indent : -1;
			const props = [{
				type: "block-scalar-header",
				offset,
				indent,
				source: head
			}];
			if (!addEndtoBlockProps(props, "end" in token ? token.end : void 0)) props.push({
				type: "newline",
				offset: -1,
				indent,
				source: "\n"
			});
			for (const key of Object.keys(token)) if (key !== "type" && key !== "offset") delete token[key];
			Object.assign(token, {
				type: "block-scalar",
				indent,
				props,
				source: body
			});
		}
	}
	/** @returns `true` if last token is a newline */
	function addEndtoBlockProps(props, end) {
		if (end) for (const st of end) switch (st.type) {
			case "space":
			case "comment":
				props.push(st);
				break;
			case "newline":
				props.push(st);
				return true;
		}
		return false;
	}
	function setFlowScalarValue(token, source, type) {
		switch (token.type) {
			case "scalar":
			case "double-quoted-scalar":
			case "single-quoted-scalar":
				token.type = type;
				token.source = source;
				break;
			case "block-scalar": {
				const end = token.props.slice(1);
				let oa = source.length;
				if (token.props[0].type === "block-scalar-header") oa -= token.props[0].source.length;
				for (const tok of end) tok.offset += oa;
				delete token.props;
				Object.assign(token, {
					type,
					source,
					end
				});
				break;
			}
			case "block-map":
			case "block-seq": {
				const nl = {
					type: "newline",
					offset: token.offset + source.length,
					indent: token.indent,
					source: "\n"
				};
				delete token.items;
				Object.assign(token, {
					type,
					source,
					end: [nl]
				});
				break;
			}
			default: {
				const indent = "indent" in token ? token.indent : -1;
				const end = "end" in token && Array.isArray(token.end) ? token.end.filter((st) => st.type === "space" || st.type === "comment" || st.type === "newline") : [];
				for (const key of Object.keys(token)) if (key !== "type" && key !== "offset") delete token[key];
				Object.assign(token, {
					type,
					indent,
					source,
					end
				});
			}
		}
	}
	exports.createScalarToken = createScalarToken;
	exports.resolveAsScalar = resolveAsScalar;
	exports.setScalarValue = setScalarValue;
}));
//#endregion
//#region node_modules/yaml/dist/parse/cst-stringify.js
var require_cst_stringify = /* @__PURE__ */ __commonJSMin(((exports) => {
	/**
	* Stringify a CST document, token, or collection item
	*
	* Fair warning: This applies no validation whatsoever, and
	* simply concatenates the sources in their logical order.
	*/
	var stringify = (cst) => "type" in cst ? stringifyToken(cst) : stringifyItem(cst);
	function stringifyToken(token) {
		switch (token.type) {
			case "block-scalar": {
				let res = "";
				for (const tok of token.props) res += stringifyToken(tok);
				return res + token.source;
			}
			case "block-map":
			case "block-seq": {
				let res = "";
				for (const item of token.items) res += stringifyItem(item);
				return res;
			}
			case "flow-collection": {
				let res = token.start.source;
				for (const item of token.items) res += stringifyItem(item);
				for (const st of token.end) res += st.source;
				return res;
			}
			case "document": {
				let res = stringifyItem(token);
				if (token.end) for (const st of token.end) res += st.source;
				return res;
			}
			default: {
				let res = token.source;
				if ("end" in token && token.end) for (const st of token.end) res += st.source;
				return res;
			}
		}
	}
	function stringifyItem({ start, key, sep, value }) {
		let res = "";
		for (const st of start) res += st.source;
		if (key) res += stringifyToken(key);
		if (sep) for (const st of sep) res += st.source;
		if (value) res += stringifyToken(value);
		return res;
	}
	exports.stringify = stringify;
}));
//#endregion
//#region node_modules/yaml/dist/parse/cst-visit.js
var require_cst_visit = /* @__PURE__ */ __commonJSMin(((exports) => {
	var BREAK = Symbol("break visit");
	var SKIP = Symbol("skip children");
	var REMOVE = Symbol("remove item");
	/**
	* Apply a visitor to a CST document or item.
	*
	* Walks through the tree (depth-first) starting from the root, calling a
	* `visitor` function with two arguments when entering each item:
	*   - `item`: The current item, which included the following members:
	*     - `start: SourceToken[]` – Source tokens before the key or value,
	*       possibly including its anchor or tag.
	*     - `key?: Token | null` – Set for pair values. May then be `null`, if
	*       the key before the `:` separator is empty.
	*     - `sep?: SourceToken[]` – Source tokens between the key and the value,
	*       which should include the `:` map value indicator if `value` is set.
	*     - `value?: Token` – The value of a sequence item, or of a map pair.
	*   - `path`: The steps from the root to the current node, as an array of
	*     `['key' | 'value', number]` tuples.
	*
	* The return value of the visitor may be used to control the traversal:
	*   - `undefined` (default): Do nothing and continue
	*   - `visit.SKIP`: Do not visit the children of this token, continue with
	*      next sibling
	*   - `visit.BREAK`: Terminate traversal completely
	*   - `visit.REMOVE`: Remove the current item, then continue with the next one
	*   - `number`: Set the index of the next step. This is useful especially if
	*     the index of the current token has changed.
	*   - `function`: Define the next visitor for this item. After the original
	*     visitor is called on item entry, next visitors are called after handling
	*     a non-empty `key` and when exiting the item.
	*/
	function visit(cst, visitor) {
		if ("type" in cst && cst.type === "document") cst = {
			start: cst.start,
			value: cst.value
		};
		_visit(Object.freeze([]), cst, visitor);
	}
	/** Terminate visit traversal completely */
	visit.BREAK = BREAK;
	/** Do not visit the children of the current item */
	visit.SKIP = SKIP;
	/** Remove the current item */
	visit.REMOVE = REMOVE;
	/** Find the item at `path` from `cst` as the root */
	visit.itemAtPath = (cst, path) => {
		let item = cst;
		for (const [field, index] of path) {
			const tok = item?.[field];
			if (tok && "items" in tok) item = tok.items[index];
			else return void 0;
		}
		return item;
	};
	/**
	* Get the immediate parent collection of the item at `path` from `cst` as the root.
	*
	* Throws an error if the collection is not found, which should never happen if the item itself exists.
	*/
	visit.parentCollection = (cst, path) => {
		const parent = visit.itemAtPath(cst, path.slice(0, -1));
		const field = path[path.length - 1][0];
		const coll = parent?.[field];
		if (coll && "items" in coll) return coll;
		throw new Error("Parent collection not found");
	};
	function _visit(path, item, visitor) {
		let ctrl = visitor(item, path);
		if (typeof ctrl === "symbol") return ctrl;
		for (const field of ["key", "value"]) {
			const token = item[field];
			if (token && "items" in token) {
				for (let i = 0; i < token.items.length; ++i) {
					const ci = _visit(Object.freeze(path.concat([[field, i]])), token.items[i], visitor);
					if (typeof ci === "number") i = ci - 1;
					else if (ci === BREAK) return BREAK;
					else if (ci === REMOVE) {
						token.items.splice(i, 1);
						i -= 1;
					}
				}
				if (typeof ctrl === "function" && field === "key") ctrl = ctrl(item, path);
			}
		}
		return typeof ctrl === "function" ? ctrl(item, path) : ctrl;
	}
	exports.visit = visit;
}));
//#endregion
//#region node_modules/yaml/dist/parse/cst.js
var require_cst = /* @__PURE__ */ __commonJSMin(((exports) => {
	var cstScalar = require_cst_scalar();
	var cstStringify = require_cst_stringify();
	var cstVisit = require_cst_visit();
	/** The byte order mark */
	var BOM = "﻿";
	/** Start of doc-mode */
	var DOCUMENT = "";
	/** Unexpected end of flow-mode */
	var FLOW_END = "";
	/** Next token is a scalar value */
	var SCALAR = "";
	/** @returns `true` if `token` is a flow or block collection */
	var isCollection = (token) => !!token && "items" in token;
	/** @returns `true` if `token` is a flow or block scalar; not an alias */
	var isScalar = (token) => !!token && (token.type === "scalar" || token.type === "single-quoted-scalar" || token.type === "double-quoted-scalar" || token.type === "block-scalar");
	/* istanbul ignore next */
	/** Get a printable representation of a lexer token */
	function prettyToken(token) {
		switch (token) {
			case BOM: return "<BOM>";
			case DOCUMENT: return "<DOC>";
			case FLOW_END: return "<FLOW_END>";
			case SCALAR: return "<SCALAR>";
			default: return JSON.stringify(token);
		}
	}
	/** Identify the type of a lexer token. May return `null` for unknown tokens. */
	function tokenType(source) {
		switch (source) {
			case BOM: return "byte-order-mark";
			case DOCUMENT: return "doc-mode";
			case FLOW_END: return "flow-error-end";
			case SCALAR: return "scalar";
			case "---": return "doc-start";
			case "...": return "doc-end";
			case "":
			case "\n":
			case "\r\n": return "newline";
			case "-": return "seq-item-ind";
			case "?": return "explicit-key-ind";
			case ":": return "map-value-ind";
			case "{": return "flow-map-start";
			case "}": return "flow-map-end";
			case "[": return "flow-seq-start";
			case "]": return "flow-seq-end";
			case ",": return "comma";
		}
		switch (source[0]) {
			case " ":
			case "	": return "space";
			case "#": return "comment";
			case "%": return "directive-line";
			case "*": return "alias";
			case "&": return "anchor";
			case "!": return "tag";
			case "'": return "single-quoted-scalar";
			case "\"": return "double-quoted-scalar";
			case "|":
			case ">": return "block-scalar-header";
		}
		return null;
	}
	exports.createScalarToken = cstScalar.createScalarToken;
	exports.resolveAsScalar = cstScalar.resolveAsScalar;
	exports.setScalarValue = cstScalar.setScalarValue;
	exports.stringify = cstStringify.stringify;
	exports.visit = cstVisit.visit;
	exports.BOM = BOM;
	exports.DOCUMENT = DOCUMENT;
	exports.FLOW_END = FLOW_END;
	exports.SCALAR = SCALAR;
	exports.isCollection = isCollection;
	exports.isScalar = isScalar;
	exports.prettyToken = prettyToken;
	exports.tokenType = tokenType;
}));
//#endregion
//#region node_modules/yaml/dist/parse/lexer.js
var require_lexer = /* @__PURE__ */ __commonJSMin(((exports) => {
	var cst = require_cst();
	function isEmpty(ch) {
		switch (ch) {
			case void 0:
			case " ":
			case "\n":
			case "\r":
			case "	": return true;
			default: return false;
		}
	}
	var hexDigits = /* @__PURE__ */ new Set("0123456789ABCDEFabcdef");
	var tagChars = /* @__PURE__ */ new Set("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-#;/?:@&=+$_.!~*'()");
	var flowIndicatorChars = /* @__PURE__ */ new Set(",[]{}");
	var invalidAnchorChars = /* @__PURE__ */ new Set(" ,[]{}\n\r	");
	var isNotAnchorChar = (ch) => !ch || invalidAnchorChars.has(ch);
	/**
	* Splits an input string into lexical tokens, i.e. smaller strings that are
	* easily identifiable by `tokens.tokenType()`.
	*
	* Lexing starts always in a "stream" context. Incomplete input may be buffered
	* until a complete token can be emitted.
	*
	* In addition to slices of the original input, the following control characters
	* may also be emitted:
	*
	* - `\x02` (Start of Text): A document starts with the next token
	* - `\x18` (Cancel): Unexpected end of flow-mode (indicates an error)
	* - `\x1f` (Unit Separator): Next token is a scalar value
	* - `\u{FEFF}` (Byte order mark): Emitted separately outside documents
	*/
	var Lexer = class {
		constructor() {
			/**
			* Flag indicating whether the end of the current buffer marks the end of
			* all input
			*/
			this.atEnd = false;
			/**
			* Explicit indent set in block scalar header, as an offset from the current
			* minimum indent, so e.g. set to 1 from a header `|2+`. Set to -1 if not
			* explicitly set.
			*/
			this.blockScalarIndent = -1;
			/**
			* Block scalars that include a + (keep) chomping indicator in their header
			* include trailing empty lines, which are otherwise excluded from the
			* scalar's contents.
			*/
			this.blockScalarKeep = false;
			/** Current input */
			this.buffer = "";
			/**
			* Flag noting whether the map value indicator : can immediately follow this
			* node within a flow context.
			*/
			this.flowKey = false;
			/** Count of surrounding flow collection levels. */
			this.flowLevel = 0;
			/**
			* Minimum level of indentation required for next lines to be parsed as a
			* part of the current scalar value.
			*/
			this.indentNext = 0;
			/** Indentation level of the current line. */
			this.indentValue = 0;
			/** Position of the next \n character. */
			this.lineEndPos = null;
			/** Stores the state of the lexer if reaching the end of incpomplete input */
			this.next = null;
			/** A pointer to `buffer`; the current position of the lexer. */
			this.pos = 0;
		}
		/**
		* Generate YAML tokens from the `source` string. If `incomplete`,
		* a part of the last line may be left as a buffer for the next call.
		*
		* @returns A generator of lexical tokens
		*/
		*lex(source, incomplete = false) {
			if (source) {
				if (typeof source !== "string") throw TypeError("source is not a string");
				this.buffer = this.buffer ? this.buffer + source : source;
				this.lineEndPos = null;
			}
			this.atEnd = !incomplete;
			let next = this.next ?? "stream";
			while (next && (incomplete || this.hasChars(1))) next = yield* this.parseNext(next);
		}
		atLineEnd() {
			let i = this.pos;
			let ch = this.buffer[i];
			while (ch === " " || ch === "	") ch = this.buffer[++i];
			if (!ch || ch === "#" || ch === "\n") return true;
			if (ch === "\r") return this.buffer[i + 1] === "\n";
			return false;
		}
		charAt(n) {
			return this.buffer[this.pos + n];
		}
		continueScalar(offset) {
			let ch = this.buffer[offset];
			if (this.indentNext > 0) {
				let indent = 0;
				while (ch === " ") ch = this.buffer[++indent + offset];
				if (ch === "\r") {
					const next = this.buffer[indent + offset + 1];
					if (next === "\n" || !next && !this.atEnd) return offset + indent + 1;
				}
				return ch === "\n" || indent >= this.indentNext || !ch && !this.atEnd ? offset + indent : -1;
			}
			if (ch === "-" || ch === ".") {
				const dt = this.buffer.substr(offset, 3);
				if ((dt === "---" || dt === "...") && isEmpty(this.buffer[offset + 3])) return -1;
			}
			return offset;
		}
		getLine() {
			let end = this.lineEndPos;
			if (typeof end !== "number" || end !== -1 && end < this.pos) {
				end = this.buffer.indexOf("\n", this.pos);
				this.lineEndPos = end;
			}
			if (end === -1) return this.atEnd ? this.buffer.substring(this.pos) : null;
			if (this.buffer[end - 1] === "\r") end -= 1;
			return this.buffer.substring(this.pos, end);
		}
		hasChars(n) {
			return this.pos + n <= this.buffer.length;
		}
		setNext(state) {
			this.buffer = this.buffer.substring(this.pos);
			this.pos = 0;
			this.lineEndPos = null;
			this.next = state;
			return null;
		}
		peek(n) {
			return this.buffer.substr(this.pos, n);
		}
		*parseNext(next) {
			switch (next) {
				case "stream": return yield* this.parseStream();
				case "line-start": return yield* this.parseLineStart();
				case "block-start": return yield* this.parseBlockStart();
				case "doc": return yield* this.parseDocument();
				case "flow": return yield* this.parseFlowCollection();
				case "quoted-scalar": return yield* this.parseQuotedScalar();
				case "block-scalar": return yield* this.parseBlockScalar();
				case "plain-scalar": return yield* this.parsePlainScalar();
			}
		}
		*parseStream() {
			let line = this.getLine();
			if (line === null) return this.setNext("stream");
			if (line[0] === cst.BOM) {
				yield* this.pushCount(1);
				line = line.substring(1);
			}
			if (line[0] === "%") {
				let dirEnd = line.length;
				let cs = line.indexOf("#");
				while (cs !== -1) {
					const ch = line[cs - 1];
					if (ch === " " || ch === "	") {
						dirEnd = cs - 1;
						break;
					} else cs = line.indexOf("#", cs + 1);
				}
				while (true) {
					const ch = line[dirEnd - 1];
					if (ch === " " || ch === "	") dirEnd -= 1;
					else break;
				}
				const n = (yield* this.pushCount(dirEnd)) + (yield* this.pushSpaces(true));
				yield* this.pushCount(line.length - n);
				this.pushNewline();
				return "stream";
			}
			if (this.atLineEnd()) {
				const sp = yield* this.pushSpaces(true);
				yield* this.pushCount(line.length - sp);
				yield* this.pushNewline();
				return "stream";
			}
			yield cst.DOCUMENT;
			return yield* this.parseLineStart();
		}
		*parseLineStart() {
			const ch = this.charAt(0);
			if (!ch && !this.atEnd) return this.setNext("line-start");
			if (ch === "-" || ch === ".") {
				if (!this.atEnd && !this.hasChars(4)) return this.setNext("line-start");
				const s = this.peek(3);
				if ((s === "---" || s === "...") && isEmpty(this.charAt(3))) {
					yield* this.pushCount(3);
					this.indentValue = 0;
					this.indentNext = 0;
					return s === "---" ? "doc" : "stream";
				}
			}
			this.indentValue = yield* this.pushSpaces(false);
			if (this.indentNext > this.indentValue && !isEmpty(this.charAt(1))) this.indentNext = this.indentValue;
			return yield* this.parseBlockStart();
		}
		*parseBlockStart() {
			const [ch0, ch1] = this.peek(2);
			if (!ch1 && !this.atEnd) return this.setNext("block-start");
			if ((ch0 === "-" || ch0 === "?" || ch0 === ":") && isEmpty(ch1)) {
				const n = (yield* this.pushCount(1)) + (yield* this.pushSpaces(true));
				this.indentNext = this.indentValue + 1;
				this.indentValue += n;
				return "block-start";
			}
			return "doc";
		}
		*parseDocument() {
			yield* this.pushSpaces(true);
			const line = this.getLine();
			if (line === null) return this.setNext("doc");
			let n = yield* this.pushIndicators();
			switch (line[n]) {
				case "#": yield* this.pushCount(line.length - n);
				case void 0:
					yield* this.pushNewline();
					return yield* this.parseLineStart();
				case "{":
				case "[":
					yield* this.pushCount(1);
					this.flowKey = false;
					this.flowLevel = 1;
					return "flow";
				case "}":
				case "]":
					yield* this.pushCount(1);
					return "doc";
				case "*":
					yield* this.pushUntil(isNotAnchorChar);
					return "doc";
				case "\"":
				case "'": return yield* this.parseQuotedScalar();
				case "|":
				case ">":
					n += yield* this.parseBlockScalarHeader();
					n += yield* this.pushSpaces(true);
					yield* this.pushCount(line.length - n);
					yield* this.pushNewline();
					return yield* this.parseBlockScalar();
				default: return yield* this.parsePlainScalar();
			}
		}
		*parseFlowCollection() {
			let nl, sp;
			let indent = -1;
			do {
				nl = yield* this.pushNewline();
				if (nl > 0) {
					sp = yield* this.pushSpaces(false);
					this.indentValue = indent = sp;
				} else sp = 0;
				sp += yield* this.pushSpaces(true);
			} while (nl + sp > 0);
			const line = this.getLine();
			if (line === null) return this.setNext("flow");
			if (indent !== -1 && indent < this.indentNext && line[0] !== "#" || indent === 0 && (line.startsWith("---") || line.startsWith("...")) && isEmpty(line[3])) {
				if (!(indent === this.indentNext - 1 && this.flowLevel === 1 && (line[0] === "]" || line[0] === "}"))) {
					this.flowLevel = 0;
					yield cst.FLOW_END;
					return yield* this.parseLineStart();
				}
			}
			let n = 0;
			while (line[n] === ",") {
				n += yield* this.pushCount(1);
				n += yield* this.pushSpaces(true);
				this.flowKey = false;
			}
			n += yield* this.pushIndicators();
			switch (line[n]) {
				case void 0: return "flow";
				case "#":
					yield* this.pushCount(line.length - n);
					return "flow";
				case "{":
				case "[":
					yield* this.pushCount(1);
					this.flowKey = false;
					this.flowLevel += 1;
					return "flow";
				case "}":
				case "]":
					yield* this.pushCount(1);
					this.flowKey = true;
					this.flowLevel -= 1;
					return this.flowLevel ? "flow" : "doc";
				case "*":
					yield* this.pushUntil(isNotAnchorChar);
					return "flow";
				case "\"":
				case "'":
					this.flowKey = true;
					return yield* this.parseQuotedScalar();
				case ":": {
					const next = this.charAt(1);
					if (this.flowKey || isEmpty(next) || next === ",") {
						this.flowKey = false;
						yield* this.pushCount(1);
						yield* this.pushSpaces(true);
						return "flow";
					}
				}
				default:
					this.flowKey = false;
					return yield* this.parsePlainScalar();
			}
		}
		*parseQuotedScalar() {
			const quote = this.charAt(0);
			let end = this.buffer.indexOf(quote, this.pos + 1);
			if (quote === "'") while (end !== -1 && this.buffer[end + 1] === "'") end = this.buffer.indexOf("'", end + 2);
			else while (end !== -1) {
				let n = 0;
				while (this.buffer[end - 1 - n] === "\\") n += 1;
				if (n % 2 === 0) break;
				end = this.buffer.indexOf("\"", end + 1);
			}
			const qb = this.buffer.substring(0, end);
			let nl = qb.indexOf("\n", this.pos);
			if (nl !== -1) {
				while (nl !== -1) {
					const cs = this.continueScalar(nl + 1);
					if (cs === -1) break;
					nl = qb.indexOf("\n", cs);
				}
				if (nl !== -1) end = nl - (qb[nl - 1] === "\r" ? 2 : 1);
			}
			if (end === -1) {
				if (!this.atEnd) return this.setNext("quoted-scalar");
				end = this.buffer.length;
			}
			yield* this.pushToIndex(end + 1, false);
			return this.flowLevel ? "flow" : "doc";
		}
		*parseBlockScalarHeader() {
			this.blockScalarIndent = -1;
			this.blockScalarKeep = false;
			let i = this.pos;
			while (true) {
				const ch = this.buffer[++i];
				if (ch === "+") this.blockScalarKeep = true;
				else if (ch > "0" && ch <= "9") this.blockScalarIndent = Number(ch) - 1;
				else if (ch !== "-") break;
			}
			return yield* this.pushUntil((ch) => isEmpty(ch) || ch === "#");
		}
		*parseBlockScalar() {
			let nl = this.pos - 1;
			let indent = 0;
			let ch;
			loop: for (let i = this.pos; ch = this.buffer[i]; ++i) switch (ch) {
				case " ":
					indent += 1;
					break;
				case "\n":
					nl = i;
					indent = 0;
					break;
				case "\r": {
					const next = this.buffer[i + 1];
					if (!next && !this.atEnd) return this.setNext("block-scalar");
					if (next === "\n") break;
				}
				default: break loop;
			}
			if (!ch && !this.atEnd) return this.setNext("block-scalar");
			if (indent >= this.indentNext) {
				if (this.blockScalarIndent === -1) this.indentNext = indent;
				else this.indentNext = this.blockScalarIndent + (this.indentNext === 0 ? 1 : this.indentNext);
				do {
					const cs = this.continueScalar(nl + 1);
					if (cs === -1) break;
					nl = this.buffer.indexOf("\n", cs);
				} while (nl !== -1);
				if (nl === -1) {
					if (!this.atEnd) return this.setNext("block-scalar");
					nl = this.buffer.length;
				}
			}
			let i = nl + 1;
			ch = this.buffer[i];
			while (ch === " ") ch = this.buffer[++i];
			if (ch === "	") {
				while (ch === "	" || ch === " " || ch === "\r" || ch === "\n") ch = this.buffer[++i];
				nl = i - 1;
			} else if (!this.blockScalarKeep) do {
				let i = nl - 1;
				let ch = this.buffer[i];
				if (ch === "\r") ch = this.buffer[--i];
				const lastChar = i;
				while (ch === " ") ch = this.buffer[--i];
				if (ch === "\n" && i >= this.pos && i + 1 + indent > lastChar) nl = i;
				else break;
			} while (true);
			yield cst.SCALAR;
			yield* this.pushToIndex(nl + 1, true);
			return yield* this.parseLineStart();
		}
		*parsePlainScalar() {
			const inFlow = this.flowLevel > 0;
			let end = this.pos - 1;
			let i = this.pos - 1;
			let ch;
			while (ch = this.buffer[++i]) if (ch === ":") {
				const next = this.buffer[i + 1];
				if (isEmpty(next) || inFlow && flowIndicatorChars.has(next)) break;
				end = i;
			} else if (isEmpty(ch)) {
				let next = this.buffer[i + 1];
				if (ch === "\r") if (next === "\n") {
					i += 1;
					ch = "\n";
					next = this.buffer[i + 1];
				} else end = i;
				if (next === "#" || inFlow && flowIndicatorChars.has(next)) break;
				if (ch === "\n") {
					const cs = this.continueScalar(i + 1);
					if (cs === -1) break;
					i = Math.max(i, cs - 2);
				}
			} else {
				if (inFlow && flowIndicatorChars.has(ch)) break;
				end = i;
			}
			if (!ch && !this.atEnd) return this.setNext("plain-scalar");
			yield cst.SCALAR;
			yield* this.pushToIndex(end + 1, true);
			return inFlow ? "flow" : "doc";
		}
		*pushCount(n) {
			if (n > 0) {
				yield this.buffer.substr(this.pos, n);
				this.pos += n;
				return n;
			}
			return 0;
		}
		*pushToIndex(i, allowEmpty) {
			const s = this.buffer.slice(this.pos, i);
			if (s) {
				yield s;
				this.pos += s.length;
				return s.length;
			} else if (allowEmpty) yield "";
			return 0;
		}
		*pushIndicators() {
			let n = 0;
			loop: while (true) {
				switch (this.charAt(0)) {
					case "!":
						n += yield* this.pushTag();
						n += yield* this.pushSpaces(true);
						continue loop;
					case "&":
						n += yield* this.pushUntil(isNotAnchorChar);
						n += yield* this.pushSpaces(true);
						continue loop;
					case "-":
					case "?":
					case ":": {
						const inFlow = this.flowLevel > 0;
						const ch1 = this.charAt(1);
						if (isEmpty(ch1) || inFlow && flowIndicatorChars.has(ch1)) {
							if (!inFlow) this.indentNext = this.indentValue + 1;
							else if (this.flowKey) this.flowKey = false;
							n += yield* this.pushCount(1);
							n += yield* this.pushSpaces(true);
							continue loop;
						}
					}
				}
				break loop;
			}
			return n;
		}
		*pushTag() {
			if (this.charAt(1) === "<") {
				let i = this.pos + 2;
				let ch = this.buffer[i];
				while (!isEmpty(ch) && ch !== ">") ch = this.buffer[++i];
				return yield* this.pushToIndex(ch === ">" ? i + 1 : i, false);
			} else {
				let i = this.pos + 1;
				let ch = this.buffer[i];
				while (ch) if (tagChars.has(ch)) ch = this.buffer[++i];
				else if (ch === "%" && hexDigits.has(this.buffer[i + 1]) && hexDigits.has(this.buffer[i + 2])) ch = this.buffer[i += 3];
				else break;
				return yield* this.pushToIndex(i, false);
			}
		}
		*pushNewline() {
			const ch = this.buffer[this.pos];
			if (ch === "\n") return yield* this.pushCount(1);
			else if (ch === "\r" && this.charAt(1) === "\n") return yield* this.pushCount(2);
			else return 0;
		}
		*pushSpaces(allowTabs) {
			let i = this.pos - 1;
			let ch;
			do
				ch = this.buffer[++i];
			while (ch === " " || allowTabs && ch === "	");
			const n = i - this.pos;
			if (n > 0) {
				yield this.buffer.substr(this.pos, n);
				this.pos = i;
			}
			return n;
		}
		*pushUntil(test) {
			let i = this.pos;
			let ch = this.buffer[i];
			while (!test(ch)) ch = this.buffer[++i];
			return yield* this.pushToIndex(i, false);
		}
	};
	exports.Lexer = Lexer;
}));
//#endregion
//#region node_modules/yaml/dist/parse/line-counter.js
var require_line_counter = /* @__PURE__ */ __commonJSMin(((exports) => {
	/**
	* Tracks newlines during parsing in order to provide an efficient API for
	* determining the one-indexed `{ line, col }` position for any offset
	* within the input.
	*/
	var LineCounter = class {
		constructor() {
			this.lineStarts = [];
			/**
			* Should be called in ascending order. Otherwise, call
			* `lineCounter.lineStarts.sort()` before calling `linePos()`.
			*/
			this.addNewLine = (offset) => this.lineStarts.push(offset);
			/**
			* Performs a binary search and returns the 1-indexed { line, col }
			* position of `offset`. If `line === 0`, `addNewLine` has never been
			* called or `offset` is before the first known newline.
			*/
			this.linePos = (offset) => {
				let low = 0;
				let high = this.lineStarts.length;
				while (low < high) {
					const mid = low + high >> 1;
					if (this.lineStarts[mid] < offset) low = mid + 1;
					else high = mid;
				}
				if (this.lineStarts[low] === offset) return {
					line: low + 1,
					col: 1
				};
				if (low === 0) return {
					line: 0,
					col: offset
				};
				const start = this.lineStarts[low - 1];
				return {
					line: low,
					col: offset - start + 1
				};
			};
		}
	};
	exports.LineCounter = LineCounter;
}));
//#endregion
//#region node_modules/yaml/dist/parse/parser.js
var require_parser = /* @__PURE__ */ __commonJSMin(((exports) => {
	var node_process = __require("process");
	var cst = require_cst();
	var lexer = require_lexer();
	function includesToken(list, type) {
		for (let i = 0; i < list.length; ++i) if (list[i].type === type) return true;
		return false;
	}
	function findNonEmptyIndex(list) {
		for (let i = 0; i < list.length; ++i) switch (list[i].type) {
			case "space":
			case "comment":
			case "newline": break;
			default: return i;
		}
		return -1;
	}
	function isFlowToken(token) {
		switch (token?.type) {
			case "alias":
			case "scalar":
			case "single-quoted-scalar":
			case "double-quoted-scalar":
			case "flow-collection": return true;
			default: return false;
		}
	}
	function getPrevProps(parent) {
		switch (parent.type) {
			case "document": return parent.start;
			case "block-map": {
				const it = parent.items[parent.items.length - 1];
				return it.sep ?? it.start;
			}
			case "block-seq": return parent.items[parent.items.length - 1].start;
			/* istanbul ignore next should not happen */
			default: return [];
		}
	}
	/** Note: May modify input array */
	function getFirstKeyStartProps(prev) {
		if (prev.length === 0) return [];
		let i = prev.length;
		loop: while (--i >= 0) switch (prev[i].type) {
			case "doc-start":
			case "explicit-key-ind":
			case "map-value-ind":
			case "seq-item-ind":
			case "newline": break loop;
		}
		while (prev[++i]?.type === "space");
		return prev.splice(i, prev.length);
	}
	function arrayPushArray(target, source) {
		if (source.length < 1e5) Array.prototype.push.apply(target, source);
		else for (let i = 0; i < source.length; ++i) target.push(source[i]);
	}
	function fixFlowSeqItems(fc) {
		if (fc.start.type === "flow-seq-start") {
			for (const it of fc.items) if (it.sep && !it.value && !includesToken(it.start, "explicit-key-ind") && !includesToken(it.sep, "map-value-ind")) {
				if (it.key) it.value = it.key;
				delete it.key;
				if (isFlowToken(it.value)) if (it.value.end) arrayPushArray(it.value.end, it.sep);
				else it.value.end = it.sep;
				else arrayPushArray(it.start, it.sep);
				delete it.sep;
			}
		}
	}
	/**
	* A YAML concrete syntax tree (CST) parser
	*
	* ```ts
	* const src: string = ...
	* for (const token of new Parser().parse(src)) {
	*   // token: Token
	* }
	* ```
	*
	* To use the parser with a user-provided lexer:
	*
	* ```ts
	* function* parse(source: string, lexer: Lexer) {
	*   const parser = new Parser()
	*   for (const lexeme of lexer.lex(source))
	*     yield* parser.next(lexeme)
	*   yield* parser.end()
	* }
	*
	* const src: string = ...
	* const lexer = new Lexer()
	* for (const token of parse(src, lexer)) {
	*   // token: Token
	* }
	* ```
	*/
	var Parser = class {
		/**
		* @param onNewLine - If defined, called separately with the start position of
		*   each new line (in `parse()`, including the start of input).
		*/
		constructor(onNewLine) {
			/** If true, space and sequence indicators count as indentation */
			this.atNewLine = true;
			/** If true, next token is a scalar value */
			this.atScalar = false;
			/** Current indentation level */
			this.indent = 0;
			/** Current offset since the start of parsing */
			this.offset = 0;
			/** On the same line with a block map key */
			this.onKeyLine = false;
			/** Top indicates the node that's currently being built */
			this.stack = [];
			/** The source of the current token, set in parse() */
			this.source = "";
			/** The type of the current token, set in parse() */
			this.type = "";
			this.lexer = new lexer.Lexer();
			this.onNewLine = onNewLine;
		}
		/**
		* Parse `source` as a YAML stream.
		* If `incomplete`, a part of the last line may be left as a buffer for the next call.
		*
		* Errors are not thrown, but yielded as `{ type: 'error', message }` tokens.
		*
		* @returns A generator of tokens representing each directive, document, and other structure.
		*/
		*parse(source, incomplete = false) {
			if (this.onNewLine && this.offset === 0) this.onNewLine(0);
			for (const lexeme of this.lexer.lex(source, incomplete)) yield* this.next(lexeme);
			if (!incomplete) yield* this.end();
		}
		/**
		* Advance the parser by the `source` of one lexical token.
		*/
		*next(source) {
			this.source = source;
			if (node_process.env.LOG_TOKENS) console.log("|", cst.prettyToken(source));
			if (this.atScalar) {
				this.atScalar = false;
				yield* this.step();
				this.offset += source.length;
				return;
			}
			const type = cst.tokenType(source);
			if (!type) {
				const message = `Not a YAML token: ${source}`;
				yield* this.pop({
					type: "error",
					offset: this.offset,
					message,
					source
				});
				this.offset += source.length;
			} else if (type === "scalar") {
				this.atNewLine = false;
				this.atScalar = true;
				this.type = "scalar";
			} else {
				this.type = type;
				yield* this.step();
				switch (type) {
					case "newline":
						this.atNewLine = true;
						this.indent = 0;
						if (this.onNewLine) this.onNewLine(this.offset + source.length);
						break;
					case "space":
						if (this.atNewLine && source[0] === " ") this.indent += source.length;
						break;
					case "explicit-key-ind":
					case "map-value-ind":
					case "seq-item-ind":
						if (this.atNewLine) this.indent += source.length;
						break;
					case "doc-mode":
					case "flow-error-end": return;
					default: this.atNewLine = false;
				}
				this.offset += source.length;
			}
		}
		/** Call at end of input to push out any remaining constructions */
		*end() {
			while (this.stack.length > 0) yield* this.pop();
		}
		get sourceToken() {
			return {
				type: this.type,
				offset: this.offset,
				indent: this.indent,
				source: this.source
			};
		}
		*step() {
			const top = this.peek(1);
			if (this.type === "doc-end" && top?.type !== "doc-end") {
				while (this.stack.length > 0) yield* this.pop();
				this.stack.push({
					type: "doc-end",
					offset: this.offset,
					source: this.source
				});
				return;
			}
			if (!top) return yield* this.stream();
			switch (top.type) {
				case "document": return yield* this.document(top);
				case "alias":
				case "scalar":
				case "single-quoted-scalar":
				case "double-quoted-scalar": return yield* this.scalar(top);
				case "block-scalar": return yield* this.blockScalar(top);
				case "block-map": return yield* this.blockMap(top);
				case "block-seq": return yield* this.blockSequence(top);
				case "flow-collection": return yield* this.flowCollection(top);
				case "doc-end": return yield* this.documentEnd(top);
			}
			/* istanbul ignore next should not happen */
			yield* this.pop();
		}
		peek(n) {
			return this.stack[this.stack.length - n];
		}
		*pop(error) {
			const token = error ?? this.stack.pop();
			/* istanbul ignore if should not happen */
			if (!token) yield {
				type: "error",
				offset: this.offset,
				source: "",
				message: "Tried to pop an empty stack"
			};
			else if (this.stack.length === 0) yield token;
			else {
				const top = this.peek(1);
				if (token.type === "block-scalar") token.indent = "indent" in top ? top.indent : 0;
				else if (token.type === "flow-collection" && top.type === "document") token.indent = 0;
				if (token.type === "flow-collection") fixFlowSeqItems(token);
				switch (top.type) {
					case "document":
						top.value = token;
						break;
					case "block-scalar":
						top.props.push(token);
						break;
					case "block-map": {
						const it = top.items[top.items.length - 1];
						if (it.value) {
							top.items.push({
								start: [],
								key: token,
								sep: []
							});
							this.onKeyLine = true;
							return;
						} else if (it.sep) it.value = token;
						else {
							Object.assign(it, {
								key: token,
								sep: []
							});
							this.onKeyLine = !it.explicitKey;
							return;
						}
						break;
					}
					case "block-seq": {
						const it = top.items[top.items.length - 1];
						if (it.value) top.items.push({
							start: [],
							value: token
						});
						else it.value = token;
						break;
					}
					case "flow-collection": {
						const it = top.items[top.items.length - 1];
						if (!it || it.value) top.items.push({
							start: [],
							key: token,
							sep: []
						});
						else if (it.sep) it.value = token;
						else Object.assign(it, {
							key: token,
							sep: []
						});
						return;
					}
					/* istanbul ignore next should not happen */
					default:
						yield* this.pop();
						yield* this.pop(token);
				}
				if ((top.type === "document" || top.type === "block-map" || top.type === "block-seq") && (token.type === "block-map" || token.type === "block-seq")) {
					const last = token.items[token.items.length - 1];
					if (last && !last.sep && !last.value && last.start.length > 0 && findNonEmptyIndex(last.start) === -1 && (token.indent === 0 || last.start.every((st) => st.type !== "comment" || st.indent < token.indent))) {
						if (top.type === "document") top.end = last.start;
						else top.items.push({ start: last.start });
						token.items.splice(-1, 1);
					}
				}
			}
		}
		*stream() {
			switch (this.type) {
				case "directive-line":
					yield {
						type: "directive",
						offset: this.offset,
						source: this.source
					};
					return;
				case "byte-order-mark":
				case "space":
				case "comment":
				case "newline":
					yield this.sourceToken;
					return;
				case "doc-mode":
				case "doc-start": {
					const doc = {
						type: "document",
						offset: this.offset,
						start: []
					};
					if (this.type === "doc-start") doc.start.push(this.sourceToken);
					this.stack.push(doc);
					return;
				}
			}
			yield {
				type: "error",
				offset: this.offset,
				message: `Unexpected ${this.type} token in YAML stream`,
				source: this.source
			};
		}
		*document(doc) {
			if (doc.value) return yield* this.lineEnd(doc);
			switch (this.type) {
				case "doc-start":
					if (findNonEmptyIndex(doc.start) !== -1) {
						yield* this.pop();
						yield* this.step();
					} else doc.start.push(this.sourceToken);
					return;
				case "anchor":
				case "tag":
				case "space":
				case "comment":
				case "newline":
					doc.start.push(this.sourceToken);
					return;
			}
			const bv = this.startBlockValue(doc);
			if (bv) this.stack.push(bv);
			else yield {
				type: "error",
				offset: this.offset,
				message: `Unexpected ${this.type} token in YAML document`,
				source: this.source
			};
		}
		*scalar(scalar) {
			if (this.type === "map-value-ind") {
				const start = getFirstKeyStartProps(getPrevProps(this.peek(2)));
				let sep;
				if (scalar.end) {
					sep = scalar.end;
					sep.push(this.sourceToken);
					delete scalar.end;
				} else sep = [this.sourceToken];
				const map = {
					type: "block-map",
					offset: scalar.offset,
					indent: scalar.indent,
					items: [{
						start,
						key: scalar,
						sep
					}]
				};
				this.onKeyLine = true;
				this.stack[this.stack.length - 1] = map;
			} else yield* this.lineEnd(scalar);
		}
		*blockScalar(scalar) {
			switch (this.type) {
				case "space":
				case "comment":
				case "newline":
					scalar.props.push(this.sourceToken);
					return;
				case "scalar":
					scalar.source = this.source;
					this.atNewLine = true;
					this.indent = 0;
					if (this.onNewLine) {
						let nl = this.source.indexOf("\n") + 1;
						while (nl !== 0) {
							this.onNewLine(this.offset + nl);
							nl = this.source.indexOf("\n", nl) + 1;
						}
					}
					yield* this.pop();
					break;
				/* istanbul ignore next should not happen */
				default:
					yield* this.pop();
					yield* this.step();
			}
		}
		*blockMap(map) {
			const it = map.items[map.items.length - 1];
			switch (this.type) {
				case "newline":
					this.onKeyLine = false;
					if (it.value) {
						const end = "end" in it.value ? it.value.end : void 0;
						if ((Array.isArray(end) ? end[end.length - 1] : void 0)?.type === "comment") end?.push(this.sourceToken);
						else map.items.push({ start: [this.sourceToken] });
					} else if (it.sep) it.sep.push(this.sourceToken);
					else it.start.push(this.sourceToken);
					return;
				case "space":
				case "comment":
					if (it.value) map.items.push({ start: [this.sourceToken] });
					else if (it.sep) it.sep.push(this.sourceToken);
					else {
						if (this.atIndentedComment(it.start, map.indent)) {
							const end = map.items[map.items.length - 2]?.value?.end;
							if (Array.isArray(end)) {
								arrayPushArray(end, it.start);
								end.push(this.sourceToken);
								map.items.pop();
								return;
							}
						}
						it.start.push(this.sourceToken);
					}
					return;
			}
			if (this.indent >= map.indent) {
				const atMapIndent = !this.onKeyLine && this.indent === map.indent;
				const atNextItem = atMapIndent && (it.sep || it.explicitKey) && this.type !== "seq-item-ind";
				let start = [];
				if (atNextItem && it.sep && !it.value) {
					const nl = [];
					for (let i = 0; i < it.sep.length; ++i) {
						const st = it.sep[i];
						switch (st.type) {
							case "newline":
								nl.push(i);
								break;
							case "space": break;
							case "comment":
								if (st.indent > map.indent) nl.length = 0;
								break;
							default: nl.length = 0;
						}
					}
					if (nl.length >= 2) start = it.sep.splice(nl[1]);
				}
				switch (this.type) {
					case "anchor":
					case "tag":
						if (atNextItem || it.value) {
							start.push(this.sourceToken);
							map.items.push({ start });
							this.onKeyLine = true;
						} else if (it.sep) it.sep.push(this.sourceToken);
						else it.start.push(this.sourceToken);
						return;
					case "explicit-key-ind":
						if (!it.sep && !it.explicitKey) {
							it.start.push(this.sourceToken);
							it.explicitKey = true;
						} else if (atNextItem || it.value) {
							start.push(this.sourceToken);
							map.items.push({
								start,
								explicitKey: true
							});
						} else this.stack.push({
							type: "block-map",
							offset: this.offset,
							indent: this.indent,
							items: [{
								start: [this.sourceToken],
								explicitKey: true
							}]
						});
						this.onKeyLine = true;
						return;
					case "map-value-ind":
						if (it.explicitKey) if (!it.sep) if (includesToken(it.start, "newline")) Object.assign(it, {
							key: null,
							sep: [this.sourceToken]
						});
						else {
							const start = getFirstKeyStartProps(it.start);
							this.stack.push({
								type: "block-map",
								offset: this.offset,
								indent: this.indent,
								items: [{
									start,
									key: null,
									sep: [this.sourceToken]
								}]
							});
						}
						else if (it.value) map.items.push({
							start: [],
							key: null,
							sep: [this.sourceToken]
						});
						else if (includesToken(it.sep, "map-value-ind")) this.stack.push({
							type: "block-map",
							offset: this.offset,
							indent: this.indent,
							items: [{
								start,
								key: null,
								sep: [this.sourceToken]
							}]
						});
						else if (isFlowToken(it.key) && !includesToken(it.sep, "newline")) {
							const start = getFirstKeyStartProps(it.start);
							const key = it.key;
							const sep = it.sep;
							sep.push(this.sourceToken);
							delete it.key;
							delete it.sep;
							this.stack.push({
								type: "block-map",
								offset: this.offset,
								indent: this.indent,
								items: [{
									start,
									key,
									sep
								}]
							});
						} else if (start.length > 0) it.sep = it.sep.concat(start, this.sourceToken);
						else it.sep.push(this.sourceToken);
						else if (!it.sep) Object.assign(it, {
							key: null,
							sep: [this.sourceToken]
						});
						else if (it.value || atNextItem) map.items.push({
							start,
							key: null,
							sep: [this.sourceToken]
						});
						else if (includesToken(it.sep, "map-value-ind")) this.stack.push({
							type: "block-map",
							offset: this.offset,
							indent: this.indent,
							items: [{
								start: [],
								key: null,
								sep: [this.sourceToken]
							}]
						});
						else it.sep.push(this.sourceToken);
						this.onKeyLine = true;
						return;
					case "alias":
					case "scalar":
					case "single-quoted-scalar":
					case "double-quoted-scalar": {
						const fs = this.flowScalar(this.type);
						if (atNextItem || it.value) {
							map.items.push({
								start,
								key: fs,
								sep: []
							});
							this.onKeyLine = true;
						} else if (it.sep) this.stack.push(fs);
						else {
							Object.assign(it, {
								key: fs,
								sep: []
							});
							this.onKeyLine = true;
						}
						return;
					}
					default: {
						const bv = this.startBlockValue(map);
						if (bv) {
							if (bv.type === "block-seq") {
								if (!it.explicitKey && it.sep && !includesToken(it.sep, "newline")) {
									yield* this.pop({
										type: "error",
										offset: this.offset,
										message: "Unexpected block-seq-ind on same line with key",
										source: this.source
									});
									return;
								}
							} else if (atMapIndent) map.items.push({ start });
							this.stack.push(bv);
							return;
						}
					}
				}
			}
			yield* this.pop();
			yield* this.step();
		}
		*blockSequence(seq) {
			const it = seq.items[seq.items.length - 1];
			switch (this.type) {
				case "newline":
					if (it.value) {
						const end = "end" in it.value ? it.value.end : void 0;
						if ((Array.isArray(end) ? end[end.length - 1] : void 0)?.type === "comment") end?.push(this.sourceToken);
						else seq.items.push({ start: [this.sourceToken] });
					} else it.start.push(this.sourceToken);
					return;
				case "space":
				case "comment":
					if (it.value) seq.items.push({ start: [this.sourceToken] });
					else {
						if (this.atIndentedComment(it.start, seq.indent)) {
							const end = seq.items[seq.items.length - 2]?.value?.end;
							if (Array.isArray(end)) {
								arrayPushArray(end, it.start);
								end.push(this.sourceToken);
								seq.items.pop();
								return;
							}
						}
						it.start.push(this.sourceToken);
					}
					return;
				case "anchor":
				case "tag":
					if (it.value || this.indent <= seq.indent) break;
					it.start.push(this.sourceToken);
					return;
				case "seq-item-ind":
					if (this.indent !== seq.indent) break;
					if (it.value || includesToken(it.start, "seq-item-ind")) seq.items.push({ start: [this.sourceToken] });
					else it.start.push(this.sourceToken);
					return;
			}
			if (this.indent > seq.indent) {
				const bv = this.startBlockValue(seq);
				if (bv) {
					this.stack.push(bv);
					return;
				}
			}
			yield* this.pop();
			yield* this.step();
		}
		*flowCollection(fc) {
			const it = fc.items[fc.items.length - 1];
			if (this.type === "flow-error-end") {
				let top;
				do {
					yield* this.pop();
					top = this.peek(1);
				} while (top?.type === "flow-collection");
			} else if (fc.end.length === 0) {
				switch (this.type) {
					case "comma":
					case "explicit-key-ind":
						if (!it || it.sep) fc.items.push({ start: [this.sourceToken] });
						else it.start.push(this.sourceToken);
						return;
					case "map-value-ind":
						if (!it || it.value) fc.items.push({
							start: [],
							key: null,
							sep: [this.sourceToken]
						});
						else if (it.sep) it.sep.push(this.sourceToken);
						else Object.assign(it, {
							key: null,
							sep: [this.sourceToken]
						});
						return;
					case "space":
					case "comment":
					case "newline":
					case "anchor":
					case "tag":
						if (!it || it.value) fc.items.push({ start: [this.sourceToken] });
						else if (it.sep) it.sep.push(this.sourceToken);
						else it.start.push(this.sourceToken);
						return;
					case "alias":
					case "scalar":
					case "single-quoted-scalar":
					case "double-quoted-scalar": {
						const fs = this.flowScalar(this.type);
						if (!it || it.value) fc.items.push({
							start: [],
							key: fs,
							sep: []
						});
						else if (it.sep) this.stack.push(fs);
						else Object.assign(it, {
							key: fs,
							sep: []
						});
						return;
					}
					case "flow-map-end":
					case "flow-seq-end":
						fc.end.push(this.sourceToken);
						return;
				}
				const bv = this.startBlockValue(fc);
				/* istanbul ignore else should not happen */
				if (bv) this.stack.push(bv);
				else {
					yield* this.pop();
					yield* this.step();
				}
			} else {
				const parent = this.peek(2);
				if (parent.type === "block-map" && (this.type === "map-value-ind" && parent.indent === fc.indent || this.type === "newline" && !parent.items[parent.items.length - 1].sep)) {
					yield* this.pop();
					yield* this.step();
				} else if (this.type === "map-value-ind" && parent.type !== "flow-collection") {
					const start = getFirstKeyStartProps(getPrevProps(parent));
					fixFlowSeqItems(fc);
					const sep = fc.end.splice(1, fc.end.length);
					sep.push(this.sourceToken);
					const map = {
						type: "block-map",
						offset: fc.offset,
						indent: fc.indent,
						items: [{
							start,
							key: fc,
							sep
						}]
					};
					this.onKeyLine = true;
					this.stack[this.stack.length - 1] = map;
				} else yield* this.lineEnd(fc);
			}
		}
		flowScalar(type) {
			if (this.onNewLine) {
				let nl = this.source.indexOf("\n") + 1;
				while (nl !== 0) {
					this.onNewLine(this.offset + nl);
					nl = this.source.indexOf("\n", nl) + 1;
				}
			}
			return {
				type,
				offset: this.offset,
				indent: this.indent,
				source: this.source
			};
		}
		startBlockValue(parent) {
			switch (this.type) {
				case "alias":
				case "scalar":
				case "single-quoted-scalar":
				case "double-quoted-scalar": return this.flowScalar(this.type);
				case "block-scalar-header": return {
					type: "block-scalar",
					offset: this.offset,
					indent: this.indent,
					props: [this.sourceToken],
					source: ""
				};
				case "flow-map-start":
				case "flow-seq-start": return {
					type: "flow-collection",
					offset: this.offset,
					indent: this.indent,
					start: this.sourceToken,
					items: [],
					end: []
				};
				case "seq-item-ind": return {
					type: "block-seq",
					offset: this.offset,
					indent: this.indent,
					items: [{ start: [this.sourceToken] }]
				};
				case "explicit-key-ind": {
					this.onKeyLine = true;
					const start = getFirstKeyStartProps(getPrevProps(parent));
					start.push(this.sourceToken);
					return {
						type: "block-map",
						offset: this.offset,
						indent: this.indent,
						items: [{
							start,
							explicitKey: true
						}]
					};
				}
				case "map-value-ind": {
					this.onKeyLine = true;
					const start = getFirstKeyStartProps(getPrevProps(parent));
					return {
						type: "block-map",
						offset: this.offset,
						indent: this.indent,
						items: [{
							start,
							key: null,
							sep: [this.sourceToken]
						}]
					};
				}
			}
			return null;
		}
		atIndentedComment(start, indent) {
			if (this.type !== "comment") return false;
			if (this.indent <= indent) return false;
			return start.every((st) => st.type === "newline" || st.type === "space");
		}
		*documentEnd(docEnd) {
			if (this.type !== "doc-mode") {
				if (docEnd.end) docEnd.end.push(this.sourceToken);
				else docEnd.end = [this.sourceToken];
				if (this.type === "newline") yield* this.pop();
			}
		}
		*lineEnd(token) {
			switch (this.type) {
				case "comma":
				case "doc-start":
				case "doc-end":
				case "flow-seq-end":
				case "flow-map-end":
				case "map-value-ind":
					yield* this.pop();
					yield* this.step();
					break;
				case "newline": this.onKeyLine = false;
				default:
					if (token.end) token.end.push(this.sourceToken);
					else token.end = [this.sourceToken];
					if (this.type === "newline") yield* this.pop();
			}
		}
	};
	exports.Parser = Parser;
}));
//#endregion
//#region node_modules/yaml/dist/public-api.js
var require_public_api = /* @__PURE__ */ __commonJSMin(((exports) => {
	var composer = require_composer();
	var Document = require_Document();
	var errors = require_errors();
	var log = require_log();
	var identity = require_identity();
	var lineCounter = require_line_counter();
	var parser = require_parser();
	function parseOptions(options) {
		const prettyErrors = options.prettyErrors !== false;
		return {
			lineCounter: options.lineCounter || prettyErrors && new lineCounter.LineCounter() || null,
			prettyErrors
		};
	}
	/**
	* Parse the input as a stream of YAML documents.
	*
	* Documents should be separated from each other by `...` or `---` marker lines.
	*
	* @returns If an empty `docs` array is returned, it will be of type
	*   EmptyStream and contain additional stream information. In
	*   TypeScript, you should use `'empty' in docs` as a type guard for it.
	*/
	function parseAllDocuments(source, options = {}) {
		const { lineCounter, prettyErrors } = parseOptions(options);
		const parser$1 = new parser.Parser(lineCounter?.addNewLine);
		const composer$1 = new composer.Composer(options);
		const docs = Array.from(composer$1.compose(parser$1.parse(source)));
		if (prettyErrors && lineCounter) for (const doc of docs) {
			doc.errors.forEach(errors.prettifyError(source, lineCounter));
			doc.warnings.forEach(errors.prettifyError(source, lineCounter));
		}
		if (docs.length > 0) return docs;
		return Object.assign([], { empty: true }, composer$1.streamInfo());
	}
	/** Parse an input string into a single YAML.Document */
	function parseDocument(source, options = {}) {
		const { lineCounter, prettyErrors } = parseOptions(options);
		const parser$1 = new parser.Parser(lineCounter?.addNewLine);
		const composer$1 = new composer.Composer(options);
		let doc = null;
		for (const _doc of composer$1.compose(parser$1.parse(source), true, source.length)) if (!doc) doc = _doc;
		else if (doc.options.logLevel !== "silent") {
			doc.errors.push(new errors.YAMLParseError(_doc.range.slice(0, 2), "MULTIPLE_DOCS", "Source contains multiple documents; please use YAML.parseAllDocuments()"));
			break;
		}
		if (prettyErrors && lineCounter) {
			doc.errors.forEach(errors.prettifyError(source, lineCounter));
			doc.warnings.forEach(errors.prettifyError(source, lineCounter));
		}
		return doc;
	}
	function parse(src, reviver, options) {
		let _reviver = void 0;
		if (typeof reviver === "function") _reviver = reviver;
		else if (options === void 0 && reviver && typeof reviver === "object") options = reviver;
		const doc = parseDocument(src, options);
		if (!doc) return null;
		doc.warnings.forEach((warning) => log.warn(doc.options.logLevel, warning));
		if (doc.errors.length > 0) if (doc.options.logLevel !== "silent") throw doc.errors[0];
		else doc.errors = [];
		return doc.toJS(Object.assign({ reviver: _reviver }, options));
	}
	function stringify(value, replacer, options) {
		let _replacer = null;
		if (typeof replacer === "function" || Array.isArray(replacer)) _replacer = replacer;
		else if (options === void 0 && replacer) options = replacer;
		if (typeof options === "string") options = options.length;
		if (typeof options === "number") {
			const indent = Math.round(options);
			options = indent < 1 ? void 0 : indent > 8 ? { indent: 8 } : { indent };
		}
		if (value === void 0) {
			const { keepUndefined } = options ?? replacer ?? {};
			if (!keepUndefined) return void 0;
		}
		if (identity.isDocument(value) && !_replacer) return value.toString(options);
		return new Document.Document(value, _replacer, options).toString(options);
	}
	exports.parse = parse;
	exports.parseAllDocuments = parseAllDocuments;
	exports.parseDocument = parseDocument;
	exports.stringify = stringify;
}));
//#endregion
//#region node_modules/yaml/dist/index.js
var require_dist = /* @__PURE__ */ __commonJSMin(((exports) => {
	var composer = require_composer();
	var Document = require_Document();
	var Schema = require_Schema();
	var errors = require_errors();
	var Alias = require_Alias();
	var identity = require_identity();
	var Pair = require_Pair();
	var Scalar = require_Scalar();
	var YAMLMap = require_YAMLMap();
	var YAMLSeq = require_YAMLSeq();
	require_cst();
	var lexer = require_lexer();
	var lineCounter = require_line_counter();
	var parser = require_parser();
	var publicApi = require_public_api();
	var visit = require_visit();
	exports.Composer = composer.Composer;
	exports.Document = Document.Document;
	exports.Schema = Schema.Schema;
	exports.YAMLError = errors.YAMLError;
	exports.YAMLParseError = errors.YAMLParseError;
	exports.YAMLWarning = errors.YAMLWarning;
	exports.Alias = Alias.Alias;
	exports.isAlias = identity.isAlias;
	exports.isCollection = identity.isCollection;
	exports.isDocument = identity.isDocument;
	exports.isMap = identity.isMap;
	exports.isNode = identity.isNode;
	exports.isPair = identity.isPair;
	exports.isScalar = identity.isScalar;
	exports.isSeq = identity.isSeq;
	exports.Pair = Pair.Pair;
	exports.Scalar = Scalar.Scalar;
	exports.YAMLMap = YAMLMap.YAMLMap;
	exports.YAMLSeq = YAMLSeq.YAMLSeq;
	exports.Lexer = lexer.Lexer;
	exports.LineCounter = lineCounter.LineCounter;
	exports.Parser = parser.Parser;
	exports.parse = publicApi.parse;
	exports.parseAllDocuments = publicApi.parseAllDocuments;
	exports.parseDocument = publicApi.parseDocument;
	exports.stringify = publicApi.stringify;
	exports.visit = visit.visit;
	exports.visitAsync = visit.visitAsync;
}));
//#endregion
//#region node_modules/langsmith/dist/sandbox/errors.js
var import_micromatch = /* @__PURE__ */ __toESM(require_micromatch(), 1);
var import_dist = /* @__PURE__ */ __toESM(require_dist(), 1);
/**
* Custom error classes for the sandbox module.
*
* All sandbox errors extend LangSmithSandboxError for unified error handling.
* The errors are organized by type rather than resource type, with additional
* properties for specific handling when needed.
*/
/**
* Base exception for sandbox client errors.
*/
var LangSmithSandboxError = class extends Error {
	constructor(message) {
		super(message);
		this.name = "LangSmithSandboxError";
	}
};
/**
* Raised when connection to the sandbox server fails.
*/
var LangSmithSandboxConnectionError = class extends LangSmithSandboxError {
	constructor(message) {
		super(message);
		this.name = "LangSmithSandboxConnectionError";
	}
};
/**
* Raised when a sandbox operation fails (run, read, write).
*/
var LangSmithSandboxOperationError = class extends LangSmithSandboxError {
	constructor(message, operation, errorType) {
		super(message);
		/**
		* The operation that failed (command, read, write).
		*/
		Object.defineProperty(this, "operation", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		/**
		* Machine-readable error type from the API.
		*/
		Object.defineProperty(this, "errorType", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		this.name = "LangSmithSandboxOperationError";
		this.operation = operation;
		this.errorType = errorType;
	}
	toString() {
		if (this.errorType) return `${super.toString()} [${this.errorType}]`;
		return super.toString();
	}
};
//#endregion
//#region node_modules/langsmith/dist/sandbox/command_handle.js
/**
* CommandHandle - async handle to a running command with streaming output
* and auto-reconnect.
*
* Port of Python's AsyncCommandHandle to TypeScript.
*/
/**
* Async handle to a running command with streaming output and auto-reconnect.
*
* Async iterable, yielding OutputChunk objects (stdout and stderr interleaved
* in arrival order). Access .result after iteration to get the full
* ExecutionResult.
*
* Auto-reconnect behavior:
* - Server hot-reload (1001 Going Away): reconnect immediately
* - Network error / unexpected close:    reconnect with exponential backoff
* - User called kill():                  do NOT reconnect (propagate error)
*
* @example
* ```typescript
* const handle = await sandbox.run("make build", { timeout: 600, wait: false });
*
* for await (const chunk of handle) {  // auto-reconnects on transient errors
*   process.stdout.write(chunk.data);
* }
*
* const result = await handle.result;
* console.log(`Exit code: ${result.exit_code}`);
* ```
*/
var CommandHandle = class CommandHandle {
	/** @internal */
	constructor(messageStream, control, sandbox, options) {
		Object.defineProperty(this, "_stream", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, "_control", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, "_sandbox", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, "_commandId", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: null
		});
		Object.defineProperty(this, "_pid", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: null
		});
		Object.defineProperty(this, "_result", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: null
		});
		Object.defineProperty(this, "_stdoutParts", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: []
		});
		Object.defineProperty(this, "_stderrParts", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: []
		});
		Object.defineProperty(this, "_exhausted", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: false
		});
		Object.defineProperty(this, "_lastStdoutOffset", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, "_lastStderrOffset", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, "_started", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, "_onStdout", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, "_onStderr", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		this._stream = messageStream;
		this._control = control;
		this._sandbox = sandbox;
		this._lastStdoutOffset = options?.stdoutOffset ?? 0;
		this._lastStderrOffset = options?.stderrOffset ?? 0;
		this._onStdout = options?.onStdout;
		this._onStderr = options?.onStderr;
		if (options?.commandId) {
			this._commandId = options.commandId;
			this._started = true;
		} else this._started = false;
	}
	/**
	* Read the 'started' message to populate commandId and pid.
	*
	* Must be called (and awaited) before iterating for new executions.
	*/
	async _ensureStarted() {
		if (this._started) return;
		const firstResult = await this._stream.next();
		if (firstResult.done) throw new LangSmithSandboxOperationError("Command stream ended before 'started' message", "command");
		const firstMsg = firstResult.value;
		if (firstMsg.type !== "started") throw new LangSmithSandboxOperationError(`Expected 'started' message, got '${firstMsg.type}'`, "command");
		this._commandId = firstMsg.command_id ?? null;
		this._pid = firstMsg.pid ?? null;
		this._started = true;
	}
	/** The server-assigned command ID. Available after _ensureStarted(). */
	get commandId() {
		return this._commandId;
	}
	/** The process ID on the sandbox. Available after _ensureStarted(). */
	get pid() {
		return this._pid;
	}
	/**
	* The final execution result. Drains the stream if not already exhausted.
	*/
	get result() {
		return this._getResult();
	}
	async _getResult() {
		if (this._result === null) for await (const _ of this);
		if (this._result === null) throw new LangSmithSandboxOperationError("Command stream ended without exit message", "command");
		return this._result;
	}
	/**
	* Iterate over output chunks from the current stream (no reconnect).
	*/
	async *_iterStream() {
		await this._ensureStarted();
		if (this._exhausted) return;
		for await (const msg of this._stream) {
			const msgType = msg.type;
			if (msgType === "stdout" || msgType === "stderr") {
				const chunk = {
					stream: msgType,
					data: msg.data,
					offset: msg.offset ?? 0
				};
				if (msgType === "stdout") this._stdoutParts.push(msg.data);
				else this._stderrParts.push(msg.data);
				yield chunk;
			} else if (msgType === "exit") {
				this._result = {
					stdout: this._stdoutParts.join(""),
					stderr: this._stderrParts.join(""),
					exit_code: msg.exit_code ?? -1
				};
				this._exhausted = true;
				return;
			}
		}
		throw new LangSmithSandboxConnectionError("Command stream ended without exit message");
	}
	/**
	* Async iterate over output chunks with auto-reconnect on transient errors.
	*
	* Reconnect strategy:
	* - 1001 Going Away (hot-reload): immediate reconnect, no delay
	* - Other SandboxConnectionError:  exponential backoff (0.5s, 1s, 2s...)
	* - After kill():                  no reconnect, error propagates
	*/
	async *[Symbol.asyncIterator]() {
		let reconnectAttempts = 0;
		while (true) try {
			for await (const chunk of this._iterStream()) {
				reconnectAttempts = 0;
				if (chunk.stream === "stdout") {
					this._lastStdoutOffset = chunk.offset + new TextEncoder().encode(chunk.data).length;
					this._onStdout?.(chunk.data);
				} else {
					this._lastStderrOffset = chunk.offset + new TextEncoder().encode(chunk.data).length;
					this._onStderr?.(chunk.data);
				}
				yield chunk;
			}
			return;
		} catch (e) {
			const eName = e != null && typeof e === "object" ? e.name : "";
			if (eName !== "LangSmithSandboxConnectionError" && eName !== "LangSmithSandboxServerReloadError") throw e;
			if (this._control && this._control.killed) throw e;
			reconnectAttempts++;
			if (reconnectAttempts > CommandHandle.MAX_AUTO_RECONNECTS) throw new LangSmithSandboxConnectionError(`Lost connection ${reconnectAttempts} times in succession, giving up`);
			if (!(eName === "LangSmithSandboxServerReloadError")) {
				const delay = Math.min(CommandHandle.BACKOFF_BASE * 2 ** (reconnectAttempts - 1), CommandHandle.BACKOFF_MAX);
				await new Promise((r) => setTimeout(r, delay * 1e3));
			}
			if (this._commandId === null) throw e;
			const newHandle = await this._sandbox.reconnect(this._commandId, {
				stdoutOffset: this._lastStdoutOffset,
				stderrOffset: this._lastStderrOffset
			});
			this._stream = newHandle._stream;
			this._control = newHandle._control;
			this._exhausted = false;
		}
	}
	/**
	* Send a kill signal to the running command (SIGKILL).
	*
	* The server kills the entire process group. The stream will
	* subsequently yield an exit message with a non-zero exit code.
	*/
	kill() {
		if (this._control) this._control.sendKill();
	}
	/**
	* Write data to the command's stdin.
	*/
	sendInput(data) {
		if (this._control) this._control.sendInput(data);
	}
	/** Last known stdout byte offset (for manual reconnection). */
	get lastStdoutOffset() {
		return this._lastStdoutOffset;
	}
	/** Last known stderr byte offset (for manual reconnection). */
	get lastStderrOffset() {
		return this._lastStderrOffset;
	}
	/**
	* Reconnect to this command from the last known offsets.
	*
	* Returns a new CommandHandle that resumes output from where this one
	* left off.
	*/
	async reconnect() {
		if (this._commandId === null) throw new LangSmithSandboxOperationError("Cannot reconnect: command ID not available", "reconnect");
		return this._sandbox.reconnect(this._commandId, {
			stdoutOffset: this._lastStdoutOffset,
			stderrOffset: this._lastStderrOffset
		});
	}
};
Object.defineProperty(CommandHandle, "MAX_AUTO_RECONNECTS", {
	enumerable: true,
	configurable: true,
	writable: true,
	value: 5
});
Object.defineProperty(CommandHandle, "BACKOFF_BASE", {
	enumerable: true,
	configurable: true,
	writable: true,
	value: .5
});
Object.defineProperty(CommandHandle, "BACKOFF_MAX", {
	enumerable: true,
	configurable: true,
	writable: true,
	value: 8
});
//#endregion
//#region node_modules/deepagents/dist/langsmith-DgbmWtWj.js
/**
* Shared utility functions for memory backend implementations.
*
* This module contains both user-facing string formatters and structured
* helpers used by backends and the composite router. Structured helpers
* enable composition without fragile string parsing.
*/
var EMPTY_CONTENT_WARNING = "System reminder: File exists but has empty contents";
var MAX_LINE_LENGTH = 5e3;
var TOOL_RESULT_TOKEN_LIMIT = 2e4;
var TRUNCATION_GUIDANCE = "... [results truncated, try being more specific with your parameters]";
var MIME_TYPES = {
	".png": "image/png",
	".jpg": "image/jpeg",
	".jpeg": "image/jpeg",
	".gif": "image/gif",
	".webp": "image/webp",
	".svg": "image/svg+xml",
	".heic": "image/heic",
	".heif": "image/heif",
	".mp3": "audio/mpeg",
	".wav": "audio/wav",
	".aiff": "audio/aiff",
	".aac": "audio/aac",
	".ogg": "audio/ogg",
	".flac": "audio/flac",
	".mp4": "video/mp4",
	".webm": "video/webm",
	".mpeg": "video/mpeg",
	".mov": "video/quicktime",
	".avi": "video/x-msvideo",
	".flv": "video/x-flv",
	".mpg": "video/mpeg",
	".wmv": "video/x-ms-wmv",
	".3gpp": "video/3gpp",
	".pdf": "application/pdf",
	".ppt": "application/vnd.ms-powerpoint",
	".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
	".txt": "text/plain",
	".md": "text/markdown",
	".markdown": "text/markdown",
	".html": "text/html",
	".htm": "text/html",
	".css": "text/css",
	".csv": "text/csv",
	".xml": "text/xml",
	".json": "application/json",
	".js": "application/javascript",
	".mjs": "application/javascript",
	".cjs": "application/javascript",
	".ts": "text/plain",
	".tsx": "text/plain",
	".jsx": "text/plain",
	".py": "text/plain",
	".rb": "text/plain",
	".java": "text/plain",
	".c": "text/plain",
	".cpp": "text/plain",
	".h": "text/plain",
	".hpp": "text/plain",
	".go": "text/plain",
	".rs": "text/plain",
	".sh": "text/plain",
	".bash": "text/plain",
	".zsh": "text/plain",
	".yaml": "text/plain",
	".yml": "text/plain",
	".toml": "text/plain",
	".ini": "text/plain",
	".cfg": "text/plain",
	".conf": "text/plain",
	".env": "text/plain",
	".log": "text/plain",
	".sql": "text/plain",
	".graphql": "text/plain",
	".proto": "text/plain",
	".r": "text/plain",
	".swift": "text/plain",
	".kt": "text/plain",
	".kts": "text/plain",
	".scala": "text/plain",
	".dart": "text/plain",
	".lua": "text/plain",
	".pl": "text/plain",
	".pm": "text/plain",
	".php": "text/plain",
	".ex": "text/plain",
	".exs": "text/plain",
	".erl": "text/plain",
	".hs": "text/plain",
	".ml": "text/plain",
	".mli": "text/plain",
	".vue": "text/plain",
	".svelte": "text/plain",
	".astro": "text/plain",
	".tf": "text/plain",
	".cmake": "text/plain",
	".makefile": "text/plain",
	".dockerfile": "text/plain",
	".gitignore": "text/plain",
	".dockerignore": "text/plain",
	".editorconfig": "text/plain"
};
function basename(filePath) {
	const normalized = filePath.replace(/\\/g, "/");
	const slashIdx = normalized.lastIndexOf("/");
	return slashIdx === -1 ? normalized : normalized.slice(slashIdx + 1);
}
function extname(filePath) {
	const name = basename(filePath);
	const dotIdx = name.lastIndexOf(".");
	return dotIdx <= 0 ? "" : name.slice(dotIdx);
}
/**
* Sanitize tool_call_id to prevent path traversal and separator issues.
*
* Replaces dangerous characters (., /, \) with underscores.
*/
function sanitizeToolCallId(toolCallId) {
	return toolCallId.replace(/\./g, "_").replace(/\//g, "_").replace(/\\/g, "_");
}
/**
* Format file content with line numbers (cat -n style).
*
* Chunks lines longer than MAX_LINE_LENGTH with continuation markers (e.g., 5.1, 5.2).
*
* @param content - File content as string or list of lines
* @param startLine - Starting line number (default: 1)
* @returns Formatted content with line numbers and continuation markers
*/
function formatContentWithLineNumbers(content, startLine = 1) {
	let lines;
	if (typeof content === "string") {
		lines = content.split("\n");
		if (lines.length > 0 && lines[lines.length - 1] === "") lines = lines.slice(0, -1);
	} else lines = content;
	const resultLines = [];
	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		const lineNum = i + startLine;
		if (line.length <= 5e3) resultLines.push(`${lineNum.toString().padStart(6)}\t${line}`);
		else {
			const numChunks = Math.ceil(line.length / MAX_LINE_LENGTH);
			for (let chunkIdx = 0; chunkIdx < numChunks; chunkIdx++) {
				const start = chunkIdx * MAX_LINE_LENGTH;
				const end = Math.min(start + MAX_LINE_LENGTH, line.length);
				const chunk = line.substring(start, end);
				if (chunkIdx === 0) resultLines.push(`${lineNum.toString().padStart(6)}\t${chunk}`);
				else {
					const continuationMarker = `${lineNum}.${chunkIdx}`;
					resultLines.push(`${continuationMarker.padStart(6)}\t${chunk}`);
				}
			}
		}
	}
	return resultLines.join("\n");
}
/**
* Check if content is empty and return warning message.
*
* @param content - Content to check
* @returns Warning message if empty, null otherwise
*/
function checkEmptyContent(content) {
	if (!content || content.trim() === "") return EMPTY_CONTENT_WARNING;
	return null;
}
/**
* Convert FileData to plain string content.
*
* @param fileData - FileData object with 'content' key
* @returns Content as string with lines joined by newlines
*/
function fileDataToString(fileData) {
	if (Array.isArray(fileData.content)) return fileData.content.join("\n");
	if (typeof fileData.content === "string") return fileData.content;
	throw new Error("Cannot convert binary FileData to string");
}
/**
* Type guard to check if FileData contains binary content (Uint8Array).
*
* @param data - FileData to check
* @returns True if the content is a Uint8Array (binary)
*/
function isFileDataBinary(data) {
	return ArrayBuffer.isView(data.content);
}
/**
* Create a FileData object.
*
* Defaults to v2 format (content as single string). Pass `fileFormat: "v1"` for
* backward compatibility with older readers during a rolling deployment.
* Binary content (Uint8Array) is only supported with v2.
*
* @param content - File content as a string or binary Uint8Array (v2 only)
* @param createdAt - Optional creation timestamp (ISO format), defaults to now
* @param fileFormat - Storage format: "v2" (default) or "v1" (legacy line array)
* @returns FileData in the requested format
*/
function createFileData(content, createdAt, fileFormat = "v2", mimeType) {
	const now = (/* @__PURE__ */ new Date()).toISOString();
	if (fileFormat === "v1" && ArrayBuffer.isView(content)) throw new Error("Binary data is not supported with v1 file formats. Please use v2 file format");
	if (fileFormat === "v2") {
		if (ArrayBuffer.isView(content)) return {
			content: new Uint8Array(content.buffer, content.byteOffset, content.byteLength),
			mimeType: mimeType ?? "application/octet-stream",
			created_at: createdAt || now,
			modified_at: now
		};
		return {
			content,
			mimeType: mimeType ?? "text/plain",
			created_at: createdAt || now,
			modified_at: now
		};
	}
	return {
		content: typeof content === "string" ? content.split("\n") : content,
		created_at: createdAt || now,
		modified_at: now
	};
}
/**
* Update FileData with new content, preserving creation timestamp.
*
* @param fileData - Existing FileData object
* @param content - New content as string
* @returns Updated FileData object
*/
function updateFileData(fileData, content) {
	const now = (/* @__PURE__ */ new Date()).toISOString();
	if (isFileDataV1(fileData)) return {
		content: typeof content === "string" ? content.split("\n") : content,
		created_at: fileData.created_at,
		modified_at: now
	};
	return {
		content,
		mimeType: fileData.mimeType,
		created_at: fileData.created_at,
		modified_at: now
	};
}
/**
* Build FileData for write semantics.
*
* Text writes preserve an existing file's creation timestamp. Binary writes
* accept base64 text input and store decoded bytes with the path's MIME type.
*/
function decodeBase64ToBytes(base64) {
	const trimmed = base64.trim();
	const payload = trimmed.startsWith("data:") ? trimmed.slice(trimmed.indexOf(",") + 1) : trimmed;
	const binary = atob(payload.replace(/\s/g, ""));
	const bytes = new Uint8Array(binary.length);
	for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
	return bytes;
}
function createWriteFileData(filePath, content, fileFormat = "v2", existing) {
	const mimeType = getMimeType(filePath);
	const createdAt = existing?.created_at;
	if (!isTextMimeType(mimeType)) return fileFormat === "v1" ? createFileData(content, createdAt, "v1", mimeType) : createFileData(decodeBase64ToBytes(content), createdAt, "v2", mimeType);
	return existing ? updateFileData(existing, content) : createFileData(content, void 0, fileFormat, mimeType);
}
/**
* Perform string replacement with occurrence validation.
*
* @param content - Original content
* @param oldString - String to replace
* @param newString - Replacement string
* @param replaceAll - Whether to replace all occurrences
* @returns Tuple of [new_content, occurrences] on success, or error message string
*
* Special case: When both content and oldString are empty, this sets the initial
* content to newString. This allows editing empty files by treating empty oldString
* as "set initial content" rather than "replace nothing".
*/
function performStringReplacement(content, oldString, newString, replaceAll) {
	if (content === "" && oldString === "") return [newString, 0];
	if (oldString === "") return "Error: oldString cannot be empty when file has content";
	const occurrences = content.split(oldString).length - 1;
	if (occurrences === 0) return `Error: String not found in file: '${oldString}'`;
	if (occurrences > 1 && !replaceAll) return `Error: String '${oldString}' has multiple occurrences (appears ${occurrences} times) in file. Use replace_all=True to replace all instances, or provide a more specific string with surrounding context.`;
	return [content.split(oldString).join(newString), occurrences];
}
/**
* Truncate list or string result if it exceeds token limit (rough estimate: 4 chars/token).
*/
function truncateIfTooLong(result) {
	if (Array.isArray(result)) {
		const totalChars = result.reduce((sum, item) => sum + item.length, 0);
		if (totalChars > 2e4 * 4) {
			const truncateAt = Math.floor(result.length * TOOL_RESULT_TOKEN_LIMIT * 4 / totalChars);
			return [...result.slice(0, truncateAt), TRUNCATION_GUIDANCE];
		}
		return result;
	}
	if (result.length > 2e4 * 4) return result.substring(0, TOOL_RESULT_TOKEN_LIMIT * 4) + "\n... [results truncated, try being more specific with your parameters]";
	return result;
}
/**
* Validate and normalize a directory path.
*
* Ensures paths are safe to use by preventing directory traversal attacks
* and enforcing consistent formatting. All paths are normalized to use
* forward slashes and start with a leading slash.
*
* This function is designed for virtual filesystem paths and rejects
* Windows absolute paths (e.g., C:/..., F:/...) to maintain consistency
* and prevent path format ambiguity.
*
* @param path - Path to validate
* @returns Normalized path starting with / and ending with /
* @throws Error if path is invalid
*
* @example
* ```typescript
* validatePath("foo/bar")  // Returns: "/foo/bar/"
* validatePath("/./foo//bar")  // Returns: "/foo/bar/"
* validatePath("../etc/passwd")  // Throws: Path traversal not allowed
* validatePath("C:\\Users\\file")  // Throws: Windows absolute paths not supported
* ```
*/
function validatePath$1(path) {
	const pathStr = path || "/";
	if (!pathStr || pathStr.trim() === "") throw new Error("Path cannot be empty");
	let normalized = pathStr.startsWith("/") ? pathStr : "/" + pathStr;
	if (!normalized.endsWith("/")) normalized += "/";
	return normalized;
}
/**
* Resolve the files under `path` for grep/glob search.
*
* If `path` exactly names a file that exists in `files`, only that file is
* returned (exact match) — this lets grep/glob target a specific file
* directly instead of only matching directories. Otherwise `path` is treated
* as a directory and files are filtered by the normalized directory prefix.
*
* @returns Filtered files map, or null if `path` is invalid (e.g. whitespace-only).
*/
function filterFilesByPath(files, path) {
	const exactPath = path ? path.startsWith("/") ? path : "/" + path : "/";
	if (Object.prototype.hasOwnProperty.call(files, exactPath)) return { [exactPath]: files[exactPath] };
	try {
		const normalizedPath = validatePath$1(path);
		return Object.fromEntries(Object.entries(files).filter(([fp]) => fp.startsWith(normalizedPath)));
	} catch {
		return null;
	}
}
/**
* Search files dict for paths matching glob pattern.
*
* @param files - Dictionary of file paths to FileData
* @param pattern - Glob pattern (e.g., `*.py`, `**\/*.ts`)
* @param path - Base path to search from. If `path` names an exact file, only
*               that file is considered.
* @returns Newline-separated file paths, sorted by modification time (most recent first).
*          Returns "No files found" if no matches.
*
* @example
* ```typescript
* const files = {"/src/main.py": FileData(...), "/test.py": FileData(...)};
* globSearchFiles(files, "*.py", "/");
* // Returns: "/test.py\n/src/main.py" (sorted by modified_at)
* ```
*/
function globSearchFiles(files, pattern, path = "/") {
	const filtered = filterFilesByPath(files, path);
	if (filtered === null) return "No files found";
	const normalizedPath = validatePath$1(path);
	const effectivePattern = pattern;
	const matches = [];
	for (const [filePath, fileData] of Object.entries(filtered)) {
		let relative = filePath.substring(normalizedPath.length);
		if (relative.startsWith("/")) relative = relative.substring(1);
		if (!relative) {
			const parts = filePath.split("/");
			relative = parts[parts.length - 1] || "";
		}
		if (import_micromatch.default.isMatch(relative, effectivePattern, {
			dot: true,
			nobrace: false
		})) matches.push([filePath, fileData.modified_at]);
	}
	matches.sort((a, b) => b[1].localeCompare(a[1]));
	if (matches.length === 0) return "No files found";
	return matches.map(([fp]) => fp).join("\n");
}
/**
* Return structured grep matches from an in-memory files mapping.
*
* Performs literal text search (not regex). Binary files are skipped.
* If `path` names an exact file, only that file is considered.
* Returns an empty array when no matches are found or on invalid input.
*/
function grepMatchesFromFiles(files, pattern, path = null, glob = null) {
	let filtered = filterFilesByPath(files, path);
	if (filtered === null) return [];
	if (glob) filtered = Object.fromEntries(Object.entries(filtered).filter(([fp]) => import_micromatch.default.isMatch(basename(fp), glob, {
		dot: true,
		nobrace: false
	})));
	const matches = [];
	for (const [filePath, fileData] of Object.entries(filtered)) {
		if (!isTextMimeType(migrateToFileDataV2(fileData, filePath).mimeType)) continue;
		const lines = fileDataToString(fileData).split("\n");
		for (let i = 0; i < lines.length; i++) {
			const line = lines[i];
			const lineNum = i + 1;
			if (line.includes(pattern)) matches.push({
				path: filePath,
				line: lineNum,
				text: line
			});
		}
	}
	return matches;
}
/**
* Determine MIME type from a file path's extension.
*
* Defaults to "text/plain" for unknown extensions. Only the known non-text
* formats above (images, audio, video, PDF/PPT) are treated as binary by
* {@link isTextMimeType}; everything else reads as text, including source files
* with uncommon extensions (.properties, .scss, .tf) and extension-less files
* (Dockerfile, mvnw). This avoids base64-encoding text into document blocks,
* which the model can't read and which the Anthropic provider rejects with a
* 400.
*
* @param filePath - File path to inspect
* @returns MIME type string (e.g., "image/png", "text/plain")
*/
function getMimeType(filePath) {
	return MIME_TYPES[extname(filePath).toLocaleLowerCase()] || "text/plain";
}
/**
* Check whether a MIME type represents text content.
*
* @param mimeType - MIME type string to check
* @returns True if the MIME type is text-based
*/
function isTextMimeType(mimeType) {
	return mimeType.startsWith("text/") || mimeType === "application/json" || mimeType === "application/javascript" || mimeType === "image/svg+xml";
}
/**
* Type guard to check if FileData is v1 format (content as line array).
*
* @param data - FileData to check
* @returns True if data is FileDataV1
*/
function isFileDataV1(data) {
	return Array.isArray(data.content);
}
/**
* Convert FileData to v2 format, joining v1 line arrays into a single string.
*
* If the data is already v2, returns it unchanged.
*
* @param data - FileData in either format
* @returns FileDataV2 with content as string (text) or Uint8Array (binary)
*/
function migrateToFileDataV2(data, filePath) {
	if (isFileDataV1(data)) return {
		content: data.content.join("\n"),
		mimeType: getMimeType(filePath),
		created_at: data.created_at,
		modified_at: data.modified_at
	};
	if (!("mimeType" in data) || !data.mimeType) return {
		...data,
		mimeType: getMimeType(filePath)
	};
	return data;
}
/**
* Adapt a v1 {@link BackendProtocol} to {@link BackendProtocolV2}.
*
* If the backend already implements v2, it is returned as-is.
* For v1 backends, wraps returns in Result types:
* - `read()` string returns wrapped in {@link ReadResult}
* - `readRaw()` FileData returns wrapped in {@link ReadRawResult}
* - `grep()` returns wrapped in {@link GrepResult}
* - `ls()` FileInfo[] returns wrapped in {@link LsResult}
* - `glob()` FileInfo[] returns wrapped in {@link GlobResult}
*
* Note: For sandbox instances, use {@link adaptSandboxProtocol} instead.
*
* @param backend - Backend instance (v1 or v2)
* @returns BackendProtocolV2-compatible backend
*/
function adaptBackendProtocol(backend) {
	const adapted = {
		async ls(path) {
			const result = await ("ls" in backend ? backend.ls(path) : backend.lsInfo(path));
			if (Array.isArray(result)) return { files: result };
			return result;
		},
		async readRaw(filePath) {
			const result = await backend.readRaw(filePath);
			if ("data" in result || "error" in result) return result;
			return { data: migrateToFileDataV2(result, filePath) };
		},
		async glob(pattern, path) {
			const result = await ("glob" in backend ? backend.glob(pattern, path) : backend.globInfo(pattern, path));
			if (Array.isArray(result)) return { files: result };
			return result;
		},
		write: (filePath, content) => backend.write(filePath, content),
		edit: (filePath, oldString, newString, replaceAll) => backend.edit(filePath, oldString, newString, replaceAll),
		delete: backend.delete?.bind(backend),
		uploadFiles: backend.uploadFiles ? (files) => backend.uploadFiles(files) : void 0,
		downloadFiles: backend.downloadFiles ? (paths) => backend.downloadFiles(paths) : void 0,
		async read(filePath, offset, limit) {
			const result = await backend.read(filePath, offset, limit);
			if (typeof result === "string") return { content: result };
			return result;
		},
		async grep(pattern, path, glob) {
			const result = await ("grep" in backend ? backend.grep(pattern, path, glob) : backend.grepRaw(pattern, path, glob));
			if (Array.isArray(result)) return { matches: result };
			if (typeof result === "string") return { error: result };
			return result;
		}
	};
	const routePrefixes = backend.routePrefixes;
	if (Array.isArray(routePrefixes)) Object.defineProperty(adapted, "routePrefixes", {
		value: routePrefixes,
		enumerable: true,
		configurable: true
	});
	return adapted;
}
/**
* Adapt a sandbox backend from v1 to v2 interface.
*
* This extends {@link adaptBackendProtocol} to also preserve sandbox-specific
* properties from {@link SandboxBackendProtocol}: `execute` and `id`.
*
* @param sandbox - Sandbox backend (v1 or v2)
* @returns SandboxBackendProtocolV2-compatible sandbox
*/
function adaptSandboxProtocol(sandbox) {
	const adapted = adaptBackendProtocol(sandbox);
	adapted.execute = (cmd) => sandbox.execute(cmd);
	Object.defineProperty(adapted, "id", {
		value: sandbox.id,
		enumerable: true,
		configurable: true
	});
	return adapted;
}
/**
* Type guard to check if a backend supports execution.
*
* @param backend - Backend instance to check
* @returns True if the backend implements SandboxBackendProtocolV2
*/
function isSandboxBackend(backend) {
	return backend != null && typeof backend === "object" && typeof backend.execute === "function" && typeof backend.id === "string" && backend.id !== "";
}
/**
* Type guard to check if a backend is a sandbox protocol (v1 or v2).
*
* Checks for the presence of `execute` function and `id` string,
* which are the defining features of sandbox protocols.
*
* @param backend - Backend instance to check
* @returns True if the backend implements sandbox protocol (v1 or v2)
*/
function isSandboxProtocol(backend) {
	return backend != null && typeof backend === "object" && typeof backend.execute === "function" && typeof backend.id === "string" && backend.id !== "";
}
/**
* Resolve a backend instance or await a {@link BackendFactory}.
*
* Accepts {@link BackendRuntime} or {@link ToolRuntime} — store typing differs
* between LangGraph checkpoint stores and core `ToolRuntime`; factories receive
* a value that is structurally compatible at runtime.
*
* @internal
*/
async function resolveBackend(backend, runtime) {
	if (typeof backend === "function") {
		const resolved = await backend(runtime);
		return isSandboxProtocol(resolved) ? adaptSandboxProtocol(resolved) : adaptBackendProtocol(resolved);
	}
	return isSandboxProtocol(backend) ? adaptSandboxProtocol(backend) : adaptBackendProtocol(backend);
}
var PREGEL_SEND_KEY = "__pregel_send";
var PREGEL_READ_KEY = "__pregel_read";
/**
* Backend that stores files in agent state (ephemeral).
*
* Uses LangGraph's state management and checkpointing. Files persist within
* a conversation thread but not across threads. State is automatically
* checkpointed after each agent step.
*
* Special handling: Since LangGraph state must be updated via Command objects
* (not direct mutation), operations return filesUpdate in WriteResult/EditResult
* for the middleware to apply via Command.
*/
var StateBackend = class {
	runtime;
	fileFormat;
	constructor(runtimeOrOptions, options) {
		if (runtimeOrOptions != null && typeof runtimeOrOptions === "object" && "state" in runtimeOrOptions) {
			this.runtime = runtimeOrOptions;
			this.fileFormat = options?.fileFormat ?? "v2";
		} else {
			this.runtime = void 0;
			this.fileFormat = runtimeOrOptions?.fileFormat ?? "v2";
		}
	}
	/**
	* Whether this instance was constructed with the legacy factory pattern.
	*
	* When true, state is read from the injected `runtime` and `filesUpdate`
	* is returned to the caller. When false, state is read from LangGraph's
	* execution context and updates are sent via `__pregel_send`.
	*/
	get isLegacy() {
		return this.runtime !== void 0;
	}
	/**
	* Get files from current state.
	*
	* In legacy mode, reads from the injected {@link BackendRuntime}.
	* In zero-arg mode, reads via {@link PREGEL_READ_KEY} with fresh=true,
	* which applies any pending task writes through the reducer before returning.
	*/
	get files() {
		if (this.runtime) return this.runtime.state.files ?? {};
		const read = getConfig().configurable?.[PREGEL_READ_KEY];
		return read?.("files", true) ?? {};
	}
	/**
	* Push a files state update through LangGraph's internal send channel.
	*
	* In zero-arg mode, sends the update via the `__pregel_send` function
	* from {@link getConfig}, mirroring Python's `CONFIG_KEY_SEND`.
	* In legacy mode, this is a no-op — the caller uses `filesUpdate`
	* from the return value instead.
	*
	* @param update - Map of file paths to their updated {@link FileData},
	*   or null deletion markers.
	*/
	sendFilesUpdate(update) {
		if (this.isLegacy) return;
		const send = getConfig().configurable?.[PREGEL_SEND_KEY];
		if (typeof send === "function") send([["files", update]]);
	}
	/**
	* List files and directories in the specified directory (non-recursive).
	*
	* @param path - Absolute path to directory
	* @returns LsResult with list of FileInfo objects on success or error on failure.
	*          Directories have a trailing / in their path and is_dir=true.
	*/
	ls(path) {
		const files = this.files;
		const infos = [];
		const subdirs = /* @__PURE__ */ new Set();
		const normalizedPath = path.endsWith("/") ? path : path + "/";
		for (const [k, fd] of Object.entries(files)) {
			if (!k.startsWith(normalizedPath)) continue;
			const relative = k.substring(normalizedPath.length);
			if (relative.includes("/")) {
				const subdirName = relative.split("/")[0];
				subdirs.add(normalizedPath + subdirName + "/");
				continue;
			}
			const size = isFileDataV1(fd) ? fd.content.join("\n").length : isFileDataBinary(fd) ? fd.content.byteLength : fd.content.length;
			infos.push({
				path: k,
				is_dir: false,
				size,
				modified_at: fd.modified_at
			});
		}
		for (const subdir of Array.from(subdirs).sort()) infos.push({
			path: subdir,
			is_dir: true,
			size: 0,
			modified_at: ""
		});
		infos.sort((a, b) => a.path.localeCompare(b.path));
		return { files: infos };
	}
	/**
	* Read file content.
	*
	* Text files are paginated by line offset/limit.
	* Binary files return full Uint8Array content (offset/limit ignored).
	*
	* @param filePath - Absolute file path
	* @param offset - Line offset to start reading from (0-indexed)
	* @param limit - Maximum number of lines to read
	* @returns ReadResult with content on success or error on failure
	*/
	read(filePath, offset = 0, limit = 500) {
		const fileData = this.files[filePath];
		if (!fileData) return { error: `File '${filePath}' not found` };
		const fileDataV2 = migrateToFileDataV2(fileData, filePath);
		if (!isTextMimeType(fileDataV2.mimeType)) return {
			content: fileDataV2.content,
			mimeType: fileDataV2.mimeType
		};
		if (typeof fileDataV2.content !== "string") return { error: `File '${filePath}' has binary content but text MIME type` };
		return {
			content: fileDataV2.content.split("\n").slice(offset, offset + limit).join("\n"),
			mimeType: fileDataV2.mimeType
		};
	}
	/**
	* Read file content as raw FileData.
	*
	* @param filePath - Absolute file path
	* @returns ReadRawResult with raw file data on success or error on failure
	*/
	readRaw(filePath) {
		const fileData = this.files[filePath];
		if (!fileData) return { error: `File '${filePath}' not found` };
		return { data: fileData };
	}
	/**
	* Write content to a file, creating it or overwriting it if it already exists.
	* Returns WriteResult with filesUpdate to update LangGraph state.
	*/
	write(filePath, content) {
		const existing = this.files[filePath];
		const newFileData = createWriteFileData(filePath, content, this.fileFormat, existing);
		const update = { [filePath]: newFileData };
		if (!this.isLegacy) {
			this.sendFilesUpdate(update);
			return { path: filePath };
		}
		return {
			path: filePath,
			filesUpdate: { [filePath]: newFileData }
		};
	}
	/**
	* Edit a file by replacing string occurrences.
	* Returns EditResult with filesUpdate and occurrences.
	*/
	edit(filePath, oldString, newString, replaceAll = false) {
		const fileData = this.files[filePath];
		if (!fileData) return { error: `Error: File '${filePath}' not found` };
		const result = performStringReplacement(fileDataToString(fileData), oldString, newString, replaceAll);
		if (typeof result === "string") return { error: result };
		const [newContent, occurrences] = result;
		const newFileData = updateFileData(fileData, newContent);
		const update = { [filePath]: newFileData };
		if (!this.isLegacy) {
			this.sendFilesUpdate(update);
			return {
				path: filePath,
				occurrences
			};
		}
		return {
			path: filePath,
			filesUpdate: { [filePath]: newFileData },
			occurrences
		};
	}
	/**
	* Delete a file from state by sending a null deletion marker through Pregel.
	*/
	delete(filePath) {
		if (!(filePath in this.files)) return { error: `Error: File '${filePath}' not found` };
		if (this.isLegacy) return { error: "StateBackend.delete requires a zero-argument StateBackend in a LangGraph execution context." };
		this.sendFilesUpdate({ [filePath]: null });
		return { path: filePath };
	}
	/**
	* Search file contents for a literal text pattern.
	* Binary files are skipped.
	*/
	grep(pattern, path = "/", glob = null) {
		const files = this.files;
		return { matches: grepMatchesFromFiles(files, pattern, path, glob) };
	}
	/**
	* Structured glob matching returning FileInfo objects.
	*/
	glob(pattern, path = "/") {
		const files = this.files;
		const result = globSearchFiles(files, pattern, path);
		if (result === "No files found") return { files: [] };
		const paths = result.split("\n");
		const infos = [];
		for (const p of paths) {
			const fd = files[p];
			const size = fd ? isFileDataV1(fd) ? fd.content.join("\n").length : isFileDataBinary(fd) ? fd.content.byteLength : fd.content.length : 0;
			infos.push({
				path: p,
				is_dir: false,
				size,
				modified_at: fd?.modified_at || ""
			});
		}
		return { files: infos };
	}
	/**
	* Upload multiple files.
	*
	* Note: Since LangGraph state must be updated via Command objects,
	* the caller must apply filesUpdate via Command after calling this method.
	*
	* @param files - List of [path, content] tuples to upload
	* @returns List of FileUploadResponse objects, one per input file
	*/
	uploadFiles(files) {
		const responses = [];
		const updates = {};
		for (const [path, content] of files) try {
			const mimeType = getMimeType(path);
			if (this.fileFormat === "v2" && !isTextMimeType(mimeType)) updates[path] = createFileData(content, void 0, "v2", mimeType);
			else updates[path] = createFileData(new TextDecoder().decode(content), void 0, this.fileFormat, mimeType);
			responses.push({
				path,
				error: null
			});
		} catch {
			responses.push({
				path,
				error: "invalid_path"
			});
		}
		if (!this.isLegacy) {
			if (Object.keys(updates).length > 0) this.sendFilesUpdate(updates);
			return responses;
		}
		const result = responses;
		result.filesUpdate = updates;
		return result;
	}
	/**
	* Download multiple files.
	*
	* @param paths - List of file paths to download
	* @returns List of FileDownloadResponse objects, one per input path
	*/
	downloadFiles(paths) {
		const files = this.files;
		const responses = [];
		for (const path of paths) {
			const fileData = files[path];
			if (!fileData) {
				responses.push({
					path,
					content: null,
					error: "file_not_found"
				});
				continue;
			}
			const fileDataV2 = migrateToFileDataV2(fileData, path);
			if (typeof fileDataV2.content === "string") {
				const content = new TextEncoder().encode(fileDataV2.content);
				responses.push({
					path,
					content,
					error: null
				});
			} else responses.push({
				path,
				content: fileDataV2.content,
				error: null
			});
		}
		return responses;
	}
};
/**
* Validate permission rule paths at setup time. Throws if any path is
* relative, contains `..`, or contains `~`.
*/
function validatePermissionPaths(permissions) {
	for (const permission of permissions) for (const path of permission.paths) validatePath(path);
}
/**
* Canonicalize and validate an absolute path before permission checking.
*
* Throws for:
* - Empty or non-string input
* - Non-absolute paths (must start with `/`)
* - Paths containing `..`
* - Paths containing `~`
*/
function validatePath(raw) {
	if (typeof raw !== "string" || raw.length === 0) throw new Error("path must be a non-empty string");
	if (!raw.startsWith("/")) throw new Error(`path must be absolute: ${JSON.stringify(raw)}`);
	const segments = raw.split("/").filter((s) => s.length > 0);
	if (segments.includes("..")) throw new Error(`path must not contain "..": ${JSON.stringify(raw)}`);
	if (segments.includes("~")) throw new Error(`path must not contain "~": ${JSON.stringify(raw)}`);
	return `/${segments.join("/")}`;
}
/**
* Test whether `path` matches a glob `pattern`.
*
* Supports:
* - `**` — any number of directory levels
* - `*` — within a single path segment
* - `{a,b}` — brace expansion
*
* Uses `micromatch` with `dot: true` so dotfiles are matched by default.
*/
function globMatch(path, pattern) {
	return import_micromatch.default.isMatch(path, pattern, { dot: true });
}
/**
* Evaluate permission rules against an operation + path and return the
* access decision.
*
* First-match-wins; permissive default.
*
* @returns `"allow"` if the operation is permitted, `"deny"` otherwise.
*/
function decidePathAccess(rules, operation, path) {
	for (const rule of rules) {
		if (!rule.operations.includes(operation)) continue;
		if (rule.paths.some((pattern) => globMatch(path, pattern))) return rule.mode ?? "allow";
	}
	return "allow";
}
/**
* Backend that routes file operations to different backends based on path prefix.
*
* This enables hybrid storage strategies like:
* - `/memories/` → StoreBackend (persistent, cross-thread)
* - Everything else → StateBackend (ephemeral, per-thread)
*
* The CompositeBackend handles path prefix stripping/re-adding transparently.
*/
var CompositeBackend = class {
	default;
	routes;
	sortedRoutes;
	constructor(defaultBackend, routes) {
		this.default = isSandboxProtocol(defaultBackend) ? adaptSandboxProtocol(defaultBackend) : adaptBackendProtocol(defaultBackend);
		this.routes = Object.fromEntries(Object.entries(routes).map(([k, v]) => [k, isSandboxProtocol(v) ? adaptSandboxProtocol(v) : adaptBackendProtocol(v)]));
		this.sortedRoutes = Object.entries(this.routes).sort((a, b) => b[0].length - a[0].length);
	}
	/** Delegates to default backend's id if it is a sandbox, otherwise empty string. */
	get id() {
		return isSandboxBackend(this.default) ? this.default.id : "";
	}
	/** Route prefixes registered on this backend (e.g. `["/workspace"]`). */
	get routePrefixes() {
		return Object.keys(this.routes);
	}
	/**
	* Type guard — returns true if `backend` is a {@link CompositeBackend}.
	*
	* Uses duck-typing on `routePrefixes` so it works across module boundaries
	* where `instanceof` may fail.
	*/
	static isInstance(backend) {
		return typeof backend === "object" && backend !== null && Array.isArray(backend.routePrefixes);
	}
	/**
	* Determine which backend handles this key and strip prefix.
	*
	* @param key - Original file path
	* @returns Tuple of [backend, stripped_key] where stripped_key has the route
	*          prefix removed (but keeps leading slash).
	*/
	getBackendAndKey(key) {
		for (const [prefix, backend] of this.sortedRoutes) if (key.startsWith(prefix)) {
			const suffix = key.substring(prefix.length);
			return [backend, suffix ? "/" + suffix : "/"];
		}
		return [this.default, key];
	}
	/**
	* Returns true when `path` points at `routePrefix` or its descendants.
	*/
	isPathWithinRoute(path, routePrefix) {
		const normalizedRoute = routePrefix.endsWith("/") ? routePrefix : `${routePrefix}/`;
		return path === normalizedRoute.slice(0, -1) || path.startsWith(normalizedRoute);
	}
	/**
	* Returns true when `routePrefix` is inside `path` (or equal to it).
	*
	* Examples:
	* - path `/` includes all routes
	* - path `/workspace` includes route `/workspace/memories/`
	* - path `/workspace` excludes route `/skills/`
	*/
	isRouteUnderPath(routePrefix, path) {
		if (path === "/") return true;
		const normalizedPath = path.endsWith("/") ? path : `${path}/`;
		return (routePrefix.endsWith("/") ? routePrefix : `${routePrefix}/`).startsWith(normalizedPath);
	}
	/**
	* List files and directories in the specified directory (non-recursive).
	*
	* @param path - Absolute path to directory
	* @returns LsResult with list of FileInfo objects (with route prefixes added) on success or error on failure.
	*          Directories have a trailing / in their path and is_dir=true.
	*/
	async ls(path) {
		for (const [routePrefix, backend] of this.sortedRoutes) if (this.isPathWithinRoute(path, routePrefix)) {
			const suffix = path.substring(routePrefix.length);
			const searchPath = suffix ? "/" + suffix : "/";
			const result = await backend.ls(searchPath);
			if (result.error) return result;
			const prefixed = [];
			for (const fi of result.files || []) prefixed.push({
				...fi,
				path: routePrefix.slice(0, -1) + fi.path
			});
			return { files: prefixed };
		}
		if (path === "/") {
			const results = [];
			const defaultResult = await this.default.ls(path);
			if (defaultResult.error) return defaultResult;
			results.push(...defaultResult.files || []);
			for (const [routePrefix] of this.sortedRoutes) results.push({
				path: routePrefix,
				is_dir: true,
				size: 0,
				modified_at: ""
			});
			results.sort((a, b) => a.path.localeCompare(b.path));
			return { files: results };
		}
		return await this.default.ls(path);
	}
	/**
	* Read file content, routing to appropriate backend.
	*
	* @param filePath - Absolute file path
	* @param offset - Line offset to start reading from (0-indexed)
	* @param limit - Maximum number of lines to read
	* @returns Formatted file content with line numbers, or error message
	*/
	async read(filePath, offset = 0, limit = 500) {
		const [backend, strippedKey] = this.getBackendAndKey(filePath);
		return await backend.read(strippedKey, offset, limit);
	}
	/**
	* Read file content as raw FileData.
	*
	* @param filePath - Absolute file path
	* @returns ReadRawResult with raw file data on success or error on failure
	*/
	async readRaw(filePath) {
		const [backend, strippedKey] = this.getBackendAndKey(filePath);
		return await backend.readRaw(strippedKey);
	}
	/**
	* Structured search results or error string for invalid input.
	*/
	async grep(pattern, path = "/", glob = null) {
		const searchPath = path || "/";
		for (const [routePrefix, backend] of this.sortedRoutes) if (this.isPathWithinRoute(searchPath, routePrefix)) {
			const routeSearchPath = searchPath.substring(routePrefix.length - 1);
			const raw = await backend.grep(pattern, routeSearchPath || "/", glob);
			if (raw.error) return raw;
			return { matches: (raw.matches || []).map((m) => ({
				...m,
				path: routePrefix.slice(0, -1) + m.path
			})) };
		}
		const allMatches = [];
		const rawDefault = await this.default.grep(pattern, searchPath, glob);
		if (rawDefault.error) return rawDefault;
		allMatches.push(...rawDefault.matches || []);
		for (const [routePrefix, backend] of Object.entries(this.routes)) {
			if (!this.isRouteUnderPath(routePrefix, searchPath)) continue;
			const raw = await backend.grep(pattern, "/", glob);
			if (raw.error) return raw;
			const matches = (raw.matches || []).map((m) => ({
				...m,
				path: routePrefix.slice(0, -1) + m.path
			}));
			allMatches.push(...matches);
		}
		return { matches: allMatches };
	}
	/**
	* Structured glob matching returning FileInfo objects.
	*/
	async glob(pattern, path = "/") {
		const results = [];
		for (const [routePrefix, backend] of this.sortedRoutes) if (this.isPathWithinRoute(path, routePrefix)) {
			const searchPath = path.substring(routePrefix.length - 1);
			const result = await backend.glob(pattern, searchPath || "/");
			if (result.error) return result;
			return { files: (result.files || []).map((fi) => ({
				...fi,
				path: routePrefix.slice(0, -1) + fi.path
			})) };
		}
		const defaultResult = await this.default.glob(pattern, path);
		if (defaultResult.error) return defaultResult;
		results.push(...defaultResult.files || []);
		for (const [routePrefix, backend] of Object.entries(this.routes)) {
			if (!this.isRouteUnderPath(routePrefix, path)) continue;
			const result = await backend.glob(pattern, "/");
			if (result.error) continue;
			const files = (result.files || []).map((fi) => ({
				...fi,
				path: routePrefix.slice(0, -1) + fi.path
			}));
			results.push(...files);
		}
		results.sort((a, b) => a.path.localeCompare(b.path));
		return { files: results };
	}
	/**
	* Write content to a file, routing to appropriate backend.
	*
	* @param filePath - Absolute file path
	* @param content - File content as string
	* @returns WriteResult with path or error
	*/
	async write(filePath, content) {
		const [backend, strippedKey] = this.getBackendAndKey(filePath);
		return await backend.write(strippedKey, content);
	}
	/**
	* Edit a file, routing to appropriate backend.
	*
	* @param filePath - Absolute file path
	* @param oldString - String to find and replace
	* @param newString - Replacement string
	* @param replaceAll - If true, replace all occurrences
	* @returns EditResult with path, occurrences, or error
	*/
	async edit(filePath, oldString, newString, replaceAll = false) {
		const [backend, strippedKey] = this.getBackendAndKey(filePath);
		return await backend.edit(strippedKey, oldString, newString, replaceAll);
	}
	/**
	* Delete a file, routing to the appropriate backend.
	*/
	async delete(filePath) {
		const [backend, strippedKey] = this.getBackendAndKey(filePath);
		if (!backend.delete) return { error: "Backend does not support delete" };
		const result = await backend.delete(strippedKey);
		if (result.path !== void 0) return {
			...result,
			path: filePath
		};
		return result;
	}
	/**
	* Execute a command via the default backend.
	* Execution is not path-specific, so it always delegates to the default backend.
	*
	* @param command - Full shell command string to execute
	* @returns ExecuteResponse with combined output, exit code, and truncation flag
	* @throws Error if the default backend doesn't support command execution
	*/
	execute(command) {
		if (!isSandboxBackend(this.default)) throw new Error("Default backend doesn't support command execution (SandboxBackendProtocol). To enable execution, provide a default backend that implements SandboxBackendProtocol.");
		return Promise.resolve(this.default.execute(command));
	}
	/**
	* Upload multiple files, batching by backend for efficiency.
	*
	* @param files - List of [path, content] tuples to upload
	* @returns List of FileUploadResponse objects, one per input file
	*/
	async uploadFiles(files) {
		const results = Array.from({ length: files.length }, () => null);
		const batchesByBackend = /* @__PURE__ */ new Map();
		for (let idx = 0; idx < files.length; idx++) {
			const [path, content] = files[idx];
			const [backend, strippedPath] = this.getBackendAndKey(path);
			if (!batchesByBackend.has(backend)) batchesByBackend.set(backend, []);
			batchesByBackend.get(backend).push({
				idx,
				path: strippedPath,
				content
			});
		}
		for (const [backend, batch] of batchesByBackend) {
			if (!backend.uploadFiles) throw new Error("Backend does not support uploadFiles");
			const batchFiles = batch.map((b) => [b.path, b.content]);
			const batchResponses = await backend.uploadFiles(batchFiles);
			for (let i = 0; i < batch.length; i++) {
				const originalIdx = batch[i].idx;
				results[originalIdx] = {
					path: files[originalIdx][0],
					error: batchResponses[i]?.error ?? null
				};
			}
		}
		return results;
	}
	/**
	* Download multiple files, batching by backend for efficiency.
	*
	* @param paths - List of file paths to download
	* @returns List of FileDownloadResponse objects, one per input path
	*/
	async downloadFiles(paths) {
		const results = Array.from({ length: paths.length }, () => null);
		const batchesByBackend = /* @__PURE__ */ new Map();
		for (let idx = 0; idx < paths.length; idx++) {
			const path = paths[idx];
			const [backend, strippedPath] = this.getBackendAndKey(path);
			if (!batchesByBackend.has(backend)) batchesByBackend.set(backend, []);
			batchesByBackend.get(backend).push({
				idx,
				path: strippedPath
			});
		}
		for (const [backend, batch] of batchesByBackend) {
			if (!backend.downloadFiles) throw new Error("Backend does not support downloadFiles");
			const batchPaths = batch.map((b) => b.path);
			const batchResponses = await backend.downloadFiles(batchPaths);
			for (let i = 0; i < batch.length; i++) {
				const originalIdx = batch[i].idx;
				results[originalIdx] = {
					path: paths[originalIdx],
					content: batchResponses[i]?.content ?? null,
					error: batchResponses[i]?.error ?? null
				};
			}
		}
		return results;
	}
};
/**
* Middleware for providing filesystem tools to an agent.
*
* Provides ls, read_file, write_file, edit_file, glob, and grep tools with support for:
* - Pluggable backends (StateBackend, StoreBackend, FilesystemBackend, CompositeBackend)
* - Tool result eviction for large outputs
*/
var INT_FORMATTER = new Intl.NumberFormat("en-US");
/**
* Normalizes tool input so that models sending `path` instead of `file_path`
* still work. If the input has `path` but not `file_path`, copies `path` into
* `file_path`. This makes the filesystem tools resilient to parameter-name
* variations across models of different capability levels.
*/
function normalizeFilePathInput(input) {
	if (typeof input === "object" && input !== null && "path" in input && !("file_path" in input)) {
		const { path, ...rest } = input;
		return {
			...rest,
			file_path: path
		};
	}
	return input;
}
/**
* Tools that should be excluded from the large result eviction logic.
*
* This array contains tools that should NOT have their results evicted to the filesystem
* when they exceed token limits. Tools are excluded for different reasons:
*
* 1. Tools with built-in truncation (ls, glob, grep):
*    These tools truncate their own output when it becomes too large. When these tools
*    produce truncated output due to many matches, it typically indicates the query
*    needs refinement rather than full result preservation. In such cases, the truncated
*    matches are potentially more like noise and the LLM should be prompted to narrow
*    its search criteria instead.
*
* 2. Tools with problematic truncation behavior (read_file):
*    read_file is tricky to handle as the failure mode here is single long lines
*    (e.g., imagine a jsonl file with very long payloads on each line). If we try to
*    truncate the result of read_file, the agent may then attempt to re-read the
*    truncated file using read_file again, which won't help.
*
* 3. Tools that never exceed limits (edit_file, write_file):
*    These tools return minimal confirmation messages and are never expected to produce
*    output large enough to exceed token limits, so checking them would be unnecessary.
*/
/**
* All tool names registered by FilesystemMiddleware.
* This is the single source of truth — used by createDeepAgent to detect
* collisions with user-supplied tools at construction time.
*/
var FILESYSTEM_TOOL_NAMES = [
	"ls",
	"read_file",
	"write_file",
	"edit_file",
	"glob",
	"grep",
	"execute"
];
var TOOLS_EXCLUDED_FROM_EVICTION = FILESYSTEM_TOOL_NAMES.filter((name) => name !== "execute");
/**
* Maximum size for binary (non-text) files read via read_file, in bytes.
* Base64-encoded content is ~33% larger, so 10MB raw ≈ 13.3MB in context.
* This keeps inline multimodal payloads within all major provider limits.
*/
var MAX_BINARY_READ_SIZE_BYTES = 10 * 1024 * 1024;
/**
* Template for truncation message in read_file.
* {file_path} will be filled in at runtime.
*/
var READ_FILE_TRUNCATION_MSG = `

[Output was truncated due to size limits. The file content is very large. Consider reformatting the file to make it easier to navigate. For example, if this is JSON, use execute(command='jq . {file_path}') to pretty-print it with line breaks. For other formats, you can use appropriate formatting tools to split long lines.]`;
/**
* Message template for evicted tool results.
*/
var TOO_LARGE_TOOL_MSG = context`
  Tool result too large, the result of this tool call {tool_call_id} was saved in the filesystem at this path: {file_path}
  You can read the result from the filesystem by using the read_file tool, but make sure to only read part of the result at a time.
  You can do this by specifying an offset and limit in the read_file tool call.
  For example, to read the first ${100} lines, you can use the read_file tool with offset=0 and limit=${100}.

  Here is a preview showing the head and tail of the result (lines of the form
  ... [N lines truncated] ...
  indicate omitted lines in the middle of the content):

  {content_sample}
`;
/**
* Message template for evicted HumanMessages.
*/
var TOO_LARGE_HUMAN_MSG = `Message content too large and was saved to the filesystem at: {file_path}

You can read the full content using the read_file tool with pagination (offset and limit parameters).

Here is a preview showing the head and tail of the content:

{content_sample}`;
/**
* Extract text content from a message.
*
* For string content, returns it directly. For array content (mixed block types
* like text + image), joins all text blocks. Returns empty string if no text found.
*/
function extractTextFromMessage(message) {
	if (typeof message.content === "string") return message.content;
	if (Array.isArray(message.content)) return message.content.filter((block) => block.type === "text" && typeof block.text === "string").map((block) => block.text).join("\n");
	return String(message.content);
}
function stringifyToolContent(content) {
	if (typeof content === "string") return content;
	if (Array.isArray(content)) return content.map((block) => {
		if (typeof block === "object" && block !== null && "type" in block && block.type === "text" && "text" in block && typeof block.text === "string") return block.text;
		return JSON.stringify(block);
	}).join("\n");
	return String(content);
}
/**
* Build replacement content for an evicted HumanMessage, preserving non-text blocks.
*
* For plain string content, returns the replacement text directly. For list content
* with mixed block types (e.g., text + image), replaces all text blocks with a single
* text block containing the replacement text while keeping non-text blocks intact.
*/
function buildEvictedHumanContent(message, replacementText) {
	if (typeof message.content === "string") return replacementText;
	if (Array.isArray(message.content)) {
		const mediaBlocks = message.content.filter((block) => typeof block === "object" && block !== null && block.type !== "text");
		if (mediaBlocks.length === 0) return replacementText;
		return [{
			type: "text",
			text: replacementText
		}, ...mediaBlocks];
	}
	return replacementText;
}
/**
* Build a truncated HumanMessage for the model request.
*
* Computes a preview from the full content still in state and returns a
* lightweight replacement the model will see. Pure string computation — no
* backend I/O.
*/
function buildTruncatedHumanMessage(message, filePath) {
	const contentSample = createContentPreview(extractTextFromMessage(message));
	return new HumanMessage({
		content: buildEvictedHumanContent(message, TOO_LARGE_HUMAN_MSG.replace("{file_path}", filePath).replace("{content_sample}", contentSample)),
		id: message.id,
		additional_kwargs: { ...message.additional_kwargs },
		response_metadata: { ...message.response_metadata }
	});
}
/**
* Create a preview of content showing head and tail with truncation marker.
*
* @param contentStr - The full content string to preview.
* @param headLines - Number of lines to show from the start (default: 5).
* @param tailLines - Number of lines to show from the end (default: 5).
* @returns Formatted preview string with line numbers.
*/
function createContentPreview(contentStr, headLines = 5, tailLines = 5) {
	const lines = contentStr.split("\n");
	if (lines.length <= headLines + tailLines) return formatContentWithLineNumbers(lines.map((line) => line.substring(0, 1e3)), 1);
	const head = lines.slice(0, headLines).map((line) => line.substring(0, 1e3));
	const tail = lines.slice(-tailLines).map((line) => line.substring(0, 1e3));
	const headSample = formatContentWithLineNumbers(head, 1);
	const truncationNotice = `\n... [${lines.length - headLines - tailLines} lines truncated] ...\n`;
	const tailSample = formatContentWithLineNumbers(tail, lines.length - tailLines + 1);
	return headSample + truncationNotice + tailSample;
}
/**
* Zod v3 schema for FileData (re-export from backends)
*/
var FileDataSchema = union([object({
	content: array(string()),
	created_at: string(),
	modified_at: string()
}), object({
	content: union([string(), _instanceof(Uint8Array)]),
	mimeType: string(),
	created_at: string(),
	modified_at: string()
})]);
/**
* Reducer for files state that merges file updates with support for deletions.
* When a file value is null, the file is deleted from state.
* When a file value is non-null, it is added or updated in state.
*
* This reducer enables concurrent updates from parallel subagents by properly
* merging their file changes instead of requiring LastValue semantics.
*
* @param current - The current files record (from state)
* @param update - The new files record (from a subagent update), with null values for deletions
* @returns Merged files record with deletions applied
*/
function fileDataReducer(current, update) {
	if (update === void 0) return current || {};
	if (current === void 0) {
		const result = {};
		for (const [key, value] of Object.entries(update)) if (value !== null) result[key] = value;
		return result;
	}
	const result = { ...current };
	for (const [key, value] of Object.entries(update)) if (value === null) delete result[key];
	else result[key] = value;
	return result;
}
/**
* Shared filesystem state schema.
* Defined at module level to ensure the same object identity is used across all agents,
* preventing "Channel already exists with different type" errors when multiple agents
* use createFilesystemMiddleware.
*
* Uses ReducedValue for files to allow concurrent updates from parallel subagents.
*/
var FilesystemStateSchema = new StateSchema({ files: new ReducedValue(record(string(), FileDataSchema).default(() => ({})), {
	inputSchema: record(string(), FileDataSchema.nullable()).optional(),
	reducer: fileDataReducer
}) });
/** Extract a message string from an unknown thrown value without `instanceof`. */
function getErrorMessage$1(error) {
	if (typeof error === "object" && error !== null && "message" in error && typeof error.message === "string") return error.message;
	return String(error);
}
/**
* Check whether `path` is permitted under `rules` for `operation`, returning an
* error string to surface to the model (or `undefined` when allowed).
*
* Never throws: an invalid path (non-absolute, or containing `..` or `~`) or a
* denied path is a recoverable tool error, not a fatal run-ending one. Such
* paths are rejected, never normalized, so they cannot bypass a deny rule or
* reach the backend.
*
* @internal
*/
function checkPermission(rules, operation, path) {
	if (rules.length === 0) return;
	let canonical;
	try {
		canonical = validatePath(path);
	} catch (error) {
		return `Error: ${getErrorMessage$1(error)}`;
	}
	if (decidePathAccess(rules, operation, canonical) === "deny") return `Error: permission denied for ${operation} on ${canonical}`;
}
/**
* Build an error {@link ToolMessage} for a rejected or denied path. Returning a
* bare string would be wrapped as a `status: "success"` message whose content
* merely starts with "Error:"; marking `status: "error"` reports the failure
* accurately so callers and the model can distinguish a real failure from a
* successful result.
*/
function toolError(runtime, toolName, message) {
	return new ToolMessage({
		content: message,
		name: toolName,
		tool_call_id: runtime.toolCall?.id,
		status: "error"
	});
}
/**
* Filter a list of filesystem entries to those the rules permit.
*
* `getPath` extracts the absolute path from each entry. Entries with
* unparsable paths are included (not silently dropped). Returns the
* original array unchanged when `rules` is empty.
*
* @internal
*/
function filterByPermissions(entries, rules, operation, getPath) {
	if (rules.length === 0) return entries;
	return entries.filter((entry) => {
		try {
			return decidePathAccess(rules, operation, validatePath(getPath(entry))) !== "deny";
		} catch {
			return true;
		}
	});
}
var LS_TOOL_DESCRIPTION = context`
  Lists all files in a directory.

  This is useful for exploring the filesystem and finding the right file to read or edit.
  You should almost ALWAYS use this tool before using the read_file or edit_file tools.
`;
var READ_FILE_TOOL_DESCRIPTION = context`
  Reads a file from the filesystem. Assume any path the user provides is valid; reading a missing file returns an error.

  Usage:
  - By default, it reads up to ${100} lines starting from the beginning of the file. Use \`offset\`/\`limit\` to page through large files instead of reading them whole.
  - Results are returned with line numbers starting at \`offset\` + 1 (1 by default), then two spaces, then the source line. Never include these line-number prefixes when editing.
  - Lines over ${INT_FORMATTER.format(MAX_LINE_LENGTH)} characters are split with continuation markers (e.g. 5.1, 5.2); \`limit\` counts source lines, so continuation rows do not consume the budget.
  - Speculatively batch multiple \`read_file\` calls in one response when several files may be useful.
  - An empty file returns a system-reminder warning in place of contents.
  - Large tool results may be offloaded to a file; the tool message gives the path. Read that path here, paging with \`offset\`/\`limit\`.
  - Images (\`.png\`, \`.jpg\`, etc.), audio, video, and PDFs return multimodal content blocks (https://docs.langchain.com/javascript/python/langchain/messages#multimodal).
  - For images and PDFs, pagination via \`offset\`/\`limit\` is text-only - supply \`file_path\` only.
  - Always read a file before editing it.
`;
var WRITE_FILE_TOOL_DESCRIPTION = context`
  Writes content to a file. Creates the file if it does not exist; replaces it entirely if it does.

  Usage:
  - Use this tool when you intend to create a new file or replace the whole file. You do not need to read the file first.
  - Prefer to edit existing files (with the edit_file tool) over creating new ones when possible.
`;
var EDIT_FILE_TOOL_DESCRIPTION = context`
  Performs exact string replacements in files.

  Usage:
  - You must read the file before editing; this tool errors otherwise.
  - Preserve the exact indentation from the read output, and never include line-number prefixes in old_string or new_string.
  - Prefer editing an existing file over creating a new one.
  - Only use emojis if the user explicitly requests it.
`;
var GLOB_TOOL_DESCRIPTION = context`
  Find files matching a glob pattern, returning absolute paths.

  Supports \`*\` (any characters), \`**\` (any directories), \`?\` (single character), e.g. \`**/*.py\`, \`*.txt\`, \`/subdir/**/*.md\`.
`;
var GREP_REGEX_EXECUTE_FALLBACK = "\n- If you genuinely need regex, use the execute tool with `rg '<regex>'` instead.";
function getGrepToolDescription(includeExecution) {
	return context`
    Search for a LITERAL text pattern across files (NOT regex).

    The pattern is matched verbatim: regex metacharacters are ordinary characters, not operators. To match any of several strings, run a separate grep for each; \`grep(pattern="foo|bar")\` searches for the literal text "foo|bar", and \`.*\` or \`\\.\` match those characters literally.${includeExecution ? GREP_REGEX_EXECUTE_FALLBACK : ""}

    Returns matching files or content per \`output_mode\`. Offloaded large tool results live under the artifacts root (\`/large_tool_results/\` by default); grep that directory to search them when you do not know the exact path.
  `;
}
var EXECUTE_SEARCH_GUIDANCE = {
	both: "You MUST avoid using search commands like find and grep. Instead use the grep, glob tools to search. ",
	grep: "You MUST avoid using shell grep for searches. Instead use the grep tool to search text. ",
	glob: "You MUST avoid using shell find for searches. Instead use the glob tool to find files. ",
	none: ""
};
function getExecuteToolDescription(hasGrep, hasGlob) {
	const searchGuidance = hasGrep ? hasGlob ? EXECUTE_SEARCH_GUIDANCE.both : EXECUTE_SEARCH_GUIDANCE.grep : hasGlob ? EXECUTE_SEARCH_GUIDANCE.glob : EXECUTE_SEARCH_GUIDANCE.none;
	const examples = [hasGlob ? "- execute(command=\"find . -name '*.py'\") # Use glob tool instead" : "", hasGrep ? "- execute(command=\"grep -r 'pattern' .\") # Use grep tool instead" : ""].filter(Boolean);
	return context`
    Executes a shell command in an isolated sandbox and returns combined stdout/stderr with the exit code (truncated if very large).

    Usage:
    - Quote paths containing spaces (e.g. cd "/path/with spaces").
    - Chain commands with ';' or '&&' (use '&&' when a command depends on the previous); do not use newlines except inside quoted strings.
    - Use absolute paths and avoid \`cd\` so the working directory stays stable.
    - ${searchGuidance}Use read_file rather than cat/head/tail.${examples.length ? `\n${examples.join("\n")}` : ""}

    Only available on backends implementing SandboxBackendProtocol; otherwise it returns an error.
  `;
}
/**
* Create ls tool using backend.
*/
function createLsTool(backend, options) {
	const { customDescription, permissions } = options;
	return tool$1(async (input, runtime) => {
		const permissionError = checkPermission(permissions, "read", input.path ?? "/");
		if (permissionError !== void 0) return toolError(runtime, "ls", permissionError);
		const resolvedBackend = await resolveBackend(backend, runtime);
		const path = input.path || "/";
		const lsResult = await resolvedBackend.ls(path);
		if (lsResult.error) return `Error listing files: ${lsResult.error}`;
		const infos = filterByPermissions(lsResult.files ?? [], permissions, "read", (info) => info.path);
		if (infos.length === 0) return `No files found in ${path}`;
		const lines = [];
		for (const info of infos) if (info.is_dir) lines.push(`${info.path} (directory)`);
		else {
			const size = info.size ? ` (${info.size} bytes)` : "";
			lines.push(`${info.path}${size}`);
		}
		const result = truncateIfTooLong(lines);
		if (Array.isArray(result)) return result.join("\n");
		return result;
	}, {
		name: "ls",
		description: customDescription || LS_TOOL_DESCRIPTION,
		schema: object({ path: string().optional().default("/").describe("Directory path to list (default: /)") })
	});
}
/**
* Create read_file tool using backend.
*/
function createReadFileTool(backend, options) {
	const { customDescription, toolTokenLimitBeforeEvict, permissions } = options;
	return tool$1(async (input, runtime) => {
		const permissionError = checkPermission(permissions, "read", input.file_path);
		if (permissionError !== void 0) return toolError(runtime, "read_file", permissionError);
		const resolvedBackend = await resolveBackend(backend, runtime);
		const { file_path, offset = 0, limit = 100 } = input;
		const readResult = await resolvedBackend.read(file_path, offset, limit);
		if (readResult.error) return [{
			type: "text",
			text: `Error: ${readResult.error}`
		}];
		const mimeType = readResult.mimeType ?? getMimeType(file_path);
		if (!isTextMimeType(mimeType)) {
			const binaryContent = readResult.content;
			if (!binaryContent) return [{
				type: "text",
				text: `Error: expected binary content for '${file_path}'`
			}];
			let base64Data;
			if (typeof binaryContent === "string") base64Data = binaryContent;
			else if (ArrayBuffer.isView(binaryContent)) base64Data = Buffer.from(binaryContent).toString("base64");
			else {
				const values = Object.values(binaryContent);
				base64Data = Buffer.from(new Uint8Array(values)).toString("base64");
			}
			const sizeBytes = Math.ceil(base64Data.length * 3 / 4);
			if (sizeBytes > 10485760) return [{
				type: "text",
				text: `Error: file too large to read (${Math.round(sizeBytes / (1024 * 1024))}MB exceeds ${MAX_BINARY_READ_SIZE_BYTES / (1024 * 1024)}MB limit for binary files)`
			}];
			if (mimeType.startsWith("image/")) return [{
				type: "image",
				mimeType,
				data: base64Data
			}];
			if (mimeType.startsWith("audio/")) return [{
				type: "audio",
				mimeType,
				data: base64Data
			}];
			if (mimeType.startsWith("video/")) return [{
				type: "video",
				mimeType,
				data: base64Data
			}];
			return [{
				type: "file",
				mimeType,
				data: base64Data
			}];
		}
		let content = typeof readResult.content === "string" ? readResult.content : "";
		const lines = content.split("\n");
		if (lines.length > limit) content = lines.slice(0, limit).join("\n");
		let formatted = formatContentWithLineNumbers(content, offset + 1);
		if (toolTokenLimitBeforeEvict && formatted.length >= 4 * toolTokenLimitBeforeEvict) {
			const truncationMsg = READ_FILE_TRUNCATION_MSG.replace("{file_path}", file_path);
			const maxContentLength = 4 * toolTokenLimitBeforeEvict - truncationMsg.length;
			formatted = formatted.substring(0, maxContentLength) + truncationMsg;
		}
		return [{
			type: "text",
			text: formatted
		}];
	}, {
		name: "read_file",
		description: customDescription || READ_FILE_TOOL_DESCRIPTION,
		schema: preprocess(normalizeFilePathInput, object({
			file_path: string().describe("Absolute path to the file to read"),
			offset: number$1().optional().default(0).describe("Line offset to start reading from (0-indexed)"),
			limit: number$1().optional().default(100).describe("Maximum number of lines to read")
		}))
	});
}
/**
* Create write_file tool using backend.
*/
function createWriteFileTool(backend, options) {
	const { customDescription, permissions } = options;
	return tool$1(async (input, runtime) => {
		const permissionError = checkPermission(permissions, "write", input.file_path);
		if (permissionError !== void 0) return toolError(runtime, "write_file", permissionError);
		const resolvedBackend = await resolveBackend(backend, runtime);
		const { file_path, content } = input;
		const result = await resolvedBackend.write(file_path, content);
		if (result.error) return result.error;
		const message = new ToolMessage({
			content: `Successfully wrote to '${file_path}'`,
			tool_call_id: runtime.toolCall?.id,
			name: "write_file",
			metadata: result.metadata
		});
		if (result.filesUpdate) return new Command({ update: {
			files: result.filesUpdate,
			messages: [message]
		} });
		return message;
	}, {
		name: "write_file",
		description: customDescription || WRITE_FILE_TOOL_DESCRIPTION,
		schema: preprocess(normalizeFilePathInput, object({
			file_path: string().describe("Absolute path where the file should be written. Must be absolute, not relative."),
			content: string().default("").describe("The text content to write to the file. Defaults to empty.")
		}))
	});
}
/**
* Create edit_file tool using backend.
*/
function createEditFileTool(backend, options) {
	const { customDescription, permissions } = options;
	return tool$1(async (input, runtime) => {
		const permissionError = checkPermission(permissions, "write", input.file_path);
		if (permissionError !== void 0) return toolError(runtime, "edit_file", permissionError);
		const resolvedBackend = await resolveBackend(backend, runtime);
		const { file_path, old_string, new_string, replace_all = false } = input;
		const result = await resolvedBackend.edit(file_path, old_string, new_string, replace_all);
		if (result.error) return result.error;
		const message = new ToolMessage({
			content: `Successfully replaced ${result.occurrences} occurrence(s) in '${file_path}'`,
			tool_call_id: runtime.toolCall?.id,
			name: "edit_file",
			metadata: result.metadata
		});
		if (result.filesUpdate) return new Command({ update: {
			files: result.filesUpdate,
			messages: [message]
		} });
		return message;
	}, {
		name: "edit_file",
		description: customDescription || EDIT_FILE_TOOL_DESCRIPTION,
		schema: preprocess(normalizeFilePathInput, object({
			file_path: string().describe("Absolute path to the file to edit"),
			old_string: string().describe("String to be replaced (must match exactly)"),
			new_string: string().describe("String to replace with"),
			replace_all: boolean().optional().default(false).describe("Whether to replace all occurrences")
		}))
	});
}
/**
* Create glob tool using backend.
*/
function createGlobTool(backend, options) {
	const { customDescription, permissions } = options;
	return tool$1(async (input, runtime) => {
		const permissionError = checkPermission(permissions, "read", input.path ?? "/");
		if (permissionError !== void 0) return toolError(runtime, "glob", permissionError);
		const resolvedBackend = await resolveBackend(backend, runtime);
		const { pattern, path } = input;
		const globResult = await resolvedBackend.glob(pattern, path);
		if (globResult.error) return `Error finding files: ${globResult.error}`;
		const infos = filterByPermissions(globResult.files ?? [], permissions, "read", (info) => info.path);
		if (infos.length === 0) return `No files found matching pattern '${pattern}'`;
		const result = truncateIfTooLong(infos.map((info) => info.path));
		if (Array.isArray(result)) return result.join("\n");
		return result;
	}, {
		name: "glob",
		description: customDescription || GLOB_TOOL_DESCRIPTION,
		schema: object({
			pattern: string().describe("Glob pattern to match files (e.g., '**/*.py', '*.txt', '/subdir/**/*.md')"),
			path: string().optional().describe("Base directory to search from. Defaults to the backend's default root.")
		})
	});
}
/**
* Create grep tool using backend.
*/
function createGrepTool(backend, options) {
	const { customDescription, permissions, includeExecution } = options;
	return tool$1(async (input, runtime) => {
		const permissionError = checkPermission(permissions, "read", input.path ?? "/");
		if (permissionError !== void 0) return toolError(runtime, "grep", permissionError);
		const resolvedBackend = await resolveBackend(backend, runtime);
		const { pattern, path = "/", glob = null } = input;
		const result = await resolvedBackend.grep(pattern, path, glob);
		if (result.error) return result.error;
		const matches = filterByPermissions(result.matches ?? [], permissions, "read", (m) => m.path);
		if (matches.length === 0) return `No matches found for pattern '${pattern}'`;
		const lines = [];
		let currentFile = null;
		for (const match of matches) {
			if (match.path !== currentFile) {
				currentFile = match.path;
				lines.push(`\n${currentFile}:`);
			}
			lines.push(`  ${match.line}: ${match.text}`);
		}
		const truncated = truncateIfTooLong(lines);
		if (Array.isArray(truncated)) return truncated.join("\n");
		return truncated;
	}, {
		name: "grep",
		description: customDescription || getGrepToolDescription(includeExecution),
		schema: object({
			pattern: string().describe("Literal text pattern to search for (not regex)"),
			path: string().optional().default("/").describe("Base path to search from (default: /)"),
			glob: string().optional().nullable().default(null).describe("Optional glob pattern to filter files (e.g., '*.py')")
		})
	});
}
/**
* Create execute tool using backend.
*/
function createExecuteTool(backend, options) {
	const { customDescription, permissions, hasGrep, hasGlob } = options;
	return tool$1(async (input, runtime) => {
		const resolvedBackend = await resolveBackend(backend, runtime);
		if (!isSandboxBackend(resolvedBackend)) return "Error: Execution not available. This agent's backend does not support command execution (SandboxBackendProtocol). To use the execute tool, provide a backend that implements SandboxBackendProtocol.";
		if (permissions.length > 0 && !allPathsScopedToRoutes(permissions, resolvedBackend)) return "Error: Execution not available. Filesystem permissions cannot be used with a backend that supports command execution because shell commands can access any path, making path-based rules ineffective.";
		const result = await resolvedBackend.execute(input.command);
		const parts = [result.output];
		if (result.exitCode !== null) {
			const status = result.exitCode === 0 ? "succeeded" : "failed";
			parts.push(`\n[Command ${status} with exit code ${result.exitCode}]`);
		}
		if (result.truncated) parts.push("\n[Output was truncated due to size limits]");
		return parts.join("");
	}, {
		name: "execute",
		description: customDescription || getExecuteToolDescription(hasGrep, hasGlob),
		schema: object({ command: string().describe("The shell command to execute") })
	});
}
/**
* Returns true only when backend exposes route prefixes (CompositeBackend) and
* every permission path is scoped under one of them.
*/
function normalizeFilesystemTools(tools) {
	if (tools == null || tools === "all") return null;
	const enabledTools = new Set(tools);
	if (!enabledTools.has("read_file")) throw new Error("read_file must be included in tools; it is required by FilesystemMiddleware");
	return enabledTools;
}
function allPathsScopedToRoutes(permissions, backend) {
	if (!CompositeBackend.isInstance(backend)) return false;
	const prefixes = backend.routePrefixes;
	if (prefixes.length === 0) return false;
	return permissions.every((rule) => rule.paths.every((path) => prefixes.some((prefix) => path.startsWith(prefix.endsWith("/") ? prefix : `${prefix}/`))));
}
/**
* Create middleware that provides built-in filesystem tools and optional custom
* prompt guidance.
*
* By default, the middleware registers every built-in filesystem tool listed in
* {@link FILESYSTEM_TOOL_NAMES}. Use {@link FilesystemMiddlewareOptions.tools}
* to narrow that set for read-only, search-only, or otherwise restricted
* agents. The allowlist only controls built-in filesystem tools; custom tools
* from the agent or other middleware are left untouched.
*
* The middleware also filters tools whose backend capabilities are unavailable
* at request time. In particular, `execute` is only visible when the resolved
* backend supports command execution.
*
* @param options Filesystem middleware configuration.
* @returns Agent middleware that contributes filesystem state, tools, prompt
* guidance, permission checks, and large-result eviction.
*
* @example Read-only filesystem middleware
* ```ts
* const middleware = createFilesystemMiddleware({
*   tools: ["read_file", "ls", "glob", "grep"],
* });
* ```
*/
function createFilesystemMiddleware(options = {}) {
	const { backend = (runtime) => new StateBackend(runtime), systemPrompt: customSystemPrompt = null, customToolDescriptions = null, toolTokenLimitBeforeEvict = 2e4, humanMessageTokenLimitBeforeEvict = 5e4, permissions = [], tools: filesystemTools = null } = options;
	const enabledFilesystemTools = normalizeFilesystemTools(filesystemTools);
	const executeToolEnabled = enabledFilesystemTools == null || enabledFilesystemTools.has("execute");
	if (permissions.length > 0) validatePermissionPaths(permissions);
	if (permissions.length > 0 && executeToolEnabled && typeof backend !== "function" && isSandboxBackend(backend) && !allPathsScopedToRoutes(permissions, backend)) throw new Error("Filesystem permissions cannot be used with a backend that supports command execution. Shell commands can access any path, making path-based rules ineffective. Either remove permissions, use a backend without execution support, or use a CompositeBackend with all permission paths scoped to a route prefix.");
	const baseSystemPrompt = customSystemPrompt ?? null;
	const configuredToolNames = enabledFilesystemTools ?? new Set(FILESYSTEM_TOOL_NAMES);
	/**
	* All tools including execute
	* (execute will be filtered at runtime if backend doesn't support it)
	*/
	const allToolsByName = {
		ls: createLsTool(backend, {
			customDescription: customToolDescriptions?.ls,
			permissions
		}),
		read_file: createReadFileTool(backend, {
			customDescription: customToolDescriptions?.read_file,
			toolTokenLimitBeforeEvict,
			permissions
		}),
		write_file: createWriteFileTool(backend, {
			customDescription: customToolDescriptions?.write_file,
			permissions
		}),
		edit_file: createEditFileTool(backend, {
			customDescription: customToolDescriptions?.edit_file,
			permissions
		}),
		glob: createGlobTool(backend, {
			customDescription: customToolDescriptions?.glob,
			permissions
		}),
		grep: createGrepTool(backend, {
			customDescription: customToolDescriptions?.grep,
			permissions,
			includeExecution: configuredToolNames.has("execute") && typeof backend !== "function" && isSandboxBackend(backend)
		}),
		execute: createExecuteTool(backend, {
			customDescription: customToolDescriptions?.execute,
			permissions,
			hasGrep: configuredToolNames.has("grep"),
			hasGlob: configuredToolNames.has("glob")
		})
	};
	const allTools = FILESYSTEM_TOOL_NAMES.filter((name) => enabledFilesystemTools == null || enabledFilesystemTools.has(name)).map((name) => allToolsByName[name]);
	async function processToolMessage(msg, runtime, state, fallbackToolCallId) {
		if (!toolTokenLimitBeforeEvict) return {
			message: msg,
			filesUpdate: null
		};
		if (msg.name && TOOLS_EXCLUDED_FROM_EVICTION.includes(msg.name)) return {
			message: msg,
			filesUpdate: null
		};
		const textContent = stringifyToolContent(msg.content);
		if (textContent.length <= toolTokenLimitBeforeEvict * 4) return {
			message: msg,
			filesUpdate: null
		};
		const resolvedBackend = await resolveBackend(backend, {
			...runtime,
			state
		});
		const evictPath = `/large_tool_results/${sanitizeToolCallId(fallbackToolCallId || msg.tool_call_id)}.txt`;
		const writeResult = await resolvedBackend.write(evictPath, textContent);
		const contentSample = createContentPreview(textContent);
		return {
			message: new ToolMessage({
				content: writeResult.error ? `Tool result too large, but the result could not be saved to the filesystem: ${writeResult.error}` : TOO_LARGE_TOOL_MSG.replace("{tool_call_id}", msg.tool_call_id).replace("{file_path}", evictPath).replace("{content_sample}", contentSample),
				tool_call_id: msg.tool_call_id,
				name: msg.name,
				id: msg.id,
				artifact: msg.artifact,
				status: msg.status,
				metadata: msg.metadata,
				additional_kwargs: msg.additional_kwargs,
				response_metadata: msg.response_metadata
			}),
			filesUpdate: writeResult.error ? null : writeResult.filesUpdate
		};
	}
	return createMiddleware({
		name: "FilesystemMiddleware",
		stateSchema: FilesystemStateSchema,
		tools: allTools,
		async beforeAgent(state) {
			if (!humanMessageTokenLimitBeforeEvict) return;
			const messages = state.messages;
			if (!messages || messages.length === 0) return;
			const last = messages[messages.length - 1];
			if (!HumanMessage.isInstance(last)) return;
			if (last.additional_kwargs?.lc_evicted_to) return;
			const contentStr = extractTextFromMessage(last);
			const threshold = 4 * humanMessageTokenLimitBeforeEvict;
			if (contentStr.length <= threshold) return;
			const resolvedBackend = await resolveBackend(backend, { state: state || {} });
			const filePath = `/conversation_history/${crypto.randomUUID().replace(/-/g, "").slice(0, 12)}`;
			const writeResult = await resolvedBackend.write(filePath, contentStr);
			if (writeResult.error) return;
			const result = { messages: [new HumanMessage({
				content: last.content,
				id: last.id,
				additional_kwargs: {
					...last.additional_kwargs,
					lc_evicted_to: filePath
				},
				response_metadata: { ...last.response_metadata }
			})] };
			if (writeResult.filesUpdate) result.files = writeResult.filesUpdate;
			return result;
		},
		wrapModelCall: async (request, handler) => {
			const supportsExecution = isSandboxBackend(await resolveBackend(backend, {
				...request.runtime,
				state: request.state
			}));
			let tools = request.tools;
			if (!supportsExecution) tools = tools.filter((t) => t.name !== "execute");
			const newSystemMessage = baseSystemPrompt ? request.systemMessage.concat(baseSystemPrompt) : request.systemMessage;
			let messages = request.messages;
			if (humanMessageTokenLimitBeforeEvict && messages) {
				if (messages.some((msg) => HumanMessage.isInstance(msg) && msg.additional_kwargs?.lc_evicted_to)) messages = messages.map((msg) => {
					if (HumanMessage.isInstance(msg) && msg.additional_kwargs?.lc_evicted_to) return buildTruncatedHumanMessage(msg, msg.additional_kwargs.lc_evicted_to);
					return msg;
				});
			}
			return handler({
				...request,
				tools,
				messages,
				systemMessage: newSystemMessage
			});
		},
		wrapToolCall: async (request, handler) => {
			if (!toolTokenLimitBeforeEvict) return handler(request);
			const toolName = request.toolCall?.name;
			if (toolName && TOOLS_EXCLUDED_FROM_EVICTION.includes(toolName)) return handler(request);
			const result = await handler(request);
			if (ToolMessage.isInstance(result)) {
				const processed = await processToolMessage(result, request.runtime, request.state, request.toolCall?.id);
				if (processed.filesUpdate) return new Command({ update: {
					files: processed.filesUpdate,
					messages: [processed.message]
				} });
				return processed.message;
			}
			if (isCommand(result)) {
				const update = result.update;
				if (!update?.messages) return result;
				let hasLargeResults = false;
				const accumulatedFiles = update.files ? { ...update.files } : {};
				const processedMessages = [];
				for (const msg of update.messages) if (ToolMessage.isInstance(msg)) {
					const processed = await processToolMessage(msg, request.runtime, request.state, request.toolCall?.id);
					processedMessages.push(processed.message);
					if (processed.filesUpdate) {
						hasLargeResults = true;
						Object.assign(accumulatedFiles, processed.filesUpdate);
					}
				} else processedMessages.push(msg);
				if (hasLargeResults) return new Command({ update: {
					...update,
					messages: processedMessages,
					files: accumulatedFiles
				} });
			}
			return result;
		}
	});
}
/**
* Config key used by task-tool callers to request dynamic response format.
*
* When set in `config.configurable`, the task tool recompiles the target
* subagent with this response format instead of using the pre-compiled graph.
*/
var SUBAGENT_RESPONSE_FORMAT_CONFIG_KEY = "__deepagents_subagent_response_format";
/**
* Default system prompt for subagents.
* Provides a minimal base prompt that can be extended by specific subagent configurations.
*/
var DEFAULT_SUBAGENT_PROMPT = "In order to complete the objective that the user asks of you, you have access to a number of standard tools.";
/**
* State keys that are excluded when passing state to subagents and when returning
* updates from subagents.
*
* When returning updates:
* 1. The messages key is handled explicitly to ensure only the final message is included
* 2. The todos and structuredResponse keys are excluded as they do not have a defined reducer
*    and no clear meaning for returning them from a subagent to the main agent.
* 3. The skillsMetadata and memoryContents keys are automatically excluded from subagent output
*    to prevent parent state from leaking to child agents. Each agent loads its own skills/memory
*    independently based on its middleware configuration.
*/
var EXCLUDED_STATE_KEYS = [
	"messages",
	"todos",
	"structuredResponse",
	"skillsMetadata",
	"memoryContents"
];
/**
* Default description for the general-purpose subagent.
* This description is shown to the model when selecting which subagent to use.
*/
var DEFAULT_GENERAL_PURPOSE_DESCRIPTION = "General-purpose agent for researching complex questions, searching for files and content, and executing multi-step tasks. When you are searching for a keyword or file and are not confident that you will find the right match in the first few tries use this agent to perform the search for you. This agent has access to all tools as the main agent.";
function getTaskToolDescription(subagentDescriptions) {
	return context`
    Launch an ephemeral subagent to handle a complex, multi-step task in an isolated context window.

    Available agent types and the tools they have access to:
    ${subagentDescriptions.join("\n")}

    Specify subagent_type to select the agent. Usage notes:
    - Launch multiple agents concurrently when their tasks are independent, using a single message with multiple tool calls.
    - Each invocation is stateless: the agent sees only the prompt you give it and returns a single final report. Put full detail in the prompt and state exactly what it should return.
    - The agent's report is not shown to the user; relay a summary yourself.
    - Tell the agent whether to create content, analyze, or only research, since it cannot see the user's intent.
    - If an agent's description says to use it proactively, do so without waiting to be asked.
    - When only general-purpose is available, use it for any complex, context-heavy task; it has the same capabilities as the main agent.
  `;
}
/**
* Base specification for the general-purpose subagent.
*
* This constant provides the default configuration for the general-purpose subagent
* that is automatically included when `generalPurposeAgent: true` (the default).
*
* The general-purpose subagent:
* - Has access to all tools from the main agent
* - Inherits skills from the main agent (when skills are configured)
* - Uses the same model as the main agent (by default)
* - Is ideal for delegating complex, multi-step tasks
*
* You can spread this constant and override specific properties when creating
* custom subagents that should behave similarly to the general-purpose agent:
*
* @example
* ```typescript
* import { GENERAL_PURPOSE_SUBAGENT, createDeepAgent } from "@anthropic/deepagents";
*
* // Use as-is (automatically included with generalPurposeAgent: true)
* const agent = createDeepAgent({ model: "claude-sonnet-4-5-20250929" });
*
* // Or create a custom variant with different tools
* const customGP: SubAgent = {
*   ...GENERAL_PURPOSE_SUBAGENT,
*   name: "research-gp",
*   tools: [webSearchTool, readFileTool],
* };
*
* const agent = createDeepAgent({
*   model: "claude-sonnet-4-5-20250929",
*   subagents: [customGP],
*   // Disable the default general-purpose agent since we're providing our own
*   // (handled automatically when using createSubAgentMiddleware directly)
* });
* ```
*/
var GENERAL_PURPOSE_SUBAGENT = {
	name: "general-purpose",
	description: DEFAULT_GENERAL_PURPOSE_DESCRIPTION,
	systemPrompt: DEFAULT_SUBAGENT_PROMPT
};
/**
* Filter state to exclude certain keys when passing to subagents
*/
function filterStateForSubagent(state) {
	const filtered = {};
	for (const [key, value] of Object.entries(state)) if (!EXCLUDED_STATE_KEYS.includes(key)) filtered[key] = value;
	return filtered;
}
/**
* Invalid tool message block types
*/
var INVALID_TOOL_MESSAGE_BLOCK_TYPES = [
	"tool_use",
	"thinking",
	"redacted_thinking"
];
/**
* Create Command with filtered state update from subagent result
*/
function returnCommandWithStateUpdate(result, toolCallId) {
	const stateUpdate = filterStateForSubagent(result);
	let content;
	if (result.structuredResponse != null) content = JSON.stringify(result.structuredResponse);
	else {
		const messages = result.messages ?? [];
		content = "Task completed";
		for (let i = messages.length - 1; i >= 0; i -= 1) {
			const message = messages[i];
			if (!message || !AIMessage.isInstance(message)) continue;
			const text = typeof message.content === "string" ? message.content.trim() : message.text?.trim() ?? "";
			if (text) {
				content = text;
				break;
			}
		}
	}
	return new Command({ update: {
		...stateUpdate,
		messages: [new ToolMessage({
			content,
			tool_call_id: toolCallId,
			name: "task"
		})]
	} });
}
/**
* Create a runnable agent from a declarative `SubAgent` spec.
*
* This is the shared entrypoint for compiling a `SubAgent` into a
* `ReactAgent`. Pre-compiled `CompiledSubAgent` runnables bypass this
* function entirely.
*
* The spec must have `model` and `tools` set — the caller is responsible
* for coalescing any defaults before calling this function.
*
* @param spec - Declarative subagent specification. Must specify `model` and `tools`.
* @returns A compiled `ReactAgent` ready for task-tool invocation.
*/
function createSubAgent(spec, options) {
	if (!spec.model) throw new Error(`SubAgent '${spec.name}' must specify 'model'`);
	if (!spec.tools) throw new Error(`SubAgent '${spec.name}' must specify 'tools'`);
	const middleware = [...spec.middleware ?? []];
	if (spec.interruptOn) middleware.push(humanInTheLoopMiddleware({ interruptOn: spec.interruptOn }));
	const selectedResponseFormat = options?.responseFormat ?? spec.responseFormat;
	return createAgent({
		model: spec.model,
		systemPrompt: spec.systemPrompt,
		tools: spec.tools,
		middleware,
		name: spec.name,
		...selectedResponseFormat != null && { responseFormat: selectedResponseFormat }
	});
}
/**
* Create subagent instances from specifications.
*
* Returns compiled agents, raw specs keyed by name (for on-demand
* recompilation with dynamic response formats), and descriptions.
*/
function getSubagents(options) {
	const { defaultModel, defaultTools, defaultMiddleware, generalPurposeMiddleware: gpMiddleware, defaultInterruptOn, subagents, generalPurposeAgent } = options;
	const defaultSubagentMiddleware = defaultMiddleware || [];
	const generalPurposeMiddlewareBase = gpMiddleware || defaultSubagentMiddleware;
	const agents = {};
	const specsByName = {};
	const subagentDescriptions = [];
	if (generalPurposeAgent) {
		const generalPurposeMiddleware = [...generalPurposeMiddlewareBase];
		if (defaultInterruptOn) generalPurposeMiddleware.push(humanInTheLoopMiddleware({ interruptOn: defaultInterruptOn }));
		const gpSpec = {
			name: "general-purpose",
			description: DEFAULT_GENERAL_PURPOSE_DESCRIPTION,
			model: defaultModel,
			systemPrompt: DEFAULT_SUBAGENT_PROMPT,
			tools: defaultTools,
			middleware: generalPurposeMiddleware
		};
		agents["general-purpose"] = createSubAgent(gpSpec);
		specsByName["general-purpose"] = gpSpec;
		subagentDescriptions.push(`- general-purpose: ${DEFAULT_GENERAL_PURPOSE_DESCRIPTION}`);
	}
	for (const agentParams of subagents) {
		subagentDescriptions.push(`- ${agentParams.name}: ${agentParams.description}`);
		if ("runnable" in agentParams) {
			agents[agentParams.name] = agentParams.runnable;
			specsByName[agentParams.name] = agentParams;
		} else {
			const resolvedSpec = {
				...agentParams,
				model: agentParams.model ?? defaultModel,
				tools: agentParams.tools ?? defaultTools,
				middleware: [...defaultSubagentMiddleware, ...agentParams.middleware ?? []],
				interruptOn: agentParams.interruptOn ?? defaultInterruptOn ?? void 0
			};
			agents[agentParams.name] = createSubAgent(resolvedSpec);
			specsByName[agentParams.name] = resolvedSpec;
		}
	}
	return {
		agents,
		specsByName,
		descriptions: subagentDescriptions
	};
}
/**
* Create the task tool for invoking subagents
*/
function createTaskTool(options) {
	const { defaultModel, defaultTools, defaultMiddleware, generalPurposeMiddleware, defaultInterruptOn, subagents, generalPurposeAgent, taskDescription } = options;
	const { agents: subagentGraphs, specsByName, descriptions: subagentDescriptions } = getSubagents({
		defaultModel,
		defaultTools,
		defaultMiddleware,
		generalPurposeMiddleware,
		defaultInterruptOn,
		subagents,
		generalPurposeAgent
	});
	function selectSubagent(subagentType, config) {
		const responseFormat = config.configurable?.[SUBAGENT_RESPONSE_FORMAT_CONFIG_KEY];
		if (responseFormat != null) {
			const spec = specsByName[subagentType];
			if ("runnable" in spec) throw new Error(`responseSchema cannot be used with compiled subagent "${spec.name}"; dynamic schemas require a declarative SubAgent spec.`);
			return createSubAgent(spec, { responseFormat });
		}
		return subagentGraphs[subagentType];
	}
	return tool$1(async (input, config) => {
		const { description, subagent_type } = input;
		if (!(subagent_type in subagentGraphs)) {
			const allowedTypes = Object.keys(subagentGraphs).map((k) => `\`${k}\``).join(", ");
			throw new Error(`Error: invoked agent of type ${subagent_type}, the only allowed types are ${allowedTypes}`);
		}
		const subagent = selectSubagent(subagent_type, config);
		const subagentState = filterStateForSubagent(getCurrentTaskInput());
		subagentState.messages = [new HumanMessage({ content: description })];
		const subagentConfig = {
			...config,
			metadata: {
				...config.metadata,
				lc_agent_name: subagent_type
			},
			configurable: {
				...config.configurable,
				ls_agent_type: "subagent"
			}
		};
		const result = await subagent.invoke(subagentState, subagentConfig);
		if (!config.toolCall?.id) {
			if (result.structuredResponse != null) return JSON.stringify(result.structuredResponse);
			const messages = result.messages;
			let content = (messages?.[messages.length - 1])?.content || "Task completed";
			if (Array.isArray(content)) {
				content = content.filter((block) => !INVALID_TOOL_MESSAGE_BLOCK_TYPES.includes(block.type));
				if (content.length === 0) return "Task completed";
				return content.map((block) => "text" in block ? block.text : JSON.stringify(block)).join("\n");
			}
			return content;
		}
		return returnCommandWithStateUpdate(result, config.toolCall.id);
	}, {
		name: "task",
		description: taskDescription ? taskDescription : getTaskToolDescription(subagentDescriptions),
		schema: object({
			description: string().describe("The task to execute with the selected agent"),
			subagent_type: string().describe(`Name of the agent to use. Available: ${Object.keys(subagentGraphs).join(", ")}`)
		})
	});
}
/**
* Create subagent middleware with task tool
*/
function createSubAgentMiddleware(options) {
	const { defaultModel, defaultTools = [], defaultMiddleware = null, generalPurposeMiddleware = null, defaultInterruptOn = null, subagents = [], systemPrompt = null, generalPurposeAgent = true, taskDescription = null } = options;
	return createMiddleware({
		name: "subAgentMiddleware",
		tools: [createTaskTool({
			defaultModel,
			defaultTools,
			defaultMiddleware,
			generalPurposeMiddleware,
			defaultInterruptOn,
			subagents,
			generalPurposeAgent,
			taskDescription
		})],
		wrapModelCall: async (request, handler) => {
			if (systemPrompt !== null) return handler({
				...request,
				systemMessage: request.systemMessage.concat(new SystemMessage({ content: systemPrompt }))
			});
			return handler(request);
		}
	});
}
/**
* Patch tool call / tool response parity in a messages array.
*
* Ensures strict 1:1 correspondence between AIMessage tool_calls and
* ToolMessage responses:
*
* 1. **Dangling tool_calls** — an AIMessage contains a tool_call with no
*    matching ToolMessage anywhere after it. A synthetic cancellation
*    ToolMessage is inserted immediately after the AIMessage.
*
* 2. **Orphaned ToolMessages** — a ToolMessage whose `tool_call_id` does not
*    match any tool_call in a preceding AIMessage. The ToolMessage is removed.
*
* Both directions are required for providers that enforce strict parity
* (e.g. Google Gemini returns 400 INVALID_ARGUMENT otherwise).
*
* @param messages - The messages array to patch
* @returns Object with patched messages and needsPatch flag
*/
function patchDanglingToolCalls(messages) {
	if (!messages || messages.length === 0) return {
		patchedMessages: [],
		needsPatch: false
	};
	const allToolCallIds = /* @__PURE__ */ new Set();
	for (const msg of messages) if (AIMessage.isInstance(msg) && msg.tool_calls != null) {
		for (const tc of msg.tool_calls) if (tc.id) allToolCallIds.add(tc.id);
	}
	const patchedMessages = [];
	let needsPatch = false;
	for (let i = 0; i < messages.length; i++) {
		const msg = messages[i];
		if (ToolMessage.isInstance(msg)) {
			if (!allToolCallIds.has(msg.tool_call_id)) {
				needsPatch = true;
				continue;
			}
		}
		patchedMessages.push(msg);
		if (AIMessage.isInstance(msg) && msg.tool_calls != null) {
			for (const toolCall of msg.tool_calls) if (!messages.slice(i + 1).find((m) => ToolMessage.isInstance(m) && m.tool_call_id === toolCall.id)) {
				needsPatch = true;
				const toolMsg = `Tool call ${toolCall.name} with id ${toolCall.id} was cancelled - another message came in before it could be completed.`;
				patchedMessages.push(new ToolMessage({
					content: toolMsg,
					name: toolCall.name,
					tool_call_id: toolCall.id
				}));
			}
		}
	}
	return {
		patchedMessages,
		needsPatch
	};
}
/**
* Create middleware that enforces strict tool call / tool response parity in
* the messages history.
*
* Two kinds of violations are repaired:
* 1. **Dangling tool_calls** — an AIMessage contains tool_calls with no
*    matching ToolMessage responses. Synthetic cancellation ToolMessages are
*    injected so every tool_call has a response.
* 2. **Orphaned ToolMessages** — a ToolMessage exists whose `tool_call_id`
*    does not match any tool_call in a preceding AIMessage. These are removed.
*
* This is critical for providers like Google Gemini that reject requests with
* mismatched function call / function response counts (400 INVALID_ARGUMENT).
*
* This middleware patches in two places:
* 1. `beforeAgent`: Patches state at the start of the agent loop (handles most cases)
* 2. `wrapModelCall`: Patches the request right before model invocation (handles
*    edge cases like HITL rejection during graph resume where state updates from
*    beforeAgent may not be applied in time)
*
* @returns AgentMiddleware that enforces tool call / response parity
*
* @example
* ```typescript
* import { createAgent } from "langchain";
* import { createPatchToolCallsMiddleware } from "./middleware/patch_tool_calls";
*
* const agent = createAgent({
*   model: "claude-sonnet-4-5-20250929",
*   middleware: [createPatchToolCallsMiddleware()],
* });
* ```
*/
function createPatchToolCallsMiddleware() {
	return createMiddleware({
		name: "patchToolCallsMiddleware",
		beforeAgent: async (state) => {
			const messages = state.messages;
			if (!messages || messages.length === 0) return;
			const { patchedMessages, needsPatch } = patchDanglingToolCalls(messages);
			/**
			* Only trigger REMOVE_ALL_MESSAGES if patching is actually needed
			*/
			if (!needsPatch) return;
			return { messages: [new RemoveMessage({ id: REMOVE_ALL_MESSAGES }), ...patchedMessages] };
		},
		/**
		* Also patch in wrapModelCall as a safety net.
		* This handles edge cases where:
		* - HITL rejects a tool call during graph resume
		* - The state update from beforeAgent might not be applied in time
		* - The model would otherwise receive dangling tool_call_ids
		*/
		wrapModelCall: async (request, handler) => {
			const messages = request.messages;
			if (!messages || messages.length === 0) return handler(request);
			const { patchedMessages, needsPatch } = patchDanglingToolCalls(messages);
			if (!needsPatch) return handler(request);
			return handler({
				...request,
				messages: patchedMessages
			});
		}
	});
}
/**
* Shared state values for use in StateSchema definitions.
*
* This module provides pre-configured ReducedValue instances that can be
* reused across different state schemas, similar to LangGraph's messagesValue.
*/
/**
* Shared ReducedValue for file data state management.
*
* This provides a reusable pattern for managing file state with automatic
* merging of concurrent updates from parallel subagents. Files can be updated
* or deleted (using null values) and the reducer handles the merge logic.
*
* Similar to LangGraph's messagesValue, this encapsulates the common pattern
* of managing files in agent state so you don't have to manually configure
* the ReducedValue each time.
*
* @example
* ```typescript
* import { filesValue } from "@anthropic/deepagents";
* import { StateSchema } from "@langchain/langgraph";
*
* const MyStateSchema = new StateSchema({
*   files: filesValue,
*   // ... other state fields
* });
* ```
*/
var filesValue = new ReducedValue(record(string(), FileDataSchema).default(() => ({})), {
	inputSchema: record(string(), FileDataSchema.nullable()).optional(),
	reducer: fileDataReducer
});
/**
* Detect whether a model is an Anthropic model.
*
* Used to gate Anthropic-specific prompt caching optimizations
* (cache_control breakpoints).
*
* Accepts the wider `RunnableInterface` shape (the type of `request.model`
* inside `wrapModelCall`, aliased as `AgentLanguageModelLike` in langchain)
* because the function only depends on `.getName()`, which is part of the
* Runnable contract. `BaseLanguageModel` extends `Runnable`, so existing
* call sites still type-check.
*/
function isAnthropicModel(model) {
	if (typeof model === "string") {
		if (model.includes(":")) return model.split(":")[0] === "anthropic";
		return model.startsWith("claude");
	}
	if (model.getName() === "ConfigurableModel") return model._defaultConfig?.modelProvider === "anthropic";
	return model.getName() === "ChatAnthropic";
}
/**
* Detect whether a model is an AWS Bedrock Converse model.
*
* Accepts the wider `RunnableInterface` shape (the type of `request.model`
* inside `wrapModelCall`, aliased as `AgentLanguageModelLike` in langchain)
* because the function only depends on `.getName()`, which is part of the
* Runnable contract. `BaseLanguageModel` extends `Runnable`, so existing
* call sites still type-check.
*/
function isBedrockConverseModel(model) {
	if (typeof model === "string") {
		const colonIdx = model.indexOf(":");
		if (colonIdx !== -1) {
			const prefix = model.slice(0, colonIdx);
			if (prefix === "bedrock" || prefix === "aws") return true;
		}
		return model.startsWith("amazon.");
	}
	if (model.getName() === "ConfigurableModel") {
		const provider = model._defaultConfig?.modelProvider;
		return provider === "bedrock" || provider === "aws";
	}
	return model.getName() === "ChatBedrockConverse";
}
/**
* Extract the provider name from a model instance for profile lookup.
*
* Checks `_defaultConfig.modelProvider` (ConfigurableModel) and falls
* back to known model class name → provider mappings.
*
* @internal
*/
function getModelProvider(model) {
	if (model.getName() === "ConfigurableModel") return model._defaultConfig?.modelProvider;
	return {
		ChatAnthropic: "anthropic",
		ChatOpenAI: "openai",
		ChatGoogleGenerativeAI: "google"
	}[model.getName()];
}
/**
* Extract the model identifier from a model instance for profile
* lookup.
*
* Checks `_defaultConfig.model`, `model_name`, and `modelName` in
* that order.
*
* @internal
*/
function getModelIdentifier(model) {
	return (model.getName() === "ConfigurableModel" ? model._defaultConfig : void 0)?.model ?? model.model_name ?? model.modelName ?? void 0;
}
/**
* Middleware for loading agent memory/context from AGENTS.md files.
*
* This module implements support for the AGENTS.md specification (https://agents.md/),
* loading memory/context from configurable sources and injecting into the system prompt.
*
* ## Overview
*
* AGENTS.md files provide project-specific context and instructions to help AI agents
* work effectively. Unlike skills (which are on-demand workflows), memory is always
* loaded and provides persistent context.
*
* ## Usage
*
* ```typescript
* import { createMemoryMiddleware } from "@anthropic/deepagents";
* import { FilesystemBackend } from "@anthropic/deepagents";
*
* // Security: FilesystemBackend allows reading/writing from the entire filesystem.
* // Either ensure the agent is running within a sandbox OR add human-in-the-loop (HIL)
* // approval to file operations.
* const backend = new FilesystemBackend({ rootDir: "/" });
*
* const middleware = createMemoryMiddleware({
*   backend,
*   sources: [
*     "~/.deepagents/AGENTS.md",
*     "./.deepagents/AGENTS.md",
*   ],
* });
*
* const agent = createDeepAgent({ middleware: [middleware] });
* ```
*
* ## Memory Sources
*
* Sources are simply paths to AGENTS.md files that are loaded in order and combined.
* Multiple sources are concatenated in order, with all content included.
* Later sources appear after earlier ones in the combined prompt.
*
* ## File Format
*
* AGENTS.md files are standard Markdown with no required structure.
* Common sections include:
* - Project overview
* - Build/test commands
* - Code style guidelines
* - Architecture notes
*/
/**
* State schema for memory middleware.
*/
var MemoryStateSchema = new StateSchema({
	/**
	* Dict mapping source paths to their loaded content.
	* Marked as private so it's not included in the final agent state.
	*/
	memoryContents: record(string(), string()).optional(),
	files: filesValue
});
/**
* Default system prompt template for memory.
* Ported from Python's comprehensive memory guidelines.
*/
var MEMORY_SYSTEM_PROMPT = context`
  <agent_memory>
  {memory_contents}
  </agent_memory>

  <memory_guidelines>
      The above <agent_memory> was loaded in from files in your filesystem. As you learn from your interactions with the user, you can save new knowledge by calling the \`edit_file\` tool.

      **Learning from feedback:**
      - One of your MAIN PRIORITIES is to learn from your interactions with the user. These learnings can be implicit or explicit. This means that in the future, you will remember this important information.
      - When you need to remember something, updating memory must be your FIRST, IMMEDIATE action - before responding to the user, before calling other tools, before doing anything else. Just update memory immediately.
      - When user says something is better/worse, capture WHY and encode it as a pattern.
      - Each correction is a chance to improve permanently - don't just fix the immediate issue, update your instructions.
      - A great opportunity to update your memories is when the user interrupts a tool call and provides feedback. You should update your memories immediately before revising the tool call.
      - Look for the underlying principle behind corrections, not just the specific mistake.
      - The user might not explicitly ask you to remember something, but if they provide information that is useful for future use, you should update your memories immediately.

      **Asking for information:**
      - If you lack context to perform an action (e.g. send a Slack DM, requires a user ID/email) you should explicitly ask the user for this information.
      - It is preferred for you to ask for information, don't assume anything that you do not know!
      - When the user provides information that is useful for future use, you should update your memories immediately.

      **When to update memories:**
      - When the user explicitly asks you to remember something (e.g., "remember my email", "save this preference")
      - When the user describes your role or how you should behave (e.g., "you are a web researcher", "always do X")
      - When the user gives feedback on your work - capture what was wrong and how to improve
      - When the user provides information required for tool use (e.g., slack channel ID, email addresses)
      - When the user provides context useful for future tasks, such as how to use tools, or which actions to take in a particular situation
      - When you discover new patterns or preferences (coding styles, conventions, workflows)

      **When to NOT update memories:**
      - When the information is temporary or transient (e.g., "I'm running late", "I'm on my phone right now")
      - When the information is a one-time task request (e.g., "Find me a recipe", "What's 25 * 4?")
      - When the information is a simple question that doesn't reveal lasting preferences (e.g., "What day is it?", "Can you explain X?")
      - When the information is an acknowledgment or small talk (e.g., "Sounds good!", "Hello", "Thanks for that")
      - When the information is stale or irrelevant in future conversations
      - Never store API keys, access tokens, passwords, or any other credentials in any file, memory, or system prompt.
      - If the user asks where to put API keys or provides an API key, do NOT echo or save it.

      **Examples:**
      Example 1 (remembering user information):
      User: Can you connect to my google account?
      Agent: Sure, I'll connect to your google account, what's your google account email?
      User: john@example.com
      Agent: Let me save this to my memory.
      Tool Call: edit_file(...) -> remembers that the user's google account email is john@example.com

      Example 2 (remembering implicit user preferences):
      User: Can you write me an example for creating a deep agent in LangChain?
      Agent: Sure, I'll write you an example for creating a deep agent in LangChain <example code in Python>
      User: Can you do this in JavaScript
      Agent: Let me save this to my memory.
      Tool Call: edit_file(...) -> remembers that the user prefers to get LangChain code examples in JavaScript
      Agent: Sure, here is the JavaScript example<example code in JavaScript>

      Example 3 (do not remember transient information):
      User: I'm going to play basketball tonight so I will be offline for a few hours.
      Agent: Okay I'll add a block to your calendar.
      Tool Call: create_calendar_event(...) -> just calls a tool, does not commit anything to memory, as it is transient information
  </memory_guidelines>
`;
/**
* Format loaded memory contents for injection into prompt.
* Pairs memory locations with their contents for clarity.
*/
function formatMemoryContents(contents, sources) {
	if (Object.keys(contents).length === 0) return "(No memory loaded)";
	const sections = [];
	for (const path of sources) if (contents[path]) sections.push(`${path}\n${contents[path]}`);
	if (sections.length === 0) return "(No memory loaded)";
	return sections.join("\n\n");
}
/**
* Load memory content from a backend path.
*
* @param backend - Backend to load from.
* @param path - Path to the AGENTS.md file.
* @returns File content if found, null otherwise.
*/
async function loadMemoryFromBackend(backend, path) {
	const adaptedBackend = adaptBackendProtocol(backend);
	if (!adaptedBackend.downloadFiles) {
		const content = await adaptedBackend.read(path);
		if (content.error) return null;
		if (typeof content.content !== "string") return null;
		return content.content;
	}
	const results = await adaptedBackend.downloadFiles([path]);
	if (results.length !== 1) throw new Error(`Expected 1 response for path ${path}, got ${results.length}`);
	const response = results[0];
	if (response.error != null) {
		if (response.error === "file_not_found") return null;
		throw new Error(`Failed to download ${path}: ${response.error}`);
	}
	if (response.content != null) return new TextDecoder().decode(response.content);
	return null;
}
/**
* Create middleware for loading agent memory from AGENTS.md files.
*
* Loads memory content from configured sources and injects into the system prompt.
* Supports multiple sources that are combined together.
*
* @param options - Configuration options
* @returns AgentMiddleware for memory loading and injection
*
* @example
* ```typescript
* const middleware = createMemoryMiddleware({
*   backend: new FilesystemBackend({ rootDir: "/" }),
*   sources: [
*     "~/.deepagents/AGENTS.md",
*     "./.deepagents/AGENTS.md",
*   ],
* });
* ```
*/
function createMemoryMiddleware(options) {
	const { backend, sources, addCacheControl = false } = options;
	return createMiddleware({
		name: "MemoryMiddleware",
		stateSchema: MemoryStateSchema,
		async beforeAgent(state) {
			if ("memoryContents" in state && state.memoryContents != null) return;
			const resolvedBackend = await resolveBackend(backend, { state });
			const contents = {};
			for (const path of sources) try {
				const content = await loadMemoryFromBackend(resolvedBackend, path);
				if (content) contents[path] = content;
			} catch (error) {
				console.debug(`Failed to load memory from ${path}:`, error);
			}
			return { memoryContents: contents };
		},
		wrapModelCall(request, handler) {
			const formattedContents = formatMemoryContents(request.state?.memoryContents || {}, sources);
			const memorySection = MEMORY_SYSTEM_PROMPT.replace("{memory_contents}", formattedContents);
			const existingContent = request.systemMessage.content;
			const existingBlocks = typeof existingContent === "string" ? [{
				type: "text",
				text: existingContent
			}] : Array.isArray(existingContent) ? existingContent : [];
			const writeCacheControl = addCacheControl && isAnthropicModel(request.model);
			const newSystemMessage = new SystemMessage({ content: [...existingBlocks, {
				type: "text",
				text: memorySection,
				...writeCacheControl && { cache_control: { type: "ephemeral" } }
			}] });
			return handler({
				...request,
				systemMessage: newSystemMessage
			});
		}
	});
}
var DEFAULT_SKILL_READ_LINE_LIMIT = 1e3;
var MAX_SKILL_DESCRIPTION_LENGTH = 1024;
/**
* File extensions a skill module entrypoint may use.
*/
var SKILL_MODULE_EXTENSIONS = [
	".js",
	".mjs",
	".cjs",
	".ts",
	".mts",
	".cts",
	".jsx",
	".tsx"
];
/**
* Zod schema for a single skill metadata entry.
*/
var SkillMetadataEntrySchema = object({
	name: string(),
	description: string(),
	path: string(),
	license: string().nullable().optional(),
	compatibility: string().nullable().optional(),
	metadata: record(string(), string()).optional(),
	allowedTools: array(string()).optional(),
	module: string().optional()
});
/**
* Reducer for skillsMetadata that merges arrays from parallel subagents.
* Skills are deduplicated by name, with later values overriding earlier ones.
*
* @param current - The current skillsMetadata array (from state)
* @param update - The new skillsMetadata array (from a subagent update)
* @returns Merged array with duplicates resolved by name (later values win)
*/
function skillsMetadataReducer(current, update) {
	if (!update || update.length === 0) return current || [];
	if (!current || current.length === 0) return update;
	const merged = /* @__PURE__ */ new Map();
	for (const skill of current) merged.set(skill.name, skill);
	for (const skill of update) merged.set(skill.name, skill);
	return Array.from(merged.values());
}
/**
* State schema for skills middleware.
* Uses ReducedValue for skillsMetadata to allow concurrent updates from parallel subagents.
*/
var SkillsStateSchema = new StateSchema({
	skillsMetadata: new ReducedValue(array(SkillMetadataEntrySchema).default(() => []), {
		inputSchema: array(SkillMetadataEntrySchema).optional(),
		reducer: skillsMetadataReducer
	}),
	files: filesValue
});
/**
* Skills System Documentation prompt template.
*/
var SKILLS_SYSTEM_PROMPT = context`
  ## Skills System

  You have access to a skills library that provides specialized capabilities and domain knowledge.

  {skills_locations}

  **Available Skills:**

  {skills_list}

  **How to Use Skills (Progressive Disclosure):**

  Skills follow a **progressive disclosure** pattern - you know they exist (name + description above), but you only read the full instructions when needed:

  1. **Recognize when a skill applies**: Check if the user's task matches any skill's description
  2. **Read the skill's full instructions**: Use \`read_file\` on the path shown in the skill list above.
     Pass \`limit=${DEFAULT_SKILL_READ_LINE_LIMIT}\` since the default of ${100} lines is too small for most skill files.
  3. **Follow the skill's instructions**: SKILL.md contains step-by-step workflows, best practices, and examples
  4. **Access supporting files**: Skills may include scripts, configs, or reference docs - use absolute paths

  **When to Use Skills:**
  - When the user's request matches a skill's domain (e.g., "research X" → web-research skill)
  - When you need specialized knowledge or structured workflows
  - When a skill provides proven patterns for complex tasks
  **Skills are Self-Documenting:**
  - Each SKILL.md tells you exactly what the skill does and how to use it
  - The skill list above shows the full path for each skill's SKILL.md file

  **Executing Skill Scripts:**
  Skills may contain scripts or other executable files. Always use absolute paths from the skill list.

  **Example Workflow:**

  User: "Can you research the latest developments in quantum computing?"

  1. Check available skills above → See "web-research" skill with its full path
  2. Read the full skill file: \`read_file(file_path, limit=${DEFAULT_SKILL_READ_LINE_LIMIT})\`
  3. Follow the skill's research workflow (search → organize → synthesize)
  4. Use any helper scripts with absolute paths

  Remember: Skills are tools to make you more capable and consistent. When in doubt, check if a skill exists for the task!
`;
/**
* Validate skill name per Agent Skills specification.
*
* Constraints per Agent Skills specification:
*
* - 1-64 characters
* - Unicode lowercase alphanumeric and hyphens only (`a-z` and `-`).
* - Must not start or end with `-`
* - Must not contain consecutive `--`
* - Must match the parent directory name containing the `SKILL.md` file
*
* Unicode lowercase alphanumeric means any lowercase or decimal digit, which
* covers accented Latin characters (e.g., `'café'`, `'über-tool'`) and other
* scripts.
*
* @param name - The skill name from YAML frontmatter
* @param directoryName - The parent directory name
* @returns `{ valid, error }` tuple. Error is empty string if valid.
*/
function validateSkillName(name, directoryName) {
	if (!name) return {
		valid: false,
		error: "name is required"
	};
	if (name.length > 64) return {
		valid: false,
		error: "name exceeds 64 characters"
	};
	if (name.startsWith("-") || name.endsWith("-") || name.includes("--")) return {
		valid: false,
		error: "name must be lowercase alphanumeric with single hyphens only"
	};
	for (const c of name) {
		if (c === "-") continue;
		if (/\p{Ll}/u.test(c) || /\p{Nd}/u.test(c)) continue;
		return {
			valid: false,
			error: "name must be lowercase alphanumeric with single hyphens only"
		};
	}
	if (name !== directoryName) return {
		valid: false,
		error: `name '${name}' must match directory name '${directoryName}'`
	};
	return {
		valid: true,
		error: ""
	};
}
/**
* Validate and normalize the metadata field from YAML frontmatter.
*
* YAML parsing can return any type for the `metadata` key. This ensures the
* value in {@link SkillMetadata} is always a `Record<string, string>` by
* coercing via `String()` and rejecting non-object inputs.
*
* @param raw - Raw value from `frontmatterData.metadata`.
* @param skillPath - Path to the `SKILL.md` file (for warning messages).
* @returns A validated `Record<string, string>`.
*/
function validateMetadata(raw, skillPath) {
	if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
		if (raw) console.warn(`Ignoring non-object metadata in ${skillPath} (got ${typeof raw})`);
		return {};
	}
	const result = {};
	for (const [k, v] of Object.entries(raw)) result[String(k)] = String(v);
	return result;
}
/**
* Build a parenthetical annotation string from optional skill fields.
*
* Combines license and compatibility into a comma-separated string for
* display in the system prompt skill listing.
*
* @param skill - Skill metadata to extract annotations from.
* @returns Annotation string like `'License: MIT, Compatibility: Python 3.10+'`,
*   or empty string if neither field is set.
*/
function formatSkillAnnotations(skill) {
	const parts = [];
	if (skill.license) parts.push(`License: ${skill.license}`);
	if (skill.compatibility) parts.push(`Compatibility: ${skill.compatibility}`);
	return parts.join(", ");
}
/**
* Parse YAML frontmatter from `SKILL.md` content.
*
* Extracts metadata per Agent Skills specification from YAML frontmatter
* delimited by `---` markers at the start of the content.
*
* @param content - Content of the `SKILL.md` file
* @param skillPath - Path to the `SKILL.md` file (for error messages and metadata)
* @param directoryName - Name of the parent directory containing the skill
* @returns `SkillMetadata` if parsing succeeds, `null` if parsing fails or
*   validation errors occur
*/
function parseSkillMetadataFromContent(content, skillPath, directoryName) {
	if (content.length > 10485760) {
		console.warn(`Skipping ${skillPath}: content too large (${content.length} bytes)`);
		return null;
	}
	const match = content.match(/^---\s*\n([\s\S]*?)\n---\s*\n/);
	if (!match) {
		console.warn(`Skipping ${skillPath}: no valid YAML frontmatter found`);
		return null;
	}
	const frontmatterStr = match[1];
	let frontmatterData;
	try {
		frontmatterData = import_dist.parse(frontmatterStr);
	} catch (e) {
		console.warn(`Invalid YAML in ${skillPath}:`, e);
		return null;
	}
	if (!frontmatterData || typeof frontmatterData !== "object") {
		console.warn(`Skipping ${skillPath}: frontmatter is not a mapping`);
		return null;
	}
	const name = String(frontmatterData.name ?? "").trim();
	const description = String(frontmatterData.description ?? "").trim();
	if (!name || !description) {
		console.warn(`Skipping ${skillPath}: missing required 'name' or 'description'`);
		return null;
	}
	const validation = validateSkillName(name, directoryName);
	if (!validation.valid) console.warn(`Skill '${name}' in ${skillPath} does not follow Agent Skills specification: ${validation.error}. Consider renaming for spec compliance.`);
	let descriptionStr = description;
	if (descriptionStr.length > 1024) {
		console.warn(`Description exceeds ${MAX_SKILL_DESCRIPTION_LENGTH} characters in ${skillPath}, truncating`);
		descriptionStr = descriptionStr.slice(0, MAX_SKILL_DESCRIPTION_LENGTH);
	}
	const rawTools = frontmatterData["allowed-tools"];
	let allowedTools;
	if (rawTools) if (Array.isArray(rawTools)) allowedTools = rawTools.map((t) => String(t).trim()).filter(Boolean);
	else allowedTools = String(rawTools).split(/\s+/).filter(Boolean);
	else allowedTools = [];
	let compatibilityStr = String(frontmatterData.compatibility ?? "").trim() || null;
	if (compatibilityStr && compatibilityStr.length > 500) {
		console.warn(`Compatibility exceeds 500 characters in ${skillPath}, truncating`);
		compatibilityStr = compatibilityStr.slice(0, 500);
	}
	return {
		name,
		description: descriptionStr,
		path: skillPath,
		metadata: validateMetadata(frontmatterData.metadata ?? {}, skillPath),
		license: String(frontmatterData.license ?? "").trim() || null,
		compatibility: compatibilityStr,
		allowedTools,
		module: validateModulePath(frontmatterData.module)
	};
}
/**
* Read a single file from the backend, returning its content as a string or
* null if the file does not exist or cannot be read.
*/
async function readFileFromBackend(backend, filePath) {
	if (backend.downloadFiles) {
		const results = await backend.downloadFiles([filePath]);
		if (results.length !== 1) return null;
		const response = results[0];
		if (response.error != null || response.content == null) return null;
		return new TextDecoder().decode(response.content);
	}
	const readResult = await backend.read(filePath);
	if (readResult.error) return null;
	if (typeof readResult.content !== "string") return null;
	return readResult.content;
}
/**
* List all skills from a backend source.
*
* Supports two source formats:
*
* - **Parent directory** (e.g. `"/skills/"`): the directory is scanned for
*   subdirectories, each of which must contain a `SKILL.md` file. This is the
*   standard pattern for hosting a collection of skills in one place.
*
* - **Direct skill path** (e.g. `"/skills/my-skill/"`): the path points to a
*   single skill directory that contains `SKILL.md` directly. Detected
*   automatically when the directory listing includes a `SKILL.md` file entry.
*/
async function listSkillsFromBackend(backend, sourcePath) {
	const adaptedBackend = adaptBackendProtocol(backend);
	const skills = [];
	const pathSep = sourcePath.includes("\\") ? "\\" : "/";
	const normalizedPath = sourcePath.endsWith("/") || sourcePath.endsWith("\\") ? sourcePath : `${sourcePath}${pathSep}`;
	let fileInfos;
	try {
		const lsResult = await adaptedBackend.ls(normalizedPath);
		if (lsResult.error || !lsResult.files) return [];
		fileInfos = lsResult.files;
	} catch {
		return [];
	}
	const entries = fileInfos.map((info) => ({
		name: info.path.replace(/[/\\]$/, "").split(/[/\\]/).pop() || "",
		type: info.is_dir ? "directory" : "file"
	}));
	if (entries.some((e) => e.type === "file" && e.name === "SKILL.md")) {
		const directoryName = normalizedPath.replace(/[/\\]$/, "").split(/[/\\]/).pop() || "";
		const skillMdPath = `${normalizedPath}SKILL.md`;
		const content = await readFileFromBackend(adaptedBackend, skillMdPath);
		if (content !== null) {
			const metadata = parseSkillMetadataFromContent(content, skillMdPath, directoryName);
			if (metadata) skills.push(metadata);
		}
		return skills;
	}
	for (const entry of entries) {
		if (entry.type !== "directory") continue;
		const skillMdPath = `${normalizedPath}${entry.name}${pathSep}SKILL.md`;
		const content = await readFileFromBackend(adaptedBackend, skillMdPath);
		if (content === null) continue;
		const metadata = parseSkillMetadataFromContent(content, skillMdPath, entry.name);
		if (metadata) skills.push(metadata);
	}
	return skills;
}
/**
* Format skills locations for display in system prompt.
* Shows priority indicator for the last source (highest priority).
*/
function formatSkillsLocations(sources) {
	if (sources.length === 0) return "**Skills Sources:** None configured";
	const lines = [];
	for (let i = 0; i < sources.length; i++) {
		const sourcePath = sources[i];
		const name = sourcePath.replace(/[/\\]$/, "").split(/[/\\]/).filter(Boolean).pop()?.replace(/^./, (c) => c.toUpperCase()) || "Skills";
		const suffix = i === sources.length - 1 ? " (higher priority)" : "";
		lines.push(`**${name} Skills**: \`${sourcePath}\`${suffix}`);
	}
	return lines.join("\n");
}
/**
* Format skills metadata for display in system prompt.
* Shows allowed tools for each skill if specified.
*/
function formatSkillsList(skills, sources) {
	if (skills.length === 0) return `(No skills available yet. You can create skills in ${sources.map((s) => `\`${s}\``).join(" or ")})`;
	const lines = [];
	for (const skill of skills) {
		const annotations = formatSkillAnnotations(skill);
		let descLine = `- **${skill.name}**: ${skill.description}`;
		if (annotations) descLine += ` (${annotations})`;
		lines.push(descLine);
		if (skill.allowedTools && skill.allowedTools.length > 0) lines.push(`  → Allowed tools: ${skill.allowedTools.join(", ")}`);
		lines.push(`  → Read \`${skill.path}\` for full instructions`);
		if (skill.module !== void 0) lines.push(`  → Import: \`await import("@/skills/${skill.name}")\``);
	}
	return lines.join("\n");
}
/**
* Returns true when `value` ends with a recognized skill module extension.
*/
function endsWithModuleExtension(value) {
	for (const ext of SKILL_MODULE_EXTENSIONS) if (value.endsWith(ext)) return true;
	return false;
}
/**
* Validate and normalize the `module` frontmatter key from a `SKILL.md`.
*
* Returns the normalized path (e.g. `"index.ts"`, `"lib/entry.js"`) or
* `undefined` when the key is absent, empty, non-string, absolute, contains
* path traversal, or uses an unsupported extension. Invalid values silently
* degrade the skill to prose-only.
*/
function validateModulePath(raw) {
	if (raw === null || raw === void 0) return;
	if (typeof raw !== "string") return;
	const stripped = raw.trim();
	if (stripped === "") return;
	const normalized = stripped.startsWith("./") ? stripped.slice(2) : stripped;
	if (normalized.startsWith("/")) return;
	if (normalized === ".." || normalized.startsWith("../") || normalized.includes("/../") || normalized.endsWith("/..")) return;
	if (normalized.endsWith(".d.ts") || normalized.endsWith(".d.mts") || normalized.endsWith(".d.cts")) return;
	if (!endsWithModuleExtension(normalized)) return;
	return normalized;
}
/**
* Create backend-agnostic middleware for loading and exposing agent skills.
*
* This middleware loads skills from configurable backend sources and injects
* skill metadata into the system prompt. It implements the progressive disclosure
* pattern: skill names and descriptions are shown in the prompt, but the agent
* reads full SKILL.md content only when needed.
*
* @param options - Configuration options
* @returns AgentMiddleware for skills loading and injection
*
* @example
* ```typescript
* const middleware = createSkillsMiddleware({
*   backend: new FilesystemBackend({ rootDir: "/" }),
*   sources: ["/skills/user/", "/skills/project/"],
* });
* ```
*/
function createSkillsMiddleware(options) {
	const { backend, sources } = options;
	let loadedSkills = [];
	return createMiddleware({
		name: "SkillsMiddleware",
		stateSchema: SkillsStateSchema,
		async beforeAgent(state) {
			const stateHasSkills = "skillsMetadata" in state && Array.isArray(state.skillsMetadata) && state.skillsMetadata.length > 0;
			if (loadedSkills.length > 0) return stateHasSkills ? void 0 : { skillsMetadata: loadedSkills };
			if (stateHasSkills) {
				loadedSkills = state.skillsMetadata;
				return;
			}
			const resolvedBackend = await resolveBackend(backend, { state });
			const allSkills = /* @__PURE__ */ new Map();
			for (const sourcePath of sources) try {
				const skills = await listSkillsFromBackend(resolvedBackend, sourcePath);
				for (const skill of skills) allSkills.set(skill.name, skill);
			} catch (error) {
				console.debug(`[BackendSkillsMiddleware] Failed to load skills from ${sourcePath}:`, error);
			}
			loadedSkills = Array.from(allSkills.values());
			return { skillsMetadata: loadedSkills };
		},
		wrapModelCall(request, handler) {
			const skillsMetadata = loadedSkills.length > 0 ? loadedSkills : request.state?.skillsMetadata || [];
			const skillsLocations = formatSkillsLocations(sources);
			const skillsList = formatSkillsList(skillsMetadata, sources);
			const skillsSection = SKILLS_SYSTEM_PROMPT.replace("{skills_locations}", skillsLocations).replace("{skills_list}", skillsList);
			const newSystemMessage = request.systemMessage.concat(skillsSection);
			return handler({
				...request,
				systemMessage: newSystemMessage
			});
		}
	});
}
/**
* Merge custom middleware into an assembled stack by `.name`.
*
* Matching custom middleware replaces the existing entry in place. New
* middleware is appended after the base stack in caller-provided order.
*/
function mergeMiddleware$1(base, custom) {
	const merged = new Map(base.map((middleware) => [middleware.name, middleware]));
	for (const middleware of custom) merged.set(middleware.name, middleware);
	return [...merged.values()];
}
function middlewareNames(middleware) {
	return new Set(middleware.map((entry) => entry.name));
}
function matchingMiddleware(middleware, names) {
	return middleware.filter((entry) => names.has(entry.name));
}
/**
* Merge custom middleware into default and tail middleware segments.
*
* Same-name custom entries replace matching defaults in either segment. Novel
* custom entries are inserted between the default and tail segments unless
* `appendNew` is false.
*/
function mergeMiddlewareStack(defaultMiddleware, customMiddleware, tailMiddleware = [], options = {}) {
	const defaultMiddlewareNames = middlewareNames(defaultMiddleware);
	const tailMiddlewareNames = middlewareNames(tailMiddleware);
	const knownMiddlewareNames = /* @__PURE__ */ new Set([...defaultMiddlewareNames, ...tailMiddlewareNames]);
	const novelMiddleware = options.appendNew === false ? [] : customMiddleware.filter((entry) => !knownMiddlewareNames.has(entry.name));
	return [
		...mergeMiddleware$1(defaultMiddleware, matchingMiddleware(customMiddleware, defaultMiddlewareNames)),
		...novelMiddleware,
		...mergeMiddleware$1(tailMiddleware, matchingMiddleware(customMiddleware, tailMiddlewareNames))
	];
}
object({ 
/** The callback thread ID. Used to address the notification. */
["callbackThreadId"]: string().optional() });
/**
* Summarization middleware with backend support for conversation history offloading.
*
* This module extends the base LangChain summarization middleware with additional
* backend-based features for persisting conversation history before summarization.
*
* ## Usage
*
* ```typescript
* import { createSummarizationMiddleware } from "@anthropic/deepagents";
* import { FilesystemBackend } from "@anthropic/deepagents";
*
* const backend = new FilesystemBackend({ rootDir: "/data" });
*
* const middleware = createSummarizationMiddleware({
*   model: "gpt-4o-mini",
*   backend,
*   trigger: { type: "fraction", value: 0.85 },
*   keep: { type: "fraction", value: 0.10 },
* });
*
* const agent = createDeepAgent({ middleware: [middleware] });
* ```
*
* ## Storage
*
* Offloaded messages are stored as markdown at `/conversation_history/{thread_id}.md`.
*
* Each summarization event appends a new section to this file, creating a running log
* of all evicted messages.
*
* ## Relationship to LangChain Summarization Middleware
*
* The base `summarizationMiddleware` from `langchain` provides core summarization
* functionality. This middleware adds:
* - Backend-based conversation history offloading
* - Tool argument truncation for old messages
*
* For simple use cases without backend offloading, use `summarizationMiddleware`
* from `langchain` directly.
*/
var DEFAULT_MESSAGES_TO_KEEP = 20;
var DEFAULT_TRIM_TOKEN_LIMIT = 4e3;
var FALLBACK_TRIGGER = {
	type: "tokens",
	value: 17e4
};
var FALLBACK_KEEP = {
	type: "messages",
	value: 6
};
var FALLBACK_TRUNCATE_ARGS = {
	trigger: {
		type: "messages",
		value: 20
	},
	keep: {
		type: "messages",
		value: 20
	}
};
var PROFILE_TRIGGER = {
	type: "fraction",
	value: .85
};
var PROFILE_KEEP = {
	type: "fraction",
	value: .1
};
var PROFILE_TRUNCATE_ARGS = {
	trigger: {
		type: "fraction",
		value: .85
	},
	keep: {
		type: "fraction",
		value: .1
	}
};
/**
* Compute summarization defaults based on model profile.
* Mirrors Python's `_compute_summarization_defaults`.
*
* If the model has a profile with `maxInputTokens`, uses fraction-based
* settings. Otherwise, uses fixed token/message counts.
*
* @param resolvedModel - The resolved chat model instance.
*/
function computeSummarizationDefaults(resolvedModel) {
	if (resolvedModel.profile && typeof resolvedModel.profile === "object" && "maxInputTokens" in resolvedModel.profile && typeof resolvedModel.profile.maxInputTokens === "number") return {
		trigger: PROFILE_TRIGGER,
		keep: PROFILE_KEEP,
		truncateArgsSettings: PROFILE_TRUNCATE_ARGS
	};
	return {
		trigger: FALLBACK_TRIGGER,
		keep: FALLBACK_KEEP,
		truncateArgsSettings: FALLBACK_TRUNCATE_ARGS
	};
}
var DEFAULT_SUMMARY_PROMPT = `You are a conversation summarizer. Your task is to create a concise summary of the conversation that captures:
1. The main topics discussed
2. Key decisions or conclusions reached
3. Any important context that would be needed for continuing the conversation

Keep the summary focused and informative. Do not include unnecessary details.

Conversation to summarize:
{conversation}

Summary:`;
/**
* Zod schema for a summarization event that tracks what was summarized and
* where the cutoff is.
*
* Instead of rewriting LangGraph state with `RemoveMessage(REMOVE_ALL_MESSAGES)`,
* the middleware stores this event and uses it to reconstruct the effective message
* list on subsequent calls.
*/
var SummarizationEventSchema = object({
	/**
	* The index in the state messages list where summarization occurred.
	* Messages before this index have been summarized. */
	cutoffIndex: number(),
	/** The HumanMessage containing the summary. */
	summaryMessage: _instanceof(HumanMessage),
	/** Path where the conversation history was offloaded, or null if offload failed. */
	filePath: string().nullable()
});
/**
* State schema for summarization middleware.
*/
var SummarizationStateSchema = object({
	/** Session ID for history file naming */
	_summarizationSessionId: string().optional(),
	/** Most recent summarization event (private state, not visible to agent) */
	_summarizationEvent: SummarizationEventSchema.optional()
});
/**
* Check if a message is a previous summarization message.
* Summary messages are HumanMessage objects with lc_source='summarization' in additional_kwargs.
*/
function isSummaryMessage(msg) {
	if (!HumanMessage.isInstance(msg)) return false;
	return msg.additional_kwargs?.lc_source === "summarization";
}
/**
* Create summarization middleware with backend support for conversation history offloading.
*
* This middleware:
* 1. Monitors conversation length against configured thresholds
* 2. When triggered, offloads old messages to backend storage
* 3. Generates a summary of offloaded messages
* 4. Replaces old messages with the summary, preserving recent context
*
* @param options - Configuration options
* @returns AgentMiddleware for summarization and history offloading
*/
function createSummarizationMiddleware(options) {
	const { model, backend, summaryPrompt = DEFAULT_SUMMARY_PROMPT, trimTokensToSummarize = DEFAULT_TRIM_TOKEN_LIMIT, historyPathPrefix = "/conversation_history" } = options;
	let trigger = options.trigger;
	let keep = options.keep ?? {
		type: "messages",
		value: DEFAULT_MESSAGES_TO_KEEP
	};
	let truncateArgsSettings = options.truncateArgsSettings;
	let defaultsComputed = trigger != null;
	let truncateTrigger = truncateArgsSettings?.trigger;
	let truncateKeep = truncateArgsSettings?.keep ?? {
		type: "messages",
		value: 20
	};
	let maxArgLength = truncateArgsSettings?.maxLength ?? 2e3;
	let truncationText = truncateArgsSettings?.truncationText ?? "...(argument truncated)";
	/**
	* Lazily compute defaults from model profile when trigger was not provided.
	* Called once when the model is first resolved.
	*/
	function applyModelDefaults(resolvedModel) {
		if (defaultsComputed) return;
		defaultsComputed = true;
		const defaults = computeSummarizationDefaults(resolvedModel);
		trigger = defaults.trigger;
		keep = options.keep ?? defaults.keep;
		if (!options.truncateArgsSettings) {
			truncateArgsSettings = defaults.truncateArgsSettings;
			truncateTrigger = defaults.truncateArgsSettings.trigger;
			truncateKeep = defaults.truncateArgsSettings.keep ?? {
				type: "messages",
				value: 20
			};
			maxArgLength = defaults.truncateArgsSettings.maxLength ?? 2e3;
			truncationText = defaults.truncateArgsSettings.truncationText ?? "...(argument truncated)";
		}
	}
	let sessionId = null;
	let tokenEstimationMultiplier = 1;
	/**
	* Get or create session ID for history file naming.
	*/
	function getSessionId(state) {
		if (state._summarizationSessionId) return state._summarizationSessionId;
		if (!sessionId) sessionId = `session_${crypto.randomUUID().substring(0, 8)}`;
		return sessionId;
	}
	/**
	* Get the history file path.
	*/
	function getHistoryPath(state) {
		const id = getSessionId(state);
		return `${historyPathPrefix}/${id}.md`;
	}
	/**
	* Cached resolved model to avoid repeated initChatModel calls
	*/
	let cachedModel = void 0;
	/**
	* Resolve the chat model.
	* Uses initChatModel to support any model provider from a string name.
	* The resolved model is cached for subsequent calls.
	*/
	async function getChatModel() {
		if (cachedModel) return cachedModel;
		if (!model) throw new Error("Summarization middleware could not resolve a model. Provide `options.model` or ensure `request.model` is present.");
		if (typeof model === "string") cachedModel = await initChatModel(model);
		else cachedModel = model;
		return cachedModel;
	}
	/**
	* Get the max input tokens from the model's profile.
	* Similar to Python's _get_profile_limits.
	*
	* When the profile is unavailable, returns undefined. In that case the
	* middleware uses fixed token/message-count fallback defaults for
	* trigger/keep, and relies on the ContextOverflowError catch as a
	* safety net if the prompt still exceeds the model's actual limit.
	*/
	function getMaxInputTokens(resolvedModel) {
		const profile = resolvedModel.profile;
		if (profile && typeof profile === "object" && "maxInputTokens" in profile && typeof profile.maxInputTokens === "number") return profile.maxInputTokens;
	}
	/**
	* Check if summarization should be triggered.
	*/
	function shouldSummarize(messages, totalTokens, maxInputTokens) {
		if (!trigger) return false;
		const adjustedTokens = totalTokens * tokenEstimationMultiplier;
		const triggers = Array.isArray(trigger) ? trigger : [trigger];
		for (const t of triggers) {
			if (t.type === "messages" && messages.length >= t.value) return true;
			if (t.type === "tokens" && adjustedTokens >= t.value) return true;
			if (t.type === "fraction" && maxInputTokens) {
				if (adjustedTokens >= Math.floor(maxInputTokens * t.value)) return true;
			}
		}
		return false;
	}
	/**
	* Find a safe cutoff point that doesn't split AI/Tool message pairs.
	*
	* If the message at `cutoffIndex` is a ToolMessage, this adjusts the boundary
	* so that related AI and Tool messages stay together. Two strategies are used:
	*
	* 1. **Move backward** to include the AIMessage that produced the tool calls,
	*    keeping the pair in the preserved set. Preferred when it doesn't move
	*    the cutoff too far back.
	*
	* 2. **Advance forward** past all consecutive ToolMessages, putting the entire
	*    pair into the summarized set. Used when moving backward would preserve
	*    too many messages (e.g., a single AIMessage made 20+ tool calls).
	*/
	function findSafeCutoffPoint(messages, cutoffIndex) {
		if (cutoffIndex >= messages.length || !ToolMessage.isInstance(messages[cutoffIndex])) return cutoffIndex;
		let forwardIdx = cutoffIndex;
		while (forwardIdx < messages.length && ToolMessage.isInstance(messages[forwardIdx])) forwardIdx++;
		const toolCallIds = /* @__PURE__ */ new Set();
		for (let i = cutoffIndex; i < forwardIdx; i++) {
			const toolMsg = messages[i];
			if (toolMsg.tool_call_id) toolCallIds.add(toolMsg.tool_call_id);
		}
		let backwardIdx = null;
		for (let i = cutoffIndex - 1; i >= 0; i--) {
			const msg = messages[i];
			if (AIMessage.isInstance(msg) && msg.tool_calls) {
				const aiToolCallIds = new Set(msg.tool_calls.map((tc) => tc.id).filter((id) => id != null));
				for (const id of toolCallIds) if (aiToolCallIds.has(id)) {
					backwardIdx = i;
					break;
				}
				if (backwardIdx !== null) break;
			}
		}
		if (backwardIdx === null) return forwardIdx;
		if (cutoffIndex - backwardIdx > cutoffIndex / 2 && cutoffIndex > 2) return forwardIdx;
		return backwardIdx;
	}
	/**
	* Determine cutoff index for messages to summarize.
	* Messages at index < cutoff will be summarized.
	* Messages at index >= cutoff will be preserved.
	*
	* Uses findSafeCutoffPoint to ensure tool call/result pairs stay together.
	*/
	function determineCutoffIndex(messages, maxInputTokens) {
		let rawCutoff;
		if (keep.type === "messages") {
			if (messages.length <= keep.value) return 0;
			rawCutoff = messages.length - keep.value;
		} else if (keep.type === "tokens" || keep.type === "fraction") {
			const targetTokenCount = keep.type === "fraction" && maxInputTokens ? Math.floor(maxInputTokens * keep.value) : keep.value;
			let tokensKept = 0;
			rawCutoff = 0;
			for (let i = messages.length - 1; i >= 0; i--) {
				const msgTokens = countTokensApproximately([messages[i]]);
				if (tokensKept + msgTokens > targetTokenCount) {
					rawCutoff = i + 1;
					break;
				}
				tokensKept += msgTokens;
			}
		} else return 0;
		return findSafeCutoffPoint(messages, rawCutoff);
	}
	/**
	* Check if argument truncation should be triggered.
	*/
	function shouldTruncateArgs(messages, totalTokens, maxInputTokens) {
		if (!truncateTrigger) return false;
		const adjustedTokens = totalTokens * tokenEstimationMultiplier;
		if (truncateTrigger.type === "messages") return messages.length >= truncateTrigger.value;
		if (truncateTrigger.type === "tokens") return adjustedTokens >= truncateTrigger.value;
		if (truncateTrigger.type === "fraction" && maxInputTokens) return adjustedTokens >= Math.floor(maxInputTokens * truncateTrigger.value);
		return false;
	}
	/**
	* Determine cutoff index for argument truncation.
	* Uses findSafeCutoffPoint to ensure tool call/result pairs stay together.
	*/
	function determineTruncateCutoffIndex(messages, maxInputTokens) {
		let rawCutoff;
		if (truncateKeep.type === "messages") {
			if (messages.length <= truncateKeep.value) return messages.length;
			rawCutoff = messages.length - truncateKeep.value;
		} else if (truncateKeep.type === "tokens" || truncateKeep.type === "fraction") {
			const targetTokenCount = truncateKeep.type === "fraction" && maxInputTokens ? Math.floor(maxInputTokens * truncateKeep.value) : truncateKeep.value;
			let tokensKept = 0;
			rawCutoff = 0;
			for (let i = messages.length - 1; i >= 0; i--) {
				const msgTokens = countTokensApproximately([messages[i]]);
				if (tokensKept + msgTokens > targetTokenCount) {
					rawCutoff = i + 1;
					break;
				}
				tokensKept += msgTokens;
			}
		} else return messages.length;
		return findSafeCutoffPoint(messages, rawCutoff);
	}
	/**
	* Count tokens including system message and tools, matching Python's approach.
	* This gives a more accurate picture of what actually gets sent to the model.
	*/
	function countTotalTokens(messages, systemMessage, tools) {
		return countTokensApproximately(systemMessage && SystemMessage.isInstance(systemMessage) ? [systemMessage, ...messages] : [...messages], tools && Array.isArray(tools) && tools.length > 0 ? tools : null);
	}
	/**
	* Truncate ToolMessage content so that the total payload fits within the
	* model's context window. Each ToolMessage gets an equal share of the
	* remaining token budget after accounting for non-tool messages, system
	* message, and tool schemas.
	*
	* This is critical for conversations where a single AIMessage triggers
	* many tool calls whose results collectively exceed the context window.
	* Without this, findSafeCutoffPoint cannot split the AI/Tool group and
	* summarization would discard everything, causing the model to re-call
	* the same tools in an infinite loop.
	*/
	function compactToolResults(messages, maxInputTokens, systemMessage, tools) {
		const toolMessageIndices = [];
		for (let i = 0; i < messages.length; i++) if (ToolMessage.isInstance(messages[i])) toolMessageIndices.push(i);
		if (toolMessageIndices.length === 0) return {
			messages,
			modified: false
		};
		const overheadTokens = countTotalTokens(messages.filter((m) => !ToolMessage.isInstance(m)), systemMessage, tools);
		const adjustedMax = maxInputTokens / tokenEstimationMultiplier;
		const budgetForTools = Math.max(adjustedMax * .7 - overheadTokens, 1e3);
		const perToolBudgetChars = Math.floor(budgetForTools / toolMessageIndices.length) * 4;
		let modified = false;
		const result = [...messages];
		for (const idx of toolMessageIndices) {
			const msg = messages[idx];
			const content = typeof msg.content === "string" ? msg.content : JSON.stringify(msg.content);
			if (content.length > perToolBudgetChars) {
				result[idx] = new ToolMessage({
					content: content.substring(0, perToolBudgetChars) + "\n...(result truncated)",
					tool_call_id: msg.tool_call_id,
					name: msg.name
				});
				modified = true;
			}
		}
		return {
			messages: result,
			modified
		};
	}
	/**
	* Truncate large tool arguments in old messages.
	*/
	function truncateArgs(messages, maxInputTokens, systemMessage, tools, options) {
		if (!shouldTruncateArgs(messages, options?.totalTokens ?? countTotalTokens(messages, systemMessage, tools), maxInputTokens)) return {
			messages,
			modified: false
		};
		const cutoffIndex = determineTruncateCutoffIndex(messages, maxInputTokens);
		if (cutoffIndex >= messages.length) return {
			messages,
			modified: false
		};
		const truncatedMessages = [];
		let modified = false;
		for (let i = 0; i < messages.length; i++) {
			const msg = messages[i];
			if (i < cutoffIndex && AIMessage.isInstance(msg) && msg.tool_calls) {
				const truncatedToolCalls = msg.tool_calls.map((toolCall) => {
					const args = toolCall.args || {};
					const truncatedArgs = {};
					let toolModified = false;
					for (const [key, value] of Object.entries(args)) if (typeof value === "string" && value.length > maxArgLength && (toolCall.name === "write_file" || toolCall.name === "edit_file")) {
						truncatedArgs[key] = value.substring(0, 20) + truncationText;
						toolModified = true;
					} else truncatedArgs[key] = value;
					if (toolModified) {
						modified = true;
						return {
							...toolCall,
							args: truncatedArgs
						};
					}
					return toolCall;
				});
				if (modified) {
					const truncatedMsg = new AIMessage({
						content: msg.content,
						tool_calls: truncatedToolCalls,
						additional_kwargs: msg.additional_kwargs
					});
					truncatedMessages.push(truncatedMsg);
				} else truncatedMessages.push(msg);
			} else truncatedMessages.push(msg);
		}
		return {
			messages: truncatedMessages,
			modified
		};
	}
	/**
	* Filter out previous summary messages.
	*/
	function filterSummaryMessages(messages) {
		return messages.filter((msg) => !isSummaryMessage(msg));
	}
	/**
	* Offload messages to backend by appending to the history file.
	*
	* Uses uploadFiles() directly with raw byte concatenation instead of
	* edit() to avoid downloading the file twice and performing a full
	* string search-and-replace. This keeps peak memory at ~2x file size
	* (existing bytes + combined bytes) instead of ~6x with the old
	* download → edit(oldContent, newContent) approach.
	*/
	async function offloadToBackend(resolvedBackend, messages, state) {
		const filePath = getHistoryPath(state);
		const filteredMessages = filterSummaryMessages(messages);
		const newSection = `## Summarized at ${(/* @__PURE__ */ new Date()).toISOString()}\n\n${getBufferString(filteredMessages)}\n\n`;
		const sectionBytes = new TextEncoder().encode(newSection);
		try {
			let existingBytes = null;
			if (resolvedBackend.downloadFiles) try {
				const responses = await resolvedBackend.downloadFiles([filePath]);
				if (responses.length > 0 && responses[0].content && !responses[0].error) existingBytes = responses[0].content;
			} catch {}
			let result;
			if (existingBytes && resolvedBackend.uploadFiles) {
				const combined = new Uint8Array(existingBytes.byteLength + sectionBytes.byteLength);
				combined.set(existingBytes, 0);
				combined.set(sectionBytes, existingBytes.byteLength);
				const uploadResults = await resolvedBackend.uploadFiles([[filePath, combined]]);
				result = uploadResults[0].error ? { error: uploadResults[0].error } : { path: filePath };
			} else if (!existingBytes) result = await resolvedBackend.write(filePath, newSection);
			else {
				const existingContent = new TextDecoder().decode(existingBytes);
				result = await resolvedBackend.edit(filePath, existingContent, existingContent + newSection);
			}
			if (result.error) {
				console.warn(`Failed to offload conversation history to ${filePath}: ${result.error}`);
				return null;
			}
			return filePath;
		} catch (e) {
			console.warn(`Exception offloading conversation history to ${filePath}:`, e);
			return null;
		}
	}
	/**
	* Create summary of messages.
	*/
	async function createSummary(messages, chatModel) {
		let messagesToSummarize = messages;
		if (countTokensApproximately(messages) > trimTokensToSummarize) {
			let kept = 0;
			const trimmedMessages = [];
			for (let i = messages.length - 1; i >= 0; i--) {
				const msgTokens = countTokensApproximately([messages[i]]);
				if (kept + msgTokens > trimTokensToSummarize) break;
				trimmedMessages.unshift(messages[i]);
				kept += msgTokens;
			}
			messagesToSummarize = trimmedMessages;
		}
		const conversation = getBufferString(messagesToSummarize);
		const prompt = summaryPrompt.replace("{conversation}", conversation);
		const response = await chatModel.invoke([new HumanMessage({ content: prompt })]);
		return typeof response.content === "string" ? response.content : JSON.stringify(response.content);
	}
	/**
	* Build the summary message with file path reference.
	*/
	function buildSummaryMessage(summary, filePath) {
		let content;
		if (filePath) content = context`
        You are in the middle of a conversation that has been summarized.

        The full conversation history has been saved to ${filePath} should you need to refer back to it for details.

        A condensed summary follows:

        <summary>
        ${summary}
        </summary>
      `;
		else content = `Here is a summary of the conversation to date:\n\n${summary}`;
		return new HumanMessage({
			content,
			additional_kwargs: { lc_source: "summarization" }
		});
	}
	/**
	* Reconstruct the effective message list based on any previous summarization event.
	*
	* After summarization, instead of using all messages from state, we use the summary
	* message plus messages after the cutoff index. This avoids full state rewrites.
	*/
	function getEffectiveMessages(messages, state) {
		const event = state._summarizationEvent;
		if (!event) return messages;
		const result = [event.summaryMessage];
		result.push(...messages.slice(event.cutoffIndex));
		return result;
	}
	/**
	* Summarize a set of messages using the given model and build the
	* summary message + backend offload. Returns the summary message,
	* the file path, and the state cutoff index.
	*/
	async function summarizeMessages(messagesToSummarize, resolvedModel, state, previousCutoffIndex, cutoffIndex) {
		const filePath = await offloadToBackend(await resolveBackend(backend, { state }), messagesToSummarize, state);
		if (filePath === null) console.warn(`[SummarizationMiddleware] Backend offload failed during summarization. Proceeding with summary generation.`);
		return {
			summaryMessage: buildSummaryMessage(await createSummary(messagesToSummarize, resolvedModel), filePath),
			filePath,
			stateCutoffIndex: previousCutoffIndex != null ? previousCutoffIndex + cutoffIndex - 1 : cutoffIndex
		};
	}
	/**
	* Check if an error (possibly wrapped in MiddlewareError layers) is a
	* ContextOverflowError by walking the `cause` chain.
	*/
	function isContextOverflow(err) {
		let cause = err;
		for (;;) {
			if (!cause) break;
			if (ContextOverflowError.isInstance(cause)) return true;
			cause = typeof cause === "object" && "cause" in cause ? cause.cause : void 0;
		}
		return false;
	}
	async function performSummarization(request, handler, truncatedMessages, resolvedModel, maxInputTokens) {
		const cutoffIndex = determineCutoffIndex(truncatedMessages, maxInputTokens);
		if (cutoffIndex <= 0) return handler({
			...request,
			messages: truncatedMessages
		});
		const messagesToSummarize = truncatedMessages.slice(0, cutoffIndex);
		const preservedMessages = truncatedMessages.slice(cutoffIndex);
		if (preservedMessages.length === 0 && maxInputTokens) {
			const compact = compactToolResults(truncatedMessages, maxInputTokens, request.systemMessage, request.tools);
			if (compact.modified) try {
				return await handler({
					...request,
					messages: compact.messages
				});
			} catch (err) {
				if (!isContextOverflow(err)) throw err;
			}
		}
		const previousEvent = request.state._summarizationEvent;
		const previousCutoffIndex = previousEvent != null ? previousEvent.cutoffIndex : void 0;
		const { summaryMessage, filePath, stateCutoffIndex } = await summarizeMessages(messagesToSummarize, resolvedModel, request.state, previousCutoffIndex, cutoffIndex);
		let modifiedMessages = [summaryMessage, ...preservedMessages];
		const modifiedTokens = countTotalTokens(modifiedMessages, request.systemMessage, request.tools);
		let finalStateCutoffIndex = stateCutoffIndex;
		let finalSummaryMessage = summaryMessage;
		let finalFilePath = filePath;
		try {
			await handler({
				...request,
				messages: modifiedMessages
			});
		} catch (err) {
			if (!isContextOverflow(err)) throw err;
			if (maxInputTokens && modifiedTokens > 0) {
				const observedRatio = maxInputTokens / modifiedTokens;
				if (observedRatio > tokenEstimationMultiplier) tokenEstimationMultiplier = observedRatio * 1.1;
			}
			const reSumResult = await summarizeMessages([...messagesToSummarize, ...preservedMessages], resolvedModel, request.state, previousCutoffIndex, truncatedMessages.length);
			finalSummaryMessage = reSumResult.summaryMessage;
			finalFilePath = reSumResult.filePath;
			finalStateCutoffIndex = reSumResult.stateCutoffIndex;
			modifiedMessages = [reSumResult.summaryMessage];
			await handler({
				...request,
				messages: modifiedMessages
			});
		}
		return new Command({ update: {
			_summarizationEvent: {
				cutoffIndex: finalStateCutoffIndex,
				summaryMessage: finalSummaryMessage,
				filePath: finalFilePath
			},
			_summarizationSessionId: getSessionId(request.state)
		} });
	}
	return createMiddleware({
		name: "SummarizationMiddleware",
		stateSchema: SummarizationStateSchema,
		async wrapModelCall(request, handler) {
			const effectiveMessages = getEffectiveMessages(request.messages ?? [], request.state);
			if (effectiveMessages.length === 0) return handler(request);
			/**
			* Resolve the chat model and get max input tokens from its profile.
			*/
			const resolvedModel = request.model ?? await getChatModel();
			const maxInputTokens = getMaxInputTokens(resolvedModel);
			applyModelDefaults(resolvedModel);
			const totalTokens = countTotalTokens(effectiveMessages, request.systemMessage, request.tools);
			/**
			* Step 1: Truncate args if configured
			*/
			const { messages: truncatedMessages, modified: truncateModified } = truncateArgs(effectiveMessages, maxInputTokens, request.systemMessage, request.tools, { totalTokens });
			/**
			* Step 2: Check if summarization should happen.
			* Recount only if truncation changed messages.
			*/
			const tokensForSummary = truncateModified ? countTotalTokens(truncatedMessages, request.systemMessage, request.tools) : totalTokens;
			/**
			* If no summarization needed, try passing through.
			* If the handler throws a ContextOverflowError, fall back to
			* emergency summarization (matching Python's behavior).
			*/
			if (!shouldSummarize(truncatedMessages, tokensForSummary, maxInputTokens)) try {
				return await handler({
					...request,
					messages: truncatedMessages
				});
			} catch (err) {
				if (!isContextOverflow(err)) throw err;
				if (maxInputTokens && tokensForSummary > 0) {
					const observedRatio = maxInputTokens / tokensForSummary;
					if (observedRatio > tokenEstimationMultiplier) tokenEstimationMultiplier = observedRatio * 1.1;
				}
			}
			/**
			* Step 3: Perform summarization
			*/
			return performSummarization(request, handler, truncatedMessages, resolvedModel, maxInputTokens);
		}
	});
}
function toolCallIdFromRuntime(runtime) {
	return runtime.toolCall?.id ?? runtime.toolCallId ?? "";
}
/**
* Zod schema for {@link AsyncTask}.
*
* Used by the {@link ReducedValue} in the state schema so that LangGraph
* can validate and serialize task records stored in `asyncTasks`.
*/
var AsyncTaskSchema = object({
	taskId: string(),
	agentName: string(),
	threadId: string(),
	runId: string(),
	status: string(),
	createdAt: string(),
	description: string().optional(),
	updatedAt: string().optional(),
	checkedAt: string().optional()
});
/**
* State schema for the async subagent middleware.
*
* Declares `asyncTasks` as a reduced state channel so that individual
* tool updates (launch, check, update, cancel, list) merge into the existing
* tasks dict rather than replacing it wholesale.
*/
var AsyncTaskStateSchema = new StateSchema({ asyncTasks: new ReducedValue(record(string(), AsyncTaskSchema).default(() => ({})), {
	inputSchema: record(string(), AsyncTaskSchema).optional(),
	reducer: asyncTasksReducer
}) });
/**
* Reducer for the `asyncTasks` state channel.
*
* Merges task updates into the existing tasks dict using shallow spread.
* This allows individual tools to update a single task without overwriting
* the full map — only the keys present in `update` are replaced.
*
* @param existing - The current tasks dict from state (may be undefined on first write).
* @param update - New or updated task entries to merge in.
* @returns Merged tasks dict.
*/
function asyncTasksReducer(existing, update) {
	return {
		...existing || {},
		...update || {}
	};
}
/**
* Description template for the `start_async_task` tool.
*
* The `{available_agents}` placeholder is replaced at middleware creation
* time with a formatted list of configured async subagent names and descriptions.
*/
var ASYNC_TASK_TOOL_DESCRIPTION = `Launch an async subagent on a remote server. The subagent runs in the background and returns a task ID immediately.

Available async agent types:
{available_agents}

## Usage notes:
1. This tool launches a background task and returns immediately with a task ID. Report the task ID to the user and stop — do NOT immediately check status.
2. Use \`check_async_task\` only when the user asks for a status update or result.
3. Use \`update_async_task\` to send new instructions to a running task.
4. Multiple async subagents can run concurrently — launch several and let them run in the background.
5. The subagent runs on a remote server, so it has its own tools and capabilities.`;
/**
* Task statuses that will never change.
*
* When listing tasks, live-status fetches are skipped for tasks whose
* cached status is in this set, since they are guaranteed to be final.
*/
/**
* Names of the tools added by the async subagent middleware.
*
* Exported so `agent.ts` can include them in `BUILTIN_TOOL_NAMES` and
* surface a `ConfigurationError` if a user-provided tool collides.
*/
var ASYNC_TASK_TOOL_NAMES = [
	"start_async_task",
	"check_async_task",
	"update_async_task",
	"cancel_async_task",
	"list_async_tasks"
];
var TERMINAL_STATUSES = /* @__PURE__ */ new Set([
	"cancelled",
	"success",
	"error",
	"timeout",
	"interrupted"
]);
/**
* Look up a tracked task from state by its `taskId`.
*
* @param taskId - The task ID to look up (will be trimmed).
* @param state - The current agent state containing `asyncTasks`.
* @returns The tracked task on success, or an error string.
*/
function resolveTrackedTask(taskId, state) {
	const tracked = (state.asyncTasks ?? {})[taskId.trim()];
	if (!tracked) return `No tracked task found for taskId: '${taskId}'`;
	return tracked;
}
/**
* Build a check result from a run's current status and thread state values.
*
* For successful runs, extracts the last message's content from the remote
* thread's state values. For errored runs, includes a generic error message.
*
* @param run - The run object from the SDK.
* @param threadId - The thread ID for the run.
* @param threadValues - The `values` from `ThreadState` (the remote subagent's state).
*/
function buildCheckResult(run, threadId, threadValues) {
	const checkResult = {
		status: run.status,
		threadId
	};
	if (run.status === "success") {
		const messages = (Array.isArray(threadValues) ? {} : threadValues)?.messages ?? [];
		if (messages.length > 0) {
			const last = messages[messages.length - 1];
			const rawContent = typeof last === "object" && last !== null && "content" in last ? last.content : last;
			checkResult.result = typeof rawContent === "string" ? rawContent : JSON.stringify(rawContent);
		} else checkResult.result = "Completed with no output messages.";
	} else if (run.status === "error") checkResult.error = "The async subagent encountered an error.";
	return checkResult;
}
/**
* Filter tasks by cached status from agent state.
*
* Filtering uses the cached status, not live server status. Live statuses
* are fetched after filtering by the calling tool.
*
* @param tasks - All tracked tasks from state.
* @param statusFilter - If nullish or `'all'`, return all tasks.
*   Otherwise return only tasks whose cached status matches.
*/
function filterTasks(tasks, statusFilter) {
	if (!statusFilter || statusFilter === "all") return Object.values(tasks);
	return Object.values(tasks).filter((task) => task.status === statusFilter);
}
/**
* Fetch the current run status from the server.
*
* Returns the cached status immediately for terminal tasks (avoiding
* unnecessary API calls). Falls back to the cached status on SDK errors.
*/
async function fetchLiveTaskStatus(clients, task) {
	if (TERMINAL_STATUSES.has(task.status)) return task.status;
	try {
		return (await clients.getClient(task.agentName).runs.get(task.threadId, task.runId)).status;
	} catch {
		return task.status;
	}
}
/**
* Format a single task as a display string for list output.
*/
function formatTaskEntry(task, status) {
	return `- taskId: ${task.taskId} agent: ${task.agentName} status: ${status}`;
}
/**
* Lazily-created, cached LangGraph SDK clients keyed by (url, headers).
*
* Agents that share the same URL and headers will reuse a single `Client`
* instance, avoiding unnecessary connections.
*/
var ClientCache = class {
	agents;
	clients = /* @__PURE__ */ new Map();
	constructor(agents) {
		this.agents = agents;
	}
	/**
	* Build headers for a remote Agent Protocol server.
	*
	* Adds `x-auth-scheme: langsmith` by default unless already provided.
	* For self-hosted servers that don't require this header, it is typically
	* ignored. Override via the `headers` field on the AsyncSubAgent config.
	*/
	resolveHeaders(spec) {
		const headers = { ...spec.headers || {} };
		if (!("x-auth-scheme" in headers)) headers["x-auth-scheme"] = "langsmith";
		return headers;
	}
	/**
	* Build a stable cache key from a spec's url and resolved headers.
	*/
	cacheKey(spec) {
		const headers = this.resolveHeaders(spec);
		const headerStr = Object.entries(headers).sort().flat().join(":");
		return `${spec.url ?? ""}|${headerStr}`;
	}
	/**
	* Get or create a `Client` for the named agent.
	*/
	getClient(name) {
		const spec = this.agents[name];
		const key = this.cacheKey(spec);
		const existing = this.clients.get(key);
		if (existing) return existing;
		const headers = this.resolveHeaders(spec);
		const client = new Client({
			apiUrl: spec.url,
			defaultHeaders: headers
		});
		this.clients.set(key, client);
		return client;
	}
};
/**
* Extract the callback thread ID from the tool runtime.
*
* The thread ID is included in the subagent's input state so the subagent
* can notify the parent when it completes (via
* `CompletionCallbackMiddleware`).
*
* @returns Object with `callbackThreadId` if available. Empty object otherwise.
*/
function extractCallbackContext(runtime) {
	const threadId = (runtime.config?.configurable)?.thread_id;
	if (typeof threadId === "string" && threadId) return { callbackThreadId: threadId };
	return {};
}
/**
* Build the `start_async_task` tool.
*
* Creates a thread on the remote server, starts a run, and returns a
* `Command` that persists the new task in state.
*/
function buildStartTool(agentMap, clients, toolDescription) {
	return tool$1(async (input, runtime) => {
		if (!(input.agentName in agentMap)) {
			const allowed = Object.keys(agentMap).map((k) => `\`${k}\``).join(", ");
			return `Unknown async subagent type \`${input.agentName}\`. Available types: ${allowed}`;
		}
		const spec = agentMap[input.agentName];
		const callbackContext = extractCallbackContext(runtime);
		try {
			const client = clients.getClient(input.agentName);
			const thread = await client.threads.create();
			const run = await client.runs.create(thread.thread_id, spec.graphId, { input: {
				messages: [{
					role: "user",
					content: input.description
				}],
				...callbackContext
			} });
			const taskId = thread.thread_id;
			const task = {
				taskId,
				agentName: input.agentName,
				threadId: taskId,
				runId: run.run_id,
				status: "running",
				createdAt: (/* @__PURE__ */ new Date()).toISOString(),
				description: input.description
			};
			return new Command({ update: {
				messages: [new ToolMessage({
					content: `Launched async subagent. taskId: ${taskId}`,
					tool_call_id: toolCallIdFromRuntime(runtime)
				})],
				asyncTasks: { [taskId]: task }
			} });
		} catch (e) {
			return `Failed to launch async subagent '${input.agentName}': ${e}`;
		}
	}, {
		name: "start_async_task",
		description: toolDescription,
		schema: object({
			description: string().describe("A detailed description of the task for the async subagent to perform."),
			agentName: string().describe("The type of async subagent to use. Must be one of the available types listed in the tool description.")
		})
	});
}
/**
* Build the `check_async_task` tool.
*
* Fetches the current run status from the remote server and, if the run
* succeeded, retrieves the thread state to extract the result.
*/
function buildCheckTool(clients) {
	return tool$1(async (input, runtime) => {
		const task = resolveTrackedTask(input.taskId, runtime.state);
		if (typeof task === "string") return task;
		const client = clients.getClient(task.agentName);
		let run;
		try {
			run = await client.runs.get(task.threadId, task.runId);
		} catch (e) {
			return `Failed to get run status: ${e}`;
		}
		let threadValues = {};
		if (run.status === "success") try {
			threadValues = (await client.threads.getState(task.threadId)).values || {};
		} catch {}
		const result = buildCheckResult(run, task.threadId, threadValues);
		const updatedTask = {
			taskId: task.taskId,
			agentName: task.agentName,
			threadId: task.threadId,
			runId: task.runId,
			status: result.status,
			createdAt: task.createdAt,
			updatedAt: result.status !== task.status ? (/* @__PURE__ */ new Date()).toISOString() : task.updatedAt,
			checkedAt: (/* @__PURE__ */ new Date()).toISOString()
		};
		return new Command({ update: {
			messages: [new ToolMessage({
				content: JSON.stringify(result),
				tool_call_id: toolCallIdFromRuntime(runtime)
			})],
			asyncTasks: { [task.taskId]: updatedTask }
		} });
	}, {
		name: "check_async_task",
		description: "Check the status of an async subagent task. Returns the current status and, if complete, the result. Statuses shown earlier in the conversation are always stale, so call this to get the current status rather than reporting a status from a previous tool result.",
		schema: object({ taskId: string().describe("The exact taskId string returned by start_async_task. Pass it verbatim.") })
	});
}
/**
* Build the `update_async_task` tool.
*
* Sends a follow-up message to a running async subagent by creating a new
* run on the same thread with `multitaskStrategy: "interrupt"`. The subagent
* sees the full conversation history plus the new message. The `taskId`
* remains the same; only the internal `runId` is updated.
*/
function buildUpdateTool(agentMap, clients) {
	return tool$1(async (input, runtime) => {
		const tracked = resolveTrackedTask(input.taskId, runtime.state);
		if (typeof tracked === "string") return tracked;
		const spec = agentMap[tracked.agentName];
		try {
			const run = await clients.getClient(tracked.agentName).runs.create(tracked.threadId, spec.graphId, {
				input: { messages: [{
					role: "user",
					content: input.message
				}] },
				multitaskStrategy: "interrupt"
			});
			const task = {
				taskId: tracked.taskId,
				agentName: tracked.agentName,
				threadId: tracked.threadId,
				runId: run.run_id,
				status: "running",
				createdAt: tracked.createdAt,
				description: input.message,
				updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
				checkedAt: tracked.checkedAt
			};
			return new Command({ update: {
				messages: [new ToolMessage({
					content: `Updated async subagent. taskId: ${tracked.taskId}`,
					tool_call_id: toolCallIdFromRuntime(runtime)
				})],
				asyncTasks: { [tracked.taskId]: task }
			} });
		} catch (e) {
			return `Failed to update async subagent: ${e}`;
		}
	}, {
		name: "update_async_task",
		description: "send updated instructions to an async subagent. Interrupts the current run and starts a new one on the same thread so the subagent sees the full conversation history plus your new message. The taskId remains the same.",
		schema: object({
			taskId: string().describe("The exact taskId string returned by start_async_task. Pass it verbatim."),
			message: string().describe("Follow-up instructions or context to send to the subagent")
		})
	});
}
/**
* Build the `cancel_async_task` tool.
*
* Cancels the current run on the remote server and updates the task's
* cached status to `"cancelled"`.
*/
function buildCancelTool(clients) {
	return tool$1(async (input, runtime) => {
		const tracked = resolveTrackedTask(input.taskId, runtime.state);
		if (typeof tracked === "string") return tracked;
		const client = clients.getClient(tracked.agentName);
		try {
			await client.runs.cancel(tracked.threadId, tracked.runId);
		} catch (e) {
			return `Failed to cancel run: ${e}`;
		}
		const updated = {
			taskId: tracked.taskId,
			agentName: tracked.agentName,
			threadId: tracked.threadId,
			runId: tracked.runId,
			status: "cancelled",
			createdAt: tracked.createdAt,
			updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
			checkedAt: tracked.checkedAt
		};
		return new Command({ update: {
			messages: [new ToolMessage({
				content: `Cancelled async subagent task: ${tracked.taskId}`,
				tool_call_id: toolCallIdFromRuntime(runtime)
			})],
			asyncTasks: { [tracked.taskId]: updated }
		} });
	}, {
		name: "cancel_async_task",
		description: "Cancel a running async subagent task. Use this to stop a task that is no longer needed.",
		schema: object({ taskId: string().describe("The exact taskId string returned by start_async_task. Pass it verbatim.") })
	});
}
/**
* Build the `list_async_tasks` tool.
*
* Lists all tracked tasks with their live statuses fetched in parallel.
* Supports optional filtering by cached status.
*/
function buildListTool(clients) {
	return tool$1(async (input, runtime) => {
		const filtered = filterTasks(runtime.state.asyncTasks ?? {}, input.statusFilter ?? void 0);
		if (filtered.length === 0) return "No async subagent tasks tracked";
		const statuses = await Promise.all(filtered.map((task) => fetchLiveTaskStatus(clients, task)));
		const updatedTasks = {};
		const entries = [];
		for (let idx = 0; idx < filtered.length; idx++) {
			const task = filtered[idx];
			const status = statuses[idx];
			const taskEntry = formatTaskEntry(task, status);
			entries.push(taskEntry);
			updatedTasks[task.taskId] = {
				taskId: task.taskId,
				agentName: task.agentName,
				threadId: task.threadId,
				runId: task.runId,
				status,
				createdAt: task.createdAt,
				updatedAt: status !== task.status ? (/* @__PURE__ */ new Date()).toISOString() : task.updatedAt,
				checkedAt: task.checkedAt
			};
		}
		return new Command({ update: {
			messages: [new ToolMessage({
				content: `${entries.length} tracked task(s):\n${entries.join("\n")}`,
				tool_call_id: toolCallIdFromRuntime(runtime)
			})],
			asyncTasks: updatedTasks
		} });
	}, {
		name: "list_async_tasks",
		description: "List tracked async subagent tasks with their current live statuses. By default shows all tasks. Use `statusFilter` to narrow by status (e.g., 'running', 'success', 'error', 'cancelled'). Use `check_async_task` to get the full result of a specific completed task. Statuses shown earlier in the conversation are always stale, so call this to read current statuses rather than reporting one from a previous tool result.",
		schema: object({ statusFilter: string().nullish().describe("Filter tasks by status. One of: 'running', 'success', 'error', 'cancelled', 'all'. Defaults to 'all'.") })
	});
}
/**
* Create middleware that adds async subagent tools to an agent.
*
* Provides five tools for launching, checking, updating, cancelling, and
* listing background tasks on remote Agent Protocol servers. Task state is
* persisted in the `asyncTasks` state channel so it survives
* context compaction.
*
* Works with any Agent Protocol-compliant server — LangGraph Platform (managed)
* or self-hosted (e.g. a Hono/Express server implementing the Agent Protocol spec).
*
* @throws {Error} If no async subagents are provided or names are duplicated.
*
* @example
* ```ts
* const middleware = createAsyncSubAgentMiddleware({
*   asyncSubAgents: [{
*     name: "researcher",
*     description: "Research agent for deep analysis",
*     url: "https://my-agent-protocol-server.example.com",
*     graphId: "research_agent",
*   }],
* });
* ```
*/
/**
* Type guard to distinguish async SubAgents from sync SubAgents/CompiledSubAgents.
*
* Uses the presence of the `graphId` field as the runtime discriminant —
* `AsyncSubAgent` requires it, while `SubAgent` and `CompiledSubAgent` do not have it.
*/
function isAsyncSubAgent(subAgent) {
	return "graphId" in subAgent;
}
function createAsyncSubAgentMiddleware(options) {
	const { asyncSubAgents, systemPrompt = null } = options;
	if (!asyncSubAgents || asyncSubAgents.length === 0) throw new Error("At least one async subagent must be specified");
	const names = asyncSubAgents.map((a) => a.name);
	const duplicates = names.filter((n, i) => names.indexOf(n) !== i);
	if (duplicates.length > 0) throw new Error(`Duplicate async subagent names: ${[...new Set(duplicates)].join(", ")}`);
	const agentMap = Object.fromEntries(asyncSubAgents.map((a) => [a.name, a]));
	const clients = new ClientCache(agentMap);
	const agentsDescription = asyncSubAgents.map((a) => `- ${a.name}: ${a.description}`).join("\n");
	const tools = [
		buildStartTool(agentMap, clients, ASYNC_TASK_TOOL_DESCRIPTION.replace("{available_agents}", agentsDescription)),
		buildCheckTool(clients),
		buildUpdateTool(agentMap, clients),
		buildCancelTool(clients),
		buildListTool(clients)
	];
	const fullSystemPrompt = systemPrompt ? `${systemPrompt}\n\nAvailable async subagent types:\n${agentsDescription}` : null;
	return createMiddleware({
		name: "asyncSubAgentMiddleware",
		stateSchema: AsyncTaskStateSchema,
		tools,
		wrapModelCall: async (request, handler) => {
			if (fullSystemPrompt !== null) return handler({
				...request,
				systemMessage: request.systemMessage.concat(new SystemMessage({ content: fullSystemPrompt }))
			});
			return handler(request);
		}
	});
}
var CONFIGURATION_ERROR_SYMBOL = Symbol.for("deepagents.configuration_error");
/**
* Thrown when `createDeepAgent` receives invalid configuration.
*
* Follows the same pattern as {@link SandboxError}: a human-readable
* `message`, a structured `code` for programmatic handling, and a
* static `isInstance` guard that works across realms.
*
* @example
* ```typescript
* try {
*   createDeepAgent({ tools: [myTool] });
* } catch (error) {
*   if (ConfigurationError.isInstance(error)) {
*     switch (error.code) {
*       case "TOOL_NAME_COLLISION":
*         console.error("Rename your tool:", error.message);
*         break;
*     }
*   }
* }
* ```
*/
var ConfigurationError = class ConfigurationError extends Error {
	code;
	cause;
	[CONFIGURATION_ERROR_SYMBOL] = true;
	name = "ConfigurationError";
	constructor(message, code, cause) {
		super(message);
		this.code = code;
		this.cause = cause;
		Object.setPrototypeOf(this, ConfigurationError.prototype);
	}
	static isInstance(error) {
		return typeof error === "object" && error !== null && error[CONFIGURATION_ERROR_SYMBOL] === true;
	}
};
/**
* Creates a middleware that places a cache breakpoint at the end of the static
* system prompt content.
*
* This middleware tags the last block of the system message with
* `cache_control: { type: "ephemeral" }` at the time it runs, capturing all
* static content injected by preceding middleware (e.g. todo list instructions,
* filesystem tools, subagent instructions) in a single cache breakpoint.
*
* This should run after all static system prompt middleware and before any
* dynamic middleware (e.g. memory) so the breakpoint sits at the boundary
* between stable and changing content.
*
* When used alongside memory middleware (which adds its own breakpoint on the
* memory block), the result is two separate cache breakpoints:
* - One covering all static content
* - One covering the memory block
*
* The `cache_control` marker is Anthropic-specific. The middleware is gated
* per-call on `request.model` so it is a no-op when `modelFallbackMiddleware`
* (or any other middleware) has swapped the request to a non-Anthropic
* provider. Without this gate, the marker leaks to providers that reject it
* (e.g. OpenAI returns `400 Unknown parameter: 'cache_control'`).
*
* This is a no-op when the system message has no content blocks.
*/
function createCacheBreakpointMiddleware() {
	return createMiddleware({
		name: "CacheBreakpointMiddleware",
		wrapModelCall(request, handler) {
			if (!isAnthropicModel(request.model)) return handler(request);
			const existingContent = request.systemMessage.content;
			const existingBlocks = typeof existingContent === "string" ? [{
				type: "text",
				text: existingContent
			}] : Array.isArray(existingContent) ? [...existingContent] : [];
			if (existingBlocks.length === 0) return handler(request);
			existingBlocks[existingBlocks.length - 1] = {
				...existingBlocks[existingBlocks.length - 1],
				cache_control: { type: "ephemeral" }
			};
			return handler({
				...request,
				systemMessage: new SystemMessage({ content: existingBlocks })
			});
		}
	});
}
function hasToolName(tool) {
	return tool !== null && typeof tool === "object" && "name" in tool && typeof tool.name === "string";
}
/**
* Create middleware that removes excluded tools after all tool-injecting
* middleware has had a chance to add tools to the request.
*
* @internal
*/
function createToolExclusionMiddleware(excludedTools) {
	return createMiddleware({
		name: "_ToolExclusionMiddleware",
		wrapModelCall(request, handler) {
			return handler({
				...request,
				tools: request.tools?.filter((tool) => !hasToolName(tool) || !excludedTools.has(tool.name))
			});
		}
	});
}
/**
* Normalize and validate a profile registry key.
*
* Trims leading/trailing whitespace, then enforces the `"provider"` or
* `"provider:model"` shape. Rejects empty strings, multiple colons, and
* empty halves.
*
* @param key - The registry key to validate.
* @returns The trimmed, validated key.
* @throws {Error} When the key is malformed.
*
* @example
* ```typescript
* validateProfileKey("anthropic:claude-opus-4-7"); // "anthropic:claude-opus-4-7"
* validateProfileKey("  openai  ");                 // "openai"
* validateProfileKey("openai:");                    // throws
* validateProfileKey("");                            // throws
* ```
*/
function validateProfileKey(key) {
	const trimmed = key.trim();
	if (!trimmed) throw new Error("Profile key must be a non-empty string");
	if (trimmed.split(":").length > 2) throw new Error(`Profile key "${trimmed}" has more than one ":"; expected "provider" or "provider:model"`);
	if (trimmed.includes(":")) {
		const [provider, model] = trimmed.split(":");
		if (!provider.trim() || !model.trim()) throw new Error(`Profile key "${trimmed}" has an empty provider or model half; expected "provider:model"`);
	}
	return trimmed;
}
/**
* Middleware names that provide essential agent capabilities and cannot
* be excluded via `excludedMiddleware`.
*
* - `FilesystemMiddleware` backs all built-in file tools and enforces
*   filesystem permissions.
* - `SubAgentMiddleware` backs the `task` tool for subagent delegation.
*/
var REQUIRED_MIDDLEWARE_NAMES = /* @__PURE__ */ new Set(["FilesystemMiddleware", "SubAgentMiddleware"]);
/**
* Resolve middleware to a concrete array, invoking the factory if
* needed.
*
* @internal
*/
function resolveMiddleware(middleware) {
	if (typeof middleware === "function") return middleware();
	return middleware;
}
/**
* Validate the grammar of an `excludedMiddleware` entry.
*
* Runs at profile construction time so malformed entries fail
* immediately. Checks:
*
* 1. Non-empty, non-whitespace string.
* 2. No colons (class-path `module:Class` syntax is reserved).
* 3. No underscore prefix (private middleware is not part of the
*    exclusion surface).
* 4. Not a required scaffolding name.
*
* @param name - The middleware name to validate.
* @throws {Error} When the name violates any rule.
*/
function validateExcludedMiddlewareName(name) {
	if (!name || !name.trim()) throw new Error("excludedMiddleware entries must be non-empty, non-whitespace strings.");
	if (name.includes(":")) throw new Error(`excludedMiddleware entries must be plain middleware names; class-path syntax is not supported, got "${name}".`);
	if (name.startsWith("_")) throw new Error(`excludedMiddleware entry "${name}" cannot start with "_" (underscore-prefixed names refer to private middleware not part of the public exclusion surface).`);
	if (REQUIRED_MIDDLEWARE_NAMES.has(name)) throw new Error(`Cannot exclude required middleware "${name}" — it provides essential agent capabilities that the runtime depends on.`);
}
/**
* Create a frozen {@link HarnessProfile} from user-provided options.
*
* Validates all fields, converts mutable collections to their
* frozen counterparts, and returns a frozen object.
* Empty options produce a no-op profile (all defaults).
*
* @param options - Partial profile configuration.
* @returns A frozen, validated `HarnessProfile`.
* @throws {Error} When any field violates validation rules (invalid
*   middleware names, scaffolding exclusion attempts).
*
* @example
* ```typescript
* const profile = createHarnessProfile({
*   systemPromptSuffix: "Think step by step.",
*   excludedTools: ["execute"],
* });
* ```
*/
function createHarnessProfile(options = {}) {
	for (const name of options.excludedMiddleware ?? []) validateExcludedMiddlewareName(name);
	const toolDescriptionOverrides = Object.freeze(Object.assign(Object.create(null), options.toolDescriptionOverrides));
	const generalPurposeSubagent = options.generalPurposeSubagent ? Object.freeze({ ...options.generalPurposeSubagent }) : void 0;
	const profile = {
		baseSystemPrompt: options.baseSystemPrompt,
		systemPromptSuffix: options.systemPromptSuffix,
		toolDescriptionOverrides,
		excludedTools: new Set(options.excludedTools),
		excludedMiddleware: new Set(options.excludedMiddleware),
		extraMiddleware: options.extraMiddleware ?? [],
		generalPurposeSubagent
	};
	return Object.freeze(profile);
}
/**
* An empty no-op profile used as the default when no registered
* profile matches. Avoids creating a new object on every miss.
*/
var EMPTY_HARNESS_PROFILE = createHarnessProfile();
/**
* Zod schema for the general-purpose subagent config section of an
* external harness profile config file.
*/
var generalPurposeSubagentConfigSchema = object({
	enabled: boolean().optional(),
	description: string().optional(),
	systemPrompt: string().optional()
}).strict();
object({
	baseSystemPrompt: string().optional(),
	systemPromptSuffix: string().optional(),
	toolDescriptionOverrides: record(string(), string()).optional(),
	excludedTools: array(string()).optional(),
	excludedMiddleware: array(string()).optional(),
	generalPurposeSubagent: generalPurposeSubagentConfigSchema.optional()
}).strict();
/**
* Merge two middleware sequences by `.name`.
*
* When the override has a middleware whose `.name` already appears in
* the base, the override instance replaces the base instance at the
* same position. Novel names from the override are appended. If the
* base has duplicates of the same name, only the first is replaced;
* later duplicates are dropped.
*
* Returns a factory to ensure fresh resolution on each call.
*/
function mergeMiddleware(base, override) {
	const baseArr = resolveMiddleware(base);
	const overrideArr = resolveMiddleware(override);
	if (baseArr.length === 0) return override;
	if (overrideArr.length === 0) return base;
	return () => {
		const baseSeq = resolveMiddleware(base);
		const overrideSeq = resolveMiddleware(override);
		const overrideByName = new Map(overrideSeq.map((m) => [m.name, m]));
		const merged = [];
		const replaced = /* @__PURE__ */ new Set();
		for (const entry of baseSeq) {
			const replacement = overrideByName.get(entry.name);
			if (replacement) {
				if (!replaced.has(entry.name)) {
					merged.push(replacement);
					replaced.add(entry.name);
				}
			} else merged.push(entry);
		}
		for (const entry of overrideSeq) if (!replaced.has(entry.name)) merged.push(entry);
		return merged;
	};
}
/**
* Merge two GP subagent configs field-wise.
*
* Override wins per sub-field when not `undefined`; unset fields
* inherit from base. Returns `undefined` only when both inputs are
* `undefined`.
*/
function mergeGeneralPurposeSubagentConfigs(base, override) {
	if (base === void 0) return override;
	if (override === void 0) return base;
	return {
		enabled: override.enabled ?? base.enabled,
		description: override.description ?? base.description,
		systemPrompt: override.systemPrompt ?? base.systemPrompt
	};
}
/**
* Merge two harness profiles, layering `override` on top of `base`.
*
* Merge semantics per field:
*
* | Field | Strategy |
* |-------|----------|
* | `baseSystemPrompt` | Override wins if not `undefined` |
* | `systemPromptSuffix` | Override wins if not `undefined` |
* | `toolDescriptionOverrides` | Object spread merge; override wins per key |
* | `excludedTools` | Set union |
* | `excludedMiddleware` | Set union |
* | `extraMiddleware` | Merge by `.name`; override instance replaces base at same position; novel names appended |
* | `generalPurposeSubagent` | Field-wise merge; override wins per sub-field |
*
* @param base - Lower-priority profile (e.g., provider-wide).
* @param override - Higher-priority profile (e.g., exact model).
* @returns A new merged profile.
*/
function mergeProfiles(base, override) {
	return createHarnessProfile({
		baseSystemPrompt: override.baseSystemPrompt ?? base.baseSystemPrompt,
		systemPromptSuffix: override.systemPromptSuffix ?? base.systemPromptSuffix,
		toolDescriptionOverrides: {
			...base.toolDescriptionOverrides,
			...override.toolDescriptionOverrides
		},
		excludedTools: [...base.excludedTools, ...override.excludedTools],
		excludedMiddleware: [...base.excludedMiddleware, ...override.excludedMiddleware],
		extraMiddleware: mergeMiddleware(base.extraMiddleware, override.extraMiddleware),
		generalPurposeSubagent: mergeGeneralPurposeSubagentConfigs(base.generalPurposeSubagent, override.generalPurposeSubagent)
	});
}
var SYSTEM_PROMPT_SUFFIX$3 = `\
<use_parallel_tool_calls>
If you intend to call multiple tools and there are no dependencies between the tool calls, make all of the independent tool calls in parallel. Prioritize calling tools simultaneously whenever the actions can be done in parallel rather than sequentially. For example, when reading 3 files, run 3 tool calls in parallel to read all 3 files into context at the same time. Maximize use of parallel tool calls where possible to increase speed and efficiency. However, if some tool calls depend on previous calls to inform dependent values like the parameters, do NOT call these tools in parallel and instead call them sequentially. Never use placeholders or guess missing parameters in tool calls.
</use_parallel_tool_calls>

<investigate_before_answering>
Never speculate about code you have not opened. If the user references a specific file, you MUST read the file before answering. Make sure to investigate and read relevant files BEFORE answering questions about the codebase. Never make any claims about code before investigating unless you are certain of the correct answer - give grounded and hallucination-free answers.
</investigate_before_answering>

<tool_result_reflection>
After receiving tool results, carefully reflect on their quality and determine optimal next steps before proceeding. Use your thinking to plan and iterate based on this new information, and then take the best next action.
</tool_result_reflection>

<tool_usage>
When a task depends on the state of files, tests, or system output, use tools to observe that state directly rather than reasoning from memory about what it probably contains. Read files before describing them. Run tests before claiming they pass. Search the codebase before asserting a symbol does or does not exist. Active investigation with tools is the default mode of working, not a fallback.
</tool_usage>

<subagent_usage>
Do not spawn a subagent for work you can complete directly in a single response (e.g. refactoring a function you can already see).

Spawn multiple subagents in the same turn when fanning out across items or reading multiple files.
</subagent_usage>`;
/**
* Register the built-in Claude Opus 4.7 harness profile.
*
* Layers a system-prompt suffix onto `anthropic:claude-opus-4-7`
* tuned to the model's documented behaviors: parallel tool calls,
* grounded answers, post-tool reflection, active investigation, and
* subagent spawning guidance.
*
* @internal
*/
function register$3() {
	registerHarnessProfileImpl("anthropic:claude-opus-4-7", createHarnessProfile({ systemPromptSuffix: SYSTEM_PROMPT_SUFFIX$3 }));
}
var SYSTEM_PROMPT_SUFFIX$2 = `\
<use_parallel_tool_calls>
If you intend to call multiple tools and there are no dependencies between the tool calls, make all of the independent tool calls in parallel. Prioritize calling tools simultaneously whenever the actions can be done in parallel rather than sequentially. For example, when reading 3 files, run 3 tool calls in parallel to read all 3 files into context at the same time. Maximize use of parallel tool calls where possible to increase speed and efficiency. However, if some tool calls depend on previous calls to inform dependent values like the parameters, do NOT call these tools in parallel and instead call them sequentially. Never use placeholders or guess missing parameters in tool calls.
</use_parallel_tool_calls>

<investigate_before_answering>
Never speculate about code you have not opened. If the user references a specific file, you MUST read the file before answering. Make sure to investigate and read relevant files BEFORE answering questions about the codebase. Never make any claims about code before investigating unless you are certain of the correct answer - give grounded and hallucination-free answers.
</investigate_before_answering>

<tool_result_reflection>
After receiving tool results, carefully reflect on their quality and determine optimal next steps before proceeding. Use your thinking to plan and iterate based on this new information, and then take the best next action.
</tool_result_reflection>`;
/**
* Register the built-in Claude Sonnet 4.6 harness profile.
*
* Layers universal Claude guidance (parallel tool calls, grounded
* answers, post-tool reflection) onto `anthropic:claude-sonnet-4-6`.
*
* No Sonnet-specific overlays — Anthropic's guidance for Sonnet 4.6
* centers on API-level configuration rather than system-prompt
* adjustments. This module exists as the audit anchor: its presence
* documents the review and justifies the absence of model-specific
* content.
*
* @internal
*/
function register$2() {
	registerHarnessProfileImpl("anthropic:claude-sonnet-4-6", createHarnessProfile({ systemPromptSuffix: SYSTEM_PROMPT_SUFFIX$2 }));
}
var SYSTEM_PROMPT_SUFFIX$1 = `\
<use_parallel_tool_calls>
If you intend to call multiple tools and there are no dependencies between the tool calls, make all of the independent tool calls in parallel. Prioritize calling tools simultaneously whenever the actions can be done in parallel rather than sequentially. For example, when reading 3 files, run 3 tool calls in parallel to read all 3 files into context at the same time. Maximize use of parallel tool calls where possible to increase speed and efficiency. However, if some tool calls depend on previous calls to inform dependent values like the parameters, do NOT call these tools in parallel and instead call them sequentially. Never use placeholders or guess missing parameters in tool calls.
</use_parallel_tool_calls>

<investigate_before_answering>
Never speculate about code you have not opened. If the user references a specific file, you MUST read the file before answering. Make sure to investigate and read relevant files BEFORE answering questions about the codebase. Never make any claims about code before investigating unless you are certain of the correct answer - give grounded and hallucination-free answers.
</investigate_before_answering>

<tool_result_reflection>
After receiving tool results, carefully reflect on their quality and determine optimal next steps before proceeding. Use your thinking to plan and iterate based on this new information, and then take the best next action.
</tool_result_reflection>`;
/**
* Register the built-in Claude Haiku 4.5 harness profile.
*
* Same universal Claude guidance as Sonnet 4.6. No Haiku-specific
* overlays.
*
* @internal
*/
function register$1() {
	registerHarnessProfileImpl("anthropic:claude-haiku-4-5", createHarnessProfile({ systemPromptSuffix: SYSTEM_PROMPT_SUFFIX$1 }));
}
/**
* Model specs that receive the Codex harness profile.
*
* All variants share the same trained response style, so a single
* suffix works across the family.
*/
var CODEX_MODEL_SPECS = [
	"openai:gpt-5.1-codex",
	"openai:gpt-5.2-codex",
	"openai:gpt-5.3-codex"
];
var SYSTEM_PROMPT_SUFFIX = `\
## Codex-Specific Behavior

- You are an autonomous senior engineer. Once given a direction, proactively \
gather context, plan, implement, and verify without waiting for additional \
prompts at each step.
- Persist until the task is fully handled end-to-end within the current turn \
whenever feasible. Do not stop at analysis or partial fixes; carry changes \
through implementation, verification, and a clear explanation of outcomes.
- Bias to action: default to implementing with reasonable assumptions. Do not \
end your turn with clarifications unless truly blocked.
- Do not communicate an upfront plan or status preamble before acting. Just act.

## Parallel Tool Use

- Before any tool call, decide ALL files and resources you will need.
- Batch reads, searches, and other independent operations into parallel tool \
calls instead of issuing them one at a time.
- Only make sequential calls when you truly cannot determine the next step \
without seeing a prior result.

## Plan Hygiene

- Before finishing, reconcile every TODO or plan item created via write_todos. \
Mark each as done, blocked (with a one-sentence reason), or cancelled. Do not \
finish with pending items.`;
function createExtraMiddleware() {
	return [todoListMiddleware()];
}
/**
* Register the built-in Codex harness profiles.
*
* Registers the same profile under each Codex model spec. Per-model
* keys (not the bare `"openai"` prefix) keep the default behavior of
* non-Codex OpenAI models unchanged.
*
* @internal
*/
function register() {
	const profile = createHarnessProfile({
		systemPromptSuffix: SYSTEM_PROMPT_SUFFIX,
		extraMiddleware: createExtraMiddleware
	});
	for (const spec of CODEX_MODEL_SPECS) registerHarnessProfileImpl(spec, profile);
}
/**
* Register all built-in harness profiles and snapshot the resulting
* registry keys as the builtin baseline.
*
* Called once during lazy bootstrap by `ensureBuiltinsLoaded()`.
* Uses `registerHarnessProfileImpl` internally (not the public
* `registerHarnessProfile`) to avoid triggering re-entrant bootstrap.
*
* @internal
*/
function loadBuiltinProfiles() {
	register$3();
	register$2();
	register$1();
	register();
	snapshotBuiltinKeys();
}
/**
* Process-global symbol key for the harness profile registry. The `.v1`
* suffix is a version gate — bump it when the {@link HarnessProfileRegistry}
* shape changes in a breaking way so that incompatible versions coexist
* on `globalThis` without corrupting each other.
*/
var PROFILE_REGISTRY_KEY = Symbol.for("deepagents.harness-profiles.v1");
/**
* Returns the process-global registry, creating it on first access.
*/
function getHarnessProfileRegistry() {
	const global = globalThis;
	if (global[PROFILE_REGISTRY_KEY] == null) global[PROFILE_REGISTRY_KEY] = {
		profiles: /* @__PURE__ */ new Map(),
		builtinKeys: /* @__PURE__ */ new Set(),
		builtinsLoaded: false
	};
	return global[PROFILE_REGISTRY_KEY];
}
/**
* Ensure lazy-loaded builtin profiles have been registered.
*
* Called by the public `registerHarnessProfile` and lookup functions.
* Built-in registration modules call `registerHarnessProfileImpl`
* directly to avoid re-entrant bootstrap.
*
* @internal
*/
function ensureBuiltinsLoaded() {
	const registry = getHarnessProfileRegistry();
	if (registry.builtinsLoaded) return;
	registry.builtinsLoaded = true;
	loadBuiltinProfiles();
}
/**
* Snapshot the current registry keys as the builtin baseline.
*
* Called by the builtin loader after all built-in profiles are
* registered. This allows {@link hasUserRegisteredProfiles} to
* distinguish user registrations from built-ins.
*
* @internal
*/
function snapshotBuiltinKeys() {
	const registry = getHarnessProfileRegistry();
	registry.builtinKeys = new Set(registry.profiles.keys());
}
/**
* Core registration implementation. Does not trigger lazy bootstrap.
*
* Used by built-in profile modules during bootstrap. External callers
* should use {@link registerHarnessProfile} instead.
*
* @internal
*/
function registerHarnessProfileImpl(key, profile) {
	key = validateProfileKey(key);
	const { profiles } = getHarnessProfileRegistry();
	const existing = profiles.get(key);
	if (existing !== void 0) profiles.set(key, mergeProfiles(existing, profile));
	else profiles.set(key, profile);
}
/**
* Look up the {@link HarnessProfile} for a model spec string.
*
* Resolution order:
*
* 1. **Exact match** on `spec` (e.g., `"openai:gpt-5.4"`).
* 2. **Provider prefix** (everything before `:`) when `spec` contains
*    a colon and both halves are non-empty.
* 3. When both exist, they are **merged** (provider as base, exact as
*    override).
* 4. `undefined` when nothing matches.
*
* Malformed specs (empty, multiple colons, empty halves) return
* `undefined` without consulting the registry.
*
* @param spec - Model spec in `"provider:model"` format, or a bare
*   provider/model identifier.
* @returns The matching profile, or `undefined`.
*/
function getHarnessProfile(spec) {
	if (spec.split(":").length > 2) return;
	const colonIdx = spec.indexOf(":");
	const hasColon = colonIdx !== -1;
	const provider = hasColon ? spec.slice(0, colonIdx) : void 0;
	const model = hasColon ? spec.slice(colonIdx + 1) : void 0;
	if (hasColon && (!provider || !model)) return;
	ensureBuiltinsLoaded();
	const { profiles } = getHarnessProfileRegistry();
	const exact = profiles.get(spec);
	const base = provider ? profiles.get(provider) : void 0;
	if (exact !== void 0 && base !== void 0) return mergeProfiles(base, exact);
	return exact ?? base;
}
/**
* Resolve the harness profile for a model, falling back to the
* empty default when nothing matches.
*
* When `spec` is set (the original model parameter), it drives the
* lookup directly. When absent (pre-built model instance),
* `providerHint` and `identifierHint` are used to construct lookup
* keys.
*
* @param opts - Model metadata used to resolve the profile.
* @returns The resolved profile (never `undefined`).
*
* @internal
*/
function resolveHarnessProfile(opts = {}) {
	const { spec, providerHint, identifierHint } = opts;
	if (spec !== void 0) return getHarnessProfile(spec) ?? EMPTY_HARNESS_PROFILE;
	if (providerHint && identifierHint && !identifierHint.includes(":")) {
		const profile = getHarnessProfile(`${providerHint}:${identifierHint}`);
		if (profile) return profile;
	}
	if (identifierHint && identifierHint.includes(":")) {
		const profile = getHarnessProfile(identifierHint);
		if (profile) return profile;
	}
	if (providerHint) {
		const profile = getHarnessProfile(providerHint);
		if (profile) return profile;
	}
	return EMPTY_HARNESS_PROFILE;
}
/**
* Apply a profile's prompt overlay to a base prompt string.
*
* - `baseSystemPrompt` (when set) replaces `basePrompt` entirely.
* - `systemPromptSuffix` (when set) is appended with `\n\n`.
*
* Both are independently optional. A profile that sets only the suffix
* layers it on top of whatever base the caller passes in.
*
* Used uniformly for the main agent, declarative subagents, and the
* auto-added general-purpose subagent.
*
* @param profile - The harness profile to apply.
* @param basePrompt - The active base prompt (empty by default).
* @returns The assembled prompt string.
*/
function applyProfilePrompt(profile, basePrompt) {
	const prompt = profile.baseSystemPrompt !== void 0 ? profile.baseSystemPrompt : basePrompt;
	if (profile.systemPromptSuffix !== void 0) return prompt ? `${prompt}\n\n${profile.systemPromptSuffix}` : profile.systemPromptSuffix;
	return prompt;
}
function normalizeSystemPrompt(systemPrompt) {
	if (systemPrompt === void 0) return {};
	if (typeof systemPrompt === "string" || SystemMessage.isInstance(systemPrompt)) return { prefix: systemPrompt };
	return systemPrompt;
}
function assemblePromptParts(parts) {
	const nonEmptyParts = parts.filter((part) => part != null && (typeof part !== "string" || part.length > 0));
	if (nonEmptyParts.length === 0) return "";
	if (nonEmptyParts.every((part) => typeof part === "string")) return nonEmptyParts.join("\n\n");
	const contentBlocks = [];
	for (const [index, part] of nonEmptyParts.entries()) {
		if (index > 0) contentBlocks.push({
			type: "text",
			text: "\n\n"
		});
		if (SystemMessage.isInstance(part)) contentBlocks.push(...part.contentBlocks);
		else contentBlocks.push({
			type: "text",
			text: part
		});
	}
	return new SystemMessage({ contentBlocks });
}
var BUILTIN_TOOL_NAMES = /* @__PURE__ */ new Set([
	...FILESYSTEM_TOOL_NAMES,
	...ASYNC_TASK_TOOL_NAMES,
	"task"
]);
/**
* Create a Deep Agent.
*
* This is the main entry point for building a production-style agent with
* deepagents. It gives you a strong default runtime (filesystem, tasks,
* subagents, summarization) and lets you opt into skills, memory,
* human-in-the-loop interrupts, async subagents, and custom middleware.
*
* The runtime is intentionally opinionated: defaults work out of the box, and
* when you customize behavior, the middleware ordering stays deterministic.
*
* @param params Configuration parameters for the agent
* @returns Deep Agent instance with inferred state/response types
*
* @example
* ```typescript
* // Custom state from middleware and/or the agent stateSchema param — both are merged
* const ResearchMiddleware = createMiddleware({
*   name: "ResearchMiddleware",
*   stateSchema: z.object({ research: z.string().default("") }),
* });
*
* const agent = createDeepAgent({
*   middleware: [ResearchMiddleware],
*   stateSchema: z.object({ author: z.string().default("Me") }),
* });
*
* const result = await agent.invoke({ messages: [...] });
* // result.research and result.author are properly typed as strings
* ```
*/
function createDeepAgent(params = {}) {
	const { model = "anthropic:claude-sonnet-4-6", tools = [], systemPrompt, stateSchema, middleware: customMiddleware = [], subagents = [], responseFormat, contextSchema, checkpointer, store, backend = (config) => new StateBackend(config), interruptOn, name, memory, skills, permissions = [], streamTransformers = [] } = params;
	const collidingTools = tools.map((t) => t.name).filter((n) => typeof n === "string" && BUILTIN_TOOL_NAMES.has(n));
	if (collidingTools.length > 0) throw new ConfigurationError(`Tool name(s) [${collidingTools.join(", ")}] conflict with built-in tools. Rename your custom tools to avoid this.`, "TOOL_NAME_COLLISION");
	const harnessProfile = typeof model === "string" ? resolveHarnessProfile({ spec: model }) : resolveHarnessProfile({
		providerHint: getModelProvider(model),
		identifierHint: getModelIdentifier(model)
	});
	const filesystemTools = FILESYSTEM_TOOL_NAMES.filter((toolName) => !harnessProfile.excludedTools.has(toolName));
	const profileFilesystemTools = filesystemTools.length === FILESYSTEM_TOOL_NAMES.length || !filesystemTools.includes("read_file") ? void 0 : filesystemTools;
	const toolOverrides = harnessProfile.toolDescriptionOverrides;
	const effectiveTools = Object.keys(toolOverrides).length > 0 ? tools.map((t) => t.name in toolOverrides ? Object.assign(Object.create(Object.getPrototypeOf(t)), t, { description: toolOverrides[t.name] }) : t) : tools;
	const anthropicModel = isAnthropicModel(model);
	const bedrockModel = isBedrockConverseModel(model);
	let cacheMiddleware = [];
	if (anthropicModel) cacheMiddleware = [
		...cacheMiddleware,
		anthropicPromptCachingMiddleware({
			unsupportedModelBehavior: "ignore",
			minMessagesToCache: 1
		}),
		createCacheBreakpointMiddleware()
	];
	if (bedrockModel) cacheMiddleware = [...cacheMiddleware, bedrockPromptCachingMiddleware({ unsupportedModelBehavior: "ignore" })];
	/**
	* Process subagents to add SkillsMiddleware for those with their own skills.
	*
	* Custom subagents do NOT inherit skills from the main agent by default.
	* Only the general-purpose subagent inherits the main agent's skills.
	* If a custom subagent needs skills, it must specify its own `skills` array.
	*/
	const createSubagentDefaultMiddleware = (input) => {
		const effectivePermissions = input.permissions ?? permissions;
		return [
			createFilesystemMiddleware({
				backend,
				permissions: effectivePermissions,
				tools: profileFilesystemTools
			}),
			createSummarizationMiddleware({ backend }),
			createPatchToolCallsMiddleware(),
			...input.skills != null && input.skills.length > 0 ? [createSkillsMiddleware({
				backend,
				sources: input.skills
			})] : []
		];
	};
	const normalizeSubagentSpec = (input) => {
		let subagentMiddleware = mergeMiddlewareStack(createSubagentDefaultMiddleware(input), input.middleware ?? [], [...resolveMiddleware(harnessProfile.extraMiddleware), ...cacheMiddleware]);
		if (harnessProfile.excludedMiddleware.size > 0) subagentMiddleware = subagentMiddleware.filter((middleware) => !harnessProfile.excludedMiddleware.has(middleware.name));
		return {
			...input,
			tools: input.tools ?? [],
			middleware: subagentMiddleware
		};
	};
	const allSubagents = subagents;
	const asyncSubAgents = allSubagents.filter((item) => isAsyncSubAgent(item));
	const inlineSubagents = allSubagents.filter((item) => !isAsyncSubAgent(item)).map((item) => "runnable" in item ? item : normalizeSubagentSpec(item));
	const gpConfig = harnessProfile.generalPurposeSubagent;
	if (!(gpConfig?.enabled === false) && !inlineSubagents.some((item) => item.name === GENERAL_PURPOSE_SUBAGENT["name"])) {
		const gpSystemPrompt = gpConfig?.systemPrompt ?? applyProfilePrompt(harnessProfile, GENERAL_PURPOSE_SUBAGENT.systemPrompt);
		const generalPurposeSpec = normalizeSubagentSpec({
			...GENERAL_PURPOSE_SUBAGENT,
			description: gpConfig?.description ?? GENERAL_PURPOSE_SUBAGENT.description,
			systemPrompt: gpSystemPrompt,
			model,
			skills,
			tools: effectiveTools
		});
		generalPurposeSpec.middleware = mergeMiddlewareStack(generalPurposeSpec.middleware ?? [], customMiddleware, [], { appendNew: false });
		inlineSubagents.unshift(generalPurposeSpec);
	}
	const skillsMiddleware = skills != null && skills.length > 0 ? [createSkillsMiddleware({
		backend,
		sources: skills
	})] : [];
	const [fsMiddleware, subagentMiddleware, summarizationMiddleware, patchToolCallsMiddleware] = [
		createFilesystemMiddleware({
			backend,
			permissions,
			tools: profileFilesystemTools
		}),
		createSubAgentMiddleware({
			defaultModel: model,
			defaultTools: effectiveTools,
			defaultInterruptOn: interruptOn,
			subagents: inlineSubagents,
			generalPurposeAgent: false
		}),
		createSummarizationMiddleware({ backend }),
		createPatchToolCallsMiddleware()
	];
	let middleware = mergeMiddlewareStack([
		...skillsMiddleware,
		fsMiddleware,
		subagentMiddleware,
		summarizationMiddleware,
		patchToolCallsMiddleware,
		...asyncSubAgents.length > 0 ? [createAsyncSubAgentMiddleware({ asyncSubAgents })] : []
	], customMiddleware, [
		...resolveMiddleware(harnessProfile.extraMiddleware),
		...cacheMiddleware,
		...memory && memory.length > 0 ? [createMemoryMiddleware({
			backend,
			sources: memory,
			addCacheControl: anthropicModel
		})] : [],
		...interruptOn ? [humanInTheLoopMiddleware({ interruptOn })] : []
	]);
	if (harnessProfile.excludedMiddleware.size > 0) {
		const excluded = harnessProfile.excludedMiddleware;
		middleware = middleware.filter((entry) => !excluded.has(entry.name));
	}
	if (harnessProfile.excludedTools.size > 0) middleware.push(createToolExclusionMiddleware(harnessProfile.excludedTools));
	const promptConfig = normalizeSystemPrompt(systemPrompt);
	const activeBasePrompt = promptConfig.base !== void 0 ? promptConfig.base : harnessProfile.baseSystemPrompt;
	const finalSystemPrompt = assemblePromptParts([
		promptConfig.prefix,
		activeBasePrompt,
		promptConfig.suffix,
		harnessProfile.systemPromptSuffix
	]);
	/**
	* Return as DeepAgent with proper DeepAgentTypeConfig
	* - Response: InferStructuredResponse<TResponse> (unwraps ToolStrategy<T>/ProviderStrategy<T> → T)
	* - State: User-provided stateSchema, merged with middleware-derived state downstream
	* - Context: ContextSchema
	* - Middleware: AllMiddleware (built-in + custom + subagent middleware for state inference)
	* - Tools: TTools
	* - Subagents: TSubagents (for type-safe streaming)
	* - StreamTransformers: TStreamTransformers
	*/
	return createAgent({
		model,
		...finalSystemPrompt !== "" && { systemPrompt: finalSystemPrompt },
		stateSchema,
		tools: effectiveTools,
		middleware,
		...responseFormat !== null && { responseFormat },
		contextSchema,
		checkpointer,
		store,
		name,
		streamTransformers
	}).withConfig({
		recursionLimit: 1e4,
		metadata: {
			ls_integration: "deepagents",
			lc_agent_name: name
		}
	});
}
context`
  You are a Deep Agent, an AI assistant that helps users accomplish tasks using tools. You respond with text and tool calls. The user can see your responses and tool outputs in real time.

  ## Core Behavior

  - Be concise and direct. Don't over-explain unless asked.
  - NEVER add unnecessary preamble (\"Sure!\", \"Great question!\", \"I'll now...\").
  - Don't say \"I'll now do X\" — just do it.
  - If the request is ambiguous, ask questions before acting.
  - If asked how to approach something, explain first, then act.

  ## Professional Objectivity

  - Prioritize accuracy over validating the user's beliefs
  - Disagree respectfully when the user is incorrect
  - Avoid unnecessary superlatives, praise, or emotional validation

  ## Doing Tasks

  When the user asks you to do something:

  1. **Understand first** — read relevant files, check existing patterns. Quick but thorough — gather enough evidence to start, then iterate.
  2. **Act** — implement the solution. Work quickly but accurately.
  3. **Verify** — check your work against what was asked, not against your own output. Your first attempt is rarely correct — iterate.

  Keep working until the task is fully complete. Don't stop partway and explain what you would do — just do it. Only yield back to the user when the task is done or you're genuinely blocked.

  **When things go wrong:**
  - If something fails repeatedly, stop and analyze *why* — don't keep retrying the same approach.
  - If you're blocked, tell the user what's wrong and ask for guidance.

  ## Progress Updates

  For longer tasks, provide brief progress updates at reasonable intervals — a concise sentence recapping what you've done and what's next.
`;
context`
  ## \`task\` (subagent spawner)

  You have access to a \`task\` tool to launch short-lived subagents that handle isolated tasks. These agents are ephemeral — they live only for the duration of the task and return a single result.

  When to use the task tool:
  - When a task is complex and multi-step, and can be fully delegated in isolation
  - When a task is independent of other tasks and can run in parallel
  - When a task requires focused reasoning or heavy token/context usage that would bloat the orchestrator thread
  - When sandboxing improves reliability (e.g. code execution, structured searches, data formatting)
  - When you only care about the output of the subagent, and not the intermediate steps (ex. performing a lot of research and then returned a synthesized report, performing a series of computations or lookups to achieve a concise, relevant answer.)

  Subagent lifecycle:
  1. **Spawn** → Provide clear role, instructions, and expected output
  2. **Run** → The subagent completes the task autonomously
  3. **Return** → The subagent provides a single structured result
  4. **Reconcile** → Incorporate or synthesize the result into the main thread

  When NOT to use the task tool:
  - If you need to see the intermediate reasoning or steps after the subagent has completed (the task tool hides them)
  - If the task is trivial (a few tool calls or simple lookup)
  - If delegating does not reduce token usage, complexity, or context switching
  - If splitting would add latency without benefit

  ## Important Task Tool Usage Notes to Remember
  - Whenever possible, parallelize the work that you do. This is true for both tool_calls, and for tasks. Whenever you have independent steps to complete - make tool_calls, or kick off tasks (subagents) in parallel to accomplish them faster. This saves time for the user, which is incredibly important.
  - Remember to use the \`task\` tool to silo independent tasks within a multi-part objective.
  - You should use the \`task\` tool whenever you have a complex task that will take multiple steps, and is independent from other tasks that the agent needs to complete. These agents are highly competent and efficient.
`;
context`
  ## Execute Tool \`execute\`

  You have access to an \`execute\` tool for running shell commands in a sandboxed environment.
  Use this tool to run commands, scripts, tests, builds, and other shell operations.

  - execute: run a shell command in the sandbox (returns output and exit code)
`;
//#endregion
//#region node_modules/fast-glob/out/utils/array.js
var require_array = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.splitWhen = exports.flatten = void 0;
	function flatten(items) {
		return items.reduce((collection, item) => [].concat(collection, item), []);
	}
	exports.flatten = flatten;
	function splitWhen(items, predicate) {
		const result = [[]];
		let groupIndex = 0;
		for (const item of items) if (predicate(item)) {
			groupIndex++;
			result[groupIndex] = [];
		} else result[groupIndex].push(item);
		return result;
	}
	exports.splitWhen = splitWhen;
}));
//#endregion
//#region node_modules/fast-glob/out/utils/errno.js
var require_errno = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.isEnoentCodeError = void 0;
	function isEnoentCodeError(error) {
		return error.code === "ENOENT";
	}
	exports.isEnoentCodeError = isEnoentCodeError;
}));
//#endregion
//#region node_modules/fast-glob/out/utils/fs.js
var require_fs = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.createDirentFromStats = void 0;
	var DirentFromStats = class {
		constructor(name, stats) {
			this.name = name;
			this.isBlockDevice = stats.isBlockDevice.bind(stats);
			this.isCharacterDevice = stats.isCharacterDevice.bind(stats);
			this.isDirectory = stats.isDirectory.bind(stats);
			this.isFIFO = stats.isFIFO.bind(stats);
			this.isFile = stats.isFile.bind(stats);
			this.isSocket = stats.isSocket.bind(stats);
			this.isSymbolicLink = stats.isSymbolicLink.bind(stats);
		}
	};
	function createDirentFromStats(name, stats) {
		return new DirentFromStats(name, stats);
	}
	exports.createDirentFromStats = createDirentFromStats;
}));
//#endregion
//#region node_modules/fast-glob/out/utils/path.js
var require_path = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.convertPosixPathToPattern = exports.convertWindowsPathToPattern = exports.convertPathToPattern = exports.escapePosixPath = exports.escapeWindowsPath = exports.escape = exports.removeLeadingDotSegment = exports.makeAbsolute = exports.unixify = void 0;
	var os$2 = __require("os");
	var path$4 = __require("path");
	var IS_WINDOWS_PLATFORM = os$2.platform() === "win32";
	var LEADING_DOT_SEGMENT_CHARACTERS_COUNT = 2;
	/**
	* All non-escaped special characters.
	* Posix: ()*?[]{|}, !+@ before (, ! at the beginning, \\ before non-special characters.
	* Windows: (){}[], !+@ before (, ! at the beginning.
	*/
	var POSIX_UNESCAPED_GLOB_SYMBOLS_RE = /(\\?)([()*?[\]{|}]|^!|[!+@](?=\()|\\(?![!()*+?@[\]{|}]))/g;
	var WINDOWS_UNESCAPED_GLOB_SYMBOLS_RE = /(\\?)([()[\]{}]|^!|[!+@](?=\())/g;
	/**
	* The device path (\\.\ or \\?\).
	* https://learn.microsoft.com/en-us/dotnet/standard/io/file-path-formats#dos-device-paths
	*/
	var DOS_DEVICE_PATH_RE = /^\\\\([.?])/;
	/**
	* All backslashes except those escaping special characters.
	* Windows: !()+@{}
	* https://learn.microsoft.com/en-us/windows/win32/fileio/naming-a-file#naming-conventions
	*/
	var WINDOWS_BACKSLASHES_RE = /\\(?![!()+@[\]{}])/g;
	/**
	* Designed to work only with simple paths: `dir\\file`.
	*/
	function unixify(filepath) {
		return filepath.replace(/\\/g, "/");
	}
	exports.unixify = unixify;
	function makeAbsolute(cwd, filepath) {
		return path$4.resolve(cwd, filepath);
	}
	exports.makeAbsolute = makeAbsolute;
	function removeLeadingDotSegment(entry) {
		if (entry.charAt(0) === ".") {
			const secondCharactery = entry.charAt(1);
			if (secondCharactery === "/" || secondCharactery === "\\") return entry.slice(LEADING_DOT_SEGMENT_CHARACTERS_COUNT);
		}
		return entry;
	}
	exports.removeLeadingDotSegment = removeLeadingDotSegment;
	exports.escape = IS_WINDOWS_PLATFORM ? escapeWindowsPath : escapePosixPath;
	function escapeWindowsPath(pattern) {
		return pattern.replace(WINDOWS_UNESCAPED_GLOB_SYMBOLS_RE, "\\$2");
	}
	exports.escapeWindowsPath = escapeWindowsPath;
	function escapePosixPath(pattern) {
		return pattern.replace(POSIX_UNESCAPED_GLOB_SYMBOLS_RE, "\\$2");
	}
	exports.escapePosixPath = escapePosixPath;
	exports.convertPathToPattern = IS_WINDOWS_PLATFORM ? convertWindowsPathToPattern : convertPosixPathToPattern;
	function convertWindowsPathToPattern(filepath) {
		return escapeWindowsPath(filepath).replace(DOS_DEVICE_PATH_RE, "//$1").replace(WINDOWS_BACKSLASHES_RE, "/");
	}
	exports.convertWindowsPathToPattern = convertWindowsPathToPattern;
	function convertPosixPathToPattern(filepath) {
		return escapePosixPath(filepath);
	}
	exports.convertPosixPathToPattern = convertPosixPathToPattern;
}));
//#endregion
//#region node_modules/is-extglob/index.js
var require_is_extglob = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/*!
	* is-extglob <https://github.com/jonschlinkert/is-extglob>
	*
	* Copyright (c) 2014-2016, Jon Schlinkert.
	* Licensed under the MIT License.
	*/
	module.exports = function isExtglob(str) {
		if (typeof str !== "string" || str === "") return false;
		var match;
		while (match = /(\\).|([@?!+*]\(.*\))/g.exec(str)) {
			if (match[2]) return true;
			str = str.slice(match.index + match[0].length);
		}
		return false;
	};
}));
//#endregion
//#region node_modules/is-glob/index.js
var require_is_glob = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/*!
	* is-glob <https://github.com/jonschlinkert/is-glob>
	*
	* Copyright (c) 2014-2017, Jon Schlinkert.
	* Released under the MIT License.
	*/
	var isExtglob = require_is_extglob();
	var chars = {
		"{": "}",
		"(": ")",
		"[": "]"
	};
	var strictCheck = function(str) {
		if (str[0] === "!") return true;
		var index = 0;
		var pipeIndex = -2;
		var closeSquareIndex = -2;
		var closeCurlyIndex = -2;
		var closeParenIndex = -2;
		var backSlashIndex = -2;
		while (index < str.length) {
			if (str[index] === "*") return true;
			if (str[index + 1] === "?" && /[\].+)]/.test(str[index])) return true;
			if (closeSquareIndex !== -1 && str[index] === "[" && str[index + 1] !== "]") {
				if (closeSquareIndex < index) closeSquareIndex = str.indexOf("]", index);
				if (closeSquareIndex > index) {
					if (backSlashIndex === -1 || backSlashIndex > closeSquareIndex) return true;
					backSlashIndex = str.indexOf("\\", index);
					if (backSlashIndex === -1 || backSlashIndex > closeSquareIndex) return true;
				}
			}
			if (closeCurlyIndex !== -1 && str[index] === "{" && str[index + 1] !== "}") {
				closeCurlyIndex = str.indexOf("}", index);
				if (closeCurlyIndex > index) {
					backSlashIndex = str.indexOf("\\", index);
					if (backSlashIndex === -1 || backSlashIndex > closeCurlyIndex) return true;
				}
			}
			if (closeParenIndex !== -1 && str[index] === "(" && str[index + 1] === "?" && /[:!=]/.test(str[index + 2]) && str[index + 3] !== ")") {
				closeParenIndex = str.indexOf(")", index);
				if (closeParenIndex > index) {
					backSlashIndex = str.indexOf("\\", index);
					if (backSlashIndex === -1 || backSlashIndex > closeParenIndex) return true;
				}
			}
			if (pipeIndex !== -1 && str[index] === "(" && str[index + 1] !== "|") {
				if (pipeIndex < index) pipeIndex = str.indexOf("|", index);
				if (pipeIndex !== -1 && str[pipeIndex + 1] !== ")") {
					closeParenIndex = str.indexOf(")", pipeIndex);
					if (closeParenIndex > pipeIndex) {
						backSlashIndex = str.indexOf("\\", pipeIndex);
						if (backSlashIndex === -1 || backSlashIndex > closeParenIndex) return true;
					}
				}
			}
			if (str[index] === "\\") {
				var open = str[index + 1];
				index += 2;
				var close = chars[open];
				if (close) {
					var n = str.indexOf(close, index);
					if (n !== -1) index = n + 1;
				}
				if (str[index] === "!") return true;
			} else index++;
		}
		return false;
	};
	var relaxedCheck = function(str) {
		if (str[0] === "!") return true;
		var index = 0;
		while (index < str.length) {
			if (/[*?{}()[\]]/.test(str[index])) return true;
			if (str[index] === "\\") {
				var open = str[index + 1];
				index += 2;
				var close = chars[open];
				if (close) {
					var n = str.indexOf(close, index);
					if (n !== -1) index = n + 1;
				}
				if (str[index] === "!") return true;
			} else index++;
		}
		return false;
	};
	module.exports = function isGlob(str, options) {
		if (typeof str !== "string" || str === "") return false;
		if (isExtglob(str)) return true;
		var check = strictCheck;
		if (options && options.strict === false) check = relaxedCheck;
		return check(str);
	};
}));
//#endregion
//#region node_modules/fast-glob/node_modules/glob-parent/index.js
var require_glob_parent = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var isGlob = require_is_glob();
	var pathPosixDirname = __require("path").posix.dirname;
	var isWin32 = __require("os").platform() === "win32";
	var slash = "/";
	var backslash = /\\/g;
	var enclosure = /[\{\[].*[\}\]]$/;
	var globby = /(^|[^\\])([\{\[]|\([^\)]+$)/;
	var escaped = /\\([\!\*\?\|\[\]\(\)\{\}])/g;
	/**
	* @param {string} str
	* @param {Object} opts
	* @param {boolean} [opts.flipBackslashes=true]
	* @returns {string}
	*/
	module.exports = function globParent(str, opts) {
		if (Object.assign({ flipBackslashes: true }, opts).flipBackslashes && isWin32 && str.indexOf(slash) < 0) str = str.replace(backslash, slash);
		if (enclosure.test(str)) str += slash;
		str += "a";
		do
			str = pathPosixDirname(str);
		while (isGlob(str) || globby.test(str));
		return str.replace(escaped, "$1");
	};
}));
//#endregion
//#region node_modules/fast-glob/out/utils/pattern.js
var require_pattern = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.isAbsolute = exports.partitionAbsoluteAndRelative = exports.removeDuplicateSlashes = exports.matchAny = exports.convertPatternsToRe = exports.makeRe = exports.getPatternParts = exports.expandBraceExpansion = exports.expandPatternsWithBraceExpansion = exports.isAffectDepthOfReadingPattern = exports.endsWithSlashGlobStar = exports.hasGlobStar = exports.getBaseDirectory = exports.isPatternRelatedToParentDirectory = exports.getPatternsOutsideCurrentDirectory = exports.getPatternsInsideCurrentDirectory = exports.getPositivePatterns = exports.getNegativePatterns = exports.isPositivePattern = exports.isNegativePattern = exports.convertToNegativePattern = exports.convertToPositivePattern = exports.isDynamicPattern = exports.isStaticPattern = void 0;
	var path$3 = __require("path");
	var globParent = require_glob_parent();
	var micromatch = require_micromatch();
	var GLOBSTAR = "**";
	var ESCAPE_SYMBOL = "\\";
	var COMMON_GLOB_SYMBOLS_RE = /[*?]|^!/;
	var REGEX_CHARACTER_CLASS_SYMBOLS_RE = /\[[^[]*]/;
	var REGEX_GROUP_SYMBOLS_RE = /(?:^|[^!*+?@])\([^(]*\|[^|]*\)/;
	var GLOB_EXTENSION_SYMBOLS_RE = /[!*+?@]\([^(]*\)/;
	var BRACE_EXPANSION_SEPARATORS_RE = /,|\.\./;
	/**
	* Matches a sequence of two or more consecutive slashes, excluding the first two slashes at the beginning of the string.
	* The latter is due to the presence of the device path at the beginning of the UNC path.
	*/
	var DOUBLE_SLASH_RE = /(?!^)\/{2,}/g;
	function isStaticPattern(pattern, options = {}) {
		return !isDynamicPattern(pattern, options);
	}
	exports.isStaticPattern = isStaticPattern;
	function isDynamicPattern(pattern, options = {}) {
		/**
		* A special case with an empty string is necessary for matching patterns that start with a forward slash.
		* An empty string cannot be a dynamic pattern.
		* For example, the pattern `/lib/*` will be spread into parts: '', 'lib', '*'.
		*/
		if (pattern === "") return false;
		/**
		* When the `caseSensitiveMatch` option is disabled, all patterns must be marked as dynamic, because we cannot check
		* filepath directly (without read directory).
		*/
		if (options.caseSensitiveMatch === false || pattern.includes(ESCAPE_SYMBOL)) return true;
		if (COMMON_GLOB_SYMBOLS_RE.test(pattern) || REGEX_CHARACTER_CLASS_SYMBOLS_RE.test(pattern) || REGEX_GROUP_SYMBOLS_RE.test(pattern)) return true;
		if (options.extglob !== false && GLOB_EXTENSION_SYMBOLS_RE.test(pattern)) return true;
		if (options.braceExpansion !== false && hasBraceExpansion(pattern)) return true;
		return false;
	}
	exports.isDynamicPattern = isDynamicPattern;
	function hasBraceExpansion(pattern) {
		const openingBraceIndex = pattern.indexOf("{");
		if (openingBraceIndex === -1) return false;
		const closingBraceIndex = pattern.indexOf("}", openingBraceIndex + 1);
		if (closingBraceIndex === -1) return false;
		const braceContent = pattern.slice(openingBraceIndex, closingBraceIndex);
		return BRACE_EXPANSION_SEPARATORS_RE.test(braceContent);
	}
	function convertToPositivePattern(pattern) {
		return isNegativePattern(pattern) ? pattern.slice(1) : pattern;
	}
	exports.convertToPositivePattern = convertToPositivePattern;
	function convertToNegativePattern(pattern) {
		return "!" + pattern;
	}
	exports.convertToNegativePattern = convertToNegativePattern;
	function isNegativePattern(pattern) {
		return pattern.startsWith("!") && pattern[1] !== "(";
	}
	exports.isNegativePattern = isNegativePattern;
	function isPositivePattern(pattern) {
		return !isNegativePattern(pattern);
	}
	exports.isPositivePattern = isPositivePattern;
	function getNegativePatterns(patterns) {
		return patterns.filter(isNegativePattern);
	}
	exports.getNegativePatterns = getNegativePatterns;
	function getPositivePatterns(patterns) {
		return patterns.filter(isPositivePattern);
	}
	exports.getPositivePatterns = getPositivePatterns;
	/**
	* Returns patterns that can be applied inside the current directory.
	*
	* @example
	* // ['./*', '*', 'a/*']
	* getPatternsInsideCurrentDirectory(['./*', '*', 'a/*', '../*', './../*'])
	*/
	function getPatternsInsideCurrentDirectory(patterns) {
		return patterns.filter((pattern) => !isPatternRelatedToParentDirectory(pattern));
	}
	exports.getPatternsInsideCurrentDirectory = getPatternsInsideCurrentDirectory;
	/**
	* Returns patterns to be expanded relative to (outside) the current directory.
	*
	* @example
	* // ['../*', './../*']
	* getPatternsInsideCurrentDirectory(['./*', '*', 'a/*', '../*', './../*'])
	*/
	function getPatternsOutsideCurrentDirectory(patterns) {
		return patterns.filter(isPatternRelatedToParentDirectory);
	}
	exports.getPatternsOutsideCurrentDirectory = getPatternsOutsideCurrentDirectory;
	function isPatternRelatedToParentDirectory(pattern) {
		return pattern.startsWith("..") || pattern.startsWith("./..");
	}
	exports.isPatternRelatedToParentDirectory = isPatternRelatedToParentDirectory;
	function getBaseDirectory(pattern) {
		return globParent(pattern, { flipBackslashes: false });
	}
	exports.getBaseDirectory = getBaseDirectory;
	function hasGlobStar(pattern) {
		return pattern.includes(GLOBSTAR);
	}
	exports.hasGlobStar = hasGlobStar;
	function endsWithSlashGlobStar(pattern) {
		return pattern.endsWith("/**");
	}
	exports.endsWithSlashGlobStar = endsWithSlashGlobStar;
	function isAffectDepthOfReadingPattern(pattern) {
		const basename = path$3.basename(pattern);
		return endsWithSlashGlobStar(pattern) || isStaticPattern(basename);
	}
	exports.isAffectDepthOfReadingPattern = isAffectDepthOfReadingPattern;
	function expandPatternsWithBraceExpansion(patterns) {
		return patterns.reduce((collection, pattern) => {
			return collection.concat(expandBraceExpansion(pattern));
		}, []);
	}
	exports.expandPatternsWithBraceExpansion = expandPatternsWithBraceExpansion;
	function expandBraceExpansion(pattern) {
		const patterns = micromatch.braces(pattern, {
			expand: true,
			nodupes: true,
			keepEscaping: true
		});
		/**
		* Sort the patterns by length so that the same depth patterns are processed side by side.
		* `a/{b,}/{c,}/*` – `['a///*', 'a/b//*', 'a//c/*', 'a/b/c/*']`
		*/
		patterns.sort((a, b) => a.length - b.length);
		/**
		* Micromatch can return an empty string in the case of patterns like `{a,}`.
		*/
		return patterns.filter((pattern) => pattern !== "");
	}
	exports.expandBraceExpansion = expandBraceExpansion;
	function getPatternParts(pattern, options) {
		let { parts } = micromatch.scan(pattern, Object.assign(Object.assign({}, options), { parts: true }));
		/**
		* The scan method returns an empty array in some cases.
		* See micromatch/picomatch#58 for more details.
		*/
		if (parts.length === 0) parts = [pattern];
		/**
		* The scan method does not return an empty part for the pattern with a forward slash.
		* This is another part of micromatch/picomatch#58.
		*/
		if (parts[0].startsWith("/")) {
			parts[0] = parts[0].slice(1);
			parts.unshift("");
		}
		return parts;
	}
	exports.getPatternParts = getPatternParts;
	function makeRe(pattern, options) {
		return micromatch.makeRe(pattern, options);
	}
	exports.makeRe = makeRe;
	function convertPatternsToRe(patterns, options) {
		return patterns.map((pattern) => makeRe(pattern, options));
	}
	exports.convertPatternsToRe = convertPatternsToRe;
	function matchAny(entry, patternsRe) {
		return patternsRe.some((patternRe) => patternRe.test(entry));
	}
	exports.matchAny = matchAny;
	/**
	* This package only works with forward slashes as a path separator.
	* Because of this, we cannot use the standard `path.normalize` method, because on Windows platform it will use of backslashes.
	*/
	function removeDuplicateSlashes(pattern) {
		return pattern.replace(DOUBLE_SLASH_RE, "/");
	}
	exports.removeDuplicateSlashes = removeDuplicateSlashes;
	function partitionAbsoluteAndRelative(patterns) {
		const absolute = [];
		const relative = [];
		for (const pattern of patterns) if (isAbsolute(pattern)) absolute.push(pattern);
		else relative.push(pattern);
		return [absolute, relative];
	}
	exports.partitionAbsoluteAndRelative = partitionAbsoluteAndRelative;
	function isAbsolute(pattern) {
		return path$3.isAbsolute(pattern);
	}
	exports.isAbsolute = isAbsolute;
}));
//#endregion
//#region node_modules/merge2/index.js
var require_merge2 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var PassThrough = __require("stream").PassThrough;
	var slice = Array.prototype.slice;
	module.exports = merge2;
	function merge2() {
		const streamsQueue = [];
		const args = slice.call(arguments);
		let merging = false;
		let options = args[args.length - 1];
		if (options && !Array.isArray(options) && options.pipe == null) args.pop();
		else options = {};
		const doEnd = options.end !== false;
		const doPipeError = options.pipeError === true;
		if (options.objectMode == null) options.objectMode = true;
		if (options.highWaterMark == null) options.highWaterMark = 64 * 1024;
		const mergedStream = PassThrough(options);
		function addStream() {
			for (let i = 0, len = arguments.length; i < len; i++) streamsQueue.push(pauseStreams(arguments[i], options));
			mergeStream();
			return this;
		}
		function mergeStream() {
			if (merging) return;
			merging = true;
			let streams = streamsQueue.shift();
			if (!streams) {
				process.nextTick(endStream);
				return;
			}
			if (!Array.isArray(streams)) streams = [streams];
			let pipesCount = streams.length + 1;
			function next() {
				if (--pipesCount > 0) return;
				merging = false;
				mergeStream();
			}
			function pipe(stream) {
				function onend() {
					stream.removeListener("merge2UnpipeEnd", onend);
					stream.removeListener("end", onend);
					if (doPipeError) stream.removeListener("error", onerror);
					next();
				}
				function onerror(err) {
					mergedStream.emit("error", err);
				}
				if (stream._readableState.endEmitted) return next();
				stream.on("merge2UnpipeEnd", onend);
				stream.on("end", onend);
				if (doPipeError) stream.on("error", onerror);
				stream.pipe(mergedStream, { end: false });
				stream.resume();
			}
			for (let i = 0; i < streams.length; i++) pipe(streams[i]);
			next();
		}
		function endStream() {
			merging = false;
			mergedStream.emit("queueDrain");
			if (doEnd) mergedStream.end();
		}
		mergedStream.setMaxListeners(0);
		mergedStream.add = addStream;
		mergedStream.on("unpipe", function(stream) {
			stream.emit("merge2UnpipeEnd");
		});
		if (args.length) addStream.apply(null, args);
		return mergedStream;
	}
	function pauseStreams(streams, options) {
		if (!Array.isArray(streams)) {
			if (!streams._readableState && streams.pipe) streams = streams.pipe(PassThrough(options));
			if (!streams._readableState || !streams.pause || !streams.pipe) throw new Error("Only readable stream can be merged.");
			streams.pause();
		} else for (let i = 0, len = streams.length; i < len; i++) streams[i] = pauseStreams(streams[i], options);
		return streams;
	}
}));
//#endregion
//#region node_modules/fast-glob/out/utils/stream.js
var require_stream$2 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.merge = void 0;
	var merge2 = require_merge2();
	function merge(streams) {
		const mergedStream = merge2(streams);
		streams.forEach((stream) => {
			stream.once("error", (error) => mergedStream.emit("error", error));
		});
		mergedStream.once("close", () => propagateCloseEventToSources(streams));
		mergedStream.once("end", () => propagateCloseEventToSources(streams));
		return mergedStream;
	}
	exports.merge = merge;
	function propagateCloseEventToSources(streams) {
		streams.forEach((stream) => stream.emit("close"));
	}
}));
//#endregion
//#region node_modules/fast-glob/out/utils/string.js
var require_string = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.isEmpty = exports.isString = void 0;
	function isString(input) {
		return typeof input === "string";
	}
	exports.isString = isString;
	function isEmpty(input) {
		return input === "";
	}
	exports.isEmpty = isEmpty;
}));
//#endregion
//#region node_modules/fast-glob/out/utils/index.js
var require_utils = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.string = exports.stream = exports.pattern = exports.path = exports.fs = exports.errno = exports.array = void 0;
	exports.array = require_array();
	exports.errno = require_errno();
	exports.fs = require_fs();
	exports.path = require_path();
	exports.pattern = require_pattern();
	exports.stream = require_stream$2();
	exports.string = require_string();
}));
//#endregion
//#region node_modules/fast-glob/out/managers/tasks.js
var require_tasks = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.convertPatternGroupToTask = exports.convertPatternGroupsToTasks = exports.groupPatternsByBaseDirectory = exports.getNegativePatternsAsPositive = exports.getPositivePatterns = exports.convertPatternsToTasks = exports.generate = void 0;
	var utils = require_utils();
	function generate(input, settings) {
		const patterns = processPatterns(input, settings);
		const ignore = processPatterns(settings.ignore, settings);
		const positivePatterns = getPositivePatterns(patterns);
		const negativePatterns = getNegativePatternsAsPositive(patterns, ignore);
		const staticPatterns = positivePatterns.filter((pattern) => utils.pattern.isStaticPattern(pattern, settings));
		const dynamicPatterns = positivePatterns.filter((pattern) => utils.pattern.isDynamicPattern(pattern, settings));
		const staticTasks = convertPatternsToTasks(staticPatterns, negativePatterns, false);
		const dynamicTasks = convertPatternsToTasks(dynamicPatterns, negativePatterns, true);
		return staticTasks.concat(dynamicTasks);
	}
	exports.generate = generate;
	function processPatterns(input, settings) {
		let patterns = input;
		/**
		* The original pattern like `{,*,**,a/*}` can lead to problems checking the depth when matching entry
		* and some problems with the micromatch package (see fast-glob issues: #365, #394).
		*
		* To solve this problem, we expand all patterns containing brace expansion. This can lead to a slight slowdown
		* in matching in the case of a large set of patterns after expansion.
		*/
		if (settings.braceExpansion) patterns = utils.pattern.expandPatternsWithBraceExpansion(patterns);
		/**
		* If the `baseNameMatch` option is enabled, we must add globstar to patterns, so that they can be used
		* at any nesting level.
		*
		* We do this here, because otherwise we have to complicate the filtering logic. For example, we need to change
		* the pattern in the filter before creating a regular expression. There is no need to change the patterns
		* in the application. Only on the input.
		*/
		if (settings.baseNameMatch) patterns = patterns.map((pattern) => pattern.includes("/") ? pattern : `**/${pattern}`);
		/**
		* This method also removes duplicate slashes that may have been in the pattern or formed as a result of expansion.
		*/
		return patterns.map((pattern) => utils.pattern.removeDuplicateSlashes(pattern));
	}
	/**
	* Returns tasks grouped by basic pattern directories.
	*
	* Patterns that can be found inside (`./`) and outside (`../`) the current directory are handled separately.
	* This is necessary because directory traversal starts at the base directory and goes deeper.
	*/
	function convertPatternsToTasks(positive, negative, dynamic) {
		const tasks = [];
		const patternsOutsideCurrentDirectory = utils.pattern.getPatternsOutsideCurrentDirectory(positive);
		const patternsInsideCurrentDirectory = utils.pattern.getPatternsInsideCurrentDirectory(positive);
		const outsideCurrentDirectoryGroup = groupPatternsByBaseDirectory(patternsOutsideCurrentDirectory);
		const insideCurrentDirectoryGroup = groupPatternsByBaseDirectory(patternsInsideCurrentDirectory);
		tasks.push(...convertPatternGroupsToTasks(outsideCurrentDirectoryGroup, negative, dynamic));
		if ("." in insideCurrentDirectoryGroup) tasks.push(convertPatternGroupToTask(".", patternsInsideCurrentDirectory, negative, dynamic));
		else tasks.push(...convertPatternGroupsToTasks(insideCurrentDirectoryGroup, negative, dynamic));
		return tasks;
	}
	exports.convertPatternsToTasks = convertPatternsToTasks;
	function getPositivePatterns(patterns) {
		return utils.pattern.getPositivePatterns(patterns);
	}
	exports.getPositivePatterns = getPositivePatterns;
	function getNegativePatternsAsPositive(patterns, ignore) {
		return utils.pattern.getNegativePatterns(patterns).concat(ignore).map(utils.pattern.convertToPositivePattern);
	}
	exports.getNegativePatternsAsPositive = getNegativePatternsAsPositive;
	function groupPatternsByBaseDirectory(patterns) {
		return patterns.reduce((collection, pattern) => {
			const base = utils.pattern.getBaseDirectory(pattern);
			if (base in collection) collection[base].push(pattern);
			else collection[base] = [pattern];
			return collection;
		}, {});
	}
	exports.groupPatternsByBaseDirectory = groupPatternsByBaseDirectory;
	function convertPatternGroupsToTasks(positive, negative, dynamic) {
		return Object.keys(positive).map((base) => {
			return convertPatternGroupToTask(base, positive[base], negative, dynamic);
		});
	}
	exports.convertPatternGroupsToTasks = convertPatternGroupsToTasks;
	function convertPatternGroupToTask(base, positive, negative, dynamic) {
		return {
			dynamic,
			positive,
			negative,
			base,
			patterns: [].concat(positive, negative.map(utils.pattern.convertToNegativePattern))
		};
	}
	exports.convertPatternGroupToTask = convertPatternGroupToTask;
}));
//#endregion
//#region node_modules/fast-glob/out/readers/reader.js
var require_reader = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var path$2 = __require("path");
	var fsStat = require_out$1();
	var utils = require_utils();
	var Reader = class {
		constructor(_settings) {
			this._settings = _settings;
			this._fsStatSettings = new fsStat.Settings({
				followSymbolicLink: this._settings.followSymbolicLinks,
				fs: this._settings.fs,
				throwErrorOnBrokenSymbolicLink: this._settings.followSymbolicLinks
			});
		}
		_getFullEntryPath(filepath) {
			return path$2.resolve(this._settings.cwd, filepath);
		}
		_makeEntry(stats, pattern) {
			const entry = {
				name: pattern,
				path: pattern,
				dirent: utils.fs.createDirentFromStats(pattern, stats)
			};
			if (this._settings.stats) entry.stats = stats;
			return entry;
		}
		_isFatalError(error) {
			return !utils.errno.isEnoentCodeError(error) && !this._settings.suppressErrors;
		}
	};
	exports.default = Reader;
}));
//#endregion
//#region node_modules/fast-glob/out/readers/stream.js
var require_stream$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var stream_1$1 = __require("stream");
	var fsStat = require_out$1();
	var fsWalk = require_out$2();
	var reader_1 = require_reader();
	var ReaderStream = class extends reader_1.default {
		constructor() {
			super(...arguments);
			this._walkStream = fsWalk.walkStream;
			this._stat = fsStat.stat;
		}
		dynamic(root, options) {
			return this._walkStream(root, options);
		}
		static(patterns, options) {
			const filepaths = patterns.map(this._getFullEntryPath, this);
			const stream = new stream_1$1.PassThrough({ objectMode: true });
			stream._write = (index, _enc, done) => {
				return this._getEntry(filepaths[index], patterns[index], options).then((entry) => {
					if (entry !== null && options.entryFilter(entry)) stream.push(entry);
					if (index === filepaths.length - 1) stream.end();
					done();
				}).catch(done);
			};
			for (let i = 0; i < filepaths.length; i++) stream.write(i);
			return stream;
		}
		_getEntry(filepath, pattern, options) {
			return this._getStat(filepath).then((stats) => this._makeEntry(stats, pattern)).catch((error) => {
				if (options.errorFilter(error)) return null;
				throw error;
			});
		}
		_getStat(filepath) {
			return new Promise((resolve, reject) => {
				this._stat(filepath, this._fsStatSettings, (error, stats) => {
					return error === null ? resolve(stats) : reject(error);
				});
			});
		}
	};
	exports.default = ReaderStream;
}));
//#endregion
//#region node_modules/fast-glob/out/readers/async.js
var require_async$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var fsWalk = require_out$2();
	var reader_1 = require_reader();
	var stream_1 = require_stream$1();
	var ReaderAsync = class extends reader_1.default {
		constructor() {
			super(...arguments);
			this._walkAsync = fsWalk.walk;
			this._readerStream = new stream_1.default(this._settings);
		}
		dynamic(root, options) {
			return new Promise((resolve, reject) => {
				this._walkAsync(root, options, (error, entries) => {
					if (error === null) resolve(entries);
					else reject(error);
				});
			});
		}
		async static(patterns, options) {
			const entries = [];
			const stream = this._readerStream.static(patterns, options);
			return new Promise((resolve, reject) => {
				stream.once("error", reject);
				stream.on("data", (entry) => entries.push(entry));
				stream.once("end", () => resolve(entries));
			});
		}
	};
	exports.default = ReaderAsync;
}));
//#endregion
//#region node_modules/fast-glob/out/providers/matchers/matcher.js
var require_matcher = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var utils = require_utils();
	var Matcher = class {
		constructor(_patterns, _settings, _micromatchOptions) {
			this._patterns = _patterns;
			this._settings = _settings;
			this._micromatchOptions = _micromatchOptions;
			this._storage = [];
			this._fillStorage();
		}
		_fillStorage() {
			for (const pattern of this._patterns) {
				const segments = this._getPatternSegments(pattern);
				const sections = this._splitSegmentsIntoSections(segments);
				this._storage.push({
					complete: sections.length <= 1,
					pattern,
					segments,
					sections
				});
			}
		}
		_getPatternSegments(pattern) {
			return utils.pattern.getPatternParts(pattern, this._micromatchOptions).map((part) => {
				if (!utils.pattern.isDynamicPattern(part, this._settings)) return {
					dynamic: false,
					pattern: part
				};
				return {
					dynamic: true,
					pattern: part,
					patternRe: utils.pattern.makeRe(part, this._micromatchOptions)
				};
			});
		}
		_splitSegmentsIntoSections(segments) {
			return utils.array.splitWhen(segments, (segment) => segment.dynamic && utils.pattern.hasGlobStar(segment.pattern));
		}
	};
	exports.default = Matcher;
}));
//#endregion
//#region node_modules/fast-glob/out/providers/matchers/partial.js
var require_partial = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var matcher_1 = require_matcher();
	var PartialMatcher = class extends matcher_1.default {
		match(filepath) {
			const parts = filepath.split("/");
			const levels = parts.length;
			const patterns = this._storage.filter((info) => !info.complete || info.segments.length > levels);
			for (const pattern of patterns) {
				const section = pattern.sections[0];
				/**
				* In this case, the pattern has a globstar and we must read all directories unconditionally,
				* but only if the level has reached the end of the first group.
				*
				* fixtures/{a,b}/**
				*  ^ true/false  ^ always true
				*/
				if (!pattern.complete && levels > section.length) return true;
				if (parts.every((part, index) => {
					const segment = pattern.segments[index];
					if (segment.dynamic && segment.patternRe.test(part)) return true;
					if (!segment.dynamic && segment.pattern === part) return true;
					return false;
				})) return true;
			}
			return false;
		}
	};
	exports.default = PartialMatcher;
}));
//#endregion
//#region node_modules/fast-glob/out/providers/filters/deep.js
var require_deep = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var utils = require_utils();
	var partial_1 = require_partial();
	var DeepFilter = class {
		constructor(_settings, _micromatchOptions) {
			this._settings = _settings;
			this._micromatchOptions = _micromatchOptions;
		}
		getFilter(basePath, positive, negative) {
			const matcher = this._getMatcher(positive);
			const negativeRe = this._getNegativePatternsRe(negative);
			return (entry) => this._filter(basePath, entry, matcher, negativeRe);
		}
		_getMatcher(patterns) {
			return new partial_1.default(patterns, this._settings, this._micromatchOptions);
		}
		_getNegativePatternsRe(patterns) {
			const affectDepthOfReadingPatterns = patterns.filter(utils.pattern.isAffectDepthOfReadingPattern);
			return utils.pattern.convertPatternsToRe(affectDepthOfReadingPatterns, this._micromatchOptions);
		}
		_filter(basePath, entry, matcher, negativeRe) {
			if (this._isSkippedByDeep(basePath, entry.path)) return false;
			if (this._isSkippedSymbolicLink(entry)) return false;
			const filepath = utils.path.removeLeadingDotSegment(entry.path);
			if (this._isSkippedByPositivePatterns(filepath, matcher)) return false;
			return this._isSkippedByNegativePatterns(filepath, negativeRe);
		}
		_isSkippedByDeep(basePath, entryPath) {
			/**
			* Avoid unnecessary depth calculations when it doesn't matter.
			*/
			if (this._settings.deep === Infinity) return false;
			return this._getEntryLevel(basePath, entryPath) >= this._settings.deep;
		}
		_getEntryLevel(basePath, entryPath) {
			const entryPathDepth = entryPath.split("/").length;
			if (basePath === "") return entryPathDepth;
			return entryPathDepth - basePath.split("/").length;
		}
		_isSkippedSymbolicLink(entry) {
			return !this._settings.followSymbolicLinks && entry.dirent.isSymbolicLink();
		}
		_isSkippedByPositivePatterns(entryPath, matcher) {
			return !this._settings.baseNameMatch && !matcher.match(entryPath);
		}
		_isSkippedByNegativePatterns(entryPath, patternsRe) {
			return !utils.pattern.matchAny(entryPath, patternsRe);
		}
	};
	exports.default = DeepFilter;
}));
//#endregion
//#region node_modules/fast-glob/out/providers/filters/entry.js
var require_entry$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var utils = require_utils();
	var EntryFilter = class {
		constructor(_settings, _micromatchOptions) {
			this._settings = _settings;
			this._micromatchOptions = _micromatchOptions;
			this.index = /* @__PURE__ */ new Map();
		}
		getFilter(positive, negative) {
			const [absoluteNegative, relativeNegative] = utils.pattern.partitionAbsoluteAndRelative(negative);
			const patterns = {
				positive: { all: utils.pattern.convertPatternsToRe(positive, this._micromatchOptions) },
				negative: {
					absolute: utils.pattern.convertPatternsToRe(absoluteNegative, Object.assign(Object.assign({}, this._micromatchOptions), { dot: true })),
					relative: utils.pattern.convertPatternsToRe(relativeNegative, Object.assign(Object.assign({}, this._micromatchOptions), { dot: true }))
				}
			};
			return (entry) => this._filter(entry, patterns);
		}
		_filter(entry, patterns) {
			const filepath = utils.path.removeLeadingDotSegment(entry.path);
			if (this._settings.unique && this._isDuplicateEntry(filepath)) return false;
			if (this._onlyFileFilter(entry) || this._onlyDirectoryFilter(entry)) return false;
			const isMatched = this._isMatchToPatternsSet(filepath, patterns, entry.dirent.isDirectory());
			if (this._settings.unique && isMatched) this._createIndexRecord(filepath);
			return isMatched;
		}
		_isDuplicateEntry(filepath) {
			return this.index.has(filepath);
		}
		_createIndexRecord(filepath) {
			this.index.set(filepath, void 0);
		}
		_onlyFileFilter(entry) {
			return this._settings.onlyFiles && !entry.dirent.isFile();
		}
		_onlyDirectoryFilter(entry) {
			return this._settings.onlyDirectories && !entry.dirent.isDirectory();
		}
		_isMatchToPatternsSet(filepath, patterns, isDirectory) {
			if (!this._isMatchToPatterns(filepath, patterns.positive.all, isDirectory)) return false;
			if (this._isMatchToPatterns(filepath, patterns.negative.relative, isDirectory)) return false;
			if (this._isMatchToAbsoluteNegative(filepath, patterns.negative.absolute, isDirectory)) return false;
			return true;
		}
		_isMatchToAbsoluteNegative(filepath, patternsRe, isDirectory) {
			if (patternsRe.length === 0) return false;
			const fullpath = utils.path.makeAbsolute(this._settings.cwd, filepath);
			return this._isMatchToPatterns(fullpath, patternsRe, isDirectory);
		}
		_isMatchToPatterns(filepath, patternsRe, isDirectory) {
			if (patternsRe.length === 0) return false;
			const isMatched = utils.pattern.matchAny(filepath, patternsRe);
			if (!isMatched && isDirectory) return utils.pattern.matchAny(filepath + "/", patternsRe);
			return isMatched;
		}
	};
	exports.default = EntryFilter;
}));
//#endregion
//#region node_modules/fast-glob/out/providers/filters/error.js
var require_error = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var utils = require_utils();
	var ErrorFilter = class {
		constructor(_settings) {
			this._settings = _settings;
		}
		getFilter() {
			return (error) => this._isNonFatalError(error);
		}
		_isNonFatalError(error) {
			return utils.errno.isEnoentCodeError(error) || this._settings.suppressErrors;
		}
	};
	exports.default = ErrorFilter;
}));
//#endregion
//#region node_modules/fast-glob/out/providers/transformers/entry.js
var require_entry = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var utils = require_utils();
	var EntryTransformer = class {
		constructor(_settings) {
			this._settings = _settings;
		}
		getTransformer() {
			return (entry) => this._transform(entry);
		}
		_transform(entry) {
			let filepath = entry.path;
			if (this._settings.absolute) {
				filepath = utils.path.makeAbsolute(this._settings.cwd, filepath);
				filepath = utils.path.unixify(filepath);
			}
			if (this._settings.markDirectories && entry.dirent.isDirectory()) filepath += "/";
			if (!this._settings.objectMode) return filepath;
			return Object.assign(Object.assign({}, entry), { path: filepath });
		}
	};
	exports.default = EntryTransformer;
}));
//#endregion
//#region node_modules/fast-glob/out/providers/provider.js
var require_provider = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var path$1 = __require("path");
	var deep_1 = require_deep();
	var entry_1 = require_entry$1();
	var error_1 = require_error();
	var entry_2 = require_entry();
	var Provider = class {
		constructor(_settings) {
			this._settings = _settings;
			this.errorFilter = new error_1.default(this._settings);
			this.entryFilter = new entry_1.default(this._settings, this._getMicromatchOptions());
			this.deepFilter = new deep_1.default(this._settings, this._getMicromatchOptions());
			this.entryTransformer = new entry_2.default(this._settings);
		}
		_getRootDirectory(task) {
			return path$1.resolve(this._settings.cwd, task.base);
		}
		_getReaderOptions(task) {
			const basePath = task.base === "." ? "" : task.base;
			return {
				basePath,
				pathSegmentSeparator: "/",
				concurrency: this._settings.concurrency,
				deepFilter: this.deepFilter.getFilter(basePath, task.positive, task.negative),
				entryFilter: this.entryFilter.getFilter(task.positive, task.negative),
				errorFilter: this.errorFilter.getFilter(),
				followSymbolicLinks: this._settings.followSymbolicLinks,
				fs: this._settings.fs,
				stats: this._settings.stats,
				throwErrorOnBrokenSymbolicLink: this._settings.throwErrorOnBrokenSymbolicLink,
				transform: this.entryTransformer.getTransformer()
			};
		}
		_getMicromatchOptions() {
			return {
				dot: this._settings.dot,
				matchBase: this._settings.baseNameMatch,
				nobrace: !this._settings.braceExpansion,
				nocase: !this._settings.caseSensitiveMatch,
				noext: !this._settings.extglob,
				noglobstar: !this._settings.globstar,
				posix: true,
				strictSlashes: false
			};
		}
	};
	exports.default = Provider;
}));
//#endregion
//#region node_modules/fast-glob/out/providers/async.js
var require_async = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var async_1 = require_async$1();
	var provider_1 = require_provider();
	var ProviderAsync = class extends provider_1.default {
		constructor() {
			super(...arguments);
			this._reader = new async_1.default(this._settings);
		}
		async read(task) {
			const root = this._getRootDirectory(task);
			const options = this._getReaderOptions(task);
			return (await this.api(root, task, options)).map((entry) => options.transform(entry));
		}
		api(root, task, options) {
			if (task.dynamic) return this._reader.dynamic(root, options);
			return this._reader.static(task.patterns, options);
		}
	};
	exports.default = ProviderAsync;
}));
//#endregion
//#region node_modules/fast-glob/out/providers/stream.js
var require_stream = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var stream_1 = __require("stream");
	var stream_2 = require_stream$1();
	var provider_1 = require_provider();
	var ProviderStream = class extends provider_1.default {
		constructor() {
			super(...arguments);
			this._reader = new stream_2.default(this._settings);
		}
		read(task) {
			const root = this._getRootDirectory(task);
			const options = this._getReaderOptions(task);
			const source = this.api(root, task, options);
			const destination = new stream_1.Readable({
				objectMode: true,
				read: () => {}
			});
			source.once("error", (error) => destination.emit("error", error)).on("data", (entry) => destination.emit("data", options.transform(entry))).once("end", () => destination.emit("end"));
			destination.once("close", () => source.destroy());
			return destination;
		}
		api(root, task, options) {
			if (task.dynamic) return this._reader.dynamic(root, options);
			return this._reader.static(task.patterns, options);
		}
	};
	exports.default = ProviderStream;
}));
//#endregion
//#region node_modules/fast-glob/out/readers/sync.js
var require_sync$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var fsStat = require_out$1();
	var fsWalk = require_out$2();
	var reader_1 = require_reader();
	var ReaderSync = class extends reader_1.default {
		constructor() {
			super(...arguments);
			this._walkSync = fsWalk.walkSync;
			this._statSync = fsStat.statSync;
		}
		dynamic(root, options) {
			return this._walkSync(root, options);
		}
		static(patterns, options) {
			const entries = [];
			for (const pattern of patterns) {
				const filepath = this._getFullEntryPath(pattern);
				const entry = this._getEntry(filepath, pattern, options);
				if (entry === null || !options.entryFilter(entry)) continue;
				entries.push(entry);
			}
			return entries;
		}
		_getEntry(filepath, pattern, options) {
			try {
				const stats = this._getStat(filepath);
				return this._makeEntry(stats, pattern);
			} catch (error) {
				if (options.errorFilter(error)) return null;
				throw error;
			}
		}
		_getStat(filepath) {
			return this._statSync(filepath, this._fsStatSettings);
		}
	};
	exports.default = ReaderSync;
}));
//#endregion
//#region node_modules/fast-glob/out/providers/sync.js
var require_sync = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var sync_1 = require_sync$1();
	var provider_1 = require_provider();
	var ProviderSync = class extends provider_1.default {
		constructor() {
			super(...arguments);
			this._reader = new sync_1.default(this._settings);
		}
		read(task) {
			const root = this._getRootDirectory(task);
			const options = this._getReaderOptions(task);
			return this.api(root, task, options).map(options.transform);
		}
		api(root, task, options) {
			if (task.dynamic) return this._reader.dynamic(root, options);
			return this._reader.static(task.patterns, options);
		}
	};
	exports.default = ProviderSync;
}));
//#endregion
//#region node_modules/fast-glob/out/settings.js
var require_settings = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.DEFAULT_FILE_SYSTEM_ADAPTER = void 0;
	var fs$2 = __require("fs");
	var os$1 = __require("os");
	/**
	* The `os.cpus` method can return zero. We expect the number of cores to be greater than zero.
	* https://github.com/nodejs/node/blob/7faeddf23a98c53896f8b574a6e66589e8fb1eb8/lib/os.js#L106-L107
	*/
	var CPU_COUNT = Math.max(os$1.cpus().length, 1);
	exports.DEFAULT_FILE_SYSTEM_ADAPTER = {
		lstat: fs$2.lstat,
		lstatSync: fs$2.lstatSync,
		stat: fs$2.stat,
		statSync: fs$2.statSync,
		readdir: fs$2.readdir,
		readdirSync: fs$2.readdirSync
	};
	var Settings = class {
		constructor(_options = {}) {
			this._options = _options;
			this.absolute = this._getValue(this._options.absolute, false);
			this.baseNameMatch = this._getValue(this._options.baseNameMatch, false);
			this.braceExpansion = this._getValue(this._options.braceExpansion, true);
			this.caseSensitiveMatch = this._getValue(this._options.caseSensitiveMatch, true);
			this.concurrency = this._getValue(this._options.concurrency, CPU_COUNT);
			this.cwd = this._getValue(this._options.cwd, process.cwd());
			this.deep = this._getValue(this._options.deep, Infinity);
			this.dot = this._getValue(this._options.dot, false);
			this.extglob = this._getValue(this._options.extglob, true);
			this.followSymbolicLinks = this._getValue(this._options.followSymbolicLinks, true);
			this.fs = this._getFileSystemMethods(this._options.fs);
			this.globstar = this._getValue(this._options.globstar, true);
			this.ignore = this._getValue(this._options.ignore, []);
			this.markDirectories = this._getValue(this._options.markDirectories, false);
			this.objectMode = this._getValue(this._options.objectMode, false);
			this.onlyDirectories = this._getValue(this._options.onlyDirectories, false);
			this.onlyFiles = this._getValue(this._options.onlyFiles, true);
			this.stats = this._getValue(this._options.stats, false);
			this.suppressErrors = this._getValue(this._options.suppressErrors, false);
			this.throwErrorOnBrokenSymbolicLink = this._getValue(this._options.throwErrorOnBrokenSymbolicLink, false);
			this.unique = this._getValue(this._options.unique, true);
			if (this.onlyDirectories) this.onlyFiles = false;
			if (this.stats) this.objectMode = true;
			this.ignore = [].concat(this.ignore);
		}
		_getValue(option, value) {
			return option === void 0 ? value : option;
		}
		_getFileSystemMethods(methods = {}) {
			return Object.assign(Object.assign({}, exports.DEFAULT_FILE_SYSTEM_ADAPTER), methods);
		}
	};
	exports.default = Settings;
}));
//#endregion
//#region node_modules/deepagents/dist/src-DeCEf6Ie.js
var import_out = /* @__PURE__ */ __toESM((/* @__PURE__ */ __commonJSMin(((exports, module) => {
	var taskManager = require_tasks();
	var async_1 = require_async();
	var stream_1 = require_stream();
	var sync_1 = require_sync();
	var settings_1 = require_settings();
	var utils = require_utils();
	async function FastGlob(source, options) {
		assertPatternsInput(source);
		const works = getWorks(source, async_1.default, options);
		const result = await Promise.all(works);
		return utils.array.flatten(result);
	}
	(function(FastGlob) {
		FastGlob.glob = FastGlob;
		FastGlob.globSync = sync;
		FastGlob.globStream = stream;
		FastGlob.async = FastGlob;
		function sync(source, options) {
			assertPatternsInput(source);
			const works = getWorks(source, sync_1.default, options);
			return utils.array.flatten(works);
		}
		FastGlob.sync = sync;
		function stream(source, options) {
			assertPatternsInput(source);
			const works = getWorks(source, stream_1.default, options);
			/**
			* The stream returned by the provider cannot work with an asynchronous iterator.
			* To support asynchronous iterators, regardless of the number of tasks, we always multiplex streams.
			* This affects performance (+25%). I don't see best solution right now.
			*/
			return utils.stream.merge(works);
		}
		FastGlob.stream = stream;
		function generateTasks(source, options) {
			assertPatternsInput(source);
			const patterns = [].concat(source);
			const settings = new settings_1.default(options);
			return taskManager.generate(patterns, settings);
		}
		FastGlob.generateTasks = generateTasks;
		function isDynamicPattern(source, options) {
			assertPatternsInput(source);
			const settings = new settings_1.default(options);
			return utils.pattern.isDynamicPattern(source, settings);
		}
		FastGlob.isDynamicPattern = isDynamicPattern;
		function escapePath(source) {
			assertPatternsInput(source);
			return utils.path.escape(source);
		}
		FastGlob.escapePath = escapePath;
		function convertPathToPattern(source) {
			assertPatternsInput(source);
			return utils.path.convertPathToPattern(source);
		}
		FastGlob.convertPathToPattern = convertPathToPattern;
		(function(posix) {
			function escapePath(source) {
				assertPatternsInput(source);
				return utils.path.escapePosixPath(source);
			}
			posix.escapePath = escapePath;
			function convertPathToPattern(source) {
				assertPatternsInput(source);
				return utils.path.convertPosixPathToPattern(source);
			}
			posix.convertPathToPattern = convertPathToPattern;
		})(FastGlob.posix || (FastGlob.posix = {}));
		(function(win32) {
			function escapePath(source) {
				assertPatternsInput(source);
				return utils.path.escapeWindowsPath(source);
			}
			win32.escapePath = escapePath;
			function convertPathToPattern(source) {
				assertPatternsInput(source);
				return utils.path.convertWindowsPathToPattern(source);
			}
			win32.convertPathToPattern = convertPathToPattern;
		})(FastGlob.win32 || (FastGlob.win32 = {}));
	})(FastGlob || (FastGlob = {}));
	function getWorks(source, _Provider, options) {
		const patterns = [].concat(source);
		const settings = new settings_1.default(options);
		const tasks = taskManager.generate(patterns, settings);
		const provider = new _Provider(settings);
		return tasks.map(provider.read, provider);
	}
	function assertPatternsInput(input) {
		if (![].concat(input).every((item) => utils.string.isString(item) && !utils.string.isEmpty(item))) throw new TypeError("Patterns must be a string (non empty) or an array of strings");
	}
	module.exports = FastGlob;
})))(), 1);
object({
	/** Personal preferences from ~/.deepagents/{agent}/ (applies everywhere) */
	userMemory: string().optional(),
	/** Project-specific context (loaded from project root) */
	projectMemory: string().optional()
});
/**
* FilesystemBackend: Read and write files directly from the filesystem.
*
* Security and search upgrades:
* - Secure path resolution with root containment when in virtual_mode (sandboxed to cwd)
* - Prevent symlink-following on file I/O using O_NOFOLLOW when available
* - Ripgrep-powered grep with literal (fixed-string) search, plus substring fallback
*   and optional glob include filtering, while preserving virtual path behavior
*/
var SUPPORTS_NOFOLLOW = fs.constants.O_NOFOLLOW !== void 0;
function getErrorMessage(error) {
	if (typeof error === "object" && error !== null && "message" in error && typeof error.message === "string") return error.message;
	return String(error);
}
function hasErrorCode(error, code) {
	return typeof error === "object" && error !== null && "code" in error && error.code === code;
}
/**
* Backend that reads and writes files directly from the filesystem.
*
* Files are accessed using their actual filesystem paths. Relative paths are
* resolved relative to the current working directory. Content is read/written
* as plain text, and metadata (timestamps) are derived from filesystem stats.
*/
var FilesystemBackend = class {
	cwd;
	virtualMode;
	maxFileSizeBytes;
	constructor(options = {}) {
		const { rootDir, virtualMode = false, maxFileSizeMb = 10 } = options;
		this.cwd = rootDir ? path.resolve(rootDir) : process.cwd();
		this.virtualMode = virtualMode;
		this.maxFileSizeBytes = maxFileSizeMb * 1024 * 1024;
	}
	/**
	* Resolve a file path with security checks.
	*
	* When virtualMode=true, treat incoming paths as virtual absolute paths under
	* this.cwd, disallow traversal (.., ~) and ensure resolved path stays within root.
	* When virtualMode=false, preserve legacy behavior: absolute paths are allowed
	* as-is; relative paths resolve under cwd.
	*
	* @param key - File path (absolute, relative, or virtual when virtualMode=true)
	* @returns Resolved absolute path string
	* @throws Error if path traversal detected or path outside root
	*/
	resolvePath(key) {
		if (this.virtualMode) {
			const vpath = key.startsWith("/") ? key : "/" + key;
			if (vpath.includes("..") || vpath.startsWith("~")) throw new Error("Path traversal not allowed");
			const full = path.resolve(this.cwd, vpath.substring(1));
			const relative = path.relative(this.cwd, full);
			if (relative.startsWith("..") || path.isAbsolute(relative)) throw new Error(`Path: ${full} outside root directory: ${this.cwd}`);
			return full;
		}
		if (path.isAbsolute(key)) return key;
		return path.resolve(this.cwd, key);
	}
	/**
	* Resolve the concrete path to unlink for a virtual delete operation.
	*
	* Virtual-mode path containment is lexical in resolvePath(), so deleting via
	* that path could follow a symlinked parent outside the virtual root. Resolve
	* and validate the real parent, then unlink through that real parent path so a
	* replacement of the original lexical parent cannot redirect the unlink.
	*/
	async resolveDeletePath(resolvedPath, filePath) {
		if (!this.virtualMode) return resolvedPath;
		const segments = path.relative(this.cwd, resolvedPath).split(path.sep).filter(Boolean);
		let current = this.cwd;
		for (const segment of segments.slice(0, -1)) {
			current = path.join(current, segment);
			if ((await fs$1.lstat(current)).isSymbolicLink()) throw new Error(`Symlink parent not allowed: ${filePath}`);
		}
		const realRoot = await fs$1.realpath(this.cwd);
		const realParent = await fs$1.realpath(path.dirname(resolvedPath));
		const realRelative = path.relative(realRoot, realParent);
		if (realRelative.startsWith("..") || path.isAbsolute(realRelative)) throw new Error(`Path '${filePath}' resolves outside root directory`);
		return path.join(realParent, path.basename(resolvedPath));
	}
	/**
	* List files and directories in the specified directory (non-recursive).
	*
	* @param dirPath - Absolute directory path to list files from
	* @returns List of FileInfo objects for files and directories directly in the directory.
	*          Directories have a trailing / in their path and is_dir=true.
	*/
	async ls(dirPath) {
		try {
			const resolvedPath = this.resolvePath(dirPath);
			if (!(await fs$1.stat(resolvedPath)).isDirectory()) return { files: [] };
			const entries = await fs$1.readdir(resolvedPath, { withFileTypes: true });
			const results = [];
			const cwdStr = this.cwd.endsWith(path.sep) ? this.cwd : this.cwd + path.sep;
			for (const entry of entries) {
				const fullPath = path.join(resolvedPath, entry.name);
				try {
					const entryStat = await fs$1.stat(fullPath);
					const isFile = entryStat.isFile();
					const isDir = entryStat.isDirectory();
					if (!this.virtualMode) {
						if (isFile) results.push({
							path: fullPath,
							is_dir: false,
							size: entryStat.size,
							modified_at: entryStat.mtime.toISOString()
						});
						else if (isDir) results.push({
							path: fullPath + path.sep,
							is_dir: true,
							size: 0,
							modified_at: entryStat.mtime.toISOString()
						});
					} else {
						let relativePath;
						if (fullPath.startsWith(cwdStr)) relativePath = fullPath.substring(cwdStr.length);
						else if (fullPath.startsWith(this.cwd)) relativePath = fullPath.substring(this.cwd.length).replace(/^[/\\]/, "");
						else relativePath = fullPath;
						relativePath = relativePath.split(path.sep).join("/");
						const virtPath = "/" + relativePath;
						if (isFile) results.push({
							path: virtPath,
							is_dir: false,
							size: entryStat.size,
							modified_at: entryStat.mtime.toISOString()
						});
						else if (isDir) results.push({
							path: virtPath + "/",
							is_dir: true,
							size: 0,
							modified_at: entryStat.mtime.toISOString()
						});
					}
				} catch {
					continue;
				}
			}
			results.sort((a, b) => a.path.localeCompare(b.path));
			return { files: results };
		} catch {
			return { files: [] };
		}
	}
	/**
	* Read file content with line numbers.
	*
	* @param filePath - Absolute or relative file path
	* @param offset - Line offset to start reading from (0-indexed)
	* @param limit - Maximum number of lines to read
	* @returns Formatted file content with line numbers, or error message
	*/
	async read(filePath, offset = 0, limit = 500) {
		try {
			const resolvedPath = this.resolvePath(filePath);
			const mimeType = getMimeType(filePath);
			const isBinary = !isTextMimeType(mimeType);
			let content;
			if (SUPPORTS_NOFOLLOW) {
				if (!(await fs$1.stat(resolvedPath)).isFile()) return { error: `File '${filePath}' not found` };
				const fd = await fs$1.open(resolvedPath, fs.constants.O_RDONLY | fs.constants.O_NOFOLLOW);
				try {
					if (isBinary) {
						const buffer = await fd.readFile();
						return {
							content: new Uint8Array(buffer),
							mimeType
						};
					}
					content = await fd.readFile({ encoding: "utf-8" });
				} finally {
					await fd.close();
				}
			} else {
				const stat = await fs$1.lstat(resolvedPath);
				if (stat.isSymbolicLink()) return { error: `Symlinks are not allowed: ${filePath}` };
				if (!stat.isFile()) return { error: `File '${filePath}' not found` };
				if (isBinary) {
					const buffer = await fs$1.readFile(resolvedPath);
					return {
						content: new Uint8Array(buffer),
						mimeType
					};
				}
				content = await fs$1.readFile(resolvedPath, "utf-8");
			}
			const emptyMsg = checkEmptyContent(content);
			if (emptyMsg) return {
				content: emptyMsg,
				mimeType
			};
			const lines = content.split("\n");
			const startIdx = offset;
			const endIdx = Math.min(startIdx + limit, lines.length);
			if (startIdx >= lines.length) return { error: `Line offset ${offset} exceeds file length (${lines.length} lines)` };
			return {
				content: lines.slice(startIdx, endIdx).join("\n"),
				mimeType
			};
		} catch (e) {
			return { error: `Error reading file '${filePath}': ${e.message}` };
		}
	}
	/**
	* Read file content as raw FileData.
	*
	* @param filePath - Absolute file path
	* @returns ReadRawResult with raw file data on success or error on failure
	*/
	async readRaw(filePath) {
		const resolvedPath = this.resolvePath(filePath);
		const mimeType = getMimeType(filePath);
		const isBinary = !isTextMimeType(mimeType);
		let content;
		let stat;
		if (SUPPORTS_NOFOLLOW) {
			stat = await fs$1.stat(resolvedPath);
			if (!stat.isFile()) return { error: `File '${filePath}' not found` };
			const fd = await fs$1.open(resolvedPath, fs.constants.O_RDONLY | fs.constants.O_NOFOLLOW);
			try {
				if (isBinary) {
					const buffer = await fd.readFile();
					return { data: {
						content: new Uint8Array(buffer),
						mimeType,
						created_at: stat.ctime.toISOString(),
						modified_at: stat.mtime.toISOString()
					} };
				}
				content = await fd.readFile({ encoding: "utf-8" });
			} finally {
				await fd.close();
			}
		} else {
			stat = await fs$1.lstat(resolvedPath);
			if (stat.isSymbolicLink()) return { error: `Symlinks are not allowed: ${filePath}` };
			if (!stat.isFile()) return { error: `File '${filePath}' not found` };
			if (isBinary) {
				const buffer = await fs$1.readFile(resolvedPath);
				return { data: {
					content: new Uint8Array(buffer),
					mimeType,
					created_at: stat.ctime.toISOString(),
					modified_at: stat.mtime.toISOString()
				} };
			}
			content = await fs$1.readFile(resolvedPath, "utf-8");
		}
		return { data: {
			content,
			mimeType,
			created_at: stat.ctime.toISOString(),
			modified_at: stat.mtime.toISOString()
		} };
	}
	/**
	* Write content to a file, creating it or overwriting it if it already exists.
	* Returns WriteResult. External storage sets filesUpdate=null.
	*/
	async write(filePath, content) {
		try {
			const resolvedPath = this.resolvePath(filePath);
			const isBinary = !isTextMimeType(getMimeType(filePath));
			try {
				if ((await fs$1.lstat(resolvedPath)).isSymbolicLink()) return { error: `Cannot write to ${filePath} because it is a symlink. Symlinks are not allowed.` };
			} catch {}
			await fs$1.mkdir(path.dirname(resolvedPath), { recursive: true });
			if (SUPPORTS_NOFOLLOW) {
				const flags = fs.constants.O_WRONLY | fs.constants.O_CREAT | fs.constants.O_TRUNC | fs.constants.O_NOFOLLOW;
				const fd = await fs$1.open(resolvedPath, flags, 420);
				try {
					if (isBinary) {
						const buffer = Buffer.from(content, "base64");
						await fd.writeFile(buffer);
					} else await fd.writeFile(content, "utf-8");
				} finally {
					await fd.close();
				}
			} else if (isBinary) {
				const buffer = Buffer.from(content, "base64");
				await fs$1.writeFile(resolvedPath, buffer);
			} else await fs$1.writeFile(resolvedPath, content, "utf-8");
			return {
				path: filePath,
				filesUpdate: null
			};
		} catch (e) {
			return { error: `Error writing file '${filePath}': ${e.message}` };
		}
	}
	/**
	* Edit a file by replacing string occurrences.
	* Returns EditResult. External storage sets filesUpdate=null.
	*/
	async edit(filePath, oldString, newString, replaceAll = false) {
		try {
			const resolvedPath = this.resolvePath(filePath);
			let content;
			if (SUPPORTS_NOFOLLOW) {
				if (!(await fs$1.stat(resolvedPath)).isFile()) return { error: `Error: File '${filePath}' not found` };
				const fd = await fs$1.open(resolvedPath, fs.constants.O_RDONLY | fs.constants.O_NOFOLLOW);
				try {
					content = await fd.readFile({ encoding: "utf-8" });
				} finally {
					await fd.close();
				}
			} else {
				const stat = await fs$1.lstat(resolvedPath);
				if (stat.isSymbolicLink()) return { error: `Error: Symlinks are not allowed: ${filePath}` };
				if (!stat.isFile()) return { error: `Error: File '${filePath}' not found` };
				content = await fs$1.readFile(resolvedPath, "utf-8");
			}
			const result = performStringReplacement(content, oldString, newString, replaceAll);
			if (typeof result === "string") return { error: result };
			const [newContent, occurrences] = result;
			if (SUPPORTS_NOFOLLOW) {
				const flags = fs.constants.O_WRONLY | fs.constants.O_TRUNC | fs.constants.O_NOFOLLOW;
				const fd = await fs$1.open(resolvedPath, flags);
				try {
					await fd.writeFile(newContent, "utf-8");
				} finally {
					await fd.close();
				}
			} else await fs$1.writeFile(resolvedPath, newContent, "utf-8");
			return {
				path: filePath,
				filesUpdate: null,
				occurrences
			};
		} catch (e) {
			return { error: `Error editing file '${filePath}': ${e.message}` };
		}
	}
	/**
	* Delete a file from the filesystem.
	*/
	async delete(filePath) {
		let resolvedPath;
		try {
			resolvedPath = this.resolvePath(filePath);
		} catch (error) {
			return { error: `Error deleting file '${filePath}': ${getErrorMessage(error)}` };
		}
		try {
			const deletePath = await this.resolveDeletePath(resolvedPath, filePath);
			if ((await fs$1.lstat(deletePath)).isDirectory()) return { error: `Error: '${filePath}' is a directory, not a file` };
			await fs$1.unlink(deletePath);
			return { path: filePath };
		} catch (error) {
			if (hasErrorCode(error, "ENOENT")) return { error: `Error: File '${filePath}' not found` };
			return { error: `Error deleting file '${filePath}': ${getErrorMessage(error)}` };
		}
	}
	/**
	* Search for a literal text pattern in files.
	*
	* Uses ripgrep if available, falling back to substring search.
	*
	* @param pattern - Literal string to search for (NOT regex).
	* @param dirPath - Directory or file path to search in. Defaults to current directory.
	* @param glob - Optional glob pattern to filter which files to search.
	* @returns List of GrepMatch dicts containing path, line number, and matched text.
	*/
	async grep(pattern, dirPath = "/", glob = null) {
		let baseFull;
		try {
			baseFull = this.resolvePath(dirPath || ".");
		} catch {
			return { matches: [] };
		}
		try {
			await fs$1.stat(baseFull);
		} catch {
			return { matches: [] };
		}
		let results = await this.ripgrepSearch(pattern, baseFull, glob);
		if (results === null) results = await this.literalSearch(pattern, baseFull, glob);
		const matches = [];
		for (const [fpath, items] of Object.entries(results)) for (const [lineNum, lineText] of items) matches.push({
			path: fpath,
			line: lineNum,
			text: lineText
		});
		return { matches };
	}
	/**
	* Search using ripgrep with fixed-string (literal) mode.
	*
	* @param pattern - Literal string to search for (unescaped).
	* @param baseFull - Resolved base path to search in.
	* @param includeGlob - Optional glob pattern to filter files.
	* @returns Dict mapping file paths to list of (line_number, line_text) tuples.
	*          Returns null if ripgrep is unavailable or times out.
	*/
	async ripgrepSearch(pattern, baseFull, includeGlob) {
		return new Promise((resolve) => {
			const args = ["--json", "-F"];
			if (includeGlob) args.push("--glob", includeGlob);
			args.push("--", pattern, baseFull);
			const proc = spawn("rg", args, { timeout: 3e4 });
			const results = {};
			let output = "";
			proc.stdout.on("data", (data) => {
				output += data.toString();
			});
			proc.on("close", (code) => {
				if (code !== 0 && code !== 1) {
					resolve(null);
					return;
				}
				for (const line of output.split("\n")) {
					if (!line.trim()) continue;
					try {
						const data = JSON.parse(line);
						if (data.type !== "match") continue;
						const pdata = data.data || {};
						const ftext = pdata.path?.text;
						if (!ftext) continue;
						let virtPath;
						if (this.virtualMode) try {
							const resolved = path.resolve(ftext);
							const relative = path.relative(this.cwd, resolved);
							if (relative.startsWith("..")) continue;
							virtPath = "/" + relative.split(path.sep).join("/");
						} catch {
							continue;
						}
						else virtPath = ftext;
						const ln = pdata.line_number;
						const lt = pdata.lines?.text?.replace(/\n$/, "") || "";
						if (ln === void 0) continue;
						if (!results[virtPath]) results[virtPath] = [];
						results[virtPath].push([ln, lt]);
					} catch {
						continue;
					}
				}
				resolve(results);
			});
			proc.on("error", () => {
				resolve(null);
			});
		});
	}
	/**
	* Fallback search using literal substring matching when ripgrep is unavailable.
	*
	* Recursively searches files, respecting maxFileSizeBytes limit.
	*
	* @param pattern - Literal string to search for.
	* @param baseFull - Resolved base path to search in.
	* @param includeGlob - Optional glob pattern to filter files by name.
	* @returns Dict mapping file paths to list of (line_number, line_text) tuples.
	*/
	async literalSearch(pattern, baseFull, includeGlob) {
		const results = {};
		const files = await (0, import_out.default)("**/*", {
			cwd: (await fs$1.stat(baseFull)).isDirectory() ? baseFull : path.dirname(baseFull),
			absolute: true,
			onlyFiles: true,
			dot: true,
			followSymbolicLinks: false
		});
		for (const fp of files) try {
			if (!isTextMimeType(getMimeType(fp))) continue;
			if (includeGlob && !import_micromatch.default.isMatch(path.basename(fp), includeGlob)) continue;
			if ((await fs$1.stat(fp)).size > this.maxFileSizeBytes) continue;
			const lines = (await fs$1.readFile(fp, "utf-8")).split("\n");
			for (let i = 0; i < lines.length; i++) {
				const line = lines[i];
				if (line.includes(pattern)) {
					let virtPath;
					if (this.virtualMode) try {
						const relative = path.relative(this.cwd, fp);
						if (relative.startsWith("..")) continue;
						virtPath = "/" + relative.split(path.sep).join("/");
					} catch {
						continue;
					}
					else virtPath = fp;
					if (!results[virtPath]) results[virtPath] = [];
					results[virtPath].push([i + 1, line]);
				}
			}
		} catch {
			continue;
		}
		return results;
	}
	/**
	* Structured glob matching returning FileInfo objects.
	*/
	async glob(pattern, searchPath = "/") {
		if (pattern.startsWith("/")) pattern = pattern.substring(1);
		const resolvedSearchPath = searchPath === "/" ? this.cwd : this.resolvePath(searchPath);
		try {
			if (!(await fs$1.stat(resolvedSearchPath)).isDirectory()) return { files: [] };
		} catch {
			return { files: [] };
		}
		const results = [];
		try {
			const matches = await (0, import_out.default)(pattern, {
				cwd: resolvedSearchPath,
				absolute: true,
				onlyFiles: false,
				dot: true,
				followSymbolicLinks: false
			});
			for (const matchedPath of matches) try {
				const stat = await fs$1.stat(matchedPath);
				if (!stat.isFile()) continue;
				const normalizedPath = matchedPath.split("/").join(path.sep);
				if (!this.virtualMode) results.push({
					path: normalizedPath,
					is_dir: false,
					size: stat.size,
					modified_at: stat.mtime.toISOString()
				});
				else {
					const cwdStr = this.cwd.endsWith(path.sep) ? this.cwd : this.cwd + path.sep;
					let relativePath;
					if (normalizedPath.startsWith(cwdStr)) relativePath = normalizedPath.substring(cwdStr.length);
					else if (normalizedPath.startsWith(this.cwd)) relativePath = normalizedPath.substring(this.cwd.length).replace(/^[/\\]/, "");
					else relativePath = normalizedPath;
					relativePath = relativePath.split(path.sep).join("/");
					const virt = "/" + relativePath;
					results.push({
						path: virt,
						is_dir: false,
						size: stat.size,
						modified_at: stat.mtime.toISOString()
					});
				}
			} catch {
				continue;
			}
		} catch {}
		results.sort((a, b) => a.path.localeCompare(b.path));
		return { files: results };
	}
	/**
	* Upload multiple files to the filesystem.
	*
	* @param files - List of [path, content] tuples to upload
	* @returns List of FileUploadResponse objects, one per input file
	*/
	async uploadFiles(files) {
		const responses = [];
		for (const [filePath, content] of files) try {
			const resolvedPath = this.resolvePath(filePath);
			await fs$1.mkdir(path.dirname(resolvedPath), { recursive: true });
			await fs$1.writeFile(resolvedPath, content);
			responses.push({
				path: filePath,
				error: null
			});
		} catch (e) {
			if (e.code === "ENOENT") responses.push({
				path: filePath,
				error: "file_not_found"
			});
			else if (e.code === "EACCES") responses.push({
				path: filePath,
				error: "permission_denied"
			});
			else if (e.code === "EISDIR") responses.push({
				path: filePath,
				error: "is_directory"
			});
			else responses.push({
				path: filePath,
				error: "invalid_path"
			});
		}
		return responses;
	}
	/**
	* Download multiple files from the filesystem.
	*
	* @param paths - List of file paths to download
	* @returns List of FileDownloadResponse objects, one per input path
	*/
	async downloadFiles(paths) {
		const responses = [];
		for (const filePath of paths) try {
			const resolvedPath = this.resolvePath(filePath);
			const content = await fs$1.readFile(resolvedPath);
			responses.push({
				path: filePath,
				content,
				error: null
			});
		} catch (e) {
			if (e.code === "ENOENT") responses.push({
				path: filePath,
				content: null,
				error: "file_not_found"
			});
			else if (e.code === "EACCES") responses.push({
				path: filePath,
				content: null,
				error: "permission_denied"
			});
			else if (e.code === "EISDIR") responses.push({
				path: filePath,
				content: null,
				error: "is_directory"
			});
			else responses.push({
				path: filePath,
				content: null,
				error: "invalid_path"
			});
		}
		return responses;
	}
};
//#endregion
export { createDeepAgent as n, toolStrategy as r, FilesystemBackend as t };
