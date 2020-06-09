import healthCheck from '../models/healthCheck';
import * as log from '../utils/logger';
import * as tracer from '../utils/tracer';

/**
 * Get Health Check value.
 *
 * @param {Object} parentSpan
 * @returns {Promise}
 */
export async function get(parentSpan) {
    try {
        const span = tracer.startSpan("Service - Health Check - Get", parentSpan);
        log.info("Service - Health Check - Get - Start");
        span.setTag("Service- Health Check - Get");
        log.info(healthCheck);
        const hcModel = new healthCheck();
        const data = await hcModel.get(span);

        log.info("health check Fetched Successfully");
        span.finish();
        log.info("Service - Health Check - Get - End");

        return data;


    } catch (err) {
        log.error(err.stack);
        return {
            errorMsg: "Internal Server Error",
            data: {}
        };
    }
}