import { mlog } from "@/core/libs/utils";

const routesHelper: any = {};

/**
 * Allows only request coming with a token authorization
 * @member allowOnlyIfAuthorized
 * @function
 */
routesHelper.allowOnlyIfAuthorized = () => {
    function checkRequestOrigin(req: { headers: { referer: any; }; get: (arg0: string) => any; }, res: { sendStatus: (arg0: number) => void; }, next: () => void) {
        if (req.headers.referer)
            return next();

        const headerToken = req.get("token");
        if (!(headerToken === process.env.TOKEN)) {
            mlog("403 : no token in headers", "warning")
            res.sendStatus(403);
            return;
        }
        next();
    }

    return checkRequestOrigin;
};

module.exports = routesHelper