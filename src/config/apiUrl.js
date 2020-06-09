import * as log from '../utils/logger';

const ciUrl = require('./url/ci.json');
const stageUrl = require('./url/stage.json');
const stressUrl = require('./url/stress.json');
const prodUrl = require('./url/prod.json');


/**
 * Function to get url for api/external system cals.
 */
export default function url() {
    let url={};
    
    if(process.env.NODE_ENV===undefined)
    {
        return ciUrl;
    }
    
    switch (process.env.NODE_ENV.toUpperCase()) {
        case "CI": {
            url= ciUrl;
            break;
        }
        case "STRESS": {
            url= stressUrl;
            break;
        }
        case "STAGE": {
            url= stageUrl;
            break;
        }
        case "PROD": {
            url = prodUrl;
            break;
        }
        default: {
           log.error("Invalid ENV:"+process.env.NODE_ENV);
           break;
        }

    }
    
return url;
}