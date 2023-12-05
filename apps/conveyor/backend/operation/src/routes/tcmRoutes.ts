import { Router, Request } from 'express';
import proxy from 'express-http-proxy';

import logger from '../libs/logger';

const router: Router = Router();

function selectedTCM(req:Request) : string {
    const defaultHost = 'http://127.0.0.1:5000';
    try {
        if (!req.query.address) {
            throw new Error('Unauthorized: No address provided');
        }
        const host = `http://${req.query.address}:${req.query.port ? req.query.port : '5000'}`;
        return host;
    } catch (error) {
        logger.error(`selectedTCM Error: ${error}`);
        return defaultHost;
    }
}

router.use(
    '/api/tcm/',
    proxy(selectedTCM, {
        memoizeHost: false,
        reqBodyEncoding: null,
        proxyReqPathResolver: (req: Request) => {
            const parts = req.url.split('?');
            let queryString = '';
            if (parts.length > 1) {
                queryString = parts.slice(1).join('&');
            }
            const updatedPath = `/api${parts[0]}`;
            return `${updatedPath}${queryString ? `?${queryString}` : ''}`;
        },
        limit: '50mb',
    })
);

export default router;
