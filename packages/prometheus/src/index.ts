import { Registry, Counter, Histogram, Gauge, collectDefaultMetrics } from 'prom-client';

// Create a Registry to register the metrics
const metricsRegistry = new Registry();

// Add a default label which is added to all metrics
metricsRegistry.setDefaultLabels({
  app: 'instyle-ecommerce'
});

// Enable the collection of default metrics
collectDefaultMetrics({ register: metricsRegistry });

// Define custom metrics
export const httpRequestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  registers: [metricsRegistry]
});

export const httpRequestTotal = new Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
  registers: [metricsRegistry]
});

export const activeConnections = new Gauge({
  name: 'active_connections',
  help: 'Number of active connections',
  registers: [metricsRegistry]
});

export const databaseConnections = new Gauge({
  name: 'database_connections',
  help: 'Number of database connections',
  registers: [metricsRegistry]
});

export { metricsRegistry };
