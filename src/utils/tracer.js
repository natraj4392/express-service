import {logger} from './logger';
import * as openTracing from 'opentracing';

const initTracer = require('jaeger-client').initTracer;
let tracer={};
const config = {
  serviceName:  process.env.NODE_ENV !== null && process.env.NODE_ENV !== undefined ? process.env.APP_NAME + "-" + process.env.NODE_ENV : 'ci',
  reporter: {
    logSpans: true,
    agentHost: "localhost",
    agentPort: 6832
  },
  sampler: {
    type: "const",
    param: 1
  }
};
const tagsData ={};

tagsData[process.env.APP_NAME]="1.0.0";

const options = {
  tags: tagsData,
  //   metrics: metrics,
  logger: logger,
};
 

/**
 * Function to initialize tracer.
 * 
 */
export function init() {
  tracer= initTracer(config, options);
  
}


/**
 * Function to get tracer
 * @returns {Object} tracer
 */
export function get() {
  return tracer;
}

/**
 * Function to erase tracer
 *
 */
export function erase() {
  tracer.close();
}


/**
 * Function to create/start span
 *
 * @param {Object} msg
 * @param {Object} childCtx
 * @param {Object} header
 */
export function startSpan(msg, header,childCtx)
{
  if(childCtx===null || childCtx === undefined)
  {
    childCtx = tracer.extract(openTracing.FORMAT_HTTP_HEADERS, header);
  }
  return tracer.startSpan(msg,{childOf:childCtx});
}
