import NodeCache from 'node-cache';
import {cacheConfig} from './../config/cacheConfig';
import * as log from './../utils/logger';

/**
 * Function to cache the request.
 * 
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */

var cache = new NodeCache();
const keyValue = cacheConfig().cacheKey;

export default function nodeCache(req,res,next) {
    cache.get(keyValue+req.originalUrl,function(err,value) {
        if (!err) {
            if (value === undefined) {
                log.info("Cache not found")
                res.sendResponse = res.json
                res.json = (body) => {
                    cache.set(keyValue+req.originalUrl,body,cacheConfig().cacheTTL,function(err,success) {
                        if (!err) {
                            res.sendResponse(body)
                            log.info("Cache set - New value")
                        }
                    })
                }
                next();
            } else {
                log.info("Cache return - Success")
                res.send(value);
            }
        } else {
            log.error("Cache fetch - Error")
            next();
        }
    })
}