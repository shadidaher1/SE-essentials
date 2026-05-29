import  config  from './config';
import express from 'express';
import logger from './util/logger';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import cors from 'cors';
import requestLogger from './middleware/requestLogger';
import routes from './routes';
import { ApiException } from './util/exceptions/ApiException';
import { AnalyticsService } from './services/Analytics.service';
import e from 'express';

const app = express();
const analyticsService = new AnalyticsService();

const runAnalytics = async (): Promise<void> => {
  try {
    const totalOrders = await analyticsService.getTotalOrderCount();
    const orderCounts = await analyticsService.getOrderCountByType();
    const totalRevenue = await analyticsService.getTotalRevenue();
    const revenueByType = await analyticsService.getRevenueByType();

    logger.info('Analytics results: totalOrders=%d orderCounts=%o totalRevenue=%f revenueByType=%o',
      totalOrders,
      orderCounts,
      totalRevenue,
      revenueByType
    );
  } catch (error) {
    logger.error('Analytics execution failed: %s', (error as Error).message);
  }
};

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
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err instanceof ApiException) {
    const apiError = err as ApiException;
    logger.error('API Error of status %d: %s', apiError.status, apiError.message);
    res.status(apiError.status).json({ error: apiError.message });
  }
  else {
    logger.error('Unexpected error: %s', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(config.port, config.host, () => {
  logger.info(`Server is running on http://${config.host}:${config.port}`);
  void runAnalytics();
});

