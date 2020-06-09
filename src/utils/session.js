const logger = require('./logger').getLogger(__filename);
const hash = require('xxhashjs');
const redis = require('./redisClient');
const uid = require("uid-safe");

var session = () => { };

session.get = (req, res, next) => {
    var _S = req.signedCookies._s;
    if (!_S) {
        _S = uid.sync(16);
        logger.info("Session " + _S);
        //res.cookie("_s", _S, {expires: new Date(Date.now + 900000), httpOnly:true, signed:true});
        res.cookie("_s", _S, { httpOnly: true, signed: true });
        redis.set(_S, JSON.stringify({ "key": _S }));
    }
    redis.get(_S, (e, v) => {
        if (e)
            logger.error("session read error - " + e.message);
        v = v || JSON.stringify({ "key": _S });
        req.sessionHash = hash.h32(v, 0xABCD).toString(16);
        req.session = JSON.parse(v);
        next();
    });
};

session.set = (req, res, next) => {
    var v = JSON.stringify(req.session);
    var h = hash.h32(v, 0xABCD).toString(16);
    if (req.sessionHash != h) {
        redis.set(req.session.key, v);
    }
    next();
};

module.exports = session;