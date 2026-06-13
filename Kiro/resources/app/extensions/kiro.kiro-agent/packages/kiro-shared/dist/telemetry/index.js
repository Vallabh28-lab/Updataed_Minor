import { h as getDefaultAttributes, b as APPLICATION_VERSION, e as isInitialized, MetricReporter, T as TelemetryNamespace } from "./definitions/index.js";
import { A, C, Feature, M, Telemetry, c, deriveUserCohort, getContentCollectionOptIn, getUserCohort, g, i, d, f, s } from "./definitions/index.js";
import { SpanStatusCode, trace, metrics } from "@opentelemetry/api";
import { T as TrustedError } from "../errors-BVoUlRsM.js";
import "path";
import "os";
import "fs";
import "vscode";
import "node-machine-id";
import { Tool, ToolRecorder, initializeToolCounters } from "@kiro/agent";
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
      ...value instanceof TrustedError ? {
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
      span.setAttributes(getDefaultAttributes());
      const result = function_(span);
      if (isPromise(result)) {
        return result.then((value) => {
          span.setStatus({ code: SpanStatusCode.OK });
          return value;
        }).catch((error) => {
          span.recordException(mapUnknownToSpanStatus(error));
          span.setStatus({
            code: SpanStatusCode.ERROR
          });
          throw error;
        }).finally(() => {
          span.end();
        });
      }
      span.setStatus({ code: SpanStatusCode.OK });
      span.end();
      return result;
    } catch (error) {
      span.recordException(mapUnknownToSpanStatus(error));
      span.setStatus({
        code: SpanStatusCode.ERROR
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
  const tracer = trace.getTracer(namespace, APPLICATION_VERSION);
  if (isInitialized()) {
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
  const meter = metrics.getMeter(namespace, APPLICATION_VERSION);
  if (isInitialized()) {
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
const ChatUIMetrics = new MetricReporter(TelemetryNamespace.Feature, "chatUI");
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
const PowersMetrics = new MetricReporter(TelemetryNamespace.Feature, "powers");
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
const ProfileStorageMetrics = new MetricReporter(TelemetryNamespace.Profiles, "ProfileStorage");
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
const McpRegistryMetrics = new MetricReporter(TelemetryNamespace.Feature, "mcpRegistry");
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
const PlatformMetrics = new MetricReporter(TelemetryNamespace.Application, "platform");
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
const ToolUsage = new MetricReporter(TelemetryNamespace.Tool, "tools");
export {
  A as APPLICATION_NAME,
  APPLICATION_VERSION,
  C as ContextPropagation,
  Feature,
  JourneyTracker,
  M as MetricNamespace,
  MetricReporter,
  Metrics,
  Telemetry,
  Tool,
  ToolRecorder,
  ToolUsage,
  c as clearUserId,
  createCounter,
  createHistogram,
  deriveUserCohort,
  getContentCollectionOptIn,
  getJourneyTracker,
  getUserCohort,
  g as getUserId,
  i as initializeBaggagePropagation,
  d as initializeTelemetry,
  initializeToolCounters,
  isInitialized,
  f as recordBashToolEvent,
  recordChatWebviewEvent,
  recordMcpRegistryEvent,
  recordMcpRegistryHistogram,
  recordMcpRegistryOutcome,
  recordPlatformEvent,
  recordPowersEvent,
  recordPowersHistogram,
  recordProfileStorageEvent,
  s as setUserId,
  startActiveSpan,
  withSpan
};
