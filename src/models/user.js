// import * as db from "../utils/spanner";
import * as log from '../utils/logger';
import * as tracer from '../utils/tracer';

/**
 * User model.
 */
class user {
    /**
     * Constructor.
     * 
     * @param {object} entity 
     */
    constructor(entity) {
        if (entity !== undefined) {
            this.name = entity.USR_NAME;

        }
    }


    /**
     * Method to get message value.
     * 
     * @param   {Object}    parentSpan
     */
    async get(parentSpan) {
        try {
            const span = tracer.startSpan("Model - User - Get", parentSpan);
            log.info("Model - User - Get - Start");
            span.setTag("Model- User -get");

            // const query = 'select * from USER';
            const result = await db.Run(query);

            span.finish();
            log.info("Model - User - Get - End");

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

export default user;