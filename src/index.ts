import  config  from './config';
import express, { NextFunction, Request, Response } from 'express';
import logger from './util/logger';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import cors from 'cors';
import requestLogger from './middleware/requestLogger';
import routes from './routes';
import { AnalyticsService } from './services/Analytics.service';
import e from 'express';
import { HttpException } from './util/exceptions/http/HttpException';
import { Http } from 'winston/lib/winston/transports';

const app = express();
// const analyticsService = new AnalyticsService();

// const runAnalytics = async (): Promise<void> => {
//   try {
//     const totalOrders = await analyticsService.getTotalOrderCount();
//     const orderCounts = await analyticsService.getOrderCountByType();
//     const totalRevenue = await analyticsService.getTotalRevenue();
//     const revenueByType = await analyticsService.getRevenueByType();

//     logger.info('Analytics results: totalOrders=%d orderCounts=%o totalRevenue=%f revenueByType=%o',
//       totalOrders,
//       orderCounts,
//       totalRevenue,
//       revenueByType
//     );
//   } catch (error) {
//     logger.error('Analytics execution failed: %s', (error as Error).message);
//   }
// };

// config helmet
app.use(helmet());

// config body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// config cors

app.use(cors());

// add middleware
app.use(requestLogger);

//  config routes
app.use('/',routes);


// config 404 handler
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.status(404).json({ error: 'Not Found' });
});

// config error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof HttpException) {
        const httpException = err as HttpException;
        logger.error("%s %s %s", httpException.name, httpException.status, httpException.message);
        res.status(httpException.status).json({
            message: httpException.message,
            details: httpException.details || undefined
        });
    } else {
        logger.error("Unhandled Error: %s", err.message);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
});
app.listen(config.port, config.host, () => {
  logger.info(`Server is running on http://${config.host}:${config.port}`);
  // void runAnalytics();
});

