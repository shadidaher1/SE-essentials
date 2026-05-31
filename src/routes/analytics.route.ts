import { Router } from "express";
import { AnalyticsService } from "../services/Analytics.service";
import { AnalyticsController } from "../controllers/analytics.controller";
import { asyncHandler } from "../middleware/asyncHandler";

const analyticsService = new AnalyticsService();
const analyticsController = new AnalyticsController(analyticsService);

const routes = Router();

// Order volume endpoints
routes.get("/orders/total", asyncHandler(analyticsController.getTotalOrderCount.bind(analyticsController)));
routes.get("/orders/by-type", asyncHandler(analyticsController.getOrderCountByType.bind(analyticsController)));

// Revenue endpoints
routes.get("/revenue/total", asyncHandler(analyticsController.getTotalRevenue.bind(analyticsController)));
routes.get("/revenue/by-type", asyncHandler(analyticsController.getRevenueByType.bind(analyticsController)));

export default routes;
