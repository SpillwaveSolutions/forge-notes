import { r as __exportAll } from "../_runtime.mjs";
import { bn as getEnvironmentVariable, c as isLangChainTool, n as convertToOpenAITool } from "./@langchain/anthropic+[...].mjs";
import { n as ChatOpenAICompletions } from "./langchain__openai+openai.mjs";
//#region node_modules/@langchain/xai/dist/live_search.js
/**
* Merge search parameters from instance defaults, tool definition
* and per-call overrides.
*
* Precedence (lowest → highest):
*   1. tool-level configuration (e.g. from xaiLiveSearch)
*   2. instance-level defaults
*   3. per-call overrides passed via `searchParameters`
*/
function mergeSearchParams(instanceParams, callParams, toolParams) {
	if (!instanceParams && !callParams && !toolParams) return;
	return {
		...toolParams ?? {},
		...instanceParams ?? {},
		...callParams ?? {}
	};
}
/**
* Build the `search_parameters` payload to send to the xAI API
* from high-level `XAISearchParameters`.
*/
function buildSearchParametersPayload(params) {
	if (!params) return;
	const payload = { mode: params.mode ?? "auto" };
	if (params.max_search_results !== void 0) payload.max_search_results = params.max_search_results;
	if (params.from_date !== void 0) payload.from_date = params.from_date;
	if (params.to_date !== void 0) payload.to_date = params.to_date;
	if (params.return_citations !== void 0) payload.return_citations = params.return_citations;
	if (params.sources && params.sources.length > 0) payload.sources = params.sources;
	return payload;
}
/**
* Filter out xAI built-in tools (like `live_search`) from a tools array.
* Used before sending the request to the xAI API, since built-in tools
* are controlled via `search_parameters` instead.
*/
function filterXAIBuiltInTools(payload) {
	if (!payload?.tools) return;
	const filtered = payload.tools.filter((tool) => {
		if (tool == null || typeof tool !== "object") return true;
		if (!("type" in tool)) return true;
		if (!payload?.excludedTypes?.length) return true;
		return !payload.excludedTypes.includes(tool.type);
	});
	return filtered.length > 0 ? filtered : void 0;
}
//#endregion
//#region node_modules/@langchain/xai/dist/profiles.js
var PROFILES = {
	"grok-3-fast-latest": {
		maxInputTokens: 131072,
		imageInputs: false,
		audioInputs: false,
		pdfInputs: false,
		videoInputs: false,
		maxOutputTokens: 8192,
		reasoningOutput: false,
		imageOutputs: false,
		audioOutputs: false,
		videoOutputs: false,
		toolCalling: true,
		structuredOutput: true
	},
	"grok-2-vision": {
		maxInputTokens: 8192,
		imageInputs: true,
		audioInputs: false,
		pdfInputs: false,
		videoInputs: false,
		maxOutputTokens: 4096,
		reasoningOutput: false,
		imageOutputs: false,
		audioOutputs: false,
		videoOutputs: false,
		toolCalling: true,
		structuredOutput: true
	},
	"grok-3": {
		maxInputTokens: 131072,
		imageInputs: false,
		audioInputs: false,
		pdfInputs: false,
		videoInputs: false,
		maxOutputTokens: 8192,
		reasoningOutput: false,
		imageOutputs: false,
		audioOutputs: false,
		videoOutputs: false,
		toolCalling: true,
		structuredOutput: true
	},
	"grok-code-fast-1": {
		maxInputTokens: 256e3,
		imageInputs: false,
		audioInputs: false,
		pdfInputs: false,
		videoInputs: false,
		maxOutputTokens: 1e4,
		reasoningOutput: true,
		imageOutputs: false,
		audioOutputs: false,
		videoOutputs: false,
		toolCalling: true,
		structuredOutput: true
	},
	"grok-2-vision-1212": {
		maxInputTokens: 8192,
		imageInputs: true,
		audioInputs: false,
		pdfInputs: false,
		videoInputs: false,
		maxOutputTokens: 4096,
		reasoningOutput: false,
		imageOutputs: false,
		audioOutputs: false,
		videoOutputs: false,
		toolCalling: true,
		structuredOutput: true
	},
	"grok-4-1-fast-non-reasoning": {
		maxInputTokens: 2e6,
		imageInputs: true,
		audioInputs: false,
		pdfInputs: false,
		videoInputs: false,
		maxOutputTokens: 3e4,
		reasoningOutput: false,
		imageOutputs: false,
		audioOutputs: false,
		videoOutputs: false,
		toolCalling: true,
		structuredOutput: true
	},
	"grok-3-mini-fast": {
		maxInputTokens: 131072,
		imageInputs: false,
		audioInputs: false,
		pdfInputs: false,
		videoInputs: false,
		maxOutputTokens: 8192,
		reasoningOutput: true,
		imageOutputs: false,
		audioOutputs: false,
		videoOutputs: false,
		toolCalling: true,
		structuredOutput: true
	},
	"grok-4-fast": {
		maxInputTokens: 2e6,
		imageInputs: true,
		audioInputs: false,
		pdfInputs: false,
		videoInputs: false,
		maxOutputTokens: 3e4,
		reasoningOutput: true,
		imageOutputs: false,
		audioOutputs: false,
		videoOutputs: false,
		toolCalling: true,
		structuredOutput: true
	},
	"grok-4": {
		maxInputTokens: 256e3,
		imageInputs: false,
		audioInputs: false,
		pdfInputs: false,
		videoInputs: false,
		maxOutputTokens: 64e3,
		reasoningOutput: true,
		imageOutputs: false,
		audioOutputs: false,
		videoOutputs: false,
		toolCalling: true,
		structuredOutput: true
	},
	"grok-3-latest": {
		maxInputTokens: 131072,
		imageInputs: false,
		audioInputs: false,
		pdfInputs: false,
		videoInputs: false,
		maxOutputTokens: 8192,
		reasoningOutput: false,
		imageOutputs: false,
		audioOutputs: false,
		videoOutputs: false,
		toolCalling: true,
		structuredOutput: true
	},
	"grok-4-1-fast": {
		maxInputTokens: 2e6,
		imageInputs: true,
		audioInputs: false,
		pdfInputs: false,
		videoInputs: false,
		maxOutputTokens: 3e4,
		reasoningOutput: true,
		imageOutputs: false,
		audioOutputs: false,
		videoOutputs: false,
		toolCalling: true,
		structuredOutput: true
	},
	"grok-2-vision-latest": {
		maxInputTokens: 8192,
		imageInputs: true,
		audioInputs: false,
		pdfInputs: false,
		videoInputs: false,
		maxOutputTokens: 4096,
		reasoningOutput: false,
		imageOutputs: false,
		audioOutputs: false,
		videoOutputs: false,
		toolCalling: true,
		structuredOutput: true
	},
	"grok-3-mini-latest": {
		maxInputTokens: 131072,
		imageInputs: false,
		audioInputs: false,
		pdfInputs: false,
		videoInputs: false,
		maxOutputTokens: 8192,
		reasoningOutput: true,
		imageOutputs: false,
		audioOutputs: false,
		videoOutputs: false,
		toolCalling: true,
		structuredOutput: true
	},
	"grok-3-mini": {
		maxInputTokens: 131072,
		imageInputs: false,
		audioInputs: false,
		pdfInputs: false,
		videoInputs: false,
		maxOutputTokens: 8192,
		reasoningOutput: true,
		imageOutputs: false,
		audioOutputs: false,
		videoOutputs: false,
		toolCalling: true,
		structuredOutput: true
	},
	"grok-3-mini-fast-latest": {
		maxInputTokens: 131072,
		imageInputs: false,
		audioInputs: false,
		pdfInputs: false,
		videoInputs: false,
		maxOutputTokens: 8192,
		reasoningOutput: true,
		imageOutputs: false,
		audioOutputs: false,
		videoOutputs: false,
		toolCalling: true,
		structuredOutput: true
	},
	"grok-2-latest": {
		maxInputTokens: 131072,
		imageInputs: false,
		audioInputs: false,
		pdfInputs: false,
		videoInputs: false,
		maxOutputTokens: 8192,
		reasoningOutput: false,
		imageOutputs: false,
		audioOutputs: false,
		videoOutputs: false,
		toolCalling: true,
		structuredOutput: true
	},
	"grok-4-fast-non-reasoning": {
		maxInputTokens: 2e6,
		imageInputs: true,
		audioInputs: false,
		pdfInputs: false,
		videoInputs: false,
		maxOutputTokens: 3e4,
		reasoningOutput: false,
		imageOutputs: false,
		audioOutputs: false,
		videoOutputs: false,
		toolCalling: true,
		structuredOutput: true
	},
	"grok-vision-beta": {
		maxInputTokens: 8192,
		imageInputs: true,
		audioInputs: false,
		pdfInputs: false,
		videoInputs: false,
		maxOutputTokens: 4096,
		reasoningOutput: false,
		imageOutputs: false,
		audioOutputs: false,
		videoOutputs: false,
		toolCalling: true,
		structuredOutput: true
	},
	"grok-3-fast": {
		maxInputTokens: 131072,
		imageInputs: false,
		audioInputs: false,
		pdfInputs: false,
		videoInputs: false,
		maxOutputTokens: 8192,
		reasoningOutput: false,
		imageOutputs: false,
		audioOutputs: false,
		videoOutputs: false,
		toolCalling: true,
		structuredOutput: true
	}
};
//#endregion
//#region node_modules/@langchain/xai/dist/tools/live_search.js
/**
* xAI's deprecated live_search tool type.
*/
var XAI_LIVE_SEARCH_TOOL_TYPE = "live_search_deprecated_20251215";
//#endregion
//#region node_modules/@langchain/xai/dist/chat_models/completions.js
/**
* Set of all supported xAI built-in server-side tool types.
* This allows us to easily extend support for future built-in tools
* without changing the core detection logic.
*/
var XAI_BUILT_IN_TOOL_TYPES = /* @__PURE__ */ new Set([XAI_LIVE_SEARCH_TOOL_TYPE]);
/**
* Checks if a tool is an xAI built-in tool (like live_search).
* Built-in tools are executed server-side by the xAI API.
*
* @param tool - The tool to check
* @returns true if the tool is an xAI built-in tool
*/
function isXAIBuiltInTool(tool) {
	return typeof tool === "object" && tool !== null && "type" in tool && typeof tool.type === "string" && XAI_BUILT_IN_TOOL_TYPES.has(tool.type);
}
/**
* xAI chat model integration.
*
* The xAI API is compatible to the OpenAI API with some limitations.
*
* Setup:
* Install `@langchain/xai` and set an environment variable named `XAI_API_KEY`.
*
* ```bash
* npm install @langchain/xai
* export XAI_API_KEY="your-api-key"
* ```
*
* ## [Constructor args](https://api.js.langchain.com/classes/_langchain_xai.ChatXAI.html#constructor)
*
* ## [Runtime args](https://api.js.langchain.com/interfaces/_langchain_xai.ChatXAICallOptions.html)
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
* import { ChatXAI } from '@langchain/xai';
*
* const llm = new ChatXAI({
*   model: "grok-3-fast",
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
*   "content": "The French translation of \"I love programming\" is \"J'aime programmer\". In this sentence, \"J'aime\" is the first person singular conjugation of the French verb \"aimer\" which means \"to love\", and \"programmer\" is the French infinitive for \"to program\". I hope this helps! Let me know if you have any other questions.",
*   "additional_kwargs": {},
*   "response_metadata": {
*     "tokenUsage": {
*       "completionTokens": 82,
*       "promptTokens": 20,
*       "totalTokens": 102
*     },
*     "finish_reason": "stop"
*   },
*   "tool_calls": [],
*   "invalid_tool_calls": []
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
*   "content": "",
*   "additional_kwargs": {},
*   "response_metadata": {
*     "finishReason": null
*   },
*   "tool_calls": [],
*   "tool_call_chunks": [],
*   "invalid_tool_calls": []
* }
* AIMessageChunk {
*   "content": "The",
*   "additional_kwargs": {},
*   "response_metadata": {
*     "finishReason": null
*   },
*   "tool_calls": [],
*   "tool_call_chunks": [],
*   "invalid_tool_calls": []
* }
* AIMessageChunk {
*   "content": " French",
*   "additional_kwargs": {},
*   "response_metadata": {
*     "finishReason": null
*   },
*   "tool_calls": [],
*   "tool_call_chunks": [],
*   "invalid_tool_calls": []
* }
* AIMessageChunk {
*   "content": " translation",
*   "additional_kwargs": {},
*   "response_metadata": {
*     "finishReason": null
*   },
*   "tool_calls": [],
*   "tool_call_chunks": [],
*   "invalid_tool_calls": []
* }
* AIMessageChunk {
*   "content": " of",
*   "additional_kwargs": {},
*   "response_metadata": {
*     "finishReason": null
*   },
*   "tool_calls": [],
*   "tool_call_chunks": [],
*   "invalid_tool_calls": []
* }
* AIMessageChunk {
*   "content": " \"",
*   "additional_kwargs": {},
*   "response_metadata": {
*     "finishReason": null
*   },
*   "tool_calls": [],
*   "tool_call_chunks": [],
*   "invalid_tool_calls": []
* }
* AIMessageChunk {
*   "content": "I",
*   "additional_kwargs": {},
*   "response_metadata": {
*     "finishReason": null
*   },
*   "tool_calls": [],
*   "tool_call_chunks": [],
*   "invalid_tool_calls": []
* }
* AIMessageChunk {
*   "content": " love",
*   "additional_kwargs": {},
*   "response_metadata": {
*     "finishReason": null
*   },
*   "tool_calls": [],
*   "tool_call_chunks": [],
*   "invalid_tool_calls": []
* }
* ...
* AIMessageChunk {
*   "content": ".",
*   "additional_kwargs": {},
*   "response_metadata": {
*     "finishReason": null
*   },
*   "tool_calls": [],
*   "tool_call_chunks": [],
*   "invalid_tool_calls": []
* }
* AIMessageChunk {
*   "content": "",
*   "additional_kwargs": {},
*   "response_metadata": {
*     "finishReason": "stop"
*   },
*   "tool_calls": [],
*   "tool_call_chunks": [],
*   "invalid_tool_calls": []
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
*   "content": "The French translation of \"I love programming\" is \"J'aime programmer\". In this sentence, \"J'aime\" is the first person singular conjugation of the French verb \"aimer\" which means \"to love\", and \"programmer\" is the French infinitive for \"to program\". I hope this helps! Let me know if you have any other questions.",
*   "additional_kwargs": {},
*   "response_metadata": {
*     "finishReason": "stop"
*   },
*   "tool_calls": [],
*   "tool_call_chunks": [],
*   "invalid_tool_calls": []
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
* const llmForToolCalling = new ChatXAI({
*   model: "grok-3-fast",
*   temperature: 0,
*   // other params...
* });
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
* const llmWithTools = llmForToolCalling.bindTools([GetWeather, GetPopulation]);
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
*     id: 'call_cd34'
*   },
*   {
*     name: 'GetWeather',
*     args: { location: 'New York, NY' },
*     type: 'tool_call',
*     id: 'call_68rf'
*   },
*   {
*     name: 'GetPopulation',
*     args: { location: 'Los Angeles, CA' },
*     type: 'tool_call',
*     id: 'call_f81z'
*   },
*   {
*     name: 'GetPopulation',
*     args: { location: 'New York, NY' },
*     type: 'tool_call',
*     id: 'call_8byt'
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
* const structuredLlm = llmForToolCalling.withStructuredOutput(Joke, { name: "Joke" });
* const jokeResult = await structuredLlm.invoke("Tell me a joke about cats");
* console.log(jokeResult);
* ```
*
* ```txt
* {
*   setup: "Why don't cats play poker in the wild?",
*   punchline: 'Because there are too many cheetahs.'
* }
* ```
* </details>
*
* <br />
*
* <details>
* <summary><strong>Server Tool Calling (Live Search)</strong></summary>
*
* xAI supports server-side tools that are executed by the API rather than
* requiring client-side execution. The `live_search` tool enables the model
* to search the web for real-time information.
*
* ```typescript
* // Method 1: Using the built-in live_search tool
* const llm = new ChatXAI({
*   model: "grok-3-fast",
*   temperature: 0,
* });
*
* const llmWithSearch = llm.bindTools([{ type: "live_search" }]);
* const result = await llmWithSearch.invoke("What happened in tech news today?");
* console.log(result.content);
* // The model will search the web and include real-time information in its response
* ```
*
* ```typescript
* // Method 2: Using searchParameters for more control
* const llm = new ChatXAI({
*   model: "grok-3-fast",
*   searchParameters: {
*     mode: "auto", // "auto" | "on" | "off"
*     max_search_results: 5,
*     from_date: "2024-01-01", // ISO date string
*     return_citations: true,
*   }
* });
*
* const result = await llm.invoke("What are the latest AI developments?");
* ```
*
* ```typescript
* // Method 3: Override search parameters per request
* const result = await llm.invoke("Find recent news about SpaceX", {
*   searchParameters: {
*     mode: "on",
*     max_search_results: 10,
*     sources: [
*       { type: "web", allowed_websites: ["spacex.com", "nasa.gov"] },
*     ],
*   }
* });
* ```
* </details>
*
* <br />
*/
var ChatXAI = class extends ChatOpenAICompletions {
	static lc_name() {
		return "ChatXAI";
	}
	_llmType() {
		return "xai";
	}
	get lc_secrets() {
		return { apiKey: "XAI_API_KEY" };
	}
	lc_serializable = true;
	lc_namespace = [
		"langchain",
		"chat_models",
		"xai"
	];
	/**
	* Default search parameters for the Live Search API.
	*/
	searchParameters;
	constructor(modelOrFields, fieldsArg) {
		const fields = typeof modelOrFields === "string" ? {
			...fieldsArg ?? {},
			model: modelOrFields
		} : modelOrFields ?? {};
		const apiKey = fields?.apiKey || getEnvironmentVariable("XAI_API_KEY");
		if (!apiKey) throw new Error(`xAI API key not found. Please set the XAI_API_KEY environment variable or provide the key into "apiKey" field.`);
		super({
			...fields,
			model: fields?.model || "grok-3-fast",
			apiKey,
			configuration: { baseURL: fields?.baseURL ?? "https://api.x.ai/v1" }
		});
		this._addVersion("@langchain/xai", "1.4.5");
		this.searchParameters = fields?.searchParameters;
	}
	toJSON() {
		const result = super.toJSON();
		if ("kwargs" in result && typeof result.kwargs === "object" && result.kwargs != null) {
			delete result.kwargs.openai_api_key;
			delete result.kwargs.configuration;
		}
		return result;
	}
	getLsParams(options) {
		const params = super.getLsParams(options);
		params.ls_provider = "xai";
		return params;
	}
	/**
	* Get the effective search parameters, merging defaults with call options.
	* @param options Call options that may contain search parameters
	* @returns Merged search parameters or undefined if none are configured
	*/
	_getEffectiveSearchParameters(options) {
		return mergeSearchParams(this.searchParameters, options?.searchParameters);
	}
	/**
	* Check if any built-in tools (like live_search) are in the tools list.
	* @param tools List of tools to check
	* @returns true if any built-in tools are present
	*/
	_hasBuiltInTools(tools) {
		return tools?.some(isXAIBuiltInTool) ?? false;
	}
	/**
	* Formats tools to xAI/OpenAI format, preserving provider-specific definitions.
	*
	* @param tools The tools to format
	* @returns The formatted tools
	*/
	formatStructuredToolToXAI(tools) {
		if (!tools || !tools.length) return;
		return tools.map((tool) => {
			if (isLangChainTool(tool) && tool.extras?.providerToolDefinition) return tool.extras.providerToolDefinition;
			if (isXAIBuiltInTool(tool)) return tool;
			return convertToOpenAITool(tool);
		});
	}
	bindTools(tools, kwargs) {
		return this.withConfig({
			tools: this.formatStructuredToolToXAI(tools),
			...kwargs
		});
	}
	/** @internal */
	invocationParams(options, extra) {
		const params = { ...super.invocationParams(options, extra) };
		const liveSearchTool = options?.tools?.find(isXAIBuiltInTool);
		const mergedSearchParams = mergeSearchParams(this.searchParameters, options?.searchParameters, liveSearchTool);
		if (mergedSearchParams) params.search_parameters = buildSearchParametersPayload(mergedSearchParams);
		return params;
	}
	/**
	* Calls the xAI API with retry logic in case of failures.
	* @param request The request to send to the xAI API.
	* @param options Optional configuration for the API call.
	* @returns The response from the xAI API.
	*/
	async completionWithRetry(request, options) {
		delete request.frequency_penalty;
		delete request.presence_penalty;
		delete request.logit_bias;
		delete request.functions;
		const newRequestMessages = request.messages.map((msg) => {
			if (!msg.content) return {
				...msg,
				content: ""
			};
			return msg;
		});
		let filteredTools;
		if (request.tools) filteredTools = filterXAIBuiltInTools({
			tools: request.tools,
			excludedTypes: [XAI_LIVE_SEARCH_TOOL_TYPE]
		});
		const newRequest = {
			...request,
			messages: newRequestMessages,
			tools: filteredTools
		};
		if (newRequest.stream === true) return super.completionWithRetry(newRequest, options);
		return super.completionWithRetry(newRequest, options);
	}
	_convertCompletionsDeltaToBaseMessageChunk(delta, rawResponse, defaultRole) {
		const messageChunk = super._convertCompletionsDeltaToBaseMessageChunk(delta, rawResponse, defaultRole);
		const responseMetadata = messageChunk.response_metadata;
		if (!rawResponse.choices[0]?.finish_reason) {
			delete responseMetadata.usage;
			delete messageChunk.usage_metadata;
		} else messageChunk.usage_metadata = responseMetadata.usage;
		return messageChunk;
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
	* const model = new ChatXAI({ model: "grok-3-fast" });
	* const profile = model.profile;
	* console.log(profile.maxInputTokens); // 128000
	* console.log(profile.imageInputs); // true
	* ```
	*/
	get profile() {
		return PROFILES[this.model] ?? {};
	}
	get streamEventProvider() {
		return "xai";
	}
};
//#endregion
//#region node_modules/@langchain/xai/dist/index.js
var dist_exports = /* @__PURE__ */ __exportAll({ ChatXAI: () => ChatXAI });
//#endregion
export { dist_exports as t };
