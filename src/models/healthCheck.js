//import * as db from "../utils/spanner";
import * as log from '../utils/logger';
import * as tracer from '../utils/tracer';

/**
 * Health Check model.
 */
class healthCheck {


    /**
     * Method to get value.
     * 
     * @param   {Object}    parentSpan
     */
    async get(parentSpan) {
        try {
            const span = tracer.startSpan("Model - Health Check - Get", parentSpan);
            log.info("Model - Health Check - Get - Start");
            span.setTag("Model- Health Check -get");

            const result = {Status:"Up"}

            span.finish();
            log.info("Model - Health Check - Get - End");

            return result[0];
        } catch (err) {
            log.error(err);
            return {
                errorMsg: "Internal Server Error",
                data: {}
            };
        }
    }
}

export default healthCheck;