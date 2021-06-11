import { mlog } from "@/core/libs/utils";
import redis from 'redis'


const routesHelper: any = {};

/**
 * Allows only request coming with a token authorization
 * @member allowOnlyIfAuthorized
 * @function
 */
routesHelper.allowOnlyIfAuthorized = () => {
    function checkRequestOrigin(req: { headers: { referer: any; }; get: (arg0: string) => any; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { message: string; }): void; new(): any; }; }; }, next: () => void) {
        if (req.headers.referer)
            return next();

        const headerToken = req.get("token");
        if (!(headerToken === process.env.TOKEN)) {
            res.status(403).json({ message: "No token in headers" });
            return;
        }
        next();
    }

    return checkRequestOrigin;
};
/**
 * Define the number of requests launched per user in 1 minute. 
 * @member rateLimiter
 * @function
 */

routesHelper.rateLimiter = (client: redis.RedisClient) => {
    function checkIfAuthorized(req: { headers: { [x: string]: any; }; connection: { remoteAddress: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { message: string; requests: number; ttl: number; }): void; new(): any; }; }; }, next: () => void) {
        let ttl
        // address ip of each user
        const ip = (req.headers["x-forwarded-for"] || req.connection.remoteAddress).slice(0, 9)
        // return error message if user has launched 10 requests per minute 
        return client.incr(ip, function (err, value) {
            if (err) mlog(err.message, "error")
            if (value === 1) {
                client.expire(ip, 60)
                ttl = 60
                next()
            } else {
                client.ttl(ip, (err, valutTtl) => {
                    if (err) mlog(err.message, "error")
                    ttl = valutTtl
                    if (value >= 10 && ttl !== 0) {
                        res.status(429).json({ message: "Too Many requests", requests: value, ttl });
                    } else {
                        next()
                    }
                })
            }
        })
    }
    return checkIfAuthorized
}

module.exports = routesHelper