"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const telemetry_definitions_index = require("./definitions/index.cjs");
const api = require("@opentelemetry/api");
const errors = require("../errors-CHx_k7HS.cjs");
require("path");
require("os");
require("fs");
require("vscode");
require("node-machine-id");
const agent = require("@kiro/agent");
function mapUnknownToSpanStatus(value) {
  if (typeof value == "string") {
    return value;
  }
  if (typeof value === "boolean" || typeof value === "number") {
    return value.toString();
  }
  if (value instanceof Error) {
    return {
      name: value.name,
      ...value instanceof errors.TrustedError ? {
        message: value.message
      } : {}
      // message: value.message,
      // stack: value.stack,
    };
  }
  if (value === void 0) {
    return "undefined";
  }
  return JSON.stringify(value);
}
function isPromise(value) {
  return Boolean(value) && typeof value.then === "function";
}
function startActiveSpan(namespace, name, wrappedFunction) {
  return getTracer(namespace).startActiveSpan(name, wrappedFunction);
}
function withSpan(namespace, name, function_) {
  return getTracer(namespace).startActiveSpan(`${namespace}.${name}`, (span) => {
    try {
      span.setAttributes(telemetry_definitions_index.getDefaultAttributes());
      const result = function_(span);
      if (isPromise(result)) {
        return result.then((value) => {
          span.setStatus({ code: api.SpanStatusCode.OK });
          return value;
        }).catch((error) => {
          span.recordException(mapUnknownToSpanStatus(error));
          span.setStatus({
            code: api.SpanStatusCode.ERROR
          });
          throw error;
        }).finally(() => {
          span.end();
        });
      }
      span.setStatus({ code: api.SpanStatusCode.OK });
      span.end();
      return result;
    } catch (error) {
      span.recordException(mapUnknownToSpanStatus(error));
      span.setStatus({
        code: api.SpanStatusCode.ERROR
      });
      span.end();
      throw error;
    }
  });
}
const tracers = {};
function getTracer(namespace) {
  if (namespace in tracers) {
    return tracers[namespace];
  }
  const tracer = api.trace.getTracer(namespace, telemetry_definitions_index.APPLICATION_VERSION);
  if (telemetry_definitions_index.isInitialized()) {
    tracers[namespace] = tracer;
  }
  return tracer;
}
class Metrics {
  counters = /* @__PURE__ */ new Map();
  histograms = /* @__PURE__ */ new Map();
  namespace;
  meter;
  /**
   * Creates a new Metrics instance for the given telemetry namespace
   * @param namespace The telemetry namespace to use for metrics
   */
  constructor(namespace) {
    this.namespace = namespace;
    this.meter = getMeter(namespace);
  }
  /**
   * Add a count metric
   */
  addCount(name, value, attributes = {}) {
    const values = this.counters.get(name) || [];
    values.push({ value, attributes });
    this.counters.set(name, values);
  }
  /**
   * Add a histogram metric
   */
  addHistogram(name, value, attributes = {}) {
    const values = this.histograms.get(name) || [];
    values.push({ value, attributes });
    this.histograms.set(name, values);
  }
  /**
   * Flush all collected metrics to OpenTelemetry
   */
  flush() {
    for (const [name, values] of this.counters.entries()) {
      const counter = this.meter.createCounter(name);
      for (const { value, attributes } of values) {
        counter.add(value, attributes);
      }
    }
    this.counters.clear();
    for (const [name, values] of this.histograms.entries()) {
      const histogram = this.meter.createHistogram(name);
      for (const { value, attributes } of values) {
        histogram.record(value, attributes);
      }
    }
    this.histograms.clear();
  }
}
function createCounter(namespace, name, options) {
  return getMeter(namespace).createCounter(name, options);
}
function createHistogram(namespace, name, options) {
  return getMeter(namespace).createHistogram(name, options);
}
const meters = {};
function getMeter(namespace) {
  if (namespace in meters) {
    return meters[namespace];
  }
  const meter = api.metrics.getMeter(namespace, telemetry_definitions_index.APPLICATION_VERSION);
  if (telemetry_definitions_index.isInitialized()) {
    meters[namespace] = meter;
  }
  return meter;
}
const journeyTrackers = {};
function getJourneyTracker(namespace) {
  if (namespace in journeyTrackers) {
    return journeyTrackers[namespace];
  }
  const tracker = new JourneyTracker(namespace);
  journeyTrackers[namespace] = tracker;
  return tracker;
}
class JourneyTracker {
  namespace;
  activeJourneys = /* @__PURE__ */ new Map();
  /**
   * Creates a new journey tracker
   */
  constructor(namespace) {
    this.namespace = namespace;
  }
  /**
   * Starts tracking a new telemetry journey
   * @param config Configuration for the journey
   * @returns Unique journey identifier
   * @example
   * const journeyId = telemetry.startJourney({
   *   id: 'onboarding',
   *   timeoutMs: 10000,
   *   namespace: TelemetryNamespace.Core
   * });
   */
  startJourney(config) {
    const existingJourney = this.activeJourneys.get(config.id);
    if (existingJourney) {
      return existingJourney.uniqueId;
    }
    const uniqueId = `${config.id}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const timeoutId = setTimeout(() => {
      this.timeoutJourney(config.id);
    }, config.timeoutMs);
    const newContext = {
      journeyId: config.id,
      uniqueId,
      timeoutId,
      startTime: performance.now(),
      durationTracker: createHistogram(this.namespace, `journey.${config.id}.duration`, {
        unit: "milliseconds"
      }),
      metrics: new Metrics(this.namespace),
      onJourneyEnd: config.onJourneyEnd
    };
    this.activeJourneys.set(config.id, newContext);
    createCounter(this.namespace, `journey.${config.id}.started`).add(1);
    return uniqueId;
  }
  /**
   * Marks a journey as successfully completed
   * @param journeyId ID of the journey to complete
   * @param attributes Additional attributes to record with completion
   * @example
   * telemetry.completeJourney('journey-123', { outcome: 'success' });
   */
  completeJourney(journeyId, attributes = {}) {
    const journey = this.activeJourneys.get(journeyId);
    if (!journey) {
      return;
    }
    this.cleanupJourney(journeyId);
    createCounter(this.namespace, `journey.${journeyId}.completed`).add(1, {
      ...attributes
    });
  }
  /**
   * Handles journey timeout by marking the span as error and cleaning up
   * @param journeyId ID of the timed out journey
   */
  timeoutJourney(journeyId) {
    const journey = this.activeJourneys.get(journeyId);
    if (!journey) {
      return;
    }
    this.cleanupJourney(journeyId);
    createCounter(this.namespace, `journey.${journeyId}.time_out`).add(1, {});
  }
  cleanupJourney(journeyId) {
    const journey = this.activeJourneys.get(journeyId);
    if (!journey) {
      return;
    }
    if (journey.onJourneyEnd) {
      journey.onJourneyEnd(journey.metrics);
    }
    journey.durationTracker.record(performance.now() - journey.startTime);
    journey.metrics.flush();
    clearTimeout(journey.timeoutId);
    this.activeJourneys.delete(journeyId);
  }
  /**
   * Cleans up all active journeys when the tracker is disposed
   */
  dispose() {
    for (const [journeyId, journey] of this.activeJourneys) {
      this.cleanupJourney(journeyId);
      createCounter(this.namespace, `journey.${journeyId}.disposed`).add(1, {
        journeyId,
        uniqueJourneyId: journey.uniqueId
      });
    }
    this.activeJourneys.clear();
  }
}
const ChatUIMetrics = new telemetry_definitions_index.MetricReporter(telemetry_definitions_index.TelemetryNamespace.Feature, "chatUI");
function recordChatWebviewEvent(event) {
  try {
    if (event.value !== void 0) {
      ChatUIMetrics.reportHistogramMetrics({ [event.type]: event.value }, event.dimensions);
      return;
    }
    ChatUIMetrics.reportCountMetrics({ [event.type]: 1 }, event.dimensions);
  } catch {
  }
}
const PowersMetrics = new telemetry_definitions_index.MetricReporter(telemetry_definitions_index.TelemetryNamespace.Feature, "powers");
function recordPowersEvent(event) {
  try {
    PowersMetrics.reportCountMetrics({ [event.type]: 1 }, event.dimensions || {});
  } catch {
  }
}
function recordPowersHistogram(metricName, value, dimensions) {
  try {
    PowersMetrics.reportHistogramMetrics({ [metricName]: value }, dimensions || {});
  } catch {
  }
}
const ProfileStorageMetrics = new telemetry_definitions_index.MetricReporter(telemetry_definitions_index.TelemetryNamespace.Profiles, "ProfileStorage");
function recordProfileStorageEvent(event, success, errorType, dimensions) {
  const baseMetrics = {
    [`${event}Count`]: 1
  };
  if (success) {
    ProfileStorageMetrics.reportCountMetrics(
      {
        ...baseMetrics,
        [`${event}Success`]: 1,
        [`${event}Failure`]: 0
      },
      dimensions
    );
  } else {
    const errorMetrics = {
      ...baseMetrics,
      [`${event}Success`]: 0,
      [`${event}Failure`]: 1
    };
    if (errorType) {
      errorMetrics[`${event}Error.${errorType}`] = 1;
    }
    ProfileStorageMetrics.reportCountMetrics(errorMetrics, dimensions);
  }
}
const McpRegistryMetrics = new telemetry_definitions_index.MetricReporter(telemetry_definitions_index.TelemetryNamespace.Feature, "mcpRegistry");
function recordMcpRegistryEvent(event) {
  try {
    McpRegistryMetrics.reportCountMetrics({ [event.type]: 1 }, event.dimensions || {});
  } catch {
  }
}
function recordMcpRegistryOutcome(operation, success, dimensions) {
  try {
    McpRegistryMetrics.reportCountMetrics(
      {
        [`${operation}.success`]: success ? 1 : 0,
        [`${operation}.failure`]: success ? 0 : 1
      },
      dimensions || {}
    );
  } catch {
  }
}
function recordMcpRegistryHistogram(metricName, value, dimensions) {
  try {
    McpRegistryMetrics.reportHistogramMetrics({ [metricName]: value }, dimensions || {});
  } catch {
  }
}
const PlatformMetrics = new telemetry_definitions_index.MetricReporter(telemetry_definitions_index.TelemetryNamespace.Application, "platform");
function recordPlatformEvent(event) {
  try {
    if (event.metrics && Object.keys(event.metrics).length > 0) {
      PlatformMetrics.reportHistogramMetrics(event.metrics, {
        ...event.dimensions,
        platformEvent: event.eventName
      });
      return;
    }
    PlatformMetrics.reportCountMetrics({ [event.eventName]: 1 }, event.dimensions);
  } catch {
  }
}
const ToolUsage = new telemetry_definitions_index.MetricReporter(telemetry_definitions_index.TelemetryNamespace.Tool, "tools");
exports.APPLICATION_NAME = telemetry_definitions_index.APPLICATION_NAME;
exports.APPLICATION_VERSION = telemetry_definitions_index.APPLICATION_VERSION;
exports.ContextPropagation = telemetry_definitions_index.ContextPropagation;
exports.Feature = telemetry_definitions_index.Feature;
exports.MetricNamespace = telemetry_definitions_index.MetricNamespace;
exports.MetricReporter = telemetry_definitions_index.MetricReporter;
exports.Telemetry = telemetry_definitions_index.Telemetry;
exports.clearUserId = telemetry_definitions_index.clearUserId;
exports.deriveUserCohort = telemetry_definitions_index.deriveUserCohort;
exports.getContentCollectionOptIn = telemetry_definitions_index.getContentCollectionOptIn;
exports.getUserCohort = telemetry_definitions_index.getUserCohort;
exports.getUserId = telemetry_definitions_index.getUserId;
exports.initializeBaggagePropagation = telemetry_definitions_index.initializeBaggagePropagation;
exports.initializeTelemetry = telemetry_definitions_index.initializeTelemetry;
exports.isInitialized = telemetry_definitions_index.isInitialized;
exports.recordBashToolEvent = telemetry_definitions_index.recordBashToolEvent;
exports.setUserId = telemetry_definitions_index.setUserId;
Object.defineProperty(exports, "Tool", {
  enumerable: true,
  get: () => agent.Tool
});
Object.defineProperty(exports, "ToolRecorder", {
  enumerable: true,
  get: () => agent.ToolRecorder
});
Object.defineProperty(exports, "initializeToolCounters", {
  enumerable: true,
  get: () => agent.initializeToolCounters
});
exports.JourneyTracker = JourneyTracker;
exports.Metrics = Metrics;
exports.ToolUsage = ToolUsage;
exports.createCounter = createCounter;
exports.createHistogram = createHistogram;
exports.getJourneyTracker = getJourneyTracker;
exports.recordChatWebviewEvent = recordChatWebviewEvent;
exports.recordMcpRegistryEvent = recordMcpRegistryEvent;
exports.recordMcpRegistryHistogram = recordMcpRegistryHistogram;
exports.recordMcpRegistryOutcome = recordMcpRegistryOutcome;
exports.recordPlatformEvent = recordPlatformEvent;
exports.recordPowersEvent = recordPowersEvent;
exports.recordPowersHistogram = recordPowersHistogram;
exports.recordProfileStorageEvent = recordProfileStorageEvent;
exports.startActiveSpan = startActiveSpan;
exports.withSpan = withSpan;
