import HttpStatus from 'http-status-codes';
import * as hcService from '../services/healthCheckService';
import * as log from '../utils/logger';
import * as tracer from '../utils/tracer';


/**
 * Get OCF value.
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
export async function get(req, res, next) {
    try {
        const span = tracer.startSpan("Controller - Health Check - Get", req.header);
        log.info("Controller - Health Check - Get - Start");
        span.setTag("health", req.query);
        const data = await hcService.get(span);

        span.finish();
        log.info("Controller - Health Check - Get - End");
        res.json({
            staus: HttpStatus.OK,
            message: "Health Check Success",
            data: data
        });
    } catch (err) {
        log.error(err);
        next(err);
    }
}

