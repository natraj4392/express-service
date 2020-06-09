import request from 'request';
import * as log from './logger';
import apiUrl from '../config/apiUrl';

/**
 * Function to make http request using axios.
 * 
 * @param {string} methodType
 * @param {string} url
 * @param {object} userId
 * @param {object} data
 */
export async function req(methodType,url,data)
{
    
    let header={
        "content-type":"application/json",
    }

    const options={
        uri:url,
        method:methodType.toUpperCase(),
        body:data,
        headers:header,
        json:true
        // Have to check do we need cancelToken
        // cancelToken:new cancelToken(function executor(cancelFunc){})
    }
    
    log.info(JSON.stringify(options));
    const response=await call(options);
    
    return response;
}



/**
 * Function to make  request.
 * 
 * @param {string} options
 */
function call(options)
{
    return new Promise((resolve, reject) => {
        request(options, (error, response) => {          
          if (error) {
              log.error(error);
            reject(error)
          }
          resolve(response.body);
        });
      });
}

