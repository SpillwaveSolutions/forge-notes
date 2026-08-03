import { r as __exportAll } from "../../_runtime.mjs";
import { An as HumanMessage, Dn as SystemMessage, Ln as ToolMessage, gn as v7, kn as RemoveMessage, wn as coerceMessageLikeToMessage, xn as AIMessage } from "./anthropic+[...].mjs";
//#region node_modules/@langchain/langgraph-sdk/dist/singletons/fetch.js
var DEFAULT_FETCH_IMPLEMENTATION = (...args) => fetch(...args);
var LANGSMITH_FETCH_IMPLEMENTATION_KEY = Symbol.for("lg:fetch_implementation");
/**
* @internal
*/
var _getFetchImplementation = () => {
	return globalThis[LANGSMITH_FETCH_IMPLEMENTATION_KEY] ?? DEFAULT_FETCH_IMPLEMENTATION;
};
//#endregion
//#region node_modules/@langchain/langgraph-sdk/dist/node_modules/.pnpm/is-network-error@1.3.1/node_modules/is-network-error/index.js
var objectToString = Object.prototype.toString;
var isError$1 = (value) => objectToString.call(value) === "[object Error]";
var errorMessages = /* @__PURE__ */ new Set([
	"network error",
	"NetworkError when attempting to fetch resource.",
	"The Internet connection appears to be offline.",
	"Network request failed",
	"fetch failed",
	"terminated",
	" A network error occurred.",
	"Network connection lost"
]);
function isNetworkError$1(error) {
	if (!(error && isError$1(error) && error.name === "TypeError" && typeof error.message === "string")) return false;
	const { message, stack } = error;
	if (message === "Load failed") return stack === void 0 || "__sentry_captured__" in error;
	if (message.startsWith("error sending request for url")) return true;
	if (message === "Failed to fetch" || message.startsWith("Failed to fetch (") && message.endsWith(")")) return true;
	return errorMessages.has(message);
}
//#endregion
//#region node_modules/@langchain/langgraph-sdk/dist/node_modules/.pnpm/p-retry@7.1.1/node_modules/p-retry/index.js
function validateRetries(retries) {
	if (typeof retries === "number") {
		if (retries < 0) throw new TypeError("Expected `retries` to be a non-negative number.");
		if (Number.isNaN(retries)) throw new TypeError("Expected `retries` to be a valid number or Infinity, got NaN.");
	} else if (retries !== void 0) throw new TypeError("Expected `retries` to be a number or Infinity.");
}
function validateNumberOption(name, value, { min = 0, allowInfinity = false } = {}) {
	if (value === void 0) return;
	if (typeof value !== "number" || Number.isNaN(value)) throw new TypeError(`Expected \`${name}\` to be a number${allowInfinity ? " or Infinity" : ""}.`);
	if (!allowInfinity && !Number.isFinite(value)) throw new TypeError(`Expected \`${name}\` to be a finite number.`);
	if (value < min) throw new TypeError(`Expected \`${name}\` to be \u2265 ${min}.`);
}
var AbortError = class extends Error {
	constructor(message) {
		super();
		if (message instanceof Error) {
			this.originalError = message;
			({message} = message);
		} else {
			this.originalError = new Error(message);
			this.originalError.stack = this.stack;
		}
		this.name = "AbortError";
		this.message = message;
	}
};
function calculateDelay(retriesConsumed, options) {
	const attempt = Math.max(1, retriesConsumed + 1);
	const random = options.randomize ? Math.random() + 1 : 1;
	let timeout = Math.round(random * options.minTimeout * options.factor ** (attempt - 1));
	timeout = Math.min(timeout, options.maxTimeout);
	return timeout;
}
function calculateRemainingTime(start, max) {
	if (!Number.isFinite(max)) return max;
	return max - (performance.now() - start);
}
async function onAttemptFailure({ error, attemptNumber, retriesConsumed, startTime, options }) {
	const normalizedError = error instanceof Error ? error : /* @__PURE__ */ new TypeError(`Non-error was thrown: "${error}". You should only throw errors.`);
	if (normalizedError instanceof AbortError) throw normalizedError.originalError;
	const retriesLeft = Number.isFinite(options.retries) ? Math.max(0, options.retries - retriesConsumed) : options.retries;
	const maxRetryTime = options.maxRetryTime ?? Number.POSITIVE_INFINITY;
	const context = Object.freeze({
		error: normalizedError,
		attemptNumber,
		retriesLeft,
		retriesConsumed
	});
	await options.onFailedAttempt(context);
	if (calculateRemainingTime(startTime, maxRetryTime) <= 0) throw normalizedError;
	const consumeRetry = await options.shouldConsumeRetry(context);
	const remainingTime = calculateRemainingTime(startTime, maxRetryTime);
	if (remainingTime <= 0 || retriesLeft <= 0) throw normalizedError;
	if (normalizedError instanceof TypeError && !isNetworkError$1(normalizedError)) {
		if (consumeRetry) throw normalizedError;
		options.signal?.throwIfAborted();
		return false;
	}
	if (!await options.shouldRetry(context)) throw normalizedError;
	if (!consumeRetry) {
		options.signal?.throwIfAborted();
		return false;
	}
	const delayTime = calculateDelay(retriesConsumed, options);
	const finalDelay = Math.min(delayTime, remainingTime);
	options.signal?.throwIfAborted();
	if (finalDelay > 0) await new Promise((resolve, reject) => {
		const onAbort = () => {
			clearTimeout(timeoutToken);
			options.signal?.removeEventListener("abort", onAbort);
			reject(options.signal.reason);
		};
		const timeoutToken = setTimeout(() => {
			options.signal?.removeEventListener("abort", onAbort);
			resolve();
		}, finalDelay);
		if (options.unref) timeoutToken.unref?.();
		options.signal?.addEventListener("abort", onAbort, { once: true });
	});
	options.signal?.throwIfAborted();
	return true;
}
async function pRetry$1(input, options = {}) {
	options = { ...options };
	validateRetries(options.retries);
	if (Object.hasOwn(options, "forever")) throw new Error("The `forever` option is no longer supported. For many use-cases, you can set `retries: Infinity` instead.");
	options.retries ??= 10;
	options.factor ??= 2;
	options.minTimeout ??= 1e3;
	options.maxTimeout ??= Number.POSITIVE_INFINITY;
	options.maxRetryTime ??= Number.POSITIVE_INFINITY;
	options.randomize ??= false;
	options.onFailedAttempt ??= () => {};
	options.shouldRetry ??= () => true;
	options.shouldConsumeRetry ??= () => true;
	validateNumberOption("factor", options.factor, {
		min: 0,
		allowInfinity: false
	});
	validateNumberOption("minTimeout", options.minTimeout, {
		min: 0,
		allowInfinity: false
	});
	validateNumberOption("maxTimeout", options.maxTimeout, {
		min: 0,
		allowInfinity: true
	});
	validateNumberOption("maxRetryTime", options.maxRetryTime, {
		min: 0,
		allowInfinity: true
	});
	if (!(options.factor > 0)) options.factor = 1;
	options.signal?.throwIfAborted();
	let attemptNumber = 0;
	let retriesConsumed = 0;
	const startTime = performance.now();
	while (Number.isFinite(options.retries) ? retriesConsumed <= options.retries : true) {
		attemptNumber++;
		try {
			options.signal?.throwIfAborted();
			const result = await input(attemptNumber);
			options.signal?.throwIfAborted();
			return result;
		} catch (error) {
			if (await onAttemptFailure({
				error,
				attemptNumber,
				retriesConsumed,
				startTime,
				options
			})) retriesConsumed++;
		}
	}
	throw new Error("Retry attempts exhausted without throwing an error.");
}
//#endregion
//#region node_modules/@langchain/langgraph-sdk/dist/_virtual/_rolldown/runtime.js
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJSMin = (cb, mod) => () => (mod || cb((mod = { exports: {} }).exports, mod), mod.exports);
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
		key = keys[i];
		if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: ((k) => from[k]).bind(null, key),
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));
//#endregion
//#region node_modules/@langchain/langgraph-sdk/dist/node_modules/.pnpm/eventemitter3@5.0.4/node_modules/eventemitter3/index.js
var require_eventemitter3 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var has = Object.prototype.hasOwnProperty, prefix = "~";
	/**
	* Constructor to create a storage for our `EE` objects.
	* An `Events` instance is a plain object whose properties are event names.
	*
	* @constructor
	* @private
	*/
	function Events() {}
	if (Object.create) {
		Events.prototype = Object.create(null);
		if (!new Events().__proto__) prefix = false;
	}
	/**
	* Representation of a single event listener.
	*
	* @param {Function} fn The listener function.
	* @param {*} context The context to invoke the listener with.
	* @param {Boolean} [once=false] Specify if the listener is a one-time listener.
	* @constructor
	* @private
	*/
	function EE(fn, context, once) {
		this.fn = fn;
		this.context = context;
		this.once = once || false;
	}
	/**
	* Add a listener for a given event.
	*
	* @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
	* @param {(String|Symbol)} event The event name.
	* @param {Function} fn The listener function.
	* @param {*} context The context to invoke the listener with.
	* @param {Boolean} once Specify if the listener is a one-time listener.
	* @returns {EventEmitter}
	* @private
	*/
	function addListener(emitter, event, fn, context, once) {
		if (typeof fn !== "function") throw new TypeError("The listener must be a function");
		var listener = new EE(fn, context || emitter, once), evt = prefix ? prefix + event : event;
		if (!emitter._events[evt]) emitter._events[evt] = listener, emitter._eventsCount++;
		else if (!emitter._events[evt].fn) emitter._events[evt].push(listener);
		else emitter._events[evt] = [emitter._events[evt], listener];
		return emitter;
	}
	/**
	* Clear event by name.
	*
	* @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
	* @param {(String|Symbol)} evt The Event name.
	* @private
	*/
	function clearEvent(emitter, evt) {
		if (--emitter._eventsCount === 0) emitter._events = new Events();
		else delete emitter._events[evt];
	}
	/**
	* Minimal `EventEmitter` interface that is molded against the Node.js
	* `EventEmitter` interface.
	*
	* @constructor
	* @public
	*/
	function EventEmitter() {
		this._events = new Events();
		this._eventsCount = 0;
	}
	/**
	* Return an array listing the events for which the emitter has registered
	* listeners.
	*
	* @returns {Array}
	* @public
	*/
	EventEmitter.prototype.eventNames = function eventNames() {
		var names = [], events, name;
		if (this._eventsCount === 0) return names;
		for (name in events = this._events) if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
		if (Object.getOwnPropertySymbols) return names.concat(Object.getOwnPropertySymbols(events));
		return names;
	};
	/**
	* Return the listeners registered for a given event.
	*
	* @param {(String|Symbol)} event The event name.
	* @returns {Array} The registered listeners.
	* @public
	*/
	EventEmitter.prototype.listeners = function listeners(event) {
		var evt = prefix ? prefix + event : event, handlers = this._events[evt];
		if (!handlers) return [];
		if (handlers.fn) return [handlers.fn];
		for (var i = 0, l = handlers.length, ee = new Array(l); i < l; i++) ee[i] = handlers[i].fn;
		return ee;
	};
	/**
	* Return the number of listeners listening to a given event.
	*
	* @param {(String|Symbol)} event The event name.
	* @returns {Number} The number of listeners.
	* @public
	*/
	EventEmitter.prototype.listenerCount = function listenerCount(event) {
		var evt = prefix ? prefix + event : event, listeners = this._events[evt];
		if (!listeners) return 0;
		if (listeners.fn) return 1;
		return listeners.length;
	};
	/**
	* Calls each of the listeners registered for a given event.
	*
	* @param {(String|Symbol)} event The event name.
	* @returns {Boolean} `true` if the event had listeners, else `false`.
	* @public
	*/
	EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
		var evt = prefix ? prefix + event : event;
		if (!this._events[evt]) return false;
		var listeners = this._events[evt], len = arguments.length, args, i;
		if (listeners.fn) {
			if (listeners.once) this.removeListener(event, listeners.fn, void 0, true);
			switch (len) {
				case 1: return listeners.fn.call(listeners.context), true;
				case 2: return listeners.fn.call(listeners.context, a1), true;
				case 3: return listeners.fn.call(listeners.context, a1, a2), true;
				case 4: return listeners.fn.call(listeners.context, a1, a2, a3), true;
				case 5: return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
				case 6: return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
			}
			for (i = 1, args = new Array(len - 1); i < len; i++) args[i - 1] = arguments[i];
			listeners.fn.apply(listeners.context, args);
		} else {
			var length = listeners.length, j;
			for (i = 0; i < length; i++) {
				if (listeners[i].once) this.removeListener(event, listeners[i].fn, void 0, true);
				switch (len) {
					case 1:
						listeners[i].fn.call(listeners[i].context);
						break;
					case 2:
						listeners[i].fn.call(listeners[i].context, a1);
						break;
					case 3:
						listeners[i].fn.call(listeners[i].context, a1, a2);
						break;
					case 4:
						listeners[i].fn.call(listeners[i].context, a1, a2, a3);
						break;
					default:
						if (!args) for (j = 1, args = new Array(len - 1); j < len; j++) args[j - 1] = arguments[j];
						listeners[i].fn.apply(listeners[i].context, args);
				}
			}
		}
		return true;
	};
	/**
	* Add a listener for a given event.
	*
	* @param {(String|Symbol)} event The event name.
	* @param {Function} fn The listener function.
	* @param {*} [context=this] The context to invoke the listener with.
	* @returns {EventEmitter} `this`.
	* @public
	*/
	EventEmitter.prototype.on = function on(event, fn, context) {
		return addListener(this, event, fn, context, false);
	};
	/**
	* Add a one-time listener for a given event.
	*
	* @param {(String|Symbol)} event The event name.
	* @param {Function} fn The listener function.
	* @param {*} [context=this] The context to invoke the listener with.
	* @returns {EventEmitter} `this`.
	* @public
	*/
	EventEmitter.prototype.once = function once(event, fn, context) {
		return addListener(this, event, fn, context, true);
	};
	/**
	* Remove the listeners of a given event.
	*
	* @param {(String|Symbol)} event The event name.
	* @param {Function} fn Only remove the listeners that match this function.
	* @param {*} context Only remove the listeners that have this context.
	* @param {Boolean} once Only remove one-time listeners.
	* @returns {EventEmitter} `this`.
	* @public
	*/
	EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
		var evt = prefix ? prefix + event : event;
		if (!this._events[evt]) return this;
		if (!fn) {
			clearEvent(this, evt);
			return this;
		}
		var listeners = this._events[evt];
		if (listeners.fn) {
			if (listeners.fn === fn && (!once || listeners.once) && (!context || listeners.context === context)) clearEvent(this, evt);
		} else {
			for (var i = 0, events = [], length = listeners.length; i < length; i++) if (listeners[i].fn !== fn || once && !listeners[i].once || context && listeners[i].context !== context) events.push(listeners[i]);
			if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;
			else clearEvent(this, evt);
		}
		return this;
	};
	/**
	* Remove all listeners, or those of the specified event.
	*
	* @param {(String|Symbol)} [event] The event name.
	* @returns {EventEmitter} `this`.
	* @public
	*/
	EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
		var evt;
		if (event) {
			evt = prefix ? prefix + event : event;
			if (this._events[evt]) clearEvent(this, evt);
		} else {
			this._events = new Events();
			this._eventsCount = 0;
		}
		return this;
	};
	EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
	EventEmitter.prototype.addListener = EventEmitter.prototype.on;
	EventEmitter.prefixed = prefix;
	EventEmitter.EventEmitter = EventEmitter;
	if ("undefined" !== typeof module) module.exports = EventEmitter;
}));
require_eventemitter3();
//#endregion
//#region node_modules/@langchain/langgraph-sdk/dist/node_modules/.pnpm/eventemitter3@5.0.4/node_modules/eventemitter3/index2.js
var import_eventemitter3 = /* @__PURE__ */ __toESM(require_eventemitter3(), 1);
//#endregion
//#region node_modules/@langchain/langgraph-sdk/dist/node_modules/.pnpm/p-timeout@7.0.1/node_modules/p-timeout/index.js
var TimeoutError = class TimeoutError extends Error {
	name = "TimeoutError";
	constructor(message, options) {
		super(message, options);
		Error.captureStackTrace?.(this, TimeoutError);
	}
};
var getAbortedReason = (signal) => signal.reason ?? new DOMException("This operation was aborted.", "AbortError");
function pTimeout(promise, options) {
	const { milliseconds, fallback, message, customTimers = {
		setTimeout,
		clearTimeout
	}, signal } = options;
	let timer;
	let abortHandler;
	const cancelablePromise = new Promise((resolve, reject) => {
		if (typeof milliseconds !== "number" || Math.sign(milliseconds) !== 1) throw new TypeError(`Expected \`milliseconds\` to be a positive number, got \`${milliseconds}\``);
		if (signal?.aborted) {
			reject(getAbortedReason(signal));
			return;
		}
		if (signal) {
			abortHandler = () => {
				reject(getAbortedReason(signal));
			};
			signal.addEventListener("abort", abortHandler, { once: true });
		}
		promise.then(resolve, reject);
		if (milliseconds === Number.POSITIVE_INFINITY) return;
		const timeoutError = new TimeoutError();
		timer = customTimers.setTimeout.call(void 0, () => {
			if (fallback) {
				try {
					resolve(fallback());
				} catch (error) {
					reject(error);
				}
				return;
			}
			if (typeof promise.cancel === "function") promise.cancel();
			if (message === false) resolve();
			else if (message instanceof Error) reject(message);
			else {
				timeoutError.message = message ?? `Promise timed out after ${milliseconds} milliseconds`;
				reject(timeoutError);
			}
		}, milliseconds);
	}).finally(() => {
		cancelablePromise.clear();
		if (abortHandler && signal) signal.removeEventListener("abort", abortHandler);
	});
	cancelablePromise.clear = () => {
		customTimers.clearTimeout.call(void 0, timer);
		timer = void 0;
	};
	return cancelablePromise;
}
//#endregion
//#region node_modules/@langchain/langgraph-sdk/dist/node_modules/.pnpm/p-queue@9.1.0/node_modules/p-queue/dist/lower-bound.js
function lowerBound(array, value, comparator) {
	let first = 0;
	let count = array.length;
	while (count > 0) {
		const step = Math.trunc(count / 2);
		let it = first + step;
		if (comparator(array[it], value) <= 0) {
			first = ++it;
			count -= step + 1;
		} else count = step;
	}
	return first;
}
//#endregion
//#region node_modules/@langchain/langgraph-sdk/dist/node_modules/.pnpm/p-queue@9.1.0/node_modules/p-queue/dist/priority-queue.js
var PriorityQueue = class {
	#queue = [];
	enqueue(run, options) {
		const { priority = 0, id } = options ?? {};
		const element = {
			priority,
			id,
			run
		};
		if (this.size === 0 || this.#queue[this.size - 1].priority >= priority) {
			this.#queue.push(element);
			return;
		}
		const index = lowerBound(this.#queue, element, (a, b) => b.priority - a.priority);
		this.#queue.splice(index, 0, element);
	}
	setPriority(id, priority) {
		const index = this.#queue.findIndex((element) => element.id === id);
		if (index === -1) throw new ReferenceError(`No promise function with the id "${id}" exists in the queue.`);
		const [item] = this.#queue.splice(index, 1);
		this.enqueue(item.run, {
			priority,
			id
		});
	}
	dequeue() {
		return this.#queue.shift()?.run;
	}
	filter(options) {
		return this.#queue.filter((element) => element.priority === options.priority).map((element) => element.run);
	}
	get size() {
		return this.#queue.length;
	}
};
//#endregion
//#region node_modules/@langchain/langgraph-sdk/dist/node_modules/.pnpm/p-queue@9.1.0/node_modules/p-queue/dist/index.js
/**
Promise queue with concurrency control.
*/
var PQueue = class extends import_eventemitter3.default {
	#carryoverIntervalCount;
	#isIntervalIgnored;
	#intervalCount = 0;
	#intervalCap;
	#rateLimitedInInterval = false;
	#rateLimitFlushScheduled = false;
	#interval;
	#intervalEnd = 0;
	#lastExecutionTime = 0;
	#intervalId;
	#timeoutId;
	#strict;
	#strictTicks = [];
	#strictTicksStartIndex = 0;
	#queue;
	#queueClass;
	#pending = 0;
	#concurrency;
	#isPaused;
	#idAssigner = 1n;
	#runningTasks = /* @__PURE__ */ new Map();
	/**
	Get or set the default timeout for all tasks. Can be changed at runtime.
	
	Operations will throw a `TimeoutError` if they don't complete within the specified time.
	
	The timeout begins when the operation is dequeued and starts execution, not while it's waiting in the queue.
	
	@example
	```
	const queue = new PQueue({timeout: 5000});
	
	// Change timeout for all future tasks
	queue.timeout = 10000;
	```
	*/
	timeout;
	constructor(options) {
		super();
		options = {
			carryoverIntervalCount: false,
			intervalCap: Number.POSITIVE_INFINITY,
			interval: 0,
			concurrency: Number.POSITIVE_INFINITY,
			autoStart: true,
			queueClass: PriorityQueue,
			strict: false,
			...options
		};
		if (!(typeof options.intervalCap === "number" && options.intervalCap >= 1)) throw new TypeError(`Expected \`intervalCap\` to be a number from 1 and up, got \`${options.intervalCap?.toString() ?? ""}\` (${typeof options.intervalCap})`);
		if (options.interval === void 0 || !(Number.isFinite(options.interval) && options.interval >= 0)) throw new TypeError(`Expected \`interval\` to be a finite number >= 0, got \`${options.interval?.toString() ?? ""}\` (${typeof options.interval})`);
		if (options.strict && options.interval === 0) throw new TypeError("The `strict` option requires a non-zero `interval`");
		if (options.strict && options.intervalCap === Number.POSITIVE_INFINITY) throw new TypeError("The `strict` option requires a finite `intervalCap`");
		this.#carryoverIntervalCount = options.carryoverIntervalCount ?? options.carryoverConcurrencyCount ?? false;
		this.#isIntervalIgnored = options.intervalCap === Number.POSITIVE_INFINITY || options.interval === 0;
		this.#intervalCap = options.intervalCap;
		this.#interval = options.interval;
		this.#strict = options.strict;
		this.#queue = new options.queueClass();
		this.#queueClass = options.queueClass;
		this.concurrency = options.concurrency;
		if (options.timeout !== void 0 && !(Number.isFinite(options.timeout) && options.timeout > 0)) throw new TypeError(`Expected \`timeout\` to be a positive finite number, got \`${options.timeout}\` (${typeof options.timeout})`);
		this.timeout = options.timeout;
		this.#isPaused = options.autoStart === false;
		this.#setupRateLimitTracking();
	}
	#cleanupStrictTicks(now) {
		while (this.#strictTicksStartIndex < this.#strictTicks.length) {
			const oldestTick = this.#strictTicks[this.#strictTicksStartIndex];
			if (oldestTick !== void 0 && now - oldestTick >= this.#interval) this.#strictTicksStartIndex++;
			else break;
		}
		if (this.#strictTicksStartIndex > 100 && this.#strictTicksStartIndex > this.#strictTicks.length / 2 || this.#strictTicksStartIndex === this.#strictTicks.length) {
			this.#strictTicks = this.#strictTicks.slice(this.#strictTicksStartIndex);
			this.#strictTicksStartIndex = 0;
		}
	}
	#consumeIntervalSlot(now) {
		if (this.#strict) this.#strictTicks.push(now);
		else this.#intervalCount++;
	}
	#rollbackIntervalSlot() {
		if (this.#strict) {
			if (this.#strictTicks.length > this.#strictTicksStartIndex) this.#strictTicks.pop();
		} else if (this.#intervalCount > 0) this.#intervalCount--;
	}
	#getActiveTicksCount() {
		return this.#strictTicks.length - this.#strictTicksStartIndex;
	}
	get #doesIntervalAllowAnother() {
		if (this.#isIntervalIgnored) return true;
		if (this.#strict) return this.#getActiveTicksCount() < this.#intervalCap;
		return this.#intervalCount < this.#intervalCap;
	}
	get #doesConcurrentAllowAnother() {
		return this.#pending < this.#concurrency;
	}
	#next() {
		this.#pending--;
		if (this.#pending === 0) this.emit("pendingZero");
		this.#tryToStartAnother();
		this.emit("next");
	}
	#onResumeInterval() {
		this.#timeoutId = void 0;
		this.#onInterval();
		this.#initializeIntervalIfNeeded();
	}
	#isIntervalPausedAt(now) {
		if (this.#strict) {
			this.#cleanupStrictTicks(now);
			if (this.#getActiveTicksCount() >= this.#intervalCap) {
				const oldestTick = this.#strictTicks[this.#strictTicksStartIndex];
				const delay = this.#interval - (now - oldestTick);
				this.#createIntervalTimeout(delay);
				return true;
			}
			return false;
		}
		if (this.#intervalId === void 0) {
			const delay = this.#intervalEnd - now;
			if (delay < 0) {
				if (this.#lastExecutionTime > 0) {
					const timeSinceLastExecution = now - this.#lastExecutionTime;
					if (timeSinceLastExecution < this.#interval) {
						this.#createIntervalTimeout(this.#interval - timeSinceLastExecution);
						return true;
					}
				}
				this.#intervalCount = this.#carryoverIntervalCount ? this.#pending : 0;
			} else {
				this.#createIntervalTimeout(delay);
				return true;
			}
		}
		return false;
	}
	#createIntervalTimeout(delay) {
		if (this.#timeoutId !== void 0) return;
		this.#timeoutId = setTimeout(() => {
			this.#onResumeInterval();
		}, delay);
	}
	#clearIntervalTimer() {
		if (this.#intervalId) {
			clearInterval(this.#intervalId);
			this.#intervalId = void 0;
		}
	}
	#clearTimeoutTimer() {
		if (this.#timeoutId) {
			clearTimeout(this.#timeoutId);
			this.#timeoutId = void 0;
		}
	}
	#tryToStartAnother() {
		if (this.#queue.size === 0) {
			this.#clearIntervalTimer();
			this.emit("empty");
			if (this.#pending === 0) {
				this.#clearTimeoutTimer();
				if (this.#strict && this.#strictTicksStartIndex > 0) {
					const now = Date.now();
					this.#cleanupStrictTicks(now);
				}
				this.emit("idle");
			}
			return false;
		}
		let taskStarted = false;
		if (!this.#isPaused) {
			const now = Date.now();
			const canInitializeInterval = !this.#isIntervalPausedAt(now);
			if (this.#doesIntervalAllowAnother && this.#doesConcurrentAllowAnother) {
				const job = this.#queue.dequeue();
				if (!this.#isIntervalIgnored) {
					this.#consumeIntervalSlot(now);
					this.#scheduleRateLimitUpdate();
				}
				this.emit("active");
				job();
				if (canInitializeInterval) this.#initializeIntervalIfNeeded();
				taskStarted = true;
			}
		}
		return taskStarted;
	}
	#initializeIntervalIfNeeded() {
		if (this.#isIntervalIgnored || this.#intervalId !== void 0) return;
		if (this.#strict) return;
		this.#intervalId = setInterval(() => {
			this.#onInterval();
		}, this.#interval);
		this.#intervalEnd = Date.now() + this.#interval;
	}
	#onInterval() {
		if (!this.#strict) {
			if (this.#intervalCount === 0 && this.#pending === 0 && this.#intervalId) this.#clearIntervalTimer();
			this.#intervalCount = this.#carryoverIntervalCount ? this.#pending : 0;
		}
		this.#processQueue();
		this.#scheduleRateLimitUpdate();
	}
	/**
	Executes all queued functions until it reaches the limit.
	*/
	#processQueue() {
		while (this.#tryToStartAnother());
	}
	get concurrency() {
		return this.#concurrency;
	}
	set concurrency(newConcurrency) {
		if (!(typeof newConcurrency === "number" && newConcurrency >= 1)) throw new TypeError(`Expected \`concurrency\` to be a number from 1 and up, got \`${newConcurrency}\` (${typeof newConcurrency})`);
		this.#concurrency = newConcurrency;
		this.#processQueue();
	}
	/**
	Updates the priority of a promise function by its id, affecting its execution order. Requires a defined concurrency limit to take effect.
	
	For example, this can be used to prioritize a promise function to run earlier.
	
	```js
	import PQueue from 'p-queue';
	
	const queue = new PQueue({concurrency: 1});
	
	queue.add(async () => '🦄', {priority: 1});
	queue.add(async () => '🦀', {priority: 0, id: '🦀'});
	queue.add(async () => '🦄', {priority: 1});
	queue.add(async () => '🦄', {priority: 1});
	
	queue.setPriority('🦀', 2);
	```
	
	In this case, the promise function with `id: '🦀'` runs second.
	
	You can also deprioritize a promise function to delay its execution:
	
	```js
	import PQueue from 'p-queue';
	
	const queue = new PQueue({concurrency: 1});
	
	queue.add(async () => '🦄', {priority: 1});
	queue.add(async () => '🦀', {priority: 1, id: '🦀'});
	queue.add(async () => '🦄');
	queue.add(async () => '🦄', {priority: 0});
	
	queue.setPriority('🦀', -1);
	```
	Here, the promise function with `id: '🦀'` executes last.
	*/
	setPriority(id, priority) {
		if (typeof priority !== "number" || !Number.isFinite(priority)) throw new TypeError(`Expected \`priority\` to be a finite number, got \`${priority}\` (${typeof priority})`);
		this.#queue.setPriority(id, priority);
	}
	async add(function_, options = {}) {
		options = {
			timeout: this.timeout,
			...options,
			id: options.id ?? (this.#idAssigner++).toString()
		};
		return new Promise((resolve, reject) => {
			const taskSymbol = Symbol(`task-${options.id}`);
			this.#queue.enqueue(async () => {
				this.#pending++;
				this.#runningTasks.set(taskSymbol, {
					id: options.id,
					priority: options.priority ?? 0,
					startTime: Date.now(),
					timeout: options.timeout
				});
				let eventListener;
				try {
					try {
						options.signal?.throwIfAborted();
					} catch (error) {
						this.#rollbackIntervalConsumption();
						this.#runningTasks.delete(taskSymbol);
						throw error;
					}
					this.#lastExecutionTime = Date.now();
					let operation = function_({ signal: options.signal });
					if (options.timeout) operation = pTimeout(Promise.resolve(operation), {
						milliseconds: options.timeout,
						message: `Task timed out after ${options.timeout}ms (queue has ${this.#pending} running, ${this.#queue.size} waiting)`
					});
					if (options.signal) {
						const { signal } = options;
						operation = Promise.race([operation, new Promise((_resolve, reject) => {
							eventListener = () => {
								reject(signal.reason);
							};
							signal.addEventListener("abort", eventListener, { once: true });
						})]);
					}
					const result = await operation;
					resolve(result);
					this.emit("completed", result);
				} catch (error) {
					reject(error);
					this.emit("error", error);
				} finally {
					if (eventListener) options.signal?.removeEventListener("abort", eventListener);
					this.#runningTasks.delete(taskSymbol);
					queueMicrotask(() => {
						this.#next();
					});
				}
			}, options);
			this.emit("add");
			this.#tryToStartAnother();
		});
	}
	async addAll(functions, options) {
		return Promise.all(functions.map(async (function_) => this.add(function_, options)));
	}
	/**
	Start (or resume) executing enqueued tasks within concurrency limit. No need to call this if queue is not paused (via `options.autoStart = false` or by `.pause()` method.)
	*/
	start() {
		if (!this.#isPaused) return this;
		this.#isPaused = false;
		this.#processQueue();
		return this;
	}
	/**
	Put queue execution on hold.
	*/
	pause() {
		this.#isPaused = true;
	}
	/**
	Clear the queue.
	*/
	clear() {
		this.#queue = new this.#queueClass();
		this.#clearIntervalTimer();
		this.#updateRateLimitState();
		this.emit("empty");
		if (this.#pending === 0) {
			this.#clearTimeoutTimer();
			this.emit("idle");
		}
		this.emit("next");
	}
	/**
	Can be called multiple times. Useful if you for example add additional items at a later time.
	
	@returns A promise that settles when the queue becomes empty.
	*/
	async onEmpty() {
		if (this.#queue.size === 0) return;
		await this.#onEvent("empty");
	}
	/**
	@returns A promise that settles when the queue size is less than the given limit: `queue.size < limit`.
	
	If you want to avoid having the queue grow beyond a certain size you can `await queue.onSizeLessThan()` before adding a new item.
	
	Note that this only limits the number of items waiting to start. There could still be up to `concurrency` jobs already running that this call does not include in its calculation.
	*/
	async onSizeLessThan(limit) {
		if (this.#queue.size < limit) return;
		await this.#onEvent("next", () => this.#queue.size < limit);
	}
	/**
	The difference with `.onEmpty` is that `.onIdle` guarantees that all work from the queue has finished. `.onEmpty` merely signals that the queue is empty, but it could mean that some promises haven't completed yet.
	
	@returns A promise that settles when the queue becomes empty, and all promises have completed; `queue.size === 0 && queue.pending === 0`.
	*/
	async onIdle() {
		if (this.#pending === 0 && this.#queue.size === 0) return;
		await this.#onEvent("idle");
	}
	/**
	The difference with `.onIdle` is that `.onPendingZero` only waits for currently running tasks to finish, ignoring queued tasks.
	
	@returns A promise that settles when all currently running tasks have completed; `queue.pending === 0`.
	*/
	async onPendingZero() {
		if (this.#pending === 0) return;
		await this.#onEvent("pendingZero");
	}
	/**
	@returns A promise that settles when the queue becomes rate-limited due to intervalCap.
	*/
	async onRateLimit() {
		if (this.isRateLimited) return;
		await this.#onEvent("rateLimit");
	}
	/**
	@returns A promise that settles when the queue is no longer rate-limited.
	*/
	async onRateLimitCleared() {
		if (!this.isRateLimited) return;
		await this.#onEvent("rateLimitCleared");
	}
	/**
	@returns A promise that rejects when any task in the queue errors.
	
	Use with `Promise.race([queue.onError(), queue.onIdle()])` to fail fast on the first error while still resolving normally when the queue goes idle.
	
	Important: The promise returned by `add()` still rejects. You must handle each `add()` promise (for example, `.catch(() => {})`) to avoid unhandled rejections.
	
	@example
	```
	import PQueue from 'p-queue';
	
	const queue = new PQueue({concurrency: 2});
	
	queue.add(() => fetchData(1)).catch(() => {});
	queue.add(() => fetchData(2)).catch(() => {});
	queue.add(() => fetchData(3)).catch(() => {});
	
	// Stop processing on first error
	try {
	await Promise.race([
	queue.onError(),
	queue.onIdle()
	]);
	} catch (error) {
	queue.pause(); // Stop processing remaining tasks
	console.error('Queue failed:', error);
	}
	```
	*/
	onError() {
		return new Promise((_resolve, reject) => {
			const handleError = (error) => {
				this.off("error", handleError);
				reject(error);
			};
			this.on("error", handleError);
		});
	}
	async #onEvent(event, filter) {
		return new Promise((resolve) => {
			const listener = () => {
				if (filter && !filter()) return;
				this.off(event, listener);
				resolve();
			};
			this.on(event, listener);
		});
	}
	/**
	Size of the queue, the number of queued items waiting to run.
	*/
	get size() {
		return this.#queue.size;
	}
	/**
	Size of the queue, filtered by the given options.
	
	For example, this can be used to find the number of items remaining in the queue with a specific priority level.
	*/
	sizeBy(options) {
		return this.#queue.filter(options).length;
	}
	/**
	Number of running items (no longer in the queue).
	*/
	get pending() {
		return this.#pending;
	}
	/**
	Whether the queue is currently paused.
	*/
	get isPaused() {
		return this.#isPaused;
	}
	#setupRateLimitTracking() {
		if (this.#isIntervalIgnored) return;
		this.on("add", () => {
			if (this.#queue.size > 0) this.#scheduleRateLimitUpdate();
		});
		this.on("next", () => {
			this.#scheduleRateLimitUpdate();
		});
	}
	#scheduleRateLimitUpdate() {
		if (this.#isIntervalIgnored || this.#rateLimitFlushScheduled) return;
		this.#rateLimitFlushScheduled = true;
		queueMicrotask(() => {
			this.#rateLimitFlushScheduled = false;
			this.#updateRateLimitState();
		});
	}
	#rollbackIntervalConsumption() {
		if (this.#isIntervalIgnored) return;
		this.#rollbackIntervalSlot();
		this.#scheduleRateLimitUpdate();
	}
	#updateRateLimitState() {
		const previous = this.#rateLimitedInInterval;
		if (this.#isIntervalIgnored || this.#queue.size === 0) {
			if (previous) {
				this.#rateLimitedInInterval = false;
				this.emit("rateLimitCleared");
			}
			return;
		}
		let count;
		if (this.#strict) {
			const now = Date.now();
			this.#cleanupStrictTicks(now);
			count = this.#getActiveTicksCount();
		} else count = this.#intervalCount;
		const shouldBeRateLimited = count >= this.#intervalCap;
		if (shouldBeRateLimited !== previous) {
			this.#rateLimitedInInterval = shouldBeRateLimited;
			this.emit(shouldBeRateLimited ? "rateLimit" : "rateLimitCleared");
		}
	}
	/**
	Whether the queue is currently rate-limited due to intervalCap.
	*/
	get isRateLimited() {
		return this.#rateLimitedInInterval;
	}
	/**
	Whether the queue is saturated. Returns `true` when:
	- All concurrency slots are occupied and tasks are waiting, OR
	- The queue is rate-limited and tasks are waiting
	
	Useful for detecting backpressure and potential hanging tasks.
	
	```js
	import PQueue from 'p-queue';
	
	const queue = new PQueue({concurrency: 2});
	
	// Backpressure handling
	if (queue.isSaturated) {
	console.log('Queue is saturated, waiting for capacity...');
	await queue.onSizeLessThan(queue.concurrency);
	}
	
	// Monitoring for stuck tasks
	setInterval(() => {
	if (queue.isSaturated) {
	console.warn(`Queue saturated: ${queue.pending} running, ${queue.size} waiting`);
	}
	}, 60000);
	```
	*/
	get isSaturated() {
		return this.#pending === this.#concurrency && this.#queue.size > 0 || this.isRateLimited && this.#queue.size > 0;
	}
	/**
	The tasks currently being executed. Each task includes its `id`, `priority`, `startTime`, and `timeout` (if set).
	
	Returns an array of task info objects.
	
	```js
	import PQueue from 'p-queue';
	
	const queue = new PQueue({concurrency: 2});
	
	// Add tasks with IDs for better debugging
	queue.add(() => fetchUser(123), {id: 'user-123'});
	queue.add(() => fetchPosts(456), {id: 'posts-456', priority: 1});
	
	// Check what's running
	console.log(queue.runningTasks);
	// => [{
	//   id: 'user-123',
	//   priority: 0,
	//   startTime: 1759253001716,
	//   timeout: undefined
	// }, {
	//   id: 'posts-456',
	//   priority: 1,
	//   startTime: 1759253001916,
	//   timeout: undefined
	// }]
	```
	*/
	get runningTasks() {
		return [...this.#runningTasks.values()].map((task) => ({ ...task }));
	}
};
//#endregion
//#region node_modules/@langchain/langgraph-sdk/dist/utils/async_caller.js
/**
* `p-retry` is a pure-ESM module that we bundle into the build output (so the
* CJS artifact doesn't `require()` an ESM module). Depending on how a
* downstream transpiler/bundler (e.g. `tsx`/esbuild) resolves the default
* export of the bundled chunk, the import can come through either as the
* function itself or as a namespace-like `{ default: fn }`. Normalize to the
* callable, mirroring the `"default" in` interop guard used for `p-queue`.
*/
var pRetry = typeof pRetry$1 === "function" ? pRetry$1 : pRetry$1.default;
var STATUS_NO_RETRY = [
	400,
	401,
	402,
	403,
	404,
	405,
	406,
	407,
	408,
	409,
	422
];
/**
* Do not rely on globalThis.Response, rather just
* do duck typing
*/
function isResponse(x) {
	if (x == null || typeof x !== "object") return false;
	return "status" in x && "statusText" in x && "text" in x;
}
/**
* Utility error to properly handle failed requests
*/
var HTTPError = class HTTPError extends Error {
	status;
	text;
	response;
	constructor(status, message, response) {
		super(`HTTP ${status}: ${message}`);
		this.status = status;
		this.text = message;
		this.response = response;
	}
	static async fromResponse(response, options) {
		try {
			return new HTTPError(response.status, await response.text(), options?.includeResponse ? response : void 0);
		} catch {
			return new HTTPError(response.status, response.statusText, options?.includeResponse ? response : void 0);
		}
	}
};
/**
* A class that can be used to make async calls with concurrency and retry logic.
*
* This is useful for making calls to any kind of "expensive" external resource,
* be it because it's rate-limited, subject to network issues, etc.
*
* Concurrent calls are limited by the `maxConcurrency` parameter, which defaults
* to `Infinity`. This means that by default, all calls will be made in parallel.
*
* Retries are limited by the `maxRetries` parameter, which defaults to 5. This
* means that by default, each call will be retried up to 5 times, with an
* exponential backoff between each attempt.
*/
var AsyncCaller = class {
	maxConcurrency;
	maxRetries;
	queue;
	onFailedResponseHook;
	customFetch;
	constructor(params) {
		this.maxConcurrency = params.maxConcurrency ?? Infinity;
		this.maxRetries = params.maxRetries ?? 4;
		if ("default" in PQueue) this.queue = new PQueue.default({ concurrency: this.maxConcurrency });
		else this.queue = new PQueue({ concurrency: this.maxConcurrency });
		this.onFailedResponseHook = params?.onFailedResponseHook;
		this.customFetch = params.fetch;
	}
	call(callable, ...args) {
		const { onFailedResponseHook } = this;
		return this.queue.add(() => pRetry(() => callable(...args).catch(async (error) => {
			if (error instanceof Error) throw error;
			else if (isResponse(error)) throw await HTTPError.fromResponse(error, { includeResponse: !!onFailedResponseHook });
			else throw new Error(error);
		}), {
			async onFailedAttempt({ error, retriesLeft }) {
				const errorMessage = error.message ?? "";
				if (errorMessage.startsWith("Cancel") || errorMessage.startsWith("TimeoutError") || errorMessage.startsWith("AbortError")) throw error;
				if (error?.code === "ECONNABORTED") throw error;
				if (errorMessage.includes("ECONNREFUSED") || errorMessage.includes("fetch failed") || errorMessage.includes("Failed to fetch") || errorMessage.includes("NetworkError")) {
					if (retriesLeft > 0) return;
					const connectionError = /* @__PURE__ */ new Error(`Unable to connect to LangGraph server. Please ensure the server is running and accessible. Original error: ${errorMessage}`);
					connectionError.name = "ConnectionError";
					throw connectionError;
				}
				if (error instanceof HTTPError) {
					if (STATUS_NO_RETRY.includes(error.status)) throw error;
					if (onFailedResponseHook && error.response) await onFailedResponseHook(error.response);
				}
			},
			retries: this.maxRetries,
			randomize: true
		}), { throwOnTimeout: true });
	}
	callWithOptions(options, callable, ...args) {
		if (options.signal) return Promise.race([this.call(callable, ...args), new Promise((_, reject) => {
			options.signal?.addEventListener("abort", () => {
				reject(/* @__PURE__ */ new Error("AbortError"));
			});
		})]);
		return this.call(callable, ...args);
	}
	fetch(...args) {
		const fetchFn = this.customFetch ?? _getFetchImplementation();
		return this.call(() => fetchFn(...args).then((res) => res.ok ? res : Promise.reject(res)));
	}
};
//#endregion
//#region node_modules/@langchain/langgraph-sdk/dist/utils/env.js
function getEnvironmentVariable(name) {
	try {
		return typeof process !== "undefined" ? process.env?.[name] : void 0;
	} catch {
		return;
	}
}
//#endregion
//#region node_modules/@langchain/langgraph-sdk/dist/utils/signals.js
function mergeSignals(...signals) {
	const nonZeroSignals = signals.filter((signal) => signal != null);
	if (nonZeroSignals.length === 0) return void 0;
	if (nonZeroSignals.length === 1) return nonZeroSignals[0];
	const controller = new AbortController();
	for (const signal of signals) {
		if (signal?.aborted) {
			controller.abort(signal.reason);
			return controller.signal;
		}
		signal?.addEventListener("abort", () => controller.abort(signal.reason), { once: true });
	}
	return controller.signal;
}
//#endregion
//#region node_modules/@langchain/langgraph-sdk/dist/utils/sse.js
var CR = "\r".charCodeAt(0);
var LF = "\n".charCodeAt(0);
var NULL = "\0".charCodeAt(0);
var COLON = ":".charCodeAt(0);
var SPACE = " ".charCodeAt(0);
var TRAILING_NEWLINE = [CR, LF];
function BytesLineDecoder() {
	let buffer = [];
	let trailingCr = false;
	return new TransformStream({
		start() {
			buffer = [];
			trailingCr = false;
		},
		transform(chunk, controller) {
			let text = chunk;
			if (trailingCr) {
				text = joinArrays([[CR], text]);
				trailingCr = false;
			}
			if (text.length > 0 && text.at(-1) === CR) {
				trailingCr = true;
				text = text.subarray(0, -1);
			}
			if (!text.length) return;
			const trailingNewline = TRAILING_NEWLINE.includes(text.at(-1));
			const lastIdx = text.length - 1;
			const { lines } = text.reduce((acc, cur, idx) => {
				if (acc.from > idx) return acc;
				if (cur === CR || cur === LF) {
					acc.lines.push(text.subarray(acc.from, idx));
					if (cur === CR && text[idx + 1] === LF) acc.from = idx + 2;
					else acc.from = idx + 1;
				}
				if (idx === lastIdx && acc.from <= lastIdx) acc.lines.push(text.subarray(acc.from));
				return acc;
			}, {
				lines: [],
				from: 0
			});
			if (lines.length === 1 && !trailingNewline) {
				buffer.push(lines[0]);
				return;
			}
			if (buffer.length) {
				buffer.push(lines[0]);
				lines[0] = joinArrays(buffer);
				buffer = [];
			}
			if (!trailingNewline) {
				if (lines.length) buffer = [lines.pop()];
			}
			for (const line of lines) controller.enqueue(line);
		},
		flush(controller) {
			if (buffer.length) controller.enqueue(joinArrays(buffer));
		}
	});
}
function SSEDecoder() {
	let event = "";
	let data = [];
	let lastEventId = "";
	let retry = null;
	const decoder = new TextDecoder();
	return new TransformStream({
		transform(chunk, controller) {
			if (!chunk.length) {
				if (!event && !data.length && !lastEventId && retry == null) return;
				const sse = {
					id: lastEventId || void 0,
					event,
					data: data.length ? decodeArraysToJson(decoder, data) : null
				};
				event = "";
				data = [];
				retry = null;
				controller.enqueue(sse);
				return;
			}
			if (chunk[0] === COLON) return;
			const sepIdx = chunk.indexOf(COLON);
			if (sepIdx === -1) return;
			const fieldName = decoder.decode(chunk.subarray(0, sepIdx));
			let value = chunk.subarray(sepIdx + 1);
			if (value[0] === SPACE) value = value.subarray(1);
			if (fieldName === "event") event = decoder.decode(value);
			else if (fieldName === "data") data.push(value);
			else if (fieldName === "id") {
				if (value.indexOf(NULL) === -1) lastEventId = decoder.decode(value);
			} else if (fieldName === "retry") {
				const retryNum = Number.parseInt(decoder.decode(value), 10);
				if (!Number.isNaN(retryNum)) retry = retryNum;
			}
		},
		flush(controller) {
			if (event) controller.enqueue({
				id: lastEventId || void 0,
				event,
				data: data.length ? decodeArraysToJson(decoder, data) : null
			});
		}
	});
}
function joinArrays(data) {
	const totalLength = data.reduce((acc, curr) => acc + curr.length, 0);
	const merged = new Uint8Array(totalLength);
	let offset = 0;
	for (const c of data) {
		merged.set(c, offset);
		offset += c.length;
	}
	return merged;
}
function decodeArraysToJson(decoder, data) {
	return JSON.parse(decoder.decode(joinArrays(data)));
}
//#endregion
//#region node_modules/@langchain/langgraph-sdk/dist/utils/error.js
var isError = (error) => {
	if ("isError" in Error && typeof Error.isError === "function") return Error.isError(error);
	const stringTag = Object.prototype.toString.call(error);
	return stringTag === "[object Error]" || stringTag === "[object DOMException]" || stringTag === "[object DOMError]" || stringTag === "[object Exception]";
};
var getCauseError = (error) => {
	const { cause } = error;
	if (typeof cause !== "object" || cause == null) return null;
	if (!isError(cause)) return null;
	return cause;
};
var isNetworkError = (error) => {
	if (!isError(error)) return false;
	if (error.name !== "TypeError" || typeof error.message !== "string") return false;
	const msg = error.message.toLowerCase();
	const causeMsg = getCauseError(error)?.message?.toLowerCase() ?? "";
	return msg.includes("fetch") || msg.includes("network") || msg.includes("connection") || msg.includes("error sending request") || msg.includes("load failed") || msg.includes("terminated") || causeMsg.includes("other side closed") || causeMsg.includes("socket");
};
//#endregion
//#region node_modules/@langchain/langgraph-sdk/dist/utils/reconnect.js
/** Base delay (ms) for exponential reconnect backoff (`base * 2^(attempt-1)`). */
var DEFAULT_RECONNECT_BASE_DELAY_MS = 1e3;
/** Cap (ms) for exponential reconnect backoff before jitter. */
var DEFAULT_RECONNECT_MAX_DELAY_MS = 5e3;
/** Max random jitter (ms) added on top of the capped base delay. */
var DEFAULT_RECONNECT_JITTER_MS = 1e3;
/**
* Exponential backoff with jitter for stream reconnect.
* `min(base * 2^(attempt-1), max) + random(0, jitter)`.
*/
function reconnectDelayMs(attempt) {
	return Math.min(DEFAULT_RECONNECT_BASE_DELAY_MS * 2 ** (attempt - 1), DEFAULT_RECONNECT_MAX_DELAY_MS) + Math.random() * DEFAULT_RECONNECT_JITTER_MS;
}
//#endregion
//#region node_modules/@langchain/langgraph-sdk/dist/utils/stream.js
/**
* Error thrown when maximum reconnection attempts are exceeded.
*/
var MaxReconnectAttemptsError = class extends Error {
	constructor(maxAttempts, cause) {
		super(`Exceeded maximum SSE reconnection attempts (${maxAttempts})`);
		this.name = "MaxReconnectAttemptsError";
		this.cause = cause;
	}
};
/**
* Error injected into the stream by {@link idleReconnectStream} when no lines
* arrive within the active idle window. Surfacing this during the read is what
* lets the reconnect loops in `streamWithRetry` and the protocol SSE transport
* recover from a half-open socket — one that was silently dropped (e.g. a hard
* pod kill on a platform revision rollover) without a TCP FIN/RST, so neither
* a `done` nor a thrown network error ever arrives.
*/
var StreamIdleTimeoutError = class extends Error {
	idleTimeoutMs;
	constructor(idleTimeoutMs) {
		super(`No SSE bytes received for ${idleTimeoutMs}ms; assuming the connection is half-open and reconnecting.`);
		this.name = "StreamIdleTimeoutError";
		this.idleTimeoutMs = idleTimeoutMs;
	}
};
/** `":"` — first byte of an SSE comment / keep-alive line. */
var SSE_COMMENT_BYTE = 58;
/**
* A pass-through {@link TransformStream} that errors the stream when it goes
* idle, so the surrounding reconnect logic can recover a half-open socket.
*
* MUST sit on the *line* stream — i.e. after
* {@link import("./sse.js").BytesLineDecoder} but before
* {@link import("./sse.js").SSEDecoder} (which discards `:` comment lines).
* Operating at the line level lets the watchdog both (a) reset on any line
* (data *or* heartbeat = liveness) and (b) recognise heartbeat comment lines
* to drive `"auto"` mode.
*
* In `"auto"` mode the watchdog is intentionally dormant until it has seen at
* least two heartbeats (so it can measure the cadence). This means a socket
* that dies inside the first heartbeat interval won't be caught until a
* heartbeat would have been due — an acceptable trade for never false-firing
* on heartbeat-less servers. Pass a fixed `number` if you need coverage from
* the very first byte.
*/
function idleReconnectStream(options) {
	const factor = options.timeoutFactor ?? 3;
	const minTimeoutMs = options.minTimeoutMs ?? 6e3;
	const maxTimeoutMs = options.maxTimeoutMs ?? 3e4;
	const fixedTimeoutMs = typeof options.mode === "number" ? options.mode : null;
	let timer;
	let controllerRef;
	let lastHeartbeatAt;
	let derivedTimeoutMs = fixedTimeoutMs;
	const clear = () => {
		if (timer != null) {
			clearTimeout(timer);
			timer = void 0;
		}
	};
	const arm = () => {
		clear();
		const timeoutMs = derivedTimeoutMs;
		if (timeoutMs == null || timeoutMs <= 0) return;
		timer = setTimeout(() => {
			options.onIdle?.({
				timeoutMs,
				source: fixedTimeoutMs != null ? "fixed" : "heartbeat"
			});
			try {
				controllerRef?.error(new StreamIdleTimeoutError(timeoutMs));
			} catch {}
		}, timeoutMs);
		timer.unref?.();
	};
	const noteHeartbeat = () => {
		if (fixedTimeoutMs != null) return;
		const now = Date.now();
		if (lastHeartbeatAt != null) {
			const interval = now - lastHeartbeatAt;
			if (interval > 0) {
				const candidate = Math.min(Math.max(interval * factor, minTimeoutMs), maxTimeoutMs);
				derivedTimeoutMs = derivedTimeoutMs == null ? candidate : Math.max(derivedTimeoutMs, candidate);
			}
		}
		lastHeartbeatAt = now;
	};
	return new TransformStream({
		start(controller) {
			controllerRef = controller;
			arm();
		},
		transform(line, controller) {
			if (line.length > 0 && line[0] === SSE_COMMENT_BYTE) noteHeartbeat();
			arm();
			controller.enqueue(line);
		},
		flush() {
			clear();
		}
	});
}
/**
* Stream with automatic retry logic for SSE connections.
* Implements reconnection behavior similar to the Python SDK.
*
* @param makeRequest Function to make requests. When `params` is undefined/empty, it's the initial request.
*                    When `params.reconnectPath` is provided, it's a reconnection request.
* @param options Configuration options
* @returns AsyncGenerator yielding stream events
*/
async function* streamWithRetry(makeRequest, options = {}) {
	const maxRetries = options.maxRetries ?? 5;
	let attempt = 0;
	let lastEventId;
	let reconnectPath;
	while (true) {
		let shouldRetry = false;
		let lastError;
		let reader;
		try {
			if (options.signal?.aborted) return;
			const { response, stream } = await makeRequest(reconnectPath ? {
				lastEventId,
				reconnectPath
			} : void 0);
			const locationHeader = response.headers.get("location");
			if (locationHeader) reconnectPath = locationHeader;
			const contentType = response.headers.get("content-type")?.split(";")[0];
			if (contentType && !contentType.includes("text/event-stream")) throw new Error(`Expected response header Content-Type to contain 'text/event-stream', got '${contentType}'`);
			reader = stream.getReader();
			try {
				while (true) {
					if (options.signal?.aborted) {
						await reader.cancel();
						return;
					}
					const { done, value } = await reader.read();
					if (done) break;
					if (value.id) lastEventId = value.id;
					yield value;
				}
				break;
			} catch (error) {
				if (reconnectPath && !options.signal?.aborted) shouldRetry = true;
				else throw error;
			} finally {
				if (reader) try {
					reader.releaseLock();
				} catch {}
			}
		} catch (error) {
			lastError = error;
			if (isNetworkError(error) && reconnectPath && !options.signal?.aborted) shouldRetry = true;
			else throw error;
		}
		if (shouldRetry) {
			attempt += 1;
			if (attempt > maxRetries) throw new MaxReconnectAttemptsError(maxRetries, lastError);
			options.onReconnect?.({
				attempt,
				lastEventId,
				cause: lastError
			});
			const delay = reconnectDelayMs(attempt);
			await new Promise((resolve) => {
				setTimeout(resolve, delay);
			});
			continue;
		}
		break;
	}
}
var IterableReadableStream = class IterableReadableStream extends ReadableStream {
	reader;
	ensureReader() {
		if (!this.reader) this.reader = this.getReader();
	}
	async next() {
		this.ensureReader();
		try {
			const result = await this.reader.read();
			if (result.done) {
				this.reader.releaseLock();
				return {
					done: true,
					value: void 0
				};
			} else return {
				done: false,
				value: result.value
			};
		} catch (e) {
			this.reader.releaseLock();
			throw e;
		}
	}
	async return() {
		this.ensureReader();
		if (this.locked) {
			const cancelPromise = this.reader.cancel();
			this.reader.releaseLock();
			await cancelPromise;
		}
		return {
			done: true,
			value: void 0
		};
	}
	async throw(e) {
		this.ensureReader();
		if (this.locked) {
			const cancelPromise = this.reader.cancel();
			this.reader.releaseLock();
			await cancelPromise;
		}
		throw e;
	}
	async [Symbol.asyncDispose]() {
		await this.return();
	}
	[Symbol.asyncIterator]() {
		return this;
	}
	static fromReadableStream(stream) {
		const reader = stream.getReader();
		return new IterableReadableStream({
			start(controller) {
				return pump();
				function pump() {
					return reader.read().then(({ done, value }) => {
						if (done) {
							controller.close();
							return;
						}
						controller.enqueue(value);
						return pump();
					});
				}
			},
			cancel() {
				reader.releaseLock();
			}
		});
	}
	static fromAsyncGenerator(generator) {
		return new IterableReadableStream({
			async pull(controller) {
				const { value, done } = await generator.next();
				if (done) controller.close();
				controller.enqueue(value);
			},
			async cancel(reason) {
				await generator.return(reason);
			}
		});
	}
};
//#endregion
//#region node_modules/@langchain/langgraph-sdk/dist/client/base.js
function* iterateHeaders(headers) {
	let iter;
	let shouldClear = false;
	if (headers instanceof Headers) {
		const entries = [];
		headers.forEach((value, name) => {
			entries.push([name, value]);
		});
		iter = entries;
	} else if (Array.isArray(headers)) iter = headers;
	else {
		shouldClear = true;
		iter = Object.entries(headers ?? {});
	}
	for (const item of iter) {
		const name = item[0];
		if (typeof name !== "string") throw new TypeError(`Expected header name to be a string, got ${typeof name}`);
		const values = Array.isArray(item[1]) ? item[1] : [item[1]];
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
function mergeHeaders$1(...headerObjects) {
	const outputHeaders = new Headers();
	for (const headers of headerObjects) {
		if (!headers) continue;
		for (const [name, value] of iterateHeaders(headers)) if (value === null) outputHeaders.delete(name);
		else outputHeaders.append(name, value);
	}
	const headerEntries = [];
	outputHeaders.forEach((value, name) => {
		headerEntries.push([name, value]);
	});
	return Object.fromEntries(headerEntries);
}
/**
* Get the API key from the environment.
* Precedence:
*   1. explicit argument (if string)
*   2. LANGGRAPH_API_KEY
*   3. LANGSMITH_API_KEY
*   4. LANGCHAIN_API_KEY
*
* @param apiKey - API key provided as an argument. If null, skips environment lookup. If undefined, tries environment.
* @returns The API key if found, otherwise undefined
*/
function getApiKey(apiKey) {
	if (apiKey === null) return;
	if (apiKey) return apiKey;
	for (const prefix of [
		"LANGGRAPH",
		"LANGSMITH",
		"LANGCHAIN"
	]) {
		const envKey = getEnvironmentVariable(`${prefix}_API_KEY`);
		if (envKey) return envKey.trim().replace(/^["']|["']$/g, "");
	}
}
var BaseClient = class {
	asyncCaller;
	timeoutMs;
	apiUrl;
	defaultHeaders;
	onRequest;
	streamProtocol;
	constructor(config) {
		const callerOptions = {
			maxRetries: 4,
			maxConcurrency: 4,
			...config?.callerOptions
		};
		let defaultApiUrl = "http://localhost:8123";
		if (!config?.apiUrl && typeof globalThis === "object" && globalThis != null) {
			const fetchSmb = Symbol.for("langgraph_api:fetch");
			const urlSmb = Symbol.for("langgraph_api:url");
			const global = globalThis;
			if (global[fetchSmb]) callerOptions.fetch ??= global[fetchSmb];
			if (global[urlSmb]) defaultApiUrl = global[urlSmb];
		}
		this.asyncCaller = new AsyncCaller(callerOptions);
		this.timeoutMs = config?.timeoutMs;
		this.apiUrl = config?.apiUrl?.replace(/\/$/, "") || defaultApiUrl;
		this.defaultHeaders = config?.defaultHeaders || {};
		this.onRequest = config?.onRequest;
		this.streamProtocol = config?.streamProtocol ?? "legacy";
		const apiKey = getApiKey(config?.apiKey);
		if (apiKey) this.defaultHeaders["x-api-key"] = apiKey;
	}
	prepareFetchOptions(path, options) {
		const mutatedOptions = {
			...options,
			headers: mergeHeaders$1(this.defaultHeaders, options?.headers)
		};
		if (mutatedOptions.json) {
			mutatedOptions.body = JSON.stringify(mutatedOptions.json);
			mutatedOptions.headers = mergeHeaders$1(mutatedOptions.headers, { "content-type": "application/json" });
			delete mutatedOptions.json;
		}
		if (mutatedOptions.withResponse) delete mutatedOptions.withResponse;
		if ("dedupe" in mutatedOptions) delete mutatedOptions.dedupe;
		let timeoutSignal = null;
		if (typeof options?.timeoutMs !== "undefined") {
			if (options.timeoutMs != null) timeoutSignal = AbortSignal.timeout(options.timeoutMs);
		} else if (this.timeoutMs != null) timeoutSignal = AbortSignal.timeout(this.timeoutMs);
		mutatedOptions.signal = mergeSignals(timeoutSignal, mutatedOptions.signal);
		const targetUrl = new URL(`${this.apiUrl}${path}`);
		if (mutatedOptions.params) {
			for (const [key, value] of Object.entries(mutatedOptions.params)) {
				if (value == null) continue;
				const strValue = typeof value === "string" || typeof value === "number" ? value.toString() : JSON.stringify(value);
				targetUrl.searchParams.append(key, strValue);
			}
			delete mutatedOptions.params;
		}
		return [targetUrl, mutatedOptions];
	}
	async fetch(path, options) {
		const [url, init] = this.prepareFetchOptions(path, options);
		if (options?.dedupe === true && options?.withResponse !== true && options?.signal == null && this.onRequest == null) {
			const body = typeof init.body === "string" ? init.body : "";
			/**
			* The key must capture the FULL request identity, including every
			* prepared header. `inFlightReads` is module-scoped across all
			* `Client` instances, so omitting headers would let two clients
			* pointed at the same URL/thread but using different credentials
			* (Authorization, custom auth headers, tenant-scoping defaults, …)
			* share one in-flight promise — a cross-tenant data leak.
			*/
			const headers = serializeHeaders(init.headers);
			const key = `${init.method ?? "GET"} ${url.toString()} ${body} ${headers}`;
			const existing = inFlightReads.get(key);
			if (existing != null) return existing;
			const promise = this.#performFetch(url, init);
			inFlightReads.set(key, promise);
			const clear = () => {
				if (inFlightReads.get(key) === promise) inFlightReads.delete(key);
			};
			promise.then(clear, clear);
			return promise;
		}
		const [body, response] = await this.#performFetchWithResponse(url, init);
		if (options?.withResponse) return [body, response];
		return body;
	}
	/**
	* Issue the prepared request (applying the `onRequest` hook) and
	* resolve the parsed body. Shared by the deduped and direct paths.
	*/
	async #performFetch(url, init) {
		const [body] = await this.#performFetchWithResponse(url, init);
		return body;
	}
	async #performFetchWithResponse(url, init) {
		let finalInit = init;
		if (this.onRequest) finalInit = await this.onRequest(url, init);
		const response = await this.asyncCaller.fetch(url.toString(), finalInit);
		return [await (async () => {
			if (response.status === 202 || response.status === 204) return;
			return response.json();
		})(), response];
	}
	async *streamWithRetry(config) {
		const makeRequest = async (reconnectParams) => {
			const requestEndpoint = reconnectParams?.reconnectPath || config.endpoint;
			const isReconnect = !!reconnectParams?.reconnectPath;
			const method = isReconnect ? "GET" : config.method || "GET";
			const requestHeaders = isReconnect && reconnectParams?.lastEventId ? {
				...config.headers,
				"Last-Event-ID": reconnectParams.lastEventId
			} : config.headers;
			let [url, init] = this.prepareFetchOptions(requestEndpoint, {
				method,
				timeoutMs: null,
				signal: config.signal,
				headers: requestHeaders,
				params: config.params,
				json: isReconnect ? void 0 : config.json
			});
			if (this.onRequest != null) init = await this.onRequest(url, init);
			const response = await this.asyncCaller.fetch(url.toString(), init);
			if (!response.body) throw new Error("Expected response body from stream endpoint");
			if (!isReconnect && config.onInitialResponse) await config.onInitialResponse(response);
			const idleMode = config.idleReconnect ?? "auto";
			const enableIdle = idleMode === "auto" || idleMode > 0;
			const lines = response.body.pipeThrough(BytesLineDecoder());
			return {
				response,
				stream: (enableIdle ? lines.pipeThrough(idleReconnectStream({ mode: idleMode })) : lines).pipeThrough(SSEDecoder())
			};
		};
		yield* streamWithRetry(makeRequest, {
			maxRetries: config.maxRetries ?? 5,
			signal: config.signal,
			onReconnect: config.onReconnect
		});
	}
};
var REGEX_RUN_METADATA = /(\/threads\/(?<thread_id>.+))?\/runs\/(?<run_id>.+)/;
function getRunMetadataFromResponse(response) {
	const contentLocation = response.headers.get("Content-Location");
	if (!contentLocation) return void 0;
	const match = REGEX_RUN_METADATA.exec(contentLocation);
	if (!match?.groups?.run_id) return void 0;
	return {
		run_id: match.groups.run_id,
		thread_id: match.groups.thread_id || void 0
	};
}
/**
* Module-scoped, in-flight-only coalescing map for idempotent reads.
*
* Two independently-constructed clients (e.g. a React component that
* remounts under Suspense / a reachability state flip, each minting a
* fresh `Client`) can fire the *same* `getState` / `getHistory` read a
* few milliseconds apart, before the first has resolved. Without
* coalescing each pays the full round-trip — the duplicate
* `threads/{id}/state` and `threads/{id}/history` requests seen on
* reconnect.
*
* Keyed by `method + url + body + auth`, entries live only while a
* request is in flight and are removed the moment it settles. This is
* deliberately *not* a result cache: there is no TTL and no stored
* payload, so it cannot serve stale data — it only ever shares a
* promise that is already on the wire. Opt-in per call via
* `{ dedupe: true }`, and skipped whenever the caller supplies its own
* `AbortSignal` (so one consumer aborting can never cancel another's
* read).
*/
var inFlightReads = /* @__PURE__ */ new Map();
/**
* Deterministically serialize a prepared request's headers into a
* stable string for use in the {@link inFlightReads} dedupe key. Header
* names are normalized and sorted so ordering differences never produce
* a different key, and every header (not just `x-api-key`) is included
* so requests carrying different credentials never collide.
*/
function serializeHeaders(headers) {
	const normalized = mergeHeaders$1(headers);
	return Object.keys(normalized).sort().map((name) => `${name}:${normalized[name]}`).join("\n");
}
//#endregion
//#region node_modules/@langchain/langgraph-sdk/dist/client/stream/multi-cursor-buffer.js
/**
* Multi-cursor buffer that supports independent async iterators over a
* shared append-only log of items.  Each `for await` loop gets its own
* cursor starting at position 0, so late consumers still see all
* previously buffered items.
*
* Mirrors the in-process multi-cursor buffering used by `GraphRunStream`.
*/
var MultiCursorBuffer = class {
	#items = [];
	#wakeups = /* @__PURE__ */ new Set();
	#closed = false;
	push(item) {
		this.#items.push(item);
		for (const cb of this.#wakeups) cb();
		this.#wakeups.clear();
	}
	close() {
		this.#closed = true;
		for (const cb of this.#wakeups) cb();
		this.#wakeups.clear();
	}
	get length() {
		return this.#items.length;
	}
	[Symbol.asyncIterator]() {
		let cursor = 0;
		return {
			next: async () => {
				while (true) {
					if (cursor < this.#items.length) return {
						done: false,
						value: this.#items[cursor++]
					};
					if (this.#closed) return {
						done: true,
						value: void 0
					};
					await new Promise((resolve) => {
						this.#wakeups.add(resolve);
					});
				}
			},
			return: async () => ({
				done: true,
				value: void 0
			})
		};
	}
};
//#endregion
//#region node_modules/@langchain/langgraph-sdk/dist/client/stream/messages.js
function applyCoreContentDelta(target, delta) {
	if (target.type !== delta.type) return structuredClone(delta);
	switch (delta.type) {
		case "text": return {
			...target,
			...delta,
			text: `${"text" in target ? target.text : ""}${delta.text}`
		};
		case "reasoning": return {
			...target,
			...delta,
			reasoning: `${"reasoning" in target ? target.reasoning : ""}${delta.reasoning}`
		};
		case "tool_call_chunk":
		case "server_tool_call_chunk": {
			const merged = {
				...target,
				...delta
			};
			if (delta.id == null && "id" in target && target.id != null) merged.id = target.id;
			if (delta.name == null && "name" in target && target.name != null) merged.name = target.name;
			merged.args = `${("args" in target ? target.args : "") ?? ""}${delta.args ?? ""}`;
			return merged;
		}
		default: return {
			...target,
			...delta
		};
	}
}
function coreContentBlockFromDelta(delta, current) {
	switch (delta.type) {
		case "text-delta": return {
			type: "text",
			text: delta.text
		};
		case "reasoning-delta": return {
			type: "reasoning",
			reasoning: delta.reasoning
		};
		case "data-delta": {
			const merged = {
				...current ?? {},
				data: delta.data
			};
			if (delta.encoding) merged.encoding = delta.encoding;
			return merged;
		}
		case "block-delta": return delta.fields;
	}
}
function applyCoreEventDelta(current, event) {
	if (event.content) return current ? applyCoreContentDelta(current, event.content) : event.content;
	switch (event.delta.type) {
		case "text-delta":
			if (current?.type === "text") return {
				...current,
				text: `${"text" in current ? current.text : ""}${event.delta.text}`
			};
			return coreContentBlockFromDelta(event.delta, current);
		case "reasoning-delta":
			if (current?.type === "reasoning") return {
				...current,
				reasoning: `${"reasoning" in current ? current.reasoning : ""}${event.delta.reasoning}`
			};
			return coreContentBlockFromDelta(event.delta, current);
		case "data-delta": {
			const merged = { ...current ?? {} };
			merged.data = `${merged.data ?? ""}${event.delta.data}`;
			if (event.delta.encoding) merged.encoding = event.delta.encoding;
			return merged;
		}
		case "block-delta": return {
			...current ?? {},
			...event.delta.fields
		};
	}
}
function normalizeUsage(usage) {
	if (!usage) return void 0;
	return {
		...usage,
		input_tokens: usage.input_tokens ?? 0,
		output_tokens: usage.output_tokens ?? 0,
		total_tokens: usage.total_tokens ?? 0
	};
}
/**
* Symbol keys for assembler → StreamingMessage communication.
* Module-private: invisible to external consumers, accessible to
* {@link StreamingMessageAssembler} within this file.
*/
var PUSH_TEXT = Symbol("pushText");
var PUSH_REASONING = Symbol("pushReasoning");
var PUSH_EVENT = Symbol("pushEvent");
var UPDATE_CONTEXT = Symbol("updateContext");
var FINISH = Symbol("finish");
var ERROR = Symbol("error");
/**
* Live streaming view of a single message lifecycle, matching the
* in-process `ChatModelStream` dual-interface pattern.
*
* - `text` / `reasoning`: iterate for streaming deltas, or await for
*   the full concatenated string after the message completes.
* - `usage`: promise that resolves with token usage on message-finish.
* - `blocks`: the assembled content blocks (updated as deltas arrive).
*
* Created by {@link StreamingMessageAssembler} and yielded by
* the `session.messages` lazy getter.
*/
var StreamingMessage = class {
	id;
	namespace;
	node;
	metadata;
	assembled;
	#events = new MultiCursorBuffer();
	#textChunks = [];
	#reasoningChunks = [];
	#textWaiters = [];
	#reasoningWaiters = [];
	#textDone = false;
	#reasoningDone = false;
	#resolveText;
	#resolveReasoning;
	#textPromise;
	#reasoningPromise;
	constructor(assembled) {
		this.id = assembled.id;
		this.assembled = assembled;
		this.namespace = assembled.namespace;
		this.node = assembled.node;
		this.metadata = assembled.metadata;
		this.#textPromise = new Promise((r) => {
			this.#resolveText = r;
		});
		this.#reasoningPromise = new Promise((r) => {
			this.#resolveReasoning = r;
		});
	}
	get text() {
		const chunks = this.#textChunks;
		const waiters = this.#textWaiters;
		const getDone = () => this.#textDone;
		let cursor = 0;
		return {
			[Symbol.asyncIterator]() {
				return { async next() {
					while (true) {
						if (cursor < chunks.length) return {
							done: false,
							value: chunks[cursor++]
						};
						if (getDone()) return {
							done: true,
							value: void 0
						};
						await new Promise((resolve) => {
							waiters.push(resolve);
						});
					}
				} };
			},
			then: this.#textPromise.then.bind(this.#textPromise),
			full: { async *[Symbol.asyncIterator]() {
				let accumulated = "";
				for await (const chunk of { [Symbol.asyncIterator]: () => ({ next: async () => {
					while (true) {
						if (cursor < chunks.length) return {
							done: false,
							value: chunks[cursor++]
						};
						if (getDone()) return {
							done: true,
							value: void 0
						};
						await new Promise((resolve) => {
							waiters.push(resolve);
						});
					}
				} }) }) {
					accumulated += chunk;
					yield accumulated;
				}
			} }
		};
	}
	get reasoning() {
		const chunks = this.#reasoningChunks;
		const waiters = this.#reasoningWaiters;
		const getDone = () => this.#reasoningDone;
		let cursor = 0;
		return {
			[Symbol.asyncIterator]() {
				return { async next() {
					while (true) {
						if (cursor < chunks.length) return {
							done: false,
							value: chunks[cursor++]
						};
						if (getDone()) return {
							done: true,
							value: void 0
						};
						await new Promise((resolve) => {
							waiters.push(resolve);
						});
					}
				} };
			},
			then: this.#reasoningPromise.then.bind(this.#reasoningPromise),
			full: { async *[Symbol.asyncIterator]() {
				let accumulated = "";
				for await (const chunk of { [Symbol.asyncIterator]: () => ({ next: async () => {
					while (true) {
						if (cursor < chunks.length) return {
							done: false,
							value: chunks[cursor++]
						};
						if (getDone()) return {
							done: true,
							value: void 0
						};
						await new Promise((resolve) => {
							waiters.push(resolve);
						});
					}
				} }) }) {
					accumulated += chunk;
					yield accumulated;
				}
			} }
		};
	}
	get usage() {
		const promise = (async () => {
			let usage;
			for await (const snapshot of this.#usageIterator()) usage = snapshot;
			return usage;
		})();
		return {
			[Symbol.asyncIterator]: () => this.#usageIterator(),
			then: promise.then.bind(promise)
		};
	}
	get toolCalls() {
		const events = this.#events;
		const iterator = async function* () {
			for await (const event of events) if (event.event === "content-block-finish" && event.content.type === "tool_call") yield event.content;
		};
		return {
			[Symbol.asyncIterator]: iterator,
			then: async (onfulfilled, onrejected) => {
				try {
					const calls = [];
					for await (const call of iterator()) calls.push(call);
					return onfulfilled ? onfulfilled(calls) : calls;
				} catch (err) {
					if (onrejected) return onrejected(err);
					throw err;
				}
			},
			full: { async *[Symbol.asyncIterator]() {
				const calls = [];
				for await (const call of iterator()) {
					calls.push(call);
					yield [...calls];
				}
			} }
		};
	}
	get output() {
		return { then: (onf, onr) => this.#assembleMessage().then(onf, onr) };
	}
	get blocks() {
		return this.assembled.blocks;
	}
	[Symbol.asyncIterator]() {
		return this.#events[Symbol.asyncIterator]();
	}
	then(onfulfilled, onrejected) {
		return this.#assembleMessage().then(onfulfilled, onrejected);
	}
	async *#usageIterator() {
		for await (const event of this.#events) if (event.event === "message-start" && event.usage) yield normalizeUsage(event.usage);
		else if (event.event === "message-finish" && event.usage) yield normalizeUsage(event.usage);
	}
	async #assembleMessage() {
		const contentBlocks = [];
		let id;
		let usage;
		let metadata = {};
		let finishReason;
		for await (const event of this.#events) switch (event.event) {
			case "message-start":
				id = event.id ?? id;
				if (event.usage) usage = normalizeUsage(event.usage);
				break;
			case "content-block-start":
				contentBlocks[event.index] = event.content;
				break;
			case "content-block-delta": {
				const current = contentBlocks[event.index];
				contentBlocks[event.index] = applyCoreEventDelta(current, event);
				break;
			}
			case "content-block-finish":
				contentBlocks[event.index] = event.content;
				break;
			case "message-finish":
				finishReason = event.reason;
				if (event.usage) usage = normalizeUsage(event.usage);
				if (event.responseMetadata) metadata = {
					...metadata,
					...event.responseMetadata
				};
				break;
			default: break;
		}
		return new AIMessage({
			id,
			content: contentBlocks.filter((block) => block != null),
			usage_metadata: usage,
			response_metadata: {
				...metadata,
				...finishReason ? { finish_reason: finishReason } : {},
				output_version: "v1"
			}
		});
	}
	[PUSH_EVENT](event) {
		this.#events.push(event);
	}
	[UPDATE_CONTEXT](event) {
		this.node = event.params.node ?? this.node;
	}
	[PUSH_TEXT](delta) {
		this.#textChunks.push(delta);
		const pending = this.#textWaiters.splice(0, this.#textWaiters.length);
		for (const waiter of pending) waiter();
	}
	[PUSH_REASONING](delta) {
		this.#reasoningChunks.push(delta);
		const pending = this.#reasoningWaiters.splice(0, this.#reasoningWaiters.length);
		for (const waiter of pending) waiter();
	}
	[FINISH]() {
		this.#textDone = true;
		this.#reasoningDone = true;
		this.#resolveText(this.#textChunks.join(""));
		this.#resolveReasoning(this.#reasoningChunks.join(""));
		const textPending = this.#textWaiters.splice(0, this.#textWaiters.length);
		for (const waiter of textPending) waiter();
		const reasoningPending = this.#reasoningWaiters.splice(0, this.#reasoningWaiters.length);
		for (const waiter of reasoningPending) waiter();
		this.#events.close();
	}
	[ERROR]() {
		this[FINISH]();
	}
};
function toStreamingMessageHandle(message) {
	return new Proxy(message, {
		get(target, prop) {
			if (prop === "then") return void 0;
			const value = Reflect.get(target, prop, target);
			return typeof value === "function" ? value.bind(target) : value;
		},
		has(target, prop) {
			if (prop === "then") return false;
			return prop in target;
		}
	});
}
function cloneBlock(block) {
	return structuredClone(block);
}
function blockFromDelta(delta, current) {
	return coreContentBlockFromDelta(delta, current);
}
function applyContentDelta(target, delta) {
	if (target.type !== delta.type) return cloneBlock(delta);
	switch (delta.type) {
		case "text": return {
			...target,
			...delta,
			text: `${"text" in target ? target.text : ""}${delta.text}`
		};
		case "reasoning": return {
			...target,
			...delta,
			reasoning: `${"reasoning" in target ? target.reasoning : ""}${delta.reasoning}`
		};
		case "tool_call_chunk":
		case "server_tool_call_chunk": {
			const merged = {
				...target,
				...delta
			};
			if (delta.id == null && "id" in target && target.id != null) merged.id = target.id;
			if (delta.name == null && "name" in target && target.name != null) merged.name = target.name;
			merged.args = `${("args" in target ? target.args : "") ?? ""}${delta.args ?? ""}`;
			return merged;
		}
		default: return {
			...target,
			...delta
		};
	}
}
function messageKeyFor(event) {
	const { namespace, node, data } = event.params;
	const namespaceKey = namespace.join("/");
	const messageId = data.event === "message-start" ? data.id ?? "" : "";
	return `${namespaceKey}::${node ?? ""}::${messageId}`;
}
function toChatModelStreamEvent(event) {
	return event.params.data;
}
/**
* Incrementally assembles `messages` events into complete message objects.
*/
var MessageAssembler = class {
	activeMessages = /* @__PURE__ */ new Map();
	activeByNamespaceNode = /* @__PURE__ */ new Map();
	blockIndexByProtocolIndexAndType = /* @__PURE__ */ new Map();
	/**
	* Applies a single message event and returns the resulting assembly update.
	*
	* @param event - Incoming `messages` event to fold into the assembler state.
	*/
	consume(event) {
		const data = event.params.data;
		const namespaceNodeKey = `${event.params.namespace.join("/")}::${event.params.node ?? ""}`;
		if (data.event === "message-start") {
			const key = messageKeyFor(event);
			this.activeByNamespaceNode.set(namespaceNodeKey, key);
			const message = {
				id: data.id,
				namespace: [...event.params.namespace],
				node: event.params.node,
				metadata: data.metadata,
				blocks: []
			};
			this.activeMessages.set(key, message);
			return {
				kind: "message-start",
				key,
				message,
				event
			};
		}
		const activeKey = this.activeByNamespaceNode.get(namespaceNodeKey);
		if (!activeKey) {
			const syntheticKey = `${namespaceNodeKey}::`;
			this.activeByNamespaceNode.set(namespaceNodeKey, syntheticKey);
			const synthetic = {
				id: data.id,
				namespace: [...event.params.namespace],
				node: event.params.node,
				blocks: []
			};
			this.activeMessages.set(syntheticKey, synthetic);
			return this.consume(event);
		}
		const message = this.activeMessages.get(activeKey);
		if (!message) throw new Error(`No active message state found for key ${activeKey}`);
		if (data.event === "usage") {
			message.usage = data.usage;
			return {
				kind: "usage",
				key: activeKey,
				message,
				event
			};
		}
		switch (data.event) {
			case "content-block-start":
				message.blocks[data.index] = cloneBlock(data.content);
				this.blockIndexByProtocolIndexAndType.set(blockIndexKey(activeKey, data.index, data.content.type), data.index);
				return {
					kind: "content-block-start",
					key: activeKey,
					message,
					index: data.index,
					block: data.content,
					event
				};
			case "content-block-delta": {
				const deltaEvent = data;
				const deltaBlock = deltaEvent.content ?? (deltaEvent.delta != null ? blockFromDelta(deltaEvent.delta, message.blocks[data.index]) : void 0);
				if (deltaBlock == null) throw new Error("Received content-block-delta without content");
				const targetIndex = this.resolveBlockIndex(activeKey, message.blocks, data.index, deltaBlock.type);
				const current = message.blocks[targetIndex];
				message.blocks[targetIndex] = deltaEvent.content != null ? current == null ? cloneBlock(deltaEvent.content) : applyContentDelta(current, deltaEvent.content) : applyCoreEventDelta(current, data);
				return {
					kind: "content-block-delta",
					key: activeKey,
					message,
					index: targetIndex,
					block: deltaBlock,
					event
				};
			}
			case "content-block-finish": {
				const targetIndex = this.resolveFinishBlockIndex(activeKey, data.index, data.content.type);
				message.blocks[targetIndex] = cloneBlock(data.content);
				return {
					kind: "content-block-finish",
					key: activeKey,
					message,
					index: targetIndex,
					block: data.content,
					event
				};
			}
			case "message-finish":
				message.usage = data.usage;
				message.finishMetadata = data.responseMetadata;
				this.activeMessages.delete(activeKey);
				this.activeByNamespaceNode.delete(namespaceNodeKey);
				this.clearBlockIndexAliases(activeKey);
				return {
					kind: "message-finish",
					key: activeKey,
					message: structuredClone(message),
					event
				};
			case "error":
				message.error = {
					message: data.message,
					code: data.code
				};
				this.activeMessages.delete(activeKey);
				this.activeByNamespaceNode.delete(namespaceNodeKey);
				this.clearBlockIndexAliases(activeKey);
				return {
					kind: "message-error",
					key: activeKey,
					message: structuredClone(message),
					event
				};
		}
	}
	resolveBlockIndex(activeKey, blocks, protocolIndex, blockType) {
		const current = blocks[protocolIndex];
		if (current == null || current.type === blockType || areCompatibleBlockTypes(current.type, blockType)) {
			this.blockIndexByProtocolIndexAndType.set(blockIndexKey(activeKey, protocolIndex, blockType), protocolIndex);
			return protocolIndex;
		}
		const key = blockIndexKey(activeKey, protocolIndex, blockType);
		const existing = this.blockIndexByProtocolIndexAndType.get(key);
		if (existing != null) return existing;
		const nextIndex = blocks.length;
		this.blockIndexByProtocolIndexAndType.set(key, nextIndex);
		return nextIndex;
	}
	resolveFinishBlockIndex(activeKey, protocolIndex, blockType) {
		const key = blockIndexKey(activeKey, protocolIndex, blockType);
		const existing = this.blockIndexByProtocolIndexAndType.get(key);
		if (existing != null) return existing;
		this.blockIndexByProtocolIndexAndType.set(key, protocolIndex);
		return protocolIndex;
	}
	clearBlockIndexAliases(activeKey) {
		const prefix = `${activeKey}::`;
		for (const key of this.blockIndexByProtocolIndexAndType.keys()) if (key.startsWith(prefix)) this.blockIndexByProtocolIndexAndType.delete(key);
	}
};
function blockIndexKey(activeKey, protocolIndex, blockType) {
	return `${activeKey}::${protocolIndex}::${blockType}`;
}
function areCompatibleBlockTypes(currentType, nextType) {
	const toolCallTypes = /* @__PURE__ */ new Set([
		"tool_call",
		"tool_call_chunk",
		"tool_use",
		"input_json_delta"
	]);
	const serverToolCallTypes = /* @__PURE__ */ new Set(["server_tool_call", "server_tool_call_chunk"]);
	return toolCallTypes.has(currentType) && toolCallTypes.has(nextType) || serverToolCallTypes.has(currentType) && serverToolCallTypes.has(nextType);
}
/**
* Assembles `messages` events into {@link StreamingMessage} instances
* with live text/reasoning delta streams, matching the in-process
* `ChatModelStream` dual-interface pattern.
*/
var StreamingMessageAssembler = class {
	#assembler = new MessageAssembler();
	#activeStreaming = /* @__PURE__ */ new Map();
	/**
	* Folds a single event and returns a new {@link StreamingMessage}
	* when a `message-start` is seen, or `undefined` for continuation
	* events (deltas, finish, error).
	*/
	consume(event) {
		const update = this.#assembler.consume(event);
		if (update == null) return void 0;
		switch (update.kind) {
			case "message-start": {
				const streaming = new StreamingMessage(update.message);
				streaming[UPDATE_CONTEXT](update.event);
				streaming[PUSH_EVENT](toChatModelStreamEvent(update.event));
				this.#activeStreaming.set(update.key, streaming);
				return streaming;
			}
			case "content-block-start": {
				const streaming = this.#activeStreaming.get(update.key);
				if (streaming) {
					streaming[UPDATE_CONTEXT](update.event);
					streaming[PUSH_EVENT](toChatModelStreamEvent(update.event));
				}
				if (streaming && update.block.type === "text" && "text" in update.block && update.block.text) streaming[PUSH_TEXT](update.block.text);
				if (streaming && update.block.type === "reasoning" && "reasoning" in update.block && update.block.reasoning) streaming[PUSH_REASONING](update.block.reasoning);
				return;
			}
			case "content-block-delta": {
				const streaming = this.#activeStreaming.get(update.key);
				if (!streaming) return void 0;
				streaming[UPDATE_CONTEXT](update.event);
				streaming[PUSH_EVENT](toChatModelStreamEvent(update.event));
				if (update.block.type === "text" && "text" in update.block) streaming[PUSH_TEXT](update.block.text);
				if (update.block.type === "reasoning" && "reasoning" in update.block) streaming[PUSH_REASONING](update.block.reasoning);
				return;
			}
			case "content-block-finish": {
				const streaming = this.#activeStreaming.get(update.key);
				if (streaming) {
					streaming[UPDATE_CONTEXT](update.event);
					streaming[PUSH_EVENT](toChatModelStreamEvent(update.event));
				}
				return;
			}
			case "usage": {
				const streaming = this.#activeStreaming.get(update.key);
				if (streaming) {
					streaming[UPDATE_CONTEXT](update.event);
					streaming[PUSH_EVENT](toChatModelStreamEvent(update.event));
				}
				return;
			}
			case "message-finish": {
				const streaming = this.#activeStreaming.get(update.key);
				if (streaming) {
					streaming[UPDATE_CONTEXT](update.event);
					streaming[PUSH_EVENT](toChatModelStreamEvent(update.event));
					streaming[FINISH]();
					this.#activeStreaming.delete(update.key);
				}
				return;
			}
			case "message-error": {
				const streaming = this.#activeStreaming.get(update.key);
				if (streaming) {
					streaming[UPDATE_CONTEXT](update.event);
					streaming[PUSH_EVENT](toChatModelStreamEvent(update.event));
					streaming[ERROR]();
					this.#activeStreaming.delete(update.key);
				}
				return;
			}
		}
	}
};
//#endregion
//#region node_modules/@langchain/langgraph-sdk/dist/client/stream/media.js
var MEDIA_BLOCK_TYPES = /* @__PURE__ */ new Set([
	"audio",
	"image",
	"video",
	"file"
]);
/**
* Typed error thrown through `media.stream` / rejected from
* `media.blob` / `media.objectURL` when a handle fails before its
* message completes. Carries the bytes accumulated up to the failure
* point on `partialBytes` for callers that want to salvage or diagnose.
*/
var MediaAssemblyError = class extends Error {
	kind;
	messageId;
	partialBytes;
	cause;
	constructor(kind, messageId, partialBytes, message, options) {
		super(message ?? `media ${kind} for message ${messageId}`);
		this.name = "MediaAssemblyError";
		this.kind = kind;
		this.messageId = messageId;
		this.partialBytes = partialBytes;
		this.cause = options?.cause;
	}
};
function base64ToBytes(b64) {
	const binary = atob(b64);
	const bytes = new Uint8Array(binary.length);
	for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
	return bytes;
}
function concatBytes(parts, totalLength) {
	const out = new Uint8Array(totalLength);
	let offset = 0;
	for (const part of parts) {
		out.set(part, offset);
		offset += part.byteLength;
	}
	return out;
}
/**
* Concrete handle implementation shared by all four media types.
*
* One instance per `(messageId, blockType)` pair created by the
* assembler on first matching `content-block-start`.
*/
var MediaHandleImpl = class {
	type;
	messageId;
	namespace;
	node;
	id;
	mimeType;
	url;
	width;
	height;
	filename;
	monotonic = true;
	error;
	#parts = [];
	#totalBytes = 0;
	#partialSnapshot = /* @__PURE__ */ new Uint8Array(0);
	#stream;
	#streamController;
	#blobResolve;
	#blobReject;
	#blobPromise;
	#transcriptParts = [];
	#transcriptResolve;
	#transcriptReject;
	#transcriptPromise;
	#cachedObjectURL;
	#urlSourced = false;
	#urlFetchPromise;
	#lastIndex = -1;
	#finished = false;
	#settled = false;
	#fetchImpl;
	constructor(options) {
		this.type = options.type;
		this.messageId = options.messageId;
		this.namespace = options.namespace;
		this.node = options.node;
		this.id = options.id;
		this.mimeType = options.mimeType;
		this.url = options.url;
		this.#fetchImpl = options.fetch;
		this.#blobPromise = new Promise((resolve, reject) => {
			this.#blobResolve = resolve;
			this.#blobReject = reject;
		});
		this.#blobPromise.catch(() => void 0);
		this.#transcriptPromise = new Promise((resolve, reject) => {
			this.#transcriptResolve = resolve;
			this.#transcriptReject = reject;
		});
		this.#transcriptPromise.catch(() => void 0);
	}
	/** Track a block index for the monotonic-ordering diagnostic. */
	observeIndex(index) {
		if (index !== this.#lastIndex + 1 && index !== this.#lastIndex) this.monotonic = false;
		if (index > this.#lastIndex) this.#lastIndex = index;
	}
	/** Absorb `mime_type` / per-type extras carried on an incoming block. */
	absorbBlock(block) {
		if (this.#urlSourced) return;
		if (block.type === "audio") this.#absorbAudio(block);
		else if (block.type === "image") this.#absorbImage(block);
		else if (block.type === "video") this.#absorbVideo(block);
		else if (block.type === "file") this.#absorbFile(block);
	}
	/** Record that the originating block arrived with `url` not `data`. */
	enterUrlMode(url) {
		this.#urlSourced = true;
		this.url = url;
	}
	/** Push a fresh chunk of bytes into the handle. */
	pushBytes(bytes) {
		if (this.#finished || this.#settled) return;
		if (bytes.byteLength === 0) return;
		this.#parts.push(bytes);
		this.#totalBytes += bytes.byteLength;
		this.#partialSnapshot = concatBytes(this.#parts, this.#totalBytes);
		if (this.#streamController != null) try {
			this.#streamController.enqueue(bytes);
		} catch {}
	}
	/** Append a transcript fragment from an audio block. */
	pushTranscript(fragment) {
		if (this.type !== "audio") return;
		if (this.#finished || this.#settled) return;
		if (fragment.length === 0) return;
		this.#transcriptParts.push(fragment);
	}
	/** Called on `message-finish`. Settles blob/transcript/stream. */
	finish() {
		if (this.#finished || this.#settled) return;
		this.#finished = true;
		this.#settled = true;
		const blob = new Blob([this.#partialSnapshot], { type: this.mimeType ?? "" });
		this.#blobResolve(blob);
		this.#transcriptResolve(this.#transcriptParts.length === 0 ? void 0 : this.#transcriptParts.join(""));
		try {
			this.#streamController?.close();
		} catch {}
	}
	/** Propagate an error through blob/transcript/stream. */
	fail(kind, reason, cause) {
		if (this.#settled) return this.error ?? new MediaAssemblyError(kind, this.messageId, this.#partialSnapshot, reason, { cause });
		this.#settled = true;
		const err = new MediaAssemblyError(kind, this.messageId, this.#partialSnapshot, reason, { cause });
		this.error = err;
		this.#blobReject(err);
		this.#transcriptReject(err);
		try {
			this.#streamController?.error(err);
		} catch {}
		return err;
	}
	get partialBytes() {
		return this.#partialSnapshot;
	}
	get blob() {
		if (this.#urlSourced) return this.#fetchUrlSourced().then((bytes) => new Blob([bytes], { type: this.mimeType ?? "" }));
		return this.#blobPromise;
	}
	get transcript() {
		return this.#transcriptPromise;
	}
	get objectURL() {
		if (this.#cachedObjectURL != null) {
			const cached = this.#cachedObjectURL;
			return Promise.resolve(cached);
		}
		return this.blob.then((blob) => {
			if (this.#cachedObjectURL != null) return this.#cachedObjectURL;
			const url = URL.createObjectURL(blob);
			this.#cachedObjectURL = url;
			return url;
		});
	}
	revoke() {
		const url = this.#cachedObjectURL;
		if (url == null) return;
		this.#cachedObjectURL = void 0;
		try {
			URL.revokeObjectURL(url);
		} catch {}
	}
	get stream() {
		if (this.#stream != null) return this.#stream;
		if (this.#urlSourced) return this.#buildUrlStream();
		return this.#buildInlineStream();
	}
	#absorbAudio(block) {
		const mimeType = block.mime_type ?? block.mimeType;
		if (this.mimeType == null && mimeType != null) this.mimeType = mimeType;
		if (block.transcript != null && block.transcript.length > 0) this.pushTranscript(block.transcript);
	}
	#absorbImage(block) {
		const mimeType = block.mime_type ?? block.mimeType;
		if (this.mimeType == null && mimeType != null) this.mimeType = mimeType;
		if (this.width == null && block.width != null) this.width = block.width;
		if (this.height == null && block.height != null) this.height = block.height;
	}
	#absorbVideo(block) {
		const mimeType = block.mime_type ?? block.mimeType;
		if (this.mimeType == null && mimeType != null) this.mimeType = mimeType;
	}
	#absorbFile(block) {
		const mimeType = block.mime_type ?? block.mimeType;
		if (this.mimeType == null && mimeType != null) this.mimeType = mimeType;
		if (this.filename == null && block.filename != null) this.filename = block.filename;
	}
	#buildInlineStream() {
		const seed = this.#partialSnapshot;
		const alreadyFinished = this.#finished;
		const alreadyErrored = this.error;
		this.#stream = new ReadableStream({
			start: (controller) => {
				this.#streamController = controller;
				if (seed.byteLength > 0) controller.enqueue(seed);
				if (alreadyErrored != null) {
					controller.error(alreadyErrored);
					return;
				}
				if (alreadyFinished) controller.close();
			},
			cancel: () => {
				this.#streamController = void 0;
			}
		});
		return this.#stream;
	}
	#buildUrlStream() {
		const urlSourceFetch = this.#startUrlFetch();
		this.#stream = new ReadableStream({
			start: async (controller) => {
				try {
					const response = await urlSourceFetch;
					if (response.body == null) {
						const bytes = new Uint8Array(await response.arrayBuffer());
						if (bytes.byteLength > 0) controller.enqueue(bytes);
						controller.close();
						return;
					}
					const reader = response.body.getReader();
					while (true) {
						const { done, value } = await reader.read();
						if (done) break;
						if (value != null) controller.enqueue(value);
					}
					controller.close();
				} catch (err) {
					controller.error(this.fail("fetch-failed", err?.message, err));
				}
			},
			cancel: () => {
				this.#streamController = void 0;
			}
		});
		return this.#stream;
	}
	/** Memoised fetch for URL-sourced blocks — returns one `Response`. */
	#startUrlFetch() {
		const url = this.url;
		return this.#fetchImpl(url).then((response) => {
			if (!response.ok) throw new Error(`fetch(${url}) failed: ${response.status} ${response.statusText}`);
			return response;
		});
	}
	/** Fetch + buffer for URL-sourced `blob` access. Memoised. */
	#fetchUrlSourced() {
		if (this.#urlFetchPromise != null) return this.#urlFetchPromise;
		this.#urlFetchPromise = (async () => {
			try {
				const response = await this.#startUrlFetch();
				const bytes = new Uint8Array(await response.arrayBuffer());
				this.#parts.length = 0;
				this.#parts.push(bytes);
				this.#totalBytes = bytes.byteLength;
				this.#partialSnapshot = bytes;
				this.#finished = true;
				this.#settled = true;
				return bytes;
			} catch (err) {
				throw this.fail("fetch-failed", err?.message, err);
			}
		})();
		return this.#urlFetchPromise;
	}
};
var MediaAssembler = class {
	#callbacks;
	#fetch;
	#active = /* @__PURE__ */ new Map();
	#activeByNamespaceNode = /* @__PURE__ */ new Map();
	#syntheticCounter = 0;
	constructor(options = {}) {
		this.#callbacks = options;
		if (options.fetch != null) this.#fetch = options.fetch;
		else if (typeof fetch === "function") this.#fetch = fetch;
		else this.#fetch = () => {
			throw new Error("MediaAssembler: no fetch implementation available. Pass `fetch` in options.");
		};
	}
	/**
	* Fold a single `messages` event. Non-media blocks and
	* informational events (e.g. `content-block-finish`) are no-ops.
	*/
	consume(event) {
		const data = event.params.data;
		const namespace = event.params.namespace;
		const node = event.params.node;
		const nsNodeKey = `${namespace.join("/")}::${node ?? ""}`;
		if (data.event === "message-start") {
			this.#flushSlot(nsNodeKey, "finish");
			this.#activeByNamespaceNode.set(nsNodeKey, {
				messageId: data.id ?? "",
				keys: /* @__PURE__ */ new Set(),
				indexKeys: /* @__PURE__ */ new Map()
			});
			return;
		}
		if (data.event === "message-finish") {
			this.#flushSlot(nsNodeKey, "finish");
			this.#activeByNamespaceNode.delete(nsNodeKey);
			return;
		}
		if (data.event === "error") {
			this.#flushSlot(nsNodeKey, "error", data.message);
			this.#activeByNamespaceNode.delete(nsNodeKey);
			return;
		}
		if (data.event !== "content-block-start" && data.event !== "content-block-delta" && data.event !== "content-block-finish") return;
		const block = data.content;
		const blockIndex = data.index ?? 0;
		let active = this.#activeByNamespaceNode.get(nsNodeKey);
		if (active == null) {
			active = {
				messageId: `__synthetic_${++this.#syntheticCounter}`,
				keys: /* @__PURE__ */ new Set(),
				indexKeys: /* @__PURE__ */ new Map()
			};
			this.#activeByNamespaceNode.set(nsNodeKey, active);
		}
		if (block == null && data.event === "content-block-delta") {
			const delta = data.delta;
			const deltaKey = active.indexKeys.get(blockIndex);
			const deltaHandle = deltaKey != null ? this.#active.get(deltaKey) : void 0;
			if (delta == null || typeof delta !== "object") return;
			const record = delta;
			if (deltaHandle == null) {
				if (record.type !== "block-delta" || record.fields == null || typeof record.fields !== "object") return;
				const fields = record.fields;
				if (!MEDIA_BLOCK_TYPES.has(fields.type)) return;
				this.#consumeMediaBlock({
					active,
					block: fields,
					blockIndex,
					dataEvent: data.event,
					namespace,
					node,
					terminal: false,
					createIfMissing: true
				});
				return;
			}
			deltaHandle.observeIndex(blockIndex);
			if (record.type === "data-delta" && typeof record.data === "string") {
				try {
					deltaHandle.pushBytes(base64ToBytes(record.data));
				} catch (err) {
					deltaHandle.fail("message-error", "invalid base64 on delta", err);
				}
				return;
			}
			if (record.type === "block-delta" && record.fields != null && typeof record.fields === "object") {
				const fields = record.fields;
				deltaHandle.absorbBlock(fields);
				if (!deltaHandle.error && fields.data != null) try {
					deltaHandle.pushBytes(base64ToBytes(fields.data));
				} catch (err) {
					deltaHandle.fail("message-error", "invalid base64 on delta", err);
				}
			}
			return;
		}
		if (block == null) return;
		const blockType = block.type;
		if (!MEDIA_BLOCK_TYPES.has(blockType)) return;
		this.#consumeMediaBlock({
			active,
			block,
			blockIndex,
			dataEvent: data.event,
			namespace,
			node,
			terminal: data.event === "content-block-finish",
			createIfMissing: data.event === "content-block-start" || data.event === "content-block-finish"
		});
	}
	#consumeMediaBlock({ active, block, blockIndex, dataEvent, namespace, node, terminal, createIfMissing }) {
		const blockType = block.type;
		if (!MEDIA_BLOCK_TYPES.has(blockType)) return;
		const mediaType = blockType;
		const key = `${active.messageId}::${mediaType}::${blockIndex}`;
		let handle = this.#active.get(key);
		const isStart = dataEvent === "content-block-start";
		if (handle == null) {
			const isTerminalBlock = terminal;
			if (!isStart && !isTerminalBlock && !createIfMissing) return;
			const mediaBlock = block;
			handle = new MediaHandleImpl({
				type: mediaType,
				messageId: active.messageId,
				namespace: [...namespace],
				node,
				id: mediaBlock.id,
				mimeType: mediaBlock.mime_type ?? mediaBlock.mimeType,
				url: mediaBlock.url != null && mediaBlock.data == null ? mediaBlock.url : void 0,
				fetch: this.#fetch
			});
			if (mediaBlock.url != null && mediaBlock.data == null) handle.enterUrlMode(mediaBlock.url);
			handle.observeIndex(blockIndex);
			handle.absorbBlock(block);
			if (mediaBlock.data != null) try {
				handle.pushBytes(base64ToBytes(mediaBlock.data));
			} catch (err) {
				handle.fail("message-error", "invalid base64 on initial block", err);
			}
			this.#active.set(key, handle);
			active.keys.add(key);
			active.indexKeys.set(blockIndex, key);
			this.#emit(handle);
			if (isTerminalBlock) {
				handle.finish();
				this.#active.delete(key);
				active.keys.delete(key);
				active.indexKeys.delete(blockIndex);
			}
			return;
		}
		if (terminal) return;
		const mediaBlock = block;
		handle.observeIndex(blockIndex);
		handle.absorbBlock(block);
		if (!handle.error && mediaBlock.data != null) try {
			handle.pushBytes(base64ToBytes(mediaBlock.data));
		} catch (err) {
			handle.fail("message-error", "invalid base64 on delta", err);
		}
	}
	/**
	* Finish or fail every media handle currently active under the
	* given `(namespace, node)` slot and clear its bookkeeping. Called
	* on `message-finish`, `error`, and when a new `message-start`
	* rebinds a still-open slot.
	*/
	#flushSlot(nsNodeKey, mode, errorMessage) {
		const active = this.#activeByNamespaceNode.get(nsNodeKey);
		if (active == null) return;
		for (const key of active.keys) {
			const handle = this.#active.get(key);
			if (handle != null) if (mode === "finish") handle.finish();
			else handle.fail("message-error", errorMessage);
			this.#active.delete(key);
		}
		active.keys.clear();
		active.indexKeys.clear();
	}
	/**
	* Abort all outstanding handles with a `stream-closed` error.
	* Called when the upstream event source terminates before the
	* messages it was assembling had a chance to finish.
	*/
	close() {
		for (const handle of this.#active.values()) handle.fail("stream-closed", "upstream event stream closed");
		this.#active.clear();
		this.#activeByNamespaceNode.clear();
	}
	#emit(handle) {
		switch (handle.type) {
			case "audio":
				this.#callbacks.onAudio?.(handle);
				break;
			case "image":
				this.#callbacks.onImage?.(handle);
				break;
			case "video":
				this.#callbacks.onVideo?.(handle);
				break;
			case "file":
				this.#callbacks.onFile?.(handle);
				break;
		}
		this.#callbacks.onMedia?.(handle);
	}
};
//#endregion
//#region node_modules/@langchain/langgraph-sdk/dist/client/stream/error.js
/**
* Error wrapper for protocol-level error responses returned by the server.
*/
var ProtocolError = class extends Error {
	code;
	response;
	constructor(response) {
		super(response.message);
		this.name = "ProtocolError";
		this.code = response.error;
		this.response = response;
	}
};
/**
* Thrown when the v2 WebSocket transport exhausts its automatic reconnect
* budget (`maxReconnectAttempts`) after an unexpected socket close or error.
*
* The transport closes its event queue with this error so consumers of
* `events()` can treat the stream as terminally failed. Set
* `maxReconnectAttempts` to `0` on `client.threads.stream({ transport:
* "websocket" })` to disable reconnect and fail fast on the first drop
* instead.
*/
var MaxWebSocketReconnectAttemptsError = class extends Error {
	/** The configured `maxReconnectAttempts` value that was exceeded. */
	maxAttempts;
	constructor(maxAttempts, cause) {
		super(`Exceeded maximum WebSocket reconnection attempts (${maxAttempts})`);
		this.name = "MaxWebSocketReconnectAttemptsError";
		this.maxAttempts = maxAttempts;
		this.cause = cause;
	}
};
//#endregion
//#region node_modules/@langchain/langgraph-sdk/dist/headless-tools.js
/**
* Parses a headless-tool interrupt `value` from the graph. Accepts both
* `toolCall` (LangChain JS) and `tool_call` (Python / JSON snake_case).
*/
function parseHeadlessToolInterruptPayload(value) {
	if (typeof value !== "object" || value == null) return null;
	const v = value;
	if (v.type !== "tool") return null;
	const rawTc = v.toolCall ?? v.tool_call;
	if (typeof rawTc !== "object" || rawTc == null) return null;
	const tc = rawTc;
	if (typeof tc.name !== "string") return null;
	return {
		type: "tool",
		toolCall: {
			id: typeof tc.id === "string" ? tc.id : void 0,
			name: tc.name,
			args: tc.args
		}
	};
}
function isHeadlessToolInterrupt(interrupt) {
	return parseHeadlessToolInterruptPayload(interrupt) != null;
}
//#endregion
//#region node_modules/@langchain/langgraph-sdk/dist/client/stream/subscription.js
/**
* Strip dynamic suffixes (after `:`) from a namespace segment.
*
* Mirrors `normalize_namespace_segment` in
* `api/langgraph_api/protocol/namespace.py`. Server-emitted namespaces
* contain runtime-generated suffixes like `"fetcher:abc-uuid"`, while
* user-supplied filters are typically static names (`"fetcher"`).
*/
function normalizeSegment(segment) {
	const idx = segment.indexOf(":");
	return idx === -1 ? segment : segment.slice(0, idx);
}
/**
* Whether `eventNamespace` starts with `prefix`.
*
* Segments are compared literally first; if the prefix segment itself
* contains no `:`, the candidate segment is also compared after its
* dynamic suffix is stripped. This mirrors `is_prefix_match` in
* `api/langgraph_api/protocol/namespace.py` so server-side filtering
* and client-side per-subscription narrowing stay consistent.
*/
function isPrefixMatch(eventNamespace, prefix) {
	if (prefix.length > eventNamespace.length) return false;
	for (let i = 0; i < prefix.length; i += 1) {
		const segment = prefix[i];
		const candidate = eventNamespace[i];
		if (candidate === segment) continue;
		if (segment.includes(":")) return false;
		if (normalizeSegment(candidate) === segment) continue;
		return false;
	}
	return true;
}
function namespaceMatches(eventNamespace, prefixes, depth) {
	if (!prefixes || prefixes.length === 0) return true;
	return prefixes.some((prefix) => {
		if (!isPrefixMatch(eventNamespace, prefix)) return false;
		if (depth === void 0) return true;
		return eventNamespace.length - prefix.length <= depth;
	});
}
/**
* Maps a protocol event method to its subscription channel.
*
* Returns `undefined` for unrecognized methods so that new server-side
* channels (e.g. from extension transformers) don't break existing clients.
*
* @param event - Event whose method should be mapped to a channel.
*/
function inferChannel(event) {
	switch (event.method) {
		case "values": return "values";
		case "checkpoints": return "checkpoints";
		case "updates": return "updates";
		case "messages": return "messages";
		case "tools": return "tools";
		case "custom": {
			const data = event.params.data;
			return data?.name != null ? `custom:${data.name}` : "custom";
		}
		case "lifecycle": return "lifecycle";
		case "input.requested": return "input";
		case "tasks": return "tasks";
		default: return;
	}
}
/**
* Returns whether an event should be delivered for a subscription definition.
*
* @param event - Event being checked for delivery.
* @param definition - Subscription filter definition to evaluate against.
*/
function matchesSubscription(event, definition) {
	const channel = inferChannel(event);
	if (channel === void 0) return false;
	const channels = definition.channels;
	if (!(channels.includes(channel) || channel.startsWith("custom:") && channels.includes("custom"))) return false;
	return namespaceMatches(event.params.namespace, definition.namespaces, definition.depth);
}
//#endregion
//#region node_modules/@langchain/langgraph-sdk/dist/stream/message-coercion.js
/**
* Stream-local message coercion for serialized messages returned by
* `getState()`, `getHistory()`, and `values` events.
*
* LangGraph API payloads may carry v1 content blocks as snake_case
* `content_blocks`, while `@langchain/core` message constructors only
* understand camelCase `contentBlocks` (or `content`). Normalize that
* boundary here so stream consumers always see `BaseMessage.text`.
*/
function tryCoerceMessageLikeToMessage(message) {
	const normalized = normalizeAIMessageToolCalls(message);
	if (normalized.type === "human" || normalized.type === "user") return new HumanMessage(normalized);
	if (normalized.type === "ai" || normalized.type === "assistant") return new AIMessage(normalized);
	if (normalized.type === "system") return new SystemMessage(normalized);
	if (normalized.type === "tool" && "tool_call_id" in normalized) return new ToolMessage({
		...normalized,
		tool_call_id: normalized.tool_call_id
	});
	if (normalized.type === "remove" && normalized.id != null) return new RemoveMessage({
		...normalized,
		id: normalized.id
	});
	return coerceMessageLikeToMessage(normalized);
}
function normalizeSerializedContentBlocks(message) {
	const record = message;
	const contentBlocks = record.contentBlocks ?? record.content_blocks;
	if (!Array.isArray(contentBlocks) || contentBlocks.length === 0) return message;
	const shouldPreferContentBlocks = isEmptyContent(record.content) || !hasTextContent(record.content) && hasTextContent(contentBlocks);
	if (!shouldPreferContentBlocks && record.contentBlocks === contentBlocks) return message;
	return {
		...message,
		content: shouldPreferContentBlocks ? contentBlocks : record.content,
		contentBlocks
	};
}
function normalizeAIMessageToolCalls(message) {
	const normalized = normalizeSerializedContentBlocks(message);
	const record = normalized;
	if (Array.isArray(record.tool_calls) && record.tool_calls.length > 0) return normalized;
	const toolCalls = extractToolCallsFromContent(record.content);
	if (toolCalls.length === 0) return normalized;
	return {
		...normalized,
		tool_calls: toolCalls
	};
}
function extractToolCallsFromContent(content) {
	if (!Array.isArray(content)) return [];
	return content.flatMap((block) => {
		if (block == null || typeof block !== "object") return [];
		const record = block;
		if (record.type !== "tool_call" && record.type !== "tool_use") return [];
		return [{
			id: record.id ?? "",
			name: record.name ?? "",
			args: normalizeToolCallArgs(record.args ?? record.input),
			type: "tool_call"
		}];
	});
}
function normalizeToolCallArgs(value) {
	if (value != null && typeof value === "object" && !Array.isArray(value)) return value;
	if (typeof value === "string" && value.length > 0) try {
		const parsed = JSON.parse(value);
		if (parsed != null && typeof parsed === "object" && !Array.isArray(parsed)) return parsed;
	} catch {}
	return {};
}
function isEmptyContent(content) {
	return content == null || content === "" || Array.isArray(content) && content.length === 0;
}
function hasTextContent(content) {
	if (typeof content === "string") return content.length > 0;
	if (!Array.isArray(content)) return false;
	return content.some((block) => {
		if (typeof block === "string") return block.length > 0;
		if (block == null || typeof block !== "object") return false;
		const record = block;
		return record.type === "text" && typeof record.text === "string" && record.text.length > 0;
	});
}
//#endregion
//#region node_modules/@langchain/langgraph-sdk/dist/ui/messages.js
/**
* Ensures all messages in an array are BaseMessage class instances.
* Messages that are already class instances pass through unchanged.
* Plain message objects (e.g. from API values/history) are converted
* via {@link tryCoerceMessageLikeToMessage}.
*/
function ensureMessageInstances(messages) {
	return messages.map((msg) => {
		if (typeof msg.getType === "function") return msg;
		return tryCoerceMessageLikeToMessage(msg);
	});
}
//#endregion
//#region node_modules/@langchain/langgraph-sdk/dist/client/stream/handles/tools.js
/**
* Project a runtime handle to the client SDK surface (promise-only
* {@link output}, no {@link status} / {@link error} fields).
*/
function toClientAssembledToolCall(handle) {
	return {
		name: handle.name,
		callId: handle.callId,
		id: handle.id,
		namespace: handle.namespace,
		input: handle.input,
		args: handle.args,
		output: handle.outputPromise
	};
}
/**
* Parse wire-format tool payloads into structured values.
*
* Tool events may carry JSON-encoded object strings on the wire; this
* helper normalises them to plain objects for consumers. Non-JSON strings
* are returned unchanged.
*/
function parseToolPayload(value) {
	if (typeof value !== "string") return value;
	const trimmed = value.trim();
	if (!trimmed.startsWith("{") && !trimmed.startsWith("[")) return value;
	try {
		return JSON.parse(trimmed);
	} catch {
		return value;
	}
}
/**
* Skip wrapper `task` tool events scoped to a subagent namespace.
*
* Deep-agent subagents are discovered from root-level `task` tool calls;
* replaying the same dispatch tool inside the worker namespace would
* otherwise surface as a spurious entry in `sub.toolCalls`.
*/
function shouldIgnoreScopedTaskToolEvent(scopeNamespace, event) {
	const data = event.params.data;
	return scopeNamespace.length > 0 && event.params.namespace.length === scopeNamespace.length && event.params.namespace.every((segment, index) => segment === scopeNamespace[index]) && "tool_name" in data && data.tool_name === "task";
}
function getWireMessageField(message, field) {
	if (!message || typeof message !== "object" || Array.isArray(message)) return;
	const record = message;
	if (field in record) return record[field];
	const kwargs = record.kwargs;
	if (kwargs != null && field in kwargs) return kwargs[field];
	const lcKwargs = record.lc_kwargs;
	if (lcKwargs != null && field in lcKwargs) return lcKwargs[field];
}
function isToolMessageLike(value) {
	if (!value || typeof value !== "object") return false;
	if (value.type === "tool") return true;
	if (getWireMessageField(value, "type") === "tool") return true;
	return typeof getWireMessageField(value, "tool_call_id") === "string" && getWireMessageField(value, "content") !== void 0;
}
function isCommandLike(value) {
	return !!value && typeof value === "object" && value.lg_name === "Command";
}
function textFromContentBlocks(content) {
	let out = "";
	for (const block of content) {
		if (!block || typeof block !== "object") continue;
		const record = block;
		if (record.type === "text" && typeof record.text === "string") out += record.text;
	}
	return out;
}
/**
* Normalise tool-result `content` from a wire ToolMessage into the value
* a tool implementation returned (object, string, etc.).
*/
function parseToolResultContent(content) {
	if (content == null) return null;
	if (typeof content === "string") {
		if (content.trim().length === 0) return null;
		return parseToolPayload(content);
	}
	if (Array.isArray(content)) {
		const text = textFromContentBlocks(content);
		if (text.length === 0) return null;
		return parseToolPayload(text);
	}
	if (typeof content === "object") return content;
	return null;
}
function parseToolMessageRecord(message) {
	return parseToolResultContent(getWireMessageField(message, "content"));
}
function parseCommandToolOutput(command, toolCallId) {
	const update = command.update;
	if (update == null || typeof update !== "object" || Array.isArray(update)) return { found: false };
	const messages = update.messages;
	if (!Array.isArray(messages)) return { found: false };
	const toolMessages = messages.filter((message) => isToolMessageLike(message));
	if (toolMessages.length === 0) return { found: false };
	if (toolCallId != null) {
		for (const message of toolMessages) {
			if (getWireMessageField(message, "tool_call_id") !== toolCallId) continue;
			return {
				found: true,
				value: parseToolMessageRecord(message)
			};
		}
		return { found: false };
	}
	if (toolMessages.length === 1) return {
		found: true,
		value: parseToolMessageRecord(toolMessages[0])
	};
	for (let i = toolMessages.length - 1; i >= 0; i -= 1) {
		const parsed = parseToolMessageRecord(toolMessages[i]);
		if (parsed != null) return {
			found: true,
			value: parsed
		};
	}
	return {
		found: true,
		value: null
	};
}
/**
* Parse a `tool-finished` output payload into the tool's return value.
*
* Wire events often wrap structured tool results in a ToolMessage-shaped
* object (`{ type: "tool", content: "..." }`) or a LangGraph
* {@link Command} whose `update.messages` carries the ToolMessage.
* This unwraps those envelopes, JSON-decodes string content when possible,
* and leaves plain strings as-is. Returns `null` when a ToolMessage envelope
* is present but its content cannot be normalised.
*/
function parseToolOutput(value, toolCallId) {
	const parsed = parseToolPayload(value);
	if (isCommandLike(parsed)) {
		const commandOutput = parseCommandToolOutput(parsed, toolCallId);
		return commandOutput.found ? commandOutput.value : parsed;
	}
	if (isToolMessageLike(parsed)) return parseToolResultContent(getWireMessageField(parsed, "content"));
	return parsed ?? null;
}
/**
* Incrementally assembles `tools` events into mutable tool-call handles.
*
* Framework consumers store the handle directly; client SDK consumers
* should map with {@link toClientAssembledToolCall} before yielding.
*/
var ToolCallAssembler = class {
	active = /* @__PURE__ */ new Map();
	consume(event) {
		const data = event.params.data;
		if (data.event === "tool-started") return this.handleStarted(event, data);
		if (data.event === "tool-finished") return this.handleFinished(data);
		if (data.event === "tool-error") return this.handleError(data);
	}
	/**
	* Reject any in-flight tool calls (e.g. on session close).
	*/
	failAll(reason) {
		for (const entry of this.active.values()) {
			entry.rejectOutput(reason);
			entry.handle.status = "error";
			entry.handle.error = reason.message;
		}
		this.active.clear();
	}
	handleStarted(event, data) {
		let resolveOutput;
		let rejectOutput;
		const outputPromise = new Promise((resolve, reject) => {
			resolveOutput = resolve;
			rejectOutput = reject;
		});
		outputPromise.catch(() => void 0);
		const input = parseToolPayload(data.input);
		const name = data.tool_name;
		const callId = data.tool_call_id;
		const handle = {
			name,
			callId,
			id: callId,
			namespace: [...event.params.namespace],
			input,
			args: input,
			output: null,
			status: "running",
			error: void 0,
			outputPromise
		};
		this.active.set(callId, {
			handle,
			resolveOutput,
			rejectOutput
		});
		return handle;
	}
	handleFinished(data) {
		const entry = this.active.get(data.tool_call_id);
		if (!entry) return void 0;
		this.active.delete(data.tool_call_id);
		const value = parseToolOutput(data.output, data.tool_call_id);
		entry.resolveOutput(value);
		entry.handle.output = value;
		entry.handle.status = "finished";
		entry.handle.error = void 0;
		return entry.handle;
	}
	handleError(data) {
		const entry = this.active.get(data.tool_call_id);
		if (!entry) return void 0;
		this.active.delete(data.tool_call_id);
		entry.rejectOutput(new Error(data.message));
		entry.handle.output = null;
		entry.handle.status = "error";
		entry.handle.error = data.message;
		return entry.handle;
	}
};
//#endregion
//#region node_modules/@langchain/langgraph-sdk/dist/client/stream/handles/subgraphs.js
/**
* Discovered subgraph within a streaming session.
*
* Mirrors the in-process `SubgraphRunStream` pattern: each subgraph
* has `name`, `index`, `namespace`, and lazy getters for projections
* scoped to this subgraph's namespace.
*
* ```ts
* for await (const sub of session.subgraphs) {
*   for await (const msg of sub.messages) { ... }
*   const state = await sub.output;
* }
* ```
*/
var SubgraphHandle = class {
	name;
	index;
	namespace;
	/**
	* Non-empty when upstream attached a `cause` to this subgraph's
	* `lifecycle.started` event. Population is product-specific and
	* performed by stream transformers on the runtime side (e.g.
	* deepagents' `SubagentTransformer` emits
	* `{ type: "toolCall", tool_call_id }`). Generic clients should
	* treat `cause.type` as an open enum — the protocol allows future
	* variants (`send`, `edge`, ...) to be forwarded verbatim without
	* a SDK bump.
	*/
	cause;
	graphName;
	/**
	* Raw `tool-started` event that triggered this subgraph, when
	* `cause.type === "toolCall"` and the matching event has been
	* observed on the `tools` channel.
	*/
	toolStartedEvent;
	#session;
	#messagesIterable;
	#valuesProjection;
	#toolCallsIterable;
	#subgraphsIterable;
	#subagentsIterable;
	#outputPromise;
	#mediaDispatcherStarted = false;
	#audioBuffer;
	#imagesBuffer;
	#videoBuffer;
	#filesBuffer;
	constructor(name, index, namespace, session, options) {
		this.name = name;
		this.index = index;
		this.namespace = namespace;
		this.cause = options?.cause;
		this.graphName = options?.graphName;
		this.toolStartedEvent = options?.toolStartedEvent;
		this.#session = session;
	}
	get messages() {
		if (this.#messagesIterable) return this.#messagesIterable;
		const buffer = new MultiCursorBuffer();
		this.#messagesIterable = buffer;
		const assembler = new StreamingMessageAssembler();
		this.#startProjection(["messages"], (event) => {
			if (event.method !== "messages") return;
			const msg = assembler.consume(event);
			if (msg) buffer.push(msg);
		}, () => buffer.close());
		return buffer;
	}
	get values() {
		if (this.#valuesProjection) return this.#valuesProjection;
		const buffer = new MultiCursorBuffer();
		let lastValue;
		let resolveOutput;
		const outputPromise = new Promise((resolve) => {
			resolveOutput = resolve;
		});
		this.#outputPromise = outputPromise;
		const projection = Object.assign(buffer, { then: (onfulfilled, onrejected) => outputPromise.then(onfulfilled, onrejected) });
		this.#valuesProjection = projection;
		this.#startProjection(["values"], (event) => {
			if (event.method !== "values") return;
			const data = event.params.data;
			lastValue = data;
			buffer.push(data);
		}, () => {
			resolveOutput(lastValue);
			buffer.close();
		});
		return projection;
	}
	get toolCalls() {
		if (this.#toolCallsIterable) return this.#toolCallsIterable;
		const buffer = new MultiCursorBuffer();
		this.#toolCallsIterable = buffer;
		const assembler = new ToolCallAssembler();
		this.#startProjection(["tools"], (event) => {
			if (event.method !== "tools") return;
			const tc = assembler.consume(event);
			if (tc) buffer.push(toClientAssembledToolCall(tc));
		}, () => buffer.close());
		return buffer;
	}
	get subgraphs() {
		if (this.#subgraphsIterable) return this.#subgraphsIterable;
		const buffer = new MultiCursorBuffer();
		this.#subgraphsIterable = buffer;
		(async () => {
			const discovery = new SubgraphDiscoveryHandle(await this.#session.subscribe({
				channels: ["lifecycle", "tools"],
				namespaces: [this.namespace]
			}), this.#session, this.namespace);
			for await (const sub of discovery) buffer.push(sub);
			buffer.close();
		})();
		return buffer;
	}
	get subagents() {
		if (this.#subagentsIterable) return this.#subagentsIterable;
		const buffer = new MultiCursorBuffer();
		this.#subagentsIterable = buffer;
		(async () => {
			const rawHandle = await this.#session.subscribe({
				channels: ["tools", "lifecycle"],
				namespaces: [this.namespace]
			});
			const { SubagentDiscoveryHandle: Discovery } = await Promise.resolve().then(() => subagents_exports);
			const discovery = new Discovery(rawHandle, this.#session);
			for await (const sub of discovery) buffer.push(sub);
			buffer.close();
		})();
		return buffer;
	}
	get audio() {
		this.#ensureMediaDispatcher();
		return this.#audioBuffer;
	}
	get images() {
		this.#ensureMediaDispatcher();
		return this.#imagesBuffer;
	}
	get video() {
		this.#ensureMediaDispatcher();
		return this.#videoBuffer;
	}
	get files() {
		this.#ensureMediaDispatcher();
		return this.#filesBuffer;
	}
	get output() {
		this.values;
		return this.#outputPromise;
	}
	#ensureMediaDispatcher() {
		if (this.#mediaDispatcherStarted) return;
		this.#mediaDispatcherStarted = true;
		const audio = new MultiCursorBuffer();
		const images = new MultiCursorBuffer();
		const video = new MultiCursorBuffer();
		const files = new MultiCursorBuffer();
		this.#audioBuffer = audio;
		this.#imagesBuffer = images;
		this.#videoBuffer = video;
		this.#filesBuffer = files;
		const assembler = new MediaAssembler({
			onAudio: (m) => audio.push(m),
			onImage: (m) => images.push(m),
			onVideo: (m) => video.push(m),
			onFile: (m) => files.push(m)
		});
		this.#startProjection(["messages"], (event) => {
			if (event.method !== "messages") return;
			assembler.consume(event);
		}, () => {
			assembler.close();
			audio.close();
			images.close();
			video.close();
			files.close();
		});
	}
	subscribe(paramsOrChannels, options = {}) {
		if (typeof paramsOrChannels === "object" && !Array.isArray(paramsOrChannels) && "channels" in paramsOrChannels) return this.#session.subscribe({
			...paramsOrChannels,
			namespaces: paramsOrChannels.namespaces ?? [this.namespace]
		});
		return this.#session.subscribe(paramsOrChannels, {
			...options,
			namespaces: options.namespaces ?? [this.namespace]
		});
	}
	async #startProjection(channels, onEvent, onDone) {
		try {
			const rawHandle = await this.#session.subscribe({
				channels,
				namespaces: [this.namespace]
			});
			for await (const event of rawHandle) onEvent(event);
		} finally {
			onDone();
		}
	}
};
/**
* Async iterable that yields {@link SubgraphHandle} instances as new
* subgraph namespaces are discovered from `lifecycle` events.
*
* Mirrors the in-process `run.subgraphs` pattern. A new subgraph is
* discovered when a `lifecycle` event with `event: "started"` is
* received at a namespace depth of exactly `parentDepth + 1`.
*/
var SubgraphDiscoveryHandle = class {
	#source;
	#session;
	#parentNamespace;
	#discovered = /* @__PURE__ */ new Set();
	#pendingToolStarts = /* @__PURE__ */ new Map();
	#pendingToolCallHandles = /* @__PURE__ */ new Map();
	#queue = [];
	#waiters = [];
	#sourcePump;
	#closed = false;
	constructor(source, session, parentNamespace = []) {
		this.#source = source;
		this.#session = session;
		this.#parentNamespace = parentNamespace;
	}
	#emit(handle) {
		const waiter = this.#waiters.shift();
		if (waiter) waiter({
			done: false,
			value: handle
		});
		else this.#queue.push(handle);
	}
	#processToolEvent(event) {
		if (event.method !== "tools") return false;
		const tools = event;
		const data = tools.params.data;
		if (data.event !== "tool-started") return true;
		const toolCallId = data.tool_call_id;
		if (!toolCallId) return true;
		const pendingHandle = this.#pendingToolCallHandles.get(toolCallId);
		if (pendingHandle) {
			pendingHandle.toolStartedEvent = tools;
			this.#pendingToolCallHandles.delete(toolCallId);
			return true;
		}
		this.#pendingToolStarts.set(toolCallId, tools);
		return true;
	}
	#processEvent(event) {
		if (this.#processToolEvent(event)) return void 0;
		if (event.method !== "lifecycle") return void 0;
		const lifecycle = event;
		if (lifecycle.params.data.event !== "started") return void 0;
		const ns = event.params.namespace;
		if (ns.length !== this.#parentNamespace.length + 1) return void 0;
		if (!this.#parentNamespace.every((seg, i) => ns[i] === seg)) return void 0;
		const nsKey = ns.join("/");
		if (this.#discovered.has(nsKey)) return void 0;
		this.#discovered.add(nsKey);
		const lastSegment = ns[ns.length - 1] ?? "";
		const colonIdx = lastSegment.lastIndexOf(":");
		let name;
		let index;
		if (colonIdx >= 0) {
			name = lastSegment.slice(0, colonIdx);
			const suffix = lastSegment.slice(colonIdx + 1);
			index = /^\d+$/.test(suffix) ? Number(suffix) : 0;
		} else {
			name = lastSegment;
			index = 0;
		}
		const data = lifecycle.params.data;
		const cause = data.cause && typeof data.cause === "object" ? data.cause : void 0;
		let toolStartedEvent;
		if (cause?.type === "toolCall") {
			const toolCallId = cause.tool_call_id;
			if (toolCallId) {
				toolStartedEvent = this.#pendingToolStarts.get(toolCallId);
				this.#pendingToolStarts.delete(toolCallId);
			}
		}
		const handle = new SubgraphHandle(name, index, [...ns], this.#session, {
			cause,
			graphName: data.graph_name,
			toolStartedEvent
		});
		if (cause?.type === "toolCall" && toolStartedEvent == null) {
			const toolCallId = cause.tool_call_id;
			if (toolCallId) this.#pendingToolCallHandles.set(toolCallId, handle);
		}
		return handle;
	}
	#start() {
		if (this.#sourcePump) return;
		this.#sourcePump = (async () => {
			for await (const event of this.#source) {
				const handle = this.#processEvent(event);
				if (!handle) continue;
				this.#emit(handle);
			}
			this.#pendingToolStarts.clear();
			this.#pendingToolCallHandles.clear();
			this.#closed = true;
			while (this.#waiters.length > 0) this.#waiters.shift()?.({
				done: true,
				value: void 0
			});
		})();
	}
	async close() {
		this.#closed = true;
		await this.#source.unsubscribe();
	}
	[Symbol.asyncIterator]() {
		this.#start();
		return {
			next: async () => {
				if (this.#queue.length > 0) return {
					done: false,
					value: this.#queue.shift()
				};
				if (this.#closed) return {
					done: true,
					value: void 0
				};
				return await new Promise((resolve) => {
					this.#waiters.push(resolve);
				});
			},
			return: async () => {
				await this.close();
				return {
					done: true,
					value: void 0
				};
			}
		};
	}
};
//#endregion
//#region node_modules/@langchain/langgraph-sdk/dist/client/stream/handles/subagents.js
var subagents_exports = /* @__PURE__ */ __exportAll({
	SubagentDiscoveryHandle: () => SubagentDiscoveryHandle,
	SubagentHandle: () => SubagentHandle
});
/**
* Discovered subagent within a streaming session. Mirrors the
* in-process `SubagentRunStream` from DeepAgent.
*
* Each subagent is discovered when a `tool-started` event with
* `tool_name === "task"` is observed. The `taskInput` and `output`
* promises resolve from the task tool's lifecycle events.
*
* Use lazy getters (`sub.messages`, `sub.toolCalls`, etc.) for
* namespace-scoped projections.
*/
var SubagentHandle = class {
	name;
	callId;
	taskInput;
	output;
	namespace;
	#session;
	#messagesIterable;
	#toolCallsIterable;
	#subgraphsIterable;
	#mediaDispatcherStarted = false;
	#audioBuffer;
	#imagesBuffer;
	#videoBuffer;
	#filesBuffer;
	constructor(name, callId, namespace, taskInput, output, session) {
		this.name = name;
		this.callId = callId;
		this.namespace = namespace;
		this.taskInput = taskInput;
		this.output = output;
		this.#session = session;
	}
	get messages() {
		if (this.#messagesIterable) return this.#messagesIterable;
		const buffer = new MultiCursorBuffer();
		this.#messagesIterable = buffer;
		const assembler = new StreamingMessageAssembler();
		this.#startProjection(["messages"], (event) => {
			if (event.method !== "messages") return;
			const msg = assembler.consume(event);
			if (msg) buffer.push(msg);
		}, () => buffer.close());
		return buffer;
	}
	get toolCalls() {
		if (this.#toolCallsIterable) return this.#toolCallsIterable;
		const buffer = new MultiCursorBuffer();
		this.#toolCallsIterable = buffer;
		const assembler = new ToolCallAssembler();
		this.#startProjection(["tools"], (event) => {
			if (event.method !== "tools") return;
			const toolsEvent = event;
			if (shouldIgnoreScopedTaskToolEvent(this.namespace, toolsEvent)) return;
			const tc = assembler.consume(toolsEvent);
			if (tc) buffer.push(toClientAssembledToolCall(tc));
		}, () => buffer.close());
		return buffer;
	}
	get audio() {
		this.#ensureMediaDispatcher();
		return this.#audioBuffer;
	}
	get images() {
		this.#ensureMediaDispatcher();
		return this.#imagesBuffer;
	}
	get video() {
		this.#ensureMediaDispatcher();
		return this.#videoBuffer;
	}
	get files() {
		this.#ensureMediaDispatcher();
		return this.#filesBuffer;
	}
	#ensureMediaDispatcher() {
		if (this.#mediaDispatcherStarted) return;
		this.#mediaDispatcherStarted = true;
		const audio = new MultiCursorBuffer();
		const images = new MultiCursorBuffer();
		const video = new MultiCursorBuffer();
		const files = new MultiCursorBuffer();
		this.#audioBuffer = audio;
		this.#imagesBuffer = images;
		this.#videoBuffer = video;
		this.#filesBuffer = files;
		const assembler = new MediaAssembler({
			onAudio: (m) => audio.push(m),
			onImage: (m) => images.push(m),
			onVideo: (m) => video.push(m),
			onFile: (m) => files.push(m)
		});
		this.#startProjection(["messages"], (event) => {
			if (event.method !== "messages") return;
			assembler.consume(event);
		}, () => {
			assembler.close();
			audio.close();
			images.close();
			video.close();
			files.close();
		});
	}
	get subgraphs() {
		if (this.#subgraphsIterable) return this.#subgraphsIterable;
		const buffer = new MultiCursorBuffer();
		this.#subgraphsIterable = buffer;
		(async () => {
			const discovery = new SubgraphDiscoveryHandle(await this.#session.subscribe({
				channels: ["lifecycle"],
				namespaces: [this.namespace]
			}), this.#session, this.namespace);
			for await (const sub of discovery) buffer.push(sub);
			buffer.close();
		})();
		return buffer;
	}
	subscribe(paramsOrChannels, options = {}) {
		if (typeof paramsOrChannels === "object" && !Array.isArray(paramsOrChannels) && "channels" in paramsOrChannels) return this.#session.subscribe({
			...paramsOrChannels,
			namespaces: paramsOrChannels.namespaces ?? [this.namespace]
		});
		return this.#session.subscribe(paramsOrChannels, {
			...options,
			namespaces: options.namespaces ?? [this.namespace]
		});
	}
	async #startProjection(channels, onEvent, onDone) {
		try {
			const rawHandle = await this.#session.subscribe({
				channels,
				namespaces: [this.namespace]
			});
			for await (const event of rawHandle) onEvent(event);
		} finally {
			onDone();
		}
	}
};
/**
* Async iterable that yields {@link SubagentHandle} instances as task
* tool calls are discovered from the `tools` channel.
*
* Mirrors the in-process `createSubagentTransformer` from DeepAgent:
* watches for `tool_name === "task"` with `tool-started`, extracts
* `subagent_type` and `description` from the input, and resolves
* `output` on `tool-finished`.
*/
var SubagentDiscoveryHandle = class {
	#source;
	#session;
	#queue = [];
	#waiters = [];
	#pending = /* @__PURE__ */ new Map();
	#sourcePump;
	#closed = false;
	constructor(source, session) {
		this.#source = source;
		this.#session = session;
	}
	#processEvent(event) {
		if (event.method !== "tools") return void 0;
		const tools = event;
		const data = tools.params.data;
		const toolCallId = data.tool_call_id;
		if (data.tool_name === "task" && data.event === "tool-started") {
			const rawInput = data.input;
			const input = typeof rawInput === "string" ? JSON.parse(rawInput) : rawInput ?? {};
			const name = input.subagent_type ?? "unknown";
			const description = input.description ?? "";
			let resolveTaskInput;
			let resolveOutput;
			let rejectOutput;
			const taskInput = new Promise((r) => {
				resolveTaskInput = r;
			});
			const output = new Promise((res, rej) => {
				resolveOutput = res;
				rejectOutput = rej;
			});
			resolveTaskInput(description);
			this.#pending.set(toolCallId, {
				resolveOutput,
				rejectOutput
			});
			return new SubagentHandle(name, toolCallId, [...tools.params.namespace], taskInput, output, this.#session);
		}
		if (toolCallId) {
			const pending = this.#pending.get(toolCallId);
			if (pending) {
				if (data.event === "tool-finished") {
					pending.resolveOutput(data.output);
					this.#pending.delete(toolCallId);
				} else if (data.event === "tool-error") {
					const message = data.message ?? "unknown error";
					pending.rejectOutput(new Error(message));
					this.#pending.delete(toolCallId);
				}
			}
		}
	}
	#start() {
		if (this.#sourcePump) return;
		this.#sourcePump = (async () => {
			for await (const event of this.#source) {
				const handle = this.#processEvent(event);
				if (!handle) continue;
				const waiter = this.#waiters.shift();
				if (waiter) waiter({
					done: false,
					value: handle
				});
				else this.#queue.push(handle);
			}
			this.#closed = true;
			for (const pending of this.#pending.values()) pending.resolveOutput(void 0);
			this.#pending.clear();
			while (this.#waiters.length > 0) this.#waiters.shift()?.({
				done: true,
				value: void 0
			});
		})();
	}
	async close() {
		this.#closed = true;
		await this.#source.unsubscribe();
	}
	[Symbol.asyncIterator]() {
		this.#start();
		return {
			next: async () => {
				if (this.#queue.length > 0) return {
					done: false,
					value: this.#queue.shift()
				};
				if (this.#closed) return {
					done: true,
					value: void 0
				};
				return await new Promise((resolve) => {
					this.#waiters.push(resolve);
				});
			},
			return: async () => {
				await this.close();
				return {
					done: true,
					value: void 0
				};
			}
		};
	}
};
//#endregion
//#region node_modules/@langchain/langgraph-sdk/dist/client/stream/index.js
var MESSAGE_LIKE_TYPES = /* @__PURE__ */ new Set([
	"human",
	"user",
	"ai",
	"assistant",
	"tool",
	"system",
	"function",
	"remove"
]);
/**
* When the state payload has a `messages` array containing plain
* serialized messages (objects with a recognized `type` field), coerce
* them into `@langchain/core/messages` class instances so remote runs
* expose the same shape as in-process runs.
*
* Returns the input unchanged when the payload is not an object, does
* not include a `messages` key, or contains entries that are already
* class instances / not message-like.
*/
function coerceStateMessages(value) {
	if (value == null || typeof value !== "object" || Array.isArray(value)) return value;
	const state = value;
	const messages = state.messages;
	if (!Array.isArray(messages) || messages.length === 0) return value;
	if (!messages.some((msg) => {
		if (msg == null || typeof msg !== "object") return false;
		if (typeof msg.getType === "function") return false;
		const type = msg.type;
		return typeof type === "string" && MESSAGE_LIKE_TYPES.has(type);
	})) return value;
	return {
		...state,
		messages: ensureMessageInstances(messages)
	};
}
function namespaceKey(ns) {
	return ns.join("\0");
}
function maxSeq(current, next) {
	if (next == null) return current;
	if (current == null) return next;
	return Math.max(current, next);
}
var ROOT_TERMINAL_LIFECYCLE_EVENTS = /* @__PURE__ */ new Set([
	"completed",
	"failed",
	"interrupted"
]);
/**
* Detect a root-namespace terminal lifecycle event. Used by
* `#startProjection`'s `endOnRootTerminal` guard to settle per-run
* dispatchers regardless of whether the shared-stream pause logic
* applies to their underlying subscription.
*/
function isRootTerminalLifecycle(event) {
	if (event.method !== "lifecycle") return false;
	if (event.params.namespace.length !== 0) return false;
	const data = event.params.data;
	return data?.event != null && ROOT_TERMINAL_LIFECYCLE_EVENTS.has(data.event);
}
function namespaceListsEqual(a, b) {
	if (a === b) return true;
	if (a === void 0 || b === void 0) return false;
	if (a.length !== b.length) return false;
	const aKeys = /* @__PURE__ */ new Set();
	for (const ns of a) aKeys.add(namespaceKey(ns));
	for (const ns of b) if (!aKeys.has(namespaceKey(ns))) return false;
	return true;
}
/**
* Structural equality on filters. Two filters are equal iff they
* request the same channel set, the same namespace prefix set
* (with `undefined` meaning wildcard), and the same depth
* (with `undefined` meaning unbounded).
*/
function filterEqual(a, b) {
	if (a === b) return true;
	if (a == null || b == null) return false;
	if (a.channels.length !== b.channels.length) return false;
	const aChannels = new Set(a.channels);
	for (const ch of b.channels) if (!aChannels.has(ch)) return false;
	if (!namespaceListsEqual(a.namespaces, b.namespaces)) return false;
	if ((a.depth ?? null) !== (b.depth ?? null)) return false;
	return true;
}
function isPrefix(prefix, candidate) {
	if (prefix.length > candidate.length) return false;
	for (let i = 0; i < prefix.length; i += 1) if (prefix[i] !== candidate[i]) return false;
	return true;
}
/**
* Whether the `coverer` filter delivers every event a subscription
* opened with `target` could want.
*
* Rules:
*  - Channels: target.channels must be a subset of coverer.channels.
*  - Namespaces:
*    - coverer wildcard (`undefined`) → coverer covers all prefixes.
*    - coverer explicit + target wildcard → not covered.
*    - both explicit → every target prefix must have some coverer
*      prefix that is its ancestor (coverer's prefix delivers events
*      for all descendants, modulo depth).
*  - Depth:
*    - coverer unbounded (`undefined`) → depth is covered.
*    - otherwise, for each target prefix `tp` covered by coverer
*      prefix `cp`, the maximum event depth target wants
*      (`tp.length + (target.depth ?? ∞) - cp.length`) must be
*      `<= coverer.depth`. For a wildcard target with bounded depth,
*      target's max absolute depth is `target.depth` (prefix is `[]`).
*/
function filterCovers(coverer, target) {
	const covererChannels = new Set(coverer.channels);
	for (const ch of target.channels) if (!covererChannels.has(ch)) return false;
	const covererDepth = coverer.depth;
	const targetDepth = target.depth;
	if (coverer.namespaces == null) {
		if (covererDepth == null) return true;
		if (targetDepth == null) return false;
		return targetDepth <= covererDepth;
	}
	if (target.namespaces == null) return false;
	for (const tp of target.namespaces) if (!coverer.namespaces.some((cp) => {
		if (!isPrefix(cp, tp)) return false;
		if (covererDepth == null) return true;
		if (targetDepth == null) return false;
		return tp.length - cp.length + targetDepth <= covererDepth;
	})) return false;
	return true;
}
function normalizeSubscribeParams(paramsOrChannels, options = {}) {
	if (typeof paramsOrChannels === "object" && !Array.isArray(paramsOrChannels) && "channels" in paramsOrChannels) return paramsOrChannels;
	const channels = Array.isArray(paramsOrChannels) ? [...paramsOrChannels] : [paramsOrChannels];
	return {
		...options,
		channels
	};
}
/**
* Fold the ergonomic top-level `forkFrom` checkpoint id into
* `config.configurable.checkpoint_id` and strip `forkFrom` from the
* outgoing params.
*
* `forkFrom` is purely an SDK-side convenience: callers say
* `submit(input, { forkFrom })` instead of hand-building a nested
* RunnableConfig. The agent server only ever accepts the fork target via
* `config.configurable.checkpoint_id` (the same field the legacy run
* endpoints use), so we translate here — before the `run.start` message
* hits the wire — keeping a single, legacy-compliant way to provide it.
*
* `forkFrom` takes precedence over any `checkpoint_id` the caller already
* placed in `config.configurable`, matching the prior server-side merge.
*/
function foldForkFromIntoConfig(params) {
	const { forkFrom, ...rest } = params;
	if (typeof forkFrom !== "string" || forkFrom.length === 0) return rest;
	const config = rest.config != null && typeof rest.config === "object" ? rest.config : {};
	const configurable = config.configurable != null && typeof config.configurable === "object" ? config.configurable : {};
	return {
		...rest,
		config: {
			...config,
			configurable: {
				...configurable,
				checkpoint_id: forkFrom
			}
		}
	};
}
/**
* Async iterable handle for raw event subscriptions.
*
* An optional `transform` maps each incoming event before it is queued
* or delivered to a waiting consumer. This is used by named custom
* channel subscriptions (e.g. `"custom:a2a"`) to unwrap the payload
* so callers receive the raw emitted data instead of the protocol
* event envelope.
*/
var SubscriptionHandle = class {
	subscriptionId;
	params;
	queue = [];
	waiters = [];
	closed = false;
	paused = false;
	resumeResolve;
	onUnsubscribe;
	transform;
	constructor(subscriptionId, params, onUnsubscribe, transform) {
		this.subscriptionId = subscriptionId;
		this.params = params;
		this.onUnsubscribe = onUnsubscribe;
		this.transform = transform ?? ((event) => event);
	}
	push(event) {
		if (this.closed) return;
		const value = this.transform(event);
		const waiter = this.waiters.shift();
		if (waiter) {
			waiter({
				done: false,
				value
			});
			return;
		}
		this.queue.push(value);
	}
	/**
	* Pause the subscription: resolve all waiting iterators with `done: true`
	* so `for await` loops exit, but keep the subscription alive. New events
	* arriving while paused are still buffered. Call `resume()` to allow
	* iterators to consume again.
	*/
	pause() {
		if (this.closed) return;
		this.paused = true;
		while (this.waiters.length > 0) this.waiters.shift()?.({
			done: true,
			value: void 0
		});
	}
	/**
	* Resume a paused subscription so new `for await` loops can consume
	* buffered and future events.
	*/
	resume() {
		this.paused = false;
		this.resumeResolve?.();
		this.resumeResolve = void 0;
	}
	/**
	* Returns a promise that resolves when `resume()` is called. Resolves
	* immediately if not currently paused.
	*/
	waitForResume() {
		if (!this.paused) return Promise.resolve();
		return new Promise((resolve) => {
			this.resumeResolve = resolve;
		});
	}
	get isPaused() {
		return this.paused;
	}
	close() {
		this.closed = true;
		this.paused = false;
		while (this.waiters.length > 0) this.waiters.shift()?.({
			done: true,
			value: void 0
		});
		this.resumeResolve?.();
		this.resumeResolve = void 0;
	}
	async unsubscribe() {
		if (this.closed) return;
		this.close();
		await this.onUnsubscribe(this.subscriptionId);
	}
	[Symbol.asyncIterator]() {
		return {
			next: async () => {
				if (this.queue.length > 0) return {
					done: false,
					value: this.queue.shift()
				};
				if (this.closed || this.paused) return {
					done: true,
					value: void 0
				};
				return await new Promise((resolve) => {
					this.waiters.push(resolve);
				});
			},
			return: async () => {
				this.close();
				return {
					done: true,
					value: void 0
				};
			}
		};
	}
};
/**
* High-level wrapper around a protocol connection to a specific thread.
*
* In the thread-centric protocol, threads are durable (backed by
* checkpoints) and connections are ephemeral. A `ThreadStream` is the
* client-side handle for interacting with a thread: starting runs,
* subscribing to events, consuming assembled projections (`messages`,
* `values`, `toolCalls`, etc.), and responding to interrupts.
*
* Construct via `client.threads.stream(threadId?, { assistantId? })`.
*
* @typeParam TExtensions - Optional map of `{ name: payload }` pairs
*   describing the transformer projections the bound assistant exposes
*   on `custom:<name>` channels. Narrows `thread.extensions.<name>` to
*   `ThreadExtension<payload>`. Defaults to `Record<string, unknown>`.
*/
var ThreadStream = class {
	threadId;
	ordering = {};
	run;
	agent;
	input;
	state;
	/**
	* Whether the run was interrupted (a lifecycle "interrupted" event
	* was received). Mirrors the in-process `run.interrupted`.
	*/
	interrupted = false;
	/**
	* Interrupt payloads collected during the run, if any.
	* Mirrors the in-process `run.interrupts`.
	*/
	interrupts = [];
	assistantId;
	#nextCommandId;
	#transportAdapter;
	#pending = /* @__PURE__ */ new Map();
	#subscriptions = /* @__PURE__ */ new Map();
	#seenEventIds = /* @__PURE__ */ new Set();
	/**
	* Headless tool interrupts can be auto-resumed by the React hook before
	* the shared SSE content pump has processed the root `interrupted`
	* lifecycle event. `respondInput()` clears `interrupts`, so keep a
	* short-lived marker here until that stale terminal passes through the
	* content pump and we can avoid pausing it.
	*/
	#headlessInterruptsAwaitingTerminal = /* @__PURE__ */ new Set();
	#closed = false;
	#opened = false;
	#openPromise;
	#sharedStream = null;
	#sharedStreamFilter = null;
	#rotationState = "idle";
	/** Pending `subscribe()` promises waiting for a covering rotation. */
	#pendingSubResolves = [];
	#terminalPauseTimer;
	#terminalPauseSeq;
	#lifecycleSubId = null;
	#lifecycleStartPromise;
	#runStartReady = null;
	#lifecycleWatcherHandle = null;
	#lifecycleWatcherStartPromise;
	#onEventListeners = /* @__PURE__ */ new Set();
	#messagesIterable;
	#valuesProjection;
	#toolCallsIterable;
	#subgraphsIterable;
	#subagentsIterable;
	#outputPromise;
	#extensionsProxy;
	#extensionsCache = /* @__PURE__ */ new Map();
	/**
	* Shared state for the single `"custom"` channel subscription that
	* backs every `thread.extensions.<name>` handle.
	*
	* One subscription is opened eagerly from {@link run.start} (mirroring
	* the {@link values} eager-start pattern) so that per-name handles
	* created before, during, or after the run can all resolve correctly.
	*
	*  - `events` retains every custom event for backfill into
	*    late-constructed handles.
	*  - `eventListeners` fan new events out to live per-name handlers.
	*  - `endListeners` fire when the dispatcher's run terminates, so each
	*    handle can resolve its `PromiseLike` side with its last-seen
	*    payload.
	*/
	#extensionsDispatcherStarted = false;
	#extensionsEnded = false;
	#extensionsEvents = [];
	#extensionsEventListeners = [];
	#extensionsEndListeners = [];
	/**
	* Shared state for the single `messages`-channel subscription that
	* backs every media handle iterable (`thread.audio`, `thread.images`,
	* `thread.video`, `thread.files`). One subscription serves all four
	* iterables; per-type buffers track the handles already emitted so
	* late attachers replay through {@link MultiCursorBuffer}.
	*/
	#mediaDispatcherStarted = false;
	#mediaAssembler;
	/** Object URLs minted by media handles, tracked for {@link close} cleanup. */
	#mediaHandles = /* @__PURE__ */ new Set();
	#audioBuffer = new MultiCursorBuffer();
	#imagesBuffer = new MultiCursorBuffer();
	#videoBuffer = new MultiCursorBuffer();
	#filesBuffer = new MultiCursorBuffer();
	#fetchOption;
	constructor(transportAdapter, options) {
		if (!options?.assistantId) throw new Error("ThreadStream requires an assistantId option.");
		this.#transportAdapter = transportAdapter;
		this.threadId = transportAdapter.threadId;
		this.assistantId = options.assistantId;
		this.#nextCommandId = options.startingCommandId ?? 1;
		this.#fetchOption = options.fetch;
		this.run = { start: async (params) => {
			this.#prepareForNextRun();
			return await this.#withRunStartGate(() => {
				this.#ensureLifecycleTracking();
				this.values;
				return this.#send("run.start", {
					...foldForkFromIntoConfig(params),
					assistant_id: this.assistantId
				});
			});
		} };
		this.agent = { getTree: async (params = {}) => await this.#send("agent.getTree", params) };
		this.input = {
			respond: async (params) => {
				this.#prepareForNextRun();
				this.#ensureLifecycleTracking();
				this.values;
				await this.#send("input.respond", params);
			},
			inject: async (params) => {
				await this.#send("input.inject", params);
			}
		};
		this.state = {
			get: async (params) => await this.#send("state.get", params),
			listCheckpoints: async (params) => await this.#send("state.listCheckpoints", params),
			fork: async (params) => await this.#send("state.fork", params)
		};
		if (this.#transportAdapter.openEventStream == null) {
			this.#transportAdapter.setOnReconnected?.(() => this.#resubscribeWebSocketSubscriptions());
			this.#consumeEvents();
		}
	}
	/**
	* Ensure the underlying transport is connected.
	*
	* For HTTP/SSE this is a no-op. For WebSocket this performs the
	* handshake. Called lazily on first command; safe to call multiple times.
	*/
	async #ensureOpen() {
		if (this.#opened) return;
		if (this.#openPromise == null) this.#openPromise = this.#transportAdapter.open().then(() => {
			this.#opened = true;
		});
		await this.#openPromise;
	}
	/**
	* Channels bundled into every lazy getter's SSE filter so that
	* interrupt tracking works without a separate lifecycle subscription.
	*/
	#lifecycleChannels() {
		return ["lifecycle", "input"];
	}
	/**
	* Lazily start a dedicated lifecycle+input subscription so that
	* `thread.interrupted` / `thread.interrupts` work even when the
	* caller never accesses a lazy getter (e.g. they only call
	* `run.start` and `subscribe({ channels: ["custom:..."] })`).
	*
	* Idempotent and fire-and-forget — invoked from `run.start` and
	* `input.respond`.
	*/
	#ensureLifecycleTracking() {
		if (this.#lifecycleStartPromise != null) return;
		this.#lifecycleStartPromise = (async () => {
			this.#lifecycleSubId = (await this.#subscribeRaw({ channels: this.#lifecycleChannels() })).subscriptionId;
		})().catch(() => void 0);
	}
	/**
	* Run `operation` (a `run.start` send) while holding the run-start
	* gate. Sets `#runStartReady` before invoking `operation` so any
	* subscription kicked off synchronously inside it (e.g. the lifecycle
	* watcher and the values projection) sees the gate when it eventually
	* reaches `#startLifecycleWatcherSse` / `#reconcileStream` /
	* `#subscribeViaCommand` and awaits it. The gate resolves the moment
	* `operation` settles, so server-side subscribes land immediately
	* after the thread is committed.
	*/
	async #withRunStartGate(operation) {
		let resolveGate;
		let rejectGate;
		const gate = new Promise((resolve, reject) => {
			resolveGate = resolve;
			rejectGate = reject;
		});
		this.#runStartReady = gate;
		gate.catch(() => void 0);
		try {
			const result = await operation();
			resolveGate();
			return result;
		} catch (err) {
			rejectGate(err);
			throw err;
		} finally {
			if (this.#runStartReady === gate) this.#runStartReady = null;
		}
	}
	/**
	* Reset interrupt state and resume all paused user subscriptions.
	* Called before `run.start()` and `input.respond()` so that
	* iterators on the same handle pick up the next run's events.
	*
	* @param respondedInterruptId - When responding to one of several
	*   pending interrupts, only that entry is removed. Clearing the
	*   full list here would drop other headless-tool interrupts that
	*   are still awaiting client execution.
	*/
	#prepareForNextRun(respondedInterruptId) {
		this.interrupted = false;
		if (respondedInterruptId != null) {
			const respondedIds = new Set(Array.isArray(respondedInterruptId) ? respondedInterruptId : [respondedInterruptId]);
			for (let index = this.interrupts.length - 1; index >= 0; index -= 1) if (respondedIds.has(this.interrupts[index].interruptId)) this.interrupts.splice(index, 1);
		} else this.interrupts.length = 0;
		if (this.#terminalPauseTimer != null) {
			clearTimeout(this.#terminalPauseTimer);
			this.#terminalPauseTimer = void 0;
		}
		this.#terminalPauseSeq = void 0;
		for (const [id, subscription] of this.#subscriptions) if (id !== this.#lifecycleSubId) subscription.resume();
	}
	/**
	* Streaming messages. Each `for await` loop gets an independent cursor
	* over the shared buffer; late consumers see all previously emitted
	* messages.  Mirrors the in-process `run.messages`.
	*/
	get messages() {
		if (this.#messagesIterable) return this.#messagesIterable;
		const buffer = new MultiCursorBuffer();
		this.#messagesIterable = buffer;
		const assembler = new StreamingMessageAssembler();
		this.#startProjection(["messages", ...this.#lifecycleChannels()], (event) => {
			if (event.method !== "messages") return;
			const msg = assembler.consume(event);
			if (msg) buffer.push(toStreamingMessageHandle(msg));
		}, () => buffer.close());
		return buffer;
	}
	/**
	* State values. Iterable for intermediate snapshots; also
	* `PromiseLike` — `await thread.values` resolves with the final
	* state.  Mirrors the in-process `run.values`.
	*/
	get values() {
		if (this.#valuesProjection) return this.#valuesProjection;
		const buffer = new MultiCursorBuffer();
		let lastValue;
		let resolveOutput;
		const outputPromise = new Promise((resolve) => {
			resolveOutput = resolve;
		});
		this.#outputPromise = outputPromise;
		const projection = Object.assign(buffer, { then: (onfulfilled, onrejected) => outputPromise.then(onfulfilled, onrejected) });
		this.#valuesProjection = projection;
		this.#startProjection(["values", ...this.#lifecycleChannels()], (event) => {
			if (event.method !== "values") return;
			const data = coerceStateMessages(event.params.data);
			lastValue = data;
			buffer.push(data);
		}, () => {
			resolveOutput(lastValue);
			buffer.close();
		});
		return projection;
	}
	/**
	* Tool calls with a promise-based {@link output} for script consumers.
	* Mirrors the in-process `run.toolCalls`.
	*/
	get toolCalls() {
		if (this.#toolCallsIterable) return this.#toolCallsIterable;
		const buffer = new MultiCursorBuffer();
		this.#toolCallsIterable = buffer;
		const assembler = new ToolCallAssembler();
		this.#startProjection(["tools", ...this.#lifecycleChannels()], (event) => {
			if (event.method !== "tools") return;
			const tc = assembler.consume(event);
			if (tc) buffer.push(toClientAssembledToolCall(tc));
		}, () => buffer.close());
		return buffer;
	}
	/**
	* Discovered subgraphs. Mirrors the in-process `run.subgraphs`.
	*/
	get subgraphs() {
		if (this.#subgraphsIterable) return this.#subgraphsIterable;
		const buffer = new MultiCursorBuffer();
		this.#subgraphsIterable = buffer;
		(async () => {
			const discovery = new SubgraphDiscoveryHandle(await this.#subscribeRaw({ channels: ["tools", ...this.#lifecycleChannels()] }), this, []);
			for await (const sub of discovery) buffer.push(sub);
			buffer.close();
		})();
		return buffer;
	}
	/**
	* Discovered subagents.
	*/
	get subagents() {
		if (this.#subagentsIterable) return this.#subagentsIterable;
		const buffer = new MultiCursorBuffer();
		this.#subagentsIterable = buffer;
		(async () => {
			const discovery = new SubagentDiscoveryHandle(await this.#subscribeRaw({ channels: ["tools", ...this.#lifecycleChannels()] }), this);
			for await (const sub of discovery) buffer.push(sub);
			buffer.close();
		})();
		return buffer;
	}
	/**
	* Audio media handles, one per message containing at least one
	* `AudioBlock`. Each `for await` opens an independent cursor over
	* the shared buffer; late consumers replay every previously emitted
	* audio handle.
	*
	* Yields one item per message on the first matching
	* `content-block-start` — messages with no audio blocks are skipped.
	*/
	get audio() {
		this.#ensureMediaDispatcher();
		return this.#audioBuffer;
	}
	/**
	* Image media handles, one per message containing at least one
	* `ImageBlock`. See {@link audio} for shared semantics.
	*/
	get images() {
		this.#ensureMediaDispatcher();
		return this.#imagesBuffer;
	}
	/**
	* Video media handles, one per message containing at least one
	* `VideoBlock`. See {@link audio} for shared semantics.
	*/
	get video() {
		this.#ensureMediaDispatcher();
		return this.#videoBuffer;
	}
	/**
	* File media handles, one per message containing at least one
	* `FileBlock`. See {@link audio} for shared semantics.
	*/
	get files() {
		this.#ensureMediaDispatcher();
		return this.#filesBuffer;
	}
	/**
	* Promise that resolves with the final state value when the run
	* completes.  Shares the `values` getter's SSE connection.
	* Mirrors the in-process `run.output`.
	*/
	get output() {
		this.values;
		return this.#outputPromise;
	}
	/**
	* Proxy over compile-time {@link StreamTransformer} projections
	* exposed by the bound assistant on `custom:<name>` channels.
	*
	* Each access (e.g. `thread.extensions.toolActivity`) lazily opens a
	* dedicated `custom:<name>` subscription, returns a cached
	* {@link ThreadExtension} handle that is both `AsyncIterable<T>`
	* (streaming items as they arrive) and `PromiseLike<T>` (resolves
	* with the final value when the run terminates), and reuses the same
	* handle on subsequent access.
	*
	* Mirrors the in-process `run.extensions.<name>` shape.
	*/
	get extensions() {
		if (this.#extensionsProxy) return this.#extensionsProxy;
		const cache = this.#extensionsCache;
		const createExtension = (name) => this.#createExtension(name);
		this.#extensionsProxy = new Proxy(Object.create(null), {
			get: (_target, prop) => {
				if (typeof prop !== "string") return void 0;
				const cached = cache.get(prop);
				if (cached) return cached;
				const extension = createExtension(prop);
				cache.set(prop, extension);
				return extension;
			},
			has: (_target, prop) => typeof prop === "string"
		});
		return this.#extensionsProxy;
	}
	/**
	* Lazily open one shared subscription on the `custom` channel that
	* buffers every custom event for this run and fans it out to any
	* per-name extension handles.
	*
	* Deliberately **lazy**: the dispatcher only starts on first access
	* to `thread.extensions.<name>`. Runs that never touch extensions
	* pay no subscription cost. Runs that touch extensions after events
	* have already fired rely on the server's per-session event buffer,
	* which replays matching events to new subscriptions.
	*
	* Each handle retains a PromiseLike that resolves with the
	* transformer's last-observed payload, independent of when the
	* caller grabs the handle (before, during, or after the run), as
	* long as the server still has the events buffered.
	*
	* Idempotent. Invoked only from {@link #createExtension}.
	*/
	#ensureExtensionsDispatcher() {
		if (this.#extensionsDispatcherStarted) return;
		this.#extensionsDispatcherStarted = true;
		this.#startProjection(["custom", ...this.#lifecycleChannels()], (event) => {
			if (event.method !== "custom") return;
			this.#extensionsEvents.push(event);
			for (const listener of this.#extensionsEventListeners) listener(event);
		}, () => {
			this.#extensionsEnded = true;
			const listeners = this.#extensionsEndListeners.splice(0);
			for (const listener of listeners) listener();
		}, { endOnRootTerminal: true });
	}
	/**
	* Open the single shared `messages`-channel subscription that backs
	* every media iterable (audio/images/video/files). Idempotent.
	*
	* The {@link MediaAssembler} fans out to four per-type
	* {@link MultiCursorBuffer}s; each buffer feeds its corresponding
	* lazy getter. One handle is yielded per `(messageId, blockType)` on
	* the first matching `content-block-start`, so messages without any
	* media blocks of a given type never appear on that iterable.
	*/
	#ensureMediaDispatcher() {
		if (this.#mediaDispatcherStarted) return;
		this.#mediaDispatcherStarted = true;
		const assembler = new MediaAssembler({
			fetch: this.#fetchOption,
			onAudio: (m) => {
				this.#mediaHandles.add(m);
				this.#audioBuffer.push(m);
			},
			onImage: (m) => {
				this.#mediaHandles.add(m);
				this.#imagesBuffer.push(m);
			},
			onVideo: (m) => {
				this.#mediaHandles.add(m);
				this.#videoBuffer.push(m);
			},
			onFile: (m) => {
				this.#mediaHandles.add(m);
				this.#filesBuffer.push(m);
			}
		});
		this.#mediaAssembler = assembler;
		this.#startProjection(["messages", ...this.#lifecycleChannels()], (event) => {
			if (event.method !== "messages") return;
			assembler.consume(event);
		}, () => {
			assembler.close();
			this.#audioBuffer.close();
			this.#imagesBuffer.close();
			this.#videoBuffer.close();
			this.#filesBuffer.close();
		});
	}
	/**
	* Build a single {@link ThreadExtension} handle for a named
	* `custom:<name>` projection.
	*
	* The handle reads from the shared extensions dispatcher: past events
	* matching {@link name} are backfilled on construction, future events
	* arrive via a registered listener, and the handle's `PromiseLike`
	* side resolves with its last-seen payload once the run terminates
	* (which may already have happened, in which case it resolves on the
	* next microtask).
	*/
	#createExtension(name) {
		this.#ensureExtensionsDispatcher();
		const buffer = new MultiCursorBuffer();
		let lastValue;
		let resolveFinal;
		const finalPromise = new Promise((resolve) => {
			resolveFinal = resolve;
		});
		const handleEvent = (event) => {
			const data = event.params.data;
			if (data?.name !== name) return;
			lastValue = data.payload;
			buffer.push(data.payload);
		};
		for (const event of this.#extensionsEvents) handleEvent(event);
		this.#extensionsEventListeners.push(handleEvent);
		const settle = () => {
			resolveFinal(lastValue);
			buffer.close();
		};
		if (this.#extensionsEnded) settle();
		else this.#extensionsEndListeners.push(settle);
		return Object.assign(buffer, { then: (onfulfilled, onrejected) => finalPromise.then(onfulfilled, onrejected) });
	}
	/**
	* Generic projection starter: opens a raw subscription with the given
	* channels, feeds events through the consumer, and calls onDone when
	* the stream ends.
	*
	* When `endOnRootTerminal` is set, the projection unsubscribes its
	* own handle one macrotask after observing a root-namespace terminal
	* lifecycle event. This is needed by projections that may be opened
	* AFTER a run already terminated: the shared-stream pause logic
	* skips subscriptions whose `registeredAfterSeq` is past the
	* terminal so raw `subscribe()` callers can keep draining replayed
	* descendants — but a per-run dispatcher (e.g. the extensions
	* pipeline) needs the projection to settle so its `PromiseLike`
	* surface resolves. The macrotask deferral mirrors the deferred
	* pause in `#handleIncoming`, giving trailing same-tick custom
	* events (transformer `finalize()` flushes) a chance to drain.
	*/
	async #startProjection(channels, onEvent, onDone, options = {}) {
		let endTimer;
		let rawHandle;
		try {
			rawHandle = await this.#subscribeRaw({ channels });
			const handle = rawHandle;
			for await (const event of handle) {
				onEvent(event);
				if (options.endOnRootTerminal && endTimer == null && isRootTerminalLifecycle(event)) endTimer = setTimeout(() => {
					endTimer = void 0;
					handle.unsubscribe().catch(() => void 0);
				}, 0);
			}
		} catch {} finally {
			if (endTimer != null) clearTimeout(endTimer);
			onDone();
		}
	}
	/**
	* Start a run without the v1 eager lazy-getter shims.
	*
	* `run.start` (the v1 entry point) eagerly opens a wildcard `values`
	* projection so `thread.output` / `thread.values` resolve regardless
	* of access order, and calls `#ensureLifecycleTracking` which opens
	* another wildcard `["lifecycle", "input"]` subscription. Both
	* subscriptions widen `#computeUnionFilter` to wildcard, defeating
	* the progressive-expansion rotation strategy.
	*
	* `submitRun` skips those shims — callers that manage their own
	* content subscriptions (such as `StreamController`) get the narrow
	* union filter they asked for. Lifecycle / interrupt tracking is
	* instead served by the dedicated `#startLifecycleWatcher`, which
	* opens a wildcard `["lifecycle", "input"]` stream alongside the
	* narrow content pump on both SSE and WebSocket transports.
	*/
	async submitRun(params) {
		this.#prepareForNextRun();
		return await this.#withRunStartGate(() => {
			this.#startLifecycleWatcher();
			return this.#send("run.start", {
				...foldForkFromIntoConfig(params),
				assistant_id: this.assistantId
			});
		});
	}
	/**
	* Respond to an interrupt without the v1 eager lazy-getter shims.
	* See {@link submitRun} for why this exists alongside
	* {@link input.respond}.
	*/
	async respondInput(params) {
		const respondedIds = "responses" in params ? params.responses.map((entry) => entry.interrupt_id) : params.interrupt_id;
		this.#prepareForNextRun(respondedIds);
		this.#startLifecycleWatcher();
		await this.#send("input.respond", params);
	}
	/**
	* Register a listener for every globally-unique event on the thread.
	*
	* Fires exactly once per `event_id` across both the content pump
	* (user `subscribe()` calls) and the lifecycle watcher. Events
	* without an `event_id` always fire through (dedup is best-effort).
	*
	* Returns an unsubscribe function. Primary consumer is
	* `StreamController`, which uses the listener to feed discovery
	* runners and pick up deeply-nested interrupts that the narrow
	* content pump wouldn't deliver.
	*/
	onEvent(listener) {
		this.#onEventListeners.add(listener);
		return () => {
			this.#onEventListeners.delete(listener);
		};
	}
	/**
	* Lazily open the wildcard discovery watcher stream.
	*
	* Idempotent. Used by both transports, but through different
	* mechanisms:
	*
	*  - **SSE**: opens a dedicated event stream via
	*    {@link TransportAdapter.openEventStream}. The stream runs
	*    outside `#computeUnionFilter`, so the shared SSE stream's
	*    content pump can stay narrow (e.g. `depth: 1`) while we still
	*    capture every lifecycle/input event at any depth.
	*  - **WebSocket**: opens a wildcard watcher subscription
	*    subscription via the normal command path. The WS server
	*    delivers matching events on the shared command connection and
	*    `#handleIncoming` dispatches them through `#fireOnEvent` and
	*    the thread-level effects — same downstream semantics as the
	*    SSE watcher, just reusing the transport that's already open.
	*
	* Why this matters: consumers of {@link onEvent} (notably
	* `StreamController`'s subgraph/subagent discovery runners and
	* nested interrupt capture) depend on observing namespaced
	* lifecycle events at any depth. Without this watcher, WS clients
	* would only ever receive events matching the content pump's
	* narrow filter (depth 1 from the root), breaking inference rules
	* that require deeper descendants (e.g. the "has-descendants"
	* signal used to promote a subgraph host).
	*/
	#startLifecycleWatcher() {
		if (this.#lifecycleWatcherStartPromise != null) return;
		if (this.#transportAdapter.openEventStream != null) {
			this.#lifecycleWatcherStartPromise = this.#startLifecycleWatcherSse();
			return;
		}
		this.#lifecycleWatcherStartPromise = this.#startLifecycleWatcherWebSocket();
	}
	/**
	* Public, idempotent entry point to start the wildcard lifecycle
	* watcher.
	*
	* The watcher is normally started lazily by `submitRun` /
	* `respondInput` because for fresh (self-created) threads the SSE
	* stream would 404 if opened before the server has the thread row.
	* Callers that already know the thread exists server-side
	* (`StreamController.hydrate` of an existing thread) can use this
	* to start the watcher up front. The watcher subscribes to wildcard
	* lifecycle events across every namespace, so it sees arbitrarily-
	* nested subagent lifecycle messages that the narrow root content
	* pump (running at `depth: 1`) wouldn't reach — that's what makes
	* subagent discovery work for historical thread loads.
	*
	* Idempotent — repeat calls reuse the in-flight start promise.
	*/
	startLifecycleWatcher() {
		this.#startLifecycleWatcher();
	}
	async #startLifecycleWatcherSse() {
		if (this.#runStartReady != null) try {
			await this.#runStartReady;
		} catch {
			return;
		}
		const filter = { channels: ["lifecycle", "input"] };
		let handle;
		try {
			handle = this.#transportAdapter.openEventStream(filter);
		} catch {
			return;
		}
		try {
			await handle.ready;
		} catch {
			try {
				handle.close();
			} catch {}
			return;
		}
		if (this.#closed) {
			try {
				handle.close();
			} catch {}
			return;
		}
		this.#lifecycleWatcherHandle = handle;
		try {
			for await (const message of handle.events) {
				if (this.#closed) break;
				this.#handleLifecycleWatcherMessage(message);
			}
		} catch {}
	}
	async #startLifecycleWatcherWebSocket() {
		let handle;
		try {
			handle = await this.#subscribeRaw({ channels: ["lifecycle", "input"] });
		} catch {
			return;
		}
		if (this.#closed) {
			try {
				handle.close();
			} catch {}
			return;
		}
		try {
			for await (const _event of handle) if (this.#closed) break;
		} catch {}
	}
	/**
	* Process an event from the dedicated lifecycle watcher stream.
	*
	* Unlike `#handleIncoming`, this does NOT fan out to user
	* subscriptions — user subs with namespace wildcards already widen
	* `#computeUnionFilter` and therefore receive the event on the
	* content pump. Delivering via both streams would only add per-sub
	* dedup churn without expanding what the user can observe.
	*
	* We still run global-dedup thread-level side effects (interrupt
	* capture, `onEvent` fan-out) so deeply-nested interrupts outside
	* the content pump's narrow scope are recorded.
	*/
	#handleLifecycleWatcherMessage(message) {
		if (message.type !== "event") return;
		if (typeof message.seq === "number") this.ordering.lastSeenSeq = maxSeq(this.ordering.lastSeenSeq, message.seq);
		if (message.event_id) this.ordering.lastEventId = message.event_id;
		const eventId = message.event_id ?? void 0;
		const globallyProcessed = eventId != null && this.#seenEventIds.has(eventId);
		if (eventId != null) this.#seenEventIds.add(eventId);
		if (globallyProcessed) return;
		this.#applyThreadLevelEffects(message);
		this.#fireOnEvent(message);
	}
	#applyThreadLevelEffects(event) {
		if (event.method === "lifecycle") {
			if (event.params.data.event === "interrupted") this.interrupted = true;
		}
		if (event.method === "input.requested") {
			const data = event.params.data;
			const interruptId = data.interrupt_id ?? `interrupt_${this.interrupts.length}`;
			this.interrupts.push({
				interruptId,
				payload: data.payload,
				namespace: [...event.params.namespace]
			});
			if (isHeadlessToolInterrupt(data.payload)) this.#headlessInterruptsAwaitingTerminal.add(interruptId);
		}
	}
	#fireOnEvent(event) {
		if (this.#onEventListeners.size === 0) return;
		for (const listener of this.#onEventListeners) try {
			listener(event);
		} catch {}
	}
	async close() {
		if (this.#closed) return;
		this.#closed = true;
		if (this.#terminalPauseTimer != null) {
			clearTimeout(this.#terminalPauseTimer);
			this.#terminalPauseTimer = void 0;
		}
		this.#terminalPauseSeq = void 0;
		for (const pending of this.#pendingSubResolves) pending.reject(/* @__PURE__ */ new Error("ThreadStream closed"));
		this.#pendingSubResolves.length = 0;
		if (this.#sharedStream != null) {
			try {
				this.#sharedStream.close();
			} catch {}
			this.#sharedStream = null;
			this.#sharedStreamFilter = null;
		}
		if (this.#lifecycleWatcherHandle != null) {
			try {
				this.#lifecycleWatcherHandle.close();
			} catch {}
			this.#lifecycleWatcherHandle = null;
		}
		const lifecycleWatcherStartPromise = this.#lifecycleWatcherStartPromise;
		this.#lifecycleWatcherStartPromise = void 0;
		this.#onEventListeners.clear();
		for (const subscription of this.#subscriptions.values()) subscription.close();
		this.#subscriptions.clear();
		try {
			await lifecycleWatcherStartPromise;
		} catch {}
		for (const handle of this.#mediaHandles) try {
			handle.revoke();
		} catch {}
		this.#mediaHandles.clear();
		this.#mediaAssembler?.close();
		this.#audioBuffer.close();
		this.#imagesBuffer.close();
		this.#videoBuffer.close();
		this.#filesBuffer.close();
		await this.#transportAdapter.close();
	}
	async subscribe(paramsOrChannels, options = {}) {
		const isParamsObject = typeof paramsOrChannels === "object" && !Array.isArray(paramsOrChannels) && "channels" in paramsOrChannels;
		const params = normalizeSubscribeParams(paramsOrChannels, options);
		return await this.#subscribeRaw(params, { unwrapNamedCustom: !isParamsObject });
	}
	async #subscribeRaw(params, options = {}) {
		await this.#ensureOpen();
		const { unwrapNamedCustom = true } = options;
		const hasOnlyNamedCustom = params.channels.length > 0 && params.channels.every((ch) => ch.startsWith("custom:"));
		const transform = unwrapNamedCustom && hasOnlyNamedCustom ? (event) => event.params.data?.payload ?? event : void 0;
		if (this.#transportAdapter.openEventStream != null) return this.#subscribeViaSharedStream(params, transform);
		return this.#subscribeViaCommand(params, transform);
	}
	/**
	* Subscribe via the single shared SSE connection.
	*
	* The subscription is registered immediately in `#subscriptions` so
	* fan-out can reach it the moment events begin flowing. The returned
	* promise resolves after a stream rotation completes whose union
	* filter covers this subscription's channels — mirroring the per-sub
	* `await streamHandle.ready` semantics callers depended on.
	*
	* Every subscribe schedules a stream rotation, even when the current
	* stream's filter already covers `params`. Rotating opens a fresh
	* server-side session that replays the run's full history from
	* `seq=0`; without it a late-joining sub would only see events that
	* arrive after it registered, because the shared pump's dedup drops
	* events the existing sub already consumed. Per-sub dedup
	* (`seenEventIds`) protects existing subs from receiving the
	* replay as duplicates. Rapid subscribes in the same microtask are
	* coalesced by `#scheduleReconcile` into a single rotation.
	*/
	async #subscribeViaSharedStream(params, transform) {
		const subscriptionId = `sse-${this.#nextCommandId++}`;
		const handle = new SubscriptionHandle(subscriptionId, params, async (id) => {
			this.#subscriptions.delete(id);
			this.#scheduleReconcile();
		}, transform);
		const subscription = Object.assign(handle, {
			filter: params,
			registeredAfterSeq: this.ordering.lastSeenSeq,
			seenEventIds: /* @__PURE__ */ new Set()
		});
		this.#subscriptions.set(subscriptionId, subscription);
		const covered = new Promise((resolve, reject) => {
			this.#pendingSubResolves.push({
				filter: params,
				resolve,
				reject
			});
		});
		this.#scheduleReconcile();
		try {
			await covered;
		} catch (err) {
			this.#subscriptions.delete(subscriptionId);
			throw err;
		}
		return handle;
	}
	/**
	* Progressive-expansion union of every currently-registered
	* subscription's filter. The server receives the narrowest filter
	* that still covers every active sub so deeply-namespaced or
	* selectively-opened projections don't pull down the entire thread's
	* event firehose.
	*
	* Unioning rules (matching the server's matching semantics in
	* `matchesSinkFilter`):
	*  - Channels: set union.
	*  - Namespaces: if any subscription requests a wildcard
	*    (`namespaces === undefined`) the union is wildcard; otherwise
	*    the union is the deduplicated list of every explicit prefix.
	*  - Depth: if any subscription is unbounded (`depth === undefined`)
	*    the union is unbounded; otherwise the union is the maximum
	*    depth across all subscriptions (matching the per-sub "max
	*    reach below the prefix" semantics).
	*
	* Returns `null` when there are no subscriptions.
	*/
	#computeUnionFilter() {
		if (this.#subscriptions.size === 0) return null;
		const channels = /* @__PURE__ */ new Set();
		let wildcardNamespaces = false;
		const namespaceMap = /* @__PURE__ */ new Map();
		let unboundedDepth = false;
		let maxDepth = 0;
		for (const sub of this.#subscriptions.values()) {
			for (const ch of sub.filter.channels) channels.add(ch);
			if (sub.filter.namespaces == null) wildcardNamespaces = true;
			else if (!wildcardNamespaces) for (const ns of sub.filter.namespaces) namespaceMap.set(namespaceKey(ns), ns);
			if (sub.filter.depth == null) unboundedDepth = true;
			else if (!unboundedDepth && sub.filter.depth > maxDepth) maxDepth = sub.filter.depth;
		}
		const result = { channels: [...channels] };
		if (!wildcardNamespaces) result.namespaces = [...namespaceMap.values()];
		if (!unboundedDepth) result.depth = maxDepth;
		return result;
	}
	/**
	* Schedule a stream reconciliation for the next microtask.
	*
	* Coalesces multiple subscribe/unsubscribe calls in the same tick
	* into a single rotation, and serializes across ticks (no two
	* rotations ever run concurrently).
	*/
	#scheduleReconcile() {
		if (this.#closed) return;
		if (this.#rotationState !== "idle") return;
		this.#rotationState = "scheduled";
		queueMicrotask(() => {
			if (this.#closed) {
				this.#rotationState = "idle";
				return;
			}
			this.#rotationState = "idle";
			this.#reconcileStream().catch(() => {
				this.#rotationState = "idle";
			});
		});
	}
	/**
	* Reconcile the shared SSE stream to match the desired union filter.
	*
	* Rotation strategy: open the new stream first, await its `ready`,
	* then close the old one. Overlap is absorbed by `#seenEventIds`
	* dedup in `#handleIncoming`.
	*
	* Error handling:
	*   - Failure before `ready` resolves: reject all pending `subscribe`
	*     promises whose filter isn't covered by the existing stream,
	*     and keep the existing stream running for other subscriptions.
	*   - Failure mid-pump on the active stream: close the thread via
	*     {@link #failThreadWithError} so higher layers can rebind.
	*/
	async #reconcileStream() {
		if (this.#closed) return;
		if (this.#rotationState === "rotating") return;
		const desired = this.#computeUnionFilter();
		if (desired == null) return;
		if (this.#runStartReady != null) {
			try {
				await this.#runStartReady;
			} catch (err) {
				const normalized = err instanceof Error ? err : /* @__PURE__ */ new Error("run.start failed");
				this.#rejectUncoveredPending(normalized);
				return;
			}
			if (this.#closed) return;
			if (this.#rotationState === "rotating") return;
		}
		if (this.#sharedStreamFilter != null && filterEqual(desired, this.#sharedStreamFilter) && this.#pendingSubResolves.length === 0) {
			this.#resolvePending();
			return;
		}
		this.#rotationState = "rotating";
		let newHandle;
		try {
			newHandle = this.#transportAdapter.openEventStream(desired);
		} catch (err) {
			this.#rotationState = "idle";
			this.#rejectUncoveredPending(err);
			return;
		}
		try {
			await newHandle.ready;
		} catch (err) {
			this.#rotationState = "idle";
			try {
				newHandle.close();
			} catch {}
			this.#rejectUncoveredPending(err);
			return;
		}
		if (this.#closed) {
			try {
				newHandle.close();
			} catch {}
			this.#rotationState = "idle";
			return;
		}
		this.#pumpStream(newHandle);
		const oldHandle = this.#sharedStream;
		this.#sharedStream = newHandle;
		this.#sharedStreamFilter = desired;
		if (oldHandle != null) try {
			oldHandle.close();
		} catch {}
		this.#rotationState = "idle";
		this.#resolvePending();
		const next = this.#computeUnionFilter();
		if (next != null && !filterEqual(next, this.#sharedStreamFilter)) this.#scheduleReconcile();
	}
	/**
	* Pump events from a shared-stream handle into `#handleIncoming`.
	* One pump task runs per open stream; during rotation overlap two
	* pumps may be active briefly, with `#seenEventIds` deduping.
	*/
	async #pumpStream(handle) {
		try {
			for await (const message of handle.events) {
				if (this.#closed) break;
				this.#handleIncoming(message);
			}
		} catch (err) {
			if (handle === this.#sharedStream && !this.#closed) this.#failThreadWithError(err);
		}
	}
	/**
	* Resolve any pending `subscribe()` promises whose filter is now
	* covered by the active shared stream. Called after every successful
	* rotation (and after no-op reconciliations).
	*/
	#resolvePending() {
		if (this.#sharedStreamFilter == null) return;
		const current = this.#sharedStreamFilter;
		if (this.#pendingSubResolves.length === 0) return;
		const stillPending = [];
		for (const pending of this.#pendingSubResolves) if (filterCovers(current, pending.filter)) pending.resolve();
		else stillPending.push(pending);
		this.#pendingSubResolves.length = 0;
		this.#pendingSubResolves.push(...stillPending);
	}
	/**
	* Reject pending `subscribe()` promises whose filter isn't covered
	* by the existing stream (they're the ones that triggered the
	* failed rotation). Covered pending subs are resolved normally —
	* they didn't need the new stream.
	*/
	#rejectUncoveredPending(err) {
		if (this.#pendingSubResolves.length === 0) return;
		const current = this.#sharedStreamFilter;
		const stillPending = [];
		for (const pending of this.#pendingSubResolves) if (current != null && filterCovers(current, pending.filter)) pending.resolve();
		else stillPending.push(pending);
		this.#pendingSubResolves.length = 0;
		for (const pending of stillPending) pending.reject(err);
	}
	/**
	* Terminate the thread due to an unrecoverable shared-stream error.
	* Rejects pending commands, closes subscriptions, and marks the
	* thread closed so no further rotations occur.
	*/
	#failThreadWithError(err) {
		const normalized = err instanceof Error ? err : new Error(String(err));
		for (const pending of this.#pending.values()) pending.reject(normalized);
		this.#pending.clear();
		for (const pending of this.#pendingSubResolves) pending.reject(normalized);
		this.#pendingSubResolves.length = 0;
		for (const subscription of this.#subscriptions.values()) subscription.close();
	}
	/**
	* Command-based subscription (WebSocket fallback). The server replays
	* matching buffered events on subscribe via the same WebSocket stream.
	*/
	async #subscribeViaCommand(params, transform) {
		const placeholderId = `pending:${this.#nextCommandId}:${Math.random().toString(36).slice(2, 10)}`;
		let resolvedId = placeholderId;
		const handle = new SubscriptionHandle(placeholderId, params, async () => {
			this.#subscriptions.delete(resolvedId);
			if (!this.#closed && resolvedId !== placeholderId) await this.#send("subscription.unsubscribe", { subscription_id: resolvedId }).catch((err) => {
				if (err instanceof ProtocolError && err.code === "no_such_subscription") return;
				throw err;
			});
		}, transform);
		const subscription = Object.assign(handle, {
			filter: params,
			registeredAfterSeq: this.ordering.lastSeenSeq,
			seenEventIds: /* @__PURE__ */ new Set()
		});
		this.#subscriptions.set(placeholderId, subscription);
		if (this.#runStartReady != null) try {
			await this.#runStartReady;
		} catch (err) {
			this.#subscriptions.delete(placeholderId);
			throw err;
		}
		let result;
		try {
			result = await this.#send("subscription.subscribe", params);
		} catch (err) {
			this.#subscriptions.delete(placeholderId);
			throw err;
		}
		this.#subscriptions.delete(placeholderId);
		resolvedId = result.subscription_id;
		handle.subscriptionId = resolvedId;
		this.#subscriptions.set(resolvedId, subscription);
		return handle;
	}
	/**
	* Re-issue `subscription.subscribe` for every active WS subscription
	* after the transport reconnects. The server replays buffered events on
	* the new socket; client-side `event_id` dedup suppresses duplicates.
	*/
	async #resubscribeWebSocketSubscriptions() {
		if (this.#transportAdapter.openEventStream != null || this.#closed) return;
		const entries = [...this.#subscriptions.entries()];
		await Promise.all(entries.map(async ([id, subscription]) => {
			if (id.startsWith("pending:")) return;
			try {
				const nextId = (await this.#send("subscription.subscribe", subscription.filter)).subscription_id;
				if (nextId === id) return;
				this.#subscriptions.delete(id);
				subscription.subscriptionId = nextId;
				this.#subscriptions.set(nextId, subscription);
				if (this.#lifecycleSubId === id) this.#lifecycleSubId = nextId;
			} catch {}
		}));
	}
	async #consumeEvents() {
		try {
			for await (const message of this.#transportAdapter.events()) this.#handleIncoming(message);
			for (const subscription of this.#subscriptions.values()) subscription.close();
		} catch (error) {
			const normalized = error instanceof Error ? error : new Error(String(error));
			for (const pending of this.#pending.values()) pending.reject(normalized);
			for (const subscription of this.#subscriptions.values()) subscription.close();
			this.#pending.clear();
		}
	}
	/**
	* Pause non-lifecycle subscriptions after a root terminal lifecycle.
	*
	* The pause is deferred one macrotask so same-run trailing events
	* emitted immediately after terminal (for example final `values`)
	* can still drain. `terminalSeq` lets replay attachers skip terminals
	* that happened before they registered, so late subscribers can keep
	* consuming the replayed history they joined for.
	*/
	#scheduleTerminalPause(terminalSeq) {
		if (this.#terminalPauseTimer != null) clearTimeout(this.#terminalPauseTimer);
		this.#terminalPauseSeq = terminalSeq ?? null;
		this.#terminalPauseTimer = setTimeout(() => {
			this.#terminalPauseTimer = void 0;
			if (this.#closed) return;
			for (const [id, subscription] of this.#subscriptions) {
				if (id === this.#lifecycleSubId) continue;
				if (terminalSeq != null && subscription.registeredAfterSeq != null && subscription.registeredAfterSeq >= terminalSeq) continue;
				subscription.pause();
			}
		}, 0);
	}
	#handleIncoming(message) {
		if (message.type === "event") {
			if (typeof message.seq === "number") this.ordering.lastSeenSeq = maxSeq(this.ordering.lastSeenSeq, message.seq);
			if (message.event_id) this.ordering.lastEventId = message.event_id;
			const eventId = message.event_id ?? void 0;
			const globallyProcessed = eventId != null && this.#seenEventIds.has(eventId);
			if (eventId != null) this.#seenEventIds.add(eventId);
			const TERMINAL_LIFECYCLE_EVENTS = /* @__PURE__ */ new Set([
				"interrupted",
				"completed",
				"failed"
			]);
			if (!globallyProcessed) {
				this.#applyThreadLevelEffects(message);
				this.#fireOnEvent(message);
			}
			let fannedToAny = false;
			for (const subscription of this.#subscriptions.values()) {
				if (!matchesSubscription(message, subscription.filter)) continue;
				if (eventId != null) {
					if (subscription.seenEventIds.has(eventId)) continue;
					subscription.seenEventIds.add(eventId);
				}
				subscription.push(message);
				fannedToAny = true;
			}
			if (fannedToAny && this.#terminalPauseSeq !== void 0 && !(message.method === "lifecycle" && message.params.namespace.length === 0)) {
				const eventSeq = typeof message.seq === "number" ? message.seq : void 0;
				const terminalSeq = this.#terminalPauseSeq;
				if (terminalSeq === null || eventSeq == null || eventSeq > terminalSeq) {
					if (this.#terminalPauseTimer != null) {
						clearTimeout(this.#terminalPauseTimer);
						this.#terminalPauseTimer = void 0;
					}
					for (const [id, subscription] of this.#subscriptions) if (id !== this.#lifecycleSubId) subscription.resume();
					this.#scheduleTerminalPause(terminalSeq === null ? void 0 : terminalSeq);
				}
			}
			if (fannedToAny && message.method === "lifecycle" && message.params.namespace.length === 0 && TERMINAL_LIFECYCLE_EVENTS.has(message.params.data.event)) {
				if (message.params.data.event === "interrupted" && this.#headlessInterruptsAwaitingTerminal.size > 0) {
					this.#headlessInterruptsAwaitingTerminal.clear();
					return;
				}
				this.#scheduleTerminalPause(typeof message.seq === "number" ? message.seq : void 0);
			}
			return;
		}
		const messageId = typeof message.id === "number" ? message.id : void 0;
		const pending = messageId === void 0 ? void 0 : this.#pending.get(messageId);
		if (!pending) return;
		if (messageId !== void 0) this.#pending.delete(messageId);
		if (message.type === "error") {
			pending.reject(new ProtocolError(message));
			return;
		}
		if (typeof message.meta?.applied_through_seq === "number") this.ordering.lastAppliedThroughSeq = message.meta.applied_through_seq;
		pending.resolve(message);
	}
	async #send(method, params) {
		await this.#ensureOpen();
		const id = this.#nextCommandId++;
		const command = {
			id,
			method,
			params
		};
		const responsePromise = new Promise((resolve, reject) => {
			this.#pending.set(id, {
				resolve,
				reject
			});
		});
		const immediate = await this.#transportAdapter.send(command);
		if (immediate) {
			this.#pending.delete(id);
			if (immediate.type === "error") throw new ProtocolError(immediate);
			if (typeof immediate.meta?.applied_through_seq === "number") this.ordering.lastAppliedThroughSeq = immediate.meta.applied_through_seq;
			return immediate.result;
		}
		return (await responsePromise).result;
	}
};
//#endregion
//#region node_modules/@langchain/langgraph-sdk/dist/client/stream/transport/queue.js
var AsyncQueue = class {
	values = [];
	waiters = [];
	rejecters = [];
	closed = false;
	error = null;
	push(value) {
		if (this.closed) return;
		const waiter = this.waiters.shift();
		this.rejecters.shift();
		if (waiter) {
			waiter({
				done: false,
				value
			});
			return;
		}
		this.values.push(value);
	}
	close(error) {
		if (this.closed) return;
		this.closed = true;
		this.error = error == null ? null : error instanceof Error ? error : new Error(String(error));
		if (this.error) {
			for (const rejecter of this.rejecters.splice(0)) rejecter(this.error);
			this.waiters.length = 0;
			return;
		}
		for (const waiter of this.waiters.splice(0)) waiter({
			done: true,
			value: void 0
		});
		this.rejecters.length = 0;
	}
	async shift() {
		if (this.values.length > 0) return {
			done: false,
			value: this.values.shift()
		};
		if (this.error) throw this.error;
		if (this.closed) return {
			done: true,
			value: void 0
		};
		return await new Promise((resolve, reject) => {
			this.waiters.push(resolve);
			this.rejecters.push(reject);
		});
	}
};
//#endregion
//#region node_modules/@langchain/langgraph-sdk/dist/client/stream/transport/utils.js
var isRecord = (value) => typeof value === "object" && value !== null;
/**
* Resolve a {@link ProtocolPath} against the transport's currently-bound
* thread.
*
* - a fixed `string` is used verbatim (back-compat: a baked path is
*   independent of the bound thread);
* - a function path and the default fallback are evaluated against
*   `threadId`, so late-bound / re-bound adapters target the right thread.
*
* Throws when neither a fixed path nor a bound thread is available — i.e.
* a request was attempted before `client.threads.stream(threadId, …)` /
* {@link TransportAdapter.setThreadId} bound a thread.
*/
function resolveProtocolPath(path, threadId, fallback) {
	if (typeof path === "string") return path;
	if (!threadId) throw new Error("Protocol transport has no bound threadId. Bind one — the framework calls client.threads.stream(threadId, { transport }) / transport.setThreadId(threadId) — before issuing requests.");
	return path ? path(threadId) : fallback(threadId);
}
/** Match {@link BaseClient.prepareFetchOptions}: preserve any apiUrl path prefix. */
var toAbsoluteUrl = (apiUrl, path) => new URL(`${apiUrl.replace(/\/$/, "")}${path}`);
var toError = (error) => error instanceof Error ? error : new Error(String(error));
var toWebSocketUrl = (apiUrl) => {
	const url = new URL(apiUrl);
	url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
	url.search = "";
	url.hash = "";
	return url.toString();
};
var hasHeaders = (headers) => Object.values(headers ?? {}).some((value) => value != null);
function mergeHeaders(...headerGroups) {
	const merged = new Headers();
	for (const group of headerGroups) {
		if (!group) continue;
		if (group instanceof Headers) {
			group.forEach((value, key) => {
				merged.set(key, value);
			});
			continue;
		}
		if (Array.isArray(group)) {
			for (const [key, value] of group) if (value == null) merged.delete(key);
			else merged.set(key, value);
			continue;
		}
		for (const [key, value] of Object.entries(group)) if (value == null) merged.delete(key);
		else merged.set(key, value);
	}
	return merged;
}
function isProtocolResponse(value) {
	return isRecord(value) && typeof value.type === "string" && (value.type === "success" || value.type === "error");
}
//#endregion
//#region node_modules/@langchain/langgraph-sdk/dist/client/stream/transport/http.js
/**
* Transport adapter that speaks the thread-centric protocol over HTTP
* commands plus SSE event streams. Bound to a `threadId` at construction
* or later via {@link setThreadId}; request URLs derive from the
* currently-bound thread. Each {@link openEventStream} call opens an
* independent filtered SSE connection via
* `POST /threads/:thread_id/stream/events`.
*/
var ProtocolSseTransportAdapter = class {
	threadId;
	apiUrl;
	queue = new AsyncQueue();
	fetchImpl;
	defaultHeaders;
	onRequest;
	fetchFactory;
	asyncCaller;
	maxReconnectAttempts;
	idleReconnect;
	onReconnect;
	reconnectDelayMs;
	paths;
	sessionAbortController = new AbortController();
	eventStreams = /* @__PURE__ */ new Set();
	closed = false;
	constructor(options) {
		this.fetchImpl = options.fetch ?? fetch;
		this.apiUrl = options.apiUrl;
		this.defaultHeaders = options.defaultHeaders ?? {};
		this.onRequest = options.onRequest;
		this.fetchFactory = options.fetchFactory;
		this.asyncCaller = options.asyncCaller;
		this.maxReconnectAttempts = options.maxReconnectAttempts ?? 5;
		this.idleReconnect = options.idleReconnect ?? "auto";
		this.onReconnect = options.onReconnect;
		this.reconnectDelayMs = options.reconnectDelayMs ?? reconnectDelayMs;
		this.threadId = options.threadId ?? "";
		this.paths = options.paths;
	}
	/** {@inheritDoc TransportAdapter.setThreadId} */
	setThreadId(threadId) {
		this.threadId = threadId;
	}
	/**
	* Command/stream/state URLs derive from the currently-bound thread so a
	* single adapter can follow {@link setThreadId} re-binds. A fixed
	* `paths.*` string overrides the default and is used as-is.
	*/
	get commandsUrl() {
		return resolveProtocolPath(this.paths?.commands, this.threadId, (id) => `/threads/${id}/commands`);
	}
	get streamUrl() {
		return resolveProtocolPath(this.paths?.stream, this.threadId, (id) => `/threads/${id}/stream/events`);
	}
	get stateUrl() {
		return resolveProtocolPath(this.paths?.state, this.threadId, (id) => `/threads/${id}/state`);
	}
	/**
	* Fetch checkpointed thread state for hydration.
	*
	* Uses `GET`, matching `client.threads.getState()` and both LangGraph
	* Platform and Agent Protocol custom backends (`POST` is reserved for
	* `updateState`).
	*/
	async getState() {
		const url = toAbsoluteUrl(this.apiUrl, this.stateUrl);
		let requestInit = {
			method: "GET",
			headers: mergeHeaders(this.defaultHeaders, {})
		};
		if (this.onRequest) requestInit = await this.onRequest(url, requestInit);
		const response = await (await this.resolveFetch())(url.toString(), requestInit);
		if (response.status === 404) return null;
		if (!response.ok) {
			const error = toError(/* @__PURE__ */ new Error(`Thread state request failed: ${response.status} ${response.statusText}`));
			error.status = response.status;
			throw error;
		}
		return await response.json();
	}
	async resolveFetch() {
		if (this.fetchFactory) return await this.fetchFactory();
		return this.fetchImpl;
	}
	/**
	* HTTP/SSE transports have no handshake — connections are made
	* per-command and per-subscription.
	*/
	async open() {}
	async send(command) {
		const response = await this.request(this.commandsUrl, {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify(command),
			signal: this.sessionAbortController.signal
		});
		if (response.status === 202 || response.status === 204) return;
		const payload = await response.json();
		if (!isProtocolResponse(payload)) throw new Error("Protocol command did not return a valid response.");
		return payload;
	}
	/**
	* WebSocket-style single event stream.
	* For the SSE transport this returns a dummy iterable; real event
	* delivery happens via {@link openEventStream}.
	*/
	events() {
		const queue = this.queue;
		return { [Symbol.asyncIterator]: () => ({
			next: async () => await queue.shift(),
			return: async () => {
				queue.close();
				return {
					done: true,
					value: void 0
				};
			}
		}) };
	}
	openEventStream(params) {
		if (this.closed) throw new Error("Protocol transport is closed.");
		const ac = new AbortController();
		this.eventStreams.add(ac);
		const streamQueue = new AsyncQueue();
		const streamUrl = this.streamUrl;
		let resolveReady;
		let rejectReady;
		const ready = new Promise((resolve, reject) => {
			resolveReady = resolve;
			rejectReady = reject;
		});
		const initialSince = typeof params.since === "number" ? params.since : void 0;
		let readySettled = false;
		const startStream = async () => {
			let attempt = 0;
			while (!ac.signal.aborted && !this.closed) try {
				const response = await this.request(streamUrl, {
					method: "POST",
					headers: {
						"content-type": "application/json",
						accept: "text/event-stream"
					},
					body: JSON.stringify({
						channels: params.channels,
						...params.namespaces ? { namespaces: params.namespaces } : {},
						...params.depth != null ? { depth: params.depth } : {},
						...!readySettled && initialSince != null ? { since: initialSince } : {}
					}),
					signal: ac.signal
				}, { stream: true });
				if (!readySettled) {
					readySettled = true;
					resolveReady();
				}
				const readable = response.body ?? new ReadableStream({ start(controller) {
					controller.close();
				} });
				const enableIdle = this.idleReconnect === "auto" || typeof this.idleReconnect === "number" && this.idleReconnect > 0;
				const lines = readable.pipeThrough(BytesLineDecoder());
				const stream = (enableIdle ? lines.pipeThrough(idleReconnectStream({ mode: this.idleReconnect })) : lines).pipeThrough(SSEDecoder());
				const iterable = IterableReadableStream.fromReadableStream(stream);
				for await (const event of iterable) {
					if (ac.signal.aborted || this.closed) break;
					if (isRecord(event.data)) streamQueue.push(event.data);
				}
				streamQueue.close();
				return;
			} catch (error) {
				if (ac.signal.aborted || this.closed) {
					if (!readySettled) rejectReady(error);
					streamQueue.close();
					return;
				}
				if (this.maxReconnectAttempts <= 0) {
					if (!readySettled) rejectReady(error);
					streamQueue.close(toError(error));
					return;
				}
				attempt += 1;
				if (attempt > this.maxReconnectAttempts) {
					if (!readySettled) rejectReady(error);
					streamQueue.close(toError(error));
					return;
				}
				this.onReconnect?.({
					attempt,
					cause: error
				});
				const delay = this.reconnectDelayMs(attempt);
				if (delay > 0) await new Promise((resolve) => {
					setTimeout(resolve, delay);
				});
			}
		};
		startStream();
		const cleanup = () => {
			this.eventStreams.delete(ac);
			ac.abort();
			streamQueue.close();
		};
		return {
			events: { [Symbol.asyncIterator]: () => ({
				next: async () => await streamQueue.shift(),
				return: async () => {
					cleanup();
					return {
						done: true,
						value: void 0
					};
				}
			}) },
			ready,
			close: cleanup
		};
	}
	async close() {
		if (this.closed) return;
		this.closed = true;
		this.sessionAbortController.abort();
		for (const ac of this.eventStreams) ac.abort();
		this.eventStreams.clear();
		this.queue.close();
	}
	async request(path, init, options) {
		const url = toAbsoluteUrl(this.apiUrl, path);
		let requestInit = {
			...init,
			headers: mergeHeaders(this.defaultHeaders, init.headers)
		};
		if (this.onRequest) requestInit = await this.onRequest(url, requestInit);
		const useAsyncCaller = this.asyncCaller != null && !options?.stream;
		const execute = async () => {
			const response = await (await this.resolveFetch())(url.toString(), requestInit);
			if (!response.ok) {
				if (useAsyncCaller) throw response;
				let detail = "";
				try {
					const body = await response.text();
					const parsed = JSON.parse(body);
					if (typeof parsed === "object" && parsed != null) detail = parsed.message ?? parsed.error ?? "";
					if (!detail) detail = body;
				} catch {}
				const message = detail ? `Protocol request failed: ${response.status} ${response.statusText} — ${detail}` : `Protocol request failed: ${response.status} ${response.statusText}`;
				throw new Error(message);
			}
			return response;
		};
		try {
			return useAsyncCaller ? await this.asyncCaller.call(execute) : await execute();
		} catch (error) {
			throw toError(error);
		}
	}
};
//#endregion
//#region node_modules/@langchain/langgraph-sdk/dist/client/stream/transport/websocket.js
var WEB_SOCKET_CONNECTING = 0;
var WEB_SOCKET_OPEN = 1;
var WEB_SOCKET_CLOSED = 3;
/**
* Transport adapter that speaks the thread-centric protocol over a
* bidirectional WebSocket. Bound to a `threadId` at construction or later
* via {@link setThreadId} — the socket connects to
* `ws://.../threads/:thread_id/stream/events`.
*
* On unexpected disconnect the adapter reconnects with exponential
* backoff (see {@link ProtocolWebSocketTransportOptions.maxReconnectAttempts}).
* The server replays buffered events on the new socket; the SDK
* deduplicates by `event_id`. {@link ProtocolWebSocketTransportOptions.onReconnected}
* runs after each successful reconnect so `ThreadStream` can re-issue
* `subscription.subscribe` commands.
*/
var ProtocolWebSocketTransportAdapter = class {
	threadId;
	queue = new AsyncQueue();
	apiUrl;
	defaultHeaders;
	onRequest;
	webSocketFactory;
	paths;
	maxReconnectAttempts;
	onReconnect;
	reconnectDelayMs;
	onReconnected;
	pending = /* @__PURE__ */ new Map();
	socket = null;
	closed = false;
	intentionalClose = false;
	reconnectInFlight = null;
	constructor(options) {
		this.apiUrl = options.apiUrl;
		this.threadId = options.threadId ?? "";
		this.defaultHeaders = options.defaultHeaders;
		this.onRequest = options.onRequest;
		this.webSocketFactory = options.webSocketFactory ?? ((url) => new WebSocket(url));
		this.paths = options.paths;
		this.maxReconnectAttempts = options.maxReconnectAttempts ?? 5;
		this.onReconnect = options.onReconnect;
		this.onReconnected = options.onReconnected;
		this.reconnectDelayMs = options.reconnectDelayMs ?? reconnectDelayMs;
	}
	/** {@inheritDoc TransportAdapter.setThreadId} */
	setThreadId(threadId) {
		if (threadId === this.threadId) return;
		if (this.reconnectInFlight != null || this.socket != null && this.socket.readyState !== WEB_SOCKET_CLOSED) throw new Error("Protocol WebSocket transport cannot be rebound to a different thread while the socket is open. Close the current stream and create a new WebSocket transport for the new thread.");
		this.threadId = threadId;
	}
	/**
	* Socket URL derives from the currently-bound thread so a single adapter
	* can follow {@link setThreadId} re-binds; the next {@link open} connects
	* to the new thread. A fixed `paths.stream` string overrides the default.
	*/
	get streamUrl() {
		return resolveProtocolPath(this.paths?.stream, this.threadId, (id) => `/threads/${id}/stream/events`);
	}
	/**
	* Register a callback invoked after each successful reconnect. Used
	* by {@link ThreadStream} to re-send active `subscription.subscribe`
	* commands.
	*/
	setOnReconnected(handler) {
		this.onReconnected = handler;
	}
	async open() {
		if (this.closed) throw new Error("Protocol WebSocket transport is closed.");
		if (this.socket?.readyState === WEB_SOCKET_OPEN) return;
		if (this.socket != null) {
			this.#detachSocket(this.socket);
			this.socket = null;
		}
		this.assertBrowserSafeTransportConfig();
		const wsUrl = toWebSocketUrl(toAbsoluteUrl(this.apiUrl, this.streamUrl).toString());
		const socket = this.webSocketFactory(wsUrl);
		this.socket = socket;
		this.intentionalClose = false;
		this.#attachSocket(socket);
		await new Promise((resolve, reject) => {
			const onOpen = () => {
				cleanup();
				resolve();
			};
			const onError = () => {
				cleanup();
				reject(/* @__PURE__ */ new Error("Failed to open protocol WebSocket."));
			};
			const cleanup = () => {
				socket.removeEventListener("open", onOpen);
				socket.removeEventListener("error", onError);
			};
			socket.addEventListener("open", onOpen, { once: true });
			socket.addEventListener("error", onError, { once: true });
		});
	}
	async send(command) {
		return await this.sendCommand(command);
	}
	events() {
		const queue = this.queue;
		return { [Symbol.asyncIterator]: () => ({
			next: async () => await queue.shift(),
			return: async () => {
				queue.close();
				return {
					done: true,
					value: void 0
				};
			}
		}) };
	}
	async close() {
		if (this.closed) return;
		this.closed = true;
		this.intentionalClose = true;
		for (const { reject } of this.pending.values()) reject(/* @__PURE__ */ new Error("Protocol WebSocket connection closed."));
		this.pending.clear();
		this.queue.close();
		const socket = this.socket;
		this.socket = null;
		if (!socket) return;
		this.#detachSocket(socket);
		await new Promise((resolve) => {
			if (socket.readyState === WEB_SOCKET_CLOSED) {
				resolve();
				return;
			}
			const onClose = () => {
				socket.removeEventListener("close", onClose);
				resolve();
			};
			socket.addEventListener("close", onClose, { once: true });
			if (socket.readyState === WEB_SOCKET_OPEN || socket.readyState === WEB_SOCKET_CONNECTING) socket.close();
			else resolve();
		});
	}
	assertBrowserSafeTransportConfig() {
		if (hasHeaders(this.defaultHeaders) || this.onRequest != null) throw new Error("Browser WebSocket protocol transport does not support defaultHeaders or onRequest hooks. Supply a custom protocolWebSocketFactory if you need custom WebSocket setup.");
	}
	async sendCommand(command) {
		let socket = this.socket;
		if (this.reconnectInFlight != null && (socket == null || socket.readyState !== WEB_SOCKET_OPEN)) {
			await this.reconnectInFlight.catch(() => void 0);
			socket = this.socket;
		}
		if (socket == null || socket.readyState !== WEB_SOCKET_OPEN) throw new Error("Protocol WebSocket is not open.");
		return await new Promise((resolve, reject) => {
			this.pending.set(command.id, {
				resolve,
				reject
			});
			try {
				socket.send(JSON.stringify(command));
			} catch (error) {
				this.pending.delete(command.id);
				reject(toError(error));
			}
		});
	}
	#attachSocket(socket) {
		socket.addEventListener("message", this.handleMessage);
		socket.addEventListener("close", this.handleClose);
		socket.addEventListener("error", this.handleSocketError);
	}
	#detachSocket(socket) {
		socket.removeEventListener("message", this.handleMessage);
		socket.removeEventListener("close", this.handleClose);
		socket.removeEventListener("error", this.handleSocketError);
	}
	handleMessage = (event) => {
		let payload;
		try {
			payload = JSON.parse(String(event.data));
		} catch {
			return;
		}
		if (isRecord(payload) && typeof payload.id === "number" && (payload.type === "success" || payload.type === "error")) {
			const pending = this.pending.get(payload.id);
			if (pending) {
				this.pending.delete(payload.id);
				pending.resolve(payload);
			}
			return;
		}
		if (isRecord(payload) && payload.type === "event") this.queue.push(payload);
	};
	handleClose = () => {
		const socket = this.socket;
		if (socket != null) this.#detachSocket(socket);
		this.socket = null;
		if (this.intentionalClose || this.closed) {
			this.queue.close();
			return;
		}
		this.#handleUnexpectedDisconnect(/* @__PURE__ */ new Error("Protocol WebSocket closed unexpectedly."));
	};
	handleSocketError = () => {
		if (this.closed || this.intentionalClose) return;
		this.#handleUnexpectedDisconnect(/* @__PURE__ */ new Error("Protocol WebSocket encountered an error."));
	};
	#handleUnexpectedDisconnect(cause) {
		const error = toError(cause);
		for (const { reject } of this.pending.values()) reject(error);
		this.pending.clear();
		if (this.maxReconnectAttempts <= 0) {
			this.queue.close(error);
			return;
		}
		this.#scheduleReconnect(cause);
	}
	#scheduleReconnect(cause) {
		if (this.closed || this.intentionalClose) return;
		if (this.reconnectInFlight != null) return;
		this.reconnectInFlight = this.#runReconnectLoop(cause).finally(() => {
			this.reconnectInFlight = null;
		});
	}
	async #runReconnectLoop(initialCause) {
		let lastError = initialCause;
		for (let attempt = 1; attempt <= this.maxReconnectAttempts; attempt += 1) {
			if (this.closed || this.intentionalClose) return;
			this.onReconnect?.({
				attempt,
				cause: lastError
			});
			const delay = this.reconnectDelayMs(attempt);
			if (delay > 0) await new Promise((resolve) => {
				setTimeout(resolve, delay);
			});
			if (this.closed || this.intentionalClose) return;
			try {
				await this.open();
				if (this.onReconnected) await this.onReconnected();
				return;
			} catch (error) {
				lastError = error;
			}
		}
		this.queue.close(new MaxWebSocketReconnectAttemptsError(this.maxReconnectAttempts, lastError));
	}
};
//#endregion
//#region node_modules/@langchain/langgraph-sdk/dist/client/assistants/index.js
var AssistantsClient = class extends BaseClient {
	/**
	* Get an assistant by ID.
	*
	* @param assistantId The ID of the assistant.
	* @returns Assistant
	*/
	async get(assistantId, options) {
		return this.fetch(`/assistants/${assistantId}`, { signal: options?.signal });
	}
	/**
	* Get the JSON representation of the graph assigned to a runnable
	* @param assistantId The ID of the assistant.
	* @param options.xray Whether to include subgraphs in the serialized graph representation. If an integer value is provided, only subgraphs with a depth less than or equal to the value will be included.
	* @returns Serialized graph
	*/
	async getGraph(assistantId, options) {
		return this.fetch(`/assistants/${assistantId}/graph`, {
			params: { xray: options?.xray },
			signal: options?.signal
		});
	}
	/**
	* Get the state and config schema of the graph assigned to a runnable
	* @param assistantId The ID of the assistant.
	* @returns Graph schema
	*/
	async getSchemas(assistantId, options) {
		return this.fetch(`/assistants/${assistantId}/schemas`, { signal: options?.signal });
	}
	/**
	* Get the schemas of an assistant by ID.
	*
	* @param assistantId The ID of the assistant to get the schema of.
	* @param options Additional options for getting subgraphs, such as namespace or recursion extraction.
	* @returns The subgraphs of the assistant.
	*/
	async getSubgraphs(assistantId, options) {
		if (options?.namespace) return this.fetch(`/assistants/${assistantId}/subgraphs/${options.namespace}`, {
			params: { recurse: options?.recurse },
			signal: options?.signal
		});
		return this.fetch(`/assistants/${assistantId}/subgraphs`, {
			params: { recurse: options?.recurse },
			signal: options?.signal
		});
	}
	/**
	* Create a new assistant.
	* @param payload Payload for creating an assistant.
	* @returns The created assistant.
	*/
	async create(payload) {
		return this.fetch("/assistants", {
			method: "POST",
			json: {
				graph_id: payload.graphId,
				config: payload.config,
				context: payload.context,
				metadata: payload.metadata,
				assistant_id: payload.assistantId,
				if_exists: payload.ifExists,
				name: payload.name,
				description: payload.description
			},
			signal: payload.signal
		});
	}
	/**
	* Update an assistant.
	* @param assistantId ID of the assistant.
	* @param payload Payload for updating the assistant.
	* @returns The updated assistant.
	*/
	async update(assistantId, payload) {
		return this.fetch(`/assistants/${assistantId}`, {
			method: "PATCH",
			json: {
				graph_id: payload.graphId,
				config: payload.config,
				context: payload.context,
				metadata: payload.metadata,
				name: payload.name,
				description: payload.description
			},
			signal: payload.signal
		});
	}
	/**
	* Delete an assistant.
	*
	* @param assistantId ID of the assistant.
	* @param deleteThreads If true, delete all threads with `metadata.assistant_id` equal to `assistantId`. Defaults to false.
	*/
	async delete(assistantId, options) {
		return this.fetch(`/assistants/${assistantId}?delete_threads=${options?.deleteThreads ?? false}`, {
			method: "DELETE",
			signal: options?.signal
		});
	}
	async search(query) {
		const json = {
			graph_id: query?.graphId ?? void 0,
			name: query?.name ?? void 0,
			metadata: query?.metadata ?? void 0,
			limit: query?.limit ?? 10,
			offset: query?.offset ?? 0,
			sort_by: query?.sortBy ?? void 0,
			sort_order: query?.sortOrder ?? void 0,
			select: query?.select ?? void 0
		};
		const [assistants, response] = await this.fetch("/assistants/search", {
			method: "POST",
			json,
			withResponse: true,
			signal: query?.signal
		});
		if (query?.includePagination) return {
			assistants,
			next: response.headers.get("X-Pagination-Next")
		};
		return assistants;
	}
	/**
	* Count assistants matching filters.
	*
	* @param query.metadata Metadata to filter by. Exact match for each key/value.
	* @param query.graphId Optional graph id to filter by.
	* @param query.name Optional name to filter by.
	* @returns Number of assistants matching the criteria.
	*/
	async count(query) {
		return this.fetch(`/assistants/count`, {
			method: "POST",
			json: {
				metadata: query?.metadata ?? void 0,
				graph_id: query?.graphId ?? void 0,
				name: query?.name ?? void 0
			},
			signal: query?.signal
		});
	}
	/**
	* List all versions of an assistant.
	*
	* @param assistantId ID of the assistant.
	* @returns List of assistant versions.
	*/
	async getVersions(assistantId, payload) {
		return this.fetch(`/assistants/${assistantId}/versions`, {
			method: "POST",
			json: {
				metadata: payload?.metadata ?? void 0,
				limit: payload?.limit ?? 10,
				offset: payload?.offset ?? 0
			},
			signal: payload?.signal
		});
	}
	/**
	* Change the version of an assistant.
	*
	* @param assistantId ID of the assistant.
	* @param version The version to change to.
	* @returns The updated assistant.
	*/
	async setLatest(assistantId, version, options) {
		return this.fetch(`/assistants/${assistantId}/latest`, {
			method: "POST",
			json: { version },
			signal: options?.signal
		});
	}
};
//#endregion
//#region node_modules/@langchain/langgraph-sdk/dist/client/threads/index.js
var ThreadsClient = class extends BaseClient {
	/**
	* Get a thread by ID.
	*
	* @param threadId ID of the thread.
	* @returns The thread.
	*/
	async get(threadId, options) {
		return this.fetch(`/threads/${threadId}`, {
			params: { include: options?.include ?? void 0 },
			signal: options?.signal
		});
	}
	/**
	* Create a new thread.
	*
	* @param payload Payload for creating a thread.
	* @returns The created thread.
	*/
	async create(payload) {
		const ttlPayload = typeof payload?.ttl === "number" ? {
			ttl: payload.ttl,
			strategy: "delete"
		} : payload?.ttl;
		return this.fetch(`/threads`, {
			method: "POST",
			json: {
				metadata: {
					...payload?.metadata,
					graph_id: payload?.graphId
				},
				thread_id: payload?.threadId,
				if_exists: payload?.ifExists,
				supersteps: payload?.supersteps?.map((s) => ({ updates: s.updates.map((u) => ({
					values: u.values,
					command: u.command,
					as_node: u.asNode
				})) })),
				ttl: ttlPayload
			},
			signal: payload?.signal
		});
	}
	/**
	* Copy an existing thread
	* @param threadId ID of the thread to be copied
	* @returns Newly copied thread
	*/
	async copy(threadId, options) {
		return this.fetch(`/threads/${threadId}/copy`, {
			method: "POST",
			signal: options?.signal
		});
	}
	async update(threadId, payload) {
		const ttlPayload = typeof payload?.ttl === "number" ? {
			ttl: payload.ttl,
			strategy: "delete"
		} : payload?.ttl;
		return this.fetch(`/threads/${threadId}`, {
			method: "PATCH",
			headers: payload?.returnMinimal ? { Prefer: "return=minimal" } : void 0,
			json: {
				metadata: payload?.metadata,
				ttl: ttlPayload
			},
			signal: payload?.signal
		});
	}
	/**
	* Delete a thread.
	*
	* @param threadId ID of the thread.
	*/
	async delete(threadId, options) {
		return this.fetch(`/threads/${threadId}`, {
			method: "DELETE",
			signal: options?.signal
		});
	}
	/**
	* Prune threads by ID. The 'delete' strategy removes threads entirely.
	* The 'keep_latest' strategy prunes old checkpoints but keeps threads
	* and their latest state.
	*
	* @param threadIds List of thread IDs to prune.
	* @param options Additional options for pruning.
	* @param options.strategy The prune strategy. Defaults to 'delete'.
	* @param options.signal Signal to abort the request.
	* @returns An object containing `pruned_count`.
	*/
	async prune(threadIds, options) {
		return this.fetch("/threads/prune", {
			method: "POST",
			json: {
				thread_ids: threadIds,
				strategy: options?.strategy ?? "delete"
			},
			signal: options?.signal
		});
	}
	/**
	* List threads
	*
	* @param query Query options
	* @returns List of threads
	*/
	async search(query) {
		return this.fetch("/threads/search", {
			method: "POST",
			json: {
				metadata: query?.metadata ?? void 0,
				ids: query?.ids ?? void 0,
				limit: query?.limit ?? 10,
				offset: query?.offset ?? 0,
				status: query?.status,
				sort_by: query?.sortBy,
				sort_order: query?.sortOrder,
				select: query?.select ?? void 0,
				values: query?.values ?? void 0,
				extract: query?.extract ?? void 0
			},
			signal: query?.signal
		});
	}
	/**
	* Count threads matching filters.
	*
	* @param query.metadata Thread metadata to filter on.
	* @param query.values State values to filter on.
	* @param query.status Thread status to filter on.
	* @returns Number of threads matching the criteria.
	*/
	async count(query) {
		return this.fetch(`/threads/count`, {
			method: "POST",
			json: {
				metadata: query?.metadata ?? void 0,
				values: query?.values ?? void 0,
				status: query?.status ?? void 0
			},
			signal: query?.signal
		});
	}
	/**
	* Get state for a thread.
	*
	* @param threadId ID of the thread.
	* @returns Thread state.
	*/
	async getState(threadId, checkpoint, options) {
		if (checkpoint != null) {
			if (typeof checkpoint !== "string") return this.fetch(`/threads/${threadId}/state/checkpoint`, {
				method: "POST",
				json: {
					checkpoint,
					subgraphs: options?.subgraphs
				},
				signal: options?.signal
			});
			return this.fetch(`/threads/${threadId}/state/${checkpoint}`, {
				params: { subgraphs: options?.subgraphs },
				signal: options?.signal
			});
		}
		return this.fetch(`/threads/${threadId}/state`, {
			params: { subgraphs: options?.subgraphs },
			signal: options?.signal,
			dedupe: true
		});
	}
	/**
	* Add state to a thread.
	*
	* @param threadId The ID of the thread.
	* @returns
	*/
	async updateState(threadId, options) {
		return this.fetch(`/threads/${threadId}/state`, {
			method: "POST",
			json: {
				values: options.values,
				checkpoint: options.checkpoint,
				checkpoint_id: options.checkpointId,
				as_node: options?.asNode
			},
			signal: options?.signal
		});
	}
	/**
	* Patch the metadata of a thread.
	*
	* @param threadIdOrConfig Thread ID or config to patch the state of.
	* @param metadata Metadata to patch the state with.
	*/
	async patchState(threadIdOrConfig, metadata, options) {
		let threadId;
		if (typeof threadIdOrConfig !== "string") {
			if (typeof threadIdOrConfig.configurable?.thread_id !== "string") throw new Error("Thread ID is required when updating state with a config.");
			threadId = threadIdOrConfig.configurable.thread_id;
		} else threadId = threadIdOrConfig;
		return this.fetch(`/threads/${threadId}/state`, {
			method: "PATCH",
			json: { metadata },
			signal: options?.signal
		});
	}
	/**
	* Get all past states for a thread.
	*
	* @param threadId ID of the thread.
	* @param options Additional options.
	* @returns List of thread states.
	*/
	async getHistory(threadId, options) {
		return this.fetch(`/threads/${threadId}/history`, {
			method: "POST",
			json: {
				limit: options?.limit ?? 10,
				before: options?.before,
				metadata: options?.metadata,
				checkpoint: options?.checkpoint
			},
			signal: options?.signal,
			dedupe: true
		});
	}
	async *joinStream(threadId, options) {
		yield* this.streamWithRetry({
			endpoint: `/threads/${threadId}/stream`,
			method: "GET",
			signal: options?.signal,
			headers: options?.lastEventId ? { "Last-Event-ID": options.lastEventId } : void 0,
			params: options?.streamMode ? { stream_mode: options.streamMode } : void 0
		});
	}
	stream(threadIdOrOptions, maybeOptions) {
		const { threadId, options } = typeof threadIdOrOptions === "string" ? {
			threadId: threadIdOrOptions,
			options: maybeOptions
		} : threadIdOrOptions == null ? {
			threadId: v7(),
			options: maybeOptions
		} : {
			threadId: v7(),
			options: threadIdOrOptions
		};
		const userFetch = options.fetch;
		const protocolFetch = userFetch ?? this.asyncCaller.fetch.bind(this.asyncCaller);
		let transport;
		if (options.transport != null && typeof options.transport !== "string") {
			transport = options.transport;
			transport.setThreadId?.(threadId);
		} else {
			const transportKind = options.transport ?? (this.streamProtocol === "v2-websocket" ? "websocket" : "sse");
			const maxReconnectAttempts = options.maxReconnectAttempts ?? 5;
			/**
			* Common options for both transports.
			*/
			const commonOpts = {
				apiUrl: this.apiUrl,
				threadId,
				defaultHeaders: this.defaultHeaders,
				onRequest: this.onRequest,
				maxReconnectAttempts,
				reconnectDelayMs: options.reconnectDelayMs,
				onReconnect: options.onReconnect
			};
			transport = transportKind === "websocket" ? new ProtocolWebSocketTransportAdapter({
				...commonOpts,
				webSocketFactory: options.webSocketFactory
			}) : new ProtocolSseTransportAdapter({
				...commonOpts,
				idleReconnect: options.streamIdleReconnect,
				fetch: userFetch,
				asyncCaller: userFetch ? void 0 : this.asyncCaller
			});
		}
		return new ThreadStream(transport, {
			...options,
			fetch: protocolFetch
		});
	}
};
//#endregion
//#region node_modules/@langchain/langgraph-sdk/dist/client/runs/index.js
var RunsClient = class extends BaseClient {
	/**
	* Create a run and stream the results.
	*
	* @param threadId The ID of the thread.
	* @param assistantId Assistant ID to use for this run.
	* @param payload Payload for creating a run.
	*/
	async *stream(threadId, assistantId, payload) {
		const json = {
			input: payload?.input,
			command: payload?.command,
			config: payload?.config,
			context: payload?.context,
			metadata: payload?.metadata,
			stream_mode: payload?.streamMode,
			stream_subgraphs: payload?.streamSubgraphs,
			stream_resumable: payload?.streamResumable,
			feedback_keys: payload?.feedbackKeys,
			assistant_id: assistantId,
			interrupt_before: payload?.interruptBefore,
			interrupt_after: payload?.interruptAfter,
			checkpoint: payload?.checkpoint,
			webhook: payload?.webhook,
			multitask_strategy: payload?.multitaskStrategy,
			on_completion: payload?.onCompletion,
			on_disconnect: payload?.onDisconnect,
			after_seconds: payload?.afterSeconds,
			if_not_exists: payload?.ifNotExists,
			checkpoint_during: payload?.checkpointDuring,
			durability: payload?.durability
		};
		yield* this.streamWithRetry({
			endpoint: threadId == null ? `/runs/stream` : `/threads/${threadId}/runs/stream`,
			method: "POST",
			json,
			signal: payload?.signal,
			idleReconnect: payload?.streamIdleReconnect,
			onInitialResponse: (response) => {
				const runMetadata = getRunMetadataFromResponse(response);
				if (runMetadata) payload?.onRunCreated?.(runMetadata);
			}
		});
	}
	/**
	* Create a run.
	*
	* @param threadId The ID of the thread.
	* @param assistantId Assistant ID to use for this run.
	* @param payload Payload for creating a run.
	* @returns The created run.
	*/
	async create(threadId, assistantId, payload) {
		const json = {
			input: payload?.input,
			command: payload?.command,
			config: payload?.config,
			context: payload?.context,
			metadata: payload?.metadata,
			stream_mode: payload?.streamMode,
			stream_subgraphs: payload?.streamSubgraphs,
			stream_resumable: payload?.streamResumable,
			feedback_keys: payload?.feedbackKeys,
			assistant_id: assistantId,
			interrupt_before: payload?.interruptBefore,
			interrupt_after: payload?.interruptAfter,
			webhook: payload?.webhook,
			checkpoint: payload?.checkpoint,
			checkpoint_id: payload?.checkpointId,
			multitask_strategy: payload?.multitaskStrategy,
			after_seconds: payload?.afterSeconds,
			if_not_exists: payload?.ifNotExists,
			checkpoint_during: payload?.checkpointDuring,
			durability: payload?.durability,
			on_completion: payload?.onCompletion,
			langsmith_tracer: payload?._langsmithTracer ? {
				project_name: payload?._langsmithTracer?.projectName,
				example_id: payload?._langsmithTracer?.exampleId
			} : void 0
		};
		const endpoint = threadId === null ? "/runs" : `/threads/${threadId}/runs`;
		const [run, response] = await this.fetch(endpoint, {
			method: "POST",
			json,
			signal: payload?.signal,
			withResponse: true
		});
		const runMetadata = getRunMetadataFromResponse(response);
		if (runMetadata) payload?.onRunCreated?.(runMetadata);
		return run;
	}
	/**
	* Create a batch of stateless background runs.
	*
	* @param payloads An array of payloads for creating runs.
	* @returns An array of created runs.
	*/
	async createBatch(payloads, options) {
		const filteredPayloads = payloads.map((payload) => ({
			...payload,
			assistant_id: payload.assistantId
		})).map((payload) => {
			return Object.fromEntries(Object.entries(payload).filter(([_, v]) => v !== void 0));
		});
		return this.fetch("/runs/batch", {
			method: "POST",
			json: filteredPayloads,
			signal: options?.signal
		});
	}
	/**
	* Create a run and wait for it to complete.
	*
	* @param threadId The ID of the thread.
	* @param assistantId Assistant ID to use for this run.
	* @param payload Payload for creating a run.
	* @returns The last values chunk of the thread.
	*/
	async wait(threadId, assistantId, payload) {
		const json = {
			input: payload?.input,
			command: payload?.command,
			config: payload?.config,
			context: payload?.context,
			metadata: payload?.metadata,
			assistant_id: assistantId,
			interrupt_before: payload?.interruptBefore,
			interrupt_after: payload?.interruptAfter,
			checkpoint: payload?.checkpoint,
			checkpoint_id: payload?.checkpointId,
			webhook: payload?.webhook,
			multitask_strategy: payload?.multitaskStrategy,
			on_completion: payload?.onCompletion,
			on_disconnect: payload?.onDisconnect,
			after_seconds: payload?.afterSeconds,
			if_not_exists: payload?.ifNotExists,
			checkpoint_during: payload?.checkpointDuring,
			durability: payload?.durability,
			langsmith_tracer: payload?._langsmithTracer ? {
				project_name: payload?._langsmithTracer?.projectName,
				example_id: payload?._langsmithTracer?.exampleId
			} : void 0
		};
		const endpoint = threadId == null ? `/runs/wait` : `/threads/${threadId}/runs/wait`;
		const [run, response] = await this.fetch(endpoint, {
			method: "POST",
			json,
			timeoutMs: null,
			signal: payload?.signal,
			withResponse: true
		});
		const runMetadata = getRunMetadataFromResponse(response);
		if (runMetadata) payload?.onRunCreated?.(runMetadata);
		if ((payload?.raiseError !== void 0 ? payload.raiseError : true) && "__error__" in run && typeof run.__error__ === "object" && run.__error__ && "error" in run.__error__ && "message" in run.__error__) throw new Error(`${run.__error__?.error}: ${run.__error__?.message}`);
		return run;
	}
	/**
	* List all runs for a thread.
	*
	* @param threadId The ID of the thread.
	* @param options Filtering and pagination options.
	* @returns List of runs.
	*/
	async list(threadId, options) {
		return this.fetch(`/threads/${threadId}/runs`, {
			params: {
				limit: options?.limit ?? 10,
				offset: options?.offset ?? 0,
				status: options?.status ?? void 0,
				select: options?.select ?? void 0
			},
			signal: options?.signal
		});
	}
	/**
	* Get a run by ID.
	*
	* @param threadId The ID of the thread.
	* @param runId The ID of the run.
	* @returns The run.
	*/
	async get(threadId, runId, options) {
		return this.fetch(`/threads/${threadId}/runs/${runId}`, { signal: options?.signal });
	}
	/**
	* Cancel a run.
	*
	* @param threadId The ID of the thread.
	* @param runId The ID of the run.
	* @param wait Whether to block when canceling
	* @param action Action to take when cancelling the run. Possible values are `interrupt` or `rollback`. Default is `interrupt`.
	* @returns
	*/
	async cancel(threadId, runId, wait = false, action = "interrupt", options = {}) {
		return this.fetch(`/threads/${threadId}/runs/${runId}/cancel`, {
			method: "POST",
			params: {
				wait: wait ? "1" : "0",
				action
			},
			signal: options?.signal
		});
	}
	/**
	* Cancel one or more runs.
	*
	* @param options Options for cancelling runs.
	* @returns
	*/
	async cancelMany(options) {
		return this.fetch(`/runs/cancel`, {
			method: "POST",
			json: {
				thread_id: options.threadId,
				run_ids: options.runIds,
				status: options.status
			},
			params: { action: options.action },
			signal: options.signal
		});
	}
	/**
	* Block until a run is done.
	*
	* @param threadId The ID of the thread.
	* @param runId The ID of the run.
	* @returns
	*/
	async join(threadId, runId, options) {
		return this.fetch(`/threads/${threadId}/runs/${runId}/join`, {
			timeoutMs: null,
			params: { cancel_on_disconnect: options?.cancelOnDisconnect ? "1" : "0" },
			signal: options?.signal
		});
	}
	/**
	* Stream output from a run in real-time, until the run is done.
	*
	* @param threadId The ID of the thread.
	* @param runId The ID of the run.
	* @param options Additional options for controlling the stream behavior.
	* @returns An async generator yielding stream parts.
	*/
	async *joinStream(threadId, runId, options) {
		const opts = typeof options === "object" && options != null && options instanceof AbortSignal ? { signal: options } : options;
		yield* this.streamWithRetry({
			endpoint: threadId != null ? `/threads/${threadId}/runs/${runId}/stream` : `/runs/${runId}/stream`,
			method: "GET",
			signal: opts?.signal,
			idleReconnect: opts?.streamIdleReconnect,
			headers: opts?.lastEventId ? { "Last-Event-ID": opts.lastEventId } : void 0,
			params: {
				cancel_on_disconnect: opts?.cancelOnDisconnect ? "1" : "0",
				stream_mode: opts?.streamMode
			}
		});
	}
	/**
	* Delete a run.
	*
	* @param threadId The ID of the thread.
	* @param runId The ID of the run.
	* @returns
	*/
	async delete(threadId, runId, options) {
		return this.fetch(`/threads/${threadId}/runs/${runId}`, {
			method: "DELETE",
			signal: options?.signal
		});
	}
};
//#endregion
//#region node_modules/@langchain/langgraph-sdk/dist/client/crons/index.js
var CronsClient = class extends BaseClient {
	/**
	*
	* @param threadId The ID of the thread.
	* @param assistantId Assistant ID to use for this cron job.
	* @param payload Payload for creating a cron job.
	* @returns The created background run.
	*/
	async createForThread(threadId, assistantId, payload) {
		const json = {
			schedule: payload?.schedule,
			input: payload?.input,
			config: payload?.config,
			context: payload?.context,
			metadata: payload?.metadata,
			assistant_id: assistantId,
			interrupt_before: payload?.interruptBefore,
			interrupt_after: payload?.interruptAfter,
			webhook: payload?.webhook,
			multitask_strategy: payload?.multitaskStrategy,
			checkpoint_during: payload?.checkpointDuring,
			durability: payload?.durability,
			enabled: payload?.enabled,
			timezone: payload?.timezone,
			stream_mode: payload?.streamMode,
			stream_subgraphs: payload?.streamSubgraphs,
			stream_resumable: payload?.streamResumable,
			end_time: payload?.endTime,
			on_run_completed: payload?.onRunCompleted
		};
		return this.fetch(`/threads/${threadId}/runs/crons`, {
			method: "POST",
			json,
			signal: payload?.signal
		});
	}
	/**
	*
	* @param assistantId Assistant ID to use for this cron job.
	* @param payload Payload for creating a cron job.
	* @returns
	*/
	async create(assistantId, payload) {
		const json = {
			schedule: payload?.schedule,
			input: payload?.input,
			config: payload?.config,
			context: payload?.context,
			metadata: payload?.metadata,
			assistant_id: assistantId,
			interrupt_before: payload?.interruptBefore,
			interrupt_after: payload?.interruptAfter,
			webhook: payload?.webhook,
			on_run_completed: payload?.onRunCompleted,
			multitask_strategy: payload?.multitaskStrategy,
			checkpoint_during: payload?.checkpointDuring,
			durability: payload?.durability,
			enabled: payload?.enabled,
			timezone: payload?.timezone,
			stream_mode: payload?.streamMode,
			stream_subgraphs: payload?.streamSubgraphs,
			stream_resumable: payload?.streamResumable,
			end_time: payload?.endTime
		};
		return this.fetch(`/runs/crons`, {
			method: "POST",
			json,
			signal: payload?.signal
		});
	}
	/**
	* Update a cron job by ID.
	*
	* @param cronId The cron ID to update.
	* @param payload Payload for updating a cron job.
	* @returns The updated cron job.
	* ```
	*/
	async update(cronId, payload) {
		const json = {
			schedule: payload?.schedule,
			timezone: payload?.timezone,
			end_time: payload?.endTime,
			input: payload?.input,
			metadata: payload?.metadata,
			config: payload?.config,
			context: payload?.context,
			webhook: payload?.webhook,
			interrupt_before: payload?.interruptBefore,
			interrupt_after: payload?.interruptAfter,
			on_run_completed: payload?.onRunCompleted,
			enabled: payload?.enabled,
			stream_mode: payload?.streamMode,
			stream_subgraphs: payload?.streamSubgraphs,
			stream_resumable: payload?.streamResumable,
			durability: payload?.durability
		};
		return this.fetch(`/runs/crons/${cronId}`, {
			method: "PATCH",
			json,
			signal: payload?.signal
		});
	}
	/**
	* Delete a cron job by ID.
	*
	* @param cronId Cron ID of Cron job to delete.
	* @param options Optional parameters for the request.
	*/
	async delete(cronId, options) {
		await this.fetch(`/runs/crons/${cronId}`, {
			method: "DELETE",
			signal: options?.signal
		});
	}
	/**
	*
	* @param query Query options.
	* @param query.metadata Metadata to filter by. Exact match filter for each KV pair.
	*   Available in Agent Server version 0.9.0 and later.
	* @returns List of crons.
	*/
	async search(query) {
		return this.fetch("/runs/crons/search", {
			method: "POST",
			json: {
				assistant_id: query?.assistantId ?? void 0,
				thread_id: query?.threadId ?? void 0,
				enabled: query?.enabled ?? void 0,
				limit: query?.limit ?? 10,
				offset: query?.offset ?? 0,
				sort_by: query?.sortBy ?? void 0,
				sort_order: query?.sortOrder ?? void 0,
				select: query?.select ?? void 0,
				metadata: query?.metadata ?? void 0
			},
			signal: query?.signal
		});
	}
	/**
	* Count cron jobs matching filters.
	*
	* @param query.assistantId Assistant ID to filter by.
	* @param query.threadId Thread ID to filter by.
	* @param query.metadata Metadata to filter by. Exact match filter for each KV pair.
	*   Available in Agent Server version 0.9.0 and later.
	* @returns Number of cron jobs matching the criteria.
	*/
	async count(query) {
		return this.fetch(`/runs/crons/count`, {
			method: "POST",
			json: {
				assistant_id: query?.assistantId ?? void 0,
				thread_id: query?.threadId ?? void 0,
				metadata: query?.metadata ?? void 0
			},
			signal: query?.signal
		});
	}
};
//#endregion
//#region node_modules/@langchain/langgraph-sdk/dist/client/store/index.js
var StoreClient = class extends BaseClient {
	/**
	* Store or update an item.
	*
	* @param namespace A list of strings representing the namespace path.
	* @param key The unique identifier for the item within the namespace.
	* @param value A dictionary containing the item's data.
	* @param options.index Controls search indexing - null (use defaults), false (disable), or list of field paths to index.
	* @param options.ttl Optional time-to-live in minutes for the item, or null for no expiration.
	* @returns Promise<void>
	*/
	async putItem(namespace, key, value, options) {
		namespace.forEach((label) => {
			if (label.includes(".")) throw new Error(`Invalid namespace label '${label}'. Namespace labels cannot contain periods ('.')`);
		});
		const payload = {
			namespace,
			key,
			value,
			index: options?.index,
			ttl: options?.ttl
		};
		return this.fetch("/store/items", {
			method: "PUT",
			json: payload,
			signal: options?.signal
		});
	}
	/**
	* Retrieve a single item.
	*
	* @param namespace A list of strings representing the namespace path.
	* @param key The unique identifier for the item.
	* @param options.refreshTtl Whether to refresh the TTL on this read operation.
	* @returns Promise<Item>
	*/
	async getItem(namespace, key, options) {
		namespace.forEach((label) => {
			if (label.includes(".")) throw new Error(`Invalid namespace label '${label}'. Namespace labels cannot contain periods ('.')`);
		});
		const params = {
			namespace: namespace.join("."),
			key
		};
		if (options?.refreshTtl !== void 0) params.refresh_ttl = options.refreshTtl;
		const response = await this.fetch("/store/items", {
			params,
			signal: options?.signal
		});
		return response ? {
			...response,
			createdAt: response.created_at,
			updatedAt: response.updated_at
		} : null;
	}
	/**
	* Delete an item.
	*
	* @param namespace A list of strings representing the namespace path.
	* @param key The unique identifier for the item.
	* @returns Promise<void>
	*/
	async deleteItem(namespace, key, options) {
		namespace.forEach((label) => {
			if (label.includes(".")) throw new Error(`Invalid namespace label '${label}'. Namespace labels cannot contain periods ('.')`);
		});
		return this.fetch("/store/items", {
			method: "DELETE",
			json: {
				namespace,
				key
			},
			signal: options?.signal
		});
	}
	/**
	* Search for items within a namespace prefix.
	*
	* @param namespacePrefix List of strings representing the namespace prefix.
	* @param options Search options including filter, pagination, and query.
	* @returns Promise<SearchItemsResponse>
	*/
	async searchItems(namespacePrefix, options) {
		const payload = {
			namespace_prefix: namespacePrefix,
			filter: options?.filter,
			limit: options?.limit ?? 10,
			offset: options?.offset ?? 0,
			query: options?.query,
			refresh_ttl: options?.refreshTtl
		};
		return { items: (await this.fetch("/store/items/search", {
			method: "POST",
			json: payload,
			signal: options?.signal
		})).items.map((item) => ({
			...item,
			createdAt: item.created_at,
			updatedAt: item.updated_at
		})) };
	}
	/**
	* List namespaces with optional match conditions.
	*
	* @param options Filtering and pagination options for namespaces.
	* @returns Promise<ListNamespaceResponse>
	*/
	async listNamespaces(options) {
		const payload = {
			prefix: options?.prefix,
			suffix: options?.suffix,
			max_depth: options?.maxDepth,
			limit: options?.limit ?? 100,
			offset: options?.offset ?? 0
		};
		return this.fetch("/store/namespaces", {
			method: "POST",
			json: payload,
			signal: options?.signal
		});
	}
};
//#endregion
//#region node_modules/@langchain/langgraph-sdk/dist/client/ui-internal/index.js
var UiClient = class UiClient extends BaseClient {
	static promiseCache = {};
	static getOrCached(key, fn) {
		if (UiClient.promiseCache[key] != null) return UiClient.promiseCache[key];
		const promise = fn();
		UiClient.promiseCache[key] = promise;
		return promise;
	}
	async getComponent(assistantId, agentName) {
		return UiClient.getOrCached(`${this.apiUrl}-${assistantId}-${agentName}`, async () => {
			let [url, init] = this.prepareFetchOptions(`/ui/${assistantId}`, {
				headers: {
					Accept: "text/html",
					"Content-Type": "application/json"
				},
				method: "POST",
				json: { name: agentName }
			});
			if (this.onRequest != null) init = await this.onRequest(url, init);
			return (await this.asyncCaller.fetch(url.toString(), init)).text();
		});
	}
};
//#endregion
//#region node_modules/@langchain/langgraph-sdk/dist/client/index.js
var Client = class {
	/**
	* The client for interacting with assistants.
	*/
	assistants;
	/**
	* The client for interacting with threads.
	*/
	threads;
	/**
	* The client for interacting with runs.
	*/
	runs;
	/**
	* The client for interacting with cron runs.
	*/
	crons;
	/**
	* The client for interacting with the KV store.
	*/
	store;
	/**
	* The client for interacting with the UI.
	* @internal Used by LoadExternalComponent and the API might change in the future.
	*/
	"~ui";
	/**
	* @internal Used to obtain a stable key representing the client.
	*/
	"~configHash";
	constructor(config) {
		this["~configHash"] = JSON.stringify({
			apiUrl: config?.apiUrl,
			apiKey: config?.apiKey,
			timeoutMs: config?.timeoutMs,
			defaultHeaders: config?.defaultHeaders,
			streamProtocol: config?.streamProtocol,
			maxConcurrency: config?.callerOptions?.maxConcurrency,
			maxRetries: config?.callerOptions?.maxRetries,
			callbacks: {
				onFailedResponseHook: config?.callerOptions?.onFailedResponseHook != null,
				onRequest: config?.onRequest != null,
				fetch: config?.callerOptions?.fetch != null
			}
		});
		this.assistants = new AssistantsClient(config);
		this.threads = new ThreadsClient(config);
		this.runs = new RunsClient(config);
		this.crons = new CronsClient(config);
		this.store = new StoreClient(config);
		this["~ui"] = new UiClient(config);
	}
};
Object.freeze([]);
//#endregion
export { Client as t };
