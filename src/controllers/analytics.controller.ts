import { Request, Response } from "express";
import { AnalyticsService } from "../services/Analytics.service";
import logger from "../util/logger";

export class AnalyticsController {
    constructor(private readonly analyticsService: AnalyticsService) {}

    /**
     * Get the total count of all orders across all item types
     * GET /analytics/orders/total
     */
    public async getTotalOrderCount(req: Request, res: Response): Promise<void> {
        try {
            const totalCount = await this.analyticsService.getTotalOrderCount();
            
            res.status(200).json({
                message: "Total order count retrieved successfully",
                data: {
                    totalCount: totalCount
                }
            });
        } catch (error) {
            logger.error("Error retrieving total order count: %s", (error as Error).message);
            throw error;
        }
    }

    /**
     * Get the count of orders grouped by item type (CAKE, BOOK, TOY)
     * GET /analytics/orders/by-type
     */
    public async getOrderCountByType(req: Request, res: Response): Promise<void> {
        try {
            const orderCounts = await this.analyticsService.getOrderCountByType();
            
            res.status(200).json({
                message: "Order counts by type retrieved successfully",
                data: {
                    counts: orderCounts
                }
            });
        } catch (error) {
            logger.error("Error retrieving order counts by type: %s", (error as Error).message);
            throw error;
        }
    }

    /**
     * Get the total revenue across all orders
     * GET /analytics/revenue/total
     */
    public async getTotalRevenue(req: Request, res: Response): Promise<void> {
        try {
            const totalRevenue = await this.analyticsService.getTotalRevenue();
            
            res.status(200).json({
                message: "Total revenue retrieved successfully",
                data: {
                    totalRevenue: totalRevenue
                }
            });
        } catch (error) {
            logger.error("Error retrieving total revenue: %s", (error as Error).message);
            throw error;
        }
    }

    /**
     * Get the revenue breakdown grouped by item type (CAKE, BOOK, TOY)
     * GET /analytics/revenue/by-type
     */
    public async getRevenueByType(req: Request, res: Response): Promise<void> {
        try {
            const revenueByType = await this.analyticsService.getRevenueByType();
            
            res.status(200).json({
                message: "Revenue by type retrieved successfully",
                data: {
                    revenue: revenueByType
                }
            });
        } catch (error) {
            logger.error("Error retrieving revenue by type: %s", (error as Error).message);
            throw error;
        }
    }
}
