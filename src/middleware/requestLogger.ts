import { Request, Response, NextFunction } from 'express';
import logger from '../util/logger';


const requestLogger = (req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();
    res.on('finish', () => {
        const responseTime = Date.now() - startTime;
        const status = res.statusCode;
        let level = 'info';
        if (status >= 500) {
            level = 'error';
        }
        if (status >= 400) {
            level = 'warn';
        }
        const { method, originalUrl } = req;
        logger.log({level, message: `${method} ${originalUrl} ${status} ${responseTime}ms`});
    });
        next();
};

export default requestLogger;