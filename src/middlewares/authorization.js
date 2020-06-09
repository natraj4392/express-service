import jwt from 'jsonwebtoken';
import * as log from './../utils/logger';
import url from '../config/apiUrl';
import fs from 'fs';
/**
 * Function to authorize the request.
 * 
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
export default async function authorize(req, res, next) {

    // De-serialize Request Headers
    log.info("Autorization Start")
    const encryptedToken = req.get('Authorization');
    const reqUser = req.get('From');
    const reqTime = req.get('Delivery-Date');
    const jwtid = req.get('X-Correlation-ID');
    const appName = req.get('Application');
  
    const msg = {
        message: "Authorization Error:  No token provided"
    };
    const options = { expiresIn: 900, algorithm: "RS512" };
   
    if (process.env.NODE_ENV === "ci"||process.env.NODE_ENV === "CI" || process.env.NODE_ENV === undefined) {

        next();

        return true;
    }

    if (req.url.includes('swagger.json')) {

        next();

        return true;
    }
    const publicKey = fs.readFileSync('..' +  process.env.FUSE_UI_RSA_PUBLIC_KEY);
    const token = encryptedToken.replace("Bearer ", "");

    if (!encryptedToken && reqUser && reqTime && jwtid) {

        res.status(401).send(msg);
        log.error("Authorization Error:  No token provided.");

        return Promise.reject({
            code: "401"
        });

    } else {
        return jwt.verify(token, publicKey, options, (err, decryptedPayload) => {
            if (err) {
                log.error(JSON.stringify(err))
                req.authenticated = false;
                req.decoded = null;
                log.error("Authorization Error: Failed to authenticate token");

                return Promise.reject({
                    code: "500"
                });
            } else {

                let originalPayload = {
                    jwtid: jwtid, // Unique identifier
                    issuer: appName, // Invoking Application
                    userId: reqUser,
                    issuedAt: "" + parseInt(reqTime)
                  };
                // Remove the ExpiredIn key from the decryptedPayload object
                delete decryptedPayload.exp;
                // Authenticate the Payload
                decryptedPayload.issuedAt = "" + decryptedPayload.issuedAt;
      
                // Authenticate the Payload     
                let ret = true;

                for (var i in originalPayload) {
                    if (!decryptedPayload.hasOwnProperty(i) || originalPayload[i] !== decryptedPayload[i]) {
                        ret = false;
                    }
                }

                if (ret) {
                    log.info("Authorization Successfull.");
                    next();
                }
                else {
                    req.authenticated = false;
                    req.decoded = null;
                    log.error("Authorization Error: Payload iisue");

                    return Promise.reject({
                        code: "500"
                    });
                }
            }

        });
    }
}